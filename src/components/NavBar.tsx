"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { TbEye, TbEyeClosed, TbX } from 'react-icons/tb';
import { useTheme } from '../context/ThemeContext';
import styles from './NavBar.module.scss';

const MobileMenuBackground = () => (
    <div className={styles.mobileBgContainer}>
        {/* Animated ambient orbs for a premium glass/glow effect */}
        <motion.div
            className={styles.mobileOrb1}
            animate={{
                x: [0, 40, -20, 0],
                y: [0, 30, 50, 0],
                scale: [1, 1.1, 0.9, 1],
            }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
        />
        <motion.div
            className={styles.mobileOrb2}
            animate={{
                x: [0, -30, 20, 0],
                y: [0, -40, -10, 0],
                scale: [1, 1.2, 0.8, 1],
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
        />
        <svg className={styles.mobileAnimatedSvg} width="100%" height="100%">
            <defs>
                <pattern
                    id="animated-dots"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="2" cy="2" r="1.2" className={styles.dotShape} />
                    <animateTransform
                        attributeName="patternTransform"
                        type="translate"
                        from="0 0"
                        to="40 40"
                        dur="15s"
                        repeatCount="indefinite"
                    />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#animated-dots)" />
        </svg>
    </div>
);

const NAV_LINKS = [
    { href: '/', label: 'Home' },
    { href: '/design', label: 'Design' },
    { href: '/audit', label: 'Audit' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/work-with-me', label: 'Work With Me' },
];

const ScrollProgressCircle = ({ className }: { className?: string }) => {
    const { scrollYProgress, scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(false);

    useEffect(() => {
        const unsubY = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        const unsubP = scrollYProgress.on("change", (latest) => {
            // Considering potential mobile height differences, ~0.95-0.98 is the bottom
            setIsAtBottom(latest >= 0.96);
        });
        return () => {
            unsubY();
            unsubP();
        };
    }, [scrollY, scrollYProgress]);

    return (
        <div className={className}>
            <AnimatePresence>
                {isScrolled && (
                    <motion.div
                        className={styles.scrollProgressInner}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)", width: "100%", height: "100%", overflow: "visible" }}>
                            {/* Background circle */}
                            <circle cx="50" cy="50" r="48" className={styles.progressBg} fill="none" />
                            {/* Animated progress circle */}
                            <motion.circle
                                cx="50"
                                cy="50"
                                r="48"
                                className={styles.progressGlow}
                                fill="none"
                                strokeLinecap="round"
                                style={{ pathLength: scrollYProgress }}
                            />
                        </svg>

                        <AnimatePresence>
                            {isAtBottom && (
                                <div className={styles.progressTextContainerCentered}>
                                    <motion.div
                                        className={styles.progressTextContainerInner}
                                        initial={{ opacity: 0, scale: 0.5, y: 15 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.8, y: -15 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    >
                                        <span className={styles.progressText}>All Set?</span>
                                        <span className={styles.progressTextSub}>Submit Below</span>
                                    </motion.div>
                                </div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function NavBar() {
    const [visible, setVisible] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    const isWorkWithMe = pathname === '/work-with-me';
    const isContact = pathname === '/contact';
    const isFaq = pathname === '/faq';

    useEffect(() => {
        if (isWorkWithMe || isContact || isFaq) {
            setVisible(true);
            return;
        }

        function onScroll() {
            // Show pill once user has scrolled past ~85 % of the hero height
            setVisible(window.scrollY > window.innerHeight * 0.85);
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
        return () => window.removeEventListener('scroll', onScroll);
    }, [isWorkWithMe]);

    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }, [mobileMenuOpen]);

    // Hide the entire NavBar on the audit landing page
    if (pathname === '/audit') {
        return null;
    }

    return (
        <>
            <header className={styles.header} aria-label="Site navigation">
                {visible && isWorkWithMe && <ScrollProgressCircle className={styles.desktopScrollProgress} />}
                <AnimatePresence>
                    {visible && (
                        <motion.div
                            className={styles.pill}
                            initial={isWorkWithMe ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
                        >
                            {/* ── Logo ── */}
                            <Link href="/" className={styles.logo}>
                                Andrew Mindy
                            </Link>

                            <div className={`${styles.sep} ${styles.desktopOnlySep}`} aria-hidden="true" />

                            {/* ── Nav links ── */}
                            <nav className={styles.desktopNav} aria-label="Main">
                                {NAV_LINKS.map(({ href, label }) => {
                                    const isActive = pathname === href;
                                    return (
                                        <Link
                                            key={href}
                                            href={href}
                                            className={`${styles.link} ${isActive ? styles.active : ''} ${href === '/work-with-me' ? styles.ctaLink : ''}`}
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

                            <div className={styles.actionsGroup}>
                                {isWorkWithMe && <ScrollProgressCircle className={styles.mobileScrollProgress} />}
                                <button
                                    className={styles.mobileMenuBtn}
                                    onClick={() => setMobileMenuOpen(true)}
                                    aria-label="Open menu"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <circle cx="5" cy="5" r="2.3" />
                                        <circle cx="12" cy="5" r="2.3" />
                                        <circle cx="19" cy="5" r="2.3" />
                                        <circle cx="5" cy="12" r="2.3" />
                                        <circle cx="12" cy="12" r="2.3" />
                                        <circle cx="19" cy="12" r="2.3" />
                                        <circle cx="5" cy="19" r="2.3" />
                                        <circle cx="12" cy="19" r="2.3" />
                                        <circle cx="19" cy="19" r="2.3" />
                                    </svg>
                                </button>

                                <div className={`${styles.sep} ${styles.actionsSep}`} aria-hidden="true" />

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
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ── Mobile fullscreen menu ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        className={styles.mobileMenuOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MobileMenuBackground />

                        <motion.div
                            className={styles.mobileMenuPanel}
                            initial={{ x: '-10%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: '-10%', opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            <div className={styles.mobileMenuHeader}>
                                <button
                                    className={styles.closeMenuBtn}
                                    onClick={() => setMobileMenuOpen(false)}
                                    aria-label="Close menu"
                                >
                                    <TbX size={28} />
                                </button>
                            </div>

                            <div className={styles.mobileMenuLinks}>
                                {NAV_LINKS.map((link, i) => (
                                    <motion.div
                                        key={link.href}
                                        initial={{ opacity: 0, x: -40 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.1 + i * 0.05, duration: 0.4, ease: 'easeOut' }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={`${styles.mobileMenuLink} ${pathname === link.href ? styles.active : ''} ${link.href === '/work-with-me' ? styles.ctaMobileLink : ''}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>

                            <motion.div
                                className={styles.mobileMenuFooter}
                                initial={{ opacity: 0, x: -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + NAV_LINKS.length * 0.05, duration: 0.4, ease: 'easeOut' }}
                            >
                                <Link
                                    href="/work-with-me"
                                    className={styles.mobileMenuCta}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Work With Me
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
