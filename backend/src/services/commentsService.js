import { getSupabase } from "../config/supabase.js";

function toEventComment(row, rsvpdUserIds, usernamesByUserId) {
  return {
    eventId: row.event_id,
    userId: row.user_id,
    username: usernamesByUserId.get(row.user_id) ?? null,
    message: row.message,
    created_at: row.created_at,
    is_rsvpd: rsvpdUserIds.has(row.user_id),
  };
}

export async function getEventComments(eventId) {
  const supabase = getSupabase();

  const [commentsResult, rsvpsResult] = await Promise.all([
    supabase
      .from('event_comments')
      .select('event_id, user_id, message, created_at')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true }),
    supabase
      .from('event_rsvps')
      .select('user_id')
      .eq('event_id', eventId),
  ]);

  if (commentsResult.error) throw commentsResult.error;
  if (rsvpsResult.error) throw rsvpsResult.error;

  const rsvpdUserIds = new Set(
    rsvpsResult.data.map((rsvp) => rsvp.user_id)
  );

  const userIds = [
    ...new Set(commentsResult.data.map((comment) => comment.user_id)),
  ];

  const usersResult = userIds.length > 0
    ? await supabase
      .from('users')
      .select('id, username')
      .in('id', userIds)
    : { data: [], error: null };

  if (usersResult.error) throw usersResult.error;

  const usernamesByUserId = new Map(
    usersResult.data.map((user) => [user.id, user.username])
  );

  return commentsResult.data.map((comment) =>
    toEventComment(comment, rsvpdUserIds, usernamesByUserId)
  );
}

export async function createEventComment(eventId, userId, message) {
  const supabase = getSupabase(); 

  const { data, error } = await supabase
    .from('event_comments')
    .insert({
      event_id: eventId, 
      user_id: userId, 
      message: message
    })
    .select()
    .single();

    if (error) throw error; 
    return data; 
}
