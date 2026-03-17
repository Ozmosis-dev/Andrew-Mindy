
"use client";

import Link from "next/link";
import styles from "./ConnectButton.module.scss";

export default function ConnectButton() {
    return (
        <Link href="/contact" className={styles.button}>
            CONNECT
        </Link>
    );
}
