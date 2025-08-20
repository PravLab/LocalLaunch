"use client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const { slug } = useParams();
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleReset = async () => {
    const res = await fetch("/api/admin-reset", {
      method: "POST",
      body: JSON.stringify({ slug, newPassword: password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Password updated. Please log in.");
      router.push(`/`);
    } else {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] px-4">
      <div className="bg-[#1c1c1c] p-6 rounded-2xl shadow-xl w-full max-w-sm space-y-5 border border-gray-800">
        <h1 className="text-2xl font-semibold text-center text-white">
          Set New Password
        </h1>

        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-2 text-white placeholder-gray-400 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Save Password
        </button>
      </div>
    </div>
  );
}
