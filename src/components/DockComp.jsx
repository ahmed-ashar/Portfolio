import React, { useState, useEffect } from "react";
import Dock from "../utilis/Dock";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimneyCrack,
  faUser,
  faCode,
  faSun,
  faMoon,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const DockComp = () => {
  const navigate = useNavigate();

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "light" ? false : true;
  };

  const [isDarkTheme, setIsDarkTheme] = useState(getInitialTheme());

  const setCSSVariables = (theme) => {
    const root = document.documentElement;
    let colors;

    if (theme === "dark") {
      colors = {
        black: "#131313",
        gray: "#2c2c2c",
        textOff: "#b7ab98",
        orange: "#fd8b09",
      };
    } else {
      colors = {
        black: "#e4e1d8",
        gray: "#b0b9ae",
        textOff: "#2a3439",
        orange: "#59614b",
      };
    }

    // Apply variables
    root.style.setProperty("--black", colors.black);
    root.style.setProperty("--gray", colors.gray);
    root.style.setProperty("--text-off", colors.textOff);
    root.style.setProperty("--orange", colors.orange);

    // Save to localStorage
    localStorage.setItem("colors", JSON.stringify(colors));
  };

  useEffect(() => {
    const savedTheme = isDarkTheme ? "dark" : "light";
    const savedColors = localStorage.getItem("colors");

    if (savedColors) {
      const colors = JSON.parse(savedColors);
      const root = document.documentElement;

      root.style.setProperty("--black", colors.black);
      root.style.setProperty("--gray", colors.gray);
      root.style.setProperty("--text-off", colors.textOff);
      root.style.setProperty("--orange", colors.orange);
    } else {
      setCSSVariables(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    const themeString = newTheme ? "dark" : "light";
    setCSSVariables(themeString);
    localStorage.setItem("theme", themeString);
  };

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
      icon: <FontAwesomeIcon icon={isDarkTheme ? faMoon : faSun} size="sm" />,
      label: isDarkTheme ? "Dark" : "Light",
      onClick: toggleTheme,
    },
  ];

  return (
    <div className="fixed bottom-5 left-[49.5%] text-off-white z-60 text-2xl">
      <Dock items={items} />
    </div>
  );
};

export default DockComp;
