// Projects and uploaded versions belong to the server in every environment.
export const mediaApi = 'https://media.v1su4.dev/trailer-feed';
export function catalogUrl(path: string) { return `${mediaApi}${path}`; }
export function ownerToken() {
  const current = sessionStorage.getItem('trailer-feed-owner');
  if (current !== null) return current;
  const legacy = sessionStorage.getItem('directors-cut-owner') || '';
  if (legacy) {
    sessionStorage.setItem('trailer-feed-owner', legacy);
    sessionStorage.removeItem('directors-cut-owner');
  }
  return legacy;
}
