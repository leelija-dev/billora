
import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Privacy Policy | The Fast Bill",
  description: "Read The Fast Bill's privacy policy to understand how we collect, use, store, and protect your personal and business data in line with India's DPDP Act",
  path: '/privacy-policy',
});

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
            
            {/* Intro */}
            <div>
              <p className="text-gray-600 leading-relaxed italic">
                How The Fast Bill collects, uses, stores, and protects your data.
              </p>
              <p className="text-gray-600 leading-relaxed mt-1">
                <strong>Applies to:</strong> thefastbill.com and the Fast Bill mobile application.
              </p>
            </div>

            {/* Contents */}
            <div>
              <p className="text-gray-700 font-medium mb-2">Contents</p>
              <div className="text-gray-600 text-sm space-y-0.5">
                <p>1. Who we are 1</p>
                <p>2. Scope of this policy 1</p>
                <p>3. Information we collect 1</p>
                <p>4. How we collect it 1</p>
                <p>5. How we use your information 1</p>
                <p>6. Data you store about your customers 1</p>
                <p>7. Cookies &amp; tracking 1</p>
                <p>8. How we share information 1</p>
                <p>9. Third-party services 1</p>
                <p>10. Data retention 1</p>
                <p>11. How we protect your data 1</p>
                <p>12. Your rights 1</p>
                <p>13. Children's data 1</p>
                <p>14. Changes to this policy 1</p>
                <p>15. Contact &amp; grievances 1</p>
              </div>
            </div>

            {/* Section 1 */}
            <section id="who-we-are">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Who we are</h2>
              <p className="text-gray-600 leading-relaxed">
                The Fast Bill ("Fast Bill", "we", "us", or "our") is a cloud-based GST billing and inventory management
                service operated by <em>Leelija Web Solutions Private Limited</em>, a company registered in India at <em>Taki Road,
                Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</em> with <em>CIN: U72900WB2019PTC230773.</em>
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                We are committed to protecting the privacy of everyone who uses our website at thefastbill.com and
                our mobile application (together, the "Service"). This policy describes our practices in plain language so
                you can make informed decisions about your data.
              </p>
            </section>

            {/* Section 2 */}
            <section id="scope-of-this-policy">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Scope of this policy</h2>
              <p className="text-gray-600 leading-relaxed">
                This policy applies to personal data we handle when you visit our website, create an account, book a
                demo, use the Fast Bill software on web or mobile, contact our support team, or otherwise interact with
                us. It does not cover third-party websites, apps, or services that we link to but do not control.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                By using the Service, you acknowledge that you have read this policy. Where the law requires your
                consent for a specific use of your data, we will ask for it separately.
              </p>
            </section>

            {/* Section 3 */}
            <section id="information-we-collect">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information we collect</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We only collect what we need to run the Service well. This falls into a few categories.
              </p>
              <p className="font-medium text-gray-800 mt-3">Account &amp; identity information</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Your name, email address, phone number, and password (stored in encrypted form).</li>
                <li>Your role and login activity within your business account.</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">Business &amp; tax information</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Business name, address, and contact details.</li>
                <li><strong>GSTIN, PAN</strong>, and other tax registration identifiers used to generate compliant invoices and GST returns.</li>
                <li>Bank or UPI details you choose to add to your invoices.</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">Content you create in the Service</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Invoices, quotations, e-way bills, purchase records, products, stock levels, and pricing.</li>
                <li>Records about your own customers and suppliers that you enter or import (see Section 6).</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">Payment &amp; subscription information</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>The plan you subscribe to and your billing history.</li>
                <li>When we introduce paid subscriptions, payments will be processed by a third-party payment gateway. We will <strong>not</strong> store full card numbers on our servers; that data will be handled by the gateway under its own security standards. We will update this policy to name the provider once it is in place.</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">Device &amp; usage information</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Device type, operating system, browser, and approximate location derived from your IP address.</li>
                <li>How you use the Service — features accessed, pages viewed, and actions taken — to help us improve it.</li>
                <li>Log data and cookies, as described in Section 7.</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">Communications</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li>Messages, support tickets, demo requests, and feedback you send us.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section id="how-we-collect-it">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How we collect it</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Directly from you</strong> — when you sign up, set up your business profile, create invoices, subscribe to a plan, or contact us.</li>
                <li><strong>Automatically</strong> — through cookies and similar technologies as you use the website and app.</li>
                <li><strong>From third parties</strong> — for example, government GST systems return data when you reconcile returns, or (once enabled) a payment gateway confirms a successful payment.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="how-we-use-your-information">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. How we use your information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Create and manage your account and provide the billing, inventory, and reporting features of the Service.</li>
                <li>Generate GST-compliant invoices, e-way bills, and returns, and keep audit-ready records.</li>
                <li>Process your subscription payments and send receipts and renewal reminders.</li>
                <li>Provide customer support and respond to your requests.</li>
                <li>Send service-related notifications, such as security alerts and account updates.</li>
                <li>Send product news and offers — only where you have not opted out; you can unsubscribe at any time.</li>
                <li>Monitor, secure, troubleshoot, and improve the Service, including analytics on how features are used.</li>
                <li>Comply with applicable laws and respond to lawful requests from authorities.</li>
              </ul>
              <div className="mt-3 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-gray-700">
                  We process your data to provide the service you signed up for, for our legitimate interest in running
                  and improving Fast Bill, with your consent (for marketing and optional features), and to meet our
                  legal obligations. <strong>We do not sell your personal data to anyone.</strong>
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section id="data-you-store-about-your-customers">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Data you store about your customers</h2>
              <p className="text-gray-600 leading-relaxed">
                When you use Fast Bill, you may enter or upload personal data about your own customers, clients, and
                suppliers (such as their names, contact details, and GSTINs). For this data, <strong>you are the data fiduciary</strong> and
                Fast Bill acts as a <strong>data processor</strong> on your behalf — we store and process it only to provide the
                Service to you, following your instructions.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                You are responsible for having a lawful basis to collect that data and for telling your customers how you
                use it. We will not use your customers' data for our own purposes or disclose it except as needed to
                operate the Service or as required by law.
              </p>
            </section>

            {/* Section 7 */}
            <section id="cookies-tracking">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies &amp; tracking</h2>
              <p className="text-gray-600 leading-relaxed">
                We use cookies and similar technologies to keep you signed in, remember your preferences, secure the
                Service, and understand how it is used. Some cookies are essential for the Service to work; others are
                optional and used for analytics or marketing.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                You can control or delete cookies through your browser settings, though disabling essential cookies may
                affect how the Service works. For full details, see our Cookie Policy at thefastbill.com/cookies.
              </p>
            </section>

            {/* Section 8 */}
            <section id="how-we-share-information">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. How we share information</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We share personal data only in limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Service providers</strong> — trusted vendors who help us run the Service (cloud hosting, payment processing, email delivery, analytics, and support tools), bound by confidentiality and data-protection obligations.</li>
                <li><strong>Legal &amp; safety</strong> — where we are required to comply with the law, a court order, or a valid request from a government authority, or to protect the rights, safety, and property of Fast Bill, our users, or the public.</li>
                <li><strong>Business transfers</strong> — if we are involved in a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction; we will notify you of any change in control of your data.</li>
                <li><strong>With your consent</strong> — for any other sharing, we will ask you first.</li>
              </ul>
            </section>

            {/* Section 9 */}
            <section id="third-party-services">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Third-party services</h2>
              <p className="text-gray-600 leading-relaxed">
                The Service relies on, or integrates with, third-party providers such as <em>cloud host</em>, <em>[analytics tool, e.g. Google Analytics]</em>, a payment gateway (once enabled), and government GST systems. These providers handle data under their own privacy policies. We encourage you to review the policies of any service you connect to Fast Bill.
              </p>
            </section>

            {/* Section 10 */}
            <section id="data-retention">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Data retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We keep your personal data for as long as your account is active and for as long as needed to provide
                the Service. After your account is closed, we retain certain data where the law requires it — for
                example, tax and invoice records that must be kept for a statutory period — and then delete or
                anonymise it.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                You can request deletion of your data as described in Section 12, subject to these legal retention
                requirements.
              </p>
            </section>

            {/* Section 11 */}
            <section id="how-we-protect-your-data">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. How we protect your data</h2>
              <p className="text-gray-600 leading-relaxed">
                We use reasonable technical and organisational measures to protect your data, including encryption in
                transit, access controls, secure data centres, and regular backups. While no system can be guaranteed
                completely secure, we work to safeguard your information and to detect and respond to incidents
                promptly.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                You also play a part: keep your password confidential, use a strong password, and tell us immediately if
                you suspect any unauthorised access to your account.
              </p>
            </section>

            {/* Section 12 */}
            <section id="your-rights">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Your rights</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Under India's Digital Personal Data Protection Act, 2023 and applicable rules, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Access a summary of the personal data we hold about you and how we process it.</li>
                <li>Request correction or updating of inaccurate or incomplete data.</li>
                <li>Request erasure of your data where it is no longer needed and no law requires us to keep it.</li>
                <li>Withdraw consent you previously gave, and opt out of marketing communications.</li>
                <li>Nominate another person to exercise your rights in the event of death or incapacity.</li>
                <li>Raise a grievance with us, and escalate to the Data Protection Board of India if unresolved.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                To make a request, email us at <a href="mailto:info@leelija.com" className="text-blue-600 hover:underline">info@leelija.com</a>. We may need to verify your identity before acting, and we will respond within the timeframes required by law.
              </p>
            </section>

            {/* Section 13 */}
            <section id="childrens-data">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Children's data</h2>
              <p className="text-gray-600 leading-relaxed">
                The Service is intended for businesses and for users who are 18 years of age or older. We do not
                knowingly collect personal data from children. If you believe a child has provided us with personal data,
                please contact us and we will delete it.
              </p>
            </section>

            {/* Section 14 */}
            <section id="changes-to-this-policy">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">14. Changes to this policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this policy from time to time to reflect changes in our practices, technology, or the law.
                When we make material changes, we will update the "Last updated" date above and, where appropriate,
                notify you through the Service or by email. Your continued use of the Service after an update means
                you accept the revised policy.
              </p>
            </section>

            {/* Section 15 */}
            <section id="contact-grievances">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">15. Contact &amp; grievances</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have questions about this policy or how we handle your data, or you wish to exercise your rights
                or raise a grievance, please contact our Grievance Officer:
              </p>
              <div className="space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong className="text-gray-800">Entity</strong> <em>Leelija Web Solutions Private Limited</em></p>
                <p><strong className="text-gray-800">Grievance Officer</strong> <em>Leelija Team</em></p>
                <p><strong className="text-gray-800">Email</strong> <a href="mailto:info@leelija.com" className="text-blue-600 hover:underline">info@leelija.com</a></p>
                <p><strong className="text-gray-800">Phone</strong> <em>+91 332 584 9017</em></p>
                <p><strong className="text-gray-800">Address</strong> <em>Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</em></p>
              </div>
              <p className="text-gray-600 leading-relaxed mt-3">
                We aim to acknowledge grievances promptly and resolve them within the timeframe required under
                applicable Indian law.
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

export default PrivacyPolicy;