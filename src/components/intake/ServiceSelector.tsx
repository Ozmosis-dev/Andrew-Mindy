'use client'

import type { ServiceType } from '@/lib/intake-schema'
import styles from './ServiceSelector.module.scss'
import { FiPenTool, FiLayout, FiTerminal, FiTrendingUp } from 'react-icons/fi'

const SERVICES: { value: ServiceType; label: string; sub: string; Icon: React.ElementType }[] = [
  { value: 'brand', label: 'Brand Identity & Strategy', sub: 'Positioning, visual identity, messaging', Icon: FiPenTool },
  { value: 'web', label: 'Website Design & Development', sub: 'Strategy, copy, design, development', Icon: FiLayout },
  { value: 'app', label: 'Web App / Custom Tooling', sub: 'Platforms, CRMs, internal tools', Icon: FiTerminal },
  { value: 'revops', label: 'Revenue Operations & Systems', sub: 'Workflows, SOPs, automation, training', Icon: FiTrendingUp },
]

interface ServiceSelectorProps {
  value: ServiceType[]
  onChange: (services: ServiceType[]) => void
  error?: string
}

export default function ServiceSelector({ value, onChange, error }: ServiceSelectorProps) {
  function toggle(service: ServiceType) {
    if (value.includes(service)) {
      onChange(value.filter((s) => s !== service))
    } else {
      onChange([...value, service])
    }
  }

  return (
    <div>
      <div className={styles.grid}>
        {SERVICES.map((svc) => {
          const selected = value.includes(svc.value)
          const id = `service-${svc.value}`
          return (
            <label
              key={svc.value}
              htmlFor={id}
              className={`${styles.card} ${selected ? styles.selected : ''}`}
            >
              <input
                type="checkbox"
                id={id}
                name="services"
                value={svc.value}
                checked={selected}
                onChange={() => toggle(svc.value)}
                className={styles.hidden}
              />
              <div className={styles.iconWrapper}>
                <svc.Icon className={styles.icon} />
              </div>
              <div className={styles.textWrapper}>
                <span className={styles.cardLabel}>{svc.label}</span>
                <span className={styles.cardSub}>{svc.sub}</span>
              </div>
            </label>
          )
        })}
      </div>
      {error && <p className={styles.error} role="alert">{error}</p>}
    </div>
  )
}
