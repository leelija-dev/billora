// solution/page.jsx


import Link from "next/link";
import { 
  FaStore, FaBoxes, FaFileInvoice, FaChartBar, FaBuilding, 
  FaPlug, FaChartLine, FaBullseye, FaClock, FaMoneyBillWave, 
  FaUsers, FaPenFancy, FaArrowRight, FaRocket, FaHeadset,
  FaDatabase, FaCloud, FaMobile, FaShieldAlt, FaCheckCircle,
  FaAward, FaRegSmile
} from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { MdPhone, MdEmail } from 'react-icons/md';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Billing & Inventory Solutions for Every Business | The Fast Bill",
  description: "Tailored GST billing, inventory, and accounting solutions for retail, enterprises, and professionals. POS, multi-branch, analytics & more. Book a free demo.",
  keywords:"Inventory Solutions, accounting solutions, GST billing solution",
  path: 'solutions',
});

export default function SolutionPage() {
  const solutions = [
    {
      category: 'For Small Business',
      items: [
        { title: 'Retail Billing', desc: 'Complete POS solution for retail stores', icon: <FaStore className="text-3xl sm:text-4xl text-blue-600" /> },
        { title: 'Inventory Management', desc: 'Track stock levels in real-time', icon: <FaBoxes className="text-3xl sm:text-4xl text-green-600" /> },
        { title: 'GST Compliance', desc: 'Auto GST calculations and filing', icon: <FaFileInvoice className="text-3xl sm:text-4xl text-purple-600" /> },
        { title: 'Financial Reports', desc: 'Profit & loss, balance sheets', icon: <FaChartBar className="text-3xl sm:text-4xl text-orange-600" /> },
      ]
    },
    {
      category: 'For Enterprises',
      items: [
        { title: 'Multi-branch Management', desc: 'Centralized control', icon: <FaBuilding className="text-3xl sm:text-4xl text-indigo-600" /> },
        { title: 'API Integration', desc: 'Connect with your existing systems', icon: <FaPlug className="text-3xl sm:text-4xl text-cyan-600" /> },
        { title: 'Advanced Analytics', desc: 'Deep business insights', icon: <FaChartLine className="text-3xl sm:text-4xl text-pink-600" /> },
        { title: 'Dedicated Support', desc: '24/7 priority assistance', icon: <FaBullseye className="text-3xl sm:text-4xl text-red-600" /> },
      ]
    },
    {
      category: 'For Professionals',
      items: [
        { title: 'Time Tracking', desc: 'Track billable hours', icon: <FaClock className="text-3xl sm:text-4xl text-yellow-600" /> },
        { title: 'Expense Management', desc: 'Track business expenses', icon: <FaMoneyBillWave className="text-3xl sm:text-4xl text-emerald-600" /> },
        { title: 'Client Portal', desc: 'Share invoices securely', icon: <FaUsers className="text-3xl sm:text-4xl text-blue-600" /> },
        { title: 'E-signatures', desc: 'Digital document signing', icon: <FaPenFancy className="text-3xl sm:text-4xl text-purple-600" /> },
      ]
    }
  ];

  const features = [
    { icon: <FaDatabase className="text-xl sm:text-2xl" />, title: "Secure Cloud Storage", desc: "Your data is safe with enterprise-grade security" },
    { icon: <FaMobile className="text-xl sm:text-2xl" />, title: "Mobile Ready", desc: "Access from anywhere, on any device" },
    { icon: <FaShieldAlt className="text-xl sm:text-2xl" />, title: "Bank-level Security", desc: "256-bit encryption for all transactions" },
    { icon: <FaHeadset className="text-xl sm:text-2xl" />, title: "24/7 Support", desc: "Dedicated support team always available" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Hero Section - Professional Design */}
      <div className="relative bg-gradient-to-r from-blue-700 to-purple-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 mb-6 hover:bg-white/20 transition-all duration-300">
              <FaRocket className="text-sm" />
              <span className="text-sm font-medium">Trusted by 50,000+ Businesses</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Solutions for <span className="text-blue-300">Every Business</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Tailored billing and accounting solutions for your specific needs
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          
          {/* Trust Badges - Professional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-blue-600 mb-2 hover:scale-110 transition-transform duration-300">50K+</div>
              <div className="text-sm text-gray-600">Active Businesses</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-green-600 mb-2 hover:scale-110 transition-transform duration-300">4.9</div>
              <div className="text-sm text-gray-600">Customer Rating</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-purple-600 mb-2 hover:scale-110 transition-transform duration-300">99.9%</div>
              <div className="text-sm text-gray-600">Uptime Guarantee</div>
            </div>
            <div className="text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
              <div className="text-3xl font-bold text-orange-600 mb-2 hover:scale-110 transition-transform duration-300">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
            </div>
          </div>

          {/* Features Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, idx) => (
              <div key={idx} className="group flex items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Solutions Grid */}
          {solutions.map((section, idx) => (
            <div key={idx} className="mb-20 last:mb-0">
              <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  {section.category}
                </h2>
                <div className="w-16 h-1 bg-blue-600 rounded-full"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.items.map((item, itemIdx) => (
                  <div key={itemIdx} className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 group-hover:text-gray-700 transition-colors duration-300">
                      {item.desc}
                    </p>
                    <div className="flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-2">
                      <span className="text-sm font-medium">Learn more</span>
                      <FaArrowRight className="text-xs group-hover:animate-pulse" />
                    </div>
                    {/* Hover border effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* CTA Section - Clean Professional */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-6 sm:px-8 md:px-12 py-12 sm:py-16 text-center text-white">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Not sure which solution fits?
                </h2>
                <p className="text-base sm:text-lg mb-8 opacity-90">
                  Talk to our experts for personalized guidance
                </p>
                <button className="group inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  Book a Free Consultation
                  <FaArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Trust Indicators */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                <FaShieldAlt className="text-green-600 text-sm group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">ISO 27001 Certified</span>
              </div>
              <div className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                <FaCheckCircle className="text-blue-600 text-sm group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">GDPR Compliant</span>
              </div>
              <div className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                <FaAward className="text-purple-600 text-sm group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">Best Billing Software 2024</span>
              </div>
              <div className="group flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-300 cursor-pointer">
                <FaRegSmile className="text-orange-600 text-sm group-hover:scale-110 transition-transform duration-300" />
                <span className="text-sm">98% Customer Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}