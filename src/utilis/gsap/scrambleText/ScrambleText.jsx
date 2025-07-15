import React, { useEffect, useRef } from 'react'
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { gsap } from "gsap";

gsap.registerPlugin(ScrambleTextPlugin);

const ScrambleText = ({ navbarText, texts }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!texts || !Array.isArray(texts)) return;

    const tl = gsap.timeline({
      id: "text-scramble",
      defaults: { ease: "none" },
      repeat: -1,
      repeatDelay: 2
    });

    texts.forEach((line, index) => {
      tl.to(textRef.current, {
        scrambleText: {
          text: line,
          chars: texts
        },
        duration: 2,
        delay: index === 0 ? 0 : 3
      });
    });
  }, [texts]);

  return (
    <div ref={textRef}>{navbarText}</div>
  );
}

export default ScrambleText