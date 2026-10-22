"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import React, {
  Children,
  cloneElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const MotionLink = motion.create(Link);

function DockItem({
  children,
  className = "",
  onClick,
  to,
  active,
  label,
  ariaLabel,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
}) {
  const Item = to ? MotionLink : motion.button;
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? {
      x: 0,
      width: baseItemSize,
    };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  const size = useSpring(targetSize, spring);

  return (
    <Item
      to={to}
      type={to ? undefined : "button"}
      aria-current={active ? "page" : undefined}
      ref={ref}
      style={{
        width: size,
        height: size,
      }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center rounded-2xl black-bg border-neutral-700 border-2 shadow-md cursor-pointer  ${className}`}
      aria-label={ariaLabel || label}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered }))}
    </Item>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = isHovered.on("change", (latest) => {
      setIsVisible(latest === 1);
    });
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`${className} absolute -top-6 left-1/2 w-fit  whitespace-pre rounded-md border border-neutral-700 gray-bg px-2 py-0.5 text-xs text-off-white `}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "", ...rest }) {
  // Swallows the `isHovered` motion value DockItem clones onto every child so
  // it never reaches the DOM as an unknown attribute.
  // eslint-disable-next-line no-unused-vars
  const { isHovered, ...domProps } = rest;
  return (
    <span className={`flex items-center justify-center  ${className}`} {...domProps}>
      {children}
    </span>
  );
}

export default function Dock({
  items,
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 70,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );
  const heightRow = useTransform(isHovered, [0, 1], [panelHeight, maxHeight]);
  const height = useSpring(heightRow, spring);

  return (
    <motion.div
      style={{ height, scrollbarWidth: "none" }}
      className="mx-2 flex max-w-full items-center "
    >
      <motion.div
        onMouseMove={({ clientX }) => {
          isHovered.set(1);
          mouseX.set(clientX);
        }}
        onMouseLeave={() => {
          isHovered.set(0);
          mouseX.set(Infinity);
        }}
        className={`${className} absolute  bottom-2 left-[1%] sm:left-1/6 md:left-1/4 lg:left-1/3 xl:left-[70%] 2xl:left-[100%] transform -translate-x-1/2  flex items-end w-fit gap-2 sm:gap-4 rounded-2xl border-neutral-700 border-2 pb-2 px-4 gray-bg text-off-white`}
        style={{ height: panelHeight }}
      >
        {items.map((item) => (
          <DockItem
            key={item.to ?? "theme"}
            to={item.to}
            active={item.active}
            onClick={item.onClick}
            label={item.label}
            ariaLabel={item.ariaLabel}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={magnification}
            baseItemSize={baseItemSize}
          >
            <DockIcon aria-hidden="true">{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </motion.div>
    </motion.div>
  );
}
