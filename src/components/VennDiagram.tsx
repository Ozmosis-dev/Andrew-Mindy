"use client";

import { motion, MotionValue, useTransform } from "framer-motion";
import styles from "./VennDiagram.module.scss";

interface VennDiagramProps {
    progress: MotionValue<number>;
    scale: MotionValue<number>;
}

export default function VennDiagram({ progress, scale }: VennDiagramProps) {
    // Start animating earlier
    const drawLine = useTransform(progress, [0, 0.9], [0, 1]);
    const fillGlow = useTransform(progress, [0.6, 1], [0, 1]);

    // Opacity fades in as they combine
    const opacity = useTransform(progress, [0, 0.2], [0, 1]);

    // Use motion groups to animate translation, keeping circles pristine for rotation
    const topY = useTransform(progress, [0, 1], [-300, -100]);

    // Bottom Left
    const blX = useTransform(progress, [0, 1], [-259.8, -86.6]);
    const blY = useTransform(progress, [0, 1], [150, 50]);

    // Bottom Right
    const brX = useTransform(progress, [0, 1], [259.8, 86.6]);
    const brY = useTransform(progress, [0, 1], [150, 50]);

    return (
        <motion.div className={styles.container} style={{ opacity }}>
            <div className={styles.svgWrapper}>
                <svg viewBox="-500 -500 1000 1000" className={styles.svg}>
                    {/* Brand Circle (Top) */}
                    <motion.g style={{ y: topY }}>
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={260}
                            className={styles.circle}
                            style={{ pathLength: drawLine, fillOpacity: fillGlow }}
                            strokeLinecap="round"
                            transform="rotate(90)"
                        />
                    </motion.g>

                    {/* Strategy Circle (Bottom Left) */}
                    <motion.g style={{ x: blX, y: blY }}>
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={260}
                            className={styles.circle}
                            style={{ pathLength: drawLine, fillOpacity: fillGlow }}
                            strokeLinecap="round"
                            transform="rotate(-30)"
                        />
                    </motion.g>

                    {/* Systems Circle (Bottom Right) */}
                    <motion.g style={{ x: brX, y: brY }}>
                        <motion.circle
                            cx={0}
                            cy={0}
                            r={260}
                            className={styles.circle}
                            style={{ pathLength: drawLine, fillOpacity: fillGlow }}
                            strokeLinecap="round"
                            transform="rotate(-150)"
                        />
                    </motion.g>
                </svg>
            </div>
        </motion.div>
    );
}

