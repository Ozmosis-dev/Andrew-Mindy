"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Metadata } from "next";
import styles from "./page.module.scss";
import ExpandableFooter from "../../components/ExpandableFooter";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { n: "01", label: "Sales System", sub: '"How predictably does your team close?"' },
  { n: "02", label: "Brand Positioning", sub: '"Does your brand match who you\'ve become?"' },
  { n: "03", label: "Lead Operations", sub: '"How much manual work lives between lead and close?"' },
  { n: "04", label: "Internal Workflows", sub: '"Where is your team\'s time going that it shouldn\'t?"' },
  { n: "05", label: "Marketing", sub: '"Is your top-of-funnel predictable or random?"' },
  { n: "06", label: "Growth Readiness", sub: '"Can your current setup handle 2x without breaking?"' },
];

const QUESTIONS = [
  { c: 0, t: "If your top salesperson left tomorrow, how confident are you your close rate would hold?", o: ["Not at all — they're carrying the team", "Somewhat — some process exists but it's not documented", "Fairly confident — we have a defined process", "Very confident — our system produces results regardless of who runs it"] },
  { c: 0, t: "How do new salespeople learn to sell your product or service?", o: ["Trial and error and observation", "Informal coaching, no real curriculum", "Defined onboarding process with materials", "Structured training system with measurable milestones"] },
  { c: 0, t: "How would you describe your close rate tracking?", o: ["I don't track it consistently", "I track it but it varies a lot", "I track it and it's fairly stable", "I track it, it's stable, and I actively optimize it"] },
  { c: 0, t: "Do you have documented objection handling and deal structure?", o: ["No — lives in people's heads", "Partially — some things are written down", "Yes — documented approaches exist", "Yes — and we train and refine them regularly"] },
  { c: 1, t: "When a qualified prospect visits your website, how well does it reflect your current capabilities?", o: ["Outdated — we've grown past it", "Okay but doesn't fully represent us", "Decent and mostly accurate", "Strong representation of who we are now"] },
  { c: 1, t: "How consistent is your brand across touchpoints — website, proposals, presentations?", o: ["Inconsistent — looks like different companies", "Somewhat consistent but execution varies", "Mostly consistent — standards exist", "Very consistent — everything looks and sounds like us"] },
  { c: 1, t: "When you show prospects your brand materials, how do you feel?", o: ["Embarrassed — doesn't reflect our quality", "Neutral — functional but not impressive", "Reasonably confident", "Proud — our materials win before we pitch"] },
  { c: 1, t: "How clearly differentiated are you from your closest competitors?", o: ["We look and sound a lot like them", "We have differences but they're hard to articulate", "Clear POV, not always communicated well", "Positioning is sharp and immediately obvious"] },
  { c: 2, t: "When a new lead comes in, how quickly do they receive a meaningful response?", o: ["Hours to days — it's inconsistent", "Same day usually, but manually", "We have a defined SLA and usually hit it", "Automated and immediate, with human follow-up layered in"] },
  { c: 2, t: "How do you currently track and manage your pipeline?", o: ["Spreadsheets or nothing", "Basic CRM, not consistently used", "CRM used consistently with defined stages", "CRM with automation, reporting, and accountability"] },
  { c: 2, t: "How much time does your team spend per week on manual lead tasks that could be automated?", o: ["10+ hours/week — it's a real drain", "5–10 hours/week", "2–5 hours/week", "Under 2 hours — mostly automated"] },
  { c: 2, t: "How often do leads fall through the cracks?", o: ["Regularly — we're losing deals we shouldn't", "Sometimes — we try but it's not airtight", "Rarely — we have decent coverage", "Almost never — the system catches everything"] },
  { c: 3, t: "How much of your team's day goes to tasks that feel repetitive or beneath their role?", o: ["A lot — morale and efficiency issue", "Some — tried to fix but haven't fully", "Not much — automated or delegated", "Almost none — everyone's doing high-leverage work"] },
  { c: 3, t: "How documented are your core operational processes?", o: ["They live in people's heads", "Some written down, inconsistently", "Most core processes documented", "Fully documented, reviewed, and actually used"] },
  { c: 3, t: "When a key team member is out, how does the work get done?", o: ["It mostly doesn't — we scramble", "Someone figures it out with a lot of questions", "Some coverage but gaps exist", "Anyone can step in — the process is clear"] },
  { c: 3, t: "How would you rate the efficiency of your internal operations?", o: ["Constantly fighting fires — reactive", "Functional but lots of friction", "Fairly efficient with known bottlenecks", "Optimized — ops give us a competitive edge"] },
  { c: 4, t: "How would you describe your current lead generation?", o: ["Mostly referrals — unpredictable", "Some channels but inconsistent", "2–3 reliable channels with decent consistency", "Documented multi-channel system with predictable output"] },
  { c: 4, t: "Do you know which marketing activities are actually driving revenue?", o: ["No — we don't track it", "Somewhat — sense but not hard data", "Yes for most channels", "Yes precisely — we have attribution and optimize it"] },
  { c: 4, t: "How much of your marketing is \"set and running\" vs. requiring active effort each week?", o: ["Almost all requires weekly effort", "Mostly active — little automated", "Some automation, still mostly active", "Significant automation — system works without us"] },
  { c: 4, t: "How would you describe your content and messaging consistency?", o: ["We post when we remember", "Some consistency but no cadence", "Defined cadence we mostly stick to", "Documented strategy with consistent cross-channel execution"] },
  { c: 5, t: "If revenue doubled in the next 12 months, what would break first?", o: ["Multiple things — serious problems", "2–3 specific things I'm already worried about", "One or two, but manageable", "Nothing significant — we've built for it"] },
  { c: 5, t: "How confident are you in your ability to onboard new team members quickly?", o: ["Not confident — slow and inconsistent", "Somewhat — process exists but needs work", "Fairly confident — onboarding works well", "Very confident — new people productive fast"] },
  { c: 5, t: "How aligned is your brand, web, and marketing with where you're going in 2 years?", o: ["Misaligned — need to rebuild", "Partially — significant work needed", "Mostly — some updates, foundation solid", "Fully aligned — built for where we're going"] },
  { c: 5, t: "Overall, how in control do you feel of your growth trajectory?", o: ["Reactive — growth happens to us", "Somewhat in control — some intentional wins", "Mostly in control with clear areas to address", "In control — we have a system and we're executing"] },
];

