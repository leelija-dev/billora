"use client";

import { Handshake, TrendingUp, ShieldCheck, Users, Globe } from "lucide-react";
import Link from "next/link";

// export const metadata = {
//   title: 'Partner with Vyapar | Grow Your Business Together',
//   description: 'Join Vyapar partner network. Choose from Channel Partner, Technology Partner, Implementation Partner, or Referral Partner programs.',
// };

export default function PartnerPage() {
  const partnerTypes = [
    {
      title: 'Channel Partner',
      desc: 'Sell Vyapar to your clients and earn commissions',
      icon: '🤝',
      benefits: ['High commission rates', 'Marketing support', 'Dedicated account manager', 'Sales training']
    },
    {
      title: 'Technology Partner',
      desc: 'Integrate Vyapar with your software solutions',
      icon: '🔌',
      benefits: ['API access', 'Co-marketing opportunities', 'Technical support', 'Early feature access']
    },
    {
      title: 'Implementation Partner',
      desc: 'Help businesses set up and customize Vyapar',
      icon: '⚙️',
      benefits: ['Certification program', 'Lead sharing', 'Premium support', 'Partner portal']
    },
    {
      title: 'Referral Partner',
      desc: 'Refer businesses to Vyapar and earn rewards',
      icon: '💎',
      benefits: ['Easy referral tracking', 'Recurring commissions', 'Marketing materials', 'Fast payouts']
    }
  ];

  const stats = [
    { value: '500+', label: 'Partners' },
    { value: '50Cr+', label: 'Partner Revenue' },
    { value: '30+', label: 'Countries' },
    { value: '4.9', label: 'Partner Rating' },
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

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Partner with Vyapar</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Grow your business while helping others grow theirs
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-2xl shadow-2xl p-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Partner Types */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">Partner Programs</h2>
        <p className="text-gray-600 text-center text-lg mb-12">Choose the partnership that fits your business</p>

        <div className="grid md:grid-cols-2 gap-8">
          {partnerTypes.map((partner, idx) => (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-200 hover:shadow-2xl transition-all hover:-translate-y-2">
              <span className="text-5xl mb-6 block">{partner.icon}</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{partner.title}</h3>
              <p className="text-gray-600 mb-6">{partner.desc}</p>
              <ul className="space-y-3 mb-8">
                {partner.benefits.map((benefit, bidx) => (
                  <li key={bidx} className="flex items-center gap-2 text-gray-700">
                    <span className="text-green-500">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all">
                Apply Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Why Partner */}
      <div className="bg-gray-50 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Why Partner With Us?</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <span className="text-3xl">💰</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Lucrative Commissions</h3>
                    <p className="text-gray-600">Earn competitive commissions on every sale</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl">🚀</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Rapid Growth</h3>
                    <p className="text-gray-600">Join India's fastest-growing billing platform</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Dedicated Support</h3>
                    <p className="text-gray-600">Get priority support from our partner team</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 text-center">
              <span className="text-7xl mb-6 block">🤝</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to partner?</h3>
              <p className="text-gray-600 mb-6">Join our partner network today</p>
              <button className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all">
                Become a Partner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}