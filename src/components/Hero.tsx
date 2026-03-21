"use client";
import { useRef } from "react";
import styles from "./Hero.module.scss";

import RotatingText from "./RotatingText";
import RotatingRing from "./RotatingRing";
import GravityParticles from "./GravityParticles";
import { TbEye, TbEyeClosed } from "react-icons/tb";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "./Marquee";
import { useTheme } from "../context/ThemeContext";
import DisintegratingText from "./DisintegratingText";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
    const containerRef = useRef<HTMLElement>(null);

    const { theme, toggleTheme } = useTheme();
    const eyeRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Scroll Animation
        if (containerRef.current) {
            gsap.to(containerRef.current, {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                    pin: false,
                },
                scale: 0.7,
                borderRadius: "100px",
                ease: "none",
                transformOrigin: "center top"
            });
        }

        // Eye Continuous Animation
        if (eyeRef.current) {
            gsap.to(eyeRef.current, {
                scale: 1.3,
                color: "#62afef",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        }
    }, { scope: containerRef });

    return (
        <section className={styles.hero} ref={containerRef}>
            <div className={styles.heroBackground}>
                <video
                    className={styles.videoBackground}
                    autoPlay
                    loop
                    muted
                    playsInline
                    data-pixel="true" // If using a pixelation library, otherwise just a standard attribute
                >
                    <source src="/videos/3d-animation.mp4" type="video/mp4" />
                </video>

                <GravityParticles
                    className={styles.particles}
                    particleCount={300}
                    particleSize={1.5}
                    particleOpacity={0.8}
                    mouseGravity="attract"
                    gravityStrength={100}
                    mouseInfluence={250}
                    visibilityRadius={600}
                    particleColor={theme === 'dark' ? "#ffffff" : "#000000"}
                    backgroundColor="transparent"
                    style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 1, pointerEvents: "none" }}
                />
            </div>

            <div className={styles.content}>

                <div className={styles.titleWrapper}>
                    <h1 className={styles.title}>
                        ANDREW<br />MINDY
                    </h1>
                    <div className={styles.ringContainer}>
                        <RotatingRing />
                    </div>
                </div>

                <div
                    className={styles.eyeContainer}
                    ref={eyeRef}
                    onClick={toggleTheme}
                    style={{ cursor: 'pointer', fontSize: '3rem' }}
                >
                    {theme === 'dark' ? <TbEye strokeWidth={1} /> : <TbEyeClosed strokeWidth={1} />}
                </div>

                {/* RotatingText might need color adjustment if it wasn't black */}
                <div className={styles.rotatingTextContainer}>
                    <DisintegratingText text="I DESIGN + BUILD" />
                    {/* Logic inside RotatingText needs to ensure text is black for this effect */}
                    <RotatingText />
                </div>



                <div className={styles.marqueeWrapper}>
                    <Marquee />
                </div>

            </div>
        </section>
    );
}
