import { createEventRecord } from '../models/event.js';

/** @type {import('../models/event.js').Event[]} */
export const seedEvents = [
  createEventRecord({
    id: 'evt-001',
    title: 'Looking for pickup basketball tonight',
    description:
      'Need two more players for a friendly 5v5 run at 7 PM. All skill levels welcome.',
    date: '2026-05-12',
    time: '19:00',
    location: 'Westwood Rec Center',
    sport: 'Basketball',
    hostUsername: 'johndoe',
    createdAt: '2026-05-10T14:00:00.000Z',
  }),
  createEventRecord({
    id: 'evt-002',
    title: 'Morning tennis rally',
    description:
      'Had a great hitting session and found a new doubles partner through Sports Connect.',
    date: '2026-05-08',
    time: '08:30',
    location: 'UCLA Tennis Courts',
    sport: 'Tennis',
    hostUsername: 'janedoe',
    createdAt: '2026-05-07T09:15:00.000Z',
  }),
  createEventRecord({
    id: 'evt-003',
    title: 'Weekend soccer group',
    description:
      'Starting a casual Sunday soccer group. Comment if you want to join next week.',
    date: '2026-05-03',
    time: '10:00',
    location: 'Drake Stadium',
    sport: 'Soccer',
    hostUsername: 'alexk',
    createdAt: '2026-05-01T16:30:00.000Z',
  }),
];
