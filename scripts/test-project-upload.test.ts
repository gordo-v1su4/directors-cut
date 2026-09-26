import { afterEach, beforeEach, expect, test } from 'bun:test';
import { createUploadProject, saveUploadVideo, validateVideos, type UploadVideo } from '../src/lib/create/upload';
import { SignInRequired } from '../src/lib/data/titles';

const originalFetch = globalThis.fetch;
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage');
let calls: { path: string; init?: RequestInit }[];
let replies: Response[];
function json(body: unknown, status = 200) { return Response.json(body, { status }); }
function video(): UploadVideo { return { key: 'clip', file: new File(['video'], 'clip.mp4'), model: 'Camera footage', prompt: '', status: '' }; }

beforeEach(() => {
  calls = []; replies = [];
  const values = new Map([['directors-cut-owner', 'test-session']]);
  Object.defineProperty(globalThis, 'sessionStorage', { configurable: true, value: {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
  } });
  globalThis.fetch = (async (input, init) => {
    calls.push({ path: new URL(String(input)).pathname, init });
    const response = replies.shift();
    if (!response) throw new Error('Unexpected request');
    return response;
  }) as typeof fetch;
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalStorage) Object.defineProperty(globalThis, 'sessionStorage', originalStorage);
  else Reflect.deleteProperty(globalThis, 'sessionStorage');
});

test('rejects empty, unsupported and oversized videos before project creation', () => {
  expect(validateVideos([new File([], 'empty.mp4')])).not.toBe('');
  expect(validateVideos([new File(['data'], 'image.png')])).not.toBe('');
  expect(validateVideos([{ name: 'large.mp4', size: 95_000_001 } as File])).not.toBe('');
  expect(validateVideos(Array.from({ length: 6 }, () => ({ name: 'clip.mp4', size: 95_000_000 } as File)))).not.toBe('');
  expect(validateVideos([video().file])).toBe('');
});

test('creates an upload project, waits for processing and saves optional details', async () => {
  replies = [json({ run: { run_id: 'upload-test' } }, 201), json({ upload_id: 'one', status: 'queued' }, 202), json({ status: 'ready' }), json([{ artifact_id: 'one', context_revision: 2 }]), json({})];
  const input = { request_id: 'a'.repeat(32), title: 'Film', logline: '', format: '', tags: ['test'] };
  const runId = await createUploadProject(input);
  const clip = video();
  await saveUploadVideo(runId, clip);
  expect(clip.done).toBe(true);
  expect(JSON.parse(String(calls[0].init?.body))).toEqual(input);
  expect(JSON.parse(String(calls[4].init?.body))).toEqual({ run_id: runId, prompt: '', video_model: 'Camera footage', revision: 2 });
  expect(calls.every(call => (call.init?.headers as Record<string, string>).Authorization === 'Bearer test-session')).toBe(true);
});

test('partial batch retries do not upload successful files again', async () => {
  const first = video(); first.model = '';
  const second = video(); second.model = '';
  replies = [json({ upload_id: 'one', status: 'ready' }), json({ upload_id: 'two', status: 'queued' }), json({ status: 'failed', error: 'Worker failed' })];
  await saveUploadVideo('project', first);
  await expect(saveUploadVideo('project', second)).rejects.toThrow('Worker failed');
  expect(first.done).toBe(true);
  expect(second.retryProcessing).toBe(true);
  replies = [json({ ok: true }), json({ status: 'ready' })];
  await saveUploadVideo('project', first);
  await saveUploadVideo('project', second);
  expect(second.done).toBe(true);
  expect(calls.filter(call => call.path.endsWith('/versions')).length).toBe(2);
  expect(calls.some(call => call.path.endsWith('/uploads/two/retry'))).toBe(true);
});

test('expired sessions keep upload identity so sign-in can resume polling', async () => {
  const clip = video();
  replies = [json({ upload_id: 'one', status: 'queued' }), json({ error: 'Expired' }, 401)];
  await expect(saveUploadVideo('project', clip)).rejects.toBeInstanceOf(SignInRequired);
  expect(clip.uploadId).toBe('one');
  expect(sessionStorage.getItem('directors-cut-owner')).toBeNull();
});

test('failed details save retries details without reuploading the video', async () => {
  const clip = video();
  replies = [json({ upload_id: 'one', status: 'ready' }), json([{ artifact_id: 'one' }]), json({ error: 'Try again' }, 502)];
  await expect(saveUploadVideo('project', clip)).rejects.toThrow('Try again');
  replies = [json([{ artifact_id: 'one', context_revision: 1 }]), json({})];
  await saveUploadVideo('project', clip);
  expect(clip.done).toBe(true);
  expect(calls.filter(call => call.path.endsWith('/versions')).length).toBe(1);
});
