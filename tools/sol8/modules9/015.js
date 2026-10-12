/* Modul 015 (Klasse 9) · Die p-q-Formel */
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
  /* Polynom schön: [[c,'x²'],[c,'x'],[c,'']] */
  function poly(cs) {
    var s = '', first = true;
    cs.forEach(function (p) {
      var c = p[0]; if (Math.abs(c) < 1e-12) return;
      var a = Math.abs(c), core = p[1] ? ((Math.abs(a - 1) < 1e-12 ? '' : n(a)) + p[1]) : n(a);
      s += (c < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + core; first = false;
    });
    return s || '0';
  }
  function eq0(p, q) { return poly([[1, 'x²'], [p, 'x'], [q, '']]) + ' = 0'; }
  function negHalf(h) { return h === 0 ? '0' : '−' + par(h); }
  function inner(h, q) { return n(h * h) + (q === 0 ? '' : q < 0 ? ' + ' + n(-q) : ' − ' + n(q)); }
  function isSq(D) { var r = Math.round(Math.sqrt(D) * 1000) / 1000; return D >= 0 && Math.abs(r * r - D) < 1e-9; }
  function fval(p, q, x) { return x * x + p * x + q; }
  /* vollständiger Lösungsweg mit der p-q-Formel */
  function pqSteps(p, q) {
    var h = p / 2, D = h * h - q, s = 'p = ' + n(p) + ' und q = ' + n(q) + ', also ' + half('p') + ' = ' + n(h) + '.<br>';
    s += 'x<sub>1,2</sub> = ' + negHalf(h) + ' ± ' + sq(par(h) + '² − ' + par(q)) + ' = ' + n(-h) + ' ± ' + sq(inner(h, q)) + ' = ' + n(-h) + ' ± ' + sq(n(D));
    if (D < 0) return s + '<br>Unter der Wurzel steht eine negative Zahl. Die Gleichung hat <b>keine Lösung</b>.';
    if (D === 0) return s + ' = ' + n(-h) + '<br>Die Diskriminante ist 0. Es gibt <b>genau eine Lösung</b>: x = ' + n(-h) + '.';
    if (isSq(D)) { var w = Math.round(Math.sqrt(D) * 1000) / 1000; return s + ' = ' + n(-h) + ' ± ' + n(w) + '<br>x<sub>1</sub> = ' + n(-h) + ' − ' + n(w) + ' = <b>' + n(-h - w) + '</b> und x<sub>2</sub> = ' + n(-h) + ' + ' + n(w) + ' = <b>' + n(-h + w) + '</b>.'; }
    var wr = Math.sqrt(D);
    return s + '<br>' + sq(n(D)) + ' ≈ ' + n(Math.round(wr * 1000) / 1000) + '. x<sub>1</sub> ≈ ' + n(-h) + ' − ' + n(Math.round(wr * 1000) / 1000) + ' ≈ <b>' + n(r2(-h - wr)) + '</b> und x<sub>2</sub> ≈ ' + n(-h) + ' + ' + n(Math.round(wr * 1000) / 1000) + ' ≈ <b>' + n(r2(-h + wr)) + '</b>.';
  }
  /* passendes Koordinatensystem für y = x² + px + q */
  function pqGraph(p, q, o) {
    o = o || {};
    var h = p / 2, D = h * h - q, w = D > 0 ? Math.sqrt(D) : 0;
    var x0 = Math.floor(-h - Math.max(w, 1.5) - 1.5), x1 = Math.ceil(-h + Math.max(w, 1.5) + 1.5);
    if (x0 > -1) x0 = -1; if (x1 < 1) x1 = 1;
    var y0 = Math.floor(Math.min(-D, 0) - 1), y1 = Math.max(4, Math.ceil(Math.min(q, 0) + 3));
    if (-D > 0) y1 = Math.max(y1, Math.ceil(-D + 4));
    var gx = x1 - x0 > 16 ? 2 : 1, gy = y1 - y0 > 24 ? 5 : y1 - y0 > 14 ? 2 : 1;
    x0 = Math.floor(x0 / gx) * gx; x1 = Math.ceil(x1 / gx) * gx; y0 = Math.floor(y0 / gy) * gy; y1 = Math.ceil(y1 / gy) * gy;
    var zs = D > 1e-12 ? [-h - w, -h + w] : D === 0 ? [-h] : [];
    return pgraph([{ f: function (x) { return x * x + p * x + q; }, vertex: [-h, -D], zeros: zs, vText: o.vText != null ? o.vText : 'S(' + n(-h) + ' | ' + n(-D) + ')', zText: o.zText || (zs.length === 1 ? [''] : zs.map(function (z, j) { return 'x' + (j ? '₂' : '₁') + ' = ' + n(r2(z)); })) }],
      { x: [x0, x1], y: [y0, y1], gx: gx, gy: gy, lx: 2 * gx, ly: (gy === 1 ? 2 : gy * 2), label: 'Parabel y = ' + poly([[1, 'x²'], [p, 'x'], [q, '']]), maxh: 320 });
  }
  /* zwei verschiedene ganzzahlige Lösungen */
  function roots(lvl) {
    for (var t = 0; t < 400; t++) {
      var a = M.rnd(-8, 8), b = M.rnd(-8, 8); if (a === b) continue;
      var r1 = Math.min(a, b), r2_ = Math.max(a, b), p = -(r1 + r2_), q = r1 * r2_;
      if (lvl === 1 && (p % 2 !== 0 || p === 0 || q === 0 || Math.abs(q) > 30)) continue;
      if (lvl === 2 && (p % 2 !== 0 || Math.abs(q) > 40)) continue;
      if (lvl === 3 && (p % 2 === 0 || Math.abs(q) > 40)) continue;
      return { r1: r1, r2: r2_, p: p, q: q };
    }
    return { r1: -1, r2: 3, p: -2, q: -3 };
  }
  function solInputs(x1, x2, tol) { var a = { kind: 'num', answer: x1, label: 'x<sub>1</sub> = (kleinere Lösung)' }, b = { kind: 'num', answer: x2, label: 'x<sub>2</sub> = (größere Lösung)' }; if (tol) { a.tol = tol; b.tol = tol; a.placeholder = b.placeholder = 'auf 2 Stellen'; } return [a, b]; }
  /* typische Fehler beim Lösen */
  function solMistakes(p, q, x1, x2, tol) {
    tol = tol || 1e-9;
    return function (v) {
      var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === null || b === null) return null;
      function near(u, w) { return Math.abs(u - w) <= tol + 1e-9; }
      if (near(a, x2) && near(b, x1) && !near(x1, x2)) return 'Die Zahlen stimmen, aber die Reihenfolge nicht: x<sub>1</sub> ist die <b>kleinere</b> Lösung.';
      if ((near(a, -x2) && near(b, -x1)) || (near(a, -x1) && near(b, -x2))) return 'Achte auf das Vorzeichen vor ' + half('p') + '. In der Formel steht <b>−' + half('p') + '</b>. Hier ist ' + half('p') + ' = ' + n(p / 2) + ', also beginnt die Rechnung mit ' + n(-p / 2) + '.';
      var h = p / 2, D2 = h * h + q;
      if (D2 >= 0 && near(a, r2(-h - Math.sqrt(D2))) && near(b, r2(-h + Math.sqrt(D2))) && q !== 0) return 'Prüfe den Term unter der Wurzel. Dort steht ' + half('p') + '² <b>minus</b> q. Mit q = ' + n(q) + ' rechnest du ' + inner(h, q) + '.';
      var D = h * h - q;
      if (D >= 0 && near(a, -h - D) && near(b, -h + D) && D !== 1 && D !== 0) return 'Du hast vergessen, die Wurzel zu ziehen. Rechne ' + n(-h) + ' ± ' + sq(n(D)) + '.';
      return null;
    };
  }
  function probe(p, q, x) {
    var s = par(x) + '²' + (p ? (p < 0 ? ' − ' : ' + ') + n(Math.abs(p)) + ' · ' + par(x) : '') + (q ? (q < 0 ? ' − ' : ' + ') + n(Math.abs(q)) : '');
    var t = n(x * x) + (p * x ? (p * x < 0 ? ' − ' : ' + ') + n(Math.abs(p * x)) : '') + (q ? (q < 0 ? ' − ' : ' + ') + n(Math.abs(q)) : '');
    return s + ' = ' + t + ' = ' + n(fval(p, q, x)) + ' ✓';
  }
  var COUNT = ['zwei Lösungen', 'genau eine Lösung', 'keine Lösung'];

  var gen = {
    ablesen: function (lvl) {
      var p = M.nz(-9, 9), q = M.nz(-12, 12), shown;
      if (lvl >= 2 && Math.random() < 0.25) p = 0;
      if (lvl >= 2 && p !== 0 && Math.random() < 0.5) shown = poly([[1, 'x²'], [q, '']]) + (p < 0 ? ' − ' : ' + ') + (Math.abs(p) === 1 ? '' : Math.abs(p)) + 'x = 0';
      else shown = eq0(p, q);
      return { skill: 'p und q ablesen', q: 'Die Gleichung steht in Normalform. Lies p und q ab. Achte auf die Vorzeichen.<br><span class="big-math">' + shown + '</span>',
        inputs: [{ kind: 'num', answer: p, label: 'p =' }, { kind: 'num', answer: q, label: 'q =' }],
        hints: ['Normalform: x² + <b>p</b>x + <b>q</b> = 0. p ist die Zahl vor dem x, q ist die Zahl ohne x.', 'Das Rechenzeichen davor gehört zur Zahl dazu: Bei „− 5x“ ist p = −5.' + (p === 0 ? ' Fehlt das Glied mit x, ist p = 0.' : ''), 'Hier steht vor dem x: ' + (p === 0 ? 'nichts, also p = 0' : n(p)) + '. Die Zahl ohne x ist ' + n(q) + '.'],
        solution: 'Vergleiche mit x² + px + q = 0: <b>p = ' + n(p) + '</b> und <b>q = ' + n(q) + '</b>. Die Gleichung in gewohnter Reihenfolge: ' + eq0(p, q) + '.',
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a !== null && b !== null && a === q && b === p && p !== q) return 'Du hast p und q vertauscht. p steht vor dem x, q ist die Zahl ohne x.'; if ((a === -p && p !== 0) || (b === -q)) return 'Achte auf das Vorzeichen. Das Minuszeichen vor einer Zahl gehört zu p oder q dazu.'; return null; },
        verify: function () { try { var tr = M.parseTerm(shown.replace(' = 0', '').replace(/−/g, '-').replace(/²/g, '^2')); return [-2.5, 1.5, 3.7].every(function (x) { return Math.abs(M.evalTree(tr, { x: x }) - fval(p, q, x)) < 1e-9; }) || 'Anzeige passt nicht'; } catch (e) { return 'nicht lesbar'; } } };
    },
    normalform: function (lvl) {
      var a, p, q;
      if (lvl <= 2) { a = M.pick([2, 3, 4, 5, -1, -2, -3]); p = M.rnd(-8, 8); q = M.nz(-9, 9); }
      else { a = M.pick([2, 4, -2, 5]); do { p = M.rnd(-14, 14) / (a === 5 ? 5 : a === 4 ? 4 : 2); q = M.nz(-14, 14) / (a === 5 ? 5 : a === 4 ? 4 : 2); } while (Math.round(p) === p && Math.round(q) === q || Math.abs(p * a - Math.round(p * a)) > 1e-9); }
      var b = Math.round(a * p * 100) / 100, c = Math.round(a * q * 100) / 100;
      return { skill: 'Normalform herstellen', q: 'Bringe die Gleichung in die Normalform x² + px + q = 0. Gib p und q an.<br><span class="big-math">' + poly([[a, 'x²'], [b, 'x'], [c, '']]) + ' = 0</span>' + (lvl === 3 ? '<br><small>p und q können Dezimalzahlen sein.</small>' : ''),
        inputs: [{ kind: 'num', answer: p, label: 'p =' }, { kind: 'num', answer: q, label: 'q =' }],
        hints: ['Vor dem x² muss eine 1 stehen. Teile deshalb <b>jedes</b> Glied der Gleichung durch ' + par(a) + '.', n(b) + ' : ' + par(a) + ' = ' + n(p) + ' und ' + n(c) + ' : ' + par(a) + ' = ' + n(q) + '. Die rechte Seite bleibt 0.', 'Normalform: ' + eq0(p, q) + '. Jetzt kannst du p und q ablesen.'],
        solution: 'Alle Glieder durch ' + par(a) + ' teilen: ' + poly([[a, 'x²'], [b, 'x'], [c, '']]) + ' = 0 &nbsp;| : ' + par(a) + '<br>' + eq0(p, q) + '. Also <b>p = ' + n(p) + '</b> und <b>q = ' + n(q) + '</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x !== null && y !== null && Math.abs(x - b) < 1e-9 && Math.abs(y - c) < 1e-9 && a !== 1) return 'Du hast noch nicht durch ' + par(a) + ' geteilt. Erst wenn vor x² eine 1 steht, liest du p und q ab.'; if (x !== null && y !== null && Math.abs(x + p) < 1e-9 && Math.abs(y + q) < 1e-9) return 'Beim Teilen durch eine negative Zahl ändern sich die Vorzeichen. Prüfe sie noch einmal.'; if (x !== null && Math.abs(x - p) < 1e-9 && y !== null && Math.abs(y - c) < 1e-9 && a !== 1) return 'p stimmt. Teile auch die Zahl ohne x durch ' + par(a) + '.'; return null; },
        verify: function () { return [-1.3, 0.7, 2.9].every(function (x) { return Math.abs((a * x * x + b * x + c) / a - fval(p, q, x)) < 1e-9; }) || 'Normalform falsch'; } };
    },
    pq_int: function (lvl) {
      var R = roots(lvl), p = R.p, q = R.q;
      return { skill: 'p-q-Formel (ganzzahlige Lösungen)', q: 'Löse die Gleichung mit der p-q-Formel.<br><span class="big-math">' + eq0(p, q) + '</span>',
        inputs: solInputs(R.r1, R.r2),
        hints: ['Lies ab: p = ' + n(p) + ' und q = ' + n(q) + '. Dann ist ' + half('p') + ' = ' + n(p / 2) + '.', 'Setze ein: x<sub>1,2</sub> = ' + negHalf(p / 2) + ' ± ' + sq(par(p / 2) + '² − ' + par(q)) + ' = ' + n(-p / 2) + ' ± ' + sq(inner(p / 2, q)) + '.', 'Unter der Wurzel steht ' + n(p * p / 4 - q) + '. Die Wurzel daraus ist ' + n(Math.sqrt(p * p / 4 - q)) + '. Rechne einmal minus und einmal plus.'],
        solution: pqSteps(p, q) + '<br>Probe mit x<sub>1</sub>: ' + probe(p, q, R.r1) + pqGraph(p, q),
        mistakes: solMistakes(p, q, R.r1, R.r2),
        verify: function () { return fval(p, q, R.r1) === 0 && fval(p, q, R.r2) === 0 && R.r1 < R.r2 || 'Probe falsch'; } };
    },
    pq_round: function (lvl) {
      var p, q, D;
      for (var t = 0; t < 400; t++) {
        p = lvl <= 2 ? 2 * M.nz(-5, 5) : M.pick([-7, -5, -3, -1, 1, 3, 5, 7]); q = M.nz(-12, 12); D = p * p / 4 - q;
        if (D > 0 && !isSq(D) && !isSq(p * p - 4 * q)) break;
      }
      var w = Math.sqrt(D), x1 = r2(-p / 2 - w), x2 = r2(-p / 2 + w);
      return { skill: 'p-q-Formel (gerundete Lösungen)', q: 'Löse die Gleichung mit der p-q-Formel. Runde die Lösungen auf zwei Stellen nach dem Komma.<br><span class="big-math">' + eq0(p, q) + '</span>',
        inputs: solInputs(x1, x2, 0.01),
        hints: ['p = ' + n(p) + ', q = ' + n(q) + ', also ' + half('p') + ' = ' + n(p / 2) + ' und (' + half('p') + ')² = ' + n(p * p / 4) + '.', 'x<sub>1,2</sub> = ' + n(-p / 2) + ' ± ' + sq(inner(p / 2, q)) + ' = ' + n(-p / 2) + ' ± ' + sq(n(D)) + '.', 'Mit dem Taschenrechner: ' + sq(n(D)) + ' ≈ ' + n(Math.round(w * 1000) / 1000) + '. Runde erst am Ende.'],
        solution: pqSteps(p, q) + pqGraph(p, q),
        mistakes: solMistakes(p, q, x1, x2, 0.01),
        verify: function () { return Math.abs(fval(p, q, -p / 2 - w)) < 1e-9 && Math.abs(fval(p, q, -p / 2 + w)) < 1e-9 && Math.abs((-p / 2 - w) + (-p / 2 + w) + p) < 1e-9 && Math.abs((-p / 2 - w) * (-p / 2 + w) - q) < 1e-9 || 'Vieta falsch'; } };
    },
    diskriminante: function (lvl) {
      var c = M.rnd(0, 2), h = M.nz(-5, 5), q, p = 2 * h;
      if (c === 0) q = h * h - M.pick(lvl === 1 ? [1, 4, 9, 16] : [1, 2, 3, 5, 8, 9, 12]);
      else if (c === 1) q = h * h;
      else q = h * h + M.pick([1, 2, 3, 4, 6, 10]);
      var D = h * h - q, a = lvl >= 2 && Math.random() < 0.4 ? M.pick([2, 3, -1]) : 1;
      var shown = a === 1 ? eq0(p, q) : poly([[a, 'x²'], [a * p, 'x'], [a * q, '']]) + ' = 0';
      return { skill: 'Diskriminante und Anzahl der Lösungen', q: 'Berechne die Diskriminante D = (' + half('p') + ')² − q und entscheide, wie viele Lösungen die Gleichung hat.<br><span class="big-math">' + shown + '</span>',
        inputs: [{ kind: 'num', answer: D, label: 'D =' }, { kind: 'mc', label: 'Die Gleichung hat …', options: COUNT, answer: D > 0 ? 0 : D === 0 ? 1 : 2 }],
        hints: [(a !== 1 ? 'Teile zuerst durch ' + par(a) + ': ' + eq0(p, q) + '. ' : '') + 'p = ' + n(p) + ', q = ' + n(q) + ', also ' + half('p') + ' = ' + n(h) + '.', 'D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + '.', 'D &gt; 0: zwei Lösungen. D = 0: eine Lösung. D &lt; 0: keine Lösung, denn aus einer negativen Zahl kann man keine Wurzel ziehen.'],
        solution: (a !== 1 ? 'Normalform: ' + eq0(p, q) + '. ' : '') + 'D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + ' = <b>' + n(D) + '</b>. ' + (D > 0 ? 'D &gt; 0, also <b>zwei Lösungen</b>.' : D === 0 ? 'D = 0, also <b>genau eine Lösung</b> (x = ' + n(-h) + ').' : 'D &lt; 0, also <b>keine Lösung</b>.') + pqGraph(p, q),
        mistakes: function (v) { var d = M.parseNum(v[0]); if (d === null) return null; if (d === h * h + q && q !== 0) return 'Achte auf das Minus: D = (' + half('p') + ')² <b>−</b> q. Mit q = ' + n(q) + ' ergibt sich ' + inner(h, q) + '.'; if (d === p * p - q) return 'Du hast p statt ' + half('p') + ' quadriert. Halbiere p zuerst.'; return null; },
        verify: function () { var mn = Infinity; for (var x = -30; x <= 30; x++) mn = Math.min(mn, fval(p, q, x)); return (D > 0 ? mn < 0 : D === 0 ? mn === 0 : mn > 0) || 'Anzahl falsch'; } };
    },
    schritt: function () {
      var h = M.nz(-5, 5), q = M.nz(-9, 9), p = 2 * h;
      function opt(sgn, hh, qq) { return 'x<sub>1,2</sub> = ' + n(sgn) + ' ± ' + sq(inner(hh, qq)); }
      var right = opt(-h, h, q), wrong = [opt(h, h, q), opt(-h, h, -q), opt(-h, 2 * h, q)];
      var all = M.shuffle([right].concat(wrong));
      return { skill: 'p-q-Formel richtig einsetzen', level: 1, q: 'Welche Rechnung setzt richtig in die p-q-Formel ein?<br><span class="big-math">' + eq0(p, q) + '</span>',
        inputs: [{ kind: 'mc', label: 'Wähle die richtige Rechnung', options: all, answer: all.indexOf(right) }],
        hints: ['Lies zuerst ab: p = ' + n(p) + ' und q = ' + n(q) + '.', 'Vor der Wurzel steht −' + half('p') + ' = ' + n(-h) + '.', 'Unter der Wurzel steht (' + half('p') + ')² − q = ' + par(h) + '² − ' + par(q) + '.'],
        solution: 'p = ' + n(p) + ', q = ' + n(q) + ', ' + half('p') + ' = ' + n(h) + '. Richtig ist <b>' + right + '</b>.',
        verify: function () { return new Set(all.map(function (s) { return s.replace(/<[^>]+>/g, ''); })).size === 4 || 'gleiche Optionen'; } };
    },
    umformen: function (lvl) {
      var R = roots(lvl === 3 ? M.pick([2, 3]) : 2), p = R.p, q = R.q, kind = M.rnd(0, 3), shown, step;
      if (kind === 0) { shown = poly([[1, 'x²'], [p, 'x']]) + ' = ' + n(-q); step = (q === 0 ? 'Rechts steht schon 0' : q > 0 ? 'Addiere ' + n(q) + ' auf beiden Seiten' : 'Subtrahiere ' + n(-q) + ' auf beiden Seiten') + ': ' + eq0(p, q) + '.'; if (p === 0) kind = 1; }
      if (kind === 1) { shown = 'x² = ' + poly([[-p, 'x'], [-q, '']]); step = 'Bringe alle Glieder auf die linke Seite. Dabei wechseln sie ihr Vorzeichen: ' + eq0(p, q) + '.'; }
      if (kind === 2) { if (p === 0) { kind = 3; } else { shown = 'x(x ' + (p < 0 ? '− ' + n(-p) : '+ ' + n(p)) + ') = ' + n(-q); step = 'Klammer ausmultiplizieren: ' + poly([[1, 'x²'], [p, 'x']]) + ' = ' + n(-q) + '. Dann ' + n(-q) + ' nach links bringen: ' + eq0(p, q) + '.'; } }
      if (kind === 3) { var c = M.nz(-6, 6); shown = poly([[1, 'x²'], [p - c, 'x']]) + ' = ' + poly([[-c, 'x'], [-q, '']]); step = 'Alles auf die linke Seite bringen und zusammenfassen: ' + eq0(p, q) + '.'; }
      return { skill: 'Gleichung umformen und lösen', level: lvl, q: 'Forme die Gleichung zuerst in die Normalform um. Löse sie dann mit der p-q-Formel.<br><span class="big-math">' + shown + '</span>',
        inputs: solInputs(R.r1, R.r2),
        hints: ['Auf der rechten Seite muss 0 stehen. ' + step.split(':')[0] + '.', 'Normalform: ' + eq0(p, q) + '. Also p = ' + n(p) + ' und q = ' + n(q) + '.', 'x<sub>1,2</sub> = ' + n(-p / 2) + ' ± ' + sq(inner(p / 2, q)) + ' = ' + n(-p / 2) + ' ± ' + sq(n(p * p / 4 - q)) + '.'],
        solution: step + '<br>' + pqSteps(p, q),
        mistakes: solMistakes(p, q, R.r1, R.r2),
        verify: function () { var src = shown.replace(/<[^>]+>/g, '').replace(/−/g, '-').replace(/²/g, '^2').replace(/,/g, '.').split('='); try { var L = M.parseTerm(src[0]), Rt = M.parseTerm(src[1]); return [R.r1, R.r2].every(function (x) { return Math.abs(M.evalTree(L, { x: x }) - M.evalTree(Rt, { x: x })) < 1e-9; }) || 'Lösung erfüllt Ausgangsgleichung nicht'; } catch (e2) { return 'nicht lesbar: ' + shown; } } };
    },
    allg: function (lvl) {
      var R = roots(lvl >= 3 ? M.pick([2, 3]) : 2), a = M.pick(lvl >= 3 ? [2, 3, 4, -2, -3, 5] : [2, 3, -1, -2]), b = a * R.p, c = a * R.q, p = R.p, q = R.q;
      var shown = poly([[a, 'x²'], [b, 'x'], [c, '']]) + ' = 0';
      return { skill: 'Allgemeine Form lösen', q: 'Löse die quadratische Gleichung.<br><span class="big-math">' + shown + '</span>',
        inputs: solInputs(R.r1, R.r2),
        hints: ['Vor x² steht ' + n(a) + '. Teile zuerst die ganze Gleichung durch ' + par(a) + '.', 'Normalform: ' + eq0(p, q) + '. Also p = ' + n(p) + ', q = ' + n(q) + '.', 'x<sub>1,2</sub> = ' + n(-p / 2) + ' ± ' + sq(inner(p / 2, q)) + '.'],
        solution: shown + ' &nbsp;| : ' + par(a) + '<br>' + eq0(p, q) + '<br>' + pqSteps(p, q),
        mistakes: function (v) { var m = solMistakes(p, q, R.r1, R.r2)(v); if (m) return m; var x = M.parseNum(v[0]), y = M.parseNum(v[1]), D0 = b * b / 4 - c; if (x !== null && y !== null && D0 >= 0 && Math.abs(x - r2(-b / 2 - Math.sqrt(D0))) < 0.011 && Math.abs(y - r2(-b / 2 + Math.sqrt(D0))) < 0.011) return 'Die p-q-Formel gilt nur für die Normalform. Teile zuerst durch ' + par(a) + '.'; return null; },
        verify: function () { return a * R.r1 * R.r1 + b * R.r1 + c === 0 && a * R.r2 * R.r2 + b * R.r2 + c === 0 || 'Probe falsch'; } };
    },
    sach: function (lvl) {
      var kind = M.rnd(0, 2), x, d, A, txt, lab1, lab2, unit;
      x = M.rnd(3, 12); d = M.rnd(2, 9); A = x * (x + d);
      if (kind === 0) { txt = 'Ein rechteckiges Beet soll ' + d + ' m länger als breit sein. Seine Fläche soll <b>' + A + ' m²</b> betragen. Wie breit und wie lang wird das Beet?'; lab1 = 'Breite'; lab2 = 'Länge'; unit = 'm'; }
      else if (kind === 1) { txt = 'Ein Handy-Display ist rechteckig. Die Höhe ist ' + d + ' cm größer als die Breite, die Fläche beträgt <b>' + A + ' cm²</b>. Berechne Breite und Höhe.'; lab1 = 'Breite'; lab2 = 'Höhe'; unit = 'cm'; }
      else { txt = 'Lena denkt sich eine positive Zahl. Sie multipliziert die Zahl mit der um ' + d + ' größeren Zahl und erhält <b>' + A + '</b>. Welche Zahl hat sie sich gedacht und mit welcher Zahl hat sie multipliziert?'; lab1 = 'gedachte Zahl'; lab2 = 'um ' + d + ' größere Zahl'; unit = ''; }
      var p = d, q = -A, neg = -x - d;
      return { skill: 'Sachaufgabe mit quadratischer Gleichung', level: 3, q: txt + '<br><small>Stelle eine Gleichung mit x auf und löse sie mit der p-q-Formel.</small>',
        inputs: [{ kind: 'num', answer: x, label: lab1, unit: unit }, { kind: 'num', answer: x + d, label: lab2, unit: unit }],
        hints: ['Nenne die ' + (kind === 2 ? 'gedachte Zahl' : 'Breite') + ' x. Dann ist die andere Zahl x + ' + d + '. Es gilt x · (x + ' + d + ') = ' + A + '.', 'Ausmultiplizieren und umformen: x² + ' + d + 'x − ' + A + ' = 0. Also p = ' + d + ' und q = −' + A + '.', 'x<sub>1,2</sub> = ' + n(-d / 2) + ' ± ' + sq(inner(d / 2, -A)) + '. Nur die positive Lösung passt zur Aufgabe.'],
        solution: 'x · (x + ' + d + ') = ' + A + ' ⇒ ' + eq0(p, q) + '<br>' + pqSteps(p, q) + '<br>Die Lösung ' + n(neg) + ' ist negativ und passt nicht zur Aufgabe. Also ' + lab1 + ' <b>' + x + (unit ? ' ' + unit : '') + '</b> und ' + lab2 + ' <b>' + (x + d) + (unit ? ' ' + unit : '') + '</b>. Probe: ' + x + ' · ' + (x + d) + ' = ' + A + ' ✓',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && a === neg) return 'Das ist die negative Lösung der Gleichung. ' + (kind === 2 ? 'Gesucht ist eine positive Zahl.' : 'Eine Länge kann nicht negativ sein.'); if (a !== null && Math.abs(a - Math.sqrt(A)) < 0.01) return 'Das wäre die Seite eines Quadrats. Hier ist eine Seite um ' + d + ' länger als die andere.'; return null; },
        verify: function () { return x * (x + d) === A && fval(p, q, x) === 0 && fval(p, q, neg) === 0 || 'Probe falsch'; } };
    }
  };

  return {
    id: '015', title: 'Die p-q-Formel', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Quadratzahlen und Wurzeln, Klammern ausmultiplizieren, Normalparabel',
    lead: 'Nicht jede quadratische Gleichung lässt sich durch Probieren lösen. Mit der p-q-Formel findest du alle Lösungen sicher, auch krumme.',
    einstieg: { html: '<p>Familie Kaya plant ein rechteckiges Gemüsebeet. Es soll <b>3 m länger als breit</b> sein und eine Fläche von <b>40 m²</b> haben.</p><p>Nennt man die Breite x, dann ist die Länge x + 3 und es gilt x · (x + 3) = 40, also <b>x² + 3x − 40 = 0</b>. Durch Probieren findest du schnell x = 5, denn 5 · 8 = 40.</p><p class="note">Was ist aber, wenn das Beet nur 35 m² groß sein soll? Dann musst du x² + 3x − 35 = 0 lösen. Mit Probieren kommst du hier nicht weiter.</p><p>In diesem Modul lernst du eine Formel kennen, mit der du jede Gleichung dieser Art lösen kannst: die <b>p-q-Formel</b>.</p>' + pqGraph(3, -40, { vText: '' }).replace('max-width:360px', 'max-width:300px') },
    ziele: ['Ich bringe eine quadratische Gleichung in die Normalform x² + px + q = 0.', 'Ich lese p und q mit dem richtigen Vorzeichen ab.', 'Ich löse quadratische Gleichungen mit der p-q-Formel und mache die Probe.', 'Ich entscheide mit der Diskriminante, ob es zwei, eine oder keine Lösung gibt.', 'Ich löse Sachaufgaben, die auf eine quadratische Gleichung führen.'],
    fachwoerter: [['Quadratische Gleichung', 'Eine Gleichung, in der x² vorkommt, aber keine höhere Potenz, zum Beispiel x² − 4x + 3 = 0.'], ['Normalform', 'Die Form x² + px + q = 0. Vor dem x² steht eine 1, rechts steht 0.'], ['p-q-Formel', 'Lösungsformel für die Normalform: x<sub>1,2</sub> = −' + half('p') + ' ± ' + sq('(' + half('p') + ')² − q') + '.'], ['Diskriminante D', 'Der Term unter der Wurzel: D = (' + half('p') + ')² − q. Er entscheidet über die Anzahl der Lösungen.'], ['Probe', 'Du setzt die Lösung in die Gleichung ein. Stimmt die Gleichung, ist die Lösung richtig.']],
    diagnose: [
      { q: 'Welchen Wert hat ' + sq('81') + '?', options: ['9', '40,5', '18', 'Weiß ich noch nicht'], answer: 0, why: '9 · 9 = 81, also ' + sq('81') + ' = 9.', review: 'Quadratwurzeln' },
      { q: 'Was ergibt (−3)²?', options: ['9', '−9', '−6', 'Weiß ich noch nicht'], answer: 0, why: '(−3) · (−3) = 9. Minus mal minus ergibt plus.', review: 'Quadrieren negativer Zahlen' },
      { q: 'Welche Zahlen lösen die Gleichung x² = 16?', options: ['x = 4 und x = −4', 'nur x = 4', 'x = 8', 'Weiß ich noch nicht'], answer: 0, why: '4² = 16 und (−4)² = 16. Es gibt zwei Lösungen.', review: 'Einfache quadratische Gleichungen x² = c' },
      { q: 'Multipliziere aus: (x − 2)(x + 5)', options: ['x² + 3x − 10', 'x² − 10', 'x² + 3x + 10', 'Weiß ich noch nicht'], answer: 0, why: 'x² + 5x − 2x − 10 = x² + 3x − 10.', review: 'Klammern ausmultiplizieren (Klasse 8)' }],
    erklaerung:
      '<h3>1. Die Normalform</h3><p>Eine quadratische Gleichung steht in <b>Normalform</b>, wenn vor dem x² eine 1 steht und rechts 0: <span class="big-math">x² + px + q = 0</span></p>' +
      '<p>Steht vor dem x² eine andere Zahl a, teilst du <b>jedes</b> Glied durch a. Beispiel: 2x² − 8x − 10 = 0 &nbsp;| : 2 &nbsp;⇒ x² − 4x − 5 = 0. Also <b>p = −4</b> und <b>q = −5</b>. Das Vorzeichen gehört immer dazu.</p>' +
      '<h3>2. Die p-q-Formel</h3><div class="merk"><b>Merke:</b> Die Gleichung x² + px + q = 0 hat die Lösungen<br><span class="big-math">x<sub>1,2</sub> = −' + half('p') + ' ± ' + sq('(' + half('p') + ')² − q') + '</span><br>Das ± bedeutet: Du rechnest einmal mit Minus (x<sub>1</sub>, die kleinere Lösung) und einmal mit Plus (x<sub>2</sub>).</div>' +
      '<p><b>Beispiel:</b> x² − 4x − 5 = 0 mit p = −4 und q = −5, also ' + half('p') + ' = −2.</p><p class="big-math">x<sub>1,2</sub> = −(−2) ± ' + sq('(−2)² − (−5)') + ' = 2 ± ' + sq('4 + 5') + ' = 2 ± 3</p><p>x<sub>1</sub> = 2 − 3 = <b>−1</b> und x<sub>2</sub> = 2 + 3 = <b>5</b>. Probe: 5² − 4 · 5 − 5 = 25 − 20 − 5 = 0 ✓</p>' +
      '<p>Am Graphen von y = x² − 4x − 5 sind die Lösungen die <b>Nullstellen</b>, also die Stellen, an denen die Parabel die x-Achse schneidet.</p>' + pqGraph(-4, -5) +
      '<h3>3. Die Diskriminante</h3><p>Der Term unter der Wurzel heißt <b>Diskriminante</b>: D = (' + half('p') + ')² − q.</p><div class="merk"><b>Merke:</b> D &gt; 0: zwei Lösungen. D = 0: genau eine Lösung, x = −' + half('p') + '. D &lt; 0: keine Lösung, denn aus einer negativen Zahl kann man keine Wurzel ziehen.</div>' +
      '<p class="note"><b>Krumme Ergebnisse:</b> Ist D keine Quadratzahl, rechnest du die Wurzel mit dem Taschenrechner aus und rundest erst am Ende, zum Beispiel auf zwei Stellen. <b>Kontrolle:</b> Es gilt immer x<sub>1</sub> + x<sub>2</sub> = −p und x<sub>1</sub> · x<sub>2</sub> = q.</p>',
    entdecken: {
      html: '<p>Stelle p und q ein. Die Rechnung mit der p-q-Formel und die Parabel y = x² + px + q verändern sich mit. Die Lösungen sind die Nullstellen der Parabel.</p><div class="ctl"><label>p = <b id="v_p"></b> <input type="range" id="r_p" min="-6" max="6" step="1" value="-2"></label><label>q = <b id="v_q"></b> <input type="range" id="r_q" min="-8" max="8" step="1" value="-3"></label></div><p class="big-math" id="e_eq"></p><div id="e_calc"></div><div id="e_g"></div><ul><li>Für welche q gibt es keine Lösung mehr?</li><li>Wo liegt der Scheitelpunkt, wenn es genau eine Lösung gibt?</li></ul>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var p = +root.querySelector('#r_p').value, q = +root.querySelector('#r_q').value, h = p / 2, D = h * h - q, w = Math.sqrt(Math.max(D, 0));
          root.querySelector('#v_p').textContent = n(p); root.querySelector('#v_q').textContent = n(q);
          root.querySelector('#e_eq').innerHTML = eq0(p, q);
          root.querySelector('#e_calc').innerHTML = '<p>' + pqSteps(p, q) + '</p><p class="note">Diskriminante D = ' + n(D) + ' ⇒ ' + (D > 0 ? '<b>zwei Lösungen</b>' : D === 0 ? '<b>genau eine Lösung</b>' : '<b>keine Lösung</b>') + '</p>';
          var zs = D > 0 ? [-h - w, -h + w] : D === 0 ? [-h] : [];
          root.querySelector('#e_g').innerHTML = pgraph([{ f: function (x) { return x * x + p * x + q; }, vertex: [-h, -D], zeros: zs, vText: 'S', zText: zs.length === 2 ? ['x₁', 'x₂'] : [''] }], { x: [-8, 8], y: [-10, 8], label: 'Parabel zur Gleichung' });
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Die Lösungen der Gleichung sind die Nullstellen der Parabel. Wird D negativ, liegt die Parabel ganz über der x-Achse und es gibt keine Lösung.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        draw();
      }
    },
    beispiel: { title: 'Erst teilen, dann die Formel', q: 'Löse die Gleichung 2x² + 6x − 8 = 0.',
      steps: ['Normalform herstellen: Alle Glieder durch 2 teilen. x² + 3x − 4 = 0.', 'Ablesen: p = 3 und q = −4. Also ' + half('p') + ' = 1,5 und (' + half('p') + ')² = 2,25.', 'Einsetzen: x<sub>1,2</sub> = −1,5 ± ' + sq('2,25 − (−4)') + ' = −1,5 ± ' + sq('6,25') + ' = −1,5 ± 2,5.', 'Ausrechnen: x<sub>1</sub> = −1,5 − 2,5 = <b>−4</b> und x<sub>2</sub> = −1,5 + 2,5 = <b>1</b>.', 'Probe mit der Ausgangsgleichung: 2 · (−4)² + 6 · (−4) − 8 = 32 − 24 − 8 = 0 ✓ und 2 · 1² + 6 · 1 − 8 = 0 ✓'] },
    tasks: { gen: gen,
      plan: { G: ['schritt:1', 'ablesen:1', 'pq_int:1', 'diskriminante:1'], S: ['ablesen:2', 'normalform:2', 'pq_int:2', 'pq_round:2', 'diskriminante:2'], E: ['normalform:3', 'pq_int:3', 'pq_round:3', 'umformen:3', 'allg:3', 'diskriminante:2'] },
      extra: 'sach', test: ['ablesen:2', 'normalform:2', 'pq_int:2', 'pq_round:2', 'diskriminante:2', 'allg:2'] },
    lerncheck: ['Ich bringe eine Gleichung in die Normalform und lese p und q ab.', 'Ich löse Gleichungen mit der p-q-Formel.', 'Ich entscheide mit der Diskriminante über die Anzahl der Lösungen.', 'Ich überprüfe meine Lösungen mit einer Probe.']
  };
})();
