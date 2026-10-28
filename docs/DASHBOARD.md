# Portfolio Studio

Open `/dashboard` to edit the complete portfolio. In local development, the first visit lets the owner create an administrator password. Production never permits public account setup.

## What you can edit

Each project supports a **Desktop image** and an optional **Mobile image**. In **Projects**, expand a project and upload or paste the two image URLs. Screens below 640px use the mobile image on the homepage, project listing and project story; larger screens use the desktop image. An empty mobile image falls back to desktop. **Use desktop image on mobile** removes the override. Uploads fill the corresponding dimensions automatically; for pasted mobile URLs, enter the image width and height. The image description is shared between both versions. Save and publish as usual; the dashboard's mobile/desktop iframe previews show the appropriate source.

Existing version 1 and 2 records/backups migrate in memory to version 3 with no mobile override. Reading content does not rewrite the owner's store. An explicit save/publish persists the upgraded model.

- Home: hero lines and accent, dot background, scrolling skills and speed, introduction, featured projects, approach, section visibility and ordering.
- About: biography, portrait, skills, education, experience, certificates, contact links, section headings, visibility and ordering.
- Projects: add, remove and reorder projects; upload images; change descriptions, URLs, captions, accessibility text, image dimensions, categories and featured/visible flags.
- Shared: brand and name, navigation labels, location/time zone, rotating taglines, clock, social sidebar, cursor, navigation dock and back-to-top visibility.
- Footer: heading, contact email, address, links, labels, watermark and visibility.
- Appearance: background, surface, text and accent colors in both themes; website font.
- Search/share metadata for every public page, social image, canonical site address, and 404 content.

Edits remain in the editor until **Save draft**. **Publish** saves and publishes the current editor content. Preview uses the actual website with draft content. **Restore previous publication** copies the previous public content into a draft; it does not publish until you choose Publish. JSON export/import backs up content; images remain in storage and must be retained separately.

## Local development

Run `npm run dev`, then visit `http://127.0.0.1:5173/dashboard`. Choose a password with at least 12 characters. The server stores password hashes, sessions, content, and images under ignored `.local/cms/`; it never stores plaintext passwords. Restarting the server preserves them. Local publishing affects this local copy only.

The browser does not store credentials or website content in localStorage. Drafts and publications are server-side. Logout revokes the session on the server. Sessions expire after eight hours. Ten failed sign-in attempts lock new sign-ins for fifteen minutes. Changing the configured password hash invalidates existing sessions.

## Enable on the existing Vercel project

1. Connect a **private** Vercel Blob store to this project. Vercel supplies `BLOB_READ_WRITE_TOKEN` as a server environment variable. Use separate stores for Production and Preview if preview deployments should not edit production content.
2. Run `node scripts/admin-password.mjs` in your own terminal. It asks for a password without echoing it and writes the hash to ignored `.local/admin-password.hash`.
3. Set server environment variable `ADMIN_PASSWORD_HASH` in Vercel to the file's contents. Do not prefix either secret with `VITE_` or commit them.
4. Deploy this repository to the existing Vercel project using `npm run build`. `vercel.json` routes the public pages and `/dashboard` through the rendering function and includes the server bundle. Existing static assets remain static.
5. Open your live site's `/dashboard`, sign in with the password chosen in step 2, and publish your content. No rebuild is needed for subsequent content changes.

The first live visit uses the existing portfolio content as the starting draft. Local content does not automatically replace live content. A local JSON backup can be imported, but locally uploaded images must be uploaded again to the live dashboard. Live settings and uploaded images survive deployments because they are in Vercel Blob, not the deployment filesystem.

Deployment and the real Blob integration require access to the owner's Vercel project and its environment variables. Local tests use a file-backed store with the same API; they do not verify a live Blob account. If the production store or admin hash is missing, admin access stays disabled and the original public content remains available.

## Validation and implementation

`npm run build` builds the client, server renderer and static fallback pages. The live renderer serves the latest publication in HTML, page metadata and JSON-LD, so search crawlers see published content without waiting for JavaScript. `/api/content` returns only the published copy; `/api/admin` requires authentication for drafts, uploads and changes. Writes check same-origin requests, validate content and use revision numbers. Blob writes also use ETag preconditions to reject concurrent overwrites.

Images are limited to PNG, JPEG, WebP and GIF, at 3 MB per file. Uploads are stored privately and served from immutable same-origin media URLs. Content is rendered as text, not arbitrary HTML. A content backup does not include image binary data. Old uploaded images are retained, including those referenced by a previous publication.

Run `npx playwright test --config playwright.dashboard.config.js` for isolated dashboard browser tests; they use a separate temporary directory under `.local/` and a separate server port. Run `npm test` for public-page regressions. Run `npm run lint` for code checks.
## Audience analytics

The dashboard's **Analytics** section reads real Google Analytics 4 reports through the authenticated backend. It includes unique visitors, sessions, page views, engagement rate, foreground engagement time per visit, pages per visit, new users, average visit duration, daily trends, page-level engagement, sources, countries, devices, scroll milestones, and project/contact/filter/navigation interactions. CSV exports contain the displayed report data.

Choose 7, 30 or 90 complete days. Reports end yesterday in the GA4 property's time zone and compare with the preceding equally sized period. Reports are cached for five minutes per server instance. Google processing can take 24-48 hours. Unique visitors are GA4 estimates, not identifiable people; daily or per-page user counts must not be added together to get period uniques. Scroll charts count milestone events, not funnel conversions, and contact clicks are not confirmed enquiries.

