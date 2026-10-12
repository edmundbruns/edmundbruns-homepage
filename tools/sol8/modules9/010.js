/* Modul 010 (Klasse 9) · Die Normalparabel */
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
  function sq(x) { return Math.round(x * x * 1e6) / 1e6; }
  function twoIn(a1, a2, unit) { return [{ kind: 'num', answer: a1, label: 'x₁ (kleinere Lösung) =', unit: unit }, { kind: 'num', answer: a2, label: 'x₂ (größere Lösung) =', unit: unit }]; }
  function sortedMistake(v, k) {
    var a = M.parseNum(v[0]), b = M.parseNum(v[1]);
    if (a === null || b === null) return null;
    if (Math.abs(a - k) < 1e-9 && Math.abs(b - k) < 1e-9) return 'Es gibt zwei Lösungen. Auch die negative Zahl −' + n(k) + ' ergibt quadriert ' + n(k * k) + '.';
    if (Math.abs(a - k) < 1e-9 && Math.abs(b + k) < 1e-9) return 'Die Zahlen stimmen, aber die Reihenfolge nicht: x₁ ist die kleinere Lösung, x₂ die größere.';
    if (Math.abs(a - k * k / 2) < 1e-9 || Math.abs(b - k * k / 2) < 1e-9) return 'x² bedeutet x · x, nicht 2 · x. Gesucht ist die Zahl, die mit sich selbst multipliziert ' + n(k * k) + ' ergibt.';
    return null;
  }
  var STAT_T = ['Der Scheitelpunkt ist S(0 | 0).', 'Die Parabel ist symmetrisch zur y-Achse.', 'Alle y-Werte sind größer oder gleich 0.', 'Die Parabel ist nach oben geöffnet.', 'Für x und −x erhält man denselben y-Wert.', 'Der tiefste Punkt der Parabel liegt im Ursprung.'];
  var STAT_F = ['Der Scheitelpunkt ist S(1 | 1).', 'Die Parabel ist symmetrisch zur x-Achse.', 'Für negative x-Werte sind auch die y-Werte negativ.', 'Die Parabel ist eine Gerade durch den Ursprung.', 'Der kleinste y-Wert ist 1.', 'Verdoppelt man x, dann verdoppelt sich auch y.', 'Die Parabel ist nach unten geöffnet.', 'Die Parabel schneidet die x-Achse in zwei Punkten.'];
  var gen = {
    tabelle: function (lvl) {
      var pool = lvl >= 2 ? [-3.5, -2.5, -1.5, -0.5, 0.5, 1.5, 2.5, -4, -3, -2, 3, 4, 5, -5, -6, 6] : [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, -6, 6];
      var xs = M.shuffle(pool).slice(0, 3);
      if (!xs.some(function (x) { return x < 0; })) xs[0] = -xs[0] || -2;
      xs.sort(function (p, q) { return p - q; });
      var L = ['a', 'b', 'c'];
      var tab = '<table class="tab"><tr><th>x</th>' + xs.map(function (x) { return '<td>' + n(x) + '</td>'; }).join('') + '</tr><tr><th>y = x²</th>' + L.map(function (l) { return '<td><b>' + l + '</b></td>'; }).join('') + '</tr></table>';
      var neg = xs.filter(function (x) { return x < 0; })[0];
      return { skill: 'Wertetabelle der Normalparabel', level: lvl >= 2 ? 2 : 1, q: 'Ergänze die Wertetabelle der Normalparabel y = x².' + tab,
        inputs: xs.map(function (x, i) { return { kind: 'num', answer: sq(x), label: L[i] + ' =' }; }),
        hints: ['Quadrieren heißt: die Zahl mit sich selbst multiplizieren, also x · x.', 'Bei negativen Zahlen gilt: Minus mal Minus ergibt Plus. Zum Beispiel (' + n(neg) + ')² = ' + par(neg) + ' · ' + par(neg) + '.', n(xs[0]) + ' wird zu ' + par(xs[0]) + ' · ' + par(xs[0]) + ' = ' + n(sq(xs[0])) + '. Rechne die anderen genauso.'],
        solution: xs.map(function (x, i) { return L[i] + ' = ' + par(x) + '² = ' + par(x) + ' · ' + par(x) + ' = ' + n(sq(x)); }).join('<br>'),
        mistakes: function (v) {
          for (var i = 0; i < 3; i++) { var z = M.parseNum(v[i]); if (z === null) continue;
            if (xs[i] < 0 && Math.abs(z + sq(xs[i])) < 1e-9) return 'Achte auf das Vorzeichen: ' + par(xs[i]) + ' · ' + par(xs[i]) + ' ist positiv. Minus mal Minus ergibt Plus.';
            if (Math.abs(z - 2 * xs[i]) < 1e-9 && Math.abs(xs[i]) !== 2) return 'x² bedeutet x · x, nicht 2 · x.'; }
          return null; },
        verify: function () { for (var i = 0; i < 3; i++) if (Math.abs(Math.sqrt(sq(xs[i])) - Math.abs(xs[i])) > 1e-9) return 'Tabelle'; return true; } };
    },
    ablesen: function () {
      var x = M.pick([-3, -2, -1, 1, 2, 3]), y = x * x;
      return { skill: 'Punkt am Graphen ablesen', level: 1, q: 'Der Punkt P liegt auf der Normalparabel. Lies seine Koordinaten ab.' + pgraph([{ a: 1, d: 0, e: 0 }], { x: [-4, 4], y: [-1, 10], marks: [{ x: x, y: y, text: 'P', color: C_ACC, pos: x < 0 ? 'left' : 'right' }] }),
        inputs: [{ kind: 'num', answer: x, label: 'x-Koordinate von P' }, { kind: 'num', answer: y, label: 'y-Koordinate von P' }],
        hints: ['Gehe vom Punkt P senkrecht zur x-Achse. Dort liest du die x-Koordinate ab.', 'P liegt ' + (x < 0 ? 'links' : 'rechts') + ' von der y-Achse, also ist x ' + (x < 0 ? 'negativ' : 'positiv') + '.', 'Kontrolle: Die y-Koordinate muss ' + par(x) + '² sein.'],
        solution: 'P(' + n(x) + ' | ' + y + '). Kontrolle: ' + par(x) + '² = ' + y + '.',
        verify: function () { return fv(1, 0, 0, x) === y || 'y'; } };
    },
    symmetrie: function (lvl) {
      var x = lvl >= 2 ? M.pick([1.5, 2.5, 3.5, -1.5, -2.5, 4, -4, 5, -5, 7, -7]) : M.pick([1, 2, 3, 4, -1, -2, -3, -4]), y = sq(x);
      return { skill: 'Symmetrie zur y-Achse', q: 'Der Punkt P(' + n(x) + ' | ' + n(y) + ') liegt auf der Normalparabel. Ein zweiter Punkt Q auf der Parabel hat denselben y-Wert. Gib Q an.',
        inputs: [{ kind: 'num', answer: -x, label: 'x-Koordinate von Q' }, { kind: 'num', answer: y, label: 'y-Koordinate von Q' }],
        hints: ['Die Normalparabel ist symmetrisch zur y-Achse. Spiegle P an der y-Achse.', 'Beim Spiegeln an der y-Achse ändert sich nur das Vorzeichen der x-Koordinate.', 'Q hat die x-Koordinate ' + n(-x) + '. Die y-Koordinate bleibt ' + n(y) + '.'],
        solution: 'Q(' + n(-x) + ' | ' + n(y) + '), denn ' + par(-x) + '² = ' + n(y) + '. P und Q liegen spiegelbildlich zur y-Achse.' + pgraph([{ a: 1, d: 0, e: 0 }], { x: [-Math.ceil(Math.abs(x)) - 1, Math.ceil(Math.abs(x)) + 1], y: [-1, Math.ceil(y) + 2], marks: [{ x: x, y: y, text: 'P', color: C_ACC, pos: x < 0 ? 'left' : 'right' }, { x: -x, y: y, text: 'Q', color: C_CMP, pos: x < 0 ? 'right' : 'left' }], hl: [{ y: y }] }),
        mistakes: function (v) { var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (b !== null && Math.abs(b + y) < 1e-9) return 'Gespiegelt wird an der y-Achse, nicht an der x-Achse. Der y-Wert bleibt also gleich.'; if (a !== null && Math.abs(a - x) < 1e-9) return 'Das ist P selbst. Q liegt auf der anderen Seite der y-Achse.'; return null; },
        verify: function () { return Math.abs(fv(1, 0, 0, -x) - y) < 1e-9 || 'Q'; } };
    },
    punktprobe: function (lvl) {
      var x = lvl >= 2 ? M.pick([-1.5, 2.5, -0.5, 1.5, -4, 6, -7, 9]) : M.pick([-4, -3, -2, 2, 3, 4, 5, -5]), yes = Math.random() < 0.5;
      var wrong = M.pick([-sq(x), 2 * x === sq(x) ? sq(x) + 1 : 2 * x, sq(x) + M.pick([-1, 1, 2])]);
      if (wrong === sq(x)) wrong = sq(x) + 1;
      var y = yes ? sq(x) : wrong;
      return { skill: 'Punktprobe', level: lvl >= 2 ? 2 : 1, q: 'Liegt der Punkt P(' + n(x) + ' | ' + n(y) + ') auf der Normalparabel y = x²?',
        inputs: [{ kind: 'mc', label: 'Antwort', options: ['Ja, P liegt auf der Normalparabel.', 'Nein, P liegt nicht auf der Normalparabel.'], answer: yes ? 0 : 1 }],
        hints: ['Setze die x-Koordinate in y = x² ein.', 'Rechne ' + par(x) + '² = ' + par(x) + ' · ' + par(x) + '.', par(x) + '² = ' + n(sq(x)) + '. Vergleiche mit der y-Koordinate von P.'],
        solution: par(x) + '² = ' + n(sq(x)) + '. ' + (yes ? 'Das ist genau die y-Koordinate von P. P liegt auf der Parabel.' : 'P hat aber die y-Koordinate ' + n(y) + '. P liegt nicht auf der Parabel.'),
        verify: function () { return (Math.abs(fv(1, 0, 0, x) - y) < 1e-9) === yes || 'Probe'; } };
    },
    x_zu_y: function (lvl) {
      var k = lvl >= 3 ? M.pick([0.5, 1.5, 2.5, 1.2, 0.3, 11, 12, 15]) : M.pick([2, 3, 4, 5, 6, 7, 8, 9, 10]), c = sq(k);
      return { skill: 'x-Werte zu einem y-Wert', q: 'Die Punkte P(? | ' + n(c) + ') und Q(? | ' + n(c) + ') liegen auf der Normalparabel. Bestimme die fehlenden x-Koordinaten. Löse dazu x² = ' + n(c) + '.',
        inputs: twoIn(-k, k),
        hints: ['Gesucht ist eine Zahl, die mit sich selbst multipliziert ' + n(c) + ' ergibt. Das ist die Quadratwurzel.', '√' + n(c) + ' = ' + n(k) + '. Wegen der Symmetrie gibt es noch eine zweite Zahl.', 'Auch ' + par(-k) + '² = ' + n(c) + '. Also x₁ = ' + n(-k) + ' und x₂ = ' + n(k) + '.'],
        solution: 'x² = ' + n(c) + ' ⇒ x = −√' + n(c) + ' oder x = √' + n(c) + '. Also x₁ = ' + n(-k) + ', x₂ = ' + n(k) + '.<br>Probe: ' + par(-k) + '² = ' + n(c) + ' und ' + n(k) + '² = ' + n(c) + '.',
        mistakes: function (v) { return sortedMistake(v, k); },
        verify: function () { return (Math.abs(fv(1, 0, 0, -k) - c) < 1e-9 && Math.abs(fv(1, 0, 0, k) - c) < 1e-9 && -k < k) || 'Probe'; } };
    },
    anzahl: function () {
      var c = M.pick([-9, -4, -1, -16, 0, 4, 9, 16, 25, 2, 7]), ans = c < 0 ? 0 : c === 0 ? 1 : 2;
      return { skill: 'Wie viele x-Werte gehören zu y?', level: 2, q: 'Wie viele Punkte der Normalparabel haben den y-Wert ' + n(c) + '? Anders gefragt: Wie viele Lösungen hat x² = ' + n(c) + '?',
        inputs: [{ kind: 'mc', label: 'Anzahl', options: ['keinen Punkt (keine Lösung)', 'genau einen Punkt (eine Lösung)', 'zwei Punkte (zwei Lösungen)'], answer: ans }],
        hints: ['Zeichne in Gedanken die waagerechte Gerade y = ' + n(c) + ' und schaue, wie oft sie die Parabel trifft.', 'Quadrate sind nie negativ. Der kleinste y-Wert der Normalparabel ist 0.', c < 0 ? 'Die Gerade y = ' + n(c) + ' liegt unterhalb des Scheitelpunkts.' : c === 0 ? 'Die Gerade y = 0 berührt die Parabel nur im Scheitelpunkt.' : 'Die Gerade liegt oberhalb des Scheitelpunkts und schneidet beide Äste.'],
        solution: (c < 0 ? 'Keine Zahl ergibt quadriert eine negative Zahl. Es gibt keinen Punkt.' : c === 0 ? 'Nur 0² = 0. Es gibt genau einen Punkt, den Scheitelpunkt S(0 | 0).' : 'Es gibt zwei Punkte: x = −' + (Number.isInteger(Math.sqrt(c)) ? Math.sqrt(c) : '√' + c) + ' und x = ' + (Number.isInteger(Math.sqrt(c)) ? Math.sqrt(c) : '√' + c) + '.') + pgraph([{ a: 1, d: 0, e: 0 }], { x: [-5, 5], y: [-4, 9], hl: [{ y: Math.max(-4, Math.min(9, c)), label: 'y = ' + n(c) }] }),
        verify: function () { var cnt = 0; for (var x = -20; x <= 20; x += 0.001) { var a1 = fv(1, 0, 0, x) - c, b1 = fv(1, 0, 0, x + 0.001) - c; if (a1 === 0 || a1 * b1 < 0) cnt++; } if (c === 0) return true; return cnt === ans || 'Anzahl ' + cnt; } };
    },
    eigenschaften: function (lvl) {
      var askFalse = lvl >= 2 && Math.random() < 0.5;
      var right = askFalse ? M.pick(STAT_F) : M.pick(STAT_T), others = M.shuffle(askFalse ? STAT_T : STAT_F).slice(0, 3);
      var opts = M.shuffle([right].concat(others));
      return { skill: 'Eigenschaften der Normalparabel', level: lvl, q: askFalse ? 'Welche Aussage über die Normalparabel y = x² ist <b>falsch</b>?' : 'Welche Aussage über die Normalparabel y = x² ist <b>richtig</b>?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(right) }],
        hints: ['Stelle dir den Graphen vor oder skizziere ihn: eine nach oben geöffnete Kurve mit dem tiefsten Punkt im Ursprung.', 'Prüfe jede Aussage mit einem Beispiel, etwa x = 2 und x = −2.', 'Quadrate sind nie negativ, und 2² = 4 ist nicht das Doppelte von 1² = 1.'],
        solution: '<b>' + right + '</b> ' + (askFalse ? 'ist falsch.' : 'ist richtig.') + ' Die Normalparabel hat den Scheitelpunkt S(0 | 0), ist nach oben geöffnet, symmetrisch zur y-Achse und hat nur y-Werte ab 0.' };
    },
    zuwachs: function (lvl) {
      var a = lvl >= 3 ? M.rnd(5, 12) : M.rnd(1, 6), d = (a + 1) * (a + 1) - a * a;
      return { skill: 'Wachstum der Parabel', level: 3, q: 'Um wie viel nimmt y = x² zu, wenn x von ' + a + ' auf ' + (a + 1) + ' wächst?<br><small>Bei einer Geraden wäre der Zuwachs immer gleich. Wie ist es bei der Parabel?</small>',
        inputs: [{ kind: 'num', answer: d, label: 'Zuwachs' }],
        hints: ['Berechne beide y-Werte: ' + a + '² und ' + (a + 1) + '².', a + '² = ' + a * a + ' und ' + (a + 1) + '² = ' + (a + 1) * (a + 1) + '.', 'Bilde die Differenz: ' + (a + 1) * (a + 1) + ' − ' + a * a + '.'],
        solution: (a + 1) + '² − ' + a + '² = ' + (a + 1) * (a + 1) + ' − ' + a * a + ' = ' + d + '. Die Zuwächse sind 1, 3, 5, 7, … Sie werden immer größer, deshalb ist die Parabel gekrümmt.',
        mistakes: function (v) { var z = M.parseNum(v[0]); if (z === 1) return 'Bei einer Geraden wächst y immer gleich stark. Bei der Parabel nicht. Berechne beide y-Werte.'; if (z === (a + 1) * (a + 1)) return 'Das ist der y-Wert bei x = ' + (a + 1) + '. Gesucht ist der Unterschied zum y-Wert bei x = ' + a + '.'; return null; },
        verify: function () { return d === 2 * a + 1 || 'Zuwachs'; } };
    },
    quadrat: function () {
      var s = M.rnd(4, 15), A = s * s, k = M.pick([2, 3, 4]);
      return { skill: 'Normalparabel im Sachzusammenhang', level: 3, q: 'Für den Flächeninhalt eines Quadrats mit der Seitenlänge x gilt A = x².<br>a) Ein quadratisches Beet hat den Flächeninhalt ' + A + ' m². Wie lang ist eine Seite?<br>b) Die Seitenlänge eines Quadrats wird ver' + ['', '', 'doppelt', 'dreifacht', 'vierfacht'][k] + '. Mit welcher Zahl wird der Flächeninhalt multipliziert?',
        inputs: [{ kind: 'num', answer: s, label: 'a) Seitenlänge', unit: 'm' }, { kind: 'num', answer: k * k, label: 'b) Faktor' }],
        hints: ['a) Löse x² = ' + A + '. Eine Länge kann nicht negativ sein.', 'b) Probiere es mit einem Beispiel: Seite 1 m hat 1 m². Seite ' + k + ' m hat …', 'b) (' + k + 'x)² = ' + k + 'x · ' + k + 'x = ' + k * k + 'x².'],
        solution: 'a) x² = ' + A + ' ⇒ x = ' + s + ' (oder x = −' + s + ', aber eine Seitenlänge ist positiv). Die Seite ist ' + s + ' m lang.<br>b) (' + k + 'x)² = ' + k * k + 'x². Der Flächeninhalt wird mit ' + k * k + ' multipliziert.',
        mistakes: function (v) { var z = M.parseNum(v[1]); if (z === k) return 'b) Probiere es aus: Seite 1 m ergibt 1 m², Seite ' + k + ' m ergibt ' + k * k + ' m². Die Fläche wächst stärker als die Seite.'; var a = M.parseNum(v[0]); if (a === A / 2) return 'a) Gesucht ist die Zahl, die mit sich selbst multipliziert ' + A + ' ergibt, nicht die Hälfte.'; return null; },
        verify: function () { return (s * s === A && (k * 3) * (k * 3) === k * k * 9) || 'quadrat'; } };
    }
  };

  return {
    id: '010', title: 'Die Normalparabel', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Quadrieren, auch von negativen Zahlen; Koordinatensystem; Wertetabellen',
    lead: 'Ein Basketball fliegt nicht auf einer Geraden, sondern auf einem Bogen. Du lernst die einfachste Bogenform kennen: die Normalparabel y = x².',
    einstieg: { html: '<p>Lena wirft einen Basketball zum Korb. Der Ball steigt erst steil, dann immer flacher, erreicht einen höchsten Punkt und fällt wieder. Auch der Wasserstrahl eines Springbrunnens und die Bögen mancher Brücken haben diese Form.</p><p class="note">Leitfrage: Welche Gleichung beschreibt so einen Bogen? Warum ist er auf beiden Seiten gleich geformt?</p><p>Diese Bogenform heißt <b>Parabel</b>. Du beginnst mit der wichtigsten Parabel überhaupt: der <b>Normalparabel</b> mit der Gleichung y = x².</p>' + pgraph([{ a: 1, d: 0, e: 0, vertex: 'S(0 | 0)', label: 'y = x²' }], { x: [-4, 4], y: [-1, 9], label: 'Normalparabel' }) },
    ziele: ['Ich erstelle eine Wertetabelle zu y = x², auch mit negativen x-Werten.', 'Ich zeichne die Normalparabel und kenne ihren Scheitelpunkt S(0 | 0).', 'Ich nutze die Symmetrie zur y-Achse.', 'Ich prüfe, ob ein Punkt auf der Normalparabel liegt.', 'Ich finde zu einem y-Wert beide passenden x-Werte.'],
    fachwoerter: [['Normalparabel', 'Der Graph der Funktion y = x² (auch f(x) = x²).'], ['Scheitelpunkt S', 'Der tiefste (oder höchste) Punkt einer Parabel. Bei der Normalparabel S(0 | 0).'], ['Symmetrieachse', 'Die senkrechte Gerade durch den Scheitelpunkt. Bei der Normalparabel ist es die y-Achse.'], ['Quadratwurzel', '√9 = 3, denn 3² = 9. Die Wurzel ist nie negativ.'], ['Wertebereich', 'Alle y-Werte, die vorkommen. Bei y = x² sind das alle Zahlen ab 0.']],
    diagnose: [
      { q: 'Was ergibt (−3)²?', options: ['9', '−9', '−6', 'Weiß ich noch nicht'], answer: 0, why: '(−3)² = (−3) · (−3) = 9. Minus mal Minus ergibt Plus.', review: 'Rechnen mit negativen Zahlen' },
      { q: 'Welche Zahl ist √49?', options: ['24,5', '7', '−7', 'Weiß ich noch nicht'], answer: 1, why: '7 · 7 = 49. Die Wurzel ist die positive Zahl.', review: 'Quadratzahlen und Quadratwurzeln' },
      { q: 'Der Punkt P(3 | 2) wird an der y-Achse gespiegelt. Welchen Bildpunkt erhältst du?', options: ['(3 | −2)', '(−3 | −2)', '(−3 | 2)', 'Weiß ich noch nicht'], answer: 2, why: 'Bei der Spiegelung an der y-Achse ändert sich nur das Vorzeichen der x-Koordinate.', review: 'Achsenspiegelung im Koordinatensystem' },
      { q: 'Welchen Wert hat y = 2x + 1 für x = −2?', options: ['−3', '5', '−5', 'Weiß ich noch nicht'], answer: 0, why: '2 · (−2) + 1 = −4 + 1 = −3.', review: 'Werte in Funktionsgleichungen einsetzen' }],
    erklaerung:
      '<h3>1. Wertetabelle und Graph</h3><p>Bei der Funktion <b>y = x²</b> (auch f(x) = x²) wird jede Zahl x quadriert. Achtung bei negativen Zahlen: (−2)² = (−2) · (−2) = 4.</p>' +
      '<table class="tab"><tr><th>x</th><td>−3</td><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>y = x²</th><td>9</td><td>4</td><td>1</td><td>0</td><td>1</td><td>4</td><td>9</td></tr></table>' +
      '<p>Trägst du die Punkte ein und verbindest sie mit einer <b>glatten Kurve</b> (nicht mit Strecken!), entsteht die Normalparabel.</p>' +
      pgraph([{ a: 1, d: 0, e: 0, vertex: 'S(0 | 0)', pts: [[-3, 9], [-2, 4], [-1, 1], [1, 1], [2, 4], [3, 9]] }], { x: [-4, 4], y: [-1, 9], label: 'Normalparabel mit Punkten der Wertetabelle' }) +
      '<div class="merk"><b>Merke:</b> Die Normalparabel y = x²<br>• hat den <b>Scheitelpunkt S(0 | 0)</b>, ihren tiefsten Punkt,<br>• ist <b>nach oben geöffnet</b>,<br>• ist <b>symmetrisch zur y-Achse</b>: x und −x haben denselben y-Wert,<br>• hat nur y-Werte <b>größer oder gleich 0</b> (Wertebereich y ≥ 0).</div>' +
      '<h3>2. Punktprobe</h3><p>Ein Punkt liegt auf der Parabel, wenn seine Koordinaten die Gleichung erfüllen. P(−4 | 16): (−4)² = 16. Stimmt, P liegt darauf. Q(3 | 6): 3² = 9 ≠ 6. Q liegt nicht darauf.</p>' +
      '<h3>3. Vom y-Wert zum x-Wert</h3><p>Für welche x ist x² = 25? Wegen der Symmetrie gibt es <b>zwei</b> Lösungen: x₁ = −5 und x₂ = 5. Für x² = 0 gibt es nur x = 0. Für x² = −4 gibt es <b>keine</b> Lösung, denn Quadrate sind nie negativ.</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Dezimalzahlen schreibst du mit Komma, zum Beispiel 2,25. Negative Zahlen mit Minus, zum Beispiel −1,5.</p>',
    entdecken: {
      html: '<p>Bewege den Punkt P auf der Normalparabel. Der Spiegelpunkt Q zeigt dir die Symmetrie.</p><div class="ctl"><label>x = <b id="v_x"></b> <input type="range" id="r_x" min="-3.5" max="3.5" step="0.5" value="-2.5"></label><button type="button" id="b_q" class="btn">Spiegelpunkt Q ein/aus</button></div><div id="e_g"></div><p class="big-math" id="e_eq"></p><ul><li>Kann y negativ werden?</li><li>Welcher Punkt hat den kleinsten y-Wert?</li><li>Warum hat Q denselben y-Wert wie P?</li></ul>',
      init: function (root, done) {
        var cnt = 0, showQ = true;
        function draw() {
          var x = +root.querySelector('#r_x').value, y = sq(x), mk = [{ x: x, y: y, text: 'P', color: C_ACC, pos: x < 0 ? 'left' : 'right' }];
          if (showQ && x !== 0) mk.push({ x: -x, y: y, text: 'Q', color: C_CMP, pos: x < 0 ? 'right' : 'left' });
          root.querySelector('#v_x').textContent = n(x);
          root.querySelector('#e_g').innerHTML = pgraph([{ a: 1, d: 0, e: 0, vertex: true }], { x: [-4, 4], y: [-1, 13], hl: showQ && x !== 0 ? [{ y: y }] : [], marks: mk });
          root.querySelector('#e_eq').innerHTML = 'P(' + n(x) + ' | ' + n(y) + '), denn ' + par(x) + '² = ' + n(y) + (showQ && x !== 0 ? '<br>Q(' + n(-x) + ' | ' + n(y) + '), denn ' + par(-x) + '² = ' + n(y) : '');
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: y = x² ist nie negativ. Der tiefste Punkt ist S(0 | 0). x und −x ergeben denselben y-Wert, deshalb ist die Parabel symmetrisch zur y-Achse.'); }
        root.querySelector('#r_x').addEventListener('input', hit);
        root.querySelector('#b_q').addEventListener('click', function () { showQ = !showQ; hit(); });
        draw();
      }
    },
    beispiel: { title: 'Punkte mit gegebenem y-Wert', q: 'Welche Punkte der Normalparabel haben den y-Wert 6,25?',
      steps: ['Ansatz: x² = 6,25. Gesucht sind alle Zahlen, die quadriert 6,25 ergeben.', 'Quadratwurzel: √6,25 = 2,5, denn 2,5 · 2,5 = 6,25.', 'Symmetrie: Auch (−2,5)² = 6,25. Es gibt also zwei Lösungen.', 'Lösungen: x₁ = −2,5 und x₂ = 2,5. Die Punkte sind P(−2,5 | 6,25) und Q(2,5 | 6,25).', 'Kontrolle am Graphen: Die Gerade y = 6,25 schneidet die Parabel genau bei −2,5 und 2,5.' + pgraph([{ a: 1, d: 0, e: 0 }], { x: [-4, 4], y: [-1, 9], hl: [{ y: 6.25, label: 'y = 6,25' }], marks: [{ x: -2.5, y: 6.25, text: 'P', color: C_ACC, pos: 'left', below: true }, { x: 2.5, y: 6.25, text: 'Q', color: C_ACC, below: true }] })] },
    tasks: { gen: gen, plan: { G: ['tabelle:1', 'ablesen:1', 'symmetrie:1', 'punktprobe:1'], S: ['tabelle:2', 'symmetrie:1', 'punktprobe:2', 'x_zu_y:2', 'eigenschaften:1'], E: ['tabelle:2', 'symmetrie:2', 'x_zu_y:3', 'anzahl:2', 'eigenschaften:2', 'zuwachs:3'] },
      extra: 'quadrat', test: ['tabelle:2', 'ablesen:1', 'symmetrie:2', 'punktprobe:2', 'x_zu_y:2', 'anzahl:2'] },
    lerncheck: ['Ich berechne Werte von y = x², auch für negative Zahlen.', 'Ich kenne Scheitelpunkt und Symmetrie der Normalparabel.', 'Ich prüfe, ob ein Punkt auf der Normalparabel liegt.', 'Ich finde zu einem y-Wert beide x-Werte.']
  };
})();
