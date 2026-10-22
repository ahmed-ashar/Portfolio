import { startReviewServer } from "./review-server.mjs";
const server = await startReviewServer(4174);
console.log("Dashboard test server: http://127.0.0.1:4174");
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => server.close());
