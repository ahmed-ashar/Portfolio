import React from "react";
import ScrollReveal from "../../utilis/scrollReveal/ScrollReveal";
import ScrambleText from "../../utilis/gsap/scrambleText/ScrambleText";
import Magnet from "../../utilis/magnet/Magnet";
import Button from "../button/Button";
import TextReveal from "../../utilis/textReveal/TextReveal";

const AboutSection = () => {
  return (
    <div className="h-auto relative py-40 sm:pb-60 w-full flex justify-center items-center text-[#b7ab98]">
      <div className="w-full flex flex-col justify-center items-center relative px-4">
        {/* Background Text with responsive font size */}
        {/* Background Text */}
<div className="sticky top-50 sm:top-30 left-0 w-full text-center font-extrabold text-[#2C2C2C] opacity-30 leading-none">
            <TextReveal delay={1}>
  
  <h1 className="text-[18vw]">ABOUT ME</h1>
  </TextReveal>
</div>


        {/* Foreground Text */}
        <div className="w-full md:w-[70%] p-4 text-center z-10">
          <Magnet padding={5} disabled={false} magnetStrength={90}>
            <ScrollReveal
              baseOpacity={1}
              enableBlur={true}
              baseRotation={0}
              blurStrength={10}
            >
              Hello, my name is Muhammad Ahmed Ashar, and I am a passionate MERN Stack developer from Pakistan. For as long as I can remember, I've been drawn to creating — whether it was sketching ideas, solving problems, or building something meaningful with code.
            </ScrollReveal>
          </Magnet>
        </div>
      <div className="text-center ml-3 mt-10">
        <Button text={'More About Me'} />
      </div>
      </div>
    </div>
  );
};

export default AboutSection;
