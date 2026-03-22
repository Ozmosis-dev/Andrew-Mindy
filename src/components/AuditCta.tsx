import Link from "next/link";
import styles from "./AuditCta.module.scss";

export default function AuditCta() {
    return (
        <div className={styles.wrap}>
            <p className={styles.text}>Wondering where you stand?</p>
            <Link href="/audit" className={styles.link}>
                Take the Scale Audit →
            </Link>
        </div>
    );
}
