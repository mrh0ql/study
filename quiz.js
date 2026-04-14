// ============================================================
// Lockdown Quiz — Stage 16 / 17
// ============================================================

// ---------- Lockdown behaviour ----------
const Lockdown = {
  active: false,
  violations: 0,

  start() {
    this.active = true;
    this.updateBar();

    // Request fullscreen (best effort — needs user gesture, so called on Start button)
    try {
      const el = document.documentElement;
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {});
    } catch (_) {}

    // Listen for visibility changes
    document.addEventListener("visibilitychange", this._onVis);

    // Warn on unload
    window.addEventListener("beforeunload", this._onUnload);

    // Disable right click
    document.addEventListener("contextmenu", this._onContext);

    // Block some shortcuts (Ctrl+T, Ctrl+N, Ctrl+W, etc. can't really be blocked by JS,
    // but we can block F5, Ctrl+R, Alt-arrow, etc. within the page context)
    document.addEventListener("keydown", this._onKey, { capture: true });

    // Detect blur (alt-tab)
    window.addEventListener("blur", this._onBlur);
  },

  stop() {
    this.active = false;
    document.removeEventListener("visibilitychange", this._onVis);
    window.removeEventListener("beforeunload", this._onUnload);
    document.removeEventListener("contextmenu", this._onContext);
    document.removeEventListener("keydown", this._onKey, { capture: true });
    window.removeEventListener("blur", this._onBlur);
    try { if (document.fullscreenElement) document.exitFullscreen(); } catch (_) {}
  },

  violate(reason) {
    if (!this.active) return;
    this.violations++;
    this.updateBar();
    showWarnModal(reason);
  },

  updateBar() {
    const el = document.getElementById("violations");
    if (el) el.textContent = "Violations: " + this.violations;
  },

  _onVis: () => {
    if (document.visibilityState === "hidden") {
      Lockdown.violate("You switched away from the tab. Lockdown mode requires you to stay on this quiz.");
    }
  },
  _onUnload: (e) => {
    if (!Lockdown.active) return;
    e.preventDefault();
    e.returnValue = "Leaving will not save your quiz progress. Stay and finish?";
    return e.returnValue;
  },
  _onContext: (e) => {
    if (Lockdown.active) e.preventDefault();
  },
  _onBlur: () => {
    if (document.visibilityState !== "hidden") {
      // window lost focus but didn't go hidden (alt-tab can do this)
      Lockdown.violate("The quiz window lost focus. Return to the quiz.");
    }
  },
  _onKey: (e) => {
    if (!Lockdown.active) return;
    // Block reload and dev tools openers
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === "r" || k === "w" || k === "l")) {
      e.preventDefault();
      Lockdown.violate("That shortcut is disabled during the lockdown quiz.");
    }
    if (k === "f5") { e.preventDefault(); Lockdown.violate("Refresh is disabled during the lockdown quiz."); }
    if (k === "escape" && document.fullscreenElement) {
      // browsers still exit fullscreen on Escape — we just log the violation
      Lockdown.violate("You left fullscreen. Please re-enter fullscreen to continue.");
    }
  },
};

function showWarnModal(msg) {
  const bg = document.getElementById("warn-modal");
  const body = document.getElementById("warn-body");
  if (!bg || !body) return;
  body.textContent = msg;
  bg.style.display = "flex";
}
document.getElementById("warn-close").addEventListener("click", () => {
  document.getElementById("warn-modal").style.display = "none";
  // attempt to re-enter fullscreen
  try {
    if (!document.fullscreenElement && Lockdown.active) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  } catch (_) {}
});

// ============================================================
// Section definitions
// ============================================================
const Sections = [
  { id: "declensions", title: "Declension Chart",         render: renderDeclensions,  check: checkDeclensions },
  { id: "cases",       title: "Case Uses",                render: renderCases,        check: checkCases },
  { id: "tenses",      title: "Tense Chart",              render: renderTenses,       check: checkTenses },
  { id: "words",       title: "Stage 16 Words (24)",      render: renderWords,        check: checkWords },
  { id: "qwords",      title: "Stage 17 Question Words",  render: renderQWords,       check: checkQWords },
  { id: "vocab",       title: "Stage 16 People & Res",    render: renderVocab,        check: checkVocab },
  { id: "creed_la",    title: "Apostles' Creed — Latin",   render: renderCreedLatin,    check: checkCreedLatin },
  { id: "creed_en",    title: "Apostles' Creed — English", render: renderCreedEnglish,  check: checkCreedEnglish },
];

