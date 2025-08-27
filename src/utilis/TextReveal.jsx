import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

const TextReveal = ({ children, delay = 0 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const element = containerRef.current;
    const split = new SplitType(element, {
      types: "lines",
      linesClass: "lineChild",
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top bottom+=100",
        end: "bottom top+=100",
      },
    });

    tl.set(
      element,
      {
        perspective: "1000px",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
      },
      delay
    );

    tl.fromTo(
      split.lines,
      { opacity: 0 },
      { opacity: 1, duration: 0.15, stagger: 0.15 },
      delay
    );

    tl.fromTo(
      split.lines,
      { yPercent: 100, skewY: 2, scale: 0.8, rotateX: -60 },
      {
        yPercent: 0,
        skewY: 0,
        rotateX: 0,
        scale: 1,
        ease: "expo.out",
        stagger: 0.1,
        duration: 2.3,
        force3D: true,
      },
      delay
    );

    tl.set(element, { willChange: "auto" }, "+=0.1");

    return () => {
      split.revert();
      tl.kill();
      ScrollTrigger.kill();
    };
  }, [delay, children]);

  // Render children with ref
  return React.Children.count(children) === 1
    ? React.cloneElement(children, { ref: containerRef })
    : <div ref={containerRef} data-copy-wrapper="true">{children}</div>;
};

export default TextReveal;
