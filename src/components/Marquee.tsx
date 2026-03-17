
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

export default function Marquee() {
    return (
        <div className={styles.marqueeContainer}>
            <motion.div
                className={styles.track}
                variants={marqueeVariants}
                animate="animate"
            >
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
                <span className={styles.text}>ARTIST + DESIGNER + BUILDER + SYSTEMS THINKER + </span>
            </motion.div>
        </div>
    );
}
