import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://egkqgchdcozhsghjvgzk.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVna3FnY2hkY296aHNnaGp2Z3prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkwOTg5MTYsImV4cCI6MjA3NDY3NDkxNn0.dQgDQaEEdqtHaD8zTyBxcl_RAm0AGO2UT-PvMldNV4c';

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

