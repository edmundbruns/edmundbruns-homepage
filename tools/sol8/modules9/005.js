/* Modul 005 (Klasse 9) · Additionsverfahren */
var MODULE = (function () {
  /* ---------- Hilfsfunktionen für Gleichungen ---------- */
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function par(v) { return v < 0 ? '(' + n(v) + ')' : n(v); }
  function coef(a, v, first) { if (a === 0) return ''; var k = Math.abs(a); return (a < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + (k === 1 ? '' : n(k)) + v; }
  function lin(a, b) { var s = coef(a, 'x', true); s += coef(b, 'y', !s); return s || '0'; }
  function eqG(a, b, c) { return lin(a, b) + ' = ' + n(c); }
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
  function cst(c) { return c === 0 ? '' : c < 0 ? ' − ' + n(-c) : ' + ' + n(c); }
  function rhs(m, t) { return m ? coef(m, 'x', true) + cst(t) : n(t); }
  function eqY(m, t) { return 'y = ' + rhs(m, t); }
  function eqX(p, q) { return 'x = ' + (p ? coef(p, 'y', true) + cst(q) : n(q)); }
  function calcY(m, t, x) { return m === 0 ? n(t) : (m === 1 ? par(x) : m === -1 ? (x < 0 ? '−' + par(x) : '−1 · ' + n(x)) : n(m) + ' · ' + par(x)) + cst(t) + ' = ' + n(m * x + t); }
  function opMul(k) { return ' &nbsp;|&nbsp; · ' + par(k); }
  /* y-Koeffizient kürzen: b·y = r ⇒ y = r : b */
  function solveLin(b, r, v) { return coef(b, v, true) + ' = ' + n(r) + (b !== 1 ? ' &nbsp;|&nbsp; : ' + par(b) + ' &nbsp;⇒&nbsp; ' + v + ' = ' + n(r / b) : ''); }
  /* Lösungsweg: I·k1 + II·k2, sodass y (elim='y') oder x wegfällt */
  function addSteps(s, k1, k2, elim) {
    var A1 = s.a1 * k1, B1 = s.b1 * k1, C1 = s.c1 * k1, A2 = s.a2 * k2, B2 = s.b2 * k2, C2 = s.c2 * k2, L = [];
    if (k1 !== 1) L.push('<b>I · ' + par(k1) + ':</b> ' + eqG(A1, B1, C1));
    if (k2 !== 1) L.push('<b>II · ' + par(k2) + ':</b> ' + eqG(A2, B2, C2));
    var name = (k1 !== 1 ? 'I′' : 'I') + ' + ' + (k2 !== 1 ? 'II′' : 'II');
    if (elim === 'y') {
      L.push('<b>' + name + ':</b> ' + coef(A1 + A2, 'x', true) + ' = ' + n(C1 + C2) + ' &nbsp;<small>(y fällt weg)</small>');
      L.push('<b>Auflösen:</b> ' + solveLin(A1 + A2, C1 + C2, 'x'));
      var x = (C1 + C2) / (A1 + A2);
      L.push('<b>Einsetzen in I:</b> ' + subst2(s.a1, s.b1, x, null) + ' = ' + n(s.c1) + ' ⇒ ' + solveLin(s.b1, s.c1 - s.a1 * x, 'y'));
    } else {
      L.push('<b>' + name + ':</b> ' + coef(B1 + B2, 'y', true) + ' = ' + n(C1 + C2) + ' &nbsp;<small>(x fällt weg)</small>');
      L.push('<b>Auflösen:</b> ' + solveLin(B1 + B2, C1 + C2, 'y'));
      var y = (C1 + C2) / (B1 + B2);
      L.push('<b>Einsetzen in I:</b> ' + subst2(s.a1, s.b1, null, y) + ' = ' + n(s.c1) + ' ⇒ ' + solveLin(s.a1, s.c1 - s.b1 * y, 'x'));
    }
    L.push('<b>Probe in II:</b> ' + subst(s.a2, s.b2, s.x, s.y) + ' ✓');
    return L.join('<br>');
  }
  /* a·x + b·y mit einer eingesetzten Zahl */
  function subst2(a, b, x, y) {
    var first = x !== null ? (a === 1 ? par(x) : a === -1 ? '−' + par(x) : n(a) + ' · ' + par(x)) : coef(a, 'x', true);
    var k = Math.abs(b), second = y !== null ? (b < 0 ? ' − ' : ' + ') + (k === 1 ? par(y) : n(k) + ' · ' + par(y)) : coef(b, 'y', false);
    return first + second;
  }
  function mk(a1, b1, a2, b2, x, y) { return { a1: a1, b1: b1, c1: a1 * x + b1 * y, a2: a2, b2: b2, c2: a2 * x + b2 * y, x: x, y: y }; }
  function E(s) { return [eqG(s.a1, s.b1, s.c1), eqG(s.a2, s.b2, s.c2)]; }
  function sol(lvl) { return [M.rnd(lvl <= 1 ? 1 : -3, 7), M.rnd(lvl <= 1 ? 1 : -4, 7)]; }
  function check(s) { var e = E(s); return holds(e[0], s.x, s.y) && holds(e[1], s.x, s.y) && s.a1 * s.b2 - s.a2 * s.b1 !== 0; }

  var gen = {
    direkt_add: function (lvl) {
      for (var k = 0; k < 300; k++) {
        var p = sol(lvl), b = M.pick([1, 2, 3, 4]), a1 = M.pick([1, 2, 3, 4, 5]), a2 = M.pick([1, 2, 3, -1, 4]); if (a1 + a2 === 0) continue;
        var s = mk(a1, b, a2, -b, p[0], p[1]); if (!check(s)) continue;
        var e = E(s);
        return { skill: 'Addieren: Variable fällt direkt weg', level: 1, q: 'Löse das Gleichungssystem mit dem Additionsverfahren.' + sys(e[0], e[1]),
          inputs: pairIn(s.x, s.y),
          hints: ['In I steht ' + coef(b, 'y', true) + ', in II steht ' + coef(-b, 'y', true) + '. Addierst du beide Gleichungen, fällt y weg.', 'Linke Seiten addieren, rechte Seiten addieren: ' + coef(a1 + a2, 'x', true) + ' = ' + n(s.c1 + s.c2) + '.', 'x = ' + n(s.x) + '. Setze x in Gleichung I ein und berechne y.'],
          solution: addSteps(s, 1, 1, 'y') + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: pairMis(s.x, s.y),
          verify: function () { return (check(s) && (s.c1 + s.c2) / (a1 + a2) === s.x) || 'Lösung falsch'; } };
      }
    },
    direkt_sub: function (lvl) {
      for (var k = 0; k < 300; k++) {
        var p = sol(2), b = M.pick([2, 3, 4, -2, 5]), a1 = M.pick([2, 3, 4, 5, 6]), a2 = M.pick([1, 2, 3, -1, -2]); if (a1 === a2) continue;
        var s = mk(a1, b, a2, b, p[0], p[1]); if (!check(s)) continue;
        var e = E(s), xw = (s.c1 + s.c2) / (a1 + a2);
        return { skill: 'Subtrahieren: gleiche Koeffizienten', level: lvl >= 3 ? 3 : 2, q: 'Löse das Gleichungssystem mit dem Additionsverfahren. Überlege, ob du addierst oder subtrahierst.' + sys(e[0], e[1]),
          inputs: pairIn(s.x, s.y),
          hints: ['Beide Gleichungen enthalten ' + coef(b, 'y', true) + '. Beim Addieren würde y nicht wegfallen. Subtrahiere II von I (oder multipliziere II mit −1 und addiere).', 'I − II: ' + coef(a1 - a2, 'x', true) + ' = ' + n(s.c1 - s.c2) + '.', 'x = ' + n(s.x) + '. Setze x in Gleichung I ein.'],
          solution: addSteps(s, 1, -1, 'y') + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: pairMis(s.x, s.y, 'x', 'y', function (a) { if (a + 1e-9 > xw && a - 1e-9 < xw && xw !== s.x) return 'Du hast addiert. Bei gleichen Koeffizienten (' + coef(b, 'y', true) + ' und ' + coef(b, 'y', true) + ') musst du subtrahieren, damit y wegfällt.'; return null; }),
          verify: function () { return (check(s) && (s.c1 - s.c2) / (a1 - a2) === s.x) || 'Lösung falsch'; } };
      }
    },
    mal_eine: function (lvl) {
      for (var k = 0; k < 400; k++) {
        var p = sol(lvl), m = M.pick([2, 3, -2, -3, 4]), b2 = M.pick([1, -1, 2]), b1 = -m * b2, a1 = M.nz(-4, 6), a2 = M.nz(-3, 5);
        if (Math.abs(b1) > 8) continue;
        var s = mk(a1, b1, a2, b2, p[0], p[1]); if (!check(s) || a1 + m * a2 === 0) continue;
        var e = E(s);
        return { skill: 'Eine Gleichung multiplizieren', level: 2, q: 'Löse das Gleichungssystem mit dem Additionsverfahren. Multipliziere dazu zuerst eine Gleichung geschickt.' + sys(e[0], e[1]),
          inputs: pairIn(s.x, s.y),
          hints: ['Vergleiche die Koeffizienten von y: ' + n(b1) + ' in I und ' + n(b2) + ' in II. Mit welcher Zahl musst du II multiplizieren, damit die Gegenzahl von ' + n(b1) + ' entsteht?', 'Multipliziere II mit ' + par(m) + ': ' + eqG(a2 * m, b2 * m, s.c2 * m) + '. Addiere dann I.', 'Du erhältst ' + coef(a1 + m * a2, 'x', true) + ' = ' + n(s.c1 + m * s.c2) + ', also x = ' + n(s.x) + '.'],
          solution: addSteps(s, 1, m, 'y') + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: pairMis(s.x, s.y, 'x', 'y', function (a) { var xr = (s.c1 + m * s.c2) / (a1 + m * a2), xw = (s.c1 + s.c2) / (a1 + m * a2); if (Math.abs(a - xw) < 1e-9 && Math.abs(xw - xr) > 1e-9) return 'Beim Multiplizieren musst du <b>jedes</b> Glied der Gleichung malnehmen, auch die Zahl auf der rechten Seite.'; return null; }),
          verify: function () { return (check(s) && b1 + m * b2 === 0) || 'Lösung falsch'; } };
      }
    },
    mal_beide: function () {
      for (var k = 0; k < 400; k++) {
        var p = sol(2), pr = M.pick([[2, 3], [3, 2], [3, 4], [2, 5], [4, 3], [3, 5]]), b1 = pr[0] * M.pick([1, -1]), b2 = pr[1] * M.pick([1, -1]), a1 = M.pick([2, 3, 4, 5, -2]), a2 = M.pick([2, 3, -3, 4, 5]);
        var s = mk(a1, b1, a2, b2, p[0], p[1]); if (!check(s)) continue;
        var k1 = Math.abs(b2), k2 = -Math.abs(b1) * Math.sign(b1) * Math.sign(b2);
        if (a1 * k1 + a2 * k2 === 0 || Math.abs(s.c1) > 45 || Math.abs(s.c2) > 45) continue;
        var e = E(s);
        return { skill: 'Beide Gleichungen multiplizieren', level: 3, q: 'Löse das Gleichungssystem mit dem Additionsverfahren. Hier musst du beide Gleichungen multiplizieren.' + sys(e[0], e[1]),
          inputs: pairIn(s.x, s.y),
          hints: ['Ziel: Die y-Koeffizienten ' + n(b1) + ' und ' + n(b2) + ' sollen Gegenzahlen werden. Suche ein gemeinsames Vielfaches von ' + Math.abs(b1) + ' und ' + Math.abs(b2) + ': ' + Math.abs(b1 * b2) + '.', 'Multipliziere I mit ' + par(k1) + ' und II mit ' + par(k2) + ': ' + eqG(a1 * k1, b1 * k1, s.c1 * k1) + ' und ' + eqG(a2 * k2, b2 * k2, s.c2 * k2) + '.', 'Addiere: ' + coef(a1 * k1 + a2 * k2, 'x', true) + ' = ' + n(s.c1 * k1 + s.c2 * k2) + '. Also x = ' + n(s.x) + '.'],
          solution: addSteps(s, k1, k2, 'y') + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: pairMis(s.x, s.y),
          verify: function () { return (check(s) && b1 * k1 + b2 * k2 === 0) || 'Lösung falsch'; } };
      }
    },
    faktor: function (lvl) {
      for (var k = 0; k < 300; k++) {
        var p = sol(2), m = M.pick(lvl <= 1 ? [2, 3, -2, -3] : [2, 3, 4, -2, -3, -4, 5]), b2 = M.pick([1, -1, 2]), b1 = -m * b2, a1 = M.pick([1, 2, 3, 5]), a2 = M.pick([1, 2, 3, -1]);
        if (Math.abs(b1) > 10) continue;
        var s = mk(a1, b1, a2, b2, p[0], p[1]); if (!check(s)) continue;
        var e = E(s);
        return { skill: 'Passenden Faktor finden', level: lvl <= 1 ? 1 : 2, q: 'Mit welcher Zahl musst du Gleichung II multiplizieren, damit beim <b>Addieren</b> von I und der neuen Gleichung II die Variable <b>y</b> wegfällt?' + sys(e[0], e[1]),
          inputs: [{ kind: 'num', answer: m, label: 'II multiplizieren mit' }],
          hints: ['Beim Addieren fällt y weg, wenn die y-Koeffizienten Gegenzahlen sind, zum Beispiel 6 und −6.', 'In I steht ' + coef(b1, 'y', true) + '. In der neuen Gleichung II muss also ' + coef(-b1, 'y', true) + ' stehen.', n(b2) + ' · □ = ' + n(-b1) + '. Achte auf das Vorzeichen.'],
          solution: 'In I steht ' + coef(b1, 'y', true) + '. Mit <b>' + par(m) + '</b> wird aus ' + coef(b2, 'y', true) + ' in II ' + coef(-b1, 'y', true) + '. Neue Gleichung II: ' + eqG(a2 * m, b2 * m, s.c2 * m) + '. Addieren: ' + coef(a1 + a2 * m, 'x', true) + ' = ' + n(s.c1 + s.c2 * m) + ', y ist weggefallen.',
          mistakes: function (v) { var f = M.parseNum(v[0]); if (f === -m) return 'Mit ' + par(-m) + ' würden die y-Koeffizienten gleich, nicht entgegengesetzt. Dann müsstest du subtrahieren. Hier soll aber addiert werden.'; return null; },
          verify: function () { return (b1 + m * b2 === 0 && check(s)) || 'Faktor falsch'; } };
      }
    },
    ergebnis_add: function (lvl) {
      for (var k = 0; k < 300; k++) {
        var p = sol(lvl), b = M.pick([2, 3, 4, 5]), a1 = M.pick([2, 3, 4, 5]), a2 = M.pick([1, 2, 3, 4]);
        var s = mk(a1, b, a2, -b, p[0], p[1]); if (!check(s)) continue;
        var e = E(s), right = coef(a1 + a2, 'x', true) + ' = ' + n(s.c1 + s.c2);
        var w1 = eqG(a1 - a2, 2 * b, s.c1 - s.c2), w2 = coef(a1 + a2, 'x', true) + ' = ' + n(s.c1 - s.c2), w3 = eqG(a1 + a2, 2 * b, s.c1 + s.c2);
        var all = [[right, 0], [w1, 1], [w2, 2], [w3, 3]];
        if (new Set(all.map(function (o) { return o[0]; })).size !== 4) continue;
        var bad = false; for (var i = 2; i < 4; i++) if (holds(all[i][0], s.x, s.y)) bad = true; if (bad) continue; /* I − II ist zwar wahr, aber nicht I + II */
        all = M.shuffle(all);
        return { skill: 'Gleichungen addieren', level: 1, q: 'Welche Gleichung erhältst du, wenn du Gleichung I und Gleichung II addierst?' + sys(e[0], e[1]),
          inputs: [{ kind: 'mc', label: 'I + II', options: all.map(function (o) { return o[0]; }), answer: all.findIndex(function (o) { return o[1] === 0; }) }],
          hints: ['Addiere die linken Seiten und die rechten Seiten getrennt.', 'x-Glieder: ' + coef(a1, 'x', true) + ' + ' + coef(a2, 'x', true) + ' = ' + coef(a1 + a2, 'x', true) + '. y-Glieder: ' + coef(b, 'y', true) + ' + (' + coef(-b, 'y', true) + ') = 0.', 'Rechte Seiten: ' + n(s.c1) + ' + ' + par(s.c2) + ' = ' + n(s.c1 + s.c2) + '.'],
          solution: 'I + II: ' + coef(a1, 'x', true) + ' + ' + coef(a2, 'x', true) + ' und ' + coef(b, 'y', true) + ' − ' + coef(b, 'y', true) + ' = 0, rechts ' + n(s.c1) + ' + ' + par(s.c2) + '. Richtig ist <b>' + right + '</b>. Daraus folgt x = ' + n(s.x) + '.',
          mistakes: function (v) { var o = all[+v[0]]; if (!o) return null; if (o[1] === 1) return 'Das ist I − II. Hier sollst du addieren.'; if (o[1] === 2) return 'Die rechten Seiten werden auch addiert: ' + n(s.c1) + ' + ' + par(s.c2) + '.'; if (o[1] === 3) return coef(b, 'y', true) + ' und ' + coef(-b, 'y', true) + ' heben sich auf. Sie ergeben zusammen 0.'; return null; },
          verify: function () { return holds(right, s.x, s.y) || 'Summe falsch'; } };
      }
      return gen.direkt_add(lvl);
    },
    verfahren: function () {
      var typ = M.rnd(0, 2), e1, e2, x = M.rnd(-2, 6), y = M.rnd(-2, 6);
      if (typ === 0) { var m1 = M.pick([2, 3, -1, 4]), m2; do { m2 = M.pick([1, -2, -3, 5]); } while (m2 === m1); e1 = eqY(m1, y - m1 * x); e2 = eqY(m2, y - m2 * x); }
      else if (typ === 1) { var p = M.pick([2, 3, -2, 4]), a = M.pick([3, 4, 5, -3]), b = M.pick([2, 5, -2, 3]); if (a * p + b === 0) b = 7; e1 = eqX(p, x - p * y); e2 = eqG(a, b, a * x + b * y); }
      else { var a1 = M.pick([2, 3, 4, 5]), a2 = M.pick([2, 3, 5, 6]), bb = M.pick([2, 3, 4, 5]); if (a1 === a2) a2 = a1 + 1; e1 = eqG(a1, bb, a1 * x + bb * y); e2 = eqG(a2, -bb, a2 * x - bb * y); }
      var opts = ['Gleichsetzungsverfahren', 'Einsetzungsverfahren', 'Additionsverfahren'];
      var why = ['Beide Gleichungen sind schon nach y aufgelöst. Du setzt die rechten Seiten sofort gleich.', 'Gleichung I ist schon nach x aufgelöst. Du setzt den Term direkt in Gleichung II ein.', 'Die y-Koeffizienten sind Gegenzahlen. Beim Addieren fällt y sofort weg, und keine Gleichung muss umgestellt werden.'];
      return { skill: 'Geschicktes Verfahren wählen', level: 2, q: 'Welches Verfahren ist für dieses Gleichungssystem am geschicktesten?' + sys(e1, e2),
        inputs: [{ kind: 'mc', label: 'Am geschicktesten ist das …', options: opts, answer: typ }],
        hints: ['Sind beide Gleichungen nach derselben Variablen aufgelöst (y = … und y = …)?', 'Ist nur eine Gleichung nach einer Variablen aufgelöst (x = … oder y = …)?', 'Stehen vor einer Variablen Gegenzahlen wie 3y und −3y? Dann fällt sie beim Addieren weg.'],
        solution: '<b>' + opts[typ] + '</b>. ' + why[typ] + ' Alle Verfahren führen zur selben Lösung ' + pair(x, y) + '.',
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'System falsch'; } };
    },
    sach: function (lvl) {
      var ctx = M.pick([['Im Kino', 'Erwachsene', 'Kinder', 'Erwachsenenkarte', 'Kinderkarte'], ['Im Freizeitpark', 'Erwachsene', 'Jugendliche', 'Erwachsenenkarte', 'Jugendkarte'], ['Im Imbiss', 'Pizzen', 'Getränke', 'Pizza', 'Getränk']]);
      for (var k = 0; k < 400; k++) {
        var x = ctx[1] === 'Pizzen' ? M.pick([6, 7, 8, 9]) : M.pick([8, 9, 10, 12, 14]), y = ctx[1] === 'Pizzen' ? M.pick([2, 3, 4]) : M.pick([4, 5, 6, 7]);
        if (y >= x) continue;
        var a1 = M.rnd(2, 4), b1 = M.rnd(2, 5), a2 = M.rnd(2, 5), b2 = M.rnd(2, 5);
        if (a1 * b2 - a2 * b1 === 0 || (a1 === a2 && b1 === b2)) continue;
        if (lvl <= 2 && !(a1 % a2 === 0 || a2 % a1 === 0)) continue;
        var s = mk(a1, b1, a2, b2, x, y), e = E(s);
        /* eleminiere x über kgV der x-Koeffizienten */
        var L = M.lcm(a1, a2), k1 = L / a1, k2 = -L / a2;
        var plan = addSteps(s, k1, k2, 'x');
        return { skill: 'Sachaufgabe mit Additionsverfahren', level: lvl >= 3 ? 3 : 2, q: ctx[0] + ' bezahlt Familie Kaya für ' + a1 + ' ' + ctx[1] + ' und ' + b1 + ' ' + ctx[2] + ' zusammen ' + s.c1 + ' €. Familie Brandt bezahlt für ' + a2 + ' ' + ctx[1] + ' und ' + b2 + ' ' + ctx[2] + ' zusammen ' + s.c2 + ' €.<br>Was kostet eine ' + ctx[3] + ', was kostet ' + (ctx[4] === 'Getränk' ? 'ein Getränk' : 'eine ' + ctx[4]) + '?',
          inputs: [{ kind: 'num', answer: x, label: 'Preis ' + ctx[3], unit: '€', tol: 0.005 }, { kind: 'num', answer: y, label: 'Preis ' + ctx[4], unit: '€', tol: 0.005 }],
          hints: ['x = Preis ' + ctx[3] + ', y = Preis ' + ctx[4] + '. I: ' + e[0] + ', II: ' + e[1] + '.', 'Mache die x-Koeffizienten zu Gegenzahlen: ' + (k1 === 1 ? 'Multipliziere II mit ' + par(k2) : 'Multipliziere I mit ' + par(k1) + ' und II mit ' + par(k2)) + ', dann addiere.', 'Nach dem Addieren bleibt nur y übrig. y = ' + n(y) + '. Setze y in I ein.'],
          solution: 'I: ' + e[0] + ', II: ' + e[1] + '<br>' + plan + '<br><b>' + (ctx[3]) + ': ' + n(x) + ' €, ' + ctx[4] + ': ' + n(y) + ' €.</b>',
          mistakes: pairMis(x, y, 'der erste Preis', 'der zweite Preis'),
          verify: function () { return check(s) || 'Probe falsch'; } };
      }
      return gen.mal_eine(2);
    },
    ziffern: function () {
      for (var k = 0; k < 300; k++) {
        var z = M.rnd(1, 8), e = M.rnd(1, 9); if (e <= z) continue;
        var S = z + e, D = 9 * (e - z), num = 10 * z + e;
        var E1 = 'x + y = ' + S, E2 = 'y − x = ' + (e - z);
        return { skill: 'Zahlenrätsel mit Ziffern', level: 3, q: 'Eine zweistellige Zahl hat die Quersumme ' + S + '. Vertauschst du ihre beiden Ziffern, wird die neue Zahl um ' + D + ' größer. Wie heißt die Zahl?<br><small>Tipp: x = Zehnerziffer, y = Einerziffer. Die Zahl hat den Wert 10x + y.</small>',
          inputs: [{ kind: 'num', answer: num, label: 'Die Zahl' }],
          hints: ['Quersumme: I: x + y = ' + S + '. Vertauschte Zahl: 10y + x. Sie ist um ' + D + ' größer: (10y + x) − (10x + y) = ' + D + '.', 'Vereinfache II: 9y − 9x = ' + D + ', also −x + y = ' + (e - z) + '.', 'Addiere I und II: 2y = ' + (S + e - z) + '. Also y = ' + e + ', und x = ' + z + '.'],
          solution: 'I: x + y = ' + S + '<br>II: (10y + x) − (10x + y) = ' + D + ' ⇒ 9y − 9x = ' + D + ' &nbsp;|&nbsp; : 9 ⇒ −x + y = ' + (e - z) + '<br>I + II: 2y = ' + (S + e - z) + ' ⇒ y = ' + e + ', x = ' + S + ' − ' + e + ' = ' + z + '.<br>Die Zahl ist <b>' + num + '</b>. Probe: ' + z + ' + ' + e + ' = ' + S + ' ✓, ' + (10 * e + z) + ' − ' + num + ' = ' + D + ' ✓',
          mistakes: function (v) { var q = M.parseNum(v[0]); if (q === 10 * e + z) return 'Das ist die Zahl mit vertauschten Ziffern. Gesucht ist die ursprüngliche, kleinere Zahl.'; return null; },
          verify: function () { return (holds(E1, z, e) && holds(E2, z, e) && (10 * e + z) - num === D) || 'Rätsel falsch'; } };
      }
    }
  };

  var EX = [mk(2, 3, 1, 1, 2, 3), mk(3, 2, 1, -1, 2, 3), mk(4, -3, 2, 1, 3, 2)];
  function tiles(a, b, yy) {
    var s = '', x0 = 82, w = 22, i, pos = 0;
    function tile(lbl, neg, col) { var X = x0 + pos * (w + 3.5); pos++; return '<rect x="' + X + '" y="' + yy + '" width="' + w + '" height="' + w + '" rx="4" fill="' + (neg ? '#fff' : col) + '" stroke="' + col + '" stroke-width="2"' + (neg ? ' stroke-dasharray="4 2"' : '') + '/><text x="' + (X + w / 2) + '" y="' + (yy + 16) + '" font-size="12" font-weight="700" text-anchor="middle" fill="' + (neg ? col : '#fff') + '">' + (neg ? '−' : '') + lbl + '</text>'; }
    for (i = 0; i < Math.abs(a); i++) s += tile('x', a < 0, '#1d4ed8');
    if (a) pos += 0.6;
    for (i = 0; i < Math.abs(b); i++) s += tile('y', b < 0, '#0f766e');
    return s;
  }

  return {
    id: '005', title: 'Additionsverfahren', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Gleichungen umformen, Gleichsetzungs- und Einsetzungsverfahren (Module 003 und 004)',
    lead: 'Zwei Gleichungen addieren und eine Variable verschwindet. Das Additionsverfahren ist oft der schnellste Weg zur Lösung.',
    einstieg: { html: '<p>Im Kino bezahlt Familie Kaya für <b>3 Erwachsene und 2 Kinder 41 €</b>. Familie Brandt bezahlt für <b>2 Erwachsene und 2 Kinder 32 €</b>.</p><p class="note">Was kostet eine Erwachsenenkarte, was eine Kinderkarte?</p><p>Vergleiche die beiden Einkäufe: Familie Kaya hat genau <b>einen Erwachsenen mehr</b> und bezahlt <b>9 € mehr</b>. Also kostet eine Erwachsenenkarte 9 €. Du hast gerade, ohne es zu merken, zwei Gleichungen voneinander <b>subtrahiert</b>. Das ist die Idee des <b>Additionsverfahrens</b>.</p>' },
    ziele: ['Ich addiere oder subtrahiere zwei Gleichungen so, dass eine Variable wegfällt.', 'Ich finde den passenden Faktor, mit dem ich eine Gleichung multipliziere.', 'Ich multipliziere bei Bedarf beide Gleichungen.', 'Ich berechne beide Variablen und mache die Probe.', 'Ich wähle für ein Gleichungssystem ein geschicktes Lösungsverfahren.'],
    fachwoerter: [['Additionsverfahren', 'Man addiert (oder subtrahiert) die Gleichungen so, dass eine Variable wegfällt.'], ['Koeffizient', 'Die Zahl vor einer Variablen, zum Beispiel −2 in −2y.'], ['Gegenzahlen', 'Zahlen mit gleichem Betrag und verschiedenem Vorzeichen, zum Beispiel 3 und −3. Ihre Summe ist 0.'], ['Äquivalenzumformung', 'Eine Umformung, die die Lösungen nicht verändert, zum Beispiel beide Seiten mit derselben Zahl (nicht 0) multiplizieren.']],
    diagnose: [
      { q: 'Multipliziere die Gleichung 2x − 3y = 5 mit −2.', options: ['−4x + 6y = −10', '−4x − 6y = −10', '−4x + 6y = 5', 'Weiß ich noch nicht'], answer: 0, why: 'Jedes Glied wird mit −2 multipliziert: −4x, +6y und −10.', review: 'Gleichungen umformen' },
      { q: 'Was ergibt 4y + (−4y)?', options: ['0', '8y', '−16y', 'Weiß ich noch nicht'], answer: 0, why: 'Gegenzahlen heben sich auf: 4y − 4y = 0.', review: 'Gleichartige Terme zusammenfassen' },
      { q: 'Welches ist das kleinste gemeinsame Vielfache von 4 und 6?', options: ['12', '24', '2', 'Weiß ich noch nicht'], answer: 0, why: 'Vielfache von 4: 4, 8, 12 …; von 6: 6, 12 … Das kleinste gemeinsame ist 12.', review: 'kgV bestimmen (Klasse 6)' },
      { q: 'Löse das System y = x + 1 und y = 3x − 3.', options: ['(2 | 3)', '(3 | 2)', '(1 | 2)', 'Weiß ich noch nicht'], answer: 0, why: 'Gleichsetzen: x + 1 = 3x − 3, also 4 = 2x und x = 2, y = 3.', review: 'Gleichsetzungsverfahren (Modul 003)' }],
    erklaerung:
      '<h3>1. Gleichungen addieren</h3><p>Sind a = b und c = d wahre Gleichungen, so ist auch <b>a + c = b + d</b> wahr. Du darfst also zwei Gleichungen addieren: linke Seiten zusammen, rechte Seiten zusammen.</p>' + sys('3x + 2y = 16', '5x − 2y = 16') +
      '<p>' + addSteps(mk(3, 2, 5, -2, 4, 2), 1, 1, 'y') + '<br><b>L = {(4 | 2)}</b></p>' +
      '<div class="merk"><b>Merke: Additionsverfahren</b><br>1. Die Gleichungen so <b>multiplizieren</b>, dass vor einer Variablen <b>Gegenzahlen</b> stehen (zum Beispiel 6y und −6y).<br>2. Die Gleichungen <b>addieren</b>. Die Variable fällt weg.<br>3. Die entstandene Gleichung lösen.<br>4. Den Wert in eine Ausgangsgleichung einsetzen und die zweite Variable berechnen.<br>5. Probe machen und L angeben.</div>' +
      '<h3>2. Erst multiplizieren</h3><p>' + sys('2x + 3y = 13', 'x + y = 5') + '</p><p>Vor y stehen 3 und 1. Multiplizierst du II mit −3, steht dort −3y:</p><p>' + addSteps(EX[0], 1, -3, 'y') + '<br><b>L = {(2 | 3)}</b></p>' +
      '<p class="note">Stehen vor einer Variablen <b>gleiche</b> Zahlen (zum Beispiel 2y und 2y), kannst du die Gleichungen auch direkt <b>subtrahieren</b>. Das ist dasselbe wie mit −1 multiplizieren und addieren. Brauchen beide Gleichungen einen Faktor, nimm das kgV der Koeffizienten: bei 2y und 3y zum Beispiel I · 3 und II · (−2).</p>' +
      '<h3>3. Welches Verfahren ist geschickt?</h3>' + tab([['Form des Systems', 'Geschicktes Verfahren'], ['y = … und y = …', 'Gleichsetzungsverfahren'], ['y = … (oder x = …) und eine andere Gleichung', 'Einsetzungsverfahren'], ['ax + by = c in beiden Gleichungen', 'Additionsverfahren']]),
    entdecken: {
      html: '<p>Wähle ein System und einen Faktor k für Gleichung II. Die Kästchen zeigen die x- und y-Glieder (gestrichelt bedeutet negativ). Beim Addieren heben sich ein positives und ein negatives Kästchen auf.</p><div class="ctl"><label>System <select id="e_s">' + EX.map(function (s, i) { var e = E(s); return '<option value="' + i + '">I: ' + e[0] + ' &nbsp; II: ' + e[1] + '</option>'; }).join('') + '</select></label><label>II · k, k = <b id="v_k"></b> <input type="range" id="r_k" min="-3" max="3" step="1" value="-2"></label></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var s = EX[+root.querySelector('#e_s').value], k = +root.querySelector('#r_k').value;
          root.querySelector('#v_k').textContent = n(k);
          var A = s.a1 + k * s.a2, B = s.b1 + k * s.b2, C = s.c1 + k * s.c2;
          var svg = '<svg class="viz" viewBox="0 0 345 132" role="img" aria-label="Kästchenmodell der Gleichungen" style="max-width:480px">' +
            '<text x="6" y="22" font-size="13" font-weight="700" fill="#1e3a8a">I</text>' + tiles(s.a1, s.b1, 8) +
            '<text x="6" y="56" font-size="13" font-weight="700" fill="#1e3a8a">II · ' + (k < 0 ? '(' + n(k) + ')' : n(k)) + '</text>' + tiles(k * s.a2, k * s.b2, 42) +
            '<line x1="6" y1="74" x2="340" y2="74" stroke="#1e3a8a" stroke-width="2"/><text x="6" y="98" font-size="13" font-weight="700" fill="#d97706">Summe</text>' + tiles(A, B, 86) + '</svg>';
          root.querySelector('#e_g').innerHTML = svg;
          var e = E(s), txt = '<p>II · ' + par(k) + ': ' + (k === 0 ? '0 = 0' : eqG(k * s.a2, k * s.b2, k * s.c2)) + '</p><p class="big-math">I + II · ' + par(k) + ': ' + (A || B ? eqG(A, B, C) : '0 = ' + n(C)) + '</p>';
          if (k === 0) txt += '<p class="fb bad">Mit 0 malnehmen ist verboten: Gleichung II würde ihre ganze Information verlieren.</p>';
          else if (B === 0) txt += '<p class="fb good"><b>y fällt weg!</b> ' + solveLin(A, C, 'x') + '. Setze x in I ein, dann erhältst du y = ' + n(s.y) + '.</p>';
          else if (A === 0) txt += '<p class="fb good"><b>x fällt weg!</b> ' + solveLin(B, C, 'y') + '. Setze y in I ein, dann erhältst du x = ' + n(s.x) + '.</p>';
          else txt += '<p class="fb">Noch kommen x und y vor. Probiere einen anderen Faktor.</p>';
          root.querySelector('#e_txt').innerHTML = txt;
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Werden die Koeffizienten einer Variablen zu Gegenzahlen, fällt diese Variable beim Addieren weg. Den passenden Faktor findest du, indem du die Koeffizienten vergleichst.'); }
        root.querySelector('#r_k').addEventListener('input', hit);
        root.querySelector('#e_s').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Kinokarten', q: 'Familie Kaya: 3 Erwachsene und 2 Kinder für 41 €. Familie Brandt: 2 Erwachsene und 2 Kinder für 32 €. Was kosten die Karten?',
      steps: ['Variablen: x = Preis einer Erwachsenenkarte, y = Preis einer Kinderkarte (in €).' + sys('3x + 2y = 41', '2x + 2y = 32'), 'Vor y stehen gleiche Zahlen. Subtrahiere II von I (oder II · (−1) und addieren): (3x − 2x) + (2y − 2y) = 41 − 32.', 'Es bleibt x = 9.', 'Einsetzen in II: 2 · 9 + 2y = 32 ⇒ 2y = 14 ⇒ y = 7. Probe in I: 3 · 9 + 2 · 7 = 27 + 14 = 41 ✓', 'Antwort: Eine Erwachsenenkarte kostet <b>9 €</b>, eine Kinderkarte <b>7 €</b>. L = {(9 | 7)}.'] },
    tasks: { gen: gen, plan: { G: ['ergebnis_add:1', 'direkt_add:1', 'faktor:1', 'mal_eine:2'], S: ['direkt_add:1', 'direkt_sub:2', 'faktor:2', 'mal_eine:2', 'verfahren:2'], E: ['direkt_sub:2', 'mal_eine:2', 'mal_beide:3', 'verfahren:2', 'sach:2', 'sach:3'] },
      extra: 'ziffern', test: ['ergebnis_add:1', 'direkt_add:1', 'direkt_sub:2', 'mal_eine:2', 'verfahren:2', 'sach:2'] },
    lerncheck: ['Ich löse ein Gleichungssystem mit dem Additionsverfahren.', 'Ich finde den passenden Faktor, damit eine Variable wegfällt.', 'Ich multipliziere jedes Glied einer Gleichung, auch die rechte Seite.', 'Ich wähle ein geschicktes Lösungsverfahren aus.']
  };
})();
