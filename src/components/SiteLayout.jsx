import { useEffect } from "react";
import { useContent } from "../context/ContentContext";
import Navbar from "./Navbar";
import BlobCursor from "../utilis/BlobCursor";
import Icons from "./Icons";
import BackToTop from "./BackToTop";
import DockComp from "./DockComp";
import FooterSection from "./FooterSection";

// Keep the footer outside the framed content: the body margin reveals it on scroll.
// Individual pages own their main landmark and page-specific overflow behavior.
export default function SiteLayout({
  children,
  frameClassName = "",
  contentClassName = "h-[100%]",
  showUtilities = true,
  footerReveal = true,
}) {
  const {identity,footer}=useContent();
  useEffect(()=>{document.body.style.marginBottom=footer.enabled && footerReveal ? "79vh" : "0";return ()=>{document.body.style.marginBottom="";};},[footer.enabled,footerReveal]);
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
      {footer.enabled && <FooterSection reveal={footerReveal} />}
    </div>
  );
}
