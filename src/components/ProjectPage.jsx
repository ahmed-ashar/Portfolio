import { useState } from "react";
import TiltedCard from "../utilis/TiltedCard";
import Magnet from "../utilis/Magnet";
import { useContent } from "../context/ContentContext";
import ProjectCard from "./ProjectCard";
import TextReveal from "../utilis/TextReveal";

const pattern = ["single", "40-60", "60-40"];

const ProjectPage = () => {
  const portfolio = useContent().portfolio;
  const projects = portfolio.projects.filter(p=>p.visible);
  const filterOptions = [portfolio.allLabel, ...portfolio.categories];
  const [filter, setFilter] = useState(portfolio.allLabel);

  const filteredProjects =
    filter === portfolio.allLabel
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  const renderCard = (project, index, sizeClass = "w-full") => (
    <li
      key={project.title}
      className={`card group ${sizeClass} h-[65vh] flex flex-col items-center gap-5 rounded-lg`}
    >
      <a
        href={project.link}
        data-analytics-project={project.title}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${project.title}: ${project.para} (opens in a new tab)`}
        className="w-full h-full"
      >
        <TiltedCard
          imageSrc={project.image}
          altText={project.alt}
          imageIntrinsicWidth={project.width}
          imageIntrinsicHeight={project.height}
          eager={index === 0}
          captionText={project.caption}
          overlayContent={<ProjectCard project={project} />}
        />
      </a>
    </li>
  );

  let imgIndex = 0;
  const rows = [];

  while (imgIndex < filteredProjects.length) {
    for (
      let i = 0;
      i < pattern.length && imgIndex < filteredProjects.length;
      i++
    ) {
      const type = pattern[i];

      if (type === "single") {
        rows.push(
          <ul
            role="list"
            key={filteredProjects[imgIndex].title}
            className="w-full py-2.5 flex flex-col items-center"
          >
            {renderCard(filteredProjects[imgIndex], imgIndex)}
          </ul>
        );
        imgIndex++;
      } else if (imgIndex + 1 < filteredProjects.length) {
        const firstClass =
          type === "40-60" ? "w-full lg:w-[40%]" : "w-full lg:w-[60%]";
        const secondClass =
          type === "40-60" ? "w-full lg:w-[60%]" : "w-full lg:w-[40%]";

        rows.push(
          <ul
            role="list"
            key={filteredProjects[imgIndex].title}
            className="w-full py-2.5 flex flex-col lg:flex-row items-center gap-5"
          >
            {renderCard(filteredProjects[imgIndex], imgIndex, firstClass)}
            {renderCard(
              filteredProjects[imgIndex + 1],
              imgIndex + 1,
              secondClass
            )}
          </ul>
        );
        imgIndex += 2;
      }
    }
  }

  return (
    <main id="main-content" className="text-off-white pb-30 h-auto">
      <div className="flex flex-col items-center justify-center mb-10 z-55 relative">
        <div className="mt-50  w-[90%] sm:w-[50%] text-center">
          <Magnet padding={5} magnetStrength={30}>
            <TextReveal delay={0.2}>
              <h1 className="text-3xl sm:text-5xl font-extrabold  ">
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
            className="flex my-10 justify-center items-center text-xl flex-wrap "
          >
            {filterOptions.map((option) => (
              <button
                key={option}
                data-analytics-filter={option}
                type="button"
                onClick={() => setFilter(option)}
                aria-pressed={filter === option}
                className={` relative px-4 py-2 mx-1 rounded-md orange-bg-hover ${
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

      <div
        className="w-[90%] sm:w-[70%] mx-auto flex flex-col"
        aria-live="polite"
      >
        {rows.length > 0 ? (
          rows
        ) : (
          <p className="text-center py-20 text-lg">
            {portfolio.emptyMessage}
          </p>
        )}
      </div>
    </main>
  );
};

export default ProjectPage;
