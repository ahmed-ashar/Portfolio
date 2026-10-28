# Ahmed Ashar Portfolio: complete AI project reference

Last verified against the working tree: 2026-10-22.
Workspace at verification: `D:\ahmed`, Windows PowerShell, Asia/Karachi.
This is the single consolidated AI handover requested by the owner. The owner explicitly requested that this root `AGENTS.md` be included in Git; `.gitignore` has a final `!/AGENTS.md` exception. Other AI notes remain ignored. `.vercelignore` still excludes this instruction file from deployment uploads. It is a maintainer reference, separate from the public-facing README.

## 1. Read first: owner intent and working boundaries

- The owner is Muhammad Ahmed Ashar. He usually communicates in Roman Urdu. Explain outcomes plainly and keep user-facing replies concise unless he asks for detail.
- He wants a clean GitHub repository with project source, assets, configuration, tests and useful documentation. His latest explicit exception allows this one consolidated root `AGENTS.md` in Git. Other AI instructions/history, scratch scripts, screenshots from testing, credentials and generated junk must stay local.
- He explicitly chose to push the repository himself. Do not stage, commit, push, create remote repositories or deploy just because this document mentions release steps. A later explicit owner request can authorize them.
- He requested exactly ONE new AI reference file. Maintain this file as the consolidated handover; do not scatter new memory files around the project.
- Preserve existing uncommitted work. Do not reset Git, restore obsolete assets, overwrite local CMS records or replace the project with a new template.
- The dashboard must use the same visual language as the portfolio. Native dashboard scrolling, functional project filters, real server authentication and shared live storage are explicit product requirements.
- This document records behavior and limitations; its troubleshooting/extension sections are reference material, not an instruction to perform all those changes automatically.
- Current source and the owner's latest instructions take precedence over this snapshot. Recheck Git state, dependencies and actual deployment configuration before making claims about a future session.
- Historical files `PROJECT_STATUS.md`, `SESSION_NOTES.md` and `docs/DESIGN_SYSTEM.md` still exist locally and are ignored. They contain superseded information. In particular, ignore old instructions to immediately commit, old claims that there is no backend/environment configuration, old hero copy, old removed-Facebook notes, and the old assertion that `dist-ssr/` is never needed in deployment. This file explains the current implementation without requiring those logs.
- Do not copy secrets into this document. No passwords, password hashes, session cookies or Blob tokens belong here. Do not read `.local/cms/credentials.json`, `auth.json` or environment files merely to understand the code.

## 2. Product, scope and current delivery state

Repository origin: `https://github.com/ahmed-ashar/Portfolio.git`.
Public website address used in defaults: `https://ahmed-ashar.vercel.app`.
Primary public routes: `/`, `/about`, `/projects`. Administration route: `/dashboard`.

The product is a React portfolio with a custom content dashboard, backed by Node.js request handlers. It is not a frontend-only localStorage editor, a Next.js app, an Express server, or a MongoDB application. MERN, Firebase and CMS platform names appear in the owner's skills and showcased work; they do not describe this repository's storage implementation.

The dashboard edits the content model implemented in this repository: copy, projects, images, categories, section order/visibility, navigation labels, footer/social links, theme colors, font choice and metadata. It does not edit arbitrary React source, add arbitrary route types, generate new components, or expose every CSS/animation parameter. It is a single-administrator password system, not a multi-user account service.

At the verification date:

- Local website and dashboard implementation are present and tested.
- Local admin credentials already exist. Do not rerun first-time setup against the owner's store or erase it to make tests pass.
- No new commit or push was made by the assistant. The working tree contains extensive changes relative to the old commit; this is intentional.
- Branch was `main`, HEAD `df10785` (`Merge pull request #2 from ahmed-ashar/vercel/install-vercel-speed-insights-qrpbeo`). No commits were ahead of the locally recorded `origin/main`. This was not a fresh remote fetch.
- Git Credential Manager had authenticated account `ahmed-ashar`. The global safe-directory exception for exactly `D:/ahmed` fixed a Windows ownership mismatch. Revalidate this in another environment; a configured remote is not proof of authentication.
- Live Vercel Blob connection, admin environment setup and deployment of these changes remain unverified/pending. Do not describe the new dashboard as already deployed.
- Latest local checks: lint passed, client/SSR build passed, 42 public browser tests passed, 2 dashboard browser tests passed, dependency audit reported zero vulnerabilities. These are dated results, not a permanent security guarantee.
- README was subsequently polished and its real homepage screenshot added. Its local links and whitespace were verified. Documentation-only changes did not require repeating the whole browser suite.

## 3. Architecture and execution modes

```text
Public visitor
  Vercel route rewrite -> api/page.js -> server/page.mjs
    -> publishedContent() -> server/store.mjs -> private Blob content.json
    -> getSeo(content) + dist-ssr renderer + dist/template.html
    -> complete HTML + embedded public content
    -> browser hydrates src/main.jsx -> Shell -> App -> public page
    -> ContentProvider fetches /api/content once on mount

Administrator
  /dashboard -> status check -> password sign-in -> authenticated content load
    -> in-memory editor draft -> same-origin iframe preview
    -> Save draft / Publish / Restore POST /api/admin
    -> server validates origin, session, revision and content
    -> local file store or private Vercel Blob
```

| Mode | Entry and behavior |
| --- | --- |
| `npm run dev` | Vite on loopback, normally port 5173. Vite middleware handles `/api/admin`, `/api/content`, `/api/media`. Public pages start from the dev HTML shell and mount React. No Vercel project is required. |
| `npm run build` | Builds client assets, builds a separate SSR bundle, then prerenders default-content HTML and SEO. Does not publish CMS content or deploy. |
| Production review | `node scripts/review-server.mjs`, normally 4173. Serves build assets, calls the actual CMS/page handlers and applies configured global security headers. Requires a completed build. |
| Dashboard tests | Dedicated review server on 4174 with a new `.local/cms-test-<UUID>` store. Does not use the owner's CMS data. |
| `npm run preview` | Plain Vite preview of static build output. The CMS middleware is attached to Vite's development hook, not its preview hook. Do not use this to conclude the backend/dashboard is broken or fully validated. |
| Vercel | `VERCEL` being truthy switches storage to private Blob. Functions and route rewrites handle current published content. Read-only deployment files are not the database. |

There is no WebSocket/SSE subscription or polling loop for publication. A newly loaded public page gets current content; an already-open page is not guaranteed to update immediately when another browser publishes.

## 4. File map: boot, routing, server and tooling

All paths below are relative to the repository root. `src/utilis/` is the actual existing spelling.

| File | Responsibility and important connections |
| --- | --- |
| `package.json` | ESM package, scripts, dependency ranges and Node engine. Package `private: true` prevents accidental npm publication; it does not make the GitHub repository private. |
| `package-lock.json` | Exact dependency resolution used by `npm ci`; retain in Git. |
| `index.html` | Empty root, preload fonts, external theme/analytics scripts and `<!--seo-start-->` / `<!--seo-end-->` replacement markers. Preserve the literal `<div id="root"></div>` placeholder. |
| `src/main.jsx` | Registers ScrollTrigger; reads optional `portfolio-content` JSON; creates StrictMode/Shell; uses `hydrateRoot` for server HTML and `createRoot` for an empty development root. |
| `src/Shell.jsx` | ContentProvider -> MotionConfig -> ThemeProvider -> Router -> RouteExperience. Uses BrowserRouter normally and injectable StaticRouter during SSR. Public routes get ReactLenis; dashboard deliberately does not. |
| `src/App.jsx` | Lazy public/dashboard routes, case-sensitive explicit routes, wildcard 404, skip link, Seo, ErrorBoundary, Suspense and SpeedInsights. Routes are keyed by content revision to rebuild animated DOM after content changes. |
| `src/entry-server.jsx` | Exports `render(pathname, initialContent)`. Uses StaticRouter and the same Shell through React `renderToPipeableStream`; waits for all lazy routes, collects stream output, aborts after 30 seconds. |
| `src/context/ContentContext.jsx` | Published/default/embedded content, one-time public fetch and iframe message receiver. Exports `useContent`, `useContentRevision`. Validates incoming content before applying. |
| `src/context/ThemeContext.jsx` | Theme selection, current content palette, CSS variables and localStorage theme persistence. Exports ThemeProvider/useTheme. |
| `src/content/defaults.json` | Full content object, version 1. Source for initial/fallback content and the shape against which all content is validated. |
| `src/content/schema.js` | Shared `validateContent`, defaults export and templates for new project/social/about array entries. Used by backend, dashboard and public content provider. |
| `server/cms.mjs` | Public content/media endpoints and all admin actions; auth, password hashing, cookies, origin/body validation, uploads, revisions, save/publish/restore, error handling. |
| `server/store.mjs` | Storage adapter: local JSON/media files or private Vercel Blob. ETags for cloud writes, atomic local record replacement. |
| `server/page.mjs` | Published-content SSR, runtime head tags, embedded JSON, dynamic sitemap and robots. Loads built renderer and HTML template. |
| `server/vite-cms.mjs` | Vite development plugin. Loads only ADMIN_PASSWORD_HASH and CMS_DATA_DIR from Vite env loading into Node process env; intercepts three CMS endpoint paths. |
| `api/admin.js` | Default re-export of CMS handler for Vercel. |
| `api/content.js` | Default re-export of CMS handler for Vercel; filename gives the public content endpoint. |
| `api/media.js` | Default re-export of CMS handler for Vercel; filename gives image-serving endpoint. |
| `api/page.js` | Default re-export of runtime page handler. |
| `src/seo.js` | `getSeo(content)`, canonical route metadata, Person/WebSite JSON-LD, dashboard/404 metadata; also exports default-derived constants for build/tests. |
| `scripts/build-seo.mjs` | Post-build generator: preserves original built shell as template, renders default HTML for public routes/404, writes sitemap and robots. |
| `scripts/admin-password.mjs` | Interactive hidden-input password/hash utility. Writes only to ignored `.local/admin-password.hash`; does not set Vercel variables automatically. |
| `scripts/review-server.mjs` | Local production-output HTTP server, global security headers, CMS and runtime rendering routes, static files and 404 handling. Not a production hosting daemon. |
| `scripts/dashboard-test-server.mjs` | Starts the review server on 4174 for isolated dashboard tests. |
| `scripts/visual-review.mjs` | Captures 390/1440px dark/light screenshots for Home/About/Projects/404 into ignored artifacts. Masks live clock/scramble and rotating decoration for comparisons. |
| `vite.config.js` | React, Tailwind and CMS plugins; loopback host; dev fs restrictions; manual vendor chunks; ES2020 client build target. |
| `vite.ssr.config.js` | SSR entry/output configuration. Bundles react-router, react-router-dom, GSAP, @gsap/react and simple-parallax-js as noExternal for server rendering. |
| `vercel.json` | Function tracing includes, exact public/dashboard rewrites, security headers, caching, clean URLs and no trailing slashes. |
| `eslint.config.js` | Flat ESLint config, browser vs Node globals, React/hooks/refresh rules, JSX usage recognition, key and unsafe-HTML checks, generated-output ignores. |
| `playwright.config.js` | Public suite, 2 workers, port 4173, 30-second tests, no existing-server reuse; excludes dashboard.spec.js. |
| `playwright.dashboard.config.js` | Dashboard suite, 1 worker, 60-second tests, 10-second action timeout, port 4174, isolated CMS_DATA_DIR and separate artifacts output. |
| `.github/workflows/quality.yml` | Ubuntu/Node 22 CI: npm ci, install Chromium, npm run check, npm audit --audit-level=high; uploads failure artifacts with 7-day retention. |
| `.gitignore` | Excludes secrets, local data, dependencies, generated output, caches and AI files. Does not untrack something already committed. |
| `.vercelignore` | Excludes local secrets, AI notes and review output from deployment uploads. Different role from .gitignore. |
| `README.md` | Public GitHub-facing overview, image, architecture summary and setup commands. No AI handover instructions belong there. |
| `docs/DASHBOARD.md` | Public operational documentation for dashboard setup, editing, publishing and backups. Keep it in Git. |
| `docs/images/homepage.png` | Deliberate README asset: real local homepage capture, dark theme, 1600x1000. Keep it in Git; not a temporary test screenshot. |

The three CMS API entry files contain identical re-exports deliberately. They are distinct Vercel endpoints, not junk duplicates.

## 5. Browser bootstrap, hydration and navigation flow

