import type { Metadata } from "next";
import Footer from "../../components/Footer";
import FAQContent from "./FAQContent";
import { faqData } from "../../data/faq";
import styles from "./page.module.scss";

export const metadata: Metadata = {
    title: "FAQ — Andrew Mindy",
    description:
        "Common questions about working with Andrew Mindy — a systems-thinking creative consultant specializing in brand strategy, marketing systems, and revenue operations for growth-stage companies.",
    openGraph: {
        title: "FAQ — Andrew Mindy",
        description:
            "Questions about scope, process, timeline, and what it's like to work together.",
    },
};

function FAQSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData
            .flatMap((cat) => cat.items)
            .map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: item.answer.replace(/\n/g, " "),
                },
            })),
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}

export default function FAQPage() {
    return (
        <main className={styles.page}>
            <FAQSchema />
            <FAQContent />
            <div className={styles.footerWrap}>
                <Footer />
            </div>
        </main>
    );
}
