"use client";

import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ContactSection.module.scss";
import MaskedTextReveal from "./MaskedTextReveal";
import CtaPopup from "./CtaPopup";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard Graphic — animated browser / UI mockup
// ─────────────────────────────────────────────────────────────────────────────

function DashboardGraphic() {
    const svgRef = useRef<SVGSVGElement>(null);
    const inView = useInView(svgRef, { once: true, margin: "-5% 0px" });

    const spring = { type: "spring", stiffness: 280, damping: 22 } as const;

    // Upward-trending line chart — x range 116–436, y range 148–218
    const chartLine = "M 116 218 L 158 204 L 200 210 L 242 192 L 284 196 L 326 177 L 368 181 L 410 162 L 436 150";
    const chartArea = "M 116 218 L 158 204 L 200 210 L 242 192 L 284 196 L 326 177 L 368 181 L 410 162 L 436 150 L 436 230 L 116 230 Z";

    const navYs = [78, 108, 138, 168, 198, 226];
    const gridYs = [152, 168, 184, 200, 216];
    const cards = [{ x: 90, accent: true }, { x: 210 }, { x: 330 }];
    const rows = [{ y: 262, w: 0.72 }, { y: 294, w: 0.46 }, { y: 326, w: 0.88 }];

    // Theme-aware ink token: white on dark, slate on light
    const ink = "var(--svg-ink)";
    const inkA = (o: number) => `color-mix(in srgb, var(--svg-ink) ${Math.round(o * 100)}%, transparent)`;

    return (
        <svg
            ref={svgRef}
            viewBox="0 0 460 360"
            className={styles.signalSvg}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
        >
            <defs>
                <linearGradient id="dashArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#62AFEF" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#62AFEF" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dashBar" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#62AFEF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#62AFEF" stopOpacity="0.35" />
                </linearGradient>
            </defs>

            {/* ── Outer browser frame ── */}
            <motion.rect x="0.5" y="0.5" width="459" height="359" rx="6"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.18"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.1 }}
            />

            {/* Chrome bar fill */}
            <motion.rect x="0.5" y="0.5" width="459" height="35" rx="6"
                fill={ink} fillOpacity="0.045"
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
            />
            <line x1="0" y1="36" x2="460" y2="36" stroke={ink} strokeOpacity="0.12" strokeWidth="0.75" />

            {/* Window control dots */}
            {[14, 26, 38].map((cx, i) => (
                <motion.circle key={cx} cx={cx} cy="18" r="4.5"
                    fill={ink} fillOpacity={0.22 - i * 0.05}
                    initial={{ scale: 0 }}
                    animate={inView ? { scale: 1 } : {}}
                    transition={{ ...spring, delay: 0.3 + i * 0.06 }}
                    style={{ transformOrigin: `${cx}px 18px` }}
                />
            ))}

            {/* URL bar */}
            <motion.rect x="60" y="10" width="210" height="16" rx="8"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.15"
                fill={ink} fillOpacity="0.06"
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
                style={{ transformOrigin: "60px 18px" }}
            />
            {/* Favicon */}
            <motion.rect x="70" y="13" width="10" height="10" rx="2"
                fill="#62AFEF" fillOpacity="0.8"
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ ...spring, delay: 0.55 }}
                style={{ transformOrigin: "75px 18px" }}
            />
            {/* URL text */}
            <motion.rect x="86" y="15" width="108" height="4" rx="2"
                fill={ink} fillOpacity="0.2"
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 0.65 }}
                style={{ transformOrigin: "86px 17px" }}
            />
            {/* Blinking cursor */}
            <rect x="196" y="14" width="1.5" height="8"
                fill={ink} fillOpacity="0.5" className={styles.cursor} />

            {/* Toolbar icons */}
            {[298, 318, 338].map((x, i) => (
                <motion.rect key={x} x={x} y="13" width="10" height="10" rx="2"
                    stroke={ink} strokeWidth="0.75" strokeOpacity="0.2"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 0.5 + i * 0.08 }}
                />
            ))}

            {/* ── Sidebar ── */}
            <line x1="82" y1="36" x2="82" y2="360" stroke={ink} strokeOpacity="0.1" strokeWidth="0.75" />

            {/* Active nav indicator */}
            <motion.rect x="0" y="74" width="3" height="26" rx="1.5"
                fill="#62AFEF"
                initial={{ scaleY: 0 }} animate={inView ? { scaleY: 1 } : {}}
                transition={{ ...spring, delay: 0.8 }}
                style={{ transformOrigin: "1.5px 87px" }}
            />

            {/* Logo placeholder */}
            <motion.rect x="10" y="44" width="62" height="18" rx="2"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.15"
                fill={ink} fillOpacity="0.06"
                initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.55 }}
            />

            {/* Nav items */}
            {navYs.map((y, i) => (
                <motion.g key={y}
                    initial={{ opacity: 0, x: -6 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.35, delay: 0.65 + i * 0.07 }}
                >
                    <rect x="10" y={y} width="14" height="14" rx="2"
                        fill={i === 0 ? "#62AFEF" : ink}
                        fillOpacity={i === 0 ? 0.28 : 0.09} />
                    <rect x="30" y={y + 3} width={i === 0 ? 40 : 32} height="7" rx="1.5"
                        fill={ink} fillOpacity={i === 0 ? 0.28 : 0.1} />
                </motion.g>
            ))}

            {/* Sidebar avatar */}
            <motion.circle cx="41" cy="344" r="12"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.18"
                fill={ink} fillOpacity="0.05"
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ ...spring, delay: 1.1 }}
                style={{ transformOrigin: "41px 344px" }}
            />

            {/* ── Metric cards ── */}
            {cards.map((card, i) => (
                <motion.g key={i}
                    initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.85 + i * 0.1 }}
                >
                    <rect x={card.x} y="44" width="112" height="70" rx="4"
                        stroke={card.accent ? "#62AFEF" : ink}
                        strokeWidth="0.75"
                        strokeOpacity={card.accent ? 0.45 : 0.14}
                        fill={card.accent ? "#62AFEF" : ink}
                        fillOpacity={card.accent ? 0.07 : 0.03} />
                    {card.accent && <rect x={card.x} y="44" width="112" height="2" rx="1" fill="#62AFEF" fillOpacity="0.75" />}
                    {/* Label */}
                    <rect x={card.x + 10} y="56" width="54" height="5" rx="1.5" fill={ink} fillOpacity="0.2" />
                    {/* Value */}
                    <rect x={card.x + 10} y="68" width={card.accent ? 74 : 58} height="20" rx="2"
                        fill={card.accent ? "#62AFEF" : ink}
                        fillOpacity={card.accent ? 0.22 : 0.1} />
                    {/* Trend */}
                    <rect x={card.x + 10} y="98" width="28" height="5" rx="1.5" fill={ink} fillOpacity="0.09" />
                    <rect x={card.x + 44} y="98" width="18" height="5" rx="1.5"
                        fill={card.accent ? "#62AFEF" : ink}
                        fillOpacity={card.accent ? 0.5 : 0.12} />
                    {/* Live pulse on active card */}
                    {card.accent && <>
                        <circle cx={card.x + 104} cy="50" r="4" fill="#62AFEF" fillOpacity="0.85" />
                        <circle cx={card.x + 104} cy="50" r="4"
                            stroke="#62AFEF" strokeWidth="1.5" fill="none"
                            className={styles.metricRing}
                        />
                    </>}
                </motion.g>
            ))}

            {/* ── Chart section ── */}
            {/* Section label */}
            <motion.rect x="90" y="122" width="72" height="6" rx="2"
                fill={ink} fillOpacity="0.18"
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.4, delay: 1.05 }}
                style={{ transformOrigin: "90px 125px" }}
            />
            {/* Chart frame */}
            <motion.rect x="90" y="132" width="354" height="104" rx="4"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.14"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.05 }}
            />
            {/* Y-axis label stubs */}
            {[0, 1, 2, 3].map(i => (
                <motion.rect key={i} x="92" y={140 + i * 24} width="16" height="3" rx="1"
                    fill={ink} fillOpacity="0.12"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.15 + i * 0.04 }}
                />
            ))}
            {/* Grid lines */}
            {gridYs.map((y, i) => (
                <motion.line key={y} x1="116" y1={y} x2="436" y2={y}
                    stroke={ink} strokeWidth="0.5" strokeOpacity="0.08"
                    initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.3, delay: 1.15 + i * 0.05 }}
                />
            ))}
            {/* Area fill */}
            <motion.path d={chartArea} fill="url(#dashArea)"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 1.0, delay: 1.3 }}
            />
            {/* Chart line */}
            <motion.path d={chartLine}
                stroke="#62AFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={inView ? { pathLength: 1, opacity: 1 } : {}}
                transition={{ duration: 1.6, delay: 1.2, ease: "easeInOut" }}
            />
            {/* Live dot at line end */}
            <motion.circle cx="436" cy="150" r="4.5" fill="#62AFEF"
                initial={{ scale: 0 }} animate={inView ? { scale: 1 } : {}}
                transition={{ ...spring, delay: 2.7 }}
                style={{ transformOrigin: "436px 150px" }}
            />
            <circle cx="436" cy="150" r="5.5"
                stroke="#62AFEF" strokeWidth="1.5" fill="none"
                className={styles.chartDotRing}
            />

            {/* ── Table / list rows ── */}
            {/* Section label */}
            <motion.rect x="90" y="236" width="80" height="6" rx="2"
                fill={ink} fillOpacity="0.18"
                initial={{ scaleX: 0 }} animate={inView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.35, delay: 1.35 }}
                style={{ transformOrigin: "90px 239px" }}
            />
            {/* Table frame */}
            <motion.rect x="90" y="246" width="354" height="106" rx="4"
                stroke={ink} strokeWidth="0.75" strokeOpacity="0.14"
                initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 1.35 }}
            />
            {rows.map((row, i) => (
                <motion.g key={i}
                    initial={{ opacity: 0, x: -10 }} animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: 1.5 + i * 0.1 }}
                >
                    {i > 0 && <line x1="90" y1={row.y - 4} x2="444" y2={row.y - 4}
                        stroke={ink} strokeWidth="0.5" strokeOpacity="0.08" />}
                    {/* Avatar */}
                    <circle cx="106" cy={row.y + 8} r="9"
                        fill={ink} fillOpacity="0.07"
                        stroke={ink} strokeWidth="0.5" strokeOpacity="0.15" />
                    {/* Name / sub-label */}
                    <rect x="122" y={row.y + 4} width="72" height="6" rx="1.5" fill={ink} fillOpacity="0.18" />
                    <rect x="122" y={row.y + 14} width="44" height="4" rx="1" fill={ink} fillOpacity="0.09" />
                    {/* Progress track */}
                    <rect x="214" y={row.y + 7} width="188" height="6" rx="3" fill={ink} fillOpacity="0.08" />
                    {/* Progress fill */}
                    <rect x="214" y={row.y + 7} width={188 * row.w} height="6" rx="3" fill="url(#dashBar)" />
                    {/* Value */}
                    <rect x="412" y={row.y + 5} width="28" height="8" rx="2" fill={ink} fillOpacity="0.12" />
                </motion.g>
            ))}
        </svg>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// "BUILD" — SVG outline text that draws itself on scroll
