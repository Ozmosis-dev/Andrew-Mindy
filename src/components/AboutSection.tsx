"use client";

import { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import styles from "./AboutSection.module.scss";
import { siteCopy } from "../data/copy";
import MaskedTextReveal from "./MaskedTextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);
}

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    useGSAP(() => {
        const paragraphs = sectionRef.current?.querySelectorAll(".gsap-about-animate");
        const isMobile = window.innerWidth < 768;

        paragraphs?.forEach((p) => {
            gsap.fromTo(p,
                { opacity: 0, y: 50, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: p,
                        start: isMobile ? "top 95%" : "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });

        // --- DrawSVG line animations (iOS Safari compatible) ---
        const svg = sectionRef.current?.querySelector(`.${styles.lineDiagram}`);
        if (!svg) return;

        const paths = svg.querySelectorAll("path[data-gsap-draw]");
        const circles = svg.querySelectorAll("circle[data-gsap-fade]");
        const texts = svg.querySelectorAll("text[data-gsap-fade]");

        // Set initial state: lines invisible via DrawSVG
        gsap.set(paths, { drawSVG: "0%" });
        gsap.set(circles, { scale: 0, transformOrigin: "center center" });
        gsap.set(texts, { opacity: 0, y: 10 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: svg,
                start: "top 90%",
                toggleActions: "play none none reverse",
            }
        });

        // Center main line (Marketing → Convergence), delay 0.5
        tl.to(svg.querySelector("#line-main"), { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }, 0.5)
            // Top curve (Brand), delay 0.6
            .to(svg.querySelector("#line-brand"), { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }, 0.6)
            // Bottom curve (Operations), delay 0.8
            .to(svg.querySelector("#line-ops"), { drawSVG: "100%", duration: 1.5, ease: "power2.inOut" }, 0.8)
            // Convergence → Final Outcome, delay 1.6
            .to(svg.querySelector("#line-outcome"), { drawSVG: "100%", duration: 1.0, ease: "power2.inOut" }, 1.6)
            // Starting nodes
            .to([
                svg.querySelector("#node-brand"),
                svg.querySelector("#node-marketing"),
                svg.querySelector("#node-ops"),
            ], { scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 0.5)
            // Convergence node
            .to(svg.querySelector("#node-convergence"), { scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 1.6)
            // Final output node
            .to(svg.querySelector("#node-final"), { scale: 1, duration: 0.5, ease: "back.out(1.7)" }, 1.9)
            // Labels
            .to(svg.querySelectorAll("text[data-gsap-fade]"), { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 }, 0.7);

    }, { scope: sectionRef });

    return (
        <section className={styles.aboutSection} ref={sectionRef} id="about">
            <div className={styles.container}>
                <div className={styles.leftCol}>
                    <h2 className={styles.sectionTitle}>
                        <MaskedTextReveal text="THE" tag="span" delay={0.1} />
                        <MaskedTextReveal text="PHILOSOPHY" tag="span" delay={0.2} />
                    </h2>
                    <div className={styles.decorativeLine} />

                    <div className={styles.visualElement}>
                        <svg viewBox="20 40 350 210" className={styles.lineDiagram} xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="lineGrad" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="250" y2="0">
                                    <stop offset="0%" stopColor="rgba(141, 203, 249, 0)" />
                                    <stop offset="30%" stopColor="rgba(141, 203, 249, 0.4)" />
                                    <stop offset="100%" stopColor="rgba(141, 203, 249, 1)" />
                                </linearGradient>
                                <linearGradient id="lineGradWhite" gradientUnits="userSpaceOnUse" x1="250" y1="0" x2="350" y2="0">
                                    <stop offset="0%" stopColor="rgba(141, 203, 249, 1)" />
                                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.9)" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Center Main Line (Marketing to Convergence) */}
                            <path
                                id="line-main"
                                data-gsap-draw="true"
                                d="M 50 150 L 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                            />

                            {/* Convergence to Final Outcome Line */}
                            <path
                                id="line-outcome"
                                data-gsap-draw="true"
                                d="M 250 150 L 350 150"
                                fill="none"
                                stroke="url(#lineGradWhite)"
                                strokeWidth="1.5"
                            />

                            {/* Top Curve (Brand) */}
                            <path
                                id="line-brand"
                                data-gsap-draw="true"
                                d="M 50 70 C 180 70, 150 150, 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                            />

                            {/* Bottom Curve (Operations) */}
                            <path
                                id="line-ops"
                                data-gsap-draw="true"
                                d="M 50 230 C 180 230, 150 150, 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                            />

                            {/* Starting Nodes */}
                            <circle id="node-brand" data-gsap-fade="true" cx="50" cy="70" r="3" fill="#8dcbf9" filter="url(#glow)" />
                            <circle id="node-marketing" data-gsap-fade="true" cx="50" cy="150" r="3" fill="#8dcbf9" filter="url(#glow)" />
                            <circle id="node-ops" data-gsap-fade="true" cx="50" cy="230" r="3" fill="#8dcbf9" filter="url(#glow)" />

                            {/* Convergence Node */}
                            <circle id="node-convergence" data-gsap-fade="true" cx="250" cy="150" r="4" fill="#8dcbf9" filter="url(#glow)" />

                            {/* Final Output Node */}
                            <circle id="node-final" data-gsap-fade="true" cx="350" cy="150" r="5" fill="#ffffff" filter="url(#glow)" />

                            {/* Output Node Pulse Effect — uses CSS transform which iOS supports fine */}
                            <motion.circle cx="350" cy="150" r="5" fill="none" stroke="#ffffff" strokeWidth="1"
                                initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.9 }} />

                            {/* Labels */}
                            <text data-gsap-fade="true" x="50" y="55" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}>BRAND</text>
                            <text data-gsap-fade="true" x="50" y="135" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}>MARKETING</text>
                            <text data-gsap-fade="true" x="50" y="215" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}>OPERATIONS</text>

                            {/* Stacked Output Labels */}
                            <text data-gsap-fade="true" x="350" y="125" fill="var(--primary)" fontSize="12" fontWeight="600" letterSpacing="1.5" textAnchor="end" className={styles.primaryLabel}>MEASURABLE</text>
                            <text data-gsap-fade="true" x="350" y="140" fill="var(--primary)" fontSize="12" fontWeight="600" letterSpacing="1.5" textAnchor="end" className={styles.primaryLabel}>OUTCOMES</text>
                        </svg>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.leadText}>
                        <MaskedTextReveal
                            text="Three disciplines. One point of convergence."
                            tag="h3"
                            delay={0.1}
                            triggerPoint="top 95%"
                        />
                    </div>

                    <div className={styles.paragraphs}>
                        {siteCopy.about.paragraphs.map((text, idx) => (
                            <p
                                key={idx}
                                className="gsap-about-animate"
                            >
                                {text}
                            </p>
                        ))}
                    </div>

                    {/* Bottom sticky fade overlay */}
                    <div className={styles.scrollFade} />
                </div>
            </div>
        </section>
    );
}
