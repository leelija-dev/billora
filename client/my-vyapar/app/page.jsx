import Navbar from "../components/Navbar";  
import Hero from "../components/Hero";
import Features from "../components/Features"; 
import Industries from "../components/Industries";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Start from "../components/Start"; 
import FAQ from "../components/FAQ";
import Ratings from "../components/Ratings";
import Footer from "../components/Footer";  

export default function Page() {
  return (
    <main>
      <Navbar />      
      <Hero />
      <Features />
      <Industries />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Start />
      <FAQ />
      <Ratings />
      <Footer/>        
    </main>
  );
}