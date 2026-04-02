import type { Metadata } from 'next'
import SuccessScreen from '../../../components/intake/SuccessScreen'
import Footer from '../../../components/Footer'
import styles from '../page.module.scss'

export const metadata: Metadata = {
    title: 'Thank You | Andrew Mindy',
    description: 'Your project details have been received.',
}

export default function SuccessPage() {
    return (
        <main className={styles.page}>
            {/* Background glow */}
            <div className={styles.bgGlow} aria-hidden="true" />

            {/* Wave background image */}
            <div className={styles.waveContainer}>
                <img
                    src="/images/Black-wave-q100.jpg"
                    alt=""
                    className={styles.waveImage}
                />
            </div>

            <div className={styles.formWrap}>
                <SuccessScreen />
            </div>
            <div className={styles.footerWrap}>
                <Footer />
            </div>
        </main>
    )
}
