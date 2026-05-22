/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} date - ISO date (YYYY-MM-DD)
 * @property {string} time - HH:mm
 * @property {string} location
 * @property {string} sport
 * @property {string} hostUsername
 * @property {string} createdAt - ISO timestamp
 */

/**
 * @param {Partial<Event>} data
 * @returns {Event}
 */
export function createEventRecord(data) {
  return {
    id: data.id ?? crypto.randomUUID(),
    title: data.title ?? '',
    description: data.description ?? '',
    date: data.date ?? '',
    time: data.time ?? '',
    location: data.location ?? '',
    sport: data.sport ?? '',
    hostUsername: data.hostUsername ?? 'anonymous',
    createdAt: data.createdAt ?? new Date().toISOString(),
  };
}
