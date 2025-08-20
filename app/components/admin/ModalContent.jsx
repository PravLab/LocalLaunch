"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ForgetPasswordModal from "./ForgetPasswordModal";

export default function ModalContent({ onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetModal, setShowForgetModal] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch("/api/admin-login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Login successful");
      router.push(`/site/${data.slug}/admin`);
    } else {
      toast.error(data.message || "Login failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
      <div className="bg-[#1f1f1f] text-white p-6 rounded-2xl shadow-2xl w-full max-w-sm relative border border-gray-700">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-white"
        >
          &times;
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>

        <input
          type="email"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-[#2a2a2a] text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 bg-[#2a2a2a] text-white placeholder-gray-400 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Login
        </button>

        <p
          className="text-sm text-blue-400 hover:text-blue-500 underline cursor-pointer mt-4 text-center transition"
          onClick={() => setShowForgetModal(true)}
        >
          Forgot password?
        </p>

        {showForgetModal && (
          <ForgetPasswordModal onClose={() => setShowForgetModal(false)} />
        )}
      </div>
    </div>
  );
}
