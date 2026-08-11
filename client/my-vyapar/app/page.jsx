import { createMetadata } from "../utils/seo";
import { generateHomepageSchema } from "../utils/homepage-schema";

import Hero from "../components/Hero";
import Features from "../components/Features";
import Industries from "../components/Industries";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Start from "../components/Start";
import FAQ from "../components/FAQ";
import Ratings from "../components/Ratings";

export const metadata = createMetadata({
  title: "Best Inventory Management & GST Billing Software - The Fast Bill",
  description:
    "Fast Bill is the best billing software for retail shops in India that creates customized GST bills within 10 seconds, & helps you manage inventory & track sales.",
  keywords:
    "best billing software in india, billing software, gst billing software",
  path: "/",
});

export default function Page() {
  const homepageSchema = generateHomepageSchema();

  return (
    <>
      <script
        id="homepage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageSchema),
        }}
      />

      <Hero />
      <Features />
      <Industries />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <Start />
      <FAQ />
      <Ratings />
    </>
  );
}