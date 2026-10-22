import { useEffect } from "react";
import { useLocation } from "react-router-dom";
const publicPaths = ["/", "/about", "/projects"];
const measurementId = "G-77MPKKC7BM";

// No IDs, form values, email addresses, query strings or full outbound URLs
// are added to custom events. Labels come only from authored project metadata.
export default function AnalyticsTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    const excluded =
      !publicPaths.includes(pathname) ||
      window.self !== window.top ||
      navigator.globalPrivacyControl ||
      navigator.doNotTrack === "1";
    window[`ga-disable-${measurementId}`] = Boolean(excluded);
    if (excluded) return;
    let timer;
    let ready = false;
    const reached = new Set();
    const emit = (name, label) => {
      if (
        document.visibilityState !== "visible" ||
        typeof window.gtag !== "function"
      )
        return;
      window.gtag("event", name, {
        page_location: location.origin + pathname,
        ...(label ? { interaction_label: String(label).slice(0, 100) } : {}),
      });
    };
    const measure = () => {
      if (
        !ready ||
        document.visibilityState !== "visible" ||
        typeof window.gtag !== "function"
      )
        return;
      const height = document.documentElement.scrollHeight;
      if (height <= 0) return;
      const depth = Math.min(
        100,
        ((window.scrollY + window.innerHeight) / height) * 100,
      );
      for (const threshold of [25, 50, 75, 90]) {
        if (depth >= threshold && !reached.has(threshold)) {
          reached.add(threshold);
          emit(`portfolio_scroll_${threshold}`);
        }
      }
    };
    const scroll = () => {
      if (timer) return;
      timer = setTimeout(() => {
        timer = null;
        measure();
      }, 180);
    };
    const click = (event) => {
      if (
        event.defaultPrevented ||
        (event.type === "auxclick" && event.button !== 1)
      )
        return;
      const target =
        event.target instanceof Element
          ? event.target.closest("a,button")
          : null;
      if (!target) return;
      if (target.dataset.analyticsProject)
        return emit("portfolio_project_open", target.dataset.analyticsProject);
      if (target.dataset.analyticsFilter)
        return emit("portfolio_filter", target.dataset.analyticsFilter);
      if (target.tagName !== "A") return;
      try {
        const url = new URL(target.href, location.origin);
        if (["mailto:", "tel:"].includes(url.protocol))
          return emit(
            "portfolio_contact",
            url.protocol === "mailto:" ? "Email" : "Phone",
          );
        if (["wa.me", "api.whatsapp.com"].includes(url.hostname))
          return emit("portfolio_contact", "WhatsApp");
        if (
          url.origin === location.origin &&
          publicPaths.includes(url.pathname)
        )
          emit("portfolio_navigation", url.pathname);
      } catch {
        /* Ignore non-URL links. */
      }
    };
    // React StrictMode's first mount is cancelled before it can emit anything.
    const initial = setTimeout(() => {
      ready = true;
      measure();
    }, 500);
    window.addEventListener("scroll", scroll, { passive: true });
    window.addEventListener("resize", scroll, { passive: true });
    document.addEventListener("visibilitychange", measure);
    window.addEventListener("portfolio-analytics-ready", measure);
    document.addEventListener("click", click);
    document.addEventListener("auxclick", click);
    return () => {
      clearTimeout(initial);
      clearTimeout(timer);
      window.removeEventListener("scroll", scroll);
      window.removeEventListener("resize", scroll);
      document.removeEventListener("visibilitychange", measure);
      window.removeEventListener("portfolio-analytics-ready", measure);
      document.removeEventListener("click", click);
      document.removeEventListener("auxclick", click);
    };
  }, [pathname]);
  return null;
}
