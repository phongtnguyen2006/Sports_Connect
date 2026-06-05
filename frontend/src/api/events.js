import { getAuthHeaders } from '../../utils/getAuthHeaders.js';


/** @typedef {import('../types/event.js').Event} Event */
/**
 * @returns {Promise<Event[]>}
 */
export async function fetchEvents() {
  const response = await fetch('/api/events', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to load events');
  }
  const data = await response.json();
  return data.events ?? [];
}

/**
 * @param {Omit<Event, 'id' | 'createdAt'> & Partial<Pick<Event, 'hostUsername'>>} payload
 * @param {string} token
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
      Authorization: `Bearer ${token}`,
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
 * @param {number} eventId
 * @returns {Promise<Record<string, any>>}
 */
export async function createEventRsvp(eventId) {
  const response = await fetch(`/api/events/${eventId}/rsvp`, {
    method: 'POST',
    headers: getAuthHeaders(),
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error ?? 'Failed to remove RSVP');
  }

  const data = await response.json();
  return data.eventRsvp;
}

/**
 * @param {number} eventId
 * @returns {Promise<Array<Record<string, any>>>}
 */
export async function fetchEventRsvpUsers(eventId) {
  const response = await fetch(`/api/events/${eventId}/rsvps`, {
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load attendees');
  }

  return data.users ?? [];
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

/**
 * Fetches RSVP records/count for the currently logged-in user.
 * @returns {Promise<{ rsvps: Array<{ event_id: number }>, count: number }>}
 */

export async function fetchMyRsvps() {
  const response = await fetch('/api/events/my-rsvps', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load user RSVPs');
  }

  return {
    rsvps: data.rsvps ?? [],
    count: data.count ?? 0,
  };
}

/**
 * Fetches full event data for events the current user has RSVP'd to.
 * @returns {Promise<Event[]>}
 */
export async function fetchJoinedEvents() {
  const response = await fetch('/api/events/joined-events', {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? 'Failed to load joined events');
  }

  return data.events ?? [];
}

/**
 * Fetches events created by a specific user.
 * @param {string} userId
 * @returns {Promise<Event[]>}
 */
export async function fetchEventsByUserId(userId) {
  const response = await fetch(`/api/events/user/${userId}`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load user events");
  }

  return data.events ?? [];
}

/**
 * Fetches events joined by a specific user.
 * @param {string} userId
 * @returns {Promise<{ events: Event[], count: number }>}
 */
export async function fetchJoinedEventsByUserId(userId) {
  const response = await fetch(`/api/events/user/${userId}/joined`);

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error ?? "Failed to load joined events");
  }

  return {
    events: data.events ?? [],
    count: data.count ?? 0,
  };
}