1. `index.html` runs `public/theme.js` before first paint and preloads Aladin/Red Hat Mono Latin fonts. Analytics is a deferred external script.
2. Runtime SSR injects public content as inert JSON in `#portfolio-content`. Build-time static pages render defaults and do not embed this extra block.
3. `main.jsx` constructs the same StrictMode/Shell tree as SSR. It hydrates existing markup, otherwise mounts the app.
4. ContentProvider initializes from embedded content or defaults. Outside a preview iframe, it requests `/api/content` once. It accepts only validated content; failed/invalid responses leave the current content intact.
5. Content changes increment an in-memory revision only when JSON differs. This revision is separate from the server's saved-content concurrency counter.
6. `App` keys Routes by the provider revision. Content updates remount route components so SplitText and scroll effects rebuild around the new markup. Do not remove this without solving animation lifecycle updates another way.
7. `Seo` follows location and content. Case-sensitive routing and metadata must agree: `/ABOUT` is a 404, not the About page.
8. `ScrollToTop` runs in `useLayoutEffect` and must precede App in Shell, so incoming once-only ScrollTriggers are initialized after the old page scroll is reset. It calls `lenis.reset()` to synchronize native scroll/cancel unfinished movement, then `scrollTo(0, { immediate: true, force: true })`; without Lenis it uses instant native scrolling. Lenis scrollTo skips same-target calls, so reset is needed when targetScroll is zero but actual scroll is not. A passive effect runs too late: cached route revisits can consume offscreen reveals before the visitor reaches them. The browser regression in tests/portfolio.spec.js revisits About from a deeply scrolled Projects page twice, verifies an offscreen heading stays hidden, then verifies it reveals on scroll. This test failed before the fix and passes afterward (2026-10-23); targeted navigation, motion and analytics tests also passed, along with lint and client/SSR build.
9. Suspense shows a brand-colored full-height fallback. ErrorBoundary catches render failures within the route subtree; it logs details and offers reload/home navigation. It is not an API/network error handler and does not automatically reset on route changes.
10. Hydration-sensitive values are deferred: Time begins empty, useMediaQuery has a false server snapshot, useHydrated returns false on the server, and ThemeContext resolves dark during initial hydration. Avoid rendering viewport-dependent content or Date.now directly into SSR output.

## 6. Public pages and every component's role

### Home

`src/pages/Home.jsx` maps fixed section keys to components and iterates `home.order`. It renders only sections whose `enabled` is true, inside SiteLayout and one `main#main-content`.

| Section key / file | Behavior |
| --- | --- |
| `home.hero` / `src/components/Hero.jsx` | Full-screen hero, editable lines, 1-based accent line and optional DotGrid. Current copy: THINK. / DESIGN. / DEVELOP / WITH CARE. Extra rule highlights the first word of the fourth line, and an accent bar follows the third. Longest line >18 characters triggers a dynamic font-size clamp. These composition details remain code-controlled. |
| `home.marquee` / `src/components/ScrollVelocitySlide.jsx` | Passes editable strings and speed to ScrollVelocity; background uses the shared text color. |
| `home.intro` / `src/components/AboutSection.jsx` | Large low-contrast ABOUT ME watermark, scroll-blurred body copy, magnetic wrapper and real link CTA. |
| `home.featured` / `src/components/ProjectSection.jsx` | Selects projects where visible && featured, then slices to featured.count. Sticky stacked image cards, large heading, scoped GSAP shrink/fade-on-scroll, CTA to project list. Cleans up its own tweens/triggers only. |
| `home.approach` / `src/components/QuoteSection.jsx` | APPROACH watermark, decorative quote SVG, blockquote through ScrollReveal and caption. Name remains QuoteSection even though current content is an approach statement. |

### About

`src/pages/About.jsx` places `src/components/AboutPage.jsx` in SiteLayout. AboutPage owns its main landmark. Optional circular profile image is eager/high-priority with 400x400 intrinsic dimensions. Bio heading, paragraphs and closing appear first. Reorderable subsections follow `about.order`, with headings/visibility from `about.sections`: skills, education, experience, certificate, contact. The biography/profile itself is not part of that reorder list. Skills are simple rectangular badges. Dates stay separate using shrink-0. HTTP contact URLs open a new tab with safe rel; mailto/local links do not. Resume is an existing external Google Drive URL, not a stored PDF in this repository.

### Projects and filter flow

`src/pages/Projects.jsx` applies SiteLayout's project-specific overflow wrapper. `src/components/ProjectPage.jsx`:

1. Reads `portfolio.projects`, discarding invisible records.
2. Creates buttons from `[allLabel, ...categories]`.
3. Keeps the selected filter in local React state, initially allLabel.
4. All shows every visible project; a category shows records whose tags array includes that exact string.
5. Produces repeating single, 40/60 and 60/40 card rows; paired cards stack below the lg breakpoint. Tailwind widths are complete literal class strings, never dynamically interpolated fragments.
6. Renders an editable empty state when no rows match. Results wrapper has aria-live=polite.
7. Each card is one outer anchor with an accessible description and safe external-link rel. First displayed project image is eager; other images are lazy.

Critical regression: the filter button group must remain outside TextReveal/SplitText. SplitText's DOM rewriting previously broke React interaction under StrictMode and also hid controls from assistive technology. `aria: none` alone does not solve every DOM ownership issue. Tests cover actual mouse, Enter, Space and touch filtering, not just selected-button styling.

Default filter counts: All 6, Frontend 5, Backend 3, MERN Stack 4. Current projects and images:

| Project | Image | Tags |
| --- | --- | --- |
| Event Central | `public/images/Project6.webp` | MERN Stack, Frontend, Backend |
| FoodSpot Frontend | `public/images/5.webp` | Frontend, MERN Stack |
| FoodSpot Backend | `public/images/4.webp` | MERN Stack, Backend |
| Homyz Website | `public/images/Project3.webp` | Frontend |
| Resume Builder | `public/images/Project1.webp` | MERN Stack, Backend, Frontend |
| Ahmed Ashar Portfolio (This Site) | `public/images/7.webp` | Frontend |

### Shared layout, links and 404

| Component | Important behavior |
| --- | --- |
| `src/components/SiteLayout.jsx` | Gray 0.55rem outer frame, rounded dark content, Navbar, optional BlobCursor, page children, optional social/back-to-top utilities and dock. Footer sits outside the framed content. Body bottom margin is 79vh when footer enabled, 0 when disabled, restored on cleanup. |
| `src/components/Navbar.jsx` | Fixed brand link, rotating taglines on sm+ screens, editable location and optional Time. Scroll listener reveals gradient/backdrop after scrolling starts. |
| `src/components/Time.jsx` | Intl.DateTimeFormat using editable timeZone (default Asia/Karachi), ticking every second with interval cleanup. Does not use the visitor's timezone for Karachi display. |
| `src/components/DockComp.jsx` | Home/About/Projects links plus theme button, editable visible labels, current-route state. Uses Dock animation primitive. |
| `src/components/Button.jsx` | Shared magnetic CTA using React Router Link, not button+imperative navigate. Preserves crawlability and normal link behavior. |
| `src/components/ProjectCard.jsx` | Title/description overlay and decorative arrow inside a project anchor. Never introduce another nested anchor here. |
| `src/components/Icons.jsx` | Social sidebar from footer.links where showInSidebar=true. Known names Instagram/Facebook/LinkedIn/GitHub map to icons; other names use a link icon. Hidden below sm; footer links still serve mobile visitors. |
| `src/components/BackToTop.jsx` | Real keyboard-accessible button using Lenis or native fallback; rotating BACK*TO*TOP* ring. Not mounted below 640px to avoid running invisible animation. It replaced the misleading ChatBot name; no chatbot service exists. |
| `src/components/FooterSection.jsx` | Fixed 80vh reveal footer behind content, editable multiline heading, mailto email, address, external links and decorative watermark. No contact form or outbound-email backend. |
| `src/pages/NotFound.jsx` | Editable 404 title/body, suggested real links, no social/back-to-top utilities. Other shared-frame settings still apply. No canonical or Person/WebSite schema, noindex metadata. |
| `src/components/Seo.jsx` | Mutates existing head elements after navigation/content updates rather than duplicating them. Removes/restores canonical/schema correctly for 404 and dashboard. |
| `src/components/ErrorBoundary.jsx` | User-friendly render-crash screen with hard-coded contact email and home link. That fallback copy is not dashboard-editable. |

## 7. Content model, constraints and schema evolution

The exact model is `src/content/defaults.json`, currently `version: 1`. A full path/type/default appendix is generated at the end of this file. This section explains semantics rather than requiring a future AI to infer them from labels.

- `identity`: brand text, person/site names, role, location/city/country/timeZone, rotating taglines, visibility toggles and navigation labels. Shared across Navbar, DockComp, layout utilities, Time and SEO.
- `appearance`: font plus dark/light maps. Internal names black/gray/textOff/orange mean background/surface/text/accent even when a light palette uses green as the accent.
- `home`: ordered fixed sections hero, marquee, intro, featured, approach. Each section has enabled; other fields drive its corresponding component. Featured count limits visible AND featured projects in their array order.
- `about`: biography object named `about` inside the top-level about object, profile settings, skills and record arrays, fixed subsection order and heading/enabled settings.
- `portfolio`: page heading/intro, allLabel, empty message, categories and project objects. Project title currently doubles as a React key; there is no persistent project ID field.
- `footer`: global visibility, multiline heading/address, email and social link records. showInSidebar affects sidebar selection and SEO sameAs, not whether a link appears in the footer.
- `seo`: canonical site origin, share image/alt, home/about/projects title/description.
- `notFound`: display heading/body and separate SEO title/description.

`validateContent(value)` returns the same value on success and throws a readable Error on failure. It does not silently merge missing fields, strip unknown fields or migrate old backups.

Validation details:

1. Recursively checks against the defaults' structure. Object extra keys are rejected; every default property is required. Types must match, numbers must be finite. Arrays are at most 100 items and each item is checked against the first default sample.
2. Strings are limited to 10,000 characters. Control characters below code point 32 are rejected except newline, carriage return and tab.
3. Fields named link/buttonLink allow HTTP(S), mailto, tel, single-slash local URLs or fragment links. Protocol-relative URLs, backslash local paths and javascript URLs are rejected.
4. Fields named image/profile allow HTTPS or single-slash local paths. Data URLs and arbitrary SVG source are not accepted as content image URLs.
5. allLabel must be nonempty and not equal to a category. Version must equal 1.
6. Home and About order arrays must contain exactly the expected fixed keys once each. They cannot omit, duplicate or invent section identifiers.
7. All palette colors must be six-digit hex values.
8. At least one tagline, hero line and marquee text is required. Hero accentLine must lie between 1 and the number of lines; integer validation for that field is not currently explicit.
9. Featured count must be an integer from 1 through 100. Absolute marquee speed must not exceed 500.
10. Project titles must be nonblank and image dimensions positive. Width/height integers and image authenticity are not established by this content validator.
11. Project titles, category names, skill names and footer link names must be unique and nonblank. Other record arrays do not receive the same uniqueness check.
12. Timezone must be accepted by Intl.DateTimeFormat. Site URL must be an HTTPS origin with no trailing slash/path. Footer email uses a basic non-whitespace email pattern.
13. Tags are checked as strings but are not required to belong to categories. Appearance font is a string; the UI limits choices but the schema does not impose that enum.

Consequences for changes:

- Adding a required default field breaks validation of existing stored records/backups unless a migration or compatibility layer is introduced. Updating only defaults is insufficient.
- Changes to section keys affect defaults, validator order expectations, Home/About render maps and dashboard section descriptors together.
- Adding an object-array type needs a template if users must add its first entry when the list is empty. Current templates cover projects, footer links, education, experience, certificate and contact.
- Schema version is a marker only; no migration engine currently exists.
- Public defaults are fallback/initial values. Editing defaults does not overwrite an already-saved published record.

## 8. Dashboard UI and editor lifecycle

`src/pages/Dashboard.jsx` contains section metadata, label helpers, the request helper, recursive Field editor, SignIn, Dashboard state and ConfirmDialog. Styles are in `src/pages/dashboard.css`.

### Navigation and controls

There are 14 navigation entries: Overview; Hero; Skills marquee; Introduction; Featured work; Approach; Section order; About page; Projects; Navigation & identity; Footer & social links; Appearance; Search & sharing; 404 page. Entries map to object paths such as home.hero or portfolio. Their route field selects the matching public preview route. Overview is a summary, not a content object. Sidebar search matches section names, not every field value.

The sidebar brand comes from the draft's identity.brand. Login/loading branding comes from public content. Overview shows 3 public pages, project count, home section count and publication date/status. Some headings, labels and overview totals are application UI copy rather than editable content.

### State and loading

