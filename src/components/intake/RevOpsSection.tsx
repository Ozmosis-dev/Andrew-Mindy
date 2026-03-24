'use client'

import type { RevOpsData } from '@/lib/intake-schema'
import RadioGroup from './RadioGroup'
import styles from './section.module.scss'

interface RevOpsSectionProps {
  data: RevOpsData
  errors: Record<string, string>
  onChange: (field: keyof RevOpsData, value: unknown) => void
  onBlur: (field: keyof RevOpsData) => void
}

const PROBLEM_TYPE_OPTS = [
  { value: 'people',  label: 'People — roles unclear, wrong skills, adoption failure' },
  { value: 'process', label: 'Process — missing, undocumented, or broken workflows' },
  { value: 'tools',   label: 'Tools — wrong stack, poor integration, underutilized systems' },
  { value: 'all',     label: 'All three — it\'s tangled' },
]

const AFFECTED_COUNT_OPTS = [
  { value: 'solo', label: 'Just me / founder-led' },
  { value: 'sm',   label: '2–10 people' },
  { value: 'md',   label: '11–50 people' },
  { value: 'lg',   label: '50+ people' },
]

const BUDGET_STATUS_OPTS = [
  { value: 'yes',     label: 'Yes — budget is allocated' },
  { value: 'pending', label: 'Pending approval' },
  { value: 'tbd',     label: 'Not yet determined' },
]

export default function RevOpsSection({ data, errors, onChange, onBlur }: RevOpsSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Revenue Operations & Systems</span>
        <span className={styles.sectionTitle}>Tell me about the operational problem</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          What&apos;s broken — describe the process in pain
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.brokenProcess}
          onChange={(e) => onChange('brokenProcess', e.target.value)}
          onBlur={() => onBlur('brokenProcess')}
          placeholder="Walk me through the workflow that's costing you — where it breaks, who feels it"
          aria-required="true"
          aria-invalid={!!errors.brokenProcess}
          aria-describedby={errors.brokenProcess ? 'revops-bp-err' : undefined}
        />
        {errors.brokenProcess && (
          <p id="revops-bp-err" className={styles.error} role="alert">{errors.brokenProcess}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Root cause type
          <span className={styles.required}>*</span>
        </label>
        <RadioGroup
          name="revops.problemType"
          options={PROBLEM_TYPE_OPTS}
          value={data.problemType}
          onChange={(v) => onChange('problemType', v)}
          onBlur={() => onBlur('problemType')}
          required
          error={errors.problemType}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Current tech stack</label>
        <textarea
          className={styles.textarea}
          value={data.currentStack}
          onChange={(e) => onChange('currentStack', e.target.value)}
          placeholder="CRM, project management, communication, automation tools, etc."
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>How many people are affected?</label>
        <RadioGroup
          name="revops.affectedCount"
          options={AFFECTED_COUNT_OPTS}
          value={data.affectedCount}
          onChange={(v) => onChange('affectedCount', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Previous change / adoption history</label>
        <textarea
          className={styles.textarea}
          value={data.adoptionHistory}
          onChange={(e) => onChange('adoptionHistory', e.target.value)}
          placeholder="Tools or processes that failed to stick — what happened and why"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          What does success look like at 90 days?
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.successAt90Days}
          onChange={(e) => onChange('successAt90Days', e.target.value)}
          onBlur={() => onBlur('successAt90Days')}
          placeholder="Specific, measurable outcomes — not 'things feel better'"
          aria-required="true"
          aria-invalid={!!errors.successAt90Days}
          aria-describedby={errors.successAt90Days ? 'revops-s90-err' : undefined}
        />
        {errors.successAt90Days && (
          <p id="revops-s90-err" className={styles.error} role="alert">{errors.successAt90Days}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Budget status</label>
        <RadioGroup
          name="revops.budgetStatus"
          options={BUDGET_STATUS_OPTS}
          value={data.budgetStatus}
          onChange={(v) => onChange('budgetStatus', v)}
        />
      </div>
    </div>
  )
}
