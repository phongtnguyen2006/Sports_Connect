import { Router } from 'express';
import { getAllEvents, getEventsByHostId, getEventById, createEvent, createEventRsvp, getUserRsvps, deleteEventRsvp } from '../services/eventsService.js';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';
import { validateEventBody } from '../utils/validateEvent.js';
import { validateEventId } from '../utils/validateEventId.js';
import { getAuthUser } from '../utils/getAuthUser.js';

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

async function getUserIdFromRequest(req) {
  const supabase = getSupabase();

  const authHeader = req.headers.authorization;
  const token = authHeader?.replace("Bearer ", "");


  if (
    !token ||
    token === "null" ||
    token === "undefined" ||
    token.split(".").length !== 3
  ) {
    throw new Error("Invalid or missing auth token. Please register or log in again.");
  }

  const result = await supabase.auth.getUser(token);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data.user.id;
}

// GET /api/events/my-events
router.get('/my-events', async (req, res) => {
  if (!requireSupabase(res)) return;

  try {
    const userId = await getUserIdFromRequest(req);
    const events = await getEventsByHostId(userId);

    res.json({ events });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

//GET /api/events/my-rsvps
router.get('/my-rsvps', async (req, res) => {
  if (!requireSupabase(res)) return;

  const user = await getAuthUser(req, res);
  if (!user) return;

  try {
    const rsvps = await getUserRsvps(user.id);

    res.json({ 
      rsvps,
      count: rsvps.length,
   });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// GET /api/events
router.get('/', async (req, res) => {
  if (!requireSupabase(res)) return;

  const user = await getAuthUser(req, res);
  if (!user) return;

  try {
    const events = await getAllEvents();
    const userRsvps = await getUserRsvps(user.id);

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

  const user = await getAuthUser(req, res); 
  if (!user) return;

  const result = validateEventBody(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  try {
    const event = await createEvent(result.data, user.id);
    res.status(201).json({ event });
  } catch (err) {
      const status = err.message === "Missing auth token" ? 401 : 500;
      res.status(status).json({ error: err.message });
  }
});

// POST /api/events/:id/rsvp
router.post('/:id/rsvp', async(req, res) => {
  if (!requireSupabase(res)) return; 

  const user = await getAuthUser(req, res); 
  if (!user) return;

  const idStatus = validateEventId(req.params.id); 
  if (!idStatus.ok) {
    return res.status(400).json({ error: idStatus.error });
  }

  try {
    const event = await getEventById(idStatus.data); 
    const eventRsvp = await createEventRsvp(event, user.id); 
    res.status(201).json( {eventRsvp} );
  } catch (err) {
    res.status(500).json({ error: err.message });;
  }
});

// DELETE /api/events/:id/rsvp
router.delete('/:id/rsvp', async (req, res) => {
  if (!requireSupabase(res)) return;

  const user = await getAuthUser(req, res); 
  if (!user) return;

  const idStatus = validateEventId(req.params.id);
  if (!idStatus.ok) {
    return res.status(400).json({ error: idStatus.error });
  }

  try {
    const eventRsvp = await deleteEventRsvp(idStatus.data, user.id);

    if(!eventRsvp) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    res.json({ eventRsvp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/events/:id/rsvp
router.post('/:id/rsvp', async(req, res) => {
  if (!requireSupabase(res)) return; 

  const user = await getAuthUser(req, res); 
  if (!user) return;

  const idStatus = validateEventId(req.params.id); 
  if (!idStatus.ok) {
    return res.status(400).json({ error: idStatus.error });
  }

  try {
    const event = await getEventById(idStatus.data); 
    const eventRsvp = await createEventRsvp(event, user.id); 
    res.status(201).json( {eventRsvp} );
  } catch (err) {
    res.status(500).json({ error: err.message });;
  }
});

// DELETE /api/events/:id/rsvp
router.delete('/:id/rsvp', async (req, res) => {
  if (!requireSupabase(res)) return;

  const user = await getAuthUser(req, res); 
  if (!user) return;

  const idStatus = validateEventId(req.params.id);
  if (!idStatus.ok) {
    return res.status(400).json({ error: idStatus.error });
  }

  try {
    const eventRsvp = await deleteEventRsvp(idStatus.data, user.id);

    if(!eventRsvp) {
      return res.status(404).json({ error: 'RSVP not found' });
    }

    res.json({ eventRsvp });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
