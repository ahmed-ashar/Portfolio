import { test } from "node:test";
import assert from "node:assert/strict";
import { defaults, validateContent, templateFor } from "../src/content/schema.js";
import { getSeo } from "../src/seo.js";

test("v1 backups migrate without mutation, content loss or slug collisions", () => {
  const legacy = structuredClone(defaults);
  legacy.version = 1;
  legacy.portfolio.projects.forEach(project => { delete project.slug; delete project.story; delete project.mobileImage; delete project.mobileWidth; delete project.mobileHeight; });
  legacy.portfolio.projects[0].title = "A project!";
  legacy.portfolio.projects[1].title = "A project?";
  legacy.portfolio.projects[0].para = "My existing copy";
  const before = JSON.stringify(legacy);
  const migrated = validateContent(legacy);
  assert.equal(JSON.stringify(legacy), before);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.portfolio.projects[0].slug, "a-project");
  assert.equal(migrated.portfolio.projects[1].slug, "a-project-2");
  assert.equal(migrated.portfolio.projects[0].story.sections[0].body, "My existing copy");
  assert.deepEqual(migrated.identity, legacy.identity);
  assert.equal(validateContent(migrated), migrated);
});

test("v2 records gain optional mobile images without changing existing stories or records", () => {
  const legacy = structuredClone(defaults);
  legacy.version = 2;
  legacy.portfolio.projects.forEach(project => { delete project.mobileImage; delete project.mobileWidth; delete project.mobileHeight; });
  legacy.portfolio.projects[0].story.sections[0].body = "My saved story";
  legacy.portfolio.projects[0].width += 0.25;
  const before = JSON.stringify(legacy);
  const migrated = validateContent(legacy);
  assert.equal(JSON.stringify(legacy), before);
  assert.equal(migrated.version, 3);
  assert.equal(migrated.portfolio.projects[0].mobileImage, "");
  assert.equal(migrated.portfolio.projects[0].mobileWidth, Math.round(legacy.portfolio.projects[0].width));
  assert.equal(migrated.portfolio.projects[0].story.sections[0].body, "My saved story");
  for (const url of ["javascript:alert(1)", "data:image/png;base64,AA", "//example.com/image.png"]) {
    migrated.portfolio.projects[0].mobileImage = url;
    assert.throws(() => validateContent(migrated), /HTTPS/);
  }
  migrated.portfolio.projects[0].mobileImage = "/profile.webp";
  migrated.portfolio.projects[0].mobileHeight = 0;
  assert.throws(() => validateContent(migrated), /Mobile image dimensions/);
});

test("invalid, duplicate slugs and unsafe source links are rejected", () => {
  for (const slug of ["../admin", "UPPER", "two--hyphens", "", "a".repeat(101)]) {
    const content = structuredClone(defaults);
    content.portfolio.projects[0].slug = slug;
    assert.throws(() => validateContent(content), /slug/i);
  }
  const content = structuredClone(defaults);
  content.portfolio.projects[1].slug = content.portfolio.projects[0].slug;
  assert.throws(() => validateContent(content), /unique/);
  content.portfolio.projects[1].slug = "unique";
  content.portfolio.projects[0].story.sourceUrl = "javascript:alert(1)";
  assert.throws(() => validateContent(content), /HTTPS/);
});

test("empty story lists can be edited and only visible projects get SEO routes", () => {
  const content = structuredClone(defaults);
  content.portfolio.projects[0].story.sections = [];
  content.portfolio.projects[0].story.technologies = [];
  validateContent(content);
  assert.equal(templateFor("portfolio.projects.0.story.sections").title, "New section");
  const project = content.portfolio.projects[0];
  project.story.seoTitle = "Custom story title";
  assert.equal(getSeo(content).ROUTES[`/projects/${project.slug}`].title, "Custom story title");
  project.visible = false;
  assert.equal(getSeo(content).ROUTES[`/projects/${project.slug}`], undefined);
});
