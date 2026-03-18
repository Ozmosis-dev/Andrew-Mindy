"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IoCloseOutline } from "react-icons/io5";
import styles from "./CtaPopup.module.scss";

interface CtaPopupProps {
    onClose: () => void;
}

export default function CtaPopup({ onClose }: CtaPopupProps) {
    const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

    // Handle escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        // Lock body scroll
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "unset";
        };
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        // Simulate submission
        setTimeout(() => {
            setStatus("success");
        }, 1500);
    };

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ y: "100%", opacity: 0, scale: 0.95 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: "100%", opacity: 0, scale: 0.95 }}
                transition={{
                    type: "spring",
                    damping: 25,
                    stiffness: 200,
                    mass: 1
                }}
                onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
            >
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    aria-label="Close"
                >
                    <IoCloseOutline size={28} />
                </button>

                {/* Left Side: Form */}
                <div className={styles.formCol}>
                    {status === "success" ? (
                        <motion.div
                            className={styles.successState}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h3>Message Sent</h3>
                            <p>Thanks for reaching out! I'll get back to you shortly.</p>
                            <button
                                className={styles.submitBtn}
                                onClick={() => {
                                    setStatus("idle");
                                    onClose();
                                }}
                            >
                                <span className={styles.btnContent}>Close Window</span>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <span className={styles.eyebrow}>Let's Connect</span>
                            <h2 className={styles.headline}>Ready to Build Something?</h2>
                            <p className={styles.subtext}>
                                Fill out the form below or email me directly at contact@andrewmindy.com.
                                I'm excited to hear about your project.
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className={styles.inputGroup}>
                                    <label htmlFor="name">Name</label>
                                    <input type="text" id="name" required placeholder="John Doe" />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input type="email" id="email" required placeholder="john@example.com" />
                                </div>

                                <div className={styles.inputGroup}>
                                    <label htmlFor="message">Message</label>
                                    <textarea id="message" required placeholder="Tell me about your vision..."></textarea>
                                </div>

                                <button type="submit" className={styles.submitBtn} disabled={status === "submitting"}>
                                    <span className={styles.btnContent}>
                                        {status === "submitting" ? "Sending..." : "Send Message"}
                                    </span>
                                    <span className={styles.btnIcon}>→</span>
                                </button>
                            </form>
                        </motion.div>
                    )}
                </div>

                {/* Right Side: Animated Graphic */}
                <div className={styles.graphicCol} aria-hidden="true">
                    <div className={styles.blobContainer}>
                        <motion.div
                            className={styles.blob1}
                            animate={{
                                x: [0, 50, -50, 0],
                                y: [0, -50, 50, 0],
                                scale: [1, 1.1, 0.9, 1]
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.div
                            className={styles.blob2}
                            animate={{
                                x: [0, -70, 70, 0],
                                y: [0, 70, -70, 0],
                                scale: [1, 0.9, 1.2, 1]
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear", delay: 2 }}
                        />
                        <motion.div
                            className={styles.blob3}
                            animate={{
                                x: [0, 80, -60, 0],
                                y: [0, 90, -40, 0],
                                scale: [1, 1.2, 0.8, 1]
                            }}
                            transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 5 }}
                        />
                    </div>

                    <div className={styles.noiseOverlay} />

                    <motion.div
                        className={styles.glassCard}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <div className={styles.glassLine} />
                        <div className={styles.glassLine} />
                        <div className={styles.glassLine} />
                        <div className={styles.glassLine} />
                    </motion.div>
                </div>
            </motion.div>
        </motion.div>
    );
}
