"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ForgetPasswordModal({ onClose }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await fetch("/api/admin-forget", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Redirecting to reset page...");
      router.push(`/site/${data.slug}/admin/reset-password`);
    } else {
      toast.error(data.message || "No account found.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-zinc-900 text-gray-800 dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-5">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>

        <input
          type="email"
          placeholder="Enter your registered email"
          className="w-full px-4 py-2 border border-gray-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
        >
          Continue
        </button>

        <button
          onClick={onClose}
          className="w-full text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