- `status`: configured/authenticated/setupAllowed/storage/message from GET /api/admin.
- `saved`: the complete persisted state from GET /api/admin?action=content.
- `draft`: a structured clone of saved.draft, edited in browser memory.
- `dirty`: JSON comparison of draft vs saved.draft.
- `unpublished`: JSON comparison of draft vs saved.published.
- Other state: selected section, notices/errors, busy flag, preview visibility, mobile/desktop choice, search text and confirmation action.
- Initial load checks status and fetches content only if authenticated. Failed status/content requests show a retry path.
- No content autosave exists. Typing changes only draft memory. beforeunload warns for dirty edits, but should not be mistaken for a universal SPA navigation blocker.
- Each selected section resets document scroll to the top.
- Save draft is disabled without dirty changes or while busy. Publish has its own confirmation and can publish current edits without a prior Save draft.
- Successful mutation replaces saved state and clones its draft into the editor; server validation/conflict errors keep the unsaved editor data available for export.

### Recursive Field editor

Dot paths identify fields, including numeric array indices. Field creates stable DOM IDs such as `field-seo.home.title`; selectors need escaping for literal dots.

- Objects recursively expose fields. Root version is not editable.
- Booleans use checkbox switches; numbers convert input to Number; strings use text inputs or textareas based on field name/length.
- Appearance colors provide a color picker plus hex text. Font selector offers Avant Garde/sans-serif, Red Hat Mono/monospace, Georgia/serif and Arial/sans-serif.
- Arrays support adding, removing and moving entries. Fixed order arrays allow only move up/down.
- Object items use details/summary, with initial expansion only for a one-item list. Primitive entries use textareas.
- Known templates create fresh objects; otherwise object arrays clone their first entry and primitive arrays add "New item". Adding repeated default names can require renaming before validation succeeds.
- Project tags use checkboxes from portfolio.categories.
- Editing a category string at its index renames matching project tags in the draft. Removing/replacing the whole categories array does not automatically clean orphaned tags.
- Image/profile fields show previews and accept URL text or file upload. Failed preview images are hidden until a successful load.

### Operations and confirmation behavior

| UI action | Effect |
| --- | --- |
| Save draft | Validate draft in browser; POST save with content and saved.revision; persist draft only. |
| Publish | Confirm; validate and POST publish with current draft/revision; server saves both draft and public content, retaining one previous publication. Local confirmation explicitly says only this computer changes. |
| Restore previous publication | Confirm; POST restore with revision; server copies previous publication into persisted draft only. Public content stays unchanged until a later Publish. |
| Reset section | Confirm; replace only selected section in in-memory draft with its value from defaults. Not persisted until save/publish. |
| Reload saved draft | Confirm; GET content again and discard in-memory edits; refreshes revision for conflict recovery. |
| Export backup | Downloads only current draft as formatted JSON named portfolio-backup-YYYY-MM-DD.json; includes unsaved edits, not media binaries, auth, revision or publication history. |
| Import backup | Require file <=1,000,000 bytes, parse/validate, confirm, then replace in-memory draft. Does not publish automatically. |
| Sign out | Confirm, including unsaved-edits notice; POST logout; clear saved/draft; reload status. |

ConfirmDialog uses the native dialog element and showModal(), closes on cleanup, prevents cancellation while busy, and delegates the supplied action. Do not replace explicit publish/restore confirmations with accidental click-through operations.

### Preview message protocol

1. An iframe opens the selected route plus `?editor-preview=1`. It is the actual website, not a second handcrafted preview component tree.
2. Mobile viewport is 390px; desktop is 1280px. A ResizeObserver measures available width, scales the iframe by min(available/frameWidth, 1), and adjusts its height to maintain a 680px visible panel.
3. ContentProvider enters preview mode only when the query parameter exists AND window.parent differs from window. Opening that query in a top-level tab does not grant draft access.
4. The child sends `{type: 'portfolio-preview-ready'}` to its own origin.
5. Dashboard checks both origin and iframe source before replying with `{type: 'portfolio-preview', content: draft}`. It also sends on iframe load and after a 350ms debounce following edits.
6. The parent validates before sending; the child validates before applying. Invalid edits leave the previous valid preview rather than crashing the public view.
7. The child accepts messages only from the same-origin parent. It skips the normal public fetch in preview mode.
8. Preview content is ephemeral; this protocol does not save or publish anything. The iframe scrolls independently and still uses the public site's Lenis behavior.

### Dashboard scrolling and styling regression

Never mount root ReactLenis around /dashboard and merely call lenis.stop(). A stopped root Lenis still intercepts/cancels wheel/touch scrolling; this caused the owner's inability to reach lower form fields. Shell chooses a native-scroll subtree for dashboard, then recreates Lenis when returning to a public route.

Dashboard adds/removes body.dashboard-body, which overrides the public footer margin. The desktop sidebar is fixed with its own overflow:auto, nonshrinking navigation/footer and a visible thin scrollbar override. Main editor scroll uses the document. Preview is sticky on wide layouts and moves into normal flow at narrower breakpoints. Below 650px, the sidebar is in normal flow with horizontal navigation. CSS uses the site's --black/--gray/--text-off/--orange and font variables, including the Aladin brand mark. The stylesheet has later overrides for the updated site-matching appearance; read the full cascade before changing earlier declarations.

## 9. Backend API contract

All endpoint dispatch lives in `server/cms.mjs`; API filenames are thin adapters. Default API headers include Cache-Control:no-store and X-Content-Type-Options:nosniff. Responses are JSON except successful media responses. HTTP errors are `{error: message}`.

| Endpoint/method | Authentication | Input | Result |
| --- | --- | --- | --- |
| GET /api/content | Public | None | `{content: publishedContent}`. Never returns draft/auth state. |
| GET /api/media?id=... | Public | Generated UUID-like image filename | Image bytes with inferred MIME and immutable one-year cache, or 404. |
| GET /api/admin | Optional session | None | configured, authenticated, setupAllowed, storage and optional setup message. |
| GET /api/admin?action=content | Required | Session cookie | Full content state: revision, draft, published, savedAt, publishedAt, previous. Initial default state if none saved. |
| POST /api/admin, action=setup | No login yet, loopback only | password | Create local credential file exactly once; `{ok:true}`. Does not itself log in. |
| POST /api/admin, action=login | Password | password | Set authenticated cookie, persist session, `{ok:true}`. |
| POST /api/admin, action=logout | Required | action | Revoke server session, expire cookie, `{ok:true}`. |
| POST /api/admin, action=upload | Required | data: base64 image bytes | Persist image immediately; `{url:'/api/media?id=<id>'}`. |
| POST /api/admin, action=save | Required | content, revision | Updated whole saved state; only draft changes. |
| POST /api/admin, action=publish | Required | content, revision | Updated state; draft and published become supplied content. |
| POST /api/admin, action=restore | Required | revision; supplied content ignored | Updated state; previous publication copied into draft only. |

All admin POSTs, including setup/login, require an Origin header whose host matches req.headers.host. In cloud mode the origin must also be HTTPS. This is host comparison plus cloud protocol checking, not a separate CSRF token exchange. Do not weaken it to accept arbitrary origins. Normal same-origin browser fetch supplies credentials/cookies automatically.

JSON body Content-Type must start with application/json. Parsed framework body objects and streamed request bodies are capped at 4,200,000 bytes. Malformed JSON ->400; wrong content type ->415; excessive body ->413. Unsupported admin method ->405. Unknown admin action ->400 after relevant checks; unrecognized API route ->404.

Session failures yield 401, unconfigured administrator 503, invalid origin or forbidden setup 403, validation errors 400, rate limit 429 and revision/storage concurrency conflicts 409. Unexpected failures log only a message server-side and return a generic 500 message, not a stack trace to the client.

Every POST is queued in-process through a Promise chain. This serializes local read-modify-write operations within a handler instance. It is not a distributed lock; cloud ETag preconditions provide cross-instance conflict detection.

## 10. Administrator authentication and session lifecycle

This is one administrator password, not a username/OAuth system. GitHub authentication on the developer's computer has no connection to dashboard sign-in.

### Credential source and setup

1. `credentials()` first checks ADMIN_PASSWORD_HASH in server env.
2. In cloud mode, no env hash means no configured admin. There is no public production signup flow.
3. In local mode, absent env hash falls back to credentials.json in the CMS data directory.
4. Initial local setup requires BOTH a loopback Host name (127.0.0.1, localhost or [::1]) and loopback remote peer address (127.0.0.1, ::1 or ::ffff:127.0.0.1).
5. Password must be a string of 12 to 256 characters. The setup UI asks for confirmation, calls setup, then separately calls login.
6. `passwordHash` uses a random 16-byte hex salt and Node scrypt with a 64-byte derived value. Stored format is salt:derivedHash, 32 hex characters then 128 hex characters. Plaintext password is not stored.
7. The credential file is created with exclusive flag wx and mode 0600, so it cannot silently overwrite an existing local administrator.
8. The CLI password script requires a real TTY, turns on raw mode, hides input, handles Ctrl+C, confirms password and writes the hash under `.local/`. It does not change local credentials.json by itself.

### Sign-in and lockout

- auth.json begins as `{attempts:0, windowStart:0, sessions:[]}`.
- A 15-minute window is tracked globally for this admin store, not per username or IP.
- After ten failed/reserved attempts within the window, login is blocked with 429 until the window expires.
- An attempt is persisted before expensive password work. Valid passwords use timingSafeEqual on derived byte buffers after stored-format validation.
- Successful login resets attempts and appends a session, retaining at most 20 sessions (latest 19 plus new).
- Tokens are 32 random bytes encoded as hex. Only their SHA-256 hashes are stored server-side.
- Each session also has a fingerprint of the configured password hash and expiry Date.now()+28,800,000 milliseconds.

### Cookies and revocation

Cookie name: portfolio_admin. Flags: HttpOnly, SameSite=Strict, Path=/, Max-Age=28800 (8 hours), plus Secure in cloud mode. There is no access token in localStorage.

Authentication reads the cookie, hashes it, prunes expired sessions in memory and matches the stored token hash AND current password-hash fingerprint. Rotating ADMIN_PASSWORD_HASH invalidates existing sessions. Logout removes that session from auth.json and sends an empty cookie with Max-Age=0. Expired-session pruning is persisted on subsequent writes, not necessarily every GET.

The UI does not implement user management, MFA, password-reset email, role-based access or a dashboard password-change screen. Production password rotation is performed through server configuration; protect current local credentials and use isolated data directories for tests.

## 11. Content state, persistence and concurrency

Initial content record, conceptually:

```js
{
  revision: 0,
  draft: clone(defaults),
  published: clone(defaults),
  savedAt: null,
  publishedAt: null,
  previous: null
}
```

Mutation sequence:

1. Authenticate and load content.json or construct initial state.
2. Compare body.revision with saved revision using strict equality. A stale editor gets 409, with a message to export edits and reload saved content. No automatic merge is attempted.
3. Save: validate content, assign state.draft.
4. Publish: validate content, assign state.draft, move old published into previous, set published to supplied content, set publishedAt to ISO timestamp.
5. Restore: require previous, clone it into draft. Do not swap publications or immediately roll back the live site.
6. Every successful save/publish/restore updates savedAt and increments revision once.
7. Write the whole record using its storage ETag, then return state to the dashboard.

Only ONE previous publication is retained. Repeated publishes replace that slot; there is no full revision history. Publication timestamps are content timestamps, not fabricated sitemap modification dates.

### Local adapter

`server/store.mjs` resolves the data directory once when imported: CMS_DATA_DIR or `.local/cms` relative to the process working directory. Set the env before starting/importing the server.

- credentials.json: local admin password hash.
- auth.json: lockout counters and hashed sessions.
- content.json: complete saved/published state; may not exist until first content mutation.
- media/<uuid>.<extension>: uploaded bytes.
- Missing records/media return null only for ENOENT; malformed JSON/other I/O errors are not silently swallowed.
- Writes serialize JSON to a unique temporary file in the same directory with mode 0600, then rename atomically over the target.
- Local media files are written after ensuring the media directory exists.
- Multiple independent Node processes sharing one local store are not protected by a shared distributed lock; the Promise queue belongs to each process.

### Cloud adapter

cloud is `Boolean(process.env.VERCEL)`, not NODE_ENV. A local production build/review server still uses local files unless VERCEL is set. `available()` is true locally and requires BLOB_READ_WRITE_TOKEN in cloud mode.

