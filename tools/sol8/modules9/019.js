/* Modul 019 (Klasse 9) · Ähnliche Figuren */
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
  /* ---------- Hilfen für ähnliche Figuren ---------- */
  function near(a, b) { return Math.abs(a - b) < 1e-6; }
  function isNum(v, x) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < 1e-6; }
  function triWW(al, be, c) { var ga = 180 - al - be, b = c * Math.sin(be * D2R) / Math.sin(ga * D2R); return [[0, 0], [c, 0], [b * Math.cos(al * D2R), b * Math.sin(al * D2R)]]; }
  function angAt(v, p, q) { var a = [p[0] - v[0], p[1] - v[1]], b = [q[0] - v[0], q[1] - v[1]]; return Math.acos(Math.max(-1, Math.min(1, (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]))))) / D2R; }
  function bbox(P) { return [Math.min.apply(null, P.map(function (p) { return p[0]; })), Math.max.apply(null, P.map(function (p) { return p[0]; })), Math.min.apply(null, P.map(function (p) { return p[1]; })), Math.max.apply(null, P.map(function (p) { return p[1]; }))]; }
  /* Bild: strecken, drehen, evtl. spiegeln, rechts neben das Original schieben */
  function placeImage(T, k, w, mirror, gap) {
    var B = T.map(function (p) { var q = rotP([p[0] * k, p[1] * k], w); return mirror ? [q[0], -q[1]] : q; });
    var b0 = bbox(T), b1 = bbox(B), dx = b0[1] + (gap || 1.5) - b1[0], dy = (b0[2] + b0[3]) / 2 - (b1[2] + b1[3]) / 2;
    return B.map(function (p) { return [p[0] + dx, p[1] + dy]; });
  }
  /* Seiten: 0 = a (gegenüber Ecke 0) ... wie triItems */
  var SIDES = [[3, 4, 5], [4, 5, 6], [5, 6, 7], [4, 6, 7], [3, 5, 6], [5, 7, 8], [4, 7, 8], [6, 7, 8], [3, 6, 7], [6, 8, 10]];
  function pickTri() { var s = M.shuffle(M.pick(SIDES)); return s; }
  function triPair(sides, k, w, mirror, o) {
    o = o || {}; var T = triSSS(sides[0], sides[1], sides[2]), gap = Math.max(2.4, 0.4 * Math.max.apply(null, sides) * Math.max(1, k));
    var B = placeImage(T, k, w, mirror, gap), items = [];
    var ang = o.angles ? function (P) { return [{ t: 'angle', v: P[0], a: P[1], b: P[2], color: C_ACC }, { t: 'angle', v: P[1], a: P[2], b: P[0], color: C_GRN, double: true }]; } : function () { return []; };
    var rm = function (P, col) { return rightMarks(P, col).filter(function (m) { return !o.angles || m.v === P[2]; }); };
    items = items.concat(triItems(T, { names: o.n1 || ['A', 'B', 'C'], sides: o.s1 || [] }), ang(T), rm(T));
    items = items.concat(triItems(B, { names: o.n2 || ['A′', 'B′', 'C′'], sides: o.s2 || [], fill: '#dff3ef', color: C_GRN }), ang(B), rm(B, C_GRN));
    var maxS = Math.max.apply(null, sides) * Math.max(1, k);
    return { T: T, B: B, svg: scene(items, { W: 360, H: 230, pad: 30, label: 'Zwei ähnliche Dreiecke', maxw: 440 }) };
  }
  function norm(T, L) { var m = Math.max(dist(T[0], T[1]), dist(T[1], T[2]), dist(T[0], T[2])); return T.map(function (p) { return [p[0] * L / m, p[1] * L / m]; }); }
  function kStr(k) { return f(k); }

  var gen = {
    erkennen: function () {
      var base = M.pick([[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [4, 7], [3, 7]]), r = base[0], s = base[1], k = M.pick([1.5, 2, 2.5, 3]);
      var right = [r * k, s * k], cands = [[r + 2, s + 2], [r + 1, s + 3], [r * k, s * k + 1], [r * k + 1, s * k], [s, r + s], [r + 3, s + 3], [2 * r, s + 2], [r * k - 1, s * k]];
      var ratio = function (p) { return Math.min(p[0], p[1]) / Math.max(p[0], p[1]); }, r0 = ratio([r, s]);
      var wrong = []; M.shuffle(cands).forEach(function (c) { if (wrong.length < 3 && c[0] > 0 && c[1] > 0 && Math.abs(ratio(c) - r0) > 1e-6 && !wrong.some(function (w) { return w[0] === c[0] && w[1] === c[1]; })) wrong.push(c); });
      var opts = M.shuffle([right].concat(wrong)), txt = function (p) { return cm(p[0]) + ' × ' + cm(p[1]); };
      return { skill: 'Ähnliche Rechtecke erkennen', level: 1, q: 'Ein Rechteck ist ' + cm(r) + ' breit und ' + cm(s) + ' lang. Welches der Rechtecke ist zu ihm <b>ähnlich</b>?', inputs: [{ kind: 'mc', label: 'Ähnliches Rechteck', options: opts.map(txt), answer: opts.indexOf(right) }],
        hints: ['Ähnlich heißt: Alle Seiten werden mit <b>demselben Faktor</b> multipliziert. Es wird nicht addiert.', 'Prüfe bei jedem Rechteck: Ist kurze Seite : ' + f(r) + ' genauso groß wie lange Seite : ' + f(s) + '?', 'Beispiel: ' + f(right[0]) + ' : ' + f(r) + ' = ' + f(k) + ' und ' + f(right[1]) + ' : ' + f(s) + ' = ' + f(k) + '.'],
        solution: 'Ähnlich ist das Rechteck mit <b>' + txt(right) + '</b>, denn beide Seiten sind mit k = ' + f(k) + ' multipliziert: ' + f(r) + ' · ' + f(k) + ' = ' + f(right[0]) + ' und ' + f(s) + ' · ' + f(k) + ' = ' + f(right[1]) + '. Bei den anderen passt das Seitenverhältnis nicht.',
        verify: function () { return opts.filter(function (p) { return Math.abs(ratio(p) - r0) < 1e-6; }).length === 1 ? true : 'mehrdeutig'; } };
    },
    seite: function (lvl) {
      var sides = pickTri(), k = M.pick(lvl === 1 ? [2, 3, 1.5] : [1.5, 2, 2.5, 0.5]), giv = M.rnd(0, 2), ask = (giv + M.rnd(1, 2)) % 3;
      if (k === 0.5 && sides.some(function (x) { return x % 2; })) k = 1.5;
      var w = lvl === 1 ? 0 : M.pick([60, 90, 120, 150, 180, 200, 240, 270, 300]);
      var s2 = ['', '', '']; s2[giv] = cm(k * sides[giv]); s2[ask] = '?';
      var pr = triPair(sides, k, w, false, { s1: sides.map(function (x) { return cm(x); }), s2: s2 });
      var x = k * sides[ask], nm = ['B′C′', 'A′C′', 'A′B′'], on = ['BC', 'AC', 'AB'];
      return { skill: 'Fehlende Seite in ähnlichen Dreiecken', level: lvl, q: 'Das Dreieck A′B′C′ ist zum Dreieck ABC ähnlich (A entspricht A′, B entspricht B′, C entspricht C′). Berechne die fehlende Seite ' + nm[ask] + '.' + pr.svg,
        inputs: [{ kind: 'num', label: nm[ask] + ' =', unit: 'cm', answer: x }],
        hints: ['Bestimme zuerst den Ähnlichkeitsfaktor k aus einem bekannten Seitenpaar: ' + nm[giv] + ' gehört zu ' + on[giv] + '.', 'k = ' + cm(k * sides[giv]) + ' : ' + cm(sides[giv]) + ' = ' + f(k) + '.', nm[ask] + ' gehört zu ' + on[ask] + ' = ' + cm(sides[ask]) + '. Rechne ' + f(k) + ' · ' + cm(sides[ask]) + '.'],
        solution: 'k = ' + nm[giv] + ' : ' + on[giv] + ' = ' + f(k * sides[giv]) + ' : ' + f(sides[giv]) + ' = ' + f(k) + '. ' + nm[ask] + ' = k · ' + on[ask] + ' = ' + f(k) + ' · ' + cm(sides[ask]) + ' = <b>' + cm(x) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], sides[ask] + k * sides[giv] - sides[giv]) ) return 'Du hast den Unterschied addiert. Bei ähnlichen Figuren werden alle Seiten mit demselben Faktor <b>multipliziert</b>.'; if (isNum(v[0], sides[ask] / k)) return 'Du hast durch k geteilt. Das gesuchte Dreieck ist das Bild, also rechnest du mal k.'; return null; },
        verify: function () { var S = [[pr.B[1], pr.B[2]], [pr.B[0], pr.B[2]], [pr.B[0], pr.B[1]]]; return near(dist(S[ask][0], S[ask][1]), x) && near(dist(S[giv][0], S[giv][1]), k * sides[giv]) ? true : 'Zeichnung passt nicht'; } };
    },
    viereck: function (lvl) {
      var m = M.pick([1, 2]), k = M.pick([1.5, 2, 2.5, 3]), a = 6 * m, h = 4 * m, c = 3 * m, d = 5 * m;
      if (Math.random() < 0.5) { k = 0.5; m = 2; a = 12; h = 8; c = 6; d = 10; }
      var Q = [[0, 0], [a, 0], [c, h], [0, h]], gap = Math.max(2.4, a * 0.35), R = Q.map(function (p) { return [p[0] * k + a + gap, p[1] * k]; });
      var cc = centroid(Q), cr = centroid(R);
      var items = [{ t: 'poly', p: Q }, { t: 'side', a: Q[0], b: Q[1], ref: cc, s: cm(a) }, { t: 'side', a: Q[1], b: Q[2], ref: cc, s: cm(d) }, { t: 'side', a: Q[2], b: Q[3], ref: cc, s: cm(c) }, { t: 'side', a: Q[3], b: Q[0], ref: cc, s: cm(h) },
        { t: 'poly', p: R, fill: '#dff3ef', color: C_GRN }, { t: 'side', a: R[0], b: R[1], ref: cr, s: cm(k * a) }, { t: 'side', a: R[1], b: R[2], ref: cr, s: 'x' }, { t: 'side', a: R[2], b: R[3], ref: cr, s: 'y' }].concat(rightMarks(Q), rightMarks(R, C_GRN));
      return { skill: 'Ähnliche Vierecke', level: lvl, q: 'Die beiden Trapeze sind ähnlich. Bestimme den Ähnlichkeitsfaktor k (rechtes Trapez im Vergleich zum linken) und die Seiten x und y.' + scene(items, { W: 360, H: 220, pad: 30, label: 'Zwei ähnliche Trapeze', maxw: 440 }),
        inputs: [{ kind: 'num', label: 'k =', answer: k }, { kind: 'num', label: 'x =', unit: 'cm', answer: k * d }, { kind: 'num', label: 'y =', unit: 'cm', answer: k * c }],
        hints: ['Die unteren Seiten entsprechen sich: k = ' + cm(k * a) + ' : ' + cm(a) + '.', 'k = ' + f(k) + '. x entspricht der schrägen Seite ' + cm(d) + ', y der oberen Seite ' + cm(c) + '.', 'x = ' + f(k) + ' · ' + cm(d) + ', y = ' + f(k) + ' · ' + cm(c) + '.'],
        solution: 'k = ' + f(k * a) + ' : ' + f(a) + ' = <b>' + f(k) + '</b>. x = ' + f(k) + ' · ' + cm(d) + ' = <b>' + cm(k * d) + '</b>, y = ' + f(k) + ' · ' + cm(c) + ' = <b>' + cm(k * c) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], 1 / k)) return 'Beim Faktor hast du Original durch Bild geteilt. Gefragt ist: Seite rechts durch entsprechende Seite links.'; if (isNum(v[1], d + k * a - a) || isNum(v[2], c + k * a - a)) return 'Du hast den Unterschied addiert. Bei ähnlichen Figuren wird jede Seite mit k multipliziert.'; return null; },
        verify: function () { return near(dist(R[1], R[2]), k * d) && near(dist(R[2], R[3]), k * c) && near(dist(Q[1], Q[2]), d) ? true : 'Trapez falsch'; } };
    },
    massstab: function (lvl) {
      var n = M.pick([10000, 25000, 50000, 100000]), d = M.pick([2, 3, 4, 4.5, 6, 7.5, 8, 12, 2.5, 5]), real = d * n, km = real / 100000, useKm = km >= 1;
      var rv = useKm ? km : real / 100, ru = useKm ? 'km' : 'm';
      if (lvl === 1 || Math.random() < 0.5) return { skill: 'Maßstab: Karte zu Wirklichkeit', level: lvl, q: 'Auf einer Wanderkarte im Maßstab <b>1 : ' + f(n) + '</b> ist ein Weg ' + cm(d) + ' lang. Wie lang ist der Weg in Wirklichkeit?',
        inputs: [{ kind: 'num', label: 'Länge in Wirklichkeit', unit: ru, answer: rv }],
        hints: ['1 : ' + f(n) + ' heißt: 1 cm auf der Karte sind ' + f(n) + ' cm in Wirklichkeit.', f(d) + ' · ' + f(n) + ' cm = ' + f(real) + ' cm.', 'Rechne um: 100 cm = 1 m und 100 000 cm = 1 km. ' + f(real) + ' cm = ' + f(rv) + ' ' + ru + '.'],
        solution: f(d) + ' cm · ' + f(n) + ' = ' + f(real) + ' cm = ' + f(real / 100) + ' m' + (useKm ? ' = <b>' + f(km) + ' km</b>' : '') + '.' + (useKm ? '' : ' Also <b>' + f(rv) + ' m</b>.'),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if ([10, 100, 1000, 0.1, 0.01, 0.001].some(function (q) { return near(x, rv * q); })) return 'Die Ziffern stimmen, aber die Einheit nicht. Denke daran: 1 m = 100 cm und 1 km = 100 000 cm.'; return null; },
        verify: function () { return near(rv * (useKm ? 100000 : 100) / n, d) ? true : 'falsch'; } };
      return { skill: 'Maßstab: Wirklichkeit zu Karte', level: lvl, q: 'Zwei Orte liegen in Wirklichkeit ' + f(rv) + ' ' + ru + ' (Luftlinie) voneinander entfernt. Wie weit sind sie auf einer Karte im Maßstab <b>1 : ' + f(n) + '</b> voneinander entfernt?',
        inputs: [{ kind: 'num', label: 'Abstand auf der Karte', unit: 'cm', answer: d }],
        hints: ['Rechne die wirkliche Entfernung zuerst in cm um: ' + f(rv) + ' ' + ru + ' = ' + f(real) + ' cm.', 'Auf der Karte ist alles ' + f(n) + '-mal kleiner. Teile durch ' + f(n) + '.', f(real) + ' cm : ' + f(n) + ' = ?'],
        solution: f(rv) + ' ' + ru + ' = ' + f(real) + ' cm. ' + f(real) + ' cm : ' + f(n) + ' = <b>' + cm(d) + '</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if ([10, 100, 1000, 0.1, 0.01, 0.001].some(function (q) { return near(x, d * q); })) return 'Die Ziffern stimmen, aber die Einheit nicht. Rechne die Entfernung zuerst in cm um.'; return null; },
        verify: function () { return near(d * n, real) ? true : 'falsch'; } };
    },
    modell: function (lvl) {
      var O = M.pick([['Ein Auto', 4.5, [18, 25]], ['Ein Linienbus', 12, [50, 100]], ['Ein Wohnhaus', 15, [100, 200]], ['Ein Schiff', 60, [200, 400]], ['Ein Flugzeug', 36, [100, 200]], ['Eine Lokomotive', 17.4, [87]]]), n = M.pick(O[2]), real = O[1], mod = rd(real * 100 / n, 6);
      var mode = lvl === 1 ? 'mr' : M.pick(['mr', 'rm', 'n']);
      if (mode === 'mr') return { skill: 'Modell zu Wirklichkeit', level: lvl, q: O[0] + ' wird als Modell im Maßstab <b>1 : ' + n + '</b> nachgebaut. Das Modell ist ' + cm(mod) + ' lang. Wie lang ist das Original in Wirklichkeit?',
        inputs: [{ kind: 'num', label: 'Länge des Originals', unit: 'm', answer: real }],
        hints: ['1 : ' + n + ' heißt: Das Original ist ' + n + '-mal so groß wie das Modell.', f(mod) + ' cm · ' + n + ' = ' + f(mod * n) + ' cm.', 'Rechne in Meter um: ' + f(mod * n) + ' cm : 100.'],
        solution: f(mod) + ' cm · ' + n + ' = ' + f(rd(mod * n, 6)) + ' cm = <b>' + f(real) + ' m</b>.',
        mistakes: function (v) { if (isNum(v[0], real * 100)) return 'Das ist das Ergebnis in cm. Gefragt ist die Länge in Meter.'; if (isNum(v[0], mod / n)) return 'Das Original ist größer als das Modell. Multipliziere mit ' + n + '.'; return null; },
        verify: function () { return near(mod * n / 100, real) ? true : 'falsch'; } };
      if (mode === 'rm') return { skill: 'Wirklichkeit zu Modell', level: lvl, q: O[0] + ' ist in Wirklichkeit ' + f(real) + ' m lang. Wie lang ist ein Modell im Maßstab <b>1 : ' + n + '</b>?',
        inputs: [{ kind: 'num', label: 'Länge des Modells', unit: 'cm', answer: mod }],
        hints: ['Rechne zuerst in cm um: ' + f(real) + ' m = ' + f(real * 100) + ' cm.', 'Das Modell ist ' + n + '-mal kleiner: ' + f(real * 100) + ' cm : ' + n + '.', 'Kontrolle: Das Modell muss deutlich kleiner als das Original sein.'],
        solution: f(real) + ' m = ' + f(real * 100) + ' cm. ' + f(real * 100) + ' cm : ' + n + ' = <b>' + cm(mod) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], mod / 100)) return 'Das Ergebnis ist in Meter. Gefragt ist die Länge in cm.'; return null; },
        verify: function () { return near(mod * n, real * 100) ? true : 'falsch'; } };
      return { skill: 'Maßstab bestimmen', level: lvl, q: O[0] + ' ist in Wirklichkeit ' + f(real) + ' m lang. Das Modell davon ist ' + cm(mod) + ' lang. In welchem Maßstab wurde das Modell gebaut?',
        inputs: [{ kind: 'num', label: 'Maßstab 1 :', answer: n }],
        hints: ['Rechne beide Längen in dieselbe Einheit um: ' + f(real) + ' m = ' + f(real * 100) + ' cm.', 'Wie viel Mal passt das Modell in das Original? ' + f(real * 100) + ' cm : ' + cm(mod) + '.', 'Das Ergebnis ist die Zahl n im Maßstab 1 : n.'],
        solution: f(real * 100) + ' cm : ' + f(mod) + ' cm = ' + n + '. Der Maßstab ist <b>1 : ' + n + '</b>.',
        mistakes: function (v) { if (isNum(v[0], n / 100)) return 'Rechne beide Längen zuerst in Zentimeter um.'; return null; },
        verify: function () { return near(real * 100 / mod, n) ? true : 'falsch'; } };
    },
    winkel: function (lvl) {
      var al, be, ga; do { al = 5 * M.rnd(6, 20); be = 5 * M.rnd(6, 20); ga = 180 - al - be; } while (ga < 30 || al === be || be === ga || al === ga);
      var sim = Math.random() < 0.5, W1 = [al, be, ga], W2;
      if (sim) { W2 = M.shuffle([al, be, ga]); }
      else { var d = M.pick([-15, -10, 10, 15]), keep = M.rnd(0, 2), other = (keep + 1) % 3, third = (keep + 2) % 3; W2 = [0, 0, 0]; W2[keep] = W1[keep]; W2[other] = W1[other] + d; W2[third] = 180 - W2[keep] - W2[other]; if (W2[third] < 20 || W2.some(function (x) { return x <= 0; }) || W2.slice().sort().join() === W1.slice().sort().join()) { return gen.winkel(lvl); } W2 = M.shuffle(W2); }
      var T1 = norm(triWW(W1[0], W1[1], 6), 6), T2 = norm(triWW(W2[0], W2[1], 5), 5).map(function (p) { return [p[0], -p[1]]; }), sh = bbox(T1)[1] + 2 - bbox(T2)[0], dy = (bbox(T1)[2] + bbox(T1)[3]) / 2 - (bbox(T2)[2] + bbox(T2)[3]) / 2;
      T2 = T2.map(function (p) { return [p[0] + sh, p[1] + dy]; });
      var showIdx = M.pick([[0, 1], [0, 2], [1, 2]]), lab1 = W1.map(function (x, i) { return i < 2 ? x + '°' : null; }), lab2 = W2.map(function (x, i) { return showIdx.indexOf(i) >= 0 ? x + '°' : null; });
      var rmF = function (P, lab, col) { return rightMarks(P, col).filter(function (m) { return !lab[P.indexOf(m.v)]; }); };
      var items = triItems(T1, { names: ['A', 'B', 'C'], angles: lab1 }).concat(rmF(T1, lab1), triItems(T2, { names: ['D', 'E', 'F'], angles: lab2, fill: '#dff3ef', color: C_GRN }), rmF(T2, lab2, C_GRN));
      var m2 = 180 - W2[showIdx[0]] - W2[showIdx[1]], opts = ['Die Dreiecke sind ähnlich.', 'Die Dreiecke sind nicht ähnlich.', 'Das kann man ohne Seitenlängen nicht entscheiden.'];
      var same = W1.slice().sort().join() === W2.slice().sort().join();
      return { skill: 'Ähnlichkeit über Winkel prüfen', level: lvl, q: 'Sind die beiden Dreiecke ähnlich? Nutze die angegebenen Winkel.' + scene(items, { W: 380, H: 240, pad: 30, label: 'Zwei Dreiecke mit Winkeln', maxw: 460 }),
        inputs: [{ kind: 'mc', label: 'Entscheide', options: opts, answer: sim ? 0 : 1 }],
        hints: ['Zwei Dreiecke sind ähnlich, wenn sie in <b>zwei Winkeln</b> übereinstimmen. Der dritte Winkel stimmt dann automatisch auch.', 'Berechne den fehlenden Winkel im linken Dreieck: 180° − ' + W1[0] + '° − ' + W1[1] + '° = ' + ga + '°.', 'Berechne den fehlenden Winkel im rechten Dreieck: 180° − ' + W2[showIdx[0]] + '° − ' + W2[showIdx[1]] + '° = ' + m2 + '°. Vergleiche alle drei Winkel.'],
        solution: 'Linkes Dreieck: ' + W1.join('°, ') + '°. Rechtes Dreieck: ' + W2.slice().sort(function (x, y) { return x - y; }).join('°, ') + '°. ' + (sim ? 'Alle Winkel stimmen überein. Die Dreiecke sind <b>ähnlich</b> (es reichen schon zwei gleiche Winkel).' : 'Die Winkel stimmen nicht überein. Die Dreiecke sind <b>nicht ähnlich</b>.'),
        verify: function () { var a2 = [angAt(T2[0], T2[1], T2[2]), angAt(T2[1], T2[0], T2[2]), angAt(T2[2], T2[0], T2[1])]; return same === sim && a2.every(function (x, i) { return Math.abs(x - W2[i]) < 1e-6; }) ? true : 'Winkel falsch'; } };
    },
    dreieckWinkel: function () {
      var sides = pickTri(), k = M.pick([1.5, 2, 2.5, 0.5]); if (k === 0.5 && sides.some(function (x) { return x % 2; })) k = 2;
      var giv = M.rnd(0, 2), w = M.pick([30, 100, 150, 200, 250, 320]);
      var s2 = ['', '', '']; s2[giv] = cm(k * sides[giv]); [0, 1, 2].forEach(function (i) { if (i !== giv) s2[i] = i === (giv + 1) % 3 ? 'x' : 'y'; });
      var pr = triPair(sides, k, w, true, { s1: sides.map(function (x) { return cm(x); }), s2: s2, n2: ['D', 'E', 'F'], angles: true });
      var xi = (giv + 1) % 3, yi = (giv + 2) % 3, an = ['α (ein Bogen)', 'β (zwei Bögen)', 'den Winkel ohne Bogen'];
      return { skill: 'Hauptähnlichkeitssatz anwenden', level: 3, q: 'In den beiden Dreiecken sind gleich große Winkel mit gleichen Bögen markiert. Begründe, dass die Dreiecke ähnlich sind, und berechne x und y.' + pr.svg,
        inputs: [{ kind: 'num', label: 'x =', unit: 'cm', answer: k * sides[xi] }, { kind: 'num', label: 'y =', unit: 'cm', answer: k * sides[yi] }],
        hints: ['Die Dreiecke stimmen in zwei Winkeln überein, also sind sie ähnlich. Achtung: Das rechte Dreieck ist gedreht und gespiegelt.', 'Entsprechende Seiten liegen den gleichen Winkeln gegenüber. Die Seite ' + cm(k * sides[giv]) + ' entspricht der Seite ' + cm(sides[giv]) + '. Also k = ' + f(k * sides[giv]) + ' : ' + f(sides[giv]) + ' = ' + f(k) + '.', 'x liegt gegenüber dem gleichen Winkel wie ' + cm(sides[xi]) + ', y gegenüber dem gleichen Winkel wie ' + cm(sides[yi]) + '. Multipliziere mit ' + f(k) + '.'],
        solution: 'Zwei gleiche Winkel, also sind die Dreiecke ähnlich (Hauptähnlichkeitssatz). k = ' + f(k * sides[giv]) + ' : ' + f(sides[giv]) + ' = ' + f(k) + '. x = ' + f(k) + ' · ' + cm(sides[xi]) + ' = <b>' + cm(k * sides[xi]) + '</b>, y = ' + f(k) + ' · ' + cm(sides[yi]) + ' = <b>' + cm(k * sides[yi]) + '</b>.',
        mistakes: function (v) { if (isNum(v[0], k * sides[yi]) && isNum(v[1], k * sides[xi])) return 'Du hast x und y vertauscht. Schau genau, welchem Winkel jede Seite gegenüberliegt.'; return null; },
        verify: function () { var S = [[pr.B[1], pr.B[2]], [pr.B[0], pr.B[2]], [pr.B[0], pr.B[1]]]; return near(dist(S[xi][0], S[xi][1]), k * sides[xi]) && near(dist(S[yi][0], S[yi][1]), k * sides[yi]) && Math.abs(angAt(pr.B[0], pr.B[1], pr.B[2]) - angAt(pr.T[0], pr.T[1], pr.T[2])) < 1e-6 ? true : 'falsch'; } };
    },
    flaeche: function (lvl) {
      var s = M.pick([2, 3, 4, 5, 6]), k = M.pick([2, 3, 2.5, 1.5]), A = M.pick([4, 6, 8, 10, 12]);
      if ((k === 2.5 || k === 1.5) && A % 4) A = 8;
      return { skill: 'Flächen ähnlicher Figuren', level: lvl, q: 'Zwei Dreiecke sind ähnlich. Eine Seite des kleinen Dreiecks ist ' + cm(s) + ' lang, die entsprechende Seite des großen Dreiecks ' + cm(k * s) + '. Das kleine Dreieck hat den Flächeninhalt ' + f(A) + ' cm². Welchen Flächeninhalt hat das große Dreieck?',
        inputs: [{ kind: 'num', label: 'Flächeninhalt groß', unit: 'cm²', answer: k * k * A }],
        hints: ['Ähnlichkeitsfaktor: k = ' + cm(k * s) + ' : ' + cm(s) + ' = ' + f(k) + '.', 'Längen werden mit k multipliziert, Flächen mit k² = ' + f(k) + ' · ' + f(k) + ' = ' + f(k * k) + '.', 'Rechne ' + f(k * k) + ' · ' + f(A) + ' cm².'],
        solution: 'k = ' + f(k) + ', k² = ' + f(k * k) + '. Flächeninhalt: ' + f(k * k) + ' · ' + f(A) + ' cm² = <b>' + f(k * k * A) + ' cm²</b>.',
        mistakes: function (v) { if (isNum(v[0], k * A)) return 'Du hast die Fläche mit k multipliziert. Flächen wachsen bei ähnlichen Figuren mit <b>k²</b>, weil Grundseite und Höhe beide k-mal so lang werden.'; return null; },
        verify: function () { var T = [[0, 0], [s, 0], [0.4 * s, 2 * A / s]], B = T.map(function (p) { return [k * p[0], k * p[1]]; }), ar = function (P) { return Math.abs((P[1][0] - P[0][0]) * (P[2][1] - P[0][1]) - (P[2][0] - P[0][0]) * (P[1][1] - P[0][1])) / 2; }; return near(ar(T), A) && near(ar(B), k * k * A) ? true : 'falsch'; } };
    },
    poster: function () {
      var P = M.pick([[10, 15], [9, 12], [12, 18], [10, 12.5], [9, 13.5]]), k = M.pick([2.5, 3, 4, 5]), W = k * P[0], H = k * P[1];
      var ok = Math.random() < 0.5, k2 = M.pick([2, 3, 4, 5, 6].filter(function (x) { return x !== k; })), F = ok ? [k2 * P[0], k2 * P[1]] : M.pick([[50, 70], [30, 40], [60, 80], [40, 50], [70, 100], [20, 25]]);
      if (!ok && Math.abs(F[0] / F[1] - P[0] / P[1]) < 1e-9) F = [50, 70];
      var opts = ['Ja, denn das Seitenverhältnis ist gleich.', 'Nein, denn das Seitenverhältnis ist verschieden.'];
      return { skill: 'Fotos vergrößern (Anwendung)', level: 3, q: 'Ein Foto ist ' + cm(P[0]) + ' breit und ' + cm(P[1]) + ' hoch. Es soll ohne Verzerrung auf ' + cm(W) + ' Breite vergrößert werden.<br>a) Wie hoch wird das Poster? b) Wie viel Mal so groß ist die Fläche des Posters wie die des Fotos? c) Kann man das Foto auch auf das Format ' + cm(F[0]) + ' × ' + cm(F[1]) + ' vergrößern, ohne etwas abzuschneiden und ohne Rand?',
        inputs: [{ kind: 'num', label: 'a) Höhe', unit: 'cm', answer: H }, { kind: 'num', label: 'b) Fläche wird … mal so groß', answer: k * k }, { kind: 'mc', label: 'c) Entscheide', options: opts, answer: ok ? 0 : 1 }],
        hints: ['„Ohne Verzerrung“ heißt: Poster und Foto sind ähnlich. Der Faktor ist k = ' + cm(W) + ' : ' + cm(P[0]) + ' = ' + f(k) + '.', 'Höhe: ' + f(k) + ' · ' + cm(P[1]) + '. Die Fläche wächst mit k² = ' + f(k * k) + '.', 'Für c) vergleiche die Seitenverhältnisse: ' + f(P[0]) + ' : ' + f(P[1]) + ' und ' + f(F[0]) + ' : ' + f(F[1]) + '. Teile jeweils Breite durch Höhe.'],
        solution: 'a) k = ' + f(W) + ' : ' + f(P[0]) + ' = ' + f(k) + ', Höhe = ' + f(k) + ' · ' + cm(P[1]) + ' = <b>' + cm(H) + '</b>. b) Flächenfaktor k² = <b>' + f(k * k) + '</b>. c) ' + f(P[0]) + ' : ' + f(P[1]) + ' = ' + f(rd(P[0] / P[1], 3)) + ' und ' + f(F[0]) + ' : ' + f(F[1]) + ' = ' + f(rd(F[0] / F[1], 3)) + '. ' + (ok ? '<b>Ja</b>, die Formate sind ähnlich (Faktor ' + f(k2) + ').' : '<b>Nein</b>, die Seitenverhältnisse sind verschieden, die Formate sind nicht ähnlich.'),
        mistakes: function (v) { if (isNum(v[1], k)) return 'Bei b) hast du nur den Faktor k genommen. Breite und Höhe werden beide k-mal so groß, die Fläche also k²-mal.'; if (isNum(v[0], P[1] + W - P[0])) return 'Bei a) hast du den Unterschied addiert. Die Höhe muss mit demselben Faktor wie die Breite multipliziert werden.'; return null; },
        verify: function () { return near(W / P[0], H / P[1]) && (Math.abs(F[0] / F[1] - P[0] / P[1]) < 1e-9) === ok ? true : 'falsch'; } };
    }
  };

  /* Erklärungsfiguren */
  var exT = triSSS(4, 3, 5), exPair = (function () { var B = placeImage(exT, 1.5, 0, false, 3); var it = triItems(exT, { sides: ['4 cm', '3 cm', '5 cm'] }).concat(rightMarks(exT), triItems(B, { names: ['A′', 'B′', 'C′'], sides: ['6 cm', '4,5 cm', '7,5 cm'], fill: '#dff3ef', color: C_GRN }), rightMarks(B, C_GRN)); return scene(it, { W: 360, H: 200, pad: 28, label: 'Zwei ähnliche Dreiecke mit k = 1,5', maxw: 420 }); })();
  var exW = (function () { var T1 = triWW(50, 70, 5), T2 = triWW(50, 70, 7.5).map(function (p) { return [-p[0], p[1]]; }); var sh = bbox(T1)[1] + 3 - bbox(T2)[0]; T2 = T2.map(function (p) { return [p[0] + sh, p[1]]; }); var it = triItems(T1, { angles: ['50°', '70°', null] }).concat(triItems(T2, { names: ['D', 'E', 'F'], angles: ['50°', '70°', null], fill: '#dff3ef', color: C_GRN })); return scene(it, { W: 360, H: 200, pad: 28, label: 'Zwei Dreiecke mit gleichen Winkeln', maxw: 420 }); })();

  return {
    id: '019', title: 'Ähnliche Figuren', bereich: 'Ähnlichkeit und Pythagoras', minutes: '45 bis 60',
    vorkenntnisse: 'Zentrische Streckung, Winkelsumme im Dreieck, Längeneinheiten umrechnen',
    lead: 'Ein Modellauto sieht aus wie ein echtes Auto, nur kleiner. Du lernst, wann zwei Figuren mathematisch ähnlich sind, und berechnest fehlende Längen, Maßstäbe und Flächen.',
    einstieg: { html: '<p>Lena druckt ein Urlaubsfoto (10 cm × 15 cm) als großes Poster. Im Copyshop gibt es Poster mit 40 cm × 60 cm und mit 50 cm × 70 cm.</p><p class="note">Auf welchem Poster sieht das Foto genauso aus wie vorher, ohne dass etwas abgeschnitten oder verzerrt wird? Woran erkennst du das?</p><p>In diesem Modul lernst du, wann zwei Figuren <b>ähnlich</b> sind: gleiche Form, aber verschiedene Größe. Damit berechnest du fehlende Seiten, arbeitest mit Maßstäben auf Karten und bei Modellen und erkennst ähnliche Dreiecke schon an ihren Winkeln.</p>' },
    ziele: ['Ich erkläre, wann zwei Figuren ähnlich sind (gleiche Winkel, gleiches Seitenverhältnis).', 'Ich bestimme den Ähnlichkeitsfaktor k aus zwei entsprechenden Seiten.', 'Ich berechne fehlende Seiten in ähnlichen Figuren.', 'Ich rechne mit Maßstäben bei Karten und Modellen.', 'Ich erkenne ähnliche Dreiecke an zwei gleichen Winkeln.'],
    fachwoerter: [['ähnlich', 'Zwei Figuren sind ähnlich, wenn alle entsprechenden Winkel gleich sind und alle Seiten mit demselben Faktor k vergrößert oder verkleinert sind.'], ['Ähnlichkeitsfaktor k', 'k = Bildseite : entsprechende Originalseite. Er ist für alle Seitenpaare gleich.'], ['entsprechende Seiten', 'Seiten, die in beiden Figuren an derselben Stelle liegen, zum Beispiel gegenüber gleich großen Winkeln.'], ['Maßstab 1 : n', '1 cm in der Zeichnung (Karte, Modell) entspricht n cm in Wirklichkeit.'], ['Hauptähnlichkeitssatz', 'Stimmen zwei Dreiecke in zwei Winkeln überein, sind sie ähnlich.']],
    diagnose: [
      { q: 'Bei einer zentrischen Streckung mit k = 3 wird eine 4 cm lange Strecke …', options: ['12 cm lang', '7 cm lang', '4 cm lang', 'Weiß ich noch nicht'], answer: 0, why: 'Längen werden mit k multipliziert: 3 · 4 cm = 12 cm.', review: 'Zentrische Streckung' },
      { q: 'Zwei Winkel eines Dreiecks sind 40° und 75° groß. Wie groß ist der dritte Winkel?', options: ['65°', '115°', '75°', 'Weiß ich noch nicht'], answer: 0, why: '180° − 40° − 75° = 65°.', review: 'Winkelsumme im Dreieck (Klasse 8)' },
      { q: 'Wie viele Zentimeter sind 1 km?', options: ['100 000 cm', '1 000 cm', '10 000 cm', 'Weiß ich noch nicht'], answer: 0, why: '1 km = 1000 m und 1 m = 100 cm, also 1000 · 100 cm = 100 000 cm.', review: 'Längeneinheiten umrechnen' },
      { q: 'Was ergibt 7,5 : 2,5?', options: ['3', '5', '2,5', 'Weiß ich noch nicht'], answer: 0, why: '2,5 · 3 = 7,5.', review: 'Dezimalzahlen dividieren' }],
    erklaerung:
      '<h3>1. Was heißt ähnlich?</h3><p>Im Alltag sagt man „ähnlich“, wenn sich Dinge etwas gleichen. In der Mathematik ist das genauer: Zwei Figuren sind <b>ähnlich</b>, wenn die eine eine maßstabsgetreue Vergrößerung oder Verkleinerung der anderen ist. Sie darf dabei auch gedreht oder gespiegelt sein.</p>' + exPair +
      '<div class="merk"><b>Merke:</b> Zwei Figuren sind ähnlich, wenn<br>1. alle entsprechenden <b>Winkel gleich groß</b> sind und<br>2. alle entsprechenden Seiten im <b>gleichen Verhältnis</b> stehen: <span class="big-math">k = a′ : a = b′ : b = c′ : c</span></div>' +
      '<p>Im Beispiel ist 6 : 4 = 4,5 : 3 = 7,5 : 5 = 1,5. Der Ähnlichkeitsfaktor ist k = 1,5.</p>' +
      '<h3>2. Fehlende Seiten berechnen</h3><ol><li>Suche ein Paar <b>entsprechender</b> Seiten, deren Längen du beide kennst.</li><li>Berechne k = Bildseite : Originalseite.</li><li>Multipliziere die passende Originalseite mit k (oder teile die Bildseite durch k).</li></ol><p class="note"><b>Typischer Fehler:</b> Ein Rechteck 4 cm × 6 cm wird nicht ähnlich zu 6 cm × 8 cm, nur weil beide Seiten um 2 cm größer sind. Ähnlich bedeutet: <b>multiplizieren</b>, nicht addieren. Ähnlich wäre 6 cm × 9 cm (Faktor 1,5).</p>' +
      '<h3>3. Maßstab</h3><p>Karten, Baupläne und Modelle sind ähnliche Verkleinerungen der Wirklichkeit. Der Maßstab <b>1 : 25 000</b> bedeutet: 1 cm auf der Karte sind 25 000 cm = 250 m in Wirklichkeit. Rechne immer zuerst in dieselbe Einheit um.</p>' +
      '<h3>4. Ähnliche Dreiecke erkennen</h3><p>Bei Dreiecken reicht schon weniger: Stimmen zwei Winkel überein, ist auch der dritte gleich (Winkelsumme 180°). Dann sind die Dreiecke ähnlich.</p>' + exW +
      '<div class="merk"><b>Merke (Hauptähnlichkeitssatz):</b> Zwei Dreiecke, die in <b>zwei Winkeln</b> übereinstimmen, sind ähnlich. Entsprechende Seiten liegen dann gleich großen Winkeln gegenüber.</div>' +
      '<p class="note">Flächen ähnlicher Figuren wachsen wie bei der zentrischen Streckung mit <b>k²</b>.</p>',
    entdecken: {
      html: '<p>Das linke Rechteck ist 2 cm × 3 cm groß. Verändere Breite und Höhe des rechten Rechtecks. Wann sind die beiden Rechtecke ähnlich?</p><div class="ctl"><label>Breite = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="8" step="1" value="3"></label><label>Höhe = <b id="v_h"></b> <input type="range" id="r_h" min="1.5" max="9" step="1.5" value="1.5"></label></div><div id="e_g"></div><p id="e_t"></p><p class="note">Finde mindestens zwei verschiedene Rechtecke, die zum linken ähnlich sind. Was fällt dir an den Verhältnissen auf?</p>',
      init: function (root, done) {
        var n = 0, found = {};
        function draw() {
          var b = +root.querySelector('#r_b').value, h = +root.querySelector('#r_h').value, R = [[5, 0], [5 + b, 0], [5 + b, h], [5, h]], Q = [[0, 0], [2, 0], [2, 3], [0, 3]];
          root.querySelector('#v_b').textContent = cm(b); root.querySelector('#v_h').textContent = cm(h);
          var sim = Math.abs(b / 2 - h / 3) < 1e-9;
          if (sim) found[b] = 1;
          var it = [{ t: 'poly', p: Q }, { t: 'side', a: Q[0], b: Q[1], ref: [1, 1.5], s: '2 cm' }, { t: 'side', a: Q[0], b: Q[3], ref: [1, 1.5], s: '3 cm' }, { t: 'poly', p: R, fill: sim ? '#dff3ef' : '#fde7c4', color: sim ? C_GRN : C_ACC }, { t: 'side', a: R[0], b: R[1], ref: centroid(R), s: cm(b) }, { t: 'side', a: R[1], b: R[2], ref: centroid(R), s: cm(h) }, { t: 'seg', a: [0, 0], b: [2, 3], color: C_LINE, dash: '4 3', w: 1.2 }, { t: 'seg', a: R[0], b: R[2], color: sim ? C_GRN : C_ACC, dash: '4 3', w: 1.2 }].concat(rightMarks(Q).slice(0, 1), rightMarks(R, sim ? C_GRN : C_ACC).slice(0, 1));
          root.querySelector('#e_g').innerHTML = scene(it, { bounds: [-1, 14, -0.6, 10.6], W: 340, H: 250, pad: 10, label: 'Zwei Rechtecke im Vergleich', maxw: 420 });
          root.querySelector('#e_t').innerHTML = 'Breite: ' + f(b) + ' : 2 = <b>' + f(rd(b / 2, 3)) + '</b>, Höhe: ' + f(h) + ' : 3 = <b>' + f(rd(h / 3, 3)) + '</b>. ' + (sim ? '<b style="color:#0f766e">Gleicher Faktor k = ' + f(b / 2) + ': Die Rechtecke sind ähnlich.</b> Die Diagonalen sind parallel.' : 'Verschiedene Faktoren: nicht ähnlich.');
        }
        function step() { draw(); n++; if (n >= 3) done('Gut erkundet: Ähnlich sind die Rechtecke nur, wenn Breite und Höhe mit <b>demselben</b> Faktor k multipliziert werden, zum Beispiel 4 cm × 6 cm (k = 2) oder 6 cm × 9 cm (k = 3).'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        draw();
      }
    },
    beispiel: { title: 'Fehlende Seite berechnen', q: 'Die Dreiecke ABC und A′B′C′ sind ähnlich. Es ist AB = 5 cm, AC = 3 cm und A′B′ = 7,5 cm. Wie lang ist A′C′?',
      steps: ['Entsprechendes Seitenpaar mit bekannten Längen suchen: AB = 5 cm und A′B′ = 7,5 cm.', 'Ähnlichkeitsfaktor berechnen: k = 7,5 cm : 5 cm = 1,5.', 'A′C′ entspricht AC = 3 cm. Also A′C′ = 1,5 · 3 cm.', 'Ergebnis: <b>A′C′ = 4,5 cm</b>.', 'Kontrolle über das Verhältnis: 4,5 : 3 = 1,5 und 7,5 : 5 = 1,5. Beide Verhältnisse sind gleich.' + exPair] },
    tasks: { gen: gen, plan: { G: ['erkennen:1', 'seite:1', 'massstab:1', 'modell:1'], S: ['erkennen:1', 'seite:1', 'seite:2', 'massstab:2', 'winkel:2'], E: ['seite:2', 'viereck:2', 'winkel:2', 'dreieckWinkel:3', 'massstab:2', 'flaeche:3'] },
      extra: 'poster', test: ['erkennen:1', 'seite:2', 'viereck:2', 'massstab:2', 'winkel:2', 'modell:2'] },
    lerncheck: ['Ich erkenne ähnliche Figuren an gleichen Winkeln und gleichen Seitenverhältnissen.', 'Ich berechne fehlende Seiten mit dem Ähnlichkeitsfaktor.', 'Ich rechne mit Maßstäben auf Karten und bei Modellen.', 'Ich erkenne ähnliche Dreiecke an zwei gleichen Winkeln.']
  };
})();
