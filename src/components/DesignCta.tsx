"use client";

import { useRef, useState, useEffect } from "react";
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
            <div className={styles.waveContainer}>
                <img
                    src="/images/Black-wave.jpg"
                    alt=""
                    className={styles.waveImage}
                />
            </div>

            <div className={styles.inner}>
                <div className={styles.orbLeft} />
                <div className={styles.orbRight} />

                <span className={styles.label}>Ready when you are</span>
                <h2 className={styles.heading}>
                    Let&rsquo;s build something<br />
                    <ProudOfOutlineText />
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

function ProudOfOutlineText() {
    const wrapperRef = useRef<HTMLSpanElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const letterEls = useRef<(SVGTextElement | null)[]>([]);
    const [fontsReady, setFontsReady] = useState(false);

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

                // Use a default width for space characters which might return 0
                const width = bbox.width > 0 ? bbox.width : 50;

                cursor += width;
                if (bbox.y < minY) minY = bbox.y;
                if (bbox.y + bbox.height > maxY) maxY = bbox.y + bbox.height;
            });

            // Sensible fallbacks if something goes wrong
            if (minY === Infinity) minY = 0;
            if (maxY === -Infinity) maxY = 200;

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

    useGSAP(
        () => {
            if (!fontsReady) return;

            const els = letterEls.current.filter(
                (el): el is SVGTextElement => el !== null
            );
            if (els.length === 0) return;

            gsap.set(els, { opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: wrapperRef.current,
                    start: "top 90%",
                    end: "top 55%",
                    scrub: 2,
                },
            });

            tl.to(els, {
                strokeDashoffset: 0,
                duration: 1,
                ease: "sine.inOut",
                stagger: {
                    each: 0.15,
                    ease: "none",
                },
            });
        },
        { scope: wrapperRef, dependencies: [fontsReady] }
    );

    const chars = "YOU'RE PROUD OF.".split("");

    return (
        <span ref={wrapperRef} className={styles.proudOfSvgWrapper} aria-label="you're proud of.">
            <svg
                ref={svgRef}
                viewBox="0 0 1000 215"
                className={styles.proudOfSvg}
                overflow="visible"
                aria-hidden="true"
            >
                {chars.map((letter, i) => (
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
