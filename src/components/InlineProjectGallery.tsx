"use client";

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './InlineProjectGallery.module.scss';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

interface ImageType {
    url: string;
    alt: string;
}

interface InlineProjectGalleryProps {
    images: ImageType[];
}

export default function InlineProjectGallery({ images }: InlineProjectGalleryProps) {
    const galleryRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!galleryRef.current || !containerRef.current) return;

        const imageCards = gsap.utils.toArray(galleryRef.current.querySelectorAll(`.${styles.imageWrapper}`));

        // Create an expanding container effect and rapid image entrance
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 85%", // Trigger slightly earlier
                end: "bottom 20%",
                toggleActions: "play reverse play reverse", // Remove scrub for faster, timeline-based playback
            }
        });

        // 1. Expand the container itself from 0 height or scale
        // 1. Expand the container itself from 0 height or scale
        tl.fromTo(galleryRef.current,
            { height: 0, opacity: 0, overflow: 'hidden' },
            { height: 'auto', opacity: 1, duration: 1.2, ease: 'power3.inOut' }
        );

        // 2. Parallax/fade effect on the images, happening rapidly
        tl.fromTo(imageCards,
            { y: 60, opacity: 0, scale: 0.95, filter: 'blur(10px)' },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                filter: 'blur(0px)',
                stagger: 0.1, // Slower stagger
                duration: 0.8, // Slower duration
                ease: 'power2.out'
            },
            "-=0.6" // Start overlap with container expansion
        );

    }, { scope: galleryRef });

    if (!images || images.length === 0) return null;

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.galleryGrid} ref={galleryRef}>
                <div className={styles.galleryTrack}>
                    {[...images, ...images].map((image, i) => {
                        const originalIndex = i % images.length;
                        return (
                            <div
                                key={i}
                                className={styles.imageWrapper}
                                style={{
                                    marginTop: originalIndex % 2 !== 0 ? '2rem' : '0'
                                }}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.alt}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
