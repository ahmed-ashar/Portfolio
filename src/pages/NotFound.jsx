import { useContent } from "../context/ContentContext";
import { Link } from "react-router-dom";
import SiteLayout from "../components/SiteLayout";

export default function NotFound() {
 const {notFound,identity}=useContent();
  return (
    <SiteLayout contentClassName="" showUtilities={false}>
      <main
        id="main-content"
        className="min-h-[80vh] flex flex-col items-center justify-center text-center text-off-white px-5 relative z-55"
      >
        <p className="text-[18vw] sm:text-[12vw] font-extrabold leading-none opacity-30 gray-text">
          404
        </p>
        <h1 className="text-3xl sm:text-5xl font-extrabold mt-4">
          {notFound.heading}
        </h1>
        <p className="text-sm sm:text-base mt-4 max-w-md">
          {notFound.body}
        </p>
        <nav aria-label="Suggested pages" className="mt-10">
          <ul className="flex flex-wrap gap-4 justify-center text-lg font-bold">
            <li>
              <Link to="/" className="orange-text-hover underline">
                {identity.homeLabel}
              </Link>
            </li>
            <li>
              <Link to="/projects" className="orange-text-hover underline">
                {identity.projectsLabel}
              </Link>
            </li>
            <li>
              <Link to="/about" className="orange-text-hover underline">
                {identity.aboutLabel}
              </Link>
            </li>
          </ul>
        </nav>
      </main>
    </SiteLayout>
  );
}
