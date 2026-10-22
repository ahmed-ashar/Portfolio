import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faGithub,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";
import { useContent } from "../context/ContentContext";
import { faLink } from "@fortawesome/free-solid-svg-icons";
import Magnet from "../utilis/Magnet";

const Icons = () => {
  const { footer } = useContent();
  const iconMap={Instagram:faInstagram,Facebook:faFacebook,LinkedIn:faLinkedin,GitHub:faGithub};
  const icons=footer.links.filter(l=>l.showInSidebar).map(l=>({label:l.name,link:l.link,icon:iconMap[l.name] || faLink}));
  return (
    <nav
      aria-label="Social profiles"
      className="hidden sm:fixed sm:bottom-10 sm:left-15 left-9 text-off-white sm:flex sm:flex-row sm:items-center sm:justify-between  sm:gap-5  text-xl sm:text-2xl z-55"
      style={{ writingMode: "vertical-lr" }}
    >
      {icons.map((item) => (
        <Magnet key={item.label} padding={15} disabled={false} magnetStrength={1}>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${item.label} (opens in a new tab)`}
            className="inline-block"
          >
            <FontAwesomeIcon
              icon={item.icon}
              aria-hidden="true"
              className="black-bg p-3 rounded-full"
            />
          </a>
        </Magnet>
      ))}
    </nav>
  );
};

export default Icons;