- Records use private Blob keys `portfolio/content.json` and `portfolio/auth.json`.
- Credentials come from env; production does not create a cloud credentials.json.
- Images use `portfolio/media/<uuid>.<extension>`.
- Record reads use get(..., {access:'private', useCache:false}), parse response stream JSON and retain the Blob ETag.
- Record writes use put with application/json, no random suffix, allowOverwrite only if an ETag exists, and ifMatch for existing records. Concurrent creation or stale replacement should fail instead of overwriting silently.
- Blob precondition/already-exists errors are converted to 409. Client edits remain available; user retries/reloads as appropriate.
- There is no MongoDB, Firebase, Supabase or separate database server to provision for this implementation.
- Preview and production must use separate stores if preview edits should not change live content. Storage survives redeployment; local files do not transfer automatically.

`publishedContent()` returns defaults when cloud storage is unconfigured or the record/publication is missing. An actual configured-storage error is different: it can propagate to a 500 API or 503 page response. Do not claim all storage outages transparently fall back.

## 12. Image upload and backup flows

Upload begins in Field:

1. Browser rejects files over 3,000,000 bytes.
2. FileReader converts to a data URL; only its base64 part is sent as JSON data.
3. Authenticated server checks allowed base64 character shape, decodes and enforces the decoded 3,000,000-byte limit.
4. Type is recognized from leading bytes: PNG signature, JPEG FF D8 FF, RIFF/WEBP marker, GIF87a/GIF89a. SVG is rejected. This is signature checking, not full image decode/re-encoding or malware scanning.
5. Server generates randomUUID plus png/jpg/webp/gif extension and stores bytes under the selected backend.
6. Returned same-origin URL replaces the draft field. For a project image, createImageBitmap obtains width/height and updates sibling fields; bitmap is then closed.
7. Upload already persists bytes, but changing the public page still requires publishing the content that references them.

Media GET validates a 36-character hex/hyphen filename plus allowed extension, then serves image bytes with MIME inferred from extension and immutable one-year caching. It is intentionally public by URL even though backing Blob storage is private; URLs must work for public project images. It is not an authenticated private-gallery system.

No delete-media endpoint or garbage collector exists. Removing a project, discarding an edit or restoring content does not remove images. Retention protects previous-publication references but can accumulate unused uploads. JSON backup includes image URLs, not binary files. Moving local content to live requires reuploading local images; merely importing JSON leaves local-only media IDs unavailable in the production store.

## 13. Rendering, SEO and production routing in detail

### Build pipeline

`npm run build` runs, in order:

```text
vite build
vite build --config vite.ssr.config.js
node scripts/build-seo.mjs
```

- Client build copies public assets and emits hashed JS/CSS under dist/assets. Manual chunks group React/router, GSAP, Framer/motion, FontAwesome and remaining vendor modules. Windows path separators are normalized before matching node_modules packages. Preserve the function-based chunk grouping unless measuring a deliberate change.
- SSR build emits dist-ssr/entry-server.js plus lazy route/component chunks. It is separate from the browser bundle.
- Post-build explicitly sets NODE_ENV=production before importing the renderer.
- Post-build verifies SEO markers and the empty root placeholder exist in built HTML. Removing these markers breaks generation.
- Original built shell is preserved as dist/template.html BEFORE adding rendered content.
- Defaults are rendered into dist/index.html, dist/about/index.html, dist/projects/index.html and dist/404.html.
- It also writes sitemap.xml and robots.txt. Static fallback sitemap has only real routes and no invented lastmod dates. Static fallback robots differs from the runtime version: runtime explicitly disallows dashboard/admin; static generation currently only allows the site and declares sitemap.
- Dashboard is lazy-loaded and served dynamically; there is no generated dist/dashboard/index.html in this build script.

### Vercel routing and packaging

`vercel.json` rewrites `/`, `/about`, `/projects`, `/dashboard`, `/sitemap.xml` and `/robots.txt` to `/api/page?route=<path>`. It uses cleanUrls:true and trailingSlash:false. It deliberately has no blanket SPA catch-all rewrite. Unknown paths should use the generated 404 document rather than return a 200 SPA shell.

api/page.js has includeFiles `{dist/template.html,dist-ssr/**}` and maxDuration 30 seconds. api/admin.js also has maxDuration 30. The literal dynamic import of `../dist-ssr/entry-server.js` in server/page.mjs is important for tracing. Do not replace it with an opaque computed filesystem path without testing Vercel packaging.

The server renderer is a required deployment artifact for this architecture, even though dist and dist-ssr remain excluded from source control and are rebuilt by Vercel.

Deployment fix (2026-10-23): production logs showed `Cannot find module /var/task/node_modules/react-router/dist/development/dom-export.js`. Both `react-router` and `react-router-dom` are now explicitly bundled via `ssr.noExternal` in `vite.ssr.config.js`, so server rendering no longer depends on Vercel tracing those conditional package exports. Keep both entries together. This local fix requires a new deployment; runtime environment variables must also be present in that deployment. Validation: production build passed, all 42 public and 2 dashboard browser tests passed, and an isolated Node module-resolution check blocked both external router packages while successfully rendering /, /about, /projects, /dashboard and a missing route. The same check reproduced a missing-router failure before the change. Live Vercel verification remains pending the owner's new deployment.

### Runtime page response

1. Read route from req.query.route or URL search parameters, defaulting to `/`.
2. Obtain current published content from the store; derive getSeo(content).
3. Set Cache-Control:no-store. Sitemap and robots return their own text formats without React rendering.
4. Select public metadata, dashboard metadata or NOT_FOUND. Dashboard is noindex; NOT_FOUND gets HTTP404.
5. Build escaped HTML title/meta/canonical/share tags and structured data. Omit canonical and schema for noindex pages.
6. Read dist/template.html and cached renderer import; render the requested route with that published content.
7. Replace SEO markers and root placeholder, append the content JSON block for hydration, and return HTML.
8. Rendering/storage failures log a message and return503 plain text. Cached renderPromise caches module loading, not HTML or content.

### Metadata ownership

`getSeo(content)` produces SITE_URL, SITE_NAME, AUTHOR, OG_IMAGE, OG_IMAGE_ALT, ROUTES, NOT_FOUND, DASHBOARD and structuredData. Public routes are Home/About/Projects. Schema uses stable `#person` and `#website` IDs, identity/role/city/country, profile, footer email, about.skills and HTTPS social links selected for the sidebar. `STRUCTURED_DATA_ID` is `site-structured-data`.

`src/components/Seo.jsx` normalizes trailing slashes for client lookup, sets document.title and updates tags in place. It removes then restores schema/canonical when moving between real pages and noindex pages. Case is not normalized, matching case-sensitive routes.

Changing a route requires coordinated updates to App routes, getSeo's route map, appropriate page/navigation, runtime rewrites/review-server dispatch and tests. Merely changing a link label does not create a new route.

### JSON embedding and literal HTML insertion: fixed 2026-10-22

server/page.mjs now uses one serializeJsonForHtml helper for both JSON-LD and the portfolio-content hydration payload. It JSON-stringifies the value and replaces every less-than character with a literal backslash-u003c sequence. This prevents authored closing-script strings from ending the surrounding HTML script element; JSON.parse still restores the original text exactly.

The previous replacement used a JavaScript Unicode escape that evaluated to a literal less-than character and therefore did not escape the HTML boundary. An authenticated publication regression reproduced broken embedded JSON before the fix.

