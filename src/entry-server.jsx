import { StrictMode } from "react";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import { PassThrough } from "node:stream";
import Shell from "./Shell";

// Await lazy routes before writing static HTML. No streaming scripts or second
// content tree: the browser hydrates the same Shell that is rendered here.
export function render(pathname, initialContent) {
  return new Promise((resolve, reject) => {
    const output = new PassThrough();
    const chunks = [];
    output.on("data", chunk => chunks.push(chunk));
    output.on("end", () => { clearTimeout(timeout); resolve(Buffer.concat(chunks).toString("utf8")); });
    output.on("error", reject);
    const stream = renderToPipeableStream(
      <StrictMode><Shell initialContent={initialContent} Router={StaticRouter} routerProps={{ location: pathname }} /></StrictMode>,
      {
        onAllReady() { stream.pipe(output); },
        onError(error) { clearTimeout(timeout); reject(error); },
      }
    );
    const timeout = setTimeout(() => { stream.abort(); reject(new Error(`Prerender timed out: ${pathname}`)); }, 30_000);
  });
}
