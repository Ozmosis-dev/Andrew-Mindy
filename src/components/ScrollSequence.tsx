"use client";

import React, { useEffect, useRef, useState } from 'react';
import styles from './ScrollSequence.module.scss';
import { useScroll, useTransform, useSpring, MotionValue, motion } from 'framer-motion';

interface ScrollSequenceProps {
    progress: MotionValue<number>;
    y?: MotionValue<number>;
    scale?: MotionValue<number>;
}

export default function ScrollSequence({ progress, y, scale }: ScrollSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Smooth the progress for smoother animation


    // Preload images
    useEffect(() => {
        const loadImages = async () => {
            const loadedImages: HTMLImageElement[] = [];
            const imageCount = 121; // Total frames

            // Generate array of promises
            const promises = Array.from({ length: imageCount }, (_, i) => {
                return new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    // Format number with leading zeros (001, 002, etc.)
                    const frameNumber = (i + 1).toString().padStart(3, '0');
                    img.src = `/images/scale-frame-${frameNumber}.png`;
                    img.onload = () => {
                        loadedImages[i] = img;
                        resolve();
                    };
                    img.onerror = () => {
                        console.error(`Failed to load image scale-frame-${frameNumber}.png`);
                        // Resolve anyway to not break the whole sequence if one frame fails
                        resolve();
                    };
                });
            });

            await Promise.all(promises);
            setImages(loadedImages);
            setIsLoaded(true);
        };

        loadImages();
    }, []);

    // Render loop
    useEffect(() => {
        if (!isLoaded || images.length === 0 || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas dimensions to match the first image
        if (images[0]) {
            canvas.width = images[0].width;
            canvas.height = images[0].height;
        }

        const render = () => {
            const currentProgress = progress.get();
            // Map progress 0-1 to frame index 0-120
            const frameIndex = Math.min(
                Math.max(Math.floor(currentProgress * (images.length - 1)), 0),
                images.length - 1
            );

            const img = images[frameIndex];
            if (img) {
                // Clear the canvas before drawing - important for transparency
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
            }
        };

        // Render initially
        render();

        // Subscribe to progress changes
        const unsubscribe = progress.on("change", render);

        return () => unsubscribe();
    }, [isLoaded, images, progress]);

    return (
        <motion.div
            className={styles.canvasContainer}
            style={{ ...(y ? { y } : {}), rotate: 90, scale }}
        >
            <canvas ref={canvasRef} />
        </motion.div>
    );
}
