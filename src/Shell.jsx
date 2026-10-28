import AnalyticsTracker from "./components/AnalyticsTracker";
import ReactLenis from "lenis/react";
import { MotionConfig } from "framer-motion";
import { BrowserRouter, useLocation } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import App from "./App.jsx";
import ScrollToTop from "./utilis/ScrollToTop.jsx";
import ScrollBoundsSync from "./utilis/ScrollBoundsSync.jsx";
import GsapScrollSync from "./utilis/GsapScrollSync.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";

function RouteExperience() {
  const { pathname } = useLocation();
  // Admin forms and nested panels use native wheel, touch and keyboard scrolling.
  // Stopping a root Lenis instance also cancels those native scroll events.
  if (pathname.replace(/\/+$/, "") === "/dashboard") {
    return (
      <>
        <ScrollToTop />
        <App />
      </>
    );
  }
  return (
    <ReactLenis
      root
      options={{
        duration: 1.5,
        smoothWheel: true,
        syncTouch: true,
        easing: (t) => 1 - Math.pow(1 - t, 3),
        lerp: 0.02,
      }}
    >
      <GsapScrollSync />
      <ScrollBoundsSync />
      <ScrollToTop />
      <App />
    </ReactLenis>
  );
}

export default function Shell({
  Router = BrowserRouter,
  routerProps = {},
  initialContent,
}) {
  return (
    <ContentProvider initialContent={initialContent}>
      <MotionConfig reducedMotion="never">
        <ThemeProvider>
          <Router {...routerProps}>
            <AnalyticsTracker />
            <RouteExperience />
          </Router>
        </ThemeProvider>
      </MotionConfig>
    </ContentProvider>
  );
}
