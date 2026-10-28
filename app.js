/* ============================================================================
   Maoni ya Mkenya — National Opinion & Polling Platform  v2.0
   Production-ready frontend SPA.

   Architecture (live): Next.js + Supabase (Postgres + Auth + RLS) on Vercel
   AI integration points marked with // [AI] throughout.
   ========================================================================== */

/* ---------------------------------------------------------------------------
   0. Utilities
   -------------------------------------------------------------------------- */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/** Escape untrusted text before injecting into HTML. */
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nfmt = (n) => Number(n || 0).toLocaleString('en-KE');

const HERO_IMAGE = './assets/nairobi_hero.jpg';
const AD_SACCO_IMG = './assets/ad_sacco.jpg';
const AD_TEA_IMG = './assets/ad_tea.jpg';

// Politician candidate images for photo popularity polls
const CAND_RUTO_IMG = './assets/cand_ruto.jpg';
const CAND_RAILA_IMG = './assets/cand_raila.jpg';
const CAND_KALONZO_IMG = './assets/cand_kalonzo.jpg';


const NOW = new Date();
const inHours = (h) => new Date(NOW.getTime() + h * 3600 * 1000);
const daysAgo = (d) => new Date(NOW.getTime() - d * 86400 * 1000);

function timeLeft(date) {
  const ms = new Date(date) - NOW;
  if (ms <= 0) return 'Closed';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (h >= 24) return `${Math.floor(h / 24)}d ${h % 24}h left`;
  if (h >= 1) return `${h}h ${m}m left`;
  return `${m}m left`;
}

function fmtDate(date) {
  return new Date(date).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' });
}

function fmtTime(date) {
  return new Date(date).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' });
}

/* ---------------------------------------------------------------------------
   1. Reference data
   -------------------------------------------------------------------------- */
const SECTORS = [
  { id: 'all',            name: 'All Sectors',                   ic: '🇰🇪' },
  { id: 'politics',       name: 'Politics & County Elections',   ic: '🗳️' },
  { id: 'presidency',     name: 'Presidency & Executive',        ic: '🏛️' },
  { id: 'parliament',     name: 'Parliament & Legislature',      ic: '⚖️' },
  { id: 'judiciary',      name: 'Judiciary',                     ic: '🧑‍⚖️' },
  { id: 'county',         name: 'County Governments & Devolution', ic: '🗺️' },
  { id: 'security',       name: 'Security & Defence',            ic: '🛡️' },
  { id: 'economy',        name: 'Economy, Finance & Tax',        ic: '💰' },
  { id: 'education',      name: 'Education',                     ic: '🎓' },
  { id: 'health',         name: 'Health',                        ic: '🏥' },
  { id: 'agriculture',    name: 'Agriculture & Food',            ic: '🌾' },
  { id: 'infrastructure', name: 'Infrastructure & Transport',    ic: '🛣️' },
  { id: 'energy',         name: 'Energy & Petroleum',            ic: '⚡' },
  { id: 'ict',            name: 'ICT & Digital Economy',         ic: '📱' },
  { id: 'youth',          name: 'Youth, Sports & Culture',       ic: '🎽' },
  { id: 'gender',         name: 'Gender & Social Protection',    ic: '🤝' },
  { id: 'land',           name: 'Land & Housing',                ic: '🏘️' },
  { id: 'environment',    name: 'Environment & Climate',         ic: '🌳' },
  { id: 'foreign',        name: 'Foreign Affairs & Diaspora',    ic: '🌍' },
  { id: 'constitution',   name: 'Constitution & Governance',     ic: '📜' },
  { id: 'other',          name: 'Other National Issues',         ic: '🗣️' },
];

const sectorName = (id) => (SECTORS.find((s) => s.id === id) || { name: 'General' }).name;
const sectorIcon = (id) => (SECTORS.find((s) => s.id === id) || { ic: '🗣️' }).ic;

const KENYA_COUNTIES = [
  'Baringo','Bomet','Bungoma','Busia','Elgeyo-Marakwet','Embu','Garissa','Homa Bay',
  'Isiolo','Kajiado','Kakamega','Kericho','Kiambu','Kilifi','Kirinyaga','Kisii',
  'Kisumu','Kitui','Kwale','Laikipia','Lamu','Machakos','Makueni','Mandera',
  'Marsabit','Meru','Migori','Mombasa','Murang\'a','Nairobi','Nakuru','Nandi',
  'Narok','Nyamira','Nyandarua','Nyeri','Samburu','Siaya','Taita-Taveta','Tana River',
  'Tharaka-Nithi','Trans Nzoia','Turkana','Uasin Gishu','Vihiga','Wajir','West Pokot',
];

/* ---------------------------------------------------------------------------
   2. Mock polls
   -------------------------------------------------------------------------- */
let POLL_ID = 100;
const mkPoll = (o) => ({ id: `p${++POLL_ID}`, votes: 0, createdAt: daysAgo(6), featured: false, ...o });

const POLLS = [
  mkPoll({
    id: 'p-popular-2027',
    title: '2027 Presidential Popularity: If elections were held today, who would you vote for?',
    summary: 'National opinion pulse on preferred presidential leadership ahead of 2027. Review verified candidate profiles, track voter turnout by county, and cast your single ballot.',
    sector: 'presidency',
    status: 'live',
    endsAt: inHours(72),
    featured: true,
    liveResults: false,
    coverImage: HERO_IMAGE,
    voters: 64820,
    options: [
      { label: 'Dr. William Ruto', subtitle: 'United Democratic Alliance (UDA)', image: CAND_RUTO_IMG, votes: 24510 },
      { label: 'Raila Odinga', subtitle: 'Azimio la Umoja / ODM', image: CAND_RAILA_IMG, votes: 23140 },
      { label: 'Kalonzo Musyoka', subtitle: 'Wiper Democratic Movement', image: CAND_KALONZO_IMG, votes: 12450 },
      { label: 'Undecided / Other Candidate', subtitle: 'Awaiting party coalition declarations', image: '', votes: 4720 },
    ],
  }),
  mkPoll({
    id: 'p-nairobi-gov-2027',
    title: 'Nairobi County Governor 2027: Who is your preferred choice for City Hall?',
    summary: 'Evaluating candidate popularity, city services delivery, water distribution, traffic management, and garbage collection in Nairobi City County.',
    sector: 'politics',
    status: 'live',
    endsAt: inHours(64),
    featured: true,
    liveResults: false,
    coverImage: HERO_IMAGE,
    voters: 39420,
    options: [
      { label: 'Johnson Sakaja', subtitle: 'Current Governor · UDA Coalition', image: CAND_RUTO_IMG, votes: 14210 },
      { label: 'Tim Wanyonyi', subtitle: 'MP Westlands · ODM / Azimio', image: CAND_RAILA_IMG, votes: 15380 },
      { label: 'Babu Owino', subtitle: 'MP Embakasi East · ODM', image: CAND_KALONZO_IMG, votes: 7620 },
      { label: 'Undecided / Independent Candidate', subtitle: 'Alternative independent leadership', image: '', votes: 2210 },
    ],
  }),
  mkPoll({
    id: 'p-mombasa-politics',
    title: 'Mombasa County: Rate your confidence in the County Executive and Port Economy priorities',
    summary: 'Citizen opinion on county leadership performance, blue economy jobs, waste management, and youth empowerment in Mombasa.',
    sector: 'politics',
    status: 'live',
    endsAt: inHours(80),
    voters: 21850,
    options: [
      { label: 'High confidence — county is on track', subtitle: 'Progress on healthcare & port city services', image: '', votes: 10420 },
      { label: 'Low confidence — want change in 2027', subtitle: 'Calls for faster economic turnaround', image: '', votes: 9140 },
      { label: 'Undecided / Awaiting delivery', subtitle: 'Monitoring implementation', image: '', votes: 2290 },
    ],
  }),
  mkPoll({
    id: 'p-nakuru-politics',
    title: 'Nakuru County 2027: Which political formation holds the strongest grassroots support?',
    summary: 'Grassroots political temperature on party coalition support across Nakuru County wards and agricultural zones.',
    sector: 'politics',
    status: 'live',
    endsAt: inHours(48),
    voters: 18760,
    options: [
      { label: 'Kenya Kwanza / UDA Coalition', subtitle: 'Incumbent coalition base', image: '', votes: 10210 },
      { label: 'Azimio / Opposition Coalition', subtitle: 'Opposition reform agenda', image: '', votes: 6180 },
      { label: 'Independent Candidates Movement', subtitle: 'Rejecting rigid party lines', image: '', votes: 2370 },
    ],
  }),
  mkPoll({
    title: 'Should the Presidential term be reduced from 5 years to 4 years?',
    summary: 'Debate on shortening the executive term and aligning it with the electoral cycle.',
    sector: 'presidency', status: 'live', endsAt: inHours(38), featured: true, liveResults: false,
    voters: 42318, options: [
      { label: 'Yes — reduce to 4 years', votes: 26840 },
      { label: 'No — keep 5 years', votes: 12970 },
      { label: 'Undecided', votes: 2508 },
    ],
  }),
  mkPoll({
    title: "Should MPs' monthly pay be capped at KSh 500,000?",
    summary: 'Public sentiment on capping parliamentary remuneration and benefits.',
    sector: 'parliament', status: 'live', endsAt: inHours(20), featured: true,
    voters: 38104, options: [
      { label: 'Yes — cap it', votes: 33210 },
      { label: 'No — keep current pay', votes: 3410 },
      { label: 'Cap it even lower', votes: 1484 },
    ],
  }),
  mkPoll({
    title: 'Do you have confidence in the Judiciary to handle election petitions fairly?',
    summary: 'Trust in courts and tribunals during disputed electoral outcomes.',
    sector: 'judiciary', status: 'live', endsAt: inHours(72),
    voters: 22980, options: [
      { label: 'High confidence', votes: 6420 },
      { label: 'Some confidence', votes: 8110 },
      { label: 'Low confidence', votes: 6090 },
      { label: 'No confidence at all', votes: 2360 },
    ],
  }),
  mkPoll({
    title: 'Should county governors be limited to a single 5-year term?',
    summary: 'Devolution debate on term limits for county executives.',
    sector: 'county', status: 'live', endsAt: inHours(52),
    voters: 18440, options: [
      { label: 'Yes — one term only', votes: 10420 },
      { label: 'No — allow two terms', votes: 6180 },
      { label: 'Not sure', votes: 1840 },
    ],
  }),
  mkPoll({
    title: 'Should the government scrap tax hikes on basic goods?',
    summary: 'Cost-of-living pressure from the Finance Act measures.',
    sector: 'economy', status: 'live', endsAt: inHours(14), featured: true,
    voters: 51290, options: [
      { label: 'Scrap the tax hikes', votes: 42330 },
      { label: 'Keep them, cut spending instead', votes: 6310 },
      { label: 'Reduce but do not scrap', votes: 2650 },
    ],
  }),
  mkPoll({
    title: 'Should Kenya replace CBC with a hybrid 8-4-4 model?',
    summary: 'Competency-Based Curriculum review and transition pressure.',
    sector: 'education', status: 'live', endsAt: inHours(96),
    voters: 29770, options: [
      { label: 'Keep CBC, fix funding', votes: 9840 },
      { label: 'Return to 8-4-4', votes: 10110 },
      { label: 'Hybrid model', votes: 8120 },
      { label: 'No opinion', votes: 1700 },
    ],
  }),
  mkPoll({
    title: 'Should health insurance contributions be mandatory for all Kenyans?',
    summary: 'Social Health Authority rollout and mandatory deductions.',
    sector: 'health', status: 'live', endsAt: inHours(30),
    voters: 21360, options: [
      { label: 'Yes — mandatory', votes: 6480 },
      { label: 'No — voluntary only', votes: 11420 },
      { label: 'Subsidise the poor instead', votes: 3460 },
    ],
  }),
  mkPoll({
    title: 'Do you support deploying Kenyan police to international peacekeeping missions?',
    summary: 'Overseas deployments, cost and security risk debate.',
    sector: 'security', status: 'live', endsAt: inHours(60),
    voters: 14980, options: [
      { label: 'Support', votes: 5190 },
      { label: 'Oppose', votes: 8120 },
      { label: 'Only if fully funded', votes: 1670 },
    ],
  }),
  mkPoll({
    title: 'Should the regulator cap mobile data prices?',
    summary: 'Affordability of internet access for citizens and small businesses.',
    sector: 'ict', status: 'live', endsAt: inHours(44),
    voters: 17660, options: [
      { label: 'Yes — cap prices', votes: 12980 },
      { label: 'No — let the market decide', votes: 4020 },
      { label: 'Cap only for students', votes: 660 },
    ],
  }),
  mkPoll({
    title: 'Should at least 10% of the national budget go to youth employment?',
    summary: 'Joblessness and youth-focused spending priorities.',
    sector: 'youth', status: 'live', endsAt: inHours(26),
    voters: 26110, options: [
      { label: 'Yes — ring-fence 10%', votes: 20140 },
      { label: 'No — too rigid', votes: 3870 },
      { label: 'Yes, but 5% is enough', votes: 2100 },
    ],
  }),
  /* Closed / archived polls */
  mkPoll({
    title: 'Should all land adjudication records be digitised nationally?',
    summary: 'Reducing land fraud through a national digital land registry.',
    sector: 'land', status: 'closed', endsAt: daysAgo(4), closedAt: daysAgo(4),
    voters: 33920, options: [
      { label: 'Yes — digitise everything', votes: 27100 },
      { label: 'No — keep manual records', votes: 3220 },
      { label: 'Yes, but county-by-county', votes: 3600 },
    ],
  }),
  mkPoll({
    title: 'Should the government subsidise fertiliser for all farmers?',
    summary: 'Food security and farm input affordability.',
    sector: 'agriculture', status: 'closed', endsAt: daysAgo(9), closedAt: daysAgo(9),
    voters: 24870, options: [
      { label: 'Yes — universal subsidy', votes: 17860 },
      { label: 'No — target the needy only', votes: 5210 },
      { label: 'Remove subsidies entirely', votes: 1800 },
    ],
  }),
  mkPoll({
    title: 'Do you support a 100% transition to renewable energy by 2030?',
    summary: 'Energy mix, geothermal and solar expansion.',
    sector: 'energy', status: 'closed', endsAt: daysAgo(12), closedAt: daysAgo(12),
    voters: 19440, options: [
      { label: 'Yes — accelerate', votes: 14320 },
      { label: 'No — too costly now', votes: 3110 },
      { label: 'Only if prices drop', votes: 2010 },
    ],
  }),
  mkPoll({
    title: 'Should the Constitution be amended through a popular initiative process?',
    summary: 'Governance reform and public participation standards.',
    sector: 'constitution', status: 'closed', endsAt: daysAgo(16), closedAt: daysAgo(16),
    voters: 41050, options: [
      { label: 'Yes — via popular initiative', votes: 21480 },
      { label: 'Only via Parliament', votes: 14420 },
      { label: 'No amendment needed', votes: 5150 },
    ],
  }),
  mkPoll({
    title: 'Should the ban on single-use plastics be expanded?',
    summary: 'Environmental protection versus business costs.',
    sector: 'environment', status: 'closed', endsAt: daysAgo(21), closedAt: daysAgo(21),
    voters: 15730, options: [
      { label: 'Yes — expand the ban', votes: 11940 },
      { label: 'No — too harsh on business', votes: 2640 },
      { label: 'Phase it in slowly', votes: 1150 },
    ],
  }),
];

