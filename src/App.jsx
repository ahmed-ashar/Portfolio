import Hero from "./components/hero/Hero";
import Navbar from "./components/navbar/Navbar";
import RandomText from "./components/randomText/RandomText";
import BlobCursor from "./utilis/blobCursor/BlobCursor";
import DotGrid from "./utilis/dotGrid/DotGrid";
import React from "react";
import ScrambleText from "./utilis/gsap/scrambleText/ScrambleText";
import Icons from "./components/icons/Icons";
import ChatBot from "./components/chatbot/ChatBot";
import DockComp from "./components/dock/DockComp";
import ScrollVelocitySlide from "./components/scrollVelocity/ScrollVelocitySlide";
import AboutSection from "./components/aboutSection/AboutSection";
import ProjectSection from "./components/projectSection/ProjectSection";

const App = () => {
  
  return (
    <div style={{ padding: "0.55rem", backgroundColor: "#2C2C2C" }}>
      <div
        style={{
          borderRadius: "0.3rem",
          backgroundColor: "#131313",
          height: "100%",
        }}
      >
        
          <Navbar />
          <DotGrid
            dotSize={5}
            gap={10}
            baseColor="#131313"
            activeColor="#fd8b09"
            proximity={200}
            shockRadius={100}
            shockStrength={200}
            resistance={100}
            returnDuration={3}
          />
    

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
  useFilter={false}
  fastDuration={0.1}  
  slowDuration={0.15}     
  zIndex={5}
/>

          <Hero  />
          <Icons />
          <ChatBot />
          <DockComp />
        <ScrollVelocitySlide />
        <AboutSection />
        <ProjectSection />
        <AboutSection />

        </div>
        <AboutSection  />
   
      
    </div>
  );
};

export default App;
