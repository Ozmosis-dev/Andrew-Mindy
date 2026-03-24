import styles from './SuccessScreen.module.scss'

export default function SuccessScreen() {
  return (
    <div className={styles.wrap}>
      <p className={styles.eyebrow}>Received</p>
      <h2 className={styles.heading}>Got it — I&apos;ll be in touch.</h2>
      <p className={styles.body}>
        I review every submission personally. If what you&apos;ve shared sounds like a fit,
        I&apos;ll reach out within 24 hours to schedule a 30-minute call. If it&apos;s not
        the right match, I&apos;ll let you know and point you somewhere useful.
      </p>
    </div>
  )
}
