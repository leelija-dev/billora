"use client";

import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function AppMicronHero() {
  const { scrollY } = useScroll();
  const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 });

  // Parallax Offsets
  const sheetY = useTransform(smoothY, [0, 1000], [0, -100]);
  const wingLY = useTransform(smoothY, [0, 1000], [0, -250]);
  const wingRY = useTransform(smoothY, [0, 1000], [0, 150]);
  const phoneTilt = useTransform(smoothY, [0, 1000], [0, 10]);

  return (
    <div className="relative min-h-[200vh] bg-[#0f0f0f] text-white overflow-hidden font-sans">
      
      {/* ===== GEOMETRIC BACKGROUND ENGINE ===== */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {/* Dark Angled Sheet */}
        <motion.div 
          style={{ y: sheetY, rotate: -12 }}
          className="absolute -top-[10%] -right-[10%] w-[85%] h-[120%] bg-[#1a1a1a] rounded-[120px] shadow-[0_40px_100px_rgba(0,0,0,0.8)]"
        />

        {/* Purple Wing Left */}
        <motion.div 
          style={{ y: wingLY, rotate: -25 }}
          className="absolute top-[20%] -left-[10%] w-[550px] h-[500px] bg-[#8b66ff] rounded-[80px] shadow-[0_0_80px_rgba(139,102,255,0.4)] opacity-90"
        />

        {/* Purple Wing Right */}
        <motion.div 
          style={{ y: wingRY, rotate: 15 }}
          className="absolute top-[40%] -right-[12%] w-[400px] h-[500px] bg-[#8b66ff] rounded-[100px] shadow-[0_0_80px_rgba(139,102,255,0.4)]"
        />
      </div>

      {/* ===== HEADER ===== */}
      <header className="fixed top-0 w-full flex justify-between items-center px-[8%] py-10 z-50">
        <div className="text-xl font-black uppercase tracking-widest">
          APP<span className="text-[#8b66ff]">micron</span>
        </div>
        <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest opacity-70">
          {["Features", "About", "Services", "Pricing", "Testimonials", "News"].map((item) => (
            <a key={item} href="#" className="hover:text-[#8b66ff] transition-colors">{item}</a>
          ))}
        </nav>
      </header>

      {/* ===== HERO CONTENT ===== */}
      <main className="relative pt-48 px-[10%] grid lg:grid-cols-2 items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h4 className="text-[12px] font-bold uppercase tracking-[0.3em] text-[#8b66ff] mb-4">Introducing</h4>
          <h1 className="text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] mb-8">
            Appmicron
          </h1>
          <p className="text-gray-400 max-w-sm leading-relaxed mb-10">
            Ut non quam risus. Praesent venenatis aliquam rhoncus. Mauris sit amet rhoncus risus, vel ullamcorper leo.
          </p>
          <button className="px-12 py-4 border-2 border-white rounded-xl font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
            Explore
          </button>
        </motion.div>

        {/* Phone Visual */}
        <motion.div 
          style={{ rotateY: -15, rotateX: 5, rotateZ: phoneTilt }}
          className="relative flex justify-center perspective-1000"
        >
          <div className="w-[300px] h-[600px] bg-[#8b66ff] rounded-[50px] border-[14px] border-[#252525] shadow-[50px_50px_100px_rgba(0,0,0,0.6)] relative overflow-hidden">
            {/* Glass Card UI Overlay */}
            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[240px] bg-white rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400" alt="Avatar" className="w-full h-44 object-cover" />
              <div className="p-6 text-center text-black">
                <h3 className="font-bold text-lg">Debora Adele</h3>
                <p className="text-[10px] text-gray-500 mb-4">Artist, NYC</p>
                <div className="flex justify-between text-[10px] font-bold mb-6">
                   <div>1986<br/><span className="font-normal opacity-50">Likes</span></div>
                   <div>2548<br/><span className="font-normal opacity-50">Followers</span></div>
                   <div>1476<br/><span className="font-normal opacity-50">Following</span></div>
                </div>
                <button className="w-full py-3 bg-[#48cfad] text-white rounded-lg font-bold text-[10px] uppercase">Chat</button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* ===== FEATURES FOOTER ===== */}
      <section className="relative mt-32 px-[10%] grid md:grid-cols-4 gap-8 pb-20">
        {[
          { title: "Account Convert", icon: "👤" },
          { title: "Allarm Bell", icon: "⏰" },
          { title: "Android", icon: "🤖" },
          { title: "iOS", icon: "🍎" }
        ].map((item, idx) => (
          <motion.div 
            key={idx}
            whileHover={{ y: -10 }}
            className="p-8 rounded-[30px_30px_80px_30px] bg-white/5 backdrop-blur-md border border-white/10"
          >
            <div className="w-12 h-12 bg-[#8b66ff] rounded-full flex items-center justify-center text-xl mb-6 shadow-[0_0_20px_rgba(139,102,255,0.5)]">
              {item.icon}
            </div>
            <h3 className="font-bold mb-2">{item.title}</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">Maecenas ante sapien, semper nec ullamcorper a, tristique ac dolor.</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}