/* Modul 018 (Klasse 9) · Zentrische Streckung */
var MODULE = (function () {
  /* ---------- Zeichenhilfen (maßstabsgetreu, Klasse 9 in Blau; nach dem Vorbild von Modul 021 aus Klasse 8, im Modul enthalten) ---------- */
  var D2R = Math.PI / 180, C_LINE = '#1e3a8a', C_FILL = '#e8eefc', C_ACC = '#d97706', C_HI = '#1d4ed8', C_TXT = '#172036', C_MUT = '#526079', C_RED = '#b91c1c', C_GRN = '#0f766e', C_GRID = '#dbe4f7';
  var f = M.fmtNum;
  function rd(x, n) { var p = Math.pow(10, n == null ? 1 : n); return Math.round(x * p) / p; }
  function cm(x, u) { return f(x) + ' ' + (u || 'cm'); }
  function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function centroid(P) { return [P.reduce(function (s, p) { return s + p[0]; }, 0) / P.length, P.reduce(function (s, p) { return s + p[1]; }, 0) / P.length]; }
  function textW(s, size) { return String(s).replace(/<[^>]+>/g, '').length * size * 0.6; }
  function sq(x) { return '√<span style="border-top:1.5px solid currentColor;padding:0 1px">' + x + '</span>'; }
  function pt(p) { return '(' + f(p[0]) + ' | ' + f(p[1]) + ')'; }
  /* Dreieck aus drei Seiten: A(0|0), B(c|0), C oberhalb; a = BC, b = AC */
  function triSSS(a, b, c) { var x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]; }
  function rotP(p, w, c) { c = c || [0, 0]; var co = Math.cos(w * D2R), si = Math.sin(w * D2R), dx = p[0] - c[0], dy = p[1] - c[1]; return [c[0] + co * dx - si * dy, c[1] + si * dx + co * dy]; }
  /* Szene zeichnen. Weltkoordinaten (y nach oben), gleicher Maßstab in x und y.
     o: W, H (Höchsthöhe), pad, bounds [xmin,xmax,ymin,ymax], grid, gridStep, label, maxw, note */
  function scene(items, o) {
    o = o || {};
    var W = o.W || 340, Hmax = o.H || 240, pad = o.pad == null ? 30 : o.pad, bx = o.bounds;
    if (!bx) {
      var xs = [], ys = [];
      var add = function (p) { xs.push(p[0]); ys.push(p[1]); };
      items.forEach(function (it) {
        if (it.nofit) return;
        if (it.t === 'poly') it.p.forEach(add);
        else if (it.t === 'seg' || it.t === 'dim') { add(it.a); add(it.b); }
        else if (it.t === 'circle') { add([it.c[0] - it.r, it.c[1] - it.r]); add([it.c[0] + it.r, it.c[1] + it.r]); }
        else if (it.t === 'pt') add(it.p);
      });
      bx = [Math.min.apply(null, xs), Math.max.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, ys)];
    }
    var sw = (bx[1] - bx[0]) || 1, sh = (bx[3] - bx[2]) || 1;
    var s = Math.min((W - 2 * pad) / sw, (Hmax - 2 * pad) / sh);
    if (o.fitW) W = Math.round(sw * s + 2 * pad);
    var H = Math.round(sh * s + 2 * pad), ox = pad + ((W - 2 * pad) - sw * s) / 2;
    function X(x) { return ox + (x - bx[0]) * s; }
    function Y(y) { return H - pad - (y - bx[2]) * s; }
    function P(p) { return [X(p[0]), Y(p[1])]; }
    function fx(v) { return Math.round(v * 10) / 10; }
    var g = '', labels = [], obst = [];
    if (o.grid) {
      var x0 = Math.ceil(bx[0]), x1 = Math.floor(bx[1]), y0 = Math.ceil(bx[2]), y1 = Math.floor(bx[3]), st = o.gridStep || 1;
      for (var i = x0; i <= x1; i++) g += '<line x1="' + fx(X(i)) + '" y1="' + fx(Y(bx[2])) + '" x2="' + fx(X(i)) + '" y2="' + fx(Y(bx[3])) + '" stroke="' + C_GRID + '"/>';
      for (var j = y0; j <= y1; j++) g += '<line x1="' + fx(X(bx[0])) + '" y1="' + fx(Y(j)) + '" x2="' + fx(X(bx[1])) + '" y2="' + fx(Y(j)) + '" stroke="' + C_GRID + '"/>';
      if (o.axes !== false) {
        if (bx[2] <= 0 && bx[3] >= 0) { g += '<line x1="' + fx(X(bx[0])) + '" y1="' + fx(Y(0)) + '" x2="' + fx(X(bx[1])) + '" y2="' + fx(Y(0)) + '" stroke="' + C_TXT + '" stroke-width="1.5"/><text x="' + fx(X(bx[1]) - 3) + '" y="' + fx(Y(0) - 6) + '" font-size="12" font-weight="700" text-anchor="end">x</text>'; obst.push([X(bx[1]) - 12, Y(0) - 17, X(bx[1]), Y(0) - 3]); }
        if (bx[0] <= 0 && bx[1] >= 0) { g += '<line x1="' + fx(X(0)) + '" y1="' + fx(Y(bx[2])) + '" x2="' + fx(X(0)) + '" y2="' + fx(Y(bx[3])) + '" stroke="' + C_TXT + '" stroke-width="1.5"/><text x="' + fx(X(0) + 6) + '" y="' + fx(Y(bx[3]) + 11) + '" font-size="12" font-weight="700">y</text>'; obst.push([X(0) + 4, Y(bx[3]), X(0) + 16, Y(bx[3]) + 14]); }
        var ya = (bx[2] <= 0 && bx[3] >= 0) ? 0 : y0, xa = (bx[0] <= 0 && bx[1] >= 0) ? 0 : x0;
        for (var k = x0; k <= x1; k++) if (k !== xa && k % st === 0 && k < x1) { g += '<text x="' + fx(X(k)) + '" y="' + fx(Y(ya) + 13) + '" font-size="10" text-anchor="middle" fill="' + C_MUT + '">' + (k < 0 ? '−' + (-k) : k) + '</text>'; obst.push([X(k) - 6, Y(ya) + 4, X(k) + 6, Y(ya) + 15]); }
        for (var m = y0; m <= y1; m++) if (m !== ya && m % st === 0 && m < y1) { g += '<text x="' + fx(X(xa) - 4) + '" y="' + fx(Y(m) + 4) + '" font-size="10" text-anchor="end" fill="' + C_MUT + '">' + (m < 0 ? '−' + (-m) : m) + '</text>'; obst.push([X(xa) - 16, Y(m) - 5, X(xa) - 2, Y(m) + 6]); }
        if (xa === 0 && ya === 0) { g += '<text x="' + fx(X(0) - 4) + '" y="' + fx(Y(0) + 13) + '" font-size="10" text-anchor="end" fill="' + C_MUT + '">0</text>'; obst.push([X(0) - 12, Y(0) + 4, X(0) - 2, Y(0) + 15]); }
      }
    }
    function clipLine(p, q, ray) {
      var dx = q[0] - p[0], dy = q[1] - p[1], t0 = ray ? 0 : -1e4, t1 = 1e4;
      var cs = [[-dx, p[0] - 1], [dx, W - 1 - p[0]], [-dy, p[1] - 1], [dy, H - 1 - p[1]]];
      for (var c = 0; c < 4; c++) { var pp = cs[c][0], qq = cs[c][1]; if (Math.abs(pp) < 1e-12) { if (qq < 0) return null; continue; } var r = qq / pp; if (pp < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; } }
      return [[p[0] + t0 * dx, p[1] + t0 * dy], [p[0] + t1 * dx, p[1] + t1 * dy]];
    }
    function stroke(it, def, w) { return ' stroke="' + (it.color || def) + '" stroke-width="' + (it.w || w) + '"' + (it.dash ? ' stroke-dasharray="' + (it.dash === true ? '6 4' : it.dash) + '"' : ''); }
    function rmark(v, pa, pb, col, z) {
      var a = [pa[0] - v[0], pa[1] - v[1]], b = [pb[0] - v[0], pb[1] - v[1]], la = Math.hypot(a[0], a[1]) || 1, lb = Math.hypot(b[0], b[1]) || 1;
      var q1 = [v[0] + a[0] / la * z, v[1] + a[1] / la * z], q2 = [v[0] + b[0] / lb * z, v[1] + b[1] / lb * z], q3 = [q1[0] + b[0] / lb * z, q1[1] + b[1] / lb * z];
      return '<path d="M' + fx(q1[0]) + ' ' + fx(q1[1]) + ' L' + fx(q3[0]) + ' ' + fx(q3[1]) + ' L' + fx(q2[0]) + ' ' + fx(q2[1]) + '" fill="none" stroke="' + col + '" stroke-width="1.8"/><circle cx="' + fx((v[0] + q3[0]) / 2) + '" cy="' + fx((v[1] + q3[1]) / 2) + '" r="1.6" fill="' + col + '"/>';
    }
    items.forEach(function (it) {
      var a, b, c;
      if (it.t === 'poly') g += '<polygon points="' + it.p.map(function (q) { var z = P(q); return fx(z[0]) + ',' + fx(z[1]); }).join(' ') + '" fill="' + (it.fill || C_FILL) + '"' + (it.op ? ' fill-opacity="' + it.op + '"' : '') + stroke(it, C_LINE, 2.5) + ' stroke-linejoin="round"/>';
      else if (it.t === 'seg') { a = P(it.a); b = P(it.b); g += '<line x1="' + fx(a[0]) + '" y1="' + fx(a[1]) + '" x2="' + fx(b[0]) + '" y2="' + fx(b[1]) + '"' + stroke(it, C_LINE, 2) + ' stroke-linecap="round"/>'; }
      else if (it.t === 'line' || it.t === 'ray') { c = clipLine(P(it.a), P(it.b), it.t === 'ray'); if (c) g += '<line x1="' + fx(c[0][0]) + '" y1="' + fx(c[0][1]) + '" x2="' + fx(c[1][0]) + '" y2="' + fx(c[1][1]) + '"' + stroke(it, C_HI, 2) + '/>'; }
      else if (it.t === 'circle') { a = P(it.c); g += '<circle cx="' + fx(a[0]) + '" cy="' + fx(a[1]) + '" r="' + fx(it.r * s) + '" fill="' + (it.fill || 'none') + '"' + stroke(it, C_HI, 2) + '/>'; }
      else if (it.t === 'rmark') { g += rmark(P(it.v), P(it.a), P(it.b), it.color || C_ACC, it.z || 10); }
      else if (it.t === 'angle') {
        var v = P(it.v), pa = P(it.a), pb = P(it.b);
        var a1 = Math.atan2(pa[1] - v[1], pa[0] - v[0]), a2 = Math.atan2(pb[1] - v[1], pb[0] - v[0]);
        var d = ((a2 - a1 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, bis = a1 + d / 2, col = it.color || C_ACC, r = it.r || (Math.abs(d) < 0.61 ? 32 : Math.abs(d) < 0.87 ? 27 : 22);
        if (Math.abs(Math.abs(d) - Math.PI / 2) < 0.009 && !it.noRight) g += rmark(v, pa, pb, col, Math.min(r, 22) * 0.55);
        else g += '<path d="M' + fx(v[0] + r * Math.cos(a1)) + ' ' + fx(v[1] + r * Math.sin(a1)) + ' A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + fx(v[0] + r * Math.cos(a2)) + ' ' + fx(v[1] + r * Math.sin(a2)) + '" fill="' + (it.fill || 'none') + '" stroke="' + col + '" stroke-width="2"/>' + (it.double ? '<path d="M' + fx(v[0] + (r - 5) * Math.cos(a1)) + ' ' + fx(v[1] + (r - 5) * Math.sin(a1)) + ' A' + (r - 5) + ' ' + (r - 5) + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + fx(v[0] + (r - 5) * Math.cos(a2)) + ' ' + fx(v[1] + (r - 5) * Math.sin(a2)) + '" fill="none" stroke="' + col + '" stroke-width="2"/>' : '');
        if (it.label) { var lsz = it.size || 12, tw = textW(it.label, lsz), bc = Math.cos(bis), bs = Math.sin(bis), extN = Math.abs(bs) * (tw / 2 + 2) + Math.abs(bc) * (lsz / 2 + 2), extB = Math.abs(bc) * (tw / 2 + 2) + Math.abs(bs) * (lsz / 2 + 2), dd = it.ld || Math.min(90, Math.max(r + 5 + extB, extN / Math.tan(Math.max(Math.abs(d) / 2, 0.05)) + extB)); labels.push({ x: v[0] + dd * Math.cos(bis), y: v[1] + dd * Math.sin(bis), s: it.label, dir: [Math.cos(bis), Math.sin(bis)], size: lsz, bold: true, color: it.lcolor || (String(it.label).indexOf('?') >= 0 ? C_RED : C_TXT) }); }
      }
      else if (it.t === 'tick') {
        a = P(it.a); b = P(it.b); var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n = it.n || 1;
        for (var z = 0; z < n; z++) { var o2 = (z - (n - 1) / 2) * 5; g += '<line x1="' + fx(mx + o2 * ux - 6 * uy) + '" y1="' + fx(my + o2 * uy + 6 * ux) + '" x2="' + fx(mx + o2 * ux + 6 * uy) + '" y2="' + fx(my + o2 * uy - 6 * ux) + '" stroke="' + (it.color || C_LINE) + '" stroke-width="2"/>'; }
      }
      else if (it.t === 'pt') {
        a = P(it.p); g += '<circle cx="' + fx(a[0]) + '" cy="' + fx(a[1]) + '" r="' + (it.r || 4) + '" fill="' + (it.color || C_HI) + '" stroke="#fff" stroke-width="1.5"/>';
        obst.push([a[0] - 5, a[1] - 5, a[0] + 5, a[1] + 5]);
        if (it.s) { var dir = it.dir || [0.7, 0.7], dl = Math.hypot(dir[0], dir[1]) || 1; labels.push({ x: a[0] + (it.off || 14) * dir[0] / dl, y: a[1] - (it.off || 14) * dir[1] / dl, s: it.s, dir: [dir[0] / dl, -dir[1] / dl], size: it.size || 13, bold: true, color: it.lcolor || it.color || C_HI }); }
      }
      else if (it.t === 'vname' || it.t === 'side') {
        var ref = P(it.ref), base = it.t === 'vname' ? P(it.p) : P(mid(it.a, it.b)), ddx = base[0] - ref[0], ddy = base[1] - ref[1];
        if (it.t === 'side') { a = P(it.a); b = P(it.b); var nx = -(b[1] - a[1]), ny = b[0] - a[0], nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl; if (nx * ddx + ny * ddy < 0) { nx = -nx; ny = -ny; } if (it.inside) { nx = -nx; ny = -ny; } ddx = nx; ddy = ny; }
        var dl2 = Math.hypot(ddx, ddy) || 1; ddx /= dl2; ddy /= dl2;
        var size = it.size || (it.t === 'vname' ? 13 : 12), off = (it.off || (it.t === 'vname' ? 11 : 8)) + Math.abs(ddx) * textW(it.s, size) / 2 + Math.abs(ddy) * size * 0.4;
        labels.push({ x: base[0] + off * ddx, y: base[1] + off * ddy, s: it.s, dir: [ddx, ddy], size: size, bold: it.t === 'side', color: it.color || (it.t === 'vname' ? C_MUT : (String(it.s).indexOf('?') >= 0 ? C_RED : C_TXT)) });
      }
      else if (it.t === 'text') { a = P(it.p); labels.push({ x: a[0] + (it.dx || 0), y: a[1] + (it.dy || 0), s: it.s, dir: it.dir || [0, -1], size: it.size || 12, bold: it.bold, color: it.color || C_TXT, anchor: it.anchor, fixed: it.fixed }); }
    });
    var placed = obst.slice();
    if (o.note) { var nw = textW(o.note, 10); placed.push([W - nw - 6, 1, W - 1, 15]); g += '<text x="' + (W - 4) + '" y="12" font-size="10" text-anchor="end" fill="' + C_MUT + '">' + o.note + '</text>'; }
    function box(L, x, y) { var w = textW(L.s, L.size) + 4, h = L.size + 2; var left = L.anchor === 'start' ? x - 2 : L.anchor === 'end' ? x - w + 2 : x - w / 2; return [left, y - h / 2, left + w, y + h / 2]; }
    function hit(bb) { return placed.some(function (p) { return bb[0] < p[2] && bb[2] > p[0] && bb[1] < p[3] && bb[3] > p[1]; }); }
    labels.forEach(function (L) {
      var best = null, cands = [[0, 0]];
      if (!L.fixed) for (var st2 = 1; st2 <= 5; st2++) { var e = st2 * 7; cands.push([L.dir[0] * e, L.dir[1] * e], [-L.dir[1] * e, L.dir[0] * e], [L.dir[1] * e, -L.dir[0] * e], [0, -e], [0, e], [e, 0], [-e, 0]); }
      for (var c = 0; c < cands.length; c++) {
        var x = L.x + cands[c][0], y = L.y + cands[c][1], bb = box(L, x, y);
        if (bb[0] < 1 || bb[2] > W - 1 || bb[1] < 1 || bb[3] > H - 1) { if (!best) best = [x, y, bb]; continue; }
        if (!hit(bb)) { best = [x, y, bb]; break; }
      }
      if (!best) { var bb0 = box(L, L.x, L.y); best = [L.x, L.y, bb0]; }
      var bb2 = best[2];
      if (bb2[0] < 1) { best[0] += 1 - bb2[0]; } if (bb2[2] > W - 1) { best[0] -= bb2[2] - W + 1; } if (bb2[1] < 1) { best[1] += 1 - bb2[1]; } if (bb2[3] > H - 1) { best[1] -= bb2[3] - H + 1; }
      placed.push(box(L, best[0], best[1]));
      g += '<text x="' + fx(best[0]) + '" y="' + fx(best[1] + L.size * 0.36) + '" font-size="' + L.size + '"' + (L.bold ? ' font-weight="700"' : '') + ' text-anchor="' + (L.anchor || 'middle') + '" fill="' + L.color + '" stroke="#fff" stroke-width="3" stroke-linejoin="round" paint-order="stroke">' + L.s + '</text>';
    });
    return '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Zeichnung') + '" style="max-width:' + (o.maxw || 420) + 'px">' + g + '</svg>';
  }
  /* rechte Winkel eines Vielecks automatisch markieren */
  function rightMarks(P, col) { var out = [], n = P.length; P.forEach(function (v, i) { var a = P[(i - 1 + n) % n], b = P[(i + 1) % n]; if (Math.abs((a[0] - v[0]) * (b[0] - v[0]) + (a[1] - v[1]) * (b[1] - v[1])) < 1e-7 * dist(a, v) * dist(b, v)) out.push({ t: 'rmark', v: v, a: a, b: b, color: col, z: 8 }); }); return out; }
  /* Dreieck mit Ecknamen, Seiten- und Winkelbeschriftungen. Seiten: 0 = a (BC), 1 = b (AC), 2 = c (AB) */
  function triItems(T, o) {
    o = o || {}; var c = centroid(T), names = o.names || ['A', 'B', 'C'], it = [{ t: 'poly', p: T, fill: o.fill, color: o.color }];
    var sides = o.sides || [], angles = o.angles || [];
    var S = [[T[1], T[2]], [T[0], T[2]], [T[0], T[1]]];
    angles.forEach(function (lab, i) { if (lab !== null && lab !== undefined && lab !== false) it.push({ t: 'angle', v: T[i], a: T[(i + 1) % 3], b: T[(i + 2) % 3], label: lab === true ? '' : lab, color: o.acolor, double: o.doubles && o.doubles[i] }); });
    if (!o.noNames) names.forEach(function (n, i) { if (n) it.push({ t: 'vname', p: T[i], ref: c, s: n }); });
    sides.forEach(function (lab, i) { if (lab) it.push({ t: 'side', a: S[i][0], b: S[i][1], ref: c, s: lab, color: o.scolor }); });
    return it;
  }
  /* ---------- Hilfen für die zentrische Streckung ---------- */
  function strp(P, Z, k) { return [Z[0] + k * (P[0] - Z[0]), Z[1] + k * (P[1] - Z[1])]; }
  function inB(p, r) { r = r || 7; return Math.abs(p[0]) <= r && Math.abs(p[1]) <= r; }
  function grid(items, o) { o = o || {}; var R = o.R || 7.5; return scene(items, { bounds: o.bounds || [-R, R, -R, R], grid: true, gridStep: 2, W: 330, H: 330, pad: 12, label: o.label || 'Koordinatensystem', maxw: 360 }); }
  function vstep(dx, dy) { var a = []; if (dx) a.push(f(Math.abs(dx)) + (dx > 0 ? ' nach rechts' : ' nach links')); if (dy) a.push(f(Math.abs(dy)) + (dy > 0 ? ' nach oben' : ' nach unten')); return a.join(' und ') || '0'; }
  function coordIn(p, n) { return [{ kind: 'num', label: n + ': x =', answer: p[0] }, { kind: 'num', label: n + ': y =', answer: p[1] }]; }
  function same(v, p) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); return x !== null && y !== null && Math.abs(x - p[0]) < 1e-9 && Math.abs(y - p[1]) < 1e-9; }
  function near(a, b) { return Math.abs(a - b) < 1e-9; }
  function isNum(v, x) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < 1e-6; }
  function shoelace(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += a[0] * b[1] - b[0] * a[1]; } return Math.abs(s) / 2; }
  function angAt(v, p, q) { var a = [p[0] - v[0], p[1] - v[1]], b = [q[0] - v[0], q[1] - v[1]]; return Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]))))) / D2R; }
  function minAng(T) { return Math.min(angAt(T[0], T[1], T[2]), angAt(T[1], T[0], T[2]), angAt(T[2], T[0], T[1])); }
  function inTri(p, T) { var s0 = 0; for (var i = 0; i < 3; i++) { var a = T[i], b = T[(i + 1) % 3], c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]); if (Math.abs(c) < 1e-9) return true; s0 += c > 0 ? 1 : -1; } return Math.abs(s0) === 3; }
  function kArt(k) { return k > 1 ? 'Vergrößerung' : k < 1 ? 'Verkleinerung' : 'gleich groß'; }
  var K2 = 'Achtung: Der Flächeninhalt wächst nicht mit k, sondern mit <b>k²</b>. Jede der beiden Seiten wird mit k multipliziert, die Fläche also mit k · k.';
  /* Punkt mit Strahl von Z */
  function rayItems(Z, P, Q, names) {
    var far = Q && dist(Z, Q) > dist(Z, P) ? Q : P;
    var u = [P[0] - Z[0], P[1] - Z[1]], nn = [-u[1], u[0]];
    var it = [{ t: 'seg', a: Z, b: far, color: C_ACC, dash: '5 4', w: 1.5 }, { t: 'pt', p: P, s: names[0], color: C_HI, dir: nn }];
    if (Q && names[1]) it.push({ t: 'pt', p: Q, s: names[1], color: C_GRN, dir: [-nn[0], -nn[1]] });
    it.push({ t: 'pt', p: Z, s: 'Z', color: C_ACC, dir: [-u[0], -u[1]] });
    return it;
  }
  function pick2(lvl) { return lvl === 1 ? M.pick([2, 3]) : lvl === 2 ? M.pick([2, 3, 0.5, 1.5]) : M.pick([0.5, 1.5, 2.5, 2]); }
  function mkPoint(k) {
    for (var t = 0; t < 500; t++) {
      var Z = [M.rnd(-4, 3), M.rnd(-4, 3)], d = [M.rnd(-4, 4), M.rnd(-4, 4)];
      if (!d[0] && !d[1]) continue;
      if (k % 1 && (d[0] % 2 || d[1] % 2)) continue;
      var P = [Z[0] + d[0], Z[1] + d[1]], Q = strp(P, Z, k);
      if (!inB(P) || !inB(Q) || Math.hypot(d[0], d[1]) < 2 || (Z[0] === 0 && Z[1] === 0 && Math.random() < 0.7)) continue;
      return { Z: Z, P: P, Q: Q, d: d };
    }
    return { Z: [0, 0], P: [2, 1], Q: strp([2, 1], [0, 0], k), d: [2, 1] };
  }
  var TRUE = [['Original und Bild haben gleich große Winkel.', 'Die zentrische Streckung verändert die Form nicht. Alle Winkel bleiben gleich.'], ['Eine Strecke und ihre Bildstrecke sind parallel.', 'Jede Bildstrecke ist parallel zur Originalstrecke.'], ['Bei k = 3 wird jede Strecke 3-mal so lang.', 'Alle Längen werden mit k multipliziert.'], ['Bei k = 2 wird der Flächeninhalt 4-mal so groß.', 'Flächen werden mit k² = 2 · 2 = 4 multipliziert.'], ['Das Streckzentrum Z bleibt an seinem Platz.', 'Z ist der einzige Punkt, der sich nicht bewegt.'], ['Bei k = 0,5 wird die Figur verkleinert.', 'Für 0 < k < 1 entsteht eine Verkleinerung.'], ['Z, P und der Bildpunkt P′ liegen auf einer Geraden.', 'P′ liegt auf dem Strahl von Z durch P.']];
  var FALSE = [['Bei k = 2 wird der Flächeninhalt doppelt so groß.', 'Flächen werden mit k² multipliziert: Bei k = 2 wird die Fläche 4-mal so groß.'], ['Bei einer zentrischen Streckung ändern sich die Winkel.', 'Die Winkel bleiben gleich. Nur die Längen ändern sich.'], ['Bei k = 0,5 wird die Figur vergrößert.', 'Bei k = 0,5 wird jede Länge halbiert, die Figur wird kleiner.'], ['Original und Bild sind immer deckungsgleich.', 'Nur bei k = 1 sind sie gleich groß. Sonst sind sie ähnlich, aber nicht deckungsgleich.'], ['Bei k = 3 wird der Umfang 9-mal so groß.', 'Der Umfang ist eine Länge. Er wird 3-mal so groß.'], ['Der Bildpunkt P′ liegt immer zwischen Z und P.', 'Das gilt nur bei einer Verkleinerung. Bei k > 1 liegt P′ hinter P.']];

  var gen = {
    bildpunkt: function (lvl) {
      var k = pick2(lvl), o = mkPoint(k), Z = o.Z, P = o.P, Q = o.Q, d = o.d, kd = [k * d[0], k * d[1]];
      return { skill: 'Bildpunkt berechnen', level: lvl, q: 'Strecke den Punkt P' + pt(P) + ' zentrisch am Streckzentrum Z' + pt(Z) + ' mit dem Faktor <b>k = ' + f(k) + '</b>. Gib die Koordinaten des Bildpunkts P′ an.' + grid(rayItems(Z, P, null, ['P'])),
        inputs: coordIn(Q, 'P′'),
        hints: ['Bestimme zuerst den Weg von Z nach P: ' + vstep(d[0], d[1]) + '.', 'Multipliziere beide Teile des Weges mit k = ' + f(k) + ': ' + vstep(kd[0], kd[1]) + '.', 'Gehe diesen neuen Weg <b>von Z aus</b>: x = ' + f(Z[0]) + ' + (' + f(kd[0]) + '), y = ' + f(Z[1]) + ' + (' + f(kd[1]) + ').'],
        solution: 'Weg Z → P: (' + f(d[0]) + ' | ' + f(d[1]) + '). Mal k = ' + f(k) + ': (' + f(kd[0]) + ' | ' + f(kd[1]) + '). Von Z aus: P′ = (' + f(Z[0]) + ' + (' + f(kd[0]) + ') | ' + f(Z[1]) + ' + (' + f(kd[1]) + ')) = <b>P′' + pt(Q) + '</b>.' + grid(rayItems(Z, P, Q, ['P', 'P′'])),
        mistakes: function (v) {
          if (same(v, [k * P[0], k * P[1]]) && !(Z[0] === 0 && Z[1] === 0)) return 'Du hast die Koordinaten von P mit k multipliziert. Das stimmt nur, wenn Z im Ursprung liegt. Miss den Weg von <b>Z</b> nach P.';
          if (same(v, [P[0] + kd[0], P[1] + kd[1]])) return 'Du bist von P aus weitergegangen. Der neue Weg (k-mal so lang) beginnt aber bei <b>Z</b>.';
          if (same(v, strp(P, Z, 1 / k))) return 'Du hast durch k geteilt. Bei der zentrischen Streckung wird der Weg von Z aus mit k <b>multipliziert</b>.';
          return null; },
        verify: function () { var a = [P[0] - Z[0], P[1] - Z[1]], b = [Q[0] - Z[0], Q[1] - Z[1]]; return near(dist(Z, Q), k * dist(Z, P)) && near(a[0] * b[1] - a[1] * b[0], 0) && a[0] * b[0] + a[1] * b[1] > 0 ? true : 'Bildpunkt falsch'; } };
    },
    faktor: function (lvl) {
      var k = lvl === 1 ? M.pick([2, 3]) : lvl === 2 ? M.pick([2, 3, 0.5, 1.5]) : M.pick([2.5, 1.5, 0.5, 4]), o = mkPoint(k), Z = o.Z, P = o.P, Q = o.Q, d = o.d, e = [Q[0] - Z[0], Q[1] - Z[1]];
      var useX = d[0] !== 0, a = useX ? d[0] : d[1], b = useX ? e[0] : e[1];
      return { skill: 'Streckfaktor bestimmen', level: lvl, q: 'Der Punkt P' + pt(P) + ' wird bei einer zentrischen Streckung mit dem Zentrum Z' + pt(Z) + ' auf P′' + pt(Q) + ' abgebildet. Bestimme den Streckfaktor k.' + grid(rayItems(Z, P, Q, ['P', 'P′'])),
        inputs: [{ kind: 'num', label: 'k =', answer: k }],
        hints: ['Der Streckfaktor sagt, wie viel Mal so weit P′ von Z entfernt ist wie P: k = ZP′ : ZP.', 'Weg Z → P: ' + vstep(d[0], d[1]) + '. Weg Z → P′: ' + vstep(e[0], e[1]) + '.', 'Vergleiche die ' + (useX ? 'Schritte nach rechts/links' : 'Schritte nach oben/unten') + ': k = ' + f(Math.abs(b)) + ' : ' + f(Math.abs(a)) + '.'],
        solution: 'Weg Z → P: (' + f(d[0]) + ' | ' + f(d[1]) + '), Weg Z → P′: (' + f(e[0]) + ' | ' + f(e[1]) + '). Jeder Teil ist ' + f(k) + '-mal so groß: k = ' + f(b) + ' : ' + f(a) + ' = <b>' + f(k) + '</b>. ' + (k > 1 ? 'Das ist eine Vergrößerung.' : 'Das ist eine Verkleinerung.'),
        mistakes: function (v) { if (isNum(v[0], 1 / k)) return 'Du hast Original durch Bild geteilt. Rechne <b>Bild durch Original</b>: k = ZP′ : ZP.'; if (isNum(v[0], k - 1)) return 'Du hast nur die Strecke von P nach P′ betrachtet. Miss beide Wege vom Zentrum Z aus.'; return null; },
        verify: function () { return near(dist(Z, Q) / dist(Z, P), k) ? true : 'Faktor falsch'; } };
    },
    laenge: function (lvl) {
      var mode = lvl === 1 ? 'vor' : M.pick(['vor', 'rueck', 'k']), k = M.pick(lvl === 1 ? [2, 3, 4] : [2, 3, 0.5, 1.5, 2.5]), a = M.pick([2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 8]);
      if (k === 0.5 && a % 1) a = 2 * a;
      var b = k * a;
      if (mode === 'vor') return { skill: 'Längen im Bild', level: lvl, q: 'Die Strecke AB ist ' + cm(a) + ' lang. Sie wird mit dem Faktor <b>k = ' + f(k) + '</b> zentrisch gestreckt. Wie lang ist die Bildstrecke A′B′?',
        inputs: [{ kind: 'num', label: 'A′B′ =', unit: 'cm', answer: b }],
        hints: ['Bei einer zentrischen Streckung wird <b>jede</b> Länge mit k multipliziert.', 'A′B′ = k · AB = ' + f(k) + ' · ' + cm(a) + '.', 'Kontrolle: ' + (k > 1 ? 'k > 1, das Bild muss länger sein als ' + cm(a) + '.' : 'k < 1, das Bild muss kürzer sein als ' + cm(a) + '.')],
        solution: 'A′B′ = ' + f(k) + ' · ' + cm(a) + ' = <b>' + cm(b) + '</b>',
        mistakes: function (v) { if (isNum(v[0], a + k)) return 'Du hast k addiert. Längen werden bei der zentrischen Streckung mit k <b>multipliziert</b>.'; if (isNum(v[0], a / k)) return 'Du hast durch k geteilt. Gegeben ist das Original, also rechnest du mal k.'; return null; },
        verify: function () { var A = [1, 1], B = [1 + a, 1], Z = [-2, 3]; return near(dist(strp(A, Z, k), strp(B, Z, k)), b) ? true : 'Länge falsch'; } };
      if (mode === 'rueck') return { skill: 'Originallänge berechnen', level: lvl, q: 'Nach einer zentrischen Streckung mit <b>k = ' + f(k) + '</b> ist die Bildstrecke A′B′ = ' + cm(b) + ' lang. Wie lang war die Originalstrecke AB?',
        inputs: [{ kind: 'num', label: 'AB =', unit: 'cm', answer: a }],
        hints: ['Es gilt A′B′ = k · AB. Hier ist A′B′ bekannt.', 'Rechne rückwärts: AB = A′B′ : k.', 'AB = ' + cm(b) + ' : ' + f(k) + '.'],
        solution: 'A′B′ = k · AB, also AB = ' + cm(b) + ' : ' + f(k) + ' = <b>' + cm(a) + '</b>. Probe: ' + f(k) + ' · ' + cm(a) + ' = ' + cm(b) + '.',
        mistakes: function (v) { if (isNum(v[0], b * k)) return 'Du hast mit k multipliziert. Gegeben ist hier aber schon das <b>Bild</b>. Rückwärts musst du durch k teilen.'; return null; },
        verify: function () { return near(a * k, b) ? true : 'falsch'; } };
      return { skill: 'Streckfaktor aus Längen', level: lvl, q: 'Eine Strecke ist ' + cm(a) + ' lang. Ihre Bildstrecke nach einer zentrischen Streckung ist ' + cm(b) + ' lang. Wie groß ist der Streckfaktor k? Ist es eine Vergrößerung oder eine Verkleinerung?',
        inputs: [{ kind: 'num', label: 'k =', answer: k }, { kind: 'mc', label: 'Art der Abbildung', options: ['Vergrößerung', 'Verkleinerung'], answer: k > 1 ? 0 : 1 }],
        hints: ['k = Bildlänge : Originallänge.', 'k = ' + cm(b) + ' : ' + cm(a) + '.', 'Ist k größer als 1, wird vergrößert. Liegt k zwischen 0 und 1, wird verkleinert.'],
        solution: 'k = ' + f(b) + ' : ' + f(a) + ' = <b>' + f(k) + '</b>. ' + (k > 1 ? 'Da k > 1 ist, ist es eine Vergrößerung.' : 'Da 0 < k < 1 ist, ist es eine Verkleinerung.'),
        mistakes: function (v) { if (isNum(v[0], 1 / k)) return 'Du hast Original durch Bild geteilt. Richtig ist k = Bild : Original.'; return null; },
        verify: function () { return near(b / a, k) ? true : 'falsch'; } };
    },
    flaeche: function (lvl) {
      var k = lvl === 1 ? M.pick([2, 3]) : M.pick([2, 3, 1.5, 0.5, 2.5]), s = M.rnd(2, 5), t = M.rnd(1, 4);
      if (k === 0.5) { s = 2 * M.rnd(2, 4); t = 2 * M.rnd(1, 3); }
      if (s === t) s++;
      var A = s * t, A2 = k * k * A, gap = Math.max(1.5, s * 0.35), R2 = [[s + gap, 0], [s + gap + k * s, 0], [s + gap + k * s, k * t], [s + gap, k * t]];
      var pic = scene([{ t: 'poly', p: [[0, 0], [s, 0], [s, t], [0, t]] }, { t: 'side', a: [0, 0], b: [s, 0], ref: [s / 2, t / 2], s: cm(s) }, { t: 'side', a: [0, 0], b: [0, t], ref: [s / 2, t / 2], s: cm(t) }, { t: 'text', p: [s / 2, t / 2], s: 'Original', size: 11, color: C_LINE, fixed: true },
        { t: 'poly', p: R2, fill: '#dff3ef', color: C_GRN }, { t: 'text', p: mid(R2[0], R2[2]), s: 'Bild', size: 11, color: C_GRN, fixed: true }, { t: 'rmark', v: [0, 0], a: [s, 0], b: [0, t] }, { t: 'rmark', v: R2[0], a: R2[1], b: R2[3], color: C_GRN }], { W: 340, H: 200, pad: 26, label: 'Rechteck und Bildrechteck' });
      return { skill: 'Flächeninhalt im Bild (k²)', level: lvl, q: 'Ein Rechteck mit den Seiten ' + cm(s) + ' und ' + cm(t) + ' wird mit <b>k = ' + f(k) + '</b> zentrisch gestreckt. Berechne den Flächeninhalt des Bildrechtecks.' + pic,
        inputs: [{ kind: 'num', label: 'Flächeninhalt Bild', unit: 'cm²', answer: A2 }],
        hints: ['Jede Seite wird mit k multipliziert: ' + f(k) + ' · ' + cm(s) + ' = ' + cm(k * s) + ' und ' + f(k) + ' · ' + cm(t) + ' = ' + cm(k * t) + '.', 'Flächeninhalt des Bildes: ' + cm(k * s) + ' · ' + cm(k * t) + '.', 'Schneller: Der Flächeninhalt wird mit k² = ' + f(k) + ' · ' + f(k) + ' = ' + f(k * k) + ' multipliziert: ' + f(k * k) + ' · ' + f(A) + ' cm².'],
        solution: 'Bildseiten: ' + cm(k * s) + ' und ' + cm(k * t) + '. Flächeninhalt: ' + f(k * s) + ' · ' + f(k * t) + ' = <b>' + f(A2) + ' cm²</b>. Kontrolle mit k²: ' + f(k * k) + ' · ' + f(A) + ' cm² = ' + f(A2) + ' cm².',
        mistakes: function (v) { if (isNum(v[0], k * A)) return 'Du hast den Flächeninhalt nur mit k multipliziert. ' + K2; if (isNum(v[0], A)) return 'Das ist der Flächeninhalt des Originals. Gesucht ist der des Bildes.'; return null; },
        verify: function () { var Z = [-1, -2], R = [[0, 0], [s, 0], [s, t], [0, t]].map(function (p) { return strp(p, Z, k); }); return near(shoelace(R), A2) ? true : 'Fläche falsch'; } };
    },
    flaecheRueck: function (lvl) {
      var k = M.pick([2, 3, 4, 0.5, 1.5, 2.5]), A = k === 0.5 ? M.pick([12, 20, 24, 36, 48]) : k === 1.5 || k === 2.5 ? M.pick([4, 8, 12]) : M.pick([3, 5, 6, 7, 8]), A2 = k * k * A;
      return { skill: 'Streckfaktor aus Flächen', level: 3, q: 'Eine Figur hat den Flächeninhalt ' + f(A) + ' cm². Nach einer zentrischen Streckung hat das Bild den Flächeninhalt ' + f(A2) + ' cm². Bestimme den Streckfaktor k.',
        inputs: [{ kind: 'num', label: 'k =', answer: k }],
        hints: ['Der Flächeninhalt wird mit k² multipliziert. Berechne zuerst k² = ' + f(A2) + ' : ' + f(A) + '.', 'k² = ' + f(k * k) + '. Gesucht ist die Zahl k, die mit sich selbst multipliziert ' + f(k * k) + ' ergibt.', 'Probiere: ' + f(k) + ' · ' + f(k) + ' = ?'],
        solution: 'k² = ' + f(A2) + ' : ' + f(A) + ' = ' + f(k * k) + '. Da ' + f(k) + ' · ' + f(k) + ' = ' + f(k * k) + ', ist <b>k = ' + f(k) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], k * k)) return 'Das ist der Faktor für die Fläche, also k². Gesucht ist k: Welche Zahl mal sich selbst ergibt ' + f(k * k) + '?'; return null; },
        verify: function () { return near(k * k * A, A2) && k > 0 ? true : 'falsch'; } };
    },
    umfangFlaeche: function (lvl) {
      var k = M.pick([2, 3, 0.5, 1.5, 2.5]), m = k === 0.5 ? M.pick([1, 2]) : M.pick([1, 2, 1.5]), a = 3 * m, b = 4 * m, c = 5 * m, U = a + b + c, A = a * b / 2;
      var T = [[0, 0], [b, 0], [0, a]];
      var pic = scene(triItems(T, { noNames: true, sides: [cm(c), cm(a), cm(b)], angles: [true, null, null] }), { W: 300, H: 170, pad: 24, label: 'Rechtwinkliges Dreieck' });
      return { skill: 'Umfang und Fläche im Bild', level: lvl, q: 'Das rechtwinklige Dreieck hat die Seiten ' + cm(a) + ', ' + cm(b) + ' und ' + cm(c) + '. Es wird mit <b>k = ' + f(k) + '</b> zentrisch gestreckt. Berechne Umfang und Flächeninhalt des Bilddreiecks.' + pic,
        inputs: [{ kind: 'num', label: 'Umfang Bild', unit: 'cm', answer: k * U }, { kind: 'num', label: 'Flächeninhalt Bild', unit: 'cm²', answer: k * k * A }],
        hints: ['Original: Umfang = ' + f(a) + ' + ' + f(b) + ' + ' + f(c) + ' = ' + cm(U) + '. Flächeninhalt = ' + f(a) + ' · ' + f(b) + ' : 2 = ' + f(A) + ' cm².', 'Der Umfang ist eine Länge: U′ = k · U = ' + f(k) + ' · ' + cm(U) + '.', 'Für die Fläche gilt: A′ = k² · A = ' + f(k * k) + ' · ' + f(A) + ' cm².'],
        solution: 'U′ = ' + f(k) + ' · ' + cm(U) + ' = <b>' + cm(k * U) + '</b>. A′ = ' + f(k) + '² · ' + f(A) + ' cm² = ' + f(k * k) + ' · ' + f(A) + ' cm² = <b>' + f(k * k * A) + ' cm²</b>.',
        mistakes: function (v) { if (isNum(v[1], k * A)) return 'Der Umfang wird mit k multipliziert, der Flächeninhalt aber mit k². ' + K2; if (isNum(v[0], k * k * U)) return 'Der Umfang ist eine Länge. Er wird nur mit k multipliziert, nicht mit k².'; return null; },
        verify: function () { var R = T.map(function (p) { return strp(p, [1, -1], k); }); var u = dist(R[0], R[1]) + dist(R[1], R[2]) + dist(R[2], R[0]); return near(u, k * U) && near(shoelace(R), k * k * A) ? true : 'falsch'; } };
    },
    zentrum: function () {
      var Z, T, k0, ok = false;
      for (var t = 0; t < 800 && !ok; t++) {
        Z = [M.rnd(-5, 2), M.rnd(-5, 2)]; k0 = M.pick([2, 3]);
        var D = [[M.rnd(-2, 3), M.rnd(-2, 3)], [M.rnd(-2, 3), M.rnd(-2, 3)], [M.rnd(-2, 3), M.rnd(-2, 3)]];
        if (D.some(function (d) { return !d[0] && !d[1]; })) continue;
        T = D.map(function (d) { return [Z[0] + d[0], Z[1] + d[1]]; });
        var big = T.map(function (p) { return strp(p, Z, k0); });
        if (!big.every(function (p) { return inB(p); }) || !T.every(function (p) { return inB(p); })) continue;
        if (shoelace(T) < 2 || minAng(T) < 25 || inTri(Z, big)) continue;
        var cr = function (u, w) { return (u[0] - Z[0]) * (w[1] - Z[1]) - (u[1] - Z[1]) * (w[0] - Z[0]); };
        if (Math.abs(cr(T[0], T[1])) < 1e-9 || Math.abs(cr(T[1], T[2])) < 1e-9 || Math.abs(cr(T[0], T[2])) < 1e-9) continue;
        ok = true;
      }
      var small = k0 === 2 && Math.random() < 0.4, O = small ? T.map(function (p) { return strp(p, Z, k0); }) : T, B = small ? T : T.map(function (p) { return strp(p, Z, k0); }), k = small ? 1 / k0 : k0;
      var nm = ['A', 'B', 'C'], base = [{ t: 'poly', p: B, fill: '#dff3ef', color: C_GRN, op: 0.6 }, { t: 'poly', p: O, op: 0.6 }];
      var lab = function (P, c, names, col) { return P.map(function (p, i) { return { t: 'pt', p: p, s: names[i], color: col, dir: [p[0] - c[0], p[1] - c[1]], r: 3.5 }; }); };
      var items = base.concat(rightMarks(O), rightMarks(B, C_GRN), lab(O, centroid(O), nm, C_HI), lab(B, centroid(B), ['A′', 'B′', 'C′'], C_GRN));
      var sol = [0, 1, 2].map(function (i) { return { t: 'line', a: O[i], b: B[i], color: C_ACC, dash: '5 4', w: 1.3 }; }).concat(items, [{ t: 'pt', p: Z, s: 'Z', color: C_ACC, dir: [-0.7, -0.7] }]);
      return { skill: 'Streckzentrum finden', level: 3, q: 'Das Dreieck A′B′C′ ist das Bild von ABC bei einer zentrischen Streckung. Bestimme das Streckzentrum Z und den Streckfaktor k.' + grid(items),
        inputs: coordIn(Z, 'Z').concat([{ kind: 'num', label: 'k =', answer: rd(k, 6), tol: small ? 0.001 : undefined }]),
        hints: ['Das Zentrum liegt auf jeder Geraden durch einen Punkt und seinen Bildpunkt. Zeichne die Geraden AA′ und BB′.', 'Der Schnittpunkt der Geraden AA′, BB′ und CC′ ist Z.', 'Für k vergleichst du zum Beispiel A′B′ mit AB: k = A′B′ : AB. ' + (small ? 'Ist das Bild kleiner, liegt k zwischen 0 und 1.' : '')],
        solution: 'Die Geraden AA′, BB′ und CC′ schneiden sich in <b>Z' + pt(Z) + '</b>. Jede Bildstrecke ist ' + (small ? 'halb so lang' : f(k) + '-mal so lang') + ' wie die Originalstrecke: <b>k = ' + f(k) + '</b>.' + grid(sol),
        mistakes: function (v) { if (isNum(v[2], 1 / k)) return 'Beim Streckfaktor hast du Original durch Bild geteilt. Rechne Bild : Original.'; return null; },
        verify: function () { return [0, 1, 2].every(function (i) { var q = strp(O[i], Z, k); return near(q[0], B[i][0]) && near(q[1], B[i][1]); }) ? true : 'Zentrum falsch'; } };
    },
    eigenschaften: function () {
      var askTrue = Math.random() < 0.5, ans = askTrue ? M.pick(TRUE) : M.pick(FALSE), opts = M.shuffle([ans].concat(M.shuffle(askTrue ? FALSE : TRUE).slice(0, 3)));
      return { skill: 'Eigenschaften der zentrischen Streckung', level: 1, q: 'Welche Aussage über die zentrische Streckung ist ' + (askTrue ? '<b>richtig</b>' : '<b>falsch</b>') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(function (o) { return o[0]; }), answer: opts.indexOf(ans) }],
        hints: ['Bei der zentrischen Streckung bleiben die Winkel gleich, die Längen werden mit k multipliziert.', 'Flächen werden mit k² multipliziert, nicht mit k.', 'Genau eine Aussage ist ' + (askTrue ? 'richtig' : 'falsch') + '.'],
        solution: '„' + ans[0] + '“ ist ' + (askTrue ? 'richtig' : 'falsch') + '. ' + ans[1],
        verify: function () { return opts.filter(function (o) { return (TRUE.indexOf(o) >= 0) === askTrue; }).length === 1 ? true : 'Aussagen'; } };
    },
    projektor: function () {
      var d1 = M.pick([20, 25, 30, 40, 50]), k = M.pick([2.5, 3, 4, 5]), h = M.pick([8, 10, 12, 15, 16, 20]), d2 = k * d1, H = k * h;
      var Z = [0, 0], F1 = [d1, 0], F2 = [d1, h], W1 = [d2, 0], W2 = [d2, H];
      var pic = scene([{ t: 'seg', a: [-d2 * 0.04, 0], b: [d2 * 1.06, 0], color: C_MUT, w: 1.5 }, { t: 'seg', a: [d2, 0], b: [d2, H * 1.15], color: '#94a3b8', w: 3 }, { t: 'seg', a: Z, b: W2, color: C_ACC, dash: '5 4', w: 1.5 }, { t: 'seg', a: W1, b: W2, color: '#334155', w: 6 }, { t: 'seg', a: F1, b: F2, color: C_HI, w: 4 },
        { t: 'pt', p: Z, s: 'Lampe Z', color: C_ACC, dir: [0.2, 1] }, { t: 'text', p: F2, s: 'Figur', dy: -12, color: C_HI, size: 11 }, { t: 'text', p: W2, s: 'Schatten', dx: -30, dy: 2, color: '#334155', size: 11, anchor: 'end' }, { t: 'text', p: [d2, 0], s: 'Wand', dy: 14, color: C_MUT, size: 11 }, { t: 'rmark', v: F1, a: Z, b: F2, z: 8 }, { t: 'rmark', v: W1, a: Z, b: W2, z: 8 }], { W: 340, H: 210, pad: 26, label: 'Lampe, Figur und Schatten von der Seite' });
      return { skill: 'Schattenbild (Anwendung)', level: 3, q: 'Eine kleine Lampe Z liegt auf dem Boden. ' + cm(d1) + ' vor der Lampe steht eine ' + cm(h) + ' hohe Pappfigur. Die Wand ist ' + (d2 >= 100 ? f(d2 / 100) + ' m' : cm(d2)) + ' von der Lampe entfernt. Der Schatten der Figur an der Wand ist ein zentrisch gestrecktes Bild der Figur mit dem Zentrum Z.<br>a) Wie groß ist der Streckfaktor k? b) Wie hoch ist der Schatten? c) Wie viel Mal so groß ist die Schattenfläche wie die Fläche der Figur?' + pic,
        inputs: [{ kind: 'num', label: 'a) k =', answer: k }, { kind: 'num', label: 'b) Höhe des Schattens', unit: 'cm', answer: H }, { kind: 'num', label: 'c) Fläche wird … mal so groß', answer: k * k }],
        hints: ['Der Streckfaktor ist das Verhältnis der Abstände von Z: k = Abstand Wand : Abstand Figur. Rechne beides in cm.', 'k = ' + cm(d2) + ' : ' + cm(d1) + ' = ' + f(k) + '. Die Schattenhöhe ist k · ' + cm(h) + '.', 'Flächen wachsen mit k² = ' + f(k) + ' · ' + f(k) + '.'],
        solution: 'a) k = ' + f(d2) + ' cm : ' + f(d1) + ' cm = <b>' + f(k) + '</b>. b) Schatten: ' + f(k) + ' · ' + cm(h) + ' = <b>' + cm(H) + '</b>. c) Flächenfaktor k² = ' + f(k) + '² = <b>' + f(k * k) + '</b>. Die Schattenfläche ist also ' + f(k * k) + '-mal so groß, nicht nur ' + f(k) + '-mal.',
        mistakes: function (v) { if (isNum(v[2], k)) return 'Bei c) hast du den Faktor k genommen. ' + K2; if (isNum(v[0], d2 / d1 / 100) || isNum(v[0], d2 / 100 / d1)) return 'Rechne beide Abstände in derselben Einheit (cm), bevor du teilst.'; return null; },
        verify: function () { return near(dist(Z, W2) / dist(Z, F2), k) && near(W2[1] / F2[1], k) ? true : 'falsch'; } };
    }
  };

  /* Erklärungsfiguren */
  var exZ = [0, 0], exT = [[1, 1], [2.5, 1], [1, 2]], exB = exT.map(function (p) { return strp(p, exZ, 2); });
  function triPts(T, names, col, dirs) { var c = centroid(T); return T.map(function (p, i) { return { t: 'pt', p: p, s: names[i], color: col, dir: dirs ? dirs[i] : [p[0] - c[0], p[1] - c[1]], r: 3.5 }; }); }
  var figEx = scene([{ t: 'seg', a: exZ, b: exB[0], color: C_ACC, dash: '5 4', w: 1.3 }, { t: 'seg', a: exZ, b: exB[1], color: C_ACC, dash: '5 4', w: 1.3 }, { t: 'seg', a: exZ, b: exB[2], color: C_ACC, dash: '5 4', w: 1.3 }, { t: 'poly', p: exB, fill: '#dff3ef', color: C_GRN }, { t: 'poly', p: exT }].concat(rightMarks(exT), rightMarks(exB, C_GRN))
    .concat(triPts(exT, ['A', 'B', 'C'], C_HI, [[0.6, -1], [0.4, -1], [-1, 0.3]]), triPts(exB, ['A′', 'B′', 'C′'], C_GRN, [[0.6, -1], [1, -0.2], [-1, 0.3]]), [{ t: 'pt', p: exZ, s: 'Z', color: C_ACC, dir: [-0.7, -0.7] }]), { bounds: [-0.5, 5.5, -0.5, 4.5], grid: true, axes: false, W: 330, H: 250, pad: 14, label: 'Zentrische Streckung eines Dreiecks mit k = 2', maxw: 380 });
  function sqFig(k) { var it = []; for (var i = 0; i < k; i++) for (var j = 0; j < k; j++) it.push({ t: 'poly', p: [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], w: 1.2, fill: i === 0 && j === 0 ? '#fde7c4' : C_FILL }); return '<div style="flex:1 1 110px;max-width:150px;text-align:center">' + scene(it, { bounds: [0, 3, 0, 3], W: 120, H: 120, pad: 6, label: 'Quadrat mit k = ' + k, maxw: 120 }) + '<b style="color:#1e3a8a">k = ' + k + ': ' + k * k + ' Kästchen</b></div>'; }

  return {
    id: '018', title: 'Zentrische Streckung', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Koordinatensystem, Flächeninhalt von Rechteck und Dreieck, Dezimalzahlen multiplizieren',
    lead: 'Ein Beamer macht aus einem kleinen Bild ein riesiges, ohne die Form zu verändern. Du lernst die zentrische Streckung kennen und entdeckst, warum die Fläche viel schneller wächst als die Seiten.',
    einstieg: { html: '<p>Halte im dunklen Zimmer eine Hand vor eine Taschenlampe. An der Wand erscheint ein großer Schatten deiner Hand. Gehst du mit der Hand näher an die Lampe, wird der Schatten noch größer. Die Form bleibt aber immer gleich.</p><p class="note">Der Schatten ist doppelt so hoch wie deine Hand. Ist dann auch seine Fläche doppelt so groß? Schätze zuerst.</p><p>In diesem Modul lernst du, wie man solche Vergrößerungen und Verkleinerungen genau beschreibt: mit einem <b>Streckzentrum Z</b> und einem <b>Streckfaktor k</b>. Am Ende kannst du die Frage sicher beantworten.</p>' },
    ziele: ['Ich strecke Punkte und Figuren zentrisch mit einem Zentrum Z und einem Faktor k.', 'Ich berechne Bildpunkte im Koordinatensystem.', 'Ich bestimme den Streckfaktor aus Original und Bild.', 'Ich berechne Längen im Bild mit k und Flächen mit k².', 'Ich unterscheide Vergrößerung (k > 1) und Verkleinerung (0 < k < 1).'],
    fachwoerter: [['Streckzentrum Z', 'Der feste Punkt, von dem aus gestreckt wird. Er bleibt an seinem Platz.'], ['Streckfaktor k', 'Gibt an, wie viel Mal so weit der Bildpunkt von Z entfernt ist wie der Originalpunkt.'], ['Bildpunkt P′', 'Der Punkt, auf den P abgebildet wird. Er liegt auf dem Strahl von Z durch P.'], ['Vergrößerung / Verkleinerung', 'k > 1: Das Bild ist größer. 0 < k < 1: Das Bild ist kleiner.'], ['ähnlich', 'Zwei Figuren mit gleicher Form, aber eventuell verschiedener Größe.']],
    diagnose: [
      { q: 'Vom Punkt Z(1 | 2) gehst du 3 nach rechts und 1 nach unten. Wo landest du?', options: ['(4 | 1)', '(4 | 3)', '(−2 | 1)', 'Weiß ich noch nicht'], answer: 0, why: 'x: 1 + 3 = 4, y: 2 − 1 = 1.', review: 'Koordinatensystem' },
      { q: 'Ein Quadrat hat die Seitenlänge 3 cm. Wie groß ist sein Flächeninhalt?', options: ['9 cm²', '6 cm²', '12 cm²', 'Weiß ich noch nicht'], answer: 0, why: '3 cm · 3 cm = 9 cm².', review: 'Flächeninhalt von Rechteck und Quadrat' },
      { q: 'Was ergibt 2,5 · 4,2?', options: ['10,5', '8,4', '6,7', 'Weiß ich noch nicht'], answer: 0, why: '2,5 · 4 = 10 und 2,5 · 0,2 = 0,5, zusammen 10,5.', review: 'Dezimalzahlen multiplizieren' },
      { q: 'Welche Zahl ergibt mit sich selbst multipliziert 36?', options: ['6', '18', '9', 'Weiß ich noch nicht'], answer: 0, why: '6 · 6 = 36.', review: 'Quadratzahlen' }],
    erklaerung:
      '<h3>1. So funktioniert die zentrische Streckung</h3><p>Du brauchst ein <b>Streckzentrum Z</b> und einen <b>Streckfaktor k</b>. Für jeden Punkt P zeichnest du den Strahl von Z durch P. Der Bildpunkt P′ liegt auf diesem Strahl, und zwar k-mal so weit von Z entfernt wie P.</p>' + figEx +
      '<div class="merk"><b>Merke:</b> Bei einer zentrischen Streckung mit Zentrum Z und Faktor k gilt: <span class="big-math">ZP′ = k · ZP</span><br>k > 1: <b>Vergrößerung</b>, 0 < k < 1: <b>Verkleinerung</b>, k = 1: Das Bild ist genauso groß.</div>' +
      '<h3>2. Bildpunkte im Koordinatensystem</h3><p>Bestimme den Weg von Z nach P, zum Beispiel 2 nach rechts und 1 nach oben. Multipliziere beide Teile mit k. Bei k = 3 gehst du also von Z aus 6 nach rechts und 3 nach oben. Wichtig: Der Weg beginnt immer bei <b>Z</b>.</p><p>Den Streckfaktor bestimmst du umgekehrt: <span class="big-math">k = ZP′ : ZP = Bildlänge : Originallänge</span></p>' +
      '<h3>3. Was bleibt gleich, was ändert sich?</h3><ul><li>Alle <b>Winkel</b> bleiben gleich. Original und Bild sind <b>ähnlich</b>.</li><li>Jede Strecke ist parallel zu ihrer Bildstrecke.</li><li>Alle <b>Längen</b> (auch der Umfang) werden mit <b>k</b> multipliziert.</li><li>Alle <b>Flächen</b> werden mit <b>k²</b> multipliziert.</li></ul>' +
      '<div style="display:flex;flex-wrap:wrap;gap:8px 18px;align-items:flex-end">' + sqFig(1) + sqFig(2) + sqFig(3) + '</div>' +
      '<div class="merk"><b>Merke:</b> Längen · k, Flächen · k². Bei k = 2 wird die Fläche <b>4-mal</b> so groß, bei k = 3 sogar <b>9-mal</b> so groß.</div>' +
      '<p class="note"><b>Typischer Fehler:</b> „Doppelt so hoch, also doppelt so viel Fläche.“ Das stimmt nicht. Breite und Höhe verdoppeln sich beide, die Fläche wird also 2 · 2 = 4-mal so groß.</p>',
    entdecken: {
      html: '<p>Verändere den Streckfaktor k und die Lage des Zentrums Z. Beobachte das Bilddreieck A′B′C′ und die Werte darunter.</p><div class="ctl"><label>k = <b id="v_k"></b> <input type="range" id="r_k" min="0.5" max="3" step="0.5" value="1"></label><label>Zentrum <select id="s_z"><option value="0,0">Z(0 | 0)</option><option value="2,2">Z(2 | 2) im Dreieck</option><option value="3,0">Z(3 | 0)</option></select></label></div><div id="e_g"></div><p id="e_t"></p><p class="note">Wie ändert sich die Fläche, wenn k von 1 auf 2 steigt? Und von 1 auf 3?</p>',
      init: function (root, done) {
        var n = 0, T = [[1, 1], [3, 1], [2, 3]];
        function draw() {
          var k = +root.querySelector('#r_k').value, zz = root.querySelector('#s_z').value.split(',').map(Number), Z = zz, B = T.map(function (p) { return strp(p, Z, k); });
          root.querySelector('#v_k').textContent = f(k);
          var it = [0, 1, 2].map(function (i) { var far = k >= 1 ? B[i] : T[i]; return { t: 'seg', a: Z, b: far, color: C_ACC, dash: '4 3', w: 1.2 }; }).concat([{ t: 'poly', p: B, fill: '#dff3ef', color: C_GRN, op: 0.85 }, { t: 'poly', p: T, op: 0.85 }], triPts(T, ['A', 'B', 'C'], C_HI), triPts(B, ['A′', 'B′', 'C′'], C_GRN), [{ t: 'pt', p: Z, s: 'Z', color: C_ACC, dir: [-0.7, -0.7] }]);
          root.querySelector('#e_g').innerHTML = scene(it, { bounds: [-3.5, 9.5, -1.5, 9.5], grid: true, gridStep: 2, W: 330, H: 330, pad: 12, label: 'Zentrische Streckung eines Dreiecks', maxw: 360 });
          root.querySelector('#e_t').innerHTML = 'AB = 2 cm, A′B′ = ' + f(k) + ' · 2 cm = <b>' + cm(2 * k) + '</b> (' + kArt(k) + ')<br>Fläche ABC = 2 cm², Fläche A′B′C′ = ' + f(k) + '² · 2 cm² = <b>' + f(k * k * 2) + ' cm²</b>, also ' + f(k * k) + '-mal so groß.';
        }
        function step() { draw(); n++; if (n >= 3) done('Gut beobachtet: Die Seiten werden k-mal so lang, die Fläche aber k²-mal so groß. Wo Z liegt, ändert nur die Lage des Bildes, nicht seine Größe.'); }
        root.querySelector('#r_k').addEventListener('input', step); root.querySelector('#s_z').addEventListener('change', step);
        draw();
      }
    },
    beispiel: { title: 'Bildpunkt berechnen', q: 'Strecke P(3 | 3) am Zentrum Z(1 | 2) mit dem Faktor k = 3.',
      steps: ['Weg von Z nach P bestimmen: von (1 | 2) nach (3 | 3) sind es 2 nach rechts und 1 nach oben.', 'Den Weg mit k = 3 multiplizieren: 6 nach rechts und 3 nach oben.', 'Den neuen Weg von Z aus gehen: x = 1 + 6 = 7, y = 2 + 3 = 5.', 'Ergebnis: <b>P′(7 | 5)</b>.', 'Kontrolle: P′ liegt auf dem Strahl von Z durch P und ist 3-mal so weit von Z entfernt wie P.' + grid(rayItems([1, 2], [3, 3], [7, 5], ['P', 'P′']), { bounds: [-0.5, 8.5, -0.5, 6.5], label: 'Streckung von P am Zentrum Z mit k = 3' })] },
    tasks: { gen: gen, plan: { G: ['eigenschaften:1', 'bildpunkt:1', 'laenge:1', 'flaeche:1'], S: ['bildpunkt:1', 'bildpunkt:2', 'faktor:2', 'laenge:2', 'flaeche:2'], E: ['bildpunkt:2', 'faktor:2', 'flaeche:2', 'umfangFlaeche:2', 'flaecheRueck:3', 'zentrum:3'] },
      extra: 'projektor', test: ['bildpunkt:2', 'faktor:2', 'laenge:2', 'flaeche:2', 'umfangFlaeche:2', 'eigenschaften:1'] },
    lerncheck: ['Ich berechne Bildpunkte bei einer zentrischen Streckung.', 'Ich bestimme den Streckfaktor aus Original und Bild.', 'Ich berechne Längen im Bild mit k.', 'Ich weiß, dass Flächen mit k² wachsen, und rechne damit.']
  };
})();
