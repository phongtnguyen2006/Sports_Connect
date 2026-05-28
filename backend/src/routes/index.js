import { Router } from 'express';
import authRouter from './auth.js';
import eventsRouter from './events.js';
import usersRouter from './users.js';

/**
 * Aggregates every feature router under a single /api mount point.
 * Each use case lives in its own file: add a new router here when you
 * add a new feature area (e.g. `messages`, `teams`).
 */
const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

router.use('/auth', authRouter);
router.use('/events', eventsRouter);
router.use('/users', usersRouter);

export default router;
