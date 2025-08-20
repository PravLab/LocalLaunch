// app/api/domain/purchase/route.js
import { NextResponse } from "next/server";

const GODADDY_KEY = process.env.GODADDY_API_KEY;
const GODADDY_SECRET = process.env.GODADDY_API_SECRET;

export async function POST(req) {
  const { domainName, customerEmail } = await req.json();

  try {
    // STEP 1: Check if available
    const checkRes = await fetch(`https://api.godaddy.com/v1/domains/available?domain=${domainName}`, {
      headers: {
        Authorization: `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`,
      },
    });

    const checkData = await checkRes.json();
    if (!checkData.available) {
      return NextResponse.json({ success: false, message: "Domain not available" }, { status: 400 });
    }

    // STEP 2: Buy domain
    const purchaseRes = await fetch(`https://api.godaddy.com/v1/domains/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`,
      },
      body: JSON.stringify({
        consent: {
          agreementKeys: ["DNRA"],
          agreedBy: "127.0.0.1",
          agreedAt: new Date().toISOString(),
        },
        contactAdmin: {
          nameFirst: "Your",
          nameLast: "Client",
          email: customerEmail,
          phone: "+91.9999999999",
          addressMailing: {
            address1: "123 Street",
            city: "City",
            state: "State",
            postalCode: "123456",
            country: "IN",
          },
        },
        contactBilling: { /* same as contactAdmin */ },
        contactRegistrant: { /* same as contactAdmin */ },
        contactTech: { /* same as contactAdmin */ },
        domain: domainName,
        period: 1,
        privacy: true,
        renewAuto: true,
      }),
    });

    if (!purchaseRes.ok) {
      const err = await purchaseRes.json();
      return NextResponse.json({ success: false, error: err }, { status: 500 });
    }

    // STEP 3: Set Vercel Nameservers
    await fetch(`https://api.godaddy.com/v1/domains/${domainName}/nameservers`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `sso-key ${GODADDY_KEY}:${GODADDY_SECRET}`,
      },
      body: JSON.stringify({
        nameservers: ["ns1.vercel-dns.com", "ns2.vercel-dns.com"]
      }),
    });

    return NextResponse.json({ success: true, message: "Domain purchased and nameservers set" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
