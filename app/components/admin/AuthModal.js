"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaLock, FaEnvelope } from "react-icons/fa";
import { useAuth } from "@/src/context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthModal({ isOpen, onClose, defaultMode = "login" }) {
  const [mode, setMode] = useState(defaultMode); // "login" | "reset"
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const data = await signIn(form.email, form.password);
      toast.success("Welcome back!");
      onClose();
      
      // Redirect to admin dashboard
      if (data?.slug) {
        window.location.href = `/site/${data.slug}/admin`;
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();

    if (!form.email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin-forget", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Email not found");
      }

      toast.success("Redirecting to reset page...");
      onClose();
      router.push(`/site/${data.slug}/admin/reset-password`);
    } catch (error) {
      toast.error(error.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal opens/closes
  const handleClose = () => {
    setForm({ email: "", password: "" });
    setMode("login");
    onClose();
  };

  // Handle Register click - close modal and go to register page
  const handleRegisterClick = () => {
    handleClose();
    router.push("/register");
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition"
            >
              <IoClose size={24} />
            </button>
            <h2 className="text-2xl font-bold">
              {mode === "login" ? "Welcome Back!" : "Reset Password"}
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              {mode === "login"
                ? "Sign in to manage your store"
                : "We&lsquo;ll help you reset your password"}
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={mode === "login" ? handleLogin : handleReset}>
              <div className="space-y-4">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Password Field - Only for Login */}
                {mode === "login" && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg dark:bg-zinc-800 dark:border-zinc-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : mode === "login"
                    ? "Sign In"
                    : "Send Reset Link"}
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              {mode === "login" ? (
                <>
                  {/* Forgot Password */}
                  <button
                    type="button"
                    onClick={() => setMode("reset")}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>

                  {/* Register Link */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Don&lsquo;t have an account?{" "}
                    <button
                      type="button"
                      onClick={handleRegisterClick}
                      className="text-blue-600 font-semibold hover:underline"
                    >
                      Register
                    </button>
                  </p>
                </>
              ) : (
                /* Back to Login */
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  ← Back to login
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}