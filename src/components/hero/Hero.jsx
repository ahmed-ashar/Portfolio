import React from "react";
import Magnet from "../../utilis/magnet/Magnet";

const Hero = () => {
  return (
    <div className="absolute bottom-[55%] right-[50%] transform translate-[50%] text-center z-10">
      <Magnet padding={5} disabled={false} magnetStrength={90}>
        <h1 className="text-9xl text-[#b7ab98] font-extrabold leading-24 tracking-tighter z-50 ">
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
