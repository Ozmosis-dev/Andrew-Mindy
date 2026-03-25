import type { Metadata } from 'next';
import ContactForm from '../../components/ContactForm';
import Footer from '../../components/Footer';
import styles from './page.module.scss';

export const metadata: Metadata = {
    title: 'Contact | Andrew Mindy',
    description: 'Get in touch with Andrew Mindy. For general inquiries and questions.',
};

export default function ContactPage() {
    return (
        <main className={styles.page}>
            {/* Ambient Background Video */}
            <div className={styles.videoWrap}>
                <video
                    className={styles.videoBackground}
                    autoPlay
                    loop
                    muted
                    playsInline
                >
                    <source src="/videos/3d-animation.mp4" type="video/mp4" />
                </video>
            </div>
            <div className={styles.gradientShadow} aria-hidden="true" />

            <div className={styles.container}>
                <div className={styles.splitLayout}>

                    {/* Left Column: Typography & Info */}
                    <div className={styles.leftCol}>
                        <span className={styles.eyebrow}>Contact</span>
                        <h1 className={styles.headline}>
                            Let&rsquo;s start a<br />
                            <span className={styles.textOutline}>conversation.</span>
                        </h1>
                        <p className={styles.subtext}>
                            Whether you have a general inquiry, a question about my design process, or just want to say hello, my inbox is always open. For project intake, please navigate to the <a href="/work-with-me" className={styles.linkAccent}>Work With Me</a> page.
                        </p>

                        <div className={styles.contactDetails}>
                            <div className={styles.detailBlock}>
                                <span className={styles.detailLabel}>Email</span>
                                <a href="mailto:contact@andrewmindy.com" className={styles.detailValue}>contact@andrewmindy.com</a>
                            </div>
                            <div className={styles.detailBlock}>
                                <span className={styles.detailLabel}>Location</span>
                                <span className={styles.detailValue}>Chattanooga, TN</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Glassmorphic Form */}
                    <div className={styles.rightCol}>
                        <ContactForm />
                    </div>

                </div>
            </div>

            <div className={styles.footerWrap}>
                <Footer />
            </div>
        </main>
    );
}
