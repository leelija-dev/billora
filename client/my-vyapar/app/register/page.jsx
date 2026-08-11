import React from 'react';
import RegisterClient from './Register-Client';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Create Your Account – Sign Up Free | The Fast Bill",
  description: "Sign up for The Fast Bill in minutes and start billing smarter. Create GST invoices, manage stock, and track sales with India's easy billing software. Free to start.",
  keywords: "register thefastbill ",
  path: '/register',
  noIndex: true, // Recommended for signup pages
});

export default function RegisterPage() {
  return <RegisterClient />;
}