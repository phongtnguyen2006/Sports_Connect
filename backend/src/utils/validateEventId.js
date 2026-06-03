/**
 * @param {unknown} id
 * @returns {{ ok: true, data: number } | { ok: false, error: string }}
 */
export function validateEventId(id) {
  if (typeof id !== 'string' || !id) {
    return { ok: false, error: 'event id is required' };
  }

  if (!/^[1-9]\d*$/.test(id)) {
    return { ok: false, error: 'event id must be a positive whole number' };
  }

  const eventId = Number(id);
  if (!Number.isSafeInteger(eventId)) {
    return { ok: false, error: 'event id is too large' };
  }

  return { ok: true, data: eventId };
}
