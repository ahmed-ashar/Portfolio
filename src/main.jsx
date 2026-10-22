import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.css";
import Shell from "./Shell.jsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const root = document.getElementById("root");
const embedded = document.getElementById("portfolio-content");
const initialContent = embedded ? JSON.parse(embedded.textContent) : undefined;
const app = <StrictMode><Shell initialContent={initialContent} /></StrictMode>;
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
