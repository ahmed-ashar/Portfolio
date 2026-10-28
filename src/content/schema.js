import defaults from "./defaults.json" with { type: "json" };
import { createStory, migrateContent, storySection } from "./projects.js";
export { defaults };
export const templates = {
  "portfolio.projects": {
    title: "New project",
    para: "Describe your project.",
    image: "/profile.webp",
    width: 400,
    height: 400,
    mobileImage: "",
    mobileWidth: 400,
    mobileHeight: 400,
    alt: "Project screenshot",
    link: "https://example.com",
    tags: ["Frontend"],
    caption: "Project",
    visible: true,
    featured: true,
    slug: "new-project",
    story: createStory({ tags: [], para: "" }),
  },
  "footer.links": {
    name: "New link",
    link: "https://example.com",
    showInSidebar: false,
  },
  "about.education": {
    title: "Qualification",
    destination: "Institution",
    duration: "2026",
  },
  "about.experience": { title: "Role", company: "Company", duration: "2026" },
  "about.certificate": { title: "Certificate", from: "Issuer" },
  "about.contact": {
    title: "Contact",
    from: "Label",
    link: "https://example.com",
  },
};
export const templateFor = (path) => templates[path] ||
  (/^portfolio\.projects\.\d+\.story\.sections$/.test(path) ? storySection : undefined);
export function validateContent(value) {
  value = migrateContent(value);
  function walk(input, sample, path) {
    if (Array.isArray(sample)) {
      if (!Array.isArray(input) || input.length > 100)
        throw new Error(path + ": use a list of at most 100 items.");
      input.forEach((entry, i) => walk(entry, sample[0], path + "." + i));
    } else if (sample && typeof sample === "object") {
      if (
        !input ||
        typeof input !== "object" ||
        Array.isArray(input) ||
        Object.keys(input).some((key) => !Object.hasOwn(sample, key))
      )
        throw new Error(path + ": invalid fields.");
      for (const key of Object.keys(sample))
        walk(input[key], sample[key], path ? path + "." + key : key);
    } else if (
      typeof input !== typeof sample ||
      (typeof input === "number" && !Number.isFinite(input))
    )
      throw new Error(path + ": invalid value.");
    else if (typeof input === "string") {
      if (input.length > 10000) throw new Error(path + ": text is too long.");
      const key = path.split(".").pop();
      if (key === "sourceUrl" && input && !/^https:\/\/[^\s]+$/.test(input))
        throw new Error(path + ": use an HTTPS repository URL or leave empty.");
      if (
        ["link", "buttonLink"].includes(key) &&
        !/^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[+\d\s-]+|\/(?!\/)[^\\]*|#[^\s]*)$/.test(
          input,
        )
      )
        throw new Error(
          path + ": enter a valid website, email, telephone or local link.",
        );
      if (
        (["image", "profile"].includes(key) || (key === "mobileImage" && input !== "")) &&
        !/^(https:\/\/[^\s]+|\/(?!\/)[^\\]*)$/.test(input)
      )
        throw new Error(path + ": use an HTTPS image or an uploaded image.");
      if (
        Array.from(input).some(
          (c) => c.charCodeAt(0) < 32 && !["\n", "\r", "\t"].includes(c),
        )
      )
        throw new Error(path + ": invalid control characters.");
    }
  }
  walk(value, defaults, "");
  if (
    value.portfolio.categories.includes(value.portfolio.allLabel) ||
    !value.portfolio.allLabel.trim()
  )
    throw new Error(
      "The all-projects label must be different from your categories.",
    );
  if (value.version !== 3) throw new Error("Unsupported backup version.");
  for (const [path, expected] of [
    ["home", defaults.home.order],
    ["about", defaults.about.order],
  ]) {
    const order = value[path].order;
    if (
      order.length !== expected.length ||
      new Set(order).size !== expected.length ||
      expected.some((k) => !order.includes(k))
    )
      throw new Error(path + ": section order must include each section once.");
  }
  for (const colors of [value.appearance.dark, value.appearance.light])
    if (Object.values(colors).some((c) => !/^#[0-9a-f]{6}$/i.test(c)))
      throw new Error("Colors must use six-digit hex values.");
  if (
    !value.identity.taglines.length ||
    !value.home.hero.lines.length ||
    !value.home.marquee.texts.length
  )
    throw new Error("Keep at least one headline, tagline and marquee line.");
  if (
    value.home.hero.accentLine < 1 ||
    value.home.hero.accentLine > value.home.hero.lines.length
  )
    throw new Error("Accent line must refer to an existing headline line.");
  if (
    !Number.isInteger(value.home.featured.count) ||
    value.home.featured.count < 1 ||
    value.home.featured.count > 100
  )
    throw new Error("Featured project count must be between 1 and 100.");
  if (Math.abs(value.home.marquee.speed) > 500)
    throw new Error("Marquee speed must be between -500 and 500.");
  for (const p of value.portfolio.projects) {
    if (!p.title.trim() || p.width < 1 || p.height < 1)
      throw new Error("Projects need a title and positive image dimensions.");
    if (!Number.isInteger(p.mobileWidth) || !Number.isInteger(p.mobileHeight) || p.mobileWidth < 1 || p.mobileHeight < 1)
      throw new Error("Mobile image dimensions must be positive whole numbers.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) || p.slug.length > 100)
      throw new Error("Project URL slugs must use lowercase letters, numbers and single hyphens (up to 100 characters).");
    if (p.story.sections.some(section => !section.title.trim()))
      throw new Error("Give every story section a heading.");
  }
  for (const list of [
    value.portfolio.projects.map((p) => p.slug),
    value.portfolio.projects.map((p) => p.title),
    value.portfolio.categories,
    value.about.skills,
    value.footer.links.map((l) => l.name),
  ])
    if (new Set(list).size !== list.length || list.some((s) => !s.trim()))
      throw new Error(
        "Project names, URL slugs, categories, skills and link names must be unique and nonempty.",
      );
  try {
    new Intl.DateTimeFormat("en", { timeZone: value.identity.timeZone });
  } catch {
    throw new Error("Enter a valid time zone, for example Asia/Karachi.");
  }
  try {
    const url = new URL(value.seo.siteUrl);
    if (url.protocol !== "https:" || url.origin !== value.seo.siteUrl)
      throw new Error();
  } catch {
    throw new Error(
      "Site URL must be an HTTPS origin without a trailing slash.",
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.footer.email))
    throw new Error("Enter a valid contact email.");
  return value;
}
