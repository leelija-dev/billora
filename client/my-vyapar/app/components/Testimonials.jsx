"use client";

import React, { useState, useEffect } from "react";

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState('right');
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      name: 'Amit Patel',
      role: 'Owner',
      company: 'Patel & Sons',
      avatar: '👨',
      review: 'Vyapar has revolutionized our billing process. The GST compliance features are impeccable and have saved us countless hours.',
      yearsWithUs: '3+ years',
      location: 'Mumbai'
    },
    {
      name: 'Neha Gupta',
      role: 'Founder',
      company: 'Gupta Fashion',
      avatar: '👩‍💼',
      review: 'The reporting features are comprehensive. Filing GST returns has never been easier. Great value for money.',
      yearsWithUs: '2+ years',
      location: 'Delhi'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Director',
      company: 'Kumar Electronics',
      avatar: '👤',
      review: 'Inventory tracking is extremely smooth and reliable. This software transformed our workflow.',
      yearsWithUs: '4+ years',
      location: 'Bangalore'
    },
    {
      name: 'Suresh Sharma',
      role: 'Owner',
      company: 'Sharma Traders',
      avatar: '👨‍💼',
      review: 'Billing is extremely fast and easy. The interface is intuitive and saves us time every day.',
      yearsWithUs: '2+ years',
      location: 'Jaipur'
    },
    {
      name: 'Priya Verma',
      role: 'Manager',
      company: 'Verma Cosmetics',
      avatar: '👩',
      review: 'Inventory system keeps everything organized. We never run out of stock thanks to automated alerts.',
      yearsWithUs: '1+ years',
      location: 'Kolkata'
    },
    {
      name: 'Rohit Singh',
      role: 'Owner',
      company: 'Singh Hardware',
      avatar: '👨',
      review: 'Payment tracking improved our cashflow significantly. Now we always know who owes us money.',
      yearsWithUs: '3+ years',
      location: 'Lucknow'
    },
    {
      name: 'Anjali Mehta',
      role: 'Founder',
      company: 'Mehta Boutique',
      avatar: '👩‍💼',
      review: 'Very simple interface and easy to learn. My team adapted within days, not weeks.',
      yearsWithUs: '2+ years',
      location: 'Ahmedabad'
    },
    {
      name: 'Vikram Desai',
      role: 'CEO',
      company: 'Desai Enterprises',
      avatar: '👨‍💼',
      review: 'Reports give clear profit insights. We now make data-driven decisions that have grown our business.',
      yearsWithUs: '5+ years',
      location: 'Pune'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  const next = () => {
    if (isAnimating) return;
    setDirection('right');
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 400);
  };

  const prev = () => {
    if (isAnimating) return;
    setDirection('left');
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 50);
    }, 400);
  };

  const goToSlide = (i) => {
    if (isAnimating || i === index) return;
    setDirection(i > index ? 'right' : 'left');
    setIsAnimating(true);
    setTimeout(() => {
      setIndex(i);
      setTimeout(() => setIsAnimating(false), 50);
    }, 400);
  };

  const getPrevIndex = () => {
    return (index - 1 + testimonials.length) % testimonials.length;
  };

  const getNextIndex = () => {
    return (index + 1) % testimonials.length;
  };

  return (
    <section className="py-[100px] bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] text-center relative overflow-hidden max-md:py-[70px] max-sm:py-[50px]">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[42px] font-extrabold text-[#0f172a] mb-4 leading-[1.2] max-md:text-4xl max-sm:text-3xl">
          What Our Customers Say
        </h2>
        <p className="text-lg text-[#475569] mb-[50px] max-md:text-base max-sm:mb-[30px]">
          Trusted by business owners across India
        </p>

        {/* SLIDER */}
        <div className="relative my-[60px] min-h-[450px] max-lg:my-10 max-md:min-h-[400px]">
          {/* CARDS */}
          <div className="relative h-[450px] flex justify-center items-center max-md:h-[400px]">
            {/* Previous Card */}
            <div className={`absolute w-[520px] bg-white rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-60 cursor-pointer border border-[#e2e8f0] max-lg:w-[460px] max-md:w-[400px] max-sm:hidden ${
              direction === 'left' ? 'animate-[slideOutToLeft_0.5s_ease_forwards]' : ''
            } ${direction === 'right' ? 'animate-[slideOutToRight_0.5s_ease_forwards]' : ''}`}
              style={{
                transform: direction === 'left' && !isAnimating ? 'translateX(-420px) scale(0.9)' : 
                          direction === 'right' && !isAnimating ? 'translateX(-420px) scale(0.9)' : 
                          'translateX(-420px) scale(0.9)',
                filter: 'blur(1px)',
                zIndex: 2
              }}
            >
              <Card data={testimonials[getPrevIndex()]} />
            </div>

            {/* Active Card */}
            <div className={`absolute w-[520px] bg-white rounded-[40px] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-[3] opacity-100 shadow-[0_25px_50px_-12px_rgba(59,130,246,0.25)] border-2 border-[#3b82f6] max-lg:w-[460px] max-md:w-[400px] max-sm:w-[320px] max-sm:relative max-sm:shadow-lg ${
              direction === 'left' ? 'animate-[slideInFromRight_0.5s_ease_forwards]' : ''
            } ${direction === 'right' ? 'animate-[slideInFromLeft_0.5s_ease_forwards]' : ''}`}
              style={{
                transform: 'translateX(0) scale(1)',
                filter: 'blur(0)'
              }}
            >
              <Card data={testimonials[index]} />
            </div>

            {/* Next Card */}
            <div className={`absolute w-[520px] bg-white rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-60 cursor-pointer border border-[#e2e8f0] max-lg:w-[460px] max-md:w-[400px] max-sm:hidden ${
              direction === 'left' ? 'animate-[slideOutToRight_0.5s_ease_forwards]' : ''
            } ${direction === 'right' ? 'animate-[slideOutToLeft_0.5s_ease_forwards]' : ''}`}
              style={{
                transform: direction === 'left' && !isAnimating ? 'translateX(420px) scale(0.9)' : 
                          direction === 'right' && !isAnimating ? 'translateX(420px) scale(0.9)' : 
                          'translateX(420px) scale(0.9)',
                filter: 'blur(1px)',
                zIndex: 2
              }}
            >
              <Card data={testimonials[getNextIndex()]} />
            </div>
          </div>

          {/* ARROWS */}
          <button 
            className="absolute top-1/2 -translate-y-1/2 left-[100px] w-14 h-14 rounded-full border-none bg-white text-[#3b82f6] text-2xl cursor-pointer z-10 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 border-2 border-transparent hover:bg-[#3b82f6] hover:text-white hover:scale-110 hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] disabled:opacity-30 disabled:cursor-not-allowed max-lg:left-[50px] max-md:w-11 max-md:h-11 max-md:text-xl max-sm:left-2"
            onClick={prev} 
            disabled={isAnimating}
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <button 
            className="absolute top-1/2 -translate-y-1/2 right-[100px] w-14 h-14 rounded-full border-none bg-white text-[#3b82f6] text-2xl cursor-pointer z-10 shadow-[0_10px_25px_rgba(0,0,0,0.1)] transition-all duration-300 border-2 border-transparent hover:bg-[#3b82f6] hover:text-white hover:scale-110 hover:shadow-[0_15px_30px_rgba(59,130,246,0.3)] disabled:opacity-30 disabled:cursor-not-allowed max-lg:right-[50px] max-md:w-11 max-md:h-11 max-md:text-xl max-sm:right-2"
            onClick={next} 
            disabled={isAnimating}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        {/* DOTS */}
        <div className="mt-[50px] flex justify-center gap-3 flex-wrap">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`h-3 rounded-full cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#3b82f6] hover:scale-110 ${
                i === index 
                  ? 'w-9 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]' 
                  : 'w-3 bg-[#cbd5e1]'
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          0% {
            transform: translateX(-420px) scale(0.9);
            opacity: 0.7;
            filter: blur(1px);
          }
          50% {
            transform: translateX(-100px) scale(0.95);
            opacity: 0.9;
            filter: blur(0.5px);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes slideInFromRight {
          0% {
            transform: translateX(420px) scale(0.9);
            opacity: 0.7;
            filter: blur(1px);
          }
          50% {
            transform: translateX(100px) scale(0.95);
            opacity: 0.9;
            filter: blur(0.5px);
          }
          100% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
        }

        @keyframes slideOutToLeft {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
          50% {
            transform: translateX(-100px) scale(0.95);
            opacity: 0.9;
            filter: blur(0.5px);
          }
          100% {
            transform: translateX(-420px) scale(0.9);
            opacity: 0.7;
            filter: blur(1px);
          }
        }

        @keyframes slideOutToRight {
          0% {
            transform: translateX(0) scale(1);
            opacity: 1;
            filter: blur(0);
          }
          50% {
            transform: translateX(100px) scale(0.95);
            opacity: 0.9;
            filter: blur(0.5px);
          }
          100% {
            transform: translateX(420px) scale(0.9);
            opacity: 0.7;
            filter: blur(1px);
          }
        }

        @media (max-width: 1200px) {
          @keyframes slideInFromLeft {
            0% { transform: translateX(-380px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideInFromRight {
            0% { transform: translateX(380px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideOutToLeft {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(-380px) scale(0.9); opacity: 0.7; }
          }
          @keyframes slideOutToRight {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(380px) scale(0.9); opacity: 0.7; }
          }
        }

        @media (max-width: 992px) {
          @keyframes slideInFromLeft {
            0% { transform: translateX(-320px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideInFromRight {
            0% { transform: translateX(320px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideOutToLeft {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(-320px) scale(0.9); opacity: 0.7; }
          }
          @keyframes slideOutToRight {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(320px) scale(0.9); opacity: 0.7; }
          }
        }

        @media (max-width: 768px) {
          @keyframes slideInFromLeft {
            0% { transform: translateX(-260px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideInFromRight {
            0% { transform: translateX(260px) scale(0.9); opacity: 0.7; }
            100% { transform: translateX(0) scale(1); opacity: 1; }
          }
          @keyframes slideOutToLeft {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(-260px) scale(0.9); opacity: 0.7; }
          }
          @keyframes slideOutToRight {
            0% { transform: translateX(0) scale(1); opacity: 1; }
            100% { transform: translateX(260px) scale(0.9); opacity: 0.7; }
          }
        }

        @media (max-width: 576px) {
          @keyframes mobileSlideIn {
            0% {
              opacity: 0;
              transform: scale(0.8) translateX(30px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateX(0);
            }
          }
        }
      `}</style>
    </section>
  );
};

