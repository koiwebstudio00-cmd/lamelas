import { createClient } from '@supabase/supabase-js';

// Cliente de solo lectura (anon key). Nunca usar la service role key acá.
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  { auth: { persistSession: false } }
);
