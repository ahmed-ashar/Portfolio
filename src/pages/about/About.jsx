import ReactLenis from 'lenis/react'
import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import BlobCursor from '../../utilis/blobCursor/BlobCursor'
import Hero from '../../components/hero/Hero'
import Icons from '../../components/icons/Icons'
import ChatBot from '../../components/chatbot/ChatBot'
import DockComp from '../../components/dock/DockComp'
import ScrollVelocitySlide from '../../components/scrollVelocity/ScrollVelocitySlide'
import AboutSection from '../../components/aboutSection/AboutSection'
import ProjectSection from '../../components/projectSection/ProjectSection'
import QuoteSection from '../../components/quoteSection/QuoteSection'
import FooterSection from '../../components/footerSection/FooterSection'
import AboutPage from '../../components/aboutPage/AboutPage'

const About = () => {
  return (
    <div>
      <ReactLenis root>
        <div style={{ padding: "0.55rem", backgroundColor: "#2C2C2C" }}>
          <div
            style={{
              borderRadius: "0.3rem",
              backgroundColor: "#131313",
              height: "100%",
            }}
          >
            <Navbar />

            <BlobCursor
              blobType="circle"
              fillColor="#fd8b09"
              trailCount={2}
              sizes={[50, 30]}
              innerSizes={[8, 8]}
              innerColor="#b7ab98"
              opacities={[0.6, 0.4]}
              shadowColor="rgba(0,0,0,0.4)"
              shadowBlur={8}
              shadowOffsetX={5}
              shadowOffsetY={5}
              filterStdDeviation={8}
              useFilter={true}
              fastDuration={0.1}
              slowDuration={0.15}
              zIndex={5}
            />

            <AboutPage />
            {/* <Hero /> */}
            <Icons />
            <ChatBot />
            <DockComp />
            {/* <ScrollVelocitySlide /> */}
            {/* <AboutSection /> */}
            {/* <ProjectSection /> */}
            {/* <QuoteSection /> */}
          </div>
          <FooterSection />
        </div>
      </ReactLenis>
    </div>
  )
}

export default About
