// app/about/page.js (Note: no "use client" directive)
import AboutClient from './AboutClient';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "About The Fast Bill – Empowering India's Small Businesses",
  description: "Learn how The Fast Bill helps 70,000+ Indian businesses digitize billing and GST compliance with affordable, easy-to-use software. Discover our mission & story.",
  path: '/about',
});

export default function AboutPage() {
  return <AboutClient />;
}