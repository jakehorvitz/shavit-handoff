/* Notes tab — free-form, editable, annotatable notes pinned to the top of every spec page.
   EDIT view: a textarea that autosaves the whole text. DOC view: the same text rendered as blocks
   (headings, bullets, paragraphs), each one an annotation target for spec-annotate.js.
   Persistence, most durable first: POST /notes (serve.py ≥ 9/4) → POST /annotate with section
   "notes-tab" (every serve.py has it; lands in docs/spec-inbox.jsonl) → localStorage. */
(function () {
  const spec = document.body.dataset.spec || "spec";
  const pageLabel = /animatic/.test(spec) ? "ANIMATIC" : "SPEC";
  const LS = "shavit-notes-tab";
  const css = document.createElement("style");
  css.textContent = `
    .ntab-bar{position:sticky;top:0;z-index:60;display:flex;align-items:center;gap:6px;margin:-30px -28px 18px;padding:9px 28px;background:#0b0b0acc;backdrop-filter:blur(10px);border-bottom:1px solid #37352e}
    .ntab{appearance:none;border:1px solid #37352e;border-radius:8px;background:#1d1c19;color:#f7f5ef;padding:8px 14px;font:700 11px/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;cursor:pointer}
    .ntab.active{border-color:#ffc000;background:#332a0f;color:#ffc000}
    .ntab-status{margin-left:auto;color:#aaa69c;font:500 10px/1.2 ui-monospace,monospace;letter-spacing:.04em}
    .ntab-panel{position:relative;margin:8px 0 26px;padding:14px;border:1px solid #66521b;border-radius:14px;background:linear-gradient(145deg,#171611,#0e0e0c);box-shadow:0 20px 70px #0008}
    .ntab-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin-bottom:10px;padding-right:130px}
    .ntab-head b{color:#ffc000;font:700 12px/1.2 ui-monospace,monospace;letter-spacing:.09em}
    .ntab-head span{color:#aaa69c;font-size:12px}
    .ntab-modes{display:flex;gap:5px}
    .ntab-mode{appearance:none;border:1px solid #37352e;border-radius:6px;background:#1d1c19;color:#aaa69c;padding:6px 9px;font:700 10px/1 ui-monospace,monospace;letter-spacing:.06em;cursor:pointer}
    .ntab-mode.active{border-color:#ffc000;color:#ffc000;background:#332a0f}
    #ntab-text{display:block;width:100%;min-height:46vh;resize:vertical;padding:14px 16px;border:1px solid #37352e;border-radius:10px;background:#0a0a09;color:#f7f5ef;font:400 15px/1.6 Inter,ui-sans-serif,system-ui,sans-serif;outline:none}
    #ntab-text:focus{border-color:#826716;box-shadow:0 0 0 3px #ffc00022}
    #ntab-text[hidden],.ntab-doc[hidden]{display:none}
    .ntab-doc{min-height:20vh;padding:6px 4px 2px}
    .ntab-block{position:relative;margin:0 0 10px;padding:10px 12px;border:1px solid #2b2a25;border-radius:9px;background:#0f0f0d;color:#f7f5ef;font-size:15px;line-height:1.55}
    .ntab-block h3{margin:0;font-size:17px;color:#ffc000;letter-spacing:.01em}
    .ntab-block h4{margin:0;font-size:14px;color:#ffc000;text-transform:uppercase;letter-spacing:.06em}
    .ntab-block ul{margin:0;padding-left:20px}
    .ntab-block ul li{margin:3px 0;color:#f7f5ef}
    .ntab-block p{margin:0;max-width:none}
    .ntab-block.empty{color:#6f6c64;font-style:italic}
    .ntab-foot{display:flex;flex-wrap:wrap;gap:8px 16px;margin-top:8px;color:#aaa69c;font:500 10px/1.4 ui-monospace,monospace}
    @media(max-width:680px){.ntab-bar{margin:-20px -14px 14px;padding:8px 14px}}
  `;
  document.head.appendChild(css);

  const bar = document.createElement("div");
  bar.className = "ntab-bar";
  bar.innerHTML = `<button type="button" class="ntab active" data-tab="page">${pageLabel}</button><button type="button" class="ntab" data-tab="notes">NOTES</button><span class="ntab-status" id="ntab-status"></span>`;
  const panel = document.createElement("section");
  panel.className = "ntab-panel";
  panel.hidden = true;
  panel.setAttribute("data-annot", "notes-tab");
  panel.innerHTML = `<div class="ntab-head"><b>YOUR NOTES</b><span class="ntab-modes"><button type="button" class="ntab-mode active" data-mode="edit">EDIT</button><button type="button" class="ntab-mode" data-mode="doc">DOC</button></span><span>EDIT to type. DOC to read it as a document you can annotate line by line, like the rest of the spec. Autosaves; shared between the spec and the animatic.</span></div><textarea id="ntab-text" spellcheck="false" placeholder="Notes for this reel…"></textarea><div class="ntab-doc" id="ntab-doc" hidden></div><div class="ntab-foot"><span id="ntab-count">0 chars</span><span>⌘/Ctrl+S saves now</span><span id="ntab-where"></span></div>`;
  document.body.prepend(panel);
  document.body.prepend(bar);

  const ta = panel.querySelector("#ntab-text");
  const doc = panel.querySelector("#ntab-doc");
  const status = bar.querySelector("#ntab-status");
  const count = panel.querySelector("#ntab-count");
  const where = panel.querySelector("#ntab-where");
  let timer = null, dirty = false, mode = "edit";
  const stamp = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const setStatus = (t) => { status.textContent = t; };
  const updateCount = () => { count.textContent = ta.value.length + " chars"; };
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32);

  /* ---------- DOC view: text → annotatable blocks ---------- */
  function renderDoc() {
    doc.innerHTML = "";
    const text = ta.value.replace(/\r/g, "");
    const chunks = text.split(/\n\s*\n/).map((c) => c.trim()).filter(Boolean);
    if (!chunks.length) { const e = document.createElement("div"); e.className = "ntab-block empty"; e.textContent = "Nothing written yet. Switch to EDIT and type."; doc.appendChild(e); return; }
    const seen = {};
    chunks.forEach((chunk, i) => {
      const block = document.createElement("div"); block.className = "ntab-block";
      const lines = chunk.split("\n");
      const first = lines[0];
      let key = "notes-" + (slug(first.replace(/^[#\-*\d.\s]+/, "")) || ("block-" + i));
      if (seen[key]) key += "-" + (++seen[key]); else seen[key] = 1;
      block.setAttribute("data-annot", key);
      if (/^#{1,2}\s/.test(first)) { const h = document.createElement("h3"); h.textContent = first.replace(/^#+\s*/, ""); block.appendChild(h); lines.slice(1).length && block.appendChild(para(lines.slice(1))); }
      else if (/^#{3,}\s/.test(first)) { const h = document.createElement("h4"); h.textContent = first.replace(/^#+\s*/, ""); block.appendChild(h); lines.slice(1).length && block.appendChild(para(lines.slice(1))); }
      else if (lines.every((l) => /^\s*([-*•]|\d+[.)])\s+/.test(l))) { const ul = document.createElement("ul"); lines.forEach((l) => { const li = document.createElement("li"); li.textContent = l.replace(/^\s*([-*•]|\d+[.)])\s+/, ""); ul.appendChild(li); }); block.appendChild(ul); }
      else block.appendChild(para(lines));
      doc.appendChild(block);
    });
    function para(ls) { const p = document.createElement("p"); ls.forEach((l, j) => { if (j) p.appendChild(document.createElement("br")); p.appendChild(document.createTextNode(l)); }); return p; }
    if (window.__annotate && window.__annotate.rescan) window.__annotate.rescan();
  }
  function setMode(m) {
    mode = m;
    panel.querySelectorAll(".ntab-mode").forEach((b) => b.classList.toggle("active", b.dataset.mode === m));
    ta.hidden = m !== "edit"; doc.hidden = m !== "doc";
    if (m === "doc") renderDoc(); else ta.focus();
  }
  panel.querySelectorAll(".ntab-mode").forEach((b) => b.addEventListener("click", () => setMode(b.dataset.mode)));

  /* ---------- persistence ---------- */
  async function fetchServerNotes() {
    // 1) dedicated endpoint
    try { const r = await fetch("/notes", { cache: "no-store" }); if (r.ok) { const j = await r.json(); return { text: j.text || "", updated: j.updated || null, via: "notes" }; } } catch (e) {}
    // 2) latest notes-tab entry in the annotation inbox (works on the older server too)
    try {
      const r = await fetch("/annotations", { cache: "no-store" });
      if (r.ok) { const all = await r.json(); const mine = all.filter((e) => (e.section || "").endsWith("/notes-tab")); if (mine.length) { const last = mine[mine.length - 1]; return { text: last.comment || "", updated: last.at || null, via: "inbox" }; } return { text: "", updated: null, via: "inbox" }; }
    } catch (e) {}
    return null;
  }
  async function pushServer(text) {
    try { const r = await fetch("/notes", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) }); if (r.ok) return "notes"; } catch (e) {}
    try { const r = await fetch("/annotate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ section: spec + "/notes-tab", comment: text.slice(0, 5000) }) }); if (r.ok) return "inbox"; } catch (e) {}
    return null;
  }
  async function load() {
    let local = "";
    try { local = localStorage.getItem(LS) || ""; } catch (e) {}
    const srv = await fetchServerNotes();
    if (srv) {
      const useLocal = local && local !== srv.text && (!srv.text || local.length > srv.text.length);
      ta.value = useLocal ? local : srv.text;
      where.textContent = srv.via === "notes" ? "saving to docs/notes.md" : "saving into the annotation inbox (older server on this port)";
      setStatus(srv.updated ? "Notes saved " + String(srv.updated).replace("T", " ") : "Notes · nothing saved yet");
      if (useLocal) { setStatus("Syncing your unsaved text…"); await save(); }
    } else {
      ta.value = local; where.textContent = "server not reachable · kept in this browser";
      setStatus(local ? "Notes · saved in this browser only" : "Notes · server not reachable");
    }
    updateCount();
  }
  async function save() {
    timer = null;
    const text = ta.value;
    try { localStorage.setItem(LS, text); } catch (e) {}
    const via = await pushServer(text);
    if (via) { dirty = false; setStatus("Saved " + stamp() + (via === "inbox" ? " (inbox)" : "")); where.textContent = via === "notes" ? "saving to docs/notes.md" : "saving into the annotation inbox (older server on this port)"; }
    else { setStatus("Saved in this browser " + stamp() + " · server not reachable"); where.textContent = "server not reachable · kept in this browser"; }
  }
  ta.addEventListener("input", () => { dirty = true; updateCount(); setStatus("Typing…"); clearTimeout(timer); timer = setTimeout(save, 700); });
  window.addEventListener("keydown", (e) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && !panel.hidden) { e.preventDefault(); clearTimeout(timer); save(); } });
  window.addEventListener("beforeunload", () => { if (dirty) { clearTimeout(timer); try { navigator.sendBeacon("/notes", new Blob([JSON.stringify({ text: ta.value })], { type: "application/json" })); } catch (e) {} } });

  /* ---------- tabs ---------- */
  bar.querySelectorAll(".ntab").forEach((b) => b.addEventListener("click", () => {
    bar.querySelectorAll(".ntab").forEach((x) => x.classList.toggle("active", x === b));
    const notes = b.dataset.tab === "notes";
    panel.hidden = !notes;
    if (notes) { window.scrollTo({ top: 0 }); if (mode === "edit") ta.focus(); else renderDoc(); }
  }));
  if (location.hash === "#notes") bar.querySelector('[data-tab="notes"]').click();
  window.__notesTab = { open: () => bar.querySelector('[data-tab="notes"]').click(), setMode, save, get text() { return ta.value; }, set text(v) { ta.value = v; updateCount(); } };
  load();
})();
