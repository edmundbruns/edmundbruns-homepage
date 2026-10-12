/* Modul 020 (Klasse 9) · Strahlensätze */
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
  /* ---------- Hilfen für Strahlensatzfiguren ---------- */
  function near(a, b) { return Math.abs(a - b) < 1e-6; }
  function isNum(v, x) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < 1e-6; }
  function nice(x) { return Math.abs(x * 2 - Math.round(x * 2)) < 1e-9 && x > 0; }
  function dir(w) { return [Math.cos(w * D2R), Math.sin(w * D2R)]; }
  function mul(u, s) { return [u[0] * s, u[1] * s]; }
  /* V-Figur: SA = a, AB = b, SC = c, AC = e; Winkel bei S zwischen 25° und 60° */
  function mkV(o) {
    o = o || {};
    for (var t = 0; t < 4000; t++) {
      var a = M.rnd(2, 6), b = M.rnd(1, 6), k = (a + b) / a, c = M.rnd(4, 16) / 2;
      if (o.notK2 && near(k, 2)) continue;
      if (o.minB && (b < o.minB || a < 3)) continue;
      if (!nice(c * k) || Math.abs(c - a) < 0.6) continue;
      var es = []; for (var e2 = 3; e2 <= 16; e2++) { var e = e2 / 2, co = (a * a + c * c - e * e) / (2 * a * c); if (co >= 0.5 && co <= 0.9 && nice(e * k)) es.push(e); }
      if (!es.length) continue;
      var ee = M.pick(es), phi = Math.acos((a * a + c * c - ee * ee) / (2 * a * c)) / D2R;
      var w0 = M.rnd(-12, 4), u1 = dir(w0), u2 = dir(w0 + phi);
      return { a: a, b: b, c: c, e: ee, k: k, S: [0, 0], A: mul(u1, a), B: mul(u1, a + b), C: mul(u2, c), D: mul(u2, c * k), SB: a + b, SD: c * k, CD: c * k - c, BD: ee * k };
    }
  }
  /* X-Figur: A, C auf der einen Seite von S, B, D auf der anderen; SB = m · SA */
  function mkX() {
    for (var t = 0; t < 4000; t++) {
      var a = M.rnd(4, 12) / 2, m = M.pick([1.5, 2, 2.5, 0.5, 3]), c = M.rnd(4, 14) / 2;
      if (!nice(a * m) || !nice(c * m) || Math.abs(a - c) < 0.6 || a * m < 2 || c * m < 2) continue;
      var es = []; for (var e2 = 3; e2 <= 16; e2++) { var e = e2 / 2, co = (a * a + c * c - e * e) / (2 * a * c); if (co >= 0.5 && co <= 0.9 && nice(e * m)) es.push(e); }
      if (!es.length) continue;
      var ee = M.pick(es), phi = Math.acos((a * a + c * c - ee * ee) / (2 * a * c)) / D2R, w0 = M.rnd(-20, 0), u1 = dir(w0), u2 = dir(w0 + phi);
      return { a: a, c: c, e: ee, m: m, S: [0, 0], A: mul(u1, a), C: mul(u2, c), B: mul(u1, -a * m), D: mul(u2, -c * m), SB: a * m, SD: c * m, BD: ee * m };
    }
  }
  function figV(F, L, o) {
    o = o || {};
    var ext = function (P) { return [P[0] * 1.12, P[1] * 1.12]; };
    var it = [{ t: 'seg', a: F.S, b: ext(F.B), color: C_LINE, w: 2 }, { t: 'seg', a: F.S, b: ext(F.D), color: C_LINE, w: 2 }, { t: 'seg', a: F.A, b: F.C, color: C_HI, w: 3 }, { t: 'seg', a: F.B, b: F.D, color: C_HI, w: 3 }];
    var lab = function (key, a, b, ref, inside) { if (L[key]) it.push({ t: 'side', a: a, b: b, ref: ref, s: L[key], color: o.hl === key ? C_ACC : undefined }); };
    lab('SA', F.S, F.A, F.C); lab('AB', F.A, F.B, F.C); lab('SC', F.S, F.C, F.A); lab('CD', F.C, F.D, F.A);
    lab('AC', F.A, F.C, mid(F.B, F.D)); lab('BD', F.B, F.D, F.S);
    [['S', F.S, [-1, 0]], ['A', F.A, null], ['B', F.B, null], ['C', F.C, null], ['D', F.D, null]].forEach(function (q) {
      var d = q[2]; if (!d) { var other = q[0] === 'A' || q[0] === 'B' ? F.C : F.A, u = [q[1][0] - F.S[0], q[1][1] - F.S[1]], n = [-u[1], u[0]]; if (n[0] * (other[0] - q[1][0]) + n[1] * (other[1] - q[1][1]) > 0) n = [-n[0], -n[1]]; d = [n[0] * 0.6 + u[0] * 0.15, n[1] * 0.6 + u[1] * 0.15]; }
      it.push({ t: 'pt', p: q[1], s: q[0], color: q[0] === 'S' ? C_ACC : C_LINE, dir: d, r: 3.5 });
    });
    return scene(it, { W: 360, H: 240, pad: 30, label: o.label || 'Strahlensatzfigur (V-Figur), AC parallel zu BD', maxw: 440 });
  }
  function figX(F, L) {
    var it = [{ t: 'seg', a: mul(F.A, 1.15), b: mul(F.B, 1.12), color: C_LINE, w: 2 }, { t: 'seg', a: mul(F.C, 1.15), b: mul(F.D, 1.12), color: C_LINE, w: 2 }, { t: 'seg', a: F.A, b: F.C, color: C_HI, w: 3 }, { t: 'seg', a: F.B, b: F.D, color: C_HI, w: 3 }];
    var lab = function (key, a, b, ref) { if (L[key]) it.push({ t: 'side', a: a, b: b, ref: ref, s: L[key] }); };
    lab('SA', F.S, F.A, F.C); lab('SC', F.S, F.C, F.A); lab('AC', F.A, F.C, F.S); lab('SB', F.S, F.B, F.D); lab('SD', F.S, F.D, F.B); lab('BD', F.B, F.D, F.S);
    [['A', F.A, F.C], ['C', F.C, F.A], ['B', F.B, F.D], ['D', F.D, F.B]].forEach(function (q) { var u = q[1], n = [-u[1], u[0]]; if (n[0] * (q[2][0] - u[0]) + n[1] * (q[2][1] - u[1]) > 0) n = [-n[0], -n[1]]; var l = Math.hypot(u[0], u[1]); it.push({ t: 'pt', p: q[1], s: q[0], color: C_LINE, r: 3.5, dir: [n[0] * 0.6 + u[0] / l * 0.5 * Math.hypot(n[0], n[1]), n[1] * 0.6 + u[1] / l * 0.5 * Math.hypot(n[0], n[1])] }); });
    var bis = [F.A[0] / F.a + F.C[0] / F.c, F.A[1] / F.a + F.C[1] / F.c];
    it.push({ t: 'pt', p: F.S, s: 'S', color: C_ACC, r: 3.5, dir: [-bis[1], bis[0]] });
    return scene(it, { W: 360, H: 240, pad: 30, label: 'Strahlensatzfigur (X-Figur), AC parallel zu BD', maxw: 440 });
  }
  var TEIL = 'Achtung, typischer Fehler: Beim 2. Strahlensatz (mit den Parallelen AC und BD) musst du die <b>ganzen</b> Strecken ab S nehmen: SA und SB = SA + AB, nicht die Teilstrecke AB.';

  var gen = {
    v1: function (lvl) {
      var F = mkV(), L = { SA: cm(F.a), AB: cm(F.b) };
      if (lvl === 1) {
        L.SC = cm(F.c); L.CD = 'x';
        return { skill: '1. Strahlensatz (V-Figur)', level: 1, q: 'Die Geraden AC und BD sind parallel. Berechne x.' + figV(F, L),
          inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: F.CD }],
          hints: ['1. Strahlensatz: Die Abschnitte auf dem einen Strahl stehen im gleichen Verhältnis wie die Abschnitte auf dem anderen Strahl.', 'SA : AB = SC : CD, also ' + f(F.a) + ' : ' + f(F.b) + ' = ' + f(F.c) + ' : x.', 'Umgestellt: x = ' + f(F.c) + ' · ' + f(F.b) + ' : ' + f(F.a) + '.'],
          solution: f(F.a) + ' : ' + f(F.b) + ' = ' + f(F.c) + ' : x ⇒ x = ' + f(F.c) + ' · ' + f(F.b) + ' : ' + f(F.a) + ' = <b>' + cm(F.CD) + '</b>.',
          mistakes: function (v) { if (isNum(v[0], F.c * F.a / F.b)) return 'Du hast das Verhältnis umgedreht. Auf beiden Seiten muss gleich aufgebaut sein: innen : außen = innen : außen.'; if (isNum(v[0], F.SD)) return 'Das ist die ganze Strecke SD. Gesucht ist nur das Stück CD.'; return null; },
          verify: function () { return near(dist(F.C, F.D), F.CD) && near(dist(F.A, F.B), F.b) ? true : 'falsch'; } };
      }
      L.CD = cm(F.CD); L.SC = 'x';
      return { skill: '1. Strahlensatz (V-Figur)', level: lvl, q: 'Die Geraden AC und BD sind parallel. Berechne x.' + figV(F, L),
        inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: F.c }],
        hints: ['Nach dem 1. Strahlensatz gilt: SA : AB = SC : CD.', f(F.a) + ' : ' + f(F.b) + ' = x : ' + f(F.CD) + '.', 'x = ' + f(F.a) + ' · ' + f(F.CD) + ' : ' + f(F.b) + '.'],
        solution: 'SA : AB = SC : CD ⇒ ' + f(F.a) + ' : ' + f(F.b) + ' = x : ' + f(F.CD) + ' ⇒ x = ' + f(F.a) + ' · ' + f(F.CD) + ' : ' + f(F.b) + ' = <b>' + cm(F.c) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], F.b * F.CD / F.a)) return 'Du hast das Verhältnis falsch herum aufgestellt. SA gehört zu SC, AB gehört zu CD.'; return null; },
        verify: function () { return near(dist(F.S, F.C), F.c) ? true : 'falsch'; } };
    },
    v2: function (lvl) {
      var F = mkV({ notK2: true }), L = { SA: cm(F.a), AB: cm(F.b), AC: cm(F.e), BD: 'x' };
      return { skill: '2. Strahlensatz (V-Figur)', level: lvl, q: 'Die Geraden AC und BD sind parallel. Berechne x.' + figV(F, L),
        inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: F.BD }],
        hints: ['2. Strahlensatz: Die Parallelenabschnitte verhalten sich wie die zugehörigen Strecken <b>ab S</b>: AC : BD = SA : SB.', 'Berechne zuerst SB = SA + AB = ' + f(F.a) + ' cm + ' + f(F.b) + ' cm = ' + cm(F.SB) + '.', f(F.e) + ' : x = ' + f(F.a) + ' : ' + f(F.SB) + ', also x = ' + f(F.e) + ' · ' + f(F.SB) + ' : ' + f(F.a) + '.'],
        solution: 'SB = ' + f(F.a) + ' + ' + f(F.b) + ' = ' + cm(F.SB) + '. AC : BD = SA : SB ⇒ x = ' + f(F.e) + ' · ' + f(F.SB) + ' : ' + f(F.a) + ' = <b>' + cm(F.BD) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], F.e * F.b / F.a) || isNum(v[0], F.e * F.a / F.b)) return TEIL; if (isNum(v[0], F.e * F.a / F.SB)) return 'Das Verhältnis ist umgedreht. BD liegt außen, gehört also zu SB, und muss länger als AC sein.'; return null; },
        verify: function () { return near(dist(F.B, F.D), F.BD) && near(dist(F.A, F.C), F.e) ? true : 'falsch'; } };
    },
    v2rueck: function () {
      var F = mkV({ notK2: true }), L = { SA: cm(F.a), AB: 'x', AC: cm(F.e), BD: cm(F.BD) };
      return { skill: '2. Strahlensatz rückwärts', level: 3, q: 'Die Geraden AC und BD sind parallel. Berechne die Strecke x = AB.' + figV(F, L),
        inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: F.b }],
        hints: ['Mit dem 2. Strahlensatz kannst du zuerst die ganze Strecke SB berechnen: SB : SA = BD : AC.', 'SB = ' + f(F.a) + ' · ' + f(F.BD) + ' : ' + f(F.e) + ' = ' + cm(F.SB) + '.', 'x = AB = SB − SA = ' + f(F.SB) + ' cm − ' + f(F.a) + ' cm.'],
        solution: 'SB = SA · BD : AC = ' + f(F.a) + ' · ' + f(F.BD) + ' : ' + f(F.e) + ' = ' + cm(F.SB) + '. x = SB − SA = ' + f(F.SB) + ' − ' + f(F.a) + ' = <b>' + cm(F.b) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], F.SB)) return 'Das ist die ganze Strecke SB. Gesucht ist nur das Stück AB = SB − SA.'; if (isNum(v[0], F.a * F.e / F.BD)) return 'Das Verhältnis ist umgedreht. SB ist länger als SA, weil BD länger als AC ist.'; return null; },
        verify: function () { return near(dist(F.A, F.B), F.b) ? true : 'falsch'; } };
    },
    x: function (lvl) {
      var F = mkX(), mode = M.pick(['BD', 'SD', 'SA']), L = {}, ans, sol, hs;
      if (mode === 'BD') { L = { SA: cm(F.a), SB: cm(F.SB), AC: cm(F.e), BD: 'x' }; ans = F.BD; hs = ['Bei der X-Figur gilt: SB : SA = BD : AC.', f(F.SB) + ' : ' + f(F.a) + ' = x : ' + f(F.e) + '.', 'x = ' + f(F.e) + ' · ' + f(F.SB) + ' : ' + f(F.a) + '.']; sol = 'BD : AC = SB : SA ⇒ x = ' + f(F.e) + ' · ' + f(F.SB) + ' : ' + f(F.a) + ' = <b>' + cm(ans) + '</b>.'; }
      else if (mode === 'SD') { L = { SA: cm(F.a), SB: cm(F.SB), SC: cm(F.c), SD: 'x' }; ans = F.SD; hs = ['Bei der X-Figur gilt: SD : SC = SB : SA.', 'x : ' + f(F.c) + ' = ' + f(F.SB) + ' : ' + f(F.a) + '.', 'x = ' + f(F.c) + ' · ' + f(F.SB) + ' : ' + f(F.a) + '.']; sol = 'SD : SC = SB : SA ⇒ x = ' + f(F.c) + ' · ' + f(F.SB) + ' : ' + f(F.a) + ' = <b>' + cm(ans) + '</b>.'; }
      else { L = { SA: 'x', SB: cm(F.SB), AC: cm(F.e), BD: cm(F.BD) }; ans = F.a; hs = ['Bei der X-Figur gilt: SA : SB = AC : BD.', 'x : ' + f(F.SB) + ' = ' + f(F.e) + ' : ' + f(F.BD) + '.', 'x = ' + f(F.SB) + ' · ' + f(F.e) + ' : ' + f(F.BD) + '.']; sol = 'SA : SB = AC : BD ⇒ x = ' + f(F.SB) + ' · ' + f(F.e) + ' : ' + f(F.BD) + ' = <b>' + cm(ans) + '</b>.'; }
      return { skill: 'Strahlensätze in der X-Figur', level: lvl, q: 'Die Geraden AC und BD sind parallel. Sie schneiden die beiden Geraden durch S. Berechne x.' + figX(F, L),
        inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: ans }],
        hints: hs, solution: sol,
        mistakes: function (v) { var wrong = mode === 'BD' ? F.e * F.a / F.SB : mode === 'SD' ? F.c * F.a / F.SB : F.SB * F.BD / F.e; if (isNum(v[0], wrong)) return 'Das Verhältnis ist umgedreht. Achte darauf, dass auf beiden Seiten die Strecken in derselben Reihenfolge stehen (zum Beispiel jeweils oben : unten).'; return null; },
        verify: function () { var d = mode === 'BD' ? dist(F.B, F.D) : mode === 'SD' ? dist(F.S, F.D) : dist(F.S, F.A); return near(d, ans) && near(dist(F.A, F.C), F.e) ? true : 'falsch'; } };
    },
    gleichung: function () {
      var F = mkV({ notK2: true, minB: 2 }), V = { SA: F.a, AB: F.b, SB: F.SB, SC: F.c, CD: F.CD, SD: F.SD, AC: F.e, BD: F.BD };
      var good = [['SA', 'SB', 'SC', 'SD'], ['SA', 'AB', 'SC', 'CD'], ['SA', 'SB', 'AC', 'BD'], ['SC', 'SD', 'AC', 'BD']];
      var bad = [['SA', 'AB', 'AC', 'BD'], ['SC', 'CD', 'AC', 'BD'], ['SA', 'SB', 'BD', 'AC'], ['SA', 'SC', 'AB', 'BD'], ['AB', 'SB', 'SC', 'CD'], ['SA', 'AB', 'SD', 'SC']];
      var ok = function (q) { return near(V[q[0]] / V[q[1]], V[q[2]] / V[q[3]]); };
      bad = bad.filter(function (q) { return !ok(q); });
      var right = M.pick(good), opts = M.shuffle([right].concat(M.shuffle(bad).slice(0, 3))), txt = function (q) { return q[0] + ' : ' + q[1] + ' = ' + q[2] + ' : ' + q[3]; };
      var L = { SA: 'SA', AB: 'AB', SC: 'SC', CD: 'CD' };
      return { skill: 'Strahlensatz richtig aufstellen', level: 1, q: 'In der Figur ist AC parallel zu BD. Welche Gleichung ist <b>richtig</b>?' + figV(F, {}),
        inputs: [{ kind: 'mc', label: 'Richtige Gleichung', options: opts.map(txt), answer: opts.indexOf(right) }],
        hints: ['1. Strahlensatz: Nur Strecken auf den Strahlen (SA, AB, SB, SC, CD, SD). Teilstrecken dürfen verwendet werden, wenn es auf beiden Strahlen dieselben sind.', '2. Strahlensatz: Kommen die Parallelen AC und BD vor, brauchst du die Strecken <b>ab S</b>, also SA und SB (oder SC und SD).', 'Die Gleichung SA : AB = AC : BD ist der typische Fehler: AB beginnt nicht bei S.'],
        solution: 'Richtig ist <b>' + txt(right) + '</b>. ' + (right[2] === 'AC' ? 'Das ist der 2. Strahlensatz: Die Parallelen verhalten sich wie die Strecken ab S.' : 'Das ist der 1. Strahlensatz: Die Abschnitte auf den beiden Strahlen stehen im gleichen Verhältnis.'),
        verify: function () { return ok(right) && opts.filter(ok).length === 1 ? true : 'mehrdeutig'; } };
    },
    baum: function (lvl) {
      var s = M.pick([1, 1.5, 2]), t = M.pick([1.2, 1.5, 2, 2.5, 3]), k = M.pick([4, 5, 6, 8]), T = rd(k * t, 6), H = rd(k * s, 6);
      var r = 0.13 * H, items = [{ t: 'seg', a: [-0.4, 0], b: [T + 1.2, 0], color: '#64748b', w: 2 }, { t: 'seg', a: [0, 0], b: [T, H], color: C_ACC, dash: '6 4', w: 1.5 }, { t: 'seg', a: [T, 0], b: [T, H - 2 * r], color: '#7c4a1e', w: 5 }, { t: 'circle', c: [T, H - r], r: r, color: C_GRN, fill: '#cdeee4', w: 2 }, { t: 'seg', a: [t, 0], b: [t, s], color: C_HI, w: 4 },
        { t: 'rmark', v: [t, 0], a: [0, 0], b: [t, s], z: 8 }, { t: 'rmark', v: [T, 0], a: [0, 0], b: [T, H], z: 8 },
        { t: 'side', a: [0, 0], b: [t, 0], ref: [t / 2, 1], s: f(t) + ' m', color: C_HI }, { t: 'side', a: [t, 0], b: [T, 0], ref: [T / 2, 1], s: f(rd(T - t, 6)) + ' m' }, { t: 'side', a: [t, 0], b: [t, s], ref: [0, s], s: f(s) + ' m', color: C_HI }, { t: 'side', a: [T, 0], b: [T, H], ref: [0, H], s: 'h = ?' }, { t: 'pt', p: [0, 0], s: 'S', color: C_ACC, dir: [-1, 0.3], r: 3.5 }, { t: 'text', p: [T * 0.45, H * 0.45 + 0.4], s: 'Sonnenstrahl', size: 11, color: '#b45309', dir: [-0.6, -1] }];
      return { skill: 'Baumhöhe mit dem Schatten', level: lvl, q: 'Mia will die Höhe eines Baums bestimmen. Sie stellt einen ' + f(s) + ' m langen Stab senkrecht so auf, dass das Ende seines Schattens genau mit dem Ende des Baumschattens (Punkt S) zusammenfällt. Der Schatten des Stabs ist ' + f(t) + ' m lang, der Stab steht ' + f(rd(T - t, 6)) + ' m vom Baum entfernt. Wie hoch ist der Baum?' + scene(items, { W: 360, H: 220, pad: 26, label: 'Baum, Stab und Sonnenstrahl', maxw: 440 }),
        inputs: [{ kind: 'num', label: 'Höhe des Baums', unit: 'm', answer: H }],
        hints: ['Stab und Baum stehen senkrecht, sie sind also parallel. Das ist eine V-Figur mit dem Zentrum S. Es gilt der 2. Strahlensatz.', 'Die ganze Schattenlänge des Baums ist ' + f(t) + ' m + ' + f(rd(T - t, 6)) + ' m = ' + f(T) + ' m. Es gilt h : ' + f(s) + ' = ' + f(T) + ' : ' + f(t) + '.', 'h = ' + f(s) + ' · ' + f(T) + ' : ' + f(t) + '.'],
        solution: 'Schatten des Baums: ' + f(t) + ' m + ' + f(rd(T - t, 6)) + ' m = ' + f(T) + ' m. h : ' + f(s) + ' m = ' + f(T) + ' m : ' + f(t) + ' m ⇒ h = ' + f(s) + ' · ' + f(T) + ' : ' + f(t) + ' = <b>' + f(H) + ' m</b>.',
        mistakes: function (v) { if (isNum(v[0], s * (T - t) / t)) return TEIL + ' Der Baumschatten reicht von S bis zum Baum, also ' + f(T) + ' m.'; if (isNum(v[0], s + T - t)) return 'Du hast addiert. Beim Strahlensatz rechnest du mit Verhältnissen (mal und geteilt).'; return null; },
        verify: function () { return near(H / s, T / t) ? true : 'falsch'; } };
    },
    daumen: function (lvl) {
      var P = M.pick([[60, 6, 10], [65, 6.5, 10], [70, 7, 10], [63, 7, 9], [66, 6, 11]]), w = M.pick([20, 25, 30, 40, 50, 80, 15]), D = w * P[2];
      var it = [{ t: 'seg', a: [0, 0.5], b: [10, -2.5], color: C_ACC, dash: '5 4', w: 1.4 }, { t: 'seg', a: [0, -0.5], b: [10, 2.5], color: C_ACC, dash: '5 4', w: 1.4 }, { t: 'seg', a: [0, 0.5], b: [0, -0.5], color: C_HI, w: 3 }, { t: 'seg', a: [10, -2.5], b: [10, 2.5], color: C_HI, w: 3 }, { t: 'pt', p: [10 / 6, 0], s: 'Daumen', color: C_ACC, dir: [0, 1], r: 4 },
        { t: 'text', p: [0, 0], s: 'Augen', dx: -6, anchor: 'end', size: 11 }, { t: 'text', p: [10, 2.5], s: 'Sprung ' + f(w) + ' m', dy: -10, size: 11 }, { t: 'text', p: [0.85, -0.45], s: 'Arm', size: 10, dy: 12 }, { t: 'text', p: [4.5, -2.9], s: 'Entfernung = ?', size: 11, color: C_RED, fixed: true }];
      return { skill: 'Entfernung mit dem Daumensprung', level: lvl, q: 'Tom streckt den Arm aus und peilt mit dem Daumen ein Haus an, zuerst nur mit dem linken, dann nur mit dem rechten Auge. Der Daumen „springt“ dabei am Haus um etwa ' + f(w) + ' m. Toms Augenabstand ist ' + cm(P[1]) + ', sein Arm (Auge bis Daumen) ist ' + cm(P[0]) + ' lang. Wie weit ist das Haus ungefähr entfernt?' + scene(it, { bounds: [-2.2, 11.5, -3.4, 3.4], W: 360, H: 180, pad: 10, note: 'Skizze nicht maßstabsgetreu', label: 'Daumensprung, X-Figur', maxw: 440 }),
        inputs: [{ kind: 'num', label: 'Entfernung', unit: 'm', answer: D }],
        hints: ['Die Sehstrahlen kreuzen sich am Daumen. Das ist eine X-Figur, Augenabstand und Sprung sind parallel.', 'Entfernung : Armlänge = Sprung : Augenabstand. Der Faktor ist Armlänge : Augenabstand = ' + f(P[0]) + ' : ' + f(P[1]) + ' = ' + P[2] + '.', 'Entfernung = ' + P[2] + ' · ' + f(w) + ' m.'],
        solution: 'Entfernung : ' + f(P[0]) + ' cm = ' + f(w) + ' m : ' + f(P[1]) + ' cm ⇒ Entfernung = ' + f(w) + ' m · ' + f(P[0]) + ' : ' + f(P[1]) + ' = ' + f(w) + ' m · ' + P[2] + ' = <b>' + f(D) + ' m</b>.',
        mistakes: function (v) { if (isNum(v[0], w / P[2])) return 'Das Verhältnis ist umgedreht. Das Haus ist viel weiter weg als der Sprung lang ist.'; return null; },
        verify: function () { return near(D / P[0], w / P[1]) ? true : 'falsch'; } };
    },
    fluss: function () {
      var q = M.pick([5, 8, 10, 12]), r = M.pick([3, 4, 5, 6]), p = M.pick([20, 24, 25, 30, 36, 40]), x = p * r / q;
      if (!nice(x) || x < 10 || x > 40) return gen.fluss();
      var Pp = [0, 0], T = [0, x], Sx = [p, 0], R = [p + q, 0], E = [p + q, -r];
      var items = [{ t: 'poly', p: [[-4, 0.6], [p + q + 4, 0.6], [p + q + 4, x - 0.6], [-4, x - 0.6]], fill: '#dbeafe', color: '#bfdbfe', w: 1 }, { t: 'seg', a: [-4, 0], b: [p + q + 4, 0], color: '#64748b', w: 2 }, { t: 'seg', a: [-4, x], b: [p + q + 4, x], color: '#64748b', w: 2 },
        { t: 'seg', a: T, b: E, color: C_ACC, dash: '6 4', w: 1.5 }, { t: 'seg', a: T, b: Pp, color: C_HI, w: 2.5 }, { t: 'seg', a: R, b: E, color: C_HI, w: 2.5 }, { t: 'seg', a: Pp, b: R, color: C_LINE, w: 2 },
        { t: 'rmark', v: Pp, a: T, b: R, z: 8 }, { t: 'rmark', v: R, a: Pp, b: E, z: 8 },
        { t: 'side', a: Pp, b: Sx, ref: [p / 2, -5], s: f(p) + ' m' }, { t: 'side', a: Sx, b: R, ref: [p + q / 2, 5], s: f(q) + ' m' }, { t: 'side', a: R, b: E, ref: [0, -r / 2], s: f(r) + ' m' }, { t: 'side', a: Pp, b: T, ref: [5, x / 2], s: 'x = ?' },
        { t: 'pt', p: T, s: 'Baum B', color: C_GRN, dir: [1, 0.6] }, { t: 'pt', p: Pp, s: 'P', dir: [-1, -0.6] }, { t: 'pt', p: Sx, s: 'S', color: C_ACC, dir: [0.2, -1] }, { t: 'pt', p: R, s: 'R', dir: [1, 0.6] }, { t: 'pt', p: E, s: 'E', dir: [1, -0.4] }, { t: 'text', p: [(p + q) * 0.7, x * 0.75], s: 'Fluss', size: 12, color: '#1d4ed8', bold: true }];
      return { skill: 'Flussbreite bestimmen (Anwendung)', level: 3, q: 'Eine Klasse will die Breite eines Flusses bestimmen. Am anderen Ufer steht ein Baum B. Genau gegenüber am eigenen Ufer liegt P. Die Klasse geht von P aus ' + f(p) + ' m am Ufer entlang bis S und steckt dort einen Stab ein, dann weitere ' + f(q) + ' m bis R. Von R aus geht sie senkrecht vom Ufer weg, bis sie in E den Stab S und den Baum B genau hintereinander sieht. Die Strecke RE ist ' + f(r) + ' m lang. Wie breit ist der Fluss (Strecke x = PB)?' + scene(items, { W: 360, H: 260, pad: 26, label: 'Flussbreite mit Strahlensatz', maxw: 440 }),
        inputs: [{ kind: 'num', label: 'Flussbreite x', unit: 'm', answer: x }],
        hints: ['PB und RE stehen beide senkrecht zum Ufer, sie sind also parallel. Die Geraden BE und PR schneiden sich in S: Das ist eine X-Figur.', 'Nach dem 2. Strahlensatz gilt: PB : RE = SP : SR, also x : ' + f(r) + ' = ' + f(p) + ' : ' + f(q) + '.', 'x = ' + f(r) + ' · ' + f(p) + ' : ' + f(q) + '.'],
        solution: 'X-Figur mit Zentrum S und den Parallelen PB und RE: x : ' + f(r) + ' m = ' + f(p) + ' m : ' + f(q) + ' m ⇒ x = ' + f(r) + ' · ' + f(p) + ' : ' + f(q) + ' = <b>' + f(x) + ' m</b>.',
        mistakes: function (v) { if (isNum(v[0], r * (p + q) / q)) return TEIL.replace('SA und SB = SA + AB, nicht die Teilstrecke AB', 'SP und SR, die beide in S beginnen') + ' Hier ist S der Kreuzungspunkt. Du brauchst SP = ' + f(p) + ' m, nicht PR.'; if (isNum(v[0], r * q / p)) return 'Das Verhältnis ist umgedreht. Der Fluss ist breiter als RE, weil SP länger als SR ist.'; return null; },
        verify: function () { var ang = function (U, V) { return Math.atan2(V[1] - U[1], V[0] - U[0]); }; return Math.abs(Math.abs(ang(Sx, T) - ang(Sx, E)) - Math.PI) < 1e-9 ? true : 'B, S, E nicht auf einer Geraden'; } };
    }
  };

  /* Erklärungsfiguren */
  var exV = (function () { var a = 4, c = 3, e = 2.5, phi = Math.acos((a * a + c * c - e * e) / (2 * a * c)) / D2R, u1 = dir(-6), u2 = dir(-6 + phi); return { a: 4, b: 2, c: 3, e: 2.5, k: 1.5, S: [0, 0], A: mul(u1, 4), B: mul(u1, 6), C: mul(u2, 3), D: mul(u2, 4.5), SB: 6, SD: 4.5, CD: 1.5, BD: 3.75 }; })();
  var exX = (function () { var a = 3, c = 2.5, e = 2, phi = Math.acos((a * a + c * c - e * e) / (2 * a * c)) / D2R, u1 = dir(-12), u2 = dir(-12 + phi); return { a: 3, c: 2.5, e: 2, m: 2, S: [0, 0], A: mul(u1, 3), C: mul(u2, 2.5), B: mul(u1, -6), D: mul(u2, -5), SB: 6, SD: 5, BD: 4 }; })();

  return {
    id: '020', title: 'Strahlensätze', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Ähnliche Figuren, Verhältnisgleichungen lösen, zentrische Streckung',
    lead: 'Wie hoch ist ein Baum, wie breit ein Fluss, wie weit ein Haus entfernt? Mit den Strahlensätzen misst du Strecken, an die du gar nicht herankommst.',
    einstieg: { html: '<p>Die Klasse 9b steht auf dem Schulhof vor einem großen Baum. Niemand kann hinaufklettern, um ihn zu messen. Die Sonne scheint und der Baum wirft einen langen Schatten. Ein Besenstiel wirft auch einen Schatten.</p><p class="note">Wie kann man mit dem Besenstiel, einem Maßband und den beiden Schatten die Höhe des Baums bestimmen?</p><p>Die Sonnenstrahlen, der Baum und der Stab bilden eine besondere Figur: zwei Strahlen, die von einem Punkt ausgehen, und zwei parallele Strecken. Für solche Figuren gelten die <b>Strahlensätze</b>. In diesem Modul lernst du sie kennen und wendest sie an.</p>' },
    ziele: ['Ich erkenne V-Figuren und X-Figuren mit parallelen Geraden.', 'Ich stelle mit dem 1. Strahlensatz Verhältnisgleichungen für Strecken auf den Strahlen auf.', 'Ich nutze den 2. Strahlensatz für die Parallelenabschnitte und nehme dabei die Strecken ab S.', 'Ich berechne fehlende Strecken durch Umstellen der Verhältnisgleichung.', 'Ich wende die Strahlensätze in Sachsituationen an (Baumhöhe, Flussbreite, Daumensprung).'],
    fachwoerter: [['Scheitelpunkt S', 'Der Punkt, in dem sich die beiden Geraden (Strahlen) schneiden.'], ['V-Figur', 'Zwei Strahlen von S aus werden von zwei Parallelen geschnitten. Beide Parallelen liegen auf derselben Seite von S.'], ['X-Figur', 'Zwei Geraden kreuzen sich in S. Die Parallelen liegen auf verschiedenen Seiten von S.'], ['Parallelenabschnitt', 'Das Stück einer Parallelen zwischen den beiden Strahlen, zum Beispiel AC oder BD.'], ['Verhältnisgleichung', 'Eine Gleichung der Form a : b = c : d.']],
    diagnose: [
      { q: 'Löse die Verhältnisgleichung 4 : 6 = 10 : x.', options: ['x = 15', 'x = 12', 'x = 8', 'Weiß ich noch nicht'], answer: 0, why: 'x = 10 · 6 : 4 = 15.', review: 'Verhältnisgleichungen (Dreisatz)' },
      { q: 'Zwei Dreiecke stimmen in zwei Winkeln überein. Dann sind sie …', options: ['ähnlich', 'immer gleich groß', 'rechtwinklig', 'Weiß ich noch nicht'], answer: 0, why: 'Das ist der Hauptähnlichkeitssatz.', review: 'Ähnliche Figuren' },
      { q: 'Zwei Geraden, die sich nie schneiden und überall gleichen Abstand haben, heißen …', options: ['parallel', 'senkrecht', 'gleichschenklig', 'Weiß ich noch nicht'], answer: 0, why: 'Solche Geraden heißen parallel (Zeichen ∥).', review: 'Lagebeziehungen von Geraden' },
      { q: 'SA = 3 cm und AB = 2 cm liegen hintereinander auf einer Geraden. Wie lang ist SB?', options: ['5 cm', '1 cm', '6 cm', 'Weiß ich noch nicht'], answer: 0, why: 'SB = SA + AB = 3 cm + 2 cm = 5 cm.', review: 'Strecken addieren' }],
    erklaerung:
      '<h3>1. Die Strahlensatzfigur</h3><p>Zwei Strahlen beginnen im Punkt <b>S</b>. Sie werden von zwei <b>parallelen</b> Geraden geschnitten: die eine in A und C, die andere in B und D. Es gilt AC ∥ BD.</p>' + figV(exV, { SA: '4 cm', AB: '2 cm', SC: '3 cm', CD: '1,5 cm', AC: '2,5 cm', BD: '3,75 cm' }) +
      '<p>Das Dreieck SBD ist eine zentrische Streckung des Dreiecks SAC mit dem Zentrum S. Deshalb stehen die Strecken in festen Verhältnissen. Im Bild ist der Faktor k = 6 : 4 = 1,5.</p>' +
      '<div class="merk"><b>1. Strahlensatz:</b> Die Abschnitte auf dem einen Strahl verhalten sich wie die entsprechenden Abschnitte auf dem anderen Strahl.<br><span class="big-math">SA : SB = SC : SD</span> und auch <span class="big-math">SA : AB = SC : CD</span></div>' +
      '<div class="merk"><b>2. Strahlensatz:</b> Die Parallelenabschnitte verhalten sich wie die zugehörigen Strecken <b>ab dem Scheitelpunkt S</b>.<br><span class="big-math">AC : BD = SA : SB = SC : SD</span></div>' +
      '<p class="note"><b>Typischer Fehler:</b> AC : BD = SA : AB ist <b>falsch</b>. Beim 2. Strahlensatz dürfen keine Teilstrecken wie AB vorkommen. Nimm immer die ganzen Strecken SA und SB = SA + AB. Im Beispiel: 2,5 : 3,75 = 4 : 6 stimmt, 2,5 : 3,75 = 4 : 2 stimmt nicht.</p>' +
      '<h3>2. Die X-Figur</h3><p>Die Strahlensätze gelten auch, wenn sich die Geraden in S kreuzen und die Parallelen auf verschiedenen Seiten von S liegen.</p>' + figX(exX, { SA: '3 cm', SB: '6 cm', AC: '2 cm', BD: '4 cm' }) +
      '<div class="merk"><b>Merke (X-Figur):</b> <span class="big-math">SA : SB = SC : SD = AC : BD</span></div>' +
      '<h3>3. So gehst du vor</h3><ol><li>Prüfe, welche Strecken parallel sind, und markiere S.</li><li>Kommt ein Parallelenabschnitt vor? Dann 2. Strahlensatz mit den Strecken ab S.</li><li>Stelle die Verhältnisgleichung mit x auf, gleich aufgebaut auf beiden Seiten (innen : außen = innen : außen).</li><li>Löse nach x auf und prüfe, ob das Ergebnis passt.</li></ol>',
    entdecken: {
      html: '<p>Verschiebe die zweite Parallele BD und verändere den Winkel zwischen den Strahlen. SA = 4 cm und SC = 3 cm bleiben fest. Beobachte die Verhältnisse.</p><div class="ctl"><label>SB = <b id="v_b"></b> <input type="range" id="r_b" min="5" max="10" step="1" value="6"></label><label>Winkel bei S = <b id="v_w"></b> <input type="range" id="r_w" min="25" max="60" step="5" value="35"></label></div><div id="e_g"></div><div id="e_t"></div><p class="note">Welche Verhältnisse sind immer gleich? Welches Verhältnis passt nicht dazu?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var sb = +root.querySelector('#r_b').value, w = +root.querySelector('#r_w').value, k = sb / 4, u1 = dir(-5), u2 = dir(-5 + w);
          root.querySelector('#v_b').textContent = cm(sb); root.querySelector('#v_w').textContent = w + '°';
          var F = { S: [0, 0], A: mul(u1, 4), B: mul(u1, sb), C: mul(u2, 3), D: mul(u2, 3 * k) }, e = dist(F.A, F.C), bd = dist(F.B, F.D);
          root.querySelector('#e_g').innerHTML = scene([{ t: 'seg', a: F.S, b: mul(u1, 11), color: C_LINE }, { t: 'seg', a: F.S, b: mul(u2, 8.5), color: C_LINE }, { t: 'seg', a: F.A, b: F.C, color: C_HI, w: 3 }, { t: 'seg', a: F.B, b: F.D, color: C_HI, w: 3 }, { t: 'pt', p: F.S, s: 'S', color: C_ACC, dir: [-1, 0], r: 3.5 }, { t: 'pt', p: F.A, s: 'A', dir: [0.2, -1], r: 3.5 }, { t: 'pt', p: F.B, s: 'B', dir: [0.2, -1], r: 3.5 }, { t: 'pt', p: F.C, s: 'C', dir: [-0.6, 1], r: 3.5 }, { t: 'pt', p: F.D, s: 'D', dir: [-0.6, 1], r: 3.5 }], { bounds: [-0.8, 11.5, -1.6, 8.2], W: 360, H: 250, pad: 10, label: 'Veränderbare Strahlensatzfigur', maxw: 440 });
          root.querySelector('#e_t').innerHTML = '<p>AC ≈ ' + cm(rd(e, 2)) + ', BD ≈ ' + cm(rd(bd, 2)) + ', SD = ' + cm(3 * k) + ', AB = ' + cm(sb - 4) + '</p><p>SA : SB = 4 : ' + f(sb) + ' ≈ <b>' + f(rd(4 / sb, 3)) + '</b> &nbsp; SC : SD ≈ <b>' + f(rd(3 / (3 * k), 3)) + '</b> &nbsp; AC : BD ≈ <b>' + f(rd(e / bd, 3)) + '</b></p><p style="color:#b91c1c">Falsch angesetzt: SA : AB = 4 : ' + f(sb - 4) + ' ≈ ' + f(rd(4 / (sb - 4), 3)) + (near(4 / (sb - 4), e / bd) ? ' (hier zufällig gleich)' : ' ≠ AC : BD') + '</p>';
        }
        function step() { draw(); n++; if (n >= 3) done('Richtig beobachtet: SA : SB, SC : SD und AC : BD sind immer gleich, egal wie groß der Winkel ist. Das Verhältnis SA : AB mit der Teilstrecke passt dagegen nicht zu AC : BD.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        draw();
      }
    },
    beispiel: { title: 'Parallelenabschnitt berechnen', q: 'In der V-Figur ist AC ∥ BD. Es ist SA = 4 cm, AB = 2 cm und AC = 2,5 cm. Wie lang ist BD?',
      steps: ['Es kommen die Parallelen AC und BD vor, also brauchst du den 2. Strahlensatz mit den Strecken ab S.', 'Ganze Strecke berechnen: SB = SA + AB = 4 cm + 2 cm = 6 cm.', 'Verhältnisgleichung aufstellen: BD : AC = SB : SA, also BD : 2,5 = 6 : 4.', 'Auflösen: BD = 2,5 · 6 : 4 = <b>3,75 cm</b>.', 'Kontrolle: BD liegt weiter außen, muss also länger als AC sein. 3,75 cm > 2,5 cm passt. (Mit der Teilstrecke AB = 2 cm käme fälschlich 1,25 cm heraus.)' + figV(exV, { SA: '4 cm', AB: '2 cm', AC: '2,5 cm', BD: 'BD = ?' })] },
    tasks: { gen: gen, plan: { G: ['gleichung:1', 'v1:1', 'v2:2', 'baum:2'], S: ['gleichung:1', 'v1:1', 'v1:2', 'v2:2', 'x:2'], E: ['v1:2', 'v2:2', 'x:2', 'v2rueck:3', 'baum:2', 'daumen:2'] },
      extra: 'fluss', test: ['gleichung:1', 'v1:1', 'v2:2', 'x:2', 'baum:2', 'daumen:2'] },
    lerncheck: ['Ich erkenne V-Figuren und X-Figuren.', 'Ich stelle Verhältnisgleichungen mit den Strahlensätzen richtig auf.', 'Ich nutze beim 2. Strahlensatz die ganzen Strecken ab S und nicht die Teilstrecken.', 'Ich bestimme mit den Strahlensätzen Höhen und Entfernungen im Alltag.']
  };
})();
