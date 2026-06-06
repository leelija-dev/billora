

import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';

export const metadata = {
  title: "Cookie Policy | The Fast Bill",
  description: " Learn how The Fast Bill uses cookies and similar technologies, which are essential vs. optional, and how you can control or manage your cookie preferences.",
}

const CookiePolicy = () => {
  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-white py-12">
      <Container size="default">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              Cookie Policy
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
              <p className="text-gray-600 leading-relaxed text-2xl font-bold mt-1">Cookie Policy</p>
              <p className="text-gray-600 leading-relaxed italic mt-2">
                How The Fast Bill uses cookies and similar technologies.
              </p>
              <p className="text-gray-600 leading-relaxed mt-1">
                <strong>Applies to:</strong> thefastbill.com and the Fast Bill mobile application.
              </p>
            </div>

            {/* Contents */}
            <div>
              <p className="text-gray-700 font-medium mb-2">Contents</p>
              <div className="text-gray-600 text-sm space-y-0.5">
                <p>1. About this policy 1</p>
                <p>2. What are cookies? 1</p>
                <p>3. Why we use cookies 1</p>
                <p>4. Your consent 1</p>
                <p>5. Cookies we use 1</p>
                <p>6. Third-party cookies 1</p>
                <p>7. Managing your cookies 1</p>
                <p>8. "Do Not Track" signals 1</p>
                <p>9. Cookies in our mobile app 1</p>
                <p>10. Changes to this policy 1</p>
                <p>11. Contact us 1</p>
              </div>
            </div>

            {/* Section 1 */}
            <section id="about-this-policy">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. About this policy</h2>
              <p className="text-gray-600 leading-relaxed">
                This Cookie Policy explains how Leelija Web Solutions Private Limited ("Fast Bill", "we", "us", or "our"),
                the operator of The Fast Bill, uses cookies and similar technologies on our website at thefastbill.com and
                in our mobile application (together, the "Service").
              </p>
              <p className="text-gray-600 leading-relaxed mt-2">
                It describes what these technologies are, why we use them, and how you can control them. It should be
                read together with our Privacy Policy, which explains how we handle personal data more generally.
              </p>
            </section>

            {/* Section 2 */}
            <section id="what-are-cookies">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. What are cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that a website places on your device when you visit it. They let the site
                recognise your device, remember your actions and preferences, and keep you signed in across pages.
                "Similar technologies" include things like local storage, pixels, and software development kits (SDKs) in
                mobile apps, which serve comparable purposes.
              </p>
              <p className="font-medium text-gray-800 mt-3">Session vs. persistent cookies</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li><strong>Session cookies</strong> are temporary and are deleted when you close your browser.</li>
                <li><strong>Persistent cookies</strong> remain on your device for a set period or until you delete them.</li>
              </ul>
              <p className="font-medium text-gray-800 mt-3">First-party vs. third-party cookies</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-600">
                <li><strong>First-party cookies</strong> are set by Fast Bill directly.</li>
                <li><strong>Third-party cookies</strong> are set by service providers we use, such as our analytics provider.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="why-we-use-cookies">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Why we use cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-3">We use cookies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li>Keep you signed in and keep your account and session secure.</li>
                <li>Remember your settings and preferences, so the Service works the way you expect.</li>
                <li>Understand how the Service is used, so we can fix problems and improve it.</li>
              </ul>
              <div className="mt-3 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-gray-700">
                  <strong>We do not currently use cookies for advertising or cross-site tracking, and we do not sell your data.</strong> If this changes, we will update this policy and ask for your consent where the law requires it.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section id="your-consent">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Your consent</h2>
              <p className="text-gray-600 leading-relaxed">
                When you first visit our website, we show a cookie banner. Strictly necessary cookies are always active
                because the Service cannot work without them. For optional cookies — such as analytics — we set them
                only if you agree, in line with India's Digital Personal Data Protection Act, 2023. You can change or
                withdraw your choices at any time using the "Cookie settings" option on our website.
              </p>
            </section>

            {/* Section 5 */}
            <section id="cookies-we-use">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies we use</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                The table below describes the cookies we typically use, grouped by category. Exact names and durations
                can change as we improve the Service, but the categories and purposes remain as described.
              </p>
              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-200 px-3 py-2 text-left text-gray-800 font-medium">Category</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-gray-800 font-medium">Example</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-gray-800 font-medium">Purpose</th>
                      <th className="border border-gray-200 px-3 py-2 text-left text-gray-800 font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Strictly necessary</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">session / auth</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Keeps you signed in and secures your session.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Session (up to 30 days if "remember me" is on)</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Strictly necessary</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">csrf_token</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Protects forms and requests against cross-site request forgery.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Session</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Strictly necessary</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">cookie_consent</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Remembers your cookie choices.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">6–12 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Preferences</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">preferences</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Remembers settings such as language and layout.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Up to 12 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Analytics</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">usage analytics</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Measures how the Service is used so we can improve it.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Up to 13 months</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 font-medium">Analytics</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600 italic">session analytics</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">Distinguishes visitors for short-term usage measurement.</td>
                      <td className="border border-gray-200 px-3 py-2 text-gray-600">24 hours</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-gray-600 leading-relaxed mt-3 italic text-sm">
                Analytics cookies are only set after you accept them in the cookie banner.
              </p>
            </section>

            {/* Section 6 */}
            <section id="third-party-cookies">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Third-party cookies</h2>
              <p className="text-gray-600 leading-relaxed">
                To understand usage, we may rely on a third-party analytics provider, <em>Google Analytics</em> Such providers
                may set their own cookies and process data under their own privacy policies. We encourage you to
                review the policy of any provider we name here. We do not control third-party cookies, but you can
                manage them using the controls described in Section 7.
              </p>
            </section>

            {/* Section 7 */}
            <section id="managing-your-cookies">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Managing your cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-3">You have several ways to control cookies:</p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600">
                <li><strong>Our cookie banner</strong> — accept, reject, or change optional cookies at any time through "Cookie settings" on our website.</li>
                <li><strong>Your browser</strong> — Chrome, Firefox, Safari, and Edge all let you block or delete cookies in their settings. Check your browser's help pages for instructions.</li>
                <li><strong>Your device</strong> — mobile operating systems let you reset or limit advertising identifiers used by apps.</li>
              </ul>
              <div className="mt-3 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-gray-700">
                  <strong>Please note:</strong> blocking strictly necessary cookies will stop parts of the Service from working, including signing in.
                </p>
              </div>
            </section>

            {/* Section 8 */}
            <section id="do-not-track-signals">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. "Do Not Track" signals</h2>
              <p className="text-gray-600 leading-relaxed">
                Some browsers can send a "Do Not Track" signal. There is no common industry standard for how to
                respond to it, so we currently rely on the choices you make in our cookie banner as the controlling
                preference.
              </p>
            </section>

            {/* Section 9 */}
            <section id="cookies-in-our-mobile-app">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Cookies in our mobile app</h2>
              <p className="text-gray-600 leading-relaxed">
                Our mobile application may use similar technologies — such as local storage, device identifiers, and
                SDKs — for the same purposes described above: keeping you signed in, remembering your preferences,
                and understanding usage. You can manage these through your device settings.
              </p>
            </section>

            {/* Section 10 */}
            <section id="changes-to-this-policy">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Changes to this policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy from time to time to reflect changes in the technologies we use or in
                the law. When we make material changes, we will update the "Last updated" date above and, where
                appropriate, notify you through the Service. Your continued use of the Service after an update means
                you accept the revised policy.
              </p>
            </section>

            {/* Section 11 */}
            <section id="contact-us">
              <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Contact us</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have any questions about this Cookie Policy or how we use cookies, please contact us:
              </p>
              <div className="space-y-1 text-gray-600 bg-gray-50 p-4 rounded-lg">
                <p><strong className="text-gray-800">Entity</strong> Leelija Web Solutions Private Limited</p>
                <p><strong className="text-gray-800">Email</strong> info@leelija.com</p>
                <p><strong className="text-gray-800">Phone</strong> +91 33 2584 9017</p>
                <p><strong className="text-gray-800">Address</strong> Taki Road, Bamunmura, Barasat, Kolkata - 700125, West Bengal, India</p>
              </div>
              <p className="text-gray-600 leading-relaxed mt-3">
                For more on how we handle personal data, please see our Privacy Policy at thefastbill.com/privacy.
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

export default CookiePolicy;