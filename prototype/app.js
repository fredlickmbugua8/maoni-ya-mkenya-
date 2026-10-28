/* ============================================================================
   Maoni ya Mkenya — National Opinion & Polling Platform
   PROTOTYPE (static). Mock data only.

   Production plan (approved): Next.js full-stack on Vercel + Supabase
   (Postgres + Auth + Row Level Security) for one-account-one-vote integrity.
   AI integration points are marked with  // [AI]  throughout.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   0. Utilities
   ------------------------------------------------------------------------ */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escape untrusted text before injecting into HTML. */
const esc = (s = "") =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const nfmt = (n) => Number(n || 0).toLocaleString("en-KE");

/** Image helper — every web image must come from the approved generator. */
const img = (prompt, size = "landscape_16_9") =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(prompt)}&image_size=${size}`;

const NOW = new Date();

const inHours = (h) => new Date(NOW.getTime() + h * 3600 * 1000);
const daysAgo = (d) => new Date(NOW.getTime() - d * 86400 * 1000);

function timeLeft(date) {
  const ms = new Date(date) - NOW;
  if (ms <= 0) return "Closed";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  if (h >= 1) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function fmtDate(date) {
  return new Date(date).toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });
}

/* ---------------------------------------------------------------------------
   1. Static reference data
   ------------------------------------------------------------------------ */

/** All sectors of leadership, government and national life. */
const SECTORS = [
  { id: "all", name: "All Sectors", ic: "🇰🇪" },
  { id: "presidency", name: "Presidency & Executive", ic: "🏛️" },
  { id: "parliament", name: "Parliament & Legislature", ic: "⚖️" },
  { id: "judiciary", name: "Judiciary", ic: "🧑‍⚖️" },
  { id: "county", name: "County Governments", ic: "🗺️" },
  { id: "security", name: "Security & Defence", ic: "🛡️" },
  { id: "economy", name: "Economy, Finance & Tax", ic: "💰" },
  { id: "education", name: "Education", ic: "🎓" },
  { id: "health", name: "Health", ic: "🏥" },
  { id: "agriculture", name: "Agriculture & Food", ic: "🌾" },
  { id: "infrastructure", name: "Infrastructure & Transport", ic: "🛣️" },
  { id: "energy", name: "Energy & Petroleum", ic: "⚡" },
  { id: "ict", name: "ICT & Digital Economy", ic: "📱" },
  { id: "youth", name: "Youth, Sports & Culture", ic: "🎽" },
  { id: "gender", name: "Gender & Social Protection", ic: "🤝" },
  { id: "land", name: "Land & Housing", ic: "🏘️" },
  { id: "environment", name: "Environment & Climate", ic: "🌳" },
  { id: "foreign", name: "Foreign Affairs & Diaspora", ic: "🌍" },
  { id: "constitution", name: "Constitution & Governance", ic: "📜" },
  { id: "other", name: "Other National Issues", ic: "🗣️" },
];
const sectorName = (id) => (SECTORS.find((s) => s.id === id) || { name: "General" }).name;
const sectorIcon = (id) => (SECTORS.find((s) => s.id === id) || { ic: "🗣️" }).ic;

/* ---------------------------------------------------------------------------
   2. Mock polls (prototype data)
   ------------------------------------------------------------------------ */
let POLL_ID = 100;
const poll = (o) => ({ id: `p${++POLL_ID}`, votes: 0, createdAt: daysAgo(6), featured: false, ...o });

const POLLS = [
  poll({
    title: "Should the Presidential term be reduced from 5 years to 4 years?",
    summary: "Debate on shortening the executive term and aligning it with the electoral cycle.",
    sector: "presidency", status: "live", endsAt: inHours(38), featured: true, liveResults: false,
    voters: 42318, options: [
      { label: "Yes — reduce to 4 years", votes: 26840 },
      { label: "No — keep 5 years", votes: 12970 },
      { label: "Undecided", votes: 2508 },
    ],
  }),
  poll({
    title: "Should MPs' monthly pay be capped at KSh 500,000?",
    summary: "Public sentiment on capping parliamentary remuneration and benefits.",
    sector: "parliament", status: "live", endsAt: inHours(20), featured: true,
    voters: 38104, options: [
      { label: "Yes — cap it", votes: 33210 },
      { label: "No — keep current pay", votes: 3410 },
      { label: "Cap it even lower", votes: 1484 },
    ],
  }),
  poll({
    title: "Do you have confidence in the Judiciary to handle election petitions fairly?",
    summary: "Trust in courts and tribunals during disputed electoral outcomes.",
    sector: "judiciary", status: "live", endsAt: inHours(72),
    voters: 22980, options: [
      { label: "High confidence", votes: 6420 },
      { label: "Some confidence", votes: 8110 },
      { label: "Low confidence", votes: 6090 },
      { label: "No confidence at all", votes: 2360 },
    ],
  }),
  poll({
    title: "Should county governors be limited to a single 5-year term?",
    summary: "Devolution debate on term limits for county executives.",
    sector: "county", status: "live", endsAt: inHours(52),
    voters: 18440, options: [
      { label: "Yes — one term only", votes: 10420 },
      { label: "No — allow two terms", votes: 6180 },
      { label: "Not sure", votes: 1840 },
    ],
  }),
  poll({
    title: "Should the government scrap tax hikes on basic goods?",
    summary: "Cost-of-living pressure from the Finance Act measures.",
    sector: "economy", status: "live", endsAt: inHours(14),
    voters: 51290, options: [
      { label: "Scrap the tax hikes", votes: 42330 },
      { label: "Keep them, cut spending instead", votes: 6310 },
      { label: "Reduce but do not scrap", votes: 2650 },
    ],
  }),
  poll({
    title: "Should Kenya replace CBC with a hybrid 8-4-4 model?",
    summary: "Competency-Based Curriculum review and transition pressure.",
    sector: "education", status: "live", endsAt: inHours(96),
    voters: 29770, options: [
      { label: "Keep CBC, fix funding", votes: 9840 },
      { label: "Return to 8-4-4", votes: 10110 },
      { label: "Hybrid model", votes: 8120 },
      { label: "No opinion", votes: 1700 },
    ],
  }),
  poll({
    title: "Should health insurance contributions be mandatory for all Kenyans?",
    summary: "Social Health Authority rollout and mandatory deductions.",
    sector: "health", status: "live", endsAt: inHours(30),
    voters: 21360, options: [
      { label: "Yes — mandatory", votes: 6480 },
      { label: "No — voluntary only", votes: 11420 },
      { label: "Subsidise the poor instead", votes: 3460 },
    ],
  }),
  poll({
    title: "Do you support deploying Kenyan police to international peacekeeping missions?",
    summary: "Overseas deployments, cost and security risk debate.",
    sector: "security", status: "live", endsAt: inHours(60),
    voters: 14980, options: [
      { label: "Support", votes: 5190 },
      { label: "Oppose", votes: 8120 },
      { label: "Only if fully funded", votes: 1670 },
    ],
  }),
  poll({
    title: "Should the regulator cap mobile data prices?",
    summary: "Affordability of internet access for citizens and small businesses.",
    sector: "ict", status: "live", endsAt: inHours(44),
    voters: 17660, options: [
      { label: "Yes — cap prices", votes: 12980 },
      { label: "No — let the market decide", votes: 4020 },
      { label: "Cap only for students", votes: 660 },
    ],
  }),
  poll({
    title: "Should at least 10% of the national budget go to youth employment?",
    summary: "Joblessness and youth-focused spending priorities.",
    sector: "youth", status: "live", endsAt: inHours(26),
    voters: 26110, options: [
      { label: "Yes — ring-fence 10%", votes: 20140 },
      { label: "No — too rigid", votes: 3870 },
      { label: "Yes, but 5% is enough", votes: 2100 },
    ],
  }),
  /* ---- Closed polls (archives) ---- */
  poll({
    title: "Should all land adjudication records be digitised nationally?",
    summary: "Reducing land fraud through a national digital land registry.",
    sector: "land", status: "closed", endsAt: daysAgo(4), closedAt: daysAgo(4),
    voters: 33920, options: [
      { label: "Yes — digitise everything", votes: 27100 },
      { label: "No — keep manual records", votes: 3220 },
      { label: "Yes, but county-by-county", votes: 3600 },
    ],
  }),
  poll({
    title: "Should the government subsidise fertiliser for all farmers?",
    summary: "Food security and farm input affordability.",
    sector: "agriculture", status: "closed", endsAt: daysAgo(9), closedAt: daysAgo(9),
    voters: 24870, options: [
      { label: "Yes — universal subsidy", votes: 17860 },
      { label: "No — target the needy only", votes: 5210 },
      { label: "Remove subsidies entirely", votes: 1800 },
    ],
  }),
  poll({
    title: "Do you support a 100% transition to renewable energy by 2030?",
    summary: "Energy mix, geothermal and solar expansion.",
    sector: "energy", status: "closed", endsAt: daysAgo(12), closedAt: daysAgo(12),
    voters: 19440, options: [
      { label: "Yes — accelerate", votes: 14320 },
      { label: "No — too costly now", votes: 3110 },
      { label: "Only if prices drop", votes: 2010 },
    ],
  }),
  poll({
    title: "Should the Constitution be amended through a popular initiative process?",
    summary: "Governance reform and public participation standards.",
    sector: "constitution", status: "closed", endsAt: daysAgo(16), closedAt: daysAgo(16),
    voters: 41050, options: [
      { label: "Yes — via popular initiative", votes: 21480 },
      { label: "Only via Parliament", votes: 14420 },
      { label: "No amendment needed", votes: 5150 },
    ],
  }),
  poll({
    title: "Should the ban on single-use plastics be expanded?",
    summary: "Environmental protection versus business costs.",
    sector: "environment", status: "closed", endsAt: daysAgo(21), closedAt: daysAgo(21),
    voters: 15730, options: [
      { label: "Yes — expand the ban", votes: 11940 },
      { label: "No — too harsh on business", votes: 2640 },
      { label: "Phase it in slowly", votes: 1150 },
    ],
  }),
];

const getPoll = (id) => POLLS.find((p) => p.id === id);
const totalVotes = (p) => p.options.reduce((s, o) => s + o.votes, 0);
const pct = (v, total) => (total ? Math.round((v / total) * 1000) / 10 : 0);

/* ---------------------------------------------------------------------------
   3. Mock ads, notifications, moderation queue
   ------------------------------------------------------------------------ */
let ADS = [
  {
    id: "ad1", advertiser: "Tumaini SACCO", status: "live", placement: "Home — top banner",
    headline: "Grow your hustle with a Jipange Loan", body: "Instant mobile loans from 8% p.a. Approved in minutes.",
    cta: "Apply now", impressions: 184300, clicks: 5120,
    image: img("Kenyan mobile money fintech loan app advertisement, smartphone in hand, green brand colours, modern clean", "landscape_4_3"),
  },
  {
    id: "ad2", advertiser: "Rift Valley Tea Exporters", status: "live", placement: "Poll feed — between cards",
    headline: "Kenyan tea, world class", body: "Buy premium single-origin tea direct from Kenyan farmers.",
    cta: "Shop the harvest", impressions: 92110, clicks: 2380,
    image: img("Kenyan tea plantation at sunrise with workers, lush green hills, premium export advertisement", "landscape_4_3"),
  },
  {
    id: "ad3", advertiser: "Elimu Bora Trust", status: "pending", placement: "Archives — sidebar",
    headline: "Fully funded scholarships 2026", body: "Apply for university scholarships for bright, needy students.",
    cta: "Check eligibility", impressions: 0, clicks: 0,
    image: img("Kenyan students in school uniform smiling outdoors, education scholarship advertisement, bright optimistic", "landscape_4_3"),
  },
];

let NOTIFICATIONS = [
  { id: "n1", unread: true, ic: "📢", title: "Poll closed — results published", body: "“Should all land adjudication records be digitised nationally?” is closed. Tap to view final results.", at: daysAgo(0.2), href: "#/poll/p111" },
  { id: "n2", unread: true, ic: "🗳️", title: "New poll in Economy & Tax", body: "“Should the government scrap tax hikes on basic goods?” closes in 14 hours — cast your vote.", at: daysAgo(0.5), href: "#/poll/p105" },
  { id: "n3", unread: false, ic: "✅", title: "Your poll request was approved", body: "Your request on water tariffs has been approved and scheduled for publication.", at: daysAgo(2), href: "#/support" },
  { id: "n4", unread: false, ic: "🔒", title: "Account secured", body: "A new sign-in was detected on your account. If this was not you, reset your password.", at: daysAgo(5), href: "#/login" },
];

let MODERATION = [
  { id: "m1", severity: "high", reason: "Violent incitement", excerpt: "…we should [removed] all of them in that community…", source: "Support chat", at: daysAgo(0.1), status: "open", score: 0.94 },
  { id: "m2", severity: "medium", reason: "Ethnic generalisation", excerpt: "…those people from that region are all thieves…", source: "Support chat", at: daysAgo(1.4), status: "open", score: 0.81 },
  { id: "m3", severity: "low", reason: "Harassment / insults", excerpt: "…you are an idiot, this platform is useless…", source: "Support chat", at: daysAgo(3), status: "resolved", score: 0.63 },
];

/* ---------------------------------------------------------------------------
   4. App state (prototype session)
   ------------------------------------------------------------------------ */
const state = {
  role: "user",              // 'user' | 'admin'   (prototype role switch)
  user: null,                // { name, email, county }
  sector: "all",
  search: "",
  voted: {},                 // pollId -> optionIndex
  archiveQuery: "",
  adminTab: "overview",
  chat: [
    {
      who: "bot",
      text: "Karibu Maoni ya Mkenya 👋 I'm your support assistant. You can ask me to run a poll on any issue that affects Kenyans, or report a problem.",
      at: new Date(),
    },
    {
      who: "bot",
      text: "Try: “Please run a poll on water rationing in Nairobi.” Our system screens every message for hate speech and malicious content before it reaches our team.",
      at: new Date(),
    },
  ],
};

/* ---------------------------------------------------------------------------
   5. [AI] Content safety — hate speech & malicious message screening
   Prototype uses transparent keyword/heuristic rules.
   Production: server-side call to an AI moderation API (e.g. OpenAI Moderation)
   plus a Kenyan-context fine-tuned classifier and human review queue.
   ------------------------------------------------------------------------ */
const HATE_RULES = [
  { id: "violence", severity: "high", reason: "Violent incitement", score: 0.93,
    re: /\b(kill|burn|eliminate|exterminate|wipe out|massacre|behead|lynch)\b/i },
  { id: "genocide", severity: "high", reason: "Incitement to violence", score: 0.95,
    re: /\b(should (all )?be (killed|wiped out|eliminated)|deserve to die)\b/i },
  { id: "ethnic-gen", severity: "medium", reason: "Ethnic generalisation", score: 0.8,
    re: /\b(kikuyu|luo|luhya|kalenjin|kamba|kisii|somali|maasai|mijikenda|turkana|pokot|samburu|taita|embu|meru)\b[^.?!]{0,40}\b(are|is)\b[^.?!]{0,25}\b(thieves|useless|stupid|inferior|animals|criminals|dirty|violent|liars)\b/i },
  { id: "hate-speech", severity: "medium", reason: "Hate speech", score: 0.78,
    re: /\b(hate|despise)\b[^.?!]{0,25}\b(people|community|tribe|religion|muslims|christians)\b/i },
  { id: "harassment", severity: "low", reason: "Harassment / insults", score: 0.6,
    re: /\b(idiot|stupid|imbecile|moron|foolish|useless idiot|shut up|nonsense person)\b/i },
  { id: "malicious-link", severity: "medium", reason: "Malicious link / phishing", score: 0.72,
    re: /(bit\.ly|tinyurl|free-money|mpesa-reward-win|claim-your-cash|login-verify-)/i },
  { id: "spam", severity: "low", reason: "Spam / repeat flooding", score: 0.5,
    re: /(.)\1{6,}|(\b\w+\b)(\s+\1){3,}/i },
];

/** Screen a message. Returns { allowed, rule, matches } .  // [AI] */
function screenMessage(text) {
  const clean = text.trim();
  for (const rule of HATE_RULES) {
    if (rule.re.test(clean)) return { allowed: false, rule, matches: clean.match(rule.re) };
  }
  // Shouting heuristic (only counted if long enough to be meaningful)
  const letters = clean.replace(/[^A-Za-z]/g, "");
  if (letters.length > 24 && letters === letters.toUpperCase()) {
    const rule = { id: "shouting", severity: "low", reason: "Aggressive shouting / possible abuse", score: 0.45, re: /.*/ };
    return { allowed: false, rule, matches: [clean.slice(0, 60)] };
  }
  return { allowed: true };
}

/* ---------------------------------------------------------------------------
   6. UI primitives: toast + modal
   ------------------------------------------------------------------------ */
function toast(text, kind = "", ms = 3600) {
  const el = document.createElement("div");
  el.className = `toast ${kind}`;
  el.innerHTML = `<span>${kind === "danger" ? "⛔" : kind === "ok" ? "✅" : "ℹ️"}</span><span>${esc(text)}</span>`;
  $("#toast-root").appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function openModal(html) {
  $("#modal-root").innerHTML = `<div class="modal-backdrop" data-close><div class="modal">${html}</div></div>`;
  $("#modal-root").firstElementChild.addEventListener("click", (e) => {
    if (e.target.dataset.close !== undefined || e.target.closest("[data-close-x]")) closeModal();
  });
}
const closeModal = () => ($("#modal-root").innerHTML = "");

/* ---------------------------------------------------------------------------
   7. Shared partials
   ------------------------------------------------------------------------ */
function notice(kind, ic, title, body) {
  return `<div class="notice ${kind}"><span class="ic">${ic}</span><div><strong>${title}</strong>${body}</div></div>`;
}

function pollCard(p) {
  const live = p.status === "live";
  const voted = state.voted[p.id] !== undefined;
  return `
  <article class="card poll-card">
    <div class="poll-top">
      <span class="tag ${live ? "live" : "closed"}">${live ? "Live" : "Closed"}</span>
      <span class="tag">${sectorIcon(p.sector)} ${esc(sectorName(p.sector))}</span>
    </div>
    <div class="poll-body">
      <h3 class="card-title">${esc(p.title)}</h3>
      <p class="card-desc">${esc(p.summary)}</p>
    </div>
    <div class="poll-meta">
      <span>👥 <strong>${nfmt(totalVotes(p))}</strong> Kenyans voted</span>
      <span>${live ? "⏳ " + timeLeft(p.endsAt) : "🔒 Closed " + fmtDate(p.closedAt || p.endsAt)}</span>
      ${voted ? `<span style="color:var(--ke-green);font-weight:700">✔ You voted</span>` : ""}
    </div>
    <div class="poll-foot">
      <a class="btn btn-sm ${live ? "btn-primary" : "btn-ghost"}" href="#/poll/${p.id}">
        ${live ? "Vote / view poll" : "View results"}
      </a>
      <a class="btn btn-sm btn-ghost" href="#/results/${p.id}">Results</a>
    </div>
  </article>`;
}

function adCard(ad, compact = false) {
  return `
  <article class="ad-card">
    <div class="ad-media" style="background-image:url('${ad.image}')">
      <span class="ad-flag">Advertisement</span>
    </div>
    <div class="ad-body">
      <h4>${esc(ad.headline)}</h4>
      <p>${esc(ad.body)}</p>
      <div class="flex between center gap-8">
        <span class="small muted">Sponsored by ${esc(ad.advertiser)}</span>
        <button class="btn btn-sm btn-ghost" data-ad-click="${ad.id}">${esc(ad.cta)}</button>
      </div>
    </div>
  </article>${compact ? "" : ""}`;
}

function optionRows(p, { interactive = false, locked = false } = {}) {
  const total = totalVotes(p);
  return p.options
    .map((o, i) => {
      const percent = pct(o.votes, total);
      const selected = state.voted[p.id] === i ? "selected" : "";
      return `
      <button class="option ${interactive ? "" : "locked"} ${selected}"
              ${interactive ? `data-opt="${i}"` : "disabled"}>
        ${interactive ? `<span class="radio"></span>` : ""}
        <span class="option-label">${esc(o.label)}</span>
        ${locked ? `<span class="option-label" style="margin-left:auto;color:var(--muted);font-weight:700">${percent}%</span>` : ""}
      </button>`;
    })
    .join("");
}

function resultBars(p) {
  const total = totalVotes(p);
  const max = Math.max(...p.options.map((o) => o.votes));
  return p.options
    .map((o) => {
      const percent = pct(o.votes, total);
      return `
      <div class="bar-row">
        <div class="bar-top">
          <strong>${esc(o.label)}</strong>
          <span class="muted">${nfmt(o.votes)} · <strong>${percent}%</strong></span>
        </div>
        <div class="bar-track"><div class="bar-fill ${o.votes === max ? "lead" : ""}" style="width:${percent}%"></div></div>
      </div>`;
    })
    .join("");
}

/* ---------------------------------------------------------------------------
   8. Views
   ------------------------------------------------------------------------ */
const views = {};

/* --- Home ----------------------------------------------------------------- */
views.home = () => {
  const live = POLLS.filter((p) => p.status === "live");
  const featured = live.filter((p) => p.featured);
  const totalVotesCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);

  return `
  <section class="section">
    <div class="hero">
      <div class="hero-media" style="background-image:url('${img("Nairobi city skyline at golden hour, aerial wide view, Kenya, professional editorial photography", "landscape_16_9")}')"></div>
      <div class="hero-content">
        <span class="hero-tag">🇰🇪 One verified account · One vote</span>
        <h1>Your voice on the issues that shape Kenya.</h1>
        <p>Vote on national opinion polls across every sector — leadership, government, the economy and beyond. Independent, transparent and accountable.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/polls">🗳️ Vote on live polls</a>
          <a class="btn btn-ghost" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.3)" href="#/support">💬 Request a poll</a>
        </div>
        <div class="hero-stats">
          <div><strong>${nfmt(totalVotesCast)}</strong><span>Votes cast</span></div>
          <div><strong>${POLLS.length}</strong><span>Polls published</span></div>
          <div><strong>${SECTORS.length - 1}</strong><span>Sectors covered</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Live now</span><h2>Featured polls closing soon</h2></div>
      <a class="btn btn-sm btn-ghost" href="#/polls">See all</a>
    </div>
    <div class="grid grid-2">
      ${featured.map(pollCard).join("")}
    </div>
  </section>

  <section class="section">
    <div class="section-head"><div><span class="eyebrow">Sponsored</span><h2>Advertisement</h2></div></div>
    <div class="grid grid-2">
      ${ADS.filter((a) => a.status === "live").slice(0, 2).map((a) => adCard(a)).join("")}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Browse</span><h2>Polls by sector</h2>
      <p>Every sector of leadership, government and national life.</p></div>
    </div>
    <div class="grid grid-3">
      ${SECTORS.filter((s) => s.id !== "all").slice(0, 9).map((s) => {
        const n = POLLS.filter((p) => p.sector === s.id).length;
        return `<a class="card card-pad" href="#/polls?sector=${s.id}">
          <div class="flex center gap-8">
            <span style="font-size:20px">${s.ic}</span>
            <div><strong style="font-size:13.5px">${esc(s.name)}</strong><br><span class="small muted">${n} poll${n === 1 ? "" : "s"}</span></div>
          </div></a>`;
      }).join("")}
    </div>
    <div class="mt-12"><a class="btn btn-ghost btn-sm" href="#/polls">View all ${SECTORS.length - 1} sectors</a></div>
  </section>

  <section class="section">
    <div class="grid grid-2">
      ${notice("info", "🔐", "Why you can trust the numbers",
        "Votes are tied to one verified account, stored immutably and never edited. Live polls show how many Kenyans have voted; final results are published the moment polling closes.")}
      ${notice("warn", "📣", "Want a poll on your issue?",
        "Use the support chat to request a poll on any matter affecting Kenyans. Requests are screened for hate speech and reviewed by our team before publication.")}
    </div>
  </section>`;
};

/* --- Polls feed ----------------------------------------------------------- */
views.polls = (params) => {
  if (params.get("sector")) state.sector = params.get("sector");

  const q = state.search.toLowerCase().trim();
  let list = POLLS.filter((p) => (state.sector === "all" ? true : p.sector === state.sector));
  if (q) list = list.filter((p) => (p.title + p.summary + sectorName(p.sector)).toLowerCase().includes(q));
  const live = list.filter((p) => p.status === "live");
  const closed = list.filter((p) => p.status === "closed");

  const cards = () => {
    if (!live.length) return `<div class="card card-pad"><p class="muted mb-0">No live polls match your filter. Try another sector.</p></div>`;
    return live.map(pollCard).join("");
  };

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Polling centre</span><h2>Live national polls</h2>
      <p>Vote once per poll. Results are published when the poll closes.</p></div>
    </div>
    <div class="field">
      <input class="input" id="poll-search" placeholder="🔍 Search polls or issues…" value="${esc(state.search)}" />
    </div>
    <div class="chip-row">
      ${SECTORS.map((s) => `<button class="chip ${state.sector === s.id ? "active" : ""}" data-sector="${s.id}">${s.ic} ${esc(s.name)}</button>`).join("")}
    </div>
  </section>

  <section class="section">
    <div class="grid grid-2">
      ${live.length ? live.slice(0, 2).map(pollCard).join("") : ""}
    </div>
    ${live.length > 2 ? `<div class="grid grid-2 mt-12">${live.slice(2).map(pollCard).join("")}</div>` : ""}
    ${!live.length ? `<div class="card card-pad"><p class="muted mb-0">No live polls in this sector right now. Check the archives or request a poll in support chat.</p></div>` : ""}
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Sponsored</span><h2>Advertisement</h2></div>
    </div>
    <div class="grid grid-2">${ADS.filter((a) => a.status === "live").slice(0, 2).map((a) => adCard(a)).join("")}</div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Recently closed</span><h2>From the archives</h2></div>
      <a class="btn btn-sm btn-ghost" href="#/archives">Full archive</a>
    </div>
    <div class="grid grid-2">${closed.slice(0, 2).map(pollCard).join("")}</div>
  </section>`;
};

