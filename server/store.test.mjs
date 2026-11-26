import { test } from "node:test";
import assert from "node:assert/strict";
import { conditionalWriteOptions } from "./store.mjs";

test("existing records overwrite conditionally with the store ETag", () => {
  assert.deepEqual(conditionalWriteOptions(true, '"abc123"'), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
    ifMatch: '"abc123"',
  });
});

test("existing records without an ETag still overwrite instead of failing as already existing", () => {
  // Private blob downloads can omit the ETag header, which get() reports as
  // "". Treating that as "do not overwrite" made every publish after the first
  // one fail with a false 409 conflict.
  const options = conditionalWriteOptions(true, "");
  assert.equal(options.allowOverwrite, true);
  assert.equal(Object.hasOwn(options, "ifMatch"), false);
});

test("new records are created without an overwrite condition", () => {
  const options = conditionalWriteOptions(false, "");
  assert.equal(options.allowOverwrite, false);
  assert.equal(Object.hasOwn(options, "ifMatch"), false);
});
