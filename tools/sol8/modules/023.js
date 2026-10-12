/* Modul 023 · Parallelogramm, Dreieck und Trapez */
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
  /* rechtwinklige Zahlentripel: waagerechter Versatz, Höhe, schräge Seite */
  var TRI = [[3, 4, 5], [4, 3, 5], [6, 8, 10], [8, 6, 10], [1.5, 2, 2.5], [2, 1.5, 2.5], [5, 12, 13], [2.4, 3.2, 4], [3.2, 2.4, 4], [4.5, 6, 7.5], [6, 4.5, 7.5]];
  function triple(lvl, maxDx, maxH) { var c = TRI.filter(function (t) { return t[0] <= maxDx && t[1] <= maxH && (lvl >= 2 || t[1] % 1 === 0 && t[0] % 1 === 0); }); return M.pick(c.length ? c : [[3, 4, 5]]); }
  function u(x, e) { return f(x) + ' ' + (e || 'cm'); }
  /* Parallelogramm mit Höhe */
  function paraFig(g, h, dx, opt) {
    opt = opt || {}; var flip = opt.flip, e = opt.e || 'cm';
    var P = flip ? [[0, 0], [g, 0], [g - dx, h], [-dx, h]] : [[0, 0], [g, 0], [g + dx, h], [dx, h]];
    var top = flip ? P[2] : P[3], foot = [top[0], 0];
    var segs = [{ a: P[0], b: P[1], t: opt.gl || 'g = ' + u(g, e), line: false }, { a: top, b: foot, t: opt.hl || 'h = ' + u(h, e), dash: true, side: flip ? 1 : -1, at: 0.55 }];
    if (opt.s) segs.push(flip ? { a: P[1], b: P[2], t: 's = ' + u(opt.s, e), line: false } : { a: P[3], b: P[0], t: 's = ' + u(opt.s, e), line: false });
    return { P: P, svg: fig({ polys: [{ P: P }], segs: segs, rights: [[foot, top, flip ? P[0] : P[1]]], note: opt.note, label: 'Parallelogramm mit Grundseite und Höhe' }) };
  }
  function triFig(g, h, cx, opt) {
    opt = opt || {}; var e = opt.e || 'cm', P = [[0, 0], [g, 0], [cx, h]], foot = [cx, 0], segs = [{ a: P[0], b: P[1], t: opt.gl || 'g = ' + u(g, e), line: false }];
    if (cx > g) segs.push({ a: P[1], b: foot, dash: true, w: 1.5 }); if (cx < 0) segs.push({ a: foot, b: P[0], dash: true, w: 1.5 });
    var hs = cx > g / 2 ? -1 : 1; if (cx > g || cx < 0) hs = cx > g ? 1 : -1;
    segs.push({ a: P[2], b: foot, t: opt.hl || 'h = ' + u(h, e), dash: true, side: -hs, at: 0.62 });
    if (opt.s) segs.push(opt.sOn === 'BC' ? { a: P[1], b: P[2], t: 's = ' + u(opt.s, e), line: false, at: cx > g ? 0.3 : 0.5 } : { a: P[2], b: P[0], t: 's = ' + u(opt.s, e), line: false });
    return { P: P, svg: fig({ polys: [{ P: P }], segs: segs, rights: [[foot, P[2], cx > g / 2 ? P[0] : P[1]]], note: opt.note, label: 'Dreieck mit Grundseite und Höhe' }) };
  }
  function trapFig(a, c, h, dx, opt) {
    opt = opt || {}; var e = opt.e || 'cm', P = [[0, 0], [a, 0], [dx + c, h], [dx, h]], foot = [dx, 0];
    var segs = [{ a: P[0], b: P[1], t: opt.al || 'a = ' + u(a, e), line: false }, { a: P[2], b: P[3], t: opt.cl || 'c = ' + u(c, e), line: false }, { a: P[3], b: foot, t: opt.hl || 'h = ' + u(h, e), dash: true, side: -1, at: 0.55 }];
    if (opt.s) segs.push({ a: P[3], b: P[0], t: 's = ' + u(opt.s, e), line: false });
    return { P: P, svg: fig({ polys: [{ P: P }], segs: segs, rights: [[foot, P[3], P[1]]], note: opt.note, label: 'Trapez mit parallelen Seiten a und c und Höhe h' }) };
  }
  function areaCheck(P, A) { return function () { var x = gauss(P); return Math.abs(x - A) < 1e-6 || 'Koordinaten ergeben ' + x + ' statt ' + A; }; }
  function numIn(ans, label, unit, tol) { return { kind: 'num', answer: r3(ans), label: label, unit: unit, tol: tol }; }
  function slantMsg() { return 'Du hast mit der <b>schrägen Seite</b> gerechnet. Die Höhe ist die Strecke, die <b>senkrecht</b> auf der Grundseite steht (gestrichelt, mit rechtem Winkel).'; }

  var gen = {
    para: function (lvl) {
      var t = triple(lvl, 8, 8), g = lvl >= 3 ? M.rnd(Math.max(45, Math.ceil(t[0] * 10) + 15), 125) / 10 : M.rnd(Math.max(5, Math.ceil(t[0]) + 1), 13), h = t[1], s = t[2], A = r3(g * h), fl = Math.random() < 0.5;
      var F = paraFig(g, h, t[0], { s: lvl >= 2 ? s : null, flip: fl });
      return { skill: 'Parallelogramm: A = g · h', q: 'Berechne den Flächeninhalt des Parallelogramms.' + F.svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Für das Parallelogramm gilt A = g · h. Die Höhe h steht senkrecht auf der Grundseite g.', lvl >= 2 ? 'Die schräge Seite s = ' + u(s) + ' brauchst du nicht. Nimm die gestrichelte Höhe h = ' + u(h) + '.' : 'Grundseite g = ' + u(g) + ', Höhe h = ' + u(h) + '.', 'A = ' + f(g) + ' cm · ' + f(h) + ' cm.'],
        solution: 'A = g · h = ' + f(g) + ' cm · ' + f(h) + ' cm = ' + f(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - g * s) < 1e-6) return slantMsg(); if (Math.abs(x - g * h / 2) < 1e-6) return 'Beim Parallelogramm wird nicht durch 2 geteilt. Es lässt sich zu einem Rechteck mit derselben Grundseite und Höhe umlegen.'; if (Math.abs(x - 2 * (g + s)) < 1e-6) return 'Das ist der Umfang. Gesucht ist der Flächeninhalt.'; return null; },
        verify: areaCheck(F.P, A) };
    },
    dreieck: function (lvl) {
      var t = triple(lvl, 8, 8), h = t[1], g, cx, sOn = 'AC', obt = lvl >= 2 && Math.random() < 0.45;
      if (obt) { g = M.rnd(4, 9); cx = g + t[0]; sOn = 'BC'; } else { g = M.rnd(Math.ceil(t[0]) + 2, 13); cx = t[0]; }
      if (lvl >= 3) g = g + M.pick([0.5, 0.4, 0.6]);
      var A = r3(g * h / 2), F = triFig(g, h, cx, { s: lvl >= 2 ? t[2] : null, sOn: sOn });
      return { skill: 'Dreieck: A = g · h : 2', q: 'Berechne den Flächeninhalt des Dreiecks.' + (obt ? ' Die Höhe liegt hier außerhalb des Dreiecks.' : '') + F.svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Für das Dreieck gilt A = g · h : 2.', 'g = ' + u(g) + ' und h = ' + u(h) + '. Die Höhe ist die gestrichelte Strecke von der Spitze senkrecht zur Grundseite' + (obt ? ', hier zur verlängerten Grundseite.' : '.'), f(g) + ' cm · ' + f(h) + ' cm = ' + f(r3(g * h)) + ' cm². Teile noch durch 2.'],
        solution: 'A = g · h : 2 = ' + f(g) + ' cm · ' + f(h) + ' cm : 2 = ' + f(r3(g * h)) + ' cm² : 2 = ' + f(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - g * h) < 1e-6) return 'Fast. Ein Dreieck ist genau halb so groß wie das Parallelogramm mit derselben Grundseite und Höhe. Teile noch durch 2.'; if (Math.abs(x - g * t[2] / 2) < 1e-6 || Math.abs(x - g * t[2]) < 1e-6) return slantMsg(); return null; },
        verify: areaCheck(F.P, A) };
    },
    trapez: function (lvl) {
      var t = triple(lvl, 6, 8), a = M.rnd(Math.ceil(t[0]) + 4, 14), c = M.rnd(2, Math.max(2, Math.floor(a - t[0]))), h = t[1];
      if (lvl >= 3) { a += 0.5; }
      var A = r3((a + c) / 2 * h), F = trapFig(a, c, h, t[0], { s: lvl >= 2 ? t[2] : null });
      return { skill: 'Trapez: A = (a + c) : 2 · h', q: 'Berechne den Flächeninhalt des Trapezes. Die Seiten a und c sind parallel.' + F.svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Für das Trapez gilt A = (a + c) : 2 · h. Du nimmst also den Mittelwert der beiden parallelen Seiten.', '(a + c) : 2 = (' + f(a) + ' cm + ' + f(c) + ' cm) : 2 = ' + f((a + c) / 2) + ' cm.', 'Multipliziere mit der Höhe h = ' + u(h) + '.'],
        solution: 'A = (a + c) : 2 · h = (' + f(a) + ' cm + ' + f(c) + ' cm) : 2 · ' + f(h) + ' cm = ' + f((a + c) / 2) + ' cm · ' + f(h) + ' cm = ' + f(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (a + c) * h) < 1e-6) return 'Du hast vergessen, durch 2 zu teilen. Zwei gleiche Trapeze ergeben zusammen ein Parallelogramm mit Grundseite a + c.'; if (Math.abs(x - a * c) < 1e-6) return 'a und c sind die parallelen Seiten. Du brauchst ihren Mittelwert und dazu die Höhe h.'; if (Math.abs(x - (a + c) / 2 * t[2]) < 1e-6) return slantMsg(); return null; },
        verify: areaCheck(F.P, A) };
    },
    rechnung: function (lvl) {
      var tri = Math.random() < 0.5, t = triple(2, 6, 8), g, h = t[1], s = t[2], F, opts, ok;
      do { g = M.rnd(Math.ceil(t[0]) + 3, 12); } while (g === s || g === h);
      function m(x, y, half) { return 'A = ' + f(x) + ' cm · ' + f(y) + ' cm' + (half ? ' : 2' : '') + ' = ' + f(r3(half ? x * y / 2 : x * y)) + ' cm²'; }
      if (tri) { F = triFig(g, h, t[0], { s: s }); ok = m(g, h, true); opts = [ok, m(g, h, false), m(g, s, true), m(g, s, false)]; }
      else { F = paraFig(g, h, t[0], { s: s }); ok = m(g, h, false); opts = [ok, m(g, s, false), m(g, h, true), m(s, h, false)]; }
      opts = M.shuffle(opts);
      return { skill: 'Höhe erkennen', level: 1, q: 'Welche Rechnung ergibt den Flächeninhalt ' + (tri ? 'des Dreiecks' : 'des Parallelogramms') + '?' + F.svg, inputs: [{ kind: 'mc', label: 'Richtige Rechnung', options: opts, answer: opts.indexOf(ok) }],
        hints: ['Die Höhe steht senkrecht auf der Grundseite. Sie ist gestrichelt und hat ein Zeichen für den rechten Winkel.', 'Die schräge Seite s = ' + u(s) + ' ist <b>keine</b> Höhe.', tri ? 'Beim Dreieck rechnest du g · h und teilst durch 2.' : 'Beim Parallelogramm rechnest du g · h ohne Teilen.'],
        solution: 'Richtig ist ' + ok + '. ' + (tri ? 'Ein Dreieck ist halb so groß wie das passende Parallelogramm.' : 'Das Parallelogramm lässt sich in ein Rechteck mit den Seiten g und h umlegen.'),
        verify: areaCheck(F.P, tri ? g * h / 2 : g * h) };
    },
    umkehr: function (lvl) {
      var tri = Math.random() < (lvl >= 2 ? 0.6 : 0.3), t = triple(1, 6, 8), g = M.rnd(Math.ceil(t[0]) + 2, 12), h = t[1], askG = lvl >= 2 && Math.random() < 0.4;
      var A = r3(tri ? g * h / 2 : g * h), F = tri ? triFig(g, h, t[0], askG ? { gl: 'g = ?' } : { hl: 'h = ?' }) : paraFig(g, h, t[0], askG ? { gl: 'g = ?' } : { hl: 'h = ?' });
      var ans = askG ? g : h, known = askG ? h : g, kn = askG ? 'h' : 'g', an = askG ? 'g' : 'h', name = tri ? 'Das Dreieck' : 'Das Parallelogramm';
      return { skill: 'Umkehraufgabe: Höhe oder Grundseite', q: name + ' hat den Flächeninhalt A = ' + f(A) + ' cm². Es ist ' + kn + ' = ' + u(known) + '. Berechne ' + an + '.' + F.svg, inputs: [numIn(ans, an + ' =', 'cm')],
        hints: ['Schreibe die Formel auf und setze ein: ' + (tri ? f(A) + ' = ' + (askG ? 'g · ' + f(h) : f(g) + ' · h') + ' : 2' : f(A) + ' = ' + (askG ? 'g · ' + f(h) : f(g) + ' · h')) + '.', tri ? 'Mal 2 auf beiden Seiten: ' + f(2 * A) + ' = ' + (askG ? 'g · ' + f(h) : f(g) + ' · h') + '.' : 'Teile durch ' + f(known) + '.', an + ' = ' + f(tri ? 2 * A : A) + ' : ' + f(known) + '.'],
        solution: (tri ? an + ' = 2 · A : ' + kn + ' = 2 · ' + f(A) + ' : ' + f(known) + ' = ' + f(2 * A) + ' : ' + f(known) : an + ' = A : ' + kn + ' = ' + f(A) + ' : ' + f(known)) + ' = ' + u(ans) + '. Probe: ' + (tri ? f(g) + ' · ' + f(h) + ' : 2 = ' : f(g) + ' · ' + f(h) + ' = ') + f(A) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (tri && Math.abs(x - A / known) < 1e-6) return 'Beim Dreieck wird durch 2 geteilt. Rechne deshalb zuerst 2 · A = ' + f(2 * A) + ' und teile dann durch ' + f(known) + '.'; if (Math.abs(x - A * known) < 1e-6) return 'Umkehraufgabe: Du musst teilen, nicht multiplizieren.'; return null; },
        verify: function () { var P = tri ? [[0, 0], [ans * (askG ? 1 : 0) + (askG ? 0 : g), 0], [t[0], askG ? h : ans]] : [[0, 0], [askG ? ans : g, 0], [(askG ? ans : g) + t[0], askG ? h : ans], [t[0], askG ? h : ans]]; var x = gauss(P); return Math.abs(x - A) < 1e-6 || 'Probe über Koordinaten: ' + x; } };
    },
    trapez_c: function () {
      var t = triple(1, 5, 8), a = M.rnd(Math.ceil(t[0]) + 5, 14), c = M.rnd(2, Math.floor(a - t[0])), h = t[1], A = r3((a + c) / 2 * h);
      var F = trapFig(a, c, h, t[0], { cl: 'c = ?' });
      return { skill: 'Trapez: fehlende Seite', level: 3, q: 'Ein Trapez hat den Flächeninhalt A = ' + f(A) + ' cm². Die Seite a ist ' + u(a) + ' lang, die Höhe ist h = ' + u(h) + '. Wie lang ist die parallele Seite c?' + F.svg, inputs: [numIn(c, 'c =', 'cm')],
        hints: ['Setze in A = (a + c) : 2 · h ein: ' + f(A) + ' = (' + f(a) + ' + c) : 2 · ' + f(h) + '.', 'Rechne rückwärts: (a + c) : 2 = ' + f(A) + ' : ' + f(h) + ' = ' + f((a + c) / 2) + '. Also a + c = ' + f(a + c) + '.', 'c = ' + f(a + c) + ' − ' + f(a) + '.'],
        solution: '(a + c) : 2 = A : h = ' + f(A) + ' : ' + f(h) + ' = ' + f((a + c) / 2) + ' cm. a + c = 2 · ' + f((a + c) / 2) + ' cm = ' + u(a + c) + '. c = ' + f(a + c) + ' cm − ' + f(a) + ' cm = ' + u(c) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - (A / h - a)) < 1e-6) return 'A : h ist erst der Mittelwert (a + c) : 2. Verdopple ihn, bevor du a abziehst.'; return null; },
        verify: function () { var x = gauss([[0, 0], [a, 0], [t[0] + c, h], [t[0], h]]); return Math.abs(x - A) < 1e-6 || 'Probe ' + x; } };
    },
    einheit: function (lvl) {
      var tri = Math.random() < 0.5, g = M.rnd(12, 48) / 10, hc = M.rnd(4, 18) * 10, hm = hc / 100, dx = M.pick([0.3, 0.5, 0.6]) * g;
      var Am = r3(tri ? g * hm / 2 : g * hm), Acm = Math.round(Am * 10000);
      var F = tri ? triFig(g, hm, dx, { gl: 'g = ' + u(g, 'm'), hl: 'h = ' + u(hc, 'cm') }) : paraFig(g, hm, dx * 0.6, { gl: 'g = ' + u(g, 'm'), hl: 'h = ' + u(hc, 'cm') });
      return { skill: 'Einheiten beim Flächeninhalt', q: 'Berechne den Flächeninhalt ' + (tri ? 'des Dreiecks' : 'des Parallelogramms') + '. Achte auf die Einheiten! Gib das Ergebnis in m² und in cm² an.' + F.svg,
        inputs: [numIn(Am, 'A in m²', 'm²', 0.0005), { kind: 'num', answer: Acm, label: 'A in cm²', unit: 'cm²' }],
        hints: ['Beide Längen müssen dieselbe Einheit haben. Rechne die Höhe in Meter um: ' + hc + ' cm = ' + f(hm) + ' m.', 'A = ' + f(g) + ' m · ' + f(hm) + ' m' + (tri ? ' : 2' : '') + ' = ' + f(Am) + ' m².', '1 m² = 10 000 cm². Also multiplizierst du mit 10 000.'],
        solution: hc + ' cm = ' + f(hm) + ' m. A = ' + f(g) + ' m · ' + f(hm) + ' m' + (tri ? ' : 2' : '') + ' = ' + f(Am) + ' m² = ' + f(Am) + ' · 10 000 cm² = ' + f(Acm) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]), w = M.parseNum(v[1]); if (x !== null && Math.abs(x - (tri ? g * hc / 2 : g * hc)) < 1e-6) return 'Du hast Meter mal Zentimeter gerechnet. Rechne zuerst beide Längen in dieselbe Einheit um.'; if (w !== null && Math.abs(w - Am * 100) < 1e-6) return 'Bei Flächen ist die Umrechnungszahl 10 000, nicht 100: 1 m² = 100 cm · 100 cm = 10 000 cm².'; return null; },
        verify: areaCheck(F.P, Am) };
    },
    sach: function (lvl) {
      var k = M.pick(['dach', 'segel', 'grund']), F, A, q, inputs, hints, sol;
      if (k === 'dach') {
        var c = M.rnd(3, 6), dx = 4, a = c + 2 * dx, h = M.pick([3, 4.5, 6]), hz = M.pick([12, 16, 20]);
        A = r3((a + c) / 2 * h); F = trapFig(a, c, h, dx, { e: 'm' });
        q = 'Eine Dachfläche eines Walmdachs hat die Form eines Trapezes (Maße in der Zeichnung). Für 1 m² braucht man ' + hz + ' Dachziegel.<br>a) Wie groß ist die Dachfläche?<br>b) Wie viele Ziegel braucht man für diese Dachfläche?';
        inputs = [numIn(A, 'a) A =', 'm²'), { kind: 'num', answer: r3(A * hz), label: 'b) Ziegel', unit: 'Stück' }];
        hints = ['Das Dach ist ein Trapez: A = (a + c) : 2 · h.', '(' + f(a) + ' + ' + f(c) + ') : 2 · ' + f(h) + ' = ' + f(A) + ' m².', 'Ziegel: ' + f(A) + ' · ' + hz + '.'];
        sol = 'a) A = (' + f(a) + ' m + ' + f(c) + ' m) : 2 · ' + f(h) + ' m = ' + f(A) + ' m². b) ' + f(A) + ' · ' + hz + ' = ' + f(r3(A * hz)) + ' Ziegel.';
      } else if (k === 'segel') {
        var g = M.pick([2.4, 3, 3.6, 4]), hs = M.pick([4, 5, 6, 7.5]), pr = M.pick([18, 24, 35]);
        A = r3(g * hs / 2); F = triFig(g, hs, 0, { e: 'm' });
        q = 'Ein Segel hat die Form eines rechtwinkligen Dreiecks: Grundseite ' + u(g, 'm') + ', Höhe ' + u(hs, 'm') + '. Der Segelstoff kostet ' + pr + ' € pro m².<br>a) Wie groß ist das Segel?<br>b) Was kostet der Stoff?';
        inputs = [numIn(A, 'a) A =', 'm²'), { kind: 'num', answer: r3(A * pr), label: 'b) Preis', unit: '€', tol: 0.005 }];
        hints = ['Das Segel ist ein Dreieck: A = g · h : 2.', f(g) + ' m · ' + f(hs) + ' m : 2 = ' + f(A) + ' m².', 'Preis: ' + f(A) + ' · ' + pr + ' €.'];
        sol = 'a) A = ' + f(g) + ' m · ' + f(hs) + ' m : 2 = ' + f(A) + ' m². b) ' + f(A) + ' · ' + pr + ' € = ' + f(r3(A * pr), 2) + ' €.';
      } else {
        var gg = M.rnd(18, 32), hh = M.rnd(12, 24), d = M.pick([6, 8, 9]), pp = M.pick([80, 95, 120]);
        A = gg * hh; F = paraFig(gg, hh, d, { e: 'm' });
        q = 'Ein Grundstück hat die Form eines Parallelogramms (Maße in der Zeichnung). 1 m² Bauland kostet ' + pp + ' €.<br>a) Wie groß ist das Grundstück?<br>b) Was kostet es?';
        inputs = [numIn(A, 'a) A =', 'm²'), { kind: 'num', answer: A * pp, label: 'b) Preis', unit: '€' }];
        hints = ['Das Grundstück ist ein Parallelogramm: A = g · h.', f(gg) + ' m · ' + f(hh) + ' m = ' + f(A) + ' m².', 'Preis: ' + f(A) + ' · ' + pp + ' €.'];
        sol = 'a) A = ' + f(gg) + ' m · ' + f(hh) + ' m = ' + f(A) + ' m². b) ' + f(A) + ' · ' + pp + ' € = ' + f(A * pp) + ' €.';
      }
      return { skill: 'Sachaufgabe Flächeninhalt', q: q + F.svg, inputs: inputs, hints: hints, solution: sol, verify: areaCheck(F.P, A) };
    },
    drachen: function () {
      var raute = Math.random() < 0.4, e = M.rnd(5, 12), fl = M.rnd(4, 9), p = raute ? e / 2 : M.rnd(Math.ceil(e / 4), Math.floor(e * 3 / 4));
      if (!raute && p * 2 === e) p++;
      if (fl === e) fl++;
      var P = [[0, 0], [p, -fl / 2], [e, 0], [p, fl / 2]], A = r3(e * fl / 2);
      var svg = fig({ polys: [{ P: [[0, -fl / 2], [e, -fl / 2], [e, fl / 2], [0, fl / 2]], fill: 'none', stroke: '#b9b2cc', dash: true, w: 1.5 }, { P: P }], segs: [{ a: P[0], b: P[2], t: 'e = ' + u(e), dash: true, col: '#5b3fa0', side: 1, at: p / e <= 0.5 ? (p / e + 1) / 2 : p / e / 2, tc: '#5b3fa0' }, { a: P[3], b: P[1], t: 'f = ' + u(fl), dash: true, col: '#5b3fa0', side: -1, at: 0.25, tc: '#5b3fa0' }], rights: [[[p, 0], [e, 0], [p, fl / 2]]], label: 'Viereck mit Diagonalen e und f' });
      return { skill: 'Drachen und Raute: A = e · f : 2', level: 3, q: 'Das Viereck ist ' + (raute ? 'eine Raute' : 'ein Drachen') + '. Seine Diagonalen e und f stehen senkrecht aufeinander. Finde selbst eine Formel und berechne den Flächeninhalt. Das gestrichelte Rechteck hilft dir.' + svg, inputs: [numIn(A, 'A =', 'cm²')],
        hints: ['Das gestrichelte Rechteck hat die Seiten e und f. Sein Flächeninhalt ist e · f = ' + f(e * fl) + ' cm².', 'Die Diagonalen zerlegen das Rechteck in vier kleine Rechtecke. Jedes wird von einer Seite des Vierecks genau halbiert.', 'Das Viereck ist also halb so groß wie das Rechteck: A = e · f : 2.'],
        solution: 'Das Viereck füllt genau die Hälfte des Rechtecks aus. A = e · f : 2 = ' + f(e) + ' cm · ' + f(fl) + ' cm : 2 = ' + f(A) + ' cm². Diese Formel gilt für jeden Drachen und jede Raute.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - e * fl) < 1e-6) return 'Das ist der Flächeninhalt des ganzen Rechtecks. Welcher Anteil davon gehört zum Viereck?'; return null; },
        verify: areaCheck(P, A) };
    }
  };

  /* Bilder für die Erklärung */
  var EX_PARA = fig({ polys: [{ P: [[0, 0], [6, 0], [8, 3], [2, 3]] }, { P: [[0, 0], [2, 0], [2, 3]], fill: '#f6d9a8', stroke: '#d97706', w: 2 }, { P: [[6, 0], [8, 0], [8, 3]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }],
    segs: [{ a: [2, 0], b: [8, 0], t: 'g', line: false, side: 1 }, { a: [2, 3], b: [2, 0], t: 'h', dash: true, side: -1 }], texts: [{ p: [5, 1.5], t: '→ verschieben', col: '#b45309', size: 12 }], label: 'Parallelogramm wird zum Rechteck', W: 320, maxH: 170 });
  var EX_TRI = fig({ polys: [{ P: [[0, 0], [6, 0], [8, 3], [2, 3]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }, { P: [[0, 0], [6, 0], [2, 3]] }], segs: [{ a: [0, 0], b: [6, 0], t: 'g', line: false, side: 1 }, { a: [2, 3], b: [2, 0], t: 'h', dash: true, side: 1 }], label: 'Zwei gleiche Dreiecke ergeben ein Parallelogramm', W: 320, maxH: 170 });
  var EX_TRAP = fig({ polys: [{ P: [[0, 0], [7, 0], [6, 3], [2, 3]] }, { P: [[7, 0], [11, 0], [13, 3], [6, 3]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }],
    segs: [{ a: [0, 0], b: [7, 0], t: 'a', line: false, side: 1 }, { a: [7, 0], b: [11, 0], t: 'c', line: false, side: 1, tc: '#b45309' }, { a: [6, 3], b: [2, 3], t: 'c', line: false }, { a: [6, 3], b: [13, 3], t: 'a', line: false, side: -1, tc: '#b45309' }, { a: [2, 3], b: [2, 0], t: 'h', dash: true, side: -1 }], label: 'Zwei gleiche Trapeze ergeben ein Parallelogramm', W: 340, maxH: 170 });

  return {
    id: '023', title: 'Parallelogramm, Dreieck und Trapez', bereich: 'Größen und Messen', minutes: '45 bis 60',
    vorkenntnisse: 'Flächeninhalt von Rechteck und Quadrat, Flächeneinheiten, senkrecht',
    lead: 'Wie groß ist eine Fläche, die schief ist? Du leitest Formeln für Parallelogramm, Dreieck und Trapez her, indem du Figuren zerschneidest und neu zusammensetzt.',
    einstieg: { html: '<p>Familie Becker möchte ihren Carport mit Pflastersteinen auslegen. Die Fläche ist aber kein Rechteck, sondern ein <b>Parallelogramm</b>. Daneben liegt ein Beet in Form eines <b>Trapezes</b>, und das Sonnensegel über der Terrasse ist ein <b>Dreieck</b>.</p><p class="note">Wie viele Quadratmeter sind das jeweils? Kann man die schiefen Figuren vielleicht so zerschneiden, dass ein Rechteck entsteht?</p><p>Genau das probierst du in diesem Modul. So findest du für jede dieser Figuren eine einfache Formel.</p>' },
    ziele: ['Ich leite die Flächenformeln für Parallelogramm, Dreieck und Trapez durch Zerlegen und Ergänzen her.', 'Ich erkenne die Höhe einer Figur und verwechsle sie nicht mit einer schrägen Seite.', 'Ich berechne Flächeninhalte mit A = g · h, A = g · h : 2 und A = (a + c) : 2 · h.', 'Ich berechne eine fehlende Höhe oder Seite, wenn der Flächeninhalt bekannt ist.', 'Ich rechne mit Flächeneinheiten wie cm² und m² und löse Sachaufgaben.'],
    fachwoerter: [['Grundseite g', 'Die Seite, auf der die Figur „steht“. Zu ihr gehört eine Höhe.'], ['Höhe h', 'Der senkrechte Abstand zwischen der Grundseite und der gegenüberliegenden Ecke oder Seite. Sie steht im rechten Winkel auf der Grundseite.'], ['Schräge Seite', 'Eine Seite, die nicht senkrecht steht. Sie ist länger als die Höhe und gehört nicht in die Flächenformel.'], ['Zerlegen und Ergänzen', 'Eine Figur zerschneiden oder verdoppeln, sodass eine bekannte Figur entsteht. Der Flächeninhalt bleibt dabei erhalten oder wird genau verdoppelt.']],
    diagnose: [
      { q: 'Ein Rechteck ist 7 cm lang und 4 cm breit. Wie groß ist sein Flächeninhalt?', options: ['22 cm²', '28 cm²', '11 cm²', 'Weiß ich noch nicht'], answer: 1, why: 'A = Länge · Breite = 7 cm · 4 cm = 28 cm². 22 cm wäre der Umfang.', review: 'Flächeninhalt des Rechtecks (Klasse 5/6)' },
      { q: 'Wie viele cm² sind 1 m²?', options: ['100 cm²', '1 000 cm²', '10 000 cm²', 'Weiß ich noch nicht'], answer: 2, why: '1 m² = 100 cm · 100 cm = 10 000 cm².', review: 'Flächeneinheiten umrechnen' },
      { q: 'Was bedeutet es, wenn zwei Strecken senkrecht zueinander sind?', options: ['Sie bilden einen rechten Winkel.', 'Sie sind gleich lang.', 'Sie sind parallel.', 'Weiß ich noch nicht'], answer: 0, why: 'Senkrecht heißt: Sie schneiden sich im Winkel von 90°.', review: 'Senkrechte und parallele Strecken' },
      { q: 'Welche Zahl gehört in die Lücke? 6 · □ = 42', options: ['36', '7', '48', 'Weiß ich noch nicht'], answer: 1, why: '42 : 6 = 7.', review: 'Umkehraufgaben zur Multiplikation' }],
    erklaerung:
      '<h3>1. Parallelogramm</h3><p>Schneide links ein Dreieck ab und lege es rechts wieder an. Es entsteht ein <b>Rechteck</b> mit der Länge g und der Breite h. Der Flächeninhalt ändert sich dabei nicht.</p>' + EX_PARA +
      '<div class="merk"><b>Merke:</b> Parallelogramm: <span class="big-math">A = g · h</span><br>Die <b>Höhe h</b> steht senkrecht auf der Grundseite g. Sie ist <b>nicht</b> die schräge Seite!</div>' +
      '<h3>2. Dreieck</h3><p>Nimm zwei gleiche Dreiecke. Drehst du eines um und legst es an, entsteht ein <b>Parallelogramm</b> mit derselben Grundseite und Höhe. Ein Dreieck ist also halb so groß.</p>' + EX_TRI +
      '<div class="merk"><b>Merke:</b> Dreieck: <span class="big-math">A = g · h : 2</span><br>Bei einem stumpfwinkligen Dreieck kann die Höhe außerhalb liegen. Dann verlängerst du die Grundseite.</div>' +
      '<h3>3. Trapez</h3><p>Auch zwei gleiche Trapeze ergeben zusammen ein Parallelogramm. Seine Grundseite ist a + c, seine Höhe h. Ein Trapez ist halb so groß.</p>' + EX_TRAP +
      '<div class="merk"><b>Merke:</b> Trapez mit den parallelen Seiten a und c: <span class="big-math">A = (a + c) : 2 · h</span></div>' +
      '<h3>4. Typischer Fehler</h3><p>Die schräge Seite ist immer <b>länger</b> als die Höhe. Wer mit ihr rechnet, bekommt einen zu großen Flächeninhalt. Suche immer die Strecke mit dem <b>rechten Winkel</b>.</p>' +
      '<h3>5. Einheiten</h3><p>Alle Längen müssen dieselbe Einheit haben, bevor du rechnest. Es gilt 1 m² = 10 000 cm² und 1 dm² = 100 cm². Beispiel: g = 2 m, h = 50 cm = 0,5 m, also A = 2 m · 0,5 m = 1 m².</p>',
    entdecken: {
      html: '<p>Wähle eine Figur und verändere sie mit den Reglern. Die orange Figur zeigt, wie du sie zerlegst oder ergänzt.</p><div class="ctl"><label>Figur <select id="e_fig"><option>Parallelogramm</option><option>Dreieck</option><option>Trapez</option></select></label></div>' +
        '<div class="ctl"><label><span id="l_g">g</span> = <b id="v_g"></b> <input type="range" id="r_g" min="6" max="12" step="1" value="8"></label><label id="w_c">c = <b id="v_c"></b> <input type="range" id="r_c" min="2" max="8" step="1" value="3"></label><label>h = <b id="v_h"></b> <input type="range" id="r_h" min="2" max="6" step="1" value="3"></label><label>Scherung = <b id="v_s"></b> <input type="range" id="r_s" min="0" max="5" step="1" value="1"></label></div>' +
        '<div id="e_g"></div><p class="big-math" id="e_t"></p><p class="note" id="e_n"></p>',
      init: function (root, done) {
        var n = 0;
        function v(k) { return +root.querySelector('#r_' + k).value; }
        function draw() {
          var mode = root.querySelector('#e_fig').value, g = v('g'), c = Math.min(v('c'), g - 1), h = v('h'), s = v('s'), svg, txt, note;
          root.querySelector('#w_c').style.display = mode === 'Trapez' ? '' : 'none';
          root.querySelector('#l_g').textContent = mode === 'Trapez' ? 'a' : 'g';
          ['g', 'c', 'h', 's'].forEach(function (k) { root.querySelector('#v_' + k).textContent = (k === 'c' ? c : v(k)) + (k === 's' ? '' : ' cm'); });
          var box = [-0.5, Math.max(12, mode === 'Trapez' ? g + c + s : g + s) + 0.5, -0.5, 6.5];
          if (mode === 'Parallelogramm') {
            svg = fig({ box: box, polys: [{ P: [[0, 0], [g, 0], [g + s, h], [s, h]] }, { P: [[0, 0], [s, 0], [s, h]], fill: '#f6d9a8', stroke: '#d97706', w: 2 }, { P: [[g, 0], [g + s, 0], [g + s, h]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }], segs: [{ a: [s, h], b: [s, 0], t: 'h', dash: true, side: 1 }, { a: [0, 0], b: [g, 0], t: 'g = ' + g + ' cm', line: false }], label: 'Parallelogramm und Rechteck' });
            txt = 'A = g · h = ' + g + ' cm · ' + h + ' cm = ' + g * h + ' cm²'; note = s ? 'Das orange Dreieck wandert nach rechts. Es entsteht ein Rechteck mit ' + g + ' cm mal ' + h + ' cm. Die Scherung ändert den Flächeninhalt nicht.' : 'Ohne Scherung ist das Parallelogramm schon ein Rechteck.';
          } else if (mode === 'Dreieck') {
            svg = fig({ box: box, polys: [{ P: [[0, 0], [g, 0], [g + s, h], [s, h]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }, { P: [[0, 0], [g, 0], [s, h]] }], segs: [{ a: [s, h], b: [s, 0], t: 'h', dash: true, side: -1 }, { a: [0, 0], b: [g, 0], t: 'g = ' + g + ' cm', line: false }], label: 'Dreieck und Parallelogramm' });
            txt = 'A = g · h : 2 = ' + g + ' cm · ' + h + ' cm : 2 = ' + f(g * h / 2) + ' cm²'; note = 'Das gedrehte Dreieck (orange) ergänzt dein Dreieck zu einem Parallelogramm mit ' + g * h + ' cm². Dein Dreieck ist genau die Hälfte.';
          } else {
            svg = fig({ box: box, polys: [{ P: [[0, 0], [g, 0], [s + c, h], [s, h]] }, { P: [[g, 0], [g + c, 0], [g + c + s, h], [s + c, h]], fill: '#f6d9a8', stroke: '#d97706', w: 2, dash: true }], segs: [{ a: [s, h], b: [s, 0], t: 'h', dash: true, side: -1 }, { a: [0, 0], b: [g, 0], t: 'a = ' + g + ' cm', line: false }, { a: [g, 0], b: [g + c, 0], t: 'c', line: false, tc: '#b45309' }], label: 'Trapez und Parallelogramm' });
            txt = 'A = (a + c) : 2 · h = (' + g + ' + ' + c + ') : 2 · ' + h + ' = ' + f((g + c) / 2 * h) + ' cm²'; note = 'Zwei gleiche Trapeze bilden ein Parallelogramm mit der Grundseite a + c = ' + (g + c) + ' cm. Ein Trapez ist die Hälfte davon.';
          }
          root.querySelector('#e_g').innerHTML = svg; root.querySelector('#e_t').textContent = txt; root.querySelector('#e_n').textContent = note;
        }
        function hit() { draw(); n++; if (n >= 3) done('Stark: Beim Verformen bleibt der Flächeninhalt gleich, solange Grundseite und Höhe gleich bleiben. Darum zählt nur die Höhe, nicht die schräge Seite.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_fig').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Trapezförmiges Beet', q: 'Ein Beet hat die Form eines Trapezes. Die parallelen Seiten sind 6 m und 4 m lang, ihr Abstand beträgt 2,5 m. Eine Seitenkante ist schräg und 2,7 m lang. Wie groß ist das Beet?' + trapFig(6, 4, 2.5, 1, { e: 'm', s: 2.7 }).svg,
      steps: ['Figur erkennen: Trapez mit a = 6 m, c = 4 m. Die Höhe ist der Abstand der parallelen Seiten: h = 2,5 m.', 'Die schräge Seite 2,7 m ist keine Höhe. Sie wird nicht gebraucht.', 'Mittelwert der parallelen Seiten: (6 m + 4 m) : 2 = 5 m.', 'A = 5 m · 2,5 m = 12,5 m².', 'Antwort: Das Beet ist 12,5 m² groß. Kontrolle: Es liegt zwischen den Rechtecken 4 m · 2,5 m = 10 m² und 6 m · 2,5 m = 15 m².'] },
    tasks: { gen: gen, plan: { G: ['rechnung:1', 'para:1', 'dreieck:1', 'trapez:1'], S: ['para:2', 'dreieck:2', 'trapez:2', 'umkehr:1', 'einheit:2'], E: ['para:3', 'dreieck:3', 'trapez:2', 'umkehr:2', 'trapez_c:3', 'sach:2'] },
      extra: 'drachen', test: ['rechnung:1', 'para:2', 'dreieck:2', 'trapez:2', 'umkehr:2', 'sach:2'] },
    lerncheck: ['Ich kann erklären, wie man aus einem Parallelogramm ein Rechteck macht.', 'Ich finde die Höhe und verwechsle sie nicht mit der schrägen Seite.', 'Ich berechne Flächeninhalte von Parallelogramm, Dreieck und Trapez.', 'Ich berechne eine fehlende Höhe oder Seite und achte auf die Einheiten.']
  };
})();
