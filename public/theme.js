/*
 * Applies the visitor's saved theme before first paint, so a light-theme
 * visitor never sees a dark flash.
 * Kept as a file rather than an inline <script> so the production CSP can
 * forbid inline scripts.
 * Must stay in sync with src/context/ThemeContext.jsx.
 */
(function () {
  var THEMES = {
    dark: { black: "#131313", gray: "#2c2c2c", textOff: "#b7ab98", orange: "#fd8b09" },
    light: { black: "#e4e1d8", gray: "#b0b9ae", textOff: "#2a3439", orange: "#59614b" },
  };

  var root = document.documentElement;

  function stored(key) {
    try {
      return window.localStorage.getItem(key);
    } catch {
      // Storage can be blocked entirely; fall through to the defaults.
      return null;
    }
  }

  var name = stored("theme") === "light" ? "light" : "dark";
  var c = THEMES[name];

  root.style.setProperty("--black", c.black);
  root.style.setProperty("--gray", c.gray);
  root.style.setProperty("--text-off", c.textOff);
  root.style.setProperty("--orange", c.orange);
  root.style.colorScheme = name;
  root.setAttribute("data-theme", name);
})();
