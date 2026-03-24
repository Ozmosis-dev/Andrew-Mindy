'use client'

import styles from './SubmitButton.module.scss'

interface SubmitButtonProps {
  submitting: boolean
}

export default function SubmitButton({ submitting }: SubmitButtonProps) {
  return (
    <button type="submit" className={styles.btn} disabled={submitting} aria-busy={submitting}>
      {submitting ? (
        <>
          <span className={styles.spinner} aria-hidden="true" />
          Sending…
        </>
      ) : (
        'Submit Project Details'
      )}
    </button>
  )
}
