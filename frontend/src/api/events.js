/** @typedef {import('../types/event.js').Event} Event */

/**
 * @returns {Promise<Event[]>}
 */
export async function fetchEvents() {
  const response = await fetch('/api/events');
  if (!response.ok) {
    throw new Error('Failed to load events');
  }
  const data = await response.json();
  return data.events ?? [];
}

/**
 * @param {Omit<Event, 'id' | 'createdAt'> & Partial<Pick<Event, 'hostUsername'>>} payload
 * @returns {Promise<Event>}
 */
export async function createEvent(payload) {
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to create event');
  }

  const data = await response.json();
  return data.event;
}

/**
 * @param {number} eventId
 * @returns {Promise<Record<string, any>>}
 */
export async function createEventRsvp(eventId) {
  const response = await fetch(`/api/events/${eventId}/rsvp`, {
    method: 'POST',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to RSVP');
  }

  const data = await response.json();
  return data.eventRsvp;
}

/**
 * @param {number} eventId
 * @returns {Promise<Record<string, any>>}
 */
export async function deleteEventRsvp(eventId) {
  const response = await fetch(`/api/events/${eventId}/rsvp`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to remove RSVP');
  }

  const data = await response.json();
  return data.eventRsvp;
}
