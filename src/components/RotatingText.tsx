import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import styles from "./RotatingText.module.scss";

const words = ["brands", "websites", "systems", "apps", "experiences"];

export default function RotatingText() {
    const [index, setIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    // Parallax effect: starts at 0 and moves downward as we scroll
    const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
    // Scale effect: starts at 1 (normal size) and grows massive
    const scale = useTransform(scrollYProgress, [0, 0.1, 1], [1, 1, 6]);
    // Opacity: starts at 0.3 and fades in
    const opacity = useTransform(scrollYProgress, [0, 0.1, 0.3, 0.7, 1], [0.3, 1, 1, 1, 0]);

    const dynamicText = words[index];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % words.length);
        }, 4000); // Slower interval
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            ref={containerRef}
            className={styles.container}
            style={{ y, scale, opacity }}
        >
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
                                    {char}
                                </motion.span>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}