const Card = ({ data }) => {
  return (
    <div className="p-10 relative max-md:p-8 max-sm:p-6">
      <div className="absolute left-10 top-10 w-1 h-[100px] bg-gradient-to-b from-[#3b82f6] to-[#8b5cf6] rounded-[2px] max-sm:hidden"></div>

      <p className="text-left ml-[30px] text-lg leading-[1.7] text-[#334155] italic mb-5 min-h-[100px] max-md:text-base max-md:ml-5 max-sm:text-sm max-sm:ml-0 max-sm:text-center">
        "{data.review}"
      </p>

      <div className="my-5 flex gap-1 text-[#fbbf24] max-sm:justify-center">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-xl filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.2)]">★</span>
        ))}
      </div>

      <div className="mt-6 flex gap-4 items-center text-left max-sm:flex-col max-sm:text-center">
        <div className="w-[60px] h-[60px] rounded-full bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white text-[28px] flex-shrink-0 shadow-[0_10px_20px_rgba(59,130,246,0.2)] max-sm:mx-auto">
          {data.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-bold text-[#0f172a] m-0 mb-1">{data.name}</h4>
          <p className="text-sm text-[#64748b] m-0 mb-1.5">{data.role}, {data.company}</p>
          <div className="flex gap-3 text-xs text-[#94a3b8] max-sm:justify-center">
            <span className="flex items-center gap-1">📅 {data.yearsWithUs}</span>
            <span className="flex items-center gap-1">📍 {data.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;