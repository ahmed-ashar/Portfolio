import test from "node:test";
import assert from "node:assert/strict";
import { createAnalyticsService, rows } from "./analytics.mjs";
const env = {
  GA_PROPERTY_ID: "123456789",
  GA_CLIENT_EMAIL: "test@example.invalid",
  GA_PRIVATE_KEY: "TEST-ONLY-NOT-A-KEY",
};
const now = () => Date.parse("2026-10-23T01:00:00Z");
function result(dimensions, metrics, values, extra = {}) {
  return {
    dimensionHeaders: dimensions.map((name) => ({ name })),
    metricHeaders: metrics.map((name) => ({ name })),
    rows: values.map(([dims, nums]) => ({
      dimensionValues: dims.map((value) => ({ value })),
      metricValues: nums.map((value) => ({ value: String(value) })),
    })),
    metadata: { timeZone: "Asia/Karachi" },
    ...extra,
  };
}
function fixture(request) {
  const dims = request.dimensions.map((x) => x.name);
  const metrics = request.metrics.map((x) => x.name);
  if (request.dateRanges.length === 2)
    return result(["dateRange"], metrics, [
      [["current"], [12, 10, 4, 20, 14, 40, 600, 45, 0.7]],
      [["previous"], [10, 8, 2, 15, 9, 25, 300, 35, 0.6]],
    ]);
  if (dims[0] === "date")
    return result(dims, metrics, [[["20261022"], [5, 9, 6]]]);
  return result(dims, metrics, []);
}
test("GA4 reports compare full periods, preserve period uniques, fill missing days and scope public traffic", async () => {
  const calls = [];
  const service = createAnalyticsService({
    env,
    now,
    request: async (body, method) => {
      calls.push({ body, method });
      return method === "runReport"
        ? fixture(body)
        : { reports: body.requests.map(fixture) };
    },
  });
  const data = await service(7, "ahmed-ashar.vercel.app");
  assert.equal(data.current.totalUsers, 12);
  assert.equal(data.previous.totalUsers, 10);
  assert.equal(data.current.engagementRate, 0.7);
  assert.equal(data.trend.length, 7);
  assert.equal(data.startDate, "2026-10-16");
  assert.equal(data.endDate, "2026-10-22");
  assert.equal(data.trend[0].totalUsers, 0);
  assert.equal(data.trend.at(-1).totalUsers, 5);
  assert.equal(calls.length, 3);
  assert.ok(
    calls
      .filter((c) => c.method === "batchRunReports")
      .every((c) => c.body.requests.length <= 5),
  );
  const first = calls[0].body.requests[0];
  assert.deepEqual(first.dateRanges[1], {
    startDate: "14daysAgo",
    endDate: "8daysAgo",
    name: "previous",
  });
  const filter = first.dimensionFilter.andGroup.expressions;
  assert.equal(filter[0].filter.stringFilter.value, "ahmed-ashar.vercel.app");
  assert.deepEqual(filter[1].filter.inListFilter.values, [
    "/",
    "/about",
    "/projects",
  ]);
  await Promise.all([
    service(7, "ahmed-ashar.vercel.app"),
    service(7, "ahmed-ashar.vercel.app"),
  ]);
  assert.equal(calls.length, 3);
});
test("concurrent requests share one report and cache expires", async () => {
  let time = now(),
    calls = 0;
  const service = createAnalyticsService({
    env,
    now: () => time,
    request: async (body, method) => {
      calls++;
      return method === "runReport"
        ? fixture(body)
        : { reports: body.requests.map(fixture) };
    },
  });
  await Promise.all([service(30, "example.com"), service(30, "example.com")]);
  assert.equal(calls, 3);
  time += 300001;
  await service(30, "example.com");
  assert.equal(calls, 6);
  await service(7, "example.com");
  assert.equal(calls, 9);
});
test("missing configuration is explicit and never returns fabricated totals", async () => {
  let called = false;
  const service = createAnalyticsService({
    env: {},
    request: async () => {
      called = true;
    },
  });
  assert.deepEqual(await service(30, "example.com"), {
    configured: false,
    missing: ["GA_PROPERTY_ID", "GA_CLIENT_EMAIL", "GA_PRIVATE_KEY"],
  });
  assert.equal(called, false);
  await assert.rejects(service(999, "example.com"), { status: 400 });
  await assert.rejects(
    createAnalyticsService({ env: { ...env, GA_PROPERTY_ID: "G-ABC" } })(
      30,
      "example.com",
    ),
    { status: 503 },
  );
});
test("unregistered custom dimension does not hide core reports; quality flags survive", async () => {
  const service = createAnalyticsService({
    env,
    now,
    request: async (body, method) => {
      if (method === "runReport")
        throw Object.assign(new Error("invalid dimension"), { status: 400 });
      return {
        reports: body.requests.map((r) => ({
          ...fixture(r),
          rowCount: 110,
          metadata: {
            timeZone: "UTC",
            subjectToThresholding: true,
            samplingMetadatas: [{}],
            dataLossFromOtherRow: true,
          },
        })),
      };
    },
  });
  const data = await service(30, "example.com");
  assert.equal(data.current.screenPageViews, 40);
  assert.equal(data.details.available, false);
  assert.equal(data.details.setupRequired, true);
  assert.deepEqual(data.quality, {
    thresholded: true,
    sampled: true,
    otherRow: true,
    limited: true,
  });
});
test("upstream failures are safe and failed calls are retried rather than cached", async () => {
  let calls = 0;
  const service = createAnalyticsService({
    env,
    request: async () => {
      calls++;
      throw Object.assign(new Error("PRIVATE-KEY-secret"), {
        response: { status: 403 },
      });
    },
  });
  await assert.rejects(
    service(30, "example.com"),
    (error) => error.status === 503 && !error.message.includes("PRIVATE-KEY"),
  );
  await assert.rejects(service(30, "example.com"));
  assert.ok(calls >= 4);
  assert.deepEqual(
    rows({
      metricHeaders: [{ name: "eventCount" }],
      rows: [{ metricValues: [{ value: "NaN" }] }],
    }),
    [{ eventCount: 0 }],
  );
});
