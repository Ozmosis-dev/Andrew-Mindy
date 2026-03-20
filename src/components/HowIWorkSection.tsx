"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HowIWorkSection.module.scss";
import { siteCopy } from "../data/copy";
import MaskedTextReveal from "./MaskedTextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const getStepGraphic = (idx: number) => {
    switch (idx) {
        case 0:
            return (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardGraphic}>
                    <motion.rect x="5" y="10" width="30" height="20" rx="4" stroke="var(--accent)" strokeWidth="1.5"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                    <motion.line x1="10" y1="20" x2="30" y2="20" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 4"
                        initial={{ x2: 10 }} whileInView={{ x2: 30 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.5 }} />
                </svg>
            );
        case 1:
            return (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardGraphic}>
                    <motion.path d="M5 10 h30 M5 20 h30 M5 30 h30 M10 5 v30 M20 5 v30 M30 5 v30" stroke="var(--accent)" strokeWidth="1" opacity="0.3"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                    <motion.path d="M10 20 L20 10 L30 20 L30 30 L10 30 Z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.4 }} />
                </svg>
            );
        case 2:
            return (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardGraphic}>
                    <motion.path d="M10 30 L15 15 L25 25 L30 10" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                    <motion.circle cx="10" cy="30" r="2" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.1 }} />
                    <motion.circle cx="15" cy="15" r="2" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 0.6 }} />
                    <motion.circle cx="25" cy="25" r="2" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 1.1 }} />
                    <motion.circle cx="30" cy="10" r="2" fill="var(--accent)" initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: 1.5 }} />
                </svg>
            );
        case 3:
        default:
            return (
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.cardGraphic}>
                    <motion.path d="M5 35 Q 25 35 35 5" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" fill="none"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.5 }} />
                    <motion.path d="M25 5 L35 5 L35 15" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"
                        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.3 }} />
                </svg>
            );
    }
};

