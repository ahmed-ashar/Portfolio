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
        <div className="">
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
            blobType="square"
            fillColor="#fd8b09"
            trailCount={3}
            sizes={[60, 30, 0]}
            innerSizes={[0,0,0]}
            innerColor="#b7ab98"
            opacities={[0.6, 0.6, 0.6]}
            shadowColor="rgba(0,0,0,0.75)"
            shadowBlur={10}
            shadowOffsetX={10}
            shadowOffsetY={10}
            filterStdDeviation={30}
            useFilter={true}
            fastDuration={0.1}
            slowDuration={0.5}
            zIndex={5}
          />
          <Hero  />
          <Icons />
          <ChatBot />
          <DockComp />
        </div>
        <ScrollVelocitySlide />
        
      </div>
      <h1>daw</h1>
      <h1>daw</h1>
      <h1>daw</h1>
      <h1>daw</h1>
      <h1>daw</h1>
    </div>
  );
};

export default App;
