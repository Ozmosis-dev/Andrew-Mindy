import styles from "./page.module.scss";
import Hero from "../components/Hero";
import ImpactSection from "../components/ImpactSection";
import SelectedWork from "../components/SelectedWork";
import WebDesignGallery from "../components/WebDesignGallery";
import AboutSection from "../components/AboutSection";
import HowIWorkSection from "../components/HowIWorkSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <ImpactSection />
      <SelectedWork />
      <WebDesignGallery />
      <AboutSection />
      <HowIWorkSection />
      <ServicesSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
