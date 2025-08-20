"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    const res = await fetch("/api/auth/admin-logout", {
      method: "POST",
      credentials: "include", // send cookie
    });

    if (res.ok) {
      router.refresh();  // re-trigger layout check
      router.push("/");  // go to home
    } else {
      alert("Logout failed");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Logging out..." : "🔒 Logout"}
    </button>
  );
}
