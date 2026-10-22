import { test, expect } from "@playwright/test";

test("public interactions and scroll milestones are recorded once and reset on navigation", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
  });
  await page.route("**/_vercel/speed-insights/**", (route) =>
    route.fulfill({ body: "" }),
  );
  await page.goto("/projects");
  await page
    .getByRole("group", { name: "Filter projects by type" })
    .getByRole("button", { name: "Frontend", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () => window.__events.filter((e) => e[1] === "portfolio_filter").length,
      ),
    )
    .toBe(1);
  await page
    .locator("[data-analytics-project]")
    .first()
    .evaluate((el) => el.setAttribute("target", "_self"));
  // Prevent navigation after the analytics listener has seen the genuine click.
  await page.route("https://**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "test project destination",
    }),
  );
  const project = await page
    .locator("[data-analytics-project]")
    .first()
    .getAttribute("data-analytics-project");
  await page
    .locator("[data-analytics-project]")
    .first()
    .evaluate((el) => (el.href = "#project-test"));
  await page
    .locator("[data-analytics-project]")
    .first()
    .click({ position: { x: 50, y: 50 } });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.__events.filter((e) => e[1] === "portfolio_project_open")
            .length,
      ),
    )
    .toBe(1);
  expect(
    await page.evaluate(
      () =>
        window.__events.find((e) => e[1] === "portfolio_project_open")[2]
          .interaction_label,
    ),
  ).toBe(project);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.__events.filter((e) => e[1] === "portfolio_scroll_90").length,
      ),
    )
    .toBe(1);
  await page.evaluate(() => {
    dispatchEvent(new Event("scroll"));
    dispatchEvent(new Event("resize"));
  });
  await page.waitForTimeout(300);
  expect(
    await page.evaluate(
      () =>
        window.__events.filter((e) => e[1] === "portfolio_scroll_90").length,
    ),
  ).toBe(1);
  expect(
    await page.evaluate(() =>
      window.__events.every((e) => !e[2].page_location.includes("?")),
    ),
  ).toBe(true);
  await page.evaluate(() => {
    history.pushState({}, "", "/about?secret=ignored");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("main h1")).toBeVisible();
  await page.waitForTimeout(600);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.__events.filter((e) => e[1] === "portfolio_scroll_90").length,
      ),
    )
    .toBe(2);
});

test("privacy opt-outs and dashboard previews do not emit custom visitor events", async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    Object.defineProperty(navigator, "globalPrivacyControl", {
      value: true,
      configurable: true,
    });
  });
  await page.goto("/projects");
  await page
    .getByRole("group", { name: "Filter projects by type" })
    .getByRole("button", { name: "Frontend", exact: true })
    .click();
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await page.waitForTimeout(650);
  expect(await page.evaluate(() => window.__events)).toEqual([]);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "globalPrivacyControl", { value: false });
    history.pushState({}, "", "/dashboard");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("main h1")).toBeVisible();
  expect(await page.evaluate(() => window["ga-disable-G-77MPKKC7BM"])).toBe(
    true,
  );
  await page.evaluate(() => {
    const frame = document.createElement("iframe");
    frame.src = "/projects?editor-preview=1";
    document.body.appendChild(frame);
  });
  const frame = page.frameLocator('iframe[src*="editor-preview"]');
  await frame.getByRole("button", { name: "Frontend", exact: true }).click();
  expect(await frame.locator("body").evaluate(() => window.__events)).toEqual(
    [],
  );
});

test("a delayed Analytics loader still receives the current scroll milestone", async ({
  page,
}) => {
  await page.route("**/_vercel/speed-insights/**", (route) =>
    route.fulfill({ body: "" }),
  );
  await page.goto("/about");
  await expect(page.locator("main h1")).toBeVisible();
  await page.waitForTimeout(600);
  await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
  await page.evaluate(() => {
    window.__events = [];
    window.gtag = (...args) => window.__events.push(args);
    dispatchEvent(new Event("portfolio-analytics-ready"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          window.__events.filter((e) => e[1] === "portfolio_scroll_90").length,
      ),
    )
    .toBe(1);
});
