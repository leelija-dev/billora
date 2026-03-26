"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionTitle from "../../components/SectionTitle";
import Container from "../../components/Container";
import { getPlans } from '@/services/pricingService';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribing, setSubscribing] = useState(null);
  const [subscribeMessage, setSubscribeMessage] = useState(null);
  const cardRefs = useRef([]);

  // Fetch plans from Laravel API - SHOW ALL PLANS
 useEffect(() => {
   const fetchPlans = async () => {
     try {
       setLoading(true);
 
       const data = await getPlans();
 
       if (data.status === true && data.data) {
         const allPlans = data.data;
        const limitedPlans = allPlans; // show ALL plans
 
         const transformedPlans = limitedPlans.map((plan, index) => {
           const features = plan.permissions?.map(p => p.permission_name) || [];
 
           const monthlyPrice = parseFloat(plan.price);
           const yearlyPrice = monthlyPrice * 10;
 
           return {
             id: plan.id,
             name: plan.name,
             price: {
               monthly: monthlyPrice.toLocaleString('en-IN'),
               yearly: yearlyPrice.toLocaleString('en-IN')
             },
             description: plan.description
   ? plan.description.replace(/<[^>]*>?/gm, "")
   : "",
             features: features,
             color: index === 1 ? '#8b5cf6' : '#000000',
             buttonText: `Start ${plan.name}`,
             popular: index === 1,
           };
         });
 
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
 }, []);

  // Handle subscription
  const handleSubscribe = async (planId) => {
    setSubscribing(planId);
    setSubscribeMessage(null);
    
    try {
    const data = await response.json();
console.log("SUBSCRIBE RESPONSE:", data);
      
      if (data.status === true) {
        setSubscribeMessage({
          type: 'success',
          text: data.message || 'Subscription successful! Redirecting to dashboard...'
        });
        
        // Save subscription info to localStorage
        if (data.data) {
          localStorage.setItem('subscription', JSON.stringify(data.data));
        }
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setSubscribeMessage({
          type: 'error',
          text: data.message || 'Subscription failed. Please try again.'
        });
      }
    } catch (error) {
      console.error('Subscription error:', error);
      setSubscribeMessage({
        type: 'error',
        text: 'Something went wrong. Please try again.'
      });
    } finally {
      setSubscribing(null);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSubscribeMessage(null);
      }, 5000);
    }
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
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading plans...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Unable to Load Plans</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (plans.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#f1f5f9]">
          <div className="text-center">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Plans Available</h3>
            <p className="text-gray-600">Please check back later for pricing plans.</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

export default function PricingPage() {
  return (
    <>
      <Navbar />
      
      {/* Dedicated Pricing Page - Shows ALL plans */}
      <Pricing 
        showAll={true}      // ← Shows ALL plans from database
        showButton={true}   // ← Shows bottom section with button
        buttonLink="/contact"  // ← Button links to contact page
      />
      
      <Footer />
    </>
  );
}