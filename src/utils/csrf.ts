export const getCsrfToken = (): string | null => {
  if (typeof document === 'undefined' || !document.cookie) {
    return null;
  }
  const cookie = document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('csrf-token='));
  return cookie ? cookie.split('=')[1] : null;
};
