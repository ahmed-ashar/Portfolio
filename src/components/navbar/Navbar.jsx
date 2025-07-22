import ScrambleText from "../../utilis/gsap/scrambleText/ScrambleText";
import React, { useEffect, useState } from "react";
import Magnet from "../../utilis/magnet/Magnet";
import Time from "../time/Time";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  const texts = [
    "Designing with sunlight energy — fresh & clean.",
    "Ideas strike while airbrushing or wandering.",
    "Indie games? My digital comfort zone.",
    "iPad notes = doodles + random poems.",
    "Pull-ups? Still in peaceful protest.",
    "Learn. Create. Share. Repeat.",
    "Got ideas? Let’s talk over email.",
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowNavbar(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div
  className={`nav transition-transform duration-500 ease-in-out ${
    showNavbar ? "translate-y-0" : "-translate-y-full"
  } fixed top-0 left-0 w-full z-[998] shadow-md mx-auto h-20 sm:h-24`}
>
        {" "}
      </div>
      <div className="flex  justify-between items-center z-999 p-5 sm:p-6 h-20 sm:h-23  sticky top-0 right-0 w-full rounded-md shadow-md">
        <div className="flex  justify-between items-center w-[50%] sm:w-[50%] md:w-[50%] lg:w-[40%] xl:w-[25%] 2xl:w-[30%] ">
          <Magnet padding={20} disabled={false} magnetStrength={5}>
            <h1 className=" text-4xl sm:text-5xl md:text-5xl lg:text-5xl xl:text-5xl 2xl:text-5xl z-11 pacifico text-[#b7ab98]">Ahmed</h1>
          </Magnet>
          <div className="w-[50%] hidden sm:block">
            <ScrambleText repeat={-1} texts={texts} color="text-zinc-400" font=" text-xs sm:text-xs md:text-xs lg:text-xs xl:text-xs 2xl:text-xs " />
          </div>
        </div>
        <div>
          <Magnet padding={20} disabled={false} magnetStrength={5}>
            <p className="z-11 text-zinc-300 text-xs redHatMono">Karachi, PK</p>
            <Time />
          </Magnet>
        </div>
      </div>
    </>
  );
};

export default Navbar;
