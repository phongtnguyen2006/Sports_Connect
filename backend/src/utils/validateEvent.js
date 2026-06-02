/**
 * @param {unknown} body
 * @returns {{ ok: true, data: Record<string, string> } | { ok: false, error: string }}
 */
export function validateEventBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  const { title, description, starts_at, ends_at, location, sport, max_attendees } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return { ok: false, error: 'title is required' };
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return { ok: false, error: 'description is required' };
  }
  //TODO validation for starts_at, ends_at

  return {
    ok: true,
    data: {
      host_id: '01d186e7-a62c-4298-8ee0-c12c02c08cd7', //Test UUID
      title: title.trim(),
      description: description.trim(),
      starts_at: starts_at, 
      ends_at: ends_at,
      location: typeof location === 'string' ? location.trim() : '',
      sport: typeof sport === 'string' ? sport.trim() : '', 
      max_attendees: max_attendees
    },
  };
}
