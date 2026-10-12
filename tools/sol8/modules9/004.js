/* Modul 004 (Klasse 9) · Einsetzungsverfahren */
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
  /* Faktor vor einer Klammer: 2(…), −(…), + 3(…) */
  function times(k, inner, first) {
    var sg = k < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + '), a = Math.abs(k);
    return sg + (a === 1 ? '' : n(a)) + '(' + inner + ')';
  }
  /* I: o = m·u + t ; II: cu·u + co·o = c (oFirst: in II steht o vorne, z. B. bei o = x) */
  function sub(m, t, cu, co, c, u, o, oFirst) {
    var inner = rhsV(m, t, u), k = cu + co * m, r = c - co * t, u0 = r / k, o0 = m * u0 + t;
    var put = oFirst ? times(co, inner, true) + coef(cu, u, false) : coef(cu, u, true) + times(co, inner, false);
    var exp = oFirst ? coef(co * m, u, true) + cst(co * t) + coef(cu, u, false) : coef(cu, u, true) + coef(co * m, u, false) + cst(co * t);
    var mv = co * t ? ' &nbsp;|&nbsp; ' + (co * t > 0 ? '− ' + n(co * t) : '+ ' + n(-co * t)) : '';
    var lines = [
      '<b>Einsetzen:</b> ' + put + ' = ' + n(c),
      '<b>Klammer auflösen:</b> ' + exp + ' = ' + n(c),
      '<b>Zusammenfassen:</b> ' + coef(k, u, true) + cst(co * t) + ' = ' + n(c) + mv,
      '<b>Auflösen:</b> ' + coef(k, u, true) + ' = ' + n(r) + (k !== 1 ? ' &nbsp;|&nbsp; : ' + par(k) + ' &nbsp;⇒&nbsp; ' + u + ' = ' + n(u0) : ''),
      '<b>Einsetzen in I:</b> ' + o + ' = ' + calcY(m, t, u0)];
    return { put: put, exp: exp, k: k, r: r, u0: u0, o0: o0, lines: lines,
      noBracket: (c - t) / (cu + co * m), signErr: (c + co * t) / k };
  }
  function rhsV(m, t, u) { return m ? coef(m, u, true) + cst(t) : n(t); }
  function bracketMis(S, X, Y, isX) {
    return pairMis(X, Y, 'x', 'y', function (a) {
      var v = isX ? a : null; if (v === null) return null;
      if (Math.abs(v - S.noBracket) < 1e-9 && Math.abs(S.noBracket - S.u0) > 1e-9) return 'Hast du die Klammer vergessen? Beim Einsetzen muss der ganze Term in Klammern stehen, und der Faktor davor wird mit <b>jedem</b> Glied multipliziert.';
      if (Math.abs(v - S.signErr) < 1e-9 && Math.abs(S.signErr - S.u0) > 1e-9) return 'Prüfe die Vorzeichen beim Auflösen der Klammer. Ein Minus vor der Klammer dreht alle Vorzeichen in der Klammer um.';
      return null;
    });
  }
  /* zufällige Daten: Lösung (x|y), I: y = m x + t, II: a x + b y = c */
  function data(lvl, Bs) {
    for (var k = 0; k < 400; k++) {
      var m = M.pick(lvl <= 1 ? [1, 2, 3, -1, -2] : [1, 2, 3, 4, -1, -2, -3]), x = M.rnd(-3, 6), y = M.rnd(-4, 8);
      var a = M.nz(-5, 6), b = M.pick(Bs), t = y - m * x, c = a * x + b * y;
      if (t === 0 || a + b * m === 0 || Math.abs(t) > 12 || Math.abs(c) > 40) continue;
      if (lvl <= 1 && (a < 0 || x < 0)) continue;
      return { m: m, t: t, a: a, b: b, c: c, x: x, y: y };
    }
    return { m: 2, t: -1, a: 3, b: 2, c: 12, x: 2, y: 3 };
  }

  var gen = {
    y_einsetzen: function (lvl) {
      var d = data(lvl, lvl <= 1 ? [1] : [1, 2, 3, -1]), e1 = eqY(d.m, d.t), e2 = eqG(d.a, d.b, d.c), S = sub(d.m, d.t, d.a, d.b, d.c, 'x', 'y', false);
      return { skill: 'Einsetzen: y ist gegeben', level: lvl <= 1 ? 1 : 2, q: 'Löse das Gleichungssystem mit dem Einsetzungsverfahren.' + sys(e1, e2),
        inputs: pairIn(d.x, d.y),
        hints: ['Gleichung I sagt dir, was y ist. Ersetze in Gleichung II das y durch (' + rhs(d.m, d.t) + ').', 'Du erhältst ' + S.put + ' = ' + n(d.c) + '. Löse die Klammer auf und fasse zusammen.', coef(S.k, 'x', true) + ' = ' + n(S.r) + ', also x = ' + n(d.x) + '. Setze x in Gleichung I ein.'],
        solution: S.lines.join('<br>') + '<br><b>Probe in II:</b> ' + subst(d.a, d.b, d.x, d.y) + ' ✓<br><b>L = {' + pair(d.x, d.y) + '}</b>',
        mistakes: bracketMis(S, d.x, d.y, true),
        verify: function () { return (holds(e1, d.x, d.y) && holds(e2, d.x, d.y) && S.u0 === d.x) || 'Lösung falsch'; } };
    },
    x_einsetzen: function (lvl) {
      /* I: x = p y + q, II: a x + b y = c */
      var d = data(lvl, [1, 2, 3, -1, -2]), p = d.m, X = d.t, Y = d.x;
      /* Rollen tauschen: y-Wert = d.x, x-Wert = p·Y + q */
      var q = d.y - p * d.x; X = d.y;
      var a = M.pick([1, 2, 3, -2, 4]), b = M.nz(-4, 5); if (a * p + b === 0) return gen.x_einsetzen(lvl);
      var c = a * X + b * Y, e1 = eqX(p, q), e2 = eqG(a, b, c), S = sub(p, q, b, a, c, 'y', 'x', true);
      return { skill: 'Einsetzen: x ist gegeben', level: 2, q: 'Löse das Gleichungssystem mit dem Einsetzungsverfahren. Gleichung I ist nach <b>x</b> aufgelöst.' + sys(e1, e2),
        inputs: pairIn(X, Y),
        hints: ['Ersetze in Gleichung II das x durch (' + rhsV(p, q, 'y') + ').', 'Du erhältst ' + S.put + ' = ' + n(c) + '. Jetzt kommt nur noch y vor.', coef(S.k, 'y', true) + ' = ' + n(S.r) + ', also y = ' + n(Y) + '. Setze y in Gleichung I ein, um x zu berechnen.'],
        solution: S.lines.join('<br>') + '<br><b>Probe in II:</b> ' + subst(a, b, X, Y) + ' ✓<br><b>L = {' + pair(X, Y) + '}</b>',
        mistakes: pairMis(X, Y, 'x', 'y', function (u, v) { if (u === Y && v === X && X !== Y) return 'Du hast x und y vertauscht. Hier rechnest du zuerst y aus. Im Zahlenpaar steht aber x vorne.'; return null; }),
        verify: function () { return (holds(e1, X, Y) && holds(e2, X, Y) && S.u0 === Y && S.o0 === X) || 'Lösung falsch'; } };
    },
    klammer: function (lvl) {
      var d = data(Math.max(2, lvl), lvl >= 3 ? [-2, -3, -4] : [-1, -2, -3]), e1 = eqY(d.m, d.t), e2 = eqG(d.a, d.b, d.c), S = sub(d.m, d.t, d.a, d.b, d.c, 'x', 'y', false);
      return { skill: 'Einsetzen mit Minus vor der Klammer', level: lvl >= 3 ? 3 : 2, q: 'Löse das Gleichungssystem mit dem Einsetzungsverfahren. Achte auf das Minuszeichen.' + sys(e1, e2),
        inputs: pairIn(d.x, d.y),
        hints: ['Setze y = (' + rhs(d.m, d.t) + ') in Gleichung II ein. Die Klammer ist wichtig: ' + S.put + ' = ' + n(d.c) + '.', 'Ein Minus vor der Klammer dreht alle Vorzeichen in der Klammer um: ' + S.exp + ' = ' + n(d.c) + '.', 'Zusammengefasst: ' + coef(S.k, 'x', true) + cst(d.b * d.t) + ' = ' + n(d.c) + '. Also x = ' + n(d.x) + '.'],
        solution: S.lines.join('<br>') + '<br><b>Probe in II:</b> ' + subst(d.a, d.b, d.x, d.y) + ' ✓<br><b>L = {' + pair(d.x, d.y) + '}</b>',
        mistakes: bracketMis(S, d.x, d.y, true),
        verify: function () { return (holds(e1, d.x, d.y) && holds(e2, d.x, d.y)) || 'Lösung falsch'; } };
    },
    erst_umstellen: function () {
      for (var k = 0; k < 400; k++) {
        var x = M.rnd(-3, 6), y = M.rnd(-3, 7), which = M.rnd(0, 1); /* 0: I hat y mit Koeffizient ±1, 1: I hat x mit Koeffizient 1 */
        var a1, b1, a2 = M.pick([2, 3, 4, 5, -2, -3]), b2 = M.pick([2, 3, -2, -3, 4]);
        if (which === 0) { a1 = M.pick([2, 3, 4, -2, -3]); b1 = M.pick([1, -1]); } else { a1 = 1; b1 = M.pick([2, 3, -2, -4]); }
        if (a1 * b2 - a2 * b1 === 0) continue;
        var c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, e1 = eqG(a1, b1, c1), e2 = eqG(a2, b2, c2), S, um, iso;
        if (which === 0) { var m = -a1 / b1, t = c1 / b1; iso = eqY(m, t); S = sub(m, t, a2, b2, c2, 'x', 'y', false); um = 'I nach y umstellen: ' + coef(b1, 'y', true) + ' = ' + rhs(-a1, c1) + (b1 === -1 ? ' &nbsp;|&nbsp; · (−1) ⇒ ' + iso : '') ; }
        else { var p = -b1, q = c1; iso = eqX(p, q); S = sub(p, q, b2, a2, c2, 'y', 'x', true); um = 'I nach x umstellen: ' + iso; }
        if (Math.abs(S.u0 - (which === 0 ? x : y)) > 1e-9) continue;
        return { skill: 'Erst umstellen, dann einsetzen', level: 3, q: 'Löse das Gleichungssystem mit dem Einsetzungsverfahren. Stelle zuerst eine Gleichung geschickt um.' + sys(e1, e2),
          inputs: pairIn(x, y),
          hints: ['Suche eine Variable ohne Zahl davor (Koeffizient 1 oder −1). Das ist ' + (which === 0 ? 'y' : 'x') + ' in Gleichung I.', um.replace('<b>', '') + '.', 'Setze ' + iso + ' in Gleichung II ein: ' + S.put + ' = ' + n(c2) + '.'],
          solution: '<b>' + um + '</b><br>' + S.lines.join('<br>') + '<br><b>Probe in II:</b> ' + subst(a2, b2, x, y) + ' ✓<br><b>L = {' + pair(x, y) + '}</b>',
          mistakes: bracketMis(S, which === 0 ? x : y, which === 0 ? y : x, false),
          verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Lösung falsch'; } };
      }
      return gen.y_einsetzen(2);
    },
    schritt: function (lvl) {
      var d = data(lvl, [2, 3, -2, 4]), inner = rhs(d.m, d.t), right = coef(d.a, 'x', true) + times(d.b, inner, false) + ' = ' + n(d.c);
      var w1 = coef(d.a, 'x', true) + (d.b < 0 ? ' − ' : ' + ') + n(Math.abs(d.b)) + ' · ' + inner + ' = ' + n(d.c);
      var w2 = times(d.a, inner, true) + coef(d.b, 'y', false) + ' = ' + n(d.c);
      var w3 = coef(d.a, 'x', true) + times(d.b, rhs(d.m, -d.t), false) + ' = ' + n(d.c);
      var all = [[right, 0], [w1, 1], [w2, 2], [w3, 3]];
      if (new Set(all.map(function (o) { return o[0]; })).size !== 4) return gen.schritt(lvl);
      for (var i = 1; i < 4; i++) if (holds(all[i][0], d.x, d.y)) return gen.schritt(lvl);
      all = M.shuffle(all);
      return { skill: 'Richtig einsetzen', level: 1, q: 'Gleichung I wird in Gleichung II eingesetzt. Welche Gleichung entsteht?' + sys(eqY(d.m, d.t), eqG(d.a, d.b, d.c)),
        inputs: [{ kind: 'mc', label: 'Nach dem Einsetzen', options: all.map(function (o) { return o[0]; }), answer: all.findIndex(function (o) { return o[1] === 0; }) }],
        hints: ['Ersetze in Gleichung II das <b>y</b> durch den Term aus Gleichung I.', 'Der eingesetzte Term ' + inner + ' muss in eine Klammer, weil er mit ' + n(d.b) + ' multipliziert wird.', 'Das x in Gleichung II bleibt stehen. Nur das y wird ersetzt.'],
        solution: 'Richtig ist <b>' + right + '</b>. Der Term für y kommt in Klammern, denn ' + n(d.b) + ' muss mit dem ganzen Term multipliziert werden.',
        mistakes: function (v) { var o = all[+v[0]]; if (!o) return null; if (o[1] === 1) return 'Hier fehlt die Klammer. Ohne Klammer wird nur ' + coef(d.m, 'x', true) + ' mit ' + n(d.b) + ' multipliziert, die Zahl aber nicht.'; if (o[1] === 2) return 'Hier wurde das x ersetzt. Gleichung I sagt aber, was <b>y</b> ist.'; if (o[1] === 3) return 'Achte auf das Vorzeichen der Zahl in Gleichung I. Der Term wird genau abgeschrieben.'; return null; },
        verify: function () { return holds(right, d.x, d.y) || 'Einsetzen falsch'; } };
    },
    geschickt: function () {
      for (var k = 0; k < 400; k++) {
        var C = [M.pick([2, 3, 4, -2, -3, 5]), M.pick([2, 3, 4, -2, -3, 5]), M.pick([2, 3, 4, -2, -3, 5]), M.pick([2, 3, 4, -2, -3, 5])], pos = M.rnd(0, 3);
        C[pos] = M.pick([1, -1]);
        if (C[0] * C[3] - C[1] * C[2] === 0) continue;
        var x = M.rnd(-3, 6), y = M.rnd(-3, 6), e1 = eqG(C[0], C[1], C[0] * x + C[1] * y), e2 = eqG(C[2], C[3], C[2] * x + C[3] * y);
        var opts = ['Gleichung I nach x umstellen', 'Gleichung I nach y umstellen', 'Gleichung II nach x umstellen', 'Gleichung II nach y umstellen'];
        var names = ['x in Gleichung I', 'y in Gleichung I', 'x in Gleichung II', 'y in Gleichung II'];
        return { skill: 'Geschickt umstellen', level: 2, q: 'Du möchtest das Gleichungssystem mit dem Einsetzungsverfahren lösen. Welche Umstellung ist am geschicktesten, weil dabei keine Brüche entstehen?' + sys(e1, e2),
          inputs: [{ kind: 'mc', label: 'Am geschicktesten ist …', options: opts, answer: pos }],
          hints: ['Beim Umstellen teilst du durch die Zahl vor der Variablen.', 'Steht vor einer Variablen keine Zahl (also 1) oder nur ein Minus (−1), musst du nicht teilen.', 'Suche das x oder y ohne Zahl davor.'],
          solution: 'Vor <b>' + names[pos] + '</b> steht nur ' + (C[pos] === 1 ? 'eine 1' : '−1') + '. Darum stellst du diese Gleichung nach dieser Variablen um, ohne dass Brüche entstehen. Die Lösung des Systems ist übrigens ' + pair(x, y) + '.',
          verify: function () { var ones = C.filter(function (v) { return Math.abs(v) === 1; }).length; return (ones === 1 && holds(e1, x, y) && holds(e2, x, y)) || 'nicht eindeutig'; } };
      }
    },
    alter: function () {
      var typ = M.rnd(0, 2), x, y, e1, e2, txt, nx, ny, P = M.pick([['Mia', 'Ben'], ['Elif', 'Noah'], ['Lena', 'Tim'], ['Sara', 'Jonas']]);
      if (typ === 0) { y = M.rnd(6, 16); var d = M.rnd(2, 8); x = y + d; e1 = 'x = y + ' + d; e2 = 'x + y = ' + (x + y); txt = P[0] + ' ist ' + d + ' Jahre älter als ihr Bruder ' + P[1] + '. Zusammen sind beide ' + (x + y) + ' Jahre alt.'; nx = 'Alter ' + P[0]; ny = 'Alter ' + P[1]; }
      else if (typ === 1) { y = M.rnd(5, 14); var f = M.pick([3, 4]); x = f * y; e1 = 'x = ' + f + 'y'; e2 = 'x + y = ' + (x + y); txt = 'Eine Mutter ist ' + (f === 3 ? 'dreimal' : 'viermal') + ' so alt wie ihre Tochter. Zusammen sind sie ' + (x + y) + ' Jahre alt.'; nx = 'Alter Mutter'; ny = 'Alter Tochter'; }
      else { y = M.rnd(8, 15); var g = M.pick([2, 3]), h = M.rnd(1, 6); x = g * y - h; e1 = 'x = ' + g + 'y − ' + h; e2 = 'x − y = ' + (x - y); txt = 'Ein Onkel ist ' + h + ' Jahre jünger als das ' + (g === 2 ? 'Doppelte' : 'Dreifache') + ' vom Alter seines Neffen. Der Onkel ist ' + (x - y) + ' Jahre älter als der Neffe.'; nx = 'Alter Onkel'; ny = 'Alter Neffe'; }
      var rhsI = e1.slice(4);
      return { skill: 'Sachaufgabe: Altersrätsel', level: 2, q: txt + ' Wie alt sind beide?<br><small>' + (typ === 0 ? 'x = Alter von ' + P[0] + ', y = Alter von ' + P[1] : typ === 1 ? 'x = Alter der Mutter, y = Alter der Tochter' : 'x = Alter des Onkels, y = Alter des Neffen') + '</small>',
        inputs: [{ kind: 'num', answer: x, label: nx, unit: 'Jahre' }, { kind: 'num', answer: y, label: ny, unit: 'Jahre' }],
        hints: ['Übersetze in zwei Gleichungen: I: ' + e1 + ', II: ' + e2 + '.', 'Gleichung I ist schon nach x aufgelöst. Setze (' + rhsI + ') für x in Gleichung II ein.', 'Löse die entstandene Gleichung nach y auf. y = ' + y + '.'],
        solution: 'I: ' + e1 + ', II: ' + e2 + '.<br>Einsetzen: ' + e2.replace('x', '(' + rhsI + ')') + ' ⇒ y = ' + y + '.<br>x = ' + rhsI.replace('y', ' · ' + y).replace(/^ · /, '') + ' = ' + x + '.<br><b>' + nx + ': ' + x + ' Jahre, ' + ny + ': ' + y + ' Jahre.</b>',
        mistakes: pairMis(x, y, 'das erste Alter', 'das zweite Alter'),
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
    },
    kauf: function () {
      var it = M.pick([['Heft', 'Block', 'Hefte', 'Blöcke'], ['Stift', 'Marker', 'Stifte', 'Marker'], ['Brötchen', 'Croissant', 'Brötchen', 'Croissants']]);
      var xc = M.pick([40, 50, 60, 70, 80, 90, 120]), dc = M.pick([20, 30, 40, 50, 80]), yc = xc + dc, k1 = M.rnd(2, 5), k2 = M.rnd(2, 4), tot = k1 * xc + k2 * yc;
      var X = xc / 100, Y = yc / 100, D = dc / 100, T = tot / 100;
      var e1 = 'y = x + ' + M.fmtNum(D, 2), e2 = k1 + 'x + ' + k2 + 'y = ' + M.fmtNum(T, 2);
      var k = k1 + k2, r = Math.round((T - k2 * D) * 100) / 100;
      return { skill: 'Sachaufgabe: Einkauf', level: 2, q: 'Ein ' + it[1] + ' kostet ' + M.fmtNum(D, 2) + ' € mehr als ein ' + it[0] + '. ' + k1 + ' ' + it[2] + ' und ' + k2 + ' ' + it[3] + ' kosten zusammen ' + M.fmtNum(T, 2) + ' €. Was kostet ein ' + it[0] + ', was kostet ein ' + it[1] + '?<br><small>x = Preis pro ' + it[0] + ', y = Preis pro ' + it[1] + ' (in €)</small>',
        inputs: [{ kind: 'num', answer: X, label: 'Preis ' + it[0], unit: '€', tol: 0.005 }, { kind: 'num', answer: Y, label: 'Preis ' + it[1], unit: '€', tol: 0.005 }],
        hints: ['I: ' + e1 + ' &nbsp; II: ' + e2, 'Setze I in II ein: ' + k1 + 'x + ' + k2 + '(x + ' + M.fmtNum(D, 2) + ') = ' + M.fmtNum(T, 2) + '.', 'Klammer auflösen: ' + k + 'x + ' + M.fmtNum(k2 * D, 2) + ' = ' + M.fmtNum(T, 2) + '. Also ' + k + 'x = ' + M.fmtNum(r, 2) + '.'],
        solution: 'Einsetzen: ' + k1 + 'x + ' + k2 + '(x + ' + M.fmtNum(D, 2) + ') = ' + M.fmtNum(T, 2) + '<br>' + k1 + 'x + ' + k2 + 'x + ' + M.fmtNum(k2 * D, 2) + ' = ' + M.fmtNum(T, 2) + '<br>' + k + 'x = ' + M.fmtNum(r, 2) + ' ⇒ x = ' + M.fmtNum(X, 2) + '<br>y = ' + M.fmtNum(X, 2) + ' + ' + M.fmtNum(D, 2) + ' = ' + M.fmtNum(Y, 2) + '<br><b>Ein ' + it[0] + ' kostet ' + M.fmtNum(X, 2) + ' €, ein ' + it[1] + ' kostet ' + M.fmtNum(Y, 2) + ' €.</b> Probe: ' + k1 + ' · ' + M.fmtNum(X, 2) + ' + ' + k2 + ' · ' + M.fmtNum(Y, 2) + ' = ' + M.fmtNum(T, 2) + ' ✓',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && Math.abs(a - (T - D) / k) < 0.005) return 'Hast du die Klammer vergessen? ' + k2 + '(x + ' + M.fmtNum(D, 2) + ') = ' + k2 + 'x + ' + M.fmtNum(k2 * D, 2) + '.'; if (a !== null && Math.abs(a - Y) < 0.005) return 'Das ist der Preis für ein ' + it[1] + '. Im ersten Feld ist der Preis für ein ' + it[0] + ' gesucht.'; return null; },
        verify: function () { return (holds(e1, X, Y) && Math.abs(k1 * X + k2 * Y - T) < 1e-9) || 'Probe falsch'; } };
    },
    rechteck: function () {
      var typ = M.rnd(0, 1), b = M.rnd(3, 12), a, e1, txt;
      if (typ === 0) { var d = M.rnd(2, 9); a = b + d; e1 = 'a = b + ' + d; txt = 'Ein Rechteck ist ' + d + ' cm länger als breit.'; }
      else { var h = M.rnd(1, 5); a = 2 * b - h; if (a <= b) { a = 2 * b + h; e1 = 'a = 2b + ' + h; txt = 'Die Länge eines Rechtecks ist um ' + h + ' cm größer als das Doppelte der Breite.'; } else { e1 = 'a = 2b − ' + h; txt = 'Die Länge eines Rechtecks ist um ' + h + ' cm kleiner als das Doppelte der Breite.'; } }
      var U = 2 * (a + b), A = a * b, e2 = '2a + 2b = ' + U, rI = e1.slice(4);
      var svg = '<svg class="viz" viewBox="0 0 260 130" role="img" aria-label="Rechteck mit Länge a und Breite b" style="max-width:280px"><rect x="30" y="20" width="190" height="80" fill="#e8eefc" stroke="#1e3a8a" stroke-width="2.5"/><text x="125" y="118" font-size="14" font-weight="700" text-anchor="middle" fill="#1e3a8a">a</text><text x="232" y="64" font-size="14" font-weight="700" fill="#1e3a8a">b</text><text x="125" y="64" font-size="12" text-anchor="middle" fill="#64748b">Skizze nicht maßstabsgetreu</text></svg>';
      return { skill: 'Geometrie: Rechteck', level: 3, q: txt + ' Sein Umfang beträgt ' + U + ' cm.<br>Berechne die Länge a, die Breite b und den Flächeninhalt.' + svg,
        inputs: [{ kind: 'num', answer: a, label: 'Länge a', unit: 'cm' }, { kind: 'num', answer: b, label: 'Breite b', unit: 'cm' }, { kind: 'num', answer: A, label: 'Flächeninhalt', unit: 'cm²' }],
        hints: ['Zwei Gleichungen: I: ' + e1 + ' &nbsp; II: Umfang ' + e2 + '.', 'Setze I in II ein: 2(' + rI + ') + 2b = ' + U + '.', 'Löse nach b auf (b = ' + b + '), berechne dann a mit I und den Flächeninhalt mit a · b.'],
        solution: 'I: ' + e1 + ', II: ' + e2 + '<br>Einsetzen: 2(' + rI + ') + 2b = ' + U + ' ⇒ ' + (typ === 0 ? '4b + ' + n(2 * (a - b)) : '6b' + cst(2 * (a - 2 * b))) + ' = ' + U + ' ⇒ b = ' + b + ' cm<br>a = ' + a + ' cm, Flächeninhalt A = ' + a + ' cm · ' + b + ' cm = <b>' + A + ' cm²</b>. Probe Umfang: 2 · ' + a + ' + 2 · ' + b + ' = ' + U + ' cm ✓',
        mistakes: function (v) { var p = M.parseNum(v[0]), q = M.parseNum(v[1]); if (p === b && q === a) return 'Du hast Länge und Breite vertauscht.'; if (p !== null && q !== null && p + q === U && p !== a) return 'Der Umfang ist 2a + 2b, nicht a + b. Beide Seiten kommen zweimal vor.'; return null; },
        verify: function () { var s1 = e1.replace(/a/g, 'x').replace(/b/g, 'y'); return (holds(s1, a, b) && holds('2x + 2y = ' + U, a, b) && A === a * b) || 'Probe falsch'; } };
    }
  };

  var EX = [{ m: 2, t: -1, a: 3, b: 2, c: 12 }, { m: 1, t: 3, a: 4, b: -2, c: 2 }, { m: -1, t: 6, a: 5, b: 3, c: 26 }];
  function scale(L, R, put, c) {
    var diff = L - R, ang = -Math.max(-14, Math.min(14, diff * 1.2)), th = ang * Math.PI / 180, cx = 210, cy = 70, h = 150;
    var lx = cx - h * Math.cos(th), ly = cy - h * Math.sin(th), rx = cx + h * Math.cos(th), ry = cy + h * Math.sin(th);
    function pan(x, y, txt, col) { return '<line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x - 55).toFixed(1) + '" y2="' + (y + 50).toFixed(1) + '" stroke="#64748b"/><line x1="' + x.toFixed(1) + '" y1="' + y.toFixed(1) + '" x2="' + (x + 55).toFixed(1) + '" y2="' + (y + 50).toFixed(1) + '" stroke="#64748b"/><path d="M' + (x - 62).toFixed(1) + ' ' + (y + 50).toFixed(1) + ' h124 l-12 16 h-100 z" fill="' + col + '" stroke="#1e3a8a" stroke-width="1.5"/><text x="' + x.toFixed(1) + '" y="' + (y + 44).toFixed(1) + '" font-size="15" font-weight="700" text-anchor="middle" fill="#1e3a8a">' + txt + '</text>'; }
    return '<svg class="viz" viewBox="0 0 420 210" role="img" aria-label="Waage: linke Seite und rechte Seite der Gleichung" style="max-width:460px"><path d="M210 70 L185 195 H235 Z" fill="#cfd9ef" stroke="#1e3a8a" stroke-width="1.5"/><line x1="' + lx.toFixed(1) + '" y1="' + ly.toFixed(1) + '" x2="' + rx.toFixed(1) + '" y2="' + ry.toFixed(1) + '" stroke="#1e3a8a" stroke-width="5" stroke-linecap="round"/><circle cx="210" cy="70" r="6" fill="#d97706"/>' +
      pan(lx, ly, n(L), '#e8eefc') + pan(rx, ry, n(R), '#fde7c2') + '</svg>';
  }

  return {
    id: '004', title: 'Einsetzungsverfahren', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Klammern auflösen, lineare Gleichungen lösen, Gleichsetzungsverfahren (Modul 003)',
    lead: 'Wenn eine Gleichung schon verrät, was y ist, setzt du diesen Term einfach in die andere Gleichung ein. Aus zwei Unbekannten wird eine.',
    einstieg: { html: '<p>Beim Schulfest verkauft die Klasse 9b Waffeln und Kakao. Eine Waffel kostet <b>1 € mehr</b> als ein Becher Kakao. Frau Ahrens kauft <b>3 Waffeln und 2 Becher Kakao</b> und bezahlt <b>8 €</b>.</p><p class="note">Was kostet eine Waffel, was kostet ein Becher Kakao?</p><p>Mit x für den Kakaopreis und y für den Waffelpreis gilt: <b>y = x + 1</b> und <b>3y + 2x = 8</b>. Die erste Gleichung sagt genau, was y ist. Dann kannst du in der zweiten Gleichung y durch <b>(x + 1)</b> <b>ersetzen</b>. Das ist das <b>Einsetzungsverfahren</b>.</p>' },
    ziele: ['Ich erkenne, wann das Einsetzungsverfahren geschickt ist.', 'Ich setze einen Term für eine Variable in die andere Gleichung ein und setze ihn dabei in Klammern.', 'Ich löse Klammern richtig auf, auch mit einem Minus davor.', 'Ich berechne beide Werte und mache die Probe.', 'Ich löse Sachaufgaben wie Altersrätsel und Einkäufe mit dem Einsetzungsverfahren.'],
    fachwoerter: [['Einsetzungsverfahren', 'Eine Gleichung wird nach einer Variablen aufgelöst. Der Term wird für diese Variable in die andere Gleichung eingesetzt.'], ['Koeffizient', 'Die Zahl vor einer Variablen, zum Beispiel die 3 in 3x.'], ['Klammer auflösen', 'Den Faktor vor der Klammer mit jedem Glied in der Klammer multiplizieren.'], ['Probe', 'Beide Werte in beide Ausgangsgleichungen einsetzen.']],
    diagnose: [
      { q: 'Löse die Klammer auf: −3(2x − 4)', options: ['−6x + 12', '−6x − 12', '−6x − 4', 'Weiß ich noch nicht'], answer: 0, why: '−3 · 2x = −6x und −3 · (−4) = +12.', review: 'Klammern auflösen mit Minus (Klasse 8)' },
      { q: 'Vereinfache: 2(x + 5) − x', options: ['x + 10', 'x + 5', '3x + 10', 'Weiß ich noch nicht'], answer: 0, why: '2x + 10 − x = x + 10.', review: 'Terme vereinfachen' },
      { q: 'Löse die Gleichung 4x − (x − 2) = 11.', options: ['x = 3', 'x = 4,33', 'x = 13', 'Weiß ich noch nicht'], answer: 0, why: '4x − x + 2 = 11, also 3x = 9 und x = 3.', review: 'Gleichungen mit Klammern lösen' },
      { q: 'Es gilt x = 2y − 1. Welchen Wert hat x für y = 3?', options: ['5', '6', '1', 'Weiß ich noch nicht'], answer: 0, why: 'x = 2 · 3 − 1 = 5.', review: 'Werte einsetzen' }],
    erklaerung:
      '<h3>1. Die Idee: ersetzen</h3><p>Gleichung I verrät, was y ist. Überall, wo in Gleichung II ein y steht, darfst du deshalb diesen Term schreiben. Dann kommt nur noch x vor.</p>' + sys('y = 2x − 1', '3x + 2y = 12') +
      '<p>' + sub(2, -1, 3, 2, 12, 'x', 'y', false).lines.join('<br>') + '<br><b>Probe in II:</b> 3 · 2 + 2 · 3 = 12 ✓ &nbsp; <b>L = {(2 | 3)}</b></p>' +
      '<div class="merk"><b>Merke: Einsetzungsverfahren</b><br>1. Eine Gleichung nach einer Variablen auflösen (falls nötig).<br>2. Den Term für diese Variable <b>in Klammern</b> in die andere Gleichung einsetzen.<br>3. Klammer auflösen, zusammenfassen und lösen.<br>4. Den Wert in die aufgelöste Gleichung einsetzen und die zweite Variable berechnen.<br>5. Probe machen und L = {(x | y)} angeben.</div>' +
      '<h3>2. Achtung bei Minus vor der Klammer</h3><p>' + sys('y = 2x − 1', '5x − 2y = 4') + '</p><p>' + sub(2, -1, 5, -2, 4, 'x', 'y', false).lines.slice(0, 2).join('<br>') + '</p><p>Das Minus vor der 2 dreht beide Vorzeichen in der Klammer um: −2 · 2x = −4x und −2 · (−1) = <b>+2</b>. Ohne Klammer würdest du 5x − 4x − 1 = 4 rechnen. Das ist falsch.</p>' +
      '<h3>3. Wann ist das Verfahren geschickt?</h3><ul><li>Eine Gleichung ist schon nach x oder y aufgelöst, zum Beispiel x = 3y + 2.</li><li>Vor einer Variablen steht keine Zahl (Koeffizient 1 oder −1). Dann kannst du ohne Brüche umstellen: x + 4y = 9 ⇒ x = 9 − 4y.</li></ul><p class="note">Sind beide Gleichungen nach derselben Variablen aufgelöst, ist das Gleichsetzungsverfahren aus Modul 003 noch schneller.</p>',
    entdecken: {
      html: '<p>Wähle ein System. Nach dem Einsetzen bleibt eine Gleichung mit nur x übrig. Die Waage zeigt links den Wert der linken Seite und rechts die Zahl. Finde das x, bei dem die Waage im Gleichgewicht ist.</p><div class="ctl"><label>System <select id="e_s">' + EX.map(function (e, i) { return '<option value="' + i + '">I: ' + eqY(e.m, e.t) + ' &nbsp; II: ' + eqG(e.a, e.b, e.c) + '</option>'; }).join('') + '</select></label><label>x = <b id="v_x"></b> <input type="range" id="r_x" min="-3" max="7" step="1" value="0"></label></div><p class="big-math" id="e_eq"></p><div id="e_g"></div><div id="e_txt"></div><div class="actions"><button class="btn ghost" id="e_b" type="button">Lösungsweg zeigen</button></div><div id="e_sol"></div>',
      init: function (root, done) {
        var cnt = 0, showSol = false;
        function draw() {
          var E = EX[+root.querySelector('#e_s').value], x = +root.querySelector('#r_x').value, S = sub(E.m, E.t, E.a, E.b, E.c, 'x', 'y', false);
          var L = E.a * x + E.b * (E.m * x + E.t);
          root.querySelector('#v_x').textContent = n(x);
          root.querySelector('#e_eq').innerHTML = S.put + ' = ' + n(E.c);
          root.querySelector('#e_g').innerHTML = scale(L, E.c);
          var y = E.m * x + E.t;
          root.querySelector('#e_txt').innerHTML = '<p>Für x = ' + n(x) + ': y = ' + calcY(E.m, E.t, x) + '. Linke Seite: ' + subst(E.a, E.b, x, y) + '.</p>' + (L === E.c ? '<p class="fb good"><b>Gleichgewicht!</b> Für x = ' + n(x) + ' und y = ' + n(y) + ' stimmen beide Gleichungen. L = {(' + n(x) + ' | ' + n(y) + ')}</p>' : '<p class="fb">Noch kein Gleichgewicht: ' + n(L) + (L > E.c ? ' > ' : ' < ') + n(E.c) + '.</p>');
          root.querySelector('#e_sol').innerHTML = showSol ? '<p>' + S.lines.join('<br>') + '</p>' : '';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut gemacht: Durch das Einsetzen verschwindet y. Es bleibt eine Gleichung mit nur x. Statt zu probieren, löst du sie direkt, wie im Lösungsweg.'); }
        root.querySelector('#r_x').addEventListener('input', hit);
        root.querySelector('#e_s').addEventListener('change', hit);
        root.querySelector('#e_b').addEventListener('click', function () { showSol = !showSol; this.textContent = showSol ? 'Lösungsweg ausblenden' : 'Lösungsweg zeigen'; hit(); });
        draw();
      }
    },
    beispiel: { title: 'Waffeln und Kakao', q: 'Eine Waffel kostet 1 € mehr als ein Becher Kakao. 3 Waffeln und 2 Becher Kakao kosten 8 €. Was kostet eine Waffel, was ein Becher Kakao?',
      steps: ['Variablen: x = Preis für einen Becher Kakao, y = Preis für eine Waffel (in €).' + sys('y = x + 1', '2x + 3y = 8'), 'Einsetzen von I in II: 2x + 3(x + 1) = 8', 'Klammer auflösen und zusammenfassen: 2x + 3x + 3 = 8 ⇒ 5x + 3 = 8 &nbsp;|&nbsp; − 3 ⇒ 5x = 5 ⇒ x = 1', 'Einsetzen in I: y = 1 + 1 = 2. Probe in II: 2 · 1 + 3 · 2 = 8 ✓', 'Antwort: Ein Becher Kakao kostet <b>1 €</b>, eine Waffel <b>2 €</b>. L = {(1 | 2)}.'] },
    tasks: { gen: gen, plan: { G: ['schritt:1', 'y_einsetzen:1', 'y_einsetzen:2', 'alter:2'], S: ['y_einsetzen:2', 'x_einsetzen:2', 'klammer:2', 'geschickt:2', 'alter:2'], E: ['x_einsetzen:2', 'klammer:3', 'erst_umstellen:3', 'geschickt:2', 'kauf:2', 'alter:2'] },
      extra: 'rechteck', test: ['schritt:1', 'y_einsetzen:2', 'x_einsetzen:2', 'klammer:2', 'alter:2', 'kauf:2'] },
    lerncheck: ['Ich löse ein Gleichungssystem mit dem Einsetzungsverfahren.', 'Ich setze eingesetzte Terme in Klammern und löse sie richtig auf.', 'Ich erkenne, welche Gleichung ich am besten nach welcher Variablen umstelle.', 'Ich löse Sachaufgaben mit dem Einsetzungsverfahren.']
  };
})();
