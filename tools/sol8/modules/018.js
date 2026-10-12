/* Modul 018 · Mittelsenkrechte und Umkreis */
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
  function pt(p) { return '(' + M.fmtNum(p[0]) + ' | ' + M.fmtNum(p[1]) + ')'; }
  function stepTxt(dx, dy) { var a = []; if (dx) a.push(Math.abs(dx) + (dx > 0 ? ' nach rechts' : ' nach links')); if (dy) a.push(Math.abs(dy) + (dy > 0 ? ' nach oben' : ' nach unten')); return a.join(' und '); }
  function d2(p, q) { return (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]); }
  function grid(items, b, o) { o = o || {}; return scene(items, { bounds: b, grid: true, gridStep: o.step || 2, W: o.W || 340, H: o.H || 340, pad: 14, label: o.label || 'Koordinatensystem', maxw: o.maxw || 380 }); }
  function msItems(A, B, col) { var m = mid(A, B); return [{ t: 'line', a: m, b: [m[0] - (B[1] - A[1]), m[1] + (B[0] - A[0])], color: col || C_HI, dash: '7 4', w: 1.8 }]; }
  function coordIn(p, lx, ly) { return [{ kind: 'num', label: lx || 'x =', answer: p[0] }, { kind: 'num', label: ly || 'y =', answer: p[1] }]; }
  /* drei Gitterpunkte auf einem Kreis mit ganzzahligem Mittelpunkt */
  function latticeTri(r2s, box, minAng) {
    for (var t = 0; t < 3000; t++) {
      var r2 = M.pick(r2s), R = Math.floor(Math.sqrt(r2)), cand = [];
      for (var x = -R; x <= R; x++) for (var y = -R; y <= R; y++) if (x * x + y * y === r2) cand.push([x, y]);
      var U = [M.rnd(box[0], box[1]), M.rnd(box[0], box[1])];
      var pts = M.shuffle(cand).slice(0, 3).map(function (p) { return [p[0] + U[0], p[1] + U[1]]; });
      if (pts.some(function (p) { return p[0] < 0 || p[1] < 0 || p[0] > box[2] || p[1] > box[2]; })) continue;
      var ang = [angAt(pts[0], pts[1], pts[2]), angAt(pts[1], pts[0], pts[2]), angAt(pts[2], pts[0], pts[1])];
      if (Math.min.apply(null, ang) < (minAng || 25)) continue;
      return { U: U, r2: r2, P: pts, ang: ang };
    }
    return null;
  }
  function sortCCW(P) { var c = centroid(P); return P.slice().sort(function (p, q) { return Math.atan2(p[1] - c[1], p[0] - c[0]) - Math.atan2(q[1] - c[1], q[0] - c[0]); }); }
  var gen = {
    abstand: function () {
      var c = M.rnd(3, 4) * 2, x = c / 2 + M.rnd(1, 5), h = Math.sqrt(x * x - c * c / 4), A = [0, 0], B = [c, 0], P = [c / 2, h];
      return { skill: 'Abstand auf der Mittelsenkrechten', level: 1, q: 'Die gestrichelte Gerade ist die Mittelsenkrechte von AB. Der Punkt P liegt auf ihr und ist ' + cm(x) + ' von A entfernt. Wie weit ist P von B entfernt?' +
        scene(msItems(A, B).concat([{ t: 'seg', a: A, b: B, w: 2.5 }, { t: 'seg', a: A, b: P, color: C_ACC }, { t: 'seg', a: B, b: P, color: C_ACC }, { t: 'angle', v: mid(A, B), a: B, b: P, r: 14 }, { t: 'tick', a: A, b: mid(A, B) }, { t: 'tick', a: mid(A, B), b: B }, { t: 'pt', p: A, s: 'A', color: C_LINE, dir: [-1, 0.4] }, { t: 'pt', p: B, s: 'B', color: C_LINE, dir: [1, 0.4] }, { t: 'pt', p: P, s: 'P', dir: [1, -0.6] }, { t: 'side', a: A, b: P, ref: B, s: cm(x) }, { t: 'side', a: B, b: P, ref: A, s: '?' }]), { label: 'Mittelsenkrechte mit Punkt P', H: 230, note: 'verkleinert' }),
        inputs: [{ kind: 'num', label: 'PB =', unit: 'cm', answer: x }],
        hints: ['Was weißt du über alle Punkte auf der Mittelsenkrechten von AB?', 'Jeder Punkt auf der Mittelsenkrechten ist von A und B <b>gleich weit</b> entfernt.', 'Also ist PB genauso lang wie PA.'],
        solution: 'P liegt auf der Mittelsenkrechten von AB. Darum gilt PB = PA = ' + cm(x) + '.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === c / 2) return 'Das ist der Abstand von A zur Mitte M. Gefragt ist der Abstand von P zu B.'; return null; },
        verify: function () { return Math.abs(dist(P, B) - x) < 1e-9 && Math.abs(dist(P, A) - x) < 1e-9 ? true : 'falsch'; } };
    },
    mittelpunkt: function (lvl) {
      var A, B; do { A = [M.rnd(0, 10), M.rnd(0, 10)]; B = [A[0] + 2 * M.rnd(-5, 5), A[1] + 2 * M.rnd(-5, 5)]; } while (B[0] < 0 || B[0] > 10 || B[1] < 0 || B[1] > 10 || dist(A, B) < 4 || A[0] === B[0] && lvl < 2);
      var Mm = mid(A, B);
      return { skill: 'Mittelpunkt einer Strecke', level: 1, q: 'Die Mittelsenkrechte von AB geht durch den Mittelpunkt M der Strecke AB. Bestimme die Koordinaten von M für A' + pt(A) + ' und B' + pt(B) + '.' +
        grid([{ t: 'seg', a: A, b: B, w: 2.5 }, { t: 'pt', p: A, s: 'A' }, { t: 'pt', p: B, s: 'B' }], [-0.5, 10.5, -0.5, 10.5], { label: 'Strecke AB im Koordinatensystem' }),
        inputs: coordIn(Mm, 'M: x =', 'M: y ='),
        hints: ['M liegt genau in der Mitte zwischen A und B, in x-Richtung und in y-Richtung.', 'x-Koordinate: (' + A[0] + ' + ' + B[0] + ') : 2. y-Koordinate: (' + A[1] + ' + ' + B[1] + ') : 2.', 'Du kannst auch zählen: Von A nach B geht es ' + stepTxt(B[0] - A[0], B[1] - A[1]) + '. Gehe von A aus die Hälfte davon.'],
        solution: 'M = ((' + A[0] + ' + ' + B[0] + ') : 2 | (' + A[1] + ' + ' + B[1] + ') : 2) = ' + pt(Mm) + '.' + grid([{ t: 'seg', a: A, b: B, w: 2.5 }].concat(msItems(A, B), [{ t: 'pt', p: A, s: 'A' }, { t: 'pt', p: B, s: 'B' }, { t: 'pt', p: Mm, s: 'M', color: C_ACC }]), [-0.5, 10.5, -0.5, 10.5], { label: 'Mittelpunkt und Mittelsenkrechte' }),
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x === Math.abs(B[0] - A[0]) / 2 && y === Math.abs(B[1] - A[1]) / 2 && (x !== Mm[0] || y !== Mm[1])) return 'Du hast nur die halben Abstände berechnet. Addiere sie noch zu den Koordinaten von A, oder rechne (x<sub>A</sub> + x<sub>B</sub>) : 2.'; return null; },
        verify: function () { return d2(A, Mm) === d2(B, Mm) && Math.abs(2 * Mm[0] - A[0] - B[0]) < 1e-9 ? true : 'falsch'; } };
    },
    aufMS: function () {
      for (var t = 0; t < 500; t++) {
        var dx = M.rnd(-3, 3), dy = M.rnd(-3, 3); if (!dx && !dy) continue;
        var A = [M.rnd(1, 9), M.rnd(1, 9)], B = [A[0] + 2 * dx, A[1] + 2 * dy]; if (B.some(function (z) { return z < 0 || z > 10; })) continue;
        var Mm = mid(A, B), g = M.gcd(dx, dy), dir = [-dy / g, dx / g], ks = [-4, -3, -2, -1, 1, 2, 3, 4].filter(function (k) { var p = [Mm[0] + k * dir[0], Mm[1] + k * dir[1]]; return p[0] >= 0 && p[0] <= 10 && p[1] >= 0 && p[1] <= 10; });
        if (!ks.length) continue;
        var k = M.pick(ks), on = [Mm[0] + k * dir[0], Mm[1] + k * dir[1]], others = [], tries = 0;
        while (others.length < 3 && tries++ < 200) { var q = [M.rnd(0, 10), M.rnd(0, 10)]; if (d2(q, A) === d2(q, B)) continue; if (q[0] === A[0] && q[1] === A[1] || q[0] === B[0] && q[1] === B[1]) continue; if ([on].concat(others).some(function (o) { return dist(o, q) < 2; }) || dist(q, A) < 1.5 || dist(q, B) < 1.5) continue; var nearMS = Math.abs((q[0] - Mm[0]) * (B[0] - A[0]) + (q[1] - Mm[1]) * (B[1] - A[1])) / dist(A, B); if (nearMS < 0.7) continue; others.push(q); }
        if (others.length < 3) continue;
        var names = ['P', 'Q', 'R', 'S'], all = M.shuffle([on].concat(others)), idx = all.indexOf(on);
        var it = [{ t: 'seg', a: A, b: B, w: 2.5 }, { t: 'pt', p: A, s: 'A', color: C_LINE }, { t: 'pt', p: B, s: 'B', color: C_LINE }].concat(all.map(function (p, i) { return { t: 'pt', p: p, s: names[i], color: C_ACC, lcolor: '#b45309' }; }));
        return { skill: 'Punkt auf der Mittelsenkrechten finden', level: 2, q: 'Welcher Punkt ist von A und von B <b>gleich weit</b> entfernt?' + grid(it, [-0.5, 10.5, -0.5, 10.5], { label: 'Strecke AB und vier Punkte' }),
          inputs: [{ kind: 'mc', label: 'Punkt', options: names.map(function (n, i) { return n + pt(all[i]); }), answer: idx }],
          hints: ['Alle Punkte, die von A und B gleich weit entfernt sind, liegen auf der Mittelsenkrechten von AB.', 'Die Mittelsenkrechte geht durch die Mitte M' + pt(Mm) + ' und steht senkrecht auf AB.', 'Von M aus geht die Mittelsenkrechte in Schritten von ' + stepTxt(dir[0], dir[1]) + ' (oder genau umgekehrt). Welcher Punkt liegt darauf?'],
          solution: names[idx] + pt(on) + ' liegt auf der Mittelsenkrechten von AB. Darum ist er von A und B gleich weit entfernt.' + grid(it.concat(msItems(A, B), [{ t: 'seg', a: on, b: A, color: C_ACC, dash: '4 3' }, { t: 'seg', a: on, b: B, color: C_ACC, dash: '4 3' }, { t: 'pt', p: Mm, s: 'M', color: C_HI }]), [-0.5, 10.5, -0.5, 10.5], { label: 'Lösung mit Mittelsenkrechter' }),
          verify: function () { return all.filter(function (p) { return d2(p, A) === d2(p, B); }).length === 1 && d2(on, A) === d2(on, B) ? true : 'nicht eindeutig'; } };
      }
    },
    lage: function () {
      var tp = M.rnd(0, 2), w;
      if (tp === 0) { do { w = [M.rnd(40, 80), M.rnd(40, 80)]; } while (180 - w[0] - w[1] >= 85 || 180 - w[0] - w[1] < 35); }
      else if (tp === 1) { var a = M.rnd(25, 65); w = [a, 90 - a]; }
      else { w = [M.rnd(20, 35), M.rnd(20, 35)]; }
      var g = 180 - w[0] - w[1], T = orient(triWW(w[0], w[1])), OPT = ['im Inneren des Dreiecks', 'genau in der Mitte der längsten Seite', 'außerhalb des Dreiecks'];
      var labs = [w[0] + '°', w[1] + '°', g + '°'];
      return { skill: 'Lage des Umkreismittelpunkts', level: 1, q: 'Wo liegt der Umkreismittelpunkt U dieses Dreiecks?' + scene(triItems(T, { angles: labs }), { label: 'Dreieck mit Winkeln', H: 220 }),
        inputs: [{ kind: 'mc', label: 'U liegt …', options: OPT, answer: tp }],
        hints: ['Die Lage von U hängt davon ab, ob das Dreieck spitzwinklig, rechtwinklig oder stumpfwinklig ist.', 'Der größte Winkel ist ' + Math.max(w[0], w[1], g) + '°.', 'spitzwinklig: U innen. rechtwinklig: U in der Mitte der längsten Seite. stumpfwinklig: U außen.'],
        solution: 'Der größte Winkel ist ' + Math.max(w[0], w[1], g) + '°, das Dreieck ist ' + ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'][tp] + '. Darum liegt U ' + OPT[tp] + '.' + (function () { var U = circum(T[0], T[1], T[2]); return scene(triItems(T, { angles: labs }).concat([{ t: 'circle', c: U, r: dist(U, T[0]), dash: '6 4' }, { t: 'pt', p: U, s: 'U', color: C_ACC }]), { label: 'Dreieck mit Umkreis', H: 260 }); })(),
        verify: function () { var U = circum(T[0], T[1], T[2]), cr = function (p, q, r) { return (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); }; var s = [cr(T[0], T[1], U), cr(T[1], T[2], U), cr(T[2], T[0], U)]; var inside = s.every(function (x) { return x > 1e-6; }) || s.every(function (x) { return x < -1e-6; }); var on = s.some(function (x) { return Math.abs(x) < 1e-6; }); return (tp === 0 && inside) || (tp === 1 && on) || (tp === 2 && !inside && !on) ? true : 'Lage falsch'; } };
    },
    umkreisGitter: function () {
      var L = latticeTri([5, 10, 13, 17, 25], [2, 10, 12], 25), P = sortCCW(L.P), U = L.U, names = ['A', 'B', 'C'];
      var base = [{ t: 'poly', p: P }].concat(P.map(function (p, i) { return { t: 'pt', p: p, s: names[i], color: C_LINE, dir: [p[0] - centroid(P)[0], p[1] - centroid(P)[1]] }; }));
      return { skill: 'Umkreismittelpunkt im Gitter', level: 2, q: 'Bestimme die Koordinaten des Umkreismittelpunkts U des Dreiecks mit A' + pt(P[0]) + ', B' + pt(P[1]) + ' und C' + pt(P[2]) + '. Zeichne dazu die Mittelsenkrechten im Heft oder überlege am Gitter.' + grid(base, [-0.5, 12.5, -0.5, 12.5], { label: 'Dreieck im Koordinatensystem' }),
        inputs: coordIn(U, 'U: x =', 'U: y ='),
        hints: ['U ist der Schnittpunkt der Mittelsenkrechten. Zwei Mittelsenkrechte reichen.', 'Bestimme die Mittelpunkte zweier Seiten, zum Beispiel von AB: ' + pt(mid(P[0], P[1])) + ' und von BC: ' + pt(mid(P[1], P[2])) + '. Zeichne durch sie die Senkrechten zur Seite.', 'Kontrolle: U muss von A, B und C gleich weit entfernt sein. Zähle die Kästchen von U zu den Ecken (waagerecht und senkrecht).'],
        solution: 'Die Mittelsenkrechten schneiden sich in U' + pt(U) + '. Probe: Von U aus erreicht man jede Ecke mit gleich langen Schritten, zum Beispiel ' + P.map(function (p, i) { return names[i] + ': ' + Math.abs(p[0] - U[0]) + ' waagerecht, ' + Math.abs(p[1] - U[1]) + ' senkrecht'; }).join('; ') + '. Das ergibt jeweils denselben Abstand.' +
          grid(base.concat(msItems(P[0], P[1]), msItems(P[1], P[2]), msItems(P[2], P[0]), [{ t: 'circle', c: U, r: Math.sqrt(L.r2), dash: '6 4', color: C_ACC }, { t: 'pt', p: U, s: 'U', color: C_ACC }]), [-0.5, 12.5, -0.5, 12.5], { label: 'Umkreis mit Mittelsenkrechten' }),
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]), S = centroid(P); if (Math.abs(x - S[0]) < 0.6 && Math.abs(y - S[1]) < 0.6 && (x !== U[0] || y !== U[1])) return 'Der Umkreismittelpunkt ist nicht einfach die „Mitte“ des Dreiecks. Er muss von allen drei Ecken gleich weit entfernt sein. Konstruiere die Mittelsenkrechten.'; return null; },
        verify: function () { var C = circum(P[0], P[1], P[2]); return Math.abs(C[0] - U[0]) < 1e-9 && Math.abs(C[1] - U[1]) < 1e-9 && d2(U, P[0]) === L.r2 && d2(U, P[2]) === L.r2 ? true : 'U falsch'; } };
    },
    rechtwinklig: function () {
      var p, q, C; do { p = 2 * M.rnd(1, 5) * M.pick([-1, 1]); q = 2 * M.rnd(1, 5) * M.pick([-1, 1]); C = [M.rnd(0, 10), M.rnd(0, 10)]; } while (C[0] + p < 0 || C[0] + p > 10 || C[1] + q < 0 || C[1] + q > 10 || Math.abs(p) + Math.abs(q) < 7);
      var A = [C[0] + p, C[1]], B = [C[0], C[1] + q], U = mid(A, B), r = dist(A, B) / 2;
      var base = [{ t: 'poly', p: [A, B, C] }, { t: 'angle', v: C, a: A, b: B }, { t: 'pt', p: A, s: 'A', color: C_LINE, dir: [p > 0 ? 1 : -1, -0.5] }, { t: 'pt', p: B, s: 'B', color: C_LINE, dir: [-0.5, q > 0 ? 1 : -1] }, { t: 'pt', p: C, s: 'C', color: C_LINE, dir: [p > 0 ? -1 : 1, q > 0 ? -1 : 1] }];
      return { skill: 'Umkreis im rechtwinkligen Dreieck', level: 2, q: 'Das Dreieck ABC hat bei C einen rechten Winkel. Es ist A' + pt(A) + ', B' + pt(B) + ', C' + pt(C) + '. Gib die Koordinaten des Umkreismittelpunkts U an.' + grid(base, [-0.5, 10.5, -0.5, 10.5], { label: 'Rechtwinkliges Dreieck im Gitter' }),
        inputs: coordIn(U, 'U: x =', 'U: y ='),
        hints: ['Im rechtwinkligen Dreieck liegt der Umkreismittelpunkt auf der längsten Seite, der Seite gegenüber dem rechten Winkel.', 'Die längste Seite ist AB. U ist ihr Mittelpunkt.', 'U = ((' + A[0] + ' + ' + B[0] + ') : 2 | (' + A[1] + ' + ' + B[1] + ') : 2).'],
        solution: 'U ist der Mittelpunkt von AB: U = ' + pt(U) + '.' + grid(base.concat(msItems(A, C), msItems(B, C), [{ t: 'circle', c: U, r: r, dash: '6 4', color: C_ACC }, { t: 'pt', p: U, s: 'U', color: C_ACC }]), [-0.5, 10.5, -0.5, 10.5], { label: 'Umkreis des rechtwinkligen Dreiecks' }),
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x === C[0] && y === C[1]) return 'C ist die Ecke mit dem rechten Winkel. U muss aber von allen drei Ecken gleich weit entfernt sein. Er liegt auf der Seite gegenüber von C.'; return null; },
        verify: function () { var X = circum(A, B, C); return Math.abs(X[0] - U[0]) < 1e-9 && Math.abs(X[1] - U[1]) < 1e-9 ? true : 'falsch'; } };
    },
    reihenfolge: function () {
      var t;
      if (Math.random() < 0.5) t = orderTask(['Zeichne um A einen Kreisbogen. Der Radius muss größer sein als die halbe Strecke AB.', 'Zeichne um B einen Kreisbogen mit demselben Radius.', 'Markiere die beiden Schnittpunkte der Kreisbögen.', 'Zeichne die Gerade durch die beiden Schnittpunkte. Das ist die Mittelsenkrechte.'], [[0, 1, 2, 3], [1, 0, 2, 3]], 'Konstruktion ordnen', 'So konstruierst du die Mittelsenkrechte einer Strecke AB. Die Schritte sind durcheinandergeraten:');
      else t = orderTask(['Zeichne das Dreieck ABC.', 'Konstruiere die Mittelsenkrechte der Seite AB.', 'Konstruiere die Mittelsenkrechte der Seite BC.', 'Markiere den Schnittpunkt der Mittelsenkrechten als U.', 'Zeichne den Kreis um U durch A. Er geht auch durch B und C.'], [[0, 1, 2, 3, 4], [0, 2, 1, 3, 4]], 'Konstruktion ordnen', 'So konstruierst du den Umkreis eines Dreiecks. Die Schritte sind durcheinandergeraten:');
      t.level = 1; return t;
    },
    brunnen: function () {
      var L; for (var t = 0; t < 200; t++) { L = latticeTri([25], [5, 7, 12], 30); if (L.P.some(function (p) { return p[0] === L.U[0] || p[1] === L.U[1]; })) break; }
      var P = sortCCW(L.P), U = L.U, k = M.pick([50, 100, 20]), names = ['Haus 1', 'Haus 2', 'Haus 3'];
      var ax = P.filter(function (p) { return p[0] === U[0] || p[1] === U[1]; })[0], ai = P.indexOf(ax);
      var base = P.map(function (p, i) { return { t: 'pt', p: p, s: 'H' + (i + 1), color: C_LINE, r: 6, dir: [p[0] - centroid(P)[0], p[1] - centroid(P)[1]] }; });
      return { skill: 'Anwendung: gleicher Abstand zu drei Orten', level: 3, q: 'Drei Häuser H1' + pt(P[0]) + ', H2' + pt(P[1]) + ' und H3' + pt(P[2]) + ' sollen einen gemeinsamen Brunnen bekommen. Er soll von allen drei Häusern <b>gleich weit</b> entfernt sein. Ein Kästchen im Plan entspricht ' + k + ' m.<br>a) Wo liegt der Brunnen? b) Wie weit ist er von jedem Haus entfernt?' + grid(base, [-0.5, 12.5, -0.5, 12.5], { label: 'Plan mit drei Häusern' }),
        inputs: [{ kind: 'num', label: 'a) Brunnen x =', answer: U[0] }, { kind: 'num', label: 'a) Brunnen y =', answer: U[1] }, { kind: 'num', label: 'b) Entfernung', unit: 'm', answer: 5 * k }],
        hints: ['Gleich weit von drei Punkten entfernt ist der Umkreismittelpunkt des Dreiecks H1 H2 H3.', 'Konstruiere zwei Mittelsenkrechte, zum Beispiel von H1H2 (Mitte ' + pt(mid(P[0], P[1])) + ') und von H2H3 (Mitte ' + pt(mid(P[1], P[2])) + ').', 'Haus ' + (ai + 1) + ' liegt genau ' + (ax[0] === U[0] ? 'senkrecht über oder unter' : 'waagerecht neben') + ' dem Brunnen. Zähle dort die Kästchen und rechne mit ' + k + ' m pro Kästchen.'],
        solution: 'a) Der Umkreismittelpunkt ist ' + pt(U) + '. b) Von dort bis H' + (ai + 1) + pt(ax) + ' sind es 5 Kästchen, also 5 · ' + k + ' m = <b>' + 5 * k + ' m</b>. Da der Brunnen auf allen drei Mittelsenkrechten liegt, ist er von jedem Haus so weit entfernt.' +
          grid(base.concat([{ t: 'poly', p: P, fill: 'none', dash: '3 3', w: 1 }], msItems(P[0], P[1]), msItems(P[1], P[2]), [{ t: 'circle', c: U, r: 5, dash: '6 4', color: C_ACC }, { t: 'seg', a: U, b: ax, color: C_ACC, w: 2.5 }, { t: 'pt', p: U, s: 'Brunnen', color: C_ACC }]), [-0.5, 12.5, -0.5, 12.5], { label: 'Lösung: Brunnen im Umkreismittelpunkt' }),
        verify: function () { var C = circum(P[0], P[1], P[2]); return Math.abs(C[0] - U[0]) < 1e-9 && Math.abs(C[1] - U[1]) < 1e-9 && Math.abs(dist(U, P[1]) - 5) < 1e-9 ? true : 'Brunnen falsch'; } };
    },
    msGerade: function () {
      for (var t = 0; t < 1000; t++) {
        var d = M.rnd(1, 3) * M.pick([-1, 1]), s = M.pick([-1, 1]), A = [M.rnd(0, 10), M.rnd(0, 10)], B = [A[0] + 2 * d, A[1] + 2 * d * s];
        if (B.some(function (z) { return z < 0 || z > 10; })) continue;
        var Mm = mid(A, B), horiz = Math.random() < 0.5, k = horiz ? M.rnd(0, 3) : M.rnd(0, 3), U;
        /* Mittelsenkrechte: M + t·(−s, 1) */
        if (horiz) { U = [Mm[0] - s * (k - Mm[1]), k]; } else { U = [k, Mm[1] + (k - Mm[0]) / -s]; }
        if (U.some(function (z) { return z < 0 || z > 10 || Math.abs(z - Math.round(z)) > 1e-9; }) || dist(U, Mm) < 1.5) continue;
        var lineTxt = horiz ? (k === 0 ? 'auf der x-Achse' : 'auf der waagerechten Geraden y = ' + k) : (k === 0 ? 'auf der y-Achse' : 'auf der senkrechten Geraden x = ' + k);
        var g = horiz ? { t: 'line', a: [0, k], b: [1, k], color: C_GRN, w: 2.5 } : { t: 'line', a: [k, 0], b: [k, 1], color: C_GRN, w: 2.5 };
        var base = [g, { t: 'pt', p: A, s: 'A', color: C_LINE }, { t: 'pt', p: B, s: 'B', color: C_LINE }];
        return { skill: 'Mittelsenkrechte und Gerade schneiden', level: 3, q: 'Ein Kreis soll durch die Punkte A' + pt(A) + ' und B' + pt(B) + ' gehen. Sein Mittelpunkt Z soll ' + lineTxt + ' liegen (grüne Linie). Bestimme die Koordinaten von Z.' + grid(base, [-0.5, 10.5, -0.5, 10.5], { label: 'Punkte A und B und eine Gerade' }),
          inputs: coordIn(U, 'Z: x =', 'Z: y ='),
          hints: ['Z ist von A und B gleich weit entfernt (beide liegen auf dem Kreis). Also liegt Z auf der Mittelsenkrechten von AB.', 'Die Mitte von AB ist ' + pt(Mm) + '. AB verläuft schräg (' + (s > 0 ? '1 nach rechts, 1 nach oben' : '1 nach rechts, 1 nach unten') + '). Die Mittelsenkrechte verläuft genau quer dazu: ' + (s > 0 ? '1 nach rechts, 1 nach unten' : '1 nach rechts, 1 nach oben') + '.', 'Gehe von ' + pt(Mm) + ' auf der Mittelsenkrechten so weit, bis du die grüne Linie triffst.'],
          solution: 'Z liegt auf der Mittelsenkrechten von AB und auf der grünen Linie. Der Schnittpunkt ist Z' + pt(U) + '. Probe: Z ist von A und B gleich weit entfernt.' + grid(base.concat(msItems(A, B), [{ t: 'seg', a: A, b: B, dash: '3 3', w: 1.2 }, { t: 'circle', c: U, r: dist(U, A), dash: '6 4', color: C_ACC }, { t: 'pt', p: Mm, s: 'M', color: C_HI }, { t: 'pt', p: U, s: 'Z', color: C_ACC }]), [-0.5, 10.5, -0.5, 10.5], { label: 'Lösung mit Mittelsenkrechter' }),
          verify: function () { return Math.abs(d2(U, A) - d2(U, B)) < 1e-9 && (horiz ? U[1] === k : U[0] === k) ? true : 'Z falsch'; } };
      }
    }
  };
  /* Erklärungsfiguren */
  var eA = [0, 0], eB = [6, 0], eP = [3, 3.6];
  var figMS = scene(msItems(eA, eB).concat([{ t: 'seg', a: eA, b: eB, w: 2.5 }, { t: 'seg', a: eA, b: eP, color: C_ACC }, { t: 'seg', a: eB, b: eP, color: C_ACC }, { t: 'tick', a: eA, b: eP, n: 2, color: C_ACC }, { t: 'tick', a: eB, b: eP, n: 2, color: C_ACC }, { t: 'tick', a: eA, b: [3, 0] }, { t: 'tick', a: [3, 0], b: eB }, { t: 'angle', v: [3, 0], a: eB, b: [3, 2], r: 14 }, { t: 'pt', p: eA, s: 'A', color: C_LINE, dir: [-1, 0.3] }, { t: 'pt', p: eB, s: 'B', color: C_LINE, dir: [1, 0.3] }, { t: 'pt', p: [3, 0], s: 'M', color: C_LINE, dir: [0.6, 1] }, { t: 'pt', p: eP, s: 'P', dir: [1, -0.4] }, { t: 'text', p: [3, -1.6], s: 'Mittelsenkrechte', color: C_HI, anchor: 'start', dx: 6 }]), { label: 'Mittelsenkrechte mit Punkt P', W: 340, H: 230, bounds: [-1.5, 7.5, -2, 4.4] });
  var cA = [0, 0], cB = [7, 0], cC = [2.5, 4.5], cU = circum(cA, cB, cC);
  var figU = scene([{ t: 'circle', c: cU, r: dist(cU, cA), dash: '6 4', color: C_ACC }, { t: 'poly', p: [cA, cB, cC] }].concat(msItems(cA, cB), msItems(cB, cC), msItems(cC, cA), [{ t: 'seg', a: cU, b: cA, color: C_ACC, w: 1.5 }, { t: 'seg', a: cU, b: cB, color: C_ACC, w: 1.5 }, { t: 'seg', a: cU, b: cC, color: C_ACC, w: 1.5 }, { t: 'pt', p: cA, s: 'A', color: C_LINE, dir: [-1, -0.3] }, { t: 'pt', p: cB, s: 'B', color: C_LINE, dir: [1, -0.3] }, { t: 'pt', p: cC, s: 'C', color: C_LINE, dir: [0, -1] }, { t: 'pt', p: cU, s: 'U', color: C_ACC, dir: [0.4, 1] }]), { label: 'Umkreis mit drei Mittelsenkrechten', W: 340, H: 300 });
  function lageFig(w, name) {
    var T = orient(triWW(w[0], w[1])), U = circum(T[0], T[1], T[2]);
    return '<div style="flex:1 1 150px;max-width:220px;text-align:center">' + scene(triItems(T, { noNames: true, angles: [null, null, null] }).concat([{ t: 'circle', c: U, r: dist(U, T[0]), dash: '5 4', color: C_ACC }, { t: 'pt', p: U, s: 'U', color: C_ACC }]), { W: 220, H: 200, pad: 16, label: 'Umkreis ' + name, maxw: 220 }) + '<b style="color:#5b3fa0">' + name + '</b></div>';
  }
  var lageRow = '<div style="display:flex;flex-wrap:wrap;gap:6px 14px;align-items:flex-end">' + lageFig([65, 55], 'spitzwinklig: U innen') + lageFig([35, 55], 'rechtwinklig: U auf der längsten Seite') + lageFig([25, 35], 'stumpfwinklig: U außen') + '</div>';
  return {
    id: '018', title: 'Mittelsenkrechte und Umkreis', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Kreis und Radius, Koordinatensystem, Dreiecksarten',
    lead: 'Wo muss ein Brunnen stehen, damit er von drei Häusern gleich weit entfernt ist? Mit der Mittelsenkrechten findest du solche Punkte und konstruierst den Umkreis eines Dreiecks.',
    einstieg: { html: '<p>Drei Bauernhöfe liegen weit verstreut im Fehn. Sie wollen sich einen neuen Brunnen teilen. Damit niemand benachteiligt ist, soll der Brunnen von allen drei Höfen <b>gleich weit</b> entfernt sein.</p><p class="note">Wo muss der Brunnen hin? Gibt es so einen Punkt immer? Kann er auch außerhalb des Dreiecks liegen, das die Höfe bilden?</p><p>In diesem Modul lernst du die <b>Mittelsenkrechte</b> kennen. Sie enthält alle Punkte, die von zwei Punkten gleich weit entfernt sind. Mit ihr findest du den Brunnenplatz, den <b>Umkreismittelpunkt</b>.</p>' },
    ziele: ['Ich weiß, dass alle Punkte der Mittelsenkrechten von A und B gleich weit entfernt sind.', 'Ich konstruiere die Mittelsenkrechte einer Strecke mit dem Zirkel.', 'Ich konstruiere den Umkreismittelpunkt und den Umkreis eines Dreiecks.', 'Ich weiß, wo der Umkreismittelpunkt bei spitz-, recht- und stumpfwinkligen Dreiecken liegt.', 'Ich löse Sachaufgaben mit dem Umkreismittelpunkt, auch im Koordinatensystem.'],
    fachwoerter: [['Mittelsenkrechte', 'Die Gerade, die durch die Mitte einer Strecke geht und senkrecht auf ihr steht.'], ['Ortslinie', 'Eine Linie, auf der alle Punkte mit einer bestimmten Eigenschaft liegen, zum Beispiel „gleich weit von A und B“.'], ['Umkreis', 'Der Kreis, der durch alle drei Ecken eines Dreiecks geht.'], ['Umkreismittelpunkt U', 'Der Schnittpunkt der drei Mittelsenkrechten. Er ist von allen Ecken gleich weit entfernt.']],
    diagnose: [
      { q: 'Was bedeutet „g steht senkrecht auf h“?', options: ['g und h schneiden sich im rechten Winkel (90°).', 'g und h sind parallel.', 'g ist länger als h.', 'Weiß ich noch nicht'], answer: 0, why: 'Senkrecht heißt: Die Geraden bilden einen rechten Winkel.', review: 'Senkrechte und Parallelen (Klasse 5/6)' },
      { q: 'Ein Kreis hat den Mittelpunkt M und den Radius 3 cm. Der Punkt P ist 3 cm von M entfernt. Wo liegt P?', options: ['auf dem Kreis', 'im Inneren des Kreises', 'außerhalb des Kreises', 'Weiß ich noch nicht'], answer: 0, why: 'Alle Punkte mit dem Abstand r vom Mittelpunkt liegen auf dem Kreis.', review: 'Kreis und Radius' },
      { q: 'Welcher Punkt liegt in der Mitte zwischen 2 und 8 auf dem Zahlenstrahl?', options: ['5', '3', '6', 'Weiß ich noch nicht'], answer: 0, why: '(2 + 8) : 2 = 5.', review: 'Zahlenstrahl und Mittelwert' },
      { q: 'Der Punkt P(4 | 1) liegt im Koordinatensystem …', options: ['4 nach rechts und 1 nach oben vom Ursprung', '1 nach rechts und 4 nach oben vom Ursprung', '4 nach oben und 1 nach links', 'Weiß ich noch nicht'], answer: 0, why: 'Zuerst kommt die x-Koordinate (rechts), dann die y-Koordinate (oben).', review: 'Koordinatensystem (Klasse 6)' }],
    erklaerung:
      '<h3>1. Die Mittelsenkrechte</h3><p>Die <b>Mittelsenkrechte</b> einer Strecke AB geht durch ihren Mittelpunkt M und steht senkrecht auf AB. Jeder Punkt P auf ihr ist von A und B gleich weit entfernt.</p>' + figMS +
      '<div class="merk"><b>Merke:</b> Die Mittelsenkrechte von AB ist die <b>Ortslinie</b> aller Punkte, die von A und B <b>gleich weit</b> entfernt sind. Liegt P auf der Mittelsenkrechten, gilt PA = PB. Umgekehrt liegt jeder Punkt mit PA = PB auf der Mittelsenkrechten.</div>' +
      '<h3>2. So konstruierst du die Mittelsenkrechte</h3><ol><li>Zeichne um A einen Kreisbogen mit einem Radius, der größer ist als die halbe Strecke AB.</li><li>Zeichne um B einen Kreisbogen mit demselben Radius.</li><li>Die Kreisbögen schneiden sich in zwei Punkten. Zeichne die Gerade durch diese Punkte.</li></ol>' +
      '<h3>3. Der Umkreis</h3><p>Zeichnest du in einem Dreieck die Mittelsenkrechten aller drei Seiten, schneiden sie sich in <b>einem</b> Punkt U. Er ist von A, B und C gleich weit entfernt. Der Kreis um U durch A geht deshalb auch durch B und C.</p>' + figU +
      '<div class="merk"><b>Merke:</b> Die drei Mittelsenkrechten eines Dreiecks schneiden sich im <b>Umkreismittelpunkt U</b>. Der Kreis um U durch eine Ecke ist der <b>Umkreis</b>. Zum Konstruieren reichen zwei Mittelsenkrechte.</div>' +
      '<h3>4. Wo liegt U?</h3>' + lageRow +
      '<p>Im rechtwinkligen Dreieck liegt U genau in der Mitte der längsten Seite (gegenüber dem rechten Winkel).</p>' +
      '<h3>5. Im Koordinatensystem</h3><p>Den Mittelpunkt einer Strecke von A(x<sub>1</sub> | y<sub>1</sub>) nach B(x<sub>2</sub> | y<sub>2</sub>) berechnest du so: <span class="big-math">M = ((x<sub>1</sub> + x<sub>2</sub>) : 2 | (y<sub>1</sub> + y<sub>2</sub>) : 2)</span></p><p class="note">Beispiel: A(2 | 1) und B(6 | 5) haben den Mittelpunkt M(4 | 3).</p>',
    entdecken: {
      html: '<p>A und B liegen fest. Verschiebe die Ecke C. Die drei Mittelsenkrechten schneiden sich immer in einem Punkt U.</p><div class="ctl"><label>C nach rechts: <b id="v_x"></b> <input type="range" id="r_x" min="-1" max="9" step="0.5" value="2.5"></label><label>C nach oben: <b id="v_y"></b> <input type="range" id="r_y" min="0.5" max="7" step="0.5" value="5"></label></div><div id="e_g"></div><p id="e_t" class="big-math"></p><p id="e_l"></p><p class="note">Finde eine Lage von C, bei der U genau auf der Seite AB liegt. Welchen Winkel hat das Dreieck dann bei C?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var x = +root.querySelector('#r_x').value, y = +root.querySelector('#r_y').value, A = [0, 0], B = [8, 0], C = [x, y], U = circum(A, B, C), r = dist(U, A), g = angAt(C, A, B);
          root.querySelector('#v_x').textContent = M.fmtNum(x) + ' cm'; root.querySelector('#v_y').textContent = M.fmtNum(y) + ' cm';
          var mx = Math.max(g, angAt(A, B, C), angAt(B, A, C)), tp = Math.abs(mx - 90) < 0.3 ? 1 : mx > 90 ? 2 : 0;
          var vis = U[0] > -2.7 && U[0] < 10.7 && U[1] > -3.7 && U[1] < 7.7;
          var it = [{ t: 'circle', c: U, r: r, dash: '6 4', color: C_ACC }].concat(triItems([A, B, C], { angles: [null, null, Math.round(g) + '°'] }), msItems(A, B), msItems(B, C), msItems(C, A), vis ? [{ t: 'seg', a: U, b: A, color: C_ACC, w: 1.2 }, { t: 'seg', a: U, b: B, color: C_ACC, w: 1.2 }, { t: 'seg', a: U, b: C, color: C_ACC, w: 1.2 }, { t: 'pt', p: U, s: 'U', color: C_ACC, dir: [0.7, 0.7] }] : [{ t: 'text', p: [4, -3.4], s: 'U liegt weit außerhalb des Bildes', color: C_RED, bold: true }]);
          root.querySelector('#e_g').innerHTML = scene(it, { bounds: [-3, 11, -4, 8], W: 380, H: 330, label: 'Dreieck mit Mittelsenkrechten und Umkreis', note: 'verkleinert' });
          root.querySelector('#e_t').textContent = 'UA = UB = UC ≈ ' + M.fmtNum(Math.round(r * 10) / 10) + ' cm';
          root.querySelector('#e_l').innerHTML = 'Das Dreieck ist <b>' + ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'][tp] + '</b>. U liegt ' + ['im Inneren des Dreiecks.', 'genau auf der längsten Seite.', 'außerhalb des Dreiecks.'][tp];
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: U ist immer von allen drei Ecken gleich weit entfernt. Bei einem rechten Winkel in C liegt U genau in der Mitte von AB, bei einem stumpfen Winkel außerhalb.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Ein Brunnen für drei Höfe', q: 'Drei Höfe liegen bei H1(1 | 1), H2(9 | 1) und H3(5 | 9) im Plan (1 Kästchen ≙ 100 m). Wo muss der Brunnen hin, damit er von allen drei Höfen gleich weit entfernt ist? Wie weit ist er dann von jedem Hof entfernt?',
      steps: ['Gesucht ist der Punkt, der von drei Punkten gleich weit entfernt ist. Das ist der <b>Umkreismittelpunkt</b> des Dreiecks H1 H2 H3.', 'Mittelsenkrechte von H1H2: Die Mitte ist (5 | 1). H1H2 ist waagerecht, also ist die Mittelsenkrechte die senkrechte Gerade durch x = 5.', 'Mittelsenkrechte von H2H3: Die Mitte ist (7 | 5). Von H2 nach H3 geht es 4 nach links und 8 nach oben. Die Mittelsenkrechte steht senkrecht dazu: 2 nach links, 1 nach unten. So trifft sie die Gerade x = 5 im Punkt (5 | 4).', 'Der Brunnen steht bei <b>U(5 | 4)</b>. Bis H3(5 | 9) sind es 5 Kästchen senkrecht nach oben, also <b>500 m</b>. So weit ist er von jedem Hof entfernt.', 'Kontrolle: Von U nach H1 geht es 4 nach links und 3 nach unten, nach H2 4 nach rechts und 3 nach unten. Der Kreis um U mit Radius 5 Kästchen geht durch alle drei Höfe.' + grid([{ t: 'poly', p: [[1, 1], [9, 1], [5, 9]], fill: 'none', dash: '3 3', w: 1 }, { t: 'circle', c: [5, 4], r: 5, dash: '6 4', color: C_ACC }].concat(msItems([1, 1], [9, 1]), msItems([9, 1], [5, 9]), [{ t: 'seg', a: [5, 4], b: [5, 9], color: C_ACC, w: 2.5 }, { t: 'pt', p: [1, 1], s: 'H1', color: C_LINE, dir: [-1, 0.6] }, { t: 'pt', p: [9, 1], s: 'H2', color: C_LINE, dir: [1, 0.6] }, { t: 'pt', p: [5, 9], s: 'H3', color: C_LINE, dir: [1, -0.4] }, { t: 'pt', p: [5, 4], s: 'U', color: C_ACC, dir: [1, 0.3] }]), [-0.5, 10.5, -1.5, 10.5], { label: 'Brunnen im Umkreismittelpunkt' })] },
    tasks: { gen: gen, plan: { G: ['abstand:1', 'reihenfolge:1', 'mittelpunkt:1', 'lage:1'], S: ['abstand:1', 'mittelpunkt:1', 'lage:1', 'aufMS:2', 'umkreisGitter:2'], E: ['aufMS:2', 'lage:1', 'rechtwinklig:2', 'umkreisGitter:2', 'reihenfolge:1', 'brunnen:3'] },
      extra: 'msGerade', test: ['abstand:1', 'mittelpunkt:1', 'lage:1', 'aufMS:2', 'umkreisGitter:2', 'brunnen:3'] },
    lerncheck: ['Ich erkläre, welche Punkte auf der Mittelsenkrechten liegen.', 'Ich konstruiere die Mittelsenkrechte und den Umkreis.', 'Ich weiß, wo der Umkreismittelpunkt liegt, je nach Dreiecksart.', 'Ich finde den Punkt, der von drei Orten gleich weit entfernt ist.']
  };
})();
