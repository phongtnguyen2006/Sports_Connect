/**
 * @param {unknown} body
 * @returns {{ ok: true, data: Record<string, string> } | { ok: false, error: string }}
 */
export function validateEventBody(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object' };
  }

  const { title, description, date, time, location, sport } = body;

  if (!title || typeof title !== 'string' || !title.trim()) {
    return { ok: false, error: 'title is required' };
  }
  if (!description || typeof description !== 'string' || !description.trim()) {
    return { ok: false, error: 'description is required' };
  }
  if (!date || typeof date !== 'string') {
    return { ok: false, error: 'date is required' };
  }
  if (!time || typeof time !== 'string') {
    return { ok: false, error: 'time is required' };
  }

  return {
    ok: true,
    data: {
      title: title.trim(),
      description: description.trim(),
      date,
      time,
      location: typeof location === 'string' ? location.trim() : '',
      sport: typeof sport === 'string' ? sport.trim() : ''
    },
  };
}
