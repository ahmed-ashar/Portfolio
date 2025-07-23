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
    gsap.fromTo(
      card,
      {
        scale: 1.1,
        opacity: 1,
      },
      {
        scale: 1,
        opacity: 1,
        scrollTrigger: {
          trigger: card,
          start: "top 70%",
          end: "top 30%", // end point of animation
          scrub: true,
          markers: true,
        },
      }
    );
  });
}, []);


  return (
    <div className="w-full  flex flex-col items-center gap-100 py-[15vh] text-white ">
      {data.map((item, index) => {
          console.log(item.top)
        return (
            <div
            id={index}
            className={`card sticky top-[15vh] w-[80%] h-[70vh] flex flex-col items-center gap-5 rounded-lg bg-[#2C2C2C]`}
          >
            
            <img  src="https://abusaid.netlify.app/_next/image?url=https%3A%2F%2Fmedia2.dev.to%2Fdynamic%2Fimage%2Fwidth%3D1000%2Cheight%3D420%2Cfit%3Dcover%2Cgravity%3Dauto%2Cformat%3Dauto%2Fhttps%253A%252F%252Fdev-to-uploads.s3.amazonaws.com%252Fuploads%252Farticles%252Fuoofmd0bd6xtyv41w9l5.jpg&w=1920&q=75" alt="" className="rounded-lg object-cover w-full h-full" />
            {/* <h1>{index}</h1> */}
          </div>
        );
      })}
    </div>
  );
};

export default ProjectSection;
