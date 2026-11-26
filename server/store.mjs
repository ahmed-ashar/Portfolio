import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { get, put, head } from "@vercel/blob";
const directory = resolve(process.env.CMS_DATA_DIR || ".local/cms");
const recordPath = (key) => "portfolio/" + key;
export const cloud = Boolean(process.env.VERCEL);
export const available = () =>
  !cloud || Boolean(process.env.BLOB_READ_WRITE_TOKEN);
export async function readRecord(key) {
  if (cloud) {
    if (!available())
      throw new Error(
        "Connect a private Vercel Blob store before using the dashboard.",
      );
    const result = await get("portfolio/" + key, {
      access: "private",
      useCache: false,
    });
    return result
      ? {
          data: await new Response(result.stream).json(),
          etag: result.blob.etag,
        }
      : { data: null, etag: null };
  }
  try {
    return {
      data: JSON.parse(await readFile(resolve(directory, key), "utf8")),
      etag: null,
    };
  } catch (error) {
    if (error.code === "ENOENT") return { data: null, etag: null };
    throw error;
  }
}
// get() exposes the ETag of the download response, which is not always present
// for private blobs and is not guaranteed to be the store's canonical ETag.
// head() returns the value the write API compares against, so resolve it before
// a conditional write.
async function storedRecord(key) {
  try {
    const info = await head(recordPath(key));
    return { exists: Boolean(info), etag: info?.etag || "" };
  } catch (error) {
    if (/does not exist|not found/i.test(error.name + " " + error.message))
      return { exists: false, etag: "" };
    throw error;
  }
}

// Exported so the cloud write conditions can be unit tested without a store.
export function conditionalWriteOptions(exists, etag) {
  return {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    ...(exists && etag
      ? { allowOverwrite: true, ifMatch: etag }
      : exists
        ? { allowOverwrite: true }
        : { allowOverwrite: false }),
  };
}

export async function writeRecord(key, data, etag) {
  const body = JSON.stringify(data);
  if (cloud) {
    const stored = await storedRecord(key);
    const current = stored.exists ? stored.etag || etag || "" : "";
    const options = conditionalWriteOptions(stored.exists, current);
    try {
      return await put(recordPath(key), body, options);
    } catch (error) {
      const message = error.name + " " + error.message;
      // The CMS revision check already guarded this write. An ETag the store
      // rejects, or a record it reports as existing when the metadata read
      // missed it, means the condition cannot be trusted here; retry once
      // without it so an authorised save is never lost. A genuine concurrent
      // change is still reported because the ETag will have moved.
      if (/Precondition/i.test(message)) {
        const latest = await storedRecord(key);
        if (latest.exists && latest.etag && latest.etag !== current)
          throw error;
      } else if (!/already exists/i.test(message)) throw error;
      return put(recordPath(key), body, {
        ...options,
        allowOverwrite: true,
        ifMatch: undefined,
      });
    }
  }
  await mkdir(directory, { recursive: true });
  const temp = resolve(directory, randomUUID() + ".tmp");
  await writeFile(temp, body, { mode: 0o600 });
  await rename(temp, resolve(directory, key));
}
export async function saveMedia(id, buffer, contentType) {
  if (cloud)
    await put("portfolio/media/" + id, buffer, {
      access: "private",
      contentType,
      addRandomSuffix: false,
    });
  else {
    await mkdir(resolve(directory, "media"), { recursive: true });
    await writeFile(resolve(directory, "media", id), buffer);
  }
}
export async function readMedia(id) {
  if (cloud) {
    const result = await get("portfolio/media/" + id, { access: "private" });
    return result
      ? Buffer.from(await new Response(result.stream).arrayBuffer())
      : null;
  }
  try {
    return await readFile(resolve(directory, "media", id));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}
export async function createLocalCredentials(credentials) {
  await mkdir(directory, { recursive: true });
  await writeFile(
    resolve(directory, "credentials.json"),
    JSON.stringify(credentials),
    { flag: "wx", mode: 0o600 },
  );
}
