import React from "react";
import tereWebsite from "../assets/2.png";
import AssPortfolio from "../assets/3.png";
import foodSpotBackend from "../assets/4.png";
import foodSpotFrontend from "../assets/5.png";
import tempPortfolio from "../assets/6.png";
import portfolio from "../assets/7.png";
import Project1 from "../assets/Project1.png";
import Project2 from "../assets/Project2.png";
import Project3 from "../assets/Project3.png";
import Project4 from "../assets/Project4.png";
import Project5 from "../assets/Project5.png";
import Project6 from "../assets/Project6.png";
import Project7 from "../assets/Project7.png";
import Project8 from "../assets/Project8.png";
import Project9 from "../assets/Project9.png";
import Project10 from "../assets/Project10.png";

const ProjectData = () => {
  const data = [
    {
      title: "Tere-Website",
      image: tereWebsite,
      para: "Transport service UI with sleek and responsive design.",
      link: "https://tere-website-nu.vercel.app/",
      tags: ["Frontend"],
      caption: "Responsive transport web UI",
    },

    {
      title: "Portfolio-Website",
      image: AssPortfolio,
      para: "A clean and simple portfolio for showcasing work.",
      link: "https://assignment-portfolio-website-eta.vercel.app/",
      tags: ["Frontend"],
      caption: "Minimal portfolio project",
    },
    {
      title: "Portfolio-Website",
      image: tempPortfolio,
      para: "Lightweight portfolio with creative layout.",
      link: "https://portfolio-seven-rose-48.vercel.app/",
      tags: ["Frontend"],
      caption: "Simple creative portfolio",
    },
    {
      title: "FoodSpot Frontend",
      image: foodSpotFrontend,
      para: "Frontend UI for a food delivery platform.",
      link: "https://foodspot-frontend.vercel.app/",
      tags: ["Frontend", "MERN Stack"],
      caption: "Food delivery frontend app",
    },
    {
      title: "FoodSpot Backend",
      image: foodSpotBackend,
      para: "Admin dashboard with full backend control.",
      link: "https://foodspot-admin.vercel.app/add",
      tags: ["MERN Stack", "Backend"],
      caption: "Admin panel for FoodSpot",
    },
    {
      title: "Resume Builder",
      para: "Build, customize, and export resumes with ease.",
      image: Project1,
      link: "https://resume-x-frontend.vercel.app/",
      tags: ["MERN Stack", "Backend", "Frontend"],
      caption: "Dynamic resume creator",
    },
    {
      title: "Restrou Website",
      para: "Restaurant site with menu and contact features.",
      image: Project2,
      link: "https://restrou-frontend.vercel.app/",
      tags: ["Frontend"],
      caption: "Restaurant website UI",
    },
    {
      title: "Homyz Website",
      para: "Real estate app with listings and search filters.",
      image: Project3,
      link: "https://homyz-front-end.vercel.app/",
      tags: ["Frontend"],
      caption: "Property rental platform",
    },
    {
      title: "Music Player",
      para: "A simple, responsive music player web app.",
      image: Project4,
      link: "https://ahmed-ashar.github.io/CodeAlpha_Music_Player/",
      tags: ["Frontend"],
      caption: "Basic audio player",
    },
    {
      title: "Interwood Website",
      para: "Corporate site with modern furniture branding.",
      image: Project5,
      link: "https://inter-word-clone-in-progress.vercel.app/",
      tags: ["Frontend"],
      caption: "Furniture business website",
    },
    {
      title: "Event Central",
      para: "Event management system with full CRUD support.",
      image: Project6,
      link: "https://eventcentral.netlify.app/",
      tags: ["MERN Stack", "Frontend", "Backend"],
      caption: "Event manager platform",
    },
    {
      title: "Firebase Auth Page",
      para: "Signup and login UI using Firebase auth.",
      image: Project7,
      link: "https://ahmed-ashar.github.io/SignUp-LogIn-Page-With-Firebase/",
      tags: ["Frontend"],
      caption: "Secure login/signup page",
    },
    {
      title: "Image Gallery",
      para: "Clean and responsive image gallery UI.",
      image: Project8,
      link: "https://ahmed-ashar.github.io/CodeAlpha_Image_Gallery/",
      tags: ["Frontend"],
      caption: "Simple gallery layout",
    },
    {
      title: "LinkedIn Clone",
      para: "UI clone of LinkedIn built with React.",
      image: Project9,
      link: "https://linkedin-ui-clone-three.vercel.app/",
      tags: ["Frontend"],
      caption: "LinkedIn homepage clone",
    },
    {
      title: "Calculator App",
      para: "Basic calculator with a responsive layout.",
      image: Project10,
      link: "https://ahmed-ashar.github.io/CodeAlpha_Calculator/",
      tags: ["Frontend"],
      caption: "Simple calculator tool",
    },
    {
      title: "Portfolio-Website",
      image: portfolio,
      para: "Modern personal portfolio with smooth animations.",
      link: "https://ahmed-ashar.vercel.app/",
      tags: ["Frontend"],
      caption: "My personal portfolio site",
    },
  ];

  return data;
};

export default ProjectData;