export default function HowIWorkSection() {
    const containerRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Square rotates multiple full turns and moves horizontally from 0 to 100%
    const squareRotate = useTransform(scrollYProgress, [0, 1], [0, 1080]);
    const squareLeft = useTransform(scrollYProgress, [0, 1], ["calc(0% - 0px)", "calc(100% - 32px)"]);

    // Fade the whole progress bar in just after scroll starts, and fade out before it ends
    const progressOpacity = useTransform(scrollYProgress, [0, 0.05, 0.95, 1], [0, 1, 1, 0]);

    useGSAP(() => {
        const wrappers = containerRef.current?.querySelectorAll(`.${styles.absoluteWrapper}`);

        wrappers?.forEach((wrapper) => {
            const card = wrapper.querySelector(".gsap-card-animate");

            if (!card) return;

            gsap.fromTo(card,
                { opacity: 0, y: 150, scale: 0.9, filter: "blur(20px)" },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 85%", // Animation starts when top of wrapper hits 85% of viewport
                        end: "top 45%",   // Animation completes earlier (45% instead of 30%) for better readability
                        scrub: 1.5,       // Fluid scrubbing lag, makes the entrance slower and tied to scroll
                    }
                }
            );
        });
    }, { scope: containerRef });

    return (
        <section className={styles.section} ref={containerRef} id="how-i-work">
            <div className={styles.container}>
                <div className={styles.leftCol}>
                    <h2 className={styles.sectionTitle}>
                        <MaskedTextReveal text="HOW I" tag="span" delay={0} triggerPoint="top 120%" />
                        <MaskedTextReveal text="OPERATE" tag="span" delay={0.1} triggerPoint="top 120%" />
                    </h2>
                    <div className={styles.decorativeLine} />

                    <motion.p
                        className={styles.pLead}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "200px" }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        A systematic approach to diagnosing bottlenecks and engineering bespoke, scalable solutions.
                    </motion.p>

                    <div className={styles.visualElement}>
                        <svg viewBox="0 0 350 250" className={styles.lineDiagram} xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="optGrad" gradientUnits="userSpaceOnUse" x1="0" y1="200" x2="350" y2="50">
                                    <stop offset="0%" stopColor="rgba(98, 175, 239, 0.1)" />
                                    <stop offset="50%" stopColor="rgba(98, 175, 239, 0.8)" />
                                    <stop offset="100%" stopColor="#ffffff" />
                                </linearGradient>

                                <filter id="optGlow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="4" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                            </defs>

                            {/* Connecting Line */}
                            <motion.path
                                d="M 30 200 C 100 200, 80 140, 130 140 C 180 140, 150 80, 220 80 C 270 80, 250 30, 320 30"
                                fill="none"
                                stroke="url(#optGrad)"
                                strokeWidth="2"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "200px" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
                            />

                            {/* Nodes & Labels */}
                            <motion.circle cx="30" cy="200" r="4" fill="#62AFEF" filter="url(#optGlow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.1 }} />
                            <motion.text x="30" y="220" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.2 }}>
                                DIAGNOSIS
                            </motion.text>

                            <motion.circle cx="130" cy="140" r="4" fill="#62AFEF" filter="url(#optGlow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.4 }} />
                            <motion.text x="130" y="160" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.5 }}>
                                BLUEPRINT
                            </motion.text>

                            <motion.circle cx="220" cy="80" r="4" fill="#8CC4F3" filter="url(#optGlow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.7 }} />
                            <motion.text x="220" y="100" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 0.8 }}>
                                ENGINEERING
                            </motion.text>

                            <motion.circle cx="320" cy="30" r="5" fill="#ffffff" filter="url(#optGlow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 1 }} />
                            <motion.circle cx="320" cy="30" r="5" fill="none" stroke="#ffffff" strokeWidth="1"
                                initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }} />
                            <motion.text x="320" y="15" fill="var(--primary)" fontSize="12" fontWeight="600" letterSpacing="1.5" textAnchor="end" className={styles.primaryLabel}
                                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "200px" }} transition={{ duration: 0.5, delay: 1.1 }}>
                                SCALE
                            </motion.text>
                        </svg>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.scrollSpacer} />

                    {siteCopy.howIWork.steps.map((step, idx) => {
                        const reverseIdx = siteCopy.howIWork.steps.length - 1 - idx;

                        return (
                            <div
                                key={step.id}
                                className={styles.absoluteWrapper}
                                style={{
                                    top: `calc(${idx * 40}vh)`,
                                    height: `calc(250vh - ${idx * 40}vh - ${reverseIdx * 7.1}rem)`,
                                    zIndex: idx + 10,
                                    "--card-idx": idx
                                } as React.CSSProperties}
                            >
                                <div className={styles.cardWrapper}>
                                    <div className="gsap-card-animate" style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
                                        <div className={styles.card}>
                                            <div className={styles.cardHeader}>
                                                <div className={styles.headerLeft}>
                                                    <span className={styles.stepId}>{step.id}</span>
                                                    <h3 className={styles.cardTitle}>{step.title}</h3>
                                                </div>
                                                <div className={styles.headerRight}>
                                                    {getStepGraphic(idx)}
                                                </div>
                                            </div>

                                            <p className={styles.cardDesc}>{step.description}</p>
                                        </div>

                                        {/* Connecting Line (except last) */}
                                        {idx !== siteCopy.howIWork.steps.length - 1 && (
                                            <div className={styles.glowLine} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Bottom sticky fade overlay */}
                    <div className={styles.scrollFade} />
                </div>
            </div>

            {/* Scroll Progress Indicator (Full Width) */}
            <motion.div className={styles.progressContainerFull} style={{ opacity: progressOpacity }}>
                <div className={styles.progressBarFull}>
                    <motion.div
                        className={styles.rotatingSquareFull}
                        style={{
                            left: squareLeft,
                            rotate: squareRotate,
                        }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
