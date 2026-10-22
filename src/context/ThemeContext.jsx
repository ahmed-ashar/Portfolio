import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useContent } from "./ContentContext";
import useHydrated from "../utilis/useHydrated";

// localStorage throws outright when site data is blocked, which would take the
// whole app down from a render-time read.
const readStoredTheme = () => {
  try {
    return window.localStorage.getItem("theme");
  } catch {
    return null;
  }
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { appearance } = useContent();
  const [isDarkTheme, setIsDarkTheme] = useState(
    () => readStoredTheme() !== "light"
  );

  const hydrated = useHydrated();
  const resolvedDarkTheme = hydrated ? isDarkTheme : true;
  const colors = resolvedDarkTheme ? appearance.dark : appearance.light;

  useEffect(() => {
    if (!hydrated) return;
    const name = isDarkTheme ? "dark" : "light";
    const root = document.documentElement;
    root.style.setProperty("--font-avant", appearance.font);
    root.style.setProperty("--black", colors.black);
    root.style.setProperty("--gray", colors.gray);
    root.style.setProperty("--text-off", colors.textOff);
    root.style.setProperty("--orange", colors.orange);
    root.style.colorScheme = name;
    root.setAttribute("data-theme", name);

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", colors.black);

    try {
      window.localStorage.setItem("theme", name);
    } catch {
      // Not being able to remember the choice is not worth an error.
    }
  }, [isDarkTheme, colors, hydrated, appearance.font]);

  const value = useMemo(
    () => ({
      isDarkTheme: resolvedDarkTheme,
      toggleTheme: () => setIsDarkTheme((prev) => !prev),
      colors,
    }),
    [resolvedDarkTheme, colors]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- Provider + hook co-located is the standard Context pattern
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
