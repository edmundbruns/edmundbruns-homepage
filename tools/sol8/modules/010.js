/* Modul 010 · Lineare Funktionen erkennen */
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
  function sg(x) { return x < 0 ? '− ' + n(-x) : '+ ' + n(x); }
  var OPTS = ['proportional (und damit auch linear)', 'linear, aber nicht proportional', 'nicht linear'];
  var SHORT = ['proportional', 'linear, aber nicht proportional', 'nicht linear'];
  /* unabhängige Einordnung über Differenzen und den Wert bei x = 0 */
  function classify(f) {
    var xs = [-3, -1, 0.5, 2, 3, 4, 6.5], d0 = (f(xs[1]) - f(xs[0])) / (xs[1] - xs[0]);
    for (var i = 1; i < xs.length; i++) { var d = (f(xs[i]) - f(xs[i - 1])) / (xs[i] - xs[i - 1]); if (!isFinite(d) || Math.abs(d - d0) > 1e-9) return 2; }
    return Math.abs(f(0)) < 1e-9 ? 0 : 1;
  }
  function lin(m, b) { return function (x) { return m * x + b; }; }
  function coef(m) { return m === 1 ? '' : m === -1 ? '−' : n(m); }
  function linHtml(m, b) { return 'y = ' + (m === 0 ? n(b) : coef(m) + 'x' + (b ? ' ' + sg(b) : '')); }
  /* Funktion eines Typs erzeugen: { f, html, type, x0ok } */
  function makeFn(type, lvl) {
    if (type === 0) { var k = M.pick(lvl >= 2 ? [2, 3, 4, 5, -2, -3, 0.5, 1.5, 2.5] : [2, 3, 4, 5]); return { f: lin(k, 0), html: linHtml(k, 0), type: 0, zero: true }; }
    if (type === 1) { var m = M.pick(lvl >= 2 ? [2, 3, 4, -2, -3, 0.5, 1.5] : [2, 3, 4, 5]), b = lvl >= 2 ? M.nz(-6, 9) : M.rnd(1, 9); return { f: lin(m, b), html: linHtml(m, b), type: 1, zero: true }; }
    var c = M.rnd(0, 3);
    if (c === 0) { var a = M.pick([1, 2]), cc = M.rnd(0, 4); return { f: function (x) { return a * x * x + cc; }, html: 'y = ' + (a === 1 ? '' : a) + 'x²' + (cc ? ' + ' + cc : ''), type: 2, zero: true }; }
    if (c === 1) { var kk = M.pick([60, 120]); return { f: function (x) { return kk / x; }, html: 'y = ' + kk + ' : x', type: 2, zero: false }; }
    if (c === 2) return { f: function (x) { return Math.pow(2, x); }, html: 'y = 2<sup>x</sup>', type: 2, zero: true };
    return { f: function (x) { return x * x * x; }, html: 'y = x³', type: 2, zero: true };
  }
  function tab(xs, ys, hide, label) {
    return '<table class="tab"><tr><th>' + (label ? label[0] : 'x') + '</th>' + xs.map(function (x) { return '<td>' + n(x) + '</td>'; }).join('') + '</tr><tr><th>' + (label ? label[1] : 'y') + '</th>' + ys.map(function (y, i) { return '<td>' + (hide && hide.indexOf(i) >= 0 ? '?' : n(y)) + '</td>'; }).join('') + '</tr></table>';
  }
  function diffs(ys) { var d = []; for (var i = 1; i < ys.length; i++) d.push(ys[i] - ys[i - 1]); return d; }
  function dstr(d) { return d.map(function (v) { return (v >= 0 ? '+' : '−') + n(Math.abs(v)); }).join(', '); }
  var TEXTE = [
    [0, 'Ein Heft kostet 1,20 €. x ist die Anzahl der Hefte, y der Preis in €.', 'Doppelt so viele Hefte kosten doppelt so viel. 0 Hefte kosten 0 €.'],
    [0, 'Ein Auto fährt gleichmäßig 80 km pro Stunde. x ist die Fahrzeit in h, y die gefahrene Strecke in km.', 'Pro Stunde kommen immer 80 km dazu, und nach 0 h ist die Strecke 0 km.'],
    [0, 'In einen leeren Eimer fließen 6 Liter Wasser pro Minute. x ist die Zeit in min, y die Wassermenge in l.', 'Pro Minute kommen immer 6 l dazu, und am Anfang ist der Eimer leer.'],
    [0, '1 kg Äpfel kostet 2,50 €. x ist das Gewicht in kg, y der Preis in €.', 'Der Preis wächst gleichmäßig, und 0 kg kosten 0 €.'],
    [1, 'Ein Taxi kostet 4 € Grundgebühr und 2 € pro km. x ist die Strecke in km, y der Preis in €.', 'Pro km kommen immer 2 € dazu. Bei 0 km zahlt man aber schon 4 €.'],
    [1, 'Eine 20 cm hohe Kerze brennt pro Stunde 2 cm ab. x ist die Zeit in h, y die Höhe in cm.', 'Die Höhe nimmt pro Stunde immer um 2 cm ab. Am Anfang ist sie 20 cm, nicht 0.'],
    [1, 'In einem Becken sind schon 200 l Wasser. Pro Minute fließen 50 l dazu. x ist die Zeit in min, y die Wassermenge in l.', 'Pro Minute kommen immer 50 l dazu. Bei x = 0 sind schon 200 l da.'],
    [1, 'Ein Handyvertrag kostet 10 € im Monat und 0,09 € pro Minute. x sind die Minuten, y die Kosten in €.', 'Pro Minute kommen immer 0,09 € dazu. Bei 0 Minuten kostet er schon 10 €.'],
    [1, 'Lina hat 50 € gespart und legt jede Woche 5 € dazu. x sind die Wochen, y ist das Ersparte in €.', 'Jede Woche kommen 5 € dazu. Am Anfang sind schon 50 € da.'],
    [2, 'Ein Quadrat hat die Seitenlänge x in cm. y ist sein Flächeninhalt in cm².', 'y = x². Bei doppelter Seitenlänge wird die Fläche viermal so groß. Die Zunahme ist nicht immer gleich.'],
    [2, 'Für eine Strecke von 120 km braucht man je nach Geschwindigkeit verschieden lange. x ist die Geschwindigkeit in km/h, y die Fahrzeit in h.', 'Doppelte Geschwindigkeit, halbe Zeit: Das ist antiproportional, also nicht linear.'],
    [2, 'Eine Pizza für 12 € wird gerecht geteilt. x ist die Anzahl der Personen, y der Preis pro Person in €.', 'y = 12 : x. Mehr Personen, weniger pro Person, aber nicht gleichmäßig. Antiproportional, also nicht linear.'],
    [2, 'Ein Würfel hat die Kantenlänge x in cm. y ist sein Volumen in cm³.', 'y = x³. Die Zunahme wird immer größer.'],
    [2, 'Eine Bakterienkultur verdoppelt sich jede Stunde. x ist die Zeit in h, y die Anzahl der Bakterien.', 'Die Anzahl verdoppelt sich, die Zunahme wird also jede Stunde größer.']
  ];

  var gen = {
    text_art: function () {
      var t = M.pick(TEXTE);
      return { skill: 'Zusammenhang im Text erkennen', level: 1, q: t[1] + '<br><b>Wie hängt y von x ab?</b>',
        inputs: [{ kind: 'mc', label: 'Der Zusammenhang ist …', options: OPTS, answer: t[0] }],
        hints: ['Frage dich: Ändert sich y in jedem gleich großen Schritt von x um denselben Betrag? Dann ist er linear.', 'Ist er linear, prüfe den Startwert: Ist y = 0, wenn x = 0 ist? Dann ist er proportional.', 'Eine Grundgebühr oder ein Startwert bedeutet: linear, aber nicht proportional.'],
        solution: '<b>' + SHORT[t[0]] + '</b>. ' + t[2] };
    },
    tab_art: function (lvl) {
      var type = M.rnd(0, 2), fn = makeFn(type, lvl), step = lvl === 3 && Math.random() < 0.6 ? 2 : 1, x0;
      if (!fn.zero) x0 = step === 2 ? 2 : M.rnd(1, 2); else x0 = M.pick(step === 2 ? [0, 1] : [0, 1, 2]);
      var xs = [0, 1, 2, 3, 4].map(function (i) { return x0 + i * step; }), ys = xs.map(fn.f), d = diffs(ys);
      return { skill: 'Zusammenhang an Tabelle erkennen', q: 'Welcher Zusammenhang gehört zu dieser Tabelle?' + tab(xs, ys),
        inputs: [{ kind: 'mc', label: 'Der Zusammenhang ist …', options: OPTS, answer: type }],
        hints: ['Berechne, um wie viel sich y von Spalte zu Spalte ändert.', 'Die Änderungen sind: ' + dstr(d) + '. Sind sie alle gleich?', 'Wenn ja: linear. Prüfe dann, ob y : x immer gleich ist bzw. ob zu x = 0 der Wert y = 0 gehört. Dann ist der Zusammenhang proportional.'],
        solution: 'Änderungen von y: ' + dstr(d) + '. ' + (type === 2 ? 'Sie sind <b>nicht</b> gleich, also ist der Zusammenhang <b>nicht linear</b>.' : 'Sie sind immer gleich, also ist der Zusammenhang linear. ' + (type === 0 ? 'Außerdem ist y : x immer ' + n(ys[ys.length - 1] / xs[xs.length - 1]) + ' (bei x = 0 ist y = 0). Er ist <b>proportional</b>.' : 'Bei x = 0 ist aber y = ' + n(fn.f(0)) + ', nicht 0. Er ist <b>linear, aber nicht proportional</b>.')) + ' Gleichung: ' + fn.html + '.',
        mistakes: function (v) { if (+v[0] === 0 && type === 1) return 'Die Änderungen sind zwar gleich. Proportional ist ein Zusammenhang aber nur, wenn y : x immer gleich ist und der Graph durch (0 | 0) geht.'; if (type === 2 && +v[0] !== 2) return 'Prüfe die Änderungen von Spalte zu Spalte genau. Sind sie wirklich alle gleich?'; return null; },
        verify: function () { return classify(fn.f) === type || 'Typ passt nicht'; } };
    },
    gleichung_art: function (lvl) {
      var type = M.rnd(0, 2), fn;
      if (lvl === 3 && Math.random() < 0.5) {
        var a = M.rnd(2, 4), c = M.rnd(1, 4), tricky = [
          { f: function (x) { return a * (x + c) - a * c; }, html: 'y = ' + a + '(x + ' + c + ') − ' + a * c, type: 0 },
          { f: function (x) { return x / a; }, html: 'y = x : ' + a, type: 0 },
          { f: function (x) { return a * (x + c); }, html: 'y = ' + a + '(x + ' + c + ')', type: 1 },
          { f: function () { return a + 3; }, html: 'y = ' + (a + 3), type: 1 },
          { f: function (x) { return x * (x + c); }, html: 'y = x · (x + ' + c + ')', type: 2 },
          { f: function (x) { return a * x * x; }, html: 'y = ' + a + ' · x · x', type: 2 }];
        fn = M.pick(tricky.filter(function (t) { return t.type === type; }));
      } else fn = makeFn(type, lvl);
      return { skill: 'Zusammenhang an Gleichung erkennen', q: 'Welcher Zusammenhang wird durch diese Gleichung beschrieben? <span class="big-math">' + fn.html + '</span>',
        inputs: [{ kind: 'mc', label: 'Der Zusammenhang ist …', options: OPTS, answer: type }],
        hints: ['Lineare Zusammenhänge lassen sich als y = mx + b schreiben. x kommt nur einfach vor, nicht als x², nicht im Nenner und nicht im Exponenten.', 'Proportional ist der Spezialfall y = mx, also b = 0.', 'Vereinfache die Gleichung, falls nötig. Setze zur Kontrolle x = 0, 1, 2 ein.'],
        solution: fn.html + ' ist <b>' + SHORT[type] + '</b>. Werte für x = 0, 1, 2, 3: ' + [0, 1, 2, 3].map(function (x) { var y = fn.f(x); return isFinite(y) ? n(y) : 'nicht definiert'; }).join('; ') + '.',
        verify: function () { return classify(fn.f) === type || 'Typ passt nicht: ' + fn.html; } };
    },
    graph_art: function (lvl) {
      var type = M.rnd(0, 2), L, f;
      if (type < 2) { var m = M.pick(lvl >= 2 ? [F(2), F(-2), F(1, 2), F(-1, 2), F(1), F(-1), F(3), F(2, 3)] : [F(2), F(1), F(-1), F(1, 2)]), b = type === 0 ? 0 : M.nz(-3, 3); L = { m: m, b: b }; f = lin(mval(m), b); }
      else { var c = M.rnd(0, 2); if (c === 0) { var a = M.pick([0.5, 1, -0.5]), cc = M.rnd(-3, 1); if (a < 0) cc = M.rnd(0, 3); f = function (x) { return a * x * x + cc; }; } else if (c === 1) { var k = M.pick([4, 6, -4]); f = function (x) { return k / x; }; } else { var c2 = M.rnd(-3, 0); f = function (x) { return Math.abs(x) + c2; }; } L = { f: f }; }
      return { skill: 'Zusammenhang am Graphen erkennen', q: 'Welcher Zusammenhang gehört zu diesem Graphen?' + graph([L], { r: 5, label: 'Graph eines Zusammenhangs' }),
        inputs: [{ kind: 'mc', label: 'Der Zusammenhang ist …', options: OPTS, answer: type }],
        hints: ['Der Graph eines linearen Zusammenhangs ist eine Gerade.', 'Ist der Graph eine Gerade, schau, ob sie durch den Ursprung (0 | 0) geht.', 'Gerade durch (0 | 0): proportional. Gerade, die nicht durch (0 | 0) geht: linear, aber nicht proportional. Kurve oder Knick: nicht linear.'],
        solution: type === 2 ? 'Der Graph ist keine Gerade (Kurve oder Knick). Der Zusammenhang ist <b>nicht linear</b>.' : type === 0 ? 'Der Graph ist eine Gerade durch den Ursprung. Der Zusammenhang ist <b>proportional</b>.' : 'Der Graph ist eine Gerade. Sie schneidet die y-Achse bei ' + n(L.b) + ', nicht im Ursprung. Der Zusammenhang ist <b>linear, aber nicht proportional</b>.',
        verify: function () { return classify(f) === type || 'Typ passt nicht'; } };
    },
    aenderungsrate: function (lvl) {
      var m = M.pick(lvl === 1 ? [2, 3, 4, 5, -2, -3] : [2, 3, 4, -2, -3, -4, 1.5, 2.5, -1.5, 0.5]), b = M.rnd(-5, 8);
      var step = lvl === 3 ? M.pick([2, 5]) : 1, x0 = lvl === 2 ? M.rnd(1, 3) : M.pick([0, step]);
      var xs = [0, 1, 2, 3, 4].map(function (i) { return x0 + i * step; }), ys = xs.map(lin(m, b));
      var inputs = [{ kind: 'num', answer: m, label: 'Änderung von y pro 1 in x' }];
      if (lvl === 2) inputs.push({ kind: 'num', answer: b, label: 'y bei x = 0' });
      return { skill: 'Konstante Änderungsrate', q: 'Die Tabelle gehört zu einem linearen Zusammenhang.' + tab(xs, ys) + '<b>Um wie viel ändert sich y, wenn x um 1 größer wird?</b>' + (lvl === 2 ? ' Welchen Wert hat y bei x = 0?' : ''),
        inputs: inputs,
        hints: ['Bei einem linearen Zusammenhang ändert sich y immer um denselben Betrag, wenn x um denselben Betrag wächst.', 'Von Spalte zu Spalte ändert sich y um ' + (m * step >= 0 ? '+' : '−') + n(Math.abs(m * step)) + '. ' + (step > 1 ? 'Dabei wächst x aber um ' + step + '. Teile durch ' + step + '.' : 'x wächst dabei um 1.'), lvl === 2 ? 'Für y bei x = 0 rechnest du von x = ' + x0 + ' aus ' + x0 + ' Schritte zurück: ' + n(ys[0]) + ' − ' + x0 + ' · (' + n(m) + ').' : 'Achte auf das Vorzeichen: Wird y kleiner, ist die Änderung negativ.'],
        solution: (step > 1 ? 'Pro Spalte ändert sich y um ' + n(m * step) + ', x um ' + step + '. Pro 1 in x also ' + n(m * step) + ' : ' + step + ' = <b>' + n(m) + '</b>.' : 'Wächst x um 1, ändert sich y immer um <b>' + n(m) + '</b>.') + (lvl === 2 ? ' Bei x = 0: ' + n(ys[0]) + ' − ' + x0 + ' · (' + n(m) + ') = <b>' + n(b) + '</b>.' : ''),
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y === null) return null; if (step > 1 && Math.abs(y - m * step) < 1e-9) return 'Das ist die Änderung pro Spalte. x wächst aber um ' + step + ' pro Spalte. Teile noch durch ' + step + '.'; if (Math.abs(y + m) < 1e-9) return 'Achte auf das Vorzeichen: Wird y größer, ist die Änderung positiv, wird y kleiner, ist sie negativ.'; return null; },
        verify: function () { return Math.abs((ys[4] - ys[0]) / (xs[4] - xs[0]) - m) < 1e-9 || 'Rate falsch'; } };
    },
    luecke: function (lvl) {
      var m = M.pick(lvl >= 3 ? [1.5, 2.5, -1.5, 0.5, -2.5] : [2, 3, 4, 5, -2, -3, -4]), b = M.rnd(-6, 10), xs = [0, 1, 2, 3, 4, 5];
      if (lvl >= 3) xs = xs.map(function (x) { return x * 2; });
      var ys = xs.map(lin(m, b)), hide;
      hide = M.shuffle([1, 2, 3, 4, 5]).slice(0, 2).sort();
      var k = [0, 1, 2, 3, 4, 5].filter(function (i) { return hide.indexOf(i) < 0; }), dd = (ys[k[1]] - ys[k[0]]) / (k[1] - k[0]);
      return { skill: 'Tabelle eines linearen Zusammenhangs ergänzen', q: 'Der Zusammenhang ist linear. Ergänze die fehlenden Werte.' + tab(xs, ys, hide),
        inputs: [{ kind: 'num', answer: ys[hide[0]], label: 'y bei x = ' + n(xs[hide[0]]) }, { kind: 'num', answer: ys[hide[1]], label: 'y bei x = ' + n(xs[hide[1]]) }],
        hints: ['Linear heißt: Von Spalte zu Spalte ändert sich y immer um denselben Betrag.', 'Vergleiche zwei bekannte Werte: Von x = ' + n(xs[k[0]]) + ' bis x = ' + n(xs[k[1]]) + ' ändert sich y um ' + n(ys[k[1]] - ys[k[0]]) + '. Das sind ' + (k[1] - k[0]) + ' Spalten.', 'Pro Spalte ändert sich y also um ' + n(dd) + '. Rechne von einem bekannten Wert aus weiter.'],
        solution: 'Pro Spalte ändert sich y um ' + n(dd) + '. Vollständige Tabelle:' + tab(xs, ys),
        verify: function () { return Math.abs(ys[hide[1]] - ys[hide[0]] - dd * (hide[1] - hide[0])) < 1e-9 || 'Lücke falsch'; } };
    },
    prop_faktor: function (lvl) {
      var k = M.pick(lvl === 1 ? [2, 3, 4, 5] : [1.5, 2.5, 3, 4, 0.5, 1.2, 0.8, 6]), step = M.pick([1, 2]), x0 = step, xs = [0, 1, 2, 3, 4].map(function (i) { return x0 + i * step; }), ys = xs.map(lin(k, 0));
      var ctx = M.pick([['Menge in kg', 'Preis in €'], ['Zeit in min', 'Wasser in l'], ['Anzahl', 'Preis in €'], ['Zeit in h', 'Strecke in km']]);
      return { skill: 'Proportionalitätsfaktor', q: 'Die Zuordnung ist proportional.' + tab(xs, ys, null, ctx) + 'Berechne den Quotienten y : x und gib die Gleichung an (x: ' + ctx[0] + ', y: ' + ctx[1] + ').',
        inputs: [{ kind: 'num', answer: k, label: 'y : x =' }, { kind: 'term', answer: String(k) + 'x', label: 'y =', placeholder: 'z. B. 2,5x' }],
        src: '(' + ys[2] + '/' + xs[2] + ')*x',
        hints: ['Bei einer proportionalen Zuordnung ist der Quotient y : x für alle Wertepaare gleich.', 'Rechne zum Beispiel ' + n(ys[1]) + ' : ' + n(xs[1]) + '.', 'Der Quotient ist der Proportionalitätsfaktor. Die Gleichung lautet y = (Faktor) · x.'],
        solution: n(ys[0]) + ' : ' + n(xs[0]) + ' = ' + n(ys[1]) + ' : ' + n(xs[1]) + ' = … = <b>' + n(k) + '</b>. Gleichung: <b>y = ' + n(k) + 'x</b>.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y !== null && Math.abs(y - 1 / k) < 1e-6) return 'Du hast x : y gerechnet. Gesucht ist y : x.'; return null; },
        verify: function () { return ys.every(function (y, i) { return Math.abs(y / xs[i] - k) < 1e-9; }) || 'Quotient nicht konstant'; } };
    },
    punkte_linie: function () {
      var m = M.pick([2, 3, -2, -1, 1, 4]), b = M.rnd(-4, 4), xa = M.rnd(-3, 0), xb = xa + M.rnd(1, 3), xc = xb + M.rnd(2, 4), on = Math.random() < 0.5;
      var ya = m * xa + b, yb = m * xb + b, yc = m * xc + b + (on ? 0 : M.pick([-2, -1, 1, 2]));
      var r1 = (yb - ya) / (xb - xa), r2 = (yc - yb) / (xc - xb);
      return { skill: 'Punkte auf einer Geraden', level: 3, q: 'Liegen die Punkte A(' + n(xa) + ' | ' + n(ya) + '), B(' + n(xb) + ' | ' + n(yb) + ') und C(' + n(xc) + ' | ' + n(yc) + ') auf <b>einer</b> Geraden?',
        inputs: [{ kind: 'mc', label: 'Antwort', options: ['Ja, A, B und C liegen auf einer Geraden.', 'Nein, sie liegen nicht auf einer Geraden.'], answer: on ? 0 : 1 }],
        hints: ['Auf einer Geraden ist die Änderungsrate überall gleich: (Änderung von y) : (Änderung von x).', 'Von A nach B: (' + n(yb) + ' − (' + n(ya) + ')) : (' + n(xb) + ' − (' + n(xa) + ')) = ' + n(yb - ya) + ' : ' + n(xb - xa) + ' = ' + n(r1) + '.', 'Berechne genauso die Rate von B nach C und vergleiche.'],
        solution: 'Rate A → B: ' + n(yb - ya) + ' : ' + n(xb - xa) + ' = ' + n(r1) + '. Rate B → C: ' + n(yc - yb) + ' : ' + n(xc - xb) + ' = ' + n(Math.round(r2 * 1000) / 1000) + '. ' + (on ? 'Gleich, also liegen alle drei Punkte auf einer Geraden.' : 'Verschieden, also liegen die Punkte <b>nicht</b> auf einer Geraden.'),
        verify: function () { return (Math.abs(r1 - r2) < 1e-9) === on || 'Raten'; } };
    },
    ungleich: function () {
      var m = M.pick([1.5, 2, 2.5, 3, -2, -1.5, 4, -3]), b = M.rnd(-5, 12), xs;
      do { xs = M.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]).slice(0, 5).sort(function (a, c) { return a - c; }); } while (new Set(diffs(xs)).size < 3 || xs[1] - xs[0] < 2);
      var ys = xs.map(lin(m, b)), X = 20, Yx = m * X + b;
      return { skill: 'Änderungsrate bei ungleichen Abständen', level: 3, q: 'Diese Tabelle gehört zu einem linearen Zusammenhang. Achtung: Die x-Werte haben <b>unterschiedliche Abstände</b>.' + tab(xs, ys) + 'a) Um wie viel ändert sich y, wenn x um 1 größer wird?<br>b) Welchen Wert hat y bei x = ' + X + '?',
        inputs: [{ kind: 'num', answer: m, label: 'a) Änderung pro 1' }, { kind: 'num', answer: Yx, label: 'b) y bei x = ' + X }],
        hints: ['Teile die Änderung von y durch die Änderung von x. Nur dann kannst du Spalten mit verschiedenen Abständen vergleichen.', 'Zum Beispiel von x = ' + xs[0] + ' bis x = ' + xs[1] + ': y ändert sich um ' + n(ys[1] - ys[0]) + ', x um ' + (xs[1] - xs[0]) + '. Also ' + n(ys[1] - ys[0]) + ' : ' + (xs[1] - xs[0]) + ' = ' + n(m) + ' pro 1.', 'Von x = ' + xs[4] + ' bis x = ' + X + ' sind es ' + (X - xs[4]) + ' Schritte. Rechne ' + n(ys[4]) + ' + ' + (X - xs[4]) + ' · (' + n(m) + ').'],
        solution: 'a) ' + n(ys[1] - ys[0]) + ' : ' + (xs[1] - xs[0]) + ' = <b>' + n(m) + '</b> (zur Kontrolle: ' + n(ys[4] - ys[3]) + ' : ' + (xs[4] - xs[3]) + ' = ' + n(m) + '). b) y = ' + n(ys[4]) + ' + ' + (X - xs[4]) + ' · (' + n(m) + ') = <b>' + n(Yx) + '</b>.',
        mistakes: function (v) { var y = M.parseNum(v[0]); if (y !== null && Math.abs(y - (ys[1] - ys[0])) < 1e-9) return 'Bei a) hast du nur die Änderung zwischen zwei Spalten genommen. Dort wächst x aber um ' + (xs[1] - xs[0]) + '. Teile noch durch ' + (xs[1] - xs[0]) + '.'; return null; },
        verify: function () { return Math.abs((Yx - ys[0]) / (X - xs[0]) - m) < 1e-9 || 'Wert falsch'; } };
    }
  };
  /* Ausprobieren */
  var EXP = [
    { name: 'y = 2x', f: function (x) { return 2 * x; } },
    { name: 'y = 2x + 3', f: function (x) { return 2 * x + 3; } },
    { name: 'y = −2x + 12', f: function (x) { return -2 * x + 12; } },
    { name: 'y = 0,5x²', f: function (x) { return 0.5 * x * x; } },
    { name: 'y = 12 : x', f: function (x) { return 12 / x; } }];

  return {
    id: '010', title: 'Lineare Funktionen erkennen', bereich: 'Funktionaler Zusammenhang', minutes: '45 bis 60',
    vorkenntnisse: 'Proportionale und antiproportionale Zuordnungen, Koordinatensystem',
    lead: 'Taxi, Kerze, Handyvertrag: Viele Zusammenhänge im Alltag wachsen gleichmäßig. Du lernst, lineare Zusammenhänge an Tabelle, Graph, Text und Gleichung zu erkennen.',
    einstieg: { html: '<p>Drei Angebote für den Klassenausflug ins Schwimmbad:</p><ul><li><b>Bad A:</b> 3 € Eintritt pro Person.</li><li><b>Bad B:</b> 20 € Gruppengebühr und 2 € pro Person.</li><li><b>Bad C:</b> 60 € für die ganze Gruppe, egal wie viele kommen. Die Kosten werden gerecht geteilt.</li></ul><p class="note">Bei welchem Bad steigen die Gesamtkosten gleichmäßig mit der Zahl der Personen? Und bei welchem Bad kostet es pro Person weniger, je mehr mitkommen?</p><p>In diesem Modul lernst du, solche Zusammenhänge zu unterscheiden: <b>proportional</b>, <b>linear</b> oder <b>nicht linear</b>.</p>' },
    ziele: ['Ich erkenne an einer Tabelle, ob ein Zusammenhang linear ist (konstante Änderung).', 'Ich unterscheide proportionale von linearen, nicht proportionalen Zusammenhängen.', 'Ich erkenne lineare Zusammenhänge an ihrem Graphen (Gerade) und an der Gleichung y = mx + b.', 'Ich ordne Alltagssituationen richtig ein.', 'Ich berechne die Änderung von y pro Schritt und ergänze Tabellen.'],
    fachwoerter: [['Proportional', 'y = m · x. Der Quotient y : x ist immer gleich. Der Graph ist eine Gerade durch den Ursprung.'], ['Linear', 'y = mx + b. Wächst x um 1, ändert sich y immer um denselben Wert m. Der Graph ist eine Gerade.'], ['Nicht linear', 'Die Änderung von y ist nicht immer gleich. Der Graph ist keine Gerade, zum Beispiel y = x² oder y = 12 : x.'], ['Änderungsrate', 'Um wie viel sich y ändert, wenn x um 1 größer wird.']],
    diagnose: [
      { q: 'Eine Zuordnung ist proportional. 3 Hefte kosten 4,50 €. Was kosten 6 Hefte?', options: ['9 €', '7,50 €', '13,50 €', 'Weiß ich noch nicht'], answer: 0, why: 'Doppelte Anzahl, doppelter Preis: 2 · 4,50 € = 9 €.', review: 'Proportionale Zuordnungen (Klasse 7)' },
      { q: '4 Personen brauchen für eine Arbeit 6 Stunden. Wie lange brauchen 8 Personen, wenn alle gleich schnell arbeiten?', options: ['3 Stunden', '12 Stunden', '10 Stunden', 'Weiß ich noch nicht'], answer: 0, why: 'Antiproportional: doppelt so viele Personen, halbe Zeit.', review: 'Antiproportionale Zuordnungen' },
      { q: 'Welchen Wert hat 3x + 2 für x = 4?', options: ['14', '20', '9', 'Weiß ich noch nicht'], answer: 0, why: '3 · 4 + 2 = 14.', review: 'Werte von Termen berechnen' },
      { q: 'Wie sieht der Graph einer proportionalen Zuordnung aus?', options: ['eine Gerade durch den Ursprung', 'eine Kurve', 'eine waagerechte Linie', 'Weiß ich noch nicht'], answer: 0, why: 'Proportionale Zuordnungen haben eine Ursprungsgerade als Graph.', review: 'Graphen von Zuordnungen' }],
    erklaerung:
      '<h3>1. Lineare Zusammenhänge</h3><p>Bei Bad B aus dem Einstieg kostet jede weitere Person 2 € mehr. Die Kosten wachsen <b>gleichmäßig</b>:</p>' +
      tab([0, 1, 2, 3, 4], [20, 22, 24, 26, 28], null, ['Personen', 'Kosten in €']) +
      '<p>Wächst x um 1, wächst y immer um 2. So ein Zusammenhang heißt <b>linear</b>. Er lässt sich mit einer Gleichung y = mx + b beschreiben, hier y = 2x + 20. Sein Graph ist eine <b>Gerade</b>.</p>' +
      '<div class="merk"><b>Merke:</b> Ein Zusammenhang ist <b>linear</b>, wenn sich y bei gleichen Schritten von x immer um denselben Betrag ändert (konstante Änderungsrate). Gleichung: <b>y = mx + b</b>. Graph: <b>Gerade</b>.<br>Ein linearer Zusammenhang mit b = 0, also <b>y = mx</b>, heißt <b>proportional</b>. Sein Graph ist eine Gerade durch den Ursprung (0 | 0).</div>' +
      '<h3>2. So prüfst du</h3><table class="tab"><tr><th></th><th>proportional</th><th>linear, nicht prop.</th><th>nicht linear</th></tr><tr><th>Tabelle</th><td>gleiche Änderung, y : x immer gleich</td><td>gleiche Änderung, bei x = 0 ist y ≠ 0</td><td>Änderung nicht gleich</td></tr><tr><th>Graph</th><td>Gerade durch (0 | 0)</td><td>Gerade, nicht durch (0 | 0)</td><td>Kurve oder Knick</td></tr><tr><th>Gleichung</th><td>y = mx</td><td>y = mx + b, b ≠ 0</td><td>z. B. y = x², y = 12 : x</td></tr></table>' +
      '<p>Bad A (y = 3x) ist proportional. Bad C (Preis pro Person y = 60 : x) ist antiproportional, also <b>nicht linear</b>: Mit 2 Personen zahlt jeder 30 €, mit 3 Personen 20 €, mit 4 Personen 15 €. Die Änderungen −10 und −5 sind nicht gleich.</p>' +
      '<p class="note"><b>Achtung:</b> Prüfe bei Tabellen, ob die x-Werte gleichmäßig wachsen. Sonst musst du die Änderung von y durch die Änderung von x teilen.</p>',
    entdecken: {
      html: '<p>Wähle einen Zusammenhang. Vergleiche die Änderungen in der Tabelle mit dem Graphen.</p><div class="ctl"><label>Zusammenhang <select id="e_sel">' + EXP.map(function (e, i) { return '<option value="' + i + '">' + e.name + '</option>'; }).join('') + '</select></label><button class="btn ghost" id="e_q" type="button">y : x zeigen</button></div><div id="e_tab" style="overflow-x:auto"></div><div id="e_g"></div><p class="fb" id="e_v" style="display:block"></p>',
      init: function (root, done) {
        var cnt = 0, showQ = false, sel = root.querySelector('#e_sel');
        function draw() {
          var e = EXP[+sel.value], xs = [1, 2, 3, 4, 5], ys = xs.map(e.f), d = diffs(ys), type = classify(e.f);
          var t = '<table class="tab"><tr><th>x</th>' + xs.map(function (x) { return '<td>' + x + '</td>'; }).join('') + '</tr><tr><th>y</th>' + ys.map(function (y) { return '<td>' + n(Math.round(y * 100) / 100) + '</td>'; }).join('') + '</tr>' +
            '<tr><th>Änderung</th><td></td>' + d.map(function (v) { return '<td style="color:#b45309;font-weight:700">' + (v >= 0 ? '+' : '−') + n(Math.round(Math.abs(v) * 100) / 100) + '</td>'; }).join('') + '</tr>' +
            (showQ ? '<tr><th>y : x</th>' + ys.map(function (y, i) { return '<td>' + n(Math.round(y / xs[i] * 100) / 100) + '</td>'; }).join('') + '</tr>' : '') + '</table>';
          root.querySelector('#e_tab').innerHTML = t;
          root.querySelector('#e_g').innerHTML = graph([{ f: e.f, from: 0.4, pts: xs.map(function (x, i) { return [x, ys[i]]; }) }], { x: [0, 6], y: [0, 14], gy: 1, ly: 2, lx: 1, w: 300, label: 'Graph von ' + e.name });
          var v = root.querySelector('#e_v');
          v.className = 'fb ' + (type === 2 ? 'bad' : 'good');
          v.innerHTML = type === 2 ? 'Die Änderungen sind <b>nicht gleich</b>. Der Graph ist keine Gerade: <b>nicht linear</b>.' : 'Die Änderungen sind <b>immer gleich</b>. Der Graph ist eine Gerade: <b>linear</b>. ' + (type === 0 ? 'Er geht durch (0 | 0) und y : x ist immer gleich: <b>proportional</b>.' : 'Er geht nicht durch (0 | 0): <b>nicht proportional</b>.');
        }
        function hit() { cnt++; if (cnt >= 2) done('Gut verglichen: Gleiche Änderungen in der Tabelle bedeuten eine Gerade. Geht die Gerade durch den Ursprung, ist der Zusammenhang proportional.'); }
        sel.addEventListener('change', function () { draw(); hit(); });
        root.querySelector('#e_q').addEventListener('click', function () { showQ = !showQ; this.textContent = showQ ? 'y : x verbergen' : 'y : x zeigen'; draw(); hit(); });
        draw();
      }
    },
    beispiel: { title: 'Tabelle untersuchen', q: 'Untersuche die Tabelle: x = 1, 2, 3, 4 und y = 7, 10, 13, 16. Ist der Zusammenhang proportional, linear oder nicht linear?',
      steps: ['Änderungen von y berechnen: 10 − 7 = 3, 13 − 10 = 3, 16 − 13 = 3.', 'Die Änderungen sind immer gleich (+3), und x wächst jeweils um 1. Der Zusammenhang ist <b>linear</b>.', 'Proportional? Quotienten: 7 : 1 = 7, aber 10 : 2 = 5. Die Quotienten sind verschieden, also nicht proportional.', 'Rechne zurück zu x = 0: 7 − 3 = 4. Die Gleichung ist y = 3x + 4. Der Graph schneidet die y-Achse bei 4.', 'Ergebnis: <b>linear, aber nicht proportional</b>. Kontrolle mit x = 4: 3 · 4 + 4 = 16. Stimmt!' + graph([{ m: F(3), b: 4, pts: [[1, 7], [2, 10], [3, 13], [4, 16]] }], { x: [0, 5], y: [0, 18], gy: 2, ly: 4, lx: 1, label: 'Graph von y = 3x + 4' })] },
    tasks: { gen: gen, plan: { G: ['text_art:1', 'tab_art:1', 'aenderungsrate:1', 'graph_art:1'], S: ['tab_art:2', 'aenderungsrate:2', 'gleichung_art:2', 'graph_art:2', 'luecke:2'], E: ['tab_art:3', 'gleichung_art:3', 'aenderungsrate:3', 'prop_faktor:2', 'punkte_linie:3', 'text_art:2'] },
      extra: 'ungleich', test: ['text_art:1', 'tab_art:2', 'gleichung_art:2', 'graph_art:2', 'aenderungsrate:2', 'luecke:2'] },
    lerncheck: ['Ich erkenne an einer Tabelle, ob ein Zusammenhang linear ist.', 'Ich unterscheide proportional und linear.', 'Ich erkenne lineare Zusammenhänge am Graphen und an der Gleichung.', 'Ich ordne Alltagssituationen richtig ein.']
  };
})();
