/* Modul 016 (Klasse 9) · Anzahl der Lösungen */
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
  function sq(s) { return '√<span style="border-top:1.5px solid currentColor;padding:0 2px">' + s + '</span>'; }
  function half(s) { return '<span class="frac"><span>' + s + '</span><span>2</span></span>'; }
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
  function fx(p, q) { return poly([[1, 'x²'], [p, 'x'], [q, '']]); }
  function inner(h, q) { return n(h * h) + (q === 0 ? '' : q < 0 ? ' + ' + n(-q) : ' − ' + n(q)); }
  function fval(p, q, x) { return x * x + p * x + q; }
  /* Scheitelpunktform y = (x − d)² + e als Text */
  function spf(d, e) { return (d === 0 ? 'x²' : '(x ' + (d > 0 ? '− ' + n(d) : '+ ' + n(-d)) + ')²') + (e === 0 ? '' : e > 0 ? ' + ' + n(e) : ' − ' + n(-e)); }
  function probe(p, q, x) {
    var s = par(x) + '²' + (p ? (p < 0 ? ' − ' : ' + ') + n(Math.abs(p)) + ' · ' + par(x) : '') + (q ? (q < 0 ? ' − ' : ' + ') + n(Math.abs(q)) : '');
    var t = n(x * x) + (p * x ? (p * x < 0 ? ' − ' : ' + ') + n(Math.abs(p * x)) : '') + (q ? (q < 0 ? ' − ' : ' + ') + n(Math.abs(q)) : '');
    return s + ' = ' + t + ' = ' + n(fval(p, q, x)) + ' ✓';
  }
  var COUNT = ['zwei Lösungen', 'genau eine Lösung', 'keine Lösung'];
  var NULL3 = ['zwei Nullstellen', 'genau eine Nullstelle', 'keine Nullstelle'];
  function cidx(D) { return D > 1e-12 ? 0 : Math.abs(D) <= 1e-12 ? 1 : 2; }
  /* unabhängige Kontrolle: kleinster Funktionswert durch Abtasten (Raster 0,25) */
  function minVal(p, q) { var mn = Infinity; for (var k = -200; k <= 200; k++) mn = Math.min(mn, fval(p, q, k / 4)); return mn; }
  function cntByMin(p, q) { var mn = minVal(p, q); return mn < -1e-12 ? 0 : Math.abs(mn) <= 1e-12 ? 1 : 2; }
  /* Graph y = x² + px + q mit passendem Ausschnitt */
  function pqGraph(p, q, o) {
    o = o || {};
    var h = p / 2, D = h * h - q, w = D > 0 ? Math.sqrt(D) : 0, marks = o.marks !== false;
    var x0 = Math.min(-1, Math.floor(-h - Math.max(w, 2) - 1.5)), x1 = Math.max(1, Math.ceil(-h + Math.max(w, 2) + 1.5));
    var y0 = Math.min(-2, Math.floor(-D - 1.5)), y1 = Math.max(5, Math.ceil(-D + 5));
    var gx = x1 - x0 > 16 ? 2 : 1, gy = y1 - y0 > 24 ? 5 : y1 - y0 > 14 ? 2 : 1;
    x0 = Math.floor(x0 / gx) * gx; x1 = Math.ceil(x1 / gx) * gx; y0 = Math.floor(y0 / gy) * gy; y1 = Math.ceil(y1 / gy) * gy;
    var zs = !marks ? [] : D > 1e-12 ? [-h - w, -h + w] : Math.abs(D) <= 1e-12 ? [-h] : [];
    return pgraph([{ f: function (x) { return x * x + p * x + q; }, vertex: marks ? [-h, -D] : null, zeros: zs, vText: 'S(' + n(-h) + ' | ' + n(-D) + ')', zText: zs.length === 1 ? [''] : zs.map(function (z, j) { return 'x' + (j ? '₂' : '₁') + ' = ' + n(Math.round(z * 100) / 100); }) }],
      { x: [x0, x1], y: [y0, y1], gx: gx, gy: gy, lx: 2 * gx, ly: gy === 1 ? 2 : 2 * gy, label: o.label || 'Parabel', maxh: 320, maxw: o.maxw });
  }
  /* Graph y = (x − d)² + e im festen Ausschnitt */
  function spGraph(d, e, o) {
    o = o || {}; var w = e < 0 ? Math.sqrt(-e) : 0, zs = o.marks ? (e < 0 ? [d - w, d + w] : e === 0 ? [d] : []) : [];
    return pgraph([{ f: function (x) { return (x - d) * (x - d) + e; }, vertex: o.marks ? [d, e] : null, vText: 'S(' + n(d) + ' | ' + n(e) + ')', zeros: zs, zText: zs.length === 1 ? [''] : zs.map(function (z, j) { return 'x' + (j ? '₂' : '₁'); }) }],
      { x: [-6, 6], y: [-5, 7], label: 'Parabel y = ' + spf(d, e), maxw: o.maxw || 330 });
  }

  var gen = {
    D_rechnen: function (lvl) {
      var p, q, a = 1;
      if (lvl === 1) { p = 2 * M.nz(-5, 5); q = M.nz(-12, 12); }
      else if (lvl === 2) { p = M.nz(-9, 9); q = M.nz(-12, 12); if (Math.random() < 0.5) a = M.pick([2, 3, -1, -2]); }
      else { p = M.nz(-9, 9); q = M.nz(-12, 12); a = M.pick([2, 4, -2, 5]); }
      var h = p / 2, D = h * h - q, shown = a === 1 ? eq0(p, q) : poly([[a, 'x²'], [a * p, 'x'], [a * q, '']]) + ' = 0';
      return { skill: 'Diskriminante berechnen', q: 'Berechne die Diskriminante D = (' + half('p') + ')² − q der Gleichung.<br><span class="big-math">' + shown + '</span>',
        inputs: [{ kind: 'num', answer: D, label: 'D =' }],
        hints: [(a !== 1 ? 'Bringe die Gleichung zuerst in die Normalform: Teile durch ' + par(a) + '. ' : '') + 'Lies p und q ab: p = ' + n(p) + ', q = ' + n(q) + '.', half('p') + ' = ' + n(h) + ', also (' + half('p') + ')² = ' + par(h) + '² = ' + n(h * h) + '.', 'D = ' + n(h * h) + ' − ' + par(q) + ' = ' + inner(h, q) + '.'],
        solution: (a !== 1 ? 'Normalform: ' + eq0(p, q) + '. ' : '') + 'D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + ' = <b>' + n(D) + '</b>.',
        mistakes: function (v) { var d = M.parseNum(v[0]); if (d === null) return null; if (Math.abs(d - (h * h + q)) < 1e-9) return 'Achte auf das Minus vor q: D = (' + half('p') + ')² <b>−</b> q = ' + inner(h, q) + '.'; if (Math.abs(d - (p * p - q)) < 1e-9) return 'Du hast p quadriert. Halbiere p zuerst: ' + half('p') + ' = ' + n(h) + '.'; if (Math.abs(d - (-h * h - q)) < 1e-9) return 'Ein Quadrat ist nie negativ: ' + par(h) + '² = ' + n(h * h) + '.'; if (a !== 1 && Math.abs(d - (a * a * h * h - a * q)) < 1e-9) return 'Teile zuerst durch ' + par(a) + ', damit vor x² eine 1 steht.'; return null; },
        verify: function () { return Math.abs(minVal(p, q) - (-D)) < 1e-9 || 'D passt nicht zum Scheitel'; } };
    },
    anzahl: function (lvl) {
      var c = M.rnd(0, 2), h = M.nz(-5, 5), p = 2 * h, q;
      if (lvl === 3 && Math.random() < 0.5) { h = M.pick([-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, 3.5]); p = 2 * h; }
      q = c === 0 ? Math.round((h * h - M.pick([1, 2, 3, 4, 5, 7])) * 100) / 100 : c === 1 ? h * h : Math.round((h * h + M.pick([0.75, 1, 2, 3, 5])) * 100) / 100;
      var D = h * h - q, shown, step = '';
      if (lvl === 3) { var k = M.nz(-4, 4); shown = poly([[1, 'x²'], [p - k, 'x']]) + ' = ' + poly([[-k, 'x'], [-q, '']]); step = 'Normalform: ' + eq0(p, q) + '. '; }
      else shown = eq0(p, q);
      return { skill: 'Anzahl der Lösungen bestimmen', q: 'Wie viele Lösungen hat die Gleichung? Begründe mit der Diskriminante.<br><span class="big-math">' + shown + '</span>',
        inputs: [{ kind: 'mc', label: 'Die Gleichung hat …', options: COUNT, answer: cidx(D) }],
        hints: [(lvl === 3 ? 'Bringe zuerst alles auf die linke Seite. ' : '') + 'Lies p und q ab und berechne ' + half('p') + '.', step + 'p = ' + n(p) + ', q = ' + n(q) + '. D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + '.', 'D = ' + n(D) + '. Positiv: zwei Lösungen, null: eine Lösung, negativ: keine Lösung.'],
        solution: step + 'D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + ' = <b>' + n(D) + '</b>. ' + (D > 0 ? 'D &gt; 0: Die Gleichung hat <b>zwei Lösungen</b>.' : D === 0 ? 'D = 0: Die Gleichung hat <b>genau eine Lösung</b>, nämlich x = ' + n(-h) + '.' : 'D &lt; 0: Die Gleichung hat <b>keine Lösung</b>.') + pqGraph(p, q),
        verify: function () { return cntByMin(p, q) === cidx(D) || 'Anzahl passt nicht'; } };
    },
    graph_anzahl: function () {
      var d = M.rnd(-3, 3), e = M.pick([-4, -3, -2, -1, 0, 0, 1, 2, 3, 4]);
      var k = e < 0 ? 0 : e === 0 ? 1 : 2;
      return { skill: 'Anzahl der Lösungen am Graphen', level: 1, q: 'Hier siehst du die Parabel y = x² + px + q. Wie viele Lösungen hat die Gleichung x² + px + q = 0?' + spGraph(d, e),
        inputs: [{ kind: 'mc', label: 'Die Gleichung hat …', options: COUNT, answer: k }],
        hints: ['Die Lösungen der Gleichung sind die Nullstellen der Parabel. Dort ist y = 0.', 'Zähle, wie oft die Parabel die x-Achse schneidet oder berührt.', 'Achte auf den Scheitelpunkt: Liegt er unter, auf oder über der x-Achse?'],
        solution: 'Der Scheitelpunkt ist S(' + n(d) + ' | ' + n(e) + '). ' + (e < 0 ? 'Er liegt unter der x-Achse. Die nach oben geöffnete Parabel schneidet die x-Achse <b>zweimal</b>: zwei Lösungen.' : e === 0 ? 'Er liegt auf der x-Achse. Die Parabel berührt die x-Achse nur dort: <b>genau eine Lösung</b>.' : 'Er liegt über der x-Achse. Die Parabel trifft die x-Achse <b>nie</b>: keine Lösung.') + spGraph(d, e, { marks: true }),
        verify: function () { return cntByMin(-2 * d, d * d + e) === k || 'Anzahl falsch'; } };
    },
    ablesen: function (lvl) {
      var r1, r2;
      do { r1 = M.rnd(-5, 4); r2 = r1 + M.rnd(lvl === 1 ? 2 : 1, 4); } while (r2 > 5 || (lvl === 1 && (r2 - r1) % 2));
      var p = -(r1 + r2), q = r1 * r2;
      return { skill: 'Gleichung grafisch lösen', q: 'Löse die Gleichung <b>' + eq0(p, q) + '</b> grafisch. Lies dazu die Nullstellen der Parabel y = ' + fx(p, q) + ' ab.' + pgraph([{ f: function (x) { return fval(p, q, x); } }], { x: [-6, 6], y: [-5, 6], label: 'Parabel y = ' + fx(p, q), maxw: 330 }),
        inputs: [{ kind: 'num', answer: r1, label: 'x<sub>1</sub> = (kleinere Lösung)' }, { kind: 'num', answer: r2, label: 'x<sub>2</sub> = (größere Lösung)' }],
        hints: ['Die Lösungen sind die x-Werte, an denen die Parabel die x-Achse schneidet.', 'Suche die beiden Schnittpunkte mit der waagerechten Achse und lies jeweils den x-Wert ab.', 'Kontrolle durch Einsetzen: ' + probe(p, q, r1).split(' = ')[0] + ' muss 0 ergeben.'],
        solution: 'Die Parabel schneidet die x-Achse bei <b>x<sub>1</sub> = ' + n(r1) + '</b> und <b>x<sub>2</sub> = ' + n(r2) + '</b>. Probe: ' + probe(p, q, r1) + pqGraph(p, q),
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === r2 && b === r1) return 'x<sub>1</sub> ist die kleinere Lösung, also die linke Nullstelle.'; if ((a === q || b === q) && q !== r1 && q !== r2) return 'Das ist der Schnittpunkt mit der y-Achse. Gesucht sind die Schnittpunkte mit der x-Achse.'; if ((a === -p / 2 || b === -p / 2) && -p / 2 !== r1 && -p / 2 !== r2) return 'Das ist die x-Koordinate des Scheitelpunkts. Gesucht sind die Schnittpunkte mit der x-Achse.'; return null; },
        verify: function () { return fval(p, q, r1) === 0 && fval(p, q, r2) === 0 && Math.abs(-(p * p / 4 - q)) <= 5 || 'Nullstellen falsch'; } };
    },
    scheitel: function (lvl) {
      var d = M.nz(-6, 6), e = M.pick([-9, -5, -4, -2, -1, 0, 0, 1, 2, 3, 6]), k = e < 0 ? 0 : e === 0 ? 1 : 2;
      return { skill: 'Anzahl der Nullstellen aus der Scheitelpunktform', q: 'Die Parabel hat die Gleichung <span class="big-math">y = ' + spf(d, e) + '</span><br>a) Gib die y-Koordinate des Scheitelpunkts an.<br>b) Wie viele Nullstellen hat die Parabel?',
        inputs: [{ kind: 'num', answer: e, label: 'a) y-Koordinate von S' }, { kind: 'mc', label: 'b) Die Parabel hat …', options: NULL3, answer: k }],
        hints: ['In der Scheitelpunktform y = (x − d)² + e liest du den Scheitelpunkt S(d | e) direkt ab.', 'Hier ist S(' + n(d) + ' | ' + n(e) + '). Die Normalparabel ist nach oben geöffnet.', 'Liegt der Scheitelpunkt unter der x-Achse, gibt es zwei Nullstellen. Liegt er auf der x-Achse, eine. Liegt er darüber, keine.'],
        solution: 'a) S(' + n(d) + ' | ' + n(e) + '), also y-Koordinate <b>' + n(e) + '</b>. b) ' + (e < 0 ? 'Der Scheitelpunkt liegt unter der x-Achse: <b>zwei Nullstellen</b>.' : e === 0 ? 'Der Scheitelpunkt liegt auf der x-Achse: <b>genau eine Nullstelle</b> bei x = ' + n(d) + '.' : 'Der Scheitelpunkt liegt über der x-Achse und die Parabel ist nach oben geöffnet: <b>keine Nullstelle</b>.') + (Math.abs(d) <= 5 && e <= 6 && e >= -4 ? spGraph(d, e, { marks: true }) : ''),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === -e && e !== 0) return 'Achte auf das Vorzeichen: Bei „+ ' + n(Math.abs(e)) + '“ ist e = ' + n(Math.abs(e)) + ', bei „− ' + n(Math.abs(e)) + '“ ist e = −' + n(Math.abs(e)) + '.'; if (a === d || a === -d) return 'Das ist die x-Koordinate. Gefragt ist die y-Koordinate e, die Zahl hinter der Klammer.'; return null; },
        verify: function () { return cntByMin(-2 * d, d * d + e) === k || 'Anzahl falsch'; } };
    },
    param_q: function (lvl) {
      var p = lvl >= 3 ? M.nz(-9, 9) : 2 * M.nz(-5, 5), h = p / 2, q = h * h;
      return { skill: 'Parameter q für genau eine Lösung', level: 3, q: 'Für welchen Wert von q hat die Gleichung <span class="big-math">' + poly([[1, 'x²'], [p, 'x']]) + ' + q = 0</span> genau eine Lösung? Gib auch diese Lösung an.',
        inputs: [{ kind: 'num', answer: q, label: 'q =' }, { kind: 'num', answer: -h, label: 'Lösung x =' }],
        hints: ['Genau eine Lösung gibt es, wenn die Diskriminante null ist: (' + half('p') + ')² − q = 0.', half('p') + ' = ' + n(h) + '. Also ' + par(h) + '² − q = 0, das heißt q = ' + par(h) + '².', 'Bei D = 0 ist die Lösung x = −' + half('p') + '.'],
        solution: 'D = (' + half('p') + ')² − q = ' + par(h) + '² − q = ' + n(h * h) + ' − q. D = 0 für <b>q = ' + n(q) + '</b>. Dann ist x = −' + half('p') + ' = <b>' + n(-h) + '</b>. Probe: ' + par(-h) + '² ' + (p < 0 ? '− ' + n(-p) : '+ ' + n(p)) + ' · ' + par(-h) + ' + ' + n(q) + ' = 0 ✓' + pqGraph(p, q),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === null) return null; if (a === -q) return 'Prüfe das Vorzeichen: Aus ' + n(h * h) + ' − q = 0 folgt q = ' + n(q) + '.'; if (a === p * p) return 'Halbiere p zuerst und quadriere dann: (' + half(n(p)) + ')² = ' + n(q) + '.'; if (a === h) return 'Du hast ' + half('p') + ' noch nicht quadriert.'; return null; },
        verify: function () { return Math.abs(fval(p, q, -h)) < 1e-12 && cntByMin(p, q) === 1 || 'nicht genau eine Lösung'; } };
    },
    param_p: function () {
      var k = M.rnd(1, 7), c = k * k, p = 2 * k;
      return { skill: 'Parameter p für genau eine Lösung', level: 3, q: 'Für welche <b>positive</b> Zahl p hat die Gleichung <span class="big-math">x² + px + ' + c + ' = 0</span> genau eine Lösung? Gib auch diese Lösung an.',
        inputs: [{ kind: 'num', answer: p, label: 'p =' }, { kind: 'num', answer: -k, label: 'Lösung x =' }],
        hints: ['Genau eine Lösung heißt D = 0, also (' + half('p') + ')² = q = ' + c + '.', 'Welche positive Zahl ergibt quadriert ' + c + '? Das ist ' + half('p') + '.', half('p') + ' = ' + k + ', also p = ' + p + '. Die Lösung ist x = −' + half('p') + '.'],
        solution: '(' + half('p') + ')² − ' + c + ' = 0 ⇒ (' + half('p') + ')² = ' + c + ' ⇒ ' + half('p') + ' = ' + k + ' ⇒ <b>p = ' + p + '</b>. Die Lösung ist x = −' + k + '. Probe: (−' + k + ')² + ' + p + ' · (−' + k + ') + ' + c + ' = ' + c + ' − ' + 2 * c + ' + ' + c + ' = 0 ✓ (Für p = −' + p + ' gäbe es auch genau eine Lösung, nämlich x = ' + k + '.)',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === k) return 'Das ist ' + half('p') + '. Gesucht ist p selbst, also das Doppelte.'; if (a === -p) return 'Gesucht ist die positive Zahl p.'; if (a === c) return 'Nicht p, sondern ' + half('p') + ' muss quadriert ' + c + ' ergeben.'; return null; },
        verify: function () { return fval(p, c, -k) === 0 && cntByMin(p, c) === 1 || 'falsch'; } };
    },
    bereich: function (lvl) {
      var h = M.nz(-5, 5), p = 2 * h, t = h * h, ask = M.rnd(0, 1);
      var opts = ['q &lt; ' + n(t), 'q &gt; ' + n(t), 'q = ' + n(t), 'q &lt; ' + n(-t)];
      return { skill: 'Bereich für q bestimmen', level: 3, q: 'Für welche Werte von q hat die Gleichung <span class="big-math">' + poly([[1, 'x²'], [p, 'x']]) + ' + q = 0</span> <b>' + (ask === 0 ? 'zwei Lösungen' : 'keine Lösung') + '</b>?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ask === 0 ? 0 : 1 }],
        hints: ['Berechne die Diskriminante mit q als Unbekannter: D = ' + par(h) + '² − q = ' + n(t) + ' − q.', ask === 0 ? 'Zwei Lösungen gibt es für D &gt; 0, also ' + n(t) + ' − q &gt; 0.' : 'Keine Lösung gibt es für D &lt; 0, also ' + n(t) + ' − q &lt; 0.', 'Stelle nach q um. Probiere zur Kontrolle eine Zahl aus, zum Beispiel q = ' + n(t + (ask === 0 ? -1 : 1)) + '.'],
        solution: 'D = ' + n(t) + ' − q. ' + (ask === 0 ? 'D &gt; 0 ⇔ ' + n(t) + ' &gt; q, also <b>q &lt; ' + n(t) + '</b>.' : 'D &lt; 0 ⇔ ' + n(t) + ' &lt; q, also <b>q &gt; ' + n(t) + '</b>.') + ' Bei q = ' + n(t) + ' gibt es genau eine Lösung.',
        verify: function () { var ok = [-20, t - 3, t - 0.5, t + 0.5, t + 4, 40].every(function (q) { var c = cntByMin(p, q); return ask === 0 ? (q < t) === (c === 0) : (q > t) === (c === 2); }); return ok || 'Bereich falsch'; } };
    },
    verschieben: function () {
      var d = M.rnd(-4, 4), e = M.pick([-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
      return { skill: 'Parabel verschieben', level: 2, q: 'Die Parabel y = ' + spf(d, e) + ' soll so nach oben oder unten verschoben werden, dass sie die x-Achse genau in einem Punkt berührt.<br>a) In welche Richtung musst du verschieben?<br>b) Um wie viele Einheiten?',
        inputs: [{ kind: 'mc', label: 'a) Richtung', options: ['nach oben', 'nach unten'], answer: e < 0 ? 0 : 1 }, { kind: 'num', answer: Math.abs(e), label: 'b) Verschiebung um', unit: 'Einheiten' }],
        hints: ['Genau ein gemeinsamer Punkt mit der x-Achse: Der Scheitelpunkt muss <b>auf</b> der x-Achse liegen.', 'Der Scheitelpunkt ist S(' + n(d) + ' | ' + n(e) + '). Er liegt ' + (e < 0 ? 'unter' : 'über') + ' der x-Achse.', 'Der Scheitelpunkt muss auf die Höhe y = 0. Von ' + n(e) + ' bis 0 sind es ' + Math.abs(e) + ' Einheiten.'],
        solution: 'S(' + n(d) + ' | ' + n(e) + ') liegt ' + (e < 0 ? 'unter' : 'über') + ' der x-Achse. Verschiebe <b>' + (e < 0 ? 'nach oben' : 'nach unten') + ' um ' + Math.abs(e) + ' Einheiten</b>. Neue Gleichung: y = ' + spf(d, 0) + '. Sie hat nur die Nullstelle x = ' + n(d) + '.' + (e <= 6 && e >= -4 ? spGraph(d, 0, { marks: true }) : ''),
        verify: function () { return cntByMin(-2 * d, d * d) === 1 && cntByMin(-2 * d, d * d + e) === (e < 0 ? 0 : 2) || 'falsch'; } };
    },
    ball: function () {
      var v = M.pick([10, 20, 30, 15, 25]), Hm = v * v / 20, reach = Math.random() < 0.5, H0 = reach ? M.pick([Hm - 5, Hm - 2, Hm - 1]) : M.pick([Hm + 1, Hm + 3, Hm + 5]);
      H0 = Math.max(1, Math.round(H0)); if (H0 === Hm) H0 += 1; var yes = H0 < Hm;
      var pp = -v / 5, qq = H0 / 5, D = pp * pp / 4 - qq;
      return { skill: 'Anzahl der Lösungen im Sachzusammenhang', level: 3, q: 'Ein Ball wird senkrecht nach oben geworfen. Seine Höhe nach t Sekunden ist h(t) = −5t² + ' + v + 't (in Metern).<br>a) Erreicht der Ball die Höhe <b>' + H0 + ' m</b>?<br>b) Welche Höhe erreicht der Ball nur ein einziges Mal? Das ist seine größte Höhe.',
        inputs: [{ kind: 'mc', label: 'a) Erreicht der Ball ' + H0 + ' m?', options: ['Ja, die Gleichung hat Lösungen.', 'Nein, die Gleichung hat keine Lösung.'], answer: yes ? 0 : 1 }, { kind: 'num', answer: Hm, tol: 0.005, label: 'b) größte Höhe', unit: 'm' }],
        hints: ['a) Setze h(t) = ' + H0 + ': −5t² + ' + v + 't = ' + H0 + '. Bringe alles auf eine Seite und teile durch −5: t² − ' + n(v / 5) + 't + ' + n(H0 / 5) + ' = 0.', 'Diskriminante: (' + half('p') + ')² − q = ' + par(-v / 10) + '² − ' + n(H0 / 5) + ' = ' + n(D) + '. Ist sie negativ, wird die Höhe nie erreicht.', 'b) Für eine Höhe H lautet die Gleichung t² − ' + n(v / 5) + 't + H : 5 = 0. Genau einmal erreicht heißt D = 0, also ' + n(v * v / 100) + ' − H : 5 = 0.'],
        solution: 'a) −5t² + ' + v + 't = ' + H0 + ' ⇔ t² − ' + n(v / 5) + 't + ' + n(H0 / 5) + ' = 0. D = ' + n(v * v / 100) + ' − ' + n(H0 / 5) + ' = ' + n(D) + (yes ? ' &gt; 0. <b>Ja</b>, der Ball erreicht ' + H0 + ' m (einmal beim Steigen, einmal beim Fallen).' : ' &lt; 0. <b>Nein</b>, ' + H0 + ' m erreicht der Ball nie.') + '<br>b) Für eine Höhe H: t² − ' + n(v / 5) + 't + H : 5 = 0, D = ' + n(v * v / 100) + ' − H : 5. D = 0 ⇔ H = 5 · ' + n(v * v / 100) + ' = <b>' + n(Hm) + ' m</b>. Diese Höhe wird nur im höchsten Punkt erreicht, nach ' + n(v / 10) + ' s.' +
          pgraph([{ f: function (t) { return -5 * t * t + v * t; }, from: 0, to: v / 5, vertex: [v / 10, Hm], vText: '' }], { marks: [{ x: v / 10, y: Hm, text: n(Hm) + ' m', color: '#b45309', dx: 0, dy: 24, anchor: 'middle' }], x: [0, Math.ceil(v / 5)], y: [0, Math.ceil((Hm + 5) / 5) * 5], gx: 1, gy: 5, lx: 1, ly: 10, tx: 't', ty: 'h', hline: { y: H0, text: 'h = ' + H0 }, label: 'Flugbahn des Balls', maxh: 260 }),
        mistakes: function (vv) { var b = M.parseNum(vv[1]); if (b !== null && Math.abs(b - v / 10) < 1e-9) return 'Das ist die Zeit bis zum höchsten Punkt. Gefragt ist die Höhe. Setze t = ' + n(v / 10) + ' in h(t) ein.'; return null; },
        verify: function () { var mx = -Infinity; for (var k = 0; k <= 4000; k++) { var t = k * v / 5 / 4000; mx = Math.max(mx, -5 * t * t + v * t); } return Math.abs(mx - Hm) < 1e-6 && (D > 0) === yes || 'Ball falsch'; } };
    }
  };

  var THREE = '<div style="display:flex;flex-wrap:wrap;gap:6px 14px">' + [[-3, 'D &gt; 0: zwei Lösungen'], [0, 'D = 0: eine Lösung'], [2, 'D &lt; 0: keine Lösung']].map(function (c) {
    return '<div style="flex:1 1 180px;max-width:230px">' + spGraph(1, c[0], { marks: true, maxw: 230 }).replace(/S\(1 \| [−\d]+\)/, 'S') + '<p style="margin:0;text-align:center;font-weight:700">' + c[1] + '</p></div>'; }).join('') + '</div>';
  return {
    id: '016', title: 'Anzahl der Lösungen', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'p-q-Formel (Modul 015), Normalparabel und Scheitelpunktform',
    lead: 'Manche quadratischen Gleichungen haben zwei Lösungen, manche eine, manche gar keine. Du lernst, das vorher zu erkennen, rechnerisch und am Graphen.',
    einstieg: { html: '<p>Mia, Ben und Lara lösen jeweils eine quadratische Gleichung mit der p-q-Formel.</p><ul><li>Mia: x² − 6x + 5 = 0 ergibt x = 3 ± ' + sq('4') + '.</li><li>Ben: x² − 6x + 9 = 0 ergibt x = 3 ± ' + sq('0') + '.</li><li>Lara: x² − 6x + 13 = 0 ergibt x = 3 ± ' + sq('−4') + '.</li></ul><p class="note">Mia findet zwei Lösungen, Ben nur eine. Lara kommt nicht weiter. Woran liegt das? Und was hat das mit den Parabeln y = x² − 6x + q zu tun?</p><p>Entscheidend ist die Zahl unter der Wurzel, die <b>Diskriminante</b>. Am Graphen siehst du dasselbe: Die Parabel schneidet die x-Achse zweimal, berührt sie oder verfehlt sie.</p>' },
    ziele: ['Ich berechne die Diskriminante D = (' + half('p') + ')² − q.', 'Ich entscheide mit D, ob eine quadratische Gleichung zwei, eine oder keine Lösung hat.', 'Ich erkenne die Anzahl der Lösungen am Graphen als Schnittpunkte mit der x-Achse.', 'Ich lese an der Scheitelpunktform ab, wie viele Nullstellen eine Parabel hat.', 'Ich bestimme einen Parameter so, dass es genau eine Lösung gibt.'],
    fachwoerter: [['Diskriminante D', 'Der Term unter der Wurzel in der p-q-Formel: D = (' + half('p') + ')² − q.'], ['Nullstelle', 'Eine Stelle x, an der die Parabel die x-Achse schneidet oder berührt. Dort ist y = 0.'], ['Berühren', 'Die Parabel trifft die x-Achse nur in ihrem Scheitelpunkt. Dann gibt es genau eine Lösung.'], ['Parameter', 'Eine Zahl in einer Gleichung, die man verändern kann, zum Beispiel q in x² + 4x + q = 0.']],
    diagnose: [
      { q: 'Welche Werte haben p und q in der Gleichung x² − 6x + 5 = 0?', options: ['p = −6 und q = 5', 'p = 6 und q = 5', 'p = −6 und q = −5', 'Weiß ich noch nicht'], answer: 0, why: 'Das Vorzeichen gehört dazu: p = −6, q = 5.', review: 'p und q ablesen (Modul 015)' },
      { q: 'Berechne (−3)² − 7.', options: ['2', '−16', '16', 'Weiß ich noch nicht'], answer: 0, why: '(−3)² = 9 und 9 − 7 = 2.', review: 'Quadrieren und Vorzeichenregeln' },
      { q: 'Welchen Scheitelpunkt hat die Parabel y = (x − 2)² + 3?', options: ['S(2 | 3)', 'S(−2 | 3)', 'S(3 | 2)', 'Weiß ich noch nicht'], answer: 0, why: 'Bei y = (x − d)² + e ist S(d | e), hier S(2 | 3).', review: 'Scheitelpunktform der Normalparabel' },
      { q: 'Für welche Zahl gibt es keine Quadratwurzel (in den bekannten Zahlen)?', options: ['−9', '0', '2,25', 'Weiß ich noch nicht'], answer: 0, why: 'Jedes Quadrat ist größer oder gleich 0. Keine Zahl ergibt quadriert −9.', review: 'Quadratwurzeln' }],
    erklaerung:
      '<h3>1. Die Diskriminante entscheidet</h3><p>In der p-q-Formel x<sub>1,2</sub> = −' + half('p') + ' ± ' + sq('D') + ' steht unter der Wurzel die <b>Diskriminante</b> D = (' + half('p') + ')² − q.</p>' +
      '<div class="merk"><b>Merke:</b><br>D &gt; 0: <b>zwei Lösungen</b> (einmal + ' + sq('D') + ', einmal − ' + sq('D') + ')<br>D = 0: <b>genau eine Lösung</b>, x = −' + half('p') + '<br>D &lt; 0: <b>keine Lösung</b>, denn aus einer negativen Zahl kann man keine Wurzel ziehen.</div>' +
      '<p><b>Beispiel:</b> x² + 4x + 7 = 0. p = 4, q = 7, ' + half('p') + ' = 2. D = 2² − 7 = 4 − 7 = −3 &lt; 0. Die Gleichung hat keine Lösung. Du musst die Formel gar nicht weiterrechnen.</p>' +
      '<h3>2. Am Graphen</h3><p>Die Lösungen von x² + px + q = 0 sind die <b>Nullstellen</b> der Parabel y = x² + px + q. Die Normalparabel ist nach oben geöffnet. Deshalb kommt es nur darauf an, wo ihr Scheitelpunkt liegt:</p>' + THREE +
      '<div class="merk"><b>Merke:</b> Bei y = (x − d)² + e ist der Scheitelpunkt S(d | e).<br>e &lt; 0 (unter der x-Achse): zwei Nullstellen. e = 0 (auf der x-Achse): eine Nullstelle. e &gt; 0 (über der x-Achse): keine Nullstelle.</div>' +
      '<p class="note"><b>Zusammenhang:</b> Für y = x² + px + q liegt der Scheitelpunkt bei S(−' + half('p') + ' | −D). Die Diskriminante ist also genau so groß, wie weit der Scheitelpunkt unter der x-Achse liegt. Ist D negativ, liegt er darüber.</p>',
    entdecken: {
      html: '<p>Wähle p und verändere q mit dem Schieberegler. Beobachte die Diskriminante, den Scheitelpunkt und die Nullstellen.</p><div class="ctl"><label>p = <select id="e_p"><option value="-4">−4</option><option value="-2">−2</option><option value="0">0</option><option value="2" selected>2</option><option value="4">4</option></select></label><label>q = <b id="v_q"></b> <input type="range" id="r_q" min="-5" max="8" step="1" value="-3"></label></div><p class="big-math" id="e_eq"></p><div id="e_txt"></div><div id="e_g"></div><p class="note">Finde für jedes p den Wert von q, bei dem die Parabel die x-Achse gerade berührt.</p>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var p = +root.querySelector('#e_p').value, q = +root.querySelector('#r_q').value, h = p / 2, D = h * h - q, k = cidx(D), w = Math.sqrt(Math.max(D, 0));
          root.querySelector('#v_q').textContent = n(q);
          root.querySelector('#e_eq').innerHTML = eq0(p, q);
          root.querySelector('#e_txt').innerHTML = '<p>D = ' + par(h) + '² − ' + par(q) + ' = ' + inner(h, q) + ' = <b>' + n(D) + '</b> ⇒ <b>' + COUNT[k] + '</b>. Scheitelpunkt S(' + n(-h) + ' | ' + n(-D) + ') liegt ' + (k === 0 ? 'unter' : k === 1 ? 'auf' : 'über') + ' der x-Achse.</p>';
          var zs = k === 0 ? [-h - w, -h + w] : k === 1 ? [-h] : [];
          root.querySelector('#e_g').innerHTML = pgraph([{ f: function (x) { return fval(p, q, x); }, vertex: [-h, -D], vText: 'S', zeros: zs, zText: k === 0 ? ['x₁', 'x₂'] : [''] }], { x: [-7, 7], y: [-8, 9], label: 'Parabel zur Gleichung' });
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Der Scheitelpunkt liegt bei y = −D. Ist D positiv, liegt er unter der x-Achse und es gibt zwei Nullstellen. Bei D = 0 berührt die Parabel die x-Achse, bei negativem D gibt es keine Nullstelle.'); }
        root.querySelector('#e_p').addEventListener('change', hit);
        root.querySelector('#r_q').addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Genau eine Lösung erzwingen', q: 'Für welchen Wert von q hat die Gleichung x² − 8x + q = 0 genau eine Lösung?',
      steps: ['Genau eine Lösung gibt es, wenn die Diskriminante 0 ist.', 'p = −8, also ' + half('p') + ' = −4 und D = (−4)² − q = 16 − q.', '16 − q = 0 ⇒ <b>q = 16</b>.', 'Die Lösung ist x = −' + half('p') + ' = 4. Die Parabel y = x² − 8x + 16 = (x − 4)² berührt die x-Achse im Scheitelpunkt S(4 | 0).', 'Kontrolle: 4² − 8 · 4 + 16 = 16 − 32 + 16 = 0 ✓. Für q &lt; 16 gibt es zwei Lösungen, für q &gt; 16 keine.' + pqGraph(-8, 16, { maxw: 300 })] },
    tasks: { gen: gen,
      plan: { G: ['graph_anzahl:1', 'D_rechnen:1', 'anzahl:1', 'ablesen:1'], S: ['D_rechnen:2', 'anzahl:2', 'scheitel:2', 'verschieben:2', 'param_q:2'], E: ['D_rechnen:3', 'anzahl:3', 'scheitel:2', 'param_q:3', 'param_p:3', 'bereich:3'] },
      extra: 'ball', test: ['D_rechnen:2', 'anzahl:2', 'graph_anzahl:1', 'ablesen:2', 'scheitel:2', 'param_q:2'] },
    lerncheck: ['Ich berechne die Diskriminante einer quadratischen Gleichung.', 'Ich entscheide, ob es zwei, eine oder keine Lösung gibt.', 'Ich erkenne die Anzahl der Lösungen am Graphen der Parabel.', 'Ich bestimme einen Parameter so, dass es genau eine Lösung gibt.']
  };
})();
