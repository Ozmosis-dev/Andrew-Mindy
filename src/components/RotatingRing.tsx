
"use client";

import { motion } from "framer-motion";
import styles from "./RotatingRing.module.scss";

export default function RotatingRing() {
    return (
        <div className={styles.container}>
            <motion.div
                className={styles.rotatingText}
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <path
                        id="curve"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="transparent"
                    />
                    <text className={styles.textCircle}>
                        <textPath xlinkHref="#curve" startOffset="0%">
                            ALWAYS EXPLORING
                        </textPath>
                    </text>
                </svg>
            </motion.div>
        </div>
    );
}
