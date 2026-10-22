import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import { startReviewServer } from "./review-server.mjs";

const label = process.argv[2] || "current";
if (!/^[a-z0-9-]+$/i.test(label)) throw new Error("Use a simple name for the review folder.");
const output = resolve("artifacts", label);
await mkdir(output, { recursive: true });
const server = await startReviewServer(0);
const origin = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
try {
  for (const width of [390, 1440]) {
    for (const theme of ["dark", "light"]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "no-preference" });
      await page.addInitScript(value => localStorage.setItem("theme", value), theme);
      await page.route("**/_vercel/speed-insights/**", route => route.fulfill({ contentType: "text/javascript", body: "" }));
      for (const [name, url] of [["home", "/"], ["about", "/about"], ["projects", "/projects"], ["404", "/missing"]]) {
        await page.goto(origin + url);
        await expect(page.locator("main h1")).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(1800);
        // Only the clock/scramble and rotating decoration are masked; content stays visible.
        await page.screenshot({ path: resolve(output, `${name}-${theme}-${width}.png`),
          mask: [page.locator("header > div"), page.locator("button[aria-label='Scroll to top']").locator("../..")],
          animations: "disabled" });
      }
      await page.close();
    }
  }
  console.log(`Visual review: ${output}`);
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
