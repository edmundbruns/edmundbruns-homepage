/* Modul 006 · Gleichungen mit Klammern lösen */
var MODULE = (function () {
  var T = M.tpretty, poly = M.poly;
  function show(s) { return '<span class="big-math">' + s + '</span>'; }
  function sd(A, B) { return T(poly([[A, 'x'], [B, '']])); }
  function num(n) { return T(String(n)); }
  function brk(k, b) { return (k === 1 ? '' : k === -1 ? '−' : num(k)) + '(x ' + (b < 0 ? '− ' + Math.abs(b) : '+ ' + b) + ')'; }
  function par(n) { return n < 0 ? '(' + num(n) + ')' : String(n); }
  /* Rechenoperation „| − 3x“ bzw. „| + 4“ */
  function opX(c) { return c > 0 ? '| − ' + (c === 1 ? '' : c) + 'x' : '| + ' + (c === -1 ? '' : -c) + 'x'; }
  function opN(c) { return c > 0 ? '| − ' + c : '| + ' + (-c); }
  /* Lösungsweg für A x + B = C x + D (nach dem Ausmultiplizieren), Ergebnis s */
  function solveLines(A, B, C, D) {
    var L = [], a = A - C, r = D - B;
    if (C !== 0) L.push(sd(a, B) + ' = ' + num(D) + ' &nbsp; <small>' + opX(C) + '</small>');
    if (B !== 0) L.push(sd(a, 0) + ' = ' + num(r) + ' &nbsp; <small>' + opN(B) + '</small>');
    if (a !== 1) L.push('x = ' + num(r / a) + ' &nbsp; <small>| : ' + par(a) + '</small>');
    return L;
  }
  function numIn(s) { return { kind: 'num', answer: s, label: 'x =' }; }
  var gen = {
    einfach: function (lvl) {
      var k = M.rnd(2, lvl >= 2 ? 8 : 6), b = M.nz(-6, 8), s = M.rnd(lvl >= 2 ? -5 : 1, 10), c = k * (s + b);
      var lines = [k + 'x ' + (k * b < 0 ? '− ' + Math.abs(k * b) : '+ ' + k * b) + ' = ' + num(c) + ' &nbsp; <small>Klammer auflösen</small>'].concat(solveLines(k, k * b, 0, c));
      return { skill: 'Gleichung mit einer Klammer', level: lvl, q: 'Löse die Gleichung. ' + show(brk(k, b) + ' = ' + num(c)), inputs: [numIn(s)],
        hints: ['Löse zuerst die Klammer auf: ' + k + ' · x und ' + k + ' · ' + par(b) + '.', 'Du erhältst ' + sd(k, k * b) + ' = ' + num(c) + '. Bringe die Zahl ' + num(k * b) + ' auf die rechte Seite.', sd(k, 0) + ' = ' + num(c - k * b) + '. Teile durch ' + k + '. Mache danach die Probe.'],
        solution: lines.join('<br>') + '<br>Probe: ' + brk(k, b).replace('x', par(s)) + ' = ' + k + ' · ' + par(s + b) + ' = ' + num(c) + '. Stimmt.',
        verify: function () { return k * (s + b) === c ? true : 'Probe'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(k * x + b - c) < 1e-9) return 'Du hast nur das x mit ' + k + ' multipliziert. Beim Auflösen der Klammer wird auch die ' + par(b) + ' mit ' + k + ' multipliziert.'; return null; } };
    },
    beide: function (lvl) {
      var k, b, C, s, D;
      do { k = M.rnd(2, 6); b = M.nz(-6, 7); C = M.nz(-3, k + 2); s = M.rnd(-5, 9); D = k * (s + b) - C * s; } while (C === k || D === 0);
      var lines = [sd(k, k * b) + ' = ' + sd(C, D) + ' &nbsp; <small>Klammer auflösen</small>'].concat(solveLines(k, k * b, C, D));
      return { skill: 'x auf beiden Seiten', level: lvl, q: 'Löse die Gleichung. ' + show(brk(k, b) + ' = ' + sd(C, D)), inputs: [numIn(s)],
        hints: ['Löse die Klammer auf: ' + brk(k, b) + ' = ' + sd(k, k * b) + '.', 'Bringe alle x-Glieder auf eine Seite: Rechne auf beiden Seiten ' + opX(C).slice(2) + '. Dann bleibt ' + sd(k - C, k * b) + ' = ' + num(D) + '.', 'Bringe die Zahl auf die andere Seite und teile durch ' + par(k - C) + '. Probe: Setze dein Ergebnis links und rechts ein.'],
        solution: lines.join('<br>') + '<br>Probe: links ' + k + ' · ' + par(s + b) + ' = ' + num(k * (s + b)) + ', rechts ' + (C === 1 ? '' : par(C) + ' · ') + par(s) + (D < 0 ? ' − ' + -D : ' + ' + D) + ' = ' + num(C * s + D) + '. Stimmt.',
        verify: function () { return k * (s + b) === C * s + D ? true : 'Probe'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(k * x + k * b - (-C * x + D)) < 1e-9 && C !== 0) return 'Prüfe, wie du das x-Glied von rechts nach links gebracht hast. Auf <b>beiden</b> Seiten wird dasselbe gerechnet: ' + opX(C) + '.'; if (Math.abs(k * x + b - (C * x + D)) < 1e-9) return 'Beim Auflösen der Klammer muss auch ' + par(b) + ' mit ' + k + ' multipliziert werden.'; return null; } };
    },
    zweikl: function (lvl) {
      var k, b, m, d, s, R, mode = lvl >= 3 ? M.pick(['eq', 'diff']) : 'eq', A, B, C, D;
      for (var t = 0; t < 500; t++) {
        k = M.rnd(2, 7); m = M.rnd(2, 6); b = M.nz(-6, 6); s = M.rnd(-5, 9);
        if (k === m) continue;
        if (mode === 'eq') { var dd = k * (s + b) / m - s; if (dd !== Math.round(dd) || dd === 0 || Math.abs(dd) > 12) continue; d = dd; A = k; B = k * b; C = m; D = m * d; break; }
        d = M.nz(-6, 6); A = k - m; B = k * b - m * d; if (A === 0 || A === 1) continue; C = 0; R = A * s + B; D = R; break;
      }
      var q, lines;
      if (mode === 'eq') {
        q = brk(k, b) + ' = ' + brk(m, d);
        lines = [sd(k, k * b) + ' = ' + sd(m, m * d) + ' &nbsp; <small>Klammern auflösen</small>'].concat(solveLines(k, k * b, m, m * d));
      } else {
        q = brk(k, b) + ' − ' + brk(m, d) + ' = ' + num(R);
        lines = [T(poly([[k, 'x'], [k * b, ''], [-m, 'x'], [-m * d, '']])) + ' = ' + num(R) + ' &nbsp; <small>Klammern auflösen</small>', sd(A, B) + ' = ' + num(R) + ' &nbsp; <small>zusammenfassen</small>'].concat(solveLines(A, B, 0, R).slice(0));
      }
      return { skill: 'Gleichung mit zwei Klammern', level: lvl, q: 'Löse die Gleichung. ' + show(q), inputs: [numIn(s)],
        hints: ['Löse beide Klammern auf.' + (mode === 'diff' ? ' Achtung: Vor der zweiten Klammer steht ein Minus. Es gilt für beide Glieder in der Klammer.' : ''), mode === 'eq' ? 'Du erhältst ' + sd(k, k * b) + ' = ' + sd(m, m * d) + '. Bringe die x-Glieder nach links.' : 'Du erhältst ' + T(poly([[k, 'x'], [k * b, ''], [-m, 'x'], [-m * d, '']])) + ' = ' + num(R) + '. Fasse zusammen: ' + sd(A, B) + ' = ' + num(R) + '.', 'Bringe die Zahlen nach rechts und teile durch die Zahl vor dem x. Kontrolliere mit der Probe.'],
        solution: lines.join('<br>'),
        verify: function () { return mode === 'eq' ? (k * (s + b) === m * (s + d) ? true : 'Probe') : (k * (s + b) - m * (s + d) === R ? true : 'Probe'); },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null || mode !== 'diff') return null; if (Math.abs(k * (x + b) - (m * x - m * d) - R) < 1e-9) return 'Achte auf das Minus vor der zweiten Klammer: −' + brk(m, d) + ' = ' + sd(-m, -m * d) + '. <b>Beide</b> Vorzeichen drehen sich um.'; return null; } };
    },
    minus: function (lvl) {
      var e, b, C, s, D, k = lvl >= 3 ? M.rnd(2, 4) : 1;
      do { e = M.rnd(5, 30); b = M.nz(-6, 6); C = M.nz(-3, 4); s = M.rnd(-4, 9); D = e - k * (s + b) - C * s; } while (C === -k || D === 0);
      var q = num(e) + ' − ' + brk(k, b) + ' = ' + sd(C, D);
      var A = -k, B = e - k * b;
      var lines = [T(poly([[e, ''], [-k, 'x'], [-k * b, '']])) + ' = ' + sd(C, D) + ' &nbsp; <small>Klammer auflösen</small>', sd(A, B) + ' = ' + sd(C, D) + ' &nbsp; <small>zusammenfassen</small>'].concat(solveLines(A, B, C, D));
      return { skill: 'Minus vor der Klammer', level: lvl, q: 'Löse die Gleichung. ' + show(q), inputs: [numIn(s)],
        hints: ['Vor der Klammer steht ein Minus. Beim Auflösen drehen sich <b>alle</b> Vorzeichen in der Klammer um: −' + brk(k, b) + ' = ' + sd(-k, -k * b) + '.', 'Links steht dann ' + T(poly([[e, ''], [-k, 'x'], [-k * b, '']])) + ' = ' + sd(A, B) + '.', 'Löse ' + sd(A, B) + ' = ' + sd(C, D) + ' wie gewohnt. Achte beim Teilen auf das Vorzeichen.'],
        solution: lines.join('<br>') + '<br>Probe: links ' + e + ' − ' + (k === 1 ? '' : k + ' · ') + par(s + b) + ' = ' + num(e - k * (s + b)) + ', rechts ' + (C === 1 ? '' : par(C) + ' · ') + par(s) + (D < 0 ? ' − ' + -D : ' + ' + D) + ' = ' + num(C * s + D) + '. Stimmt.',
        verify: function () { return e - k * (s + b) === C * s + D ? true : 'Probe'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(e - k * x + k * b - (C * x + D)) < 1e-9) return 'Beim Minus vor der Klammer dreht sich auch das Vorzeichen der Zahl ' + par(b) + ' um. Aus −' + brk(k, b) + ' wird ' + sd(-k, -k * b) + '.'; return null; } };
    },
    probe: function () {
      var k = M.rnd(2, 5), b = M.nz(-5, 6), C = M.nz(-2, k - 1), s = M.rnd(-4, 8), D;
      if (C === 0 || C === k) C = 1; D = k * (s + b) - C * s;
      var cand = [s], tries = 0; while (cand.length < 4 && tries < 50) { var c = s + M.nz(-4, 4); if (cand.indexOf(c) < 0) cand.push(c); tries++; }
      var opts = M.shuffle(cand);
      return { skill: 'Probe machen', level: 1, q: 'Welche Zahl ist die Lösung der Gleichung? Mache für jede Zahl die Probe. ' + show(brk(k, b) + ' = ' + sd(C, D)), inputs: [{ kind: 'mc', label: 'x =', options: opts.map(function (o) { return 'x = ' + num(o); }), answer: opts.indexOf(s) }],
        hints: ['Setze jede Zahl für x links und rechts ein. Die Lösung ergibt auf beiden Seiten dasselbe.', 'Beispiel für x = ' + num(opts[0]) + ': links ' + k + ' · ' + par(opts[0] + b) + ' = ' + num(k * (opts[0] + b)) + ', rechts ' + num(C * opts[0] + D) + '.', 'Rechne genauso für die anderen Zahlen.'],
        solution: 'Für x = ' + num(s) + ': links ' + k + ' · ' + par(s + b) + ' = ' + num(k * (s + b)) + ', rechts ' + (C === 1 ? '' : par(C) + ' · ') + par(s) + (D < 0 ? ' − ' + -D : ' + ' + D) + ' = ' + num(C * s + D) + '. Beide Seiten sind gleich.',
        verify: function () { var hits = opts.filter(function (o) { return k * (o + b) === C * o + D; }); return hits.length === 1 && hits[0] === s ? true : 'nicht eindeutig'; } };
    },
    umform: function (lvl) {
      var A, B, C, D;
      do { A = M.rnd(2, 9); B = M.nz(-9, 9); C = M.nz(-5, 8); D = M.nz(-12, 15); } while (A === C || Math.abs(B) === Math.abs(C) || Math.abs(B) === Math.abs(D));
      var which = M.pick(['x', 'n']), line2;
      if (which === 'x') line2 = sd(A - C, B) + ' = ' + num(D); else line2 = sd(A, 0) + ' = ' + sd(C, D - B);
      var right = which === 'x' ? opX(C) : opN(B), opts = M.shuffle([opX(C), opX(-C), opN(B), opN(-B)]);
      return { skill: 'Äquivalenzumformung erkennen', level: lvl, q: 'Welche Umformung führt von der ersten zur zweiten Zeile?<br>' + show(sd(A, B) + ' = ' + sd(C, D)) + '<br>' + show(line2), inputs: [{ kind: 'mc', label: 'Umformung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Vergleiche beide Zeilen. Was ist auf einer Seite verschwunden?', which === 'x' ? 'Rechts ist das x-Glied ' + T(poly([[C, 'x']])) + ' verschwunden.' : 'Links ist die Zahl ' + num(B) + ' verschwunden.', 'Um ' + (which === 'x' ? T(poly([[C, 'x']])) : num(B)) + ' wegzubekommen, rechnest du die Gegenoperation auf <b>beiden</b> Seiten.'],
        solution: 'Richtig ist <b>' + right + '</b>. ' + (which === 'x' ? 'Aus ' + sd(A, B) + ' wird ' + sd(A - C, B) + ' und rechts bleibt ' + num(D) + '.' : 'Links bleibt ' + sd(A, 0) + ', rechts wird ' + num(D) + ' zu ' + num(D - B) + '.') };
    },
    fehler: function () {
      var k, m, b, d, s, R, err, C0, rhs, xs, L1, L2, L3, L4;
      for (var t = 0; t < 400; t++) {
        k = M.rnd(4, 8); m = M.rnd(2, k - 2); b = M.rnd(1, 6); d = M.rnd(1, 6); s = M.rnd(1, 9); err = M.rnd(1, 4);
        R = (k - m) * s + k * b - m * d; C0 = k * b - m * d; if (C0 === 0) continue;
        var a = k - m, cst = C0, rr;
        if (err === 1) cst = k * b + m * d;
        if (err === 2) a = k + m;
        rr = err === 3 ? R + cst : R - cst;
        xs = err === 4 ? rr - a : rr / a;
        if (Math.abs(xs - Math.round(xs)) > 1e-9 || xs === s) continue;
        L1 = k + 'x + ' + k * b + ' − ' + m + 'x ' + (err === 1 ? '+ ' : '− ') + m * d + ' = ' + num(R);
        L2 = sd(a, cst) + ' = ' + num(R);
        L3 = sd(a, 0) + ' = ' + num(rr);
        L4 = 'x = ' + num(xs);
        break;
      }
      var opts = ['Zeile 1', 'Zeile 2', 'Zeile 3', 'Zeile 4'], why = ['In Zeile 1 wurde das Minus vor der zweiten Klammer nicht auf beide Glieder angewendet. Richtig: −' + m + '(x + ' + d + ') = −' + m + 'x − ' + m * d + '.', 'In Zeile 2 wurde falsch zusammengefasst. Richtig: ' + k + 'x − ' + m + 'x = ' + (k - m) + 'x.', 'In Zeile 3 wurde die Zahl mit dem falschen Rechenzeichen auf die andere Seite gebracht. Richtig: ' + opN(cst) + ' auf beiden Seiten.', 'In Zeile 4 wurde ' + a + ' abgezogen statt geteilt. Bei ' + a + 'x heißt die Umformung „: ' + a + '“.'];
      return { skill: 'Fehler in einer Lösung finden', level: 3, q: 'Finde den Fehler in der Rechnung von Ali.<br>' + show(brk(k, b) + ' − ' + brk(m, d) + ' = ' + num(R)) + '<ol class="steps"><li>' + L1 + '</li><li>' + L2 + '</li><li>' + L3 + '</li><li>' + L4 + '</li></ol>Die Probe mit x = ' + num(xs) + ' geht nicht auf. In welcher Zeile steckt der <b>erste</b> Fehler?',
        inputs: [{ kind: 'mc', label: 'Erster Fehler in', options: opts, answer: err - 1 }],
        hints: ['Kontrolliere Zeile für Zeile. Beginne oben.', 'Zeile 1: Löse beide Klammern selbst auf. Was ergibt −' + m + '(x + ' + d + ')?', 'Zeile 2 bis 4: Prüfe, ob richtig zusammengefasst, richtig auf beiden Seiten umgeformt und richtig geteilt wurde.'],
        solution: why[err - 1] + ' Die richtige Lösung ist x = ' + num(s) + '.',
        verify: function () { return k * (s + b) - m * (s + d) === R && xs !== s ? true : 'Fehleraufgabe'; } };
    },
    sonder: function () {
      var kind = M.pick(['eine', 'keine', 'alle']), k = M.rnd(2, 5), b = M.nz(-5, 6), c, C = k, q, why;
      if (kind === 'keine') { c = k * b + M.nz(-6, 6); q = brk(k, b) + ' = ' + sd(k, c); why = 'Klammer auflösen: ' + sd(k, k * b) + ' = ' + sd(k, c) + '. Ziehe ' + k + 'x ab: ' + num(k * b) + ' = ' + num(c) + '. Das ist falsch, egal welche Zahl x ist. Die Gleichung hat <b>keine Lösung</b>.'; }
      else if (kind === 'alle') { c = k * b; q = brk(k, b) + ' = ' + sd(k, c); why = 'Klammer auflösen: ' + sd(k, k * b) + ' = ' + sd(k, c) + '. Beide Seiten sind gleich. Ziehe ' + k + 'x ab: ' + num(c) + ' = ' + num(c) + '. Das stimmt immer. <b>Jede Zahl</b> ist eine Lösung.'; }
      else { C = k + M.pick([-1, 1, 2]); var s = M.rnd(-3, 6); c = k * (s + b) - C * s; q = brk(k, b) + ' = ' + sd(C, c); why = 'Klammer auflösen: ' + sd(k, k * b) + ' = ' + sd(C, c) + '. Die Zahlen vor x sind verschieden. Es gibt <b>genau eine Lösung</b>: x = ' + num(s) + '.'; }
      var opts = ['genau eine Lösung', 'keine Lösung', 'unendlich viele Lösungen (jede Zahl passt)'];
      return { skill: 'Sonderfälle: keine oder unendlich viele Lösungen', level: 3, q: 'Wie viele Lösungen hat die Gleichung? ' + show(q), inputs: [{ kind: 'mc', label: 'Die Gleichung hat …', options: opts, answer: kind === 'eine' ? 0 : kind === 'keine' ? 1 : 2 }],
        hints: ['Löse die Klammer auf und vergleiche die x-Glieder auf beiden Seiten.', 'Sind die Zahlen vor x gleich, verschwindet x beim Umformen ganz.', 'Bleibt eine falsche Aussage wie 6 = 4, gibt es keine Lösung. Bleibt eine wahre Aussage wie 6 = 6, passt jede Zahl.'],
        solution: why,
        verify: function () { var A = k - C, B = c - k * b; var n = A !== 0 ? 0 : (B === 0 ? 2 : 1); return n === (kind === 'eine' ? 0 : kind === 'keine' ? 1 : 2) ? true : 'Sonderfall'; } };
    },
    param: function () {
      var s = M.rnd(1, 6), f = M.rnd(1, 7), c = 2 * (s + f) - 3 * s;
      var m = M.rnd(2, 6), p = M.rnd(1, 5), qq = m * p + M.nz(-4, 4);
      return { skill: 'Gleichungen selbst konstruieren', level: 3, q: 'a) Welche Zahl muss in die Lücke, damit x = ' + s + ' die Lösung ist? ' + show('2(x + □) = ' + sd(3, c)) + '<br>b) Für welche Zahl k hat die Gleichung ' + show('k(x + ' + p + ') = ' + sd(m, qq)) + ' <b>keine</b> Lösung?',
        inputs: [{ kind: 'num', answer: f, label: 'a) □ =' }, { kind: 'num', answer: m, label: 'b) k =' }],
        hints: ['a) Setze x = ' + s + ' ein. Rechts ergibt sich 3 · ' + s + (c < 0 ? ' − ' + -c : ' + ' + c) + ' = ' + (3 * s + c) + '.', 'a) Also muss 2 · (' + s + ' + □) = ' + (3 * s + c) + ' sein. Dann ist ' + s + ' + □ = ' + (3 * s + c) / 2 + '.', 'b) Löse die Klammer auf: kx + ' + p + 'k = ' + sd(m, qq) + '. Keine Lösung gibt es, wenn die x-Glieder auf beiden Seiten gleich sind, die Zahlen aber verschieden.'],
        solution: 'a) 2(' + s + ' + □) = ' + (3 * s + c) + ' ⇒ ' + s + ' + □ = ' + (3 * s + c) / 2 + ' ⇒ □ = ' + f + '. b) Für k = ' + m + ' steht da ' + sd(m, m * p) + ' = ' + sd(m, qq) + '. Ziehe ' + m + 'x ab: ' + m * p + ' = ' + num(qq) + '. Das ist falsch, also gibt es keine Lösung.',
        verify: function () { return 2 * (s + f) === 3 * s + c && m * p !== qq ? true : 'param'; } };
    }
  };

  /* ---------- Entdecken: Äquivalenzumformungen mit Knöpfen ---------- */
  function waage(L, R) {
    return '<svg class="viz" viewBox="0 0 340 150" role="img" aria-label="Waage im Gleichgewicht" style="max-width:420px">' +
      '<polygon points="170,58 152,138 188,138" fill="#efeafb" stroke="#3d2a73" stroke-width="2"/><line x1="40" y1="58" x2="300" y2="58" stroke="#3d2a73" stroke-width="5" stroke-linecap="round"/><circle cx="170" cy="58" r="6" fill="#d97706"/>' +
      '<line x1="60" y1="58" x2="40" y2="92" stroke="#3d2a73"/><line x1="60" y1="58" x2="120" y2="92" stroke="#3d2a73"/><line x1="280" y1="58" x2="220" y2="92" stroke="#3d2a73"/><line x1="280" y1="58" x2="300" y2="92" stroke="#3d2a73"/>' +
      '<rect x="10" y="92" width="140" height="34" rx="8" fill="#cfc2ee" stroke="#3d2a73" stroke-width="2"/><rect x="190" y="92" width="140" height="34" rx="8" fill="#f6d9a8" stroke="#3d2a73" stroke-width="2"/>' +
      '<text x="80" y="115" font-size="16" font-weight="700" text-anchor="middle">' + L + '</text><text x="260" y="115" font-size="16" font-weight="700" text-anchor="middle">' + R + '</text>' +
      '<text x="170" y="24" font-size="12" text-anchor="middle" fill="#5a5670">Die Waage bleibt im Gleichgewicht, wenn du</text><text x="170" y="40" font-size="12" text-anchor="middle" fill="#5a5670">auf beiden Seiten dasselbe tust.</text></svg>';
  }

  return {
    id: '006', title: 'Gleichungen mit Klammern lösen', bereich: 'Terme und Gleichungen', minutes: '45 bis 60',
    vorkenntnisse: 'Klammern auflösen (Modul 003), einfache Gleichungen lösen',
    lead: 'Wie löst man eine Gleichung, in der Klammern und auf beiden Seiten x vorkommen? Du lernst einen sicheren Weg in wenigen Schritten, der immer funktioniert.',
    einstieg: { html: '<p>Emma und Noah haben gleich viel Geld für den Klassenausflug gespart. Emma hat 3 Umschläge mit je x € und legt in jeden noch 4 € dazu. Noah hat x € im Portemonnaie und 32 € auf dem Sparbuch.</p><p class="note">Das ergibt die Gleichung <b>3(x + 4) = x + 32</b>. Wie viel Euro ist x?</p><p>Probieren dauert lange. In diesem Modul lernst du, solche Gleichungen Schritt für Schritt umzuformen, bis x allein dasteht. Am Ende prüfst du mit der Probe, ob dein Ergebnis stimmt.</p>' },
    ziele: ['Ich löse Klammern in Gleichungen richtig auf, auch mit Minus davor.', 'Ich bringe x-Glieder auf eine Seite und Zahlen auf die andere.', 'Ich forme Gleichungen mit Äquivalenzumformungen um.', 'Ich kontrolliere meine Lösung mit der Probe.', 'Ich finde Fehler in Rechnungen und erkenne Sonderfälle.'],
    fachwoerter: [['Gleichung', 'Zwei Terme, die durch ein Gleichheitszeichen verbunden sind, zum Beispiel 3(x + 4) = x + 32.'], ['Äquivalenzumformung', 'Eine Umformung, die auf beiden Seiten gleich ausgeführt wird. Die Lösung bleibt dabei gleich.'], ['Lösung', 'Die Zahl, die man für x einsetzen kann, sodass beide Seiten gleich sind.'], ['Probe', 'Die Lösung in die Ausgangsgleichung einsetzen und prüfen, ob beide Seiten gleich sind.']],
    diagnose: [
      { q: 'Was ergibt 3(x − 2) ohne Klammer?', options: ['3x − 6', '3x − 2', '3x + 6', 'Weiß ich noch nicht'], answer: 0, why: '3 · x = 3x und 3 · (−2) = −6.', review: 'Klammern ausmultiplizieren (Modul 003)' },
      { q: 'Löse: 2x + 5 = 17', options: ['x = 6', 'x = 11', 'x = 8,5', 'Weiß ich noch nicht'], answer: 0, why: '2x = 12, also x = 6.', review: 'Einfache Gleichungen lösen (Klasse 7)' },
      { q: 'Was ergibt −(x − 4)?', options: ['−x + 4', '−x − 4', 'x + 4', 'Weiß ich noch nicht'], answer: 0, why: 'Ein Minus vor der Klammer dreht alle Vorzeichen um.', review: 'Minus vor der Klammer' },
      { q: 'Ist x = 3 eine Lösung von 4x − 2 = 10?', options: ['Ja', 'Nein', 'Das kann man nicht prüfen', 'Weiß ich noch nicht'], answer: 0, why: '4 · 3 − 2 = 10. Beide Seiten sind gleich.', review: 'Probe durch Einsetzen' }],
    erklaerung:
      '<h3>1. Die Waage</h3><p>Eine Gleichung ist wie eine Waage im Gleichgewicht. Du darfst auf beiden Seiten dasselbe addieren, subtrahieren, multiplizieren oder durch dieselbe Zahl (nicht 0) teilen. Dann bleibt sie im Gleichgewicht. Solche Schritte heißen <b>Äquivalenzumformungen</b>.</p>' + waage('3(x + 4)', 'x + 32') +
      '<div class="merk"><b>Merke: So löst du Gleichungen mit Klammern</b><ol><li>Klammern auflösen.</li><li>Jede Seite zusammenfassen.</li><li>x-Glieder auf eine Seite bringen.</li><li>Zahlen auf die andere Seite bringen.</li><li>Durch die Zahl vor x teilen.</li><li>Probe machen.</li></ol></div>' +
      '<h3>2. Das Beispiel vom Anfang</h3><p class="big-math">3(x + 4) = x + 32</p><p>3x + 12 = x + 32 &nbsp; <small>Klammer auflösen</small><br>2x + 12 = 32 &nbsp; <small>| − x</small><br>2x = 20 &nbsp; <small>| − 12</small><br>x = 10 &nbsp; <small>| : 2</small></p><p><b>Probe:</b> links 3 · (10 + 4) = 42, rechts 10 + 32 = 42. Stimmt. Jeder Umschlag enthielt also 10 €.</p>' +
      '<h3>3. Vorsicht bei Minus vor der Klammer</h3><p>Steht ein Minus vor der Klammer, drehen sich <b>alle</b> Vorzeichen in der Klammer um:</p><p class="big-math">20 − 2(x − 3) = 20 − 2x + 6</p><p>Denn (−2) · (−3) = +6.</p>' +
      '<h3>4. Sonderfälle</h3><p>Manchmal verschwindet x ganz. Bleibt eine <b>falsche</b> Aussage wie 8 = 5 übrig, hat die Gleichung <b>keine Lösung</b>. Bleibt eine <b>wahre</b> Aussage wie 8 = 8, ist <b>jede Zahl</b> eine Lösung.</p><p class="note">Schreibe hinter jede Zeile, welche Umformung du machst, zum Beispiel „| − 12“. So findest du Fehler leichter.</p>',
    entdecken: {
      html: '<p>Löse die Gleichung mit den Knöpfen. Jeder Knopf macht eine Umformung auf <b>beiden</b> Seiten. Du entscheidest die Reihenfolge.</p><div id="e_w"></div><ol class="steps" id="e_log"></ol><div class="ctl"><button type="button" class="btn ghost" id="e_b1">Klammer auflösen</button><button type="button" class="btn ghost" id="e_b2">x-Glieder nach links</button><button type="button" class="btn ghost" id="e_b3">Zahl nach rechts</button><button type="button" class="btn ghost" id="e_b4">Durch die Zahl vor x teilen</button><button type="button" class="btn" id="e_b5">Neue Gleichung</button></div><p class="fb" id="e_msg"></p>',
      init: function (root, done) {
        var st, n = 0, finished = false;
        function fresh() {
          var k, b, C, s, D; do { k = M.rnd(2, 4); b = M.rnd(1, 5); C = M.rnd(1, k - 1); s = M.rnd(1, 8); D = k * (s + b) - C * s; } while (D <= 0);
          st = { k: k, b: b, A: k, B: k * b, C: C, D: D, C0: C, D0: D, s: s, open: true, log: [brk(k, b) + ' = ' + sd(C, D)] };
        }
        function L() { return st.open ? brk(st.k, st.b) : sd(st.A, st.B); }
        function R() { return sd(st.C, st.D); }
        function msg(t, kind) { var e = root.querySelector('#e_msg'); e.className = 'fb ' + (kind || ''); e.innerHTML = t; }
        function draw() {
          root.querySelector('#e_w').innerHTML = waage(L(), R());
          root.querySelector('#e_log').innerHTML = st.log.map(function (x) { return '<li>' + x + '</li>'; }).join('');
        }
        function ok(line) { st.log.push(line); draw(); n++; if (n >= 3 && !finished) { finished = true; done('Stark: Mit jeder Umformung auf beiden Seiten bleibt die Waage im Gleichgewicht. Am Ende steht x allein da.'); } }
        root.querySelector('#e_b1').addEventListener('click', function () {
          if (!st.open) return msg('Die Klammer ist schon aufgelöst.', 'hint');
          st.open = false; msg('Klammer aufgelöst: ' + st.k + ' · x und ' + st.k + ' · ' + st.b + '.', 'good'); ok(L() + ' = ' + R() + ' &nbsp; <small>Klammer auflösen</small>');
        });
        root.querySelector('#e_b2').addEventListener('click', function () {
          if (st.open) return msg('Löse zuerst die Klammer auf. Vorher kommst du an das x nicht heran.', 'hint');
          if (st.C === 0) return msg('Rechts steht schon kein x mehr.', 'hint');
          var c = st.C; st.A -= c; st.C = 0; msg('Auf beiden Seiten ' + opX(c).slice(2) + '.', 'good'); ok(L() + ' = ' + R() + ' &nbsp; <small>' + opX(c) + '</small>');
        });
        root.querySelector('#e_b3').addEventListener('click', function () {
          if (st.open) return msg('Löse zuerst die Klammer auf.', 'hint');
          if (st.B === 0) return msg('Links steht schon keine Zahl mehr.', 'hint');
          var c = st.B; st.B = 0; st.D -= c; msg('Auf beiden Seiten ' + opN(c).slice(2) + '.', 'good'); ok(L() + ' = ' + R() + ' &nbsp; <small>' + opN(c) + '</small>');
        });
        root.querySelector('#e_b4').addEventListener('click', function () {
          if (st.open || st.C !== 0 || st.B !== 0) return msg('Teilen lohnt sich erst, wenn links nur noch ein x-Glied und rechts nur noch eine Zahl steht.', 'hint');
          if (st.A === 1) return msg('x steht schon allein. Die Lösung ist x = ' + st.D + '.', 'good');
          var a = st.A; st.A = 1; st.D = st.D / a; ok('x = ' + num(st.D) + ' &nbsp; <small>| : ' + a + '</small>');
          msg('Gelöst: x = ' + st.D + '. Probe: links ' + st.k + ' · (' + st.s + ' + ' + st.b + ') = ' + st.k * (st.s + st.b) + ', rechts ' + (st.C0 === 1 ? '' : st.C0 + ' · ') + st.s + ' + ' + st.D0 + ' = ' + (st.C0 * st.s + st.D0) + '. Stimmt.', 'good');
        });
        root.querySelector('#e_b5').addEventListener('click', function () { fresh(); msg('Neue Gleichung. Viel Erfolg!', ''); draw(); });
        fresh(); draw();
      }
    },
    beispiel: { title: 'Zwei Klammern und Minus', q: 'Löse die Gleichung ' + show('5(x − 2) − 2(x + 1) = x + 4') + '.',
      steps: ['Klammern auflösen. Das Minus vor der zweiten Klammer gilt für beide Glieder: 5x − 10 − 2x − 2 = x + 4.', 'Links zusammenfassen: 3x − 12 = x + 4.', 'x-Glieder nach links: 2x − 12 = 4 &nbsp; <small>| − x</small>', 'Zahl nach rechts und teilen: 2x = 16 &nbsp; <small>| + 12</small>, also x = 8 &nbsp; <small>| : 2</small>.', 'Probe: links 5 · 6 − 2 · 9 = 30 − 18 = 12, rechts 8 + 4 = 12. Stimmt!'] },
    tasks: { gen: gen, plan: { G: ['probe:1', 'einfach:1', 'umform:1', 'beide:2'], S: ['einfach:1', 'umform:2', 'beide:2', 'minus:2', 'zweikl:2'], E: ['beide:2', 'minus:3', 'zweikl:3', 'fehler:3', 'sonder:3', 'einfach:2'] },
      extra: 'param', test: ['einfach:1', 'beide:2', 'minus:2', 'zweikl:2', 'umform:2', 'probe:1'] },
    lerncheck: ['Ich löse Klammern in Gleichungen richtig auf.', 'Ich forme Gleichungen Schritt für Schritt um und schreibe die Umformung dazu.', 'Ich mache immer die Probe.', 'Ich erkenne, wann eine Gleichung keine oder unendlich viele Lösungen hat.']
  };
})();
