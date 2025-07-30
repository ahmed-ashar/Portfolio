import React from "react";
import Magnet from "../utilis/Magnet";
import Button from "./Button";
import ScrollReveal from "../utilis/ScrollReveal";
import TextReveal from "../utilis/TextReveal";

const AboutSection = () => {
  return (
    <div className="h-auto relative py-40 sm:pb-60 w-full flex justify-center items-center text-off-white">
      <div className="w-full flex flex-col justify-center items-center relative px-4">
        <div className="sticky top-50 sm:top-30 left-0 w-full text-center gray-text font-extrabold  opacity-30 leading-none">
          <TextReveal delay={1}>
            <h1 className="text-[18vw]">ABOUT ME</h1>
          </TextReveal>
        </div>

        <div className="w-full md:w-[70%] p-4 text-center z-55 ">
          <Magnet padding={5} disabled={false} magnetStrength={90}>
            <ScrollReveal
              baseOpacity={1}
              enableBlur={true}
              baseRotation={0}
              blurStrength={10}
            >
              Hello, my name is Muhammad Ahmed Ashar, and I am a passionate MERN
              Stack developer from Pakistan. For as long as I can remember, I've
              been drawn to creating — whether it was sketching ideas, solving
              problems, or building something meaningful with code.
            </ScrollReveal>
          </Magnet>
        </div>
        <div className="text-center ml-3 mt-10 z-55">
          <Button text={"More About Me"} to="/about" />
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
