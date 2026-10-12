/* Modul 012 · Nullstellen und Schnittpunkte */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  /* Koordinatensystem mit Geraden und Kurven (nach Modul 011, erweitert)
     lines: { m: Bruch oder Zahl, b } oder { f: function(x) }, optional color, label, pts, tri, from, to, dash
     o: r (Raster −r … r) oder x/y [min, max], gx/gy Rasterweite, lx/ly Beschriftungsabstand, w/h Größe, tx/ty Achsennamen, marks, cap, maxw */
  function mval(m) { return typeof m === 'number' ? m : m.n / m.d; }
  function graph(lines, o) {
    o = o || {};
    var R = o.r || 6, xr = o.x || [-R, R], yr = o.y || [-R, R], gx = o.gx || 1, gy = o.gy || 1, lx = o.lx || 2 * gx, ly = o.ly || 2 * gy;
    var xl = xr[0] - gx / 2, xh = xr[1] + gx / 2, yl = yr[0] - gy / 2, yh = yr[1] + gy / 2;
    var PW = o.w || 300, PH = o.h || PW * (yh - yl) / (xh - xl) * (gx / gy);
    if (!o.h && (o.x || o.y)) PH = Math.min(PH, 300);
    var ux = PW / (xh - xl), uy = PH / (yh - yl);
    var mL = xr[0] >= 0 ? 30 : 6, mB = yr[0] >= 0 ? 22 : 6, mT = 6, mR = 8;
    if (o.cap) mT += 0;
    var W = mL + PW + mR, H = mT + PH + mB;
    function X(x) { return mL + (x - xl) * ux; } function Y(y) { return mT + (yh - y) * uy; }
    function fx(v) { return Math.round(v * 10) / 10; }
    var ax = xr[0] <= 0 && xr[1] >= 0 ? 0 : xr[0], ay = yr[0] <= 0 && yr[1] >= 0 ? 0 : yr[0];
    var g = '<svg class="viz" viewBox="0 0 ' + fx(W) + ' ' + fx(H) + '" role="img" aria-label="' + (o.label || 'Koordinatensystem') + '" style="max-width:' + (o.maxw || 340) + 'px">';
    var i;
    for (i = Math.ceil(xr[0] / gx) * gx; i <= xr[1] + 1e-9; i += gx) g += '<line x1="' + fx(X(i)) + '" y1="' + fx(Y(yl)) + '" x2="' + fx(X(i)) + '" y2="' + fx(Y(yh)) + '" stroke="#e3dcf2"/>';
    for (i = Math.ceil(yr[0] / gy) * gy; i <= yr[1] + 1e-9; i += gy) g += '<line x1="' + fx(X(xl)) + '" y1="' + fx(Y(i)) + '" x2="' + fx(X(xh)) + '" y2="' + fx(Y(i)) + '" stroke="#e3dcf2"/>';
    g += '<line x1="' + fx(X(xl)) + '" y1="' + fx(Y(ay)) + '" x2="' + fx(X(xh)) + '" y2="' + fx(Y(ay)) + '" stroke="#1c1830" stroke-width="1.6"/><line x1="' + fx(X(ax)) + '" y1="' + fx(Y(yl)) + '" x2="' + fx(X(ax)) + '" y2="' + fx(Y(yh)) + '" stroke="#1c1830" stroke-width="1.6"/>';
    var inner = ax === 0 && ay === 0 && xr[0] < 0 && yr[0] < 0;
    for (i = Math.ceil(xr[0] / lx) * lx; i <= xr[1] + 1e-9; i += lx) { var vi = Math.round(i * 1000) / 1000; if (vi === 0 && inner) continue; g += '<text x="' + fx(X(vi)) + '" y="' + fx(Y(ay) + 14) + '" font-size="10" text-anchor="middle">' + M.fmtNum(vi) + '</text>'; }
    for (i = Math.ceil(yr[0] / ly) * ly; i <= yr[1] + 1e-9; i += ly) { var wi = Math.round(i * 1000) / 1000; if (wi === 0 && (inner || ay === 0 && ax === xr[0])) continue; g += '<text x="' + fx(X(ax) - 5) + '" y="' + fx(Y(wi) + 4) + '" font-size="10" text-anchor="end">' + M.fmtNum(wi) + '</text>'; }
    g += '<text x="' + fx(X(xh) - 3) + '" y="' + fx(Y(ay) - 6) + '" font-size="12" font-weight="700" text-anchor="end">' + (o.tx || 'x') + '</text><text x="' + fx(X(ax) + 6) + '" y="' + fx(Y(yh) + 12) + '" font-size="12" font-weight="700">' + (o.ty || 'y') + '</text>';
    lines.forEach(function (L, idx) {
      var col = L.color || ['#5b3fa0', '#d97706', '#0f766e'][idx % 3], a = Math.max(xl, L.from != null ? L.from : xl), z = Math.min(xh, L.to != null ? L.to : xh);
      var dash = L.dash ? ' stroke-dasharray="7 5"' : '', ex = null;
      if (L.f) {
        var d = '', pen = false, N = 240;
        for (var k = 0; k <= N; k++) {
          var xx = a + (z - a) * k / N, yy = L.f(xx);
          if (!isFinite(yy) || yy < yl || yy > yh) { pen = false; continue; }
          d += (pen ? ' L' : ' M') + fx(X(xx)) + ' ' + fx(Y(yy)); pen = true; ex = [xx, yy];
        }
        g += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"' + dash + '/>';
      } else {
        var m = mval(L.m), b = L.b, x1 = a, x2 = z;
        if (Math.abs(m) > 1e-9) { var xa = (yl - b) / m, xb = (yh - b) / m; x1 = Math.max(x1, Math.min(xa, xb)); x2 = Math.min(x2, Math.max(xa, xb)); }
        if (x2 > x1 && (Math.abs(m) > 1e-9 || (b >= yl && b <= yh))) {
          g += '<line x1="' + fx(X(x1)) + '" y1="' + fx(Y(m * x1 + b)) + '" x2="' + fx(X(x2)) + '" y2="' + fx(Y(m * x2 + b)) + '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"' + dash + '/>';
          ex = [x2, m * x2 + b];
        }
        if (L.tri) {
          var x0 = L.tri[0], y0 = m * x0 + b, dx = L.m.d, dy = L.m.n;
          g += '<path d="M' + fx(X(x0)) + ' ' + fx(Y(y0)) + ' H' + fx(X(x0 + dx)) + ' V' + fx(Y(y0 + dy)) + '" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>' +
            '<text x="' + fx(X(x0 + dx / 2)) + '" y="' + fx(Y(y0) + (dy > 0 ? 15 : -6)) + '" font-size="12" font-weight="700" fill="#b45309" text-anchor="middle">' + dx + '</text>' +
            '<text x="' + fx(X(x0 + dx) + 5) + '" y="' + fx(Y(y0 + dy / 2) + 4) + '" font-size="12" font-weight="700" fill="#b45309">' + (dy > 0 ? '+' : '−') + Math.abs(dy) + '</text>';
        }
      }
      if (L.label && ex) { var up = L.labelPos === 'below' ? 16 : -7; g += '<text x="' + fx(Math.min(X(ex[0]) - 4, W - 4)) + '" y="' + fx(Math.max(14, Math.min(H - 4, Y(ex[1]) + up))) + '" font-size="13" font-weight="700" fill="' + col + '" text-anchor="end">' + L.label + '</text>'; }
      (L.pts || []).forEach(function (p) { g += '<circle cx="' + fx(X(p[0])) + '" cy="' + fx(Y(p[1])) + '" r="4.5" fill="' + col + '" stroke="#fff" stroke-width="1.5"/>'; });
    });
    (o.marks || []).forEach(function (mk) {
      g += '<circle cx="' + fx(X(mk.x)) + '" cy="' + fx(Y(mk.y)) + '" r="5" fill="' + (mk.color || '#1c1830') + '" stroke="#fff" stroke-width="1.5"/>';
      if (mk.text) { var tx = X(mk.x) + (mk.dx != null ? mk.dx : 8), ty = Y(mk.y) + (mk.dy != null ? mk.dy : -8); g += '<text x="' + fx(tx) + '" y="' + fx(ty) + '" font-size="12" font-weight="700" fill="' + (mk.color || '#1c1830') + '"' + (mk.anchor ? ' text-anchor="' + mk.anchor + '"' : '') + '>' + mk.text + '</text>'; }
    });
    if (o.cap) g += '<rect x="' + fx(X(xl) + 3) + '" y="' + fx(Y(yh) + 3) + '" width="26" height="22" rx="5" fill="#3d2a73"/><text x="' + fx(X(xl) + 16) + '" y="' + fx(Y(yh) + 19) + '" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">' + o.cap + '</text>';
    if (o.hot) for (var hx = Math.ceil(xr[0]); hx <= xr[1]; hx++) for (var hy = Math.ceil(yr[0]); hy <= yr[1]; hy++) g += '<circle data-x="' + hx + '" data-y="' + hy + '" cx="' + fx(X(hx)) + '" cy="' + fx(Y(hy)) + '" r="' + fx(Math.min(ux, uy) * 0.45) + '" fill="#fff" fill-opacity="0" style="cursor:pointer"/>';
    return g + '</svg>';
  }
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function mHtml(m) { if (m.d === 1) return m.n === 1 ? '' : m.n === -1 ? '−' : n(m.n); return (m.n < 0 ? '−' : '') + fh(F(Math.abs(m.n), m.d)); }
  function eqHtml(m, b) { if (m.n === 0) return 'y = ' + n(b); return 'y = ' + mHtml(m) + 'x' + (b ? (b > 0 ? ' + ' + n(b) : ' − ' + n(-b)) : ''); }
  function eqStr(m, b) { return '(' + m.n + '/' + m.d + ')*x+(' + b + ')'; }
  function fr(f) { return fh(M.red(f)); }
  function fin(ans, label) { return { kind: 'frac', answer: M.red(ans), label: label, placeholder: 'z. B. 3 oder −5/2' }; }
  function fmul(a, b) { return M.fmul(a, b); }
  function isZero(f) { return f.n === 0; }
  /* m·x + b als Bruch auswerten */
  function at(m, b, x) { return M.fadd(fmul(m, x), F(b)); }
  var INT = [F(1), F(2), F(3), F(-1), F(-2), F(-3), F(4), F(-4)];
  var HALF = [F(1, 2), F(-1, 2), F(3, 2), F(-3, 2), F(1, 3), F(-1, 3), F(2, 3), F(-2, 3), F(3, 4), F(-3, 4)];
  function mulText(m) { return m.d === 1 ? n(m.n) : (m.n < 0 ? '−' : '') + fh(F(Math.abs(m.n), m.d)); }
  function cx(m) { return mHtml(m) + 'x'; }
  function par(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }

  var gen = {
    sy: function (lvl) {
      var m = M.pick(INT), b = M.nz(-9, 9), swap = lvl >= 2 && Math.random() < 0.6;
      var shown = swap ? 'y = ' + n(b) + ' ' + (m.n < 0 ? '− ' : '+ ') + (Math.abs(m.n) === 1 ? '' : Math.abs(m.n)) + 'x' : eqHtml(m, b);
      return { skill: 'Schnittpunkt mit der y-Achse', level: 1, q: 'Bestimme den Schnittpunkt der Geraden mit der y-Achse. <span class="big-math">' + shown + '</span>',
        inputs: [{ kind: 'num', answer: b, label: 'S<sub>y</sub>(0 | ?)', placeholder: 'y-Koordinate' }],
        hints: ['Auf der y-Achse ist x = 0.', 'Setze x = 0 ein: y = ' + mulText(m) + ' · 0 ' + (b < 0 ? '− ' + n(-b) : '+ ' + n(b)) + '.', 'Das Glied mit x fällt weg. Übrig bleibt die Zahl ohne x.'],
        solution: 'x = 0 einsetzen: y = ' + n(b) + '. Der Schnittpunkt mit der y-Achse ist <b>S<sub>y</sub>(0 | ' + n(b) + ')</b>.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === m.n / m.d) return 'Das ist die Steigung m. Gesucht ist der y-Wert für x = 0.'; if (y === -b) return 'Achte auf das Vorzeichen der Zahl ohne x.'; return null; },
        verify: function () { return M.feq(at(m, b, F(0)), F(b)) || 'Sy falsch'; } };
    },
    nullstelle: function (lvl) {
      var m, b, x0;
      if (lvl === 1) { m = M.pick(INT); x0 = F(M.nz(-6, 6)); b = -m.n * x0.n; }
      else if (lvl === 2) { do { m = F(M.pick([2, 3, 4, -2, -3, -4])); b = M.nz(-9, 9); } while (b % m.n === 0 && Math.random() < 0.6); x0 = M.red(F(-b, m.n)); }
      else { m = M.pick(HALF); var k = M.nz(-4, 4); x0 = F(k * m.d); b = -m.n * k; if (b === 0) return gen.nullstelle(3); }
      var mStr = mulText(m);
      return { skill: 'Nullstelle berechnen', q: 'Berechne die Nullstelle der Funktion. <span class="big-math">' + eqHtml(m, b) + '</span>',
        inputs: [fin(x0, 'x<sub>0</sub> =')],
        hints: ['An der Nullstelle ist y = 0. Setze also ' + eqHtml(m, b).replace('y =', '0 =') + '.', (b > 0 ? 'Ziehe auf beiden Seiten ' + n(b) + ' ab' : 'Addiere auf beiden Seiten ' + n(-b)) + ': ' + cx(m) + ' = ' + n(-b) + '.', 'Teile durch ' + (m.d === 1 ? par(m.n) : mStr) + ': x = ' + n(-b) + ' : ' + (m.d === 1 ? '(' + n(m.n) + ')' : '(' + fh(m) + ')') + '.'],
        solution: '0 = ' + eqHtml(m, b).slice(4) + ' ⇒ ' + cx(m) + ' = ' + n(-b) + ' ⇒ x = <b>' + fr(x0) + '</b>' + (x0.d > 1 ? ' = ' + n(x0.n / x0.d) : '') + '. Die Nullstelle ist N(' + fr(x0) + ' | 0). Probe: ' + mStr + ' · ' + (x0.n < 0 ? '(' + fr(x0) + ')' : fr(x0)) + (b > 0 ? ' + ' + n(b) : ' − ' + n(-b)) + ' = 0.',
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (!f) return null; if (M.feq(f, F(-x0.n, x0.d)) && x0.n !== 0) return 'Achte auf das Vorzeichen: Beim Umstellen wird aus + ' + n(Math.abs(b)) + ' auf der anderen Seite − ' + n(Math.abs(b)) + ' (oder umgekehrt).'; if (b !== 0 && M.feq(f, M.red(F(-m.n, m.d * b)))) return 'Du hast m durch b geteilt. Richtig ist: x = −b : m.'; return null; },
        verify: function () { return isZero(at(m, b, x0)) || 'Probe ≠ 0'; } };
    },
    null_ablesen: function () {
      for (var t = 0; t < 100; t++) {
        var m = M.pick([F(1), F(2), F(-1), F(-2), F(1, 2), F(-1, 2)]), x0 = M.nz(-5, 5), bb = -m.n * x0 / m.d;
        if (Math.abs(bb) > 5 || bb !== Math.round(bb)) continue;
        return { skill: 'Nullstelle ablesen', level: 1, q: 'Lies die Nullstelle der Geraden ab.' + graph([{ m: m, b: bb }], { label: 'Gerade im Koordinatensystem' }),
          inputs: [{ kind: 'num', answer: x0, label: 'x<sub>0</sub> =' }],
          hints: ['Die Nullstelle ist die Stelle, an der die Gerade die x-Achse schneidet.', 'Dort ist y = 0. Suche den Punkt auf der waagerechten Achse.', 'Lies die x-Koordinate dieses Punktes ab.'],
          solution: 'Die Gerade schneidet die x-Achse bei x = ' + n(x0) + '. Die Nullstelle ist <b>x<sub>0</sub> = ' + n(x0) + '</b>, also N(' + n(x0) + ' | 0). Rechnung: ' + eqHtml(m, bb) + '.' + graph([{ m: m, b: bb }], { marks: [{ x: x0, y: 0, text: 'N', color: '#d97706' }] }),
          mistakes: function (v) { var y = M.parseNum(v[0]); if (y === bb && bb !== x0) return 'Das ist der Schnittpunkt mit der y-Achse. Gesucht ist der Schnittpunkt mit der x-Achse.'; return null; },
          verify: function () { return isZero(at(m, bb, F(x0))) || 'N falsch'; } };
      }
      return gen.nullstelle(1);
    },
    schnitt_ablesen: function () {
      for (var t = 0; t < 200; t++) {
        var m1 = M.pick([F(1), F(2), F(-1), F(1, 2), F(-2)]), m2 = M.pick([F(1), F(-1), F(-2), F(-1, 2), F(3), F(0)]);
        if (M.feq(m1, m2)) continue;
        var xs = M.rnd(-3, 3) * 2, ys = M.rnd(-4, 4), b1 = ys - m1.n * xs / m1.d, b2 = ys - m2.n * xs / m2.d;
        if (Math.abs(b1) > 6 || Math.abs(b2) > 6 || b1 !== Math.round(b1) || b2 !== Math.round(b2) || Math.abs(xs) > 5) continue;
        return { skill: 'Schnittpunkt ablesen', level: 1, q: 'Lies den Schnittpunkt S der Geraden g und h ab.' + graph([{ m: m1, b: b1, label: 'g' }, { m: m2, b: b2, label: 'h', labelPos: 'below' }], { label: 'Zwei Geraden g und h' }),
          inputs: [{ kind: 'num', answer: xs, label: 'S(x |', placeholder: 'x' }, { kind: 'num', answer: ys, label: '| y)', placeholder: 'y' }],
          hints: ['Der Schnittpunkt ist der Punkt, an dem sich die beiden Geraden kreuzen.', 'Gehe vom Schnittpunkt senkrecht zur x-Achse und lies x ab.', 'Gehe dann waagerecht zur y-Achse und lies y ab.'],
          solution: 'Die Geraden kreuzen sich in <b>S(' + n(xs) + ' | ' + n(ys) + ')</b>. Probe mit den Gleichungen: g: ' + eqHtml(m1, b1) + ', h: ' + eqHtml(m2, b2) + '. Beide ergeben für x = ' + n(xs) + ' den Wert y = ' + n(ys) + '.',
          mistakes: function (v) { if (M.parseNum(v[0]) === ys && M.parseNum(v[1]) === xs && xs !== ys) return 'Du hast x und y vertauscht. Zuerst kommt die x-Koordinate (rechts/links), dann die y-Koordinate (oben/unten).'; return null; },
          verify: function () { return M.feq(at(m1, b1, F(xs)), at(m2, b2, F(xs))) || 'S falsch'; } };
      }
      return gen.null_ablesen();
    },
    schnitt: function (lvl) {
      for (var t = 0; t < 300; t++) {
        var m1 = F(M.pick([1, 2, 3, -1, -2, 4])), m2 = F(M.pick([-1, -2, -3, 1, 2, 0, 5])); if (M.feq(m1, m2)) continue;
        var b1, b2, X;
        if (lvl <= 2) { X = F(M.rnd(-5, 5)); b1 = M.rnd(-8, 8); var Y = at(m1, b1, X); b2 = Y.n - m2.n * X.n; if (Math.abs(b2) > 12 || b1 === b2) continue; }
        else { b1 = M.rnd(-6, 6); b2 = M.rnd(-6, 6); X = M.red(F(b2 - b1, m1.n - m2.n)); if (X.d === 1 || X.d > 3 || b1 === b2) continue; }
        var Ys = at(m1, b1, X), dm = m1.n - m2.n, db = b2 - b1;
        return { skill: 'Schnittpunkt berechnen (Gleichsetzen)', q: 'Berechne den Schnittpunkt der Geraden g und h.<br><span class="big-math">g: ' + eqHtml(m1, b1) + '</span><br><span class="big-math">h: ' + eqHtml(m2, b2) + '</span>',
          inputs: [fin(X, 'x ='), fin(Ys, 'y =')],
          hints: ['Im Schnittpunkt haben beide Geraden denselben y-Wert. Setze die rechten Seiten gleich.', eqHtml(m1, b1).slice(4) + ' = ' + eqHtml(m2, b2).slice(4) + '. Bringe alle x nach links und alle Zahlen nach rechts: ' + cx(F(dm)) + ' = ' + n(db) + '.', 'x = ' + n(db) + ' : ' + (dm < 0 ? '(' + n(dm) + ')' : n(dm)) + ' = ' + fr(X) + '. Setze x in eine der beiden Gleichungen ein, um y zu berechnen.'],
          solution: eqHtml(m1, b1).slice(4) + ' = ' + eqHtml(m2, b2).slice(4) + ' ⇒ ' + cx(F(dm)) + ' = ' + n(db) + ' ⇒ x = ' + fr(X) + '. In g einsetzen: y = ' + n(m1.n) + ' · ' + (X.n < 0 ? '(' + fr(X) + ')' : fr(X)) + (b1 ? (b1 > 0 ? ' + ' + b1 : ' − ' + (-b1)) : '') + ' = ' + fr(Ys) + '. <b>S(' + fr(X) + ' | ' + fr(Ys) + ')</b>. Probe in h: ' + fr(at(m2, b2, X)) + '. Stimmt.',
          mistakes: function (v) { var a = M.parseFrac(v[0]), c = M.parseFrac(v[1]); if (a && M.feq(a, X) && c && !M.feq(c, Ys)) return 'x ist richtig. Setze x noch einmal sorgfältig in g oder h ein, um y zu berechnen.'; if (a && M.feq(a, F(-X.n, X.d)) && X.n !== 0) return 'Prüfe beim Umstellen die Vorzeichen.'; return null; },
          verify: function () { return M.feq(at(m1, b1, X), at(m2, b2, X)) || 'Schnitt falsch'; } };
      }
      return gen.schnitt(2);
    },
    parallel: function (lvl) {
      var kind = M.rnd(0, lvl >= 3 ? 2 : 1), m = M.nz(-4, 4), b1 = M.rnd(-5, 5), b2, g, h, m2 = m;
      g = eqHtml(F(m), b1);
      if (kind === 0) { do { b2 = M.rnd(-6, 6); } while (b2 === b1); h = eqHtml(F(m), b2); }
      else if (kind === 1) { do { m2 = M.nz(-4, 4); } while (m2 === m); b2 = M.rnd(-5, 5); h = eqHtml(F(m2), b2); }
      else { var c = M.nz(-3, 3); b2 = b1; h = 'y = ' + (m === 1 ? '' : m === -1 ? '−' : n(m)) + '(x ' + (c > 0 ? '+ ' + c : '− ' + (-c)) + ')' + (b1 - m * c ? (b1 - m * c > 0 ? ' + ' + n(b1 - m * c) : ' − ' + n(m * c - b1)) : ''); }
      var opts = ['keinen Schnittpunkt', 'genau einen Schnittpunkt', 'unendlich viele gemeinsame Punkte'];
      return { skill: 'Lage zweier Geraden', level: 2, q: 'Wie viele Schnittpunkte haben die Geraden?<br><span class="big-math">g: ' + g + '</span><br><span class="big-math">h: ' + h + '</span>',
        inputs: [{ kind: 'mc', label: 'g und h haben …', options: opts, answer: kind === 0 ? 0 : kind === 1 ? 1 : 2 }],
        hints: ['Vergleiche die Steigungen. Bringe die Gleichungen dazu, falls nötig, in die Form y = mx + b.', 'Verschiedene Steigungen: Die Geraden kreuzen sich genau einmal.', 'Gleiche Steigung: Die Geraden sind parallel. Sind auch die y-Achsenabschnitte gleich, sind es dieselben Geraden.'],
        solution: kind === 0 ? 'Gleiche Steigung m = ' + n(m) + ', aber verschiedene y-Achsenabschnitte. Die Geraden sind <b>parallel</b> und haben <b>keinen Schnittpunkt</b>.' : kind === 1 ? 'Die Steigungen ' + n(m) + ' und ' + n(m2) + ' sind verschieden. Die Geraden haben <b>genau einen Schnittpunkt</b>.' : 'Ausmultipliziert ist h: ' + eqHtml(F(m), b1) + '. Das ist dieselbe Gerade wie g. Sie haben <b>unendlich viele gemeinsame Punkte</b>.',
        verify: function () { if (kind !== 2) return true; var t = M.parseTerm(h.slice(4).replace(/−/g, '-').replace(/(\d)\(/, '$1*(')); return Math.abs(M.evalTree(t, { x: 2.3 }) - (m * 2.3 + b1)) < 1e-9 || 'gleiche Gerade falsch'; } };
    },
    achsen: function () {
      var m = F(M.pick([2, 3, 4, -2, -3, -4, 5])), b = M.nz(-9, 9), x0 = M.red(F(-b, m.n));
      return { skill: 'Schnittpunkte mit beiden Achsen', level: 2, q: 'Bestimme die Schnittpunkte der Geraden mit beiden Koordinatenachsen. <span class="big-math">' + eqHtml(m, b) + '</span>',
        inputs: [{ kind: 'num', answer: b, label: 'S<sub>y</sub>(0 | ?)', placeholder: 'y' }, fin(x0, 'N(? | 0)')],
        hints: ['Schnittpunkt mit der y-Achse: Setze x = 0. Nullstelle (Schnittpunkt mit der x-Achse): Setze y = 0.', 'x = 0: y = ' + n(b) + '. Also S<sub>y</sub>(0 | ' + n(b) + ').', 'y = 0: ' + n(m.n) + 'x ' + (b > 0 ? '+ ' + b : '− ' + (-b)) + ' = 0. Stelle nach x um.'],
        solution: 'S<sub>y</sub>(0 | ' + n(b) + '). Nullstelle: ' + n(m.n) + 'x = ' + n(-b) + ' ⇒ x = ' + fr(x0) + ', also <b>N(' + fr(x0) + ' | 0)</b>.',
        mistakes: function (v) { var f = M.parseFrac(v[1]); if (f && M.feq(f, F(b, m.n)) && b !== 0) return 'Bei der Nullstelle: Achte auf das Vorzeichen. Aus ' + n(m.n) + 'x ' + (b > 0 ? '+ ' : '− ') + Math.abs(b) + ' = 0 folgt ' + n(m.n) + 'x = ' + n(-b) + '.'; return null; },
        verify: function () { return isZero(at(m, b, x0)) || 'N falsch'; } };
    },
    sachnull: function () {
      var c = M.rnd(0, 2), y0, r, unitX, txt, ask, res;
      if (c === 0) { do { r = M.pick([8, 10, 12, 15, 20, 25]); res = M.rnd(8, 30); y0 = r * res; } while (y0 > 600); txt = 'Ein Wassertank enthält ' + y0 + ' Liter. Pro Minute fließen ' + r + ' Liter ab. Die Wassermenge y (in l) nach x Minuten ist y = −' + r + 'x + ' + y0 + '.'; ask = 'Nach wie vielen Minuten ist der Tank leer?'; unitX = 'min'; }
      else if (c === 1) { r = M.pick([1.5, 2, 2.5, 3]); res = M.pick([6, 8, 10, 12]); y0 = r * res; txt = 'Eine Kerze ist ' + n(y0) + ' cm hoch und brennt pro Stunde ' + n(r) + ' cm ab. Ihre Höhe y (in cm) nach x Stunden ist y = −' + n(r) + 'x + ' + n(y0) + '.'; ask = 'Nach wie vielen Stunden ist die Kerze abgebrannt?'; unitX = 'h'; }
      else { r = M.pick([5, 8, 10, 12.5, 20]); res = 100 / r; y0 = 100; txt = 'Ein Handy-Akku ist voll geladen (100 %). Beim Spielen verliert er ' + n(r) + ' % pro Stunde. Der Ladestand y (in %) nach x Stunden ist y = −' + n(r) + 'x + 100.'; ask = 'Nach wie vielen Stunden ist der Akku leer?'; unitX = 'h'; }
      return { skill: 'Nullstelle im Sachzusammenhang', level: 2, q: txt + '<br><b>' + ask + '</b>',
        inputs: [{ kind: 'num', answer: res, label: 'x =', unit: unitX }],
        hints: ['„Leer“ oder „abgebrannt“ heißt: y = 0. Gesucht ist also die Nullstelle.', '0 = −' + n(r) + 'x + ' + n(y0) + ' ⇒ ' + n(r) + 'x = ' + n(y0) + '.', 'x = ' + n(y0) + ' : ' + n(r) + '.'],
        solution: '0 = −' + n(r) + 'x + ' + n(y0) + ' ⇒ ' + n(r) + 'x = ' + n(y0) + ' ⇒ x = ' + n(y0) + ' : ' + n(r) + ' = <b>' + n(res) + ' ' + unitX + '</b>.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === y0) return 'Das ist der Startwert bei x = 0. Gesucht ist das x, bei dem y = 0 ist.'; return null; },
        verify: function () { return Math.abs(-r * res + y0) < 1e-9 || 'Probe falsch'; } };
    },
    durch_nullstelle: function () {
      for (var t = 0; t < 200; t++) {
        var m = M.pick([F(1), F(2), F(-1), F(-2), F(3), F(1, 2), F(-1, 2), F(3, 2)]), x0 = M.nz(-4, 4), xp = M.rnd(-4, 5);
        if (xp === x0 || (xp - x0) % m.d) continue;
        var yp = m.n * (xp - x0) / m.d, b = -m.n * x0 / m.d; if (b !== Math.round(b) || Math.abs(yp) > 9) continue;
        return { skill: 'Gerade aus Nullstelle und Punkt', level: 3, q: 'Eine Gerade hat die Nullstelle x<sub>0</sub> = ' + n(x0) + ' und geht durch den Punkt P(' + n(xp) + ' | ' + n(yp) + ').<br>a) Bestimme ihre Funktionsgleichung.<br>b) Wo schneidet sie die y-Achse?',
          inputs: [{ kind: 'term', answer: eqStr(m, b), label: 'a) y =', placeholder: 'z. B. 2x − 4' }, { kind: 'num', answer: b, label: 'b) S<sub>y</sub>(0 | ?)' }],
          src: '(' + yp + '-0)/(' + xp + '-(' + x0 + '))*(x-(' + x0 + '))',
          hints: ['Die Nullstelle liefert einen zweiten Punkt: N(' + n(x0) + ' | 0).', 'Steigung aus N und P: m = (' + n(yp) + ' − 0) : (' + n(xp) + ' − (' + n(x0) + ')) = ' + fr(m) + '.', 'Setze N in y = ' + cx(m) + ' + b ein: 0 = ' + mulText(m) + ' · ' + par(x0) + ' + b. Löse nach b auf.'],
          solution: 'N(' + n(x0) + ' | 0) und P(' + n(xp) + ' | ' + n(yp) + '): m = ' + n(yp) + ' : ' + par(xp - x0) + ' = ' + fr(m) + '. 0 = ' + mulText(m) + ' · ' + par(x0) + ' + b ⇒ b = ' + n(b) + '. Gleichung: <b>' + eqHtml(m, b) + '</b>, Schnittpunkt mit der y-Achse <b>S<sub>y</sub>(0 | ' + n(b) + ')</b>.',
          verify: function () { return isZero(at(m, b, F(x0))) && M.feq(at(m, b, F(xp)), F(yp)) || 'Punkte liegen nicht auf der Geraden'; } };
      }
      return gen.schnitt(2);
    }
  };
  var HS = [{ m: F(1), b: -1, t: 'y = x − 1' }, { m: F(-1), b: 2, t: 'y = −x + 2' }, { m: F(1, 2), b: 1, t: 'y = 0,5x + 1' }, { m: F(-2), b: -3, t: 'y = −2x − 3' }];

  return {
    id: '012', title: 'Nullstellen und Schnittpunkte', bereich: 'Funktionaler Zusammenhang', minutes: '45 bis 60',
    vorkenntnisse: 'Lineare Funktionen y = mx + b (Modul 011), einfache Gleichungen lösen',
    lead: 'Wann ist der Tank leer? Wann sind zwei Tarife gleich teuer? Du berechnest, wo Geraden die Achsen und einander schneiden.',
    einstieg: { html: '<p>Ein Wassertank enthält <b>240 Liter</b>. Pro Minute fließen <b>15 Liter</b> ab. Gleichzeitig wird ein zweiter, leerer Tank mit <b>25 Litern</b> pro Minute befüllt.</p><p class="note">Nach wie vielen Minuten ist der erste Tank leer? Und wann enthalten beide Tanks gleich viel Wasser?</p><p>Im Graphen sind das besondere Punkte: Der erste Tank ist leer, wo seine Gerade die x-Achse trifft (<b>Nullstelle</b>). Gleich viel Wasser ist dort, wo sich die beiden Geraden kreuzen (<b>Schnittpunkt</b>).</p>' },
    ziele: ['Ich bestimme den Schnittpunkt einer Geraden mit der y-Achse.', 'Ich berechne die Nullstelle einer linearen Funktion, indem ich y = 0 setze.', 'Ich lese Nullstellen und Schnittpunkte am Graphen ab.', 'Ich berechne den Schnittpunkt zweier Geraden durch Gleichsetzen und mache die Probe.', 'Ich erkenne, ob zwei Geraden keinen, einen oder unendlich viele gemeinsame Punkte haben.'],
    fachwoerter: [['Nullstelle', 'Die x-Stelle, an der der Graph die x-Achse schneidet. Dort ist y = 0. Punkt N(x<sub>0</sub> | 0).'], ['Schnittpunkt mit der y-Achse', 'Der Punkt S<sub>y</sub>(0 | b). Dort ist x = 0.'], ['Schnittpunkt zweier Geraden', 'Der Punkt, der auf beiden Geraden liegt. Beide Gleichungen liefern dort denselben y-Wert.'], ['Gleichsetzen', 'Die rechten Seiten zweier Gleichungen y = … gleichsetzen, um den gemeinsamen Punkt zu finden.'], ['Parallele Geraden', 'Geraden mit gleicher Steigung. Sie schneiden sich nie (oder sind gleich).']],
    diagnose: [
      { q: 'Löse die Gleichung 3x + 6 = 0.', options: ['x = −2', 'x = 2', 'x = −18', 'Weiß ich noch nicht'], answer: 0, why: '3x = −6, also x = −2.', review: 'Lineare Gleichungen lösen (Klasse 7)' },
      { q: 'Was ist bei der Funktion y = 2x − 5 die Steigung m?', options: ['2', '−5', '5', 'Weiß ich noch nicht'], answer: 0, why: 'Die Zahl vor dem x ist die Steigung.', review: 'Steigung und y-Achsenabschnitt (Modul 011)' },
      { q: 'Welchen y-Wert hat y = −x + 4 an der Stelle x = 6?', options: ['−2', '10', '2', 'Weiß ich noch nicht'], answer: 0, why: '−6 + 4 = −2.', review: 'Funktionswerte berechnen' },
      { q: 'Löse 2x + 1 = 5x − 8.', options: ['x = 3', 'x = −3', 'x = 7', 'Weiß ich noch nicht'], answer: 0, why: '1 + 8 = 5x − 2x, also 9 = 3x und x = 3.', review: 'Gleichungen mit x auf beiden Seiten' }],
    erklaerung:
      '<h3>1. Schnittpunkt mit der y-Achse</h3><p>Auf der y-Achse ist <b>x = 0</b>. Setzt du x = 0 in y = mx + b ein, bleibt y = b. Der Schnittpunkt ist <b>S<sub>y</sub>(0 | b)</b>.</p>' +
      '<h3>2. Nullstelle</h3><p>Auf der x-Achse ist <b>y = 0</b>. Du setzt die Gleichung gleich null und löst nach x auf.</p>' +
      '<div class="merk"><b>Merke:</b> Nullstelle von y = mx + b: Setze <b>0 = mx + b</b> und löse nach x auf: <span class="big-math">x<sub>0</sub> = −b : m</span> (für m ≠ 0).<br>Schnittpunkt zweier Geraden: <b>Gleichsetzen</b>, nach x auflösen, x einsetzen, y berechnen, Probe machen.</div>' +
      '<p><b>Beispiel:</b> y = 2x − 3. 0 = 2x − 3 ⇒ 2x = 3 ⇒ x = 1,5. Nullstelle N(1,5 | 0).</p>' +
      graph([{ m: F(2), b: -3, label: 'y = 2x − 3', labelPos: 'below' }], { r: 5, marks: [{ x: 1.5, y: 0, text: 'N(1,5 | 0)', color: '#d97706', dx: -6, dy: -8, anchor: 'end' }, { x: 0, y: -3, text: 'S<tspan baseline-shift="sub" font-size="9">y</tspan>(0 | −3)', color: '#0f766e', dx: 9, dy: 5 }], label: 'Nullstelle und y-Achsenabschnitt' }) +
      '<h3>3. Schnittpunkt zweier Geraden</h3><p>g: y = 2x − 1 und h: y = −x + 5. Im Schnittpunkt sind beide y-Werte gleich:</p><p class="big-math">2x − 1 = −x + 5 ⇒ 3x = 6 ⇒ x = 2</p><p>Einsetzen in g: y = 2 · 2 − 1 = 3. Probe in h: −2 + 5 = 3. ✓ Der Schnittpunkt ist <b>S(2 | 3)</b>.</p>' +
      graph([{ m: F(2), b: -1, label: 'g' }, { m: F(-1), b: 5, label: 'h', labelPos: 'below' }], { r: 5, marks: [{ x: 2, y: 3, text: 'S(2 | 3)', dx: 10, dy: 4 }], label: 'Schnittpunkt zweier Geraden' }) +
      '<p class="note">Haben zwei Geraden dieselbe Steigung, sind sie <b>parallel</b>: kein Schnittpunkt. Stimmt auch b überein, sind es dieselben Geraden. Brüche gibst du so ein: 3/2 oder 1,5.</p>',
    entdecken: {
      html: '<p>Verändere die Gerade g mit m und b und wähle eine zweite Gerade h. Beobachte die Nullstelle N und den Schnittpunkt S.</p><div class="ctl"><label>m = <b id="v_m"></b> <input type="range" id="r_m" min="-3" max="3" step="0.5" value="1"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="-4" max="4" step="1" value="1"></label><label>h: <select id="e_h"><option value="-1">keine</option>' + HS.map(function (h, i) { return '<option value="' + i + '">' + h.t + '</option>'; }).join('') + '</select></label></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var mv = +root.querySelector('#r_m').value, b = +root.querySelector('#r_b').value, hi = +root.querySelector('#e_h').value, m = M.red(F(Math.round(mv * 2), 2));
          root.querySelector('#v_m').textContent = n(mv); root.querySelector('#v_b').textContent = n(b);
          var lines = [{ m: m, b: b, label: 'g' }], marks = [{ x: 0, y: b, color: '#0f766e' }], txt = '<p><b>g: ' + eqHtml(m, b) + '</b></p>';
          if (m.n === 0) txt += '<p>m = 0: Die Gerade ist waagerecht. ' + (b === 0 ? 'Sie liegt auf der x-Achse.' : 'Sie hat <b>keine Nullstelle</b>.') + '</p>';
          else { var x0 = M.red(F(-b * m.d, m.n)); txt += '<p>Nullstelle: 0 = ' + eqHtml(m, b).slice(4) + ' ⇒ x<sub>0</sub> = ' + fr(x0) + (x0.d > 1 ? ' ≈ ' + n(Math.round(x0.n / x0.d * 100) / 100) : '') + '</p>'; if (Math.abs(x0.n / x0.d) <= 6) marks.push({ x: x0.n / x0.d, y: 0, text: 'N', color: '#d97706', dy: 16 }); }
          if (hi >= 0) {
            var H = HS[hi]; lines.push({ m: H.m, b: H.b, label: 'h', labelPos: 'below' });
            if (M.feq(H.m, m)) txt += '<p>g und h haben dieselbe Steigung: ' + (H.b === b ? 'Sie sind <b>gleich</b>.' : 'Sie sind <b>parallel</b>, kein Schnittpunkt.') + '</p>';
            else { var X = M.fdiv(F(H.b - b), M.fadd(m, F(-H.m.n, H.m.d))); var Y = at(m, b, X);
              txt += '<p>Gleichsetzen: ' + eqHtml(m, b).slice(4) + ' = ' + H.t.slice(4) + ' ⇒ <b>S(' + fr(X) + ' | ' + fr(Y) + ')</b></p>';
              if (Math.abs(X.n / X.d) <= 6 && Math.abs(Y.n / Y.d) <= 6) marks.push({ x: X.n / X.d, y: Y.n / Y.d, text: 'S', color: '#1c1830' }); }
          }
          root.querySelector('#e_g').innerHTML = graph(lines, { marks: marks, label: 'Geraden mit Nullstelle und Schnittpunkt' });
          root.querySelector('#e_txt').innerHTML = txt;
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Die Nullstelle liegt immer bei x = −b : m. Bei gleicher Steigung gibt es keinen Schnittpunkt, sonst genau einen.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_h').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Wann sind beide Tanks gleich voll?', q: 'Tank 1: y = −15x + 240. Tank 2: y = 25x (x in Minuten, y in Litern). Wann ist Tank 1 leer? Wann enthalten beide Tanks gleich viel Wasser?',
      steps: ['Nullstelle von Tank 1: 0 = −15x + 240 ⇒ 15x = 240 ⇒ x = 16. Nach 16 Minuten ist Tank 1 leer.', 'Schnittpunkt: gleichsetzen: −15x + 240 = 25x.', 'Alle x auf eine Seite: 240 = 40x ⇒ x = 6.', 'y-Wert: y = 25 · 6 = 150. Nach 6 Minuten sind in beiden Tanks <b>150 Liter</b>. S(6 | 150).', 'Probe in Tank 1: −15 · 6 + 240 = −90 + 240 = 150. ✓'] },
    tasks: { gen: gen, plan: { G: ['sy:1', 'null_ablesen:1', 'nullstelle:1', 'schnitt_ablesen:1'], S: ['sy:2', 'nullstelle:2', 'achsen:2', 'schnitt:2', 'parallel:2'], E: ['nullstelle:3', 'achsen:2', 'schnitt:2', 'schnitt:3', 'parallel:3', 'sachnull:2'] },
      extra: 'durch_nullstelle', test: ['sy:1', 'nullstelle:2', 'null_ablesen:1', 'schnitt_ablesen:1', 'schnitt:2', 'sachnull:2'] },
    lerncheck: ['Ich bestimme den Schnittpunkt mit der y-Achse.', 'Ich berechne Nullstellen linearer Funktionen.', 'Ich berechne den Schnittpunkt zweier Geraden durch Gleichsetzen.', 'Ich erkenne parallele Geraden an der Steigung.']
  };
})();
