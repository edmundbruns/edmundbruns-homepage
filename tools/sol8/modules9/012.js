/* Modul 012 (Klasse 9) · Parabeln strecken und spiegeln */
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
  var GSTYLE = '<style>fieldset.mc:has(.gopt){display:flex;flex-wrap:wrap;gap:10px}fieldset.mc:has(.gopt)>legend{width:100%}label.opt:has(.gopt){flex:1 1 140px;max-width:230px;margin:0}.gopt{display:block;width:100%}.gopt .viz{margin:4px auto 0}</style>';
  var AS = [0.5, -0.5, 2, -2, 3, -3, -1];
  function cat(a) { var b = Math.abs(a); return b < 1 ? 0 : b === 1 ? 1 : 2; }
  var SHAPES = ['nach oben geöffnet und gestreckt (schmaler als die Normalparabel)', 'nach oben geöffnet und gestaucht (breiter als die Normalparabel)', 'nach unten geöffnet und gestreckt (schmaler als die Normalparabel)', 'nach unten geöffnet und gestaucht (breiter als die Normalparabel)', 'nach unten geöffnet und genauso breit wie die Normalparabel'];
  function shapeIdx(a) { if (a === -1) return 4; return (a > 0 ? 0 : 2) + (Math.abs(a) < 1 ? 1 : 0); }
  function shapeWhy(a) { return (a > 0 ? 'a = ' + n(a) + ' ist positiv, also nach oben geöffnet. ' : 'a = ' + n(a) + ' ist negativ, also nach unten geöffnet. ') + (Math.abs(a) > 1 ? 'Der Betrag ' + n(Math.abs(a)) + ' ist größer als 1, also gestreckt (schmaler).' : Math.abs(a) < 1 ? 'Der Betrag ' + n(Math.abs(a)) + ' ist kleiner als 1, also gestaucht (breiter).' : 'Der Betrag ist 1, also genauso breit wie die Normalparabel.'); }
  function other(a) { var c; do { c = M.pick([0.5, 2, 3]); } while (cat(c) === cat(a)); return (a < 0 ? -1 : 1) * c; }
  /* Rechenweg für a(x − d)² + e an der Stelle x */
  function calc(a, d, e, x) {
    var inner = x - d, sq = inner * inner, prod = a * sq;
    return (d === 0 ? (a === 1 ? '' : n(a) + ' · ') + par(x) + '²' : (a === 1 ? '' : n(a) + ' · ') + '(' + n(x) + pm(-d) + ')²') + pm(e) + ' = ' + (a === 1 ? '' : n(a) + ' · ') + n(sq) + pm(e) + (a === 1 ? '' : ' = ' + n(prod) + pm(e)) + (e === 0 ? '' : ' = ' + n(prod + e));
  }
  var gen = {
    form: function (lvl) {
      var a = M.pick(AS), d = lvl >= 2 ? M.rnd(-4, 4) : 0, e = lvl >= 2 ? M.rnd(-4, 4) : 0;
      return { skill: 'Form der Parabel erkennen', level: lvl >= 2 ? 2 : 1, q: 'Beschreibe die Form der Parabel im Vergleich zur Normalparabel. <span class="big-math">' + vform(a, d, e) + '</span>',
        inputs: [{ kind: 'mc', label: 'Die Parabel ist …', options: SHAPES.slice(), answer: shapeIdx(a) }],
        hints: ['Entscheidend ist nur der Faktor a vor der Klammer' + (lvl >= 2 ? '. d und e verschieben die Parabel nur.' : ' bzw. vor dem x².'), 'Ist a positiv, ist die Parabel nach oben geöffnet. Ist a negativ, nach unten.', 'Ist der Betrag von a größer als 1, ist sie schmaler (gestreckt). Ist er kleiner als 1, ist sie breiter (gestaucht).'],
        solution: shapeWhy(a) + pgraph([{ a: 1, d: d, e: e, color: C_CMP, dash: true, width: 2 }, { a: a, d: d, e: e, vertex: true }]) + '<small>Gestrichelt: Normalparabel mit demselben Scheitelpunkt.</small>',
        mistakes: function (v) { var k = +v[0], sh = shapeIdx(a); if (k === 4 || sh === 4) return null; if ((k < 2) !== (sh < 2)) return 'Achte auf das Vorzeichen von a: Ein Minus vor der Klammer klappt die Parabel nach unten.'; if (k % 2 !== sh % 2) return 'Verwechselt? Bei |a| > 1 wachsen die y-Werte schneller, die Parabel wird schmaler (gestreckt). Bei |a| < 1 wird sie breiter (gestaucht).'; return null; },
        verify: function () { var f2 = fv(a, d, e, d + 2) - e, f1 = fv(1, d, e, d + 2) - e; var up = f2 > 0, narrow = Math.abs(f2) > Math.abs(f1); var exp = a === -1 ? 4 : (up ? 0 : 2) + (narrow ? 0 : 1); return exp === shapeIdx(a) || 'Form'; } };
    },
    werte: function (lvl) {
      var a = M.pick(AS), d = lvl >= 2 ? M.rnd(-3, 3) : 0, e = lvl >= 2 ? M.rnd(-5, 5) : 0;
      var x1 = d + M.pick([-3, -2, -1]), x2 = d + M.pick([1, 2, 4]);
      if (Math.abs(a) === 0.5) { x1 = d - 2 * M.rnd(1, 2); x2 = d + M.pick([2, 3, 4]); }
      var y1 = fv(a, d, e, x1), y2 = fv(a, d, e, x2);
      return { skill: 'Funktionswerte mit Streckfaktor', level: lvl >= 2 ? 2 : 1, q: 'Berechne die y-Werte von <span class="big-math">' + vform(a, d, e) + '</span> für x = ' + n(x1) + ' und x = ' + n(x2) + '.',
        inputs: [{ kind: 'num', answer: y1, label: 'y für x = ' + n(x1) }, { kind: 'num', answer: y2, label: 'y für x = ' + n(x2) }],
        hints: ['Reihenfolge: ' + (d === 0 ? 'zuerst x quadrieren' : 'zuerst die Klammer ausrechnen, dann quadrieren') + ', dann mit a = ' + n(a) + ' multiplizieren' + (e === 0 ? '.' : ', zum Schluss ' + n(e) + ' addieren.'), 'Für x = ' + n(x1) + ': ' + (d === 0 ? par(x1) : '(' + n(x1) + pm(-d) + ')') + '² = ' + n((x1 - d) * (x1 - d)) + '.', 'Dann ' + n(a) + ' · ' + n((x1 - d) * (x1 - d)) + ' = ' + n(a * (x1 - d) * (x1 - d)) + (e === 0 ? '.' : ', also y = ' + n(y1) + '.')],
        solution: 'x = ' + n(x1) + ': y = ' + calc(a, d, e, x1) + '<br>x = ' + n(x2) + ': y = ' + calc(a, d, e, x2),
        mistakes: function (v) { var z = M.parseNum(v[0]); if (z === null) return null; if (Math.abs(z - ((a * (x1 - d)) * (a * (x1 - d)) + e)) < 1e-9 && z !== y1) return 'Zuerst wird quadriert, erst danach mit a multipliziert. a gehört nicht in die Klammer.'; if (Math.abs(z + y1 - 2 * e) < 1e-9 && z !== y1) return 'Achte auf das Vorzeichen von a. Ein Quadrat ist positiv, erst das negative a macht den Wert negativ.'; return null; },
        verify: function () { var t = M.parseTerm(vstr(a, d, e)); return (Math.abs(M.evalTree(t, { x: x1 }) - y1) < 1e-9 && Math.abs(M.evalTree(t, { x: x2 }) - y2) < 1e-9) || 'werte'; } };
    },
    zuordnen: function (lvl) {
      var a = M.pick(AS), d = lvl >= 3 ? M.nz(-3, 3) : 0, e = lvl >= 3 ? M.rnd(-3, 3) : 0, a2 = other(a);
      var cand = [[a, d, e], [-a, d, e], [a2, d, e], [-a2, d, e]];
      if (lvl >= 3) cand = [[a, d, e], [-a, d, e], [a, -d, e], [a2, d, e]];
      var order = M.shuffle([0, 1, 2, 3]), L = ['A', 'B', 'C', 'D'];
      var win = lvl >= 3 ? { x: [-6, 6], y: [-7, 7] } : { x: [-4, 4], y: [-6, 6] };
      var opts = order.map(function (k, i) { var c = cand[k]; return '<span class="gopt"><b>Graph ' + L[i] + '</b>' + pgraph([{ a: c[0], d: c[1], e: c[2], vertex: lvl >= 3 }], { x: win.x, y: win.y, u: lvl >= 3 ? 12 : 14, cap: L[i], maxw: 190, label: 'Graph ' + L[i] }) + '</span>'; });
      var ans = order.indexOf(0);
      return { skill: 'Graph zuordnen', level: lvl >= 3 ? 3 : 2, q: GSTYLE + 'Welcher Graph gehört zu <span class="big-math">' + vform(a, d, e) + '</span>?',
        inputs: [{ kind: 'mc', label: 'Graph', options: opts, answer: ans }],
        hints: ['Prüfe zuerst das Vorzeichen von a: nach oben oder nach unten geöffnet?', lvl >= 3 ? 'Bestimme den Scheitelpunkt: ' + S(d, e) + '.' : 'Der Scheitelpunkt ist bei allen Graphen S(0 | 0). Achte auf die Breite.', 'Mache eine Punktprobe: Für x = ' + n(d + 2) + ' ist y = ' + n(fv(a, d, e, d + 2)) + '.'],
        solution: 'Richtig ist Graph ' + L[ans] + '. ' + shapeWhy(a) + (lvl >= 3 ? ' Scheitelpunkt ' + S(d, e) + '.' : '') + ' Punktprobe: Für x = ' + n(d + 2) + ' ist y = ' + calc(a, d, e, d + 2) + '.',
        mistakes: function (v) { var k = order[+v[0]]; if (k === 1) return 'Der Graph hat die richtige Breite, ist aber falsch herum geöffnet. Achte auf das Vorzeichen von a.'; if (lvl >= 3 && k === 2) return 'Prüfe den Scheitelpunkt: ' + xin(d) + ' wird 0 bei x = ' + n(d) + '.'; if (k === 2 || k === 3) return 'Achte auf die Breite: |a| = ' + n(Math.abs(a)) + (Math.abs(a) > 1 ? ' ist größer als 1, die Parabel ist also schmaler als die Normalparabel.' : Math.abs(a) < 1 ? ' ist kleiner als 1, die Parabel ist also breiter als die Normalparabel.' : ', die Parabel ist so breit wie die Normalparabel.'); return null; },
        verify: function () {
          var keys = cand.map(function (c) { return c.join(','); }); if (new Set(keys).size !== 4) return 'doppelt';
          for (var i = 1; i < 4; i++) { var c = cand[i], diff = false; for (var x = -3; x <= 3; x++) if (Math.abs(fv(c[0], c[1], c[2], x) - fv(a, d, e, x)) > 0.9) diff = true; if (!diff) return 'nicht unterscheidbar'; }
          return true; } };
    },
    a_ablesen: function () {
      var a = M.pick(AS), x0 = Math.abs(a) === 0.5 || a === -1 ? M.pick([-2, 2]) : M.pick([-1, 1]), y0 = a * x0 * x0;
      return { skill: 'Streckfaktor am Graphen ablesen', level: 2, q: 'Die Parabel hat die Gleichung y = a · x². Bestimme a mithilfe des markierten Punktes P.' + pgraph([{ a: a, d: 0, e: 0 }], { x: [-4, 4], y: a > 0 ? [-1, 9] : [-9, 1], marks: [{ x: x0, y: y0, text: 'P', color: C_ACC, pos: x0 < 0 ? 'left' : 'right' }] }),
        inputs: [{ kind: 'frac', answer: M.red(M.F(Math.round(a * 2), 2)), label: 'a =', placeholder: 'z. B. 2 oder −0,5' }],
        hints: ['Lies die Koordinaten von P ab.', 'P(' + n(x0) + ' | ' + n(y0) + '). Setze in y = a · x² ein: ' + n(y0) + ' = a · ' + par(x0) + '².', n(y0) + ' = a · ' + n(x0 * x0) + '. Teile durch ' + n(x0 * x0) + '.'],
        solution: 'P(' + n(x0) + ' | ' + n(y0) + '): ' + n(y0) + ' = a · ' + par(x0) + '² = a · ' + n(x0 * x0) + ' ⇒ a = ' + n(y0) + ' : ' + n(x0 * x0) + ' = <b>' + n(a) + '</b>. Gleichung: ' + vform(a, 0, 0) + '.',
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && Math.abs(f.n / f.d + a) < 1e-9) return 'Achte auf das Vorzeichen: Die Parabel ist nach ' + (a > 0 ? 'oben' : 'unten') + ' geöffnet, also ist a ' + (a > 0 ? 'positiv' : 'negativ') + '.'; if (f && Math.abs(x0) === 2 && Math.abs(f.n / f.d - y0 / x0) < 1e-9) return 'Du hast durch x geteilt. Teile durch x², hier ' + par(x0) + '² = 4.'; return null; },
        verify: function () { return Math.abs(fv(a, 0, 0, x0) - y0) < 1e-9 || 'a'; } };
    },
    a_punkt: function () {
      var a = M.pick(AS), x0 = M.pick([-4, -3, -2, 2, 3, 4]), y0 = a * x0 * x0;
      return { skill: 'Streckfaktor berechnen', level: 2, q: 'Die Parabel y = a · x² geht durch den Punkt P(' + n(x0) + ' | ' + n(y0) + '). Berechne a.',
        inputs: [{ kind: 'frac', answer: M.red(M.F(Math.round(a * 2), 2)), label: 'a =', placeholder: 'z. B. 3 oder −0,5' }],
        hints: ['Setze die Koordinaten von P in y = a · x² ein.', n(y0) + ' = a · ' + par(x0) + '² = a · ' + n(x0 * x0) + '.', 'a = ' + n(y0) + ' : ' + n(x0 * x0) + '.'],
        solution: n(y0) + ' = a · ' + par(x0) + '² ⇒ ' + n(y0) + ' = a · ' + n(x0 * x0) + ' ⇒ a = ' + n(y0) + ' : ' + n(x0 * x0) + ' = <b>' + n(a) + '</b>.<br>Die Parabel ' + vform(a, 0, 0) + ' ist ' + SHAPES[shapeIdx(a)] + '.',
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && Math.abs(f.n / f.d - y0 / x0) < 1e-9) return 'Du hast durch x geteilt. In der Gleichung steht aber x², also teilst du durch ' + par(x0) + '² = ' + n(x0 * x0) + '.'; if (f && Math.abs(f.n / f.d + a) < 1e-9) return 'Prüfe das Vorzeichen: ' + par(x0) + '² ist positiv. Das Vorzeichen von a ist also dasselbe wie das von ' + n(y0) + '.'; return null; },
        verify: function () { return Math.abs(fv(a, 0, 0, x0) - y0) < 1e-9 || 'a_punkt'; } };
    },
    scheitel: function (lvl) {
      var a = M.pick(AS), d = M.nz(-5, 5), e = M.rnd(-6, 6);
      return { skill: 'Scheitelpunkt und Öffnung', level: lvl >= 3 ? 3 : 2, q: 'Gib den Scheitelpunkt an und entscheide, ob die Parabel nach oben oder unten geöffnet ist. <span class="big-math">' + vform(a, d, e) + '</span>',
        inputs: [{ kind: 'num', answer: d, label: 'x-Koordinate von S' }, { kind: 'num', answer: e, label: 'y-Koordinate von S' }, { kind: 'mc', label: 'Öffnung', options: ['nach oben geöffnet, S ist der tiefste Punkt', 'nach unten geöffnet, S ist der höchste Punkt'], answer: a > 0 ? 0 : 1 }],
        hints: ['Die Form y = a(x − d)² + e hat den Scheitelpunkt S(d | e). Der Faktor a ändert S nicht.', 'In der Klammer steht ' + xin(d) + ', also d = ' + n(d) + '.', 'a = ' + n(a) + ' ist ' + (a > 0 ? 'positiv' : 'negativ') + '.'],
        solution: 'Scheitelpunkt <b>' + S(d, e) + '</b>. Wegen a = ' + n(a) + (a > 0 ? ' &gt; 0 ist die Parabel nach oben geöffnet, S ist der tiefste Punkt.' : ' &lt; 0 ist die Parabel nach unten geöffnet, S ist der höchste Punkt.') + pgraph([{ a: a, d: d, e: e, vertex: 'coords' }]),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && x === -d) return 'Vorsicht beim Vorzeichen: ' + xin(d) + ' wird 0 bei x = ' + n(d) + '. Dort liegt der Scheitelpunkt.'; var y = M.parseNum(v[1]); if (y !== null && e !== 0 && y === a * e) return 'Der Faktor a gehört nur zur Klammer. e wird nicht mit a multipliziert.'; return null; },
        verify: function () { var t = tableVertex(function (x) { return fv(a, d, e, x); }, d - 6, d + 6), p = a > 0 ? t.min : t.max; return (p[0] === d && Math.abs(p[1] - e) < 1e-9) || 'Scheitel'; } };
    },
    breite: function () {
      var abs = [0.5, 1, 2, 3], signs = abs.map(function () { return Math.random() < 0.5 ? -1 : 1; }), as = abs.map(function (b, i) { return b * signs[i]; });
      as = M.shuffle(as); var narrow = Math.random() < 0.5, target = narrow ? 3 : 0.5, ans = as.map(Math.abs).indexOf(target);
      var opts = as.map(function (a) { return vform(a, 0, 0); });
      return { skill: 'Parabeln nach Breite ordnen', level: 2, q: 'Welche Parabel ist am <b>' + (narrow ? 'schmalsten' : 'breitesten') + '</b>?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ans }],
        hints: ['Für die Breite ist nur der Betrag von a wichtig, nicht das Vorzeichen.', 'Je größer |a|, desto schneller wachsen die y-Werte und desto schmaler ist die Parabel.', 'Vergleiche die Beträge: ' + as.map(function (a) { return n(Math.abs(a)); }).join(', ') + '.'],
        solution: 'Richtig ist ' + opts[ans] + ', denn |a| = ' + n(target) + ' ist ' + (narrow ? 'am größten' : 'am kleinsten') + '. Das Vorzeichen bestimmt nur, ob die Parabel nach oben oder unten geöffnet ist.',
        mistakes: function (v) { var a = as[+v[0]]; if (a !== undefined && Math.abs(a) === (narrow ? 0.5 : 3)) return 'Genau umgekehrt: Ein großer Betrag von a macht die Parabel schmaler, ein kleiner Betrag breiter.'; if (a !== undefined && a < 0 && narrow && Math.abs(a) !== 3) return 'Das Minuszeichen macht die Parabel nicht schmaler, es klappt sie nur nach unten.'; return null; },
        verify: function () { var w = as.map(function (a) { return Math.abs(fv(a, 0, 0, 1)); }); var m = narrow ? Math.max.apply(null, w) : Math.min.apply(null, w); return w.indexOf(m) === ans || 'breite'; } };
    },
    bruecke: function () {
      var c = M.pick([[-0.5, 8], [-0.5, 18], [-0.5, 32], [-2, 8], [-2, 18], [-2, 32], [-1, 9], [-1, 16], [-1, 25]]), a = c[0], h = c[1], half = Math.sqrt(h / -a);
      var thing = M.pick(['Brückenbogen', 'Torbogen einer Halle', 'Bogen eines Tunneleingangs']);
      return { skill: 'Gestreckte Parabel im Sachzusammenhang', level: 3, q: 'Ein ' + thing + ' hat die Form der Parabel <span class="big-math">' + vform(a, 0, h) + '</span>. Dabei liegt der Ursprung in der Mitte am Boden, x und y in Meter.<br>a) Wie hoch ist der Bogen an der höchsten Stelle?<br>b) Wie breit ist der Bogen am Boden?',
        inputs: [{ kind: 'num', answer: h, label: 'a) Höhe', unit: 'm' }, { kind: 'num', answer: 2 * half, label: 'b) Breite', unit: 'm' }],
        hints: ['a) Der höchste Punkt ist der Scheitelpunkt. Er liegt bei x = 0.', 'b) Am Boden ist y = 0. Löse ' + vterm(a, 0, h) + ' = 0, also x² = ' + n(h) + ' : ' + n(-a) + ' = ' + n(h / -a) + '.', 'b) x = −' + n(half) + ' oder x = ' + n(half) + '. Die Breite ist der Abstand dieser beiden Stellen.'],
        solution: 'a) Scheitelpunkt S(0 | ' + n(h) + '): Der Bogen ist ' + n(h) + ' m hoch.<br>b) ' + vterm(a, 0, h) + ' = 0 ⇒ ' + afac(-a) + 'x² = ' + n(h) + ' ⇒ x² = ' + n(h / -a) + ' ⇒ x = −' + n(half) + ' oder x = ' + n(half) + '. Breite: ' + n(half) + ' m + ' + n(half) + ' m = ' + n(2 * half) + ' m.' + pgraph([{ a: a, d: 0, e: h, vertex: 'S(0 | ' + n(h) + ')' }], { x: [-Math.ceil(half) - 1, Math.ceil(half) + 1], y: [-1, h + Math.ceil(h / 6) + 1], marks: [{ x: -half, y: 0, color: C_CMP }, { x: half, y: 0, color: C_CMP }] }) + '<small>Die Achsen sind unterschiedlich skaliert.</small>',
        mistakes: function (v) { var b = M.parseNum(v[1]); if (b !== null && Math.abs(b - half) < 1e-9) return 'b) Das ist nur der Abstand von der Mitte bis zum Rand. Der Bogen reicht von −' + n(half) + ' bis ' + n(half) + '.'; if (b !== null && Math.abs(b - 2 * h / -a) < 1e-9) return 'b) Du musst noch die Wurzel ziehen: x² = ' + n(h / -a) + '.'; return null; },
        verify: function () { return (Math.abs(fv(a, 0, h, half)) < 1e-9 && Math.abs(fv(a, 0, h, -half)) < 1e-9 && tableVertex(function (x) { return fv(a, 0, h, x); }, -8, 8).max[1] === h) || 'bruecke'; } };
    }
  };

  return {
    id: '012', title: 'Parabeln strecken und spiegeln', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Normalparabel, Scheitelpunktform y = (x − d)² + e',
    lead: 'Manche Parabeln sind schmal, andere breit, manche sind nach unten geöffnet. Du lernst, welche Rolle der Faktor a in y = a(x − d)² + e spielt.',
    einstieg: { html: '<p>Ein Wasserstrahl aus einem Gartenschlauch bildet einen Bogen nach unten. Hält man den Schlauch flacher, wird der Bogen breiter. Ein Brückenbogen ist oft sehr flach, eine Satellitenschüssel dagegen nach oben geöffnet.</p><p class="note">Leitfrage: Wie kann man in der Gleichung ausdrücken, dass eine Parabel schmaler, breiter oder nach unten geöffnet ist?</p><p>Dafür gibt es den <b>Streckfaktor a</b>. Er steht vor dem x² bzw. vor der Klammer.</p>' + pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: 2, d: 0, e: 0 }, { a: -0.5, d: 0, e: 0, color: C_ACC }], { x: [-4, 4], y: [-6, 6], label: 'Normalparabel, gestreckte und gespiegelte Parabel' }) + '<p><small>Gestrichelt: y = x². <b style="color:#1d4ed8">Blau</b>: y = 2x². <b style="color:#b45309">Orange</b>: y = −0,5x².</small></p>' },
    ziele: ['Ich erkenne am Faktor a, ob eine Parabel nach oben oder unten geöffnet ist.', 'Ich erkenne, ob eine Parabel gestreckt (schmaler) oder gestaucht (breiter) ist.', 'Ich berechne Funktionswerte von y = a(x − d)² + e.', 'Ich ordne Gleichungen und Graphen einander zu.', 'Ich bestimme a aus einem Punkt der Parabel.'],
    fachwoerter: [['Streckfaktor a', 'Die Zahl vor x² bzw. vor der Klammer in y = a(x − d)² + e.'], ['gestreckt', '|a| > 1: Die Parabel ist schmaler als die Normalparabel.'], ['gestaucht', '|a| < 1: Die Parabel ist breiter als die Normalparabel.'], ['an der x-Achse gespiegelt', 'a < 0: Die Parabel ist nach unten geöffnet. Der Scheitelpunkt ist der höchste Punkt.'], ['Betrag |a|', 'Die Zahl ohne Vorzeichen, zum Beispiel |−3| = 3.']],
    diagnose: [
      { q: 'Was ergibt 3 · (−2)²?', options: ['−12', '36', '12', 'Weiß ich noch nicht'], answer: 2, why: 'Erst quadrieren: (−2)² = 4. Dann 3 · 4 = 12.', review: 'Rechenreihenfolge: Potenz vor Punkt' },
      { q: 'Welchen Scheitelpunkt hat y = (x − 2)² + 5?', options: ['S(2 | 5)', 'S(−2 | 5)', 'S(5 | 2)', 'Weiß ich noch nicht'], answer: 0, why: 'In der Scheitelpunktform y = (x − d)² + e ist S(d | e).', review: 'Parabeln verschieben (Modul 011)' },
      { q: 'Was ergibt 0,5 · 6?', options: ['12', '3', '0,3', 'Weiß ich noch nicht'], answer: 1, why: '0,5 · 6 ist die Hälfte von 6, also 3.', review: 'Rechnen mit Dezimalzahlen' },
      { q: 'Was ergibt −1 · 4²?', options: ['16', '−8', '−16', 'Weiß ich noch nicht'], answer: 2, why: '4² = 16, dann mal −1 ergibt −16.', review: 'Rechnen mit negativen Zahlen' }],
    erklaerung:
      '<h3>1. Strecken und Stauchen</h3><p>Bei <b>y = a · x²</b> werden alle y-Werte der Normalparabel mit a multipliziert.</p>' +
      '<table class="tab"><tr><th>x</th><td>−2</td><td>−1</td><td>0</td><td>1</td><td>2</td></tr><tr><th>y = x²</th><td>4</td><td>1</td><td>0</td><td>1</td><td>4</td></tr><tr><th>y = 2x²</th><td>8</td><td>2</td><td>0</td><td>2</td><td>8</td></tr><tr><th>y = 0,5x²</th><td>2</td><td>0,5</td><td>0</td><td>0,5</td><td>2</td></tr></table>' +
      pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: 2, d: 0, e: 0 }, { a: 0.5, d: 0, e: 0, color: C_ACC }], { x: [-4, 4], y: [-1, 9], label: 'Gestreckte und gestauchte Parabel' }) +
      '<p><small>Gestrichelt: y = x². <b style="color:#1d4ed8">Blau</b>: y = 2x² (gestreckt, schmaler). <b style="color:#b45309">Orange</b>: y = 0,5x² (gestaucht, breiter).</small></p>' +
      '<h3>2. Spiegeln an der x-Achse</h3><p>Ist a negativ, werden alle y-Werte negativ. Die Parabel ist <b>nach unten geöffnet</b>, der Scheitelpunkt ist der <b>höchste</b> Punkt. y = −x² ist die an der x-Achse gespiegelte Normalparabel.</p>' +
      pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: -1, d: 0, e: 0 }, { a: -3, d: 0, e: 0, color: C_ACC }], { x: [-4, 4], y: [-9, 5], label: 'Nach unten geöffnete Parabeln' }) +
      '<p><small>Gestrichelt: y = x². <b style="color:#1d4ed8">Blau</b>: y = −x². <b style="color:#b45309">Orange</b>: y = −3x² (gespiegelt und gestreckt).</small></p>' +
      '<div class="merk"><b>Merke:</b> Für die Parabel <b>y = a(x − d)² + e</b> gilt:<br>• Scheitelpunkt <b>S(d | e)</b>, a ändert den Scheitelpunkt nicht.<br>• a &gt; 0: nach oben geöffnet. a &lt; 0: nach unten geöffnet.<br>• |a| &gt; 1: gestreckt (schmaler). |a| &lt; 1: gestaucht (breiter). |a| = 1: so breit wie die Normalparabel.</div>' +
      '<h3>3. Werte berechnen</h3><p>Reihenfolge beachten: Klammer, quadrieren, mit a multiplizieren, e addieren. Beispiel y = −2(x − 1)² + 3 für x = 4: (4 − 1)² = 9, −2 · 9 = −18, −18 + 3 = −15.</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Für a kannst du 0,5 oder 1/2 schreiben, für negative Werte zum Beispiel −2.</p>',
    entdecken: {
      html: '<p>Wähle den Streckfaktor a und verschiebe die Parabel. Gestrichelt siehst du zum Vergleich eine Normalparabel mit demselben Scheitelpunkt.</p><div class="ctl"><label>a = <select id="s_a"><option value="-3">−3</option><option value="-2">−2</option><option value="-1">−1</option><option value="-0.5">−0,5</option><option value="0.5">0,5</option><option value="1" selected>1</option><option value="2">2</option><option value="3">3</option></select></label><label>d = <b id="v_d"></b> <input type="range" id="r_d" min="-3" max="3" step="1" value="-1"></label><label>e = <b id="v_e"></b> <input type="range" id="r_e" min="-3" max="3" step="1" value="-2"></label></div><div id="e_g"></div><p class="big-math" id="e_eq"></p><p id="e_tx"></p>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var a = +root.querySelector('#s_a').value, d = +root.querySelector('#r_d').value, e = +root.querySelector('#r_e').value;
          root.querySelector('#v_d').textContent = n(d); root.querySelector('#v_e').textContent = n(e);
          root.querySelector('#e_g').innerHTML = pgraph([{ a: 1, d: d, e: e, color: C_CMP, dash: true, width: 2 }, { a: a, d: d, e: e, vertex: 'coords' }], { x: [-6, 6], y: [-8, 8] });
          root.querySelector('#e_eq').innerHTML = vform(a, d, e);
          root.querySelector('#e_tx').innerHTML = a === 1 ? 'a = 1: eine verschobene Normalparabel.' : 'Die Parabel ist ' + SHAPES[shapeIdx(a)] + '. Scheitelpunkt ' + S(d, e) + '.';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Das Vorzeichen von a bestimmt die Öffnung, der Betrag von a die Breite. d und e verschieben nur, der Scheitelpunkt bleibt S(d | e).'); }
        root.querySelector('#s_a').addEventListener('change', hit);
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        draw();
      }
    },
    beispiel: { title: 'Parabel untersuchen', q: 'Untersuche die Parabel y = −0,5(x − 2)² + 4: Scheitelpunkt, Öffnung, Form und den Wert für x = 6.',
      steps: ['Scheitelpunkt ablesen: d = 2, e = 4, also S(2 | 4).', 'Öffnung: a = −0,5 ist negativ, die Parabel ist nach unten geöffnet. S ist der höchste Punkt.', 'Form: |a| = 0,5 ist kleiner als 1, die Parabel ist gestaucht, also breiter als die Normalparabel.', 'Wert für x = 6: (6 − 2)² = 16, −0,5 · 16 = −8, −8 + 4 = −4. Also y = −4.', 'Kontrolle am Graphen: Der Punkt (6 | −4) liegt auf der Parabel.' + pgraph([{ a: -0.5, d: 2, e: 4, vertex: 'S(2 | 4)' }], { x: [-3, 7], y: [-5, 5], marks: [{ x: 6, y: -4, text: '(6 | −4)', color: C_CMP, pos: 'left' }] })] },
    tasks: { gen: gen, plan: { G: ['form:1', 'werte:1', 'zuordnen:2', 'breite:2'], S: ['form:1', 'werte:1', 'zuordnen:2', 'a_ablesen:2', 'scheitel:2'], E: ['form:2', 'werte:2', 'zuordnen:3', 'a_punkt:2', 'scheitel:2', 'breite:2'] },
      extra: 'bruecke', test: ['form:2', 'werte:2', 'zuordnen:2', 'a_ablesen:2', 'scheitel:2', 'breite:2'] },
    lerncheck: ['Ich erkenne am Vorzeichen von a die Öffnung der Parabel.', 'Ich erkenne am Betrag von a, ob die Parabel gestreckt oder gestaucht ist.', 'Ich berechne Funktionswerte von y = a(x − d)² + e.', 'Ich ordne Gleichungen und Graphen einander zu.']
  };
})();
