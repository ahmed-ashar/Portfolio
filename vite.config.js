import { defineConfig } from 'vite'
import cmsPlugin from './server/vite-cms.mjs'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Group node_modules by top-level package so the animation/router/icon
// libraries land in stable vendor chunks. The object form of manualChunks
// only moves each listed package's entry module and leaves its internals
// behind, which is why react-dom kept ending up in the app chunk.
const VENDOR_GROUPS = [
  [/^(react|react-dom|scheduler|react-router|react-router-dom)$/, 'vendor-react'],
  [/^(gsap|@gsap\/react)$/, 'vendor-gsap'],
  [/^(framer-motion|motion-dom|motion-utils)$/, 'vendor-motion'],
  [/^@fortawesome\//, 'vendor-icons'],
]

// Rollup ids use OS separators on Windows, so normalise before matching.
const SEPARATORS = new RegExp('[\\\\/]+', 'g')
const PKG_FROM_ID = /node_modules\/((?:@[^/]+\/)?[^/]+)/

function manualChunks(id) {
  const match = id.replace(SEPARATORS, '/').match(PKG_FROM_ID)
  if (!match) return
  const pkg = match[1]
  for (const [pattern, name] of VENDOR_GROUPS) {
    if (pattern.test(pkg)) return name
  }
  return 'vendor'
}

export default defineConfig({
  plugins: [react(), tailwindcss(), cmsPlugin()],
  server: { host: "127.0.0.1", fs: { deny: [".env", ".env.*", "**/.git/**", "**/.local/**", "**/server/**"] } },
  base: '/',
  build: {
    target: 'es2020',
    rollupOptions: { output: { manualChunks } },
  },
})
