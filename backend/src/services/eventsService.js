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
 * @param {Record<string, any>} input - validated event fields
 * @returns {Promise<import('../models/event.js').Event>}
 */
export async function createEvent(input) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('events')
    .insert({
      host_id: input.host_id, 
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

export async function createEventRsvp(event) {
  const supabase = getSupabase(); 

  const { data, error } = await supabase
    .from('event_rsvps')
    .insert({
      event_id: event.id,
      user_id: '01d186e7-a62c-4298-8ee0-c12c02c08cd7'
    })
    .select()
    .single();

  if (error) throw error; 
  return data; 
}
