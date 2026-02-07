import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // --- MODO BLINDADO: Chaves Diretas ---
  // Isso garante que o AuthContext sempre consiga conectar, 
  // independente do arquivo .env
  return createBrowserClient(
    "https://tgsrhyugarrdtbsmherd.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnc3JoeXVnYXJyZHRic21oZXJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDQzMDAsImV4cCI6MjA4MjQyMDMwMH0.0adZE_lwUILL1HZd1WGAHcZFbiC6GLUXOwqxZrppM6g"
  )
}