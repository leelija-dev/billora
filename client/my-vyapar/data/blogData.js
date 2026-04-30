export const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Business Accounting",
    slug: "getting-started-with-business-accounting",
    excerpt: "Learn the fundamentals of business accounting and how to set up your financial records for success.",
    content: `
      <h2>Introduction to Business Accounting</h2>
      <p>Business accounting is the systematic process of recording, analyzing, and interpreting financial information. It's essential for making informed business decisions and ensuring compliance with financial regulations.</p>
      
      <h3>Why Accounting Matters</h3>
      <p>Proper accounting helps you:</p>
      <ul>
        <li>Track your business performance</li>
        <li>Make informed financial decisions</li>
        <li>Ensure tax compliance</li>
        <li>Secure funding and investments</li>
      </ul>
      
      <h3>Getting Started</h3>
      <p>Start by setting up a chart of accounts, choosing an accounting method, and establishing regular bookkeeping practices. Consider using accounting software to streamline the process.</p>
      
      <h2>Conclusion</h2>
      <p>Good accounting practices are the foundation of a successful business. Take the time to set up your system correctly from the beginning.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1554224154-260325c0594c?w=800&h=400&fit=crop",
    feature_image_alt: "Business accounting setup",
    author: "John Smith",
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T10:00:00Z",
    status: "published",
    categories: [
      { id: 1, name: "Accounting", slug: "accounting" }
    ],
    tags: [
      { id: 1, name: "accounting", slug: "accounting" },
      { id: 2, name: "business", slug: "business" },
      { id: 3, name: "finance", slug: "finance" }
    ]
  },
  {
    id: 2,
    title: "10 Tips for Effective Inventory Management",
    slug: "10-tips-for-effective-inventory-management",
    excerpt: "Discover proven strategies to optimize your inventory management and reduce costs while improving efficiency.",
    content: `
      <h2>Introduction</h2>
      <p>Effective inventory management is crucial for business success. It helps maintain the right balance between stock availability and capital investment.</p>
      
      <h3>Key Strategies</h3>
      <ol>
        <li>Implement just-in-time inventory</li>
        <li>Use inventory management software</li>
        <li>Regular cycle counting</li>
        <li>Set reorder points</li>
        <li>Analyze sales patterns</li>
        <li>Consider dropshipping for slow-moving items</li>
        <li>Implement ABC analysis</li>
        <li>Use barcode scanning</li>
        <li>Build supplier relationships</li>
        <li>Monitor key metrics</li>
      </ol>
      
      <h2>Conclusion</h2>
      <p>By implementing these strategies, you can significantly improve your inventory management and boost your bottom line.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
    feature_image_alt: "Inventory management system",
    author: "Sarah Johnson",
    created_at: "2024-01-20T14:30:00Z",
    updated_at: "2024-01-20T14:30:00Z",
    status: "published",
    categories: [
      { id: 2, name: "Inventory", slug: "inventory" }
    ],
    tags: [
      { id: 4, name: "inventory", slug: "inventory" },
      { id: 5, name: "management", slug: "management" },
      { id: 6, name: "optimization", slug: "optimization" }
    ]
  },
  {
    id: 3,
    title: "Digital Marketing Strategies for Small Businesses",
    slug: "digital-marketing-strategies-small-businesses",
    excerpt: "Learn how to effectively market your small business online with limited budget and resources.",
    content: `
      <h2>The Digital Marketing Landscape</h2>
      <p>Digital marketing offers small businesses unprecedented opportunities to reach customers and compete with larger companies.</p>
      
      <h3>Essential Strategies</h3>
      <p>Focus on these key areas:</p>
      <ul>
        <li>Search engine optimization (SEO)</li>
        <li>Social media marketing</li>
        <li>Email marketing campaigns</li>
        <li>Content marketing</li>
        <li>Local SEO optimization</li>
      </ul>
      
      <h3>Measuring Success</h3>
      <p>Track key metrics like website traffic, conversion rates, and customer acquisition costs to measure your marketing effectiveness.</p>
      
      <h2>Conclusion</h2>
      <p>Consistent effort and strategic planning are key to digital marketing success for small businesses.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    feature_image_alt: "Digital marketing dashboard",
    author: "Mike Chen",
    created_at: "2024-01-25T09:15:00Z",
    updated_at: "2024-01-25T09:15:00Z",
    status: "published",
    categories: [
      { id: 3, name: "Marketing", slug: "marketing" }
    ],
    tags: [
      { id: 7, name: "marketing", slug: "marketing" },
      { id: 8, name: "digital", slug: "digital" },
      { id: 9, name: "small-business", slug: "small-business" }
    ]
  },
  {
    id: 4,
    title: "Understanding Cash Flow Management",
    slug: "understanding-cash-flow-management",
    excerpt: "Master the art of cash flow management to ensure your business stays healthy and profitable.",
    content: `
      <h2>What is Cash Flow?</h2>
      <p>Cash flow represents the movement of money in and out of your business. Positive cash flow means more money coming in than going out.</p>
      
      <h3>Cash Flow Statement Components</h3>
      <ul>
        <li>Operating activities</li>
        <li>Investing activities</li>
        <li>Financing activities</li>
      </ul>
      
      <h3>Improving Cash Flow</h3>
      <p>Strategies to improve cash flow include:</p>
      <ul>
        <li>Accelerating receivables</li>
        <li>Managing payables effectively</li>
        <li>Controlling inventory</li>
        <li>Securing appropriate financing</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Regular cash flow monitoring and proactive management are essential for business sustainability.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=400&fit=crop",
    feature_image_alt: "Cash flow management chart",
    author: "Emily Davis",
    created_at: "2024-02-01T11:45:00Z",
    updated_at: "2024-02-01T11:45:00Z",
    status: "published",
    categories: [
      { id: 1, name: "Accounting", slug: "accounting" }
    ],
    tags: [
      { id: 10, name: "cash-flow", slug: "cash-flow" },
      { id: 11, name: "finance", slug: "finance" },
      { id: 12, name: "management", slug: "management" }
    ]
  },
  {
    id: 5,
    title: "Building a Strong Company Culture",
    slug: "building-strong-company-culture",
    excerpt: "Learn how to create and maintain a positive company culture that attracts and retains top talent.",
    content: `
      <h2>The Importance of Company Culture</h2>
      <p>A strong company culture is the foundation of employee engagement, productivity, and business success.</p>
      
      <h3>Key Elements of Great Culture</h3>
      <ul>
        <li>Clear values and mission</li>
        <li>Open communication</li>
        <li>Employee recognition</li>
        <li>Work-life balance</li>
        <li>Growth opportunities</li>
      </ul>
      
      <h3>Building Your Culture</h3>
      <p>Start by defining your core values, leading by example, and consistently reinforcing desired behaviors through policies and practices.</p>
      
      <h2>Conclusion</h2>
      <p>Investing in company culture pays dividends in employee satisfaction, retention, and overall business performance.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop",
    feature_image_alt: "Team collaboration in office",
    author: "Robert Wilson",
    created_at: "2024-02-05T16:20:00Z",
    updated_at: "2024-02-05T16:20:00Z",
    status: "published",
    categories: [
      { id: 4, name: "Management", slug: "management" }
    ],
    tags: [
      { id: 13, name: "culture", slug: "culture" },
      { id: 14, name: "hr", slug: "hr" },
      { id: 15, name: "leadership", slug: "leadership" }
    ]
  },
  {
    id: 6,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  },
  {
    id: 7,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  },
  {
    id: 8,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  },
  {
    id: 9,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  },
  {
    id: 10,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  },
  {
    id: 11,
    title: "E-commerce Best Practices for 2024",
    slug: "ecommerce-best-practices-2024",
    excerpt: "Stay ahead of the competition with these essential e-commerce strategies and best practices.",
    content: `
      <h2>The Evolution of E-commerce</h2>
      <p>E-commerce continues to evolve rapidly. Staying current with best practices is essential for online success.</p>
      
      <h3>Essential Best Practices</h3>
      <ul>
        <li>Mobile-first design</li>
        <li>Fast loading speeds</li>
        <li>Secure payment options</li>
        <li>Personalized shopping experiences</li>
        <li>Easy checkout process</li>
        <li>Customer reviews and social proof</li>
      </ul>
      
      <h3>Emerging Trends</h3>
      <p>Watch for AI-powered recommendations, AR shopping experiences, and sustainable e-commerce practices.</p>
      
      <h2>Conclusion</h2>
      <p>Continuous optimization and customer focus are key to e-commerce success in 2024 and beyond.</p>
    `,
    feature_image: "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=800&h=400&fit=crop",
    feature_image_alt: "E-commerce shopping on mobile device",
    author: "Lisa Anderson",
    created_at: "2024-02-10T13:00:00Z",
    updated_at: "2024-02-10T13:00:00Z",
    status: "published",
    categories: [
      { id: 5, name: "E-commerce", slug: "ecommerce" }
    ],
    tags: [
      { id: 16, name: "ecommerce", slug: "ecommerce" },
      { id: 17, name: "online-sales", slug: "online-sales" },
      { id: 18, name: "digital-commerce", slug: "digital-commerce" }
    ]
  }
];

export const categories = [
  { id: 1, name: "Accounting", slug: "accounting" },
  { id: 2, name: "Inventory", slug: "inventory" },
  { id: 3, name: "Marketing", slug: "marketing" },
  { id: 4, name: "Management", slug: "management" },
  { id: 5, name: "E-commerce", slug: "ecommerce" }
];

export const getBlogBySlug = (slug) => {
  return blogPosts.find(post => post.slug === slug);
};

export const getBlogsByCategory = (categoryId) => {
  return blogPosts.filter(post => 
    post.categories.some(cat => cat.id === categoryId)
  );
};

export const searchBlogs = (query) => {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(post => 
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.content.toLowerCase().includes(lowercaseQuery)
  );
};
