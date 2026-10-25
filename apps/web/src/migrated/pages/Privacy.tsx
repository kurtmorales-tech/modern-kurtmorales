/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <h1 className="text-5xl font-medium tracking-tight mb-12">Privacy Policy</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-white mb-4">1. Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or communicate with us. This may include your name, email address, and any other information you choose to provide.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">2. How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our services;</li>
                <li>Send you technical notices, updates, and security alerts;</li>
                <li>Respond to your comments and questions;</li>
                <li>Communicate with you about products, services, and events.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">3. Data Security</h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">4. Third-Party Services</h2>
              <p>
                Our services may contain links to other websites or services that are not owned or controlled by us. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">5. Your Choices</h2>
              <p>
                You may update, correct, or delete information about you at any time by contacting us. You may also opt out of receiving promotional communications from us by following the instructions in those communications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">6. Changes to This Policy</h2>
              <p>
                We may change this privacy policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy and, in some cases, we may provide you with additional notice.
              </p>
            </section>

            <div className="pt-12 border-t border-white/5 text-sm text-gray-600">
              Last updated: March 28, 2026
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
