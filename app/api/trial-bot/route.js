// import { NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function GET(req) {
//   const { searchParams } = new URL(req.url);
//   const slug = searchParams.get("slug");

//   if (!slug) {
//     return NextResponse.json({ error: "Slug missing" }, { status: 400 });
//   }

//   // Step 1: Get business by slug
//   const { data: business, error } = await supabase
//     .from("businesses")
//     .select("trial_expires_at")
//     .eq("slug", slug)
//     .single();

//   if (error || !business) {
//     return NextResponse.json({ error: "Business not found" }, { status: 404 });
//   }

//   // ✅ Temporary: Check if 10 seconds have passed
//   const trialStart = new Date(business.trial_expires_at);
//   const now = new Date();
//   const elapsed = (now - trialStart) / 1000; // in seconds
//   const isExpired = elapsed > 10;

//   return NextResponse.json({ expired: isExpired });

//   // 🔒 Use this later for real expiry check:
//   // const trialExpiry = new Date(business.trial_expires_at);
//   // const now = new Date();
//   // const isExpired = now > trialExpiry;
//   // return NextResponse.json({ expired: isExpired });
// }
