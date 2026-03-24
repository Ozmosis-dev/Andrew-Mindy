"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function SalesSystemIllustration() {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!containerRef.current || !svgRef.current) return;
        const svg = svgRef.current;

        const panels = Array.from(svg.querySelectorAll("[data-panel]")) as SVGGElement[];
        const drawPaths = Array.from(svg.querySelectorAll("[data-draw]")) as SVGPathElement[];
        const connectors = Array.from(svg.querySelectorAll("[data-connector]")) as SVGPathElement[];
        const progressBars = Array.from(svg.querySelectorAll("[data-hbar]")) as SVGRectElement[];
        const revBars = Array.from(svg.querySelectorAll("[data-vbar]")) as SVGRectElement[];
        const fadeEls = Array.from(svg.querySelectorAll("[data-fade]")) as SVGElement[];
        const dots = Array.from(svg.querySelectorAll("[data-dot]")) as SVGCircleElement[];

        const origWidths = progressBars.map((el) => parseFloat(el.getAttribute("width") || "0"));
        const origHeights = revBars.map((el) => parseFloat(el.getAttribute("height") || "0"));
        const origYs = revBars.map((el) => parseFloat(el.getAttribute("y") || "0"));

        gsap.set(panels, { opacity: 0, y: 24 });
        gsap.set(fadeEls, { opacity: 0 });
        gsap.set(dots, { scale: 0, transformOrigin: "center center" });
        progressBars.forEach((el) => gsap.set(el, { attr: { width: 0 } }));
        revBars.forEach((el, i) =>
            gsap.set(el, { attr: { height: 0, y: origYs[i] + origHeights[i] } })
        );
        drawPaths.forEach((el) => {
            const len = el.getTotalLength();
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });
        connectors.forEach((el) => {
            const len = el.getTotalLength();
            gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 82%",
                toggleActions: "play reverse play reverse",
            },
        });

        tl.to(panels, { opacity: 1, y: 0, duration: 0.85, stagger: 0.14, ease: "power3.out" })
            .to(connectors, { strokeDashoffset: 0, duration: 0.7, stagger: 0.2, ease: "power2.inOut" }, "-=0.3")
            .to(drawPaths, { strokeDashoffset: 0, duration: 1.6, stagger: 0.1, ease: "power2.out" }, "-=0.5")
            .to(
                progressBars,
                { attr: { width: (i: number) => origWidths[i] }, duration: 1.0, stagger: 0.15, ease: "power3.out" },
                "-=1.4"
            )
            .to(
                revBars,
                { attr: { height: (i: number) => origHeights[i], y: (i: number) => origYs[i] }, duration: 1.0, stagger: 0.1, ease: "power3.out" },
                "-=1.2"
            )
            .to(fadeEls, { opacity: 1, duration: 0.5, stagger: 0.06, ease: "power2.out" }, "-=0.9")
            .to(dots, { scale: 1, duration: 0.4, stagger: 0.07, ease: "back.out(1.8)" }, "-=0.7");

        return () => { tl.kill(); };
    }, []);

    // ── Color tokens ──────────────────────────────────────────────────────
    const accent = "#62AFEF";
    const accentDim = "rgba(98,175,239,0.18)";
    const accentFaint = "rgba(98,175,239,0.06)";
    const textPrimary = "#ededed";
    const textSec = "rgba(237,237,237,0.55)";
    const textDim = "rgba(237,237,237,0.28)";
    const panelBorder = "rgba(98,175,239,0.2)";
    const gridCol = "rgba(255,255,255,0.024)";
    const dividerCol = "rgba(255,255,255,0.06)";

    // ── Chart paths ───────────────────────────────────────────────────────
    const crPoints = [
        [449, 184], [520, 176], [592, 172], [663, 159],
        [734, 147], [806, 134], [877, 122], [949, 113],
    ];
    const apptPoints = [
        [449, 215], [520, 200], [592, 182], [663, 165],
        [734, 148], [806, 133], [877, 112], [949, 95],
    ];

    function smoothPath(pts: number[][]): string {
        let d = `M ${pts[0][0]},${pts[0][1]}`;
        for (let i = 0; i < pts.length - 1; i++) {
            const p0 = pts[i], p1 = pts[i + 1];
            d += ` C ${p0[0] + (p1[0] - p0[0]) * 0.45},${p0[1] + (p1[1] - p0[1]) * 0.1} ${p1[0] - (p1[0] - p0[0]) * 0.45},${p1[1] - (p1[1] - p0[1]) * 0.1} ${p1[0]},${p1[1]}`;
        }
        return d;
    }

    const crLine = smoothPath(crPoints);
    const apptLine = smoothPath(apptPoints);
    const chartBottom = 340;
    const crLineBody = crLine.replace(/^M [0-9.]+,[0-9.]+ /, "");
    const apptLineBody = apptLine.replace(/^M [0-9.]+,[0-9.]+ /, "");
    const crArea = `M 449,${chartBottom} L 449,184 ${crLineBody} L 949,${chartBottom} Z`;
    const apptArea = `M 449,${chartBottom} L 449,215 ${apptLineBody} L 949,${chartBottom} Z`;

    // ── Revenue bar data ──────────────────────────────────────────────────
    const revData = [
        { year: "18", val: 3, label: "$3M" },
        { year: "19", val: 7, label: "$7M" },
        { year: "20", val: 11, label: "$11M" },
        { year: "21", val: 16, label: "$16M" },
        { year: "22", val: 20, label: "$20M" },
    ];
    const barChartLeft = 1019;
    const barChartBottom = 390;
    const barChartHeight = 200;
    const barWidth = 54;
    const barGap = 14;
    const revBarsData = revData.map((d, i) => {
        const h = (d.val / 20) * barChartHeight;
        const x = barChartLeft + i * (barWidth + barGap);
        const y = barChartBottom - h;
        return { ...d, x, y, h };
    });

    // All 3 panels share identical y=20, h=490
    const PANEL_Y = 20;
    const PANEL_H = 490;

    return (
        <div ref={containerRef} style={{ width: "100%", padding: "2.5rem 0 1rem" }}>
            <svg
                ref={svgRef}
                viewBox="0 0 1400 530"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
                style={{ width: "100%", height: "auto", display: "block" }}
            >
                <defs>
                    <style>{`
                        /* Pulsing live dots */
                        @keyframes cfPulse {
                            0%,100% { opacity:.35; }
                            50% { opacity:1; }
                        }
                        /* Flowing connector dashes */
                        @keyframes connFlow {
                            0% { stroke-dashoffset: 24; }
                            100% { stroke-dashoffset: 0; }
                        }
                        /* Single scan line sweeping full height of all 3 cards (330px) */
                        @keyframes scanFull {
                            0%   { transform: translateY(0px);   opacity: 0;   }
                            5%   { opacity: 0.6; }
                            88%  { opacity: 0.5; }
                            100% { transform: translateY(330px); opacity: 0;   }
                        }
                        /* Revenue bar shimmer */
                        @keyframes barShimmer {
                            0%,100% { opacity: 1; }
                            50%     { opacity: 0.78; }
                        }
                        /* Traveling dot along chart line — slow */
                        @keyframes travelLine {
                            0%   { offset-distance: 0%;   opacity:0; }
                            6%   { opacity: 1; }
                            94%  { opacity: 1; }
                            100% { offset-distance: 100%; opacity:0; }
                        }
                        .live-dot   { animation: cfPulse 2.2s ease-in-out infinite; }
                        .live-dot-2 { animation: cfPulse 2.2s .7s ease-in-out infinite; }
                        .live-dot-3 { animation: cfPulse 2.2s 1.4s ease-in-out infinite; }
                        .conn-dash  { stroke-dasharray:6 6; animation: connFlow .6s linear infinite; }
                        .scan-full  { animation: scanFull 5.5s ease-in-out infinite; }
                        [data-vbar] { animation: barShimmer 2.8s ease-in-out infinite; }
                        .chart-traveler {
                            offset-path: path('M 449,184 C 480.65,184.8 488.35,176 520,176 C 551.65,176 559.35,172 592,172 C 624.65,172 640.65,159 663,159 C 685.35,159 701.65,147 734,147 C 766.35,147 782.35,134 806,134 C 829.65,134 845.65,122 877,122 C 908.35,122 917,113 949,113');
                            animation: travelLine 14s 2s ease-in-out infinite;
                        }
                    `}</style>

                    {/* Gradients */}
                    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#020508" />
                        <stop offset="50%" stopColor="#04090f" />
                        <stop offset="100%" stopColor="#020508" />
                    </linearGradient>
                    <linearGradient id="panelGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="rgba(12,22,42,0.96)" />
                        <stop offset="100%" stopColor="rgba(5,9,18,0.96)" />
                    </linearGradient>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7ac4ff" stopOpacity="1" />
                        <stop offset="100%" stopColor="#3a85c8" stopOpacity="0.6" />
                    </linearGradient>
                    <linearGradient id="areaGrad1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#62AFEF" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#62AFEF" stopOpacity="0.01" />
                    </linearGradient>
                    <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#62AFEF" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="#62AFEF" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(98,175,239,0.055)" />
                        <stop offset="100%" stopColor="rgba(98,175,239,0)" />
                    </radialGradient>
                    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b" />
                        <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridCol} strokeWidth="1" />
                    </pattern>
                    {/* Clip panel 2 interior to its bounds */}
                    <clipPath id="cp2">
                        <rect x="425" y={PANEL_Y} width="550" height={PANEL_H} rx="16" />
                    </clipPath>
                    <marker id="arrowTip" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                        <path d="M0,0 L6,3 L0,6 Z" fill={accent} opacity="0.7" />
                    </marker>
                </defs>

                {/* Canvas */}
                <rect width="1400" height="530" fill="url(#bgGrad)" />
                <rect width="1400" height="530" fill="url(#grid)" />
                <ellipse cx="700" cy="265" rx="580" ry="265" fill="url(#centerGlow)" />

                {/* ════════════════════════════════════════════════════════
                    PANEL 1 — SCRIPT DEVELOPMENT
                ════════════════════════════════════════════════════════ */}
                <g data-panel>
                    <rect x="20" y={PANEL_Y} width="385" height={PANEL_H} rx="16"
                        fill="url(#panelGrad)" stroke={panelBorder} strokeWidth="1" />
                    <rect x="20" y={PANEL_Y} width="385" height="3" rx="1.5"
                        fill={accent} opacity="0.7" filter="url(#glow)" />

                    {/* Header */}
                    <rect x="40" y="43" width="13" height="16" rx="2" fill="none" stroke={accent} strokeWidth="1.5" />
                    <line x1="44" y1="50" x2="49" y2="50" stroke={accent} strokeWidth="1" />
                    <line x1="44" y1="54" x2="49" y2="54" stroke={accent} strokeWidth="1" />
                    <text x="62" y="54" fill={accent} fontSize="8.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="2.8">SCRIPT DEVELOPMENT</text>
                    <line x1="36" y1="70" x2="389" y2="70" stroke={dividerCol} strokeWidth="1" />

                    {/* ── Card 1: Confirmation Call ── */}
                    <rect x="36" y="82" width="357" height="102" rx="9"
                        fill={accentFaint} stroke={accentDim} strokeWidth="1" />
                    <circle cx="59" cy="112" r="14" fill="rgba(98,175,239,0.09)" stroke={accentDim} strokeWidth="1" />
                    <text x="59" y="116" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" textAnchor="middle">01</text>
                    <text x="83" y="105" fill={textPrimary} fontSize="10.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="1">CONFIRMATION CALL</text>
                    <rect x="83" y="111" width="62" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="114" y="121" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">PSYCHOLOGY</text>
                    <rect x="151" y="111" width="46" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="174" y="121" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">RAPPORT</text>
                    <rect x="203" y="111" width="69" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="237" y="121" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">NEED-FINDING</text>
                    <text x="83" y="143" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" letterSpacing="1">TRAINING COMPLETION</text>
                    <text x="371" y="143" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" textAnchor="end">85%</text>
                    <rect x="83" y="149" width="281" height="3.5" rx="1.75" fill="rgba(255,255,255,0.05)" />
                    <rect data-hbar x="83" y="149" width="239" height="3.5" rx="1.75" fill={accent} opacity="0.85" />
                    <circle data-dot cx="322" cy="150.75" r="5" fill={accent} opacity="0.2" />
                    <circle data-dot cx="322" cy="150.75" r="2.5" fill={accent} data-fade />
                    <text x="83" y="172" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif">
                        6 modules · field-tested · 120 reps deployed
                    </text>

                    {/* ── Card 2: Objection Matrix ── */}
                    <rect x="36" y="196" width="357" height="102" rx="9"
                        fill={accentFaint} stroke={accentDim} strokeWidth="1" />
                    <circle cx="59" cy="226" r="14" fill="rgba(98,175,239,0.09)" stroke={accentDim} strokeWidth="1" />
                    <text x="59" y="230" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" textAnchor="middle">02</text>
                    <text x="83" y="219" fill={textPrimary} fontSize="10.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="1">OBJECTION MATRIX</text>
                    <rect x="83" y="225" width="56" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="111" y="235" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">REFRAMES</text>
                    <rect x="145" y="225" width="50" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="170" y="235" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">ANCHORS</text>
                    <rect x="201" y="225" width="56" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="229" y="235" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">HANDLING</text>
                    <text x="83" y="257" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" letterSpacing="1">TRAINING COMPLETION</text>
                    <text x="371" y="257" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" textAnchor="end">72%</text>
                    <rect x="83" y="263" width="281" height="3.5" rx="1.75" fill="rgba(255,255,255,0.05)" />
                    <rect data-hbar x="83" y="263" width="202" height="3.5" rx="1.75" fill={accent} opacity="0.7" />
                    <circle data-dot cx="285" cy="264.75" r="5" fill={accent} opacity="0.2" />
                    <circle data-dot cx="285" cy="264.75" r="2.5" fill={accent} data-fade />
                    <text x="83" y="286" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif">
                        9 modules · role-play tested · live scenarios
                    </text>

                    {/* ── Card 3: Close Sequence ── */}
                    <rect x="36" y="310" width="357" height="102" rx="9"
                        fill={accentFaint} stroke={accentDim} strokeWidth="1" />
                    <circle cx="59" cy="340" r="14" fill="rgba(98,175,239,0.09)" stroke={accentDim} strokeWidth="1" />
                    <text x="59" y="344" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" textAnchor="middle">03</text>
                    <text x="83" y="333" fill={textPrimary} fontSize="10.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="1">CLOSE SEQUENCE</text>
                    <rect x="83" y="339" width="50" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="108" y="349" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">URGENCY</text>
                    <rect x="139" y="339" width="63" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="170" y="349" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">COMMITMENT</text>
                    <rect x="208" y="339" width="55" height="13" rx="6.5" fill="rgba(98,175,239,0.07)" stroke={accentDim} strokeWidth="0.5" />
                    <text x="235" y="349" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" letterSpacing="0.5">SIGN-OFF</text>
                    <text x="83" y="371" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" letterSpacing="1">TRAINING COMPLETION</text>
                    <text x="371" y="371" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" textAnchor="end">91%</text>
                    <rect x="83" y="377" width="281" height="3.5" rx="1.75" fill="rgba(255,255,255,0.05)" />
                    <rect data-hbar x="83" y="377" width="256" height="3.5" rx="1.75" fill={accent} opacity="0.9" />
                    <circle data-dot cx="339" cy="378.75" r="5" fill={accent} opacity="0.3" />
                    <circle data-dot cx="339" cy="378.75" r="2.5" fill={accent} data-fade />
                    <text x="83" y="400" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif">
                        7 modules · objection counters · micro-commitments
                    </text>

                    {/* Scan line — rendered last so it draws over all 3 cards */}
                    <rect x="36" y="82" width="357" height="2" rx="1"
                        fill={accent} opacity="0.55" className="scan-full" />

                    {/* Footer stats — full-width inline rows */}
                    <line x1="36" y1="416" x2="389" y2="416" stroke={dividerCol} strokeWidth="1" />
                    <text x="36" y="433" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" letterSpacing="1">SYSTEM COVERAGE</text>

                    {/* Row 1: Modules */}
                    <rect x="36" y="440" width="353" height="20" rx="6" fill="rgba(98,175,239,0.05)" stroke={accentDim} strokeWidth="1" />
                    <text x="50" y="454" fill={textSec} fontSize="8.5" fontFamily="Montserrat,sans-serif" letterSpacing="0.5">MODULES</text>
                    <text x="379" y="454" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="end">22</text>

                    {/* Row 2: Reps Trained */}
                    <rect x="36" y="465" width="353" height="20" rx="6" fill="rgba(98,175,239,0.05)" stroke={accentDim} strokeWidth="1" />
                    <text x="50" y="479" fill={textSec} fontSize="8.5" fontFamily="Montserrat,sans-serif" letterSpacing="0.5">REPS TRAINED</text>
                    <text x="379" y="479" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="end">52</text>

                    {/* Row 3: Avg Completion */}
                    <rect x="36" y="490" width="353" height="20" rx="6" fill="rgba(98,175,239,0.05)" stroke={accentDim} strokeWidth="1" />
                    <text x="50" y="504" fill={textSec} fontSize="8.5" fontFamily="Montserrat,sans-serif" letterSpacing="0.5">AVG COMPLETION</text>
                    <text x="379" y="504" fill={accent} fontSize="9" fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="end">83%</text>
                </g>

                {/* Connector 1→2 */}
                <g>
                    <path data-connector d="M 405,265 L 425,265"
                        fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" markerEnd="url(#arrowTip)" />
                    <path className="conn-dash" d="M 405,265 L 425,265"
                        fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
                    <circle cx="405" cy="265" r="4" fill={accent} opacity="0.5" filter="url(#glow)" />
                    <circle cx="425" cy="265" r="4" fill={accent} opacity="0.5" filter="url(#glow)" />
                </g>

                {/* ════════════════════════════════════════════════════════
                    PANEL 2 — OPERATIONS DASHBOARD  (same height as others)
                ════════════════════════════════════════════════════════ */}
                <g data-panel>
                    {/* Panel rect — same y and h as panels 1 & 3 */}
                    <rect x="425" y={PANEL_Y} width="550" height={PANEL_H} rx="16"
                        fill="url(#panelGrad)" stroke={panelBorder} strokeWidth="1" />
                    <rect x="425" y={PANEL_Y} width="550" height="3" rx="1.5"
                        fill={accent} opacity="0.8" filter="url(#glow)" />

                    {/* Header */}
                    <rect x="445" y="38" width="14" height="12" rx="2" fill="none" stroke={accent} strokeWidth="1.5" />
                    <line x1="448" y1="44" x2="448" y2="50" stroke={accent} strokeWidth="1.5" />
                    <line x1="452" y1="42" x2="452" y2="50" stroke={accent} strokeWidth="1.5" />
                    <line x1="456" y1="46" x2="456" y2="50" stroke={accent} strokeWidth="1.5" />
                    <text x="468" y="48" fill={accent} fontSize="8.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="2.8">OPERATIONS DASHBOARD</text>
                    <text x="948" y="48" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif"
                        textAnchor="end" letterSpacing="1">2018 — 2022</text>
                    <line x1="441" y1="62" x2="959" y2="62" stroke={dividerCol} strokeWidth="1" />

                    {/* Y-axis labels & grid */}
                    {[{ v: "100%", y: 94 }, { v: "75%", y: 156 }, { v: "50%", y: 218 }, { v: "25%", y: 280 }, { v: "0%", y: 342 }].map((tick) => (
                        <g key={tick.v}>
                            <text x="437" y={tick.y} fill={textDim} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="end">{tick.v}</text>
                            <line x1="441" y1={tick.y - 4} x2="955" y2={tick.y - 4} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                        </g>
                    ))}

                    {/* X-axis labels */}
                    {["Q1'18", "Q3'18", "Q1'19", "Q3'19", "Q1'20", "Q3'20", "Q1'21", "Q1'22"].map((label, i) => (
                        <text key={i} x={449 + i * (500 / 7)} y="360"
                            fill={textDim} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle">{label}</text>
                    ))}

                    {/* Area fills */}
                    <path d={apptArea} fill="url(#areaGrad2)" clipPath="url(#cp2)" />
                    <path d={crArea} fill="url(#areaGrad1)" clipPath="url(#cp2)" />

                    {/* Chart lines */}
                    <path data-draw d={apptLine} fill="none" stroke={accent}
                        strokeWidth="1.5" strokeOpacity="0.4" clipPath="url(#cp2)" />
                    <path data-draw d={crLine} fill="none" stroke={accent}
                        strokeWidth="2.5" strokeOpacity="0.95" clipPath="url(#cp2)" filter="url(#glow)" />

                    {/* Traveling dot that loops along the close-rate line */}
                    <circle r="5" fill={accent} filter="url(#glow)" className="chart-traveler" />

                    {/* Data dots */}
                    {crPoints.map(([x, y], i) => (
                        <g key={i}>
                            <circle cx={x} cy={y} r="5" fill={accent} opacity="0.12" />
                            <circle data-dot cx={x} cy={y} r="2.8" fill={accent} opacity="0.9" />
                        </g>
                    ))}
                    {apptPoints.map(([x, y], i) => (
                        <circle data-dot key={i} cx={x} cy={y} r="2" fill={accent} opacity="0.45" />
                    ))}

                    {/* Legend */}
                    <line x1="449" y1="375" x2="467" y2="375" stroke={accent} strokeWidth="2.5" />
                    <text x="471" y="378" fill={textSec} fontSize="8" fontFamily="Montserrat,sans-serif">Close Rate</text>
                    <line x1="538" y1="375" x2="556" y2="375" stroke={accent} strokeWidth="1.5" strokeOpacity="0.4" />
                    <text x="560" y="378" fill={textSec} fontSize="8" fontFamily="Montserrat,sans-serif">Appointment Pipeline</text>

                    {/* KPI Tiles */}
                    <line x1="441" y1="392" x2="959" y2="392" stroke={dividerCol} strokeWidth="1" />

                    {/* Tile 1 — Appts / Week */}
                    <rect x="441" y="402" width="162" height="90" rx="10"
                        fill="rgba(98,175,239,0.04)" stroke={accentDim} strokeWidth="1" />
                    <text x="522" y="424" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="1.5">APPTS / WEEK</text>
                    <text id="kpi-appts" x="522" y="454" fill={textPrimary} fontSize="28"
                        fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle" data-fade>92</text>
                    <path d="M 514,466 L 518,459 L 522,466" fill="none" stroke={accent} strokeWidth="1.5" data-fade />
                    <text x="527" y="467" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" data-fade>+284%</text>

                    {/* Tile 2 — Show Rate */}
                    <rect x="613" y="402" width="162" height="90" rx="10"
                        fill="rgba(98,175,239,0.04)" stroke={accentDim} strokeWidth="1" />
                    <text x="694" y="424" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="1.5">SHOW RATE</text>
                    <text id="kpi-show" x="694" y="454" fill={textPrimary} fontSize="28"
                        fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle" data-fade>94%</text>
                    <path d="M 686,466 L 690,459 L 694,466" fill="none" stroke={accent} strokeWidth="1.5" data-fade />
                    <text x="699" y="467" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" data-fade>+26pts</text>

                    {/* Tile 3 — Close Rate */}
                    <rect x="785" y="402" width="162" height="90" rx="10"
                        fill="rgba(98,175,239,0.04)" stroke={accentDim} strokeWidth="1" />
                    <text x="866" y="424" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="1.5">CLOSE RATE</text>
                    <text id="kpi-close" x="866" y="454" fill={accent} fontSize="28"
                        fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle" data-fade>53%</text>
                    <path d="M 858,466 L 862,459 L 866,466" fill="none" stroke={accent} strokeWidth="1.5" data-fade />
                    <text x="871" y="467" fill={accent} fontSize="8" fontFamily="Montserrat,sans-serif" data-fade>+18pts</text>

                    <circle cx="950" cy="498" r="4" fill={accent} className="live-dot-2" />
                    <text x="940" y="501" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" textAnchor="end">LIVE</text>
                </g>

                {/* Connector 2→3 */}
                <g>
                    <path data-connector d="M 975,265 L 995,265"
                        fill="none" stroke={accent} strokeWidth="1.5" opacity="0.6" markerEnd="url(#arrowTip)" />
                    <path className="conn-dash" d="M 975,265 L 995,265"
                        fill="none" stroke={accent} strokeWidth="1" opacity="0.4" />
                    <circle cx="975" cy="265" r="4" fill={accent} opacity="0.5" filter="url(#glow)" />
                    <circle cx="995" cy="265" r="4" fill={accent} opacity="0.5" filter="url(#glow)" />
                </g>

                {/* ════════════════════════════════════════════════════════
                    PANEL 3 — SALES PERFORMANCE KPIs
                ════════════════════════════════════════════════════════ */}
                <g data-panel>
                    <rect x="995" y={PANEL_Y} width="385" height={PANEL_H} rx="16"
                        fill="url(#panelGrad)" stroke={panelBorder} strokeWidth="1" />
                    <rect x="995" y={PANEL_Y} width="385" height="3" rx="1.5"
                        fill={accent} opacity="0.7" filter="url(#glow)" />

                    {/* Header */}
                    <rect x="1015" y="43" width="16" height="14" rx="2" fill="none" stroke={accent} strokeWidth="1.5" />
                    <line x1="1018" y1="50" x2="1028" y2="50" stroke={accent} strokeWidth="1" />
                    <line x1="1018" y1="53" x2="1025" y2="53" stroke={accent} strokeWidth="1" />
                    <text x="1040" y="53" fill={accent} fontSize="8.5" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" letterSpacing="2.8">SALES PERFORMANCE</text>
                    <line x1="1011" y1="68" x2="1364" y2="68" stroke={dividerCol} strokeWidth="1" />

                    {/* Hero metric */}
                    <text x="1187" y="104" fill={textDim} fontSize="8.5" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="2">PEAK ANNUAL REVENUE</text>
                    <text x="1187" y="148" fill={textPrimary} fontSize="50" fontFamily="Montserrat,sans-serif"
                        fontWeight="700" textAnchor="middle" data-fade>$20M</text>
                    <rect x="1120" y="155" width="134" height="20" rx="10"
                        fill="rgba(98,175,239,0.08)" stroke={accentDim} strokeWidth="1" />
                    <text x="1187" y="169" fill={accent} fontSize="8.5" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="1" data-fade>↑ 567% GROWTH</text>
                    <line x1="1011" y1="186" x2="1364" y2="186" stroke={dividerCol} strokeWidth="1" />

                    {/* Bar chart */}
                    <text x="1011" y="206" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif" letterSpacing="1">
                        ANNUAL REVENUE 2018 – 2022
                    </text>
                    <line x1="1011" y1="390" x2="1364" y2="390" stroke={dividerCol} strokeWidth="1" />
                    {[0.25, 0.5, 0.75, 1].map((frac) => (
                        <line key={frac}
                            x1="1011" y1={390 - frac * 200}
                            x2="1364" y2={390 - frac * 200}
                            stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                    ))}

                    {revBarsData.map((bar, i) => (
                        <g key={i}>
                            {/* Glow halo */}
                            <rect x={bar.x - 2} y={bar.y - 2} width={barWidth + 4} height={bar.h + 2} rx="5"
                                fill={accent} opacity="0.06" />
                            {/* Main bar */}
                            <rect data-vbar x={bar.x} y={bar.y} width={barWidth} height={bar.h} rx="4"
                                fill="url(#barGrad)" />
                            {/* Top highlight cap */}
                            <rect x={bar.x + 4} y={bar.y + 2} width={barWidth - 8} height="4" rx="2"
                                fill="rgba(255,255,255,0.3)" data-fade />
                            {/* Year label */}
                            <text x={bar.x + barWidth / 2} y="407" fill={textDim} fontSize="9"
                                fontFamily="Montserrat,sans-serif" textAnchor="middle">{`'${bar.year}`}</text>
                            {/* Value label — larger */}
                            <text x={bar.x + barWidth / 2} y={bar.y - 8} fill={textSec} fontSize="12"
                                fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle" data-fade>{bar.label}</text>
                        </g>
                    ))}

                    {/* Close rate comparison */}
                    <line x1="1011" y1="422" x2="1364" y2="422" stroke={dividerCol} strokeWidth="1" />
                    <text x="1187" y="442" fill={textDim} fontSize="8" fontFamily="Montserrat,sans-serif"
                        textAnchor="middle" letterSpacing="1.5">CLOSE RATE IMPROVEMENT</text>
                    <text x="1085" y="474" fill="rgba(237,237,237,0.3)" fontSize="28"
                        fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle"
                        textDecoration="line-through">35%</text>
                    <text x="1156" y="478" fill={textDim} fontSize="22"
                        fontFamily="Montserrat,sans-serif" textAnchor="middle" data-fade>→</text>
                    <text x="1272" y="474" fill={accent} fontSize="28"
                        fontFamily="Montserrat,sans-serif" fontWeight="700" textAnchor="middle" data-fade>53%</text>
                    <text x="1085" y="489" fill={textDim} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle">baseline</text>
                    <text x="1272" y="489" fill={accent} fontSize="7.5" fontFamily="Montserrat,sans-serif" textAnchor="middle" data-fade>peak</text>

                </g>
            </svg>
        </div>
    );
}