const getPoll = (id) => POLLS.find((p) => p.id === id);
const totalVotes = (p) => p.options.reduce((s, o) => s + o.votes, 0);
const pct = (v, total) => (total ? Math.round((v / total) * 1000) / 10 : 0);

/* ---------------------------------------------------------------------------
   3. Ads, notifications, moderation
   -------------------------------------------------------------------------- */
let ADS = [
  {
    id: 'ad1', advertiser: 'Tumaini SACCO', status: 'live', placement: 'Home — top banner',
    headline: 'Grow your hustle with a Jipange Loan',
    body: 'Instant mobile loans from 8% p.a. Approved in minutes.',
    cta: 'Apply now', impressions: 184300, clicks: 5120,
    image: AD_SACCO_IMG,
  },
  {
    id: 'ad2', advertiser: 'Rift Valley Tea Exporters', status: 'live', placement: 'Poll feed — between cards',
    headline: 'Kenyan tea, world class',
    body: 'Buy premium single-origin tea direct from Kenyan farmers.',
    cta: 'Shop the harvest', impressions: 92110, clicks: 2380,
    image: AD_TEA_IMG,
  },
  {
    id: 'ad3', advertiser: 'Elimu Bora Trust', status: 'pending', placement: 'Archives — sidebar',
    headline: 'Fully funded scholarships 2026',
    body: 'Apply for university scholarships for bright, needy students.',
    cta: 'Check eligibility', impressions: 0, clicks: 0,
    image: AD_TEA_IMG,
  },
];

let NOTIFICATIONS = [
  { id: 'n1', unread: true, ic: '📢', title: 'Poll closed — results published', body: '"Should all land adjudication records be digitised nationally?" is closed. Tap to view final results.', at: daysAgo(0.2), href: '#/poll/p111' },
  { id: 'n2', unread: true, ic: '🗳️', title: 'New poll in Economy & Tax', body: '"Should the government scrap tax hikes on basic goods?" closes in 14 hours — cast your vote.', at: daysAgo(0.5), href: '#/poll/p105' },
  { id: 'n3', unread: false, ic: '✅', title: 'Your poll request was approved', body: 'Your request on water tariffs has been approved and scheduled for publication.', at: daysAgo(2), href: '#/support' },
  { id: 'n4', unread: false, ic: '🔒', title: 'Account secured', body: 'A new sign-in was detected on your account. If this was not you, reset your password.', at: daysAgo(5), href: '#/login' },
];

let MODERATION = [
  { id: 'm1', severity: 'high', reason: 'Violent incitement', excerpt: '…we should [removed] all of them in that community…', source: 'Support chat', at: daysAgo(0.1), status: 'open', score: 0.94 },
  { id: 'm2', severity: 'medium', reason: 'Ethnic generalisation', excerpt: '…those people from that region are all thieves…', source: 'Support chat', at: daysAgo(1.4), status: 'open', score: 0.81 },
  { id: 'm3', severity: 'low', reason: 'Harassment / insults', excerpt: '…you are an idiot, this platform is useless…', source: 'Support chat', at: daysAgo(3), status: 'resolved', score: 0.63 },
];

/* ---------------------------------------------------------------------------
   4. App state
   -------------------------------------------------------------------------- */
const state = {
  role: 'user',          // 'user' | 'admin'
  user: null,            // { name, email, county }
  sector: 'all',
  search: '',
  voted: {},             // pollId -> optionIndex
  archiveQuery: '',
  adminTab: 'overview',
  chat: [
    { who: 'bot', text: 'Karibu Maoni ya Mkenya 👋 I\'m your support assistant. You can ask me to run a poll on any issue that affects Kenyans, or report a problem.', at: new Date() },
    { who: 'bot', text: 'Try: "Please run a poll on water rationing in Nairobi." Every message is screened for hate speech and malicious content before reaching our team.', at: new Date() },
  ],
};

/* ---------------------------------------------------------------------------
   5. [AI] Content-safety — hate speech & malicious message screening
   Prototype: transparent keyword/heuristic rules.
   Production: server-side call to AI moderation API (Perspective API / OpenAI)
   + Kenya-context fine-tuned classifier + human review queue.
   -------------------------------------------------------------------------- */
const HATE_RULES = [
  { id: 'violence',    severity: 'high',   reason: 'Violent incitement',      score: 0.93, re: /\b(kill|burn|eliminate|exterminate|wipe out|massacre|behead|lynch)\b/i },
  { id: 'genocide',    severity: 'high',   reason: 'Incitement to violence',   score: 0.95, re: /\b(should (all )?be (killed|wiped out|eliminated)|deserve to die)\b/i },
  { id: 'ethnic-gen',  severity: 'medium', reason: 'Ethnic generalisation',    score: 0.8,  re: /\b(kikuyu|luo|luhya|kalenjin|kamba|kisii|somali|maasai|mijikenda|turkana|pokot|samburu|taita|embu|meru)\b[^.?!]{0,40}\b(are|is)\b[^.?!]{0,25}\b(thieves|useless|stupid|inferior|animals|criminals|dirty|violent|liars)\b/i },
  { id: 'hate-speech', severity: 'medium', reason: 'Hate speech',              score: 0.78, re: /\b(hate|despise)\b[^.?!]{0,25}\b(people|community|tribe|religion|muslims|christians)\b/i },
  { id: 'harassment',  severity: 'low',    reason: 'Harassment / insults',     score: 0.6,  re: /\b(idiot|stupid|imbecile|moron|foolish|useless idiot|shut up|nonsense person)\b/i },
  { id: 'mal-link',    severity: 'medium', reason: 'Malicious link / phishing', score: 0.72, re: /(bit\.ly|tinyurl|free-money|mpesa-reward-win|claim-your-cash|login-verify-)/i },
  { id: 'spam',        severity: 'low',    reason: 'Spam / repeat flooding',   score: 0.5,  re: /(.)\1{6,}|(\b\w+\b)(\s+\1){3,}/i },
];

function screenMessage(text) { // [AI]
  const clean = text.trim();
  for (const rule of HATE_RULES) {
    if (rule.re.test(clean)) return { allowed: false, rule };
  }
  const letters = clean.replace(/[^A-Za-z]/g, '');
  if (letters.length > 24 && letters === letters.toUpperCase()) {
    return { allowed: false, rule: { id: 'shouting', severity: 'low', reason: 'Aggressive all-caps message', score: 0.45 } };
  }
  return { allowed: true };
}

/* ---------------------------------------------------------------------------
   6. UI primitives
   -------------------------------------------------------------------------- */
function toast(text, kind = '', ms = 3800) {
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const ic = kind === 'danger' ? '⛔' : kind === 'ok' ? '✅' : 'ℹ️';
  el.innerHTML = `<span>${ic}</span><span>${esc(text)}</span>`;
  $('#toast-root').appendChild(el);
  setTimeout(() => {
    el.style.animation = 'none';
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity .25s, transform .25s';
    setTimeout(() => el.remove(), 260);
  }, ms);
}

