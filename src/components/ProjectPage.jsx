
import { useState } from "react";
import { Link } from "react-router-dom";
import { projectPath } from "../content/projects";
import TiltedCard from "../utilis/TiltedCard";
import Magnet from "../utilis/Magnet";
import { useContent } from "../context/ContentContext";
import ProjectCard from "./ProjectCard";
import TextReveal from "../utilis/TextReveal";
import "../pages/projects.css";

const ProjectPage = () => {
  const portfolio = useContent().portfolio;
  const projects = portfolio.projects.filter((p) => p.visible);
  const filterOptions = [portfolio.allLabel, ...portfolio.categories];
  const [filter, setFilter] = useState(portfolio.allLabel);

  const filteredProjects =
    filter === portfolio.allLabel
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  return (
    <main id="main-content" className="project-listing text-off-white pb-30 h-auto">
      <div className="flex flex-col items-center justify-center mb-10 z-55 relative">
        <div className="mt-50 w-[90%] sm:w-[50%] text-center">
          <Magnet padding={5} magnetStrength={30} wrapperClassName="w-full">
            <TextReveal delay={0.2} responsive>
              <h1 className="text-3xl sm:text-5xl font-extrabold">
                {portfolio.heading}
              </h1>
            </TextReveal>
          </Magnet>

          <p className="mt-6 text-sm leading-relaxed">
            {portfolio.intro}
          </p>

          <div
            role="group"
            aria-label="Filter projects by type"
            className="flex my-10 justify-center items-center text-xl flex-wrap"
          >
            {filterOptions.map((option) => (
              <button
                key={option}
                data-analytics-filter={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={`relative px-4 py-2 mx-1 rounded-md orange-bg-hover ${
                  filter === option
                    ? "orange-bg black-text"
                    : "bg-transparent text-off-white"
                } transition-all duration-300`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <ul
        role="list"
        className="w-[90%] sm:w-[70%] mx-auto flex flex-col gap-5"
        aria-live="polite"
      >
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <li
              key={project.title}
              className="card group w-full min-w-0 rounded-lg"
            >
              <Link
                to={projectPath(project)}
                data-analytics-project={project.title}
                aria-label={`${project.title}: Read the project story`}
                className="block w-full"
              >
                <TiltedCard
                  imageSrc={project.image}
                  mobileImageSrc={project.mobileImage}
                  mobileIntrinsicWidth={project.mobileWidth}
                  mobileIntrinsicHeight={project.mobileHeight}
                  altText={project.alt}
                  imageIntrinsicWidth={project.width}
                  imageIntrinsicHeight={project.height}
                  eager={index === 0}
                  enableParallax={false}
                  imageFit="cover"
                  naturalHeight
                  captionText={project.caption}
                  overlayContent={<ProjectCard project={project} />}
                />
              </Link>
            </li>
          ))
        ) : (
          <li className="text-center py-20 text-lg">
            {portfolio.emptyMessage}
          </li>
        )}
      </ul>
    </main>
  );
};

export default ProjectPage;
