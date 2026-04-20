"use client";

import React from "react";
import { motion } from "framer-motion";
import Container from "../components/Container";

export default function Start() {
  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[50vh] md:min-h-[60vh] lg:min-h-[50vh] py-10 sm:py-5 md:py-10 lg:py-5 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 overflow-hidden">

      {/* Glow background shapes */}
      <div className="absolute -top-20 -left-20 w-[350px] h-[350px] md:w-[350px] md:h-[350px] bg-indigo-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] md:w-[400px] md:h-[400px] bg-sky-200 rounded-full blur-[140px] opacity-40"></div>

      <Container size="default">
        <div className="flex flex-col lg:flex-row md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-16 relative">
          
          {/* LEFT TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-xl text-center lg:text-left md:text-left px-4 sm:px-0"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-6 lg:mb-6 leading-tight">
              Carry Your Business <br className="hidden sm:block" />
              <span className="text-indigo-600">Wherever You Go</span>
            </h2>

            <p className="text-slate-600 text-base sm:text-base md:text-lg lg:text-lg mb-3 sm:mb-4 md:mb-4 lg:mb-4 leading-relaxed">
              Not in the office? No worries, you can use {process.env.NEXT_PUBLIC_APP_NAME || 'Billora'} from your
              phone from anywhere.
            </p>

            <p className="text-slate-600 text-base sm:text-base md:text-lg lg:text-lg mb-6 sm:mb-8 md:mb-8 lg:mb-8 leading-relaxed">
              With our easy to use mobile app you can create invoice, share
              invoice, manage inventory, track sales or check reports.
            </p>

            {/* App Store Badges */}
            <div className="flex flex-col sm:flex-row md:flex-row gap-3 sm:gap-4 md:gap-4 lg:gap-4 justify-center lg:justify-start md:justify-start items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                className="h-10 sm:h-12 md:h-12 lg:h-12 w-auto hover:scale-105 transition cursor-pointer"
                alt="google play"
              />

              <img
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                className="h-10 sm:h-12 md:h-12 lg:h-12 w-auto hover:scale-105 transition cursor-pointer"
                alt="app store"
              />
            </div>
          </motion.div>

          {/* RIGHT PHONES */}
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="relative w-full lg:w-[500px] md:w-[500px] h-[380px] sm:h-[420px] md:h-[420px] lg:h-[420px] mt-8 md:mt-0 lg:mt-0"
          >
            {/* NORMAL PHONE */}
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="
                absolute 
                left-1/2 -translate-x-1/2
                sm:left-14 sm:translate-x-0
                md:left-1/2 md:-translate-x-1/2
                lg:left-1/2 lg:-translate-x-1/2
                xl:left-14 xl:translate-x-0
                w-48 sm:w-56 md:w-56 lg:w-56 
                h-[340px] sm:h-[420px] md:h-[420px] lg:h-[420px] 
                rounded-[35px] sm:rounded-[45px] md:rounded-[45px] lg:rounded-[45px] 
                overflow-hidden 
                shadow-[0_50px_90px_rgba(0,0,0,0.35)] 
                border-[4px] sm:border-[6px] md:border-[6px] lg:border-[6px] border-black 
                bg-black
              "
            >
              <img
                src="/image/phone1.png"
                className="w-full h-full object-cover"
                alt="phone"
              />
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}