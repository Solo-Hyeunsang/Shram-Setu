// Shram Setu — Supabase Client Singleton
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://hutaudjcocxpbgolsmcz.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1dGF1ZGpjb2N4cGJnb2xzbWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcwMjY5NDEsImV4cCI6MjEwMjYwMjk0MX0.IBrRWqxd7KeIgG8I57B--ZvOf1029UfrnN9N7Rj4g6E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
