/* Modul 021 (Klasse 9) · Der Satz des Pythagoras */
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
  /* ---------- Hilfen ---------- */
  function near(a, b) { return Math.abs(a - b) < 1e-6; }
  function isNum(v, x, tol) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) <= (tol || 1e-6); }
  var TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [15, 20, 25], [20, 21, 29], [1.5, 2, 2.5], [4.5, 6, 7.5], [2.5, 6, 6.5], [10, 24, 26], [12, 35, 37]];
  var VN = ['A', 'B', 'C'], SN = ['a', 'b', 'c'], WN = ['α', 'β', 'γ'];
  /* rechtwinkliges Dreieck: rechter Winkel bei Ecke r, Katheten p (gegenüber Ecke r+2) und q (gegenüber Ecke r+1) */
  function rtTri(r, p, q, w) {
    var T = []; T[r] = [0, 0]; T[(r + 1) % 3] = [p, 0]; T[(r + 2) % 3] = [0, q];
    return T.map(function (z) { return rotP(z, w || 0); });
  }
  function rtSvg(T, sides, o) {
    o = o || {}; var it = triItems(T, { sides: sides, names: o.names }).concat(rightMarks(T));
    return scene(it, { W: o.W || 320, H: o.H || 210, pad: o.pad || 30, label: 'Rechtwinkliges Dreieck', maxw: 380 });
  }
  function squares(a, b, o) {
    o = o || {}; var C = [0, 0], B = [a, 0], A = [0, b], n = [b, a];
    var it = [{ t: 'poly', p: [C, B, [a, -a], [0, -a]], fill: '#fde7c4', color: C_ACC, w: 2 }, { t: 'poly', p: [C, [-b, 0], [-b, b], A], fill: '#dff3ef', color: C_GRN, w: 2 }, { t: 'poly', p: [B, A, [A[0] + n[0], A[1] + n[1]], [B[0] + n[0], B[1] + n[1]]], fill: '#dbe4fb', color: C_HI, w: 2 }, { t: 'poly', p: [C, B, A], fill: '#fff', color: C_LINE }, { t: 'rmark', v: C, a: B, b: A, z: 9 }];
    var L = o.labels || [f(a * a) + ' cm²', f(b * b) + ' cm²', f(a * a + b * b) + ' cm²'];
    it.push({ t: 'text', p: [a / 2, -a / 2], s: L[0], size: 12, bold: true, color: '#b45309', fixed: true }, { t: 'text', p: [-b / 2, b / 2], s: L[1], size: 12, bold: true, color: C_GRN, fixed: true }, { t: 'text', p: [(a + b) / 2, (a + b) / 2], s: L[2], size: 12, bold: true, color: C_HI, fixed: true });
    if (o.sides) it.push({ t: 'side', a: C, b: B, ref: [0, -a], s: o.sides[0], inside: true }, { t: 'side', a: C, b: A, ref: [-b, 0], s: o.sides[1], inside: true }, { t: 'side', a: B, b: A, ref: [a + b, a + b], s: o.sides[2], inside: true });
    return scene(it, { W: o.W || 320, H: o.H || 300, pad: 12, label: 'Quadrate über den Seiten eines rechtwinkligen Dreiecks', maxw: o.maxw || 360 });
  }
  function eqFor(r) { var h = SN[r], k1 = SN[(r + 1) % 3], k2 = SN[(r + 2) % 3]; var ks = [k1, k2].sort(); return ks[0] + '² + ' + ks[1] + '² = ' + h + '²'; }
  function sqrtNice(x) { return f(x); }

  var gen = {
    benennen: function () {
      var r = M.rnd(0, 2), tr = M.pick(TRIPLES.slice(0, 6)), T = rtTri(r, tr[0], tr[1], M.rnd(0, 359)), askH = Math.random() < 0.5;
      var opts = askH ? ['a', 'b', 'c'] : ['a und b', 'a und c', 'b und c'];
      var kat = [SN[(r + 1) % 3], SN[(r + 2) % 3]].sort().join(' und '), ans = askH ? r : opts.indexOf(kat);
      return { skill: 'Hypotenuse und Katheten benennen', level: 1, q: 'Das Dreieck ABC hat bei ' + VN[r] + ' einen rechten Winkel. ' + (askH ? 'Welche Seite ist die <b>Hypotenuse</b>?' : 'Welche Seiten sind die <b>Katheten</b>?') + rtSvg(T, SN.slice()),
        inputs: [{ kind: 'mc', label: askH ? 'Hypotenuse' : 'Katheten', options: opts, answer: ans }],
        hints: ['Die Hypotenuse liegt dem rechten Winkel <b>gegenüber</b>. Sie ist die längste Seite.', 'Die beiden Katheten bilden den rechten Winkel, sie stoßen also in ' + VN[r] + ' zusammen.', 'Die Seite gegenüber von ' + VN[r] + ' heißt ' + SN[r] + '.'],
        solution: 'Der rechte Winkel liegt bei ' + VN[r] + '. Die Hypotenuse liegt gegenüber: <b>' + SN[r] + '</b>. Die Katheten sind <b>' + kat + '</b>.',
        verify: function () { var L = [dist(T[1], T[2]), dist(T[0], T[2]), dist(T[0], T[1])]; return L[r] === Math.max.apply(null, L) && near(L[(r + 1) % 3] * L[(r + 1) % 3] + L[(r + 2) % 3] * L[(r + 2) % 3], L[r] * L[r]) ? true : 'falsch'; } };
    },
    gleichung: function () {
      var r = M.rnd(0, 2), tr = M.pick(TRIPLES.slice(0, 6)), T = rtTri(r, tr[0], tr[1], M.rnd(0, 359));
      var opts = M.shuffle([eqFor(0), eqFor(1), eqFor(2), SN[r] + '² = ' + SN[(r + 1) % 3] + ' + ' + SN[(r + 2) % 3]]), right = eqFor(r);
      return { skill: 'Satz des Pythagoras aufstellen', level: 1, q: 'Im Dreieck ABC ist der Winkel ' + WN[r] + ' bei ' + VN[r] + ' ein rechter Winkel. Welche Gleichung gilt?' + rtSvg(T, SN.slice()),
        inputs: [{ kind: 'mc', label: 'Gleichung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Suche zuerst die Hypotenuse: Sie liegt dem rechten Winkel gegenüber.', 'Die Hypotenuse ist hier ' + SN[r] + '. Ihr Quadrat steht allein auf einer Seite.', 'Kathete² + Kathete² = Hypotenuse².'],
        solution: 'Hypotenuse ist ' + SN[r] + ' (gegenüber von ' + VN[r] + '). Also gilt <b>' + right + '</b>. Die Formel a² + b² = c² gilt nur, wenn der rechte Winkel bei C liegt.',
        mistakes: function (v) { if (opts[+v[0]] === eqFor(2) && r !== 2) return 'Die Formel a² + b² = c² gilt nur, wenn der rechte Winkel bei C liegt. Hier liegt er bei ' + VN[r] + '.'; return null; },
        verify: function () { return opts.indexOf(right) >= 0 && new Set(opts).size === 4 ? true : 'falsch'; } };
    },
    quadrate: function () {
      var tr = M.pick(TRIPLES.slice(0, 5).concat([[1.5, 2, 2.5]])), mode = M.pick(['hyp', 'kat']), a = tr[0], b = tr[1];
      var L = mode === 'hyp' ? [f(a * a) + ' cm²', f(b * b) + ' cm²', '? cm²'] : [f(a * a) + ' cm²', '? cm²', f(a * a + b * b) + ' cm²'];
      var ans = mode === 'hyp' ? a * a + b * b : b * b;
      return { skill: 'Quadrate über den Seiten', level: 1, q: 'Über den Seiten eines rechtwinkligen Dreiecks sind Quadrate gezeichnet. Zwei Flächeninhalte sind angegeben. Wie groß ist der dritte?' + squares(a, b, { labels: L }),
        inputs: [{ kind: 'num', label: 'Flächeninhalt', unit: 'cm²', answer: ans }],
        hints: ['Satz des Pythagoras: Die beiden Kathetenquadrate sind zusammen so groß wie das Hypotenusenquadrat.', 'Das größte Quadrat liegt an der Hypotenuse (gegenüber dem rechten Winkel).', mode === 'hyp' ? 'Addiere: ' + f(a * a) + ' + ' + f(b * b) + '.' : 'Subtrahiere: ' + f(a * a + b * b) + ' − ' + f(a * a) + '.'],
        solution: mode === 'hyp' ? f(a * a) + ' cm² + ' + f(b * b) + ' cm² = <b>' + f(ans) + ' cm²</b>' : f(a * a + b * b) + ' cm² − ' + f(a * a) + ' cm² = <b>' + f(ans) + ' cm²</b>',
        mistakes: function (v) { if (mode === 'kat' && isNum(v[0], 2 * a * a + b * b)) return 'Das gesuchte Quadrat liegt an einer Kathete. Es ist kleiner als das Hypotenusenquadrat, also musst du subtrahieren.'; return null; },
        verify: function () { return near(a * a + b * b, tr[2] * tr[2]) ? true : 'falsch'; } };
    },
    hypTripel: function (lvl) {
      var tr = lvl === 1 ? M.pick(TRIPLES.slice(0, 5)) : M.pick(TRIPLES), r = lvl === 1 ? 2 : M.rnd(0, 2), sw = Math.random() < 0.5, p = sw ? tr[1] : tr[0], q = sw ? tr[0] : tr[1];
      var T = rtTri(r, p, q, lvl === 1 ? 0 : M.rnd(0, 359)), sides = ['', '', '']; sides[(r + 2) % 3] = cm(p); sides[(r + 1) % 3] = cm(q); sides[r] = SN[r] + ' = ?';
      return { skill: 'Hypotenuse berechnen', level: lvl, q: 'Das Dreieck ist rechtwinklig mit dem rechten Winkel bei ' + VN[r] + '. Berechne die Länge der Hypotenuse ' + SN[r] + '.' + rtSvg(T, sides),
        inputs: [{ kind: 'num', label: SN[r] + ' =', unit: 'cm', answer: tr[2] }],
        hints: ['Die Hypotenuse liegt gegenüber dem rechten Winkel. Es gilt: ' + SN[r] + '² = ' + f(p) + '² + ' + f(q) + '².', SN[r] + '² = ' + f(p * p) + ' + ' + f(q * q) + ' = ' + f(p * p + q * q) + '.', 'Ziehe die Wurzel: ' + SN[r] + ' = ' + sq(f(p * p + q * q)) + '.'],
        solution: SN[r] + '² = ' + f(p) + '² + ' + f(q) + '² = ' + f(p * p) + ' + ' + f(q * q) + ' = ' + f(p * p + q * q) + ' ⇒ ' + SN[r] + ' = ' + sq(f(p * p + q * q)) + ' = <b>' + cm(tr[2]) + '</b>',
        mistakes: function (v) { if (isNum(v[0], p + q)) return 'Du hast die Seiten addiert. Der Satz des Pythagoras gilt für die <b>Quadrate</b> der Seiten.'; if (isNum(v[0], p * p + q * q)) return 'Das ist ' + SN[r] + '². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return near(dist(T[(r + 1) % 3], T[(r + 2) % 3]), tr[2]) ? true : 'falsch'; } };
    },
    kathTripel: function (lvl) {
      var tr = M.pick(lvl === 1 ? TRIPLES.slice(0, 5) : TRIPLES), r = M.rnd(0, 2), sw = Math.random() < 0.5, p = sw ? tr[1] : tr[0], q = sw ? tr[0] : tr[1];
      var T = rtTri(r, p, q, M.rnd(0, 359)), sides = ['', '', '']; sides[(r + 2) % 3] = cm(p); sides[(r + 1) % 3] = SN[(r + 1) % 3] + ' = ?'; sides[r] = cm(tr[2]);
      var x = SN[(r + 1) % 3];
      return { skill: 'Kathete berechnen', level: lvl, q: 'Das Dreieck ist rechtwinklig mit dem rechten Winkel bei ' + VN[r] + '. Berechne die Kathete ' + x + '.' + rtSvg(T, sides),
        inputs: [{ kind: 'num', label: x + ' =', unit: 'cm', answer: q }],
        hints: ['Die Hypotenuse ist ' + SN[r] + ' = ' + cm(tr[2]) + '. Es gilt ' + f(p) + '² + ' + x + '² = ' + f(tr[2]) + '².', 'Stelle um: ' + x + '² = ' + f(tr[2]) + '² − ' + f(p) + '² = ' + f(tr[2] * tr[2]) + ' − ' + f(p * p) + '.', x + '² = ' + f(q * q) + '. Ziehe die Wurzel.'],
        solution: x + '² = ' + f(tr[2]) + '² − ' + f(p) + '² = ' + f(tr[2] * tr[2]) + ' − ' + f(p * p) + ' = ' + f(q * q) + ' ⇒ ' + x + ' = ' + sq(f(q * q)) + ' = <b>' + cm(q) + '</b>',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y !== null && Math.abs(y - Math.sqrt(tr[2] * tr[2] + p * p)) < 0.06) return 'Du hast addiert. Gesucht ist eine <b>Kathete</b>, sie ist kürzer als die Hypotenuse. Ziehe das Kathetenquadrat vom Hypotenusenquadrat ab.'; if (isNum(v[0], tr[2] - p)) return 'Du hast die Seitenlängen subtrahiert. Subtrahiere die <b>Quadrate</b> und ziehe danach die Wurzel.'; if (isNum(v[0], q * q)) return 'Das ist ' + x + '². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return near(p * p + q * q, tr[2] * tr[2]) && near(dist(T[r], T[(r + 2) % 3]), q) ? true : 'falsch'; } };
    },
    hypRund: function (lvl) {
      var p, q; do { p = M.rnd(2, 12); q = M.rnd(2, 12); } while (p === q || Number.isInteger(Math.sqrt(p * p + q * q)));
      if (lvl === 3) { p = p + 0.5; }
      var c = Math.sqrt(p * p + q * q), T = rtTri(2, p, q, 0), sides = [cm(q), cm(p), 'c = ?'];
      return { skill: 'Hypotenuse berechnen (gerundet)', level: lvl, q: 'Im Dreieck ABC ist γ = 90°. Die Katheten sind ' + cm(p) + ' und ' + cm(q) + ' lang. Berechne die Hypotenuse c. Runde auf eine Stelle nach dem Komma.' + rtSvg(T, sides),
        inputs: [{ kind: 'num', label: 'c ≈', unit: 'cm', answer: rd(c, 4), tol: 0.05 }],
        hints: ['c² = ' + f(p) + '² + ' + f(q) + '².', 'c² = ' + f(p * p) + ' + ' + f(q * q) + ' = ' + f(p * p + q * q) + '.', 'c = ' + sq(f(p * p + q * q)) + '. Nutze die Wurzeltaste deines Taschenrechners und runde.'],
        solution: 'c² = ' + f(p * p) + ' + ' + f(q * q) + ' = ' + f(p * p + q * q) + ' ⇒ c = ' + sq(f(p * p + q * q)) + ' ≈ ' + f(rd(c, 3)) + ' ≈ <b>' + cm(rd(c, 1)) + '</b>',
        mistakes: function (v) { if (isNum(v[0], p + q)) return 'Du hast die Seiten addiert. Addiere die <b>Quadrate</b> und ziehe dann die Wurzel.'; if (isNum(v[0], p * p + q * q)) return 'Das ist c². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return Math.abs(dist(T[0], T[1]) - c) < 1e-9 && Math.abs(c * c - p * p - q * q) < 1e-9 ? true : 'falsch'; } };
    },
    kathRund: function (lvl) {
      var c, p; do { c = M.rnd(5, 15); p = M.rnd(2, c - 2); } while (Number.isInteger(Math.sqrt(c * c - p * p)));
      var q = Math.sqrt(c * c - p * p), r = M.rnd(0, 2), T = rtTri(r, p, q, M.rnd(0, 359)), sides = ['', '', '']; sides[(r + 2) % 3] = cm(p); sides[(r + 1) % 3] = SN[(r + 1) % 3] + ' = ?'; sides[r] = cm(c);
      var x = SN[(r + 1) % 3];
      return { skill: 'Kathete berechnen (gerundet)', level: lvl, q: 'Das Dreieck hat bei ' + VN[r] + ' einen rechten Winkel. Berechne ' + x + ' und runde auf eine Stelle nach dem Komma.' + rtSvg(T, sides),
        inputs: [{ kind: 'num', label: x + ' ≈', unit: 'cm', answer: rd(q, 4), tol: 0.05 }],
        hints: ['Hypotenuse ist ' + SN[r] + ' = ' + cm(c) + '. Also ' + x + '² = ' + f(c) + '² − ' + f(p) + '².', x + '² = ' + f(c * c) + ' − ' + f(p * p) + ' = ' + f(c * c - p * p) + '.', x + ' = ' + sq(f(c * c - p * p)) + '. Runde auf eine Stelle nach dem Komma.'],
        solution: x + '² = ' + f(c * c) + ' − ' + f(p * p) + ' = ' + f(c * c - p * p) + ' ⇒ ' + x + ' = ' + sq(f(c * c - p * p)) + ' ≈ ' + f(rd(q, 3)) + ' ≈ <b>' + cm(rd(q, 1)) + '</b>',
        mistakes: function (v) { if (isNum(v[0], Math.sqrt(c * c + p * p), 0.06)) return 'Du hast die Quadrate addiert. Die Kathete ist kürzer als die Hypotenuse ' + cm(c) + ', also musst du subtrahieren.'; if (isNum(v[0], c - p)) return 'Subtrahiere die <b>Quadrate</b>, nicht die Seitenlängen.'; return null; },
        verify: function () { return Math.abs(dist(T[r], T[(r + 2) % 3]) - q) < 1e-9 && q < c ? true : 'falsch'; } };
    },
    umkehrung: function (lvl) {
      var yes = Math.random() < 0.5, s;
      if (yes) s = M.pick(TRIPLES).slice(); else { var t = M.pick(TRIPLES.slice(0, 9)), d = M.pick([-1, 1, 2]); s = [t[0], t[1], t[2] + d]; if (s[0] + s[1] <= s[2]) s[2] = t[2] + 1; }
      var sh = M.shuffle(s), big = Math.max.apply(null, s), small = s.filter(function (x, i) { return i !== s.indexOf(big); }), sum = small[0] * small[0] + small[1] * small[1];
      var opts = ['Ja, das Dreieck ist rechtwinklig.', 'Nein, das Dreieck ist nicht rechtwinklig.'];
      return { skill: 'Umkehrung des Satzes des Pythagoras', level: lvl, q: 'Ein Dreieck hat die Seitenlängen ' + sh.map(function (x) { return cm(x); }).join(', ').replace(/, ([^,]*)$/, ' und $1') + '. Ist es rechtwinklig?',
        inputs: [{ kind: 'mc', label: 'Entscheide', options: opts, answer: yes ? 0 : 1 }],
        hints: ['Umkehrung: Gilt für die beiden kürzeren Seiten a² + b² = c² (c die längste Seite), dann ist das Dreieck rechtwinklig.', 'Längste Seite: ' + cm(big) + ', ihr Quadrat ist ' + f(big * big) + '.', 'Summe der anderen Quadrate: ' + f(small[0]) + '² + ' + f(small[1]) + '² = ' + f(sum) + '. Vergleiche.'],
        solution: f(small[0]) + '² + ' + f(small[1]) + '² = ' + f(small[0] * small[0]) + ' + ' + f(small[1] * small[1]) + ' = ' + f(sum) + ' und ' + f(big) + '² = ' + f(big * big) + '. ' + (yes ? 'Die Werte sind gleich, das Dreieck ist <b>rechtwinklig</b>. Der rechte Winkel liegt gegenüber der längsten Seite.' : 'Die Werte sind verschieden, das Dreieck ist <b>nicht rechtwinklig</b>.'),
        verify: function () { return near(sum, big * big) === yes ? true : 'falsch'; } };
    },
    maurer: function () {
      var base = M.pick([[60, 80, 100], [90, 120, 150], [120, 160, 200], [30, 40, 50], [45, 60, 75], [150, 200, 250]]), ok = Math.random() < 0.5, meas = ok ? base[2] : base[2] + M.pick([-4, -3, -2, 2, 3, 5]);
      var T = rtTri(0, base[0], base[1], 0);
      return { skill: 'Rechten Winkel prüfen (Anwendung)', level: 3, q: 'Ein Gärtner legt eine rechteckige Terrasse an und will prüfen, ob die Ecke wirklich rechtwinklig ist. Er misst von der Ecke aus ' + cm(base[0]) + ' an der einen Kante und ' + cm(base[1]) + ' an der anderen Kante ab und markiert die Punkte. Den Abstand der beiden Markierungen misst er mit ' + cm(meas) + '.<br>a) Wie lang müsste der Abstand bei einem genau rechten Winkel sein? b) Ist die Ecke rechtwinklig?' + scene([{ t: 'seg', a: [0, 0], b: [base[0] * 1.3, 0], color: C_LINE, w: 3 }, { t: 'seg', a: [0, 0], b: [0, base[1] * 1.25], color: C_LINE, w: 3 }, { t: 'seg', a: [base[0], 0], b: [0, base[1]], color: C_ACC, dash: '6 4' }, { t: 'pt', p: [base[0], 0], r: 3.5, color: C_ACC }, { t: 'pt', p: [0, base[1]], r: 3.5, color: C_ACC }, { t: 'side', a: [0, 0], b: [base[0], 0], ref: [0, 50], s: cm(base[0]) }, { t: 'side', a: [0, 0], b: [0, base[1]], ref: [50, 0], s: cm(base[1]) }, { t: 'side', a: [base[0], 0], b: [0, base[1]], ref: [0, 0], s: 'gemessen ' + cm(meas), color: '#b45309' }, { t: 'text', p: [0, 0], s: 'Ecke', dx: -6, dy: 10, anchor: 'end', size: 11 }], { W: 320, H: 220, pad: 28, note: 'Winkel in der Skizze unbekannt', label: 'Terrassenecke mit Prüfmaßen', maxw: 380 }),
        inputs: [{ kind: 'num', label: 'a) Abstand bei rechtem Winkel', unit: 'cm', answer: base[2] }, { kind: 'mc', label: 'b) Entscheide', options: ['Ja, die Ecke ist rechtwinklig.', 'Nein, die Ecke ist nicht rechtwinklig.'], answer: ok ? 0 : 1 }],
        hints: ['Bei einem rechten Winkel bilden die beiden Kanten die Katheten, der Abstand der Markierungen ist die Hypotenuse.', 'Abstand² = ' + f(base[0]) + '² + ' + f(base[1]) + '² = ' + f(base[0] * base[0] + base[1] * base[1]) + '.', 'Ziehe die Wurzel und vergleiche mit dem gemessenen Wert ' + cm(meas) + '. Nur wenn beide gleich sind, ist die Ecke rechtwinklig (Umkehrung des Satzes).'],
        solution: 'a) ' + sq(f(base[0]) + '² + ' + f(base[1]) + '²') + ' = ' + sq(f(base[0] * base[0] + base[1] * base[1])) + ' = <b>' + cm(base[2]) + '</b>. b) Gemessen: ' + cm(meas) + '. ' + (ok ? 'Das stimmt überein: Die Ecke ist <b>rechtwinklig</b> (Umkehrung des Satzes des Pythagoras).' : 'Das weicht ab: Die Ecke ist <b>nicht rechtwinklig</b>. ' + (meas > base[2] ? 'Der Winkel ist etwas größer als 90°.' : 'Der Winkel ist etwas kleiner als 90°.')) + ' Handwerker nutzen dafür oft das Verhältnis 3 : 4 : 5.',
        mistakes: function (v) { if (isNum(v[0], base[0] + base[1])) return 'Du hast die Längen addiert. Rechne mit den Quadraten und ziehe dann die Wurzel.'; return null; },
        verify: function () { return near(dist(T[1], T[2]), base[2]) ? true : 'falsch'; } };
    }
  };

  var exT = rtTri(2, 4, 3, 0);
  return {
    id: '021', title: 'Der Satz des Pythagoras', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Quadratzahlen, Quadratwurzeln mit dem Taschenrechner, Flächeninhalt von Quadraten, rechtwinklige Dreiecke',
    lead: 'Schon vor über 4000 Jahren nutzten Baumeister ein Seil mit 12 Knoten, um rechte Winkel abzustecken. Du lernst den berühmtesten Satz der Geometrie kennen und berechnest damit fehlende Seiten in rechtwinkligen Dreiecken.',
    einstieg: { html: '<p>Im alten Ägypten nahmen Seilspanner ein Seil mit 12 gleichen Abständen und legten daraus ein Dreieck mit den Seiten 3, 4 und 5. Damit erhielten sie auf jeder Baustelle einen genauen rechten Winkel.</p><p class="note">Warum entsteht bei den Seitenlängen 3, 4 und 5 ein rechter Winkel? Rechne einmal 3 · 3 + 4 · 4 und vergleiche mit 5 · 5.</p><p>Dahinter steckt der <b>Satz des Pythagoras</b>. Er verbindet die drei Seiten eines rechtwinkligen Dreiecks. Mit ihm kannst du jede Seite berechnen, wenn du die beiden anderen kennst, und prüfen, ob ein Dreieck rechtwinklig ist.</p>' },
    ziele: ['Ich benenne in einem rechtwinkligen Dreieck die Hypotenuse und die Katheten.', 'Ich kenne den Satz des Pythagoras und deute ihn mit Quadraten über den Seiten.', 'Ich berechne die Hypotenuse aus den beiden Katheten.', 'Ich berechne eine Kathete aus der Hypotenuse und der anderen Kathete.', 'Ich prüfe mit der Umkehrung, ob ein Dreieck rechtwinklig ist.'],
    fachwoerter: [['Hypotenuse', 'Die längste Seite im rechtwinkligen Dreieck. Sie liegt dem rechten Winkel gegenüber.'], ['Katheten', 'Die beiden Seiten, die den rechten Winkel bilden.'], ['Quadratwurzel', '√49 ist die positive Zahl, die mit sich selbst multipliziert 49 ergibt, also 7.'], ['pythagoreisches Tripel', 'Drei natürliche Zahlen mit a² + b² = c², zum Beispiel 3, 4, 5.'], ['Umkehrung', 'Gilt a² + b² = c², dann ist das Dreieck rechtwinklig.']],
    diagnose: [
      { q: 'Was ist 7²?', options: ['49', '14', '72', 'Weiß ich noch nicht'], answer: 0, why: '7² = 7 · 7 = 49.', review: 'Quadratzahlen' },
      { q: 'Welche Zahl ist √81?', options: ['9', '40,5', '18', 'Weiß ich noch nicht'], answer: 0, why: '9 · 9 = 81, also √81 = 9.', review: 'Quadratwurzeln' },
      { q: 'Ein Quadrat hat die Seitenlänge 6 cm. Wie groß ist sein Flächeninhalt?', options: ['36 cm²', '24 cm²', '12 cm²', 'Weiß ich noch nicht'], answer: 0, why: '6 cm · 6 cm = 36 cm².', review: 'Flächeninhalt von Quadraten' },
      { q: 'Runde 7,348 auf eine Stelle nach dem Komma.', options: ['7,3', '7,4', '7,35', 'Weiß ich noch nicht'], answer: 0, why: 'Die zweite Nachkommastelle ist 4, also wird abgerundet: 7,3.', review: 'Runden von Dezimalzahlen' }],
    erklaerung:
      '<h3>1. Hypotenuse und Katheten</h3><p>In einem rechtwinkligen Dreieck heißen die beiden Seiten am rechten Winkel <b>Katheten</b>. Die Seite gegenüber dem rechten Winkel heißt <b>Hypotenuse</b>. Sie ist immer die längste Seite.</p>' + rtSvg(exT, ['Kathete a', 'Kathete b', 'Hypotenuse c'], { W: 360, pad: 56 }) +
      '<h3>2. Der Satz des Pythagoras</h3><p>Im Bild ist a = 3 cm, b = 4 cm und c = 5 cm. Zeichnest du über jeder Seite ein Quadrat, dann sind die beiden kleinen Quadrate zusammen genau so groß wie das große Quadrat: 9 cm² + 16 cm² = 25 cm².</p>' + squares(3, 4, { labels: ['a² = 9 cm²', 'b² = 16 cm²', 'c² = 25 cm²'] }) +
      '<div class="merk"><b>Merke (Satz des Pythagoras):</b> In jedem rechtwinkligen Dreieck gilt: Die Summe der Kathetenquadrate ist gleich dem Hypotenusenquadrat.<br><span class="big-math">a² + b² = c²</span> (wenn der rechte Winkel bei C liegt)</div>' +
      '<p class="note">Achtung: Die Buchstaben können anders verteilt sein. Suche immer zuerst den rechten Winkel. Liegt er bei A, dann ist a die Hypotenuse und es gilt b² + c² = a².</p>' +
      '<h3>3. Seiten berechnen</h3><ul><li><b>Hypotenuse gesucht:</b> c = ' + sq('a² + b²') + '. Beispiel: c = ' + sq('6² + 8²') + ' = ' + sq('100') + ' = 10.</li><li><b>Kathete gesucht:</b> a = ' + sq('c² − b²') + '. Beispiel: a = ' + sq('13² − 12²') + ' = ' + sq('25') + ' = 5.</li></ul>' +
      '<p class="note"><b>Typische Fehler:</b> a + b statt a² + b² rechnen. Die Wurzel am Ende vergessen. Bei einer gesuchten Kathete addieren statt subtrahieren. Kontrolle: Die Hypotenuse muss die längste Seite sein.</p>' +
      '<h3>4. Die Umkehrung</h3><div class="merk"><b>Merke:</b> Gilt in einem Dreieck a² + b² = c², dann ist es rechtwinklig. Der rechte Winkel liegt gegenüber der längsten Seite c.</div><p>Beispiel: 5, 12, 13. Es ist 25 + 144 = 169 = 13². Das Dreieck ist rechtwinklig. Bei 5, 12, 14 ist 169 ≠ 196, also nicht rechtwinklig.</p>',
    entdecken: {
      html: '<p>Verändere die beiden Katheten a und b. Über jeder Seite ist ein Quadrat gezeichnet. Vergleiche die Flächeninhalte.</p><div class="ctl"><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="1" max="7" step="0.5" value="3"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="7" step="0.5" value="4"></label></div><div id="e_g"></div><p class="big-math" id="e_t"></p><p class="note">Stelle a = 3 und b = 4 ein, danach a = 6 und b = 4,5. Bei welchen Werten ist auch c eine „glatte“ Zahl?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value, c = Math.sqrt(a * a + b * b);
          root.querySelector('#v_a').textContent = cm(a); root.querySelector('#v_b').textContent = cm(b);
          root.querySelector('#e_g').innerHTML = squares(a, b, { labels: [f(a * a) + ' cm²', f(b * b) + ' cm²', f(a * a + b * b) + ' cm²'] });
          root.querySelector('#e_t').innerHTML = f(a * a) + ' cm² + ' + f(b * b) + ' cm² = ' + f(a * a + b * b) + ' cm², also c = ' + sq(f(a * a + b * b)) + (Number.isInteger(rd(c, 6)) ? ' = ' : ' ≈ ') + cm(rd(c, 2));
        }
        function step() { draw(); n++; if (n >= 3) done('Gut beobachtet: Die beiden Kathetenquadrate sind zusammen immer genau so groß wie das Hypotenusenquadrat: a² + b² = c².'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        draw();
      }
    },
    beispiel: { title: 'Kathete berechnen', q: 'Ein rechtwinkliges Dreieck hat die Hypotenuse c = 10 cm und die Kathete a = 7 cm. Berechne die Kathete b auf eine Stelle nach dem Komma.',
      steps: ['Gleichung aufstellen: a² + b² = c², also 7² + b² = 10².', 'Nach b² umstellen: b² = 10² − 7² = 100 − 49 = 51.', 'Wurzel ziehen: b = ' + sq('51') + ' ≈ 7,141 cm.', 'Runden: <b>b ≈ 7,1 cm</b>.', 'Kontrolle: b ist kürzer als die Hypotenuse 10 cm. Probe: 7² + 7,141² ≈ 49 + 51 = 100 = 10².' + rtSvg(rtTri(2, 7, Math.sqrt(51), 0), ['b ≈ 7,1 cm', 'a = 7 cm', 'c = 10 cm'])] },
    tasks: { gen: gen, plan: { G: ['benennen:1', 'quadrate:1', 'hypTripel:1', 'kathTripel:1'], S: ['benennen:1', 'gleichung:1', 'hypTripel:2', 'kathTripel:2', 'hypRund:2'], E: ['gleichung:1', 'hypTripel:2', 'kathTripel:2', 'hypRund:2', 'kathRund:3', 'umkehrung:2'] },
      extra: 'maurer', test: ['benennen:1', 'hypTripel:2', 'kathTripel:2', 'hypRund:2', 'kathRund:2', 'umkehrung:2'] },
    lerncheck: ['Ich finde in jedem rechtwinkligen Dreieck die Hypotenuse.', 'Ich berechne die Hypotenuse mit dem Satz des Pythagoras.', 'Ich berechne eine fehlende Kathete.', 'Ich prüfe mit der Umkehrung, ob ein Dreieck rechtwinklig ist.']
  };
})();
