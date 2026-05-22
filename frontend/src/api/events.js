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
