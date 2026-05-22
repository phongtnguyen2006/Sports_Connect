import { createEventRecord } from '../models/event.js';
import { seedEvents } from '../data/seedEvents.js';

/** @type {import('../models/event.js').Event[]} */
let events = [...seedEvents];

/**
 * @returns {import('../models/event.js').Event[]}
 */
export function getAllEvents() {
  return [...events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * @param {Partial<import('../models/event.js').Event>} data
 * @returns {import('../models/event.js').Event}
 */
export function addEvent(data) {
  const event = createEventRecord(data);
  events = [event, ...events];
  return event;
}
