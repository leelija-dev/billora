// "use client";

// import React, { useEffect, useRef, useState } from 'react';
// import SectionTitle from "@/components/SectionTitle";
// import Container from "@/components/Container";
// import { getPlans } from '@/services/pricingService';

// const Pricing = () => {
//   const [billingCycle, setBillingCycle] = useState('monthly');
//   const [plans, setPlans] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const cardRefs = useRef([]);

//   // Fetch plans from your Laravel API - always show only 3
//   useEffect(() => {
//     const fetchPlans = async () => {
//       try {
//         setLoading(true);
//         const data = await getPlans();

//         if (data.status === true && data.data) {
//           const allPlans = data.data;
//           // Show only first 3 plans on homepage
//           const limitedPlans = allPlans.slice(0, 3);

//           const transformedPlans = limitedPlans.map((plan, index) => {
//             // ✅ Get features from features array (messy data)
//             const features = plan.features?.filter(f => f && f !== null) || [];
            
//             // If features array has values, use them, otherwise empty array
//             const cleanedFeatures = features.length > 0 ? features : [];

//             const monthlyPrice = parseFloat(plan.price);
//             const yearlyPrice = monthlyPrice * 10;

//             return {
//               id: plan.id,
//               name: plan.name,
//               price: {
//                 monthly: monthlyPrice.toLocaleString('en-IN'),
//                 yearly: yearlyPrice.toLocaleString('en-IN')
//               },
//               description: plan.description ? plan.description.replace(/<[^>]*>?/gm, "") : "Perfect for your business",
//               features: cleanedFeatures, // ← Shows messy data like ".", "1", "2", "d", etc.
//               color: index === 1 ? '#8b5cf6' : '#000000',
//               buttonText: `Start ${plan.name}`,
//               popular: index === 1,
//               duration_days: plan.duration_days,
//             };
//           });

//           setPlans(transformedPlans);
//         } else {
//           setError(data.message || "Failed to fetch plans");
//         }
//       } catch (error) {
//         console.error('Error fetching plans:', error);
//         setError("Something went wrong");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPlans();
//   }, []);

//   // Handle subscription click
//   const handleSubscribe = (planId) => {
//     window.location.href = `/pricing?subscribe=${planId}&cycle=${billingCycle}`;
//   };

//   useEffect(() => {
//     const observerOptions = { threshold: 0.1, rootMargin: '0px' };
//     const observer = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           entry.target.classList.add('card-visible');
//         }
//       });
//     }, observerOptions);

//     cardRefs.current.forEach((ref) => {
//       if (ref) observer.observe(ref);
//     });

//     return () => observer.disconnect();
//   }, [plans]);

//   if (loading) {
//     return (
//       <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
//         <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
//           <div className="text-red-500 text-5xl mb-4">⚠️</div>
//           <p className="text-red-500 mb-4 font-semibold">{error}</p>
//           <p className="text-gray-600 mb-6 text-sm">Please try again later.</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//           >
//             Retry
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[1vh] font-sans overflow-x-hidden">
//       <Container size="default">
//         {/* Header Section */}
//         <div className="text-center mb-12 px-4">
//           <SectionTitle title="Simple, Transparent Pricing" />
//           <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4">
//             Choose the perfect plan for your business
//           </p>
//         </div>

//         {/* Billing Toggle */}
//         <div className="flex justify-center items-center mb-12 bg-white p-1.5 rounded-full max-w-[340px] mx-auto shadow-sm border border-gray-100">
//           <button
//             className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
//               billingCycle === 'monthly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
//             }`}
//             onClick={() => setBillingCycle('monthly')}
//           >
//             Monthly
//           </button>
//           <button
//             className={`px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 flex-1 ${
//               billingCycle === 'yearly' ? 'bg-[#3b82f6] text-white shadow-md' : 'text-[#1e293b]'
//             }`}
//             onClick={() => setBillingCycle('yearly')}
//           >
//             Yearly <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Save 20%</span>
//           </button>
//         </div>

//         {/* Pricing Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
//           {plans.slice(0, 3).map((plan, index) => (
//             <div
//               key={plan.id || index}
//               ref={(el) => (cardRefs.current[index] = el)}
//               className={`bg-white rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative transition-all duration-300 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10 
//                 ${plan.popular ? 'border-2 border-[#8b5cf6] lg:scale-[1.02] z-20 shadow-purple-100' : 'z-10'}
//                 hover:-translate-y-1 hover:shadow-xl hover:z-30`}
//             >
//               {plan.popular && (
//                 <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg" style={{ background: plan.color }}>
//                   Most Popular
//                 </div>
//               )}

