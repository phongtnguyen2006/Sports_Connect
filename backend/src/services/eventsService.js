import { getSupabase } from '../config/supabase.js';

/**
 * Maps a Supabase `events` row (snake_case columns) to the API shape
 * (camelCase) that the frontend already consumes.
 *
 * @param {Record<string, any>} row
 * @returns {import('../models/event.js').Event}
 */
function toEvent(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    date: row.date,
    time: row.time,
    location: row.location ?? '',
    sport: row.sport ?? '',
    hostUsername: row.host_username ?? 'anonymous',
    createdAt: row.created_at,
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
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data.map(toEvent);
}

/**
 * @param {Record<string, string>} input - validated event fields (camelCase)
 * @returns {Promise<import('../models/event.js').Event>}
 */
export async function createEvent(input) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('events')
    .insert({
      title: input.title,
      description: input.description,
      date: input.date,
      time: input.time,
      location: input.location || null,
      sport: input.sport || null,
      host_username: input.hostUsername,
    })
    .select()
    .single();

  if (error) throw error;
  return toEvent(data);
}
