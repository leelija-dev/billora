import React from 'react';
import CareersClient from './Careers-Clients';
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Careers – Join Our Team | The Fast Bill",
  description: "Join The Fast Bill and help empower millions of Indian businesses. Explore remote-friendly roles, benefits, and our culture. See current openings & apply.",
  path: '/careers',
});

const page = () => {
  return (
    <CareersClient />
  );
};

export default page;