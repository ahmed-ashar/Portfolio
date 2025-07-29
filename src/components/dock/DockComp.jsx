import React from "react";
import Dock from "../../utilis/dock/Dock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimneyCrack,
  faUser,
  faCode,
  faGear,
} from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";

const DockComp = () => {
  const navigate = useNavigate();

  const items = [
    {
      icon: <FontAwesomeIcon icon={faHouseChimneyCrack} size="sm" />,
      label: "Home",
      onClick: () => navigate("/"),
    },
    {
      icon: <FontAwesomeIcon icon={faUser} size="sm" />,
      label: "About",
      onClick: () => navigate("/about"),
    },
    {
      icon: <FontAwesomeIcon icon={faCode} size="sm" />,
      label: "Projects",
      onClick: () => navigate("/projects"),
    },
    {
      icon: <FontAwesomeIcon icon={faGear} size="md" />,
      label: "Theme",
      onClick: () => alert("Theme!"),
    },
  ];

  return (
    <div className="fixed  bottom-5 left-[49.5%] text-off-white z-999  text-2xl" >
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
