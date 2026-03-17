
import type { Metadata } from 'next';
import styles from './page.module.scss';
import BookingWidget from '../../components/BookingWidget';

export const metadata: Metadata = {
    title: 'Contact | Andrew Mindy',
    description: 'Get in touch with Andrew Mindy for design collaborations and inquiries.',
};

export default function ContactPage() {
    return (
        <main className={styles.page}>
            <div className={styles.header}>
                <h1>Let&apos;s Talk</h1>
                <p>Ready to bring your vision to life?</p>
            </div>
            <BookingWidget />
        </main>
    );
}
