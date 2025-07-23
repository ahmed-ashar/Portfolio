import React, { useEffect } from "react";
import ScrollStack, {
  ScrollStackItem,
} from "../../utilis/scrollStack/ScrollStack";
import img1 from "../../assets/1.png";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { image, tr } from "framer-motion/client";
import TiltedCard from "../../utilis/tiltedCard/TiltedCard";

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
    gsap.to(
      card,
      {
        scale: 0.8,
        opacity: 0,
        scrollTrigger: {
          trigger: card,
          start: "top -30%",
          end: "bottom -20%", // end point of animation
          scrub: true,
          markers: true,
        },
      },
      
    );
  });
}, []);


  return (
    <div className="relative text-white ">
      <div className="sticky top-50 sm:top-60 left-0 w-full text-center font-extrabold text-[#2C2C2C] opacity-30 leading-none">
  <h1 className="text-[17vw] sm:text-[18vw]">PROJECTS</h1>
</div>
        <div className="w-full py-10 flex flex-col items-center gap-50  ">

      {data.map((item, index) => {
        // console.log(item.top)
        return (
          <div
          id={index}
          className={`card  sticky top-[17vh] sm:top-[18vh] w-[85%] sm:w-[70%] h-[65vh] flex flex-col items-center gap-5 rounded-lg `}
          >
            <TiltedCard
  imageSrc="https://abusaid.netlify.app/_next/image?url=https%3A%2F%2Fmedia2.dev.to%2Fdynamic%2Fimage%2Fwidth%3D1000%2Cheight%3D420%2Cfit%3Dcover%2Cgravity%3Dauto%2Cformat%3Dauto%2Fhttps%253A%252F%252Fdev-to-uploads.s3.amazonaws.com%252Fuploads%252Farticles%252Fuoofmd0bd6xtyv41w9l5.jpg&w=1920&q=75"
  altText="Kendrick Lamar - GNX Album Cover"
  captionText="Kendrick Lamar - GNX"
  containerHeight="100%"
  containerWidth="100%"
  imageHeight="100%"
  imageWidth="100%"
  rotateAmplitude={3}
  scaleOnHover={1}
  showMobileWarning={false}
  showTooltip={true}
  displayOverlayContent={true}
  overlayContent={
    <p className="tilted-card-demo-text">
      heading
    </p>
  }
/>
            {/* <img  src="https://abusaid.netlify.app/_next/image?url=https%3A%2F%2Fmedia2.dev.to%2Fdynamic%2Fimage%2Fwidth%3D1000%2Cheight%3D420%2Cfit%3Dcover%2Cgravity%3Dauto%2Cformat%3Dauto%2Fhttps%253A%252F%252Fdev-to-uploads.s3.amazonaws.com%252Fuploads%252Farticles%252Fuoofmd0bd6xtyv41w9l5.jpg&w=1920&q=75" alt="" className="rounded-lg object-cover w-full h-full" /> */}
            {/* <h1>{index}</h1> */}
          </div>
        );
      })}
      </div>
      <div className="text-center mt-10">
        <h1>Button</h1>
      </div>
    </div>
  );
};

export default ProjectSection;
