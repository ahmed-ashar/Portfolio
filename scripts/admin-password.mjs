import { emitKeypressEvents } from "node:readline";
import { mkdir, writeFile } from "node:fs/promises";
import { passwordHash } from "../server/cms.mjs";
if (!process.stdin.isTTY)
  throw new Error("Run this command in an interactive terminal.");
function hidden(question) {
  process.stdout.write(question);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolve) => {
    let value = "";
    const listener = (text, key) => {
      if (key?.ctrl && key.name === "c") {
        process.stdin.setRawMode(false);
        process.exit(130);
      }
      if (key?.name === "return") {
        process.stdin.removeListener("keypress", listener);
        process.stdin.setRawMode(false);
        process.stdin.pause();
        process.stdout.write("\n");
        resolve(value);
      } else if (key?.name === "backspace") value = value.slice(0, -1);
      else if (text && !key?.ctrl) value += text;
    };
    process.stdin.on("keypress", listener);
  });
}
const password = await hidden(
  "Choose an admin password (at least 12 characters; input is hidden): ",
);
if (password.length < 12 || password.length > 256)
  throw new Error("Use 12 to 256 characters.");
if (password !== (await hidden("Confirm password: ")))
  throw new Error("Passwords do not match.");
await mkdir(".local", { recursive: true });
await writeFile(".local/admin-password.hash", await passwordHash(password), {
  mode: 0o600,
});
console.log(
  "Password hash saved to .local/admin-password.hash. Set ADMIN_PASSWORD_HASH in Vercel to this file's contents. Never use a VITE_ prefix.",
);
