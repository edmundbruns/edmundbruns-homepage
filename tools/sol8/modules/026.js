/* Modul 026 · Prismen: Volumen */
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
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  var HG = 'h<sub>G</sub>';
  function base(type, k, c0) {
    if (type === 'iso') return { P: [[0, 0], [6 * k, 0], [3 * k, 4 * k]], name: 'gleichschenkliges Dreieck', g: 6 * k, hg: 4 * k, G: 12 * k * k, foot: [[3 * k, 4 * k], [3 * k, 0]] };
    if (type === 'right') return { P: [[0, 0], [4 * k, 0], [0, 3 * k]], name: 'rechtwinkliges Dreieck', g: 4 * k, hg: 3 * k, G: 6 * k * k };
    if (type === 'trap') { var c = c0, a = c + 6 * k; return { P: [[0, 0], [a, 0], [a - 3 * k, 4 * k], [3 * k, 4 * k]], name: 'Trapez', a: a, c: c, hg: 4 * k, G: (a + c) / 2 * 4 * k, foot: [[3 * k, 4 * k], [3 * k, 0]] }; }
    return { P: [[0, 0], [k, 0], [k, c0], [0, c0]], name: 'Rechteck', G: k * c0 };
  }
  /* Volumen unabhängig: Grundfläche aus Eckpunkten mal Körperhöhe */
  function volCheck(P, h, V, scale) { return function () { var x = gauss(P) * h * (scale || 1); return Math.abs(x - V) < 1e-6 * Math.max(1, V) || 'Koordinaten ergeben ' + x + ' statt ' + V; }; }
  function triPic(b, h, e) {
    var segs = b.foot ? [{ a: b.foot[0], b: b.foot[1], t: u(b.hg, e), dash: true, side: -1, at: 0.55 }] : [];
    var labels = [{ i: 0, t: u(b.g || b.a, e) }];
    if (b.name === 'rechtwinkliges Dreieck') labels.push({ i: 2, t: u(b.hg, e) });
    if (b.name === 'Trapez') labels.push({ i: 2, t: u(b.c, e), side: -1 });
    return prismSvg(b.P, h, { labels: labels, hl: u(h, e), segs: segs });
  }
  /* Einheiten-Umrechnungen: [von, nach, Faktor] */
  var CONV = [['dm³', 'cm³', 1000], ['cm³', 'dm³', 0.001], ['l', 'ml', 1000], ['ml', 'l', 0.001], ['m³', 'dm³', 1000], ['m³', 'l', 1000], ['dm³', 'l', 1], ['cm³', 'ml', 1], ['l', 'cm³', 1000], ['cm³', 'l', 0.001]];
  var ORDER = { 'm³': 1e9, 'dm³': 1e6, 'l': 1e6, 'cm³': 1e3, 'ml': 1e3 }; /* in mm³, für die Prüfung */

  var gen = {
    quader: function (lvl) {
      var a = M.rnd(3, 12), b = M.rnd(2, 8), c = M.rnd(2, 10); if (lvl >= 3) { a += 0.5; b += 0.5; }
      var V = r3(a * b * c), P = base('rect', a, b).P;
      return { skill: 'Volumen des Quaders', q: 'Berechne das Volumen des Quaders.' + prismSvg(P, c, { labels: [{ i: 0, t: u(a) }, { i: 3, t: u(b) }], hl: u(c) }), inputs: [numIn(V, 'V =', 'cm³')],
        hints: ['Der Quader ist ein Prisma mit rechteckiger Grundfläche: V = G · h.', 'G = ' + f(a) + ' cm · ' + f(b) + ' cm = ' + f(r3(a * b)) + ' cm².', 'V = ' + f(r3(a * b)) + ' cm² · ' + f(c) + ' cm.'],
        solution: 'V = a · b · c = ' + f(a) + ' cm · ' + f(b) + ' cm · ' + f(c) + ' cm = ' + f(V) + ' cm³',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - 2 * (a * b + a * c + b * c)) < 1e-6) return 'Das ist die Oberfläche. Für das Volumen multiplizierst du die drei Kantenlängen.'; if (Math.abs(x - (a + b + c)) < 1e-6) return 'Beim Volumen wird multipliziert, nicht addiert.'; return null; },
        verify: volCheck(P, c, V) };
    },
    dreieck: function (lvl) {
      var t = M.pick(['iso', 'right']), k = M.pick(lvl >= 2 ? [1, 1.5, 2, 2.5] : [1, 2]), b = base(t, k), h = M.rnd(5, 20), V = r3(b.G * h);
      return { skill: 'Volumen Dreiecksprisma', q: 'Berechne das Volumen des Dreiecksprismas. Die Grundfläche ist ein ' + b.name + '.' + triPic(b, h), inputs: [numIn(V, 'V =', 'cm³')],
        hints: ['V = G · h. Berechne zuerst die Grundfläche (das Dreieck).', 'G = g · ' + HG + ' : 2 = ' + f(b.g) + ' · ' + f(b.hg) + ' : 2 = ' + f(b.G) + ' cm².', 'V = ' + f(b.G) + ' cm² · ' + h + ' cm.'],
        solution: 'G = ' + f(b.g) + ' cm · ' + f(b.hg) + ' cm : 2 = ' + f(b.G) + ' cm². V = G · h = ' + f(b.G) + ' cm² · ' + h + ' cm = ' + f(V) + ' cm³.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - 2 * V) < 1e-6) return 'Die Grundfläche ist ein Dreieck. Vergiss nicht, durch 2 zu teilen.'; return null; },
        verify: volCheck(b.P, h, V) };
    },
    trapez: function (lvl) {
      var k = M.pick([1, 2]), c = M.rnd(2, 6), b = base('trap', k, c), h = M.rnd(5, 15), V = r3(b.G * h);
      return { skill: 'Volumen Trapezprisma', q: 'Die Grundfläche des Prismas ist ein Trapez mit den parallelen Seiten ' + u(b.a) + ' und ' + u(b.c) + ' und der Höhe ' + u(b.hg) + '. Das Prisma ist ' + u(h) + ' lang. Berechne das Volumen.' + triPic(b, h), inputs: [numIn(V, 'V =', 'cm³')],
        hints: ['V = G · h. Die Grundfläche ist ein Trapez.', 'G = (a + c) : 2 · ' + HG + ' = (' + f(b.a) + ' + ' + f(b.c) + ') : 2 · ' + f(b.hg) + ' = ' + f(b.G) + ' cm².', 'V = ' + f(b.G) + ' cm² · ' + h + ' cm.'],
        solution: 'G = (' + f(b.a) + ' cm + ' + f(b.c) + ' cm) : 2 · ' + f(b.hg) + ' cm = ' + f(b.G) + ' cm². V = ' + f(b.G) + ' cm² · ' + h + ' cm = ' + f(V) + ' cm³.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - 2 * V) < 1e-6) return 'Beim Trapez nimmst du den Mittelwert (a + c) : 2. Du hast das Teilen durch 2 vergessen.'; if (Math.abs(x - b.a * b.hg * h) < 1e-6) return 'Die Grundfläche ist kein Rechteck. Nimm den Mittelwert der parallelen Seiten.'; return null; },
        verify: volCheck(b.P, h, V) };
    },
    zusammen: function (lvl) {
      var W = M.rnd(6, 10), H = M.rnd(5, 8), w2 = M.rnd(2, W - 3), h2 = M.rnd(2, H - 3), L = M.rnd(5, 15);
      var P = [[0, 0], [W, 0], [W, H - h2], [W - w2, H - h2], [W - w2, H], [0, H]], G = W * H - w2 * h2, V = G * L;
      var svg = prismSvg(P, L, { labels: [{ i: 0, t: u(W) }, { i: 5, t: u(H) }, { i: 4, t: u(W - w2) }, { i: 1, t: u(H - h2) }], hl: u(L), label: 'Prisma mit L-förmiger Grundfläche' });
      return { skill: 'Zusammengesetztes Prisma', q: 'Die Grundfläche dieses Prismas ist L-förmig (alle Ecken sind rechte Winkel). Berechne die Grundfläche und das Volumen.' + svg,
        inputs: [numIn(G, 'G =', 'cm²'), numIn(V, 'V =', 'cm³')],
        hints: ['Zerlege die L-Form in zwei Rechtecke oder ergänze sie zu einem großen Rechteck.', 'Ergänzen: ' + W + ' · ' + H + ' = ' + W * H + ' cm². Die fehlende Ecke ist ' + w2 + ' cm breit und ' + h2 + ' cm hoch.', 'G = ' + G + ' cm². V = G · h = ' + G + ' · ' + L + '.'],
        solution: 'G = ' + W + ' cm · ' + H + ' cm − ' + w2 + ' cm · ' + h2 + ' cm = ' + G + ' cm². V = ' + G + ' cm² · ' + L + ' cm = ' + V + ' cm³.',
        mistakes: function (v) { var g = M.parseNum(v[0]); if (g !== null && g === W * H) return 'An einer Ecke fehlt ein Stück der Grundfläche. Ziehe es ab.'; return null; },
        verify: volCheck(P, L, V) };
    },
    einheiten: function (lvl) {
      var c = M.pick(lvl <= 1 ? CONV.filter(function (x) { return x[2] !== 0.001 || x[0] === 'cm³'; }).slice(0, 7) : CONV), x;
      if (c[2] === 1000) x = M.pick([2, 3.5, 0.75, 12, 0.4, 1.25, 7]); else if (c[2] === 1) x = M.pick([250, 4, 1.5, 750, 12]); else x = M.pick([2500, 750, 12000, 400, 1500, 50]);
      var ans = r3(x * c[2]);
      return { skill: 'Volumeneinheiten umrechnen', q: 'Rechne um: <span class="big-math">' + f(x) + ' ' + c[0] + ' = ? ' + c[1] + '</span>', inputs: [numIn(ans, f(x) + ' ' + c[0] + ' =', c[1])],
        hints: ['Merke: 1 m³ = 1 000 dm³, 1 dm³ = 1 000 cm³, 1 dm³ = 1 l und 1 cm³ = 1 ml.', c[2] === 1 ? c[0] + ' und ' + c[1] + ' sind gleich groß. Die Zahl bleibt gleich.' : 'Die Umrechnungszahl ist hier 1 000.', c[2] === 1000 ? 'Von der größeren zur kleineren Einheit: mal 1 000.' : c[2] === 1 ? 'Ergebnis: ' + f(x) + '.' : 'Von der kleineren zur größeren Einheit: durch 1 000.'],
        solution: f(x) + ' ' + c[0] + ' = ' + f(x) + (c[2] === 1000 ? ' · 1 000' : c[2] === 1 ? '' : ' : 1 000') + ' ' + c[1] + ' = ' + f(ans) + ' ' + c[1],
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === null) return null; if (c[2] !== 1 && (Math.abs(y - x * (c[2] > 1 ? 100 : 0.01)) < 1e-9 || Math.abs(y - x * (c[2] > 1 ? 10 : 0.1)) < 1e-9)) return 'Bei Volumeneinheiten ist die Umrechnungszahl 1 000 (10 · 10 · 10), nicht 10 oder 100.'; if (c[2] !== 1 && Math.abs(y - x / c[2]) < 1e-9) return 'Du hast in die falsche Richtung gerechnet. In der kleineren Einheit wird die Zahl größer.'; return null; },
        verify: function () { return Math.abs(x * ORDER[c[0]] - ans * ORDER[c[1]]) < 1e-6 * x * ORDER[c[0]] || 'Umrechnung falsch'; } };
    },
    umkehr: function (lvl) {
      var tri = Math.random() < (lvl >= 2 ? 0.6 : 0.3), b = tri ? base(M.pick(['iso', 'right']), M.pick([1, 2])) : base('rect', M.rnd(3, 10), M.rnd(2, 6)), h = M.rnd(4, 15), V = b.G * h, inL = lvl >= 2 && V % 100 === 0 && Math.random() < 0.5;
      var pic = tri ? prismSvg(b.P, h, { labels: [{ i: 0, t: u(b.g) }].concat(b.name === 'rechtwinkliges Dreieck' ? [{ i: 2, t: u(b.hg) }] : []), segs: b.foot ? [{ a: b.foot[0], b: b.foot[1], t: u(b.hg), dash: true, side: -1, at: 0.55 }] : [], hl: 'h = ?' }) : prismSvg(b.P, h, { labels: [{ i: 0, t: u(b.P[1][0]) }, { i: 3, t: u(b.P[2][1]) }], hl: 'h = ?' });
      return { skill: 'Körperhöhe aus dem Volumen', q: 'Das Prisma hat ein Volumen von ' + (inL ? f(V / 1000) + ' l' : f(V) + ' cm³') + '. Wie lang ist es (Körperhöhe h)?' + pic, inputs: [numIn(h, 'h =', 'cm')],
        hints: [(inL ? 'Rechne zuerst um: ' + f(V / 1000) + ' l = ' + f(V) + ' cm³. ' : '') + 'V = G · h, also h = V : G.', 'Grundfläche: G = ' + f(b.G) + ' cm².', 'h = ' + f(V) + ' : ' + f(b.G) + '.'],
        solution: (inL ? f(V / 1000) + ' l = ' + f(V) + ' cm³. ' : '') + 'G = ' + f(b.G) + ' cm². h = V : G = ' + f(V) + ' cm³ : ' + f(b.G) + ' cm² = ' + h + ' cm. Probe: ' + f(b.G) + ' · ' + h + ' = ' + f(V) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (tri && Math.abs(x - V / (2 * b.G)) < 1e-6) return 'Die Grundfläche ist ein Dreieck: g · ' + HG + ' : 2. Du hast nicht durch 2 geteilt.'; if (inL && Math.abs(x - h / 1000) < 1e-9) return 'Rechne die Liter zuerst in cm³ um: 1 l = 1 000 cm³.'; return null; },
        verify: volCheck(b.P, h, V) };
    },
    pool: function (lvl) {
      var L = M.pick([20, 25, 30]), B = M.pick([8, 10, 12]), d1 = M.pick([0.8, 1, 1.2]), d2 = M.pick([1.8, 2, 2.4]), D = d2;
      var P = [[0, D - d1], [L, 0], [L, D], [0, D]], G = r3((d1 + d2) / 2 * L), V = r3(G * B), X4 = function (Q) { return Q.map(function (q) { return [q[0], q[1] * 4]; }); };
      var svg = prismSvg(X4(P), B, { labels: [{ i: 2, t: u(L, 'm'), side: 1, at: 0.3 }, { i: 3, t: u(d1, 'm') }, { i: 1, t: u(d2, 'm') }], hl: u(B, 'm'), label: 'Schwimmbecken mit schrägem Boden', maxH: 220 }) + '<p class="note">Skizze nicht maßstabsgetreu: Die Tiefe ist viermal überhöht gezeichnet.</p>';
      return { skill: 'Sachaufgabe Schwimmbecken', q: 'Ein Schwimmbecken ist ' + L + ' m lang und ' + B + ' m breit. Am flachen Ende ist es ' + f(d1) + ' m tief, am tiefen Ende ' + f(d2) + ' m. Der Boden fällt gleichmäßig ab. Die Seitenansicht ist also ein Trapez.<br>a) Wie viel m³ Wasser passen hinein?<br>b) Wie viel Liter sind das?' + svg,
        inputs: [numIn(V, 'a) V =', 'm³'), numIn(V * 1000, 'b) V =', 'l')],
        hints: ['Das Becken ist ein Prisma. Die Grundfläche ist das Trapez an der Seite mit den parallelen Seiten ' + f(d1) + ' m und ' + f(d2) + ' m und der „Höhe“ ' + L + ' m.', 'G = (' + f(d1) + ' + ' + f(d2) + ') : 2 · ' + L + ' = ' + f(G) + ' m². Die Körperhöhe ist die Breite ' + B + ' m.', 'V = ' + f(G) + ' · ' + B + ' m³. 1 m³ = 1 000 l.'],
        solution: 'a) G = (' + f(d1) + ' m + ' + f(d2) + ' m) : 2 · ' + L + ' m = ' + f(G) + ' m². V = ' + f(G) + ' m² · ' + B + ' m = ' + f(V) + ' m³. b) ' + f(V) + ' m³ = ' + f(V * 1000) + ' l.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - d2 * L * B) < 1e-6) return 'Das Becken ist nicht überall ' + f(d2) + ' m tief. Nimm die mittlere Tiefe (' + f(d1) + ' + ' + f(d2) + ') : 2.'; if (Math.abs(x - (d1 + d2) * L * B) < 1e-6) return 'Beim Trapez musst du durch 2 teilen.'; return null; },
        verify: volCheck(P, B, V) };
    },
    graben: function (lvl) {
      var c = M.pick([0.5, 0.8, 1]), s = M.pick([0.5, 0.75, 1]), t = M.pick([1, 1.2, 1.5]), Lg = M.pick([40, 50, 80, 120]); if (t === s) t = 1.2;
      var a = r3(c + 2 * s), P = [[s, 0], [s + c, 0], [a, t], [0, t]], G = r3((a + c) / 2 * t), V = r3(G * Lg);
      var svg = prismSvg(P, 2.5 * a, { labels: [{ i: 2, t: u(a, 'm'), side: 1, at: 0.3 }, { i: 0, t: u(c, 'm') }], segs: [{ a: [s, t], b: [s, 0], t: u(t, 'm'), dash: true, side: -1, at: 0.5 }], hl: u(Lg, 'm') + ' (verkürzt)', label: 'Graben mit Trapez-Querschnitt' });
      return { skill: 'Sachaufgabe Wassergraben', q: 'Ein Wassergraben wird ausgehoben. Sein Querschnitt ist ein Trapez: oben ' + u(a, 'm') + ' breit, unten ' + u(c, 'm') + ' breit und ' + u(t, 'm') + ' tief. Der Graben ist ' + Lg + ' m lang. Wie viel m³ Erde müssen ausgehoben werden?' + svg, inputs: [numIn(V, 'V =', 'm³')],
        hints: ['Der Graben ist ein liegendes Prisma. Die Grundfläche ist das Trapez, die Körperhöhe die Länge ' + Lg + ' m.', 'G = (' + f(a) + ' + ' + f(c) + ') : 2 · ' + f(t) + ' = ' + f(G) + ' m².', 'V = ' + f(G) + ' m² · ' + Lg + ' m.'],
        solution: 'G = (' + f(a) + ' m + ' + f(c) + ' m) : 2 · ' + f(t) + ' m = ' + f(G) + ' m². V = ' + f(G) + ' m² · ' + Lg + ' m = ' + f(V) + ' m³.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - a * t * Lg) < 1e-6) return 'Der Graben ist unten schmaler als oben. Nimm die mittlere Breite (a + c) : 2.'; return null; },
        verify: volCheck(P, Lg, V) };
    },
    dachboden: function (lvl) {
      var b = M.pick([6, 8, 9, 10]), hd = M.pick([2.5, 3, 3.5, 4]), L = M.pick([8, 10, 12]), P = [[0, 0], [b, 0], [b / 2, hd]], G = r3(b * hd / 2), V = r3(G * L);
      var svg = prismSvg(P, L, { labels: [{ i: 0, t: u(b, 'm') }], segs: [{ a: [b / 2, hd], b: [b / 2, 0], t: u(hd, 'm'), dash: true, side: -1, at: 0.55 }], hl: u(L, 'm'), label: 'Dachboden als Dreiecksprisma' });
      return { skill: 'Sachaufgabe Dachboden', q: 'Der Dachboden eines Hauses hat die Form eines Dreiecksprismas: Der Giebel ist ' + b + ' m breit und ' + f(hd) + ' m hoch, das Haus ist ' + L + ' m lang. Eine Lüftungsanlage soll die Luft im Dachboden jede Stunde einmal austauschen.<br>a) Wie groß ist der Rauminhalt?<br>b) Wie viel Liter Luft muss die Anlage pro Stunde bewegen?' + svg,
        inputs: [numIn(V, 'a) V =', 'm³'), numIn(V * 1000, 'b) Luft', 'l')],
        hints: ['Grundfläche ist das Giebeldreieck: G = ' + b + ' · ' + f(hd) + ' : 2 = ' + f(G) + ' m².', 'V = G · h = ' + f(G) + ' m² · ' + L + ' m.', '1 m³ = 1 000 l.'],
        solution: 'a) G = ' + b + ' m · ' + f(hd) + ' m : 2 = ' + f(G) + ' m². V = ' + f(G) + ' m² · ' + L + ' m = ' + f(V) + ' m³. b) ' + f(V) + ' m³ = ' + f(V * 1000) + ' l pro Stunde.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - 2 * V) < 1e-6) return 'Der Giebel ist ein Dreieck. Teile b · h durch 2.'; return null; },
        verify: volCheck(P, L, V) };
    },
    fuellhoehe: function () {
      var a = M.pick([50, 60, 80, 100]), b = M.pick([30, 40, 50]), H = M.pick([40, 50, 60]), w;
      do { w = M.rnd(10, H - 8); } while ((a * b * w) % 1000 !== 0);
      var lit = a * b * w / 1000, rest = r3(a * b * (H - 5) / 1000 - lit);
      return { skill: 'Füllhöhe berechnen', level: 3, q: 'Ein Aquarium ist innen ' + a + ' cm lang, ' + b + ' cm breit und ' + H + ' cm hoch. Es werden ' + f(lit) + ' l Wasser eingefüllt.<br>a) Wie hoch steht das Wasser?<br>b) Wie viel Liter passen noch hinein, bis das Wasser 5 cm unter dem Rand steht?' + prismSvg([[0, 0], [a, 0], [a, H], [0, H]], b, { labels: [{ i: 0, t: u(a) }, { i: 3, t: u(H) }], hl: u(b), label: 'Aquarium', maxH: 200 }),
        inputs: [numIn(w, 'a) Wasserhöhe', 'cm'), numIn(rest, 'b) noch', 'l')],
        hints: ['Rechne die Liter in cm³ um: ' + f(lit) + ' l = ' + f(lit * 1000) + ' cm³.', 'Das Wasser bildet einen Quader mit der Grundfläche ' + a + ' cm · ' + b + ' cm = ' + a * b + ' cm². Wasserhöhe = V : G.', 'Bis 5 cm unter den Rand: Höhe ' + (H - 5) + ' cm. Volumen dafür minus ' + f(lit) + ' l.'],
        solution: 'a) ' + f(lit * 1000) + ' cm³ : ' + a * b + ' cm² = ' + w + ' cm. b) ' + a * b + ' cm² · ' + (H - 5) + ' cm = ' + f(a * b * (H - 5)) + ' cm³ = ' + f(a * b * (H - 5) / 1000) + ' l. Es passen noch ' + f(a * b * (H - 5) / 1000) + ' l − ' + f(lit) + ' l = ' + f(rest) + ' l hinein.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - lit / (a * b)) < 1e-9) return 'Rechne zuerst die Liter in cm³ um (mal 1 000).'; return null; },
        verify: function () { return Math.abs(gauss([[0, 0], [a, 0], [a, w], [0, w]]) * b / 1000 - lit) < 1e-9 || 'Füllhöhe falsch'; } };
    }
  };

  var EXB = base('iso', 1);
  function layers(P, h, nL) {
    /* Schnittlinien auf den sichtbaren Seitenflächen bei jeder Schicht */
    var n = P.length, segs = [], kk = h / 2 * Math.SQRT1_2;
    for (var j = 1; j < nL; j++) { var t = kk * j / nL; P.forEach(function (p, i) { var q = P[(i + 1) % n], nx = q[1] - p[1], ny = -(q[0] - p[0]); if (nx + ny > 1e-9) segs.push({ a: [p[0] + t, p[1] + t], b: [q[0] + t, q[1] + t], col: '#5b3fa0', w: 1 }); }); }
    return segs;
  }
  return {
    id: '026', title: 'Prismen: Volumen', bereich: 'Größen und Messen', minutes: '45 bis 60',
    vorkenntnisse: 'Volumen des Quaders, Flächeninhalt von Dreieck und Trapez, Prismen',
    lead: 'Wie viel Wasser passt in ein Schwimmbecken mit schrägem Boden? Du lernst, dass für alle Prismen dieselbe Volumenformel gilt, und rechnest mit Litern und Kubikmetern.',
    einstieg: { html: '<p>Im Freibad wird im Frühjahr das Becken gefüllt. Es ist 25 m lang und 10 m breit. Am Nichtschwimmerende ist es 1 m tief, am anderen Ende 2 m. Der Boden ist schräg.</p><p class="note">Wie viele Liter Wasser braucht man? Reicht es, Länge mal Breite mal Tiefe zu rechnen? Welche Tiefe nimmst du?</p><p>Das Becken ist ein <b>Prisma</b>, das auf der Seite liegt. In diesem Modul lernst du, wie man das Volumen jedes Prismas berechnet und es in Liter umrechnet.</p>' },
    ziele: ['Ich erkläre, warum für jedes Prisma V = G · h gilt.', 'Ich berechne das Volumen von Quadern, Dreiecks- und Trapezprismen.', 'Ich berechne das Volumen von Prismen mit zusammengesetzter Grundfläche.', 'Ich rechne zwischen cm³, dm³, m³, Litern und Millilitern um.', 'Ich berechne die Körperhöhe aus dem Volumen und löse Sachaufgaben.'],
    fachwoerter: [['Volumen V', 'Der Rauminhalt eines Körpers. Er wird in cm³, dm³ oder m³ gemessen.'], ['Grundfläche G', 'Die Vielecksfläche, die das Prisma vorne und hinten (oder oben und unten) begrenzt.'], ['Körperhöhe h', 'Der Abstand zwischen Grund- und Deckfläche. Bei liegenden Prismen ist es die Länge.'], ['Liter', '1 Liter ist genau 1 dm³, also ein Würfel mit 10 cm Kantenlänge.']],
    diagnose: [
      { q: 'Wie groß ist das Volumen eines Würfels mit 3 cm Kantenlänge?', options: ['9 cm³', '27 cm³', '18 cm³', 'Weiß ich noch nicht'], answer: 1, why: '3 cm · 3 cm · 3 cm = 27 cm³.', review: 'Volumen von Würfel und Quader (Klasse 5/6)' },
      { q: 'Wie viele cm³ sind 1 dm³?', options: ['10 cm³', '100 cm³', '1 000 cm³', 'Weiß ich noch nicht'], answer: 2, why: '1 dm³ = 10 cm · 10 cm · 10 cm = 1 000 cm³.', review: 'Volumeneinheiten' },
      { q: 'Ein Dreieck hat die Grundseite 10 cm und die Höhe 6 cm. Wie groß ist es?', options: ['30 cm²', '60 cm²', '16 cm²', 'Weiß ich noch nicht'], answer: 0, why: '10 · 6 : 2 = 30 cm².', review: 'Flächeninhalt des Dreiecks (Modul 023)' },
      { q: 'Welcher Körper ist ein Prisma?', options: ['eine Pyramide', 'ein Quader', 'eine Kugel', 'Weiß ich noch nicht'], answer: 1, why: 'Ein Quader hat zwei gleiche, parallele Rechtecke als Grund- und Deckfläche.', review: 'Prismen erkennen (Modul 025)' }],
    erklaerung:
      '<h3>1. Volumen in Schichten</h3><p>Stell dir ein Prisma aus vielen dünnen Scheiben vor, wie ein geschnittenes Brot. Jede Scheibe ist 1 cm dick und hat die Grundfläche G als Querschnitt. Eine Scheibe hat also das Volumen G · 1 cm. Ist das Prisma h cm lang, gibt es h Scheiben.</p>' +
      prismSvg(EXB.P, 8, { front: '#f6d9a8', labels: [{ i: 0, t: 'Grundfläche G (orange)' }], hl: 'h = 8 Schichten', segs: layers(EXB.P, 8, 8), label: 'Prisma aus Schichten' }) +
      '<div class="merk"><b>Merke:</b> Für jedes Prisma gilt: <span class="big-math">V = G · h</span><br>Volumen = Grundfläche mal Körperhöhe. Beim Quader ist G = a · b, also V = a · b · c.</div>' +
      '<h3>2. So gehst du vor</h3><ol><li>Grundfläche erkennen: Welche Fläche ist vorne und hinten gleich?</li><li>G berechnen (Rechteck, Dreieck, Trapez oder zusammengesetzt).</li><li>Mit der Körperhöhe multiplizieren.</li></ol><p>Beispiel: Dreiecksprisma mit g = 6 cm, ' + HG + ' = 4 cm, h = 8 cm. G = 6 · 4 : 2 = 12 cm², V = 12 cm² · 8 cm = 96 cm³.</p>' +
      '<h3>3. Volumeneinheiten</h3><table class="tab"><tr><th>Einheit</th><th>umgerechnet</th></tr><tr><td>1 m³</td><td>1 000 dm³ = 1 000 l</td></tr><tr><td>1 dm³</td><td>1 000 cm³ = 1 l</td></tr><tr><td>1 cm³</td><td>1 000 mm³ = 1 ml</td></tr><tr><td>1 l</td><td>1 000 ml</td></tr></table>' +
      '<p class="note">Die Umrechnungszahl ist <b>1 000</b>, weil ein Würfel mit 10-facher Kantenlänge in drei Richtungen 10-mal größer ist: 10 · 10 · 10 = 1 000.</p>' +
      '<h3>4. Umkehraufgaben</h3><p>Kennst du V und G, dann gilt h = V : G. Kennst du V und h, dann gilt G = V : h. Achte darauf, vorher alle Einheiten passend umzurechnen.</p>',
    entdecken: {
      html: '<p>Wähle eine Grundfläche. Verändere ihre Größe und die Körperhöhe. Jede Schicht ist 1 cm dick.</p><div class="ctl"><label>Grundfläche <select id="e_b"><option value="rect">Rechteck</option><option value="right">Dreieck</option><option value="trap">Trapez</option></select></label></div>' +
        '<div class="ctl"><label>Größe k = <b id="v_k"></b> <input type="range" id="r_k" min="0.5" max="2.5" step="0.5" value="1"></label><label>Körperhöhe h = <b id="v_h"></b> <input type="range" id="r_h" min="1" max="12" step="1" value="4"></label></div>' +
        '<div id="e_g"></div><div id="e_t"></div><p class="note">Was passiert mit dem Volumen, wenn du h verdoppelst? Und wenn du die Größe k verdoppelst?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var t = root.querySelector('#e_b').value, k = +root.querySelector('#r_k').value, h = +root.querySelector('#r_h').value;
          var b = t === 'rect' ? base('rect', 4 * k, 2 * k) : t === 'trap' ? base('trap', k, 2 * k) : base('right', k);
          root.querySelector('#v_k').textContent = f(k); root.querySelector('#v_h').textContent = h + ' cm';
          var G = r3(b.G);
          root.querySelector('#e_g').innerHTML = prismSvg(b.P, h, { front: '#f6d9a8', hl: h + ' Schichten', segs: layers(b.P, h, h), label: 'Prisma aus Schichten', maxH: 260 });
          root.querySelector('#e_t').innerHTML = '<p class="big-math">G = ' + f(G) + ' cm²</p><p>Eine Schicht: ' + f(G) + ' cm² · 1 cm = ' + f(G) + ' cm³. Es sind ' + h + ' Schichten.</p><p class="big-math">V = G · h = ' + f(G) + ' · ' + h + ' = ' + f(r3(G * h)) + ' cm³ = ' + f(r3(G * h / 1000)) + ' l</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Richtig erkannt: Das Volumen ist immer Grundfläche mal Anzahl der Schichten, also V = G · h. Doppelte Höhe bedeutet doppeltes Volumen.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_b').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Das Freibad füllen', q: 'Das Becken aus dem Einstieg: 25 m lang, 10 m breit, 1 m bis 2 m tief. Wie viele Liter Wasser passen hinein?' + prismSvg([[0, 4], [25, 0], [25, 8], [0, 8]], 10, { labels: [{ i: 2, t: '25 m', side: 1, at: 0.3 }, { i: 3, t: '1 m' }, { i: 1, t: '2 m' }], hl: '10 m', maxH: 220 }) + '<p class="note">Skizze nicht maßstabsgetreu: Die Tiefe ist viermal überhöht gezeichnet.</p>',
      steps: ['Grundfläche erkennen: Die Seitenansicht ist ein Trapez mit den parallelen Seiten 1 m und 2 m. Sein Abstand ist die Länge 25 m.', 'G = (1 m + 2 m) : 2 · 25 m = 37,5 m².', 'Körperhöhe ist die Breite 10 m: V = 37,5 m² · 10 m = 375 m³.', 'Umrechnen: 1 m³ = 1 000 l, also 375 m³ = 375 000 l.', 'Antwort: Es passen 375 000 Liter hinein. Kontrolle: Mit 1,5 m mittlerer Tiefe ist 25 · 10 · 1,5 = 375. Passt.'] },
    tasks: { gen: gen, plan: { G: ['quader:1', 'dreieck:1', 'einheiten:1', 'umkehr:1'], S: ['quader:1', 'dreieck:2', 'trapez:2', 'einheiten:2', 'pool:2'], E: ['dreieck:2', 'trapez:2', 'zusammen:3', 'umkehr:2', 'graben:2', 'dachboden:3'] },
      extra: 'fuellhoehe', test: ['quader:1', 'dreieck:2', 'zusammen:2', 'einheiten:2', 'umkehr:2', 'pool:2'] },
    lerncheck: ['Ich kann erklären, warum für Prismen V = G · h gilt.', 'Ich berechne das Volumen von Prismen mit verschiedenen Grundflächen.', 'Ich rechne Volumeneinheiten und Liter sicher um.', 'Ich löse Sachaufgaben und Umkehraufgaben zum Volumen.']
  };
})();
