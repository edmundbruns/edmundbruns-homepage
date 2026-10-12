/* Modul 019 · Winkelhalbierende und Inkreis */
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
  function r1(x) { return Math.round(x * 10) / 10; }
  function pol(r, w) { return [r * Math.cos(w * D2R), r * Math.sin(w * D2R)]; }
  /* Fußpunkt der Winkelhalbierenden von V auf der Gegenseite PQ */
  function bisFoot(V, P, Q) { var p = dist(V, P), q = dist(V, Q); return [(q * P[0] + p * Q[0]) / (p + q), (q * P[1] + p * Q[1]) / (p + q)]; }
  function incItems(T, o) {
    o = o || {}; var I = incircle(T[0], T[1], T[2]), it = [];
    [0, 1, 2].forEach(function (i) { it.push({ t: 'seg', a: T[i], b: bisFoot(T[i], T[(i + 1) % 3], T[(i + 2) % 3]), color: C_HI, dash: '6 4', w: 1.6 }); });
    if (o.circle !== false) it.push({ t: 'circle', c: I.c, r: I.r, color: C_ACC, w: 2 });
    if (o.feet) [[T[1], T[2]], [T[0], T[2]], [T[0], T[1]]].forEach(function (s) { var F = foot(I.c, s[0], s[1]); it.push({ t: 'seg', a: I.c, b: F, color: C_ACC, w: 1.4 }); it.push({ t: 'angle', v: F, a: I.c, b: s[0], r: 10 }); });
    it.push({ t: 'pt', p: I.c, s: 'I', color: C_ACC, dir: o.idir || [0.8, -0.6] });
    return it;
  }
  var gen = {
    halbieren: function (lvl) {
      var a = lvl === 1 ? 2 * M.rnd(15, 80) : M.rnd(25, 170), h = a / 2, rot = M.rnd(0, 40) - 20;
      var S = [0, 0], P1 = pol(6, rot), P2 = pol(6, rot + a), W = pol(6.5, rot + h);
      return { skill: 'Winkel halbieren', level: lvl === 1 ? 1 : 2, q: 'Der Winkel bei S ist ' + a + '° groß. Die gestrichelte Halbgerade ist seine Winkelhalbierende. Wie groß ist jeder der beiden Teilwinkel?' +
        scene([{ t: 'seg', a: S, b: P1, w: 2.5 }, { t: 'seg', a: S, b: P2, w: 2.5 }, { t: 'seg', a: S, b: W, color: C_HI, dash: '7 4' }, { t: 'angle', v: S, a: P1, b: W, label: '?', r: 34 }, { t: 'angle', v: S, a: W, b: P2, r: 26, color: C_HI }, { t: 'pt', p: S, s: 'S', color: C_LINE, dir: [-Math.cos((rot + h) * D2R), -Math.sin((rot + h) * D2R)] }], { label: 'Winkel mit Winkelhalbierender', H: 230 }),
        inputs: [{ kind: 'num', label: 'Teilwinkel', unit: '°', answer: h }],
        hints: ['Die Winkelhalbierende teilt einen Winkel in zwei <b>gleich große</b> Teile.', 'Rechne ' + a + '° : 2.', a % 2 ? 'Das Ergebnis ist keine ganze Zahl. Schreibe es mit Komma, zum Beispiel 37,5.' : 'Kontrolle: Beide Teile zusammen müssen wieder ' + a + '° ergeben.'],
        solution: a + '° : 2 = ' + deg(h) + '. Kontrolle: ' + deg(h) + ' + ' + deg(h) + ' = ' + a + '°.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === 2 * a) return 'Du hast verdoppelt. Halbieren heißt: durch 2 teilen.'; if (x === 180 - a) return 'Das ist der Nebenwinkel. Gesucht ist die Hälfte des Winkels.'; if (x === Math.round(h) || x === Math.floor(h)) return 'Fast! Runde nicht. Die Hälfte von ' + a + '° ist eine Kommazahl.'; return null; },
        verify: function () { return Math.abs(angAt(S, P1, W) - h) < 1e-6 && Math.abs(angAt(S, W, P2) - h) < 1e-6 ? true : 'falsch'; } };
    },
    abstandWH: function () {
      var a = 2 * M.rnd(20, 50), d = M.rnd(2, 6), L = d / Math.sin(a / 2 * D2R), S = [0, 0], P = pol(L, a / 2), F1 = foot(P, S, pol(1, 0)), F2 = foot(P, S, pol(1, a)), len = Math.max(L * 1.35, 8);
      return { skill: 'Abstand auf der Winkelhalbierenden', level: 1, q: 'P liegt auf der Winkelhalbierenden des Winkels bei S. Der Abstand von P zum unteren Schenkel ist ' + cm(d) + '. Wie groß ist der Abstand von P zum oberen Schenkel?' +
        scene([{ t: 'seg', a: S, b: pol(len, 0), w: 2.5 }, { t: 'seg', a: S, b: pol(len, a), w: 2.5 }, { t: 'seg', a: S, b: pol(len * 1.05, a / 2), color: C_HI, dash: '7 4' }, { t: 'seg', a: P, b: F1, color: C_ACC }, { t: 'seg', a: P, b: F2, color: C_ACC }, { t: 'angle', v: F1, a: P, b: S, r: 12 }, { t: 'angle', v: F2, a: P, b: S, r: 12 }, { t: 'pt', p: S, s: 'S', color: C_LINE, dir: [-1, 0.3] }, { t: 'pt', p: P, s: 'P', dir: [1, -0.2] }, { t: 'side', a: P, b: F1, ref: S, s: cm(d), color: '#b45309' }, { t: 'side', a: P, b: F2, ref: S, s: '?', color: C_RED }], { label: 'Punkt auf der Winkelhalbierenden mit Abständen', H: 240, note: 'verkleinert' }),
        inputs: [{ kind: 'num', label: 'Abstand', unit: 'cm', answer: d }],
        hints: ['Der Abstand eines Punktes zu einer Geraden wird immer senkrecht gemessen.', 'Jeder Punkt auf der Winkelhalbierenden ist von <b>beiden Schenkeln gleich weit</b> entfernt.', 'Der Abstand zum oberen Schenkel ist also genauso groß wie der zum unteren.'],
        solution: 'P liegt auf der Winkelhalbierenden. Darum ist P von beiden Schenkeln gleich weit entfernt: ' + cm(d) + '.',
        verify: function () { return Math.abs(dist(P, F1) - d) < 1e-9 && Math.abs(dist(P, F2) - d) < 1e-9 ? true : 'falsch'; } };
    },
    gitterWH: function () {
      var sx = M.pick([-1, 1]), sy = M.pick([-1, 1]), x = sx * M.rnd(2, 6), y = sy * Math.abs(x), qn = sx > 0 ? (sy > 0 ? 'der positiven x-Achse und der positiven y-Achse' : 'der positiven x-Achse und der negativen y-Achse') : (sy > 0 ? 'der negativen x-Achse und der positiven y-Achse' : 'der negativen x-Achse und der negativen y-Achse');
      var W = [sx * 7, sy * 7];
      return { skill: 'Winkelhalbierende im Koordinatensystem', level: 2, q: 'Die Koordinatenachsen bilden einen rechten Winkel zwischen ' + qn + '. Der Punkt P(' + M.fmtNum(x) + ' | ?) liegt auf der Winkelhalbierenden dieses Winkels.<br>a) Wie heißt die y-Koordinate von P? b) Wie weit ist P von der x-Achse entfernt (in Kästchen)?' +
        scene([{ t: 'ray', a: [0, 0], b: W, color: C_HI, dash: '7 4' }, { t: 'angle', v: [0, 0], a: [sx * 3, 0], b: [0, sy * 3], r: 16 }, { t: 'line', a: [x, -9], b: [x, 9], color: C_ACC, dash: '3 3', w: 1.2 }], { bounds: [-7.5, 7.5, -7.5, 7.5], grid: true, gridStep: 2, W: 320, H: 320, pad: 12, label: 'Achsen mit Winkelhalbierender', maxw: 360 }),
        inputs: [{ kind: 'num', label: 'a) y =', answer: y }, { kind: 'num', label: 'b) Abstand', unit: 'Kästchen', answer: Math.abs(x) }],
        hints: ['Jeder Punkt auf der Winkelhalbierenden ist von beiden Schenkeln gleich weit entfernt. Die Schenkel sind hier die Achsen.', 'P ist ' + Math.abs(x) + ' Kästchen von der y-Achse entfernt. Also ist P auch ' + Math.abs(x) + ' Kästchen von der x-Achse entfernt.', 'Achte auf das Vorzeichen: Der Winkel liegt ' + (sy > 0 ? 'oberhalb' : 'unterhalb') + ' der x-Achse, also ist y ' + (sy > 0 ? 'positiv' : 'negativ') + '.'],
        solution: 'Abstand zur y-Achse: ' + Math.abs(x) + ' Kästchen. Auf der Winkelhalbierenden ist der Abstand zur x-Achse gleich groß. P liegt ' + (sy > 0 ? 'oberhalb' : 'unterhalb') + ' der x-Achse: P' + pt([x, y]) + '. Abstand zur x-Achse: ' + Math.abs(x) + ' Kästchen.',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === -y) return 'Der Betrag stimmt, aber achte auf das Vorzeichen von y.'; return null; },
        verify: function () { return Math.abs(Math.abs(y) - Math.abs(x)) < 1e-9 && Math.sign(y) === sy ? true : 'falsch'; } };
    },
    teilwinkel: function () {
      var h, a, b; do { h = M.rnd(20, 50); a = M.rnd(30, 90); b = 180 - a - 2 * h; } while (b < 25 || Math.abs(a - b) < 6);
      var T = triWW(a, b, 10), D = bisFoot(T[2], T[0], T[1]);
      return { skill: 'Teilwinkel im Dreieck', level: 2, q: 'Im Dreieck ABC halbiert die Strecke CD den Winkel γ. Es ist α = ' + a + '° und jeder Teilwinkel bei C ist ' + h + '° groß. Wie groß ist β?' +
        scene(triItems(T, { angles: [a + '°', '?', null] }).concat([{ t: 'seg', a: T[2], b: D, color: C_HI, dash: '7 4' }, { t: 'angle', v: T[2], a: T[0], b: D, label: h + '°', r: 30, lcolor: C_HI, color: C_HI }, { t: 'angle', v: T[2], a: D, b: T[1], label: h + '°', r: 24, lcolor: C_HI, color: C_HI }, { t: 'pt', p: D, s: 'D', color: C_HI, dir: [0, 1] }]), { label: 'Dreieck mit Winkelhalbierender von γ', H: 240 }),
        inputs: [{ kind: 'num', label: 'β =', unit: '°', answer: b }],
        hints: ['Die Winkelhalbierende teilt γ in zwei gleiche Teile. Also ist γ = 2 · ' + h + '°.', 'γ = ' + 2 * h + '°. Jetzt hilft die Winkelsumme im Dreieck: 180°.', 'β = 180° − ' + a + '° − ' + 2 * h + '°.'],
        solution: 'γ = 2 · ' + h + '° = ' + 2 * h + '°. β = 180° − ' + a + '° − ' + 2 * h + '° = ' + b + '°.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === 180 - a - h) return 'Du hast nur einen Teilwinkel abgezogen. γ besteht aus beiden Teilwinkeln: γ = 2 · ' + h + '°.'; return null; },
        verify: function () { return Math.abs(angAt(T[1], T[0], T[2]) - b) < 1e-6 && Math.abs(angAt(T[2], T[0], D) - h) < 1e-6 ? true : 'falsch'; } };
    },
    winkelAIB: function () {
      var a, b; do { a = 2 * M.rnd(15, 45); b = 2 * M.rnd(15, 45); } while (180 - a - b < 30);
      var T = triWW(a, b, 10), I = incircle(T[0], T[1], T[2]).c, x = 180 - a / 2 - b / 2;
      return { skill: 'Winkel am Inkreismittelpunkt', level: 3, q: 'Im Dreieck ABC ist α = ' + a + '° und β = ' + b + '°. Die Winkelhalbierenden von α und β schneiden sich im Inkreismittelpunkt I. Wie groß ist der Winkel ∢AIB?' +
        scene(triItems(T, { angles: [a + '°', b + '°', null] }).concat([{ t: 'seg', a: T[0], b: I, color: C_HI, w: 2 }, { t: 'seg', a: T[1], b: I, color: C_HI, w: 2 }, { t: 'angle', v: I, a: T[0], b: T[1], label: '?', r: 16, color: C_HI }, { t: 'pt', p: I, s: 'I', color: C_HI, dir: [0, -1] }]), { label: 'Dreieck mit Inkreismittelpunkt', H: 240 }),
        inputs: [{ kind: 'num', label: '∢AIB =', unit: '°', answer: x }],
        hints: ['Betrachte das kleine Dreieck ABI. Seine Winkel bei A und B sind die halben Winkel α und β.', 'Bei A: ' + a + '° : 2 = ' + a / 2 + '°. Bei B: ' + b + '° : 2 = ' + b / 2 + '°.', 'Im Dreieck ABI ist die Winkelsumme 180°: ∢AIB = 180° − ' + a / 2 + '° − ' + b / 2 + '°.'],
        solution: 'Im Dreieck ABI: ∢IAB = ' + a / 2 + '°, ∢ABI = ' + b / 2 + '°. Also ∢AIB = 180° − ' + a / 2 + '° − ' + b / 2 + '° = ' + x + '°.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === 180 - a - b) return 'Das ist γ im großen Dreieck. Gesucht ist der Winkel im kleinen Dreieck ABI mit den halben Winkeln.'; if (y === a / 2 + b / 2) return 'Das ist die Summe der beiden halben Winkel. Ziehe sie noch von 180° ab.'; return null; },
        verify: function () { return Math.abs(angAt(I, T[0], T[1]) - x) < 1e-6 ? true : 'Winkel AIB falsch'; } };
    },
    aussagen: function () {
      var T = [['Der Inkreismittelpunkt liegt immer im Inneren des Dreiecks.', 'Alle drei Winkelhalbierenden verlaufen im Inneren des Dreiecks.'], ['Der Inkreis berührt alle drei Seiten des Dreiecks.', 'Sein Mittelpunkt ist von allen drei Seiten gleich weit entfernt.'], ['Der Umkreis geht durch alle drei Ecken des Dreiecks.', 'Sein Mittelpunkt ist von allen drei Ecken gleich weit entfernt.'], ['Jeder Punkt auf einer Winkelhalbierenden ist von beiden Schenkeln gleich weit entfernt.', 'Das ist die Ortslinien-Eigenschaft der Winkelhalbierenden.'], ['Der Inkreismittelpunkt ist der Schnittpunkt der Winkelhalbierenden.', 'Er ist von allen drei Seiten gleich weit entfernt.']];
      var F = [['Der Inkreismittelpunkt ist der Schnittpunkt der Mittelsenkrechten.', 'Die Mittelsenkrechten schneiden sich im Umkreismittelpunkt. Der Inkreismittelpunkt ist der Schnittpunkt der Winkelhalbierenden.'], ['Der Inkreis geht durch alle drei Ecken.', 'Durch die Ecken geht der Umkreis. Der Inkreis berührt die Seiten.'], ['Bei einem stumpfwinkligen Dreieck liegt der Inkreismittelpunkt außerhalb.', 'Der Inkreismittelpunkt liegt immer innen. Außerhalb liegen kann nur der Umkreismittelpunkt.'], ['Inkreis und Umkreis haben immer denselben Mittelpunkt.', 'Das gilt nur beim gleichseitigen Dreieck.'], ['Die Winkelhalbierende eines Winkels von 80° teilt ihn in 30° und 50°.', 'Sie teilt ihn in zwei gleiche Teile: 40° und 40°.']];
      var askTrue = Math.random() < 0.5, ans = askTrue ? M.pick(T) : M.pick(F), opts = M.shuffle([ans].concat(M.shuffle(askTrue ? F : T).slice(0, 3)));
      return { skill: 'Inkreis und Umkreis unterscheiden', level: 2, q: 'Welche Aussage ist ' + (askTrue ? '<b>richtig</b>' : '<b>falsch</b>') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(function (o) { return o[0]; }), answer: opts.indexOf(ans) }],
        hints: ['Umkreis: durch die Ecken, Mittelpunkt aus den Mittelsenkrechten.', 'Inkreis: berührt die Seiten, Mittelpunkt aus den Winkelhalbierenden.', 'Genau eine Aussage ist ' + (askTrue ? 'richtig' : 'falsch') + '.'],
        solution: '„' + ans[0] + '“ ist ' + (askTrue ? 'richtig' : 'falsch') + '. ' + ans[1],
        verify: function () { return opts.filter(function (o) { return (T.indexOf(o) >= 0) === askTrue; }).length === 1 ? true : 'Aussagen'; } };
    },
    reihenfolge: function () {
      var t;
      if (Math.random() < 0.5) t = orderTask(['Zeichne einen Kreisbogen um den Scheitel S, der beide Schenkel schneidet. Die Schnittpunkte heißen P und Q.', 'Zeichne um P einen Kreisbogen (Radius etwa so groß wie SP).', 'Zeichne um Q einen Kreisbogen mit demselben Radius. Die beiden Bögen schneiden sich im Punkt R.', 'Zeichne die Halbgerade von S durch R. Das ist die Winkelhalbierende.'], [[0, 1, 2, 3], [0, 2, 1, 3]], 'Konstruktion ordnen', 'So konstruierst du die Winkelhalbierende eines Winkels mit dem Scheitel S. Die Schritte sind durcheinandergeraten:');
      else t = orderTask(['Konstruiere die Winkelhalbierende von α.', 'Konstruiere die Winkelhalbierende von β.', 'Markiere den Schnittpunkt der Winkelhalbierenden als I.', 'Zeichne die Senkrechte von I auf die Seite c. Ihr Fußpunkt heißt F.', 'Zeichne den Kreis um I mit dem Radius IF. Das ist der Inkreis.'], [[0, 1, 2, 3, 4], [1, 0, 2, 3, 4]], 'Konstruktion ordnen', 'So konstruierst du den Inkreis eines Dreiecks ABC. Die Schritte sind durcheinandergeraten:');
      t.level = 2; return t;
    },
    inUm: function () {
      var S = [['Ein runder Tisch soll in eine dreieckige Zimmerecke gestellt werden und dabei so groß wie möglich sein.', 1], ['Ein Spielplatz soll von drei Wohnhäusern gleich weit entfernt sein.', 0], ['Ein Rasensprenger soll alle drei Ecken eines dreieckigen Rasens gerade noch erreichen.', 0], ['Ein Brunnen soll von drei geraden Straßen, die ein Dreieck bilden, gleich weit entfernt sein.', 1], ['Aus einem dreieckigen Brett soll eine möglichst große runde Scheibe ausgesägt werden.', 1], ['Um drei Zeltpfosten soll ein Kreis gespannt werden, der durch alle drei Pfosten geht.', 0], ['In einem dreieckigen Beet soll ein möglichst großes rundes Blumenfeld angelegt werden.', 1], ['Ein Funkmast soll drei Dörfer gleich gut erreichen, also von allen gleich weit entfernt sein.', 0]];
      var c = M.pick(S), OPT = ['den Umkreismittelpunkt (Schnittpunkt der Mittelsenkrechten)', 'den Inkreismittelpunkt (Schnittpunkt der Winkelhalbierenden)'];
      return { skill: 'Umkreis oder Inkreis im Sachzusammenhang', level: 2, q: c[0] + '<br>Welchen Punkt brauchst du?', inputs: [{ kind: 'mc', label: 'Gesucht ist …', options: OPT, answer: c[1] }],
        hints: ['Frage dich: Geht es um gleiche Abstände zu <b>Punkten</b> (Ecken) oder zu <b>Linien</b> (Seiten)?', 'Gleich weit von Punkten: Mittelsenkrechte, Umkreis. Gleich weit von Seiten: Winkelhalbierende, Inkreis.', 'Der größte Kreis, der in ein Dreieck passt, ist der Inkreis. Er berührt alle Seiten.'],
        solution: c[1] ? 'Es geht um gleiche Abstände zu den <b>Seiten</b> bzw. den größten Kreis im Dreieck. Gesucht ist der <b>Inkreismittelpunkt</b>.' : 'Es geht um gleiche Abstände zu drei <b>Punkten</b>. Gesucht ist der <b>Umkreismittelpunkt</b>.' };
    },
    inkreisMessen: function () {
      var a, b, c, T, I; do { a = M.rnd(5, 10); b = M.rnd(5, 10); c = M.rnd(6, 11); T = triSSS(a, b, c); } while (!(a + b > c && a + c > b && b + c > a) || Math.min(angAt(T[0], T[1], T[2]), angAt(T[1], T[0], T[2]), angAt(T[2], T[0], T[1])) < 30);
      I = incircle(T[0], T[1], T[2]); var ans = r1(I.r);
      return { skill: 'Inkreis konstruieren und messen', level: 3, q: 'Konstruiere im Heft das Dreieck ABC mit a = ' + cm(a) + ', b = ' + cm(b) + ' und c = ' + cm(c) + '. Konstruiere dann den Inkreis und miss seinen Radius r.',
        inputs: [{ kind: 'num', label: 'r ≈', unit: 'cm', answer: ans, tol: 0.2 }],
        hints: ['Konstruiere zuerst das Dreieck nach SSS: c als Grundseite, Kreisbögen um A (Radius b) und um B (Radius a).', 'Konstruiere zwei Winkelhalbierende, zum Beispiel von α und β. Ihr Schnittpunkt ist I.', 'Der Radius ist der <b>senkrechte</b> Abstand von I zu einer Seite. Zeichne das Lot von I auf c und miss (± 2 mm sind erlaubt).'],
        solution: 'Der Inkreisradius ist etwa ' + cm(ans) + '.' + scene(triItems(T, { sides: ['a = ' + cm(a), 'b = ' + cm(b), 'c = ' + cm(c)] }).concat(incItems(T, { feet: true })), { label: 'Dreieck mit Inkreis', note: 'verkleinert', H: 250 }),
        verify: function () { var F = foot(I.c, T[0], T[1]), F2 = foot(I.c, T[1], T[2]); return Math.abs(dist(I.c, F) - I.r) < 1e-9 && Math.abs(dist(I.c, F2) - I.r) < 1e-9 ? true : 'r falsch'; } };
    },
    beet: function () {
      var tr = M.pick([[6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15], [12, 5, 13], [8, 15, 17]]), p = tr[0], q = tr[1], r = (p + q - tr[2]) / 2;
      var T = [[0, 0], [p, 0], [0, q]], I = incircle(T[0], T[1], T[2]);
      var OPT = ['der Schnittpunkt der Winkelhalbierenden', 'der Schnittpunkt der Mittelsenkrechten', 'der Mittelpunkt der längsten Seite', 'die Ecke mit dem rechten Winkel'];
      return { skill: 'Größter Kreis im Dreieck (Sachaufgabe)', level: 3, q: 'Ein Beet hat die Form eines rechtwinkligen Dreiecks. Die beiden Seiten am rechten Winkel sind ' + p + ' m und ' + q + ' m lang, die dritte Seite ist ' + tr[2] + ' m lang. Darin soll ein möglichst großes rundes Blumenfeld angelegt werden.<br>a) Wo liegt der Mittelpunkt des Blumenfelds? b) Konstruiere im Maßstab 1 cm ≙ 1 m und bestimme den Radius.' +
        scene([{ t: 'poly', p: T, fill: '#e6f4ea', color: C_GRN }, { t: 'angle', v: T[0], a: T[1], b: T[2], color: C_GRN }, { t: 'side', a: T[0], b: T[1], ref: T[2], s: p + ' m' }, { t: 'side', a: T[0], b: T[2], ref: T[1], s: q + ' m' }, { t: 'side', a: T[1], b: T[2], ref: T[0], s: tr[2] + ' m' }], { label: 'Dreieckiges Beet', note: 'Skizze', H: 220 }),
        inputs: [{ kind: 'mc', label: 'a) Mittelpunkt', options: OPT, answer: 0 }, { kind: 'num', label: 'b) Radius ≈', unit: 'm', answer: r, tol: 0.2 }],
        hints: ['Der größte Kreis im Dreieck berührt alle drei Seiten. Das ist der Inkreis.', 'Konstruiere das Dreieck (' + p + ' cm und ' + q + ' cm mit rechtem Winkel). Konstruiere zwei Winkelhalbierende; ihr Schnittpunkt ist der Mittelpunkt.', 'Miss den senkrechten Abstand vom Mittelpunkt zu einer Seite. Am rechten Winkel kannst du gut messen: der Mittelpunkt hat zu beiden kurzen Seiten denselben Abstand.'],
        solution: 'a) Der größte Kreis ist der Inkreis, sein Mittelpunkt ist der Schnittpunkt der Winkelhalbierenden. b) Gemessen r ≈ ' + M.fmtNum(r) + ' cm, also etwa <b>' + M.fmtNum(r) + ' m</b>.' + scene([{ t: 'poly', p: T, fill: '#e6f4ea', color: C_GRN }].concat(incItems(T, { feet: true })), { label: 'Beet mit Inkreis', H: 240, note: 'verkleinert' }),
        verify: function () { return Math.abs(I.r - r) < 1e-9 && Math.abs(dist(T[1], T[2]) - tr[2]) < 1e-9 ? true : 'r falsch'; } };
    }
  };
  /* Erklärungsfiguren */
  var eS = [0, 0], eA = pol(10, 10), eB = pol(10, 70), eP = pol(7.6, 40), eF1 = foot(eP, eS, eA), eF2 = foot(eP, eS, eB);
  var figWH = scene([{ t: 'seg', a: eS, b: eA, w: 2.5 }, { t: 'seg', a: eS, b: eB, w: 2.5 }, { t: 'arc', c: eS, r: 3, a1: 2, a2: 78, dash: '5 4' }, { t: 'arc', c: pol(3, 10), r: 3, a1: 45, a2: 95, dash: '5 4' }, { t: 'arc', c: pol(3, 70), r: 3, a1: -15, a2: 35, dash: '5 4' }, { t: 'seg', a: eS, b: pol(10.6, 40), color: C_HI, dash: '7 4' }, { t: 'seg', a: eP, b: eF1, color: C_ACC }, { t: 'seg', a: eP, b: eF2, color: C_ACC }, { t: 'angle', v: eF1, a: eP, b: eS, r: 11 }, { t: 'angle', v: eF2, a: eP, b: eS, r: 11 }, { t: 'tick', a: eP, b: eF1, n: 2, color: C_ACC }, { t: 'tick', a: eP, b: eF2, n: 2, color: C_ACC },
    { t: 'pt', p: eS, s: 'S', color: C_LINE, dir: [-1, 0.6] }, { t: 'pt', p: pol(3, 10), s: 'P', color: C_LINE, dir: [0.3, 1] }, { t: 'pt', p: pol(3, 70), s: 'Q', color: C_LINE, dir: [-1, -0.2] }, { t: 'pt', p: [3 * Math.cos(10 * D2R) + 3 * Math.cos(70 * D2R), 3 * Math.sin(10 * D2R) + 3 * Math.sin(70 * D2R)], s: 'R', color: C_HI, dir: [0.4, 1] }, { t: 'pt', p: eP, s: 'X', color: C_ACC, dir: [1, -0.4] }], { label: 'Konstruktion der Winkelhalbierenden', W: 340, H: 260 });
  var iT = [[0, 0], [8, 0], [2.6, 5]];
  var figIn = scene(triItems(iT).concat(incItems(iT, { feet: true, idir: [0.9, -0.5] })), { label: 'Inkreis eines Dreiecks', W: 340, H: 240 });
  return {
    id: '019', title: 'Winkelhalbierende und Inkreis', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Winkelsumme im Dreieck, Mittelsenkrechte und Umkreis',
    lead: 'Wie groß kann ein runder Tisch höchstens sein, der in eine dreieckige Ecke passt? Mit der Winkelhalbierenden findest du den größten Kreis in einem Dreieck, den Inkreis.',
    einstieg: { html: '<p>Familie Janssen hat ein dreieckiges Beet im Garten. In die Mitte soll ein rundes Blumenfeld, und zwar so groß wie möglich. Der Kreis darf aber nicht über die Ränder hinausragen.</p><p class="note">Wo muss der Mittelpunkt des Kreises liegen? Ist das derselbe Punkt wie der Umkreismittelpunkt aus dem letzten Modul?</p><p>Der gesuchte Kreis berührt alle drei Seiten. Sein Mittelpunkt ist also von allen <b>Seiten</b> gleich weit entfernt. Dafür brauchst du die <b>Winkelhalbierende</b>.</p>' },
    ziele: ['Ich konstruiere die Winkelhalbierende eines Winkels mit dem Zirkel.', 'Ich weiß, dass jeder Punkt der Winkelhalbierenden von beiden Schenkeln gleich weit entfernt ist.', 'Ich berechne halbe Winkel und Winkel an Winkelhalbierenden.', 'Ich konstruiere den Inkreismittelpunkt und den Inkreis eines Dreiecks.', 'Ich unterscheide Umkreis und Inkreis und wende sie bei Sachaufgaben an.'],
    fachwoerter: [['Winkelhalbierende', 'Die Halbgerade, die einen Winkel in zwei gleich große Teile teilt.'], ['Abstand Punkt zu Gerade', 'Die kürzeste Entfernung. Sie wird immer senkrecht zur Geraden gemessen.'], ['Inkreis', 'Der Kreis im Dreieck, der alle drei Seiten berührt.'], ['Inkreismittelpunkt I', 'Der Schnittpunkt der drei Winkelhalbierenden. Er ist von allen Seiten gleich weit entfernt.']],
    diagnose: [
      { q: 'Wie groß ist die Hälfte von 75°?', options: ['37,5°', '37°', '35,5°', 'Weiß ich noch nicht'], answer: 0, why: '75 : 2 = 37,5.', review: 'Dividieren mit Kommazahlen' },
      { q: 'Im Dreieck ist α = 50° und β = 60°. Wie groß ist γ?', options: ['70°', '110°', '80°', 'Weiß ich noch nicht'], answer: 0, why: '180° − 50° − 60° = 70°.', review: 'Winkelsumme im Dreieck (Modul 016)' },
      { q: 'Wie misst man den Abstand eines Punktes P zu einer Geraden g?', options: ['senkrecht von P zu g', 'schräg von P zu irgendeinem Punkt von g', 'parallel zu g', 'Weiß ich noch nicht'], answer: 0, why: 'Der kürzeste Weg zur Geraden ist das Lot, also senkrecht.', review: 'Abstand und Lot (Klasse 5/6)' },
      { q: 'Der Umkreismittelpunkt eines Dreiecks ist …', options: ['der Schnittpunkt der Mittelsenkrechten', 'der Mittelpunkt der längsten Seite', 'immer eine Ecke des Dreiecks', 'Weiß ich noch nicht'], answer: 0, why: 'Die Mittelsenkrechten schneiden sich im Umkreismittelpunkt.', review: 'Mittelsenkrechte und Umkreis (Modul 018)' }],
    erklaerung:
      '<h3>1. Die Winkelhalbierende</h3><p>Die <b>Winkelhalbierende</b> teilt einen Winkel in zwei gleich große Teile. Ein Winkel von 70° wird in 35° und 35° geteilt.</p><p>So konstruierst du sie mit dem Zirkel:</p><ol><li>Kreisbogen um den Scheitel S. Er schneidet die Schenkel in P und Q.</li><li>Kreisbögen mit gleichem Radius um P und um Q. Sie schneiden sich in R.</li><li>Die Halbgerade von S durch R ist die Winkelhalbierende.</li></ol>' + figWH +
      '<div class="merk"><b>Merke:</b> Jeder Punkt X auf der Winkelhalbierenden ist von <b>beiden Schenkeln gleich weit</b> entfernt. Die Winkelhalbierende ist die <b>Ortslinie</b> dieser Punkte. Den Abstand misst du immer <b>senkrecht</b> zum Schenkel.</div>' +
      '<h3>2. Der Inkreis</h3><p>Die drei Winkelhalbierenden eines Dreiecks schneiden sich in <b>einem</b> Punkt I. Er ist von allen drei Seiten gleich weit entfernt. Der Kreis um I, der die Seiten gerade berührt, ist der <b>Inkreis</b>.</p>' + figIn +
      '<div class="merk"><b>Merke:</b> Der Schnittpunkt der Winkelhalbierenden ist der <b>Inkreismittelpunkt I</b>. Er liegt immer im Inneren des Dreiecks. Den Radius findest du, indem du von I das Lot auf eine Seite fällst. Zum Konstruieren reichen zwei Winkelhalbierende.</div>' +
      '<h3>3. Umkreis oder Inkreis?</h3><table class="tab"><tr><th></th><th>Umkreis</th><th>Inkreis</th></tr><tr><th>Mittelpunkt</th><td>Schnittpunkt der Mittelsenkrechten</td><td>Schnittpunkt der Winkelhalbierenden</td></tr><tr><th>gleich weit von</th><td>den drei <b>Ecken</b></td><td>den drei <b>Seiten</b></td></tr><tr><th>Kreis</th><td>geht durch die Ecken</td><td>berührt die Seiten</td></tr><tr><th>Lage</th><td>innen, auf einer Seite oder außen</td><td>immer innen</td></tr></table>' +
      '<h3>4. Rechnen mit Winkelhalbierenden</h3><p>Halbiert eine Winkelhalbierende den Winkel γ = 80°, entstehen zwei Winkel von 40°. Mit der Winkelsumme 180° kannst du dann weitere Winkel berechnen, zum Beispiel in den kleinen Dreiecken, die die Winkelhalbierenden bilden.</p>',
    entdecken: {
      html: '<p>Verschiebe die Ecke C. Die drei Winkelhalbierenden schneiden sich immer in einem Punkt I. Der Kreis um I berührt alle drei Seiten.</p><div class="ctl"><label>C nach rechts: <b id="v_x"></b> <input type="range" id="r_x" min="-1" max="9" step="0.5" value="2.5"></label><label>C nach oben: <b id="v_y"></b> <input type="range" id="r_y" min="1" max="7" step="0.5" value="4.5"></label><label>Zum Vergleich: <select id="s_u"><option value="0">nur Inkreis</option><option value="1">Inkreis und Umkreis</option></select></label></div><div id="e_g"></div><p id="e_t" class="big-math"></p><p class="note">Kannst du I aus dem Dreieck herausschieben? Vergleiche mit dem Umkreismittelpunkt U.</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var x = +root.querySelector('#r_x').value, y = +root.querySelector('#r_y').value, T = [[0, 0], [8, 0], [x, y]], I = incircle(T[0], T[1], T[2]), showU = root.querySelector('#s_u').value === '1';
          root.querySelector('#v_x').textContent = M.fmtNum(x) + ' cm'; root.querySelector('#v_y').textContent = M.fmtNum(y) + ' cm';
          var it = triItems(T).concat(incItems(T, { feet: true }));
          if (showU) { var U = circum(T[0], T[1], T[2]), vis = U[0] > -1.8 && U[0] < 9.8 && U[1] > -1.8 && U[1] < 7.8; it.unshift({ t: 'circle', c: U, r: dist(U, T[0]), color: C_MUT, dash: '6 4', w: 1.5 }); if (vis) it.push({ t: 'pt', p: U, s: 'U', color: C_MUT, dir: [-0.8, 0.6] }); }
          root.querySelector('#e_g').innerHTML = scene(it, { bounds: [-2, 10, -2, 8], W: 380, H: 330, label: 'Dreieck mit Winkelhalbierenden und Inkreis', note: 'verkleinert' });
          root.querySelector('#e_t').textContent = 'Abstand von I zu allen drei Seiten: r ≈ ' + M.fmtNum(r1(I.r)) + ' cm';
        }
        function step() { draw(); n++; if (n >= 3) done('Gut beobachtet: I liegt immer im Inneren und ist von allen drei Seiten gleich weit entfernt. Der Umkreismittelpunkt U kann dagegen auch außerhalb liegen.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        root.querySelector('#s_u').addEventListener('change', step);
        draw();
      }
    },
    beispiel: { title: 'Winkel am Inkreismittelpunkt', q: 'Im Dreieck ABC ist α = 70° und β = 50°. Die Winkelhalbierenden von α und β schneiden sich in I. Berechne ∢AIB.',
      steps: ['Die Winkelhalbierende von α teilt 70° in zwei Teile: ∢IAB = 70° : 2 = 35°.', 'Die Winkelhalbierende von β teilt 50° in zwei Teile: ∢ABI = 50° : 2 = 25°.', 'Im kleinen Dreieck ABI gilt die Winkelsumme: ∢AIB = 180° − 35° − 25°.', 'Ergebnis: <b>∢AIB = 120°</b>.', 'Kontrolle in der Zeichnung:' + scene(triItems(triWW(70, 50, 10), { angles: ['70°', '50°', null] }).concat((function () { var T = triWW(70, 50, 10), I = incircle(T[0], T[1], T[2]).c; return [{ t: 'seg', a: T[0], b: I, color: C_HI }, { t: 'seg', a: T[1], b: I, color: C_HI }, { t: 'angle', v: I, a: T[0], b: T[1], label: '120°', r: 16, color: C_HI }, { t: 'pt', p: I, s: 'I', color: C_HI, dir: [0, -1] }]; })()), { label: 'Dreieck mit Winkel AIB', H: 240 })] },
    tasks: { gen: gen, plan: { G: ['halbieren:1', 'abstandWH:1', 'reihenfolge:2', 'inUm:2'], S: ['halbieren:1', 'abstandWH:1', 'teilwinkel:2', 'inUm:2', 'aussagen:2'], E: ['halbieren:2', 'gitterWH:2', 'teilwinkel:2', 'aussagen:2', 'winkelAIB:3', 'inkreisMessen:3'] },
      extra: 'beet', test: ['halbieren:2', 'abstandWH:1', 'teilwinkel:2', 'inUm:2', 'aussagen:2', 'winkelAIB:3'] },
    lerncheck: ['Ich konstruiere die Winkelhalbierende eines Winkels.', 'Ich weiß, welche Punkte auf der Winkelhalbierenden liegen.', 'Ich konstruiere den Inkreis eines Dreiecks.', 'Ich entscheide, ob ich bei einer Aufgabe den Umkreis oder den Inkreis brauche.']
  };
})();
