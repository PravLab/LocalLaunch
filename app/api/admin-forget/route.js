// app/api/admin-forget/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust the import path as needed


// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY
// );

export async function POST(req) {
  const { email } = await req.json();

  const { data } = await supabase
    .from("businesses")
    .select("slug")
    .eq("admin_email", email)
    .single();

   

  if (!data) {
    return NextResponse.json({ message: "Account not found" }, { status: 404 });
  }

  return NextResponse.json({ slug: data.slug });
}
