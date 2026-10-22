# Portfolio Studio

Open `/dashboard` to edit the complete portfolio. In local development, the first visit lets the owner create an administrator password. Production never permits public account setup.

## What you can edit

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
