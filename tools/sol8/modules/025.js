/* Modul 025 · Prismen: Netz und Oberfläche */
var MODULE = (function () {
  var f = M.fmtNum;
  function r3(x) { return Math.round(x * 1000) / 1000; }
  /* Flächeninhalt aus Eckpunkten (Gaußsche Trapezformel), unabhängig von den Formeln */
  function gauss(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += (a[0] - b[0]) * (a[1] + b[1]); } return Math.abs(s) / 2; }
  /* Zeichnung in Weltkoordinaten (y nach oben), maßstabsgetreu */
  function fig(o) {
    var pts = []; (o.polys || []).forEach(function (p) { pts = pts.concat(p.P); }); (o.segs || []).forEach(function (s) { pts.push(s.a, s.b); }); (o.texts || []).forEach(function (t) { pts.push(t.p); });
    var x0 = Math.min.apply(null, pts.map(function (p) { return p[0]; })), x1 = Math.max.apply(null, pts.map(function (p) { return p[0]; }));
    var y0 = Math.min.apply(null, pts.map(function (p) { return p[1]; })), y1 = Math.max.apply(null, pts.map(function (p) { return p[1]; }));
    if (o.box) { x0 = o.box[0]; x1 = o.box[1]; y0 = o.box[2]; y1 = o.box[3]; }
    var mg = o.margin || 36, Wm = o.W || 360, Hm = o.maxH || 230, sc = Math.min((Wm - 2 * mg) / (x1 - x0 || 1), (Hm - 2 * mg) / (y1 - y0 || 1));
    var W = Math.round((x1 - x0) * sc + 2 * mg), H = Math.round((y1 - y0) * sc + 2 * mg);
    function X(x) { return +(mg + (x - x0) * sc).toFixed(1); } function Y(y) { return +(H - mg - (y - y0) * sc).toFixed(1); }
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Figur mit Maßen') + '" style="max-width:' + Math.min(460, Math.round(W * 1.2)) + 'px">';
    var main = o.polys && o.polys[0] ? o.polys[0].P : pts, cx = 0, cy = 0; main.forEach(function (p) { cx += p[0] / main.length; cy += p[1] / main.length; });
    if (o.grid) { for (var gx = Math.ceil(x0); gx <= x1; gx++) g += '<line x1="' + X(gx) + '" y1="' + Y(y0) + '" x2="' + X(gx) + '" y2="' + Y(y1) + '" stroke="#e3dcf2"/>'; for (var gy = Math.ceil(y0); gy <= y1; gy++) g += '<line x1="' + X(x0) + '" y1="' + Y(gy) + '" x2="' + X(x1) + '" y2="' + Y(gy) + '" stroke="#e3dcf2"/>'; }
    (o.polys || []).forEach(function (p) { g += '<polygon points="' + p.P.map(function (q) { return X(q[0]) + ',' + Y(q[1]); }).join(' ') + '" fill="' + (p.fill || '#efeafb') + '"' + (p.op ? ' fill-opacity="' + p.op + '"' : '') + ' stroke="' + (p.stroke || '#3d2a73') + '" stroke-width="' + (p.w || 2.5) + '" stroke-linejoin="round"' + (p.dash ? ' stroke-dasharray="6 4"' : '') + '/>'; });
    (o.rights || []).forEach(function (r) {
      var v = [X(r[0][0]), Y(r[0][1])], a = [X(r[1][0]) - v[0], Y(r[1][1]) - v[1]], b = [X(r[2][0]) - v[0], Y(r[2][1]) - v[1]], la = Math.hypot(a[0], a[1]), lb = Math.hypot(b[0], b[1]), z = 9;
      var q1 = [v[0] + a[0] / la * z, v[1] + a[1] / la * z], q2 = [v[0] + b[0] / lb * z, v[1] + b[1] / lb * z], q3 = [q1[0] + b[0] / lb * z, q1[1] + b[1] / lb * z];
      g += '<path d="M' + q1[0].toFixed(1) + ' ' + q1[1].toFixed(1) + ' L' + q3[0].toFixed(1) + ' ' + q3[1].toFixed(1) + ' L' + q2[0].toFixed(1) + ' ' + q2[1].toFixed(1) + '" fill="none" stroke="#d97706" stroke-width="1.6"/><circle cx="' + ((v[0] + q3[0]) / 2).toFixed(1) + '" cy="' + ((v[1] + q3[1]) / 2).toFixed(1) + '" r="1.5" fill="#d97706"/>';
    });
    var placed = [];
    (o.segs || []).forEach(function (s) {
      if (s.line !== false) g += '<line x1="' + X(s.a[0]) + '" y1="' + Y(s.a[1]) + '" x2="' + X(s.b[0]) + '" y2="' + Y(s.b[1]) + '" stroke="' + (s.col || (s.dash ? '#d97706' : '#3d2a73')) + '" stroke-width="' + (s.w || (s.dash ? 2 : 2.5)) + '"' + (s.dash ? ' stroke-dasharray="5 4"' : '') + '/>';
    });
    (o.segs || []).forEach(function (s) {
      if (!s.t) return;
      var ax = X(s.a[0]), ay = Y(s.a[1]), bx = X(s.b[0]), by = Y(s.b[1]), at = s.at || 0.5, mx = ax + (bx - ax) * at, my = ay + (by - ay) * at, dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      var side = s.side || (((mx - X(cx)) * nx + (my - Y(cy)) * ny) >= 0 ? 1 : -1); if (s.inward) side = -side;
      nx *= side; ny *= side;
      var w = s.t.replace(/<[^>]+>/g, '').length * 7.2 + 4, hh = 15, off = 9, tx, ty, anc, bx0, by0;
      for (var k = 0; k < 5; k++) {
        tx = mx + nx * off; ty = my + ny * off;
        anc = nx > 0.45 ? 'start' : nx < -0.45 ? 'end' : 'middle';
        ty += ny > 0.45 ? 12 : ny < -0.45 ? -3 : 5;
        bx0 = anc === 'start' ? tx : anc === 'end' ? tx - w : tx - w / 2; by0 = ty - 12;
        var hit = placed.some(function (p) { return bx0 < p[0] + p[2] && bx0 + w > p[0] && by0 < p[1] + p[3] && by0 + hh > p[1]; });
        if (!hit) break; off += 13;
      }
      placed.push([bx0, by0, w, hh]);
      g += '<text x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" font-size="13" font-weight="700" text-anchor="' + anc + '" fill="' + (s.tc || (s.t.indexOf('?') >= 0 ? '#b91c1c' : s.dash ? '#b45309' : '#1c1830')) + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + s.t + '</text>';
    });
    (o.texts || []).forEach(function (t) { g += '<text x="' + X(t.p[0]) + '" y="' + (Y(t.p[1]) + 5) + '" font-size="' + (t.size || 13) + '" font-weight="700" text-anchor="middle" fill="' + (t.col || '#3d2a73') + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + t.t + '</text>'; });
    var vx0 = Math.min(0, Math.min.apply(null, placed.map(function (p) { return p[0] - 3; }).concat([0]))), vy0 = Math.min(0, Math.min.apply(null, placed.map(function (p) { return p[1] - 3; }).concat([0])));
    var vx1 = Math.max(W, Math.max.apply(null, placed.map(function (p) { return p[0] + p[2] + 3; }).concat([0]))), vy1 = Math.max(H, Math.max.apply(null, placed.map(function (p) { return p[1] + p[3] + 3; }).concat([0])));
    g = g.replace('viewBox="0 0 ' + W + ' ' + H + '"', 'viewBox="' + Math.floor(vx0) + ' ' + Math.floor(vy0) + ' ' + Math.ceil(vx1 - vx0) + ' ' + Math.ceil(vy1 - vy0) + '"');
    return g + '</svg>';
  }
  /* ---- Prismen: Schrägbild (Kavalierperspektive 45°, Tiefe halbiert) und Netz ---- */
  function ccw(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return s > 0 ? P : P.slice().reverse(); }
  function sides(P) { return P.map(function (p, i) { var q = P[(i + 1) % P.length]; return Math.hypot(q[0] - p[0], q[1] - p[1]); }); }
  /* P: Grundfläche als Vorderseite (gegen den Uhrzeigersinn), H: Körperhöhe (Tiefe).
     o.labels: [{i: Kantenindex vorne, t: Text}], o.hl: Text für die Körperhöhe, o.segs: zusätzliche Strecken in der Vorderfläche */
  function prismSvg(P, H, o) {
    o = o || {}; var n = P.length, k = H / 2 * Math.SQRT1_2, d = [k, k];
    var B = P.map(function (p) { return [p[0] + d[0], p[1] + d[1]]; });
    var vis = P.map(function (p, i) { var q = P[(i + 1) % n], nx = q[1] - p[1], ny = -(q[0] - p[0]); return nx * d[0] + ny * d[1] > 1e-9; });
    var polys = [{ P: P, fill: o.front || '#efeafb' }], segs = [];
    P.forEach(function (p, i) { if (vis[i]) polys.push({ P: [p, P[(i + 1) % n], B[(i + 1) % n], B[i]], fill: o.side || '#e3dcf2', w: 2 }); });
    P.forEach(function (p, i) {
      var prev = vis[(i - 1 + n) % n], cur = vis[i];
      if (!vis[i]) segs.push({ a: B[i], b: B[(i + 1) % n], dash: true, col: '#7a7194', w: 1.3 });
      if (!prev && !cur) segs.push({ a: p, b: B[i], dash: true, col: '#7a7194', w: 1.3 });
    });
    polys.push({ P: P, fill: o.front || '#efeafb' });
    (o.segs || []).forEach(function (s) { segs.push(s); });
    (o.labels || []).forEach(function (l) { segs.push({ a: P[l.i], b: P[(l.i + 1) % n], t: l.t, line: false, side: l.side, at: l.at }); });
    if (o.hl) {
      var best = 0; P.forEach(function (p, i) { if (p[0] - 0.3 * p[1] > P[best][0] - 0.3 * P[best][1]) best = i; });
      segs.push({ a: P[best], b: B[best], t: o.hl, line: false, side: 1 });
    }
    return fig({ polys: polys, segs: segs, label: o.label || 'Schrägbild eines Prismas', W: o.W || 340, maxH: o.maxH || 230 });
  }
  /* Netz: Mantelstreifen aus Rechtecken (Breite = Grundkante, Höhe = H), Grundflächen oben an Rechteck top, unten an Rechteck bot.
     o.order: Kantenreihenfolge im Streifen, o.tops / o.bots: Indizes der Rechtecke mit angesetzter Grundfläche */
  function netShapes(P, H, o) {
    o = o || {}; var n = P.length, S = sides(P), order = o.order || P.map(function (p, i) { return i; }), X = [0], out = [];
    order.forEach(function (e, j) { X.push(X[j] + S[e]); });
    order.forEach(function (e, j) { out.push({ P: [[X[j], 0], [X[j + 1], 0], [X[j + 1], H], [X[j], H]], fill: '#efeafb', w: 2 }); });
    function place(j, top) {
      var e = order[j], a = P[e], b = P[(e + 1) % n], ang = -Math.atan2(b[1] - a[1], b[0] - a[0]), c = Math.cos(ang), s = Math.sin(ang);
      return { P: P.map(function (q) { var x = q[0] - a[0], y = q[1] - a[1], rx = x * c - y * s, ry = x * s + y * c; return top ? [X[j] + rx, H + ry] : [X[j] + rx, -ry]; }), fill: '#f6d9a8', w: 2 };
    }
    (o.tops === undefined ? [0] : o.tops).forEach(function (j) { out.push(place(j, true)); });
    (o.bots === undefined ? [0] : o.bots).forEach(function (j) { out.push(place(j, false)); });
    return { polys: out, X: X, S: S, order: order };
  }
  function netSvg(P, H, o) {
    o = o || {}; var N = netShapes(P, H, o), segs = [], texts = [];
    if (o.labels) N.order.forEach(function (e, j) { if (o.labels[e]) texts.push({ p: [(N.X[j] + N.X[j + 1]) / 2, H / 2], t: o.labels[e], size: 11, col: '#1c1830' }); });
    if (o.hl) segs.push({ a: [N.X[N.X.length - 1], 0], b: [N.X[N.X.length - 1], H], t: o.hl, line: false, side: 1 });
    return fig({ polys: N.polys, segs: segs, texts: texts, label: o.label || 'Netz eines Prismas', W: o.W || 340, maxH: o.maxH || 240 });
  }
  function u(x, e) { return f(x) + ' ' + (e || 'cm'); }
  function numIn(ans, label, unit, tol) { return { kind: 'num', answer: r3(ans), label: label, unit: unit, tol: tol }; }
  var HG = 'h<sub>G</sub>';
  /* Grundflächen mit glatten Maßen (rechtwinklige Zahlentripel) */
  function base(type, k, c0) {
    if (type === 'iso') return { P: [[0, 0], [6 * k, 0], [3 * k, 4 * k]], name: 'gleichschenkliges Dreieck', g: 6 * k, hg: 4 * k, s: [6 * k, 5 * k, 5 * k], G: 12 * k * k, foot: [[3 * k, 4 * k], [3 * k, 0]] };
    if (type === 'right') return { P: [[0, 0], [4 * k, 0], [0, 3 * k]], name: 'rechtwinkliges Dreieck', g: 4 * k, hg: 3 * k, s: [4 * k, 5 * k, 3 * k], G: 6 * k * k };
    if (type === 'trap') { var c = c0 || 2 * k, a = c + 6 * k; return { P: [[0, 0], [a, 0], [a - 3 * k, 4 * k], [3 * k, 4 * k]], name: 'gleichschenkliges Trapez', a: a, c: c, hg: 4 * k, s: [a, 5 * k, c, 5 * k], G: (a + c) / 2 * 4 * k, foot: [[3 * k, 4 * k], [3 * k, 0]] }; }
    var A = k, B = c0; return { P: [[0, 0], [A, 0], [A, B], [0, B]], name: 'Rechteck', s: [A, B, A, B], G: A * B };
  }
  function regular(n, R) { var P = []; for (var i = 0; i < n; i++) { var w = -Math.PI / 2 - Math.PI / n + 2 * Math.PI * i / n; P.push([R * Math.cos(w), R * Math.sin(w)]); } return P; }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function labs(b, e) { return b.s.map(function (x, i) { return { i: i, t: u(x, e) }; }); }
  function prismPic(b, H, e, extra) {
    var segs = []; if (b.foot) segs.push({ a: b.foot[0], b: b.foot[1], t: u(b.hg, e), dash: true, side: -1, at: 0.55 });
    var L = labs(b, e); if (b.name === 'Rechteck') L = [L[0], L[3]];
    if (b.name === 'gleichschenkliges Trapez') L[2].side = -1;
    if (b.name === 'gleichschenkliges Dreieck' || b.name === 'gleichschenkliges Trapez') L = L.filter(function (l) { return l.i !== (b.name === 'gleichschenkliges Trapez' ? 1 : 1); });
    return prismSvg(b.P, H, { labels: L, hl: u(H, e), segs: segs, front: extra && extra.front });
  }
  /* Würfelnetze: Falten simulieren */
  function folds(cells) {
    var key = function (c) { return c[0] + ',' + c[1]; }, set = {}; cells.forEach(function (c) { set[key(c)] = 1; });
    var st = {}, q = [cells[0]]; st[key(cells[0])] = { n: [0, 0, -1], u: [1, 0, 0], v: [0, 1, 0] };
    function neg(a) { return [-a[0], -a[1], -a[2]]; }
    while (q.length) {
      var c = q.shift(), s = st[key(c)];
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (dd) {
        var nb = [c[0] + dd[0], c[1] + dd[1]], k = key(nb); if (!set[k] || st[k]) return;
        var t = dd[0] === 1 ? { n: s.u, u: neg(s.n), v: s.v } : dd[0] === -1 ? { n: neg(s.u), u: s.n, v: s.v } : dd[1] === 1 ? { n: s.v, u: s.u, v: neg(s.n) } : { n: neg(s.v), u: s.u, v: s.n };
        st[k] = t; q.push(nb);
      });
    }
    var ns = {}; Object.keys(st).forEach(function (k) { ns[st[k].n.join()] = 1; });
    return Object.keys(st).length === 6 && Object.keys(ns).length === 6;
  }
  function cubeNet(ok) {
    for (var t = 0; t < 100; t++) {
      var c, r = Math.random();
      if (ok) { if (r < 0.6) c = [[0, 1], [1, 1], [2, 1], [3, 1], [M.rnd(0, 3), 0], [M.rnd(0, 3), 2]]; else if (r < 0.8) c = [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]; else c = [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]]; }
      else { if (r < 0.45) { var a = M.rnd(0, 3), b; do { b = M.rnd(0, 3); } while (b === a); c = [[0, 1], [1, 1], [2, 1], [3, 1], [a, 0], [b, 0]]; } else if (r < 0.65) c = [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]]; else if (r < 0.85) c = [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [M.rnd(0, 4), M.pick([0, 2])]]; else c = [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 0]]; }
      if (Math.random() < 0.5) c = c.map(function (p) { return [p[0], 2 - p[1]]; });
      if (folds(c) === ok) return c;
    }
    return null;
  }
  function cubeSvg(c) { return fig({ polys: c.map(function (p) { return { P: [[p[0], p[1]], [p[0] + 1, p[1]], [p[0] + 1, p[1] + 1], [p[0], p[1] + 1]], fill: '#efeafb', w: 2 }; }), box: [-0.2, 5.2, -0.2, 3.2], W: 230, maxH: 150, margin: 8, label: 'Netz aus sechs Quadraten' }); }
  var LET = ['A', 'B', 'C', 'D'];

  var gen = {
    erkennen: function (lvl) {
      var kind = M.pick(['Dreieck', 'Rechteck', 'Trapez', 'Fünfeck', 'Sechseck']), P, n;
      if (kind === 'Dreieck') P = base(M.pick(['iso', 'right']), 1).P; else if (kind === 'Rechteck') P = base('rect', M.rnd(3, 6), M.rnd(2, 4)).P; else if (kind === 'Trapez') P = base('trap', 1).P; else P = regular(kind === 'Fünfeck' ? 5 : 6, 3);
      n = P.length; var H = M.rnd(5, 9);
      var opts = ['Dreieck', 'Rechteck', 'Trapez', 'Fünfeck', 'Sechseck'];
      return { skill: 'Prisma erkennen', q: 'Das Bild zeigt ein Prisma. Die vordere Fläche (orange) ist eine Grundfläche.<br>a) Welche Form hat die Grundfläche?<br>b) Aus wie vielen Rechtecken besteht der Mantel?' + prismSvg(P, H, { front: '#f6d9a8' }),
        inputs: [{ kind: 'mc', label: 'a) Form der Grundfläche', options: opts, answer: opts.indexOf(kind) }, { kind: 'num', answer: n, label: 'b) Rechtecke im Mantel' }],
        hints: ['Zähle die Ecken der orangen Fläche.', 'Jede Seite der Grundfläche gehört zu genau einem Rechteck des Mantels.', 'Die Grundfläche hat ' + n + ' Seiten, also hat der Mantel ' + n + ' Rechtecke.'],
        solution: 'a) Die Grundfläche ist ein ' + kind + '. b) Zu jeder der ' + n + ' Seiten gehört ein Rechteck. Der Mantel besteht aus ' + n + ' Rechtecken.',
        mistakes: function (v) { var x = M.parseNum(v[1]); if (x === n + 2) return 'Grund- und Deckfläche gehören nicht zum Mantel. Zähle nur die Rechtecke an der Seite.'; return null; },
        verify: function () { return opts.indexOf(kind) >= 0 && P.length === [3, 4, 4, 5, 6][opts.indexOf(kind)] || 'Ecken passen nicht'; } };
    },
    teile: function (lvl) {
      var n = lvl >= 2 ? M.rnd(3, 8) : M.pick([3, 4]), names = { 3: 'dreieckige', 4: 'viereckige', 5: 'fünfeckige', 6: 'sechseckige', 7: 'siebeneckige', 8: 'achteckige' };
      var pic = n <= 7 ? prismSvg(regular(n, 3), 7, {}) : '';
      return { skill: 'Flächen, Kanten, Ecken', q: 'Ein Prisma hat eine ' + names[n] + ' Grundfläche. Wie viele Flächen, Kanten und Ecken hat es?' + pic,
        inputs: [{ kind: 'num', answer: n + 2, label: 'Flächen' }, { kind: 'num', answer: 3 * n, label: 'Kanten' }, { kind: 'num', answer: 2 * n, label: 'Ecken' }],
        hints: ['Flächen: Grundfläche, Deckfläche und für jede Seite der Grundfläche ein Rechteck.', 'Kanten: ' + n + ' Kanten an der Grundfläche, ' + n + ' an der Deckfläche und ' + n + ' Kanten dazwischen.', 'Ecken: ' + n + ' unten und ' + n + ' oben.'],
        solution: 'Flächen: 2 + ' + n + ' = ' + (n + 2) + '. Kanten: 3 · ' + n + ' = ' + 3 * n + '. Ecken: 2 · ' + n + ' = ' + 2 * n + '. Kontrolle (Eulerscher Polyedersatz): Ecken + Flächen − Kanten = ' + 2 * n + ' + ' + (n + 2) + ' − ' + 3 * n + ' = 2.',
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === n) return 'Du hast Grund- und Deckfläche vergessen.'; if (b === 2 * n) return 'Vergiss die Kanten nicht, die Grund- und Deckfläche verbinden.'; return null; },
        verify: function () { return (2 * n) + (n + 2) - 3 * n === 2 || 'Euler'; } };
    },
    netz: function (lvl) {
      var cube = lvl <= 1 || Math.random() < 0.35, opts = [], ok;
      if (cube) {
        var good = cubeNet(true), bad = [], keys = {};
        keys[JSON.stringify(good)] = 1;
        while (bad.length < 3) { var b = cubeNet(false); if (!keys[JSON.stringify(b)]) { keys[JSON.stringify(b)] = 1; bad.push(b); } }
        var all = M.shuffle([[good, true]].concat(bad.map(function (x) { return [x, false]; })));
        opts = all.map(function (x, i) { return '<b>' + LET[i] + '</b>' + cubeSvg(x[0]); }); ok = all.findIndex(function (x) { return x[1]; });
        return { skill: 'Netze erkennen', q: 'Welches Netz lässt sich zu einem <b>Würfel</b> falten?', inputs: [{ kind: 'mc', label: 'Richtiges Netz', options: opts, answer: ok }],
          hints: ['Stell dir vor, ein Quadrat ist der Boden. Klappe die anderen in Gedanken hoch.', 'Zwei Quadrate dürfen beim Falten nicht auf derselben Würfelseite landen. Achte auf Quadrate, die beide an dieselbe Seite eines Viererstreifens grenzen.', 'Ein 2-mal-3-Block lässt sich nie zu einem Würfel falten.'],
          solution: 'Richtig ist Netz ' + LET[ok] + '. Nur dort landet jedes der sechs Quadrate auf einer anderen Würfelseite.',
          verify: function () { return all.every(function (x) { return folds(x[0]) === x[1]; }) || 'Faltprüfung'; } };
      }
      var b0 = base(M.pick(['iso', 'right']), 1), H = 6, i = M.rnd(0, 2), j = M.rnd(0, 2), k2 = (i + 1 + M.rnd(0, 1)) % 3;
      var cands = [[{ tops: [i], bots: [j] }, true], [{ tops: [0, 2], bots: [] }, false], [{ order: [0, 1], tops: [0], bots: [1] }, false], [{ order: [0, 1, 2, 0], tops: [1], bots: [2] }, false]];
      var all2 = M.shuffle(cands);
      opts = all2.map(function (x, m) { return '<b>' + LET[m] + '</b>' + netSvg(b0.P, H, Object.assign({ W: 260, maxH: 170 }, x[0])); }); ok = all2.findIndex(function (x) { return x[1]; });
      return { skill: 'Netze erkennen', q: 'Welches ist ein Netz eines <b>dreiseitigen Prismas</b> (Dreiecksprisma)?' + prismSvg(b0.P, H, {}), inputs: [{ kind: 'mc', label: 'Richtiges Netz', options: opts, answer: ok }],
        hints: ['Ein Dreiecksprisma hat zwei Dreiecke (Grund- und Deckfläche) und drei Rechtecke (Mantel).', 'Zähle in jedem Netz die Rechtecke und die Dreiecke.', 'Beim Falten muss ein Dreieck oben und eines unten landen.'],
        solution: 'Richtig ist Netz ' + LET[ok] + ': drei Rechtecke, ein Dreieck oben und eines unten. Bei den anderen Netzen fehlt ein Rechteck, es ist eines zu viel, oder beide Dreiecke landen auf derselben Seite.',
        verify: function () { return all2.every(function (x) { var o = x[0], good = (!o.order || o.order.length === 3) && o.tops.length === 1 && o.bots.length === 1; return good === x[1]; }) || 'Netzprüfung'; } };
    },
    mantel: function (lvl) {
      var t = M.pick(lvl >= 2 ? ['iso', 'right', 'trap'] : ['iso', 'right']), k = M.pick(lvl >= 2 ? [1, 1.5, 2] : [1, 2]), b = base(t, k, M.pick([2, 3, 4])), H = M.rnd(5, 15), uu = r3(sum(b.s)), Mm = r3(uu * H);
      return { skill: 'Mantelfläche M = u · h', q: 'Berechne die Mantelfläche des Prismas. Die Grundfläche ist ein ' + b.name + ', das Prisma ist ' + u(H) + ' lang (Körperhöhe h).' + prismPic(b, H) + '<p class="note">Gleich lange Seiten sind nur einmal beschriftet.</p>', inputs: [numIn(Mm, 'M =', 'cm²')],
        hints: ['Der Mantel besteht aus Rechtecken. Zusammen bilden sie ein großes Rechteck: Länge = Umfang u der Grundfläche, Breite = h.', 'u = ' + b.s.map(function (x) { return f(x); }).join(' + ') + ' = ' + f(uu) + ' cm.', 'M = u · h = ' + f(uu) + ' cm · ' + H + ' cm.'],
        solution: 'u = ' + b.s.map(function (x) { return f(x); }).join(' cm + ') + ' cm = ' + f(uu) + ' cm. M = u · h = ' + f(uu) + ' cm · ' + H + ' cm = ' + f(Mm) + ' cm².' + netSvg(b.P, H, { labels: b.s.map(function (x) { return f(x); }), hl: u(H) }),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (Mm + 2 * b.G)) < 1e-6) return 'Das ist schon die ganze Oberfläche. Der Mantel ist nur der Teil ohne Grund- und Deckfläche.'; if (b.s.some(function (s) { return Math.abs(x - (uu - s) * H) < 1e-6; })) return 'Eine Seite fehlt. Der Umfang ist die Summe <b>aller</b> Seiten der Grundfläche.'; return null; },
        verify: function () { var s = 0; netShapes(b.P, H, { tops: [], bots: [] }).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - Mm) < 1e-6 || 'Netzfläche ' + s; } };
    },
    quader: function (lvl) {
      var a = M.rnd(3, 12), b = M.rnd(2, 8), c = M.rnd(2, 10); if (lvl >= 3) { a += 0.5; c += 0.5; }
      var O = r3(2 * (a * b + a * c + b * c)), P = base('rect', a, b).P;
      return { skill: 'Oberfläche des Quaders', q: 'Ein Quader ist ' + u(a) + ' lang, ' + u(b) + ' hoch und ' + u(c) + ' tief. Berechne seine Oberfläche.' + prismSvg(P, c, { labels: [{ i: 0, t: u(a) }, { i: 3, t: u(b) }], hl: u(c) }), inputs: [numIn(O, 'O =', 'cm²')],
        hints: ['Ein Quader hat sechs Rechtecke. Je zwei gegenüberliegende sind gleich groß.', 'Vorne/hinten: ' + f(a) + ' · ' + f(b) + ' = ' + f(r3(a * b)) + '. Oben/unten: ' + f(a) + ' · ' + f(c) + ' = ' + f(r3(a * c)) + '. Links/rechts: ' + f(b) + ' · ' + f(c) + ' = ' + f(r3(b * c)) + '.', 'O = 2 · (' + f(r3(a * b)) + ' + ' + f(r3(a * c)) + ' + ' + f(r3(b * c)) + ').'],
        solution: 'O = 2 · (' + f(a) + ' · ' + f(b) + ' + ' + f(a) + ' · ' + f(c) + ' + ' + f(b) + ' · ' + f(c) + ') = 2 · ' + f(r3(a * b + a * c + b * c)) + ' cm² = ' + f(O) + ' cm². Auch als Prisma: O = 2 · G + u · h = 2 · ' + f(r3(a * b)) + ' + ' + f(2 * (a + b)) + ' · ' + f(c) + ' = ' + f(O) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - O / 2) < 1e-6) return 'Jedes Rechteck kommt zweimal vor (gegenüberliegende Flächen). Verdopple.'; if (Math.abs(x - a * b * c) < 1e-6) return 'Das ist das Volumen. Gesucht ist die Oberfläche, also die Summe aller Flächen.'; return null; },
        verify: function () { var s = 0; netShapes(P, c, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - O) < 1e-6 || 'Netz ' + s; } };
    },
    dreieck_o: function (lvl) {
      var t = M.pick(['iso', 'right']), k = M.pick(lvl >= 2 ? [1, 1.5, 2, 2.5] : [1, 2]), b = base(t, k), H = M.rnd(6, 20), G = r3(b.G), uu = r3(sum(b.s)), Mm = r3(uu * H), O = r3(2 * G + Mm);
      return { skill: 'Oberfläche Dreiecksprisma', q: 'Berechne Grundfläche, Mantelfläche und Oberfläche des Dreiecksprismas (Maße in cm).' + prismPic(b, H),
        inputs: [numIn(G, 'G =', 'cm²'), numIn(Mm, 'M =', 'cm²'), numIn(O, 'O =', 'cm²')],
        hints: ['Grundfläche: G = g · ' + HG + ' : 2 = ' + f(b.g) + ' · ' + f(b.hg) + ' : 2.' + (t === 'right' ? ' Im rechtwinkligen Dreieck sind die beiden Katheten Grundseite und Höhe.' : ''), 'Mantel: u = ' + b.s.map(function (x) { return f(x); }).join(' + ') + ' = ' + f(uu) + ' cm, M = u · h = ' + f(uu) + ' · ' + H + '.', 'O = 2 · G + M.'],
        solution: 'G = ' + f(b.g) + ' cm · ' + f(b.hg) + ' cm : 2 = ' + f(G) + ' cm². M = ' + f(uu) + ' cm · ' + H + ' cm = ' + f(Mm) + ' cm². O = 2 · ' + f(G) + ' cm² + ' + f(Mm) + ' cm² = ' + f(O) + ' cm².',
        mistakes: function (v) { var g = M.parseNum(v[0]), o = M.parseNum(v[2]); if (g !== null && Math.abs(g - 2 * G) < 1e-6) return 'Die Grundfläche ist ein Dreieck: Teile g · ' + HG + ' durch 2.'; if (o !== null && Math.abs(o - (G + Mm)) < 1e-6) return 'Ein Prisma hat <b>zwei</b> Dreiecke: Grund- und Deckfläche. O = 2 · G + M.'; return null; },
        verify: function () { var s = 0; netShapes(b.P, H, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - O) < 1e-6 && Math.abs(gauss(b.P) - G) < 1e-6 || 'Netz ' + s; } };
    },
    trapez_o: function (lvl) {
      var k = M.pick([1, 2]), c = M.pick([2, 3, 4, 5]) * k / (k === 2 ? 2 : 1), b = base('trap', k, c), H = M.rnd(5, 15), G = r3(b.G), uu = r3(sum(b.s)), Mm = r3(uu * H), O = r3(2 * G + Mm);
      return { skill: 'Oberfläche Trapezprisma', q: 'Die Grundfläche des Prismas ist ein gleichschenkliges Trapez (a = ' + u(b.a) + ', c = ' + u(b.c) + ', Schenkel ' + u(5 * k) + ', Höhe ' + u(4 * k) + '). Das Prisma ist ' + u(H) + ' lang. Berechne G, M und O.' + prismPic(b, H),
        inputs: [numIn(G, 'G =', 'cm²'), numIn(Mm, 'M =', 'cm²'), numIn(O, 'O =', 'cm²')],
        hints: ['G = (a + c) : 2 · ' + HG + ' = (' + f(b.a) + ' + ' + f(b.c) + ') : 2 · ' + f(4 * k) + '.', 'u = ' + f(b.a) + ' + ' + f(b.c) + ' + 2 · ' + f(5 * k) + ' = ' + f(uu) + ' cm. M = u · h.', 'O = 2 · G + M = 2 · ' + f(G) + ' + ' + f(Mm) + '.'],
        solution: 'G = (' + f(b.a) + ' cm + ' + f(b.c) + ' cm) : 2 · ' + f(4 * k) + ' cm = ' + f(G) + ' cm². M = ' + f(uu) + ' cm · ' + H + ' cm = ' + f(Mm) + ' cm². O = 2 · ' + f(G) + ' cm² + ' + f(Mm) + ' cm² = ' + f(O) + ' cm².',
        mistakes: function (v) { var m = M.parseNum(v[1]); if (m !== null && Math.abs(m - (b.a + b.c + 5 * k) * H) < 1e-6) return 'Das Trapez hat zwei Schenkel. Beide gehören zum Umfang.'; return null; },
        verify: function () { var s = 0; netShapes(b.P, H, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - O) < 1e-6 || 'Netz ' + s; } };
    },
    zelt: function (lvl) {
      var k = M.pick([0.3, 0.4, 0.5]), b = base('iso', k), L = M.pick([2, 2.2, 2.5]), G = r3(b.G), roof = r3(2 * 5 * k * L), floor = r3(6 * k * L), noFloor = lvl >= 3 && Math.random() < 0.5, O = r3(2 * G + roof + (noFloor ? 0 : floor));
      return { skill: 'Sachaufgabe Zelt', q: 'Ein Zelt hat die Form eines Dreiecksprismas: Die Giebelseiten sind gleichschenklige Dreiecke (Breite ' + u(6 * k, 'm') + ', Höhe ' + u(4 * k, 'm') + ', Dachkante ' + u(5 * k, 'm') + '). Das Zelt ist ' + u(L, 'm') + ' lang. Wie viel m² Stoff braucht man für das Zelt ' + (noFloor ? '<b>ohne</b> Boden' : '<b>mit</b> Boden') + '?' + prismPic(b, L, 'm'),
        inputs: [numIn(O, 'Stoff', 'm²', 0.0005)],
        hints: ['Zwei Giebeldreiecke: je ' + f(6 * k) + ' m · ' + f(4 * k) + ' m : 2 = ' + f(G) + ' m².', 'Zwei Dachflächen: je ' + f(5 * k) + ' m · ' + f(L) + ' m.' + (noFloor ? ' Der Boden wird nicht gebraucht.' : ' Boden: ' + f(6 * k) + ' m · ' + f(L) + ' m.'), 'Addiere alle Teile.'],
        solution: 'Giebel: 2 · ' + f(G) + ' m² = ' + f(r3(2 * G)) + ' m². Dach: 2 · ' + f(5 * k) + ' m · ' + f(L) + ' m = ' + f(roof) + ' m².' + (noFloor ? '' : ' Boden: ' + f(6 * k) + ' m · ' + f(L) + ' m = ' + f(floor) + ' m².') + ' Zusammen: ' + f(O) + ' m².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (!noFloor && Math.abs(x - (O - floor)) < 1e-6) return 'Der Boden fehlt noch.'; if (noFloor && Math.abs(x - (O + floor)) < 1e-6) return 'Das Zelt hat keinen Boden. Ziehe ihn ab.'; if (Math.abs(x - (O + 2 * G)) < 1e-6) return 'Die Giebeldreiecke sind nur halb so groß wie Breite mal Höhe.'; return null; },
        verify: function () { var s = 0; netShapes(b.P, L, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - (noFloor ? O + floor : O)) < 1e-6 || 'Netz ' + s; } };
    },
    verpackung: function (lvl) {
      var tri = Math.random() < 0.5, b, H, O, txt;
      if (tri) { b = base('iso', 1); H = M.pick([18, 20, 22, 25]); O = 2 * b.G + sum(b.s) * H; txt = 'Eine Schokoladenverpackung ist ein Dreiecksprisma. Die Dreiecke sind 6 cm breit und 4 cm hoch, die schrägen Seiten 5 cm lang. Die Verpackung ist ' + H + ' cm lang.'; }
      else { var a = M.rnd(10, 25), c = M.rnd(5, 15); b = base('rect', a, M.rnd(3, 10)); H = c; O = 2 * b.G + sum(b.s) * H; txt = 'Eine Schachtel ist ein Quader: ' + b.s[0] + ' cm lang, ' + b.s[1] + ' cm hoch und ' + H + ' cm tief.'; }
      var P10 = r3(O * 1.1);
      return { skill: 'Sachaufgabe Verpackung', q: txt + ' Für Klebelaschen und Verschnitt braucht man 10 % mehr Pappe als die Oberfläche.<br>a) Wie groß ist die Oberfläche?<br>b) Wie viel cm² Pappe braucht man?' + prismPic(b, H),
        inputs: [numIn(O, 'a) O =', 'cm²'), numIn(P10, 'b) Pappe', 'cm²', 0.05)],
        hints: ['O = 2 · G + u · h. ' + (tri ? 'G = 6 · 4 : 2 = 12 cm², u = 6 + 5 + 5 = 16 cm.' : 'G = ' + b.s[0] + ' · ' + b.s[1] + ' = ' + b.G + ' cm², u = ' + sum(b.s) + ' cm.'), 'O = 2 · ' + b.G + ' + ' + sum(b.s) + ' · ' + H + ' = ' + O + ' cm².', '10 % mehr: O · 1,1 = ' + O + ' · 1,1.'],
        solution: 'a) O = 2 · ' + b.G + ' cm² + ' + sum(b.s) + ' cm · ' + H + ' cm = ' + O + ' cm². b) ' + O + ' cm² · 1,1 = ' + f(P10) + ' cm².',
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && Math.abs(y - (O + 10)) < 1e-6) return '10 % sind ein Zehntel der Oberfläche, nicht 10 cm².'; return null; },
        verify: function () { var s = 0; netShapes(b.P, H, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - O) < 1e-6 || 'Netz ' + s; } };
    },
    hoehe: function () {
      var tri = Math.random() < 0.5, b = tri ? base(M.pick(['iso', 'right']), M.pick([1, 2])) : base('rect', M.rnd(3, 8), M.rnd(2, 6)), H = M.rnd(4, 15), uu = sum(b.s), O = r3(2 * b.G + uu * H);
      return { skill: 'Körperhöhe aus der Oberfläche', level: 3, q: 'Ein Prisma hat eine Oberfläche von ' + f(O) + ' cm². Seine Grundfläche ist ' + (tri ? 'ein ' + b.name + ' mit den Seiten ' + b.s.map(function (x) { return f(x); }).join(' cm, ') + ' cm' + (b.name === 'gleichschenkliges Dreieck' ? ' und der Höhe ' + u(b.hg) + ' zur Grundseite ' + u(b.g) : ' (der rechte Winkel liegt zwischen den Seiten ' + f(b.s[0]) + ' cm und ' + f(b.s[2]) + ' cm)') : 'ein Rechteck mit ' + b.s[0] + ' cm und ' + b.s[1] + ' cm') + '. Wie lang ist das Prisma (Körperhöhe h)?',
        inputs: [numIn(H, 'h =', 'cm')],
        hints: ['Berechne zuerst G und u: G = ' + f(b.G) + ' cm², u = ' + f(uu) + ' cm.', 'O = 2 · G + u · h, also ' + f(O) + ' = ' + f(2 * b.G) + ' + ' + f(uu) + ' · h.', 'u · h = ' + f(O) + ' − ' + f(2 * b.G) + ' = ' + f(r3(O - 2 * b.G)) + '. Teile durch ' + f(uu) + '.'],
        solution: 'G = ' + f(b.G) + ' cm², u = ' + f(uu) + ' cm. M = O − 2 · G = ' + f(O) + ' − ' + f(2 * b.G) + ' = ' + f(r3(O - 2 * b.G)) + ' cm². h = M : u = ' + f(r3(O - 2 * b.G)) + ' : ' + f(uu) + ' = ' + H + ' cm.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - (O - b.G) / uu) < 1e-6) return 'Ziehe beide Grundflächen ab: 2 · G.'; if (x !== null && Math.abs(x - O / uu) < 1e-6) return 'Ziehe zuerst die beiden Grundflächen von der Oberfläche ab. Nur der Mantel ist u · h.'; return null; },
        verify: function () { var s = 0; netShapes(b.P, H, {}).polys.forEach(function (p) { s += gauss(p.P); }); return Math.abs(s - O) < 1e-6 || 'Netz ' + s; } };
    }
  };

  var EXB = base('iso', 1);
  return {
    id: '025', title: 'Prismen: Netz und Oberfläche', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Flächeninhalt von Rechteck, Dreieck und Trapez, Würfel und Quader',
    lead: 'Wie viel Pappe steckt in einer Schokoladenverpackung? Du lernst Prismen und ihre Netze kennen und berechnest Mantel und Oberfläche.',
    einstieg: { html: '<p>Eine dreieckige Schokoladenverpackung, ein Zelt, ein Holzbalken, ein Bleistift mit sechs Kanten: Alle diese Körper haben etwas gemeinsam. Oben und unten (oder vorne und hinten) sitzt dieselbe Fläche, dazwischen nur Rechtecke.</p><p class="note">Schneide eine leere Verpackung an den Kanten auf und klappe sie flach auseinander. Welche Flächen entdeckst du? Wie viel Pappe wurde verbraucht?</p><p>Solche Körper heißen <b>Prismen</b>. Die aufgeklappte Form ist ihr <b>Netz</b>. Mit dem Netz berechnest du die <b>Oberfläche</b>.</p>' },
    ziele: ['Ich erkenne Prismen und benenne Grundfläche, Deckfläche, Mantel und Körperhöhe.', 'Ich zähle Flächen, Kanten und Ecken eines Prismas.', 'Ich entscheide, ob ein Netz zu einem Prisma oder Würfel gehört.', 'Ich berechne die Mantelfläche mit M = u · h und die Oberfläche mit O = 2 · G + M.', 'Ich löse Sachaufgaben zu Zelten und Verpackungen.'],
    fachwoerter: [['Prisma', 'Ein Körper mit zwei gleichen, parallelen Vielecken als Grund- und Deckfläche. Die Seitenflächen sind Rechtecke.'], ['Grundfläche G', 'Eine der beiden gleichen Vielecksflächen. Sie gibt dem Prisma den Namen, zum Beispiel Dreiecksprisma.'], ['Mantel M', 'Alle Rechtecke zwischen Grund- und Deckfläche zusammen.'], ['Körperhöhe h', 'Der Abstand zwischen Grund- und Deckfläche. Liegt das Prisma, ist es seine Länge.'], ['Netz', 'Der aufgeklappte Körper: alle Flächen hängen zusammen und liegen flach in der Ebene.']],
    diagnose: [
      { q: 'Ein Dreieck hat die Grundseite 8 cm und die Höhe 5 cm. Wie groß ist es?', options: ['40 cm²', '20 cm²', '13 cm²', 'Weiß ich noch nicht'], answer: 1, why: '8 cm · 5 cm : 2 = 20 cm².', review: 'Flächeninhalt des Dreiecks (Modul 023)' },
      { q: 'Wie groß ist der Umfang eines Dreiecks mit den Seiten 3 cm, 4 cm und 5 cm?', options: ['12 cm', '6 cm', '60 cm', 'Weiß ich noch nicht'], answer: 0, why: '3 + 4 + 5 = 12 cm.', review: 'Umfang von Vielecken' },
      { q: 'Wie viele Flächen hat ein Würfel?', options: ['4', '8', '6', 'Weiß ich noch nicht'], answer: 2, why: 'Oben, unten, vorne, hinten, links, rechts: 6 Quadrate.', review: 'Würfel und Quader (Klasse 5/6)' },
      { q: 'Ein Trapez hat die parallelen Seiten 7 cm und 3 cm und die Höhe 4 cm. Wie groß ist es?', options: ['84 cm²', '40 cm²', '20 cm²', 'Weiß ich noch nicht'], answer: 2, why: '(7 + 3) : 2 · 4 = 20 cm².', review: 'Flächeninhalt des Trapezes (Modul 023)' }],
    erklaerung:
      '<h3>1. Was ist ein Prisma?</h3><p>Ein Prisma hat zwei gleiche Vielecke, die <b>Grundfläche</b> und die <b>Deckfläche</b>. Sie liegen parallel zueinander. Dazwischen liegen Rechtecke, zusammen heißen sie <b>Mantel</b>. Der Abstand zwischen Grund- und Deckfläche ist die <b>Körperhöhe h</b>. Ein Quader ist ein Prisma mit rechteckiger Grundfläche.</p>' +
      '<p>Im Schrägbild zeichnest du die Grundfläche vorne in wahrer Größe. Die nach hinten laufenden Kanten zeichnest du schräg (45°) und nur halb so lang. Verdeckte Kanten sind gestrichelt.</p>' + prismSvg(EXB.P, 8, { front: '#f6d9a8', labels: [{ i: 0, t: 'g' }], hl: 'h', label: 'Dreiecksprisma im Schrägbild' }) +
      '<h3>2. Das Netz</h3><p>Klappst du das Prisma auf, liegen die Rechtecke des Mantels nebeneinander. Zusammen bilden sie ein großes Rechteck: Seine Länge ist der <b>Umfang u</b> der Grundfläche, seine Breite ist die Körperhöhe h. Grund- und Deckfläche hängen oben und unten daran.</p>' + netSvg(EXB.P, 8, { labels: ['6', '5', '5'], hl: 'h', label: 'Netz eines Dreiecksprismas' }) +
      '<div class="merk"><b>Merke:</b> Mantelfläche: <span class="big-math">M = u · h</span><br>Oberfläche: <span class="big-math">O = 2 · G + M</span><br>G ist die Grundfläche, u ihr Umfang, h die Körperhöhe.</div>' +
      '<h3>3. Flächen, Kanten, Ecken</h3><p>Hat die Grundfläche n Ecken, dann hat das Prisma <b>n + 2</b> Flächen, <b>3 · n</b> Kanten und <b>2 · n</b> Ecken.</p>' +
      '<h3>4. Beispiel</h3><p>Grundfläche: Dreieck mit g = 6 cm, ' + HG + ' = 4 cm und den Seiten 6 cm, 5 cm, 5 cm. Körperhöhe h = 8 cm.<br>G = 6 · 4 : 2 = 12 cm². u = 6 + 5 + 5 = 16 cm. M = 16 · 8 = 128 cm². O = 2 · 12 + 128 = 152 cm².</p>' +
      '<p class="note"><b>Achtung:</b> Verwechsle nicht die Höhe der Grundfläche (' + HG + ', im Dreieck) mit der Körperhöhe h (Länge des Prismas).</p>',
    entdecken: {
      html: '<p>Wähle eine Grundfläche und verändere Größe und Körperhöhe. Schrägbild, Netz und Rechnung passen sich an.</p><div class="ctl"><label>Grundfläche <select id="e_b"><option value="right">rechtwinkliges Dreieck</option><option value="rect">Rechteck</option><option value="trap">Trapez</option></select></label></div>' +
        '<div class="ctl"><label>Größe k = <b id="v_k"></b> <input type="range" id="r_k" min="0.5" max="2.5" step="0.5" value="1"></label><label>Körperhöhe h = <b id="v_h"></b> <input type="range" id="r_h" min="2" max="12" step="1" value="6"></label></div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:8px 20px;align-items:flex-start"><div id="e_p" style="flex:1 1 260px"></div><div id="e_n" style="flex:1 1 260px"></div></div><div id="e_t"></div>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var t = root.querySelector('#e_b').value, k = +root.querySelector('#r_k').value, h = +root.querySelector('#r_h').value;
          var b = t === 'rect' ? base('rect', 4 * k, 2 * k) : t === 'trap' ? base('trap', k, 2 * k) : base('right', k);
          root.querySelector('#v_k').textContent = f(k); root.querySelector('#v_h').textContent = h + ' cm';
          var uu = r3(sum(b.s)), G = r3(b.G), Mm = r3(uu * h);
          root.querySelector('#e_p').innerHTML = prismSvg(b.P, h, { front: '#f6d9a8', hl: h + ' cm', W: 300 });
          root.querySelector('#e_n').innerHTML = netSvg(b.P, h, { labels: b.s.map(function (x) { return f(x); }), W: 300 });
          root.querySelector('#e_t').innerHTML = '<p>Seiten der Grundfläche: ' + b.s.map(function (x) { return f(x); }).join(' cm, ') + ' cm</p><p class="big-math">G = ' + f(G) + ' cm² · u = ' + f(uu) + ' cm</p><p class="big-math">M = u · h = ' + f(uu) + ' · ' + h + ' = ' + f(Mm) + ' cm²</p><p class="big-math">O = 2 · G + M = ' + f(r3(2 * G + Mm)) + ' cm²</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Gut beobachtet: Wird das Prisma länger, wächst nur der Mantel. Die beiden Grundflächen bleiben gleich. Darum ist O = 2 · G + u · h.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_b').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Holzbalken streichen', q: 'Ein Holzbalken ist ein Trapezprisma. Die Grundfläche ist ein gleichschenkliges Trapez mit a = 14 cm, c = 8 cm, Schenkeln von 5 cm und der Höhe 4 cm. Der Balken ist 2 m lang. Wie viel cm² müssen gestrichen werden, wenn alle Flächen Farbe bekommen?' + prismSvg(base('trap', 1, 8).P, 30, { labels: [{ i: 0, t: '14 cm' }, { i: 2, t: '8 cm' }, { i: 3, t: '5 cm' }], hl: '2 m (verkürzt)' }),
      steps: ['Einheiten angleichen: h = 2 m = 200 cm.', 'Grundfläche: G = (14 cm + 8 cm) : 2 · 4 cm = 44 cm².', 'Umfang: u = 14 + 8 + 5 + 5 = 32 cm. Mantel: M = 32 cm · 200 cm = 6 400 cm².', 'Oberfläche: O = 2 · 44 cm² + 6 400 cm² = 6 488 cm².', 'Antwort: 6 488 cm², das sind etwa 0,65 m². Kontrolle: Der Mantel ist viel größer als die Enden, das passt zu einem langen Balken.'] },
    tasks: { gen: gen, plan: { G: ['erkennen:1', 'netz:1', 'quader:1', 'mantel:1'], S: ['netz:2', 'quader:1', 'mantel:2', 'dreieck_o:2', 'verpackung:2'], E: ['teile:2', 'netz:2', 'dreieck_o:2', 'trapez_o:3', 'zelt:3', 'mantel:2'] },
      extra: 'hoehe', test: ['erkennen:1', 'netz:2', 'quader:1', 'mantel:2', 'dreieck_o:2', 'zelt:2'] },
    lerncheck: ['Ich erkenne Prismen und benenne Grundfläche, Mantel und Körperhöhe.', 'Ich erkenne, ob ein Netz zu einem Prisma passt.', 'Ich berechne Mantelfläche und Oberfläche eines Prismas.', 'Ich löse Sachaufgaben zur Oberfläche.']
  };
})();
