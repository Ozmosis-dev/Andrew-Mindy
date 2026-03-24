"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

interface GravityParticlesProps {
    particleCount?: number;
    particleSize?: number;
    particleOpacity?: number;
    glowIntensity?: number;
    movementSpeed?: number;
    mouseInfluence?: number;
    backgroundColor?: string;
    particleColor?: string;
    mouseGravity?: "none" | "attract" | "repel";
    gravityStrength?: number;
    glowAnimation?: "instant" | "ease" | "spring";
    particleInteraction?: boolean;
    interactionType?: "bounce" | "merge";
    className?: string;
    style?: React.CSSProperties;
    visibilityRadius?: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    opacity: number;
    baseOpacity: number;
    mass: number;
    id: number;
    glowMultiplier?: number;
    glowVelocity?: number;
}

export default function GravityParticles({
    particleCount = 50,
    particleSize = 2,
    particleOpacity = 0.6,
    glowIntensity = 10,
    movementSpeed = 0.5,
    mouseInfluence = 100,
    backgroundColor = "transparent",
    particleColor = "#000000",
    mouseGravity = "none",
    gravityStrength = 50,
    glowAnimation = "ease",
    particleInteraction = false,
    interactionType = "bounce",
    className,
    style,
    visibilityRadius,
}: GravityParticlesProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationRef = useRef<number | undefined>(undefined);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const particlesRef = useRef<Particle[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    // Initial size, will be updated by resize observer
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        if (typeof window !== "undefined") {
            checkMobile();
            window.addEventListener("resize", checkMobile);
        }
        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", checkMobile);
            }
        };
    }, []);

    const initializeParticles = useCallback(
        (width: number, height: number) => {
            const currentCount = isMobile ? Math.min(particleCount, 20) : particleCount;
            return Array.from({ length: currentCount }, (_, index) => ({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * movementSpeed,
                vy: (Math.random() - 0.5) * movementSpeed,
                size: Math.random() * particleSize + 1,
                opacity: particleOpacity,
                baseOpacity: particleOpacity,
                mass: Math.random() * 0.5 + 0.5,
                id: index,
            }));
        },
        [particleCount, particleSize, particleOpacity, movementSpeed, isMobile]
    );

    const redistributeParticles = useCallback((width: number, height: number) => {
        particlesRef.current.forEach((particle) => {
            // Redistribute particles proportionally across the new dimensionsIfNeeded,
            // but simple random reassignment or keeping relative position is often better.
            // The original code did:
            particle.x = Math.random() * width;
            particle.y = Math.random() * height;
        });
    }, []);

    const updateParticles = useCallback(
        (canvas: HTMLCanvasElement) => {
            // The original code uses getBoundingClientRect in update loop? Ideally avoid layout thrashing.
            // But let's follow the logic.
            const rect = canvas.getBoundingClientRect();
            const mouse = mouseRef.current;

            particlesRef.current.forEach((particle, index) => {
                // Calculate distance to mouse
                let dx = 0;
                let dy = 0;
                let distance = 99999;

                if (!isMobile) {
                    dx = mouse.x - particle.x;
                    dy = mouse.y - particle.y;
                    distance = Math.sqrt(dx * dx + dy * dy);
                }

                // Mouse influence and gravity
                if (!isMobile && distance < mouseInfluence && distance > 0) {
                    const force = (mouseInfluence - distance) / mouseInfluence;
                    const normalizedDx = dx / distance;
                    const normalizedDy = dy / distance;
                    const gravityForce = force * (gravityStrength * 0.001);

                    // Apply gravity effect based on mouseGravity setting
                    if (mouseGravity === "attract") {
                        particle.vx += normalizedDx * gravityForce;
                        particle.vy += normalizedDy * gravityForce;
                    } else if (mouseGravity === "repel") {
                        particle.vx -= normalizedDx * gravityForce;
                        particle.vy -= normalizedDy * gravityForce;
                    }

                    // Apply glow animation based on type
                    const targetGlow = 1 + force * 2;
                    const currentGlow = particle.glowMultiplier || 1;

                    if (glowAnimation === "instant") {
                        particle.glowMultiplier = targetGlow;
                    } else if (glowAnimation === "ease") {
                        // Ease in-out animation
                        const easeSpeed = 0.15;
                        particle.glowMultiplier =
                            currentGlow + (targetGlow - currentGlow) * easeSpeed;
                    } else if (glowAnimation === "spring") {
                        // Spring animation with overshoot
                        const springForce = (targetGlow - currentGlow) * 0.2;
                        const damping = 0.85;
                        const velocity = (particle.glowVelocity || 0) * damping + springForce;
                        particle.glowVelocity = velocity;
                        particle.glowMultiplier = Math.max(
                            1,
                            currentGlow + velocity
                        );
                    }
                } else {
                    // Return glow to normal based on animation type
                    const targetGlow = 1;
                    const currentGlow = particle.glowMultiplier || 1;

                    if (glowAnimation === "instant") {
                        particle.glowMultiplier = targetGlow;
                    } else if (glowAnimation === "ease") {
                        const easeSpeed = 0.08;
                        particle.glowMultiplier = Math.max(
                            1,
                            currentGlow + (targetGlow - currentGlow) * easeSpeed
                        );
                    } else if (glowAnimation === "spring") {
                        const springForce = (targetGlow - currentGlow) * 0.15;
                        const damping = 0.9;
                        const velocity =
                            (particle.glowVelocity || 0) * damping + springForce;
                        particle.glowVelocity = velocity;
                        particle.glowMultiplier = Math.max(
                            1,
                            currentGlow + velocity
                        );
                    }
                }

                // Opacity logic with visibility radius
                const visRadius = visibilityRadius || mouseInfluence;
                let targetOpacity = 0;

                if (isMobile) {
                    targetOpacity = particle.baseOpacity * 0.4; // Always subtly visible
                } else {
                    if (distance < visRadius) {
                        // Smooth feathering
                        const distFactor = 1 - (distance / visRadius);
                        targetOpacity = particle.baseOpacity * distFactor;
                    }

                    if (distance < mouseInfluence && distance > 0) {
                        // Add a little highlight if being interacted with
                        const force = (mouseInfluence - distance) / mouseInfluence;
                        targetOpacity = Math.min(1, targetOpacity + force * 0.2);
                    }
                }

                // Smooth transition for opacity
                particle.opacity += (targetOpacity - particle.opacity) * 0.1;

                // Particle interaction
                if (particleInteraction) {
                    for (let j = index + 1; j < particlesRef.current.length; j++) {
                        const other = particlesRef.current[j];
                        const dx = other.x - particle.x;
                        const dy = other.y - particle.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        const minDistance = particle.size + other.size + 5;

                        if (distance < minDistance && distance > 0) {
                            if (interactionType === "bounce") {
                                // Elastic collision
                                const normalX = dx / distance;
                                const normalY = dy / distance;

                                // Relative velocity
                                const relativeVx = particle.vx - other.vx;
                                const relativeVy = particle.vy - other.vy;

                                // Relative velocity in collision normal direction
                                const speed = relativeVx * normalX + relativeVy * normalY;

                                // Only resolve if velocities are separating
                                if (speed < 0) continue;

                                // Collision impulse
                                const impulse = (2 * speed) / (particle.mass + other.mass);

                                // Update velocities
                                particle.vx -= impulse * other.mass * normalX;
                                particle.vy -= impulse * other.mass * normalY;
                                other.vx += impulse * particle.mass * normalX;
                                other.vy += impulse * particle.mass * normalY;

                                // Separate particles to prevent overlap
                                const overlap = minDistance - distance;
                                const separationX = normalX * overlap * 0.5;
                                const separationY = normalY * overlap * 0.5;

                                particle.x -= separationX;
                                particle.y -= separationY;
                                other.x += separationX;
                                other.y += separationY;
                            } else if (interactionType === "merge") {
                                // Temporary merge effect - increase glow and size
                                const mergeForce =
                                    (minDistance - distance) / minDistance;
                                particle.glowMultiplier =
                                    (particle.glowMultiplier || 1) + mergeForce * 0.5;
                                other.glowMultiplier =
                                    (other.glowMultiplier || 1) + mergeForce * 0.5;

                                // Attract particles slightly
                                const attractForce = mergeForce * 0.01;
                                particle.vx += dx * attractForce;
                                particle.vy += dy * attractForce;
                                other.vx -= dx * attractForce;
                                other.vy -= dy * attractForce;
                            }
                        }
                    }
                }

                // Update position
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Add subtle random movement
                const randomForce = isMobile ? 0.01 : 0.001;
                particle.vx += (Math.random() - 0.5) * randomForce;
                particle.vy += (Math.random() - 0.5) * randomForce;

                // Damping
                particle.vx *= 0.999;
                particle.vy *= 0.999;

                if (isMobile) {
                    const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                    if (speed > movementSpeed * 0.5) {
                        particle.vx *= (movementSpeed * 0.5) / speed;
                        particle.vy *= (movementSpeed * 0.5) / speed;
                    }
                }

                // Boundary wrapping
                if (particle.x < 0) particle.x = rect.width;
                if (particle.x > rect.width) particle.x = 0;
                if (particle.y < 0) particle.y = rect.height;
                if (particle.y > rect.height) particle.y = 0;
            });
        },
        [
            mouseInfluence,
            mouseGravity,
            gravityStrength,
            glowAnimation,
            particleInteraction,
            interactionType,
            visibilityRadius,
            isMobile,
            movementSpeed,
        ]
    );

    const drawParticles = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            particlesRef.current.forEach((particle) => {
                ctx.save();

                // Create glow effect with enhanced blur based on interaction
                const currentGlowMultiplier = particle.glowMultiplier || 1;

                ctx.shadowColor = particleColor;
                ctx.shadowBlur = glowIntensity * currentGlowMultiplier * 2;
                ctx.globalAlpha = particle.opacity;
                ctx.fillStyle = particleColor;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();

                ctx.restore();
            });
        },
        [particleColor, glowIntensity]
    );

    const animate = useCallback(() => {
        const loop = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            updateParticles(canvas);
            drawParticles(ctx);

            animationRef.current = requestAnimationFrame(loop);
        };
        loop();
    }, [updateParticles, drawParticles]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const resizeCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const rect = container.getBoundingClientRect();
        const newWidth = rect.width;
        const newHeight = rect.height;

        // Only update if dimensions actually changed
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
            canvas.width = newWidth;
            canvas.height = newHeight;
            setCanvasSize({ width: newWidth, height: newHeight });

            // Only redistribute if particles exist and size changed significant?
            // The original code redistributes on resize.
            if (particlesRef.current.length > 0) {
                redistributeParticles(newWidth, newHeight);
            }
        }
    }, [redistributeParticles]);

    // Effect to reinitialize particles when particle count changes
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        particlesRef.current = initializeParticles(
            canvas.width || canvasSize.width,
            canvas.height || canvasSize.height
        );
    }, [particleCount, initializeParticles, canvasSize]);

    // Effect to update particle properties when they change
    useEffect(() => {
        particlesRef.current.forEach((particle) => {
            particle.baseOpacity = particleOpacity;
            particle.opacity = particleOpacity;

            // Update velocity based on new movement speed
            const currentSpeed = Math.sqrt(
                particle.vx * particle.vx + particle.vy * particle.vy
            );
            if (currentSpeed > 0) {
                const ratio = movementSpeed / currentSpeed;
                particle.vx *= ratio;
                particle.vy *= ratio;
            }
        });
    }, [particleOpacity, movementSpeed]);

    useEffect(() => {
        resizeCanvas();
        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("resize", resizeCanvas);
        }

        // Set up ResizeObserver for container
        let resizeObserver: ResizeObserver | null = null;
        if (containerRef.current && typeof ResizeObserver !== "undefined") {
            resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });
            resizeObserver.observe(containerRef.current);
        }

        animate();

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("resize", resizeCanvas);
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [handleMouseMove, resizeCanvas, animate]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                width: "100%",
                height: "100%",
                backgroundColor,
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
        >
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    );
}
