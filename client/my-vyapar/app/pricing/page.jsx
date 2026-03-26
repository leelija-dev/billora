"use client";

import React, { useEffect, useRef, useState } from 'react';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const cardRefs = useRef([]);

  useEffect(() => {
    const fetchPricingData = async () => {
      try {
        const response = await fetch('https://fakestoreapi.com/products');
        const products = await response.json();
        
        const transformedPlans = products.map((product, index) => {
          const isPopular = (index + 1) % 3 === 0;
          return {
            id: product.id,
            name: product.category.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') + ' Plan',
            price: {
              monthly: Math.round(product.price).toLocaleString(),
              yearly: Math.round(product.price * 10).toLocaleString()
            },
            description: `Perfect for ${product.category} businesses`,
            features: [
              `Premium ${product.category}`,
              `Rating: ${product.rating.rate} ★`,
              `30-day money-back guarantee`,
              `Free updates`,
              `Email support`
            ],
            color: (index + 1) % 2 === 0 ? '#8b5cf6' : '#000000',
            buttonText: isPopular ? 'Start Pro' : 'Start Basic',
            popular: isPopular
          };
        });
        setPlans(transformedPlans);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchPricingData();
  }, []);

  useEffect(() => {
    const observerOptions = { threshold: 0.1, rootMargin: '0px' };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible');
        }
      });
    }, observerOptions);

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [plans]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-screen font-sans">
        <Container size="default">
          <div className="text-center mb-12">
            <SectionTitle title="Simple, Transparent Pricing" />
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center items-center mb-12 bg-white p-1.5 rounded-full max-w-[340px] mx-auto shadow-sm border border-gray-100">
            <button
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
                billingCycle === 'monthly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
              }`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
                billingCycle === 'yearly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
              }`}
              onClick={() => setBillingCycle('yearly')}
            >
              Yearly
            </button>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 items-stretch px-4 pt-8">
            {plans.map((plan, index) => (
              <div
                key={plan.id}
                ref={(el) => (cardRefs.current[index] = el)}
                className={`bg-white rounded-[30px] p-8 shadow-sm relative transition-all duration-300 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10
                  ${plan.popular ? 'border-2 border-[#8b5cf6] lg:scale-[1.02] z-10' : 'z-0'}
                  hover:-translate-y-1 hover:shadow-xl hover:z-50
                  ${index === plans.length - 1 && plans.length % 2 !== 0 ? 'md:col-start-2 lg:col-start-auto' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-[-16px] left-1/2 -translate-x-1/2 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ background: plan.color }}>
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-8 pb-8 border-b border-gray-50">
                  <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                  <div className="text-4xl font-extrabold" style={{ color: plan.color }}>
                    ₹{billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </div>
                </div>
                <div className="flex-1 mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <span style={{ color: plan.color }}>✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className={`w-full py-4 rounded-full font-bold transition-all duration-300 shadow-md hover:brightness-105 active:scale-95
                    ${plan.popular ? 'text-white' : 'bg-white border-2 hover:bg-gray-50'}`}
                  style={{ 
                    backgroundColor: plan.popular ? plan.color : 'transparent', 
                    color: plan.popular ? 'white' : plan.color, 
                    border: plan.popular ? 'none' : `2px solid ${plan.color}`
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Guarantee Section */}
          <div className="mt-24 mb-12 flex justify-center">
            <div className="py-4 px-10 bg-white rounded-full shadow-sm border border-gray-100 text-sm font-semibold">
              30-day money-back guarantee • No questions asked
            </div>
          </div>
        </Container>
      </div>
      <Footer />
      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
        /* Responsive fix to center single card on medium screens */
        @media (min-width: 768px) and (max-width: 1023px) {
          .grid > :last-child:nth-child(3) {
            grid-column: span 2;
            justify-self: center;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}</style>
    </>
  );
};

export default Pricing;