import { test, expect } from "@playwright/test";
import { defaults } from "../src/content/schema.js";

test("project mobile sources switch at the breakpoint, preserve natural card height and fall back", async ({ page }) => {
  const content = structuredClone(defaults);
  const first = content.portfolio.projects[0];
  first.mobileImage = "/profile.webp";
  first.mobileWidth = 400;
  first.mobileHeight = 400;
  await page.route("**/api/content", route => route.fulfill({ json: { content } }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/projects");
  const card = page.locator("main li.card").first();
  const image = card.locator("img");
  await card.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate(image => new URL(image.currentSrc).pathname)).toBe("/profile.webp");
  await image.evaluate(image => image.decode());
  expect(await card.evaluate(card => Math.abs(card.clientHeight - card.querySelector("img").clientHeight))).toBeLessThanOrEqual(1);
  const fallback = page.locator("main li.card").nth(1).locator("img");
  await fallback.scrollIntoViewIfNeeded();
  await expect.poll(() => fallback.evaluate(image => new URL(image.currentSrc).pathname)).toBe(content.portfolio.projects[1].image);
  for (const [width, src] of [[639, "/profile.webp"], [640, first.image], [1440, first.image], [390, "/profile.webp"]]) {
    await page.setViewportSize({ width, height: 900 });
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(image => new URL(image.currentSrc).pathname)).toBe(src);
  }
  first.mobileImage = "";
  await page.reload();
  await image.scrollIntoViewIfNeeded();
  await expect.poll(() => image.evaluate(image => new URL(image.currentSrc).pathname)).toBe(first.image);
});

test("homepage, story cover and next project use mobile sources with working parallax", async ({ page }) => {
  const content = structuredClone(defaults);
  content.portfolio.projects.slice(0, 2).forEach(project => {
    project.mobileImage = "/profile.webp";
    project.mobileWidth = 400;
    project.mobileHeight = 400;
  });
  await page.route("**/api/content", route => route.fulfill({ json: { content } }));
  await page.setViewportSize({ width: 390, height: 844 });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  for (const [path, selector] of [["/", "li.card img"], [`/projects/${content.portfolio.projects[0].slug}`, ".story-cover img"], [`/projects/${content.portfolio.projects[0].slug}`, ".story-next img"]]) {
    await page.goto(path);
    const image = page.locator(selector).first();
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(image => new URL(image.currentSrc).pathname)).toBe("/profile.webp");
    await expect.poll(() => image.evaluate(image => image.style.transform)).toContain("scale(1.2)");
  }
  expect(errors).toEqual([]);
});
