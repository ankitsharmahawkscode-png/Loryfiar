import React from "react";
import "./tokens.css";
import "./Blog.css";

const posts = [
  {
    title: "The slow deaths take longer to write about",
    date: "Sep 2, 2026",
    tag: "Essay",
    excerpt:
      "A company that fails in a week gives you a clean story. A company that fails over three years gives you forty small stories, and most founders only remember the last one.",
  },
  {
    title: "What a term sheet doesn't tell you about your cofounder",
    date: "Aug 21, 2026",
    tag: "Field notes",
    excerpt:
      "Vesting schedules are a legal document about trust. Almost nobody reads them that way until the trust is gone.",
  },
  {
    title: "Nobody churns for the reason they say",
    date: "Aug 9, 2026",
    tag: "Essay",
    excerpt:
      "'Too expensive' is what a customer says when the real answer is harder to admit: they never got their team to actually use it.",
  },
  {
    title: "Runway math everyone gets wrong in year two",
    date: "Jul 30, 2026",
    tag: "Field notes",
    excerpt:
      "Burn multiple looks fine in a spreadsheet right up until the month payroll includes a severance line you didn't plan for.",
  },
  {
    title: "The pivot that was actually just quitting slowly",
    date: "Jul 12, 2026",
    tag: "Essay",
    excerpt:
      "Some pivots are strategy. Others are a six-month, well-documented way of not having to say the first idea didn't work.",
  },
];

const Blog = () => {
  return (
    <main className="page blog-page">
      <p className="page-kicker">Field notes and essays</p>
      <h1 className="page-title">Blog</h1>
      <p className="page-dek">
        Short, specific writing about the mechanics of building and losing
        companies — pulled from interviews, cap tables, and the occasional
        argument in a group chat.
      </p>
      <hr className="rule" />

      <ul className="blog-list">
        {posts.map((post) => (
          <li key={post.title} className="blog-item">
            <div className="blog-item-meta">
              <span className="blog-item-tag">{post.tag}</span>
              <time>{post.date}</time>
            </div>
            <h2 className="blog-item-title">{post.title}</h2>
            <p className="blog-item-excerpt">{post.excerpt}</p>
          </li>
        ))}
      </ul>
    </main>
  );
};

export default Blog;