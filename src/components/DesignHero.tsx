"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import GravityGrid from "./GravityGrid";
import styles from "./DesignHero.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function DesignHero() {
    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Scroll shrink — same feel as home hero
        gsap.to(containerRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: true,
            },
            scale: 0.92,
            borderRadius: "40px",
            ease: "none",
            transformOrigin: "center top",
        });

        // Staggered reveal on load
        gsap.fromTo(
            [
                `.${styles.eyebrow}`,
                `.${styles.headline}`,
                `.${styles.tagline}`,
                `.${styles.ctaRow}`,
            ],
            { opacity: 0, y: 40, filter: "blur(10px)" },
            {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 1.1,
                stagger: 0.12,
                ease: "power3.out",
                delay: 0.2,
            }
        );
    }, { scope: containerRef });

    return (
        <section className={styles.hero} ref={containerRef}>
            <div className={styles.noise} />

            <div className={styles.content}>
                <span className={styles.eyebrow}>Brand &amp; Web Design</span>

                <h1 className={styles.headline}>
                    <span className={styles.lineOne}>Every pixel</span>
                    <span className={styles.lineTwo}>earns its place.</span>
                </h1>

                <p className={styles.tagline}>
                    Identity systems and websites built to convert — not just to impress.
                    Strategy-first. Always fixed scope. Always fixed price.
                </p>

                <div className={styles.ctaRow}>
                    <Link href="/contact" className={styles.primaryCta}>
                        Start a Project
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                    <a href="#work" className={styles.secondaryCta}>See the Work</a>
                </div>
            </div>

            <div className={styles.scrollIndicator}>
                <span className={styles.scrollLine} />
                <span className={styles.scrollLabel}>Scroll</span>
            </div>

            {/* Decorative accent elements */}
            <div className={styles.accentOrb} />
            <GravityGrid />
        </section>
    );
}
