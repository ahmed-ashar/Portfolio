import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: {
    // Bundle both router packages so Vercel does not need their conditional
    // node_modules exports (including react-router/dom) at runtime.
    noExternal: [
      "react-router",
      "react-router-dom",
      "gsap",
      "@gsap/react",
      "simple-parallax-js",
    ],
  },
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist-ssr",
    rollupOptions: { output: { entryFileNames: "entry-server.js" } },
  },
});