let currentIdx = 0;
const completed = {};

// ============================================================
// Section 1: Declensions
// ============================================================
function renderDeclensions(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Declension Chart</h2>
      <span class="status todo" id="sec-status">Fill every cell correctly</span>
    </div>
    <p class="footnote">Type the ending for each case and number. Variants accepted (e.g. <code>-us</code> or <code>us</code>; 2nd Nom Sg accepts <code>us</code> or <code>um</code>).</p>
    <table class="chart" id="decl-chart">
      <thead>
        <tr>
          <th></th>
          <th colspan="2">1st Declension</th>
          <th colspan="2">2nd Declension M/N</th>
          <th colspan="2">3rd Declension</th>
        </tr>
        <tr>
          <th></th>
          <th>Sg</th><th>Pl</th>
          <th>Sg</th><th>Pl</th>
          <th>Sg</th><th>Pl</th>
        </tr>
      </thead>
      <tbody id="decl-body"></tbody>
    </table>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="decl-check">Check</button>
      <span class="footnote" id="decl-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);

  const body = wrap.querySelector("#decl-body");
  DECLENSIONS.rows.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td class="rowhdr">${row}</td>` + DECLENSIONS.columns.map((c, i) =>
      `<td><input type="text" data-row="${row}" data-idx="${i}" autocapitalize="off" autocorrect="off" spellcheck="false"></td>`
    ).join("");
    body.appendChild(tr);
  });

  wrap.querySelector("#decl-check").onclick = () => {
    const result = checkDeclensions();
    wrap.querySelector("#decl-msg").textContent = result.ok
      ? "✓ All correct — advancing…"
      : `✗ ${result.wrong} wrong / ${result.total} total.`;
    if (result.ok) setTimeout(advance, 600);
  };
}

function checkDeclensions() {
  const inputs = document.querySelectorAll("#decl-chart input");
  let wrong = 0, total = 0;
  inputs.forEach(inp => {
    total++;
    const row = inp.dataset.row;
    const idx = +inp.dataset.idx;
    const valid = DECLENSIONS.answers[row][idx];
    const td = inp.parentElement;
    if (matchesAny(inp.value, valid)) {
      td.classList.add("ok"); td.classList.remove("err");
    } else {
      td.classList.add("err"); td.classList.remove("ok");
      wrong++;
    }
  });
  return { ok: wrong === 0, wrong, total };
}

// ============================================================
// Section 2: Case Uses
// ============================================================
function renderCases(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Case Uses</h2>
      <span class="status todo">Type each use (comma-separated)</span>
    </div>
    <p class="footnote">Accepted abbreviations: <code>subj/subject</code>, <code>compl/complement</code>, <code>poss/possession</code>, <code>io</code>, <code>osv</code>, <code>do</code>, <code>op</code>.</p>
    <div id="cases-list"></div>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="cases-check">Check</button>
      <span class="footnote" id="cases-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);

  const list = wrap.querySelector("#cases-list");
  CASE_USES.forEach((c, i) => {
    const row = document.createElement("div");
    row.className = "kv";
    row.innerHTML = `
      <label>${c.case}:</label>
      <input type="text" data-i="${i}" placeholder="e.g. subject, complement" autocapitalize="off" spellcheck="false">
    `;
    list.appendChild(row);
  });

  wrap.querySelector("#cases-check").onclick = () => {
    const result = checkCases();
    wrap.querySelector("#cases-msg").textContent = result.ok
      ? "✓ All correct — advancing…"
      : `✗ ${result.wrong} row(s) wrong.`;
    if (result.ok) setTimeout(advance, 600);
  };
}

function checkCases() {
  const synonyms = {
    "subject": ["subj", "subject"],
    "complement": ["compl", "complement", "comp"],
    "possession": ["poss", "possession", "possessive"],
    "io": ["io", "indirect object", "indirectobject"],
    "osv": ["osv"],
    "do": ["do", "direct object", "directobject"],
    "op": ["op", "object of preposition", "objectofpreposition", "prep"],
  };
  function matchUse(input, want) {
    const n = norm(input);
    return (synonyms[want] || [want]).some(s => norm(s) === n);
  }

  const inputs = document.querySelectorAll("#cases-list input");
  let wrong = 0;
  inputs.forEach(inp => {
    const i = +inp.dataset.i;
    const want = CASE_USES[i].uses;
    const given = inp.value.split(",").map(x => x.trim()).filter(Boolean);
    let ok = given.length === want.length &&
             want.every(w => given.some(g => matchUse(g, w))) &&
             given.every(g => want.some(w => matchUse(g, w)));
    inp.style.outline = ok ? "2px solid var(--ok)" : "2px solid var(--err)";
    if (!ok) wrong++;
  });
  return { ok: wrong === 0, wrong };
}

// ============================================================
// Section 3: Tense Chart
// ============================================================
function renderTenses(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  let cols = TENSES.map(t => `<th>${t.name}</th>`).join("");
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Tense Chart (Stage 16/17)</h2>
      <span class="status todo">Fill every cell</span>
    </div>
    <p class="footnote">For each tense, provide: which principal part you strip (2 or 3), what you drop (<code>re</code>/<code>i</code>), the tense marker (or <code>none</code>/<code>x</code>), the six endings (comma-separated, 1s→3p), and at least one valid translation of <em>amare</em> for the 1st-person singular.</p>
    <table class="chart" id="tense-chart">
      <thead><tr><th></th>${cols}</tr></thead>
      <tbody>
        <tr><td class="rowhdr">Formation — drop which principal part?</td>${TENSES.map((_,i)=>`<td><input type="text" data-r="part" data-c="${i}" placeholder="2 or 3"></td>`).join("")}</tr>
        <tr><td class="rowhdr">Formation — minus what?</td>${TENSES.map((_,i)=>`<td><input type="text" data-r="minus" data-c="${i}" placeholder="re or i"></td>`).join("")}</tr>
        <tr><td class="rowhdr">Tense Marker</td>${TENSES.map((_,i)=>`<td><input type="text" data-r="marker" data-c="${i}" placeholder="none / ba / era"></td>`).join("")}</tr>
        <tr><td class="rowhdr">Endings (1s, 2s, 3s, 1p, 2p, 3p)</td>${TENSES.map((_,i)=>`<td><input type="text" data-r="endings" data-c="${i}" placeholder="e.g. m, s, t, mus, tis, nt"></td>`).join("")}</tr>
        <tr><td class="rowhdr">Translation of amare (1st sg)</td>${TENSES.map((_,i)=>`<td><input type="text" data-r="trans" data-c="${i}" placeholder="e.g. I love"></td>`).join("")}</tr>
      </tbody>
    </table>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="tense-check">Check</button>
      <span class="footnote" id="tense-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);
  wrap.querySelector("#tense-check").onclick = () => {
    const r = checkTenses();
    wrap.querySelector("#tense-msg").textContent = r.ok ? "✓ All correct — advancing…" : `✗ ${r.wrong} wrong`;
    if (r.ok) setTimeout(advance, 600);
  };
}

function checkTenses() {
  let wrong = 0;
  document.querySelectorAll("#tense-chart input").forEach(inp => {
    const c = +inp.dataset.c, r = inp.dataset.r;
    const t = TENSES[c];
    const v = norm(inp.value);
    let ok = false;
    if (r === "part")    ok = norm(t.formationPart) === v || ("" + t.formationPart + "nd") === v || ("" + t.formationPart + "rd") === v;
    if (r === "minus")   ok = norm(t.formationMinus) === v;
    if (r === "marker")  ok = t.tenseMarker.some(m => norm(m) === v);
    if (r === "endings") {
      const parts = inp.value.split(/[,\s]+/).map(x => x.trim()).filter(Boolean);
      ok = parts.length === 6 && parts.every((p, i) => t.endingAlternates[i].some(alt => normEnding(alt) === normEnding(p)));
    }
    if (r === "trans")   ok = t.translations.some(x => norm(x) === v);
    inp.parentElement.classList.toggle("ok", ok);
    inp.parentElement.classList.toggle("err", !ok);
    if (!ok) wrong++;
  });
  return { ok: wrong === 0, wrong };
}

// ============================================================
// Section 4: Stage 16 Words (24)
// ============================================================
function renderWords(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Stage 16 — 24 Checklist Words</h2>
      <span class="status todo">Translate every word</span>
    </div>
    <p class="footnote">Type one acceptable English meaning for each Latin word. Macrons are optional. Words with multiple meanings (e.g. <em>pōnō</em> = place / put / put up) accept any one.</p>
    <table class="chart" id="words-table">
      <thead><tr><th>Latin</th><th>Your answer</th></tr></thead>
      <tbody></tbody>
    </table>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="words-check">Check</button>
      <button class="btn secondary" id="words-shuffle">Shuffle order</button>
      <span class="footnote" id="words-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);

  const body = wrap.querySelector("#words-table tbody");
  function render(order) {
    body.innerHTML = "";
    order.forEach(i => {
      const w = VOCAB_WORDS[i];
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="rowhdr">${w.latin}</td><td><input type="text" data-i="${i}" autocapitalize="off" spellcheck="false" placeholder="English"></td>`;
      body.appendChild(tr);
    });
  }
  const baseOrder = VOCAB_WORDS.map((_, i) => i);
  render(baseOrder);

  wrap.querySelector("#words-shuffle").onclick = () => {
    const shuffled = baseOrder.slice().sort(() => Math.random() - 0.5);
    render(shuffled);
  };

  wrap.querySelector("#words-check").onclick = () => {
    const r = checkWords();
    wrap.querySelector("#words-msg").textContent = r.ok
      ? "✓ All 24 correct — advancing…"
      : `✗ ${r.wrong} / ${r.total} wrong.`;
    if (r.ok) setTimeout(advance, 600);
  };
}

