import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  ssr: { noExternal: ["gsap", "@gsap/react", "simple-parallax-js"] },
  build: {
    ssr: "src/entry-server.jsx",
    outDir: "dist-ssr",
    rollupOptions: { output: { entryFileNames: "entry-server.js" } },
  },
});
