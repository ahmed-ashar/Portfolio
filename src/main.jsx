
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./utilis/ScrollToTop.jsx";
import ReactLenis from "lenis/react";

// Lenis + GSAP integration
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const lenis = new Lenis({
  duration: 1.5,
  smooth: true,
  easing: (t) => 1 - Math.pow(1 - t, 3),
  lerp: 0.02,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

lenis.on("scroll", ScrollTrigger.update);

// Use body as scroll container, or set a custom selector if needed
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value) {
    return arguments.length ? lenis.scrollTo(value) : lenis.scroll;
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
  },
});

createRoot(document.getElementById("root")).render(
  <ReactLenis
    root
    options={{
      duration: 1.5,
      smooth: true,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lerp: 0.02,
    }}
  >
    <BrowserRouter>
      <ScrollToTop />
      <StrictMode>
        <App />
      </StrictMode>
    </BrowserRouter>
  </ReactLenis>
);