function openModal(html) {
  $('#modal-root').innerHTML = `<div class="modal-backdrop" data-close><div class="modal">${html}</div></div>`;
  $('#modal-root').firstElementChild.addEventListener('click', (e) => {
    if (e.target.dataset.close !== undefined || e.target.closest('[data-close-x]')) closeModal();
  });
  // Prevent scroll on body
  document.body.style.overflow = 'hidden';
}

const closeModal = () => {
  $('#modal-root').innerHTML = '';
  document.body.style.overflow = '';
};

/* ---------------------------------------------------------------------------
   7. Shared partials
   -------------------------------------------------------------------------- */
function notice(kind, ic, title, body) {
  return `<div class="notice ${kind}"><span class="ic">${ic}</span><div><strong>${title}</strong>${body}</div></div>`;
}

function pollCard(p) {
  const live = p.status === 'live';
  const voted = state.voted[p.id] !== undefined;
  const total = totalVotes(p);
  const candWithImages = p.options.filter((o) => !!o.image);

  return `
  <article class="card poll-card" role="article">
    ${p.coverImage ? `
    <div class="poll-cover-wrap">
      <img src="${p.coverImage}" class="poll-cover" alt="${esc(p.title)}" loading="lazy" />
      <div class="poll-cover-overlay"></div>
    </div>` : ''}
    <div class="poll-top">
      <span class="tag ${live ? 'live' : 'closed'}">${live ? 'Live' : 'Closed'}</span>
      <span class="tag">${sectorIcon(p.sector)} ${esc(sectorName(p.sector))}</span>
      ${p.featured ? `<span class="tag sponsored">⭐ Featured</span>` : ''}
      ${candWithImages.length ? `<span class="tag info">📸 Candidates</span>` : ''}
    </div>
    <div class="poll-body">
      <h3 class="card-title">${esc(p.title)}</h3>
      <p class="card-desc">${esc(p.summary)}</p>
    </div>
    ${candWithImages.length ? `
    <div class="cand-preview-strip">
      <div class="cand-avatar-stack">
        ${candWithImages.slice(0, 4).map((o) => `
          <img src="${o.image}" class="cand-avatar-sm" alt="${esc(o.label)}" title="${esc(o.label)} (${esc(o.subtitle || '')})" />
        `).join('')}
        ${candWithImages.length > 4 ? `<span class="cand-avatar-more">+${candWithImages.length - 4}</span>` : ''}
      </div>
      <span class="cand-preview-label">${candWithImages.length} candidates · View & vote</span>
    </div>` : ''}
    <div class="poll-meta">
      <span>👥 <strong>${nfmt(total)}</strong> votes</span>
      <span>${live ? '⏳ ' + timeLeft(p.endsAt) : '🔒 Closed ' + fmtDate(p.closedAt || p.endsAt)}</span>
      ${voted ? `<span style="color:var(--ke-green);font-weight:700">✔ Voted</span>` : ''}
    </div>
    <div class="poll-foot">
      <a class="btn btn-sm ${live ? 'btn-primary' : 'btn-ghost'}" href="#/poll/${p.id}" id="poll-cta-${p.id}">
        ${live ? (candWithImages.length ? '🗳️ Vote for candidate' : '🗳️ Vote now') : '📊 View results'}
      </a>
      <a class="btn btn-sm btn-ghost" href="#/results/${p.id}" id="results-${p.id}">Results</a>
    </div>
  </article>`;
}

function adCard(ad) {
  return `
  <article class="ad-card">
    <div class="ad-media" style="background-image:url('${ad.image}')">
      <span class="ad-flag">Advertisement</span>
    </div>
    <div class="ad-body">
      <h4>${esc(ad.headline)}</h4>
      <p>${esc(ad.body)}</p>
      <div class="flex between center gap-8">
        <span class="small muted">Sponsored · ${esc(ad.advertiser)}</span>
        <button class="btn btn-sm btn-ghost" data-ad-click="${ad.id}" id="ad-btn-${ad.id}">${esc(ad.cta)}</button>
      </div>
    </div>
  </article>`;
}

function candidateCards(p, { interactive = false } = {}) {
  const total = totalVotes(p);
  return `
  <div class="cand-grid">
    ${p.options.map((o, i) => {
      const percent = pct(o.votes, total);
      const selected = state.voted[p.id] === i ? 'selected' : '';
      const showPct = !interactive || state.voted[p.id] !== undefined;
      const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e8ede9'/%3E%3Ctext x='50' y='60' font-size='42' text-anchor='middle' fill='%23637a72'%3E👤%3C/text%3E%3C/svg%3E";

      return `
      <div class="cand-card ${selected} ${!interactive ? 'locked' : ''}"
           ${interactive ? `data-opt="${i}"` : ''} id="opt-${p.id}-${i}" role="button" tabindex="0">
        <div class="cand-card-photo-wrap">
          <img src="${o.image || fallbackImg}" class="cand-card-photo" alt="${esc(o.label)}" loading="lazy" />
          <span class="cand-card-select-badge">✓</span>
          ${o.subtitle ? `<span class="cand-card-badge">${esc(o.subtitle)}</span>` : ''}
        </div>
        <div class="cand-card-body">
          <h4 class="cand-card-name">${esc(o.label)}</h4>
          ${o.subtitle ? `<div class="cand-card-role">${esc(o.subtitle)}</div>` : ''}
          ${showPct ? `
          <div class="cand-card-pct">
            <span>${percent}%</span>
            <span class="small muted" style="font-weight:500">(${nfmt(o.votes)} votes)</span>
          </div>
          <div class="cand-card-bar">
            <div class="cand-card-bar-fill" style="width:${percent}%"></div>
          </div>` : ''}
        </div>
      </div>`;
    }).join('')}
  </div>`;
}

function optionRows(p, { interactive = false } = {}) {
  const total = totalVotes(p);
  return p.options.map((o, i) => {
    const percent = pct(o.votes, total);
    const selected = state.voted[p.id] === i ? 'selected' : '';
    const showPct = !interactive || state.voted[p.id] !== undefined;
    return `
    <button class="option ${interactive ? '' : 'locked'} ${selected}"
            ${interactive ? `data-opt="${i}"` : 'disabled'} id="opt-${p.id}-${i}">
      ${interactive ? `<span class="radio"></span>` : ''}
      <span class="fill" style="width:${showPct ? percent : 0}%"></span>
      ${o.image ? `<img src="${o.image}" class="option-thumb" alt="${esc(o.label)}" />` : ''}
      <div class="option-text-group">
        <span class="option-label">${esc(o.label)}</span>
        ${o.subtitle ? `<span class="option-sub">${esc(o.subtitle)}</span>` : ''}
      </div>
      ${showPct ? `<span class="option-pct">${percent}%</span>` : ''}
    </button>`;
  }).join('');
}

function resultBars(p) {
  const total = totalVotes(p);
  const max = Math.max(...p.options.map((o) => o.votes));
  return p.options.map((o) => {
    const percent = pct(o.votes, total);
    return `
    <div class="bar-row">
      <div class="bar-top">
        <div class="flex center gap-8">
          ${o.image ? `<img src="${o.image}" class="bar-thumb" alt="${esc(o.label)}" />` : ''}
          <div>
            <strong>${esc(o.label)}</strong>
            ${o.subtitle ? `<span class="small muted" style="display:block;font-size:11px">${esc(o.subtitle)}</span>` : ''}
          </div>
        </div>
        <span class="muted">${nfmt(o.votes)} · <strong>${percent}%</strong></span>
      </div>
      <div class="bar-track"><div class="bar-fill ${o.votes === max ? 'lead' : ''}" style="width:${percent}%"></div></div>
    </div>`;
  }).join('');
}

/* ---------------------------------------------------------------------------
   8. Views
   -------------------------------------------------------------------------- */
const views = {};

/* --- Home ----------------------------------------------------------------- */
views.home = () => {
  const live = POLLS.filter((p) => p.status === 'live');
  const featured = live.filter((p) => p.featured);
  const totalVotesCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);
  const topPoll = live.reduce((a, b) => totalVotes(b) > totalVotes(a) ? b : a, live[0]);

  return `
  <section class="section">
    <div class="hero">
      <div class="hero-media" style="background-image:url('${HERO_IMAGE}')"></div>
      ${topPoll ? `<div class="hero-ticker">🔥 Trending: ${esc(topPoll.title.slice(0, 50))}…</div>` : ''}
      <div class="hero-content">
        <span class="hero-tag">🇰🇪 One verified account · One vote</span>
        <h1>Your voice on the issues that shape Kenya.</h1>
        <p>Vote on national opinion polls across every sector — leadership, government, the economy and beyond. Independent, transparent and accountable.</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="#/polls" id="hero-vote-btn">🗳️ Vote on live polls</a>
          <a class="btn btn-ghost" style="background:rgba(255,255,255,.14);color:#fff;border-color:rgba(255,255,255,.3)" href="#/support" id="hero-request-btn">💬 Request a poll</a>
        </div>
        <div class="hero-stats">
          <div class="hero-stat"><strong>${nfmt(totalVotesCast)}</strong><span>Votes cast</span></div>
          <div class="hero-stat"><strong>${POLLS.length}</strong><span>Polls published</span></div>
          <div class="hero-stat"><strong>${SECTORS.length - 1}</strong><span>Sectors covered</span></div>
        </div>
      </div>
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Live now</span><h2>Featured polls closing soon</h2></div>
      <a class="btn btn-sm btn-ghost" href="#/polls" id="home-see-all">See all →</a>
    </div>
    <div class="grid grid-2">
      ${featured.map(pollCard).join('')}
    </div>
  </section>

  <section class="section">
    <div class="grid grid-2">
      ${ADS.filter((a) => a.status === 'live').slice(0, 2).map(adCard).join('')}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Browse by sector</span><h2>Every area of national life</h2>
      <p>From the presidency to the environment — all 19 sectors covered.</p></div>
    </div>
    <div class="grid grid-3">
      ${SECTORS.filter((s) => s.id !== 'all').slice(0, 9).map((s) => {
        const n = POLLS.filter((p) => p.sector === s.id).length;
        const liveN = POLLS.filter((p) => p.sector === s.id && p.status === 'live').length;
        return `<a class="card card-pad" href="#/polls?sector=${s.id}" id="sector-${s.id}" style="cursor:pointer">
          <div class="flex center gap-8">
            <span style="font-size:22px">${s.ic}</span>
            <div>
              <strong style="font-size:13.5px;display:block">${esc(s.name)}</strong>
              <span class="small muted">${liveN} live · ${n} total</span>
            </div>
          </div>
        </a>`;
      }).join('')}
    </div>
    <div class="mt-12"><a class="btn btn-ghost btn-sm" href="#/polls" id="home-all-sectors">View all ${SECTORS.length - 1} sectors →</a></div>
  </section>

  <section class="section">
    <div class="grid grid-2">
      ${notice('info', '🔐', 'Why you can trust the numbers',
        'Votes are tied to one verified account, stored immutably and never edited. Live polls show how many Kenyans have voted; final results are published the moment polling closes.')}
      ${notice('warn', '📣', 'Want a poll on your issue?',
        'Use the support chat to request a poll on any matter affecting Kenyans. Requests are screened for hate speech and reviewed by our editorial team before publication.')}
    </div>
  </section>

  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">From the archives</span><h2>Recently closed</h2></div>
      <a class="btn btn-sm btn-ghost" href="#/archives" id="home-archive">Full archive →</a>
    </div>
    <div class="grid grid-2">
      ${POLLS.filter((p) => p.status === 'closed').slice(0, 2).map(pollCard).join('')}
    </div>
  </section>`;
};

