import { Router } from 'express';
import { getAllEvents, addEvent } from '../store/eventStore.js';
import { validateEventBody } from '../utils/validateEvent.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ events: getAllEvents() });
});

export default router;