// ─────────────────────────────────────────────────────────────────────────────

function BuildOutlineText() {
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const letterEls = useRef<(SVGTextElement | null)[]>([]);
    const [fontsReady, setFontsReady] = useState(false);

    // After fonts load, measure each letter with getBBox() — position them
    // left-to-right and crop the viewBox tightly to the actual letterforms.
    // Without the Y crop the SVG has ~50px of dead space above the cap-tops
    // which pushes BUILD away from LET'S visually.
    useEffect(() => {
        document.fonts.ready.then(() => {
            const svg = svgRef.current;
            if (!svg) return;

            let cursor = 0;
            let minY = Infinity;
            let maxY = -Infinity;

            letterEls.current.forEach((el) => {
                if (!el) return;
                el.setAttribute("x", String(cursor));
                const bbox = el.getBBox();
                cursor += bbox.width;
                if (bbox.y < minY) minY = bbox.y;
                if (bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
            });

            // 4px padding so strokes at the edge aren't clipped
            const pad = 4;
            const vbY = Math.floor(minY) - pad;
            const vbH = Math.ceil(maxY - vbY) + pad;
            svg.setAttribute(
                "viewBox",
                `0 ${vbY} ${Math.ceil(cursor + 8)} ${vbH}`
            );
            setFontsReady(true);
        });
    }, []);

    // Scroll-scrubbed stroke draw — progress mirrors scroll position.
    // Letters draw left→right as you scroll down, un-draw as you scroll up.
    useGSAP(
        () => {
            if (!fontsReady) return;

            const els = letterEls.current.filter(
                (el): el is SVGTextElement => el !== null
            );
            if (els.length === 0) return;

            // Make letters visible; dashoffset keeps them hidden until drawn
            gsap.set(els, { opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    // Start when BUILD enters from below; end when its top
                    // reaches 35% — fully in view. Animation completes while
                    // the section is centered on screen.
                    start: "top 90%",
                    end: "top 35%",
                    scrub: 2,
                },
            });

            // Each letter gets a full duration so strokes overlap in a wave:
            // B is still drawing when U starts, U when I starts, etc.
            // sine.inOut gives each letter a natural acceleration/deceleration
            // — it doesn't feel like a progress bar, it feels alive.
            tl.to(els, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "sine.inOut",
                stagger: {
                    each: 0.35,  // offset between starts — overlap = 0.65 per letter
                    ease: "none",
                },
            });
        },
        { scope: wrapperRef, dependencies: [fontsReady] }
    );

    return (
        <span ref={wrapperRef} className={styles.buildSvgWrapper} aria-label="BUILD">
            <svg
                ref={svgRef}
                viewBox="0 0 720 215"
                className={styles.buildSvg}
                overflow="visible"
                aria-hidden="true"
            >
                {"BUILD".split("").map((letter, i) => (
                    <text
                        key={i}
                        ref={(el) => {
                            letterEls.current[i] = el;
                        }}
                        x="0"
                        y="200"
                        style={{
                            fontFamily: "var(--font-phosphate)",
                            fontSize: "200px",
                            fill: "none",
                            stroke: "white",
                            strokeWidth: "2.5px",
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeDasharray: 1500,
                            strokeDashoffset: 1500,
                            opacity: 0,
                        }}
                    >
                        {letter}
                    </text>
                ))}
            </svg>
        </span>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Section
// ─────────────────────────────────────────────────────────────────────────────

export default function ContactSection() {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    return (
        <section className={styles.section} id="contact">
            {/* Warm radial glow behind SVG */}
            <div className={styles.bgGlow} aria-hidden="true" />

            <div className={styles.container}>
                {/* ── Main split layout ── */}
                <div className={styles.mainContent}>

                    {/* LEFT — typography + CTA */}
                    <div className={styles.leftCol}>
                        <motion.span
                            className={styles.eyebrow}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Start a Project
                        </motion.span>

                        <h2 className={styles.headline}>
                            <MaskedTextReveal
                                text="LET'S"
                                tag="span"
                                delay={0.05}
                                className={styles.headlineBlock}
                            />
                            <BuildOutlineText />
                            {/* WHAT COMES NEXT. — single line beneath BUILD */}
                            <span className={styles.lastLine}>
                                <MaskedTextReveal
                                    text="WHAT COMES NEXT"
                                    tag="span"
                                    delay={0.25}
                                    className={`${styles.headlineInline} ${styles.headlineBottom}`}
                                />
                                <motion.span
                                    className={`${styles.accentPeriod} ${styles.headlineBottom}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.55,
                                        ease: [0.34, 1.56, 0.64, 1],
                                    }}
                                >
                                    .
                                </motion.span>
                            </span>
                        </h2>

                        {/* Ruled divider */}
                        <motion.div
                            className={styles.rule}
                            initial={{ scaleX: 0 }}
                            whileInView={{ scaleX: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.9, delay: 0.55, ease: "easeOut" }}
                        />

                        <motion.p
                            className={styles.subtext}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: 0.65 }}
                        >
                            Every engagement starts with a conversation — not a
                            proposal. If your brand, site, or systems aren't keeping
                            pace with your growth, that's where we begin.
                        </motion.p>

                        <motion.div
                            className={styles.ctaRow}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 }}
                        >
                            <button onClick={() => setIsPopupOpen(true)} className={styles.primaryBtn}>
                                Begin the Conversation
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </motion.div>


                    </div>

                    {/* RIGHT — dashboard graphic */}
                    <div className={styles.rightCol} aria-hidden="true">
                        <DashboardGraphic />
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {isPopupOpen && <CtaPopup onClose={() => setIsPopupOpen(false)} />}
            </AnimatePresence>
        </section>
    );
}
