import { useContent } from "../context/ContentContext";
import SiteLayout from "../components/SiteLayout";
import Hero from "../components/Hero";
import ScrollVelocitySlide from "../components/ScrollVelocitySlide";
import AboutSection from "../components/AboutSection";
import QuoteSection from "../components/QuoteSection";
import ProjectSection from "../components/ProjectSection";

const sections = {hero:Hero,marquee:ScrollVelocitySlide,intro:AboutSection,featured:ProjectSection,approach:QuoteSection};
export default function Home() {
  const { home } = useContent();
  return (
    <SiteLayout>
      <main id="main-content">
        {home.order.map(key=>{const Section=sections[key];return home[key].enabled ? <Section key={key} /> : null;})}
      </main>
    </SiteLayout>
  );
}
