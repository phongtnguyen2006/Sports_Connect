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
export async function createEvent(payload, token) {
  if (!token || token.split(".").length !== 3) {
    throw new Error('Invalid login token. Please register or log in again.');
  }
  
  const response = await fetch('/api/events', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
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
 * Fetches events created by the currently logged-in user.
 * @param {string} token
 * @returns {Promise<Event[]>}
 */
export async function fetchMyEvents(token) {
  const response = await fetch('/api/events/my-events', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load user events');
  }

  return data.events ?? [];
}