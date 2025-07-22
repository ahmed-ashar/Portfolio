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
          {/* <ScrambleText /> */}

     <BlobCursor
  blobType="circle"
  fillColor="#fd8b09"
  trailCount={2}                      // Fewer trails for better performance
  sizes={[50, 30]}                   // Slightly smaller for smoother feel
  innerSizes={[8, 8]}                // Match inner size with outer
  innerColor="#b7ab98"
  opacities={[0.6, 0.4]}             // Fades out softly
  shadowColor="rgba(0,0,0,0.4)"      // Softer shadow
  shadowBlur={8}                     // Slightly soft
  shadowOffsetX={5}
  shadowOffsetY={5}
  filterStdDeviation={8}            // Lower blur = smoother rendering
  useFilter={false}
  fastDuration={0.1}                // Quick snap for fast motion
  slowDuration={0.15}               // Smooth but not sluggish
  zIndex={5}
/>

          <Hero  />
          <Icons />
          <ChatBot />
          <DockComp />
        <ScrollVelocitySlide />
        <AboutSection />
        </div>
   
      
    </div>
  );
};

export default App;
