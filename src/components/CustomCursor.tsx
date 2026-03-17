"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./CustomCursor.module.scss";

import { useTheme } from "../context/ThemeContext";

export default function CustomCursor() {
    const cursorRef = useRef<HTMLDivElement>(null);
    const spotlightRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const { theme } = useTheme();

    useEffect(() => {
        // Initial hide - ensure they are centered on the mouse position by default (or hidden until first move)
        gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });
        gsap.set(spotlightRef.current, { xPercent: -50, yPercent: -50, opacity: 0 });

        const moveCursor = (e: MouseEvent) => {
            // Reveal on first move
            gsap.to([cursorRef.current, spotlightRef.current], { opacity: 1, duration: 0.2 });

            // Main cursor moves instantly
            gsap.to(cursorRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                ease: "power2.out",
            });

            // Spotlight moves with more lag
            gsap.to(spotlightRef.current, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], .interactive, p, h1, h2, h3, h4, h5, h6, span');
            setIsHovering(!!isInteractive);
        };

        window.addEventListener("mousemove", moveCursor);
        window.addEventListener("mouseover", handleMouseOver);

        return () => {
            window.removeEventListener("mousemove", moveCursor);
            window.removeEventListener("mouseover", handleMouseOver);
        };
    }, []);

    useEffect(() => {
        if (isHovering) {
            const hoverColor = theme === 'dark' ? '#ffffff' : '#000000';

            gsap.to(cursorRef.current, {
                scale: 0.5,
                backgroundColor: hoverColor,
                duration: 0.3,
                ease: "power2.out"
            });

            // Glass Bubble Effect on Hover
            gsap.to(spotlightRef.current, {
                scale: 2,
                opacity: 1, // keep visible but softer
                duration: 0.3,
                ease: "power2.out",
                border: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}`,
                backgroundColor: theme === 'dark' ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.03)",
                boxShadow: `inset 0 0 15px 2px rgba(255, 255, 255, 0.15), 0 0 20px 5px ${theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}`
            });
        } else {
            gsap.to(cursorRef.current, {
                scale: 1,
                backgroundColor: "#62afef",
                duration: 0.3,
                ease: "power2.out"
            });

            // Glass Bubble Effect Default
            gsap.to(spotlightRef.current, {
                scale: 1,
                opacity: 0.8,
                duration: 0.3,
                ease: "power2.out",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                boxShadow: "inset 0 0 10px 1px rgba(255, 255, 255, 0.2), 0 0 15px 3px rgba(98, 175, 239, 0.15)"
            });
        }
    }, [isHovering, theme]);

    return (
        <div className={styles.cursorWrapper}>
            <div ref={spotlightRef} className={styles.spotlight} />
            <div ref={cursorRef} className={styles.cursor} />
        </div>
    );
}
