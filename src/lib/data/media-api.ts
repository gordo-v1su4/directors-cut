// Projects and uploaded versions belong to the server in every environment.
export const mediaApi = 'https://media.v1su4.dev/directors-cut';
export function catalogUrl(path: string) { return `${mediaApi}${path}`; }
export function ownerToken() { return sessionStorage.getItem('directors-cut-owner') || ''; }
