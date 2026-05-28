import { Router } from 'express';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * Users / profile use case. Mounted at /api/users.
 * Reads from the `profiles` table created in DATABASE_SETUP.txt.
 */
const router = Router();

// GET /api/users/:username
router.get('/:username', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res
      .status(503)
      .json({ error: 'Supabase not configured. See DATABASE_SETUP.txt.' });
  }

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', req.params.username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'Profile not found' });
  res.json({ profile: data });
});

export default router;
