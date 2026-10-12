/* Modul 024 · Zusammengesetzte Figuren */
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
  function perim(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += Math.hypot(a[0] - b[0], a[1] - b[1]); } return s; }
  function u(x, e) { return f(x) + ' ' + (e || 'cm'); }
  function numIn(ans, label, unit, tol) { return { kind: 'num', answer: r3(ans), label: label, unit: unit, tol: tol }; }
  function areaCheck(P, A, minus) { return function () { var x = gauss(P) - (minus ? gauss(minus) : 0); return Math.abs(x - A) < 1e-6 || 'Koordinaten ergeben ' + x + ' statt ' + A; }; }
  function mir(P, W, on) { return on ? P.map(function (p) { return [W - p[0], p[1]]; }) : P; }
  /* L-Form: W breit, H hoch, oben an einer Ecke fehlt ein Rechteck w2 · h2 */
  function lshape(W, H, w2, h2, mirror) {
    var P = [[0, 0], [W, 0], [W, H - h2], [W - w2, H - h2], [W - w2, H], [0, H]];
    return mir(P, W, mirror);
  }
  function lsegs(P, e, show) {
    /* Kanten: 0 unten W, 1 rechts unten H−h2, 2 Stufe w2, 3 Stufe h2, 4 oben W−w2, 5 links H */
    var L = [0, 1, 2, 3, 4, 5].map(function (i) { var a = P[i], b = P[(i + 1) % 6]; return { a: a, b: b, len: Math.hypot(a[0] - b[0], a[1] - b[1]) }; });
    return show.map(function (i) { return { a: L[i].a, b: L[i].b, t: u(r3(L[i].len), e), line: false }; });
  }
  function lparams(lvl) {
    var W, H, w2, h2, k = lvl >= 3 ? 0.5 : 1;
    W = M.rnd(7, 13) ; H = M.rnd(5, 10); w2 = M.rnd(2, W - 3); h2 = M.rnd(2, H - 2);
    if (lvl >= 3) { W = W + 0.5; w2 = w2 + 0.5; }
    return { W: W, H: H, w2: w2, h2: h2, t: r3(W - w2), r: H - h2, mir: Math.random() < 0.5, k: k };
  }

  var gen = {
    lform: function (lvl) {
      var p = lparams(lvl), e = lvl >= 3 ? 'm' : 'cm', P = lshape(p.W, p.H, p.w2, p.h2, p.mir), A = r3(p.W * p.H - p.w2 * p.h2);
      var svg = fig({ polys: [{ P: P }], segs: lsegs(P, e, [0, 1, 4, 5]), label: 'L-förmige Figur mit Maßen' });
      var sol = fig({ polys: [{ P: P }, { P: mir([[0, p.r], [p.t, p.r], [p.t, p.H], [0, p.H]], p.W, p.mir), fill: '#f6d9a8', stroke: '#d97706', w: 2 }], segs: lsegs(P, e, [0, 1, 4, 5]), label: 'Zerlegung in zwei Rechtecke' });
      return { skill: 'Fläche einer L-Form', q: 'Berechne den Flächeninhalt der Figur. Alle Ecken sind rechte Winkel.' + svg, inputs: [numIn(A, 'A =', e + '²')],
        hints: ['Zerlege die Figur mit einer Linie in zwei Rechtecke. Oder ergänze sie zu einem großen Rechteck und ziehe das fehlende Stück ab.', 'Fehlende Längen: Die Stufe ist ' + f(p.W) + ' − ' + f(p.t) + ' = ' + f(p.w2) + ' ' + e + ' breit und ' + f(p.H) + ' − ' + f(p.r) + ' = ' + f(p.h2) + ' ' + e + ' hoch.', 'Unteres Rechteck: ' + f(p.W) + ' · ' + f(p.r) + ' = ' + f(r3(p.W * p.r)) + '. Oberes Rechteck: ' + f(p.t) + ' · ' + f(p.h2) + ' = ' + f(r3(p.t * p.h2)) + '. Addiere.'],
        solution: 'Zerlegen: A = ' + f(p.W) + ' ' + e + ' · ' + f(p.r) + ' ' + e + ' + ' + f(p.t) + ' ' + e + ' · ' + f(p.h2) + ' ' + e + ' = ' + f(r3(p.W * p.r)) + ' ' + e + '² + ' + f(r3(p.t * p.h2)) + ' ' + e + '² = ' + f(A) + ' ' + e + '².<br>Oder Ergänzen: ' + f(p.W) + ' · ' + f(p.H) + ' − ' + f(p.w2) + ' · ' + f(p.h2) + ' = ' + f(r3(p.W * p.H)) + ' − ' + f(r3(p.w2 * p.h2)) + ' = ' + f(A) + ' ' + e + '².' + sol,
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - p.W * p.H) < 1e-6) return 'Das ist das ganze Rechteck ' + f(p.W) + ' · ' + f(p.H) + '. An einer Ecke fehlt aber ein Stück. Ziehe es ab.'; if (Math.abs(x - (p.W * p.r + p.t * p.H)) < 1e-6) return 'Deine beiden Rechtecke überlappen sich. Zerlege so, dass jedes Stück nur einmal gezählt wird.'; if (Math.abs(x - 2 * (p.W + p.H)) < 1e-6) return 'Das ist der Umfang. Gesucht ist der Flächeninhalt.'; return null; },
        verify: areaCheck(P, A) };
    },
    umfang: function (lvl) {
      var e = 'cm', P, U, segs, hint2, sol, wrong;
      if (lvl >= 3) {
        var W = M.rnd(9, 14), H = M.rnd(5, 9), l = M.rnd(2, 4), r = M.rnd(2, 4), d = M.rnd(2, H - 2);
        P = [[0, 0], [W, 0], [W, H], [W - r, H], [W - r, H - d], [l, H - d], [l, H], [0, H]]; U = 2 * (W + H) + 2 * d;
        segs = [{ a: P[0], b: P[1], t: u(W), line: false }, { a: P[7], b: P[0], t: u(H), line: false }, { a: P[2], b: P[3], t: u(r), line: false }, { a: P[6], b: P[7], t: u(l), line: false }, { a: P[5], b: P[6], t: u(d), line: false }];
        hint2 = 'Die Lücke oben ist ' + W + ' − ' + l + ' − ' + r + ' = ' + (W - l - r) + ' cm breit. Beide Seiten der Lücke sind ' + d + ' cm lang. Die rechte Außenseite ist ' + H + ' cm lang.';
        sol = 'U = ' + W + ' + ' + H + ' + ' + r + ' + ' + d + ' + ' + (W - l - r) + ' + ' + d + ' + ' + l + ' + ' + H + ' = ' + U + ' cm. Kurz: 2 · ' + W + ' + 2 · ' + H + ' + 2 · ' + d + ' = ' + U + ' cm.';
        wrong = [2 * (W + H), W + H + r + l + d];
      } else {
        var p = lparams(1); P = lshape(p.W, p.H, p.w2, p.h2, p.mir); U = 2 * (p.W + p.H); segs = lsegs(P, e, [0, 1, 4, 5]);
        hint2 = 'Die beiden Seiten an der Stufe sind ' + p.W + ' − ' + p.t + ' = ' + p.w2 + ' cm und ' + p.H + ' − ' + p.r + ' = ' + p.h2 + ' cm lang.';
        sol = 'U = ' + p.W + ' + ' + p.r + ' + ' + p.w2 + ' + ' + p.h2 + ' + ' + p.t + ' + ' + p.H + ' = ' + U + ' cm. Trick: Die Stufen ergeben zusammen genauso viel wie beim Rechteck ' + p.W + ' cm · ' + p.H + ' cm, also 2 · ' + p.W + ' + 2 · ' + p.H + ' = ' + U + ' cm.';
        wrong = [p.W + p.H + p.t + p.r, p.W * p.H - p.w2 * p.h2];
      }
      return { skill: 'Umfang zusammengesetzter Figuren', q: 'Berechne den Umfang der Figur. Alle Ecken sind rechte Winkel.' + fig({ polys: [{ P: P }], segs: segs, label: 'Figur mit rechten Winkeln' }), inputs: [numIn(U, 'U =', 'cm')],
        hints: ['Der Umfang ist die Summe <b>aller</b> Seitenlängen. Zähle zuerst, wie viele Seiten die Figur hat: ' + P.length + '.', hint2, 'Addiere alle ' + P.length + ' Seiten.'],
        solution: sol,
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - wrong[0]) < 1e-6 && lvl >= 3) return 'Die Lücke oben hat zwei zusätzliche senkrechte Seiten. Sie gehören auch zum Umfang.'; if (Math.abs(x - wrong[lvl >= 3 ? 1 : 0]) < 1e-6) return 'Du hast nur die beschrifteten Seiten addiert. Es fehlen noch Seiten, deren Länge du erst berechnen musst.'; if (lvl < 3 && Math.abs(x - wrong[1]) < 1e-6) return 'Das ist der Flächeninhalt. Gesucht ist der Umfang.'; return null; },
        verify: function () { var x = perim(P); return Math.abs(x - U) < 1e-6 || 'Umfang aus Koordinaten ' + x; } };
    },
    haus: function (lvl) {
      var b = M.pick([6, 7, 8, 9, 10]), h1 = M.pick([2.5, 3, 3.5, 4]), hg = M.pick([2, 2.5, 3, 3.5]), win = lvl >= 3;
      var P = [[0, 0], [b, 0], [b, h1], [b / 2, h1 + hg], [0, h1]], Ar = r3(b * h1), At = r3(b * hg / 2), A = r3(Ar + At);
      var ww = M.pick([1.2, 1.5, 2]), wh = M.pick([1, 1.2]), Wn = [[1, 1], [1 + ww, 1], [1 + ww, 1 + wh], [1, 1 + wh]], Aw = r3(ww * wh), Af = r3(A - Aw);
      var polys = [{ P: P }]; if (win) polys.push({ P: Wn, fill: '#ffffff', w: 2 });
      var segs = [{ a: P[0], b: P[1], t: u(b, 'm'), line: false, side: 1 }, { a: P[1], b: P[2], t: u(h1, 'm'), line: false, side: 1 }, { a: [0, h1], b: [b, h1], dash: true, w: 1.3 }, { a: P[3], b: [b / 2, h1], t: u(hg, 'm'), dash: true, side: 1, at: 0.45 }];
      if (win) segs.push({ a: Wn[3], b: Wn[2], t: u(ww, 'm'), line: false, side: -1 }, { a: Wn[0], b: Wn[3], t: u(wh, 'm'), line: false, side: -1 });
      var svg = fig({ polys: polys, segs: segs, rights: [[[b / 2, h1], P[3], P[2]]], label: 'Giebelwand eines Hauses' });
      return { skill: 'Hausgiebel', q: 'Die Giebelwand eines Hauses besteht aus einem Rechteck und einem gleichschenkligen Dreieck darüber.' + (win ? ' Sie soll gestrichen werden, das Fenster aber nicht. Wie viel m² müssen gestrichen werden?' : ' Wie groß ist die Wandfläche?') + svg, inputs: [numIn(win ? Af : A, win ? 'zu streichen' : 'A =', 'm²')],
        hints: ['Zerlege die Wand in das Rechteck unten und das Dreieck oben.', 'Rechteck: ' + f(b) + ' m · ' + f(h1) + ' m = ' + f(Ar) + ' m². Dreieck: ' + f(b) + ' m · ' + f(hg) + ' m : 2 = ' + f(At) + ' m².', win ? 'Wand gesamt: ' + f(A) + ' m². Ziehe das Fenster ab: ' + f(ww) + ' m · ' + f(wh) + ' m = ' + f(Aw) + ' m².' : 'Addiere beide Teile.'],
        solution: 'Rechteck: ' + f(b) + ' m · ' + f(h1) + ' m = ' + f(Ar) + ' m². Dreieck: ' + f(b) + ' m · ' + f(hg) + ' m : 2 = ' + f(At) + ' m². Zusammen: ' + f(A) + ' m².' + (win ? ' Fenster: ' + f(ww) + ' m · ' + f(wh) + ' m = ' + f(Aw) + ' m². Zu streichen: ' + f(A) + ' m² − ' + f(Aw) + ' m² = ' + f(Af) + ' m².' : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; var base = win ? -Aw : 0; if (Math.abs(x - (Ar + b * hg + base)) < 1e-6) return 'Beim Dreieck musst du durch 2 teilen: g · h : 2.'; if (Math.abs(x - (b * (h1 + hg) + base)) < 1e-6) return 'Das ist ein Rechteck mit der ganzen Haushöhe. Oben ist die Wand aber spitz. Rechne Rechteck und Dreieck einzeln.'; if (win && Math.abs(x - A) < 1e-6) return 'Fast. Das Fenster wird nicht gestrichen. Ziehe es noch ab.'; return null; },
        verify: areaCheck(P, win ? Af : A, win ? Wn : null) };
    },
    grund: function (lvl) {
      var a = M.rnd(15, 30), b = a + M.pick([-1, 1]) * M.rnd(4, 9), H = M.rnd(20, 36), h1 = M.rnd(8, H - 8);
      var P = [[0, 0], [a, 0], [a, h1], [b, H], [0, H]], R = a * h1, T = r3((a + b) / 2 * (H - h1)), A = r3(R + T);
      var svg = fig({ polys: [{ P: P }], segs: [{ a: P[0], b: P[1], t: u(a, 'm'), line: false }, { a: P[1], b: P[2], t: u(h1, 'm'), line: false }, { a: P[3], b: P[4], t: u(b, 'm'), line: false }, { a: P[4], b: P[0], t: u(H, 'm'), line: false }], label: 'Grundstück' });
      var sv2 = fig({ polys: [{ P: P }, { P: [[0, h1], [a, h1], [b, H], [0, H]], fill: '#f6d9a8', stroke: '#d97706', w: 2 }], segs: [{ a: [0, h1], b: [0, H], t: f(H - h1) + ' m', line: false, side: -1 }], label: 'Zerlegung des Grundstücks' });
      return { skill: 'Grundstück zerlegen', q: 'Ein Grundstück hat die abgebildete Form. Die Ecken unten und links oben sind rechte Winkel. Berechne den Flächeninhalt.' + svg, inputs: [numIn(A, 'A =', 'm²')],
        hints: ['Ziehe eine waagerechte Linie in Höhe von ' + h1 + ' m. Unten entsteht ein Rechteck, oben ein Trapez.', 'Rechteck: ' + a + ' m · ' + h1 + ' m = ' + R + ' m². Das Trapez hat die parallelen Seiten ' + a + ' m und ' + b + ' m und die Höhe ' + H + ' − ' + h1 + ' = ' + (H - h1) + ' m.', 'Trapez: (' + a + ' + ' + b + ') : 2 · ' + (H - h1) + ' = ' + f(T) + ' m². Addiere.'],
        solution: 'Rechteck: ' + a + ' m · ' + h1 + ' m = ' + R + ' m². Trapez: (' + a + ' m + ' + b + ' m) : 2 · ' + (H - h1) + ' m = ' + f(T) + ' m². Zusammen: ' + f(A) + ' m².' + sv2,
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - a * H) < 1e-6 || Math.abs(x - b * H) < 1e-6) return 'Das Grundstück ist kein Rechteck. Die rechte obere Seite ist schräg. Zerlege in Rechteck und Trapez.'; if (Math.abs(x - (R + (a + b) * (H - h1))) < 1e-6) return 'Beim Trapez musst du den Mittelwert (a + c) : 2 nehmen.'; return null; },
        verify: areaCheck(P, A) };
    },
    ergaenzen: function (lvl) {
      var W = M.rnd(8, 14), H = M.rnd(6, 10), P, A, segs, cut, txt;
      if (lvl >= 3) {
        var k = M.rnd(1, Math.min(3, Math.floor(H / 2) - 1));
        P = [[k, 0], [W - k, 0], [W, k], [W, H - k], [W - k, H], [k, H], [0, H - k], [0, k]]; A = W * H - 2 * k * k; cut = 4 * k * k / 2;
        segs = [{ a: [0, H], b: [W, H], t: u(W), line: false, side: -1, at: 0.5 }, { a: [0, 0], b: [0, H], t: u(H), line: false, side: -1 }, { a: [W - k, 0], b: [W, 0], t: u(k), line: false, side: 1 }, { a: [W, 0], b: [W, k], t: u(k), line: false, side: 1 }];
        txt = 'An allen vier Ecken ist ein gleichschenklig-rechtwinkliges Dreieck mit den Schenkeln ' + k + ' cm abgeschnitten.';
      } else {
        var p = M.rnd(2, Math.floor(W / 2) - 1), q = M.rnd(1, H - 3), two = lvl >= 2;
        P = two ? [[0, 0], [W, 0], [W, H - q], [W - p, H], [p, H], [0, H - q]] : [[0, 0], [W, 0], [W, H - q], [W - p, H], [0, H]];
        cut = (two ? 2 : 1) * p * q / 2; A = W * H - cut;
        segs = [{ a: [0, 0], b: [W, 0], t: u(W), line: false, side: 1 }, { a: [0, 0], b: [0, H], t: u(H), line: false, side: -1 }, { a: [W - p, H], b: [W, H], t: u(p), line: false, side: -1 }, { a: [W, H - q], b: [W, H], t: u(q), line: false, side: 1 }];
        txt = (two ? 'An den beiden oberen Ecken ist je ein rechtwinkliges Dreieck' : 'An der oberen rechten Ecke ist ein rechtwinkliges Dreieck') + ' abgeschnitten (gestrichelt).';
      }
      var svg = fig({ polys: [{ P: [[0, 0], [W, 0], [W, H], [0, H]], fill: '#ffffff', stroke: '#b9b2cc', dash: true, w: 1.5 }, { P: P }], segs: segs, label: 'Rechteck mit abgeschnittenen Ecken' });
      return { skill: 'Ergänzen zum Rechteck', q: 'Aus einer rechteckigen Holzplatte wurde dieses Werkstück gesägt. ' + txt + ' Berechne den Flächeninhalt des Werkstücks.' + svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Ergänze zum ganzen Rechteck: ' + W + ' cm · ' + H + ' cm = ' + W * H + ' cm².', 'Die abgeschnittenen Ecken sind rechtwinklige Dreiecke. Ein Dreieck hat ' + (lvl >= 3 ? k + ' · ' + k : p + ' · ' + q) + ' : 2 = ' + f(lvl >= 3 ? k * k / 2 : p * q / 2) + ' cm².', 'Ziehe alle abgeschnittenen Dreiecke (zusammen ' + f(cut) + ' cm²) vom Rechteck ab.'],
        solution: 'A = ' + W + ' cm · ' + H + ' cm − ' + f(cut) + ' cm² = ' + W * H + ' cm² − ' + f(cut) + ' cm² = ' + f(A) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (W * H - 2 * cut)) < 1e-6) return 'Ein rechtwinkliges Dreieck ist halb so groß wie das Rechteck aus seinen Schenkeln. Teile durch 2.'; if (Math.abs(x - W * H) < 1e-6) return 'Das ist die ganze Platte. Die abgeschnittenen Ecken musst du noch abziehen.'; return null; },
        verify: areaCheck(P, A) };
    },
    zerlegung: function () {
      var p, ok, o;
      do { p = lparams(1); } while (p.W === 2 * p.t);
      var P = lshape(p.W, p.H, p.w2, p.h2, p.mir);
      function ex(s) { return 'A = ' + s + ' (cm²)'; }
      var cands = [[ex(p.W + ' · ' + p.r + ' + ' + p.t + ' · ' + p.h2), p.W * p.r + p.t * p.h2], [ex(p.W + ' · ' + p.H), p.W * p.H], [ex(p.W + ' · ' + p.r + ' + ' + p.t + ' · ' + p.H), p.W * p.r + p.t * p.H], [ex(p.W + ' · ' + p.H + ' − ' + p.t + ' · ' + p.h2), p.W * p.H - p.t * p.h2]];
      ok = cands[0][0]; o = M.shuffle(cands.map(function (c) { return c[0]; }));
      return { skill: 'Zerlegung erkennen', level: 1, q: 'Welche Rechnung ergibt den Flächeninhalt der Figur? Alle Ecken sind rechte Winkel.' + fig({ polys: [{ P: P }], segs: lsegs(P, 'cm', [0, 1, 4, 5]), label: 'L-Form' }), inputs: [{ kind: 'mc', label: 'Richtige Rechnung', options: o, answer: o.indexOf(ok) }],
        hints: ['Zerlege die Figur in ein unteres und ein oberes Rechteck.', 'Das untere Rechteck ist ' + p.W + ' cm breit und ' + p.r + ' cm hoch.', 'Das obere Rechteck ist ' + p.t + ' cm breit und ' + p.H + ' − ' + p.r + ' = ' + p.h2 + ' cm hoch.'],
        solution: 'Richtig ist ' + ok + ' = ' + (p.W * p.r + p.t * p.h2) + ' cm². Unten liegt ein Rechteck ' + p.W + ' cm · ' + p.r + ' cm, darüber eins mit ' + p.t + ' cm · ' + p.h2 + ' cm.',
        verify: function () { var x = gauss(P); if (Math.abs(x - cands[0][1]) > 1e-6) return 'falsch'; for (var i = 1; i < 4; i++) if (Math.abs(cands[i][1] - x) < 1e-6) return 'Ablenker gleichwertig'; return true; } };
    },
    fliesen: function (lvl) {
      var W = M.rnd(8, 14) / 2, H = M.rnd(7, 12) / 2, w2 = M.rnd(3, Math.floor(W * 2) - 4) / 2, h2 = M.rnd(2, Math.floor(H * 2) - 3) / 2, pk = M.pick([1.5, 2, 2.5]);
      var P = lshape(W, H, w2, h2, Math.random() < 0.5), A = r3(W * H - w2 * h2), n = Math.ceil(A / pk - 1e-9);
      if (Math.abs(A / pk - Math.round(A / pk)) < 1e-9) return gen.fliesen(lvl);
      var svg = fig({ polys: [{ P: P }], segs: lsegs(P, 'm', [0, 1, 4, 5]), label: 'Grundriss eines L-förmigen Raums' });
      return { skill: 'Sachaufgabe Fliesen', q: 'Der Boden eines Raums soll gefliest werden. Ein Paket Fliesen reicht für ' + f(pk) + ' m². Es werden nur ganze Pakete verkauft.<br>a) Wie groß ist die Bodenfläche?<br>b) Wie viele Pakete müssen gekauft werden?' + svg,
        inputs: [numIn(A, 'a) Fläche', 'm²'), { kind: 'num', answer: n, label: 'b) Pakete' }],
        hints: ['Zerlege den Grundriss in zwei Rechtecke oder ergänze zu einem großen Rechteck.', 'Großes Rechteck: ' + f(W) + ' m · ' + f(H) + ' m = ' + f(r3(W * H)) + ' m². Die fehlende Ecke ist ' + f(w2) + ' m · ' + f(h2) + ' m = ' + f(r3(w2 * h2)) + ' m² groß.', 'Teile die Fläche durch ' + f(pk) + ' m² und runde auf, denn ein angebrochenes Paket muss man ganz kaufen.'],
        solution: 'a) A = ' + f(W) + ' m · ' + f(H) + ' m − ' + f(w2) + ' m · ' + f(h2) + ' m = ' + f(r3(W * H)) + ' m² − ' + f(r3(w2 * h2)) + ' m² = ' + f(A) + ' m². b) ' + f(A) + ' : ' + f(pk) + ' ≈ ' + f(Math.round(A / pk * 100) / 100) + '. Aufgerundet: ' + n + ' Pakete.',
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && y === n - 1) return 'Mit ' + (n - 1) + ' Paketen reicht es nicht ganz. Du musst <b>auf</b>runden.'; var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - W * H) < 1e-6) return 'Die fehlende Ecke gehört nicht zum Raum. Ziehe sie ab.'; return null; },
        verify: areaCheck(P, A) };
    },
    rasen: function (lvl) {
      var W = M.rnd(12, 20), H = M.rnd(8, 14), t1 = M.rnd(3, 6), t2 = M.rnd(2, 4), p = M.rnd(3, 6), q = M.rnd(2, 4), g = M.pick([20, 25, 30]);
      if (p * q % 2) p++;
      var P = [[t1, 0], [W, 0], [W, H - q], [W - p, H], [0, H], [0, t2], [t1, t2]], A = W * H - t1 * t2 - p * q / 2;
      var svg = fig({ polys: [{ P: [[0, 0], [W, 0], [W, H], [0, H]], fill: '#ffffff', stroke: '#3d2a73', w: 2 }, { P: P, fill: '#dcefd9', stroke: '#3d2a73', w: 2 }, { P: [[0, 0], [t1, 0], [t1, t2], [0, t2]], fill: '#e5e1ee', w: 1.5 }, { P: [[W - p, H], [W, H], [W, H - q]], fill: '#f6d9a8', w: 1.5 }],
        segs: [{ a: [0, 0], b: [W, 0], t: u(W, 'm'), line: false, side: 1, at: 0.6 }, { a: [0, 0], b: [0, H], t: u(H, 'm'), line: false, side: -1, at: 0.6 }, { a: [0, t2], b: [t1, t2], t: u(t1, 'm'), line: false, side: -1 }, { a: [t1, 0], b: [t1, t2], t: u(t2, 'm'), line: false, side: 1 }, { a: [W - p, H], b: [W, H], t: u(p, 'm'), line: false, side: -1 }, { a: [W, H - q], b: [W, H], t: u(q, 'm'), line: false, side: 1 }],
        texts: [{ p: [W / 2, H / 2], t: 'Rasen', col: '#2f6b2a' }, { p: [t1 / 2, t2 / 2], t: 'Terrasse', size: 10 }], label: 'Garten mit Terrasse und Beet' });
      return { skill: 'Sachaufgabe Rasen', q: 'Ein rechteckiger Garten soll neu eingesät werden. Die Terrasse (grau) und das dreieckige Beet (orange) bekommen keinen Rasen. Für 1 m² braucht man ' + g + ' g Rasensamen.<br>a) Wie groß ist die Rasenfläche?<br>b) Wie viel Gramm Samen braucht man?' + svg,
        inputs: [numIn(A, 'a) Rasenfläche', 'm²'), { kind: 'num', answer: A * g, label: 'b) Samen', unit: 'g' }],
        hints: ['Rechne zuerst den ganzen Garten: ' + W + ' m · ' + H + ' m = ' + W * H + ' m².', 'Terrasse: ' + t1 + ' m · ' + t2 + ' m = ' + t1 * t2 + ' m². Beet (Dreieck): ' + p + ' m · ' + q + ' m : 2 = ' + p * q / 2 + ' m².', 'Rasen = Garten − Terrasse − Beet. Samen: Rasenfläche · ' + g + ' g.'],
        solution: 'a) A = ' + W * H + ' m² − ' + t1 * t2 + ' m² − ' + p * q / 2 + ' m² = ' + A + ' m². b) ' + A + ' · ' + g + ' g = ' + f(A * g) + ' g (das sind ' + f(A * g / 1000) + ' kg).',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (W * H - t1 * t2 - p * q)) < 1e-6) return 'Das Beet ist ein Dreieck. Teile ' + p + ' · ' + q + ' durch 2.'; if (Math.abs(x - W * H) < 1e-6) return 'Terrasse und Beet bekommen keinen Rasen. Ziehe sie ab.'; return null; },
        verify: areaCheck(P, A) };
    },
    gitter: function () {
      var W = M.rnd(5, 8), H = M.rnd(4, 7), a1 = M.rnd(1, W - 1), b1 = M.rnd(1, H - 1), a2 = M.rnd(1, W - 1), b2 = M.rnd(1, H - 1);
      var P = [[a1, 0], [W, b1], [a2, H], [0, b2]], t = [a1 * b2, (W - a1) * b1, (W - a2) * (H - b1), a2 * (H - b2)].map(function (x) { return x / 2; });
      var A = W * H - t[0] - t[1] - t[2] - t[3];
      var svg = fig({ grid: true, box: [-0.5, W + 0.5, -0.5, H + 0.5], polys: [{ P: P }], label: 'Viereck im Kästchengitter', maxH: 220, W: 300 });
      var sol = fig({ grid: true, box: [-0.5, W + 0.5, -0.5, H + 0.5], polys: [{ P: [[0, 0], [W, 0], [W, H], [0, H]], fill: '#f6d9a8', stroke: '#d97706', w: 1.5, dash: true }, { P: P }], label: 'Ergänzung zum Rechteck', maxH: 220, W: 300 });
      return { skill: 'Fläche im Gitter durch Ergänzen', level: 3, q: 'Ein Kästchen ist 1 cm lang und 1 cm breit. Bestimme den Flächeninhalt des Vierecks <b>genau</b>. Tipp: Kästchen zählen reicht hier nicht, denn viele Kästchen sind nur teilweise bedeckt.' + svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Zeichne ein Rechteck um das Viereck, dessen Seiten durch die Ecken gehen. Es ist ' + W + ' cm · ' + H + ' cm = ' + W * H + ' cm² groß.', 'Zwischen Viereck und Rechteck liegen vier rechtwinklige Dreiecke. Berechne jedes mit Kathete · Kathete : 2.', 'Die Dreiecke haben ' + t.map(function (x) { return f(x); }).join(' cm², ') + ' cm². Ziehe sie vom Rechteck ab.'],
        solution: 'A = ' + W * H + ' cm² − ' + t.map(function (x) { return f(x); }).join(' cm² − ') + ' cm² = ' + f(A) + ' cm².' + sol,
        verify: areaCheck(P, A) };
    }
  };

  var EX_L = fig({ polys: [{ P: [[0, 0], [8, 0], [8, 3], [5, 3], [5, 6], [0, 6]] }, { P: [[0, 3], [5, 3], [5, 6], [0, 6]], fill: '#f6d9a8', stroke: '#d97706', w: 2 }], segs: [{ a: [0, 0], b: [8, 0], t: '8 m', line: false }, { a: [8, 0], b: [8, 3], t: '3 m', line: false }, { a: [5, 6], b: [0, 6], t: '5 m', line: false }, { a: [0, 6], b: [0, 0], t: '6 m', line: false }], texts: [{ p: [4, 1.5], t: '8 · 3 = 24' }, { p: [2.5, 4.5], t: '5 · 3 = 15', col: '#b45309' }], label: 'L-Form zerlegt', W: 300, maxH: 210 });
  var EX_E = fig({ polys: [{ P: [[0, 0], [8, 0], [8, 6], [0, 6]], fill: '#f6d9a8', stroke: '#d97706', w: 1.5, dash: true }, { P: [[0, 0], [8, 0], [8, 3], [5, 3], [5, 6], [0, 6]] }], segs: [{ a: [0, 0], b: [8, 0], t: '8 m', line: false, side: 1 }, { a: [0, 0], b: [0, 6], t: '6 m', line: false, side: -1 }], texts: [{ p: [6.5, 4.5], t: '3 · 3', col: '#b45309' }, { p: [2.8, 2], t: '8 · 6 − 9' }], label: 'L-Form ergänzt', W: 300, maxH: 210 });
  var PIECES = { 'senkrecht zerlegen': 0, 'waagerecht zerlegen': 1, 'ergänzen': 2 };

  return {
    id: '024', title: 'Zusammengesetzte Figuren', bereich: 'Größen und Messen', minutes: '45 bis 60',
    vorkenntnisse: 'Flächeninhalt und Umfang von Rechteck, Dreieck und Trapez',
    lead: 'Wie groß ist ein Raum, der nicht rechteckig ist? Du zerlegst und ergänzt Figuren geschickt und berechnest so Flächen und Umfänge im Alltag.',
    einstieg: { html: '<p>Lukas zieht um. Sein neues Zimmer ist <b>L-förmig</b>, weil in einer Ecke ein Schrank eingebaut ist. Er möchte einen neuen Boden verlegen und eine Fußleiste rundherum anbringen.</p><p class="note">Wie viel Boden braucht Lukas? Und wie lang muss die Fußleiste sein? Mit einer einzigen Formel kommst du hier nicht weiter.</p><p>Der Trick: Du <b>zerlegst</b> die Figur in Teile, die du schon kennst, oder du <b>ergänzt</b> sie zu einer bekannten Figur und ziehst das Zuviel wieder ab.</p>' },
    ziele: ['Ich zerlege zusammengesetzte Figuren in Rechtecke, Dreiecke und Trapeze.', 'Ich ergänze Figuren zu einem Rechteck und ziehe überflüssige Teile ab.', 'Ich berechne fehlende Seitenlängen aus gegebenen Maßen.', 'Ich berechne den Umfang zusammengesetzter Figuren.', 'Ich löse Sachaufgaben, zum Beispiel zu Fliesen, Rasen und Hauswänden.'],
    fachwoerter: [['Zerlegen', 'Eine Figur in mehrere bekannte Teilfiguren aufteilen und deren Flächen addieren.'], ['Ergänzen', 'Eine Figur zu einer größeren bekannten Figur erweitern und das hinzugefügte Stück wieder abziehen.'], ['Umfang', 'Die Länge des ganzen Randes einer Figur, also die Summe aller Seitenlängen.'], ['Teilfläche', 'Ein Stück einer zusammengesetzten Figur, zum Beispiel ein Rechteck oder Dreieck.']],
    diagnose: [
      { q: 'Wie groß ist ein Rechteck mit 9 cm Länge und 5 cm Breite?', options: ['28 cm²', '45 cm²', '14 cm²', 'Weiß ich noch nicht'], answer: 1, why: 'A = 9 cm · 5 cm = 45 cm².', review: 'Flächeninhalt des Rechtecks' },
      { q: 'Wie groß ist der Umfang dieses Rechtecks (9 cm lang, 5 cm breit)?', options: ['28 cm', '45 cm', '14 cm', 'Weiß ich noch nicht'], answer: 0, why: 'U = 2 · 9 cm + 2 · 5 cm = 28 cm.', review: 'Umfang des Rechtecks' },
      { q: 'Ein Dreieck hat die Grundseite 6 cm und die Höhe 4 cm. Wie groß ist es?', options: ['24 cm²', '10 cm²', '12 cm²', 'Weiß ich noch nicht'], answer: 2, why: 'A = 6 cm · 4 cm : 2 = 12 cm².', review: 'Flächeninhalt des Dreiecks (Modul 023)' },
      { q: 'Ein Paket reicht für 2 m². Wie viele Pakete brauchst du für 7 m², wenn es nur ganze Pakete gibt?', options: ['3', '3,5', '4', 'Weiß ich noch nicht'], answer: 2, why: '7 : 2 = 3,5. Mit 3 Paketen reicht es nicht, also 4 Pakete.', review: 'Sinnvoll runden bei Sachaufgaben' }],
    erklaerung:
      '<h3>1. Zerlegen</h3><p>Teile die Figur mit Hilfslinien in Rechtecke, Dreiecke oder Trapeze. Berechne jede Teilfläche und addiere.</p>' + EX_L + '<p class="big-math">A = 24 m² + 15 m² = 39 m²</p>' +
      '<h3>2. Ergänzen</h3><p>Ergänze die Figur zu einem großen Rechteck. Ziehe dann das Stück ab, das du ergänzt hast.</p>' + EX_E + '<p class="big-math">A = 8 m · 6 m − 3 m · 3 m = 48 m² − 9 m² = 39 m²</p>' +
      '<div class="merk"><b>Merke:</b> Zusammengesetzte Figuren berechnest du durch <b>Zerlegen</b> (Teilflächen addieren) oder <b>Ergänzen</b> (große Fläche minus ergänztes Stück). Beide Wege führen zum selben Ergebnis.</div>' +
      '<h3>3. Fehlende Längen</h3><p>Oft stehen nicht alle Maße in der Zeichnung. Im Beispiel ist die Stufe 8 m − 5 m = 3 m breit und 6 m − 3 m = 3 m hoch. Die waagerechten Strecken oben ergeben zusammen so viel wie die untere Strecke. Die senkrechten Strecken rechts ergeben zusammen so viel wie die linke.</p>' +
      '<h3>4. Umfang</h3><p>Für den Umfang addierst du <b>alle</b> Randstrecken. Hilfslinien im Inneren gehören nicht dazu. Bei einer L-Form ist der Umfang genauso groß wie beim umgebenden Rechteck: U = 8 m + 3 m + 3 m + 3 m + 5 m + 6 m = 28 m = 2 · 8 m + 2 · 6 m.</p>' +
      '<p class="note"><b>Achtung:</b> Beim Umfang darfst du nicht einfach das umgebende Rechteck nehmen, wenn die Figur eine Einbuchtung von innen hat. Dann kommen zusätzliche Seiten dazu.</p>',
    entdecken: {
      html: '<p>Verändere die L-Form und wähle einen Rechenweg. Vergleiche die Ergebnisse.</p><div class="ctl"><label>Rechenweg <select id="e_m"><option>senkrecht zerlegen</option><option>waagerecht zerlegen</option><option>ergänzen</option></select></label></div>' +
        '<div class="ctl"><label>Breite = <b id="v_W"></b> <input type="range" id="r_W" min="6" max="12" step="1" value="8"></label><label>Höhe = <b id="v_H"></b> <input type="range" id="r_H" min="5" max="10" step="1" value="6"></label><label>Ecke breit = <b id="v_w"></b> <input type="range" id="r_w" min="1" max="6" step="1" value="3"></label><label>Ecke hoch = <b id="v_h"></b> <input type="range" id="r_h" min="1" max="6" step="1" value="2"></label></div>' +
        '<div id="e_g"></div><p class="big-math" id="e_t"></p><p class="note">Gibt es einen Rechenweg, der immer am schnellsten ist? Welcher Weg passt, wenn eine große Ecke fehlt?</p>',
      init: function (root, done) {
        var n = 0;
        function v(k) { return +root.querySelector('#r_' + k).value; }
        function draw() {
          var W = v('W'), H = v('H'), w = Math.min(v('w'), W - 2), h = Math.min(v('h'), H - 2), m = PIECES[root.querySelector('#e_m').value];
          root.querySelector('#v_W').textContent = W + ' m'; root.querySelector('#v_H').textContent = H + ' m'; root.querySelector('#v_w').textContent = w + ' m'; root.querySelector('#v_h').textContent = h + ' m';
          var P = lshape(W, H, w, h, false), polys, txt, tx;
          if (m === 0) { polys = [{ P: [[0, 0], [W - w, 0], [W - w, H], [0, H]], fill: '#cfc2ee' }, { P: [[W - w, 0], [W, 0], [W, H - h], [W - w, H - h]], fill: '#f6d9a8' }]; txt = (W - w) + ' · ' + H + ' + ' + w + ' · ' + (H - h) + ' = ' + (W - w) * H + ' + ' + w * (H - h); tx = [{ p: [(W - w) / 2, H / 2], t: (W - w) * H + ' m²' }, { p: [W - w / 2, (H - h) / 2], t: w * (H - h) + ' m²', col: '#b45309', size: 11 }]; }
          else if (m === 1) { polys = [{ P: [[0, 0], [W, 0], [W, H - h], [0, H - h]], fill: '#cfc2ee' }, { P: [[0, H - h], [W - w, H - h], [W - w, H], [0, H]], fill: '#f6d9a8' }]; txt = W + ' · ' + (H - h) + ' + ' + (W - w) + ' · ' + h + ' = ' + W * (H - h) + ' + ' + (W - w) * h; tx = [{ p: [W / 2, (H - h) / 2], t: W * (H - h) + ' m²' }, { p: [(W - w) / 2, H - h / 2], t: (W - w) * h + ' m²', col: '#b45309', size: 11 }]; }
          else { polys = [{ P: [[0, 0], [W, 0], [W, H], [0, H]], fill: '#f6d9a8', stroke: '#d97706', dash: true, w: 1.5 }, { P: P, fill: '#cfc2ee' }]; txt = W + ' · ' + H + ' − ' + w + ' · ' + h + ' = ' + W * H + ' − ' + w * h; tx = [{ p: [W / 2, (H - h) / 2], t: W * H + ' m² − ' + w * h + ' m²' }]; }
          root.querySelector('#e_g').innerHTML = fig({ box: [-0.6, W + 0.6, -0.6, H + 0.6], polys: polys, texts: tx, segs: [{ a: [0, 0], b: [W, 0], t: W + ' m', line: false, side: 1 }, { a: [0, 0], b: [0, H], t: H + ' m', line: false, side: -1 }], label: 'L-Form mit Rechenweg', maxH: 260 });
          root.querySelector('#e_t').textContent = 'A = ' + txt + ' = ' + (W * H - w * h) + ' m²';
        }
        function hit() { draw(); n++; if (n >= 3) done('Genau: Ob du senkrecht zerlegst, waagerecht zerlegst oder ergänzt, der Flächeninhalt ist immer gleich. Wähle den Weg mit den wenigsten Rechenschritten.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_m').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Giebelwand streichen', q: 'Eine Giebelwand ist unten ein Rechteck (8 m breit, 3 m hoch) mit einem Dreieck darüber (Höhe 2,5 m). Eine Tür (1 m breit, 2 m hoch) wird nicht gestrichen. Wie viel m² müssen gestrichen werden?' +
      fig({ polys: [{ P: [[0, 0], [8, 0], [8, 3], [4, 5.5], [0, 3]] }, { P: [[3.5, 0], [4.5, 0], [4.5, 2], [3.5, 2]], fill: '#ffffff', w: 2 }], segs: [{ a: [0, 0], b: [8, 0], t: '8 m', line: false, side: 1, at: 0.25 }, { a: [8, 0], b: [8, 3], t: '3 m', line: false, side: 1 }, { a: [0, 3], b: [8, 3], dash: true, w: 1.3 }, { a: [4, 5.5], b: [4, 3], t: '2,5 m', dash: true, side: 1 }, { a: [4.5, 0], b: [4.5, 2], t: '2 m', line: false, side: 1 }, { a: [3.5, 2], b: [4.5, 2], t: '1 m', line: false, side: -1 }], label: 'Giebelwand mit Tür' }),
      steps: ['Zerlegen: Die Wand besteht aus einem Rechteck und einem Dreieck.', 'Rechteck: 8 m · 3 m = 24 m².', 'Dreieck: 8 m · 2,5 m : 2 = 10 m².', 'Wand: 24 m² + 10 m² = 34 m². Tür abziehen: 1 m · 2 m = 2 m². Es bleiben 32 m².', 'Antwort: Es müssen 32 m² gestrichen werden. Kontrolle: Das umgebende Rechteck 8 m · 5,5 m = 44 m² ist größer, das passt.'] },
    tasks: { gen: gen, plan: { G: ['zerlegung:1', 'lform:1', 'umfang:1', 'haus:2'], S: ['lform:2', 'umfang:1', 'haus:2', 'ergaenzen:2', 'fliesen:2'], E: ['lform:3', 'umfang:3', 'grund:2', 'ergaenzen:3', 'haus:3', 'rasen:2'] },
      extra: 'gitter', test: ['zerlegung:1', 'lform:2', 'umfang:1', 'haus:2', 'ergaenzen:2', 'fliesen:2'] },
    lerncheck: ['Ich kann eine zusammengesetzte Figur geschickt zerlegen.', 'Ich kann eine Figur ergänzen und das ergänzte Stück abziehen.', 'Ich berechne fehlende Längen und den Umfang.', 'Ich löse Sachaufgaben mit zusammengesetzten Flächen.']
  };
})();
