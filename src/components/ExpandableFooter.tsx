"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TbEye, TbEyeClosed, TbChevronUp } from 'react-icons/tb';
import { useTheme } from '../context/ThemeContext';
import styles from './ExpandableFooter.module.scss';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/#work', label: 'Case Studies' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/design', label: 'Design' },
    { href: '/audit', label: 'Audit' },
    { href: '/contact', label: 'Contact' },
];

export default function ExpandableFooter() {
    const [expanded, setExpanded] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const pathname = usePathname();
    const currentYear = new Date().getFullYear();

    return (
        <div className={styles.footerWrapper}>
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className={styles.pageOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setExpanded(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        className={styles.expandedPopupWrapper}
                        initial={{ opacity: 0, y: 10, scaleY: 0.98, originY: 1 }}
                        animate={{ opacity: 1, y: 0, scaleY: 1 }}
                        exit={{ opacity: 0, y: 5, scaleY: 0.98, transition: { duration: 0.2 } }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className={styles.expandedContainer}>

                            <div className={styles.navSection}>
                                <span className={styles.sectionLabel}>Navigation</span>
                                <div className={styles.navGridDisplay}>
                                    {NAV_LINKS.map(link => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`${styles.mainNavLink} ${pathname === link.href ? styles.active : ''}`}
                                            onClick={() => setExpanded(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            <div className={styles.connectSection}>
                                <div className={styles.connectBlock}>
                                    <span className={styles.sectionLabel}>Get In Touch</span>
                                    <a href="mailto:contact@andrewmindy.com" className={styles.connectLink}>
                                        contact@andrewmindy.com
                                    </a>
                                </div>
                                <div className={styles.connectBlock}>
                                    <span className={styles.sectionLabel}>Social</span>
                                    <a href="https://www.linkedin.com/in/andrew-mindy-397aa499" target="_blank" rel="noopener noreferrer" className={styles.connectLink}>
                                        LinkedIn
                                    </a>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={styles.footerContainer}>
                <div className={styles.collapsedBar}>
                    <div className={styles.leftGroup}>
                        <span className={styles.name}>Andrew Mindy</span>
                        <span className={styles.copy}>&copy; {currentYear} All Rights Reserved</span>
                    </div>

                    <div className={styles.rightGroup}>
                        <div className={styles.legalLinks}>
                            <Link href="/terms" className={styles.legalLink}>Terms & Conditions</Link>
                            <span className={styles.bullet}>&bull;</span>
                            <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                        </div>

                        <div className={styles.sep} />

                        <motion.button
                            className={styles.eyeBtn}
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' ? (
                                    <motion.span
                                        key="open"
                                        initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 20, scale: 0.6 }}
                                        transition={{ duration: 0.18 }}
                                        className={styles.iconWrapper}
                                    >
                                        <TbEye size={18} strokeWidth={1.5} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="closed"
                                        initial={{ opacity: 0, rotate: 20, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -20, scale: 0.6 }}
                                        transition={{ duration: 0.18 }}
                                        className={styles.iconWrapper}
                                    >
                                        <TbEyeClosed size={18} strokeWidth={1.5} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                        <div className={styles.sep} />

                        <motion.button
                            className={styles.expandBtn}
                            onClick={() => setExpanded(!expanded)}
                            whileHover="hover"
                            whileTap="tap"
                        >
                            <motion.span
                                variants={{
                                    hover: { y: -2 },
                                    tap: { y: 2 }
                                }}
                                animate={{ rotate: expanded ? 180 : 0 }}
                                transition={{ duration: 0.3 }}
                                className={styles.iconWrapper}
                            >
                                <TbChevronUp size={20} strokeWidth={1.5} />
                            </motion.span>
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
