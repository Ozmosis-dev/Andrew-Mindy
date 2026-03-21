"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
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
    { id: 8, title: "The Shepherds Tent", category: "Brand + Web Design + Print", image: "/images/am web portfolio/Artboard 8@1.25x.png", accent: "#779880" },
    { id: 2, title: "Hope State Roofing", category: "Brand + Web Design + Print", image: "/images/am web portfolio/Artboard 2@1.25x.png", accent: "#e53e3e" },
    { id: 10, title: "Dream Day Social", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 10@1.25x.png", accent: "#4374a2" },
    { id: 24, title: "Home Bar", category: "Web Design + Print", image: "/images/am web portfolio/Artboard 24@1.25x.png", accent: "#cd8b44" },
    { id: 21, title: "Pro Life Charleston", category: "Web Design", image: "/images/am web portfolio/Artboard 21@1.25x.png", accent: "#93cbbf" },
    { id: 12, title: "Jimmy W's", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 12@1.25x.png", accent: "#985c42" },
    { id: 1, title: "Kharis Aletheia", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 1@1.25x.png", accent: "#9b70c9" },
    { id: 7, title: "Wise Builders", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 7@1.25x.png", accent: "#2f5898" },
    { id: 3, title: "The Resting Place", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 3@1.25x.png", accent: "#f6ecd7" },
    { id: 4, title: "Douglicious Vegan", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 4@1.25x.png", accent: "#ffc05b" },
    { id: 5, title: "KAI", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 5@1.25x.png", accent: "#30add5" },
    { id: 6, title: "Hometrust", category: "Brand + Web Design + Print", image: "/images/am web portfolio/Artboard 6@1.25x.png", accent: "#e97750" },
    { id: 9, title: "Tee Box Social", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 9@1.25x.png", accent: "#3d5443" },
    { id: 23, title: "Jasmine Marie", category: "Web Design", image: "/images/am web portfolio/Artboard 23@1.25x.png", accent: "#c4907c" },
    { id: 14, title: "Georgia Home Roofing", category: "Brand + Web Design + Print", image: "/images/am web portfolio/Artboard 14@1.25x.png", accent: "#fc963b" },
    { id: 16, title: "Cell Phone Repair", category: "Web Design", image: "/images/am web portfolio/Artboard 16@1.25x.png", accent: "#d6554d" },
    { id: 15, title: "Food Trucks South", category: "Web Design", image: "/images/am web portfolio/Artboard 15@1.25x.png", accent: "#ef4444" },
    { id: 17, title: "Gulf Coast Auctions", category: "Web Design", image: "/images/am web portfolio/Artboard 17@1.25x.png", accent: "#1b74a9" },
    { id: 18, title: "Little Rabbit Bakeshop", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 18@1.25x.png", accent: "#9ea9dd" },
    { id: 19, title: "Home Church", category: "Web Design", image: "/images/am web portfolio/Artboard 19@1.25x.png", accent: "#cca029" },
    { id: 20, title: "Request a Driver", category: "Web Design + Web App", image: "/images/am web portfolio/Artboard 20@1.25x.png", accent: "#c93934" },
    { id: 22, title: "Samaritan Roofing", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 22@1.25x.png", accent: "#7852a3" },
    { id: 13, title: "Joe L Barnes", category: "Brand + Web Design + Print", image: "/images/am web portfolio/Artboard 13@1.25x.png", accent: "#eed9a0" },
    { id: 11, title: "Tech 4 Underdogs", category: "Brand + Web Design", image: "/images/am web portfolio/Artboard 11@1.25x.png", accent: "#0a6987" },
];

type Project = typeof projects[number];

export default function DesignGallery() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [hasExpanded, setHasExpanded] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const mouseXSpring = useSpring(mouseX, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(mouseY, { stiffness: 300, damping: 30 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const xPos = e.clientX - rect.left;
        const yPos = e.clientY - rect.top;
        const xPct = xPos / width - 0.5;
        const yPct = yPos / height - 0.5;
        mouseX.set(xPct);
        mouseY.set(yPct);
    };

    const handleMouseLeave = () => {
        mouseX.set(0);
        mouseY.set(0);
    };

    useEffect(() => {
        // Refresh GSAP ScrollTriggers when the height of the gallery changes
        // so that the sections below it are correctly positioned.
        const timeout = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 850); // wait for the layout animation to finish

        // Also refresh immediately for the instantaneous DOM height change
        ScrollTrigger.refresh();

        return () => clearTimeout(timeout);
    }, [isCollapsed]);

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

            <div className={styles.container} ref={sectionRef}>
                <motion.div
                    className={isCollapsed ? styles.collapsedContainer : styles.grid}
                    transition={{ staggerChildren: 0.05, delayChildren: 0.1 }}
                >
                    {projects.map((project, i) => {
                        // Calculate fan out angle (-60 to 60 degrees spread)
                        const angleRange = 120;
                        const startAngle = -angleRange / 2;
                        const angleStep = angleRange / (projects.length - 1);
                        const angle = startAngle + i * angleStep;

                        // Calculate visual stacking: middle cards are higher z-index if desired, 
                        // or just use typical indexing.
                        const zIndex = i;

                        return (
                            <motion.div
                                layout
                                key={project.id}
                                className={`${styles.item} ${isCollapsed ? styles.itemCollapsed : styles[`g${i + 1}`]}`}
                                style={{
                                    "--item-accent": project.accent,
                                    zIndex
                                } as React.CSSProperties}
                                onClick={() => !isCollapsed && setSelectedProject(project)}
                                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                                whileInView={{
                                    opacity: 1,
                                    scale: 1,
                                    y: 0,
                                }}
                                viewport={{ once: true, margin: "-100px" }}
                                animate={{
                                    rotate: isCollapsed ? angle : 0,
                                    y: isCollapsed ? Math.abs(angle) * 0.5 : 0, // slight drop for outer cards
                                }}
                                transition={{
                                    layout: { type: "spring", bounce: 0.2, duration: 0.8 },
                                    opacity: { duration: 0.4, delay: i * 0.03 },
                                    scale: { duration: 0.4, delay: i * 0.03 },
                                    rotate: { type: "spring", bounce: 0.2, duration: 0.8 },
                                    y: { type: "spring", bounce: 0.2, duration: 0.8 }
                                }}
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
                            </motion.div>
                        );
                    })}

                    <AnimatePresence>
                        {isCollapsed && hasExpanded && (
                            <motion.div
                                className={`${styles.item} ${styles.itemCollapsed} ${styles.ctaCard}`}
                                style={{
                                    zIndex: 100,
                                    rotateX,
                                    rotateY,
                                    transformStyle: "preserve-3d"
                                }}
                                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{ scale: 1.02 }}
                                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                                transition={{ duration: 0.4 }}
                                onClick={() => { window.location.href = '/contact'; }}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <div
                                    className={styles.ctaCardContent}
                                    style={{ transform: "translateZ(40px)" }}
                                >
                                    <h3>READY?</h3>
                                    <p>Let's build your<br />vision next</p>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                        <polyline points="12 5 19 12 12 19"></polyline>
                                    </svg>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                <div className={styles.expandButtonContainer}>
                    <button
                        className={`${styles.expandButton} ${!isCollapsed ? styles.rotated : ""}`}
                        onClick={() => {
                            if (isCollapsed) setHasExpanded(true);
                            setIsCollapsed(!isCollapsed);
                        }}
                        aria-label={isCollapsed ? "Expand Gallery" : "Collapse Gallery"}
                        title={isCollapsed ? "Expand Gallery" : "Collapse Gallery"}
                    >
                        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        className={styles.lightbox}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                    >
                        <motion.div
                            className={styles.lightboxContent}
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                className={styles.closeButton}
                                onClick={() => setSelectedProject(null)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>

                            <div className={styles.lightboxImageWrapper}>
                                <Image
                                    src={selectedProject.image}
                                    alt={selectedProject.title}
                                    width={1400}
                                    height={800}
                                    className={styles.lightboxImage}
                                    priority
                                />
                            </div>

                            <div className={styles.lightboxInfo}>
                                <span className={styles.lightboxCat} style={{ color: selectedProject.accent }}>
                                    {selectedProject.category}
                                </span>
                                <h3 className={styles.lightboxTitle}>{selectedProject.title}</h3>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
