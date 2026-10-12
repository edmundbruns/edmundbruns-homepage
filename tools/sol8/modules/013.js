/* Modul 013 · Geraden zeichnen */
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
  function fv(f) { return f.n / f.d; }
  function mHtml(m) { if (m.d === 1) return m.n === 1 ? '' : m.n === -1 ? '−' : n(m.n); return (m.n < 0 ? '−' : '') + fh(F(Math.abs(m.n), m.d)); }
  function bPart(b) { b = typeof b === 'number' ? F(b) : M.red(b); if (b.n === 0) return ''; return (b.n > 0 ? ' + ' : ' − ') + fh(F(Math.abs(b.n), b.d)); }
  function eqHtml(m, b) { var bb = typeof b === 'number' ? F(b) : M.red(b); if (m.n === 0) return 'y = ' + fh(bb); return 'y = ' + mHtml(m) + 'x' + bPart(bb); }
  function eqStr(m, b) { var bb = typeof b === 'number' ? F(b) : b; return '(' + m.n + '/' + m.d + ')*x+(' + bb.n + '/' + bb.d + ')'; }
  function mt(m) { return m.d === 1 ? (m.n < 0 ? '(' + n(m.n) + ')' : n(m.n)) : (m.n < 0 ? '(−' + fh(F(-m.n, m.d)) + ')' : fh(m)); }
  function par(x) { return x < 0 ? '(' + n(x) + ')' : n(x); }
  function yAt(m, b, x) { return m.n * x / m.d + b; }
  var EASY = [F(1), F(2), F(3), F(-1), F(-2), F(-3)];
  var ALL = EASY.concat([F(1, 2), F(-1, 2), F(1, 3), F(-1, 3), F(2, 3), F(-2, 3), F(3, 2), F(-3, 2), F(3, 4), F(-3, 4)]);
  function key(m, b) { return M.red(m).n + '/' + M.red(m).d + '|' + b; }
  function stepText(m) { return 'gehe ' + m.d + ' nach rechts und ' + Math.abs(m.n) + (m.n > 0 ? ' nach oben' : ' nach unten'); }

  var gen = {
    welcher_graph: function (lvl) {
      var m = M.pick(lvl === 1 ? EASY : ALL), b = M.rnd(-3, 3);
      var cand = [[F(-m.n, m.d), b], [m, b === 0 ? 2 : -b], [F(m.d * (m.n < 0 ? -1 : 1), Math.abs(m.n)), b], [m, b + (b >= 2 ? -2 : 2)], [F(-m.d * (m.n < 0 ? -1 : 1), Math.abs(m.n)), -b], [m, b - 1], [F(2 * m.n, m.d), b], [F(-m.n, m.d), b + 1]];
      var seen = {}, wrong = []; seen[key(m, b)] = 1;
      cand.forEach(function (c) { var k = key(c[0], c[1]); if (wrong.length < 3 && !seen[k]) { seen[k] = 1; wrong.push(c); } });
      var all = M.shuffle([[m, b, true]].concat(wrong.map(function (c) { return [c[0], c[1], false]; })));
      var opts = all.map(function (c, i) { return graph([{ m: c[0], b: c[1] }], { r: 5, w: 170, maxw: 200, cap: 'ABCD'[i], label: 'Graph ' + 'ABCD'[i] }); });
      return { skill: 'Passenden Graphen auswählen', q: 'Welcher Graph gehört zu <span class="big-math">' + eqHtml(m, b) + '</span>?',
        inputs: [{ kind: 'mc', label: 'Wähle den passenden Graphen', options: opts, answer: all.findIndex(function (c) { return c[2]; }) }],
        hints: ['Schau zuerst auf b = ' + n(b) + ': Der Graph muss die y-Achse im Punkt (0 | ' + n(b) + ') schneiden.', 'Prüfe dann die Steigung: ' + (m.n > 0 ? 'Die Gerade muss steigen.' : 'Die Gerade muss fallen.'), 'Von (0 | ' + n(b) + ') aus: ' + stepText(m) + '. Dort muss die Gerade wieder durch einen Gitterpunkt gehen.'],
        solution: 'Der Graph ' + 'ABCD'[all.findIndex(function (c) { return c[2]; })] + ' schneidet die y-Achse bei ' + n(b) + ' und hat die Steigung ' + fh(m) + ': Von (0 | ' + n(b) + ') aus ' + stepText(m) + '.' + graph([{ m: m, b: b, tri: [0], pts: [[0, b]] }], { r: 5 }),
        verify: function () { return Math.abs(yAt(m, b, 0) - b) < 1e-9 && wrong.length === 3 || 'zu wenig Ablenker'; } };
    },
    wertetabelle: function (lvl) {
      var m = M.pick(lvl === 1 ? EASY : [F(1, 2), F(-1, 2), F(3, 2), F(-3, 2), F(2), F(-3)]), b = M.rnd(-4, 4);
      var xs = m.d === 2 ? [-4, -2, 0, 2, 4] : [-2, -1, 0, 1, 2], ask = M.shuffle([0, 1, 2, 3, 4]).slice(0, 3).sort(), ys = xs.map(function (x) { return yAt(m, b, x); });
      var tab = '<table class="tab"><tr><th>x</th>' + xs.map(function (x) { return '<td>' + n(x) + '</td>'; }).join('') + '</tr><tr><th>y</th>' + ys.map(function (y, i) { return '<td>' + (ask.indexOf(i) >= 0 ? '?' : n(y)) + '</td>'; }).join('') + '</tr></table>';
      var k = ask[0];
      return { skill: 'Wertetabelle ergänzen', q: 'Ergänze die Wertetabelle für <span class="big-math">' + eqHtml(m, b) + '</span>. Mit der Tabelle kannst du die Gerade dann zeichnen.' + tab,
        inputs: ask.map(function (i) { return { kind: 'num', answer: ys[i], label: 'y bei x = ' + n(xs[i]) }; }),
        hints: ['Setze jeden x-Wert in die Gleichung ein.', 'Beispiel für x = ' + n(xs[k]) + ': y = ' + mt(m) + ' · ' + par(xs[k]) + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '') + ' = ' + n(ys[k]) + '.', 'Kontrolle: Von Spalte zu Spalte ändert sich y immer um ' + n(ys[1] - ys[0]) + '.'],
        solution: xs.map(function (x, i) { return 'x = ' + n(x) + ': y = ' + n(ys[i]); }).join('; ') + '.' + graph([{ m: m, b: b, pts: xs.map(function (x, i) { return [x, ys[i]]; }).filter(function (p) { return Math.abs(p[1]) <= 6; }) }], {}),
        verify: function () { return ys.every(function (y, i) { return i === 0 || Math.abs(y - ys[i - 1] - (ys[1] - ys[0])) < 1e-9; }) || 'nicht linear'; } };
    },
    punkt_auf: function (lvl) {
      var m = M.pick(lvl === 1 ? EASY : ALL), b = M.rnd(-4, 4), x = M.rnd(-3, 4) * m.d, y = yAt(m, b, x);
      var seen = {}, opts = [[x, y]]; seen[x + '|' + y] = 1;
      [[x, y + 1], [y, x], [x + 1, y], [-x, y], [x, -y], [x, y - 2], [x + m.d, y - m.n]].forEach(function (p) { var k = p[0] + '|' + p[1]; if (opts.length < 4 && !seen[k] && Math.abs(yAt(m, b, p[0]) - p[1]) > 1e-9) { seen[k] = 1; opts.push(p); } });
      var sh = M.shuffle(opts);
      return { skill: 'Punkt auf der Geraden finden', level: 1, q: 'Welcher Punkt liegt auf der Geraden <span class="big-math">' + eqHtml(m, b) + '</span>?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: sh.map(function (p) { return 'P(' + n(p[0]) + ' | ' + n(p[1]) + ')'; }), answer: sh.findIndex(function (p) { return p[0] === x && p[1] === y; }) }],
        hints: ['Setze die x-Koordinate jedes Punktes in die Gleichung ein.', 'Stimmt das Ergebnis mit der y-Koordinate überein, liegt der Punkt auf der Geraden.', 'Probiere zum Beispiel x = ' + n(x) + ': y = ' + mt(m) + ' · ' + par(x) + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '') + ' = ' + n(y) + '.'],
        solution: 'Für x = ' + n(x) + ' ergibt sich y = ' + n(y) + '. Also liegt <b>P(' + n(x) + ' | ' + n(y) + ')</b> auf der Geraden. Bei den anderen Punkten passt der y-Wert nicht.',
        verify: function () { return opts.length === 4 && opts.filter(function (p) { return Math.abs(yAt(m, b, p[0]) - p[1]) < 1e-9; }).length === 1 || 'nicht eindeutig'; } };
    },
    steigungsdreieck: function (lvl) {
      var m = M.pick(lvl === 1 ? EASY : ALL.slice(6)), b = M.rnd(-3, 3);
      return { skill: 'Steigungsdreieck zum Zeichnen', q: 'Du zeichnest die Gerade <span class="big-math">' + eqHtml(m, b) + '</span>. Du startest im Punkt (0 | ' + n(b) + '). Wie gehst du mit dem Steigungsdreieck zum nächsten Gitterpunkt der Geraden? Gehe dabei so wenig wie möglich nach rechts.',
        inputs: [{ kind: 'num', answer: m.d, label: 'nach rechts' }, { kind: 'num', answer: m.n, label: 'nach oben (+) oder unten (−)' }],
        hints: ['Die Steigung ist m = ' + fh(m) + '. Schreibe sie als Bruch: ' + (m.d === 1 ? n(m.n) + ' = <span class="frac"><span>' + n(m.n) + '</span><span>1</span></span>' : fh(m)) + '.', 'Der Nenner sagt, wie weit du nach rechts gehst. Der Zähler sagt, wie weit nach oben (positiv) oder unten (negativ).', 'Nach rechts: ' + m.d + '. Nach oben oder unten: ' + n(m.n) + '.'],
        solution: 'm = ' + fh(m) + (m.d === 1 ? ' = <span class="frac"><span>' + n(m.n) + '</span><span>1</span></span>' : '') + ': <b>' + m.d + ' nach rechts</b> und <b>' + Math.abs(m.n) + (m.n > 0 ? ' nach oben' : ' nach unten') + '</b> (Eingabe ' + n(m.n) + '). Du kommst zum Punkt (' + m.d + ' | ' + n(b + m.n) + ').' + graph([{ m: m, b: b, tri: [0], pts: [[0, b], [m.d, b + m.n]] }], { r: 5 }),
        mistakes: function (v) { var r = M.parseNum(v[0]), u = M.parseNum(v[1]); if (r === Math.abs(m.n) && u === m.d * (m.n < 0 ? -1 : 1) && m.d !== Math.abs(m.n)) return 'Du hast rechts und oben vertauscht. Der Nenner gibt die Schritte nach rechts an, der Zähler die nach oben oder unten.'; if (r === m.d && u === -m.n) return 'Achte auf das Vorzeichen: Bei negativer Steigung geht es nach unten, also eine negative Zahl.'; return null; },
        verify: function () { return Math.abs(yAt(m, b, m.d) - (b + m.n)) < 1e-9 || 'Dreieck falsch'; } };
    },
    punkt_finden: function (lvl) {
      var m = M.pick(lvl === 3 ? [F(2), F(3), F(-2), F(1, 2), F(-1, 2), F(4)] : EASY.concat([F(4), F(-4)])), b = M.rnd(-6, 6);
      if (lvl < 3) { var x = M.rnd(-5, 6), y = yAt(m, b, x);
        return { skill: 'Fehlende Koordinate berechnen', q: 'Der Punkt P(' + n(x) + ' | ?) liegt auf der Geraden <span class="big-math">' + eqHtml(m, b) + '</span>. Berechne die y-Koordinate.',
          inputs: [{ kind: 'num', answer: y, label: 'y =' }],
          hints: ['Setze x = ' + n(x) + ' in die Gleichung ein.', 'y = ' + mt(m) + ' · ' + par(x) + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '') + '.', 'Rechne zuerst das Produkt aus, dann ' + (b >= 0 ? 'addiere ' + b : 'subtrahiere ' + (-b)) + '.'],
          solution: 'y = ' + mt(m) + ' · ' + par(x) + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '') + ' = <b>' + n(y) + '</b>. Also P(' + n(x) + ' | ' + n(y) + ').',
          verify: function () { return Math.abs(fv(m) * x + b - y) < 1e-9 || 'Probe'; } };
      }
      var Y = M.rnd(-8, 8), X = M.red(M.fdiv(F(Y - b), m));
      return { skill: 'Fehlende Koordinate berechnen', level: 3, q: 'Der Punkt Q(? | ' + n(Y) + ') liegt auf der Geraden <span class="big-math">' + eqHtml(m, b) + '</span>. Berechne die x-Koordinate.',
        inputs: [{ kind: 'frac', answer: X, label: 'x =', placeholder: 'z. B. 3 oder 5/2' }],
        hints: ['Setze y = ' + n(Y) + ' ein: ' + n(Y) + ' = ' + eqHtml(m, b).slice(4) + '.', (b >= 0 ? 'Ziehe ' + b + ' ab' : 'Addiere ' + (-b)) + ': ' + n(Y - b) + ' = ' + mHtml(m) + 'x.', 'Teile durch ' + mt(m) + '.'],
        solution: n(Y) + ' = ' + eqHtml(m, b).slice(4) + ' ⇒ ' + n(Y - b) + ' = ' + mHtml(m) + 'x ⇒ x = <b>' + fh(X) + '</b>' + (X.d > 1 ? ' = ' + n(fv(X)) : '') + '.',
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, M.fdiv(F(Y + b), m)) && b !== 0) return 'Prüfe das Vorzeichen, wenn du ' + Math.abs(b) + ' auf die andere Seite bringst.'; return null; },
        verify: function () { return Math.abs(fv(m) * fv(X) + b - Y) < 1e-9 || 'Probe falsch'; } };
    },
    zeichnen_schritte: function () {
      var m = M.pick(ALL.slice(6)), b = M.nz(-3, 3);
      var right = 'Starte bei (0 | ' + n(b) + '). Gehe ' + m.d + ' nach rechts und ' + Math.abs(m.n) + (m.n > 0 ? ' nach oben.' : ' nach unten.');
      var w = ['Starte bei (0 | ' + n(b) + '). Gehe ' + Math.abs(m.n) + ' nach rechts und ' + m.d + (m.n > 0 ? ' nach oben.' : ' nach unten.'),
        'Starte bei (' + n(b) + ' | 0). Gehe ' + m.d + ' nach rechts und ' + Math.abs(m.n) + (m.n > 0 ? ' nach oben.' : ' nach unten.'),
        'Starte bei (0 | ' + n(b) + '). Gehe ' + m.d + ' nach rechts und ' + Math.abs(m.n) + (m.n > 0 ? ' nach unten.' : ' nach oben.'),
        'Starte bei (0 | ' + n(-b) + '). Gehe ' + m.d + ' nach rechts und ' + Math.abs(m.n) + (m.n > 0 ? ' nach oben.' : ' nach unten.')];
      var opts = M.shuffle([right].concat(w.filter(function (x) { return x !== right; }).slice(0, 3)));
      return { skill: 'Zeichenschritte angeben', level: 2, q: 'Wie zeichnest du die Gerade <span class="big-math">' + eqHtml(m, b) + '</span> richtig?',
        inputs: [{ kind: 'mc', label: 'Wähle die richtige Anleitung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Der Startpunkt liegt auf der y-Achse bei b. Seine x-Koordinate ist 0.', 'Die Steigung ' + fh(m) + ': Nenner = Schritte nach rechts, Zähler = Schritte nach oben (+) oder unten (−).', 'Hier: Start bei (0 | ' + n(b) + '), dann ' + stepText(m) + '.'],
        solution: right + ' Verbinde beide Punkte mit dem Lineal und verlängere die Gerade.' + graph([{ m: m, b: b, tri: [0], pts: [[0, b]] }], { r: 5 }),
        verify: function () { return new Set(opts).size === 4 || 'Optionen doppelt'; } };
    },
    fehler_finden: function () {
      for (var t = 0; t < 100; t++) {
        var m = M.pick([F(2), F(3), F(-2), F(-3), F(1, 2), F(-1, 2), F(2, 3), F(-2, 3), F(3, 2), F(-3, 2)]), b = M.nz(-3, 3), err = M.rnd(0, 3), dm = m, db = b;
        if (err === 0) dm = F(-m.n, m.d); else if (err === 1) db = -b; else if (err === 2) dm = F(m.d * (m.n < 0 ? -1 : 1), Math.abs(m.n));
        var opts = ['Die Steigung hat das falsche Vorzeichen.', 'Der y-Achsenabschnitt ist falsch.', 'Rechts und oben (bzw. unten) wurden vertauscht.', 'Der Graph ist richtig gezeichnet.'];
        return { skill: 'Fehler beim Zeichnen finden', level: 3, q: 'Jonas soll die Gerade <span class="big-math">' + eqHtml(m, b) + '</span> zeichnen. Das ist seine Zeichnung. Was stimmt?' + graph([{ m: dm, b: db, pts: [[0, db]] }], { r: 5, label: 'Zeichnung von Jonas' }),
          inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: err }],
          hints: ['Prüfe zuerst den Schnittpunkt mit der y-Achse. Er muss bei ' + n(b) + ' liegen.', 'Prüfe dann, ob die Gerade ' + (m.n > 0 ? 'steigt' : 'fällt') + '.', 'Prüfe zuletzt das Steigungsdreieck: Von (0 | ' + n(db) + ') aus ' + stepText(m) + '.'],
          solution: ['Die gezeichnete Gerade ' + (m.n > 0 ? 'fällt' : 'steigt') + ', sie müsste aber ' + (m.n > 0 ? 'steigen' : 'fallen') + '. <b>Das Vorzeichen der Steigung ist falsch.</b>', 'Die Gerade schneidet die y-Achse bei ' + n(db) + ' statt bei ' + n(b) + '. <b>Der y-Achsenabschnitt ist falsch.</b>', 'Jonas ist ' + Math.abs(m.n) + ' nach rechts und ' + m.d + ' nach ' + (m.n > 0 ? 'oben' : 'unten') + ' gegangen. <b>Rechts und oben/unten sind vertauscht.</b>', '<b>Die Zeichnung ist richtig:</b> Schnittpunkt mit der y-Achse bei ' + n(b) + ', Steigung ' + fh(m) + '.'][err] + ' Richtig ist:' + graph([{ m: m, b: b, tri: [0], pts: [[0, b]] }], { r: 5 }),
          verify: function () { return (err === 3) === (M.feq(dm, m) && db === b) || 'Fehlerart'; } };
      }
    },
    lage: function () {
      var m = M.pick(ALL), b = M.rnd(-4, 4), x = M.rnd(-4, 4) * m.d, y0 = yAt(m, b, x), k = M.rnd(0, 2), y = k === 0 ? y0 + M.rnd(1, 3) : k === 1 ? y0 - M.rnd(1, 3) : y0;
      return { skill: 'Lage eines Punktes zur Geraden', level: 3, q: 'Liegt der Punkt P(' + n(x) + ' | ' + n(y) + ') <b>oberhalb</b>, <b>unterhalb</b> oder <b>auf</b> der Geraden <span class="big-math">' + eqHtml(m, b) + '</span>?',
        inputs: [{ kind: 'mc', label: 'P liegt …', options: ['oberhalb der Geraden', 'unterhalb der Geraden', 'auf der Geraden'], answer: k }],
        hints: ['Berechne, welchen y-Wert die Gerade an der Stelle x = ' + n(x) + ' hat.', 'y = ' + mt(m) + ' · ' + par(x) + (b ? (b > 0 ? ' + ' + b : ' − ' + (-b)) : '') + ' = ' + n(y0) + '.', 'Vergleiche mit der y-Koordinate von P: ' + n(y) + '. Größer heißt oberhalb, kleiner heißt unterhalb.'],
        solution: 'Die Gerade hat bei x = ' + n(x) + ' den Wert y = ' + n(y0) + '. P hat y = ' + n(y) + '. ' + (k === 2 ? 'Gleich, also liegt P <b>auf</b> der Geraden.' : 'P liegt ' + (k === 0 ? '<b>oberhalb</b>' : '<b>unterhalb</b>') + ' der Geraden.'),
        verify: function () { return (k === 0 ? y > y0 : k === 1 ? y < y0 : y === y0) || 'Lage'; } };
    },
    punkt_steigung: function () {
      var m = M.pick([F(1, 2), F(-1, 2), F(2, 3), F(-2, 3), F(3, 2), F(-3, 2), F(3, 4), F(-3, 4), F(2), F(-3)]), xp = M.nz(-4, 4), yp = M.rnd(-4, 4);
      var b = M.fadd(F(yp), F(-m.n * xp, m.d));
      return { skill: 'Gerade durch Punkt mit Steigung', level: 3, q: 'Eine Gerade geht durch den Punkt P(' + n(xp) + ' | ' + n(yp) + ') und hat die Steigung m = ' + fh(m) + '. Wenn du sie zeichnest, startest du bei P.<br>a) Wo schneidet sie die y-Achse?<br>b) Wie lautet ihre Gleichung?',
        inputs: [{ kind: 'frac', answer: b, label: 'a) b =', placeholder: 'z. B. 2 oder −1/2' }, { kind: 'term', answer: eqStr(m, b), label: 'b) y =', placeholder: 'z. B. 1/2x + 3' }],
        src: '(' + m.n + '/' + m.d + ')*(x-(' + xp + '))+(' + yp + ')',
        hints: ['Setze P in y = ' + mHtml(m) + 'x + b ein: ' + n(yp) + ' = ' + mt(m) + ' · ' + par(xp) + ' + b.', mt(m) + ' · ' + par(xp) + ' = ' + fh(F(m.n * xp, m.d)) + '. Also ' + n(yp) + ' = ' + fh(F(m.n * xp, m.d)) + ' + b.', 'Löse nach b auf. Kontrolle mit dem Steigungsdreieck: Von P aus kommst du in Schritten zur y-Achse.'],
        solution: n(yp) + ' = ' + mt(m) + ' · ' + par(xp) + ' + b = ' + fh(F(m.n * xp, m.d)) + ' + b ⇒ b = <b>' + fh(b) + '</b>. Gleichung: <b>' + eqHtml(m, b) + '</b>.' + (Math.abs(fv(b)) <= 5 ? graph([{ m: m, b: fv(b), pts: [[xp, yp]] }], { r: 5, marks: [{ x: 0, y: fv(b), color: '#0f766e' }] }) : ''),
        verify: function () { return Math.abs(fv(m) * xp + fv(b) - yp) < 1e-9 || 'P nicht auf Gerade'; } };
    }
  };

  return {
    id: '013', title: 'Geraden zeichnen', bereich: 'Funktionaler Zusammenhang', minutes: '45 bis 60',
    vorkenntnisse: 'Steigung und y-Achsenabschnitt (Modul 011), Koordinatensystem',
    lead: 'Mit zwei Punkten und einem Lineal ist jede Gerade schnell gezeichnet. Du lernst zwei sichere Wege: mit Wertetabelle und mit Startpunkt und Steigungsdreieck.',
    einstieg: { html: '<p>Lena soll im Heft die Gerade <b>y = ' + fh(F(2, 3)) + 'x − 1</b> zeichnen. Sie rechnet eine lange Wertetabelle mit Brüchen aus und ist nach zehn Minuten noch nicht fertig. Ihr Sitznachbar Ali ist nach einer Minute fertig.</p><p class="note">Alis Trick: Er startet auf der y-Achse bei −1, geht 3 Kästchen nach rechts und 2 nach oben und verbindet die beiden Punkte. Warum funktioniert das?</p><p>In diesem Modul lernst du beide Wege kennen und prüfst Zeichnungen auf Fehler.</p>' },
    ziele: ['Ich zeichne eine Gerade mit Hilfe einer Wertetabelle.', 'Ich zeichne eine Gerade mit Startpunkt (0 | b) und Steigungsdreieck.', 'Ich ordne einer Gleichung den passenden Graphen zu.', 'Ich prüfe, ob ein Punkt auf einer Geraden liegt, und berechne fehlende Koordinaten.', 'Ich finde Fehler in gezeichneten Geraden.'],
    fachwoerter: [['Wertetabelle', 'Tabelle mit x-Werten und den berechneten y-Werten. Jedes Paar ist ein Punkt der Geraden.'], ['Startpunkt', 'Der Punkt (0 | b) auf der y-Achse. Dort beginnt man beim Zeichnen mit dem Steigungsdreieck.'], ['Steigungsdreieck', 'Von einem Punkt aus: so viele Kästchen nach rechts, wie der Nenner von m angibt, und so viele nach oben (unten), wie der Zähler angibt.'], ['Gitterpunkt', 'Ein Punkt mit ganzzahligen Koordinaten. Dort kann man genau zeichnen.']],
    diagnose: [
      { q: 'Was ist bei y = −3x + 2 der y-Achsenabschnitt?', options: ['2', '−3', '3', 'Weiß ich noch nicht'], answer: 0, why: 'b ist die Zahl ohne x: 2.', review: 'Steigung und y-Achsenabschnitt (Modul 011)' },
      { q: 'Wie heißt der Punkt, der 2 nach links und 3 nach oben vom Ursprung liegt?', options: ['(−2 | 3)', '(3 | −2)', '(2 | 3)', 'Weiß ich noch nicht'], answer: 0, why: 'Erst x (links: negativ), dann y (oben: positiv).', review: 'Punkte im Koordinatensystem' },
      { q: 'Welchen Wert hat ' + fh(F(1, 2)) + ' · (−4) + 1?', options: ['−1', '−3', '3', 'Weiß ich noch nicht'], answer: 0, why: fh(F(1, 2)) + ' · (−4) = −2 und −2 + 1 = −1.', review: 'Rechnen mit Brüchen und negativen Zahlen' },
      { q: 'Eine Gerade hat die Steigung m = 2. Was bedeutet das?', options: ['1 nach rechts, 2 nach oben', '2 nach rechts, 1 nach oben', '1 nach rechts, 2 nach unten', 'Weiß ich noch nicht'], answer: 0, why: 'm = 2 = 2 : 1. Pro Schritt nach rechts geht es 2 nach oben.', review: 'Steigungsdreieck (Modul 011)' }],
    erklaerung:
      '<h3>1. Zeichnen mit Wertetabelle</h3><p>Du wählst einige x-Werte, berechnest die y-Werte und trägst die Punkte ein. Für y = 2x − 3:</p>' +
      '<table class="tab"><tr><th>x</th><td>−1</td><td>0</td><td>1</td><td>2</td><td>3</td></tr><tr><th>y</th><td>−5</td><td>−3</td><td>−1</td><td>1</td><td>3</td></tr></table><p>Für eine Gerade genügen eigentlich <b>zwei Punkte</b>. Ein dritter Punkt dient zur Kontrolle. Liegen nicht alle auf einer Linie, hast du dich verrechnet.</p>' +
      '<h3>2. Zeichnen mit Startpunkt und Steigungsdreieck</h3><div class="merk"><b>Merke:</b> So zeichnest du y = mx + b:<br>1. Markiere den <b>Startpunkt (0 | b)</b> auf der y-Achse.<br>2. Schreibe m als Bruch. Gehe so viele Kästchen <b>nach rechts</b>, wie der <b>Nenner</b> angibt, und so viele <b>nach oben</b> (m &gt; 0) oder <b>nach unten</b> (m &lt; 0), wie der <b>Zähler</b> angibt.<br>3. Verbinde beide Punkte mit dem Lineal und verlängere die Gerade.</div>' +
      '<p>Für y = ' + fh(F(2, 3)) + 'x − 1 aus dem Einstieg: Start bei (0 | −1), 3 nach rechts, 2 nach oben. Du kommst zu (3 | 1).</p>' + graph([{ m: F(2, 3), b: -1, tri: [0], pts: [[0, -1], [3, 1]] }], { r: 5, label: 'Gerade y = 2/3 x − 1 mit Steigungsdreieck' }) +
      '<p>Ganze Zahlen schreibst du als Bruch mit Nenner 1: m = −2 = ' + fh(F(-2, 1), true) + ' heißt 1 nach rechts, 2 nach unten.</p>' +
      '<h3>3. Kontrolle</h3><ul><li>Steigt die Gerade bei m &gt; 0 und fällt sie bei m &lt; 0?</li><li>Schneidet sie die y-Achse bei b?</li><li>Liegt ein weiterer berechneter Punkt auf der Geraden? Setze dazu x ein und vergleiche y.</li></ul>',
    entdecken: {
      html: '<p>Tippe auf zwei Gitterpunkte. Die Gerade durch beide Punkte wird gezeichnet, und du siehst ihre Gleichung. Du kannst auch zufällige Punkte setzen lassen.</p><div class="ctl"><button class="btn ghost" id="e_rnd" type="button">Zufällige Punkte</button><button class="btn ghost" id="e_clr" type="button">Neu beginnen</button></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var P = [], lines = 0;
        function draw() {
          var L = [], marks = P.map(function (p, i) { return { x: p[0], y: p[1], text: 'AB'[i], color: '#d97706' }; }), txt;
          if (P.length < 2) txt = '<p>' + (P.length === 0 ? 'Tippe auf einen ersten Gitterpunkt.' : 'Punkt A(' + n(P[0][0]) + ' | ' + n(P[0][1]) + '). Tippe auf einen zweiten Gitterpunkt.') + '</p>';
          else {
            var A = P[0], B = P[1];
            if (A[0] === B[0]) txt = '<p>A und B liegen senkrecht übereinander. Eine senkrechte Gerade ist <b>keine Funktion</b> y = mx + b. Wähle einen anderen Punkt.</p>';
            else {
              var l = A[0] < B[0] ? A : B, r = A[0] < B[0] ? B : A, m = M.red(F(r[1] - l[1], r[0] - l[0])), b = M.fadd(F(l[1]), F(-m.n * l[0], m.d));
              L.push({ m: m, b: fv(b), tri: [l[0]] });
              txt = '<p>Von ' + (l === A ? 'A' : 'B') + ' nach ' + (l === A ? 'B' : 'A') + ': ' + (r[0] - l[0]) + ' nach rechts, ' + Math.abs(r[1] - l[1]) + (r[1] >= l[1] ? ' nach oben' : ' nach unten') + '. Steigung m = ' + fh(F(r[1] - l[1], r[0] - l[0]), true) + (M.red(F(r[1] - l[1], r[0] - l[0])).d !== r[0] - l[0] ? ' = ' + fh(m) : '') + '.</p><p class="big-math">' + eqHtml(m, b) + '</p>';
            }
          }
          root.querySelector('#e_g').innerHTML = graph(L, { r: 5, marks: marks, hot: true, maxw: 380, label: 'Zeichenfeld: tippe auf Gitterpunkte' });
          root.querySelector('#e_txt').innerHTML = txt;
        }
        function add(p) { if (P.length >= 2) P = []; if (P.length === 1 && P[0][0] === p[0] && P[0][1] === p[1]) return; P.push(p); draw(); if (P.length === 2 && P[0][0] !== P[1][0]) { lines++; if (lines >= 2) done('Stark: Aus zwei Punkten bekommst du die Steigung (hoch : rechts) und mit dem Schnittpunkt der y-Achse die ganze Gleichung.'); } }
        root.querySelector('#e_g').addEventListener('click', function (e) { var c = e.target.closest('circle[data-x]'); if (c) add([+c.getAttribute('data-x'), +c.getAttribute('data-y')]); });
        root.querySelector('#e_rnd').addEventListener('click', function () { var a = [M.rnd(-4, 0), M.rnd(-4, 4)], c; do { c = [M.rnd(1, 4), M.rnd(-4, 4)]; } while (c[1] === a[1] && Math.random() < 0.7); P = []; add(a); add(c); });
        root.querySelector('#e_clr').addEventListener('click', function () { P = []; draw(); });
        draw();
      }
    },
    beispiel: { title: 'Gerade mit Bruchsteigung zeichnen', q: 'Zeichne die Gerade y = −' + fh(F(3, 4)) + 'x + 2 und prüfe, ob der Punkt P(4 | −1) darauf liegt.',
      steps: ['Startpunkt: b = 2, also (0 | 2) auf der y-Achse markieren.', 'Steigung m = −' + fh(F(3, 4)) + ': 4 nach rechts, 3 nach unten. Du kommst zum Punkt (4 | −1).', 'Beide Punkte mit dem Lineal verbinden und die Gerade über beide Punkte hinaus verlängern.', 'Punktprobe für P(4 | −1): y = −' + fh(F(3, 4)) + ' · 4 + 2 = −3 + 2 = −1. P liegt auf der Geraden. Das ist genau der zweite Punkt aus dem Steigungsdreieck.', 'Kontrolle: m &lt; 0, die Gerade fällt. Sie schneidet die y-Achse bei 2. Passt!' + graph([{ m: F(-3, 4), b: 2, tri: [0], pts: [[0, 2], [4, -1]] }], { r: 5, label: 'Gerade y = −3/4 x + 2' })] },
    tasks: { gen: gen, plan: { G: ['welcher_graph:1', 'wertetabelle:1', 'punkt_auf:1', 'steigungsdreieck:1'], S: ['wertetabelle:2', 'steigungsdreieck:2', 'welcher_graph:2', 'zeichnen_schritte:2', 'punkt_finden:2'], E: ['welcher_graph:3', 'steigungsdreieck:2', 'fehler_finden:3', 'punkt_finden:3', 'lage:3', 'zeichnen_schritte:2'] },
      extra: 'punkt_steigung', test: ['welcher_graph:2', 'wertetabelle:2', 'punkt_auf:1', 'steigungsdreieck:2', 'zeichnen_schritte:2', 'fehler_finden:3'] },
    lerncheck: ['Ich zeichne Geraden mit einer Wertetabelle.', 'Ich zeichne Geraden mit Startpunkt und Steigungsdreieck.', 'Ich finde den passenden Graphen zu einer Gleichung.', 'Ich erkenne Fehler in gezeichneten Geraden.']
  };
})();
