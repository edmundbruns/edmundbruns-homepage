/* Modul 003 (Klasse 9) · Gleichsetzungsverfahren */
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
  /* unabhängige Kontrolle: Gleichungstext parsen und (x|y) einsetzen */
  function holds(s, x, y) {
    var p = String(s).replace(/<[^>]+>/g, '').replace(/(\d) (?=\d{3})/g, '$1').split('=');
    if (p.length !== 2) return false;
    try { var L = M.evalTree(M.parseTerm(p[0]), { x: x, y: y }), R = M.evalTree(M.parseTerm(p[1]), { x: x, y: y }); return Math.abs(L - R) < 1e-9; } catch (e) { return false; }
  }
  var LBL = 'display:inline-block;min-width:2.1em;color:#1d4ed8';
  function sys(e1, e2) { return '<div style="display:table;border-left:3px solid #1e3a8a;padding:4px 0 4px 12px;margin:8px 0;font-size:1.25rem;font-weight:700;line-height:1.75"><div><span style="' + LBL + '">I</span>' + e1 + '</div><div><span style="' + LBL + '">II</span>' + e2 + '</div></div>'; }
  function pair(x, y) { return '(' + n(x) + ' | ' + n(y) + ')'; }
  /* a·x + b·y mit eingesetzten Zahlen */
  function subst(a, b, x, y) {
    var s = (a === 1 ? par(x) : a === -1 ? '−' + par(x) : n(a) + ' · ' + par(x));
    var k = Math.abs(b); s += (b < 0 ? ' − ' : ' + ') + (k === 1 ? par(y) : n(k) + ' · ' + par(y));
    return s + ' = ' + n(a * x + b * y);
  }
  function pairIn(x, y, lx, ly, unit) { return [{ kind: 'num', answer: x, label: lx || 'x =', unit: unit }, { kind: 'num', answer: y, label: ly || 'y =', unit: unit }]; }
  function pairMis(x, y, nameX, nameY, extra) {
    return function (v) {
      var a = M.parseNum(v[0]), b = M.parseNum(v[1]); if (a === null || b === null) return null;
      if (extra) { var r = extra(a, b); if (r) return r; }
      if (a === y && b === x && x !== y) return 'Du hast ' + (nameX || 'x') + ' und ' + (nameY || 'y') + ' vertauscht. Mache die Probe in beiden Gleichungen.';
      if (a === x && b !== y) return (nameX || 'x') + ' stimmt schon. Berechne ' + (nameY || 'y') + ' noch einmal sorgfältig, zum Beispiel mit Gleichung I.';
      if (b === y && a !== x) return (nameY || 'y') + ' stimmt schon, ' + (nameX || 'x') + ' aber noch nicht. Setze y in eine Gleichung ein.';
      return null;
    };
  }
  function tab(rows) { return '<div style="overflow-x:auto"><table class="tab">' + rows.map(function (r) { return '<tr>' + r.map(function (c, i) { return i === 0 ? '<th>' + c + '</th>' : '<td>' + c + '</td>'; }).join('') + '</tr>'; }).join('') + '</table></div>'; }
  function cst(c) { return c === 0 ? '' : c < 0 ? ' − ' + n(-c) : ' + ' + n(c); }
  function rhs(m, t) { return m ? coef(m, 'x', true) + cst(t) : n(t); }
  function eqY(m, t) { return 'y = ' + rhs(m, t); }
  function eqX(p, q) { return 'x = ' + (p ? coef(p, 'y', true) + cst(q) : n(q)); }
  function calcY(m, t, x) { return m === 0 ? n(t) : (m === 1 ? par(x) : m === -1 ? (x < 0 ? '−' + par(x) : '−1 · ' + n(x)) : n(m) + ' · ' + par(x)) + cst(t) + ' = ' + n(m * x + t); }
  /* Gleichung o = m·u + t, z. B. y = 2x − 1 oder x = 3y + 2 */
  function rhsV(m, t, u) { return m ? coef(m, u, true) + cst(t) : n(t); }
  function calcV(m, t, u0) { return calcY(m, t, u0); }
  function moveOps(m2, t1, u) {
    var ops = [];
    if (m2) ops.push(m2 > 0 ? '− ' + coef(m2, u, true) : '+ ' + coef(-m2, u, true));
    if (t1) ops.push(t1 > 0 ? '− ' + n(t1) : '+ ' + n(-t1));
    return ops.length ? ' &nbsp;|&nbsp; ' + ops.join(' &nbsp;') : '';
  }
  /* vollständiger Lösungsweg für o = m1·u + t1, o = m2·u + t2 */
  function steps(m1, t1, m2, t2, u, o) {
    var d = m1 - m2, e = t2 - t1, u0 = e / d, o0 = m1 * u0 + t1;
    return { u0: u0, o0: o0, d: d, e: e, lines: [
      '<b>Gleichsetzen:</b> ' + rhsV(m1, t1, u) + ' = ' + rhsV(m2, t2, u) + moveOps(m2, t1, u),
      '<b>Sortieren:</b> ' + coef(d, u, true) + ' = ' + n(e) + (d !== 1 ? ' &nbsp;|&nbsp; : ' + par(d) : ''),
      '<b>Auflösen:</b> ' + u + ' = ' + n(u0),
      '<b>Einsetzen in I:</b> ' + o + ' = ' + calcV(m1, t1, u0),
      '<b>Probe in II:</b> ' + calcV(m2, t2, u0) + ' ✓'] };
  }
  function stepHtml(S) { return S.lines.join('<br>'); }
  /* System y = m1x + t1, y = m2x + t2 mit ganzzahliger Lösung */
  function ySys(lvl) {
    var Ms = lvl <= 1 ? [1, 2, 3, 4, -1, -2] : [1, 2, 3, 4, 5, -1, -2, -3, -4, 0];
    for (var k = 0; k < 300; k++) {
      var m1 = M.pick(Ms), m2 = M.pick(Ms); if (m1 === m2) continue;
      var x = lvl <= 1 ? M.rnd(-2, 6) : M.rnd(-5, 7), y = M.rnd(-6, 9), t1 = y - m1 * x, t2 = y - m2 * x;
      if (Math.abs(t1) > 15 || Math.abs(t2) > 15 || t1 === t2) continue;
      return { m1: m1, t1: t1, m2: m2, t2: t2, x: x, y: y };
    }
    return { m1: 2, t1: -1, m2: -1, t2: 5, x: 2, y: 3 };
  }
  function signMis(x, y) { return pairMis(x, y, 'x', 'y', function (a, b) { if (a === -x && x !== 0 && b !== y) return 'Prüfe die Vorzeichen beim Sortieren: Was du auf die andere Seite bringst, bekommt das umgekehrte Rechenzeichen.'; return null; }); }

  var gen = {
    beide_y: function (lvl) {
      var s = ySys(lvl), e1 = eqY(s.m1, s.t1), e2 = eqY(s.m2, s.t2), S = steps(s.m1, s.t1, s.m2, s.t2, 'x', 'y');
      return { skill: 'Gleichsetzen: beide nach y aufgelöst', level: lvl <= 1 ? 1 : 2, q: 'Löse das Gleichungssystem mit dem Gleichsetzungsverfahren. Gib x und y an.' + sys(e1, e2),
        inputs: pairIn(s.x, s.y),
        hints: ['Beide Gleichungen beginnen mit „y =“. Setze die rechten Seiten gleich: ' + rhs(s.m1, s.t1) + ' = ' + rhs(s.m2, s.t2) + '.', 'Bringe alle x nach links und alle Zahlen nach rechts. Du erhältst ' + coef(S.d, 'x', true) + ' = ' + n(S.e) + '.', 'x = ' + n(s.x) + '. Setze x in Gleichung I ein, um y zu berechnen.'],
        solution: stepHtml(S) + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
        mistakes: signMis(s.x, s.y),
        verify: function () { return (holds(e1, s.x, s.y) && holds(e2, s.x, s.y) && S.u0 === s.x && S.o0 === s.y) || 'Lösung falsch'; } };
    },
    beide_x: function (lvl) {
      var s = ySys(lvl), e1 = eqX(s.m1, s.t1), e2 = eqX(s.m2, s.t2), S = steps(s.m1, s.t1, s.m2, s.t2, 'y', 'x');
      /* hier ist s.x der y-Wert und s.y der x-Wert */
      var X = s.y, Y = s.x;
      return { skill: 'Gleichsetzen: beide nach x aufgelöst', level: 2, q: 'Löse das Gleichungssystem mit dem Gleichsetzungsverfahren. Hier sind beide Gleichungen nach <b>x</b> aufgelöst.' + sys(e1, e2),
        inputs: pairIn(X, Y),
        hints: ['Setze die rechten Seiten gleich: ' + rhsV(s.m1, s.t1, 'y') + ' = ' + rhsV(s.m2, s.t2, 'y') + '. Jetzt kommt nur noch y vor.', 'Sortiere: ' + coef(S.d, 'y', true) + ' = ' + n(S.e) + '. Also y = ' + n(Y) + '.', 'Setze y = ' + n(Y) + ' in Gleichung I ein und berechne x. Gib danach beide Werte an.'],
        solution: stepHtml(S) + '<br><b>L = {' + pair(X, Y) + '}</b> <small>(Achtung: Im Zahlenpaar steht trotzdem zuerst x.)</small>',
        mistakes: pairMis(X, Y, 'x', 'y'),
        verify: function () { return (holds(e1, X, Y) && holds(e2, X, Y)) || 'Lösung falsch'; } };
    },
    schritt: function (lvl) {
      var s = ySys(lvl); if (s.t2 === 0 || s.m2 === 0) return gen.schritt(lvl);
      var A = rhs(s.m1, s.t1), B = rhs(s.m2, s.t2);
      var right = A + ' = ' + B;
      var w1 = A + ' = ' + rhs(-s.m2, -s.t2), w2 = rhs(s.m1, s.t2) + ' = ' + rhs(s.m2, s.t1), w3 = A + ' = ' + rhs(s.m2, -s.t2);
      var all = [[right, 0], [w1, 1], [w2, 2], [w3, 3]];
      var keys = all.map(function (o) { return o[0]; });
      if (new Set(keys).size !== 4) return gen.schritt(lvl);
      for (var i = 1; i < 4; i++) if (holds(all[i][0], s.x, 0)) return gen.schritt(lvl);
      all = M.shuffle(all);
      return { skill: 'Gleichsetzen: erster Schritt', level: 1, q: 'Welche Gleichung entsteht, wenn du beim Gleichsetzungsverfahren die rechten Seiten gleichsetzt?' + sys(eqY(s.m1, s.t1), eqY(s.m2, s.t2)),
        inputs: [{ kind: 'mc', label: 'Gleichung mit nur einer Variablen', options: all.map(function (o) { return o[0]; }), answer: all.findIndex(function (o) { return o[1] === 0; }) }],
        hints: ['Beide Gleichungen haben links „y“. Also müssen auch die rechten Seiten gleich sein.', 'Schreibe die rechte Seite von I, ein Gleichheitszeichen und die rechte Seite von II.', 'Die Terme werden dabei genau abgeschrieben. Kein Vorzeichen ändert sich.'],
        solution: 'Richtig ist <b>' + right + '</b>. Die rechten Seiten werden unverändert gleichgesetzt. Daraus folgt x = ' + n(s.x) + '.',
        mistakes: function (v) { var o = all[+v[0]]; if (!o) return null; if (o[1] === 1) return 'Beim Gleichsetzen ändert sich kein Vorzeichen. Du schreibst die rechte Seite von II genau ab.'; if (o[1] === 2) return 'Die Zahlen sind vertauscht. Links steht die ganze rechte Seite von I.'; if (o[1] === 3) return 'Achte auf das Vorzeichen der Zahl in Gleichung II.'; return null; },
        verify: function () { return holds(right, s.x, 0) || 'Gleichsetzen falsch'; } };
    },
    umformen_dann: function (lvl) {
      for (var k = 0; k < 300; k++) {
        var s = ySys(2), b = lvl >= 3 ? M.pick([2, -2, 3]) : M.pick([1, -1]);
        var a = -s.m2 * b, c = s.t2 * b; if (a === 0) continue;
        var e1 = eqY(s.m1, s.t1), e2 = eqG(a, b, c), S = steps(s.m1, s.t1, s.m2, s.t2, 'x', 'y');
        var um = e2 + (a > 0 ? ' &nbsp;|&nbsp; − ' + coef(a, 'x', true) : ' &nbsp;|&nbsp; + ' + coef(-a, 'x', true)) + '<br>' + coef(b, 'y', true) + ' = ' + rhs(-a, c) + (b !== 1 ? ' &nbsp;|&nbsp; : ' + par(b) + '<br>' + eqY(s.m2, s.t2) : '');
        return { skill: 'Erst umstellen, dann gleichsetzen', level: lvl >= 3 ? 3 : 2, q: 'Löse das Gleichungssystem mit dem Gleichsetzungsverfahren. Stelle dazu zuerst Gleichung II nach y um.' + sys(e1, e2),
          inputs: pairIn(s.x, s.y),
          hints: ['Stelle II nach y um. Bringe das x-Glied auf die rechte Seite' + (b !== 1 ? ' und teile durch ' + par(b) : '') + '.', 'Gleichung II lautet umgestellt: ' + eqY(s.m2, s.t2) + '. Setze jetzt gleich: ' + rhs(s.m1, s.t1) + ' = ' + rhs(s.m2, s.t2) + '.', 'Du erhältst ' + coef(S.d, 'x', true) + ' = ' + n(S.e) + ', also x = ' + n(s.x) + '. Berechne y mit Gleichung I.'],
          solution: '<b>II umstellen:</b> ' + um + '<br>' + stepHtml(S) + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: signMis(s.x, s.y),
          verify: function () { return (holds(e1, s.x, s.y) && holds(e2, s.x, s.y)) || 'Lösung falsch'; } };
      }
    },
    beide_umformen: function () {
      for (var k = 0; k < 300; k++) {
        var s = ySys(2), b1 = M.pick([1, -1, 2]), b2 = M.pick([1, -1, 3, -2]);
        var a1 = -s.m1 * b1, c1 = s.t1 * b1, a2 = -s.m2 * b2, c2 = s.t2 * b2; if (a1 === 0 || a2 === 0) continue;
        var e1 = eqG(a1, b1, c1), e2 = eqG(a2, b2, c2), S = steps(s.m1, s.t1, s.m2, s.t2, 'x', 'y');
        return { skill: 'Beide Gleichungen umstellen', level: 3, q: 'Löse das Gleichungssystem mit dem Gleichsetzungsverfahren.' + sys(e1, e2),
          inputs: pairIn(s.x, s.y),
          hints: ['Stelle beide Gleichungen nach y um.', 'I: ' + eqY(s.m1, s.t1) + ' und II: ' + eqY(s.m2, s.t2) + '.', 'Gleichsetzen ergibt ' + coef(S.d, 'x', true) + ' = ' + n(S.e) + '. Also x = ' + n(s.x) + '.'],
          solution: '<b>Umstellen:</b> I: ' + eqY(s.m1, s.t1) + ', II: ' + eqY(s.m2, s.t2) + '<br>' + stepHtml(S) + '<br><b>L = {' + pair(s.x, s.y) + '}</b>',
          mistakes: signMis(s.x, s.y),
          verify: function () { return (holds(e1, s.x, s.y) && holds(e2, s.x, s.y)) || 'Lösung falsch'; } };
      }
    },
    sonderfall: function (lvl) {
      var kind = M.rnd(0, 2), m = M.pick([2, 3, -2, -1, 4]), t1 = M.rnd(-8, 8), m2 = m, t2 = t1, e2;
      if (kind === 0) { do { t2 = M.rnd(-8, 8); } while (t2 === t1); }
      if (kind === 1) { do { m2 = M.pick([1, 2, 3, -1, -2, -3]); } while (m2 === m); t2 = M.rnd(-8, 8); if ((t2 - t1) % (m - m2)) return gen.sonderfall(lvl); }
      var e1 = eqY(m, t1);
      if (lvl >= 3) { var b = M.pick([2, 3, -1]); e2 = eqG(-m2 * b, b, t2 * b); } else e2 = eqY(m2, t2);
      var opts = ['keine Lösung', 'genau eine Lösung', 'unendlich viele Lösungen'];
      var line = rhs(m, t1) + ' = ' + rhs(m2, t2), res;
      if (kind === 0) res = rhs(m, t1) + ' = ' + rhs(m2, t2) + ' &nbsp;|&nbsp; ' + (m > 0 ? '− ' : '+ ') + coef(Math.abs(m), 'x', true) + '<br>' + n(t1) + ' = ' + n(t2) + ' &nbsp;<b>Das ist falsch.</b> Es gibt kein x, das passt: <b>keine Lösung</b>, L = { }.';
      else if (kind === 2) res = line + ' &nbsp;|&nbsp; ' + (m > 0 ? '− ' : '+ ') + coef(Math.abs(m), 'x', true) + '<br>' + n(t1) + ' = ' + n(t2) + ' &nbsp;<b>Das ist immer wahr.</b> Jedes x passt: <b>unendlich viele Lösungen</b>.';
      else { var x = (t2 - t1) / (m - m2); res = line + '<br>' + coef(m - m2, 'x', true) + ' = ' + n(t2 - t1) + ' ⇒ x = ' + n(x) + ', y = ' + n(m * x + t1) + ': <b>genau eine Lösung</b>.'; }
      return { skill: 'Sonderfälle beim Gleichsetzen', level: lvl >= 3 ? 3 : 2, q: 'Wende das Gleichsetzungsverfahren an. Wie viele Lösungen hat das Gleichungssystem?' + sys(e1, e2),
        inputs: [{ kind: 'mc', label: 'Das System hat …', options: opts, answer: kind }],
        hints: [lvl >= 3 ? 'Stelle zuerst Gleichung II nach y um: ' + eqY(m2, t2) + '.' : 'Setze die rechten Seiten gleich: ' + line + '.', 'Bringe alle x auf eine Seite. Was bleibt übrig?', 'Bleibt eine falsche Aussage wie 3 = 5 übrig, gibt es keine Lösung. Bleibt eine wahre Aussage wie 3 = 3 übrig, gibt es unendlich viele.'],
        solution: (lvl >= 3 ? 'II umgestellt: ' + eqY(m2, t2) + '.<br>' : '') + res,
        mistakes: function (v) { if (v[0] === '1' && kind !== 1) return 'Wenn das x beim Sortieren ganz verschwindet, kannst du kein x ausrechnen. Schau, ob die übrig gebliebene Aussage wahr oder falsch ist.'; if (v[0] === '0' && kind === 2) return 'Die übrig gebliebene Aussage ist wahr. Dann erfüllt jedes x die Gleichung.'; if (v[0] === '2' && kind === 0) return 'Die übrig gebliebene Aussage ist falsch. Dann gibt es kein passendes x.'; return null; },
        verify: function () { var c = 0; [-3, 0, 2, 5].forEach(function (x) { if (holds(e2, x, m * x + t1)) c++; }); return (kind === 2 ? c === 4 : kind === 0 ? c === 0 : c <= 1) || 'Fall falsch'; } };
    },
    sach: function () {
      var c = M.rnd(0, 2), x, y, e1, e2, txt, ux, uy, lx, ly, ans;
      for (var k = 0; k < 300; k++) {
        if (c === 0) { var A = M.pick([150, 180, 200, 240, 300]), r = M.pick([10, 12, 15, 20]), B = M.pick([0, 20, 30, 50]), f = M.pick([8, 10, 15, 25]); x = (A - B) / (r + f); if (x !== Math.round(x) || x < 3) continue; y = A - r * x; e1 = 'y = −' + r + 'x + ' + A; e2 = 'y = ' + f + 'x' + cst(B); txt = 'Aus Becken A mit ' + A + ' Litern Wasser fließen pro Minute ' + r + ' Liter ab. Becken B enthält ' + B + ' Liter und wird gleichzeitig mit ' + f + ' Litern pro Minute gefüllt.<br>Nach wie vielen Minuten enthalten beide Becken gleich viel Wasser? Wie viel ist es dann?'; ux = 'min'; uy = 'l'; lx = 'Zeit'; ly = 'Wassermenge'; ans = 'Nach ' + x + ' Minuten enthalten beide Becken ' + y + ' Liter.'; }
        else if (c === 1) { var sa = M.pick([60, 80, 100, 120, 150]), ra = M.pick([5, 10, 15]), sb = M.pick([0, 10, 20, 30]), rb = M.pick([20, 25, 30, 35]); if (rb <= ra) continue; x = (sa - sb) / (rb - ra); if (x !== Math.round(x) || x < 2 || x > 15) continue; y = sa + ra * x; e1 = 'y = ' + ra + 'x + ' + sa; e2 = 'y = ' + rb + 'x' + cst(sb); txt = 'Lea hat ' + sa + ' € gespart und legt jeden Monat ' + ra + ' € dazu. Ben hat ' + sb + ' € und spart jeden Monat ' + rb + ' €.<br>Nach wie vielen Monaten haben beide gleich viel Geld? Wie viel ist es dann?'; ux = 'Monate'; uy = '€'; lx = 'Zeit'; ly = 'Betrag'; ans = 'Nach ' + x + ' Monaten haben beide ' + y + ' €.'; }
        else { var ga = M.pick([3, 4, 5]), pa = M.pick([1.5, 2, 2.5]), gb = M.pick([6, 8, 9, 10]), pb = M.pick([1, 1.5]); if (pb >= pa || gb <= ga) continue; x = (gb - ga) / (pa - pb); if (x !== Math.round(x) || x < 2 || x > 20) continue; y = ga + pa * x; e1 = 'y = ' + n(pa) + 'x + ' + ga; e2 = 'y = ' + n(pb) + 'x + ' + gb; txt = 'Taxi A kostet ' + ga + ' € Grundgebühr und ' + M.fmtNum(pa, 2) + ' € pro Kilometer. Taxi B kostet ' + gb + ' € Grundgebühr und ' + M.fmtNum(pb, 2) + ' € pro Kilometer.<br>Bei welcher Strecke kosten beide Taxis gleich viel? Wie viel kostet die Fahrt dann?'; ux = 'km'; uy = '€'; lx = 'Strecke'; ly = 'Preis'; ans = 'Bei ' + x + ' km kosten beide ' + M.fmtNum(y, 2) + ' €.'; }
        break;
      }
      var mA = c === 0 ? -r : c === 1 ? ra : pa, tA = c === 0 ? A : c === 1 ? sa : ga, mB = c === 0 ? f : c === 1 ? rb : pb, tB = c === 0 ? B : c === 1 ? sb : gb, S = steps(mA, tA, mB, tB, 'x', 'y');
      return { skill: 'Sachaufgabe mit Gleichsetzen', level: 2, q: txt,
        inputs: [{ kind: 'num', answer: x, label: lx, unit: ux }, { kind: 'num', answer: y, label: ly, unit: uy, tol: 0.005 }],
        hints: ['Stelle für beide eine Gleichung auf (x = ' + (c === 2 ? 'Kilometer' : c === 0 ? 'Minuten' : 'Monate') + ', y = ' + ly + '): I: ' + e1 + ', II: ' + e2 + '.', '„Gleich viel“ heißt: gleiches y. Setze gleich: ' + rhs(mA, tA) + ' = ' + rhs(mB, tB) + '.', 'Du erhältst x = ' + n(x) + '. Setze x in I ein.'],
        solution: 'I: ' + e1 + ', II: ' + e2 + '<br>' + stepHtml(S) + '<br><b>' + ans + '</b>',
        mistakes: pairMis(x, y, 'die ' + lx, 'der Wert für ' + ly, function (a, b) { if (a === y && b !== x) return 'Im ersten Feld ist nach der ' + lx + ' gefragt (x), im zweiten nach dem Wert y.'; return null; }),
        verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
    },
    fehler: function () {
      for (var k = 0; k < 300; k++) {
        var s = ySys(2), d = s.m1 - s.m2, e = s.t2 - s.t1; if (Math.abs(d) < 2 || s.t1 === 0 || e === 0) continue;
        var err = M.rnd(2, 4), E = e, X, Y;
        var l1 = rhs(s.m1, s.t1) + ' = ' + rhs(s.m2, s.t2);
        if (err === 2) E = s.t2 + s.t1;
        if (E === e || E % d) { if (err === 2) continue; }
        X = E / d; if (err === 3) X = -e / d;
        if (X !== Math.round(X)) continue;
        Y = s.m1 * X + s.t1; if (err === 4) Y = s.m1 * X - s.t1;
        if (err === 4 && Y === s.m1 * X + s.t1) continue;
        var L = ['<b>Schritt 1:</b> ' + l1, '<b>Schritt 2:</b> ' + coef(d, 'x', true) + ' = ' + n(E), '<b>Schritt 3:</b> x = ' + n(X), '<b>Schritt 4:</b> y = ' + (s.m1 === 1 ? par(X) : s.m1 === -1 ? '−' + par(X) : n(s.m1) + ' · ' + par(X)) + cst(err === 4 ? -s.t1 : s.t1) + ' = ' + n(Y)];
        var opts = ['Schritt 1: Gleichsetzen', 'Schritt 2: Sortieren', 'Schritt 3: Nach x auflösen', 'Schritt 4: y berechnen'];
        var why = ['', '', 'Beim Sortieren muss ' + (s.t1 > 0 ? n(s.t1) + ' subtrahiert' : n(-s.t1) + ' addiert') + ' werden. Richtig ist ' + coef(d, 'x', true) + ' = ' + n(e) + '.', 'Beim Teilen durch ' + par(d) + ' wurde das Vorzeichen falsch. Richtig ist x = ' + n(e) + ' : ' + par(d) + ' = ' + n(e / d) + '.', 'In Gleichung I steht ' + cst(s.t1).trim() + ', nicht ' + cst(-s.t1).trim() + '. Richtig ist y = ' + calcY(s.m1, s.t1, X) + '.'];
        return { skill: 'Fehler im Lösungsweg finden', level: 2, q: 'Mia hat das Gleichungssystem gelöst. Ihr Ergebnis ist falsch. In welchem Schritt steckt der <b>erste</b> Fehler?' + sys(eqY(s.m1, s.t1), eqY(s.m2, s.t2)) + '<div style="background:#fff;border:1px solid #cfd9ef;border-radius:10px;padding:8px 12px;line-height:1.9">' + L.join('<br>') + '</div>',
          inputs: [{ kind: 'mc', label: 'Der erste Fehler steckt in …', options: opts, answer: err - 1 }],
          hints: ['Rechne selbst Schritt für Schritt mit und vergleiche.', 'Achte besonders auf die Vorzeichen beim Sortieren, beim Teilen und beim Einsetzen.', 'Die richtige Lösung ist ' + pair(s.x, s.y) + '. Ab welchem Schritt weicht Mia davon ab?'],
          solution: 'Der erste Fehler steckt in <b>Schritt ' + err + '</b>. ' + why[err] + ' Die richtige Lösung ist L = {' + pair(s.x, s.y) + '}.',
          verify: function () { var wrongPair = holds(eqY(s.m1, s.t1), X, Y) && holds(eqY(s.m2, s.t2), X, Y); return (!wrongPair && holds(eqY(s.m1, s.t1), s.x, s.y) && holds(eqY(s.m2, s.t2), s.x, s.y)) || 'Fehlerkette falsch'; } };
      }
      return gen.beide_y(2);
    },
    kerzen: function () {
      for (var k = 0; k < 300; k++) {
        var LA = M.pick([24, 28, 30, 32, 36, 40]), rA = M.pick([2, 3, 4]), LB = M.pick([12, 15, 16, 18, 20, 24]), rB = M.pick([1, 1.5, 2]);
        if (LB >= LA || rB >= rA) continue;
        var x = (LA - LB) / (rA - rB); if (x !== Math.round(x) || x < 2) continue;
        var y = LA - rA * x; if (y <= 1) continue;
        var e1 = eqY(-rA, LA), e2 = eqY(-rB, LB), S = steps(-rA, LA, -rB, LB, 'x', 'y');
        return { skill: 'Sachproblem modellieren: Kerzen', level: 3, q: 'Zwei Kerzen werden gleichzeitig angezündet. Kerze A ist ' + LA + ' cm hoch und brennt pro Stunde ' + rA + ' cm ab. Kerze B ist ' + LB + ' cm hoch und brennt pro Stunde ' + n(rB) + ' cm ab.<br>Nach wie vielen Stunden sind beide Kerzen gleich hoch? Wie hoch sind sie dann?<br><small>Stelle selbst zwei Gleichungen auf (x = Zeit in Stunden, y = Höhe in cm).</small>',
          inputs: [{ kind: 'num', answer: x, label: 'Zeit', unit: 'h' }, { kind: 'num', answer: y, label: 'Höhe', unit: 'cm' }],
          hints: ['Die Höhe nimmt jede Stunde ab. Kerze A: Start bei ' + LA + ' cm, pro Stunde ' + rA + ' cm weniger: ' + e1 + '.', 'Kerze B: ' + e2 + '. Setze gleich: ' + rhs(-rA, LA) + ' = ' + rhs(-rB, LB) + '.', 'Sortieren: ' + n(LA - LB) + ' = ' + coef(rA - rB, 'x', true) + '. Also x = ' + n(x) + '.'],
          solution: 'A: ' + e1 + ', B: ' + e2 + '<br>' + stepHtml(S) + '<br><b>Nach ' + n(x) + ' Stunden sind beide Kerzen ' + n(y) + ' cm hoch.</b> Danach ist Kerze B höher, weil sie langsamer abbrennt.',
          mistakes: pairMis(x, y, 'die Zeit', 'die Höhe', function (a) { if (a === (LA + LB) / (rA + rB)) return 'Beide Kerzen werden kürzer. In beiden Gleichungen steht deshalb ein Minus vor dem x-Glied.'; return null; }),
          verify: function () { return (holds(e1, x, y) && holds(e2, x, y)) || 'Probe falsch'; } };
      }
      return gen.beide_y(2);
    }
  };

  var ES = [{ m1: 2, t1: -1, m2: -1, t2: 5 }, { m1: 0.5, t1: 1, m2: -1, t2: 7 }, { m1: 3, t1: -4, m2: 1, t2: 2 }];

  return {
    id: '003', title: 'Gleichsetzungsverfahren', bereich: 'Lineare Gleichungssysteme', minutes: '45 bis 60',
    vorkenntnisse: 'Lineare Gleichungen lösen, Gleichungen nach y umstellen, Lösung eines LGS (Module 001 und 002)',
    lead: 'Zeichnen ist ungenau. Mit dem Gleichsetzungsverfahren rechnest du die Lösung eines Gleichungssystems exakt aus.',
    einstieg: { html: '<p>Lea hat schon <b>120 €</b> gespart und legt jeden Monat <b>15 €</b> dazu. Ben fängt mit <b>40 €</b> an, spart aber <b>25 €</b> pro Monat.</p><p class="note">Nach wie vielen Monaten haben beide gleich viel Geld? Wie viel ist es dann?</p><p>Für Lea gilt y = 15x + 120, für Ben y = 25x + 40. Gesucht ist der Monat x, in dem <b>beide y-Werte gleich</b> sind. Genau diese Idee steckt im <b>Gleichsetzungsverfahren</b>.</p>' },
    ziele: ['Ich erkenne, wann das Gleichsetzungsverfahren geschickt ist.', 'Ich setze die rechten Seiten zweier Gleichungen gleich und löse die entstehende Gleichung.', 'Ich berechne die zweite Variable durch Einsetzen und gebe das Lösungspaar an.', 'Ich stelle Gleichungen vorher geschickt um.', 'Ich erkenne an 0 = 5 oder 0 = 0, dass ein System keine oder unendlich viele Lösungen hat.'],
    fachwoerter: [['Gleichsetzungsverfahren', 'Beide Gleichungen sind nach derselben Variablen aufgelöst. Man setzt die anderen Seiten gleich.'], ['Einsetzen', 'Den berechneten Wert in eine der Gleichungen einsetzen, um die zweite Variable zu bestimmen.'], ['Lösungspaar', 'Die Lösung besteht immer aus zwei Werten: (x | y).'], ['Falsche Aussage', 'Zum Beispiel 3 = 5. Sie zeigt: Das System hat keine Lösung.']],
    diagnose: [
      { q: 'Löse die Gleichung 5x − 3 = 2x + 9.', options: ['x = 4', 'x = 2', 'x = 12', 'Weiß ich noch nicht'], answer: 0, why: '5x − 2x = 9 + 3, also 3x = 12 und x = 4.', review: 'Gleichungen mit x auf beiden Seiten' },
      { q: 'Löse die Gleichung 7 − 2x = 3x + 2.', options: ['x = 1', 'x = −1', 'x = 5', 'Weiß ich noch nicht'], answer: 0, why: '7 − 2 = 3x + 2x, also 5 = 5x und x = 1.', review: 'Gleichungen mit negativen Koeffizienten' },
      { q: 'Setze x = −2 in y = 3x + 4 ein. Welchen Wert hat y?', options: ['−2', '10', '2', 'Weiß ich noch nicht'], answer: 0, why: '3 · (−2) + 4 = −6 + 4 = −2.', review: 'Terme mit negativen Zahlen berechnen' },
      { q: 'Stelle x + 2y = 8 nach x um.', options: ['x = 8 − 2y', 'x = 8 + 2y', 'x = 4 − y', 'Weiß ich noch nicht'], answer: 0, why: 'Ziehe auf beiden Seiten 2y ab: x = 8 − 2y.', review: 'Gleichungen umstellen' }],
    erklaerung:
      '<h3>1. Die Idee</h3><p>Sind beide Gleichungen nach <b>y</b> aufgelöst, haben beide Geraden im Schnittpunkt denselben y-Wert. Also müssen dort auch die <b>rechten Seiten gleich</b> sein.</p>' + sys('y = 2x − 1', 'y = −x + 5') +
      '<div class="merk"><b>Merke: Gleichsetzungsverfahren</b><br>1. Beide Gleichungen nach derselben Variablen auflösen (meist y).<br>2. Die anderen Seiten <b>gleichsetzen</b>. Es entsteht eine Gleichung mit nur einer Variablen.<br>3. Diese Gleichung lösen.<br>4. Den Wert in eine Ausgangsgleichung <b>einsetzen</b> und die zweite Variable berechnen.<br>5. <b>Probe</b> in der anderen Gleichung und Lösungsmenge angeben.</div>' +
      '<h3>2. Beispiel Schritt für Schritt</h3><p>' + stepHtml(steps(2, -1, -1, 5, 'x', 'y')) + '<br><b>L = {(2 | 3)}</b></p>' +
      graph([{ m: 2, b: -1, label: 'I' }, { m: -1, b: 5, label: 'II', labelPos: 'below' }], { r: 5, marks: [{ x: 2, y: 3, text: 'S(2 | 3)', color: '#d97706', dx: 10, dy: 4 }], label: 'Der Schnittpunkt S(2 | 3) ist die Lösung' }) +
      '<p>Die Rechnung liefert genau den Schnittpunkt der beiden Geraden, auch wenn er nicht auf einem Gitterpunkt liegt.</p>' +
      '<h3>3. Typische Fehler</h3><ul><li><b>Nur x angeben:</b> Die Lösung ist ein Zahlenpaar. Berechne immer auch y.</li><li><b>Vorzeichenfehler beim Sortieren:</b> Bringst du − x auf die andere Seite, wird daraus + x.</li><li><b>Nicht umgestellt:</b> Steht eine Gleichung als 3x + y = 7 da, stelle sie erst um: y = −3x + 7.</li></ul>' +
      '<h3>4. Sonderfälle</h3><p>Fällt beim Sortieren das x ganz weg, bleibt eine Aussage ohne Variable übrig:</p><ul><li><b>Falsche Aussage</b> wie 1 = 4: Die Geraden sind parallel, es gibt <b>keine Lösung</b>, L = { }.</li><li><b>Wahre Aussage</b> wie 1 = 1: Es ist dieselbe Gerade, es gibt <b>unendlich viele Lösungen</b>.</li></ul>',
    entdecken: {
      html: '<p>Wähle ein Gleichungssystem und verschiebe x. Vergleiche die beiden y-Werte. Gleichsetzen bedeutet: Du suchst das x, bei dem beide gleich sind.</p><div class="ctl"><label>System <select id="e_s">' + ES.map(function (e, i) { return '<option value="' + i + '">' + eqY(e.m1, e.t1) + ' und ' + eqY(e.m2, e.t2) + '</option>'; }).join('') + '</select></label><label>x = <b id="v_x"></b> <input type="range" id="r_x" min="-3" max="7" step="1" value="0"></label></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var E = ES[+root.querySelector('#e_s').value], x = +root.querySelector('#r_x').value, y1 = E.m1 * x + E.t1, y2 = E.m2 * x + E.t2, eq = Math.abs(y1 - y2) < 1e-9;
          root.querySelector('#v_x').textContent = n(x);
          var marks = [];
          if (Math.abs(y1) <= 8.4) marks.push({ x: x, y: y1, color: '#1d4ed8' });
          if (Math.abs(y2) <= 8.4) marks.push({ x: x, y: y2, color: '#0f766e' });
          var G = graph([{ m: E.m1, b: E.t1, label: 'I' }, { m: E.m2, b: E.t2, label: 'II', labelPos: 'below' }], { r: 8, gx: 1, lx: 2, marks: marks, label: 'Beide Geraden mit den y-Werten an der Stelle x' });
          root.querySelector('#e_g').innerHTML = G;
          root.querySelector('#e_txt').innerHTML = '<p class="big-math" style="color:#1d4ed8">I: y = ' + calcY(E.m1, E.t1, x) + '</p><p class="big-math" style="color:#0f766e">II: y = ' + calcY(E.m2, E.t2, x) + '</p>' +
            (eq ? '<p class="fb good"><b>Gleich!</b> Bei x = ' + n(x) + ' ist ' + rhs(E.m1, E.t1) + ' = ' + rhs(E.m2, E.t2) + ' erfüllt. Die Lösung ist (' + n(x) + ' | ' + n(y1) + ').</p>' : '<p class="fb">Unterschied: ' + n(Math.abs(y1 - y2)) + '. ' + ((E.m1 - E.m2) * (y1 - y2 > 0 ? 1 : -1) > 0 ? 'Verkleinere x.' : 'Vergrößere x.') + '</p>');
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Die Lösung liegt dort, wo beide Gleichungen denselben y-Wert liefern. Statt zu probieren, setzt du die rechten Seiten gleich und rechnest x direkt aus.'); }
        root.querySelector('#r_x').addEventListener('input', hit);
        root.querySelector('#e_s').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Wer hat mehr gespart?', q: 'Lea: y = 15x + 120. Ben: y = 25x + 40 (x in Monaten, y in €). Wann haben beide gleich viel Geld?',
      steps: ['Gleichsetzen: 15x + 120 = 25x + 40 &nbsp;|&nbsp; − 25x &nbsp;− 120', 'Sortieren: −10x = −80 &nbsp;|&nbsp; : (−10)', 'Auflösen: x = 8', 'Einsetzen in Leas Gleichung: y = 15 · 8 + 120 = 240. Probe bei Ben: 25 · 8 + 40 = 240 ✓', 'Antwort: Nach <b>8 Monaten</b> haben beide <b>240 €</b>. L = {(8 | 240)}.'] },
    tasks: { gen: gen, plan: { G: ['schritt:1', 'beide_y:1', 'beide_y:2', 'sonderfall:2'], S: ['beide_y:1', 'beide_x:2', 'umformen_dann:2', 'sonderfall:2', 'sach:2'], E: ['beide_x:2', 'umformen_dann:3', 'beide_umformen:3', 'fehler:2', 'sonderfall:3', 'sach:2'] },
      extra: 'kerzen', test: ['schritt:1', 'beide_y:2', 'beide_x:2', 'umformen_dann:2', 'sonderfall:2', 'sach:2'] },
    lerncheck: ['Ich löse ein Gleichungssystem mit dem Gleichsetzungsverfahren.', 'Ich gebe immer beide Werte x und y an und mache die Probe.', 'Ich stelle Gleichungen vorher nach einer Variablen um.', 'Ich erkenne Systeme ohne Lösung oder mit unendlich vielen Lösungen.']
  };
})();
