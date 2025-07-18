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

const App = () => {
  return (
    <div style={{ padding: "0.55rem", backgroundColor: "#2C2C2C" }}>
      <div
        style={{
          position: "relative",
          borderRadius: "0.3rem",
          backgroundColor: "#131313",
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
          blobType="square"
          fillColor="#FDA612"
          trailCount={100}
          sizes={[77, 100, 1]}
          innerSizes={[20, 35, 25]}
          innerColor="rgba(255,255,255,0.8)"
          opacities={[0.6, 0.6, 0.6]}
          shadowColor="rgba(0,0,0,0.75)"
          shadowBlur={5}
          shadowOffsetX={10}
          shadowOffsetY={10}
          filterStdDeviation={30}
          useFilter={true}
          fastDuration={0.1}
          slowDuration={0.5}
          zIndex={5}
        />
        <Hero />
        <Icons />
        <ChatBot />
        <DockComp />
        
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
