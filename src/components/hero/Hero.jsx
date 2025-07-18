import React from "react";
import Magnet from "../../utilis/magnet/Magnet";

const Hero = () => {
  return (
    <div className="absolute bottom-[50%] right-[50%] transform translate-[50%] text-center z-10">
      <Magnet padding={5} disabled={false} magnetStrength={90}>
        <h1 className="text-8xl text-[#b7ab98] font-extrabold leading-20 tracking-tighter z-50 ">
          MODERN{" "}
          <span className="text-[#fd8b09]">
            PROBLEMS <br />{" "}
          </span>{" "}
          NEED MODERN STACKS. I’M <span className="text-[#fd8b09]"> MERN</span>{" "}
          FOR THE CHALLENGE.
        </h1>
      </Magnet>
    </div>
  );
};

export default Hero;
