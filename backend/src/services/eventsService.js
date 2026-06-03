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
  };
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
  return data.map(toEvent);
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
  return toEvent(data);
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
  return toEvent(data);
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
