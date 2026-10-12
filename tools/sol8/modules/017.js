/* Modul 017 · Dreiecke konstruieren */
var MODULE = (function () {
  /* ---------- Zeichenhilfen für maßstabsgetreue Figuren (nach dem Vorbild von Modul 016, im Modul enthalten) ---------- */
  var D2R = Math.PI / 180, C_LINE = '#3d2a73', C_FILL = '#efeafb', C_ACC = '#d97706', C_HI = '#5b3fa0', C_TXT = '#1c1830', C_MUT = '#5a5670', C_RED = '#b91c1c', C_GRN = '#0f766e';
  function deg(x) { return M.fmtNum(x) + '°'; }
  function cm(x, u) { return M.fmtNum(x) + ' ' + (u || 'cm'); }
  function dist(p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); }
  function mid(p, q) { return [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]; }
  function angAt(v, p, q) { var a = [p[0] - v[0], p[1] - v[1]], b = [q[0] - v[0], q[1] - v[1]]; var c = (a[0] * b[0] + a[1] * b[1]) / (Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1])); return Math.acos(Math.max(-1, Math.min(1, c))) / D2R; }
  /* Dreieck aus drei Seiten: A(0|0), B(c|0), C oberhalb; a = BC, b = AC */
  function triSSS(a, b, c) { var x = (b * b + c * c - a * a) / (2 * c); return [[0, 0], [c, 0], [x, Math.sqrt(Math.max(0, b * b - x * x))]]; }
  /* Dreieck aus zwei Winkeln an der Seite c */
  function triWW(al, be, c) { c = c || 10; var ga = 180 - al - be, b = c * Math.sin(be * D2R) / Math.sin(ga * D2R); return [[0, 0], [c, 0], [b * Math.cos(al * D2R), b * Math.sin(al * D2R)]]; }
  /* Dreieck drehen, sodass die längste Seite waagerecht unten liegt (Winkel und Längen bleiben gleich) */
  function orient(T) {
    var best = 0, L = -1; for (var i = 0; i < 3; i++) { var d0 = dist(T[i], T[(i + 1) % 3]); if (d0 > L) { L = d0; best = i; } }
    var p = T[best], q = T[(best + 1) % 3], w = -Math.atan2(q[1] - p[1], q[0] - p[0]), c = Math.cos(w), sn = Math.sin(w);
    var R = T.map(function (z) { var x = z[0] - p[0], y = z[1] - p[1]; return [x * c - y * sn, x * sn + y * c]; });
    var o = R[(best + 2) % 3]; if (o[1] < 0) R = R.map(function (z) { return [z[0], -z[1]]; });
    return R;
  }
  function centroid(P) { return [P.reduce(function (s, p) { return s + p[0]; }, 0) / P.length, P.reduce(function (s, p) { return s + p[1]; }, 0) / P.length]; }
  function circum(A, B, C) {
    var d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
    var a2 = A[0] * A[0] + A[1] * A[1], b2 = B[0] * B[0] + B[1] * B[1], c2 = C[0] * C[0] + C[1] * C[1];
    return [(a2 * (B[1] - C[1]) + b2 * (C[1] - A[1]) + c2 * (A[1] - B[1])) / d, (a2 * (C[0] - B[0]) + b2 * (A[0] - C[0]) + c2 * (B[0] - A[0])) / d];
  }
  function incircle(A, B, C) {
    var a = dist(B, C), b = dist(A, C), c = dist(A, B), s = a + b + c;
    var area = Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) / 2;
    return { c: [(a * A[0] + b * B[0] + c * C[0]) / s, (a * A[1] + b * B[1] + c * C[1]) / s], r: 2 * area / s };
  }
  function foot(P, A, B) { var dx = B[0] - A[0], dy = B[1] - A[1], t = ((P[0] - A[0]) * dx + (P[1] - A[1]) * dy) / (dx * dx + dy * dy); return [A[0] + t * dx, A[1] + t * dy]; }
  function textW(s, size) { return String(s).replace(/<[^>]+>/g, '').length * size * 0.6; }
  /* Szene zeichnen. Weltkoordinaten (y nach oben), gleicher Maßstab in x und y.
     o: W, H (Höchsthöhe), pad, bounds [xmin,xmax,ymin,ymax], grid (Gitter mit Achsen), gridStep (Beschriftung), label, maxw, note */
  function scene(items, o) {
    o = o || {};
    var W = o.W || 340, Hmax = o.H || 240, pad = o.pad == null ? 30 : o.pad, bx = o.bounds;
    if (!bx) {
      var xs = [], ys = [];
      var add = function (p) { xs.push(p[0]); ys.push(p[1]); };
      items.forEach(function (it) {
        if (it.nofit) return;
        if (it.t === 'poly') it.p.forEach(add);
        else if (it.t === 'seg') { add(it.a); add(it.b); }
        else if (it.t === 'circle') { add([it.c[0] - it.r, it.c[1] - it.r]); add([it.c[0] + it.r, it.c[1] + it.r]); }
        else if (it.t === 'arc') { for (var w = it.a1; w <= it.a2 + 0.01; w += Math.max(1, (it.a2 - it.a1) / 24)) add([it.c[0] + it.r * Math.cos(w * D2R), it.c[1] + it.r * Math.sin(w * D2R)]); }
        else if (it.t === 'pt') add(it.p);
      });
      bx = [Math.min.apply(null, xs), Math.max.apply(null, xs), Math.min.apply(null, ys), Math.max.apply(null, ys)];
    }
    var sw = (bx[1] - bx[0]) || 1, sh = (bx[3] - bx[2]) || 1;
    var s = Math.min((W - 2 * pad) / sw, (Hmax - 2 * pad) / sh);
    var H = Math.round(sh * s + 2 * pad), ox = pad + ((W - 2 * pad) - sw * s) / 2;
    function X(x) { return ox + (x - bx[0]) * s; }
    function Y(y) { return H - pad - (y - bx[2]) * s; }
    function P(p) { return [X(p[0]), Y(p[1])]; }
    function f(v) { return Math.round(v * 10) / 10; }
    var g = '', labels = [], obst = [];
    if (o.grid) {
      var x0 = Math.ceil(bx[0]), x1 = Math.floor(bx[1]), y0 = Math.ceil(bx[2]), y1 = Math.floor(bx[3]), st = o.gridStep || 1;
      for (var i = x0; i <= x1; i++) g += '<line x1="' + f(X(i)) + '" y1="' + f(Y(bx[2])) + '" x2="' + f(X(i)) + '" y2="' + f(Y(bx[3])) + '" stroke="#e3dcf2"/>';
      for (var j = y0; j <= y1; j++) g += '<line x1="' + f(X(bx[0])) + '" y1="' + f(Y(j)) + '" x2="' + f(X(bx[1])) + '" y2="' + f(Y(j)) + '" stroke="#e3dcf2"/>';
      if (bx[2] <= 0 && bx[3] >= 0) { g += '<line x1="' + f(X(bx[0])) + '" y1="' + f(Y(0)) + '" x2="' + f(X(bx[1])) + '" y2="' + f(Y(0)) + '" stroke="#1c1830" stroke-width="1.5"/><text x="' + f(X(bx[1]) - 3) + '" y="' + f(Y(0) - 6) + '" font-size="12" font-weight="700" text-anchor="end">x</text>'; obst.push([X(bx[1]) - 12, Y(0) - 17, X(bx[1]), Y(0) - 3]); }
      if (bx[0] <= 0 && bx[1] >= 0) { g += '<line x1="' + f(X(0)) + '" y1="' + f(Y(bx[2])) + '" x2="' + f(X(0)) + '" y2="' + f(Y(bx[3])) + '" stroke="#1c1830" stroke-width="1.5"/><text x="' + f(X(0) + 6) + '" y="' + f(Y(bx[3]) + 11) + '" font-size="12" font-weight="700">y</text>'; obst.push([X(0) + 4, Y(bx[3]), X(0) + 16, Y(bx[3]) + 14]); }
      var ya = (bx[2] <= 0 && bx[3] >= 0) ? 0 : y0, xa = (bx[0] <= 0 && bx[1] >= 0) ? 0 : x0;
      for (var k = x0; k <= x1; k++) if (k !== xa && k % st === 0 && k < x1) { g += '<text x="' + f(X(k)) + '" y="' + f(Y(ya) + 13) + '" font-size="10" text-anchor="middle" fill="#5a5670">' + (k < 0 ? '−' + (-k) : k) + '</text>'; obst.push([X(k) - 6, Y(ya) + 4, X(k) + 6, Y(ya) + 15]); }
      for (var m = y0; m <= y1; m++) if (m !== ya && m % st === 0 && m < y1) { g += '<text x="' + f(X(xa) - 4) + '" y="' + f(Y(m) + 4) + '" font-size="10" text-anchor="end" fill="#5a5670">' + (m < 0 ? '−' + (-m) : m) + '</text>'; obst.push([X(xa) - 16, Y(m) - 5, X(xa) - 2, Y(m) + 6]); }
      if (xa === 0 && ya === 0) g += '<text x="' + f(X(0) - 4) + '" y="' + f(Y(0) + 13) + '" font-size="10" text-anchor="end" fill="#5a5670">0</text>';
    }
    function clipLine(p, q, ray) { /* Liang-Barsky im Pixelraum */
      var dx = q[0] - p[0], dy = q[1] - p[1], t0 = ray ? 0 : -1e4, t1 = 1e4;
      var cs = [[-dx, p[0] - 1], [dx, W - 1 - p[0]], [-dy, p[1] - 1], [dy, H - 1 - p[1]]];
      for (var c = 0; c < 4; c++) { var pp = cs[c][0], qq = cs[c][1]; if (Math.abs(pp) < 1e-12) { if (qq < 0) return null; continue; } var r = qq / pp; if (pp < 0) { if (r > t1) return null; if (r > t0) t0 = r; } else { if (r < t0) return null; if (r < t1) t1 = r; } }
      return [[p[0] + t0 * dx, p[1] + t0 * dy], [p[0] + t1 * dx, p[1] + t1 * dy]];
    }
    function stroke(it, def, w) { return ' stroke="' + (it.color || def) + '" stroke-width="' + (it.w || w) + '"' + (it.dash ? ' stroke-dasharray="' + (it.dash === true ? '6 4' : it.dash) + '"' : ''); }
    items.forEach(function (it) {
      var a, b, c;
      if (it.t === 'poly') g += '<polygon points="' + it.p.map(function (q) { var z = P(q); return f(z[0]) + ',' + f(z[1]); }).join(' ') + '" fill="' + (it.fill || C_FILL) + '"' + (it.op ? ' fill-opacity="' + it.op + '"' : '') + stroke(it, C_LINE, 2.5) + ' stroke-linejoin="round"/>';
      else if (it.t === 'seg') { a = P(it.a); b = P(it.b); g += '<line x1="' + f(a[0]) + '" y1="' + f(a[1]) + '" x2="' + f(b[0]) + '" y2="' + f(b[1]) + '"' + stroke(it, C_LINE, 2) + ' stroke-linecap="round"/>'; }
      else if (it.t === 'line' || it.t === 'ray') { c = clipLine(P(it.a), P(it.b), it.t === 'ray'); if (c) g += '<line x1="' + f(c[0][0]) + '" y1="' + f(c[0][1]) + '" x2="' + f(c[1][0]) + '" y2="' + f(c[1][1]) + '"' + stroke(it, C_HI, 2) + '/>'; }
      else if (it.t === 'circle') { a = P(it.c); g += '<circle cx="' + f(a[0]) + '" cy="' + f(a[1]) + '" r="' + f(it.r * s) + '" fill="' + (it.fill || 'none') + '"' + stroke(it, C_HI, 2) + '/>'; }
      else if (it.t === 'arc') {
        a = P([it.c[0] + it.r * Math.cos(it.a1 * D2R), it.c[1] + it.r * Math.sin(it.a1 * D2R)]); b = P([it.c[0] + it.r * Math.cos(it.a2 * D2R), it.c[1] + it.r * Math.sin(it.a2 * D2R)]);
        g += '<path d="M' + f(a[0]) + ' ' + f(a[1]) + ' A' + f(it.r * s) + ' ' + f(it.r * s) + ' 0 ' + (it.a2 - it.a1 > 180 ? 1 : 0) + ' 0 ' + f(b[0]) + ' ' + f(b[1]) + '" fill="none"' + stroke(it, C_ACC, 1.8) + '/>';
      }
      else if (it.t === 'angle') {
        var v = P(it.v), pa = P(it.a), pb = P(it.b);
        var a1 = Math.atan2(pa[1] - v[1], pa[0] - v[0]), a2 = Math.atan2(pb[1] - v[1], pb[0] - v[0]);
        var d = ((a2 - a1 + 3 * Math.PI) % (2 * Math.PI)) - Math.PI, bis = a1 + d / 2, col = it.color || C_ACC, r = it.r || (Math.abs(d) < 0.61 ? 32 : Math.abs(d) < 0.87 ? 27 : 22);
        var lab = null;
        if (it.label) {
          var half = Math.abs(d) / 2, lsz = it.size || 13, tw = textW(it.label, lsz), bc = Math.cos(bis), bs = Math.sin(bis), lc = it.lcolor || (String(it.label).indexOf('?') >= 0 ? C_RED : C_TXT);
          var extN = Math.abs(bs) * (tw / 2 + 2) + Math.abs(bc) * (lsz / 2 + 2), extB = Math.abs(bc) * (tw / 2 + 2) + Math.abs(bs) * (lsz / 2 + 2);
          /* Platz bis zur gegenüberliegenden Seite (Strecke pa-pb) */
          var ex = pb[0] - pa[0], ey = pb[1] - pa[1], den = bc * ey - bs * ex, avail = 1e9;
          if (Math.abs(den) > 1e-9) { var tt = ((pa[0] - v[0]) * ey - (pa[1] - v[1]) * ex) / den; if (tt > 0) avail = tt; }
          var need = Math.max(r + 6 + extB, extN / Math.tan(Math.max(half, 0.05)) + extB), dd = it.ld || Math.min(need, 90);
          if (!it.ld && !it.inside && dd + extB > avail - 3 && !it.r) { /* engen Platz: kleineren Bogen versuchen */
            var r2 = Math.max(12, Math.min(r, avail - 2 * extB - 8)), need2 = Math.max(r2 + 4 + extB, extN / Math.tan(Math.max(half, 0.05)) + extB);
            if (need2 + extB <= avail - 2) { r = r2; dd = need2; }
          }
          var outside = !it.ld && !it.inside && dd + extB > avail - 3;
          if (outside) { var ext = r * 0.4 + 12 + Math.abs(bc) * tw / 2 + Math.abs(bs) * lsz * 0.45; lab = { x: v[0] - ext * bc, y: v[1] - ext * bs, s: it.label, dir: [-bc, -bs], size: lsz, bold: true, color: lc }; }
          else lab = { x: v[0] + dd * bc, y: v[1] + dd * bs, s: it.label, dir: [bc, bs], size: lsz, bold: true, color: lc };
        }
        if (Math.abs(Math.abs(d) - Math.PI / 2) < 0.009 && !it.noRight) {
          var q = Math.min(r, 22) * 0.62, u1 = [Math.cos(a1), Math.sin(a1)], u2 = [Math.cos(a2), Math.sin(a2)];
          g += '<path d="M' + f(v[0] + q * u1[0]) + ' ' + f(v[1] + q * u1[1]) + ' L' + f(v[0] + q * (u1[0] + u2[0])) + ' ' + f(v[1] + q * (u1[1] + u2[1])) + ' L' + f(v[0] + q * u2[0]) + ' ' + f(v[1] + q * u2[1]) + '" fill="none" stroke="' + col + '" stroke-width="2"/><circle cx="' + f(v[0] + q * 0.5 * (u1[0] + u2[0])) + '" cy="' + f(v[1] + q * 0.5 * (u1[1] + u2[1])) + '" r="1.8" fill="' + col + '"/>';
        } else {
          g += '<path d="M' + f(v[0] + r * Math.cos(a1)) + ' ' + f(v[1] + r * Math.sin(a1)) + ' A' + r + ' ' + r + ' 0 0 ' + (d > 0 ? 1 : 0) + ' ' + f(v[0] + r * Math.cos(a2)) + ' ' + f(v[1] + r * Math.sin(a2)) + '" fill="' + (it.fill || 'none') + '" stroke="' + col + '" stroke-width="2"/>';
        }
        if (lab) labels.push(lab);
      }
      else if (it.t === 'tick') {
        a = P(it.a); b = P(it.b); var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, L = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, ux = (b[0] - a[0]) / L, uy = (b[1] - a[1]) / L, n = it.n || 1;
        for (var z = 0; z < n; z++) { var o2 = (z - (n - 1) / 2) * 5; g += '<line x1="' + f(mx + o2 * ux - 6 * uy) + '" y1="' + f(my + o2 * uy + 6 * ux) + '" x2="' + f(mx + o2 * ux + 6 * uy) + '" y2="' + f(my + o2 * uy - 6 * ux) + '" stroke="' + (it.color || C_LINE) + '" stroke-width="2"/>'; }
      }
      else if (it.t === 'pt') {
        a = P(it.p); g += '<circle cx="' + f(a[0]) + '" cy="' + f(a[1]) + '" r="' + (it.r || 4) + '" fill="' + (it.color || C_HI) + '" stroke="#fff" stroke-width="1.5"/>';
        obst.push([a[0] - 5, a[1] - 5, a[0] + 5, a[1] + 5]);
        if (it.s) { var dir = it.dir || [0.7, -0.7], dl = Math.hypot(dir[0], dir[1]) || 1; labels.push({ x: a[0] + (it.off || 14) * dir[0] / dl, y: a[1] + (it.off || 14) * dir[1] / dl, s: it.s, dir: [dir[0] / dl, dir[1] / dl], size: it.size || 13, bold: true, color: it.lcolor || it.color || C_HI }); }
      }
      else if (it.t === 'vname' || it.t === 'side') {
        var ref = P(it.ref), base = it.t === 'vname' ? P(it.p) : P(mid(it.a, it.b)), ddx = base[0] - ref[0], ddy = base[1] - ref[1];
        if (it.t === 'side') { a = P(it.a); b = P(it.b); var nx = -(b[1] - a[1]), ny = b[0] - a[0], nl = Math.hypot(nx, ny) || 1; nx /= nl; ny /= nl; if (nx * ddx + ny * ddy < 0) { nx = -nx; ny = -ny; } ddx = nx; ddy = ny; }
        var dl2 = Math.hypot(ddx, ddy) || 1; ddx /= dl2; ddy /= dl2;
        var size = it.size || (it.t === 'vname' ? 13 : 12), off = (it.off || (it.t === 'vname' ? 13 : 9)) + Math.abs(ddx) * textW(it.s, size) / 2 + Math.abs(ddy) * size * 0.35;
        labels.push({ x: base[0] + off * ddx, y: base[1] + off * ddy, s: it.s, dir: [ddx, ddy], size: size, bold: it.t === 'side', color: it.color || (it.t === 'vname' ? C_MUT : C_TXT) });
      }
      else if (it.t === 'text') { a = P(it.p); labels.push({ x: a[0] + (it.dx || 0), y: a[1] + (it.dy || 0), s: it.s, dir: it.dir || [0, -1], size: it.size || 12, bold: it.bold, color: it.color || C_TXT, anchor: it.anchor, fixed: it.fixed }); }
    });
    /* Beschriftungen ohne Überlappung setzen */
    var placed = obst.slice();
    if (o.note) { var nw = textW(o.note, 10); placed.push([W - nw - 6, 1, W - 1, 15]); g += '<text x="' + (W - 4) + '" y="12" font-size="10" text-anchor="end" fill="#5a5670">' + o.note + '</text>'; }
    function box(L, x, y) { var w = textW(L.s, L.size) + 4, h = L.size + 2; var left = L.anchor === 'start' ? x - 2 : L.anchor === 'end' ? x - w + 2 : x - w / 2; return [left, y - h / 2, left + w, y + h / 2]; }
    function hit(bb) { return placed.some(function (p) { return bb[0] < p[2] && bb[2] > p[0] && bb[1] < p[3] && bb[3] > p[1]; }); }
    labels.forEach(function (L) {
      var best = null, cands = [[0, 0]];
      if (!L.fixed) for (var st2 = 1; st2 <= 5; st2++) { var e = st2 * 8; cands.push([L.dir[0] * e, L.dir[1] * e], [-L.dir[1] * e, L.dir[0] * e], [L.dir[1] * e, -L.dir[0] * e], [0, -e], [0, e], [e, 0], [-e, 0]); }
      for (var c = 0; c < cands.length; c++) {
        var x = L.x + cands[c][0], y = L.y + cands[c][1], bb = box(L, x, y);
        if (bb[0] < 1 || bb[2] > W - 1 || bb[1] < 1 || bb[3] > H - 1) { if (!best) best = [x, y, bb]; continue; }
        if (!hit(bb)) { best = [x, y, bb]; break; }
      }
      var bb2 = best[2];
      if (bb2[0] < 1) { best[0] += 1 - bb2[0]; } if (bb2[2] > W - 1) { best[0] -= bb2[2] - W + 1; } if (bb2[1] < 1) { best[1] += 1 - bb2[1]; } if (bb2[3] > H - 1) { best[1] -= bb2[3] - H + 1; }
      placed.push(box(L, best[0], best[1]));
      g += '<text x="' + f(best[0]) + '" y="' + f(best[1] + L.size * 0.36) + '" font-size="' + L.size + '"' + (L.bold ? ' font-weight="700"' : '') + ' text-anchor="' + (L.anchor || 'middle') + '" fill="' + L.color + '" stroke="#fff" stroke-width="3" stroke-linejoin="round" paint-order="stroke">' + L.s + '</text>';
    });
    return '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Zeichnung') + '" style="max-width:' + (o.maxw || 420) + 'px">' + g + '</svg>';
  }
  /* Dreieck mit Ecknamen, optional Seiten- und Winkelbeschriftungen und Strichmarken */
  function triItems(T, o) {
    o = o || {}; var c = centroid(T), names = o.names || ['A', 'B', 'C'], it = [{ t: 'poly', p: T, fill: o.fill, color: o.color }];
    var sides = o.sides || [], angles = o.angles || [], ticks = o.ticks || [];
    /* Seiten: 0 = a (BC), 1 = b (AC), 2 = c (AB) */
    var S = [[T[1], T[2]], [T[0], T[2]], [T[0], T[1]]];
    ticks.forEach(function (n, i) { if (n) it.push({ t: 'tick', a: S[i][0], b: S[i][1], n: n }); });
    angles.forEach(function (lab, i) { if (lab !== null && lab !== undefined) it.push({ t: 'angle', v: T[i], a: T[(i + 1) % 3], b: T[(i + 2) % 3], label: lab, color: o.acolor }); });
    if (!o.noNames) names.forEach(function (n, i) { it.push({ t: 'vname', p: T[i], ref: c, s: n }); });
    sides.forEach(function (lab, i) { if (lab) it.push({ t: 'side', a: S[i][0], b: S[i][1], ref: c, s: lab, color: o.scolor }); });
    return it;
  }
  /* Optionen für „Reihenfolge ordnen“: korrekte Reihenfolge + 3 falsche, keine gültige als Ablenker */
  function orderTask(steps, valid, skill, intro, extraHint) {
    var letters = 'ABCDEFG'.split(''), n = steps.length, perm = M.shuffle(steps.map(function (s, i) { return i; }));
    var lab = []; perm.forEach(function (orig, pos) { lab[orig] = letters[pos]; });
    var listHtml = '<ul class="steps-list" style="list-style:none;padding-left:0">' + perm.map(function (orig, pos) { return '<li style="margin:4px 0"><b>' + letters[pos] + ':</b> ' + steps[orig] + '</li>'; }).join('') + '</ul>';
    var key = function (ord) { return ord.map(function (i) { return lab[i]; }).join(' → '); };
    var validKeys = valid.map(key), right = M.pick(valid), wrong = [];
    for (var t = 0; t < 400 && wrong.length < 3; t++) {
      var w = right.slice(), mode = t % 3;
      if (mode === 0) { var i = M.rnd(0, n - 2); var tmp = w[i]; w[i] = w[i + 1]; w[i + 1] = tmp; }
      else if (mode === 1) { w = M.shuffle(w); }
      else { var i2 = M.rnd(0, n - 1), j2 = M.rnd(0, n - 1); var tmp2 = w[i2]; w[i2] = w[j2]; w[j2] = tmp2; }
      var k = key(w); if (validKeys.indexOf(k) < 0 && wrong.indexOf(k) < 0) wrong.push(k);
    }
    var opts = M.shuffle([key(right)].concat(wrong));
    return { skill: skill, q: intro + listHtml + 'In welcher Reihenfolge gehst du vor?', inputs: [{ kind: 'mc', label: 'Richtige Reihenfolge', options: opts, answer: opts.indexOf(key(right)) }],
      hints: ['Überlege: Was muss schon gezeichnet sein, bevor du den nächsten Schritt machen kannst?', 'Der erste Schritt ist: ' + steps[0], (extraHint || 'Der letzte Schritt ist: ' + steps[n - 1])],
      solution: 'Richtige Reihenfolge: ' + key(right) + '.<ol>' + right.map(function (i) { return '<li>' + steps[i] + '</li>'; }).join('') + '</ol>',
      verify: function () { return validKeys.indexOf(opts[this.inputs[0].answer]) >= 0 && opts.filter(function (x) { return validKeys.indexOf(x) >= 0; }).length === 1 ? true : 'Reihenfolge-Optionen fehlerhaft'; } };
  }
  var SN = ['a', 'b', 'c'], AN = ['α', 'β', 'γ'], VN = ['A', 'B', 'C'];
  var SAETZE = ['SSS', 'SWS', 'WSW', 'SsW'];
  function r1(x) { return Math.round(x * 10) / 10; }
  function lawAng(opp, s1, s2) { return Math.acos((s1 * s1 + s2 * s2 - opp * opp) / (2 * s1 * s2)) / D2R; }
  /* vollständiges Dreieck zu einem Kongruenzsatz mit zufälliger Benennung erzeugen */
  function makeData(type) {
    for (var t = 0; t < 2000; t++) {
      var S = [0, 0, 0], A = [0, 0, 0], gs = [], ga = [], i = M.rnd(0, 2), j = (i + 1) % 3, k = (i + 2) % 3;
      if (type === 'SSS') { S = [M.rnd(3, 10), M.rnd(3, 10), M.rnd(3, 10)]; gs = [0, 1, 2]; }
      else if (type === 'SWS') { S[j] = M.rnd(3, 10); S[k] = M.rnd(3, 10); A[i] = 5 * M.rnd(6, 24); S[i] = Math.sqrt(S[j] * S[j] + S[k] * S[k] - 2 * S[j] * S[k] * Math.cos(A[i] * D2R)); gs = [j, k]; ga = [i]; }
      else if (type === 'WSW') { S[i] = M.rnd(4, 10); A[j] = 5 * M.rnd(6, 20); A[k] = 5 * M.rnd(6, 20); A[i] = 180 - A[j] - A[k]; if (A[i] < 25) continue; S[j] = S[i] * Math.sin(A[j] * D2R) / Math.sin(A[i] * D2R); S[k] = S[i] * Math.sin(A[k] * D2R) / Math.sin(A[i] * D2R); gs = [i]; ga = [j, k]; }
      else { /* SsW: Seite i ist die längere, Winkel gegenüber (bei Ecke i) */ S[i] = M.rnd(5, 10); S[j] = M.rnd(3, S[i] - 1); A[i] = 5 * M.rnd(8, 24); A[j] = Math.asin(S[j] * Math.sin(A[i] * D2R) / S[i]) / D2R; A[k] = 180 - A[i] - A[j]; S[k] = S[i] * Math.sin(A[k] * D2R) / Math.sin(A[i] * D2R); gs = [i, j]; ga = [i]; }
      if (S.some(function (x) { return !(x > 2.5 && x < 13); })) continue;
      var s0 = S.slice().sort(function (p, q) { return p - q; }); if (s0[0] + s0[1] <= s0[2] + 0.5) continue;
      A = [lawAng(S[0], S[1], S[2]), lawAng(S[1], S[0], S[2]), lawAng(S[2], S[0], S[1])];
      if (Math.min.apply(null, A) < 22) continue;
      return { type: type, S: S, A: A, gs: gs, ga: ga };
    }
    return makeData(type);
  }
  function dataText(d) { return d.gs.map(function (i) { return SN[i] + ' = ' + cm(d.S[i]); }).concat(d.ga.map(function (i) { return AN[i] + ' = ' + Math.round(d.A[i]) + '°'; })).join(', '); }
  function planfigur(d) {
    var T = triSSS(d.S[0], d.S[1], d.S[2]);
    var sides = [0, 1, 2].map(function (i) { return d.gs.indexOf(i) >= 0 ? SN[i] + ' = ' + cm(d.S[i]) : SN[i]; });
    var it = triItems(T, { angles: [0, 1, 2].map(function (i) { return d.ga.indexOf(i) >= 0 ? AN[i] + ' = ' + Math.round(d.A[i]) + '°' : null; }) });
    var c = centroid(T), S2 = [[T[1], T[2]], [T[0], T[2]], [T[0], T[1]]];
    [0, 1, 2].forEach(function (i) { var g = d.gs.indexOf(i) >= 0; if (g) it.splice(1, 0, { t: 'seg', a: S2[i][0], b: S2[i][1], color: C_ACC, w: 4 }); it.push({ t: 'side', a: S2[i][0], b: S2[i][1], ref: c, s: sides[i], color: g ? '#b45309' : C_MUT }); });
    return scene(it, { label: 'Planfigur mit markierten gegebenen Stücken', note: 'Planfigur (Skizze)' });
  }
  var WHY = {
    SSS: 'Gegeben sind alle drei Seiten: <b>SSS</b> (Seite, Seite, Seite).',
    SWS: 'Gegeben sind zwei Seiten und der Winkel, der zwischen ihnen liegt (eingeschlossener Winkel): <b>SWS</b>.',
    WSW: 'Gegeben sind eine Seite und die beiden Winkel, die an dieser Seite anliegen: <b>WSW</b>.',
    SsW: 'Gegeben sind zwei Seiten und der Winkel, der der <b>längeren</b> Seite gegenüberliegt: <b>SsW</b>.'
  };
  function satzHints(d) {
    return ['Zähle zuerst: Wie viele Seiten und wie viele Winkel sind gegeben?', d.ga.length === 0 ? 'Es sind nur Seiten gegeben.' : d.ga.length === 2 ? 'Zwei Winkel und eine Seite: Liegen beide Winkel an den Enden der Seite?' : 'Zwei Seiten und ein Winkel: Liegt der Winkel <b>zwischen</b> den beiden Seiten? Der Winkel ' + AN[d.ga[0]] + ' liegt bei der Ecke ' + VN[d.ga[0]] + '.', 'SSS: drei Seiten. SWS: der Winkel liegt zwischen den beiden Seiten. WSW: beide Winkel liegen an der Seite an. SsW: der Winkel liegt der längeren Seite gegenüber.'];
  }
  function satzMistakes(d) {
    return function (v) { var c = SAETZE[+v[0]]; if (d.type === 'SsW' && c === 'SWS') return 'Der Winkel ' + AN[d.ga[0]] + ' liegt nicht zwischen den beiden Seiten. Er liegt der Seite ' + SN[d.ga[0]] + ' gegenüber.'; if (d.type === 'SWS' && c === 'SsW') return 'Schau genau: Der Winkel ' + AN[d.ga[0]] + ' liegt bei ' + VN[d.ga[0]] + ', also genau zwischen den beiden gegebenen Seiten.'; return null; };
  }
  function satzVerify(d) {
    return function () {
      var t; if (d.ga.length === 0) t = 'SSS'; else if (d.ga.length === 2) t = (d.gs[0] !== d.ga[0] && d.gs[0] !== d.ga[1]) ? 'WSW' : 'x';
      else { var w = d.ga[0]; t = d.gs.indexOf(w) < 0 ? 'SWS' : (d.S[w] > d.S[d.gs.filter(function (x) { return x !== w; })[0]] ? 'SsW' : 'x'); }
      var T = triSSS(d.S[0], d.S[1], d.S[2]), ok = d.ga.every(function (i) { return Math.abs(angAt(T[i], T[(i + 1) % 3], T[(i + 2) % 3]) - Math.round(d.A[i])) < 1e-6; });
      return t === d.type && ok ? true : 'Daten passen nicht zum Kongruenzsatz';
    };
  }
  function arcItems(T, a, b) { /* Kreisbögen um A (Radius b) und B (Radius a) um C herum */
    var tA = Math.atan2(T[2][1], T[2][0]) / D2R, tB = Math.atan2(T[2][1], T[2][0] - T[1][0]) / D2R;
    return [{ t: 'arc', c: T[0], r: b, a1: tA - 18, a2: tA + 18, dash: '5 4' }, { t: 'arc', c: T[1], r: a, a1: tB - 18, a2: tB + 18, dash: '5 4' }];
  }
  var gen = {
    satz: function () {
      var type = M.pick(SAETZE), d = makeData(type);
      return { skill: 'Kongruenzsatz erkennen', level: 1, q: 'Von einem Dreieck ABC sind gegeben: <b>' + dataText(d) + '</b>. Nach welchem Kongruenzsatz kannst du es konstruieren?',
        inputs: [{ kind: 'mc', label: 'Kongruenzsatz', options: SAETZE, answer: SAETZE.indexOf(type) }], hints: satzHints(d), solution: WHY[type], mistakes: satzMistakes(d), verify: satzVerify(d) };
    },
    planfigur: function () {
      var type = M.pick(SAETZE), d = makeData(type);
      return { skill: 'Planfigur auswerten', level: 2, q: 'In der Planfigur sind die gegebenen Stücke farbig markiert. Welcher Kongruenzsatz passt?' + planfigur(d),
        inputs: [{ kind: 'mc', label: 'Kongruenzsatz', options: SAETZE, answer: SAETZE.indexOf(type) }], hints: satzHints(d), solution: 'Gegeben: ' + dataText(d) + '. ' + WHY[type], mistakes: satzMistakes(d), verify: satzVerify(d) };
    },
    eindeutig: function () {
      var c = M.rnd(0, 5), txt, ans, why, OPT = ['Ja, es gibt genau ein solches Dreieck.', 'Nein, es gibt gar kein solches Dreieck.', 'Nein, es gibt viele verschieden große Dreiecke.'];
      if (c <= 1) { var d = makeData(M.pick(['SSS', 'SWS', 'WSW'])); txt = dataText(d); ans = 0; why = WHY[d.type] + ' Damit ist das Dreieck eindeutig festgelegt.'; }
      else if (c === 2) { var x = M.rnd(2, 5), y = M.rnd(2, 5), z = x + y + M.rnd(0, 3); txt = 'a = ' + cm(x) + ', b = ' + cm(y) + ', c = ' + cm(z); ans = 1; why = 'Prüfe die Dreiecksungleichung: ' + x + ' cm + ' + y + ' cm = ' + (x + y) + ' cm ist nicht länger als ' + z + ' cm. Die Kreisbögen schneiden sich nicht.'; }
      else if (c === 3) { var al = 5 * M.rnd(12, 24), be = 180 - al + 5 * M.rnd(0, 4); txt = 'c = ' + cm(M.rnd(4, 9)) + ', α = ' + al + '°, β = ' + be + '°'; ans = 1; why = 'α + β = ' + (al + be) + '°. Das ist schon 180° oder mehr. Die freien Schenkel schneiden sich nicht, für γ bleibt nichts übrig.'; }
      else if (c === 4) { var w; do { w = [5 * M.rnd(6, 18), 5 * M.rnd(6, 18)]; w.push(180 - w[0] - w[1]); } while (w[2] < 30); txt = 'α = ' + w[0] + '°, β = ' + w[1] + '°, γ = ' + w[2] + '°'; ans = 2; why = 'Nur drei Winkel reichen nicht. Du kannst das Dreieck beliebig vergrößern oder verkleinern. Die Winkel bleiben gleich, die Seiten nicht. Es fehlt eine Seitenlänge.'; }
      else { var p = M.rnd(3, 8), q = M.rnd(3, 8); txt = 'a = ' + cm(p) + ', b = ' + cm(q); ans = 2; why = 'Zwei Stücke reichen nie. Der Winkel zwischen a und b ist noch frei, also gibt es viele verschiedene Dreiecke. Du brauchst drei passende Stücke.'; }
      return { skill: 'Konstruierbarkeit prüfen', level: 2, q: 'Von einem Dreieck ABC sind gegeben: <b>' + txt + '</b>. Ist das Dreieck damit eindeutig konstruierbar?',
        inputs: [{ kind: 'mc', label: 'Antwort', options: OPT, answer: ans }],
        hints: ['Für ein eindeutiges Dreieck brauchst du drei passende Stücke, darunter mindestens eine Seite.', 'Prüfe bei drei Seiten die Dreiecksungleichung. Prüfe bei zwei Winkeln, ob sie zusammen kleiner als 180° sind.', 'Nur Winkel und keine Seite: Das Dreieck kann verschieden groß sein.'],
        solution: why,
        verify: function () { if (c === 3) { var m = txt.match(/α = (\d+)°, β = (\d+)°/); return +m[1] + +m[2] >= 180 ? true : 'Winkel zu klein'; } if (c === 2) { var n = txt.match(/\d+/g).map(Number); return n[0] + n[1] <= n[2] ? true : 'Seiten passen doch'; } return true; } };
    },
    reihenfolge: function () {
      var type = M.pick(['SSS', 'SWS', 'WSW']), steps, valid, d;
      if (type === 'SSS') { d = makeData('SSS'); steps = ['Fertige eine Planfigur an und markiere die gegebenen Stücke.', 'Zeichne die Strecke AB mit c = ' + cm(d.S[2]) + '.', 'Zeichne einen Kreisbogen um A mit dem Radius b = ' + cm(d.S[1]) + '.', 'Zeichne einen Kreisbogen um B mit dem Radius a = ' + cm(d.S[0]) + '.', 'Markiere den Schnittpunkt der beiden Kreisbögen als C.', 'Verbinde C mit A und mit B.']; valid = [[0, 1, 2, 3, 4, 5], [0, 1, 3, 2, 4, 5]]; }
      else if (type === 'SWS') { var b = M.rnd(4, 9), c = M.rnd(4, 9), al = 5 * M.rnd(8, 22); steps = ['Fertige eine Planfigur an und markiere die gegebenen Stücke.', 'Zeichne die Strecke AB mit c = ' + cm(c) + '.', 'Trage in A den Winkel α = ' + al + '° an.', 'Trage auf dem freien Schenkel ab A die Länge b = ' + cm(b) + ' ab. Der Endpunkt ist C.', 'Verbinde C mit B.']; valid = [[0, 1, 2, 3, 4]]; }
      else { var c2 = M.rnd(4, 9), a1 = 5 * M.rnd(7, 16), b1 = 5 * M.rnd(7, 16); steps = ['Fertige eine Planfigur an und markiere die gegebenen Stücke.', 'Zeichne die Strecke AB mit c = ' + cm(c2) + '.', 'Trage in A den Winkel α = ' + a1 + '° an.', 'Trage in B den Winkel β = ' + b1 + '° an.', 'Der Schnittpunkt der beiden freien Schenkel ist C.']; valid = [[0, 1, 2, 3, 4], [0, 1, 3, 2, 4]]; }
      var t = orderTask(steps, valid, 'Konstruktionsbeschreibung ordnen', 'Die Schritte einer Konstruktion (' + type + ') sind durcheinandergeraten:');
      t.level = 2; return t;
    },
    messenSSS: function () {
      var d = makeData('SSS'), w = M.rnd(0, 2), T = triSSS(d.S[0], d.S[1], d.S[2]), ans = Math.round(d.A[w]);
      return { skill: 'SSS konstruieren und messen', level: 2, q: 'Konstruiere das Dreieck ABC in deinem Heft mit <b>a = ' + cm(d.S[0]) + ', b = ' + cm(d.S[1]) + ', c = ' + cm(d.S[2]) + '</b>. Miss danach den Winkel ' + AN[w] + ' mit dem Geodreieck.',
        inputs: [{ kind: 'num', label: AN[w] + ' ≈', unit: '°', answer: ans, tol: 2 }],
        hints: ['Zeichne zuerst c = ' + cm(d.S[2]) + ' als Strecke AB.', 'Zeichne einen Kreisbogen um A mit Radius ' + cm(d.S[1]) + ' und einen um B mit Radius ' + cm(d.S[0]) + '. Der Schnittpunkt ist C.', 'Der Winkel ' + AN[w] + ' liegt bei der Ecke ' + VN[w] + '. Lege das Geodreieck genau an. Kleine Messfehler (± 2°) sind erlaubt.'],
        solution: 'Konstruktion nach SSS. Gemessen: ' + AN[w] + ' ≈ ' + ans + '°.' + scene(triItems(T, { sides: ['a = ' + cm(d.S[0]), 'b = ' + cm(d.S[1]), 'c = ' + cm(d.S[2])], angles: [0, 1, 2].map(function (i) { return i === w ? '≈ ' + ans + '°' : null; }) }).concat(arcItems(T, d.S[0], d.S[1])), { label: 'Konstruktion nach SSS', note: 'verkleinert' }),
        verify: function () { var g = angAt(T[w], T[(w + 1) % 3], T[(w + 2) % 3]); return Math.abs(g - d.A[w]) < 1e-6 ? true : 'Winkel falsch'; } };
    },
    messenSWS: function () {
      var d = makeData('SWS');
      var i = d.ga[0], ans = r1(d.S[i]), T = triSSS(d.S[0], d.S[1], d.S[2]), o = d.gs;
      return { skill: 'SWS konstruieren und messen', level: 2, q: 'Konstruiere das Dreieck ABC in deinem Heft mit <b>' + dataText(d) + '</b>. Miss danach die Seite ' + SN[i] + '.',
        inputs: [{ kind: 'num', label: SN[i] + ' ≈', unit: 'cm', answer: ans, tol: 0.2 }],
        hints: ['Der Winkel ' + AN[i] + ' liegt bei ' + VN[i] + ', also zwischen den Seiten ' + SN[o[0]] + ' und ' + SN[o[1]] + ' (SWS).', 'Zeichne die Seite ' + SN[o[0]] + ' = ' + cm(d.S[o[0]]) + '. Trage am Endpunkt ' + VN[i] + ' den Winkel ' + Math.round(d.A[i]) + '° an.', 'Trage auf dem freien Schenkel ' + cm(d.S[o[1]]) + ' ab und verbinde. Miss dann ' + SN[i] + ' (± 2 mm sind erlaubt).'],
        solution: 'Konstruktion nach SWS. Gemessen: ' + SN[i] + ' ≈ ' + M.fmtNum(ans) + ' cm.' + scene(triItems(T, { sides: [0, 1, 2].map(function (k) { return k === i ? SN[k] + ' ≈ ' + cm(ans) : SN[k] + ' = ' + cm(d.S[k]); }), angles: [0, 1, 2].map(function (k) { return k === i ? Math.round(d.A[k]) + '°' : null; }) }), { label: 'Konstruktion nach SWS', note: 'verkleinert' }),
        verify: function () { var a = d.S[o[0]], b = d.S[o[1]], P = [[0, 0], [a, 0], [b * Math.cos(d.A[i] * D2R), b * Math.sin(d.A[i] * D2R)]]; return Math.abs(dist(P[1], P[2]) - d.S[i]) < 1e-6 ? true : 'Seite falsch'; } };
    },
    messenWSW: function () {
      var c = M.rnd(5, 10), al, be; do { al = 5 * M.rnd(7, 17); be = 5 * M.rnd(7, 17); } while (180 - al - be < 30);
      var ga = 180 - al - be, b = c * Math.sin(be * D2R) / Math.sin(ga * D2R), ans = r1(b), T = triWW(al, be, c);
      return { skill: 'WSW konstruieren, rechnen und messen', level: 3, q: 'Konstruiere das Dreieck ABC in deinem Heft mit <b>c = ' + cm(c) + ', α = ' + al + '°, β = ' + be + '°</b>.<br>a) Berechne γ. b) Miss die Seite b.',
        inputs: [{ kind: 'num', label: 'a) γ =', unit: '°', answer: ga }, { kind: 'num', label: 'b) b ≈', unit: 'cm', answer: ans, tol: 0.2 }],
        hints: ['Für γ brauchst du keine Zeichnung: Die Winkelsumme im Dreieck ist 180°.', 'γ = 180° − ' + al + '° − ' + be + '°. Konstruiere dann: Strecke AB = ' + cm(c) + ', in A ' + al + '° und in B ' + be + '° antragen.', 'Die freien Schenkel schneiden sich in C. Miss die Strecke AC, das ist b (± 2 mm sind erlaubt).'],
        solution: 'a) γ = 180° − ' + al + '° − ' + be + '° = ' + ga + '°. b) Konstruktion nach WSW, gemessen b ≈ ' + M.fmtNum(ans) + ' cm.' + scene(triItems(T, { sides: [null, 'b ≈ ' + cm(ans), 'c = ' + cm(c)], angles: [al + '°', be + '°', ga + '°'] }), { label: 'Konstruktion nach WSW', note: 'verkleinert' }),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === 180 - al || x === 180 - be) return 'Für γ musst du beide gegebenen Winkel von 180° abziehen.'; return null; },
        verify: function () { return Math.abs(dist(T[0], T[2]) - b) < 1e-6 && Math.abs(angAt(T[2], T[0], T[1]) - ga) < 1e-6 ? true : 'WSW falsch'; } };
    },
    kongruent: function () {
      var C = [['in allen drei Seiten', 0], ['in zwei Seiten und dem Winkel, den diese Seiten einschließen', 1], ['in einer Seite und den beiden Winkeln, die an dieser Seite anliegen', 2], ['in zwei Seiten und dem Winkel, der der längeren Seite gegenüberliegt', 3], ['in allen drei Winkeln', 4], ['in zwei Seiten', 4], ['in einer Seite und einem Winkel', 4], ['in zwei Seiten und dem Winkel, der der kürzeren Seite gegenüberliegt', 4]];
      var ch = Math.random() < 0.55 ? M.pick(C.slice(0, 4)) : M.pick(C.slice(4)), OPT = ['Ja, nach SSS', 'Ja, nach SWS', 'Ja, nach WSW', 'Ja, nach SsW', 'Nein, nicht unbedingt'];
      var WHYK = ['Drei gleiche Seiten legen das Dreieck fest (SSS).', 'Zwei Seiten mit eingeschlossenem Winkel legen das Dreieck fest (SWS).', 'Eine Seite mit beiden anliegenden Winkeln legt das Dreieck fest (WSW).', 'Zwei Seiten und der Gegenwinkel der längeren Seite legen das Dreieck fest (SsW).'];
      var whyNo = { 'in allen drei Winkeln': 'Gleiche Winkel bedeuten nur gleiche Form. Ein Dreieck kann trotzdem größer sein als das andere.', 'in zwei Seiten': 'Der Winkel zwischen den Seiten kann verschieden sein. Zwei Stücke reichen nie.', 'in einer Seite und einem Winkel': 'Zwei Stücke reichen nie. Es fehlt eine dritte Angabe.', 'in zwei Seiten und dem Winkel, der der kürzeren Seite gegenüberliegt': 'Liegt der Winkel der kürzeren Seite gegenüber, kann es zwei verschiedene Dreiecke geben. Die Dreiecke müssen also nicht kongruent sein.' };
      return { skill: 'Kongruenz begründen', level: 2, q: 'Zwei Dreiecke stimmen <b>' + ch[0] + '</b> überein. Sind die beiden Dreiecke sicher kongruent (deckungsgleich)?',
        inputs: [{ kind: 'mc', label: 'Antwort', options: OPT, answer: ch[1] }],
        hints: ['Kongruente Dreiecke kann man genau aufeinanderlegen. Die Kongruenzsätze sagen, welche drei Stücke dafür reichen.', 'Die vier Kongruenzsätze heißen SSS, SWS, WSW und SsW. Achte darauf, wo der Winkel liegt.', 'Reichen die Angaben nicht für einen der vier Sätze, sind die Dreiecke nicht unbedingt kongruent.'],
        solution: ch[1] < 4 ? WHYK[ch[1]] + ' Die Dreiecke sind kongruent.' : whyNo[ch[0]] };
    },
    grundstueck: function () {
      var p, q, w, a; do { p = 5 * M.rnd(6, 16); q = 5 * M.rnd(6, 16); w = 5 * M.rnd(8, 26); a = Math.sqrt(p * p + q * q - 2 * p * q * Math.cos(w * D2R)); } while (a > 115 || a < 30);
      var ans = Math.round(a), u = p + q + ans, T0 = triSSS(a / 10, q / 10, p / 10), T = orient(T0);
      return { skill: 'Maßstäblich konstruieren (Sachaufgabe)', level: 3, q: 'Ein dreieckiges Grundstück hat an der Ecke A zwei Seiten von <b>' + p + ' m</b> und <b>' + q + ' m</b>. Sie schließen einen Winkel von <b>' + w + '°</b> ein. Der Zaun soll einmal ganz herum gehen.<br>Konstruiere das Grundstück im Maßstab 1 : 1000 (1 cm in der Zeichnung ≙ 10 m). Bestimme die Länge der dritten Seite und die Länge des ganzen Zauns.',
        inputs: [{ kind: 'num', label: 'dritte Seite ≈', unit: 'm', answer: ans, tol: 2.5 }, { kind: 'num', label: 'Zaun ≈', unit: 'm', answer: u, tol: 2.5 }],
        hints: ['Rechne die Längen um: ' + p + ' m ≙ ' + cm(p / 10) + ', ' + q + ' m ≙ ' + cm(q / 10) + '. Welcher Kongruenzsatz passt? Zwei Seiten und der eingeschlossene Winkel: SWS.', 'Zeichne ' + cm(p / 10) + ', trage in A ' + w + '° an und trage ' + cm(q / 10) + ' auf dem freien Schenkel ab. Verbinde.', 'Miss die dritte Seite in cm und rechne zurück: 1 cm ≙ 10 m. Der Zaun ist die Summe aller drei Seiten.'],
        solution: 'In der Zeichnung ist die dritte Seite etwa ' + cm(r1(a / 10)) + ' lang, das sind etwa <b>' + ans + ' m</b>. Zaun: ' + p + ' m + ' + q + ' m + ' + ans + ' m ≈ <b>' + u + ' m</b>.' + scene(triItems(T, { sides: ['≈ ' + ans + ' m', q + ' m', p + ' m'], angles: [w + '°', null, null] }), { label: 'Grundstück im Maßstab', note: 'verkleinert' }),
        verify: function () { return Math.abs(angAt(T0[0], T0[1], T0[2]) - w) < 1e-6 && Math.abs(dist(T0[1], T0[2]) * 10 - a) < 1e-6 ? true : 'falsch'; } };
    }
  };
  /* Erklärungsfiguren */
  var exT = triSSS(5, 6, 7);
  var exSSS = scene(triItems(exT, { sides: ['a = 5 cm', 'b = 6 cm', 'c = 7 cm'] }).concat(arcItems(exT, 5, 6), [{ t: 'circle', c: exT[2], r: 0.12, fill: C_ACC, color: C_ACC }]), { label: 'Konstruktion nach SSS mit Kreisbögen', note: 'verkleinert' });
  function mini(T, sides, angles, name) {
    var it = triItems(T, { angles: angles, noNames: true }), c = centroid(T), S2 = [[T[1], T[2]], [T[0], T[2]], [T[0], T[1]]];
    sides.forEach(function (on, i) { if (on) { it.splice(1, 0, { t: 'seg', a: S2[i][0], b: S2[i][1], color: C_ACC, w: 4 }); } });
    return '<div style="flex:1 1 140px;max-width:200px;text-align:center">' + scene(it, { W: 200, H: 140, pad: 16, label: 'Planfigur ' + name, maxw: 200 }) + '<b style="color:#5b3fa0">' + name + '</b></div>';
  }
  var T0 = triSSS(5.5, 6, 7);
  var minis = '<div style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:flex-end">' + mini(T0, [1, 1, 1], [], 'SSS') + mini(T0, [0, 1, 1], ['', null, null], 'SWS') + mini(T0, [0, 0, 1], ['', '', null], 'WSW') + mini(T0, [0, 1, 1], [null, null, ''], 'SsW') + '</div>';
  return {
    id: '017', title: 'Dreiecke konstruieren', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Zirkel und Geodreieck benutzen, Winkel zeichnen, Dreiecksarten',
    lead: 'Wie viele Angaben brauchst du, damit jeder genau dasselbe Dreieck zeichnet? Du lernst die Kongruenzsätze kennen und konstruierst Dreiecke mit Zirkel und Geodreieck.',
    einstieg: { html: '<p>Tim ruft Lea an: „Zeichne ein Dreieck mit den Seiten 5 cm und 7 cm.“ Danach vergleichen die beiden ihre Dreiecke. Sie sehen ganz verschieden aus!</p><p class="note">Welche Angabe hat Tim vergessen? Wie viele Angaben braucht man, damit beide <b>genau dasselbe</b> Dreieck zeichnen?</p><p>Zwei Dreiecke, die genau aufeinanderpassen, heißen <b>kongruent</b> (deckungsgleich). In diesem Modul lernst du, welche drei Angaben ein Dreieck eindeutig festlegen, und wie du es dann konstruierst.</p>' },
    ziele: ['Ich zeichne zu einer Aufgabe eine Planfigur und markiere die gegebenen Stücke.', 'Ich erkenne, welcher Kongruenzsatz (SSS, SWS, WSW, SsW) passt.', 'Ich konstruiere Dreiecke mit Zirkel und Geodreieck.', 'Ich schreibe eine Konstruktionsbeschreibung in der richtigen Reihenfolge.', 'Ich entscheide, ob ein Dreieck eindeutig, gar nicht oder nicht eindeutig konstruierbar ist.'],
    fachwoerter: [['kongruent', 'deckungsgleich: Zwei Figuren passen genau aufeinander.'], ['Planfigur', 'Eine schnelle Skizze des Dreiecks, in der die gegebenen Stücke farbig markiert sind.'], ['eingeschlossener Winkel', 'Der Winkel, der zwischen zwei Seiten liegt, zum Beispiel α zwischen b und c.'], ['anliegender Winkel', 'Ein Winkel, der an einem Ende einer Seite liegt. An c liegen α und β an.'], ['Kongruenzsatz', 'Eine Regel, welche drei Stücke ein Dreieck eindeutig festlegen: SSS, SWS, WSW, SsW.']],
    diagnose: [
      { q: 'Mit dem Zirkel zeichnest du um einen Punkt M einen Kreis mit Radius 4 cm. Was gilt für alle Punkte auf dem Kreis?', options: ['Sie sind 4 cm von M entfernt.', 'Sie sind 8 cm von M entfernt.', 'Sie liegen auf einer Geraden.', 'Weiß ich noch nicht'], answer: 0, why: 'Der Radius ist der Abstand vom Mittelpunkt. Alle Kreispunkte haben diesen Abstand.', review: 'Kreis und Radius (Klasse 5/6)' },
      { q: 'Welche Seite liegt im Dreieck ABC der Ecke A gegenüber?', options: ['die Seite a (zwischen B und C)', 'die Seite c (zwischen A und B)', 'die Seite b (zwischen A und C)', 'Weiß ich noch nicht'], answer: 0, why: 'Die Seite gegenüber einer Ecke bekommt den kleinen Buchstaben dieser Ecke.', review: 'Bezeichnungen im Dreieck' },
      { q: 'An welcher Ecke liegt der Winkel β?', options: ['an B', 'an A', 'an C', 'Weiß ich noch nicht'], answer: 0, why: 'α liegt an A, β an B und γ an C.', review: 'Bezeichnungen im Dreieck' },
      { q: 'Was brauchst du, um mit dem Geodreieck einen Winkel von 50° an eine Strecke anzutragen?', options: ['den Scheitelpunkt auf der Strecke und die Gradskala', 'nur einen Zirkel', 'nur die Länge der Strecke', 'Weiß ich noch nicht'], answer: 0, why: 'Du legst den Nullpunkt des Geodreiecks an den Scheitel und liest 50° an der Skala ab.', review: 'Winkel zeichnen (Klasse 5/6)' }],
    erklaerung:
      '<h3>1. Erst die Planfigur</h3><p>Bevor du konstruierst, skizzierst du das Dreieck frei Hand. In dieser <b>Planfigur</b> beschriftest du die Ecken (gegen den Uhrzeigersinn A, B, C) und markierst die gegebenen Stücke farbig. So siehst du, womit du anfangen kannst.</p>' +
      '<h3>2. Die Kongruenzsätze</h3><p>Ein Dreieck ist eindeutig festgelegt, wenn eine dieser Kombinationen gegeben ist (orange: gegebene Seiten, Bögen: gegebene Winkel):</p>' + minis +
      '<div class="merk"><b>Merke:</b><br><b>SSS</b>: drei Seiten.<br><b>SWS</b>: zwei Seiten und der Winkel <b>zwischen</b> ihnen.<br><b>WSW</b>: eine Seite und die beiden Winkel, die an ihr <b>anliegen</b>.<br><b>SsW</b>: zwei Seiten und der Winkel, der der <b>längeren</b> Seite gegenüberliegt.<br>Stimmen zwei Dreiecke in solchen Stücken überein, sind sie <b>kongruent</b>.</div>' +
      '<h3>3. Konstruktion nach SSS</h3><p>Beispiel: a = 5 cm, b = 6 cm, c = 7 cm.</p><ol><li>Zeichne c = 7 cm als Strecke AB.</li><li>Zeichne einen Kreisbogen um A mit Radius b = 6 cm.</li><li>Zeichne einen Kreisbogen um B mit Radius a = 5 cm.</li><li>Der Schnittpunkt der Kreisbögen ist C. Verbinde C mit A und B.</li></ol>' + exSSS +
      '<h3>4. Konstruktion nach SWS und WSW</h3><p><b>SWS</b> (zum Beispiel b, c, α): Zeichne c, trage in A den Winkel α an, trage auf dem freien Schenkel b ab und verbinde.<br><b>WSW</b> (zum Beispiel c, α, β): Zeichne c, trage in A den Winkel α und in B den Winkel β an. Die freien Schenkel schneiden sich in C.</p>' +
      '<h3>5. Nicht jedes Dreieck lässt sich konstruieren</h3><ul><li><b>Gar kein Dreieck</b>: Die Seiten verletzen die Dreiecksungleichung (z. B. 2 cm, 3 cm, 6 cm), oder zwei Winkel sind zusammen 180° oder mehr.</li><li><b>Viele Dreiecke</b>: Es sind nur drei Winkel oder nur zwei Stücke gegeben. Dann ist die Größe nicht festgelegt.</li><li><b>Vorsicht bei SsW</b>: Liegt der Winkel der <b>kürzeren</b> Seite gegenüber, kann es zwei verschiedene Dreiecke geben.</li></ul>' +
      '<p class="note">Bei Aufgaben „Konstruiere und miss“ zeichnest du sauber im Heft. Beim Messen sind kleine Abweichungen erlaubt: etwa 2 mm bei Längen und 2° bei Winkeln.</p>',
    entdecken: {
      html: '<p>Verändere die drei Seitenlängen. Die Kreisbögen um A und B zeigen, wo C liegen kann.</p><div class="ctl"><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="1" max="12" step="0.5" value="5"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="12" step="0.5" value="6"></label><label>c = <b id="v_c"></b> <input type="range" id="r_c" min="2" max="12" step="0.5" value="7"></label></div><div id="e_g"></div><p id="e_t" class="big-math"></p><p class="note">Versuche: Wann schneiden sich die Kreisbögen nicht mehr? Vergleiche a + b mit c.</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value, c = +root.querySelector('#r_c').value;
          root.querySelector('#v_a').textContent = cm(a); root.querySelector('#v_b').textContent = cm(b); root.querySelector('#v_c').textContent = cm(c);
          var s = [a, b, c].sort(function (p, q) { return p - q; }), ok = s[0] + s[1] > s[2] + 1e-9, it;
          if (ok) {
            var T = triSSS(a, b, c); it = arcItems(T, a, b).concat(triItems(T, { sides: ['a = ' + cm(a), 'b = ' + cm(b), 'c = ' + cm(c)] }));
            it.push({ t: 'circle', c: T[2], r: 0.1, fill: C_ACC, color: C_ACC });
            root.querySelector('#e_t').innerHTML = 'Die Kreisbögen schneiden sich in C. Es gibt genau ein Dreieck.';
          } else {
            it = [{ t: 'arc', c: [0, 0], r: b, a1: 0, a2: 180, dash: '5 4' }, { t: 'arc', c: [c, 0], r: a, a1: 0, a2: 180, dash: '5 4' }, { t: 'seg', a: [0, 0], b: [c, 0], w: 3 }, { t: 'pt', p: [0, 0], s: 'A', color: C_LINE, dir: [0, 1] }, { t: 'pt', p: [c, 0], s: 'B', color: C_LINE, dir: [0, 1] }];
            root.querySelector('#e_t').innerHTML = '<span style="color:#b91c1c">' + M.fmtNum(s[0]) + ' cm + ' + M.fmtNum(s[1]) + ' cm = ' + M.fmtNum(s[0] + s[1]) + ' cm ist nicht länger als ' + M.fmtNum(s[2]) + ' cm. Die Kreisbögen treffen sich nicht. Kein Dreieck!</span>';
          }
          root.querySelector('#e_g').innerHTML = scene(it, { W: 380, H: 280, label: 'Konstruktion nach SSS', note: 'verkleinert' });
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: Drei Seiten legen ein Dreieck eindeutig fest (SSS). Sind zwei Seiten zusammen zu kurz, schneiden sich die Kreisbögen nicht.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Konstruktion nach WSW', q: 'Konstruiere das Dreieck ABC mit c = 6 cm, α = 50° und β = 60°.',
      steps: ['Planfigur: c ist die Seite AB. α liegt an A und β an B. Beide Winkel liegen an c an. Das ist der Kongruenzsatz <b>WSW</b>.', 'Zeichne die Strecke AB mit c = 6 cm.', 'Trage in A den Winkel α = 50° an und in B den Winkel β = 60°. Zeichne die freien Schenkel lang genug.', 'Die beiden freien Schenkel schneiden sich im Punkt C. Ziehe das Dreieck nach.', 'Kontrolle: Miss γ. Du solltest etwa 70° messen, denn 180° − 50° − 60° = 70°.' + scene(triItems(triWW(50, 60, 6), { sides: [null, null, 'c = 6 cm'], angles: ['50°', '60°', '70°'] }), { label: 'Dreieck nach WSW', note: 'verkleinert' })] },
    tasks: { gen: gen, plan: { G: ['satz:1', 'planfigur:2', 'messenSSS:2', 'reihenfolge:2'], S: ['satz:1', 'planfigur:2', 'reihenfolge:2', 'messenSSS:2', 'eindeutig:2'], E: ['planfigur:2', 'reihenfolge:2', 'messenSWS:2', 'eindeutig:2', 'kongruent:2', 'messenWSW:3'] },
      extra: 'grundstueck', test: ['satz:1', 'planfigur:2', 'reihenfolge:2', 'eindeutig:2', 'messenSWS:2', 'messenWSW:3'] },
    lerncheck: ['Ich zeichne eine Planfigur und markiere die gegebenen Stücke.', 'Ich erkenne den passenden Kongruenzsatz.', 'Ich konstruiere Dreiecke nach SSS, SWS und WSW.', 'Ich erkenne, wann ein Dreieck nicht eindeutig konstruierbar ist.']
  };
})();
