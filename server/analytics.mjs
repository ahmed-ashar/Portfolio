import { JWT } from "google-auth-library";

const scope = "https://www.googleapis.com/auth/analytics.readonly";
const metrics = [
  "totalUsers",
  "activeUsers",
  "newUsers",
  "sessions",
  "engagedSessions",
  "screenPageViews",
  "userEngagementDuration",
  "averageSessionDuration",
  "engagementRate",
];
const fields = (names) => names.map((name) => ({ name }));
const fault = (status, message) =>
  Object.assign(new Error(message), { status });
const number = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);
export function rows(report) {
  return (report?.rows || []).map((row) =>
    Object.fromEntries([
      ...(report.dimensionHeaders || []).map((header, i) => [
        header.name,
        row.dimensionValues?.[i]?.value || "(not set)",
      ]),
      ...(report.metricHeaders || []).map((header, i) => [
        header.name,
        number(row.metricValues?.[i]?.value),
      ]),
    ]),
  );
}
function dates(days, timezone, now) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (name) => parts.find((p) => p.type === name).value;
  const today = Date.parse(
    `${part("year")}-${part("month")}-${part("day")}T00:00:00Z`,
  );
  return Array.from({ length: days }, (_, i) =>
    new Date(today - (days - i) * 86400000).toISOString().slice(0, 10),
  );
}

