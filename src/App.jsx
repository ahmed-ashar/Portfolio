import React from "react";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import { Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"

const App = () => {
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
      <SpeedInsights />
    </div>
  );
};

export default App;
