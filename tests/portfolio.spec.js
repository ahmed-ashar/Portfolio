import { test, expect } from "@playwright/test";
import { ROUTES, NOT_FOUND, SITE_URL, structuredData } from "../src/seo.js";

const schema = 'script[type="application/ld+json"]';

// The analytics endpoint only exists on Vercel. Keep all application assets real.
test.beforeEach(async ({ page }) => {
  await page.route("**/_vercel/speed-insights/**", route =>
    route.fulfill({ contentType: "text/javascript", body: "" }));
  await page.addInitScript(() => {
    window.__cspViolations = [];
    document.addEventListener("securitypolicyviolation", event => {
      window.__cspViolations.push(`${event.violatedDirective}: ${event.blockedURI}`);
    });
  });
});

for (const width of [320, 390, 768, 1440]) {
  for (const theme of ["dark", "light"]) {
    for (const route of ["/", "/about", "/projects", "/missing-page"]) {
      test(`${route} renders at ${width}px in ${theme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.addInitScript(value => localStorage.setItem("theme", value), theme);
        const errors = [];
        page.on("pageerror", error => errors.push(error.message));
        page.on("console", message => {
          if (message.type() === "error" && /hydration|hydrating|Minified React error/i.test(message.text())) errors.push(message.text());
        });
        const response = await page.goto(route);
        expect(response.status()).toBe(route === "/missing-page" ? 404 : 200);
        await expect(page.getByRole("main")).toHaveCount(1);
        await expect(page.locator("main h1")).toBeVisible();
        await expect(page.locator("main h1")).toHaveCount(1);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        await expect(page.getByRole("navigation", { name: "Site", exact: true })).toBeVisible();
        await page.evaluate(() => document.fonts.ready);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        // Trigger lazy images and scroll reveals, including content far below the fold.
        await page.evaluate(async () => {
          for (let top = 0; top < document.documentElement.scrollHeight; top += 650) {
            window.scrollTo(0, top);
            await new Promise(resolve => setTimeout(resolve, 30));
          }
        });
        await expect.poll(() => page.locator("img").evaluateAll(images =>
          images.every(image => image.complete && image.naturalWidth > 0 && image.alt.length > 0)
        )).toBe(true);
        expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
        expect(errors).toEqual([]);
        expect(await page.evaluate(() => window.__cspViolations)).toEqual([]);
      });
    }
  }
}

test("filter controls remain accessible and update project results", async ({ page }) => {
  await page.goto("/projects");
  const group = page.getByRole("group", { name: "Filter projects by type", exact: true });
  await expect(group).toBeVisible();
  const expectedProjects = {
    Frontend: ["Event Central", "FoodSpot Frontend", "Homyz Website", "Resume Builder", "Ahmed Ashar Portfolio (This Site)"],
    Backend: ["Event Central", "FoodSpot Backend", "Resume Builder"],
    "MERN Stack": ["Event Central", "FoodSpot Frontend", "FoodSpot Backend", "Resume Builder"],
    All: ["Event Central", "FoodSpot Frontend", "FoodSpot Backend", "Homyz Website", "Resume Builder", "Ahmed Ashar Portfolio (This Site)"],
  };
  for (const input of ["mouse", "Enter", "Space"]) {
    for (const [name, titles] of Object.entries(expectedProjects)) {
      const button = group.getByRole("button", { name, exact: true });
      if (input === "mouse") {
        await button.click();
      } else {
        await button.focus();
        await page.keyboard.press(input);
      }
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(group.getByRole("button", { pressed: true })).toHaveCount(1);
      await expect(page.locator("main li.card p.uppercase")).toHaveText(titles);
    }
  }
  const client = await page.context().newCDPSession(page);
  await client.send("Accessibility.enable");
  const { nodes } = await client.send("Accessibility.getFullAXTree");
  const names = nodes.filter(node => !node.ignored && node.role?.value === "button").map(node => node.name?.value);
  expect(names).toEqual(expect.arrayContaining(["All", "Frontend", "Backend", "MERN Stack"]));
});

test("Projects heading reflows after resizing without retaining stale animated lines", async ({ page }) => {
  await page.setViewportSize({ width: 900, height: 900 });
  await page.goto("/projects");
  const heading = page.locator("main h1");
  const lines = heading.locator(".line");
  await expect(lines.first()).toBeVisible();
  const narrowCount = await lines.count();
  await expect.poll(() => lines.first().evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(1);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect.poll(() => lines.count()).toBeLessThan(narrowCount);
  const wideCount = await lines.count();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => lines.count()).toBeGreaterThan(wideCount);
  await page.setViewportSize({ width: 1920, height: 1080 });
  await expect.poll(() => lines.count()).toBe(wideCount);
  await expect.poll(() => lines.first().evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(1);
  expect(await heading.evaluate(el => Math.abs(el.clientWidth - el.parentElement.parentElement.parentElement.clientWidth))).toBeLessThan(2);
  await page.getByRole("button", { name: "Backend", exact: true }).click();
  await expect(page.locator("main li.card")).toHaveCount(3);
});

test("404 transitions keep metadata and structured data in sync", async ({ page }) => {
  await page.goto("/missing-page");
  await expect(page.locator(schema)).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  for (let pass = 0; pass < 2; pass++) {
    await page.getByRole("navigation", { name: "Site", exact: true }).getByRole("link", { name: "Go to home page" }).click();
    await expect(page).toHaveTitle(ROUTES["/"].title);
    await expect(page.locator(schema)).toHaveCount(1);
    expect(await page.locator(schema).evaluate(node => JSON.parse(node.textContent))).toEqual(structuredData);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}/`);
    await page.evaluate(() => {
      history.pushState({}, "", "/missing-client-route");
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    await expect(page).toHaveTitle(NOT_FOUND.title);
    await expect(page.locator(schema)).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  }
});

test("route casing agrees with the 404 metadata", async ({ page }) => {
  await page.goto("/ABOUT");
  await expect(page).toHaveTitle(NOT_FOUND.title);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("This page took a wrong turn.");
  await expect(page.locator(schema)).toHaveCount(0);
});

test("dock uses native links, keyboard navigation and a persistent theme button", async ({ page }) => {
  await page.goto("/");
  const dock = page.getByRole("navigation", { name: "Site", exact: true });
  const about = dock.getByRole("link", { name: "Go to about page" });
  await expect(about).toHaveAttribute("href", "/about");
  await about.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL("/about");
  await expect(dock.getByRole("link", { name: "Go to about page" })).toHaveAttribute("aria-current", "page");
  const theme = dock.getByRole("button", { name: "Switch to light theme" });
  await theme.focus();
  await page.keyboard.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(dock.getByRole("button", { name: "Switch to dark theme" })).toBeFocused();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("navigation resets scroll and desktop back-to-top still works", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await expect(page.locator("main h1")).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.getByRole("button", { name: "Scroll to top" }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
  await page.evaluate(() => window.scrollTo(0, 1500));
  await page.getByRole("link", { name: "Go to projects page" }).click();
  await expect(page).toHaveURL("/projects");
  await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
});

test("static HTML has per-route SEO before JavaScript runs", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    for (const [route, meta] of Object.entries(ROUTES)) {
      await page.goto(`http://127.0.0.1:4173${route}`);
      await expect(page).toHaveTitle(meta.title);
      await expect(page.getByRole("main")).toBeVisible();
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("main")).toContainText(route === "/projects" ? "Event Central" : "Muhammad Ahmed Ashar");
      await expect(page.getByRole("link", { name: "Go to about page" })).toBeVisible();
      if (route === "/projects") await expect(page.locator("main li.card")).toHaveCount(6);
      await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", meta.description);
      await expect(page.locator(schema)).toHaveCount(1);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", `${SITE_URL}${route}`);
    }
    const response = await page.goto("http://127.0.0.1:4173/missing-page");
    expect(response.status()).toBe(404);
    await expect(page.locator(schema)).toHaveCount(0);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  } finally { await context.close(); }
});

test("blocked storage does not crash the theme provider", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", { get() { throw new DOMException("Blocked", "SecurityError"); } });
  });
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("animations remain active when the OS reports reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator("main h1")).toBeVisible();
  const ring = page.getByRole("button", { name: "Scroll to top" }).locator("..").locator(':scope > [aria-hidden="true"]');
  await expect(ring).toBeVisible();
  const initial = await ring.evaluate(node => getComputedStyle(node).transform);
  await expect.poll(() => ring.evaluate(node => getComputedStyle(node).transform)).not.toBe(initial);
});


