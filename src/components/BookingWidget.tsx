
"use client";

import { useState } from 'react';
import styles from './BookingWidget.module.scss';
import { motion } from 'framer-motion';

export default function BookingWidget() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        // Simulate submission
        setTimeout(() => {
            setStatus('success');
            console.log('Form submitted');
        }, 1500);
    };

    if (status === 'success') {
        return (
            <div className={styles.formContainer} style={{ textAlign: 'center' }}>
                <h3>Message Sent!</h3>
                <p>Thanks for reaching out. I&apos;ll get back to you shortly.</p>
                <button
                    className={styles.submitBtn}
                    onClick={() => setStatus('idle')}
                    style={{ marginTop: '2rem' }}
                >
                    Send Another
                </button>
            </div>
        );
    }

    return (
        <motion.div
            className={styles.formContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <h3>Start a Project</h3>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" required placeholder="Jane Doe" />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" required placeholder="jane@example.com" />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="message">Message</label>
                    <textarea id="message" required placeholder="Tell me about your project..."></textarea>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
            </form>
        </motion.div>
    );
}
