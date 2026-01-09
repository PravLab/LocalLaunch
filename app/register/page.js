// app/register/page.js
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import RegisterWizard from "@/app/components/register-wizard/RegisterWizard";

export const metadata = {
  title: "Create Your Business Website | LocalLaunch",
  description: "Set up your online store in 2 minutes.",
};

async function verifyPaymentAccess() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("registration_access")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    return payload;
  } catch (e) {
    return null;
  }
}

export default async function RegisterPage() {
  // Server-side payment verification
  const paymentData = await verifyPaymentAccess();

  if (!paymentData) {
    redirect("/checkout");
  }

  return (
    <RegisterWizard 
      paymentData={{
        paymentId: paymentData.paymentId,
        orderId: paymentData.orderId,
        orderRef: paymentData.orderRef,
        plan: paymentData.plan,
      }}
    />
  );
}