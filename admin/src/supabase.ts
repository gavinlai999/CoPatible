import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://tymiqryfqiauumwvqjoe.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5bWlxcnlmcWlhdXVtd3Zxam9lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzYyNzQsImV4cCI6MjA4OTAxMjI3NH0.sFP80Nnya9-FSSw9t-zLRqxY2U1vr751EC3EkzIb484";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
