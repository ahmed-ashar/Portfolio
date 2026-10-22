import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

// Lenis owns the scroll position, so reset through it; window.scrollTo alone
// leaves Lenis' internal target stale and the page snaps back mid-route.
// This component precedes App in Shell. Reset during the layout phase, before
// the incoming page creates once-only ScrollTriggers against the old scroll.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useLayoutEffect(() => {
    if (lenis) {
      // Native scrolling or an unfinished back-to-top can leave targetScroll
      // at zero while the actual page is still down. Sync before scrollTo,
      // whose same-target shortcut would otherwise skip the reset.
      lenis.reset();
      lenis.scrollTo(0, { immediate: true, force: true });
    } else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
