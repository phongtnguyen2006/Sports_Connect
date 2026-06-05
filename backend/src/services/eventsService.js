import { getSupabase } from '../config/supabase.js';
import { datetimeLocalToTimestamptz } from '../utils/datetimeLocalToTimestamptz.js';

/**
 * @param {Record<string, any>} row
 * @returns {import('../models/event.js').Event}
 */
function toEvent(row) {
  return {
    id: row.id,
    host_id: row.host_id,
    title: row.title,
    description: row.description ?? null,
    starts_at: row.starts_at,
    ends_at: row.ends_at ?? null,
    location: row.location ?? null,
    sport: row.sport ?? null,
    max_attendees: row.max_attendees ?? null,
    created_at: row.created_at,
    host_username: row.host_username ?? null,
  };
}

/**
 * @param {import('../models/event.js').Event[]} events
 * @returns {Promise<import('../models/event.js').Event[]>}
 */
async function getEventsWithHostUsernames(events) {
  if (events.length === 0) {
    return events;
  }

  const supabase = getSupabase();
  const hostIds = [...new Set(events.map((event) => event.host_id))];

  const { data, error } = await supabase
    .from('users')
    .select('id, username')
    .in('id', hostIds);

  if (error) throw error;

  const usernamesByUserId = new Map(
    (data ?? []).map((user) => [user.id, user.username])
  );

  return events.map((event) => ({
    ...event,
    host_username: usernamesByUserId.get(event.host_id) ?? null,
  }));
}


/**
 * @returns {Promise<import('../models/event.js').Event[]>}
 */
export async function getAllEvents() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('starts_at', { ascending: true });

  if (error) throw error;
  return getEventsWithHostUsernames(data.map(toEvent));
}

/**
 * @param {string} hostId
 * @returns {Promise<import('../models/event.js').Event[]>}
 */
export async function getEventsByHostId(hostId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return getEventsWithHostUsernames(data.map(toEvent));
}


/**
 * Finds one event by its database id.
 *
 * @param {number} id - Validated event id from the route params.
 * @returns {Promise<import('../models/event.js').Event>}
 */
export async function getEventById(id) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  console.log(data);
  const [event] = await getEventsWithHostUsernames([toEvent(data)]);
  return event;
}

/**
 * Finds all RSVP records for a user.
 *
 * @param {string} userId - User id to check for RSVP'd events.
 * @returns {Promise<Array<{ event_id: number }>>}
 */
export async function getUserRsvps(userId) {
  const supabase = getSupabase();
  const { data, error } = await supabase.from('event_rsvps')
    .select('event_id')
    .eq('user_id', userId);

  if (error) throw error; 
  return data;
}


/**
 * Finds all RSVP records for an event.
 *
 * @param {number} eventId - Event id to check for RSVP'd users.
 * @returns {Promise<Record<string, any>[]>}
 */
export async function getEventRsvps(eventId) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('event_rsvps')
    .select('*')
    .eq('event_id', eventId); 

  if (error) throw error; 
  return data; 
}

/**
 * Finds users who RSVP'd to an event.
 *
 * @param {number} eventId - Event id to check for RSVP'd users.
 * @returns {Promise<Array<Record<string, any>>>}
 */
export async function getEventRsvpUsers(eventId) {
  const rsvps = await getEventRsvps(eventId);
  const userIds = rsvps.map((rsvp) => rsvp.user_id);

  if (userIds.length === 0) {
    return [];
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('users')
    .select('id, username, firstName, lastName, profile_image')
    .in('id', userIds);

  if (error) throw error;

  const usersById = new Map((data ?? []).map((user) => [user.id, user]));

  return userIds
    .map((userId) => usersById.get(userId))
    .filter(Boolean);
}

export async function getEventRsvpCount(eventId) {
  const supabase = getSupabase(); 

  const { count, error } = await supabase
    .from('event_rsvps')
    .select('*', {count: 'exact', head: true })
    .eq('event_id', eventId); 

    if (error) throw error; 
    return count ?? 0; 
}

/**
 * Builds RSVP metadata for several events in one query.
 *
 * @param {number[]} eventIds - Event ids to aggregate RSVP data for.
 * @param {string} userId - Authenticated Supabase user id.
 * @returns {Promise<Map<number, { count: number, is_rsvpd: boolean }>>}
 */
export async function getRsvpCountByEventIds(eventIds, userId) {
  if (eventIds.length === 0) {
    return new Map();
  }

  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('event_rsvps')
    .select('event_id, user_id')
    .in('event_id', eventIds);

  if (error) throw error;

  const rsvpMetaByEventId = new Map(
    eventIds.map((eventId) => [
      eventId,
      { count: 0, is_rsvpd: false },
    ])
  );

  for (const rsvp of data) {
    const currentMeta = rsvpMetaByEventId.get(rsvp.event_id) ?? {
      count: 0,
      is_rsvpd: false,
    };

    currentMeta.count += 1;

    if (rsvp.user_id === userId) {
      currentMeta.is_rsvpd = true;
    }

    rsvpMetaByEventId.set(rsvp.event_id, currentMeta);
  }

  return rsvpMetaByEventId;
}

/**
 * @param {Record<string, any>} input - validated event fields
 * @param {string} userId - Authenticated Supabase user id.
 * @returns {Promise<import('../models/event.js').Event>}
 */
export async function createEvent(input, userId) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('events')
    .insert({
      host_id: userId, 
      title: input.title,
      description: input.description,
      starts_at: datetimeLocalToTimestamptz(input.starts_at), 
      ends_at: datetimeLocalToTimestamptz(input.ends_at) || null, 
      location: input.location || null,
      sport: input.sport || null, 
      max_attendees: input.max_attendees
    })
    .select()
    .single();

  if (error) throw error;
  const [event] = await getEventsWithHostUsernames([toEvent(data)]);
  return event;
}

/**
 * Creates an RSVP row for the provided event.
 *
 * @param {import('../models/event.js').Event} event - Existing event being RSVP'd to.
 * @param {string} userId - Authenticated Supabase user id.
 * @returns {Promise<Record<string, any>>}
 */
export async function createEventRsvp(event, userId) {
  const supabase = getSupabase(); 

  const { data, error } = await supabase
    .from('event_rsvps')
    .insert({
      event_id: event.id,
      user_id: userId
    })
    .select()
    .single();

  if (error) throw error; 
  return data; 
}

/**
 * Deletes the current user's RSVP for the provided event id.
 *
 * @param {number} eventId - Validated event id from the route params.
 * @param {string} userId - Authenticated Supabase user id.
 * @returns {Promise<Record<string, any> | null>} Deleted RSVP row, or null if none existed.
 */
export async function deleteEventRsvp(eventId, userId) {
  const supabase = getSupabase(); 

  const { data, error } = await supabase
    .from('event_rsvps')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', userId)
    .select()
    .maybeSingle(); 

    if (error) throw error; 
    return data; 
}

/**
 * Finds all events the user has RSVP'd to.
 *
 * @param {string} userId
 * @returns {Promise<import('../models/event.js').Event[]>}
 */
export async function getJoinedEventsByUserId(userId) {
  const supabase = getSupabase();

  const rsvps = await getUserRsvps(userId);
  const eventIds = rsvps.map((rsvp) => rsvp.event_id);

  if (eventIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .in("id", eventIds)
    .order("starts_at", { ascending: true });

  if (error) throw error;

  return getEventsWithHostUsernames(data.map(toEvent));
}
