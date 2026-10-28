import defaults from "./defaults.json" with { type: "json" };
export const projectPath = (project) => `/projects/${project.slug}`;

export const slugify = (value) =>
  value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "project";

export const storySection = {
  title: "New section",
  body: "",
  image: "/profile.webp",
  alt: "",
  showImage: false,
};

// An editorial starting point, with no invented project history or results.
export function createStory(project) {
  return {
    eyebrow: "Behind the build",
    role: "",
    timeline: "",
    technologies: [...project.tags],
    sourceUrl: "",
    seoTitle: "",
    seoDescription: "",
    sections: [
      { ...storySection, title: "The overview", body: project.para },
      ...["The idea & goals", "How I built it", "Challenges & solutions", "The result", "What I learned", "What's next"].map(title => ({ ...storySection, title })),
    ],
  };
}

// Upgrade known older shapes. Never persist or overwrite the owner's store
// while reading; saving a draft is the explicit persistence boundary.
export function migrateContent(input) {
  if (![1, 2].includes(input?.version)) return input;
  const value = structuredClone(input);
  if (value.version === 1) {
  const used = new Set(value.portfolio?.projects?.map(p => p.slug).filter(Boolean));
  value.portfolio?.projects?.forEach(project => {
    const known = defaults.portfolio.projects.find(item => item.title === project.title && item.link === project.link);
    if (!Object.hasOwn(project, "slug")) {
      const base = known?.slug || slugify(project.title);
      let slug = base;
      let suffix = 2;
      while (used.has(slug)) slug = `${base}-${suffix++}`;
      project.slug = slug;
      used.add(slug);
    }
    if (!Object.hasOwn(project, "story")) project.story = known?.story ? structuredClone(known.story) : createStory(project);
  });
  value.version = 2;
  }
  value.portfolio?.projects?.forEach(project => {
    if (!Object.hasOwn(project, "mobileImage")) project.mobileImage = "";
    if (!Object.hasOwn(project, "mobileWidth")) project.mobileWidth = Math.max(1, Math.round(project.width));
    if (!Object.hasOwn(project, "mobileHeight")) project.mobileHeight = Math.max(1, Math.round(project.height));
  });
  value.version = 3;
  return value;
}
