// import { NextResponse } from "next/server";
// import { SignJWT } from "jose";
// import { cookies } from "next/headers";

// const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function POST(req) {
//   const { slug } = await req.json();

//   if (!slug) {
//     return NextResponse.json({ error: "Missing slug" }, { status: 400 });
//   }

//   const token = await new SignJWT({ slug })
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt()
//     .setExpirationTime("7d")
//     .sign(JWT_SECRET);

//   // ✅ Corrected usage
//   const cookieStore = cookies();
//   cookieStore.set("admin_token", token, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     sameSite: "Lax",
//     path: "/",
//     maxAge: 60 * 60 * 24 * 7, // 7 days
//   });

//   return NextResponse.json({ success: true });
// }
