import { test, expect } from "@playwright/test";
import { defaults } from "../src/content/schema.js";

for (const width of [390, 1440]) {
  test(`homepage sizes to content instead of viewport height at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 700 });
    await page.goto("/");
    await expect(page.locator(".home-hero h1")).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const heights = () => page.locator(".home-page > *, footer").evaluateAll(elements => elements.map(element => element.clientHeight));
    const before = await heights();
    await page.setViewportSize({ width, height: 1100 });
    await expect.poll(async () => {
      const after = await heights();
      return Math.max(...after.map((height, index) => Math.abs(height - before[index])));
    }).toBeLessThan(2);
    await expect(page.locator(".home-hero")).toHaveCSS("min-height", "0px");
    await expect(page.locator("footer")).toHaveCSS("position", "relative");
    await expect(page.locator("body")).toHaveCSS("margin-bottom", "0px");
    const card = page.locator(".home-featured li.card").first();
    await card.scrollIntoViewIfNeeded();
    await card.locator("img").evaluate(image => image.decode());
    expect(await card.evaluate(card => Math.abs(card.clientHeight - card.querySelector("img").clientHeight))).toBeLessThanOrEqual(1);
    await page.getByRole("link", { name: "Go to projects page" }).click();
    await expect(page.locator("footer")).toHaveCSS("position", "relative");
    await expect(page.locator("body")).toHaveCSS("margin-bottom", "0px");    await page.getByRole("link", { name: "Go to home page" }).click();
    await expect(page.locator("body")).toHaveCSS("margin-bottom", "0px");
    await expect(page.locator("footer")).toHaveCSS("position", "relative");
  });
}

test("featured cards stagger below 1100px and share a sticky position above it with unequal image heights", async ({ page }) => {
  const content = structuredClone(defaults);
  content.home.featured.count = 5;
  Object.assign(content.portfolio.projects[0], { image: "/profile.webp", width: 400, height: 400 });
  await page.route("**/api/content", route => route.fulfill({ json: { content } }));
  for (const width of [390, 1099, 1100, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const cards = page.locator(".home-featured li.card");
    await expect(cards).toHaveCount(5);
    await cards.locator("img").evaluateAll(images => {
      images.forEach(image => image.loading = "eager");
      return Promise.all(images.map(image => image.decode()));
    });
    await cards.last().evaluate(card => window.scrollTo(0, card.getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(card).top)));
    await expect.poll(() => cards.evaluateAll(cards => Math.max(...cards.map(card =>
      Math.abs(card.getBoundingClientRect().top - parseFloat(getComputedStyle(card).top)),
    )))).toBeLessThan(2);
    const positions = await cards.evaluateAll(cards => cards.map(card => ({ top: card.getBoundingClientRect().top, opacity: getComputedStyle(card).opacity })));
    // Sticky tops land on fractional scroll positions, so allow a 1px rounding margin.
    const stagger = width >= 1100 ? 0 : width < 640 ? 18 : 24;
    for (let index = 1; index < positions.length; index++) {
      expect(Math.abs(positions[index].top - positions[index - 1].top - stagger)).toBeLessThanOrEqual(1);
      expect(positions[index].opacity).toBe("1");
    }
  }
});
