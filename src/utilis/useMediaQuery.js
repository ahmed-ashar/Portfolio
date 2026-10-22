import { useCallback, useSyncExternalStore } from "react";

const serverSnapshot = () => false;

export default function useMediaQuery(query) {
  const subscribe = useCallback((onChange) => {
    const media = window.matchMedia(query);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, getSnapshot, serverSnapshot);
}
