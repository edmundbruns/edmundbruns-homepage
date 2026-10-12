/* Modul 015 · Dreiecksarten */
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
  var SEITEN = ['unregelmäßig', 'gleichschenklig', 'gleichseitig'], WINKEL = ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'];
  function sideType(a, b, c) { var e = function (x, y) { return Math.abs(x - y) < 1e-9; }; if (e(a, b) && e(b, c)) return 2; if (e(a, b) || e(b, c) || e(a, c)) return 1; return 0; }
  function angType(w) { var mx = Math.max.apply(null, w); return Math.abs(mx - 90) < 1e-6 ? 1 : mx > 90 ? 2 : 0; }
  function triOk(a, b, c) { var s = [a, b, c].sort(function (x, y) { return x - y; }); return s[0] + s[1] > s[2]; }
  function anglesOf(T) { return [angAt(T[0], T[1], T[2]), angAt(T[1], T[0], T[2]), angAt(T[2], T[0], T[1])]; }
  function fmtTriple(t) { return t.map(function (x) { return cm(x); }).join(', '); }
  /* Winkel passend zu Seiten- und Winkelart, [α, β, γ] mit α, β an der Grundseite AB */
  function anglesFor(st, at) {
    var w;
    if (st === 2) return [60, 60, 60];
    if (st === 1) {
      if (at === 1) return [45, 45, 90];
      if (at === 2) { var top = 2 * M.rnd(50, 70); return [(180 - top) / 2, (180 - top) / 2, top]; }
      var b; do { b = M.rnd(50, 75); } while (b === 60); return [b, b, 180 - 2 * b];
    }
    for (var t = 0; t < 500; t++) {
      if (at === 1) { var x = M.rnd(25, 65); if (Math.abs(x - 45) < 8) continue; w = [x, 90 - x, 90]; }
      else if (at === 2) { var s = M.rnd(100, 130), y = M.rnd(20, 180 - s - 20); w = [y, 180 - s - y, s]; }
      else { w = [M.rnd(35, 85), M.rnd(35, 85), 0]; w[2] = 180 - w[0] - w[1]; if (w[2] >= 90 || w[2] < 35) continue; }
      if (Math.abs(w[0] - w[1]) >= 8 && Math.abs(w[1] - w[2]) >= 8 && Math.abs(w[0] - w[2]) >= 8) break;
    }
    var r = M.rnd(0, 2), big = w[2]; w[2] = w[r]; w[r] = big; /* großer Winkel an zufälliger Ecke */
    return w;
  }
  function ticksFor(T) { var s = [dist(T[1], T[2]), dist(T[0], T[2]), dist(T[0], T[1])]; var e = function (x, y) { return Math.abs(x - y) < 1e-6; }; return [e(s[0], s[1]) || e(s[0], s[2]) ? 1 : 0, e(s[1], s[0]) || e(s[1], s[2]) ? 1 : 0, e(s[2], s[0]) || e(s[2], s[1]) ? 1 : 0]; }
  var REASON = {
    'ein gleichseitiges, rechtwinkliges Dreieck': 'Im gleichseitigen Dreieck sind alle drei Winkel gleich groß, nämlich 60°. Ein rechter Winkel ist nicht möglich.',
    'ein gleichseitiges, stumpfwinkliges Dreieck': 'Im gleichseitigen Dreieck sind alle drei Winkel 60° groß. Ein stumpfer Winkel ist nicht möglich.',
    'ein Dreieck mit zwei rechten Winkeln': 'Zwei rechte Winkel ergeben schon 180°. Für den dritten Winkel bleibt nichts übrig. Die beiden Schenkel wären parallel und träfen sich nie.',
    'ein Dreieck mit einem rechten und einem stumpfen Winkel': 'Ein rechter und ein stumpfer Winkel sind zusammen schon mehr als 180°. Das geht nicht.',
    'ein Dreieck mit zwei stumpfen Winkeln': 'Zwei stumpfe Winkel sind zusammen mehr als 180°. Das geht nicht.'
  };
  var POSSIBLE = ['ein gleichschenkliges, rechtwinkliges Dreieck', 'ein gleichschenkliges, stumpfwinkliges Dreieck', 'ein unregelmäßiges, rechtwinkliges Dreieck', 'ein unregelmäßiges, stumpfwinkliges Dreieck', 'ein gleichschenkliges, spitzwinkliges Dreieck', 'ein gleichseitiges, spitzwinkliges Dreieck', 'ein unregelmäßiges, spitzwinkliges Dreieck'];
  function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
  var gen = {
    nachSeiten: function () {
      var st = M.rnd(0, 2), a, b, c, T;
      for (var t = 0; t < 500; t++) {
        if (st === 2) { a = b = c = M.rnd(4, 9); }
        else if (st === 1) { var s = M.rnd(4, 9), g = M.rnd(3, 2 * s - 2); if (g === s) continue; var k = M.rnd(0, 2); if (k === 0) { a = s; b = s; c = g; } else if (k === 1) { a = g; b = s; c = s; } else { a = s; b = g; c = s; } }
        else { a = M.rnd(3, 10); b = M.rnd(3, 10); c = M.rnd(4, 10); if (a === b || b === c || a === c) continue; }
        if (!triOk(a, b, c)) continue;
        T = triSSS(a, b, c); if (Math.min.apply(null, anglesOf(T)) >= 25) break;
      }
      var lab = ['a = ' + cm(a), 'b = ' + cm(b), 'c = ' + cm(c)];
      return { skill: 'Dreiecksart nach Seiten', level: 1, q: 'Ein Dreieck hat die Seiten ' + lab.join(', ') + '. Wie heißt dieses Dreieck nach seinen Seiten?' + scene(triItems(T, { sides: lab }), { label: 'Dreieck mit Seitenlängen', note: 'verkleinert gezeichnet' }),
        inputs: [{ kind: 'mc', label: 'Das Dreieck ist …', options: SEITEN, answer: st }],
        hints: ['Vergleiche die drei Seitenlängen miteinander.', 'Zähle: Wie viele Seiten sind gleich lang? Keine, zwei oder alle drei?', 'Keine gleich: unregelmäßig. Zwei gleich: gleichschenklig. Alle drei gleich: gleichseitig.'],
        solution: 'Die Seiten sind ' + fmtTriple([a, b, c]) + '. ' + (st === 2 ? 'Alle drei Seiten sind gleich lang. Das Dreieck ist <b>gleichseitig</b>.' : st === 1 ? 'Genau zwei Seiten sind gleich lang. Das Dreieck ist <b>gleichschenklig</b>.' : 'Alle Seiten sind verschieden lang. Das Dreieck ist <b>unregelmäßig</b>.'),
        mistakes: function (v) { if (st === 2 && v[0] === '1') return 'Ein gleichseitiges Dreieck ist zwar auch gleichschenklig. Hier sind aber sogar alle drei Seiten gleich lang. Wähle die genaueste Bezeichnung.'; return null; },
        verify: function () { return sideType(a, b, c) === st && triOk(a, b, c) ? true : 'Seitenart falsch'; } };
    },
    nachWinkeln: function () {
      var at = M.rnd(0, 2), st = M.rnd(0, 1), w = anglesFor(st, at);
      var lab = ['α = ' + w[0] + '°', 'β = ' + w[1] + '°', 'γ = ' + w[2] + '°'];
      return { skill: 'Dreiecksart nach Winkeln', level: 1, q: 'Ein Dreieck hat die Winkel ' + lab.join(', ') + '. Wie heißt dieses Dreieck nach seinen Winkeln?' + scene(triItems(orient(triWW(w[0], w[1])), { angles: lab }), { label: 'Dreieck mit Winkeln' }),
        inputs: [{ kind: 'mc', label: 'Das Dreieck ist …', options: WINKEL, answer: at }],
        hints: ['Entscheidend ist der größte Winkel.', 'Der größte Winkel ist ' + Math.max.apply(null, w) + '°. Ist er kleiner als 90°, genau 90° oder größer als 90°?', 'Alle Winkel kleiner als 90°: spitzwinklig. Ein Winkel genau 90°: rechtwinklig. Ein Winkel größer als 90°: stumpfwinklig.'],
        solution: 'Der größte Winkel ist ' + Math.max.apply(null, w) + '°. ' + ['Er ist kleiner als 90°, also sind alle Winkel spitz. Das Dreieck ist <b>spitzwinklig</b>.', 'Er ist genau 90°. Das Dreieck ist <b>rechtwinklig</b>.', 'Er ist größer als 90°. Das Dreieck ist <b>stumpfwinklig</b>.'][at],
        mistakes: function (v) { if (at === 2 && v[0] === '0') return 'Ein stumpfwinkliges Dreieck hat zwar auch zwei spitze Winkel. Entscheidend ist aber der größte Winkel.'; if (at === 1 && v[0] === '0') return 'Schau genau hin: Ein Winkel ist genau 90° groß.'; return null; },
        verify: function () { return angType(w) === at && w[0] + w[1] + w[2] === 180 ? true : 'Winkelart falsch'; } };
    },
    kombination: function () {
      var combos = [[2, 0], [1, 0], [1, 1], [1, 2], [0, 0], [0, 1], [0, 2]], ch = M.pick(combos), w = anglesFor(ch[0], ch[1]), T = orient(triWW(w[0], w[1]));
      var name = function (c) { return SEITEN[c[0]] + ' und ' + WINKEL[c[1]]; };
      var others = M.shuffle(combos.filter(function (c) { return c !== ch; })).slice(0, 3), opts = M.shuffle([ch].concat(others));
      var labs = w.map(function (x) { return x + '°'; });
      return { skill: 'Dreiecksart nach Seiten und Winkeln', level: 2, q: 'Gleich lange Seiten sind mit gleichen Strichen markiert. Gib den vollständigen Namen des Dreiecks an.' + scene(triItems(T, { angles: labs, ticks: ticksFor(T) }), { label: 'Dreieck mit Markierungen' }),
        inputs: [{ kind: 'mc', label: 'Das Dreieck ist …', options: opts.map(name), answer: opts.indexOf(ch) }],
        hints: ['Bestimme zuerst die Art nach den Seiten: Wie viele Seiten tragen den gleichen Strich?', 'Bestimme dann die Art nach den Winkeln: Wie groß ist der größte Winkel? Hier: ' + Math.max.apply(null, w) + '°.', 'Kombiniere beide Namen: ' + SEITEN[ch[0]] + ' und …'],
        solution: 'Nach den Seiten: <b>' + SEITEN[ch[0]] + '</b>' + (ch[0] === 0 ? ' (keine Seite markiert)' : ch[0] === 1 ? ' (zwei Seiten mit gleichem Strich)' : ' (alle drei Seiten gleich)') + '. Nach den Winkeln: größter Winkel ' + Math.max.apply(null, w) + '°, also <b>' + WINKEL[ch[1]] + '</b>.',
        verify: function () { var s = [dist(T[1], T[2]), dist(T[0], T[2]), dist(T[0], T[1])]; var e = function (x, y) { return Math.abs(x - y) < 1e-6; }; var st = e(s[0], s[1]) && e(s[1], s[2]) ? 2 : (e(s[0], s[1]) || e(s[1], s[2]) || e(s[0], s[2])) ? 1 : 0; return st === ch[0] && angType(anglesOf(T).map(function (x) { return Math.round(x * 1e6) / 1e6; })) === ch[1] ? true : 'Kombination passt nicht zur Figur'; } };
    },
    unmoeglich: function () {
      var imp = Object.keys(REASON), notThere = Math.random() < 0.6, opts, ans;
      if (notThere) { ans = M.pick(imp); opts = M.shuffle([ans].concat(M.shuffle(POSSIBLE).slice(0, 3))); }
      else { ans = M.pick(POSSIBLE); opts = M.shuffle([ans].concat(M.shuffle(imp).slice(0, 3))); }
      return { skill: 'Mögliche und unmögliche Dreiecke', level: 2, q: notThere ? 'Drei dieser Dreiecke gibt es. Welches Dreieck gibt es <b>nicht</b>?' : 'Nur eines dieser Dreiecke gibt es wirklich. Welches?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(ans) }],
        hints: ['Denke an die Winkelsumme: Alle drei Winkel eines Dreiecks ergeben zusammen 180°.', 'Im gleichseitigen Dreieck ist jeder Winkel 60° groß.', 'Ein rechter (90°) oder ein stumpfer Winkel (über 90°) kann in einem Dreieck nur <b>einmal</b> vorkommen.'],
        solution: notThere ? '<b>' + cap(ans) + '</b> gibt es nicht. ' + REASON[ans] : '<b>' + cap(ans) + '</b> gibt es. Die anderen sind unmöglich: ' + opts.filter(function (o) { return o !== ans; }).map(function (o) { return REASON[o]; }).join(' '),
        verify: function () { return (REASON[ans] ? 1 : 0) === (notThere ? 1 : 0) && opts.filter(function (o) { return !!REASON[o] === notThere; }).length === 1 ? true : 'Auswahl fehlerhaft'; } };
    },
    ungleichung: function (lvl) {
      var good = [], bad = null, seen = {};
      function key(t) { return t.slice().sort(function (x, y) { return x - y; }).join(','); }
      while (!bad) { var x = M.rnd(2, 6), y = M.rnd(2, 7), z = x + y + (lvl >= 2 && Math.random() < 0.5 ? 0 : M.rnd(1, 3)); bad = M.shuffle([x, y, z]); }
      seen[key(bad)] = 1;
      while (good.length < 3) { var t = [M.rnd(2, 12), M.rnd(2, 12), M.rnd(2, 12)], s = t.slice().sort(function (p, q) { return p - q; }); if (s[0] + s[1] <= s[2] || seen[key(t)]) continue; seen[key(t)] = 1; good.push(t); }
      var flip = Math.random() < 0.5; /* flip: nach dem einzigen möglichen Dreieck fragen */
      var tri = flip ? [good[0]] : good, nots = flip ? [bad] : [bad];
      if (flip) { while (nots.length < 3) { var a = M.rnd(2, 6), b = M.rnd(2, 6), c = a + b + M.rnd(0, 3), tt = M.shuffle([a, b, c]); if (!seen[key(tt)]) { seen[key(tt)] = 1; nots.push(tt); } } }
      var ans = flip ? tri[0] : bad, opts = M.shuffle(tri.concat(nots)), so = function (t) { return t.slice().sort(function (p, q) { return p - q; }); };
      var lab = function (t) { return t.join(' cm, ') + ' cm'; };
      var check = function (t) { var s = so(t); return s[0] + ' cm + ' + s[1] + ' cm = ' + (s[0] + s[1]) + ' cm ' + (s[0] + s[1] > s[2] ? '&gt; ' : s[0] + s[1] === s[2] ? '= ' : '&lt; ') + s[2] + ' cm ' + (s[0] + s[1] > s[2] ? '✓' : '✗'); };
      return { skill: 'Dreiecksungleichung', q: flip ? 'Aus welchen drei Strecken kannst du ein Dreieck bauen?' : 'Aus welchen drei Strecken kannst du <b>kein</b> Dreieck bauen?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(lab), answer: opts.indexOf(ans) }],
        hints: ['Die beiden kürzeren Seiten müssen zusammen <b>länger</b> sein als die längste Seite.', 'Addiere bei jeder Auswahl die zwei kleinsten Zahlen und vergleiche mit der größten.', 'Beispiel: ' + check(opts[0]) + '.'],
        solution: opts.map(check).join('<br>') + '<br>Also: ' + lab(ans) + (flip ? ' ergibt ein Dreieck.' : ' ergibt kein Dreieck.'),
        mistakes: function (v) { var t = opts[+v[0]]; if (!t) return null; var s = so(t); if (flip && s[0] + s[1] === s[2]) return 'Hier sind die beiden kürzeren Seiten zusammen genau so lang wie die längste. Dann liegen sie flach auf ihr und es entsteht kein Dreieck.'; return null; },
        verify: function () { return opts.filter(function (t) { return triOk(t[0], t[1], t[2]) === flip; }).length === 1 && triOk(ans[0], ans[1], ans[2]) === flip ? true : 'Ungleichung falsch'; } };
    },
    dritteSeite: function () {
      var a = M.rnd(3, 9), b; do { b = M.rnd(3, 12); } while (b === a);
      var lo = Math.abs(a - b) + 1, hi = a + b - 1;
      return { skill: 'Dritte Seite eingrenzen', level: 3, q: 'Zwei Seiten eines Dreiecks sind ' + cm(a) + ' und ' + cm(b) + ' lang. Die dritte Seite c ist eine ganze Zahl (in cm). Wie lang kann c höchstens sein? Wie lang muss c mindestens sein?',
        inputs: [{ kind: 'num', label: 'c höchstens', unit: 'cm', answer: hi }, { kind: 'num', label: 'c mindestens', unit: 'cm', answer: lo }],
        hints: ['Nutze die Dreiecksungleichung: Zwei Seiten zusammen müssen immer länger sein als die dritte.', 'Größte Möglichkeit: c muss kürzer sein als ' + a + ' cm + ' + b + ' cm = ' + (a + b) + ' cm.', 'Kleinste Möglichkeit: c und die kürzere Seite ' + Math.min(a, b) + ' cm müssen zusammen länger sein als ' + Math.max(a, b) + ' cm. Also c &gt; ' + Math.max(a, b) + ' cm − ' + Math.min(a, b) + ' cm = ' + Math.abs(a - b) + ' cm.'],
        solution: 'c &lt; ' + a + ' + ' + b + ' = ' + (a + b) + ', also höchstens <b>' + hi + ' cm</b>. c &gt; ' + Math.max(a, b) + ' − ' + Math.min(a, b) + ' = ' + Math.abs(a - b) + ', also mindestens <b>' + lo + ' cm</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x === a + b) return 'Ist c genau ' + (a + b) + ' cm lang, liegen die beiden anderen Seiten flach auf c. Das ist kein Dreieck mehr. c muss echt kürzer sein.'; if (y === Math.abs(a - b)) return 'Bei c = ' + Math.abs(a - b) + ' cm wären c und die kürzere Seite zusammen genau so lang wie die längere Seite. Das reicht nicht.'; return null; },
        verify: function () { var ok = []; for (var c = 1; c < 40; c++) if (triOk(a, b, c)) ok.push(c); return ok[0] === lo && ok[ok.length - 1] === hi ? true : 'Grenzen falsch'; } };
    },
    umfang: function (lvl) {
      var v = lvl === 1 ? M.pick([0, 1]) : M.pick([1, 2, 2]), s, g, u;
      if (v === 0) { s = M.rnd(3, 15); u = 3 * s;
        return { skill: 'Umfang und Seiten', q: 'Ein gleichseitiges Dreieck hat den Umfang ' + cm(u) + '. Wie lang ist eine Seite?', inputs: [{ kind: 'num', label: 'Seite', unit: 'cm', answer: s }],
          hints: ['Im gleichseitigen Dreieck sind alle drei Seiten gleich lang.', 'Der Umfang ist die Summe aller drei Seiten: u = 3 · Seite.', 'Seite = ' + u + ' cm : 3.'], solution: 'Seite = ' + u + ' cm : 3 = ' + cm(s) + '.',
          verify: function () { return 3 * s === u ? true : 'falsch'; } };
      }
      do { s = M.rnd(4, 15); g = M.rnd(2, 2 * s - 1); } while (g === s || (u = 2 * s + g) > 45);
      var T = triSSS(s, s, g), lab = ['Schenkel', 'Schenkel', 'Basis'];
      if (v === 1) return { skill: 'Umfang und Seiten', q: 'Ein gleichschenkliges Dreieck hat zwei Schenkel von je ' + cm(s) + ' und eine Basis von ' + cm(g) + '. Berechne den Umfang.', inputs: [{ kind: 'num', label: 'u =', unit: 'cm', answer: u }],
        hints: ['Der Umfang ist die Summe aller drei Seiten.', 'Das gleichschenklige Dreieck hat zwei gleich lange Schenkel. Du musst ' + s + ' cm also zweimal addieren.', 'u = ' + s + ' cm + ' + s + ' cm + ' + g + ' cm.'], solution: 'u = 2 · ' + s + ' cm + ' + g + ' cm = ' + cm(u) + '.',
        mistakes: function (vv) { var x = M.parseNum(vv[0]); if (x === s + g) return 'Du hast nur einen Schenkel gezählt. Ein gleichschenkliges Dreieck hat zwei gleich lange Schenkel.'; return null; },
        verify: function () { return Math.abs(dist(T[0], T[2]) + dist(T[1], T[2]) + dist(T[0], T[1]) - u) < 1e-9 ? true : 'falsch'; } };
      return { skill: 'Umfang und Seiten', q: 'Ein gleichschenkliges Dreieck hat den Umfang ' + cm(u) + '. Die Basis ist ' + cm(g) + ' lang. Wie lang ist ein Schenkel?' + scene(triItems(T, { sides: ['Schenkel', 'Schenkel', 'Basis = ' + cm(g)], ticks: [1, 1, 0], noNames: true }), { label: 'Gleichschenkliges Dreieck', note: 'Skizze nicht maßstabsgetreu', H: 200 }),
        inputs: [{ kind: 'num', label: 'Schenkel', unit: 'cm', answer: s }],
        hints: ['Ziehe zuerst die Basis vom Umfang ab: ' + u + ' cm − ' + g + ' cm = ' + (u - g) + ' cm.', 'Diese ' + (u - g) + ' cm verteilen sich auf zwei gleich lange Schenkel.', 'Schenkel = ' + (u - g) + ' cm : 2.'],
        solution: 'Schenkel = (' + u + ' cm − ' + g + ' cm) : 2 = ' + (u - g) + ' cm : 2 = ' + cm(s) + '. Kontrolle: ' + s + ' + ' + s + ' + ' + g + ' = ' + u + '.',
        mistakes: function (vv) { var x = M.parseNum(vv[0]); if (x === u - g) return 'Fast! Das sind beide Schenkel zusammen. Teile noch durch 2.'; if (x === u / 3) return 'Du hast durch 3 geteilt. Das passt nur beim gleichseitigen Dreieck. Hier ist die Basis anders lang.'; return null; },
        verify: function () { return 2 * s + g === u && g < 2 * s ? true : 'falsch'; } };
    },
    aussagen: function () {
      var T = [['Jedes gleichseitige Dreieck ist auch gleichschenklig.', 'Es hat sogar drei gleich lange Seiten, also auf jeden Fall zwei.'], ['Ein rechtwinkliges Dreieck kann gleichschenklig sein.', 'Zum Beispiel mit den Winkeln 45°, 45° und 90°.'], ['Ein stumpfwinkliges Dreieck hat genau einen stumpfen Winkel.', 'Zwei stumpfe Winkel wären zusammen schon mehr als 180°.'], ['In jedem Dreieck sind mindestens zwei Winkel spitz.', 'Ein rechter oder stumpfer Winkel kann nur einmal vorkommen.'], ['Im gleichschenkligen Dreieck sind die Basiswinkel gleich groß.', 'Das Dreieck ist achsensymmetrisch. Die Basiswinkel sind Spiegelbilder.']];
      var F = [['Jedes gleichschenklige Dreieck ist auch gleichseitig.', 'Bei einem gleichschenkligen Dreieck kann die Basis anders lang sein, zum Beispiel 5 cm, 5 cm, 3 cm.'], ['Ein gleichseitiges Dreieck kann rechtwinklig sein.', 'Im gleichseitigen Dreieck ist jeder Winkel 60° groß.'], ['Ein Dreieck kann zwei rechte Winkel haben.', 'Zwei rechte Winkel ergeben schon 180°. Für den dritten bleibt nichts.'], ['Aus Strecken von 2 cm, 3 cm und 6 cm kann man ein Dreieck bauen.', '2 cm + 3 cm = 5 cm ist kürzer als 6 cm. Die Seiten treffen sich nicht.'], ['In einem spitzwinkligen Dreieck ist genau ein Winkel spitz.', 'In einem spitzwinkligen Dreieck sind <b>alle drei</b> Winkel spitz.']];
      var askTrue = Math.random() < 0.5, ans = askTrue ? M.pick(T) : M.pick(F), rest = M.shuffle(askTrue ? F : T).slice(0, 3), opts = M.shuffle([ans].concat(rest));
      return { skill: 'Aussagen über Dreiecke', level: 2, q: 'Welche Aussage ist ' + (askTrue ? '<b>richtig</b>' : '<b>falsch</b>') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(function (o) { return o[0]; }), answer: opts.indexOf(ans) }],
        hints: ['Prüfe jede Aussage einzeln. Versuche, ein Gegenbeispiel zu finden.', 'Denke an die Winkelsumme 180° und daran, dass ein gleichseitiges Dreieck drei 60°-Winkel hat.', 'Genau eine Aussage ist ' + (askTrue ? 'richtig' : 'falsch') + '. Die anderen drei sind ' + (askTrue ? 'falsch' : 'richtig') + '.'],
        solution: '„' + ans[0] + '“ ist ' + (askTrue ? 'richtig' : 'falsch') + '. ' + ans[1],
        verify: function () { return opts.filter(function (o) { return (T.indexOf(o) >= 0) === askTrue; }).length === 1 ? true : 'Aussagen falsch'; } };
    },
    staebe: function () {
      var L, list, cnt;
      do { L = []; while (L.length < 5) { var x = M.rnd(2, 12); if (L.indexOf(x) < 0) L.push(x); } L.sort(function (a, b) { return a - b; });
        list = []; for (var i = 0; i < 5; i++) for (var j = i + 1; j < 5; j++) for (var k = j + 1; k < 5; k++) list.push([L[i], L[j], L[k]]);
        cnt = list.filter(function (t) { return t[0] + t[1] > t[2]; }).length; } while (cnt < 3 || cnt > 8);
      return { skill: 'Dreiecke aus Stäben zählen', level: 3, q: 'Lea hat fünf Holzstäbe mit den Längen ' + L.join(' cm, ') + ' cm. Sie legt aus genau drei verschiedenen Stäben ein Dreieck. Die Stäbe darf sie nicht zerbrechen.<br>Wie viele verschiedene Dreiecke kann sie legen?',
        inputs: [{ kind: 'num', label: 'Anzahl Dreiecke', answer: cnt }],
        hints: ['Es gibt genau 10 Möglichkeiten, drei der fünf Stäbe auszuwählen. Schreibe sie geordnet auf, zum Beispiel beginnend mit ' + L[0] + ', ' + L[1] + ', ' + L[2] + '.', 'Prüfe jede Auswahl: Sind die zwei kürzeren Stäbe zusammen länger als der längste?', 'Zum Beispiel ' + L[0] + ' + ' + L[1] + ' = ' + (L[0] + L[1]) + (L[0] + L[1] > L[2] ? ' &gt; ' : ' ≤ ') + L[2] + '. Zähle am Ende alle Treffer.'],
        solution: list.map(function (t) { return t.join(', ') + ': ' + t[0] + ' + ' + t[1] + ' = ' + (t[0] + t[1]) + (t[0] + t[1] > t[2] ? ' &gt; ' + t[2] + ' ✓' : ' ≤ ' + t[2] + ' ✗'); }).join('<br>') + '<br>Lea kann <b>' + cnt + '</b> verschiedene Dreiecke legen.',
        verify: function () { var n = 0; list.forEach(function (t) { if (t[0] + t[1] > t[2] && t[0] + t[2] > t[1] && t[1] + t[2] > t[0]) n++; }); return n === cnt && list.length === 10 ? true : 'Zählung falsch'; } };
    }
  };
  /* Erklärung: drei Dreiecke nebeneinander */
  function row(tris, opts) {
    return '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-end">' + tris.map(function (tr) {
      return '<div style="flex:1 1 150px;max-width:220px;text-align:center">' + scene(triItems(tr.T, { ticks: tr.ticks, angles: tr.angles, noNames: true }), { W: 220, H: 170, pad: 22, label: opts.label + ': ' + tr.name, maxw: 220 }) + '<b style="color:#5b3fa0">' + tr.name + '</b></div>';
    }).join('') + '</div>';
  }
  var ungleichSvg = (function () {
    var c = 8, a = 4.5, b = 2.5, tb = [b * Math.cos(60 * D2R), b * Math.sin(60 * D2R)], ta = [c + a * Math.cos(120 * D2R), a * Math.sin(120 * D2R)];
    return scene([{ t: 'arc', c: [0, 0], r: b, a1: 0, a2: 180, dash: '5 4' }, { t: 'arc', c: [c, 0], r: a, a1: 0, a2: 180, dash: '5 4' }, { t: 'seg', a: [0, 0], b: [c, 0], w: 3 }, { t: 'seg', a: [0, 0], b: tb, color: C_HI, w: 3 }, { t: 'seg', a: [c, 0], b: ta, color: C_HI, w: 3 },
      { t: 'pt', p: [0, 0], color: C_LINE, s: 'A', dir: [0, 1] }, { t: 'pt', p: [c, 0], color: C_LINE, s: 'B', dir: [0, 1] },
      { t: 'text', p: [c / 2, 0], dy: 15, s: 'c = 8 cm', bold: true }, { t: 'text', p: tb, dx: -8, dy: -12, s: 'b = 2,5 cm', anchor: 'end', color: C_HI, bold: true }, { t: 'text', p: [(c + ta[0]) / 2, ta[1] / 2], dx: 10, dy: 0, s: 'a = 4,5 cm', anchor: 'start', color: C_HI, bold: true }, { t: 'text', p: [(tb[0] + ta[0]) / 2, 1.2], s: 'Lücke!', color: C_RED, bold: true, size: 13 }],
      { W: 420, H: 210, bounds: [-3, 12.8, -0.9, 4.8], label: 'Zu kurze Seiten treffen sich nicht', maxw: 440 });
  })();
  return {
    id: '015', title: 'Dreiecksarten', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Winkelarten (spitz, recht, stumpf), Strecken messen',
    lead: 'Dreiecke sind nicht alle gleich: manche haben gleich lange Seiten, manche einen rechten Winkel. Du lernst, Dreiecke zu ordnen, und findest heraus, welche Dreiecke es gar nicht geben kann.',
    einstieg: { html: '<p>Schau dir einen Strommast, eine Brücke oder einen Dachstuhl an. Überall findest du Dreiecke, denn ein Dreieck aus festen Stäben kann man nicht verbiegen. Manche dieser Dreiecke sehen symmetrisch aus, andere haben eine rechtwinklige Ecke, andere sind ganz schief.</p><p class="note">Lea will aus drei Holzstäben von 3 cm, 4 cm und 9 cm ein Dreieck legen. Schafft sie das? Und gibt es ein Dreieck mit zwei rechten Winkeln?</p><p>In diesem Modul lernst du, Dreiecke nach ihren <b>Seiten</b> und nach ihren <b>Winkeln</b> zu ordnen. Du erfährst auch, wann sich drei Strecken überhaupt zu einem Dreieck schließen.</p>' },
    ziele: ['Ich unterscheide unregelmäßige, gleichschenklige und gleichseitige Dreiecke.', 'Ich unterscheide spitzwinklige, rechtwinklige und stumpfwinklige Dreiecke.', 'Ich benenne Dreiecke mit beiden Namen, zum Beispiel gleichschenklig und rechtwinklig.', 'Ich begründe, welche Kombinationen es nicht geben kann.', 'Ich prüfe mit der Dreiecksungleichung, ob drei Strecken ein Dreieck ergeben.'],
    fachwoerter: [['gleichschenklig', 'Ein Dreieck mit (mindestens) zwei gleich langen Seiten. Diese heißen Schenkel, die dritte Seite heißt Basis.'], ['gleichseitig', 'Ein Dreieck mit drei gleich langen Seiten. Alle Winkel sind 60° groß.'], ['rechtwinklig', 'Ein Dreieck mit einem Winkel von genau 90°.'], ['stumpfwinklig', 'Ein Dreieck mit einem Winkel, der größer als 90° ist.'], ['Dreiecksungleichung', 'Zwei Seiten eines Dreiecks sind zusammen immer länger als die dritte Seite.']],
    diagnose: [
      { q: 'Ein Winkel von 120° ist …', options: ['ein stumpfer Winkel', 'ein spitzer Winkel', 'ein rechter Winkel', 'Weiß ich noch nicht'], answer: 0, why: 'Winkel zwischen 90° und 180° heißen stumpf.', review: 'Winkelarten (Klasse 5/6)' },
      { q: 'Wie groß ist ein rechter Winkel?', options: ['90°', '180°', '45°', 'Weiß ich noch nicht'], answer: 0, why: 'Ein rechter Winkel ist genau 90° groß, wie die Ecke eines Blatts Papier.', review: 'Winkelarten und Geodreieck' },
      { q: 'Ein Dreieck hat die Seiten 3 cm, 4 cm und 5 cm. Wie groß ist sein Umfang?', options: ['12 cm', '60 cm', '9 cm', 'Weiß ich noch nicht'], answer: 0, why: 'Der Umfang ist die Summe aller Seiten: 3 + 4 + 5 = 12.', review: 'Umfang von Figuren' },
      { q: 'Welche Figur ist achsensymmetrisch?', options: ['ein Quadrat', 'ein schiefes Viereck mit vier verschieden langen Seiten', 'der Buchstabe F', 'Weiß ich noch nicht'], answer: 0, why: 'Ein Quadrat kann man an vier Achsen spiegeln. Es bleibt gleich.', review: 'Achsensymmetrie (Klasse 5/6)' }],
    erklaerung:
      '<h3>1. Einteilung nach den Seiten</h3><p>Gleich lange Seiten markiert man mit gleichen Strichen.</p>' +
      row([{ T: triSSS(6, 4.5, 5), name: 'unregelmäßig' }, { T: triSSS(5, 5, 4), ticks: [1, 1, 0], name: 'gleichschenklig' }, { T: triSSS(4.6, 4.6, 4.6), ticks: [1, 1, 1], name: 'gleichseitig' }], { label: 'Dreiecke nach Seiten' }) +
      '<div class="merk"><b>Merke:</b> <b>unregelmäßig</b>: alle Seiten verschieden lang. <b>gleichschenklig</b>: zwei Seiten gleich lang (die Schenkel); die dritte heißt Basis. <b>gleichseitig</b>: alle drei Seiten gleich lang.</div>' +
      '<p>Ein gleichseitiges Dreieck ist ein besonderes gleichschenkliges Dreieck. Im gleichschenkligen Dreieck sind die beiden <b>Basiswinkel</b> gleich groß.</p>' +
      '<h3>2. Einteilung nach den Winkeln</h3>' +
      row([{ T: triWW(65, 55, 5), angles: ['65°', '55°', '60°'], name: 'spitzwinklig' }, { T: triWW(90, 35, 5), angles: ['90°', '35°', '55°'], name: 'rechtwinklig' }, { T: triWW(30, 35, 6), angles: ['30°', '35°', '115°'], name: 'stumpfwinklig' }], { label: 'Dreiecke nach Winkeln' }) +
      '<div class="merk"><b>Merke:</b> Entscheidend ist der <b>größte</b> Winkel. Ist er kleiner als 90°, ist das Dreieck <b>spitzwinklig</b>. Ist er genau 90°, ist es <b>rechtwinklig</b>. Ist er größer als 90°, ist es <b>stumpfwinklig</b>.</div>' +
      '<h3>3. Beide Namen zusammen</h3><p>Jedes Dreieck hat einen Namen nach den Seiten und einen nach den Winkeln. Nicht alle Kombinationen sind möglich:</p>' +
      '<table class="tab"><tr><th></th><th>spitzwinklig</th><th>rechtwinklig</th><th>stumpfwinklig</th></tr><tr><th>unregelmäßig</th><td>✓</td><td>✓</td><td>✓</td></tr><tr><th>gleichschenklig</th><td>✓</td><td>✓</td><td>✓</td></tr><tr><th>gleichseitig</th><td>✓</td><td>✗</td><td>✗</td></tr></table>' +
      '<p>Warum? Die drei Winkel eines Dreiecks ergeben zusammen immer <b>180°</b> (mehr dazu in Modul 016). Im gleichseitigen Dreieck ist deshalb jeder Winkel 180° : 3 = 60°. Ein rechter oder stumpfer Winkel kann in einem Dreieck nur einmal vorkommen, sonst wäre die Summe schon 180° oder mehr.</p>' +
      '<h3>4. Die Dreiecksungleichung</h3><p>Nicht aus allen drei Strecken lässt sich ein Dreieck legen. Sind zwei Strecken zusammen zu kurz, treffen sie sich nicht:</p>' + ungleichSvg +
      '<div class="merk"><b>Merke (Dreiecksungleichung):</b> In jedem Dreieck sind zwei Seiten zusammen <b>länger</b> als die dritte Seite: <span class="big-math">a + b &gt; c</span> Es genügt zu prüfen: Sind die beiden kürzeren Seiten zusammen länger als die längste?</div>' +
      '<p class="note">Sind die beiden kürzeren Seiten zusammen <b>genau so lang</b> wie die längste, liegen sie flach auf ihr. Auch dann entsteht kein Dreieck. Außerdem gilt: Der längsten Seite liegt der größte Winkel gegenüber.</p>',
    entdecken: {
      html: '<p>Die Seite AB ist 8 cm lang. Verschiebe die Ecke C mit den Reglern. Beobachte, wie sich die Art des Dreiecks ändert.</p><div class="ctl"><label>C nach rechts: <b id="v_x"></b> <input type="range" id="r_x" min="-2" max="10" step="0.5" value="2.5"></label><label>C nach oben: <b id="v_y"></b> <input type="range" id="r_y" min="0.5" max="8" step="0.5" value="5"></label><label>Auftrag: <select id="s_goal"><option value="1,1">gleichschenklig und rechtwinklig</option><option value="0,1">unregelmäßig und rechtwinklig</option><option value="1,2">gleichschenklig und stumpfwinklig</option><option value="1,0">gleichschenklig und spitzwinklig</option></select></label></div><div id="e_g"></div><p id="e_t" class="big-math"></p><p id="e_goal"></p><p class="note">Tipp: Stelle C genau über die Mitte von AB oder genau über A. Versuchst du ein gleichseitiges Dreieck, kommst du nur fast hin. Weißt du warum?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var x = +root.querySelector('#r_x').value, y = +root.querySelector('#r_y').value, T = [[0, 0], [8, 0], [x, y]];
          root.querySelector('#v_x').textContent = M.fmtNum(x) + ' cm'; root.querySelector('#v_y').textContent = M.fmtNum(y) + ' cm';
          var s = [dist(T[1], T[2]), dist(T[0], T[2]), 8], w = anglesOf(T), e = function (p, q) { return Math.abs(p - q) < 0.02; };
          var st = e(s[0], s[1]) && e(s[1], s[2]) ? 2 : (e(s[0], s[1]) || e(s[1], s[2]) || e(s[0], s[2])) ? 1 : 0;
          var mx = Math.max.apply(null, w), at = Math.abs(mx - 90) < 0.3 ? 1 : mx > 90 ? 2 : 0;
          var ticks = [e(s[0], s[1]) || e(s[0], s[2]) ? 1 : 0, e(s[1], s[0]) || e(s[1], s[2]) ? 1 : 0, e(s[2], s[0]) || e(s[2], s[1]) ? 1 : 0];
          var labs = w.map(function (v) { return Math.round(v) + '°'; });
          var sl = ['a ≈ ' + M.fmtNum(Math.round(s[0] * 10) / 10) + ' cm', 'b ≈ ' + M.fmtNum(Math.round(s[1] * 10) / 10) + ' cm', 'c = 8 cm'];
          root.querySelector('#e_g').innerHTML = scene(triItems(T, { angles: labs, ticks: ticks, sides: sl }), { bounds: [-2.5, 10.5, -0.5, 8.5], W: 360, H: 300, label: 'Dreieck mit beweglicher Ecke C' });
          root.querySelector('#e_t').textContent = 'Das Dreieck ist ' + SEITEN[st] + ' und ' + WINKEL[at] + '.';
          var goal = root.querySelector('#s_goal').value.split(',').map(Number);
          root.querySelector('#e_goal').innerHTML = (goal[0] === st && goal[1] === at) ? '<b style="color:#0f766e">✓ Auftrag erfüllt!</b> Wähle einen neuen Auftrag.' : 'Auftrag noch nicht erfüllt.';
        }
        function step() { draw(); n++; if (n >= 3) done('Gut erkundet: Liegt C über der Mitte von AB, ist das Dreieck gleichschenklig. Liegt C genau über A oder B, ist es rechtwinklig. Je flacher das Dreieck, desto stumpfer der größte Winkel.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        root.querySelector('#s_goal').addEventListener('change', step);
        draw();
      }
    },
    beispiel: { title: 'Dreiecksart bestimmen', q: 'Kann man aus Strecken von 4 cm, 6 cm und 9 cm ein Dreieck bauen? Wenn ja, welche Art von Dreieck ist es?',
      steps: ['Dreiecksungleichung prüfen: Die beiden kürzeren Seiten sind 4 cm + 6 cm = 10 cm. Das ist länger als 9 cm. Es gibt also ein Dreieck.', 'Nach den Seiten: Alle drei Seiten sind verschieden lang. Das Dreieck ist <b>unregelmäßig</b>.', 'Nach den Winkeln: Zeichne das Dreieck und miss den größten Winkel. Er liegt gegenüber der längsten Seite (9 cm). Du misst etwa 127°.', 'Der größte Winkel ist größer als 90°. Das Dreieck ist <b>stumpfwinklig</b>.', 'Antwort: Das Dreieck ist unregelmäßig und stumpfwinklig. Kontrolle in der Zeichnung:' + scene(triItems(triSSS(4, 6, 9), { sides: ['4 cm', '6 cm', '9 cm'], angles: [null, null, '≈ 127°'] }), { label: 'Dreieck mit 4 cm, 6 cm und 9 cm', note: 'verkleinert' })] },
    tasks: { gen: gen, plan: { G: ['nachSeiten:1', 'nachWinkeln:1', 'ungleichung:1', 'umfang:1'], S: ['nachSeiten:1', 'nachWinkeln:1', 'kombination:2', 'ungleichung:2', 'unmoeglich:2'], E: ['kombination:2', 'unmoeglich:2', 'aussagen:2', 'ungleichung:2', 'umfang:2', 'dritteSeite:3'] },
      extra: 'staebe', test: ['nachSeiten:1', 'nachWinkeln:1', 'kombination:2', 'unmoeglich:2', 'ungleichung:2', 'dritteSeite:3'] },
    lerncheck: ['Ich benenne Dreiecke nach ihren Seiten.', 'Ich benenne Dreiecke nach ihren Winkeln.', 'Ich kann begründen, warum es kein gleichseitiges rechtwinkliges Dreieck gibt.', 'Ich prüfe, ob drei Strecken ein Dreieck ergeben.']
  };
})();
