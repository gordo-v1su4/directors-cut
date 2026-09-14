export const mediaApi = import.meta.env.PROD ? 'https://media.v1su4.dev/directors-cut' : (import.meta.env.VITE_MEDIA_API_URL || '');
export function catalogUrl(path: string) { return `${mediaApi}${path}`; }
export function ownerToken() { return sessionStorage.getItem('directors-cut-owner') || ''; }
