import { useState, useEffect, useRef } from "react";

/*
 * Every Magnet on the page listens to the same window mousemove, and there can
 * be a dozen of them (the skills grid alone renders ten). The original version
 * called setState on every single move event, for every instance, even while
 * the pointer was nowhere near — which re-rendered the whole tree ~60x a second.
 *
 * Two fixes: coalesce work into one rAF per frame, and bail out early when the
 * resulting position would be unchanged.
 */
const Magnet = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.5s ease-in-out",
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef(null);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    if (disabled) {
      wasActiveRef.current = false;
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
      return;
    }

    let frame = 0;

    const measure = (clientX, clientY) => {
      frame = 0;
      if (!magnetRef.current) return;

      const { left, top, width, height } =
        magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      const inRange =
        Math.abs(centerX - clientX) < width / 2 + padding &&
        Math.abs(centerY - clientY) < height / 2 + padding;

      if (inRange) {
        wasActiveRef.current = true;
        setIsActive(true);
        setPosition({
          x: (clientX - centerX) / magnetStrength,
          y: (clientY - centerY) / magnetStrength,
        });
      } else if (wasActiveRef.current) {
        // Only reset once, on the frame the pointer actually leaves.
        wasActiveRef.current = false;
        setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    };

    const handleMouseMove = (e) => {
      if (frame) return;
      const { clientX, clientY } = e;
      frame = requestAnimationFrame(() => measure(clientX, clientY));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [padding, disabled, magnetStrength]);

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName}
      style={{ position: "relative", display: "inline-block" }}
      {...props}
    >
      <div
        className={innerClassName}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: isActive ? activeTransition : inactiveTransition,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Magnet;
