

import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';

export const metadata = {
  title: "GDPR Compliance | The Fast Bill",
  description: "Understand how The Fast Bill handles data protection and your rights under GDPR, including access, correction, erasure, and how to contact us about your data.",
}

const GDPRNotice = () => {
  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              GDPR Notice
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
              <p className="text-gray-600 leading-relaxed text-2xl font-bold mt-1">GDPR Notice</p>
              <p className="text-gray-600 leading-relaxed italic mt-2">
                Data protection information for users in the EEA and the UK.
              </p>
              <p className="text-gray-600 leading-relaxed mt-1">
                <strong>Applies to:</strong> thefastbill.com and the Fast Bill mobile application.
              </p>
            </div>

            {/* Contents */}
            <div>
              <p className="text-gray-700 font-medium mb-2">Contents</p>
              <div className="text-gray-600 text-sm space-y-0.5">
                <p>1. About this notice 1</p>
                <p>2. Who is responsible for your data 1</p>
                <p>3. Personal data we process 1</p>
                <p>4. Legal bases for processing 1</p>
                <p>5. Processing on your behalf 1</p>
                <p>6. International data transfers 1</p>
                <p>7. Your rights under the GDPR 1</p>
                <p>8. Exercising your rights 1</p>
                <p>9. EU / UK representative 1</p>
                <p>10. Data retention 1</p>
                <p>11. Security 1</p>
                <p>12. Changes to this notice 1</p>
                <p>13. Contact us 1</p>
              </div>
            </div>

            {/* Section 1 */}
            <section id="about-this-notice">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. About this notice</h2>
              <p className="text-gray-600 leading-relaxed">
                The Fast Bill is operated from India and is primarily intended for businesses operating in India. This notice provides the additional information required by the EU General Data Protection Regulation ("EU GDPR") and the UK GDPR for individuals located in the European Economic Area ("EEA") and the United Kingdom ("UK").
              </p>
              <div className="mt-3 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-gray-700">
                  <strong>When this notice applies.</strong> The GDPR applies to us only where we offer the Service to, or monitor the behaviour of, individuals in the EEA or UK. Where it applies, the protections below are in addition to the rights described in our Privacy Policy. Our Terms of Service remain governed by the laws of India.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section id="who-is-responsible-for-your-data">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Who is responsible for your data</h2>
              <p className="text-gray-600 leading-relaxed">
                The data controller for personal data of our account holders is Leelija Web Solutions Private Limited, the operator of The Fast Bill, with its registered office at Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India.
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                For the personal data you upload about your own customers and suppliers, you are the controller and Fast Bill acts as your processor, processing that data only on your instructions to provide the Service.
              </p>
            </section>

            {/* Section 3 */}
            <section id="personal-data-we-process">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Personal data we process</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We process the categories of personal data described in our Privacy Policy, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Account and identity data (name, email, phone, password).</li>
                <li>Business and tax data (business name, address, GSTIN, PAN).</li>
                <li>Content you create, and records about your own customers that you upload.</li>
                <li>Payment and subscription data (handled by a payment gateway once enabled).</li>
                <li>Device, usage, and cookie data.</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Please see our Privacy Policy at thefastbill.com/privacy for full details of what we collect and why.
              </p>
            </section>

            {/* Section 4 */}
            <section id="legal-bases-for-processing">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Legal bases for processing</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Where the GDPR applies, we rely on the following legal bases under Article 6:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Performance of a contract</strong> — to create and operate your account and provide the Service you signed up for.</li>
                <li><strong>Legitimate interests</strong> — to secure, maintain, and improve the Service, and to understand how it is used (balanced against your rights and interests).</li>
                <li><strong>Consent</strong> — for optional activities such as marketing communications and non-essential cookies; you can withdraw consent at any time.</li>
                <li><strong>Legal obligation</strong> — to comply with laws that apply to us, including record-keeping requirements.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section id="processing-on-your-behalf">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Processing on your behalf</h2>
              <p className="text-gray-600 leading-relaxed">
                When we act as a processor for the personal data you upload, we process it only on your documented instructions and in accordance with our Privacy Policy and these protections. We apply appropriate confidentiality and security measures, engage sub-processors only under written terms, and assist you, so far as reasonable, with your own obligations as a controller. A data processing agreement is available on request.
              </p>
            </section>

            {/* Section 6 */}
            <section id="international-data-transfers">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. International data transfers</h2>
              <p className="text-gray-600 leading-relaxed">
                We are established in India, so personal data we collect is transferred to and stored in India. India is not currently the subject of an EU or UK adequacy decision. Where we receive personal data of individuals in the EEA or UK, we rely on appropriate safeguards for the transfer, such as the European Commission's Standard Contractual Clauses (and, for UK transfers, the UK International Data Transfer Addendum). You can request a copy of the safeguards we use by contacting us.
              </p>
            </section>

            {/* Section 7 */}
            <section id="your-rights-under-the-gdpr">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Your rights under the GDPR</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If the GDPR applies to you, you have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Access</strong> — obtain confirmation of, and a copy of, the personal data we hold about you.</li>
                <li><strong>Rectification</strong> — have inaccurate or incomplete data corrected.</li>
                <li><strong>Erasure</strong> — have your data deleted where there is no overriding reason to keep it.</li>
                <li><strong>Restriction</strong> — limit how we process your data in certain circumstances.</li>
                <li><strong>Portability</strong> — receive certain data in a structured, commonly used, machine-readable format.</li>
                <li><strong>Objection</strong> — object to processing based on legitimate interests, and to direct marketing at any time.</li>
                <li><strong>Withdraw consent</strong> — where we rely on consent, withdraw it at any time without affecting prior processing.</li>
                <li><strong>Automated decisions</strong> — not be subject to a decision based solely on automated processing that produces legal or similarly significant effects.</li>
                <li><strong>Complain</strong> — lodge a complaint with your local supervisory authority (in the UK, the Information Commissioner's Office).</li>
              </ul>
            </section>

            {/* Section 8 */}
            <section id="exercising-your-rights">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Exercising your rights</h2>
              <p className="text-gray-600 leading-relaxed">
                To exercise any of these rights, email us at info@leelija.com. We will respond within one month, as required by the GDPR, though we may extend this where a request is complex and will tell you if so. We may need to verify your identity before acting. Exercising your rights is free unless a request is manifestly unfounded or excessive.
              </p>
            </section>

            {/* Section 9 */}
            <section id="eu-uk-representative">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. EU / UK representative</h2>
              <p className="text-gray-600 leading-relaxed">
                EU / UK representative Article 27 of the GDPR requires a representative in the EEA or UK only where a business offers its services to, or monitors, individuals located there. The Fast Bill is intended for businesses operating in India, and we do not offer the Service to, or monitor the behaviour of, individuals in the EEA or UK. We have therefore not appointed a representative. If this changes, we will appoint one and update this notice.
              </p>
            </section>

            {/* Section 10 */}
            <section id="data-retention">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Data retention</h2>
              <p className="text-gray-600 leading-relaxed">
                We keep personal data only for as long as needed for the purposes described in our Privacy Policy, or as required by law, after which we delete or anonymise it. See the Data retention section of our Privacy Policy for details.
              </p>
            </section>

            {/* Section 11 */}
            <section id="security">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Security</h2>
              <p className="text-gray-600 leading-relaxed">
                We use appropriate technical and organisational measures to protect personal data, including encryption in transit, access controls, and regular backups, as described in our Privacy Policy. In the event of a personal data breach that is likely to result in a risk to individuals, we will notify the relevant supervisory authority and affected individuals where the GDPR requires.
              </p>
            </section>

            {/* Section 12 */}
            <section id="changes-to-this-notice">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Changes to this notice</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this notice from time to time. When we make material changes, we will update the "Last updated" date above and, where appropriate, notify you through the Service. Your continued use of the Service after an update means you accept the revised notice.
              </p>
            </section>

            {/* Section 13 */}
            <section id="contact-us">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">13. Contact us</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                For any data protection questions, or to exercise your rights, please contact us:
              </p>
              <div className="space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong className="text-gray-800">Controller</strong> Leelija Web Solutions Private Limited</p>
                <p><strong className="text-gray-800">Email</strong> info@leelija.com</p>
                <p><strong className="text-gray-800">Phone</strong> +91 33 2584 9017</p>
                <p><strong className="text-gray-800">Address</strong> Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</p>
              </div>
              <p className="text-gray-600 leading-relaxed mt-3">
                This notice supplements our Privacy Policy (thefastbill.com/privacy), which contains the full details of how we handle personal data.
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

export default GDPRNotice;