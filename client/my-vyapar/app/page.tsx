<<<<<<< HEAD
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
=======
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Features from "./components/Features";
import Industries from "./components/Industries";
import Pricing from "./components/Pricing";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Ratings from "./components/Ratings";
import Footer from "./components/Footer";

export default function Page() {
  return (
    <>
      {/* <Navbar />
      <Hero /> */}
      {/* <Features />
      <HowItWorks /> */}
>>>>>>> 6deee889272d85f1ac047d7fad72ab1665f17f1b
      <Industries />
      <Pricing />
      <Testimonials />
      <FAQ />
      <Ratings />
      <Footer />
<<<<<<< HEAD

    </main>
=======
    </>
>>>>>>> 6deee889272d85f1ac047d7fad72ab1665f17f1b
  );
}