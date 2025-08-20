"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminAuthHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handlePostAuth = async () => {
      const slug = searchParams.get("slug");

      if (!slug) {
        alert("Missing slug");
        return;
      }

      const { data: sessionData, error } = await supabase.auth.getSession();
      const session = sessionData?.session;

      if (!session || error) {
        alert("Session not found. Try again.");
        return;
      }

      const userEmail = session.user.email;

      const { error: updateError } = await supabase
        .from("businesses")
        .update({ admin_email: userEmail })
        .eq("slug", slug);

      if (updateError) {
        console.error("Failed to save admin email:", updateError.message);
        alert("Failed to save admin access. Contact support.");
        return;
      }

      router.push(`/site/${slug}/admin`);
    };

    handlePostAuth();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-500 text-lg">Setting up your admin access...</p>
    </div>
  );
}
