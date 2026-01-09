// /app/site/[slug]/admin/payments/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FaMoneyBillWave,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaTimesCircle,
  FaTrash,
  FaArrowLeft,
  FaLock,
} from "react-icons/fa";
import { SiRazorpay } from "react-icons/si";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default function PaymentSettingsPage() {
  const { slug } = useParams();
  const router = useRouter();

  const isDev = process.env.NODE_ENV !== "production";

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [business, setBusiness] = useState(null);

  const [settings, setSettings] = useState({
    razorpay_enabled: false,
    razorpay_key_masked: null,
    payment_methods: { cod: true, online: false },
  });

  const [credentials, setCredentials] = useState({
    razorpay_key_id: "",
    razorpay_key_secret: "",
  });

  const [showSecret, setShowSecret] = useState(false);
  const [showCredentialForm, setShowCredentialForm] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBusinessAndSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchBusinessAndSettings = async () => {
    try {
      setLoading(true);

      const { data: bizData, error: bizError } = await supabase
        .from("businesses")
        .select(
          "id, slug, business_name, razorpay_enabled, razorpay_key_id, payment_methods"
        )
        .eq("slug", slug)
        .single();

      if (bizError || !bizData) {
        if (isDev) console.error("Business fetch error:", bizError);
        toast.error("Unable to load this page.");
        router.push("/");
        return;
      }

      setBusiness(bizData);

      // Keep display minimal: do not show any portion/pattern of saved credentials
      const maskedKey = bizData.razorpay_key_id ? "configured" : null;

      setSettings({
        razorpay_enabled: !!bizData.razorpay_enabled,
        razorpay_key_masked: maskedKey,
        payment_methods: bizData.payment_methods || { cod: true, online: false },
      });
    } catch (error) {
      if (isDev) console.error("Fetch error:", error);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save via API (encryption/storage happens server-side)
  const handleSaveCredentials = async () => {
    if (!credentials.razorpay_key_id || !credentials.razorpay_key_secret) {
      toast.error("Please fill in all required fields.");
      return;
    }

    // Keep validation generic (avoid revealing exact expected formats/patterns)
    if (credentials.razorpay_key_id.length < 8) {
      toast.error("Key ID looks invalid. Please re-check and try again.");
      return;
    }

    if (credentials.razorpay_key_secret.length < 10) {
      toast.error("Key Secret looks invalid. Please re-check and try again.");
      return;
    }

    if (!business?.id) {
      toast.error("Business not loaded. Please refresh.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/payment/save-credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: business.id,
          razorpay_key_id: credentials.razorpay_key_id,
          razorpay_key_secret: credentials.razorpay_key_secret,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        toast.error((data && data.error) || "Failed to save credentials.");
        return;
      }

      toast.success("Razorpay connected.");
      setCredentials({ razorpay_key_id: "", razorpay_key_secret: "" });
      setShowCredentialForm(false);
      fetchBusinessAndSettings();
    } catch (error) {
      if (isDev) console.error("Save error:", error);
      toast.error("Failed to save credentials.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleCOD = async (enabled) => {
    if (!business?.id) return;

    setSaving(true);
    try {
      const updatedMethods = {
        ...settings.payment_methods,
        cod: enabled,
      };

      const { error } = await supabase
        .from("businesses")
        .update({
          payment_methods: updatedMethods,
          updated_at: new Date().toISOString(),
        })
        .eq("id", business.id);

      if (error) {
        if (isDev) console.error("COD update error:", error);
        toast.error("Failed to update settings.");
        return;
      }

      setSettings((prev) => ({
        ...prev,
        payment_methods: updatedMethods,
      }));
      toast.success("Settings updated.");
    } catch (error) {
      if (isDev) console.error("COD update exception:", error);
      toast.error("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveRazorpay = async () => {
    if (!confirm("Disconnect Razorpay? Online payments will be disabled.")) {
      return;
    }

    if (!business?.id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("businesses")
        .update({
          razorpay_key_id: null,
          razorpay_key_secret: null,
          razorpay_enabled: false,
          payment_methods: { ...settings.payment_methods, online: false },
          updated_at: new Date().toISOString(),
        })
        .eq("id", business.id);

      if (error) {
        if (isDev) console.error("Remove Razorpay error:", error);
        toast.error("Failed to disconnect.");
        return;
      }

      toast.success("Razorpay disconnected.");
      fetchBusinessAndSettings();
    } catch (error) {
      if (isDev) console.error("Remove Razorpay exception:", error);
      toast.error("Failed to disconnect.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-4">Unable to load page</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href={`/site/${slug}/admin`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 mb-6 transition"
        >
          <FaArrowLeft /> Back to Dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Payment Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {business.business_name} - Configure payment methods
          </p>
        </div>

        <div className="space-y-6">
          {/* RAZORPAY */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 border-b dark:border-zinc-800">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <SiRazorpay className="text-2xl text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold dark:text-white">
                      Razorpay
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Online payments
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    settings.razorpay_enabled
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-400"
                  }`}
                >
                  {settings.razorpay_enabled ? (
                    <>
                      <FaCheckCircle /> Connected
                    </>
                  ) : (
                    <>
                      <FaTimesCircle /> Not Connected
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Connected State */}
              {settings.razorpay_enabled ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-xl flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <FaLock className="text-green-600" />
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Status:
                        </p>
                        <p className="font-medium text-green-700 dark:text-green-400">
                          Connected
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveRazorpay}
                      disabled={saving}
                      className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition disabled:opacity-50"
                    >
                      <FaTrash /> Disconnect
                    </button>
                  </div>

                  <button
                    onClick={() => setShowCredentialForm(!showCredentialForm)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
                  >
                    {showCredentialForm ? "Cancel" : "Update Credentials"}
                  </button>
                </div>
              ) : null}

              {/* Credential Form */}
              {(showCredentialForm || !settings.razorpay_enabled) && (
                <div className="space-y-4">
                  {!settings.razorpay_enabled && (
                    <p className="text-gray-600 dark:text-gray-400">
                      Connect your Razorpay account to accept online payments.
                    </p>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Key ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={credentials.razorpay_key_id}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          razorpay_key_id: e.target.value.trim(),
                        }))
                      }
                      placeholder="Enter Key ID"
                      className="w-full p-3 border rounded-xl dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-mono text-sm"
                      autoComplete="off"
                      spellCheck={false}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 dark:text-gray-300">
                      Key Secret <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSecret ? "text" : "password"}
                        value={credentials.razorpay_key_secret}
                        onChange={(e) =>
                          setCredentials((prev) => ({
                            ...prev,
                            razorpay_key_secret: e.target.value.trim(),
                          }))
                        }
                        placeholder="Enter Key Secret"
                        className="w-full p-3 pr-12 border rounded-xl dark:bg-zinc-800 dark:text-white dark:border-zinc-700 font-mono text-sm"
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSecret(!showSecret)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        aria-label={showSecret ? "Hide secret" : "Show secret"}
                      >
                        {showSecret ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCredentials}
                    disabled={
                      saving ||
                      !credentials.razorpay_key_id ||
                      !credentials.razorpay_key_secret
                    }
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium rounded-xl transition flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaLock /> Connect
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tip: Keep these credentials private. Only authorized admins
                    should have access to this page.
                  </p>
                </div>
              )}

              {/* Help (kept minimal; no operational/security specifics) */}
              <details className="mt-6">
                <summary className="text-sm text-indigo-600 dark:text-indigo-400 cursor-pointer font-medium">
                  Need help finding your Razorpay credentials?
                </summary>
                <div className="mt-3 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>
                    Open your Razorpay dashboard and locate your API Keys
                    section.
                  </p>
                  <p>
                    <a
                      href="https://dashboard.razorpay.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 underline"
                    >
                      Go to Razorpay Dashboard
                    </a>
                  </p>
                </div>
              </details>
            </div>
          </div>

          {/* COD */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                  <FaMoneyBillWave className="text-2xl text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold dark:text-white">
                    Cash on Delivery
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pay when order is delivered
                  </p>
                </div>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.payment_methods?.cod ?? true}
                  onChange={(e) => handleToggleCOD(e.target.checked)}
                  disabled={saving}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Status Summary */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Payment Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-sm opacity-90">
                  <SiRazorpay />
                  <span>Online</span>
                </div>
                <p
                  className={`text-xl font-bold ${
                    settings.razorpay_enabled ? "text-green-300" : "text-red-300"
                  }`}
                >
                  {settings.razorpay_enabled ? "Active" : "Off"}
                </p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2 text-sm opacity-90">
                  <FaMoneyBillWave />
                  <span>COD</span>
                </div>
                <p
                  className={`text-xl font-bold ${
                    settings.payment_methods?.cod
                      ? "text-green-300"
                      : "text-red-300"
                  }`}
                >
                  {settings.payment_methods?.cod ? "Active" : "Off"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}