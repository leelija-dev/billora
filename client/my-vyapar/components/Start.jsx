"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Container from "../components/Container";

export default function Start() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 992);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // If not desktop, render without animations
  if (!isDesktop) {
    return (
      <section className="relative w-full min-h-[60vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[50vh] py-10 sm:py-5 md:py-10 lg:py-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 overflow-hidden">
        {/* Static gradient orbs (no animation) */}
        <div className="absolute top-20 left-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-purple-600 rounded-full blur-[140px] opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[130px] opacity-10"></div>

        {/* Subtle noise texture overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>

        <Container size="default">
          <div className="flex flex-col lg:flex-row md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-16 relative">
            
            {/* LEFT TEXT - No animations */}
            <div className="max-w-xl text-center lg:text-left md:text-left px-4 sm:px-0 z-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-6 lg:mb-6 leading-tight">
                Pack Up & Profit <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h2>

              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text mb-4 sm:mb-6 md:mb-6 lg:mb-6 leading-tight">
                #BusinessonTheGo
              </h3>

              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-3 leading-relaxed">
                No desk? Don't Stress!
              </p>

              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-3 leading-relaxed">
                Keep your business booming right from your mobile with our Fast Bill app.
              </p>

              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-6 leading-relaxed">
                Now create & share invoices easily, manage inventory the right way, & track sales reports faster even when you're on the go!
              </p>

              {/* App Store Badges - No hover animations */}
              <div className="flex flex-col sm:flex-row md:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-4 justify-center lg:justify-start md:justify-start items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  className="h-10 sm:h-12 md:h-12 lg:h-12 w-auto cursor-pointer"
                  alt="google play"
                />
              </div>
            </div>

            {/* RIGHT IMAGE - No effects */}
            <div className="relative">
              <img
                src="/image/mobile-image-tall.webp"
                className="w-auto h-full object-contain max-h-[500px] relative z-10"
                alt="phone"
              />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  // Desktop version with animations
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[50vh] py-10 sm:py-5 md:py-10 lg:py-5 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-900 overflow-hidden">

      {/* Animated gradient orbs */}
      <motion.div 
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-20 left-10 w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-indigo-500 rounded-full blur-[120px] opacity-20"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, -80, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-[350px] h-[350px] md:w-[450px] md:h-[450px] bg-purple-600 rounded-full blur-[140px] opacity-20"
      ></motion.div>
      
      <motion.div 
        animate={{ 
          x: [0, 60, 0],
          y: [0, -60, 0],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[130px] opacity-10"
      ></motion.div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]"></div>

      <Container size="default">
        <div className="flex flex-col lg:flex-row md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-16 relative">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="max-w-xl text-center lg:text-left md:text-left px-4 sm:px-0 z-10"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 md:mb-6 lg:mb-6 leading-tight">
                Pack Up & Profit <br className="hidden sm:block" />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Anytime, Anywhere
                </span>
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl font-bold text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-cyan-300 bg-clip-text mb-4 sm:mb-6 md:mb-6 lg:mb-6 leading-tight">
                #BusinessonTheGo
              </h3>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-3 leading-relaxed">
                No desk? Don't Stress!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-3 leading-relaxed">
                Keep your business booming right from your mobile with our Fast Bill app.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-slate-300 text-base sm:text-base md:text-lg lg:text-lg mb-6 leading-relaxed">
                Now create & share invoices easily, manage inventory the right way, & track sales reports faster even when you're on the go!
              </p>
            </motion.div>

            {/* App Store Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row md:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-4 justify-center lg:justify-start md:justify-start items-center"
            >
              <motion.img
                whileHover={{ scale: 1.08, y: -3 }}
                transition={{ type: "spring", stiffness: 300 }}
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                className="h-10 sm:h-12 md:h-12 lg:h-12 w-auto cursor-pointer"
                alt="google play"
              />
            </motion.div>
          </motion.div>

          {/* RIGHT IMAGE with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow behind phone */}
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-[60px] opacity-50"
              style={{ width: '110%', height: '110%', top: '-5%', left: '-5%' }}
            ></motion.div>
            
            <img
              src="/image/mobile-image-tall.webp"
              className="w-auto h-full object-contain max-h-[500px] relative z-10 drop-shadow-2xl"
              alt="phone"
            />
          </motion.div>
        </div>
      </Container>
    </section>
  );
}