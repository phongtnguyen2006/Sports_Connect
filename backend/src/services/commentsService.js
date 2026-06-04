import { getSupabase } from "../config/supabase.js";

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