//               <div className="text-center mb-8 pb-8 border-b border-gray-50">
//                 <h3 className="text-2xl font-bold text-[#1e293b] mb-4">{plan.name}</h3>
//                 <div className="flex items-baseline justify-center gap-1">
//                   <span className="text-xl font-semibold text-gray-400">₹</span>
//                   <span className="text-5xl font-extrabold" style={{ color: plan.color }}>
//                     {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
//                   </span>
//                   <span className="text-gray-400 text-sm font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
//                 </div>
//                 <p className="text-sm text-[#64748b] mt-4 font-medium">{plan.description}</p>
//                 {plan.duration_days && (
//                   <p className="text-xs text-gray-400 mt-2">{plan.duration_days} days validity</p>
//                 )}
//               </div>

//               <div className="flex-1 mb-8">
//                 <h4 className="text-[10px] font-black text-[#1e293b] mb-6 uppercase tracking-[0.2em]">What's included:</h4>
//                 {plan.features && plan.features.length > 0 ? (
//                   <ul className="space-y-4">
//                     {plan.features.map((feature, idx) => (
//                       <li key={idx} className="flex items-start gap-3 text-sm text-[#475569]">
//                         <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
//                           <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
//                         </svg>
//                         <span className="leading-tight">{feature}</span>
//                       </li>
//                     ))}
//                   </ul>
//                 ) : (
//                   <p className="text-sm text-gray-500 italic text-center py-4">No features listed yet</p>
//                 )}
//               </div>

//               <div className="mt-auto">
//                 <button
//                   onClick={() => handleSubscribe(plan.id)}
//                   className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 shadow-md hover:brightness-105 active:scale-95
//                     ${plan.popular ? 'bg-[#8b5cf6] text-white' : 'bg-white border-2 hover:bg-gray-50'}`}
//                   style={{
//                     color: plan.popular ? 'white' : plan.color,
//                     borderColor: plan.popular ? 'transparent' : plan.color
//                   }}
//                 >
//                   {plan.buttonText}
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Bottom Section */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 border-t border-gray-100 pt-12">
//           <div className="hidden lg:block w-[150px]" />

//           <div className="flex flex-row items-center gap-3 sm:gap-4 py-2 sm:py-3 px-4 sm:px-8 bg-white rounded-full shadow-sm border border-gray-100">
//             <div className="bg-blue-50 p-1 sm:p-2 rounded-full">
//               <svg width="16" height="16" className="sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
//                 <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
//                 <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
//               </svg>
//             </div>
//             <span className="text-xs sm:text-sm text-[#475569] font-semibold whitespace-nowrap">
//               30-day money-back guarantee • No questions asked
//             </span>
//           </div>

//           <a
//             href="/pricing"
//             className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
//           >
//             <span>View All Plans</span>
//             <span className="group-hover:translate-x-1 transition-transform">→</span>
//           </a>
//         </div>
//       </Container>

//       <style jsx>{`
//         .card-visible {
//           opacity: 1 !important;
//           transform: translateY(0) !important;
//         }
        
//         @media (min-width: 768px) and (max-width: 1023px) {
//           .grid > :last-child:nth-child(3) {
//             grid-column: span 2;
//             justify-self: center;
//             width: 50%;
//             margin-left: auto;
//             margin-right: auto;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Pricing;

"use client";

import React, { useEffect, useRef, useState } from 'react';
import SectionTitle from "@/components/SectionTitle";
import Container from "@/components/Container";
import { getPlans } from '@/services/pricingService';

