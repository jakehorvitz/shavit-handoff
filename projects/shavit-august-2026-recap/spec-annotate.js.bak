/* spec-annotate.js — drop-in annotation layer for shavit-pipeline specs.
 *
 * RULE (from 2026-07-11): every spec Jake reviews must be directly annotatable.
 * Include this on any spec page:
 *     <body data-spec="43-howder">        <!-- unique spec id -->
 *     ...
 *     <script src="../../spec-annotate.js"></script>   <!-- path back to pipeline root -->
 *
 * It attaches a "＋ note" control to every annotation target (default: .shot and h2),
 * and persists comments to the pipeline inbox via serve.py's /annotate endpoint
 * ({section:"<spec>/<key>", comment}). When opened over file:// (no server) it falls
 * back to browser localStorage and offers an Export button so nothing is lost.
 *
 * Targets: any element matching body[data-annot-targets] (default ".shot, h2"),
 * plus anything with an explicit [data-annot="key"].
 */
(function () {
  "use strict";
  var SPEC = document.body.dataset.spec || location.pathname.split("/").pop() || "spec";
  var SEL = document.body.dataset.annotTargets || ".shot, h2";
  var LSKEY = "shavit-annot:" + SPEC;
  var online = location.protocol.startsWith("http");

  // ---------- styles ----------
  var css = `
  .an-btn{all:unset;cursor:pointer;font:600 11px/1 ui-monospace,Menlo,monospace;color:#0b0b0c;
    background:#B08D57;border-radius:6px;padding:4px 8px;letter-spacing:.04em;white-space:nowrap}
  .an-btn:hover{background:#FFC000}
  .an-anchor{position:relative}
  .an-gutter{position:absolute;top:8px;right:8px;display:flex;gap:6px;align-items:center;z-index:5}
  .an-count{font:600 11px/1 ui-monospace,Menlo,monospace;color:#FFC000;background:#000;
    border:1px solid #2a2a2e;border-radius:999px;padding:3px 7px}
  .an-h2row{display:inline-flex;gap:8px;align-items:center;vertical-align:middle;margin-left:10px}
  .an-compose{margin:10px 0 2px;background:#0f0f10;border:1px solid #2a2a2e;border-left:3px solid #B08D57;
    border-radius:8px;padding:10px}
  .an-compose textarea{width:100%;min-height:60px;resize:vertical;background:#000;color:#f4f2ec;
    border:1px solid #2a2a2e;border-radius:6px;padding:8px;font:14px/1.45 Inter,system-ui,sans-serif}
  .an-compose .row{display:flex;gap:8px;margin-top:8px;align-items:center}
  .an-note{background:#101012;border:1px solid #2a2a2e;border-left:3px solid #FFC000;border-radius:8px;
    padding:9px 11px;margin:8px 0;font:14px/1.5 Inter,system-ui,sans-serif;color:#f4f2ec}
  .an-note .meta{font:11px/1 ui-monospace,Menlo,monospace;color:#6f6c64;margin-bottom:5px;
    display:flex;gap:10px;align-items:center}
  .an-note .del{all:unset;cursor:pointer;color:#e0794a;font-size:11px;margin-left:auto}
  .an-rail{position:fixed;top:0;right:0;height:100vh;width:340px;max-width:88vw;background:#141416;
    border-left:1px solid #2a2a2e;box-shadow:-20px 0 40px rgba(0,0,0,.4);transform:translateX(100%);
    transition:transform .18s ease;z-index:40;display:flex;flex-direction:column}
  .an-rail.open{transform:none}
  .an-rail header{padding:16px 18px;border-bottom:1px solid #2a2a2e;display:flex;align-items:center;gap:10px}
  .an-rail header b{font:700 13px/1 Inter,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#B08D57}
  .an-rail .body{overflow:auto;padding:12px 14px;flex:1}
  .an-rail .item{border:1px solid #2a2a2e;border-radius:8px;padding:10px;margin-bottom:9px;cursor:pointer}
  .an-rail .item:hover{border-color:#B08D57}
  .an-rail .item .k{font:600 11px/1 ui-monospace,Menlo,monospace;color:#FFC000}
  .an-rail .item .c{font:13px/1.45 Inter,sans-serif;color:#f4f2ec;margin-top:5px}
  .an-rail footer{padding:12px 14px;border-top:1px solid #2a2a2e;display:flex;gap:8px}
  .an-fab{position:fixed;bottom:22px;right:22px;z-index:39;font:700 13px/1 Inter,sans-serif;
    letter-spacing:.04em;color:#0b0b0c;background:#B08D57;border:none;border-radius:999px;
    padding:13px 18px;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.4)}
  .an-fab:hover{background:#FFC000}
  .an-banner{position:fixed;bottom:22px;left:22px;z-index:39;max-width:360px;background:#1b1b1e;
    border:1px solid #2a2a2e;border-left:3px solid #e0794a;border-radius:8px;padding:10px 12px;
    font:12px/1.45 Inter,sans-serif;color:#a5a29a}
  .an-banner code{background:#000;border:1px solid #2a2a2e;border-radius:4px;padding:1px 5px;color:#FFC000;font-size:11px}
  .an-mini{all:unset;cursor:pointer;color:#6f6c64;font-size:11px}
  .an-mini:hover{color:#f4f2ec}
  @media print{
    .an-gutter,.an-h2row,.an-fab,.an-rail,.an-note,.an-compose,.an-banner{display:none!important}
  }
  .an-mic{all:unset;cursor:pointer;font:600 11px/1 ui-monospace,Menlo,monospace;color:#f4f2ec;
    background:#2a2a2e;border:1px solid #3a3a3e;border-radius:6px;padding:4px 8px;letter-spacing:.04em;white-space:nowrap}
  .an-mic:hover{border-color:#B08D57}
  .an-mic.rec{background:#e0794a;border-color:#e0794a;color:#0b0b0c;animation:an-pulse 1.1s ease-in-out infinite}
  .an-mic.busy{opacity:.6;cursor:progress}
  @keyframes an-pulse{0%,100%{opacity:1}50%{opacity:.55}}
  .an-vu{display:none;align-items:center;gap:7px}
  .an-vu.on{display:inline-flex}
  .an-bars{display:inline-flex;align-items:flex-end;gap:2px;height:16px}
  .an-bars i{width:3px;height:3px;background:#e0794a;border-radius:1px;transition:height .07s linear}
  .an-time{font:600 11px/1 ui-monospace,Menlo,monospace;color:#e0794a;min-width:34px}
  .an-status{font:11px/1.4 ui-monospace,Menlo,monospace;color:#6f6c64}
  .an-status.err{color:#e0794a}
  .an-note audio,.an-compose audio{width:100%;height:32px;margin-top:7px;display:block}
  .an-voicetag{font:600 10px/1 ui-monospace,Menlo,monospace;color:#0b0b0c;background:#B08D57;
    border-radius:4px;padding:2px 6px;letter-spacing:.06em}`;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // ---------- state ----------
  var notes = [];          // {id, key, comment, at}
  function keyOf(el) {
    if (el.dataset.annot) return el.dataset.annot;
    if (el.classList.contains("shot")) {
      var idEl = el.querySelector(".id");
      if (idEl) return (idEl.textContent.trim().match(/^S?\d+|^[A-Za-z0-9]+/) || ["?"])[0];
    }
    if (/^H\d$/.test(el.tagName)) {
      return el.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
    }
    return "sec-" + Array.prototype.indexOf.call(document.querySelectorAll(SEL), el);
  }
  function uid() { return "n" + Math.abs(Math.random() * 1e9 | 0).toString(36) + notes.length; }

  // ---------- persistence ----------
  function lsLoad() { try { return JSON.parse(localStorage.getItem(LSKEY) || "[]"); } catch (e) { return []; } }
  function lsSave() { localStorage.setItem(LSKEY, JSON.stringify(notes)); }

  async function serverLoad() {
    var r = await fetch("/annotations", { cache: "no-store" });
    var all = await r.json();
    return all.filter(function (e) { return (e.section || "").indexOf(SPEC + "/") === 0; })
      .map(function (e) {
        return { id: uid(), key: e.section.slice(SPEC.length + 1), comment: e.comment, at: e.at, audio: e.audio || null };
      });
  }
  async function serverSave(note) {
    var r = await fetch("/annotate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: SPEC + "/" + note.key, comment: note.comment, audio: note.audio || "" })
    });
    if (!r.ok) throw new Error("annotate " + r.status);
  }

  var usingServer = online;
  async function boot() {
    if (online) {
      try { notes = await serverLoad(); }
      catch (e) { usingServer = false; notes = lsLoad(); }
    } else { usingServer = false; notes = lsLoad(); }
    renderAll();
    if (!usingServer) banner();
  }
  async function addNote(key, comment, audio) {
    var note = { id: uid(), key: key, comment: comment, at: new Date().toISOString().slice(0, 19), audio: audio || null };
    notes.push(note);
    if (usingServer) { try { await serverSave(note); } catch (e) { usingServer = false; lsSave(); banner(); } }
    else lsSave();
    renderAll();
  }
  function delNote(id) {
    notes = notes.filter(function (n) { return n.id !== id; });
    if (!usingServer) lsSave();
    // server inbox is append-only DATA; deletions only affect the local view when offline.
    renderAll();
  }

  // ---------- render ----------
  var targets = [];
  function collect() {
    targets = Array.prototype.slice.call(document.querySelectorAll(SEL))
      .concat(Array.prototype.slice.call(document.querySelectorAll("[data-annot]")))
      .filter(function (v, i, a) { return a.indexOf(v) === i; });
  }
  function notesFor(key) { return notes.filter(function (n) { return n.key === key; }); }

  function mountControls(el) {
    var key = keyOf(el);
    el.setAttribute("data-annot-key", key);
    if (/^H\d$/.test(el.tagName)) {
      var row = document.createElement("span"); row.className = "an-h2row"; row.dataset.slot = key;
      var b = document.createElement("button"); b.className = "an-btn"; b.textContent = "＋ note";
      b.onclick = function () { openComposer(el, key); };
      row.appendChild(b); el.appendChild(row);
    } else {
      el.classList.add("an-anchor");
      var g = document.createElement("div"); g.className = "an-gutter"; g.dataset.slot = key;
      var b2 = document.createElement("button"); b2.className = "an-btn"; b2.textContent = "＋ note";
      b2.onclick = function () { openComposer(el, key); };
      g.appendChild(b2); el.appendChild(g);
    }
  }
  // ---------- voice notes ----------
  // Records real audio, sends it to serve.py's /transcribe (Whisper), and keeps the
  // recording so Jake can replay exactly what he said rather than trusting the text.
  // Falls back to the browser's live speech recognition when there is no server.
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  var canRecord = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);

  function pickMime() {
    var opts = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"];
    for (var i = 0; i < opts.length; i++) {
      if (window.MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(opts[i])) return opts[i];
    }
    return "";
  }

  function VoiceRecorder(ui) {
    // ui: {mic, vu, bars, time, status, onTranscript}
    var media = null, chunks = [], stream = null, ticker = null, raf = null, audioCtx = null, t0 = 0;
    var self = this;
    self.active = false;

    function say(msg, isErr) {
      ui.status.textContent = msg || "";
      ui.status.classList.toggle("err", !!isErr);
    }
    function meter() {
      var ac = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx = ac;
      var an = ac.createAnalyser(); an.fftSize = 64;
      ac.createMediaStreamSource(stream).connect(an);
      var data = new Uint8Array(an.frequencyBinCount);
      var bars = ui.bars.querySelectorAll("i");
      (function loop() {
        an.getByteFrequencyData(data);
        for (var i = 0; i < bars.length; i++) {
          var v = data[i * 2] / 255;
          bars[i].style.height = Math.max(3, Math.round(v * 16)) + "px";
        }
        raf = requestAnimationFrame(loop);
      })();
    }
    function clock() {
      ticker = setInterval(function () {
        var s = Math.floor((Date.now() - t0) / 1000);
        ui.time.textContent = Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
      }, 250);
    }
    function teardown() {
      if (ticker) { clearInterval(ticker); ticker = null; }
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      if (audioCtx) { try { audioCtx.close(); } catch (e) {} audioCtx = null; }
      if (stream) { stream.getTracks().forEach(function (t) { t.stop(); }); stream = null; }
      ui.vu.classList.remove("on");
      ui.mic.classList.remove("rec");
      ui.mic.textContent = "🎙 Record note";
      self.active = false;
    }

    self.start = function () {
      say("");
      navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) {
        stream = s; chunks = [];
        var mime = pickMime();
        media = mime ? new MediaRecorder(s, { mimeType: mime }) : new MediaRecorder(s);
        media.ondataavailable = function (e) { if (e.data && e.data.size) chunks.push(e.data); };
        media.onstop = function () { self.finish(); };
        media.start();
        t0 = Date.now(); self.active = true;
        ui.mic.classList.add("rec"); ui.mic.textContent = "■ Stop";
        ui.vu.classList.add("on"); ui.time.textContent = "0:00";
        say("recording — click stop when you are done");
        clock(); try { meter(); } catch (e) {}
      }).catch(function (err) {
        say("microphone blocked (" + (err && err.name ? err.name : "error") + ") — allow mic access in the address bar", true);
      });
    };

    self.stop = function () {
      if (media && media.state !== "inactive") { try { media.stop(); } catch (e) { teardown(); } }
      else teardown();
    };

    self.finish = function () {
      var type = (media && media.mimeType) || "audio/webm";
      var blob = new Blob(chunks, { type: type });
      teardown();
      if (!blob.size) { say("nothing recorded", true); return; }
      if (!usingServer) {
        // No server to transcribe against — keep the audio locally so it is not lost.
        ui.onTranscript("", URL.createObjectURL(blob), blob);
        say("saved audio only — start serve.py to get automatic transcription", true);
        return;
      }
      ui.mic.classList.add("busy"); ui.mic.disabled = true;
      say("transcribing…");
      fetch("/transcribe", { method: "POST", headers: { "Content-Type": type }, body: blob })
        .then(function (r) { return r.json().then(function (j) { return { ok: r.ok, j: j }; }); })
        .then(function (res) {
          ui.mic.classList.remove("busy"); ui.mic.disabled = false;
          if (!res.ok || res.j.error) {
            ui.onTranscript("", res.j.audio || URL.createObjectURL(blob), blob);
            say("transcription failed (" + (res.j.error || "server error") + ") — audio kept, type your note", true);
            return;
          }
          ui.onTranscript(res.j.text || "", res.j.audio, blob);
          say(res.j.text ? "transcribed — edit it if Whisper misheard, then save" : "no speech detected", !res.j.text);
        })
        .catch(function (e) {
          ui.mic.classList.remove("busy"); ui.mic.disabled = false;
          ui.onTranscript("", URL.createObjectURL(blob), blob);
          say("could not reach the server — audio kept locally", true);
        });
    };
  }

  function openComposer(el, key) {
    if (el.querySelector(".an-compose")) return;
    var box = document.createElement("div"); box.className = "an-compose";
    var ta = document.createElement("textarea");
    ta.placeholder = "Note on " + key + "… or hit “🎙 Record note” and just talk.";
    var row = document.createElement("div"); row.className = "row";
    var save = document.createElement("button"); save.className = "an-btn"; save.textContent = "Save note";
    var cancel = document.createElement("button"); cancel.className = "an-mini"; cancel.textContent = "cancel";
    var hint = document.createElement("span"); hint.className = "an-mini"; hint.style.marginLeft = "auto";
    hint.textContent = "⌘/Ctrl+Enter";

    var audioPath = null;          // server path, saved with the note
    var player = null;             // inline playback of what was just recorded
    var recorder = null, srLive = null;

    var mic = document.createElement("button"); mic.type = "button"; mic.className = "an-mic";
    mic.textContent = "🎙 Record note";
    var vu = document.createElement("span"); vu.className = "an-vu";
    var bars = document.createElement("span"); bars.className = "an-bars";
    for (var i = 0; i < 7; i++) bars.appendChild(document.createElement("i"));
    var time = document.createElement("span"); time.className = "an-time"; time.textContent = "0:00";
    vu.appendChild(bars); vu.appendChild(time);
    var status = document.createElement("div"); status.className = "an-status";

    function attachPlayer(src) {
      if (player) player.remove();
      player = document.createElement("audio"); player.controls = true; player.src = src;
      box.insertBefore(player, status);
    }

    if (canRecord) {
      mic.title = "Click to record, click again to stop. The audio is transcribed and kept with the note.";
      recorder = new VoiceRecorder({
        mic: mic, vu: vu, bars: bars, time: time, status: status,
        onTranscript: function (text, src, blob) {
          if (src) { audioPath = (src.indexOf("blob:") === 0) ? null : src; attachPlayer(src); }
          if (text) ta.value = ta.value ? (ta.value.replace(/\s+$/, "") + " " + text) : text;
          ta.focus();
        }
      });
      mic.onclick = function () { recorder.active ? recorder.stop() : recorder.start(); };
    } else if (SR) {
      // Older browsers with no MediaRecorder: live dictation, no audio kept.
      var recognizing = false;
      mic.textContent = "🎙 Dictate";
      mic.onclick = function () {
        if (recognizing) { try { srLive.stop(); } catch (e) {} return; }
        var base = ta.value ? (ta.value.replace(/\s+$/, "") + " ") : "";
        srLive = new SR(); srLive.lang = "en-US"; srLive.continuous = true; srLive.interimResults = true;
        srLive.onstart = function () { recognizing = true; mic.classList.add("rec"); mic.textContent = "● listening"; };
        srLive.onresult = function (ev) {
          var fin = "", int_ = "";
          for (var i = 0; i < ev.results.length; i++) {
            var t = ev.results[i][0].transcript;
            if (ev.results[i].isFinal) fin += t + " "; else int_ += t;
          }
          ta.value = base + fin + int_;
        };
        srLive.onend = srLive.onerror = function () {
          recognizing = false; mic.classList.remove("rec"); mic.textContent = "🎙 Dictate";
        };
        try { srLive.start(); } catch (e) {}
      };
    } else {
      mic.disabled = true; mic.style.opacity = ".5";
      mic.title = "This browser cannot record audio — type the note instead.";
    }

    function halt() {
      if (recorder && recorder.active) recorder.stop();
      if (srLive) { try { srLive.stop(); } catch (e) {} }
    }
    save.onclick = function () {
      halt();
      var v = ta.value.trim();
      // A recording with no usable transcript is still worth keeping.
      if (!v && audioPath) v = "(voice note — play the recording)";
      if (v) addNote(key, v, audioPath);
      box.remove();
    };
    cancel.onclick = function () { halt(); box.remove(); };
    ta.onkeydown = function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") save.onclick();
      if (e.key === "Escape") { halt(); box.remove(); }
    };

    row.appendChild(mic); row.appendChild(vu);
    row.appendChild(save); row.appendChild(cancel); row.appendChild(hint);
    box.appendChild(ta); box.appendChild(row); box.appendChild(status);
    el.appendChild(box); ta.focus();
  }
  function renderNotesUnder(el, key) {
    Array.prototype.slice.call(el.querySelectorAll(":scope > .an-note")).forEach(function (n) { n.remove(); });
    notesFor(key).forEach(function (n) {
      var d = document.createElement("div"); d.className = "an-note";
      var m = document.createElement("div"); m.className = "meta";
      var ks = document.createElement("span"); ks.textContent = "● " + n.at.replace("T", " ");
      m.appendChild(ks);
      if (n.audio) {
        var tag = document.createElement("span"); tag.className = "an-voicetag"; tag.textContent = "VOICE";
        m.appendChild(tag);
      }
      if (!usingServer) {
        var del = document.createElement("button"); del.className = "del"; del.textContent = "delete";
        del.onclick = function () { delNote(n.id); }; m.appendChild(del);
      }
      var c = document.createElement("div"); c.textContent = n.comment;
      d.appendChild(m); d.appendChild(c);
      if (n.audio) {
        var au = document.createElement("audio"); au.controls = true; au.preload = "none"; au.src = n.audio;
        d.appendChild(au);
      }
      el.appendChild(d);
    });
    var slot = el.querySelector(".an-gutter, .an-h2row");
    if (slot) {
      var ex = slot.querySelector(".an-count"); var cnt = notesFor(key).length;
      if (cnt) { if (!ex) { ex = document.createElement("span"); ex.className = "an-count"; slot.insertBefore(ex, slot.firstChild); } ex.textContent = cnt; }
      else if (ex) ex.remove();
    }
  }
  function renderAll() {
    targets.forEach(function (el) { renderNotesUnder(el, el.getAttribute("data-annot-key")); });
    renderRail();
  }

  // ---------- rail + fab ----------
  var rail, railBody, fab;
  function buildChrome() {
    fab = document.createElement("button"); fab.className = "an-fab"; fab.onclick = toggleRail;
    document.body.appendChild(fab);
    rail = document.createElement("div"); rail.className = "an-rail";
    var h = document.createElement("header"); var t = document.createElement("b"); t.textContent = "Annotations";
    var close = document.createElement("button"); close.className = "an-mini"; close.textContent = "✕"; close.style.marginLeft = "auto";
    close.onclick = toggleRail; h.appendChild(t); h.appendChild(close);
    railBody = document.createElement("div"); railBody.className = "body";
    var f = document.createElement("footer");
    var exp = document.createElement("button"); exp.className = "an-btn"; exp.textContent = "Export JSON"; exp.onclick = exportJson;
    var copy = document.createElement("button"); copy.className = "an-mini"; copy.textContent = "copy all"; copy.onclick = copyAll;
    f.appendChild(exp); f.appendChild(copy);
    rail.appendChild(h); rail.appendChild(railBody); rail.appendChild(f);
    document.body.appendChild(rail);
  }
  function toggleRail() { rail.classList.toggle("open"); }
  function renderRail() {
    if (!fab) return;
    fab.textContent = "💬 Comments" + (notes.length ? " (" + notes.length + ")" : "");
    railBody.innerHTML = "";
    if (!notes.length) { var e = document.createElement("div"); e.style.cssText = "color:#6f6c64;font:13px Inter"; e.textContent = "No notes yet. Hit “＋ note” on any shot or section."; railBody.appendChild(e); return; }
    notes.slice().sort(function (a, b) { return a.key.localeCompare(b.key, undefined, { numeric: true }); }).forEach(function (n) {
      var it = document.createElement("div"); it.className = "item";
      var k = document.createElement("div"); k.className = "k"; k.textContent = n.key;
      var c = document.createElement("div"); c.className = "c"; c.textContent = n.comment;
      it.appendChild(k); it.appendChild(c);
      it.onclick = function () {
        var el = document.querySelector('[data-annot-key="' + CSS.escape(n.key) + '"]');
        if (el) { el.scrollIntoView({ behavior: "smooth", block: "center" }); }
      };
      railBody.appendChild(it);
    });
  }
  function exportJson() {
    var payload = notes.map(function (n) { return { at: n.at, section: SPEC + "/" + n.key, comment: n.comment, audio: n.audio || "" }; });
    var blob = new Blob([payload.map(function (p) { return JSON.stringify(p); }).join("\n")], { type: "application/x-ndjson" });
    var a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = SPEC + "-annotations.jsonl"; a.click();
  }
  function copyAll() {
    var txt = notes.map(function (n) { return "[" + n.key + "] " + n.comment; }).join("\n");
    navigator.clipboard && navigator.clipboard.writeText(txt);
  }
  function banner() {
    if (document.querySelector(".an-banner")) return;
    var b = document.createElement("div"); b.className = "an-banner";
    b.innerHTML = "Local mode — notes saved in this browser only. To save into the pipeline inbox, run " +
      "<code>python3 serve.py</code> and open this page via <code>localhost:8765</code>.";
    document.body.appendChild(b);
    setTimeout(function () { b.style.transition = "opacity .5s"; b.style.opacity = "0"; setTimeout(function () { b.remove(); }, 600); }, 9000);
  }

  // ---------- init ----------
  collect();
  targets.forEach(mountControls);
  buildChrome();
  boot();
})();
