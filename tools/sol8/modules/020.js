/* Modul 020 · Satz des Thales */
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
  function d2(p, q) { return (p[0] - q[0]) * (p[0] - q[0]) + (p[1] - q[1]) * (p[1] - q[1]); }
  /* Thaleskreis über AB (Radius r, Mittelpunkt M im Ursprung), C unter dem Winkel t (in Grad) auf dem Kreis */
  function thales(alpha, o) {
    o = o || {}; var r = 5, A = [-r, 0], B = [r, 0], Mm = [0, 0], t = 2 * alpha, C = [r * Math.cos(t * D2R), r * Math.sin(t * D2R)];
    var it = [{ t: 'arc', c: Mm, r: r, a1: 0, a2: 180, color: C_HI, dash: o.dash || '7 4', w: 1.8 }].concat(triItems([A, B, C], { angles: o.angles || [null, null, null], names: o.names }));
    if (o.mc) it.push({ t: 'seg', a: Mm, b: C, color: C_HI, w: 2 });
    if (o.mAngles) o.mAngles.forEach(function (x) { it.push(x(A, B, C, Mm)); });
    it.push({ t: 'pt', p: Mm, s: 'M', color: C_HI, dir: [0, 1] });
    return scene(it, { label: o.label || 'Thaleskreis mit Dreieck', H: 230, bounds: [-5.8, 5.8, -0.9, 5.6] });
  }
  var OPTL = ['kleiner als 90° (spitz)', 'genau 90° (rechter Winkel)', 'größer als 90° (stumpf)'];
  var gen = {
    thalesWinkel: function () {
      var a = M.rnd(20, 70), b = 90 - a, giveA = Math.random() < 0.5;
      return { skill: 'Winkel im Thaleskreis', level: 1, q: 'AB ist ein Durchmesser des Kreises, C liegt auf dem Kreis. Es ist ' + (giveA ? 'α = ' + a : 'β = ' + b) + '°. Wie groß ist ' + (giveA ? 'β' : 'α') + '?' + thales(a, { angles: giveA ? [a + '°', '?', null] : ['?', b + '°', null] }),
        inputs: [{ kind: 'num', label: (giveA ? 'β' : 'α') + ' =', unit: '°', answer: giveA ? b : a }],
        hints: ['C liegt auf dem Halbkreis über AB. Was sagt der Satz des Thales über den Winkel bei C?', 'γ = 90°. Die Winkelsumme im Dreieck ist 180°.', 'Für α und β bleiben zusammen 90°: ' + (giveA ? 'β = 90° − ' + a + '°' : 'α = 90° − ' + b + '°') + '.'],
        solution: 'Nach dem Satz des Thales ist γ = 90°. Also ' + (giveA ? 'β = 180° − 90° − ' + a + '° = ' + b + '°' : 'α = 180° − 90° − ' + b + '° = ' + a + '°') + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]), g = giveA ? a : b; if (x === 180 - g) return 'Du hast den Winkel bei C vergessen. Nach dem Satz des Thales ist er 90° groß.'; if (x === g) return 'α und β sind hier nicht gleich groß. Nutze γ = 90° und die Winkelsumme.'; return null; },
        verify: function () { var r = 5, t = 2 * a, C = [r * Math.cos(t * D2R), r * Math.sin(t * D2R)]; return Math.abs(angAt([-5, 0], [5, 0], C) - a) < 1e-6 && Math.abs(angAt(C, [-5, 0], [5, 0]) - 90) < 1e-6 ? true : 'falsch'; } };
    },
    erkennen: function () {
      var L = M.pick([['P', 'Q', 'R'], ['D', 'E', 'F'], ['K', 'L', 'N'], ['R', 'S', 'T'], ['X', 'Y', 'Z']]), a = M.rnd(25, 65), order = M.shuffle([0, 1, 2]);
      var dia = [L[order[0]], L[order[1]]], top = L[order[2]];
      var OPT = L.map(function (n) { return 'der Winkel bei ' + n; });
      return { skill: 'Rechten Winkel erkennen', level: 1, q: 'Die Strecke ' + dia[0] + dia[1] + ' ist ein Durchmesser des Kreises. Der Punkt ' + top + ' liegt auf dem Kreis. Welcher Winkel im Dreieck ' + L.join('') + ' ist ein rechter Winkel?' + thales(a, { names: [dia[0], dia[1], top], label: 'Kreis mit Durchmesser und Dreieck' }),
        inputs: [{ kind: 'mc', label: 'Rechter Winkel', options: OPT, answer: order[2] }],
        hints: ['Der Satz des Thales: Liegt ein Punkt auf dem Halbkreis über einem Durchmesser, dann ist der Winkel <b>an diesem Punkt</b> ein rechter Winkel.', 'Die Endpunkte des Durchmessers sind ' + dia[0] + ' und ' + dia[1] + '.', 'Der rechte Winkel liegt beim dritten Punkt, der auf dem Kreis liegt.'],
        solution: 'Der rechte Winkel liegt bei ' + top + ', dem Punkt auf dem Kreis. Er liegt dem Durchmesser ' + dia[0] + dia[1] + ' gegenüber.',
        mistakes: function (v) { if (+v[0] !== order[2]) return 'Der rechte Winkel liegt nie an einem Endpunkt des Durchmessers, sondern an dem Punkt auf dem Kreisbogen.'; return null; } };
    },
    innenAussen: function () {
      var tp = M.rnd(0, 2), fac = [M.pick([1.25, 1.35, 1.45]), 1, M.pick([0.55, 0.65, 0.75])][tp], t = M.rnd(50, 130), C = [5 * fac * Math.cos(t * D2R), 5 * fac * Math.sin(t * D2R)], A = [-5, 0], B = [5, 0];
      var where = ['außerhalb des Thaleskreises', 'auf dem Thaleskreis', 'innerhalb des Thaleskreises'][tp];
      return { skill: 'Lage zum Thaleskreis', level: 1, q: 'Der Punkt C liegt ' + where + ' über AB. Wie groß ist der Winkel γ bei C?' + scene([{ t: 'arc', c: [0, 0], r: 5, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.8 }].concat(triItems([A, B, C], { angles: [null, null, 'γ'] }), [{ t: 'pt', p: [0, 0], s: 'M', color: C_HI, dir: [0, 1] }]), { label: 'Punkt C und Thaleskreis', H: 240, bounds: [-6, 6, -0.9, 7.6] }),
        inputs: [{ kind: 'mc', label: 'γ ist …', options: OPTL, answer: [0, 1, 2][tp] }],
        hints: ['Auf dem Thaleskreis ist γ genau 90°.', 'Schiebst du C nach außen (weiter weg von AB), wird der Winkel kleiner. Schiebst du C nach innen, wird er größer.', 'innerhalb: stumpf. auf dem Kreis: 90°. außerhalb: spitz.'],
        solution: 'C liegt ' + where + '. Darum ist γ ' + OPTL[tp] + '. Gemessen: γ ≈ ' + Math.round(angAt(C, A, B)) + '°.',
        verify: function () { var g = angAt(C, A, B); return (tp === 0 && g < 89) || (tp === 1 && Math.abs(g - 90) < 1e-6) || (tp === 2 && g > 91) ? true : 'Lage falsch'; } };
    },
    gitterPunkt: function () {
      for (var t = 0; t < 500; t++) {
        var Mm = [M.rnd(5, 6), M.rnd(1, 3)], A = [Mm[0] - 5, Mm[1]], B = [Mm[0] + 5, Mm[1]], on = M.pick([[3, 4], [-3, 4], [4, 3], [-4, 3], [0, 5]]), P0 = [Mm[0] + on[0], Mm[1] + on[1]];
        var pts = [P0], kinds = [1], tries = 0;
        while (pts.length < 4 && tries++ < 300) { var q = [M.rnd(1, 10), M.rnd(Mm[1] + 1, Mm[1] + 8)], dd = d2(q, Mm); if (Math.abs(dd - 25) < 5 || q[1] > 11 || pts.some(function (p) { return dist(p, q) < 2; })) continue; var k = dd < 25 ? 2 : 0; if (kinds.filter(function (x) { return x === k; }).length >= 2) continue; pts.push(q); kinds.push(k); }
        if (pts.length < 4 || kinds.indexOf(0) < 0 || kinds.indexOf(2) < 0) continue;
        var ask = M.pick([1, 1, 2, 0]), cnt = kinds.filter(function (k) { return k === ask; }).length; if (cnt !== 1) continue;
        var names = ['P', 'Q', 'R', 'S'], order = M.shuffle([0, 1, 2, 3]), P = order.map(function (i) { return pts[i]; }), K = order.map(function (i) { return kinds[i]; }), idx = K.indexOf(ask);
        var it = [{ t: 'arc', c: Mm, r: 5, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.6 }, { t: 'seg', a: A, b: B, w: 2.5 }, { t: 'pt', p: A, s: 'A', color: C_LINE, dir: [-1, 0.6] }, { t: 'pt', p: B, s: 'B', color: C_LINE, dir: [1, 0.6] }, { t: 'pt', p: Mm, s: 'M', color: C_HI, dir: [0, 1] }].concat(P.map(function (p, i) { return { t: 'pt', p: p, s: names[i], color: C_ACC, lcolor: '#b45309' }; }));
        var qtxt = ['spitz', 'ein rechter Winkel', 'stumpf'][ask];
        return { skill: 'Thaleskreis im Gitter', level: 2, q: 'Der Halbkreis um M hat den Durchmesser AB. Bei welchem Punkt X ist der Winkel ∢AXB <b>' + qtxt + '</b>?' + scene(it, { bounds: [-0.5, 11.5, -0.5, 11.5], grid: true, gridStep: 2, W: 330, H: 330, pad: 12, label: 'Thaleskreis im Koordinatensystem', maxw: 370 }),
          inputs: [{ kind: 'mc', label: 'Punkt', options: names.map(function (n, i) { return n + pt(P[i]); }), answer: idx }],
          hints: ['Punkte <b>auf</b> dem Thaleskreis sehen AB unter einem rechten Winkel.', 'Punkte <b>innerhalb</b> des Kreises sehen AB unter einem stumpfen Winkel, Punkte <b>außerhalb</b> unter einem spitzen Winkel.', 'Gesucht ist ein Punkt ' + ['außerhalb des Kreises', 'genau auf dem Kreis', 'innerhalb des Kreises'][ask] + '.'],
          solution: names[idx] + pt(P[idx]) + ' liegt ' + ['außerhalb des Kreises', 'auf dem Kreis', 'innerhalb des Kreises'][ask] + '. Dort ist ∢A' + names[idx] + 'B ≈ ' + Math.round(angAt(P[idx], A, B)) + '°.',
          verify: function () { var g = P.map(function (p) { return angAt(p, A, B); }); var cls = g.map(function (x) { return Math.abs(x - 90) < 1e-6 ? 1 : x > 90 ? 2 : 0; }); return cls.filter(function (c) { return c === ask; }).length === 1 && cls[idx] === ask ? true : 'Klassen falsch'; } };
      }
    },
    mittelpunktDreieck: function () {
      var a = M.rnd(20, 70), ask = M.pick(['AMC', 'ACM', 'BMC']), ans = ask === 'AMC' ? 180 - 2 * a : ask === 'ACM' ? a : 2 * a;
      return { skill: 'Winkel mit dem Mittelpunkt M', level: 2, q: 'AB ist Durchmesser, M der Mittelpunkt, C liegt auf dem Kreis. Es ist α = ' + a + '°. Wie groß ist der Winkel ∢' + ask + '?' + thales(a, { angles: [a + '°', null, null], mc: true, mAngles: [function (A, B, C, Mm) { return ask === 'ACM' ? { t: 'angle', v: C, a: A, b: Mm, label: '?', color: C_HI, r: 24 } : ask === 'AMC' ? { t: 'angle', v: Mm, a: C, b: A, label: '?', color: C_HI, r: 20 } : { t: 'angle', v: Mm, a: B, b: C, label: '?', color: C_HI, r: 20 }; }] }),
        inputs: [{ kind: 'num', label: '∢' + ask + ' =', unit: '°', answer: ans }],
        hints: ['MA und MC sind beide Radien. Das Dreieck AMC ist also gleichschenklig.', 'Im gleichschenkligen Dreieck AMC sind die Basiswinkel gleich: ∢ACM = α = ' + a + '°.', ask === 'ACM' ? 'Damit hast du die Antwort schon.' : ask === 'AMC' ? '∢AMC = 180° − ' + a + '° − ' + a + '°.' : 'Berechne zuerst ∢AMC = 180° − 2 · ' + a + '°. ∢BMC ist sein Nebenwinkel: 180° − ∢AMC.'],
        solution: 'Dreieck AMC ist gleichschenklig (MA = MC = r), also ∢ACM = α = ' + a + '°. ∢AMC = 180° − 2 · ' + a + '° = ' + (180 - 2 * a) + '°.' + (ask === 'BMC' ? ' ∢BMC = 180° − ' + (180 - 2 * a) + '° = ' + 2 * a + '°.' : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (ask === 'AMC' && x === 180 - a) return 'Im Dreieck AMC gibt es zwei gleich große Basiswinkel von ' + a + '°. Ziehe beide ab.'; if (ask === 'ACM' && x === 90 - a) return 'Das ist der Winkel zwischen CM und CB. Gesucht ist der Winkel zwischen CA und CM. Er ist ein Basiswinkel im gleichschenkligen Dreieck AMC.'; if (ask === 'BMC' && x === 180 - 2 * a) return 'Das ist ∢AMC. Gesucht ist der Nebenwinkel ∢BMC.'; return null; },
        verify: function () { var t = 2 * a, C = [5 * Math.cos(t * D2R), 5 * Math.sin(t * D2R)], Mm = [0, 0], g = ask === 'AMC' ? angAt(Mm, [-5, 0], C) : ask === 'ACM' ? angAt(C, [-5, 0], Mm) : angAt(Mm, [5, 0], C); return Math.abs(g - ans) < 1e-6 ? true : 'falsch'; } };
    },
    umkehrung: function () {
      var c = 2 * M.rnd(3, 9) + (Math.random() < 0.3 ? 1 : 0), OPT = ['in der Mitte der Seite AB', 'im Punkt C', 'im Inneren des Dreiecks, nicht auf einer Seite', 'außerhalb des Dreiecks'];
      return { skill: 'Umkehrung des Satzes von Thales', level: 2, q: 'Das Dreieck ABC hat bei C einen rechten Winkel. Die Seite AB ist ' + cm(c) + ' lang.<br>a) Wo liegt der Mittelpunkt des Umkreises? b) Wie groß ist der Radius des Umkreises?',
        inputs: [{ kind: 'mc', label: 'a) Mittelpunkt', options: OPT, answer: 0 }, { kind: 'num', label: 'b) r =', unit: 'cm', answer: c / 2 }],
        hints: ['Umkehrung des Satzes von Thales: Hat ein Dreieck bei C einen rechten Winkel, dann liegt C auf dem Thaleskreis über AB.', 'Der Thaleskreis ist der Umkreis. Sein Mittelpunkt ist die Mitte von AB.', 'Der Radius ist die halbe Länge von AB: ' + M.fmtNum(c) + ' cm : 2.'],
        solution: 'a) C liegt auf dem Thaleskreis über AB. Dieser Kreis ist der Umkreis, sein Mittelpunkt ist die <b>Mitte von AB</b>. b) r = ' + M.fmtNum(c) + ' cm : 2 = ' + cm(c / 2) + '.',
        mistakes: function (v) { var x = M.parseNum(v[1]); if (x === c) return 'Das ist der Durchmesser. Der Radius ist halb so groß.'; return null; } };
    },
    reihenfolge: function () {
      var c = M.rnd(6, 10), b = M.rnd(3, c - 2);
      var t = orderTask(['Zeichne die Strecke AB mit c = ' + cm(c) + '.', 'Bestimme den Mittelpunkt M von AB (zum Beispiel mit der Mittelsenkrechten).', 'Zeichne den Halbkreis um M mit dem Radius ' + cm(c / 2) + ' (Thaleskreis).', 'Zeichne um A einen Kreisbogen mit dem Radius b = ' + cm(b) + '. Er schneidet den Thaleskreis in C.', 'Verbinde C mit A und B. Bei C ist ein rechter Winkel.'], [[0, 1, 2, 3, 4], [0, 3, 1, 2, 4], [0, 1, 3, 2, 4]], 'Rechtwinkliges Dreieck konstruieren', 'Konstruiere ein Dreieck ABC mit γ = 90°, c = ' + cm(c) + ' und b = ' + cm(b) + '. Die Schritte sind durcheinandergeraten:');
      t.level = 2; return t;
    },
    konstruierenMessen: function () {
      var c = M.rnd(6, 10), b, a; do { b = M.rnd(3, c - 1); a = Math.sqrt(c * c - b * b); } while (a < 2.5 || Math.abs(a - b) < 0.5);
      var al = Math.acos(b / c) / D2R, ans = r1(a), aw = Math.round(al), T = [[0, 0], [c, 0], [b * Math.cos(al * D2R), b * Math.sin(al * D2R)]];
      return { skill: 'Mit dem Thaleskreis konstruieren', level: 3, q: 'Konstruiere im Heft ein rechtwinkliges Dreieck ABC mit γ = 90°, c = ' + cm(c) + ' und b = ' + cm(b) + '. Benutze den Thaleskreis. Miss danach die Seite a und den Winkel α.',
        inputs: [{ kind: 'num', label: 'a ≈', unit: 'cm', answer: ans, tol: 0.2 }, { kind: 'num', label: 'α ≈', unit: '°', answer: aw, tol: 2 }],
        hints: ['γ = 90° heißt: C liegt auf dem Thaleskreis über AB.', 'Zeichne AB = ' + cm(c) + ', halbiere AB und zeichne den Halbkreis mit Radius ' + cm(c / 2) + '.', 'Zeichne um A einen Kreisbogen mit Radius ' + cm(b) + '. Der Schnittpunkt mit dem Halbkreis ist C. Miss dann a und α (± 2 mm, ± 2°).'],
        solution: 'Gemessen: a ≈ ' + cm(ans) + ' und α ≈ ' + aw + '°. Kontrolle: β ≈ ' + (90 - aw) + '°, und α + β = 90°.' + scene([{ t: 'arc', c: [c / 2, 0], r: c / 2, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.6 }, { t: 'arc', c: [0, 0], r: b, a1: al - 15, a2: al + 15, dash: '5 4' }].concat(triItems(T, { sides: ['a ≈ ' + cm(ans), 'b = ' + cm(b), 'c = ' + cm(c)], angles: ['≈ ' + aw + '°', null, null] }), [{ t: 'pt', p: [c / 2, 0], s: 'M', color: C_HI, dir: [0, 1] }]), { label: 'Konstruktion mit dem Thaleskreis', note: 'verkleinert', H: 230 }),
        verify: function () { return Math.abs(angAt(T[2], T[0], T[1]) - 90) < 1e-6 && Math.abs(dist(T[1], T[2]) - a) < 1e-9 ? true : 'falsch'; } };
    },
    mittelpunktswinkel: function () {
      var x = 2 * M.rnd(15, 75), a = x / 2, b = 90 - a;
      return { skill: 'Thales und Mittelpunktswinkel', level: 3, q: 'AB ist Durchmesser des Kreises mit Mittelpunkt M. C liegt auf dem Kreis. Der Winkel ∢BMC ist ' + x + '° groß. Berechne α und β.' + thales(a, { mc: true, mAngles: [function (A, B, C, Mm) { return { t: 'angle', v: Mm, a: B, b: C, label: x + '°', color: C_HI, r: 20, lcolor: C_HI }; }], angles: ['α', 'β', null] }),
        inputs: [{ kind: 'num', label: 'α =', unit: '°', answer: a }, { kind: 'num', label: 'β =', unit: '°', answer: b }],
        hints: ['∢AMC ist der Nebenwinkel von ∢BMC: ∢AMC = 180° − ' + x + '° = ' + (180 - x) + '°.', 'Das Dreieck AMC ist gleichschenklig (MA = MC). Seine Basiswinkel sind α und ∢ACM: zusammen 180° − ' + (180 - x) + '° = ' + x + '°.', 'Also α = ' + x + '° : 2. Nach dem Satz des Thales ist γ = 90°, also β = 90° − α.'],
        solution: '∢AMC = 180° − ' + x + '° = ' + (180 - x) + '°. Im gleichschenkligen Dreieck AMC: α = (180° − ' + (180 - x) + '°) : 2 = ' + a + '°. Thales: γ = 90°, also β = 90° − ' + a + '° = ' + b + '°.',
        mistakes: function (v) { var p = M.parseNum(v[0]); if (p === x) return 'α ist nicht so groß wie ∢BMC. Der Winkel am Mittelpunkt ist doppelt so groß wie α.'; if (p === 180 - x) return 'Das ist ∢AMC. α ist ein Basiswinkel im gleichschenkligen Dreieck AMC.'; return null; },
        verify: function () { var t = 2 * a, C = [5 * Math.cos(t * D2R), 5 * Math.sin(t * D2R)]; return Math.abs(angAt([0, 0], [5, 0], C) - x) < 1e-6 && Math.abs(angAt([5, 0], [-5, 0], C) - b) < 1e-6 ? true : 'falsch'; } };
    }
  };
  /* Erklärungsfigur: Begründung mit zwei gleichschenkligen Dreiecken */
  var bA = [-5, 0], bB = [5, 0], bC = [5 * Math.cos(115 * D2R), 5 * Math.sin(115 * D2R)];
  var figBeweis = scene([{ t: 'arc', c: [0, 0], r: 5, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.6 }, { t: 'poly', p: [bA, bB, bC] }, { t: 'seg', a: [0, 0], b: bC, color: C_HI, w: 2 }, { t: 'angle', v: bA, a: bB, b: bC, label: 'α', color: C_ACC }, { t: 'angle', v: bC, a: bA, b: [0, 0], label: 'α', color: C_ACC, r: 30 }, { t: 'angle', v: bB, a: bA, b: bC, label: 'β', color: C_GRN, lcolor: C_GRN }, { t: 'angle', v: bC, a: [0, 0], b: bB, label: 'β', color: C_GRN, lcolor: C_GRN, r: 24 }, { t: 'tick', a: [0, 0], b: bA }, { t: 'tick', a: [0, 0], b: bB }, { t: 'tick', a: [0, 0], b: bC }, { t: 'pt', p: bA, s: 'A', color: C_LINE, dir: [-1, 0.5] }, { t: 'pt', p: bB, s: 'B', color: C_LINE, dir: [1, 0.5] }, { t: 'pt', p: bC, s: 'C', color: C_LINE, dir: [-0.3, -1] }, { t: 'pt', p: [0, 0], s: 'M', color: C_HI, dir: [0, 1] }], { label: 'Begründung des Satzes von Thales', H: 240, bounds: [-5.8, 5.8, -0.9, 5.6] });
  var figIO = (function () { var A = [-5, 0], B = [5, 0], P1 = [-2.6, 6.2], P2 = [3, 4], P3 = [-0.8, 2.6]; return scene([{ t: 'arc', c: [0, 0], r: 5, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.6 }, { t: 'seg', a: A, b: B, w: 2.5 }].concat([[P1, 'außen: spitz'], [P2, 'auf dem Kreis: 90°'], [P3, 'innen: stumpf']].map(function (x, i) { var col = [C_GRN, C_ACC, C_RED][i]; return [{ t: 'seg', a: A, b: x[0], color: col, w: 1.5 }, { t: 'seg', a: B, b: x[0], color: col, w: 1.5 }, { t: 'angle', v: x[0], a: A, b: B, color: col, r: 14 }, { t: 'pt', p: x[0], s: x[1], color: col, dir: [1, -0.5] }]; }).reduce(function (s, x) { return s.concat(x); }, []), [{ t: 'pt', p: A, s: 'A', color: C_LINE, dir: [-1, 0.5] }, { t: 'pt', p: B, s: 'B', color: C_LINE, dir: [1, 0.5] }]), { label: 'Winkel innerhalb, auf und außerhalb des Thaleskreises', H: 300, W: 400, bounds: [-6, 7.5, -0.9, 7], maxw: 460 }); })();
  return {
    id: '020', title: 'Satz des Thales', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Winkelsumme, gleichschenklige Dreiecke, Umkreis',
    lead: 'Ein Punkt wandert auf einem Halbkreis, und der Winkel bleibt immer genau 90°. Du entdeckst den Satz des Thales, begründest ihn und nutzt ihn für Berechnungen und Konstruktionen.',
    einstieg: { html: '<p>Vor über 2500 Jahren lebte in Griechenland der Gelehrte <b>Thales von Milet</b>. Ihm wird eine erstaunliche Entdeckung zugeschrieben: Zeichnest du einen Halbkreis und verbindest einen beliebigen Punkt auf dem Bogen mit den beiden Enden des Durchmessers, entsteht immer ein rechter Winkel.</p><p class="note">Probiere es aus: Zeichne einen Halbkreis, wähle drei verschiedene Punkte auf dem Bogen und miss jeweils den Winkel. Was fällt dir auf?</p><p>Mit dem Satz des Thales kannst du ohne Geodreieck rechte Winkel konstruieren und Winkel im Kreis berechnen.</p>' },
    ziele: ['Ich kenne den Satz des Thales und kann ihn begründen.', 'Ich berechne Winkel in Dreiecken im Thaleskreis.', 'Ich nutze die gleichschenkligen Dreiecke mit dem Mittelpunkt M für Berechnungen.', 'Ich kenne die Umkehrung des Satzes und weiß, was innerhalb und außerhalb des Kreises passiert.', 'Ich konstruiere rechtwinklige Dreiecke mit dem Thaleskreis.'],
    fachwoerter: [['Durchmesser', 'Eine Strecke durch den Mittelpunkt, die zwei Punkte des Kreises verbindet. Sie ist doppelt so lang wie der Radius.'], ['Thaleskreis', 'Der Kreis (oder Halbkreis) über einer Strecke AB, deren Mitte der Kreismittelpunkt ist.'], ['Satz des Thales', 'Liegt C auf dem Halbkreis über AB, so ist der Winkel bei C ein rechter Winkel.'], ['Umkehrung', 'Der Satz „rückwärts“: Hat ein Dreieck bei C einen rechten Winkel, so liegt C auf dem Thaleskreis über AB.']],
    diagnose: [
      { q: 'Im Dreieck ist γ = 90° und α = 35°. Wie groß ist β?', options: ['55°', '65°', '145°', 'Weiß ich noch nicht'], answer: 0, why: '180° − 90° − 35° = 55°.', review: 'Winkelsumme im Dreieck (Modul 016)' },
      { q: 'In einem gleichschenkligen Dreieck ist ein Basiswinkel 40°. Wie groß ist der andere Basiswinkel?', options: ['40°', '100°', '50°', 'Weiß ich noch nicht'], answer: 0, why: 'Die Basiswinkel im gleichschenkligen Dreieck sind gleich groß.', review: 'Gleichschenklige Dreiecke (Modul 015)' },
      { q: 'Ein Kreis hat den Durchmesser 10 cm. Wie groß ist sein Radius?', options: ['5 cm', '20 cm', '10 cm', 'Weiß ich noch nicht'], answer: 0, why: 'Der Radius ist der halbe Durchmesser.', review: 'Kreis (Klasse 5/6)' },
      { q: 'Zwei Nebenwinkel ergeben zusammen …', options: ['180°', '90°', '360°', 'Weiß ich noch nicht'], answer: 0, why: 'Nebenwinkel bilden zusammen einen gestreckten Winkel.', review: 'Nebenwinkel (Klasse 7)' }],
    erklaerung:
      '<h3>1. Der Satz des Thales</h3><div class="merk"><b>Merke (Satz des Thales):</b> Liegt der Punkt C auf dem Halbkreis über der Strecke AB, dann hat das Dreieck ABC bei C einen <b>rechten Winkel</b>: γ = 90°.</div>' +
      '<h3>2. Warum gilt das?</h3><p>Verbinde den Mittelpunkt M mit C. MA, MB und MC sind Radien und damit gleich lang. So entstehen zwei <b>gleichschenklige Dreiecke</b> AMC und MBC. In ihnen sind die Basiswinkel gleich: Bei A und C liegt jeweils α, bei B und C jeweils β.</p>' + figBeweis +
      '<p>Im großen Dreieck ABC ist die Winkelsumme 180°: <span class="big-math">α + β + (α + β) = 180°</span> Also ist 2 · (α + β) = 180° und damit α + β = 90°. Der Winkel bei C ist genau α + β = <b>90°</b>.</p>' +
      '<h3>3. Die Umkehrung</h3><div class="merk"><b>Merke (Umkehrung):</b> Hat ein Dreieck ABC bei C einen rechten Winkel, dann liegt C auf dem Halbkreis über AB. Der Mittelpunkt von AB ist der <b>Umkreismittelpunkt</b>, der Radius ist die halbe Seite AB.</div>' +
      '<p>Liegt ein Punkt nicht auf dem Kreis, ist der Winkel kein rechter:</p>' + figIO +
      '<h3>4. Rechte Winkel konstruieren</h3><p>Willst du ein Dreieck mit γ = 90° und gegebener Seite c konstruieren, zeichnest du AB = c, halbierst AB und zeichnest den Halbkreis um die Mitte. Jeder Punkt C auf diesem Bogen liefert einen rechten Winkel.</p>',
    entdecken: {
      html: '<p>Bewege C auf dem Halbkreis. Mit dem zweiten Regler schiebst du C nach innen oder nach außen.</p><div class="ctl"><label>Lage auf dem Bogen: <b id="v_t"></b> <input type="range" id="r_t" min="15" max="165" step="5" value="55"></label><label>Abstand von M: <b id="v_f"></b> <input type="range" id="r_f" min="60" max="140" step="10" value="100"></label></div><div id="e_g"></div><p id="e_t" class="big-math"></p><p id="e_l"></p><p class="note">Was passiert mit γ, solange der Abstand 100 % ist? Und was, wenn C innerhalb oder außerhalb des Kreises liegt?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var t = +root.querySelector('#r_t').value, f = +root.querySelector('#r_f').value / 100, A = [-5, 0], B = [5, 0], C = [5 * f * Math.cos(t * D2R), 5 * f * Math.sin(t * D2R)];
          root.querySelector('#v_t').textContent = t + '°'; root.querySelector('#v_f').textContent = Math.round(f * 100) + ' %';
          var al = angAt(A, B, C), be = angAt(B, A, C), ga = angAt(C, A, B);
          root.querySelector('#e_g').innerHTML = scene([{ t: 'arc', c: [0, 0], r: 5, a1: 0, a2: 180, color: C_HI, dash: '7 4', w: 1.8 }].concat(triItems([A, B, C], { angles: [Math.round(al) + '°', Math.round(be) + '°', Math.round(ga) + '°'] }), [{ t: 'pt', p: [0, 0], s: 'M', color: C_HI, dir: [0, 1] }]), { bounds: [-7.5, 7.5, -0.9, 7.2], W: 380, H: 300, label: 'Punkt C auf dem Halbkreis' });
          root.querySelector('#e_t').textContent = 'α + β + γ = ' + Math.round(al) + '° + ' + Math.round(be) + '° + ' + Math.round(ga) + '° = 180°';
          root.querySelector('#e_l').innerHTML = Math.abs(f - 1) < 1e-9 ? '<b style="color:#0f766e">C liegt auf dem Thaleskreis: γ = 90°.</b>' : f < 1 ? '<b style="color:#b91c1c">C liegt innerhalb: γ ist stumpf.</b>' : '<b style="color:#b45309">C liegt außerhalb: γ ist spitz.</b>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Richtig beobachtet: Solange C auf dem Halbkreis liegt, ist γ immer 90°, egal wo C ist. Innerhalb wird γ stumpf, außerhalb spitz.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Winkel im Thaleskreis berechnen', q: 'AB ist Durchmesser eines Kreises mit Mittelpunkt M. C liegt auf dem Kreis und α = 35°. Berechne β und den Winkel ∢AMC.',
      steps: ['C liegt auf dem Halbkreis über AB. Nach dem Satz des Thales ist γ = 90°.', 'Winkelsumme: β = 180° − 90° − 35° = 55°.', 'MA und MC sind Radien. Das Dreieck AMC ist gleichschenklig, also ist ∢ACM = α = 35°.', 'Im Dreieck AMC: ∢AMC = 180° − 35° − 35° = 110°.', 'Antwort: β = 55° und ∢AMC = 110°. Kontrolle: ∢BMC = 180° − 110° = 70° = 2 · 35°.' + thales(35, { angles: ['35°', '55°', null], mc: true, mAngles: [function (A, B, C, Mm) { return { t: 'angle', v: Mm, a: C, b: A, label: '110°', color: C_HI, lcolor: C_HI, r: 18 }; }] })] },
    tasks: { gen: gen, plan: { G: ['erkennen:1', 'thalesWinkel:1', 'innenAussen:1', 'umkehrung:2'], S: ['erkennen:1', 'thalesWinkel:1', 'innenAussen:1', 'mittelpunktDreieck:2', 'reihenfolge:2'], E: ['thalesWinkel:1', 'mittelpunktDreieck:2', 'gitterPunkt:2', 'umkehrung:2', 'reihenfolge:2', 'konstruierenMessen:3'] },
      extra: 'mittelpunktswinkel', test: ['erkennen:1', 'thalesWinkel:1', 'innenAussen:1', 'mittelpunktDreieck:2', 'umkehrung:2', 'gitterPunkt:2'] },
    lerncheck: ['Ich kann den Satz des Thales erklären und begründen.', 'Ich berechne Winkel im Thaleskreis.', 'Ich weiß, wie groß der Winkel innerhalb und außerhalb des Kreises ist.', 'Ich konstruiere ein rechtwinkliges Dreieck mit dem Thaleskreis.']
  };
})();
