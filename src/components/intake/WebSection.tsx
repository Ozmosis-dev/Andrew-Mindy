'use client'

import type { WebData } from '@/lib/intake-schema'
import RadioGroup from './RadioGroup'
import styles from './section.module.scss'

interface WebSectionProps {
  data: WebData
  errors: Record<string, string>
  onChange: (field: keyof WebData, value: unknown) => void
  onBlur: (field: keyof WebData) => void
}

const CURRENT_SITE_OPTS = [
  { value: 'none',    label: 'No site yet — building from scratch' },
  { value: 'rebuild', label: 'Full rebuild — keeping the domain, not the design' },
  { value: 'update',  label: 'Significant update to existing site' },
]

const PRIMARY_JOB_OPTS = [
  { value: 'leads',   label: 'Generate leads / book calls' },
  { value: 'cred',    label: 'Establish credibility with warm prospects' },
  { value: 'convert', label: 'Convert visitors who already know us' },
  { value: 'launch',  label: 'Launch a new product or service' },
]

const TECH_PREF_OPTS = [
  { value: 'cms',    label: 'CMS-based (Webflow, Framer, WordPress)' },
  { value: 'custom', label: 'Custom-coded (Next.js, React)' },
  { value: 'open',   label: 'Open to recommendation' },
]

const COPY_STATUS_OPTS = [
  { value: 'ready', label: 'Ready — copy is written and approved' },
  { value: 'rough', label: 'Rough — drafts exist, need polish' },
  { value: 'none',  label: 'None — needs to be created from scratch' },
]

const POST_LAUNCH_OPTS = [
  { value: 'internal', label: 'Internal team will manage it' },
  { value: 'dev',      label: 'Contracted developer' },
  { value: 'ongoing',  label: 'Ongoing support from you' },
  { value: 'tbd',      label: 'Not yet decided' },
]

export default function WebSection({ data, errors, onChange, onBlur }: WebSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Website Design & Development</span>
        <span className={styles.sectionTitle}>Tell me about your website project</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Current site situation</label>
        <RadioGroup
          name="web.currentSite"
          options={CURRENT_SITE_OPTS}
          value={data.currentSite}
          onChange={(v) => onChange('currentSite', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Primary job of the new site
          <span className={styles.required}>*</span>
        </label>
        <RadioGroup
          name="web.primaryJob"
          options={PRIMARY_JOB_OPTS}
          value={data.primaryJob}
          onChange={(v) => onChange('primaryJob', v)}
          onBlur={() => onBlur('primaryJob')}
          required
          error={errors.primaryJob}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          What&apos;s broken about the current situation — and what does that cost you?
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.brokenAndCost}
          onChange={(e) => onChange('brokenAndCost', e.target.value)}
          onBlur={() => onBlur('brokenAndCost')}
          placeholder="Leads not converting, credibility gap, manually doing things the site should do, etc."
          aria-required="true"
          aria-invalid={!!errors.brokenAndCost}
          aria-describedby={errors.brokenAndCost ? 'web-bac-err' : undefined}
        />
        {errors.brokenAndCost && (
          <p id="web-bac-err" className={styles.error} role="alert">{errors.brokenAndCost}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>How will you measure success?</label>
        <textarea
          className={styles.textarea}
          value={data.successMetrics}
          onChange={(e) => onChange('successMetrics', e.target.value)}
          placeholder="Leads per month, conversion rate, time on site, specific outcomes"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Must-have features or functionality</label>
        <textarea
          className={styles.textarea}
          value={data.mustHaveFeatures}
          onChange={(e) => onChange('mustHaveFeatures', e.target.value)}
          placeholder="Booking system, case study section, gated content, integrations, etc."
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Tech preference</label>
        <RadioGroup
          name="web.techPreference"
          options={TECH_PREF_OPTS}
          value={data.techPreference}
          onChange={(v) => onChange('techPreference', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Copy status</label>
        <RadioGroup
          name="web.copyStatus"
          options={COPY_STATUS_OPTS}
          value={data.copyStatus}
          onChange={(v) => onChange('copyStatus', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Post-launch site owner</label>
        <RadioGroup
          name="web.postLaunchOwner"
          options={POST_LAUNCH_OPTS}
          value={data.postLaunchOwner}
          onChange={(v) => onChange('postLaunchOwner', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Sites you admire (and what you like about them)</label>
        <textarea
          className={styles.textarea}
          value={data.siteInspiration}
          onChange={(e) => onChange('siteInspiration', e.target.value)}
          placeholder="URLs or descriptions — what specifically resonates"
        />
      </div>
    </div>
  )
}
