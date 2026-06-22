"use client";

import React from "react";
import Header from "../_partials/header";
import Footer from "../_partials/footer";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-violet-950 to-slate-950 text-white flex flex-col">
      <Header />
      
      <main className="flex-1 max-w-4xl mx-auto px-6 pt-24 pb-14">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-slate-400">Last updated: June 22, 2026</p>
        </div>

        <div className="space-y-8 text-slate-200">
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">1. Agreement to Terms</h2>
            <p>
              By accessing and using Lilly (&quot;the Platform&quot;), you agree to be bound by these Terms of Service. If you do not agree to any part of these terms, you may not use the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">2. Use License</h2>
            <p>
              We grant you a limited, non-exclusive, non-transferable license to access and use Lilly for personal, non-commercial purposes, subject to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">3. User Responsibilities</h2>
            <p>You agree to:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Provide accurate information during account creation</li>
              <li>Maintain confidentiality of your password and account</li>
              <li>Not use Lilly for illegal, harmful, or abusive purposes</li>
              <li>Not attempt to gain unauthorized access to the Platform</li>
              <li>Not submit content that violates others&apos; rights or our policies</li>
              <li>Use the Platform in accordance with all applicable laws</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">4. Prohibited Activities</h2>
            <p>You may not:</p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>Harass, threaten, or abuse other users</li>
              <li>Share illegal or harmful content</li>
              <li>Attempt to disrupt or overload the Platform</li>
              <li>Scrape, reverse-engineer, or attempt to access source code</li>
              <li>Use Lilly for spam, phishing, or malware distribution</li>
              <li>Violate intellectual property rights</li>
              <li>Impersonate others or misrepresent your identity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">5. Content Ownership & Rights</h2>
            <div className="space-y-3">
                <p>
                <strong>Your Content</strong>: You retain all rights to content you create (journal entries, messages). By using Lilly, you grant us a license to store, process, and display your content within the Platform.
              </p>
              <p>
                <strong>Platform Content</strong>: All text, graphics, logos, images, and software on Lilly are the property of our company or our content suppliers and are protected by copyright law.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">6. Disclaimer of Warranties</h2>
            <p className="mb-4">
              <strong>IMPORTANT:</strong> Lilly is provided &quot;as is&quot; without warranties of any kind, either express or implied.
            </p>
            <p>
              We do not warrant that:
            </p>
            <ul className="list-disc list-inside space-y-2 mt-3">
              <li>The Platform will be uninterrupted or error-free</li>
              <li>Defects will be corrected</li>
              <li>The Platform is secure or free from viruses</li>
              <li>AI responses are always accurate or helpful</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">7. Mental Health Disclaimer</h2>
            <div className="bg-red-950/20 border border-red-700/50 rounded-lg p-4 my-4">
              <p className="font-semibold text-red-200 mb-2">⚠️ Critical Disclaimer</p>
              <p>
                <strong>Lilly is NOT a substitute for professional mental health care.</strong> Our AI companion is designed for support and reflection only, not diagnosis or treatment.
              </p>
              <p className="mt-3">
                If you are experiencing suicidal thoughts, a mental health crisis, or severe emotional distress, please seek help immediately:
              </p>
              <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                <li><strong>National Suicide Prevention Lifeline</strong>: 1-800-273-8255</li>
                <li><strong>Crisis Text Line</strong>: Text HOME to 741741</li>
                <li><strong>Emergency Services</strong>: Call 911 or visit your nearest emergency room</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">8. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, Lilly and its creators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to emotional distress, loss of profits, or data loss.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless Lilly from any claims, damages, or costs arising from your breach of these terms or misuse of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">10. Account Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account if you violate these terms or engage in harmful behavior. Upon termination, your access to the Platform will be revoked.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">11. Modifications to Service</h2>
            <p>
              We may modify, suspend, or discontinue Lilly at any time without prior notice. We are not liable for any loss or inconvenience caused by such changes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">12. Third-Party Links</h2>
            <p>
              Lilly may contain links to third-party websites. We are not responsible for their content, accuracy, or practices. Your use of third-party sites is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">13. Governing Law</h2>
            <p>
              These Terms of Service are governed by and construed in accordance with applicable law. Any disputes shall be resolved in the appropriate courts of jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">14. Changes to Terms</h2>
            <p>
              We may update these Terms of Service at any time. Changes are effective immediately upon posting. Your continued use of Lilly constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white">15. Contact & Support</h2>
            <p>
              For questions about these Terms of Service or concerns about the Platform, contact us at:
            </p>
            <p className="mt-3">
              <strong>Email</strong>: bikku4444@gmail.com<br />
              <strong>Website</strong>: https://www.lillychat.live/
            </p>
          </section>

          <section className="border-t border-white/10 pt-8">
            <p className="text-slate-400 text-sm">
              By using Lilly, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>
        </div>

        <div className="mt-8 p-6 rounded-lg bg-slate-900/50 border border-white/10">
          <p className="text-sm text-slate-300">
            Questions about our terms? <Link href="/" className="text-fuchsia-300 hover:text-fuchsia-400 transition">Return to home</Link> or review our <Link href="/privacy" className="text-fuchsia-300 hover:text-fuchsia-400 transition">Privacy Policy</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
