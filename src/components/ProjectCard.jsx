import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import SimpleParallax from "simple-parallax-js";
import Magnet from "../utilis/Magnet";

const ProjectCard = ({ project }) => {
  return (
     <div className="flex  p-5 rounded-lg  text-off-white absolute bottom-5 left-0 right-0 mx-5 gap-5 sm:mx-8 items-center  justify-between group-hover:mx-12 transition-all duration-500 ease-in-out gray-bg" >
                    {/* <Magnet padding={5} disabled={false} magnetStrength={7}> */}
                <div className="">
                  <p className="  text-2xl uppercase aladin mb-1">{project.title}</p>
                  <p className=" text-xs">{project.para}</p>
                </div>
              {/* </Magnet> */}
                      <div className="w-[100%] sm:w-[70%] flex  justify-end ">
                <Magnet padding={5} magnetStrength={7}>
                  <div className="flex  text-sm border rounded-full px-4 py-3">
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        className="text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
                      />
                    </a>
                  </div>
                </Magnet>
              </div>
                  </div>
  );
};

export default ProjectCard;
