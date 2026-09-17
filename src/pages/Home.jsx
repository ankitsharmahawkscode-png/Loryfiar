import React from "react";
import "./tokens.css";
import "./Home.css";

const recentInterviews = [
  {
    name: "Priya Raman",
    role: "Founder, three companies, two shutdowns",
    excerpt:
      "I didn't lose the company because the idea was wrong. I lost it because I kept the wrong hire for eleven months after I knew.",
  },
  {
    name: "Devon Okafor",
    role: "Ex-CTO, acqui-hired twice",
    excerpt:
      "Every board meeting for a year, someone asked about runway instead of customers. That's the real postmortem, before the postmortem.",
  },
];

const recentGraves = [
  { name: "Huddlebox", died: "2023", cause: "Ran out of runway" },
  { name: "Ferrycart", died: "2022", cause: "Acquihired, shut down" },
  { name: "Notionale", died: "2024", cause: "Founder dispute" },
];

const recentPosts = [
  { title: "The slow deaths take longer to write about", date: "Sep 2, 2026" },
  { title: "What a term sheet doesn't tell you about your cofounder", date: "Aug 21, 2026" },
  { title: "Nobody churns for the reason they say", date: "Aug 9, 2026" },
];

const Home = () => {
  return (
    <main className="page home-page">
      <section className="home-hero">
        <p className="page-kicker">Vol. 4 — an ongoing record</p>
        <h1 className="page-title">
          Startups fail for specific reasons. We write those reasons down.
        </h1>
        <p className="page-dek">
          Loryfiar is an archive of founder interviews, shut-down products,
          and the small decisions that decided both. No inspiration, no
          eulogies — just the record.
        </p>
      </section>

      <hr className="rule" />

      <section className="home-section">
        <div className="home-section-head">
          <h2>Latest interviews</h2>
          <a href="/interviews">All interviews</a>
        </div>
        <div className="home-interview-grid">
          {recentInterviews.map((p) => (
            <article key={p.name} className="home-interview-card">
              <h3>{p.name}</h3>
              <p className="home-interview-role">{p.role}</p>
              <p className="home-interview-excerpt">&ldquo;{p.excerpt}&rdquo;</p>
            </article>
          ))}
        </div>
      </section>

      <hr className="rule" />

      <section className="home-section">
        <div className="home-section-head">
          <h2>Recently buried</h2>
          <a href="/graveyard">Visit the graveyard</a>
        </div>
        <ul className="home-grave-list">
          {recentGraves.map((g) => (
            <li key={g.name}>
              <span className="home-grave-name">{g.name}</span>
              <span className="home-grave-year">{g.died}</span>
              <span className="home-grave-cause">{g.cause}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className="rule" />

      <section className="home-section">
        <div className="home-section-head">
          <h2>From the blog</h2>
          <a href="/blog">All posts</a>
        </div>
        <ul className="home-post-list">
          {recentPosts.map((post) => (
            <li key={post.title}>
              <span>{post.title}</span>
              <time>{post.date}</time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;