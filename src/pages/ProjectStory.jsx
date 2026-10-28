import { Link, useParams } from "react-router-dom";
import { useContent } from "../context/ContentContext";
import { projectPath } from "../content/projects";
import SiteLayout from "../components/SiteLayout";
import TiltedCard from "../utilis/TiltedCard";
import TextReveal from "../utilis/TextReveal";
import Button from "../components/Button";
import NotFound from "./NotFound";
import "./project-story.css";

export default function ProjectStory() {
  const { slug } = useParams();
  const { portfolio, identity } = useContent();
  const projects = portfolio.projects.filter(project => project.visible);
  const project = projects.find(project => project.slug === slug);
  if (!project) return <NotFound />;
  const { story } = project;
  const sections = story.sections.filter(section => section.body.trim() || section.showImage);
  const next = projects.length > 1 ? projects[(projects.indexOf(project) + 1) % projects.length] : null;
  const words = sections.reduce((count, section) => count + section.body.trim().split(/\s+/).filter(Boolean).length, 0);
  return (
    <SiteLayout>
      <main id="main-content" className="project-story">
        <header className="story-header">
          <Link className="story-back" to="/projects"><span aria-hidden="true">↖</span> All projects</Link>
          <div className="story-kicker"><span>{story.eyebrow}</span><span>PROJECT {String(projects.indexOf(project) + 1).padStart(2, "0")}</span></div>
          <TextReveal delay={0.1} responsive>
            <h1>{project.title}</h1>
          </TextReveal>
          <div className="story-introduction">
            <TextReveal delay={0.25}>
              <p>{project.para}</p>
            </TextReveal>
            <div className="story-actions">
              <Button href={project.link}>Visit live site</Button>
              {story.sourceUrl && <Button variant="outline" href={story.sourceUrl}>View source on GitHub</Button>}
            </div>
          </div>
          <dl className="story-facts">
            <div><dt>By</dt><dd>{identity.name}</dd></div>
            {story.role && <div><dt>My role</dt><dd>{story.role}</dd></div>}
            {story.timeline && <div><dt>Timeline</dt><dd>{story.timeline}</dd></div>}
            <div><dt>Focus</dt><dd>{project.tags.join(" / ")}</dd></div>
            {words > 0 && <div><dt>The story</dt><dd>{Math.max(1, Math.ceil(words / 200))} min read</dd></div>}
          </dl>
        </header>
        <figure className="story-cover">
          <div className="story-media story-cover-media" style={{ "--story-cover-ratio": `${project.width} / ${project.height}`, "--story-mobile-cover-ratio": project.mobileImage ? `${project.mobileWidth} / ${project.mobileHeight}` : `${project.width} / ${project.height}` }}>
            <TiltedCard imageSrc={project.image} altText={project.alt} captionText={project.caption}
              mobileImageSrc={project.mobileImage} mobileIntrinsicWidth={project.mobileWidth} mobileIntrinsicHeight={project.mobileHeight}
              imageIntrinsicWidth={project.width} imageIntrinsicHeight={project.height} eager />
          </div>
          <figcaption><span>{project.caption}</span><span aria-hidden="true">{String(projects.indexOf(project) + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span></figcaption>
        </figure>
        <div className="story-reading-layout">
          <aside className="story-aside">
            {sections.length > 0 && <nav aria-label="In this story">
              <p className="story-label">In this story</p>
              {sections.map((section, index) => <a key={index} href={`#story-section-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</a>)}
            </nav>}
            {story.technologies.length > 0 && <div className="story-stack"><p className="story-label">Tools & technologies</p><ul>{story.technologies.map((technology, index) => <li key={index}>{technology}</li>)}</ul></div>}
          </aside>
          <article className="story-article" aria-label={`${project.title} project story`}>
            {sections.map((section, index) => <section id={`story-section-${index}`} className="story-section" key={index}>
              <span className="story-section-number" aria-hidden="true">/ {String(index + 1).padStart(2, "0")}</span>
              <TextReveal delay={0.05}>
                <h2>{section.title}</h2>
                {section.body.split(/\n\s*\n/).filter(paragraph => paragraph.trim()).map((paragraph, i) => <p key={i}>{paragraph}</p>)}
              </TextReveal>
              {section.showImage && <figure className="story-section-figure">
                <div className="story-media story-section-media">
                  <TiltedCard imageSrc={section.image} altText={section.alt} captionText={section.alt} />
                </div>
                {section.alt && <figcaption>{section.alt}</figcaption>}
              </figure>}
            </section>)}
          </article>
        </div>
        <div className="story-end"><span aria-hidden="true">✳</span><p>Thanks for reading.</p><Link to="/projects">Explore all projects ↗</Link></div>
        {next && <Link className="story-next" to={projectPath(next)}>
          <div><span className="story-label">Next project</span>
            <TextReveal>
              <h2>{next.title}</h2>
              <p>{next.para}</p>
            </TextReveal>
            <span className="story-next-cta">Read the story ↗</span></div>
          <div className="story-media story-next-media">
            <TiltedCard imageSrc={next.image} altText={next.alt} captionText={next.caption}
              mobileImageSrc={next.mobileImage} mobileIntrinsicWidth={next.mobileWidth} mobileIntrinsicHeight={next.mobileHeight}
              imageIntrinsicWidth={next.width} imageIntrinsicHeight={next.height} />
          </div>
        </Link>}
      </main>
    </SiteLayout>
  );
}
