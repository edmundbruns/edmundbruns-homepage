/* Modul 023 (Klasse 9) · Pythagoras im Alltag */
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
  function exact(x) { return Math.abs(x - Math.round(x * 10) / 10) < 1e-9; }
  function res(x, u, dec) { dec = dec == null ? 1 : dec; return Math.abs(x - rd(x, dec)) < 1e-9 ? '= <b>' + f(rd(x, dec)) + ' ' + u + '</b>' : '≈ ' + f(rd(x, dec + 2)) + ' ' + u + ' ≈ <b>' + f(rd(x, dec)) + ' ' + u + '</b>'; }
  function numIn(label, x, u, tol) { var ex = exact(x); return { kind: 'num', label: label + (ex ? ' =' : ' ≈'), unit: u, answer: rd(x, 4), tol: ex && !tol ? undefined : (tol || 0.05) }; }
  var RUND = 'Runde auf eine Stelle nach dem Komma.';
  function m(x) { return f(x) + ' m'; }
  function ladderSvg(L, d, o) {
    o = o || {}; var h = Math.sqrt(L * L - d * d), W0 = [0, 0], F = [d, 0], T = [0, h];
    var it = [{ t: 'poly', p: [[-0.35, -0.12], [0, -0.12], [0, h * 1.12], [-0.35, h * 1.12]], fill: '#e2e8f0', color: '#94a3b8', w: 1 }, { t: 'seg', a: [-0.35, 0], b: [d + 0.8, 0], color: '#64748b', w: 2 }, { t: 'seg', a: F, b: T, color: '#b45309', w: 5 }, { t: 'rmark', v: W0, a: F, b: T, z: 9 },
      { t: 'side', a: W0, b: F, ref: T, s: o.ld || m(d) }, { t: 'text', p: [-0.35, h / 2], s: o.lh || 'h = ?', size: 12, bold: true, anchor: 'end', dx: -4, color: (o.lh || '?').indexOf('?') >= 0 ? C_RED : C_TXT, fixed: true }, { t: 'side', a: F, b: T, ref: W0, s: o.lL || m(L) }, { t: 'text', p: [-0.18, h * 1.05], s: 'Wand', size: 10, color: C_MUT, anchor: 'end', dx: -4, fixed: true }];
    return scene(it, { W: o.W || 280, H: o.H || 230, pad: 30, label: 'Leiter an einer Wand', maxw: 340 });
  }

  var gen = {
    leiter: function (lvl) {
      var L = M.pick([3, 3.5, 4, 4.5, 5, 6, 7, 8]), d = rd(L * M.pick([0.2, 0.25, 0.3, 0.35]), 1);
      var h = Math.sqrt(L * L - d * d);
      if (lvl === 1) return { skill: 'Leiter an der Wand: Höhe', level: 1, q: 'Eine ' + m(L) + ' lange Leiter lehnt an einer Hauswand. Ihr Fuß steht ' + m(d) + ' von der Wand entfernt. In welcher Höhe berührt die Leiter die Wand? ' + RUND + ladderSvg(L, d),
        inputs: [numIn('Höhe h', h, 'm')],
        hints: ['Wand und Boden bilden einen rechten Winkel. Die Leiter liegt ihm gegenüber, sie ist die Hypotenuse.', 'h² = ' + f(L) + '² − ' + f(d) + '² = ' + f(L * L) + ' − ' + f(rd(d * d, 4)) + ' = ' + f(rd(h * h, 4)) + '.', 'h = ' + sq(f(rd(h * h, 4))) + '. Runde auf eine Nachkommastelle.'],
        solution: 'h² = ' + f(L * L) + ' − ' + f(rd(d * d, 4)) + ' = ' + f(rd(h * h, 4)) + ' ⇒ h = ' + sq(f(rd(h * h, 4))) + ' ' + res(h, 'm'),
        mistakes: function (v) { if (isNum(v[0], Math.sqrt(L * L + d * d), 0.06)) return 'Die Leiter ist die Hypotenuse. Die Höhe ist eine Kathete, also musst du subtrahieren: h² = L² − d².'; if (isNum(v[0], L - d)) return 'Rechne mit den Quadraten: h² = L² − d², dann die Wurzel.'; return null; },
        verify: function () { return near(h * h + d * d, L * L) ? true : 'falsch'; } };
      var hh = M.pick([2.5, 3, 3.5, 4, 4.5, 5, 6]), dd = rd(hh * M.pick([0.25, 0.3, 0.35]), 1), LL = Math.sqrt(hh * hh + dd * dd);
      return { skill: 'Leiter an der Wand: Länge', level: lvl, q: 'Ein Fenster liegt ' + m(hh) + ' hoch. Eine Leiter soll genau bis dort reichen. Aus Sicherheitsgründen soll ihr Fuß ' + m(dd) + ' von der Wand entfernt stehen. Wie lang muss die Leiter mindestens sein? ' + RUND + ladderSvg(LL, dd, { lh: m(hh), lL: 'L = ?' }),
        inputs: [numIn('Länge L', LL, 'm')],
        hints: ['Die Leiter ist die Hypotenuse, Höhe und Abstand sind die Katheten.', 'L² = ' + f(hh) + '² + ' + f(dd) + '² = ' + f(hh * hh) + ' + ' + f(rd(dd * dd, 4)) + '.', 'L = ' + sq(f(rd(LL * LL, 4))) + '. Weil die Leiter mindestens so lang sein muss, rundet man im Alltag eher auf. Hier: normal runden.'],
        solution: 'L² = ' + f(hh * hh) + ' + ' + f(rd(dd * dd, 4)) + ' = ' + f(rd(LL * LL, 4)) + ' ⇒ L = ' + sq(f(rd(LL * LL, 4))) + ' ' + res(LL, 'm'),
        mistakes: function (v) { if (isNum(v[0], hh + dd)) return 'Du hast die Längen addiert. Rechne L² = h² + d² und ziehe die Wurzel.'; if (isNum(v[0], Math.sqrt(hh * hh - dd * dd), 0.06)) return 'Die Leiter ist die längste Seite, also die Hypotenuse. Hier wird addiert.'; return null; },
        verify: function () { return near(LL * LL, hh * hh + dd * dd) ? true : 'falsch'; } };
    },
    bildschirm: function (lvl) {
      var n = M.pick([24, 32, 40, 43, 50, 55, 65]), dd = n * 2.54, k = Math.sqrt(337), w = rd(dd * 16 / k, 1), h = rd(dd * 9 / k, 1), d = Math.hypot(w, h);
      var R = [[0, 0], [w, 0], [w, h], [0, h]];
      var pic = scene([{ t: 'poly', p: [[-2, -2], [w + 2, -2], [w + 2, h + 2], [-2, h + 2]], fill: '#1f2937', color: '#111827', w: 1 }, { t: 'poly', p: R, fill: '#dbeafe', color: '#93c5fd', w: 1 }, { t: 'seg', a: R[0], b: R[2], color: C_ACC, w: 2.5, dash: '6 4' }, { t: 'rmark', v: R[1], a: R[0], b: R[2], color: C_ACC, z: 9 },
        { t: 'side', a: [-2, -2], b: [w + 2, -2], ref: [0, h], s: 'Bildbreite ' + cm(w) }, { t: 'side', a: [w + 2, -2], b: [w + 2, h + 2], ref: [0, 0], s: cm(h) }, { t: 'text', p: mid(R[0], R[2]), s: 'Diagonale', size: 11, bold: true, color: '#b45309', dx: -26, dy: -10, fixed: true }], { W: 340, H: 210, pad: 28, label: 'Bildschirm mit Diagonale', maxw: 400 });
      return { skill: 'Bildschirmdiagonale in Zoll', level: lvl, q: 'Fernseher werden nach ihrer Bilddiagonale in Zoll verkauft (1 Zoll = 2,54 cm). Das Bild eines Fernsehers ist ' + cm(w) + ' breit und ' + cm(h) + ' hoch.<br>a) Berechne die Bilddiagonale in cm. ' + RUND + ' b) Wie viel Zoll hat der Fernseher? Runde auf ganze Zoll.' + pic,
        inputs: [numIn('a) Diagonale', d, 'cm'), { kind: 'num', label: 'b) Diagonale ≈', unit: 'Zoll', answer: rd(d / 2.54, 4), tol: 0.5 }],
        hints: ['Breite und Höhe sind die Katheten, die Diagonale ist die Hypotenuse.', 'd² = ' + f(w) + '² + ' + f(h) + '² = ' + f(rd(w * w, 2)) + ' + ' + f(rd(h * h, 2)) + ' = ' + f(rd(d * d, 2)) + '.', 'd ≈ ' + f(rd(d, 1)) + ' cm. In Zoll: ' + f(rd(d, 1)) + ' : 2,54.'],
        solution: 'd = ' + sq(f(w) + '² + ' + f(h) + '²') + ' = ' + sq(f(rd(d * d, 2))) + ' ' + res(d, 'cm') + '. In Zoll: ' + f(rd(d, 1)) + ' : 2,54 ≈ ' + f(rd(d / 2.54, 2)) + ', also ein <b>' + n + '-Zoll-Fernseher</b>.',
        mistakes: function (v) { if (isNum(v[0], w + h, 0.06)) return 'Du hast Breite und Höhe addiert. Die Diagonale berechnest du mit dem Satz des Pythagoras.'; if (isNum(v[1], d * 2.54, 0.6)) return 'Bei b) musst du durch 2,54 teilen, denn ein Zoll ist 2,54 cm lang. Die Zahl wird also kleiner.'; return null; },
        verify: function () { return Math.abs(d / 2.54 - n) < 0.5 && near(d * d, w * w + h * h) ? true : 'Zoll passt nicht'; } };
    },
    rampe: function (lvl) {
      var hc = M.pick([18, 24, 30, 36, 42, 48]), l = M.pick([5, 6, 7.5, 8, 10, 12]), lc = l * 100, r = Math.hypot(hc, lc), st = hc / lc * 100;
      var pic = scene([{ t: 'poly', p: [[0, 0], [10, 0], [10, 2.2]], fill: '#e5e7eb', color: '#475569' }, { t: 'rmark', v: [10, 0], a: [0, 0], b: [10, 2.2], z: 9 }, { t: 'side', a: [0, 0], b: [10, 0], ref: [10, 2.2], s: 'waagerecht ' + m(l) }, { t: 'side', a: [10, 0], b: [10, 2.2], ref: [0, 0], s: cm(hc) }, { t: 'side', a: [0, 0], b: [10, 2.2], ref: [10, 0], s: 'Rampe = ?', color: C_RED }], { W: 340, H: 150, pad: 26, note: 'Skizze nicht maßstabsgetreu (Höhe übertrieben)', label: 'Rampe von der Seite', maxw: 400 });
      return { skill: 'Länge einer Rampe', level: lvl, q: 'Vor einem Eingang soll eine Rampe für Rollstühle gebaut werden. Sie muss eine Höhe von ' + cm(hc) + ' überwinden und ist waagerecht gemessen ' + m(l) + ' lang.<br>a) Wie lang ist die schräge Rampenfläche? Rechne in cm und runde auf ganze cm. b) Wie groß ist die Steigung in Prozent (Höhe : waagerechte Länge · 100 %)? ' + RUND + pic,
        inputs: [{ kind: 'num', label: 'a) Rampenlänge ≈', unit: 'cm', answer: rd(r, 4), tol: 0.5 }, numIn('b) Steigung', st, '%')],
        hints: ['Rechne zuerst alles in cm um: ' + m(l) + ' = ' + cm(lc) + '.', 'Rampe² = ' + f(lc) + '² + ' + f(hc) + '² = ' + f(lc * lc) + ' + ' + f(hc * hc) + ' = ' + f(lc * lc + hc * hc) + '.', 'Steigung = ' + f(hc) + ' : ' + f(lc) + ' · 100 %.'],
        solution: 'a) Rampe = ' + sq(f(lc) + '² + ' + f(hc) + '²') + ' = ' + sq(f(lc * lc + hc * hc)) + ' ≈ ' + f(rd(r, 2)) + ' cm ≈ <b>' + cm(Math.round(r)) + '</b>. Die schräge Länge ist nur wenig länger als die waagerechte. b) ' + f(hc) + ' : ' + f(lc) + ' · 100 % ' + res(st, '%') + (st <= 6 ? '. Das erfüllt die Regel für Rollstuhlrampen (höchstens 6 %).' : '. Das ist steiler als die empfohlenen 6 %.'),
        mistakes: function (v) { if (isNum(v[0], Math.hypot(hc, l), 0.6) || isNum(v[0], Math.hypot(hc / 100, l), 0.1)) return 'Achte auf die Einheiten: Rechne die waagerechte Länge zuerst in cm um.'; if (isNum(v[0], lc + hc)) return 'Du hast addiert. Nutze den Satz des Pythagoras.'; return null; },
        verify: function () { return near(r * r, hc * hc + lc * lc) ? true : 'falsch'; } };
    },
    wiese: function (lvl) {
      var a, b; if (lvl === 1) { var t = M.pick([[30, 40], [60, 80], [24, 45], [36, 48], [20, 48], [45, 60]]); a = t[1]; b = t[0]; } else { do { a = 5 * M.rnd(6, 20); b = 5 * M.rnd(4, 14); } while (b >= a || Number.isInteger(Math.hypot(a, b))); }
      var d = Math.hypot(a, b), s = a + b - d, R = [[0, 0], [a, 0], [a, b], [0, b]];
      var pic = scene([{ t: 'poly', p: R, fill: '#dcfce7', color: '#15803d' }, { t: 'seg', a: R[0], b: R[1], color: C_HI, w: 4 }, { t: 'seg', a: R[1], b: R[2], color: C_HI, w: 4 }, { t: 'seg', a: R[0], b: R[2], color: C_ACC, w: 3, dash: '7 5' }, { t: 'rmark', v: R[1], a: R[0], b: R[2], z: 9 }, { t: 'side', a: R[0], b: R[1], ref: R[3], s: m(a) }, { t: 'side', a: R[1], b: R[2], ref: R[0], s: m(b) }, { t: 'pt', p: R[0], s: 'Start', dir: [-1, -0.4], color: C_LINE }, { t: 'pt', p: R[2], s: 'Ziel', dir: [1, 0.4], color: C_LINE }, { t: 'text', p: mid(R[0], R[2]), s: 'Abkürzung', size: 11, bold: true, color: '#b45309', dx: -28, dy: -10, fixed: true }], { W: 340, H: 210, pad: 30, label: 'Rechteckige Wiese mit Weg und Abkürzung', maxw: 400 });
      return { skill: 'Abkürzung über die Wiese', level: lvl, q: 'Ein Weg führt um eine rechteckige Wiese herum: ' + m(a) + ' geradeaus, dann ' + m(b) + ' rechtwinklig abbiegen. Viele laufen schräg über die Wiese.<br>a) Wie lang ist die Abkürzung? b) Wie viele Meter spart man?' + (exact(d) ? '' : ' ' + RUND) + pic,
        inputs: [numIn('a) Abkürzung', d, 'm'), { kind: 'num', label: 'b) Ersparnis' + (exact(d) ? ' =' : ' ≈'), unit: 'm', answer: rd(s, 4), tol: exact(d) ? undefined : 0.06 }],
        hints: ['Die beiden Wegstücke sind die Katheten, die Abkürzung ist die Hypotenuse.', 'd² = ' + f(a) + '² + ' + f(b) + '² = ' + f(a * a) + ' + ' + f(b * b) + ' = ' + f(a * a + b * b) + '.', 'Ersparnis = (' + f(a) + ' m + ' + f(b) + ' m) − d.'],
        solution: 'a) d = ' + sq(f(a * a + b * b)) + ' ' + res(d, 'm') + '. b) Weg außen herum: ' + m(a + b) + '. Ersparnis: ' + f(a + b) + ' m − ' + f(rd(d, exact(d) ? 1 : 2)) + ' m ' + res(s, 'm') + '.',
        mistakes: function (v) { if (isNum(v[0], a + b)) return 'Das ist der Weg außen herum. Die Abkürzung ist die Hypotenuse.'; if (isNum(v[1], d, 0.06)) return 'Bei b) ist die Ersparnis gefragt, also der Unterschied zwischen Umweg und Abkürzung.'; return null; },
        verify: function () { return near(dist(R[0], R[2]), d) && s > 0 ? true : 'falsch'; } };
    },
    drachen: function (lvl) {
      var t = M.pick([[30, 40, 50], [36, 48, 60], [24, 45, 51], [18, 80, 82], [40, 75, 85], [28, 45, 53]]), dd = t[0], h = t[1], L = t[2], hand = 1.5, withHand = lvl >= 2;
      if (lvl === 3 || Math.random() < 0.3) { L = M.pick([50, 60, 70, 80]); dd = M.pick([20, 25, 30, 35]); h = Math.sqrt(L * L - dd * dd); }
      var H = withHand ? h + hand : h;
      var it = [{ t: 'seg', a: [-3, 0], b: [dd + 5, 0], color: '#15803d', w: 2 }, { t: 'seg', a: [0, 0], b: [0, hand], color: C_LINE, w: 3 }, { t: 'seg', a: [0, hand], b: [dd, hand], color: C_MUT, dash: '4 3', w: 1.3 }, { t: 'seg', a: [dd, 0], b: [dd, h + hand], color: C_MUT, dash: '4 3', w: 1.3 },
        { t: 'seg', a: [0, hand], b: [dd, h + hand], color: '#b45309', w: 2 }, { t: 'poly', p: [[dd, h + hand + 2.5], [dd + 1.8, h + hand], [dd, h + hand - 3], [dd - 1.8, h + hand]], fill: '#fde68a', color: C_ACC, w: 1.5 }, { t: 'rmark', v: [dd, hand], a: [0, hand], b: [dd, h + hand], z: 9 },
        { t: 'side', a: [0, hand], b: [dd, hand], ref: [0, h], s: m(dd) }, { t: 'side', a: [0, hand], b: [dd, h + hand], ref: [dd, 0], s: 'Schnur ' + m(L) }, { t: 'text', p: [dd, (h + hand) / 2], s: 'Höhe = ?', color: C_RED, bold: true, dx: 34, fixed: true }];
      if (withHand) it.push({ t: 'side', a: [0, 0], b: [0, hand], ref: [5, 0], s: m(hand), size: 10 });
      return { skill: 'Höhe eines Drachens', level: lvl, q: 'Lina lässt einen Drachen steigen. Die Schnur ist ' + m(L) + ' lang und straff gespannt. Der Drachen steht genau über einem Punkt, der waagerecht ' + m(dd) + ' von Linas Hand entfernt ist.' + (withHand ? ' Linas Hand ist ' + m(hand) + ' über dem Boden.' : '') + ' Wie hoch fliegt der Drachen ' + (withHand ? 'über dem Boden' : 'über Linas Hand') + '?' + (exact(H) ? '' : ' ' + RUND) + scene(it, { W: 300, H: 240, pad: 26, label: 'Drachen an gespannter Schnur', maxw: 360 }),
        inputs: [numIn('Höhe', H, 'm')],
        hints: ['Die Schnur ist die Hypotenuse, der waagerechte Abstand und die Höhe über der Hand sind die Katheten.', 'h² = ' + f(L) + '² − ' + f(dd) + '² = ' + f(L * L) + ' − ' + f(dd * dd) + ' = ' + f(rd(h * h, 4)) + '.', 'h = ' + sq(f(rd(h * h, 4))) + (withHand ? '. Addiere dann noch die Handhöhe ' + m(hand) + '.' : '.')],
        solution: 'h = ' + sq(f(L) + '² − ' + f(dd) + '²') + ' = ' + sq(f(rd(h * h, 4))) + ' ' + res(h, 'm') + (withHand ? '. Über dem Boden: ' + f(rd(h, 2)) + ' m + ' + m(hand) + ' ' + res(H, 'm') : '') + '.',
        mistakes: function (v) { if (withHand && isNum(v[0], h, 0.06)) return 'Das ist die Höhe über Linas Hand. Gefragt ist die Höhe über dem Boden: Addiere ' + m(hand) + '.'; if (isNum(v[0], Math.sqrt(L * L + dd * dd) + (withHand ? hand : 0), 0.06)) return 'Die Schnur ist die Hypotenuse. Die Höhe ist eine Kathete, also subtrahieren.'; return null; },
        verify: function () { return near(h * h + dd * dd, L * L) ? true : 'falsch'; } };
    },
    navi: function (lvl) {
      var x1 = M.rnd(2, 6), y = M.rnd(2, 6), x2 = lvl === 3 ? M.rnd(1, 4) : 0, X = x1 + x2, d = Math.hypot(X, y);
      var pts = lvl === 3 ? [[0, 0], [x1, 0], [x1, y], [X, y]] : [[0, 0], [x1, 0], [x1, y]], E = pts[pts.length - 1];
      var it = [];
      for (var i = 0; i < pts.length - 1; i++) it.push({ t: 'seg', a: pts[i], b: pts[i + 1], color: C_HI, w: 3 });
      it.push({ t: 'seg', a: [0, 0], b: E, color: C_ACC, w: 2.5, dash: '7 5' }, { t: 'pt', p: [0, 0], s: 'Hafen', dir: [-1, -0.5], color: C_LINE }, { t: 'pt', p: E, s: 'Ziel', dir: [1, 0.5], color: C_LINE }, { t: 'text', p: [-0.6, 7.2], s: 'N ↑', size: 12, bold: true, color: C_MUT, fixed: true });
      if (lvl === 3) it.push({ t: 'seg', a: [x1, 0], b: [X, 0], color: C_MUT, dash: '3 3', w: 1.2 }, { t: 'seg', a: [X, 0], b: E, color: C_MUT, dash: '3 3', w: 1.2 }, { t: 'rmark', v: [X, 0], a: [0, 0], b: E, z: 8, color: C_ACC });
      else it.push({ t: 'rmark', v: [x1, 0], a: [0, 0], b: E, z: 8 });
      var desc = 'fährt zuerst ' + x1 + ' km nach Osten und dann ' + y + ' km nach Norden' + (lvl === 3 ? ', danach noch ' + x2 + ' km nach Osten' : '');
      return { skill: 'Luftlinie bei Wegen (Navigation)', level: lvl, q: 'Ein Boot ' + desc + '. Wie weit ist es jetzt in Luftlinie vom Hafen entfernt (1 Kästchen = 1 km)?' + (Number.isInteger(d) ? '' : ' ' + RUND) + scene(it, { bounds: [-1.5, 10.5, -1, 7.5], grid: true, axes: false, W: 330, H: 250, pad: 10, label: 'Fahrtweg des Boots auf Karopapier', maxw: 380 }),
        inputs: [numIn('Luftlinie', d, 'km')],
        hints: [lvl === 3 ? 'Fasse die Fahrten nach Osten zusammen: ' + x1 + ' km + ' + x2 + ' km = ' + X + ' km.' : 'Die Fahrt nach Osten und die Fahrt nach Norden bilden einen rechten Winkel.', 'Die Luftlinie ist die Hypotenuse mit den Katheten ' + X + ' km und ' + y + ' km.', 'd² = ' + X + '² + ' + y + '² = ' + (X * X + y * y) + '.'],
        solution: (lvl === 3 ? 'Nach Osten insgesamt ' + X + ' km, nach Norden ' + y + ' km. ' : '') + 'd = ' + sq(X + '² + ' + y + '²') + ' = ' + sq(X * X + y * y) + ' ' + res(d, 'km'),
        mistakes: function (v) { if (isNum(v[0], X + y)) return 'Das ist der gefahrene Weg. Die Luftlinie ist kürzer: Nutze den Satz des Pythagoras.'; if (lvl === 3 && isNum(v[0], Math.hypot(x1, y), 0.06)) return 'Du hast die letzte Fahrt nach Osten vergessen. Fasse alle Ost-Strecken zusammen.'; return null; },
        verify: function () { return near(dist([0, 0], E), d) ? true : 'falsch'; } };
    },
    schrank: function () {
      var t = M.pick([50, 60, 65, 40, 45]), h = M.pick([200, 210, 220, 230]), d = Math.hypot(t, h), H = M.pick([240, 250, 260].filter(function (x) { return x >= h + 15; })), fits = d <= H;
      if (Math.abs(d - H) < 1) H += 10;
      fits = d < H;
      var it = [{ t: 'seg', a: [-20, 0], b: [h + 60, 0], color: '#64748b', w: 2 }, { t: 'seg', a: [-20, H], b: [h + 60, H], color: '#64748b', w: 2, dash: '8 4' }, { t: 'poly', p: [[0, 0], [h, 0], [h, t], [0, t]], fill: '#f5e1c8', color: '#92400e' }, { t: 'seg', a: [0, 0], b: [h, t], color: C_RED, w: 2, dash: '6 4' }, { t: 'rmark', v: [h, 0], a: [0, 0], b: [h, t], z: 8 },
        { t: 'side', a: [0, 0], b: [h, 0], ref: [0, t], s: cm(h) }, { t: 'side', a: [h, 0], b: [h, t], ref: [0, 0], s: cm(t) }, { t: 'text', p: [h * 0.5, H], s: 'Decke: Raumhöhe ' + cm(H), size: 11, color: C_MUT, dy: -9, fixed: true }, { t: 'text', p: [h * 0.45, t * 0.5], s: 'd', size: 12, bold: true, color: C_RED, dy: -12, fixed: true }];
      return { skill: 'Schrank aufrichten (Anwendung)', level: 3, q: 'Ein Schrank ist ' + cm(h) + ' hoch und ' + cm(t) + ' tief. Er liegt auf der Rückwand am Boden und soll im Zimmer aufgerichtet werden. Das Zimmer ist ' + cm(H) + ' hoch. Beim Aufrichten dreht sich der Schrank um eine untere Kante.<br>a) Welche Strecke muss beim Kippen unter die Decke passen? Berechne sie und runde auf ganze cm. b) Passt der Schrank beim Aufrichten unter die Decke?' + scene(it, { W: 340, H: 230, pad: 24, label: 'Liegender Schrank im Zimmer', maxw: 400 }),
        inputs: [{ kind: 'num', label: 'a) Diagonale ≈', unit: 'cm', answer: rd(d, 4), tol: 0.5 }, { kind: 'mc', label: 'b) Entscheide', options: ['Ja, er passt.', 'Nein, er stößt an die Decke.'], answer: fits ? 0 : 1 }],
        hints: ['Beim Kippen ragt die Diagonale der Seitenfläche am höchsten auf (wenn sie senkrecht steht).', 'd² = ' + f(h) + '² + ' + f(t) + '² = ' + f(h * h) + ' + ' + f(t * t) + ' = ' + f(h * h + t * t) + '.', 'd ≈ ' + f(rd(d, 1)) + ' cm. Vergleiche mit der Raumhöhe ' + cm(H) + '.'],
        solution: 'd = ' + sq(f(h * h + t * t)) + ' ≈ ' + f(rd(d, 2)) + ' cm ≈ <b>' + cm(Math.round(d)) + '</b>. ' + (fits ? 'Das ist weniger als ' + cm(H) + ': Der Schrank <b>passt</b>.' : 'Das ist mehr als ' + cm(H) + ': Der Schrank <b>stößt an die Decke</b>, obwohl er selbst nur ' + cm(h) + ' hoch ist.'),
        mistakes: function (v) { if (isNum(v[0], h)) return 'Die Höhe allein reicht nicht. Beim Kippen steht kurz die Diagonale senkrecht.'; return null; },
        verify: function () { return near(d * d, h * h + t * t) && (d < H) === fits ? true : 'falsch'; } };
    },
    dach: function (lvl) {
      var b = M.pick([8, 9, 10, 11, 12]), hd = M.pick([3, 3.5, 4, 4.5, 5]), s = Math.hypot(b / 2, hd);
      var it = [{ t: 'poly', p: [[0, 0], [b, 0], [b, -3.2], [0, -3.2]], fill: '#f1f5f9', color: '#64748b', w: 2 }, { t: 'poly', p: [[0, 0], [b, 0], [b / 2, hd]], fill: '#fee2e2', color: '#991b1b' }, { t: 'seg', a: [b / 2, 0], b: [b / 2, hd], color: C_ACC, dash: '6 4', w: 2 }, { t: 'rmark', v: [b / 2, 0], a: [b, 0], b: [b / 2, hd], z: 8 },
        { t: 'side', a: [0, -3.2], b: [b, -3.2], ref: [b / 2, 0], s: 'Hausbreite ' + m(b) }, { t: 'text', p: [b / 2, hd / 2], s: m(hd), size: 12, bold: true, dx: 24, fixed: true }, { t: 'side', a: [0, 0], b: [b / 2, hd], ref: [b, 0], s: 'Sparren = ?', color: C_RED }];
      return { skill: 'Länge eines Dachsparrens', level: lvl, q: 'Ein Haus mit Satteldach ist ' + m(b) + ' breit. Der First liegt ' + m(hd) + ' über dem Dachboden, genau in der Mitte. Wie lang ist ein Dachsparren vom Dachboden bis zum First (ohne Überstand)? ' + RUND + scene(it, { W: 300, H: 220, pad: 26, label: 'Haus mit Satteldach von vorne', maxw: 360 }),
        inputs: [numIn('Sparrenlänge', s, 'm')],
        hints: ['Die Firsthöhe teilt den Giebel in zwei rechtwinklige Dreiecke. Die waagerechte Kathete ist die halbe Hausbreite: ' + m(b / 2) + '.', 's² = ' + f(b / 2) + '² + ' + f(hd) + '² = ' + f(b * b / 4) + ' + ' + f(hd * hd) + '.', 's = ' + sq(f(rd(s * s, 4))) + '.'],
        solution: 's² = ' + f(b / 2) + '² + ' + f(hd) + '² = ' + f(rd(s * s, 4)) + ' ⇒ s = ' + sq(f(rd(s * s, 4))) + ' ' + res(s, 'm'),
        mistakes: function (v) { if (isNum(v[0], Math.hypot(b, hd), 0.06)) return 'Du hast die ganze Hausbreite genommen. Der Sparren reicht nur bis zur Mitte: Nimm ' + m(b / 2) + '.'; return null; },
        verify: function () { return near(dist([0, 0], [b / 2, hd]), s) ? true : 'falsch'; } };
    },
    sicht: function () {
      var h = M.pick([20, 30, 45, 60, 80, 100]), R = 6370, hk = h / 1000, s = Math.sqrt((R + hk) * (R + hk) - R * R);
      var it = [{ t: 'circle', c: [0, 0], r: 5, color: C_LINE, fill: '#dbeafe', w: 2 }, { t: 'seg', a: [0, 0], b: [0, 6.6], color: C_LINE, w: 1.6, dash: '5 4' }, { t: 'seg', a: [0, 0], b: [3.263, 3.788], color: C_LINE, w: 1.6, dash: '5 4' }, { t: 'seg', a: [0, 6.6], b: [3.263, 3.788], color: C_ACC, w: 2.5 }, { t: 'seg', a: [0, 5], b: [0, 6.6], color: '#991b1b', w: 4 }, { t: 'rmark', v: [3.263, 3.788], a: [0, 0], b: [0, 6.6], z: 9 },
        { t: 'pt', p: [0, 0], s: 'M', color: C_LINE, dir: [-1, -0.3], r: 3 }, { t: 'text', p: [0, 2.6], s: 'R', size: 12, bold: true, dx: -10, fixed: true }, { t: 'text', p: [1.63, 1.89], s: 'R', size: 12, bold: true, dx: 10, dy: 6, fixed: true }, { t: 'text', p: [0, 5.8], s: 'h', size: 12, bold: true, color: '#991b1b', dx: -10, fixed: true }, { t: 'text', p: [1.63, 5.19], s: 's = ?', size: 12, bold: true, color: C_RED, dx: 18, dy: -8, fixed: true }];
      return { skill: 'Sichtweite vom Leuchtturm (Anwendung)', level: 3, q: 'Von der Spitze eines Leuchtturms schaust du ' + m(h) + ' über dem Meer aufs Wasser. Wegen der Erdkrümmung kannst du nur bis zum Horizont sehen. Dort trifft dein Sehstrahl die Erdoberfläche genau so, dass er senkrecht zum Erdradius steht. Der Erdradius ist R = 6370 km. Wie weit kannst du sehen (Strecke s)? Runde auf eine Stelle nach dem Komma.' + scene(it, { W: 300, H: 260, pad: 16, note: 'Skizze nicht maßstabsgetreu', label: 'Erde, Leuchtturm und Sehstrahl', maxw: 340 }),
        inputs: [numIn('s', s, 'km')],
        hints: ['Im rechtwinkligen Dreieck ist R + h die Hypotenuse (vom Erdmittelpunkt bis zu deinem Auge). R und s sind die Katheten.', 'Rechne h in km um: ' + m(h) + ' = ' + f(hk) + ' km. Dann s² = (6370 + ' + f(hk) + ')² − 6370².', 's² = ' + f(rd((R + hk) * (R + hk), 4)) + ' − ' + f(R * R) + ' = ' + f(rd(s * s, 4)) + '. Ziehe die Wurzel.'],
        solution: 's² = (R + h)² − R² = ' + f(R + hk) + '² − 6370² = ' + f(rd(s * s, 4)) + ' ⇒ s = ' + sq(f(rd(s * s, 4))) + ' ' + res(s, 'km') + '. Erstaunlich: Schon aus ' + m(h) + ' Höhe siehst du so weit.',
        mistakes: function (v) { if (isNum(v[0], Math.sqrt((R + h) * (R + h) - R * R), 0.5)) return 'Achte auf die Einheiten: Rechne die Höhe in km um, bevor du sie zu R addierst.'; return null; },
        verify: function () { return near(s * s + R * R, (R + hk) * (R + hk)) ? true : 'falsch'; } };
    }
  };

  return {
    id: '023', title: 'Pythagoras im Alltag', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Satz des Pythagoras, Kathete und Hypotenuse berechnen, Einheiten umrechnen, Runden',
    lead: 'Wie hoch reicht eine Leiter? Wie groß ist ein 55-Zoll-Fernseher? Wie viel spart die Abkürzung über die Wiese? Du nutzt den Satz des Pythagoras in echten Situationen.',
    einstieg: { html: '<p>Beim Fensterputzen lehnt Herr Kaya eine 4 m lange Leiter an die Hauswand. Steht der Fuß zu nah an der Wand, kippt die Leiter nach hinten. Steht er zu weit weg, rutscht sie weg. Als Faustregel gilt: Der Abstand zur Wand soll etwa ein Viertel der Leiterlänge sein.</p><p class="note">Wie hoch reicht die Leiter dann? Reicht sie bis zum Fenster im ersten Stock in 3,8 m Höhe?</p><p>In diesem Modul übersetzt du Alltagssituationen in rechtwinklige Dreiecke: Leitern, Bildschirme, Rampen, Wege, Drachen und Fahrten. Dabei gilt immer: Skizze machen, rechten Winkel finden, Hypotenuse bestimmen, rechnen, sinnvoll runden.</p>' },
    ziele: ['Ich erkenne in Sachsituationen rechtwinklige Dreiecke und fertige eine Skizze an.', 'Ich entscheide, ob die Hypotenuse oder eine Kathete gesucht ist.', 'Ich rechne Einheiten vorher passend um (zum Beispiel m in cm oder Zoll in cm).', 'Ich runde Ergebnisse sinnvoll.', 'Ich beantworte die Frage mit einem Antwortsatz und prüfe, ob das Ergebnis realistisch ist.'],
    fachwoerter: [['Sachsituation', 'Eine Aufgabe aus dem Alltag, die du in Mathematik übersetzt.'], ['Skizze', 'Eine einfache Zeichnung mit den gegebenen und gesuchten Größen. Sie muss nicht maßstabsgetreu sein.'], ['Zoll', 'Längenmaß für Bildschirmdiagonalen: 1 Zoll = 2,54 cm (Zeichen: ″).'], ['Luftlinie', 'Die kürzeste, gerade Entfernung zwischen zwei Orten.'], ['Steigung in Prozent', 'Höhenunterschied : waagerechte Länge · 100 %.']],
    diagnose: [
      { q: 'Eine Kathete ist 6 cm, die Hypotenuse 10 cm lang. Wie lang ist die andere Kathete?', options: ['8 cm', '11,7 cm', '4 cm', 'Weiß ich noch nicht'], answer: 0, why: '10² − 6² = 100 − 36 = 64, √64 = 8.', review: 'Satz des Pythagoras' },
      { q: 'Wie viele Zentimeter sind 3,5 m?', options: ['350 cm', '35 cm', '3500 cm', 'Weiß ich noch nicht'], answer: 0, why: '1 m = 100 cm, also 3,5 · 100 cm = 350 cm.', review: 'Längeneinheiten umrechnen' },
      { q: 'Runde 12,46 auf eine Stelle nach dem Komma.', options: ['12,5', '12,4', '12,46', 'Weiß ich noch nicht'], answer: 0, why: 'Die zweite Nachkommastelle ist 6, also wird aufgerundet.', review: 'Runden' },
      { q: 'Welche Seite ist im rechtwinkligen Dreieck immer am längsten?', options: ['die Hypotenuse', 'die kürzere Kathete', 'die längere Kathete', 'Weiß ich noch nicht'], answer: 0, why: 'Die Hypotenuse liegt dem größten Winkel (90°) gegenüber.', review: 'Hypotenuse und Katheten' }],
    erklaerung:
      '<h3>1. Vom Text zum Dreieck</h3><ol><li><b>Skizze</b> zeichnen und alle gegebenen Längen eintragen.</li><li><b>Rechten Winkel</b> suchen: Wand und Boden, Breite und Höhe, Osten und Norden, …</li><li><b>Hypotenuse</b> bestimmen: Sie liegt dem rechten Winkel gegenüber (Leiter, Diagonale, Schnur, Luftlinie).</li><li><b>Einheiten</b> angleichen.</li><li><b>Rechnen:</b> Hypotenuse gesucht: addieren. Kathete gesucht: subtrahieren. Dann Wurzel ziehen.</li><li><b>Runden</b> und mit einem Antwortsatz antworten. Prüfen: Ist das Ergebnis realistisch?</li></ol>' +
      '<h3>2. Beispiel Leiter</h3>' + ladderSvg(4, 1, { lh: 'h = ?' }) + '<p>Die Leiter ist die Hypotenuse. h² = 4² − 1² = 16 − 1 = 15, also h = ' + sq('15') + ' ≈ 3,87 m. Die Leiter reicht knapp über das Fenster in 3,8 m Höhe.</p>' +
      '<div class="merk"><b>Merke:</b> Gesucht ist die <b>Hypotenuse</b>: <span class="big-math">c = ' + sq('a² + b²') + '</span><br>Gesucht ist eine <b>Kathete</b>: <span class="big-math">a = ' + sq('c² − b²') + '</span></div>' +
      '<h3>3. Typische Alltagssituationen</h3><ul><li><b>Bildschirme:</b> Breite und Höhe sind Katheten, die Diagonale wird in Zoll angegeben (1 Zoll = 2,54 cm).</li><li><b>Wege:</b> Der Weg um die Ecke besteht aus den Katheten, die Abkürzung ist die Hypotenuse.</li><li><b>Navigation:</b> Fahrten nach Osten und Norden stehen senkrecht. Gleiche Richtungen fasst du vorher zusammen.</li><li><b>Rampen und Dächer:</b> Die schräge Fläche ist die Hypotenuse.</li></ul>' +
      '<p class="note"><b>Typische Fehler:</b> Einheiten nicht umgerechnet (m und cm gemischt). Mit gerundeten Zwischenergebnissen weitergerechnet. Bei einer Kathete addiert statt subtrahiert. Die Wurzel vergessen.</p>',
    entdecken: {
      html: '<p>Wähle eine Leiterlänge und verschiebe den Fuß der Leiter. Wie hoch reicht sie? Ist sie sicher aufgestellt? Faustregel: Der Abstand zur Wand soll etwa ein Viertel der Leiterlänge sein.</p><div class="ctl"><label>Leiter <select id="s_L"><option value="4">4 m</option><option value="5">5 m</option><option value="6">6 m</option><option value="3">3 m</option></select></label><label>Abstand = <b id="v_d"></b> <input type="range" id="r_d" min="0.25" max="2.5" step="0.25" value="0.5"></label></div><div id="e_g"></div><p id="e_t"></p><p class="note">Was passiert mit der Höhe, wenn du den Fuß weiter von der Wand wegstellst? Ändert sich die Höhe gleichmäßig?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var L = +root.querySelector('#s_L').value, d = +root.querySelector('#r_d').value, h = Math.sqrt(L * L - d * d), q = d / L;
          root.querySelector('#v_d').textContent = m(d);
          root.querySelector('#e_g').innerHTML = scene([{ t: 'poly', p: [[-0.35, -0.12], [0, -0.12], [0, 6.4], [-0.35, 6.4]], fill: '#e2e8f0', color: '#94a3b8', w: 1 }, { t: 'seg', a: [-0.35, 0], b: [3.2, 0], color: '#64748b', w: 2 }, { t: 'seg', a: [d, 0], b: [0, h], color: '#b45309', w: 5 }, { t: 'rmark', v: [0, 0], a: [d, 0], b: [0, h], z: 9 }, { t: 'side', a: [0, 0], b: [d, 0], ref: [0, h], s: m(d) }, { t: 'text', p: [0, h], s: 'h ≈ ' + m(rd(h, 2)), size: 12, bold: true, dx: 10, anchor: 'start', fixed: true }], { bounds: [-0.6, 3.4, -0.6, 6.5], W: 240, H: 300, pad: 8, label: 'Leiter an der Wand', maxw: 260 });
          var st = q < 0.2 ? '<b style="color:#b91c1c">Zu steil: Die Leiter kann nach hinten kippen.</b>' : q > 0.32 ? '<b style="color:#b91c1c">Zu flach: Der Fuß kann wegrutschen.</b>' : '<b style="color:#0f766e">Sicher aufgestellt.</b>';
          root.querySelector('#e_t').innerHTML = 'h = ' + sq(f(L) + '² − ' + f(d) + '²') + ' = ' + sq(f(rd(L * L - d * d, 4))) + ' ≈ <b>' + m(rd(h, 2)) + '</b>. Abstand : Länge = ' + f(rd(q, 2)) + '. ' + st;
        }
        function step() { draw(); n++; if (n >= 3) done('Gut beobachtet: Je weiter der Fuß von der Wand steht, desto niedriger reicht die Leiter. Am Anfang verliert sie dabei kaum Höhe, später immer mehr. Sicher ist ein Abstand von etwa einem Viertel der Leiterlänge.'); }
        root.querySelector('#r_d').addEventListener('input', step); root.querySelector('#s_L').addEventListener('change', step);
        draw();
      }
    },
    beispiel: { title: 'Fernseher in Zoll', q: 'Ein Fernseher hat ein Bild von 110,7 cm Breite und 62,3 cm Höhe. Wie viel Zoll hat er?',
      steps: ['Rechter Winkel: Breite und Höhe stehen senkrecht. Die Diagonale ist die Hypotenuse.', 'd² = 110,7² + 62,3² = 12 254,49 + 3 881,29 = 16 135,78.', 'd = ' + sq('16 135,78') + ' ≈ 127,0 cm.', 'Umrechnen in Zoll: 127,0 : 2,54 ≈ 50. Antwort: Es ist ein <b>50-Zoll-Fernseher</b>.', 'Kontrolle: Die Diagonale (127 cm) ist länger als die Breite (110,7 cm), aber kürzer als Breite und Höhe zusammen. Das passt.'] },
    tasks: { gen: gen, plan: { G: ['leiter:1', 'wiese:1', 'drachen:1', 'bildschirm:2'], S: ['leiter:1', 'leiter:2', 'bildschirm:2', 'wiese:2', 'rampe:2'], E: ['leiter:2', 'bildschirm:2', 'rampe:2', 'navi:3', 'schrank:3', 'dach:2'] },
      extra: 'sicht', test: ['leiter:2', 'bildschirm:2', 'wiese:2', 'schrank:3', 'drachen:2', 'navi:2'] },
    lerncheck: ['Ich übersetze Alltagssituationen in rechtwinklige Dreiecke.', 'Ich entscheide, ob die Hypotenuse oder eine Kathete gesucht ist.', 'Ich achte auf Einheiten und runde sinnvoll.', 'Ich prüfe, ob mein Ergebnis realistisch ist.']
  };
})();
