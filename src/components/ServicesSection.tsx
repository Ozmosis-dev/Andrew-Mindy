"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesSection.module.scss";
import MaskedTextReveal from "./MaskedTextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const services = [
    {
        id: "01",
        title: "Brand System",
        tagline: "For companies that have outgrown how they look.",
        description:
            "A complete visual identity built from strategy—not aesthetics alone. Every element designed to work across every touchpoint and communicate precisely who you are.",
        deliverables: [
            "Brand strategy & positioning",
            "Logo system & mark",
            "Color, typography & voice guidelines",
            "Production-ready brand guidelines PDF",
        ],
        featured: false,
        badge: null,
        span: false,
    },
    {
        id: "02",
        title: "Marketing Site",
        tagline: "Built to convert, not just to look good.",
        description:
            "Strategy-first design and development that turns visitors into pipeline. Copywriting, design, and engineering done as one coordinated build—not a handoff chain.",
        deliverables: [
            "Site strategy & copywriting",
            "Full visual design & development",
            "SEO foundation & analytics setup",
            "CMS configured & documented",
        ],
        featured: false,
        badge: null,
        span: false,
    },
    {
        id: "03",
        title: "Brand + Site",
        tagline: "The integrated entry engagement.",
        description:
            "Brand identity and marketing website built together as one coherent system — designed from the same principles, by the same hands. When built together, every decision is made with both contexts in mind. The result is tighter, faster, and more resolved than anything assembled in pieces.",
        deliverables: null,
        featured: true,
        badge: "Most Common",
        span: true,
    },
    {
        id: "04",
        title: "Platform Build",
        tagline: "Custom applications built to production standards.",
        description:
            "Web applications, internal tools, and early-stage SaaS products engineered for real scale. Fixed scope follows Studio Discovery.",
        deliverables: [
            "Client portals & dashboards",
            "Workflow automation tools",
            "Custom CRMs & pipeline systems",
            "Full-stack SaaS products",
        ],
        featured: false,
        badge: "Requires Discovery",
        span: false,
    },
    {
        id: "05",
        title: "Operations Build",
        tagline: "Systems that make growing companies run better.",
        description:
            "Revenue operations, CRM architecture, and process infrastructure built from the ground up. Fixed scope follows Studio Discovery.",
        deliverables: [
            "CRM architecture & migration",
            "Sales process & automation",
            "Revenue operations infrastructure",
            "Internal knowledge systems",
        ],
        featured: false,
        badge: "Requires Discovery",
        span: false,
    },
];

const discoveryItems = [
    "Problem definition",
    "Solution architecture",
    "Technical requirements",
    "Scope & timeline",
    "Go / no-go recommendation",
];

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(
        () => {
            const cards = sectionRef.current?.querySelectorAll(
                `.${styles.gsapCard}`
            );

            cards?.forEach((card) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 70, filter: "blur(18px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            end: "top 55%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });

            const discovery = sectionRef.current?.querySelector(
                `.${styles.discoveryCallout}`
            );
            if (discovery) {
                gsap.fromTo(
                    discovery,
                    { opacity: 0, y: 50, filter: "blur(12px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: discovery,
                            start: "top 88%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }

            const retainer = sectionRef.current?.querySelector(
                `.${styles.retainerCard}`
            );
            if (retainer) {
                gsap.fromTo(
                    retainer,
                    { opacity: 0, y: 50, filter: "blur(12px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: retainer,
                            start: "top 95%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }
        },
        { scope: sectionRef }
    );

    return (
        <section className={styles.section} ref={sectionRef} id="services">
            <div className={styles.container}>
                {/* ── Header ── */}
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
                        Every engagement is scoped, fixed-price, and built to last.
                    </motion.p>
                </div>

                {/* ── Service Grid ── */}
                <div className={styles.grid}>
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className={`${styles.gsapCard} ${styles.card} ${
                                service.featured ? styles.cardFeatured : ""
                            } ${service.span ? styles.cardSpan : ""}`}
                        >
                            <div className={styles.accentBar} />

                            {service.featured ? (
                                /* ── Featured card layout ── */
                                <div className={styles.featuredInner}>
                                    <div className={styles.featuredLeft}>
                                        <div className={styles.cardTop}>
                                            <span className={styles.cardNumber}>
                                                {service.id}
                                            </span>
                                            <span
                                                className={`${styles.badge} ${styles.badgeAccent}`}
                                            >
                                                {service.badge}
                                            </span>
                                        </div>
                                        <h3 className={styles.cardTitle}>
                                            {service.title}
                                        </h3>
                                        <p className={styles.cardTagline}>
                                            {service.tagline}
                                        </p>
                                    </div>
                                    <div className={styles.featuredRight}>
                                        <p className={styles.cardDesc}>
                                            {service.description}
                                        </p>
                                        <p className={styles.featuredNote}>
                                            ~15% savings vs. purchasing separately.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                /* ── Standard card layout ── */
                                <div className={styles.standardInner}>
                                    <div className={styles.cardTop}>
                                        <span className={styles.cardNumber}>
                                            {service.id}
                                        </span>
                                        {service.badge && (
                                            <span
                                                className={`${styles.badge} ${
                                                    service.badge === "Most Common"
                                                        ? styles.badgeAccent
                                                        : styles.badgeMuted
                                                }`}
                                            >
                                                {service.badge}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.cardBody}>
                                        <h3 className={styles.cardTitle}>
                                            {service.title}
                                        </h3>
                                        <p className={styles.cardTagline}>
                                            {service.tagline}
                                        </p>
                                    </div>
                                    <div className={styles.cardDivider} />
                                    <p className={styles.cardDesc}>
                                        {service.description}
                                    </p>
                                    {service.deliverables && (
                                        <ul className={styles.deliverables}>
                                            {service.deliverables.map((item, i) => (
                                                <li key={i} className={styles.deliverableItem}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* ── Studio Discovery Callout ── */}
                <div className={styles.discoveryCallout}>
                    <div className={styles.discoveryLeft}>
                        <span className={styles.discoveryEyebrow}>
                            Pre-Engagement
                        </span>
                        <div className={styles.discoveryNumber}>00</div>
                    </div>
                    <div className={styles.discoveryRight}>
                        <h3 className={styles.discoveryTitle}>
                            Studio Discovery
                        </h3>
                        <p className={styles.discoveryDesc}>
                            A structured scoping engagement that produces a Build
                            Brief before any proposal is written — so both sides
                            know exactly what they're committing to. Required before
                            Platform Build or Operations Build.
                        </p>
                        <div className={styles.discoveryTags}>
                            {discoveryItems.map((item) => (
                                <span key={item} className={styles.discoveryTag}>
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Retainer Card ── */}
                <div className={styles.retainerCard}>
                    <div className={styles.accentBar} />
                    <div className={styles.retainerInner}>
                        <div className={styles.retainerLeft}>
                            <span className={styles.retainerEyebrow}>Ongoing</span>
                            <h3 className={styles.retainerTitle}>Retainer</h3>
                            <p className={styles.retainerTagline}>
                                For clients who've shipped a project and want to stay sharp.
                            </p>
                        </div>
                        <div className={styles.retainerRight}>
                            <p className={styles.retainerDesc}>
                                Strategic, Active, and Build tiers — from advisory-only
                                to full ongoing build capacity. Available exclusively to
                                clients who have completed a project. 3-month minimum.
                            </p>
                            <div className={styles.retainerTiers}>
                                {["Strategic", "Active", "Build"].map((tier) => (
                                    <span key={tier} className={styles.retainerTier}>
                                        {tier}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
