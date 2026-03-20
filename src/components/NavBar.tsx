"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { TbEye, TbEyeClosed } from 'react-icons/tb';
import { useTheme } from '../context/ThemeContext';
import styles from './NavBar.module.scss';

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/#work', label: 'Case Studies' },
    { href: '/#about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/design', label: 'Design' },
    { href: '/contact', label: 'Contact' },
];

export default function NavBar() {
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        function onScroll() {
            // Show pill once user has scrolled past ~85 % of the hero height
            setVisible(window.scrollY > window.innerHeight * 0.85);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        /*
         * <header> is always in the DOM so the ::before blur strip
         * is always present — it only becomes visible once content
         * scrolls up behind the top of the viewport.
         * The pill itself fades in/out via AnimatePresence.
         */
        <header className={styles.header} aria-label="Site navigation">

            <AnimatePresence>
                {visible && (
                    <motion.div
                        className={styles.pill}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                    >
                        {/* ── Logo ── */}
                        <Link href="/" className={styles.logo}>
                            Andrew Mindy
                        </Link>

                        <div className={styles.sep} aria-hidden="true" />

                        {/* ── Nav links ── */}
                        <nav className={styles.nav} aria-label="Main">
                            {NAV_LINKS.map(({ href, label }) => {
                                const isActive = pathname === href;
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className={`${styles.link} ${isActive ? styles.active : ''}`}
                                    >
                                        {label}
                                        {isActive && (
                                            <motion.span
                                                className={styles.activeLine}
                                                layoutId="nav-active-line"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 420,
                                                    damping: 32,
                                                }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className={styles.sep} aria-hidden="true" />

                        {/* ── Eye: theme toggle ── */}
                        <motion.button
                            className={styles.eyeBtn}
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            aria-pressed={theme === 'light'}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.86 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            <AnimatePresence mode="wait" initial={false}>
                                {theme === 'dark' ? (
                                    <motion.span
                                        key="open"
                                        className={styles.eyeIcon}
                                        initial={{ opacity: 0, rotate: -20, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: 20, scale: 0.6 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                    >
                                        <TbEye size={20} strokeWidth={1.4} />
                                    </motion.span>
                                ) : (
                                    <motion.span
                                        key="closed"
                                        className={styles.eyeIcon}
                                        initial={{ opacity: 0, rotate: 20, scale: 0.6 }}
                                        animate={{ opacity: 1, rotate: 0, scale: 1 }}
                                        exit={{ opacity: 0, rotate: -20, scale: 0.6 }}
                                        transition={{ duration: 0.18, ease: 'easeOut' }}
                                    >
                                        <TbEyeClosed size={20} strokeWidth={1.4} />
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </motion.button>

                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
}
