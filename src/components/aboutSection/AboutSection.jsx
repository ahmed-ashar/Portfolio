import React from "react";
import ScrollReveal from "../../utilis/scrollReveal/ScrollReveal";
import ScrambleText from "../../utilis/gsap/scrambleText/ScrambleText";
import Magnet from "../../utilis/magnet/Magnet";

const AboutSection = () => {
  return (
    <div className="h-[100vh] w-full border flex justify-between items-center text-[#b7ab98]">
      <div className="w-[80vw] border mx-auto flex flex-row justify-center items-center gap-3">
        <div className="border w-[30%] text-5xl font-extrabold text-[#fd8b09] opacity-10" style={{ writingMode: "vertical-lr",transform: "rotate(180deg)" }}>
          <h1>ABOUT ME</h1>
        </div>
        <div className="border">
          <Magnet padding={5} disabled={false} magnetStrength={90}>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
            >
              When does a man die? When he is hit by a bullet? No! When he
              suffers a disease? No! When he ate a soup made out of a poisonous
              mushroom? No! A man dies when he is forgotten!
            </ScrollReveal>
          </Magnet>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
