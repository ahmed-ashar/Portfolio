import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const ScrambleText = ({ texts, color, font, repeat = -1 }) => {
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !Array.isArray(texts) || texts.length === 0) return;

    const tl = gsap.timeline({
      id: "text-scramble",
      defaults: { ease: "none" },
      repeat,
      repeatDelay: 2,
    });

    texts.forEach((line, index) => {
      tl.to(el, {
        scrambleText: { text: line },
        duration: 3,
        delay: index === 0 ? 0 : 5,
      });
    });

    // Without this the timeline keeps ticking after the route unmounts.
    return () => tl.kill();
  }, [texts, repeat]);

  return <div ref={textRef} className={`${color} ${font} redHatMono`} />;
};

export default ScrambleText;
