import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Terms of Service | The Fast Bill",
  description: "Review the Terms of Service governing your use of The Fast Bill's GST billing and inventory software, including accounts, plans, and acceptable use.",
  path: '/terms-service',
});

const TermsOfService = () => {
  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Terms of Service
            </h1>
            <div className="h-0.5 w-12 bg-gray-300 mb-4"></div>
            <p className="text-gray-500 text-sm">
              Last Updated: {lastUpdated}
            </p>
          </div>

          {/* Content */}
          <div className="space-y-8">
            
            {/* LEGAL and intro */}
            <div>
              <p className="text-gray-600 leading-relaxed font-medium">LEGAL</p>
              <p className="text-gray-600 leading-relaxed text-2xl font-bold mt-1">Terms of Service</p>
              <p className="text-gray-600 leading-relaxed italic mt-2">
                The agreement between you and The Fast Bill for use of our software.
              </p>
              <p className="text-gray-600 leading-relaxed mt-1">
                <strong>Applies to:</strong> thefastbill.com and the Fast Bill mobile application.
              </p>
            </div>

            {/* Contents */}
            <div>
              <p className="text-gray-700 font-medium mb-2">Contents</p>
              <div className="text-gray-600 text-sm space-y-0.5">
                <p>1. Agreement to these terms 1</p>
                <p>2. Eligibility 1</p>
                <p>3. Your account 1</p>
                <p>4. Free trial 1</p>
                <p>5. Plans, fees &amp; payment 1</p>
                <p>6. Cancellation &amp; termination 1</p>
                <p>7. Acceptable use 1</p>
                <p>8. Your content &amp; data 1</p>
                <p>9. Our intellectual property 1</p>
                <p>10. Third-party services 1</p>
                <p>11. Service availability &amp; changes 1</p>
                <p>12. Not tax, accounting, or legal advice 1</p>
                <p>13. Disclaimers 1</p>
                <p>14. Limitation of liability 1</p>
                <p>15. Indemnification 1</p>
                <p>16. Changes to these terms 1</p>
                <p>17. Governing law &amp; disputes 1</p>
                <p>18. General 1</p>
                <p>19. Contact us 1</p>
              </div>
            </div>

            {/* Section 1 */}
            <section id="agreement-to-these-terms">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Agreement to these terms</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms of Service ("Terms") are a binding agreement between you and Leelija Web Solutions Private Limited ("Fast Bill", "we", "us", or "our"), the operator of The Fast Bill, governing your use of our website at thefastbill.com, our mobile application, and related services (together, the "Service").
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                By creating an account, starting a free trial, or otherwise using the Service, you confirm that you have read, understood, and agree to these Terms and to our Privacy Policy. If you do not agree, please do not use the Service. If you are using the Service on behalf of a business, you confirm that you are authorised to bind that business to these Terms.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
              <p className="text-gray-600 leading-relaxed mb-3">To use the Service, you must:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Be at least 18 years of age.</li>
                <li>Be a human; automated sign-ups are not permitted.</li>
                <li>Provide accurate, complete, and current information during registration.</li>
                <li>Use the Service for a lawful business purpose, primarily for billing and inventory needs of a business operating in India.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="your-account">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Your account</h2>
              <p className="text-gray-600 leading-relaxed">
                You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account. You agree to notify us immediately of any unauthorised use of your account. We are not liable for any loss arising from your failure to keep your credentials secure. You may add team members to your account; you remain responsible for their use of the Service.
              </p>
            </section>

            {/* Section 4 */}
            <section id="free-trial">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Free trial</h2>
              <p className="text-gray-600 leading-relaxed">
                We may offer a free trial (currently 14 days) so you can evaluate the Service. No payment details are required to start the trial. At the end of the trial, you may choose a paid plan to continue using paid features. We may change or withdraw trial offers at any time. Any data you create during the trial is subject to our data-retention practices if you do not subscribe.
              </p>
            </section>

            {/* Section 5 */}
            <section id="plans-fees-payment">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Plans, fees &amp; payment</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Some features of the Service are offered under paid subscription plans. The following applies when paid plans are active:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Fees, billing cycles, and plan features are shown on our pricing page and may be updated from time to time.</li>
                <li>Subscription fees are billed in advance for the chosen period and, unless the law requires otherwise, are non-refundable.</li>
                <li>Unless you cancel, plans renew automatically at the end of each billing cycle at the then-current rate.</li>
                <li>Fees are exclusive of applicable taxes (including GST), which will be added where required.</li>
                <li>Payments will be processed by a third-party payment gateway once enabled; we do not store your full card details.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                If we change our fees, we will give you reasonable notice. Continuing to use a paid plan after a fee change means you accept the new fees.
              </p>
            </section>

            {/* Section 6 */}
            <section id="cancellation-termination">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cancellation &amp; termination</h2>
              <p className="font-medium text-gray-800 mt-2">Cancellation by you</p>
              <p className="text-gray-600 leading-relaxed">
                You may cancel your subscription at any time from your account settings or by contacting us. Cancellation takes effect at the end of your current billing period; you will retain access until then, and you will not be charged for the next cycle. We do not provide refunds for partial billing periods unless required by law.
              </p>
              <p className="font-medium text-gray-800 mt-3">Suspension or termination by us</p>
              <p className="text-gray-600 leading-relaxed">
                We may suspend or terminate your access if you breach these Terms, fail to pay fees due, or use the Service in a way that risks harm to us, other users, or third parties. Where practical, we will give you notice and an opportunity to fix the issue first.
              </p>
              <p className="font-medium text-gray-800 mt-3">Effect of termination</p>
              <p className="text-gray-600 leading-relaxed">
                On termination, your right to use the Service ends. We will make your data available for export for a reasonable period after termination, after which it may be deleted in line with our Privacy Policy and applicable law (including statutory record-keeping requirements).
              </p>
            </section>

            {/* Section 7 */}
            <section id="acceptable-use">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Acceptable use</h2>
              <p className="text-gray-600 leading-relaxed mb-3">You agree not to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Use the Service for any unlawful, fraudulent, or unauthorised purpose.</li>
                <li>Access or attempt to access the Service through automated scripts, scrapers, or crawlers, except through interfaces we provide.</li>
                <li>Copy, resell, sublicense, reverse-engineer, or attempt to derive the source code of the Service.</li>
                <li>Upload malware or anything that may disrupt, damage, or impair the Service.</li>
                <li>Interfere with other users' use of the Service or attempt to gain unauthorised access to any account, system, or data.</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="your-content-data">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Your content &amp; data</h2>
              <p className="text-gray-600 leading-relaxed">
                You retain all rights to the data and content you enter into the Service, including your invoices, inventory, and records about your customers ("Your Content"). You grant us a limited licence to host, process, and use Your Content <strong>solely to provide and improve the Service for you</strong>, as described in our Privacy Policy.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                You are responsible for the accuracy and legality of Your Content, for having the right to upload any personal data of your own customers, and for how you use the documents the Service helps you generate. Where you upload personal data about your customers, you act as the data fiduciary and we act as your data processor.
              </p>
            </section>

            {/* Section 9 */}
            <section id="our-intellectual-property">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Our intellectual property</h2>
              <p className="text-gray-600 leading-relaxed">
                The Service, including its software, design, text, graphics, logos, and the "The Fast Bill" name and branding, is owned by us or our licensors and is protected by intellectual property laws. We grant you a limited, non-exclusive, non-transferable right to use the Service during your subscription, subject to these Terms. You may not use our branding without our prior written permission.
              </p>
            </section>

            {/* Section 10 */}
            <section id="third-party-services">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Third-party services</h2>
              <p className="text-gray-600 leading-relaxed">
                The Service may integrate with or link to third-party services, such as payment gateways, analytics providers, and government GST systems. We are not responsible for third-party services, which are governed by their own terms and privacy policies. Your use of any integration is at your own risk.
              </p>
            </section>

            {/* Section 11 */}
            <section id="service-availability-changes">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Service availability &amp; changes</h2>
              <p className="text-gray-600 leading-relaxed">
                We work to keep the Service available and reliable, but we do not guarantee uninterrupted or error-free operation. The Service may be temporarily unavailable for maintenance, updates, or reasons beyond our control. We may add, change, or remove features over time. Where a change materially reduces core functionality of a paid plan, we will give you reasonable notice.
              </p>
            </section>

            {/* Section 12 */}
            <section id="not-tax-accounting-or-legal-advice">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Not tax, accounting, or legal advice</h2>
              <div className="mt-3 p-4 bg-yellow-50 border-l-4 border-yellow-600">
                <p className="text-gray-700">
                  <strong>Important.</strong> The Fast Bill is a software tool to help you create invoices, manage inventory, and prepare GST-related documents. It does not provide tax, accounting, or legal advice. You remain solely responsible for the accuracy of your tax calculations, invoices, and filings, and for complying with all applicable laws, including GST law. We recommend you consult a qualified professional for advice on your specific situation.
                </p>
              </div>
            </section>

            {/* Section 13 */}
            <section id="disclaimers">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Disclaimers</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, the Service is provided "as is" and "as available", without warranties of any kind, whether express or implied, including warranties of merchantability, fitness for a particular purpose, accuracy, or non-infringement. We do not warrant that the Service will meet all your requirements or that any errors will be corrected.
              </p>
            </section>

            {/* Section 14 */}
            <section id="limitation-of-liability">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Limitation of liability</h2>
              <p className="text-gray-600 leading-relaxed">
                To the maximum extent permitted by law, we will not be liable for any indirect, incidental, special, consequential, or punitive damages, or for any loss of profits, revenue, data, or goodwill, arising from or related to your use of (or inability to use) the Service.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                To the extent we are found liable, our total aggregate liability for any claim arising out of or relating to these Terms or the Service will not exceed the amount you paid us for the Service in the twelve (12) months immediately before the event giving rise to the claim (or, if you are on a free plan, a nominal amount permitted by law).
              </p>
            </section>

            {/* Section 15 */}
            <section id="indemnification">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Indemnification</h2>
              <p className="text-gray-600 leading-relaxed">
                You agree to indemnify and hold us harmless from any claims, losses, liabilities, and expenses (including reasonable legal fees) arising from your use of the Service, Your Content, your breach of these Terms, or your violation of any law or the rights of a third party.
              </p>
            </section>

            {/* Section 16 */}
            <section id="changes-to-these-terms">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">16. Changes to these terms</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update these Terms from time to time to reflect changes in the Service or the law. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you through the Service or by email. Your continued use of the Service after an update means you accept the revised Terms.
              </p>
            </section>

            {/* Section 17 */}
            <section id="governing-law-disputes">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">17. Governing law &amp; disputes</h2>
              <p className="text-gray-600 leading-relaxed">
                These Terms are governed by the laws of India. We will try to resolve any dispute with you amicably and in good faith. If a dispute cannot be resolved informally, the courts at Kolkata, West Bengal, India shall have exclusive jurisdiction, subject to any mandatory consumer-protection rights you may have under Indian law.
              </p>
            </section>

            {/* Section 18 */}
            <section id="general">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">18. General</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Entire agreement</strong> — these Terms, together with the Privacy Policy and Cookie Policy, form the entire agreement between you and us regarding the Service.</li>
                <li><strong>Severability</strong> — if any provision is found unenforceable, the rest remains in effect.</li>
                <li><strong>No waiver</strong> — our failure to enforce a provision is not a waiver of it.</li>
                <li><strong>Assignment</strong> — you may not transfer your rights under these Terms without our consent; we may assign ours as part of a merger, acquisition, or sale of assets.</li>
                <li><strong>Force majeure</strong> — we are not liable for delays or failures caused by events beyond our reasonable control.</li>
                <li><strong>Notices</strong> — we may send you notices through the Service or by email to the address on your account.</li>
              </ul>
            </section>

            {/* Section 19 */}
            <section id="contact-us">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">19. Contact us</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong className="text-gray-800">Entity</strong> Leelija Web Solutions Private Limited</p>
                <p><strong className="text-gray-800">CIN</strong> U72900WB2019PTC230773</p>
                <p><strong className="text-gray-800">Email</strong> info@leelija.com</p>
                <p><strong className="text-gray-800">Phone</strong> +91 33 2584 9017</p>
                <p><strong className="text-gray-800">Address</strong> Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</p>
              </div>
              <p className="text-gray-600 leading-relaxed mt-3">
                For how we handle your personal data, see our Privacy Policy at thefastbill.com/privacy.
              </p>
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

export default TermsOfService;