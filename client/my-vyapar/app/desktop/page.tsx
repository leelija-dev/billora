import Link from 'next/link';

export const metadata = {
  title: 'Desktop App - Vyapar | Powerful Billing Software for PC',
  description: 'Download Vyapar desktop app for Windows, Mac, and Linux. Powerful billing software for your computer.',
};

export default function DesktopPage() {
  const features = [
    { title: 'Powerful Dashboard', desc: 'Get complete business overview at a glance', icon: '📊' },
    { title: 'Multi-tasking', desc: 'Handle multiple invoices simultaneously', icon: '🔄' },
    { title: 'Advanced Reports', desc: 'Deep dive into your business analytics', icon: '📈' },
    { title: 'Inventory Management', desc: 'Track stock across multiple warehouses', icon: '📦' },
    { title: 'GST Filing', desc: 'Auto-generate GSTR-1, GSTR-3B reports', icon: '🧾' },
    { title: 'Data Security', desc: 'Enterprise-grade encryption & backup', icon: '🔒' }
  ];

  const systemRequirements = [
    { os: 'Windows 10/11', icon: '🪟' },
    { os: 'macOS Monterey+', icon: '🍎' },
    { os: 'Linux (Ubuntu 20.04+)', icon: '🐧' },
    { os: '4GB RAM minimum', icon: '💾' },
    { os: '2GB free space', icon: '💿' },
    { os: 'Internet connection', icon: '🌐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Vyapar for Desktop</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Powerful billing software for your computer
          </p>
          <div className="flex gap-4 justify-center mt-10">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all hover:-translate-y-1">
              Download for Windows
            </button>
            <button className="bg-white/20 backdrop-blur text-white px-8 py-3 rounded-full font-semibold hover:bg-white/30 transition-all">
              Download for Mac
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
          Powerful Features for Desktop
        </h2>
        <p className="text-gray-600 text-center text-lg mb-12">
          Everything you need to manage your business efficiently
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
              <span className="text-4xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System Requirements */}
      <div className="bg-white py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">System Requirements</h2>
              <div className="grid grid-cols-2 gap-4">
                {systemRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <span className="text-2xl">{req.icon}</span>
                    <span className="font-medium text-gray-700">{req.os}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-12 text-center">
              <span className="text-7xl mb-4 block">💻</span>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to upgrade?</h3>
              <p className="text-gray-600 mb-6">Download the desktop app and experience the difference</p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-700 transition-all">
                Download Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}