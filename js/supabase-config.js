// ============================================================
//  supabase-config.js
//  REPLACE the two values below with your own from supabase.com
// ============================================================
const SUPABASE_URL = 'https://boaxqjioomzfglaqopnr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJvYXhxamlvb216ZmdsYXFvcG5yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNjA5NDcsImV4cCI6MjA5MjkzNjk0N30.lZRzGKZqkWYdyzMeiEeZYu152AJoOz4sorjk13WvlEc';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);