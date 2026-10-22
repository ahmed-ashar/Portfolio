import { useEffect, useState } from "react";
import "./analytics.css";
const count = (value) =>
  new Intl.NumberFormat("en", { maximumFractionDigits: 1 }).format(value || 0);
const duration = (value) => {
  const seconds = Math.max(0, Math.round(value || 0));
  if (seconds >= 3600)
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
};
const ratio = (a, b) => (b ? a / b : 0);
const percent = (value) => `${count(value * 100)}%`;
const eventNames = {
  portfolio_project_open: "Project opens",
  portfolio_contact: "Contact clicks",
  portfolio_filter: "Project filters",
  portfolio_navigation: "Internal link clicks",
};
function Empty({ children = "No recorded activity in this period." }) {
  return <p className="analytics-empty">{children}</p>;
}
function Setup({ missing }) {
  return (
    <section className="analytics-setup dashboard-card">
      <span className="eyebrow">CONNECT YOUR AUDIENCE</span>
      <h2>Your visitors. The full picture.</h2>
      <p>
        Connect the Google Analytics property already used by this website to
        see real traffic and engagement here.
      </p>
      <p className="analytics-source">
        No analytics connection yet. Numbers will appear after connection; new
        interaction tracking starts after deployment.
      </p>
      <ol>
        <li>
          Open{" "}
          <a
            href="https://analytics.google.com/"
            target="_blank"
            rel="noreferrer"
          >
            Google Analytics ↗
          </a>{" "}
          and find the property whose web stream uses <code>G-77MPKKC7BM</code>.
          Copy its numeric Property ID.
        </li>
        <li>
          In Google Cloud, enable the Google Analytics Data API, create a
          service account, and generate its JSON key. Keep this key private.
        </li>
        <li>
          In GA4 → Property access management, add that service account’s email
          with the Viewer role.
        </li>
        <li>
          In Vercel, set Production environment variables{" "}
          <code>GA_PROPERTY_ID</code>, <code>GA_CLIENT_EMAIL</code> and secret{" "}
          <code>GA_PRIVATE_KEY</code> from the key. Redeploy.
        </li>
        <li>
          For project and filter names, add a GA4 event-scoped custom dimension
          named Interaction label with event parameter{" "}
          <code>interaction_label</code>.
        </li>
      </ol>
      <p className="analytics-source">
        Missing configuration: {missing.join(", ")}. The G- measurement ID is
        different from the numeric property ID. Never paste credentials into the
        website editor.
      </p>
    </section>
  );
}
function Trend({ data }) {
  const [focus, setFocus] = useState(null);
  const [metric, setMetric] = useState("totalUsers");
  const max = Math.max(1, ...data.map((row) => row[metric]));
  const x = (i) => 48 + (i / Math.max(1, data.length - 1)) * 700;
  const y = (value) => 215 - (value / max) * 175;
  const points = data.map((row, i) => `${x(i)},${y(row[metric])}`).join(" ");
  const selected = data[focus ?? data.length - 1];
  return (
    <section className="dashboard-card analytics-trend">
      <div className="analytics-card-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h2>Audience over time</h2>
        </div>
        <div className="analytics-segment" aria-label="Chart metric">
          {[
            ["totalUsers", "Visitors"],
            ["screenPageViews", "Page views"],
            ["sessions", "Visits"],
          ].map(([key, label]) => (
            <button
              key={key}
              aria-pressed={metric === key}
              onClick={() => setMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="analytics-chart-value" aria-live="polite">
        <strong>{count(selected?.[metric])}</strong> on {selected?.dateLabel}
      </p>
      <svg
        viewBox="0 0 790 250"
        role="img"
        aria-label={`${metric === "totalUsers" ? "Visitors" : metric === "sessions" ? "Visits" : "Page views"} by day. Exact values are in the daily data table below.`}
      >
        {[0, 0.5, 1].map((f) => (
          <g key={f}>
            <line
              x1="48"
              x2="755"
              y1={y(max * f)}
              y2={y(max * f)}
              className="chart-grid"
            />
            <text x="37" y={y(max * f) + 4} textAnchor="end">
              {count(max * f)}
            </text>
          </g>
        ))}
        <polygon points={`48,215 ${points} 748,215`} className="chart-area" />
        <polyline points={points} className="chart-line" />
        {data.map((row, i) => (
          <circle
            key={row.dateLabel}
            cx={x(i)}
            cy={y(row[metric])}
            r={focus === i ? 6 : 3}
            className="chart-point"
            tabIndex="0"
            role="button"
            aria-label={`${row.dateLabel}: ${count(row[metric])}`}
            onFocus={() => setFocus(i)}
            onMouseEnter={() => setFocus(i)}
            onClick={() => setFocus(i)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setFocus(i);
              }
            }}
          >
            <title>
              {row.dateLabel}: {count(row[metric])}
            </title>
          </circle>
        ))}
        {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i) => (
          <text
            key={i}
            x={x(i)}
            y="242"
            textAnchor={
              i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"
            }
          >
            {data[i]?.dateLabel.slice(5)}
          </text>
        ))}
      </svg>
      <details className="analytics-data">
        <summary>View daily data</summary>
        <div className="analytics-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Visitors</th>
                <th>Page views</th>
                <th>Visits</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.dateLabel}>
                  <th scope="row">{row.dateLabel}</th>
                  <td>{count(row.totalUsers)}</td>
                  <td>{count(row.screenPageViews)}</td>
                  <td>{count(row.sessions)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
function Breakdown({ title, subtitle, data, dimension, metric }) {
  const max = Math.max(1, ...data.map((row) => row[metric]));
  return (
    <section className="dashboard-card analytics-breakdown">
      <div className="analytics-card-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
      {!data.length ? (
        <Empty />
      ) : (
        <ol>
          {data.slice(0, 8).map((row, i) => (
            <li key={row[dimension]}>
              <span className="analytics-rank">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="analytics-bar-label">
                  <span>{row[dimension]}</span>
                  <strong>{count(row[metric])}</strong>
                </div>
                <div className="analytics-track">
                  <span style={{ width: `${(row[metric] / max) * 100}%` }} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}
      {data.length > 8 && (
        <p className="analytics-source">
          Top 8 shown. Export includes all returned rows.
        </p>
      )}
    </section>
  );
}
function Devices({ data }) {
  const total = data.reduce((sum, row) => sum + row.sessions, 0);
  let offset = 0;
  return (
    <section className="dashboard-card analytics-devices">
      <div className="analytics-card-heading">
        <div>
          <h2>Devices</h2>
          <p>Share of visits</p>
        </div>
      </div>
      {!total ? (
        <Empty />
      ) : (
        <div className="analytics-device-layout">
          <svg
            viewBox="0 0 160 160"
            role="img"
            aria-label="Device visit distribution"
          >
            {data.map((row, i) => {
              const share = (row.sessions / total) * 100;
              const start = offset;
              offset += share;
              return (
                <circle
                  key={row.deviceCategory}
                  cx="80"
                  cy="80"
                  r="60"
                  fill="none"
                  strokeWidth="20"
                  pathLength="100"
                  strokeDasharray={`${share} ${100 - share}`}
                  strokeDashoffset={-start}
                  transform="rotate(-90 80 80)"
                  className={`device-color-${i % 3}`}
                >
                  <title>
                    {row.deviceCategory}: {percent(share / 100)}
                  </title>
                </circle>
              );
            })}
            <text x="80" y="78" textAnchor="middle" className="donut-total">
              {count(total)}
            </text>
            <text x="80" y="98" textAnchor="middle">
              visits
            </text>
          </svg>
          <ul>
            {data.map((row, i) => (
              <li key={row.deviceCategory}>
                <span>
                  <i className={`device-dot-${i % 3}`} />
                  {row.deviceCategory}
                </span>
                <strong>{percent(row.sessions / total)}</strong>
                <small>{count(row.sessions)} visits</small>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
function Scroll({ data }) {
  const [path, setPath] = useState("all");
  const filtered = data.filter(
    (row) => path === "all" || row.pagePath === path,
  );
  const steps = [25, 50, 75, 90].map((depth) => ({
    depth,
    count: filtered
      .filter((row) => row.eventName === `portfolio_scroll_${depth}`)
      .reduce((sum, row) => sum + row.eventCount, 0),
  }));
  const max = Math.max(1, ...steps.map((row) => row.count));
  return (
    <section className="dashboard-card analytics-scroll">
      <div className="analytics-card-heading">
        <div>
          <h2>How far people explore</h2>
          <p>Recorded scroll milestones</p>
        </div>
        <select
          aria-label="Scroll depth page"
          value={path}
          onChange={(e) => setPath(e.target.value)}
        >
          <option value="all">All pages</option>
          <option value="/">Home</option>
          <option value="/about">About</option>
          <option value="/projects">Projects</option>
        </select>
      </div>
      {steps.every((row) => row.count === 0) ? (
        <Empty>
          Scroll milestones will appear after visitors explore the updated
          website and GA4 processes their events.
        </Empty>
      ) : (
        <div className="analytics-scroll-bars">
          {steps.map((row) => (
            <div key={row.depth}>
              <strong>{count(row.count)}</strong>
              <div className="analytics-scroll-track">
                <span style={{ height: `${(row.count / max) * 100}%` }} />
              </div>
              <span>{row.depth}%</span>
            </div>
          ))}
        </div>
      )}
      <p className="analytics-source">
        Each milestone is recorded once per page load. Counts are events, not
        unique people or a conversion funnel. Short pages can reach every
        milestone without scrolling.
      </p>
    </section>
  );
}
function csvCell(value) {
  const text = String(value ?? "");
  return (
    '"' +
    (/^[=+\-@\t\r]/.test(text) ? "'" : "") +
    text.replaceAll('"', '""') +
    '"'
  );
}
function exportCsv(data) {
  const lines = [["Report", "Dimension", "Metric", "Value"]];
  for (const [section, items, dimension] of [
    ["Current", [data.current], null],
    ["Previous", [data.previous], null],
    ["Daily", data.trend, "dateLabel"],
    ["Pages", data.pages, "pagePath"],
    ["Sources", data.sources, "sessionSourceMedium"],
    ["Devices", data.devices, "deviceCategory"],
    ["Countries", data.countries, "country"],
    ["Events", data.events, "eventName"],
    [
      "Scroll",
      data.scroll.map((row) => ({
        ...row,
        label: `${row.pagePath}: ${row.eventName}`,
      })),
      "label",
    ],
    [
      "Interactions",
      data.details.rows.map((row) => ({
        ...row,
        label: `${row.eventName}: ${row["customEvent:interaction_label"]}`,
      })),
      "label",
    ],
  ])
    for (const row of items)
      for (const [key, value] of Object.entries(row))
        if (typeof value === "number")
          lines.push([
            section,
            dimension ? row[dimension] : data.startDate + " to " + data.endDate,
            key,
            value,
          ]);
  const url = URL.createObjectURL(
    new Blob(
      ["\uFEFF" + lines.map((row) => row.map(csvCell).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    ),
  );
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `portfolio-analytics-${data.startDate}-${data.endDate}.csv`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function Change({ value, previous, rate }) {
  if (!previous && !value) return <small>No change from previous period</small>;
  if (!previous) return <small>No prior activity to compare</small>;
  const delta = rate
    ? (value - previous) * 100
    : ((value - previous) / previous) * 100;
  return (
    <small className="analytics-comparison">
      {delta > 0 ? "↗ +" : delta < 0 ? "↘ " : ""}
      {count(delta)}
      {rate ? " pp" : "%"} vs previous period
    </small>
  );
}
export default function AnalyticsPanel() {
  const [days, setDays] = useState(30);
  const [refresh, setRefresh] = useState(0);
  const [state, setState] = useState({ loading: true });
  const [sort, setSort] = useState("screenPageViews");
  useEffect(() => {
    const controller = new AbortController();
    setState({ loading: true });
    fetch(`/api/admin?action=analytics&days=${days}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok)
          throw new Error(data.error || "Analytics could not be loaded.");
        if (!controller.signal.aborted) setState({ data });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setState({ error: error.message });
      });
    return () => controller.abort();
  }, [days, refresh]);
  const data = state.data;
  const current = data?.current,
    previous = data?.previous;
  const stats = current
    ? [
        [
          "Unique visitors",
          current.totalUsers,
          previous.totalUsers,
          count,
          "GA4 total users across the entire period",
        ],
        [
          "Visits",
          current.sessions,
          previous.sessions,
          count,
          "Sessions started on your public website",
        ],
        [
          "Page views",
          current.screenPageViews,
          previous.screenPageViews,
          count,
          "Includes repeat views of a page",
        ],
        [
          "Engagement rate",
          current.engagementRate,
          previous.engagementRate,
          percent,
          "Share of visits GA4 considers engaged",
          true,
        ],
        [
          "Engaged time / visit",
          ratio(current.userEngagementDuration, current.sessions),
          ratio(previous.userEngagementDuration, previous.sessions),
          duration,
          "Foreground engagement time divided by visits",
        ],
        [
          "Pages / visit",
          ratio(current.screenPageViews, current.sessions),
          ratio(previous.screenPageViews, previous.sessions),
          count,
          "Page views divided by visits",
        ],
        [
          "New visitors",
          current.newUsers,
          previous.newUsers,
          count,
          "Users recorded visiting for the first time",
        ],
        [
          "Average visit duration",
          current.averageSessionDuration,
          previous.averageSessionDuration,
          duration,
          "GA4 average session duration",
        ],
      ]
    : [];
  return (
    <div className="analytics-panel" aria-busy={Boolean(state.loading)}>
      <div className="analytics-toolbar">
        <div className="analytics-period">
          <span className="eyebrow">AUDIENCE & ENGAGEMENT</span>
          <p>
            {data?.configured
              ? `${data.startDate} — ${data.endDate}`
              : "Understand what brings people here, and what keeps them exploring."}
          </p>
        </div>
        <div className="analytics-controls">
          <label>
            Period
            <select
              aria-label="Period"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value={7}>Last 7 complete days</option>
              <option value={30}>Last 30 complete days</option>
              <option value={90}>Last 90 complete days</option>
            </select>
          </label>
          <button
            className="secondary-button"
            disabled={state.loading}
            onClick={() => setRefresh((v) => v + 1)}
          >
            Refresh
          </button>
          <button
            className="secondary-button"
            disabled={!data?.configured || state.loading}
            onClick={() => exportCsv(data)}
          >
            Export CSV
          </button>
        </div>
      </div>
      {state.loading && (
        <div role="status" className="analytics-loading">
          <span className="eyebrow">GOOGLE ANALYTICS</span>
          <p>Bringing your audience into focus…</p>
          <div className="analytics-skeletons">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} />
            ))}
          </div>
        </div>
      )}
      {state.error && (
        <div className="notice error" role="alert">
          <p>{state.error}</p>
          <button
            className="secondary-button"
            onClick={() => setRefresh((v) => v + 1)}
          >
            Try again
          </button>
        </div>
      )}
      {data && !data.configured && <Setup missing={data.missing} />}
      {data?.configured && (
        <>
          <div className="analytics-meta">
            <span>
              <i /> Google Analytics 4 · {data.host}
            </span>
            <span>
              {data.timezone} · Report fetched{" "}
              {new Date(data.generatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <p className="analytics-source">
            Complete days only; today is excluded. Compared with the preceding{" "}
            {days} days. Reports are cached for 5 minutes. GA4 processing can
            take 24–48 hours; blocked tracking is not counted.
          </p>
          {Object.values(data.quality).some(Boolean) && (
            <div className="notice" role="status">
              Data quality:{" "}
              {data.quality.thresholded && "Google may hide low-volume rows. "}
              {data.quality.sampled && "Some results are sampled. "}
              {data.quality.otherRow &&
                "Some dimensions are grouped into (other). "}
              {data.quality.limited &&
                "Breakdowns are limited to the top 100 rows. "}
            </div>
          )}
          {!current.screenPageViews && !current.totalUsers && (
            <div className="analytics-no-data">
              <h2>Your next visit starts the story.</h2>
              <p>
                No traffic was returned for this website and period. Check the
                property, hostname and tracking settings, or allow time for GA4
                processing.
              </p>
            </div>
          )}
          <section
            className="stat-grid analytics-kpis"
            aria-label="Audience metrics"
          >
            {stats.map(([label, value, before, format, hint, rate]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{format(value)}</strong>
                <Change value={value} previous={before} rate={rate} />
                <p>{hint}</p>
              </article>
            ))}
          </section>
          <Trend key={days} data={data.trend} />
          <div className="analytics-grid">
            <Scroll data={data.scroll} />
            <Devices data={data.devices} />
          </div>
          <section className="dashboard-card analytics-pages">
            <div className="analytics-card-heading">
              <div>
                <h2>Pages people spend time with</h2>
                <p>Compare reach, repeat views and foreground engagement.</p>
              </div>
              <label>
                Sort by
                <select value={sort} onChange={(e) => setSort(e.target.value)}>
                  <option value="screenPageViews">Page views</option>
                  <option value="totalUsers">Visitors</option>
                  <option value="userEngagementDuration">Engaged time</option>
                </select>
              </label>
            </div>
            {!data.pages.length ? (
              <Empty />
            ) : (
              <div className="analytics-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Page</th>
                      <th>Views</th>
                      <th>Visitors</th>
                      <th>Engaged time</th>
                      <th>Time / visitor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...data.pages]
                      .sort((a, b) => b[sort] - a[sort])
                      .map((row) => (
                        <tr key={row.pagePath}>
                          <th scope="row">
                            {row.pagePath === "/" ? "Home /" : row.pagePath}
                          </th>
                          <td>{count(row.screenPageViews)}</td>
                          <td>{count(row.totalUsers)}</td>
                          <td>{duration(row.userEngagementDuration)}</td>
                          <td>
                            {duration(
                              ratio(row.userEngagementDuration, row.totalUsers),
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <div className="analytics-grid">
            <Breakdown
              title="Where visits come from"
              subtitle="Source / medium · visits"
              data={data.sources}
              dimension="sessionSourceMedium"
              metric="sessions"
            />
            <Breakdown
              title="Your audience around the world"
              subtitle="Country · visitors"
              data={data.countries}
              dimension="country"
              metric="totalUsers"
            />
          </div>
          <section className="dashboard-card analytics-interactions">
            <div className="analytics-card-heading">
              <div>
                <span className="eyebrow">BEYOND THE PAGE VIEW</span>
                <h2>Intent & interactions</h2>
                <p>What people choose to explore next.</p>
              </div>
            </div>
            <div className="analytics-action-grid">
              {Object.entries(eventNames).map(([name, label]) => {
                const event = data.events.find((row) => row.eventName === name);
                return (
                  <article key={name}>
                    <span>{label}</span>
                    <strong>{count(event?.eventCount)}</strong>
                    <small>{count(event?.totalUsers)} visitors</small>
                  </article>
                );
              })}
            </div>
            <p className="analytics-source">
              Clicks measure intent, not completed enquiries or sales. New
              events begin after deployment and do not backfill earlier visits.
            </p>
            {!data.details.available ? (
              <p className="notice">{data.details.message}</p>
            ) : !data.details.rows.length ? (
              <Empty>No named interactions recorded yet.</Empty>
            ) : (
              <div className="analytics-table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Interaction</th>
                      <th>Project / label</th>
                      <th>Clicks</th>
                      <th>Visitors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.details.rows.map((row, i) => (
                      <tr key={i}>
                        <td>{eventNames[row.eventName] || row.eventName}</td>
                        <th scope="row">
                          {row["customEvent:interaction_label"]}
                        </th>
                        <td>{count(row.eventCount)}</td>
                        <td>{count(row.totalUsers)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          <details className="dashboard-card analytics-glossary">
            <summary>How to read these numbers</summary>
            <dl>
              <dt>Visitors and visits</dt>
              <dd>
                Visitors are GA4’s estimated distinct users, not identified
                people. One visitor can make several visits. Daily and
                page-level visitor counts overlap; do not add them to get period
                uniques.
              </dd>
              <dt>Engagement</dt>
              <dd>
                An engaged visit lasts more than 10 seconds, includes a key
                event, or has at least two page/screen views, subject to your
                GA4 settings. Foreground time differs from total visit duration.
              </dd>
              <dt>Scope and privacy</dt>
              <dd>
                These reports include the published hostname’s Home, About and
                Projects pages. Admin pages and embedded previews are excluded
                from new tracking. No individual visitor identities are shown.
                Tracking blockers, consent choices and GA4 thresholds can reduce
                totals.
              </dd>
              <dt>Freshness</dt>
              <dd>
                Reports end yesterday in the property’s time zone. Recently
                processed data can change. Refresh uses the server’s five-minute
                cache.
              </dd>
            </dl>
          </details>
        </>
      )}
    </div>
  );
}
