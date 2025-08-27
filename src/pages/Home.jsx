import React from "react";
import Navbar from "../components/Navbar";
import BlobCursor from "../utilis/BlobCursor";
import Hero from "../components/Hero";
import Icons from "../components/Icons";
import ChatBot from "../components/ChatBot";
import DockComp from "../components/DockComp";
import ScrollVelocitySlide from "../components/ScrollVelocitySlide";
import AboutSection from "../components/AboutSection";
import QuoteSection from "../components/QuoteSection";
import ProjectSection from "../components/ProjectSection";
import FooterSection from "../components/FooterSection";

const Home = () => {
  return (
    <div>
     
        <div className="p-[0.55rem] gray-bg">
          <div className="rounded-[0.3rem] h-[100%] black-bg">
            <Navbar />
            <BlobCursor />
            <Hero />
            <Icons />
            <ChatBot />
            <DockComp />
            <ScrollVelocitySlide />
            <AboutSection />
            <ProjectSection />
            <QuoteSection />
          </div>
        </div>
        <FooterSection />
    </div>
  );
};

export default Home;
