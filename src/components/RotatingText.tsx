import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, useScroll, useTransform, MotionValue } from "framer-motion";
import styles from "./RotatingText.module.scss";

const words = ["brands", "websites", "systems", "apps", "experiences"];

const DisintegrationChar = ({ char, progress, index }: { char: string; progress: MotionValue<number>; index: number }) => {
    const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const { randomX, randomY, randomRotate } = useMemo(() => {
        return {
            randomX: (pseudoRandom(index * 1) - 0.5) * 600,
            randomY: (pseudoRandom(index * 2) - 1) * 400 - 50,
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
            style={{ x, y, rotate, opacity, scale, display: "inline-block" }}
        >
            {char}
        </motion.span>
    );
};

export default function RotatingText() {
    const [index, setIndex] = useState(0);

    const { scrollY } = useScroll();
    const progress = useTransform(scrollY, [0, 1200], [0, 1]);

    const dynamicText = words[index];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={styles.container}>
            <motion.div
                className={styles.wrapper}
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 1, 0, -1, 0]
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                {/* Ghost text for layout stability based on longest word */}
                <span className={styles.ghost}>experiences</span>

                <div className={styles.wordContainer}>
                    <AnimatePresence mode="popLayout" initial={false}>
                        <motion.div
                            key={index}
                            className={styles.line}
                        >
                            {dynamicText.split("").map((char, i) => (
                                <motion.span
                                    key={`${index}-${i}`}
                                    initial={{ y: "100%", opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: "-100%", opacity: 0 }}
                                    transition={{
                                        duration: 0.9,
                                        ease: [0.16, 1, 0.3, 1],
                                        delay: i * 0.02,
                                    }}
                                    className={styles.char}
                                >
                                    <DisintegrationChar char={char} progress={progress} index={i} />
                                </motion.span>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
