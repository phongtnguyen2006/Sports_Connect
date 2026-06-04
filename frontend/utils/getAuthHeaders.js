export function getAuthHeaders(includeJson = false) {
  const token = localStorage.getItem('access_token');
  const headers = includeJson ? { 'Content-Type': 'application/json' } : {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}