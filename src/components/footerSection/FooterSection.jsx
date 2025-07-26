import React from "react";
import TextReveal from "../../utilis/textReveal/TextReveal";
import Button from "../button/Button";
import Magnet from "../../utilis/magnet/Magnet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
const FooterSection = () => {
  const links = [
    { name: "Instagram", icon: faArrowUp, link: "https://www.instagram.com/ahm3d_ashar/" },
    { name: "Facebook", icon: faArrowUp, link: "https://www.facebook.com/ahmed.ashar.58" },
    { name: "LinkedIn", icon: faArrowUp, link: "https://www.linkedin.com/in/ahmed-ashar/" },
    { name: "GitHub", icon: faArrowUp, link: "https://github.com/ahmed-ashar" },
    { name: "Whatsapp", icon: faArrowUp, link: "#" },
    { name: "Resume", icon: faArrowUp, link: "#" },
    { name: "Read.cv", icon: faArrowUp, link: "#" },
  ];

  return (
    <div className="h-[80vh] sm:h-[85vh] w-full overflow-hidden text-[#b7ab98] relative">
      <div className="w-[85vw] mt-5 sm:mt-10 mx-auto flex flex-col sm:flex-row justify-between items-start  gap-10">
        <div className="">
          <div className="">
            <TextReveal delay={0.2}>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold   ">
                Ready to start a conversation? <br /> Drop your thoughts,
                questions, <br />
                or ideas — I’m always <br />
                open to connect.
              </h1>
            </TextReveal>
          </div>
          <div className="flex flex-col mt-1 sm:mt-5 gap-1 sm:gap-2 ">
            <TextReveal delay={0.2}>
              <p className="text-xs md:text-sm">CONTACT</p>
            </TextReveal>
            <Magnet padding={5} disabled={false} magnetStrength={7}>
              <TextReveal delay={0.2}>
                <p className="text-sm md:text-2xl group  font-bold hover:text-[#fd8b09]">
                  hafizmahmedashar@gmail.com{" "}
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    className="text-sm sm:text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
                  />{" "}
                </p>
              </TextReveal>
            </Magnet>
            <TextReveal delay={0.2}>
              <p className="text-xs md:text-sm">
                Sector 11-C/1 North Karachi, <br /> Karachi, Pakistan
              </p>
            </TextReveal>
          </div>
        </div>

        <div className=" sm:text-end ">
          <TextReveal delay={0.2}>
            <p className="text-xs sm:text-sm">LINKS</p>
          </TextReveal>
          <div className="text-sm sm:text-xl  sm:mt-2 text-end flex flex-wrap sm:flex-col gap-1 font-bold">
            {links.map((link, index) => (
              <Magnet
                key={index}
                padding={5}
                disabled={false}
                magnetStrength={7}
              >
                <TextReveal delay={0.2}>
                  <a href={link.link} target="_blank" className="group hover:text-[#fd8b09]">
                    <FontAwesomeIcon
                      icon={link.icon}
                      className="text-sm sm:text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
                    />{" "}
                    {link.name}
                  </a>
                </TextReveal>
              </Magnet>
            ))}
          </div>
        </div>
      </div>

      <div className=" absolute  bottom-0 w-full text-center font-extrabold opacity-10 text-[#b7ab98] leading-none">
        <h1 className="text-[20vw]   ">CONTACT</h1>
      </div>
    </div>
  );
};

export default FooterSection;