/* --- Poll detail / voting ------------------------------------------------- */
views.poll = (_, id) => {
  const p = getPoll(id);
  if (!p) return `<div class="card card-pad"><h3>Poll not found</h3><a class="btn btn-ghost mt-8" href="#/polls">Back to polls</a></div>`;

  const live = p.status === "live";
  const voted = state.voted[p.id] !== undefined;
  const total = totalVotes(p);
  const showResults = !live || p.liveResults || state.role === "admin";

  return `
  <section class="section">
    <a class="small muted" href="#/polls">← Back to polls</a>
    <div class="flex center gap-8 wrap mt-8">
      <span class="tag ${live ? "live" : "closed"}">${live ? "Live" : "Closed"}</span>
      <span class="tag">${sectorIcon(p.sector)} ${esc(sectorName(p.sector))}</span>
      <span class="tag info">👥 ${nfmt(total)} votes</span>
      <span class="tag">${live ? "⏳ " + timeLeft(p.endsAt) : "🔒 Closed " + fmtDate(p.closedAt || p.endsAt)}</span>
    </div>
    <h1 style="font-size:22px;margin:12px 0 6px;line-height:1.3">${esc(p.title)}</h1>
    <p class="muted" style="margin:0 0 16px">${esc(p.summary)}</p>
  </section>

  <section class="section">
    ${live && !voted && state.role !== "admin" ? notice("info", "🗳️", "Cast your vote", "Select one option below. You can vote once — this cannot be changed.") : ""}
    ${live && voted ? notice("ok", "✅", "Vote recorded", "Thank you. Your vote is final. The final results will be published here and we will notify you when the poll closes.") : ""}
    ${live && !p.liveResults && state.role !== "admin" ? `<div class="mt-12">${notice("warn", "🔒", "Results are sealed until polling closes", "In line with our integrity rules, individual result breakdowns are published once the poll closes. You can still see how many Kenyans have voted.")}</div>` : ""}
    ${!live ? `<div class="mt-12">${notice("ok", "📊", "Final results published", "This poll is closed. Results below are final and tamper-proof.")}</div>` : ""}

    <div class="card mt-12">
      <div class="options" id="options">
        ${optionRows(p, { interactive: live && !voted && state.role !== "admin", locked: showResults })}
      </div>
      ${
        live && !voted && state.role !== "admin"
          ? `<div class="poll-foot"><button class="btn btn-primary btn-block" id="submit-vote" disabled>Submit vote</button></div>`
          : ""
      }
      ${!live ? `<div class="card-pad" style="border-top:1px dashed var(--line)"><div class="small muted">Total votes cast</div><strong style="font-size:20px">${nfmt(total)}</strong></div>` : ""}
    </div>
  </section>

  ${
    showResults
      ? `<section class="section">
          <div class="section-head"><div><span class="eyebrow">${live ? "Live (admin view)" : "Final result"}</span><h2>Result breakdown</h2></div></div>
          <div class="card card-pad">${resultBars(p)}</div>
        </section>`
      : `<section class="section">
          <div class="card card-pad">
            <h3 class="card-title">Results locked 🔒</h3>
            <p class="card-desc">Voter turnout so far: <strong>${nfmt(total)}</strong> Kenyans. The full breakdown will appear here when polling closes on ${fmtDate(p.endsAt)}.</p>
          </div>
        </section>`
  }

  <section class="section">
    <div class="section-head"><div><h2>Other polls in ${esc(sectorName(p.sector))}</h2></div></div>
    <div class="grid grid-2">
      ${POLLS.filter((x) => x.sector === p.sector && x.id !== p.id).slice(0, 2).map(pollCard).join("") || `<div class="card card-pad"><p class="muted mb-0">No other polls in this sector yet.</p></div>`}
    </div>
  </section>`;
};

