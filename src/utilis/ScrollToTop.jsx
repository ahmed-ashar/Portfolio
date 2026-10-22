import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLenis } from "lenis/react";

// Lenis owns the scroll position, so reset through it; window.scrollTo alone
// leaves Lenis' internal target stale and the page snaps back mid-route.
const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);

  return null;
};

export default ScrollToTop;
