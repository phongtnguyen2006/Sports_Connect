/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user?: object, session?: object }>}
 */
export async function loginUser(credentials) {
  const response = await fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Login failed');
  }
  return data;
}

/**
 * @param {{ email: string, password: string }} credentials
 * @returns {Promise<{ user?: object, session?: object }>}
 */
export async function registerUser(credentials) {
  const response = await fetch('/api/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'registration failed');
  }
  return data;
}

/**
 * @param {object} profileData
 * @param {string} token - Supabase access token (Bearer)
 * @returns {Promise<object>}
 */
export async function completeProfile(profileData, token) {
  const response = await fetch('/api/users/complete-profile', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'profile completion failed');
  }
  return data;
}