Both runtime template replacements now use callback functions. This keeps dollar replacement sequences such as $&, $`, $' and $$ in authored content literal instead of interpreting them as String.replace instructions. These callbacks are required independently of JSON escaping.

The existing dashboard integration test now publishes quotes, ampersands, angle brackets, Unicode line separators, dollar replacement sequences, mixed-case closing-script text and attempted injected markup into identity.name, the About heading and SEO description. It checks raw JSON-LD and full hydration-data round trips, no raw less-than characters in the embedded JSON, unchanged text/metadata, no injected DOM element and working hydration with no browser errors. It visits with JavaScript disabled and enabled; the enabled case also verifies the theme button and absence of an injected global. The test uses the isolated CMS test store, never the owner's data.

Do not revert this to single-escape literals or string-valued runtime replacements. React text escaping in components is separate from JSON inserted into HTML. The build-time generator and client SEO serialization were already escaping less-than characters correctly; this fix changes the runtime page handler.
## 14. Theme, typography, layout and animation invariants

### Theme flow

ThemeContext reads `localStorage.theme` defensively. Blocked storage must not crash the site. Server/initial hydration resolves the dark palette, then the selected visitor theme applies after hydration. An effect writes --font-avant, --black, --gray, --text-off, --orange, color-scheme, data-theme and meta theme-color; it remembers only the theme name in localStorage.

`public/theme.js` applies a hard-coded default palette before first paint, using the same stored theme name. It is an external blocking head script so CSP need not allow executable inline scripts. Content-customized colors/fonts apply after React loads; the bootstrap is not automatically rewritten when the admin changes a palette. This can cause a brief default-palette paint after customization.

| Token | Default dark | Default light | Meaning |
| --- | --- | --- | --- |
| --black | #131313 | #e4e1d8 | Background |
| --gray | #2c2c2c | #b0b9ae | Surface/frame |
| --text-off | #b7ab98 | #2a3439 | Foreground text |
| --orange | #fd8b09 | #59614b | Accent |

Typography: --font-avant defaults to `Avant Garde, sans-serif`; this family is not shipped as a custom font, so system fallback can vary. Aladin is used for brand/selected display text. Red Hat Mono is used for utility text. Four woff2 assets provide Latin/Latin-ext subsets of Aladin and Red Hat Mono. The two Latin subsets are preloaded. CSS comments identify SIL Open Font License provenance; do not invent a separate project license.

Tailwind v4 is imported with source('./') and an explicit index.html source. Documentation and test strings must not accidentally generate production utility CSS. There is no tailwind.config.js requirement in the current setup.

### Layout/layering

- Footer reveal is behind the page at z=-1; 79vh body margin exposes an approximately80vh fixed footer.
- Decorative cursor glow z=50; content/socials/back-to-top generally z=55; navbar backdrop and dock z=60; navbar contents z=65; skip link z=100.
- BlobCursor is intentionally behind text/cards. Raising it above content was a prior regression.
- Watermark headings intentionally have low contrast and large viewport-relative type. They are not the primary readable body copy.
- Dashboard sidebar uses its own higher layer and native document scrolling. Do not inherit public footer body spacing there.
- Global WebKit scrollbars are hidden for the portfolio; dashboard sidebar explicitly overrides this. This hiding is not a reason to set body overflow:hidden.
- Preserve visible focus outlines, one main landmark and meaningful h1 structure. Decorative duplicated marquee text/icons/canvas are hidden from assistive technology.
- Social icons and the back-to-top ring are desktop enhancements. Footer contact/social links remain on mobile.

### Animation file map

| File | Implementation and maintenance detail |
| --- | --- |
| `src/utilis/TextReveal.jsx` | GSAP SplitText lines with masks, y=100% ->0%, duration1, stagger .1, power4.out, optional delay/scroll start top75% once. useGSAP scopes animations and revertOnUpdate; cleanup reverts splits. Clones a single child's ref or wraps multiple children. Nested controls get aria:none, but do not wrap the project filter group in it. |
| `src/utilis/ScrollReveal.jsx` | Splits plain string into word spans, renders an outer div and inner paragraph, applies scrubbed rotation/opacity/blur. Must not be nested inside another paragraph. Tracks/kills only its own tweens and triggers. |
| `src/utilis/Magnet.jsx` | Window mousemove listener per instance, rAF-coalesced range measurement and transform updates. Resets once when leaving range. Keeps willChange:transform consistently so stacking contexts do not appear/disappear unexpectedly. Cleans listeners/rAF. |
| `src/utilis/BlobCursor.jsx` | Fine-pointer-only GSAP trail, shared theme accent, optional SVG goo filter, pointer-events:none. Starts disabled until client effect checks media query. Cleans listeners/tweens. |
| `src/utilis/DotGrid.jsx` | Canvas grid with DPR sizing, ResizeObserver, theme colors, GSAP inertia on fast pointer movement/click,50ms mouse throttle. IntersectionObserver/visibilitychange suspend drawing offscreen/background. Cleans observers, frames, listeners and current-dot tweens. |
| `src/utilis/ScrollVelocity.jsx` | Framer scroll velocity/spring -> direction/speed -> looping text position. Module-level VelocityText avoids component-identity remounts. Six copies by default; only first copy is accessible. Alternates direction per line, measures widths on resize. |
| `src/utilis/TiltedCard.jsx` | Framer springs for rotateX/Y, scale and cursor caption; SimpleParallax with scale1.2; intrinsic dimensions, lazy/eager image behavior; overlay content and optional tooltip. No separate mobile warning by default. |
| `src/utilis/Dock.jsx` | Stable MotionLink from motion.create(Link), actual links for routes and actual button for theme. Mouse distance controls magnification; hover/focus tooltip; route keys or constant theme key preserve keyboard focus. Motion-only props are swallowed before reaching DOM. |
| `src/utilis/CircularText.jsx` | Framer rotating letter ring with hover speed modes, used by BackToTop. Default20-second loop. |
| `src/utilis/ScrambleText.jsx` | GSAP ScrambleTextPlugin timeline over taglines, repeat and delays, timeline cleanup on changes/unmount. Do not pass an array as the scramble character pool. |
| `src/utilis/GsapScrollSync.jsx` | useLenis callback calls ScrollTrigger.update; no second independent Lenis instance. |
| `src/utilis/ScrollToTop.jsx` | Resets route scroll through current scroll owner. |
| `src/utilis/useHydrated.js` | useSyncExternalStore with false server snapshot / true client snapshot. |
| `src/utilis/useMediaQuery.js` | MatchMedia subscription with false server snapshot and cleanup; supports deterministic SSR. |

The site currently always animates: MotionConfig reducedMotion='never', with no OS reduced-motion gate. This was an explicit existing owner preference after Windows animation settings unexpectedly suppressed motion. It has an accessibility trade-off for visitors who request reduced motion. Do not silently reintroduce animation suppression or a new motion toggle; discuss a requested redesign separately. Automated motion checks deliberately exercise OS-reduce behavior too.

Some animation files contain 'use client' strings from component provenance. This is still a Vite/React app; those strings do not imply Next.js server components.

## 15. Hosting, environment variables, headers and analytics

### Environment variables

| Name | Where used | Effect |
| --- | --- | --- |
| ADMIN_PASSWORD_HASH | server/cms.mjs; locally loaded by Vite plugin | Administrator scrypt hash. Required for cloud sign-in; overrides local credentials when set. Secret. |
| BLOB_READ_WRITE_TOKEN | @vercel/blob / storage availability | Private Blob store access in Vercel. Secret; no VITE_ prefix. |
| VERCEL | server/store.mjs | Truthy selects cloud backend and Secure cookie behavior. Normally supplied by platform; do not set locally casually. |
| CMS_DATA_DIR | server/store.mjs; dashboard test config | Optional local storage override, resolved at module initialization. Tests rely on this isolation. |
| PLAYWRIGHT_CHANNEL | Playwright configs and visual review | Defaults to installed chrome; CI uses chromium. |
| NODE_ENV | build tooling/React | Build SEO script sets production; does not by itself select cloud storage. |

No .env.example currently exists. The ignore rule allows an example file if deliberately added with placeholders later; do not add one merely because the exception exists.

### Production setup sequence

1. Use the existing Vercel project/repository integration rather than creating unrelated hosting by default.
2. Attach a PRIVATE Vercel Blob store, configuring the token for the appropriate environment. Separate preview/production stores when isolation is needed.
3. Generate a hash using the interactive password script. The owner enters the password; never request that plaintext in chat or print the resulting hash unnecessarily.
4. Set ADMIN_PASSWORD_HASH as server-side Vercel configuration.
5. Deploy with the existing build command and function configuration when the owner authorizes deployment.
6. Verify actual public SSR, API routing, private Blob operations, login cookies over HTTPS, draft/publish separation, media delivery and persisted content after another deployment.
7. Confirm live metadata/sitemap/robots and real outbound links. Local review-server tests do not verify Vercel rewrite precedence, function tracing or Blob account permissions.

If the remote GitHub repository is connected to Vercel, the owner's push may trigger deployment automatically. Do not initiate a push to 'test' the login or deployment.

### Security/cache headers

vercel.json's global header block includes:

- CSP: default/base self, object none, frame-ancestors self, form-action self; executable scripts only self and configured Google/Vercel domains; inline styles allowed for animation; self/data fonts; self/data/blob/HTTPS images; specific analytics/connect origins; self/blob workers; upgrade-insecure-requests.
- X-Frame-Options:SAMEORIGIN and CSP frame-ancestors self deliberately allow the same-origin dashboard iframe. DENY would break preview.
- HSTS max-age63072000 with includeSubDomains/preload, nosniff, strict-origin-when-cross-origin referrer policy, disabled sensitive Permissions-Policy features, COOP:same-origin, DNS prefetch on.
- Hashed /assets files and fonts cache for one year. Public icons/share/profile images cache for one week. theme.js/analytics.js cache for one hour. Sitemap/robots have an hourly configured header, while dynamic handlers also set no-store; verify effective headers on Vercel rather than assuming local server parity.
- Admin/content handlers use no-store; uploaded media uses immutable one-year cache. Do not cache authenticated drafts at a shared CDN.

`public/analytics.js` loads GA4 only on `ahmed-ashar.vercel.app`. The measurement ID is public configuration, not a credential. It configures anonymize_ip and relies on enhanced measurement for History API tracking rather than manually double-counting page_view. SpeedInsights is mounted in App, including dashboard. No consent-banner workflow is implemented in this repository. Changing a custom domain also requires revisiting the analytics host allowlist, SEO origin and relevant Vercel settings.

## 16. Commands, tests and verification boundaries

Run from the repository root. Runtime requirement: Node ^20.19.0 or >=22.12.0; exact package versions come from package-lock.json. Manifest ranges at this snapshot include React19, ReactRouter7, Vite^7.3.7, Tailwind4, GSAP3, FramerMotion12, Lenis1, @vercel/blob^2.8.2, Playwright^1.64.1. Inspect the lockfile rather than substituting remembered versions.

```sh
npm ci
npm run dev
npm run lint
npm run build
npm test
npx playwright test --config playwright.dashboard.config.js
npm run check
npm audit --audit-level=high
npm run test:visual -- current
```

- npm run check = lint + build + PUBLIC tests. It does not include the dashboard suite.
- npm test and dashboard tests use existing build output. Build first after runtime/source edits.
- Public suite uses4173, two workers, default Chrome, trace/screenshots only on failure. Dashboard suite uses4174, one worker, isolated store and artifacts/dashboard-test-results.
- Both configs disallow reusing a pre-existing server. Investigate port conflicts rather than killing unrelated user processes blindly.
- For bundled Chromium, install with `npx playwright install chromium` and set PLAYWRIGHT_CHANNEL=chromium. In PowerShell: `$env:PLAYWRIGHT_CHANNEL = 'chromium'`. CI installs browser system dependencies on Ubuntu.
- Public review server reads the normal local store unless CMS_DATA_DIR is overridden before it starts. Tests assert default content; local publications can make expected copy/counts differ. If needed, run with an isolated data directory; never reset the owner's CMS data for the suite.
- The dashboard test config already supplies a unique directory. Random test passwords are generated in memory, not fixed credentials.
- Test outputs are not public assets. Keep artifacts/, test-results/, playwright-report/ ignored. docs/images/homepage.png is an intentional README image, not a test artifact.

### Public suite: tests/portfolio.spec.js

32 viewport/theme/route cases:320,390,768,1440 widths x dark/light x Home/About/Projects/404. They check response status, one main/h1, theme, dock, horizontal overflow, loaded images with alt, page errors, hydration errors and CSP violations; scroll through the page to trigger lazy content.

10 additional tests cover filter mouse/Enter/Space and Chrome accessibility tree;404 metadata/schema transitions both ways; route casing; native dock links/theme keyboard focus/persistence; route scroll reset/back-to-top; page content and SEO with JavaScript disabled; blocked localStorage; animations with reduced-motion reported; resolved prerender asset URLs; mobile touch filters/footer links and omission of cursor/ring.

Tests named 'static HTML' currently exercise the review server's dynamic public renderer for known routes, not only direct reading of generated fallback files. Do not claim they independently cover every static-host behavior.

### Dashboard suite: tests/dashboard.spec.js

First test also covers special-text publication through JSON-LD, raw hydration data and browser parsing with JavaScript enabled/disabled (section13). It uses the real isolated local backend: setup/login; HttpOnly/SameSite cookie; preview; draft persistence without publication; add project; image upload/media GET; metadata publication; independent visitor and raw SSR confirmation; missing-session restrictions; cross-origin rejection; stale revision409; javascript link rejection; SVG upload rejection; all editor sections on mobile; restore-as-draft; logout/replay rejection; incorrect/correct sign-in.

Second test mocks admin/content responses to isolate scrolling: desktop wheel, keyboard End, independently scrolling sidebar, iframe scroll without moving parent, client navigation dashboard -> website -> dashboard, and actual mobile touch events. Touch uses CDP Input.dispatchTouchEvent; synthesizeScrollGesture did not reliably exercise this behavior in the earlier attempt.

The suites do not establish live Blob reliability, cross-instance production races, MFA, exhaustive schema fuzzing, full media decode safety, or every browser engine. Do not infer those guarantees from44 passing tests.

### CI and review outputs

.github/workflows/quality.yml uses read-only repository permissions, Node22, npm ci, Chromium installation, npm run check and high-severity audit. Dashboard tests are not yet in that workflow. Failure artifacts are retained for seven days in GitHub Actions; they are not committed repository files.

Visual review script accepts a simple alphanumeric/hyphen label and writes screenshots under artifacts/<label>. It captures four routes at390/1440 in both themes, waits for fonts/animations and masks changing decoration. The README screenshot was captured separately from the actual build without those masks and inspected visually.

## 17. Known limitations and edge cases

These are implementation observations, not claims that fixes were completed:

1. Production deployment/Blob configuration remain unverified in this session. Local success is not production confirmation.
2. The runtime JSON-in-HTML escaping and dollar-substitution bugs are fixed and regression-covered (section13). This targeted fix is not a claim of exhaustive security testing.
3. No autosave, multi-user roles, OAuth, MFA, password-reset service, realtime public refresh, full publication history, audit trail or media garbage collection.
4. Content is a strict whole-document schema. No migrations or tolerant merging exist; new fields can invalidate old backups/records.
5. Preview retains the last valid draft when a field temporarily fails validation. It can look stale while typing invalid URLs/colors or duplicate names.
6. Category deletion can leave tags with no filter button. Renaming an individual category updates matching tags.
7. Auth lockout is store-wide. Requests to the public login endpoint can consume the attempt budget; no separate IP-based limiter exists. A local queue is not cross-process locking.
8. Upload signature checks do not fully decode/sanitize images. Base64 uploads have both encoded-request and decoded-file limits. Images are public by generated URL after upload.
9. Backend saved-record reads do not all call validateContent. External/corrupt store edits can break rendering. Modify records through validated APIs; migrations must validate existing records explicitly.
10. Array/string validation limits and API/backup size limits are separate. A valid-in-shape object can still exceed transport/import limits.
11. Admin UI copy, route architecture, animation parameters, some accessible labels and ErrorBoundary text are not dashboard-editable. Do not promise a general no-code page builder.
12. Theme bootstrap uses defaults; custom colors/font apply after hydration. Public layout and dashboard have different body-spacing/scroll requirements.
13. Configured storage/render errors may produce503 pages; only missing/unconfigured data falls back to defaults.
14. Unknown hard-navigation URLs generally use a build-time default404 document until hydration; live404 content edits may appear only client-side initially. Verify actual host behavior.
15. Reduced-motion accommodation is not implemented; the owner preference and accessibility trade-off are documented above.
16. Plain static Vite preview cannot demonstrate the full dashboard backend.
17. Nonfatal outdated-JSX-transform warnings from the SSR dependency tree and NO_COLOR/FORCE_COLOR warnings appeared in local tests. Checks passed; these are not proof of a failed build or a Next.js architecture.
18. README preview is a screenshot, not a live embed. The portfolio project's own screenshot and OG image are separate assets and do not refresh automatically.

## 18. Troubleshooting map

| Symptom | First checks |
| --- | --- |
| Project filter clicks/results fail | ProjectPage state, exact tags, visible flags, and whether SplitText was reintroduced around buttons. Test real mouse/keyboard/touch input. |
| Cannot reach lower dashboard fields | Shell must exclude root Lenis on dashboard; inspect lenis-stopped, dashboard-body, sidebar overflow and open modal. CSS overflow alone cannot fix intercepted wheel events. |
| Website scroll breaks after leaving dashboard | Lenis must be recreated, not globally stopped; check ScrollToTop/GsapScrollSync provider placement. |
| New content not public | Distinguish in-memory edit vs saved draft vs publication; inspect /api/content, local-vs-production URL and backend store. Open tabs do not subscribe to updates. |
| Preview ignores edits | Validate draft; check origin/source handshake, query parameter and debounce. Invalid drafts keep last valid preview. |
| Save409 | Revision/ETag changed. Export edits, reload saved draft, reconcile and retry; do not bypass concurrency checking. |
| Login not configured | Check presence, not secret values, of Blob token/admin hash; confirm VERCEL mode and local CMS_DATA_DIR. |
| Setup refused | Existing credentials/env hash, non-loopback Host/peer or cloud mode. Do not delete credentials to bypass it. |
| Manual API request403 | POST needs matching Origin host; cloud requires HTTPS. Cookie alone is insufficient. |
| Login429 | Global15-minute budget exceeded. Use an authorized recovery path; do not casually delete auth state. |
| Upload missing/failing | File/body limits, signature, auth, storage and publication. Reupload media when moving local backups to cloud. |
| Dashboard unavailable under npm preview | Use npm run dev or production review server after build; static preview has no CMS middleware. |
| Live function503 | Check included template/SSR files, literal dynamic import, storage and rendering logs without exposing secrets. |
| Hydration errors | Match embedded/rendered content, wait for lazy routes, preserve deterministic Time/theme/media initial values and avoid SSR browser-global reads. |
| Footer overlaps or leaves a gap | SiteLayout margin effect, footer.enabled, fixed footer layering and dashboard body override. |
| Cursor paints over text | Preserve z50 behind z55 content, pointer-events:none and stable Magnet stacking context. |
| Old /src/assets URLs requested | Rebuild stale dist; current defaults use /images. Do not restore obsolete data modules. |
| Tests fail on default copy/counts | Check local published data and stale build. Isolate CMS_DATA_DIR rather than resetting owner content. |
| Git dubious ownership | Verify actual workspace; exact safe.directory D:/ahmed fixed this machine. Never trust all directories with a wildcard. |
| AI file appears in Git | Root AGENTS.md is intentional by latest owner request; other AI notes remain ignored. Ignoring does not untrack files. |
| Dashboard has old pale colors | Inspect full dashboard.css cascade, shared variables/theme and stale build output. |

## 19. Safe extension recipes

### Existing content

Use dashboard draft/preview/publish for owner-managed live content when authorized. For baseline/new-install content, change defaults.json and appropriate SEO/HTML fallbacks. Persisted publication overrides defaults. Do not invent project accomplishments, employment dates, clients or metrics.

### New editable property

Update defaults, compatibility/migration, validation constraints, component consumption, Field controls/labels if automatic handling is insufficient, and relevant behavioral tests. Refresh this handover's field appendix. Extra stored object keys are rejected by the strict validator.

### New home/about section

Add component/render-map key, defaults and order entry, dashboard descriptor/preview route and visibility/heading controls. Migrate existing order arrays and verify reorder/hide/mobile behavior. Do not leave validation expecting the old fixed keys.

### New page

Coordinate lazy route, SiteLayout/main landmark, metadata route, navigation, Vercel rewrite, review-server dispatch, build output/sitemap and404 handling. Verify server-rendered content/SEO before JavaScript and add a meaningful browser check.

### Authentication/storage changes

Preserve server-only secrets, origin checks, HttpOnly cookies, revocation, concurrency control and draft isolation. Use isolated test data. Adding another auth service/database is an architectural choice, not a prerequisite for this implementation.

### Design changes

Reuse shared tokens and typography. Check desktop/mobile in both themes, native dashboard scrolling and independent iframe scroll. Keep interactive controls outside destructive text splitting. Never add a second Lenis instance or globally kill all ScrollTriggers.

### README preview

Capture the real homepage from a current build using a temporary review server, wait for fonts/intro animation, save docs/images/homepage.png, inspect it and verify the relative README link. Keep one intentional image in docs; scratch capture scripts/review variants stay in ignored output. Do not fabricate a site screenshot with image generation.

## 20. Repository hygiene and handover checklist

Root AGENTS.md is explicitly allowed by the owner. Its Git exception is `!/AGENTS.md` placed after generic AI rules. Only this root file is included; nested AGENTS.md and other AI files remain ignored. `.vercelignore` still excludes AGENTS.md from deployment uploads. This exception does not authorize a push.

Excluded from Git:

- Historical assistant notes: PROJECT_STATUS.md, SESSION_NOTES.md, docs/DESIGN_SYSTEM.md.
- Tool settings: .codex/, .agents/, .claude/, .cursor/, .windsurf/, .openai/, .gemini/, .continue/, .aider* and common AI instruction files, except this root handover.
- .local/, .vercel/, .env and .env.* (except a deliberately added placeholder-only .env.example).
- node_modules/, dist/, dist-ssr/, artifacts/, test-results/, playwright-report/, blob-report/, coverage/, .cache/, .vite/, .eslintcache, .playwright/, logs and temporary/backup files.
- Local credential material and owner exports: *.pem, *.key, *.p12, *.pfx, *service-account*.json, /google-credentials*.json, /portfolio-analytics-512420-*.json and portfolio-backup-*.json.
- OS junk: Thumbs.db, desktop.ini, *.lnk.

GitHub keeps the test suite and CI. `.vercelignore` separately excludes tests/, both Playwright configs, scripts/visual-review.mjs, scripts/dashboard-test-server.mjs, docs/ and README.md from deployment uploads only, because they are not needed to build or serve the site. Do not confuse the two files: ignoring for Vercel must never untrack project source from Git.

Project tests, build/admin scripts, README, docs/DASHBOARD.md, docs/images/homepage.png and .github/workflows/quality.yml belong in Git. Never blanket-ignore docs/, scripts/, tests/ or all Markdown.

Cleanup moved eight unused files into ignored `.local/repository-cleanup/`, preserving relative paths: src/data/AboutData.jsx, src/data/ProjectData.jsx and six src/assets WebP copies (4,5,7,Project1,Project3,Project6). No active component imports the old data modules; current defaults and public/images are authoritative. Earlier old PNG/demo assets and ChatBot/RandomText deletions are intentional pending changes. Do not git restore them just to remove deletion entries from status.

Before claiming future readiness:

1. Inspect current diff/status and preserve owner work.
2. Inspect tracked plus nonignored untracked files, not just collapsed directory names.
3. Check ignored-but-tracked files separately; ignore rules do not erase existing index/history entries.
4. Check for secrets, generated junk and extra AI notes without exposing secret contents.
5. Run checks appropriate to changes. Docs need path/link/format review; runtime changes need relevant lint/build/browser tests. Audit results are dated.
6. Distinguish source readiness, local checks, production configuration and actual deployment.
7. Maintain this ONE handover when architecture or limitations change; keep README visitor-facing.
8. Stage/commit/push/deploy only with current owner authorization. He plans to push himself at this snapshot.

## 21. Exact content fields and file inventory

These appendices are generated from current defaults and the Git-eligible working tree. They are snapshots, not a second source of truth. `[]` denotes an array item; object-item examples describe the first default item. No local credentials or CMS state are included.

### A. Complete editable-content field reference

| Content path | Type | Initial value / example |
| --- | --- | --- |
| `version` | number | 1 |
| `identity.brand` | string | "Ahmed" |
| `identity.name` | string | "Muhammad Ahmed Ashar" |
| `identity.siteName` | string | "Ahmed Ashar" |
| `identity.location` | string | "Karachi, PK" |
| `identity.city` | string | "Karachi" |
| `identity.country` | string | "PK" |
| `identity.timeZone` | string | "Asia/Karachi" |
| `identity.role` | string | "Web Developer" |
| `identity.taglines` | string[] | ["Good work starts with a good question.","Thinking through the small details.","Design and development, together.","From the first sketch to the final build.","Have something in mind? Let's talk."] |
| `identity.showClock` | boolean | true |
| `identity.showSocials` | boolean | true |
| `identity.showCursor` | boolean | true |
| `identity.showBackToTop` | boolean | true |
| `identity.showDock` | boolean | true |
| `identity.homeLabel` | string | "Home" |
| `identity.aboutLabel` | string | "About" |
| `identity.projectsLabel` | string | "Projects" |
| `appearance.font` | string | "Avant Garde, sans-serif" |
| `appearance.dark.black` | string | "#131313" |
| `appearance.dark.gray` | string | "#2c2c2c" |
| `appearance.dark.textOff` | string | "#b7ab98" |
| `appearance.dark.orange` | string | "#fd8b09" |
| `appearance.light.black` | string | "#e4e1d8" |
| `appearance.light.gray` | string | "#b0b9ae" |
| `appearance.light.textOff` | string | "#2a3439" |
| `appearance.light.orange` | string | "#59614b" |
| `home.order` | string[] | ["hero","marquee","intro","featured","approach"] |
| `home.hero.enabled` | boolean | true |
| `home.hero.lines` | string[] | ["THINK.","DESIGN.","DEVELOP","WITH CARE."] |
| `home.hero.accentLine` | number | 2 |
| `home.hero.showDots` | boolean | true |
| `home.marquee.enabled` | boolean | true |
| `home.marquee.texts` | string[] | ["JavaScript React Node.js Express MongoDB Firebase","Shopify WordPress Webflow Squarespace Tailwind CSS"] |
| `home.marquee.speed` | number | 190 |
| `home.intro.enabled` | boolean | true |
| `home.intro.heading` | string | "ABOUT ME" |
| `home.intro.body` | string | "I'm Muhammad Ahmed Ashar, a web developer based in Karachi. I turn ideas into websites and applications, with close attention to how they look, how they work and how people use them." |
| `home.intro.buttonText` | string | "More About Me" |
| `home.intro.buttonLink` | string | "/about" |
| `home.featured.enabled` | boolean | true |
| `home.featured.heading` | string | "PROJECTS" |
| `home.featured.buttonText` | string | "More Projects" |
| `home.featured.buttonLink` | string | "/projects" |
| `home.featured.count` | number | 4 |
| `home.approach.enabled` | boolean | true |
| `home.approach.heading` | string | "APPROACH" |
| `home.approach.body` | string | "Good design helps people understand where they are, what they can do and what happens next." |
| `home.approach.caption` | string | "A principle behind my work." |
| `about.about.heading` | string | "I care about how it works, and how it feels to use." |
| `about.about.paragraphs` | string[] | ["I'm Muhammad Ahmed Ashar, a web developer based in Karachi. My work brings together development and a background in graphic design, so I think about the interface and the code behind it as parts of the same job.","Before choosing a platform or writing code, I want to understand what you're trying to do, who it's for and how it will be used. Those questions shape the layout, the features and the tools I work with.","I build websites, online stores and web applications. Some projects call for custom development; others need a platform that makes everyday updates straightforward. I work with both, choosing the approach around the project and the people who will manage it.","Working on logos, layouts and UI mockups has taught me to pay attention to the small decisions: how content is arranged, where the eye goes and whether an interaction feels clear. I bring that same attention to development.","I studied MERN stack development at Saylani Mass IT Training and completed a three-year diploma in Computer Information Technology. My toolkit includes custom development and CMS platforms, with the specific tools listed below.","Outside of work, I'm a Hafiz-e-Quran. The focus and consistency that took are still part of how I learn and work. I also enjoy sketching ideas and tinkering with custom keyboards."] |
| `about.about.closing` | string | "The details matter, from the first layout to the final interaction." |
| `about.education` | object[] | "4 initial items; fields below" |
| `about.education[].title` | string | "Ummul Qura Secondary School" |
| `about.education[].destination` | string | "School" |
| `about.education[].duration` | string | "2016 - 2022" |
| `about.experience` | object[] | "2 initial items; fields below" |
| `about.experience[].title` | string | "Social Media Marketing Manager" |
| `about.experience[].company` | string | "Magical Marketing Agency" |
| `about.experience[].duration` | string | "2023 - 2024" |
| `about.certificate` | object[] | "3 initial items; fields below" |
| `about.certificate[].title` | string | "Front End Internship" |
| `about.certificate[].from` | string | "Code Alpha" |
| `about.contact` | object[] | "6 initial items; fields below" |
| `about.contact[].title` | string | "hafizmahmedashar@gmail.com" |
| `about.contact[].from` | string | "Email Address" |
| `about.contact[].link` | string | "mailto:hafizmahmedashar@gmail.com" |
| `about.skills` | string[] | ["JavaScript","React","Node.js & Express","MongoDB","Firebase","Shopify","WordPress","Webflow","Squarespace","GSAP","Figma","Adobe Illustrator","Git & GitHub","Responsive Design"] |
| `about.profile` | string | "/profile.webp" |
| `about.profileAlt` | string | "Portrait of Muhammad Ahmed Ashar" |
| `about.showProfile` | boolean | true |
| `about.order` | string[] | ["skills","education","experience","certificate","contact"] |
| `about.sections.skills.enabled` | boolean | true |
| `about.sections.skills.heading` | string | "Skills" |
| `about.sections.education.enabled` | boolean | true |
| `about.sections.education.heading` | string | "Education" |
| `about.sections.experience.enabled` | boolean | true |
| `about.sections.experience.heading` | string | "Experience" |
| `about.sections.certificate.enabled` | boolean | true |
| `about.sections.certificate.heading` | string | "Certificates" |
| `about.sections.contact.enabled` | boolean | true |
| `about.sections.contact.heading` | string | "Contact" |
| `portfolio.heading` | string | "Different projects. The same attention to detail." |
| `portfolio.intro` | string | "A selection of websites, applications and interfaces I've built. Explore the projects to see the design and development in context." |
| `portfolio.allLabel` | string | "All" |
| `portfolio.emptyMessage` | string | "No projects match that filter yet." |
| `portfolio.categories` | string[] | ["Frontend","Backend","MERN Stack"] |
| `portfolio.projects` | object[] | "6 initial items; fields below" |
| `portfolio.projects[].title` | string | "Event Central" |
| `portfolio.projects[].para` | string | "Create, update and manage events in one place." |
| `portfolio.projects[].image` | string | "/images/Project6.webp" |
| `portfolio.projects[].width` | number | 1582 |
| `portfolio.projects[].height` | number | 823 |
| `portfolio.projects[].alt` | string | "Event Central event management app showing the events dashboard" |
| `portfolio.projects[].link` | string | "https://eventcentral.netlify.app/" |
| `portfolio.projects[].tags` | string[] | ["MERN Stack","Frontend","Backend"] |
| `portfolio.projects[].caption` | string | "Event manager platform" |
| `portfolio.projects[].visible` | boolean | true |
| `portfolio.projects[].featured` | boolean | true |
| `footer.enabled` | boolean | true |
| `footer.heading` | string | "Have something in mind?\nTell me what you're working on\nand where you'd like to take it." |
| `footer.contactLabel` | string | "CONTACT" |
| `footer.linksLabel` | string | "LINKS" |
| `footer.email` | string | "hafizmahmedashar@gmail.com" |
| `footer.address` | string | "Sector 11-C/1 North Karachi,\nKarachi, Pakistan" |
| `footer.watermark` | string | "CONTACT" |
| `footer.links` | object[] | "5 initial items; fields below" |
| `footer.links[].name` | string | "Instagram" |
| `footer.links[].link` | string | "https://www.instagram.com/ahm3d_ashar/" |
| `footer.links[].showInSidebar` | boolean | true |
| `seo.siteUrl` | string | "https://ahmed-ashar.vercel.app" |
| `seo.image` | string | "/og-image.png" |
| `seo.imageAlt` | string | "Ahmed Ashar web development portfolio" |
| `seo.home.title` | string | "Ahmed Ashar &#124; Web Developer in Karachi" |
| `seo.home.description` | string | "Ahmed Ashar is a web developer in Karachi, building websites and applications with care for design, usability and the details. Explore his work and approach." |
| `seo.about.title` | string | "About Ahmed Ashar &#124; Web Developer" |
| `seo.about.description` | string | "Meet Ahmed Ashar, a web developer with a background in graphic design. Read about his approach to building for the web, his experience and the tools he uses." |
| `seo.projects.title` | string | "Selected Work &#124; Ahmed Ashar" |
| `seo.projects.description` | string | "Explore websites, applications and interfaces built by Ahmed Ashar, from an event management app to a resume builder. View selected work and live projects." |
| `notFound.heading` | string | "This page took a wrong turn." |
| `notFound.body` | string | "The page you are looking for does not exist or has been moved." |
| `notFound.title` | string | "Page Not Found &#124; Ahmed Ashar" |
| `notFound.description` | string | "That page does not exist or has moved. Head back to the homepage, projects or about page of Ahmed Ashar's portfolio." |

### B. Complete Git-eligible file inventory

95 existing files at documentation time, including this owner-approved handover. Pending deletions and ignored/generated/local files are not listed.

```text
.github/workflows/quality.yml
.gitignore
.vercelignore
AGENTS.md
README.md
api/admin.js
api/content.js
api/media.js
api/page.js
docs/DASHBOARD.md
docs/images/homepage.png
eslint.config.js
index.html
package-lock.json
package.json
playwright.config.js
playwright.dashboard.config.js
public/analytics.js
public/apple-touch-icon.png
public/favicon.svg
public/fonts/aladin-latin-ext.woff2
public/fonts/aladin-latin.woff2
public/fonts/red-hat-mono-latin-ext.woff2
public/fonts/red-hat-mono-latin.woff2
public/images/4.webp
public/images/5.webp
public/images/7.webp
public/images/Project1.webp
public/images/Project3.webp
public/images/Project6.webp
public/og-image.png
public/profile.webp
public/theme.js
scripts/admin-password.mjs
scripts/build-seo.mjs
scripts/dashboard-test-server.mjs
scripts/review-server.mjs
scripts/visual-review.mjs
server/cms.mjs
server/page.mjs
server/store.mjs
server/vite-cms.mjs
src/App.jsx
src/Shell.jsx
src/components/AboutPage.jsx
src/components/AboutSection.jsx
src/components/BackToTop.jsx
src/components/Button.jsx
src/components/DockComp.jsx
src/components/ErrorBoundary.jsx
src/components/FooterSection.jsx
src/components/Hero.jsx
src/components/Icons.jsx
src/components/Navbar.jsx
src/components/ProjectCard.jsx
src/components/ProjectPage.jsx
src/components/ProjectSection.jsx
src/components/QuoteSection.jsx
src/components/ScrollVelocitySlide.jsx
src/components/Seo.jsx
src/components/SiteLayout.jsx
src/components/Time.jsx
src/content/defaults.json
src/content/schema.js
src/context/ContentContext.jsx
src/context/ThemeContext.jsx
src/entry-server.jsx
src/index.css
src/main.jsx
src/pages/About.jsx
src/pages/Dashboard.jsx
src/pages/Home.jsx
src/pages/NotFound.jsx
src/pages/Projects.jsx
src/pages/dashboard.css
src/seo.js
src/utilis/BlobCursor.jsx
src/utilis/CircularText.jsx
src/utilis/Dock.jsx
src/utilis/DotGrid.jsx
src/utilis/GsapScrollSync.jsx
src/utilis/Magnet.jsx
src/utilis/ScrambleText.jsx
src/utilis/ScrollReveal.jsx
src/utilis/ScrollToTop.jsx
src/utilis/ScrollVelocity.jsx
src/utilis/TextReveal.jsx
src/utilis/TiltedCard.jsx
src/utilis/useHydrated.js
src/utilis/useMediaQuery.js
tests/dashboard.spec.js
tests/portfolio.spec.js
vercel.json
vite.config.js
vite.ssr.config.js
```

End of consolidated project reference. Recheck source and update this file after future changes.

## 22. Audience analytics addition (2026-10-23)

This section supersedes earlier statements that analytics is only a public GA4 loader. The dashboard now has a dedicated Analytics section, implemented locally and tested. The owner could not yet confirm access to the existing GA4 property. Real Google credentials/property permissions and live analytics verification are STILL PENDING. Never show test fixtures as actual visitor data or claim live reporting is connected until it is verified. The owner still handles commit/push/deployment.

### Source map and integration

- `server/analytics.mjs`: Google Analytics Data API reporting service; uses the official `google-auth-library` JWT client with read-only scope. Exports `analyticsReport`, `createAnalyticsService` (injectable request/clock/environment for tests) and report row normalization. No Google credentials reach browser assets.
- `server/cms.mjs`: authenticated `GET /api/admin?action=analytics&days=7|30|90`. Authentication runs before configuration/report access. Derives hostname from the current published `seo.siteUrl`. Returns no-store JSON, uses existing safe error handling. Does not add a public collection endpoint or write to CMS storage.
- `src/pages/AnalyticsPanel.jsx`, `src/pages/analytics.css`: date selection, eight audience KPIs and previous-period changes, interactive SVG timeline, exact-value daily table, scroll milestones by page, device donut, page engagement sorting, sources/countries bars, event totals, named interaction table, CSV export, setup/loading/error/empty states and metric definitions. Chart colors derive from dashboard palette. Responsive native document scrolling; tables can scroll horizontally within their cards.
- `src/pages/Dashboard.jsx`: Analytics navigation entry plus overview shortcut; renders AnalyticsPanel outside editor/iframe layout. Existing content draft state survives switching to Analytics. Global save/publish actions still refer to the content draft, not analytics.
- `src/components/AnalyticsTracker.jsx`: route-aware custom-event collection inside Shell's router; client effects only, SSR returns null. Tracks public route exploration and clicks using GA4's existing gtag queue; never emits page_view itself. Delayed loader availability is handled via `portfolio-analytics-ready`.
- `src/Shell.jsx`: mounts AnalyticsTracker alongside RouteExperience so Lenis/native-scroll behavior remains unchanged.
- `public/analytics.js`: existing GA4 loader remains production-host-only and now excludes nonpublic paths, embedded windows, DNT and GPC. It dispatches `portfolio-analytics-ready` after configuring the queue. Standard GA4 enhanced measurement handles SPA history pageviews, as before.
- ProjectPage and ProjectSection links have `data-analytics-project` with authored titles; filter buttons have `data-analytics-filter`. Tracking does not change navigation/filter behavior.
- `server/vite-cms.mjs` also loads GA server variables from Vite env files. The review server only uses its process environment.
- `server/analytics.test.mjs`: native Node unit tests; `tests/analytics.spec.js`: public tracker browser tests; dashboard.spec includes real unauthorized/admin API checks and controlled-report UI tests. Mock numbers only occur in test files and ignored screenshots. No mock/demo data in product code.
- `docs/DASHBOARD.md` contains owner setup and metric definitions; README lists optional connected analytics. `npm run test:analytics` runs server unit tests; `npm run check` now includes these before build/public tests. CI also runs the separate dashboard suite.

### Configuration and permissions

Production variables are `GA_PROPERTY_ID` (numeric property ID, NOT the G- measurement ID), `GA_CLIENT_EMAIL`, and secret `GA_PRIVATE_KEY`. Literal escaped newlines or actual PEM newlines are supported. Keep any downloaded service-account JSON outside Git or under ignored `.local/`. The Google Cloud project must have Analytics Data API enabled; the service account must be a Viewer on the existing GA4 property. No domain-wide delegation, write scope, new public analytics database or extra Vercel Blob writes are used. The existing web measurement ID is `G-77MPKKC7BM`; property ownership cannot be inferred from that public ID.

Register an event-scoped GA4 custom dimension named Interaction label with parameter `interaction_label` to enable project/category names. Core counts do not require it. A 400 from the optional named-details query is treated as setup-required for that table only; other optional failures produce a temporary table notice. Credentials, permission, quota and general upstream failures are sanitized and shown as errors, never as fabricated zero traffic. Missing environment configuration produces explicit setup state without making remote requests.

### Reporting, cache and data definitions

Core reporting is eight reports sent in two batches (five and three), plus an optional named-interactions runReport. Metrics and dimensions are allowlisted in code. Every report is scoped to the published hostname and `/`, `/about`, `/projects`. Periods are 7, 30 or 90 COMPLETE days ending yesterday in property time zone; the previous comparison has the same number of days with no overlap. Relative API date ranges use property-local time; timeline gaps are filled with zero using returned timezone. Period unique users come from the overall summary, never summing daily rows.

Summary includes totalUsers, activeUsers, newUsers, sessions, engagedSessions, screenPageViews, userEngagementDuration, averageSessionDuration and engagementRate. Cards derive foreground engagement per session and views per session with zero-safe denominators. Comparison with a zero prior value is labeled no prior activity rather than infinity. Rate changes are percentage points. Device shares use sessions. Country and page users may overlap. Page engagement per user is total foreground duration divided by that page's totalUsers. Traffic source bars use sessionSourceMedium/sessions. Display uses up to eight source/country rows; export includes returned rows (maximum 100). Sampling, thresholding, data-loss-to-other and truncation flags are surfaced.

Each instance caches results for five minutes by days+published hostname, coalesces identical concurrent requests and bounds its cache. Core failures are not cached. Google OAuth token transport and report calls have eight-second timeouts with retries disabled. All cached data is server memory only; no visitor reports or credentials are persisted to Blob/files/browser storage. Multiple serverless instances may each fetch one report, so this is not a global quota limiter. CSV cells are quoted/escaped and spreadsheet formula prefixes are neutralized. Exports are generated from the fetched response entirely in the browser.

GA4 processing may take 24-48 hours, especially for new custom events/dimensions. Cache freshness is not event freshness. Historic core traffic depends on what Google already collected; no historical scroll/project events are invented or backfilled. If the published site URL changes, the report queries the new host; production collection's host allowlist must also be updated for a real domain change. There is no live-presence count, session recording, heatmap, individual identity view, arbitrary date builder or internal-user exclusion beyond admin/preview handling.

### Event behavior and privacy

Custom event names: portfolio_scroll_25, portfolio_scroll_50, portfolio_scroll_75, portfolio_scroll_90, portfolio_project_open, portfolio_contact, portfolio_filter, portfolio_navigation. Scroll depth is (scrollY + viewport height) / document scrollHeight, capped at 100: measures the lowest content seen, not scroll distance. Milestones emit once per route mount (page revisit can emit again), with visibility checks, 180ms throttling and a cancellable 500ms mount delay to avoid StrictMode duplicates and allow scroll reset. Short pages can reach all milestones at load. Hidden tabs do not emit. Listeners/timers clean up on route changes.

Click priority: authored project link, category button, mailto/tel/WhatsApp contact, then internal public navigation link. Handles normal and middle clicks. Uses authored title/filter names or fixed labels, max 100 chars. Does not add form values, recipient email/phone strings, query strings or outbound destinations to custom event payloads; page_location is origin+pathname. Contact clicks indicate intent, not confirmed sales/leads. No manual page_view or custom duration heartbeat is added (avoids duplicate GA4 pageviews or engagement time).

Custom tracker and initial GA4 loader skip iframes, nonpublic paths, DNT=1 and GPC. The tracker disables the GA measurement flag when excluded. Public script collection's existing GA4 consent behavior remains; there is no newly introduced consent banner or legal-policy workflow. Do not claim the entire GA4 property contains no identifiers/URLs: Google's own standard collection/settings are separate from our minimized custom payloads. Dashboard reports expose only aggregates to authenticated admins.

### Validation and remaining live work

Local tests cover real dashboard auth rejection, no-store response, range allowlist, missing config, full-period date math, timezone gaps, unique totals, API filters, coalescing/expiry, optional dimension failures, quality notices, safe upstream errors, actual route/click/scroll events, StrictMode deduplication, delayed loader, privacy/preview exclusion, chart controls, metric formatting, CSV formula escaping, mobile no-overflow, setup/empty/error/retry states. Controlled dashboard chart fixtures are only visual/test evidence; actual Google report compatibility and account permissions cannot be proven without the owner's property connection.

The next live step is to establish access to the existing GA4 property, configure the three server variables and custom dimension, deploy the owner's changes, then compare the dashboard's reports to GA4 for the same dates/host. Do not request private keys or passwords in chat.


GA4 ownership confirmation (2026-10-23): owner screenshots confirm Administrator access to Portfolio-Website, numeric property ID `502802105`, stream ID `12082623710`, production URL `https://ahmed-ashar.vercel.app/`, and measurement ID `G-77MPKKC7BM`. This replaces the older measurement ID previously in source. Loader, exclusion flag, setup UI, tests and documentation now use the confirmed stream. Owner added GA_PROPERTY_ID in Vercel Production (value hidden in screenshot). Service-account creation, Viewer access, GA_CLIENT_EMAIL/GA_PRIVATE_KEY and live reporting verification remain pending. The stream reports recent collection, but this does not verify the new dashboard reporting connection.

