import { createContext, useContext, useEffect, useState } from "react";
import defaults from "../content/defaults.json" with { type: "json" };
import { validateContent } from "../content/schema";
const ContentContext = createContext({ content: defaults, revision: 0 });
export function ContentProvider({ children, initialContent = defaults }) {
  const [state, setState] = useState(() => ({ content: validateContent(initialContent), revision: 0 }));
  useEffect(() => {
    const preview =
      new URLSearchParams(location.search).has("editor-preview") &&
      window.parent !== window;
    let active = true;
    const apply = (content) => {
      try {
        content = validateContent(content);
        if (active)
          setState((old) =>
            JSON.stringify(old.content) === JSON.stringify(content)
              ? old
              : { content, revision: old.revision + 1 },
          );
      } catch {
        /* Keep the last valid content. */
      }
    };
    const receive = (event) => {
      if (
        preview &&
        event.origin === location.origin &&
        event.source === window.parent &&
        event.data?.type === "portfolio-preview"
      )
        apply(event.data.content);
    };
    window.addEventListener("message", receive);
    if (preview)
      window.parent.postMessage(
        { type: "portfolio-preview-ready" },
        location.origin,
      );
    else
      fetch("/api/content")
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (data?.content) apply(data.content);
        })
        .catch(() => {});
    return () => {
      active = false;
      window.removeEventListener("message", receive);
    };
  }, []);
  return (
    <ContentContext.Provider value={state}>{children}</ContentContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export const useContent = () => useContext(ContentContext).content;
// eslint-disable-next-line react-refresh/only-export-components
export const useContentRevision = () => useContext(ContentContext).revision;
