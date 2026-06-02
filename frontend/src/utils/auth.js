/**
 * Auth helpers backed by the Supabase access token stored in localStorage.
 */

/**
 * @returns {boolean} true if an access token is present.
 */
export function isAuthenticated() {
  return Boolean(localStorage.getItem('access_token'));
}

/**
 * @returns {string | null} the stored access token, if any.
 */
export function getToken() {
  return localStorage.getItem('access_token');
}

/**
 * Clears the stored access token, logging the user out.
 */
export function logout() {
  localStorage.removeItem('access_token');
}
