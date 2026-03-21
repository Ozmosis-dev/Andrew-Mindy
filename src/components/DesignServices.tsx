"use client";

import { useRef, MouseEvent } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MaskedTextReveal from "./MaskedTextReveal";
import styles from "./DesignServices.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const designServices = [
    {
        id: "01",
        title: "Brand Identity",
        tagline: "For companies that have outgrown how they look.",
        description:
            "A complete visual identity built from strategy — not aesthetics alone. We start with positioning and end with a system that works across every touchpoint. Every mark, color, and type choice is made to communicate precisely who you are.",
        deliverables: [
            "Brand strategy & positioning",
            "Logo system & mark",
            "Color, typography & voice guidelines",
            "Production-ready brand guidelines PDF",
        ],
        badge: null,
        badgeVariant: null,
        kind: "service",
    },
    {
        id: "02",
        title: "Web Design + Development",
        tagline: "Built to convert, not just to look good.",
        description:
            "Strategy-first design and development that turns visitors into pipeline. Copywriting, design, and engineering done as one coordinated build — not a handoff chain. The result is a site that actually reflects your brand and moves people to act.",
        deliverables: [
            "Site strategy & copywriting",
            "Full visual design & development",
            "SEO foundation & analytics setup",
            "CMS configured & documented",
        ],
        badge: null,
        badgeVariant: null,
        kind: "service",
    },
    {
        id: "03",
        title: "Brand + Site",
        tagline: "The integrated entry engagement.",
        description:
            "Brand identity and marketing website built together as one coherent system — designed from the same principles, by the same hands. When built together, every decision is made with both contexts in mind. The result is tighter, faster, and more resolved than anything assembled in pieces.",
        deliverables: [
            "Everything in Brand Identity",
            "Everything in Web Design + Development",
            "~15% savings vs. purchasing separately",
        ],
        badge: "Most Common",
        badgeVariant: "accent",
        kind: "service",
    },
] as const;

function getCardGraphic(id: string) {
    if (id === "01") {
        // Brand Identity: Pencil and Paintbrush crossed, clean line art
        return (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                    <mask id="brush-cutout">
                        <rect x="0" y="0" width="48" height="48" fill="white" />
                        <svg x="4" y="4" width="40" height="40" viewBox="0 0 24 24" strokeWidth="4" stroke="black" fill="black">
                            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08Z" />
                            <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                        </svg>
                    </mask>
                </defs>

                {/* Pencil rendered under the mask */}
                <g mask="url(#brush-cutout)">
                    <svg x="4" y="4" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.2">
                        {/* Flipped Pencil */}
                        <g transform="translate(12, 12) scale(-1, 1) translate(-12, -12)">
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                            <path d="m15 5 4 4" />
                        </g>
                    </svg>
                </g>

                {/* Paintbrush fully rendered on top */}
                <svg x="4" y="4" width="40" height="40" viewBox="0 0 24 24" strokeWidth="1.2">
                    <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                    <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                </svg>
            </svg>
        );
    }
    if (id === "02") {
        // Marketing Site: Browser window / wireframe layout
        return (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M6 18H42" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none" />
                <circle cx="18" cy="14" r="2" fill="currentColor" stroke="none" />
                <rect x="12" y="26" width="24" height="6" rx="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
            </svg>
        );
    }
    // Brand + Site: Paintbrush overlapping the Web Design browser window
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <defs>
                <mask id="brush-cutout-2">
                    <rect x="0" y="0" width="48" height="48" fill="white" />
                    {/* Paintbrush mask (thick black stroke to create the gap) */}
                    <svg x="16" y="8" width="32" height="32" viewBox="0 0 24 24" strokeWidth="4" stroke="black" fill="black">
                        <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08Z" />
                        <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
                    </svg>
                </mask>
            </defs>

            {/* Browser Window rendered under the mask */}
            <g mask="url(#brush-cutout-2)">
                <g transform="translate(-4, 0) scale(0.9)">
                    <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2.2" />
                    <path d="M6 18H42" stroke="currentColor" strokeWidth="2.2" />
                    <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none" />
                    <circle cx="18" cy="14" r="2" fill="currentColor" stroke="none" />
                    <rect x="12" y="26" width="24" height="6" rx="2" fill="currentColor" fillOpacity="0.4" stroke="none" />
                </g>
            </g>

            {/* Paintbrush fully rendered on top */}
            <svg x="16" y="8" width="32" height="32" viewBox="0 0 24 24" stroke="currentColor" fill="none" strokeWidth="1.5">
                <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
                <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
            </svg>
        </svg>
    );
}

function BentoCard({ service, index }: { service: typeof designServices[number], index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const isFeatured = service.badgeVariant === "accent";

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty("--mouse-x", `${x}px`);
        cardRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <div
            ref={cardRef}
            className={`${styles.gsapCard} ${styles.bentoCard} ${styles.cardHover} ${isFeatured ? styles.cardWide : ""}`}
            onMouseMove={handleMouseMove}
        >
            <div className={styles.glowOverlay} />
            <div className={styles.graphicIcon}>
                {getCardGraphic(service.id)}
            </div>

            <div className={styles.cardInner}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardNumberTitle}>
                        <span className={styles.cardNumber}>{service.id}</span>
                        <div className={styles.cardTitleRow}>
                            <h3 className={styles.cardTitle}>{service.title}</h3>
                            {service.badge && (
                                <span className={styles.badge}>
                                    {service.badge}
                                </span>
                            )}
                        </div>
                    </div>
                    <p className={styles.cardTagline}>{service.tagline}</p>
                    <p className={styles.cardDesc}>{service.description}</p>
                </div>

                <div className={styles.deliverablesWrapper}>
                    <span className={styles.deliverablesLabel}>Deliverables</span>
                    <ul className={styles.deliverablesList}>
                        {service.deliverables.map((item, i) => (
                            <li key={i} className={styles.deliverableItem}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function DesignServices() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const cards = sectionRef.current?.querySelectorAll(`.${styles.gsapCard}`);
        cards?.forEach((card, i) => {
            gsap.fromTo(
                card,
                { opacity: 0, y: 100, filter: "blur(20px)", scale: 0.95 },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    delay: i * 0.15,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        end: "top 50%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, { scope: sectionRef });

    return (
        <section className={styles.section} ref={sectionRef} id="services">
            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.span
                        className={styles.eyebrow}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        Services
                    </motion.span>

                    <h2 className={styles.sectionTitle}>
                        <MaskedTextReveal text="WHAT I BUILD" tag="span" delay={0} />
                    </h2>

                    <motion.p
                        className={styles.sectionIntro}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        All engagements are scoped, fixed-price, and built to last.
                    </motion.p>
                </div>

                <div className={styles.bentoGrid}>
                    {designServices.map((service, i) => (
                        <BentoCard key={service.id} service={service} index={i} />
                    ))}
                </div>
            </div>
        </section>
    );
}
