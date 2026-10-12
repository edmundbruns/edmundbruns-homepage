/* Modul 011 (Klasse 9) · Parabeln verschieben */
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
  function de(lvl) { var d, e; do { d = lvl >= 2 ? M.rnd(-5, 5) : M.nz(-4, 4); e = lvl >= 2 ? M.rnd(-5, 5) : M.nz(-4, 4); } while (d === 0 && e === 0); return [d, e]; }
  function dir(d, e) {
    var p = [];
    if (d) p.push(Math.abs(d) + (d > 0 ? ' nach rechts' : ' nach links'));
    if (e) p.push(Math.abs(e) + (e > 0 ? ' nach oben' : ' nach unten'));
    return p.length ? p.join(' und ') : 'gar nicht';
  }
  function sIn(d, e) { return [{ kind: 'num', answer: d, label: 'x-Koordinate von S' }, { kind: 'num', answer: e, label: 'y-Koordinate von S' }]; }
  function sMistake(d, e) {
    return function (v) {
      var x = M.parseNum(v[0]), y = M.parseNum(v[1]);
      if (x !== null && d !== 0 && Math.abs(x + d) < 1e-9) return 'Vorsicht, typischer Fehler beim Vorzeichen: In der Klammer steht ' + xin(d) + '. Die Klammer wird 0 für x = ' + n(d) + ', nicht für x = ' + n(-d) + '. Deshalb liegt S bei x = ' + n(d) + '.';
      if (x !== null && y !== null && Math.abs(x - e) < 1e-9 && Math.abs(y - d) < 1e-9 && d !== e) return 'Du hast die Koordinaten vertauscht. Die Zahl in der Klammer gehört zur x-Koordinate, die Zahl hinten zur y-Koordinate.';
      if (y !== null && e !== 0 && Math.abs(y + e) < 1e-9) return 'Die y-Koordinate übernimmst du mit demselben Vorzeichen: ' + pm(e).trim() + ' hinten bedeutet e = ' + n(e) + '.';
      return null;
    };
  }
  function termMistake(d, e) {
    return function (v) {
      if (d !== 0 && M.termEq(v[0], vstr(1, -d, e))) return 'Fast! Achte auf das Vorzeichen in der Klammer: Für eine Verschiebung nach ' + (d > 0 ? 'rechts' : 'links') + ' steht ' + xin(d) + ' in der Klammer. Prüfe: Die Klammer muss am Scheitelpunkt x = ' + n(d) + ' null werden.';
      if (e !== 0 && M.termEq(v[0], vstr(1, d, -e))) return 'Die Verschiebung nach ' + (e > 0 ? 'oben' : 'unten') + ' stimmt nicht. Nach oben heißt + e, nach unten heißt − e.';
      if (d !== e && M.termEq(v[0], vstr(1, e, d))) return 'Du hast die Verschiebungen vertauscht. Links/rechts steht in der Klammer, oben/unten hinten.';
      return null;
    };
  }
  function yTerm(d, e, x) { return '(' + n(x) + pm(-d) + ')²' + pm(e); }
  var gen = {
    s_gleichung: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1];
      return { skill: 'Scheitelpunkt aus der Gleichung', level: lvl >= 2 ? 2 : 1, q: 'Gib den Scheitelpunkt S der Parabel an. <span class="big-math">' + vform(1, d, e) + '</span>',
        inputs: sIn(d, e),
        hints: ['Vergleiche mit der Scheitelpunktform y = (x − d)² + e. Der Scheitelpunkt ist S(d | e).', d === 0 ? 'Es gibt keine Klammer, also ist d = 0.' : d < 0 ? 'In der Klammer steht ' + xin(d) + ' = (x − ' + par(d) + '). Also ist d = ' + n(d) + ', nicht ' + n(-d) + '.' : 'In der Klammer steht (x − ' + n(d) + '). Also ist d = ' + n(d) + '.', 'Hinten steht ' + (e === 0 ? 'nichts, also e = 0' : pm(e).trim() + ', also e = ' + n(e)) + '.'],
        solution: vform(1, d, e) + ' = (x − ' + par(d) + ')² + ' + par(e) + '. Also d = ' + n(d) + ' und e = ' + n(e) + ', der Scheitelpunkt ist <b>' + S(d, e) + '</b>.' + pgraph([{ a: 1, d: d, e: e, vertex: 'coords' }]),
        mistakes: sMistake(d, e),
        verify: function () { var t = tableVertex(function (x) { return M.evalTree(M.parseTerm(vstr(1, d, e)), { x: x }); }, -10, 10); return (t.min[0] === d && t.min[1] === e) || 'Scheitel ' + t.min; } };
    },
    s_graph: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1];
      return { skill: 'Scheitelpunkt am Graphen ablesen', level: 1, q: 'Die Parabel ist eine verschobene Normalparabel. Lies den Scheitelpunkt S ab.' + pgraph([{ a: 1, d: d, e: e, vertex: true }]),
        inputs: sIn(d, e),
        hints: ['Der Scheitelpunkt ist der tiefste Punkt der Parabel. Er ist markiert.', 'Gehe von S senkrecht zur x-Achse: Dort liest du die x-Koordinate ab.', 'Gehe von S waagerecht zur y-Achse: Dort liest du die y-Koordinate ab.'],
        solution: 'Der tiefste Punkt ist <b>' + S(d, e) + '</b>. Die Normalparabel wurde ' + dir(d, e) + ' verschoben.' + pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: 1, d: d, e: e, vertex: 'coords' }]),
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x !== null && y !== null && x === e && y === d && d !== e) return 'Du hast die Koordinaten vertauscht. Zuerst kommt die x-Koordinate (waagerecht), dann die y-Koordinate (senkrecht).'; return null; },
        verify: function () { var t = tableVertex(function (x) { return fv(1, d, e, x); }, -10, 10); return (t.min[0] === d && t.min[1] === e) || 'Scheitel'; } };
    },
    gl_graph: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1];
      return { src: '(x-(' + d + '))^2+(' + e + ')', skill: 'Gleichung aus dem Graphen', level: 2, q: 'Die Parabel ist eine verschobene Normalparabel. Gib ihre Gleichung in Scheitelpunktform an.' + pgraph([{ a: 1, d: d, e: e, vertex: true }]),
        inputs: [{ kind: 'term', answer: vstr(1, d, e), label: 'y =', placeholder: 'z. B. (x − 2)^2 + 1' }],
        hints: ['Lies zuerst den Scheitelpunkt S(d | e) ab.', 'Der Scheitelpunkt ist ' + S(d, e) + '. Setze in y = (x − d)² + e ein.', 'y = (x − ' + par(d) + ')² + ' + par(e) + '. Vereinfache die Vorzeichen.'],
        solution: 'Scheitelpunkt ' + S(d, e) + ', also d = ' + n(d) + ' und e = ' + n(e) + '.<br>y = (x − ' + par(d) + ')² + ' + par(e) + ' = <b>' + vterm(1, d, e) + '</b>.<br><small>Kontrolle: Für x = ' + n(d) + ' ist die Klammer 0 und y = ' + n(e) + '.</small>',
        mistakes: termMistake(d, e),
        verify: function () { var t = tableVertex(function (x) { return M.evalTree(M.parseTerm(vstr(1, d, e)), { x: x }); }, -10, 10); return (t.min[0] === d && t.min[1] === e) || 'Gleichung'; } };
    },
    gl_s: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1];
      return { src: '(x-(' + d + '))^2+(' + e + ')', skill: 'Gleichung aus dem Scheitelpunkt', level: 2, q: 'Eine verschobene Normalparabel hat den Scheitelpunkt <b>' + S(d, e) + '</b>. Gib ihre Gleichung an.',
        inputs: [{ kind: 'term', answer: vstr(1, d, e), label: 'y =', placeholder: 'z. B. (x + 3)^2 − 2' }],
        hints: ['Die Scheitelpunktform lautet y = (x − d)² + e mit S(d | e).', 'Hier ist d = ' + n(d) + ' und e = ' + n(e) + '.', 'y = (x − ' + par(d) + ')² + ' + par(e) + '. ' + (d < 0 ? 'Minus mal Minus ergibt Plus: x − (' + n(d) + ') = x + ' + n(-d) + '.' : '')],
        solution: 'y = (x − ' + par(d) + ')² + ' + par(e) + ' = <b>' + vterm(1, d, e) + '</b>.',
        mistakes: termMistake(d, e),
        verify: function () { return Math.abs(M.evalTree(M.parseTerm(vstr(1, d, e)), { x: d }) - e) < 1e-9 || 'S'; } };
    },
    beschreiben: function () {
      var d = M.nz(-5, 5), e = M.nz(-5, 5);
      if (Math.abs(d) === Math.abs(e)) e = e > 0 ? e + 1 : e - 1;
      var right = dir(d, e), opts = [right, dir(-d, e), dir(d, -e), dir(-d, -e)];
      opts = M.shuffle(opts);
      return { skill: 'Verschiebung beschreiben', level: 1, q: 'Wie entsteht der Graph von <span class="big-math">' + vform(1, d, e) + '</span> aus der Normalparabel? Die Normalparabel wird verschoben um …',
        inputs: [{ kind: 'mc', label: 'Verschiebung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Die Zahl in der Klammer verschiebt nach links oder rechts, die Zahl hinten nach oben oder unten.', 'Bestimme den Scheitelpunkt: S' + '(' + n(d) + ' | ' + n(e) + '). Er war vorher bei (0 | 0).', 'Achtung: ' + xin(d) + ' bedeutet eine Verschiebung nach ' + (d > 0 ? 'rechts' : 'links') + '.'],
        solution: 'Der Scheitelpunkt wandert von (0 | 0) nach ' + S(d, e) + '. Die Normalparabel wird <b>' + right + '</b> verschoben.' + pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: 1, d: d, e: e, vertex: 'coords' }]),
        mistakes: function (v) { var o = opts[+v[0]]; if (o === dir(-d, e) || o === dir(-d, -e)) return 'Achte auf das Vorzeichen in der Klammer: ' + xin(d) + ' wird 0 für x = ' + n(d) + '. Der Scheitelpunkt liegt also bei x = ' + n(d) + ', die Verschiebung geht nach ' + (d > 0 ? 'rechts' : 'links') + '.'; return null; },
        verify: function () { var t = tableVertex(function (x) { return fv(1, d, e, x); }, -10, 10); return (t.min[0] === d && t.min[1] === e && new Set(opts).size === 4) || 'beschreiben'; } };
    },
    punktprobe: function (lvl) {
      var p = de(2), d = p[0], e = p[1], x = d + M.nz(-3, 3), yes = Math.random() < 0.5, y = fv(1, d, e, x), yy = yes ? y : M.pick([fv(1, -d, e, x) !== y ? fv(1, -d, e, x) : y + 2, y + M.pick([-2, -1, 1, 3])]);
      return { skill: 'Punktprobe', level: 2, q: 'Liegt der Punkt P(' + n(x) + ' | ' + n(yy) + ') auf der Parabel ' + vform(1, d, e) + '?',
        inputs: [{ kind: 'mc', label: 'Antwort', options: ['Ja, P liegt auf der Parabel.', 'Nein, P liegt nicht auf der Parabel.'], answer: yes ? 0 : 1 }],
        hints: ['Setze x = ' + n(x) + ' in die Gleichung ein.', 'Rechne zuerst die Klammer aus: ' + n(x) + pm(-d) + ' = ' + n(x - d) + '.', 'y = ' + par(x - d) + '²' + pm(e) + ' = ' + n((x - d) * (x - d)) + pm(e) + ' = ' + n(y) + '. Vergleiche mit P.'],
        solution: 'y = ' + yTerm(d, e, x) + ' = ' + par(x - d) + '²' + pm(e) + ' = ' + n(y) + '. ' + (yes ? 'Das stimmt mit P überein. P liegt auf der Parabel.' : 'P hat aber die y-Koordinate ' + n(yy) + '. P liegt nicht auf der Parabel.'),
        verify: function () { return (Math.abs(M.evalTree(M.parseTerm(vstr(1, d, e)), { x: x }) - yy) < 1e-9) === yes || 'Probe'; } };
    },
    werte: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1], k = M.rnd(1, lvl >= 3 ? 5 : 3), x1 = d - k, x2 = d + k;
      if (lvl < 2) { x2 = d + k + 1; }
      var y1 = fv(1, d, e, x1), y2 = fv(1, d, e, x2);
      return { skill: 'Funktionswerte berechnen', level: lvl, q: 'Berechne die y-Werte der Parabel <span class="big-math">' + vform(1, d, e) + '</span> für x = ' + n(x1) + ' und x = ' + n(x2) + '.',
        inputs: [{ kind: 'num', answer: y1, label: 'y für x = ' + n(x1) }, { kind: 'num', answer: y2, label: 'y für x = ' + n(x2) }],
        hints: ['Setze den x-Wert für x ein. Rechne zuerst die Klammer aus, dann quadrieren, dann ' + (e === 0 ? 'fertig' : pm(e).trim().replace('+ ', 'plus ').replace('− ', 'minus ')) + '.', 'Für x = ' + n(x1) + ': (' + n(x1) + pm(-d) + ')² = ' + par(x1 - d) + '² = ' + n((x1 - d) * (x1 - d)) + '.', 'Für x = ' + n(x2) + ': (' + n(x2) + pm(-d) + ')² = ' + par(x2 - d) + '² = ' + n((x2 - d) * (x2 - d)) + '.' + (e === 0 ? '' : ' Vergiss ' + pm(e).trim() + ' nicht.')],
        solution: 'x = ' + n(x1) + ': y = ' + yTerm(d, e, x1) + ' = ' + n((x1 - d) * (x1 - d)) + pm(e) + ' = ' + n(y1) + '<br>x = ' + n(x2) + ': y = ' + yTerm(d, e, x2) + ' = ' + n((x2 - d) * (x2 - d)) + pm(e) + ' = ' + n(y2) + (lvl >= 2 ? '<br>Beide y-Werte sind gleich, weil x = ' + n(x1) + ' und x = ' + n(x2) + ' gleich weit vom Scheitelpunkt bei x = ' + n(d) + ' entfernt sind.' : ''),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && d !== 0 && Math.abs(a - fv(1, -d, e, x1)) < 1e-9 && a !== y1) return 'Achte auf das Vorzeichen in der Klammer: ' + xin(d) + ' mit x = ' + n(x1) + ' ergibt ' + n(x1) + pm(-d) + ' = ' + n(x1 - d) + '.'; if (a !== null && Math.abs(a - ((x1 - d) * (x1 - d))) < 1e-9 && e !== 0) return 'Du hast ' + pm(e).trim() + ' am Ende vergessen.'; if (a !== null && Math.abs(a - (x1 * x1 - d * d + e)) < 1e-9 && a !== y1) return 'Die Klammer wird als Ganzes quadriert. Rechne erst ' + n(x1) + pm(-d) + ' aus und quadriere dann.'; return null; },
        verify: function () { var t = M.parseTerm(vstr(1, d, e)); return (M.evalTree(t, { x: x1 }) === y1 && M.evalTree(t, { x: x2 }) === y2) || 'Werte'; } };
    },
    spiegel: function (lvl) {
      var p = de(lvl), d = p[0], e = p[1], k = M.nz(-4, 4), x = d + k, y = fv(1, d, e, x);
      return { skill: 'Symmetrieachse nutzen', level: 3, q: 'Der Punkt P(' + n(x) + ' | ' + n(y) + ') liegt auf der Parabel ' + vform(1, d, e) + '.<br>a) Gib die Symmetrieachse an.<br>b) Ein zweiter Punkt Q der Parabel hat ebenfalls den y-Wert ' + n(y) + '. Gib seine x-Koordinate an.',
        inputs: [{ kind: 'num', answer: d, label: 'a) Symmetrieachse: x =' }, { kind: 'num', answer: d - k, label: 'b) x-Koordinate von Q' }],
        hints: ['Die Symmetrieachse ist die senkrechte Gerade durch den Scheitelpunkt.', 'Der Scheitelpunkt ist ' + S(d, e) + ', also ist die Symmetrieachse x = ' + n(d) + '.', 'P liegt ' + Math.abs(k) + (k > 0 ? ' rechts' : ' links') + ' von der Symmetrieachse. Q liegt genauso weit auf der anderen Seite.'],
        solution: 'a) Scheitelpunkt ' + S(d, e) + ', Symmetrieachse <b>x = ' + n(d) + '</b>.<br>b) P ist ' + Math.abs(k) + ' von der Achse entfernt. Q: x = ' + n(d) + (k > 0 ? ' − ' : ' + ') + Math.abs(k) + ' = <b>' + n(d - k) + '</b>. Probe: ' + yTerm(d, e, d - k) + ' = ' + n(y) + '.' + pgraph([{ a: 1, d: d, e: e, vertex: true }], { marks: [{ x: x, y: y, text: 'P', color: C_ACC, pos: k < 0 ? 'left' : 'right' }, { x: d - k, y: y, text: 'Q', color: C_CMP, pos: k < 0 ? 'right' : 'left' }], hl: [{ y: y }] }),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && d !== 0 && a === -d) return 'Achte auf das Vorzeichen: Die Klammer ' + xin(d) + ' wird 0 bei x = ' + n(d) + '. Dort liegt die Symmetrieachse.'; var b = M.parseNum(v[1]); if (b !== null && b === -x && d !== 0) return 'Gespiegelt wird an der Symmetrieachse x = ' + n(d) + ', nicht an der y-Achse.'; return null; },
        verify: function () { return Math.abs(fv(1, d, e, d - k) - y) < 1e-9 && d - k !== x || 'Spiegel'; } };
    },
    durch_punkt: function () {
      if (Math.random() < 0.5) {
        var px = M.nz(-3, 3), e = M.rnd(-6, 6), py = px * px + e;
        return { src: 'x^2+(' + e + ')', skill: 'Parabel durch einen Punkt', level: 3, q: 'Eine verschobene Normalparabel hat ihren Scheitelpunkt auf der y-Achse. Sie geht durch den Punkt P(' + n(px) + ' | ' + n(py) + '). Gib ihre Gleichung an.',
          inputs: [{ kind: 'term', answer: vstr(1, 0, e), label: 'y =', placeholder: 'z. B. x^2 − 3' }],
          hints: ['Liegt der Scheitelpunkt auf der y-Achse, ist d = 0. Die Gleichung hat die Form y = x² + e.', 'Setze P ein: ' + n(py) + ' = ' + par(px) + '² + e.', n(py) + ' = ' + n(px * px) + ' + e. Löse nach e auf.'],
          solution: 'Ansatz y = x² + e. P einsetzen: ' + n(py) + ' = ' + n(px * px) + ' + e ⇒ e = ' + n(e) + '. Also <b>' + vform(1, 0, e) + '</b>. Scheitelpunkt ' + S(0, e) + '.',
          mistakes: function (v) { if (M.termEq(v[0], vstr(1, 0, py))) return 'Die y-Koordinate von P ist nicht automatisch e. P liegt nicht im Scheitelpunkt. Setze P in y = x² + e ein.'; return null; },
          verify: function () { return fv(1, 0, e, px) === py || 'P'; } };
      }
      var k = M.rnd(1, 4), d = M.rnd(-3, 4), px2 = d + k, py2 = k * k;
      return { src: '(x-(' + d + '))^2', skill: 'Parabel durch einen Punkt', level: 3, q: 'Eine verschobene Normalparabel hat ihren Scheitelpunkt auf der x-Achse, und zwar links vom Punkt P(' + n(px2) + ' | ' + n(py2) + '). P liegt auf der Parabel. Gib ihre Gleichung an.',
        inputs: [{ kind: 'term', answer: vstr(1, d, 0), label: 'y =', placeholder: 'z. B. (x − 1)^2' }],
        hints: ['Liegt der Scheitelpunkt auf der x-Achse, ist e = 0. Die Gleichung hat die Form y = (x − d)².', 'Setze P ein: ' + n(py2) + ' = (' + n(px2) + ' − d)². Welche Zahl ergibt quadriert ' + n(py2) + '?', 'Die Klammer ist ' + k + ' oder −' + k + '. Da S links von P liegt, ist ' + n(px2) + ' − d = ' + k + '.'],
        solution: 'Ansatz y = (x − d)². P einsetzen: ' + n(py2) + ' = (' + n(px2) + ' − d)². Da S links von P liegt, ist ' + n(px2) + ' − d = ' + k + ', also d = ' + n(d) + '. Gleichung: <b>' + vform(1, d, 0) + '</b>.' + pgraph([{ a: 1, d: d, e: 0, vertex: 'coords' }], { marks: [{ x: px2, y: py2, text: 'P', color: C_CMP }] }),
        mistakes: function (v) { if (M.termEq(v[0], vstr(1, px2 + k, 0))) return 'Dann läge der Scheitelpunkt rechts von P. Er soll aber links von P liegen.'; return null; },
        verify: function () { return (fv(1, d, 0, px2) === py2 && d < px2) || 'P2'; } };
    }
  };

  return {
    id: '011', title: 'Parabeln verschieben', bereich: 'Quadratische Funktionen', minutes: '45 bis 60',
    vorkenntnisse: 'Normalparabel y = x², Scheitelpunkt, Rechnen mit negativen Zahlen',
    lead: 'Was passiert, wenn man die Normalparabel nach rechts, links, oben oder unten schiebt? Du lernst, wie man das an der Gleichung sieht.',
    einstieg: { html: '<p>Bei einem Computerspiel springt eine Figur in einem Parabelbogen über Hindernisse. Je nachdem, wo sie abspringt, liegt der höchste oder tiefste Punkt der Bahn an einer anderen Stelle. Der Bogen selbst hat aber immer dieselbe Form.</p><p class="note">Leitfrage: Wie muss man die Gleichung y = x² ändern, damit die Parabel an einer anderen Stelle liegt?</p><p>Du lernst die <b>Scheitelpunktform</b> y = (x − d)² + e kennen. An ihr kannst du sofort ablesen, wohin die Normalparabel verschoben wurde.</p>' + pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2, label: 'y = x²', labelLeft: true }, { a: 1, d: 3, e: -2, vertex: 'S(3 | −2)', label: 'verschoben' }], { x: [-3, 6], y: [-3, 8], label: 'Normalparabel und verschobene Parabel' }) },
    ziele: ['Ich beschreibe, wie die Parabel y = (x − d)² + e aus der Normalparabel entsteht.', 'Ich lese den Scheitelpunkt S(d | e) aus der Gleichung ab und achte auf das Vorzeichen von d.', 'Ich lese den Scheitelpunkt am Graphen ab und gebe die Gleichung an.', 'Ich berechne Funktionswerte und prüfe Punkte.', 'Ich nutze die Symmetrieachse x = d.'],
    fachwoerter: [['Scheitelpunktform', 'Die Gleichung y = (x − d)² + e. Der Scheitelpunkt ist S(d | e).'], ['Verschiebung in x-Richtung', 'd > 0: nach rechts, d < 0: nach links. In der Klammer steht dann (x − d).'], ['Verschiebung in y-Richtung', 'e > 0: nach oben, e < 0: nach unten.'], ['Symmetrieachse', 'Die senkrechte Gerade x = d durch den Scheitelpunkt.']],
    diagnose: [
      { q: 'Was ergibt (2 − 5)²?', options: ['−9', '9', '−3', 'Weiß ich noch nicht'], answer: 1, why: '2 − 5 = −3 und (−3)² = 9.', review: 'Rechnen mit negativen Zahlen und Quadrieren' },
      { q: 'Welche Koordinaten hat der Scheitelpunkt der Normalparabel y = x²?', options: ['S(0 | 0)', 'S(1 | 1)', 'S(0 | 1)', 'Weiß ich noch nicht'], answer: 0, why: 'Der tiefste Punkt der Normalparabel ist der Ursprung.', review: 'Die Normalparabel (Modul 010)' },
      { q: 'Wie kann man x − (−4) einfacher schreiben?', options: ['x − 4', '−4x', 'x + 4', 'Weiß ich noch nicht'], answer: 2, why: 'Minus mal Minus ergibt Plus: x − (−4) = x + 4.', review: 'Vorzeichenregeln' },
      { q: 'Der Punkt (1 | 2) wird um 3 nach rechts und 4 nach unten verschoben. Wo liegt er dann?', options: ['(4 | −2)', '(−2 | 6)', '(4 | 6)', 'Weiß ich noch nicht'], answer: 0, why: 'x: 1 + 3 = 4, y: 2 − 4 = −2.', review: 'Punkte im Koordinatensystem verschieben' }],
    erklaerung:
      '<h3>1. Verschieben nach oben oder unten</h3><p>Bei <b>y = x² + e</b> wird zu jedem y-Wert der Normalparabel die Zahl e addiert. Die ganze Parabel rutscht um e nach oben (e &gt; 0) oder nach unten (e &lt; 0). Beispiel: y = x² − 3 hat den Scheitelpunkt S(0 | −3).</p>' +
      '<h3>2. Verschieben nach rechts oder links</h3><p>Bei <b>y = (x − 3)²</b> wird die Klammer null, wenn x = 3 ist. Dort liegt jetzt der tiefste Punkt. Die Parabel ist also um 3 nach <b>rechts</b> verschoben, obwohl ein Minus in der Klammer steht.</p>' +
      '<table class="tab"><tr><th>x</th><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr><tr><th>y = (x − 3)²</th><td>4</td><td>1</td><td>0</td><td>1</td><td>4</td></tr></table>' +
      '<p>Entsprechend ist <b>y = (x + 2)²</b> = (x − (−2))² um 2 nach <b>links</b> verschoben.</p>' +
      '<div class="merk"><b>Merke:</b> Die Parabel mit der Gleichung <b>y = (x − d)² + e</b> (Scheitelpunktform) ist eine verschobene Normalparabel mit dem <b>Scheitelpunkt S(d | e)</b>.<br>• (x − 3)²: d = 3, nach rechts. (x + 3)²: d = −3, nach links.<br>• + e: nach oben, − e: nach unten.<br>• Die Symmetrieachse ist die senkrechte Gerade x = d.</div>' +
      pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2, label: 'y = x²', labelLeft: true }, { a: 1, d: 3, e: 1, vertex: 'S(3 | 1)' }, { a: 1, d: -2, e: -2, vertex: 'S(−2 | −2)', color: C_ACC }], { x: [-5, 6], y: [-3, 8], label: 'Verschobene Parabeln' }) +
      '<p>Die <b style="color:#1d4ed8">blaue</b> Parabel hat den Scheitelpunkt S(3 | 1), ihre Gleichung ist y = (x − 3)² + 1. Die <b style="color:#b45309">orange</b> Parabel hat den Scheitelpunkt S(−2 | −2), ihre Gleichung ist y = (x + 2)² − 2.</p>' +
      '<p class="note"><b>Typischer Fehler:</b> Bei y = (x + 5)² liegt der Scheitelpunkt <b>nicht</b> bei x = 5, sondern bei x = −5. Prüfe immer: Für welches x wird die Klammer null?</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> „hoch 2“ schreibst du als ^2 oder mit der Taste ², zum Beispiel (x − 2)^2 + 1.</p>',
    entdecken: {
      html: '<p>Verschiebe die Normalparabel mit den Reglern. Achte auf das Vorzeichen in der Klammer.</p><div class="ctl"><label>d = <b id="v_d"></b> <input type="range" id="r_d" min="-4" max="4" step="1" value="-2"></label><label>e = <b id="v_e"></b> <input type="range" id="r_e" min="-4" max="4" step="1" value="-1"></label></div><div id="e_g"></div><p class="big-math" id="e_eq"></p><p id="e_tx"></p><ul><li>Wohin wandert die Parabel, wenn d größer wird?</li><li>Welches Zeichen steht in der Klammer, wenn d negativ ist?</li></ul>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var d = +root.querySelector('#r_d').value, e = +root.querySelector('#r_e').value;
          root.querySelector('#v_d').textContent = n(d); root.querySelector('#v_e').textContent = n(e);
          root.querySelector('#e_g').innerHTML = pgraph([{ a: 1, d: 0, e: 0, color: C_CMP, dash: true, width: 2 }, { a: 1, d: d, e: e, vertex: 'coords' }], { x: [-6, 6], y: [-5, 9] });
          root.querySelector('#e_eq').innerHTML = 'y = (x − ' + par(d) + ')² + ' + par(e) + ' = ' + vterm(1, d, e);
          root.querySelector('#e_tx').innerHTML = 'Scheitelpunkt <b>' + S(d, e) + '</b>: Die Normalparabel (gestrichelt) ist ' + dir(d, e) + ' verschoben.';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: d verschiebt nach rechts (d > 0) oder links (d < 0), e nach oben oder unten. Bei d = −2 steht in der Klammer x + 2.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Gleichung aus dem Graphen', q: 'Eine verschobene Normalparabel hat ihren tiefsten Punkt bei S(−3 | 2). Gib die Gleichung an und prüfe, ob P(−1 | 6) auf der Parabel liegt.',
      steps: ['Scheitelpunkt ablesen: d = −3, e = 2.', 'In die Scheitelpunktform einsetzen: y = (x − (−3))² + 2 = (x + 3)² + 2.', 'Vorzeichen-Kontrolle: Die Klammer (x + 3) wird 0 bei x = −3. Das passt zu S.', 'Punktprobe mit P(−1 | 6): (−1 + 3)² + 2 = 2² + 2 = 6. P liegt auf der Parabel.', 'Bild zur Kontrolle:' + pgraph([{ a: 1, d: -3, e: 2, vertex: 'S(−3 | 2)' }], { x: [-7, 2], y: [-1, 10], marks: [{ x: -1, y: 6, text: 'P(−1 | 6)', color: C_CMP }] })] },
    tasks: { gen: gen, plan: { G: ['s_graph:1', 's_gleichung:1', 'beschreiben:1', 'werte:1'], S: ['s_gleichung:1', 's_graph:2', 'beschreiben:1', 'gl_graph:2', 'werte:2'], E: ['s_gleichung:2', 'gl_graph:2', 'gl_s:2', 'punktprobe:2', 'werte:2', 'spiegel:3'] },
      extra: 'durch_punkt', test: ['s_gleichung:2', 's_graph:1', 'beschreiben:1', 'gl_graph:2', 'gl_s:2', 'punktprobe:2'] },
    lerncheck: ['Ich lese den Scheitelpunkt aus der Scheitelpunktform ab, auch bei (x + d).', 'Ich beschreibe die Verschiebung einer Parabel.', 'Ich gebe die Gleichung einer verschobenen Normalparabel an.', 'Ich berechne Funktionswerte und prüfe Punkte.']
  };
})();
