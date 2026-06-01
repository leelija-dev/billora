/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./data/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}",
    "./store/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./contexts/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.js",
    "./public/**/*.css",
  ],
  theme: {
    screens: {
      xs: "350px",
      smxl: "400px",
      xxs: "450px",
      smx: "500px",
      sm: "640px",
      md: "768px",
      lg: "991px",
      lgg: "1024px",
      xl: "1280px",
      xll: "1367px",
      "2xl": "1536px",
      "3xl": "1680px",
      "max-xl": { max: "1279px" },
      "max-lg": { max: "1023px" },
      tall: { raw: "(min-height: 800px)" },
    },
    extend: {
      fontSize: {
        "h1-xs": ["1.75rem", { lineHeight: "1.2" }],
        "h1-sm": ["2.25rem", { lineHeight: "1.2" }],
        "h1-md": ["2.5rem", { lineHeight: "1.15" }],
        "h1-lg": ["3rem", { lineHeight: "1.15" }],
        "h1-xl": ["3.5rem", { lineHeight: "1.15" }],
        "h1-2xl": ["4rem", { lineHeight: "1.15" }],
        "h2-xs": ["1.5rem", { lineHeight: "1.25" }],
        "h2-sm": ["1.75rem", { lineHeight: "1.25" }],
        "h2-md": ["2rem", { lineHeight: "1.2" }],
        "h2-lg": ["2.25rem", { lineHeight: "1.2" }],
        "h2-xl": ["2.5rem", { lineHeight: "1.25" }],
        "h2-2xl": ["3rem", { lineHeight: "1.25" }],
        "h3-xs": ["1.25rem", { lineHeight: "1.3" }],
        "h3-sm": ["1.5rem", { lineHeight: "1.3" }],
        "h3-md": ["1.75rem", { lineHeight: "1.25" }],
        "h3-lg": ["2rem", { lineHeight: "1.2" }],
        "h3-xl": ["2.25rem", { lineHeight: "1.2" }],
        "h3-2xl": ["2.5rem", { lineHeight: "1.1" }],
        "h4-xs": ["1.125rem", { lineHeight: "1.4" }],
        "h4-sm": ["1.25rem", { lineHeight: "1.4" }],
        "h4-md": ["1.5rem", { lineHeight: "1.3" }],
        "h4-lg": ["1.75rem", { lineHeight: "1.3" }],
        "h4-xl": ["2rem", { lineHeight: "1.25" }],
        "h4-2xl": ["2.25rem", { lineHeight: "1.2" }],
        "p-xs": ["1rem", { lineHeight: "1.5" }],
        "p-sm": ["1.125rem", { lineHeight: "1.5" }],
        "p-md": ["1.25rem", { lineHeight: "1.5" }],
        "p-lg": ["1.375rem", { lineHeight: "1.5" }],
        "p-xl": ["1.5rem", { lineHeight: "1.5" }],
        "p-2xl": ["1.625rem", { lineHeight: "1.4" }],
        "text-xs": ["0.875rem", { lineHeight: "1.5" }],
        "text-sm": ["1rem", { lineHeight: "1.5" }],
        "text-md": ["1.125rem", { lineHeight: "1.5" }],
        "text-lg": ["1.25rem", { lineHeight: "1.5" }],
        "text-xl": ["1.375rem", { lineHeight: "1.4" }],
        "text-2xl": ["1.5rem", { lineHeight: "1.3" }],
        "a-xs": ["1rem", { lineHeight: "1.5" }],
        "a-sm": ["1.125rem", { lineHeight: "1.5" }],
        "a-md": ["1.25rem", { lineHeight: "1.5" }],
      },
      blur: {
        '80px': '80px',
        '100px': '100px',
        '120px': '120px',
      },
      colors: {
        // Hero gradient colors
        'hero-bg-start': 'var(--hero-bg-start)',
        'hero-bg-mid1': 'var(--hero-bg-mid1)',
        'hero-bg-mid2': 'var(--hero-bg-mid2)',
        'hero-bg-end': 'var(--hero-bg-end)',
        
        // Device backgrounds
        'device-dark': 'var(--device-dark)',
        'device-darker': 'var(--device-darker)',
        
        // Gradient stops
        'gradient-sky-600': 'var(--gradient-sky-600)',
        'gradient-indigo-700': 'var(--gradient-indigo-700)',
        'gradient-sky-700': 'var(--gradient-sky-700)',
        'gradient-purple-700': 'var(--gradient-purple-700)',
        'gradient-indigo-600': 'var(--gradient-indigo-600)',
        'gradient-purple-600': 'var(--gradient-purple-600)',
        
        // Text colors
        'text-slate-700': 'var(--text-slate-700)',
        'text-slate-800': 'var(--text-slate-800)',
        'text-emerald-600': 'var(--text-emerald-600)',
        
        // Border colors
        'border-gray-300': 'var(--border-gray-300)',
        'border-gray-500': 'var(--border-gray-500)',
        
        // Feature badge colors
        'feature-amber': 'var(--feature-amber)',
        'feature-purple': 'var(--feature-purple)',
        'feature-emerald': 'var(--feature-emerald)',
        'feature-sky': 'var(--feature-sky)',
        'feature-indigo': 'var(--feature-indigo)',
        'feature-rose': 'var(--feature-rose)',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, var(--hero-bg-start) 0%, var(--hero-bg-mid1) 30%, var(--hero-bg-mid2) 60%, var(--hero-bg-end) 100%)',
        'gradient-primary': 'linear-gradient(to right, var(--gradient-sky-600), var(--gradient-indigo-700))',
        'gradient-secondary': 'linear-gradient(to right, var(--gradient-sky-700), var(--gradient-purple-700))',
        'gradient-tertiary': 'linear-gradient(to right, var(--gradient-sky-600), var(--gradient-indigo-600), var(--gradient-purple-600))',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'text-reveal': 'textReveal 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'float-1': 'float1 4s ease-in-out infinite',
        'float-2': 'float2 4.5s ease-in-out infinite',
        'float-3': 'float3 3.5s ease-in-out infinite',
      },
      keyframes: {
        fadeInUp: {
          from: {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        textReveal: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '50%': {
            opacity: '1',
            transform: 'scale(1.1)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        fadeIn: {
          from: {
            opacity: '0',
          },
          to: {
            opacity: '1',
          },
        },
        float1: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-10px) translateX(5px)',
          },
        },
        float2: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-8px) translateX(-5px)',
          },
        },
        float3: {
          '0%, 100%': {
            transform: 'translateY(0px) translateX(0px)',
          },
          '50%': {
            transform: 'translateY(-12px) translateX(3px)',
          },
        },
      },
    },
  },
  safelist: [
    {
      pattern: /^(h[1-6]|p|text|a)-(xs|sm|md|lg|lgg|xl|2xl)/,
    },
  ],
  plugins: [],
};