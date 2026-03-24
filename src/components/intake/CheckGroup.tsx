'use client'

import styles from './CheckGroup.module.scss'

interface Option {
  value: string
  label: string
}

interface CheckGroupProps {
  name: string
  options: Option[]
  value: string[]
  onChange: (value: string[]) => void
}

export default function CheckGroup({ name, options, value, onChange }: CheckGroupProps) {
  function toggle(optValue: string) {
    if (value.includes(optValue)) {
      onChange(value.filter((v) => v !== optValue))
    } else {
      onChange([...value, optValue])
    }
  }

  return (
    <div className={styles.group}>
      {options.map((opt) => {
        const id = `${name}-${opt.value}`
        const checked = value.includes(opt.value)
        return (
          <label
            key={opt.value}
            htmlFor={id}
            className={`${styles.option} ${checked ? styles.checked : ''}`}
          >
            <input
              type="checkbox"
              id={id}
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => toggle(opt.value)}
              className={styles.input}
            />
            <span className={styles.label}>{opt.label}</span>
          </label>
        )
      })}
    </div>
  )
}
