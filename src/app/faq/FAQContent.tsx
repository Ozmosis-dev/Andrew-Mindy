"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./page.module.scss";
import MaskedTextReveal from "../../components/MaskedTextReveal";
import { faqData, FAQCategory } from "../../data/faq";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─── Ambient orb background ───────────────────────────────────────────────────

function PageBackground() {
    return (
        <div className={styles.pageBackground} aria-hidden="true">
            <div className={styles.orb1} />
            <div className={styles.orb2} />
            <div className={styles.orb3} />
            <div className={styles.grain} />
        </div>
    );
}

// ─── Animated header SVG decoration ──────────────────────────────────────────
// A sparse topography-style radial grid that draws in on load via GSAP

function HeaderSVG() {
    const svgRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        const paths = svgRef.current?.querySelectorAll("circle, path, line");
        if (!paths || paths.length === 0) return;

        gsap.fromTo(
            paths,
            { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" },
            {
                opacity: 1,
                scale: 1,
                duration: 1.4,
                ease: "power3.out",
                stagger: 0.04,
                delay: 0.5,
            }
        );
    }, { scope: svgRef });

    // Concentric rings + radial lines — pure SVG, no external deps
    const rings = [40, 80, 120, 165, 210, 255];
    const lineAngles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
    const cx = 240;
    const cy = 240;

    return (
        <div className={styles.headerSvgWrap}>
            <svg
                ref={svgRef}
                viewBox="0 0 480 480"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                style={{ width: "100%", height: "100%" }}
            >
                <defs>
                    <radialGradient id="faqGridFade" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(98,175,239,1)" />
                        <stop offset="70%" stopColor="rgba(98,175,239,0.5)" />
                        <stop offset="100%" stopColor="rgba(98,175,239,0)" />
                    </radialGradient>
                    <mask id="faqGridMask">
                        <circle cx={cx} cy={cy} r="250" fill="url(#faqGridFade)" />
                    </mask>
                </defs>

                <g mask="url(#faqGridMask)">
                    {/* Radial spoke lines */}
                    {lineAngles.map((angle) => {
                        const rad = (angle * Math.PI) / 180;
                        const x2 = cx + Math.cos(rad) * 255;
                        const y2 = cy + Math.sin(rad) * 255;
                        return (
                            <line
                                key={angle}
                                x1={cx}
                                y1={cy}
                                x2={x2}
                                y2={y2}
                                stroke="rgba(98,175,239,0.25)"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Concentric rings */}
                    {rings.map((r) => (
                        <circle
                            key={r}
                            cx={cx}
                            cy={cy}
                            r={r}
                            stroke="rgba(98,175,239,0.3)"
                            strokeWidth={r === rings[0] ? "2" : "1"}
                        />
                    ))}

                    {/* Intersection dots */}
                    {rings.map((r) =>
                        lineAngles.map((angle) => {
                            const rad = (angle * Math.PI) / 180;
                            const x = cx + Math.cos(rad) * r;
                            const y = cy + Math.sin(rad) * r;
                            return (
                                <circle
                                    key={`${r}-${angle}`}
                                    cx={x}
                                    cy={y}
                                    r={r <= 80 ? 2.5 : 1.8}
                                    fill="rgba(98,175,239,0.6)"
                                />
                            );
                        })
                    )}

                    {/* Center accent dot */}
                    <circle cx={cx} cy={cy} r="5" fill="rgba(98,175,239,0.9)" />
                    <circle cx={cx} cy={cy} r="10" stroke="rgba(98,175,239,0.5)" strokeWidth="1.5" />
                </g>
            </svg>
        </div>
    );
}



// ─── FAQ Card (single accordion item) ────────────────────────────────────────

function FAQCard({
    question,
    answer,
    index,
}: {
    question: string;
    answer: string;
    index: number;
}) {
    const [open, setOpen] = useState(false);

    // Split paragraphs on double newline
    const paragraphs = answer.split("\n\n").filter(Boolean);
    const displayNum = String(index + 1).padStart(2, "0");

    return (
        <motion.div
            className={`${styles.faqCard} ${open ? styles.open : ""}`}
            layout="position"
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Left accent bar — pure CSS transition driven by .open class */}
            <div className={styles.accentBar} aria-hidden="true" />

            {/* Trigger */}
            <button
                className={styles.accordionTrigger}
                onClick={() => setOpen(!open)}
                aria-expanded={open}
            >
                <div className={styles.triggerLeft}>
                    <span className={styles.faqNumber} aria-hidden="true">
                        {displayNum}
                    </span>
                    <span className={styles.questionText}>{question}</span>
                </div>

                <div className={styles.triggerRight}>
                    <span className={styles.toggleWrap} aria-hidden="true">
                        <motion.svg
                            width="18"
                            height="18"
                            viewBox="0 0 12 12"
                            fill="none"
                            animate={{ rotate: open ? 45 : 0 }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <line x1="6" y1="0.5" x2="6" y2="11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <line x1="0.5" y1="6" x2="11.5" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </motion.svg>
                    </span>
                </div>
            </button>

            {/* Answer body */}
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        className={styles.accordionBody}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <motion.div
                            className={styles.accordionAnswer}
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
                            }}
                        >
                            {paragraphs.map((para, i) => (
                                <motion.p
                                    key={i}
                                    className={styles.answerParagraph}
                                    variants={{
                                        hidden: { opacity: 0, y: 10, filter: "blur(4px)" },
                                        visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.45, ease: "easeOut" } },
                                    }}
                                >
                                    {para}
                                </motion.p>
                            ))}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Category section ─────────────────────────────────────────────────────────

