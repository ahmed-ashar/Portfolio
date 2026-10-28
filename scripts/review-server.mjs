import http from "node:http";
import cms from "../server/cms.mjs";
import pageHandler from "../server/page.mjs";
import { ROUTES } from "../src/seo.js";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

// Local production-output checks, including the configured security headers.
// This is not a substitute for verifying Vercel's routing after deployment.
export async function startReviewServer(port = 4173) {
  const root = fileURLToPath(new URL("../dist/", import.meta.url));
  const config = JSON.parse(await readFile(new URL("../vercel.json", import.meta.url), "utf8"));
  const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
    ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml",
    ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain" };
  const server = http.createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
      for (const { key, value } of config.headers[0].headers) res.setHeader(key, value);
      if (/^\/api\/(admin|content|media)$/.test(pathname)) return cms(req,res);
      if (pathname === '/api/page') return pageHandler(req,res);
      if (['/','/about','/projects','/dashboard','/sitemap.xml','/robots.txt'].includes(pathname) || pathname.startsWith('/projects/')) {
        req.query = {route:pathname}; return pageHandler(req,res);
      }
      let file = resolve(root, `.${pathname}`);
      const insideRoot = file === resolve(root) || file.startsWith(resolve(root) + sep);
      if (!insideRoot) { res.writeHead(403).end(); return; }
      let status = 200;
      try {
        // Windows paths are case-insensitive; production routes are not.
        if (!extname(pathname) && !Object.hasOwn(ROUTES, pathname.replace(/\/+$/, "") || "/")) {
          throw new Error("Unknown route");
        }
        if ((await stat(file)).isDirectory()) file = resolve(file, "index.html");
        await stat(file);
      } catch {
        status = 404;
        file = resolve(root, "404.html");
      }
      const content = await readFile(file);
      for (const { key, value } of config.headers[0].headers) res.setHeader(key, value);
      res.writeHead(status, { "Content-Type": types[extname(file)] || "application/octet-stream" });
      res.end(content);
    } catch {
      res.writeHead(400).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "127.0.0.1", resolve);
  });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const server = await startReviewServer();
  console.log("Production review server: http://127.0.0.1:4173");
  for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
}
