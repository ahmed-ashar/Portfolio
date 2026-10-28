import { test, expect } from "@playwright/test";
import { randomBytes } from "node:crypto";
import { defaults } from "../src/content/schema.js";
const base = "http://127.0.0.1:4174";
const password = randomBytes(24).toString("base64url");
const post = (request, action, body = {}) =>
  request.post("/api/admin", {
    headers: { Origin: base },
    data: { action, ...body },
  });
test("admin edits, previews, saves and publishes shared content with secure sessions", async ({
  page,
  browser,
  request,
}) => {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/_vercel/speed-insights/**", (r) =>
    r.fulfill({ body: "" }),
  );
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/dashboard");
  await expect(
    page.getByRole("heading", { name: "Make it yours." }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex, follow",
  );
  expect((await request.get("/api/admin?action=content")).status()).toBe(503);
  await page.getByLabel("Create a password").fill(password);
  await page.getByLabel("Confirm password").fill(password);
  await page
    .getByRole("button", { name: "Create admin account", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Dashboard sections" }),
  ).toBeVisible();
  await page.screenshot({
    path: "artifacts/dashboard-desktop.png",
    fullPage: true,
  });
  const sessionCookie = (await page.context().cookies()).find(
    (c) => c.name === "portfolio_admin",
  );
  expect(sessionCookie.httpOnly).toBe(true);
  expect(sessionCookie.sameSite).toBe("Strict");
  const nav = page.getByRole("navigation", { name: "Dashboard sections" });
  await test.step("analytics requires an admin session and shows honest connection status", async () => {
    expect((await request.get("/api/admin?action=analytics&days=30")).status()).toBe(401);
    expect((await page.request.get("/api/admin?action=analytics&days=999")).status()).toBe(400);
    const response = await page.request.get("/api/admin?action=analytics&days=30");
    expect(response.status()).toBe(200);
    expect(response.headers()["cache-control"]).toBe("no-store");
    expect(await response.json()).toMatchObject({ configured: false });
    await nav.getByRole("button", { name: "Analytics", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Your visitors. The full picture." })).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeDisabled();
  });

  await nav.getByRole("button", { name: "Hero", exact: true }).click();
  await page.getByLabel("Lines 1", { exact: true }).fill("CREATE.");
  await expect(page.frameLocator("iframe").locator("h1")).toContainText(
    "CREATE.",
  );
  await page
    .getByRole("button", { name: "Save draft", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  expect(
    (await (await request.get("/api/content")).json()).content.home.hero
      .lines[0],
  ).toBe("THINK.");
  await page.reload();
  await nav.getByRole("button", { name: "Hero", exact: true }).click();
  await expect(page.getByLabel("Lines 1", { exact: true })).toHaveValue(
    "CREATE.",
  );
  await nav.getByRole("button", { name: "Projects", exact: true }).click();
  await page
    .getByLabel("Heading", { exact: true })
    .fill("Work made with care.");
  await page
    .getByRole("button", { name: "+ Add project", exact: true })
    .click();
  const newProject = page.locator("details").filter({ has: page.locator("#field-portfolio\\.projects\\.6\\.title") });
  await newProject.locator("summary").first().click();
  await newProject
    .locator('[id="field-portfolio.projects.6.title"]')
    .fill("Dashboard project");
  await newProject.locator('[id="field-portfolio.projects.6.image"]').fill("/profile.webp");
  const mobileField = newProject.locator(".image-field").filter({ has: page.locator('[id="field-portfolio.projects.6.mobileImage"]') });
  await mobileField.locator('input[type="file"]').setInputFiles("public/profile.webp");
  const mobileImageInput = newProject.getByLabel("Mobile image (optional)", { exact: true });
  await expect(mobileImageInput).toHaveValue(/\/api\/media\?id=/);
  const mobileImageUrl = await mobileImageInput.inputValue();
  await expect(newProject.getByLabel("Mobile image width", { exact: true })).toHaveValue("400");
  await expect(newProject.getByLabel("Mobile image height", { exact: true })).toHaveValue("400");
  await page
    .getByRole("button", { name: "Save draft", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
  await test.step("project stories are editable and previewed before publication", async () => {
    await nav.getByRole("button", { name: "Project stories", exact: true }).click();
    await page.getByLabel("Choose a project").selectOption("6");
    await page.getByLabel("Page URL slug").fill("dashboard-project");
    await page.getByLabel("GitHub repository URL").fill("https://github.com/example/project");
    const section = page.locator("details").first();
    await section.locator("summary").click();
    await page.locator('[id="field-portfolio.projects.6.story.sections.0.body"]').fill("A story written in the dashboard.\n\nThis is the second paragraph.");
    await expect(page.frameLocator("iframe").locator("main h1")).toHaveText("Dashboard project");
    await expect(page.frameLocator("iframe").locator("article")).toContainText("A story written in the dashboard.");
    await page.getByRole("button", { name: "Save draft", exact: true }).first().click();
    await expect(page.getByRole("status")).toContainText("Draft saved");
    expect((await request.get("/projects/dashboard-project")).status()).toBe(404);
  });
  await nav.getByRole("button", { name: "About page", exact: true }).click();
  await page
    .locator("input[type=file]")
    .first()
    .setInputFiles("public/profile.webp");
  await expect(page.getByLabel("Profile image", { exact: true })).toHaveValue(
    /\/api\/media\?id=/,
  );
  const imageUrl = await page
    .getByLabel("Profile image", { exact: true })
    .inputValue();
  expect((await request.get(imageUrl)).status()).toBe(200);
  await page.screenshot({
    path: "artifacts/dashboard-editor.png",
    fullPage: false,
  });
  await nav
    .getByRole("button", { name: "Search & sharing", exact: true })
    .click();
  await page
    .locator("#field-seo\\.home\\.title")
    .fill("A newly published portfolio");
  await page.getByRole("button", { name: "Publish", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Continue" })
    .click();
  await expect(page.getByRole("status")).toContainText("Published.");
  const visitor = await browser.newContext();
  const publicPage = await visitor.newPage();
  await publicPage.goto(base + "/");
  await expect(publicPage.locator("h1")).toContainText("CREATE.");
  await expect(publicPage).toHaveTitle("A newly published portfolio");
  const raw = await (await request.get("/")).text();
  expect(raw).toContain("CREATE.");
  expect(raw).toContain("<title>A newly published portfolio</title>");
  await publicPage.goto(base + "/projects");
  await expect(publicPage.getByRole("heading", { level: 1 })).toHaveText(
    "Work made with care.",
  );
  await expect(publicPage.locator("main li.card")).toHaveCount(7);
  await publicPage
    .getByRole("button", { name: "Frontend", exact: true })
    .click();
  await expect(publicPage.locator("main li.card")).toHaveCount(6);
  await publicPage.getByRole("link", { name: "Dashboard project: Read the project story", exact: true }).click();
  await expect(publicPage).toHaveURL(base + "/projects/dashboard-project");
  await expect(publicPage.locator("article")).toContainText("A story written in the dashboard.");
  await expect(publicPage.getByRole("link", { name: /View source on GitHub/ })).toHaveAttribute("href", "https://github.com/example/project");
  const storyResponse = await request.get("/projects/dashboard-project");
  expect(storyResponse.status()).toBe(200);
  expect(await storyResponse.text()).toContain("A story written in the dashboard.");
  await expect(publicPage.locator(".story-cover img")).toHaveJSProperty("currentSrc", base + "/profile.webp");
  const mobileVisitor = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  try {
    const mobilePage = await mobileVisitor.newPage();
    await mobilePage.goto(base + "/projects/dashboard-project");
    const cover = mobilePage.locator(".story-cover img");
    await cover.scrollIntoViewIfNeeded();
    await expect(cover).toHaveJSProperty("currentSrc", base + mobileImageUrl);
  } finally { await mobileVisitor.close(); }
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/projects/dashboard-project");
  await visitor.close();
  // No session can read drafts, publish, or upload; cross-site writes are rejected.
  expect((await request.get("/api/admin?action=content")).status()).toBe(401);
  expect(
    (
      await post(request, "publish", { content: defaults, revision: 0 })
    ).status(),
  ).toBe(401);
  expect(
    (
      await page.request.post("/api/admin", {
        headers: { Origin: "https://untrusted.example" },
        data: { action: "save", content: defaults, revision: 0 },
      })
    ).status(),
  ).toBe(403);
  const loaded = await (
    await page.request.get("/api/admin?action=content")
  ).json();
  expect(
    (
      await post(page.request, "save", { content: loaded.draft, revision: 0 })
    ).status(),
  ).toBe(409);
  const invalid = structuredClone(loaded.draft);
  invalid.footer.links[0].link = "javascript:alert(1)";
  expect(
    (
      await post(page.request, "save", {
        content: invalid,
        revision: loaded.revision,
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await post(page.request, "upload", {
        data: Buffer.from('<svg onload="alert(1)"></svg>').toString("base64"),
      })
    ).status(),
  ).toBe(400);
  // Exercise every editor without changing saved content; verify mobile layout.
  await page.setViewportSize({ width: 390, height: 844 });
  for (const name of [
    "Overview",
    "Hero",
    "Skills marquee",
    "Introduction",
    "Featured work",
    "Approach",
    "Section order",
    "About page",
    "Projects",
    "Navigation & identity",
    "Footer & social links",
    "Appearance",
    "Search & sharing",
    "404 page",
  ]) {
    await nav.getByRole("button", { name, exact: true }).click();
    await expect(page.locator("main h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  }
  await nav.getByRole("button", { name: "Overview", exact: true }).click();
  await page.screenshot({
    path: "artifacts/dashboard-mobile.png",
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Restore previous publication" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Continue" })
    .click();
  await expect(page.getByRole("status")).toContainText(
    "Previous publication loaded as a draft",
  );
  // A restore is a draft, never an accidental public rollback.
  expect(
    (await (await request.get("/api/content")).json()).content.home.hero
      .lines[0],
  ).toBe("CREATE.");
  await page.getByRole("button", { name: "Sign out" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Continue" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Welcome back." }),
  ).toBeVisible();
  const replay = await request.get("/api/admin?action=content", {
    headers: { Cookie: "portfolio_admin=" + sessionCookie.value },
  });
  expect(replay.status()).toBe(401);
  await page.getByLabel("Admin password").fill("wrong-password");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("Incorrect password");
  await page.getByLabel("Admin password").fill(password);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(
    page.getByRole("navigation", { name: "Dashboard sections" }),
  ).toBeVisible();
  await test.step("published special text stays data in SSR, JSON-LD and hydration", async () => {
    const current = await (await page.request.get("/api/admin?action=content")).json();
    const content = structuredClone(current.published);
    const specialText = [
      'Quotes " & < > \u2028\u2029',
      "$& $` $' $$",
      '</sCrIpT><div id="cms-injected">Injected</div><script>window.__cmsInjected = true</script><!--',
    ].join(" ");
    content.identity.name = specialText;
    content.about.about.heading = specialText;
    content.seo.about.description = specialText;
    const published = await post(page.request, "publish", {
      content,
      revision: current.revision,
    });
    expect(published.status()).toBe(200);

    const response = await request.get("/about");
    expect(response.status()).toBe(200);
    const html = await response.text();
    const embedded = html.match(/<script id="portfolio-content" type="application\/json">([\s\S]*?)<\/script>/i)?.[1];
    const structured = html.match(/<script id="site-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/i)?.[1];
    expect(embedded).toBeDefined();
    expect(structured).toBeDefined();
    expect(JSON.parse(embedded)).toEqual(content);
    expect(JSON.parse(structured)[0].name).toBe(specialText);
    expect(embedded).not.toContain("<");
    expect(structured).not.toContain("<");

    for (const javaScriptEnabled of [false, true]) {
      const context = await browser.newContext({ javaScriptEnabled });
      try {
        const visitorPage = await context.newPage();
        const visitorErrors = [];
        visitorPage.on("pageerror", error => visitorErrors.push(error.message));
        visitorPage.on("console", message => {
          if (message.type() === "error" && /hydration|hydrating|Minified React error/i.test(message.text())) {
            visitorErrors.push(message.text());
          }
        });
        await visitorPage.route("**/_vercel/speed-insights/**", route => route.fulfill({ body: "" }));
        await visitorPage.goto(base + "/about");
        await expect(visitorPage.locator("main h1")).toHaveText(specialText);
        await expect(visitorPage.locator("#cms-injected")).toHaveCount(0);
        await expect(visitorPage.locator("#portfolio-content")).toHaveCount(1);
        expect(JSON.parse(await visitorPage.locator("#portfolio-content").textContent())).toEqual(content);
        expect(JSON.parse(await visitorPage.locator("#site-structured-data").textContent())[0].name).toBe(specialText);
        await expect(visitorPage.locator('meta[name="description"]')).toHaveAttribute("content", specialText);
        if (javaScriptEnabled) {
          await visitorPage.getByRole("button", { name: "Switch to light theme" }).click();
          await expect(visitorPage.locator("html")).toHaveAttribute("data-theme", "light");
          expect(await visitorPage.evaluate(() => window.__cmsInjected)).toBeUndefined();
        }
        expect(visitorErrors).toEqual([]);
      } finally {
        await context.close();
      }
    }
  });
  expect(errors).toEqual([]);
});

test("dashboard supports wheel, keyboard and touch scrolling without blocking the website", async ({
  page,
  browser,
}) => {
  const mockAdmin = async (target) => {
    await target.route("**/api/admin*", (route) =>
      route.fulfill({
        json: route.request().url().includes("action=content")
          ? {
              revision: 0,
              draft: defaults,
              published: defaults,
              publishedAt: null,
              previous: null,
            }
          : {
              configured: true,
              authenticated: true,
              storage: "Local development",
            },
      }),
    );
    await target.route("**/api/content", (route) =>
      route.fulfill({ json: { content: defaults } }),
    );
    await target.route("**/_vercel/speed-insights/**", (route) =>
      route.fulfill({ body: "" }),
    );
  };
  await mockAdmin(page);
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto("/dashboard");
  const nav = page.getByRole("navigation", { name: "Dashboard sections" });
  await nav.getByRole("button", { name: "About page", exact: true }).click();
  await page.mouse.move(265, 450);
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(500);
  await page.mouse.click(265, 450);
  await page.keyboard.press("End");
  await expect(page.locator(".editor-footer")).toBeInViewport();
  // The sidebar has its own scroll area on shorter screens.
  await page.mouse.move(100, 450);
  await page.mouse.wheel(0, 1200);
  await expect
    .poll(() => page.locator(".studio-sidebar").evaluate((el) => el.scrollTop))
    .toBeGreaterThan(100);
  await nav.getByRole("button", { name: "Appearance", exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await nav.getByRole("button", { name: "About page", exact: true }).click();
  await page.locator("iframe").waitFor();
  const preview = page
    .frames()
    .find((frame) => frame.url().includes("editor-preview"));
  await expect.poll(() => preview?.locator("main").count() ?? 0).toBe(1);
  // The preview frame arrives with server-rendered markup and replaces it with
  // the lazy route after hydration, so wait until the page is tall enough to
  // scroll before sending the wheel.
  await expect
    .poll(() => preview.evaluate(() => document.documentElement.scrollHeight))
    .toBeGreaterThan(2000);
  const bounds = await page.locator(".preview-screen").boundingBox();
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 250);
  await page.mouse.wheel(0, 1000);
  await expect.poll(() => preview.evaluate(() => scrollY)).toBeGreaterThan(100);
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await page.screenshot({
    path: "artifacts/dashboard-dark-editor.png",
    fullPage: false,
  });
  // Client-side navigation must destroy and recreate the public scrolling wrapper.
  await page.evaluate(() => {
    history.pushState({}, "", "/");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(page.locator("main h1")).toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.mouse.move(700, 450);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  await page.evaluate(() => {
    history.pushState({}, "", "/dashboard");
    dispatchEvent(new PopStateEvent("popstate"));
  });
  await expect(nav).toBeVisible();
  await nav.getByRole("button", { name: "About page", exact: true }).click();
  await page.mouse.move(265, 450);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(100);
  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  try {
    const mobilePage = await mobile.newPage();
    await mockAdmin(mobilePage);
    await mobilePage.goto(base + "/dashboard");
    await mobilePage
      .getByRole("navigation", { name: "Dashboard sections" })
      .getByRole("button", { name: "About page", exact: true })
      .click();
    const cdp = await mobile.newCDPSession(mobilePage);
    await cdp.send("Input.dispatchTouchEvent", {type:"touchStart",touchPoints:[{x:375,y:700}]});
    for (let y=650;y>=150;y-=50) {
      await cdp.send("Input.dispatchTouchEvent", {type:"touchMove",touchPoints:[{x:375,y}]});
      await mobilePage.waitForTimeout(25);
    }
    await cdp.send("Input.dispatchTouchEvent", {type:"touchEnd",touchPoints:[]});
    await expect
      .poll(() => mobilePage.evaluate(() => scrollY))
      .toBeGreaterThan(300);
    expect(
      await mobilePage.evaluate(
        () => document.documentElement.scrollWidth - innerWidth,
      ),
    ).toBeLessThanOrEqual(1);
  } finally {
    await mobile.close();
  }
});

test("analytics charts, comparisons, ranges, export and mobile states work with controlled report fixtures", async ({ page }) => {
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  let mode = "ready";
  const metrics = { totalUsers: 1248, activeUsers: 1100, newUsers: 840, sessions: 1820, engagedSessions: 1256, screenPageViews: 4932, userEngagementDuration: 145600, averageSessionDuration: 126, engagementRate: 0.69 };
  const report = days => ({
    configured: true, days, provider: "Google Analytics 4", timezone: "Asia/Karachi", host: "ahmed-ashar.vercel.app", startDate: "2026-09-23", endDate: "2026-10-22", generatedAt: "2026-10-23T10:00:00Z",
    current: mode === "empty" ? Object.fromEntries(Object.keys(metrics).map(key => [key, 0])) : metrics,
    previous: { ...metrics, totalUsers: 980, sessions: 1400, screenPageViews: 3600, engagementRate: 0.61 },
    trend: Array.from({ length: days }, (_, i) => ({ dateLabel: new Date(Date.UTC(2026, 9, 23 - days + i)).toISOString().slice(0, 10), totalUsers: mode === "empty" ? 0 : 20 + i * 3 + i % 5 * 10, screenPageViews: mode === "empty" ? 0 : 70 + i * 7, sessions: mode === "empty" ? 0 : 30 + i * 4 })),
    pages: mode === "empty" ? [] : [{ pagePath: "/", screenPageViews: 2400, totalUsers: 1080, userEngagementDuration: 42000 }, { pagePath: "/projects", screenPageViews: 1800, totalUsers: 720, userEngagementDuration: 72000 }, { pagePath: "/about", screenPageViews: 732, totalUsers: 450, userEngagementDuration: 31600 }],
    sources: mode === "empty" ? [] : [{ sessionSourceMedium: "google / organic", sessions: 840 }, { sessionSourceMedium: "(direct) / (none)", sessions: 610 }, { sessionSourceMedium: "linkedin.com / referral", sessions: 290 }, { sessionSourceMedium: '=HYPERLINK("https://example.com")', sessions: 1 }],
    devices: mode === "empty" ? [] : [{ deviceCategory: "mobile", sessions: 1092 }, { deviceCategory: "desktop", sessions: 655 }, { deviceCategory: "tablet", sessions: 73 }],
    countries: mode === "empty" ? [] : [{ country: "Pakistan", totalUsers: 620 }, { country: "United States", totalUsers: 330 }, { country: "United Kingdom", totalUsers: 160 }, { country: "United Arab Emirates", totalUsers: 138 }],
    events: mode === "empty" ? [] : [{ eventName: "portfolio_project_open", eventCount: 240, totalUsers: 160 }, { eventName: "portfolio_contact", eventCount: 42, totalUsers: 31 }, { eventName: "portfolio_filter", eventCount: 185, totalUsers: 120 }, { eventName: "portfolio_navigation", eventCount: 610, totalUsers: 450 }],
    scroll: mode === "empty" ? [] : [25, 50, 75, 90].flatMap((depth, i) => [{ pagePath: "/", eventName: `portfolio_scroll_${depth}`, eventCount: 1100 - i * 230 }, { pagePath: "/projects", eventName: `portfolio_scroll_${depth}`, eventCount: 700 - i * 140 }]),
    details: { available: true, rows: mode === "empty" ? [] : [{ eventName: "portfolio_project_open", "customEvent:interaction_label": "Event Management Platform", eventCount: 86, totalUsers: 61 }, { eventName: "portfolio_filter", "customEvent:interaction_label": "Frontend", eventCount: 76, totalUsers: 55 }] },
    quality: {},
  });
  await page.route("**/api/admin*", route => {
    const url = new URL(route.request().url());
    if (url.searchParams.get("action") === "analytics") return mode === "error" ? route.fulfill({ status: 503, json: { error: "Google Analytics is temporarily unavailable." } }) : route.fulfill({ json: report(Number(url.searchParams.get("days"))) });
    return route.fulfill({ json: url.searchParams.get("action") === "content" ? { revision: 0, draft: defaults, published: defaults } : { configured: true, authenticated: true, storage: "Local development" } });
  });
  await page.route("**/_vercel/speed-insights/**", route => route.fulfill({ body: "" }));
  await page.setViewportSize({ width: 1600, height: 1050 });
  await page.goto("/dashboard");
  await page.getByRole("navigation", { name: "Dashboard sections" }).getByRole("button", { name: "Analytics", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Audience over time" })).toBeVisible();
  await expect(page.locator("iframe")).toHaveCount(0);
  await expect(page.getByRole("region", { name: "Audience metrics" })).toContainText("1,248");
  await page.getByRole("button", { name: "Page views", exact: true }).click();
  await expect(page.getByRole("button", { name: "Page views", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Scroll depth page").selectOption("/projects");
  await expect(page.locator(".analytics-scroll-bars")).toContainText("700");
  await page.getByLabel("Sort by").selectOption("userEngagementDuration");
  await expect(page.locator(".analytics-pages tbody tr").first()).toContainText("/projects");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export CSV" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const csv = Buffer.concat(chunks).toString("utf8");
  expect(csv).toContain("' =HYPERLINK".replace("' ", "'"));
  expect(csv).toContain("Current");
  expect(csv).toContain("4932");
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: "artifacts/analytics-desktop.png", fullPage: true });
  await page.getByLabel("Period", { exact: true }).selectOption("7");
  await expect(page.locator(".analytics-trend .chart-point")).toHaveCount(7);
  await page.setViewportSize({ width: 390, height: 844 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  await page.screenshot({ path: "artifacts/analytics-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Visits", exact: true }).click();
  await page.locator(".chart-point").first().focus();
  await page.keyboard.press("Enter");
  await expect(page.locator(".analytics-chart-value")).toContainText("30");
  mode = "empty";
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Your next visit starts the story." })).toBeVisible();
  mode = "error";
  await page.getByRole("button", { name: "Refresh", exact: true }).click();
  await expect(page.getByRole("alert")).toContainText("temporarily unavailable");
  await expect(page.getByRole("button", { name: "Export CSV" })).toBeDisabled();
  mode = "ready";
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByRole("heading", { name: "Audience over time" })).toBeVisible();
  expect(errors).toEqual([]);
});
