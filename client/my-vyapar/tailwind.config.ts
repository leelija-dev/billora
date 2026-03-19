/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.css",
        "./resources/**/*.vue",
        "./public/**/*.js",
        "./public/**/*.css",
    ],
    theme: {
        screens: {
            xs: "350px",
            smxl: "400px",
            xxs: "450px",
            smx: "500px", // Custom extra small breakpoint
            sm: "640px",
            md: "768px",
            lg: "991px",
            lgg: "1024px",
            xl: "1280px",
            xll: "1367px",
            "2xl": "1536px",
            "3xl": "1680px",
            // Max-width variants
            "max-xl": { max: "1279px" },
            "max-lg": { max: "1023px" },
            // Height-based breakpoints
            tall: { raw: "(min-height: 800px)" },
        },
        extend: {
            boxShadow: {
                custom: "0 0 12px #F99F38",
            },
            dropShadow: {
                custom: "1px 0px 1px rgba(0, 0, 0, 1)",
            },
            clipPath: {
                "custom-hexagon":
                    "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
                // You can add more custom shapes here
            },
            components: {
                ".btn-primary": {
                    "@apply px-5 py-1 rounded-md text-white hover:text-black border border-white bg-primary hover:bg-white hover:border-black transition-all duration-300 ease-in-out":
                        "",
                },
                ".btn-secondary": {
                    "@apply px-5 py-1 rounded-md border border-black bg-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 ease-in-out":
                        "",
                },
            },
            // tailwind.config.ts - Replace the fontSize section with this
fontSize: {
    // Heading 1 - MUCH LARGER on tablet
    "h1-xs": ["1.75rem", { lineHeight: "1.2" }],     // 28px (mobile)
    "h1-sm": ["2.25rem", { lineHeight: "1.2" }],     // 36px (mobile large)
    "h1-md": ["2.5rem", { lineHeight: "1.15" }],     // 40px (tablet) - INCREASED from 24px
    "h1-lg": ["3rem", { lineHeight: "1.15" }],       // 48px (desktop)
    "h1-xl": ["3.5rem", { lineHeight: "1.15" }],     // 56px
    "h1-2xl": ["4rem", { lineHeight: "1.15" }],      // 64px

    // Heading 2 - MUCH LARGER on tablet
    "h2-xs": ["1.5rem", { lineHeight: "1.25" }],     // 24px (mobile)
    "h2-sm": ["1.75rem", { lineHeight: "1.25" }],    // 28px (mobile large)
    "h2-md": ["2rem", { lineHeight: "1.2" }],        // 32px (tablet) - INCREASED from 20px
    "h2-lg": ["2.25rem", { lineHeight: "1.2" }],     // 36px (desktop)
    "h2-xl": ["2.5rem", { lineHeight: "1.25" }],     // 40px
    "h2-2xl": ["3rem", { lineHeight: "1.25" }],      // 48px

    // Heading 3 - MUCH LARGER on tablet
    "h3-xs": ["1.25rem", { lineHeight: "1.3" }],     // 20px (mobile)
    "h3-sm": ["1.5rem", { lineHeight: "1.3" }],      // 24px (mobile large)
    "h3-md": ["1.75rem", { lineHeight: "1.25" }],    // 28px (tablet) - INCREASED from 16px
    "h3-lg": ["2rem", { lineHeight: "1.2" }],        // 32px (desktop)
    "h3-xl": ["2.25rem", { lineHeight: "1.2" }],     // 36px
    "h3-2xl": ["2.5rem", { lineHeight: "1.1" }],     // 40px

    // Heading 4 - MUCH LARGER on tablet
    "h4-xs": ["1.125rem", { lineHeight: "1.4" }],    // 18px (mobile)
    "h4-sm": ["1.25rem", { lineHeight: "1.4" }],     // 20px (mobile large)
    "h4-md": ["1.5rem", { lineHeight: "1.3" }],      // 24px (tablet) - INCREASED from 16px
    "h4-lg": ["1.75rem", { lineHeight: "1.3" }],     // 28px (desktop)
    "h4-xl": ["2rem", { lineHeight: "1.25" }],       // 32px
    "h4-2xl": ["2.25rem", { lineHeight: "1.2" }],    // 36px

    // Paragraph - MUCH LARGER on tablet (NEVER below 16px!)
    "p-xs": ["1rem", { lineHeight: "1.5" }],         // 16px (mobile) - INCREASED from 14px
    "p-sm": ["1.125rem", { lineHeight: "1.5" }],     // 18px (mobile large)
    "p-md": ["1.25rem", { lineHeight: "1.5" }],      // 20px (tablet) - INCREASED from 14px
    "p-lg": ["1.375rem", { lineHeight: "1.5" }],     // 22px (desktop small)
    "p-xl": ["1.5rem", { lineHeight: "1.5" }],       // 24px (desktop)
    "p-2xl": ["1.625rem", { lineHeight: "1.4" }],    // 26px

    // Small Text - MINIMUM 14px on mobile/tablet!
    "text-xs": ["0.875rem", { lineHeight: "1.5" }],  // 14px (mobile) - INCREASED from 12px
    "text-sm": ["1rem", { lineHeight: "1.5" }],      // 16px (mobile large)
    "text-md": ["1.125rem", { lineHeight: "1.5" }],  // 18px (tablet)
    "text-lg": ["1.25rem", { lineHeight: "1.5" }],   // 20px
    "text-xl": ["1.375rem", { lineHeight: "1.4" }],  // 22px
    "text-2xl": ["1.5rem", { lineHeight: "1.3" }],   // 24px

    // Links - Keep readable
    "a-xs": ["1rem", { lineHeight: "1.5" }],         // 16px (mobile)
    "a-sm": ["1.125rem", { lineHeight: "1.5" }],     // 18px
    "a-md": ["1.25rem", { lineHeight: "1.5" }],      // 20px
},
            blur: {
                // Add your custom blur values here
                custom1: "123px",
                custom2: "10px",
                custom3: "15px",
            },
            colors: {
                primary: "#F99F38",
                secondary: "#1C244B",
                paragraphColor: "#525252",
            },
            backgroundImage: {
                "primary-gradient":
                    "linear-gradient(96deg,rgba(255, 195, 126, 1) 18%, rgba(255, 136, 0, 1) 80%)",
                "secondary-gradient":
                    "linear-gradient(260deg,rgba(249, 159, 56, 1) 0%, rgba(255, 157, 0, 0.19) 100%);",
                "custom-gradient":
                    "linear-gradient(355deg,rgb(2, 98, 221) 23%, rgba(95, 172, 255, 0.58) 100%);", // Using CSS variable
                "footer-gradient":
                    "linear-gradient(276deg, rgb(0, 0, 0) 28%, rgb(51, 51, 51) 100%);", // Using CSS variable
            },
            animation: {
                "spin-slow": "spin 20s linear infinite",
                "spin-slow-reverse": "spin-reverse 20s linear infinite",
            },
            keyframes: {
                "spin-reverse": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(-360deg)" },
                },
            },
        },
        variants: {
            extend: {
                fontSize: ["responsive", "hover", "focus"],
            },
        },
        safelist: [
            // Add all your text classes here to ensure they're generated
            {
                pattern: /^(h[1-6]|p|text|a)-(xs|sm|md|lg|lgg|xl|2xl)/,
            },
        ],
    },
    plugins: [
        function ({ addComponents }: any) {
            addComponents({
                ".btn-primary": {
                    "@apply px-5 py-2 rounded-[12px] text-white hover:text-black border border-white bg-primary hover:bg-white hover:border-primary transition-all duration-300 ease-in-out":
                        "",
                },
                ".btn-secondary": {
                    "@apply px-5 py-2 rounded-[12px] border border-primary bg-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 ease-in-out":
                        "",
                },
            });
        },
        require("tailwind-clip-path"),
    ],
};



