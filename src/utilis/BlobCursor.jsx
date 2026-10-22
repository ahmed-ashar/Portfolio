"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import gsap from "gsap";
import { useTheme } from "../context/ThemeContext";

export default function BlobCursor({
  blobType = "circle",
  trailCount = 2,
  sizes = [50, 30],
  innerSizes = [8, 8],
  innerColor = "#b7ab98",
  opacities = [0.6, 0.4],
  shadowColor = "rgba(0,0,0,0.4)",
  shadowBlur = 8,
  shadowOffsetX = 5,
  shadowOffsetY = 5,
  filterId = "blob",
  filterStdDeviation = 8,
  filterColorMatrixValues = "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 35 -10",
  useFilter = true,
  fastDuration = 0.1,
  slowDuration = 0.15,
  fastEase = "power3.out",
  slowEase = "power1.out",
  // Content across the site sits at z-55; the blob is a glow behind it.
  zIndex = 50,
}) {
  const containerRef = useRef(null);
  const blobsRef = useRef([]);
  const { colors } = useTheme();
  const fillColor = colors.orange;

  // A trailing cursor blob is meaningless without a real pointer, and it costs
  // a full-screen SVG filter to composite. Touch devices skip it entirely.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(window.matchMedia("(pointer: fine)").matches);
  }, []);

  const updateOffset = useCallback(() => {
    if (!containerRef.current) return { left: 0, top: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }, []);

  const handleMove = useCallback(
    (e) => {
      const { left, top } = updateOffset();
      const x = e.clientX;
      const y = e.clientY;

      blobsRef.current.forEach((el, i) => {
        if (!el) return;
        const isLead = i === 0;
        gsap.to(el, {
          x: x - left,
          y: y - top,
          duration: isLead ? fastDuration : slowDuration,
          ease: isLead ? fastEase : slowEase,
        });
      });
    },
    [updateOffset, fastDuration, slowDuration, fastEase, slowEase]
  );

  useEffect(() => {
    if (!enabled) return;
    const blobs = blobsRef.current;
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMove);
      gsap.killTweensOf(blobs.filter(Boolean));
    };
  }, [enabled, handleMove]);

  if (!enabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{ zIndex }}
    >
      {useFilter && (
        <svg className="absolute w-0 h-0">
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={filterStdDeviation}
            />
            <feColorMatrix in="blur" values={filterColorMatrixValues} />
          </filter>
        </svg>
      )}

      <div
        className="pointer-events-none absolute inset-0 overflow-hidden select-none cursor-default"
        style={{ filter: useFilter ? `url(#${filterId})` : undefined }}
      >
        {Array.from({ length: trailCount }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (blobsRef.current[i] = el)}
            className="absolute will-change-transform transform -translate-x-1/2 -translate-y-1/2"
            style={{
              width: sizes[i],
              height: sizes[i],
              borderRadius: blobType === "circle" ? "50%" : "0",
              backgroundColor: fillColor,
              opacity: opacities[i],
              boxShadow: `${shadowOffsetX}px ${shadowOffsetY}px ${shadowBlur}px 0 ${shadowColor}`,
            }}
          >
            <div
              className="absolute"
              style={{
                width: innerSizes[i],
                height: innerSizes[i],
                top: (sizes[i] - innerSizes[i]) / 2,
                left: (sizes[i] - innerSizes[i]) / 2,
                backgroundColor: innerColor,
                borderRadius: blobType === "circle" ? "50%" : "0",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
