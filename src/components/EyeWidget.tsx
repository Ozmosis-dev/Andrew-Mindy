
"use client";

import { motion } from "framer-motion";
import styles from "./EyeWidget.module.scss";

export default function EyeWidget() {
    return (
        <div className={styles.container}>
            {/* Rotating Circular Text */}
            <motion.div
                className={styles.rotatingText}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
                <svg viewBox="0 0 100 100" width="100" height="100">
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

            {/* Center Eye Icon */}
            <div className={styles.eye}>
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#FFA500" fill="none" />
                    <circle cx="12" cy="12" r="3" fill="#FFA500" />
                </svg>
            </div>
        </div>
    );
}
