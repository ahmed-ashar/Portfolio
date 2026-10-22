import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { publishedContent } from "./cms.mjs";
import { getSeo, STRUCTURED_DATA_ID } from "../src/seo.js";
const escape = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
// JSON is embedded in HTML script elements: escape the character that can end them.
const serializeJsonForHtml = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");
let renderPromise;
async function renderer() {
  renderPromise ||= import("../dist-ssr/entry-server.js");
  return (await renderPromise).render;
}
export default async function pageHandler(req, res) {
  try {
    const query = new URL(req.url, "http://localhost").searchParams;
    const path = req.query?.route || query.get("route") || "/";
    const content = await publishedContent();
    const seo = getSeo(content);
    res.setHeader("Cache-Control", "no-store");
    if (path === "/sitemap.xml") {
      res.setHeader("Content-Type", "application/xml");
      return res.end(
        '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
          Object.keys(seo.ROUTES)
            .map(
              (route) =>
                "<url><loc>" + escape(seo.SITE_URL + route) + "</loc></url>",
            )
            .join("") +
          "</urlset>",
      );
    }
    if (path === "/robots.txt") {
      res.setHeader("Content-Type", "text/plain");
      return res.end(
        "User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /api/admin\nSitemap: " +
          seo.SITE_URL +
          "/sitemap.xml\n",
      );
    }
    const meta =
      path === "/dashboard" ? seo.DASHBOARD : seo.ROUTES[path] || seo.NOT_FOUND;
    res.statusCode = meta === seo.NOT_FOUND ? 404 : 200;
    const canonical = seo.SITE_URL + meta.path;
    const head = `<title>${escape(meta.title)}</title><meta name="description" content="${escape(meta.description)}"><meta name="robots" content="${meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"}">${meta.noindex ? "" : `<link rel="canonical" href="${escape(canonical)}">`}
   <meta property="og:type" content="website"><meta property="og:site_name" content="${escape(seo.SITE_NAME)}"><meta property="og:title" content="${escape(meta.title)}"><meta property="og:description" content="${escape(meta.description)}"><meta property="og:url" content="${escape(canonical)}"><meta property="og:image" content="${escape(seo.OG_IMAGE)}"><meta property="og:image:alt" content="${escape(seo.OG_IMAGE_ALT)}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${escape(meta.title)}"><meta name="twitter:description" content="${escape(meta.description)}"><meta name="twitter:image" content="${escape(seo.OG_IMAGE)}">${meta.noindex ? "" : `<script id="${STRUCTURED_DATA_ID}" type="application/ld+json">${serializeJsonForHtml(seo.structuredData)}</script>`}`;
    const template = await readFile(resolve("dist/template.html"), "utf8");
    const render = await renderer();
    const html = await render(path, content);
    const state =
      '<script id="portfolio-content" type="application/json">' +
      serializeJsonForHtml(content) +
      "</script>";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    // Callback replacements preserve authored dollar sequences as literal text.
    res.end(
      template
        .replace(
          /<!--seo-start-->[\s\S]*?<!--seo-end-->/,
          () => "<!--seo-start-->" + head + "<!--seo-end-->",
        )
        .replace(
          '<div id="root"></div>',
          () => '<div id="root">' + html + "</div>" + state,
        ),
    );
  } catch (error) {
    console.error("Page rendering failed:", error.message);
    res.statusCode = 503;
    res.setHeader("Content-Type", "text/plain");
    res.end("The website is temporarily unavailable. Please try again.");
  }
}
