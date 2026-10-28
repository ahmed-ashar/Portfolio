import { test, expect } from "@playwright/test";
import { defaults } from "../src/content/schema.js";

test("project cards open stories; live and GitHub destinations remain separate", async ({ page, request }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto("/projects");
  const first = defaults.portfolio.projects[0];
  await page.getByRole("link", { name: `${first.title}: Read the project story`, exact: true }).click();
  await expect(page).toHaveURL(`/projects/${first.slug}`);
  await expect(page.locator("main h1")).toHaveText(first.title);
  await expect(page.getByRole("link", { name: /Visit live site/ })).toHaveAttribute("href", first.link);
  await page.goto("/projects/ahmed-ashar-portfolio");
  await expect(page.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/ahmed-ashar/Portfolio");
  await page.getByRole("navigation", { name: "In this story" }).getByRole("link", { name: /Challenges/ }).click();
  await expect(page.getByRole("heading", { name: "Challenges & solutions" })).toBeInViewport();
  await page.reload();
  await expect(page.locator("main h1")).toContainText("Ahmed Ashar Portfolio");
  expect((await request.get("/projects/no-such-story")).status()).toBe(404);
  await page.goto("/projects/no-such-story");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  expect(errors).toEqual([]);
});

for (const width of [390, 1440]) {
  test(`story layout and both themes at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/projects/ahmed-ashar-portfolio");
    await expect(page.locator("main h1")).toBeVisible();
    const header = await page.locator(".story-header").boundingBox();
    const cover = await page.locator(".story-cover").boundingBox();
    expect(Math.abs(header.x - cover.x)).toBeLessThan(1);
    expect(Math.abs(header.width - cover.width)).toBeLessThan(1);
    for (const theme of ["dark", "light"]) {
      if (theme === "light") await page.getByRole("button", { name: "Switch to light theme" }).click();
      await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      await page.screenshot({ path: `artifacts/story-${width}-${theme}.png`, fullPage: true });
    }
  });
}

test("story images share tilt and parallax while staying inside clipped frames", async ({ page }) => {
  const content = structuredClone(defaults);
  const project = content.portfolio.projects.find(item => item.slug === "ahmed-ashar-portfolio");
  project.story.sections[0].showImage = true;
  project.story.sections[0].image = project.image;
  project.story.sections[0].alt = "Story section screenshot";
  await page.route("**/api/content", route => route.fulfill({ json: { content } }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/projects/ahmed-ashar-portfolio");
  await expect(page.locator(".story-section-media")).toHaveCount(1);
  for (const selector of [".story-cover-media", ".story-section-media", ".story-next-media"]) {
    const frame = page.locator(selector);
    await frame.scrollIntoViewIfNeeded();
    await expect(frame.locator("img")).toBeVisible();
    await expect.poll(() => frame.locator("img").evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true);
    await expect(frame).toHaveCSS("overflow", "hidden");
    const box = await frame.boundingBox();
    expect(box.width).toBeGreaterThan(100);
    expect(box.height).toBeGreaterThan(100);
    const tilt = frame.locator("figure > div").first();
    await frame.hover({ position: { x: box.width * .75, y: box.height * .4 } });
    await expect.poll(() => tilt.evaluate(element => getComputedStyle(element).transform)).not.toBe("none");
    await expect.poll(() => frame.locator("img").evaluate(image => image.style.transform)).toContain("scale(1.2)");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  }
});
