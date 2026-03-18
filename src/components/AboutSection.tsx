"use client";

import { useRef } from "react";
import { useScroll, motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutSection.module.scss";
import { siteCopy } from "../data/copy";
import MaskedTextReveal from "./MaskedTextReveal";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AboutSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    useGSAP(() => {
        const paragraphs = sectionRef.current?.querySelectorAll(".gsap-about-animate");

        paragraphs?.forEach((p) => {
            gsap.fromTo(p,
                { opacity: 0, y: 50, filter: "blur(10px)" }, // Reduced drop distance and blur for smoother standard entry
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: p,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });
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
                        <svg viewBox="0 0 400 300" className={styles.lineDiagram} xmlns="http://www.w3.org/2000/svg">
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
                            <motion.path
                                d="M 50 150 L 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.1 }}
                            />

                            {/* Convergence to Final Outcome Line */}
                            <motion.path
                                d="M 250 150 L 350 150"
                                fill="none"
                                stroke="url(#lineGradWhite)"
                                strokeWidth="1.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.0, ease: "easeInOut", delay: 1.2 }}
                            />

                            {/* Top Curve (Brand) */}
                            <motion.path
                                d="M 50 70 C 180 70, 150 150, 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                            />

                            {/* Bottom Curve (Operations) */}
                            <motion.path
                                d="M 50 230 C 180 230, 150 150, 250 150"
                                fill="none"
                                stroke="url(#lineGrad)"
                                strokeWidth="1.5"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-10%" }}
                                transition={{ duration: 1.5, ease: "easeInOut", delay: 0.4 }}
                            />

                            {/* Starting Nodes */}
                            <motion.circle cx="50" cy="70" r="3" fill="#8dcbf9" filter="url(#glow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.1 }} />
                            <motion.circle cx="50" cy="150" r="3" fill="#8dcbf9" filter="url(#glow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.1 }} />
                            <motion.circle cx="50" cy="230" r="3" fill="#8dcbf9" filter="url(#glow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.1 }} />

                            {/* Convergence Node */}
                            <motion.circle cx="250" cy="150" r="4" fill="#8dcbf9" filter="url(#glow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 1.2 }} />

                            {/* Final Output Node */}
                            <motion.circle cx="350" cy="150" r="5" fill="#ffffff" filter="url(#glow)"
                                initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 1.5 }} />

                            {/* Output Node Pulse Effect */}
                            <motion.circle cx="350" cy="150" r="5" fill="none" stroke="#ffffff" strokeWidth="1"
                                initial={{ scale: 1, opacity: 1 }} animate={{ scale: 3, opacity: 0 }} transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1.5 }} />

                            {/* Labels */}
                            <motion.text x="50" y="55" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.3 }}>
                                BRAND
                            </motion.text>
                            <motion.text x="50" y="135" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.3 }}>
                                MARKETING
                            </motion.text>
                            <motion.text x="50" y="215" fill="var(--secondary)" fontSize="10" letterSpacing="1" className={styles.label}
                                initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.5, delay: 0.3 }}>
                                OPERATIONS
                            </motion.text>

                            {/* Stacked Output Labels */}
                            <motion.text x="350" y="125" fill="var(--primary)" fontSize="12" fontWeight="600" letterSpacing="1.5" textAnchor="end" className={styles.primaryLabel}
                                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, delay: 1.6 }}>
                                MEASURABLE
                            </motion.text>
                            <motion.text x="350" y="140" fill="var(--primary)" fontSize="12" fontWeight="600" letterSpacing="1.5" textAnchor="end" className={styles.primaryLabel}
                                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-10%" }} transition={{ duration: 0.6, delay: 1.7 }}>
                                OUTCOMES
                            </motion.text>
                        </svg>
                    </div>
                </div>

                <div className={styles.rightCol}>
                    <div className={styles.leadText}>
                        <MaskedTextReveal
                            text="Three disciplines. One point of convergence."
                            tag="h3"
                            delay={0.1}
                            triggerPoint="top 80%"
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
