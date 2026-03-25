"use client";

import { useReducer, useRef } from "react";
import type {
  ServiceType,
  IntakeFormData,
  BrandData,
  WebData,
  AppData,
  RevOpsData,
} from "@/lib/intake-schema";
import {
  intakeSchema,
  flattenErrors,
  defaultBrand,
  defaultWeb,
  defaultApp,
  defaultRevOps,
} from "@/lib/intake-schema";
import ServiceSelector from "./ServiceSelector";
import BrandSection from "./BrandSection";
import WebSection from "./WebSection";
import AppSection from "./AppSection";
import RevOpsSection from "./RevOpsSection";
import RadioGroup from "./RadioGroup";
import SubmitButton from "./SubmitButton";
import styles from "./IntakeForm.module.scss";
import { useRouter } from "next/navigation";

// ─── State & Reducer ─────────────────────────────────────────────────────────

interface FormState {
  fields: IntakeFormData;
  touched: Record<string, boolean>;
  errors: Record<string, string>;
  submitting: boolean;
  submitted: boolean;
  submitError: string;
}

type Action =
  | { type: "FIELD"; path: string; value: unknown }
  | { type: "TOGGLE_SERVICE"; service: ServiceType }
  | { type: "TOUCH"; path: string }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_ERROR"; error: string };

const INITIAL_FIELDS: IntakeFormData = {
  name: "",
  email: "",
  company: "",
  role: "",
  website: "",
  services: [],
  situation: "",
  previousAttempts: "",
  decisionMaker: "",
  budget: "",
  timeline: "",
  anythingElse: "",
  honeypot: "",
  brand: defaultBrand,
  web: defaultWeb,
  app: defaultApp,
  revops: defaultRevOps,
};

const INITIAL_STATE: FormState = {
  fields: INITIAL_FIELDS,
  touched: {},
  errors: {},
  submitting: false,
  submitted: false,
  submitError: "",
};

function setNestedField(
  fields: IntakeFormData,
  path: string,
  value: unknown
): IntakeFormData {
  const parts = path.split(".");
  if (parts.length === 1) {
    return { ...fields, [parts[0]]: value };
  }
  const section = parts[0] as keyof IntakeFormData;
  return {
    ...fields,
    [section]: {
      ...(fields[section] as Record<string, unknown>),
      [parts[1]]: value,
    },
  };
}

function reducer(state: FormState, action: Action): FormState {
  switch (action.type) {
    case "FIELD":
      return {
        ...state,
        fields: setNestedField(state.fields, action.path, action.value),
      };

    case "TOGGLE_SERVICE": {
      const current = state.fields.services;
      const removing = current.includes(action.service);
      const next = removing
        ? current.filter((s) => s !== action.service)
        : [...current, action.service];
      // Clear section data when deselecting
      const cleared: Partial<IntakeFormData> = removing
        ? {
          brand:
            action.service === "brand" ? defaultBrand : state.fields.brand,
          web: action.service === "web" ? defaultWeb : state.fields.web,
          app: action.service === "app" ? defaultApp : state.fields.app,
          revops:
            action.service === "revops" ? defaultRevOps : state.fields.revops,
        }
        : {};
      return {
        ...state,
        fields: { ...state.fields, services: next, ...cleared },
      };
    }

    case "TOUCH":
      return { ...state, touched: { ...state.touched, [action.path]: true } };

    case "SET_ERRORS":
      return { ...state, errors: action.errors };

    case "SUBMIT_START":
      return { ...state, submitting: true, submitError: "" };

    case "SUBMIT_SUCCESS":
      return { ...state, submitting: false, submitted: true };

    case "SUBMIT_ERROR":
      return { ...state, submitting: false, submitError: action.error };

    default:
      return state;
  }
}

// ─── Progress ────────────────────────────────────────────────────────────────

function calcProgress(fields: IntakeFormData): number {
  const checks = [
    fields.name.trim() !== "",
    fields.email.trim() !== "",
    fields.services.length > 0,
    fields.budget !== "",
    fields.timeline !== "",
  ];
  return (checks.filter(Boolean).length / checks.length) * 100;
}

