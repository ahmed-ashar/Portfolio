import { useContent } from "../context/ContentContext";
import SiteLayout from "../components/SiteLayout";
import Hero from "../components/Hero";
import ScrollVelocitySlide from "../components/ScrollVelocitySlide";
import AboutSection from "../components/AboutSection";
import QuoteSection from "../components/QuoteSection";
import ProjectSection from "../components/ProjectSection";
import "./home.css";

const sections = {hero:Hero,marquee:ScrollVelocitySlide,intro:AboutSection,featured:ProjectSection,approach:QuoteSection};
export default function Home() {
  const { home } = useContent();
  return (
    <SiteLayout footerReveal={false}>
      <main id="main-content" className="home-page">
        {home.order.map(key=>{const Section=sections[key];return home[key].enabled ? <Section key={key} /> : null;})}
      </main>
    </SiteLayout>
  );
}