// /** @type {import('tailwindcss').Config} */
// export default {
//     content: [
//         "./resources/views/**/*.blade.php",
//         "./resources/views/*.blade.php",
//         "./resources/js/**/*.js",
//         "./resources/css/**/*.css",
//         "./app/Http/Controllers/**/*.php",
//         "./app/Models/**/*.php",
//         "./app/View/Components/**/*.php",
//         "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
//         "./storage/framework/views/*.php"
//     ],
//     safelist: [
//         'sm:text-h1-sm', 'md:text-h1-md', 'lg:text-h1-lg', 'xl:text-h1-xl', '2xl:text-h1-2xl',
//         'sm:text-h2-sm', 'md:text-h2-md', 'lg:text-h2-lg', 'xl:text-h2-xl', '2xl:text-h2-2xl',
//         'sm:text-p-sm', 'md:text-p-md', 'lg:text-p-lg', 'xl:text-p-xl', '2xl:text-p-2xl'
//     ],
//     theme: {
//         screens: {
//             xs: "350px",
//             smxl: "400px",
//             xxs: "450px",
//             smx: "500px", // Custom extra small breakpoint
//             sm: "640px",
//             md: "768px",
//             lg: "991px",
//             lgg: "1024px",
//             xl: "1280px",
//             xll: "1367px",
//             "2xl": "1536px",
//             "3xl": "1680px",
//             // Max-width variants
//             "max-xl": { max: "1279px" },
//             "max-lg": { max: "1023px" },
//             // Height-based breakpoints
//             tall: { raw: "(min-height: 800px)" },
//         },
//         extend: {
//             boxShadow: {
//                 custom: "0 0 12px #F99F38",
//             },
//             dropShadow: {
//                 custom: "1px 0px 1px rgba(0, 0, 0, 1)",
//             },
//             clipPath: {
//                 "custom-hexagon":
//                     "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                 // You can add more custom shapes here
//             },
//             components: {
//                 ".btn-primary": {
//                     "@apply px-5 py-1 rounded-md text-white hover:text-black border border-white bg-primary hover:bg-white hover:border-black transition-all duration-300 ease-in-out":
//                         "",
//                 },
//                 ".btn-secondary": {
//                     "@apply px-5 py-1 rounded-md border border-black bg-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 ease-in-out":
//                         "",
//                 },
//             },
//             fontSize: {
//                 // Heading 1
//                 "h1-xs": ["1.75rem", { lineHeight: "1.2" }],
//                 "h1-sm": ["2.25rem", { lineHeight: "1.2" }],
//                 "h1-md": ["3rem", { lineHeight: "1.15" }],
//                 "h1-lg": ["2.8rem", { lineHeight: "1.15" }],
//                 "h1-lgg": ["3rem", { lineHeight: "1.15" }],
//                 "h1-xl": ["3.2rem", { lineHeight: "1.15" }],
//                 "h1-2xl": ["4rem", { lineHeight: "1.15" }],

