"use client";
import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import styles from "./DisintegratingText.module.scss";

interface DisintegratingTextProps {
    text: string;
}

const DisintegrationChar = ({ char, progress, index }: { char: string; progress: MotionValue<number>; index: number }) => {
    // Generate deterministic random values based on index so it's pure
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const { randomX, randomY, randomRotate } = useMemo(() => {
        return {
            randomX: (pseudoRandom(index * 1) - 0.5) * 600, // Scatter X
            randomY: (pseudoRandom(index * 2) - 1) * 400 - 50, // Scatter Y (mostly up/down)
            randomRotate: (pseudoRandom(index * 3) - 0.5) * 360,
        };
    }, [index]);

    const x = useTransform(progress, [0, 1], [0, randomX]);
    const y = useTransform(progress, [0, 1], [0, randomY]);
    const rotate = useTransform(progress, [0, 1], [0, randomRotate]);
    const opacity = useTransform(progress, [0, 0.8], [1, 0]);
    const scale = useTransform(progress, [0, 1], [1, 0]);

    return (
        <motion.span
            className={styles.char}
            style={{ x, y, rotate, opacity, scale }}
        >
            {char}
        </motion.span>
    );
};

export default function DisintegratingText({ text }: DisintegratingTextProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"], // Start disintegrating as soon as we scroll
    });

    // We want the effect to happen over a scroll range. 
    // Since this is in the Hero, let's tie it to the main window scroll or the container's position.
    // The Hero is 100vh. We want it to be gone by the time we scroll 50% down?

    // Let's rely on the parent or use documented scroll tracking.
    // Actually, simply using scrollYProgress of the container might be tricky if the container is small.
    // Let's try global scroll for a hero effect.

    const { scrollY } = useScroll();
    // Map 0 to 500px scroll to 0 to 1 progress manually for better control
    const progress = useTransform(scrollY, [0, 1200], [0, 1]);

    return (
        <div className={styles.container} ref={containerRef}>
            {text.split("").map((char, i) => (
                <DisintegrationChar key={i} char={char} progress={progress} index={i} />
            ))}
        </div>
    );
}
