/**
 * @param {unknown} body
 * @returns {{ ok: true, data: Record<string, any> } | { ok: false, error: string }}
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

  if (!starts_at || typeof starts_at !== 'string' || !starts_at.trim()) {
    return { ok: false, error: 'starts_at is required' };
  }

  const trimmedStartsAt = starts_at.trim();
  const startsAtDate = new Date(trimmedStartsAt);
  if (Number.isNaN(startsAtDate.getTime())) {
    return { ok: false, error: 'starts_at must be a valid datetime' };
  }

  let normalizedEndsAt = null;
  if (ends_at !== null && ends_at !== undefined && ends_at !== '') {
    if (typeof ends_at !== 'string' || !ends_at.trim()) {
      return { ok: false, error: 'ends_at must be a valid datetime or null' };
    }

    normalizedEndsAt = ends_at.trim();
    const endsAtDate = new Date(normalizedEndsAt);
    if (Number.isNaN(endsAtDate.getTime())) {
      return { ok: false, error: 'ends_at must be a valid datetime or null' };
    }

    if (endsAtDate <= startsAtDate) {
      return { ok: false, error: 'ends_at must be after starts_at' };
    }
  }

  return {
    ok: true,
    data: {
      host_id: '01d186e7-a62c-4298-8ee0-c12c02c08cd7', //Test UUID
      title: title.trim(),
      description: description.trim(),
      starts_at: trimmedStartsAt,
      ends_at: normalizedEndsAt,
      location: typeof location === 'string' ? location.trim() : '',
      sport: typeof sport === 'string' ? sport.trim() : '', 
      max_attendees: max_attendees
    },
  };
}
