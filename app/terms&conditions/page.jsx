// app/terms/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  const router = useRouter();

  return (
    <div className="bg-white min-h-screen px-6 py-10 text-gray-800">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm flex items-center gap-2 text-gray-600 hover:text-black transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="max-w-3xl mx-auto space-y-6">
        <p className="text-right text-xs text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        <h1 className="text-3xl font-bold mb-4">Terms and Conditions</h1>

        <p className="text-gray-700 text-sm">
          These Terms and Conditions ("Terms") govern your access to and use of the Local
          Launch platform and related services. By signing up or using our services, you
          agree to these Terms.
        </p>

        <section id="account-usage">
          <h2 className="text-2xl font-semibold mt-8">1. Account Creation & Usage</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>You must be 18 years or older to use Local Launch.</li>
            <li>Businesses must provide accurate information (name, address, category, etc.).</li>
            <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
            <li>We reserve the right to suspend accounts for suspicious or abusive activity.</li>
          </ul>
        </section>

        <section id="store-ownership">
          <h2 className="text-2xl font-semibold mt-8">2. Business Store Ownership</h2>
          <p className="mt-2 text-gray-700 text-sm">
            All digital stores created via Local Launch are owned and controlled by the respective
            business owner. We provide hosting and tools but do not claim ownership of your content.
          </p>
        </section>

        <section id="content-policy">
          <h2 className="text-2xl font-semibold mt-8">3. Content Policy</h2>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2 space-y-1">
            <li>Do not upload illegal, offensive, or copyrighted content without permission.</li>
            <li>Images, text, and branding should belong to you or have proper usage rights.</li>
            <li>We may remove content that violates laws or community standards.</li>
          </ul>
        </section>

        <section id="payment-policy">
          <h2 className="text-2xl font-semibold mt-8">4. Payments and Services</h2>
          <p className="mt-2 text-gray-700 text-sm">
            Local Launch may offer free and premium features. Paid features, if introduced, will
            be clearly marked. Refunds are not provided unless required by applicable law.
          </p>
        </section>

        <section id="termination">
          <h2 className="text-2xl font-semibold mt-8">5. Termination</h2>
          <p className="mt-2 text-gray-700 text-sm">
            We reserve the right to terminate or suspend your account at any time if we suspect
            misuse, fraud, or violation of our terms. Users may also delete their account at any time.
          </p>
        </section>

        <section id="liability">
          <h2 className="text-2xl font-semibold mt-8">6. Limitation of Liability</h2>
          <p className="mt-2 text-gray-700 text-sm">
            Local Launch is provided "as is." We are not liable for any direct, indirect, or
            incidental damages resulting from your use of the platform.
          </p>
        </section>

        <section id="privacy">
          <h2 className="text-2xl font-semibold mt-8">7. Privacy Policy</h2>
          <p className="mt-2 text-gray-700 text-sm">
            Your data is handled in accordance with our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>.
            Please review it to understand how we collect and use your information.
          </p>
        </section>

        <section id="updates">
          <h2 className="text-2xl font-semibold mt-8">8. Changes to These Terms</h2>
          <p className="mt-2 text-gray-700 text-sm">
            We may modify these Terms from time to time. If significant changes are made, we’ll
            notify you via email or platform notification.
          </p>
        </section>

        <section id="contact">
          <h2 className="text-2xl font-semibold mt-8">9. Contact Us</h2>
          <p className="mt-2 text-gray-700 text-sm">
            If you have questions about these Terms, please contact us at:
            <br />
            <a href="mailto:hello@locallaunch.in" className="text-blue-600">hello@locallaunch.in</a>
          </p>
        </section>

        <p className="text-sm text-center text-gray-500 mt-12">
          © {new Date().getFullYear()} Local Launch • All rights reserved.
        </p>
      </div>
    </div>
  );
}
