/* Modul 017 (Klasse 9) · Quadratische Funktionen im Alltag */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  /* ---------- Parabel-Zeichnung (gemeinsam für 015, 016, 017) ----------
     curves: [{ f: function (x), color, label, from, to, dash, vertex: [x, y], zeros: [x, …], vText, zText: [Text, …] }]
     o: x/y [min, max], gx/gy Raster, ph feste Zeichenhöhe, lx/ly Beschriftungsschritt, w Breite, maxh, tx/ty Achsennamen, marks [{x, y, text, color, dx, dy, anchor}], hline {y, text}, maxw, label */
  function r1(v) { return Math.round(v * 10) / 10; }
  function pgraph(curves, o) {
    o = o || {};
    var xr = o.x || [-6, 6], yr = o.y || [-6, 6], gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || 2 * gx, ly = o.ly || 2 * gy;
    var xl = xr[0] - gx / 2, xh = xr[1] + gx / 2, yl = yr[0] - gy / 2, yh = yr[1] + gy / 2;
    var PW = o.w || 300, PH = PW * (yh - yl) / (xh - xl) * (gx / gy);
    PH = o.ph || Math.min(PH, o.maxh || 360);
    var ux = PW / (xh - xl), uy = PH / (yh - yl);
    var mL = xr[0] >= 0 ? 32 : 8, mB = yr[0] >= 0 ? 22 : 8, mT = 8, mR = 10, W = mL + PW + mR, H = mT + PH + mB;
    function X(x) { return r1(mL + (x - xl) * ux); } function Y(y) { return r1(mT + (yh - y) * uy); }
    var ax = xr[0] <= 0 && xr[1] >= 0 ? 0 : xr[0], ay = yr[0] <= 0 && yr[1] >= 0 ? 0 : yr[0], i;
    var halo = ' paint-order="stroke" stroke="#fff" stroke-width="4" stroke-linejoin="round"';
    var g = '<svg class="viz" viewBox="0 0 ' + r1(W) + ' ' + r1(H) + '" role="img" aria-label="' + (o.label || 'Parabel im Koordinatensystem') + '" style="max-width:' + (o.maxw || 360) + 'px">';
    for (i = Math.ceil(xr[0] / gx) * gx; i <= xr[1] + 1e-9; i += gx) g += '<line x1="' + X(i) + '" y1="' + Y(yl) + '" x2="' + X(i) + '" y2="' + Y(yh) + '" stroke="#dbe4f5"/>';
    for (i = Math.ceil(yr[0] / gy) * gy; i <= yr[1] + 1e-9; i += gy) g += '<line x1="' + X(xl) + '" y1="' + Y(i) + '" x2="' + X(xh) + '" y2="' + Y(i) + '" stroke="#dbe4f5"/>';
    g += '<line x1="' + X(xl) + '" y1="' + Y(ay) + '" x2="' + X(xh) + '" y2="' + Y(ay) + '" stroke="#1c1830" stroke-width="1.6"/><line x1="' + X(ax) + '" y1="' + Y(yl) + '" x2="' + X(ax) + '" y2="' + Y(yh) + '" stroke="#1c1830" stroke-width="1.6"/>';
    var inner = ax === 0 && ay === 0 && xr[0] < 0 && yr[0] < 0;
    for (i = Math.ceil(xr[0] / lx) * lx; i <= xr[1] + 1e-9; i += lx) { var vi = Math.round(i * 1000) / 1000; if (vi === 0 && inner) continue; g += '<text x="' + X(vi) + '" y="' + r1(Y(ay) + 14) + '" font-size="10" text-anchor="middle" fill="#475569">' + M.fmtNum(vi) + '</text>'; }
    for (i = Math.ceil(yr[0] / ly) * ly; i <= yr[1] + 1e-9; i += ly) { var wi = Math.round(i * 1000) / 1000; if (wi === 0 && (inner || ax === xr[0])) continue; g += '<text x="' + r1(X(ax) - 5) + '" y="' + r1(Y(wi) + 4) + '" font-size="10" text-anchor="end" fill="#475569">' + M.fmtNum(wi) + '</text>'; }
    g += '<text x="' + r1(X(xh) - 3) + '" y="' + r1(Y(ay) - 6) + '" font-size="12" font-weight="700" text-anchor="end">' + (o.tx || 'x') + '</text><text x="' + r1(X(ax) + 6) + '" y="' + r1(Y(yh) + 12) + '" font-size="12" font-weight="700">' + (o.ty || 'y') + '</text>';
    if (o.hline) g += '<line x1="' + X(xl) + '" y1="' + Y(o.hline.y) + '" x2="' + X(xh) + '" y2="' + Y(o.hline.y) + '" stroke="#0f766e" stroke-width="2" stroke-dasharray="6 4"/>' + (o.hline.text ? '<text x="' + r1(X(xh) - 4) + '" y="' + r1(Y(o.hline.y) - 6) + '" font-size="12" font-weight="700" fill="#0f766e" text-anchor="end"' + halo + '>' + o.hline.text + '</text>' : '');
    var top = '';
    curves.forEach(function (C, idx) {
      var col = C.color || ['#1e3a8a', '#0f766e', '#d97706'][idx % 3], a = Math.max(xl, C.from != null ? C.from : xl), z = Math.min(xh, C.to != null ? C.to : xh);
      var N = 220, segs = [], cur = [], prev = null;
      function cut(p, q) { var yb = (q[1] > yh || p[1] > yh) ? yh : yl, t = (yb - p[1]) / (q[1] - p[1]); return [p[0] + t * (q[0] - p[0]), yb]; }
      for (var k = 0; k <= N; k++) {
        var xx = a + (z - a) * k / N, yy = C.f(xx), pnt = [xx, yy], ins = isFinite(yy) && yy >= yl && yy <= yh;
        if (ins) { if (prev && !prev.ins && isFinite(prev.p[1])) cur.push(cut(prev.p, pnt)); cur.push(pnt); }
        else if (prev && prev.ins && isFinite(yy)) { cur.push(cut(prev.p, pnt)); segs.push(cur); cur = []; }
        prev = { p: pnt, ins: ins };
      }
      if (cur.length) segs.push(cur);
      segs.forEach(function (s) { if (s.length > 1) g += '<polyline points="' + s.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"' + (C.dash ? ' stroke-dasharray="7 5"' : '') + '/>'; });
      var up = C.f(C.vertex ? C.vertex[0] + 1 : 1) > C.f(C.vertex ? C.vertex[0] : 0);
      if (C.label) {
        var lxp = Math.min(z, xh) - 0.2 * gx, lyp = C.f(lxp);
        if (lyp > yh || lyp < yl) { var last = segs.length ? segs[segs.length - 1] : null; if (last) { var e = last[last.length - 1]; lxp = e[0]; lyp = e[1]; } }
        top += '<text x="' + r1(Math.min(X(lxp) - 6, W - 4)) + '" y="' + r1(Math.max(14, Math.min(H - 4, Y(lyp) + (up ? 4 : -6)))) + '" font-size="13" font-weight="700" fill="' + col + '" text-anchor="end"' + halo + '>' + C.label + '</text>';
      }
      var zs = (C.zeros || []).slice().sort(function (p, q) { return p - q; }), zly = Y(0) + (up ? 30 : -10);
      if (C.vertex && C.vertex[1] >= yl && C.vertex[1] <= yh && C.vertex[0] >= xl && C.vertex[0] <= xh) {
        var vx = X(C.vertex[0]), vy = Y(C.vertex[1]), dy = up ? 19 : -10;
        if (zs.length && Math.abs(vy + dy - zly) < 15) dy = up ? zly + 16 - vy : zly - 16 - vy;
        if (vy + dy > H - 4) dy = -10; if (vy + dy < 12) dy = 19;
        var anc = vx < W * 0.25 ? 'start' : vx > W * 0.75 ? 'end' : 'middle';
        top += '<circle cx="' + vx + '" cy="' + vy + '" r="5" fill="#d97706" stroke="#fff" stroke-width="1.5"/>';
        if (C.vText !== '') top += '<text x="' + vx + '" y="' + r1(vy + dy) + '" font-size="12" font-weight="700" fill="#b45309" text-anchor="' + anc + '"' + halo + '>' + (C.vText || 'S') + '</text>';
      }
      zs.forEach(function (zx, j) {
        if (zx < xl || zx > xh) return;
        var px = X(zx), two = zs.length === 2;
        top += '<circle cx="' + px + '" cy="' + Y(0) + '" r="5" fill="#1d4ed8" stroke="#fff" stroke-width="1.5"/>';
        var t = C.zText ? C.zText[j] : (two ? 'N' + (j + 1) : 'N');
        if (!t) return;
        var tw = String(t).replace(/<[^>]+>/g, '').length * 6.6, tx = px + (two ? (j === 0 ? -7 : 7) : 0), anc = two ? (j === 0 ? 'end' : 'start') : 'middle';
        if (anc === 'end' && tx - tw < 2) tx = 2 + tw; if (anc === 'start' && tx + tw > W - 2) tx = W - 2 - tw; if (anc === 'middle') tx = Math.max(2 + tw / 2, Math.min(W - 2 - tw / 2, tx));
        top += '<text x="' + r1(tx) + '" y="' + r1(zly) + '" font-size="12" font-weight="700" fill="#1d4ed8" text-anchor="' + anc + '"' + halo + '>' + t + '</text>';
      });
    });
    (o.marks || []).forEach(function (mk) {
      var c = mk.color || '#1c1830';
      top += '<circle cx="' + X(mk.x) + '" cy="' + Y(mk.y) + '" r="5" fill="' + c + '" stroke="#fff" stroke-width="1.5"/>';
      if (mk.text) top += '<text x="' + r1(X(mk.x) + (mk.dx != null ? mk.dx : 8)) + '" y="' + r1(Y(mk.y) + (mk.dy != null ? mk.dy : -8)) + '" font-size="12" font-weight="700" fill="' + c + '"' + (mk.anchor ? ' text-anchor="' + mk.anchor + '"' : '') + halo + '>' + mk.text + '</text>';
    });
    return g + top + '</svg>';
  }

  /* ---------- Zahlen und Terme ---------- */
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function par(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }
  function r2(x) { return Math.round(x * 100) / 100; }
  function sq(s) { return '√<span style="border-top:1.5px solid currentColor;padding:0 2px">' + s + '</span>'; }
  function half(s) { return '<span class="frac"><span>' + s + '</span><span>2</span></span>'; }
  function poly(cs, v) {
    var s = '', first = true;
    cs.forEach(function (p) {
      var c = p[0]; if (Math.abs(c) < 1e-12) return;
      var a = Math.abs(c), core = p[1] ? ((Math.abs(a - 1) < 1e-12 ? '' : n(a)) + p[1]) : n(a);
      s += (c < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + core; first = false;
    });
    return s || '0';
  }
  function inner(h, q) { return n(h * h) + (q === 0 ? '' : q < 0 ? ' + ' + n(-q) : ' − ' + n(q)); }
  /* Wurf h(t) = −5t² + v·t + h0 */
  function wurfTerm(v, h0) { return poly([[-5, 't²'], [v, 't'], [h0, '']]); }
  function hw(v, h0, t) { return -5 * t * t + v * t + h0; }
  function niceStep(span) { return span <= 6 ? 1 : span <= 12 ? 2 : span <= 30 ? 5 : span <= 60 ? 10 : 20; }
  function wurfGraph(v, h0, o) {
    o = o || {}; var T = v / 10 + Math.sqrt(v * v / 100 + h0 / 5), Hm = h0 + v * v / 20, X1 = Math.ceil(T), gy = niceStep(Hm), Y1 = Math.ceil((Hm + 0.5 * gy) / gy) * gy;
    return pgraph([{ f: function (t) { return hw(v, h0, t); }, from: 0, to: T, vertex: o.marks ? [v / 10, Hm] : null, vText: o.marks ? 'S(' + n(v / 10) + ' | ' + n(Hm) + ')' : '', zeros: o.marks ? [T] : [], zText: o.marks ? ['t ≈ ' + n(r2(T))] : [''] }],
      { x: [0, X1], y: [0, Y1], gx: X1 > 6 ? 1 : 0.5, gy: gy, lx: 1, ly: gy, tx: 't', ty: 'h', ph: 210, maxw: 380, label: 'Flugbahn h(t)', marks: h0 > 0 && o.marks ? [{ x: 0, y: h0, color: '#0f766e', text: 'Abwurf', dx: 8, dy: 16 }] : [] });
  }
  var BR = [[10, [4, 5, 6, 8, 10, 12]], [20, [4, 8, 10, 12, 16, 20]], [25, [5, 10, 15, 20]], [40, [8, 16, 24, 32]], [50, [10, 20, 25]]];
  function bridgeGraph(w, h, o) {
    o = o || {}; var a = h / (w * w), gx = w <= 10 ? 2 : w <= 25 ? 5 : 10, gy = h <= 6 ? 1 : h <= 12 ? 2 : 5;
    return pgraph([{ f: function (x) { return h - a * x * x; }, from: -w, to: w, vertex: o.marks ? [0, h] : null, vText: o.vText || '', zeros: o.marks ? [-w, w] : [], zText: o.zText || ['', ''] }],
      { x: [-w - gx, w + gx], y: [0, Math.ceil((h + gy) / gy) * gy], gx: gx, gy: gy, lx: w >= 40 ? 2 * gx : gx, ly: gy, tx: 'x', ty: 'y', ph: 150, maxw: 420, label: 'Brückenbogen', hline: o.hline, marks: o.pts || [] });
  }
  /* Rechteck mit fester Zaunlänge */
  function areaGraph(U, wall, xs) {
    var top = wall ? U / 2 : U / 2, A = function (x) { return wall ? x * (U - 2 * x) : x * (U / 2 - x); }, Am = wall ? U * U / 8 : U * U / 16;
    var gx = niceStep(top), gy = niceStep(Am) * (Am > 60 ? 2 : 1);
    return pgraph([{ f: A, from: 0, to: top, vertex: [U / 4, Am], vText: 'S(' + n(U / 4) + ' | ' + n(Am) + ')', zeros: [0, top], zText: ['', ''] }],
      { x: [0, Math.ceil(top / gx) * gx], y: [0, Math.ceil((Am + gy) / gy) * gy], gx: gx, gy: gy, lx: gx, ly: gy, tx: 'x', ty: 'A', ph: 200, maxw: 380, label: 'Flächeninhalt A(x)', marks: xs || [] });
  }
  function rectSvg(wd, ht) {
    var S = 200 / Math.max(wd, ht, 1), W = wd * S, H = ht * S;
    return '<svg class="viz" viewBox="0 0 ' + (W + 80).toFixed(1) + ' ' + (H + 50).toFixed(1) + '" style="max-width:' + Math.round(W + 80) + 'px" role="img" aria-label="Rechteck">' +
      '<rect x="30" y="12" width="' + W.toFixed(1) + '" height="' + H.toFixed(1) + '" fill="#e8eefc" stroke="#1e3a8a" stroke-width="3"/>' +
      '<text x="' + (30 + W / 2).toFixed(1) + '" y="' + (H + 34).toFixed(1) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1e3a8a">' + n(wd) + ' m</text>' +
      '<text x="' + (36 + W).toFixed(1) + '" y="' + (12 + H / 2 + 4).toFixed(1) + '" font-size="13" font-weight="700" fill="#1e3a8a">' + n(ht) + ' m</text></svg>';
  }

  var gen = {
    wurf_hoehe: function () {
      var v = M.pick([10, 12, 14, 15, 16, 18, 20]), h0 = M.pick([0, 1, 1.5, 2]), T = v / 10 + Math.sqrt(v * v / 100 + h0 / 5);
      var t = M.pick([0.5, 1, 1.5, 2]); if (t >= T) t = 0.5; var y = hw(v, h0, t);
      return { skill: 'Wurfhöhe berechnen', level: 1, q: 'Ein Ball wird ' + (h0 ? 'aus ' + n(h0) + ' m Höhe ' : 'vom Boden aus ') + 'nach oben geworfen. Seine Höhe in Metern nach t Sekunden ist <span class="big-math">h(t) = ' + wurfTerm(v, h0) + '</span><br>In welcher Höhe ist der Ball nach <b>' + n(t) + ' s</b>?',
        inputs: [{ kind: 'num', answer: y, tol: 0.01, label: 'h(' + n(t) + ') =', unit: 'm' }],
        hints: ['Setze t = ' + n(t) + ' in den Term ein.', 'Zuerst das Quadrat: ' + par(t) + '² = ' + n(t * t) + '. Dann −5 · ' + n(t * t) + ' = ' + n(-5 * t * t) + '.', 'h(' + n(t) + ') = ' + n(-5 * t * t) + ' + ' + n(v * t) + (h0 ? ' + ' + n(h0) : '') + '.'],
        solution: 'h(' + n(t) + ') = −5 · ' + n(t) + '² + ' + v + ' · ' + n(t) + (h0 ? ' + ' + n(h0) : '') + ' = ' + n(-5 * t * t) + ' + ' + n(v * t) + (h0 ? ' + ' + n(h0) : '') + ' = <b>' + n(y) + ' m</b>.' + wurfGraph(v, h0, { marks: false }),
        mistakes: function (vv) { var a = M.parseNum(vv[0]); if (a === null) return null; if (Math.abs(a - (5 * t * t + v * t + h0)) < 0.01) return 'Achte auf das Vorzeichen: −5 · ' + n(t * t) + ' ist negativ.'; if (Math.abs(a - (-10 * t + v * t + h0)) < 0.01) return 'Quadriere zuerst: t² = ' + n(t) + ' · ' + n(t) + ', nicht ' + n(t) + ' · 2.'; return null; },
        verify: function () { return Math.abs(y - (v * t - 5 * t * t + h0)) < 1e-9 && y > 0 || 'Höhe falsch'; } };
    },
    wurf_max: function (lvl) {
      var v = M.pick([10, 12, 14, 15, 16, 18, 20, 24, 25]), h0 = lvl === 1 ? 0 : M.pick([0, 1, 1.5, 2, 2.5]), ts = v / 10, Hm = h0 + v * v / 20;
      return { skill: 'Maximale Höhe (Scheitelpunkt)', q: 'Die Höhe eines geworfenen Balls in Metern nach t Sekunden ist <span class="big-math">h(t) = ' + wurfTerm(v, h0) + '</span><br>Nach wie vielen Sekunden erreicht der Ball seine größte Höhe, und wie hoch ist er dann?',
        inputs: [{ kind: 'num', answer: ts, tol: 0.01, label: 'Zeitpunkt t =', unit: 's' }, { kind: 'num', answer: Hm, tol: 0.01, label: 'größte Höhe', unit: 'm' }],
        hints: ['Die größte Höhe ist der Scheitelpunkt der Parabel. Er liegt genau in der Mitte zwischen zwei Zeitpunkten mit gleicher Höhe.', 'Die Starthöhe ' + n(h0) + ' m hat der Ball bei t = 0 und noch einmal, wenn −5t² + ' + v + 't = 0 ist, also t(' + v + ' − 5t) = 0, bei t = ' + n(v / 5) + '.', 'Die Mitte ist t = ' + n(v / 5) + ' : 2 = ' + n(ts) + '. Setze diesen Wert in h(t) ein.'],
        solution: 'h(t) = ' + n(h0) + ' gilt für t = 0 und t = ' + n(v / 5) + ' (denn −5t² + ' + v + 't = t · (' + v + ' − 5t)). Der Scheitelpunkt liegt in der Mitte: t = <b>' + n(ts) + ' s</b>.<br>h(' + n(ts) + ') = −5 · ' + n(ts * ts) + ' + ' + v + ' · ' + n(ts) + (h0 ? ' + ' + n(h0) : '') + ' = ' + n(-5 * ts * ts) + ' + ' + n(v * ts) + (h0 ? ' + ' + n(h0) : '') + ' = <b>' + n(Hm) + ' m</b>.' + wurfGraph(v, h0, { marks: true }),
        mistakes: function (vv) { var a = M.parseNum(vv[0]), b = M.parseNum(vv[1]); if (a !== null && Math.abs(a - v / 5) < 0.01) return 'Bei t = ' + n(v / 5) + ' ist der Ball wieder auf der Starthöhe. Der höchste Punkt liegt in der Mitte.'; if (b !== null && Math.abs(b - v) < 0.01) return 'Die größte Höhe erhältst du, indem du den Zeitpunkt in h(t) einsetzt.'; return null; },
        verify: function () { var mx = -1e9; for (var k = 0; k <= 5000; k++) { var t = k * v / 5 / 5000; mx = Math.max(mx, hw(v, h0, t)); } return Math.abs(mx - Hm) < 1e-6 && Math.abs(hw(v, h0, ts) - Hm) < 1e-9 || 'Scheitel falsch'; } };
    },
    wurf_aufprall: function (lvl) {
      var v, h0;
      if (lvl <= 2) { v = M.pick([8, 10, 12, 14, 15, 16]); h0 = M.pick([1, 1.5, 2]); }
      else { v = M.pick([5, 8, 10, 12, 15]); h0 = M.pick([10, 15, 20, 25, 30]); }
      var P = -v / 5, Q = -h0 / 5, h = P / 2, D = h * h - Q, T = -h + Math.sqrt(D), Tn = -h - Math.sqrt(D), ans = r2(T);
      return { skill: 'Aufprallzeit (Nullstelle)', q: (lvl <= 2 ? 'Beim Basketball wird der Ball aus ' + n(h0) + ' m Höhe geworfen.' : 'Ein Stein wird von einem ' + n(h0) + ' m hohen Turm schräg nach oben geworfen.') + ' Die Höhe in Metern nach t Sekunden ist <span class="big-math">h(t) = ' + wurfTerm(v, h0) + '</span><br>Nach wie vielen Sekunden trifft er auf dem Boden auf? Runde auf zwei Stellen nach dem Komma.',
        inputs: [{ kind: 'num', answer: ans, tol: 0.01, label: 'Aufprall nach t ≈', unit: 's' }],
        hints: ['Auf dem Boden ist die Höhe 0. Löse also ' + wurfTerm(v, h0) + ' = 0.', 'Teile durch −5, damit vor t² eine 1 steht: ' + poly([[1, 't²'], [P, 't'], [Q, '']]) + ' = 0. Also p = ' + n(P) + ' und q = ' + n(Q) + '.', 't<sub>1,2</sub> = ' + n(-h) + ' ± ' + sq(inner(h, Q)) + ' = ' + n(-h) + ' ± ' + sq(n(D)) + '. Nur die positive Lösung passt.'],
        solution: wurfTerm(v, h0) + ' = 0 &nbsp;| : (−5)<br>' + poly([[1, 't²'], [P, 't'], [Q, '']]) + ' = 0<br>t<sub>1,2</sub> = ' + n(-h) + ' ± ' + sq(par(h) + '² − ' + par(Q)) + ' = ' + n(-h) + ' ± ' + sq(n(D)) + '<br>t<sub>1</sub> ≈ ' + n(r2(Tn)) + ' (negativ, passt nicht) und t<sub>2</sub> ≈ <b>' + n(ans) + ' s</b>.' + wurfGraph(v, h0, { marks: true }),
        mistakes: function (vv) { var a = M.parseNum(vv[0]); if (a === null) return null; if (Math.abs(a - r2(Tn)) < 0.011) return 'Das ist die negative Lösung. Eine Zeit vor dem Abwurf passt nicht zur Aufgabe.'; if (Math.abs(a - v / 10) < 0.011) return 'Das ist der Zeitpunkt der größten Höhe. Gesucht ist, wann h(t) = 0 ist.'; if (Math.abs(a - v / 5) < 0.011) return 'Nach ' + n(v / 5) + ' s ist der Ball wieder auf Abwurfhöhe, aber noch nicht am Boden.'; return null; },
        verify: function () { return Math.abs(hw(v, h0, T)) < 1e-9 && T > v / 5 && Tn < 0 || 'Aufprall falsch'; } };
    },
    bruecke: function (lvl) {
      var B = M.pick(BR), w = B[0], h = M.pick(B[1]), a = h / (w * w), A = n(a);
      var eqs = 'y = −' + A + 'x² + ' + n(h);
      var intro = 'Der Bogen einer Brücke hat die Form einer Parabel mit der Gleichung <span class="big-math">' + eqs + '</span> (x und y in Metern, die x-Achse ist die Straße, der höchste Punkt liegt über x = 0).';
      if (lvl === 1) {
        var k = M.rnd(1, 4), x0 = k * w / 5, y = h - a * x0 * x0;
        return { skill: 'Höhe eines Brückenbogens', q: intro + bridgeGraph(w, h) + 'Wie hoch ist der Bogen <b>' + n(x0) + ' m</b> neben der Mitte?',
          inputs: [{ kind: 'num', answer: r2(y), tol: 0.01, label: 'Höhe', unit: 'm' }],
          hints: ['Setze x = ' + n(x0) + ' in die Gleichung ein.', 'x² = ' + n(x0) + '² = ' + n(x0 * x0) + '. Dann ' + A + ' · ' + n(x0 * x0) + ' = ' + n(a * x0 * x0) + '.', 'y = −' + n(a * x0 * x0) + ' + ' + n(h) + '.'],
          solution: 'y = −' + A + ' · ' + n(x0) + '² + ' + n(h) + ' = −' + A + ' · ' + n(x0 * x0) + ' + ' + n(h) + ' = −' + n(a * x0 * x0) + ' + ' + n(h) + ' = <b>' + n(r2(y)) + ' m</b>.' + bridgeGraph(w, h, { pts: [{ x: x0, y: y, color: '#d97706', text: n(r2(y)) + ' m', dx: 8, dy: -6 }] }),
          mistakes: function (v) { var b = M.parseNum(v[0]); if (b !== null && Math.abs(b - (h - a * x0)) < 0.011) return 'Du hast x nicht quadriert. Rechne zuerst x² = ' + n(x0 * x0) + '.'; if (b !== null && Math.abs(b - (h + a * x0 * x0)) < 0.011) return 'Vor dem x² steht ein Minus. Der Bogen wird zur Seite hin niedriger.'; return null; },
          verify: function () { return Math.abs(y - h * (1 - k * k / 25)) < 1e-9 || 'Höhe falsch'; } };
      }
      if (lvl === 2) {
        return { skill: 'Spannweite eines Brückenbogens', q: intro + bridgeGraph(w, h) + 'Wie breit ist der Bogen auf Höhe der Straße (Spannweite)?',
          inputs: [{ kind: 'num', answer: 2 * w, tol: 0.01, label: 'Spannweite', unit: 'm' }],
          hints: ['An den Fußpunkten ist die Höhe 0. Löse −' + A + 'x² + ' + n(h) + ' = 0.', A + 'x² = ' + n(h) + ' ⇒ x² = ' + n(h) + ' : ' + A + ' = ' + n(w * w) + '.', 'x = ±' + sq(n(w * w)) + ' = ±' + w + '. Die Spannweite ist der Abstand der beiden Fußpunkte.'],
          solution: '−' + A + 'x² + ' + n(h) + ' = 0 ⇒ x² = ' + n(h) + ' : ' + A + ' = ' + n(w * w) + ' ⇒ x<sub>1</sub> = −' + w + ', x<sub>2</sub> = ' + w + '. Spannweite: ' + w + ' − (−' + w + ') = <b>' + 2 * w + ' m</b>.' + bridgeGraph(w, h, { marks: true, zText: ['−' + w, String(w)] }),
          mistakes: function (v) { var b = M.parseNum(v[0]); if (b === w) return 'Das ist nur der Abstand von der Mitte bis zu einem Fußpunkt. Die Spannweite reicht von −' + w + ' bis ' + w + '.'; return null; },
          verify: function () { return Math.abs(h - a * w * w) < 1e-9 || 'Fußpunkt falsch'; } };
      }
      var H1 = Math.max(1, Math.round(h * M.pick([0.4, 0.5, 0.6, 0.7]) * 2) / 2), xx = Math.sqrt((h - H1) / a), ans = r2(2 * xx);
      return { skill: 'Durchfahrtsbreite unter einem Bogen', level: 3, q: intro + bridgeGraph(w, h) + 'Unter dem Bogen soll ein <b>' + n(H1) + ' m</b> hohes Fahrzeug durchfahren. Wie breit ist der Bereich, in dem der Bogen mindestens ' + n(H1) + ' m hoch ist? Runde auf zwei Stellen.',
        inputs: [{ kind: 'num', answer: ans, tol: 0.02, label: 'Breite', unit: 'm' }],
        hints: ['Gesucht sind die Stellen, an denen der Bogen genau ' + n(H1) + ' m hoch ist: −' + A + 'x² + ' + n(h) + ' = ' + n(H1) + '.', A + 'x² = ' + n(h - H1) + ' ⇒ x² = ' + n(h - H1) + ' : ' + A + ' = ' + n(r2((h - H1) / a)) + '.', 'x = ±' + sq(n(r2((h - H1) / a))) + ' ≈ ±' + n(r2(xx)) + '. Die Breite ist der Abstand der beiden Stellen.'],
        solution: '−' + A + 'x² + ' + n(h) + ' = ' + n(H1) + ' ⇒ x² = ' + n(h - H1) + ' : ' + A + ' = ' + n(r2((h - H1) / a)) + ' ⇒ x ≈ ±' + n(r2(xx)) + '. Breite: 2 · ' + n(r2(xx)) + ' ≈ <b>' + n(ans) + ' m</b>.' + bridgeGraph(w, h, { hline: { y: H1, text: n(H1) + ' m' }, pts: [{ x: -xx, y: H1, color: '#d97706' }, { x: xx, y: H1, color: '#d97706' }] }),
        mistakes: function (v) { var b = M.parseNum(v[0]); if (b !== null && Math.abs(b - r2(xx)) < 0.02) return 'Das ist nur der Abstand von der Mitte. Der Bereich reicht nach links und nach rechts.'; if (b !== null && Math.abs(b - 2 * w) < 0.02) return 'Das ist die Spannweite am Boden. Gesucht ist die Breite in ' + n(H1) + ' m Höhe.'; return null; },
        verify: function () { return Math.abs(h - a * xx * xx - H1) < 1e-9 && xx < w || 'Breite falsch'; } };
    },
    rechteck: function (lvl) {
      var wall = lvl === 3, U = 4 * M.rnd(wall ? 4 : 5, 15), x = U / 4, y = wall ? U / 2 : U / 4, Am = x * y;
      var txt = wall ? 'Für ein rechteckiges Hühnergehege stehen <b>' + U + ' m</b> Zaun zur Verfügung. Eine Seite wird von einer Hauswand gebildet und braucht keinen Zaun. Die beiden Seiten, die von der Wand weggehen, sind x Meter lang.' : 'Mit <b>' + U + ' m</b> Zaun soll eine rechteckige Weide eingezäunt werden. Eine Seite ist x Meter lang.';
      var term = wall ? 'A(x) = x · (' + U + ' − 2x) = −2x² + ' + U + 'x' : 'A(x) = x · (' + U / 2 + ' − x) = −x² + ' + U / 2 + 'x';
      return { skill: 'Größte Fläche bei festem Umfang', q: txt + ' Wie lang muss x sein, damit die Fläche möglichst groß wird? Wie groß ist sie dann?',
        inputs: [{ kind: 'num', answer: x, tol: 0.01, label: 'x =', unit: 'm' }, { kind: 'num', answer: Am, tol: 0.01, label: 'größte Fläche', unit: 'm²' }],
        hints: [wall ? 'Der Zaun bildet zwei Seiten der Länge x und eine Seite der Länge ' + U + ' − 2x.' : 'Zwei Seiten zusammen sind halb so lang wie der Zaun: ' + U / 2 + ' m. Ist eine Seite x, ist die andere ' + U / 2 + ' − x.', 'Flächeninhalt: ' + term + '. Das ist eine nach unten geöffnete Parabel.', 'A(x) = 0 gilt für x = 0 und x = ' + n(U / 2) + '. Der Scheitelpunkt liegt genau in der Mitte, bei x = ' + n(x) + '.'],
        solution: term + '.<br>Nullstellen: x = 0 und x = ' + n(U / 2) + '. Der Scheitelpunkt liegt in der Mitte: <b>x = ' + n(x) + ' m</b>.<br>Die andere Seite ist ' + (wall ? U + ' − 2 · ' + n(x) : n(U / 2) + ' − ' + n(x)) + ' = ' + n(y) + ' m. Größte Fläche: ' + n(x) + ' · ' + n(y) + ' = <b>' + n(Am) + ' m²</b>.' + (wall ? '' : ' Das Rechteck ist ein Quadrat.') + areaGraph(U, wall),
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a !== null && Math.abs(a - U / 2) < 0.01) return 'Bei x = ' + n(U / 2) + ' ist die Fläche 0. Der größte Wert liegt in der Mitte zwischen den Nullstellen.'; if (b !== null && Math.abs(b - U * U / 4) < 0.01) return 'Prüfe die Seitenlängen: Beide Seiten zusammen ergeben nicht ' + U + ' m.'; if (wall && a !== null && Math.abs(a - U / 3) < 0.01) return 'Gleich lange Seiten sind hier nicht am besten, weil die Wand keinen Zaun braucht. Stelle A(x) auf.'; return null; },
        verify: function () { var best = 0, bx = 0; for (var k = 0; k <= 4000; k++) { var t = k * U / 2 / 4000, A = wall ? t * (U - 2 * t) : t * (U / 2 - t); if (A > best) { best = A; bx = t; } } return Math.abs(best - Am) < 1e-6 && Math.abs(bx - x) < 1e-6 || 'Optimum falsch'; } };
    },
    bremsweg: function (lvl) {
      var v = lvl === 1 ? 10 * M.rnd(3, 13) : 5 * M.rnd(5, 26), u = v / 10, R = 3 * u, B = u * u, kind = lvl === 1 ? 0 : M.pick([1, 1, 2]);
      var ask = ['den Bremsweg', 'den Anhalteweg', 'den Anhalteweg bei einer Gefahrenbremsung'][kind], ans = [B, R + B, R + B / 2][kind];
      return { skill: 'Bremsweg mit Faustformel', q: 'In der Fahrschule lernt man Faustformeln (v in km/h, Wege in Metern):<br>Reaktionsweg = <span class="frac"><span>v</span><span>10</span></span> · 3 &nbsp;&nbsp; Bremsweg = <span class="frac"><span>v</span><span>10</span></span> · <span class="frac"><span>v</span><span>10</span></span>' + (kind === 2 ? ' &nbsp;&nbsp; Bei einer Gefahrenbremsung halbiert sich der Bremsweg.' : '') + '<br>Anhalteweg = Reaktionsweg + Bremsweg<br>Berechne ' + ask + ' bei <b>' + v + ' km/h</b>.',
        inputs: [{ kind: 'num', answer: ans, tol: 0.01, label: ask.charAt(4).toUpperCase() + ask.slice(5), unit: 'm' }],
        hints: ['Teile die Geschwindigkeit durch 10: ' + v + ' : 10 = ' + n(u) + '.', 'Bremsweg = ' + n(u) + ' · ' + n(u) + ' = ' + n(B) + ' m' + (kind ? '. Reaktionsweg = ' + n(u) + ' · 3 = ' + n(R) + ' m.' : '.'), kind === 0 ? 'Der Bremsweg wächst quadratisch: doppelte Geschwindigkeit, vierfacher Bremsweg.' : kind === 1 ? 'Addiere Reaktionsweg und Bremsweg.' : 'Halbiere den Bremsweg: ' + n(B / 2) + ' m. Addiere dann den Reaktionsweg.'],
        solution: 'v : 10 = ' + n(u) + '. ' + (kind === 0 ? 'Bremsweg = ' + n(u) + ' · ' + n(u) + ' = <b>' + n(B) + ' m</b>.' : 'Reaktionsweg = ' + n(u) + ' · 3 = ' + n(R) + ' m. Bremsweg = ' + n(u) + ' · ' + n(u) + ' = ' + n(B) + ' m' + (kind === 2 ? ', bei Gefahrenbremsung ' + n(B / 2) + ' m' : '') + '. Anhalteweg = ' + n(R) + ' + ' + n(kind === 2 ? B / 2 : B) + ' = <b>' + n(ans) + ' m</b>.'),
        mistakes: function (vv) { var a = M.parseNum(vv[0]); if (a === null) return null; if (Math.abs(a - 2 * u) < 0.01) return 'Du hast v : 10 verdoppelt. Beim Bremsweg wird v : 10 mit sich selbst multipliziert.'; if (kind && Math.abs(a - B) < 0.01) return 'Das ist nur der Bremsweg. Zum Anhalteweg gehört auch der Reaktionsweg.'; if (kind && Math.abs(a - R) < 0.01) return 'Das ist nur der Reaktionsweg. Addiere den Bremsweg.'; if (kind === 2 && Math.abs(a - (R + B)) < 0.01) return 'Bei einer Gefahrenbremsung halbiert sich der Bremsweg.'; return null; },
        verify: function () { return Math.abs(B - v * v / 100) < 1e-9 && Math.abs([B, R + B, R + B / 2][kind] - ans) < 1e-9 || 'falsch'; } };
    },
    bremsfaktor: function () {
      var k = M.pick([2, 3, 4, 1.5]), v1 = M.pick([20, 30, 40]), v2 = k * v1, B1 = v1 * v1 / 100, B2 = v2 * v2 / 100;
      return { skill: 'Quadratisches Wachstum des Bremswegs', level: 2, q: 'Faustformel: Bremsweg = <span class="frac"><span>v</span><span>10</span></span> · <span class="frac"><span>v</span><span>10</span></span> (v in km/h, Bremsweg in m).<br>Ein Auto fährt erst ' + v1 + ' km/h, dann ' + n(v2) + ' km/h, also ' + n(k) + '-mal so schnell. Wie viel Mal so lang ist dann der Bremsweg?',
        inputs: [{ kind: 'num', answer: k * k, tol: 0.01, label: 'Der Bremsweg ist … -mal so lang' }],
        hints: ['Berechne beide Bremswege: bei ' + v1 + ' km/h und bei ' + n(v2) + ' km/h.', 'Bremsweg bei ' + v1 + ' km/h: ' + n(v1 / 10) + ' · ' + n(v1 / 10) + ' = ' + n(B1) + ' m. Bei ' + n(v2) + ' km/h: ' + n(v2 / 10) + ' · ' + n(v2 / 10) + ' = ' + n(B2) + ' m.', 'Teile: ' + n(B2) + ' : ' + n(B1) + '. Fällt dir etwas auf? Vergleiche mit ' + n(k) + '².'],
        solution: n(B2) + ' m : ' + n(B1) + ' m = <b>' + n(k * k) + '</b>. Der Bremsweg wächst quadratisch: Bei ' + n(k) + '-facher Geschwindigkeit ist er ' + n(k) + '² = ' + n(k * k) + '-mal so lang.',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && Math.abs(a - k) < 0.01) return 'Der Bremsweg wächst nicht im gleichen Maß wie die Geschwindigkeit. Rechne beide Bremswege aus und vergleiche.'; if (a !== null && Math.abs(a - 2 * k) < 0.01) return 'Nicht verdoppeln, sondern quadrieren: ' + n(k) + ' · ' + n(k) + '.'; return null; },
        verify: function () { return Math.abs(B2 / B1 - k * k) < 1e-9 || 'Faktor falsch'; } };
    },
    brunnen: function (lvl) {
      var d, e;
      do { d = M.rnd(1, 3); e = M.rnd(lvl === 3 ? 3 : 2, 9); } while (e <= d * d || (lvl < 3 && Math.sqrt(e) % 1 !== 0));
      var y0 = e - d * d, X = d + Math.sqrt(e), ans = r2(X);
      return { skill: 'Wasserstrahl in Scheitelpunktform', q: 'Ein Wasserstrahl eines Brunnens kommt bei x = 0 aus einer Düse. Seine Bahn ist die Parabel <span class="big-math">y = −(x − ' + d + ')² + ' + e + '</span> (x und y in Metern, y = 0 ist die Wasseroberfläche).<br>a) Wie hoch steigt der Strahl höchstens?<br>b) In welcher Entfernung von der Düse trifft er auf das Wasser?' + (lvl === 3 ? ' Runde auf zwei Stellen.' : ''),
        inputs: [{ kind: 'num', answer: e, label: 'a) größte Höhe', unit: 'm' }, { kind: 'num', answer: ans, tol: 0.01, label: 'b) Entfernung', unit: 'm' }],
        hints: ['Die Gleichung ist in Scheitelpunktform. Der Scheitelpunkt ist S(' + d + ' | ' + e + '). Die Parabel ist nach unten geöffnet.', 'b) Setze y = 0: −(x − ' + d + ')² + ' + e + ' = 0 ⇒ (x − ' + d + ')² = ' + e + '.', 'x − ' + d + ' = ±' + sq(e) + '. Die Lösung rechts von der Düse ist x = ' + d + ' + ' + sq(e) + '.'],
        solution: 'a) S(' + d + ' | ' + e + '): Die größte Höhe ist <b>' + e + ' m</b>.<br>b) (x − ' + d + ')² = ' + e + ' ⇒ x = ' + d + ' ± ' + sq(e) + '. Die Lösung ' + d + ' − ' + sq(e) + ' ' + (d - Math.sqrt(e) < 0 ? 'ist negativ und liegt hinter der Düse' : 'liegt vor der Düse') + '. Also x = ' + d + ' + ' + sq(e) + (Math.sqrt(e) % 1 ? ' ≈ ' : ' = ') + '<b>' + n(ans) + ' m</b>.' +
          pgraph([{ f: function (x) { return -(x - d) * (x - d) + e; }, from: 0, to: X, vertex: [d, e], vText: 'S(' + d + ' | ' + e + ')', zeros: [X], zText: [n(ans) + ' m'] }], { x: [0, Math.ceil(X)], y: [0, e + 1], tx: 'x', ty: 'y', ph: 190, maxw: 360, label: 'Wasserstrahl', marks: [{ x: 0, y: y0, color: '#0f766e', text: 'Düse', dx: 8, dy: 16 }] }),
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === d) return 'Das ist die x-Koordinate des Scheitelpunkts. Die Höhe ist die y-Koordinate.'; if (b !== null && Math.abs(b - Math.sqrt(e)) < 0.011) return 'Du hast ' + sq(e) + ' berechnet. Zähle noch ' + d + ' dazu, denn x − ' + d + ' = ' + sq(e) + '.'; if (b !== null && Math.abs(b - 2 * d) < 0.011) return 'Bei x = ' + 2 * d + ' ist der Strahl wieder auf Düsenhöhe, aber noch nicht im Wasser.'; return null; },
        verify: function () { return Math.abs(-(X - d) * (X - d) + e) < 1e-9 && y0 > 0 && X > 2 * d || 'Brunnen falsch'; } };
    },
    anhalteweg: function () {
      var u = M.rnd(3, 13), A = u * u + 3 * u, v = 10 * u, D = 2.25 + A;
      return { skill: 'Geschwindigkeit aus dem Anhalteweg', level: 3, q: 'Nach einem Unfall misst die Polizei einen Anhalteweg von <b>' + A + ' m</b>. Mit den Faustformeln gilt für die Geschwindigkeit v (in km/h):<br>Anhalteweg = <span class="frac"><span>v</span><span>10</span></span> · 3 + <span class="frac"><span>v</span><span>10</span></span> · <span class="frac"><span>v</span><span>10</span></span><br>Wie schnell ist das Auto gefahren? <small>Tipp: Setze u = <span class="frac"><span>v</span><span>10</span></span>.</small>',
        inputs: [{ kind: 'num', answer: v, label: 'v =', unit: 'km/h' }],
        hints: ['Mit u = v : 10 lautet die Gleichung u² + 3u = ' + A + ', also u² + 3u − ' + A + ' = 0.', 'p-q-Formel mit p = 3, q = −' + A + ': u = −1,5 ± ' + sq('2,25 + ' + A) + ' = −1,5 ± ' + sq(n(D)) + '.', sq(n(D)) + ' = ' + n(Math.sqrt(D)) + '. Nimm die positive Lösung für u und rechne v = 10 · u.'],
        solution: 'u² + 3u − ' + A + ' = 0 ⇒ u = −1,5 ± ' + sq('2,25 + ' + A) + ' = −1,5 ± ' + sq(n(D)) + ' = −1,5 ± ' + n(Math.sqrt(D)) + '. Positive Lösung: u = ' + u + '. Also v = 10 · ' + u + ' = <b>' + v + ' km/h</b>. Probe: ' + u + ' · 3 + ' + u + ' · ' + u + ' = ' + 3 * u + ' + ' + u * u + ' = ' + A + ' m ✓',
        mistakes: function (vv) { var a = M.parseNum(vv[0]); if (a === u) return 'Das ist u = v : 10. Gesucht ist v, also das Zehnfache.'; if (a !== null && Math.abs(a - 10 * Math.sqrt(A)) < 0.5) return 'Du hast den Reaktionsweg vergessen. Der Anhalteweg ist Reaktionsweg plus Bremsweg.'; return null; },
        verify: function () { return (v / 10) * 3 + (v / 10) * (v / 10) === A || 'Probe falsch'; } };
    }
  };

  return {
    id: '017', title: 'Quadratische Funktionen im Alltag', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Normalparabel und Scheitelpunktform, p-q-Formel (Modul 015)',
    lead: 'Brückenbögen, Wurfbahnen, Wasserstrahlen und Bremswege folgen Parabeln. Du nutzt Scheitelpunkt und Nullstellen, um echte Fragen zu beantworten.',
    einstieg: { html: '<p>Beim Basketball-Freiwurf fliegt der Ball in einem Bogen zum Korb. Ein Wasserstrahl im Brunnen beschreibt einen ähnlichen Bogen, ebenso viele Brücken.</p>' + wurfGraph(12, 2, { marks: true }) + '<p class="note">Welche Fragen kannst du an so eine Flugbahn stellen? Zum Beispiel: Wie hoch fliegt der Ball? Wann ist er am höchsten? Wann landet er?</p><p>Alle diese Bögen sind <b>Parabeln</b>. Die größte Höhe ist der <b>Scheitelpunkt</b>, der Aufprall ist eine <b>Nullstelle</b>. Mit diesem Wissen löst du in diesem Modul Aufgaben aus dem Alltag.</p>' },
    ziele: ['Ich berechne Werte einer quadratischen Funktion im Sachzusammenhang, zum Beispiel eine Höhe.', 'Ich deute den Scheitelpunkt als größte Höhe oder größte Fläche.', 'Ich deute Nullstellen als Aufprall, Fußpunkt oder Landepunkt und berechne sie.', 'Ich bestimme bei festem Umfang die größte Rechteckfläche.', 'Ich nutze die Faustformeln für Reaktionsweg, Bremsweg und Anhalteweg.'],
    fachwoerter: [['Scheitelpunkt', 'Höchster (oder tiefster) Punkt einer Parabel. Im Alltag zum Beispiel die größte Höhe.'], ['Nullstelle', 'Stelle mit y = 0. Im Alltag zum Beispiel der Aufprall auf dem Boden.'], ['Symmetrie', 'Eine Parabel ist symmetrisch zur senkrechten Geraden durch den Scheitelpunkt. Er liegt in der Mitte zwischen zwei Stellen mit gleicher Höhe.'], ['Anhalteweg', 'Weg vom Erkennen einer Gefahr bis zum Stillstand: Reaktionsweg plus Bremsweg.']],
    diagnose: [
      { q: 'Berechne −5 · 2² + 20 · 2.', options: ['20', '−60', '60', 'Weiß ich noch nicht'], answer: 0, why: '−5 · 4 + 40 = −20 + 40 = 20. Erst quadrieren, dann multiplizieren.', review: 'Terme mit Potenzen berechnen' },
      { q: 'Eine Parabel hat die Nullstellen x = 0 und x = 6. Bei welchem x liegt ihr Scheitelpunkt?', options: ['x = 3', 'x = 6', 'x = 0', 'Weiß ich noch nicht'], answer: 0, why: 'Der Scheitelpunkt liegt in der Mitte zwischen den Nullstellen: (0 + 6) : 2 = 3.', review: 'Symmetrie der Parabel' },
      { q: 'Welchen Scheitelpunkt hat y = −(x − 2)² + 5?', options: ['S(2 | 5)', 'S(−2 | 5)', 'S(5 | 2)', 'Weiß ich noch nicht'], answer: 0, why: 'Bei y = −(x − d)² + e ist S(d | e), hier S(2 | 5). Die Parabel ist nach unten geöffnet.', review: 'Scheitelpunktform' },
      { q: 'Ein Rechteck ist 7 m lang und 3 m breit. Wie groß ist sein Umfang?', options: ['20 m', '21 m', '10 m', 'Weiß ich noch nicht'], answer: 0, why: 'U = 2 · 7 + 2 · 3 = 20 m.', review: 'Umfang und Flächeninhalt von Rechtecken' }],
    erklaerung:
      '<h3>1. Werte berechnen</h3><p>Eine Funktion wie h(t) = −5t² + 12t + 2 beschreibt die Höhe eines Balls (in m) nach t Sekunden. Für die Höhe nach 1 s setzt du ein: h(1) = −5 · 1 + 12 + 2 = <b>9 m</b>. Achte darauf, zuerst zu quadrieren.</p>' +
      '<h3>2. Größte Höhe: der Scheitelpunkt</h3><p>Eine nach unten geöffnete Parabel hat ihren höchsten Punkt im Scheitelpunkt. Er liegt wegen der <b>Symmetrie</b> genau in der Mitte zwischen zwei Stellen mit gleicher Höhe.</p><p>Bei h(t) = −5t² + 12t + 2 hat der Ball die Höhe 2 m bei t = 0 und wieder, wenn −5t² + 12t = t · (12 − 5t) = 0 ist, also bei t = 2,4. Die Mitte ist t = 1,2. Größte Höhe: h(1,2) = −7,2 + 14,4 + 2 = <b>9,2 m</b>.</p>' +
      '<div class="merk"><b>Merke:</b> Scheitelpunkt = größter (oder kleinster) Wert. Er liegt in der Mitte zwischen zwei Stellen mit gleichem Funktionswert, zum Beispiel zwischen zwei Nullstellen.<br>Nullstelle = Stelle, an der der Wert 0 ist, zum Beispiel der Aufprall auf dem Boden.</div>' +
      '<h3>3. Aufprall: die Nullstelle</h3><p>Der Ball landet, wenn h(t) = 0 ist. Teile durch −5 und nutze die p-q-Formel:</p><p>−5t² + 12t + 2 = 0 &nbsp;| : (−5) ⇒ t² − 2,4t − 0,4 = 0 ⇒ t = 1,2 ± ' + sq('1,44 + 0,4') + ' = 1,2 ± ' + sq('1,84') + '. Nur die positive Lösung passt: t ≈ <b>2,56 s</b>.</p>' + wurfGraph(12, 2, { marks: true }) +
      '<h3>4. Größte Fläche bei festem Umfang</h3><p>Mit 20 m Zaun soll ein Rechteck eingezäunt werden. Ist eine Seite x, so ist die andere 10 − x. Fläche: A(x) = x · (10 − x). Sie ist 0 für x = 0 und x = 10, also ist sie am größten bei x = 5: A = 5 · 5 = <b>25 m²</b>. Das beste Rechteck ist ein Quadrat.</p>' +
      '<h3>5. Bremsweg</h3><p>Faustformel der Fahrschule: Bremsweg (in m) = (v : 10) · (v : 10). Bei 50 km/h sind das 5 · 5 = 25 m, bei 100 km/h schon 10 · 10 = 100 m. <b>Doppelte Geschwindigkeit heißt vierfacher Bremsweg.</b></p><p class="note">Runde erst am Ende und prüfe, ob das Ergebnis zur Sache passt: Negative Zeiten oder Längen sind keine Lösung.</p>',
    entdecken: {
      html: '<p>Ein rechteckiges Beet bekommt einen Zaun mit fester Länge. Wähle die Zaunlänge und verändere die Seite x. Wann ist die Fläche am größten?</p><div class="ctl"><label>Zaunlänge <select id="e_u"><option value="20">20 m</option><option value="24" selected>24 m</option><option value="28">28 m</option><option value="32">32 m</option></select></label><label>x = <b id="v_x"></b> m <input type="range" id="r_x" min="0.5" max="9.5" step="0.5" value="2"></label></div><div style="display:flex;flex-wrap:wrap;gap:12px;align-items:flex-start"><div id="e_r" style="flex:1 1 220px;max-width:300px"></div><div id="e_g" style="flex:1 1 280px;max-width:380px"></div></div><p id="e_t"></p>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var U = +root.querySelector('#e_u').value, x = +root.querySelector('#r_x').value, y = U / 2 - x, A = x * y;
          root.querySelector('#v_x').textContent = n(x);
          root.querySelector('#e_r').innerHTML = rectSvg(y, x);
          root.querySelector('#e_g').innerHTML = areaGraph(U, false, [{ x: x, y: A, color: '#d97706', text: n(A) + ' m²', dx: x > U / 4 ? -8 : 8, dy: 18, anchor: x > U / 4 ? 'end' : 'start' }]);
          root.querySelector('#e_t').innerHTML = 'Seiten: ' + n(x) + ' m und ' + U / 2 + ' − ' + n(x) + ' = ' + n(y) + ' m. Fläche A = ' + n(x) + ' · ' + n(y) + ' = <b>' + n(A) + ' m²</b>.' + (Math.abs(x - U / 4) < 1e-9 ? ' <b>Das ist das Maximum: ein Quadrat!</b>' : ' Das Maximum liegt bei x = ' + n(U / 4) + ' m.');
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Die Fläche A(x) = x · (U : 2 − x) ist eine nach unten geöffnete Parabel. Ihr Scheitelpunkt liegt in der Mitte zwischen den Nullstellen, dort ist das Rechteck ein Quadrat.'); }
        root.querySelector('#e_u').addEventListener('change', hit); root.querySelector('#r_x').addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Ein Wasserstrahl', q: 'Ein Wasserstrahl folgt der Parabel y = −(x − 2)² + 5 (in Metern). Die Düse ist bei x = 0. Wie hoch steigt der Strahl, und wo trifft er auf das Wasser (y = 0)?',
      steps: ['Die Gleichung ist in Scheitelpunktform: S(2 | 5). Die Parabel ist nach unten geöffnet.', 'Der Strahl steigt also höchstens <b>5 m</b> hoch, und zwar 2 m von der Düse entfernt.', 'Auftreffen auf dem Wasser: y = 0 ⇒ −(x − 2)² + 5 = 0 ⇒ (x − 2)² = 5.', 'x − 2 = ±' + sq('5') + ' ⇒ x = 2 + ' + sq('5') + ' ≈ <b>4,24 m</b>. Die andere Lösung 2 − ' + sq('5') + ' ≈ −0,24 liegt hinter der Düse und passt nicht.', 'Kontrolle: Die Düse ist bei y = −(0 − 2)² + 5 = 1 m Höhe. Der Strahl startet also über dem Wasser, das passt.' + pgraph([{ f: function (x) { return -(x - 2) * (x - 2) + 5; }, from: 0, to: 2 + Math.sqrt(5), vertex: [2, 5], vText: 'S(2 | 5)', zeros: [2 + Math.sqrt(5)], zText: ['4,24'] }], { x: [0, 5], y: [0, 6], ph: 180, maxw: 320, label: 'Wasserstrahl' })] },
    tasks: { gen: gen,
      plan: { G: ['wurf_hoehe:1', 'bruecke:1', 'bremsweg:1', 'wurf_max:1'], S: ['bruecke:2', 'wurf_max:2', 'wurf_aufprall:2', 'rechteck:2', 'bremsweg:2'], E: ['bruecke:3', 'wurf_aufprall:3', 'rechteck:3', 'brunnen:3', 'bremsfaktor:2', 'bremsweg:2'] },
      extra: 'anhalteweg', test: ['brunnen:2', 'bruecke:2', 'wurf_max:2', 'wurf_aufprall:2', 'rechteck:2', 'bremsweg:2'] },
    lerncheck: ['Ich berechne Werte quadratischer Funktionen in Sachaufgaben.', 'Ich finde die größte Höhe oder Fläche über den Scheitelpunkt.', 'Ich berechne Aufprall- oder Fußpunkte als Nullstellen.', 'Ich rechne mit den Faustformeln für den Bremsweg.']
  };
})();
