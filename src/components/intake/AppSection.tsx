'use client'

import type { AppData } from '@/lib/intake-schema'
import RadioGroup from './RadioGroup'
import styles from './section.module.scss'

interface AppSectionProps {
  data: AppData
  errors: Record<string, string>
  onChange: (field: keyof AppData, value: unknown) => void
  onBlur: (field: keyof AppData) => void
}

const USER_TYPE_OPTS = [
  { value: 'int',  label: 'Internal — used by your team only' },
  { value: 'ext',  label: 'External — used by clients or end-users' },
  { value: 'both', label: 'Both' },
]

const SENSITIVE_DATA_OPTS = [
  { value: 'yes',    label: 'Yes — handles sensitive or regulated data' },
  { value: 'no',     label: 'No' },
  { value: 'unsure', label: 'Unsure' },
]

const SPEC_STATUS_OPTS = [
  { value: 'defined', label: 'Fully defined — detailed spec or PRD exists' },
  { value: 'partial', label: 'Partially defined — key flows are clear, details TBD' },
  { value: 'loose',   label: 'Loosely defined — concept is clear, details need work' },
]

export default function AppSection({ data, errors, onChange, onBlur }: AppSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Web App / Custom Tooling</span>
        <span className={styles.sectionTitle}>Tell me about the product</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Core function — what does this do?
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.coreFunction}
          onChange={(e) => onChange('coreFunction', e.target.value)}
          onBlur={() => onBlur('coreFunction')}
          placeholder="The primary job the tool performs — be specific"
          aria-required="true"
          aria-invalid={!!errors.coreFunction}
          aria-describedby={errors.coreFunction ? 'app-cf-err' : undefined}
        />
        {errors.coreFunction && (
          <p id="app-cf-err" className={styles.error} role="alert">{errors.coreFunction}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Who uses it?
          <span className={styles.required}>*</span>
        </label>
        <RadioGroup
          name="app.userType"
          options={USER_TYPE_OPTS}
          value={data.userType}
          onChange={(v) => onChange('userType', v)}
          onBlur={() => onBlur('userType')}
          required
          error={errors.userType}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Expected user volume</label>
        <input
          type="text"
          className={styles.input}
          value={data.userVolume}
          onChange={(e) => onChange('userVolume', e.target.value)}
          placeholder="e.g. 10 internal users, 500 clients, 10k+ end users"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Systems it needs to connect to</label>
        <textarea
          className={styles.textarea}
          value={data.systemConnections}
          onChange={(e) => onChange('systemConnections', e.target.value)}
          placeholder="CRM, payment processor, ERP, APIs, databases, etc."
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Does it handle sensitive or regulated data?</label>
        <RadioGroup
          name="app.sensitiveData"
          options={SENSITIVE_DATA_OPTS}
          value={data.sensitiveData}
          onChange={(v) => onChange('sensitiveData', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          How defined is the spec?
          <span className={styles.required}>*</span>
        </label>
        <RadioGroup
          name="app.specStatus"
          options={SPEC_STATUS_OPTS}
          value={data.specStatus}
          onChange={(v) => onChange('specStatus', v)}
          onBlur={() => onBlur('specStatus')}
          required
          error={errors.specStatus}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Cost of not building this</label>
        <textarea
          className={styles.textarea}
          value={data.costOfInaction}
          onChange={(e) => onChange('costOfInaction', e.target.value)}
          placeholder="What happens if this stays manual or broken — lost hours, lost deals, errors"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>What does &quot;operational&quot; look like?</label>
        <textarea
          className={styles.textarea}
          value={data.operationalDone}
          onChange={(e) => onChange('operationalDone', e.target.value)}
          placeholder="How will you know it's working — metrics, workflows, team usage"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Previous build attempts</label>
        <textarea
          className={styles.textarea}
          value={data.previousAttempts}
          onChange={(e) => onChange('previousAttempts', e.target.value)}
          placeholder="What was tried, what broke, what you learned"
        />
      </div>
    </div>
  )
}
