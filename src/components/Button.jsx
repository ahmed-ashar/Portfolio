import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { startRipple } from "../utilis/ripple";

/**
 * The only button component on the site. Internal links, external links and
 * plain buttons all render the same shape, spacing, colours and hover circle,
 * so section CTAs, story actions and project filters stay identical.
 *
 * variant: "solid" (surface fill, default), "outline" (secondary), "accent".
 * Pass arrow={false} for controls such as the project filter row.
 */
export default function Button({
  children,
  to,
  href,
  onClick,
  variant = "solid",
  arrow = true,
  className = "",
  ...rest
}) {
  const classes = ["ripple", "btn", variant !== "solid" && `btn-${variant}`, className]
    .filter(Boolean)
    .join(" ");
  const content = (
    <>
      <span>{children}</span>
      {arrow && <FontAwesomeIcon icon={faArrowUp} aria-hidden="true" className="btn-icon" />}
      {href && <span className="sr-only"> (opens in a new tab)</span>}
    </>
  );
  const shared = { className: classes, onPointerEnter: startRipple, ...rest };

  if (to) return <Link to={to} {...shared}>{content}</Link>;
  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} {...shared}>
      {content}
    </button>
  );
}
