import { Router } from 'express';
import { getAllEvents, addEvent } from '../store/eventStore.js';
import { validateEventBody } from '../utils/validateEvent.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ events: getAllEvents() });
});

router.post('/', (req, res) => {
  const result = validateEventBody(req.body);
  if (!result.ok) {
    return res.status(400).json({ error: result.error });
  }

  const event = addEvent(result.data);
  res.status(201).json({ event });
});

export default router;
