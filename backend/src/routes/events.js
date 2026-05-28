import { Router } from 'express';
import { getAllEvents, createEvent } from '../services/eventsService.js';
import { isSupabaseConfigured } from '../config/supabase.js';
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
    const event = await createEvent(result.data);
    res.status(201).json({ event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
