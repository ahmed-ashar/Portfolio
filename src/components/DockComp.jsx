import { useContent } from "../context/ContentContext";
import Dock from "../utilis/Dock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimneyCrack,
  faUser,
  faCode,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const DockComp = () => {
  const identity = useContent().identity;
  const { pathname } = useLocation();
  const { isDarkTheme, toggleTheme } = useTheme();

  const items = [
    {
      icon: <FontAwesomeIcon icon={faHouseChimneyCrack} size="sm" />,
      label: identity.homeLabel,
      ariaLabel: "Go to home page",
      to: "/",
      active: pathname.replace(/\/+$/, "") === "",
    },
    {
      icon: <FontAwesomeIcon icon={faUser} size="sm" />,
      label: identity.aboutLabel,
      ariaLabel: "Go to about page",
      to: "/about",
      active: pathname.replace(/\/+$/, "") === "/about",
    },
    {
      icon: <FontAwesomeIcon icon={faCode} size="sm" />,
      label: identity.projectsLabel,
      ariaLabel: "Go to projects page",
      to: "/projects",
      active: pathname.replace(/\/+$/, "") === "/projects" || pathname.startsWith("/projects/"),
    },
    {
      icon: <FontAwesomeIcon icon={isDarkTheme ? faMoon : faSun} size="sm" />,
      label: isDarkTheme ? "Dark" : "Light",
      ariaLabel: isDarkTheme ? "Switch to light theme" : "Switch to dark theme",
      onClick: toggleTheme,
    },
  ];

  return (
    <nav
      aria-label="Site"
      className="fixed bottom-5 left-[49.5%] text-off-white z-60 text-2xl"
    >
      <Dock items={items} />
    </nav>
  );
};

export default DockComp;
