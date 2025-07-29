import React, { useState } from "react";
import TiltedCard from "../../utilis/tiltedCard/TiltedCard";
import Magnet from "../../utilis/magnet/Magnet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ProjectData from "../../data/ProjectData";
import ProjectCard from "../projectCard/ProjectCard";

const projects = ProjectData();
const pattern = ["single", "40-60", "60-40"];

const ProjectPage = () => {
  const [filter, setFilter] = useState("All");

  const filteredProjects =
    filter === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(filter));

  const renderCard = (project, index) => (
    <div
      key={index}
      className="card group   w-full h-[65vh] flex flex-col items-center gap-5 rounded-lg"
    >
      <a
        href={project.liveUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-full"
      >
        <TiltedCard
          imageSrc={project.image}
          altText={project.title}
          captionText={project.caption}
          containerHeight="100%"
          containerWidth="100%"
          imageHeight="100%"
          imageWidth="100%"
          rotateAmplitude={2}
          scaleOnHover={1}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <ProjectCard project={project} />
          }
        />
      </a>
    </div>
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
          <div
            key={imgIndex}
            className="w-full py-2.5 flex flex-col items-center"
          >
            {renderCard(filteredProjects[imgIndex], imgIndex)}
          </div>
        );
        imgIndex++;
      } else if (imgIndex + 1 < filteredProjects.length) {
        const firstWidth = type === "40-60" ? "40%" : "60%";
        const secondWidth = type === "40-60" ? "60%" : "40%";

        rows.push(
          <div
            key={imgIndex}
            className="w-full py-2.5 flex flex-col lg:flex-row items-center gap-5"
          >
            <div className={`w-full lg:w-[${firstWidth}]`}>
              {renderCard(filteredProjects[imgIndex], imgIndex)}
            </div>
            <div className={`w-full lg:w-[${secondWidth}]`}>
              {renderCard(filteredProjects[imgIndex + 1], imgIndex + 1)}
            </div>
          </div>
        );
        imgIndex += 2;
      }
    }
  }

  const filterOptions = ["All", "Frontend", "Backend", "MERN Stack"];

  return (
    <div className="text-[#b7ab98] pb-30 h-auto">
      <div className="flex flex-col items-center justify-center mb-10">
        <div className="mt-50 w-[90%] sm:w-[60%] text-center">
          <p className="text-5xl font-extrabold">
            From minimalist UIs to fully functional apps — here’s a glimpse of
            what I build.
          </p>

          <div className="flex gap-5 my-10 justify-center items-center text-xl flex-wrap">
            {filterOptions.map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg border ${
                  filter === option
                    ? "bg-[#fd8b09]  text-black font-bold"
                    : "bg-transparent border-[#b7ab98] text-[#b7ab98] font-bold"
                } transition-all duration-300`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-[90%] sm:w-[70%] mx-auto flex flex-col">
        {rows}
      </div>
    </div>
  );
};

export default ProjectPage;
