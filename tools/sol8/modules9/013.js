/* Modul 013 (Klasse 9) · Scheitelpunktform und allgemeine Form */
var MODULE = (function () {
  /* ===== Gemeinsame Helfer für Parabeln (in jedem Modul identisch, Module sind eigenständig) ===== */
  var C_LINE = '#1e3a8a', C_FILL = '#e8eefc', C_ACC = '#d97706', C_HI = '#1d4ed8', C_CMP = '#0f766e';
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function par(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }
  /* Funktionswert von y = a(x − d)² + e */
  function fv(a, d, e, x) { return a * (x - d) * (x - d) + e; }
  /* " + 3" bzw. " − 3" (leer bei 0) */
  function pm(v) { return v === 0 ? '' : (v > 0 ? ' + ' + n(v) : ' − ' + n(-v)); }
  /* (x − 3) bzw. (x + 3) bzw. x */
  function xin(d) { return d === 0 ? 'x' : '(x' + pm(-d) + ')'; }
  function afac(a) { return a === 1 ? '' : a === -1 ? '−' : n(a); }
  /* Term der Scheitelpunktform, schön: 2(x − 1)² + 3 */
  function vterm(a, d, e) { if (a == null) a = 1; return afac(a) + xin(d) + '²' + pm(e); }
  function vform(a, d, e, lhs) { return (lhs || 'y') + ' = ' + vterm(a, d, e); }
  /* Term-String für die Prüfung */
  function vstr(a, d, e) { if (a == null) a = 1; var s = (a === 1 ? '' : a === -1 ? '-' : '(' + a + ')*') + (d === 0 ? 'x^2' : '(x' + (d > 0 ? '-' + d : '+' + (-d)) + ')^2'); return s + (e === 0 ? '' : (e > 0 ? '+' + e : String(e))); }
  /* allgemeine Form x² + px + q schön und als String */
  function gterm(p, q) { return M.poly([[1, 'x²'], [p, 'x'], [q, '']]); }
  function gstr(p, q) { return 'x^2' + (p ? (p > 0 ? '+' : '') + p + 'x' : '') + (q ? (q > 0 ? '+' : '') + q : ''); }
  function S(x, y) { return 'S(' + n(x) + ' | ' + n(y) + ')'; }
  /* Scheitelpunkt unabhängig über die Wertetabelle bestimmen (Schrittweite 0,5) */
  function tableVertex(f, lo, hi) {
    var best = null, worst = null;
    for (var x = lo; x <= hi + 1e-9; x += 0.5) { var y = f(x); if (!best || y < best[1] - 1e-9) best = [x, y]; if (!worst || y > worst[1] + 1e-9) worst = [x, y]; }
    return { min: best, max: worst };
  }
  /* Koordinatensystem mit Parabeln.
     curves: [{ a, d, e, color, width, dash, label, vertex: true|'S'|'coords'|Text, pts: [[x,y]] }]
     o: x, y (Ausschnitt [min,max]), u (Pixel je Einheit), maxw, cap (Buchstabe oben links), marks [{x,y,text,color,pos}], hl [{y,label}], label */
  function pgraph(curves, o) {
    o = o || {};
    var ds = curves.map(function (c) { return c.d || 0; }), es = curves.map(function (c) { return c.e || 0; });
    var up = curves.every(function (c) { return (c.a == null ? 1 : c.a) > 0; }), down = curves.every(function (c) { return (c.a == null ? 1 : c.a) < 0; });
    var dmin = Math.min.apply(null, ds), dmax = Math.max.apply(null, ds), emin = Math.min.apply(null, es), emax = Math.max.apply(null, es);
    var xr = o.x || [Math.min(-2, Math.floor(dmin) - 4), Math.max(2, Math.ceil(dmax) + 4)];
    var yr = o.y;
    if (!yr) {
      if (up) { yr = [Math.min(-2, Math.floor(emin) - 1)]; yr.push(Math.max(2, Math.ceil(emax) + 7, yr[0] + 9)); }
      else if (down) { yr = [0, Math.max(2, Math.ceil(emax) + 1)]; yr[0] = Math.min(-2, Math.floor(emin) - 7, yr[1] - 9); }
      else yr = [Math.min(-2, Math.floor(emin) - 5), Math.max(2, Math.ceil(emax) + 5)];
    }
    if (!o.x || !o.y) (o.marks || []).forEach(function (mk) {
      if (!o.x) xr = [Math.min(xr[0], Math.floor(mk.x) - 1), Math.max(xr[1], Math.ceil(mk.x) + 1)];
      if (!o.y) yr = [Math.min(yr[0], Math.floor(mk.y) - 1), Math.max(yr[1], Math.ceil(mk.y) + 2)];
    });
    var xl = xr[0] - 0.5, xh = xr[1] + 0.5, yl = yr[0] - 0.5, yh = yr[1] + 0.5;
    var u = o.u || Math.min(30, 300 / (xh - xl)), v = o.v || u;
    if (!o.v && v * (yh - yl) > 340) v = 340 / (yh - yl);
    var mg = 4, W = u * (xh - xl) + 2 * mg, H = v * (yh - yl) + 2 * mg;
    function X(x) { return mg + (x - xl) * u; } function Y(y) { return mg + (yh - y) * v; }
    function r1(z) { return Math.round(z * 10) / 10; }
    function stp(px) { var c = [1, 2, 5, 10, 20, 50]; for (var q = 0; q < c.length; q++) if (c[q] * px >= 19) return c[q]; return 100; }
    var sx = o.lab || stp(u), sy = o.laby || stp(v), gxs = u >= 9 ? 1 : sx, gys = v >= 9 ? 1 : sy;
    var halo = ' stroke="#fff" stroke-width="3" paint-order="stroke"';
    var g = '<svg class="viz" viewBox="0 0 ' + r1(W) + ' ' + r1(H) + '" role="img" aria-label="' + (o.label || 'Koordinatensystem mit Parabel') + '" style="max-width:' + (o.maxw || Math.min(360, Math.round(W * 1.15))) + 'px">';
    g += '<rect x="' + mg + '" y="' + mg + '" width="' + r1(W - 2 * mg) + '" height="' + r1(H - 2 * mg) + '" fill="#fbfcff"/>';
    var i;
    for (i = Math.ceil(xl / gxs) * gxs; i <= xh; i += gxs) g += '<line x1="' + r1(X(i)) + '" y1="' + r1(Y(yh)) + '" x2="' + r1(X(i)) + '" y2="' + r1(Y(yl)) + '" stroke="#dbe3f4"/>';
    for (i = Math.ceil(yl / gys) * gys; i <= yh; i += gys) g += '<line x1="' + r1(X(xl)) + '" y1="' + r1(Y(i)) + '" x2="' + r1(X(xh)) + '" y2="' + r1(Y(i)) + '" stroke="#dbe3f4"/>';
    /* Achsen mit Pfeilspitzen */
    g += '<line x1="' + r1(X(xl)) + '" y1="' + r1(Y(0)) + '" x2="' + r1(X(xh) - 2) + '" y2="' + r1(Y(0)) + '" stroke="#1b2540" stroke-width="1.5"/><path d="M' + r1(X(xh)) + ' ' + r1(Y(0)) + ' l-8 -4 v8 z" fill="#1b2540"/>';
    g += '<line x1="' + r1(X(0)) + '" y1="' + r1(Y(yl)) + '" x2="' + r1(X(0)) + '" y2="' + r1(Y(yh) + 2) + '" stroke="#1b2540" stroke-width="1.5"/><path d="M' + r1(X(0)) + ' ' + r1(Y(yh)) + ' l-4 8 h8 z" fill="#1b2540"/>';
    var fs = Math.min(u, v) >= 20 ? 10 : 9, ticks = '';
    for (i = Math.ceil(xr[0] / sx) * sx; i <= xr[1]; i += sx) if (i !== 0 && i < xh - 0.6) ticks += '<line x1="' + r1(X(i)) + '" y1="' + r1(Y(0) - 3) + '" x2="' + r1(X(i)) + '" y2="' + r1(Y(0) + 3) + '" stroke="#1b2540"/><text x="' + r1(X(i)) + '" y="' + r1(Y(0) + 13) + '" font-size="' + fs + '" text-anchor="middle" fill="#334155"' + halo + '>' + n(i) + '</text>';
    for (i = Math.ceil(yr[0] / sy) * sy; i <= yr[1]; i += sy) if (i !== 0 && Y(i) > Y(yh) + 14) ticks += '<line x1="' + r1(X(0) - 3) + '" y1="' + r1(Y(i)) + '" x2="' + r1(X(0) + 3) + '" y2="' + r1(Y(i)) + '" stroke="#1b2540"/><text x="' + r1(X(0) - 5) + '" y="' + r1(Y(i) + 3.5) + '" font-size="' + fs + '" text-anchor="end" fill="#334155"' + halo + '>' + n(i) + '</text>';
    g += '<text x="' + r1(X(0) - 5) + '" y="' + r1(Y(0) + 13) + '" font-size="' + fs + '" text-anchor="end" fill="#334155">0</text>';
    g += '<text x="' + r1(X(xh) - 4) + '" y="' + r1(Y(0) - 7) + '" font-size="12" font-weight="700" text-anchor="end" font-style="italic">x</text><text x="' + r1(X(0) + 8) + '" y="' + r1(Y(yh) + 11) + '" font-size="12" font-weight="700" font-style="italic">y</text>';
    (o.hl || []).forEach(function (L) {
      g += '<line x1="' + r1(X(xl)) + '" y1="' + r1(Y(L.y)) + '" x2="' + r1(X(xh)) + '" y2="' + r1(Y(L.y)) + '" stroke="' + (L.color || C_CMP) + '" stroke-width="2" stroke-dasharray="6 4"/>';
      if (L.label) g += '<text x="' + r1(X(xh) - 4) + '" y="' + r1(Y(L.y) - 5) + '" font-size="11" font-weight="700" text-anchor="end" fill="' + (L.color || C_CMP) + '"' + halo + '>' + L.label + '</text>';
    });
    var later = '';
    curves.forEach(function (c, idx) {
      var a = c.a == null ? 1 : c.a, d = c.d || 0, e = c.e || 0, col = c.color || C_HI;
      var N = 400, segs = [], cur = [], prev = null;
      for (var k = 0; k <= N; k++) {
        var x = xl + (xh - xl) * k / N, y = fv(a, d, e, x), ins = y >= yl && y <= yh;
        if (prev) {
          var pin = prev[1] >= yl && prev[1] <= yh;
          if (pin !== ins) { /* Randpunkt durch lineare Interpolation */
            var yb = (ins ? prev[1] : y) > yh ? yh : yl, t = (yb - prev[1]) / (y - prev[1]), xb = prev[0] + t * (x - prev[0]);
            cur.push([xb, yb]); if (!ins) { segs.push(cur); cur = []; }
          }
        }
        if (ins) cur.push([x, y]);
        prev = [x, y];
      }
      if (cur.length) segs.push(cur);
      segs.forEach(function (sg) { if (sg.length > 1) g += '<polyline points="' + sg.map(function (p) { return r1(X(p[0])) + ',' + r1(Y(p[1])); }).join(' ') + '" fill="none" stroke="' + col + '" stroke-width="' + (c.width || 2.8) + '" stroke-linejoin="round" stroke-linecap="round"' + (c.dash ? ' stroke-dasharray="7 5"' : '') + '/>'; });
      if (c.label) { /* Beschriftung am rechten Ast, knapp unterhalb des oberen bzw. oberhalb des unteren Randes */
        var yt = a > 0 ? Math.min(yh - 18 / v, e + 9 * Math.abs(a)) : Math.max(yl + 18 / v, e - 9 * Math.abs(a)), xt = d + Math.sqrt(Math.max(0, (yt - e) / a));
        if (c.labelLeft) xt = d - (xt - d);
        var anc = c.labelLeft ? 'end' : 'start', tx = X(xt) + (c.labelLeft ? -6 : 6);
        if (!c.labelLeft && tx > W - 40) { anc = 'end'; tx = X(xt) - 8; }
        if (c.labelLeft && tx < 40) { anc = 'start'; tx = X(xt) + 8; }
        later += '<text x="' + r1(tx) + '" y="' + r1(Y(yt) + 4) + '" font-size="12" font-weight="700" fill="' + col + '" text-anchor="' + anc + '"' + halo + '>' + c.label + '</text>';
      }
      (c.pts || []).forEach(function (p) { later += '<circle cx="' + r1(X(p[0])) + '" cy="' + r1(Y(p[1])) + '" r="4.5" fill="' + col + '" stroke="#fff" stroke-width="1.5"/>'; });
      if (c.vertex) {
        later += '<circle cx="' + r1(X(d)) + '" cy="' + r1(Y(e)) + '" r="5" fill="' + C_ACC + '" stroke="#fff" stroke-width="1.5"/>';
        var vt = c.vertex === true || c.vertex === 'S' ? 'S' : c.vertex === 'coords' ? S(d, e) : c.vertex;
        var vy = a > 0 ? Y(e) + 17 : Y(e) - 9, vx = d < 0 ? X(d) - 8 : X(d) + 8, va = d < 0 ? 'end' : 'start', tw = vt.length * 6.5;
        if (a > 0 && Math.abs(vy - Y(0) - 13) < 11) vy = Y(0) + 27;
        if (va === 'start' && vx + tw > W - 4) { vx = X(d) - 8; va = 'end'; }
        if (va === 'end' && vx - tw < 4) { vx = X(d) + 8; va = 'start'; }
        later += '<text x="' + r1(vx) + '" y="' + r1(vy) + '" font-size="12" font-weight="700" fill="#b45309" text-anchor="' + va + '"' + halo + '>' + vt + '</text>';
      }
    });
    g += ticks + later;
    (o.marks || []).forEach(function (mk) {
      var col = mk.color || '#1b2540';
      g += '<circle cx="' + r1(X(mk.x)) + '" cy="' + r1(Y(mk.y)) + '" r="5" fill="' + col + '" stroke="#fff" stroke-width="1.5"/>';
      if (mk.text) { var left = mk.pos === 'left', tx2 = X(mk.x) + (left ? -8 : 8), ty2 = Y(mk.y) + (mk.below ? 16 : -7); g += '<text x="' + r1(tx2) + '" y="' + r1(ty2) + '" font-size="12" font-weight="700" fill="' + col + '" text-anchor="' + (left ? 'end' : 'start') + '"' + halo + '>' + mk.text + '</text>'; }
    });
    if (o.cap) g += '<rect x="' + (mg + 3) + '" y="' + (mg + 3) + '" width="24" height="22" rx="5" fill="' + C_LINE + '"/><text x="' + (mg + 15) + '" y="' + (mg + 19) + '" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">' + o.cap + '</text>';
    return g + '</svg>';
  }
  /* ===== Ende gemeinsame Helfer ===== */
  function gap(t) { return '<span style="display:inline-block;min-width:1.7em;padding:0 4px;border:2px solid #1d4ed8;border-radius:6px;text-align:center;font-weight:700;color:#1d4ed8;background:#fff">' + t + '</span>'; }
  function big(s) { return '<span class="big-math">' + s + '</span>'; }
  function pickDE(lvl) { var d = lvl >= 2 ? M.nz(-6, 6) : M.nz(-4, 4), e = lvl >= 2 ? M.rnd(-9, 9) : M.rnd(-5, 5); return [d, e]; }
  /* allgemeine Form zu S(d | e): p = −2d, q = d² + e */
  function pq(d, e) { return [-2 * d, d * d + e]; }
  function sameCoeffs(d, e, p, q) { var t = M.parseTerm(vstr(1, d, e)), u = M.parseTerm(gstr(p, q)); for (var x = -3; x <= 3; x++) if (Math.abs(M.evalTree(t, { x: x }) - M.evalTree(u, { x: x })) > 1e-9) return false; return true; }
  function qeSteps(p, q) {
    var h = -p / 2, k = h * h, d = -p / 2, e = q - k;
    return 'y = ' + gterm(p, q) + '<br>= x²' + pm(p).replace(/(\d)$/, '$1x') + ' + ' + n(k) + ' − ' + n(k) + pm(q) + '  <small>(quadratische Ergänzung: (' + n(p) + ' : 2)² = ' + n(k) + ')</small><br>= ' + xin(d) + '²' + ' − ' + n(k) + pm(q) + '<br>= <b>' + vterm(1, d, e) + '</b>';
  }
  function sMis(d, e) {
    return function (v) {
      var x = M.parseNum(v[v.length - 2]), y = M.parseNum(v[v.length - 1]);
      if (x !== null && x === -d) return 'Vorzeichen beachten: Aus ' + xin(d) + '² liest du d = ' + n(d) + ' ab, denn die Klammer wird 0 bei x = ' + n(d) + '.';
      if (y !== null && y === q2(d, e) + d * d) return 'Die quadratische Ergänzung ' + n(d * d) + ' musst du wieder <b>abziehen</b>, nicht addieren. Sonst ändert sich der Term.';
      if (y !== null && y === q2(d, e)) return 'e ist nicht einfach die Zahl q aus der allgemeinen Form. Ziehe noch die quadratische Ergänzung ' + n(d * d) + ' ab.';
      return null;
    };
  }
  function q2(d, e) { return d * d + e; }
  var gen = {
    binom: function (lvl) {
      var k = lvl >= 2 ? M.rnd(2, 12) : M.rnd(1, 9), minus = Math.random() < 0.5;
      return { skill: 'Binomische Formel', level: 1, q: 'Ergänze mit der binomischen Formel. ' + big('(x ' + (minus ? '−' : '+') + ' ' + k + ')² = x² ' + (minus ? '−' : '+') + ' ' + gap('a') + 'x + ' + gap('b')),
        inputs: [{ kind: 'num', answer: 2 * k, label: 'a =' }, { kind: 'num', answer: k * k, label: 'b =' }],
        hints: ['Nutze die ' + (minus ? '2. binomische Formel: (a − b)² = a² − 2ab + b²' : '1. binomische Formel: (a + b)² = a² + 2ab + b²') + '.', 'Das mittlere Glied ist das doppelte Produkt: 2 · x · ' + k + '.', 'Das letzte Glied ist ' + k + '² = ' + k * k + '.'],
        solution: '(x ' + (minus ? '−' : '+') + ' ' + k + ')² = x² ' + (minus ? '−' : '+') + ' 2 · x · ' + k + ' + ' + k + '² = <b>x² ' + (minus ? '−' : '+') + ' ' + 2 * k + 'x + ' + k * k + '</b>',
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === k) return 'Das mittlere Glied ist das <b>doppelte</b> Produkt: 2 · ' + k + ' = ' + 2 * k + '.'; if (b === 2 * k && k !== 2) return 'Das letzte Glied ist das Quadrat: ' + k + ' · ' + k + ', nicht ' + k + ' · 2.'; return null; },
        verify: function () { return M.termEq('(x' + (minus ? '-' : '+') + k + ')^2', 'x^2' + (minus ? '-' : '+') + 2 * k + 'x+' + k * k) || 'binom'; } };
    },
    ausmult: function (lvl) {
      var p = pickDE(lvl), d = p[0], e = p[1], c = pq(d, e);
      return { src: vstr(1, d, e), skill: 'Scheitelpunktform ausmultiplizieren', level: lvl >= 2 ? 2 : 1, q: 'Bringe die Gleichung in die allgemeine Form y = x² + px + q. ' + big(vform(1, d, e)),
        inputs: [{ kind: 'term', answer: gstr(c[0], c[1]), form: 'expanded', label: 'y =', placeholder: 'z. B. x^2 − 4x + 7' }],
        hints: ['Löse zuerst die Klammer mit der binomischen Formel auf: ' + xin(d) + '² = x² ' + (d > 0 ? '−' : '+') + ' 2 · x · ' + n(Math.abs(d)) + ' + ' + n(Math.abs(d)) + '².', xin(d) + '² = ' + gterm(-2 * d, d * d) + '.', 'Fasse ' + n(d * d) + pm(e) + ' zusammen.'],
        solution: 'y = ' + vterm(1, d, e) + '<br>= ' + gterm(-2 * d, d * d) + pm(e) + '<br>= <b>' + gterm(c[0], c[1]) + '</b>',
        mistakes: function (v) {
          if (M.termEq(v[0], gstr(0, d * d + e))) return 'Das mittlere Glied fehlt. (x ' + (d > 0 ? '−' : '+') + ' ' + Math.abs(d) + ')² ist nicht x² + ' + d * d + '. Nutze die binomische Formel.';
          if (M.termEq(v[0], gstr(2 * d, d * d + e))) return 'Achte auf das Vorzeichen des mittleren Glieds. Bei ' + xin(d) + '² ist es ' + (d > 0 ? 'negativ' : 'positiv') + '.';
          if (M.termEq(v[0], gstr(-2 * d, d * d))) return 'Du hast ' + pm(e).trim() + ' am Ende vergessen.';
          if (M.termEq(v[0], gstr(-d, d * d + e))) return 'Das mittlere Glied ist das <b>doppelte</b> Produkt: 2 · ' + Math.abs(d) + ' = ' + 2 * Math.abs(d) + '.';
          return null; },
        verify: function () { return sameCoeffs(d, e, c[0], c[1]) || 'ausmult'; } };
    },
    ergaenzung: function (lvl) {
      var h = lvl >= 2 ? M.nz(-8, 8) : M.rnd(1, 6), p = 2 * h;
      if (lvl < 2 && Math.random() < 0.5) p = -p;
      var k = (p / 2) * (p / 2);
      return { skill: 'Quadratische Ergänzung finden', level: lvl >= 2 ? 2 : 1, q: 'Welche Zahl musst du ergänzen, damit eine binomische Formel entsteht? ' + big(gterm(p, 0) + ' + ' + gap('?')),
        inputs: [{ kind: 'num', answer: k, label: 'Ergänzung' }],
        hints: ['Vergleiche mit x² ' + (p > 0 ? '+' : '−') + ' 2 · x · b + b². Das mittlere Glied ist ' + n(Math.abs(p)) + 'x.', '2 · b = ' + n(Math.abs(p)) + ', also b = ' + n(Math.abs(p) / 2) + '. Das ist die Hälfte der Zahl vor x.', 'Ergänzt wird b² = ' + n(Math.abs(p) / 2) + '² = ' + n(k) + '.'],
        solution: 'Halbiere die Zahl vor x und quadriere: (' + n(p) + ' : 2)² = ' + par(p / 2) + '² = <b>' + n(k) + '</b>.<br>Dann gilt ' + gterm(p, k) + ' = ' + xin(-p / 2) + '².',
        mistakes: function (v) { var z = M.parseNum(v[0]); if (z === null) return null; if (z === Math.abs(p / 2) || z === p / 2) return 'Du hast nur halbiert. Die Hälfte muss noch quadriert werden: ' + par(p / 2) + '² = ' + n(k) + '.'; if (z === p * p) return 'Erst halbieren, dann quadrieren: (' + n(p) + ' : 2)² = ' + n(k) + '.'; if (z === Math.abs(p) || z === 2 * Math.abs(p)) return 'Die Ergänzung ist das Quadrat der Hälfte der Zahl vor x.'; return null; },
        verify: function () { return M.termEq(gstr(p, k), vstr(1, -p / 2, 0)) || 'erg'; } };
    },
    qe_luecke: function (lvl) {
      var pp = pickDE(lvl), d = pp[0], e = pp[1], c = pq(d, e), p = c[0], q = c[1], k = d * d;
      return { skill: 'Quadratische Ergänzung (Lückentext)', level: 2, q: 'Forme mit quadratischer Ergänzung in die Scheitelpunktform um. Fülle die Lücken.<br>' + big('y = ' + gterm(p, q)) + '<br>' + big('y = x²' + (p > 0 ? ' + ' : ' − ') + n(Math.abs(p)) + 'x + ' + gap('a') + ' − ' + gap('a') + pm(q)) + '<br>' + big('y = (x − ' + gap('d') + ')² + ' + gap('e')),
        inputs: [{ kind: 'num', answer: k, label: 'a (quadratische Ergänzung) =' }, { kind: 'num', answer: d, label: 'd =' }, { kind: 'num', answer: e, label: 'e =' }],
        hints: ['Die quadratische Ergänzung ist das Quadrat der halben Zahl vor x: (' + n(p) + ' : 2)².', 'a = ' + n(k) + '. Dann ist x²' + pm(p) + 'x + ' + n(k) + ' = ' + xin(d) + '². Vergleiche mit (x − d)²: d = ' + n(d) + '.', 'e = −' + n(k) + pm(q) + ' = ' + n(e) + '.'],
        solution: qeSteps(p, q) + '<br>Also a = ' + n(k) + ', d = ' + n(d) + ', e = ' + n(e) + '. Scheitelpunkt ' + S(d, e) + '.',
        mistakes: sMis(d, e),
        verify: function () { var t = tableVertex(function (x) { return x * x + p * x + q; }, -12, 12); return (t.min[0] === d && t.min[1] === e && sameCoeffs(d, e, p, q)) || 'qe'; } };
    },
    umformen: function (lvl) {
      var pp = pickDE(lvl), d = pp[0], e = pp[1], c = pq(d, e), p = c[0], q = c[1];
      return { skill: 'In Scheitelpunktform umformen', level: lvl >= 3 ? 3 : 2, q: 'Bringe die Gleichung in die Scheitelpunktform y = (x − d)² + e. Gib d und e an. ' + big('y = ' + gterm(p, q)),
        inputs: [{ kind: 'num', answer: d, label: 'd =' }, { kind: 'num', answer: e, label: 'e =' }],
        hints: ['Quadratische Ergänzung: Halbiere ' + n(p) + ' und quadriere. Ergänze diese Zahl und ziehe sie gleich wieder ab.', 'y = x²' + pm(p) + 'x + ' + n(d * d) + ' − ' + n(d * d) + pm(q) + ' = ' + xin(d) + '² − ' + n(d * d) + pm(q) + '.', 'd = ' + n(d) + ' (Vorzeichen beachten!) und e = −' + n(d * d) + pm(q) + '.'],
        solution: qeSteps(p, q) + '<br>Also <b>d = ' + n(d) + '</b> und <b>e = ' + n(e) + '</b>.<br><small>Probe durch Ausmultiplizieren: ' + vterm(1, d, e) + ' = ' + gterm(-2 * d, d * d) + pm(e) + ' = ' + gterm(p, q) + '.</small>',
        mistakes: sMis(d, e),
        verify: function () { var t = tableVertex(function (x) { return x * x + p * x + q; }, -12, 12); return (t.min[0] === d && t.min[1] === e && sameCoeffs(d, e, p, q)) || 'umf'; } };
    },
    scheitel: function (lvl) {
      var pp = pickDE(lvl), d = pp[0], e = pp[1], c = pq(d, e), p = c[0], q = c[1];
      return { skill: 'Scheitelpunkt aus der allgemeinen Form', level: lvl >= 3 ? 3 : 2, q: 'Bestimme den Scheitelpunkt S der Parabel. ' + big('y = ' + gterm(p, q)),
        inputs: [{ kind: 'num', answer: d, label: 'x-Koordinate von S' }, { kind: 'num', answer: e, label: 'y-Koordinate von S' }],
        hints: ['Forme mit quadratischer Ergänzung in die Scheitelpunktform y = (x − d)² + e um.', 'Ergänzung: (' + n(p) + ' : 2)² = ' + n(d * d) + '. Es gilt y = ' + xin(d) + '² − ' + n(d * d) + pm(q) + '.', 'S(d | e) mit d = ' + n(d) + '. Für e rechne −' + n(d * d) + pm(q) + '.'],
        solution: qeSteps(p, q) + '<br>Scheitelpunkt <b>' + S(d, e) + '</b>.' + pgraph([{ a: 1, d: d, e: e, vertex: 'coords' }]) + '<small>Kontrolle: Setze x = ' + n(d) + ' in die allgemeine Form ein: ' + par(d) + '²' + pm(p) + ' · ' + par(d) + pm(q) + ' = ' + n(e) + '.</small>',
        mistakes: sMis(d, e),
        verify: function () { var t = tableVertex(function (x) { return x * x + p * x + q; }, -12, 12); return (t.min[0] === d && t.min[1] === e) || 'sch'; } };
    },
    zuordnen: function (lvl) {
      var pp = pickDE(lvl), d = pp[0], e = pp[1], c = pq(d, e);
      var cand = [gterm(c[0], c[1]), gterm(-c[0], c[1]), gterm(0, c[1]), gterm(c[0], e - d * d)];
      if (e - d * d === c[1] || gterm(0, c[1]) === gterm(c[0], c[1])) cand[3] = gterm(c[0], c[1] + 2 * d * d);
      var order = M.shuffle([0, 1, 2, 3]), opts = order.map(function (i) { return 'y = ' + cand[i]; });
      return { skill: 'Gleiche Parabeln erkennen', level: 1, q: 'Welche Gleichung beschreibt dieselbe Parabel wie ' + big(vform(1, d, e)) + '?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: order.indexOf(0) }],
        hints: ['Multipliziere die Klammer mit der binomischen Formel aus.', xin(d) + '² = ' + gterm(-2 * d, d * d) + '.', 'Addiere noch ' + n(e) + ': ' + n(d * d) + pm(e) + ' = ' + n(c[1]) + '.'],
        solution: vform(1, d, e) + ' = ' + gterm(-2 * d, d * d) + pm(e) + ' = <b>' + gterm(c[0], c[1]) + '</b>.',
        mistakes: function (v) { var i = order[+v[0]]; if (i === 1) return 'Prüfe das Vorzeichen des mittleren Glieds. ' + xin(d) + '² ergibt ' + (d > 0 ? '− ' : '+ ') + 2 * Math.abs(d) + 'x.'; if (i === 2) return 'Bei (a ± b)² entsteht immer auch das mittlere Glied 2ab.'; if (i === 3) return 'Die Zahl ' + n(d * d) + ' aus der binomischen Formel wird zu e addiert.'; return null; },
        verify: function () { return (sameCoeffs(d, e, c[0], c[1]) && new Set(cand).size === 4) || 'zu'; } };
    },
    allg_aus_s: function (lvl) {
      var pp = pickDE(lvl), d = pp[0], e = pp[1], c = pq(d, e);
      return { src: vstr(1, d, e), skill: 'Allgemeine Form aus dem Scheitelpunkt', level: 3, q: 'Eine verschobene Normalparabel hat den Scheitelpunkt <b>' + S(d, e) + '</b>. Gib ihre Gleichung in der allgemeinen Form y = x² + px + q an.',
        inputs: [{ kind: 'term', answer: gstr(c[0], c[1]), form: 'expanded', label: 'y =', placeholder: 'z. B. x^2 + 6x + 4' }],
        hints: ['Stelle zuerst die Scheitelpunktform auf: y = (x − d)² + e.', 'y = ' + vterm(1, d, e) + '.', 'Multipliziere aus: ' + xin(d) + '² = ' + gterm(-2 * d, d * d) + '. Addiere dann ' + n(e) + '.'],
        solution: 'Scheitelpunktform: y = ' + vterm(1, d, e) + '<br>Ausmultiplizieren: y = ' + gterm(-2 * d, d * d) + pm(e) + ' = <b>' + gterm(c[0], c[1]) + '</b>',
        mistakes: function (v) { if (M.termEq(v[0], vstr(1, -d, e))) return 'Vorzeichen beachten: Zu S(' + n(d) + ' | …) gehört die Klammer ' + xin(d) + '.'; if (M.termEq(v[0], gstr(0, d * d + e))) return 'Beim Ausmultiplizieren fehlt das mittlere Glied 2 · x · ' + Math.abs(d) + '.'; return null; },
        verify: function () { var t = tableVertex(function (x) { return x * x + c[0] * x + c[1]; }, -12, 12); return (t.min[0] === d && t.min[1] === e) || 'allg'; } };
    },
    nullstellen: function () {
      var d = M.nz(-5, 5), e = M.pick([-9, -4, -1, -2, 0, 1, 3, 4, 6]), c = pq(d, e), ans = e < 0 ? 2 : e === 0 ? 1 : 0;
      return { skill: 'Anzahl der Nullstellen begründen', level: 3, q: 'Lea behauptet: „Man sieht an der Scheitelpunktform sofort, wie oft die Parabel die x-Achse schneidet.“ Prüfe das an ' + big('y = ' + gterm(c[0], c[1])) + '<br>a) Bestimme den Scheitelpunkt. b) Wie viele Nullstellen hat die Parabel?',
        inputs: [{ kind: 'num', answer: d, label: 'a) x-Koordinate von S' }, { kind: 'num', answer: e, label: 'a) y-Koordinate von S' }, { kind: 'mc', label: 'b) Anzahl der Nullstellen', options: ['keine Nullstelle', 'genau eine Nullstelle', 'zwei Nullstellen'], answer: ans }],
        hints: ['Forme mit quadratischer Ergänzung um: (' + n(c[0]) + ' : 2)² = ' + n(d * d) + '.', 'Der Scheitelpunkt ist ' + S(d, e) + '. Die Parabel ist nach oben geöffnet.', 'Liegt S unterhalb der x-Achse, gibt es zwei Schnittpunkte. Liegt S auf der x-Achse, einen. Liegt S oberhalb, keinen.'],
        solution: qeSteps(c[0], c[1]) + '<br>a) Scheitelpunkt ' + S(d, e) + '.<br>b) Die Parabel ist nach oben geöffnet und S liegt ' + (e < 0 ? 'unterhalb der x-Achse. Es gibt <b>zwei Nullstellen</b>.' : e === 0 ? 'auf der x-Achse. Es gibt <b>genau eine Nullstelle</b>.' : 'oberhalb der x-Achse. Es gibt <b>keine Nullstelle</b>.') + pgraph([{ a: 1, d: d, e: e, vertex: 'coords' }]),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && x === -d) return 'a) Vorzeichen beachten: Aus ' + xin(d) + '² folgt d = ' + n(d) + '.'; if (+v[2] === 0 && e < 0) return 'b) S liegt unterhalb der x-Achse und die Parabel ist nach oben geöffnet. Sie muss die x-Achse also schneiden.'; return null; },
        verify: function () { var disc = c[0] * c[0] / 4 - c[1]; var exp = disc > 0 ? 2 : disc === 0 ? 1 : 0; return exp === ans || 'ns'; } };
    }
  };

  var area = '<svg class="viz" viewBox="0 0 300 220" role="img" aria-label="Flächenmodell zur quadratischen Ergänzung" style="max-width:340px">' +
    '<rect x="40" y="20" width="140" height="140" fill="#e8eefc" stroke="#1e3a8a" stroke-width="2"/><text x="110" y="96" font-size="18" font-weight="700" text-anchor="middle" fill="#1e3a8a">x²</text>' +
    '<rect x="180" y="20" width="60" height="140" fill="#d6e2fa" stroke="#1e3a8a" stroke-width="2"/><text x="210" y="96" font-size="16" font-weight="700" text-anchor="middle" fill="#1e3a8a">3x</text>' +
    '<rect x="40" y="160" width="140" height="44" fill="#d6e2fa" stroke="#1e3a8a" stroke-width="2"/><text x="110" y="188" font-size="16" font-weight="700" text-anchor="middle" fill="#1e3a8a">3x</text>' +
    '<rect x="180" y="160" width="60" height="44" fill="#fff7ed" stroke="#d97706" stroke-width="2.5" stroke-dasharray="6 4"/><text x="210" y="187" font-size="15" font-weight="700" text-anchor="middle" fill="#b45309">9</text>' +
    '<text x="110" y="14" font-size="13" text-anchor="middle">x</text><text x="210" y="14" font-size="13" text-anchor="middle">3</text><text x="30" y="94" font-size="13" text-anchor="end">x</text><text x="30" y="187" font-size="13" text-anchor="end">3</text>' +
    '<text x="248" y="187" font-size="12" fill="#b45309">fehlt</text></svg>';

  return {
    id: '013', title: 'Scheitelpunktform und allgemeine Form', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Binomische Formeln, Scheitelpunktform y = (x − d)² + e',
    lead: 'Dieselbe Parabel kann man auf zwei Arten aufschreiben. Du lernst, wie man zwischen der Scheitelpunktform und der allgemeinen Form hin und her wechselt.',
    einstieg: { html: '<p>Tom und Aylin sollen die Parabel mit dem Scheitelpunkt S(3 | −1) beschreiben. Tom schreibt <b>y = (x − 3)² − 1</b>. Aylin schreibt <b>y = x² − 6x + 8</b>. Beide behaupten, sie haben recht.</p><p class="note">Leitfrage: Können zwei so verschiedene Gleichungen dieselbe Parabel beschreiben? Und wie findet man bei Aylins Gleichung den Scheitelpunkt?</p><p>Probiere es aus: Für x = 5 erhält Tom (5 − 3)² − 1 = 3 und Aylin 25 − 30 + 8 = 3. Für x = 0 erhalten beide 8. Es lohnt sich, beide Formen zu kennen.</p>' + pgraph([{ a: 1, d: 3, e: -1, vertex: 'S(3 | −1)' }], { x: [-1, 7], y: [-2, 9], marks: [{ x: 0, y: 8, text: '(0 | 8)', color: C_CMP }, { x: 5, y: 3, text: '(5 | 3)', color: C_CMP }] }) },
    ziele: ['Ich multipliziere die Scheitelpunktform mit der binomischen Formel aus.', 'Ich finde die quadratische Ergänzung zu x² + px.', 'Ich forme die allgemeine Form y = x² + px + q in die Scheitelpunktform um.', 'Ich bestimme den Scheitelpunkt einer Parabel in allgemeiner Form.', 'Ich erkenne, ob zwei Gleichungen dieselbe Parabel beschreiben.'],
    fachwoerter: [['Scheitelpunktform', 'y = (x − d)² + e. Der Scheitelpunkt S(d | e) ist direkt ablesbar.'], ['allgemeine Form', 'y = x² + px + q (auch f(x) = x² + px + q). Hier sieht man sofort den Schnittpunkt mit der y-Achse (0 | q).'], ['quadratische Ergänzung', 'Die Zahl (p : 2)², die man zu x² + px addiert, damit eine binomische Formel entsteht. Sie wird gleich wieder abgezogen.'], ['binomische Formeln', '(a + b)² = a² + 2ab + b² und (a − b)² = a² − 2ab + b².']],
    diagnose: [
      { q: 'Welcher Term ist gleich (x + 5)²?', options: ['x² + 25', 'x² + 10x + 25', 'x² + 5x + 25', 'Weiß ich noch nicht'], answer: 1, why: '1. binomische Formel: x² + 2 · 5 · x + 5².', review: 'Binomische Formeln (Klasse 8)' },
      { q: 'Welcher Term ist gleich (x − 3)²?', options: ['x² − 6x + 9', 'x² − 6x − 9', 'x² + 9', 'Weiß ich noch nicht'], answer: 0, why: '2. binomische Formel: x² − 2 · 3 · x + 3² = x² − 6x + 9.', review: 'Binomische Formeln (Klasse 8)' },
      { q: 'Welchen Scheitelpunkt hat y = (x + 4)² − 2?', options: ['S(4 | −2)', 'S(−4 | 2)', 'S(−4 | −2)', 'Weiß ich noch nicht'], answer: 2, why: '(x + 4) = (x − (−4)), also d = −4. e = −2.', review: 'Parabeln verschieben (Modul 011)' },
      { q: 'Fasse zusammen: 16 − 25 + 7', options: ['−2', '−16', '2', 'Weiß ich noch nicht'], answer: 0, why: '16 − 25 = −9 und −9 + 7 = −2.', review: 'Rechnen mit negativen Zahlen' }],
    erklaerung:
      '<h3>1. Von der Scheitelpunktform zur allgemeinen Form</h3><p>Du multiplizierst die Klammer mit der binomischen Formel aus und fasst zusammen.</p>' +
      '<p class="big-math">y = (x − 3)² − 1 = x² − 6x + 9 − 1 = x² − 6x + 8</p>' +
      '<h3>2. Quadratische Ergänzung</h3><p>Umgekehrt willst du aus x² − 6x + 8 wieder eine Klammer machen. Dazu brauchst du die Form x² − 2 · 3 · x + 3². Es fehlt die Zahl 3² = 9. Das Flächenmodell zeigt das für x² + 6x: Zum vollständigen Quadrat mit der Seite x + 3 fehlt die Ecke 3 · 3 = 9.</p>' + area +
      '<div class="merk"><b>Merke:</b> Quadratische Ergänzung bei y = x² + px + q:<br>1. Halbiere p und quadriere: (p : 2)².<br>2. Addiere diese Zahl und ziehe sie sofort wieder ab. So ändert sich der Term nicht.<br>3. Fasse die ersten drei Glieder zur Klammer zusammen und rechne den Rest aus.<br>Ergebnis: y = (x − d)² + e mit dem Scheitelpunkt S(d | e).</div>' +
      '<p><b>Beispiel:</b> y = x² − 6x + 8<br>= x² − 6x <b>+ 9 − 9</b> + 8 &nbsp;&nbsp;<small>(denn (−6 : 2)² = 9)</small><br>= (x − 3)² − 9 + 8<br>= (x − 3)² − 1. Der Scheitelpunkt ist S(3 | −1).</p>' +
      '<p class="note"><b>Kontrolle:</b> Setze d in die allgemeine Form ein. 3² − 6 · 3 + 8 = −1. Das muss e sein.</p>' +
      '<p class="note"><b>Typische Fehler:</b> Die Ergänzung wird nur addiert und nicht wieder abgezogen. Oder das Vorzeichen in der Klammer wird falsch abgelesen: x² + 8x ergibt (x + 4)², also d = −4.</p>',
    entdecken: {
      html: '<p>Verändere den Scheitelpunkt. Vergleiche beide Formen derselben Parabel.</p><div class="ctl"><label>d = <b id="v_d"></b> <input type="range" id="r_d" min="-5" max="5" step="1" value="2"></label><label>e = <b id="v_e"></b> <input type="range" id="r_e" min="-5" max="5" step="1" value="-3"></label></div><div id="e_g"></div><p class="big-math" id="e_sf"></p><p class="big-math" id="e_af"></p><p id="e_tx"></p><ul><li>Wie hängt die Zahl vor x mit d zusammen?</li><li>Wo siehst du q im Graphen?</li></ul>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var d = +root.querySelector('#r_d').value, e = +root.querySelector('#r_e').value, c = pq(d, e);
          root.querySelector('#v_d').textContent = n(d); root.querySelector('#v_e').textContent = n(e);
          var yq = Math.max(-6, Math.min(10, c[1]));
          root.querySelector('#e_g').innerHTML = pgraph([{ a: 1, d: d, e: e, vertex: 'coords' }], { x: [-7, 7], y: [-6, 10], marks: c[1] <= 10 ? [{ x: 0, y: yq, text: '(0 | ' + n(c[1]) + ')', color: C_CMP, pos: d > 0 ? 'left' : 'right' }] : [] });
          root.querySelector('#e_sf').innerHTML = 'Scheitelpunktform: ' + vform(1, d, e);
          root.querySelector('#e_af').innerHTML = 'Allgemeine Form: y = ' + gterm(c[0], c[1]);
          root.querySelector('#e_tx').innerHTML = 'Die Zahl vor x ist −2 · d = ' + n(c[0]) + '. Die Zahl q = d² + e = ' + n(d * d) + pm(e) + ' = ' + n(c[1]) + ' ist der y-Achsenabschnitt.';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Aus S(d | e) wird y = x² − 2d · x + d² + e. Die Zahl vor x ist −2d, und q ist der Schnittpunkt mit der y-Achse.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Scheitelpunkt durch quadratische Ergänzung', q: 'Bestimme den Scheitelpunkt von y = x² + 8x + 11.',
      steps: ['Zahl vor x halbieren und quadrieren: (8 : 2)² = 4² = 16.', 'Ergänzen und wieder abziehen: y = x² + 8x + 16 − 16 + 11.', 'Binomische Formel rückwärts: x² + 8x + 16 = (x + 4)². Also y = (x + 4)² − 16 + 11 = (x + 4)² − 5.', 'Scheitelpunkt ablesen: (x + 4) = (x − (−4)), also S(−4 | −5).', 'Kontrolle: (−4)² + 8 · (−4) + 11 = 16 − 32 + 11 = −5. Stimmt.' + pgraph([{ a: 1, d: -4, e: -5, vertex: 'S(−4 | −5)' }], { x: [-8, 1], y: [-6, 12] })] },
    tasks: { gen: gen, plan: { G: ['binom:1', 'ausmult:1', 'ergaenzung:1', 'zuordnen:1'], S: ['binom:1', 'ausmult:1', 'ergaenzung:1', 'qe_luecke:2', 'scheitel:2'], E: ['ausmult:2', 'ergaenzung:2', 'qe_luecke:2', 'umformen:2', 'scheitel:3', 'allg_aus_s:3'] },
      extra: 'nullstellen', test: ['binom:1', 'ausmult:2', 'ergaenzung:2', 'qe_luecke:2', 'umformen:2', 'zuordnen:1'] },
    lerncheck: ['Ich multipliziere die Scheitelpunktform mit der binomischen Formel aus.', 'Ich finde die quadratische Ergänzung.', 'Ich forme die allgemeine Form in die Scheitelpunktform um.', 'Ich bestimme den Scheitelpunkt aus der allgemeinen Form.']
  };
})();
