/* Modul 021 · Punktspiegelung und Drehung */
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
  function rot(P, Z, w) { var dx = P[0] - Z[0], dy = P[1] - Z[1]; w = ((w % 360) + 360) % 360; if (w === 90) return [Z[0] - dy, Z[1] + dx]; if (w === 180) return [Z[0] - dx, Z[1] - dy]; if (w === 270) return [Z[0] + dy, Z[1] - dx]; return [P[0], P[1]]; }
  function rotF(P, Z, w) { var c = Math.cos(w * D2R), s = Math.sin(w * D2R), dx = P[0] - Z[0], dy = P[1] - Z[1]; return [Z[0] + c * dx - s * dy, Z[1] + s * dx + c * dy]; }
  function inB(p, r) { r = r || 7; return Math.abs(p[0]) <= r && Math.abs(p[1]) <= r; }
  function grid(items, o) { o = o || {}; var R = o.R || 7.5; return scene(items, { bounds: [-R, R, -R, R], grid: true, gridStep: 2, W: 330, H: 330, pad: 12, label: o.label || 'Koordinatensystem', maxw: 370 }); }
  function rp(r) { return [M.rnd(-r, r), M.rnd(-r, r)]; }
  function vstep(dx, dy) { var a = []; if (dx) a.push(Math.abs(dx) + (dx > 0 ? ' nach rechts' : ' nach links')); if (dy) a.push(Math.abs(dy) + (dy > 0 ? ' nach oben' : ' nach unten')); return a.join(' und ') || '0'; }
  function coordIn(p, n) { return [{ kind: 'num', label: n + ': x =', answer: p[0] }, { kind: 'num', label: n + ': y =', answer: p[1] }]; }
  function same(v, p) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); return x === p[0] && y === p[1]; }
  var WTXT = { 90: '90°', 180: '180°', 270: '270°' };
  /* Figuren für Punktsymmetrie */
  function regular(n, r, off) { var P = []; for (var i = 0; i < n; i++) P.push([r * Math.cos((off + 360 * i / n) * D2R), r * Math.sin((off + 360 * i / n) * D2R)]); return P; }
  var FIG = [
    ['Parallelogramm', [[0, 0], [4, 0], [5, 2], [1, 2]], true], ['Rechteck', [[0, 0], [4, 0], [4, 2], [0, 2]], true], ['Raute', [[0, 1.2], [1.6, 0], [3.2, 1.2], [1.6, 2.4]], true], ['regelmäßiges Sechseck', regular(6, 1.5, 0), true], ['S-Form', [[0, 0], [2, 0], [2, 1], [3, 1], [3, 2], [1, 2], [1, 1], [0, 1]], true], ['Z-Form', [[0, 0], [3, 0], [3, 0.8], [1.2, 0.8], [3, 2.4], [3, 3.2], [0, 3.2], [0, 2.4], [1.8, 2.4], [0, 0.8]], true],
    ['gleichschenkliges Trapez', [[0, 0], [4, 0], [3, 2], [1, 2]], false], ['Drachenviereck', [[0, 1], [1, 0], [3.5, 1], [1, 2]], false], ['gleichseitiges Dreieck', regular(3, 1.6, 90), false], ['regelmäßiges Fünfeck', regular(5, 1.5, 90), false], ['L-Form', [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], false], ['T-Form', [[0, 1], [1, 1], [1, 0], [2, 0], [2, 1], [3, 1], [3, 2], [0, 2]], false]];
  function isPS(P) { var c = centroid(P); return P.every(function (p) { var q = [2 * c[0] - p[0], 2 * c[1] - p[1]]; return P.some(function (r) { return dist(r, q) < 1e-6; }); }); }
  function figBox(P, cap) { return '<div style="flex:1 1 110px;max-width:150px;text-align:center">' + scene([{ t: 'poly', p: P }], { W: 150, H: 110, pad: 14, label: cap, maxw: 150 }) + '<b style="color:#5b3fa0">' + cap + '</b></div>'; }
  function windrad(n, opt) {
    opt = opt || {}; var it = [];
    for (var i = 0; i < n; i++) { var w = 360 * i / n + 90; it.push({ t: 'poly', p: [[0, 0], rotF([4, 0], [0, 0], w), rotF([3.2, 1.3], [0, 0], w)], fill: i === 0 && opt.mark ? '#fde7c4' : C_FILL, color: i === 0 && opt.mark ? C_ACC : C_LINE }); }
    it.push({ t: 'pt', p: [0, 0], color: C_LINE, r: 3.5 });
    return scene(it, { W: 220, H: 220, pad: 10, bounds: [-4.4, 4.4, -4.4, 4.4], label: 'Windrad mit ' + n + ' Flügeln', maxw: 240 });
  }
  var gen = {
    spiegelUrsprung: function () {
      var P; do { P = rp(6); } while (!P[0] || !P[1]);
      var Q = [-P[0], -P[1]];
      return { skill: 'Punktspiegelung am Ursprung', level: 1, q: 'Spiegle den Punkt P' + pt(P) + ' am Ursprung O(0 | 0). Gib die Koordinaten des Bildpunkts P′ an.' + grid([{ t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: [0, 0], s: 'O', color: C_ACC, dir: [0.8, 0.8] }]),
        inputs: coordIn(Q, 'P′'),
        hints: ['Bei der Punktspiegelung liegt das Zentrum genau in der Mitte zwischen P und P′.', 'Von O nach P geht es ' + vstep(P[0], P[1]) + '. Gehe von O aus genauso weit in die <b>entgegengesetzte</b> Richtung.', 'Am Ursprung ändern beide Koordinaten ihr Vorzeichen: P′(' + M.fmtNum(-P[0]) + ' | ?).'],
        solution: 'Bei der Spiegelung am Ursprung ändern beide Koordinaten ihr Vorzeichen: P' + pt(P) + ' wird zu <b>P′' + pt(Q) + '</b>.' + grid([{ t: 'seg', a: P, b: Q, color: C_ACC, dash: '5 4' }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }, { t: 'pt', p: [0, 0], s: 'O', color: C_ACC, dir: [0.8, 0.8] }]),
        mistakes: function (v) { if (same(v, [-P[0], P[1]]) || same(v, [P[0], -P[1]])) return 'Du hast nur eine Koordinate verändert. Das wäre eine Spiegelung an einer Achse. Bei der Punktspiegelung ändern sich beide Vorzeichen.'; return null; },
        verify: function () { var R = rot(P, [0, 0], 180); return R[0] === Q[0] && R[1] === Q[1] ? true : 'falsch'; } };
    },
    spiegelZentrum: function () {
      var P, Z, Q; do { P = rp(6); Z = rp(3); Q = [2 * Z[0] - P[0], 2 * Z[1] - P[1]]; } while (!inB(Q, 7) || dist(P, Z) < 2 || (Z[0] === 0 && Z[1] === 0));
      return { skill: 'Punktspiegelung an einem Zentrum', level: 2, q: 'Spiegle den Punkt P' + pt(P) + ' am Zentrum Z' + pt(Z) + '. Gib die Koordinaten von P′ an.' + grid([{ t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Z, s: 'Z', color: C_ACC }]),
        inputs: coordIn(Q, 'P′'),
        hints: ['Z liegt genau in der Mitte zwischen P und P′.', 'Von P nach Z geht es ' + vstep(Z[0] - P[0], Z[1] - P[1]) + '.', 'Gehe von Z aus noch einmal genauso weit: ' + vstep(Z[0] - P[0], Z[1] - P[1]) + '. Dort ist P′.'],
        solution: 'Von P nach Z: ' + vstep(Z[0] - P[0], Z[1] - P[1]) + '. Dasselbe noch einmal ab Z ergibt <b>P′' + pt(Q) + '</b>. Rechnung: x = 2 · ' + M.fmtNum(Z[0]) + ' − (' + M.fmtNum(P[0]) + ') = ' + M.fmtNum(Q[0]) + ', y = 2 · ' + M.fmtNum(Z[1]) + ' − (' + M.fmtNum(P[1]) + ') = ' + M.fmtNum(Q[1]) + '.' + grid([{ t: 'seg', a: P, b: Q, color: C_ACC, dash: '5 4' }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }, { t: 'pt', p: Z, s: 'Z', color: C_ACC }]),
        mistakes: function (v) { if (same(v, [-P[0], -P[1]])) return 'Du hast am Ursprung gespiegelt. Das Zentrum ist hier aber Z' + pt(Z) + '.'; if (same(v, [Z[0] - P[0], Z[1] - P[1]]) || same(v, [P[0] - Z[0], P[1] - Z[1]])) return 'Das ist nur der Weg zwischen P und Z. Gehe diesen Weg von Z aus noch einmal weiter.'; return null; },
        verify: function () { var m = mid(P, Q); return m[0] === Z[0] && m[1] === Z[1] ? true : 'falsch'; } };
    },
    zentrumFinden: function () {
      var P, Z, Q; do { P = rp(6); Z = rp(4); Q = [2 * Z[0] - P[0], 2 * Z[1] - P[1]]; } while (!inB(Q, 7) || dist(P, Z) < 2);
      return { skill: 'Zentrum einer Punktspiegelung finden', level: 2, q: 'Bei einer Punktspiegelung wird P' + pt(P) + ' auf P′' + pt(Q) + ' abgebildet. Wo liegt das Zentrum Z?' + grid([{ t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }]),
        inputs: coordIn(Z, 'Z'),
        hints: ['Das Zentrum liegt genau in der Mitte der Strecke PP′.', 'Mittelpunkt: x = (' + M.fmtNum(P[0]) + ' + ' + M.fmtNum(Q[0]) + ') : 2.', 'y = (' + M.fmtNum(P[1]) + ' + ' + M.fmtNum(Q[1]) + ') : 2.'],
        solution: 'Z ist der Mittelpunkt von PP′: Z = ((' + M.fmtNum(P[0]) + ' + ' + M.fmtNum(Q[0]) + ') : 2 | (' + M.fmtNum(P[1]) + ' + ' + M.fmtNum(Q[1]) + ') : 2) = <b>' + pt(Z) + '</b>.' + grid([{ t: 'seg', a: P, b: Q, color: C_ACC, dash: '5 4' }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }, { t: 'pt', p: Z, s: 'Z', color: C_ACC }]),
        mistakes: function (v) { if (same(v, [Q[0] - P[0], Q[1] - P[1]]) || same(v, [(Q[0] - P[0]) / 2, (Q[1] - P[1]) / 2])) return 'Du hast mit dem Unterschied gerechnet. Gesucht ist die Mitte: Addiere die Koordinaten und teile durch 2.'; return null; },
        verify: function () { var R = rot(P, Z, 180); return R[0] === Q[0] && R[1] === Q[1] ? true : 'falsch'; } };
    },
    drehungUrsprung: function (lvl) {
      var w = lvl === 1 ? M.pick([90, 180]) : M.pick([90, 270, 90, 180]), P; do { P = rp(6); } while (!P[0] || !P[1]);
      var Q = rot(P, [0, 0], w), cw = rot(P, [0, 0], 360 - w);
      return { skill: 'Drehung um den Ursprung', level: lvl === 1 ? 1 : 2, q: 'Drehe den Punkt P' + pt(P) + ' um den Ursprung O um ' + WTXT[w] + ' <b>gegen den Uhrzeigersinn</b>. Gib die Koordinaten des Bildpunkts P′ an.' + grid([{ t: 'seg', a: [0, 0], b: P, color: C_HI, dash: '4 3' }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: [0, 0], s: 'O', color: C_ACC, dir: [0.8, 0.8] }]),
        inputs: coordIn(Q, 'P′'),
        hints: ['Zeichne die Strecke OP. Sie wird um ' + WTXT[w] + ' gegen den Uhrzeigersinn gedreht und bleibt gleich lang.', 'Von O nach P: ' + vstep(P[0], P[1]) + '. ' + (w === 90 ? 'Bei 90° wird aus „rechts“ ein „oben“, aus „oben“ ein „links“, aus „links“ ein „unten“ und aus „unten“ ein „rechts“.' : w === 270 ? 'Bei 270° (gegen den Uhrzeigersinn) wird aus „rechts“ ein „unten“, aus „unten“ ein „links“, aus „links“ ein „oben“ und aus „oben“ ein „rechts“.' : 'Bei 180° drehen sich alle Richtungen um: Das ist eine Punktspiegelung.'), 'Regel: ' + (w === 90 ? '(x | y) wird zu (−y | x).' : w === 180 ? '(x | y) wird zu (−x | −y).' : '(x | y) wird zu (y | −x).')],
        solution: 'Regel für ' + WTXT[w] + ': ' + (w === 90 ? '(x | y) → (−y | x)' : w === 180 ? '(x | y) → (−x | −y)' : '(x | y) → (y | −x)') + '. Also P' + pt(P) + ' → <b>P′' + pt(Q) + '</b>.' + grid([{ t: 'seg', a: [0, 0], b: P, color: C_HI, dash: '4 3' }, { t: 'seg', a: [0, 0], b: Q, color: C_GRN, dash: '4 3' }].concat(w === 180 ? [] : [{ t: 'angle', v: [0, 0], a: P, b: Q, r: 18 }], [{ t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }, { t: 'pt', p: [0, 0], s: 'O', color: C_ACC, dir: [-0.8, 0.8] }])),
        mistakes: function (v) { if (w !== 180 && same(v, cw)) return 'Du hast im Uhrzeigersinn gedreht. Gedreht wird hier <b>gegen</b> den Uhrzeigersinn (mathematisch positiv).'; if (w !== 180 && same(v, [P[1], P[0]])) return 'Nur die Koordinaten tauschen reicht nicht. Achte auch auf das Vorzeichen.'; return null; },
        verify: function () { var R = rotF(P, [0, 0], w); return Math.abs(R[0] - Q[0]) < 1e-9 && Math.abs(R[1] - Q[1]) < 1e-9 ? true : 'falsch'; } };
    },
    drehungPunkt: function () {
      var w = M.pick([90, 270, 90]), P, Z, Q; do { P = rp(6); Z = rp(3); Q = rot(P, Z, w); } while (!inB(Q, 7) || dist(P, Z) < 2 || (Z[0] === 0 && Z[1] === 0));
      var d = [P[0] - Z[0], P[1] - Z[1]], dq = [Q[0] - Z[0], Q[1] - Z[1]], cw = rot(P, Z, 360 - w);
      return { skill: 'Drehung um einen Gitterpunkt', level: 3, q: 'Drehe den Punkt P' + pt(P) + ' um das Zentrum Z' + pt(Z) + ' um ' + WTXT[w] + ' gegen den Uhrzeigersinn. Gib P′ an.' + grid([{ t: 'seg', a: Z, b: P, color: C_HI, dash: '4 3' }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Z, s: 'Z', color: C_ACC }]),
        inputs: coordIn(Q, 'P′'),
        hints: ['Schaue nur auf den Weg von Z nach P: ' + vstep(d[0], d[1]) + '.', 'Drehe diesen Weg um ' + WTXT[w] + ' gegen den Uhrzeigersinn. ' + (w === 90 ? 'Aus rechts wird oben, aus oben wird links, aus links wird unten, aus unten wird rechts.' : 'Aus rechts wird unten, aus unten wird links, aus links wird oben, aus oben wird rechts.'), 'Der gedrehte Weg ist: ' + vstep(dq[0], dq[1]) + '. Gehe ihn von Z aus.'],
        solution: 'Weg Z → P: ' + vstep(d[0], d[1]) + '. Um ' + WTXT[w] + ' gedreht: ' + vstep(dq[0], dq[1]) + '. Von Z' + pt(Z) + ' aus ergibt das <b>P′' + pt(Q) + '</b>.' + grid([{ t: 'seg', a: Z, b: P, color: C_HI, dash: '4 3' }, { t: 'seg', a: Z, b: Q, color: C_GRN, dash: '4 3' }, { t: 'angle', v: Z, a: P, b: Q, r: 16 }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q, s: 'P′', color: C_GRN }, { t: 'pt', p: Z, s: 'Z', color: C_ACC }]),
        mistakes: function (v) { if (same(v, cw)) return 'Du hast im Uhrzeigersinn gedreht. Gedreht wird gegen den Uhrzeigersinn.'; if (same(v, rot(P, [0, 0], w))) return 'Du hast um den Ursprung gedreht. Das Zentrum ist aber Z' + pt(Z) + '.'; return null; },
        verify: function () { var R = rotF(P, Z, w); return Math.abs(R[0] - Q[0]) < 1e-9 && Math.abs(R[1] - Q[1]) < 1e-9 && Math.abs(dist(Z, P) - dist(Z, Q)) < 1e-9 ? true : 'falsch'; } };
    },
    symmetrisch: function () {
      var ask = Math.random() < 0.6, pool = FIG.filter(function (f) { return f[2] === ask; }), rest = FIG.filter(function (f) { return f[2] !== ask; });
      var right = M.pick(pool), figs = M.shuffle([right].concat(M.shuffle(rest).slice(0, 3))), L = ['A', 'B', 'C', 'D'], idx = figs.indexOf(right);
      return { skill: 'Punktsymmetrische Figuren erkennen', level: 1, q: 'Welche Figur ist ' + (ask ? '' : '<b>nicht</b> ') + 'punktsymmetrisch?<div style="display:flex;flex-wrap:wrap;gap:6px 12px;align-items:flex-end">' + figs.map(function (f, i) { return figBox(f[1], 'Figur ' + L[i]); }).join('') + '</div>',
        inputs: [{ kind: 'mc', label: 'Figur', options: L.map(function (l) { return 'Figur ' + l; }), answer: idx }],
        hints: ['Eine Figur ist punktsymmetrisch, wenn sie nach einer halben Drehung (180°) um ihren Mittelpunkt genau gleich aussieht.', 'Stelle dir vor, du drehst das Blatt auf den Kopf. Sieht die Figur dann noch genauso aus?', 'Achsensymmetrisch heißt nicht automatisch punktsymmetrisch. Ein gleichseitiges Dreieck oder ein gleichschenkliges Trapez stehen auf dem Kopf anders da.'],
        solution: 'Figur ' + L[idx] + ' (' + right[0] + ') ist ' + (ask ? '' : '<b>nicht</b> ') + 'punktsymmetrisch. Die anderen sind ' + (ask ? 'nicht punktsymmetrisch: ' : 'punktsymmetrisch: ') + figs.filter(function (f) { return f !== right; }).map(function (f) { return f[0]; }).join(', ') + '.',
        verify: function () { return figs.filter(function (f) { return isPS(f[1]) === ask; }).length === 1 && isPS(right[1]) === ask ? true : 'Symmetrie falsch'; } };
    },
    drehwinkel: function () {
      var n = M.pick([3, 4, 5, 6, 8, 9, 10, 12]), w = 360 / n;
      return { skill: 'Drehwinkel bei Mustern', level: 1, q: 'Das Windrad hat ' + n + ' gleiche Flügel. Um welchen <b>kleinsten</b> Winkel (größer als 0°) musst du es um seinen Mittelpunkt drehen, damit es wieder genauso aussieht?' + windrad(n, { mark: true }),
        inputs: [{ kind: 'num', label: 'kleinster Drehwinkel', unit: '°', answer: w }],
        hints: ['Eine volle Drehung hat 360°.', 'Bei der kleinsten Drehung rückt jeder Flügel genau eine Stelle weiter, zum Beispiel der orange Flügel auf den Platz des nächsten.', '360° werden auf ' + n + ' gleiche Teile verteilt: 360° : ' + n + '.'],
        solution: '360° : ' + n + ' = <b>' + w + '°</b>. Auch jedes Vielfache davon (' + w * 2 + '°, ' + w * 3 + '°, …) bildet das Windrad auf sich selbst ab.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === 360) return 'Nach 360° sieht jede Figur wieder gleich aus. Gesucht ist der kleinste Winkel.'; if (x === 180 / n) return 'Teile die volle Drehung 360° durch die Anzahl der Flügel, nicht 180°.'; return null; },
        verify: function () { return Math.abs(w * n - 360) < 1e-9 ? true : 'falsch'; } };
    },
    regelmaessig: function () {
      var n = M.pick([3, 4, 5, 6, 8, 10]), w = 360 / n, k = M.rnd(1, n - 1), good = w * k, bad = [];
      var cands = [20, 30, 40, 45, 50, 60, 70, 80, 90, 100, 108, 120, 135, 150, 160, 200, 210, 240, 270].filter(function (x) { return Math.abs(x / w - Math.round(x / w)) > 1e-9; });
      bad = M.shuffle(cands).slice(0, 3); var opts = M.shuffle([good].concat(bad));
      var names = { 3: 'gleichseitige Dreieck', 4: 'Quadrat', 5: 'regelmäßige Fünfeck', 6: 'regelmäßige Sechseck', 8: 'regelmäßige Achteck', 10: 'regelmäßige Zehneck' };
      return { skill: 'Drehsymmetrie regelmäßiger Vielecke', level: 2, q: 'Das ' + names[n] + ' wird um seinen Mittelpunkt gedreht. Bei welchem Drehwinkel wird es genau auf sich selbst abgebildet?' + scene([{ t: 'poly', p: regular(n, 3, 90) }, { t: 'pt', p: [0, 0], color: C_ACC, r: 3.5 }], { W: 200, H: 200, pad: 12, bounds: [-3.3, 3.3, -3.3, 3.3], label: 'Regelmäßiges ' + n + '-Eck', maxw: 220 }),
        inputs: [{ kind: 'mc', label: 'Drehwinkel', options: opts.map(function (x) { return x + '°'; }), answer: opts.indexOf(good) }],
        hints: ['Ein regelmäßiges ' + n + '-Eck hat ' + n + ' gleiche Ecken. Die kleinste passende Drehung ist 360° : ' + n + ' = ' + M.fmtNum(w) + '°.', 'Jedes Vielfache von ' + M.fmtNum(w) + '° passt auch: ' + [1, 2, 3].map(function (i) { return M.fmtNum(w * i) + '°'; }).join(', ') + ', …', 'Prüfe, welcher Winkel durch ' + M.fmtNum(w) + '° teilbar ist.'],
        solution: good + '° = ' + k + ' · ' + M.fmtNum(w) + '°. Die anderen Winkel sind keine Vielfachen von ' + M.fmtNum(w) + '°.',
        verify: function () { return opts.filter(function (x) { return Math.abs(x / w - Math.round(x / w)) < 1e-9; }).length === 1 ? true : 'mehrdeutig'; } };
    },
    eigenschaften: function () {
      var T = [['Bild und Original sind kongruent (deckungsgleich).', 'Drehungen und Punktspiegelungen verändern weder Längen noch Winkel.'], ['Eine Punktspiegelung ist dasselbe wie eine Drehung um 180°.', 'Bei 180° landet jeder Punkt genau gegenüber auf der anderen Seite des Zentrums.'], ['Bei einer Punktspiegelung ist eine Strecke parallel zu ihrer Bildstrecke.', 'Die Bildstrecke zeigt genau in die entgegengesetzte Richtung, liegt also parallel.'], ['Das Drehzentrum bleibt bei einer Drehung an seinem Platz.', 'Es ist der einzige Punkt, der sich nicht bewegt (außer bei 360°).'], ['Bei einer Drehung bleibt der Abstand jedes Punktes zum Zentrum gleich.', 'Jeder Punkt bewegt sich auf einem Kreis um das Zentrum.']];
      var F = [['Bei einer Drehung wird die Figur größer.', 'Längen bleiben gleich. Bild und Original sind kongruent.'], ['Eine Punktspiegelung ist eine Drehung um 90°.', 'Eine Punktspiegelung ist eine Drehung um 180°.'], ['Bei einer Punktspiegelung steht die Bildstrecke senkrecht auf der Originalstrecke.', 'Bild- und Originalstrecke sind parallel.'], ['Bei einer Drehung um 90° ändern sich die Winkel der Figur.', 'Winkel bleiben bei jeder Drehung gleich.'], ['Bei der Spiegelung am Ursprung ändert sich nur die x-Koordinate.', 'Beide Koordinaten ändern ihr Vorzeichen.']];
      var askTrue = Math.random() < 0.5, ans = askTrue ? M.pick(T) : M.pick(F), opts = M.shuffle([ans].concat(M.shuffle(askTrue ? F : T).slice(0, 3)));
      return { skill: 'Eigenschaften von Drehung und Punktspiegelung', level: 1, q: 'Welche Aussage ist ' + (askTrue ? '<b>richtig</b>' : '<b>falsch</b>') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(function (o) { return o[0]; }), answer: opts.indexOf(ans) }],
        hints: ['Drehung und Punktspiegelung sind Kongruenzabbildungen: Längen und Winkel bleiben gleich.', 'Eine Punktspiegelung ist eine Drehung um 180°.', 'Genau eine Aussage ist ' + (askTrue ? 'richtig' : 'falsch') + '.'],
        solution: '„' + ans[0] + '“ ist ' + (askTrue ? 'richtig' : 'falsch') + '. ' + ans[1],
        verify: function () { return opts.filter(function (o) { return (T.indexOf(o) >= 0) === askTrue; }).length === 1 ? true : 'Aussagen'; } };
    },
    doppelt: function () {
      var P, Z1, Z2, Q1, Q2; do { P = rp(5); Z1 = rp(3); Z2 = rp(3); Q1 = [2 * Z1[0] - P[0], 2 * Z1[1] - P[1]]; Q2 = [2 * Z2[0] - Q1[0], 2 * Z2[1] - Q1[1]]; } while (!inB(Q1, 7) || !inB(Q2, 7) || dist(Z1, Z2) < 1.5 || dist(P, Z1) < 2 || dist(Q2, P) < 2);
      var v = [Q2[0] - P[0], Q2[1] - P[1]];
      return { skill: 'Zwei Punktspiegelungen nacheinander', level: 3, q: 'Der Punkt P' + pt(P) + ' wird zuerst an Z₁' + pt(Z1) + ' gespiegelt. Den Bildpunkt P′ spiegelst du danach an Z₂' + pt(Z2) + ' und erhältst P″.<br>a) Gib P″ an. b) Um wie viele Kästchen nach rechts (x) und nach oben (y) liegt P″ gegenüber P verschoben? (Nach links oder unten: negative Zahl.)' + grid([{ t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Z1, s: 'Z₁', color: C_ACC }, { t: 'pt', p: Z2, s: 'Z₂', color: C_ACC }]),
        inputs: coordIn(Q2, 'a) P″').concat([{ kind: 'num', label: 'b) Verschiebung x', answer: v[0] }, { kind: 'num', label: 'b) Verschiebung y', answer: v[1] }]),
        hints: ['Spiegle zuerst P an Z₁: P′ = (2 · ' + M.fmtNum(Z1[0]) + ' − (' + M.fmtNum(P[0]) + ') | 2 · ' + M.fmtNum(Z1[1]) + ' − (' + M.fmtNum(P[1]) + ')) = ' + pt(Q1) + '.', 'Spiegle dann P′ an Z₂ genauso.', 'Vergleiche P″ mit P. Fällt dir etwas auf, wenn du den Weg von Z₁ nach Z₂ verdoppelst?'],
        solution: 'P′ = ' + pt(Q1) + ', P″ = ' + pt(Q2) + '. Verschiebung: x = ' + M.fmtNum(v[0]) + ', y = ' + M.fmtNum(v[1]) + '. Das ist genau doppelt so weit wie der Weg von Z₁ nach Z₂ (' + vstep(Z2[0] - Z1[0], Z2[1] - Z1[1]) + '). Zwei Punktspiegelungen nacheinander ergeben eine <b>Verschiebung</b>.' + grid([{ t: 'seg', a: P, b: Q1, color: C_ACC, dash: '5 4' }, { t: 'seg', a: Q1, b: Q2, color: C_ACC, dash: '5 4' }, { t: 'seg', a: P, b: Q2, color: C_GRN, w: 2.5 }, { t: 'pt', p: P, s: 'P', color: C_HI }, { t: 'pt', p: Q1, s: 'P′', color: C_HI }, { t: 'pt', p: Q2, s: 'P″', color: C_GRN }, { t: 'pt', p: Z1, s: 'Z₁', color: C_ACC }, { t: 'pt', p: Z2, s: 'Z₂', color: C_ACC }]),
        mistakes: function (vv) { if (same(vv, Q1)) return 'Das ist erst P′. Spiegle P′ noch an Z₂.'; return null; },
        verify: function () { return v[0] === 2 * (Z2[0] - Z1[0]) && v[1] === 2 * (Z2[1] - Z1[1]) ? true : 'falsch'; } };
    }
  };
  /* Erklärungsfiguren */
  var tri = [[1, 1], [4, 1], [1, 3]];
  function triPts(T, names, col, fill) { return [{ t: 'poly', p: T, color: col, fill: fill }].concat(T.map(function (p, i) { var c = centroid(T); return { t: 'pt', p: p, s: names[i], color: col, dir: [p[0] - c[0], p[1] - c[1]] }; })); }
  var exZ = [0, 0], exS = tri.map(function (p) { return rot(p, exZ, 180); });
  var figSp = grid([{ t: 'seg', a: tri[0], b: exS[0], color: C_ACC, dash: '4 3', w: 1.4 }, { t: 'seg', a: tri[1], b: exS[1], color: C_ACC, dash: '4 3', w: 1.4 }, { t: 'seg', a: tri[2], b: exS[2], color: C_ACC, dash: '4 3', w: 1.4 }].concat(triPts(tri, ['A', 'B', 'C'], C_HI), triPts(exS, ['A′', 'B′', 'C′'], C_GRN, '#e6f4ea'), [{ t: 'pt', p: exZ, s: 'Z', color: C_ACC, dir: [-0.8, 0.8] }]), { R: 5.5, label: 'Punktspiegelung eines Dreiecks am Ursprung' });
  var exR = tri.map(function (p) { return rot(p, exZ, 90); });
  var figRot = grid([{ t: 'seg', a: exZ, b: tri[1], color: C_HI, dash: '4 3', w: 1.4 }, { t: 'seg', a: exZ, b: exR[1], color: C_GRN, dash: '4 3', w: 1.4 }, { t: 'angle', v: exZ, a: tri[1], b: exR[1], r: 20 }].concat(triPts(tri, ['A', 'B', 'C'], C_HI), triPts(exR, ['A′', 'B′', 'C′'], C_GRN, '#e6f4ea'), [{ t: 'pt', p: exZ, s: 'Z', color: C_ACC, dir: [0.8, 0.8] }]), { R: 5.5, label: 'Drehung eines Dreiecks um 90°' });
  return {
    id: '021', title: 'Punktspiegelung und Drehung', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Koordinatensystem mit negativen Zahlen, Achsenspiegelung, Winkel',
    lead: 'Ein Windrad dreht sich, eine Spielkarte steht auf dem Kopf und sieht trotzdem gleich aus. Du lernst Drehungen und Punktspiegelungen kennen und berechnest Bildpunkte im Koordinatensystem.',
    einstieg: { html: '<p>Schau dir eine Spielkarte an, zum Beispiel die Herz-Dame. Drehst du sie einmal halb herum, sieht sie genauso aus wie vorher. Auch viele Logos, Windräder und Fliesenmuster passen nach einer Drehung wieder genau auf sich selbst.</p><p class="note">Um welchen Winkel musst du ein Windrad mit drei Flügeln drehen, damit es wieder gleich aussieht? Und was passiert mit den Koordinaten eines Punktes, wenn du ihn um 180° drehst?</p><p>In diesem Modul lernst du zwei neue Abbildungen kennen: die <b>Punktspiegelung</b> und die <b>Drehung</b>. Beide verändern weder Längen noch Winkel.</p>' },
    ziele: ['Ich spiegle Punkte und Figuren an einem Punkt (Zentrum).', 'Ich bestimme Bildpunkte einer Punktspiegelung im Koordinatensystem.', 'Ich drehe Punkte um 90°, 180° und 270° um den Ursprung oder einen Gitterpunkt.', 'Ich erkenne punktsymmetrische und drehsymmetrische Figuren.', 'Ich bestimme den kleinsten Drehwinkel bei Mustern und regelmäßigen Vielecken.'],
    fachwoerter: [['Punktspiegelung', 'Jeder Punkt P wird so auf P′ abgebildet, dass das Zentrum Z genau in der Mitte von PP′ liegt.'], ['Drehung', 'Jeder Punkt wird um ein Drehzentrum Z um denselben Winkel gedreht. Der Abstand zu Z bleibt gleich.'], ['gegen den Uhrzeigersinn', 'Die übliche Drehrichtung in der Mathematik (mathematisch positiv).'], ['punktsymmetrisch', 'Eine Figur, die bei einer Drehung um 180° um ihren Mittelpunkt auf sich selbst fällt.'], ['drehsymmetrisch', 'Eine Figur, die bei einer Drehung um einen Winkel kleiner als 360° auf sich selbst fällt.']],
    diagnose: [
      { q: 'Wo liegt der Punkt P(−3 | 2)?', options: ['3 nach links und 2 nach oben vom Ursprung', '3 nach rechts und 2 nach unten vom Ursprung', '2 nach links und 3 nach oben vom Ursprung', 'Weiß ich noch nicht'], answer: 0, why: 'Die x-Koordinate −3 heißt 3 nach links, die y-Koordinate 2 heißt 2 nach oben.', review: 'Koordinatensystem mit negativen Zahlen (Klasse 6/7)' },
      { q: 'Bei einer Achsenspiegelung an der y-Achse wird P(4 | 1) abgebildet auf …', options: ['P′(−4 | 1)', 'P′(4 | −1)', 'P′(−4 | −1)', 'Weiß ich noch nicht'], answer: 0, why: 'An der y-Achse ändert sich nur das Vorzeichen der x-Koordinate.', review: 'Achsenspiegelung (Klasse 5/6)' },
      { q: 'Wie groß ist eine Vierteldrehung?', options: ['90°', '45°', '180°', 'Weiß ich noch nicht'], answer: 0, why: 'Eine volle Drehung hat 360°, ein Viertel davon sind 90°.', review: 'Winkel und Drehungen' },
      { q: 'Was ist 2 · 3 − (−1)?', options: ['7', '5', '−7', 'Weiß ich noch nicht'], answer: 0, why: '6 − (−1) = 6 + 1 = 7.', review: 'Rechnen mit negativen Zahlen (Klasse 7)' }],
    erklaerung:
      '<h3>1. Die Punktspiegelung</h3><p>Bei einer <b>Punktspiegelung</b> am Zentrum Z verbindest du jeden Punkt P mit Z und verlängerst die Strecke über Z hinaus um dieselbe Länge. So erhältst du den Bildpunkt P′. Z ist die Mitte von PP′.</p>' + figSp +
      '<div class="merk"><b>Merke:</b> Spiegelung am Ursprung: <span class="big-math">P(x | y) → P′(−x | −y)</span><br>Spiegelung an Z(a | b): Gehe von P nach Z und dann denselben Weg noch einmal weiter. Rechnerisch: P′(2a − x | 2b − y).</div>' +
      '<p>Eine Strecke und ihre Bildstrecke sind gleich lang und <b>parallel</b>. Die Figur steht danach „auf dem Kopf“.</p>' +
      '<h3>2. Die Drehung</h3><p>Bei einer <b>Drehung</b> um das Zentrum Z wird jeder Punkt um denselben Winkel gedreht. Der Abstand zu Z bleibt gleich. In der Mathematik dreht man <b>gegen den Uhrzeigersinn</b>.</p>' + figRot +
      '<div class="merk"><b>Merke (Drehung um den Ursprung):</b><br>um 90°: (x | y) → (−y | x)<br>um 180°: (x | y) → (−x | −y)<br>um 270°: (x | y) → (y | −x)<br>Eine Drehung um 180° ist dasselbe wie eine Punktspiegelung.</div>' +
      '<p class="note">Drehung um einen anderen Gitterpunkt Z: Schaue auf den Weg von Z nach P (zum Beispiel 3 nach rechts, 1 nach oben). Drehe diesen Weg um 90° (dann 3 nach oben, 1 nach links) und gehe ihn von Z aus.</p>' +
      '<h3>3. Symmetrische Figuren</h3><p>Fällt eine Figur bei einer Drehung um 180° auf sich selbst, ist sie <b>punktsymmetrisch</b> (zum Beispiel Parallelogramm, Rechteck, Raute). Fällt sie schon bei einem kleineren Winkel auf sich selbst, ist sie <b>drehsymmetrisch</b>.</p><div style="display:flex;flex-wrap:wrap;gap:8px 16px;align-items:flex-end"><div style="flex:1 1 140px;max-width:200px;text-align:center">' + windrad(3) + '<b style="color:#5b3fa0">3 Flügel: 120°</b></div><div style="flex:1 1 140px;max-width:200px;text-align:center">' + windrad(4) + '<b style="color:#5b3fa0">4 Flügel: 90°</b></div><div style="flex:1 1 140px;max-width:200px;text-align:center">' + windrad(6) + '<b style="color:#5b3fa0">6 Flügel: 60°</b></div></div>' +
      '<div class="merk"><b>Merke:</b> Ein Muster mit n gleichen Teilen (oder ein regelmäßiges n-Eck) hat den kleinsten Drehwinkel <span class="big-math">360° : n</span></div>',
    entdecken: {
      html: '<p>Das Dreieck ABC wird um das Zentrum Z gedreht. Wähle den Drehwinkel und verschiebe Z.</p><div class="ctl"><label>Drehwinkel: <select id="s_w"><option value="90">90°</option><option value="180">180° (Punktspiegelung)</option><option value="270">270°</option></select></label><label>Z: x = <b id="v_x"></b> <input type="range" id="r_x" min="-4" max="3" step="1" value="-3"></label><label>Z: y = <b id="v_y"></b> <input type="range" id="r_y" min="-4" max="3" step="1" value="-3"></label></div><div id="e_g"></div><p id="e_t"></p><p class="note">Beobachte: Welche Abstände bleiben gleich? Wie liegen die Seiten bei 180° zueinander?</p>',
      init: function (root, done) {
        var n = 0, T = [[1, 1], [4, 1], [1, 3]];
        function draw() {
          var w = +root.querySelector('#s_w').value, Z = [+root.querySelector('#r_x').value, +root.querySelector('#r_y').value], R = T.map(function (p) { return rot(p, Z, w); });
          root.querySelector('#v_x').textContent = M.fmtNum(Z[0]); root.querySelector('#v_y').textContent = M.fmtNum(Z[1]);
          var it = [{ t: 'seg', a: Z, b: T[1], color: C_HI, dash: '4 3', w: 1.4 }, { t: 'seg', a: Z, b: R[1], color: C_GRN, dash: '4 3', w: 1.4 }].concat(w === 90 ? [{ t: 'angle', v: Z, a: T[1], b: R[1], r: 18, label: '90°' }] : [],triPts(T, ['A', 'B', 'C'], C_HI), triPts(R, ['A′', 'B′', 'C′'], C_GRN, '#e6f4ea'), [{ t: 'pt', p: Z, s: 'Z', color: C_ACC, dir: [-0.8, 0.8] }]);
          root.querySelector('#e_g').innerHTML = grid(it, { R: 9.5, label: 'Drehung eines Dreiecks' });
          root.querySelector('#e_t').innerHTML = 'B' + pt(T[1]) + ' → <b>B′' + pt(R[1]) + '</b>. Abstand ZB = ZB′.' + (w === 180 ? ' Bei 180° liegt Z genau in der Mitte von BB′: Das ist eine Punktspiegelung.' : w === 270 ? ' 270° gegen den Uhrzeigersinn ist dasselbe wie 90° im Uhrzeigersinn.' : '');
        }
        function step() { draw(); n++; if (n >= 3) done('Gut erkundet: Bei jeder Drehung bleiben Längen, Winkel und die Abstände zum Zentrum gleich. Die Drehung um 180° ist eine Punktspiegelung.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', step); });
        root.querySelector('#s_w').addEventListener('change', step);
        draw();
      }
    },
    beispiel: { title: 'Drehung um einen Gitterpunkt', q: 'Drehe P(4 | 2) um Z(1 | 1) um 90° gegen den Uhrzeigersinn.',
      steps: ['Weg von Z nach P bestimmen: von (1 | 1) nach (4 | 2) sind es 3 nach rechts und 1 nach oben.', 'Diesen Weg um 90° gegen den Uhrzeigersinn drehen: Aus „3 nach rechts“ wird „3 nach oben“, aus „1 nach oben“ wird „1 nach links“.', 'Gedrehten Weg von Z aus gehen: (1 | 1) → 1 nach links, 3 nach oben → (0 | 4).', 'Ergebnis: <b>P′(0 | 4)</b>.', 'Kontrolle: ZP und ZP′ sind gleich lang und stehen senkrecht aufeinander.' + grid([{ t: 'seg', a: [1, 1], b: [4, 2], color: C_HI, dash: '4 3' }, { t: 'seg', a: [1, 1], b: [0, 4], color: C_GRN, dash: '4 3' }, { t: 'angle', v: [1, 1], a: [4, 2], b: [0, 4], r: 16 }, { t: 'pt', p: [4, 2], s: 'P', color: C_HI }, { t: 'pt', p: [0, 4], s: 'P′', color: C_GRN }, { t: 'pt', p: [1, 1], s: 'Z', color: C_ACC, dir: [0.6, 1] }], { R: 5.5, label: 'Drehung von P um Z' })] },
    tasks: { gen: gen, plan: { G: ['spiegelUrsprung:1', 'symmetrisch:1', 'drehungUrsprung:1', 'drehwinkel:1'], S: ['spiegelUrsprung:1', 'spiegelZentrum:2', 'drehungUrsprung:2', 'symmetrisch:1', 'drehwinkel:1'], E: ['spiegelZentrum:2', 'zentrumFinden:2', 'drehungUrsprung:2', 'drehungPunkt:3', 'regelmaessig:2', 'eigenschaften:1'] },
      extra: 'doppelt', test: ['spiegelUrsprung:1', 'spiegelZentrum:2', 'drehungUrsprung:2', 'symmetrisch:1', 'drehwinkel:1', 'drehungPunkt:3'] },
    lerncheck: ['Ich spiegle Punkte an einem Zentrum, auch im Koordinatensystem.', 'Ich drehe Punkte um 90°, 180° und 270°.', 'Ich erkenne punktsymmetrische Figuren.', 'Ich bestimme den kleinsten Drehwinkel bei Mustern.']
  };
})();
