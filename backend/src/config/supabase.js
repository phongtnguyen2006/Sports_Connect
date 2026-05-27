import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;

/**
 * Server-side Supabase client, created with the service role key.
 * Stays null until both env vars are filled in (see DATABASE_SETUP.txt),
 * so the server still boots while credentials are being set up.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient | null}
 */
let supabase = null;

if (url && secretKey) {
  supabase = createClient(url, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
} else {
  console.warn(
    '[supabase] SUPABASE_URL or SUPABASE_SECRET_KEY missing — ' +
      'Supabase client not initialized. See DATABASE_SETUP.txt.'
  );
}

/**
 * @returns {boolean} whether the Supabase client is ready to use
 */
export function isSupabaseConfigured() {
  return supabase !== null;
}

/**
 * @returns {import('@supabase/supabase-js').SupabaseClient}
 * @throws if Supabase env vars are not configured yet
 */
export function getSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Fill in SUPABASE_URL and ' +
        'SUPABASE_SECRET_KEY in backend/.env. See DATABASE_SETUP.txt.'
    );
  }
  return supabase;
}