/* --- Results hub ---------------------------------------------------------- */
views.results = (_, id) => {
  if (id) {
    const p = getPoll(id);
    if (!p) return `<div class="card card-pad"><h3>Poll not found</h3></div>`;
    const closed = p.status === "closed";
    return `
    <section class="section">
      <a class="small muted" href="#/results">← All results</a>
      <h1 style="font-size:20px;margin:10px 0 4px">${esc(p.title)}</h1>
      <p class="muted small">${esc(sectorName(p.sector))} · ${closed ? "Closed " + fmtDate(p.closedAt || p.endsAt) : "Live — results locked"}</p>
      ${closed
        ? notice("ok", "📊", "Final results", `Based on ${nfmt(totalVotes(p))} verified votes.`)
        : notice("warn", "🔒", "Results sealed", "Published when the poll closes.")}
      <div class="card card-pad mt-12">${resultBars(p)}</div>
    </section>`;
  }

  const closed = POLLS.filter((p) => p.status === "closed");
  const totalVotesCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);
  const totalVoters = POLLS.reduce((s, p) => s + p.voters, 0);

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">National results</span><h2>Published results</h2>
      <p>Final, tamper-proof outcomes for every closed poll.</p></div>
    </div>
    <div class="stat-grid cols-3">
      <div class="stat"><span>Votes recorded</span><strong>${nfmt(totalVotesCast)}</strong><small>All polls to date</small></div>
      <div class="stat"><span>Polls published</span><strong>${POLLS.length}</strong><small>${closed.length} closed · ${POLLS.length - closed.length} live</small></div>
      <div class="stat"><span>Sectors covered</span><strong>${SECTORS.length - 1}</strong><small>Full coverage</small></div>
    </div>
  </section>
  <section class="section">
    <div class="grid grid-2">
      ${closed.map((p) => `
        <article class="card">
          <div class="card-pad">
            <div class="flex center gap-8 wrap">
              <span class="tag closed">Closed</span><span class="tag">${sectorIcon(p.sector)} ${esc(sectorName(p.sector))}</span>
            </div>
            <h3 class="card-title mt-8">${esc(p.title)}</h3>
            <p class="small muted">${nfmt(totalVotes(p))} votes · closed ${fmtDate(p.closedAt || p.endsAt)}</p>
          </div>
          <div class="card-pad" style="border-top:1px dashed var(--line)">${resultBars(p)}</div>
          <div class="poll-foot"><a class="btn btn-sm btn-ghost" href="#/results/${p.id}">Open full result</a></div>
        </article>`).join("")}
    </div>
  </section>`;
};

/* --- Archives ------------------------------------------------------------- */
views.archives = () => {
  const q = state.archiveQuery.toLowerCase().trim();
  const bySector = (sid) => POLLS.filter((p) => p.status === "closed" && p.sector === sid)
    .filter((p) => !q || (p.title + p.summary).toLowerCase().includes(q));

  const grouped = SECTORS.filter((s) => s.id !== "all").map((s) => ({ s, items: bySector(s.id) })).filter((g) => g.items.length);

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Archive</span><h2>Past polls & results</h2>
      <p>A permanent, searchable record of every closed poll — grouped by sector.</p></div>
    </div>
    <div class="field">
      <input class="input" id="archive-search" placeholder="🔍 Search archived polls…" value="${esc(state.archiveQuery)}" />
    </div>
    <div class="grid grid-2">
      ${notice("info", "🔒", "Records cannot be altered",
        "Closed polls are archived permanently. Vote counts are locked and any edit attempt is logged for audit.").replace(/\n/g, "")}
      <div class="card card-pad">
        <span class="eyebrow">Archive summary</span>
        <div class="stat-grid mt-8" style="grid-template-columns:repeat(2,1fr)">
          <div><div class="small muted">Archived polls</div><strong style="font-size:20px">${POLLS.filter((p) => p.status === "closed").length}</strong></div>
          <div><div class="small muted">Votes archived</div><strong style="font-size:20px">${nfmt(POLLS.filter((p) => p.status === "closed").reduce((s, p) => s + totalVotes(p), 0))}</strong></div>
        </div>
      </div>
    </div>
  </section>

  ${grouped.length
    ? grouped.map(({ s, items }) => `
      <section class="section">
        <div class="section-head"><div><h2>${s.ic} ${esc(s.name)}</h2></div><span class="tag closed">${items.length} archived</span></div>
        <div class="grid grid-2">${items.map(pollCard).join("")}</div>
      </section>`).join("")
    : `<div class="card card-pad"><p class="muted mb-0">No archived polls match “${esc(state.archiveQuery)}”.</p></div>`}`;
};

