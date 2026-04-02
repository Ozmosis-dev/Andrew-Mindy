export const projects = [
    {
        slug: "atlanta-roofing",
        title: "Atlanta Regional Roofing Company",
        client: "Regional Roofing Company (Atlanta, GA)",
        industry: "Home Services / Roofing",
        timeline: "4 years (Spring 2018 – Spring 2022)",
        role: "Sales → Training Manager → Assistant Sales Manager",
        description: "Built a psychology-based sales training system that scaled a regional roofing company from $3M to $20M in four years.",
        category: "revenue-ops",
        metrics: [
            { value: "$3M → $20M", label: "Revenue Growth" },
            { value: "35% → 52%", label: "Close Rate" },
            { value: "7x", label: "Review Volume" }
        ],
        featured: true,
        // Using a cool dark gradient placeholder
        image: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        accent: "#62afef",
        gallery: [
            { url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3", alt: "Revenue Dashboard Analytics" },
            { url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3", alt: "Data Visualization Charts" },
            { url: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=2076&ixlib=rb-4.0.3", alt: "Sales Performance Tracking" }
        ]
    },
    {
        slug: "southern-water",
        title: "Southern Water Service & GloFlo",
        client: "Southern Water Service & GloFlo",
        industry: "Industrial Equipment / B2B Distribution",
        timeline: "~2 months",
        role: "Systems Architect, Web Developer, Automation Engineer",
        description: "Built an AI-powered platform that eliminated 1,000+ hours of manual work annually and saved $73K in labor costs.",
        category: "automation",
        metrics: [
            { value: "95%", label: "Faster Lead Search" },
            { value: "1,000+", label: "Hours/Year Saved" },
            { value: "$73K", label: "Annual Savings" }
        ],
        featured: true,
        image: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        accent: "#4db8ff",
        gallery: [
            { url: "/images/Southern Water Mockups/SWS Mockup.png", alt: "Southern Water Service Platform" },
            { url: "/images/Southern Water Mockups/SWS Mockup 2.png", alt: "GloFlo Automation Dashboard" },
            { url: "/images/Southern Water Mockups/SWS Mockup 3.png", alt: "AI-Powered Lead Pipeline" }
        ]
    },
    {
        slug: "fulvio",
        title: "Fulvio",
        client: "Personal Product",
        industry: "Agency Operations / SaaS",
        timeline: "~4 weeks",
        role: "Founder, Designer, Full-Stack Developer",
        description: "Designed and built a full-stack agency operating system that replaces Asana, Slack, HoneyBook, and Apollo — in four weeks.",
        category: "product",
        metrics: [
            { value: "4 Weeks", label: "To Prototype" },
            { value: "6+", label: "Tools Replaced" },
            { value: "SaaS", label: "Built to License" }
        ],
        featured: true,
        image: "linear-gradient(135deg, #0d0d1a 0%, #1a0d2e 50%, #2d1b4e 100%)",
        accent: "#4db8ff",
        gallery: [
            { url: "/images/Fulvio Mockups/Fulvio 1.jpeg", alt: "Fulvio Agency OS Dashboard" },
            { url: "/images/Fulvio Mockups/Fulvio 2.jpeg", alt: "Fulvio Project Management Interface" },
            { url: "/images/Fulvio Mockups/Fulvio 3.jpeg", alt: "Fulvio CRM & Pipeline View" }
        ]
    },
    {
        slug: "notova",
        title: "Notova",
        client: "Personal Project",
        industry: "SaaS / Productivity",
        timeline: "~3 weeks",
        role: "Founder, Designer, Full-Stack Developer",
        description: "Designed and built a full-stack SaaS product from concept to launch in three weeks.",
        category: "product",
        metrics: [
            { value: "3 Weeks", label: "To Launch" },
            { value: "Full-Stack", label: "Ownership" },
            { value: "Live", label: "notova.app" }
        ],
        featured: true,
        liveUrl: "https://notova.app",
        image: "linear-gradient(135deg, #000000 0%, #434343 100%)",
        accent: "#4db8ff",
        gallery: [
            { url: "/images/Notova Mockups/Gemini_Generated_Image_a6n210a6n210a6n2.png", alt: "Notova App Interface" },
            { url: "/images/Notova Mockups/Gemini_Generated_Image_oz7c4poz7c4poz7c.png", alt: "Notova Productivity Dashboard" },
            { url: "/images/Notova Mockups/Gemini_Generated_Image_rtpyrirtpyrirtpy.png", alt: "Notova Note Editor" }
        ]
    }
];

export const siteCopy = {
    hero: {
        headline: "I turn ambiguous growth problems into systems that scale.",
        subhead: "Bridging brand, marketing, and operations to drive measurable outcomes—from $3M to $20M revenue growth, 17-point close rate improvements, and systems that reclaim 1,000+ hours per year.",
        proofPoints: [
            { metric: "$3M → $20M", label: "Revenue Growth" },
            { metric: "35% → 52%", label: "Close Rate" },
            { metric: "$73K", label: "Annual Savings" }
        ],
        primaryCta: { label: "See the Work", href: "#work" },
        secondaryCta: { label: "Let's Talk", href: "#contact" }
    },
    about: {
        paragraphs: [
            "Most companies treat brand, marketing, and operations as separate problems with separate owners. The gaps between them is where growth stalls.",
            "I work at that intersection. Brand informs the marketing. Marketing is built on operations that can actually support it. When all three move together, growth becomes a system — not a sprint."
        ]
    },
    howIWork: {
        steps: [
            {
                id: "01",
                title: "Diagnosis & Discovery",
                description: "We don't guess. I interview stakeholders, map the current state, and identify where growth is bottlenecked by friction, branding, or broken processes."
            },
            {
                id: "02",
                title: "Strategy & Systems Design",
                description: "I plot the shortest path to your goal. Whether that's an automated data pipeline, a specialized CRM implementation, or a high-converting web presence."
            },
            {
                id: "03",
                title: "Full-Stack Implementation",
                description: "I build it. Web apps, API integrations, headless CMS architectures, or automated internal tools. I write the code, configure the databases, and set up the infrastructure."
            },
            {
                id: "04",
                title: "Testing & Handover",
                description: "We validate against real-world use cases. I train your team, provide comprehensive documentation, and ensure the system operates reliably without me."
            }
        ]
    }
};
