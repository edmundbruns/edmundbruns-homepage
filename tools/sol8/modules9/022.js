/* Modul 022 (Klasse 9) · Pythagoras in Figuren und Körpern */
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
  function par(x) { return x < 0 ? '(' + f(x) + ')' : f(x); }
  function res(x, u) { u = u || 'cm'; return exact(x) ? '= <b>' + f(rd(x, 1)) + ' ' + u + '</b>' : '≈ ' + f(rd(x, 3)) + ' ' + u + ' ≈ <b>' + f(rd(x, 1)) + ' ' + u + '</b>'; }
  function numIn(label, x, u) { return { kind: 'num', label: label + (exact(x) ? ' =' : ' ≈'), unit: u || 'cm', answer: rd(x, 4), tol: exact(x) ? undefined : 0.05 }; }
  var TR = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20], [7, 24, 25], [20, 21, 29]];
  var RUND = 'Runde auf eine Stelle nach dem Komma.';
  /* Schrägbild (Kavalierperspektive: Tiefe unter 45°, auf die Hälfte verkürzt) */
  function P3(x, y, z) { var k = 0.5 * Math.SQRT1_2; return [x + y * k, z + y * k]; }
  function quader(a, b, c, o) {
    o = o || {}; var A = P3(0, 0, 0), B = P3(a, 0, 0), C = P3(a, b, 0), D = P3(0, b, 0), E = P3(0, 0, c), F = P3(a, 0, c), G = P3(a, b, c), H = P3(0, b, c);
    var hid = { color: '#7a8bb0', dash: '5 4', w: 1.3 };
    var it = [{ t: 'poly', p: [A, B, F, E], fill: C_FILL, w: 2 }, { t: 'poly', p: [B, C, G, F], fill: '#d7e2fa', w: 2 }, { t: 'poly', p: [E, F, G, H], fill: '#eef3fe', w: 2 },
      { t: 'seg', a: A, b: D, color: hid.color, dash: hid.dash, w: hid.w }, { t: 'seg', a: D, b: C, color: hid.color, dash: hid.dash, w: hid.w }, { t: 'seg', a: D, b: H, color: hid.color, dash: hid.dash, w: hid.w }];
    if (o.e) it.push({ t: 'seg', a: A, b: C, color: C_ACC, dash: '6 4', w: 2.2 });
    if (o.d) it.push({ t: 'seg', a: A, b: G, color: C_RED, w: 2.6 }, { t: 'rmark', v: C, a: A, b: G, color: C_RED, z: 9 });
    if (o.e && !o.d) it.push({ t: 'rmark', v: B, a: A, b: C, color: C_ACC, z: 8 });
    var cen = P3(a / 2, b / 2, c / 2);
    if (o.la) it.push({ t: 'side', a: A, b: B, ref: cen, s: o.la }); if (o.lb) it.push({ t: 'side', a: B, b: C, ref: cen, s: o.lb }); if (o.lc) it.push({ t: 'side', a: B, b: F, ref: E, s: o.lc });
    if (o.le) it.push({ t: 'text', p: mid(A, C), s: o.le, size: 12, bold: true, color: '#b45309', dy: 12 });
    if (o.ld) it.push({ t: 'text', p: [(2 * A[0] + 3 * G[0]) / 5, (2 * A[1] + 3 * G[1]) / 5], s: o.ld, size: 12, bold: true, color: C_RED, dx: 6, dy: 12 });
    if (o.names) [['A', A, [-1, -0.5]], ['B', B, [1, -0.5]], ['C', C, [1, -0.3]], ['D', D, [-0.8, 0.6]], ['E', E, [-1, 0.4]], ['F', F, [-0.3, 1]], ['G', G, [1, 0.5]], ['H', H, [-0.5, 1]]].forEach(function (q) { it.push({ t: 'pt', p: q[1], s: q[0], r: 2.5, color: C_LINE, lcolor: C_MUT, dir: q[2], off: 11 }); });
    return scene(it, { W: o.W || 340, H: o.H || 230, pad: 30, label: 'Schrägbild eines Quaders', maxw: o.maxw || 400, note: o.note });
  }
  function pyr(a, h, o) {
    o = o || {}; var A = P3(0, 0, 0), B = P3(a, 0, 0), C = P3(a, a, 0), D = P3(0, a, 0), S = P3(a / 2, a / 2, h), Mm = P3(a / 2, a / 2, 0), Ma = P3(a / 2, 0, 0);
    var hid = '#7a8bb0';
    var it = [{ t: 'poly', p: [A, B, S], fill: C_FILL, w: 2 }, { t: 'poly', p: [B, C, S], fill: '#d7e2fa', w: 2 }, { t: 'seg', a: A, b: D, color: hid, dash: '5 4', w: 1.3 }, { t: 'seg', a: D, b: C, color: hid, dash: '5 4', w: 1.3 }, { t: 'seg', a: D, b: S, color: hid, dash: '5 4', w: 1.3 },
      { t: 'seg', a: Mm, b: S, color: C_RED, dash: '6 4', w: 2.2 }, { t: 'seg', a: Mm, b: Ma, color: C_ACC, dash: '5 4', w: 1.8 }, { t: 'seg', a: Ma, b: S, color: C_ACC, w: 2.4 }, { t: 'rmark', v: Mm, a: Ma, b: S, color: C_RED, z: 8 }, { t: 'pt', p: Mm, r: 2.5, color: C_RED }];
    it.push({ t: 'side', a: A, b: B, ref: S, s: o.la || '' }, { t: 'text', p: mid(Ma, S), s: o.ls || '', size: 12, bold: true, color: '#b45309', dx: -38, fixed: true }, { t: 'text', p: mid(Mm, S), s: o.lh || '', size: 12, bold: true, color: C_RED, dx: 34, fixed: true });
    return scene(it, { W: 320, H: 240, pad: 28, label: 'Schrägbild einer quadratischen Pyramide', maxw: 380 });
  }

  var gen = {
    rechteckDiag: function (lvl) {
      var l, w; if (lvl === 1) { var t = M.pick(TR.slice(0, 5)); l = t[1]; w = t[0]; } else { do { l = M.rnd(4, 14); w = M.rnd(2, l - 1); } while (Number.isInteger(Math.sqrt(l * l + w * w))); }
      var d = Math.sqrt(l * l + w * w), R = [[0, 0], [l, 0], [l, w], [0, w]];
      var it = [{ t: 'poly', p: R }, { t: 'seg', a: R[0], b: R[2], color: C_ACC, w: 2.5 }, { t: 'rmark', v: R[1], a: R[0], b: R[2], z: 9 }, { t: 'side', a: R[0], b: R[1], ref: R[3], s: cm(l) }, { t: 'side', a: R[1], b: R[2], ref: R[0], s: cm(w) }, { t: 'text', p: mid(R[0], R[2]), s: 'd = ?', color: C_RED, bold: true, dx: -20, dy: -12, fixed: true }];
      return { skill: 'Diagonale im Rechteck', level: lvl, q: 'Ein Rechteck ist ' + cm(l) + ' lang und ' + cm(w) + ' breit. Berechne die Länge der Diagonale d.' + (exact(d) ? '' : ' ' + RUND) + scene(it, { W: 320, H: 200, pad: 28, label: 'Rechteck mit Diagonale', maxw: 380 }),
        inputs: [numIn('d', d)],
        hints: ['Die Diagonale teilt das Rechteck in zwei rechtwinklige Dreiecke. Die Diagonale ist die Hypotenuse.', 'd² = ' + f(l) + '² + ' + f(w) + '² = ' + f(l * l) + ' + ' + f(w * w) + ' = ' + f(l * l + w * w) + '.', 'd = ' + sq(f(l * l + w * w)) + '.'],
        solution: 'd² = ' + f(l) + '² + ' + f(w) + '² = ' + f(l * l + w * w) + ' ⇒ d = ' + sq(f(l * l + w * w)) + ' ' + res(d),
        mistakes: function (v) { if (isNum(v[0], l + w)) return 'Du hast die Seiten addiert. Rechne mit den Quadraten: d² = l² + b².'; if (isNum(v[0], l * l + w * w)) return 'Das ist d². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return near(dist(R[0], R[2]), d) ? true : 'falsch'; } };
    },
    quadratDiag: function (lvl) {
      var s = lvl === 3 ? null : M.rnd(2, 12), back = lvl === 3;
      if (back) { var dd = M.rnd(5, 20), ss = dd / Math.SQRT2; var Q = [[0, 0], [ss, 0], [ss, ss], [0, ss]];
        return { skill: 'Seite aus der Quadratdiagonale', level: 3, q: 'Die Diagonale eines Quadrats ist ' + cm(dd) + ' lang. Wie lang ist eine Seite? ' + RUND + scene([{ t: 'poly', p: Q }, { t: 'seg', a: Q[0], b: Q[2], color: C_ACC, w: 2.5 }, { t: 'rmark', v: Q[1], a: Q[0], b: Q[2], z: 9 }, { t: 'side', a: Q[0], b: Q[1], ref: Q[3], s: 's = ?' }, { t: 'side', a: Q[1], b: Q[2], ref: Q[0], s: 's' }, { t: 'text', p: mid(Q[0], Q[2]), s: 'd = ' + cm(dd), color: '#b45309', bold: true, dx: -30, dy: -12, fixed: true }], { W: 260, H: 200, pad: 28, label: 'Quadrat mit Diagonale', maxw: 300 }),
          inputs: [numIn('s', ss)],
          hints: ['Die Diagonale ist die Hypotenuse eines rechtwinkligen Dreiecks mit zwei gleich langen Katheten s.', 's² + s² = d², also 2 · s² = ' + f(dd) + '² = ' + f(dd * dd) + '.', 's² = ' + f(dd * dd) + ' : 2 = ' + f(dd * dd / 2) + ', s = ' + sq(f(dd * dd / 2)) + '.'],
          solution: '2s² = ' + f(dd * dd) + ' ⇒ s² = ' + f(dd * dd / 2) + ' ⇒ s = ' + sq(f(dd * dd / 2)) + ' ' + res(ss),
          mistakes: function (v) { if (isNum(v[0], dd / 2)) return 'Die Seite ist nicht die halbe Diagonale. Nutze s² + s² = d².'; return null; },
          verify: function () { return near(dist(Q[0], Q[2]), dd) ? true : 'falsch'; } };
      }
      var d = s * Math.SQRT2, Q2 = [[0, 0], [s, 0], [s, s], [0, s]];
      return { skill: 'Diagonale im Quadrat', level: lvl, q: 'Ein Quadrat hat die Seitenlänge ' + cm(s) + '. Berechne die Länge der Diagonale. ' + RUND + scene([{ t: 'poly', p: Q2 }, { t: 'seg', a: Q2[0], b: Q2[2], color: C_ACC, w: 2.5 }, { t: 'rmark', v: Q2[1], a: Q2[0], b: Q2[2], z: 9 }, { t: 'side', a: Q2[0], b: Q2[1], ref: Q2[3], s: cm(s) }, { t: 'text', p: mid(Q2[0], Q2[2]), s: 'd = ?', color: C_RED, bold: true, dx: -22, dy: -12, fixed: true }], { W: 260, H: 200, pad: 28, label: 'Quadrat mit Diagonale', maxw: 300 }),
        inputs: [numIn('d', d)],
        hints: ['Die Diagonale ist die Hypotenuse, beide Katheten sind ' + cm(s) + ' lang.', 'd² = ' + f(s) + '² + ' + f(s) + '² = ' + f(2 * s * s) + '.', 'd = ' + sq(f(2 * s * s)) + '.'],
        solution: 'd² = ' + f(s * s) + ' + ' + f(s * s) + ' = ' + f(2 * s * s) + ' ⇒ d = ' + sq(f(2 * s * s)) + ' ' + res(d) + '. (Merkregel: d = s · ' + sq('2') + ' ≈ s · 1,41)',
        mistakes: function (v) { if (isNum(v[0], 2 * s)) return 'Die Diagonale ist kürzer als zwei Seiten zusammen. Rechne d² = s² + s².'; if (isNum(v[0], 2 * s * s)) return 'Das ist d². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return near(dist(Q2[0], Q2[2]), d) ? true : 'falsch'; } };
    },
    gleichschenklig: function (lvl) {
      var g, s, h; if (lvl === 1 || Math.random() < 0.5) { var t = M.pick(TR.slice(0, 5)); g = 2 * t[0]; h = t[1]; s = t[2]; } else { do { g = 2 * M.rnd(2, 6); s = M.rnd(g / 2 + 2, 14); h = Math.sqrt(s * s - g * g / 4); } while (exact(h)); }
      var T = [[0, 0], [g, 0], [g / 2, h]], Mm = [g / 2, 0];
      var it = [{ t: 'poly', p: T }, { t: 'seg', a: Mm, b: T[2], color: C_ACC, dash: '6 4', w: 2 }, { t: 'rmark', v: Mm, a: T[1], b: T[2], z: 8 }, { t: 'side', a: T[0], b: T[1], ref: T[2], s: 'g = ' + cm(g) }, { t: 'side', a: T[0], b: T[2], ref: T[1], s: cm(s) }, { t: 'side', a: T[1], b: T[2], ref: T[0], s: cm(s) }, { t: 'text', p: [g / 2, h * 0.45], s: 'h = ?', color: C_RED, bold: true, dx: 22 }, { t: 'tick', a: T[0], b: T[2] }, { t: 'tick', a: T[1], b: T[2] }];
      return { skill: 'Höhe im gleichschenkligen Dreieck', level: lvl, q: 'Ein gleichschenkliges Dreieck hat die Basis g = ' + cm(g) + ' und zwei Schenkel von je ' + cm(s) + '. Berechne die Höhe h auf die Basis.' + (exact(h) ? '' : ' ' + RUND) + scene(it, { W: 300, H: 220, pad: 26, label: 'Gleichschenkliges Dreieck mit Höhe', maxw: 360 }),
        inputs: [numIn('h', h)],
        hints: ['Die Höhe teilt das Dreieck in zwei rechtwinklige Dreiecke. Die Basis wird dabei halbiert: ' + cm(g / 2) + '.', 'Im Teildreieck ist der Schenkel ' + cm(s) + ' die Hypotenuse: h² + ' + f(g / 2) + '² = ' + f(s) + '².', 'h² = ' + f(s * s) + ' − ' + f(g * g / 4) + ' = ' + f(h * h) + ', h = ' + sq(f(rd(h * h, 6))) + '.'],
        solution: 'Halbe Basis: ' + cm(g / 2) + '. h² = ' + f(s) + '² − ' + f(g / 2) + '² = ' + f(s * s) + ' − ' + f(g * g / 4) + ' = ' + f(rd(h * h, 6)) + ' ⇒ h = ' + sq(f(rd(h * h, 6))) + ' ' + res(h),
        mistakes: function (v) { if (s > g && isNum(v[0], Math.sqrt(s * s - g * g), 0.06)) return 'Du hast die ganze Basis genommen. Die Höhe halbiert die Basis, die Kathete ist also ' + cm(g / 2) + '.'; if (isNum(v[0], Math.sqrt(s * s + g * g / 4), 0.06)) return 'Der Schenkel ist die Hypotenuse. Die Höhe ist eine Kathete, also musst du subtrahieren.'; return null; },
        verify: function () { return near(dist(T[0], T[2]), s) && near(dist(Mm, T[2]), h) ? true : 'falsch'; } };
    },
    gleichseitig: function (lvl) {
      var a = M.rnd(2, 12), h = a * Math.sqrt(3) / 2, T = [[0, 0], [a, 0], [a / 2, h]], Mm = [a / 2, 0];
      var withA = lvl === 3;
      var it = [{ t: 'poly', p: T }, { t: 'seg', a: Mm, b: T[2], color: C_ACC, dash: '6 4', w: 2 }, { t: 'rmark', v: Mm, a: T[1], b: T[2], z: 8 }, { t: 'side', a: T[0], b: T[1], ref: T[2], s: cm(a) }, { t: 'side', a: T[0], b: T[2], ref: T[1], s: cm(a) }, { t: 'side', a: T[1], b: T[2], ref: T[0], s: cm(a) }, { t: 'text', p: [a / 2, h * 0.45], s: 'h = ?', color: C_RED, bold: true, dx: 22 }];
      return { skill: 'Höhe im gleichseitigen Dreieck', level: lvl, q: 'Berechne die Höhe h eines gleichseitigen Dreiecks mit der Seitenlänge ' + cm(a) + '.' + (withA ? ' Berechne danach auch den Flächeninhalt.' : '') + ' ' + RUND + scene(it, { W: 280, H: 220, pad: 26, label: 'Gleichseitiges Dreieck mit Höhe', maxw: 340 }),
        inputs: [numIn('h', h)].concat(withA ? [{ kind: 'num', label: 'Flächeninhalt ≈', unit: 'cm²', answer: rd(a * h / 2, 4), tol: 0.05 + a * 0.025 }] : []),
        hints: ['Die Höhe halbiert die Grundseite. Im rechtwinkligen Teildreieck ist ' + cm(a) + ' die Hypotenuse und ' + cm(a / 2) + ' eine Kathete.', 'h² = ' + f(a) + '² − ' + f(a / 2) + '² = ' + f(a * a) + ' − ' + f(a * a / 4) + ' = ' + f(a * a * 3 / 4) + '.', 'h = ' + sq(f(a * a * 3 / 4)) + '.' + (withA ? ' Flächeninhalt: A = ' + f(a) + ' · h : 2.' : '')],
        solution: 'h² = ' + f(a * a) + ' − ' + f(a * a / 4) + ' = ' + f(a * a * 3 / 4) + ' ⇒ h = ' + sq(f(a * a * 3 / 4)) + ' ' + res(h) + (withA ? '. A = ' + f(a) + ' · ' + f(rd(h, 3)) + ' : 2 ≈ <b>' + f(rd(a * h / 2, 1)) + ' cm²</b>' : '') + '.',
        mistakes: function (v) { if (isNum(v[0], Math.sqrt(a * a + a * a / 4), 0.06)) return 'Die Seite ' + cm(a) + ' ist die Hypotenuse. Die Höhe ist eine Kathete, also subtrahieren.'; if (isNum(v[0], a / 2)) return 'Das ist die halbe Seite. Gesucht ist die Höhe.'; return null; },
        verify: function () { return near(dist(Mm, T[2]), h) && near(dist(T[0], T[2]), a) ? true : 'falsch'; } };
    },
    abstand: function (lvl) {
      var P, Q, dx, dy; do { P = [M.rnd(-6, 5), M.rnd(-6, 5)]; Q = [M.rnd(-6, 6), M.rnd(-6, 6)]; dx = Q[0] - P[0]; dy = Q[1] - P[1]; } while (!dx || !dy || Math.abs(dx) < 2 || Math.abs(dy) < 2 || (lvl === 1 && !Number.isInteger(Math.hypot(dx, dy))));
      var d = Math.hypot(dx, dy), K = [Q[0], P[1]];
      var g = function (sol) { var it = [{ t: 'pt', p: P, s: 'P', dir: [-dx, -dy] }, { t: 'pt', p: Q, s: 'Q', dir: [dx, dy] }]; if (sol) it = [{ t: 'seg', a: P, b: K, color: C_ACC, w: 2 }, { t: 'seg', a: K, b: Q, color: C_ACC, w: 2 }, { t: 'seg', a: P, b: Q, color: C_HI, w: 2.5 }, { t: 'rmark', v: K, a: P, b: Q, z: 8 }, { t: 'side', a: P, b: K, ref: Q, s: f(Math.abs(dx)) }, { t: 'side', a: K, b: Q, ref: P, s: f(Math.abs(dy)) }].concat(it); return scene(it, { bounds: [-7.5, 7.5, -7.5, 7.5], grid: true, gridStep: 2, W: 330, H: 330, pad: 12, label: 'Koordinatensystem mit P und Q', maxw: 360 }); };
      return { skill: 'Abstand zweier Punkte', level: lvl, q: 'Berechne den Abstand der Punkte P' + pt(P) + ' und Q' + pt(Q) + ' (1 Kästchen = 1 cm).' + (Number.isInteger(d) ? '' : ' ' + RUND) + g(false),
        inputs: [numIn('PQ', d)],
        hints: ['Zeichne ein Steigungsdreieck: waagerecht von P bis unter (oder über) Q, dann senkrecht bis Q. PQ ist die Hypotenuse.', 'Waagerecht: |' + f(Q[0]) + ' − ' + par(P[0]) + '| = ' + f(Math.abs(dx)) + ', senkrecht: |' + f(Q[1]) + ' − ' + par(P[1]) + '| = ' + f(Math.abs(dy)) + '.', 'PQ² = ' + f(Math.abs(dx)) + '² + ' + f(Math.abs(dy)) + '² = ' + f(dx * dx + dy * dy) + '.'],
        solution: 'Katheten: ' + f(Math.abs(dx)) + ' und ' + f(Math.abs(dy)) + '. PQ = ' + sq(f(Math.abs(dx)) + '² + ' + f(Math.abs(dy)) + '²') + ' = ' + sq(f(dx * dx + dy * dy)) + ' ' + res(d) + g(true),
        mistakes: function (v) { if (isNum(v[0], Math.abs(dx) + Math.abs(dy))) return 'Das ist der Weg entlang der Kästchen. Die Luftlinie ist kürzer: Nutze den Satz des Pythagoras.'; if (isNum(v[0], dx * dx + dy * dy)) return 'Das ist PQ². Ziehe noch die Wurzel.'; return null; },
        verify: function () { return near(dist(P, Q), d) ? true : 'falsch'; } };
    },
    raute: function (lvl) {
      var t = M.pick(TR.slice(0, 6)), e = 2 * t[0], fd = 2 * t[1], s = t[2];
      var R = [[-fd / 2, 0], [0, -e / 2], [fd / 2, 0], [0, e / 2]];
      var it = [{ t: 'poly', p: R }, { t: 'seg', a: R[0], b: R[2], color: C_ACC, dash: '5 4', w: 1.8 }, { t: 'seg', a: R[1], b: R[3], color: C_ACC, dash: '5 4', w: 1.8 }, { t: 'rmark', v: [0, 0], a: R[2], b: R[3], z: 8 }, { t: 'side', a: R[2], b: R[3], ref: [0, 0], s: 's = ?' }, { t: 'text', p: [fd / 4, 0], s: 'f = ' + cm(fd), size: 11, bold: true, color: '#b45309', dy: 10 }, { t: 'text', p: [0, -e / 4], s: 'e = ' + cm(e), size: 11, bold: true, color: '#b45309', dx: -30 }];
      return { skill: 'Seite einer Raute', level: lvl, q: 'Die Diagonalen einer Raute sind e = ' + cm(e) + ' und f = ' + cm(fd) + ' lang. Sie stehen senkrecht aufeinander und halbieren sich. Berechne die Seitenlänge s.' + scene(it, { W: 320, H: 220, pad: 26, label: 'Raute mit Diagonalen', maxw: 380 }),
        inputs: [{ kind: 'num', label: 's =', unit: 'cm', answer: s }],
        hints: ['Die Diagonalen zerlegen die Raute in vier gleiche rechtwinklige Dreiecke. Die Seite s ist die Hypotenuse.', 'Die Katheten sind die halben Diagonalen: ' + cm(e / 2) + ' und ' + cm(fd / 2) + '.', 's² = ' + f(e / 2) + '² + ' + f(fd / 2) + '² = ' + f(s * s) + '.'],
        solution: 's² = ' + f(e / 2) + '² + ' + f(fd / 2) + '² = ' + f(e * e / 4) + ' + ' + f(fd * fd / 4) + ' = ' + f(s * s) + ' ⇒ s = <b>' + cm(s) + '</b>',
        mistakes: function (v) { if (isNum(v[0], Math.hypot(e, fd), 0.06)) return 'Du hast die ganzen Diagonalen genommen. Die Katheten sind die <b>halben</b> Diagonalen.'; return null; },
        verify: function () { return near(dist(R[2], R[3]), s) ? true : 'falsch'; } };
    },
    raumdiag: function (lvl) {
      var L = M.pick([[3, 4, 12], [2, 3, 6], [1, 4, 8], [4, 4, 7], [2, 6, 9], [6, 8, 5], [4, 5, 6], [3, 5, 4], [8, 6, 10], [5, 4, 3]]), a = L[0], b = L[1], c = L[2];
      if (Math.random() < 0.5) { a = M.rnd(2, 9); b = M.rnd(2, 7); c = M.rnd(2, 8); }
      var e = Math.hypot(a, b), d = Math.hypot(a, b, c);
      return { skill: 'Raumdiagonale im Quader', level: lvl, q: 'Ein Quader ist a = ' + cm(a) + ' lang, b = ' + cm(b) + ' tief und c = ' + cm(c) + ' hoch. Berechne zuerst die Diagonale e der Grundfläche und dann die Raumdiagonale d. Runde, wenn nötig, auf eine Stelle nach dem Komma.' + quader(a, b, c, { e: true, d: true, la: 'a = ' + cm(a), lb: 'b = ' + cm(b), lc: 'c = ' + cm(c), le: 'e', ld: 'd', note: 'Schrägbild, Tiefe verkürzt' }),
        inputs: [numIn('e', e), numIn('d', d)],
        hints: ['Die Grundfläche ist ein Rechteck: e² = a² + b² = ' + f(a * a) + ' + ' + f(b * b) + ' = ' + f(e * e) + '.', 'Die Raumdiagonale d ist die Hypotenuse im Dreieck aus e und der Höhe c. Der rechte Winkel liegt an der Ecke C.', 'd² = e² + c² = ' + f(e * e) + ' + ' + f(c * c) + ' = ' + f(d * d) + '. (Kurz: d² = a² + b² + c²)'],
        solution: 'e = ' + sq(f(a * a) + ' + ' + f(b * b)) + ' = ' + sq(f(e * e)) + ' ' + res(e) + '.<br>d = ' + sq('e² + c²') + ' = ' + sq(f(rd(e * e, 6)) + ' + ' + f(c * c)) + ' = ' + sq(f(rd(d * d, 6))) + ' ' + res(d) + '.<br>Rechne mit dem genauen Wert e² = ' + f(rd(e * e, 6)) + ' weiter, nicht mit dem gerundeten e.',
        mistakes: function (v) { if (isNum(v[1], Math.hypot(a, c), 0.06) || isNum(v[1], Math.hypot(b, c), 0.06)) return 'Bei d hast du nur zwei Kanten genommen. Die Raumdiagonale braucht die Flächendiagonale e und die Höhe c.'; if (isNum(v[1], a + b + c)) return 'Kanten addieren ergibt nicht die Diagonale. Nutze zweimal den Satz des Pythagoras.'; return null; },
        verify: function () { return near(Math.hypot(e, c), d) && near(d * d, a * a + b * b + c * c) ? true : 'falsch'; } };
    },
    pyramide: function (lvl) {
      var t = M.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [4, 3, 5]]), a = 2 * t[0], h = t[1], hs = t[2];
      return { skill: 'Höhe einer Pyramide', level: lvl, q: 'Eine quadratische Pyramide hat die Grundkante a = ' + cm(a) + '. Die Höhe einer Seitenfläche (Seitenhöhe) ist h<sub>s</sub> = ' + cm(hs) + '. Berechne die Höhe h der Pyramide.' + pyr(a, h, { la: 'a = ' + cm(a), ls: 'h<tspan baseline-shift="sub" font-size="9">s</tspan> = ' + cm(hs), lh: 'h = ?' }),
        inputs: [{ kind: 'num', label: 'h =', unit: 'cm', answer: h }],
        hints: ['Im Inneren steckt ein rechtwinkliges Dreieck: Höhe h, die halbe Grundkante und die Seitenhöhe h<sub>s</sub> als Hypotenuse.', 'Die waagerechte Kathete vom Mittelpunkt der Grundfläche bis zur Kantenmitte ist a : 2 = ' + cm(a / 2) + '.', 'h² = ' + f(hs) + '² − ' + f(a / 2) + '² = ' + f(hs * hs) + ' − ' + f(a * a / 4) + ' = ' + f(h * h) + '.'],
        solution: 'h² = h<sub>s</sub>² − (a : 2)² = ' + f(hs * hs) + ' − ' + f(a * a / 4) + ' = ' + f(h * h) + ' ⇒ h = <b>' + cm(h) + '</b>',
        mistakes: function (v) { if (hs > a && isNum(v[0], Math.sqrt(hs * hs - a * a), 0.06)) return 'Du hast die ganze Grundkante genommen. Vom Mittelpunkt bis zur Kante ist es nur a : 2 = ' + cm(a / 2) + '.'; if (isNum(v[0], Math.sqrt(hs * hs + a * a / 4), 0.06)) return 'h<sub>s</sub> ist die Hypotenuse. Die Höhe h ist eine Kathete, also subtrahieren.'; return null; },
        verify: function () { return near(h * h + a * a / 4, hs * hs) ? true : 'falsch'; } };
    },
    stab: function () {
      var a = M.pick([60, 80, 50, 70, 40]), b = M.pick([30, 40, 50]), c = M.pick([20, 30, 40, 50]), d = Math.hypot(a, b, c), e = Math.hypot(a, b), L = Math.round(d) + M.pick([-6, -4, -3, 3, 5, 8]), fits = L <= d;
      return { skill: 'Passt der Stab in den Karton? (Anwendung)', level: 3, q: 'Ein Karton ist innen ' + cm(a) + ' lang, ' + cm(b) + ' breit und ' + cm(c) + ' hoch. Passt ein ' + cm(L) + ' langer, dünner Stab (zum Beispiel ein Billardqueue-Teil) hinein, ohne dass er übersteht?<br>a) Berechne die längste Strecke im Karton. ' + RUND + ' b) Entscheide.' + quader(a, b, c, { e: true, d: true, la: cm(a), lb: cm(b), lc: cm(c), le: 'e', ld: 'd', note: 'Schrägbild, Tiefe verkürzt' }),
        inputs: [numIn('a) längste Strecke', d), { kind: 'mc', label: 'b) Passt der Stab?', options: ['Ja, der Stab passt hinein.', 'Nein, der Stab ist zu lang.'], answer: fits ? 0 : 1 }],
        hints: ['Die längste Strecke im Quader ist die Raumdiagonale, nicht die Diagonale des Bodens.', 'Boden: e² = ' + f(a) + '² + ' + f(b) + '² = ' + f(e * e) + '. Dann d² = e² + ' + f(c) + '².', 'd² = ' + f(a * a) + ' + ' + f(b * b) + ' + ' + f(c * c) + ' = ' + f(d * d) + '. Vergleiche d mit ' + cm(L) + '.'],
        solution: 'd = ' + sq(f(a) + '² + ' + f(b) + '² + ' + f(c) + '²') + ' = ' + sq(f(d * d)) + ' ' + res(d) + '. ' + (fits ? 'Der Stab (' + cm(L) + ') ist kürzer: Er <b>passt</b> schräg hinein.' : 'Der Stab (' + cm(L) + ') ist länger: Er <b>passt nicht</b>.') + ' Die Bodendiagonale wäre nur ' + f(rd(e, 1)) + ' cm lang.',
        mistakes: function (v) { if (isNum(v[0], e, 0.06)) return 'Das ist nur die Diagonale des Bodens. Schräg nach oben ist noch mehr Platz: Berechne die Raumdiagonale.'; return null; },
        verify: function () { return near(d * d, a * a + b * b + c * c) && (L <= d) === fits ? true : 'falsch'; } };
    }
  };

  return {
    id: '022', title: 'Pythagoras in Figuren und Körpern', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Satz des Pythagoras, Quadratwurzeln, Koordinatensystem, Quader und Pyramide',
    lead: 'In fast jeder Figur versteckt sich ein rechtwinkliges Dreieck. Du lernst, es zu finden, und berechnest damit Diagonalen, Höhen, Abstände und sogar Strecken im Raum.',
    einstieg: { html: '<p>Im Sportunterricht liegt eine Weichbodenmatte (2 m × 3 m) in der Halle. Ali läuft quer über die Matte von einer Ecke zur gegenüberliegenden Ecke. Und in der Turnhalle steht ein Geräteraum, ein großer Quader. Wie lang darf eine Stange höchstens sein, damit sie gerade noch hineinpasst?</p><p class="note">Wo steckt in diesen Situationen ein rechtwinkliges Dreieck? Welche Seite ist jeweils die Hypotenuse?</p><p>In diesem Modul lernst du, rechtwinklige Dreiecke in Rechtecken, Quadraten, gleichschenkligen Dreiecken, im Koordinatensystem und in Körpern zu entdecken. Dann hilft dir wieder der Satz des Pythagoras.</p>' },
    ziele: ['Ich berechne Diagonalen in Rechtecken und Quadraten.', 'Ich berechne Höhen in gleichschenkligen und gleichseitigen Dreiecken.', 'Ich berechne den Abstand zweier Punkte im Koordinatensystem.', 'Ich berechne die Raumdiagonale eines Quaders mit zwei rechtwinkligen Dreiecken.', 'Ich berechne die Höhe einer quadratischen Pyramide.'],
    fachwoerter: [['Diagonale', 'Verbindungsstrecke zweier Ecken, die nicht nebeneinander liegen.'], ['Flächendiagonale', 'Diagonale in einer Seitenfläche eines Körpers.'], ['Raumdiagonale', 'Strecke von einer Ecke eines Quaders durch das Innere zur gegenüberliegenden Ecke.'], ['Stützdreieck', 'Ein rechtwinkliges Dreieck, das du in eine Figur einzeichnest, um den Satz des Pythagoras zu nutzen.'], ['Seitenhöhe h_s', 'Höhe einer dreieckigen Seitenfläche einer Pyramide.']],
    diagnose: [
      { q: 'Ein rechtwinkliges Dreieck hat die Katheten 6 cm und 8 cm. Wie lang ist die Hypotenuse?', options: ['10 cm', '14 cm', '100 cm', 'Weiß ich noch nicht'], answer: 0, why: '6² + 8² = 36 + 64 = 100, √100 = 10.', review: 'Satz des Pythagoras' },
      { q: 'Welche Kathete fehlt? Hypotenuse 13 cm, Kathete 5 cm.', options: ['12 cm', '8 cm', '13,9 cm', 'Weiß ich noch nicht'], answer: 0, why: '13² − 5² = 169 − 25 = 144, √144 = 12.', review: 'Kathete berechnen' },
      { q: 'Wie viele Ecken hat ein Quader?', options: ['8', '6', '12', 'Weiß ich noch nicht'], answer: 0, why: 'Ein Quader hat 8 Ecken, 12 Kanten und 6 Flächen.', review: 'Körper (Klasse 5 bis 8)' },
      { q: 'Wie weit ist es von x = −3 bis x = 4 auf der x-Achse?', options: ['7', '1', '−7', 'Weiß ich noch nicht'], answer: 0, why: '4 − (−3) = 7.', review: 'Rechnen mit negativen Zahlen' }],
    erklaerung:
      '<h3>1. Das versteckte Dreieck finden</h3><p>Der Satz des Pythagoras hilft nur in rechtwinkligen Dreiecken. In vielen Figuren musst du so ein Dreieck erst entdecken oder einzeichnen. Frage dich immer: Wo ist der rechte Winkel? Welche Strecke liegt ihm gegenüber (Hypotenuse)?</p>' +
      '<h3>2. Diagonalen in Rechteck und Quadrat</h3><div class="merk"><b>Merke:</b> Rechteck mit den Seiten l und b: <span class="big-math">d = ' + sq('l² + b²') + '</span><br>Quadrat mit der Seite s: <span class="big-math">d = ' + sq('s² + s²') + ' = s · ' + sq('2') + ' ≈ s · 1,41</span></div>' +
      '<h3>3. Höhen in Dreiecken</h3><p>In gleichschenkligen und gleichseitigen Dreiecken halbiert die Höhe die Grundseite. Es entstehen zwei rechtwinklige Dreiecke. Der Schenkel ist die Hypotenuse, die Höhe eine Kathete:</p><p class="big-math">h² = s² − (g : 2)²</p><p>Beispiel gleichschenklig: g = 6 cm, s = 5 cm. h² = 25 − 9 = 16, also h = 4 cm.</p>' +
      '<h3>4. Abstand zweier Punkte</h3><p>Zeichne zwischen P und Q ein Steigungsdreieck. Die Katheten sind der Unterschied der x-Werte und der Unterschied der y-Werte. Der Abstand PQ ist die Hypotenuse.</p>' +
      '<h3>5. Raumdiagonale im Quader</h3><p>Im Quader brauchst du den Satz zweimal: Erst die Diagonale e der Grundfläche, dann die Raumdiagonale d im Dreieck aus e und der Höhe c (rechter Winkel bei C).</p>' + quader(4, 3, 2.5, { e: true, d: true, la: 'a', lb: 'b', lc: 'c', le: 'e', ld: 'd', names: true, note: 'Schrägbild, Tiefe verkürzt' }) +
      '<div class="merk"><b>Merke:</b> <span class="big-math">e² = a² + b²</span> und <span class="big-math">d² = e² + c² = a² + b² + c²</span></div>' +
      '<h3>6. Höhe einer quadratischen Pyramide</h3><p>Das Stützdreieck besteht aus der Höhe h, der halben Grundkante a : 2 und der Seitenhöhe h<sub>s</sub> (Hypotenuse): <span class="big-math">h² = h<sub>s</sub>² − (a : 2)²</span></p>' + pyr(6, 4, { la: 'a = 6 cm', ls: 'h<tspan baseline-shift="sub" font-size="9">s</tspan> = 5 cm', lh: 'h = 4 cm' }) +
      '<p class="note"><b>Tipp:</b> Runde erst ganz am Ende. Rechne mit e² weiter, nicht mit dem gerundeten e.</p>',
    entdecken: {
      html: '<p>Verändere Länge, Tiefe und Höhe des Quaders. Beobachte die Bodendiagonale e und die Raumdiagonale d.</p><div class="ctl"><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="2" max="9" step="1" value="4"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="7" step="1" value="3"></label><label>c = <b id="v_c"></b> <input type="range" id="r_c" min="1" max="8" step="1" value="2"></label></div><div id="e_g"></div><p id="e_t"></p><p class="note">Stelle a = 4, b = 3 und c = 12 ein. Was fällt dir auf? Findest du noch einen Quader mit ganzzahliger Raumdiagonale (zum Beispiel 2, 3, 6)?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value, c = +root.querySelector('#r_c').value, e = Math.hypot(a, b), d = Math.hypot(a, b, c);
          root.querySelector('#v_a').textContent = cm(a); root.querySelector('#v_b').textContent = cm(b); root.querySelector('#v_c').textContent = cm(c);
          root.querySelector('#e_g').innerHTML = quader(a, b, c, { e: true, d: true, la: cm(a), lb: cm(b), lc: cm(c), le: 'e', ld: 'd', note: 'Schrägbild, Tiefe verkürzt' });
          root.querySelector('#e_t').innerHTML = 'e = ' + sq(f(a) + '² + ' + f(b) + '²') + ' = ' + sq(f(e * e)) + (exact(e) ? ' = ' : ' ≈ ') + cm(rd(e, 2)) + '<br>d = ' + sq('e² + ' + f(c) + '²') + ' = ' + sq(f(rd(e * e, 6)) + ' + ' + f(c * c)) + ' = ' + sq(f(rd(d * d, 6))) + (exact(d) ? ' = ' : ' ≈ ') + '<b>' + cm(rd(d, 2)) + '</b>';
        }
        function step() { draw(); n++; if (n >= 3) done('Gut erkundet: Die Raumdiagonale ist immer länger als jede Kante und jede Flächendiagonale. Es gilt d² = a² + b² + c².'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        draw();
      }
    },
    beispiel: { title: 'Höhe im gleichschenkligen Dreieck', q: 'Ein Giebel hat die Form eines gleichschenkligen Dreiecks: Basis 8 m, Schenkel je 5 m. Wie hoch ist der Giebel?',
      steps: ['Höhe einzeichnen: Sie halbiert die Basis. Es entstehen zwei rechtwinklige Dreiecke mit der Kathete 8 m : 2 = 4 m.', 'Hypotenuse finden: Der Schenkel (5 m) liegt dem rechten Winkel gegenüber.', 'Gleichung: h² + 4² = 5², also h² = 25 − 16 = 9.', 'Wurzel ziehen: <b>h = 3 m</b>.', 'Kontrolle: 3² + 4² = 9 + 16 = 25 = 5². Die Höhe ist kürzer als der Schenkel, das passt.' + scene([{ t: 'poly', p: [[0, 0], [8, 0], [4, 3]] }, { t: 'seg', a: [4, 0], b: [4, 3], color: C_ACC, dash: '6 4', w: 2 }, { t: 'rmark', v: [4, 0], a: [8, 0], b: [4, 3], z: 8 }, { t: 'side', a: [0, 0], b: [8, 0], ref: [4, 3], s: '8 m' }, { t: 'side', a: [0, 0], b: [4, 3], ref: [8, 0], s: '5 m' }, { t: 'side', a: [8, 0], b: [4, 3], ref: [0, 0], s: '5 m' }, { t: 'text', p: [4, 1.4], s: 'h = 3 m', dx: 30, bold: true, color: '#b45309' }], { W: 300, H: 170, pad: 26, label: 'Giebel als gleichschenkliges Dreieck', maxw: 360 })] },
    tasks: { gen: gen, plan: { G: ['rechteckDiag:1', 'quadratDiag:1', 'gleichschenklig:1', 'abstand:1'], S: ['rechteckDiag:2', 'quadratDiag:2', 'gleichschenklig:2', 'abstand:2', 'raute:2'], E: ['rechteckDiag:2', 'gleichseitig:3', 'abstand:2', 'raumdiag:3', 'pyramide:3', 'quadratDiag:3'] },
      extra: 'stab', test: ['rechteckDiag:2', 'gleichschenklig:2', 'gleichseitig:2', 'abstand:2', 'raumdiag:3', 'pyramide:2'] },
    lerncheck: ['Ich finde in Figuren und Körpern rechtwinklige Dreiecke.', 'Ich berechne Diagonalen und Höhen in ebenen Figuren.', 'Ich berechne den Abstand zweier Punkte im Koordinatensystem.', 'Ich berechne die Raumdiagonale eines Quaders und die Höhe einer Pyramide.']
  };
})();
