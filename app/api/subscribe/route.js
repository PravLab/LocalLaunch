import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json(); // ✅ read JSON instead of FormData
    const email = body.email;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Local Launch Blog" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "New Blog Subscriber 📬",
      html: `<p><strong>New subscriber:</strong> ${email}</p>`,
    });

    return NextResponse.json({ message: "Thanks for subscribing!" }, { status: 200 });
  } catch (err) {
    console.error("Email send failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
