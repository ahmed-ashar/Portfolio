import React from "react";
import Dock from "../../utilis/dock/Dock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
const DockComp = () => {
  const items = [
    {
      icon: <FontAwesomeIcon icon={faFacebook} size={18} />,
      label: "Home",
      onClick: () => alert("Home!"),
    },
    {
      icon: <FontAwesomeIcon icon={faGithub} size={18} />,
      label: "Archive",
      onClick: () => alert("Archive!"),
    },
    {
      icon: <FontAwesomeIcon icon={faInstagram} size={18} />,
      label: "Profile",
      onClick: () => alert("Profile!"),
    },
    {
      icon: <FontAwesomeIcon icon={faLinkedin} size={18} />,
      label: "Settings",
      onClick: () => alert("Settings!"),
    },
  ];
  return (
    <div className="fixed  bottom-5 left-[49.5%] text-[#b7ab98] z-999  text-2xl">
      <Dock
        items={items}
        panelHeight={70}
        baseItemSize={50}
        magnification={70}
      />
    </div>
  );
};

export default DockComp;