/* --- Polls feed ----------------------------------------------------------- */
views.polls = (params) => {
  if (params.get('sector')) state.sector = params.get('sector');

  const q = state.search.toLowerCase().trim();
  let list = POLLS.filter((p) => state.sector === 'all' ? true : p.sector === state.sector);
  if (q) list = list.filter((p) => (p.title + p.summary + sectorName(p.sector)).toLowerCase().includes(q));
  const live = list.filter((p) => p.status === 'live');
  const closed = list.filter((p) => p.status === 'closed');

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Polling centre</span><h2>Live national polls</h2>
      <p>Vote once per poll. Final results are published when polling closes.</p></div>
    </div>
    <div class="field">
      <input class="input" id="poll-search" placeholder="🔍 Search polls or issues…" value="${esc(state.search)}" aria-label="Search polls" />
    </div>
    <div class="chip-row" id="sector-chips" role="tablist">
      ${SECTORS.map((s) => `<button class="chip ${state.sector === s.id ? 'active' : ''}" data-sector="${s.id}" role="tab" aria-selected="${state.sector === s.id}">${s.ic} ${esc(s.name)}</button>`).join('')}
    </div>
  </section>

  <section class="section">
    ${live.length ? `<div class="grid grid-2">${live.map(pollCard).join('')}</div>` : `
    <div class="card card-pad text-center" style="padding:28px">
      <div style="font-size:40px;margin-bottom:8px">🗳️</div>
      <h3 style="margin:0 0 6px">No live polls in this sector</h3>
      <p class="muted mb-0">Check the archives or request a new poll in support chat.</p>
      <div class="mt-12" style="display:flex;gap:8px;justify-content:center">
        <a class="btn btn-sm btn-primary" href="#/archives">View archives</a>
        <a class="btn btn-sm btn-ghost" href="#/support">Request a poll</a>
      </div>
    </div>`}
  </section>

  ${ADS.filter((a) => a.status === 'live').length ? `
  <section class="section">
    <div class="grid grid-2">
      ${ADS.filter((a) => a.status === 'live').slice(0, 2).map(adCard).join('')}
    </div>
  </section>` : ''}

  ${closed.length ? `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Recently closed</span><h2>From the archives</h2></div>
      <a class="btn btn-sm btn-ghost" href="#/archives">Full archive →</a>
    </div>
    <div class="grid grid-2">${closed.slice(0, 2).map(pollCard).join('')}</div>
  </section>` : ''}`;
};

/* --- Poll detail / voting ------------------------------------------------- */
views.poll = (_, id) => {
  const p = getPoll(id);
  if (!p) return `<div class="card card-pad" style="text-align:center;padding:32px">
    <div style="font-size:40px;margin-bottom:8px">🔍</div>
    <h3>Poll not found</h3>
    <p class="muted">This poll may have been removed or the link is incorrect.</p>
    <a class="btn btn-primary mt-12" href="#/polls">Browse live polls</a>
  </div>`;

  const live = p.status === 'live';
  const voted = state.voted[p.id] !== undefined;
  const total = totalVotes(p);
  const showResults = !live || p.liveResults || state.role === 'admin';
  const hasCandPhotos = p.options.some((o) => !!o.image);

  return `
  <section class="section">
    <a class="small muted" href="#/polls" id="back-polls" style="display:inline-flex;align-items:center;gap:5px;margin-bottom:12px">← Back to polls</a>
    ${p.coverImage ? `
    <div class="poll-cover-wrap mb-12" style="border-radius:var(--r);max-height:220px;box-shadow:var(--sh-s);margin-bottom:14px">
      <img src="${p.coverImage}" style="width:100%;height:220px;object-fit:cover" alt="${esc(p.title)}" />
    </div>` : ''}
    <div class="flex center gap-8 wrap">
      <span class="tag ${live ? 'live' : 'closed'}">${live ? 'Live' : 'Closed'}</span>
      <span class="tag">${sectorIcon(p.sector)} ${esc(sectorName(p.sector))}</span>
      <span class="tag info">👥 ${nfmt(total)} votes</span>
      <span class="tag">${live ? '⏳ ' + timeLeft(p.endsAt) : '🔒 Closed ' + fmtDate(p.closedAt || p.endsAt)}</span>
      ${hasCandPhotos ? `<span class="tag sponsored">📸 Photo Candidate Ballot</span>` : ''}
    </div>
    <h1 style="font-size:22px;margin:14px 0 6px;line-height:1.3;letter-spacing:-.01em">${esc(p.title)}</h1>
    <p class="muted" style="margin:0 0 16px;font-size:14px;line-height:1.6">${esc(p.summary)}</p>
  </section>

  <section class="section">
    ${live && !voted && state.role !== 'admin' ? notice('info', '🗳️', 'Cast your vote', hasCandPhotos ? 'Click on a candidate\'s photo card below to choose your preferred leader, then click Submit Vote.' : 'Select one option below. You can vote once — this cannot be undone.') : ''}
    ${live && voted ? notice('ok', '✅', 'Vote recorded', 'Thank you. Your vote is final. Results will be published when the poll closes and you will be notified.') : ''}
    ${live && !p.liveResults && state.role !== 'admin' && !voted ? `<div class="mt-12">${notice('warn', '🔒', 'Results sealed until polling closes', 'In line with our integrity rules, the full breakdown is published once the poll closes. You can still see total participation.')}</div>` : ''}
    ${!live ? `<div class="mt-12">${notice('ok', '📊', 'Final results published', 'This poll is closed. Results below are final and tamper-proof.')}</div>` : ''}

    <div class="card mt-12">
      ${hasCandPhotos ? `
        <div class="card-pad" style="padding-bottom:2px">
          <span class="eyebrow" style="color:var(--ke-green)">🇰🇪 Candidate Profiles &amp; Choice</span>
          <p class="small muted" style="margin:2px 0 0">Click on your preferred candidate to select them.</p>
        </div>
        ${candidateCards(p, { interactive: live && !voted && state.role !== 'admin' })}
      ` : `
        <div class="options" id="options">
          ${optionRows(p, { interactive: live && !voted && state.role !== 'admin' })}
        </div>
      `}
      ${live && !voted && state.role !== 'admin' ? `
      <div class="poll-foot">
        <button class="btn btn-primary btn-block" id="submit-vote" disabled>
          ${hasCandPhotos ? '🗳️ Submit candidate vote' : 'Submit vote'}
        </button>
      </div>` : ''}
      ${!live ? `<div class="card-pad" style="border-top:1px dashed var(--line)">
        <div class="small muted">Total votes cast</div>
        <strong style="font-size:24px;letter-spacing:-.02em">${nfmt(total)}</strong>
      </div>` : ''}
    </div>
  </section>

  ${showResults ? `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">${live ? 'Admin preview' : 'Final result'}</span><h2>Result breakdown</h2></div>
    </div>
    <div class="card card-pad">${resultBars(p)}</div>
  </section>` : `
  <section class="section">
    <div class="card card-pad">
      <h3 class="card-title">Results locked 🔒</h3>
      <p class="card-desc">Voter turnout so far: <strong>${nfmt(total)}</strong> Kenyans. The full breakdown will appear here when polling closes on ${fmtDate(p.endsAt)}.</p>
    </div>
  </section>`}

  <section class="section">
    <div class="section-head"><div><h2>More polls in ${esc(sectorName(p.sector))}</h2></div></div>
    <div class="grid grid-2">
      ${POLLS.filter((x) => x.sector === p.sector && x.id !== p.id).slice(0, 2).map(pollCard).join('') ||
        `<div class="card card-pad"><p class="muted mb-0">No other polls in this sector yet. <a href="#/support" style="color:var(--ke-green);font-weight:700">Request one →</a></p></div>`}
    </div>
  </section>`;
};

/* --- Results hub ---------------------------------------------------------- */
views.results = (_, id) => {
  if (id) {
    const p = getPoll(id);
    if (!p) return `<div class="card card-pad"><h3>Poll not found</h3></div>`;
    const closed = p.status === 'closed';
    return `
    <section class="section">
      <a class="small muted" href="#/results" id="back-results" style="display:inline-flex;align-items:center;gap:5px;margin-bottom:12px">← All results</a>
      <h1 style="font-size:20px;margin:0 0 4px;letter-spacing:-.01em">${esc(p.title)}</h1>
      <p class="muted small">${esc(sectorName(p.sector))} · ${closed ? 'Closed ' + fmtDate(p.closedAt || p.endsAt) : 'Live — results locked'}</p>
      ${closed
        ? notice('ok', '📊', 'Final results', `Based on ${nfmt(totalVotes(p))} verified votes.`)
        : notice('warn', '🔒', 'Results sealed', 'The full breakdown is published when the poll closes.')}
      <div class="card card-pad mt-12">${resultBars(p)}</div>
    </section>`;
  }

  const closed = POLLS.filter((p) => p.status === 'closed');
  const totalVotesCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">National results</span><h2>Published poll results</h2>
      <p>Final, tamper-proof outcomes for every closed poll.</p></div>
    </div>
    <div class="stat-grid cols-3">
      <div class="stat"><span>Votes recorded</span><strong>${nfmt(totalVotesCast)}</strong><small class="neutral">All polls to date</small></div>
      <div class="stat"><span>Polls published</span><strong>${POLLS.length}</strong><small class="neutral">${closed.length} closed · ${POLLS.length - closed.length} live</small></div>
      <div class="stat"><span>Sectors covered</span><strong>${SECTORS.length - 1}</strong><small class="neutral">Full national coverage</small></div>
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
            <p class="small muted">${nfmt(totalVotes(p))} votes · Closed ${fmtDate(p.closedAt || p.endsAt)}</p>
          </div>
          <div class="card-pad" style="border-top:1px dashed var(--line)">${resultBars(p)}</div>
          <div class="poll-foot"><a class="btn btn-sm btn-ghost" href="#/results/${p.id}">Open full result →</a></div>
        </article>`).join('')}
    </div>
  </section>`;
};

/* --- Archives ------------------------------------------------------------- */
views.archives = () => {
  const q = state.archiveQuery.toLowerCase().trim();
  const bySector = (sid) => POLLS.filter((p) => p.status === 'closed' && p.sector === sid)
    .filter((p) => !q || (p.title + p.summary).toLowerCase().includes(q));

  const grouped = SECTORS.filter((s) => s.id !== 'all').map((s) => ({ s, items: bySector(s.id) })).filter((g) => g.items.length);
  const totalArchived = POLLS.filter((p) => p.status === 'closed').length;
  const totalArchivedVotes = POLLS.filter((p) => p.status === 'closed').reduce((s, p) => s + totalVotes(p), 0);

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Archive</span><h2>Past polls & results</h2>
      <p>A permanent, searchable record of every closed poll.</p></div>
    </div>
    <div class="field">
      <input class="input" id="archive-search" placeholder="🔍 Search archived polls…" value="${esc(state.archiveQuery)}" aria-label="Search archives" />
    </div>
    <div class="grid grid-2">
      ${notice('info', '🔒', 'Records cannot be altered',
        'Closed polls are archived permanently. Vote counts are locked; any edit attempt is logged for audit.').replace(/\n/g, '')}
      <div class="card card-pad">
        <span class="eyebrow">Archive summary</span>
        <div class="stat-grid mt-8" style="grid-template-columns:repeat(2,1fr)">
          <div><div class="small muted">Archived polls</div><strong style="font-size:22px">${totalArchived}</strong></div>
          <div><div class="small muted">Votes archived</div><strong style="font-size:22px">${nfmt(totalArchivedVotes)}</strong></div>
        </div>
      </div>
    </div>
  </section>

  ${grouped.length
    ? grouped.map(({ s, items }) => `
      <section class="section">
        <div class="section-head">
          <div><h2>${s.ic} ${esc(s.name)}</h2></div>
          <span class="tag closed">${items.length} archived</span>
        </div>
        <div class="grid grid-2">${items.map(pollCard).join('')}</div>
      </section>`).join('')
    : `<div class="card card-pad text-center" style="padding:28px">
        <div style="font-size:40px;margin-bottom:8px">🗄️</div>
        <h3>No results for "${esc(state.archiveQuery)}"</h3>
        <p class="muted">Try a different search term or browse all archived polls.</p>
       </div>`}`;
};

