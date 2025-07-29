import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "../../utilis/tiltedCard/TiltedCard";
import { caption, link, title } from "framer-motion/client";
import pic1 from "../../assets/1.png";
import Magnet from "../../utilis/magnet/Magnet";
import Button from "../button/Button";
import TextReveal from "../../utilis/textReveal/TextReveal";
import { useNavigate } from "react-router-dom";
import ProjectData from "../../data/ProjectData";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ProjectCard from "../projectCard/ProjectCard";

gsap.registerPlugin(ScrollTrigger);

const ProjectSection = () => {
  const data = ProjectData().slice(0, 4);

  useEffect(() => {
    gsap.utils.toArray(".card").forEach((card) => {
      gsap.to(card, {
        scale: 0.8,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: "top -30%",
          end: "bottom -20%",
          scrub: true,
        },
      });
    });
  }, []);

  return (
    <div className="relative text-white">
      <div className="sticky top-50 sm:top-30 left-0 w-full text-center font-extrabold text-[#2C2C2C] opacity-30 leading-none">
        <TextReveal delay={1}>
          <h1 className="text-[17vw] sm:text-[18vw]">PROJECTS</h1>
        </TextReveal>
      </div>

      <div className="w-full py-10 flex flex-col items-center gap-70">
        {data.map((item, index) => (
          <div
            key={index}
            id={index}
            className="card group sticky top-[17vh] sm:top-[18vh] w-[85%] sm:w-[70%] h-[65vh] flex flex-col items-center gap-5 rounded-lg"
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-full"
            >
              <TiltedCard
                imageSrc={item.image}
                altText="Kendrick Lamar - GNX Album Cover"
                captionText={item.caption}
                containerHeight="100%"
                containerWidth="100%"
                imageHeight="100%"
                imageWidth="100%"
                rotateAmplitude={2}
                scaleOnHover={1}
                showMobileWarning={false}
                showTooltip={true}
                displayOverlayContent={true}
                overlayContent={<ProjectCard project={item} />}
              />
            </a>
          </div>
        ))}
      </div>

      <div className="text-center ml-3 mt-10">
        <Button text={"More Projects"} to="/projects" />
      </div>
    </div>
  );
};

export default ProjectSection;
