// lib/supabase-admin.js
import { createClient } from "@supabase/supabase-js";

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    // Return null instead of throwing during build
    console.warn("Supabase credentials not available");
    return null;
  }
  
  return createClient(url, key);
}