## 23. Dynamic project stories (2026-10-28)

### Homepage content sizing (2026-10-29)

Public Lenis touch scrolling: Shell now sets syncTouch: true alongside smoothWheel, enabling touch-driven Lenis scrolling and release inertia. Dashboard still bypasses ReactLenis and uses native scrolling. Verified with emulated mobile touch swipes, active lenis-smooth, continued movement after release, route scroll reset and no Lenis class on dashboard; physical-device feel remains device-dependent.

Footer watermark correction: Home retains its normal-flow footer, with CONTACT restored to 18vw. The owner subsequently requested a small bottom gap: 24px on mobile and 32px at sm+, with matching upward offsets in the reveal footer. Verified at 390px and 1440px without horizontal overflow.

Owner requested local-only removal of full-screen section sizing on Home. Hero no longer has min-h-screen or an absolutely centered heading: content is in normal flow with responsive padding. Owner subsequently increased hero padding to 176px top/128px bottom on mobile and 224px top/160px bottom at sm+, without adding a fixed height. Its DotGrid is an absolute background matching the hero's content height, overriding DotGrid's default 85vh. Intro/Approach padding is reduced to 64/96px. At the owner's correction, ABOUT ME, PROJECTS and APPROACH watermark headings retain their original sticky top-50 sm:top-30 behavior. Content-sized section heights do not imply removing this effect. Featured cards use natural image heights and 40/64px gaps instead of 65vh cards and 280px gaps. At the owner's correction, their sticky stacking is restored; the owner subsequently moved cards down to top-[23vh] sm:top-[24vh] and the PROJECTS heading up to top-24 sm:top-20 for separation; these are scroll offsets, not fixed card heights. Cards use progressive sticky positions only below 1100px: 23vh plus 18px per card below 640px, and 24vh plus 24px per card from 640px through 1099px. At 1100px and above, every card shares the same 24vh sticky position for full overlap. Explicit ascending z-index keeps later cards above earlier cards. Removed the old card shrink/fade exit tweens so earlier upper edges stay visible; TiltedCard hover/parallax remain. A ResizeObserver measures natural card heights and adds trailing margin to the last card when earlier cards are taller, preserving their sticky positions without fixed heights or aspect ratios. Actual pinning is covered at mobile and desktop widths, including unequal image heights. Shared responsive caption CSS now scopes to both project-listing and home-featured.

