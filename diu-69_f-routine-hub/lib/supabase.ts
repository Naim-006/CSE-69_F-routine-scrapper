
import { createClient } from '@supabase/supabase-js';

// Your Project URL
const supabaseUrl = 'https://fhwgcuqvusdjmtplyllf.supabase.co';

// The user provided the specific Supabase Anon key to fix the 'Invalid API key' error.
// process.env.API_KEY is reserved for Gemini AI services.
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZod2djdXF2dXNkam10cGx5bGxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYyNDEyMjUsImV4cCI6MjA4MTgxNzIyNX0.DZVb83OR9hDIKHuWblrBMotpq57vxzZx7IF8392iBxM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
