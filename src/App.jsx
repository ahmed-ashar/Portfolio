import React, { useEffect } from "react";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import { Route, Routes, useLocation } from "react-router-dom";
import ScrollToTop from "./utilis/ScrollToTop";

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
