import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import SimpleParallax from "simple-parallax-js";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

// Forward the actual image ref so SimpleParallax can measure/animate it while
// the browser selects the right source before hydration, including in previews.
function ResponsiveImage({ ref, mobileImageSrc, mobileIntrinsicWidth, mobileIntrinsicHeight, ...props }) {
  const image = <motion.img ref={ref} {...props} />;
  return mobileImageSrc ? (
    <picture style={{ display: "block" }}>
      <source media="(max-width: 639px)" srcSet={mobileImageSrc} width={mobileIntrinsicWidth} height={mobileIntrinsicHeight} />
      {image}
    </picture>
  ) : image;
}

export default function TiltedCard({
  imageSrc,
  altText,
  captionText,
  imageIntrinsicWidth,
  imageIntrinsicHeight,
  mobileImageSrc,
  mobileIntrinsicWidth,
  mobileIntrinsicHeight,
  eager = false,
  enableParallax = true,
  imageFit = "cover",
  naturalHeight = false,
  containerHeight = "100%",
  containerWidth = "100%",
  imageHeight = "100%",
  imageWidth = "100%",
  scaleOnHover = 1,
  rotateAmplitude = 2,
  showMobileWarning = false,
  showTooltip = true,
  overlayContent = null,
  displayOverlayContent = true,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0, {
    stiffness: 350,
    damping: 30,
    mass: 1,
  });

  const [lastY, setLastY] = useState(0);

  const image = (
    <ResponsiveImage
      src={imageSrc}
      mobileImageSrc={mobileImageSrc}
      mobileIntrinsicWidth={mobileIntrinsicWidth}
      mobileIntrinsicHeight={mobileIntrinsicHeight}
      alt={altText}
      width={imageIntrinsicWidth}
      height={imageIntrinsicHeight}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      style={{ objectFit: imageFit, ...(naturalHeight ? { position: "relative", height: "auto" } : {}) }}
      className="absolute top-0 left-0 w-full h-full object-cover rounded-[15px]
      transition-transform duration-500 ease-in-out
        "
    />
  );

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.6);
    setLastY(offsetY);
  }

  function handleMouseEnter() {
    scale.set(scaleOnHover);
    opacity.set(1);
  }

  function handleMouseLeave() {
    opacity.set(0);
    scale.set(1);
    rotateX.set(0);
    rotateY.set(0);
    rotateFigcaption.set(0);
  }

  return (
    <figure
      ref={ref}
      className="relative w-full h-full [perspective:800px] flex flex-col items-center justify-center"
      style={{
        height: naturalHeight ? "auto" : containerHeight,
        width: containerWidth,
      }}
      onMouseMove={handleMouse}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showMobileWarning && (
        <div className="absolute top-4 text-center text-sm block sm:hidden">
          This effect is not optimized for mobile. Check on desktop.
        </div>
      )}

      <motion.div
        className="relative [transform-style:preserve-3d]"
        style={{
          width: imageWidth,
          height: naturalHeight ? "auto" : imageHeight,
          rotateX,
          rotateY,
          scale,
        }}
      >
        <div
          className="relative group rounded-[15px] overflow-hidden"
          style={{ width: imageWidth, height: naturalHeight ? "auto" : imageHeight }}
        >
          {enableParallax ? <SimpleParallax
            scale={1.2}
            delay={0.1}
            transition="cubic-bezier(0.25, 0.46, 0.45, 0.94)"
          >
            {image}
          </SimpleParallax> : image}
          <div
            className="absolute top-0 left-0 w-full h-full
       opacity-30 group-hover:opacity-0
      transition-opacity duration-500
      rounded-[15px] gray-bg"
          />
        </div>

        {displayOverlayContent && overlayContent && (
          <motion.div className="tilted-card-overlay text-4xl will-change-transform [transform:translateZ(30px)]">
            {overlayContent}
          </motion.div>
        )}
      </motion.div>

      {showTooltip && (
        <motion.figcaption
          className="pointer-events-none absolute left-8 top-0 rounded-[4px]  px-[10px] py-[4px] text-[10px]  opacity-0  hidden sm:block gray-bg text-off-white"
          style={{
            x,
            y,
            opacity,
            rotate: rotateFigcaption,
          }}
        >
          {captionText}
        </motion.figcaption>
      )}
    </figure>
  );
}