function checkWords() {
  const inputs = document.querySelectorAll("#words-table input");
  let wrong = 0, total = 0;
  inputs.forEach(inp => {
    total++;
    const i = +inp.dataset.i;
    const answers = VOCAB_WORDS[i].answers;
    const v = norm(inp.value);
    const ok = v.length > 0 && answers.some(a => norm(a) === v);
    inp.parentElement.classList.toggle("ok", ok);
    inp.parentElement.classList.toggle("err", !ok);
    if (!ok) wrong++;
  });
  return { ok: wrong === 0, wrong, total };
}

// ============================================================
// Section 5: Stage 17 Question Words (8)
// ============================================================
function renderQWords(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Stage 17 — Question Words</h2>
      <span class="status todo">Translate all 8</span>
    </div>
    <p class="footnote">Type the English for each Latin question word. <em>nōnne</em> → "surely" (expects yes); <em>num</em> → "surely not" (expects no); <em>-ne</em> → turns a clause into a yes/no question.</p>
    <table class="chart" id="qwords-quiz">
      <thead><tr><th>Latin</th><th>Your answer</th></tr></thead>
      <tbody></tbody>
    </table>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="qwords-check">Check</button>
      <button class="btn secondary" id="qwords-shuffle">Shuffle order</button>
      <span class="footnote" id="qwords-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);

  const body = wrap.querySelector("#qwords-quiz tbody");
  function render(order) {
    body.innerHTML = "";
    order.forEach(i => {
      const w = QUESTION_WORDS[i];
      const tr = document.createElement("tr");
      tr.innerHTML = `<td class="rowhdr">${w.latin}</td><td><input type="text" data-i="${i}" autocapitalize="off" spellcheck="false" placeholder="English"></td>`;
      body.appendChild(tr);
    });
  }
  const baseOrder = QUESTION_WORDS.map((_, i) => i);
  render(baseOrder);

  wrap.querySelector("#qwords-shuffle").onclick = () => {
    const shuffled = baseOrder.slice().sort(() => Math.random() - 0.5);
    render(shuffled);
  };

  wrap.querySelector("#qwords-check").onclick = () => {
    const r = checkQWords();
    wrap.querySelector("#qwords-msg").textContent = r.ok
      ? "✓ All 8 correct — advancing…"
      : `✗ ${r.wrong} / ${r.total} wrong.`;
    if (r.ok) setTimeout(advance, 600);
  };
}

