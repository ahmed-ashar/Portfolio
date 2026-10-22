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
  const newProject = page.locator("details").last();
  await newProject.locator("summary").click();
  await newProject
    .getByLabel("Title", { exact: true })
    .fill("Dashboard project");
  await newProject.getByLabel("Image", { exact: true }).fill("/profile.webp");
  await page
    .getByRole("button", { name: "Save draft", exact: true })
    .first()
    .click();
  await expect(page.getByRole("status")).toContainText("Draft saved");
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
