import { useCallback, useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import { defaults, templates, validateContent } from "../content/schema";
import "./dashboard.css";
const sections = [
  {
    id: "overview",
    name: "Overview",
    icon: "\u25eb",
    group: "WORKSPACE",
    description: "A little care. A better website.",
  },
  {
    id: "home.hero",
    name: "Hero",
    icon: "\u2197",
    group: "HOME PAGE",
    description: "Make a strong first impression.",
    route: "/",
  },
  {
    id: "home.marquee",
    name: "Skills marquee",
    icon: "\u2248",
    description: "The tools that move with your work.",
    route: "/",
  },
  {
    id: "home.intro",
    name: "Introduction",
    icon: "\u2630",
    description: "Introduce yourself in your own words.",
    route: "/",
  },
  {
    id: "home.featured",
    name: "Featured work",
    icon: "\u25a6",
    description: "Choose how your selected projects appear.",
    route: "/",
  },
  {
    id: "home.approach",
    name: "Approach",
    icon: "\u275e",
    description: "Share the thinking behind your work.",
    route: "/",
  },
  {
    id: "home.order",
    name: "Section order",
    icon: "\u21c5",
    description: "Move sections up or down to arrange your homepage.",
    route: "/",
  },
  {
    id: "about",
    name: "About page",
    icon: "\u25ce",
    group: "YOUR CONTENT",
    description: "Your story, skills, experience and ways to get in touch.",
    route: "/about",
  },
  {
    id: "portfolio",
    name: "Projects",
    icon: "\u25a4",
    description: "Curate your work. Add projects, images and categories.",
    route: "/projects",
  },
  {
    id: "identity",
    name: "Navigation & identity",
    icon: "\u2318",
    group: "SITE SETTINGS",
    description: "The details that connect every page.",
    route: "/",
  },
  {
    id: "footer",
    name: "Footer & social links",
    icon: "\u2199",
    description: "Give visitors a clear next step.",
    route: "/",
  },
  {
    id: "appearance",
    name: "Appearance",
    icon: "\u25d0",
    description: "Make both themes feel like you.",
    route: "/",
  },
  {
    id: "seo",
    name: "Search & sharing",
    icon: "\u2315",
    description: "Control how your pages appear in search and shared links.",
    route: "/",
  },
  {
    id: "notFound",
    name: "404 page",
    icon: "\u21aa",
    description: "Help visitors find their way back.",
    route: "/missing-page",
  },
];
const labels = {
  black: "Background",
  gray: "Surface",
  textOff: "Text",
  orange: "Accent",
  para: "Description",
  alt: "Image description",
  caption: "Hover caption",
  image: "Image",
  profile: "Profile image",
  profileAlt: "Profile image description",
  from: "Source / label",
  destination: "Institution",
  closing: "Closing statement",
  certificate: "Certificates",
  intro: "Description",
  body: "Text",
  siteUrl: "Website address",
  siteName: "Site name",
  name: "Full name",
  brand: "Logo text",
  role: "Job title",
  timeZone: "Time zone",
  showSocials: "Show social sidebar",
  showCursor: "Show animated cursor",
  showBackToTop: "Show back-to-top button",
  showDock: "Show navigation dock",
  accentLine: "Accent line number",
  allLabel: "All projects label",
  enabled: "Show this section",
  visible: "Show this project",
  featured: "Include in featured work",
  order: "Section order",
  count: "Number of featured projects",
  showInSidebar: "Show in social sidebar",
  font: "Website font",
  dark: "Dark theme",
  light: "Light theme",
};
const titleFor = (key) =>
  labels[key] ||
  key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
const get = (object, path) => path.split(".").reduce((v, k) => v?.[k], object);
const clone = (value) => structuredClone(value);
async function request(action, data = {}) {
  const response = await fetch(
    "/api/admin" +
      (action === "status" ? "" : action === "load" ? "?action=content" : ""),
    action === "status" || action === "load"
      ? {}
      : {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, ...data }),
        },
  );
  let result;
  try {
    result = await response.json();
  } catch {
    throw new Error("The dashboard server is unavailable. Please try again.");
  }
  if (!response.ok)
    throw new Error(result.error || "The request could not be completed.");
  return result;
}
function Field({ value, path, onChange, onError, categories = [] }) {
  const key = path.split(".").pop();
  const label =
    key === "name" && path.startsWith("footer.links.")
      ? "Link name"
      : titleFor(key);
  const id = "field-" + path;
  const [uploading, setUploading] = useState(false);
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      if (file.size > 3000000)
        throw new Error("Choose an image smaller than 3 MB.");
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result.split(",")[1]);
        reader.onerror = () => reject(new Error("Could not read that image."));
        reader.readAsDataURL(file);
      });
      const result = await request("upload", { data });
      onChange(path, result.url);
      if (path.startsWith("portfolio.projects.")) {
        const bitmap = await createImageBitmap(file);
        const parent = path.slice(0, path.lastIndexOf("."));
        onChange(parent + ".width", bitmap.width);
        onChange(parent + ".height", bitmap.height);
        bitmap.close();
      }
    } catch (error) {
      onError(error.message);
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }
  if (key === "tags")
    return (
      <fieldset className="tag-picker">
        <legend>Categories</legend>
        {categories.map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              checked={value.includes(category)}
              onChange={(event) =>
                onChange(
                  path,
                  event.target.checked
                    ? [...value, category]
                    : value.filter((v) => v !== category),
                )
              }
            />
            {category}
          </label>
        ))}
      </fieldset>
    );
  if (Array.isArray(value)) {
    const fixed = key === "order";
    const move = (i, d) => {
      const next = [...value];
      [next[i], next[i + d]] = [next[i + d], next[i]];
      onChange(path, next);
    };
    return (
      <section className="editor-array" aria-label={label}>
        <div className="field-heading">
          <h3>
            {label} <span>{value.length}</span>
          </h3>
          {!fixed && (
            <button
              className="small-button"
              type="button"
              onClick={() =>
                onChange(path, [
                  ...value,
                  clone(
                    templates[path] ||
                      (typeof value[0] === "object" ? value[0] : "New item"),
                  ),
                ])
              }
            >
              + Add {key === "projects" ? "project" : "item"}
            </button>
          )}
        </div>
        {!value.length && (
          <p className="empty-field">Nothing here yet. Add your first item.</p>
        )}
        {value.map((item, index) => (
          <div key={index} className="array-item">
            <div className="item-controls">
              <span className="item-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <button
                  type="button"
                  aria-label={`Move ${label} item ${index + 1} up`}
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  &#8593;
                </button>
                <button
                  type="button"
                  aria-label={`Move ${label} item ${index + 1} down`}
                  disabled={index === value.length - 1}
                  onClick={() => move(index, 1)}
                >
                  &#8595;
                </button>
                {!fixed && (
                  <button
                    type="button"
                    aria-label={`Remove ${label} item ${index + 1}`}
                    onClick={() =>
                      onChange(
                        path,
                        value.filter((_, i) => i !== index),
                      )
                    }
                  >
                    &#215;
                  </button>
                )}
              </div>
            </div>
            {fixed ? (
              <p className="order-label">
                {sections.find((s) => s.id === "home." + item)?.name ||
                  titleFor(item)}
              </p>
            ) : typeof item === "object" ? (
              <details open={value.length === 1}>
                <summary>
                  {item.title || item.name || `Item ${index + 1}`}
                  <span>Edit details</span>
                </summary>
                <div className="details-fields">
                  <Field
                    value={item}
                    path={path + "." + index}
                    onChange={onChange}
                    onError={onError}
                    categories={categories}
                  />
                </div>
              </details>
            ) : (
              <label className="field">
                <span className="sr-only">
                  {label} {index + 1}
                </span>
                <textarea
                  aria-label={`${label} ${index + 1}`}
                  rows={item.length > 100 ? 4 : 1}
                  value={item}
                  onChange={(e) => onChange(path + "." + index, e.target.value)}
                />
              </label>
            )}
          </div>
        ))}
      </section>
    );
  }
  if (value && typeof value === "object")
    return (
      <div className="object-fields">
        {Object.entries(value)
          .filter(([k]) => k !== "version")
          .map(([k, v]) =>
            typeof v === "object" && !Array.isArray(v) ? (
              <section className="editor-section" key={k}>
                <h3>{titleFor(k)}</h3>
                <Field
                  value={v}
                  path={path + "." + k}
                  onChange={onChange}
                  onError={onError}
                  categories={categories}
                />
              </section>
            ) : (
              <Field
                key={k}
                value={v}
                path={path + "." + k}
                onChange={onChange}
                onError={onError}
                categories={categories}
              />
            ),
          )}
      </div>
    );
  if (typeof value === "boolean")
    return (
      <label className="toggle-field" htmlFor={id}>
        <span>{label}</span>
        <input
          id={id}
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(path, e.target.checked)}
        />
        <span className="switch" aria-hidden="true" />
      </label>
    );
  const image = ["image", "profile"].includes(key);
  const color = path.startsWith("appearance.") && key !== "font";
  const multiline =
    [
      "body",
      "description",
      "intro",
      "heading",
      "address",
      "caption",
      "closing",
      "para",
    ].includes(key) || value?.length > 120;
  return (
    <div className={"field" + (image ? " image-field" : "")}>
      <label htmlFor={id}>{label}</label>
      {image && (
        <img
          src={value}
          alt="Selected image preview"
          onError={(e) => {
            e.currentTarget.style.visibility = "hidden";
          }}
          onLoad={(e) => {
            e.currentTarget.style.visibility = "visible";
          }}
        />
      )}
      {color ? (
        <div className="color-field">
          <input
            aria-label={`${label} color picker`}
            type="color"
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
          <input
            id={id}
            value={value}
            onChange={(e) => onChange(path, e.target.value)}
          />
        </div>
      ) : key === "font" ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
        >
          <option>Avant Garde, sans-serif</option>
          <option>"Red Hat Mono", monospace</option>
          <option>Georgia, serif</option>
          <option>Arial, sans-serif</option>
        </select>
      ) : multiline ? (
        <textarea
          id={id}
          rows={key === "heading" ? 2 : 4}
          value={value}
          onChange={(e) => onChange(path, e.target.value)}
        />
      ) : (
        <input
          id={id}
          type={typeof value === "number" ? "number" : "text"}
          value={value}
          onChange={(e) =>
            onChange(
              path,
              typeof value === "number"
                ? Number(e.target.value)
                : e.target.value,
            )
          }
        />
      )}
      {image && (
        <label className="upload-button">
          {uploading ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={uploading}
            onChange={upload}
          />
          <small>PNG, JPG, WebP or GIF / up to 3 MB</small>
        </label>
      )}
    </div>
  );
}
function SignIn({ status, onSignedIn }) {
  const { identity } = useContent();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const setup = status.setupAllowed;
  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (setup) {
        if (password !== confirm)
          throw new Error("The passwords do not match.");
        await request("setup", { password });
      }
      await request("login", { password });
      setPassword("");
      setConfirm("");
      await onSignedIn();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="login-layout">
      <div className="login-art">
        <span className="studio-mark">{identity.brand}</span>
        <p>
          YOUR WORK.
          <br />
          YOUR WORDS.
          <br />
          <em>YOUR SPACE.</em>
        </p>
        <span className="login-caption">A home for everything you create.</span>
        <div className="art-orbit" />
      </div>
      <main id="main-content" className="login-panel">
        <span className="eyebrow">PORTFOLIO STUDIO / ADMIN</span>
        <h1>{setup ? "Make it yours." : "Welcome back."}</h1>
        <p>
          {setup
            ? "Create your administrator password to start managing your portfolio."
            : "Sign in to shape what the world sees."}
        </p>
        {status.message ? (
          <div className="notice error">{status.message}</div>
        ) : (
          <form onSubmit={submit}>
            <label className="field">
              <span>{setup ? "Create a password" : "Admin password"}</span>
              <input
                type="password"
                required
                minLength={setup ? 12 : 1}
                maxLength={256}
                autoComplete={setup ? "new-password" : "current-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            {setup && (
              <>
                <p className="muted">Use at least 12 characters.</p>
                <label className="field">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    required
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                  />
                </label>
              </>
            )}
            {error && (
              <p role="alert" className="notice error">
                {error}
              </p>
            )}
            <button className="primary-button" disabled={busy}>
              {busy
                ? "Signing in..."
                : setup
                  ? "Create admin account"
                  : "Sign in"}
            </button>
          </form>
        )}
        <a className="back-link" href="/">
          Back to website
        </a>
        <small className="environment-label">{status.storage}</small>
      </main>
    </div>
  );
}
export default function Dashboard() {
  const { identity } = useContent();
  const [status, setStatus] = useState(null),
    [saved, setSaved] = useState(null),
    [draft, setDraft] = useState(null),
    [selected, setSelected] = useState("overview"),
    [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState(true),
    [device, setDevice] = useState("mobile"),
    [confirm, setConfirm] = useState(null),
    [search, setSearch] = useState("");
  const iframe = useRef(null),
    previewBox = useRef(null),
    [previewWidth, setPreviewWidth] = useState(360);
  const active = sections.find((s) => s.id === selected);
  const route = active.route || "/";
  const dirty = Boolean(
    draft && saved && JSON.stringify(draft) !== JSON.stringify(saved.draft),
  );
  const unpublished = Boolean(
    draft && saved && JSON.stringify(draft) !== JSON.stringify(saved.published),
  );
  const load = useCallback(async () => {
    const info = await request("status");
    setStatus(info);
    if (info.authenticated) {
      const data = await request("load");
      setSaved(data);
      setDraft(clone(data.draft));
    }
  }, []);
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, [load]);
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selected]);
  useEffect(() => {
    document.body.classList.add("dashboard-body");
    return () => {
      document.body.classList.remove("dashboard-body");
    };
  }, []);
  useEffect(() => {
    const leave = (e) => {
      if (dirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => window.removeEventListener("beforeunload", leave);
  }, [dirty]);
  const sendPreview = useCallback(() => {
    if (!draft) return;
    try {
      validateContent(draft);
      iframe.current?.contentWindow?.postMessage(
        { type: "portfolio-preview", content: draft },
        location.origin,
      );
    } catch {
      /* Keep preview at the last valid edit. */
    }
  }, [draft]);
  useEffect(() => {
    const timer = setTimeout(sendPreview, 350);
    const receive = (e) => {
      if (
        e.origin === location.origin &&
        e.source === iframe.current?.contentWindow &&
        e.data?.type === "portfolio-preview-ready"
      )
        sendPreview();
    };
    window.addEventListener("message", receive);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("message", receive);
    };
  }, [sendPreview, route, preview]);
  useEffect(() => {
    if (!previewBox.current) return;
    const observer = new ResizeObserver((entries) =>
      setPreviewWidth(entries[0].contentRect.width),
    );
    observer.observe(previewBox.current);
    return () => observer.disconnect();
  }, [preview, selected, status, saved]);
  function change(path, value) {
    setDraft((old) => {
      const next = clone(old);
      const parts = path.split(".");
      const key = parts.pop();
      if (parts.join(".") === "portfolio.categories") {
        const oldCategory = next.portfolio.categories[key];
        next.portfolio.projects.forEach((project) => {
          project.tags = project.tags.map((tag) =>
            tag === oldCategory ? value : tag,
          );
        });
      }
      if (parts.length) get(next, parts.join("."))[key] = value;
      else next[key] = value;
      return next;
    });
    setNotice("");
  }
  async function save(action) {
    setBusy(true);
    setError("");
    try {
      if (action !== "restore") validateContent(draft);
      const data = await request(action, {
        content: draft,
        revision: saved.revision,
      });
      setSaved(data);
      setDraft(clone(data.draft));
      setNotice(
        action === "publish"
          ? "Published. Your website is up to date."
          : action === "restore"
            ? "Previous publication loaded as a draft. Review it before publishing."
            : "Draft saved. Your published website has not changed.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      setConfirm(null);
    }
  }
  function exportBackup() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download =
      "portfolio-backup-" + new Date().toISOString().slice(0, 10) + ".json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function importBackup(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 1000000) throw new Error("Backup is too large.");
      const content = validateContent(JSON.parse(await file.text()));
      setConfirm({
        title: "Replace your current draft?",
        text: "This imports the backup into the editor. Your published site stays as it is until you publish.",
        action: () => {
          setDraft(content);
          setConfirm(null);
          setNotice(
            "Backup imported. Review your changes, then save or publish.",
          );
        },
      });
    } catch (e) {
      setError(e.message);
    } finally {
      event.target.value = "";
    }
  }
  if (!status)
    return (
      <div className="dashboard">
        <main id="main-content" className="dashboard-loading">
          <span className="studio-mark">{identity.brand}</span>
          <p>{error || "Opening your studio..."}</p>
          {error && (
            <button onClick={() => load().catch((e) => setError(e.message))}>
              Try again
            </button>
          )}
        </main>
      </div>
    );
  if (!status.authenticated)
    return (
      <div className="dashboard">
        <SignIn status={status} onSignedIn={load} />
      </div>
    );
  if (!draft)
    return (
      <div className="dashboard">
        <main id="main-content" className="dashboard-loading">
          <p>{error || "Loading your content..."}</p>
          {error && (
            <button onClick={() => load().catch((e) => setError(e.message))}>
              Try again
            </button>
          )}
        </main>
      </div>
    );
  const visible = sections.filter(
    (s) => !search || s.name.toLowerCase().includes(search.toLowerCase()),
  );
  const frameWidth = device === "mobile" ? 390 : 1280;
  const scale = Math.min(previewWidth / frameWidth, 1);
  return (
    <div className="dashboard">
      <aside className="studio-sidebar">
        <a href="/dashboard" className="studio-brand">
          <span className="studio-mark">{draft.identity.brand}</span>
          <span>
            Portfolio<span>STUDIO</span>
          </span>
        </a>
        <label className="sidebar-search">
          <span aria-hidden="true">&#8981;</span>
          <input
            aria-label="Find a section"
            placeholder="Find a section..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <nav aria-label="Dashboard sections">
          {visible.map((section) => (
            <div key={section.id}>
              {section.group && !search && (
                <p className="nav-group">{section.group}</p>
              )}
              <button
                className={selected === section.id ? "active" : ""}
                aria-current={selected === section.id ? "page" : undefined}
                onClick={() => {
                  setSelected(section.id);
                  setError("");
                }}
              >
                <span aria-hidden="true">{section.icon}</span>
                {section.name}
                {selected === section.id && <i />}
              </button>
            </div>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a href="/" target="_blank" rel="noreferrer">
            View website <span aria-hidden="true">&#8599;</span>
          </a>
          <button
            onClick={() =>
              setConfirm({
                title: "Sign out?",
                text: dirty
                  ? "You have unsaved edits. Save your draft first to keep them."
                  : "Your saved drafts will be here when you return.",
                action: async () => {
                  try {
                    await request("logout");
                    setSaved(null);
                    setDraft(null);
                    setConfirm(null);
                    await load();
                  } catch (e) {
                    setError(e.message);
                    setConfirm(null);
                  }
                },
              })
            }
          >
            Sign out <span aria-hidden="true">&#8599;</span>
          </button>
          <span className="environment-label">{status.storage}</span>
        </div>
      </aside>
      <div className="studio-main">
        <header className="studio-topbar">
          <div>
            <span className="breadcrumb">
              Workspace <span>/</span> {active.name}
            </span>
            <span className={"save-state " + (dirty ? "unsaved" : "")}>
              <i />
              {dirty
                ? "Unsaved changes"
                : unpublished
                  ? "Draft ready to publish"
                  : "All changes saved"}
            </span>
          </div>
          <div className="topbar-actions">
            <button
              className="secondary-button"
              disabled={busy || !dirty}
              onClick={() => save("save")}
            >
              {busy ? "Working..." : "Save draft"}
            </button>
            <button
              className="primary-button"
              disabled={busy}
              onClick={() =>
                setConfirm({
                  title: "Publish your changes?",
                  text:
                    status.storage === "Local development"
                      ? "This updates the website running on this computer. Production publishing will be available after Vercel is connected and deployed."
                      : "Your current draft will become visible to everyone visiting your website.",
                  action: () => save("publish"),
                })
              }
            >
              Publish <span aria-hidden="true">&#8599;</span>
            </button>
          </div>
        </header>
        <main id="main-content" className="studio-workspace">
          <div className="page-heading">
            <div>
              <span className="eyebrow">YOUR PORTFOLIO, YOUR WAY</span>
              <h1>
                {selected === "overview" ? "Let’s make it yours." : active.name}
              </h1>
              <p>{active.description}</p>
            </div>
            {selected !== "overview" && (
              <button
                className="secondary-button"
                aria-pressed={preview}
                onClick={() => setPreview(!preview)}
              >
                {preview ? "Hide preview" : "Show preview"}
              </button>
            )}
          </div>
          {error && (
            <div role="alert" className="notice error">
              {error}
              <button aria-label="Dismiss error" onClick={() => setError("")}>
                &#215;
              </button>
            </div>
          )}
          {notice && (
            <div role="status" className="notice success">
              {notice}
            </div>
          )}
          {selected === "overview" ? (
            <>
              <section className="overview-banner">
                <div>
                  <span className="eyebrow">A SPACE THAT FEELS LIKE YOU</span>
                  <h2>
                    YOUR SITE.
                    <br />
                    YOUR WAY.
                  </h2>
                  <p>
                    Your content, your colors, your next chapter.
                    <br />
                    Everything you need to keep your portfolio growing.
                  </p>
                  <button onClick={() => setSelected("home.hero")}>
                    Customize your homepage{" "}
                    <span aria-hidden="true">&#8599;</span>
                  </button>
                </div>
                <div className="banner-type" aria-hidden="true">
                  Aa<span>&#10035;</span>
                </div>
              </section>
              <section className="stat-grid" aria-label="Portfolio overview">
                {[
                  ["Pages", "3", "Home, About & Projects"],
                  [
                    "Projects",
                    draft.portfolio.projects.length,
                    "Your collection of work",
                  ],
                  [
                    "Home sections",
                    draft.home.order.length,
                    "Arrange them your way",
                  ],
                  [
                    "Publication",
                    saved.publishedAt ? "Published" : "Original",
                    saved.publishedAt
                      ? new Date(saved.publishedAt).toLocaleDateString()
                      : "Ready for your first update",
                  ],
                ].map(([label, count, caption]) => (
                  <article key={label}>
                    <span>{label}</span>
                    <strong>{count}</strong>
                    <small>{caption}</small>
                  </article>
                ))}
              </section>
              <div className="overview-columns">
                <section className="dashboard-card">
                  <div className="card-heading">
                    <h2>Your pages</h2>
                    <span>Start with a section</span>
                  </div>
                  {[
                    ["01", "Home", "Your first impression", "home.hero"],
                    ["02", "About", "The person behind the work", "about"],
                    ["03", "Projects", "Work worth sharing", "portfolio"],
                  ].map(([n, name, desc, id]) => (
                    <button
                      className="page-row"
                      key={id}
                      onClick={() => setSelected(id)}
                    >
                      <span>{n}</span>
                      <div>
                        <strong>{name}</strong>
                        <small>{desc}</small>
                      </div>
                      <span aria-hidden="true">&#8599;</span>
                    </button>
                  ))}
                </section>
                <section className="dashboard-card backup-card">
                  <span className="eyebrow">KEEP A COPY</span>
                  <h2>
                    Your content.
                    <br />
                    Safely in your hands.
                  </h2>
                  <p>
                    Export a content backup, or import one as a draft. Uploaded
                    images remain in your connected storage.
                  </p>
                  <div>
                    <button className="secondary-button" onClick={exportBackup}>
                      Export backup
                    </button>
                    <label className="secondary-button">
                      Import backup
                      <input
                        type="file"
                        accept="application/json,.json"
                        onChange={importBackup}
                      />
                    </label>
                  </div>
                  {saved.previous && (
                    <button
                      className="text-button"
                      onClick={() =>
                        setConfirm({
                          title: "Restore the previous publication?",
                          text: "It will replace your saved draft. Review and publish it when you are ready.",
                          action: () => save("restore"),
                        })
                      }
                    >
                      Restore previous publication
                    </button>
                  )}
                </section>
              </div>
              <div className="workspace-note">
                <span aria-hidden="true">&#8599;</span>
                <p>
                  <strong>Make room to experiment.</strong> Save a draft to keep
                  your progress. Publish only when you’re ready for everyone to
                  see it.
                  {status.storage === "Local development" &&
                    " You are editing the local development copy; connect Vercel to manage the live website."}
                </p>
              </div>
            </>
          ) : (
            <div
              className={"editor-layout " + (!preview ? "without-preview" : "")}
            >
              <section className="dashboard-card editor-card">
                <div className="card-heading">
                  <div>
                    <h2>Section settings</h2>
                    <span>Changes appear in the preview as you edit.</span>
                  </div>
                  <button
                    className="text-button"
                    onClick={() =>
                      setConfirm({
                        title: "Reset this section?",
                        text: "The original content will replace this section in your draft. Other sections will stay as they are.",
                        action: () => {
                          change(selected, clone(get(defaults, selected)));
                          setConfirm(null);
                        },
                      })
                    }
                  >
                    Reset
                  </button>
                </div>
                <Field
                  value={get(draft, selected)}
                  path={selected}
                  onChange={change}
                  onError={setError}
                  categories={draft.portfolio.categories}
                />
                <div className="editor-footer">
                  <button
                    className="text-button"
                    onClick={() =>
                      setConfirm({
                        title: "Reload the saved draft?",
                        text: "Unsaved edits in this editor will be discarded.",
                        action: async () => {
                          try {
                            const data = await request("load");
                            setSaved(data);
                            setDraft(clone(data.draft));
                            setError("");
                          } catch (e) {
                            setError(e.message);
                          }
                          setConfirm(null);
                        },
                      })
                    }
                  >
                    Reload saved draft
                  </button>
                  <button
                    className="secondary-button"
                    disabled={busy || !dirty}
                    onClick={() => save("save")}
                  >
                    Save draft
                  </button>
                </div>
              </section>
              {preview && (
                <aside className="preview-panel">
                  <div className="preview-header">
                    <span>
                      <i /> DRAFT PREVIEW
                    </span>
                    <div>
                      <button
                        aria-label="Mobile preview"
                        aria-pressed={device === "mobile"}
                        onClick={() => setDevice("mobile")}
                      >
                        &#9647;
                      </button>
                      <button
                        aria-label="Desktop preview"
                        aria-pressed={device === "desktop"}
                        onClick={() => setDevice("desktop")}
                      >
                        &#9645;
                      </button>
                    </div>
                  </div>
                  <div className="preview-address">
                    {route === "/" ? "Home" : route.slice(1)}{" "}
                    <span aria-hidden="true">&#8599;</span>
                  </div>
                  <div ref={previewBox} className="preview-screen">
                    <iframe
                      ref={iframe}
                      title="Website draft preview"
                      src={route + "?editor-preview=1"}
                      onLoad={sendPreview}
                      style={{
                        width: frameWidth,
                        height: 680 / scale,
                        transform: `scale(${scale})`,
                      }}
                    />
                  </div>
                  <p>
                    Scroll inside to explore. Your published website stays
                    unchanged until you publish.
                  </p>
                </aside>
              )}
            </div>
          )}
          <footer className="studio-footer">
            <span>Portfolio Studio</span>
            <span>Made for the details.</span>
          </footer>
        </main>
      </div>
      {confirm && (
        <div
          className="modal-backdrop"
          onClick={() => !busy && setConfirm(null)}
        >
          <ConfirmDialog
            confirm={confirm}
            busy={busy}
            onClose={() => setConfirm(null)}
          />
        </div>
      )}
    </div>
  );
}
function ConfirmDialog({ confirm, busy, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog.showModal();
    return () => dialog.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="studio-dialog"
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <span className="eyebrow">PORTFOLIO STUDIO</span>
      <h2>{confirm.title}</h2>
      <p>{confirm.text}</p>
      <div>
        <button className="secondary-button" disabled={busy} onClick={onClose}>
          Cancel
        </button>
        <button
          className="primary-button"
          disabled={busy}
          onClick={confirm.action}
        >
          {busy ? "Working..." : "Continue"}
        </button>
      </div>
    </dialog>
  );
}
