"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CreditCard, FileText, Info, AlertTriangle } from "lucide-react";

export default function CancellationRefundPage() {
  const router = useRouter();

  const sections = [
    { id: "scope", label: "Scope of this Policy" },
    { id: "platform-cancellation", label: "Local Launch — Cancellations" },
    { id: "platform-refunds", label: "Local Launch — Refunds" },
    { id: "non-refundable", label: "Non‑Refundable Items/Fees" },
    { id: "how-to-request", label: "How to Request a Refund" },
    { id: "processing-time", label: "Processing Time & Method" },
    { id: "chargebacks", label: "Chargebacks" },
    { id: "merchants", label: "For Stores Built on Local Launch" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 text-purple-700 px-3 py-1 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              Policy v1.0.0
            </span>
            <span className="text-xs text-gray-500">Last updated: 13 November 2025</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-50 text-purple-700 p-2">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Cancellation & Refund Policy</h1>
                <p className="text-gray-600 mt-1">
                  This page explains how cancellations and refunds work on Local Launch.
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-start gap-2 bg-gray-50 border rounded-md p-3">
              <Info className="w-4 h-4 mt-0.5" />
              <span>
                This is a platform policy for Local Launch. It is not legal advice. Stores using Local Launch must publish their own policies.
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* TOC */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <nav className="bg-white rounded-xl shadow-sm border p-5 sticky top-6" aria-label="Table of contents">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Contents</h2>
              <ul className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block rounded px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t">
                <p className="text-xs text-gray-500">Related policies</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href="/shipping-policy" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Shipping/Delivery
                  </Link>
                  <Link href="/terms" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Terms
                  </Link>
                  <Link href="/privacy-policy" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Privacy
                  </Link>
                </div>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <article className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 space-y-10 leading-7 text-gray-700">
              <section id="scope" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">1) Scope of this Policy</h2>
                <p>
                  Local Launch is a software platform that enables businesses to create and manage online storefronts. We do not sell goods on behalf of Merchants and are not a party to transactions between a Merchant and its Customers.
                </p>
                <p>
                  This policy covers cancellations and refunds related to Local Launch’s own platform fees (if any). For orders placed with a Merchant’s store hosted on Local Launch, please follow the Merchant’s Cancellation & Refund Policy linked on their store.
                </p>
              </section>

              <section id="platform-cancellation" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">2) Local Launch — Cancellations</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>You may cancel a paid plan at any time from your account settings or by contacting support.</li>
                  <li>Cancellation stops future renewals. Access continues until the end of the current billing period.</li>
                  <li>No refunds are provided for partial billing periods after access has been granted.</li>
                </ul>
              </section>

              <section id="platform-refunds" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">3) Local Launch — Refunds</h2>
                <p>Refunds for Local Launch platform charges are limited to the following cases:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Duplicate or accidental charges on the same account.</li>
                  <li>Technical billing error resulting in an incorrect amount charged.</li>
                  <li>Post‑cancellation charge where a timely cancellation request was already submitted.</li>
                </ul>
                <p>
                  Requests outside these cases are generally not eligible. Taxes, duties, and third‑party processor fees are non‑refundable unless required by law.
                </p>
              </section>

              <section id="non-refundable" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">4) Non‑Refundable Items/Fees</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Setup/implementation fees, if applicable.</li>
                  <li>One‑time add‑on purchases after they are provisioned.</li>
                  <li>Third‑party charges (e.g., payment gateway fees), taxes, and government levies.</li>
                  <li>Promotional credits, coupons, or discretionary goodwill adjustments.</li>
                </ul>
              </section>

              <section id="how-to-request" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">5) How to Request a Refund</h2>
                <p>To help us review quickly, email us with the following details:</p>
                <div className="bg-gray-50 border rounded-lg p-4 text-sm">
                  <p><strong>Email:</strong> hello@locallaunch.in</p>
                  <p><strong>Subject line:</strong> Refund request – Local Launch</p>
                  <p className="mt-2"><strong>Include:</strong></p>
                  <ul className="list-disc list-inside">
                    <li>Account email and business name</li>
                    <li>Invoice/transaction ID and date</li>
                    <li>Amount charged and payment method</li>
                    <li>Reason for the request (with any supporting screenshots)</li>
                  </ul>
                </div>
              </section>

              <section id="processing-time" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">6) Processing Time & Method</h2>
                <p>
                  Approved refunds are issued to the original payment method. Depending on your bank or payment provider, it may take 5–10 business days for the credit to appear on your statement.
                </p>
              </section>

              <section id="chargebacks" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">7) Chargebacks</h2>
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <p className="text-amber-800">
                    If you dispute a charge directly with your bank/card issuer, your account may be suspended while the investigation is active. Please contact us first—we can usually resolve billing issues faster.
                  </p>
                </div>
              </section>

              <section id="merchants" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">8) For Stores Built on Local Launch</h2>
                <p>
                  Each Merchant must publish their own Cancellation & Refund Policy and handle Customer requests directly. As a platform provider, Local Launch is not responsible for Merchant order cancellations, returns, or refunds.
                </p>
                <p className="text-sm text-gray-600">
                  Recommended Merchant policy items: cancellation window (pre‑dispatch), return eligibility and condition, non‑returnable categories, refund timelines, shipping fee deductions, exchange rules, and contact details.
                </p>
              </section>

              <section id="contact" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">9) Contact</h2>
                <div className="bg-gray-50 border rounded-lg p-4 text-sm">
                  <p><strong>Local Launch</strong></p>
                  <p>Your Address Line 1</p>
                  <p>City, State, Postal Code</p>
                  <p>India</p>
                  <p className="mt-1">Email: <a href="mailto:hello@locallaunch.in" className="text-blue-600 hover:underline">hello@locallaunch.in</a></p>
                  <p>Website: <a href="https://locallaunch.in" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">https://locallaunch.in</a></p>
                </div>
              </section>

              <div className="pt-6 border-t">
                <p className="text-center text-xs text-gray-500">
                  © 2025 Local Launch. All rights reserved.
                </p>
              </div>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}