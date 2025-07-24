import React, { useEffect, useRef } from "react";
import Magnet from "../../utilis/magnet/Magnet";
import DotGrid from "../../utilis/dotGrid/DotGrid";
import gsap from "gsap";
import TextReveal from '../../utilis/textReveal/TextReveal'
import {ReactLenis} from 'lenis/react'

const Hero = () => {
  const linesRef = useRef([]); // Ref for each line/word

  useEffect(() => {
    gsap.from(linesRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      stagger: 0.15, // Delay between each word/line
    });
  }, []);

  return (
    <div className="">
      <ReactLenis root>
      <DotGrid
        dotSize={5}
        gap={10}
        baseColor="#131313"
        activeColor="#fd8b09"
        proximity={200}
        shockRadius={100}
        shockStrength={200}
        resistance={100}
        returnDuration={3}
      />

      <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-10">
        <Magnet padding={5} disabled={false} magnetStrength={90}>
          <TextReveal delay={0.5}>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[9rem] text-[#b7ab98] font-extrabold leading-[0.8] tracking-tighter z-50">

            <div ref={(el) => (linesRef.current[0] = el)}>CODE.</div>
            <div ref={(el) => (linesRef.current[1] = el)} className="text-[#fd8b09]">DEPLOY.</div>
            <div ref={(el) => (linesRef.current[2] = el)}>
              REPEAT <span className="text-[#fd8b09]">—</span>
            </div>
            <div ref={(el) => (linesRef.current[3] = el)}>
              <span className="text-[#fd8b09]">MERN</span> WAY.
            </div>
          </h1>
          </TextReveal>
        </Magnet>
      </div>
      </ReactLenis>
    </div>
  );
};

export default Hero;
