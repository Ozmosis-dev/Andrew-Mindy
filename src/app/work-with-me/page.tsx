import type { Metadata } from 'next'
import IntakeForm from '../../components/intake/IntakeForm'
import Footer from '../../components/Footer'
import styles from './page.module.scss'

export const metadata: Metadata = {
  title: 'Work With Me | Andrew Mindy',
  description: 'Tell me about your project and what you need. I review every submission personally.',
}

export default function WorkWithMePage() {
  return (
    <main className={styles.page}>
      {/* Background glow */}
      <div className={styles.bgGlow} aria-hidden="true" />

      {/* Persistent Backgrounds */}
      <div className={styles.waveContainer}>
        <img
          src="/images/Black-wave.jpg"
          alt=""
          className={styles.waveImage}
        />
      </div>

      <div className={styles.header}>
        <p className={styles.eyebrow}>Let&apos;s Work Together</p>
        <h1 className={styles.heading}>Tell me what&apos;s going on.</h1>
        <p className={styles.sub}>
          The more context you give me, the better I can assess fit — and the faster
          we can move if it makes sense to work together.
        </p>
      </div>
      <div className={styles.formWrap}>
        <IntakeForm />
      </div>
      <div className={styles.footerWrap}>
        <Footer />
      </div>
    </main>
  )
}
