import React, { useEffect } from "react";
import Home from "./pages/home/Home";
import Projects from "./pages/projects/Projects";
import About from "./pages/about/About";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./utilis/scrollToTop/ScrollToTop";

const App = () => {
   
  return (
    <div className="">
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </div>
  );
};

export default App;
