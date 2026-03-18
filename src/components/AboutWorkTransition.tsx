"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AboutSection from "./AboutSection";
import HowIWorkSection from "./HowIWorkSection";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function AboutWorkTransition() {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const aboutRef = useRef<HTMLDivElement>(null);
    const workRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!wrapperRef.current || !aboutRef.current || !workRef.current) return;

        // Create a horizontal scroll transition
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapperRef.current,
                start: "top top",
                end: "+=100%", // The amount of scroll distance for the horizontal wipe (1 viewport height)
                pin: true,
                scrub: true,
                // markers: true, // For debugging if needed
            }
        });

        // About section slides left
        tl.to(aboutRef.current, {
            xPercent: -100,
            ease: "none",
        }, 0);

        // How I work section slides in from the right
        tl.to(workRef.current, {
            xPercent: -100,
            ease: "none",
        }, 0);

    }, { scope: wrapperRef });

    return (
        <div ref={wrapperRef} style={{ position: "relative", width: "100%", overflow: "hidden" }}>
            <div ref={aboutRef} style={{ position: "relative", width: "100vw", zIndex: 1, backgroundColor: "var(--background)" }}>
                <AboutSection />
            </div>

            <div ref={workRef} style={{ position: "absolute", top: 0, left: "100vw", width: "100vw", zIndex: 2, backgroundColor: "var(--background)" }}>
                <HowIWorkSection />
            </div>

            {/* 
              By leaving the workRef as absolute, the wrapper would have height 0 if aboutRef is absolute.
              Wait! If workRef is taller (HowIWork is ~250vh) and aboutRef is ~100vh, we need the wrapper to reflect workRef's height 
              so that after the pin, we can scroll down through HowIWorkSection!
            */}
        </div>
    );
}
