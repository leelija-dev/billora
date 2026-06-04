"use client";

import React from 'react';
import Container from '@/components/Container'; 
import Link from 'next/link';

const CookiePolicy = () => {
  const lastUpdated = "January 15, 2026";

  return (
    <div className="min-h-screen bg-white pt-24 pb-16">
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
            
            {/* Introduction */}
            <div>
              <p className="text-gray-600 leading-relaxed">
                This Cookie Policy explains how we use cookies and similar technologies on our website and 
                billing software platform. By using our services, you consent to the use of cookies as 
                described in this policy.
              </p>
            </div>

            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. What Are Cookies?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies are small text files that are stored on your device (computer, tablet, or mobile) 
                when you visit a website. They help websites recognize your device, remember your preferences, 
                and improve your browsing experience. Cookies do not contain viruses or malicious code.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Types of Cookies We Use</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                We use the following types of cookies on our platform:
              </p>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2.1 Essential Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are necessary for our platform to function properly. They enable core 
                    features such as:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                    <li>User authentication and login sessions</li>
                    <li>Secure access to your account and billing data</li>
                    <li>Navigation and basic platform functionality</li>
                    <li>Remembering items in your shopping cart or invoice drafts</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-2 text-sm text-gray-500">
                    These cookies cannot be disabled as the platform would not work properly without them.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2.2 Preference Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies remember your choices and preferences to provide a personalized experience:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                    <li>Language and region preferences</li>
                    <li>Interface layout and theme settings</li>
                    <li>Saved filters and view preferences in reports</li>
                    <li>Notification settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2.3 Analytics Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies help us understand how users interact with our platform to improve performance:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                    <li>Pages visited and time spent on each page</li>
                    <li>Features most commonly used</li>
                    <li>Error messages and platform performance issues</li>
                    <li>User journey and navigation patterns</li>
                  </ul>
                  <p className="text-gray-600 leading-relaxed mt-2">
                    We use this anonymous data to enhance user experience and optimize our platform.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2.4 Session Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies are temporary and expire when you close your browser. They are used to:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                    <li>Maintain your login status during a browsing session</li>
                    <li>Process transactions securely</li>
                    <li>Store temporary data while generating invoices</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">2.5 Persistent Cookies</h3>
                  <p className="text-gray-600 leading-relaxed">
                    These cookies remain on your device for a set period or until you delete them. They help:
                  </p>
                  <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                    <li>Remember your login information for future visits</li>
                    <li>Store long-term preferences and settings</li>
                    <li>Track returning users for analytics purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                Some cookies are placed by third-party services that we use to enhance our platform:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li><strong className="text-gray-800">Payment Gateways:</strong> To process transactions securely</li>
                <li><strong className="text-gray-800">Analytics Services:</strong> To understand platform usage patterns</li>
                <li><strong className="text-gray-800">Support Widgets:</strong> To provide customer support features</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                These third parties have their own cookie policies, and we encourage you to review them. 
                We do not control these third-party cookies.
              </p>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. How Long Do Cookies Last?</h2>
              <p className="text-gray-600 leading-relaxed">
                Cookies remain on your device for different durations:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600 leading-relaxed">
                <li><strong className="text-gray-800">Session Cookies:</strong> Deleted when you close your browser</li>
                <li><strong className="text-gray-800">Persistent Cookies:</strong> Remain for up to 12 months or until manually deleted</li>
                <li><strong className="text-gray-800">Authentication Cookies:</strong> Last for the duration of your login session</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Managing Cookie Preferences</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-600 leading-relaxed">
                <li>Adjust your browser settings to block or delete cookies</li>
                <li>Use your browser's incognito or private browsing mode</li>
                <li>Install browser extensions that block tracking cookies</li>
                <li>Access our cookie consent settings on first visit</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mt-3">
                Please note that blocking essential cookies may prevent our platform from functioning 
                correctly. You may not be able to log in, generate invoices, or access your billing data.
              </p>
              
              <div className="mt-4 p-4 bg-gray-50 border-l-4 border-gray-400">
                <p className="text-sm text-gray-700">
                  <strong>Browser Instructions:</strong> Most browsers allow you to manage cookies through their 
                  settings. Look for "Privacy" or "Cookies" in your browser's menu. For specific instructions, 
                  visit your browser's help documentation.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Cookie Consent</h2>
              <p className="text-gray-600 leading-relaxed">
                When you first visit our website, you will see a cookie consent banner explaining our use of 
                cookies. By continuing to use our platform, you consent to our use of cookies as described 
                in this policy. You can withdraw your consent at any time by:
              </p>
              <ul className="list-disc pl-6 mt-3 space-y-2 text-gray-600 leading-relaxed">
                <li>Clearing cookies from your browser</li>
                <li>Adjusting your browser settings to block cookies</li>
                <li>Clicking the "Revoke Consent" option in our cookie settings</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Updates to This Cookie Policy</h2>
              <p className="text-gray-600 leading-relaxed">
                We may update this Cookie Policy periodically to reflect changes in technology, legal 
                requirements, or our business practices. When we make changes, we will revise the 
                "Last Updated" date at the top of this page. For significant changes, we will notify 
                you via email or through a notice on our platform.
              </p>
            </section>

            {/* Section 8 */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-3">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
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

export default CookiePolicy;