// ─── Priority insights (per category) ───────────────────────────────────────

const PRIORITY_INSIGHTS = [
  "The highest-ROI fix available to most growth-stage companies is a documented, trainable sales system. A 10-point improvement in close rate — achievable in 90 days with the right process — compounds across every rep you ever hire.",
  "Brand is the silent variable in every sales conversation. A brand that accurately represents your capability removes objections before they're raised and attracts clients who are already pre-sold on the quality of your work.",
  "Lead operations are where most companies leak the most invisible revenue. The deals you didn't close because the follow-up didn't happen don't show up in any report — but they're real, and the cost compounds monthly.",
  "Every process that lives in someone's head is a growth ceiling. Systematizing operations isn't overhead — it's the infrastructure that lets revenue scale without proportionally scaling stress.",
  "Predictable revenue starts with predictable marketing. The shift from 'doing marketing' to 'running a marketing system' is what separates companies that grow reactively from those that grow by design.",
  "The best time to build for scale is before you need it. The constraints you're tolerating today will become the crises you're managing at 2x. Addressing them now is the leverage play.",
];

// ─── Types ───────────────────────────────────────────────────────────────────

type Screen = "landing" | "onboarding-1" | "onboarding-2" | "questions" | "gate" | "results" | "success";

interface AuditResult {
  total_score: number;
  tier_label: string;
  tier_insight: string;
  cat_scores: number[];
  priority_idx: number;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -16,
    transition: { duration: 0.3 },
  },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

const hexNodeVariants = {
  hidden: { opacity: 0, x: "-50%", y: "-30%" },
  show: {
    opacity: 1,
    x: "-50%",
    y: "-50%",
    transition: { duration: 0.8, ease: "easeOut" as const },
  },
};

