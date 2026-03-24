
"use client";

import styles from './Marquee.module.scss';
import { motion, Variants } from 'framer-motion';

const marqueeVariants: Variants = {
    animate: {
        x: [0, -1000],
        transition: {
            x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
            },
        },
    },
};

interface MarqueeProps {
    text?: string;
    className?: string;
}

export default function Marquee({
    text = "ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + ",
    className = ""
}: MarqueeProps) {
    return (
        <div className={`${styles.marqueeContainer} ${className}`.trim()}>
            <motion.div
                className={styles.track}
                variants={marqueeVariants}
                animate="animate"
            >
                {[...Array(6)].map((_, i) => (
                    <span key={i} className={styles.text}>{text}</span>
                ))}
            </motion.div>
        </div>
    );
}