function checkQWords() {
  const inputs = document.querySelectorAll("#qwords-quiz input");
  let wrong = 0, total = 0;
  inputs.forEach(inp => {
    total++;
    const i = +inp.dataset.i;
    const answers = QUESTION_WORDS[i].answers;
    const v = norm(inp.value);
    const ok = v.length > 0 && answers.some(a => norm(a) === v);
    inp.parentElement.classList.toggle("ok", ok);
    inp.parentElement.classList.toggle("err", !ok);
    if (!ok) wrong++;
  });
  return { ok: wrong === 0, wrong, total };
}

// ============================================================
// Section 6: People / Res
// ============================================================
function renderVocab(stage) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Stage 16 Vocabulary</h2>
      <span class="status todo">Identify each person / term</span>
    </div>
    <p class="footnote">Type the name that fits the description. Also explain <em>fabula</em>, <em>res</em>, and <em>cultura</em> briefly.</p>
    <div id="vocab-list"></div>
    <div class="row" style="margin-top:12px;">
      <button class="btn" id="vocab-check">Check</button>
      <span class="footnote" id="vocab-msg"></span>
    </div>
  `;
  stage.appendChild(wrap);

  const list = wrap.querySelector("#vocab-list");
  // People: show description, ask for name
  VOCAB.people.forEach((p, i) => {
    const row = document.createElement("div");
    row.className = "kv";
    row.innerHTML = `
      <label>${p.desc}</label>
      <input type="text" data-kind="person" data-i="${i}" placeholder="name" autocapitalize="off" spellcheck="false">
    `;
    list.appendChild(row);
  });
  // Terms: show word, ask for meaning
  [["fabula", "story / play"], ["res", "things / matter / business"], ["cultura", "cultural / cultural background"]].forEach(([w, m], i) => {
    const row = document.createElement("div");
    row.className = "kv";
    row.innerHTML = `
      <label><em>${w}</em></label>
      <input type="text" data-kind="term" data-i="${i}" placeholder="meaning">
    `;
    list.appendChild(row);
  });

  wrap.querySelector("#vocab-check").onclick = () => {
    const r = checkVocab();
    wrap.querySelector("#vocab-msg").textContent = r.ok ? "✓ All correct — advancing…" : `✗ ${r.wrong} wrong`;
    if (r.ok) setTimeout(advance, 600);
  };
}

function checkVocab() {
  const termAcceptable = [
    [/\bstory\b|\bplay\b/], // fabula
    [/\bthing/, /\bmatter|business|affair/], // res — requires at least 'thing' OR matter/business/affair
    [/\bcultur/], // cultura
  ];
  let wrong = 0;
  document.querySelectorAll("#vocab-list input").forEach(inp => {
    const kind = inp.dataset.kind;
    const i = +inp.dataset.i;
    let ok = false;
    if (kind === "person") {
      const aliases = VOCAB.people[i].aliases || [VOCAB.people[i].name];
      ok = aliases.some(a => norm(a) === norm(inp.value));
    } else {
      const v = norm(inp.value);
      const alts = termAcceptable[i];
      ok = alts.some(re => re.test(v));
    }
    inp.style.outline = ok ? "2px solid var(--ok)" : "2px solid var(--err)";
    if (!ok) wrong++;
  });
  return { ok: wrong === 0, wrong };
}

// ============================================================
// Section 5/6: Apostles' Creed typing
// ============================================================
function renderCreedLatin(stage) {
  renderCreed(stage, CREED_LATIN, "Latin", "creed_la");
}
function renderCreedEnglish(stage) {
  renderCreed(stage, CREED_ENGLISH, "English", "creed_en");
}

function renderCreed(stage, target, lang, id) {
  const wrap = document.createElement("div");
  wrap.className = "panel";
  wrap.innerHTML = `
    <div class="qheader">
      <h2>Apostles' Creed — ${lang}</h2>
      <span class="status todo">Type the full text from memory</span>
    </div>
    <p class="footnote">
      Case, line breaks, and most punctuation are ignored; spelling of each word must match.
      A diff will be shown when you check.
    </p>
    <textarea id="creed-input-${id}" placeholder="Start typing…"></textarea>
    <div class="row" style="margin-top:12px;">
      <button class="btn" data-id="${id}">Check</button>
      <details>
        <summary>Peek at first line (no penalty, but don't cheat)</summary>
        <pre class="diff">${target.split("\n")[0]}</pre>
      </details>
      <span class="footnote" id="creed-msg-${id}"></span>
    </div>
    <h3 class="section-title">Diff</h3>
    <pre class="diff" id="creed-diff-${id}"></pre>
  `;
  stage.appendChild(wrap);

  wrap.querySelector("button.btn").onclick = () => {
    const result = checkCreedGeneric(target, id);
    wrap.querySelector(`#creed-msg-${id}`).textContent = result.ok
      ? "✓ Perfect — advancing…"
      : `✗ ${result.wrongCount} word(s) off.`;
    if (result.ok) setTimeout(advance, 600);
  };
}

