"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import styles from "./DesignCta.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function DesignCta() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        const els = sectionRef.current?.querySelectorAll(
            `.${styles.label}, .${styles.heading}, .${styles.sub}, .${styles.actions}`
        );
        if (!els) return;

        gsap.fromTo(
            els,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.12,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
            }
        );
    }, { scope: sectionRef });

    return (
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.inner}>
                <div className={styles.orbLeft} />
                <div className={styles.orbRight} />

                <span className={styles.label}>Ready when you are</span>
                <h2 className={styles.heading}>
                    Let&rsquo;s build something<br />
                    <span className={styles.outlined}>you&rsquo;re proud of.</span>
                </h2>
                <p className={styles.sub}>
                    Every project starts with a conversation. No hard sell, no pitch deck.
                    Just an honest look at what you need and whether I&rsquo;m the right fit.
                </p>
                <div className={styles.actions}>
                    <Link href="/contact" className={styles.primaryBtn}>
                        Start the Conversation
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}
