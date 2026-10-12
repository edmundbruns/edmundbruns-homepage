/* Modul 002 (Klasse 9) · Gleichungssysteme grafisch lösen */
var MODULE = (function () {
  /* ---------- Koordinatensystem (nach Klasse-8-Modul 012, blaue Farben) ---------- */
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
    for (i = Math.ceil(xr[0] / gx) * gx; i <= xr[1] + 1e-9; i += gx) g += '<line x1="' + fx(X(i)) + '" y1="' + fx(Y(yl)) + '" x2="' + fx(X(i)) + '" y2="' + fx(Y(yh)) + '" stroke="#dbe4f5"/>';
    for (i = Math.ceil(yr[0] / gy) * gy; i <= yr[1] + 1e-9; i += gy) g += '<line x1="' + fx(X(xl)) + '" y1="' + fx(Y(i)) + '" x2="' + fx(X(xh)) + '" y2="' + fx(Y(i)) + '" stroke="#dbe4f5"/>';
    g += '<line x1="' + fx(X(xl)) + '" y1="' + fx(Y(ay)) + '" x2="' + fx(X(xh)) + '" y2="' + fx(Y(ay)) + '" stroke="#0f172a" stroke-width="1.6"/><line x1="' + fx(X(ax)) + '" y1="' + fx(Y(yl)) + '" x2="' + fx(X(ax)) + '" y2="' + fx(Y(yh)) + '" stroke="#0f172a" stroke-width="1.6"/>';
    var inner = ax === 0 && ay === 0 && xr[0] < 0 && yr[0] < 0;
    for (i = Math.ceil(xr[0] / lx) * lx; i <= xr[1] + 1e-9; i += lx) { var vi = Math.round(i * 1000) / 1000; if (vi === 0 && inner) continue; g += '<text x="' + fx(X(vi)) + '" y="' + fx(Y(ay) + 14) + '" font-size="10" text-anchor="middle">' + M.fmtNum(vi) + '</text>'; }
    for (i = Math.ceil(yr[0] / ly) * ly; i <= yr[1] + 1e-9; i += ly) { var wi = Math.round(i * 1000) / 1000; if (wi === 0 && (inner || ay === 0 && ax === xr[0])) continue; g += '<text x="' + fx(X(ax) - 5) + '" y="' + fx(Y(wi) + 4) + '" font-size="10" text-anchor="end">' + M.fmtNum(wi) + '</text>'; }
    g += '<text x="' + fx(X(xh) - 3) + '" y="' + fx(Y(ay) - 6) + '" font-size="12" font-weight="700" text-anchor="end">' + (o.tx || 'x') + '</text><text x="' + fx(X(ax) + 6) + '" y="' + fx(Y(yh) + 12) + '" font-size="12" font-weight="700">' + (o.ty || 'y') + '</text>';
    lines.forEach(function (L, idx) {
      var col = L.color || ['#1d4ed8', '#0f766e', '#d97706'][idx % 3], a = Math.max(xl, L.from != null ? L.from : xl), z = Math.min(xh, L.to != null ? L.to : xh);
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
      g += '<circle cx="' + fx(X(mk.x)) + '" cy="' + fx(Y(mk.y)) + '" r="5" fill="' + (mk.color || '#0f172a') + '" stroke="#fff" stroke-width="1.5"/>';
      if (mk.text) { var tx = X(mk.x) + (mk.dx != null ? mk.dx : 8), ty = Y(mk.y) + (mk.dy != null ? mk.dy : -8); g += '<text x="' + fx(tx) + '" y="' + fx(ty) + '" font-size="12" font-weight="700" fill="' + (mk.color || '#0f172a') + '"' + (mk.anchor ? ' text-anchor="' + mk.anchor + '"' : '') + '>' + mk.text + '</text>'; }
    });
    if (o.cap) g += '<rect x="' + fx(X(xl) + 3) + '" y="' + fx(Y(yh) + 3) + '" width="26" height="22" rx="5" fill="#1e3a8a"/><text x="' + fx(X(xl) + 16) + '" y="' + fx(Y(yh) + 19) + '" font-size="14" font-weight="700" fill="#fff" text-anchor="middle">' + o.cap + '</text>';
    if (o.hot) for (var hx = Math.ceil(xr[0]); hx <= xr[1]; hx++) for (var hy = Math.ceil(yr[0]); hy <= yr[1]; hy++) g += '<circle data-x="' + hx + '" data-y="' + hy + '" cx="' + fx(X(hx)) + '" cy="' + fx(Y(hy)) + '" r="' + fx(Math.min(ux, uy) * 0.45) + '" fill="#fff" fill-opacity="0" style="cursor:pointer"/>';
    return g + '</svg>';
  }
  /* ---------- Hilfsfunktionen für Gleichungen ---------- */
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function par(v) { return v < 0 ? '(' + n(v) + ')' : n(v); }
  function coef(a, v, first) { if (a === 0) return ''; var k = Math.abs(a); return (a < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ')) + (k === 1 ? '' : n(k)) + v; }
  function lin(a, b) { var s = coef(a, 'x', true); s += coef(b, 'y', !s); return s || '0'; }
  function eqG(a, b, c) { return lin(a, b) + ' = ' + n(c); }
  function cst(c) { return c === 0 ? '' : c < 0 ? ' − ' + n(-c) : ' + ' + n(c); }
  function rhs(m, t) { return m ? coef(m, 'x', true) + cst(t) : n(t); }
  function eqY(m, t) { return 'y = ' + rhs(m, t); }
  function holds(s, x, y) {
    var p = String(s).replace(/<[^>]+>/g, '').replace(/(\d) (?=\d{3})/g, '$1').split('=');
    if (p.length !== 2) return false;
    try { var L = M.evalTree(M.parseTerm(p[0]), { x: x, y: y }), R = M.evalTree(M.parseTerm(p[1]), { x: x, y: y }); return Math.abs(L - R) < 1e-9; } catch (e) { return false; }
  }
  var LBL = 'display:inline-block;min-width:2.1em;color:#1d4ed8';
  function sys(e1, e2) { return '<div style="display:table;border-left:3px solid #1e3a8a;padding:4px 0 4px 12px;margin:8px 0;font-size:1.25rem;font-weight:700;line-height:1.75"><div><span style="' + LBL + '">I</span>' + e1 + '</div><div><span style="' + LBL + '">II</span>' + e2 + '</div></div>'; }
  function pair(x, y) { return '(' + n(x) + ' | ' + n(y) + ')'; }
  function pairIn(x, y, lx, ly, ux, uy) { return [{ kind: 'num', answer: x, label: lx || 'x =', unit: ux }, { kind: 'num', answer: y, label: ly || 'y =', unit: uy }]; }
  function pairMis(x, y) {
    return function (v) {
      var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === null || b === null) return null;
      if (a === y && b === x && x !== y) return 'Du hast x und y vertauscht. Zuerst kommt die x-Koordinate (nach rechts oder links), dann die y-Koordinate (nach oben oder unten).';
      if (a === x && b !== y) return 'Die x-Koordinate stimmt. Lies den y-Wert noch einmal genau ab oder berechne ihn mit einer Gleichung.';
      if (b === y && a !== x) return 'Die y-Koordinate stimmt, die x-Koordinate noch nicht.';
      if (a === -x && b === -y) return 'Achte auf die Vorzeichen der Koordinaten.';
      return null;
    };
  }
  function probe(e1, e2, x, y) { return 'Probe: (' + n(x) + ' | ' + n(y) + ') in I und II einsetzen. Beide Gleichungen stimmen ✓'; }
  function calcY(m, t, x) { return m === 0 ? n(t) : (m === 1 ? par(x) : m === -1 ? (x < 0 ? '−' + par(x) : '−1 · ' + n(x)) : n(m) + ' · ' + par(x)) + cst(t) + ' = ' + n(m * x + t); }
  var MS = [1, 2, 3, -1, -2, -3, 0.5, -0.5];
  /* zwei Geraden mit ganzzahligem Schnittpunkt im Bild */
  function twoLines(lvl, R) {
    R = R || 6;
    for (var t = 0; t < 400; t++) {
      var m1 = M.pick(lvl <= 1 ? [1, 2, -1, -2, 0.5] : MS), m2 = M.pick(lvl <= 1 ? [1, -1, -2, 2, 0] : MS.concat([0]));
      if (m1 === m2) continue;
      var x = M.rnd(-4, 4), y = M.rnd(-4, 4);
      if ((m1 % 1 || m2 % 1) && x % 2) continue;
      var t1 = y - m1 * x, t2 = y - m2 * x;
      if (Math.abs(t1) > R - 1 || Math.abs(t2) > R - 1 || t1 !== Math.round(t1) || t2 !== Math.round(t2)) continue;
      if (x === 0 && y === 0) continue;
      return { m1: m1, t1: t1, m2: m2, t2: t2, x: x, y: y };
    }
    return { m1: 1, t1: 1, m2: -1, t2: 5, x: 2, y: 3 };
  }
  /* allgemeine Form zu y = m x + t: a x + b y = c mit b ≠ 0 */
  function general(m, t, b) { return { a: -m * b, b: b, c: t * b }; }

  var gen = {
    umstellen: function (lvl) {
      var b, a, c;
      for (var t = 0; t < 300; t++) {
        b = lvl <= 1 ? 1 : lvl === 2 ? M.pick([-1, 2, -2, 3]) : M.pick([2, -2, 3, 4]);
        a = M.nz(-6, 6); c = M.nz(-12, 12);
        if (c % b !== 0) continue;
        if (lvl <= 2 ? a % b !== 0 : a % b === 0) continue;
        break;
      }
      var m = -a / b, k = c / b, mFr = M.red(M.F(-a, b));
      var ansStr = (mFr.d === 1 ? String(mFr.n) : '(' + mFr.n + '/' + mFr.d + ')') + '*x+(' + k + ')';
      var e = eqG(a, b, c), mShow = mFr.d === 1 || mFr.d === 2 ? coef(m, 'x', true) : (mFr.n < 0 ? '−' : '') + M.fhtml(M.F(Math.abs(mFr.n), mFr.d)) + 'x';
      var sol = 'y = ' + mShow + cst(k);
      var step1 = coef(b, 'y', true) + ' = ' + coef(-a, 'x', true) + cst(c);
      return { src: '(' + c + '-(' + a + ')*x)/(' + b + ')', skill: 'Gleichung nach y umstellen', level: lvl, q: 'Stelle die Gleichung nach y um. Schreibe sie in der Form y = mx + b.<span class="big-math" style="display:block;margin-top:6px">' + e + '</span>',
        inputs: [{ kind: 'term', answer: ansStr, label: 'y =', placeholder: mFr.d === 1 ? 'z. B. −2x + 5' : 'z. B. 1/2x − 3' }],
        hints: ['Bringe das Glied mit x auf die rechte Seite. Aus ' + coef(a, 'x', true) + ' links wird ' + coef(-a, 'x', true) + ' rechts.', 'Du erhältst ' + step1 + '.', b === 1 ? 'Fertig, y steht schon allein. Ordne: zuerst das x-Glied, dann die Zahl.' : 'Teile <b>jedes</b> Glied durch ' + par(b) + '.'],
        solution: e + ' &nbsp;|&nbsp; ' + (a > 0 ? '− ' + n(a) + 'x' : '+ ' + n(-a) + 'x') + '<br>' + (b !== 1 ? step1 + ' &nbsp;|&nbsp; : ' + par(b) + '<br>' : '') + '<b>' + sol + '</b>',
        mistakes: function (v) {
          var w = String(v[0]);
          if (M.termEq(w, (a / b) + '*x+(' + k + ')') && a !== 0) return 'Prüfe das Vorzeichen vor dem x. Wenn du ' + coef(a, 'x', true) + ' auf die andere Seite bringst, ändert sich das Vorzeichen.';
          if (b !== 1 && M.termEq(w, (-a / b) + '*x+(' + c + ')')) return 'Du hast nur das x-Glied geteilt. Teile auch die Zahl ' + n(c) + ' durch ' + par(b) + '.';
          if (b !== 1 && M.termEq(w, (-a) + '*x+(' + k + ')')) return 'Teile auch das x-Glied durch ' + par(b) + '.';
          return null; },
        verify: function () { return holds(e, 2, m * 2 + k) && holds(e, -3, m * -3 + k) || 'Umstellung falsch'; } };
    },
    ablesen: function (lvl) {
      var L = twoLines(lvl), e1 = eqY(L.m1, L.t1), e2 = eqY(L.m2, L.t2);
      return { skill: 'Schnittpunkt ablesen', level: 1, q: 'Die Geraden gehören zum Gleichungssystem ' + sys(e1, e2) + '<br>Lies die Lösung am Schnittpunkt ab.' + graph([{ m: L.m1, b: L.t1, label: 'I' }, { m: L.m2, b: L.t2, label: 'II', labelPos: 'below' }], { label: 'Zwei Geraden im Koordinatensystem' }),
        inputs: pairIn(L.x, L.y),
        hints: ['Die Lösung ist der Punkt, in dem sich beide Geraden kreuzen.', 'Gehe vom Schnittpunkt senkrecht zur x-Achse und lies x ab. Gehe dann waagerecht zur y-Achse und lies y ab.', 'Der Schnittpunkt liegt bei x = ' + n(L.x) + '. Prüfe mit Gleichung I, welcher y-Wert dazu gehört.'],
        solution: 'Die Geraden schneiden sich in <b>S' + pair(L.x, L.y) + '</b>. Probe: I: y = ' + calcY(L.m1, L.t1, L.x) + ' ✓, II: y = ' + calcY(L.m2, L.t2, L.x) + ' ✓. L = {' + pair(L.x, L.y) + '}' + graph([{ m: L.m1, b: L.t1 }, { m: L.m2, b: L.t2 }], { marks: [{ x: L.x, y: L.y, text: 'S', color: '#d97706' }] }),
        mistakes: pairMis(L.x, L.y),
        verify: function () { return (holds(e1, L.x, L.y) && holds(e2, L.x, L.y)) || 'S falsch'; } };
    },
    grafisch: function (lvl) {
      var L = twoLines(lvl >= 2 ? 2 : 1), b1 = lvl >= 3 ? M.pick([2, -1, 1]) : 1, b2 = lvl >= 2 ? M.pick([1, -1, 2]) : 1;
      if ((L.m1 % 1 && Math.abs(b1) !== 2) || (L.m2 % 1 && Math.abs(b2) !== 2)) { b1 = L.m1 % 1 ? 2 : b1; b2 = L.m2 % 1 ? 2 : b2; }
      var g1 = general(L.m1, L.t1, b1), g2 = general(L.m2, L.t2, b2);
      var e1 = lvl <= 1 ? eqY(L.m1, L.t1) : eqG(g1.a, g1.b, g1.c), e2 = lvl <= 1 ? eqY(L.m2, L.t2) : eqG(g2.a, g2.b, g2.c);
      return { skill: 'Gleichungssystem grafisch lösen', level: lvl, q: 'Löse das Gleichungssystem grafisch. Zeichne dazu beide Geraden in dein Heft und lies den Schnittpunkt ab.' + sys(e1, e2),
        inputs: pairIn(L.x, L.y),
        hints: [lvl <= 1 ? 'Beide Gleichungen haben schon die Form y = mx + b. Starte jeweils bei b auf der y-Achse.' : 'Stelle beide Gleichungen nach y um: I: ' + eqY(L.m1, L.t1) + ', II: ' + eqY(L.m2, L.t2) + '.', 'Gerade I: Start bei (0 | ' + n(L.t1) + '), Steigung ' + n(L.m1) + '. Gerade II: Start bei (0 | ' + n(L.t2) + '), Steigung ' + n(L.m2) + '.', 'Die Geraden schneiden sich bei x = ' + n(L.x) + '. Lies y ab und mache die Probe.'],
        solution: (lvl <= 1 ? '' : 'Umgestellt: I: ' + eqY(L.m1, L.t1) + ', II: ' + eqY(L.m2, L.t2) + '.<br>') + 'Schnittpunkt <b>S' + pair(L.x, L.y) + '</b>, also L = {' + pair(L.x, L.y) + '}. ' + probe(e1, e2, L.x, L.y) + graph([{ m: L.m1, b: L.t1, label: 'I' }, { m: L.m2, b: L.t2, label: 'II', labelPos: 'below' }], { marks: [{ x: L.x, y: L.y, text: 'S', color: '#d97706' }] }),
        mistakes: pairMis(L.x, L.y),
        verify: function () { return (holds(e1, L.x, L.y) && holds(e2, L.x, L.y)) || 'S falsch'; } };
    },
    anzahl: function (lvl) {
      var kind = M.rnd(0, 2), m1 = M.pick([1, 2, 3, -1, -2, -3]), t1 = M.rnd(-6, 6), m2 = m1, t2 = t1, e1, e2;
      if (kind === 0) { do { t2 = M.rnd(-6, 6); } while (t2 === t1); }
      else if (kind === 1) { do { m2 = M.pick([1, 2, 3, -1, -2, -3, 0]); } while (m2 === m1); t2 = M.rnd(-6, 6); }
      if (lvl <= 1) { e1 = eqY(m1, t1); e2 = kind === 2 ? 'y = ' + (t1 ? n(t1) + coef(m1, 'x', false) : coef(m1, 'x', true)) : eqY(m2, t2); }
      else { var k1 = lvl >= 3 ? M.pick([2, 3, -1]) : 1, k2 = M.pick([2, 3, -2]); var g1 = general(m1, t1, k1), g2 = general(m2, t2, k2); e1 = lvl >= 3 ? eqG(g1.a, g1.b, g1.c) : eqY(m1, t1); e2 = eqG(g2.a, g2.b, g2.c); }
      var opts = ['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'];
      return { skill: 'Anzahl der Lösungen erkennen', level: lvl, q: 'Wie viele Lösungen hat das Gleichungssystem? Entscheide ohne zu zeichnen.' + sys(e1, e2),
        inputs: [{ kind: 'mc', label: 'Das System hat …', options: opts, answer: kind }],
        hints: ['Bringe beide Gleichungen in die Form y = mx + b, falls nötig.', 'Vergleiche zuerst die Steigungen m. Sind sie verschieden, schneiden sich die Geraden genau einmal.', 'Bei gleicher Steigung: verschiedene b bedeuten parallele Geraden (keine Lösung), gleiche b bedeuten dieselbe Gerade (unendlich viele Lösungen).'],
        solution: 'In der Form y = mx + b: I: ' + eqY(m1, t1) + ', II: ' + eqY(m2, t2) + '.<br>' + (kind === 0 ? 'Gleiche Steigung ' + n(m1) + ', verschiedene y-Achsenabschnitte: Die Geraden sind <b>parallel</b>. Das System hat <b>keine Lösung</b>, L = { }.' : kind === 1 ? 'Verschiedene Steigungen (' + n(m1) + ' und ' + n(m2) + '): Die Geraden schneiden sich in <b>genau einem Punkt</b>.' : 'Steigung und y-Achsenabschnitt sind gleich: Es ist <b>dieselbe Gerade</b>. Jeder Punkt der Geraden ist eine Lösung, also <b>unendlich viele Lösungen</b>.'),
        mistakes: function (v) { if (v[0] === '1' && kind !== 1) return 'Vergleiche die Steigungen genau, nachdem du beide Gleichungen nach y umgestellt hast. Sie sind gleich.'; if (v[0] === '0' && kind === 2) return 'Die Steigungen sind gleich. Vergleiche nun auch die y-Achsenabschnitte nach dem Umstellen.'; return null; },
        verify: function () { var xs = [-2, 0, 1, 3], h1 = 0, both = 0; xs.forEach(function (x) { var y1 = m1 * x + t1; if (holds(e1, x, y1)) h1++; if (holds(e2, x, y1)) both++; }); if (h1 !== 4) return 'I falsch'; var d = holds(e2, 0, m2 * 0 + t2) && holds(e2, 1, m2 + t2); if (!d) return 'II falsch'; return (kind === 2 ? both === 4 : kind === 0 ? both === 0 : both <= 1) || 'Art falsch'; } };
    },
    lage_graph: function () {
      var kind = M.rnd(0, 2), m1 = M.pick([1, 2, -1, -2, 0.5, -0.5]), t1 = M.rnd(-3, 3), m2 = m1, t2 = t1;
      if (kind === 0) { do { t2 = M.rnd(-4, 4); } while (Math.abs(t2 - t1) < 2); }
      else if (kind === 1) { do { m2 = M.pick([1, 2, -1, -2, 0.5, -0.5, 0]); } while (m2 === m1); t2 = M.rnd(-3, 3); }
      var lines = kind === 2 ? [{ m: m1, b: t1, label: 'I' }, { m: m2, b: t2, color: '#0f766e', dash: true, label: 'II', labelPos: 'below' }] : [{ m: m1, b: t1, label: 'I' }, { m: m2, b: t2, label: 'II', labelPos: 'below' }];
      var opts = ['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'];
      return { skill: 'Anzahl der Lösungen am Graphen', level: 1, q: 'Das Bild zeigt die Geraden zu den Gleichungen I und II eines Gleichungssystems. Wie viele Lösungen hat das System?' + graph(lines, { label: 'Geraden I und II' }),
        inputs: [{ kind: 'mc', label: 'Das System hat …', options: opts, answer: kind }],
        hints: ['Jeder gemeinsame Punkt beider Geraden ist eine Lösung.', 'Schneiden sich die Geraden? Laufen sie nebeneinander her, ohne sich zu treffen? Oder liegen sie genau aufeinander?', 'Parallele Geraden: keine Lösung. Ein Schnittpunkt: genau eine Lösung. Aufeinanderliegende Geraden: unendlich viele Lösungen.'],
        solution: kind === 0 ? 'Die Geraden sind <b>parallel</b> (gleiche Steigung ' + n(m1) + '). Sie haben keinen gemeinsamen Punkt: <b>keine Lösung</b>.' : kind === 1 ? 'Die Geraden schneiden sich in einem Punkt: <b>genau eine Lösung</b>.' : 'Die Geraden liegen <b>genau aufeinander</b> (gestrichelt eingezeichnet). Alle Punkte sind gemeinsam: <b>unendlich viele Lösungen</b>.',
        verify: function () { return (kind === 1 ? m1 !== m2 : m1 === m2 && (kind === 2) === (t1 === t2)) || 'Lage falsch'; } };
    },
    passend: function () {
      for (var t = 0; t < 200; t++) {
        var L = twoLines(1);
        if (L.t1 === 0 || L.t2 === 0 || L.t1 === L.t2 || L.m1 === -L.m2 || L.m2 === 0) continue;
        var right = [eqY(L.m1, L.t1), eqY(L.m2, L.t2)];
        var wrong = [[eqY(-L.m1, L.t1), eqY(L.m2, L.t2)], [eqY(L.m1, L.t2), eqY(L.m2, L.t1)], [eqY(L.m1, -L.t1), eqY(L.m2, -L.t2)]];
        var all = M.shuffle([[right, true]].concat(wrong.map(function (w) { return [w, false]; })));
        var fmt = function (e) { return 'I: ' + e[0] + ' &nbsp;und&nbsp; II: ' + e[1]; };
        var keys = all.map(function (o) { return fmt(o[0]); });
        if (new Set(keys).size !== 4) continue;
        return { skill: 'Gleichungssystem zum Graphen', level: 2, q: 'Welches Gleichungssystem gehört zu den beiden Geraden?' + graph([{ m: L.m1, b: L.t1, label: 'I' }, { m: L.m2, b: L.t2, label: 'II', labelPos: 'below' }], { label: 'Geraden I und II' }),
          inputs: [{ kind: 'mc', label: 'Gleichungssystem', options: keys, answer: all.findIndex(function (o) { return o[1]; }) }],
          hints: ['Lies für jede Gerade den y-Achsenabschnitt b ab: Wo schneidet sie die y-Achse?', 'Bestimme die Steigung m: Steigt oder fällt die Gerade? Um wie viel ändert sich y, wenn x um 1 größer wird?', 'Gerade I: b = ' + n(L.t1) + '. Gerade II: b = ' + n(L.t2) + '.'],
          solution: 'Gerade I: b = ' + n(L.t1) + ', m = ' + n(L.m1) + '. Gerade II: b = ' + n(L.t2) + ', m = ' + n(L.m2) + '. Richtig ist <b>' + fmt(right) + '</b>.',
          mistakes: function (v) { var o = all[+v[0]]; if (!o || o[1]) return null; if (o[0] === wrong[0]) return 'Prüfe bei Gerade I, ob sie steigt oder fällt. Das Vorzeichen von m stimmt nicht.'; if (o[0] === wrong[1]) return 'Die y-Achsenabschnitte sind vertauscht. Welche Gerade schneidet die y-Achse wo?'; return 'Lies die y-Achsenabschnitte noch einmal genau ab. Achte auf die Vorzeichen.'; },
          verify: function () { return (holds(right[0], 0, L.t1) && holds(right[0], 2, L.t1 + 2 * L.m1) && holds(right[1], L.x, L.y) && holds(right[0], L.x, L.y)) || 'System falsch'; } };
      }
      return gen.ablesen(1);
    },
    parameter: function (lvl) {
      var m1 = M.pick([2, 3, -2, -1, 4]), t1 = M.nz(-6, 6), t2 = M.nz(-6, 6);
      if (lvl >= 3) {
        var b2 = M.pick([2, 3]), c2; do { c2 = M.nz(-12, 12); } while (c2 === b2 * t1 || c2 % b2 !== 0);
        var ans = -m1 * b2, e1 = eqY(m1, t1), e2 = 'kx' + coef(b2, 'y', false) + ' = ' + n(c2);
        return { skill: 'Parameter: keine Lösung', level: 3, q: 'Für welchen Wert von k hat das Gleichungssystem <b>keine Lösung</b>?' + sys(e1, e2),
          inputs: [{ kind: 'num', answer: ans, label: 'k =' }],
          hints: ['Keine Lösung bedeutet: Die Geraden sind parallel. Sie haben dieselbe Steigung, aber verschiedene y-Achsenabschnitte.', 'Stelle II nach y um: ' + b2 + 'y = −kx' + cst(c2) + ', also y = −k/' + b2 + ' · x' + cst(c2 / b2) + '.', 'Die Steigung von II muss ' + n(m1) + ' sein: −k : ' + b2 + ' = ' + n(m1) + '.'],
          solution: 'II umgestellt: y = −k/' + b2 + ' · x' + cst(c2 / b2) + '. Parallel zu I heißt: −k : ' + b2 + ' = ' + n(m1) + ' ⇒ <b>k = ' + n(ans) + '</b>. Die y-Achsenabschnitte ' + n(t1) + ' und ' + n(c2 / b2) + ' sind verschieden, also gibt es wirklich keinen Schnittpunkt.',
          mistakes: function (v) { var k = M.parseNum(v[0]); if (k === -ans) return 'Achte auf das Vorzeichen: Beim Umstellen wird aus kx auf der rechten Seite −kx.'; if (k === m1) return 'Das ist die Steigung von I. Die Gleichung II steht aber noch nicht in der Form y = mx + b.'; return null; },
          verify: function () { var e2k = eqG(ans, b2, c2); var a = holds(e2k, 0, c2 / b2) && holds(e2k, 1, c2 / b2 + m1); return (a && c2 / b2 !== t1) || 'k falsch'; } };
      }
      var ask = M.rnd(0, 1);
      if (ask === 0) {
        if (t2 === t1) t2 = t1 + 3;
        var eA = eqY(m1, t1), eB = 'y = mx' + cst(t2);
        return { skill: 'Parameter: keine Lösung', level: lvl, q: 'Für welchen Wert von m hat das Gleichungssystem <b>keine Lösung</b>?' + sys(eA, eB),
          inputs: [{ kind: 'num', answer: m1, label: 'm =' }],
          hints: ['Keine Lösung bedeutet: Die Geraden haben keinen gemeinsamen Punkt.', 'Das passiert bei parallelen Geraden. Parallele Geraden haben dieselbe Steigung.', 'Die Steigung von I ist ' + n(m1) + '.'],
          solution: 'Für <b>m = ' + n(m1) + '</b> haben beide Geraden dieselbe Steigung. Die y-Achsenabschnitte ' + n(t1) + ' und ' + n(t2) + ' sind verschieden. Die Geraden sind parallel, es gibt keine Lösung.',
          mistakes: function (v) { var k = M.parseNum(v[0]); if (k === t2 || k === t1) return 'Gesucht ist die Steigung m (die Zahl vor dem x), nicht der y-Achsenabschnitt.'; if (k === -m1) return 'Parallele Geraden haben genau dieselbe Steigung, auch mit demselben Vorzeichen.'; return null; },
          verify: function () { return (t1 !== t2) || 'nicht parallel'; } };
      }
      var m2 = m1, eC = eqY(m1, t1), eD = eqY(m2, 0).replace(/ = (.*)$/, ' = $1 + b');
      return { skill: 'Parameter: unendlich viele Lösungen', level: lvl, q: 'Für welchen Wert von b hat das Gleichungssystem <b>unendlich viele Lösungen</b>?' + sys(eC, eD),
        inputs: [{ kind: 'num', answer: t1, label: 'b =' }],
        hints: ['Unendlich viele Lösungen gibt es, wenn beide Gleichungen dieselbe Gerade beschreiben.', 'Die Steigungen sind schon gleich. Auch die y-Achsenabschnitte müssen gleich sein.', 'Der y-Achsenabschnitt von I ist ' + n(t1) + '.'],
        solution: 'Für <b>b = ' + n(t1) + '</b> sind beide Gleichungen gleich: ' + eC + '. Beide Geraden liegen aufeinander. Jeder Punkt der Geraden ist eine Lösung.',
        mistakes: function (v) { var k = M.parseNum(v[0]); if (k === m1 && m1 !== t1) return 'Das ist die Steigung. Gesucht ist der y-Achsenabschnitt b.'; if (k === -t1) return 'Achte auf das Vorzeichen des y-Achsenabschnitts von I.'; return null; },
        verify: function () { return holds(eD.replace('b', par(t1)), 3, 3 * m1 + t1) || 'b falsch'; } };
    },
    sach: function () {
      for (var t = 0; t < 300; t++) {
        var ctx = M.pick([['einen Fahrradverleih', 'Stunden', 'Stunden', 'pro Stunde'], ['eine Kletterhalle', 'Besuche', 'Besuchen', 'pro Besuch'], ['einen Musikkurs', 'Termine', 'Terminen', 'pro Termin']]);
        var gA = M.pick([0, 2, 4, 5, 6, 8, 10]), pA = M.pick([2, 3, 4, 5, 6]), gB = M.pick([0, 4, 6, 8, 10, 12, 15, 20]), pB = M.pick([1, 2, 3, 4]);
        if (pA <= pB || gB <= gA) continue;
        var x = (gB - gA) / (pA - pB); if (x !== Math.round(x) || x < 3 || x > 8) continue;
        var y = gA + pA * x, ymax = Math.ceil((Math.max(gA + pA * 10, gB + pB * 10) + 1) / 10) * 10; if (ymax > 70) continue;
        var e1 = 'y = ' + pA + 'x' + cst(gA), e2 = 'y = ' + pB + 'x' + cst(gB), gy = ymax > 40 ? 5 : 2;
        var G = graph([{ m: pA, b: gA, label: 'A' }, { m: pB, b: gB, label: 'B', labelPos: 'below' }], { x: [0, 10], y: [0, ymax], gx: 1, gy: gy, lx: 2, ly: gy * 2, w: 300, h: 260, tx: 'x', ty: 'y', label: 'Kosten der Angebote A und B' });
        return { skill: 'Sachaufgabe grafisch lösen', level: 3, q: 'Zwei Angebote für ' + ctx[0] + ':<br>Angebot A: ' + (gA ? gA + ' € Grundgebühr und ' : '') + pA + ' € ' + ctx[3] + '.<br>Angebot B: ' + gB + ' € Grundgebühr und ' + pB + ' € ' + ctx[3] + '.<br>Bei wie vielen ' + ctx[1] + 'n kosten beide Angebote gleich viel? Wie hoch sind dann die Kosten?' + G,
          inputs: pairIn(x, y, 'Anzahl ' + ctx[1], 'Kosten', null, '€'),
          hints: ['x = Anzahl ' + ctx[1] + ', y = Kosten in €. A: ' + e1 + ', B: ' + e2 + '.', 'Gleich teuer sind die Angebote am Schnittpunkt der beiden Geraden.', 'Der Schnittpunkt liegt bei x = ' + x + '. Berechne y mit A: ' + pA + ' · ' + x + cst(gA) + '.'],
          solution: 'A: ' + e1 + ', B: ' + e2 + '. Die Geraden schneiden sich in S(' + x + ' | ' + y + '). Bei <b>' + x + ' ' + ctx[1] + 'n</b> kosten beide <b>' + y + ' €</b>. Probe: A: ' + pA + ' · ' + x + cst(gA) + ' = ' + y + ' ✓, B: ' + pB + ' · ' + x + ' + ' + gB + ' = ' + y + ' ✓. Darunter ist A günstiger, darüber B.',
          mistakes: pairMis(x, y),
          verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'S falsch'; } };
      }
      return gen.grafisch(2);
    },
    transfer: function () {
      for (var t = 0; t < 300; t++) {
        var p = M.pick([2, 3, 4, -2]), q = M.pick([2, 3, -1, 4]), c2 = M.nz(-6, 8), c1 = M.nz(-15, 15);
        if (c1 === p * c2) continue;
        var a = p * q, e1 = coef(p, 'x', true) + ' + ay = ' + n(c1), e2 = 'x' + coef(q, 'y', false) + ' = ' + n(c2);
        return { skill: 'Anzahl der Lösungen mit Parameter', level: 3, q: 'Gegeben ist das Gleichungssystem' + sys(e1, e2) + '<br>a) Für welchen Wert von a hat das System <b>keine Lösung</b>?<br>b) Ändere nun die Zahl rechts in Gleichung I. Welche Zahl muss dort stehen, damit das System (mit diesem a) <b>unendlich viele Lösungen</b> hat?',
          inputs: [{ kind: 'num', answer: a, label: 'a) a =' }, { kind: 'num', answer: p * c2, label: 'b) Zahl rechts in I' }],
          hints: ['Keine Lösung heißt: Die Geraden sind parallel. Dann passen die linken Seiten der beiden Gleichungen zueinander (die eine ist ein Vielfaches der anderen), die rechten Seiten aber nicht.', 'Multipliziere Gleichung II mit ' + par(p) + ': ' + eqG(p, p * q, p * c2) + '.', 'Vergleiche mit Gleichung I: Die x-Glieder stimmen schon überein. Welches a macht auch die y-Glieder gleich? Für b) muss dann auch rechts dieselbe Zahl stehen.'],
          solution: 'a) Gleichung II · ' + par(p) + ' ergibt ' + eqG(p, p * q, p * c2) + '. Für <b>a = ' + n(a) + '</b> stimmen die linken Seiten von I und II überein, die rechten Seiten (' + n(c1) + ' und ' + n(p * c2) + ') aber nicht. Die Geraden sind parallel: keine Lösung.<br>b) Steht in I rechts <b>' + n(p * c2) + '</b>, ist I genau das ' + n(p) + '-Fache von II. Beide beschreiben dieselbe Gerade: unendlich viele Lösungen.',
          mistakes: function (v) { var k = M.parseNum(v[0]); if (k === -a) return 'Achte beim Vergleich der Steigungen auf das Vorzeichen.'; return null; },
          verify: function () { var E1 = eqG(p, a, c1), E1b = eqG(p, a, p * c2); var ys = function (x) { return (c2 - x) / q; }; return (!holds(E1, 0, ys(0)) && !holds(E1, 5, ys(5)) && holds(E1b, 0, ys(0)) && holds(E1b, 7, ys(7))) || 'Parameter falsch'; } };
      }
      return gen.parameter(3);
    }
  };

  var GS = [{ m: 1, b: 1 }, { m: -2, b: 4 }, { m: 0.5, b: -2 }];
  function smallG(lines, cap, txt) { return '<div style="flex:1 1 180px;max-width:220px"><p style="margin:4px 0;font-weight:700">' + cap + '</p>' + graph(lines, { r: 4, maxw: 210, label: cap }) + '<p style="margin:2px 0;font-size:.92rem">' + txt + '</p></div>'; }

  return {
    id: '002', title: 'Gleichungssysteme grafisch lösen', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Lineare Funktionen y = mx + b zeichnen, Lösung eines Gleichungssystems (Modul 001)',
    lead: 'Jede Gleichung ist eine Gerade. Wo sich zwei Geraden schneiden, liegt die Lösung. Und manchmal schneiden sie sich gar nicht.',
    einstieg: { html: '<p>Jonas möchte am Wochenende ein Fahrrad leihen. Verleih A verlangt <b>2 € Grundgebühr und 3 € pro Stunde</b>. Verleih B verlangt <b>8 € Grundgebühr und 1,50 € pro Stunde</b>.</p><p class="note">Bei wie vielen Stunden kosten beide Verleihe gleich viel? Welcher ist für eine kurze Tour günstiger, welcher für eine lange?</p><p>Zeichnest du die Kosten beider Angebote als Geraden, siehst du die Antwort auf einen Blick: am <b>Schnittpunkt</b>. In diesem Modul löst du Gleichungssysteme mit Graphen.</p>' },
    ziele: ['Ich stelle eine lineare Gleichung nach y um.', 'Ich zeichne die beiden Geraden eines Gleichungssystems.', 'Ich lese die Lösung als Schnittpunkt ab und mache die Probe.', 'Ich erkenne, ob ein System keine, genau eine oder unendlich viele Lösungen hat.', 'Ich begründe die Anzahl der Lösungen mit der Steigung m und dem y-Achsenabschnitt b.'],
    fachwoerter: [['Schnittpunkt', 'Der Punkt, der auf beiden Geraden liegt. Seine Koordinaten sind die Lösung des Gleichungssystems.'], ['Parallele Geraden', 'Geraden mit gleicher Steigung, aber verschiedenem y-Achsenabschnitt. Sie schneiden sich nie: keine Lösung.'], ['Identische Geraden', 'Beide Gleichungen beschreiben dieselbe Gerade. Jeder Punkt ist gemeinsam: unendlich viele Lösungen.'], ['Leere Menge', 'Die Lösungsmenge ohne Elemente, geschrieben L = { }.']],
    diagnose: [
      { q: 'Welche Steigung hat die Gerade y = −3x + 2?', options: ['−3', '2', '3', 'Weiß ich noch nicht'], answer: 0, why: 'Die Zahl vor dem x ist die Steigung m = −3.', review: 'Steigung und y-Achsenabschnitt (Klasse 8)' },
      { q: 'Wo schneidet die Gerade y = 2x − 4 die y-Achse?', options: ['(0 | −4)', '(0 | 2)', '(−4 | 0)', 'Weiß ich noch nicht'], answer: 0, why: 'Bei x = 0 ist y = −4. Der y-Achsenabschnitt ist b = −4.', review: 'y-Achsenabschnitt ablesen' },
      { q: 'Löse die Gleichung 3y = 12 − 6x nach y auf.', options: ['y = 4 − 2x', 'y = 4 − 6x', 'y = 12 − 2x', 'Weiß ich noch nicht'], answer: 0, why: 'Teile jedes Glied durch 3: y = 4 − 2x.', review: 'Gleichungen umformen' },
      { q: 'Welcher Punkt liegt 2 nach links und 3 nach oben vom Ursprung?', options: ['(−2 | 3)', '(3 | −2)', '(2 | −3)', 'Weiß ich noch nicht'], answer: 0, why: 'x = −2 (links), y = 3 (oben).', review: 'Punkte im Koordinatensystem' }],
    erklaerung:
      '<h3>1. Jede Gleichung ist eine Gerade</h3><p>Die Lösungen von <b>x + y = 5</b> sind Zahlenpaare wie (0 | 5), (2 | 3), (5 | 0). Als Punkte gezeichnet liegen sie auf einer Geraden. Um sie leicht zu zeichnen, stellst du die Gleichung <b>nach y um</b>:</p><p class="big-math">x + y = 5 &nbsp;|&nbsp; − x &nbsp;⇒&nbsp; y = −x + 5</p><p>Bei <b>2x − y = 1</b>: −y = −2x + 1 &nbsp;|&nbsp; · (−1) &nbsp;⇒&nbsp; <b>y = 2x − 1</b>.</p>' +
      '<h3>2. Lösung = Schnittpunkt</h3><p>Zeichne beide Geraden. Der Schnittpunkt liegt auf beiden Geraden, seine Koordinaten erfüllen also beide Gleichungen.</p>' +
      graph([{ m: -1, b: 5, label: 'I' }, { m: 2, b: -1, label: 'II', labelPos: 'below' }], { marks: [{ x: 2, y: 3, text: 'S(2 | 3)', color: '#d97706', dx: 10, dy: 4 }], label: 'Schnittpunkt S(2 | 3)' }) + '<p><span style="color:#1d4ed8;font-weight:700">I: y = −x + 5</span> &nbsp; <span style="color:#0f766e;font-weight:700">II: y = 2x − 1</span></p>' +
      '<p>Probe: I: 2 + 3 = 5 ✓ &nbsp; II: 2 · 2 − 3 = 1 ✓ &nbsp; Also <b>L = {(2 | 3)}</b>.</p>' +
      '<div class="merk"><b>Merke:</b> So löst du ein Gleichungssystem grafisch:<br>1. Beide Gleichungen nach y umstellen (y = mx + b).<br>2. Beide Geraden zeichnen: bei b auf der y-Achse starten, mit der Steigung m weiter.<br>3. Den Schnittpunkt S ablesen. Seine Koordinaten sind die Lösung.<br>4. Probe in beiden Gleichungen.</div>' +
      '<h3>3. Wie viele Lösungen gibt es?</h3><div style="display:flex;flex-wrap:wrap;gap:12px">' +
      smallG([{ m: 1, b: 1 }, { m: -1, b: -1 }], 'Verschiedene m', 'Die Geraden schneiden sich: <b>genau eine Lösung</b>.') +
      smallG([{ m: 0.5, b: 2 }, { m: 0.5, b: -1 }], 'Gleiches m, anderes b', 'Parallele Geraden: <b>keine Lösung</b>, L = { }.') +
      smallG([{ m: -1, b: 1 }, { m: -1, b: 1, dash: true }], 'Gleiches m, gleiches b', 'Dieselbe Gerade: <b>unendlich viele Lösungen</b>.') + '</div>' +
      '<p class="note"><b>Grenzen:</b> Ablesen ist nur genau, wenn der Schnittpunkt auf Gitterpunkten liegt. Sonst rechnest du die Lösung aus. Die Rechenverfahren lernst du in den nächsten Modulen.</p>',
    entdecken: {
      html: '<p>Wähle Gerade I und verändere Gerade II mit den Reglern. Beobachte den Schnittpunkt und die Anzahl der Lösungen.</p><div class="ctl"><label>Gerade I: <select id="e_g1">' + GS.map(function (g, i) { return '<option value="' + i + '">' + eqY(g.m, g.b) + '</option>'; }).join('') + '</select></label></div><div class="ctl"><label>m = <b id="v_m"></b> <input type="range" id="r_m" min="-3" max="3" step="0.5" value="-1"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="-5" max="5" step="1" value="2"></label></div><div id="e_g"></div><div id="e_txt"></div><ul><li>Stelle Gerade II parallel zu Gerade I ein.</li><li>Kannst du Gerade II genau auf Gerade I legen?</li></ul>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var g = GS[+root.querySelector('#e_g1').value], m = +root.querySelector('#r_m').value, b = +root.querySelector('#r_b').value;
          root.querySelector('#v_m').textContent = n(m); root.querySelector('#v_b').textContent = n(b);
          var marks = [], txt = '<div class="big-math">' + sys(eqY(g.m, g.b), eqY(m, b)) + '</div>';
          if (m === g.m && b === g.b) txt += '<p class="fb good"><b>Unendlich viele Lösungen:</b> Beide Gleichungen beschreiben dieselbe Gerade.</p>';
          else if (m === g.m) txt += '<p class="fb bad"><b>Keine Lösung:</b> Gleiche Steigung ' + n(m) + ', aber verschiedene y-Achsenabschnitte. Die Geraden sind parallel.</p>';
          else {
            var x = (b - g.b) / (g.m - m), y = g.m * x + g.b, whole = Math.abs(x - Math.round(x)) < 1e-9 && Math.abs(y - Math.round(y)) < 1e-9;
            if (Math.abs(x) <= 6.4 && Math.abs(y) <= 6.4) marks.push({ x: x, y: y, text: 'S', color: '#d97706' });
            txt += '<p class="fb good"><b>Genau eine Lösung:</b> S(' + n(Math.round(x * 100) / 100) + ' | ' + n(Math.round(y * 100) / 100) + ')' + (whole ? ' liegt auf einem Gitterpunkt und lässt sich genau ablesen.' : '. Hier ist genaues Ablesen schwierig.') + (Math.abs(x) > 6.4 || Math.abs(y) > 6.4 ? ' Der Schnittpunkt liegt außerhalb des Bildes.' : '') + '</p>';
          }
          root.querySelector('#e_g').innerHTML = graph([{ m: g.m, b: g.b, label: 'I' }, { m: m, b: b, label: 'II', labelPos: 'below', dash: m === g.m && b === g.b }], { marks: marks, label: 'Geraden I und II' });
          root.querySelector('#e_txt').innerHTML = txt;
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Verschiedene Steigungen ergeben genau einen Schnittpunkt. Gleiche Steigung mit anderem b ergibt parallele Geraden ohne Lösung. Stimmen m und b überein, gibt es unendlich viele Lösungen.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_g1').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Fahrradverleih', q: 'Verleih A: 2 € Grundgebühr und 3 € pro Stunde. Verleih B: 8 € Grundgebühr und 1,50 € pro Stunde. Wann kosten beide gleich viel?',
      steps: ['Variablen: x = Ausleihdauer in Stunden, y = Kosten in €.', 'Gleichungen: A: y = 3x + 2, B: y = 1,5x + 8. Beide stehen schon in der Form y = mx + b.', 'Geraden zeichnen: A startet bei 2 und steigt um 3 pro Stunde. B startet bei 8 und steigt um 1,5 pro Stunde.' + graph([{ m: 3, b: 2, label: 'A' }, { m: 1.5, b: 8, label: 'B', labelPos: 'below' }], { x: [0, 8], y: [0, 24], gx: 1, gy: 2, lx: 2, ly: 4, w: 280, h: 240, tx: 'h', ty: '€', marks: [{ x: 4, y: 14, text: 'S(4 | 14)', color: '#d97706', dx: 10, dy: 14 }], label: 'Kosten der Verleihe A und B' }), 'Schnittpunkt ablesen: S(4 | 14). Probe: A: 3 · 4 + 2 = 14 ✓, B: 1,5 · 4 + 8 = 14 ✓', 'Antwort: Bei <b>4 Stunden</b> kosten beide <b>14 €</b>. Für kürzere Touren ist A günstiger, für längere B.'] },
    tasks: { gen: gen, plan: { G: ['umstellen:1', 'lage_graph:1', 'ablesen:1', 'grafisch:1'], S: ['umstellen:2', 'ablesen:1', 'grafisch:2', 'anzahl:2', 'passend:2'], E: ['umstellen:3', 'grafisch:3', 'anzahl:3', 'passend:2', 'parameter:2', 'sach:3'] },
      extra: 'transfer', test: ['umstellen:2', 'ablesen:1', 'lage_graph:1', 'grafisch:2', 'anzahl:2', 'parameter:2'] },
    lerncheck: ['Ich stelle eine lineare Gleichung nach y um.', 'Ich löse ein Gleichungssystem grafisch und mache die Probe.', 'Ich erkenne an m und b, wie viele Lösungen ein System hat.', 'Ich nutze Graphen, um Angebote zu vergleichen.']
  };
})();