/* --- Notifications -------------------------------------------------------- */
views.notifications = () => {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Alerts</span><h2>Notifications</h2>
      <p>${unread ? `<strong>${unread} unread</strong>` : 'No unread notifications'} · You are notified when followed polls close.</p></div>
      ${unread ? `<button class="btn btn-sm btn-ghost" id="mark-all">Mark all read</button>` : ''}
    </div>
    <div class="list">
      ${NOTIFICATIONS.map((n) => `
        <a class="list-row ${n.unread ? 'unread' : ''}" href="${n.href}" data-notif="${n.id}" id="notif-${n.id}">
          <span class="lr-ic">${n.ic}</span>
          <span class="lr-main"><strong>${esc(n.title)}</strong><span>${esc(n.body)}</span></span>
          <span class="small muted" style="white-space:nowrap;flex-shrink:0">${fmtDate(n.at)}</span>
        </a>`).join('')}
    </div>
    <div class="mt-16">${notice('info', '🔔', 'Notification channels', 'In-app notifications are live. Email and SMS (opt-in) via Africa\'s Talking will be added for poll-close alerts.')}</div>
  </section>`;
};

/* --- Support / Chat ------------------------------------------------------- */
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
            <div class="msg ${m.who === 'me' ? 'me' : m.who === 'blocked' ? 'blocked' : 'bot'}">
              ${esc(m.text)}<span class="msg-time">${fmtTime(m.at)}</span>
            </div>`).join('')}
        </div>
        <form class="chat-input" id="chat-form">
          <input id="chat-input" placeholder="e.g. Please run a poll on water rationing…" autocomplete="off" />
          <button class="btn btn-primary" type="submit" id="chat-send-btn">Send</button>
        </form>
      </div>

      <div class="grid" style="gap:12px">
        <div class="card card-pad">
          <span class="eyebrow">How to request a poll</span>
          <ol class="small muted" style="padding-left:18px;margin:10px 0 0;line-height:1.8">
            <li>Tell us the issue and the sector it belongs to.</li>
            <li>Suggest the answer options (2–4 works best).</li>
            <li>Our AI screens the request for hate speech.</li>
            <li>An editor reviews and approves it, then it goes live.</li>
          </ol>
        </div>
        <div class="card card-pad">
          <span class="eyebrow">Content safety</span>
          <p class="small muted mt-8 mb-0">Messages containing incitement, ethnic generalisation, harassment, phishing links or spam are automatically blocked and flagged to our moderation queue — in line with the Kenya Data Protection Act, 2019 and the NCIC Act.</p>
        </div>
        <button class="btn btn-dark btn-block" id="demo-flag">🧪 Try a blocked-message demo</button>
      </div>
    </div>
  </section>`;

/* --- Auth ----------------------------------------------------------------- */
views.login = () => `
  <section class="section auth-shell">
    <div class="card card-pad">
      <span class="eyebrow">Welcome back</span>
      <h2 style="margin:6px 0 4px;letter-spacing:-.01em">Sign in to vote</h2>
      <p class="small muted" style="margin:0 0 18px">One verified account, one vote. Your vote is anonymous in published results.</p>
      <form id="login-form">
        <div class="field"><label for="li-email">Email address</label><input class="input" id="li-email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label for="li-pass">Password</label><input class="input" id="li-pass" type="password" placeholder="••••••••" required /></div>
        <button class="btn btn-primary btn-block" type="submit" id="login-submit-btn">Sign in</button>
      </form>
      <div class="divider-text">or</div>
      <div class="auth-switch">New here? <a href="#/signup" id="goto-signup">Create a free account →</a></div>
    </div>
    <div class="mt-16">${notice('info', '🔐', 'Verified participation', 'Accounts are protected by email verification and device fingerprinting so each Kenyan votes once per poll.')}</div>
  </section>`;

views.signup = () => `
  <section class="section auth-shell">
    <div class="card card-pad">
      <span class="eyebrow">Join the platform</span>
      <h2 style="margin:6px 0 4px;letter-spacing:-.01em">Create your account</h2>
      <p class="small muted" style="margin:0 0 18px">Free for all Kenyans. Vote on national polls and request new ones.</p>
      <form id="signup-form">
        <div class="form-row two">
          <div class="field"><label for="su-name">Full name</label><input class="input" id="su-name" placeholder="Jane Wanjiku" required /></div>
          <div class="field"><label for="su-county">County</label>
            <select class="input" id="su-county">
              ${KENYA_COUNTIES.map((c) => `<option>${c}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="field"><label for="su-email">Email address</label><input class="input" id="su-email" type="email" placeholder="you@example.com" required /></div>
        <div class="field"><label for="su-pass">Password</label><input class="input" id="su-pass" type="password" placeholder="At least 8 characters" required />
          <div class="hint">Your identity is never shown with your votes.</div>
        </div>
        <button class="btn btn-primary btn-block" type="submit" id="signup-submit-btn">Create account</button>
      </form>
      <div class="auth-switch">Already registered? <a href="#/login" id="goto-login">Sign in →</a></div>
    </div>
    <div class="mt-16">${notice('info', '📜', 'Your data, your rights', 'You may access, correct or delete your data at any time, per the Kenya Data Protection Act, 2019 (ODPC).')}</div>
  </section>`;

/* --- Admin ---------------------------------------------------------------- */
views.admin = () => {
  if (state.role !== 'admin') {
    return `<section class="section auth-shell">
      <div class="card card-pad">
        <span class="eyebrow">Restricted area</span>
        <h2 style="margin:6px 0 6px;letter-spacing:-.01em">Admin access only</h2>
        <p class="small muted">Results dashboards, poll creation, ad management and moderation are limited to administrators.</p>
        <div class="mt-12">${notice('danger', '🔒', 'Access denied', 'Switch to the Admin role (top-right toggle) or sign in with an administrator account.')}</div>
        <button class="btn btn-dark btn-block mt-12" id="goto-admin-role" style="margin-top:16px">Preview as Admin</button>
      </div>
    </section>`;
  }

  const tabs = [
    ['overview',   '📊 Overview'],
    ['polls',      '🗳️ Polls'],
    ['ads',        '📣 Ads'],
    ['moderation', '🛡️ Moderation'],
    ['chat',       '💬 Requests'],
  ];

  const body = {
    overview:   adminOverview,
    polls:      adminPolls,
    ads:        adminAds,
    moderation: adminModeration,
    chat:       adminChat,
  }[state.adminTab]();

  return `
  <section class="section">
    <div class="section-head">
      <div><span class="eyebrow">Administration</span><h2>Control centre</h2>
      <p>Data analytics, poll management, advertising and content safety.</p></div>
      <span class="tag ok">Admin session</span>
    </div>
    <div class="tabs">
      ${tabs.map(([id, label]) => `<button data-admin-tab="${id}" class="${state.adminTab === id ? 'active' : ''}" id="tab-${id}">${label}</button>`).join('')}
    </div>
    ${body}
  </section>`;
};

function adminOverview() {
  const live = POLLS.filter((p) => p.status === 'live');
  const totalCast = POLLS.reduce((s, p) => s + totalVotes(p), 0);
  const openFlags = MODERATION.filter((m) => m.status === 'open').length;
  const impressions = ADS.reduce((s, a) => s + a.impressions, 0);
  const clicks = ADS.reduce((s, a) => s + a.clicks, 0);
  const ctr = impressions ? ((clicks / impressions) * 100).toFixed(2) : '0';

  const bySector = SECTORS.filter((s) => s.id !== 'all')
    .map((s) => ({ s, n: POLLS.filter((p) => p.sector === s.id).reduce((t, p) => t + totalVotes(p), 0) }))
    .filter((x) => x.n > 0)
    .sort((a, b) => b.n - a.n);
  const maxSector = Math.max(...bySector.map((x) => x.n), 1);

  return `
  <div class="stat-grid">
    <div class="stat"><span>Total votes</span><strong>${nfmt(totalCast)}</strong><small>+12.4% this week</small></div>
    <div class="stat"><span>Live polls</span><strong>${live.length}</strong><small class="neutral">${POLLS.length - live.length} archived</small></div>
    <div class="stat"><span>Open flags</span><strong>${openFlags}</strong><small class="down">${openFlags > 0 ? 'Needs review' : 'Queue clear'}</small></div>
    <div class="stat"><span>Ad CTR</span><strong>${ctr}%</strong><small class="neutral">${nfmt(impressions)} impressions</small></div>
  </div>

  <div class="grid grid-2 mt-16">
    <div class="card card-pad">
      <div class="section-head"><div><span class="eyebrow">Engagement</span><h2 style="font-size:15px">Votes by sector</h2></div></div>
      ${bySector.map((x) => `
        <div class="bar-row">
          <div class="bar-top"><strong>${x.s.ic} ${esc(x.s.name)}</strong><span class="muted">${nfmt(x.n)}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${Math.round((x.n / maxSector) * 100)}%"></div></div>
        </div>`).join('')}
    </div>
    <div class="card card-pad">
      <div class="section-head"><div><span class="eyebrow">Turnout</span><h2 style="font-size:15px">Daily participation (7 days)</h2></div></div>
      ${[62, 74, 58, 81, 96, 88, 100].map((v, i) => `
        <div class="bar-row">
          <div class="bar-top"><strong>Day ${i + 1}</strong><span class="muted">${nfmt(Math.round(v * 412))} votes</span></div>
          <div class="bar-track"><div class="bar-fill ${i === 6 ? 'lead' : ''}" style="width:${v}%"></div></div>
        </div>`).join('')}
      <div class="mt-12">${notice('info', '🤖', 'AI insight', 'Taxation and parliamentary pay polls are driving the highest turnout this week. Consider scheduling a follow-up on the cost of living.')}</div>
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
              <td><a href="#/poll/${p.id}"><strong>${esc(p.title.slice(0, 46))}${p.title.length > 46 ? '…' : ''}</strong></a></td>
              <td>${esc(sectorName(p.sector))}</td>
              <td><strong>${nfmt(total)}</strong></td>
              <td>${timeLeft(p.endsAt)}</td>
              <td>${esc(lead.label)} <span class="muted">(${pct(lead.votes, total)}%)</span></td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function adminPolls() {
  return `
  <div class="flex between center wrap gap-8">
    <div><span class="eyebrow">Manage</span><h2 style="font-size:15px;margin:4px 0 0">All polls</h2></div>
    <button class="btn btn-primary btn-sm" id="new-poll" style="gap:6px">＋ Create poll</button>
  </div>

  <div class="card card-pad mt-12">
    <strong style="font-size:14px">Result visibility policy</strong>
    <p class="small muted" style="margin:6px 0 10px">Controls what voters see while a poll is live.</p>
    <div class="flex gap-8 wrap">
      <button class="chip" data-policy="turnout">Turnout only (recommended)</button>
      <button class="chip" data-policy="live">Live full results</button>
      <button class="chip active" data-policy="closed">Publish on close + notify</button>
    </div>
    <div class="hint">Current: <strong>publish on close + notify</strong> — voters see participant count live, then full results after close with a push notification.</div>
  </div>

  <div class="table-scroll mt-16">
    <table>
      <thead><tr><th>Poll</th><th>Sector</th><th>Status</th><th>Votes</th><th>Closes</th><th>Actions</th></tr></thead>
      <tbody>
        ${POLLS.map((p) => `<tr>
          <td><strong>${esc(p.title.slice(0, 44))}${p.title.length > 44 ? '…' : ''}</strong></td>
          <td>${esc(sectorName(p.sector))}</td>
          <td><span class="tag ${p.status === 'live' ? 'live' : 'closed'}">${p.status === 'live' ? 'Live' : 'Closed'}</span></td>
          <td>${nfmt(totalVotes(p))}</td>
          <td>${p.status === 'live' ? timeLeft(p.endsAt) : fmtDate(p.closedAt || p.endsAt)}</td>
          <td style="display:flex;gap:6px;flex-wrap:wrap">
            <button class="btn btn-sm btn-ghost" data-toggle-poll="${p.id}">${p.status === 'live' ? 'Close now' : 'Reopen'}</button>
            <button class="btn btn-sm btn-ghost" data-edit-poll="${p.id}">Edit</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

function adminAds() {
  const totalImpressions = ADS.reduce((s, a) => s + a.impressions, 0);
  const totalClicks = ADS.reduce((s, a) => s + a.clicks, 0);

  return `
  <div class="flex between center wrap gap-8">
    <div><span class="eyebrow">Monetisation</span><h2 style="font-size:15px;margin:4px 0 0">Advertising</h2>
    <p class="small muted" style="margin:4px 0 0">Sponsored placements across home, poll feed and archives. Always clearly labelled.</p></div>
    <button class="btn btn-primary btn-sm" id="new-ad">＋ New campaign</button>
  </div>
  <div class="stat-grid mt-12" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat"><span>Total impressions</span><strong>${nfmt(totalImpressions)}</strong></div>
    <div class="stat"><span>Total clicks</span><strong>${nfmt(totalClicks)}</strong></div>
    <div class="stat"><span>Avg. CTR</span><strong>${totalImpressions ? ((totalClicks / totalImpressions) * 100).toFixed(2) : '0.00'}%</strong></div>
  </div>
  <div class="grid grid-2 mt-16">
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
            <span>CTR ${a.impressions ? ((a.clicks / a.impressions) * 100).toFixed(2) : '0.00'}%</span>
          </div>
          <div class="flex gap-8 mt-12">
            <button class="btn btn-sm ${a.status === 'live' ? 'btn-ghost' : 'btn-primary'}" data-toggle-ad="${a.id}">${a.status === 'live' ? 'Pause' : 'Approve & launch'}</button>
            <button class="btn btn-sm btn-ghost" data-edit-ad="${a.id}">Edit</button>
          </div>
        </div>
      </div>`).join('')}
  </div>
  <div class="mt-16">${notice('info', '💰', 'Billing', 'Campaigns are billed per impression/click via Stripe. Advertisers get a self-serve dashboard; ad content is screened before approval.')}</div>`;
}

function adminModeration() {
  const sevClass = { high: 'danger', medium: 'warn', low: 'info' };
  return `
  <div class="section-head">
    <div><span class="eyebrow">Content safety</span><h2 style="font-size:15px">Flagged messages</h2>
    <p class="small muted">Automatically flagged by the AI content-safety screen, awaiting human review.</p></div>
  </div>
  ${MODERATION.length
    ? `<div class="list">${MODERATION.map((m) => `
        <div class="list-row ${m.status === 'open' ? 'unread' : ''}">
          <span class="lr-ic">${m.severity === 'high' ? '🚨' : m.severity === 'medium' ? '⚠️' : '💬'}</span>
          <span class="lr-main">
            <strong>${esc(m.reason)} <span class="tag ${sevClass[m.severity]}">${m.severity}</span></strong>
            <span>"${esc(m.excerpt)}" — ${esc(m.source)}, ${fmtDate(m.at)}</span>
            <span class="small muted">AI confidence ${(m.score * 100).toFixed(0)}% · status: ${m.status}</span>
          </span>
          <span class="flex gap-8" style="flex-shrink:0">
            ${m.status === 'open'
              ? `<button class="btn btn-sm btn-ghost" data-resolve="${m.id}">Resolve</button><button class="btn btn-sm btn-red" data-block="${m.id}">Block user</button>`
              : `<span class="tag ok">Resolved</span>`}
          </span>
        </div>`).join('')}</div>`
    : `<div class="card card-pad text-center"><p class="muted mb-0">No flagged messages. The moderation queue is clear ✅</p></div>`}
  <div class="mt-16">${notice('warn', '🛡️', 'Escalation policy', 'High-severity flags are escalated to the duty moderator immediately and, where required by law, reported to the relevant authority (NCIC / DCI).')}</div>`;
}

function adminChat() {
  const requests = state.chat.filter((m) => m.who === 'me' && m.request);
  const blocked = state.chat.filter((m) => m.who === 'blocked');
  return `
  <div class="section-head">
    <div><span class="eyebrow">Inbox</span><h2 style="font-size:15px">Poll requests from citizens</h2>
    <p class="small muted">Review, approve and schedule citizen-requested polls.</p></div>
  </div>
  <div class="stat-grid mt-8" style="grid-template-columns:repeat(3,1fr)">
    <div class="stat"><span>Requests received</span><strong>${requests.length}</strong></div>
    <div class="stat"><span>Blocked messages</span><strong>${blocked.length}</strong><small class="down">Auto-filtered</small></div>
    <div class="stat"><span>Avg. review time</span><strong>3h</strong><small class="neutral">Within SLA</small></div>
  </div>
  <div class="list mt-16">
    ${requests.length
      ? requests.map((r, i) => `
        <div class="list-row">
          <span class="lr-ic">📝</span>
          <span class="lr-main"><strong>${esc(r.text.slice(0, 80))}${r.text.length > 80 ? '…' : ''}</strong>
          <span>Submitted by a verified user · ${new Date(r.at).toLocaleString('en-KE')}</span></span>
          <span class="flex gap-8" style="flex-shrink:0"><button class="btn btn-sm btn-primary" data-approve-req="${i}">Approve</button><button class="btn btn-sm btn-ghost">Decline</button></span>
        </div>`).join('')
      : `<div class="card card-pad"><p class="muted mb-0">No citizen requests yet. Requests submitted through the support chat appear here.</p></div>`}
  </div>`;
}

/* ---------------------------------------------------------------------------
   9. Router
   -------------------------------------------------------------------------- */
function parseRoute() {
  const raw = location.hash.replace(/^#\/?/, '') || 'home';
  const [path, query] = raw.split('?');
  const parts = path.split('/').filter(Boolean);
  return { name: parts[0] || 'home', id: parts[1] || null, params: new URLSearchParams(query || '') };
}

function render() {
  const { name, id, params } = parseRoute();
  if (name === 'polls' && params.get('sector')) state.sector = params.get('sector');

  const view = views[name] || views.home;
  $('#view').innerHTML = view(params, id);

  // Nav highlighting
  $$('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === name));

  updateBadge();
  bindView(name, id);
  window.scrollTo({ top: 0, behavior: 'instant' });

  // Keep chat pinned to newest message
  const log = $('#chat-log');
  if (log) log.scrollTop = log.scrollHeight;

  // Update page title
  const titles = {
    home:          'Maoni ya Mkenya — Kenya\'s National Opinion Platform',
    polls:         'Live Polls — Maoni ya Mkenya',
    archives:      'Poll Archives — Maoni ya Mkenya',
    results:       'Published Results — Maoni ya Mkenya',
    support:       'Support & Poll Requests — Maoni ya Mkenya',
    admin:         'Admin Control Centre — Maoni ya Mkenya',
    login:         'Sign In — Maoni ya Mkenya',
    signup:        'Create Account — Maoni ya Mkenya',
    notifications: 'Notifications — Maoni ya Mkenya',
    poll:          'Poll — Maoni ya Mkenya',
  };
  document.title = titles[name] || titles.home;
}

function updateBadge() {
  const n = NOTIFICATIONS.filter((x) => x.unread).length;
  const el = $('#notif-count');
  if (el) { el.textContent = n; el.classList.toggle('hidden', n === 0); }
}

/* ---------------------------------------------------------------------------
   10. View bindings
   -------------------------------------------------------------------------- */
function bindView(name, id) {
  /* ---- Auth ---- */
  const signup = $('#signup-form');
  if (signup) signup.addEventListener('submit', (e) => {
    e.preventDefault();
    state.user = {
      name: $('#su-name').value || 'New Voter',
      email: $('#su-email').value,
      county: $('#su-county').value,
    };
    state.role = 'user';
    renderHeader();
    toast('Account created. Welcome to Maoni ya Mkenya! 🎉', 'ok');
    location.hash = '#/polls';
  });

  const login = $('#login-form');
  if (login) login.addEventListener('submit', (e) => {
    e.preventDefault();
    state.user = { name: 'Signed-in Kenyan', email: $('#li-email').value, county: 'Nairobi' };
    state.role = 'user';
    renderHeader();
    toast('Signed in successfully. Welcome back!', 'ok');
    location.hash = '#/polls';
  });

  const gotoAdmin = $('#goto-admin-role');
  if (gotoAdmin) gotoAdmin.addEventListener('click', () => {
    state.role = 'admin';
    renderHeader();
    toast('Viewing as administrator — full dashboards enabled.', 'ok');
    render();
  });

  /* ---- Poll search & sector filter ---- */
  const search = $('#poll-search');
  if (search) search.addEventListener('input', (e) => {
    state.search = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const s2 = $('#poll-search');
    if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
  });

  $$('[data-sector]').forEach((btn) =>
    btn.addEventListener('click', () => {
      state.sector = btn.dataset.sector;
      location.hash = `#/polls?sector=${state.sector}`;
      if (parseRoute().name === 'polls') render();
    })
  );

  const archiveSearch = $('#archive-search');
  if (archiveSearch) archiveSearch.addEventListener('input', (e) => {
    state.archiveQuery = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const s2 = $('#archive-search');
    if (s2) { s2.focus(); s2.setSelectionRange(pos, pos); }
  });

  /* ---- Poll voting ---- */
  const optBtns = $$('[data-opt]');
  if (optBtns.length) {
    let chosen = null;
    optBtns.forEach((b) =>
      b.addEventListener('click', () => {
        optBtns.forEach((x) => x.classList.remove('selected'));
        b.classList.add('selected');
        chosen = Number(b.dataset.opt);
        const submit = $('#submit-vote');
        if (submit) submit.disabled = false;
      })
    );
    const submit = $('#submit-vote');
    if (submit) submit.addEventListener('click', () => {
      const { id: pid } = parseRoute();
      const p = getPoll(pid);
      if (!p || chosen === null) return;
      p.options[chosen].votes += 1;
      p.voters += 1;
      state.voted[p.id] = chosen;
      render();
      toast('Vote recorded. Final results will be published when polling closes. ✅', 'ok');
    });
  }

  /* ---- Notifications ---- */
  const markAll = $('#mark-all');
  if (markAll) markAll.addEventListener('click', () => {
    NOTIFICATIONS.forEach((n) => (n.unread = false));
    render();
    toast('All notifications marked as read.', 'ok');
  });

  $$('[data-notif]').forEach((a) =>
    a.addEventListener('click', () => {
      const n = NOTIFICATIONS.find((x) => x.id === a.dataset.notif);
      if (n) n.unread = false;
      updateBadge();
    })
  );

  /* ---- Support chat ---- */
  const chatForm = $('#chat-form');
  if (chatForm) chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = $('#chat-input');
    const text = input.value.trim();
    if (!text) return;
    input.value = '';

    const result = screenMessage(text); // [AI]
    if (!result.allowed) {
      state.chat.push({
        who: 'blocked',
        text: `🚫 Message blocked — ${result.rule.reason}. Our AI content screen flagged this message (confidence ${(result.rule.score * 100).toFixed(0)}%). Repeated violations may lead to account suspension.`,
        at: new Date(),
        blocked: true,
      });
      MODERATION.unshift({
        id: `m${Date.now()}`,
        severity: result.rule.severity,
        reason: result.rule.reason,
        excerpt: text.slice(0, 120),
        source: 'Support chat',
        at: new Date(),
        status: 'open',
        score: result.rule.score,
      });
      render();
      toast('Message blocked and flagged for review.', 'danger');
      return;
    }

    const isRequest = /\b(poll|vote|survey|ballot|ask|opinion)\b/i.test(text);
    state.chat.push({ who: 'me', text, at: new Date(), request: isRequest });
    state.chat.push({
      who: 'bot',
      at: new Date(),
      text: isRequest
        ? 'Thank you — I\'ve logged your poll request and sent it to our editorial team for review. Approved requests are published within 24–48 hours. Would you like to suggest the answer options?'
        : 'Thanks for reaching out. A member of our team will respond shortly. If you\'d like a poll published, just say "run a poll on …".',
    });
    render();
  });

  const demo = $('#demo-flag');
  if (demo) demo.addEventListener('click', () => {
    $('#chat-input').value = 'We should burn all of them from that community!';
    $('#chat-input').focus();
    toast('Now press Send to see the AI screen block it.', '');
  });

  /* ---- Admin tabs ---- */
  $$('[data-admin-tab]').forEach((b) =>
    b.addEventListener('click', () => { state.adminTab = b.dataset.adminTab; render(); })
  );

  $$('[data-policy]').forEach((c) =>
    c.addEventListener('click', () => {
      $$('[data-policy]').forEach((x) => x.classList.remove('active'));
      c.classList.add('active');
      toast(`Result visibility set to "${c.textContent.trim()}".`, 'ok');
    })
  );

  const newPoll = $('#new-poll');
  if (newPoll) newPoll.addEventListener('click', openCreatePollModal);

  $$('[data-toggle-poll]').forEach((b) =>
    b.addEventListener('click', () => {
      const p = getPoll(b.dataset.togglePoll);
      p.status = p.status === 'live' ? 'closed' : 'live';
      if (p.status === 'closed') p.closedAt = new Date();
      if (p.status === 'live') { p.endsAt = inHours(24); p.liveResults = false; }
      render();
      toast(p.status === 'closed'
        ? 'Poll closed. Results published and voters notified.'
        : 'Poll reopened and now live.', 'ok');
    })
  );

  $$('[data-edit-poll]').forEach((b) =>
    b.addEventListener('click', () => {
      const p = getPoll(b.dataset.editPoll);
      openModal(`
        <div class="modal-head"><h3>Edit poll</h3><button class="x-btn" data-close-x>×</button></div>
        <div class="modal-body">
          <div class="field"><label>Title</label><input class="input" value="${esc(p.title)}" /></div>
          <div class="field"><label>Summary</label><textarea class="input">${esc(p.summary)}</textarea></div>
          <div class="field"><label>Sector</label>
            <select class="input">${SECTORS.filter((s) => s.id !== 'all').map((s) => `<option ${s.id === p.sector ? 'selected' : ''}>${esc(s.name)}</option>`).join('')}</select>
          </div>
          <div class="hint">Edits to live polls are logged for audit. Vote counts can never be edited.</div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Save changes</button></div>`);
    })
  );

  const newAd = $('#new-ad');
  if (newAd) newAd.addEventListener('click', () =>
    openModal(`
      <div class="modal-head"><h3>New ad campaign</h3><button class="x-btn" data-close-x>×</button></div>
      <div class="modal-body">
        <div class="field"><label>Advertiser</label><input class="input" placeholder="Company name" /></div>
        <div class="field"><label>Headline</label><input class="input" placeholder="Short attention-grabbing headline" /></div>
        <div class="field"><label>Body copy</label><textarea class="input" placeholder="One or two sentences"></textarea></div>
        <div class="form-row two" style="display:grid">
          <div class="field"><label>Placement</label><select class="input"><option>Home — top banner</option><option>Poll feed — between cards</option><option>Archives — sidebar</option></select></div>
          <div class="field"><label>Budget (KSh)</label><input class="input" type="number" placeholder="50,000" /></div>
        </div>
        <div class="hint">Ad creatives are screened for misleading or harmful content before approval.</div>
      </div>
      <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Submit for review</button></div>`)
  );

  $$('[data-toggle-ad]').forEach((b) =>
    b.addEventListener('click', () => {
      const a = ADS.find((x) => x.id === b.dataset.toggleAd);
      a.status = a.status === 'live' ? 'pending' : 'live';
      if (a.status === 'live' && !a.impressions) { a.impressions = 1250; a.clicks = 34; }
      render();
      toast(a.status === 'live' ? 'Campaign approved and live.' : 'Campaign paused.', 'ok');
    })
  );

  $$('[data-edit-ad]').forEach((b) =>
    b.addEventListener('click', () => {
      const a = ADS.find((x) => x.id === b.dataset.editAd);
      openModal(`
        <div class="modal-head"><h3>Edit campaign</h3><button class="x-btn" data-close-x>×</button></div>
        <div class="modal-body">
          <div class="field"><label>Headline</label><input class="input" value="${esc(a.headline)}" /></div>
          <div class="field"><label>Body</label><textarea class="input">${esc(a.body)}</textarea></div>
          <div class="field"><label>Status</label><select class="input"><option ${a.status === 'live' ? 'selected' : ''}>live</option><option ${a.status === 'pending' ? 'selected' : ''}>pending</option><option>paused</option></select></div>
        </div>
        <div class="modal-foot"><button class="btn btn-primary btn-block" data-close-x>Save</button></div>`);
    })
  );

  $$('[data-resolve]').forEach((b) =>
    b.addEventListener('click', () => {
      const m = MODERATION.find((x) => x.id === b.dataset.resolve);
      m.status = 'resolved';
      render();
      toast('Flag resolved. No further action taken.', 'ok');
    })
  );

  $$('[data-block]').forEach((b) =>
    b.addEventListener('click', () => {
      const m = MODERATION.find((x) => x.id === b.dataset.block);
      m.status = 'resolved';
      render();
      toast('User blocked and case escalated to the duty moderator.', 'danger');
    })
  );

  $$('[data-approve-req]').forEach((b) =>
    b.addEventListener('click', () => {
      toast('Request approved — scheduling poll for publication.', 'ok');
      location.hash = '#/admin';
      state.adminTab = 'polls';
    })
  );

  /* ---- Ad clicks ---- */
  $$('[data-ad-click]').forEach((b) =>
    b.addEventListener('click', () => {
      const a = ADS.find((x) => x.id === b.dataset.adClick);
      if (a) a.clicks += 1;
      toast(`Ad clicked — opening advertiser's page.`, '');
    })
  );
}

function openCreatePollModal() {
  let coverImageDataUrl = '';

  const defaultOptions = [
    { label: '', subtitle: '', image: '' },
    { label: '', subtitle: '', image: '' },
    { label: '', subtitle: '', image: '' },
  ];

  function renderModalContent() {
    return `
    <div class="modal-head">
      <div>
        <h3>Create a new poll</h3>
        <span class="small muted">Support for candidate images, party affiliations &amp; cover banners</span>
      </div>
      <button class="x-btn" data-close-x>×</button>
    </div>
    <div class="modal-body" style="max-height:76vh;overflow-y:auto">
      <div style="display:flex;gap:8px;margin-bottom:14px;flex-wrap:wrap">
        <button class="btn btn-xs btn-ghost" id="np-preset-presidential" style="border-style:dashed">⭐ Load 2027 Presidential Demo</button>
        <button class="btn btn-xs btn-ghost" id="np-preset-governor" style="border-style:dashed">🏛️ Load Nairobi Governor Demo</button>
      </div>

      <div class="field">
        <label>Poll question / Title</label>
        <input class="input" id="np-title" placeholder="e.g. 2027 Presidential Popularity: Who would you vote for?" />
      </div>

      <div class="field">
        <label>Context / summary</label>
        <textarea class="input" id="np-summary" style="min-height:70px" placeholder="Brief neutral background so voters understand the issue or context."></textarea>
      </div>

      <div class="form-row two">
        <div class="field">
          <label>Sector</label>
          <select class="input" id="np-sector">
            ${SECTORS.filter((s) => s.id !== 'all').map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join('')}
          </select>
        </div>
        <div class="field">
          <label>Duration</label>
          <select class="input" id="np-duration">
            <option value="24">24 hours</option>
            <option value="48">48 hours</option>
            <option value="72" selected>72 hours (3 days)</option>
            <option value="168">7 days (1 week)</option>
          </select>
        </div>
      </div>

      <!-- Poll Cover Image Upload -->
      <div class="field">
        <label>📸 Poll Cover / Banner Image (optional)</label>
        <div class="img-upload-box" id="np-cover-box">
          <input type="file" id="np-cover-file" accept="image/*" style="display:none" />
          <div id="np-cover-placeholder">
            <span style="font-size:24px;display:block;margin-bottom:4px">🖼️</span>
            <strong>Click to upload poll banner</strong>
            <p class="small muted mb-0">PNG, JPG or WebP. Makes poll standout on homepage &amp; social feeds.</p>
          </div>
          <img id="np-cover-preview" class="img-upload-preview" alt="Cover preview" />
        </div>
        <div id="np-cover-actions" class="mt-8 flex gap-8 hidden">
          <button class="btn btn-xs btn-ghost" type="button" id="np-change-cover">Change photo</button>
          <button class="btn btn-xs btn-ghost" type="button" id="np-remove-cover" style="color:var(--ke-red)">Remove photo</button>
        </div>
      </div>

      <!-- Candidates / Options Builder with Photo Upload -->
      <div class="field">
        <div class="flex between center mb-8">
          <label class="mb-0">👥 Candidates / Answer Options (with photo upload)</label>
          <span class="small muted" id="np-opt-count">3 options</span>
        </div>
        <p class="hint" style="margin-top:0;margin-bottom:10px">
          Upload politician headshots or avatars to make the ballot visual and encouraging for citizens.
        </p>

        <div id="np-options-container" class="grid" style="gap:10px"></div>

        <button type="button" class="btn btn-sm btn-ghost mt-8" id="np-add-opt-btn" style="width:100%;border-style:dashed">
          ＋ Add another candidate / option
        </button>
      </div>

      <div class="field">
        <label>Result visibility</label>
        <select class="input" id="np-visibility">
          <option value="closed" selected>Publish results when poll closes + notify voters (recommended)</option>
          <option value="turnout">Show turnout only while live</option>
          <option value="live">Show live full results</option>
        </select>
      </div>

      <div class="hint">Every new poll is screened for neutrality and logged for audit before publication.</div>
    </div>
    <div class="modal-foot">
      <button class="btn btn-ghost" data-close-x>Cancel</button>
      <button class="btn btn-primary" style="flex:1" id="np-save">Publish poll with images</button>
    </div>`;
  }

  openModal(renderModalContent());

  const optionsContainer = $('#np-options-container');

  function createOptionRow(data = { label: '', subtitle: '', image: '' }, index = 0) {
    const row = document.createElement('div');
    row.className = 'opt-builder-item';
    row.dataset.optIndex = index;
    row.dataset.imgData = data.image || '';

    const fallbackImg = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 60'%3E%3Crect width='60' height='60' fill='%23dde4e0'/%3E%3Ctext x='30' y='38' font-size='24' text-anchor='middle' fill='%23637a72'%3E👤%3C/text%3E%3C/svg%3E";

    row.innerHTML = `
      <div class="opt-builder-head">
        <img class="opt-thumb-preview" src="${data.image || fallbackImg}" alt="Candidate thumb" />
        <div style="flex:1">
          <input class="input np-opt-label" placeholder="Candidate Name / Option label *" value="${esc(data.label)}" style="padding:8px 12px;font-size:13.5px;font-weight:700" />
        </div>
        <button class="x-btn np-opt-del" type="button" title="Remove option" style="width:28px;height:28px">×</button>
      </div>
      <div class="flex gap-8 center">
        <input class="input np-opt-sub" placeholder="Party / Affiliation / Title (e.g. UDA, ODM, Independent)" value="${esc(data.subtitle)}" style="padding:6px 10px;font-size:12px;flex:1" />
        <label class="upload-pill-btn">
          📷 Photo
          <input type="file" class="np-opt-file" accept="image/*" style="display:none" />
        </label>
        ${data.image ? `<button type="button" class="btn btn-xs btn-ghost np-opt-clr-photo" style="color:var(--ke-red)">Remove</button>` : ''}
      </div>`;

    // Photo file upload handler
    const fileInput = row.querySelector('.np-opt-file');
    const thumbImg = row.querySelector('.opt-thumb-preview');
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        row.dataset.imgData = dataUrl;
        thumbImg.src = dataUrl;
        toast('Candidate photo uploaded! 📸', 'ok');
      };
      reader.readAsDataURL(file);
    });

    // Delete handler
    row.querySelector('.np-opt-del').addEventListener('click', () => {
      if ($$('#np-options-container .opt-builder-item').length <= 2) {
        return toast('A poll must have at least 2 options.', 'danger');
      }
      row.remove();
      updateCount();
    });

    const clrBtn = row.querySelector('.np-opt-clr-photo');
    if (clrBtn) {
      clrBtn.addEventListener('click', () => {
        row.dataset.imgData = '';
        thumbImg.src = fallbackImg;
        clrBtn.remove();
      });
    }

    return row;
  }

  function updateCount() {
    const count = $$('#np-options-container .opt-builder-item').length;
    const countEl = $('#np-opt-count');
    if (countEl) countEl.textContent = `${count} options`;
  }

  // Populate default 3 rows
  defaultOptions.forEach((opt, idx) => {
    optionsContainer.appendChild(createOptionRow(opt, idx));
  });
  updateCount();

  // Add option button
  $('#np-add-opt-btn').addEventListener('click', () => {
    const currentCount = $$('#np-options-container .opt-builder-item').length;
    optionsContainer.appendChild(createOptionRow({ label: '', subtitle: '', image: '' }, currentCount));
    updateCount();
  });

  // Cover image upload
  const coverBox = $('#np-cover-box');
  const coverFile = $('#np-cover-file');
  const coverPreview = $('#np-cover-preview');
  const coverPlaceholder = $('#np-cover-placeholder');
  const coverActions = $('#np-cover-actions');

  coverBox.addEventListener('click', () => coverFile.click());
  $('#np-change-cover').addEventListener('click', () => coverFile.click());

  coverFile.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      coverImageDataUrl = ev.target.result;
      coverPreview.src = coverImageDataUrl;
      coverPreview.style.display = 'block';
      coverPlaceholder.style.display = 'none';
      coverActions.classList.remove('hidden');
      toast('Poll cover image uploaded! 🖼️', 'ok');
    };
    reader.readAsDataURL(file);
  });

  $('#np-remove-cover').addEventListener('click', (e) => {
    e.stopPropagation();
    coverImageDataUrl = '';
    coverPreview.src = '';
    coverPreview.style.display = 'none';
    coverPlaceholder.style.display = 'block';
    coverActions.classList.add('hidden');
  });

  // Presets handlers
  $('#np-preset-presidential').addEventListener('click', () => {
    $('#np-title').value = '2027 Presidential Popularity: If elections were held today, who would you vote for?';
    $('#np-summary').value = 'Comprehensive national pulse on presidential candidate preferences ahead of 2027 General Elections.';
    $('#np-sector').value = 'presidency';
    coverImageDataUrl = HERO_IMAGE;
    coverPreview.src = HERO_IMAGE;
    coverPreview.style.display = 'block';
    coverPlaceholder.style.display = 'none';
    coverActions.classList.remove('hidden');

    optionsContainer.innerHTML = '';
    const demoCandidates = [
      { label: 'Dr. William Ruto', subtitle: 'United Democratic Alliance (UDA)', image: CAND_RUTO_IMG },
      { label: 'Raila Odinga', subtitle: 'Azimio la Umoja / ODM', image: CAND_RAILA_IMG },
      { label: 'Kalonzo Musyoka', subtitle: 'Wiper Democratic Movement', image: CAND_KALONZO_IMG },
      { label: 'Undecided / Other Candidate', subtitle: 'Awaiting coalition tickets', image: '' },
    ];
    demoCandidates.forEach((c, idx) => optionsContainer.appendChild(createOptionRow(c, idx)));
    updateCount();
    toast('Loaded 2027 Presidential Candidate poll template! 🇰🇪', 'ok');
  });

  $('#np-preset-governor').addEventListener('click', () => {
    $('#np-title').value = 'Nairobi County Gubernatorial Race: Who has your confidence for Governor?';
    $('#np-summary').value = 'Voters evaluate leadership, public service delivery and manifestos for the Nairobi City County leadership.';
    $('#np-sector').value = 'politics';
    coverImageDataUrl = HERO_IMAGE;
    coverPreview.src = HERO_IMAGE;
    coverPreview.style.display = 'block';
    coverPlaceholder.style.display = 'none';
    coverActions.classList.remove('hidden');

    optionsContainer.innerHTML = '';
    const demoGovs = [
      { label: 'Johnson Sakaja', subtitle: 'Current Governor · UDA', image: CAND_RUTO_IMG },
      { label: 'Tim Wanyonyi', subtitle: 'Member of Parliament · ODM', image: CAND_RAILA_IMG },
      { label: 'Undecided / Other Leader', subtitle: 'Independent / Other', image: '' },
    ];
    demoGovs.forEach((c, idx) => optionsContainer.appendChild(createOptionRow(c, idx)));
    updateCount();
    toast('Loaded Nairobi County Governor poll template! 🏛️', 'ok');
  });

  // Save handler
  $('#np-save').addEventListener('click', () => {
    const title = $('#np-title').value.trim();
    if (!title) return toast('Please enter a poll title.', 'danger');

    const optionRows = $$('#np-options-container .opt-builder-item');
    const options = optionRows.map((row) => ({
      label: row.querySelector('.np-opt-label').value.trim(),
      subtitle: row.querySelector('.np-opt-sub').value.trim(),
      image: row.dataset.imgData || '',
      votes: 0,
    })).filter((o) => o.label.length > 0);

    if (options.length < 2) return toast('Add at least two candidate / answer options with names.', 'danger');

    const created = mkPoll({
      title,
      summary: $('#np-summary').value.trim() || 'Citizen-submitted national opinion poll.',
      sector: $('#np-sector').value,
      status: 'live',
      endsAt: inHours(Number($('#np-duration').value)),
      liveResults: $('#np-visibility').value === 'live',
      coverImage: coverImageDataUrl || '',
      voters: 0,
      options,
    });

    POLLS.unshift(created);
    closeModal();
    toast('Poll with candidate images published and live! 🎉', 'ok');
    state.adminTab = 'polls';
    location.hash = `#/poll/${created.id}`;
    render();
  });
}

