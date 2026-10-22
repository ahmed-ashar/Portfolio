import { analyticsReport } from "./analytics.mjs";
import {
  randomBytes,
  createHash,
  scrypt as scryptCallback,
  timingSafeEqual,
  randomUUID,
} from "node:crypto";
import { promisify } from "node:util";
import { defaults, validateContent } from "../src/content/schema.js";
import {
  cloud,
  available,
  readRecord,
  writeRecord,
  createLocalCredentials,
  saveMedia,
  readMedia,
} from "./store.mjs";
const scrypt = promisify(scryptCallback);
const cookieName = "portfolio_admin";
const hash = (value) => createHash("sha256").update(value).digest("hex");
const fail = (status, message) => Object.assign(new Error(message), { status });
let queue = Promise.resolve();
export async function passwordHash(password) {
  const salt = randomBytes(16).toString("hex");
  return salt + ":" + (await scrypt(password, salt, 64)).toString("hex");
}
async function credentials() {
  if (process.env.ADMIN_PASSWORD_HASH)
    return { passwordHash: process.env.ADMIN_PASSWORD_HASH };
  if (cloud) return null;
  return (await readRecord("credentials.json")).data;
}
async function validPassword(password, stored) {
  const [salt, expected] = stored.split(":");
  if (!/^[a-f0-9]{32}$/.test(salt) || !/^[a-f0-9]{128}$/.test(expected))
    return false;
  return timingSafeEqual(
    await scrypt(password, salt, 64),
    Buffer.from(expected, "hex"),
  );
}
const isLoopback = (req) =>
  ["127.0.0.1", "localhost", "[::1]"].includes(
    new URL("http://" + req.headers.host).hostname,
  ) &&
  ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(req.socket?.remoteAddress);
