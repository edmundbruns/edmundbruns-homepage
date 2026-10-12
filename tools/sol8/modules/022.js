/* Modul 022 · Haus der Vierecke */
var MODULE = (function () {
  var NAMES = ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Drachen', 'gleichschenkliges Trapez', 'Trapez'];
  var EIN = { 'Quadrat': 'ein Quadrat', 'Rechteck': 'ein Rechteck', 'Raute': 'eine Raute', 'Parallelogramm': 'ein Parallelogramm', 'Drachen': 'ein Drachen', 'gleichschenkliges Trapez': 'ein gleichschenkliges Trapez', 'Trapez': 'ein Trapez' };
  var JEDE = { 'Quadrat': 'Jedes Quadrat', 'Rechteck': 'Jedes Rechteck', 'Raute': 'Jede Raute', 'Parallelogramm': 'Jedes Parallelogramm', 'Drachen': 'Jeder Drachen', 'gleichschenkliges Trapez': 'Jedes gleichschenklige Trapez', 'Trapez': 'Jedes Trapez' };
  /* echte Viereck-Art ohne Sonderfall (für Fragen nach Eigenschaften) */
  var NUR = { 'Quadrat': 'ein Quadrat', 'Rechteck': 'ein Rechteck, das kein Quadrat ist', 'Raute': 'eine Raute, die kein Quadrat ist', 'Parallelogramm': 'ein Parallelogramm, das weder Rechteck noch Raute ist', 'Drachen': 'ein Drachen, der keine Raute ist', 'gleichschenkliges Trapez': 'ein gleichschenkliges Trapez, das kein Rechteck ist', 'Trapez': 'ein Trapez, das weder gleichschenklig noch ein Parallelogramm ist' };
  /* Haus der Vierecke: Oberbegriffe (transitiv) */
  var ANC = { 'Quadrat': ['Rechteck', 'Raute', 'Parallelogramm', 'Drachen', 'gleichschenkliges Trapez', 'Trapez'], 'Rechteck': ['Parallelogramm', 'gleichschenkliges Trapez', 'Trapez'], 'Raute': ['Parallelogramm', 'Drachen', 'Trapez'], 'Parallelogramm': ['Trapez'], 'gleichschenkliges Trapez': ['Trapez'], 'Drachen': [], 'Trapez': [] };
  var GEN = { 'Quadrat': 'eines Quadrats', 'Rechteck': 'eines Rechtecks', 'Raute': 'einer Raute', 'Parallelogramm': 'eines Parallelogramms', 'Drachen': 'eines Drachens', 'gleichschenkliges Trapez': 'eines gleichschenkligen Trapezes', 'Trapez': 'eines Trapezes' };
  var PL = { 'Quadrat': 'Quadrate', 'Rechteck': 'Rechtecke', 'Raute': 'Rauten', 'Parallelogramm': 'Parallelogramme', 'Drachen': 'Drachen', 'gleichschenkliges Trapez': 'gleichschenklige Trapeze', 'Trapez': 'Trapeze' };
  var KEIN = { 'Quadrat': 'kein Quadrat', 'Rechteck': 'kein Rechteck', 'Raute': 'keine Raute', 'Parallelogramm': 'kein Parallelogramm', 'Drachen': 'kein Drachen', 'gleichschenkliges Trapez': 'kein gleichschenkliges Trapez', 'Trapez': 'kein Trapez' };
  var DAT = { 'Quadrat': 'jedem Quadrat', 'Rechteck': 'jedem Rechteck, das kein Quadrat ist', 'Raute': 'jeder Raute, die kein Quadrat ist', 'Parallelogramm': 'jedem Parallelogramm, das weder Rechteck noch Raute ist', 'Drachen': 'jedem Drachen, der keine Raute ist', 'gleichschenkliges Trapez': 'jedem gleichschenkligen Trapez, das kein Rechteck ist' };
  var AX = { 'Quadrat': 4, 'Rechteck': 2, 'Raute': 2, 'Parallelogramm': 0, 'Drachen': 1, 'gleichschenkliges Trapez': 1, 'Trapez': 0 };

  function sub(a, b) { return [a[0] - b[0], a[1] - b[1]]; }
  function dot(u, v) { return u[0] * v[0] + u[1] * v[1]; }
  function cr(u, v) { return u[0] * v[1] - u[1] * v[0]; }
  function l2(u) { return dot(u, u); }
  function close(a, b) { return Math.abs(a - b) < 1e-9; }
  /* Eigenschaften aus den Eckpunkten (ganzzahlig: exakt) */
  function props(P) {
    var e = [0, 1, 2, 3].map(function (i) { return sub(P[(i + 1) % 4], P[i]); }), L = e.map(l2);
    var c = [0, 1, 2, 3].map(function (i) { return cr(e[i], e[(i + 1) % 4]); });
    var convex = c.every(function (x) { return x > 0; }) || c.every(function (x) { return x < 0; });
    var par1 = close(cr(e[0], e[2]), 0), par2 = close(cr(e[1], e[3]), 0);
    var right = [0, 1, 2, 3].filter(function (i) { return close(dot(e[(i + 3) % 4], e[i]), 0); });
    var axAC = close(L[0], L[3]) && close(L[1], L[2]), axBD = close(L[0], L[1]) && close(L[3], L[2]);
    var mAB = par1 && close(L[1], L[3]) && close(dot([P[0][0] + P[1][0] - P[2][0] - P[3][0], P[0][1] + P[1][1] - P[2][1] - P[3][1]], e[0]), 0);
    var mBC = par2 && close(L[0], L[2]) && close(dot([P[1][0] + P[2][0] - P[3][0] - P[0][0], P[1][1] + P[2][1] - P[3][1] - P[0][1]], e[1]), 0);
    var d1 = sub(P[2], P[0]), d2 = sub(P[3], P[1]);
    var bis = close(P[0][0] + P[2][0], P[1][0] + P[3][0]) && close(P[0][1] + P[2][1], P[1][1] + P[3][1]);
    var den = cr(d1, d2), t = den ? cr(sub(P[1], P[0]), d2) / den : -1, s = den ? cr(sub(P[1], P[0]), d1) / den : -1;
    var allEq = close(L[0], L[1]) && close(L[1], L[2]) && close(L[2], L[3]);
    return { e: e, L: L, convex: convex, par1: par1, par2: par2, par: (par1 ? 1 : 0) + (par2 ? 1 : 0), right: right, nRight: right.length, allEq: allEq,
      axAC: axAC, axBD: axBD, mAB: mAB, mBC: mBC, axDiag: (axAC ? 1 : 0) + (axBD ? 1 : 0), axMid: (mAB ? 1 : 0) + (mBC ? 1 : 0),
      axes: (axAC ? 1 : 0) + (axBD ? 1 : 0) + (mAB ? 1 : 0) + (mBC ? 1 : 0),
      dEq: close(l2(d1), l2(d2)), dPerp: close(dot(d1, d2), 0), dBis: bis, oneBis: !bis && (close(t, 0.5) || close(s, 0.5)),
      kiteSides: (close(L[0], L[3]) && close(L[1], L[2])) || (close(L[0], L[1]) && close(L[2], L[3])) };
  }
  function classify(P) {
    var p = props(P); if (!p.convex) return 'nicht konvex';
    if (p.par === 2) return p.allEq ? (p.nRight === 4 ? 'Quadrat' : 'Raute') : (p.nRight === 4 ? 'Rechteck' : 'Parallelogramm');
    if (p.par === 1) return p.axMid ? 'gleichschenkliges Trapez' : 'Trapez';
    return p.axDiag ? 'Drachen' : 'allgemeines Viereck';
  }
  /* unabhängige zweite Einordnung über die Diagonalen */
  function classifyDiag(P) {
    var d1 = sub(P[2], P[0]), d2 = sub(P[3], P[1]), den = cr(d1, d2); if (!den) return '?';
    var t = cr(sub(P[1], P[0]), d2) / den, s = cr(sub(P[1], P[0]), d1) / den;
    if (!(t > 0 && t < 1 && s > 0 && s < 1)) return 'nicht konvex';
    var eq = close(l2(d1), l2(d2)), perp = close(dot(d1, d2), 0), bis = close(t, 0.5) && close(s, 0.5);
    if (bis) return eq && perp ? 'Quadrat' : eq ? 'Rechteck' : perp ? 'Raute' : 'Parallelogramm';
    if (perp && (close(t, 0.5) || close(s, 0.5))) return 'Drachen';
    var par = close(cr(sub(P[1], P[0]), sub(P[3], P[2])), 0) || close(cr(sub(P[2], P[1]), sub(P[0], P[3])), 0);
    if (par) return eq ? 'gleichschenkliges Trapez' : 'Trapez';
    return 'allgemeines Viereck';
  }
  /* Zufallsformen auf dem Gitter */
  function d4(P) { var k = M.rnd(0, 7); return P.map(function (p) { var x = p[0], y = p[1]; if (k & 4) x = -x; for (var i = 0; i < (k & 3); i++) { var t = x; x = -y; y = t; } return [x, y]; }); }
  function norm(P) { var mx = Math.min.apply(null, P.map(function (p) { return p[0]; })), my = Math.min.apply(null, P.map(function (p) { return p[1]; })); return P.map(function (p) { return [p[0] - mx, p[1] - my]; }); }
  function raw(type, lvl) {
    var r = M.rnd, a, b, h, s, k, m, n, tilt = lvl >= 2 && Math.random() < 0.6;
    switch (type) {
      case 'Quadrat': if (tilt) { a = r(1, 3); b = r(1, 3); return [[b, 0], [a + b, b], [a, a + b], [0, a]]; } a = r(2, 5); return [[0, 0], [a, 0], [a, a], [0, a]];
      case 'Rechteck': if (tilt) { a = r(1, 2); b = r(1, 2); k = r(2, 3); return [[k * b, 0], [k * b + a, b], [a, b + k * a], [0, k * a]]; } a = r(3, 7); b = r(2, 5); if (a === b) a++; return [[0, 0], [a, 0], [a, b], [0, b]];
      case 'Raute': if (tilt) { if (Math.random() < 0.4) return [[0, 0], [5, 0], [8, 4], [3, 4]]; m = r(1, 3); n = r(1, 3); if (m === n) n = m + 1; return [[0, 0], [m, n], [m + n, n + m], [n, m]]; }
        a = r(2, 4); b = r(1, 3); if (a === b) a++; return [[0, b], [a, 0], [2 * a, b], [a, 2 * b]];
      case 'Parallelogramm': if (tilt) { var u = [r(2, 5), r(1, 2)], v = [r(-2, 1), r(2, 4)]; return [[0, 0], u, [u[0] + v[0], u[1] + v[1]], v]; }
        a = r(3, 6); h = r(2, 4); s = M.pick([-2, -1, 1, 2, 3]); return [[0, 0], [a, 0], [a + s, h], [s, h]];
      case 'Drachen': if (tilt) { k = r(3, 5); m = r(2, 5); n = r(-1, m - 1); return [[0, 0], [m, n], [k, k], [n, m]]; }
        a = r(1, 3); h = r(1, 3); b = r(2, 5); if (b === h) b++; return [[a, 0], [2 * a, h], [a, h + b], [0, h]];
      case 'gleichschenkliges Trapez': a = r(4, 8); s = r(1, Math.floor((a - 1) / 2)); h = r(2, 4); return [[0, 0], [a, 0], [a - s, h], [s, h]];
      default: a = r(4, 8); h = r(2, 4); var c1 = r(-1, 3), c2 = c1 + r(1, a - 1); return [[0, 0], [a, 0], [c2, h], [c1, h]];
    }
  }
  function shape(type, lvl) {
    for (var t = 0; t < 300; t++) { var P = norm(d4(raw(type, lvl))); var w = Math.max.apply(null, P.map(function (p) { return Math.max(p[0], p[1]); })); if (w <= 9 && classify(P) === type) return P; }
    throw new Error('Form ' + type);
  }
  var SAMPLES = null;
  function samples() { if (!SAMPLES) { SAMPLES = {}; NAMES.forEach(function (t) { SAMPLES[t] = []; for (var i = 0; i < 12; i++) SAMPLES[t].push(props(shape(t, i % 2 + 1))); }); } return SAMPLES; }

  /* Zeichnung: Gitter, Markierungen, Symmetrieachsen, Diagonalen */
  function drawQ(P, o) {
    o = o || {};
    var all = P.concat(o.extra || []);
    var xs = all.map(function (p) { return p[0]; }), ys = all.map(function (p) { return p[1]; });
    var x0 = o.range ? o.range[0] : Math.min.apply(null, xs) - 1, x1 = o.range ? o.range[1] : Math.max.apply(null, xs) + 1;
    var y0 = o.range ? o.range[2] : Math.min.apply(null, ys) - 1, y1 = o.range ? o.range[3] : Math.max.apply(null, ys) + 1;
    var u = o.u || Math.min(34, 330 / (x1 - x0), 250 / (y1 - y0)), W = (x1 - x0) * u, H = (y1 - y0) * u;
    function X(x) { return +((x - x0) * u).toFixed(1); } function Y(y) { return +(H - (y - y0) * u).toFixed(1); }
    var g = '<svg class="viz" viewBox="0 0 ' + W.toFixed(0) + ' ' + H.toFixed(0) + '" role="img" aria-label="' + (o.label || 'Viereck') + '" style="max-width:' + Math.min(420, Math.round(W * 1.15)) + 'px">';
    if (o.grid !== false) {
      for (var i = Math.ceil(x0); i <= x1; i++) g += '<line x1="' + X(i) + '" y1="0" x2="' + X(i) + '" y2="' + H.toFixed(0) + '" stroke="#e3dcf2"/>';
      for (var j = Math.ceil(y0); j <= y1; j++) g += '<line x1="0" y1="' + Y(j) + '" x2="' + W.toFixed(0) + '" y2="' + Y(j) + '" stroke="#e3dcf2"/>';
      if (o.axes) {
        g += '<line x1="0" y1="' + Y(0) + '" x2="' + W.toFixed(0) + '" y2="' + Y(0) + '" stroke="#1c1830" stroke-width="1.4"/><line x1="' + X(0) + '" y1="0" x2="' + X(0) + '" y2="' + H.toFixed(0) + '" stroke="#1c1830" stroke-width="1.4"/>';
        var near = function (x, y) { return x < 8 || y < 10 || x > W - 8 || y > H - 2 || P.some(function (p) { return Math.abs(X(p[0]) - x) < 22 && Math.abs(Y(p[1]) - y) < 22; }); };
        for (var q = Math.ceil(x0); q <= x1; q++) if (q && q % 2 === 0 && !near(X(q), Y(0) + 13)) g += '<text x="' + X(q) + '" y="' + (Y(0) + 13) + '" font-size="10" text-anchor="middle" fill="#5a5670">' + M.fmtNum(q) + '</text>';
        for (var w2 = Math.ceil(y0); w2 <= y1; w2++) if (w2 && w2 % 2 === 0 && !near(X(0) - 6, Y(w2) + 4)) g += '<text x="' + (X(0) - 4) + '" y="' + (Y(w2) + 4) + '" font-size="10" text-anchor="end" fill="#5a5670">' + M.fmtNum(w2) + '</text>';
      }
    }
    var pr = o.marks || o.sym ? props(P) : null;
    g += '<polygon points="' + P.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" fill="#efeafb" fill-opacity="0.85" stroke="#3d2a73" stroke-width="2.5" stroke-linejoin="round"/>';
    if (o.diags) g += '<line x1="' + X(P[0][0]) + '" y1="' + Y(P[0][1]) + '" x2="' + X(P[2][0]) + '" y2="' + Y(P[2][1]) + '" stroke="#5b3fa0" stroke-width="1.5" stroke-dasharray="3 3"/><line x1="' + X(P[1][0]) + '" y1="' + Y(P[1][1]) + '" x2="' + X(P[3][0]) + '" y2="' + Y(P[3][1]) + '" stroke="#5b3fa0" stroke-width="1.5" stroke-dasharray="3 3"/>';
    if (o.sym && pr.convex) {
      var lines = [];
      if (pr.axAC) lines.push([P[0], P[2]]); if (pr.axBD) lines.push([P[1], P[3]]);
      if (pr.mAB) lines.push([[(P[0][0] + P[1][0]) / 2, (P[0][1] + P[1][1]) / 2], [(P[2][0] + P[3][0]) / 2, (P[2][1] + P[3][1]) / 2]]);
      if (pr.mBC) lines.push([[(P[1][0] + P[2][0]) / 2, (P[1][1] + P[2][1]) / 2], [(P[3][0] + P[0][0]) / 2, (P[3][1] + P[0][1]) / 2]]);
      lines.forEach(function (ln) { var d = sub(ln[1], ln[0]), l = Math.sqrt(l2(d)) || 1, ex = 0.45 / l; g += '<line x1="' + X(ln[0][0] - d[0] * ex) + '" y1="' + Y(ln[0][1] - d[1] * ex) + '" x2="' + X(ln[1][0] + d[0] * ex) + '" y2="' + Y(ln[1][1] + d[1] * ex) + '" stroke="#d97706" stroke-width="2" stroke-dasharray="7 4"/>'; });
    }
    var S = P.map(function (p) { return [X(p[0]), Y(p[1])]; });
    if (o.marks && pr.convex) {
      var groups = [], tick = [0, 0, 0, 0];
      pr.L.forEach(function (Lv, i) { var gi = groups.findIndex(function (gg) { return close(gg.v, Lv); }); if (gi < 0) { groups.push({ v: Lv, m: [i] }); } else groups[gi].m.push(i); });
      var cnt = 0; groups.forEach(function (gg) { if (gg.m.length >= 2) { cnt++; gg.m.forEach(function (i) { tick[i] = cnt; }); } });
      for (var s = 0; s < 4; s++) if (tick[s]) {
        var a = S[s], b = S[(s + 1) % 4], tt = o.sym && ((s % 2 === 0 && pr.mAB) || (s % 2 === 1 && pr.mBC)) ? 0.3 : 0.5, mx = a[0] + (b[0] - a[0]) * tt, my = a[1] + (b[1] - a[1]) * tt, dx = b[0] - a[0], dy = b[1] - a[1], ll = Math.hypot(dx, dy), ux = dx / ll, uy = dy / ll;
        for (var k = 0; k < tick[s]; k++) { var off = (k - (tick[s] - 1) / 2) * 5; g += '<line x1="' + (mx + ux * off - uy * 6).toFixed(1) + '" y1="' + (my + uy * off + ux * 6).toFixed(1) + '" x2="' + (mx + ux * off + uy * 6).toFixed(1) + '" y2="' + (my + uy * off - ux * 6).toFixed(1) + '" stroke="#d97706" stroke-width="2"/>'; }
      }
      pr.right.forEach(function (i) {
        var v = S[i], p1 = S[(i + 3) % 4], p2 = S[(i + 1) % 4], a1 = [p1[0] - v[0], p1[1] - v[1]], a2 = [p2[0] - v[0], p2[1] - v[1]], n1 = Math.hypot(a1[0], a1[1]), n2 = Math.hypot(a2[0], a2[1]), z = 9;
        var q1 = [v[0] + a1[0] / n1 * z, v[1] + a1[1] / n1 * z], q2 = [v[0] + a2[0] / n2 * z, v[1] + a2[1] / n2 * z], q3 = [q1[0] + a2[0] / n2 * z, q1[1] + a2[1] / n2 * z];
        g += '<path d="M' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) + ' L' + q3[0].toFixed(1) + ' ' + q3[1].toFixed(1) + ' L' + q2[0].toFixed(1) + ' ' + q2[1].toFixed(1) + '" fill="none" stroke="#5b3fa0" stroke-width="1.6"/><circle cx="' + ((v[0] + q3[0]) / 2).toFixed(1) + '" cy="' + ((v[1] + q3[1]) / 2).toFixed(1) + '" r="1.6" fill="#5b3fa0"/>';
      });
    }
    var cx = S.reduce(function (t, p) { return t + p[0]; }, 0) / 4, cy = S.reduce(function (t, p) { return t + p[1]; }, 0) / 4;
    if (o.angles) S.forEach(function (q, i) {
      if (!o.angles[i]) return;
      var pv = S[(i + 3) % 4], nx = S[(i + 1) % 4], b1 = Math.atan2(pv[1] - q[1], pv[0] - q[0]), b2 = Math.atan2(nx[1] - q[1], nx[0] - q[0]);
      var bis = Math.atan2(Math.sin(b1) + Math.sin(b2), Math.cos(b1) + Math.cos(b2)), r = 20, sweep = ((b2 - b1 + 2 * Math.PI) % (2 * Math.PI)) > Math.PI ? 0 : 1;
      g += '<path d="M' + (q[0] + r * Math.cos(b1)).toFixed(1) + ' ' + (q[1] + r * Math.sin(b1)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 ' + sweep + ' ' + (q[0] + r * Math.cos(b2)).toFixed(1) + ' ' + (q[1] + r * Math.sin(b2)).toFixed(1) + '" fill="none" stroke="#d97706" stroke-width="2"/>';
      var half = Math.acos(Math.max(-1, Math.min(1, Math.cos(b1 - b2)))) / 2, dist = Math.max(42, Math.min(70, 26 / Math.max(Math.sin(half), 0.25) + 6));
      g += '<text x="' + (q[0] + dist * Math.cos(bis)).toFixed(1) + '" y="' + (q[1] + dist * Math.sin(bis) + 5).toFixed(1) + '" font-size="14" font-weight="700" text-anchor="middle" stroke="#fff" stroke-width="3" paint-order="stroke" fill="' + (o.angles[i].indexOf('?') >= 0 ? '#b91c1c' : '#1c1830') + '">' + o.angles[i] + '</text>';
    });
    if (o.names !== false) ['A', 'B', 'C', 'D'].forEach(function (nm, i) { var ox = S[i][0] - cx, oy = S[i][1] - cy, ol = Math.hypot(ox, oy) || 1; g += '<text x="' + (S[i][0] + 13 * ox / ol).toFixed(1) + '" y="' + (S[i][1] + 13 * oy / ol + 5).toFixed(1) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#3d2a73" stroke="#fff" stroke-width="3" paint-order="stroke">' + nm + '</text>'; });
    (o.dots || []).forEach(function (d) { g += '<circle cx="' + X(d[0]) + '" cy="' + Y(d[1]) + '" r="4" fill="#d97706"/>' + (d[2] ? '<text x="' + (X(d[0]) + 8) + '" y="' + (Y(d[1]) - 6) + '" font-size="13" font-weight="700" fill="#b45309" stroke="#fff" stroke-width="3" paint-order="stroke">' + d[2] + '</text>' : ''); });
    return g + '</svg>';
  }
  function propText(p) {
    var gl = p.allEq ? 'alle vier Seiten' : p.kiteSides && !p.par ? 'je zwei benachbarte Seiten' : (close(p.L[0], p.L[2]) && close(p.L[1], p.L[3])) ? 'gegenüberliegende Seiten' : (close(p.L[1], p.L[3]) || close(p.L[0], p.L[2])) ? 'zwei gegenüberliegende Seiten' : 'keine';
    return '<ul><li>Paare paralleler Seiten: <b>' + p.par + '</b></li><li>Gleich lang: <b>' + gl + '</b></li><li>Rechte Winkel: <b>' + p.nRight + '</b></li><li>Symmetrieachsen: <b>' + p.axes + '</b></li><li>Diagonalen: <b>' + (p.dEq ? 'gleich lang' : 'verschieden lang') + ', ' + (p.dPerp ? 'senkrecht zueinander' : 'nicht senkrecht') + ', ' + (p.dBis ? 'halbieren sich' : p.oneBis ? 'nur eine wird halbiert' : 'halbieren sich nicht') + '</b></li></ul>';
  }
  function pz(x) { return x < 0 ? '(' + M.fmtNum(x) + ')' : M.fmtNum(x); }
  function step(dx, dy) { var t = []; if (dx) t.push(dx > 0 ? dx + ' nach rechts' : -dx + ' nach links'); if (dy) t.push(dy > 0 ? dy + ' nach oben' : -dy + ' nach unten'); return t.join(' und '); }
  function coord(p) { return '(' + M.fmtNum(p[0]) + ' | ' + M.fmtNum(p[1]) + ')'; }
  function nameMC(type, opts) { opts = opts || NAMES; return { kind: 'mc', label: 'Genauester Name', options: opts.slice(), answer: opts.indexOf(type) }; }
  function nameMistakes(type, opts) {
    return function (v) { var ch = opts[+v[0]]; if (ch && ANC[type].indexOf(ch) >= 0) return 'Das stimmt zwar auch, denn ' + EIN[type] + ' ist auch ' + EIN[ch] + '. Gesucht ist aber der <b>genaueste</b> Name. Prüfe, welche zusätzlichen Eigenschaften die Figur hat.'; if (ch && ANC[ch] && ANC[ch].indexOf(type) >= 0) return 'Zu genau: ' + EIN[ch] + ' müsste mehr Eigenschaften haben. Prüfe die Seitenlängen und Winkel noch einmal.'; return null; };
  }
  var STECK = {
    'Quadrat': [['Alle vier Seiten sind gleich lang.', 'Alle vier Winkel sind rechte Winkel.'], function (p) { return p.allEq && p.nRight === 4; }, ['Es hat vier Symmetrieachsen.'], function (p) { return p.axes === 4; }],
    'Rechteck': [['Alle vier Winkel sind rechte Winkel.', 'Benachbarte Seiten sind verschieden lang.'], function (p) { return p.nRight === 4 && !p.allEq; }, ['Die Diagonalen sind gleich lang und halbieren sich.', 'Die Diagonalen stehen nicht senkrecht aufeinander.'], function (p) { return p.dEq && p.dBis && !p.dPerp; }],
    'Raute': [['Alle vier Seiten sind gleich lang.', 'Es hat keinen rechten Winkel.'], function (p) { return p.allEq && p.nRight === 0; }, ['Die Diagonalen halbieren sich und stehen senkrecht aufeinander.', 'Die Diagonalen sind verschieden lang.'], function (p) { return p.dBis && p.dPerp && !p.dEq; }],
    'Parallelogramm': [['Gegenüberliegende Seiten sind parallel.', 'Es hat keine Symmetrieachse.'], function (p) { return p.par === 2 && p.axes === 0; }, ['Die Diagonalen halbieren sich.', 'Sie sind verschieden lang und stehen nicht senkrecht aufeinander.'], function (p) { return p.dBis && !p.dEq && !p.dPerp; }],
    'Drachen': [['Es hat genau eine Symmetrieachse.', 'Diese Achse verläuft durch zwei gegenüberliegende Ecken.'], function (p) { return p.axDiag === 1 && p.axMid === 0; }, ['Je zwei benachbarte Seiten sind gleich lang.', 'Keine Seiten sind parallel.'], function (p) { return p.kiteSides && p.par === 0; }],
    'gleichschenkliges Trapez': [['Genau ein Paar gegenüberliegender Seiten ist parallel.', 'Es hat genau eine Symmetrieachse.'], function (p) { return p.par === 1 && p.axes === 1; }, ['Genau ein Paar gegenüberliegender Seiten ist parallel.', 'Die beiden Diagonalen sind gleich lang.'], function (p) { return p.par === 1 && p.dEq; }],
    'Trapez': [['Genau ein Paar gegenüberliegender Seiten ist parallel.', 'Es hat keine Symmetrieachse.'], function (p) { return p.par === 1 && p.axes === 0; }, ['Zwei Seiten sind parallel, die anderen beiden nicht.', 'Die Diagonalen sind verschieden lang.'], function (p) { return p.par === 1 && !p.dEq; }]
  };
  var DIAG = [
    ['sind gleich lang, halbieren sich und stehen senkrecht aufeinander.', [1, 1, 1, 0]],
    ['sind gleich lang und halbieren sich. Sie stehen nicht senkrecht aufeinander.', [1, 0, 1, 0]],
    ['halbieren sich und stehen senkrecht aufeinander. Sie sind verschieden lang.', [0, 1, 1, 0]],
    ['halbieren sich. Sie sind verschieden lang und nicht senkrecht zueinander.', [0, 0, 1, 0]],
    ['stehen senkrecht aufeinander. Nur eine Diagonale wird von der anderen halbiert.', [-1, 1, 0, 1]],
    ['sind gleich lang, halbieren sich aber nicht.', [1, -1, 0, 0]]];
  var DIAG_OF = { 'Quadrat': 0, 'Rechteck': 1, 'Raute': 2, 'Parallelogramm': 3, 'Drachen': 4, 'gleichschenkliges Trapez': 5 };
  function sampleOk(type, fn) { return samples()[type].every(fn); }
  function isA(x, y) { return x === y || ANC[x].indexOf(y) >= 0; }
  function defOf(y) { return { 'Trapez': function (p) { return p.par >= 1; }, 'Parallelogramm': function (p) { return p.par === 2; }, 'Rechteck': function (p) { return p.nRight === 4; }, 'Raute': function (p) { return p.allEq; }, 'Quadrat': function (p) { return p.allEq && p.nRight === 4; }, 'Drachen': function (p) { return p.axDiag >= 1; }, 'gleichschenkliges Trapez': function (p) { return p.axMid >= 1; } }[y]; }

  var gen = {
    gitter: function (lvl) {
      var type = M.pick(NAMES), P = shape(type, lvl), opts = NAMES.slice(), p = props(P);
      return { skill: 'Viereck im Gitter erkennen', q: 'Wie heißt dieses Viereck? Wähle den <b>genauesten</b> Namen. Zähle dazu die Kästchen.' + drawQ(P), inputs: [nameMC(type, opts)],
        hints: ['Prüfe zuerst: Welche Seiten sind parallel? Zähle bei jeder Seite, wie viele Kästchen sie nach rechts und nach oben geht.', 'Prüfe dann: Welche Seiten sind gleich lang? Gibt es rechte Winkel?', 'Hier gilt: ' + p.par + ' Paar(e) paralleler Seiten, ' + p.nRight + ' rechte Winkel, ' + p.axes + ' Symmetrieachse(n).'],
        solution: 'Es ist ' + EIN[type] + '.' + drawQ(P, { marks: true, sym: true }) + propText(p), mistakes: nameMistakes(type, opts),
        verify: function () { return classifyDiag(P) === type || 'Diagonalen-Prüfung ergibt ' + classifyDiag(P); } };
    },
    koord: function () {
      var type = M.pick(NAMES), P = shape(type, 2), sh = [M.rnd(-3, 1), M.rnd(-2, 1)];
      P = P.map(function (p) { return [p[0] + sh[0], p[1] + sh[1]]; });
      var opts = NAMES.slice(), p = props(P);
      return { skill: 'Viereck aus Koordinaten', level: 3, q: 'Zeichne das Viereck mit A' + coord(P[0]) + ', B' + coord(P[1]) + ', C' + coord(P[2]) + ' und D' + coord(P[3]) + ' in ein Koordinatensystem. Welcher Name passt am genauesten?', inputs: [nameMC(type, opts)],
        hints: ['Trage die Punkte ein und verbinde A, B, C, D der Reihe nach und D wieder mit A.', 'Bestimme für jede Seite, wie viele Kästchen sie nach rechts und nach oben geht. Gleiche Schritte bedeuten parallel und gleich lang.', 'Hier gilt: ' + p.par + ' Paar(e) paralleler Seiten, ' + p.nRight + ' rechte Winkel, ' + p.axes + ' Symmetrieachse(n).'],
        solution: drawQ(P, { axes: true, marks: true, sym: true, extra: [[0, 0]] }) + 'Es ist ' + EIN[type] + '.' + propText(p), mistakes: nameMistakes(type, opts),
        verify: function () { return classifyDiag(P) === type || 'Diagonalen-Prüfung ergibt ' + classifyDiag(P); } };
    },
    wahrfalsch: function () {
      var x, y, ok;
      for (;;) { x = M.pick(NAMES); y = M.pick(NAMES); if (x === y) continue; if ((x === 'Parallelogramm' || x === 'Raute') && y === 'gleichschenkliges Trapez') continue; ok = isA(x, y); if (ok === (Math.random() < 0.5)) break; }
      var expl = ok ? JEDE[x] + ' hat alle Eigenschaften ' + GEN[y] + '. Im Haus der Vierecke führt von „' + x + '“ eine Linie nach oben zu „' + y + '“.'
        : 'Es gibt ' + PL[x] + ', die ' + KEIN[y] + ' sind. Hier ein Beispiel:' + drawQ(shape(x, 1), { marks: true, sym: true });
      return { skill: 'Ober- und Unterbegriffe', q: 'Ist die Aussage wahr oder falsch?<p class="big-math">„' + JEDE[x] + ' ist ' + EIN[y] + '.“</p>', inputs: [{ kind: 'mc', label: 'Die Aussage ist …', options: ['wahr', 'falsch'], answer: ok ? 0 : 1 }],
        hints: ['Überlege, welche Eigenschaften ' + EIN[y] + ' haben muss.', 'Hat wirklich ' + JEDE[x].replace(/^J/, 'j') + ' diese Eigenschaften? Ein einziges Gegenbeispiel reicht für „falsch“.', 'Schau im Haus der Vierecke nach: Führt von „' + x + '“ eine Linie nach oben zu „' + y + '“?'],
        solution: '<b>' + (ok ? 'Wahr.' : 'Falsch.') + '</b> ' + expl,
        verify: function () { var all = samples()[x].every(defOf(y)); return all === ok || 'Stichprobe widerspricht: ' + x + ' / ' + y; } };
    },
    steckbrief: function (lvl) {
      var type = M.pick(NAMES), st = STECK[type], alt = lvl >= 2 && Math.random() < 0.6, txt = alt ? st[2] : st[0], pred = alt ? st[3] : st[1];
      var others = M.shuffle(NAMES.filter(function (n) { return n !== type; })), opts = M.shuffle([type].concat(ANC[type].slice(0, 1), others.filter(function (n) { return ANC[type].indexOf(n) < 0; }).slice(0, ANC[type].length ? 2 : 3)));
      return { skill: 'Viereck aus Eigenschaften', q: 'Ein Viereck hat diesen Steckbrief:<ul>' + txt.map(function (t) { return '<li>' + t + '</li>'; }).join('') + '</ul>Welcher Name passt am genauesten?', inputs: [nameMC(type, opts)],
        hints: ['Lies jede Eigenschaft einzeln und streiche Vierecke, die sie nicht erfüllen.', 'Achte auf Wörter wie „genau“, „keine“ und „alle“. Sie schließen besondere Vierecke aus.', 'Nutze die Tabelle in der Erklärung. Nur ein Viereck erfüllt alle Angaben ohne zusätzliche Eigenschaften.'],
        solution: 'Das ist ' + EIN[type] + '.' + drawQ(shape(type, 1), { marks: true, sym: true, diags: alt }), mistakes: nameMistakes(type, opts),
        verify: function () { var S = samples(); if (!S[type].every(pred)) return 'Steckbrief passt nicht zu ' + type; for (var k = 0; k < NAMES.length; k++) if (NAMES[k] !== type && S[NAMES[k]].some(pred)) return 'Steckbrief passt auch zu ' + NAMES[k]; return true; } };
    },
    eigenschaft: function (lvl) {
      var type = M.pick(lvl >= 2 ? NAMES : ['Quadrat', 'Rechteck', 'Raute', 'Parallelogramm', 'Drachen']), P = shape(type, 1), ans = AX[type];
      return { skill: 'Symmetrieachsen', q: 'Wie viele Symmetrieachsen hat ' + NUR[type] + '?' + drawQ(P, { marks: true }), inputs: [{ kind: 'num', answer: ans, label: 'Anzahl der Symmetrieachsen' }],
        hints: ['Eine Symmetrieachse teilt die Figur so, dass beide Hälften beim Falten genau aufeinanderliegen.', 'Prüfe die Diagonalen und die Mittellinien (sie verbinden die Mitten gegenüberliegender Seiten).', type === 'Parallelogramm' ? 'Falte ein Parallelogramm aus Papier entlang einer Diagonalen. Passen die Hälften aufeinander?' : 'Zähle nur die Linien, bei denen die Hälften genau aufeinanderpassen.'],
        solution: NUR[type].charAt(0).toUpperCase() + NUR[type].slice(1) + ' hat <b>' + ans + '</b> Symmetrieachse' + (ans === 1 ? '' : 'n') + '.' + drawQ(P, { marks: true, sym: true }) + (type === 'Parallelogramm' ? 'Das Parallelogramm ist nicht achsensymmetrisch, aber punktsymmetrisch: Eine halbe Drehung um den Diagonalenschnittpunkt bildet es auf sich selbst ab.' : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (type === 'Parallelogramm' && x === 2) return 'Die Diagonalen eines Parallelogramms sind keine Symmetrieachsen. Faltest du entlang einer Diagonalen, passen die Hälften nicht aufeinander.'; if (type === 'Rechteck' && x === 4) return 'Beim Rechteck sind die Diagonalen keine Symmetrieachsen. Nur die beiden Mittellinien sind es.'; if (type === 'Raute' && x === 4) return 'Bei der Raute sind nur die Diagonalen Symmetrieachsen, nicht die Mittellinien.'; return null; },
        verify: function () { return sampleOk(type, function (p) { return p.axes === ans; }) || 'Achsenzahl falsch'; } };
    },
    diagonalen: function () {
      var type = M.pick(Object.keys(DIAG_OF)), idx = DIAG_OF[type], pool = [idx].concat(M.shuffle([0, 1, 2, 3, 4, 5].filter(function (i) { return i !== idx; })).slice(0, 3)), opts = M.shuffle(pool);
      var P = shape(type, 1);
      return { skill: 'Diagonalen untersuchen', q: 'Welche Aussage gilt für die Diagonalen in ' + DAT[type] + '?<br>Die Diagonalen …',
        inputs: [{ kind: 'mc', label: 'Die Diagonalen …', options: opts.map(function (i) { return DIAG[i][0]; }), answer: opts.indexOf(idx) }],
        hints: ['Zeichne die Figur und ihre beiden Diagonalen ins Heft. Die Diagonalen verbinden gegenüberliegende Ecken.', 'Miss beide Diagonalen und prüfe den Winkel an ihrem Schnittpunkt.', 'Prüfe auch, ob der Schnittpunkt jeweils genau in der Mitte der Diagonalen liegt.'],
        solution: 'Die Diagonalen ' + DIAG[idx][0] + drawQ(P, { diags: true, marks: true }),
        verify: function () {
          function fits(f) { return function (p) { return [p.dEq, p.dPerp, p.dBis, p.oneBis].every(function (x, k) { return f[k] < 0 || +x === f[k]; }); }; }
          if (!sampleOk(type, fits(DIAG[idx][1]))) return 'Diagonalen-Aussage stimmt nicht';
          for (var k = 0; k < opts.length; k++) if (opts[k] !== idx && sampleOk(type, fits(DIAG[opts[k]][1]))) return 'Ablenker auch wahr';
          return true; } };
    },
    winkel: function (lvl) {
      var type = M.pick(lvl >= 2 ? ['Parallelogramm', 'Raute', 'gleichschenkliges Trapez'] : ['Parallelogramm', 'Raute']), al = 5 * M.rnd(9, 16), names = ['α', 'β', 'γ', 'δ'], P, an;
      if (type === 'gleichschenkliges Trapez') { var a = 9, d = 4, c = a - 2 * d * Math.cos(al * Math.PI / 180); P = [[0, 0], [a, 0], [a - d * Math.cos(al * Math.PI / 180), d * Math.sin(al * Math.PI / 180)], [d * Math.cos(al * Math.PI / 180), d * Math.sin(al * Math.PI / 180)]]; an = [al, al, 180 - al, 180 - al]; if (c < 1) return gen.winkel(lvl); }
      else { var aa = type === 'Raute' ? 5 : 7, dd = 5, D = [dd * Math.cos(al * Math.PI / 180), dd * Math.sin(al * Math.PI / 180)]; P = [[0, 0], [aa, 0], [aa + D[0], D[1]], D]; an = [al, 180 - al, al, 180 - al]; }
      var ask = M.rnd(1, 3), lab = names.map(function (n, i) { return i === 0 ? 'α = ' + al + '°' : i === ask ? n + ' = ?' : ''; });
      var rule = type === 'gleichschenkliges Trapez' ? 'Im gleichschenkligen Trapez sind die beiden Winkel an derselben parallelen Seite gleich groß. Winkel an einem Schenkel ergänzen sich zu 180°.' : 'Gegenüberliegende Winkel sind gleich groß. Benachbarte Winkel ergänzen sich zu 180°.';
      return { skill: 'Winkel in besonderen Vierecken', q: 'ABCD ist ' + EIN[type] + '. Es ist α = ' + al + '°. Wie groß ist ' + names[ask] + '?' + drawQ(P, { grid: false, angles: lab, u: 28 }), inputs: [{ kind: 'num', answer: an[ask], label: names[ask] + ' =', unit: '°' }],
        hints: ['Nutze die Eigenschaften ' + (type === 'Raute' ? 'der Raute' : type === 'Parallelogramm' ? 'des Parallelogramms' : 'des gleichschenkligen Trapezes') + '.', rule, an[ask] === al ? names[ask] + ' ist genauso groß wie α.' : names[ask] + ' = 180° − ' + al + '°.'],
        solution: rule + ' Also ist ' + names[ask] + ' = ' + (an[ask] === al ? al + '°' : '180° − ' + al + '° = ' + an[ask] + '°') + '. Kontrolle: α + β + γ + δ = ' + an.join('° + ') + '° = 360°.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (an[ask] !== al && x === al) return 'Dieser Winkel liegt neben α (an derselben Seite). Benachbarte Winkel sind hier nicht gleich groß, sie ergänzen sich zu 180°.'; if (an[ask] === al && x === 180 - al) return 'Prüfe, ob der Winkel α gegenüberliegt oder an derselben parallelen Seite liegt. Dann ist er genauso groß wie α.'; return null; },
        verify: function () { var i = ask, v = P[i], p1 = P[(i + 3) % 4], p2 = P[(i + 1) % 4], u1 = sub(p1, v), u2 = sub(p2, v), w = Math.acos(dot(u1, u2) / Math.sqrt(l2(u1) * l2(u2))) * 180 / Math.PI; return Math.abs(w - an[ask]) < 1e-6 || 'Winkel aus Zeichnung ' + w; } };
    },
    ergaenzen: function () {
      var kind = M.pick(['Parallelogramm', 'Drachen', 'Rechteck']), A, B, C, D;
      for (var t = 0; t < 200; t++) {
        if (kind === 'Parallelogramm') { A = [M.rnd(0, 2), M.rnd(0, 2)]; B = [A[0] + M.rnd(3, 6), A[1] + M.rnd(-1, 1)]; C = [B[0] + M.rnd(-2, 3), B[1] + M.rnd(2, 4)]; D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]; }
        else if (kind === 'Rechteck') { var u = [M.rnd(1, 3), M.rnd(1, 2)]; A = [0, 2 * u[0]]; B = [u[0], 2 * u[0] + u[1]]; C = [u[0] + 2 * u[1], u[1]]; D = [2 * u[1], 0]; }
        else { var y0 = M.rnd(2, 4), ax = M.rnd(0, 1), xc = M.rnd(5, 8), xb = M.rnd(1, xc - 1), yb = M.rnd(1, 3); A = [ax, y0]; C = [xc, y0]; B = [xb, y0 - yb]; D = [xb, y0 + yb]; }
        var all = [A, B, C, D], mn = Math.min.apply(null, all.map(function (p) { return Math.min(p[0], p[1]); }));
        if (mn < 0) continue;
        var cl = classify(all);
        if ((kind === 'Drachen' && cl === 'Drachen') || (kind === 'Parallelogramm' && cl === 'Parallelogramm') || (kind === 'Rechteck' && cl === 'Rechteck')) break;
      }
      var how = kind === 'Drachen' ? 'D entsteht, wenn du B an der Symmetrieachse AC spiegelst. AC ist waagerecht, also bleibt die x-Koordinate gleich und der Abstand zur Achse wird nach oben abgetragen.' : 'Gehe von A aus genauso weit wie von B nach C: Der Schritt von B nach C ist ' + step(C[0] - B[0], C[1] - B[1]) + '. Also D = (' + A[0] + ' + ' + pz(C[0] - B[0]) + ' | ' + A[1] + ' + ' + pz(C[1] - B[1]) + ').';
      return { skill: 'Viereck ergänzen', level: 3, q: 'Die Punkte A' + coord(A) + ', B' + coord(B) + ' und C' + coord(C) + ' sind gegeben. Bestimme D so, dass ABCD ' + (kind === 'Drachen' ? 'ein Drachen mit der Symmetrieachse AC' : EIN[kind]) + ' wird.' + drawQ([A, B, C, D], { axes: true, names: false, extra: [[0, 0], D], dots: [[A[0], A[1], 'A'], [B[0], B[1], 'B'], [C[0], C[1], 'C']], label: 'Punkte A, B, C' }).replace(/<polygon[^>]*\/>/, ''),
        inputs: [{ kind: 'num', answer: D[0], label: 'x-Koordinate von D' }, { kind: 'num', answer: D[1], label: 'y-Koordinate von D' }],
        hints: [kind === 'Drachen' ? 'Beim Drachen mit Achse AC liegen B und D spiegelbildlich zur Geraden AC.' : 'Im ' + kind + ' ist AD parallel und gleich lang wie BC.', how.split('. ')[0] + '.', kind === 'Drachen' ? 'B liegt ' + (A[1] - B[1]) + ' unter der Achse. D liegt also ' + (A[1] - B[1]) + ' über der Achse bei x = ' + B[0] + '.' : 'Rechne: x = ' + A[0] + ' + ' + pz(C[0] - B[0]) + ' und y = ' + A[1] + ' + ' + pz(C[1] - B[1]) + '.'],
        solution: how + ' D = ' + coord(D) + '.' + drawQ([A, B, C, D], { axes: true, marks: true, sym: kind === 'Drachen', extra: [[0, 0]] }),
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (kind !== 'Drachen' && x === A[0] + B[0] - C[0] && y === A[1] + B[1] - C[1]) return 'Achte auf die Reihenfolge der Ecken: A, B, C, D laufen einmal um das Viereck herum. D liegt gegenüber von B.'; if (x === D[0] && y !== D[1]) return 'Die x-Koordinate stimmt. Prüfe die y-Koordinate.'; return null; },
        verify: function () { var c = classifyDiag([A, B, C, D]); return c === kind || 'Ergänzung ergibt ' + c; } };
    }
  };

  /* Haus der Vierecke als Grafik */
  var HAUS = (function () {
    var N = { V: [190, 22, 'Viereck'], T: [118, 86, 'Trapez'], Dr: [292, 86, 'Drachen'], gT: [66, 150, 'gleichschenkliges|Trapez'], P: [196, 150, 'Parallelogramm'], Re: [118, 214, 'Rechteck'], Ra: [282, 214, 'Raute'], Q: [200, 278, 'Quadrat'] };
    var E = [['V', 'T'], ['V', 'Dr'], ['T', 'gT'], ['T', 'P'], ['gT', 'Re'], ['P', 'Re'], ['P', 'Ra'], ['Dr', 'Ra'], ['Re', 'Q'], ['Ra', 'Q']];
    var s = '<svg class="viz" viewBox="0 0 380 300" role="img" aria-label="Haus der Vierecke" style="max-width:460px">';
    E.forEach(function (e) { var a = N[e[0]], b = N[e[1]]; s += '<line x1="' + a[0] + '" y1="' + (a[1] + 16) + '" x2="' + b[0] + '" y2="' + (b[1] - 16) + '" stroke="#5b3fa0" stroke-width="2"/>'; });
    Object.keys(N).forEach(function (k) { var n = N[k], parts = n[2].split('|'), w = k === 'P' ? 118 : 104; s += '<rect x="' + (n[0] - w / 2) + '" y="' + (n[1] - 16) + '" width="' + w + '" height="32" rx="9" fill="' + (k === 'V' ? '#fff' : '#efeafb') + '" stroke="#3d2a73" stroke-width="1.8"/>';
      if (parts.length === 1) s += '<text x="' + n[0] + '" y="' + (n[1] + 5) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830">' + parts[0] + '</text>';
      else s += '<text x="' + n[0] + '" y="' + (n[1] - 2) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#1c1830">' + parts[0] + '</text><text x="' + n[0] + '" y="' + (n[1] + 11) + '" font-size="11" font-weight="700" text-anchor="middle" fill="#1c1830">' + parts[1] + '</text>'; });
    return s + '</svg>';
  })();
  var TAB = '<div style="overflow-x:auto"><table class="tab"><tr><th>Viereck</th><th>parallele Seiten</th><th>gleich lange Seiten</th><th>rechte Winkel</th><th>Symmetrie&shy;achsen</th><th>Diagonalen</th></tr>' +
    [['Quadrat', '2 Paare', 'alle 4', '4', '4', 'gleich lang, senkrecht, halbieren sich'], ['Rechteck', '2 Paare', 'gegenüber&shy;liegende', '4', '2', 'gleich lang, halbieren sich'], ['Raute', '2 Paare', 'alle 4', '·', '2', 'senkrecht, halbieren sich'], ['Parallelogramm', '2 Paare', 'gegenüber&shy;liegende', '·', '0', 'halbieren sich'], ['Drachen', '·', 'je 2 benachbarte', '·', '1', 'senkrecht, eine wird halbiert'], ['gleichschenkliges Trapez', '1 Paar', 'die Schenkel', '·', '1', 'gleich lang'], ['Trapez', '1 Paar', '·', '·', '0', '·']]
      .map(function (r) { return '<tr><th>' + r[0] + '</th>' + r.slice(1).map(function (c) { return '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div><p class="note">Ein Punkt · bedeutet: im Allgemeinen nicht.</p>';
  var PRESET = { 'Quadrat': [4, 4, 4, 0, 4], 'Rechteck': [6, 6, 3, 0, 3], 'Raute': [5, 8, 4, 3, 4], 'Parallelogramm': [5, 7, 3, 2, 3], 'Drachen': [4, 5, 5, 0, 4], 'gleichschenkliges Trapez': [7, 5, 3, 2, 3], 'Trapez': [7, 5, 3, 1, 3], 'allgemeines Viereck': [6, 7, 4, 1, 3] };

  return {
    id: '022', title: 'Haus der Vierecke', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'parallel und senkrecht, Symmetrieachsen, Koordinatensystem',
    lead: 'Ist ein Quadrat eigentlich auch ein Rechteck? Du lernst die besonderen Vierecke und ihre Eigenschaften kennen und ordnest sie im Haus der Vierecke.',
    einstieg: { html: '<p>Schau dich im Klassenraum um: Tischplatten, Fenster, Tafel, Fliesen, ein Drachen im Herbst, das Dach eines Gartenhauses. Überall stecken <b>Vierecke</b>. Aber sie sehen ganz verschieden aus.</p><p class="note">Lena sagt: „Ein Quadrat ist kein Rechteck, das sieht doch ganz anders aus.“ Tim sagt: „Doch, jedes Quadrat ist auch ein Rechteck.“ Wer hat recht?</p><p>Um das zu klären, schaust du dir genau an, welche <b>Eigenschaften</b> ein Viereck hat: parallele Seiten, gleich lange Seiten, rechte Winkel, Symmetrieachsen und Diagonalen. Daraus baust du das <b>Haus der Vierecke</b>.</p>' },
    ziele: ['Ich kenne Quadrat, Rechteck, Raute, Parallelogramm, Drachen, Trapez und gleichschenkliges Trapez.', 'Ich beschreibe Vierecke mit ihren Eigenschaften: Seiten, Winkel, Symmetrieachsen und Diagonalen.', 'Ich erkenne ein Viereck an seinen Eigenschaften und gebe den genauesten Namen an.', 'Ich erkläre mit dem Haus der Vierecke Aussagen wie „Jedes Quadrat ist ein Rechteck“.', 'Ich erkenne Vierecke im Koordinatensystem und ergänze fehlende Eckpunkte.'],
    fachwoerter: [['Parallel', 'Zwei Seiten sind parallel, wenn sie überall den gleichen Abstand haben. Im Gitter gehen sie dieselben Schritte nach rechts und oben.'], ['Symmetrieachse', 'Eine Gerade, an der man die Figur falten kann, sodass beide Hälften genau aufeinanderliegen.'], ['Diagonale', 'Eine Strecke, die zwei gegenüberliegende Ecken verbindet. Jedes Viereck hat zwei Diagonalen.'], ['Schenkel', 'Beim Trapez die beiden Seiten, die nicht parallel sind.'], ['Oberbegriff', 'Ein allgemeinerer Name. „Rechteck“ ist ein Oberbegriff von „Quadrat“.']],
    diagnose: [
      { q: 'Wann sind zwei Geraden parallel?', options: ['Wenn sie sich im rechten Winkel schneiden.', 'Wenn sie überall den gleichen Abstand haben und sich nie schneiden.', 'Wenn sie gleich lang sind.', 'Weiß ich noch nicht'], answer: 1, why: 'Parallele Geraden haben überall den gleichen Abstand. Sie schneiden sich nie.', review: 'Parallele und senkrechte Geraden (Klasse 5/6)' },
      { q: 'Wie viele Symmetrieachsen hat ein gleichseitiges Dreieck?', options: ['1', '0', '3', 'Weiß ich noch nicht'], answer: 2, why: 'Jede Höhe ist zugleich Symmetrieachse. Es gibt drei davon.', review: 'Achsensymmetrische Figuren' },
      { q: 'Wie groß ist die Winkelsumme in einem Viereck?', options: ['360°', '180°', '90°', 'Weiß ich noch nicht'], answer: 0, why: 'Eine Diagonale zerlegt das Viereck in zwei Dreiecke: 2 · 180° = 360°.', review: 'Winkelsumme im Dreieck und Viereck (Modul 016)' },
      { q: 'Der Punkt P liegt 4 Kästchen rechts vom Ursprung und 1 Kästchen darüber. Welche Koordinaten hat P?', options: ['(1 | 4)', '(4 | 1)', '(4 | −1)', 'Weiß ich noch nicht'], answer: 1, why: 'Zuerst die x-Koordinate (rechts), dann die y-Koordinate (oben): P(4 | 1).', review: 'Punkte im Koordinatensystem' }],
    erklaerung:
      '<h3>1. Die besonderen Vierecke</h3><p>In den Bildern bedeuten gleiche Striche gleich lange Seiten, ein Eckzeichen einen rechten Winkel und orange gestrichelte Linien die Symmetrieachsen.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:4px 14px">' + [['Quadrat', [[0, 0], [3, 0], [3, 3], [0, 3]]], ['Rechteck', [[0, 0], [5, 0], [5, 3], [0, 3]]], ['Raute', [[0, 2], [3, 0], [6, 2], [3, 4]]], ['Parallelogramm', [[0, 0], [4, 0], [6, 3], [2, 3]]], ['Drachen', [[2, 0], [4, 3], [2, 4], [0, 3]]], ['gleichschenkliges Trapez', [[0, 0], [6, 0], [5, 3], [1, 3]]], ['Trapez', [[0, 0], [6, 0], [4, 3], [1, 3]]]]
        .map(function (x) { return '<figure style="margin:0;width:170px"><figcaption style="font-weight:700;font-size:.95rem">' + x[0] + '</figcaption>' + drawQ(x[1], { grid: false, marks: true, sym: true, names: false, u: 24 }) + '</figure>'; }).join('') + '</div>' +
      '<h3>2. Eigenschaften im Überblick</h3>' + TAB +
      '<h3>3. Das Haus der Vierecke</h3><p>Je weiter unten ein Viereck steht, desto <b>mehr</b> Eigenschaften hat es. Jedes Viereck hat alle Eigenschaften der Vierecke, mit denen es nach oben verbunden ist.</p>' + HAUS +
      '<div class="merk"><b>Merke:</b> Folgst du den Linien im Haus nach oben, findest du die <b>Oberbegriffe</b>. Deshalb gilt zum Beispiel: <b>Jedes Quadrat ist ein Rechteck</b> und auch eine Raute. Aber nicht jedes Rechteck ist ein Quadrat.<br>Gibst du einen Namen an, wählst du immer den <b>genauesten</b>.</div>' +
      '<h3>4. Vierecke im Gitter erkennen</h3><p>Im Kästchengitter zählst du bei jeder Seite die Schritte nach rechts und nach oben. Seiten mit gleichen Schritten (oder genau entgegengesetzten) sind <b>parallel und gleich lang</b>. Bei einem rechten Winkel werden die Schritte vertauscht, und ein Vorzeichen ändert sich: aus 3 rechts, 1 hoch wird 1 links, 3 hoch.</p>' +
      '<p class="note">Lena aus dem Einstieg irrt sich also: Ein Quadrat hat vier rechte Winkel und gegenüberliegende gleich lange Seiten. Damit erfüllt es alles, was ein Rechteck braucht.</p>',
    entdecken: {
      html: '<p>A liegt fest bei (0 | 0). Verschiebe B, C und D mit den Reglern oder wähle eine Startform. Name und Eigenschaften werden sofort angezeigt.</p><div class="ctl"><label>Startform <select id="e_pre">' + Object.keys(PRESET).map(function (k) { return '<option value="' + k + '"' + (k === 'Parallelogramm' ? ' selected' : '') + '>' + k + '</option>'; }).join('') + '</select></label></div>' +
        '<div class="ctl"><label>B: x = <b id="v_bx"></b> <input type="range" id="r_bx" min="2" max="10" step="1" value="5"></label><label>C: x = <b id="v_cx"></b> <input type="range" id="r_cx" min="0" max="12" step="1" value="7"></label><label>C: y = <b id="v_cy"></b> <input type="range" id="r_cy" min="1" max="9" step="1" value="3"></label><label>D: x = <b id="v_dx"></b> <input type="range" id="r_dx" min="-3" max="9" step="1" value="2"></label><label>D: y = <b id="v_dy"></b> <input type="range" id="r_dy" min="1" max="9" step="1" value="3"></label></div>' +
        '<div id="e_g"></div><p class="big-math" id="e_name"></p><div id="e_props"></div><p class="note">Aufträge: Mache aus dem Parallelogramm ein Rechteck. Was musst du verändern? Erzeuge dann ein Quadrat und einen Drachen. Welche Eigenschaften kommen jeweils dazu?</p>',
      init: function (root, done) {
        var n = 0, ids = ['bx', 'cx', 'cy', 'dx', 'dy'];
        function val(k) { return +root.querySelector('#r_' + k).value; }
        function draw() {
          ids.forEach(function (k) { root.querySelector('#v_' + k).textContent = M.fmtNum(val(k)); });
          var P = [[0, 0], [val('bx'), 0], [val('cx'), val('cy')], [val('dx'), val('dy')]], t = classify(P), p = props(P);
          root.querySelector('#e_g').innerHTML = drawQ(P, { range: [-3.5, 12.5, -0.8, 9.5], u: 22, marks: true, sym: true, diags: true, axes: true, label: 'Viereck ABCD im Koordinatensystem' });
          if (t === 'nicht konvex') { root.querySelector('#e_name').innerHTML = 'Kein „normales“ Viereck'; root.querySelector('#e_props').innerHTML = '<p class="fb bad">Die Seiten kreuzen sich oder eine Ecke ist nach innen gedellt. Solche Vierecke kommen im Haus der Vierecke nicht vor.</p>'; return; }
          root.querySelector('#e_name').innerHTML = (t === 'allgemeines Viereck' ? 'Allgemeines Viereck' : t.charAt(0).toUpperCase() + t.slice(1));
          root.querySelector('#e_props').innerHTML = propText(p) + (ANC[t] && ANC[t].length ? '<p>Es ist damit auch: <b>' + ANC[t].join(', ') + '</b>.</p>' : '');
        }
        function hit() { draw(); n++; if (n >= 3) done('Gut erkundet: Der Name hängt nur von den Eigenschaften ab. Je mehr Eigenschaften ein Viereck hat, desto weiter unten steht es im Haus der Vierecke.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_pre').addEventListener('change', function () { var v = PRESET[this.value]; ids.forEach(function (k, i) { root.querySelector('#r_' + k).value = v[i]; }); hit(); });
        draw();
      }
    },
    beispiel: { title: 'Viereck im Gitter bestimmen', q: 'Welches Viereck ist ABCD mit A(0 | 0), B(4 | 0), C(6 | 3) und D(2 | 3)?' + drawQ([[0, 0], [4, 0], [6, 3], [2, 3]], { axes: true }),
      steps: ['Schritte der Seiten zählen: AB: 4 rechts, 0 hoch. BC: 2 rechts, 3 hoch. DC: 4 rechts, 0 hoch. AD: 2 rechts, 3 hoch.', 'AB und DC haben dieselben Schritte, AD und BC auch. Also sind <b>beide Paare</b> gegenüberliegender Seiten parallel und gleich lang. Es ist mindestens ein Parallelogramm.', 'Rechte Winkel? AB verläuft waagerecht. Für einen rechten Winkel bei A müsste AD senkrecht nach oben gehen. AD geht aber 2 nach rechts und 3 nach oben. Also gibt es keinen rechten Winkel und es ist kein Rechteck.', 'Gleich lange Seiten? AB ist 4 Kästchen lang, AD ist schräg und länger als 3, aber kürzer als 4. Also keine Raute.', 'Ergebnis: ABCD ist ein <b>Parallelogramm</b>. Kontrolle: Die Diagonalen halbieren sich, beide haben den Mittelpunkt (3 | 1,5).' + drawQ([[0, 0], [4, 0], [6, 3], [2, 3]], { axes: true, marks: true, diags: true })] },
    tasks: { gen: gen, plan: { G: ['steckbrief:1', 'gitter:1', 'wahrfalsch:1', 'eigenschaft:1'], S: ['gitter:1', 'wahrfalsch:2', 'steckbrief:2', 'eigenschaft:2', 'winkel:2'], E: ['gitter:2', 'wahrfalsch:2', 'diagonalen:2', 'winkel:2', 'koord:3', 'steckbrief:2'] },
      extra: 'ergaenzen', test: ['gitter:1', 'wahrfalsch:2', 'steckbrief:2', 'eigenschaft:2', 'diagonalen:2', 'winkel:2'] },
    lerncheck: ['Ich kann die besonderen Vierecke an ihren Eigenschaften erkennen.', 'Ich kann sagen, wie viele Symmetrieachsen ein Viereck hat und was für seine Diagonalen gilt.', 'Ich kann mit dem Haus der Vierecke begründen, ob eine Aussage wie „Jedes Quadrat ist ein Rechteck“ stimmt.', 'Ich erkenne Vierecke im Koordinatensystem.']
  };
})();
