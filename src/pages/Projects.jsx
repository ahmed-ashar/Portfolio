import ReactLenis from 'lenis/react'
import React from 'react'
import Navbar from '../components/Navbar'
import BlobCursor from '../utilis/BlobCursor'
import AboutPage from '../components/AboutPage'
import Icons from '../components/Icons'
import ChatBot from '../components/ChatBot'
import DockComp from '../components/DockComp'
import FooterSection from '../components/FooterSection'
import ProjectPage from '../components/ProjectPage'

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

            <BlobCursor  />

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
