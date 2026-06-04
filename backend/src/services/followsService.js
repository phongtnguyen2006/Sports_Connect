import { getSupabase, getSupabaseAdmin } from '../config/supabase.js';

/**
 * @param {string[]|null|undefined} following
 * @returns {string[]}
 */
function normalizeFollowing(following) {
  return Array.isArray(following) ? following : [];
}

/**
 * @param {string} userId
 * @returns {Promise<Set<string>>}
 */
export async function getFollowingIds(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('following')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw error;
  return new Set(normalizeFollowing(data?.following));
}

/**
 * @param {string} userId
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function getFollowingForUser(userId) {
  const followingIds = [...(await getFollowingIds(userId))];
  if (followingIds.length === 0) return [];

  const supabase = getSupabase();
  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, firstName, lastName, profile_image, biography, favorite_sports')
    .in('id', followingIds);

  if (error) throw error;

  const usersById = new Map((users ?? []).map((user) => [user.id, user]));
  return followingIds
    .map((followingId) => usersById.get(followingId))
    .filter(Boolean);
}

/**
 * @param {string} followerId
 * @param {string} followingId
 */
export async function followUser(followerId, followingId) {
  if (followerId === followingId) {
    throw new Error('You cannot follow yourself');
  }

  const supabase = getSupabase();
  const supabaseAdmin = getSupabaseAdmin();

  const { data: targetUser, error: profileError } = await supabase
    .from('users')
    .select('id')
    .eq('id', followingId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!targetUser) {
    throw new Error('User not found');
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from('users')
    .select('following')
    .eq('id', followerId)
    .maybeSingle();

  if (currentUserError) throw currentUserError;
  if (!currentUser) {
    throw new Error('Profile not found');
  }

  const following = normalizeFollowing(currentUser.following);
  if (following.includes(followingId)) {
    throw new Error('Already following');
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ following: [...following, followingId] })
    .eq('id', followerId);

  if (error) throw error;
}

/**
 * @param {string} followerId
 * @param {string} followingId
 */
export async function unfollowUser(followerId, followingId) {
  const supabase = getSupabase();
  const supabaseAdmin = getSupabaseAdmin();

  const { data: currentUser, error: currentUserError } = await supabase
    .from('users')
    .select('following')
    .eq('id', followerId)
    .maybeSingle();

  if (currentUserError) throw currentUserError;
  if (!currentUser) {
    throw new Error('Profile not found');
  }

  const following = normalizeFollowing(currentUser.following);
  if (!following.includes(followingId)) {
    throw new Error('Follow not found');
  }

  const { error } = await supabaseAdmin
    .from('users')
    .update({ following: following.filter((id) => id !== followingId) })
    .eq('id', followerId);

  if (error) throw error;
}
