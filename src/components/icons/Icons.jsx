import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import Magnet from "../../utilis/magnet/Magnet";

const Icons = () => {
  return (
    <div
      className="hidden sm:fixed sm:bottom-20 sm:left-15 left-9 text-[#b7ab98] sm:flex sm:flex-row sm:items-center sm:justify-between  sm:gap-5 z-[999] text-xl sm:text-2xl"
      style={{ writingMode: "vertical-lr" }}
    >
      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faFacebook} className="bg-[#131313] p-3 rounded-full" />
      </Magnet>

      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faInstagram} className="bg-[#131313] p-3 rounded-full" />
      </Magnet>
      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faGithub} className="bg-[#131313] p-3 rounded-full" />
      </Magnet>

      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faLinkedin} className="bg-[#131313] p-3 rounded-full" />
      </Magnet>
    </div>
  );
};

export default Icons;
