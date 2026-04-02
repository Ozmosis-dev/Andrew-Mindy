import type { Metadata } from 'next'
import SuccessScreen from '../../../components/intake/SuccessScreen'
import Footer from '../../../components/Footer'
import WaveBackground from '../../../components/WaveBackground'
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

            {/* Wave Background — pure SVG, no JPEG artifacts */}
            <WaveBackground />

            <div className={styles.formWrap}>
                <SuccessScreen />
            </div>
            <div className={styles.footerWrap}>
                <Footer />
            </div>
        </main>
    )
}
