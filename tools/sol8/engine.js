/* SOL Mathe 8 · Lern-Engine. Erwartet window.MODULE und window.CONFIG. */
(function () {
  'use strict';
  var MOD = window.MODULE, CFG = window.CONFIG;
  var KEY = 'sol8-' + MOD.id;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  /* Anzeige-Feinschliff: echtes Minuszeichen und 1x → x, nur im Text, nie in Attributen */
  function nice(h) { return String(h == null ? '' : h).split(/(<[^>]*>)/).map(function (p) { return p.charAt(0) === '<' ? p : p.replace(/(^|[\s(=:\[{>])-(?=\d)/g, '$1\u2212').replace(/(^|[\s(=:+\u2212·>])1x(?![\w²³^])/g, '$1x'); }).join(''); }
  function h(tag, attrs, html) { var e = document.createElement(tag); if (attrs) Object.keys(attrs).forEach(function (k) { if (k === 'class') e.className = attrs[k]; else e.setAttribute(k, attrs[k]); }); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var SECTIONS = [
    ['start', 'Start'], ['einstieg', 'Einstieg'], ['ziele', 'Lernziele'], ['diagnose', 'Startdiagnose'], ['erklaerung', 'Erklärung'],
    ['entdecken', 'Ausprobieren'], ['beispiel', 'Beispiel'], ['ueben', 'Üben'], ['weiterdenken', 'Weiterdenken'], ['test', 'Abschlusstest'],
    ['lerncheck', 'Mein Lerncheck'], ['ergebnis', 'Ergebnis']
  ];
  var REQUIRED = ['einstieg', 'diagnose', 'erklaerung', 'entdecken', 'ueben', 'test', 'lerncheck'];
  function req() { return S.way === 'E' ? REQUIRED.slice(0, 5).concat(['weiterdenken'], REQUIRED.slice(5)) : REQUIRED; }
  var WAYS = { G: 'Sicher · G', S: 'Standard · G/E', E: 'Weiterdenken · E' };
  var WAY_INFO = { G: 'Sicher: weniger Aufgaben, Tipps sind sofort sichtbar. Weiterdenken ist freiwillig.', S: 'Standard: du bearbeitest alle Pflichtaufgaben und kannst Tipps öffnen.', E: 'Weiterdenken: mehr und schwierigere Aufgaben. Die Weiterdenken-Aufgabe ist Pflicht.' };
  var LC_SCALE = ['Sicher', 'Meistens', 'Mit Hilfe', 'Noch nicht'];

  /* ---------- Zustand ---------- */
  var S = load() || { v: 1, lerncode: '', klasse: '', email: '', way: 'S', started: false, sec: 'start', done: {}, diag: {}, diagChecked: false,
    slots: [], extra: null, test: null, lc: {}, stats: { attempts: 0, firstTry: 0, hints: 0, solutions: 0 }, startedAt: null, sent: false, abgabeId: null };
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function load() { try { var d = JSON.parse(localStorage.getItem(KEY) || 'null'); return d && d.v === 1 ? d : null; } catch (e) { return null; } }
  function mark(k) { if (!S.done[k]) { S.done[k] = true; save(); progress(); navState(); } }

  /* ---------- Normalisierung Lernende ---------- */
  function normCode(v) { var t = String(v || '').toUpperCase().replace(/[^A-ZÄÖÜ]/g, ''); return t.length === 2 ? t : ''; }
  function normKlasse(v) { var m = String(v || '').toLowerCase().replace(/[^a-z0-9]/g, '').match(new RegExp(CFG.jahrgang + '([a-z]?)$')); return m ? CFG.jahrgang + m[1] : ''; }
  function emailOk(v) { v = String(v || '').trim(); if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) return false; return !CFG.iservDomain || v.toLowerCase().slice(-CFG.iservDomain.length - 1) === '@' + CFG.iservDomain.toLowerCase(); }

  /* ---------- Aufgaben prüfen ---------- */
  var checkInput = M.check;
  function renderInputs(task, prefix, values) {
    return task.inputs.map(function (inp, i) {
      var id = prefix + '-' + i, val = values && values[i] != null ? values[i] : '';
      if (inp.kind === 'mc') {
        return '<fieldset class="mc"><legend>' + (inp.label || 'Wähle aus') + '</legend>' + inp.options.map(function (o, k) {
          return '<label class="opt"><input type="radio" name="' + id + '" value="' + k + '"' + (String(val) === String(k) ? ' checked' : '') + '><span>' + o + '</span></label>';
        }).join('') + '</fieldset>';
      }
      var mode = inp.kind === 'term' || inp.kind === 'text' ? 'text' : 'decimal';
      return '<label class="inp"><span>' + (inp.label || 'Ergebnis') + '</span><span class="inrow"><input id="' + id + '" inputmode="' + mode + '" autocomplete="off" spellcheck="false" value="' + esc(val) + '"' + (inp.placeholder ? ' placeholder="' + esc(inp.placeholder) + '"' : '') + '>' + (inp.unit ? '<b class="unit">' + inp.unit + '</b>' : '') + '</span></label>';
    }).join('');
  }
  function readInputs(task, prefix, root) {
    return task.inputs.map(function (inp, i) {
      if (inp.kind === 'mc') { var c = $('input[name="' + prefix + '-' + i + '"]:checked', root); return c ? c.value : ''; }
      var e = $('#' + prefix + '-' + i, root); return e ? e.value : '';
    });
  }
  /* Reproduzierbarer Zufall: gleiche Startzahl, gleiche Aufgabe (damit Fehlerhinweise nach dem Neuladen erhalten bleiben) */
  function seeded(seed, fn) {
    var orig = Math.random, s = seed >>> 0;
    Math.random = function () { s = (s + 0x6D2B79F5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    try { return fn(); } finally { Math.random = orig; }
  }
  function revive(t) {
    if (!t || t.seed == null || typeof t.mistakes === 'function' || !MOD.tasks.gen[t.key]) return t;
    try { var r = gen(t.key, t.level, t.seed); if (r.q === t.q && r.mistakes) t.mistakes = r.mistakes; } catch (e) { }
    return t;
  }
  function gen(key, level, seed) { if (seed == null) seed = Math.floor(Math.random() * 4294967296); var t = seeded(seed, function () { return MOD.tasks.gen[key](level || 2); }); t.seed = seed; t.key = key; t.level = t.level || level || 2; t.q = nice(t.q); t.solution = nice(t.solution); t.hints = (t.hints || []).map(nice); t.inputs.forEach(function (i) { if (i.options) i.options = i.options.map(nice); }); return t; }

  /* ---------- Fortschritt und Navigation ---------- */
  function progress() {
    var n = req().filter(function (k) { return S.done[k]; }).length;
    $('#bar').style.width = Math.round(n / req().length * 100) + '%';
    $('#progText').textContent = n + ' von ' + req().length + ' Pflichtschritten';
  }
  function navState() {
    $$('#nav a').forEach(function (a) { var k = a.dataset.sec; a.classList.toggle('active', k === S.sec); a.classList.toggle('done', !!S.done[k]); a.setAttribute('aria-current', k === S.sec ? 'step' : 'false'); });
  }
  function go(sec, noScroll) {
    if (!S.started && sec !== 'start') { show('start'); fb('#startFb', 'Bitte trage zuerst Lerncode, Klasse und IServ-Adresse ein und tippe auf „Start“.', 'bad'); return; }
    show(sec); if (!noScroll) { var m = $('#main'); if (m.getBoundingClientRect().top < 0) m.scrollIntoView({ behavior: 'smooth' }); }
  }
  function show(sec) {
    S.sec = sec; save();
    $$('.sec').forEach(function (s) { s.hidden = s.id !== 'sec-' + sec; });
    navState();
    if (RENDER[sec]) RENDER[sec]();
    try { history.replaceState(null, '', '#' + sec); } catch (e) { }
  }
  function fb(sel, msg, kind) { var e = $(sel); if (!e) return; e.className = 'fb ' + (kind || ''); e.innerHTML = msg; }
  function pager(sec) {
    var i = SECTIONS.findIndex(function (s) { return s[0] === sec; });
    var prev = SECTIONS[i - 1], next = SECTIONS[i + 1];
    return '<div class="pager">' + (prev && i > 1 ? '<button class="btn ghost" data-go="' + prev[0] + '">← ' + prev[1] + '</button>' : '<span></span>') +
      (next ? '<button class="btn" data-go="' + next[0] + '">' + next[1] + ' →</button>' : '') + '</div>';
  }

  /* ---------- Abschnitte ---------- */
  var RENDER = {};
  function buildShell() {
    var app = $('#app');
    app.innerHTML =
      '<header class="hero"><div class="wrap hero-in"><div class="hero-top"><span class="brand">SOL Mathematik ' + CFG.jahrgang + ' · Oberschule Niedersachsen</span>' +
      '<span class="tools"><button class="tbtn" id="easyBtn" aria-pressed="false">Leichter lesen</button><button class="tbtn" id="readBtn">Vorlesen</button><button class="tbtn" id="stopBtn">Stopp</button></span></div>' +
      '<div class="hero-main"><div><p class="eyebrow">' + MOD.bereich + '</p><h1>' + MOD.title + '</h1><p class="lead">' + MOD.lead + '</p></div>' +
      '<div class="badge"><span>Modul</span><strong>' + MOD.id + '</strong><span>' + MOD.minutes + ' Minuten</span></div></div></div></header>' +
      '<div class="progress"><div class="wrap prog-in"><div class="track"><div id="bar"></div></div><span id="progText"></span></div></div>' +
      '<div class="wrap layout"><nav id="nav" aria-label="Abschnitte">' + SECTIONS.map(function (s) { return '<a href="#' + s[0] + '" data-sec="' + s[0] + '">' + s[1] + '</a>'; }).join('') + '</nav>' +
      '<main id="main">' + SECTIONS.map(function (s) { return '<section class="sec card" id="sec-' + s[0] + '" hidden aria-labelledby="h-' + s[0] + '"></section>'; }).join('') + '</main></div>' +
      '<footer class="foot wrap"><a href="' + CFG.backUrl + '">← Zur Übersicht Klasse ' + CFG.jahrgang + '</a><span>© Dr. Edmund Bruns · CC BY-NC 4.0</span></footer>';
    $('#nav').addEventListener('click', function (e) { var a = e.target.closest('a'); if (!a) return; e.preventDefault(); go(a.dataset.sec); });
    app.addEventListener('click', function (e) { var b = e.target.closest('[data-go]'); if (b) { e.preventDefault(); go(b.dataset.go); } });
    $('#easyBtn').addEventListener('click', function () { var on = document.body.classList.toggle('easy'); this.setAttribute('aria-pressed', String(on)); });
    $('#readBtn').addEventListener('click', function () { if (!('speechSynthesis' in window)) return; speechSynthesis.cancel(); var sec = $('#sec-' + S.sec); var u = new SpeechSynthesisUtterance(sec.innerText.replace(/[←→]/g, '')); u.lang = 'de-DE'; u.rate = 0.95; speechSynthesis.speak(u); });
    $('#stopBtn').addEventListener('click', function () { if ('speechSynthesis' in window) speechSynthesis.cancel(); });
  }

  RENDER.start = function () {
    var s = $('#sec-start'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-start">Bevor du beginnst</h2>' +
      '<div class="facts"><div><b>Klasse</b>' + CFG.jahrgang + '</div><div><b>Vorkenntnisse</b>' + MOD.vorkenntnisse + '</div><div><b>Du brauchst</b>Heft, Stift und dieses Gerät</div></div>' +
      '<div class="grid2"><label class="inp"><span>Lerncode *</span><input id="lerncode" maxlength="2" autocomplete="off" placeholder="z. B. MS" value="' + esc(S.lerncode) + '"><small>Erster Buchstabe deines Vornamens und erster Buchstabe deines Nachnamens. Beispiel: Mia Schulte → MS</small></label>' +
      '<label class="inp"><span>Klasse *</span><input id="klasse" maxlength="12" autocomplete="off" placeholder="z. B. ' + CFG.jahrgang + 'a" value="' + esc(S.klasse) + '"><small>„' + CFG.jahrgang + 'a“, „Klasse ' + CFG.jahrgang + 'a“ oder nur „' + CFG.jahrgang + '“ sind möglich.</small></label></div>' +
      '<label class="inp"><span>IServ-E-Mail-Adresse *</span><input id="email" type="email" autocomplete="email" placeholder="vorname.nachname@…" value="' + esc(S.email) + '"><small>Deine Schul-Adresse aus IServ. Sie wird nur mit deinem Ergebnis an deine Lehrkraft übertragen.</small></label>' +
      '<fieldset class="ways"><legend>Mein Lernweg</legend>' + Object.keys(WAYS).map(function (k) { return '<label class="way"><input type="radio" name="way" value="' + k + '"' + (S.way === k ? ' checked' : '') + '><span>' + WAYS[k] + '</span></label>'; }).join('') + '</fieldset>' +
      '<p class="note" id="wayInfo">' + WAY_INFO[S.way] + '</p>' +
      '<div class="actions"><button class="btn big" id="startBtn">Start</button>' + (S.started ? '<button class="btn ghost" id="resetBtn">Neu beginnen</button>' : '') + '</div><p class="fb" id="startFb" role="status"></p>';
    $$('input[name=way]', s).forEach(function (r) { r.addEventListener('change', function () { if (S.slots.length && S.slots.some(function (x) { return x.solved; })) { fb('#startFb', 'Hinweis: Wenn du den Lernweg änderst, werden deine Übungsaufgaben neu zusammengestellt.', 'hint'); } $('#wayInfo').textContent = WAY_INFO[this.value]; }); });
    ['lerncode', 'klasse', 'email'].forEach(function (id) { $('#' + id).addEventListener('input', function () { S[id] = this.value; save(); }); });
    $('#startBtn').addEventListener('click', function () {
      var c = normCode($('#lerncode').value), k = normKlasse($('#klasse').value), e = $('#email').value.trim();
      if (!c) return fb('#startFb', 'Der Lerncode besteht aus genau zwei Buchstaben, zum Beispiel MS.', 'bad');
      if (!k) return fb('#startFb', 'Diese Klasse gehört nicht zu Jahrgang ' + CFG.jahrgang + '. Schreibe zum Beispiel ' + CFG.jahrgang + 'a oder nur ' + CFG.jahrgang + '.', 'bad');
      if (!emailOk(e)) return fb('#startFb', CFG.iservDomain ? 'Bitte gib deine IServ-Adresse ein. Sie endet auf @' + CFG.iservDomain + '.' : 'Bitte gib eine gültige IServ-E-Mail-Adresse ein.', 'bad');
      var w = ($('input[name=way]:checked', s) || {}).value || 'S';
      if (w !== S.way) { S.slots = []; S.extra = null; S.done.ueben = false; }
      S.lerncode = c; S.klasse = k; S.email = e; S.way = w; S.started = true; if (!S.startedAt) S.startedAt = Date.now();
      $('#lerncode').value = c; $('#klasse').value = k; save(); go('einstieg');
    });
    var rb = $('#resetBtn'); if (rb) rb.addEventListener('click', function () { if (!confirm('Wirklich neu beginnen? Dein bisheriger Stand in diesem Modul wird gelöscht.')) return; try { localStorage.removeItem(KEY); } catch (e) { } location.hash = ''; location.reload(); });
  };

  RENDER.einstieg = function () {
    var s = $('#sec-einstieg'); if (s.dataset.r) return; s.dataset.r = 1;
    var v = MOD.einstieg.video;
    s.innerHTML = '<h2 id="h-einstieg">Einstieg</h2>' + (v ? '<div class="video"><iframe src="' + v.src + '" title="' + esc(v.title) + '" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>' : '') +
      '<div class="story">' + MOD.einstieg.html + '</div>' + pager('einstieg');
    mark('einstieg');
  };
  RENDER.ziele = function () {
    var s = $('#sec-ziele'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-ziele">Das lernst du in diesem Modul</h2><ul class="goals">' + MOD.ziele.map(function (z) { return '<li>' + z + '</li>'; }).join('') + '</ul>' +
      (MOD.fachwoerter ? '<h3>Fachwörter</h3><dl class="terms">' + MOD.fachwoerter.map(function (f) { return '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>'; }).join('') + '</dl>' : '') + pager('ziele');
  };
  RENDER.diagnose = function () {
    var s = $('#sec-diagnose'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-diagnose">Startdiagnose</h2><p>Finde heraus, was du schon kannst. Das ist kein Test, es zählt nur für dich.</p>' +
      MOD.diagnose.map(function (d, i) { return '<div class="task"><p class="q"><b>' + (i + 1) + '.</b> ' + d.q + '</p>' + d.options.map(function (o, k) { return '<label class="opt"><input type="radio" name="dg' + i + '" value="' + k + '"' + (S.diag[i] === k ? ' checked' : '') + '><span>' + o + '</span></label>'; }).join('') + '<p class="fb" id="dgfb' + i + '"></p></div>'; }).join('') +
      '<div class="actions"><button class="btn" id="dgBtn">Auswerten</button></div><div class="fb" id="dgSum" role="status"></div>' + pager('diagnose');
    $$('input[type=radio]', s).forEach(function (r) { r.addEventListener('change', function () { S.diag[+this.name.slice(2)] = +this.value; save(); }); });
    $('#dgBtn').addEventListener('click', function () { evalDiag(true); });
    if (S.diagChecked) evalDiag(false);
  };
  function evalDiag(user) {
    var missing = MOD.diagnose.some(function (d, i) { return S.diag[i] == null; });
    if (missing && user) return fb('#dgSum', 'Beantworte bitte alle Fragen. Wenn du etwas nicht weißt, wähle „Weiß ich noch nicht“.', 'bad');
    var pts = 0, tips = [];
    MOD.diagnose.forEach(function (d, i) { var ok = S.diag[i] === d.answer; if (ok) pts++; else if (d.review) tips.push(d.review); fb('#dgfb' + i, (ok ? '✓ ' : '✗ ') + d.why, ok ? 'good' : 'bad'); });
    S.diagChecked = true; S.diagPts = pts; save(); mark('diagnose');
    fb('#dgSum', '<b>' + pts + ' von ' + MOD.diagnose.length + ' richtig.</b> ' + (pts === MOD.diagnose.length ? 'Super, die Grundlagen sitzen. Du kannst auch den Lernweg „Weiterdenken“ wählen.' : 'Das solltest du dir vorher noch einmal ansehen:<ul>' + tips.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>'), pts === MOD.diagnose.length ? 'good' : 'hint');
  }
  RENDER.erklaerung = function () {
    var s = $('#sec-erklaerung'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-erklaerung">Erklärung</h2>' + MOD.erklaerung + '<div class="actions"><button class="btn" id="exOk">Verstanden</button></div><p class="fb" id="exFb"></p>' + pager('erklaerung');
    $('#exOk').addEventListener('click', function () { mark('erklaerung'); fb('#exFb', 'Prima. Probiere es jetzt selbst aus.', 'good'); });
    if (S.done.erklaerung) fb('#exFb', '✓ Erledigt', 'good');
  };
  RENDER.entdecken = function () {
    var s = $('#sec-entdecken'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-entdecken">Ausprobieren</h2><div id="explore">' + MOD.entdecken.html + '</div><p class="fb" id="enFb"></p>' + pager('entdecken');
    MOD.entdecken.init($('#explore'), function (msg) { mark('entdecken'); if (msg) fb('#enFb', msg, 'good'); });
  };
  RENDER.beispiel = function () {
    var s = $('#sec-beispiel'); if (s.dataset.r) return; s.dataset.r = 1;
    var B = MOD.beispiel;
    s.innerHTML = '<h2 id="h-beispiel">Beispiel: ' + B.title + '</h2><div class="task"><p class="q">' + B.q + '</p><ol class="steps" id="bsSteps"></ol><div class="actions"><button class="btn" id="bsNext">Nächster Schritt</button></div></div>' + pager('beispiel');
    var i = 0; $('#bsNext').addEventListener('click', function () { if (i < B.steps.length) { $('#bsSteps').appendChild(h('li', null, B.steps[i])); i++; } if (i >= B.steps.length) { this.disabled = true; this.textContent = 'Alle Schritte gezeigt'; } });
  };

  /* Üben */
  function plan() { return MOD.tasks.plan[S.way] || MOD.tasks.plan.S; }
  RENDER.ueben = function () {
    var s = $('#sec-ueben');
    var p = plan();
    if (S.slots.length !== p.length) { S.slots = p.map(function (k) { var parts = k.split(':'); return { key: parts[0], level: +(parts[1] || 2), task: gen(parts[0], +(parts[1] || 2)), solved: false, tries: 0, hints: 0, shown: false, values: [] }; }); save(); }
    s.innerHTML = '<h2 id="h-ueben">Üben</h2><p>Bearbeite alle ' + p.length + ' Aufgaben. Bei jeder Aufgabe kannst du Tipps öffnen. Mit „Neue Aufgabe“ bekommst du neue Zahlen.</p><div id="slots"></div><div class="fb" id="ubSum" role="status"></div>' + pager('ueben');
    var box = $('#slots'); S.slots.forEach(function (sl, i) { box.appendChild(slotCard(sl, i)); });
    ubSum();
  };
  function levelTag(l) { return ['', 'Grundlage', 'Standard', 'Knobeln'][l] || ''; }
  function slotCard(sl, i) {
    var t = sl.task, c = h('div', { class: 'task' + (sl.solved ? ' solved' : ''), id: 'slot' + i });
    var showHints = S.way === 'G' ? 1 : 0;
    c.innerHTML = '<div class="thead"><span class="tag">' + levelTag(sl.level) + '</span><span class="tag plain">Aufgabe ' + (i + 1) + '</span>' + (sl.solved ? '<span class="tag ok">✓ gelöst</span>' : '') + '</div>' +
      '<div class="q">' + t.q + '</div><div class="inputs">' + renderInputs(t, 's' + i, sl.values) + '</div>' +
      '<div class="actions"><button class="btn" data-a="check">Prüfen</button><button class="btn ghost" data-a="hint">Tipp</button><button class="btn ghost" data-a="new">Neue Aufgabe</button></div>' +
      '<div class="hints"></div><p class="fb" role="status"></p>';
    var hintsBox = $('.hints', c);
    function drawHints() { hintsBox.innerHTML = t.hints.slice(0, Math.max(sl.hints, showHints)).map(function (x, k) { return '<div class="hint"><b>Tipp ' + (k + 1) + ':</b> ' + x + '</div>'; }).join('') + (sl.shown ? '<div class="hint sol"><b>Lösungsweg:</b> ' + t.solution + '</div>' : ''); }
    drawHints();
    c.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-a]'); if (!b) return;
      var a = b.dataset.a, f = $('.fb', c);
      if (a === 'check') {
        var vals = readInputs(t, 's' + i, c); sl.values = vals;
        var res = t.inputs.map(function (inp, k) { return checkInput(inp, vals[k]); });
        if (res.some(function (r) { return r.empty; })) { f.className = 'fb bad'; f.textContent = 'Fülle bitte alle Felder aus.'; return; }
        sl.tries++; S.stats.attempts++;
        var ok = res.every(function (r) { return r.ok; });
        if (ok) {
          if (!sl.solved) { sl.solved = true; if (sl.tries === 1 && !sl.hints && !sl.shown) S.stats.firstTry++; }
          if (sl === S.extra) mark('weiterdenken');
          f.className = 'fb good'; f.innerHTML = '✓ Richtig! ' + (t.praise || '');
          c.classList.add('solved'); var hd = $('.thead', c); if (!$('.tag.ok', hd)) hd.appendChild(h('span', { class: 'tag ok' }, '✓ gelöst'));
        } else {
          var msg = (res.filter(function (r) { return r.msg; })[0] || {}).msg;
          var spec = !msg && t.mistakes ? t.mistakes(vals) : null;
          f.className = 'fb ' + (res.some(function (r) { return r.almost; }) ? 'hint' : 'bad');
          f.innerHTML = msg || spec || (sl.tries >= 2 ? 'Noch nicht. Öffne einen Tipp, der hilft dir weiter.' : 'Noch nicht richtig. Prüfe deine Rechnung noch einmal.');
        }
        save(); ubSum();
      } else if (a === 'hint') {
        if (Math.max(sl.hints, showHints) < t.hints.length) { sl.hints = Math.max(sl.hints, showHints) + 1; S.stats.hints++; }
        else if (!sl.shown) { sl.shown = true; S.stats.solutions++; }
        drawHints(); save();
        b.textContent = sl.shown ? 'Lösungsweg gezeigt' : (Math.max(sl.hints, showHints) >= t.hints.length ? 'Lösungsweg zeigen' : 'Weiterer Tipp');
      } else if (a === 'new') {
        if (!sl.solved && !sl.shown && sl.tries < 2) { f.className = 'fb hint'; f.textContent = 'Versuche die Aufgabe erst zweimal oder öffne den Lösungsweg. Dann bekommst du eine neue.'; return; }
        var wasSolved = sl.solved;
        var nt = gen(sl.key, sl.level); sl.task = nt; sl.tries = 0; sl.hints = 0; sl.shown = false; sl.values = []; sl.solved = false; if (wasSolved) sl.solved = false;
        save(); c.replaceWith(slotCard(sl, i)); ubSum();
      }
    });
    return c;
  }
  function ubSum() {
    var n = S.slots.filter(function (x) { return x.solved; }).length;
    if (n === S.slots.length && n > 0) { mark('ueben'); fb('#ubSum', '<b>Alle ' + n + ' Aufgaben gelöst.</b> Weiter geht es mit „Weiterdenken“ oder direkt mit dem Abschlusstest.', 'good'); }
    else fb('#ubSum', n + ' von ' + S.slots.length + ' Aufgaben gelöst.', '');
  }

  RENDER.weiterdenken = function () {
    var s = $('#sec-weiterdenken');
    if (!S.extra) { S.extra = { task: gen(MOD.tasks.extra, 3), solved: false, hints: 0, shown: false, values: [], tries: 0 }; save(); }
    var sl = S.extra, t = sl.task;
    s.innerHTML = '<h2 id="h-weiterdenken">Weiterdenken</h2><p>' + (S.way === 'E' ? 'Diese Aufgabe ist für deinen Lernweg Pflicht.' : 'Diese Aufgabe ist freiwillig. Sie zeigt dir, ob du das Thema auch in neuen Situationen nutzen kannst.') + '</p>';
    var c = slotCard(sl, 'x'); s.appendChild(c); s.insertAdjacentHTML('beforeend', pager('weiterdenken'));
  };

  /* Abschlusstest */
  RENDER.test = function () {
    var s = $('#sec-test');
    if (!S.test) { S.test = { items: MOD.tasks.test.map(function (k) { var p = k.split(':'); return gen(p[0], +(p[1] || 2)); }), values: [], done: false, pts: 0, runs: 0, best: 0, details: [] }; save(); }
    var T = S.test;
    s.innerHTML = '<h2 id="h-test">Abschlusstest</h2><p>' + T.items.length + ' Aufgaben ohne Tipps. Rechne im Heft mit und trage dann deine Ergebnisse ein. Du wertest den Test einmal aus.</p>' +
      T.items.map(function (t, i) { return '<div class="task" id="ti' + i + '"><div class="thead"><span class="tag plain">Aufgabe ' + (i + 1) + '</span></div><div class="q">' + t.q + '</div><div class="inputs">' + renderInputs(t, 't' + i, T.values[i]) + '</div><p class="fb"></p></div>'; }).join('') +
      '<div class="actions"><button class="btn" id="tBtn"' + (T.done ? ' disabled' : '') + '>Test auswerten</button>' + (T.done ? '<button class="btn ghost" id="tNew">Noch einmal mit neuen Aufgaben</button>' : '') + '</div><div class="fb" id="tSum" role="status"></div>' + pager('test');
    T.items.forEach(function (t, i) { $$('input', $('#ti' + i)).forEach(function (el) { el.addEventListener('input', function () { T.values[i] = readInputs(t, 't' + i, $('#ti' + i)); save(); }); el.addEventListener('change', function () { T.values[i] = readInputs(t, 't' + i, $('#ti' + i)); save(); }); }); });
    $('#tBtn').addEventListener('click', function () {
      var vals = T.items.map(function (t, i) { return readInputs(t, 't' + i, $('#ti' + i)); });
      var empty = vals.some(function (v) { return v.some(function (x) { return String(x).trim() === ''; }); });
      if (empty && !confirm('Du hast noch nicht alle Felder ausgefüllt. Trotzdem auswerten?')) return;
      T.values = vals; T.done = true; T.runs++; save(); showTest();
      $('#tBtn').disabled = true;
      if (!$('#tNew')) { var nb = h('button', { class: 'btn ghost', id: 'tNew' }, 'Noch einmal mit neuen Aufgaben'); $('#tBtn').after(nb); bindNew(); }
    });
    function bindNew() { var n = $('#tNew'); if (n) n.addEventListener('click', function () { if (!confirm('Neuer Test mit neuen Zahlen? Dein bestes Ergebnis bleibt gespeichert.')) return; var best = T.best, runs = T.runs; S.test = null; save(); RENDER.test(); S.test.best = best; S.test.runs = runs; save(); }); }
    bindNew();
    if (T.done) showTest();
  };
  function showTest() {
    var T = S.test, pts = 0;
    T.details = T.items.map(function (t, i) {
      var res = t.inputs.map(function (inp, k) { return checkInput(inp, (T.values[i] || [])[k]); });
      var ok = res.every(function (r) { return r.ok; }); if (ok) pts++;
      var f = $('#ti' + i + ' .fb'); f.className = 'fb ' + (ok ? 'good' : 'bad'); f.innerHTML = ok ? '✓ Richtig' : '✗ Nicht richtig. <b>Lösung:</b> ' + t.solution;
      $$('#ti' + i + ' input').forEach(function (e) { e.disabled = true; });
      return { aufgabe: i + 1, skill: t.skill || t.key, richtig: ok };
    });
    T.pts = pts; T.best = Math.max(T.best || 0, pts); save(); mark('test');
    var pct = Math.round(pts / T.items.length * 100);
    fb('#tSum', '<b>' + pts + ' von ' + T.items.length + ' Aufgaben richtig (' + pct + ' %).</b> ' + verdict(pct), pct >= 80 ? 'good' : pct >= 50 ? 'hint' : 'bad');
  }
  function verdict(p) { return p >= 80 ? 'Sehr gut, du beherrschst das Thema.' : p >= 50 ? 'Ein guter Stand. Übe die falschen Aufgabentypen noch einmal.' : 'Arbeite die Erklärung und die Übungen noch einmal durch und nutze die Tipps.'; }

  RENDER.lerncheck = function () {
    var s = $('#sec-lerncheck'); if (s.dataset.r) return; s.dataset.r = 1;
    s.innerHTML = '<h2 id="h-lerncheck">Mein Lerncheck</h2><p>Wie sicher bist du? Sei ehrlich, das hilft dir und deiner Lehrkraft.</p>' +
      MOD.lerncheck.map(function (l, i) { return '<fieldset class="lc"><legend>' + l + '</legend>' + LC_SCALE.map(function (x, k) { return '<label class="chip"><input type="radio" name="lc' + i + '" value="' + k + '"' + (S.lc[i] === k ? ' checked' : '') + '><span>' + x + '</span></label>'; }).join('') + '</fieldset>'; }).join('') +
      '<p class="fb" id="lcFb" role="status"></p>' + pager('lerncheck');
    $$('input', s).forEach(function (r) { r.addEventListener('change', function () { S.lc[+this.name.slice(2)] = +this.value; save(); lcState(); }); });
    lcState();
  };
  function lcState() { var n = MOD.lerncheck.filter(function (l, i) { return S.lc[i] != null; }).length; if (n === MOD.lerncheck.length) { mark('lerncheck'); fb('#lcFb', '✓ Lerncheck ausgefüllt.', 'good'); } else fb('#lcFb', n + ' von ' + MOD.lerncheck.length + ' Aussagen bewertet.', ''); }

  /* Ergebnis und Abgabe */
  function minutes() { return S.startedAt ? Math.max(1, Math.round((Date.now() - S.startedAt) / 60000)) : 0; }
  function payload() {
    var T = S.test || { pts: 0, items: [], details: [] };
    var n = req().filter(function (k) { return S.done[k]; }).length;
    if (!S.abgabeId) { S.abgabeId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2); save(); }
    return {
      schema_version: '2.0', fach: 'Mathematik', jahrgang: String(CFG.jahrgang), modul_id: MOD.id, modul_titel: MOD.title, dateiversion: CFG.version,
      lerncode: S.lerncode, klasse: S.klasse, email: S.email, lernweg: WAYS[S.way],
      bearbeitungsstand: Math.round(n / req().length * 100), pflichtschritte: req().filter(function (k) { return S.done[k]; }),
      diagnose_punkte: S.diagPts || 0, diagnose_max: MOD.diagnose.length,
      uebungen_geloest: S.slots.filter(function (x) { return x.solved; }).length, uebungen_gesamt: S.slots.length,
      uebungen_erster_versuch: S.stats.firstTry, tipps_genutzt: S.stats.hints, loesungswege_genutzt: S.stats.solutions,
      weiterdenken_geloest: !!(S.extra && S.extra.solved),
      test_punkte: T.done ? T.pts : 0, test_max: T.items.length, test_prozent: T.done && T.items.length ? Math.round(T.pts / T.items.length * 100) : 0,
      test_durchlaeufe: T.runs || 0, test_details: T.details || [],
      lerncheck: MOD.lerncheck.map(function (l, i) { return { aussage: l, einschaetzung: S.lc[i] != null ? LC_SCALE[S.lc[i]] : '' }; }),
      bearbeitungszeit_min: minutes(), abgabe_id: S.abgabeId, zeitstempel_client: new Date().toISOString()
    };
  }
  RENDER.ergebnis = function () {
    var s = $('#sec-ergebnis'), p = payload();
    var missing = req().filter(function (k) { return !S.done[k]; }).map(function (k) { return SECTIONS.find(function (x) { return x[0] === k; })[1]; });
    s.innerHTML = '<h2 id="h-ergebnis">Mein Ergebnis</h2>' +
      '<div class="summary"><div><b>Lerncode</b>' + esc(p.lerncode) + ' · ' + esc(p.klasse) + '</div><div><b>Bearbeitet</b>' + p.bearbeitungsstand + ' %</div><div><b>Abschlusstest</b>' + p.test_punkte + ' von ' + p.test_max + ' (' + p.test_prozent + ' %)</div><div><b>Übungen</b>' + p.uebungen_geloest + ' von ' + p.uebungen_gesamt + ' gelöst</div><div><b>Tipps genutzt</b>' + p.tipps_genutzt + '</div><div><b>Zeit</b>ca. ' + p.bearbeitungszeit_min + ' Min.</div></div>' +
      (missing.length ? '<p class="fb hint">Noch offen: ' + missing.join(', ') + '. Du kannst trotzdem senden.</p>' : '<p class="fb good">Alle Pflichtschritte erledigt. Stark!</p>') +
      '<p class="note">' + (S.test && S.test.done ? verdict(p.test_prozent) : 'Bearbeite den Abschlusstest, damit deine Lehrkraft sieht, was du kannst.') + '</p>' +
      '<div class="actions"><button class="btn big" id="sendBtn">Ergebnis an die Lehrkraft senden</button><button class="btn ghost" id="copyBtn">Zusammenfassung kopieren</button><button class="btn ghost" onclick="window.print()">Drucken</button></div>' +
      '<p class="fb" id="sendFb" role="status">' + (S.sent ? '✓ Bereits gesendet. Du kannst nach Änderungen erneut senden.' : '') + '</p>' + pager('ergebnis');
    $('#sendBtn').addEventListener('click', send);
    $('#copyBtn').addEventListener('click', function () {
      var t = 'SOL Mathe ' + CFG.jahrgang + ' · Modul ' + MOD.id + ' ' + MOD.title + '\nLerncode: ' + p.lerncode + ' (' + p.klasse + ')\nBearbeitet: ' + p.bearbeitungsstand + ' %\nTest: ' + p.test_punkte + '/' + p.test_max + '\nÜbungen: ' + p.uebungen_geloest + '/' + p.uebungen_gesamt + '\nTipps: ' + p.tipps_genutzt;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { fb('#sendFb', 'Zusammenfassung kopiert.', 'good'); }, function () { prompt('Zum Kopieren markieren:', t); });
    });
  };
  function isLive() { return /(?:edmundbruns\.com|pages\.dev)$/.test(location.hostname); }
  function send() {
    if (!S.started || !normCode(S.lerncode) || !normKlasse(S.klasse) || !emailOk(S.email)) { go('start'); return fb('#startFb', 'Bitte prüfe Lerncode, Klasse und IServ-Adresse.', 'bad'); }
    var p = payload(), btn = $('#sendBtn');
    if (!isLive() || !CFG.endpoint || CFG.endpoint.indexOf('script.google.com') < 0) { console.log('[SOL8] Vorschau, Payload:', p); return fb('#sendFb', 'Vorschau-Modus: Hier wird nichts gesendet. Auf der veröffentlichten Seite geht dein Ergebnis an deine Lehrkraft.', 'hint'); }
    btn.disabled = true; fb('#sendFb', 'Wird gesendet …', '');
    window.ebSend(CFG.endpoint, p).then(function (r) {
      btn.disabled = false;
      if (r.ok) { S.sent = true; save(); fb('#sendFb', 'Gespeichert ✓ Dein Ergebnis ist bei deiner Lehrkraft angekommen.', 'good'); }
      else fb('#sendFb', 'Nicht gespeichert: ' + esc(r.msg) + ' Dein Stand bleibt auf diesem Gerät. Prüfe deine Angaben und tippe dann noch einmal auf Senden.', 'bad');
    });
  }

  /* ---------- Start ---------- */
  (S.slots || []).forEach(function (sl) { revive(sl.task); });
  if (S.extra) revive(S.extra.task);
  if (S.test && S.test.items) S.test.items.forEach(revive);
  buildShell(); progress();
  var hash = (location.hash || '').slice(1);
  var startSec = SECTIONS.some(function (s) { return s[0] === hash; }) ? hash : (S.started ? S.sec : 'start');
  show(S.started ? startSec : 'start');
  window.SOL8 = { state: function () { return S; }, payload: payload, checkInput: checkInput, gen: gen };
})();
