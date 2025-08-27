import React from "react";
import Navbar from "../components/Navbar";
import BlobCursor from "../utilis/BlobCursor";
import Icons from "../components/Icons";
import ChatBot from "../components/ChatBot";
import DockComp from "../components/DockComp";
import FooterSection from "../components/FooterSection";
import AboutPage from "../components/AboutPage";

const About = () => {
  return (
    <div>
      
        <div className="p-[0.55rem] gray-bg">
          <div className="rounded-[0.3rem] h-[100%] black-bg">
            <Navbar />
            <BlobCursor />
            <AboutPage />
            <Icons />
            <ChatBot />
            <DockComp />
          </div>
        </div>
        <FooterSection />
    </div>
  );
};

export default About;