### Connect your existing GA4 property

1. Sign in at https://analytics.google.com/ and find the web stream with measurement ID `G-77MPKKC7BM`. Open the property's details and copy its **numeric Property ID**, which is different from the measurement ID. If this property is owned by someone else, ask them to grant you access; the public measurement ID cannot grant report access.
2. In Google Cloud, enable the **Google Analytics Data API**. Create a service account and generate a JSON key. Keep the downloaded file outside the repository or under ignored `.local/`; never commit it.
3. In GA4 property access management, add the service account's `client_email` as a **Viewer**. No domain-wide delegation or write access is required.
4. Add these server-only Production environment variables in Vercel, then deploy:

| Variable | Value |
| --- | --- |
| `GA_PROPERTY_ID` | Numeric GA4 Property ID |
| `GA_CLIENT_EMAIL` | The JSON key's `client_email` |
| `GA_PRIVATE_KEY` | The JSON key's `private_key`; set as a Secret. Actual line breaks or literal `\n` are supported. |

Do not use `VITE_` prefixes. Do not paste the full JSON into `GA_PRIVATE_KEY` or share the key in chat. For local development, the Vite middleware reads these same names from ignored `.env.local`. The production review server instead uses its process environment.

5. In GA4 **Custom definitions**, create an event-scoped dimension named **Interaction label**, with event parameter **`interaction_label`**. This enables project names and selected filter names in the interaction table. Core reports work without this definition. Named details are not retroactive and can take time to process.
6. Confirm that the GA4 stream's enhanced measurement tracks History API page changes. The existing loader handles standard page views; the new tracker deliberately does not emit a second `page_view`.
7. Sign into `/dashboard`, open Analytics, and verify reports against the same property, period and hostname in GA4. The hostname comes from the **published** Search & sharing site URL, not an unsaved draft. Only `/`, `/about` and `/projects` are included.

Existing traffic can appear after connection if GA4 collected it. New custom events only start after this code is deployed; they cannot reconstruct past clicks or scroll depth. Without credentials, the panel displays setup instructions instead of example statistics. API failures display an error rather than zero traffic. Lack of a custom dimension displays a scoped detail-table notice while core reports remain usable.

### Tracking boundaries

`public/analytics.js` loads GA4 only on the production hostname, public routes, and top-level windows. It skips Global Privacy Control and Do Not Track opt-outs. `AnalyticsTracker` adds `portfolio_scroll_25`, `_50`, `_75`, `_90` once per route mount, `portfolio_project_open`, `portfolio_contact` (email/phone/WhatsApp), `portfolio_filter`, and `portfolio_navigation`. Custom events contain authored labels and a query-free page URL, not form values, email addresses or full external URLs. Standard GA4 tracking retains its own configured collection behavior; review the property's consent and retention settings as appropriate to the website's audience.

The reports require an admin session and are not public API data. Credentials stay in server environment variables. The Analytics read-only OAuth scope cannot modify the property. Analytics data is held by Google; it is not written to the CMS Blob store or included in content backups. The feature does not provide session recordings, heatmaps, individual visitor identities or live presence.

### Analytics validation

- `npm run test:analytics`: report date math, cache/coalescing, filtering, missing credentials, safe API errors and optional custom dimension behavior.
- `npm test`: public-site regression tests plus scroll/click tracking, route changes, privacy and iframe exclusions.
- `npx playwright test --config playwright.dashboard.config.js`: real local admin authorization and isolated CMS flows, plus controlled-report analytics charts, ranges, CSV injection protection, empty/error states and mobile layout.

Browser chart fixtures exist only in tests and are never used by the dashboard. Passing local tests does not verify Google account permissions or live report compatibility; the owner's GA4 connection must be checked after deployment.

References: [GA4 Data API setup](https://developers.google.com/analytics/devguides/reporting/data/v1/quickstart-client-libraries), [dimensions and metrics](https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema), [data freshness](https://support.google.com/analytics/answer/11198161).

## Writing project stories

Every visible project has a page at `/projects/<slug>`. Cards on the homepage and Projects page open that story. Its **Visit live site** button uses the project's existing link; **View source on GitHub** appears when a repository URL is provided.

Open **Project stories** in the dashboard and choose a project. Edit the page URL slug, introduction label, role, timeline, tools, GitHub URL and optional search metadata. The project title, cover, description, live link and visibility are managed under **Projects**. Changing a slug changes the public URL; old URLs are not redirected automatically.

Story sections support a heading, paragraphs and an optional image upload. Add, reorder or remove sections to describe goals, development, challenges, solutions, results and lessons. Separate paragraphs with a blank line. Empty sections without an enabled image are omitted from the public page. Text is rendered as plain text, not HTML or Markdown. The contents navigation and reading time follow the authored sections automatically.

Preview the selected story, save the draft, then publish when ready. Draft stories and new projects do not become public until publication. Hidden projects return a 404 and are omitted from the sitemap. Backups include stories and URLs, but uploaded media still needs its original storage.

Version 1 backups and existing CMS records are upgraded to version 2 in memory, preserving existing content and assigning unique slugs. Reading a record does not rewrite storage. Saving or publishing persists the upgraded model. The portfolio's own story is seeded from the repository; other projects start with their existing descriptions and editable empty sections, so unverified project history is not presented as fact.