//                 // Heading 2
//                 "h2-xs": ["1.5rem", { lineHeight: "1.25" }],
//                 "h2-sm": ["1.75rem", { lineHeight: "1.25" }],
//                 "h2-md": ["2rem", { lineHeight: "1.2" }],
//                 "h2-lg": ["2.25rem", { lineHeight: "1.2" }],
//                 "h2-lgg": ["2.3rem", { lineHeight: "1.1" }],
//                 "h2-xl": ["2.5rem", { lineHeight: "1.25" }],
//                 "h2-2xl": ["3rem", { lineHeight: "1.25" }],

//                 // Heading 3
//                 "h3-xs": ["1.25rem", { lineHeight: "1.3" }],
//                 "h3-sm": ["1.5rem", { lineHeight: "1.3" }],
//                 "h3-md": ["1.75rem", { lineHeight: "1.25" }],
//                 "h3-lg": ["1.75rem", { lineHeight: "1.25" }],
//                 "h3-lgg": ["1.85rem", { lineHeight: "1.2" }],
//                 "h3-xl": ["2rem", { lineHeight: "1.2" }],
//                 "h3-2xl": ["2.4rem", { lineHeight: "1.1" }],

//                 // Heading 4
//                 "h4-xs": ["1.125rem", { lineHeight: "1.4" }],
//                 "h4-sm": ["1.25rem", { lineHeight: "1.4" }],
//                 "h4-md": ["1.5rem", { lineHeight: "1.3" }],
//                 "h4-lg": ["1.75rem", { lineHeight: "1.3" }],
//                 "h4-lgg": ["1.875rem", { lineHeight: "1.25" }],
//                 "h4-xl": ["2rem", { lineHeight: "1.25" }],
//                 "h4-2xl": ["2.25rem", { lineHeight: "1.2" }],

