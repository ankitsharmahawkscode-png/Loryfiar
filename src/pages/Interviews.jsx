import React, { useEffect, useState, useCallback } from "react";
import "./tokens.css";
import "./Interviews.css";
import { fetchInterviews } from "../api";

const OUTCOME_TABS = [
  { key: "", label: "All Interviews" },
  { key: "success", label: "Successful startup" },
  { key: "failed", label: "Failed startup" },
];

function initials(name) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const Interviews = () => {
  const [outcome, setOutcome] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [country, setCountry] = useState("");
  const [revenue, setRevenue] = useState("");
  const [causeOfFailure, setCauseOfFailure] = useState("");

  const [results, setResults] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    categories: [],
    countries: [],
    revenues: [],
    causesOfFailure: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchInterviews({
        search,
        category,
        country,
        outcome,
        causeOfFailure,
        revenue,
      });
      setResults(data.results);
      setFilterOptions(data.filters);
    } catch (e) {
      setError("Couldn't load interviews. Is the API running?");
    } finally {
      setLoading(false);
    }
  }, [search, category, country, outcome, causeOfFailure, revenue]);

  useEffect(() => {
    const t = setTimeout(load, 200); // debounce search/filter changes
    return () => clearTimeout(t);
  }, [load]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setCountry("");
    setRevenue("");
    setCauseOfFailure("");
  };

  const hasActiveFilters =
    search || category || country || revenue || causeOfFailure;

  return (
    <main className="page interviews-page">
      <div className="interviews-hero">
        <div className="interviews-hero-copy">
          <h1 className="page-title">Interviews</h1>
          <p className="page-dek">
            +200 interviews with the brains behind failed and successful
            startups. Learn from their wins and their mistakes and become a
            better founder.
          </p>
        </div>

        <div className="newsletter-card">
          <h2>
            The <u>All-In-One</u> Newsletter for Startup Founders
          </h2>
          <p>
            90% of startups fail. Learn how to not to with our weekly guides
            and stories. <strong>Join 40,000+ founders.</strong>
          </p>
          <input type="email" placeholder="Enter your email" />
          <button type="button">Subscribe For Free →</button>
        </div>
      </div>

      <div className="interviews-body">
        <aside className="interviews-sidebar">
          <div className="outcome-tabs">
            {OUTCOME_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`outcome-tab outcome-${tab.key || "all"} ${
                  outcome === tab.key ? "active" : ""
                }`}
                onClick={() => setOutcome(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <input
            className="sidebar-search"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Category</option>
            {filterOptions.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">Country</option>
            {filterOptions.countries.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select value={revenue} onChange={(e) => setRevenue(e.target.value)}>
            <option value="">Revenue</option>
            {filterOptions.revenues.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <select
            value={causeOfFailure}
            onChange={(e) => setCauseOfFailure(e.target.value)}
          >
            <option value="">Cause of failure</option>
            {filterOptions.causesOfFailure.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button type="button" className="clear-filters" onClick={clearFilters}>
              Clear ✕
            </button>
          )}
        </aside>

        <section className="interviews-list">
          {loading && <p className="interviews-status">Loading interviews…</p>}
          {!loading && error && <p className="interviews-status error">{error}</p>}
          {!loading && !error && results.length === 0 && (
            <p className="interviews-status">No interviews match those filters.</p>
          )}

          {!loading &&
            !error &&
            results.map((item) => (
              <article
                key={item.id}
                className="interview-card"
                role="link"
                tabIndex={0}
                onClick={() => {
                  window.history.pushState({}, "", `/interviews/${item.id}`);
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    window.history.pushState({}, "", `/interviews/${item.id}`);
                    window.dispatchEvent(new PopStateEvent("popstate"));
                  }
                }}
              >
                <h2>{item.title}</h2>
                <div className="interview-tags">
                  <span
                    className={`outcome-badge ${
                      item.outcome === "failed" ? "badge-failed" : "badge-success"
                    }`}
                  >
                    {item.outcome === "failed" ? "✕" : "✓"}
                  </span>
                  {item.category && <span className="tag">{item.category}</span>}
                  {item.country && <span className="tag">{item.country}</span>}
                  {item.causeOfFailure && (
                    <span className="tag">{item.causeOfFailure}</span>
                  )}
                  {item.revenue && <span className="tag">{item.revenue}</span>}
                </div>
                <div className="interview-byline">
                  {item.avatar ? (
                    <img
                      className="avatar avatar-img"
                      src={item.avatar}
                      alt={item.founder}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.nextSibling.style.display = "flex";
                      }}
                    />
                  ) : null}
                  <div
                    className="avatar"
                    style={{ display: item.avatar ? "none" : "flex" }}
                  >
                    {initials(item.founder)}
                  </div>
                  <div>
                    <div className="founder-name">{item.founder}</div>
                    <time>{formatDate(item.date)}</time>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </div>
    </main>
  );
};

export default Interviews;