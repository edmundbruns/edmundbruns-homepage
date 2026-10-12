/* Modul 014 · Lineare Modelle im Alltag */
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
  function r2(x) { return Math.round(x * 100) / 100; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function eur(x) { return (isInt(x) ? M.fmtNum(Math.round(x)) : M.fmtNum(x, 2)) + ' €'; }
  function money(ans, label) { return { kind: 'num', answer: r2(ans), tol: 0.005, unit: '€', label: label }; }
  function lin(m, b) { return (m === 1 ? '' : m === -1 ? '−' : n(m)) + 'x' + (b ? (b > 0 ? ' + ' : ' − ') + n(Math.abs(b)) : ''); }
  function tstr(m, b) { return '(' + m + ')*x+(' + b + ')'; }
  function near(v, x, t) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < (t || 0.006); }
  /* Tarif-Situationen: [Text mit {b} {m}, x-Bedeutung, y-Bedeutung, Einheit x, Liste b, Liste m] */
  var TARIFE = [
    ['Ein Taxi kostet {b} Grundgebühr und {m} pro gefahrenem Kilometer.', 'Kilometer', 'Preis in €', 'km', [3.5, 4, 4.5, 5], [1.8, 2, 2.2, 2.5]],
    ['Ein Stromanbieter verlangt {b} Grundpreis im Monat und {m} pro Kilowattstunde (kWh).', 'verbrauchte kWh', 'Monatskosten in €', 'kWh', [8, 10, 12, 15], [0.3, 0.35, 0.4]],
    ['Ein Fahrradverleih nimmt {b} Leihgebühr und {m} pro Stunde.', 'Stunden', 'Preis in €', 'h', [5, 6, 8], [2.5, 3, 3.5, 4]],
    ['Ein Handwerker berechnet {b} für die Anfahrt und {m} pro Arbeitsstunde.', 'Arbeitsstunden', 'Rechnungsbetrag in €', 'h', [25, 30, 35, 40], [45, 48, 52, 55]],
    ['Ein Handyvertrag kostet {b} im Monat und {m} pro Gesprächsminute.', 'Minuten', 'Monatskosten in €', 'min', [5, 7.5, 9.99, 12], [0.09, 0.1, 0.12, 0.15]]];
  function tarif(i) { var T = TARIFE[i == null ? M.rnd(0, TARIFE.length - 1) : i], b = M.pick(T[4]), m = M.pick(T[5]); return { T: T, b: b, m: m, txt: T[0].replace('{b}', eur(b)).replace('{m}', eur(m)) }; }

  var gen = {
    bedeutung: function () {
      var c = M.rnd(0, 3), q, opts, right;
      if (c === 0) { var t = tarif(4); q = 'Für einen Handyvertrag gilt y = ' + lin(t.m, t.b) + ' (x: Minuten, y: Kosten in €). <b>Was bedeutet die Zahl ' + n(t.b) + '?</b>'; right = 'die monatliche Grundgebühr in €'; opts = [right, 'der Preis pro Minute in €', 'die Anzahl der Minuten im Monat', 'die Gesamtkosten nach einer Minute']; }
      else if (c === 1) { var h = M.pick([18, 20, 24, 30]), r = M.pick([1.5, 2, 2.5]); q = 'Für eine Kerze gilt y = ' + lin(-r, h) + ' (x: Brenndauer in h, y: Höhe in cm). <b>Was bedeutet −' + n(r) + '?</b>'; right = 'Die Kerze wird pro Stunde ' + n(r) + ' cm kürzer.'; opts = [right, 'Die Kerze ist am Anfang ' + n(r) + ' cm hoch.', 'Die Kerze brennt ' + n(r) + ' Stunden.', 'Die Kerze wird pro Stunde ' + n(r) + ' cm länger.']; }
      else if (c === 2) { var v0 = M.pick([100, 150, 200, 250]), q0 = M.pick([20, 25, 40, 50]); q = 'Für die Wassermenge in einem Becken gilt y = ' + lin(q0, v0) + ' (x: Zeit in min, y: Wassermenge in l). <b>Was bedeutet ' + q0 + '?</b>'; right = 'Pro Minute fließen ' + q0 + ' l Wasser dazu.'; opts = [right, 'Am Anfang sind ' + q0 + ' l im Becken.', 'Das Becken ist nach ' + q0 + ' Minuten voll.', 'Pro Minute fließen ' + q0 + ' l ab.']; }
      else { var s0 = M.pick([2, 3, 5, 8]), v = M.pick([12, 15, 18, 20]); q = 'Für Linas Radtour gilt y = ' + lin(v, s0) + ' (x: Zeit in h, y: Entfernung von zu Hause in km). <b>Was bedeutet ' + s0 + '?</b>'; right = 'Lina startet ' + s0 + ' km von zu Hause entfernt.'; opts = [right, 'Lina fährt ' + s0 + ' km pro Stunde.', 'Lina fährt ' + s0 + ' Stunden lang.', 'Lina ist nach ' + s0 + ' Stunden zu Hause.']; }
      var sh = M.shuffle(opts);
      return { skill: 'Steigung und Startwert deuten', level: 1, q: q, inputs: [{ kind: 'mc', label: 'Wähle aus', options: sh, answer: sh.indexOf(right) }],
        hints: ['In y = mx + b ist b der Startwert (der Wert bei x = 0).', 'm ist die Änderung pro Einheit von x: pro Minute, pro Stunde, pro km.', 'Ist m negativ, nimmt die Größe ab.'],
        solution: right };
    },
    tarif_gleichung: function (lvl) {
      var t = tarif(), x = lvl === 1 ? M.pick([5, 10, 20]) : M.rnd(6, 40); if (t.T[3] === 'kWh') x = M.pick([100, 150, 200, 250, 300]); if (t.T[3] === 'min') x = M.pick([30, 45, 60, 80, 100, 120]); if (t.T[3] === 'h' && t.b >= 25) x = M.rnd(2, 8);
      var y = r2(t.m * x + t.b);
      return { skill: 'Funktionsgleichung aus Text', q: t.txt + '<br>a) Gib die Funktionsgleichung an (x: ' + t.T[1] + ', y: ' + t.T[2] + ').<br>b) Berechne y für x = ' + n(x) + ' ' + t.T[3] + '.',
        inputs: [{ kind: 'term', answer: tstr(t.m, t.b), label: 'a) y =', placeholder: 'z. B. 2,5x + 4' }, money(y, 'b) y =')],
        src: '(' + t.b + ')+(' + t.m + ')*x',
        hints: ['Der feste Betrag fällt immer an, auch bei x = 0. Er ist b.', 'Der Betrag pro ' + t.T[3] + ' ist die Steigung m = ' + n(t.m) + '.', 'b) Setze ein: y = ' + n(t.m) + ' · ' + n(x) + ' + ' + n(t.b) + '.'],
        solution: 'a) <b>y = ' + lin(t.m, t.b) + '</b>. b) y = ' + n(t.m) + ' · ' + n(x) + ' + ' + n(t.b) + ' = ' + n(r2(t.m * x)) + ' + ' + n(t.b) + ' = <b>' + eur(y) + '</b>.',
        mistakes: function (v) { if (M.termEq(v[0], tstr(t.b, t.m))) return 'Du hast m und b vertauscht. Der feste Betrag ist b (ohne x), der Betrag pro ' + t.T[3] + ' gehört zum x.'; if (near(v[1], t.m * x)) return 'Bei b) fehlt der feste Grundbetrag ' + eur(t.b) + '.'; return null; },
        verify: function () { return Math.abs(y - (t.m * x + t.b)) < 0.005 || 'Wert'; } };
    },
    kerze: function (lvl) {
      var r = M.pick(lvl === 1 ? [1, 2, 3] : [1.5, 2, 2.5, 3, 4]), T = M.pick([6, 8, 10, 12, 16]), h = r * T, x = M.rnd(1, T - 1), y = h - r * x;
      return { skill: 'Kerze: Höhe und Brenndauer', q: 'Eine Kerze ist ' + n(h) + ' cm hoch. Sie brennt gleichmäßig und wird pro Stunde ' + n(r) + ' cm kürzer.<br>a) Wie hoch ist sie nach ' + x + ' Stunden?<br>b) Nach wie vielen Stunden ist sie ganz abgebrannt?',
        inputs: [{ kind: 'num', answer: y, unit: 'cm', label: 'a) Höhe' }, { kind: 'num', answer: T, unit: 'h', label: 'b) Brenndauer' }],
        hints: ['Die Gleichung lautet y = ' + lin(-r, h) + ' (x: Zeit in h, y: Höhe in cm).', 'a) y = −' + n(r) + ' · ' + x + ' + ' + n(h) + '.', 'b) Abgebrannt heißt y = 0: ' + lin(r, 0) + ' = ' + n(h) + '.'],
        solution: 'y = ' + lin(-r, h) + '. a) y = −' + n(r * x) + ' + ' + n(h) + ' = <b>' + n(y) + ' cm</b>. b) 0 = ' + lin(-r, h) + ' ⇒ x = ' + n(h) + ' : ' + n(r) + ' = <b>' + T + ' h</b>.',
        mistakes: function (v) { if (near(v[0], h + r * x)) return 'Die Kerze wird kürzer. Die Steigung ist negativ: Ziehe ab.'; return null; },
        verify: function () { return Math.abs(h - r * T) < 1e-9 && Math.abs(y - (h - r * x)) < 1e-9 || 'Kerze'; } };
    },
    fuellen: function () {
      var v0 = M.pick([100, 150, 200, 250, 300]), q = M.pick([20, 25, 40, 50, 60]), k = M.rnd(4, 20), V = v0 + q * k;
      return { skill: 'Füllvorgang', level: 2, q: 'In einem Planschbecken sind schon ' + v0 + ' Liter Wasser. Mit einem Schlauch fließen pro Minute ' + q + ' Liter dazu.<br>a) Gib die Funktionsgleichung an (x: Zeit in min, y: Wassermenge in l).<br>b) Nach wie vielen Minuten sind ' + M.fmtNum(V) + ' Liter im Becken?',
        inputs: [{ kind: 'term', answer: tstr(q, v0), label: 'a) y =', placeholder: 'z. B. 30x + 100' }, { kind: 'num', answer: k, unit: 'min', label: 'b) x =' }],
        src: v0 + '+' + q + '*x',
        hints: ['Startwert b = ' + v0 + ' l, Zufluss pro Minute m = ' + q + ' l.', 'b) Setze y = ' + V + ': ' + V + ' = ' + q + 'x + ' + v0 + '.', 'Ziehe ' + v0 + ' ab und teile durch ' + q + '.'],
        solution: 'a) <b>y = ' + lin(q, v0) + '</b>. b) ' + V + ' = ' + q + 'x + ' + v0 + ' ⇒ ' + q + 'x = ' + (V - v0) + ' ⇒ x = <b>' + k + ' min</b>.',
        mistakes: function (v) { if (near(v[1], V / q, 0.01)) return 'Bei b) hast du vergessen, dass schon ' + v0 + ' Liter im Becken sind. Ziehe sie zuerst ab.'; return null; },
        verify: function () { return q * k + v0 === V || 'Füllen'; } };
    },
    bewegung: function () {
      var s0 = M.pick([2, 3, 4, 5, 6]), v = M.pick([12, 14, 15, 16, 18, 20]), t = M.pick([0.5, 1.5, 2, 2.5]), k = M.rnd(2, 4), S = s0 + v * k;
      return { skill: 'Bewegung', level: 2, q: 'Lina wohnt ' + s0 + ' km vom Bahnhof entfernt. Sie startet dort und fährt mit dem Fahrrad gleichmäßig mit ' + v + ' km/h weiter weg von zu Hause.<br>a) Wie weit ist sie nach ' + n(t) + ' Stunden von zu Hause entfernt?<br>b) Nach wie vielen Stunden ist sie ' + S + ' km von zu Hause entfernt?',
        inputs: [{ kind: 'num', answer: s0 + v * t, unit: 'km', label: 'a) Entfernung' }, { kind: 'num', answer: k, unit: 'h', label: 'b) Zeit' }],
        hints: ['Die Entfernung von zu Hause ist y = ' + v + 'x + ' + s0 + ' (x: Zeit in h, y: Entfernung in km).', 'a) Setze x = ' + n(t) + ' ein.', 'b) Löse ' + S + ' = ' + v + 'x + ' + s0 + ' nach x auf.'],
        solution: 'y = ' + lin(v, s0) + '. a) y = ' + v + ' · ' + n(t) + ' + ' + s0 + ' = <b>' + n(s0 + v * t) + ' km</b>. b) ' + v + 'x = ' + (S - s0) + ' ⇒ x = <b>' + k + ' h</b>.',
        mistakes: function (v2) { if (near(v2[0], v * t)) return 'Bei a) fehlen die ' + s0 + ' km, die Lina am Start schon von zu Hause entfernt ist.'; return null; },
        verify: function () { return v * k + s0 === S || 'Bewegung'; } };
    },
    x_berechnen: function (lvl) {
      var t = tarif(lvl === 1 ? 0 : M.pick([0, 2, 3])), x = t.T[3] === 'km' ? M.rnd(3, 25) : M.rnd(2, 9), P = r2(t.m * x + t.b);
      return { skill: 'x aus dem Funktionswert berechnen', q: t.txt + ' Jonas bezahlt insgesamt ' + eur(P) + '. <b>Wie viele ' + t.T[1] + ' waren es?</b>',
        inputs: [{ kind: 'num', answer: x, unit: t.T[3], label: 'x =' }],
        hints: ['Stelle die Gleichung auf: ' + n(P) + ' = ' + n(t.m) + 'x + ' + n(t.b) + '.', 'Ziehe den festen Betrag ab: ' + n(P) + ' − ' + n(t.b) + ' = ' + n(r2(P - t.b)) + '.', 'Teile durch ' + n(t.m) + '.'],
        solution: n(P) + ' = ' + n(t.m) + 'x + ' + n(t.b) + ' ⇒ ' + n(t.m) + 'x = ' + n(r2(P - t.b)) + ' ⇒ x = <b>' + x + ' ' + t.T[3] + '</b>. Probe: ' + n(t.m) + ' · ' + x + ' + ' + n(t.b) + ' = ' + eur(P) + '.',
        mistakes: function (v) { if (near(v[0], P / t.m, 0.05)) return 'Du hast den ganzen Betrag geteilt. Ziehe zuerst den festen Betrag ' + eur(t.b) + ' ab.'; return null; },
        verify: function () { return Math.abs(t.m * x + t.b - P) < 0.005 || 'Probe'; } };
    },
    vergleich: function () {
      var C = [['Schwimmbad', 'Besuchen', 'Einzelkarte', 'Saisonkarte', 'pro Besuch', [2, 3, 3.5, 4, 4.5], [1, 1.5, 2], [15, 20, 25, 30]],
        ['Autovermietung', 'km', 'Tarif „Stadt“', 'Tarif „Reise“', 'pro km', [0.3, 0.35, 0.4], [0.15, 0.2, 0.25], [15, 20, 30]],
        ['Fitnessstudio', 'Trainingsbesuchen im Monat', 'Tarif „Flex“', 'Tarif „Abo“', 'pro Besuch', [5, 6, 7, 8], [2, 3, 4], [12, 15, 20, 24]]];
      for (var i = 0; i < 500; i++) {
        var c = M.pick(C), rB = M.pick(c[5]), rA = M.pick(c[6]), bA = M.pick(c[7]), bB = c[0] === 'Autovermietung' ? M.pick([10, 20, 25]) : 0;
        if (c[0] === 'Autovermietung') bA = bB + M.pick([15, 20, 30]);
        var xs = (bA - bB) / (rB - rA); if (!isInt(xs) || xs < 3 || xs > 300) continue; xs = Math.round(xs);
        var N = Math.random() < 0.5 ? Math.round(xs / 2) : Math.round(xs * 1.5); if (N === xs || N <= 0) continue;
        var cheap = rA * N + bA < rB * N + bB ? 1 : 0, yE = r2(rA * xs + bA);
        return { skill: 'Zwei Angebote vergleichen (Schnittpunkt)', level: 2,
          q: '<b>' + c[0] + ':</b> ' + c[2] + ' (B): ' + (bB ? eur(bB) + ' Grundgebühr und ' : '') + eur(rB) + ' ' + c[4] + '. ' + c[3] + ' (A): ' + eur(bA) + ' fest und nur ' + eur(rA) + ' ' + c[4] + '.<br>a) Bei wie vielen ' + c[1] + ' kosten beide gleich viel?<br>b) Welches Angebot ist bei ' + N + ' ' + c[1] + ' günstiger?',
          inputs: [{ kind: 'num', answer: xs, label: 'a) x =' }, { kind: 'mc', label: 'b) günstiger ist …', options: [c[2] + ' (B)', c[3] + ' (A)'], answer: cheap }],
          hints: ['Stelle beide Gleichungen auf: B: y = ' + lin(rB, bB) + ', A: y = ' + lin(rA, bA) + '.', 'Gleich teuer: ' + lin(rB, bB) + ' = ' + lin(rA, bA) + '. Bringe die x auf eine Seite: ' + n(r2(rB - rA)) + 'x = ' + n(bA - bB) + '.', 'x = ' + n(bA - bB) + ' : ' + n(r2(rB - rA)) + '. Für mehr ' + c[1] + ' lohnt sich das Angebot mit dem kleineren Betrag ' + c[4] + '.'],
          solution: 'a) ' + lin(rB, bB) + ' = ' + lin(rA, bA) + ' ⇒ ' + n(r2(rB - rA)) + 'x = ' + n(bA - bB) + ' ⇒ x = <b>' + xs + '</b>. Dann kosten beide ' + eur(yE) + '. b) Bei ' + N + ' ' + c[1] + ': B kostet ' + eur(r2(rB * N + bB)) + ', A kostet ' + eur(r2(rA * N + bA)) + '. Günstiger ist <b>' + [c[2] + ' (B)', c[3] + ' (A)'][cheap] + '</b>.',
          verify: function () { return Math.abs(rA * xs + bA - (rB * xs + bB)) < 1e-9 || 'Schnitt'; } };
      }
    },
    grenzen: function () {
      var c = M.rnd(0, 1), r, h, T, txt, opts, right;
      if (c === 0) { r = M.pick([1.5, 2, 2.5, 3]); T = M.pick([6, 8, 10, 12]); h = r * T; txt = 'Für eine Kerze gilt y = ' + lin(-r, h) + ' (x: Zeit in h, y: Höhe in cm).'; right = '0 ≤ x ≤ ' + T; opts = [right, '0 ≤ x ≤ ' + n(h), 'x ≥ 0, also alle positiven Zahlen', '0 ≤ x ≤ ' + n(r)]; }
      else { r = M.pick([15, 20, 25, 40]); T = M.pick([8, 10, 12, 16]); h = r * T; txt = 'Ein Tank mit ' + h + ' l wird geleert: y = ' + lin(-r, h) + ' (x: Zeit in min, y: Wassermenge in l).'; right = '0 ≤ x ≤ ' + T; opts = [right, '0 ≤ x ≤ ' + h, 'x ≥ 0, also alle positiven Zahlen', '0 ≤ x ≤ ' + r]; }
      var sh = M.shuffle(opts);
      return { skill: 'Grenzen des Modells', level: 2, q: txt + ' Setzt man x = ' + (T + 5) + ' ein, erhält man y = ' + n(h - r * (T + 5)) + '. <b>Für welche x ist das Modell sinnvoll?</b>',
        inputs: [{ kind: 'mc', label: 'Das Modell gilt für …', options: sh, answer: sh.indexOf(right) }],
        hints: ['Eine Höhe oder eine Wassermenge kann nicht negativ sein.', 'Berechne, wann y = 0 ist: ' + n(r) + 'x = ' + n(h) + '.', 'x = ' + T + '. Danach liefert die Gleichung negative Werte, die keinen Sinn ergeben. Auch negative Zeiten sind nicht sinnvoll.'],
        solution: 'y = 0 bei x = ' + n(h) + ' : ' + n(r) + ' = ' + T + '. Für größere x wird y negativ, das ist in Wirklichkeit unmöglich. Das Modell gilt nur für <b>' + right + '</b>.',
        verify: function () { return Math.abs(h - r * T) < 1e-9 || 'T'; } };
    },
    aus_zwei_werten: function () {
      var m = M.pick([40, 45, 50, 55, 60]), b = M.pick([20, 25, 30, 35, 40]), x1 = M.rnd(2, 3), x2 = x1 + M.rnd(2, 4), y1 = m * x1 + b, y2 = m * x2 + b;
      return { skill: 'Gleichung aus zwei Wertepaaren', level: 3, q: 'Eine Handwerkerfirma berechnet eine feste Anfahrtspauschale und einen festen Stundenlohn. Für ' + x1 + ' Stunden Arbeit zahlt Familie Meyer ' + eur(y1) + ', für ' + x2 + ' Stunden zahlt Familie Kaya ' + eur(y2) + '.<br>a) Gib die Funktionsgleichung an (x: Stunden, y: Preis in €).<br>b) Wie hoch ist die Anfahrtspauschale?',
        inputs: [{ kind: 'term', answer: tstr(m, b), label: 'a) y =', placeholder: 'z. B. 50x + 30' }, money(b, 'b) Pauschale')],
        src: '(' + y2 + '-' + y1 + ')/(' + x2 + '-' + x1 + ')*(x-' + x1 + ')+' + y1,
        hints: [(x2 - x1) + ' Stunden mehr kosten ' + eur(y2 - y1) + ' mehr.', 'Stundenlohn m = ' + (y2 - y1) + ' : ' + (x2 - x1) + ' = ' + m + ' €.', 'Pauschale: ' + y1 + ' − ' + x1 + ' · ' + m + ' = ' + b + ' €.'],
        solution: 'm = (' + y2 + ' − ' + y1 + ') : (' + x2 + ' − ' + x1 + ') = ' + m + '. b = ' + y1 + ' − ' + m + ' · ' + x1 + ' = ' + b + '. a) <b>y = ' + lin(m, b) + '</b>. b) Die Anfahrtspauschale beträgt <b>' + eur(b) + '</b>.',
        verify: function () { return m * x2 + b === y2 || 'Werte'; } };
    },
    waffeln: function () {
      for (var i = 0; i < 300; i++) {
        var fix = M.pick([20, 24, 30, 36, 40, 45]), k = M.pick([0.3, 0.4, 0.5, 0.6]), p = M.pick([1, 1.2, 1.5, 2]);
        var be = fix / (p - k); if (!isInt(be) || be > 80) continue; be = Math.round(be);
        var N = be + M.pick([10, 20, 30, 40]), G = r2(p * N - (k * N + fix));
        return { skill: 'Kosten, Einnahmen, Gewinn', level: 3, q: 'Die Schülerfirma verkauft beim Schulfest Waffeln. Das Waffeleisen kostet ' + eur(fix) + ' Miete. Für die Zutaten rechnet sie ' + eur(k) + ' pro Waffel. Verkauft wird eine Waffel für ' + eur(p) + '.<br>a) Bei wie vielen verkauften Waffeln sind Einnahmen und Kosten gleich hoch?<br>b) Wie viel Gewinn macht die Schülerfirma bei ' + N + ' verkauften Waffeln?',
          inputs: [{ kind: 'num', answer: be, label: 'a) Waffeln' }, money(G, 'b) Gewinn')],
          hints: ['Kosten: K = ' + lin(k, fix) + '. Einnahmen: E = ' + lin(p, 0) + ' (x: Anzahl Waffeln).', 'a) Gleichsetzen: ' + n(p) + 'x = ' + n(k) + 'x + ' + fix + ' ⇒ ' + n(r2(p - k)) + 'x = ' + fix + '.', 'b) Gewinn = Einnahmen − Kosten = ' + n(p) + ' · ' + N + ' − (' + n(k) + ' · ' + N + ' + ' + fix + ').'],
          solution: 'a) ' + n(r2(p - k)) + 'x = ' + fix + ' ⇒ x = <b>' + be + '</b>. Ab dieser Zahl macht die Firma Gewinn. b) Einnahmen ' + eur(r2(p * N)) + ', Kosten ' + eur(r2(k * N + fix)) + ', Gewinn <b>' + eur(G) + '</b>.',
          mistakes: function (v) { if (near(v[1], p * N)) return 'Bei b) sind das nur die Einnahmen. Ziehe die Kosten ab.'; return null; },
          verify: function () { return Math.abs(p * be - (k * be + fix)) < 1e-9 && Math.abs(G - (p - k) * (N - be)) < 0.006 || 'Gewinn'; } };
      }
    }
  };

  return {
    id: '014', title: 'Lineare Modelle im Alltag', bereich: 'Funktionaler Zusammenhang', minutes: '45 bis 60',
    vorkenntnisse: 'Lineare Funktionen, Nullstellen und Schnittpunkte (Module 011 und 012)',
    lead: 'Tarife, Kerzen, Wassertanks, Radtouren: Mit linearen Funktionen kannst du Alltagsfragen beantworten. Du lernst auch, wo ein Modell an seine Grenzen kommt.',
    einstieg: { html: '<p>Die Klasse 8b plant einen Tagesausflug mit dem Fahrradverleih. <b>Verleih A</b> nimmt 8 € pro Rad und Tag, dazu 2 € pro Stunde. <b>Verleih B</b> nimmt nur 3,50 € pro Stunde, aber keine Grundgebühr.</p><p class="note">Welcher Verleih ist günstiger, wenn die Klasse 4 Stunden fährt? Und wenn sie 7 Stunden fährt?</p><p>Solche Fragen löst du, indem du die Situation mit einer Funktionsgleichung beschreibst. Das nennt man ein <b>mathematisches Modell</b>.</p>' },
    ziele: ['Ich stelle aus einem Text eine Funktionsgleichung y = mx + b auf.', 'Ich deute m und b in einer Sachsituation.', 'Ich berechne y-Werte und umgekehrt x-Werte im Sachzusammenhang.', 'Ich vergleiche zwei Angebote mit dem Schnittpunkt.', 'Ich erkenne, in welchem Bereich ein Modell sinnvoll ist.'],
    fachwoerter: [['Modell', 'Eine Gleichung, die eine Situation aus dem Alltag vereinfacht beschreibt.'], ['Startwert b', 'Der Wert bei x = 0: Grundgebühr, Anfangshöhe, Anfangsmenge.'], ['Änderungsrate m', 'Wie viel pro Einheit dazukommt (m &gt; 0) oder wegfällt (m &lt; 0): pro km, pro Minute, pro Stunde.'], ['Gültigkeitsbereich', 'Die x-Werte, für die das Modell sinnvolle Ergebnisse liefert, zum Beispiel keine negativen Höhen.']],
    diagnose: [
      { q: 'Was ist bei y = 0,5x + 7 der y-Achsenabschnitt?', options: ['7', '0,5', '7,5', 'Weiß ich noch nicht'], answer: 0, why: 'b ist die Zahl ohne x.', review: 'Steigung und y-Achsenabschnitt (Modul 011)' },
      { q: 'Löse 3x + 12 = 45.', options: ['x = 11', 'x = 19', 'x = 15', 'Weiß ich noch nicht'], answer: 0, why: '3x = 33, also x = 11.', review: 'Lineare Gleichungen lösen' },
      { q: 'Wo hat y = −2x + 10 seine Nullstelle?', options: ['x = 5', 'x = −5', 'x = 10', 'Weiß ich noch nicht'], answer: 0, why: '0 = −2x + 10, also x = 5.', review: 'Nullstellen (Modul 012)' },
      { q: 'Für welches x gilt 2x + 5 = 4x + 1?', options: ['x = 2', 'x = 3', 'x = −2', 'Weiß ich noch nicht'], answer: 0, why: '5 − 1 = 4x − 2x, also 4 = 2x und x = 2.', review: 'Schnittpunkt durch Gleichsetzen (Modul 012)' }],
    erklaerung:
      '<h3>1. Vom Text zur Gleichung</h3><p>Suche im Text zwei Angaben:</p><ul><li>einen <b>festen Betrag</b>, der immer anfällt (Grundgebühr, Anfangshöhe, Startmenge): das ist <b>b</b>.</li><li>einen Betrag <b>pro Einheit</b> (pro km, pro Stunde, pro Minute): das ist <b>m</b>. Nimmt die Größe ab, ist m negativ.</li></ul>' +
      '<p>Verleih A aus dem Einstieg: y = 2x + 8. Verleih B: y = 3,5x. Dabei ist x die Zeit in Stunden und y der Preis in €.</p>' +
      '<div class="merk"><b>Merke:</b> So arbeitest du mit einem linearen Modell:<br>1. Lege fest, was x und was y bedeutet (mit Einheiten).<br>2. Stelle die Gleichung y = mx + b auf.<br>3. y gesucht: x einsetzen. x gesucht: y einsetzen und die Gleichung lösen.<br>4. Zwei Angebote: Gleichsetzen liefert, wann beide gleich viel kosten.<br>5. Prüfe, ob das Ergebnis in der Situation sinnvoll ist.</div>' +
      '<h3>2. Zwei Angebote vergleichen</h3><p class="big-math">3,5x = 2x + 8 ⇒ 1,5x = 8 ⇒ x ≈ 5,3</p><p>Bis etwa 5 Stunden ist B günstiger, danach A. Bei 4 Stunden: B kostet 14 €, A kostet 16 €. Bei 7 Stunden: B kostet 24,50 €, A nur 22 €.</p>' +
      graph([{ m: 3.5, b: 0, label: 'B', from: 0, to: 8 }, { m: 2, b: 8, label: 'A', labelPos: 'below', from: 0, to: 8 }], { x: [0, 8], y: [0, 30], gx: 1, gy: 2, lx: 1, ly: 6, tx: 'Stunden', ty: 'Preis in €', marks: [{ x: 16 / 3, y: 56 / 3, text: 'gleich teuer', dx: -8, dy: -10, anchor: 'end' }], label: 'Vergleich der beiden Fahrradverleihe' }) +
      '<h3>3. Grenzen des Modells</h3><p>Eine 20 cm hohe Kerze brennt 2 cm pro Stunde ab: y = −2x + 20. Nach 10 Stunden ist sie abgebrannt. Für x = 12 liefert die Gleichung y = −4. Eine Höhe von −4 cm gibt es nicht. Das Modell gilt nur für <b>0 ≤ x ≤ 10</b>.</p><p class="note">Auch in Wirklichkeit ist nicht alles genau linear: Eine Kerze brennt nicht völlig gleichmäßig, und ein Taxi steht manchmal im Stau. Ein Modell ist immer eine Vereinfachung.</p>',
    entdecken: {
      html: '<p>Eine Kerze brennt ab. Verändere die Anfangshöhe und wie schnell sie abbrennt. Der gestrichelte Teil zeigt, was die Gleichung „sagt“, obwohl es keinen Sinn mehr ergibt.</p><div class="ctl"><label>Höhe am Anfang = <b id="v_h"></b> <input type="range" id="r_h" min="10" max="30" step="2" value="20"></label><label>Abbrennen pro Stunde = <b id="v_r"></b> <input type="range" id="r_r" min="0.5" max="4" step="0.5" value="2"></label></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var h = +root.querySelector('#r_h').value, r = +root.querySelector('#r_r').value, T = h / r;
          root.querySelector('#v_h').textContent = h + ' cm'; root.querySelector('#v_r').textContent = n(r) + ' cm';
          var L = [{ m: -r, b: h, from: 0, to: Math.min(T, 20) }]; if (T < 20) L.push({ m: -r, b: h, from: T, dash: true, color: '#9b93b5' });
          root.querySelector('#e_g').innerHTML = graph(L, { x: [0, 20], y: [-10, 30], gx: 1, gy: 2, lx: 2, ly: 10, tx: 'Zeit in h', ty: 'Höhe in cm', marks: T <= 20 ? [{ x: T, y: 0, text: 'abgebrannt', color: '#d97706', dx: 6, dy: -8 }] : [], label: 'Höhe der Kerze in Abhängigkeit von der Zeit' });
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">y = −' + n(r) + 'x + ' + h + '</p><p>Brenndauer: ' + h + ' : ' + n(r) + (isInt(T * 100) ? ' = ' : ' ≈ ') + '<b>' + n(Math.round(T * 100) / 100) + ' h</b>. Das Modell gilt für <b>0 ≤ x ≤ ' + n(Math.round(T * 100) / 100) + '</b>. ' + (T < 20 ? 'Für x = ' + Math.ceil(T + 1) + ' käme y = ' + n(Math.round((h - r * Math.ceil(T + 1)) * 100) / 100) + ' cm heraus. Das ist unmöglich.' : '') + '</p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (rg) { rg.addEventListener('input', function () { draw(); cnt++; if (cnt >= 3) done('Richtig: Die Gleichung rechnet einfach weiter, die Kerze aber nicht. Ein Modell gilt nur in einem sinnvollen Bereich, hier bis zur Nullstelle.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Fahrradverleih', q: 'Verleih A: 8 € plus 2 € pro Stunde. Verleih B: 3,50 € pro Stunde. Die Klasse hat pro Rad höchstens 20 € zur Verfügung. Wie lange kann sie bei Verleih A fahren?',
      steps: ['x und y festlegen: x = Zeit in Stunden, y = Preis pro Rad in €.', 'Gleichung für A: y = 2x + 8.', 'y ist gegeben: 20 = 2x + 8.', '20 − 8 = 2x ⇒ 12 = 2x ⇒ x = 6. Bei Verleih A kann sie <b>6 Stunden</b> fahren.', 'Vergleich: Bei B: 20 = 3,5x ⇒ x ≈ 5,7 Stunden. Für einen langen Ausflug ist A besser. Kontrolle: 2 · 6 + 8 = 20 ✓'] },
    tasks: { gen: gen, plan: { G: ['bedeutung:1', 'tarif_gleichung:1', 'kerze:1', 'x_berechnen:1'], S: ['tarif_gleichung:2', 'kerze:2', 'fuellen:2', 'x_berechnen:2', 'vergleich:2'], E: ['tarif_gleichung:2', 'bewegung:2', 'vergleich:2', 'grenzen:2', 'aus_zwei_werten:3', 'fuellen:2'] },
      extra: 'waffeln', test: ['bedeutung:1', 'tarif_gleichung:2', 'kerze:2', 'x_berechnen:2', 'vergleich:2', 'grenzen:2'] },
    lerncheck: ['Ich stelle aus einem Text eine lineare Funktionsgleichung auf.', 'Ich kann m und b in einer Sachsituation deuten.', 'Ich vergleiche zwei Angebote mit dem Schnittpunkt.', 'Ich erkenne die Grenzen eines Modells.']
  };
})();
