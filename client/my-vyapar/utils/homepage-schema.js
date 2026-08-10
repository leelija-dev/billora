
export const generateHomepageSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://thefastbill.com/#organization",
      "name": "The Fast Bill",
      "legalName": "Leelija Web Solution Pvt Ltd",
      "url": "https://thefastbill.com/",
      "logo": "https://thefastbill.com/image/company-2-logo.png",
      "description": "Modern GST billing software for Indian businesses. Simplify your invoicing, stay compliant, and accelerate growth with our all-in-one platform.",
      "foundingDate": "2020",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Taki Road, Bamunmura",
        "addressLocality": "Barasat",
        "addressRegion": "West Bengal",
        "postalCode": "700125",
        "addressCountry": "IN"
      },
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+91-7003150015",
          "contactType": "sales",
          "availableLanguage": ["English", "Hindi"],
          "hoursAvailable": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
            "opens": "09:00",
            "closes": "19:00"
          }
        },
        {
          "@type": "ContactPoint",
          "telephone": "+91-332-584-9017",
          "contactType": "customer support",
          "availableLanguage": ["English", "Hindi"]
        }
      ],
      "email": "info@leelija.com",
      "sameAs": [
        ""
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "https://thefastbill.com/#software",
      "name": "The Fast Bill",
      "url": "https://thefastbill.com/",
      "logo": "https://thefastbill.com/image/company-2-logo.png",
      "operatingSystem": "Android, Windows, Web",
      "applicationCategory": "BusinessApplication",
      "applicationSubCategory": "Accounting Software",
      "description": "The Fast Bill is GST billing and inventory management software for Indian small businesses. Create GST invoices in 10 seconds, manage stock levels, track payments, file returns, and stay 100% GST compliant.",
      "keywords": "GST billing software, inventory management software, billing software India, GST invoice software, billing software for retail shops",
      "screenshot": "https://thefastbill.com/image/dashboard.webp",
      "softwareVersion": "2.0.0",
      "inLanguage": "en-IN",
      "availableOnDevice": ["Desktop", "Mobile"],
      "countriesSupported": "IN",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "INR",
        "description": "7-day free trial available. No credit card required."
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "31821",
        "bestRating": "5"
      },
      "featureList": [
        "GST Invoice Generation",
        "Inventory Management",
        "Payment Tracking",
        "GSTR-2B Reconciliation",
        "E-way Bill Generation",
        "Multi-GSTIN Support",
        "Real-time Analytics",
        "ITC Claims"
      ],
      "author": {
        "@id": "https://thefastbill.com/#organization"
      }
    }
  ]});