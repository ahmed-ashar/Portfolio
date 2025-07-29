import React, { useEffect, useRef } from "react";
import Magnet from "../utilis/Magnet";
import DotGrid from "../utilis/DotGrid";
import gsap from "gsap";
import TextReveal from '../utilis/TextReveal'
import {ReactLenis} from 'lenis/react'

const Hero = () => {
 

  return (
    <div className="pt-23">
      {/* <ReactLenis root> */}
      <DotGrid  />

      <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-10">
        <Magnet padding={5} disabled={false} magnetStrength={90}>
          <TextReveal delay={0.5}>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[9rem] text-[#b7ab98] font-extrabold leading-[0.8] tracking-tighter z-50">

            <div >CODE.</div>
            <div  className="text-[#fd8b09]">DEPLOY.</div>
            <div >
              REPEAT <span className="text-[#fd8b09]">—</span>
            </div>
            <div >
              <span className="text-[#fd8b09]">MERN</span> WAY.
            </div>
          </h1>
          </TextReveal>
        </Magnet>
      </div>
      {/* </ReactLenis> */}
    </div>
  );
};

export default Hero;
