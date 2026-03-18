"use client";

import { useRef, ElementType } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./MaskedTextReveal.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface MaskedTextRevealProps {
    text: string;
    className?: string; // To pass in font sizes, colors, etc.
    delay?: number;
    tag?: ElementType; // Allow custom tag (e.g., "h1", "h2", "p")
    triggerPoint?: string; // e.g. "top 85%"
}

export default function MaskedTextReveal({ text, className, delay = 0, tag: Tag = "div", triggerPoint = "top 85%" }: MaskedTextRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const words = containerRef.current?.querySelectorAll(`.${styles.wordVisible}`);

        if (!words || words.length === 0) return;

        // Animate each word as it enters the viewport
        const wrappers = containerRef.current?.querySelectorAll(`.${styles.word}`);

        if (!wrappers || wrappers.length === 0) return;

        gsap.fromTo(words,
            { yPercent: 100 },
            {
                yPercent: 0,
                duration: 0.8,
                ease: "power3.out",
                stagger: 0.1,
                delay: delay,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: triggerPoint,
                    toggleActions: "play none none reverse",
                }
            }
        );
    }, { scope: containerRef });

    return (
        <Tag ref={containerRef} className={className}>
            {text.split(" ").map((word, index) => (
                <span key={index} className={styles.word}>
                    <span className={styles.wordHidden}>{word}</span>
                    <span className={styles.wordVisible}>{word}</span>
                </span>
            ))}
        </Tag>
    );
}
