import React, { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import TiltedCard from "../../utilis/tiltedCard/TiltedCard";
import { caption, link, title } from "framer-motion/client";
import pic1 from "../../assets/1.png";
import Magnet from "../../utilis/magnet/Magnet";
import Button from "../button/Button";
import TextReveal from "../../utilis/textReveal/TextReveal";

gsap.registerPlugin(ScrollTrigger);

const ProjectSection = () => {
  const data = [
    {
      title: "Project 1",
      image: "https://www.emanuelepapale.com/assets/projects/featured_invest.webp",
      link: "https://example.com/project1",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      caption: "work1",
    },
    {
      title: "Project 2",
      image: "https://www.emanuelepapale.com/assets/projects/featured_invest.webp",
      link: "https://example.com/project2",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      caption: "work2",
    },
    {
      title: "Project 3",
      image: pic1,
      link: "https://example.com/project3",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      caption: "work3",
    },
    {
      title: "Project 4",
      image: pic1,
      link: "https://example.com/project4",
      skills: ["React", "JavaScript", "CSS", "HTML"],
      caption: "work4",
    },
  ];

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
      overlayContent={
        <div className="flex flex-col sm:flex-row mx-5 gap-5 sm:mx-20 items-start sm:items-end sm:justify-between group-hover:mx-28 transition-all duration-500 ease-in-out">
          <Magnet padding={20} disabled={false} magnetStrength={5}>
          <p className="tilted-card-demo-text aladin uppercase">{item.title}</p>
          </Magnet>
          <div className="w-[100%] sm:w-[70%] flex flex-wrap-reverse justify-end sm:justify-end items-end gap-2">
            {item.skills.map((skill, skillIndex) => (
              <Magnet key={skillIndex} padding={20} disabled={false} magnetStrength={5}>
                <span className="bg-[#2C2C2C] hover:bg-[#fd8b09] text-[#fd8b09] hover:text-[#2C2C2C] transition-all duration-500 ease-in-out px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              </Magnet>
            ))}
          </div>
        </div>
      }
    />
  </a>
</div>

        ))}
      </div>

      <div className="text-center ml-3 mt-10">
         <Button text={'More Projects'} />
      </div>
    </div>
  );
};

export default ProjectSection;
