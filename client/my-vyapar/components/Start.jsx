"use client";

import React from "react";
import { motion } from "framer-motion";

export default function Start() {
  return (
    <section className="relative w-full min-h-[50vh] py-5 bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 overflow-hidden">

      {/* Glow background shapes */}
      <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-indigo-200 rounded-full blur-[120px] opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-sky-200 rounded-full blur-[140px] opacity-40"></div>

      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-16 relative">

        {/* LEFT TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-xl text-center lg:text-left"
        >

          <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            Carry Your Business <br />
            <span className="text-indigo-600">Wherever You Go</span>
          </h2>

          <p className="text-slate-600 mb-4">
            Not in the office? No worries, you can use Billora from your
            phone from anywhere.
          </p>

          <p className="text-slate-600 mb-8">
            With our easy to use mobile app you can create invoice, share
            invoice, manage inventory, track sales or check reports.
          </p>

          <div className="flex gap-4 justify-center lg:justify-start">

            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              className="h-12 hover:scale-105 transition cursor-pointer"
              alt="google play"
            />

            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              className="h-12 hover:scale-105 transition cursor-pointer"
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
          className="relative w-full lg:w-[500px] h-[420px]"
        >

          {/* ULTA PHONE */}
         {/* <motion.div
  initial={{ opacity: 0, y: -60 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, duration: 0.8 }}
  viewport={{ once: true }}
  className="hidden sm:block absolute -top-36 right-5 w-48 h-[360px] rotate-180 rounded-[40px] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.25)] bg-black"
>

  <img
    src="/image/phone2.png"
    className="w-full h-full object-cover"
    alt="phone"
  />

</motion.div> */}

          {/* NORMAL PHONE */}
    <motion.div
  initial={{ opacity: 0, y: 80 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4, duration: 0.8 }}
  viewport={{ once: true }}
  className="
  absolute 
  top-5 left-14

  md:left-1/2 md:-translate-x-1/2
  lg:left-1/2 lg:-translate-x-1/2

  xl:left-14 xl:translate-x-0

  w-56 h-[420px] 
  rounded-[45px] 
  overflow-hidden 
  shadow-[0_50px_90px_rgba(0,0,0,0.35)] 
  border-[6px] border-black 
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
    </section>
  );
}