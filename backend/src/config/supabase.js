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
let supabaseAdmin = null;

if (url && secretKey) {
  supabase = createClient(url, secretKey, {
    auth: { 
      persistSession: false, 
      autoRefreshToken: false 
    },
  });

  // Admin client for storage uploads (same service key, no custom auth header)
  supabaseAdmin = createClient(url, secretKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
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
  return supabase !== null && supabaseAdmin !== null;
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

export function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    throw new Error(
      'Supabase admin client is not configured. Fill in SUPABASE_URL and ' +
        'SUPABASE_SECRET_KEY in backend/.env. See DATABASE_SETUP.txt.'
    );
  }

  return supabaseAdmin;
}
