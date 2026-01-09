"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Truck, PackageSearch, Clock, FileText, Info } from "lucide-react";

export default function ShippingPolicyPage() {
  const router = useRouter();

  const sections = [
    { id: "scope", label: "Scope of this Policy" },
    { id: "platform", label: "Local Launch — Shipping" },
    { id: "merchant-responsibility", label: "Merchant Responsibilities" },
    { id: "dispatch-delivery", label: "Dispatch & Delivery Timelines" },
    { id: "charges-areas", label: "Shipping Charges & Serviceable Areas" },
    { id: "tracking", label: "Order Tracking" },
    { id: "failed-delivery", label: "Failed Delivery, Address Changes" },
    { id: "damage-loss", label: "Damaged, Lost or Delayed Shipments" },
    { id: "international", label: "International Shipments (if applicable)" },
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
            <span className="inline-flex items-center gap-1 rounded-full bg-green-50 text-green-700 px-3 py-1 text-xs font-medium">
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
              <div className="rounded-lg bg-green-50 text-green-700 p-2">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shipping/Delivery Policy</h1>
                <p className="text-gray-600 mt-1">
                  How shipping and delivery are handled on and around Local Launch.
                </p>
              </div>
            </div>
            <div className="text-xs text-gray-500 flex items-start gap-2 bg-gray-50 border rounded-md p-3">
              <Info className="w-4 h-4 mt-0.5" />
              <span>
                This is a platform‑level policy. Each Merchant hosted on Local Launch must publish its own shipping policy.
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
                  <Link href="/cancellation-refund" className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1">
                    Cancellation & Refund
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
                  Local Launch provides software for businesses to build online stores. We do not operate as a courier or logistics provider and do not ship goods for Merchants.
                </p>
                <p>
                  This policy explains how shipping works on our platform and sets expectations for Merchants and Customers. For a specific order, please refer to the Merchant’s Shipping/Delivery Policy on their store.
                </p>
              </section>

              <section id="platform" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">2) Local Launch — Shipping</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Local Launch does not ship or deliver physical goods.</li>
                  <li>If Local Launch offers digital or subscription services, access is provided online; no physical shipment is involved.</li>
                  <li>Any shipping‑related obligations belong to the Merchant selling the product.</li>
                </ul>
              </section>

              <section id="merchant-responsibility" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">3) Merchant Responsibilities</h2>
                <p>Merchants must publish and honor their own shipping policy, including:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Couriers/methods used and whether Cash on Delivery is available.</li>
                  <li>Dispatch timelines (e.g., within 24–72 hours) and delivery estimates by region.</li>
                  <li>Shipping charges, free‑shipping thresholds, and surcharges for remote areas.</li>
                  <li>Serviceable and non‑serviceable pin codes/regions.</li>
                  <li>Tracking process and where Customers can check order status.</li>
                  <li>Handling of failed deliveries, reattempts, and re‑shipping fees.</li>
                  <li>Process and timeline for damaged/lost shipments and required proof (photos, AWB, unboxing video if required).</li>
                  <li>Returns pickup or drop‑off instructions where applicable.</li>
                </ul>
              </section>

              <section id="dispatch-delivery" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">4) Dispatch & Delivery Timelines</h2>
                <div className="flex items-start gap-3 bg-gray-50 border rounded-lg p-4">
                  <Clock className="w-5 h-5 text-gray-600 mt-0.5" />
                  <p>
                    Typical Merchant timelines are: dispatch within 1–3 business days and delivery within 2–7 business days depending on location and courier capacity. Public holidays, strikes, weather, and other events may affect timelines.
                  </p>
                </div>
              </section>

              <section id="charges-areas" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">5) Shipping Charges & Serviceable Areas</h2>
                <p>
                  Shipping charges are determined by each Merchant based on product weight/volume, destination, courier rates, and current offers. Any free‑shipping thresholds or area‑based restrictions must be clearly disclosed by the Merchant.
                </p>
              </section>

              <section id="tracking" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">6) Order Tracking</h2>
                <div className="flex items-start gap-3 bg-gray-50 border rounded-lg p-4">
                  <PackageSearch className="w-5 h-5 text-gray-600 mt-0.5" />
                  <p>
                    After dispatch, Merchants should share a tracking link or AWB number with Customers. Tracking visibility depends on the courier’s systems and update frequency.
                  </p>
                </div>
              </section>

              <section id="failed-delivery" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">7) Failed Delivery, Address Changes</h2>
                <ul className="list-disc list-inside space-y-1">
                  <li>Address corrections are best requested before dispatch; post‑dispatch changes may not be possible.</li>
                  <li>For failed deliveries (no response/incorrect address), the shipment may return to origin. Re‑shipping may require an additional fee, determined by the Merchant.</li>
                </ul>
              </section>

              <section id="damage-loss" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">8) Damaged, Lost or Delayed Shipments</h2>
                <p>
                  Claims must be raised with the Merchant promptly—typically within 24–48 hours of delivery for damage, and within the courier’s stipulated window for loss or delay claims. Merchants may ask for supporting evidence (photos of packaging/product, unboxing video, AWB/label).
                </p>
                <p className="text-sm text-gray-600">
                  As a platform provider, Local Launch is not liable for courier delays, damage in transit, or losses. Resolution is handled by the Merchant with the courier per their policy.
                </p>
              </section>

              <section id="international" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">9) International Shipments (if applicable)</h2>
                <p>
                  Where international shipping is offered by a Merchant, any customs duties, import taxes, brokerage fees, or regulatory requirements are the Customer’s responsibility unless the Merchant states otherwise.
                </p>
              </section>

              <section id="contact" className="space-y-3 scroll-mt-28">
                <h2 className="text-xl font-bold text-gray-900">10) Contact</h2>
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