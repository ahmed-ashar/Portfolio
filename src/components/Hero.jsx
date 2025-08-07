import React from "react";
import Magnet from "../utilis/Magnet";
import DotGrid from "../utilis/DotGrid";
import TextReveal from "../utilis/TextReveal";

const Hero = () => {
  return (
    <div className="pt-23">
      <DotGrid />

      <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-55">
        <Magnet padding={5} disabled={false} magnetStrength={90}>
          <TextReveal delay={0.5}>
            <h1 className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-[8rem] text-off-white font-extrabold leading-[0.8] tracking-tighter ">
              <div>CODE.</div>
              <div className="orange-text">DEPLOY.</div>
              <div>
                REPEAT <span className="orange-text">—</span>
              </div>
              <div>
                <span className="orange-text">MERN</span> WAY.
              </div>
            </h1>
          </TextReveal>
        </Magnet>
      </div>
    </div>
  );
};

export default Hero;
