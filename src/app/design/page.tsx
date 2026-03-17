
import type { Metadata } from 'next';
import styles from './page.module.scss';
import DesignGallery from '../../components/DesignGallery';
import AnimationWrapper from '../../components/AnimationWrapper';

export const metadata: Metadata = {
    title: 'Work | Andrew Mindy',
    description: 'Explore the design portfolio of Andrew Mindy, featuring brand identity, web design, and digital experiences.',
};

export default function DesignPage() {
    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <div style={{ maxWidth: '200px', margin: '0 auto 2rem' }}>
                    <AnimationWrapper animationPath="/lottie/Design.json" />
                </div>
                <h1>Work</h1>
                <p>A selection of recent projects focusing on brand identity, web design, and digital experiences.</p>
            </div>

            <DesignGallery />
        </main>
    );
}
