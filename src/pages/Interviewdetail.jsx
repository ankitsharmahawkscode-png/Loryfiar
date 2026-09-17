import React, { useEffect, useState } from "react";
import "./tokens.css";
import "./InterviewDetail.css";
import { fetchInterview, fetchRelatedInterviews } from "../api";

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

function goTo(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

const InterviewDetail = ({ id }) => {
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setItem(null);
    window.scrollTo(0, 0);

    fetchInterview(id)
      .then((data) => {
        if (cancelled) return;
        setItem(data);
        return fetchRelatedInterviews(id);
      })
      .then((rel) => {
        if (cancelled || !rel) return;
        setRelated(rel.results);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this interview.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="detail-page">
        <div className="page">
          <p className="interviews-status">Loading interview…</p>
        </div>
      </main>
    );
  }

  if (error || !item) {
    return (
      <main className="detail-page">
        <div className="page">
          <p className="interviews-status error">
            {error || "That interview couldn't be found."}
          </p>
          <button className="back-link" onClick={() => goTo("/interviews")}>
            ← Back to Interviews
          </button>
        </div>
      </main>
    );
  }

  const isFailed = item.outcome === "failed";

  return (
    <main className="detail-page">
      {/* Hero band */}
      <div className={`detail-hero ${isFailed ? "hero-failed" : "hero-success"}`}>
        <div className="page detail-hero-inner">
          <button className="back-link" onClick={() => goTo("/interviews")}>
            ← Back to Interviews
          </button>

          <p className="detail-kicker">
            Interview with a {isFailed ? "Failed" : "Successful"} Startup Founder
          </p>

          <h1 className="detail-title">{item.title}</h1>

          <div className="detail-byline">
            {item.avatar ? (
              <img
                className="avatar avatar-img avatar-lg"
                src={item.avatar}
                alt={item.founder}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className="avatar avatar-lg"
              style={{ display: item.avatar ? "none" : "flex" }}
            >
              {initials(item.founder)}
            </div>
            <div>
              <div className="founder-name">{item.founder}</div>
              <time>{formatDate(item.date)}</time>
            </div>
          </div>

       <div className="detail-stat-row">
  {item.category && (
    <div className="detail-stat-box">
      <i className="fa-solid fa-folder detail-stat-icon" aria-hidden="true" />
      <span>{item.category}</span>
    </div>
  )}
  {item.country && (
    <div className="detail-stat-box">
      <i className="fa-solid fa-globe detail-stat-icon" aria-hidden="true" />
      <span>{item.country}</span>
    </div>
  )}
  {item.revenue && (
    <div className="detail-stat-box">
      <i className="fa-solid fa-dollar-sign detail-stat-icon" aria-hidden="true" />
      <span>{item.revenue}</span>
    </div>
  )}
  {isFailed && item.causeOfFailure && (
    <div className="detail-stat-box">
      <i className="fa-solid fa-xmark detail-stat-icon" aria-hidden="true" />
      <span>{item.causeOfFailure}</span>
    </div>
  )}
</div>
        </div>
      </div>

      {/* Body + newsletter side by side */}
      <div className="page detail-body-layout">
        <article className="detail-article">
          {item.excerpt && <p className="detail-excerpt">{item.excerpt}</p>}

          <div className="detail-body">
            {(item.body || "This interview doesn't have a full write-up yet.")
              .split("\n\n")
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
          </div>
        </article>

        <aside className="newsletter-card detail-newsletter">
          <h2>
            The <u>All-In-One</u> Newsletter for Startup Founders
          </h2>
          <p>
            90% of startups fail. Learn how to not to with our weekly guides
            and stories. <strong>Join 40,000+ founders.</strong>
          </p>
          <input type="email" placeholder="Enter your email" />
          <button type="button">Subscribe For Free →</button>
        </aside>
      </div>

      {related.length > 0 && (
        <div className="page">
          <section className="detail-related">
            <h2>Related interviews</h2>
            <div className="detail-related-grid">
              {related.map((r) => (
                <button
                  key={r.id}
                  className="related-card"
                  onClick={() => goTo(`/interviews/${r.id}`)}
                >
                  <h3>{r.title}</h3>
                  <p>{r.founder}</p>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

export default InterviewDetail;