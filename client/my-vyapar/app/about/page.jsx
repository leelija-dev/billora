// app/about/page.js (Note: no "use client" directive)
import AboutClient from './AboutClient';

export const metadata = {
  title: "About The Fast Bill – Empowering India's Small Businesses",
  description: " Learn how The Fast Bill helps 70,000+ Indian businesses digitize billing and GST compliance with affordable, easy-to-use software. Discover our mission & story.",
};

export default function AboutPage() {
  return <AboutClient />;

}