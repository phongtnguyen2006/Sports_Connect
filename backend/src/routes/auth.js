import { Router } from 'express';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * Authentication use case — registration and login backed by Supabase Auth.
 * Mounted at /api/auth.
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

// POST /api/auth/register
router.post('/register', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { email, password, username } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: username ? { username } : undefined,
  });

  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json({ user: data.user });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  if (!requireSupabase(res)) return;

  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password are required' });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return res.status(401).json({ error: error.message });
  res.json({ session: data.session, user: data.user });
});

export default router;
