'use client'

import type { BrandData } from '@/lib/intake-schema'
import RadioGroup from './RadioGroup'
import CheckGroup from './CheckGroup'
import styles from './section.module.scss'

interface BrandSectionProps {
  data: BrandData
  errors: Record<string, string>
  onChange: (field: keyof BrandData, value: unknown) => void
  onBlur: (field: keyof BrandData) => void
}

const SITUATION_OPTS = [
  { value: 'new',     label: 'New brand — building from scratch' },
  { value: 'rebrand', label: 'Rebrand — full strategic overhaul' },
  { value: 'refresh', label: 'Refresh — evolving what exists' },
]

const PERSONALITY_OPTS = [
  { value: 'expert',    label: 'Expert — authoritative, precise, trusted' },
  { value: 'advisor',   label: 'Advisor — warm, collaborative, wise' },
  { value: 'visionary', label: 'Visionary — bold, forward-thinking, provocative' },
  { value: 'premium',   label: 'Premium — elevated, refined, exclusive' },
  { value: 'bold',      label: 'Bold — direct, energetic, unapologetic' },
]

const EXISTING_ASSETS_OPTS = [
  { value: 'keep',   label: 'Keep and evolve what we have' },
  { value: 'retire', label: 'Start fresh — retire the old' },
  { value: 'none',   label: 'No existing assets' },
]

const DELIVERABLE_OPTS = [
  { value: 'strategy',    label: 'Brand strategy & positioning' },
  { value: 'logo',        label: 'Logo & visual identity system' },
  { value: 'messaging',   label: 'Messaging framework & voice' },
  { value: 'guidelines',  label: 'Brand guidelines document' },
  { value: 'collateral',  label: 'Marketing collateral' },
  { value: 'web_design',  label: 'Website design' },
]

export default function BrandSection({ data, errors, onChange, onBlur }: BrandSectionProps) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionEyebrow}>Brand Identity & Strategy</span>
        <span className={styles.sectionTitle}>Tell me about your brand</span>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Where are you starting from?</label>
        <RadioGroup
          name="brand.situation"
          options={SITUATION_OPTS}
          value={data.situation}
          onChange={(v) => onChange('situation', v)}
          onBlur={() => onBlur('situation')}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Describe your business in plain language
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.businessDescription}
          onChange={(e) => onChange('businessDescription', e.target.value)}
          onBlur={() => onBlur('businessDescription')}
          placeholder="What you do, who you serve, how you make money"
          aria-required="true"
          aria-invalid={!!errors.businessDescription}
          aria-describedby={errors.businessDescription ? 'brand-bd-err' : undefined}
        />
        {errors.businessDescription && (
          <p id="brand-bd-err" className={styles.error} role="alert">{errors.businessDescription}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Mission / why you exist</label>
        <textarea
          className={styles.textarea}
          value={data.mission}
          onChange={(e) => onChange('mission', e.target.value)}
          placeholder="The deeper reason behind the business"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Describe your best customer
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.customerDescription}
          onChange={(e) => onChange('customerDescription', e.target.value)}
          onBlur={() => onBlur('customerDescription')}
          placeholder="Who they are, what they care about, what problem they're solving"
          aria-required="true"
          aria-invalid={!!errors.customerDescription}
          aria-describedby={errors.customerDescription ? 'brand-cd-err' : undefined}
        />
        {errors.customerDescription && (
          <p id="brand-cd-err" className={styles.error} role="alert">{errors.customerDescription}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Top 2–3 competitors
          <span className={styles.required}>*</span>
        </label>
        <textarea
          className={styles.textarea}
          value={data.competitors}
          onChange={(e) => onChange('competitors', e.target.value)}
          onBlur={() => onBlur('competitors')}
          placeholder="Names or descriptions — what they do well, where they fall short"
          aria-required="true"
          aria-invalid={!!errors.competitors}
          aria-describedby={errors.competitors ? 'brand-comp-err' : undefined}
        />
        {errors.competitors && (
          <p id="brand-comp-err" className={styles.error} role="alert">{errors.competitors}</p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Core messages you need to land</label>
        <textarea
          className={styles.textarea}
          value={data.coreMessages}
          onChange={(e) => onChange('coreMessages', e.target.value)}
          placeholder="The 2–3 things every prospect must walk away believing"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>
          Brand personality
          <span className={styles.required}>*</span>
        </label>
        <RadioGroup
          name="brand.personality"
          options={PERSONALITY_OPTS}
          value={data.personality}
          onChange={(v) => onChange('personality', v)}
          onBlur={() => onBlur('personality')}
          required
          error={errors.personality}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Words / phrases you want to own</label>
        <input
          type="text"
          className={styles.input}
          value={data.wordsYes}
          onChange={(e) => onChange('wordsYes', e.target.value)}
          placeholder="e.g. precise, trusted, quietly confident"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Words / phrases to avoid</label>
        <input
          type="text"
          className={styles.input}
          value={data.wordsNo}
          onChange={(e) => onChange('wordsNo', e.target.value)}
          placeholder="e.g. disruptive, synergy, cutting-edge"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>A brand you admire (and why)</label>
        <input
          type="text"
          className={styles.input}
          value={data.brandAdmired}
          onChange={(e) => onChange('brandAdmired', e.target.value)}
          placeholder="Can be in or out of your industry"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Existing brand assets</label>
        <RadioGroup
          name="brand.existingAssets"
          options={EXISTING_ASSETS_OPTS}
          value={data.existingAssets}
          onChange={(v) => onChange('existingAssets', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Deliverables you&apos;re expecting</label>
        <CheckGroup
          name="brand.deliverables"
          options={DELIVERABLE_OPTS}
          value={data.deliverables}
          onChange={(v) => onChange('deliverables', v)}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Previous agency or freelance experience</label>
        <textarea
          className={styles.textarea}
          value={data.agencyHistory}
          onChange={(e) => onChange('agencyHistory', e.target.value)}
          placeholder="What worked, what didn't, what you'd do differently"
        />
      </div>
    </div>
  )
}
