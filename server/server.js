const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const app = express();
const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, "data.json");
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "loryfiar-admin";

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ---------- issues (newsletter "Latest Issues") ----------

function seedIssues() {
  const now = (d) => new Date(d).toISOString();
  return [
    {
      id: randomUUID(),
      title: "The One-Hour Home",
      description: "How Pallet's fast cabins entered a painfully slow system",
      image: "",
      url: "https://newsletter.example.com/p/the-one-hour-home",
      date: now("2026-09-10"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "Outspent and Outdelivered",
      description: "How a local grocery survivor faced billion-dollar rivals",
      image: "",
      url: "https://newsletter.example.com/p/outspent-and-outdelivered",
      date: now("2026-09-03"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "Electricity Through Thin Air",
      description: "The startup that charged devices across entire rooms.",
      image: "",
      url: "https://newsletter.example.com/p/electricity-through-thin-air",
      date: now("2026-08-27"),
      published: true,
    },
  ];
}

// ---------- blog posts ----------

function seedPosts() {
  const now = (d) => new Date(d).toISOString();
  return [
    {
      id: randomUUID(),
      title: "The slow deaths take longer to write about",
      tag: "Essay",
      excerpt:
        "A company that fails in a week gives you a clean story. A company that fails over three years gives you forty small stories, and most founders only remember the last one.",
      body: "A company that fails in a week gives you a clean story. There's a villain, a moment, a lesson. A company that fails over three years gives you forty small stories, and most founders only remember the last one.\n\nThe slow deaths are harder to write about because there's no single moment to point to. It's a hire that didn't work out, then a product decision that seemed reasonable at the time, then a competitor that moved faster, then a founder who stopped enjoying the work six months before anyone else noticed.\n\nIf you're in the middle of one of these right now, the hardest part isn't any single decision. It's recognizing that the sum of small, defensible choices can still add up to the wrong outcome.",
      date: now("2026-09-02"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "What a term sheet doesn't tell you about your cofounder",
      tag: "Field notes",
      excerpt:
        "Vesting schedules are a legal document about trust. Almost nobody reads them that way until the trust is gone.",
      body: "Vesting schedules are a legal document about trust. Almost nobody reads them that way until the trust is gone.\n\nWhen two founders sit down to split equity, the conversation is almost always about fairness in the present tense: who came up with the idea, who's quitting their job first, who's put in money already. Nobody wants to talk about what happens if one of you leaves in month eight.\n\nThe founders who negotiate this well aren't the ones who trust each other less. They're the ones who understand that trust and paperwork solve different problems.",
      date: now("2026-08-21"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "Nobody churns for the reason they say",
      tag: "Essay",
      excerpt:
        "'Too expensive' is what a customer says when the real answer is harder to admit: they never got their team to actually use it.",
      body: "\"Too expensive\" is what a customer says when the real answer is harder to admit: they never got their team to actually use it.\n\nPrice is the easiest reason to give, because it doesn't require explaining that the rollout stalled, or that the champion who bought the product left the company, or that three other tools were already doing 80% of the job badly and nobody wanted to admit it.\n\nIf you take churn reasons at face value, you'll spend a year cutting prices for a retention problem that was never about price.",
      date: now("2026-08-09"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "Runway math everyone gets wrong in year two",
      tag: "Field notes",
      excerpt:
        "Burn multiple looks fine in a spreadsheet right up until the month payroll includes a severance line you didn't plan for.",
      body: "Burn multiple looks fine in a spreadsheet right up until the month payroll includes a severance line you didn't plan for.\n\nMost early financial models assume headcount only grows. By year two, almost nobody's does — someone gets let go, someone gets a package, someone's replacement overlaps with them for a month. None of that shows up in the tidy model from the seed round.\n\nThe founders who don't get surprised keep a running \"messy reality\" buffer in their runway math, separate from the clean plan they show investors.",
      date: now("2026-07-30"),
      published: true,
    },
    {
      id: randomUUID(),
      title: "The pivot that was actually just quitting slowly",
      tag: "Essay",
      excerpt:
        "Some pivots are strategy. Others are a six-month, well-documented way of not having to say the first idea didn't work.",
      body: "Some pivots are strategy. Others are a six-month, well-documented way of not having to say the first idea didn't work.\n\nThe difference is usually visible in how the team talks about the old product. A real pivot treats the old product as a data point — useful, informative, done. A pivot-as-avoidance treats it as a wound nobody wants to look at directly, so the team keeps building \"adjacent\" things that never quite require an honest post-mortem.\n\nIf you can't say out loud what didn't work and why, you're probably not pivoting yet. You're stalling.",
      date: now("2026-07-12"),
      published: true,
    },
  ];
}

// ---------- storage ----------

function readDB() {
  if (!fs.existsSync(DB_FILE)) {
    const seed = {
      interviews: seedInterviews(),
      issues: seedIssues(),
      posts: seedPosts(),
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2));
    return seed;
  }
  const db = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
  let changed = false;
  if (!db.issues) {
    db.issues = seedIssues();
    changed = true;
  }
  if (!db.posts) {
    db.posts = seedPosts();
    changed = true;
  }
  if (changed) writeDB(db);
  return db;
}

function writeDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function seedInterviews() {
  const now = (d) => new Date(d).toISOString();
  return [
    {
      id: randomUUID(),
      title: "Founder's Insights on Scaling a B2B API Fintech Product",
      founder: "Andrey Korchak",
      avatar: "",
      outcome: "success", // "success" | "failed"
      category: "Finances",
      country: "Germany",
      revenue: "$25k-$50k/mo",
      causeOfFailure: "",
      date: now("2023-12-07"),
      published: true,
      excerpt:
        "How a small team scaled a B2B fintech API to profitability without a large sales team.",
      body: "When we started, everyone told us B2B fintech needed a big enterprise sales team from day one. We didn't have the capital for that, so we built the product to sell itself through documentation and a generous free tier.\n\nThe turning point came about eight months in. We stopped trying to close six-figure enterprise deals and focused entirely on developers who could integrate in an afternoon. Revenue was smaller per account, but volume made up for it, and churn dropped because nobody was locked into a long sales cycle they didn't choose.\n\nIf I were starting over, I'd make that call in month two, not month eight. The lesson cost us six months of runway we didn't need to spend.",
    },
    {
      id: randomUUID(),
      title: "Founder's Journey to Revolutionize the Travel Industry",
      founder: "Ivan Saprov",
      avatar: "",
      outcome: "success",
      category: "Travel",
      country: "United States",
      revenue: "$10k-$25k/mo",
      causeOfFailure: "",
      date: now("2023-11-17"),
      published: true,
      excerpt:
        "Building a travel planning tool around slow, deliberate itineraries instead of one-click bookings.",
      body: "Every competitor was racing toward faster checkout. We went the other way and built for people who wanted to spend an evening actually planning a trip.\n\nIt looked like a mistake for the first year. Growth was slow, and investors kept asking why we weren't optimizing conversion the way every other travel app does. But the users we did get stayed, and they told their friends, because the product respected the fact that planning a trip is part of the fun.\n\nWe're still small compared to the big players, but we're profitable and we control our own roadmap. That trade felt worth it.",
    },
    {
      id: randomUUID(),
      title: "How Crypto Hype Misled A Startup From Solving Real Problems",
      founder: "Dennis Ramírez Bernal",
      avatar: "",
      outcome: "failed",
      category: "Finances",
      country: "Spain",
      revenue: "$0-$10k/mo",
      causeOfFailure: "No Market Need",
      date: now("2023-10-18"),
      published: true,
      excerpt:
        "Chasing a crypto trend meant we never validated whether anyone actually needed the underlying product.",
      body: "We started with a real problem: small merchants struggling with cross-border payment fees. Then crypto got hot, and we rebuilt the entire pitch around blockchain settlement instead of just solving the fee problem directly.\n\nWe spent four months building infrastructure nobody asked for. When we finally showed it to merchants, most of them didn't care about the technology at all — they just wanted lower fees and faster payouts, which we could have shipped in a fraction of the time without touching crypto.\n\nThe hype cost us our runway. We shut down with a product that was technically impressive and commercially irrelevant.",
    },
    {
      id: randomUUID(),
      title: "An Agency Founder's Journey from $24K MRR to Zero",
      founder: "Mat Sherman",
      avatar: "",
      outcome: "failed",
      category: "Services",
      country: "United States",
      revenue: "$10k-$25k/mo",
      causeOfFailure: "Lack of Focus",
      date: now("2023-09-12"),
      published: true,
      excerpt:
        "We said yes to every kind of client work until none of it looked like a real business anymore.",
      body: "At our peak we were doing $24K MRR across web design, SEO, paid ads, and a bit of consulting we backed into almost by accident. It felt like momentum. It was actually four different businesses wearing one name.\n\nEvery client wanted something slightly different, so nothing was repeatable. We couldn't hire effectively because there was no single playbook to train someone on. When our two biggest clients left within the same month, there was no systematized pipeline behind them to fall back on.\n\nWe went from $24K MRR to zero in about ten weeks. The agency didn't fail because the work was bad — it failed because it was never really one thing.",
    },
    {
      id: randomUUID(),
      title: "Spending $95K to Build a Product With No Demand",
      founder: "Sarah Klein",
      avatar: "",
      outcome: "failed",
      category: "Entertainment",
      country: "United States",
      revenue: "$0-$10k/mo",
      causeOfFailure: "No Market Need",
      date: now("2023-08-30"),
      published: true,
      excerpt:
        "We built for eighteen months based on what we assumed people wanted, and never tested the core assumption.",
      body: "We raised a small friends-and-family round and spent almost all of it — about $95K — before we put anything in front of a real user. In hindsight, that sentence alone explains what went wrong.\n\nThe idea sounded good in every conversation we had with each other. Nobody outside the founding team ever validated that they'd actually use it, let alone pay for it. When we finally launched, we got polite interest and almost no retention.\n\nThe hardest part wasn't losing the money. It was realizing that a two-week test with a landing page and some outreach would have told us the same thing eighteen months and $95K earlier.",
    },
  ];
}

// ---------- auth middleware for admin-only writes ----------

function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// ---------- public read routes ----------

// GET /api/interviews?search=&category=&country=&outcome=&causeOfFailure=&revenue=
app.get("/api/interviews", (req, res) => {
  const db = readDB();
  const {
    search = "",
    category,
    country,
    outcome,
    causeOfFailure,
    revenue,
  } = req.query;

  let results = db.interviews.filter((i) => i.published);

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.founder.toLowerCase().includes(q)
    );
  }
  if (category) results = results.filter((i) => i.category === category);
  if (country) results = results.filter((i) => i.country === country);
  if (outcome) results = results.filter((i) => i.outcome === outcome);
  if (causeOfFailure)
    results = results.filter((i) => i.causeOfFailure === causeOfFailure);
  if (revenue) results = results.filter((i) => i.revenue === revenue);

  results = [...results].sort((a, b) => new Date(b.date) - new Date(a.date));

  res.json({
    results,
    total: results.length,
    filters: buildFilterOptions(db.interviews),
  });
});

app.get("/api/interviews/:id", (req, res) => {
  const db = readDB();
  const item = db.interviews.find((i) => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

// Related interviews (same category or country, excluding itself)
app.get("/api/interviews/:id/related", (req, res) => {
  const db = readDB();
  const current = db.interviews.find((i) => i.id === req.params.id);
  if (!current) return res.status(404).json({ error: "Not found" });
  const related = db.interviews
    .filter((i) => i.id !== current.id && i.published)
    .filter(
      (i) => i.category === current.category || i.country === current.country
    )
    .slice(0, 3);
  res.json({ results: related });
});

function buildFilterOptions(all) {
  const uniq = (key) => [...new Set(all.map((i) => i[key]).filter(Boolean))];
  return {
    categories: uniq("category"),
    countries: uniq("country"),
    revenues: uniq("revenue"),
    causesOfFailure: uniq("causeOfFailure"),
  };
}

// ---------- admin routes (require token) ----------

// Admin list — includes unpublished
app.get("/api/admin/interviews", requireAdmin, (req, res) => {
  const db = readDB();
  const results = [...db.interviews].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  res.json({ results, total: results.length });
});

app.post("/api/admin/interviews", requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body || {};
  if (!body.title || !body.founder) {
    return res.status(400).json({ error: "title and founder are required" });
  }
  const item = {
    id: randomUUID(),
    title: body.title,
    founder: body.founder,
    avatar: body.avatar || "",
    outcome: body.outcome === "failed" ? "failed" : "success",
    category: body.category || "",
    country: body.country || "",
    revenue: body.revenue || "",
    causeOfFailure: body.causeOfFailure || "",
    date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    published: body.published !== false,
    excerpt: body.excerpt || "",
    body: body.body || "",
  };
  db.interviews.unshift(item);
  writeDB(db);
  res.status(201).json(item);
});

app.put("/api/admin/interviews/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.interviews.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const existing = db.interviews[idx];
  const body = req.body || {};
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    date: body.date ? new Date(body.date).toISOString() : existing.date,
  };
  db.interviews[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete("/api/admin/interviews/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.interviews.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const [removed] = db.interviews.splice(idx, 1);
  writeDB(db);
  res.json(removed);
});

// ---------- issues routes ----------

app.get("/api/issues", (req, res) => {
  const db = readDB();
  const results = db.issues
    .filter((i) => i.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ results });
});

app.get("/api/admin/issues", requireAdmin, (req, res) => {
  const db = readDB();
  const results = [...db.issues].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  res.json({ results });
});

app.post("/api/admin/issues", requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body || {};
  if (!body.title || !body.url) {
    return res.status(400).json({ error: "title and url are required" });
  }
  const item = {
    id: randomUUID(),
    title: body.title,
    description: body.description || "",
    image: body.image || "",
    url: body.url,
    date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    published: body.published !== false,
  };
  db.issues.unshift(item);
  writeDB(db);
  res.status(201).json(item);
});

app.put("/api/admin/issues/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.issues.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const existing = db.issues[idx];
  const body = req.body || {};
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    date: body.date ? new Date(body.date).toISOString() : existing.date,
  };
  db.issues[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete("/api/admin/issues/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.issues.findIndex((i) => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const [removed] = db.issues.splice(idx, 1);
  writeDB(db);
  res.json(removed);
});

// ---------- posts routes ----------

app.get("/api/posts", (req, res) => {
  const db = readDB();
  const results = db.posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  res.json({ results });
});

app.get("/api/posts/:id", (req, res) => {
  const db = readDB();
  const item = db.posts.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: "Not found" });
  res.json(item);
});

