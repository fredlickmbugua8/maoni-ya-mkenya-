# 🇰🇪 Maoni ya Mkenya — National Opinion & Polling Platform

> **"Your voice on the issues that shape Kenya."**  
> Transparent, independent, and accountable national polling. One verified account, one vote.

---

## 🌟 Key Features

- **🗳️ Live National Polling Across 19 Sectors**: Covers Executive, Parliament, Judiciary, County Governments, Economy, Health, Education, Security, ICT, Agriculture, and more.
- **📸 Visual Candidate & Politician Ballots**:
  - Full portrait headshots and party affiliations (e.g., UDA, Azimio/ODM, Wiper, Independents).
  - Responsive candidate photo ballot cards with interactive hover effects and checkmark selectors.
  - Candidate avatar preview stacks on poll feeds and result breakdown graphs.
- **🔒 Integrity & Result Sealing**:
  - Live polls feature locked breakdowns to prevent voter herd behavior, revealing voter participation counts until close time.
  - Final results are published immutably with full transparency.
- **🛡️ AI Content Safety & Screening**:
  - Real-time screening for hate speech, ethnic incitement, violence, and malicious links adhering to the **Kenya Data Protection Act, 2019 (ODPC)** and the **NCIC Act**.
  - Flagged messages are queued for human editorial review.
- **📊 Admin Control Center**:
  - Real-time turnout metrics, sector engagement analytics, and daily trends.
  - **Poll Studio with Image Uploads**: Upload poll cover banners and candidate photos via `FileReader` with instant preview.
  - Built-in 1-click test templates for presidential and county contests.
  - Sponsored campaign management with CTR tracking.

---

## 🚀 Getting Started Locally

Serve the application using any static file server:

### Option 1: Python
```bash
python -m http.server 8000
```
Then open [http://localhost:8000](http://localhost:8000) in your browser.

### Option 2: Node.js
```bash
npx serve -l 8000 .
```

---

## 📁 Project Structure

```
├── index.html       # Semantic HTML5 SPA layout with SEO & OpenGraph tags
├── styles.css       # Mobile-first design system with Kenyan flag color tokens
├── app.js           # Client-side SPA routing, polling logic, image uploads, AI screening
├── assets/          # High-resolution hero banners and candidate portraits
├── .gitignore       # Git ignore rules
└── README.md        # Project documentation
```

---

## ⚖️ Legal & Compliance

- **Kenya Data Protection Act, 2019 (ODPC)** compliant voter data handling.
- **National Cohesion and Integration Commission (NCIC) Act** anti-hate speech standards.
