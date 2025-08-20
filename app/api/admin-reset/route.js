// app/api/admin-reset/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { slug, newPassword } = await req.json();

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { error } = await supabase
      .from("businesses")
      .update({ admin_password: hashedPassword })
      .eq("slug", slug);

    if (error) {
      return NextResponse.json({ message: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({ message: "Password updated" });
  } catch (err) {
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
