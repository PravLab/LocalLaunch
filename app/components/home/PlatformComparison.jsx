// components/PlatformComparison.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Check, 
  X, 
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Shield,
  Star
} from "lucide-react";
import Link from "next/link";

const platforms = [
  {
    id: "locallaunch",
    name: "LocalLaunch",
    isUs: true,
    monthly: 199,
    yearly: 2388,
    commission: "0%",
    setup: "2 min",
    features: {
      unlimitedProducts: true,
      orderManagement: true,
      qrCode: true,
      whatsappOrders: true,
      customDomain: true,
      analytics: true,
      mobileApp: false,
      codingNeeded: false,
    }
  },
  {
    id: "shopify",
    name: "Shopify",
    isUs: false,
    monthly: 1499,
    yearly: 17988,
    commission: "2%",
    setup: "1-2 hrs",
    features: {
      unlimitedProducts: true,
      orderManagement: true,
      qrCode: true,
      whatsappOrders: false,
      customDomain: true,
      analytics: true,
      mobileApp: true,
      codingNeeded: false,
    }
  },
  {
    id: "dukaan",
    name: "Dukaan",
    isUs: false,
    monthly: 499,
    yearly: 5988,
    commission: "0%",
    setup: "5 min",
    features: {
      unlimitedProducts: true,
      orderManagement: true,
      qrCode: true,
      whatsappOrders: true,
      customDomain: true,
      analytics: true,
      mobileApp: true,
      codingNeeded: false,
    }
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    isUs: false,
    monthly: 500,
    yearly: 6000,
    commission: "0%",
    setup: "2-3 days",
    features: {
      unlimitedProducts: true,
      orderManagement: true,
      qrCode: false,
      whatsappOrders: false,
      customDomain: true,
      analytics: true,
      mobileApp: false,
      codingNeeded: true,
    }
  },
];

const featureLabels = {
  unlimitedProducts: "Unlimited Products",
  orderManagement: "Order Management",
  qrCode: "QR Code",
  whatsappOrders: "WhatsApp Orders",
  customDomain: "Custom Domain",
  analytics: "Analytics",
  mobileApp: "Mobile App",
  codingNeeded: "Coding Required",
};

export default function PlatformComparison() {
  const savingsVsShopify = 17988 - 2388;

  return (
    <section id="comparison" className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-[#0a0a0b]">
      <div className="max-w-6xl mx-auto">
        
        {/* ===== HEADER ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            Compare & Save
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            See How We Compare
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
            Same powerful features at a fraction of the cost.
          </p>

          {/* Savings Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800">
            <div className="text-left">
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                You save up to
              </div>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                ₹{savingsVsShopify.toLocaleString('en-IN')}/year
              </div>
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              vs Shopify
            </div>
          </div>
        </motion.div>

        {/* ===== COMPARISON TABLE ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <th className="py-4 px-5 text-left text-sm font-semibold text-gray-600 dark:text-gray-400 min-w-[160px] sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                    Features
                  </th>
                  {platforms.map((platform) => (
                    <th key={platform.id} className={`py-4 px-5 text-center min-w-[120px] ${platform.isUs ? 'bg-indigo-50 dark:bg-indigo-950/30' : ''}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className={`font-bold ${platform.isUs ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                          {platform.name}
                        </span>
                        {platform.isUs && (
                          <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {/* Pricing Row */}
                <tr className="bg-amber-50/50 dark:bg-amber-950/20">
                  <td className="py-4 px-5 text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-amber-50/50 dark:bg-amber-950/20 z-10">
                    Monthly Price
                  </td>
                  {platforms.map((platform) => (
                    <td key={platform.id} className={`py-4 px-5 text-center ${platform.isUs ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                      <div className={`text-lg font-bold ${platform.isUs ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                        ₹{platform.monthly}
                      </div>
                      <div className="text-xs text-gray-500">/month</div>
                    </td>
                  ))}
                </tr>

                {/* Commission Row */}
                <tr>
                  <td className="py-4 px-5 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    Commission
                  </td>
                  {platforms.map((platform) => (
                    <td key={platform.id} className={`py-4 px-5 text-center ${platform.isUs ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
                      <span className={`font-semibold ${platform.commission === '0%' ? 'text-emerald-600' : 'text-red-500'}`}>
                        {platform.commission}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Setup Time Row */}
                <tr>
                  <td className="py-4 px-5 text-sm font-medium text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10">
                    Setup Time
                  </td>
                  {platforms.map((platform) => (
                    <td key={platform.id} className={`py-4 px-5 text-center text-sm ${platform.isUs ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
                      <span className={platform.setup === '2 min' ? 'font-semibold text-emerald-600' : 'text-gray-600 dark:text-gray-400'}>
                        {platform.setup}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Feature Rows */}
                {Object.entries(featureLabels).map(([key, label]) => (
                  <tr key={key}>
                    <td className="py-3 px-5 text-sm text-gray-600 dark:text-gray-400 sticky left-0 bg-white dark:bg-gray-900 z-10">
                      {label}
                    </td>
                    {platforms.map((platform) => {
                      const value = platform.features[key];
                      const isGood = key === 'codingNeeded' ? !value : value;
                      
                      return (
                        <td key={platform.id} className={`py-3 px-5 text-center ${platform.isUs ? 'bg-indigo-50/30 dark:bg-indigo-950/10' : ''}`}>
                          {isGood ? (
                            <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 dark:text-gray-600 mx-auto" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Yearly Cost Row */}
                <tr className="bg-gray-50 dark:bg-gray-800/50">
                  <td className="py-4 px-5 text-sm font-semibold text-gray-900 dark:text-white sticky left-0 bg-gray-50 dark:bg-gray-800/50 z-10">
                    Yearly Cost
                  </td>
                  {platforms.map((platform) => (
                    <td key={platform.id} className={`py-4 px-5 text-center ${platform.isUs ? 'bg-indigo-100/50 dark:bg-indigo-950/40' : ''}`}>
                      <div className={`text-lg font-bold ${platform.isUs ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                        ₹{platform.yearly.toLocaleString('en-IN')}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="font-bold text-lg">Ready to get started?</div>
                <div className="text-white/80 text-sm">
                  Launch your store in just 2 minutes
                </div>
              </div>
              <Link href="/register">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 rounded-xl font-semibold bg-white text-indigo-700 hover:bg-gray-100 transition-colors flex items-center gap-2 shadow-lg"
                >
                  Get Started — ₹199/mo
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* ===== BOTTOM STATS ===== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "₹199", label: "Per Month" },
            { value: "0%", label: "Commission" },
            { value: "2 min", label: "Setup Time" },
            { value: "24/7", label: "Support" },
          ].map((stat, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* ===== TRUST SECTION ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-gray-400" />
              Secure Payments
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-gray-400" />
              No Hidden Fees
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gray-400" />
              Cancel Anytime
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}