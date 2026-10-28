/*
 * Build full React HTML and route metadata after the client and server bundles.
 * Each public route hydrates the same component tree in the browser. Also emits
 * robots.txt, sitemap.xml and a noindex 404 page for static hosting.
 */
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ROUTES,
  NOT_FOUND,
  SITE_URL,
  SITE_NAME,
  OG_IMAGE,
  OG_IMAGE_ALT,
  structuredData,
  STRUCTURED_DATA_ID,
} from "../src/seo.js";

// Static generation must use React's production renderer as deployed.
process.env.NODE_ENV = "production";
const { render: renderApp } = await import("../dist-ssr/entry-server.js");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = resolve(root, "dist");

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// A literal "</script>" inside a JSON-LD block closes the tag early. JSON
// accepts a unicode escape for "<", so escaping it keeps the payload inert.
const jsonLdBlock = () =>
  `<script id="${STRUCTURED_DATA_ID}" type="application/ld+json">` +
  JSON.stringify(structuredData).split("<").join("\\u003c") +
  "</script>";

function headFor({ path, title, description, noindex, image = OG_IMAGE, imageAlt = OG_IMAGE_ALT }) {
  const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
  const robots = noindex
    ? "noindex, follow"
    : "index, follow, max-image-preview:large, max-snippet:-1";

  // A 404 is served under whatever URL was requested, so a self-canonical
  // would point at a page that does not exist. noindex already says enough.
  return `<title>${escape(title)}</title>
    <meta name="description" content="${escape(description)}" />
    ${noindex ? "" : `<link rel="canonical" href="${canonical}" />`}
    <meta name="robots" content="${robots}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escape(SITE_NAME)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:title" content="${escape(title)}" />
    <meta property="og:description" content="${escape(description)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${escape(image)}" />
    <meta property="og:image:alt" content="${escape(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escape(title)}" />
    <meta name="twitter:description" content="${escape(description)}" />
    <meta name="twitter:image" content="${escape(image)}" />
    <meta name="twitter:image:alt" content="${escape(imageAlt)}" />${
    noindex ? "" : `
    ${jsonLdBlock()}`
  }`;
}

const START = "<!--seo-start-->";
const END = "<!--seo-end-->";

async function write(outPath, html) {
  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, html, "utf8");
  console.log(`  seo: ${outPath.replace(dist, "dist")}`);
}

const template = await readFile(resolve(dist, "index.html"), "utf8");
if (!template.includes(START) || !template.includes(END) || !template.includes('<div id="root"></div>')) {
  throw new Error(
    `index.html is missing the ${START} / ${END} markers; SEO metadata or the app root cannot be injected.`
  );
}

await write(resolve(dist, "template.html"), template);

const render = (meta) =>
  template.slice(0, template.indexOf(START) + START.length) +
  "\n    " +
  headFor(meta) +
  "\n    " +
  template.slice(template.indexOf(END));

// One HTML file per indexable route, plus a real 404 document.
for (const meta of Object.values(ROUTES)) {
  const out =
    meta.path === "/"
      ? resolve(dist, "index.html")
      : resolve(dist, meta.path.slice(1), "index.html");
  const markup = await renderApp(meta.path);
  const html = render(meta).replace('<div id="root"></div>', () => `<div id="root">${markup}</div>`);
  await write(out, html);
}
await write(resolve(dist, "404.html"), render(NOT_FOUND).replace('<div id="root"></div>', `<div id="root">${await renderApp("/404")}</div>`));

// Only canonical, indexable URLs belong in the sitemap.
const urls = Object.values(ROUTES)
  .map(
    ({ path }) => `  <url>
    <loc>${SITE_URL}${path === "/" ? "/" : path}</loc>
  </url>`
  )
  .join("\n");

await write(
  resolve(dist, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
);

await write(
  resolve(dist, "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
);