function checkCreedLatin()   { return checkCreedGeneric(CREED_LATIN,  "creed_la"); }
function checkCreedEnglish() { return checkCreedGeneric(CREED_ENGLISH, "creed_en"); }

function checkCreedGeneric(target, id) {
  const inp = document.getElementById("creed-input-" + id);
  if (!inp) return { ok: false, wrongCount: 0 };

  // Tokenize: normalize punctuation away but keep words
  const clean = s => s.toLowerCase()
    .replace(/[.,;:!?()"“”‘’'`\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean);

  const want = clean(target);
  const got = clean(inp.value);
  const diffEl = document.getElementById("creed-diff-" + id);

  const max = Math.max(want.length, got.length);
  let wrongCount = 0;
  const htmlParts = [];
  for (let i = 0; i < max; i++) {
    const w = want[i] ?? "—";
    const g = got[i]  ?? "—";
    if (w === g) {
      htmlParts.push(`<span class="ok">${escapeHtml(g)}</span>`);
    } else {
      wrongCount++;
      htmlParts.push(`<span class="err">[${escapeHtml(g)}→${escapeHtml(w)}]</span>`);
    }
  }
  if (diffEl) diffEl.innerHTML = htmlParts.join(" ");

  return { ok: wrongCount === 0 && want.length === got.length, wrongCount };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch]));
}

