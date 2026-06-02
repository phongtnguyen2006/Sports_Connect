import { Router } from 'express';
import { getAllEvents, getEventById, createEvent, createEventRsvp, getUserRsvps } from '../services/eventsService.js';
import { isSupabaseConfigured } from '../config/supabase.js';
import { validateEventBody } from '../utils/validateEvent.js';
import { validateEventId } from '../utils/validateEventId.js';

/**
 * Events use case — backed by the Supabase `events` table.
 * Mounted at /api/events.
 */
const router = Router();

function requireSupabase(res) {
  if (!isSupabaseConfigured()) {
    res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
    return false;
  }
  return true;
}

// GET /api/events
router.get('/', async (_req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const events = await getAllEvents();
    const userRsvps = await getUserRsvps('01d186e7-a62c-4298-8ee0-c12c02c08cd7'); 

    const rsvpedEventIds = new Set(userRsvps.map(rsvp => rsvp.event_id));
    const eventsWithRsvpStatus = events.map(event => ({
      ...event,
      is_rsvpd: rsvpedEventIds.has(event.id),
    }));

    res.json({ events: eventsWithRsvpStatus });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events
router.post('/', async (req, res) => {
  if (!requireSupabase(res)) return;

  const result = validateEventBody(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const event = await createEvent(result.data);
    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/rsvp
router.post('/:id/rsvp', async(req, res) => {
  if (!requireSupabase(res)) return; 

  const idStatus = validateEventId(req.params.id); 
  if (!idStatus.ok) {
    return res.status(400).json({ error: idStatus.error });
  }

  try {
    const event = await getEventById(idStatus.data); 
    const eventRsvp = await createEventRsvp(event); 
    res.status(201).json( {eventRsvp} );
  } catch (err) {
    res.status(500).json({ error: err.message });;
  }
});

export default router;
