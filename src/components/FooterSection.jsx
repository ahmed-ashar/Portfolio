import { useContent } from "../context/ContentContext";
import Magnet from "../utilis/Magnet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";


const FooterSection = () => {
  const footer = useContent().footer;
  const links = footer.links;
  return (
    <footer className=" fixed h-[80vh] bottom-0 top-auto w-full gray-bg  -z-1">
      <div className="h-[80vh] sm:h-[85vh] w-full overflow-hidden text-off-white relative">
        <div className="w-[calc(95%-2.1rem)] sm:w-[calc(75%-2.1rem)] md:w-[calc(80%-2.1rem)]  mt-5 sm:mt-10 mx-auto flex flex-col sm:flex-row justify-between items-start  gap-10">
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold   ">
              <span style={{whiteSpace:"pre-line"}}>{footer.heading}</span>
            </h2>
            <div className="flex flex-col mt-1 sm:mt-5 gap-1 sm:gap-2 ">
              <p className="text-xs md:text-sm">{footer.contactLabel}</p>
              <Magnet padding={5} disabled={false} magnetStrength={7}>
                <a
                  href={`mailto:${footer.email}`}
                  className="text-sm md:text-2xl group inline-block py-1 font-bold orange-text-hover break-all"
                >
                  {footer.email}{" "}
                  <FontAwesomeIcon
                    icon={faArrowUp}
                    aria-hidden="true"
                    className="text-sm sm:text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
                  />{" "}
                </a>
              </Magnet>
              <address className="text-xs md:text-sm not-italic">
                <span style={{whiteSpace:"pre-line"}}>{footer.address}</span>
              </address>
            </div>
          </div>

          <nav aria-label="Elsewhere" className=" sm:text-end ">
            <p className="text-xs sm:text-sm">{footer.linksLabel}</p>
            <ul
              role="list"
              className="text-sm sm:text-xl  sm:mt-2 text-end flex flex-wrap sm:flex-col gap-1 font-bold"
            >
              {links.map((link) => (
                <li key={link.name}>
                  <Magnet padding={5} disabled={false} magnetStrength={7}>
                    <a
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-block py-1 orange-text-hover"
                    >
                      <FontAwesomeIcon
                        icon={faArrowUp}
                        aria-hidden="true"
                        className="text-sm sm:text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
                      />{" "}
                      {link.name}
                    </a>
                  </Magnet>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p
          aria-hidden="true"
          className=" absolute  bottom-0 w-full text-center font-extrabold opacity-10  leading-none text-off-white text-[18vw] "
        >
          {footer.watermark}
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