// ─── Previous SVG Animation Concept (Preserved) ──────────────────────────────
function DecorativeBackgroundOld() {
  return (
    <div className={styles.svgAnimWrap}>
      <svg
        className={styles.aestheticSvg}
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="growth-grad-main" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="growth-grad-soft" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.1" />
            <stop offset="70%" stopColor="var(--accent)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g>
          {/* Main exponential growth curve 1 */}
          <path fill="none" stroke="url(#growth-grad-main)" strokeWidth="12" opacity="0.15">
            <animate attributeName="d" dur="20s" repeatCount="indefinite" values="
              M -100,800 C 300,700 500,300 1500,-100;
              M -100,800 C 400,800 600,100 1500,-100;
              M -100,800 C 300,700 500,300 1500,-100
            " />
          </path>
          <path fill="none" stroke="url(#growth-grad-main)" strokeWidth="2" opacity="0.8">
            <animate attributeName="d" dur="20s" repeatCount="indefinite" values="
              M -100,800 C 300,700 500,300 1500,-100;
              M -100,800 C 400,800 600,100 1500,-100;
              M -100,800 C 300,700 500,300 1500,-100
            " />
          </path>

          {/* Secondary growth curve */}
          <path fill="none" stroke="url(#growth-grad-soft)" strokeWidth="14" opacity="0.15">
            <animate attributeName="d" dur="15s" repeatCount="indefinite" values="
              M -200,900 C 200,800 600,400 1600,0;
              M -200,900 C 300,600 700,200 1600,0;
              M -200,900 C 200,800 600,400 1600,0
            " />
          </path>
          <path fill="none" stroke="url(#growth-grad-soft)" strokeWidth="2" opacity="0.9">
            <animate attributeName="d" dur="15s" repeatCount="indefinite" values="
              M -200,900 C 200,800 600,400 1600,0;
              M -200,900 C 300,600 700,200 1600,0;
              M -200,900 C 200,800 600,400 1600,0
            " />
          </path>

          {/* Third intersecting growth wave */}
          <path fill="none" stroke="url(#growth-grad-main)" strokeWidth="1.5" opacity="0.6">
            <animate attributeName="d" dur="25s" repeatCount="indefinite" values="
              M 0,900 C 100,600 800,500 1400,100;
              M 0,900 C 200,700 900,300 1400,100;
              M 0,900 C 100,600 800,500 1400,100
            " />
          </path>

          {/* Fourth abstract geometric accent */}
          <path fill="none" stroke="url(#growth-grad-soft)" strokeWidth="1.5" opacity="0.7" strokeDasharray="8 12">
            <animate attributeName="d" dur="30s" repeatCount="indefinite" values="
              M -50,750 C 400,750 450,250 1500,50;
              M -50,750 C 350,600 550,150 1500,50;
              M -50,750 C 400,750 450,250 1500,50
            " />
          </path>

          {/* Glowing ascendant orbs representing nodes of growth */}
          <circle cx="20%" cy="70%" r="4" fill="var(--accent)" opacity="0">
            <animate attributeName="cy" values="70%; 20%; 70%" dur="22s" repeatCount="indefinite" />
            <animate attributeName="cx" values="20%; 60%; 20%" dur="22s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2; 0.8; 0.2" dur="22s" repeatCount="indefinite" />
          </circle>

          <circle cx="80%" cy="80%" r="6" fill="var(--accent)" opacity="0">
            <animate attributeName="cy" values="80%; 10%; 80%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cx" values="80%; 90%; 80%" dur="18s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0; 1; 0" dur="18s" repeatCount="indefinite" />
          </circle>

          <circle cx="40%" cy="90%" r="3" fill="var(--accent)" opacity="0">
            <animate attributeName="cy" values="90%; 30%; 90%" dur="26s" repeatCount="indefinite" />
            <animate attributeName="cx" values="40%; 50%; 40%" dur="26s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.1; 0.6; 0.1" dur="26s" repeatCount="indefinite" />
          </circle>
        </g>
      </svg>
    </div>
  );
}