// ─── Validate & get errors for touched fields ─────────────────────────────────

function validateTouched(
  fields: IntakeFormData,
  touched: Record<string, boolean>
): Record<string, string> {
  const result = intakeSchema.safeParse(fields);
  if (result.success) return {};
  const all = flattenErrors(result.error);
  const filtered: Record<string, string> = {};
  for (const key of Object.keys(all)) {
    if (touched[key]) filtered[key] = all[key];
  }
  return filtered;
}

// ─── Component ───────────────────────────────────────────────────────────────

const BUDGET_OPTS = [
  { value: "u5", label: "Under $5k" },
  { value: "5-15", label: "$5k – $15k" },
  { value: "15-30", label: "$15k – $30k" },
  { value: "30-50", label: "$30k – $50k" },
  { value: "50p", label: "$50k+" },
  { value: "ns", label: "Not sure yet" },
];

const TIMELINE_OPTS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-3", label: "1–3 months" },
  { value: "3-6", label: "3–6 months" },
  { value: "flex", label: "Flexible — timing is open" },
];

const DECISION_MAKER_OPTS = [
  { value: "me", label: "Just me" },
  { value: "partner", label: "Me and a partner" },
  { value: "committee", label: "Committee / approval process" },
];

export default function IntakeForm({ header }: { header?: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { fields, touched, errors, submitting, submitted, submitError } = state;
  const router = useRouter();
  const brandRef = useRef<HTMLDivElement>(null);
  const webRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const revopsRef = useRef<HTMLDivElement>(null);

  const progress = calcProgress(fields);

  // ── Generic field dispatcher ──────────────────────────────────────────────
  function field(path: string, value: unknown) {
    dispatch({ type: "FIELD", path, value });
  }

  function touch(path: string) {
    dispatch({ type: "TOUCH", path });
    const updated = { ...touched, [path]: true };
    const errs = validateTouched(fields, updated);
    dispatch({ type: "SET_ERRORS", errors: errs });
  }

  // ── Service toggle ────────────────────────────────────────────────────────
  function handleServiceChange(services: ServiceType[]) {
    const prev = fields.services;
    const added = services.find((s) => !prev.includes(s));
    const removed = prev.find((s) => !services.includes(s));

    if (added) {
      dispatch({ type: "TOGGLE_SERVICE", service: added });
    } else if (removed) {
      dispatch({ type: "TOGGLE_SERVICE", service: removed });
    }
  }

  // ── Section change/blur helpers ───────────────────────────────────────────
  const brandHandlers = {
    onChange: (f: keyof BrandData, v: unknown) => field(`brand.${f}`, v),
    onBlur: (f: keyof BrandData) => touch(`brand.${f}`),
  };
  const webHandlers = {
    onChange: (f: keyof WebData, v: unknown) => field(`web.${f}`, v),
    onBlur: (f: keyof WebData) => touch(`web.${f}`),
  };
  const appHandlers = {
    onChange: (f: keyof AppData, v: unknown) => field(`app.${f}`, v),
    onBlur: (f: keyof AppData) => touch(`app.${f}`),
  };
  const revopsHandlers = {
    onChange: (f: keyof RevOpsData, v: unknown) => field(`revops.${f}`, v),
    onBlur: (f: keyof RevOpsData) => touch(`revops.${f}`),
  };

  // Filter errors to just a section's fields (strip prefix)
  function sectionErrors(prefix: string): Record<string, string> {
    const out: Record<string, string> = {};
    for (const [k, v] of Object.entries(errors)) {
      if (k.startsWith(`${prefix}.`)) out[k.slice(prefix.length + 1)] = v;
    }
    return out;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mark all fields touched to show all errors
    const allTouched: Record<string, boolean> = {};
    const allPaths = [
      "name",
      "email",
      "services",
      "situation",
      "budget",
      "timeline",
      "brand.businessDescription",
      "brand.customerDescription",
      "brand.competitors",
      "brand.personality",
      "web.primaryJob",
      "web.brokenAndCost",
      "app.coreFunction",
      "app.userType",
      "app.specStatus",
      "revops.brokenProcess",
      "revops.problemType",
      "revops.successAt90Days",
    ];
    for (const p of allPaths) allTouched[p] = true;

    const result = intakeSchema.safeParse(fields);
    if (!result.success) {
      const errs = flattenErrors(result.error);
      dispatch({ type: "SET_ERRORS", errors: errs });
      // Scroll to first error
      const firstErrPath = result.error.issues[0]?.path.join(".");
      if (firstErrPath) {
        const el = document.querySelector(
          `[aria-invalid='true'], [data-error-field='${firstErrPath}']`
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(body.error ?? "Submission failed");
      }
      dispatch({ type: "SUBMIT_SUCCESS" });
      router.push("/work-with-me/success");
    } catch (err) {
      dispatch({
        type: "SUBMIT_ERROR",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      {header}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        {/* Main Glassmorphic Container for General Questions */}
        <div className={styles.formCard}>
          {/* Progress bar */}
          <div className={styles.progressTrack} aria-hidden="true">
            <div
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Honeypot — hidden from real users */}
          <input
            type="text"
            name="website_confirm"
            value={fields.honeypot}
            onChange={(e) => field("honeypot", e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className={styles.honeypot}
            aria-hidden="true"
          />

          {/* ── Universal fields ─────────────────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="intake-name" className={styles.label}>
                  Name <span className={styles.required}>*</span>
                </label>
                <input
                  id="intake-name"
                  type="text"
                  className={styles.input}
                  value={fields.name}
                  onChange={(e) => field("name", e.target.value)}
                  onBlur={() => touch("name")}
                  placeholder="Your full name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : undefined}
                />
                {errors.name && (
                  <p id="name-err" className={styles.error} role="alert">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className={styles.field}>
                <label htmlFor="intake-email" className={styles.label}>
                  Email <span className={styles.required}>*</span>
                </label>
                <input
                  id="intake-email"
                  type="email"
                  className={styles.input}
                  value={fields.email}
                  onChange={(e) => field("email", e.target.value)}
                  onBlur={() => touch("email")}
                  placeholder="you@company.com"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-err" : undefined}
                />
                {errors.email && (
                  <p id="email-err" className={styles.error} role="alert">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            <div className={styles.grid2}>
              <div className={styles.field}>
                <label htmlFor="intake-company" className={styles.label}>
                  Company
                </label>
                <input
                  id="intake-company"
                  type="text"
                  className={styles.input}
                  value={fields.company}
                  onChange={(e) => field("company", e.target.value)}
                  placeholder="Company name"
                />
              </div>

              <div className={styles.field}>
                <label htmlFor="intake-role" className={styles.label}>
                  Your role
                </label>
                <input
                  id="intake-role"
                  type="text"
                  className={styles.input}
                  value={fields.role}
                  onChange={(e) => field("role", e.target.value)}
                  placeholder="CEO, Founder, Head of Marketing…"
                />
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="intake-website" className={styles.label}>
                Current website
              </label>
              <input
                id="intake-website"
                type="url"
                className={styles.input}
                value={fields.website}
                onChange={(e) => field("website", e.target.value)}
                placeholder="https://…"
              />
            </div>
          </div>

          {/* ── Service selection ─────────────────────────────────────────────── */}
          <div className={styles.section}>
            <p className={styles.sectionLabel}>
              What do you need? <span className={styles.required}>*</span>
            </p>
            <ServiceSelector
              value={fields.services}
              onChange={handleServiceChange}
              error={errors.services}
            />
          </div>

          {/* ── Situation ────────────────────────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="intake-situation" className={styles.label}>
                What&apos;s going on — in your own words?{" "}
                <span className={styles.required}>*</span>
              </label>
              <textarea
                id="intake-situation"
                className={styles.textarea}
                value={fields.situation}
                onChange={(e) => field("situation", e.target.value)}
                onBlur={() => touch("situation")}
                rows={5}
                placeholder="Context, urgency, what's not working, what you're trying to change"
                aria-required="true"
                aria-invalid={!!errors.situation}
                aria-describedby={
                  errors.situation ? "situation-err" : undefined
                }
              />
              {errors.situation && (
                <p id="situation-err" className={styles.error} role="alert">
                  {errors.situation}
                </p>
              )}
            </div>

            <div className={styles.field}>
              <label htmlFor="intake-prev" className={styles.label}>
                What&apos;s been tried before?
              </label>
              <textarea
                id="intake-prev"
                className={styles.textarea}
                value={fields.previousAttempts}
                onChange={(e) => field("previousAttempts", e.target.value)}
                placeholder="Agencies, freelancers, in-house attempts — what worked, what didn't"
              />
            </div>

            <div className={styles.field}>
              <p className={styles.label}>Who makes the final decision?</p>
              <RadioGroup
                name="decisionMaker"
                options={DECISION_MAKER_OPTS}
                value={fields.decisionMaker}
                onChange={(v) => field("decisionMaker", v)}
              />
            </div>
          </div>

          {/* ── Budget & Timeline ─────────────────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.grid2Responsive}>
              <div className={styles.field}>
                <p className={styles.label}>
                  Budget range <span className={styles.required}>*</span>
                </p>
                <RadioGroup
                  name="budget"
                  options={BUDGET_OPTS}
                  value={fields.budget}
                  onChange={(v) => field("budget", v)}
                  onBlur={() => touch("budget")}
                  required
                  error={errors.budget}
                />
              </div>

              <div className={styles.field}>
                <p className={styles.label}>
                  Timeline <span className={styles.required}>*</span>
                </p>
                <RadioGroup
                  name="timeline"
                  options={TIMELINE_OPTS}
                  value={fields.timeline}
                  onChange={(v) => field("timeline", v)}
                  onBlur={() => touch("timeline")}
                  required
                  error={errors.timeline}
                />
              </div>
            </div>
          </div>

          {/* ── Anything else ────────────────────────────────────────────────── */}
          <div className={styles.section}>
            <div className={styles.field}>
              <label htmlFor="intake-else" className={styles.label}>
                Anything else I should know?
              </label>
              <textarea
                id="intake-else"
                className={styles.textarea}
                value={fields.anythingElse}
                onChange={(e) => field("anythingElse", e.target.value)}
                placeholder="Constraints, stakeholders, hard requirements, context I'd find useful"
              />
            </div>
          </div>
        </div>

        {/* ── Conditional sections (Outside main card) ─────────────────────── */}
        {fields.services.includes("brand") && (
          <div ref={brandRef} className={styles.sectionCard}>
            <BrandSection
              data={fields.brand}
              errors={sectionErrors("brand")}
              onChange={brandHandlers.onChange}
              onBlur={brandHandlers.onBlur}
            />
          </div>
        )}

        {fields.services.includes("web") && (
          <div ref={webRef} className={styles.sectionCard}>
            <WebSection
              data={fields.web}
              errors={sectionErrors("web")}
              onChange={webHandlers.onChange}
              onBlur={webHandlers.onBlur}
            />
          </div>
        )}

        {fields.services.includes("app") && (
          <div ref={appRef} className={styles.sectionCard}>
            <AppSection
              data={fields.app}
              errors={sectionErrors("app")}
              onChange={appHandlers.onChange}
              onBlur={appHandlers.onBlur}
            />
          </div>
        )}

        {fields.services.includes("revops") && (
          <div ref={revopsRef} className={styles.sectionCard}>
            <RevOpsSection
              data={fields.revops}
              errors={sectionErrors("revops")}
              onChange={revopsHandlers.onChange}
              onBlur={revopsHandlers.onBlur}
            />
          </div>
        )}

        {/* ── Submit (Aligned with full layout) ────────────────────────────── */}
        <div className={styles.submitWrap}>
          {submitError && (
            <p className={styles.submitError} role="alert">
              {submitError}
            </p>
          )}
          <SubmitButton submitting={submitting} />
        </div>
      </form>
    </>
  );
}
