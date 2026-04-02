"use client";

/**
 * WaveBackground
 * A pure CSS/SVG wave that replaces the low-resolution Black-wave.jpg.
 * Renders infinite resolution, zero banding, and fades seamlessly into the
 * background above via a CSS mask gradient.
 */

import styles from "./WaveBackground.module.scss";

export default function WaveBackground() {
    return (
        <div className={styles.waveContainer} aria-hidden="true">
            <svg
                className={styles.waveSvg}
                viewBox="0 0 1440 520"
                preserveAspectRatio="xMidYMax slice"
                xmlns="http://www.w3.org/2000/svg"
            >
                <defs>
                    {/* Deep glow behind the top wave curves */}
                    <radialGradient id="waveGlow1" cx="30%" cy="40%" r="60%">
                        <stop offset="0%" stopColor="rgba(40,80,130,0.55)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                    <radialGradient id="waveGlow2" cx="70%" cy="55%" r="55%">
                        <stop offset="0%" stopColor="rgba(20,55,100,0.40)" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>

                    {/* Wave fill gradients — dark navy fading to black */}
                    <linearGradient id="waveFill1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(18,32,58,0.0)" />
                        <stop offset="35%" stopColor="rgba(10,22,42,0.7)" />
                        <stop offset="100%" stopColor="rgba(6,12,24,1)" />
                    </linearGradient>
                    <linearGradient id="waveFill2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(8,18,36,0.0)" />
                        <stop offset="40%" stopColor="rgba(5,12,22,0.85)" />
                        <stop offset="100%" stopColor="rgba(4,8,16,1)" />
                    </linearGradient>
                    <linearGradient id="waveFill3" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(4,10,22,0.0)" />
                        <stop offset="50%" stopColor="rgba(3,7,14,0.9)" />
                        <stop offset="100%" stopColor="rgba(2,4,10,1)" />
                    </linearGradient>

                    {/* Stroke gradient for the top edge of waves — gives that luminous rim */}
                    <linearGradient id="strokeGrad1" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(60,120,200,0)" />
                        <stop offset="20%" stopColor="rgba(80,150,230,0.35)" />
                        <stop offset="50%" stopColor="rgba(100,180,255,0.6)" />
                        <stop offset="80%" stopColor="rgba(80,150,230,0.35)" />
                        <stop offset="100%" stopColor="rgba(60,120,200,0)" />
                    </linearGradient>
                    <linearGradient id="strokeGrad2" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(40,90,160,0)" />
                        <stop offset="30%" stopColor="rgba(60,130,210,0.25)" />
                        <stop offset="60%" stopColor="rgba(80,160,240,0.45)" />
                        <stop offset="100%" stopColor="rgba(40,90,160,0)" />
                    </linearGradient>
                    <linearGradient id="strokeGrad3" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="rgba(30,70,130,0)" />
                        <stop offset="40%" stopColor="rgba(50,110,190,0.2)" />
                        <stop offset="70%" stopColor="rgba(70,140,220,0.35)" />
                        <stop offset="100%" stopColor="rgba(30,70,130,0)" />
                    </linearGradient>
                </defs>

                {/* Ambient glow blobs */}
                <ellipse cx="420" cy="280" rx="500" ry="220" fill="url(#waveGlow1)" />
                <ellipse cx="1020" cy="340" rx="480" ry="200" fill="url(#waveGlow2)" />

                {/* Wave layer 3 — deepest, most solid */}
                <path
                    d="M0 380 C 180 340, 360 420, 540 360 C 720 300, 900 390, 1080 345 C 1260 300, 1380 370, 1440 355 L 1440 520 L 0 520 Z"
                    fill="url(#waveFill3)"
                />
                <path
                    d="M0 380 C 180 340, 360 420, 540 360 C 720 300, 900 390, 1080 345 C 1260 300, 1380 370, 1440 355"
                    fill="none"
                    stroke="url(#strokeGrad3)"
                    strokeWidth="1.2"
                />

                {/* Wave layer 2 — mid */}
                <path
                    d="M0 310 C 200 260, 370 350, 580 290 C 790 230, 960 320, 1160 270 C 1300 235, 1400 285, 1440 270 L 1440 520 L 0 520 Z"
                    fill="url(#waveFill2)"
                />
                <path
                    d="M0 310 C 200 260, 370 350, 580 290 C 790 230, 960 320, 1160 270 C 1300 235, 1400 285, 1440 270"
                    fill="none"
                    stroke="url(#strokeGrad2)"
                    strokeWidth="1.5"
                />

                {/* Wave layer 1 — topmost, brightest rim */}
                <path
                    d="M0 240 C 160 185, 340 275, 560 210 C 780 145, 940 240, 1140 190 C 1290 152, 1390 210, 1440 198 L 1440 520 L 0 520 Z"
                    fill="url(#waveFill1)"
                />
                <path
                    d="M0 240 C 160 185, 340 275, 560 210 C 780 145, 940 240, 1140 190 C 1290 152, 1390 210, 1440 198"
                    fill="none"
                    stroke="url(#strokeGrad1)"
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
}