//                 // Paragraph
//                 "p-xs": ["0.875rem", { lineHeight: "1.5" }],
//                 "p-sm": ["1rem", { lineHeight: "1.5" }],
//                 "p-md": ["1.025rem", { lineHeight: "1.5" }],
//                 "p-lg": ["1.050rem", { lineHeight: "1.5" }],
//                 "p-lgg": ["1rem", { lineHeight: "1.5" }],
//                 "p-xl": ["1.2rem", { lineHeight: "1.5" }],
//                 "p-2xl": ["1.425rem", { lineHeight: "1.4" }],

//                 // Small Text (span, li, etc.)
//                 "text-xs": ["0.75rem", { lineHeight: "1.5" }],
//                 "text-sm": ["0.875rem", { lineHeight: "1.5" }],
//                 "text-md": ["1rem", { lineHeight: "1.5" }],
//                 "text-lg": ["1.125rem", { lineHeight: "1.5" }],
//                 "text-lgg": ["1.25rem", { lineHeight: "1.4" }],
//                 "text-xl": ["1.375rem", { lineHeight: "1.4" }],
//                 "text-2xl": ["1.5rem", { lineHeight: "1.3" }],

//                 // Links (can use same as paragraph or smaller)
//                 "a-xs": ["0.875rem", { lineHeight: "1.5" }],
//                 "a-sm": ["1rem", { lineHeight: "1.5" }],
//                 "a-md": ["1.125rem", { lineHeight: "1.5" }],
//                 // ... continue pattern as needed
//             },
//             blur: {
//                 // Add your custom blur values here
//                 custom1: "123px",
//                 custom2: "10px",
//                 custom3: "15px",
//             },
//             colors: {
//                 primary: "#F99F38",
//                 secondary: "#1C244B",
//                 paragraphColor: "#525252",
//             },
//             backgroundImage: {
//                 "primary-gradient":
//                     "linear-gradient(96deg,rgba(255, 195, 126, 1) 18%, rgba(255, 136, 0, 1) 80%)",
//                 "secondary-gradient":
//                     "linear-gradient(260deg,rgba(249, 159, 56, 1) 0%, rgba(255, 157, 0, 0.19) 100%);",
//                 "custom-gradient":
//                     "linear-gradient(355deg,rgb(2, 98, 221) 23%, rgba(95, 172, 255, 0.58) 100%);", // Using CSS variable
//                 "footer-gradient":
//                     "linear-gradient(276deg, rgb(0, 0, 0) 28%, rgb(51, 51, 51) 100%);", // Using CSS variable
//             },
//             animation: {
//                 "spin-slow": "spin 20s linear infinite",
//                 "spin-slow-reverse": "spin-reverse 20s linear infinite",
//             },
//             keyframes: {
//                 "spin-reverse": {
//                     from: { transform: "rotate(0deg)" },
//                     to: { transform: "rotate(-360deg)" },
//                 },
//             },
//         },
//         variants: {
//             extend: {
//                 fontSize: ["responsive", "hover", "focus"],
//             },
//         },
//         safelist: [
//             // Add all your text classes here to ensure they're generated
//             {
//                 pattern: /^(h[1-6]|p|text|a)-(xs|sm|md|lg|lgg|xl|2xl)/,
//             },
//         ],
//     },
//     plugins: [
//         function ({ addComponents }) {
//             addComponents({
//                 ".btn-primary": {
//                     "@apply px-5 py-2 rounded-[12px] text-white hover:text-black border border-white bg-primary hover:bg-white hover:border-primary transition-all duration-300 ease-in-out":
//                         "",
//                 },
//                 ".btn-secondary": {
//                     "@apply px-5 py-2 rounded-[12px] border border-primary bg-white hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 ease-in-out":
//                         "",
//                 },
//             });
//         },
//         require("tailwind-clip-path"),
//     ],
// };