// ─── New SVG Animation Concept: Funneling Growth Nodes ─────────────────────
function DecorativeBackground() {
  return (
    <motion.div
      className={styles.svgAnimWrap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.8 } }}
      exit={{ opacity: 0, y: -150, transition: { duration: 0.6, ease: [0.32, 0, 0.67, 0] } }}
    >
      <svg
        className={styles.aestheticSvg}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="funnel-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="15%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g stroke="url(#funnel-grad)" fill="none" strokeWidth="1.5" strokeLinecap="round">
          {/* Reversed funnel lines acting like a tractor beam from bottom to top (x=720, y=100) */}
          <path id="f1" d="M -100,1000 C 300,1000 680,700 720,100" />
          <path id="f2" d="M 200,1000 C 400,1000 700,700 720,100" />
          <path id="f3" d="M 500,1000 C 600,1000 710,700 720,100" />
          <path id="f4" d="M 940,1000 C 840,1000 730,700 720,100" />
          <path id="f5" d="M 1240,1000 C 1040,1000 740,700 720,100" />
          <path id="f6" d="M 1540,1000 C 1140,1000 760,700 720,100" />

          <path id="f7" d="M -200,700 C 200,700 650,550 720,100" />
          <path id="f8" d="M 1640,700 C 1240,700 790,550 720,100" />

          <path id="f9" d="M -100,400 C 300,400 600,350 720,100" />
          <path id="f10" d="M 1540,400 C 1140,400 840,350 720,100" />

          <path id="f11" d="M 350,1000 C 450,1000 700,700 720,100" />
          <path id="f12" d="M 1090,1000 C 990,1000 740,700 720,100" />
        </g>

        {/* Nodes running down the funnel slowly */}
        <g fill="var(--accent)" filter="drop-shadow(0px 0px 4px var(--accent))">
          {[
            { id: "f1", r: 4, d: "14s", b: "0s", op: 0.8 },
            { id: "f1", r: 3, d: "18s", b: "2.5s", op: 0.5 },
            { id: "f2", r: 5, d: "12s", b: "1s", op: 0.9 },
            { id: "f3", r: 4, d: "15s", b: "0.5s", op: 0.7 },
            { id: "f4", r: 4, d: "14s", b: "1.5s", op: 0.8 },
            { id: "f5", r: 5, d: "13s", b: "0.2s", op: 0.9 },
            { id: "f6", r: 4, d: "16s", b: "1s", op: 0.6 },
            { id: "f7", r: 3, d: "17s", b: "0s", op: 0.7 },
            { id: "f8", r: 3, d: "15s", b: "2s", op: 0.8 },
            { id: "f9", r: 2, d: "11s", b: "1s", op: 0.5 },
            { id: "f10", r: 2, d: "12s", b: "0.5s", op: 0.6 },
            { id: "f11", r: 4, d: "13s", b: "0.8s", op: 0.85 },
            { id: "f12", r: 3, d: "14s", b: "0.3s", op: 0.75 },
          ].map((ball, i) => (
            <circle key={i} r={ball.r} opacity="0">
              <animateMotion dur={ball.d} repeatCount="indefinite" begin={ball.b}>
                <mpath href={`#${ball.id}`} />
              </animateMotion>
              <animate
                attributeName="opacity"
                values={`0; ${ball.op * 0.5}; ${ball.op}; 0`}
                keyTimes="0; 0.3; 0.97; 1"
                dur={ball.d}
                repeatCount="indefinite"
                begin={ball.b}
              />
            </circle>
          ))}
        </g>
      </svg>
    </motion.div>
  );
}

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <div className={styles.progressDots}>
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`${styles.dot} ${i < current ? styles.dotDone : ""} ${i === current ? styles.dotActive : ""}`}
        />
      ))}
    </div>
  );
}

