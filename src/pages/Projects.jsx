import React from "react";
import Navbar from "../components/Navbar";
import BlobCursor from "../utilis/BlobCursor";
import Icons from "../components/Icons";
import ChatBot from "../components/ChatBot";
import DockComp from "../components/DockComp";
import FooterSection from "../components/FooterSection";
import ProjectPage from "../components/ProjectPage";

const Projects = () => {
  return (
    <div>
      
        <div className="p-[0.55rem] relative overflow-hidden gray-bg">
          <div className="rounded-[0.3rem] black-bg">
            <Navbar />
            <BlobCursor />
            <ProjectPage />
            <Icons />
            <ChatBot />
            <DockComp />
          </div>
        </div>
        <FooterSection />
    </div>
  );
};

export default Projects;
