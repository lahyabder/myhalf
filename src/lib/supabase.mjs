import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://empiteroiumggtlnuxtp.supabase.co';
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVtcGl0ZXJvaXVtZ2d0bG51eHRwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MDQ4MTYsImV4cCI6MjEwODA4MDgxNn0.0n2T9DVr3zhKCnxQewPruFGMOk8AUNBW8iJ6O4uhSe0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});
