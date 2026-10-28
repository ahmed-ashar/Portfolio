import { useEffect } from "react";
import { useLenis } from "lenis/react";

// Lenis measures its scroll bounds on creation and then debounces every later
// measurement by 250ms. A route that mounts while a short Suspense fallback is
// still on screen — returning from the dashboard, or the editor preview iframe
// filling in — therefore starts with a scroll limit of zero, and the visitor's
// first wheel is clamped away until that debounce fires.
//
// Measure again as soon as the document height changes, and once more when a
// gesture arrives but the height has moved since the last measurement, so the
// first wheel after such a route change is never swallowed. Measurements go
// straight into Lenis' dimensions, which leaves an in-flight smooth scroll
// alone (lenis.resize() would also reset it).
const ScrollBoundsSync = () => {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return undefined;

    const measure = () => lenis.dimensions.resize();
    let measuredHeight = -1;

    const measureIfChanged = () => {
      const { scrollHeight } = document.documentElement;
      if (scrollHeight === measuredHeight) return;
      measuredHeight = scrollHeight;
      measure();
    };

    measureIfChanged();

    let frame = 0;
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            if (frame) cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              frame = 0;
              measureIfChanged();
            });
          });
    observer?.observe(document.documentElement);

    // Capture phase: this runs before Lenis' own listener reads the limit.
    window.addEventListener("wheel", measureIfChanged, { capture: true, passive: true });
    window.addEventListener("touchstart", measureIfChanged, { capture: true, passive: true });

    return () => {
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("wheel", measureIfChanged, { capture: true });
      window.removeEventListener("touchstart", measureIfChanged, { capture: true });
    };
  }, [lenis]);

  return null;
};

export default ScrollBoundsSync;
