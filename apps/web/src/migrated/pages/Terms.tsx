/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
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

          <h1 className="text-5xl font-medium tracking-tight mb-12">Terms & Conditions</h1>
          
          <div className="prose prose-invert max-w-none space-y-8 text-gray-400 leading-relaxed">
            <section>
              <h2 className="text-2xl font-medium text-white mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using this website's particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on Kurt's website for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Modify or copy the materials;</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website;</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">3. Disclaimer</h2>
              <p>
                The materials on Kurt's website are provided on an 'as is' basis. Kurt makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">4. Limitations</h2>
              <p>
                In no event shall Kurt or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Kurt's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">5. Revisions and Errata</h2>
              <p>
                The materials appearing on Kurt's website could include technical, typographical, or photographic errors. Kurt does not warrant that any of the materials on its website are accurate, complete, or current.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-medium text-white mb-4">6. Governing Law</h2>
              <p>
                Any claim relating to Kurt's website shall be governed by the laws of the jurisdiction without regard to its conflict of law provisions.
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
