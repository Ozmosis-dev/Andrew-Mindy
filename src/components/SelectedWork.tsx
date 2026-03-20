"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import styles from "./SelectedWork.module.scss";
import { projects } from "../data/copy";
import MaskedTextReveal from "./MaskedTextReveal";
import InlineProjectGallery from "./InlineProjectGallery";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SelectedWork() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        const wrappers = containerRef.current?.querySelectorAll(`.${styles.projectWrapper}`);

        if (wrappers) {
            wrappers.forEach((wrapper) => {
                const elements = wrapper.querySelectorAll(`.${styles.animateUp}`);

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: wrapper,
                        start: "top 85%",
                        end: "bottom 15%",
                        toggleActions: "play reverse play reverse",
                    }
                });

                tl.fromTo(wrapper,
                    {
                        opacity: 0,
                        y: 80,
                        scale: 0.95,
                        filter: "blur(15px)"
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: "blur(0px)",
                        duration: 1.2,
                        ease: "power3.out"
                    }
                );

                if (elements.length > 0) {
                    tl.fromTo(elements,
                        { opacity: 0, y: 30 },
                        {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            stagger: 0.1,
                            ease: "power2.out"
                        },
                        "-=0.8"
                    );
                }
            });
        }
    }, { scope: sectionRef });

    return (
        <section className={styles.section} id="work" ref={sectionRef}>
            <div className={styles.header}>
                <MaskedTextReveal
                    text="SELECTED WORK"
                    tag="h2"
                    className={styles.title}
                    triggerPoint="top 80%"
                />
                <p className={styles.intro}>
                    Projects that drove measurable outcomes—from revenue operations to systems automation to full-stack product development.
                </p>
            </div>

            <div className={styles.container} ref={containerRef}>
                {projects.map((project, index) => (
                    <div className={styles.projectWrapper} key={project.slug} id={project.slug}>
                        <div
                            className={styles.projectRow}
                            style={{
                                '--project-accent': project.accent,
                                '--project-accent-rgb': project.accent.match(/\w\w/g)?.map(x => parseInt(x, 16)).join(', ') || '255, 255, 255'
                            } as React.CSSProperties}
                        >
                            <div className={styles.rowContent}>
                                <div className={styles.leftCol}>
                                    <div className={`${styles.index} ${styles.animateUp}`}>
                                        0{index + 1}
                                    </div>
                                    <h3 className={`${styles.projectTitle} ${styles.animateUp}`}>
                                        {project.title}
                                    </h3>

                                    <div className={`${styles.companyInfo} ${styles.animateUp}`}>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Client</span>
                                            <span className={styles.infoValue}>{project.client}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Industry</span>
                                            <span className={styles.infoValue}>{project.industry}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Timeline</span>
                                            <span className={styles.infoValue}>{project.timeline}</span>
                                        </div>
                                        <div className={styles.infoItem}>
                                            <span className={styles.infoLabel}>Role</span>
                                            <span className={styles.infoValue}>{project.role}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={styles.rightCol}>
                                    <div className={`${styles.resultsHighlight} ${styles.animateUp}`}>
                                        <span className={styles.resultsBadge}>Results Highlight</span>
                                        <p className={styles.description}>
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className={`${styles.metrics} ${styles.animateUp}`}>
                                        {project.metrics.map((metric, i) => (
                                            <div key={i} className={styles.metric}>
                                                <span className={styles.metricValue}>{metric.value}</span>
                                                <span className={styles.metricLabel}>{metric.label}</span>
                                            </div>
                                        ))}
                                    </div>


                                </div>
                            </div>

                            {/* Expandable Scroll Gallery inline within the card */}
                            {project.gallery && project.gallery.length > 0 && (
                                <InlineProjectGallery images={project.gallery} />
                            )}

                            <div className={styles.mediaBackground} />
                            <div className={styles.glowingBorder} />
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}
