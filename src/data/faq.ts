export interface FAQItem {
    question: string;
    answer: string;
}

export interface FAQCategory {
    title: string;
    items: FAQItem[];
}

export const faqData: FAQCategory[] = [
    {
        title: "Working Together",
        items: [
            {
                question: "What kinds of companies do you work with?",
                answer: "Growth-stage companies that have something working and need to scale it. Typically that's $1M–$30M revenue, 10–100 people, and a founder or operator who's hitting real friction — manual processes that don't scale, a brand that no longer matches the business, or the realization that they need one person to own the full scope instead of managing three vendors.\n\nI've worked across home services, B2B distribution, SaaS, and professional services. The through-line isn't the industry — it's the stage. You've got traction. Now you need systems.",
            },
            {
                question: "Do you work with startups or early-stage companies?",
                answer: "Yes, selectively. The fit is best when there's a clear problem to solve and a decision-maker who can move fast. I built and launched Notova — a full-stack SaaS product — in three weeks, so I understand the startup context. If you need to go from zero to live quickly, that's something I can help with. If you're still figuring out what you're building, the timing might not be right.",
            },
            {
                question: "Are you open to full-time roles?",
                answer: "Yes. My portfolio serves both audiences — consulting clients and companies looking to hire. If you're building a team and need someone who can own brand, marketing operations, or revenue systems at a senior level, I'm open to the conversation.",
            },
            {
                question: "What does an engagement typically look like?",
                answer: "It depends on the scope, but most engagements fall into one of three shapes:\n\nProject work — a defined deliverable with a clear start and end. Brand refresh, website build, automation system. Usually $5K–$50K depending on scope.\n\nRetainer — ongoing work over a defined period. Useful when you need consistent execution across multiple workstreams. Typically $3K–$10K/month.\n\nEmbedded — short-term intensive engagement where I work closely with your team to map, build, and hand off. Good for operational overhauls or launching something fast.\n\nIf you're not sure which fits, that's what the first conversation is for.",
            },
            {
                question: "Do you work alone or with a team?",
                answer: "Primarily alone, with trusted collaborators brought in when the project warrants it. I keep engagements small by design — you're working with me directly, not getting handed off to a junior. For larger builds, I work with 2–3 people I've vetted and trust. Either way, I own the outcome.",
            },
            {
                question: "How do I know if we're a good fit before committing?",
                answer: "The first call is low-commitment — usually 30–45 minutes. I'll ask about what you're building, where the friction is, and what success looks like. You'll get a clear read on whether I can help and how I'd approach it. If it's not the right fit, I'll tell you that too.\n\nNo pitch decks. No pressure. Just a real conversation.",
            },
            {
                question: "What's your availability like? How far out are you booked?",
                answer: "It varies. I keep capacity limited to take on work I can actually execute well — I'm not trying to scale volume. The best way to find out is to reach out. If I'm fully committed, I'll let you know and we can talk about timing.",
            },
        ],
    },
    {
        title: "The Work Itself",
        items: [
            {
                question: "What services do you actually offer?",
                answer: "Three core areas, often overlapping:\n\nBrand & Creative — Positioning strategy, identity systems, website design and development, marketing collateral. Not just aesthetics — everything is built to perform.\n\nSystems & Automation — Workflow audits, custom CRM builds, AI-powered lead management, marketing operations infrastructure. I find where manual work is costing time and money, then eliminate it.\n\nRevenue Operations — Sales system design, training curriculum, SOP development, funnel strategy. Built on real sales floor experience — I've closed $160K+/month myself, so this isn't theoretical.\n\nMost engagements touch more than one of these. That's the point.",
            },
            {
                question: "Can you handle a project end-to-end, or do I need to bring in other people?",
                answer: "End-to-end is the default. From strategy through deployment — brand positioning, web development, systems integration, and ongoing optimization. One engagement, not three vendors.\n\nThat said, if you have existing vendors or team members I should collaborate with, I can work within that structure. I'm comfortable owning a piece of a larger project when the situation calls for it.",
            },
            {
                question: "Do you build websites? What's your stack?",
                answer: "Yes. I build production-ready websites on Next.js with TypeScript and Tailwind CSS, deployed on Vercel. For e-commerce, I work in Shopify. For content-heavy sites, I can integrate a CMS.\n\nThe stack is modern and performant — built for speed, SEO, and maintainability. You're not getting a theme with your logo swapped in.",
            },
            {
                question: "What does your process look like from start to finish?",
                answer: "Every engagement follows the same four phases:\n\nDiscovery — I map the real problem, not just the symptoms. Current workflows, friction points, what success actually looks like. This is where most engagements get clarified or redirected.\n\nStrategy — Before anything gets built, we align on what's being built, in what order, and how we'll know it worked. Clear scope, realistic timeline, no surprises.\n\nBuild — Execution with regular check-ins. You see progress as it happens, not all at once at the end. Feedback loops are built into the process, not bolted on.\n\nOptimize — After launch, we measure against the success metrics we defined in strategy. Then hand off, continue, or move to the next priority — based on what you need.",
            },
            {
                question: "How long do projects typically take?",
                answer: "It depends heavily on scope and how fast your team can move on approvals and feedback. Rough ranges:\n\nBrand identity system: 3–6 weeks\nWebsite (design + build): 4–8 weeks\nAutomation / systems build: 2–6 weeks\nFull-scope engagements (brand + web + systems): 8–16 weeks\n\nI built and launched Notova — a full SaaS product — in three weeks. Speed is possible when scope is clear and decisions are fast. Most timelines stretch from indecision, not complexity.",
            },
            {
                question: "What do you need from me to get started?",
                answer: "Not much, upfront. Before we start, I need to understand the problem clearly — that happens in the discovery phase. What I need from you during a project:\n\n— A clear decision-maker who can give feedback without a committee\n— Timely responses to questions and review requests\n— Existing assets: brand files, credentials, content if applicable\n— Honest input on what's working and what isn't\n\nThe clients I work best with are engaged but not micromanaging. They hire me to own the outcome, then let me do that.",
            },
            {
                question: "What separates you from an agency or a generalist freelancer?",
                answer: "Two things:\n\nFirst, range with depth. Most agencies specialize — brand studio, dev shop, marketing ops firm. I cover all three because the work is connected. A brand refresh that doesn't account for how leads are generated and followed up on is incomplete. I don't have to hand off across vendors and hope it integrates.\n\nSecond, I've been on the execution side. I spent four years on a sales floor, closing deals and building the systems that took a company from $3M to $20M. When I work on sales enablement, brand strategy, or revenue operations, it's informed by what actually moves people — not just what looks good in a slide deck.",
            },
            {
                question: "Do you offer ongoing support after a project wraps?",
                answer: "Yes. Some clients want a clean handoff — documentation, training, and they take it from there. Others prefer ongoing optimization, especially for systems that benefit from iteration after launch. I'm flexible either way. We'll define this at the strategy phase so there are no surprises on either end.",
            },
        ],
    },
];
