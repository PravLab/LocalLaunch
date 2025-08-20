// // /app/api/admin/callback/route.js
// import { NextResponse } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL,
//   process.env.SUPABASE_SERVICE_ROLE_KEY // must be service_role!
// );

// export async function POST(req) {
//   const { email, slug } = await req.json();

//   if (!email || !slug) {
//     return NextResponse.json({ error: "Missing email or slug" }, { status: 400 });
//   // }

//   // ❌ Check for duplicate admin_email in another slug
//   const { data: existing, error: checkError } = await supabase
//     .from("businesses")
//     .select("slug")
//     .eq("admin_email", email)
//     .neq("slug", slug)
//     .maybeSingle();

//   if (checkError) {
//     return NextResponse.json({ error: "Check failed" }, { status: 500 });
//   }

//   if (existing) {
//     return NextResponse.json({ error: "Email already used for another business" }, { status: 409 });
//   }

//   // ✅ Update admin_email for the current slug
//   const { error: updateError } = await supabase
//     .from("businesses")
//     .update({ admin_email: email })
//     .eq("slug", slug);

//   if (updateError) {
//     return NextResponse.json({ error: "Failed to save admin" }, { status: 500 });
//   }

//   // 🔐 Set cookie (JWT or any method you're using)
//   const response = NextResponse.json({ success: true });
//   response.cookies.set("admin_token", "your_generated_jwt_here", {
//     path: "/",
//     httpOnly: true,
//     secure: true,
//     sameSite: "Lax",
//     maxAge: 60 * 60 * 24 * 7,
//   });

//   return response;
// }
