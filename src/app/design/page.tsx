import type { Metadata } from 'next';
import DesignHero from '../../components/DesignHero';
import DesignGallery from '../../components/DesignGallery';
import DesignServices from '../../components/DesignServices';
import DesignExtras from '../../components/DesignExtras';
import DesignProcess from '../../components/DesignProcess';
import DesignCta from '../../components/DesignCta';
import Footer from '../../components/Footer';

export const metadata: Metadata = {
    title: 'Brand & Web Design | Andrew Mindy',
    description: 'Identity systems and websites built to convert. Strategy-first brand and web design by Andrew Mindy — fixed scope, fixed price.',
};

export default function DesignPage() {
    return (
        <main>
            <DesignHero />
            <DesignGallery />
            <DesignServices />
            <DesignExtras />
            <DesignProcess />
            <DesignCta />
            <Footer />
        </main>
    );
}