test("prerendered image URLs and local assets resolve", async ({ request }) => {
  for (const path of ["/", "/about", "/projects"]) {
    const response = await request.get(path);
    const html = await response.text();
    expect(html).toContain('<main');
    expect(html).not.toContain('/src/assets/');
    const assets = [...html.matchAll(/(?:src|href)="(\/(?:assets|fonts)\/[^"#]+)"/g)].map(match => match[1]);
    expect(assets.length).toBeGreaterThan(0);
    for (const asset of new Set(assets)) expect((await request.get(asset)).status()).toBe(200);
  }
});

test("touch visitors can filter projects and use the footer social links", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  try {
    await page.goto("http://127.0.0.1:4173/projects");
    await page.getByRole("button", { name: "Backend", exact: true }).tap();
    await expect(page.locator("main li.card")).toHaveCount(3);
    await expect(page.getByRole("button", { name: "Scroll to top" })).toHaveCount(0);
    await expect(page.locator('svg filter#blob')).toHaveCount(0);
    await expect(page.locator("footer").getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://www.facebook.com/ahmed.ashar.58");
  } finally { await context.close(); }
});


test("returning from a scrolled page keeps offscreen reveals waiting for their viewport", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/about");
  await expect(page.locator("#education-heading .line1")).toHaveCount(1);
  // Warm the lazy route, then revisit it from far down another page.
  for (let visit = 0; visit < 2; visit++) {
    await page.getByRole("link", { name: "Go to projects page" }).click();
    await expect(page.locator("main li.card")).toHaveCount(6);
    await page.evaluate(() => window.scrollTo(0, 3000));
    await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(2500);
    await page.getByRole("link", { name: "Go to about page" }).click();
    await expect.poll(() => page.evaluate(() => scrollY)).toBeLessThan(2);
    const line = page.locator("#education-heading .line1");
    await expect(line).toHaveCount(1);
    // A full entrance duration must not consume an offscreen, once-only reveal.
    await page.waitForTimeout(1600);
    expect(await line.evaluate(el => new DOMMatrixReadOnly(getComputedStyle(el).transform).m42)).toBeGreaterThan(10);
    await page.evaluate(() => {
      const heading = document.querySelector("#education-heading");
      window.scrollTo(0, heading.getBoundingClientRect().top + scrollY - innerHeight / 2);
    });
    await expect.poll(() => line.evaluate(el => Math.abs(new DOMMatrixReadOnly(getComputedStyle(el).transform).m42))).toBeLessThan(1);
  }
});
