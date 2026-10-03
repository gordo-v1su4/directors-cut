import { mediaApi, ownerToken } from './media-api';
import { SignInRequired } from './titles';

async function thumbnailRequest(runId: string, suffix: string, file?: File): Promise<void> {
  const token = ownerToken();
  if (!token) throw new SignInRequired('Sign in to edit the project thumbnail.');
  const response = await fetch(`${mediaApi}/runs/${encodeURIComponent(runId)}/thumbnail${suffix}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, ...(file ? { 'Content-Type': file.type } : {}) },
    body: file,
  });
  if (response.status === 401) {
    sessionStorage.removeItem('trailer-feed-owner');
    throw new SignInRequired('Your session expired. Sign in again to edit the thumbnail.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Thumbnail change failed');
}

export function uploadProjectThumbnail(runId: string, file: File): Promise<void> {
  return thumbnailRequest(runId, '', file);
}

export function removeProjectThumbnail(runId: string): Promise<void> {
  return thumbnailRequest(runId, '/remove');
}
