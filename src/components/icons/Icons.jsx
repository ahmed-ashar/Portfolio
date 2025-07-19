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
      className=" fixed  bottom-30 sm:bottom:25 left-9 sm:left-15 text-[#b7ab98] flex items-center justify-between flex-column gap-5 sm:gap-10 z-999 text-xl sm:text-2xl "
      style={{ writingMode: "vertical-lr" }}
    >
      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faFacebook} />
      </Magnet>

      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faInstagram} />
      </Magnet>
      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faGithub} />
      </Magnet>

      <Magnet padding={15} disabled={false} magnetStrength={1}>
        <FontAwesomeIcon icon={faLinkedin} />
      </Magnet>
    </div>
  );
};

export default Icons;
