"use client";

import { supabase } from "@/lib/supabase";

export default function GoogleLoginButton({ slug }) {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/admin-auth-handler?slug=${slug}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err.message);
      alert("Login failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="px-4 py-2 bg-blue-600 text-white rounded"
    >
      Login with Google
    </button>
  );
}