Home passes footerReveal=false to SiteLayout. FooterSection's new reveal prop defaults true for other routes; false renders a content-sized footer in normal flow. Home reserves no 79vh body margin, including SSR via home.css's body:has(.home-page) rule. Route changes restore the other pages' original reveal footer. Do not reintroduce fixed/minimum viewport heights on Home to repair spacing. tests/home-layout.spec.js changes viewport height at fixed width to verify section heights stay content-driven, checks natural featured image size, and checks footer behavior across navigation.

Projects heading resize correction: the Magnet wrapper now has `w-full`; TextReveal opts into a `responsive` mode only for this heading. SplitText autoSplit and an onSplit-returned tween rebuild line breaks after width/font changes while preserving reveal progress. Previously resizing from 900px to 1920px retained the narrow four-line heading even as its parent widened. A regression test repeatedly resizes narrow/wide/mobile and verifies reflow, visible text and working filters. Other TextReveal callers retain their existing animation lifecycle.

### Mobile project images (2026-10-29; supersedes version 2 below)

Content version is now 3. Every project adds `mobileImage` (empty or an allowed HTTPS/local image URL), `mobileWidth` and `mobileHeight` (positive integers). Versions 1 and 2 migrate without mutating the source or writing storage: story migration runs for v1, then missing mobile fields are filled with an empty URL and rounded desktop dimensions. Existing desktop images, stories and revisions remain intact. Always retain validateContent's returned value.

