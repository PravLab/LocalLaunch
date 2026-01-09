"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Scale, FileText, ExternalLink, Info } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  const sections = [
    { id: "intro", label: "Introduction" },
    { id: "definitions", label: "Definitions" },
    { id: "eligibility-accounts", label: "Eligibility & Accounts" },
    { id: "license-use", label: "License & Acceptable Use" },
    { id: "merchant-responsibilities", label: "Merchant Responsibilities" },
    { id: "payments-fees-taxes", label: "Payments, Fees & Taxes" },
    { id: "policies", label: "Refund, Cancellation & Shipping" },
    { id: "content-ip", label: "Content & Intellectual Property" },
    { id: "third-parties", label: "Third-Party Services" },
    { id: "privacy", label: "Privacy & Data" },
    { id: "availability-security", label: "Availability & Security" },
    { id: "prohibited", label: "Prohibited Activities" },
    { id: "termination", label: "Suspension & Termination" },
    { id: "disclaimers", label: "Disclaimers" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "indemnity", label: "Indemnification" },
    { id: "governing", label: "Governing Law & Disputes" },
    { id: "misc", label: "Miscellaneous" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      <header className="border-b bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-sm inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex items-center gap-3">
            {/* Edit version text here */}
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium">
              <FileText className="w-3.5 h-3.5" />
              Terms v1.1.2
            </span>
            {/* Edit last updated date here (static text) */}
            <span className="text-xs text-gray-500">Last updated: 13 November 2025</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero */}
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 text-blue-700 p-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms and Conditions</h1>
                <p className="text-gray-600 mt-1">
                  Please read these Terms carefully. They form a binding agreement between you and Local Launch.
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-start gap-2 bg-gray-50 border rounded-md p-3">
              <Info className="w-4 h-4 mt-0.5" />
              <span>
                This page helps with payment-gateway review standards. It is not legal advice.
              </span>
            </div>
          </div>
        </div>

        {/* Layout: TOC + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sticky TOC */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <nav className="bg-white rounded-xl shadow-sm border p-5 sticky top-6" aria-label="Table of contents">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Table of Contents</h2>
              <ul className="space-y-2 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-5 pt-5 border-t">
                <p className="text-xs text-gray-500">Need a refund or shipping policy?</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link href="/cancellation-refund" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Cancellation & Refunds <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link href="/shipping-policy" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Shipping <ExternalLink className="w-3 h-3" />
                  </Link>
                  <Link href="/privacy-policy" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Privacy <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </nav>
          </aside>

          {/* Content */}
          <article className="lg:col-span-8 xl:col-span-9">
            <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-8 space-y-10 leading-7 text-gray-700">
              <section id="intro" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">1. Introduction</h2>
                <p>
                  These Terms and Conditions ("Terms") govern your access to and use of Local Launch,
                  including websites, tools, and related services (collectively, the "Service"). By using
                  the Service, you agree to these Terms and to our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
                </p>
              </section>

              <section id="definitions" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">2. Definitions</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Company</strong>, <strong>we</strong>, or <strong>us</strong> means Local Launch.</li>
                  <li><strong>Merchant</strong> means a business using the Service to create and operate a digital storefront.</li>
                  <li><strong>Customer</strong> means an end-user purchasing from a Merchant.</li>
                  <li><strong>User Content</strong> means any content uploaded, posted, or provided by you.</li>
                </ul>
              </section>

              <section id="eligibility-accounts" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">3. Eligibility & Accounts</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>You must be at least 18 years old and capable of forming a binding contract.</li>
                  <li>Provide accurate, current, and complete information and keep it updated.</li>
                  <li>You are responsible for safeguarding account credentials and all activities under your account.</li>
                  <li>We may suspend or terminate accounts that are fraudulent, abusive, or violate law or these Terms.</li>
                </ul>
              </section>

              <section id="license-use" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">4. License & Acceptable Use</h2>
                <p>
                  We grant you a limited, revocable, non-exclusive, non-transferable license to use the Service
                  in accordance with these Terms. You agree not to reverse engineer, interfere with security
                  features, or use the Service for unlawful or harmful activities.
                </p>
              </section>

              <section id="merchant-responsibilities" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">5. Merchant Responsibilities</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Operate your store, listings, pricing, and customer service lawfully and professionally.</li>
                  <li>Ensure accuracy of business details (name, address, contact) and product/service information.</li>
                  <li>Fulfil orders/services on time; handle inquiries, complaints, cancellations, and refunds for your Customers.</li>
                  <li>Comply with all applicable laws, including consumer, tax, data protection, and e‑commerce rules.</li>
                  <li>Upload only content you own or have rights to use. You are responsible for your User Content.</li>
                </ul>
              </section>

              <section id="payments-fees-taxes" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">6. Payments, Fees & Taxes</h2>
                <p>
                  Payments and settlements are processed by third‑party payment providers (e.g., Razorpay). Their
                  terms, fees, KYC, and risk controls apply to you. We are not a party to your payment processing
                  agreement, and we do not control payouts, chargebacks, holds, or risk reviews conducted by your
                  payment provider.
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Platform plans and fees (if any) will be disclosed clearly; unless required by law, platform fees are non‑refundable.</li>
                  <li>You are responsible for all taxes applicable to your sales, including registration, collection, and remittance.</li>
                </ul>
              </section>

              <section id="policies" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">7. Refund, Cancellation & Shipping</h2>
                <p>Each Merchant must publish clear and compliant policies for Customers. Add these pages to your storefront footer and order pages:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li><Link href="/cancellation-refund" className="text-blue-600 hover:underline">Cancellation & Refund Policy</Link></li>
                  <li><Link href="/shipping-policy" className="text-blue-600 hover:underline">Shipping/Delivery Policy</Link></li>
                  <li><Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link></li>
                </ul>
                <p>Local Launch is a platform provider and is not responsible for a Merchant’s commitments to Customers.</p>
              </section>

              <section id="content-ip" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">8. Content & Intellectual Property</h2>
                <p>
                  You own your User Content. You grant us a worldwide, non‑exclusive, royalty‑free license to host, store,
                  display, and use your User Content solely to provide and improve the Service. Do not upload illegal,
                  infringing, or harmful content.
                </p>
                <p>The Service (software, design, logos, trademarks) is owned by us or our licensors. Except as permitted above, no rights are granted.</p>
              </section>

              <section id="third-parties" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">9. Third‑Party Services</h2>
                <p>
                  Your use of third‑party services (payment gateways, analytics, shipping, etc.) is subject to their terms and privacy
                  policies. We do not control and are not responsible for third‑party services or their actions, decisions, or outages.
                </p>
              </section>

              <section id="privacy" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">10. Privacy & Data</h2>
                <p>
                  We handle personal data in accordance with our{" "}
                  <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>. You must comply with applicable
                  data protection laws and disclose to Customers how you collect and use their data.
                </p>
              </section>

              <section id="availability-security" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">11. Availability & Security</h2>
                <p>
                  We strive for reliable uptime and security but do not guarantee uninterrupted or error‑free operation. Planned maintenance,
                  updates, or factors outside our control may affect availability. You are responsible for backups of your content.
                </p>
              </section>

              <section id="prohibited" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">12. Prohibited Activities</h2>
                <p>
                  You may not use the Service for unlawful activities or to sell prohibited/regulated goods or services, including those
                  restricted by law or by payment providers. No fraud, IP infringement, spamming, malware, scraping, or interference with
                  the Service.
                </p>
              </section>

              <section id="termination" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">13. Suspension & Termination</h2>
                <p>
                  You may close your account at any time. We may suspend or terminate access immediately if we believe you violate these Terms,
                  applicable law, or pose a risk to Customers, the platform, or third parties. On termination, your license ends and we may retain
                  or delete content as permitted by law.
                </p>
              </section>

              <section id="disclaimers" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">14. Disclaimers</h2>
                <p className="tracking-wide text-gray-800">
                  The Service is provided "as is" and "as available" without warranties of any kind, express or implied, including merchantability,
                  fitness for a particular purpose, and non‑infringement.
                </p>
              </section>

              <section id="liability" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">15. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, we will not be liable for indirect, incidental, special, consequential, exemplary, or
                  punitive damages, or for loss of profits, revenue, data, goodwill, or business interruption.
                </p>
                <p>
                  Our total aggregate liability for any claim arising out of or relating to the Service will not exceed the greater of: (a) INR 5,000; or
                  (b) the total fees you paid to us for the Service in the three (3) months preceding the event giving rise to the claim.
                </p>
              </section>

              <section id="indemnity" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">16. Indemnification</h2>
                <p>
                  You agree to defend, indemnify, and hold harmless Local Launch and its owners, affiliates, officers, directors,
                  employees, and agents from any claims, damages, liabilities, costs, and expenses (including reasonable legal fees)
                  arising from your store, your User Content, your violation of these Terms, or your violation of law or third‑party rights.
                </p>
              </section>

              <section id="governing" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">17. Governing Law & Disputes</h2>
                <p>
                  These Terms are governed by the laws of India. Subject to mandatory law, disputes shall be subject to the exclusive jurisdiction
                  of the courts located in Bengaluru, Karnataka.
                </p>
                <p>
                  Where applicable and permitted by law, you agree to first attempt to resolve disputes informally by contacting us at{" "}
                  <a href="mailto:hello@locallaunch.in" className="text-blue-600 hover:underline">hello@locallaunch.in</a>.
                </p>
              </section>

              <section id="misc" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">18. Miscellaneous</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>No Waiver:</strong> Our failure to enforce any right is not a waiver.</li>
                  <li><strong>Severability:</strong> If any part is invalid, the rest remains effective.</li>
                  <li><strong>Assignment:</strong> You may not assign these Terms without our consent; we may assign as part of a merger, acquisition, or sale.</li>
                  <li><strong>Entire Agreement:</strong> These Terms, along with any plan details and policies referenced, form the entire agreement.</li>
                  <li><strong>Force Majeure:</strong> We are not liable for delays due to events beyond our reasonable control.</li>
                  <li><strong>Electronic Communications:</strong> You consent to receive notices electronically.</li>
                </ul>
              </section>

              <section id="contact" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">19. Contact</h2>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">Local Launch</p>
                    <p>Your Address Line 1</p>
                    <p>City, State, Postal Code</p>
                    <p>India</p>
                    <p className="mt-1">
                      Email:{" "}
                      <a href="mailto:hello@locallaunch.in" className="text-blue-600 hover:underline">
                        hello@locallaunch.in
                      </a>
                    </p>
                    <p>
                      Website:{" "}
                      <a
                        href="https://locallaunch.in"
                        className="text-blue-600 hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        https://locallaunch.in
                      </a>
                    </p>
                  </div>
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