/* ---------------------------------------------------------------------------
   11. Header & role
   -------------------------------------------------------------------------- */
function renderHeader() {
  const isAdmin = state.role === 'admin';
  $$('.admin-only').forEach((el) => el.classList.toggle('hidden', !isAdmin));
  $$('#role-switch button').forEach((b) => b.classList.toggle('active', b.dataset.role === state.role));

  const authBtn = $('#auth-btn');
  const strip = $('#session-strip');

  if (state.user) {
    authBtn.textContent = 'Sign out';
    authBtn.onclick = (e) => {
      e.preventDefault();
      state.user = null;
      state.role = 'user';
      renderHeader();
      toast('Signed out successfully.', '');
      location.hash = '#/home';
    };
    strip.classList.remove('hidden');
    strip.innerHTML = `
      <span>Signed in as <strong>${esc(state.user.name)}</strong></span>
      <span class="pill">${esc(state.user.county)} County</span>
      <span class="pill">${esc(state.user.email)}</span>
      <span class="muted small">Your identity is never shown with your votes.</span>`;
  } else {
    authBtn.textContent = 'Sign in';
    authBtn.onclick = null;
    strip.classList.add('hidden');
    strip.innerHTML = '';
  }
}

/* ---------------------------------------------------------------------------
   12. Boot
   -------------------------------------------------------------------------- */
function boot() {
  // Role switch
  $$('#role-switch button').forEach((b) =>
    b.addEventListener('click', () => {
      state.role = b.dataset.role;
      renderHeader();
      toast(state.role === 'admin'
        ? 'Viewing as administrator — full dashboards enabled.'
        : 'Viewing as a voter.', '');
      const r = parseRoute();
      if (r.name === 'admin' || r.name === 'poll') render();
    })
  );

  window.addEventListener('hashchange', render);
  renderHeader();
  render();
}

boot();
