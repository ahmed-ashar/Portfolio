import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "../utilis/TiltedCard";
import Button from "./Button";
import TextReveal from "../utilis/TextReveal";
import ProjectData from "../data/ProjectData";
import ProjectCard from "./ProjectCard";

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
    <div className="relative ">
      <div className="sticky top-50 sm:top-30 left-0 w-full text-center font-extrabold opacity-30 leading-none gray-text" >
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
                altText={item.title}
                captionText={item.caption}
                overlayContent={<ProjectCard project={item} />}
              />
            </a>
          </div>
        ))}
      </div>

      <div className="text-center ml-3 mt-10 relative z-55">
        <Button text={"More Projects"} to="/projects" />
      </div>
    </div>
  );
};

export default ProjectSection;
