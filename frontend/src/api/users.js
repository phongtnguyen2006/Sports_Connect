/** @typedef {import('../types/user.js').UserProfile} UserProfile */

function getAuthHeaders() {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * @param {string} query
 * @returns {Promise<UserProfile[]>}
 */
export async function searchUsers(query) {
  const params = new URLSearchParams({ q: query });
  const response = await fetch(`/api/users/search?${params}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to search users');
  }

  return data.users ?? [];
}

/**
 * @returns {Promise<UserProfile[]>}
 */
export async function fetchFollowing() {
  const response = await fetch('/api/users/following', {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load following');
  }

  return data.following ?? [];
}

/**
 * @param {string} followingId
 */
export async function followUser(followingId) {
  const response = await fetch('/api/users/follow', {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ followingId }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to follow user');
  }
}

/**
 * @param {string} followingId
 */
export async function unfollowUser(followingId) {
  const response = await fetch(`/api/users/follow/${encodeURIComponent(followingId)}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to unfollow user');
  }
}

/**
 * @param {string} username
 * @returns {Promise<UserProfile>}
 */
export async function getUserByUsername(username) {
  const response = await fetch(`/api/users/${encodeURIComponent(username)}`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load profile');
  }

  return data.profile;
}

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

/**
 * Gets a public user profile by username.
 * @param {string} username
 * @returns {Promise<object>}
 */
export async function getUserProfileByUsername(username) {
  const response = await fetch(`/api/users/${username}`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load user profile");
  }

  return data.profile;
}