"use client";
import React from 'react';

const Hero = () => {
  return (
    <div className="overflow-x-hidden font-sans">
      {/* ===== HERO SECTION ===== */}
      <section className="relative z-10 min-h-[90vh] flex items-center px-5 md:px-20 pb-32 pt-10 bg-gradient-to-br from-slate-50 via-indigo-50 to-sky-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-40 after:bg-gradient-to-t after:from-slate-50/30 after:to-transparent after:pointer-events-none after:z-[2]">
        
        <div className="relative z-[3] max-w-[1400px] mx-auto w-full flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          
          {/* Hero Content */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-extrabold text-slate-900 leading-tight mb-8 tracking-tight">
              GST Billing Software for Small Businesses in India
            </h1>
            <p className="text-base md:text-lg text-slate-600 leading-relaxed mb-10 max-w-[550px] mx-auto lg:mx-0">
              Manage your business professionally with Vyapar, India's leading small business software for billing, inventory, and accounting. Join 1 Cr+ satisfied SMEs in India who trust Vyapar.
            </p>
            <button className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full text-lg font-semibold shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_15px_35px_rgba(59,130,246,0.4)]">
              Download Vyapar Now!
            </button>
          </div>

          {/* Hero Images Container */}
          <div className="flex-1 relative min-h-[350px] md:min-h-[500px] w-full max-w-[600px]">
            
            {/* Laptop Mockup */}
            <div className="relative w-full aspect-[16/9] bg-slate-900 rounded-t-[20px] p-2 animate-float shadow-2xl z-10">
              <div className="w-full h-full bg-slate-800 rounded-xl overflow-hidden">
                <div className="h-8 bg-slate-700 flex items-center px-4 gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                </div>
                {/* Image Placeholder */}
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-500 italic">
                  Desktop Interface
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[150px] md:w-[200px] h-3 bg-slate-700 rounded-b-xl"></div>
            </div>

            {/* Phone Mockup */}
            <div className="absolute -left-4 md:-left-8 -bottom-5 w-[100px] md:w-[130px] h-[200px] md:h-[250px] bg-slate-800 rounded-[30px] p-1.5 animate-float delay-1000 shadow-xl z-20 hidden sm:block">
              <div className="w-full h-full bg-slate-900 rounded-[25px] flex items-center justify-center text-[10px] text-slate-500">Mobile</div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-[20%] -right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-blue-100 text-blue-600 z-30 hidden md:block animate-bounce">
              ✨ Easy to Use
            </div>
            <div className="absolute bottom-[40%] right-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-purple-100 text-purple-600 z-30 hidden md:block animate-bounce [animation-delay:500ms]">
              👥 Collaborative
            </div>
            <div className="absolute top-[40%] -left-4 bg-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg border border-emerald-100 text-emerald-600 z-30 hidden md:block animate-bounce [animation-delay:1000ms]">
              📊 Activity Stream
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUPERB FEATURES SECTION ===== */}
      <section className="relative z-[5] -mt-20 px-5 md:px-20 pb-24">
        
        {/* Dark Pocket Card */}
        <div className="relative -top-8 bg-slate-900 rounded-[40px] md:rounded-[60px] p-8 md:p-14 pb-0 max-w-[1100px] mx-auto shadow-[0_30px_50px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
          
          <h2 className="text-3xl md:text-[42px] font-bold text-white text-center mb-8 relative z-10">
            We made it <span className="relative inline-block bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent after:content-[''] after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-[3px] after:bg-blue-500/30 after:rounded-full">superb</span> & usable
          </h2>

          {/* Pill Buttons */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-5 mb-12 relative z-10">
            {['Easy to Use', 'Collaborative', 'Activity Stream'].map((pill) => (
              <span key={pill} className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold transition-all hover:bg-blue-500/30 hover:-translate-y-1 hover:border-blue-500 cursor-default shadow-lg">
                {pill}
              </span>
            ))}
          </div>

          {/* Mini White Card */}
          <div className="group relative top-8 h-[350px] md:h-[450px] bg-white rounded-t-[40px] p-6 md:p-10 shadow-[-10px_-10px_30px_rgba(0,0,0,0.1),_0_20px_40px_rgba(0,0,0,0.15)] border border-white/80 transition-transform hover:-translate-y-1 overflow-hidden">
            
            {/* Mini Navbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center rounded-lg font-bold">V</span>
                <span className="text-slate-800 font-bold">Vyapar</span>
              </div>
              <div className="hidden sm:flex gap-6 text-slate-400 text-sm font-medium">
                <span className="hover:text-blue-500 transition-colors">Features</span>
                <span className="hover:text-blue-500 transition-colors">Pricing</span>
                <span className="hover:text-blue-500 transition-colors">About</span>
              </div>
            </div>

            {/* Mini Hero Content */}
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-2">GST Billing Software</h3>
                <p className="text-xs md:text-sm text-slate-500 mb-5">Manage your business professionally</p>
                <button className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-bold shadow-md">Download Now</button>
              </div>

              {/* Mini Mockup Visual */}
              <div className="flex-1 relative hidden md:block">
                <div className="w-48 h-24 bg-slate-800 rounded-t-xl p-1.5 shadow-lg">
                   <div className="w-full h-full bg-slate-900 rounded-lg overflow-hidden">
                      <div className="h-3 bg-slate-700 flex gap-1 px-2 items-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                      </div>
                      <div className="m-2 h-8 bg-blue-500/20 rounded-sm"></div>
                   </div>
                </div>
                <div className="absolute -top-4 right-4 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold shadow-sm">Inventory</div>
                <div className="absolute bottom-4 -right-4 px-3 py-1 bg-white border border-slate-100 rounded-full text-[10px] font-bold shadow-sm">GST Ready</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dotted Background */}
        <div className="absolute inset-0 z-[-1] opacity-30 pointer-events-none" 
             style={{backgroundImage: 'radial-gradient(#cbd5e1 1.5px, transparent 1.5px)', backgroundSize: '25px 25px'}}>
        </div>
      </section>
    </div>
  );
};

export default Hero;