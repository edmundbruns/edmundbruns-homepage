/* Modul 014 (Klasse 9) · Einfache quadratische Gleichungen */
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
  function big(s) { return '<span class="big-math">' + s + '</span>'; }
  function two(x1, x2) { return [{ kind: 'num', answer: x1, label: 'x₁ (kleinere Lösung) =' }, { kind: 'num', answer: x2, label: 'x₂ (größere Lösung) =' }]; }
  function sol2(x1, x2) { return 'L = {' + n(x1) + '; ' + n(x2) + '}, also x₁ = ' + n(x1) + ' und x₂ = ' + n(x2) + '.'; }
  /* Prüft beide Lösungen in der Gleichung f(x) = 0 und die Reihenfolge */
  function check2(f, x1, x2) { return (Math.abs(f(x1)) < 1e-9 && Math.abs(f(x2)) < 1e-9 && x1 < x2) || 'Probe: ' + f(x1) + ', ' + f(x2); }
  /* gemeinsame Fehlerprüfung für zwei Lösungen */
  function mis2(x1, x2, extra) {
    return function (v) {
      var a = M.parseNum(v[0]), b = M.parseNum(v[1]);
      if (a !== null && b !== null) {
        if (a === x2 && b === x1) return 'Die Zahlen stimmen, aber die Reihenfolge nicht: x₁ ist die kleinere, x₂ die größere Lösung.';
        if (a === b && (a === x1 || a === x2)) return 'Eine quadratische Gleichung kann zwei Lösungen haben. Suche auch die zweite Lösung.';
      }
      return extra ? extra(a, b) : null;
    };
  }
  function probe(fs, x) { return fs.replace(/x/g, par(x)); }
  var gen = {
    rein: function (lvl) {
      var k = M.rnd(2, 12), c = k * k, eq, f, step;
      if (lvl >= 3) { var r = M.nz(-9, 9); eq = 'x²' + pm(r) + ' = ' + n(c + r); f = function (x) { return x * x + r - (c + r); }; step = 'x²' + pm(r) + ' = ' + n(c + r) + ' | ' + (r > 0 ? '− ' + r : '+ ' + (-r)) + '<br>x² = ' + n(c) + '<br>'; }
      else if (lvl >= 2) { var a = M.rnd(2, 5); if (Math.random() < 0.5) { eq = n(a) + 'x² = ' + n(a * c); f = function (x) { return a * x * x - a * c; }; step = n(a) + 'x² = ' + n(a * c) + ' | : ' + a + '<br>x² = ' + n(c) + '<br>'; } else { eq = 'x² − ' + n(c) + ' = 0'; f = function (x) { return x * x - c; }; step = 'x² − ' + n(c) + ' = 0 | + ' + c + '<br>x² = ' + n(c) + '<br>'; } }
      else { eq = 'x² = ' + n(c); f = function (x) { return x * x - c; }; step = ''; }
      return { skill: 'Reinquadratische Gleichung', level: lvl, q: 'Löse die Gleichung. ' + big(eq), inputs: two(-k, k),
        hints: [lvl >= 2 ? 'Bringe die Gleichung zuerst auf die Form x² = Zahl.' : 'Welche Zahl ergibt mit sich selbst multipliziert ' + c + '?', 'x² = ' + c + '. Ziehe die Wurzel: √' + c + ' = ' + k + '.', 'Denke an die zweite Lösung: Auch (−' + k + ')² = ' + c + '.'],
        solution: step + 'x² = ' + n(c) + ' ⇒ x = −√' + c + ' oder x = √' + c + '<br>' + sol2(-k, k) + '<br><small>Probe: (−' + k + ')² = ' + c + ' und ' + k + '² = ' + c + '.</small>',
        mistakes: mis2(-k, k, function (a, b) { if (b === c / 2 || a === -c / 2) return 'x² bedeutet x · x. Du musst die Wurzel ziehen, nicht durch 2 teilen.'; if (b === c || b === c * c) return 'Gesucht ist x, nicht x². Ziehe die Wurzel aus ' + c + '.'; return null; }),
        verify: function () { return check2(f, -k, k); } };
    },
    verschoben: function (lvl) {
      var d = M.nz(-6, 6), k = M.rnd(1, lvl >= 2 ? 7 : 5), c = k * k, e = lvl >= 3 ? M.nz(-6, 6) : 0, x1 = d - k, x2 = d + k;
      var eq = xin(d) + '²' + pm(e) + ' = ' + n(c + e), f = function (x) { return (x - d) * (x - d) + e - (c + e); };
      return { skill: 'Gleichung (x − d)² = c', level: lvl, q: 'Löse die Gleichung. ' + big(eq), inputs: two(x1, x2),
        hints: [(e ? 'Bringe zuerst ' + n(e) + ' auf die andere Seite: ' + xin(d) + '² = ' + c + '. ' : '') + 'Die Klammer ist eine Zahl, deren Quadrat ' + c + ' ist.', 'Also ist x' + pm(-d) + ' = ' + k + ' oder x' + pm(-d) + ' = −' + k + '.', 'Löse beide einfachen Gleichungen: x = ' + n(d) + ' + ' + k + ' oder x = ' + n(d) + ' − ' + k + '.'],
        solution: (e ? eq + ' | ' + (e > 0 ? '− ' + e : '+ ' + (-e)) + '<br>' : '') + xin(d) + '² = ' + c + '<br>x' + pm(-d) + ' = ' + k + ' oder x' + pm(-d) + ' = −' + k + '<br>x = ' + n(x2) + ' oder x = ' + n(x1) + '<br>' + sol2(x1, x2) + '<br><small>Probe: ' + par(x1 - d) + '² = ' + c + ' und ' + par(x2 - d) + '² = ' + c + '.</small>',
        mistakes: mis2(x1, x2, function (a, b) { if (a === -d - k && b === -d + k) return 'Vorzeichenfehler: Aus ' + xin(d) + ' = ±' + k + ' folgt x = ' + n(d) + ' ± ' + k + '. Rechne ' + (d > 0 ? '+ ' + d : '− ' + (-d)) + ' auf beiden Seiten.'; if (a === -k && b === k) return 'Das wären die Lösungen von x² = ' + c + '. Hier steht aber ' + xin(d) + '² in der Gleichung.'; return null; }),
        verify: function () { return check2(f, x1, x2); } };
    },
    ausklammern: function (lvl) {
      var r = M.nz(-9, 9), a = lvl >= 2 ? M.rnd(2, 4) : 1, b = -a * r, eq, f = function (x) { return a * x * x + b * x; }, x1 = Math.min(0, r), x2 = Math.max(0, r);
      var form3 = lvl >= 3;
      eq = form3 ? afac(a) + 'x² = ' + n(-b) + 'x' : M.poly([[a, 'x²'], [b, 'x']]) + ' = 0';
      if (form3 && a === 1) eq = 'x² = ' + n(-b) + 'x';
      var inner = M.poly([[a, 'x'], [b, '']]);
      return { skill: 'Ausklammern und Nullprodukt', level: lvl, q: 'Löse die Gleichung durch Ausklammern. ' + big(eq), inputs: two(x1, x2),
        hints: [(form3 ? 'Bringe alles auf eine Seite: ' + M.poly([[a, 'x²'], [b, 'x']]) + ' = 0. ' : '') + 'Klammere x aus.', 'x · (' + inner + ') = 0. Ein Produkt ist 0, wenn einer der Faktoren 0 ist.', 'x = 0 oder ' + inner + ' = 0.'],
        solution: (form3 ? eq + ' | ' + (b > 0 ? '+ ' : '− ') + n(Math.abs(b)) + 'x<br>' : '') + M.poly([[a, 'x²'], [b, 'x']]) + ' = 0<br>x · (' + inner + ') = 0<br>x = 0 oder ' + inner + ' = 0 ⇒ x = ' + n(r) + '<br>' + sol2(x1, x2),
        mistakes: mis2(x1, x2, function (p, q) { if (p === r || q === r) { if (p !== 0 && q !== 0) return 'Teile nie durch x! Dabei geht die Lösung x = 0 verloren. Klammere x aus.'; } if ((p === 0 || q === 0) && (p === -r || q === -r)) return 'Vorzeichen prüfen: ' + inner + ' = 0 ergibt x = ' + n(r) + '.'; return null; }),
        verify: function () { return check2(f, x1, x2); } };
    },
    nullprodukt: function (lvl) {
      var p = M.rnd(-8, 8), q; do { q = M.rnd(-8, 8); } while (q === p);
      var k = lvl >= 3 ? M.rnd(2, 4) : 1, f1 = M.poly([[k, 'x'], [-k * p, '']]), f2 = 'x' + pm(-q);
      var eq = '(' + f1 + ')(' + f2 + ') = 0', f = function (x) { return (k * x - k * p) * (x - q); }, x1 = Math.min(p, q), x2 = Math.max(p, q);
      if (f1 === 'x') eq = 'x · (' + f2 + ') = 0';
      if (f2 === 'x') eq = '(' + f1 + ') · x = 0';
      return { skill: 'Satz vom Nullprodukt', level: lvl, q: 'Löse die Gleichung. ' + big(eq), inputs: two(x1, x2),
        hints: ['Ein Produkt ist 0, wenn mindestens ein Faktor 0 ist.', 'Setze jeden Faktor gleich 0: ' + f1 + ' = 0 oder ' + f2 + ' = 0.', 'Löse beide Gleichungen. Achte auf die Vorzeichen.'],
        solution: f1 + ' = 0 ⇒ x = ' + n(p) + '<br>' + f2 + ' = 0 ⇒ x = ' + n(q) + '<br>' + sol2(x1, x2) + '<br><small>Probe: Für beide Werte wird ein Faktor 0, also das ganze Produkt 0.</small>',
        mistakes: mis2(x1, x2, function (a, b) { if (a === Math.min(-p, -q) && b === Math.max(-p, -q) && (p || q)) return 'Vorzeichenfehler: ' + f2 + ' = 0 ergibt x = ' + n(q) + ', nicht ' + n(-q) + '.'; return null; }),
        verify: function () { return check2(f, x1, x2); } };
    },
    anzahl: function (lvl) {
      var d = M.nz(-5, 5), kind = M.rnd(0, 2), c = kind === 0 ? -M.pick([1, 4, 9, 2, 5]) : kind === 1 ? 0 : M.pick([1, 4, 9, 16, 3, 7]), eq, disc;
      if (lvl >= 2) { eq = xin(d) + '²' + pm(-c) + ' = 0'; } else { eq = (Math.random() < 0.5 ? 'x²' : xin(d) + '²') + ' = ' + n(c); }
      var ans = c < 0 ? 0 : c === 0 ? 1 : 2;
      disc = c; /* (x − d)² = c */
      return { skill: 'Anzahl der Lösungen', level: lvl, q: 'Wie viele Lösungen hat die Gleichung? ' + big(eq),
        inputs: [{ kind: 'mc', label: 'Anzahl', options: ['keine Lösung', 'genau eine Lösung', 'zwei Lösungen'], answer: ans }],
        hints: [lvl >= 2 ? 'Bringe die Zahl auf die rechte Seite: ' + (eq.indexOf('(') === 0 ? xin(d) : 'x') + '² = ' + n(c) + '.' : 'Links steht ein Quadrat. Ein Quadrat ist nie negativ.', 'Ist die rechte Seite negativ, gibt es keine Lösung. Ist sie 0, genau eine. Ist sie positiv, zwei.', 'Rechts steht ' + n(c) + '.'],
        solution: 'Das Quadrat muss ' + n(c) + ' ergeben. ' + (c < 0 ? 'Ein Quadrat ist nie negativ. Es gibt <b>keine Lösung</b>.' : c === 0 ? 'Nur 0² = 0. Die Klammer muss 0 sein, es gibt <b>genau eine Lösung</b>.' : 'Die Klammer kann ' + (Number.isInteger(Math.sqrt(c)) ? Math.sqrt(c) + ' oder −' + Math.sqrt(c) : '√' + c + ' oder −√' + c) + ' sein. Es gibt <b>zwei Lösungen</b>.') + (lvl >= 2 ? pgraph([{ a: 1, d: d, e: -c, vertex: true }]) + '<small>Grafisch: Die Parabel y = ' + vterm(1, d, -c) + ' hat ' + ['keinen', 'genau einen', 'zwei'][ans] + ' Schnittpunkt' + (ans === 2 ? 'e' : '') + ' mit der x-Achse.</small>' : ''),
        mistakes: function (v) { if (+v[0] === 2 && c < 0) return 'Ein Quadrat kann nie negativ sein. Probiere es: Auch (−3)² ist positiv.'; if (+v[0] === 2 && c === 0) return 'Nur die Zahl 0 ergibt quadriert 0. Es gibt nur eine Lösung.'; return null; },
        verify: function () { var cnt = 0; for (var x = -40; x <= 40; x += 0.25) { var y1 = fv(1, d, -disc, x), y2 = fv(1, d, -disc, x + 0.25); if (y1 === 0 || (y1 < 0 && y2 > 0) || (y1 > 0 && y2 < 0)) cnt++; } return cnt === ans || 'anzahl ' + cnt; } };
    },
    probe: function () {
      var r1 = M.nz(-6, 6), r2; do { r2 = M.nz(-6, 6); } while (r2 === r1 || r2 === -r1);
      var p = -(r1 + r2), q = r1 * r2, f = function (x) { return x * x + p * x + q; };
      var sets = [[r1, r2], [-r1, -r2], [r1, -r2], [-r1, r2]].map(function (s) { return s.slice().sort(function (a, b) { return a - b; }); });
      var opts = M.shuffle(sets.map(function (s) { return 'x = ' + n(s[0]) + ' und x = ' + n(s[1]); })), right = 'x = ' + n(Math.min(r1, r2)) + ' und x = ' + n(Math.max(r1, r2));
      return { skill: 'Lösungen durch Einsetzen prüfen', level: 2, q: 'Welche beiden Zahlen sind die Lösungen der Gleichung? Prüfe durch Einsetzen. ' + big(gterm(p, q) + ' = 0'),
        inputs: [{ kind: 'mc', label: 'Lösungen', options: opts, answer: opts.indexOf(right) }],
        hints: ['Setze die Zahlen nacheinander für x ein. Nur wenn 0 herauskommt, ist die Zahl eine Lösung.', 'Teste zum Beispiel x = ' + n(r1) + ': ' + par(r1) + '²' + pm(p) + ' · ' + par(r1) + pm(q) + ' = ' + n(f(r1)) + '.', 'Teste auch x = ' + n(-r1) + ': Das ergibt ' + n(f(-r1)) + '.'],
        solution: 'x = ' + n(r1) + ': ' + par(r1) + '²' + pm(p) + ' · ' + par(r1) + pm(q) + ' = 0 ✓<br>x = ' + n(r2) + ': ' + par(r2) + '²' + pm(p) + ' · ' + par(r2) + pm(q) + ' = 0 ✓<br>Richtig ist also <b>' + right + '</b>. <small>Hinweis: ' + gterm(p, q) + ' = (x' + pm(-r1) + ')(x' + pm(-r2) + ').</small>',
        verify: function () { var ok = sets.filter(function (s) { return Math.abs(f(s[0])) < 1e-9 && Math.abs(f(s[1])) < 1e-9; }); return (ok.length === 1 && new Set(opts).size === 4) || 'probe'; } };
    },
    grafisch: function (lvl) {
      var d = M.rnd(-3, 3), k = M.rnd(1, 3), e = -k * k, x1 = d - k, x2 = d + k;
      return { skill: 'Quadratische Gleichung grafisch lösen', level: 2, q: 'Der Graph zeigt die Parabel y = ' + vterm(1, d, e) + '. Lies die Lösungen der Gleichung ' + big(vterm(1, d, e) + ' = 0') + ' ab.' + pgraph([{ a: 1, d: d, e: e }], { x: [Math.min(-2, d - 5), Math.max(2, d + 5)], y: [Math.min(-2, e - 1), 8] }),
        inputs: two(x1, x2),
        hints: ['Die Lösungen von … = 0 sind die x-Werte, bei denen y = 0 ist.', 'Suche die Schnittpunkte der Parabel mit der x-Achse (die Nullstellen).', 'Kontrolliere rechnerisch: ' + xin(d) + '² = ' + n(-e) + '.'],
        solution: 'Die Parabel schneidet die x-Achse bei x = ' + n(x1) + ' und x = ' + n(x2) + '. ' + sol2(x1, x2) + '<br>Rechnerisch: ' + xin(d) + '² = ' + n(-e) + ' ⇒ x' + pm(-d) + ' = ±' + k + ' ⇒ x = ' + n(d) + ' ± ' + k + '.' + pgraph([{ a: 1, d: d, e: e, vertex: 'coords' }], { x: [Math.min(-2, d - 5), Math.max(2, d + 5)], y: [Math.min(-2, e - 1), 8], marks: [{ x: x1, y: 0, color: C_CMP }, { x: x2, y: 0, color: C_CMP }] }),
        mistakes: mis2(x1, x2, function (a, b) { if (a === e || b === e) return 'Gesucht sind die Nullstellen, also die Stellen auf der x-Achse, nicht der Scheitelpunkt.'; return null; }),
        verify: function () { return check2(function (x) { return fv(1, d, e, x); }, x1, x2); } };
    },
    fall: function () {
      var t = M.rnd(2, 6), s = 5 * t * t;
      return { skill: 'Quadratische Gleichung im Sachzusammenhang', level: 3, q: 'Für einen fallenden Stein gilt näherungsweise s = 5t² (s: Fallstrecke in m, t: Zeit in s). Ein Stein fällt von einer ' + s + ' m hohen Klippe ins Wasser. Nach wie vielen Sekunden kommt er unten an?',
        inputs: [{ kind: 'num', answer: t, label: 'Zeit t', unit: 's' }],
        hints: ['Setze s = ' + s + ' ein: ' + s + ' = 5t².', 'Teile durch 5: t² = ' + s / 5 + '.', 'Ziehe die Wurzel. Die negative Lösung passt nicht, denn eine Zeit ist positiv.'],
        solution: s + ' = 5t² | : 5<br>t² = ' + s / 5 + '<br>t = ' + t + ' oder t = −' + t + '. Eine negative Zeit ergibt hier keinen Sinn.<br>Der Stein ist nach <b>' + t + ' s</b> unten.',
        mistakes: function (v) { var z = M.parseNum(v[0]); if (z === s / 5) return 'Das ist t². Du musst noch die Wurzel ziehen.'; if (z === -t) return 'Rechnerisch richtig, aber eine Zeit kann nicht negativ sein. Wähle die positive Lösung.'; if (z === s / 10) return 't² bedeutet t · t. Ziehe die Wurzel, statt durch 2 zu teilen.'; return null; },
        verify: function () { return 5 * t * t === s || 'fall'; } };
    },
    raetsel: function () {
      if (Math.random() < 0.5) {
        var k = M.nz(-9, 12); if (k === 1) k = 7;
        var x1 = Math.min(0, k), x2 = Math.max(0, k);
        return { skill: 'Zahlenrätsel mit quadratischer Gleichung', level: 3, q: 'Zahlenrätsel: „Das Quadrat einer Zahl ist genauso groß wie das ' + (k < 0 ? '(' + n(k) + ')' : n(k)) + '-Fache der Zahl.“ Welche Zahlen können gemeint sein?', inputs: two(x1, x2),
          hints: ['Stelle eine Gleichung auf: x² = ' + par(k) + ' · x.', 'Bringe alles auf eine Seite: x² ' + (k > 0 ? '− ' + k : '+ ' + (-k)) + 'x = 0, und klammere x aus.', 'x · (x' + pm(-k) + ') = 0. Satz vom Nullprodukt!'],
          solution: 'x² = ' + par(k) + 'x ⇒ x² ' + (k > 0 ? '− ' + k : '+ ' + (-k)) + 'x = 0 ⇒ x · (x' + pm(-k) + ') = 0 ⇒ x = 0 oder x = ' + n(k) + '.<br>' + sol2(x1, x2) + '<br><small>Probe: 0² = ' + par(k) + ' · 0 und ' + par(k) + '² = ' + par(k) + ' · ' + par(k) + '.</small>',
          mistakes: mis2(x1, x2, function (a, b) { if (a !== 0 && b !== 0 && (a === k || b === k)) return 'Auch die Zahl 0 erfüllt das Rätsel: 0² = 0 = ' + par(k) + ' · 0. Teile nicht durch x, sondern klammere aus.'; return null; }),
          verify: function () { return check2(function (x) { return x * x - k * x; }, x1, x2); } };
      }
      var m = M.rnd(2, 9), r = M.rnd(3, 9), y1 = m - r, y2 = m + r;
      return { skill: 'Zahlenrätsel mit quadratischer Gleichung', level: 3, q: 'Zahlenrätsel: „Ich subtrahiere von meiner Zahl ' + m + ' und quadriere das Ergebnis. Dann erhalte ich ' + r * r + '.“ Welche Zahlen können gemeint sein?', inputs: two(y1, y2),
        hints: ['Stelle die Gleichung auf: (x − ' + m + ')² = ' + r * r + '.', 'Die Klammer ist ' + r + ' oder −' + r + '.', 'x − ' + m + ' = ' + r + ' oder x − ' + m + ' = −' + r + '.'],
        solution: '(x − ' + m + ')² = ' + r * r + ' ⇒ x − ' + m + ' = ' + r + ' oder x − ' + m + ' = −' + r + ' ⇒ x = ' + n(y2) + ' oder x = ' + n(y1) + '.<br>' + sol2(y1, y2) + '<br><small>Probe: (' + n(y1) + ' − ' + m + ')² = ' + par(-r) + '² = ' + r * r + ' und (' + n(y2) + ' − ' + m + ')² = ' + r * r + '.</small>',
        mistakes: mis2(y1, y2, function (a, b) { if (a === -m - r || b === m - r * r) return 'Prüfe deine Gleichung: (x − ' + m + ')² = ' + r * r + '. Dann x − ' + m + ' = ±' + r + '.'; return null; }),
        verify: function () { return check2(function (x) { return (x - m) * (x - m) - r * r; }, y1, y2); } };
    }
  };

  return {
    id: '014', title: 'Einfache quadratische Gleichungen', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Quadratwurzeln, Ausklammern, lineare Gleichungen, Normalparabel',
    lead: 'Für welche Zahl x gilt x² = 49? Du lernst, quadratische Gleichungen geschickt zu lösen und warum es oft zwei Lösungen gibt.',
    einstieg: { html: '<p>Ein quadratisches Beet soll genau 49 m² groß werden. Wie lang muss eine Seite sein? Gesucht ist eine Zahl x mit x² = 49. Die Antwort 7 m ist schnell gefunden. Aber auch (−7)² = 49. In der Mathematik hat die Gleichung also <b>zwei Lösungen</b>, im Garten passt nur die positive.</p><p class="note">Leitfrage: Wie viele Lösungen kann eine quadratische Gleichung haben, und wie findet man sie ohne langes Probieren?</p><p>Du lernst drei Werkzeuge kennen: <b>Wurzel ziehen</b>, <b>Ausklammern</b> und den <b>Satz vom Nullprodukt</b>. Am Graphen siehst du die Lösungen als Schnittpunkte mit der x-Achse.</p>' + pgraph([{ a: 1, d: 0, e: 0 }], { x: [-8, 8], y: [-2, 52], hl: [{ y: 49, label: 'y = 49' }], marks: [{ x: -7, y: 49, text: 'x = −7', color: C_ACC, pos: 'left', below: true }, { x: 7, y: 49, text: 'x = 7', color: C_ACC, below: true }] }) },
    ziele: ['Ich löse Gleichungen der Form x² = c durch Wurzelziehen und denke an beide Lösungen.', 'Ich löse Gleichungen der Form (x − d)² = c.', 'Ich löse Gleichungen wie x² + px = 0 durch Ausklammern.', 'Ich nutze den Satz vom Nullprodukt.', 'Ich begründe, ob eine Gleichung keine, eine oder zwei Lösungen hat.'],
    fachwoerter: [['quadratische Gleichung', 'Eine Gleichung, in der x² vorkommt, aber keine höhere Potenz, zum Beispiel x² − 5x = 0.'], ['Lösungsmenge L', 'Alle Zahlen, die die Gleichung erfüllen, zum Beispiel L = {−3; 3}.'], ['Satz vom Nullprodukt', 'Ein Produkt ist genau dann 0, wenn mindestens ein Faktor 0 ist.'], ['Nullstelle', 'Ein x-Wert, an dem der Graph die x-Achse schneidet oder berührt (y = 0).'], ['Probe', 'Die Lösung in die Ausgangsgleichung einsetzen und prüfen, ob sie stimmt.']],
    diagnose: [
      { q: 'Welche Zahl ist √81?', options: ['9', '40,5', '−9', 'Weiß ich noch nicht'], answer: 0, why: '9 · 9 = 81. Die Wurzel ist die positive Zahl.', review: 'Quadratwurzeln' },
      { q: 'Klammere x aus: x² + 5x', options: ['x(x + 5x)', 'x(x + 5)', '5x(x + 1)', 'Weiß ich noch nicht'], answer: 1, why: 'x · x = x² und x · 5 = 5x.', review: 'Ausklammern (Klasse 8)' },
      { q: 'Löse 2x − 8 = 0.', options: ['x = −4', 'x = 6', 'x = 4', 'Weiß ich noch nicht'], answer: 2, why: '2x = 8, also x = 4.', review: 'Lineare Gleichungen lösen' },
      { q: 'Was ergibt (−6)²?', options: ['−36', '36', '−12', 'Weiß ich noch nicht'], answer: 1, why: '(−6) · (−6) = 36.', review: 'Quadrieren negativer Zahlen' }],
    erklaerung:
      '<h3>1. Gleichungen der Form x² = c</h3><p>Ziehe die Wurzel und denke an die negative Lösung: x² = 25 ⇒ x₁ = −5, x₂ = 5. Steht noch etwas dabei, forme zuerst um: 3x² = 48 ⇒ x² = 16 ⇒ x₁ = −4, x₂ = 4.</p>' +
      '<div class="merk"><b>Merke:</b> Für x² = c gilt:<br>• c &gt; 0: zwei Lösungen, x₁ = −√c und x₂ = √c<br>• c = 0: genau eine Lösung, x = 0<br>• c &lt; 0: keine Lösung, denn ein Quadrat ist nie negativ.</div>' +
      '<h3>2. Gleichungen der Form (x − d)² = c</h3><p>Die ganze Klammer ist eine Zahl, deren Quadrat c ist. (x − 2)² = 9 ⇒ x − 2 = 3 oder x − 2 = −3 ⇒ x = 5 oder x = −1.</p>' +
      '<h3>3. Ausklammern und Satz vom Nullprodukt</h3><p>Fehlt die Zahl ohne x, klammerst du x aus: x² − 6x = 0 ⇒ x · (x − 6) = 0. Ein Produkt ist 0, wenn ein Faktor 0 ist. Also x = 0 oder x − 6 = 0, das heißt x₁ = 0, x₂ = 6.</p>' +
      '<p class="note"><b>Achtung:</b> Teile nie durch x! Aus x² = 6x würde sonst x = 6, und die Lösung x = 0 ginge verloren.</p>' +
      '<p>Genauso bei (x + 3)(x − 4) = 0: x + 3 = 0 oder x − 4 = 0, also x₁ = −3, x₂ = 4.</p>' +
      '<h3>4. Am Graphen</h3><p>Die Lösungen von (x − 1)² − 4 = 0 sind die Nullstellen der Parabel y = (x − 1)² − 4. Liegt der Scheitelpunkt unterhalb der x-Achse und ist die Parabel nach oben geöffnet, gibt es zwei Nullstellen.</p>' +
      pgraph([{ a: 1, d: 1, e: -4, vertex: 'S(1 | −4)' }], { x: [-4, 5], y: [-5, 6], marks: [{ x: -1, y: 0, text: 'x₁ = −1', color: C_CMP, pos: 'left', below: true }, { x: 3, y: 0, text: 'x₂ = 3', color: C_CMP, below: true }], label: 'Nullstellen einer Parabel' }) +
      '<p class="note"><b>Eingabe:</b> Gib immer die kleinere Lösung bei x₁ und die größere bei x₂ ein. Mache zum Schluss die Probe.</p>',
    entdecken: {
      html: '<p>Untersuche die Gleichung (x − d)² = c. Die Lösungen sind die x-Werte, bei denen die Parabel y = (x − d)² die waagerechte Gerade y = c schneidet.</p><div class="ctl"><label>d = <b id="v_d"></b> <input type="range" id="r_d" min="-3" max="3" step="1" value="-1"></label><label>c = <b id="v_c"></b> <input type="range" id="r_c" min="-4" max="9" step="1" value="-2"></label></div><div id="e_g"></div><p class="big-math" id="e_eq"></p><p id="e_tx"></p><ul><li>Für welche c gibt es keine Lösung?</li><li>Wann gibt es genau eine Lösung?</li></ul>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var d = +root.querySelector('#r_d').value, c = +root.querySelector('#r_c').value, mk = [], tx;
          root.querySelector('#v_d').textContent = n(d); root.querySelector('#v_c').textContent = n(c);
          if (c > 0) { var r = Math.sqrt(c); mk = [{ x: d - r, y: c, color: C_ACC, text: 'x₁', pos: 'left' }, { x: d + r, y: c, color: C_ACC, text: 'x₂' }]; tx = 'Zwei Lösungen: x₁ = ' + n(Math.round((d - r) * 100) / 100) + ', x₂ = ' + n(Math.round((d + r) * 100) / 100) + (Number.isInteger(r) ? '' : ' (gerundet)') + '.'; }
          else if (c === 0) { mk = [{ x: d, y: 0, color: C_ACC, text: 'x = ' + n(d) }]; tx = 'Genau eine Lösung: x = ' + n(d) + '. Die Gerade berührt die Parabel im Scheitelpunkt.'; }
          else tx = 'Keine Lösung: Ein Quadrat ist nie negativ. Die Gerade liegt unterhalb der Parabel.';
          root.querySelector('#e_g').innerHTML = pgraph([{ a: 1, d: d, e: 0, vertex: true }], { x: [-7, 7], y: [-5, 10], hl: [{ y: c, label: 'y = ' + n(c) }], marks: mk });
          root.querySelector('#e_eq').innerHTML = xin(d) + '² = ' + n(c);
          root.querySelector('#e_tx').innerHTML = tx;
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Ist c negativ, gibt es keine Lösung. Bei c = 0 gibt es genau eine, bei c > 0 zwei Lösungen. Sie liegen symmetrisch um x = d.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Ausklammern und Nullprodukt', q: 'Löse die Gleichung 2x² = 10x.',
      steps: ['Alles auf eine Seite bringen: 2x² − 10x = 0. Nicht durch x teilen!', 'x ausklammern: x · (2x − 10) = 0.', 'Satz vom Nullprodukt: x = 0 oder 2x − 10 = 0.', '2x − 10 = 0 ⇒ 2x = 10 ⇒ x = 5. Also x₁ = 0 und x₂ = 5.', 'Probe: 2 · 0² = 0 = 10 · 0 ✓ und 2 · 5² = 50 = 10 · 5 ✓.'] },
    tasks: { gen: gen, plan: { G: ['rein:1', 'nullprodukt:1', 'ausklammern:1', 'probe:2'], S: ['rein:2', 'verschoben:1', 'ausklammern:1', 'nullprodukt:1', 'anzahl:2'], E: ['rein:3', 'verschoben:2', 'ausklammern:2', 'nullprodukt:3', 'grafisch:2', 'fall:3'] },
      extra: 'raetsel', test: ['rein:2', 'verschoben:2', 'ausklammern:2', 'nullprodukt:2', 'anzahl:2', 'grafisch:2'] },
    lerncheck: ['Ich löse x² = c und denke an beide Lösungen.', 'Ich löse Gleichungen durch Ausklammern, ohne durch x zu teilen.', 'Ich nutze den Satz vom Nullprodukt.', 'Ich begründe die Anzahl der Lösungen.']
  };
})();
