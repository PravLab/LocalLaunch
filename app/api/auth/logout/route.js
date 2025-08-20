// import { auth } from "@/lib/lucia";

// export async function POST(request) {
//   const session = await auth.validateRequest(request);

//   if (!session.session) {
//     // return new Response("Not logged in", { status: 401 });
//   }

//   await auth.invalidateSession(session.session.id);

//   const emptySessionCookie = auth.createBlankSessionCookie(); // <-- Correct method to clear the cookie

//   return new Response(null, {
//     status: 200,
//     headers: {
//       "Set-Cookie": emptySessionCookie.serialize()
//     }
//   });
// }
