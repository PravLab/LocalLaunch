'use client';

import blogs from "@/src/data/blogs";
import Link from "next/link";
import { useState } from "react";
import { Mail, Newspaper } from "lucide-react";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";

export default function BlogListPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("✅ You're now subscribed!");
      setEmail("");
    } else {
      toast.error("❌ Subscription failed. Please try again.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-20">
      {/* Header */}
      <AnimatePresence>
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-orange-600 mb-4 flex justify-center items-center gap-2">
            <Newspaper className="w-8 h-8 text-orange-500" />
            Insights & Tips for Local Business Growth
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Actionable advice, marketing ideas, and online tools to help your local business thrive.
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Subscribe Box */}
      <motion.div
        className="bg-white border border-orange-100 p-6 rounded-xl mb-16 max-w-2xl mx-auto shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <div className="flex items-center w-full sm:w-96 px-4 py-3 border border-gray-300 rounded-lg bg-white shadow-sm">
            <Mail className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your best email for updates"
              className="w-full outline-none text-base text-gray-800 placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Get Tips
          </button>
        </form>
        <p className="text-sm text-center text-gray-500 mt-2">
          No spam. Just value-packed updates for your business.
        </p>
      </motion.div>

      {/* Blog Cards */}
      <motion.div
        className="grid gap-12 md:grid-cols-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {blogs.map((post) => (
          <motion.article
            key={post.slug}
            className="border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition bg-white flex flex-col justify-between"
            whileHover={{ scale: 1.01 }}
          >
            <div>
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-orange-600 hover:underline mb-3">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-700 text-base leading-relaxed mb-4 line-clamp-3">
                {post.preview}
              </p>
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-auto text-orange-500 hover:underline font-medium"
            >
              Read full article →
            </Link>
          </motion.article>
        ))}
      </motion.div>
    </main>
  );
}
