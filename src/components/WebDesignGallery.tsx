"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import Link from "next/link";
import styles from "./WebDesignGallery.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const designProjects = [
    { id: 1, title: "Hometrust", category: "Brand + Web Design", image: "/images/HomeTrust-1024x576.png", accent: "#E16922" },
    { id: 2, title: "Hope State Roofing", category: "Brand + Web Design", image: "/images/Hope-State-1024x576.png", accent: "#c0392b" },
    { id: 3, title: "Doughlicious Vegan", category: "Brand + Web Design", image: "/images/Doughlicious-Vegan-1024x576.png", accent: "#f5c842" },
    { id: 4, title: "KAI", category: "Brand + Web Design", image: "/images/Kai-1-1024x576.png", accent: "#87CEEB" },
    { id: 5, title: "Kharis", category: "Brand + Web Design", image: "/images/Kharis-1-1024x576.png", accent: "#9b59b6" },
    { id: 6, title: "The Resting Place", category: "Brand + Web Design", image: "/images/Resting-Place-1-1024x576.png", accent: "#C9B99A" },
    { id: 7, title: "TST", category: "Brand + Web Design", image: "/images/TST-1-1024x576.png", accent: "#2ecc71" },
    { id: 8, title: "Wise Builders", category: "Brand + Web Design", image: "/images/Wise-1-1024x576.png", accent: "#3498db" },
];

export default function WebDesignGallery() {
    const sectionRef = useRef<HTMLElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const autoScrollRef = useRef<gsap.core.Tween | null>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    // Auto-scroll animation
    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const totalWidth = track.scrollWidth / 2;

        autoScrollRef.current = gsap.to(track, {
            x: `-=${totalWidth}`,
            duration: 40,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth),
            },
        });

        return () => {
            autoScrollRef.current?.kill();
        };
    }, []);

    // Pause/resume on hover
    const handleMouseEnter = () => autoScrollRef.current?.pause();
    const handleMouseLeave = () => {
        if (!isDragging.current) autoScrollRef.current?.resume();
    };

    // Drag to scroll
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        startX.current = e.pageX;
        const currentX = gsap.getProperty(trackRef.current, "x") as number;
        scrollLeft.current = currentX;
        autoScrollRef.current?.pause();
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const walk = (e.pageX - startX.current) * 1.5;
        gsap.set(trackRef.current, { x: scrollLeft.current + walk });
    };

    const handleMouseUp = () => {
        isDragging.current = false;
        autoScrollRef.current?.resume();
    };

    // Section reveal
    useGSAP(() => {
        const heading = sectionRef.current?.querySelector(`.${styles.heading}`);
        const subtext = sectionRef.current?.querySelector(`.${styles.subtext}`);
        const cta = sectionRef.current?.querySelector(`.${styles.cta}`);

        // Set initial hidden state via GSAP (not CSS) so there's no conflict
        gsap.set([heading, subtext, cta], { opacity: 0 });
        gsap.set(heading, { y: 50, filter: "blur(12px)" });
        gsap.set(subtext, { y: 50, filter: "blur(12px)" });
        gsap.set(cta, { y: 20 });

        gsap.to([heading, subtext], {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.1,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });

        gsap.to(cta, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.3,
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
            },
        });
    }, { scope: sectionRef });

    // Duplicate items for seamless loop
    const allItems = [...designProjects, ...designProjects];

    return (
        <section className={styles.section} ref={sectionRef}>
            <div className={styles.header}>
                <div className={styles.labelRow}>
                    <span className={styles.pill}>Design Work</span>
                </div>
                <div className={styles.headingRow}>
                    <h2 className={styles.heading}>WEB DESIGN</h2>
                    <Link href="/design" className={styles.cta}>
                        <span className={styles.ctaText}>View All Design Work</span>
                        <span className={styles.ctaIcon}>
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </span>
                    </Link>
                </div>
                <p className={styles.subtext}>
                    Crafting digital experiences that are as functional as they are beautiful.
                </p>
            </div>

            <div
                className={styles.galleryViewport}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <div className={styles.track} ref={trackRef}>
                    {allItems.map((project, index) => (
                        <div
                            key={`${project.id}-${index}`}
                            className={styles.card}
                            style={{ "--card-accent": project.accent } as React.CSSProperties}
                        >
                            <div className={styles.cardInner}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={project.image}
                                        alt={project.title}
                                        width={1024}
                                        height={576}
                                        className={styles.image}
                                        draggable={false}
                                    />
                                    <div className={styles.imageOverlay} />
                                </div>
                                <div className={styles.cardInfo}>
                                    <span className={styles.cardCategory}>{project.category}</span>
                                    <h3 className={styles.cardTitle}>{project.title}</h3>
                                    <div className={styles.cardAccentLine} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Edge fade masks */}
                <div className={styles.fadeLeft} />
                <div className={styles.fadeRight} />
            </div>

        </section>
    );
}
