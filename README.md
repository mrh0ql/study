# Latin Stage 16 / 17 Lockdown Study

A local / Vercel-hostable quiz site for drilling Cambridge Latin Stage 16 (with Stage 17 grammar).
Designed for self-testing: once the quiz starts, the page enters a "lockdown" mode
that tracks tab switches, disables common cheating shortcuts, and prevents you from
finishing until every section is answered correctly.

## What's inside

- **Pre-Test Study** (`study.html`) — every reference sheet in one place:
  - Declension endings (1st / 2nd M-N / 3rd)
  - Case uses (Nom / Gen / Dat / Acc / Abl)
  - Tense chart (Praesens, Imperfectum, Perfectum, Pluperfectum)
  - Stage 16 vocabulary, people, `res`
  - Apostles' Creed — Latin and English
- **Lockdown Quiz** (`quiz.html`) — six sequential sections, each must be fully
  correct before you can advance:
  1. Declension chart
  2. Case uses
  3. Tense chart
  4. Stage 16 vocabulary
  5. Apostles' Creed — Latin (full typing)
  6. Apostles' Creed — English (full typing)

## Lockdown behaviour

- Requests fullscreen on start.
- Records a violation and warns on:
  - tab-switch / tab-hide,
  - window losing focus,
  - attempts to refresh (F5, Ctrl+R) or close (Ctrl+W),
  - leaving fullscreen via Escape.
- Disables right-click.
- Shows a `beforeunload` confirmation if you try to navigate away.
- Cannot advance past a section until every answer is correct.
- A "Mastered" screen lifts the lockdown when the last section is complete.

Note: browsers can't truly lock a device — this is a best-effort study aid,
not an exam-proctoring kiosk.

## Running locally

No build step. Just open `index.html` in a browser, or serve the folder:

```bash
# Python 3
python3 -m http.server 8080
# then open http://localhost:8080
```

## Deploying on Vercel

The repo ships with a minimal `vercel.json`. From the project root:

```bash
npx vercel           # first-time setup
npx vercel --prod    # deploy production
```

Or connect the GitHub repo at <https://vercel.com/new> — Vercel auto-detects
the static project and deploys it; no configuration needed.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Landing page |
| `study.html` | Pre-test study / reference sheet |
| `quiz.html`  | Lockdown quiz UI |
| `data.js`    | All quiz data (declensions, tenses, vocab, creed) |
| `quiz.js`    | Quiz + lockdown logic |
| `styles.css` | Styles |
| `vercel.json`| Vercel config |
