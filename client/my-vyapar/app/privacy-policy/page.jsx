"use client";

import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Privacy Policy
            </h1>
            <div className="h-0.5 w-12 bg-gray-300 mb-4"></div>
            <p className="text-gray-500 text-sm">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* Introduction */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                Your privacy is important to us. This Privacy Policy explains how we collect, use, 
                disclose, and safeguard your information when you use our billing and inventory 
                management software. Please read this policy carefully.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We collect information you provide directly to us when you create an account, use our services, 
                or communicate with us. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>Full name, email address, phone number, and company name</li>
                <li>GST number and billing address</li>
                <li>Username and password for accessing our services</li>
                <li>Invoice details, payment history, and transaction data</li>
                <li>How you interact with our platform and features you use</li>
                <li>IP address, browser type, and device information</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use your information for the following purposes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>Provide, maintain, and improve our billing and inventory management services</li>
                <li>Process transactions and generate GST-compliant invoices</li>
                <li>Communicate with you about your account, updates, and support requests</li>
                <li>Comply with tax and legal obligations under Indian GST laws</li>
                <li>Analyze usage patterns to enhance user experience</li>
                <li>Detect and prevent fraud, security issues, and unauthorized access</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Cookies and Tracking Technologies</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use cookies to enhance your experience. Cookies help us:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>Remember your login session and preferences</li>
                <li>Understand how you use our platform</li>
                <li>Improve website performance and loading times</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                You can control cookies through your browser settings. However, disabling cookies may affect 
                certain features of our service.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We implement industry-standard security measures:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>256-bit SSL encryption for all data transmission</li>
                <li>Regular security audits and vulnerability assessments</li>
                <li>Access controls and authentication protocols</li>
                <li>Secure data centers with 24/7 monitoring</li>
                <li>Regular backups to prevent data loss</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                While we strive to protect your information, no method of transmission over the internet 
                is 100% secure. Please keep your login credentials confidential.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We do not sell your personal information. We may share your data in these circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>With service providers who help us operate our platform (payment processing, hosting, email delivery)</li>
                <li>When required by law, court order, or government regulations (including GST authorities)</li>
                <li>In connection with a merger, acquisition, or sale of assets</li>
                <li>When you explicitly authorize us to share your information</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-sm text-gray-700">
                  <strong>Note for Indian Businesses:</strong> As a GST billing software, we may share necessary 
                  transaction data with tax authorities as required by Indian tax laws.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights and Choices</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>Request a copy of your personal data</li>
                <li>Update inaccurate or incomplete information</li>
                <li>Request deletion of your account and data</li>
                <li>Receive your data in a structured format</li>
                <li>Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                To exercise these rights, contact us at <span className="text-gray-900">privacy@billora.com</span>. 
                We will respond within 30 days.
              </p>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Data Retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We retain your personal information for as long as your account is active or as needed to 
                provide you services. We may also retain data to comply with legal obligations, resolve disputes, 
                and enforce our agreements. Tax-related data may be retained for up to 8 years as required by 
                Indian tax laws.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Third-Party Links</h2>
              <p className="text-gray-600 leading-relaxed">
                Our platform may contain links to third-party websites. Clicking those links may allow third 
                parties to collect your data. We do not control these third-party sites and are not responsible 
                for their privacy practices. Please review their privacy policies before providing any information.
              </p>
            </section>

            {/* Section 9 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Children's Privacy</h2>
              <p className="text-gray-600 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly 
                collect personal information from children. If you believe a child has provided us with 
                personal information, please contact us immediately.
              </p>
            </section>

            {/* Section 10 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to This Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this privacy policy periodically. When we make changes, we will revise the 
                "Last Updated" date at the top of this page. For significant changes, we will notify you 
                via email or through a notice on our platform. We encourage you to review this policy regularly.
              </p>
            </section>

            {/* Section 11 - Contact */}
            <section className="pt-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have questions about this privacy policy or our data practices, please contact us:
              </p>
              <div className="space-y-1 text-gray-600">
                <p><strong className="text-gray-800">Email:</strong> privacy@billora.com</p>
                <p><strong className="text-gray-800">Phone:</strong> +91 7003150015</p>
                <p><strong className="text-gray-800">Address:</strong> Leelija Web Solution Pvt Ltd, Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-6 border-t border-gray-200 text-center">
            <Link 
              href="/" 
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default PrivacyPolicy;