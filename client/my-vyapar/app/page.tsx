import Navbar from "./Components/Navbar";
import Hero from "./Components/Hero";
import Features from "./Components/Features";
import HowItWorks from "./Components/HowItWorks";
import Industries from "./Components/Industries";
import Pricing from "./Components/Pricing";
import Testimonials from "./Components/Testimonials";
import FAQ from "./Components/FAQ";
import Ratings from "./Components/Ratings";
import Footer from "./Components/Footer";

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Industries />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Ratings />
      <Footer />

    </main>
  );
}