// app/privacy-policy/page.jsx
"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
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
        <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>

        <ul className="list-decimal list-inside space-y-1 text-sm">
          {[
            "Information we collect",
            "How we use it",
            "Sharing with others",
            "Your privacy rights",
            "Data security",
            "Cookies & tracking",
            "Children",
            "Changes to this policy",
            "Contact us",
          ].map((item) => (
            <li key={item}>
              <a
                href={`#${item.replace(/\s+/g, "-").toLowerCase()}`}
                className="text-blue-600 hover:underline"
              >
                {item}
              </a>
            </li>
          ))}
        </ul>

        <section id="information-we-collect">
          <h2 className="text-2xl font-semibold mt-8">
            1. Information We Collect
          </h2>
          <p className="mt-2 text-gray-700">
            To provide you with a smooth and secure experience on Local Launch,
            we collect only the essential data required to create, manage, and
            grow your online business. We take your privacy seriously, and all
            information is collected with transparency and purpose.
          </p>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            🧑 Personal Information
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              <strong>Name:</strong> To personalize your dashboard and business
              site.
            </li>
            <li>
              <strong>Email Address:</strong> For login, verification, support,
              and important updates.
            </li>
            <li>
              <strong>Phone Number (optional):</strong> If you provide it, we
              may use it for support or order updates.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            🏪 Business Information
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              <strong>Business Name & Slug:</strong> Used to create your online
              store (e.g., yourstore.locallaunch.in).
            </li>
            <li>
              <strong>Address & City:</strong> To display store location and for
              discovery in local searches.
            </li>
            <li>
              <strong>Business Type & Category:</strong> Helps customers find
              the right store by filtering relevant listings.
            </li>
            <li>
              <strong>Logo & Images:</strong> To visually represent your brand
              on your poster and site.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            📊 Technical & Usage Data
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              <strong>Device & Browser Type:</strong> For optimizing design and
              features based on your device.
            </li>
            <li>
              <strong>IP Address:</strong> For location-based services and to
              secure accounts from fraud or abuse.
            </li>
            <li>
              <strong>Page Visits & Interactions:</strong> Helps us understand
              what features are useful and where improvements are needed.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            All data is collected with your consent, and only for purposes
            directly related to your usage of Local Launch. We do not collect
            sensitive personal data such as financial details, biometrics, or
            Aadhaar-related information unless required by law and with your
            permission.
          </p>
        </section>

        <section id="how-we-use-it">
          <h2 className="text-2xl font-semibold mt-8">
            2. How We Use Your Information
          </h2>
          <p className="mt-2 text-gray-700">
            We use the information you provide to operate Local Launch
            effectively, to help your business grow online, and to ensure your
            experience is secure, reliable, and personalized.
          </p>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            🛠 To Provide and Maintain the Service
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              To create and manage your digital storefront (e.g.,
              yourstore.locallaunch.in).
            </li>
            <li>
              To verify your identity and securely store your business data.
            </li>
            <li>
              To allow customers to view your products and place orders if
              enabled.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            📢 To Communicate With You
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              To send service-related notifications, platform updates, or
              critical alerts.
            </li>
            <li>
              To respond to your questions, support requests, or feedback.
            </li>
            <li>
              To send helpful tips, guides, or promotional content — only if
              you’ve opted in.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            📈 To Improve Our Platform
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              To analyze usage data and make the website faster, easier to use,
              and more useful.
            </li>
            <li>
              To understand which features are most helpful for local
              businesses.
            </li>
            <li>
              To test new features and improvements with real feedback (we don’t
              use personal data for this).
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            🔐 To Protect You and Others
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>To detect and prevent fraud, spam, and unauthorized access.</li>
            <li>
              To enforce our Terms of Use and safeguard business owners and
              customers alike.
            </li>
            <li>
              To comply with applicable Indian laws and regulations when
              required.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            We do not use your data for anything unrelated to Local Launch
            operations, and we never sell your personal or business information
            to third parties.
          </p>
        </section>

        <section id="sharing-with-others">
          <h2 className="text-2xl font-semibold mt-8">
            3. Sharing Your Information with Others
          </h2>
          <p className="mt-2 text-gray-700">
            At Local Launch, <strong>we do not sell, rent, or trade</strong>{" "}
            your personal or business information. We only share data when it’s
            necessary to provide our services, comply with the law, or protect
            our platform.
          </p>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            🤝 Service Partners & Infrastructure
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              We share minimal business data with partners like Supabase
              (database), Vercel (hosting), and file storage/CDNs — only to
              deliver the core features of your online store.
            </li>
            <li>
              These partners follow strict data handling and encryption
              standards.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            📊 Analytics & Platform Monitoring
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              We may share **non-identifiable data** (e.g., clicks, page visits,
              error logs) with analytics tools like Vercel Analytics or
              privacy-respecting alternatives.
            </li>
            <li>
              This helps us understand how users interact with the platform and
              improve your experience.
            </li>
          </ul>

          <h3 className="mt-4 font-semibold text-lg text-gray-800">
            ⚖️ Legal Compliance & Safety
          </h3>
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            <li>
              We may share information when required by Indian law, court order,
              or government regulation.
            </li>
            <li>
              We may disclose details to protect Local Launch users, enforce our
              Terms, or prevent fraud or cyberattacks.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            Whenever we share data, we ensure it is protected, encrypted where
            necessary, and shared only with trusted providers. Your privacy and
            trust are at the heart of how Local Launch operates.
          </p>
        </section>

        <section id="your-privacy-rights">
          <h2 className="text-2xl font-semibold mt-8">
            4. Your Privacy Rights
          </h2>
          <p className="mt-2 text-gray-700">
            We believe your personal and business data belongs to you. As a user
            of Local Launch, you have full rights and control over your
            information. Here’s what you can do:
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-2">
            <li>
              <strong>🔍 Access Your Data:</strong> You may request to view the
              personal or business data we store about you at any time.
            </li>
            <li>
              <strong>✏️ Update Your Information:</strong> You can correct
              inaccurate or outdated details such as your business name, contact
              info, or logo.
            </li>
            <li>
              <strong>🗑️ Request Deletion:</strong> You have the right to delete
              your business profile or request permanent erasure of your account
              data.
            </li>
            <li>
              <strong>📩 Unsubscribe Anytime:</strong> You can opt out of
              marketing emails and service-related notifications with a single
              click.
            </li>
            <li>
              <strong>🚫 “Do Not Track”:</strong> You can enable this setting in
              your browser. We respect DNT signals and avoid aggressive tracking
              techniques.
            </li>
            <li>
              <strong>📜 Right to Explanation (India-specific):</strong> If we
              make automated decisions (e.g., in recommendations), you can
              request an explanation under India’s DPDP Act.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            To make a request or exercise your rights, simply email us at{" "}
            <a href="mailto:hello@locallaunch.in" className="text-blue-600">
              hello@locallaunch.in
            </a>
            . We respond to all requests within 7 business days.
          </p>
        </section>

        <section id="data-security">
          <h2 className="text-2xl font-semibold mt-8">5. Data Security</h2>

          <p className="mt-2 text-gray-700">
            At Local Launch, your data’s safety is our top priority. We follow
            industry-leading practices to ensure your personal and business
            information remains secure, both in transit and at rest.
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-2">
            <li>
              <strong>🔒 End-to-End Encryption:</strong> All communication
              between your browser and our servers is encrypted via{" "}
              <strong>HTTPS (TLS 1.2+)</strong> to prevent tampering or
              eavesdropping.
            </li>
            <li>
              <strong>🗃️ Secure Storage:</strong> Your data is stored on{" "}
              <strong>Supabase</strong> using role-based access control, data
              encryption at rest, and secure object storage for assets like
              logos.
            </li>
            <li>
              <strong>🏗️ Secure Infrastructure:</strong> Our platform is
              deployed on <strong>Vercel</strong>, which provides serverless
              deployment with automatic scaling, hardened environments, and
              frequent security patching.
            </li>
            <li>
              <strong>🛡️ Controlled Access:</strong> Only authorized personnel
              can access backend systems, and all access is logged and
              monitored.
            </li>
            <li>
              <strong>🔁 Backups & Recovery:</strong> Regular backups are
              maintained to prevent data loss in case of unexpected events or
              failures.
            </li>
            <li>
              <strong>📍 Local Compliance:</strong> We take additional steps to
              align with India’s data protection standards under the{" "}
              <strong>Digital Personal Data Protection Act, 2023</strong>.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            While no system is 100% immune to risk, we continuously monitor,
            audit, and improve our security infrastructure to keep your data
            safe from unauthorized access, misuse, or breaches.
          </p>
        </section>

        <section id="cookies--tracking">
          <h2 className="text-2xl font-semibold mt-8">6. Cookies & Tracking</h2>

          <p className="mt-2 text-gray-700">
            We use a minimal and privacy-respecting approach when it comes to
            cookies and online tracking. Our goal is to provide a smooth
            experience without invading your privacy.
          </p>

          <ul className="list-disc list-inside text-sm text-gray-700 mt-3 space-y-2">
            <li>
              <strong>🍪 Essential Cookies:</strong> We only use cookies that
              are necessary for login sessions, secure authentication, and to
              keep you logged into your admin dashboard.
            </li>
            <li>
              <strong>📊 No Behavioral Ads:</strong> We do not use cookies for
              personalized advertising, retargeting, or any third-party ad
              tracking.
            </li>
            <li>
              <strong>📈 Analytics (Optional):</strong> We may use privacy-first
              analytics tools (like Plausible or Vercel Analytics) to understand
              basic usage patterns — but without collecting personal data or IP
              addresses.
            </li>
            <li>
              <strong>⚙️ User Control:</strong> You can manage or disable
              cookies anytime through your browser settings. Disabling cookies
              may affect login or dashboard functionality.
            </li>
            <li>
              <strong>🛑 No Hidden Trackers:</strong> We do not embed invisible
              trackers, fingerprinting scripts, or other intrusive tools on your
              storefront or admin pages.
            </li>
          </ul>

          <p className="mt-4 text-sm text-gray-600">
            We believe in giving you full control over your data. If we ever
            introduce new cookies or tracking methods in the future, we’ll
            update this page and notify users where necessary.
          </p>
        </section>

        <section id="children">
          <h2 className="text-2xl font-semibold mt-8">7. Children</h2>

          <p className="mt-2 text-gray-700">
            Local Launch is designed for use by adults and business owners. We
            do not knowingly collect, use, or store personal information from
            children under the age of <strong>13</strong>. If you are under 13,
            please do not submit any personal data through our platform.
          </p>

          <p className="mt-3 text-gray-700">
            If we discover that we have accidentally collected information from
            a child under 13, we will promptly delete such data from our
            records. If you believe that a child has provided personal data to
            us without parental consent, please contact us immediately at{" "}
            <a href="mailto:hello@locallaunch.in" className="text-blue-600">
              hello@locallaunch.in
            </a>
            .
          </p>

          <p className="mt-3 text-gray-600 text-sm">
            Parents or guardians who believe their child has submitted personal
            data to Local Launch can reach out to review, correct, or delete
            that information in accordance with applicable privacy laws.
          </p>
        </section>

        <section id="changes-to-this-policy">
          <h2 className="text-2xl font-semibold mt-8">
            8. Changes to This Policy
          </h2>

          <p className="mt-2 text-gray-700">
            We may update this Privacy Policy from time to time to reflect
            changes in our services, technology, legal obligations, or business
            practices. Any changes we make will be posted on this page with an
            updated "Last Updated" date at the top of the policy.
          </p>

          <p className="mt-3 text-gray-700">
            If the changes are significant or impact your rights in any material
            way, we will provide notice by:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Emailing you at the address you provided, where applicable.</li>
            <li>
              Placing a prominent notice on our website or admin dashboard.
            </li>
          </ul>

          <p className="mt-3 text-gray-700">
            We encourage you to periodically review this page to stay informed
            about how we are protecting your information and maintaining
            transparency.
          </p>
        </section>

        <section id="contact-us">
          <h2 className="text-2xl font-semibold mt-8">9. Contact Us</h2>

          <p className="mt-2 text-gray-700">
            If you have any questions, concerns, or feedback about this Privacy
            Policy or how your personal data is handled, please don’t hesitate
            to get in touch with us.
          </p>

          <p className="mt-3 text-gray-700">
            You can reach our support team directly by email at{" "}
            <a
              href="mailto:hello@locallaunch.in"
              className="text-blue-600 underline"
            >
              hello@locallaunch.in
            </a>
            . We strive to respond to all inquiries within 2–3 business days.
          </p>

          <p className="mt-3 text-gray-700">
            Postal communication (for legal or regulatory correspondence) can be
            addressed to our official address upon request.
          </p>
        </section>

        <p className="text-sm text-center text-gray-500 mt-12">
          © {new Date().getFullYear()} Local Launch • All rights reserved.
        </p>
      </div>
    </div>
  );
}
