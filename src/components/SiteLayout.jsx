import { useContent } from "../context/ContentContext";
import Navbar from "./Navbar";
import BlobCursor from "../utilis/BlobCursor";
import Icons from "./Icons";
import BackToTop from "./BackToTop";
import DockComp from "./DockComp";
import FooterSection from "./FooterSection";

// Keep the footer outside the framed content. It follows the content on every
// page, so every route shows the same footer spacing.
export default function SiteLayout({
  children,
  frameClassName = "",
  contentClassName = "h-[100%]",
  showUtilities = true,
}) {
  const {identity,footer}=useContent();
  return (
    <div>
      <div className={`p-[0.55rem] gray-bg ${frameClassName}`}>
        <div className={`rounded-[0.3rem] black-bg ${contentClassName}`}>
          <Navbar />
          {identity.showCursor && <BlobCursor />}
          {children}
          {showUtilities && (
            <>
              {identity.showSocials && <Icons />}
              {identity.showBackToTop && <BackToTop />}
            </>
          )}
          {identity.showDock && <DockComp />}
        </div>
      </div>
      {footer.enabled && <FooterSection />}
    </div>
  );
}
