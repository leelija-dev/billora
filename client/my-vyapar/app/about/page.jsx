// app/about/page.js (Note: no "use client" directive)
import AboutClient from './AboutClient';

export const metadata = {
  title: "About The Fast Bill | Best Billing Software",
  description: "Discover The Fast Bill’s journey in transforming Indian SMBs with smart billing, GST filing, and real-time inventory management software. Trusted by 70,000+ businesses across India.",
};

export default function AboutPage() {
  return <AboutClient />;

}