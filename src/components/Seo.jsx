import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getSeo, STRUCTURED_DATA_ID } from "../seo";
import { useContent } from "../context/ContentContext";

// Updates the tags that scripts/build-seo.mjs already wrote into the static HTML.
// It mutates the existing nodes instead of appending new ones, so client-side
// navigation can never leave two <title>s or two canonicals in the document.
function setTag(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    const [, tagName] = selector.match(/^([a-z]+)/) || [];
    if (!tagName) return;
    el = document.createElement(tagName);
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
}

const Seo = () => {
  const { pathname } = useLocation();
  const content = useContent();

  useEffect(() => {
    const { ROUTES, NOT_FOUND, DASHBOARD, SITE_URL, OG_IMAGE, OG_IMAGE_ALT, SITE_NAME, structuredData } = getSeo(content);
    const normalized =
      pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const meta = normalized === "/dashboard" ? DASHBOARD : ROUTES[normalized] ?? NOT_FOUND;
    const canonical = `${SITE_URL}${meta.path === "/" ? "/" : meta.path}`;
    const shareImage = meta.image || OG_IMAGE;
    const shareAlt = meta.imageAlt || OG_IMAGE_ALT;

    // Match the build-time schema in both directions, including entry via 404.html.
    let schema = document.getElementById(STRUCTURED_DATA_ID);
    if (meta.noindex) schema?.remove();
    else {
      if (!schema) {
        schema = document.createElement("script");
        schema.id = STRUCTURED_DATA_ID;
        schema.type = "application/ld+json";
        document.head.appendChild(schema);
      }
      schema.textContent = JSON.stringify(structuredData).replace(/</g, "\\u003c");
    }

    document.title = meta.title;
    setTag('meta[name="description"]', { name: "description", content: meta.description });

    // A 404 is served under whatever URL was asked for, so pointing a canonical
    // at /404 would advertise a page that does not exist.
    const existingCanonical = document.head.querySelector('link[rel="canonical"]');
    if (meta.noindex) existingCanonical?.remove();
    else setTag('link[rel="canonical"]', { rel: "canonical", href: canonical });
    setTag('meta[name="robots"]', {
      name: "robots",
      content: meta.noindex
        ? "noindex, follow"
        : "index, follow, max-image-preview:large, max-snippet:-1",
    });
    setTag('meta[property="og:title"]', {
      property: "og:title",
      content: meta.title,
    });
    setTag('meta[property="og:description"]', {
      property: "og:description",
      content: meta.description,
    });
    setTag('meta[property="og:url"]', { property: "og:url", content: canonical });
    setTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: meta.title,
    });
    setTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: meta.description,
    });
    setTag('meta[property="og:image"]', {property:'og:image',content:shareImage});
    setTag('meta[property="og:image:alt"]', {property:'og:image:alt',content:shareAlt});
    setTag('meta[property="og:site_name"]', {property:'og:site_name',content:SITE_NAME});
    setTag('meta[name="twitter:image"]', {name:'twitter:image',content:shareImage});
    setTag('meta[name="twitter:image:alt"]', {name:'twitter:image:alt',content:shareAlt});
  }, [pathname,content]);

  return null;
};

export default Seo;