// ============================================================
// Progress & flow
// ============================================================
function renderProgress() {
  const ul = document.getElementById("progress");
  ul.innerHTML = "";
  Sections.forEach((s, i) => {
    const li = document.createElement("li");
    li.textContent = (i + 1) + ". " + s.title;
    if (completed[s.id]) li.classList.add("done");
    else if (i === currentIdx) li.classList.add("current");
    ul.appendChild(li);
  });
}

function renderCurrent() {
  const stage = document.getElementById("stage");
  stage.innerHTML = "";
  const s = Sections[currentIdx];
  if (!s) return;
  s.render(stage);
  renderProgress();
}

function advance() {
  const s = Sections[currentIdx];
  completed[s.id] = true;
  currentIdx++;
  if (currentIdx >= Sections.length) {
    finish();
  } else {
    renderCurrent();
  }
}

function finish() {
  document.getElementById("stage").style.display = "none";
  document.getElementById("progress").style.display = "none";
  document.getElementById("done").style.display = "block";
  document.getElementById("violation-summary").textContent =
    "Violations tracked: " + Lockdown.violations +
    (Lockdown.violations === 0 ? " — clean run!" : "");
  Lockdown.stop();
  document.getElementById("lockbar").style.display = "none";
}

// ---------- Start / Restart ----------
document.getElementById("start-btn").onclick = () => {
  document.getElementById("intro").style.display = "none";
  document.getElementById("progress").style.display = "flex";
  document.getElementById("stage").style.display = "block";
  Lockdown.start();
  currentIdx = 0;
  for (const k in completed) delete completed[k];
  renderCurrent();
};

document.getElementById("restart-btn").addEventListener("click", () => {
  document.getElementById("done").style.display = "none";
  document.getElementById("intro").style.display = "block";
  document.getElementById("lockbar").style.display = "flex";
  Lockdown.violations = 0;
  Lockdown.updateBar();
});