app.get("/api/admin/posts", requireAdmin, (req, res) => {
  const db = readDB();
  const results = [...db.posts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  res.json({ results });
});

app.post("/api/admin/posts", requireAdmin, (req, res) => {
  const db = readDB();
  const body = req.body || {};
  if (!body.title) {
    return res.status(400).json({ error: "title is required" });
  }
  const item = {
    id: randomUUID(),
    title: body.title,
    tag: body.tag || "",
    excerpt: body.excerpt || "",
    body: body.body || "",
    date: body.date ? new Date(body.date).toISOString() : new Date().toISOString(),
    published: body.published !== false,
  };
  db.posts.unshift(item);
  writeDB(db);
  res.status(201).json(item);
});

app.put("/api/admin/posts/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const existing = db.posts[idx];
  const body = req.body || {};
  const updated = {
    ...existing,
    ...body,
    id: existing.id,
    date: body.date ? new Date(body.date).toISOString() : existing.date,
  };
  db.posts[idx] = updated;
  writeDB(db);
  res.json(updated);
});

app.delete("/api/admin/posts/:id", requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.posts.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  const [removed] = db.posts.splice(idx, 1);
  writeDB(db);
  res.json(removed);
});

app.listen(PORT, () => {
  console.log(`Loryfiar API listening on http://localhost:${PORT}`);
});