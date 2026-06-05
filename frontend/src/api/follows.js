function getAuthHeaders(includeJson = false) {
  const token = localStorage.getItem("access_token");
  const headers = includeJson ? { "Content-Type": "application/json" } : {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

export async function fetchFollowingByUserId(userId) {
  const response = await fetch(`/api/users/${encodeURIComponent(userId)}/following`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load following");
  }

  return data.following ?? [];
}

export async function fetchFollowersByUserId(userId) {
  const response = await fetch(`/api/users/${encodeURIComponent(userId)}/followers`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load followers");
  }

  return data.followers ?? [];
}

export async function followUser(followingId) {
  const response = await fetch("/api/users/follow", {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ followingId }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to follow user");
  }

  return data;
}

export async function unfollowUser(followingId) {
  const response = await fetch(`/api/users/follow/${encodeURIComponent(followingId)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to unfollow user");
  }

  return data;
}