import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { projectPath } from "../content/projects";
import TiltedCard from "../utilis/TiltedCard";
import Magnet from "../utilis/Magnet";
import Button from "./Button";
import TextReveal from "../utilis/TextReveal";
import { useContent } from "../context/ContentContext";
import ProjectCard from "./ProjectCard";
import "../pages/projects.css";

const ProjectSection = () => {
  const content = useContent();
  const section = content.home.featured;
  const data = content.portfolio.projects.filter(p=>p.visible && p.featured).slice(0, section.count);
  const stackRef = useRef(null);

  useEffect(() => {
    const list = stackRef.current;
    const cards = [...list.children];
    if (!cards.length) return;
    const measure = () => {
      const last = cards.at(-1);
      const lastTop = parseFloat(getComputedStyle(last).top);
      const base = parseFloat(getComputedStyle(list).getPropertyValue("--stack-padding"));
      // A taller earlier image needs room at the list's end to stay pinned
      // when the final card reaches its own (lower) sticky position.
      const extra = Math.max(0, ...cards.map(card =>
        card.offsetHeight - last.offsetHeight - (lastTop - parseFloat(getComputedStyle(card).top)),
      ));
      list.style.setProperty("--stack-tail", `${Math.ceil(base + extra)}px`);
    };
    const observer = new ResizeObserver(measure);
    cards.forEach(card => observer.observe(card));
    measure();
    return () => observer.disconnect();
  }, [content]);

  return (
    <section aria-labelledby="projects-heading" className="home-featured relative py-8 sm:py-12">
      <div className="sticky top-24 sm:top-20 left-0 w-full text-center font-extrabold opacity-30 leading-none gray-text">
        <TextReveal delay={1}>
          <h2 id="projects-heading" className="text-[15vw] sm:text-[16vw]">
            {section.heading}
          </h2>
        </TextReveal>
      </div>

      <ul ref={stackRef} role="list" className="project-stack w-full py-8 sm:py-10 flex flex-col items-center gap-10 sm:gap-16 list-none">
        {data.map((item, index) => (
          <li
            key={item.title}
            className="card group sticky w-[85%] sm:w-[70%] rounded-lg"
            style={{ "--stack-index": index, zIndex: index + 1 }}
          >
            <Link
              to={projectPath(item)}
              data-analytics-project={item.title}
              aria-label={`${item.title}: Read the project story`}
              className="block w-full"
            >
              <TiltedCard
                naturalHeight
                imageSrc={item.image}
                mobileImageSrc={item.mobileImage}
                mobileIntrinsicWidth={item.mobileWidth}
                mobileIntrinsicHeight={item.mobileHeight}
                altText={item.alt}
                imageIntrinsicWidth={item.width}
                imageIntrinsicHeight={item.height}
                captionText={item.caption}
                overlayContent={<ProjectCard project={item} />}
              />
            </Link>
          </li>
        ))}
      </ul>

      <div className="text-center ml-3 mt-10 relative z-55">
        <Magnet padding={10} disabled={false} magnetStrength={20}>
          <Button to={section.buttonLink}>{section.buttonText}</Button>
        </Magnet>
      </div>
    </section>
  );
};

export default ProjectSection;