function FAQCategorySection({
    category,
    index,
}: {
    category: FAQCategory;
    index: number;
}) {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const cards = sectionRef.current?.querySelectorAll(".faq-card-animate");
        if (!cards || cards.length === 0) return;

        gsap.fromTo(
            cards,
            { opacity: 0, y: 36, filter: "blur(8px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.65,
                ease: "power3.out",
                stagger: 0.065,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <div className={styles.categoryBlock} ref={sectionRef}>
            {/* Category header */}
            <div className={`${styles.categoryHeader} faq-card-animate`}>
                <span className={styles.categoryNumber}>0{index + 1}</span>
                <h2 className={styles.categoryTitle}>{category.title}</h2>
                <div className={styles.categoryLine} />
            </div>

            {/* Cards */}
            {category.items.map((item, i) => {
                // Offset index by previous categories' item count
                const globalIndex =
                    index === 0
                        ? i
                        : faqData[0].items.length + i;

                return (
                    <div key={item.question} className="faq-card-animate">
                        <FAQCard
                            question={item.question}
                            answer={item.answer}
                            index={globalIndex}
                        />
                    </div>
                );
            })}
        </div>
    );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FAQContent() {
    const headerRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);

    // Header entrance
    useGSAP(() => {
        const items = headerRef.current?.querySelectorAll(".header-animate");
        if (!items || items.length === 0) return;

        gsap.fromTo(
            items,
            { opacity: 0, y: 28, filter: "blur(6px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power3.out",
                stagger: 0.1,
                delay: 0.15,
            }
        );
    }, { scope: headerRef });

    // CTA entrance
    useGSAP(() => {
        gsap.fromTo(
            ctaRef.current,
            { opacity: 0, y: 50, filter: "blur(10px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.9,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ctaRef.current,
                    start: "top 88%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: ctaRef });

    return (
        <>
            <PageBackground />

            <div className={styles.content}>
                {/* ── Header ── */}
                <section className={styles.headerSection}>
                    <div className={styles.container}>
                        <div className={styles.headerInner} ref={headerRef}>
                            <HeaderSVG />

                            <div className={`${styles.eyebrow} header-animate`}>
                                FAQ
                            </div>

                            <h1 className={styles.headlineWrapper}>
                                <MaskedTextReveal
                                    text="Common"
                                    tag="span"
                                    delay={0.05}
                                    triggerPoint="top 100%"
                                    className={styles.headlineLine}
                                />
                                <MaskedTextReveal
                                    text="Questions"
                                    tag="span"
                                    delay={0.18}
                                    triggerPoint="top 100%"
                                    className={styles.headlineLine}
                                />
                            </h1>

                            <p className={`${styles.subhead} header-animate`}>
                                Everything you&rsquo;d probably ask in a first call &mdash; answered upfront.
                            </p>

                            {/* Meta strip */}
                            <div className={`${styles.metaStrip} header-animate`}>
                                {[
                                    { icon: "15", label: "Questions" },
                                    { icon: "2", label: "Categories" },
                                    { icon: "0", label: "Pitch Decks" },
                                ].map((m, i) => (
                                    <div key={m.label} style={{ display: "flex", alignItems: "center" }}>
                                        <div className={styles.metaItem}>
                                            <span>{m.icon} {m.label}</span>
                                        </div>
                                        {i < 2 && <div className={styles.metaSep} />}
                                    </div>
                                ))}
                            </div>

                            <div className={`${styles.headerDivider} header-animate`} />
                        </div>
                    </div>
                </section>

                {/* ── FAQ Sections ── */}
                <section className={styles.faqSection}>
                    <div className={styles.container}>
                        {faqData.map((category, index) => (
                            <React.Fragment key={category.title}>
                                <FAQCategorySection
                                    category={category}
                                    index={index}
                                />
                            </React.Fragment>
                        ))}
                    </div>
                </section>

                {/* ── CTA ── */}
                <section className={styles.ctaSection}>
                    <div className={styles.container}>
                        <div className={styles.ctaBlock} ref={ctaRef}>
                            <div className={styles.ctaLeft}>
                                <h2 className={styles.ctaHeadline}>
                                    Still have questions?
                                </h2>
                                <p className={styles.ctaBody}>
                                    The fastest way to get answers is a conversation. Reach out and we&rsquo;ll figure out if it makes sense to work together.
                                </p>
                                <p className={styles.ctaEmail}>
                                    Or email directly:{" "}
                                    <a href="mailto:contact@andrewmindy.com">
                                        contact@andrewmindy.com
                                    </a>
                                </p>
                            </div>
                            <div className={styles.ctaRight}>
                                <Link href="/contact" className={styles.ctaButton}>
                                    Let&rsquo;s Talk &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}
