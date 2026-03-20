"use client";

import { useRef, useEffect } from "react";

const DOT_RADIUS = 1.5;

interface Dot {
    gx: number;        // current position in grid units
    gy: number;
    dx: number;        // current direction
    dy: number;
    targetGx: number;  // next intersection to reach
    targetGy: number;
    speed: number;     // grid cells per frame
    opacity: number;
    stepCount: number;    // intersections visited since last forced turn
    stepsToTurn: number;  // force a turn after this many steps
}

export default function GravityGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const CELL     = 80;
        const STRENGTH = 55;
        const SIGMA    = 200;
        const LERP     = 0.04;
        const COUNT    = 8;

        const mouse  = { x: -9999, y: -9999 };
        const smooth = { x: -9999, y: -9999 };
        let dots: Dot[] = [];
        let raf = 0;

        function maxCol() { return Math.floor(canvas.width  / CELL); }
        function maxRow() { return Math.floor(canvas.height / CELL); }
        function ri(min: number, max: number) {
            return min + Math.floor(Math.random() * (max - min + 1));
        }

        // Directions that don't reverse and stay in bounds
        function availableDirs(gx: number, gy: number, dx: number, dy: number) {
            return (
                [{ dx: 1, dy: 0 }, { dx: -1, dy: 0 }, { dx: 0, dy: 1 }, { dx: 0, dy: -1 }]
                    .filter(d => {
                        if (d.dx === -dx && d.dy === -dy) return false;
                        const nx = gx + d.dx;
                        const ny = gy + d.dy;
                        return nx >= 0 && nx <= maxCol() && ny >= 0 && ny <= maxRow();
                    })
            );
        }

        // Called when a dot arrives at its target intersection — pick next direction
        function arrive(dot: Dot) {
            dot.gx = dot.targetGx;
            dot.gy = dot.targetGy;
            dot.stepCount++;

            const avail = availableDirs(dot.gx, dot.gy, dot.dx, dot.dy);
            if (avail.length === 0) return;

            const mustTurn      = dot.stepCount >= dot.stepsToTurn;
            const canContinue   = avail.some(d => d.dx === dot.dx && d.dy === dot.dy);
            const randomTurn    = Math.random() < 0.4;

            let chosen: { dx: number; dy: number };

            if (mustTurn || !canContinue || randomTurn) {
                // Prefer turning (exclude straight-ahead)
                const turns = avail.filter(d => !(d.dx === dot.dx && d.dy === dot.dy));
                const pool  = turns.length > 0 ? turns : avail;
                chosen = pool[Math.floor(Math.random() * pool.length)];
                dot.stepCount   = 0;
                dot.stepsToTurn = ri(2, 4);
            } else {
                // Continue straight
                chosen = avail.find(d => d.dx === dot.dx && d.dy === dot.dy)!;
            }

            dot.dx      = chosen.dx;
            dot.dy      = chosen.dy;
            dot.targetGx = dot.gx + chosen.dx;
            dot.targetGy = dot.gy + chosen.dy;
        }

        function buildDots() {
            const mc   = maxCol();
            const mr   = maxRow();
            const dirs = [{ dx:1,dy:0},{dx:-1,dy:0},{dx:0,dy:1},{dx:0,dy:-1}];
            dots = Array.from({ length: COUNT }, () => {
                const gx  = ri(1, mc - 1);  // start away from edges
                const gy  = ri(1, mr - 1);
                const dir = dirs[Math.floor(Math.random() * dirs.length)];
                // Ensure first target is in bounds
                const tgx = Math.max(0, Math.min(mc, gx + dir.dx));
                const tgy = Math.max(0, Math.min(mr, gy + dir.dy));
                return {
                    gx, gy,
                    dx: dir.dx, dy: dir.dy,
                    targetGx: tgx, targetGy: tgy,
                    speed:        0.010 + Math.random() * 0.006,
                    opacity:      0.35  + Math.random() * 0.45,
                    stepCount:    0,
                    stepsToTurn:  ri(2, 4),
                };
            });
        }

        function stepDot(dot: Dot) {
            dot.gx += dot.dx * dot.speed;
            dot.gy += dot.dy * dot.speed;

            // Check if we've reached or passed the target
            const hitX = dot.dx > 0 ? dot.gx >= dot.targetGx
                       : dot.dx < 0 ? dot.gx <= dot.targetGx
                       : true;
            const hitY = dot.dy > 0 ? dot.gy >= dot.targetGy
                       : dot.dy < 0 ? dot.gy <= dot.targetGy
                       : true;

            if (hitX && hitY) arrive(dot);
        }

        // Mexican-hat wave warp
        function warp(px: number, py: number) {
            const dx   = px - smooth.x;
            const dy   = py - smooth.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 0.1) return { x: px, y: py };
            const t    = dist / SIGMA;
            const wave = (1 - t * t) * Math.exp(-0.5 * t * t);
            const pull = STRENGTH * wave;
            return { x: px - (dx / dist) * pull, y: py - (dy / dist) * pull };
        }

        function draw() {
            smooth.x += (mouse.x - smooth.x) * LERP;
            smooth.y += (mouse.y - smooth.y) * LERP;

            const isLight = document.documentElement.classList.contains("light-mode");
            const lineColor = isLight ? "rgba(0,0,0,0.1)"  : "rgba(255,255,255,0.05)";
            const dotRgb    = isLight ? "0,0,0"            : "255,255,255";

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const c = maxCol() + 2;
            const r = maxRow() + 2;

            ctx.strokeStyle = lineColor;
            ctx.lineWidth   = 1;

            for (let row = 0; row < r; row++) {
                ctx.beginPath();
                for (let col = 0; col <= c; col++) {
                    const pt = warp(col * CELL, row * CELL);
                    col === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }

            for (let col = 0; col < c; col++) {
                ctx.beginPath();
                for (let row = 0; row <= r; row++) {
                    const pt = warp(col * CELL, row * CELL);
                    row === 0 ? ctx.moveTo(pt.x, pt.y) : ctx.lineTo(pt.x, pt.y);
                }
                ctx.stroke();
            }

            dots.forEach((dot) => {
                stepDot(dot);

                const pt    = warp(dot.gx * CELL, dot.gy * CELL);
                const glowR = DOT_RADIUS * 3;

                const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, glowR);
                grad.addColorStop(0,  `rgba(${dotRgb},${dot.opacity * 0.35})`);
                grad.addColorStop(1,  `rgba(${dotRgb},0)`);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, glowR, 0, Math.PI * 2);
                ctx.fillStyle = grad;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(pt.x, pt.y, DOT_RADIUS, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${dotRgb},${dot.opacity})`;
                ctx.fill();
            });

            raf = requestAnimationFrame(draw);
        }

        function onMouseMove(e: MouseEvent) {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }
        function onMouseLeave() { mouse.x = -9999; mouse.y = -9999; }
        function onTouchMove(e: TouchEvent) {
            const rect  = canvas.getBoundingClientRect();
            const touch = e.touches[0];
            mouse.x = touch.clientX - rect.left;
            mouse.y = touch.clientY - rect.top;
        }
        function onTouchEnd() { mouse.x = -9999; mouse.y = -9999; }
        function resize() {
            canvas.width  = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            buildDots();
        }

        window.addEventListener("mousemove",  onMouseMove);
        window.addEventListener("mouseleave", onMouseLeave);
        window.addEventListener("touchmove",  onTouchMove, { passive: true });
        window.addEventListener("touchend",   onTouchEnd);
        window.addEventListener("resize",     resize);

        resize();
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("mousemove",  onMouseMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("touchmove",  onTouchMove);
            window.removeEventListener("touchend",   onTouchEnd);
            window.removeEventListener("resize",     resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position:      "absolute",
                inset:         0,
                width:         "100%",
                height:        "100%",
                pointerEvents: "none",
                display:       "block",
            }}
        />
    );
}