const initialState = () => ({
  revision: 0,
  draft: structuredClone(defaults),
  published: structuredClone(defaults),
  publishedAt: null,
  savedAt: null,
  previous: null,
});
export async function publishedContent() {
  if (!available()) return defaults;
  const record = await readRecord("content.json");
  return record.data?.published || defaults;
}
async function authRecord() {
  const record = await readRecord("auth.json");
  record.data ||= { attempts: 0, windowStart: 0, sessions: [] };
  record.data.sessions = record.data.sessions.filter(
    (s) => s.expires > Date.now(),
  );
  return record;
}
function getToken(req) {
  return (
    (req.headers.cookie || "")
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(cookieName + "="))
      ?.slice(cookieName.length + 1) || ""
  );
}
async function authenticate(req) {
  const config = await credentials();
  if (!config) throw fail(503, "Set up the administrator before signing in.");
  const record = await authRecord();
  const session = record.data.sessions.find(
    (s) =>
      s.token === hash(getToken(req)) &&
      s.fingerprint === hash(config.passwordHash),
  );
  if (!session)
    throw fail(401, "Your session has expired. Please sign in again.");
  return record;
}
function setCookie(res, token, expires = 28800) {
  res.setHeader(
    "Set-Cookie",
    `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${expires}${cloud ? "; Secure" : ""}`,
  );
}
function send(res, status, data) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(data));
}
async function readBody(req) {
  if (!String(req.headers["content-type"] || "").startsWith("application/json"))
    throw fail(415, "Use a JSON request.");
  if (req.body && typeof req.body === "object") {
    if (Buffer.byteLength(JSON.stringify(req.body)) > 4200000)
      throw fail(413, "Request is too large.");
    return req.body;
  }
  let bytes = 0;
  const chunks = [];
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > 4200000) throw fail(413, "Request is too large.");
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString());
  } catch {
    throw fail(400, "Invalid request.");
  }
}
function sameOrigin(req) {
  const origin = req.headers.origin;
  if (
    !origin ||
    new URL(origin).host !== req.headers.host ||
    (cloud && new URL(origin).protocol !== "https:")
  )
    throw fail(403, "This request must come from the dashboard.");
}
async function handle(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  const url = new URL(req.url, "http://localhost");
  if (req.method === "GET" && url.pathname === "/api/content")
    return send(res, 200, { content: await publishedContent() });
  if (req.method === "GET" && url.pathname === "/api/media") {
    const id = url.searchParams.get("id") || "";
    if (!/^[a-f0-9-]{36}\.(png|jpg|webp|gif)$/.test(id))
      throw fail(404, "Image not found.");
    const image = await readMedia(id);
    if (!image) throw fail(404, "Image not found.");
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    res.setHeader(
      "Content-Type",
      {
        png: "image/png",
        jpg: "image/jpeg",
        webp: "image/webp",
        gif: "image/gif",
      }[id.split(".").pop()],
    );
    res.end(image);
    return;
  }
  if (url.pathname !== "/api/admin") throw fail(404, "Not found.");
  if (req.method === "GET") {
    if (url.searchParams.get("action") === "analytics") {
      await authenticate(req);
      const content = await publishedContent();
      const host = new URL(content.seo.siteUrl).hostname;
      return send(res, 200, await analyticsReport(Number(url.searchParams.get("days") || 30), host));
    }
    const config = available() ? await credentials() : null;
    let authenticated = false;
    if (config)
      try {
        await authenticate(req);
        authenticated = true;
      } catch (error) {
        if (error.status !== 401) throw error;
      }
    if (url.searchParams.get("action") === "content") {
      await authenticate(req);
      return send(
        res,
        200,
        (await readRecord("content.json")).data || initialState(),
      );
    }
    return send(res, 200, {
      configured: Boolean(config) && available(),
      authenticated,
      setupAllowed: !cloud && !config && isLoopback(req),
      storage: cloud ? "Vercel Blob" : "Local development",
      message: !available()
        ? "Connect a private Vercel Blob store and set ADMIN_PASSWORD_HASH in Vercel."
        : !config && cloud
          ? "Set ADMIN_PASSWORD_HASH in Vercel to enable admin login."
          : null,
    });
  }
  if (req.method !== "POST") throw fail(405, "Method not allowed.");
  sameOrigin(req);
  const body = await readBody(req);
  if (body.action === "setup") {
    if (cloud || !isLoopback(req) || (await credentials()))
      throw fail(
        403,
        "Setup is available only on this computer before the first admin is created.",
      );
    if (
      typeof body.password !== "string" ||
      body.password.length < 12 ||
      body.password.length > 256
    )
      throw fail(400, "Use a password with 12 to 256 characters.");
    await createLocalCredentials({
      passwordHash: await passwordHash(body.password),
    });
    return send(res, 200, { ok: true });
  }
  if (body.action === "login") {
    const config = await credentials();
    if (!config)
      throw fail(503, "Administrator login has not been configured.");
    const record = await authRecord();
    if (Date.now() - record.data.windowStart > 900000) {
      record.data.attempts = 0;
      record.data.windowStart = Date.now();
    }
    if (record.data.attempts >= 10)
      throw fail(429, "Too many sign-in attempts. Try again in 15 minutes.");
    // Reserve the attempt before doing password work; conditional writes apply across instances.
    record.data.attempts++;
    await writeRecord("auth.json", record.data, record.etag);
    if (
      typeof body.password !== "string" ||
      body.password.length > 256 ||
      !(await validPassword(body.password, config.passwordHash))
    )
      throw fail(401, "Incorrect password.");
    const latest = await authRecord();
    const token = randomBytes(32).toString("hex");
    latest.data.attempts = 0;
    latest.data.sessions = [
      ...latest.data.sessions.slice(-19),
      {
        token: hash(token),
        fingerprint: hash(config.passwordHash),
        expires: Date.now() + 28800000,
      },
    ];
    await writeRecord("auth.json", latest.data, latest.etag);
    setCookie(res, token);
    return send(res, 200, { ok: true });
  }
  const auth = await authenticate(req);
  if (body.action === "logout") {
    auth.data.sessions = auth.data.sessions.filter(
      (s) => s.token !== hash(getToken(req)),
    );
    await writeRecord("auth.json", auth.data, auth.etag);
    setCookie(res, "", 0);
    return send(res, 200, { ok: true });
  }
  if (body.action === "upload") {
    if (
      typeof body.data !== "string" ||
      !/^[a-zA-Z0-9+/]*={0,2}$/.test(body.data)
    )
      throw fail(400, "Invalid image.");
    const buffer = Buffer.from(body.data, "base64");
    if (buffer.length > 3000000)
      throw fail(413, "Choose an image smaller than 3 MB.");
    let type;
    if (
      buffer
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    )
      type = "png";
    else if (buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255)
      type = "jpg";
    else if (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    )
      type = "webp";
    else if (["GIF87a", "GIF89a"].includes(buffer.toString("ascii", 0, 6)))
      type = "gif";
    if (!type) throw fail(400, "Use a PNG, JPEG, WebP or GIF image.");
    const id = randomUUID() + "." + type;
    await saveMedia(
      id,
      buffer,
      type === "jpg" ? "image/jpeg" : "image/" + type,
    );
    return send(res, 200, { url: "/api/media?id=" + id });
  }
  if (!["save", "publish", "restore"].includes(body.action))
    throw fail(400, "Unknown action.");
  const record = await readRecord("content.json");
  const state = record.data || initialState();
  if (body.revision !== state.revision)
    throw fail(
      409,
      "Another session saved changes. Export your edits, then reload the saved version before continuing.",
    );
  if (body.action === "restore") {
    if (!state.previous)
      throw fail(400, "There is no previous publication to restore.");
    state.draft = structuredClone(state.previous);
  } else {
    try {
      validateContent(body.content);
    } catch (error) {
      throw fail(400, error.message);
    }
    state.draft = body.content;
    if (body.action === "publish") {
      state.previous = state.published;
      state.published = body.content;
      state.publishedAt = new Date().toISOString();
    }
  }
  state.savedAt = new Date().toISOString();
  state.revision++;
  await writeRecord("content.json", state, record.etag);
  return send(res, 200, state);
}
export default async function cms(req, res) {
  const run = async () => {
    try {
      await handle(req, res);
    } catch (error) {
      const conflict = /Precondition|already exists/.test(
        error.name + " " + error.message,
      );
      const status = error.status || (conflict ? 409 : 500);
      if (status === 500) console.error("CMS request failed:", error.message);
      send(res, status, {
        error:
          status === 500
            ? "The server could not complete this request. Your changes have not been saved."
            : conflict
              ? "Another request updated this record. Please try again."
              : error.message,
      });
    }
  };
  // Local atomic writes are serialized; cloud writes additionally use ETag conditions.
  if (req.method === "POST") {
    const pending = queue.then(run, run);
    queue = pending.catch(() => {});
    return pending;
  }
  return run();
}
