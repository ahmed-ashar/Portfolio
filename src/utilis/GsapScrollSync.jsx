import { useLenis } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function GsapScrollSync() {
  useLenis(() => ScrollTrigger.update());
  return null;
}
