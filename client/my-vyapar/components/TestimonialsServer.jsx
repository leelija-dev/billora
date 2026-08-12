// components/TestimonialsServer.jsx
import Testimonials from './Testimonials';

// This is a Server Component (no 'use client')
export default function TestimonialsServer({ initialData }) {
  // Pass server-fetched data to client component
  return <Testimonials initialData={initialData} />;
}