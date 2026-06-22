"use client";

import React from "react";
import Header from "../_partials/header";
import Footer from "../_partials/footer";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-24 pb-14">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-slate-400">Last updated: June 22, 2026</p>
        </div>

        <div className="space-y-8 text-slate-200">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Introduction</h2>
            <p>
              Welcome to Lilly (&quot;we,&quot; &quot;us,&quot; &quot;our,&quot; or &quot;Company&quot;). We are committed to protecting your privacy and ensuring you have a positive experience on our platform. This Privacy Policy explains our practices regarding data collection, use, and protection.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Information We Collect</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-fuchsia-300 mb-2">2.1 Account Information</h3>
                <p>When you create an account, we collect your email address, nickname, and hashed password for authentication purposes.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fuchsia-300 mb-2">2.2 Chat & Journal Data</h3>
                <p>All conversations, journal entries, and mood tracking data you create are stored in your account and associated with your user profile.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fuchsia-300 mb-2">2.3 Usage Data</h3>
                <p>We may collect anonymized usage statistics such as page visits, features used, and timestamps to improve our service.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-fuchsia-300 mb-2">2.4 Device Information</h3>
                <p>We collect basic device information including browser type, IP address (for security), and device type to optimize your experience.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Provide and improve the Lilly service</li>
              <li>Personalize your experience and provide relevant features</li>
              <li>Authenticate your account and ensure security</li>
              <li>Send administrative communications (e.g., password reset)</li>
              <li>Analyze trends and improve platform functionality</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your information, including:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Passwords hashed using bcrypt encryption</li>
              <li>JWT authentication for secure session management</li>
              <li>HTTPS/TLS encryption for data in transit</li>
              <li>Regular security audits and updates</li>
              <li>Restricted access to sensitive data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Data Retention</h2>
            <p>
              Your chat messages, journal entries, and mood data are retained as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Sharing & Third Parties</h2>
            <p>
              We do not sell, trade, or share your personal information with third parties, except:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li><strong>Service Providers</strong>: MongoDB for database hosting, OpenAI for chat processing</li>
              <li><strong>Legal Requirements</strong>: When required by law, court order, or legal process</li>
              <li><strong>Safety</strong>: If we believe disclosure is necessary to protect safety or prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Your Privacy Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of non-essential communications</li>
              <li>Withdraw consent at any time</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Children&apos;s Privacy</h2>
            <p>
              Lilly is not intended for users under 18 years of age. We do not knowingly collect information from children. If we become aware of unauthorized access by a minor, we will take steps to delete such information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be effective immediately upon posting. Your continued use of Lilly constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-3">
              <strong>Email</strong>: bikku4444@gmail.com<br />
              <strong>Website</strong>: https://www.lillychat.live/
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p className="text-slate-400 text-sm">
              By using Lilly, you agree to this Privacy Policy. If you do not agree, please do not use our service.
            </p>
          </section>
        </div>

        <div className="mt-8 p-6 rounded-lg bg-slate-900/50 border border-white/10">
          <p className="text-sm text-slate-300">
            Have additional questions? <Link href="/" className="text-fuchsia-300 hover:text-fuchsia-400 transition">Return to home</Link> or view our <Link href="/terms" className="text-fuchsia-300 hover:text-fuchsia-400 transition">Terms of Service</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
