import React from 'react';
import ResetPasswordContent from './ResetPassword';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Reset Your Password – The Fast Bill",
  description: "Reset your password for The Fast Bill. Get back into your account quickly and easily.",

  path: '/reset-password',
  noIndex: true, // Recommended for reset password pages
});

export default function ResetPasswordPage() {
  return <ResetPasswordContent />;
}