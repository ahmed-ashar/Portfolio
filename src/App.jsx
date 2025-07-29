import React from "react";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import { Route, Routes } from "react-router-dom";

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
