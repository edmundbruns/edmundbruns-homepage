/* Modul 029 · Produktregel */
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

  /* ---------- Bausteine für Modul 029 ---------- */
  function redTree(T) { T.s1.forEach(function (a) { a.p = M.red(a.p); }); T.s2.forEach(function (r) { r.forEach(function (b) { b.p = M.red(b.p); }); }); return T; }
  function nm(k) { return COL[k] ? COL[k][0] : NAME[k] || k; }
  /* Pfadwahrscheinlichkeiten und Ereignis über den Baum (Produkt- und Summenregel) */
  function paths(T, pred) {
    var out = [];
    T.s2.forEach(function (row, i) { row.forEach(function (b, j) { out.push({ i: i, j: j, a: T.s1[i], b: b, p: M.fmul(T.s1[i].p, b.p), fav: pred ? pred(T.s1[i].k, b.k) : false }); }); });
    return out;
  }
  function sumFav(P) { return P.filter(function (x) { return x.fav; }).reduce(function (s, x) { return M.fadd(s, x.p); }, F(0)); }
  function ppList(P) { return P.map(function (x) { return x.p; }); }
  function hlList(P) { var h = []; P.forEach(function (x, n) { if (x.fav) h.push(n); }); return h; }
  function prodTxt(x) { return fh(x.a.p, true) + ' · ' + fh(x.b.p, true) + ' = ' + fh(F(x.a.p.n * x.b.p.n, x.a.p.d * x.b.p.d), true) + (M.gcd(x.a.p.n * x.b.p.n, x.a.p.d * x.b.p.d) > 1 ? ' = ' + fh(x.p) : ''); }
  function pName(x) { return 'P(' + resTxt(x.a.k, x.b.k) + ')'; }
  function sumTxt(P, res) {
    var f = P.filter(function (x) { return x.fav; });
    return f.map(function (x) { return pName(x) + ' = ' + prodTxt(x); }).join('<br>') + (f.length > 1 ? '<br>Summe: ' + f.map(function (x) { return fh(x.p); }).join(' + ') + ' = ' + fh(res) : '');
  }
  var SPECS2 = [{ r: 3, b: 2 }, { r: 2, b: 3 }, { r: 4, b: 2 }, { r: 3, b: 4 }, { r: 5, b: 3 }, { r: 2, b: 4 }, { r: 4, b: 1 }, { r: 3, b: 5 }];
  var SPECS3 = [{ r: 2, b: 3, g: 1 }, { r: 3, b: 2, g: 1 }, { r: 2, b: 2, g: 2 }, { r: 1, b: 2, g: 3 }];
  var WHEELS = [[['r', 180], ['b', 120], ['y', 60]], [['r', 90], ['b', 270]], [['r', 120], ['b', 240]], [['r', 144], ['b', 216]], [['r', 90], ['b', 180], ['g', 90]], [['r', 60], ['b', 180], ['y', 120]], [['r', 240], ['b', 120]], [['r', 72], ['b', 288]]];
  function gcdAll(a) { return a.reduce(function (g, x) { return M.gcd(g, x); }, 0); }
  function wheelUnits(S) { var g = gcdAll(S.map(function (s) { return s[1]; })), u = []; S.forEach(function (s) { for (var k = 0; k < s[1] / g; k++) u.push(s[0]); }); return u; }
  function scen(t, three) {
    if (t === 'rad') { var S = M.pick(WHEELS); return { E: exp2(wheelUnits(S)), txt: 'Das abgebildete Glücksrad wird zweimal gedreht.', pic: wheel(S), red: true, S: S }; }
    var spec = M.pick(three ? SPECS3 : SPECS2), ohne = t === 'ohne';
    if (ohne) while (Object.keys(spec).some(function (k) { return spec[k] < 2; })) spec = M.pick(three ? SPECS3 : SPECS2);
    return { E: exp2(units(spec), null, ohne), spec: spec, txt: urnTxt(spec) + (ohne ? ' Du ziehst nacheinander zwei Kugeln <b>ohne Zurücklegen</b>.' : ' Du ziehst eine Kugel, notierst die Farbe, <b>legst sie zurück</b> und ziehst noch einmal.'), pic: urn(spec), red: false };
  }
  function treeFor(sc) { var T = treeOf(sc.E); return sc.red ? redTree(T) : T; }
  var EVS = [['zwei gleiche Farben', function (a, b) { return a === b; }], ['zwei verschiedene Farben', function (a, b) { return a !== b; }], ['genau einmal Rot', function (a, b) { return (a === 'r') !== (b === 'r'); }],
    ['mindestens einmal Rot', function (a, b) { return a === 'r' || b === 'r'; }], ['höchstens einmal Blau', function (a, b) { return !(a === 'b' && b === 'b'); }]];
  function pathMistakes(P, target, sc) {
    return function (v) {
      var f = M.parseFrac(v[0]); if (!f) return null;
      var x = target;
      if (M.feq(f, M.fadd(x.a.p, x.b.p)) && !M.feq(x.p, M.fadd(x.a.p, x.b.p))) return 'Du hast die Astwahrscheinlichkeiten addiert. Entlang eines Pfades wird <b>multipliziert</b>.';
      if (sc && sc.E.ohne) { var n = sc.E.u1.length, w = M.fmul(F(cnt(sc.E.u1, x.a.k), n), F(cnt(sc.E.u1, x.b.k), n)); if (M.feq(f, w) && !M.feq(w, x.p)) return 'Das wäre richtig <b>mit</b> Zurücklegen. Beim zweiten Zug liegt aber eine Kugel weniger in der Urne.'; }
      if ((M.feq(f, x.a.p) || M.feq(f, x.b.p)) && !M.feq(f, x.p)) return 'Das ist nur eine Astwahrscheinlichkeit. Multipliziere die Wahrscheinlichkeiten <b>beider</b> Äste des Pfades.';
      return null;
    };
  }

  var gen = {
    pfad: function (lvl) {
      var sc = scen(M.pick(lvl === 1 ? ['mit', 'rad'] : ['mit', 'ohne', 'rad'])), T = treeFor(sc), P = paths(T), x = M.pick(P), n = P.indexOf(x);
      var desc = sc.S ? 'erst ' + nm(x.a.k) + ', dann ' + nm(x.b.k) : (x.a.k === x.b.k ? 'zwei ' + nm(x.a.k) + 'e Kugeln' : 'erst eine ' + nm(x.a.k) + 'e, dann eine ' + nm(x.b.k) + 'e Kugel');
      return { skill: 'Pfadwahrscheinlichkeit (Produktregel)', q: sc.txt + sc.pic + 'Berechne die Wahrscheinlichkeit für <b>„' + desc + '“</b>.' + (lvl === 1 ? ' Der Pfad ist im Baumdiagramm markiert.' : '') + tree(T, { res: true, hl: lvl === 1 ? [n] : [] }),
        inputs: [fracIn(x.p, 'P(' + resTxt(x.a.k, x.b.k) + ') (gekürzt)', true)],
        hints: ['Suche den Pfad ' + resTxt(x.a.k, x.b.k) + ' im Baumdiagramm.', 'Produktregel: Multipliziere die Wahrscheinlichkeiten entlang des Pfades: ' + fh(x.a.p, true) + ' · ' + fh(x.b.p, true) + '.', 'Zähler mal Zähler, Nenner mal Nenner. Kürze am Ende.'],
        solution: pName(x) + ' = ' + prodTxt(x) + tree(T, { res: true, hl: [n], pp: P.map(function (y, k) { return k === n ? y.p : null; }) }),
        mistakes: pathMistakes(P, x, sc),
        verify: function () { return M.feq(brute(sc.E, function (a, b) { return a === x.a.k && b === x.b.k; }), x.p) ? true : 'Abzählen ≠ Produkt'; } };
    },
    mitZ: function (lvl) {
      var sc = scen('mit'), T = treeFor(sc), P = paths(T), sp = sc.spec;
      var x = lvl === 1 ? P.filter(function (y) { return y.a.k === 'r' && y.b.k === 'r'; })[0] : M.pick(P.filter(function (y) { return !(y.a.k === 'r' && y.b.k === 'r'); }));
      var desc = x.a.k === x.b.k ? 'zweimal ' + nm(x.a.k) : 'erst ' + nm(x.a.k) + ', dann ' + nm(x.b.k);
      return { skill: 'Ziehen mit Zurücklegen', q: sc.txt + sc.pic + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + desc + '“</b>? Zeichne dir ein Baumdiagramm.', inputs: [fracIn(x.p, 'P (gekürzt)', true)],
        hints: ['Mit Zurücklegen: Beim zweiten Zug ist die Urne genauso gefüllt wie beim ersten.', 'P(' + nm(x.a.k) + ') = ' + fh(x.a.p, true) + ' und P(' + nm(x.b.k) + ') = ' + fh(x.b.p, true) + ' in beiden Stufen.', 'Multipliziere: ' + fh(x.a.p, true) + ' · ' + fh(x.b.p, true) + '.'],
        solution: pName(x) + ' = ' + prodTxt(x) + tree(T, { res: true, hl: [P.indexOf(x)], pp: P.map(function (y) { return y === x ? y.p : null; }) }),
        mistakes: pathMistakes(P, x, sc),
        verify: function () { return M.feq(brute(sc.E, function (a, b) { return a === x.a.k && b === x.b.k; }), x.p) ? true : 'Abzählen ≠ Produkt'; } };
    },
    ohneZ: function (lvl) {
      var sc = scen('ohne', lvl === 3), T = treeFor(sc), P = paths(T);
      var x = Math.random() < 0.6 ? M.pick(P.filter(function (y) { return y.a.k === y.b.k; })) : M.pick(P);
      var desc = x.a.k === x.b.k ? 'zwei ' + nm(x.a.k) + 'e Kugeln' : 'erst eine ' + nm(x.a.k) + 'e, dann eine ' + nm(x.b.k) + 'e Kugel';
      return { skill: 'Ziehen ohne Zurücklegen', q: sc.txt + sc.pic + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + desc + '“</b>?', inputs: [fracIn(x.p, 'P (gekürzt)', true)],
        hints: ['Ohne Zurücklegen: Beim zweiten Zug liegt eine Kugel weniger in der Urne, nämlich ' + (sc.E.u1.length - 1) + '.', 'Erster Zug: ' + fh(x.a.p, true) + '. Zweiter Zug (nach ' + nm(x.a.k) + '): ' + fh(x.b.p, true) + '.', 'Multipliziere: ' + fh(x.a.p, true) + ' · ' + fh(x.b.p, true) + ' und kürze.'],
        solution: pName(x) + ' = ' + prodTxt(x) + tree(T, { res: true, hl: [P.indexOf(x)], pp: P.map(function (y) { return y === x ? y.p : null; }) }),
        mistakes: pathMistakes(P, x, sc),
        verify: function () { return M.feq(brute(sc.E, function (a, b) { return a === x.a.k && b === x.b.k; }), x.p) ? true : 'Abzählen ≠ Produkt'; } };
    },
    summe: function (lvl) {
      var sc = scen(M.pick(lvl === 3 ? ['ohne', 'rad'] : ['mit', 'ohne', 'rad']), lvl === 3 && Math.random() < 0.4), T = treeFor(sc), ev, P, res, t = 0;
      do { ev = M.pick(EVS); P = paths(T, ev[1]); res = sumFav(P); t++; } while ((P.filter(function (x) { return x.fav; }).length < 2 || M.feq(res, F(1))) && t < 50);
      var favs = P.filter(function (x) { return x.fav; });
      return { skill: 'Summenregel', level: lvl, q: sc.txt + sc.pic + 'Wie groß ist die Wahrscheinlichkeit für das Ereignis <b>„' + ev[0] + '“</b>?' + tree(T, { res: true }),
        inputs: [fracIn(res, 'P (gekürzt)', true)],
        hints: ['Welche Pfade gehören zu „' + ev[0] + '“? Es sind ' + favs.length + ': ' + favs.map(function (x) { return resTxt(x.a.k, x.b.k); }).join(', ') + '.', 'Berechne jede Pfadwahrscheinlichkeit mit der Produktregel, zum Beispiel ' + pName(favs[0]) + ' = ' + prodTxt(favs[0]) + '.', 'Summenregel: Addiere die Wahrscheinlichkeiten aller passenden Pfade.'],
        solution: sumTxt(P, res) + '.' + tree(T, { res: true, hl: hlList(P), pp: P.map(function (x) { return x.fav ? x.p : null; }) }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && favs.some(function (x) { return M.feq(f, x.p); }) && !M.feq(f, res)) return 'Das ist nur die Wahrscheinlichkeit eines Pfades. Zu „' + ev[0] + '“ gehören ' + favs.length + ' Pfade. Addiere ihre Wahrscheinlichkeiten.'; return null; },
        verify: function () { return M.feq(brute(sc.E, ev[1]), res) ? true : 'Abzählen ≠ Summenregel'; } };
    },
    rad: function (lvl) {
      var S = M.pick(WHEELS), E = exp2(wheelUnits(S)), T = redTree(treeOf(E)), ev;
      if (lvl === 1) ev = ['zweimal Rot', function (a, b) { return a === 'r' && b === 'r'; }];
      else if (lvl === 2) ev = M.pick([['erst Rot, dann Blau', function (a, b) { return a === 'r' && b === 'b'; }], ['zweimal Blau', function (a, b) { return a === 'b' && b === 'b'; }], ['erst Blau, dann Rot', function (a, b) { return a === 'b' && b === 'r'; }]]);
      else ev = M.pick([['zweimal dieselbe Farbe', function (a, b) { return a === b; }], ['genau einmal Rot', function (a, b) { return (a === 'r') !== (b === 'r'); }], ['mindestens einmal Rot', function (a, b) { return a === 'r' || b === 'r'; }]]);
      var P = paths(T, ev[1]), res = sumFav(P), favs = P.filter(function (x) { return x.fav; });
      return { skill: 'Glücksrad mit ungleichen Feldern', q: 'Das Glücksrad wird zweimal gedreht.' + wheel(S) + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>?', inputs: [fracIn(res, 'P (gekürzt)', true)],
        hints: ['Bestimme zuerst die Wahrscheinlichkeiten der Farben: Winkel : 360°. ' + S.map(function (s) { return 'P(' + nm(s[0]) + ') = ' + frac(s[1], 360) + ' = ' + fh(F(s[1], 360)); }).join(', ') + '.', 'Zeichne ein Baumdiagramm mit zwei Stufen. Die Wahrscheinlichkeiten sind in beiden Stufen gleich.', favs.length > 1 ? 'Multipliziere entlang jedes passenden Pfades und addiere die Ergebnisse.' : 'Multipliziere entlang des Pfades ' + resTxt(favs[0].a.k, favs[0].b.k) + '.'],
        solution: sumTxt(P, res) + '.' + tree(T, { res: true, hl: hlList(P), pp: P.map(function (x) { return x.fav ? x.p : null; }) }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (!f) return null; if (favs.length > 1 && favs.some(function (x) { return M.feq(f, x.p); }) && !M.feq(f, res)) return 'Das ist nur ein Pfad. Addiere alle passenden Pfade.'; if (favs.length === 1 && M.feq(f, M.fadd(favs[0].a.p, favs[0].b.p))) return 'Entlang eines Pfades wird multipliziert, nicht addiert.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) && S.reduce(function (a, s) { return a + s[1]; }, 0) === 360 ? true : 'Abzählen ≠ Produktregel'; } };
    },
    ampel: function (lvl) {
      var a = 10 * M.rnd(3, 8), b = 10 * M.rnd(2, 8), both = a * b / 100, kind = lvl === 1 ? 0 : lvl === 2 ? M.pick([0, 1]) : M.pick([2, 3]);
      var ra = 100 - a, rb = 100 - b, ans = [both, ra * rb / 100, 100 - both, (a * rb + ra * b) / 100][kind];
      var qtxt = ['beide Ampeln grün sind', 'beide Ampeln rot sind', 'mindestens eine Ampel rot ist', 'genau eine Ampel grün ist'][kind];
      var pred = [function (x, y) { return x === 'g' && y === 'g'; }, function (x, y) { return x === 'r' && y === 'r'; }, function (x, y) { return x === 'r' || y === 'r'; }, function (x, y) { return (x === 'g') !== (y === 'g'); }][kind];
      var steps = [a + ' % · ' + b + ' % = ' + fmt(a / 100) + ' · ' + fmt(b / 100) + ' = ' + fmt(both / 100) + ' = ' + fmt(both) + ' %',
        ra + ' % · ' + rb + ' % = ' + fmt(ra / 100) + ' · ' + fmt(rb / 100) + ' = ' + fmt(ra * rb / 10000) + ' = ' + fmt(ra * rb / 100) + ' %',
        'Gegenereignis „beide grün“: ' + fmt(a / 100) + ' · ' + fmt(b / 100) + ' = ' + fmt(both / 100) + '. Also 1 − ' + fmt(both / 100) + ' = ' + fmt(1 - both / 100) + ' = ' + fmt(100 - both) + ' %',
        'grün-rot: ' + fmt(a / 100) + ' · ' + fmt(rb / 100) + ' = ' + fmt(a * rb / 10000) + ', rot-grün: ' + fmt(ra / 100) + ' · ' + fmt(b / 100) + ' = ' + fmt(ra * b / 10000) + '. Summe: ' + fmt(ans / 100) + ' = ' + fmt(ans) + ' %'][kind];
      var T = { s1: [{ k: 'g', p: fmt(a / 100) }, { k: 'r', p: fmt(ra / 100) }], s2: [0, 1].map(function () { return [{ k: 'g', p: fmt(b / 100) }, { k: 'r', p: fmt(rb / 100) }]; }) };
      return { skill: 'Sachaufgabe mit Produktregel', q: 'Auf dem Schulweg kommt Emil an zwei Ampeln vorbei, die unabhängig voneinander schalten. Die erste Ampel ist mit einer Wahrscheinlichkeit von <b>' + a + ' %</b> grün, wenn er ankommt, die zweite mit <b>' + b + ' %</b>. Wie groß ist die Wahrscheinlichkeit, dass <b>' + qtxt + '</b>?' + (kind === 2 ? ' (Tipp: Gegenereignis)' : ''), inputs: [{ kind: 'num', answer: ans, label: 'P', unit: '%', tol: 0.005 }],
        hints: ['Zeichne ein Baumdiagramm: Stufe 1 ist die erste Ampel (grün oder rot), Stufe 2 die zweite.', 'Rechne mit Dezimalzahlen: grün ' + fmt(a / 100) + ' und rot ' + fmt(ra / 100) + ' bei der ersten, grün ' + fmt(b / 100) + ' und rot ' + fmt(rb / 100) + ' bei der zweiten Ampel.', kind === 2 ? '„Mindestens eine rot“ ist das Gegenteil von „beide grün“. Rechne 1 − P(beide grün).' : kind === 3 ? 'Zwei Pfade passen: grün-rot und rot-grün. Multipliziere jeweils und addiere.' : 'Multipliziere die beiden Wahrscheinlichkeiten entlang des Pfades.'],
        solution: steps + '.' + tree(redTreeNone(T), { res: true }),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (kind === 0 ? a + b : kind === 1 ? ra + rb : -1)) < 1e-9) return 'Du hast die Prozentsätze addiert. Für „beide“ wird multipliziert. Rechne mit Dezimalzahlen.'; if (kind === 2 && Math.abs(x - both) < 1e-9) return 'Das ist P(beide grün). Gesucht ist das Gegenteil davon.'; return null; },
        verify: function () { var u1 = [], u2 = [], i; for (i = 0; i < 100; i++) { u1.push(i < a ? 'g' : 'r'); u2.push(i < b ? 'g' : 'r'); } var f = brute(exp2(u1, u2), pred); return Math.abs(f.n / f.d * 100 - ans) < 1e-9 ? true : 'Abzählen ≠ ' + ans; } };
    },
    mindestens: function (lvl) {
      var v = M.rnd(0, 3), E, ev, res, txt, pK, unit = false;
      if (v === 0) { E = exp2(['1', '2', '3', '4', '5', '6']); var z = String(M.rnd(1, 6)); ev = ['mindestens eine ' + z, function (a, b) { return a === z || b === z; }]; pK = F(5, 6); txt = 'Du wirfst zweimal einen normalen Spielwürfel. Wie groß ist die Wahrscheinlichkeit, <b>mindestens eine ' + z + '</b> zu würfeln?'; }
      else if (v === 1) { var q = M.pick([F(1, 4), F(1, 3), F(2, 5), F(1, 5), F(3, 10)]), u = []; for (var i = 0; i < q.d; i++) u.push(i < q.n ? 'G' : 'N'); E = exp2(u); ev = ['mindestens einmal Gewinn', function (a, b) { return a === 'G' || b === 'G'; }]; pK = F(q.d - q.n, q.d); txt = 'Bei einem Glücksrad auf dem Schulfest gewinnt man mit der Wahrscheinlichkeit ' + fh(q) + '. Mia dreht zweimal. Wie groß ist die Wahrscheinlichkeit, dass sie <b>mindestens einmal</b> gewinnt?'; }
      else if (v === 2) { var spec = M.pick([{ r: 2, b: 3 }, { r: 3, b: 3 }, { r: 2, b: 4 }, { r: 3, b: 4 }, { r: 2, b: 5 }]); E = exp2(units(spec), null, true); ev = ['mindestens eine rote Kugel', function (a, b) { return a === 'r' || b === 'r'; }]; pK = M.fmul(F(spec.b, spec.r + spec.b), F(spec.b - 1, spec.r + spec.b - 1)); txt = urnTxt(spec) + ' Du ziehst zwei Kugeln <b>ohne Zurücklegen</b>. Wie groß ist die Wahrscheinlichkeit für <b>mindestens eine rote Kugel</b>?' + urn(spec); }
      else { var t = M.pick([60, 70, 80, 90]), uu = []; for (var k = 0; k < 10; k++) uu.push(k < t / 10 ? 'T' : 'F'); E = exp2(uu); ev = ['mindestens ein Treffer', function (a, b) { return a === 'T' || b === 'T'; }]; pK = F(100 - t, 100); unit = true; txt = 'Lina trifft beim Basketball-Freiwurf mit einer Wahrscheinlichkeit von <b>' + t + ' %</b>. Sie wirft zweimal. Wie groß ist die Wahrscheinlichkeit für <b>mindestens einen Treffer</b> (in Prozent)?'; }
      var none = v === 2 ? pK : M.fmul(pK, pK), res = M.fadd(F(1), F(-none.n, none.d));
      var single = v === 0 ? F(1, 6) : v === 1 ? M.fadd(F(1), F(-pK.n, pK.d)) : null;
      var inp = unit ? { kind: 'num', answer: res.n / res.d * 100, label: 'P', unit: '%', tol: 0.005 } : fracIn(res, 'P (gekürzt)', true);
      var noneTxt = v === 2 ? 'P(keine rote) = ' + frac(spec.b, spec.r + spec.b) + ' · ' + frac(spec.b - 1, spec.r + spec.b - 1) + ' = ' + fh(none) : 'P(' + (v === 0 ? 'keine ' + z : v === 1 ? 'kein Gewinn' : 'kein Treffer') + ') = ' + (unit ? fmt(pK.n / pK.d) + ' · ' + fmt(pK.n / pK.d) + ' = ' + fmt(none.n / none.d) : fh(pK) + ' · ' + fh(pK) + ' = ' + fh(none));
      return { skill: 'Gegenereignis „mindestens einmal“', level: 3, q: txt, inputs: [inp],
        hints: ['„Mindestens einmal“ hat viele Pfade. Einfacher ist das <b>Gegenereignis</b>: „keinmal“.', 'Das Gegenereignis hat nur einen Pfad. ' + noneTxt.split(' = ').slice(0, 2).join(' = ') + '.', 'P(mindestens einmal) = 1 − P(keinmal).'],
        solution: noneTxt + '. Also P(' + ev[0] + ') = 1 − ' + (unit ? fmt(none.n / none.d) + ' = ' + fmt(res.n / res.d) + ' = ' + fmt(res.n / res.d * 100) + ' %' : fh(none) + ' = ' + fh(res)) + '.',
        mistakes: function (vv) { var f = unit ? (M.parseNum(vv[0]) === null ? null : F(Math.round(M.parseNum(vv[0]) * 100), 10000)) : M.parseFrac(vv[0]); if (!f) return null; if (single && M.feq(f, M.fmul(F(2), single)) && !M.feq(f, res)) return 'Du hast die Wahrscheinlichkeit verdoppelt. Dabei zählst du den Pfad „beide Male“ doppelt. Nutze das Gegenereignis.'; if (M.feq(f, none) && !M.feq(none, res)) return 'Das ist die Wahrscheinlichkeit für „keinmal“. Ziehe sie noch von 1 ab.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) ? true : 'Abzählen ≠ Gegenereignis'; } };
    },
    lose: function (lvl) {
      var N = M.pick([10, 12, 15, 20, 25]), G = M.rnd(2, Math.min(6, Math.floor(N / 3))), u = []; for (var i = 0; i < N; i++) u.push(i < G ? 'G' : 'N');
      var E = exp2(u, null, true), T = treeOf(E), kind = lvl === 3 ? M.pick([1, 2]) : 0;
      var ev = [['zwei Gewinne', function (a, b) { return a === 'G' && b === 'G'; }], ['genau ein Gewinn', function (a, b) { return a !== b; }], ['zwei Nieten', function (a, b) { return a === 'N' && b === 'N'; }]][kind];
      var P = paths(T, ev[1]), res = sumFav(P);
      T.s1.forEach(function (a) { a.k = a.k; });
      return { skill: 'Sachaufgabe: Lose ziehen', q: 'In einer Lostrommel beim Schulfest sind ' + N + ' Lose, davon ' + G + ' Gewinne (G), der Rest sind Nieten (N). Paul zieht nacheinander zwei Lose und behält sie. Wie groß ist die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>?', inputs: [fracIn(res, 'P (gekürzt)', true)],
        hints: ['Die Lose werden nicht zurückgelegt. Beim zweiten Zug sind nur noch ' + (N - 1) + ' Lose in der Trommel.', 'Zeichne den Baum: erster Zug G mit ' + frac(G, N) + ', N mit ' + frac(N - G, N) + '. Nach G: G mit ' + frac(G - 1, N - 1) + ', nach N: G mit ' + frac(G, N - 1) + '.', kind === 1 ? 'Zwei Pfade passen: GN und NG. Multipliziere jeweils und addiere.' : 'Multipliziere entlang des passenden Pfades und kürze.'],
        solution: sumTxt(P, res) + '.' + tree(T, { res: true, hl: hlList(P), pp: P.map(function (x) { return x.fav ? x.p : null; }) }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (!f) return null; if (kind === 0 && M.feq(f, M.fmul(F(G, N), F(G, N)))) return 'Das wäre richtig mit Zurücklegen. Paul behält das erste Los, also sind beim zweiten Zug nur noch ' + (N - 1) + ' Lose da, davon ' + (G - 1) + ' Gewinne.'; if (kind === 1 && P.some(function (x) { return x.fav && M.feq(f, x.p); })) return 'Das ist nur ein Pfad. „Genau ein Gewinn“ geht auf zwei Wegen: GN und NG.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) ? true : 'Abzählen ≠ Baum'; } };
    },
    rueck: function () {
      var p = M.pick([F(1, 2), F(1, 3), F(2, 3), F(1, 4), F(3, 4), F(2, 5), F(3, 5), F(1, 5), F(4, 5), F(3, 7)]), pp = M.fmul(p, p), q = F(p.d - p.n, p.d), qq = M.fmul(q, q);
      return { skill: 'Produktregel rückwärts', level: 3, q: 'Ein Glücksrad hat ein rotes Feld. Es wird zweimal gedreht. Die Wahrscheinlichkeit für „zweimal Rot“ beträgt ' + fh(pp) + '.<br>a) Wie groß ist die Wahrscheinlichkeit für Rot bei einer Drehung?<br>b) Wie groß ist die Wahrscheinlichkeit für „zweimal nicht Rot“?',
        inputs: [fracIn(p, 'a) P(rot)', true), fracIn(qq, 'b) P(zweimal nicht rot)', true)],
        hints: ['Für „zweimal Rot“ gilt: P(rot) · P(rot) = ' + fh(pp) + '.', 'Welche Zahl ergibt mit sich selbst multipliziert ' + fh(pp) + '? Überlege für Zähler und Nenner getrennt: ' + p.n + ' · ' + p.n + ' = ' + pp.n + '.', 'P(nicht rot) = 1 − P(rot). Multipliziere dann für zwei Drehungen.'],
        solution: 'a) ' + fh(p) + ' · ' + fh(p) + ' = ' + fh(pp) + ', also P(rot) = ' + fh(p) + '. b) P(nicht rot) = 1 − ' + fh(p) + ' = ' + fh(q) + ', also ' + fh(q) + ' · ' + fh(q) + ' = ' + fh(qq) + '.',
        mistakes: function (v) { var f = M.parseFrac(v[1]); if (f && M.feq(f, M.fadd(F(1), F(-pp.n, pp.d))) && !M.feq(qq, M.fadd(F(1), F(-pp.n, pp.d)))) return 'Bei b) hast du 1 − P(zweimal rot) gerechnet. Das ist „mindestens einmal nicht rot“. Gesucht ist „zweimal nicht rot“.'; return null; },
        verify: function () { var u = []; for (var i = 0; i < p.d; i++) u.push(i < p.n ? 'r' : 'x'); var E = exp2(u); return M.feq(brute(E, function (a, b) { return a === 'r' && b === 'r'; }), pp) && M.feq(brute(E, function (a, b) { return a !== 'r' && b !== 'r'; }), qq) ? true : 'Rückrechnung falsch'; } };
    },
    spiel: function () {
      var spec = M.pick([{ r: 3, b: 1 }, { r: 3, b: 2 }, { r: 2, b: 2 }, { r: 6, b: 3 }, { r: 4, b: 2 }, { r: 3, b: 3 }, { r: 5, b: 2 }, { r: 4, b: 1 }]), E = exp2(units(spec), null, true), T = treeOf(E);
      var P = paths(T, function (a, b) { return a === b; }), same = sumFav(P), diff = M.fadd(F(1), F(-same.n, same.d));
      var ans = M.feq(same, diff) ? 2 : same.n * diff.d > diff.n * same.d ? 0 : 1;
      return { skill: 'Ist das Spiel fair?', level: 3, q: urnTxt(spec) + ' Lea zieht zwei Kugeln <b>ohne Zurücklegen</b>. Haben beide Kugeln <b>dieselbe Farbe</b>, gewinnt Lea. Sind die Farben <b>verschieden</b>, gewinnt Tom.' + urn(spec) + 'a) Wie groß ist die Wahrscheinlichkeit, dass Lea gewinnt?<br>b) Ist das Spiel fair?',
        inputs: [fracIn(same, 'a) P(Lea gewinnt) (gekürzt)', true), { kind: 'mc', label: 'b) Entscheide', options: ['Lea hat die besseren Chancen.', 'Tom hat die besseren Chancen.', 'Das Spiel ist fair.'], answer: ans }],
        hints: ['Zeichne ein Baumdiagramm ohne Zurücklegen. Lea gewinnt bei den Pfaden rr' + (spec.b >= 2 ? ' und bb' : '') + '.', 'P(rr) = ' + frac(spec.r, spec.r + spec.b) + ' · ' + frac(spec.r - 1, spec.r + spec.b - 1) + (spec.b >= 2 ? ', P(bb) = ' + frac(spec.b, spec.r + spec.b) + ' · ' + frac(spec.b - 1, spec.r + spec.b - 1) : '') + '.', 'Tom gewinnt mit 1 − P(Lea). Fair ist das Spiel, wenn beide die Wahrscheinlichkeit ' + frac(1, 2) + ' haben.'],
        solution: 'a) ' + sumTxt(P, same) + '.<br>b) P(Tom gewinnt) = 1 − ' + fh(same) + ' = ' + fh(diff) + '. ' + ['Lea hat die besseren Chancen.', 'Tom hat die besseren Chancen.', 'Beide haben die Wahrscheinlichkeit ' + frac(1, 2) + ', das Spiel ist fair.'][ans] + tree(T, { res: true, hl: hlList(P), pp: ppList(P) }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, F(1, 2)) && !M.feq(same, F(1, 2))) return 'Rate nicht. Rechne die Pfade rr und bb mit der Produktregel aus und addiere sie.'; return null; },
        verify: function () { return M.feq(brute(E, function (a, b) { return a === b; }), same) && M.feq(brute(E, function (a, b) { return a !== b; }), diff) ? true : 'Abzählen ≠ Baum'; } };
    }
  };
  function redTreeNone(T) { return T; }

  var AMP = { s1: [{ k: 'g', p: '0,4' }, { k: 'r', p: '0,6' }], s2: [0, 1].map(function () { return [{ k: 'g', p: '0,5' }, { k: 'r', p: '0,5' }]; }) };
  var URN = treeOf(exp2(units({ r: 3, b: 2 }), null, true)), URNP = paths(URN, function (a, b) { return a !== b; });
  return {
    id: '029', title: 'Produktregel', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Baumdiagramme (Modul 028), Brüche multiplizieren und addieren, Prozent',
    lead: 'Wie wahrscheinlich ist es, an zwei Ampeln hintereinander Grün zu haben? Mit der Produktregel rechnest du Wahrscheinlichkeiten entlang der Pfade im Baumdiagramm aus.',
    einstieg: { html: '<p>Emil fährt jeden Morgen mit dem Rad zur Schule. Unterwegs kommt er an zwei Ampeln vorbei. Die erste ist bei seiner Ankunft an etwa <b>40 von 100</b> Tagen grün, die zweite an etwa <b>der Hälfte</b> der Tage.</p><p class="note">An wie vielen von 100 Tagen hat Emil an <b>beiden</b> Ampeln Grün? Überlege: An den 40 „grünen“ Tagen der ersten Ampel ist die zweite ungefähr bei der Hälfte grün.</p><p>Es sind etwa 20 Tage, also 20 %. Das ist die Hälfte von 40 %, also 0,5 · 0,4. Genau so funktioniert die <b>Produktregel</b>: Entlang eines Pfades im Baumdiagramm wird multipliziert.</p>' + tree(AMP, { res: true, hl: [0], pp: ['0,2', null, null, null], label: 'Baumdiagramm Ampeln' }) },
    ziele: ['Ich berechne Pfadwahrscheinlichkeiten mit der Produktregel.', 'Ich berechne Wahrscheinlichkeiten von Ereignissen mit mehreren Pfaden (Summenregel).', 'Ich rechne beim Ziehen mit und ohne Zurücklegen richtig.', 'Ich nutze das Gegenereignis bei „mindestens einmal“.', 'Ich löse Sachaufgaben mit Ampeln, Glücksrädern und Losen.'],
    fachwoerter: [['Pfadwahrscheinlichkeit', 'Die Wahrscheinlichkeit eines Ergebnisses. Man erhält sie, indem man die Wahrscheinlichkeiten entlang des Pfades multipliziert.'], ['Produktregel', 'Pfadwahrscheinlichkeit = Produkt der Astwahrscheinlichkeiten.'], ['Summenregel', 'Gehören mehrere Pfade zu einem Ereignis, addiert man ihre Wahrscheinlichkeiten.'], ['Gegenereignis', 'Alles, was nicht zum Ereignis gehört. P(Gegenereignis) = 1 − P(Ereignis).']],
    diagnose: [
      { q: 'Berechne ' + frac(2, 3) + ' · ' + frac(3, 4) + '.', options: [frac(1, 2), frac(5, 7), frac(6, 7), 'Weiß ich noch nicht'], answer: 0, why: frac(2, 3) + ' · ' + frac(3, 4) + ' = ' + frac(6, 12) + ' = ' + frac(1, 2) + '.', review: 'Brüche multiplizieren (Modul 001)' },
      { q: 'Berechne ' + frac(1, 6) + ' + ' + frac(1, 3) + '.', options: [frac(1, 2), frac(2, 9), frac(1, 18), 'Weiß ich noch nicht'], answer: 0, why: frac(1, 6) + ' + ' + frac(2, 6) + ' = ' + frac(3, 6) + ' = ' + frac(1, 2) + '.', review: 'Brüche addieren (Klasse 6)' },
      { q: 'In einem Baumdiagramm gehen von einem Punkt zwei Äste aus. Am einen steht ' + frac(2, 5) + '. Was steht am anderen?', options: [frac(3, 5), frac(2, 5), frac(5, 2), 'Weiß ich noch nicht'], answer: 0, why: 'An jeder Verzweigung ist die Summe 1: 1 − ' + frac(2, 5) + ' = ' + frac(3, 5) + '.', review: 'Baumdiagramme (Modul 028)' },
      { q: 'Wie viel ist die Hälfte von 30 %?', options: ['15 %', '60 %', '30,5 %', 'Weiß ich noch nicht'], answer: 0, why: '0,5 · 30 % = 15 %.', review: 'Anteile von Anteilen, Prozent' }],
    erklaerung:
      '<h3>1. Die Produktregel</h3><p>Im Einstieg war die erste Ampel mit 0,4 grün, die zweite mit 0,5. Von den grünen Tagen der ersten Ampel ist die zweite in der Hälfte der Fälle auch grün. Das ist ein <b>Anteil vom Anteil</b>: 0,5 von 0,4 = 0,4 · 0,5 = 0,2.</p>' +
      '<div class="merk"><b>Merke (Produktregel):</b> Die Wahrscheinlichkeit eines Pfades ist das <b>Produkt</b> der Wahrscheinlichkeiten entlang des Pfades.<br><span class="big-math">P(grün, grün) = 0,4 · 0,5 = 0,2 = 20 %</span></div>' + tree(AMP, { res: true, pp: ['0,2', '0,2', '0,3', '0,3'], hl: [0], label: 'Ampeln mit Pfadwahrscheinlichkeiten' }) +
      '<p class="note">Kontrolle: Alle Pfadwahrscheinlichkeiten zusammen ergeben 1. Hier: 0,2 + 0,2 + 0,3 + 0,3 = 1.</p>' +
      '<h3>2. Die Summenregel</h3><p>Oft gehören <b>mehrere Pfade</b> zu einem Ereignis. „Genau eine Ampel ist grün“ sind die Pfade gr und rg.</p>' +
      '<div class="merk"><b>Merke (Summenregel):</b> Gehören mehrere Pfade zu einem Ereignis, <b>addierst</b> du ihre Pfadwahrscheinlichkeiten.<br><span class="big-math">P(genau eine grün) = 0,2 + 0,3 = 0,5</span></div>' +
      '<h3>3. Ohne Zurücklegen</h3><p>Aus einer Urne mit 3 roten und 2 blauen Kugeln ziehst du zwei Kugeln ohne Zurücklegen. Nach dem ersten Zug liegen nur noch 4 Kugeln in der Urne. Die Wahrscheinlichkeiten in Stufe 2 ändern sich.</p>' + tree(URN, { res: true, hl: hlList(URNP), pp: ppList(URNP) }) +
      '<p>P(zwei verschiedene Farben) = P(rb) + P(br) = ' + frac(3, 5) + ' · ' + frac(2, 4) + ' + ' + frac(2, 5) + ' · ' + frac(3, 4) + ' = ' + frac(6, 20) + ' + ' + frac(6, 20) + ' = ' + frac(12, 20) + ' = ' + frac(3, 5) + '.</p>' +
      '<h3>4. „Mindestens einmal“ mit dem Gegenereignis</h3><p>Wie wahrscheinlich ist <b>mindestens eine 6</b> bei zwei Würfen? Dazu gehören viele Pfade. Schneller geht es mit dem Gegenereignis „keine 6“: Das ist nur ein Pfad.</p>' +
      '<div class="merk"><b>Merke:</b> P(mindestens einmal) = 1 − P(keinmal)<br><span class="big-math">P(mindestens eine 6) = 1 − ' + frac(5, 6) + ' · ' + frac(5, 6) + ' = 1 − ' + frac(25, 36) + ' = ' + frac(11, 36) + '</span></div>' +
      '<p class="note"><b>Typischer Fehler:</b> ' + frac(1, 6) + ' + ' + frac(1, 6) + ' = ' + frac(12, 36) + ' ist zu groß. Dabei wird der Pfad „6 und 6“ doppelt gezählt.</p>',
    entdecken: {
      html: '<p>Stelle die Urne ein und wähle, ob du die erste Kugel zurücklegst. Das Baumdiagramm rechnet die Pfadwahrscheinlichkeiten mit der Produktregel aus.</p><div class="ctl"><label>Ziehen <select id="e_m"><option value="mit">mit Zurücklegen</option><option value="ohne">ohne Zurücklegen</option></select></label></div><div class="ctl"><label>rote Kugeln: <b id="e_vr"></b> <input type="range" id="e_r" min="1" max="8" step="1" value="3" style="width:150px"></label><label>blaue Kugeln: <b id="e_vb"></b> <input type="range" id="e_b" min="1" max="8" step="1" value="2" style="width:150px"></label></div><div id="e_urn"></div><div id="e_tree"></div><div id="e_res"></div><p class="note">Vergleiche P(rr) mit und ohne Zurücklegen. Wann ist der Unterschied groß, wann klein?</p>',
      init: function (root, done) {
        var n = 0, sel = root.querySelector('#e_m');
        function draw() {
          var r = +root.querySelector('#e_r').value, b = +root.querySelector('#e_b').value, ohne = sel.value === 'ohne', spec = { r: r, b: b }, E = exp2(units(spec), null, ohne), T = treeOf(E), P = paths(T);
          root.querySelector('#e_vr').textContent = r; root.querySelector('#e_vb').textContent = b;
          root.querySelector('#e_urn').innerHTML = urn(spec);
          root.querySelector('#e_tree').innerHTML = tree(T, { res: true, pp: ppList(P) });
          var get = function (pr) { return brute(E, pr); }, rr = get(function (x, y) { return x === 'r' && y === 'r'; }), bb = get(function (x, y) { return x === 'b' && y === 'b'; }), vs = get(function (x, y) { return x !== y; });
          root.querySelector('#e_res').innerHTML = '<p>P(rr) = ' + fh(rr) + ' ≈ ' + fmt(f1(rr.n / rr.d * 100)) + ' %<br>P(bb) = ' + fh(bb) + ' ≈ ' + fmt(f1(bb.n / bb.d * 100)) + ' %<br>P(verschiedene Farben) = P(rb) + P(br) = ' + fh(vs) + ' ≈ ' + fmt(f1(vs.n / vs.d * 100)) + ' %</p><p class="note">Kontrolle: ' + fh(rr) + ' + ' + fh(bb) + ' + ' + fh(vs) + ' = ' + fh(M.fadd(M.fadd(rr, bb), vs)) + '</p>';
        }
        function ch() { draw(); n++; if (n >= 3) done('Gut beobachtet: Ohne Zurücklegen wird P(rr) kleiner, denn nach einer roten Kugel gibt es weniger rote. Bei vielen Kugeln ist der Unterschied klein, bei wenigen Kugeln groß.'); }
        sel.addEventListener('change', ch); root.querySelectorAll('input[type=range]').forEach(function (x) { x.addEventListener('input', ch); });
        draw();
      }
    },
    beispiel: { title: 'Zwei Lose ziehen', q: 'In einer Lostrommel sind 10 Lose, davon 3 Gewinne. Jana zieht nacheinander zwei Lose und behält sie. Wie groß ist die Wahrscheinlichkeit, dass sie <b>genau einen Gewinn</b> zieht?',
      steps: ['Baumdiagramm ohne Zurücklegen: erster Zug G ' + frac(3, 10) + ', N ' + frac(7, 10) + '. Nach G: G ' + frac(2, 9) + ', N ' + frac(7, 9) + '. Nach N: G ' + frac(3, 9) + ', N ' + frac(6, 9) + '.', 'Passende Pfade: GN (erst Gewinn, dann Niete) und NG.', 'Produktregel: P(GN) = ' + frac(3, 10) + ' · ' + frac(7, 9) + ' = ' + frac(21, 90) + '. P(NG) = ' + frac(7, 10) + ' · ' + frac(3, 9) + ' = ' + frac(21, 90) + '.', 'Summenregel: ' + frac(21, 90) + ' + ' + frac(21, 90) + ' = ' + frac(42, 90) + ' = ' + frac(7, 15) + ' ≈ 46,7 %.', 'Antwort: Mit etwa 47 % zieht Jana genau einen Gewinn. Kontrolle: P(GG) = ' + frac(6, 90) + ', P(NN) = ' + frac(42, 90) + '. Alle zusammen: ' + frac(6, 90) + ' + ' + frac(42, 90) + ' + ' + frac(42, 90) + ' = 1.'] },
    tasks: { gen: gen, plan: { G: ['pfad:1', 'mitZ:1', 'rad:1', 'ampel:1'], S: ['pfad:2', 'mitZ:2', 'ohneZ:2', 'summe:2', 'ampel:2'], E: ['ohneZ:2', 'summe:3', 'rad:3', 'mindestens:3', 'lose:3', 'rueck:3'] },
      extra: 'spiel', test: ['pfad:2', 'mitZ:2', 'ohneZ:2', 'summe:2', 'rad:2', 'ampel:2'] },
    lerncheck: ['Ich berechne Pfadwahrscheinlichkeiten mit der Produktregel.', 'Ich addiere Pfade mit der Summenregel.', 'Ich unterscheide Ziehen mit und ohne Zurücklegen.', 'Ich nutze das Gegenereignis bei „mindestens einmal“.']
  };
})();
