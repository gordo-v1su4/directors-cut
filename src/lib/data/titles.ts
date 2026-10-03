import { mediaApi, ownerToken } from './media-api';

/**
 * The one name a project goes by everywhere in the UI: the show title alone.
 *
 * Generated titles often carry a subtitle ("THE PINK ROOM — Sora 2 vs Seedance
 * 2.0 teaser", "Checkout - Teaser") or arrive in all caps. Display drops the
 * subtitle and sets shouting titles in title case, so every card, row and
 * header reads the same way. The stored title is never changed by this.
 */
export function showTitle(title: string | undefined | null): string {
  const raw = (title ?? '').replace(/\s*\([^)]*\)/g, '').trim();
  if (!raw) return 'Untitled';
  const head = raw.split(/\s+[—–-]\s+/)[0].trim() || raw;
  const shouting = head === head.toUpperCase() && /[A-Z]{2}/.test(head);
  return shouting ? titleCase(head) : head;
}

const SMALL_WORDS = new Set(['a', 'an', 'and', 'as', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'vs']);

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/(\s+)/)
    .map((word, index) =>
      /\s/.test(word) || (index > 0 && SMALL_WORDS.has(word)) ? word : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join('');
}

/** Sign in as the owner; the session token lasts a day. */
export async function signInOwner(password: string): Promise<void> {
  const response = await fetch(`${mediaApi}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'gordo', password }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Sign in failed');
  sessionStorage.setItem('trailer-feed-owner', result.token);
}

export class SignInRequired extends Error {}

/** Permanently remove a project after its owner confirms the exact project. */
export async function removeProject(runId: string): Promise<void> {
  const token = ownerToken();
  if (!token) throw new SignInRequired('Sign in to remove this project.');
  const response = await fetch(`${mediaApi}/runs/${encodeURIComponent(runId)}/delete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ confirm_run_id: runId }),
  });
  if (response.status === 401) {
    sessionStorage.removeItem('trailer-feed-owner');
    throw new SignInRequired('Your session expired. Sign in again to remove this project.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Project removal failed');
}

/**
 * Save a project's title and/or logline on the server.
 * Throws SignInRequired when the session is missing or expired.
 */
export async function saveProjectText(
  runId: string,
  changes: { title?: string; logline?: string },
): Promise<{ title?: string; logline?: string }> {
  const token = ownerToken();
  if (!token) throw new SignInRequired('Sign in to save changes to this project.');
  const response = await fetch(`${mediaApi}/runs/${encodeURIComponent(runId)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(changes),
  });
  if (response.status === 401) {
    sessionStorage.removeItem('trailer-feed-owner');
    throw new SignInRequired('Your session expired. Sign in again to save.');
  }
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || 'Save failed');
  return { title: result.run?.title, logline: result.run?.logline };
}
