"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import MaskedTextReveal from "./MaskedTextReveal";
import styles from "./DesignGallery.module.scss";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

const projects = [
    { id: 1, title: "Hometrust", category: "Brand + Web Design", image: "/images/HomeTrust-1024x576.png", accent: "#62AFEF" },
    { id: 2, title: "Hope State Roofing", category: "Brand + Web Design", image: "/images/Hope-State-1024x576.png", accent: "#c0392b" },
    { id: 3, title: "Doughlicious Vegan", category: "Brand + Web Design", image: "/images/Doughlicious-Vegan-1024x576.png", accent: "#f5c842" },
    { id: 4, title: "KAI", category: "Brand + Web Design", image: "/images/Kai-1-1024x576.png", accent: "#87CEEB" },
    { id: 5, title: "Kharis", category: "Brand + Web Design", image: "/images/Kharis-1-1024x576.png", accent: "#9b59b6" },
    { id: 6, title: "The Resting Place", category: "Brand + Web Design", image: "/images/Resting-Place-1-1024x576.png", accent: "#C9B99A" },
    { id: 7, title: "TST", category: "Brand + Web Design", image: "/images/TST-1-1024x576.png", accent: "#2ecc71" },
    { id: 8, title: "Wise Builders", category: "Brand + Web Design", image: "/images/Wise-1-1024x576.png", accent: "#3498db" },
];

export default function DesignGallery() {
    const sectionRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const items = sectionRef.current?.querySelectorAll(`.${styles.item}`);
        if (!items) return;

        items.forEach((item, i) => {
            gsap.fromTo(
                item,
                { opacity: 0, scale: 0.97, filter: "blur(6px)" },
                {
                    opacity: 1,
                    scale: 1,
                    filter: "blur(0px)",
                    duration: 0.85,
                    ease: "power3.out",
                    delay: i * 0.06,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, { scope: sectionRef });

    return (
        <section className={styles.section} id="work">
            <div className={styles.header}>
                <span className={styles.eyebrow}>Gallery of Work</span>
                <MaskedTextReveal
                    text="GALLERY OF WORK"
                    tag="h2"
                    className={styles.title}
                    triggerPoint="top 85%"
                />
                <p className={styles.intro}>
                    A selection of brands and websites built from strategy. Every project
                    starts with positioning and ends with a system that works.
                </p>
            </div>

            <div className={styles.grid} ref={sectionRef}>
                {projects.map((project, i) => (
                    <div
                        key={project.id}
                        className={`${styles.item} ${styles[`g${i + 1}`]}`}
                        style={{ "--item-accent": project.accent } as React.CSSProperties}
                    >
                        <Image
                            src={project.image}
                            alt={project.title}
                            width={1024}
                            height={576}
                            className={styles.image}
                        />
                        <div className={styles.overlay}>
                            <span className={styles.cat}>{project.category}</span>
                            <h3 className={styles.name}>{project.title}</h3>
                            <div className={styles.accentLine} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
