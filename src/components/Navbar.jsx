import { useContent } from "../context/ContentContext";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrambleText from "../utilis/ScrambleText";
import Magnet from "../utilis/Magnet";
import Time from "./Time";


const Navbar = () => {
  const identity = useContent().identity;
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowNavbar(window.scrollY > 0);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header>
      <div
        aria-hidden="true"
        className={`nav transition-transform duration-500 ease-in-out ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        } fixed top-0 left-0 w-full  shadow-md mx-auto h-20 sm:h-24 z-60`}
      />
      <div className="flex  justify-between items-center  p-5 sm:p-6 h-20 sm:h-23  fixed   w-[98.9vw] rounded-md shadow-md z-65">
        <div className="flex  justify-between items-center w-[50%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[25%] 2xl:w-[30%] ">
          <Magnet padding={20} disabled={false} magnetStrength={5}>
            <Link to="/" aria-label={`${identity.siteName} home`}>
              <span className="block text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl  aladin  text-off-white">
                {identity.brand}
              </span>
            </Link>
          </Magnet>
          <div className="w-[50%] hidden sm:block" aria-hidden="true">
            <ScrambleText
              repeat={-1}
              texts={identity.taglines}
              color="text-off-white"
              font=" text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-xs "
            />
          </div>
        </div>
        <div>
          <Magnet padding={20} disabled={false} magnetStrength={5}>
            <p className=" text-off-white text-xs redHatMono">{identity.location}</p>
            {identity.showClock && <Time />}
          </Magnet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
