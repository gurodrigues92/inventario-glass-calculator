// Supabase Client - Migrado para Self-Hosted (2026-02-13)
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_SCHEMA = import.meta.env.VITE_SUPABASE_SCHEMA || "inventario_glass";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  db: {
    schema: SUPABASE_SCHEMA
  },
  global: {
    headers: {
      'Accept-Profile': SUPABASE_SCHEMA,
      'Content-Profile': SUPABASE_SCHEMA
    }
  },
  auth: {
    flowType: 'pkce'  // PKCE evita tokens no fragmento e reduz risco de XSS
  }
});