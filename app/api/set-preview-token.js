import { SignJWT } from "jose";

export async function POST(req) {
  const { slug } = await req.json();

  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const token = await new SignJWT({ slug })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret);

  return new Response(null, {
    status: 200,
    headers: {
      "Set-Cookie": `preview_token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`,
    },
  });
}
