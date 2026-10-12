/* Modul 001 (Klasse 9) · Lineare Gleichungssysteme verstehen */
var MODULE = (function () {
  /* ---------- Hilfsfunktionen für Gleichungen ---------- */
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function par(v) { return v < 0 ? '(' + n(v) + ')' : n(v); }
  function coef(a, v, first) { if (a === 0) return ''; var k = Math.abs(a); return (a < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + (k === 1 ? '' : n(k)) + v; }
  function lin(a, b) { var s = coef(a, 'x', true); s += coef(b, 'y', !s); return s || '0'; }
  function eqG(a, b, c) { return lin(a, b) + ' = ' + n(c); }
  function cst(c) { return c === 0 ? '' : c < 0 ? ' − ' + n(-c) : ' + ' + n(c); }
  function eqY(m, t) { return 'y = ' + (m ? coef(m, 'x', true) + cst(t) : n(t)); }
  /* unabhängige Kontrolle: Gleichungstext parsen und (x|y) einsetzen */
  function holds(s, x, y) {
    var p = String(s).replace(/<[^>]+>/g, '').replace(/(\d) (?=\d{3})/g, '$1').split('=');
    if (p.length !== 2) return false;
    try { var L = M.evalTree(M.parseTerm(p[0]), { x: x, y: y }), R = M.evalTree(M.parseTerm(p[1]), { x: x, y: y }); return Math.abs(L - R) < 1e-9; } catch (e) { return false; }
  }
  var LBL = 'display:inline-block;min-width:2.1em;color:#1d4ed8';
  function sys(e1, e2) { return '<div style="display:table;border-left:3px solid #1e3a8a;padding:4px 0 4px 12px;margin:8px 0;font-size:1.25rem;font-weight:700;line-height:1.75"><div><span style="' + LBL + '">I</span>' + e1 + '</div><div><span style="' + LBL + '">II</span>' + e2 + '</div></div>'; }
  function pair(x, y) { return '(' + n(x) + ' | ' + n(y) + ')'; }
  /* a·x + b·y mit eingesetzten Zahlen */
  function subst(a, b, x, y) {
    var s = (a === 1 ? par(x) : a === -1 ? '−' + par(x) : n(a) + ' · ' + par(x));
    var k = Math.abs(b); s += (b < 0 ? ' − ' : ' + ') + (k === 1 ? par(y) : n(k) + ' · ' + par(y));
    return s + ' = ' + n(a * x + b * y);
  }
  function pairIn(x, y, lx, ly, unit) { return [{ kind: 'num', answer: x, label: lx || 'x =', unit: unit }, { kind: 'num', answer: y, label: ly || 'y =', unit: unit }]; }
  function pairMis(x, y, nameX, nameY, extra) {
    return function (v) {
      var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === null || b === null) return null;
      if (extra) { var r = extra(a, b); if (r) return r; }
      if (a === y && b === x && x !== y) return 'Du hast ' + (nameX || 'x') + ' und ' + (nameY || 'y') + ' vertauscht. Mache die Probe in beiden Gleichungen.';
      if (a === x && b !== y) return (nameX || 'x') + ' stimmt schon. Berechne ' + (nameY || 'y') + ' noch einmal sorgfältig, zum Beispiel mit Gleichung I.';
      if (b === y && a !== x) return (nameY || 'y') + ' stimmt schon, ' + (nameX || 'x') + ' aber noch nicht. Setze y in eine Gleichung ein.';
      return null;
    };
  }
  function tab(rows) { return '<div style="overflow-x:auto"><table class="tab">' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i === 0 ? '<th>' + c + '</th>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>'; }
  /* zufälliges System mit eindeutiger ganzzahliger Lösung */
  function randSys(lvl) {
    var C = lvl <= 1 ? [1, 2, 3] : [1, 2, 3, 4, -1, -2, -3];
    for (var t = 0; t < 200; t++) {
      var a1 = M.pick(C), b1 = M.pick(C), a2 = M.pick(C), b2 = M.pick(C);
      if (a1 * b2 - a2 * b1 === 0) continue;
      var x = lvl <= 1 ? M.rnd(1, 7) : M.rnd(-4, 8), y = lvl <= 1 ? M.rnd(1, 7) : M.rnd(-4, 8);
      if (x === y) continue;
      return { a1: a1, b1: b1, c1: a1 * x + b1 * y, a2: a2, b2: b2, c2: a2 * x + b2 * y, x: x, y: y };
    }
    return { a1: 1, b1: 1, c1: 9, a2: 2, b2: -1, c2: 3, x: 4, y: 5 };
  }
  function E1(s) { return eqG(s.a1, s.b1, s.c1); }
  function E2(s) { return eqG(s.a2, s.b2, s.c2); }

  var ANIMALS = [
    { a: 'Hühner', b: 'Kaninchen', p: 2, q: 4, kopf: 'Köpfe', bein: 'Beine', sa: 'Ein Huhn', sb: 'ein Kaninchen', jb: 'Jedes Kaninchen', ort: 'Auf einem Bauernhof leben Hühner und Kaninchen.' },
    { a: 'Hühner', b: 'Schafe', p: 2, q: 4, kopf: 'Köpfe', bein: 'Beine', sa: 'Ein Huhn', sb: 'ein Schaf', jb: 'Jedes Schaf', ort: 'Auf einer Weide stehen Hühner und Schafe.' },
    { a: 'Fahrräder', b: 'Autos', p: 2, q: 4, kopf: 'Fahrzeuge', bein: 'Räder', sa: 'Ein Fahrrad', sb: 'ein Auto', jb: 'Jedes Auto', ort: 'Auf einem Parkplatz stehen Fahrräder und Autos.' },
    { a: 'Fahrräder', b: 'Dreiräder', p: 2, q: 3, kopf: 'Fahrzeuge', bein: 'Räder', sa: 'Ein Fahrrad', sb: 'ein Dreirad', jb: 'Jedes Dreirad', ort: 'Im Hof eines Kindergartens stehen Fahrräder und Dreiräder.' },
    { a: 'Käfer', b: 'Spinnen', p: 6, q: 8, kopf: 'Tiere', bein: 'Beine', sa: 'Ein Käfer', sb: 'eine Spinne', jb: 'Jede Spinne', ort: 'In einem Terrarium leben Käfer und Spinnen.' }];

  var gen = {
    pruefen: function (lvl) {
      var s = randSys(lvl), t = M.rnd(0, 3), k = M.pick([-1, 1]), P;
      if (t === 0) P = [s.x, s.y];
      else if (t === 1) P = [s.x + k * s.b1, s.y - k * s.a1];
      else if (t === 2) P = [s.x + k * s.b2, s.y - k * s.a2];
      else { var d = 0; do { P = [s.x + M.pick([-2, -1, 1, 2]), s.y + M.pick([-2, -1, 1, 2])]; d++; } while ((holds(E1(s), P[0], P[1]) || holds(E2(s), P[0], P[1])) && d < 50); }
      var e1 = E1(s), e2 = E2(s), v1 = s.a1 * P[0] + s.b1 * P[1], v2 = s.a2 * P[0] + s.b2 * P[1];
      var opts = ['Das Paar erfüllt beide Gleichungen. Es ist die Lösung des Systems.', 'Das Paar erfüllt nur Gleichung I. Es ist keine Lösung des Systems.', 'Das Paar erfüllt nur Gleichung II. Es ist keine Lösung des Systems.', 'Das Paar erfüllt keine der beiden Gleichungen.'];
      return { skill: 'Lösung durch Einsetzen prüfen', level: lvl <= 1 ? 1 : 2, q: 'Ist das Zahlenpaar <b>' + pair(P[0], P[1]) + '</b> eine Lösung des Gleichungssystems?<br>' + sys(e1, e2),
        inputs: [{ kind: 'mc', label: 'Was stimmt?', options: opts, answer: t }],
        hints: ['Setze x = ' + n(P[0]) + ' und y = ' + n(P[1]) + ' in <b>beide</b> Gleichungen ein.', 'Gleichung I: ' + subst(s.a1, s.b1, P[0], P[1]) + '. Rechts steht ' + n(s.c1) + '. Stimmt das?', 'Gleichung II: ' + subst(s.a2, s.b2, P[0], P[1]) + '. Rechts steht ' + n(s.c2) + '.'],
        solution: 'I: ' + subst(s.a1, s.b1, P[0], P[1]) + (v1 === s.c1 ? ' ✓' : ' ≠ ' + n(s.c1) + ' ✗') + '<br>II: ' + subst(s.a2, s.b2, P[0], P[1]) + (v2 === s.c2 ? ' ✓' : ' ≠ ' + n(s.c2) + ' ✗') + '<br>' + opts[t],
        mistakes: function (v) { if (v[0] === '0' && t !== 0) return 'Prüfe <b>beide</b> Gleichungen. Eine Lösung muss Gleichung I und Gleichung II gleichzeitig erfüllen.'; if ((v[0] === '1' || v[0] === '2') && t === 0) return 'Setze noch einmal in beide Gleichungen ein. Hier stimmen beide Seiten jeweils überein.'; return null; },
        verify: function () { var h1 = holds(e1, P[0], P[1]), h2 = holds(e2, P[0], P[1]); var c = h1 && h2 ? 0 : h1 ? 1 : h2 ? 2 : 3; return c === t || 'Klasse ' + c + ' statt ' + t; } };
    },
    ergaenzen: function (lvl) {
      var a, b, x1, y1, c, x2, y2, ok = false;
      for (var t = 0; t < 300 && !ok; t++) {
        a = M.pick(lvl <= 1 ? [1, 2, 3] : [2, 3, -2, 4]); b = M.pick(lvl <= 1 ? [1, 1, -1] : [1, -1, 2, -2]);
        x1 = M.rnd(0, 6); y1 = M.rnd(lvl <= 1 ? 0 : -3, 6); c = a * x1 + b * y1; x2 = M.rnd(0, 7);
        if (c <= 0 || x2 === x1 || (c - a * x2) % b !== 0) continue;
        y2 = (c - a * x2) / b; ok = Math.abs(y2) <= 20;
      }
      if (!ok) { a = 2; b = 1; x1 = 3; y1 = 4; c = 10; x2 = 1; y2 = 8; }
      var e = eqG(a, b, c);
      function bTimes(v) { return (b < 0 ? ' − ' : ' + ') + (Math.abs(b) === 1 ? par(v) : Math.abs(b) + ' · ' + par(v)); }
      function aTimes(v) { return a === 1 ? par(v) : a === -1 ? '−' + par(v) : n(a) + ' · ' + par(v); }
      return { skill: 'Lösungspaare einer Gleichung', level: 1, q: 'Die Gleichung <span class="big-math">' + e + '</span> hat viele Lösungspaare. Ergänze die fehlenden Zahlen so, dass beide Paare die Gleichung erfüllen.',
        inputs: [{ kind: 'num', answer: y1, label: '(' + n(x1) + ' | ?)', placeholder: 'y' }, { kind: 'num', answer: x2, label: '(? | ' + n(y2) + ')', placeholder: 'x' }],
        hints: ['Setze die bekannte Zahl in die Gleichung ein und löse nach der fehlenden Variablen auf.', 'Erstes Paar: ' + aTimes(x1) + coef(b, 'y', false) + ' = ' + n(c) + ', also ' + coef(b, 'y', true) + ' = ' + n(c - a * x1) + '.', 'Zweites Paar: ' + coef(a, 'x', true) + bTimes(y2) + ' = ' + n(c) + ', also ' + coef(a, 'x', true) + ' = ' + n(c - b * y2) + '.'],
        solution: 'Erstes Paar: ' + coef(b, 'y', true) + ' = ' + n(c) + ' − ' + par(a * x1) + ' = ' + n(c - a * x1) + ' ⇒ y = ' + n(y1) + '. Paar ' + pair(x1, y1) + '.<br>Zweites Paar: ' + coef(a, 'x', true) + ' = ' + n(c) + ' − ' + par(b * y2) + ' = ' + n(c - b * y2) + ' ⇒ x = ' + n(x2) + '. Paar ' + pair(x2, y2) + '.<br>Probe: ' + subst(a, b, x1, y1) + ' ✓ und ' + subst(a, b, x2, y2) + ' ✓',
        mistakes: function (v) { var p = M.parseNum(v[0]), q = M.parseNum(v[1]); if (p !== null && p === -y1 && y1 !== 0) return 'Beim ersten Paar stimmt das Vorzeichen nicht. Rechne die Probe: Setze deine Zahl ein.'; if (q !== null && q === -x2 && x2 !== 0) return 'Beim zweiten Paar stimmt das Vorzeichen nicht.'; return null; },
        verify: function () { return (holds(e, x1, y1) && holds(e, x2, y2)) || 'Paar falsch'; } };
    },
    welches: function (lvl) {
      var s = randSys(lvl), k = M.pick([-1, 1]), e1 = E1(s), e2 = E2(s);
      var cand = [[s.x, s.y, 0], [s.x + k * s.b1, s.y - k * s.a1, 1], [s.x + k * s.b2, s.y - k * s.a2, 2], [s.y, s.x, 3]];
      if (holds(e1, s.y, s.x) && holds(e2, s.y, s.x)) return gen.welches(lvl);
      var seen = {}, ok = true; cand.forEach(function (c) { var key = c[0] + '|' + c[1]; if (seen[key]) ok = false; seen[key] = 1; });
      if (!ok) return gen.welches(lvl);
      var opts = M.shuffle(cand), ans = opts.findIndex(function (c) { return c[2] === 0; });
      return { skill: 'Lösung auswählen', level: 2, q: 'Welches Zahlenpaar ist die Lösung des Gleichungssystems?<br>' + sys(e1, e2),
        inputs: [{ kind: 'mc', label: 'Lösung (x | y)', options: opts.map(function (c) { return pair(c[0], c[1]); }), answer: ans }],
        hints: ['Setze jedes Paar in Gleichung I ein. Streiche alle Paare, die nicht passen.', 'Prüfe die übrigen Paare auch in Gleichung II.', 'Achte auf die Reihenfolge: Zuerst steht x, dann y.'],
        solution: 'Die Lösung ist <b>' + pair(s.x, s.y) + '</b>.<br>I: ' + subst(s.a1, s.b1, s.x, s.y) + ' ✓<br>II: ' + subst(s.a2, s.b2, s.x, s.y) + ' ✓',
        mistakes: function (v) { var c = opts[+v[0]]; if (!c) return null; if (c[2] === 1) return 'Dieses Paar erfüllt nur Gleichung I. Prüfe auch Gleichung II.'; if (c[2] === 2) return 'Dieses Paar erfüllt nur Gleichung II. Prüfe auch Gleichung I.'; if (c[2] === 3) return 'Achte auf die Reihenfolge im Zahlenpaar: zuerst x, dann y.'; return null; },
        verify: function () { return (holds(e1, s.x, s.y) && holds(e2, s.x, s.y) && !(holds(e1, cand[1][0], cand[1][1]) && holds(e2, cand[1][0], cand[1][1]))) || 'Lösung falsch'; } };
    },
    tabelle: function (lvl) {
      var m1, m2, t1, t2, x0, y0;
      for (var t = 0; t < 200; t++) {
        m1 = M.pick([1, 2, 3, -1, -2]); m2 = M.pick([1, 2, 3, -1, -2, 0]); if (m1 === m2) continue;
        x0 = M.rnd(1, 5); y0 = M.rnd(lvl <= 1 ? 1 : -3, 9); t1 = y0 - m1 * x0; t2 = y0 - m2 * x0;
        if (Math.abs(t1) <= 10 && Math.abs(t2) <= 10 && t1 !== t2) break;
      }
      var xs = [0, 1, 2, 3, 4, 5, 6], e1, e2, shown1, shown2, noTab = lvl >= 3;
      e1 = eqY(m1, t1); e2 = eqY(m2, t2); shown1 = e1; shown2 = e2;
      if (noTab) { shown1 = eqG(-m1, 1, t1); shown2 = eqG(-m2, 1, t2); }
      var T = tab([['x'].concat(xs.map(n)), ['y aus I'].concat(xs.map(function (x) { return n(m1 * x + t1); })), ['y aus II'].concat(xs.map(function (x) { return n(m2 * x + t2); }))]);
      return { skill: 'Lösen mit Wertetabelle', level: lvl, q: (noTab ? 'Löse das Gleichungssystem mit einer Wertetabelle für x = 0 bis 6. Stelle dazu beide Gleichungen zuerst nach y um.' : 'Löse das Gleichungssystem mithilfe der Wertetabelle.') + '<br>' + sys(shown1, shown2) + (noTab ? '' : T),
        inputs: pairIn(x0, y0),
        hints: [noTab ? 'Bringe die x-Glieder auf die rechte Seite: I: ' + e1 + ', II: ' + e2 + '.' : 'Suche in der Tabelle die Spalte, in der beide y-Werte gleich sind.', noTab ? 'Berechne für x = 0, 1, 2, … die y-Werte beider Gleichungen. Wo sind sie gleich?' : 'Vergleiche die Zeilen „y aus I“ und „y aus II“ Spalte für Spalte.', 'Bei x = ' + n(x0) + ' liefern beide Gleichungen y = ' + n(y0) + '.'],
        solution: (noTab ? 'Umgestellt: I: ' + e1 + ', II: ' + e2 + '.' + T : '') + 'Bei x = ' + n(x0) + ' haben beide Gleichungen denselben y-Wert ' + n(y0) + '. Die Lösung ist <b>' + pair(x0, y0) + '</b>. Probe: I: ' + n(y0) + ' = ' + n(m1 * x0 + t1) + ' ✓, II: ' + n(y0) + ' = ' + n(m2 * x0 + t2) + ' ✓',
        mistakes: pairMis(x0, y0),
        verify: function () { return (holds(shown1, x0, y0) && holds(shown2, x0, y0)) || 'Tabelle falsch'; } };
    },
    aufstellen: function () {
      var c = M.rnd(0, 2), right, wrong, txt, X, Y;
      if (c === 0) {
        var A = ANIMALS[0], x = M.rnd(3, 12), y = M.rnd(2, 10), K = x + y, B = 2 * x + 4 * y; X = x; Y = y;
        txt = 'Auf einem Bauernhof leben Hühner und Kaninchen. Zusammen haben sie <b>' + K + ' Köpfe</b> und <b>' + B + ' Beine</b>.<br>x = Anzahl der Hühner, y = Anzahl der Kaninchen.';
        right = ['x + y = ' + K, '2x + 4y = ' + B]; wrong = [['x + y = ' + K, '4x + 2y = ' + B], ['x + y = ' + B, '2x + 4y = ' + K], ['x + y = ' + K, 'x + y = ' + B]];
        if (A && x === y) return gen.aufstellen();
      } else if (c === 1) {
        var p = M.pick([8, 9, 10, 12]), q = M.pick([4, 5, 6]), xe = M.rnd(5, 30), ye = M.rnd(5, 30), N = xe + ye, T = p * xe + q * ye; X = xe; Y = ye;
        if (xe === ye) return gen.aufstellen();
        txt = 'Für ein Schulkonzert wurden <b>' + N + ' Karten</b> verkauft. Eine Karte für Erwachsene kostet ' + p + ' €, eine für Kinder ' + q + ' €. Die Einnahmen betragen <b>' + T + ' €</b>.<br>x = Anzahl der Erwachsenenkarten, y = Anzahl der Kinderkarten.';
        right = ['x + y = ' + N, p + 'x + ' + q + 'y = ' + T]; wrong = [['x + y = ' + N, q + 'x + ' + p + 'y = ' + T], ['x + y = ' + T, p + 'x + ' + q + 'y = ' + N], [p + 'x + ' + q + 'y = ' + N, 'x + y = ' + T]];
      } else {
        var x2 = M.rnd(3, 12), y2 = M.rnd(2, 12) * 2, Nm = x2 + y2, W = 2 * x2 + y2 / 2; X = x2; Y = y2;
        if (W === Nm) return gen.aufstellen();
        txt = 'In einer Spardose liegen nur 2-€-Münzen und 50-Cent-Münzen. Es sind <b>' + Nm + ' Münzen</b> im Wert von <b>' + n(W) + ' €</b>.<br>x = Anzahl der 2-€-Münzen, y = Anzahl der 50-Cent-Münzen.';
        right = ['x + y = ' + Nm, '2x + 0,5y = ' + n(W)]; wrong = [['x + y = ' + Nm, '2x + 50y = ' + n(W)], ['x + y = ' + n(W), '2x + 0,5y = ' + Nm], ['x + y = ' + Nm, '0,5x + 2y = ' + n(W)]];
      }
      for (var w = 0; w < wrong.length; w++) if (holds(wrong[w][0], X, Y) && holds(wrong[w][1], X, Y) || wrong[w].join() === right.join()) return gen.aufstellen();
      var all = M.shuffle([[right, true]].concat(wrong.map(function (w) { return [w, false]; })));
      var fmt = function (e) { return 'I: ' + e[0] + ' &nbsp;und&nbsp; II: ' + e[1]; };
      return { skill: 'Gleichungssystem aufstellen', level: 2, q: txt + '<br><b>Welches Gleichungssystem beschreibt die Situation?</b>',
        inputs: [{ kind: 'mc', label: 'Gleichungssystem', options: all.map(function (o) { return fmt(o[0]); }), answer: all.findIndex(function (o) { return o[1]; }) }],
        hints: ['Eine Gleichung zählt die Anzahl (Köpfe, Karten oder Münzen). Dort steht x + y.', 'Die andere Gleichung zählt Beine, Euro oder den Wert. Jede Variable wird mit ihrem Wert pro Stück multipliziert.', c === 2 ? 'Achte auf die Einheit: 50 Cent sind 0,5 €.' : 'Prüfe, welche Zahl zu x gehört und welche zu y.'],
        solution: 'Richtig ist <b>' + fmt(right) + '</b>. Die Lösung ist übrigens x = ' + n(X) + ' und y = ' + n(Y) + '.',
        verify: function () { if (!(holds(right[0], X, Y) && holds(right[1], X, Y))) return 'richtiges System falsch'; for (var i = 0; i < wrong.length; i++) if (holds(wrong[i][0], X, Y) && holds(wrong[i][1], X, Y)) return 'falsches System passt'; return true; } };
    },
    tiere: function (lvl) {
      var A = lvl >= 3 ? M.pick(ANIMALS.slice(3)) : M.pick(ANIMALS.slice(0, 3)), x = M.rnd(3, 14), y = M.rnd(2, 12);
      if (x === y) return gen.tiere(lvl);
      var K = x + y, B = A.p * x + A.q * y, e1 = 'x + y = ' + K, e2 = A.p + 'x + ' + A.q + 'y = ' + B, rest = B - A.p * K;
      return { skill: 'Sachaufgabe: Tiere und Räder', level: lvl >= 3 ? 3 : 2, q: A.ort + ' Zusammen sind es <b>' + K + ' ' + A.kopf + '</b> mit zusammen <b>' + B + ' ' + A.bein + 'n</b>.<br>Wie viele ' + A.a + ' und wie viele ' + A.b + ' sind es?<br><small>' + A.sa + ' hat ' + A.p + ' ' + A.bein + ', ' + A.sb + ' hat ' + A.q + '.</small>',
        inputs: pairIn(x, y, 'Anzahl ' + A.a, 'Anzahl ' + A.b),
        hints: ['Lege fest: x = Anzahl ' + A.a + ', y = Anzahl ' + A.b + '. Dann gilt I: ' + e1 + ' und II: ' + e2 + '.', 'Stell dir vor, alle ' + K + ' ' + A.kopf + ' gehörten zu ' + A.a + 'n. Dann gäbe es ' + K + ' · ' + A.p + ' = ' + A.p * K + ' ' + A.bein + '. Es fehlen noch ' + B + ' − ' + A.p * K + ' = ' + rest + '.', A.jb + ' bringt ' + (A.q - A.p) + ' ' + (A.q - A.p === 1 ? (A.bein === 'Räder' ? 'Rad' : 'Bein') : A.bein) + ' mehr. Also y = ' + rest + ' : ' + (A.q - A.p) + '.'],
        solution: 'Gleichungssystem: ' + sys(e1, e2) + '<br>Wären es nur ' + A.a + ': ' + A.p * K + ' ' + A.bein + '. Es fehlen ' + rest + ', ' + A.jb.charAt(0).toLowerCase() + A.jb.slice(1) + ' bringt ' + (A.q - A.p) + ' mehr: y = ' + rest + ' : ' + (A.q - A.p) + ' = ' + y + '. Dann x = ' + K + ' − ' + y + ' = ' + x + '.<br><b>' + x + ' ' + A.a + ' und ' + y + ' ' + A.b + '.</b> Probe: ' + x + ' + ' + y + ' = ' + K + ' ✓, ' + A.p + ' · ' + x + ' + ' + A.q + ' · ' + y + ' = ' + B + ' ✓',
        mistakes: pairMis(x, y, 'die Anzahl ' + A.a, 'die Anzahl ' + A.b, function (a, b) { if (a + b === K && A.p * a + A.q * b !== B && !(a === y && b === x)) return 'Die Anzahl der ' + A.kopf + ' stimmt, aber die ' + A.bein + ' noch nicht. Prüfe Gleichung II: ' + A.p + ' · ' + n(a) + ' + ' + A.q + ' · ' + n(b) + ' = ' + n(A.p * a + A.q * b) + '.'; if (A.p * a + A.q * b === B && a + b !== K) return 'Die ' + A.bein + ' stimmen, aber die Anzahl der ' + A.kopf + ' nicht. Beide Gleichungen müssen erfüllt sein.'; return null; }),
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
    },
    karten: function () {
      var ctx = M.pick([['Kino', 'Erwachsene', 'Kinder'], ['Zoo', 'Erwachsene', 'Kinder'], ['Freibad', 'Erwachsene', 'Jugendliche'], ['Theater', 'Erwachsene', 'Schülerinnen und Schüler']]);
      var p = M.pick([7, 8, 9, 10, 12]), q = M.pick([3, 4, 5, 6]); if (q >= p) q = p - 3;
      var x = M.rnd(5, 40), y = M.rnd(5, 40); if (x === y) y++;
      var N = x + y, T = p * x + q * y, e1 = 'x + y = ' + N, e2 = p + 'x + ' + q + 'y = ' + T, rest = T - q * N;
      return { skill: 'Sachaufgabe: Eintrittskarten', level: 2, q: 'Im ' + ctx[0] + ' wurden an einem Tag <b>' + N + ' Karten</b> verkauft. ' + ctx[1] + ' zahlen ' + p + ' €, ' + ctx[2] + ' zahlen ' + q + ' €. Insgesamt wurden <b>' + T + ' €</b> eingenommen.<br>Wie viele Karten für ' + ctx[1] + ' und wie viele für ' + ctx[2] + ' wurden verkauft?',
        inputs: pairIn(x, y, 'Karten ' + ctx[1], 'Karten ' + ctx[2]),
        hints: ['x = Karten für ' + ctx[1] + ', y = Karten für ' + ctx[2] + '. I: ' + e1 + ', II: ' + e2 + '.', 'Wären alle ' + N + ' Karten günstige Karten, kämen nur ' + N + ' · ' + q + ' € = ' + q * N + ' € zusammen. Es fehlen ' + rest + ' €.', 'Jede teure Karte bringt ' + (p - q) + ' € mehr. Also x = ' + rest + ' : ' + (p - q) + '.'],
        solution: 'I: ' + e1 + ', II: ' + e2 + '. Alle günstig: ' + q * N + ' €, es fehlen ' + rest + ' €. Jede teure Karte bringt ' + (p - q) + ' € mehr: x = ' + rest + ' : ' + (p - q) + ' = ' + x + '. y = ' + N + ' − ' + x + ' = ' + y + '.<br><b>' + x + ' Karten für ' + ctx[1] + ', ' + y + ' Karten für ' + ctx[2] + '.</b> Probe: ' + p + ' · ' + x + ' + ' + q + ' · ' + y + ' = ' + (p * x) + ' + ' + (q * y) + ' = ' + T + ' ✓',
        mistakes: pairMis(x, y, 'die Anzahl ' + ctx[1], 'die Anzahl ' + ctx[2], function (a, b) { if (a + b === N && p * a + q * b !== T && !(a === y && b === x)) return 'Die Anzahl der Karten stimmt, aber die Einnahmen nicht: ' + p + ' · ' + n(a) + ' + ' + q + ' · ' + n(b) + ' = ' + n(p * a + q * b) + ' €.'; return null; }),
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
    },
    raetsel: function () {
      var typ = M.rnd(0, 2), x, y, e1, e2, txt;
      if (typ === 0) { y = M.rnd(2, 15); x = y + M.rnd(1, 12); e1 = 'x + y = ' + (x + y); e2 = 'x − y = ' + (x - y); txt = 'Die Summe zweier Zahlen ist ' + (x + y) + '. Ihre Differenz ist ' + (x - y) + '.'; }
      else if (typ === 1) { y = M.rnd(2, 12); var d = M.rnd(1, 9); x = 2 * y + d; e1 = 'x + y = ' + (x + y); e2 = 'x = 2y + ' + d; txt = 'Zwei Zahlen haben zusammen den Wert ' + (x + y) + '. Die erste Zahl ist um ' + d + ' größer als das Doppelte der zweiten Zahl.'; }
      else { y = M.rnd(2, 12); var f = M.pick([3, 4, 5]); x = f * y; e1 = 'x = ' + f + 'y'; e2 = 'x − y = ' + (x - y); txt = 'Die erste Zahl ist ' + ['', '', '', 'dreimal', 'viermal', 'fünfmal'][f] + ' so groß wie die zweite. Der Unterschied der beiden Zahlen beträgt ' + (x - y) + '.'; }
      return { skill: 'Zahlenrätsel', level: 3, q: txt + ' Wie heißen die beiden Zahlen?<br><small>x = erste Zahl, y = zweite Zahl</small>',
        inputs: pairIn(x, y, 'erste Zahl x =', 'zweite Zahl y ='),
        hints: ['Übersetze jeden Satz in eine Gleichung: I: ' + e1 + ', II: ' + e2 + '.', typ === 0 ? 'Probiere: Welche zwei Zahlen ergeben zusammen ' + (x + y) + ' und liegen ' + (x - y) + ' auseinander?' : typ === 1 ? 'Setze für y kleine Zahlen ein und berechne x mit Gleichung II. Passt dann Gleichung I?' : 'Setze für y kleine Zahlen ein und berechne x mit Gleichung I. Passt der Unterschied?', 'Die zweite Zahl ist ' + y + '.'],
        solution: 'I: ' + e1 + ', II: ' + e2 + '. Lösung: <b>x = ' + x + ', y = ' + y + '</b>. Probe: ' + (typ === 0 ? x + ' + ' + y + ' = ' + (x + y) + ' ✓ und ' + x + ' − ' + y + ' = ' + (x - y) + ' ✓' : typ === 1 ? x + ' + ' + y + ' = ' + (x + y) + ' ✓ und 2 · ' + y + ' + ' + (x - 2 * y) + ' = ' + x + ' ✓' : f + ' · ' + y + ' = ' + x + ' ✓ und ' + x + ' − ' + y + ' = ' + (x - y) + ' ✓'),
        mistakes: pairMis(x, y, 'die erste Zahl', 'die zweite Zahl'),
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
    },
    luecke: function () {
      for (var t = 0; t < 200; t++) {
        var x = M.nz(-3, 6), y = M.nz(-3, 6), a1 = M.pick([2, 3, 4, 5]), b1 = M.pick([1, 2, 3, -1, -2]), a2 = M.pick([1, 2, 3, -1]), b2 = M.pick([2, 3, 4, 5]);
        if (Math.abs(x) < 2 || Math.abs(y) < 2 || x === y || a1 * (-b2) - a2 * b1 === 0) continue;
        var c1 = a1 * x + b1 * y, c2 = a2 * x - b2 * y;
        var e1 = '□x' + coef(b1, 'y', false) + ' = ' + n(c1), e2 = coef(a2, 'x', true) + ' − □y = ' + n(c2);
        var E1r = eqG(a1, b1, c1), E2r = eqG(a2, -b2, c2);
        return { skill: 'Fehlende Koeffizienten bestimmen', level: 3, q: 'Das Zahlenpaar <b>' + pair(x, y) + '</b> ist die Lösung dieses Gleichungssystems. Leider fehlen zwei Zahlen. Bestimme sie.<br>' + sys(e1, e2),
          inputs: [{ kind: 'num', answer: a1, label: '□ in Gleichung I' }, { kind: 'num', answer: b2, label: '□ in Gleichung II' }],
          hints: ['Setze x = ' + n(x) + ' und y = ' + n(y) + ' in Gleichung I ein. Dann bleibt eine Gleichung für □.', 'I: □ · ' + par(x) + (b1 < 0 ? ' − ' : ' + ') + (Math.abs(b1) === 1 ? par(y) : Math.abs(b1) + ' · ' + par(y)) + ' = ' + n(c1) + ', also □ · ' + par(x) + ' = ' + n(c1 - b1 * y) + '.', 'II: ' + (a2 === 1 ? par(x) : a2 === -1 ? '−' + par(x) : a2 + ' · ' + par(x)) + ' − □ · ' + par(y) + ' = ' + n(c2) + ', also □ · ' + par(y) + ' = ' + n(a2 * x - c2) + '.'],
          solution: 'I: □ · ' + par(x) + ' = ' + n(c1) + ' − ' + par(b1 * y) + ' = ' + n(c1 - b1 * y) + ' ⇒ □ = ' + n(a1) + '.<br>II: □ · ' + par(y) + ' = ' + par(a2 * x) + ' − ' + par(c2) + ' = ' + n(a2 * x - c2) + ' ⇒ □ = ' + n(b2) + '.<br>Vollständig: ' + sys(E1r, E2r),
          mistakes: function (v) { var p = M.parseNum(v[0]), q = M.parseNum(v[1]); if (p === -a1 || q === -b2) return 'Achte auf die Vorzeichen, besonders beim Minus vor dem □ in Gleichung II und bei negativen Zahlen im Paar.'; return null; },
          verify: function () { return (holds(E1r, x, y) && holds(E2r, x, y)) || 'Probe falsch'; } };
      }
      return gen.luecke();
    }
  };

  /* ---------- Entdecken: Hühner und Kaninchen ---------- */
  var RIDDLES = [[10, 28], [8, 22], [12, 34]];
  function animalsSvg(x, y) {
    var W = 420, cell = 52, per = 8, s = '', i, k = 0;
    function pos(j) { return [10 + (j % per) * cell, 8 + Math.floor(j / per) * 62]; }
    for (i = 0; i < x; i++, k++) { var p = pos(k); s += '<g transform="translate(' + p[0] + ',' + p[1] + ')"><line x1="18" y1="38" x2="16" y2="52" stroke="#d97706" stroke-width="2.5"/><line x1="28" y1="38" x2="30" y2="52" stroke="#d97706" stroke-width="2.5"/><ellipse cx="23" cy="30" rx="14" ry="10" fill="#fde7c2" stroke="#d97706" stroke-width="1.5"/><circle cx="34" cy="17" r="7" fill="#fde7c2" stroke="#d97706" stroke-width="1.5"/><path d="M40 16 l5 2 l-5 2z" fill="#d97706"/><path d="M31 10 q3 -6 6 0" fill="#ef4444"/></g>'; }
    for (i = 0; i < y; i++, k++) { var q = pos(k); s += '<g transform="translate(' + q[0] + ',' + q[1] + ')"><line x1="12" y1="38" x2="11" y2="52" stroke="#1e3a8a" stroke-width="2.5"/><line x1="19" y1="39" x2="19" y2="52" stroke="#1e3a8a" stroke-width="2.5"/><line x1="28" y1="39" x2="28" y2="52" stroke="#1e3a8a" stroke-width="2.5"/><line x1="35" y1="38" x2="36" y2="52" stroke="#1e3a8a" stroke-width="2.5"/><ellipse cx="23" cy="31" rx="16" ry="10" fill="#e8eefc" stroke="#1e3a8a" stroke-width="1.5"/><circle cx="38" cy="20" r="7" fill="#e8eefc" stroke="#1e3a8a" stroke-width="1.5"/><ellipse cx="36" cy="6" rx="2.5" ry="7" fill="#e8eefc" stroke="#1e3a8a" stroke-width="1.5"/><ellipse cx="41" cy="7" rx="2.5" ry="7" fill="#e8eefc" stroke="#1e3a8a" stroke-width="1.5"/></g>'; }
    var rows = Math.max(1, Math.ceil(k / per));
    return '<svg class="viz" viewBox="0 0 ' + W + ' ' + (rows * 62 + 12) + '" role="img" aria-label="' + x + ' Hühner und ' + y + ' Kaninchen" style="max-width:460px">' + s + '</svg>';
  }

  return {
    id: '001', title: 'Lineare Gleichungssysteme verstehen', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Terme mit Variablen, lineare Gleichungen lösen, Punkte im Koordinatensystem',
    lead: 'Zwei Bedingungen, zwei Unbekannte: Du findest heraus, welches Zahlenpaar beide Gleichungen gleichzeitig erfüllt.',
    einstieg: { html: '<p>Lina hilft in den Ferien auf dem Hof ihrer Tante. Dort leben <b>Hühner und Kaninchen</b> in einem großen Gehege. Lina zählt <b>10 Köpfe</b> und <b>28 Beine</b>.</p><p class="note">Wie viele Hühner und wie viele Kaninchen sind im Gehege? Ein Huhn hat 2 Beine, ein Kaninchen hat 4 Beine.</p><p>Es gibt viele Möglichkeiten für 10 Köpfe, zum Beispiel 5 Hühner und 5 Kaninchen. Aber passen dann auch die Beine? In diesem Modul lernst du, solche Rätsel mit <b>zwei Gleichungen</b> zu beschreiben und zu lösen.</p>' },
    ziele: ['Ich weiß, was ein lineares Gleichungssystem mit zwei Variablen ist.', 'Ich prüfe durch Einsetzen, ob ein Zahlenpaar eine Lösung ist.', 'Ich finde Lösungen durch geschicktes Probieren und mit einer Wertetabelle.', 'Ich stelle zu einer Sachsituation ein Gleichungssystem auf.', 'Ich deute die Lösung im Sachzusammenhang und mache die Probe.'],
    fachwoerter: [['Lineare Gleichung mit zwei Variablen', 'Zum Beispiel x + y = 10. Sie hat unendlich viele Lösungspaare, etwa (6 | 4) oder (3 | 7).'], ['Lineares Gleichungssystem (LGS)', 'Zwei lineare Gleichungen mit denselben zwei Variablen, die gleichzeitig gelten sollen. Man nummeriert sie mit I und II.'], ['Lösung eines LGS', 'Ein Zahlenpaar (x | y), das beide Gleichungen erfüllt. Man schreibt L = {(6 | 4)}.'], ['Probe', 'Du setzt das Zahlenpaar in beide Gleichungen ein und prüfst, ob jeweils beide Seiten gleich sind.']],
    diagnose: [
      { q: 'Welchen Wert hat der Term 3x − 2y für x = 4 und y = 1?', options: ['10', '14', '6', 'Weiß ich noch nicht'], answer: 0, why: '3 · 4 − 2 · 1 = 12 − 2 = 10.', review: 'Werte von Termen berechnen' },
      { q: 'Löse die Gleichung 2x + 6 = 20.', options: ['x = 7', 'x = 13', 'x = 3', 'Weiß ich noch nicht'], answer: 0, why: '2x = 14, also x = 7.', review: 'Lineare Gleichungen lösen' },
      { q: 'Tom ist x Jahre alt. Seine Schwester ist 3 Jahre älter. Welcher Term beschreibt ihr Alter?', options: ['x + 3', '3x', 'x − 3', 'Weiß ich noch nicht'], answer: 0, why: '3 Jahre älter heißt: 3 dazu, also x + 3.', review: 'Terme zu Sachsituationen aufstellen' },
      { q: 'Liegt der Punkt (2 | 5) auf der Geraden y = 2x + 1?', options: ['Ja, denn 2 · 2 + 1 = 5.', 'Nein, denn 2 · 5 + 1 = 11.', 'Nein, weil 2 nicht gleich 5 ist.', 'Weiß ich noch nicht'], answer: 0, why: 'Setze x = 2 ein: y = 2 · 2 + 1 = 5. Das passt zur y-Koordinate.', review: 'Punktprobe bei linearen Funktionen' }],
    erklaerung:
      '<h3>1. Eine Gleichung, viele Lösungen</h3><p>Für die 10 Köpfe gilt: <b>x + y = 10</b> (x = Anzahl der Hühner, y = Anzahl der Kaninchen). Diese Gleichung hat viele Lösungspaare:</p>' +
      tab([['x (Hühner)', '3', '4', '5', '6', '7', '8'], ['y (Kaninchen)', '7', '6', '5', '4', '3', '2']]) +
      '<p>Eine lineare Gleichung mit zwei Variablen hat also <b>unendlich viele</b> Lösungen. Im Koordinatensystem liegen sie alle auf einer Geraden.</p>' +
      '<h3>2. Zwei Gleichungen gleichzeitig</h3><p>Für die 28 Beine gilt außerdem: <b>2x + 4y = 28</b>. Beide Bedingungen sollen <b>gleichzeitig</b> gelten. Zusammen bilden sie ein lineares Gleichungssystem:</p>' + sys('x + y = 10', '2x + 4y = 28') +
      '<div class="merk"><b>Merke:</b> Ein <b>lineares Gleichungssystem</b> besteht aus zwei linearen Gleichungen mit zwei Variablen. Eine <b>Lösung</b> ist ein Zahlenpaar (x | y), das <b>beide</b> Gleichungen erfüllt. Man schreibt die Lösungsmenge so: L = {(6 | 4)}.</div>' +
      '<h3>3. Lösung prüfen durch Einsetzen</h3><p>Ist (6 | 4) die Lösung? Setze x = 6 und y = 4 in beide Gleichungen ein:</p><p>I: 6 + 4 = 10 ✓ &nbsp; II: 2 · 6 + 4 · 4 = 12 + 16 = 28 ✓ &nbsp; <b>Ja!</b></p><p>Und (7 | 3)? I: 7 + 3 = 10 ✓, aber II: 2 · 7 + 4 · 3 = 14 + 12 = 26 ≠ 28 ✗. <b>Keine Lösung</b>, denn Gleichung II ist nicht erfüllt.</p>' +
      '<h3>4. Lösen mit einer Tabelle</h3><p>Nimm die Paare, die Gleichung I erfüllen, und berechne jeweils die Beine:</p>' +
      tab([['x (Hühner)', '3', '4', '5', '6', '7'], ['y = 10 − x', '7', '6', '5', '<b>4</b>', '3'], ['Beine 2x + 4y', '34', '32', '30', '<b>28</b> ✓', '26']]) +
      '<p>Bei 6 Hühnern und 4 Kaninchen passen beide Bedingungen. Die Lösung ist <b>L = {(6 | 4)}</b>.</p>' +
      '<p class="note"><b>Tipp zum Probieren:</b> Sind es zu viele Beine, nimm mehr Hühner und weniger Kaninchen. Jedes Kaninchen, das du gegen ein Huhn tauschst, hat 2 Beine weniger.</p>',
    entdecken: {
      html: '<p>Wähle ein Rätsel und stelle mit den Reglern die Anzahl der Hühner (x) und Kaninchen (y) ein. Beide Gleichungen werden sofort geprüft.</p><div class="ctl"><label>Rätsel <select id="e_r">' + RIDDLES.map(function (r, i) { return '<option value="' + i + '">' + r[0] + ' Köpfe, ' + r[1] + ' Beine</option>'; }).join('') + '</select></label></div><div class="ctl"><label>Hühner x = <b id="v_x"></b> <input type="range" id="r_x" min="0" max="12" step="1" value="1"></label><label>Kaninchen y = <b id="v_y"></b> <input type="range" id="r_y" min="0" max="12" step="1" value="1"></label></div><div id="e_g"></div><div id="e_txt"></div><p class="note">Finde mehrere Paare, die nur Gleichung I erfüllen. Wie viele Paare erfüllen beide?</p>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var R = RIDDLES[+root.querySelector('#e_r').value], x = +root.querySelector('#r_x').value, y = +root.querySelector('#r_y').value;
          root.querySelector('#v_x').textContent = x; root.querySelector('#v_y').textContent = y;
          root.querySelector('#e_g').innerHTML = x + y ? animalsSvg(x, y) : '<p>Noch keine Tiere eingestellt.</p>';
          var k = x + y, b = 2 * x + 4 * y, ok1 = k === R[0], ok2 = b === R[1];
          var line = function (lab, txt, val, soll, ok) { return '<p class="fb ' + (ok ? 'good' : 'bad') + '" style="margin:6px 0"><b>' + lab + '</b> ' + txt + ' = ' + val + ' &nbsp;(soll: ' + soll + ') ' + (ok ? '✓' : '✗') + '</p>'; };
          root.querySelector('#e_txt').innerHTML = line('I Köpfe:', 'x + y = ' + x + ' + ' + y, k, R[0], ok1) + line('II Beine:', '2x + 4y = 2 · ' + x + ' + 4 · ' + y, b, R[1], ok2) +
            '<p class="big-math">' + (ok1 && ok2 ? 'Beide Gleichungen stimmen: (' + x + ' | ' + y + ') ist die Lösung!' : ok1 ? 'Nur Gleichung I stimmt. Noch keine Lösung.' : ok2 ? 'Nur Gleichung II stimmt. Noch keine Lösung.' : 'Probiere weiter.') + '</p>';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Viele Paare erfüllen eine der beiden Gleichungen. Nur ein einziges Paar erfüllt beide gleichzeitig. Das ist die Lösung des Gleichungssystems.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_r').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Eintrittskarten', q: 'Für eine Theateraufführung wurden <b>50 Karten</b> verkauft. Erwachsene zahlen 8 €, Kinder 5 €. Insgesamt wurden <b>340 €</b> eingenommen. Wie viele Erwachsene und wie viele Kinder waren da?',
      steps: ['Variablen festlegen: x = Anzahl der Erwachsenen, y = Anzahl der Kinder.', 'Gleichungen aufstellen:' + sys('x + y = 50', '8x + 5y = 340'), 'Probieren mit Gleichung I (y = 50 − x):' + tab([['x', '20', '25', '30'], ['y = 50 − x', '30', '25', '20'], ['8x + 5y', '310', '325', '<b>340</b> ✓']]), 'Probe: I: 30 + 20 = 50 ✓ &nbsp; II: 8 · 30 + 5 · 20 = 240 + 100 = 340 ✓', 'Antwort: Es waren <b>30 Erwachsene und 20 Kinder</b> da. L = {(30 | 20)}.'] },
    tasks: { gen: gen, plan: { G: ['pruefen:1', 'ergaenzen:1', 'tabelle:1', 'tiere:2'], S: ['pruefen:2', 'welches:2', 'tabelle:2', 'aufstellen:2', 'tiere:2'], E: ['welches:2', 'tabelle:3', 'aufstellen:2', 'tiere:3', 'karten:2', 'raetsel:3'] },
      extra: 'luecke', test: ['pruefen:2', 'ergaenzen:1', 'welches:2', 'tabelle:2', 'tiere:2', 'karten:2'] },
    lerncheck: ['Ich kann erklären, was die Lösung eines Gleichungssystems ist.', 'Ich prüfe durch Einsetzen in beide Gleichungen, ob ein Zahlenpaar eine Lösung ist.', 'Ich finde die Lösung durch Probieren oder mit einer Tabelle.', 'Ich stelle zu Sachaufgaben ein Gleichungssystem auf.']
  };
})();
