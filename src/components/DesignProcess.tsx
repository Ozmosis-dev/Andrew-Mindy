"use client";

import { useRef, MouseEvent, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import MaskedTextReveal from "./MaskedTextReveal";
import styles from "./DesignProcess.module.scss";
import { DiscoveryIcon, StrategyIcon, DesignBuildIcon, LaunchIcon } from "./ProcessIcons";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const steps = [
    {
        id: "01",
        title: "Discovery",
        description:
            "We start by understanding your business, your audience, and the gap between where you are and where you need to be. No assumptions. No templates. Just clear diagnosis.",
        Icon: DiscoveryIcon,
    },
    {
        id: "02",
        title: "Strategy",
        description:
            "Before a single pixel moves, we define the positioning, the message hierarchy, and how every design decision connects back to a business outcome.",
        Icon: StrategyIcon,
    },
    {
        id: "03",
        title: "Design & Build",
        description:
            "Design and development happen together — not in a handoff chain. You see real work early and often. Revisions are structured, not open-ended.",
        Icon: DesignBuildIcon,
    },
    {
        id: "04",
        title: "Launch & Hand Off",
        description:
            "Everything gets tested against real-world use cases. You receive a fully documented system you own completely — no dependency on me to keep it running.",
        Icon: LaunchIcon,
    },
];

export default function DesignProcess() {
    const sectionRef = useRef<HTMLElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        let ctx = gsap.context(() => {
            const container = scrollContainerRef.current;
            const panels = gsap.utils.toArray(`.${styles.card}`);

            if (!container || !panels.length) return;

            ScrollTrigger.matchMedia({
                // Desktop: Horizontal Scroll
                "(min-width: 900px)": function () {
                    // Translate left until the right edge of container aligns with the viewport edge. 
                    // (We will add healthy padding-right in CSS so the 4th card centers nicely).
                    const getScrollDistance = () => container.scrollWidth - window.innerWidth;

                    // Extend the pinning duration slightly beyond the plain width for a relaxed scrub feel
                    const getScrollEnd = () => `+=${container.scrollWidth * 1.4}`;

                    const tween = gsap.to(container, {
                        x: () => -getScrollDistance(),
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            pin: true,
                            scrub: 1,
                            end: getScrollEnd,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Progress bar animation
                    gsap.to(progressRef.current, {
                        scaleX: 1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top top",
                            scrub: 1,
                            end: getScrollEnd,
                            invalidateOnRefresh: true,
                        }
                    });

                    // Initial fade up for the track container to avoid fighting CSS transitions on cards
                    gsap.from(container, {
                        y: 40,
                        opacity: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: sectionRef.current,
                            start: "top 75%",
                        }
                    });

                    return () => {
                        tween.kill();
                    };
                },

                // Mobile: Vertical Fade-Ups
                "(max-width: 899px)": function () {
                    panels.forEach((panel: any) => {
                        gsap.from(panel, {
                            y: 50,
                            opacity: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: panel,
                                start: "top 85%",
                                toggleActions: "play none none reverse",
                            },
                        });
                    });

                    gsap.set(progressRef.current, { scaleX: 0 });
                },
            });
        }, sectionRef);

        return () => ctx.revert();
    }, { scope: sectionRef });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>, cardElement: HTMLDivElement) => {
        const rect = cardElement.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardElement.style.setProperty("--mouse-x", `${x}px`);
        cardElement.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.header}>
                <span className={styles.eyebrow}>How It Works</span>
                <MaskedTextReveal
                    text="THE PROCESS"
                    tag="h2"
                    className={styles.title}
                    triggerPoint="top 85%"
                />
                <p className={styles.intro}>
                    Every project follows the same disciplined structure.
                    No surprises. No scope creep. Just clean execution.
                </p>
                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBar} ref={progressRef} />
                </div>
            </div>

            <div className={styles.scrollWrapper}>
                <div className={styles.scrollContainer} ref={scrollContainerRef}>
                    {steps.map((step) => (
                        <div
                            key={step.id}
                            className={styles.card}
                            onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                        >
                            <div className={styles.watermark}>{step.id}</div>
                            <div className={styles.cardContent}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.stepNum}>{step.id}</span>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                </div>
                                <div className={styles.iconWrapper}>
                                    <step.Icon />
                                </div>
                                <p className={styles.stepDesc}>{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
