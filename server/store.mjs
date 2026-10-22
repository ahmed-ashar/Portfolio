import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { get, put } from "@vercel/blob";
const directory = resolve(process.env.CMS_DATA_DIR || ".local/cms");
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
export async function writeRecord(key, data, etag) {
  const body = JSON.stringify(data);
  if (cloud)
    return put("portfolio/" + key, body, {
      access: "private",
      contentType: "application/json",
      allowOverwrite: Boolean(etag),
      ...(etag ? { ifMatch: etag } : {}),
      addRandomSuffix: false,
    });
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
