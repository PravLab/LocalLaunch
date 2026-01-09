import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function
export async function getFeaturedBusinesses() {
  const { data, error } = await supabase
    .from("businesses")
    .select("name, slug, category, city, state, thumbnail")
    .eq("is_featured", true)
    .limit(6)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }
  return data;
}