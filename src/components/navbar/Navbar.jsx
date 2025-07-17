import ScrambleText from "../../utilis/gsap/scrambleText/ScrambleText";
import React, { useEffect, useState } from "react";
import Magnet from "../../utilis/magnet/Magnet";

const Navbar = () => {
  
  const now = new Date();
  const formattedTime = now.toLocaleTimeString("en-US");

  return (
    <div
      className={`flex justify-between items-center text-white sticky top-0 right-0 w-full  p-3 rounded-md shadow-md transition-all duration-300 z-11 `}
    >
      <Magnet padding={20} disabled={false} magnetStrength={5}>
        <h1 className="text-5xl z-11">Ahmed</h1>
      </Magnet>
      <div>
        <Magnet padding={20} disabled={false} magnetStrength={5}>
          <h2 className=" z-11">{formattedTime}</h2>
        </Magnet>
      </div>
      <div>
        <Magnet padding={20} disabled={false} magnetStrength={5}>
          <p className=" z-11">Location</p>
          <p className=" z-11">Karachi, Pakistan</p>
        </Magnet>
      </div>
      
    </div>
  );
};

export default Navbar;
