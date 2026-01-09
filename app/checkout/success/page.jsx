// app/register/success/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  ExternalLink,
  Copy,
  Share2,
  ArrowRight,
  Store,
  Sparkles,
  QrCode,
  MessageCircle,
  Home,
  Settings
} from "lucide-react";
import { toast, Toaster } from "sonner";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const [copied, setCopied] = useState(false);

  const storeUrl = `https://locallaunch.in/${slug}`;
  const localUrl = `http://localhost:3000/site/${slug}`;
  const adminUrl = `/site/${slug}/admin`;

  // Confetti on mount
  useEffect(() => {
    if (!slug) return;
    
    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#6366f1", "#8b5cf6", "#10b981"],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#6366f1", "#8b5cf6", "#10b981"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  }, [slug]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const shareStore = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Check out my online store!",
          text: `Visit my store at ${storeUrl}`,
          url: storeUrl,
        });
      } catch (err) {
        // User cancelled
      }
    } else {
      copyToClipboard();
    }
  };

  if (!slug) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Store information not found</p>
          <Link href="/" className="text-indigo-600 hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-gray-50 dark:from-emerald-950/20 dark:via-[#09090b] dark:to-[#09090b] px-4 py-12">
      <Toaster position="top-center" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full mx-auto"
      >
        {/* Success Message */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 mb-6"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3"
          >
            Congratulations! 🎉
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-gray-400 text-lg"
          >
            Your online store is now live!
          </motion.p>
        </div>

        {/* Store URL Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
              <Store className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              Your Store Links
            </span>
          </div>

          {/* Production URL */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Live URL</p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="flex-1 font-mono text-sm text-indigo-600 dark:text-indigo-400 truncate">
                  {storeUrl}
                </span>
                <button
                  onClick={copyToClipboard}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Copy className={`w-4 h-4 ${copied ? 'text-emerald-500' : 'text-gray-500'}`} />
                </button>
              </div>
            </div>

            {/* Local Test URL */}
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Test locally</p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                <span className="flex-1 font-mono text-sm text-gray-600 dark:text-gray-400 truncate">
                  {localUrl}
                </span>
                <Link
                  href={localUrl}
                  target="_blank"
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-500" />
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <Link
              href={localUrl}
              target="_blank"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              View Store
            </Link>
            <button
              onClick={shareStore}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-400 font-medium transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
            What's Next?
          </h3>

          <div className="space-y-3">
            <Link
              href={adminUrl}
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white group hover:shadow-lg transition-all"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5" />
                <div>
                  <p className="font-medium">Admin Dashboard</p>
                  <p className="text-xs text-indigo-100">Manage your store</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Check out my new online store: ${storeUrl}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Share on WhatsApp</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Tell your customers</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </a>

            <Link
              href={`${adminUrl}/qr-code`}
              className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="font-medium text-gray-700 dark:text-gray-300">Download QR Code</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">For print materials</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400" />
            </Link>
          </div>
        </motion.div>

        {/* Pro Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800 mb-6"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-indigo-800 dark:text-indigo-300 mb-1">
                Pro Tip
              </p>
              <p className="text-sm text-indigo-700 dark:text-indigo-400">
                Add your store link to your Instagram bio and WhatsApp status to get more customers!
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-4"
        >
          <Link
            href="/"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center gap-1"
          >
            <Home className="w-4 h-4" />
            Go to Homepage
          </Link>
          <span className="text-gray-300 dark:text-gray-600">•</span>
          <Link
            href="/support"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Need Help?
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
} 