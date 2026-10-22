import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { useContentRevision } from "./context/ContentContext";
import Seo from "./components/Seo";
import ErrorBoundary from "./components/ErrorBoundary";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const revision = useContentRevision();
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-md orange-bg black-text focus:outline-2"
      >
        Skip to main content
      </a>
      <Seo />
      <ErrorBoundary>
        <Suspense fallback={<div className="min-h-screen black-bg" />}>
          <Routes key={revision}>
            <Route caseSensitive path="/dashboard" element={<Dashboard />} />
            <Route caseSensitive path="/" element={<Home />} />
            <Route caseSensitive path="/about" element={<About />} />
            <Route caseSensitive path="/projects" element={<Projects />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <SpeedInsights />
    </>
  );
};

export default App;
