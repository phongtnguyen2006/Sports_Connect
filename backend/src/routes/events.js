import { Router } from 'express';
import { getAllEvents, getEventsByHostId, createEvent } from '../services/eventsService.js';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';
import { validateEventBody } from '../utils/validateEvent.js';

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

// GET /api/events
router.get('/', async (_req, res) => {
  if (!requireSupabase(res)) return;
  try {
    const events = await getAllEvents();
    res.json({ events });
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
    const userId = await getUserIdFromRequest(req);

    const event = await createEvent({
      ...result.data,
      host_id: userId,
    });

    res.status(201).json({ event });
  } catch (err) {
      const status = err.message === "Missing auth token" ? 401 : 500;
      res.status(status).json({ error: err.message });
  }
});

export default router;
