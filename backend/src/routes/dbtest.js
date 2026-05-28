import { Router } from 'express';
import { getSupabase, isSupabaseConfigured } from '../config/supabase.js';

/**
 * TEMPORARY connection-test route. Mounted at /api/db-test.
 *
 * GET /api/db-test            -> pings the Supabase `test_db` table
 * GET /api/db-test?table=foo  -> pings table `foo` instead
 *
 * Purpose: confirm the backend can actually reach Supabase with the
 * configured keys. Safe, read-only (selects a single row). Delete this
 * file (and its mount in routes/index.js) once the connection is verified.
 */
const router = Router();

router.get('/', async (req, res) => {
  if (!isSupabaseConfigured()) {
    return res.status(503).json({
      ok: false,
      reason: 'Supabase client not initialized — check SUPABASE_URL and SUPABASE_SECRET_KEY in backend/.env.',
    });
  }

  const table = typeof req.query.table === 'string' ? req.query.table : 'test_db';

  try {
    // Read a few real rows so the response visibly proves the round-trip works.
    const { data, error, count } = await getSupabase()
      .from(table)
      .select('*', { count: 'exact' })
      .limit(5);

    if (error) {
      // Reached Supabase, but the query failed (e.g. table missing, RLS, bad key).
      return res.status(502).json({
        ok: false,
        connected: true,
        table,
        message: 'Connected to Supabase, but the query failed.',
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
      });
    }

    return res.json({
      ok: true,
      connected: true,
      table,
      totalRows: count,
      returned: data.length,
      sample: data,
      message: `Supabase connection works — "${table}" has ${count} row(s).`,
    });
  } catch (err) {
    // Network / client-level failure (couldn't reach Supabase at all).
    return res.status(500).json({
      ok: false,
      connected: false,
      table,
      message: 'Could not reach Supabase.',
      error: err.message,
    });
  }
});

export default router;
