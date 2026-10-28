import defaults from "./content/defaults.json" with { type: "json" };
import { projectPath } from "./content/projects.js";
export const STRUCTURED_DATA_ID = "site-structured-data";
export function getSeo(content = defaults) {
  const { seo, identity, footer, about, notFound } = content;
  const siteUrl = seo.siteUrl;
  const absolute = (value) => new URL(value, siteUrl).href;
  return {
    SITE_URL: siteUrl,
    SITE_NAME: identity.siteName,
    AUTHOR: identity.name,
    OG_IMAGE: absolute(seo.image),
    OG_IMAGE_ALT: seo.imageAlt,
    ROUTES: {
      "/": { path: "/", ...seo.home },
      "/about": { path: "/about", ...seo.about },
      "/projects": { path: "/projects", ...seo.projects },
      ...Object.fromEntries(content.portfolio.projects.filter(project => project.visible).map(project => [projectPath(project), {
        path: projectPath(project),
        title: project.story.seoTitle || `${project.title} | ${identity.siteName}`,
        description: project.story.seoDescription || project.para,
        image: absolute(project.image),
        imageAlt: project.alt,
      }])),
    },
    NOT_FOUND: {
      path: "/404",
      title: notFound.title,
      description: notFound.description,
      noindex: true,
    },
    DASHBOARD: {
      path: "/dashboard",
      title: "Portfolio Studio | " + identity.siteName,
      description: "Private portfolio administration.",
      noindex: true,
    },
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": siteUrl + "/#person",
        name: identity.name,
        alternateName: identity.siteName,
        url: siteUrl + "/",
        image: absolute(about.profile),
        jobTitle: identity.role,
        email: "mailto:" + footer.email,
        address: {
          "@type": "PostalAddress",
          addressLocality: identity.city,
          addressCountry: identity.country,
        },
        knowsAbout: about.skills,
        sameAs: footer.links
          .filter((l) => l.showInSidebar && l.link.startsWith("https://"))
          .map((l) => l.link),
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": siteUrl + "/#website",
        name: identity.siteName + " | Portfolio",
        url: siteUrl + "/",
        inLanguage: "en",
        author: { "@id": siteUrl + "/#person" },
      },
    ],
  };
}
export const {
  SITE_URL,
  SITE_NAME,
  AUTHOR,
  OG_IMAGE,
  OG_IMAGE_ALT,
  ROUTES,
  NOT_FOUND,
  structuredData,
} = getSeo();
