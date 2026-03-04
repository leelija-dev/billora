"use client";

import {
  FileText,
  BarChart3,
  ShieldCheck,
  Smartphone,
  Users,
  Layers,
} from "lucide-react";
import Link from "next/link";


// export const metadata = {
//   title: 'Solution - Vyapar | Billing Solutions for Every Business',
//   description: 'Find the perfect billing solution for your business - from small shops to large enterprises.',
// };

export default function SolutionPage() {
  const solutions = [
    {
      category: 'For Small Business',
      items: [
        { title: 'Retail Billing', desc: 'Complete POS solution for retail stores', icon: '🏪' },
        { title: 'Inventory Management', desc: 'Track stock levels in real-time', icon: '📦' },
        { title: 'GST Compliance', desc: 'Auto GST calculations and filing', icon: '🧾' },
        { title: 'Financial Reports', desc: 'Profit & loss, balance sheets', icon: '📊' },
      ]
    },
    {
      category: 'For Enterprises',
      items: [
        { title: 'Multi-branch Management', desc: 'Centralized control', icon: '🏢' },
        { title: 'API Integration', desc: 'Connect with your existing systems', icon: '🔌' },
        { title: 'Advanced Analytics', desc: 'Deep business insights', icon: '📈' },
        { title: 'Dedicated Support', desc: '24/7 priority assistance', icon: '🎯' },
      ]
    },
    {
      category: 'For Professionals',
      items: [
        { title: 'Time Tracking', desc: 'Track billable hours', icon: '⏰' },
        { title: 'Expense Management', desc: 'Track business expenses', icon: '💰' },
        { title: 'Client Portal', desc: 'Share invoices securely', icon: '👥' },
        { title: 'E-signatures', desc: 'Digital document signing', icon: '✍️' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Home Button */}
      <div className="fixed top-24 left-4 z-50">
        <Link 
          href="/"
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 border border-gray-200 group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Solutions for <span className="text-blue-600">Every Business</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tailored billing and accounting solutions for your specific needs
            </p>
          </div>

          {/* Solutions Grid */}
          {solutions.map((section, idx) => (
            <div key={idx} className="mb-16 last:mb-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b-2 border-blue-100">
                {section.category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 hover:border-blue-400 transition-all hover:-translate-y-2 hover:shadow-xl">
                    <span className="text-4xl mb-4 block">{item.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Not sure which solution fits?</h2>
            <p className="text-xl mb-8 opacity-90">Talk to our experts for personalized guidance</p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1">
              Book a Free Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}