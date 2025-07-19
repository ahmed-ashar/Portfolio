import React from "react";
import Magnet from "../../utilis/magnet/Magnet";

const Hero = () => {
  return (
    <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-10">
      <Magnet padding={5} disabled={false} magnetStrength={90}>
        <h1 className=" text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[9rem] text-[#b7ab98] font-extrabold leading-10 sm:leading-12 md:leading-14 lg:leading-18 xl:leading-24 2xl:leading-30 tracking-tighter z-50 ">
          CODE.<br />
          <span className="text-[#fd8b09]">
            {" "}
            DEPLOY.<br />{" "}
          </span>{" "}
          REPEAT <span className="text-[#fd8b09]">—</span> <br />
          <span className="text-[#fd8b09]">MERN</span> WAY.
        </h1>
      </Magnet>
    </div>
  );
};

export default Hero;