const Pricing = ({ showAll = false, showButton = true, buttonLink = "/pricing", buttonText = "View All Plans" }) => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cardRefs = useRef([]);

  // Fetch plans from Laravel API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getPlans();

        if (data.status === true && data.data) {
          const allPlans = data.data;
          // If showAll is true, show all plans, otherwise show only first 3
          const plansToShow = showAll ? allPlans : allPlans.slice(0, 3);

          const transformedPlans = plansToShow.map((plan, index) => {
            // Get features from features array
            const features = plan.features?.filter(f => f && f !== null) || [];
            const cleanedFeatures = features.length > 0 ? features : [];

            const monthlyPrice = parseFloat(plan.price);
            const yearlyPrice = monthlyPrice * 10;

            return {
              id: plan.id,
              name: plan.name,
              price: {
                monthly: monthlyPrice.toLocaleString('en-IN'),
                yearly: yearlyPrice.toLocaleString('en-IN')
              },
              description: plan.description ? plan.description.replace(/<[^>]*>?/gm, "") : "Perfect for your business",
              features: cleanedFeatures,
              color: index === 1 ? '#8b5cf6' : '#000000',
              buttonText: `Start ${plan.name}`,
              popular: index === 1,
              duration_days: plan.duration_days,
            };
          });
          // kl

          setPlans(transformedPlans);
        } else {
          setError(data.message || "Failed to fetch plans");
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, [showAll]);

  // Handle subscription click
  const handleSubscribe = (planId) => {
    window.location.href = `/pricing?subscribe=${planId}&cycle=${billingCycle}`;
  };

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

  if (loading) {
    return (
      <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-[#f8fafc] min-h-[90vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-500 mb-4 font-semibold">{error}</p>
          <p className="text-gray-600 mb-6 text-sm">Please try again later.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-20 bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9] min-h-[1vh] font-sans overflow-x-hidden">
      <Container size="default">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <SectionTitle title="Simple, Transparent Pricing" />
          <p className="text-[#475569] text-lg max-w-[600px] mx-auto mt-4">
            Choose the perfect plan for your business
          </p>
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
            Yearly <span className="ml-1 text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Save 20%</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch px-4">
          {plans.map((plan, index) => (
            <div
              key={plan.id || index}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`bg-white rounded-[30px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative transition-all duration-300 border border-[#e2e8f0] flex flex-col opacity-0 translate-y-10 
                ${plan.popular ? 'border-2 border-[#8b5cf6] lg:scale-[1.02] z-20 shadow-purple-100' : 'z-10'}
                hover:-translate-y-1 hover:shadow-xl hover:z-30`}
            >
              {plan.popular && (
                <div className="absolute top-[-14px] left-1/2 -translate-x-1/2 text-white px-6 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg" style={{ background: plan.color }}>
                  Most Popular
                </div>
              )}

              <div className="text-center mb-8 pb-8 border-b border-gray-50">
                <h3 className="text-2xl font-bold text-[#1e293b] mb-4">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-xl font-semibold text-gray-400">₹</span>
                  <span className="text-5xl font-extrabold" style={{ color: plan.color }}>
                    {billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly}
                  </span>
                  <span className="text-gray-400 text-sm font-medium">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-sm text-[#64748b] mt-4 font-medium">{plan.description}</p>
                {plan.duration_days && (
                  <p className="text-xs text-gray-400 mt-2">{plan.duration_days} days validity</p>
                )}
              </div>

              <div className="flex-1 mb-8">
                <h4 className="text-[10px] font-black text-[#1e293b] mb-6 uppercase tracking-[0.2em]">What's included:</h4>
                {plan.features && plan.features.length > 0 ? (
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-[#475569]">
                        <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17L4 12" stroke={plan.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="leading-tight">{feature}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 italic text-center py-4">No features listed yet</p>
                )}
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className={`w-full py-4 rounded-full text-base font-bold transition-all duration-300 shadow-md hover:brightness-105 active:scale-95
                    ${plan.popular ? 'bg-[#8b5cf6] text-white' : 'bg-white border-2 hover:bg-gray-50'}`}
                  style={{
                    color: plan.popular ? 'white' : plan.color,
                    borderColor: plan.popular ? 'transparent' : plan.color
                  }}
                >
                  {plan.buttonText}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section - Show only if showButton is true */}
        {showButton && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 px-4 border-t border-gray-100 pt-12">
            <div className="hidden lg:block w-[150px]" />

            <div className="flex flex-row items-center gap-3 sm:gap-4 py-2 sm:py-3 px-4 sm:px-8 bg-white rounded-full shadow-sm border border-gray-100">
              <div className="bg-blue-50 p-1 sm:p-2 rounded-full">
                <svg width="16" height="16" className="sm:w-5 sm:h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[#475569] font-semibold whitespace-nowrap">
                30-day money-back guarantee • No questions asked
              </span>
            </div>

            <a
              href={buttonLink}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-bold text-sm shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300"
            >
              <span>{buttonText}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        )}
      </Container>

      <style jsx>{`
        .card-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        
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
    </div>
  );
};

export default Pricing;