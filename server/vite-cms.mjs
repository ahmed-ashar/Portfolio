import { loadEnv } from "vite";
import cms, { publishedContent } from "./cms.mjs";

// JSON is embedded in HTML script elements: escape the character that can end them.
const serializeJsonForHtml = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

export default function cmsPlugin() {
  return {
    name: "portfolio-cms",
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, "");
      for (const key of ["ADMIN_PASSWORD_HASH", "CMS_DATA_DIR", "GA_PROPERTY_ID", "GA_CLIENT_EMAIL", "GA_PRIVATE_KEY"])
        if (env[key]) process.env[key] = env[key];
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (/^\/api\/(admin|content|media)(\?|$)/.test(req.url))
          return cms(req, res);
        next();
      });
    },
    async transformIndexHtml(html, ctx) {
      if (!ctx?.server) return html;
      try {
        const content = await publishedContent();
        const state =
          '<script id="portfolio-content" type="application/json">' +
          serializeJsonForHtml(content) +
          "</script>";
        return html.replace(
          '<div id="root"></div>',
          () => '<div id="root"></div>' + state,
        );
      } catch {
        return html;
      }
    },
  };
}
