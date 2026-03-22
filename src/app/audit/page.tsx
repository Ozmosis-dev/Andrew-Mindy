"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Metadata } from "next";
import styles from "./page.module.scss";

// ─── Data ────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { n: "01", label: "Sales System", sub: '"How predictably does your team close?"' },
  { n: "02", label: "Brand Positioning", sub: '"Does your brand match who you\'ve become?"' },
  { n: "03", label: "Lead Operations", sub: '"How much manual work lives between lead and close?"' },
  { n: "04", label: "Internal Workflows", sub: '"Where is your team\'s time going that it shouldn\'t?"' },
  { n: "05", label: "Marketing Infrastructure", sub: '"Is your top-of-funnel predictable or random?"' },
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

type Screen = "questions" | "gate" | "results" | "success";

interface AuditResult {
  total_score: number;
  tier_label: string;
  tier_insight: string;
  cat_scores: number[];
  priority_idx: number;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

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
  const [screen, setScreen] = useState<Screen>("questions");
  const [catIdx, setCatIdx] = useState(0);
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

  function selectAnswer(qIdx: number, val: number) {
    setAnswers((prev) => ({ ...prev, [qIdx]: val }));
  }

  function nextCat() {
    if (catIdx < CATEGORIES.length - 1) {
      setCatIdx((c) => c + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setScreen("gate");
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

      <div className={styles.container}>
        <AnimatePresence mode="wait">

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
              <div className={styles.auditHeader}>
                <span className={styles.eyebrow}>The Scale Audit</span>
                <h1 className={styles.auditTitle}>
                  Where does your business actually stand?
                </h1>
                <p className={styles.auditSubtitle}>
                  24 questions across 6 systems. Takes about 4 minutes. You'll get a scored report emailed to you.
                </p>
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
                  {catQuestions.map((q, qi) => (
                    <div key={q.idx} className={styles.question}>
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
                    </div>
                  ))}
                </div>

                <div className={styles.catFooter}>
                  <button
                    className={styles.nextBtn}
                    onClick={nextCat}
                    disabled={!catAnswered}
                  >
                    {catIdx < CATEGORIES.length - 1
                      ? `Next: ${CATEGORIES[catIdx + 1].label}`
                      : "See My Results"}
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
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
    </main>
  );
}