/* --- Notifications -------------------------------------------------------- */
views.notifications = () => {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Alerts</span><h2>Notifications</h2>
      <p>${unread} unread · you are notified when a poll you follow closes.</p></div>
      <button class="btn btn-sm btn-ghost" id="mark-all">Mark all read</button>
    </div>
    <div class="list">
      ${NOTIFICATIONS.map((n) => `
        <a class="list-row ${n.unread ? "unread" : ""}" href="${n.href}" data-notif="${n.id}">
          <span class="lr-ic">${n.ic}</span>
          <span class="lr-main"><strong>${esc(n.title)}</strong><span>${esc(n.body)}</span></span>
          <span class="small muted" style="white-space:nowrap">${fmtDate(n.at)}</span>
        </a>`).join("")}
    </div>
    <div class="mt-16">${notice("info", "🔔", "Notification channels (production)", "In-app now; email and SMS (opt-in) via Africa's Talking will be added for poll-close alerts.")}</div>
  </section>`;
};

/* --- Support chat (poll requests + AI moderation) -------------------------- */
views.support = () => `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Support</span><h2>Request a poll & talk to us</h2>
      <p>Ask us to run a poll on any issue affecting Kenyans. Every message is screened for hate speech and malicious content.</p></div>
    </div>

    <div class="grid grid-2" style="align-items:start">
      <div class="card chat-wrap">
        <div class="chat-head">
          <span class="avatar">MY</span>
          <div><strong style="font-size:14px">Maoni Support</strong><br><span class="small muted">Typically replies in a few minutes</span></div>
          <span class="tag ok" style="margin-left:auto">AI screened</span>
        </div>
        <div class="chat-log" id="chat-log">
          ${state.chat.map((m) => `
            <div class="msg ${m.who === "me" ? "me" : m.who === "blocked" ? "blocked" : "bot"}">
              ${esc(m.text)}<span class="msg-time">${new Date(m.at).toLocaleTimeString("en-KE", { hour: "2-digit", minute: "2-digit" })}</span>
            </div>`).join("")}
        </div>
        <form class="chat-input" id="chat-form">
          <input id="chat-input" placeholder="e.g. Please run a poll on water rationing…" autocomplete="off" />
          <button class="btn btn-primary" type="submit">Send</button>
        </form>
      </div>

      <div class="grid">
        <div class="card card-pad">
          <span class="eyebrow">How to request a poll</span>
          <ol class="small muted" style="padding-left:18px;margin:9px 0 0;line-height:1.7">
            <li>Tell us the issue and the sector it belongs to.</li>
            <li>Suggest the answer options (2–4 works best).</li>
            <li>Our AI screens the request for hate speech and malicious content.</li>
            <li>An admin reviews and approves it, then it goes live.</li>
          </ol>
        </div>
        <div class="card card-pad">
          <span class="eyebrow">Content safety</span>
          <p class="small muted mt-8 mb-0">Messages that contain incitement, ethnic generalisation, harassment, phishing links or spam are automatically blocked and flagged to our moderation queue — in line with the Kenya Data Protection Act, 2019 and the NCIC Act.</p>
        </div>
        <button class="btn btn-dark btn-block" id="demo-flag">Try a blocked-message demo</button>
      </div>
    </div>
  </section>`;

/* --- Auth ----------------------------------------------------------------- */
views.login = () => `
  <section class="section auth-shell">
    <div class="card card-pad">
      <span class="eyebrow">Welcome back</span>
      <h2 style="margin:6px 0 4px">Sign in to vote</h2>
      <p class="small muted" style="margin:0 0 16px">One verified account, one vote. Your vote is anonymous in published results.</p>
      <form id="login-form">
        <div class="field"><label for="li-email">Email address</label><input class="input" id="li-email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label for="li-pass">Password</label><input class="input" id="li-pass" type="password" placeholder="••••••••" required /></div>
        <button class="btn btn-primary btn-block" type="submit">Sign in</button>
      </form>
      <div class="auth-switch">New here? <a href="#/signup">Create an account</a></div>
    </div>
    <div class="mt-16">${notice("info", "🔐", "Verified participation", "In production, accounts are protected by email verification and device checks so each Kenyan votes once per poll.")}</div>
  </section>`;

views.signup = () => `
  <section class="section auth-shell">
    <div class="card card-pad">
      <span class="eyebrow">Join the platform</span>
      <h2 style="margin:6px 0 4px">Create your account</h2>
      <p class="small muted" style="margin:0 0 16px">Free for all Kenyans. Vote on national polls and request new ones.</p>
      <form id="signup-form">
        <div class="form-row two">
          <div class="field"><label for="su-name">Full name</label><input class="input" id="su-name" placeholder="Jane Wanjiku" required /></div>
          <div class="field"><label for="su-county">County</label>
            <select class="input" id="su-county">
              ${["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu", "Machakos", "Uasin Gishu", "Kakamega", "Kilifi", "Meru", "Garissa", "Turkana", "Other"].map((c) => `<option>${c}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="field"><label for="su-email">Email address</label><input class="input" id="su-email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label for="su-pass">Password</label><input class="input" id="su-pass" type="password" placeholder="At least 8 characters" required /><div class="hint">We never publish your email. Results are always aggregated.</div></div>
        <button class="btn btn-primary btn-block" type="submit">Create account</button>
      </form>
      <div class="auth-switch">Already registered? <a href="#/login">Sign in</a></div>
    </div>
    <div class="mt-16">${notice("info", "📜", "Your data, your rights", "You may access, correct or delete your data at any time, per the Kenya Data Protection Act, 2019 (ODPC).")}</div>
  </section>`;

/* --- Admin ---------------------------------------------------------------- */
views.admin = () => {
  if (state.role !== "admin") {
    return `<section class="section auth-shell">
      <div class="card card-pad">
        <span class="eyebrow">Restricted</span>
        <h2 style="margin:6px 0 6px">Admin access only</h2>
        <p class="small muted">Results dashboards, poll creation, ad management and moderation are limited to administrators.</p>
        <div class="mt-12">${notice("danger", "🔒", "Access denied", "Switch to the Admin role (prototype control top-right) or sign in with an administrator account.")}</div>
        <button class="btn btn-dark btn-block mt-12" id="goto-admin-role">Preview as Admin</button>
      </div>
    </section>`;
  }

  const tabs = [
    ["overview", "📊 Overview"],
    ["polls", "🗳️ Polls"],
    ["ads", "📣 Ads"],
    ["moderation", "🛡️ Moderation"],
    ["chat", "💬 Requests"],
  ];
  const body = {
    overview: adminOverview,
    polls: adminPolls,
    ads: adminAds,
    moderation: adminModeration,
    chat: adminChat,
  }[state.adminTab]();

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Administration</span><h2>Control centre</h2>
      <p>Data analysis, poll management, advertising and content safety.</p></div>
      <span class="tag ok">Admin session</span>
    </div>
    <div class="tabs">
      ${tabs.map(([id, label]) => `<button data-admin-tab="${id}" class="${state.adminTab === id ? "active" : ""}">${label}</button>`).join("")}
    </div>
    ${body}
  </section>`;
};

function adminOverview() {
  const live = POLLS.filter((p) => p.status === "live");
  const totalCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);
  const openFlags = MODERATION.filter((m) => m.status === "open").length;
  const impressions = ADS.reduce((s, a) => s + a.impressions, 0);
  const clicks = ADS.reduce((s, a) => s + a.clicks, 0);
  const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : "0";

  const bySector = SECTORS.filter((s) => s.id !== "all")
    .map((s) => ({ s, n: POLLS.filter((p) => p.sector === s.id).reduce((t, p) => t + totalVotes(p), 0) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  const maxSector = Math.max(...bySector.map((x) => x.n), 1);

  return `
  <div class="stat-grid">
    <div class="stat"><span>Total votes</span><strong>${nfmt(totalCast)}</strong><small>+12.4% this week</small></div>
    <div class="stat"><span>Live polls</span><strong>${live.length}</strong><small>${POLLS.length - live.length} archived</small></div>
    <div class="stat"><span>Open flags</span><strong>${openFlags}</strong><small class="down">Needs review</small></div>
    <div class="stat"><span>Ad CTR</span><strong>${ctr}%</strong><small>${nfmt(impressions)} impressions</small></div>
  </div>

  <div class="grid grid-2 mt-16">
    <div class="card card-pad">
      <div class="section-head"><div><span class="eyebrow">Engagement</span><h2 style="font-size:15px">Votes by sector</h2></div></div>
      ${bySector.map((x) => `
        <div class="bar-row">
          <div class="bar-top"><strong>${x.s.ic} ${esc(x.s.name)}</strong><span class="muted">${nfmt(x.n)}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((x.n / maxSector) * 100)}%"></div></div>
        </div>`).join("")}
    </div>
    <div class="card card-pad">
      <div class="section-head"><div><span class="eyebrow">Turnout</span><h2 style="font-size:15px">Daily participation (7 days)</h2></div></div>
      ${[62, 74, 58, 81, 96, 88, 100].map((v, i) => `
        <div class="bar-row">
          <div class="bar-top"><strong>Day ${i + 1}</strong><span class="muted">${nfmt(Math.round(v * 412))} votes</span></div>
          <div class="bar-track"><div class="bar-fill ${i === 6 ? "lead" : ""}" style="width:${v}%"></div></div>
        </div>`).join("")}
      <div class="mt-12">${notice("info", "🤖", "AI insight (prototype)", "Taxation and parliamentary pay polls are driving the highest turnout this week. Consider scheduling a follow-up poll on the cost of living.")}</div>
    </div>
  </div>

  <div class="section mt-16">
    <div class="section-head"><div><h2 style="font-size:15px">Live poll performance</h2></div></div>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Poll</th><th>Sector</th><th>Votes</th><th>Closes</th><th>Leading option</th></tr></thead>
        <tbody>
          ${live.map((p) => {
            const total = totalVotes(p);
            const lead = p.options.reduce((a, b) => (b.votes > a.votes ? b : a));
            return `<tr>
              <td><a href="#/poll/${p.id}"><strong>${esc(p.title.slice(0, 46))}${p.title.length > 46 ? "…" : ""}</strong></a></td>
              <td>${esc(sectorName(p.sector))}</td>
              <td><strong>${nfmt(total)}</strong></td>
              <td>${timeLeft(p.endsAt)}</td>
              <td>${esc(lead.label)} <span class="muted">(${pct(lead.votes, total)}%)</span></td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminPolls() {
  return `
  <div class="flex between center wrap gap-8">
    <div><span class="eyebrow">Manage</span><h2 style="font-size:15px;margin:4px 0 0">All polls</h2></div>
    <button class="btn btn-primary btn-sm" id="new-poll">＋ Create poll</button>
  </div>

  <div class="card card-pad mt-12">
    <strong style="font-size:14px">Result visibility policy</strong>
    <p class="small muted" style="margin:6px 0 10px">Controls what voters see while a poll is live. Applies platform-wide by default.</p>
    <div class="flex gap-8 wrap">
      <button class="chip" data-policy="turnout">Turnout only (recommended)</button>
      <button class="chip" data-policy="live">Live full results</button>
      <button class="chip active" data-policy="closed">Publish on close + notify</button>
    </div>
    <div class="hint">Current: <strong>publish on close + notify</strong> — voters see the participant count live, then final results after polling closes, with a notification.</div>
  </div>

  <div class="table-scroll mt-16">
    <table>
      <thead><tr><th>Poll</th><th>Sector</th><th>Status</th><th>Votes</th><th>Closes</th><th>Actions</th></tr></thead>
      <tbody>
        ${POLLS.map((p) => `<tr>
          <td><strong>${esc(p.title.slice(0, 44))}${p.title.length > 44 ? "…" : ""}</strong></td>
          <td>${esc(sectorName(p.sector))}</td>
          <td><span class="tag ${p.status === "live" ? "live" : "closed"}">${p.status === "live" ? "Live" : "Closed"}</span></td>
          <td>${nfmt(totalVotes(p))}</td>
          <td>${p.status === "live" ? timeLeft(p.endsAt) : fmtDate(p.closedAt || p.endsAt)}</td>
          <td>
            <button class="btn btn-sm btn-ghost" data-toggle-poll="${p.id}">${p.status === "live" ? "Close now" : "Reopen"}</button>
            <button class="btn btn-sm btn-ghost" data-edit-poll="${p.id}">Edit</button>
          </td>
        </tr>`).join("")}
      </tbody>
    </table>
  </div>`;
}

function adminAds() {
  return `
  <div class="flex between center wrap gap-8">
    <div><span class="eyebrow">Monetisation</span><h2 style="font-size:15px;margin:4px 0 0">Advertising</h2>
    <p class="small muted" style="margin:4px 0 0">Sponsored placements across home, poll feed and archives. Ads are clearly labelled and never shown inside voting content.</p></div>
    <button class="btn btn-primary btn-sm" id="new-ad">＋ New campaign</button>
  </div>
  <div class="grid grid-2 mt-12">
    ${ADS.map((a) => `
      <div class="card">
        <div class="ad-media" style="height:110px;background-image:url('${a.image}')"><span class="ad-flag">${a.status}</span></div>
        <div class="card-pad">
          <h3 class="card-title">${esc(a.headline)}</h3>
          <p class="card-desc">${esc(a.body)}</p>
          <div class="poll-meta" style="border-top:1px dashed var(--line);padding:10px 0 0;margin-top:8px">
            <span>🏷️ ${esc(a.advertiser)}</span><span>📍 ${esc(a.placement)}</span>
          </div>
          <div class="poll-meta" style="border-top:1px dashed var(--line);padding:10px 0 0;margin-top:6px">
            <span>👁️ ${nfmt(a.impressions)}</span><span>🖱️ ${nfmt(a.clicks)}</span>
            <span>CTR ${a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(2) : "0.00"}%</span>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-sm ${a.status === "live" ? "btn-ghost" : "btn-primary"}" data-toggle-ad="${a.id}">${a.status === "live" ? "Pause" : "Approve & launch"}</button>
            <button class="btn btn-sm btn-ghost" data-edit-ad="${a.id}">Edit</button>
          </div>
        </div>
      </div>`).join("")}
  </div>
  <div class="mt-16">${notice("info", "💰", "Billing (production)", "Campaigns will be billed per impression/click with Stripe. Advertisers get a self-serve dashboard; ad content is screened before approval.")}</div>`;
}

function adminModeration() {
  const sevClass = { high: "danger", medium: "sponsored", low: "info" };
  return `
  <div class="section-head">
    <div><span class="eyebrow">Content safety</span><h2 style="font-size:15px">Flagged messages</h2>
    <p class="small muted">Automatically flagged by the AI content-safety screen, awaiting human review.</p></div>
  </div>
  ${MODERATION.length
    ? `<div class="list">${MODERATION.map((m) => `
        <div class="list-row ${m.status === "open" ? "unread" : ""}">
          <span class="lr-ic">${m.severity === "high" ? "🚨" : m.severity === "medium" ? "⚠️" : "💬"}</span>
          <span class="lr-main">
            <strong>${esc(m.reason)} <span class="tag ${sevClass[m.severity]}">${m.severity}</span></strong>
            <span>“${esc(m.excerpt)}” — ${esc(m.source)}, ${fmtDate(m.at)}</span>
            <span class="small muted">AI confidence ${(m.score * 100).toFixed(0)}% · status: ${m.status}</span>
          </span>
          <span class="flex gap-8">
            ${m.status === "open"
              ? `<button class="btn btn-sm btn-ghost" data-resolve="${m.id}">Resolve</button><button class="btn btn-sm btn-red" data-block="${m.id}">Block user</button>`
              : `<span class="tag ok">Resolved</span>`}
          </span>
        </div>`).join("")}</div>`
    : `<div class="card card-pad"><p class="muted mb-0">No flagged messages. The moderation queue is clear.</p></div>`}
  <div class="mt-16">${notice("warn", "🛡️", "Escalation policy", "High-severity flags are escalated to the duty moderator immediately and, where required by law, reported to the relevant authority (NCIC / DCI).")}</div>`;
}

function adminChat() {
  const requests = state.chat.filter((m) => m.who === "me" && m.request);
  const blocked = state.chat.filter((m) => m.who === "blocked");
  return `
  <div class="section-head">
    <div><span class="eyebrow">Inbox</span><h2 style="font-size:15px">Poll requests from citizens</h2>
    <p class="small muted">Review, approve and schedule citizen-requested polls.</p></div>
  </div>
  <div class="stat-grid mt-8">
    <div class="stat"><span>Requests received</span><strong>${requests.length}</strong></div>
    <div class="stat"><span>Blocked messages</span><strong>${blocked.length}</strong><small class="down">Auto-filtered</small></div>
    <div class="stat"><span>Avg. review time</span><strong>3h</strong><small>Within SLA</small></div>
  </div>
  <div class="list mt-16">
    ${requests.length
      ? requests.map((r, i) => `
        <div class="list-row">
          <span class="lr-ic">📝</span>
          <span class="lr-main"><strong>${esc(r.text.slice(0, 80))}${r.text.length > 80 ? "…" : ""}</strong>
          <span>Submitted by a verified user · ${new Date(r.at).toLocaleString("en-KE")}</span></span>
          <span class="flex gap-8"><button class="btn btn-sm btn-primary" data-approve-req="${i}">Approve</button><button class="btn btn-sm btn-ghost">Decline</button></span>
        </div>`).join("")
      : `<div class="card card-pad"><p class="muted mb-0">No citizen requests yet. Requests submitted through the support chat appear here for approval.</p></div>`}
  </div>`;
}

/* ---------------------------------------------------------------------------
   9. Router
   ------------------------------------------------------------------------ */
function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, "") || "home";
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  return { name: parts[0] || "home", id: parts[1] || null, params: new URLSearchParams(query || "") };
}

function render() {
  const { name, id, params } = parseRoute();
  if (name === "polls" && params.get("sector")) state.sector = params.get("sector");

  const view = views[name] || views.home;
  $("#view").innerHTML = view(params, id);

  // nav highlighting
  $$("[data-nav]").forEach((a) => a.classList.toggle("active", a.dataset.nav === name));
  $$("#desktop-nav a[href^='#/'], #mobile-nav a").forEach((a) => {
    const key = a.getAttribute("href").replace("#/", "").split("/")[0];
    a.classList.toggle("active", key === name);
  });

  updateBadge();
  bindView(name, id);
  window.scrollTo(0, 0);

  // keep the support chat pinned to the newest message
  const log = $("#chat-log");
  if (log) log.scrollTop = log.scrollHeight;
}

function updateBadge() {
  const n = NOTIFICATIONS.filter((x) => x.unread).length;
  const el = $("#notif-count");
  el.textContent = n;
  el.classList.toggle("hidden", n === 0);
}

/* ---------------------------------------------------------------------------
   10. View bindings (event wiring after render)
   ------------------------------------------------------------------------ */
function bindView(name, id) {
  /* ---- Auth ---- */
  const signup = $("#signup-form");
  if (signup)
    signup.addEventListener("submit", (e) => {
      e.preventDefault();
      state.user = { name: $("#su-name").value || "New Voter", email: $("#su-email").value, county: $("#su-county").value };
      state.role = "user";
      renderHeader();
      toast("Account created. Welcome to Maoni ya Mkenya!", "ok");
      location.hash = "#/polls";
    });

  const login = $("#login-form");
  if (login)
    login.addEventListener("submit", (e) => {
      e.preventDefault();
      state.user = { name: "Signed-in Kenyan", email: $("#li-email").value, county: "Nairobi" };
      state.role = "user";
      renderHeader();
      toast("Signed in successfully.", "ok");
      location.hash = "#/polls";
    });

  const gotoAdmin = $("#goto-admin-role");
  if (gotoAdmin)
    gotoAdmin.addEventListener("click", () => {
      state.role = "admin";
      renderHeader();
      toast("Viewing as administrator.", "ok");
      render();
    });

  /* ---- Poll feed ---- */
  const search = $("#poll-search");
  if (search)
    search.addEventListener("input", (e) => {
      state.search = e.target.value;
      // re-render only the list portion for speed
      const { name: n } = parseRoute();
      if (n === "polls") {
        const live = POLLS.filter((p) => (state.sector === "all" ? true : p.sector === state.sector))
          .filter((p) => p.status === "live")
          .filter((p) => (p.title + p.summary + sectorName(p.sector)).toLowerCase().includes(state.search.toLowerCase()));
        // simplest: full re-render but keep focus
        const pos = e.target.selectionStart;
        render();
        const s2 = $("#poll-search");
        if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
      }
    });

  $$("[data-sector]").forEach((btn) =>
    btn.addEventListener("click", () => {
      state.sector = btn.dataset.sector;
      location.hash = `#/polls?sector=${state.sector}`;
      if (parseRoute().name === "polls") render();
    })
  );

  const archiveSearch = $("#archive-search");
  if (archiveSearch)
    archiveSearch.addEventListener("input", (e) => {
      state.archiveQuery = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const s2 = $("#archive-search");
      if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
    });

  /* ---- Poll detail: option select + submit ---- */
  const optBtns = $$("[data-opt]");
  if (optBtns.length) {
    let chosen = null;
    optBtns.forEach((b) =>
      b.addEventListener("click", () => {
        optBtns.forEach((x) => x.classList.remove("selected"));
        b.classList.add("selected");
        chosen = Number(b.dataset.opt);
        const submit = $("#submit-vote");
        if (submit) submit.disabled = false;
      })
    );
    const submit = $("#submit-vote");
    if (submit)
      submit.addEventListener("click", () => {
        const { id: pid } = parseRoute();
        const p = getPoll(pid);
        if (!p || chosen === null) return;
        p.options[chosen].votes += 1;
        p.voters += 1;
        state.voted[p.id] = chosen;
        render();
        toast("Vote recorded. Final results will be published when polling closes.", "ok");
      });
  }

  /* ---- Notifications ---- */
  const markAll = $("#mark-all");
  if (markAll)
    markAll.addEventListener("click", () => {
      NOTIFICATIONS.forEach((n) => (n.unread = false));
      render();
      toast("All notifications marked as read.", "ok");
    });
  $$("[data-notif]").forEach((a) =>
    a.addEventListener("click", () => {
      const n = NOTIFICATIONS.find((x) => x.id === a.dataset.notif);
      if (n) n.unread = false;
      updateBadge();
    })
  );

  /* ---- Support chat ---- */
  const chatForm = $("#chat-form");
  if (chatForm)
    chatForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#chat-input");
      const text = input.value.trim();
      if (!text) return;
      input.value = "";

      const result = screenMessage(text); // [AI] screening
      if (!result.allowed) {
        state.chat.push({ who: "blocked", text: `🚫 Message blocked — ${result.rule.reason}. Our AI content screen flagged this message (confidence ${(result.rule.score * 100).toFixed(0)}%). Repeated violations may lead to account suspension.`, at: new Date(), blocked: true });
        MODERATION.unshift({
          id: `m${Date.now()}`, severity: result.rule.severity, reason: result.rule.reason,
          excerpt: text.slice(0, 120), source: "Support chat", at: new Date(), status: "open", score: result.rule.score,
        });
        render();
        toast("Message blocked and flagged for review.", "danger");
        return;
      }

      const isRequest = /\b(poll|vote|survey|ballot|ask|opinion)\b/i.test(text);
      state.chat.push({ who: "me", text, at: new Date(), request: isRequest });

      state.chat.push({
        who: "bot",
        at: new Date(),
        text: isRequest
          ? "Thank you — I've logged your poll request and sent it to our editorial team for review. Approved requests are published within 24–48 hours. Would you like to suggest the answer options?"
          : "Thanks for reaching out. A member of our team will respond shortly. If you'd like a poll published, just say “run a poll on …”.",
      });
      render();
    });

  const demo = $("#demo-flag");
  if (demo)
    demo.addEventListener("click", () => {
      $("#chat-input").value = "We should burn all of them from that community!";
      $("#chat-input").focus();
      toast("Now press Send to see the AI screen block it.", "");
    });

  /* ---- Admin ---- */
  $$("[data-admin-tab]").forEach((b) =>
    b.addEventListener("click", () => {
      state.adminTab = b.dataset.adminTab;
      render();
    })
  );

  $$("[data-policy]").forEach((c) =>
    c.addEventListener("click", () => {
      $$("[data-policy]").forEach((x) => x.classList.remove("active"));
      c.classList.add("active");
      toast(`Result visibility policy set to “${c.textContent}”.`, "ok");
    })
  );

  const newPoll = $("#new-poll");
  if (newPoll) newPoll.addEventListener("click", openCreatePollModal);

  $$("[data-toggle-poll]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = getPoll(b.dataset.togglePoll);
      p.status = p.status === "live" ? "closed" : "live";
      if (p.status === "closed") p.closedAt = new Date();
      if (p.status === "live") { p.endsAt = inHours(24); p.liveResults = false; }
      render();
      toast(p.status === "closed" ? "Poll closed. Results published to voters and notifications sent." : "Poll reopened.", "ok");
    })
  );

  $$("[data-edit-poll]").forEach((b) =>
    b.addEventListener("click", () => {
      const p = getPoll(b.dataset.editPoll);
      openModal(`
        <div class="modal-head"><h3>Edit poll</h3><button class="x-btn" data-close-x>×</button></div>
        <div class="modal-body">
          <div class="field"><label>Title</label><input class="input" value="${esc(p.title)}" /></div>
          <div class="field"><label>Summary</label><textarea class="input">${esc(p.summary)}</textarea></div>
          <div class="field"><label>Sector</label>
            <select class="input">${SECTORS.filter((s) => s.id !== "all").map((s) => `<option ${s.id === p.sector ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select>
          </div>
          <div class="hint">Edits to live polls are logged for audit. Vote counts can never be edited.</div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Save changes</button></div>`);
    })
  );

  const newAd = $("#new-ad");
  if (newAd)
    newAd.addEventListener("click", () =>
      openModal(`
        <div class="modal-head"><h3>New ad campaign</h3><button class="x-btn" data-close-x>×</button></div>
        <div class="modal-body">
          <div class="field"><label>Advertiser</label><input class="input" placeholder="Company name" /></div>
          <div class="field"><label>Headline</label><input class="input" placeholder="Short attention-grabbing headline" /></div>
          <div class="field"><label>Body copy</label><textarea class="input" placeholder="One or two sentences"></textarea></div>
          <div class="form-row two" style="display:grid">
            <div class="field"><label>Placement</label><select class="input"><option>Home — top banner</option><option>Poll feed — between cards</option><option>Archives — sidebar</option></select></div>
            <div class="field"><label>Budget (KSh)</label><input class="input" type="number" placeholder="50000" /></div>
          </div>
          <div class="hint">Ad creatives are screened for misleading or harmful content before approval.</div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Submit for review</button></div>`)
    );

  $$("[data-toggle-ad]").forEach((b) =>
    b.addEventListener("click", () => {
      const a = ADS.find((x) => x.id === b.dataset.toggleAd);
      a.status = a.status === "live" ? "pending" : "live";
      if (a.status === "live" && !a.impressions) { a.impressions = 1250; a.clicks = 34; }
      render();
      toast(a.status === "live" ? "Campaign approved and live." : "Campaign paused.", "ok");
    })
  );

  $$("[data-edit-ad]").forEach((b) =>
    b.addEventListener("click", () => {
      const a = ADS.find((x) => x.id === b.dataset.editAd);
      openModal(`
        <div class="modal-head"><h3>Edit campaign</h3><button class="x-btn" data-close-x>×</button></div>
        <div class="modal-body">
          <div class="field"><label>Headline</label><input class="input" value="${esc(a.headline)}" /></div>
          <div class="field"><label>Body</label><textarea class="input">${esc(a.body)}</textarea></div>
          <div class="field"><label>Status</label><select class="input"><option ${a.status === "live" ? "selected" : ""}>live</option><option ${a.status === "pending" ? "selected" : ""}>pending</option><option>paused</option></select></div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Save</button></div>`);
    })
  );

  $$("[data-resolve]").forEach((b) =>
    b.addEventListener("click", () => {
      const m = MODERATION.find((x) => x.id === b.dataset.resolve);
      m.status = "resolved";
      render();
      toast("Flag resolved. No further action taken.", "ok");
    })
  );
  $$("[data-block]").forEach((b) =>
    b.addEventListener("click", () => {
      const m = MODERATION.find((x) => x.id === b.dataset.block);
      m.status = "resolved";
      render();
      toast("User blocked and case escalated to the duty moderator.", "danger");
    })
  );

  $$("[data-approve-req]").forEach((b) =>
    b.addEventListener("click", () => {
      toast("Request approved. Scheduling poll for publication.", "ok");
      location.hash = "#/admin";
      state.adminTab = "polls";
    })
  );

  /* ---- Ad clicks (all views) ---- */
  $$("[data-ad-click]").forEach((b) =>
    b.addEventListener("click", () => {
      const a = ADS.find((x) => x.id === b.dataset.adClick);
      if (a) { a.impressions += 0; a.clicks += 1; }
      toast(`Ad clicked — “${b.closest(".ad-card").querySelector("h4").textContent}”. In production this opens the advertiser's landing page.`, "");
    })
  );
}

function openCreatePollModal() {
  openModal(`
    <div class="modal-head"><h3>Create a new poll</h3><button class="x-btn" data-close-x>×</button></div>
    <div class="modal-body">
      <div class="field"><label>Poll question</label><input class="input" id="np-title" placeholder="e.g. Should water tariffs be reduced in urban areas?" /></div>
      <div class="field"><label>Context / summary</label><textarea class="input" id="np-summary" placeholder="Brief neutral background so voters understand the issue."></textarea></div>
      <div class="form-row two">
        <div class="field"><label>Sector</label><select class="input" id="np-sector">${SECTORS.filter((s) => s.id !== "all").map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</select></div>
        <div class="field"><label>Polling duration</label><select class="input" id="np-duration"><option value="24">24 hours</option><option value="48" selected>48 hours</option><option value="72">72 hours</option><option value="168">7 days</option></select></div>
      </div>
      <div class="field"><label>Answer options</label>
        <div id="np-options" class="grid" style="gap:8px">
          <input class="input" placeholder="Option 1" />
          <input class="input" placeholder="Option 2" />
          <input class="input" placeholder="Option 3 (optional)" />
        </div>
      </div>
      <div class="field"><label>Result visibility</label>
        <select class="input" id="np-visibility">
          <option value="closed" selected>Publish results when the poll closes + notify voters</option>
          <option value="turnout">Show turnout only while live</option>
          <option value="live">Show live full results</option>
        </select>
      </div>
      <div class="hint">Every new poll is AI-checked for neutrality and logged for audit before publication.</div>
    </div>
    <div class="modal-foot"><button class="btn btn-primary btn-block" id="np-save">Publish poll</button></div>`);

  $("#np-save").addEventListener("click", () => {
    const title = $("#np-title").value.trim() || "Untitled poll";
    const opts = $$("#np-options input").map((i) => i.value.trim()).filter(Boolean);
    if (opts.length < 2) return toast("Add at least two answer options.", "danger");

    const duration = Number($("#np-duration").value);
    const visibility = $("#np-visibility").value;
    const created = poll({
      title,
      summary: $("#np-summary").value.trim() || "Citizen-submitted national opinion poll.",
      sector: $("#np-sector").value,
      status: "live",
      endsAt: inHours(duration),
      liveResults: visibility === "live",
      voters: 0,
      options: opts.map((label) => ({ label, votes: 0 })),
    });
    POLLS.unshift(created);
    closeModal();
    toast("Poll published and now live for voting.", "ok");
    state.adminTab = "polls";
    render();
  });
}

/* ---------------------------------------------------------------------------
   11. Header / role / boot
   ------------------------------------------------------------------------ */
function renderHeader() {
  const isAdmin = state.role === "admin";
  $$(".admin-only").forEach((el) => el.classList.toggle("hidden", !isAdmin));

  $$("#role-switch button").forEach((b) => b.classList.toggle("active", b.dataset.role === state.role));

  const authBtn = $("#auth-btn");
  const strip = $("#session-strip");
  if (state.user) {
    authBtn.textContent = "Sign out";
    authBtn.onclick = (e) => {
      e.preventDefault();
      state.user = null;
      renderHeader();
      toast("Signed out.", "");
      location.hash = "#/home";
    };
    strip.classList.remove("hidden");
    strip.innerHTML = `<span>Signed in as <strong>${esc(state.user.name)}</strong></span>
      <span class="pill">${esc(state.user.county)} County</span>
      <span class="pill">${esc(state.user.email)}</span>
      <span class="muted small">Your identity is never shown with your votes.</span>`;
  } else {
    authBtn.textContent = "Sign in";
    authBtn.onclick = null;
    strip.classList.add("hidden");
    strip.innerHTML = "";
  }
}

function boot() {
  document.body.classList.add("has-banner");
  $("#banner-close").addEventListener("click", () => {
    $("#prototype-banner").remove();
    document.body.classList.remove("has-banner");
  });

  $$("#role-switch button").forEach((b) =>
    b.addEventListener("click", () => {
      state.role = b.dataset.role;
      renderHeader();
      toast(state.role === "admin" ? "Viewing as administrator — full dashboards enabled." : "Viewing as a voter.", "");
      if (parseRoute().name === "admin" || parseRoute().name === "poll") render();
    })
  );

  window.addEventListener("hashchange", render);
  renderHeader();
  render();
}

boot();
