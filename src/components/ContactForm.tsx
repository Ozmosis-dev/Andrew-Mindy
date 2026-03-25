"use client";

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactForm.module.scss';

const SERVICE_OPTS = [
    { value: 'discovery', label: 'Studio Discovery' },
    { value: 'brand', label: 'Brand Identity' },
    { value: 'web', label: 'Web Design + Development' },
    { value: 'platform', label: 'Platform Build' },
    { value: 'ops', label: 'Operations Build' },
    { value: 'retainer', label: 'Retainer' },
    { value: 'other', label: 'Other Inquiries' },
];

const CONTACT_PREF_OPTS = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone Call' },
    { value: 'text', label: 'Text Message' },
];

export default function ContactForm() {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [service, setService] = useState('');
    const [contactPref, setContactPref] = useState('email');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setTimeout(() => {
            setStatus('success');
        }, 1500);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedServiceLabel = SERVICE_OPTS.find(opt => opt.value === service)?.label || 'Select a service';

    return (
        <div className={styles.formWrapper}>
            <AnimatePresence mode="wait">
                {status === 'success' ? (
                    <motion.div
                        key="success"
                        className={styles.successState}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className={styles.successCircle}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <h3>Message Received</h3>
                        <p>Thanks for reaching out! I&apos;ll get back to you as soon as I can.</p>
                        <button onClick={() => setStatus('idle')} className={styles.secondaryBtn}>
                            Send Another
                        </button>
                    </motion.div>
                ) : (
                    <motion.form
                        key="form"
                        onSubmit={handleSubmit}
                        className={styles.contactForm}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Name & Phone Row */}
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="name">Name <span className={styles.req}>*</span></label>
                                <input type="text" id="name" required placeholder="Jane Doe" disabled={status === 'submitting'} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="phone">Phone</label>
                                <input type="tel" id="phone" placeholder="+1 (555) 000-0000" disabled={status === 'submitting'} />
                            </div>
                        </div>

                        {/* Email (Full Width, Required) */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="email">Email <span className={styles.req}>*</span></label>
                            <input type="email" id="email" required placeholder="jane@example.com" disabled={status === 'submitting'} />
                        </div>

                        {/* Subject & Custom Dropdown Category Row */}
                        <div className={styles.inputRow}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="subject">Subject <span className={styles.req}>*</span></label>
                                <input type="text" id="subject" required placeholder="General inquiry" disabled={status === 'submitting'} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Category</label>
                                <div className={styles.customSelect} ref={dropdownRef}>
                                    <button
                                        type="button"
                                        className={`${styles.selectTrigger} ${isDropdownOpen ? styles.active : ''}`}
                                        onClick={() => !status.includes('submitting') && setIsDropdownOpen(!isDropdownOpen)}
                                        disabled={status === 'submitting'}
                                    >
                                        <span>{selectedServiceLabel}</span>
                                        <div className={styles.selectArrow}>
                                            <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                                                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {isDropdownOpen && (
                                            <motion.div
                                                className={styles.dropdownMenu}
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {SERVICE_OPTS.map(opt => (
                                                    <div
                                                        key={opt.value}
                                                        className={`${styles.dropdownOption} ${service === opt.value ? styles.selected : ''}`}
                                                        onClick={() => {
                                                            setService(opt.value);
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        {opt.label}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>

                        {/* Message Textarea */}
                        <div className={styles.inputGroup}>
                            <label htmlFor="message">Message <span className={styles.req}>*</span></label>
                            <textarea id="message" required placeholder="Tell me what's on your mind..." rows={4} disabled={status === 'submitting'}></textarea>
                        </div>

                        {/* Contact Preference Section */}
                        <div className={styles.radioSection}>
                            <label className={styles.radioLabel}>Preferred Contact Method</label>
                            <div className={styles.circularRow}>
                                {CONTACT_PREF_OPTS.map(opt => {
                                    const isSelected = contactPref === opt.value;
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            className={`${styles.circularOption} ${isSelected ? styles.selected : ''}`}
                                            onClick={() => setContactPref(opt.value)}
                                            disabled={status === 'submitting'}
                                        >
                                            <div className={styles.outerCircle}>
                                                <div className={styles.innerCircle} />
                                            </div>
                                            <span className={styles.circularLabelText}>{opt.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button type="submit" className={styles.primaryBtn} disabled={status === 'submitting'}>
                            {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            {!status.includes('submitting') && (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </motion.form>
                )}
            </AnimatePresence>
        </div>
    );
}
