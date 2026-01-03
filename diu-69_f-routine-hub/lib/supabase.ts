
import { createClient } from '@supabase/supabase-js';

// Your Project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;

// The user provided the specific Supabase Anon key to fix the 'Invalid API key' error.
// process.env.API_KEY is reserved for Gemini AI services.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
