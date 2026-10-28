"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function TextReveal({
  children,
  animateOnScroll = true,
  delay = 0,
  responsive = false,
}) {
  const containerRef = useRef(null);
  const splitRef = useRef([]); 
  const lines = useRef([]);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      splitRef.current = [];
      lines.current = [];

      let elements = [];
      if (containerRef.current.hasAttribute("data-copy-wrapper")) {
        elements = Array.from(containerRef.current.children);
      } else {
        elements = [containerRef.current];
      }

      elements.forEach((element) => {
        const split = SplitText.create(element, {
          type: "lines",
          mask: "lines",
          linesClass: "line++",
          autoSplit: responsive,
          ...(responsive ? {
            // SplitText restores the returned tween's progress when fonts or
            // width change, so a completed reveal stays visible after reflow.
            onSplit: (self) => gsap.fromTo(self.lines, { y: "100%" }, {
              y: "0%",
              duration: 1,
              stagger: 0.1,
              ease: "power4.out",
              delay,
              ...(animateOnScroll ? {
                scrollTrigger: { trigger: element, start: "top 75%", once: true },
              } : {}),
            }),
          } : {}),
          // SplitText's default hides line wrappers from assistive technology.
          // Preserve nested controls and any authored group label.
          aria: element.querySelector("a, button, input, select, textarea, [tabindex], [role='button']")
            ? "none"
            : "auto",
        });

        splitRef.current.push(split);

        const computedStyle = window.getComputedStyle(element);
        const textIndent = computedStyle.textIndent;

        if (textIndent && textIndent !== "0px") {
          if (split.lines.length > 0) {
            split.lines[0].style.paddingLeft = textIndent;
          }
          element.style.textIndent = "0";
        }

        lines.current.push(...split.lines);
      });

      if (!responsive) {
      gsap.set(lines.current, { y: "100%" });

      const animateOnProps = {
        y: "0%",
        duration: 1,
        stagger: 0.1, 
        ease: "power4.out",
        delay: delay,
      };

      if (animateOnScroll) {
        gsap.to(lines.current, {
          ...animateOnProps,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        });
      } else {
        gsap.to(lines.current, animateOnProps);
      }
      }

      return () => {
        splitRef.current.forEach((split) => {
          if (split) {
            split.revert();
          }
        });
      };
    },
    {
      scope: containerRef,
      dependencies: [animateOnScroll, delay, responsive],
      revertOnUpdate: true,
    }
  );

  if (React.Children.count(children) === 1) {
    return React.cloneElement(children, { ref: containerRef });
  }

  return (
    <div ref={containerRef} data-copy-wrapper="true">
      {children}
    </div>
  );
}
