import React from "react";
import ScrollReveal from "../../utilis/scrollReveal/ScrollReveal";
import ScrambleText from "../../utilis/gsap/scrambleText/ScrambleText";
import Magnet from "../../utilis/magnet/Magnet";

const AboutSection = () => {
  return (
    <div className="h-[100vh] w-full flex justify-between items-center text-[#b7ab98]">
      <div className="w-[80vw]  mx-auto flex flex-row justify-center items-end gap-3">
        <div className="  h-[55%] mx-auto border-l-4 pl-3 text-5xl text-right  font-extrabold text-[#fd8b09] opacity-10" style={{ writingMode: "vertical-lr",transform: "rotate(180deg)" }}>
          <h1 className="pacifico ">About Me</h1>
        </div>
        <div className="">
          <Magnet padding={5} disabled={false} magnetStrength={90}>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
            >
               Hello, my name is Muhammad Ahmed Ashar, and I am a passionate MERN Stack developer from Pakistan. For as long as I can remember, I've been drawn to creating — whether it was sketching ideas, solving problems, or building something meaningful with code.
            </ScrollReveal>
          </Magnet>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
