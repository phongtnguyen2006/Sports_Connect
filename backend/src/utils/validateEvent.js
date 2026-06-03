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
  if (description !== null && description !== undefined && typeof description !== 'string') {
    return { ok: false, error: 'description must be a string or null' };
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

  let normalizedMaxAttendees = null;
  if (max_attendees !== null && max_attendees !== undefined && max_attendees !== '') {
    if (!Number.isInteger(max_attendees) || max_attendees <= 0) {
      return { ok: false, error: 'max_attendees must be a whole number greater than 0 or null' };
    }

    normalizedMaxAttendees = max_attendees;
  }

  return {
    ok: true,
    data: {
      title: title.trim(),
      description: typeof description === 'string' && description.trim() ? description.trim() : null,
      starts_at: trimmedStartsAt,
      ends_at: normalizedEndsAt,
      location: typeof location === 'string' && location.trim() ? location.trim() : null,
      sport: typeof sport === 'string' && sport.trim() ? sport.trim() : null,
      max_attendees: normalizedMaxAttendees,
    },
  };
}
