"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import React, { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Instagram,
  MapPin,
  Clock,
  MessageSquare,
  ExternalLink,
  Phone,
  Send,
  ShieldCheck
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [statusMessage, setStatusMessage] = useState("");

  // Static SEO JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Local Launch",
    url: "https://locallaunch.in",
    contactPoint: [
      {
        "@type": "ContactPoint",
        email: "hello@locallaunch.in",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["en"]
      }
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Address Line 1",
      addressLocality: "City",
      addressRegion: "State",
      postalCode: "Postal Code",
      addressCountry: "IN"
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const topic = form.topic.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      setStatus("error");
      setStatusMessage("Please fill all required fields.");
      return;
    }

    setSubmitting(true);
    setStatus(null);
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, topic, message }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setStatusMessage("Thank you! Your message has been sent.");
      form.reset();
    } catch (err) {
      console.error("Contact submit error:", err);
      setStatus("error");
      setStatusMessage(
        err.message || "Something went wrong. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-gray-200">
      {/* Static SEO JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <header className="border-b border-neutral-800 bg-[#0B0D12]/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/15 text-emerald-400 px-3 py-1 text-xs font-medium border border-emerald-700/30">
              <MessageSquare className="w-3.5 h-3.5" />
              Contact
            </span>
            <span className="text-xs text-gray-400">We usually reply within 24–48 hours</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        {/* ... your hero section unchanged ... */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          {/* ... your aside unchanged ... */}

          {/* Contact Form */}
          <section className="lg:col-span-7">
            <div className="rounded-xl border border-neutral-800 bg-[#0F1218] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-white mb-4">Send us a message</h2>
              <p className="text-sm text-gray-300 mb-6">
                Fill this form and we’ll receive your message directly. You can also email us at{" "}
                <a href="mailto:hello@locallaunch.in" className="text-emerald-400 hover:underline">hello@locallaunch.in</a>.
              </p>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-200">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="John Doe"
                    className="mt-2 w-full rounded-md border border-neutral-700 bg-[#0B0D12] text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={submitting}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                      Email
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="mt-2 w-full rounded-md border border-neutral-700 bg-[#0B0D12] text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                      disabled={submitting}
                    />
                  </div>

                  <div>
                    <label htmlFor="topic" className="block text-sm font-medium text-gray-200">
                      Topic
                    </label>
                    <select
                      id="topic"
                      name="topic"
                      required
                      className="mt-2 w-full rounded-md border border-neutral-700 bg-[#0B0D12] text-gray-100 focus:border-emerald-500 focus:ring-emerald-500"
                      disabled={submitting}
                    >
                      <option className="bg-[#0B0D12]" value="General">General</option>
                      <option className="bg-[#0B0D12]" value="Billing">Billing</option>
                      <option className="bg-[#0B0D12]" value="Technical Support">Technical Support</option>
                      <option className="bg-[#0B0D12]" value="Partnerships">Partnerships</option>
                      <option className="bg-[#0B0D12]" value="Feedback">Feedback</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Tell us how we can help..."
                    className="mt-2 w-full rounded-md border border-neutral-700 bg-[#0B0D12] text-gray-100 placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                    disabled={submitting}
                  />
                </div>

                {/* Status message */}
                {status && (
                  <p
                    className={`text-sm ${
                      status === "success" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {statusMessage}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    By contacting us, you agree to our{" "}
                    <Link href="/privacy-policy" className="text-emerald-400 hover:underline">Privacy Policy</Link>.
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-600 hover:to-indigo-700 text-white font-semibold px-5 py-2.5 rounded-md shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  If you face any issue with this form, email us directly:{" "}
                  <a href="mailto:hello@locallaunch.in" className="text-emerald-400 hover:underline">hello@locallaunch.in</a>
                </div>
              </form>
            </div>
          </section>
        </div>

        <div className="mt-10 text-center text-xs text-gray-400">
          © 2025 Local Launch. All rights reserved.
        </div>
      </main>
    </div>
  );
}