"use client";

import { useRef, MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Link from "next/link";
import styles from "./DesignExtras.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const categories = [
    {
        label: "Brand & Identity",
        items: ["Logos + Branding", "Design Systems", "Brand Guides", "Wireframes", "Illustrations", "Iconography"],
    },
    {
        label: "Print & Physical",
        items: ["Direct Mail", "Brochures", "Signage", "Stationery", "Print Collateral", "Packaging", "Business Cards"],
    },
    {
        label: "Digital",
        items: ["Websites", "Social Media Graphics", "Email Graphics", "Digital Ads", "Resumes", "Pitch Decks", "Infographics"],
    },
];

export default function DesignExtras() {
    const sectionRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        // Animate Header
        gsap.fromTo(
            sectionRef.current?.querySelector(`.${styles.header}`) || null,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: sectionRef.current?.querySelector(`.${styles.header}`) || null,
                    start: "top 90%",
                    toggleActions: "play none none reverse",
                },
            }
        );

        // Animate Single Card Container
        const card = sectionRef.current?.querySelector(`.${styles.singleCard}`);
        if (card) {
            gsap.fromTo(
                card,
                { opacity: 0, y: 40, filter: "blur(10px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.1,
                    scrollTrigger: {
                        trigger: card,
                        start: "top 90%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        }
    }, { scope: sectionRef });

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        const card = document.querySelector(`.${styles.singleCard}`) as HTMLElement;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
    };

    return (
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <p className={styles.eyebrow}>Capabilities</p>
                        <h2 className={styles.title}>Custom Design Solutions</h2>
                    </div>
                    <div className={styles.headerRight}>
                        <p className={styles.description}>
                            For unique needs outside standard packages, I offer specialized design for a variety of applications.
                        </p>
                        <Link href="/contact" className={styles.cta}>
                            Let&rsquo;s scope it out
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </div>

                <div className={styles.singleCard} onMouseMove={handleMouseMove}>
                    <div className={styles.categoriesGrid}>
                        {categories.map((cat) => (
                            <div key={cat.label} className={styles.categoryColumn}>
                                <h3 className={styles.categoryTitle}>{cat.label}</h3>
                                <div className={styles.categoryDivider} />
                                <div className={styles.itemList}>
                                    {cat.items.map((item) => (
                                        <span key={item} className={styles.itemTag}>
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
