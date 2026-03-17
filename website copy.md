# Andrew Mindy Portfolio — Final Website Copy

> **Version:** Production-Ready  
> **Last Updated:** February 2026  
> **Usage:** Reference this document when building components. Copy is organized by section/component for easy implementation.

---

## Brand Voice Guidelines

Before implementing, keep these principles in mind:

- **Sharp and understated** — Results speak, minimal hype
- **Confident but not boastful** — Let metrics do the heavy lifting
- **Lead with outcomes** — Not services or capabilities
- **Diplomatic framing** — Client "situations" not "problems"
- **Specific metrics** — Concrete numbers build credibility

---

## Site Metadata

### Site Title
\`\`\`
Andrew Mindy — Systems-Thinking Creative
\`\`\`

### Meta Descriptions

**Homepage**
\`\`\`
Systems-thinking creative who delivers measurable business outcomes. $3M→$20M revenue growth, 17-point close rate improvements, and automation that reclaims 1,000+ hours annually.
\`\`\`

**Work Page (/work)**
\`\`\`
Portfolio showcasing revenue operations, systems automation, and full-stack product development. Case studies with measurable results from brand strategy to custom platform builds.
\`\`\`

**Atlanta Roofing Case Study (/work/atlanta-roofing)**
\`\`\`
How a psychology-based sales training system scaled a regional roofing company from $3M to $20M in four years and improved close rates from 35% to 52%.
\`\`\`

**Southern Water Case Study (/work/southern-water)**
\`\`\`
Building an AI-powered platform that eliminated 1,000+ hours of manual work annually and delivered $73K in labor cost savings for a B2B distribution company.
\`\`\`

**Notova Case Study (/work/notova)**
\`\`\`
Full-stack SaaS product built from concept to launch in three weeks using Next.js, TypeScript, and modern web technologies. AI-powered note organization and smart search.
\`\`\`

---

## Navigation

\`\`\`typescript
const navItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" }
];

const ctaButton = {
  label: "Let's Talk",
  href: "#contact"
};
\`\`\`

---

## Hero Section

### Headline
\`\`\`
I turn ambiguous growth problems into systems that scale.
\`\`\`

### Subhead
\`\`\`
Bridging brand, marketing, and operations to drive measurable outcomes—from $3M to $20M revenue growth, 17-point close rate improvements, and systems that reclaim 1,000+ hours per year.
\`\`\`

### Proof Points (Stats Display)
\`\`\`typescript
const proofPoints = [
  { metric: "$3M → $20M", label: "Revenue Growth" },
  { metric: "35% → 52%", label: "Close Rate" },
  { metric: "$73K", label: "Annual Savings" }
];
\`\`\`

### CTAs
\`\`\`typescript
const heroCTAs = {
  primary: { label: "See the Work", href: "#work" },
  secondary: { label: "Let's Talk", href: "#contact" }
};
\`\`\`

### Alternative Headlines (For A/B Testing)
\`\`\`
Option A: Systems that scale. Work that performs.
Option B: From chaos to repeatable growth.
Option C: Pretty work that drives revenue.
\`\`\`

---

## Selected Work Section

### Section Header
\`\`\`
Selected Work
\`\`\`

### Section Intro (Optional)
\`\`\`
Projects that drove measurable outcomes—from revenue operations to systems automation to full-stack product development.
\`\`\`

### Project Cards

#### Atlanta Regional Roofing
\`\`\`typescript
const atlantaRoofing = {
  title: "Atlanta Regional Roofing Company",
  slug: "atlanta-roofing",
  description: "Built a psychology-based sales training system that scaled a regional roofing company from $3M to $20M in four years.",
  category: "Revenue Operations",
  metric: "$3M → $20M",
  metricLabel: "Revenue Growth"
};
\`\`\`

#### Southern Water Service & GloFlo
\`\`\`typescript
const southernWater = {
  title: "Southern Water Service & GloFlo",
  slug: "southern-water",
  description: "Built an AI-powered platform that eliminated 1,000+ hours of manual work annually and saved $73K in labor costs.",
  category: "Systems Automation",
  metric: "$73K",
  metricLabel: "Annual Savings"
};
\`\`\`

#### Notova
\`\`\`typescript
const notova = {
  title: "Notova",
  slug: "notova",
  description: "Designed and built a full-stack SaaS product from concept to launch in three weeks.",
  category: "Full-Stack Product",
  metric: "3 Weeks",
  metricLabel: "Concept to Launch"
};
\`\`\`

### Section Footer Link
\`\`\`
View All Projects →
\`\`\`

---

## About Section

### Section Header
\`\`\`
About
\`\`\`

### Full Copy
\`\`\`
I started as a designer, spent four years on a sales floor closing deals and building training systems, and evolved into someone who can own the full stack—from brand strategy to custom automation.

That sales floor experience changed how I think about creative work. When you've sold $160K+ per month and watched reps succeed or struggle based on whether the system supported them, you stop designing for awards. You design for conversion. You build systems that remove friction and create predictability.

Now I work with companies that have outgrown their current tools and processes. The brand that got you to $1M won't get you to $10M. The manual workflows that worked with five people break down with fifty. I help systematize what's working so it scales without you.
\`\`\`

### Compact Version (If Needed)
\`\`\`
Designer turned systems builder. Spent four years on a sales floor closing $160K+/month, then built the training and operations systems that helped scale revenue from $3M to $20M. Now I help growth-stage companies systematize what's working so it scales without them.
\`\`\`

### Alternative Opening Lines
\`\`\`
Option A: My path wasn't traditional. I started in creative work, spent years on a sales floor exceeding $160K per month, and learned to build the systems that made it repeatable...

Option B: Most people specialize. I went broad. From brand strategy to sales training to full-stack development...
\`\`\`

---

## How I Work Section

### Section Header
\`\`\`
How I Work
\`\`\`

### Section Intro
\`\`\`
I work with companies facing one or more of these situations:
\`\`\`

### Problem 1: Outgrowing Current Systems

**Heading**
\`\`\`
Outgrowing Current Systems
\`\`\`

**What It Looks Like**
\`\`\`
Your team is spending hours on manual tasks. Lead follow-up is inconsistent. Data lives in spreadsheets instead of dashboards. The processes that worked at $1M are breaking down at $5M.
\`\`\`

**What I Do**
\`\`\`
Audit your workflows, identify bottlenecks, and build automation that reclaims time and eliminates friction. From custom CRM platforms to AI-powered lead management, I create systems that scale with you.
\`\`\`

### Problem 2: Brand Doesn't Match Who You've Become

**Heading**
\`\`\`
Brand Doesn't Match Who You've Become
\`\`\`

**What It Looks Like**
\`\`\`
Your website was built three years ago and feels dated. Prospects see your materials and question whether you can handle their scale. Your brand doesn't reflect the sophistication of your operation.
\`\`\`

**What I Do**
\`\`\`
Rebuild from strategy through launch. Brand positioning, identity systems, website architecture, and conversion-focused execution. Not just prettier—measurably better at driving leads and closing deals.
\`\`\`

### Problem 3: Need to Move Fast Without Hiring Three People

**Heading**
\`\`\`
Need to Move Fast Without Hiring Three People
\`\`\`

**What It Looks Like**
\`\`\`
You need brand work, a new website, marketing automation, and operational improvements. Hiring specialists for each function is slow and expensive. You need someone who can own the full scope.
\`\`\`

**What I Do**
\`\`\`
Take ownership end-to-end. One engagement, from discovery through deployment. Brand strategy, web development, systems integration, and ongoing optimization. The range to execute across disciplines with the depth to do each one well.
\`\`\`

### Process Overview

**Heading**
\`\`\`
The Process
\`\`\`

**Intro**
\`\`\`
Every engagement follows the same framework:
\`\`\`

**Steps**
\`\`\`typescript
const processSteps = [
  {
    title: "Discovery",
    description: "Understand the real problem, not just the symptoms. Map current workflows, identify friction points, and align on success metrics."
  },
  {
    title: "Strategy",
    description: "Define the approach. What gets built, in what order, and how we'll measure success. Clear scope, realistic timeline, no surprises."
  },
  {
    title: "Build",
    description: "Execute with regular check-ins. You see progress as it happens, not all at once at the end."
  },
  {
    title: "Optimize",
    description: "Measure results, refine based on data, and hand off or continue based on what you need."
  }
];
\`\`\`

---

## Contact Section

### Section Header
\`\`\`
Let's Talk
\`\`\`

### Intro Copy
\`\`\`
Working on something that needs systems thinking? Let's discuss what you're building and how I can help.
\`\`\`

### Form Fields
\`\`\`typescript
const formFields = [
  { name: "name", label: "Name", type: "text", required: false },
  { name: "email", label: "Email", type: "email", required: true },
  { 
    name: "message", 
    label: "Message", 
    type: "textarea", 
    required: false,
    placeholder: "Tell me about what you're working on..."
  }
];

const submitButton = "Send Message";
\`\`\`

### Expectation Setting
\`\`\`
I'll respond within 24 hours. If it sounds like a fit, we'll set up a quick call to discuss your project in detail.
\`\`\`

### Alternative Contact
\`\`\`
Prefer email? Reach me directly at contact@andrewmindy.com
\`\`\`

---

## Footer

### Copyright
\`\`\`
© 2026 Andrew Mindy
\`\`\`

### Links (Optional)
\`\`\`typescript
const footerLinks = [
  { label: "LinkedIn", href: "https://linkedin.com/in/andrewmindy" },
  { label: "GitHub", href: "https://github.com/andrewmindy" }
];
\`\`\`

---

## Work Gallery Page (/work)

### Page Header
\`\`\`
Work
\`\`\`

### Page Intro (Optional)
\`\`\`
A selection of projects spanning revenue operations, systems automation, and full-stack product development.
\`\`\`

### Filter Categories
\`\`\`typescript
const categories = [
  { value: "all", label: "All" },
  { value: "revenue-ops", label: "Revenue Operations" },
  { value: "automation", label: "Systems & Automation" },
  { value: "product", label: "Product Development" },
  { value: "creative", label: "Brand & Creative" }
];
\`\`\`

---

## Case Study: Atlanta Regional Roofing Company

### Page Metadata
\`\`\`typescript
const metadata = {
  title: "Atlanta Regional Roofing Company",
  client: "Regional Roofing Company (Atlanta, GA)",
  industry: "Home Services / Roofing",
  timeline: "4 years (Spring 2018 – Spring 2022)",
  role: "Sales → Training Manager → Assistant Sales Manager",
  scope: "Sales systems, training curriculum, SOP creation, revenue operations",
  category: "revenue-ops"
};
\`\`\`

### One-Line Summary (Card)
\`\`\`
Built a psychology-based sales training system that scaled a regional roofing company from $3M to $20M in four years.
\`\`\`

### Key Metrics
\`\`\`typescript
const metrics = [
  { value: "$3M → $20M", label: "Revenue Growth" },
  { value: "35% → 52%", label: "Close Rate" },
  { value: "7x", label: "Review Volume Increase" }
];
\`\`\`

### The Challenge
\`\`\`
I joined a profitable but lean regional roofing company with six salespeople, ten support staff, and approximately $3M in annual revenue. They had built a strong reputation through quality work and referrals, but growth had plateaued.

The company had no documented sales system, no formal training program, and no standardized processes. Each salesperson had developed their own approach. This worked fine at smaller scale, but made growth unpredictable—there was no way to reliably onboard new reps or ensure consistency across the team.

When a new rep joined, they either figured it out through observation or failed. The close rate varied wildly depending on who was running the appointment. There was talent on the team, but no system to scale it.
\`\`\`

### The Approach
\`\`\`
I started on the sales floor, running appointments and closing deals. Within six months, I was consistently exceeding $100K per month in revenue sold, with recurring months over $200K and peak performance above $300K. I maintained a close rate above 50% on confirmed appointments.

That hands-on experience informed everything I built next. When leadership asked me to develop a training program, I didn't create theoretical material—I documented exactly what was working on the floor and why.

The core insight was this: sales is a trainable skill, not an innate talent. If you understand the psychology behind buying decisions and trust the process, you can build a system that works for anyone willing to follow it.
\`\`\`

### The Execution
\`\`\`
I designed a structured onboarding program that could take someone with zero sales experience and make them productive in 30 days:

• Two weeks of classroom training covering product knowledge, buyer psychology, objection handling, and deal structuring

• One week in the field shadowing experienced reps and running practice appointments

• One week of debrief and support as they transitioned to running their own appointments

I ran cohorts of 8-10 trainees at a time. The results were immediate and consistent. New reps—including people who had never sold anything before—were producing approximately $200K in first-month revenue sold.

Two standout examples: a retail worker with no sales background exceeded $150K in month one and $200K in month two. A chef from a local restaurant hit similar numbers. Both succeeded because they trusted the system.

Beyond training, I standardized SOPs across five departments: Sales, Confirmation, Operations, Production, and Insurance. These weren't theoretical documents—they were working playbooks that removed guesswork and ensured consistency.

I also implemented systematic follow-up using Podium and internal tracking systems to improve the customer experience. This drove review volume up approximately 7x and strengthened the company's market position.
\`\`\`

### The Results
\`\`\`typescript
const results = [
  "Revenue: $3M/year → $20M/year over four years",
  "Close rate: 35% → 52% improvement through systematic training and process refinement",
  "Review volume: 7x increase through consistent follow-up and customer experience improvements",
  "New rep production: ~$200K first-month revenue sold, including zero-experience hires",
  "Standout trainees: Retail worker and chef both exceeded $150K month one, $200K month two"
];
\`\`\`

### What This Demonstrates
\`\`\`
This project shows my ability to:

• Understand operations from the inside—I wasn't an outside consultant theorizing; I was on the floor closing deals

• Document and systematize what works—turn tribal knowledge into repeatable processes

• Train and scale teams—enable new people to succeed quickly through structured systems

• Drive measurable growth—not incremental improvement, but 6x revenue scale over four years
\`\`\`

---

## Case Study: Southern Water Service & GloFlo

### Page Metadata
\`\`\`typescript
const metadata = {
  title: "Southern Water Service & GloFlo",
  client: "Southern Water Service & GloFlo",
  industry: "Industrial Equipment / B2B Distribution",
  timeline: "~2 months",
  role: "Systems Architect, Web Developer, Automation Engineer",
  scope: "E-commerce website, product marketing, custom AI-powered CRM and lead management platform",
  category: "automation"
};
\`\`\`

### One-Line Summary (Card)
\`\`\`
Built an AI-powered platform that eliminated 1,000+ hours of manual work annually and saved $73K in labor costs.
\`\`\`

### Key Metrics
\`\`\`typescript
const metrics = [
  { value: "95%", label: "Faster Lead Search" },
  { value: "1,000+", label: "Hours Reclaimed/Year" },
  { value: "$73K", label: "Annual Labor Savings" }
];
\`\`\`

### The Challenge
\`\`\`
Southern Water Service & GloFlo had outgrown their spreadsheet-and-email workflow. They were managing B2B distribution for industrial water treatment equipment, and every lead required manual data entry, follow-up tracking, and document management across multiple systems.

The team was losing approximately 4.2 hours per day to friction: searching for lead information, manually entering data into spreadsheets, tracking follow-ups, and keeping internal documentation up to date.

They also needed a modern e-commerce presence to support direct sales and improve their market positioning. The existing site was outdated and didn't reflect the sophistication of their operation.
\`\`\`

### The Approach
\`\`\`
I embedded with the team to map every touchpoint in their workflow: how leads came in, how they were qualified, how follow-ups were tracked, and where bottlenecks occurred.

Rather than force them into an off-the-shelf CRM that wouldn't fit their process, I built a custom AI-powered platform designed specifically around their needs. The goal was to eliminate manual steps entirely and surface the information they needed when they needed it.
\`\`\`

### The Execution
\`\`\`
The project had two main components:

1. New E-Commerce Website

Built a modern, conversion-focused website with product catalogs, technical specifications, and direct purchase capabilities. Positioned the brand as a sophisticated partner for industrial clients.

2. Custom AI-Powered Platform

Developed a unified platform that handled:

• CRM: Lead tracking and pipeline management

• Lead scraping: Automated data collection from multiple sources

• AI-assisted email: Smart templates and automated follow-up sequences

• Automated data entry: Information captured once and synced everywhere

• Document management: Internal knowledge base with instant search

The platform integrated with their existing tools and workflows, so adoption was seamless. The team didn't have to change how they worked—the system adapted to them.
\`\`\`

### The Results
\`\`\`typescript
const results = [
  "Lead entry: 1 minute → 20 seconds (67% faster)",
  "Batch lead search: 25 minutes → 1.2 minutes (95% faster)",
  "Time reclaimed: ~1,000+ hours per year",
  "Total annual labor savings: $37,221"
];
\`\`\`

### What This Demonstrates
\`\`\`
This project shows my ability to:

• Diagnose operational inefficiencies—identify where manual work is costing time and money

• Build custom solutions—create tools tailored to specific workflows, not force-fit existing products

• Integrate across systems—ensure new tools work with existing infrastructure

• Deliver measurable ROI—quantify time and cost savings with precision
\`\`\`

---

## Case Study: Notova

### Page Metadata
\`\`\`typescript
const metadata = {
  title: "Notova",
  client: "Personal Project",
  industry: "SaaS / Productivity",
  timeline: "~3 weeks from concept to launch",
  role: "Founder, Designer, Full-Stack Developer",
  scope: "Full-stack SaaS application",
  stack: "Next.js, TypeScript, React, Tailwind, Prisma, PostgreSQL, Supabase, AWS, Vercel",
  liveUrl: "notova.app",
  category: "product"
};
\`\`\`

### One-Line Summary (Card)
\`\`\`
Designed and built a full-stack SaaS product from concept to launch in three weeks.
\`\`\`

### Key Metrics
\`\`\`typescript
const metrics = [
  { value: "3 Weeks", label: "Concept to Launch" },
  { value: "Full-Stack", label: "Owned Everything" },
  { value: "Live", label: "notova.app" }
];
\`\`\`

### The Challenge
\`\`\`
Evernote users who want to leave face a problem: .enex files are a proprietary format most note-taking apps can't read. When I decided to migrate away from Evernote, I hit this problem myself.

I looked for a clean solution. The existing tools were clunky, limited, or required technical knowledge most people don't have. There was a clear gap in the market for a tool that just worked—import your notes, get them organized, and move on.
\`\`\`

### The Approach
\`\`\`
I decided to build the tool I wished existed. The product needed to be:

• Simple: Upload your .enex file, see your notes immediately

• Smart: Use AI to auto-organize and surface insights

• Fast: Handle large notebooks without lag

• Flexible: Support multiple formats beyond just Evernote

I set a timeline: three weeks from concept to deployed product. Fast enough to validate the idea without overbuilding, tight enough to force prioritization.
\`\`\`

### The Execution
\`\`\`
I built Notova as a full-stack SaaS application using modern web technologies:

• Frontend: Next.js with TypeScript and React for a fast, type-safe UI

• Styling: Tailwind CSS for responsive, customizable design

• Database: PostgreSQL with Prisma ORM for reliable data management

• Backend: Supabase for auth and real-time capabilities

• Infrastructure: AWS for file processing, Vercel for deployment

The core features included:

• Native .enex import: Full Evernote notebook support with metadata preservation

• Multi-format support: Import from multiple sources, not just Evernote

• AI-powered organization: Auto-generated smart tags based on content analysis

• AI summaries: Generate summaries for individual notes and entire notebooks

• Smart search: Find notes quickly with advanced filtering

• Custom themes: Personalize the interface to match your preferences

I shipped the MVP in three weeks as planned. The product was live, functional, and solving a real problem.
\`\`\`

### What This Demonstrates
\`\`\`
Notova isn't a client project—it's proof of what I can build when I own the entire stack:

• Product thinking: Identify a real problem and build a solution that works

• Full-stack capability: Design, develop, and deploy production-grade applications

• Modern stack proficiency: Comfortable with contemporary tools and best practices

• Speed of execution: Move from concept to launch in weeks, not months

• Technical depth: Handle complex integrations like AI analysis and file parsing

This is what I bring to client work: the ability to understand a problem, move fast, and ship something real.
\`\`\`

---

## Case Study Navigation

### Previous/Next Links
\`\`\`typescript
const caseStudyNav = {
  "atlanta-roofing": { prev: null, next: "southern-water" },
  "southern-water": { prev: "atlanta-roofing", next: "notova" },
  "notova": { prev: "southern-water", next: null }
};
\`\`\`

### Back Link
\`\`\`
← Back to Work
\`\`\`

### CTA (End of Case Study)
\`\`\`
Let's Talk About Your Project →
\`\`\`

---

## Error States & Microcopy

### Contact Form Validation
\`\`\`typescript
const validationMessages = {
  emailRequired: "Email is required",
  emailInvalid: "Please enter a valid email address",
  submitSuccess: "Message sent. I'll be in touch within 24 hours.",
  submitError: "Something went wrong. Please try again or email me directly."
};
\`\`\`

### 404 Page
**Headline**
\`\`\`
Page not found
\`\`\`

**Copy**
\`\`\`
The page you're looking for doesn't exist or has been moved.
\`\`\`

**CTA**
\`\`\`
Go Home →
\`\`\`

---

## Data Export (For Development)

### All Projects Array
\`\`\`typescript
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
    featured: true
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
    featured: true
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
    liveUrl: "https://notova.app"
  }
];
\`\`\`

### Site Copy Object
\`\`\`typescript
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
      "I started as a designer, spent four years on a sales floor closing deals and building training systems, and evolved into someone who can own the full stack—from brand strategy to custom automation.",
      "That sales floor experience changed how I think about creative work. When you've sold $160K+ per month and watched reps succeed or struggle based on whether the system supported them, you stop designing for awards. You design for conversion. You build systems that remove friction and create predictability.",
      "Now I work with companies that have outgrown their current tools and processes. The brand that got you to $1M won't get you to $10M. The manual workflows that worked with five people break down with fifty. I help systematize what's working so it scales without you."
    ]
  },
  howIWork: {
    intro: "I work with companies facing one or more of these situations:",
    problems: [
      {
        title: "Outgrowing Current Systems",
        situation: "Your team is spending hours on manual tasks. Lead follow-up is inconsistent. Data lives in spreadsheets instead of dashboards. The processes that worked at $1M are breaking down at $5M.",
        solution: "Audit your workflows, identify bottlenecks, and build automation that reclaims time and eliminates friction. From custom CRM platforms to AI-powered lead management, I create systems that scale with you."
      },
      {
        title: "Brand Doesn't Match Who You've Become",
        situation: "Your website was built three years ago and feels dated. Prospects see your materials and question whether you can handle their scale. Your brand doesn't reflect the sophistication of your operation.",
        solution: "Rebuild from strategy through launch. Brand positioning, identity systems, website architecture, and conversion-focused execution. Not just prettier—measurably better at driving leads and closing deals."
      },
      {
        title: "Need to Move Fast Without Hiring Three People",
        situation: "You need brand work, a new website, marketing automation, and operational improvements. Hiring specialists for each function is slow and expensive. You need someone who can own the full scope.",
        solution: "Take ownership end-to-end. One engagement, from discovery through deployment. Brand strategy, web development, systems integration, and ongoing optimization. The range to execute across disciplines with the depth to do each one well."
      }
    ],
    process: [
      { title: "Discovery", description: "Understand the real problem, not just the symptoms. Map current workflows, identify friction points, and align on success metrics." },
      { title: "Strategy", description: "Define the approach. What gets built, in what order, and how we'll measure success. Clear scope, realistic timeline, no surprises." },
      { title: "Build", description: "Execute with regular check-ins. You see progress as it happens, not all at once at the end." },
      { title: "Optimize", description: "Measure results, refine based on data, and hand off or continue based on what you need." }
    ]
  },
  contact: {
    headline: "Let's Talk",
    intro: "Working on something that needs systems thinking? Let's discuss what you're building and how I can help.",
    expectation: "I'll respond within 24 hours. If it sounds like a fit, we'll set up a quick call to discuss your project in detail.",
    alternativeContact: "Prefer email? Reach me directly at contact@andrewmindy.com",
    submitButton: "Send Message",
    formPlaceholder: "Tell me about what you're working on..."
  }
};
\`\`\`

---

## Implementation Checklist

Use this to track copy implementation:

- [ ] Site metadata (title, meta descriptions)
- [ ] Navigation labels and CTAs
- [ ] Hero section (headline, subhead, proof points, CTAs)
- [ ] Selected Work section (header, project cards, footer link)
- [ ] About section (full copy)
- [ ] How I Work section (intro, 3 problem blocks, process steps)
- [ ] Contact section (headline, intro, form, expectation, alternative)
- [ ] Footer (copyright, links)
- [ ] Work gallery page (header, intro, filters)
- [ ] Case study: Atlanta Roofing (all sections)
- [ ] Case study: Southern Water (all sections)
- [ ] Case study: Notova (all sections)
- [ ] Case study navigation (prev/next, back, CTA)
- [ ] Error states and microcopy
- [ ] 404 page

---

*End of Copy Document*
