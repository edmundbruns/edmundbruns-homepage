/* Modul 028 · Baumdiagramme */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml, fmt = M.fmtNum;
  function frac(n, d) { return fh(F(n, d), true); }
  function f1(x) { return Math.round(x * 10) / 10; }
  /* Farben und Kurzzeichen der Ergebnisse */
  var COL = { r: ['rot', '#dc2626', '#fff'], b: ['blau', '#2563eb', '#fff'], g: ['grün', '#16a34a', '#fff'], y: ['gelb', '#facc15', '#1c1830'] };
  var NAME = { K: 'Kopf', Z: 'Zahl', r: 'rot', b: 'blau', g: 'grün', y: 'gelb' };
  function nodeStyle(k) { return COL[k] ? { fill: COL[k][1], txt: COL[k][2] } : { fill: '#efeafb', txt: '#1c1830' }; }

  /* ---------- Zufallsexperiment aus gleich wahrscheinlichen „Einheiten“ ---------- */
  /* u1, u2: Listen von Kurzzeichen (jede Einheit gleich wahrscheinlich); ohne: ohne Zurücklegen (u2 = u1 minus gezogene Einheit) */
  function exp2(u1, u2, ohne) { return { u1: u1, u2: u2 || u1, ohne: !!ohne }; }
  function keysOf(u) { var k = []; u.forEach(function (x) { if (k.indexOf(x) < 0) k.push(x); }); return k; }
  function cnt(u, k) { return u.filter(function (x) { return x === k; }).length; }
  /* Baum mit ungekürzten Brüchen (Anzahl / Gesamt) */
  function treeOf(E) {
    var k1 = keysOf(E.u1), s1 = k1.map(function (a) { return { k: a, p: F(cnt(E.u1, a), E.u1.length) }; });
    var s2 = k1.map(function (a) {
      var u = E.u2.slice(); if (E.ohne) u.splice(u.indexOf(a), 1);
      return keysOf(E.u2).filter(function (b) { return cnt(u, b) > 0; }).map(function (b) { return { k: b, p: F(cnt(u, b), u.length) }; });
    });
    return { s1: s1, s2: s2 };
  }
  /* Brute Force: Wahrscheinlichkeit eines Ereignisses durch Abzählen aller Einheiten-Paare */
  function brute(E, pred) {
    var fav = 0, tot = 0;
    E.u1.forEach(function (a, i) { E.u2.forEach(function (b, j) { if (E.ohne && i === j) return; tot++; if (pred(a, b)) fav++; }); });
    return M.red(F(fav, tot));
  }
  function units(spec) { var u = []; Object.keys(spec).forEach(function (k) { for (var i = 0; i < spec[k]; i++) u.push(k); }); return u; }

  /* ---------- Zeichnungen ---------- */
  function plab(x, y, p) {
    if (p == null) return '';
    if (typeof p === 'string' || p.d === 1) {
      var s = typeof p === 'string' ? p : String(p.n), w = s.length * 8 + 10;
      return '<rect x="' + f1(x - w / 2) + '" y="' + (y - 11) + '" width="' + w + '" height="22" rx="4" fill="#fff"/><text x="' + x + '" y="' + (y + 5) + '" font-size="14" font-weight="700" text-anchor="middle" fill="' + (s === '?' ? '#b91c1c' : '#1c1830') + '">' + s + '</text>';
    }
    var wf = Math.max(String(p.n).length, String(p.d).length) * 8 + 10;
    return '<rect x="' + f1(x - wf / 2) + '" y="' + (y - 15) + '" width="' + wf + '" height="30" rx="4" fill="#fff"/><text x="' + x + '" y="' + (y - 4) + '" font-size="13" font-weight="700" text-anchor="middle">' + p.n + '</text><line x1="' + f1(x - wf / 2 + 3) + '" y1="' + y + '" x2="' + f1(x + wf / 2 - 3) + '" y2="' + y + '" stroke="#1c1830" stroke-width="1.3"/><text x="' + x + '" y="' + (y + 14) + '" font-size="13" font-weight="700" text-anchor="middle">' + p.d + '</text>';
  }
  function disp(k) { return k === 'y' ? 'ge' : k; }
  function resTxt(a, b) { return /\d/.test(a + b) && !/[KZ]/.test(a + b) ? '(' + a + '|' + b + ')' : disp(a) + disp(b); }
  function nodeSvg(x, y, k) { var st = nodeStyle(k), d = disp(k); return '<circle cx="' + x + '" cy="' + y + '" r="13" fill="' + st.fill + '" stroke="#3d2a73" stroke-width="1.5"/><text x="' + x + '" y="' + (y + (d.length > 1 ? 4 : 5)) + '" font-size="' + (d.length > 1 ? 12 : 14) + '" font-weight="700" text-anchor="middle" fill="' + st.txt + '">' + d + '</text>'; }
  /* T = {s1:[{k,p}], s2:[[{k,p}]]}; o: {res: true, pp: Liste je Blatt, hl: Liste der Blattnummern, p1/p2: eigene Beschriftungen, noP: ohne Wahrscheinlichkeiten} */
  function tree(T, o) {
    o = o || {};
    var leaves = []; T.s2.forEach(function (row, i) { row.forEach(function (b, j) { leaves.push([i, j]); }); });
    var maxK = Math.max.apply(null, T.s2.map(function (r) { return r.length; }));
    var L = maxK >= 3 ? 56 : 54, pad = 14, H = leaves.length * L + 2 * pad;
    var X0 = 18, X1 = 138, X2 = 258, W = o.pp ? 380 : o.res ? 330 : 284;
    var ly = leaves.map(function (l, n) { return pad + L / 2 + n * L; });
    var y1 = T.s1.map(function (a, i) { var ys = ly.filter(function (y, n) { return leaves[n][0] === i; }); return (ys[0] + ys[ys.length - 1]) / 2; });
    var y0 = (y1[0] + y1[y1.length - 1]) / 2, hl = o.hl || [];
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Baumdiagramm') + '" style="max-width:' + Math.round(W * 1.2) + 'px">', labs = '', nodes = '';
    function edge(xa, ya, xb, yb, on) { return '<line x1="' + xa + '" y1="' + f1(ya) + '" x2="' + xb + '" y2="' + f1(yb) + '" stroke="' + (on ? '#d97706' : '#3d2a73') + '" stroke-width="' + (on ? 4 : 2) + '"/>'; }
    T.s1.forEach(function (a, i) {
      var on = hl.some(function (n) { return leaves[n][0] === i; });
      g += edge(X0, y0, X1, y1[i], on);
      if (!o.noP) labs += plab(f1(X0 + 0.5 * (X1 - X0)), f1(y0 + 0.5 * (y1[i] - y0)), o.p1 && o.p1[i] !== undefined ? o.p1[i] : a.p);
      nodes += nodeSvg(X1, f1(y1[i]), a.k);
    });
    var t = maxK >= 3 ? 0.66 : 0.64;
    leaves.forEach(function (l, n) {
      var b = T.s2[l[0]][l[1]], on = hl.indexOf(n) >= 0;
      g += edge(X1, y1[l[0]], X2, ly[n], on);
      if (!o.noP) labs += plab(f1(X1 + t * (X2 - X1)), f1(y1[l[0]] + t * (ly[n] - y1[l[0]])), o.p2 && o.p2[n] !== undefined ? o.p2[n] : b.p);
      nodes += nodeSvg(X2, f1(ly[n]), b.k);
      if (o.res) nodes += '<text x="' + (X2 + 22) + '" y="' + f1(ly[n] + 5) + '" font-size="14" font-weight="' + (on ? 700 : 400) + '" fill="' + (on ? '#b45309' : '#1c1830') + '">' + resTxt(T.s1[l[0]].k, b.k) + '</text>';
      if (o.pp && o.pp[n] != null) nodes += plab(352, f1(ly[n]), o.pp[n]);
    });
    g += '<circle cx="' + X0 + '" cy="' + f1(y0) + '" r="5" fill="#3d2a73"/>';
    return g + labs + nodes + '</svg>';
  }
  function pt(cx, cy, r, deg) { var a = (deg - 90) * Math.PI / 180; return [f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a))]; }
  /* Glücksrad maßstabsgetreu: sec = [[key, winkel], …] */
  function wheel(sec, o) {
    o = o || {}; var cx = 120, cy = 124, R = 96, a0 = 0, g = '<svg class="viz" viewBox="0 0 240 232" role="img" aria-label="Glücksrad" style="max-width:250px">', labs = '';
    sec.forEach(function (s) {
      var a1 = a0 + s[1], p0 = pt(cx, cy, R, a0), p1 = pt(cx, cy, R, a1), c = COL[s[0]] || ['', '#efeafb', '#1c1830'];
      g += '<path d="M' + cx + ' ' + cy + ' L' + p0[0] + ' ' + p0[1] + ' A' + R + ' ' + R + ' 0 ' + (s[1] > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1] + ' Z" fill="' + c[1] + '" stroke="#fff" stroke-width="2"/>';
      var q = pt(cx, cy, R * 0.6, a0 + s[1] / 2);
      labs += '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" font-size="14" font-weight="700" text-anchor="middle" fill="' + c[2] + '">' + (o.noAngles ? s[0] : s[1] + '°') + '</text>';
      a0 = a1;
    });
    return g + '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#3d2a73" stroke-width="2"/>' + labs + '<circle cx="' + cx + '" cy="' + cy + '" r="6" fill="#3d2a73"/><path d="M' + (cx - 9) + ' 8 L' + (cx + 9) + ' 8 L' + cx + ' 30 Z" fill="#1c1830"/></svg>';
  }
  /* Urne mit Kugeln */
  function urn(spec) {
    var u = units(spec), n = u.length, per = Math.min(n, 6), rows = Math.ceil(n / per), W = 40 + per * 30, H = 30 + rows * 30;
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Urne mit Kugeln" style="max-width:' + Math.round(W * 1.15) + 'px"><path d="M8 6 L8 ' + (H - 10) + ' Q8 ' + (H - 4) + ' 16 ' + (H - 4) + ' L' + (W - 16) + ' ' + (H - 4) + ' Q' + (W - 8) + ' ' + (H - 4) + ' ' + (W - 8) + ' ' + (H - 10) + ' L' + (W - 8) + ' 6" fill="#efeafb" stroke="#3d2a73" stroke-width="2"/>';
    u.forEach(function (k, i) { var x = 35 + (i % per) * 30, y = H - 22 - Math.floor(i / per) * 30; g += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="' + COL[k][1] + '" stroke="#1c1830" stroke-width="1"/>'; });
    return g + '</svg>';
  }
  function urnTxt(spec) { var ks = Object.keys(spec), parts = ks.map(function (k) { return spec[k] + ' ' + COL[k][0] + 'e (' + k + ')'; }); return 'In einer Urne liegen ' + units(spec).length + ' Kugeln: ' + parts.slice(0, -1).join(', ') + ' und ' + parts[parts.length - 1] + '.'; }
  function brute1(u, pred) { return M.red(F(u.filter(pred).length, u.length)); }
  function fracIn(f, label, reduce) { return { kind: 'frac', answer: M.red(f), reduce: !!reduce, label: label, placeholder: 'z. B. 2/5' }; }

  /* ---------- Laplace-Experimente für Ereignisse ---------- */
  var LAP = [
    { lv: 2, txt: 'Du wirfst zweimal eine Münze (K = Kopf, Z = Zahl).', E: exp2(['K', 'Z']), ev: [
      ['mindestens einmal Kopf', function (a, b) { return a === 'K' || b === 'K'; }], ['genau einmal Kopf', function (a, b) { return (a === 'K') !== (b === 'K'); }],
      ['zweimal dasselbe', function (a, b) { return a === b; }], ['keinmal Kopf', function (a, b) { return a !== 'K' && b !== 'K'; }]] },
    { lv: 2, txt: 'Ein Glücksrad hat drei gleich große Felder: rot (r), blau (b) und grün (g). Es wird zweimal gedreht.', E: exp2(['r', 'b', 'g']), ev: [
      ['zweimal dieselbe Farbe', function (a, b) { return a === b; }], ['mindestens einmal rot', function (a, b) { return a === 'r' || b === 'r'; }], ['keinmal blau', function (a, b) { return a !== 'b' && b !== 'b'; }],
      ['genau einmal grün', function (a, b) { return (a === 'g') !== (b === 'g'); }], ['zwei verschiedene Farben', function (a, b) { return a !== b; }]] },
    { lv: 2, txt: 'Du wirfst eine Münze (K oder Z) und drehst danach ein Glücksrad mit drei gleich großen Feldern 1, 2 und 3.', E: exp2(['K', 'Z'], ['1', '2', '3']), ev: [
      ['K und eine ungerade Zahl auf dem Glücksrad', function (a, b) { return a === 'K' && +b % 2 === 1; }], ['Z und eine 2 oder 3 auf dem Glücksrad', function (a, b) { return a === 'Z' && +b > 1; }], ['eine 3 auf dem Glücksrad (egal ob K oder Z)', function (a, b) { return b === '3'; }]] },
    { lv: 3, txt: 'Ein Glücksrad hat drei gleich große Felder mit den Zahlen 1, 2 und 3. Es wird zweimal gedreht. Die beiden Zahlen werden addiert.', E: exp2(['1', '2', '3']), ev: [
      ['Augensumme 4', function (a, b) { return +a + +b === 4; }], ['Summe größer als 4', function (a, b) { return +a + +b > 4; }], ['Summe gerade', function (a, b) { return (+a + +b) % 2 === 0; }],
      ['Summe 3', function (a, b) { return +a + +b === 3; }], ['die erste Zahl ist größer als die zweite', function (a, b) { return +a > +b; }]] }];

  var gen = {
    anzahl: function (lvl) {
      var X = [['eine Münze', 2, ['K', 'Z']], ['einen Spielwürfel', 6], ['ein Glücksrad mit 3 gleich großen Feldern', 3, ['1', '2', '3']], ['ein Glücksrad mit 4 gleich großen Feldern', 4], ['einen Tetraeder-Würfel mit 4 Flächen', 4], ['ein Glücksrad mit 5 Feldern', 5]];
      if (lvl === 3) {
        var ic = M.pick([[['Eissorten', M.rnd(4, 8)], ['Becher oder Waffel', 2], ['mit oder ohne Sahne', 2]], [['Hauptgerichte', M.rnd(3, 5)], ['Getränke', M.rnd(2, 4)], ['Nachtische', M.rnd(2, 3)]], [['T-Shirts', M.rnd(3, 6)], ['Hosen', M.rnd(2, 4)], ['Paar Schuhe', 2]]]);
        var tot = ic[0][1] * ic[1][1] * ic[2][1];
        return { skill: 'Anzahl der Ergebnisse bestimmen', q: (ic[0][0] === 'Eissorten' ? 'In der Eisdiele kannst du aus ' + ic[0][1] + ' Eissorten eine Kugel wählen. Dann wählst du Becher oder Waffel und zum Schluss mit oder ohne Sahne.' : ic[0][0] === 'Hauptgerichte' ? 'In der Mensa gibt es ein Menü: ' + ic[0][1] + ' Hauptgerichte, ' + ic[1][1] + ' Getränke und ' + ic[2][1] + ' Nachtische. Du wählst von jedem genau eins.' : 'Für die Klassenfahrt packst du ' + ic[0][1] + ' T-Shirts, ' + ic[1][1] + ' Hosen und 2 Paar Schuhe ein. Jeden Tag ziehst du von jedem eins an.') + ' Wie viele verschiedene Möglichkeiten gibt es?', inputs: [{ kind: 'num', answer: tot, label: 'Anzahl' }],
          hints: ['Stell dir ein Baumdiagramm mit drei Stufen vor.', 'In der ersten Stufe gibt es ' + ic[0][1] + ' Äste. An jedem Ende gehen ' + ic[1][1] + ' Äste weiter, danach jeweils ' + ic[2][1] + '.', 'Multipliziere: ' + ic[0][1] + ' · ' + ic[1][1] + ' · ' + ic[2][1] + '.'],
          solution: 'Jede Stufe vervielfacht die Anzahl der Pfade: ' + ic[0][1] + ' · ' + ic[1][1] + ' · ' + ic[2][1] + ' = ' + tot + ' Möglichkeiten.',
          mistakes: function (v) { if (+M.parseNum(v[0]) === ic[0][1] + ic[1][1] + ic[2][1]) return 'Du hast addiert. Zu <b>jeder</b> Wahl in der ersten Stufe gehören alle Möglichkeiten der nächsten Stufe. Deshalb wird multipliziert.'; return null; },
          verify: function () { var c = 0; for (var i = 0; i < ic[0][1]; i++) for (var j = 0; j < ic[1][1]; j++) for (var k = 0; k < ic[2][1]; k++) c++; return c === tot ? true : 'Zählung'; } };
      }
      var a, b;
      if (lvl === 1) { a = M.pick([X[0], X[2]]); b = M.pick([X[0], X[2]]); }
      else { a = M.pick(X); b = M.pick(X); }
      var n = a[1] * b[1], same = a[0] === b[0];
      var txt = same ? 'Du ' + (a[0].indexOf('Glücksrad') >= 0 ? 'drehst ' + a[0] + ' zweimal.' : 'wirfst ' + a[0] + ' zweimal.') : 'Du ' + (a[0].indexOf('Glücksrad') >= 0 ? 'drehst ' : 'wirfst ') + a[0] + ' und ' + (b[0].indexOf('Glücksrad') >= 0 ? 'drehst danach ' : 'wirfst danach ') + b[0] + '.';
      var pic = '';
      if (lvl === 1) { var E = exp2(a[2], b[2]); pic = tree(treeOf(E), { noP: true, res: true }) ; }
      return { skill: 'Anzahl der Ergebnisse bestimmen', q: txt + (lvl === 1 ? ' Das Baumdiagramm zeigt alle Möglichkeiten.' + pic : '') + ' Wie viele verschiedene Ergebnisse gibt es insgesamt?', inputs: [{ kind: 'num', answer: n, label: 'Anzahl der Ergebnisse' }],
        hints: ['Jedes Ergebnis ist ein Pfad im Baumdiagramm vom Start bis ganz rechts.', 'In der ersten Stufe gibt es ' + a[1] + ' Äste. An jedem Ende gehen ' + b[1] + ' Äste weiter.', 'Rechne ' + a[1] + ' · ' + b[1] + '.'],
        solution: a[1] + ' · ' + b[1] + ' = ' + n + ' Ergebnisse (Pfade).',
        mistakes: function (v) { if (M.parseNum(v[0]) === a[1] + b[1] && a[1] + b[1] !== n) return 'Du hast addiert. An <b>jedem</b> der ' + a[1] + ' Äste der ersten Stufe hängen ' + b[1] + ' weitere Äste. Deshalb wird multipliziert.'; return null; },
        verify: function () { var c = 0; for (var i = 0; i < a[1]; i++) for (var j = 0; j < b[1]; j++) c++; return c === n ? true : 'Zählung'; } };
    },
    laplace: function () {
      var lap = ['Eine Münze werfen und Kopf oder Zahl notieren', 'Einen normalen Spielwürfel werfen', 'Ein Glücksrad mit vier gleich großen Feldern drehen', 'Aus einer Urne mit einer roten, einer blauen und einer grünen Kugel eine Kugel ziehen', 'Aus einem gut gemischten Stapel mit 10 verschiedenen Karten eine Karte ziehen'];
      var non = ['Eine Reißzwecke werfen und notieren, ob die Spitze nach oben zeigt', 'Ein Glücksrad mit einem 180°-Feld und zwei 90°-Feldern drehen', 'Einen Legostein werfen und notieren, auf welcher Seite er liegt', 'Aus einer Urne mit 3 roten und 1 blauen Kugel ziehen und die Farbe notieren', 'Zwei Würfel werfen und die Augensumme notieren', 'Eine Streichholzschachtel werfen und notieren, auf welcher Fläche sie liegt'];
      var askLap = Math.random() < 0.5, right = askLap ? M.pick(lap) : M.pick(non), others = M.shuffle(askLap ? non : lap).slice(0, 3), opts = M.shuffle([right].concat(others));
      return { skill: 'Laplace-Experimente erkennen', level: 1, q: askLap ? 'Welches Zufallsexperiment ist ein <b>Laplace-Experiment</b>?' : 'Welches Zufallsexperiment ist <b>kein</b> Laplace-Experiment?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(right) }],
        hints: ['Bei einem Laplace-Experiment sind alle Ergebnisse <b>gleich wahrscheinlich</b>.', 'Frage dich bei jedem Experiment: Hat jedes Ergebnis dieselbe Chance? Sind Felder unterschiedlich groß oder ist ein Gegenstand ungleichmäßig geformt?', 'Bei der Augensumme zweier Würfel kommt 7 öfter vor als 2. Bei 3 roten und 1 blauen Kugel ist Rot wahrscheinlicher.'],
        solution: askLap ? '„' + right + '“ ist ein Laplace-Experiment: Alle Ergebnisse haben dieselbe Wahrscheinlichkeit.' : '„' + right + '“ ist kein Laplace-Experiment: Die Ergebnisse sind nicht alle gleich wahrscheinlich.' };
    },
    radAst: function (lvl) {
      var S = M.pick([[['r', 180], ['b', 120], ['y', 60]], [['r', 90], ['b', 120], ['g', 150]], [['b', 240], ['r', 60], ['y', 60]], [['g', 180], ['r', 90], ['b', 90]], [['r', 150], ['y', 150], ['b', 60]], [['b', 200], ['r', 100], ['g', 60]], [['r', 216], ['b', 144]], [['g', 270], ['r', 90]], [['y', 135], ['b', 225]]]);
      var ps = S.map(function (s) { return M.red(F(s[1], 360)); }), ask = lvl === 1 ? [M.rnd(0, S.length - 1)] : M.shuffle(S.map(function (s, i) { return i; })).slice(0, 2).sort();
      var T = { s1: S.map(function (s, i) { return { k: s[0], p: ps[i] }; }) }; T.s2 = S.map(function () { return T.s1.map(function (x) { return { k: x.k, p: x.p }; }); });
      var p1 = S.map(function (s, i) { return ask.indexOf(i) >= 0 ? '?' : undefined; });
      var p2 = []; S.forEach(function () { S.forEach(function (s, j) { p2.push(ask.indexOf(j) >= 0 ? '?' : undefined); }); });
      return { skill: 'Wahrscheinlichkeiten am Glücksrad', q: 'Das Glücksrad wird <b>zweimal</b> gedreht. Die Felder sind unterschiedlich groß.' + wheel(S) + 'Welche Wahrscheinlichkeiten gehören an die Äste ' + ask.map(function (i) { return '„' + COL[S[i][0]][0] + '“'; }).join(' und ') + '? Gib sie als gekürzte Brüche an.' + (lvl >= 2 ? tree(T, { p1: p1, p2: p2 }) : ''),
        inputs: ask.map(function (i) { return fracIn(ps[i], 'P(' + COL[S[i][0]][0] + ')', true); }),
        hints: ['Die Wahrscheinlichkeit ist der Anteil des Feldes am ganzen Kreis: Winkel : 360°.', 'Für ' + COL[S[ask[0]][0]][0] + ': ' + frac(S[ask[0]][1], 360) + '.', 'Kürze vollständig. Beim zweiten Drehen ändern sich die Wahrscheinlichkeiten nicht.'],
        solution: ask.map(function (i) { return 'P(' + COL[S[i][0]][0] + ') = ' + frac(S[i][1], 360) + ' = ' + fh(ps[i]); }).join(', ') + '. Kein Laplace-Experiment, denn die Felder sind verschieden groß.' + tree(T),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, F(1, S.length))) return 'Die Felder sind nicht gleich groß. Deshalb ist nicht jede Farbe gleich wahrscheinlich. Rechne Winkel : 360°.'; return null; },
        verify: function () { var u = []; S.forEach(function (s) { for (var k = 0; k < s[1]; k++) u.push(s[0]); }); return ask.every(function (i) { return M.feq(brute1(u, function (a) { return a === S[i][0]; }), ps[i]); }) && S.reduce(function (a, s) { return a + s[1]; }, 0) === 360 ? true : 'Wahrscheinlichkeit falsch'; } };
    },
    ast: function (lvl) {
      var useDec = lvl === 2 && Math.random() < 0.4, T, desc, E = null;
      if (useDec) {
        var obj = M.pick([['Eine Reißzwecke', 'O', 'S', 'mit der Spitze nach oben (O)', 'auf der Seite (S)'], ['Ein Kronkorken', 'O', 'U', 'mit der Öffnung nach oben (O)', 'mit der Öffnung nach unten (U)'], ['Ein Legostein', 'S', 'F', 'auf der Seite (S)', 'flach (F)']]);
        var pa = M.pick([0.2, 0.3, 0.35, 0.4, 0.45, 0.55, 0.6, 0.65, 0.7, 0.8]), pb = Math.round((1 - pa) * 100) / 100;
        var miss = M.rnd(0, 1), stage = M.rnd(1, 2), node = M.rnd(0, 1);
        var Td = { s1: [{ k: obj[1], p: fmt(pa) }, { k: obj[2], p: fmt(pb) }] }; Td.s2 = [0, 1].map(function () { return [{ k: obj[1], p: fmt(pa) }, { k: obj[2], p: fmt(pb) }]; });
        if (stage === 1) Td.s1[miss].p = '?'; else Td.s2[node][miss].p = '?';
        var ans = miss ? pb : pa, giv = miss ? pa : pb;
        return { skill: 'Fehlende Astwahrscheinlichkeit', q: obj[0] + ' wird zweimal geworfen. Er landet ' + obj[3] + ' oder ' + obj[4] + '. Die Wahrscheinlichkeiten wurden durch viele Versuche geschätzt. Ergänze die fehlende Wahrscheinlichkeit als Dezimalzahl.' + tree(Td),
          inputs: [{ kind: 'num', answer: ans, label: '? =' }],
          hints: ['An jeder Verzweigung ergeben die Wahrscheinlichkeiten zusammen 1.', 'Am Verzweigungspunkt steht schon ' + fmt(giv) + '.', 'Rechne 1 − ' + fmt(giv) + '.'],
          solution: '1 − ' + fmt(giv) + ' = ' + fmt(ans) + '.',
          mistakes: function (v) { if (M.parseNum(v[0]) === giv && giv !== ans) return 'Das ist die Wahrscheinlichkeit des anderen Astes. Beide zusammen müssen 1 ergeben.'; return null; },
          verify: function () { return Math.abs(ans + giv - 1) < 1e-9 ? true : 'Summe ≠ 1'; } };
      }
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 3, g: 1 }, { r: 4, b: 1 }, { r: 1, b: 2, g: 3 }, { r: 3, b: 4 }, { r: 2, b: 2, g: 1 }, { r: 5, b: 3 }]);
      E = exp2(units(spec)); T = treeOf(E);
      var spots = [];
      T.s1.forEach(function (a, i) { if (lvl === 1 || lvl === 3) spots.push([1, i]); });
      if (lvl === 2) T.s2.forEach(function (row, i) { row.forEach(function (b, j) { spots.push([2, i, j]); }); });
      var sp = M.pick(spots), p1 = [], p2 = [], n = 0;
      if (sp[0] === 1) p1[sp[1]] = '?';
      T.s2.forEach(function (row, i) { row.forEach(function (b, j) { if (sp[0] === 2 && sp[1] === i && sp[2] === j) p2[n] = '?'; n++; }); });
      var target = sp[0] === 1 ? T.s1[sp[1]] : T.s2[sp[1]][sp[2]], sibs = sp[0] === 1 ? T.s1 : T.s2[sp[1]];
      var rest = sibs.filter(function (x) { return x !== target; }), giv = rest.reduce(function (s, x) { return M.fadd(s, x.p); }, F(0));
      var extra = [];
      if (lvl === 3) { /* zweite Lücke in Stufe 2 */
        var i2 = sp[0] === 1 ? (sp[1] + 1) % T.s1.length : 0, j2 = M.rnd(0, T.s2[i2].length - 1), m = 0;
        T.s2.forEach(function (row, i) { row.forEach(function (b, j) { if (i === i2 && j === j2) { p2[m] = '?'; extra = [T.s2[i][j], i, j]; } m++; }); });
      }
      var inputs = [fracIn(target.p, (lvl === 3 ? 'Stufe 1, Ast ' + COL[target.k][0] : 'Ast „' + COL[target.k][0] + '“'))];
      if (lvl === 3) inputs.push(fracIn(extra[0].p, 'Stufe 2, nach ' + COL[T.s1[extra[1]].k][0] + ', Ast ' + COL[extra[0].k][0]));
      return { skill: 'Fehlende Astwahrscheinlichkeit', q: urnTxt(spec) + ' Es wird zweimal eine Kugel gezogen. Nach dem ersten Zug wird sie <b>wieder zurückgelegt</b>.' + urn(spec) + 'Im Baumdiagramm ' + (lvl === 3 ? 'fehlen zwei Wahrscheinlichkeiten' : 'fehlt eine Wahrscheinlichkeit') + '. Ergänze ' + (lvl === 3 ? 'sie' : 'sie') + '.' + tree(T, { p1: p1, p2: p2 }),
        inputs: inputs,
        hints: ['An jeder Verzweigung ergeben alle Wahrscheinlichkeiten zusammen 1.', 'Du kannst rechnen: 1 − ' + rest.map(function (x) { return fh(x.p, true); }).join(' − ') + '. Oder du zählst die Kugeln: ' + cnt(E.u1, target.k) + ' von ' + E.u1.length + ' sind ' + COL[target.k][0] + '.', 'Mit Zurücklegen ist die Urne beim zweiten Zug wieder genauso gefüllt. Die Wahrscheinlichkeiten in Stufe 2 sind dieselben wie in Stufe 1.'],
        solution: '1 − ' + fh(giv) + ' = ' + fh(target.p, true) + (lvl === 3 ? '. Zweite Lücke: ' + fh(extra[0].p, true) + ', denn mit Zurücklegen ändert sich nichts.' : '.') + tree(T),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, giv) && !M.feq(giv, target.p)) return 'Du hast die Summe der anderen Äste eingetragen. Gesucht ist, was bis 1 noch fehlt.'; return null; },
        verify: function () { var ok = M.feq(M.fadd(giv, target.p), F(1)) && M.feq(brute(E, function (a) { return a === target.k; }), target.p); return ok ? true : 'Summe ≠ 1'; } };
    },
    urneMit: function (lvl) {
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 5 }, { r: 4, b: 3 }, { r: 1, b: 3 }, { r: 3, b: 5 }, { r: 2, b: 3, g: 1 }]), E = exp2(units(spec)), T = treeOf(E), n = E.u1.length;
      var i = M.rnd(0, T.s1.length - 1), p2 = [], m = 0;
      T.s2.forEach(function (row, a) { row.forEach(function (b) { p2.push(a === i ? '?' : undefined); m++; }); });
      var row = T.s2[i];
      return { skill: 'Ziehen mit Zurücklegen', q: urnTxt(spec) + ' Du ziehst eine Kugel, notierst die Farbe und <b>legst sie zurück</b>. Dann ziehst du noch einmal.' + urn(spec) + 'Welche Wahrscheinlichkeiten stehen an den Ästen der zweiten Stufe nach „' + COL[T.s1[i].k][0] + '“?' + tree(T, { p2: p2 }),
        inputs: row.map(function (b) { return fracIn(b.p, 'Ast „' + COL[b.k][0] + '“'); }),
        hints: ['Die gezogene Kugel kommt zurück in die Urne. Beim zweiten Zug liegen wieder ' + n + ' Kugeln darin.', 'Die Wahrscheinlichkeiten sind also dieselben wie in der ersten Stufe.', row.map(function (b) { return COL[b.k][0] + ': ' + frac(cnt(E.u1, b.k), n); }).join(', ') + '.'],
        solution: 'Mit Zurücklegen: ' + row.map(function (b) { return COL[b.k][0] + ' ' + fh(b.p, true); }).join(', ') + '.' + tree(T),
        mistakes: function (v) { var f = M.parseFrac(v[0]), k0 = row[0].k, wrong = F(cnt(E.u1, k0) - (k0 === T.s1[i].k ? 1 : 0), n - 1); if (f && M.feq(f, wrong) && !M.feq(wrong, row[0].p)) return 'Du hast gerechnet, als ob die Kugel <b>nicht</b> zurückgelegt wird. Hier wird sie zurückgelegt.'; return null; },
        verify: function () { return row.every(function (b) { return M.feq(brute(E, function (x, y) { return y === b.k; }), b.p); }) ? true : 'Stufe 2 falsch'; } };
    },
    urneOhne: function (lvl) {
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 4 }, { r: 4, b: 3 }, { r: 3, b: 3 }, { r: 5, b: 2 }, { r: 2, b: 3, g: 2 }]), E = exp2(units(spec), null, true), T = treeOf(E), n = E.u1.length;
      var i = M.rnd(0, T.s1.length - 1), row = T.s2[i], p2 = [];
      T.s2.forEach(function (r, a) { r.forEach(function () { p2.push(a === i ? '?' : undefined); }); });
      return { skill: 'Ziehen ohne Zurücklegen', level: 3, q: urnTxt(spec) + ' Du ziehst nacheinander zwei Kugeln <b>ohne Zurücklegen</b>.' + urn(spec) + 'Welche Wahrscheinlichkeiten stehen in der zweiten Stufe an den Ästen nach „' + COL[T.s1[i].k][0] + '“?' + tree(T, { p2: p2 }),
        inputs: row.map(function (b) { return fracIn(b.p, 'Ast „' + COL[b.k][0] + '“'); }),
        hints: ['Nach dem ersten Zug liegt eine Kugel weniger in der Urne: nur noch ' + (n - 1) + '.', 'Die erste Kugel war ' + COL[T.s1[i].k][0] + '. Von dieser Farbe sind jetzt nur noch ' + (cnt(E.u1, T.s1[i].k) - 1) + ' übrig.', row.map(function (b) { var c = cnt(E.u1, b.k) - (b.k === T.s1[i].k ? 1 : 0); return COL[b.k][0] + ': ' + c + ' von ' + (n - 1); }).join(', ') + '.'],
        solution: 'Nach „' + COL[T.s1[i].k][0] + '“ liegen noch ' + (n - 1) + ' Kugeln in der Urne: ' + row.map(function (b) { return COL[b.k][0] + ' ' + fh(b.p, true); }).join(', ') + '.' + tree(T),
        mistakes: function (v) { var f = M.parseFrac(v[0]), k0 = row[0].k; if (f && M.feq(f, F(cnt(E.u1, k0), n)) && !M.feq(row[0].p, F(cnt(E.u1, k0), n))) return 'Das wäre richtig <b>mit</b> Zurücklegen. Hier fehlt beim zweiten Zug eine Kugel in der Urne.'; return null; },
        verify: function () { var pi = M.red(F(cnt(E.u1, T.s1[i].k), n)); return row.every(function (b) { var joint = brute(E, function (x, y) { return x === T.s1[i].k && y === b.k; }); return M.feq(joint, M.fmul(pi, b.p)); }) ? true : 'bedingte Wahrscheinlichkeit falsch'; } };
    },
    ereignis: function (lvl) {
      var X = M.pick(LAP.filter(function (x) { return lvl >= 3 ? true : x.lv <= 2; }));
      if (lvl === 3 && Math.random() < 0.6) X = LAP[3];
      var ev = M.pick(X.ev), T = treeOf(X.E), outs = [], hl = [], n = 0;
      T.s2.forEach(function (row, i) { row.forEach(function (b) { outs.push(resTxt(T.s1[i].k, b.k)); if (ev[1](T.s1[i].k, b.k)) hl.push(n); n++; }); });
      var fav = hl.length, tot = outs.length, P = M.red(F(fav, tot));
      var uo = {}, uf = {}; outs.forEach(function (o, k) { var key = o.split('').sort().join(''); uo[key] = 1; if (hl.indexOf(k) >= 0) uf[key] = 1; });
      var wrongP = F(Object.keys(uf).length, Object.keys(uo).length);
      return { skill: 'Laplace-Wahrscheinlichkeit mit Baum', q: X.txt + tree(T, { res: true }) + 'Ereignis: <b>„' + ev[0] + '“</b>. Wie viele Ergebnisse gehören dazu? Wie groß ist die Wahrscheinlichkeit?',
        inputs: [{ kind: 'num', answer: fav, label: 'günstige Ergebnisse' }, fracIn(P, 'Wahrscheinlichkeit (gekürzt)', true)],
        hints: ['Alle ' + tot + ' Pfade sind gleich wahrscheinlich. Es ist ein Laplace-Experiment.', 'Gehe die Ergebnisse rechts der Reihe nach durch und markiere die, die zu „' + ev[0] + '“ passen.', 'P = günstige Ergebnisse : alle Ergebnisse = ' + fav + ' : ' + tot + '. Kürze.'],
        solution: 'Günstig sind ' + hl.map(function (k) { return outs[k]; }).join(', ') + '. Das sind ' + fav + ' von ' + tot + ' Ergebnissen: P = ' + frac(fav, tot) + (M.gcd(fav, tot) > 1 ? ' = ' + fh(P) : '') + '.' + tree(T, { res: true, hl: hl }),
        mistakes: function (v) {
          var f = M.parseFrac(v[1]);
          if (f && !M.feq(wrongP, P) && M.feq(f, wrongP)) return 'Du hast Ergebnisse wie ' + resTxt(X.E.u1[0], X.E.u2[1]) + ' und ' + resTxt(X.E.u2[1], X.E.u1[0]) + ' als ein Ergebnis gezählt. Im Baumdiagramm sind das zwei verschiedene Pfade. Zähle alle ' + tot + ' Pfade.';
          if (f && M.feq(f, F(fav, tot - fav)) && fav !== tot - fav) return 'Teile durch die Anzahl <b>aller</b> Ergebnisse (' + tot + '), nicht durch die ungünstigen.';
          return null;
        },
        verify: function () { return M.feq(brute(X.E, ev[1]), P) ? true : 'Abzählen passt nicht'; } };
    },
    schaetzen: function (lvl) {
      if (lvl === 3) {
        var N = M.pick([100, 200]), c, t = 0;
        do { var base = N / 4; c = [0, 0, 0].map(function () { return base + M.rnd(-Math.round(N / 20), Math.round(N / 20)); }); c.push(N - c[0] - c[1] - c[2]); t++; } while ((c[3] < base - N / 15 || c[3] > base + N / 15 || c[1] + c[2] === N / 2) && t < 200);
        var vers = c[1] + c[2], rel = vers * 100 / N;
        return { skill: 'Relative Häufigkeit und Wahrscheinlichkeit', level: 3, q: 'Die Klasse 8b hat ' + N + '-mal zwei Münzen geworfen:' + '<table class="tab"><tr><th>KK</th><th>KZ</th><th>ZK</th><th>ZZ</th></tr><tr>' + c.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr></table>' + 'a) Wie groß ist die relative Häufigkeit für „zwei verschiedene Seiten“ in Prozent?<br>b) Wie groß ist die Wahrscheinlichkeit dafür (als Bruch)?',
          inputs: [{ kind: 'num', answer: rel, label: 'a) relative Häufigkeit', unit: '%' }, fracIn(F(1, 2), 'b) Wahrscheinlichkeit', true)],
          hints: ['„Zwei verschiedene Seiten“ sind die Ergebnisse KZ und ZK.', 'a) ' + c[1] + ' + ' + c[2] + ' = ' + vers + ' von ' + N + ' Würfen.', 'b) Im Baumdiagramm sind 2 von 4 gleich wahrscheinlichen Pfaden günstig.'],
          solution: 'a) ' + frac(vers, N) + ' = ' + fmt(rel) + ' %. b) P = ' + frac(2, 4) + ' = ' + frac(1, 2) + ' = 50 %. Die relative Häufigkeit liegt nahe bei der Wahrscheinlichkeit. Je mehr Würfe, desto näher liegt sie meistens daran.',
          mistakes: function (v) { var f = M.parseFrac(v[1]); if (f && M.feq(f, F(1, 3))) return 'Es gibt nicht 3, sondern 4 gleich wahrscheinliche Ergebnisse: KK, KZ, ZK, ZZ.'; return null; },
          verify: function () { return c.reduce(function (a, x) { return a + x; }, 0) === N && M.feq(brute(exp2(['K', 'Z']), function (a, b) { return a !== b; }), F(1, 2)) ? true : 'Summe'; } };
      }
      var obj = M.pick([['eine Reißzwecke', 'mit der Spitze nach oben', 'sie'], ['einen Legostein', 'auf der Seite', 'er'], ['einen Kronkorken', 'mit der Öffnung nach oben', 'er'], ['eine Streichholzschachtel', 'auf der schmalen Seite', 'sie']]);
      var n = M.pick([50, 200, 250, 400, 500]), p = 2 * M.rnd(8, 35), k = n * p / 100, m = M.pick([50, 100, 150, 300]), exp = m * p / 100;
      var inputs = [{ kind: 'num', answer: p, label: 'geschätzte Wahrscheinlichkeit', unit: '%' }];
      if (lvl >= 2) inputs.push({ kind: 'num', answer: exp, label: 'erwartete Anzahl bei ' + m + ' Würfen' });
      return { skill: 'Wahrscheinlichkeit schätzen', q: 'Die Klasse hat ' + obj[0] + ' <b>' + n + '-mal</b> geworfen. ' + k + '-mal landete ' + obj[2] + ' ' + obj[1] + '.<br>Schätze die Wahrscheinlichkeit für „' + obj[1] + '“ mithilfe der relativen Häufigkeit.' + (lvl >= 2 ? ' Wie oft erwartest du dieses Ergebnis ungefähr bei ' + m + ' Würfen?' : ''), inputs: inputs,
        hints: ['Bei vielen Versuchen ist die relative Häufigkeit ein guter Schätzwert für die Wahrscheinlichkeit.', 'Relative Häufigkeit = ' + k + ' : ' + n + ' = ' + fmt(p / 100) + '.', lvl >= 2 ? 'Erwartete Anzahl = ' + fmt(p / 100) + ' · ' + m + '.' : 'Rechne in Prozent um: ' + fmt(p / 100) + ' = ' + p + ' %.'],
        solution: 'P ≈ ' + frac(k, n) + ' = ' + fmt(p / 100) + ' = ' + p + ' %.' + (lvl >= 2 ? ' Bei ' + m + ' Würfen erwartest du etwa ' + fmt(p / 100) + ' · ' + m + ' = ' + exp + '-mal dieses Ergebnis.' : ''),
        mistakes: function (v) { if (M.parseNum(v[0]) === k && k !== p) return 'Das ist die absolute Häufigkeit. Teile durch die Anzahl der Würfe (' + n + ') und rechne in Prozent um.'; return null; },
        verify: function () { return k === Math.round(k) && exp === Math.round(exp) && Math.abs(k / n * 100 - p) < 1e-9 ? true : 'nicht ganzzahlig'; } };
    },
    dreistufig: function () {
      var u = ['K', 'Z'], outs = [];
      u.forEach(function (a) { u.forEach(function (b) { u.forEach(function (c) { outs.push(a + b + c); }); }); });
      var EV = [['genau zweimal Kopf', function (s) { return s.split('K').length - 1 === 2; }], ['genau einmal Kopf', function (s) { return s.split('K').length - 1 === 1; }], ['mindestens einmal Kopf', function (s) { return s.indexOf('K') >= 0; }],
        ['dreimal dasselbe', function (s) { return s === 'KKK' || s === 'ZZZ'; }], ['höchstens einmal Zahl', function (s) { return s.split('Z').length - 1 <= 1; }], ['zuerst Kopf, dann zweimal Zahl', function (s) { return s === 'KZZ'; }]];
      var ev = M.shuffle(EV).slice(0, 2), res = ev.map(function (e) { var f = outs.filter(e[1]).length; return { fav: f, P: M.red(F(f, 8)), list: outs.filter(e[1]) }; });
      return { skill: 'Dreistufige Zufallsexperimente', level: 3, q: 'Eine Münze wird <b>dreimal</b> geworfen. Zeichne das Baumdiagramm im Heft.<br>a) Wie viele Ergebnisse gibt es?<br>b) Wie groß ist die Wahrscheinlichkeit für „' + ev[0][0] + '“?<br>c) Wie groß ist die Wahrscheinlichkeit für „' + ev[1][0] + '“?',
        inputs: [{ kind: 'num', answer: 8, label: 'a) Anzahl' }, fracIn(res[0].P, 'b) P (gekürzt)', true), fracIn(res[1].P, 'c) P (gekürzt)', true)],
        hints: ['Jeder Wurf verdoppelt die Anzahl der Pfade: 2 · 2 · 2.', 'Schreibe alle Ergebnisse auf: KKK, KKZ, KZK, KZZ, ZKK, ZKZ, ZZK, ZZZ.', 'Zähle, wie viele davon zum Ereignis passen, und teile durch 8.'],
        solution: 'a) 2 · 2 · 2 = 8 Ergebnisse: ' + outs.join(', ') + '.<br>b) Günstig: ' + res[0].list.join(', ') + ', also P = ' + frac(res[0].fav, 8) + (M.gcd(res[0].fav, 8) > 1 ? ' = ' + fh(res[0].P) : '') + '.<br>c) Günstig: ' + res[1].list.join(', ') + ', also P = ' + frac(res[1].fav, 8) + (M.gcd(res[1].fav, 8) > 1 ? ' = ' + fh(res[1].P) : '') + '.',
        mistakes: function (v) { if (M.parseNum(v[0]) === 6) return 'Bei drei Würfen werden die Möglichkeiten multipliziert, nicht addiert: 2 · 2 · 2.'; return null; },
        verify: function () { var c = 0, f0 = 0; for (var i = 0; i < 8; i++) { var s = (i & 4 ? 'Z' : 'K') + (i & 2 ? 'Z' : 'K') + (i & 1 ? 'Z' : 'K'); c++; if (ev[0][1](s)) f0++; } return c === 8 && M.feq(F(f0, 8), res[0].P) ? true : 'Zählung'; } };
    }
  };

  /* ---------- Ausprobieren: Simulation ---------- */
  var SIM = [
    { t: 'Zwei Münzen: Ergebnisse', outs: ['KK', 'KZ', 'ZK', 'ZZ'], p: [0.25, 0.25, 0.25, 0.25], draw: function () { return (Math.random() < 0.5 ? 'K' : 'Z') + (Math.random() < 0.5 ? 'K' : 'Z'); }, map: function (s) { return s; }, E: exp2(['K', 'Z']) },
    { t: 'Zwei Münzen: Anzahl Kopf', outs: ['0', '1', '2'], p: [0.25, 0.5, 0.25], draw: function () { return (Math.random() < 0.5 ? 'K' : 'Z') + (Math.random() < 0.5 ? 'K' : 'Z'); }, map: function (s) { return String(s.split('K').length - 1); }, E: exp2(['K', 'Z']) },
    { t: 'Glücksrad 1, 2, 3 zweimal: Summe', outs: ['2', '3', '4', '5', '6'], p: [1 / 9, 2 / 9, 3 / 9, 2 / 9, 1 / 9], draw: function () { return String(M.rnd(1, 3)) + String(M.rnd(1, 3)); }, map: function (s) { return String(+s[0] + +s[1]); }, E: exp2(['1', '2', '3']) }];
  function bars(S, counts, N) {
    var W = 400, H = 230, x0 = 46, x1 = 390, yb = 196, yt = 18, ymax = 0.6;
    function Y(v) { return f1(yb - v / ymax * (yb - yt)); }
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Relative Häufigkeiten" style="max-width:440px">';
    for (var v = 0; v <= 6; v++) g += '<line x1="' + x0 + '" y1="' + Y(v / 10) + '" x2="' + x1 + '" y2="' + Y(v / 10) + '" stroke="#e3dcf2"/><text x="' + (x0 - 6) + '" y="' + (Y(v / 10) + 4) + '" font-size="12" text-anchor="end" fill="#5a5670">' + v * 10 + ' %</text>';
    var k = S.outs.length, slot = (x1 - x0) / k, bw = Math.min(56, slot * 0.6);
    S.outs.forEach(function (o, i) {
      var cx = x0 + slot * (i + 0.5), r = N ? counts[i] / N : 0;
      g += '<rect x="' + f1(cx - bw / 2) + '" y="' + Y(r) + '" width="' + f1(bw) + '" height="' + f1(yb - Y(r)) + '" fill="#5b3fa0"/>';
      g += '<line x1="' + f1(cx - bw / 2 - 6) + '" y1="' + Y(S.p[i]) + '" x2="' + f1(cx + bw / 2 + 6) + '" y2="' + Y(S.p[i]) + '" stroke="#d97706" stroke-width="3" stroke-dasharray="6 3"/>';
      if (N) g += '<text x="' + f1(cx) + '" y="' + (Math.min(+Y(r), +Y(S.p[i])) - 6) + '" font-size="12" font-weight="700" text-anchor="middle">' + fmt(f1(r * 100)) + ' %</text>';
      g += '<text x="' + f1(cx) + '" y="' + (yb + 18) + '" font-size="13" font-weight="700" text-anchor="middle">' + o + '</text>';
    });
    g += '<line x1="' + x0 + '" y1="' + yb + '" x2="' + x1 + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.5"/>';
    return g + '</svg>';
  }

  var COINS = treeOf(exp2(['K', 'Z']));
  return {
    id: '028', title: 'Baumdiagramme', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Wahrscheinlichkeiten bei Münze und Würfel, Brüche kürzen, relative Häufigkeit',
    lead: 'Zwei Münzen, ein Glücksrad, eine Urne: Mit einem Baumdiagramm behältst du bei zweistufigen Zufallsexperimenten den Überblick und findest alle Ergebnisse.',
    einstieg: { html: '<p>Lena und Tom werfen in der Pause zwei Münzen. Lena gewinnt, wenn beide Münzen <b>gleich</b> fallen. Tom gewinnt, wenn sie <b>verschieden</b> fallen.</p><p>Tom überlegt: „Es gibt drei Möglichkeiten: zweimal Kopf, zweimal Zahl oder einmal Kopf und einmal Zahl. Lena hat zwei davon, ich nur eine. Das Spiel ist unfair!“</p><p class="note">Hat Tom recht? Wie viele Ergebnisse gibt es beim Werfen von zwei Münzen wirklich? Schätze zuerst, wer öfter gewinnt.</p><p>Mit einem <b>Baumdiagramm</b> kannst du alle Ergebnisse sauber aufschreiben. Am Ende dieses Moduls kannst du Toms Frage sicher beantworten.</p>' },
    ziele: ['Ich stelle zweistufige Zufallsexperimente in einem Baumdiagramm dar.', 'Ich bestimme die Anzahl der Ergebnisse mit Pfaden.', 'Ich ergänze fehlende Wahrscheinlichkeiten an Ästen, denn an jeder Verzweigung ist die Summe 1.', 'Ich unterscheide Laplace- und Nicht-Laplace-Experimente sowie Ziehen mit und ohne Zurücklegen.', 'Ich schätze Wahrscheinlichkeiten über relative Häufigkeiten.'],
    fachwoerter: [['Zweistufiges Zufallsexperiment', 'Zwei Zufallsexperimente nacheinander, zum Beispiel zweimal eine Münze werfen.'], ['Baumdiagramm', 'Ein Bild mit Ästen. Jede Stufe des Experiments bekommt eine Verzweigung. An den Ästen stehen die Wahrscheinlichkeiten.'], ['Pfad', 'Ein Weg vom Start bis zu einem Ende des Baums. Jeder Pfad gehört zu genau einem Ergebnis.'], ['Laplace-Experiment', 'Alle Ergebnisse sind gleich wahrscheinlich. Dann gilt: P = günstige Ergebnisse : alle Ergebnisse.'], ['Mit und ohne Zurücklegen', 'Mit Zurücklegen ist die Urne beim zweiten Zug wie vorher. Ohne Zurücklegen fehlt die erste Kugel.']],
    diagnose: [
      { q: 'Wie groß ist die Wahrscheinlichkeit, mit einem normalen Würfel eine 6 zu würfeln?', options: [frac(1, 6), frac(1, 2), frac(6, 1), 'Weiß ich noch nicht'], answer: 0, why: 'Es gibt 6 gleich wahrscheinliche Ergebnisse, eins davon ist die 6.', review: 'Wahrscheinlichkeiten bei Laplace-Experimenten (Klasse 5/6)' },
      { q: 'Berechne 1 − ' + frac(3, 8) + '.', options: [frac(5, 8), frac(2, 8), frac(3, 7), 'Weiß ich noch nicht'], answer: 0, why: '1 = ' + frac(8, 8) + ', also ' + frac(8, 8) + ' − ' + frac(3, 8) + ' = ' + frac(5, 8) + '.', review: 'Brüche subtrahieren' },
      { q: 'Ein Glücksrad hat ein rotes Feld mit 90°. Wie groß ist die Wahrscheinlichkeit für Rot?', options: [frac(1, 4), frac(1, 90), frac(1, 3), 'Weiß ich noch nicht'], answer: 0, why: '90° von 360° sind ' + frac(90, 360) + ' = ' + frac(1, 4) + '.', review: 'Anteile am Kreis' },
      { q: 'Bei 50 Würfen fiel 20-mal „Zahl“. Wie groß ist die relative Häufigkeit?', options: ['0,4', '20', '0,2', 'Weiß ich noch nicht'], answer: 0, why: '20 : 50 = 0,4.', review: 'Relative Häufigkeit (Modul 027)' }],
    erklaerung:
      '<h3>1. Das Baumdiagramm</h3><p>Du wirfst zweimal eine Münze. Für den ersten Wurf zeichnest du zwei Äste (K und Z). An jedes Ende hängst du wieder zwei Äste für den zweiten Wurf. An die Äste schreibst du die Wahrscheinlichkeiten.</p>' + tree(COINS, { res: true, label: 'Baumdiagramm zwei Münzen' }) +
      '<p>Jeder <b>Pfad</b> vom Start bis zum Ende gehört zu genau einem <b>Ergebnis</b>: KK, KZ, ZK und ZZ. KZ und ZK sind verschiedene Ergebnisse, denn es kommt auf die Reihenfolge an.</p>' +
      '<div class="merk"><b>Merke:</b><br>An jeder Verzweigung ergeben die Wahrscheinlichkeiten zusammen <b>1</b>.<br>Anzahl der Ergebnisse = (Äste in Stufe 1) · (Äste in Stufe 2), zum Beispiel 2 · 2 = 4.</div>' +
      '<p>Tom aus dem Einstieg hat sich geirrt: „verschieden“ sind KZ und ZK, also 2 von 4 Pfaden. Das Spiel ist fair.</p>' +
      '<h3>2. Laplace und Nicht-Laplace</h3><p>Sind alle Ergebnisse gleich wahrscheinlich, heißt das Experiment <b>Laplace-Experiment</b>. Dann zählst du: <span class="big-math">P = <span class="frac"><span>günstige Ergebnisse</span><span>alle Ergebnisse</span></span></span></p><p>Bei einem Glücksrad mit verschieden großen Feldern ist das anders. Dort ist die Wahrscheinlichkeit für eine Farbe der Anteil am Kreis: Winkel : 360°.</p>' + wheel([['r', 180], ['b', 120], ['y', 60]]) +
      '<p>Hier gilt P(rot) = ' + frac(1, 2) + ', P(blau) = ' + frac(1, 3) + ' und P(gelb) = ' + frac(1, 6) + '. Zusammen: ' + frac(3, 6) + ' + ' + frac(2, 6) + ' + ' + frac(1, 6) + ' = 1.</p>' +
      '<h3>3. Ziehen mit und ohne Zurücklegen</h3><p>In einer Urne liegen 3 rote und 2 blaue Kugeln. Du ziehst zweimal.</p>' + urn({ r: 3, b: 2 }) +
      '<ul><li><b>Mit Zurücklegen:</b> Beim zweiten Zug ist alles wie beim ersten. Die Wahrscheinlichkeiten in Stufe 2 bleiben gleich.</li><li><b>Ohne Zurücklegen:</b> Es liegen nur noch 4 Kugeln in der Urne. Nach einer roten Kugel sind noch 2 rote und 2 blaue da.</li></ul>' + tree(treeOf(exp2(units({ r: 3, b: 2 }), null, true)), { label: 'Baumdiagramm ohne Zurücklegen' }) +
      '<h3>4. Wahrscheinlichkeiten schätzen</h3><p>Bei einer Reißzwecke kannst du nicht zählen. Du wirfst sie sehr oft. Die <b>relative Häufigkeit</b> ist dann ein guter Schätzwert für die Wahrscheinlichkeit. Je mehr Versuche, desto zuverlässiger ist die Schätzung.</p>',
    entdecken: {
      html: '<p>Lass den Computer würfeln und werfen. Die Säulen zeigen die relativen Häufigkeiten, die orangen Striche die Wahrscheinlichkeiten aus dem Baumdiagramm.</p><div class="ctl"><label>Experiment <select id="e_exp"></select></label></div><div class="ctl"><button class="btn ghost" id="e_reset">Neu starten</button><button class="btn" id="e_10">10-mal</button><button class="btn" id="e_100">100-mal</button></div><p class="big-math" id="e_n"></p><div id="e_bars"></div><div id="e_tree"></div><p class="note">Was passiert mit den Säulen, wenn du sehr oft wirfst? Warum ist bei „Anzahl Kopf“ die 1 doppelt so häufig wie die 0?</p>',
      init: function (root, done) {
        var sel = root.querySelector('#e_exp'), n = 0, counts, N;
        SIM.forEach(function (s, i) { sel.add(new Option(s.t, i)); });
        function reset() { var S = SIM[+sel.value]; counts = S.outs.map(function () { return 0; }); N = 0; root.querySelector('#e_tree').innerHTML = tree(treeOf(S.E), { res: true }); }
        function draw() { var S = SIM[+sel.value]; root.querySelector('#e_bars').innerHTML = bars(S, counts, N); root.querySelector('#e_n').textContent = N ? N + ' Durchgänge' : 'Noch keine Durchgänge. Tippe auf „10-mal“ oder „100-mal“.'; }
        function run(k) { var S = SIM[+sel.value]; for (var i = 0; i < k; i++) { var o = S.map(S.draw()); counts[S.outs.indexOf(o)]++; } N += k; }
        function act() { draw(); n++; if (n >= 3) done('Gut beobachtet: Bei vielen Durchgängen liegen die relativen Häufigkeiten nahe bei den Wahrscheinlichkeiten aus dem Baumdiagramm. Bei „Anzahl Kopf“ gehören zur 1 zwei Pfade (KZ und ZK), deshalb ist sie doppelt so wahrscheinlich.'); }
        sel.addEventListener('change', function () { reset(); act(); });
        root.querySelector('#e_reset').addEventListener('click', function () { reset(); act(); });
        root.querySelector('#e_10').addEventListener('click', function () { run(10); act(); });
        root.querySelector('#e_100').addEventListener('click', function () { run(100); act(); });
        reset(); draw();
      }
    },
    beispiel: { title: 'Glücksrad zweimal drehen', q: 'Ein Glücksrad hat drei gleich große Felder: rot (r), blau (b) und grün (g). Es wird zweimal gedreht. Wie groß ist die Wahrscheinlichkeit, zweimal dieselbe Farbe zu erhalten?',
      steps: ['Baumdiagramm zeichnen: In Stufe 1 gibt es 3 Äste mit je ' + frac(1, 3) + '. An jedem Ende hängen wieder 3 Äste.', 'Anzahl der Ergebnisse: 3 · 3 = 9 Pfade. Alle sind gleich wahrscheinlich, es ist ein Laplace-Experiment.', 'Günstige Ergebnisse suchen: rr, bb und gg. Das sind 3 Pfade.', 'P(zweimal dieselbe Farbe) = ' + frac(3, 9) + ' = ' + frac(1, 3) + '.', 'Kontrolle: Die übrigen 6 Pfade haben verschiedene Farben. 3 + 6 = 9 passt.' + tree(treeOf(exp2(['r', 'b', 'g'])), { res: true, hl: [0, 4, 8] })] },
    tasks: { gen: gen, plan: { G: ['laplace:1', 'anzahl:1', 'radAst:1', 'ast:1'], S: ['anzahl:2', 'ast:2', 'urneMit:2', 'ereignis:2', 'schaetzen:2'], E: ['ast:3', 'radAst:2', 'urneOhne:3', 'ereignis:3', 'schaetzen:3', 'anzahl:3'] },
      extra: 'dreistufig', test: ['anzahl:2', 'radAst:2', 'ast:2', 'urneMit:2', 'ereignis:2', 'schaetzen:2'] },
    lerncheck: ['Ich zeichne ein Baumdiagramm für ein zweistufiges Zufallsexperiment.', 'Ich ergänze fehlende Wahrscheinlichkeiten an den Ästen.', 'Ich unterscheide Ziehen mit und ohne Zurücklegen.', 'Ich bestimme Wahrscheinlichkeiten durch Abzählen oder schätze sie über relative Häufigkeiten.']
  };
})();
