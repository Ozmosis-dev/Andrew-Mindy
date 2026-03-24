'use client'

import styles from './RadioGroup.module.scss'

interface Option {
  value: string
  label: string
}

interface RadioGroupProps {
  name: string
  options: Option[]
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
  required?: boolean
  error?: string
}

export default function RadioGroup({
  name,
  options,
  value,
  onChange,
  onBlur,
  required,
  error,
}: RadioGroupProps) {
  return (
    <div className={styles.group} role="radiogroup" aria-required={required}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const selected = value === opt.value
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`${styles.option} ${selected ? styles.selected : ''}`}
          >
            <input
              type="radio"
              id={id}
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              onBlur={onBlur}
              className={styles.input}
            />
            <span className={styles.label}>{opt.label}</span>
          </label>
        )
      })}
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
