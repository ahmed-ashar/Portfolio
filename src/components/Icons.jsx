import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Magnet from "../utilis/Magnet";

const Icons = () => {
  const icon = [
    { icon: faInstagram, link: "https://www.instagram.com/ahm3d_ashar/" },
    { icon: faFacebook, link: "https://www.facebook.com/ahmed.ashar.58" },
    { icon: faLinkedin, link: "https://www.linkedin.com/in/ahmed-ashar/" },
    { icon: faGithub, link: "https://github.com/ahmed-ashar" },
  ];
  return (
    <div
      className="hidden sm:fixed sm:bottom-10 sm:left-15 left-9 text-off-white sm:flex sm:flex-row sm:items-center sm:justify-between  sm:gap-5 z-[999] text-xl sm:text-2xl"
      style={{ writingMode: "vertical-lr" }}
    >
      {icon.map((item, index) => (
        <Magnet key={index} padding={15} disabled={false} magnetStrength={1}>
          <a href={item.link} target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon
              icon={item.icon}
              className="black-bg p-3 rounded-full"
            />
          </a>
        </Magnet>
      ))}
    </div>
  );
};

export default Icons;
