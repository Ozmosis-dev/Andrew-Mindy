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

// ─── Animated header SVG — question marks that rise & disintegrate ────────────
// Uses GSAP for reliable cross-browser SVG transforms

type GlyphCfg = { x: number; y: number; size: number; delay: number; dur: number; opacity: number };
const GLYPHS: GlyphCfg[] = [
    { x: 420, y: 460, size: 200, delay: 0, dur: 7.0, opacity: 0.60 },
    { x: 110, y: 490, size: 130, delay: 1.4, dur: 6.6, opacity: 0.65 },
    { x: 320, y: 500, size: 88, delay: 2.8, dur: 6.0, opacity: 0.70 },
    { x: 490, y: 470, size: 105, delay: 0.8, dur: 7.4, opacity: 0.58 },
    { x: 195, y: 455, size: 160, delay: 2.1, dur: 6.8, opacity: 0.55 },
    { x: 370, y: 510, size: 75, delay: 3.6, dur: 5.8, opacity: 0.72 },
    { x: 245, y: 480, size: 115, delay: 1.9, dur: 6.3, opacity: 0.62 },
];



function QuestionMarkAnimation() {
    const svgRef = useRef<SVGSVGElement>(null);

    useGSAP(() => {
        if (!svgRef.current) return;

        GLYPHS.forEach((cfg, gi) => {
            const glyph = svgRef.current!.querySelector<SVGTextElement>(`#qm-g-${gi}`);
            if (!glyph) return;

            const d = cfg.dur;

            const tl = gsap.timeline({ repeat: -1, delay: cfg.delay });

            // Phase 1 — fade in + begin rise
            tl.fromTo(glyph,
                { opacity: 0, y: 0 },
                { opacity: cfg.opacity, y: -70, duration: d * 0.20, ease: "power3.out" }
            );

            // Phase 2 — float upward steadily
            tl.to(glyph, { y: -230, duration: d * 0.45, ease: "none" });

            // Phase 3 — dissolve and continue rising
            tl.to(glyph, { opacity: 0, y: -370, duration: d * 0.35, ease: "power2.in" });
        });
    }, { scope: svgRef });

    return (
        <div className={styles.headerSvgWrap} aria-hidden="true">
            <svg
                ref={svgRef}
                viewBox="0 0 560 520"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: "100%", height: "100%", overflow: "visible" }}
            >
                {GLYPHS.map((g, gi) => (
                    <text
                        key={gi}
                        id={`qm-g-${gi}`}
                        x={g.x}
                        y={g.y}
                        fontSize={g.size}
                        textAnchor="middle"
                        dominantBaseline="auto"
                        fontFamily="'Arial Black', 'Impact', sans-serif"
                        fontWeight="900"
                        fill="rgba(98,175,239,0.09)"
                        stroke={`rgba(98,175,239,${g.opacity})`}
                        strokeWidth="1.8"
                        style={{ opacity: 0, willChange: "transform, opacity" }}
                    >
                        ?
                    </text>
                ))}
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
                            <QuestionMarkAnimation />

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
