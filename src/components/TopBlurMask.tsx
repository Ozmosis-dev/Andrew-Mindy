import styles from './TopBlurMask.module.scss';

/**
 * Fixed viewport-edge blur/fade strip.
 *
 * Sits above scrolling page content (z-index 999) but strictly
 * below the floating nav bar (z-index 1000). As content scrolls
 * up it softens and dissolves before reaching the nav — no hard
 * text-behind-nav overlap.
 *
 * No background colour. No pointer events. Pure blur mask.
 */
export default function TopBlurMask() {
    return <div className={styles.mask} aria-hidden="true" />;
}
