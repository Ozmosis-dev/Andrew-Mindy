"use client";

import {
    motion,
    useScroll,
    useTransform,
    useSpring,
    useMotionValue,
    useInView,
    animate,
    Variants,
} from "framer-motion";
import styles from "./ImpactSection.module.scss";
import MaskedTextReveal from "./MaskedTextReveal";
import ScrollSequence from "./ScrollSequence";
import { useRef, useEffect, useState, useCallback } from "react";
import { FiTrendingUp, FiTarget, FiShield, FiClock } from "react-icons/fi";

// ─── Animation Variants ──────────────────────────────

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};

const wrapperVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
        },
    },
};

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
        },
    },
};

const cardVariants: Variants = {
    hidden: {
        y: 60,
        opacity: 0,
        scale: 0.92,
        filter: "blur(8px)",
    },
    visible: (i: number) => ({
        y: 0,
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.9,
            delay: i * 0.15,
            ease: [0.22, 1, 0.36, 1],
        },
    }),
};

// ─── Stats Data ──────────────────────────────────────

interface StatData {
    prefix: string;
    fromValue: number;
    toValue: number;
    suffix: string;
    fromLabel?: string;  // e.g. "$3M" for the "from" part
    label: string;
    icon: React.ElementType;
}

const statsData: StatData[] = [
    { prefix: "$", fromValue: 3, toValue: 20, suffix: "M", fromLabel: "$3M", label: "Revenue Growth", icon: FiTrendingUp },
    { prefix: "", fromValue: 35, toValue: 52, suffix: "%", fromLabel: "35%", label: "Close Rate", icon: FiTarget },
    { prefix: "$", fromValue: 0, toValue: 73, suffix: "K+", fromLabel: "", label: "Annual Savings", icon: FiShield },
    { prefix: "", fromValue: 0, toValue: 1000, suffix: "+", fromLabel: "", label: "Hours Reclaimed", icon: FiClock },
];

// ─── Animated Counter Component ──────────────────────

function AnimatedCounter({
    from,
    to,
    prefix,
    suffix,
    fromLabel,
    inView,
}: {
    from: number;
    to: number;
    prefix: string;
    suffix: string;
    fromLabel?: string;
    inView: boolean;
}) {
    const motionValue = useMotionValue(from);
    const [displayValue, setDisplayValue] = useState(from);

    useEffect(() => {
        if (!inView) return;

        const controls = animate(motionValue, to, {
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
            onUpdate: (latest) => {
                setDisplayValue(Math.round(latest));
            },
        });

        return () => controls.stop();
    }, [inView, motionValue, to]);

    const formattedValue = to >= 1000
        ? displayValue.toLocaleString()
        : displayValue.toString();

    return (
        <span className={styles.statValue}>
            {fromLabel && (
                <>
                    {fromLabel}
                    <span className={styles.arrow}> → </span>
                </>
            )}
            {prefix}{formattedValue}{suffix}
        </span>
    );
}

// ─── Stat Card Component ─────────────────────────────

function StatCard({
    stat,
    index,
    inView,
}: {
    stat: StatData;
    index: number;
    inView: boolean;
}) {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mouse-x", `${x}%`);
        card.style.setProperty("--mouse-y", `${y}%`);
    }, []);

    return (
        <motion.div
            ref={cardRef}
            className={styles.statCard}
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            whileHover={{
                y: -8,
                scale: 1.03,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
            }}
            onMouseMove={handleMouseMove}
        >
            <AnimatedCounter
                from={stat.fromValue}
                to={stat.toValue}
                prefix={stat.prefix}
                suffix={stat.suffix}
                fromLabel={stat.fromLabel}
                inView={inView}
            />
            <div className={styles.labelContainer}>
                <stat.icon className={styles.icon} />
                <span className={styles.statLabel}>{stat.label}</span>
            </div>
            <span className={styles.cardLine} />
        </motion.div>
    );
}

// ─── Main Component ──────────────────────────────────

export default function ImpactSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const gridRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(gridRef, { once: true, margin: "-15%" });

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    });

    // Smooth scroll progress
    const smoothProgress = useSpring(scrollYProgress, {
        damping: 20,
        mass: 0.2,
        stiffness: 100,
        restDelta: 0.001,
    });

    // ScrollSequence animation progress
    const animationProgress = useTransform(smoothProgress, [0.15, 0.65], [0, 1]);

    // Parallax for the scroll‑sequence background
    const parallaxScale = useTransform(smoothProgress, [0, 1], [0.35, 1.5]);

    // Subtle parallax for the stats grid itself
    const gridY = useTransform(smoothProgress, [0.3, 0.8], [40, -20]);
    const smoothGridY = useSpring(gridY, { damping: 30, stiffness: 120 });

    return (
        <section ref={sectionRef} className={styles.section}>
            <ScrollSequence progress={animationProgress} scale={parallaxScale} />
            <motion.div
                className={styles.container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={containerVariants}
            >
                <motion.div className={styles.contentWrapper} variants={wrapperVariants}>
                    <MaskedTextReveal
                        text="BRAND. STRATEGY. SYSTEMS."
                        className={styles.headline}
                        tag="h2"
                        triggerPoint="top 60%"
                    />

                    <motion.p className={styles.subtext} variants={itemVariants}>
                        Three disciplines most companies hire three people to cover. I bring all of
                        them — from brand positioning and creative direction through revenue
                        operations and custom automation. One engagement. End-to-end ownership.
                    </motion.p>
                </motion.div>

                <motion.div
                    ref={gridRef}
                    className={styles.statsGrid}
                    style={{ y: smoothGridY }}
                >
                    {statsData.map((stat, index) => (
                        <StatCard
                            key={index}
                            stat={stat}
                            index={index}
                            inView={isInView}
                        />
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
