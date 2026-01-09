// app/api/billing/check-access/route.js
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("registration_access")?.value;

    if (!accessToken) {
      console.log("No registration_access token found");
      return Response.json({ hasAccess: false });
    }

    try {
      const { payload } = await jwtVerify(
        accessToken,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );

      console.log("Token payload:", payload);

      // Token is valid - return ALL payment information
      return Response.json({
        hasAccess: true,
        plan: payload.plan || "pro_monthly",
        paymentId: payload.paymentId,
        orderId: payload.orderId, // Make sure this is included
        orderRef: payload.orderRef || "",
      });
    } catch (e) {
      console.error("Token verification failed:", e.message);
      // Token expired or invalid
      return Response.json({ 
        hasAccess: false,
        expired: true
      });
    }
  } catch (error) {
    console.error("Check access error:", error);
    return Response.json({ hasAccess: false });
  }
}