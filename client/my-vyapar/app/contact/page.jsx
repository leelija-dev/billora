// app/about/page.js (Note: no "use client" directive)

import Contact from "./ContactClient";    


export const metadata = {
  title: "Contact | The Fast Bill",
  description: "Connect with us anytime, anywhere. Reach out to our team for support, inquiries, or feedback, and get a response within 24 hours. Start your free trial today and let’s build something great together.",
};

export default function ContactPage() {
  return <Contact />;

}