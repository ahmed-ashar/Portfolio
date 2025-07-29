import ReactLenis from 'lenis/react'
import React from 'react'
import Navbar from '../../components/navbar/Navbar'
import BlobCursor from '../../utilis/blobCursor/BlobCursor'
import AboutPage from '../../components/aboutPage/AboutPage'
import Icons from '../../components/icons/Icons'
import ChatBot from '../../components/chatbot/ChatBot'
import DockComp from '../../components/dock/DockComp'
import FooterSection from '../../components/footerSection/FooterSection'
import ProjectPage from '../../components/projectPage/ProjectPage'

const Projects = () => {
  return (
    <div>
      <ReactLenis
        root
        options={{
          duration: 1.5,        // Scroll animation duration
          smooth: true,         // Enable smooth scroll
          easing: (t) => 1 - Math.pow(1 - t, 3),  // Custom easing function
          lerp: 0.02,           // Low value = smoother scroll
        }}
      >
        <div className='p-[0.55rem] relative overflow-hidden gray-bg' >
          <div className="rounded-[0.3rem] black-bg" >

            <Navbar />

            <BlobCursor
              blobType="circle"
              fillColor="#fd8b09"
              trailCount={2}
              sizes={[50, 30]}
              innerSizes={[8, 8]}
              innerColor="text-off-white"
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

            <ProjectPage />
            {/* <Hero /> */}
            <Icons />
            <ChatBot />
            <DockComp />
            {/* <ScrollVelocitySlide /> */}
            {/* <AboutSection /> */}
            {/* <ProjectSection /> */}
            {/* <QuoteSection /> */}
          </div>
        </div>
          <FooterSection />
      </ReactLenis>
    </div>
  )
}

export default Projects
