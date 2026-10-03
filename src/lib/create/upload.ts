import { mediaApi, ownerToken } from '$lib/data/media-api';
import { SignInRequired } from '$lib/data/titles';

export interface UploadVideo {
  key: string;
  file: File;
  model: string;
  prompt: string;
  status: string;
  uploadId?: string;
  retryProcessing?: boolean;
  ready?: boolean;
  done?: boolean;
}

export function validateVideos(files: File[]): string {
  if (files.some(file => !/\.(mp4|mov|webm)$/i.test(file.name) || !file.size || file.size > 95_000_000)) {
    return 'Choose MP4, MOV or WebM videos, each between 1 byte and 95 MB.';
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > 500 * 1024 * 1024) return 'Choose up to 500 MB of videos at a time.';
  return '';
}

async function api(path: string, init: RequestInit = {}) {
  const token = ownerToken();
  if (!token) throw new SignInRequired('Sign in to create your project and upload videos.');
  const response = await fetch(`${mediaApi}${path}`, { ...init, headers: { ...init.headers, Authorization: `Bearer ${token}` } });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401) {
    sessionStorage.removeItem('trailer-feed-owner');
    throw new SignInRequired('Your session expired. Sign in to continue; your selected files are still here.');
  }
  if (!response.ok) throw new Error(result.error || `Could not save (${response.status}). Please retry.`);
  return result;
}

export async function createUploadProject(input: { request_id: string; title: string; logline: string; format: string; tags: string[] }): Promise<string> {
  const result = await api('/runs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
  return result.run.run_id;
}

/** Keep each upload's identity across retries, including a partial batch. */
export async function saveUploadVideo(runId: string, video: UploadVideo) {
  if (video.done) return;
  if (video.retryProcessing && video.uploadId) {
    video.status = 'Retrying processing…';
    await api(`/uploads/${video.uploadId}/retry`, { method: 'POST' });
    video.retryProcessing = false;
  }
  if (!video.uploadId) {
    video.status = 'Uploading…';
    const result = await api('/versions', { method: 'POST', headers: { 'Content-Type': 'application/octet-stream', 'X-Run-Id': runId, 'X-Filename': encodeURIComponent(video.file.name) }, body: video.file });
    video.uploadId = result.upload_id;
    if (result.status === 'failed') {
      video.retryProcessing = true;
      throw new Error(result.error || 'Video processing failed. Retry to continue.');
    }
    video.ready = result.status === 'ready';
    // A legacy duplicate has no upload ID; it already exists in the project.
    if (!video.uploadId && video.ready) { video.done = true; video.status = 'Already imported'; return; }
    if (!video.uploadId) throw new Error('The upload returned no tracking ID. Please retry.');
  }
  if (!video.ready) {
    video.status = 'Creating thumbnail…';
    for (let attempt = 0; attempt < 180; attempt++) {
      const result = await api(`/uploads/${video.uploadId}`);
      if (result.status === 'ready') { video.ready = true; break; }
      if (result.status === 'failed') {
        video.retryProcessing = true;
        throw new Error(result.error || 'Video processing failed. Retry to continue.');
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    if (!video.ready) throw new Error('Processing is still running. Continue to check again; your video is saved.');
  }
  if (video.model.trim() || video.prompt.trim()) {
    video.status = 'Saving video details…';
    // Read the current revision so a lost save response can be retried safely.
    const artifacts = await api(`/data/comparisons/${encodeURIComponent(runId)}/artifacts.json`);
    const artifact = artifacts.find((item: { artifact_id: string }) => item.artifact_id === video.uploadId);
    if (!artifact) throw new Error('Video details are not available yet. Continue to try again.');
    await api(`/versions/${video.uploadId}/details`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ run_id: runId, prompt: video.prompt, video_model: video.model, revision: artifact.context_revision ?? 0 }) });
  }
  video.done = true;
  video.status = 'Ready';
}
