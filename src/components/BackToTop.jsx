import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useLenis } from "lenis/react";
import CircularText from "../utilis/CircularText";
import Magnet from "../utilis/Magnet";
import useMediaQuery from "../utilis/useMediaQuery";

const BackToTop = () => {
  const lenis = useLenis();
  // Tailwind's `sm`. The ring spins on an endless animation frame, so hiding it
  // with `display:none` below this width still burned battery on phones.
  const isDesktop = useMediaQuery("(min-width: 640px)");

  const scrollToTop = () => {
    if (lenis) lenis.scrollTo(0);
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isDesktop) return null;

  return (
    <div className="fixed sm:block sm:bottom-5 right-5 sm:right-5 z-55">
      <div className="relative">
        <Magnet padding={15} disabled={false} magnetStrength={5}>
          <CircularText
            aria-hidden="true"
            text="BACK*TO*TOP*"
            onHover="speedUp"
            spinDuration={20}
            className="black-bg"
          />
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="absolute flex items-center justify-center orange-bg p-2 w-5 sm:w-10 h-5 sm:h-10 rounded-full text-xl sm:text-4xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer black-text"
          >
            <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" />
          </button>
        </Magnet>
      </div>
    </div>
  );
};

export default BackToTop;
