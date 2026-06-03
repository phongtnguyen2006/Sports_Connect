/**
 *  @param {{ email: string, password: string }} credentials
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
  const formData = new FormData();

  formData.append('firstName', profileData.firstName);
  formData.append('lastName', profileData.lastName);  
  formData.append("username", profileData.username);
  formData.append("biography", profileData.biography|| "");
  formData.append("favoriteSports", JSON.stringify(profileData.favoriteSports));

  if (profileData.profileImage) {
    formData.append('profileImage', profileData.profileImage);
  }
  
  const response = await fetch('/api/users/complete-profile', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'profile completion failed');
  }
  return data;
}

/**
 * Gets the currently logged-in user's profile
 * @param {string} token - Supabase access token (Bearer)
 * @returns {Promise<object>}
 */
export async function getCurrentUserProfile(token){
  const response = await fetch('/api/users/user-data', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load profile data');
  }
  return data.user;
}