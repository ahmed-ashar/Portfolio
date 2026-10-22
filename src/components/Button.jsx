import Magnet from "../utilis/Magnet";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

// Renders a real <a href>, not a button+navigate(): crawlers can follow it,
// and middle-click / "open in new tab" work like anywhere else on the web.
const Button = ({ text, to }) => (
  <Magnet padding={10} disabled={false} magnetStrength={20}>
    <Link
      to={to}
      className="px-4 w-auto group text-3xl text-off-white font-extrabold transition-all duration-500 ease-in-out flex items-center justify-center gap-2 orange-bg-hover "
    >
      {text}
      <FontAwesomeIcon
        icon={faArrowUp}
        aria-hidden="true"
        className="text-xl transform transition-transform duration-500 rotate-50 group-hover:rotate-90"
      />
    </Link>
  </Magnet>
);

export default Button;
