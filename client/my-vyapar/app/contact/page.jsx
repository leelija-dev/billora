// app/contact/page.js (Note: no "use client" directive)
import Contact from "./ContactClient";
import { createMetadata } from '../../utils/seo';

export const metadata = createMetadata({
  title: "Contact Us – Support & Inquiries | The Fast Bill",
  description: "Get in touch with The Fast Bill team for support, sales, or feedback. Call, email, or fill our form for a response within 24 hours. Start your free trial today.",
  keywords: "contact thefastbill",
  path: 'contact',
});

export default function ContactPage() {
  return <Contact />;
}