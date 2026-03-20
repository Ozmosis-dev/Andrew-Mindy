"use client";

import React from 'react';
import styles from './ProcessIcons.module.scss';

export const DiscoveryIcon = () => (
    <svg className={styles.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer dashed rotating ring */}
        <circle cx="50" cy="50" r="42" className={styles.rotateSlow} stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />

        {/* Inner solid ring */}
        <circle cx="50" cy="50" r="28" stroke="currentColor" strokeWidth="1" opacity="0.3" />

        {/* Pulsing core ring */}
        <circle cx="50" cy="50" r="14" className={styles.pulse} stroke="var(--accent)" strokeWidth="1.5" />

        {/* Connecting nodes */}
        <path d="M50 8 L50 22 M50 78 L50 92 M8 50 L22 50 M78 50 L92 50" stroke="currentColor" strokeWidth="1" className={styles.crosshair} />

        {/* Center dot */}
        <circle cx="50" cy="50" r="3" fill="var(--accent)" />
    </svg>
);

export const StrategyIcon = () => (
    <svg className={styles.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left floating square */}
        <rect x="20" y="35" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1.5" className={styles.float1} />

        {/* Right floating square, accent */}
        <rect x="52" y="15" width="28" height="28" rx="4" stroke="var(--accent)" strokeWidth="1.5" className={styles.float2} />

        {/* Bottom floating outline */}
        <rect x="40" y="55" width="28" height="28" rx="4" stroke="currentColor" strokeWidth="1" opacity="0.4" className={styles.float3} />

        {/* Connecting animated line */}
        <path d="M34 49 C44 34 66 29 66 29" stroke="currentColor" strokeWidth="1.5" pathLength={1} className={styles.drawLine} />
    </svg>
);

export const DesignBuildIcon = () => (
    <svg className={styles.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* 3D Isometric Cube layers */}
        {/* Top face */}
        <path d="M50 25 L25 40 L50 55 L75 40 Z" stroke="var(--accent)" strokeWidth="1.5" strokeLinejoin="round" fill="rgba(0,0,0,0.01)" pathLength={1} className={styles.drawCube1} />
        {/* Left face */}
        <path d="M25 40 L25 65 L50 80 L50 55 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="rgba(0,0,0,0.01)" pathLength={1} className={styles.drawCube2} />
        {/* Right face */}
        <path d="M75 40 L75 65 L50 80 L50 55 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="rgba(0,0,0,0.01)" pathLength={1} className={styles.drawCube3} />

        {/* Hovering top wireframe */}
        <path d="M50 10 L25 25 L50 40 L75 25 Z" stroke="currentColor" strokeWidth="0.5" strokeLinejoin="round" opacity="0.5" className={styles.floatUp} />
    </svg>
);

export const LaunchIcon = () => (
    <svg className={styles.icon} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Base trajectory line */}
        <path d="M15 85 L75 25" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" opacity="0.3" />

        {/* Animated shooting line */}
        <path d="M15 85 L75 25" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" pathLength={1} className={styles.shootLine} />

        {/* Arrow head */}
        <path d="M55 25 L75 25 L75 45" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowHead} />

        {/* Launch ripples */}
        <circle cx="20" cy="80" r="6" stroke="currentColor" strokeWidth="1" className={styles.ripple1} />
        <circle cx="20" cy="80" r="12" stroke="currentColor" strokeWidth="0.5" className={styles.ripple2} />

        {/* Target burst */}
        <circle cx="75" cy="25" r="4" fill="var(--accent)" className={styles.targetBurst} />
    </svg>
);
