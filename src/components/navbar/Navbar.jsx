import React, { useEffect } from 'react'
import { gsap } from "gsap";
    
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrambleTextPlugin);

const Navbar = () => {
useEffect(() => {
    const tl = gsap.timeline({
      id: "text-scramble",
      defaults: { ease: "none" },
      repeat: -1,
      repeatDelay: 2
    });

    const texts = [
      "Mix it up with ScrambleText.",
      "Animate your words easily.",
      "GSAP makes it simple.",
      "Customize your style!",
      "Let's scramble again!"
    ];

    texts.forEach((line, index) => {
      tl.to("#scramble-text-1", {
        scrambleText: {
          text: line,
          chars: "$%@#!"
        },
        duration: 1,
        delay: index === 0 ? 0 : 3
      });
    });
  }, [])

    return (
        <div id="scramble-text-1"> </div>
    )
}

export default Navbar