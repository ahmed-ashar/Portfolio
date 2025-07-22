import React, { useEffect } from "react";
import ScrollStack, {
  ScrollStackItem,
} from "../../utilis/scrollStack/ScrollStack";
import img1 from "../../assets/1.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { image, tr } from "framer-motion/client";

gsap.registerPlugin(ScrollTrigger);

const ProjectSection = () => {
  const data = [
    {
      top: 15,
      image: "../../assets/1.png",
    },
    {
      top: 20,
      image: "../../assets/2.png",
    },
    { top: 25, image: "../../assets/3.png" },
    { top: 30, image: "../../assets/4.png" },
  ];

  useEffect(() => {
    gsap.utils.toArray(".card").forEach((card) => {
      gsap.to(card, {
          scale: 0.8,
          opacity: 0,
          duration: 5,
        scrollTrigger: {
          trigger: card,
          start: "top 15%",
          end: "bottom 15%",
          markers: true,
          scrub: true,
        },
      });
    });
  });

  return (
    <div className="w-full  flex flex-col items-center gap-5 py-[15vh] text-white ">
      {data.map((item, index) => {
          console.log(item.top)
        return (
            <div
            id={index}
            className={`card sticky top-[15vh] w-[80%] h-[70vh] flex flex-col items-center gap-5 px-[30px] py-[10vh] rounded-lg bg-[#2C2C2C]`}
          >
            
            <img src="" alt="" className="w-[150px]" />
          </div>
        );
      })}
    </div>
  );
};

export default ProjectSection;
