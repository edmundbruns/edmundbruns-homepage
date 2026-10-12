/* Modul 006 · Sachaufgaben mit Gleichungssystemen (Klasse 9) */
var MODULE = (function () {
  var C1 = '#1e3a8a', CF = '#e8eefc', CA = '#d97706', CH = '#1d4ed8', C2 = '#0f766e';
  function r6(v) { return Math.round(v * 1e6) / 1e6; }
  function fm(v) { return M.fmtNum(r6(v)); }
  function eur(v) { return M.fmtNum(r6(v), 2) + ' €'; }
  /* Summe aus Gliedern [[Koeffizient, Variable], …], Variable '' = Zahl */
  function lin(list) {
    var s = '';
    list.forEach(function (p) {
      var c = r6(p[0]), v = p[1]; if (c === 0) return;
      var a = Math.abs(c), core = (a === 1 && v ? '' : M.fmtNum(a)) + v;
      s += s ? (c < 0 ? ' − ' : ' + ') + core : (c < 0 ? '−' : '') + core;
    });
    return s || '0';
  }
  function eqH(E) { return lin([[E[0], 'x'], [E[1], 'y']]) + ' = ' + fm(E[2]); }
  function eq(E, h) { return { E: E, h: h || eqH(E) }; }
  function sat(E, x, y) { return Math.abs(E[0] * x + E[1] * y - E[2]) < 1e-6; }
  function sysLine(p) { return 'I: &nbsp;' + p[0].h + ' &nbsp; &nbsp; II: &nbsp;' + p[1].h; }
  function sysBig(p) { return '<span class="big-math">I: &nbsp;' + p[0].h + '<br>II: ' + p[1].h + '</span>'; }
  function pairKey(p) { return [p[0].h, p[1].h].sort().join('|'); }

  /* Einsetzungsverfahren: Gleichung Es hat bei Variable v den Koeffizienten 1 */
  function subst(Es, Eo, nS, nO, v) {
    var w = v === 'x' ? 'y' : 'x', iv = v === 'x' ? 0 : 1, iw = 1 - iv;
    var p = Es[iw], e = Es[2], av = Eo[iv], bw = Eo[iw], c = Eo[2];
    var rhs = lin([[e, ''], [-p, w]]);
    var L = [];
    L.push('Löse ' + nS + ' nach ' + v + ' auf: <b>' + v + ' = ' + rhs + '</b>');
    var pre = av === 1 ? '' : av === -1 ? '−' : fm(av) + ' · ';
    var sub = pre + '(' + rhs + ')';
    var line = v === 'x' ? sub + (bw ? (bw < 0 ? ' − ' : ' + ') + lin([[Math.abs(bw), 'y']]) : '') : lin([[bw, 'x']]) + (av < 0 ? ' − ' : ' + ') + (Math.abs(av) === 1 ? '' : fm(Math.abs(av)) + ' · ') + '(' + rhs + ')';
    L.push('Setze in ' + nO + ' ein: ' + line + ' = ' + fm(c));
    var k = r6(bw - av * p), k0 = r6(av * e);
    L.push('Klammer auflösen: ' + lin([[k0, ''], [-av * p, w], [bw, w]]) + ' = ' + fm(c));
    L.push('Zusammenfassen: ' + lin([[k0, ''], [k, w]]) + ' = ' + fm(c));
    var wv = r6((c - k0) / k);
    if (k0) L.push(lin([[k, w]]) + ' = ' + fm(c - k0) + ' &nbsp;<small>| ' + (k0 > 0 ? '− ' + fm(k0) : '+ ' + fm(-k0)) + '</small>');
    if (k !== 1) L.push(w + ' = ' + fm(wv) + ' &nbsp;<small>| : ' + (k < 0 ? '(' + fm(k) + ')' : fm(k)) + '</small>');
    var vv = r6(e - p * wv);
    L.push(w + ' einsetzen: ' + v + ' = ' + (e ? fm(e) + (p ? (p > 0 ? ' − ' : ' + ') + (Math.abs(p) === 1 ? '' : fm(Math.abs(p)) + ' · ') + fm(wv) : '') : fm(-p) + ' · ' + fm(wv)) + ' = <b>' + fm(vv) + '</b>');
    return { lines: L, vals: v === 'x' ? [vv, wv] : [wv, vv] };
  }

  /* Aus Problem P eine Aufgabe machen. P: text, S (Paar), wrong ([[Paar, Grund]]), x, y, lx, ly, ux, uy, vars, steps, answer, textCheck, skill, h1 */
  function task(P, withMC, level) {
    var opts = null, ans = -1, why = [];
    if (withMC) {
      var seen = {}, list = [[P.S, null]]; seen[pairKey(P.S)] = 1;
      P.wrong.forEach(function (w) {
        if (list.length >= 4) return;
        var k = pairKey(w[0]); if (seen[k]) return;
        if (sat(w[0][0].E, P.x, P.y) && sat(w[0][1].E, P.x, P.y)) return;
        seen[k] = 1; list.push(w);
      });
      if (list.length < 4) return null;
      list = M.shuffle(list);
      opts = list.map(function (w) { return sysLine(w[0]); });
      ans = list.findIndex(function (w) { return w[1] === null; });
      why = list.map(function (w) { return w[1]; });
    }
    var inputs = [];
    if (withMC) inputs.push({ kind: 'mc', label: 'a) Welches Gleichungssystem passt zum Text?', options: opts, answer: ans });
    var pf = withMC ? 'b) ' : '';
    inputs.push({ kind: 'num', label: pf + P.lx, answer: P.x, unit: P.ux, tol: P.tol });
    inputs.push({ kind: 'num', label: (withMC ? 'c) ' : '') + P.ly, answer: P.y, unit: P.uy, tol: P.tol });
    var o = withMC ? 1 : 0;
    var q = P.text + '<p>' + P.vars + '</p>' + (withMC ? '<p>a) Welches Gleichungssystem beschreibt die Situation?<br>b) und c) Löse das System und beantworte die Frage.</p>' : '<p>Stelle ein Gleichungssystem auf, löse es und beantworte die Frage.</p>');
    return {
      skill: P.skill, level: level, q: q, inputs: inputs,
      hints: [P.h1, P.h2, P.h3],
      solution: '<p>' + P.vars + '</p>' + sysBig(P.S) + '<p>' + P.steps.join('<br>') + '</p>' + (P.extraSol || '') + '<p><b>Probe am Text:</b> ' + P.probe + '</p><p><b>Antwort:</b> ' + P.answer + '</p>',
      mistakes: function (v) {
        if (withMC && v[0] !== '' && +v[0] !== ans && why[+v[0]]) return 'Teil a): ' + why[+v[0]];
        var a = M.parseNum(v[o]), b = M.parseNum(v[o + 1]);
        if (a === null || b === null) return null;
        var t = P.tol || 1e-9;
        if (Math.abs(a - P.y) <= t && Math.abs(b - P.x) <= t && P.x !== P.y) return 'Die Zahlen stimmen, aber du hast x und y vertauscht. Lies noch einmal, wofür x steht.';
        if (P.mist) { var m = P.mist(a, b); if (m) return m; }
        if (Math.abs(a - P.x) <= t && Math.abs(b - P.y) > t) return 'x stimmt schon. Setze x in eine Gleichung ein und rechne y noch einmal aus.';
        if (Math.abs(b - P.y) <= t && Math.abs(a - P.x) > t) return 'y stimmt schon. Setze y in eine Gleichung ein und rechne x noch einmal aus.';
        return null;
      },
      verify: function () {
        if (!sat(P.S[0].E, P.x, P.y) || !sat(P.S[1].E, P.x, P.y)) return 'Lösung erfüllt das System nicht';
        var det = P.S[0].E[0] * P.S[1].E[1] - P.S[0].E[1] * P.S[1].E[0];
        if (Math.abs(det) < 1e-9) return 'System nicht eindeutig lösbar';
        var xs = (P.S[0].E[2] * P.S[1].E[1] - P.S[0].E[1] * P.S[1].E[2]) / det, ys = (P.S[0].E[0] * P.S[1].E[2] - P.S[0].E[2] * P.S[1].E[0]) / det;
        if (Math.abs(xs - P.x) > 1e-6 || Math.abs(ys - P.y) > 1e-6) return 'Cramer-Kontrolle';
        if (P.x <= 0 || P.y <= 0) return 'nicht positiv';
        var miss = (P.textCheck || []).filter(function (s) { return P.text.indexOf(s) < 0; });
        if (miss.length) return 'Text passt nicht: ' + miss.join(', ');
        if (P.check && P.check() !== true) return 'Sachprüfung';
        if (withMC) { var bad = opts.filter(function (o, i) { return i !== ans; }).length !== 3; if (bad) return 'MC'; }
        return true;
      }
    };
  }

  /* ---------- Probleme ---------- */
  var SHOPS = [
    { ort: 'Im Schulcafé', A: ['Becher Kakao', 'Becher Kakao', 'einen Becher Kakao', 'ein Becher Kakao'], B: ['Muffin', 'Muffins', 'einen Muffin', 'ein Muffin'], ax: [1, 2.5], by: [1.5, 3], st: 0.5 },
    { ort: 'Beim Bäcker', A: ['Brötchen', 'Brötchen', 'ein Brötchen', 'ein Brötchen'], B: ['Croissant', 'Croissants', 'ein Croissant', 'ein Croissant'], ax: [0.4, 0.8], by: [1, 1.8], st: 0.1 },
    { ort: 'Im Schreibwarenladen', A: ['Heft', 'Hefte', 'ein Heft', 'ein Heft'], B: ['Füller', 'Füller', 'einen Füller', 'ein Füller'], ax: [1, 2.5], by: [3, 6], st: 0.5 },
    { ort: 'Am Kiosk im Freibad', A: ['Portion Pommes', 'Portionen Pommes', 'eine Portion Pommes', 'eine Portion Pommes'], B: ['Eis am Stiel', 'Eis am Stiel', 'ein Eis am Stiel', 'ein Eis am Stiel'], ax: [2.5, 4], by: [1, 2], st: 0.5 }];
  function stepVal(r, st) { var n = Math.round((r[1] - r[0]) / st); return r6(r[0] + st * M.rnd(0, n)); }
  function preisP(lvl) {
    var s = M.pick(SHOPS), x, y, a, b, d, tries = 0;
    do {
      x = stepVal(s.ax, s.st); y = stepVal(s.by, s.st);
      a = M.rnd(2, lvl >= 3 ? 5 : 3); b = M.rnd(2, lvl >= 3 ? 5 : 4); d = M.rnd(2, 3); tries++;
    } while ((x === y || b - a * d === 0 || a === b) && tries < 50);
    var c1 = r6(a * x + b * y), e = r6(x + d * y);
    var S = [eq([a, b, c1]), eq([1, d, e])];
    var P = { skill: 'Preise bestimmen', x: x, y: y, ux: '€', uy: '€', tol: 0.005, lx: 'Preis für ' + s.A[2] + ': x =', ly: 'Preis für ' + s.B[2] + ': y =', S: S,
      text: '<p>' + s.ort + ' bezahlt Lina für <b>' + a + ' ' + s.A[1] + '</b> und <b>' + b + ' ' + (b === 1 ? s.B[0] : s.B[1]) + '</b> zusammen <b>' + eur(c1) + '</b>. Ben bezahlt für <b>1 ' + s.A[0] + '</b> und <b>' + d + ' ' + s.B[1] + '</b> genau <b>' + eur(e) + '</b>.</p><p>Was kostet ' + s.A[3] + ', was kostet ' + s.B[3] + '?</p>',
      vars: 'x: Preis für ' + s.A[2] + ' in €, y: Preis für ' + s.B[2] + ' in €',
      textCheck: [eur(c1), eur(e)],
      wrong: [[[eq([b, a, c1]), S[1]], 'In Gleichung I sind die Anzahlen vertauscht. Lina kauft ' + a + ' ' + s.A[1] + ', das ergibt ' + a + 'x.'],
        [[eq([a, b, e]), eq([1, d, c1])], 'Die Beträge passen nicht zu den Einkäufen. ' + eur(c1) + ' gehört zu Linas Einkauf.'],
        [[S[0], eq([d, 1, e])], 'In Gleichung II sind die Anzahlen vertauscht. Ben kauft nur 1 ' + s.A[0] + ', also steht dort x.'],
        [[eq([1, 1, c1]), eq([1, 1, e])], 'Hier fehlen die Anzahlen. Für ' + a + ' Stück zahlt man ' + a + '-mal den Preis x.']],
      h1: 'Übersetze jeden Einkauf in eine Gleichung: Anzahl mal Preis, alles addiert, ergibt den Betrag. Linas Einkauf: ' + a + 'x + ' + b + 'y = ' + fm(c1) + '.',
      h2: 'Bens Einkauf: x + ' + d + 'y = ' + fm(e) + '. Löse diese Gleichung nach x auf: x = ' + fm(e) + ' − ' + d + 'y.',
      h3: 'Setze x = ' + fm(e) + ' − ' + d + 'y in Gleichung I ein: ' + a + ' · (' + fm(e) + ' − ' + d + 'y) + ' + b + 'y = ' + fm(c1) + '. Rechne zuerst y aus.',
      answer: s.A[3].charAt(0).toUpperCase() + s.A[3].slice(1) + ' kostet ' + eur(x) + ', ' + s.B[3] + ' kostet ' + eur(y) + '.',
      check: function () { return Math.abs(a * x + b * y - c1) < 1e-6 && Math.abs(x + d * y - e) < 1e-6 ? true : 'x'; } };
    P.steps = subst(S[1].E, S[0].E, 'II', 'I', 'x').lines;
    P.probe = 'Lina: ' + a + ' · ' + eur(x) + ' + ' + b + ' · ' + eur(y) + ' = ' + eur(c1) + ' ✓. Ben: ' + eur(x) + ' + ' + d + ' · ' + eur(y) + ' = ' + eur(e) + ' ✓.';
    return P;
  }
  var EVENTS = [
    { ort: 'Im Freibad', A: 'Erwachsene', B: 'Kinder', pa: [4, 5, 6], pb: [2, 2.5, 3], day: 'An einem Sonntag' },
    { ort: 'Im Kino', A: 'Erwachsene', B: 'Schülerinnen und Schüler', pa: [10, 11, 12], pb: [7, 7.5, 8], day: 'Bei einer Vorstellung' },
    { ort: 'Beim Schulkonzert', A: 'Sitzplätze', B: 'Stehplätze', pa: [8, 9, 10], pb: [4, 5, 6], day: 'Am Konzertabend' },
    { ort: 'Im Kletterpark', A: 'Erwachsene', B: 'Jugendliche', pa: [22, 24, 25], pb: [15, 16, 18], day: 'An einem Samstag' }];
  function ticketP(lvl) {
    var s = M.pick(EVENTS), a = M.pick(s.pa), b = M.pick(s.pb), x, y;
    do { x = M.rnd(lvl >= 3 ? 25 : 10, lvl >= 3 ? 140 : 60); y = M.rnd(lvl >= 3 ? 25 : 10, lvl >= 3 ? 140 : 60); } while (x === y);
    var n = x + y, P$ = r6(a * x + b * y);
    var S = [eq([1, 1, n]), eq([a, b, P$])];
    var sing = s.A === 'Sitzplätze' ? ['Karte für einen Sitzplatz', 'Karte für einen Stehplatz'] : ['Eintritt für ' + s.A, 'Eintritt für ' + s.B];
    var P = { skill: 'Anzahlen bestimmen (Eintritt)', x: x, y: y, ux: '', uy: '', lx: 'Karten für ' + s.A + ': x =', ly: 'Karten für ' + s.B + ': y =', S: S,
      text: '<p>' + s.ort + ' kostet der ' + (s.A === 'Sitzplätze' ? 'Sitzplatz <b>' + eur(a) + '</b> und der Stehplatz <b>' + eur(b) + '</b>.' : sing[0] + ' <b>' + eur(a) + '</b> und für ' + s.B + ' <b>' + eur(b) + '</b>.') + ' ' + s.day + ' wurden <b>' + n + ' Karten</b> verkauft. Die Einnahmen betrugen <b>' + eur(P$) + '</b>.</p><p>Wie viele Karten für ' + s.A + ' und wie viele für ' + s.B + ' wurden verkauft?</p>',
      vars: 'x: Anzahl der Karten für ' + s.A + ', y: Anzahl der Karten für ' + s.B,
      textCheck: [eur(P$), n + ' Karten'],
      wrong: [[[eq([1, 1, P$]), eq([a, b, n])], 'Die Anzahl der Karten und die Einnahmen sind vertauscht. x + y zählt die Karten, also x + y = ' + n + '.'],
        [[S[0], eq([b, a, P$])], 'Die Preise sind vertauscht. Jede Karte für ' + s.A + ' kostet ' + fm(a) + ' €, das ergibt ' + fm(a) + 'x.'],
        [[eq([1, -1, n]), S[1]], 'Die Gesamtzahl der Karten ist die <b>Summe</b> x + y, nicht die Differenz.'],
        [[S[0], eq([a + b, 0, P$])], 'Die Einnahmen setzen sich aus beiden Kartenarten zusammen: ' + fm(a) + 'x + ' + fm(b) + 'y.']],
      h1: 'Zwei Informationen ergeben zwei Gleichungen: die Anzahl der Karten (x + y = ' + n + ') und die Einnahmen (' + fm(a) + 'x + ' + fm(b) + 'y = ' + fm(P$) + ').',
      h2: 'Löse I nach x auf: x = ' + n + ' − y. Setze das in II ein.',
      h3: fm(a) + ' · (' + n + ' − y) + ' + fm(b) + 'y = ' + fm(P$) + ' ⇒ ' + fm(a * n) + ' − ' + fm(a - b) + 'y = ' + fm(P$) + '. Rechne y aus.',
      answer: 'Es wurden ' + x + ' Karten für ' + s.A + ' und ' + y + ' Karten für ' + s.B + ' verkauft.',
      mist: function (u, v) { if (Math.abs(u + v - n) < 1e-9 && Math.abs(a * u + b * v - P$) > 1e-6) return 'Zusammen sind es ' + n + ' Karten, das passt. Aber die Einnahmen stimmen nicht: Prüfe ' + fm(a) + ' · ' + fm(u) + ' + ' + fm(b) + ' · ' + fm(v) + '.'; return null; },
      check: function () { return x + y === n && Math.abs(a * x + b * y - P$) < 1e-6 ? true : 'x'; } };
    P.steps = subst(S[0].E, S[1].E, 'I', 'II', 'x').lines;
    P.probe = x + ' + ' + y + ' = ' + n + ' Karten ✓. ' + x + ' · ' + eur(a) + ' + ' + y + ' · ' + eur(b) + ' = ' + eur(P$) + ' ✓.';
    return P;
  }
  function rectSketch(top, side) {
    return '<svg class="viz" viewBox="0 0 320 160" role="img" aria-label="Rechteck mit den Seiten x und y" style="max-width:320px"><rect x="70" y="22" width="190" height="100" fill="' + CF + '" stroke="' + C1 + '" stroke-width="2.5"/>' +
      '<text x="165" y="142" font-size="15" font-weight="700" text-anchor="middle" fill="' + CH + '">' + top + '</text><text x="60" y="77" font-size="15" font-weight="700" text-anchor="end" fill="' + CH + '">' + side + '</text>' +
      '<text x="316" y="156" font-size="10" text-anchor="end" fill="#5a5670">Skizze nicht maßstabsgetreu</text></svg>';
  }
  function rechteckP(lvl) {
    var obj = M.pick(['Ein rechteckiges Gemüsebeet', 'Ein rechteckiger Bolzplatz', 'Ein rechteckiger Pausenhof', 'Eine rechteckige Wiese']);
    var y = M.rnd(3, 14), k = lvl >= 3 ? 2 : 1, d = M.rnd(2, 9), x = k * y + d, U = 2 * x + 2 * y;
    var S = [eq([2, 2, U]), eq([1, -k, d])];
    var rel = k === 1 ? 'Die lange Seite ist <b>' + d + ' m länger</b> als die kurze Seite.' : 'Die lange Seite ist <b>' + d + ' m länger als das Doppelte</b> der kurzen Seite.';
    var P = { skill: 'Rechteck: Umfang und Seiten', x: x, y: y, ux: 'm', uy: 'm', lx: 'lange Seite: x =', ly: 'kurze Seite: y =', S: S,
      text: '<p>' + obj + ' hat einen <b>Umfang von ' + U + ' m</b>. ' + rel + '</p><p>Wie lang sind die beiden Seiten?</p>' + rectSketch('x', 'y'),
      vars: 'x: lange Seite in m, y: kurze Seite in m',
      textCheck: [U + ' m', d + ' m'],
      wrong: [[[eq([1, 1, U]), S[1]], 'Der Umfang besteht aus <b>allen vier</b> Seiten: 2x + 2y = ' + U + '.'],
        [[S[0], eq([1, 1, d])], '„' + d + ' m länger“ beschreibt einen Unterschied. Das ist eine Differenz: x − ' + (k === 1 ? '' : k) + 'y = ' + d + '.'],
        [[S[0], eq([1, -d, 0], 'x = ' + d + 'y')], '„' + d + ' m länger“ heißt nicht „' + d + '-mal so lang“. Es wird addiert, nicht multipliziert.'],
        [[eq([2, 2, U]), eq([-k, 1, d])], 'Gleichung II passt nicht. Die <b>lange</b> Seite x ist die längere, also steht x − ' + (k === 1 ? '' : k) + 'y = ' + d + ' oder x = ' + (k === 1 ? '' : k) + 'y + ' + d + '.']],
      h1: 'Umfang eines Rechtecks: 2 · lange Seite + 2 · kurze Seite. Also 2x + 2y = ' + U + '.',
      h2: 'Aus dem zweiten Satz folgt: x = ' + (k === 1 ? '' : k) + 'y + ' + d + '. Setze das in die Umfangsgleichung ein.',
      h3: '2 · (' + (k === 1 ? '' : k) + 'y + ' + d + ') + 2y = ' + U + ' ⇒ ' + (2 * k + 2) + 'y + ' + 2 * d + ' = ' + U + '. Rechne y aus.',
      answer: 'Die lange Seite ist ' + x + ' m lang, die kurze Seite ' + y + ' m.',
      mist: function (u, v) { if (Math.abs(u + v - U) < 1e-9) return 'Achtung: Der Umfang zählt alle vier Seiten. x + y ist nur der halbe Umfang, also ' + U / 2 + ' m.'; return null; },
      check: function () { return 2 * (x + y) === U && x - k * y === d && x > y ? true : 'x'; } };
    P.steps = subst(S[1].E, S[0].E, 'II', 'I', 'x').lines;
    P.probe = 'Umfang: 2 · ' + x + ' m + 2 · ' + y + ' m = ' + U + ' m ✓. ' + (k === 1 ? x + ' m − ' + y + ' m = ' + d + ' m ✓.' : '2 · ' + y + ' m + ' + d + ' m = ' + x + ' m ✓.');
    P.extraSol = rectSketch('x = ' + x + ' m', 'y = ' + y + ' m');
    return P;
  }
  function zahlenP(lvl) {
    var P, S, x, y;
    if (lvl <= 1) {
      do { x = M.rnd(8, 40); y = M.rnd(3, 30); } while (x <= y);
      var s = x + y, d = x - y; S = [eq([1, 1, s]), eq([1, -1, d])];
      P = { text: '<p><b>Zahlenrätsel:</b> Die Summe zweier Zahlen ist <b>' + s + '</b>. Ihre Differenz ist <b>' + d + '</b>. Die erste Zahl ist die größere.</p><p>Wie heißen die beiden Zahlen?</p>', textCheck: ['<b>' + s + '</b>', '<b>' + d + '</b>'],
        wrong: [[[eq([1, -1, s]), eq([1, 1, d])], 'Summe heißt plus, Differenz heißt minus. Hier ist es genau vertauscht.'], [[eq([1, 1, s]), eq([1, 1, d])], 'Die Differenz ist x − y, nicht x + y.'], [[eq([2, 0, s]), eq([1, -1, d])], 'Die Summe zweier Zahlen ist x + y.'], [[eq([1, 1, s]), eq([-1, 1, d])], 'Die erste Zahl ist die größere. Die Differenz ist deshalb x − y.']],
        h1: 'Summe: x + y = ' + s + '. Differenz: x − y = ' + d + '.', h2: 'Löse II nach x auf: x = ' + d + ' + y. Setze in I ein.', h3: '(' + d + ' + y) + y = ' + s + ' ⇒ 2y = ' + (s - d) + '.',
        check: function () { return x + y === s && x - y === d ? true : 'x'; } };
      P.steps = subst(S[1].E, S[0].E, 'II', 'I', 'x').lines;
      P.probe = x + ' + ' + y + ' = ' + s + ' ✓, ' + x + ' − ' + y + ' = ' + d + ' ✓.';
    } else {
      var k = M.rnd(2, 4), dd = M.rnd(2, 12);
      x = M.rnd(3, 15); y = x + dd; var c = k * x + y;
      var w = ['', '', 'Das Doppelte', 'Das Dreifache', 'Das Vierfache'][k];
      S = [eq([k, 1, c]), eq([-1, 1, dd])];
      P = { text: '<p><b>Zahlenrätsel:</b> ' + w + ' der ersten Zahl plus die zweite Zahl ergibt <b>' + c + '</b>. Die zweite Zahl ist um <b>' + dd + ' größer</b> als die erste.</p><p>Wie heißen die beiden Zahlen?</p>', textCheck: ['<b>' + c + '</b>', dd + ' größer'],
        wrong: [[[eq([1, k, c]), S[1]], w + ' der <b>ersten</b> Zahl ist ' + k + 'x, nicht ' + k + 'y.'], [[S[0], eq([1, -1, dd])], 'Die <b>zweite</b> Zahl ist größer. Also y − x = ' + dd + ' oder y = x + ' + dd + '.'], [[eq([k, 1, c]), eq([-dd, 1, 0], 'y = ' + dd + 'x')], '„um ' + dd + ' größer“ heißt plus ' + dd + ', nicht mal ' + dd + '.'], [[eq([1, 1, c]), S[1]], 'Die erste Zahl wird erst mit ' + k + ' multipliziert: ' + k + 'x.']],
        h1: 'Erste Zahl x, zweite Zahl y. ' + w + ' von x ist ' + k + 'x. Gleichung I: ' + k + 'x + y = ' + c + '.', h2: 'Gleichung II: y = x + ' + dd + ', also −x + y = ' + dd + '. Setze y = x + ' + dd + ' in I ein.', h3: k + 'x + (x + ' + dd + ') = ' + c + ' ⇒ ' + (k + 1) + 'x = ' + (c - dd) + '.',
        check: function () { return k * x + y === c && y - x === dd ? true : 'x'; } };
      P.steps = subst(S[1].E, S[0].E, 'II', 'I', 'y').lines;
      P.probe = k + ' · ' + x + ' + ' + y + ' = ' + c + ' ✓, ' + y + ' − ' + x + ' = ' + dd + ' ✓.';
    }
    P.S = S; P.x = x; P.y = y; P.ux = ''; P.uy = ''; P.skill = 'Zahlenrätsel'; P.lx = 'erste Zahl: x ='; P.ly = 'zweite Zahl: y =';
    P.vars = 'x: erste Zahl, y: zweite Zahl'; P.answer = 'Die erste Zahl ist ' + x + ', die zweite Zahl ist ' + y + '.';
    return P;
  }
  function fahrzeugP(lvl) {
    var s = M.pick([
      { ort: 'Auf einem Parkplatz stehen Autos und Motorräder', A: 'Autos', B: 'Motorräder', a: 4, b: 2, was: 'Räder', wo: 'Fahrzeuge' },
      { ort: 'Auf einem Bauernhof leben Hühner und Kaninchen', A: 'Hühner', B: 'Kaninchen', a: 2, b: 4, was: 'Beine', wo: 'Tiere' },
      { ort: 'Im Fahrradverleih stehen Fahrräder und Dreiräder', A: 'Fahrräder', B: 'Dreiräder', a: 2, b: 3, was: 'Räder', wo: 'Fahrzeuge' }]);
    var x, y; do { x = M.rnd(5, lvl >= 3 ? 60 : 30); y = M.rnd(5, lvl >= 3 ? 60 : 30); } while (x === y);
    var n = x + y, r = s.a * x + s.b * y, S = [eq([1, 1, n]), eq([s.a, s.b, r])];
    var P = { skill: 'Anzahlen bestimmen (Räder, Beine)', x: x, y: y, ux: '', uy: '', lx: 'Anzahl ' + s.A + ': x =', ly: 'Anzahl ' + s.B + ': y =', S: S,
      text: '<p>' + s.ort + ', zusammen <b>' + n + ' ' + s.wo + '</b>. Man zählt insgesamt <b>' + r + ' ' + s.was + '</b>.</p><p>Wie viele ' + s.A + ' und wie viele ' + s.B + ' sind es?</p>',
      vars: 'x: Anzahl der ' + s.A + ', y: Anzahl der ' + s.B, textCheck: [n + ' ' + s.wo, r + ' ' + s.was],
      wrong: [[[eq([1, 1, r]), eq([s.a, s.b, n])], 'Die Anzahl der ' + s.wo + ' und die Anzahl der ' + s.was + ' sind vertauscht.'], [[S[0], eq([s.b, s.a, r])], 'Die ' + s.was + ' sind falsch zugeordnet. ' + s.A + ' haben ' + s.a + ' ' + s.was + ', das ergibt ' + s.a + 'x.'], [[eq([1, -1, n]), S[1]], 'Die Gesamtzahl ist die Summe x + y.'], [[S[0], eq([s.a + s.b, 0, r])], 'Die ' + s.was + ' der beiden Arten werden addiert: ' + s.a + 'x + ' + s.b + 'y.']],
      h1: 'Eine Gleichung zählt die ' + s.wo + ': x + y = ' + n + '. Die andere zählt die ' + s.was + ': ' + s.a + 'x + ' + s.b + 'y = ' + r + '.',
      h2: 'Löse I nach x auf: x = ' + n + ' − y. Setze in II ein.', h3: s.a + ' · (' + n + ' − y) + ' + s.b + 'y = ' + r + ' ⇒ ' + lin([[s.a * n, ''], [s.b - s.a, 'y']]) + ' = ' + r + '.',
      answer: 'Es sind ' + x + ' ' + s.A + ' und ' + y + ' ' + s.B + '.',
      check: function () { return x + y === n && s.a * x + s.b * y === r ? true : 'x'; } };
    P.steps = subst(S[0].E, S[1].E, 'I', 'II', 'x').lines;
    P.probe = x + ' + ' + y + ' = ' + n + ' ✓, ' + s.a + ' · ' + x + ' + ' + s.b + ' · ' + y + ' = ' + r + ' ✓.';
    return P;
  }
  function mischP(lvl) {
    var s = M.pick([{ A: 'Cashewkerne', B: 'Erdnüsse', pa: [16, 18, 20], pb: [4, 5, 6], was: 'Nussmischung' }, { A: 'Hochlandkaffee', B: 'Tieflandkaffee', pa: [24, 26, 28], pb: [12, 14, 16], was: 'Kaffeemischung' }, { A: 'Grüntee', B: 'Kräutertee', pa: [30, 32, 36], pb: [10, 12, 15], was: 'Teemischung' }]);
    var pa = M.pick(s.pa), pb = M.pick(s.pb), x, y, m, T, pm, tries = 0;
    do { x = M.rnd(2, 12); y = M.rnd(2, 12); m = x + y; T = pa * x + pb * y; pm = T / m; tries++; } while ((x === y || (lvl >= 3 && Math.abs(pm * 2 - Math.round(pm * 2)) > 1e-9)) && tries < 200);
    if (x === y || (lvl >= 3 && Math.abs(pm * 2 - Math.round(pm * 2)) > 1e-9)) return mischP(lvl);
    var S = [eq([1, 1, m]), eq([pa, pb, T])];
    var info = lvl >= 3 ? 'Die fertige Mischung soll <b>' + eur(pm) + ' pro kg</b> kosten.' : 'Die ganze Mischung soll zusammen <b>' + eur(T) + '</b> kosten.';
    var P = { skill: 'Mischungsaufgabe', x: x, y: y, ux: 'kg', uy: 'kg', lx: s.A + ': x =', ly: s.B + ': y =', S: S,
      text: '<p>Ein Feinkostladen stellt <b>' + m + ' kg ' + s.was + '</b> her. Er mischt ' + s.A + ' für <b>' + eur(pa) + ' pro kg</b> und ' + s.B + ' für <b>' + eur(pb) + ' pro kg</b>. ' + info + '</p><p>Wie viel kg von jeder Sorte werden gemischt?</p>',
      vars: 'x: Menge ' + s.A + ' in kg, y: Menge ' + s.B + ' in kg', textCheck: [m + ' kg', lvl >= 3 ? eur(pm) : eur(T)],
      wrong: [[[S[0], eq([pb, pa, T])], 'Die kg-Preise sind vertauscht. ' + s.A + ' kosten ' + eur(pa) + ' pro kg, das ergibt ' + fm(pa) + 'x.'], [[eq([1, 1, T]), eq([pa, pb, m])], 'Masse und Preis sind vertauscht. x + y zählt die kg, also x + y = ' + m + '.'], lvl >= 3 ? [[S[0], eq([pa, pb, pm])], 'Rechts muss der <b>Gesamtpreis</b> stehen: ' + m + ' kg · ' + eur(pm) + ' = ' + eur(T) + '.'] : [[S[0], eq([pa, -pb, T])], 'Die Preise der beiden Sorten werden addiert, nicht subtrahiert.'], [[eq([1, -1, m]), S[1]], 'Die Mengen der beiden Sorten ergeben zusammen die Mischung: x + y = ' + m + '.']],
      h1: 'Die Mengen ergeben zusammen die Mischung: x + y = ' + m + '. ' + (lvl >= 3 ? 'Der Gesamtpreis ist ' + m + ' · ' + eur(pm) + ' = ' + eur(T) + '.' : 'Die Preise ergeben zusammen ' + eur(T) + '.'),
      h2: 'Gleichung II: ' + fm(pa) + 'x + ' + fm(pb) + 'y = ' + fm(T) + '. Löse I nach x auf: x = ' + m + ' − y.',
      h3: fm(pa) + ' · (' + m + ' − y) + ' + fm(pb) + 'y = ' + fm(T) + ' ⇒ ' + fm(pa * m) + ' − ' + fm(pa - pb) + 'y = ' + fm(T) + '.',
      answer: 'Es werden ' + x + ' kg ' + s.A + ' und ' + y + ' kg ' + s.B + ' gemischt.',
      check: function () { return x + y === m && Math.abs(pa * x + pb * y - pm * m) < 1e-6 ? true : 'x'; } };
    P.steps = (lvl >= 3 ? ['Gesamtpreis der Mischung: ' + m + ' kg · ' + eur(pm) + ' = ' + eur(T) + '.'] : []).concat(subst(S[0].E, S[1].E, 'I', 'II', 'x').lines);
    P.probe = x + ' kg + ' + y + ' kg = ' + m + ' kg ✓. ' + x + ' · ' + eur(pa) + ' + ' + y + ' · ' + eur(pb) + ' = ' + eur(T) + ' ✓' + (lvl >= 3 ? ', das sind ' + eur(T) + ' : ' + m + ' = ' + eur(pm) + ' pro kg.' : '.');
    return P;
  }
  function alterP(lvl) {
    var p = M.pick([['Frau Weber', 'ihr Sohn Ben', 'sie', 'Ben', 'Frau Weber'], ['Herr Yilmaz', 'seine Tochter Elif', 'er', 'Elif', 'Herrn Yilmaz'], ['Tante Jana', 'ihr Neffe Paul', 'sie', 'Paul', 'Tante Jana']]);
    var y, k, m, n, x, t = 0;
    do { y = M.rnd(3, 14); k = M.rnd(3, 6); m = M.rnd(2, 3); n = (k - m) * y / (m - 1); x = k * y; t++; }
    while ((m >= k || n !== Math.round(n) || n < 2 || n > 24 || x - y < 18 || x > 60) && t < 500);
    if (t >= 500) { y = 8; k = 4; m = 2; n = 16; x = 32; }
    var mw = { 2: 'doppelt', 3: 'dreimal' }[m];
    var S = [eq([1, -k, 0], 'x = ' + k + 'y'), eq([1, -m, (m - 1) * n], 'x + ' + n + ' = ' + m + '(y + ' + n + ')')];
    var P = { skill: 'Altersrätsel', x: x, y: y, ux: 'Jahre', uy: 'Jahre', lx: 'Alter von ' + p[4] + ': x =', ly: 'Alter von ' + p[3] + ': y =', S: S,
      text: '<p>' + p[0] + ' ist heute <b>' + k + '-mal so alt</b> wie ' + p[1] + '. In <b>' + n + ' Jahren</b> ist ' + p[2] + ' nur noch <b>' + mw + ' so alt</b> wie ' + p[3] + '.</p><p>Wie alt sind beide heute?</p>',
      vars: 'x: heutiges Alter von ' + p[4] + ' in Jahren, y: heutiges Alter von ' + p[3] + ' in Jahren', textCheck: [k + '-mal', n + ' Jahren'],
      wrong: [[[S[0], eq([1, -m, 0], 'x + ' + n + ' = ' + m + 'y + ' + n)], 'In ' + n + ' Jahren ist auch ' + p[3] + ' ' + n + ' Jahre älter. Deshalb brauchst du eine Klammer: ' + m + '(y + ' + n + ').'],
        [[eq([-k, 1, 0], 'y = ' + k + 'x'), eq([-m, 1, (m - 1) * n], 'y + ' + n + ' = ' + m + '(x + ' + n + ')')], 'Hier sind die Personen vertauscht. ' + p[0] + ' ist älter, also x = ' + k + 'y.'],
        [[eq([1, -1, k], 'x = y + ' + k), S[1]], '„' + k + '-mal so alt“ heißt mal ' + k + ', nicht plus ' + k + '.'],
        [[S[0], eq([1, -m, n * (m + 1)], 'x − ' + n + ' = ' + m + '(y + ' + n + ')')], '„In ' + n + ' Jahren“ heißt: Beide werden ' + n + ' Jahre <b>älter</b>, also + ' + n + ' auf beiden Seiten.']],
      h1: 'Heute: x = ' + k + 'y. In ' + n + ' Jahren sind beide ' + n + ' Jahre älter: x + ' + n + ' und y + ' + n + '.',
      h2: 'Gleichung II: x + ' + n + ' = ' + m + '(y + ' + n + '). Setze x = ' + k + 'y ein.',
      h3: k + 'y + ' + n + ' = ' + m + 'y + ' + m * n + '. Bringe alle y auf eine Seite.',
      answer: p[0] + ' ist heute ' + x + ' Jahre alt, ' + p[3] + ' ist ' + y + ' Jahre alt.',
      check: function () { return x === k * y && x + n === m * (y + n) ? true : 'x'; } };
    P.steps = ['Setze x = ' + k + 'y in II ein: ' + k + 'y + ' + n + ' = ' + m + '(y + ' + n + ')', 'Klammer auflösen: ' + k + 'y + ' + n + ' = ' + m + 'y + ' + m * n, (k - m === 1 ? '' : (k - m)) + 'y + ' + n + ' = ' + m * n + ' &nbsp;<small>| − ' + m + 'y</small>', (k - m === 1 ? '' : (k - m)) + 'y = ' + (m * n - n) + ' &nbsp;<small>| − ' + n + '</small>'].concat(k - m === 1 ? [] : ['y = ' + y + ' &nbsp;<small>| : ' + (k - m) + '</small>']).concat(['x = ' + k + ' · ' + y + ' = <b>' + x + '</b>']);
    P.probe = 'Heute: ' + x + ' = ' + k + ' · ' + y + ' ✓. In ' + n + ' Jahren: ' + (x + n) + ' und ' + (y + n) + ', und ' + (x + n) + ' = ' + m + ' · ' + (y + n) + ' ✓.';
    return P;
  }
  /* Tarife: y = g + p·x */
  var TARIFE = [
    { was: 'Fitnessstudio', ein: 'Besuchen im Monat', xd: 'Besuchen', xv: 'Anzahl der Besuche im Monat', xu: 'Besuche', A: 'Tarif „Flex“', B: 'Tarif „Basic“', gA: 'Monatsbeitrag', per: 'pro Besuch', ps: [[2, 4], [1, 3], [2, 5], [3, 5]], x0: [6, 8, 10, 12, 15], gB: [5, 8, 10, 12] },
    { was: 'Fahrradverleih', ein: 'Stunden Ausleihe', xd: 'Stunden', xv: 'Ausleihdauer in Stunden', xu: 'Stunden', A: 'Anbieter „Rad&Tat“', B: 'Anbieter „CityBike“', gA: 'Grundgebühr', per: 'pro Stunde', ps: [[1, 2.5], [1.5, 3], [2, 4], [1, 3]], x0: [2, 3, 4, 5, 6], gB: [0, 1, 2, 3] },
    { was: 'Carsharing', ein: 'gefahrenen Kilometern', xd: 'Kilometern', xv: 'gefahrene Kilometer', xu: 'km', A: 'Tarif „Plus“', B: 'Tarif „Start“', gA: 'Grundgebühr', per: 'pro km', ps: [[0.2, 0.3], [0.25, 0.4], [0.2, 0.45], [0.3, 0.5]], x0: [40, 50, 60, 80, 100], gB: [0, 2, 5] },
    { was: 'Handyvertrag', ein: 'Gigabyte Datenvolumen', xd: 'GB', xv: 'Datenvolumen in GB', xu: 'GB', A: 'Tarif „Viel“', B: 'Tarif „Wenig“', gA: 'Grundgebühr', per: 'pro GB', ps: [[1, 3], [1.5, 4], [2, 5], [1, 2.5]], x0: [4, 5, 6, 8, 10], gB: [2, 3, 5] }];
  function tarifGraph(gA, pA, gB, pB, x0, y0, lab) {
    var xm = x0 * 2, ym = Math.max(gA + pA * xm, gB + pB * xm), W = 340, H = 230, l = 44, b = 196, w = 270, h = 176;
    var ys = [1, 2, 5, 10, 20, 25, 50, 100].filter(function (s) { return ym / s <= 6; })[0] || 100, yM = Math.ceil(ym / ys) * ys;
    var xs = [1, 2, 5, 10, 20, 25, 50].filter(function (s) { return xm / s <= 6; })[0] || 50;
    function X(v) { return l + v / xm * w; } function Y(v) { return b - v / yM * h; }
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Graphen der beiden Tarife mit Schnittpunkt" style="max-width:380px">';
    for (var t = 0; t <= yM + 1e-9; t += ys) g += '<line x1="' + l + '" y1="' + Y(t) + '" x2="' + (l + w) + '" y2="' + Y(t) + '" stroke="#dde6f7"/><text x="' + (l - 5) + '" y="' + (Y(t) + 4) + '" font-size="10" text-anchor="end">' + M.fmtNum(t) + '</text>';
    for (var u = 0; u <= xm + 1e-9; u += xs) g += '<line x1="' + X(u) + '" y1="' + b + '" x2="' + X(u) + '" y2="' + (b - h) + '" stroke="#dde6f7"/><text x="' + X(u) + '" y="' + (b + 13) + '" font-size="10" text-anchor="middle">' + M.fmtNum(u) + '</text>';
    g += '<line x1="' + l + '" y1="' + b + '" x2="' + (l + w + 6) + '" y2="' + b + '" stroke="#1c1830" stroke-width="1.5"/><line x1="' + l + '" y1="' + b + '" x2="' + l + '" y2="' + (b - h - 8) + '" stroke="#1c1830" stroke-width="1.5"/>';
    g += '<text x="' + (l + w + 4) + '" y="' + (b + 26) + '" font-size="10" text-anchor="end">' + lab + '</text><text x="' + (l - 4) + '" y="' + (b - h - 12) + '" font-size="10">Kosten in €</text>';
    g += '<line x1="' + X(0) + '" y1="' + Y(gA) + '" x2="' + X(xm) + '" y2="' + Y(gA + pA * xm) + '" stroke="' + CH + '" stroke-width="3"/><line x1="' + X(0) + '" y1="' + Y(gB) + '" x2="' + X(xm) + '" y2="' + Y(gB + pB * xm) + '" stroke="' + C2 + '" stroke-width="3"/>';
    g += '<text x="' + (X(xm) - 4) + '" y="' + (Y(gA + pA * xm) + 16) + '" font-size="12" font-weight="700" fill="' + CH + '" text-anchor="end">A</text><text x="' + (X(xm) - 14) + '" y="' + (Y(gB + pB * xm) - 2) + '" font-size="12" font-weight="700" fill="' + C2 + '" text-anchor="end">B</text>';
    g += '<line x1="' + X(x0) + '" y1="' + Y(y0) + '" x2="' + X(x0) + '" y2="' + b + '" stroke="' + CA + '" stroke-dasharray="4 3" stroke-width="1.5"/><circle cx="' + X(x0) + '" cy="' + Y(y0) + '" r="5" fill="' + CA + '" stroke="#fff" stroke-width="1.5"/><text x="' + (X(x0) - 8) + '" y="' + (Y(y0) - 8) + '" font-size="12" font-weight="700" fill="#b45309" text-anchor="end">S(' + M.fmtNum(x0) + ' | ' + M.fmtNum(y0) + ')</text>';
    return g + '</svg>';
  }
  function tarifP(lvl) {
    var s = M.pick(TARIFE), pp = M.pick(s.ps), pA = pp[0], pB = pp[1], x0 = M.pick(s.x0), gB = M.pick(s.gB), gA = r6(gB + (pB - pA) * x0), y0 = r6(gA + pA * x0);
    if (Math.abs(gA * 2 - Math.round(gA * 2)) > 1e-9) return tarifP(lvl);
    function tH(g, p) { return 'y = ' + lin([[g, ''], [p, 'x']]); }
    var S = [eq([-pA, 1, gA], tH(gA, pA)), eq([-pB, 1, gB], tH(gB, pB))];
    var P = { skill: 'Tarifvergleich (Schnittpunkt)', x: x0, y: y0, ux: s.xu, uy: '€', tol: 0.005, lx: 'gleich teuer bei x =', ly: 'Kosten dann: y =', S: S,
      text: '<p>Zwei Angebote für ' + (s.was === 'Fitnessstudio' ? 'ein Fitnessstudio' : s.was === 'Handyvertrag' ? 'einen Handyvertrag' : s.was) + ':</p><ul><li><b>' + s.A + ':</b> ' + eur(gA) + ' ' + s.gA + ' und ' + eur(pA) + ' ' + s.per + '</li><li><b>' + s.B + ':</b> ' + (gB ? eur(gB) + ' ' + s.gA + ' und ' : 'keine Grundgebühr, ') + eur(pB) + ' ' + s.per + '</li></ul><p>Bei wie vielen ' + s.ein + ' kosten beide Angebote gleich viel? Wie hoch sind die Kosten dann?</p>',
      vars: 'x: ' + s.xv + ', y: ' + (s.was === 'Fahrradverleih' || s.was === 'Carsharing' ? 'Kosten für eine Ausleihe in €' : 'Kosten im Monat in €'), textCheck: [eur(gA), eur(pA), eur(pB)],
      wrong: [[[eq([-gA, 1, pA], 'y = ' + lin([[pA, ''], [gA, 'x']])), S[1]], 'Bei Angebot A sind Grundgebühr und Preis ' + s.per + ' vertauscht. Die Grundgebühr zahlt man einmal, der Preis ' + s.per + ' wird mit x multipliziert.'],
        [[eq([-pB, 1, gA], tH(gA, pB)), eq([-pA, 1, gB], tH(gB, pA))], 'Die Preise ' + s.per + ' sind den falschen Angeboten zugeordnet.'],
        [[eq([-(pA + gA), 1, 0], 'y = ' + fm(gA + pA) + 'x'), eq([-(pB + gB), 1, 0], 'y = ' + fm(gB + pB) + 'x')], 'Die Grundgebühr wird nicht mit x multipliziert. Sie kommt nur einmal dazu: y = Grundgebühr + Preis · x.'],
        [[eq([-pA, 1, gB], tH(gB, pA)), eq([-pB, 1, gA], tH(gA, pB))], 'Die Grundgebühren sind vertauscht. ' + s.A + ' hat die Grundgebühr ' + eur(gA) + '.']],
      h1: 'Jedes Angebot ist eine lineare Funktion: y = Grundgebühr + Preis ' + s.per + ' · x. A: y = ' + lin([[gA, ''], [pA, 'x']]) + '.',
      h2: 'Gleich teuer heißt: Die beiden y-Werte sind gleich. Setze gleich: ' + lin([[gA, ''], [pA, 'x']]) + ' = ' + lin([[gB, ''], [pB, 'x']]) + ' (Gleichsetzungsverfahren).',
      h3: 'Bringe die x auf eine Seite: ' + fm(gA - gB) + ' = ' + fm(pB - pA) + 'x. Teile durch ' + fm(pB - pA) + ' und setze x dann in eine Gleichung ein.',
      answer: 'Bei ' + M.fmtNum(x0) + ' ' + s.xd + ' kosten beide Angebote ' + eur(y0) + '. Bei mehr ' + s.xd + ' ist ' + s.A + ' günstiger, bei weniger ' + s.B + '.',
      mist: function (u, v) { if (Math.abs(u - x0) < 0.005 && Math.abs(v - y0) > 0.005) return 'x stimmt. Setze ' + M.fmtNum(x0) + ' in eine der beiden Gleichungen ein, um die Kosten zu berechnen.'; return null; },
      check: function () { return Math.abs(gA + pA * x0 - (gB + pB * x0)) < 1e-6 ? true : 'x'; } };
    var st = ['Gleichsetzen: ' + lin([[gA, ''], [pA, 'x']]) + ' = ' + lin([[gB, ''], [pB, 'x']])];
    st.push(fm(gA) + ' = ' + lin([[gB, ''], [r6(pB - pA), 'x']]) + ' &nbsp;<small>| − ' + lin([[pA, 'x']]) + '</small>');
    if (gB) st.push(fm(gA - gB) + ' = ' + lin([[r6(pB - pA), 'x']]) + ' &nbsp;<small>| − ' + fm(gB) + '</small>');
    st.push('x = ' + M.fmtNum(x0) + ' &nbsp;<small>| : ' + fm(pB - pA) + '</small>');
    st.push('Einsetzen in I: y = ' + fm(gA) + ' + ' + (pA === 1 ? '' : fm(pA) + ' · ') + M.fmtNum(x0) + ' = <b>' + eur(y0) + '</b>');
    P.steps = st;
    P.probe = 'B: ' + (gB ? fm(gB) + ' + ' : '') + (pB === 1 ? '' : fm(pB) + ' · ') + M.fmtNum(x0) + ' = ' + eur(y0) + ' ✓. Beide Angebote kosten gleich viel.';
    P.extraSol = '<p>Grafisch ist die Lösung der <b>Schnittpunkt</b> der beiden Geraden:</p>' + tarifGraph(gA, pA, gB, pB, x0, y0, s.xu);
    return P;
  }
  function prozentP() {
    var t = 0, V, p1, p2, pt, x, y;
    do {
      V = M.pick([6, 8, 10, 12, 15, 20]); p1 = M.pick([0, 10, 20, 30]); p2 = M.pick([60, 70, 80, 100]); pt = M.pick([25, 30, 40, 45, 50, 60]);
      x = V * (p2 - pt) / (p2 - p1); y = V - x; t++;
    } while ((pt <= p1 || pt >= p2 || (p1 === 0 && p2 === 100) || x !== Math.round(x * 2) / 2 || x <= 0 || y <= 0 || x === y) && t < 500);
    var a = p1 / 100, b = p2 / 100, c = r6(pt / 100 * V);
    var nA = p1 === 0 ? 'Mineralwasser (0 % Saft)' : 'eine Schorle mit ' + p1 + ' % Saft', nB = p2 === 100 ? 'reinen Apfelsaft (100 % Saft)' : 'eine Schorle mit ' + p2 + ' % Saft';
    var S = [eq([1, 1, V]), eq([a, b, c])];
    var P = { skill: 'Mischung mit Prozenten', x: x, y: y, ux: 'Liter', uy: 'Liter', tol: 0.005, lx: 'Liter von Sorte A: x =', ly: 'Liter von Sorte B: y =', S: S,
      text: '<p>Für das Schulfest soll die Klasse 9b <b>' + V + ' Liter Apfelschorle</b> mit einem Saftanteil von <b>' + pt + ' %</b> mischen. Vorhanden sind Sorte A: ' + nA + ' und Sorte B: ' + nB + '.</p><p>Wie viele Liter von Sorte A und von Sorte B werden gebraucht?</p>',
      vars: 'x: Liter von Sorte A, y: Liter von Sorte B', textCheck: [V + ' Liter', pt + ' %'],
      wrong: [],
      h1: 'Gleichung I zählt die Liter: x + y = ' + V + '. Gleichung II zählt den <b>reinen Saft</b> in Litern.',
      h2: 'Saft in der fertigen Schorle: ' + pt + ' % von ' + V + ' Litern = ' + fm(c) + ' Liter. ' + (a ? 'Saft aus A: ' + fm(a) + 'x, aus B: ' : 'Sorte A enthält keinen Saft. Saft aus B: ') + lin([[b, 'y']]) + '. Also ' + lin([[a, 'x'], [b, 'y']]) + ' = ' + fm(c) + '.',
      h3: 'Löse I nach x auf: x = ' + V + ' − y und setze in II ein: ' + (a ? fm(a) + ' · (' + V + ' − y) + ' + lin([[b, 'y']]) : lin([[b, 'y']])) + ' = ' + fm(c) + '.',
      answer: 'Man braucht ' + M.fmtNum(x) + ' Liter von Sorte A und ' + M.fmtNum(y) + ' Liter von Sorte B.',
      check: function () { return Math.abs((p1 * x + p2 * y) / V - pt) < 1e-6 ? true : 'x'; } };
    P.steps = ['Saftmenge: ' + pt + ' % von ' + V + ' l = ' + fm(c) + ' l.'].concat(a ? subst(S[0].E, S[1].E, 'I', 'II', 'x').lines : ['Aus II: ' + lin([[b, 'y']]) + ' = ' + fm(c) + ' ⇒ y = ' + fm(y) + ' &nbsp;<small>| : ' + fm(b) + '</small>', 'Aus I: x = ' + V + ' − ' + fm(y) + ' = <b>' + fm(x) + '</b>']);
    P.probe = fm(x) + ' l + ' + fm(y) + ' l = ' + V + ' l ✓. Saft: ' + (a ? fm(a) + ' · ' + fm(x) + ' + ' : '') + fm(b) + ' · ' + fm(y) + ' = ' + fm(c) + ' l, das sind ' + pt + ' % von ' + V + ' l ✓.';
    return P;
  }

  var MAKERS = { preis: preisP, tickets: ticketP, rechteck: rechteckP, zahlen: zahlenP, fahrzeuge: fahrzeugP, mischung: mischP, alter: alterP, tarif: tarifP };
  function make(fn, lvl, mc) { for (var i = 0; i < 30; i++) { var t = task(fn(lvl), mc, lvl); if (t) return t; } throw new Error('keine Aufgabe'); }
  var gen = {
    welches: function (lvl) {
      var keys = lvl <= 1 ? ['preis', 'zahlen', 'tickets', 'fahrzeuge'] : ['preis', 'tickets', 'rechteck', 'fahrzeuge', 'mischung', 'alter', 'tarif'];
      for (var i = 0; i < 30; i++) {
        var P = MAKERS[M.pick(keys)](lvl), t = task(P, true, lvl); if (!t) continue;
        var mc = t.inputs[0];
        return { skill: 'Gleichungssystem zum Text finden', level: 1, q: P.text + '<p>' + P.vars + '</p><p>Welches Gleichungssystem beschreibt die Situation? Du musst es noch nicht lösen.</p>', inputs: [{ kind: 'mc', label: 'Passendes Gleichungssystem', options: mc.options, answer: mc.answer }],
          hints: ['Jeder Satz mit einer Zahlenangabe wird zu einer Gleichung. Suche die zwei Informationen im Text.', P.h1, 'Kontrolle: Die Lösung ist x = ' + fm(P.x) + ' und y = ' + fm(P.y) + '. Setze sie ein. Nur beim richtigen System stimmen beide Gleichungen.'],
          solution: 'Richtig ist ' + sysBig(P.S) + '<p>Kontrolle mit der Lösung x = ' + fm(P.x) + ', y = ' + fm(P.y) + ': ' + P.probe + '</p>',
          mistakes: function (v) { return t.mistakes([v[0], '', '']); },
          verify: t.verify };
      }
      throw new Error('welches');
    },
    preis: function (lvl) { return make(preisP, lvl, lvl <= 2); },
    tickets: function (lvl) { return make(ticketP, lvl, lvl <= 2); },
    rechteck: function (lvl) { return make(rechteckP, lvl, lvl <= 2); },
    zahlen: function (lvl) { return make(zahlenP, lvl, lvl <= 2); },
    fahrzeuge: function (lvl) { return make(fahrzeugP, lvl, lvl <= 2); },
    mischung: function (lvl) { return make(mischP, lvl, lvl <= 2); },
    alter: function (lvl) { return make(alterP, lvl, lvl <= 2); },
    tarif: function (lvl) { return make(tarifP, lvl, lvl <= 2); },
    schorle: function () { var t = task(prozentP(), false, 3); t.level = 3; return t; }
  };

  /* ---------- Entdecken: Probieren und Schnittpunkt ---------- */
  function exploreSvg(x, y) {
    var W = 320, H = 260, l = 34, b = 230, u = 40;
    function X(v) { return l + v * u; } function Y(v) { return b - v * u; }
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Zwei Geraden und der gewählte Punkt" style="max-width:360px">';
    for (var i = 0; i <= 7; i++) g += '<line x1="' + X(i) + '" y1="' + Y(0) + '" x2="' + X(i) + '" y2="' + Y(5.5) + '" stroke="#dde6f7"/><text x="' + X(i) + '" y="' + (b + 14) + '" font-size="10" text-anchor="middle">' + i + '</text>';
    for (var j = 0; j <= 5; j++) g += '<line x1="' + X(0) + '" y1="' + Y(j) + '" x2="' + X(7) + '" y2="' + Y(j) + '" stroke="#dde6f7"/><text x="' + (l - 6) + '" y="' + (Y(j) + 4) + '" font-size="10" text-anchor="end">' + j + '</text>';
    g += '<line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(7.1) + '" y2="' + Y(0) + '" stroke="#1c1830" stroke-width="1.5"/><line x1="' + X(0) + '" y1="' + Y(0) + '" x2="' + X(0) + '" y2="' + Y(5.6) + '" stroke="#1c1830" stroke-width="1.5"/>';
    g += '<text x="' + X(7.1) + '" y="' + (b - 6) + '" font-size="12" font-weight="700" text-anchor="end">x</text><text x="' + (X(0) + 6) + '" y="' + (Y(5.6) + 10) + '" font-size="12" font-weight="700">y</text>';
    /* I: 2x + 3y = 13 -> y = (13 − 2x)/3, II: x + y = 5 */
    g += '<line x1="' + X(0) + '" y1="' + Y(13 / 3) + '" x2="' + X(6.5) + '" y2="' + Y(0) + '" stroke="' + CH + '" stroke-width="3"/><line x1="' + X(0) + '" y1="' + Y(5) + '" x2="' + X(5) + '" y2="' + Y(0) + '" stroke="' + C2 + '" stroke-width="3"/>';
    g += '<text x="' + X(5.6) + '" y="' + (Y(0.6) - 8) + '" font-size="12" font-weight="700" fill="' + CH + '">I</text><text x="' + X(0.25) + '" y="' + (Y(5) + 4) + '" font-size="12" font-weight="700" fill="' + C2 + '">II</text>';
    var on = Math.abs(2 * x + 3 * y - 13) < 1e-9 && Math.abs(x + y - 5) < 1e-9;
    g += '<circle cx="' + X(x) + '" cy="' + Y(y) + '" r="' + (on ? 8 : 6) + '" fill="' + CA + '" stroke="#fff" stroke-width="2"/>';
    return g + '</svg>';
  }

  return {
    id: '006', title: 'Sachaufgaben mit Gleichungssystemen', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Lineare Gleichungssysteme mit dem Einsetzungs- und Gleichsetzungsverfahren lösen',
    lead: 'Zwei Unbekannte, zwei Informationen: Du übersetzt Texte in Gleichungssysteme und findest heraus, was ein Muffin kostet oder wann sich ein Tarif lohnt.',
    einstieg: { html: '<p>Im Schulcafé bezahlt Lina für <b>2 Becher Kakao und 3 Muffins</b> zusammen <b>13 €</b>. Ben kauft <b>1 Becher Kakao und 1 Muffin</b> und bezahlt <b>5 €</b>.</p><p class="note">Was kostet ein Becher Kakao, was kostet ein Muffin? Probiere zuerst ein paar Preise aus.</p><p>Mit einer einzigen Gleichung kommst du hier nicht weiter, denn es gibt zwei Unbekannte. Aber der Text enthält <b>zwei Informationen</b>. Daraus wird ein <b>Gleichungssystem</b>, und das kannst du sicher lösen.</p>' },
    ziele: ['Ich lege fest, wofür die Variablen x und y stehen.', 'Ich übersetze einen Sachtext in zwei Gleichungen.', 'Ich erkenne, welches Gleichungssystem zu einem Text passt.', 'Ich löse das System mit dem Einsetzungs- oder Gleichsetzungsverfahren.', 'Ich mache die Probe am Text und schreibe einen Antwortsatz.'],
    fachwoerter: [['Variable', 'Ein Buchstabe für eine unbekannte Zahl. Vorher festlegen, wofür x und y stehen.'], ['Lineares Gleichungssystem', 'Zwei lineare Gleichungen mit zwei Variablen, die gleichzeitig erfüllt sein sollen.'], ['Einsetzungsverfahren', 'Eine Gleichung nach einer Variablen auflösen und den Term in die andere Gleichung einsetzen.'], ['Gleichsetzungsverfahren', 'Beide Gleichungen nach derselben Variablen auflösen und die Terme gleichsetzen.'], ['Probe am Text', 'Prüfen, ob die Lösung zu allen Angaben im Text passt.']],
    diagnose: [
      { q: 'Löse die Gleichung 3x + 7 = 25.', options: ['x = 6', 'x = 18', 'x = 10,67', 'Weiß ich noch nicht'], answer: 0, why: '3x = 25 − 7 = 18, also x = 6.', review: 'Lineare Gleichungen lösen (Klasse 8)' },
      { q: 'Ein Heft kostet x €. Was kosten 4 Hefte und ein Block für 2 €?', options: ['4x + 2', '4(x + 2)', '6x', 'Weiß ich noch nicht'], answer: 0, why: '4 Hefte kosten 4x €, dazu kommt der Block mit 2 €.', review: 'Terme aus Texten aufstellen' },
      { q: 'Setze y = 2x + 1 in die Gleichung x + y = 10 ein. Welche Gleichung entsteht?', options: ['x + 2x + 1 = 10', 'x + 2x = 10', '2x + 1 = 10', 'Weiß ich noch nicht'], answer: 0, why: 'Statt y schreibst du den ganzen Term 2x + 1.', review: 'Einsetzungsverfahren' },
      { q: 'Ein Rechteck hat die Seiten a und b. Wie berechnet man den Umfang?', options: ['u = 2a + 2b', 'u = a · b', 'u = a + b', 'Weiß ich noch nicht'], answer: 0, why: 'Der Umfang ist die Summe aller vier Seiten: a + b + a + b.', review: 'Umfang von Rechtecken' }],
    erklaerung:
      '<h3>1. Vom Text zum Gleichungssystem</h3><p>Bei Sachaufgaben mit zwei Unbekannten gehst du immer in vier Schritten vor:</p>' +
      '<div class="merk"><b>Merke:</b><br>1. <b>Variablen festlegen:</b> Schreibe auf, wofür x und y stehen (mit Einheit).<br>2. <b>Zwei Gleichungen aufstellen:</b> Jede Information im Text wird eine Gleichung.<br>3. <b>System lösen:</b> mit dem Einsetzungs- oder dem Gleichsetzungsverfahren.<br>4. <b>Probe am Text und Antwortsatz.</b></div>' +
      '<p>Beispiel aus dem Einstieg: x ist der Preis für einen Becher Kakao, y der Preis für einen Muffin (in €).</p><p class="big-math">I: &nbsp;2x + 3y = 13<br>II: x + y = 5</p>' +
      '<p>II nach x auflösen: x = 5 − y. In I einsetzen: 2(5 − y) + 3y = 13 ⇒ 10 + y = 13 ⇒ y = 3. Dann x = 5 − 3 = 2.<br><b>Antwort:</b> Ein Kakao kostet 2 €, ein Muffin 3 €. <b>Probe:</b> 2 · 2 € + 3 · 3 € = 13 € ✓ und 2 € + 3 € = 5 € ✓.</p>' +
      '<h3>2. Typische Übersetzungen</h3><table class="tab"><tr><th>Im Text</th><th>Gleichung</th></tr><tr><td>zusammen 40 Karten</td><td>x + y = 40</td></tr><tr><td>3 Kakao und 2 Muffins kosten 12 €</td><td>3x + 2y = 12</td></tr><tr><td>x ist 4 größer als y</td><td>x = y + 4<br>oder x − y = 4</td></tr><tr><td>x ist dreimal so groß wie y</td><td>x = 3y</td></tr><tr><td>Umfang eines Rechtecks ist 30 m</td><td>2x + 2y = 30</td></tr></table>' +
      '<h3>3. Tarife vergleichen</h3><p>Bei Tarifen hat jedes Angebot die Form <b>y = Grundgebühr + Preis pro Einheit · x</b>. Beide Gleichungen beginnen mit „y =“. Dann ist das <b>Gleichsetzungsverfahren</b> am schnellsten. Die Lösung ist der <b>Schnittpunkt</b> der beiden Geraden: Dort kosten beide Angebote gleich viel.</p>' + tarifGraph(20, 2, 5, 5, 5, 30, 'Besuche') +
      '<p>Hier: A: y = 20 + 2x und B: y = 5 + 5x. Gleichsetzen: 20 + 2x = 5 + 5x ⇒ 15 = 3x ⇒ x = 5, y = 30. Bei 5 Besuchen kosten beide 30 €.</p>' +
      '<p class="note"><b>Achtung:</b> Prüfe, ob die Lösung zur Situation passt. Anzahlen von Personen oder Fahrzeugen müssen natürliche Zahlen sein, Längen und Preise positiv.</p>',
    entdecken: {
      html: '<p><b>Lösen durch Probieren:</b> Lina zahlt für 2 Kakao und 3 Muffins 13 €, Ben für 1 Kakao und 1 Muffin 5 €. Stelle Preise ein. Der orange Punkt zeigt deine Wahl (x | y).</p><div class="ctl"><label>Kakao x = <b id="v_x"></b> € <input type="range" id="r_x" min="0" max="6" step="0.5" value="0.5"></label><label>Muffin y = <b id="v_y"></b> € <input type="range" id="r_y" min="0" max="5" step="0.5" value="0.5"></label></div><div id="e_g"></div><p id="e_txt"></p><p class="note">Auf Gerade I liegen alle Preise, die zu Linas Einkauf passen. Auf Gerade II alle, die zu Bens Einkauf passen. Welcher Punkt passt zu beiden?</p>',
      init: function (root, done) {
        var n = 0, X = root.querySelector('#r_x'), Yr = root.querySelector('#r_y');
        function draw() {
          var x = +X.value, y = +Yr.value, a = 2 * x + 3 * y, b = x + y;
          root.querySelector('#v_x').textContent = M.fmtNum(x, 2); root.querySelector('#v_y').textContent = M.fmtNum(y, 2);
          root.querySelector('#e_g').innerHTML = exploreSvg(x, y);
          var okA = Math.abs(a - 13) < 1e-9, okB = Math.abs(b - 5) < 1e-9;
          root.querySelector('#e_txt').innerHTML = '<span class="big-math">I: &nbsp;2 · ' + M.fmtNum(x) + ' + 3 · ' + M.fmtNum(y) + ' = ' + M.fmtNum(a) + ' ' + (okA ? '✓' : '(soll 13)') + '<br>II: ' + M.fmtNum(x) + ' + ' + M.fmtNum(y) + ' = ' + M.fmtNum(b) + ' ' + (okB ? '✓' : '(soll 5)') + '</span>' + (okA && okB ? '<br><b>Treffer!</b> Der Punkt (2 | 3) liegt auf beiden Geraden. Das ist der Schnittpunkt und die Lösung des Systems.' : '');
        }
        [X, Yr].forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut! Die Lösung des Gleichungssystems ist der Punkt, der auf beiden Geraden liegt: x = 2, y = 3. Probieren klappt hier, aber das Rechnen ist sicherer und schneller.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Eintrittskarten', q: 'Im Freibad kostet der Eintritt für Erwachsene 5 € und für Kinder 3 €. An einem Tag wurden 120 Karten verkauft und 460 € eingenommen. Wie viele Erwachsene und wie viele Kinder waren im Freibad?',
      steps: ['Variablen festlegen: x = Anzahl der Erwachsenen, y = Anzahl der Kinder.', 'Gleichungen aufstellen: I: x + y = 120 (Karten), II: 5x + 3y = 460 (Einnahmen in €).', 'I nach x auflösen: x = 120 − y. In II einsetzen: 5(120 − y) + 3y = 460 ⇒ 600 − 2y = 460 ⇒ −2y = −140 ⇒ y = 70.', 'x = 120 − 70 = 50.', 'Probe: 50 + 70 = 120 ✓ und 5 · 50 € + 3 · 70 € = 250 € + 210 € = 460 € ✓. Antwort: Es waren 50 Erwachsene und 70 Kinder im Freibad.'] },
    tasks: { gen: gen,
      plan: { G: ['welches:1', 'zahlen:1', 'preis:1', 'fahrzeuge:1'], S: ['welches:2', 'preis:2', 'tickets:2', 'rechteck:2', 'tarif:2'], E: ['welches:2', 'tickets:2', 'rechteck:3', 'tarif:2', 'alter:2', 'mischung:3'] },
      extra: 'schorle', test: ['welches:2', 'preis:2', 'tickets:2', 'rechteck:2', 'tarif:2', 'zahlen:2'] },
    lerncheck: ['Ich lege die Variablen fest und übersetze den Text in zwei Gleichungen.', 'Ich erkenne, welches Gleichungssystem zu einem Text passt.', 'Ich löse Gleichungssysteme in Sachaufgaben sicher.', 'Ich mache die Probe am Text und schreibe einen Antwortsatz.']
  };
})();
