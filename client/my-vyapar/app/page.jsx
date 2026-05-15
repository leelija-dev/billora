import Hero from "../components/Hero";
import Features from "../components/Features";
import Industries from "../components/Industries";
import HowItWorks from "../components/HowItWorks";
import Pricing from "../components/Pricing";
import Testimonials from "../components/Testimonials";
import Start from "../components/Start";
import FAQ from "../components/FAQ";
import Ratings from "../components/Ratings";

export const metadata = {
  title: "Best Inventory Management & GST Billing Software - The Fast Bill",

  description:
    "Fast Bill is the best billing software for retail shops in India that creates customized GST bills within 10 seconds, & helps you manage inventory & track sales.",

  // keywords: [
  //   "billing software",
  //   "ERP software",
  //   "invoice software",
  //   "GST billing software",
  //   "POS software",
  //   "inventory management software",
  //   "restaurant billing software",
  //   "shop billing software",
  //   "FastBill",
  // ],

  // openGraph: {
  //   title: "FastBill - Billing & ERP Software",
  //   description:
  //     "Manage billing, inventory, GST, invoices, and reports with FastBill ERP software.",
  //   url: "https://thefastbill.com",
  //   siteName: "FastBill",
  //   images: [
  //     {
  //       url: "/og-image.png",
  //       width: 1200,
  //       height: 630,
  //       alt: "FastBill ERP Software",
  //     },
  //   ],
  //   locale: "en_US",
  //   type: "website",
  // },

  // twitter: {
  //   card: "summary_large_image",
  //   title: "FastBill ERP Software",
  //   description:
  //     "Modern billing and ERP software for businesses and stores.",
  //   images: ["/og-image.png"],
  // },

  // alternates: {
  //   canonical: "https://thefastbill.com",
  // },
};

export default function Page() {
  return (
    <>
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