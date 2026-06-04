import { getSupabase } from '../config/supabase.js';

/**
 * @param {string} userId
 * @returns {Promise<Set<string>>}
 */
export async function getFriendIds(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId);

  if (error) throw error;
  return new Set((data ?? []).map((row) => row.friend_id));
}

/**
 * @param {string} userId
 * @returns {Promise<Array<Record<string, unknown>>>}
 */
export async function getFriendsForUser(userId) {
  const supabase = getSupabase();
  const { data: friendRows, error: friendsError } = await supabase
    .from('friends')
    .select('friend_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (friendsError) throw friendsError;
  if (!friendRows?.length) return [];

  const friendIds = friendRows.map((row) => row.friend_id);
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, username, firstName, lastName, profile_image, biography, favorite_sports')
    .in('id', friendIds);

  if (usersError) throw usersError;

  const usersById = new Map((users ?? []).map((user) => [user.id, user]));
  return friendIds
    .map((friendId) => usersById.get(friendId))
    .filter(Boolean);
}

/**
 * @param {string} userId
 * @param {string} friendId
 */
export async function addFriend(userId, friendId) {
  if (userId === friendId) {
    throw new Error('You cannot add yourself as a friend');
  }

  const supabase = getSupabase();

  const { data: friendProfile, error: profileError } = await supabase
    .from('users')
    .select('id')
    .eq('id', friendId)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!friendProfile) {
    throw new Error('User not found');
  }

  const { data: existing, error: existingError } = await supabase
    .from('friends')
    .select('friend_id')
    .eq('user_id', userId)
    .eq('friend_id', friendId)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing) {
    throw new Error('Already friends');
  }

  const { error } = await supabase.from('friends').insert({
    user_id: userId,
    friend_id: friendId,
  });

  if (error) throw error;
}

/**
 * @param {string} userId
 * @param {string} friendId
 */
export async function removeFriend(userId, friendId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('friends')
    .delete()
    .eq('user_id', userId)
    .eq('friend_id', friendId)
    .select('friend_id')
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new Error('Friendship not found');
  }
}
