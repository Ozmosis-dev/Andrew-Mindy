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
        title: "Brand System",
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
            "Everything in Brand System",
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
        // Brand System: Core brand mark/asterisk geometry
        return (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M24 8V40M12 16L36 32M12 32L36 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="24" cy="24" r="4" fill="var(--background)" stroke="currentColor" strokeWidth="2" />
            </svg>
        );
    }
    if (id === "02") {
        // Marketing Site: Browser window / wireframe layout
        return (
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
                <path d="M6 18H42" stroke="currentColor" strokeWidth="2" />
                <circle cx="12" cy="14" r="2" fill="currentColor" />
                <circle cx="18" cy="14" r="2" fill="currentColor" />
                <rect x="12" y="26" width="24" height="6" rx="2" fill="currentColor" fillOpacity="0.4" />
            </svg>
        );
    }
    // Brand + Site: Intersecting geometry representing integration
    return (
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <rect x="8" y="8" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="2" />
            <rect x="18" y="18" width="22" height="22" rx="4" fill="currentColor" fillOpacity="0.4" />
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
