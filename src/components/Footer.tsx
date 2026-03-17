
import styles from './Footer.module.scss';
import Link from 'next/link';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.content}>
                <div className={styles.copy}>
                    &copy; {currentYear} Andrew Mindy. All Rights Reserved.
                </div>

                <div className={styles.socials}>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <Link href="/contact">Contact</Link>
                </div>
            </div>
        </footer>
    );
}