Dashboard Projects labels the existing cover as **Desktop image**, exposes **Mobile image (optional)** with upload/preview/URL, and offers **Use desktop image on mobile** to clear it. Uploads update the appropriate dimensions, without changing the other image. Both use the same alt description. Pasted mobile URLs require matching dimensions. Existing save, preview, publication and backup flows carry these fields.

TiltedCard's internal ResponsiveImage uses native picture/source selection below 640px and forwards the actual img ref to SimpleParallax. It renders a plain image when no mobile override exists. Projects cards, home featured work, story covers and next-project images all pass mobile properties. Story cover framing uses the selected source dimensions via responsive CSS variables. Ordinary story section illustrations are unchanged. Public SEO sharing still uses the desktop cover. Native sources work before hydration and in dashboard iframe previews. Projects retain natural image-based height, 50/50 paired widths, inside captions and disabled image parallax.

`server/content.test.mjs` covers old-record migration, immutable source data and mobile URL/dimension validation. `tests/project-images.spec.js` checks 639/640px selection, resizing, fallback, natural card height and parallax on the other surfaces. Dashboard integration tests upload a mobile image, verify its saved dimensions, publish and verify the server-rendered story chooses it even with JavaScript disabled. Test images remain in isolated test CMS stores, not the owner's content.

This section supersedes the earlier version-1 schema and external project-card navigation descriptions. The owner requested English blog-style project stories matching the current theme, editable content, and local browser review. Cards now use React Router links to `/projects/:slug`. A story has separate live-site and optional GitHub-source links. No commit, push or deployment is authorized by this feature request.

- `src/content/defaults.json` now uses version 2. Every project adds a unique lowercase `slug` and `story`: `eyebrow`, `role`, `timeline`, `technologies` (string list), `sourceUrl` (optional HTTPS), optional `seoTitle`/`seoDescription`, and reorderable `sections` with `title`, `body`, `image`, `alt`, `showImage`. There are at most 100 items per array as before. Slugs allow single hyphens, at most 100 characters; changing one does not create a redirect.
- `src/content/projects.js` owns `projectPath`, slug generation, section templates, story creation and v1-to-v2 migration. `validateContent` RETURNS migrated content; callers must retain that result. Migration clones v1 records, preserves authored fields, assigns collision-free slugs, and seeds matching known projects or creates empty story sections around existing descriptions. It never writes storage on a read. Version 2 input remains strict; missing required properties are rejected.
- `server/cms.mjs` upgrades draft/published/previous records on reads and mutations. Existing revision and ETag rules stay in effect. The next deliberate save/publish persists the upgraded record. Existing owner credentials and records must not be reset. Old exported v1 backups remain importable.
- `src/pages/ProjectStory.jsx` and `project-story.css` provide a shared-theme article layout, project facts, cover, contents navigation, technologies, numbered sections, computed reading time and next-project link. Body is safe plain text with blank-line paragraphs; no raw HTML/Markdown. Empty sections are hidden unless their image is enabled. Hidden/unknown projects render the existing 404. Author comes from identity. Empty role/timeline/source fields are omitted.
- Story image refinement (2026-10-28): cover width/max-width now matches the article header (82%/1300px desktop, 88% mobile), replacing the wider 90%/1460px cover. Cover, optional section images and next-project imagery reuse the existing `TiltedCard` for pointer tilt, hover tint/caption and SimpleParallax. Aspect-ratio media frames clip transformed images. Caption/figure CSS uses direct-child or dedicated selectors to avoid overriding TiltedCard internals. Story browser tests check alignment and real hover/parallax behavior for all three image positions.
- Projects grid refinement (2026-10-28): single/pair/pair rows, equal columns at lg and stacking below lg. Latest explicit owner instruction removes BOTH fixed card heights AND imposed image aspect ratios. ProjectPage passes naturalHeight and enableParallax=false to TiltedCard: image width 100%, height auto, normal flow, original intrinsic proportions. No fixed/min-height wrapper and no aspect-ratio override. Text remains INSIDE the image as ProjectCard overlay; projects.css scales caption spacing/type to card width. Different original image ratios naturally produce different card heights, including within pairs. Homepage/story image settings retain their existing behavior. Story media backgrounds remain transparent.
- Dashboard adds **Project stories** with project selection and story-specific iframe preview. Slug, repository link, metadata, paragraphs, technology list and section images are editable. Root title/cover/live URL/visibility remain under **Projects**. The recursive editor resolves templates for empty nested story sections. Section image uploads do not change the project cover dimensions. New project names/slugs are made unique. Overview page count includes visible stories.
- `src/seo.js`, build prerendering, runtime page handler, Vercel rewrite and review server support dynamic story routes and published sitemap entries. Custom story search fields fall back to project title/description; social image uses the project cover. Arbitrary newly published slugs work without rebuilding. Static fallbacks only contain default projects.
- Analytics tracker recognizes visible story routes and uses capture listeners so React Router navigation does not swallow project click events. Initial loader permits story URL shapes; tracker still excludes unknown/hidden routes and privacy opt-outs. Reports receive published story paths and include them in their cache key. Scroll charts offer returned story paths.
- Default detailed portfolio story is grounded in this repository and documented fixes. Other projects have their existing descriptions with empty editable story sections, not fabricated personal history. The only seeded GitHub repository URL is the known Portfolio origin. Add actual project repository URLs through the editor.
- Validation: 43 existing portfolio browser tests, 3 analytics browser tests, 3 new story browser tests and 3 dashboard browser tests passed. Dashboard tests use isolated stores and now verify story authoring, preview, draft privacy, publication, SSR and sitemap inclusion. `server/content.test.mjs` covers migration/no mutation, slug collisions, safe source links, empty sections and visible SEO routes; `npm run test:content` is included in `npm run check`. Screenshots remain ignored under artifacts. Local Vite review runs at `http://127.0.0.1:5173`; verify the process is still alive in a later session.
