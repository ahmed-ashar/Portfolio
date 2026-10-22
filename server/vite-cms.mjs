import { loadEnv } from "vite";
import cms from "./cms.mjs";
export default function cmsPlugin() {
  return {
    name: "portfolio-cms",
    configResolved(config) {
      const env = loadEnv(config.mode, config.root, "");
      for (const key of ["ADMIN_PASSWORD_HASH", "CMS_DATA_DIR", "GA_PROPERTY_ID", "GA_CLIENT_EMAIL", "GA_PRIVATE_KEY"])
        if (env[key]) process.env[key] = env[key];
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (/^\/api\/(admin|content|media)(\?|$)/.test(req.url))
          return cms(req, res);
        next();
      });
    },
  };
}
