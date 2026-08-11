import React from 'react';
import TrialClient from './Trial-Client';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Start Your Free Trial – GST Billing Software | The Fast Bill",
  description: "Try The Fast Bill free for 7 days — unlimited GST invoices, real-time inventory, and reports. No credit card required. Sign up and transform your billing today.",
  keywords: "free GST billing software, GST billing software trial",
  path: '/start-free-trial',
  noIndex: true, // Recommended for trial/signup pages
});

const page = () => {
  return (
    <TrialClient/>
  )
}

export default page