function ScoreBar({ label, score, isWorst }: { label: string; score: number; isWorst: boolean }) {
  const pct = Math.round((score / 16) * 100);
  return (
    <div className={`${styles.scoreBar} ${isWorst ? styles.scoreBarWorst : ""}`}>
      <div className={styles.scoreBarHeader}>
        <span className={styles.scoreBarLabel}>{label}</span>
        <span className={styles.scoreBarValue}>{score}/16</span>
      </div>
      <div className={styles.scoreBarTrack}>
        <motion.div
          className={styles.scoreBarFill}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.1 }}
        />
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuditPage() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [catIdx, setCatIdx] = useState(0);
  const [qIdxInCat, setQIdxInCat] = useState(0);
  // answers indexed by question index (0-23), value 1-4
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [error, setError] = useState("");
  // contact form
  const [contactMsg, setContactMsg] = useState("");
  const [contactSending, setContactSending] = useState(false);

  const catQuestions = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter((q) => q.c === catIdx);
  const catAnswered = catQuestions.every((q) => answers[q.idx] !== undefined);
  const allAnswered = QUESTIONS.every((_, i) => answers[i] !== undefined);
  const answeredCount = Object.keys(answers).length;

  function nextCat() {
    if (catIdx < CATEGORIES.length - 1) {
      setCatIdx((c) => c + 1);
      setQIdxInCat(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("gate");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function selectAnswer(qIdx: number, val: number) {
    setAnswers((prev) => ({ ...prev, [qIdx]: val }));

    // Auto advance after a brief pause so user sees their selection
    // Note: We only auto-advance within the same category.
    if (qIdxInCat < catQuestions.length - 1) {
      setTimeout(() => {
        setQIdxInCat((prev) => prev + 1);
      }, 400);
    }
  }

  function prevQuestion() {
    if (qIdxInCat > 0) {
      setQIdxInCat((prev) => prev - 1);
    } else if (catIdx > 0) {
      setCatIdx((c) => c - 1);
      setQIdxInCat(QUESTIONS.filter((q) => q.c === catIdx - 1).length - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  async function submitAudit() {
    if (!email) return;
    setLoading(true);
    setError("");
    try {
      const answersArr = QUESTIONS.map((_, i) => answers[i] ?? 1);
      const res = await fetch("/api/audit-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, answers: answersArr }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setResult(data.result);
      setScreen("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setContactSending(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message: contactMsg }),
      });
      setScreen("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setContactSending(false);
    }
  }

  return (
    <main className={styles.page}>
      {/* Background glow */}
      <div className={styles.bgGlow} aria-hidden="true" />

      {/* Persistent Backgrounds */}
      <div className={styles.waveContainer}>
        <img
          src="/images/Black-wave.jpg"
          alt=""
          className={styles.waveImage}
        />
      </div>

      <div className={styles.container}>
        <AnimatePresence mode="wait">

          {/* ─── LANDING PAGE ─────────────────────────────────────────── */}
          {screen === "landing" && <DecorativeBackground key="decor" />}

          {screen === "landing" && (
            <motion.div
              key="landing"
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              exit="exit"
              className={styles.landingWrap}
            >
              <motion.div className={styles.landingHeader} variants={fadeUpItem}>
                <span className={styles.eyebrow}>Free Growth Brief</span>
                <h1 className={styles.landingTitle}>
                  Stop guessing.<br />
                  <span className={styles.blueText}>Start growing.</span>
                </h1>
                <p className={styles.landingSubtext}>
                  Most founders can't see their own bottlenecks. The Scale Audit is a 24-question
                  diagnostic across 6 core systems. Takes about 4 minutes. You get a custom, scored
                  Growth Brief showing exactly what to fix first.
                </p>
              </motion.div>

              <motion.div className={styles.landingBenefits} variants={fadeUpItem}>
                <motion.div
                  className={styles.benefitItem}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div
                    className={styles.benefitIcon}
                    variants={{
                      rest: { scale: 1, rotate: 0, backgroundColor: "rgba(98, 175, 239, 0.1)" },
                      hover: { scale: 1.1, rotate: 5, backgroundColor: "rgba(98, 175, 239, 0.2)" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className={styles.benefitTitle}>Identify Friction</h3>
                    <p className={styles.benefitText}>Find exactly where you're losing revenue in your sales and marketing systems.</p>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.benefitItem}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div
                    className={styles.benefitIcon}
                    variants={{
                      rest: { scale: 1, rotate: 0, backgroundColor: "rgba(98, 175, 239, 0.1)" },
                      hover: { scale: 1.1, rotate: -5, backgroundColor: "rgba(98, 175, 239, 0.2)" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 20v-6M6 20V10M18 20V4"></path>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className={styles.benefitTitle}>Get Scored</h3>
                    <p className={styles.benefitText}>See how your internal operations and readiness stack up out of 96 possible points.</p>
                  </div>
                </motion.div>
                <motion.div
                  className={styles.benefitItem}
                  whileHover="hover"
                  initial="rest"
                  animate="rest"
                >
                  <motion.div
                    className={styles.benefitIcon}
                    variants={{
                      rest: { scale: 1, rotate: 0, backgroundColor: "rgba(98, 175, 239, 0.1)" },
                      hover: { scale: 1.1, rotate: 5, backgroundColor: "rgba(98, 175, 239, 0.2)" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </motion.div>
                  <div>
                    <h3 className={styles.benefitTitle}>Actionable Priorities</h3>
                    <p className={styles.benefitText}>Receive a personalized PDF report highlighting your highest-leverage next move.</p>
                  </div>
                </motion.div>
              </motion.div>

              <motion.div className={styles.landingAction} variants={fadeUpItem}>
                <button
                  className={styles.startBtn}
                  onClick={() => {
                    setScreen("onboarding-1");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className={styles.btnContent}>Start The Audit</span>
                  <span className={styles.btnIcon}>→</span>
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* ─── ONBOARDING 1 ─────────────────────────────────────────── */}
          {screen === "onboarding-1" && (
            <motion.div
              key="onboarding-1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={styles.onboardingWrap}
            >
              <div className={styles.minimalHeader}>
                <span className={styles.eyebrow}>The Growth Brief</span>
              </div>
              <div className={styles.onboardingCard}>
                <h2 className={styles.onboardingTitle}>The framework</h2>

                <p className={styles.onboardingText}>
                  We'll evaluate 6 core systems:
                </p>

                <motion.div
                  className={styles.frameworkHexagon}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="show"
                >
                  <svg className={styles.hexTrackSvg} viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="hexGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.05" />
                      </linearGradient>
                    </defs>
                    <polygon
                      points="50,15 80.31,32.5 80.31,67.5 50,85 19.69,67.5 19.69,32.5"
                      className={styles.hexPolygon}
                    />
                    <polygon
                      points="50,15 80.31,32.5 80.31,67.5 50,85 19.69,67.5 19.69,32.5"
                      className={styles.hexDash}
                    />
                  </svg>

                  {CATEGORIES.map((cat, i) => (
                    <motion.div
                      key={cat.n}
                      className={`${styles.hexNode} ${styles[`pos${i}`]}`}
                      variants={hexNodeVariants}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={styles.hexNum}>{cat.n}</div>
                      <div className={styles.hexLabel}>{cat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>

                <button
                  className={styles.continueBtn}
                  onClick={() => {
                    setScreen("onboarding-2");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className={styles.btnContent}>Continue</span>
                  <span className={styles.btnIcon}>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── ONBOARDING 2 ─────────────────────────────────────────── */}
          {screen === "onboarding-2" && (
            <motion.div
              key="onboarding-2"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={styles.onboardingWrap}
            >
              <div className={styles.minimalHeader}>
                <span className={styles.eyebrow}>The Growth Brief</span>
              </div>
              <div className={styles.onboardingCard}>
                <h2 className={styles.onboardingTitle}>What to expect</h2>
                <p className={styles.onboardingText}>
                  This takes exactly 4 minutes. Answer honestly—no one else will see your raw answers.
                </p>

                <div className={styles.expectList}>
                  <div className={styles.expectItem}>
                    <div className={styles.expectIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                      </svg>
                    </div>
                    <div className={styles.expectContent}>
                      <h4>Detailed Brief</h4>
                      <p>A comprehensive breakdown of your 6 core systems</p>
                    </div>
                  </div>

                  <div className={styles.expectItem}>
                    <div className={styles.expectIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="6"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                      </svg>
                    </div>
                    <div className={styles.expectContent}>
                      <h4>Quantified Score</h4>
                      <p>See exactly where you stand against growth benchmarks</p>
                    </div>
                  </div>

                  <div className={styles.expectItem}>
                    <div className={styles.expectIcon}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                      </svg>
                    </div>
                    <div className={styles.expectContent}>
                      <h4>Leverage Insights</h4>
                      <p>Identify the single highest-ROI next move for scale</p>
                    </div>
                  </div>
                </div>

                <button
                  className={styles.continueBtn}
                  onClick={() => {
                    setScreen("questions");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <span className={styles.btnContent}>Begin your analysis</span>
                  <span className={styles.btnIcon}>→</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── QUESTIONS ──────────────────────────────────────────── */}
          {screen === "questions" && (
            <motion.div
              key={`cat-${catIdx}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Header */}
              <div className={styles.minimalHeader}>
                <span className={styles.eyebrow}>The Growth Brief</span>
              </div>

              {/* Progress */}
              <div className={styles.progressRow}>
                <ProgressDots current={catIdx} total={CATEGORIES.length} />
                <span className={styles.progressLabel}>
                  {answeredCount}/24 answered
                </span>
              </div>

              {/* Category card */}
              <div className={styles.catCard}>
                <div className={styles.catCardHeader}>
                  <span className={styles.catNum}>{CATEGORIES[catIdx].n}</span>
                  <div>
                    <h2 className={styles.catLabel}>{CATEGORIES[catIdx].label}</h2>
                    <p className={styles.catSub}>{CATEGORIES[catIdx].sub}</p>
                  </div>
                </div>

                <div className={styles.questions}>
                  <AnimatePresence mode="wait">
                    {catQuestions.map((q, qi) => {
                      if (qi !== qIdxInCat) return null;
                      return (
                        <motion.div
                          key={q.idx}
                          className={styles.question}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -15 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                        >
                          <p className={styles.questionText}>
                            <span className={styles.questionNum}>{qi + 1}.</span> {q.t}
                          </p>
                          <div className={styles.options}>
                            {q.o.map((opt, oi) => (
                              <button
                                key={oi}
                                className={`${styles.option} ${answers[q.idx] === oi + 1 ? styles.optionSelected : ""}`}
                                onClick={() => selectAnswer(q.idx, oi + 1)}
                              >
                                <span className={styles.optionLetter}>
                                  {String.fromCharCode(65 + oi)}
                                </span>
                                <span className={styles.optionText}>{opt}</span>
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                <div className={styles.catFooter}>
                  <button
                    className={styles.backBtn}
                    onClick={prevQuestion}
                    disabled={catIdx === 0 && qIdxInCat === 0}
                    style={{ visibility: catIdx === 0 && qIdxInCat === 0 ? "hidden" : "visible" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: "rotate(180deg)" }}>
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Back
                  </button>
                  {qIdxInCat === catQuestions.length - 1 && (
                    <button
                      className={styles.nextBtn}
                      onClick={nextCat}
                      disabled={answers[catQuestions[qIdxInCat].idx] === undefined}
                    >
                      {catIdx < CATEGORIES.length - 1
                        ? `Next: ${CATEGORIES[catIdx + 1].label}`
                        : "See My Results"}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── EMAIL GATE ─────────────────────────────────────────── */}
          {screen === "gate" && (
            <motion.div
              key="gate"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className={styles.gateWrap}
            >
              <div className={styles.gateCard}>
                <span className={styles.eyebrow}>Almost there</span>
                <h2 className={styles.gateTitle}>Where should we send your results?</h2>
                <p className={styles.gateSubtext}>
                  Your personalized audit report — including a priority focus and PDF breakdown — will be emailed to you instantly.
                </p>

                <div className={styles.gateForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="gate-name">Name <span className={styles.optional}>(optional)</span></label>
                    <input
                      id="gate-name"
                      type="text"
                      placeholder="Alex Johnson"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label htmlFor="gate-email">Email <span className={styles.required}>*</span></label>
                    <input
                      id="gate-email"
                      type="email"
                      placeholder="alex@yourcompany.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {error && <p className={styles.errorMsg}>{error}</p>}

                  <button
                    className={styles.submitBtn}
                    onClick={submitAudit}
                    disabled={!email || loading}
                  >
                    <span className={styles.btnContent}>
                      {loading ? "Generating your report…" : "Get My Results"}
                    </span>
                    {!loading && (
                      <span className={styles.btnIcon}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>

                  {loading && (
                    <p className={styles.loadingNote}>
                      Scoring your answers and generating your Growth Brief… this takes a few seconds.
                    </p>
                  )}

                  <p className={styles.gatePrivacy}>
                    Your Growth Brief is emailed once — no follow-up unless you reach out.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── RESULTS ────────────────────────────────────────────── */}
          {screen === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Score hero */}
              <div className={styles.resultsHeader}>
                <span className={styles.eyebrow}>Your Growth Brief</span>
                <div className={styles.scoreBig}>
                  <span className={styles.scoreNum}>{result.total_score}</span>
                  <span className={styles.scoreMax}>/96</span>
                </div>
                <p className={styles.tierLabel}>{result.tier_label}</p>
                <p className={styles.tierInsight}>{result.tier_insight}</p>
              </div>

              {/* Category breakdown */}
              <div className={styles.breakdown}>
                <h3 className={styles.breakdownTitle}>Category Breakdown</h3>
                <div className={styles.scoreBars}>
                  {CATEGORIES.map((cat, i) => (
                    <ScoreBar
                      key={i}
                      label={cat.label}
                      score={result.cat_scores[i] ?? 0}
                      isWorst={i === result.priority_idx}
                    />
                  ))}
                </div>
              </div>

              {/* Priority box */}
              <div className={styles.priorityBox}>
                <span className={styles.priorityEyebrow}>Priority Focus</span>
                <h3 className={styles.priorityTitle}>
                  {CATEGORIES[result.priority_idx]?.label}
                </h3>
                <p className={styles.priorityText}>
                  {PRIORITY_INSIGHTS[result.priority_idx]}
                </p>
                <a
                  href="https://calendly.com/andrewmindy-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.calendlyBtn}
                >
                  Book a Free 30-Min Strategy Call →
                </a>
              </div>

              {/* Contact form */}
              <div className={styles.contactWrap}>
                <div className={styles.contactCard}>
                  <span className={styles.eyebrow}>Let's Talk</span>
                  <h3 className={styles.contactTitle}>Want to walk through your results together?</h3>
                  <p className={styles.contactSubtext}>
                    I do a free 30-minute call for everyone who completes the brief. No pitch — just a clear look at your highest-leverage next move.
                  </p>
                  <form onSubmit={submitContact} className={styles.contactForm}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="c-message">Message</label>
                      <textarea
                        id="c-message"
                        placeholder="What stood out to you in the results? What are you currently working on…"
                        value={contactMsg}
                        onChange={(e) => setContactMsg(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={contactSending}
                    >
                      <span className={styles.btnContent}>
                        {contactSending ? "Sending…" : "Send Message"}
                      </span>
                      <span className={styles.btnIcon}>→</span>
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── CONTACT SUCCESS ─────────────────────────────────────── */}
          {screen === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className={styles.successWrap}
            >
              <div className={styles.successCard}>
                <div className={styles.successIcon}>
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="15" stroke="#62AFEF" strokeWidth="1.5" />
                    <path d="M10 16l4 4 8-8" stroke="#62AFEF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className={styles.successTitle}>Message Sent</h2>
                <p className={styles.successText}>
                  Thanks — I'll read your results and get back to you directly.
                </p>
                <a
                  href="https://calendly.com/andrewmindy-info/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.calendlyBtn}
                >
                  Or book a call directly →
                </a>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ─── EXPANDABLE FOOTER ─────────────────────────────────────── */}
      <ExpandableFooter />
    </main>
  );
}
