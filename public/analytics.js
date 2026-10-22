/*
 * Google Analytics 4 loader.
 * Kept in an external file (not inline in index.html) so the production
 * Content-Security-Policy can forbid inline scripts outright.
 * Only runs on the production host, so local dev and Vercel preview
 * deployments never pollute the property.
 * GA4 enhanced measurement already tracks History API route changes, so no
 * manual page_view is sent here — that would double-count every navigation.
 */
(function () {
  var MEASUREMENT_ID = "G-77MPKKC7BM";
  var PRODUCTION_HOSTS = ["ahmed-ashar.vercel.app"];

  if (PRODUCTION_HOSTS.indexOf(window.location.hostname) === -1) return;
  if (window.self !== window.top) return;
  if (["/", "/about", "/projects"].indexOf(window.location.pathname) === -1) return;
  if (navigator.globalPrivacyControl || navigator.doNotTrack === "1") return;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", MEASUREMENT_ID, { anonymize_ip: true });

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + MEASUREMENT_ID;
  document.head.appendChild(script);
  window.dispatchEvent(new Event("portfolio-analytics-ready"));
})();
