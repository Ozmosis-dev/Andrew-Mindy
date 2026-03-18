"use client";

import { useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ServicesSection.module.scss";
import MaskedTextReveal from "./MaskedTextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════
   Data
   ═══════════════════════════════════════════ */

interface ServiceItem {
    id: string;
    title: string;
    tagline: string;
    description: string;
    deliverables: string[] | null;
    badge: string | null;
    badgeVariant: "accent" | "muted" | null;
    kind: "service" | "discovery" | "retainer";
}

const services: ServiceItem[] = [
    {
        id: "00",
        title: "Studio Discovery",
        tagline: "Know exactly what you're committing to.",
        description:
            "A structured scoping engagement that produces a Build Brief before any proposal is written — so both sides know exactly what they're committing to. Required before Platform Build or Operations Build.",
        deliverables: [
            "Problem definition",
            "Solution architecture",
            "Technical requirements",
            "Scope & timeline",
            "Go / no-go recommendation",
        ],
        badge: "Pre-Engagement",
        badgeVariant: "muted",
        kind: "discovery",
    },
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
        badge: null,
        badgeVariant: null,
        kind: "service",
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
            "Everything in Marketing Site",
            "~15% savings vs. purchasing separately",
        ],
        badge: "Most Common",
        badgeVariant: "accent",
        kind: "service",
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
        badge: "Requires Discovery",
        badgeVariant: "muted",
        kind: "service",
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
        badge: "Requires Discovery",
        badgeVariant: "muted",
        kind: "service",
    },
    {
        id: "+",
        title: "Retainer",
        tagline: "For clients who've shipped a project and want to stay sharp.",
        description:
            "Strategic, Active, and Build tiers — from advisory-only to full ongoing build capacity. Available exclusively to clients who have completed a project. 3-month minimum.",
        deliverables: ["Strategic", "Active", "Build"],
        badge: "Ongoing",
        badgeVariant: "muted",
        kind: "retainer",
    },
];

/* ═══════════════════════════════════════════
   Expand panel motion variants
   ═══════════════════════════════════════════ */

const expandVariants: any = {
    collapsed: {
        height: 0,
        opacity: 0,
        transition: {
            height: { duration: 0.45, ease: "circOut" },
            opacity: { duration: 0.25 },
        },
    },
    expanded: {
        height: "auto",
        opacity: 1,
        transition: {
            height: { duration: 0.55, ease: "circOut" },
            opacity: { duration: 0.35, delay: 0.15 },
        },
    },
};

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */

export default function ServicesSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggle = useCallback((id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    }, []);

    /* ── GSAP scroll-triggered reveals ── */
    useGSAP(
        () => {
            const rows = sectionRef.current?.querySelectorAll(
                `.${styles.gsapRow}`
            );

            rows?.forEach((row, i) => {
                gsap.fromTo(
                    row,
                    { opacity: 0, y: 50, filter: "blur(14px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        duration: 0.9,
                        ease: "power3.out",
                        delay: i * 0.04,
                        scrollTrigger: {
                            trigger: row,
                            start: "top 92%",
                            end: "top 60%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        },
        { scope: sectionRef }
    );

    const isExpanded = (id: string) => expandedId === id;

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

                {/* ── Service Rows ── */}
                <div className={styles.rows}>
                    {services.map((service) => {
                        const open = isExpanded(service.id);
                        const isFeatured = service.badgeVariant === "accent";

                        return (
                            <div
                                key={service.id}
                                className={`${styles.gsapRow} ${styles.row} ${open ? styles.rowOpen : ""
                                    } ${isFeatured ? styles.rowFeatured : ""}`}
                            >
                                {/* ── Clickable header ── */}
                                <button
                                    className={styles.rowHeader}
                                    onClick={() => toggle(service.id)}
                                    aria-expanded={open}
                                    aria-controls={`panel-${service.id}`}
                                >
                                    {/* Number or Icon */}
                                    <span className={styles.rowNumber}>
                                        {service.id}
                                    </span>

                                    {/* Title + tagline */}
                                    <div className={styles.rowInfo}>
                                        <div className={styles.rowTitleRow}>
                                            <h3 className={styles.rowTitle}>
                                                {service.title}
                                            </h3>
                                            {service.badge && (
                                                <span
                                                    className={`${styles.badge} ${service.badgeVariant === "accent"
                                                        ? styles.badgeAccent
                                                        : styles.badgeMuted
                                                        }`}
                                                >
                                                    {service.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className={styles.rowTagline}>
                                            {service.tagline}
                                        </p>
                                    </div>

                                    {/* Toggle icon */}
                                    <span className={styles.toggleIcon}>
                                        <motion.svg
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            fill="none"
                                            animate={{ rotate: open ? 45 : 0 }}
                                            transition={{
                                                duration: 0.35,
                                                ease: [0.16, 1, 0.3, 1],
                                            }}
                                        >
                                            <line
                                                x1="10"
                                                y1="3"
                                                x2="10"
                                                y2="17"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                            <line
                                                x1="3"
                                                y1="10"
                                                x2="17"
                                                y2="10"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                            />
                                        </motion.svg>
                                    </span>
                                </button>

                                {/* ── Expand panel ── */}
                                <AnimatePresence initial={false}>
                                    {open && (
                                        <motion.div
                                            key={`panel-${service.id}`}
                                            id={`panel-${service.id}`}
                                            className={styles.expandPanel}
                                            variants={expandVariants}
                                            initial="collapsed"
                                            animate="expanded"
                                            exit="collapsed"
                                        >
                                            <div className={styles.expandInner}>
                                                <p className={styles.expandDesc}>
                                                    {service.description}
                                                </p>

                                                {service.deliverables && (
                                                    <div className={styles.expandDeliverables}>
                                                        <span className={styles.deliverablesLabel}>
                                                            {service.kind === "retainer"
                                                                ? "Tiers"
                                                                : service.kind === "discovery"
                                                                    ? "Outputs"
                                                                    : "Deliverables"}
                                                        </span>
                                                        <ul className={styles.deliverablesList}>
                                                            {service.deliverables.map(
                                                                (item, i) => (
                                                                    <li
                                                                        key={i}
                                                                        className={
                                                                            styles.deliverableItem
                                                                        }
                                                                    >
                                                                        {item}
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