// In-memory caches are bounded and shared only within one server instance.
// Every caller must authenticate before reaching this service.
export function createAnalyticsService({
  env = process.env,
  request,
  now = () => Date.now(),
} = {}) {
  const cache = new Map();
  const pending = new Map();
  let client;
  async function query(property, body, method = "batchRunReports") {
    try {
      if (request) return await request(body, method);
      client ||= new JWT({
        email: env.GA_CLIENT_EMAIL,
        key: env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: [scope],
        transporterOptions: { timeout: 8000, retry: false },
      });
      const response = await client.request({
        url: `https://analyticsdata.googleapis.com/v1beta/properties/${property}:${method}`,
        method: "POST",
        data: body,
        timeout: 8000,
        retry: false,
      });
      return response.data;
    } catch (error) {
      const code = error.response?.status || error.status || error.code;
      if (code === 400)
        throw fault(
          400,
          "Analytics rejected this report. Check the property ID and custom dimension setup.",
        );
      if (code === 401 || code === 403)
        throw fault(
          503,
          "Analytics access is not ready. Enable the Google Analytics Data API and give the service account Viewer access to this property.",
        );
      if (code === 429)
        throw fault(
          503,
          "Google Analytics is rate limiting reports. Try again in a few minutes.",
        );
      throw fault(
        503,
        "Google Analytics is unavailable or its credentials are invalid. Check the server configuration and try again.",
      );
    }
  }
  async function load(days, host, projectPaths) {
    const property = env.GA_PROPERTY_ID;
    const missing = [
      "GA_PROPERTY_ID",
      "GA_CLIENT_EMAIL",
      "GA_PRIVATE_KEY",
    ].filter((key) => !env[key]);
    if (missing.length) return { configured: false, missing };
    if (!/^\d+$/.test(property))
      throw fault(
        503,
        "GA_PROPERTY_ID must be the numeric GA4 property ID, not the G- measurement ID.",
      );
    const filter = {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: "hostName",
              stringFilter: { matchType: "EXACT", value: host },
            },
          },
          {
            filter: {
              fieldName: "pagePath",
              inListFilter: { values: ["/", "/about", "/projects", ...projectPaths] },
            },
          },
        ],
      },
    };
    const currentRange = {
      startDate: `${days}daysAgo`,
      endDate: "yesterday",
      name: "current",
    };
    const report = (dimensions, names, extra = {}) => ({
      dateRanges: [currentRange],
      dimensions: fields(dimensions),
      metrics: fields(names),
      dimensionFilter: filter,
      limit: "100",
      ...extra,
    });
    const sortMetric = (name) => [{ metric: { metricName: name }, desc: true }];
    const reports = [
      report([], metrics, {
        dateRanges: [
          currentRange,
          {
            startDate: `${days * 2}daysAgo`,
            endDate: `${days + 1}daysAgo`,
            name: "previous",
          },
        ],
      }),
      report(["date"], ["totalUsers", "screenPageViews", "sessions"], {
        orderBys: [{ dimension: { dimensionName: "date" } }],
      }),
      report(
        ["pagePath"],
        ["screenPageViews", "totalUsers", "userEngagementDuration"],
        { orderBys: sortMetric("screenPageViews") },
      ),
      report(["sessionSourceMedium"], ["sessions", "engagedSessions"], {
        orderBys: sortMetric("sessions"),
      }),
      report(["deviceCategory"], ["sessions"], {
        orderBys: sortMetric("sessions"),
      }),
      report(["country"], ["totalUsers"], {
        orderBys: sortMetric("totalUsers"),
      }),
      report(["eventName"], ["eventCount", "totalUsers"], {
        orderBys: sortMetric("eventCount"),
      }),
      report(["pagePath", "eventName"], ["eventCount"], {
        dimensionFilter: {
          andGroup: {
            expressions: [
              filter,
              {
                filter: {
                  fieldName: "eventName",
                  stringFilter: {
                    matchType: "BEGINS_WITH",
                    value: "portfolio_scroll_",
                  },
                },
              },
            ],
          },
        },
      }),
    ];
    const batches = await Promise.all([
      query(property, { requests: reports.slice(0, 5) }),
      query(property, { requests: reports.slice(5) }),
    ]);
    const data = batches.flatMap((batch) => batch.reports || []);
    if (data.length !== reports.length)
      throw fault(
        503,
        "Google Analytics returned an incomplete report. Please try again.",
      );
    let details = { available: true, rows: [] };
    try {
      const detailReport = await query(
        property,
        report(
          ["eventName", "customEvent:interaction_label"],
          ["eventCount", "totalUsers"],
          {
            dimensionFilter: {
              andGroup: {
                expressions: [
                  filter,
                  {
                    filter: {
                      fieldName: "eventName",
                      inListFilter: {
                        values: [
                          "portfolio_project_open",
                          "portfolio_contact",
                          "portfolio_filter",
                          "portfolio_navigation",
                        ],
                      },
                    },
                  },
                ],
              },
            },
            orderBys: sortMetric("eventCount"),
          },
        ),
        "runReport",
      );
      details.rows = rows(detailReport);
      details.limited = (detailReport.rowCount || 0) > 100;
      data.push(detailReport);
    } catch (error) {
      details = {
        available: false,
        rows: [],
        setupRequired: error.status === 400,
        message:
          error.status === 400
            ? "Register the event-scoped interaction_label custom dimension in GA4 to see project and interaction names."
            : "Interaction details are temporarily unavailable. Other reports are ready.",
      };
    }
    const timezone = data[0].metadata?.timeZone || "UTC";
    const daily = rows(data[1]);
    const range = dates(days, timezone, now());
    const summary = rows(data[0]);
    const zero = Object.fromEntries(metrics.map((name) => [name, 0]));
    return {
      configured: true,
      provider: "Google Analytics 4",
      days,
      timezone,
      host,
      startDate: range[0],
      endDate: range.at(-1),
      generatedAt: new Date(now()).toISOString(),
      current: {
        ...zero,
        ...summary.find((row) => row.dateRange === "current"),
      },
      previous: {
        ...zero,
        ...summary.find((row) => row.dateRange === "previous"),
      },
      trend: range.map((date) => ({
        date,
        totalUsers: 0,
        screenPageViews: 0,
        sessions: 0,
        ...daily.find((row) => row.date === date.replaceAll("-", "")),
        dateLabel: date,
      })),
      pages: rows(data[2]),
      sources: rows(data[3]),
      devices: rows(data[4]),
      countries: rows(data[5]),
      events: rows(data[6]),
      scroll: rows(data[7]),
      details,
      quality: {
        thresholded: data.some((r) => r.metadata?.subjectToThresholding),
        sampled: data.some((r) => r.metadata?.samplingMetadatas?.length),
        otherRow: data.some((r) => r.metadata?.dataLossFromOtherRow),
        limited: data.some((r) => (r.rowCount || 0) > 100),
      },
    };
  }
  return async function analytics(days, host, projectPaths = []) {
    if (![7, 30, 90].includes(days))
      throw fault(400, "Choose a 7, 30 or 90 day range.");
    const key = `${days}:${host}:${JSON.stringify(projectPaths)}`;
    const entry = cache.get(key);
    if (entry && now() - entry.time < 300000) return entry.value;
    if (pending.has(key)) return pending.get(key);
    // Host comes from the validated published website URL, never arbitrary input.
    if (cache.size > 6) cache.clear();
    const job = load(days, host, projectPaths)
      .then((value) => {
        cache.set(key, { time: now(), value });
        return value;
      })
      .finally(() => pending.delete(key));
    pending.set(key, job);
    return job;
  };
}
export const analyticsReport = createAnalyticsService();
