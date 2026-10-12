/* Modul 027 (Klasse 9) · Zylinder: Oberfläche und Volumen */
var MODULE = (function () {
  var f = M.fmtNum, PI = Math.PI;
  var LN = '#1e3a8a', FL = '#e8eefc', AC = '#d97706', HL = '#1d4ed8', C2 = '#0f766e', OR = '#fbe3c2', TOP = '#d3def7';
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function f1(x) { return f(x, 1); }
  function ex(x) { return f(Math.round(x * 1000) / 1000); }
  function near(x, y, t) { return x !== null && Math.abs(x - y) <= (t || 0.06); }
  function u(x, e) { return f(x) + ' ' + (e || 'cm'); }
  /* Unabhängige Kontrolle: Umfang über Vielecke (Archimedes), Kreisfläche über numerische Integration */
  var PI_A = (function () { var s = 1, n = 6; for (var k = 0; k < 14; k++) { s = s / Math.sqrt(2 + Math.sqrt(4 - s * s)); n *= 2; } return n * s / 2; })();
  function intA(r) { var N = 20000, hh = r / N, s = 0; for (var i = 0; i < N; i++) { var x = (i + 0.5) * hh; s += Math.sqrt(r * r - x * x); } return 4 * s * hh; }
  function vol(r, h) { return intA(r) * h; }
  function man(r, h) { return 2 * PI_A * r * h; }
  function chk(ans, val, tol) { return function () { return Math.abs(ans - val) <= tol + 1e-7 * Math.abs(val) + 1e-6 || 'Nachrechnung: ' + val + ' statt ' + ans; }; }

  /* Schrägbild: Grund- und Deckfläche als Ellipsen, hintere Hälfte unten gestrichelt */
  function cylPic(r, h, o) {
    o = o || {}; var sc = Math.min((o.maxW || 150) / (2 * r), (o.maxH || 160) / h), R = r * sc, H = h * sc, ry = R * 0.32;
    var cx = 16 + R, yt = 30 + ry, yb = yt + H, W = Math.max(cx + R + 96, 250), Ht = yb + ry + 14;
    var s = '<svg class="viz" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(Ht) + '" role="img" aria-label="' + (o.label || 'Schrägbild eines Zylinders') + '" style="max-width:' + (o.max || 300) + 'px">';
    var body = 'M' + (cx - R) + ' ' + yt + ' L' + (cx - R) + ' ' + yb + ' A' + R + ' ' + ry + ' 0 0 0 ' + (cx + R) + ' ' + yb + ' L' + (cx + R) + ' ' + yt + ' Z';
    s += '<path d="' + body + '" fill="' + (o.fill || FL) + '" stroke="none"/>';
    if (o.water) { var yw = yb - o.water * sc; s += '<path d="M' + (cx - R) + ' ' + yw + ' L' + (cx - R) + ' ' + yb + ' A' + R + ' ' + ry + ' 0 0 0 ' + (cx + R) + ' ' + yb + ' L' + (cx + R) + ' ' + yw + ' A' + R + ' ' + ry + ' 0 0 1 ' + (cx - R) + ' ' + yw + ' Z" fill="#bcd3f5"/><ellipse cx="' + cx + '" cy="' + yw + '" rx="' + R + '" ry="' + ry + '" fill="#a9c6f2" stroke="' + HL + '" stroke-width="1.2"/>'; }
    s += '<path d="M' + (cx - R) + ' ' + yb + ' A' + R + ' ' + ry + ' 0 0 1 ' + (cx + R) + ' ' + yb + '" fill="none" stroke="' + LN + '" stroke-width="1.5" stroke-dasharray="5 4"/>';
    s += '<path d="M' + (cx - R) + ' ' + yb + ' A' + R + ' ' + ry + ' 0 0 0 ' + (cx + R) + ' ' + yb + '" fill="none" stroke="' + LN + '" stroke-width="2.5"/>';
    s += '<line x1="' + (cx - R) + '" y1="' + yt + '" x2="' + (cx - R) + '" y2="' + yb + '" stroke="' + LN + '" stroke-width="2.5"/><line x1="' + (cx + R) + '" y1="' + yt + '" x2="' + (cx + R) + '" y2="' + yb + '" stroke="' + LN + '" stroke-width="2.5"/>';
    s += '<ellipse cx="' + cx + '" cy="' + yt + '" rx="' + R + '" ry="' + ry + '" fill="' + (o.hollow ? '#fff' : TOP) + '" stroke="' + LN + '" stroke-width="2.5"/>';
    if (o.hollow) { var Ri = R * o.hollow; s += '<ellipse cx="' + cx + '" cy="' + yt + '" rx="' + R + '" ry="' + ry + '" fill="' + TOP + '" stroke="none"/><ellipse cx="' + cx + '" cy="' + yt + '" rx="' + Ri + '" ry="' + (ry * o.hollow) + '" fill="#fff" stroke="' + LN + '" stroke-width="2"/>'; }
    s += '<circle cx="' + cx + '" cy="' + yt + '" r="2.5" fill="' + LN + '"/>';
    function lab(x, y, t, anc, col) { return '<text x="' + x + '" y="' + y + '" font-size="15" font-weight="700" text-anchor="' + (anc || 'middle') + '" fill="' + (col || '#1c1830') + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + t + '</text>'; }
    if (o.rText) { s += '<line x1="' + cx + '" y1="' + yt + '" x2="' + (cx + R) + '" y2="' + yt + '" stroke="' + AC + '" stroke-width="2.2"/>' + lab(cx + R / 2, yt - ry - 8, o.rText, R < 40 ? 'start' : 'middle'); }
    if (o.dText) { s += '<line x1="' + (cx - R) + '" y1="' + yt + '" x2="' + (cx + R) + '" y2="' + yt + '" stroke="' + AC + '" stroke-width="2.2"/>' + lab(cx, yt - ry - 8, o.dText); }
    if (o.riText && o.hollow) { s += '<line x1="' + cx + '" y1="' + yt + '" x2="' + (cx - R * o.hollow) + '" y2="' + yt + '" stroke="' + C2 + '" stroke-width="2"/>' + lab(cx - R * o.hollow / 2, yt + ry * o.hollow + 18, o.riText, 'middle', C2); }
    if (o.hText) { s += '<line x1="' + (cx + R + 12) + '" y1="' + yt + '" x2="' + (cx + R + 12) + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.2"/><line x1="' + (cx + R + 7) + '" y1="' + yt + '" x2="' + (cx + R + 17) + '" y2="' + yt + '" stroke="#1c1830" stroke-width="1.2"/><line x1="' + (cx + R + 7) + '" y1="' + yb + '" x2="' + (cx + R + 17) + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.2"/>' + lab(cx + R + 20, (yt + yb) / 2 + 5, o.hText, 'start'); }
    return s + '</svg>';
  }
  /* Netz: Rechteck (Länge = Umfang, Breite = h) mit zwei Kreisen */
  function netPic(r, h, o) {
    o = o || {}; var Lw = 2 * PI * r, sc = Math.min((o.maxW || 300) / Lw, (o.maxH || 220) / (h + 4 * r)), L = Lw * sc, H = h * sc, R = r * sc, x0 = 20, y0 = 10 + 2 * R;
    var cxc = x0 + Math.min(L / 2, Math.max(R, L * 0.3));
    var s = '<svg class="viz" viewBox="0 0 ' + Math.round(L + x0 + 80) + ' ' + Math.round(y0 + H + 2 * R + 34) + '" role="img" aria-label="Netz eines Zylinders" style="max-width:' + (o.max || 380) + 'px">';
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + L.toFixed(1) + '" height="' + H.toFixed(1) + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.2"/>';
    s += '<circle cx="' + cxc.toFixed(1) + '" cy="' + (y0 - R).toFixed(1) + '" r="' + R.toFixed(1) + '" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.2"/><circle cx="' + cxc.toFixed(1) + '" cy="' + (y0 + H + R).toFixed(1) + '" r="' + R.toFixed(1) + '" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.2"/>';
    function lab(x, y, t, anc, col) { return '<text x="' + x + '" y="' + y + '" font-size="15" font-weight="700" text-anchor="' + (anc || 'middle') + '" fill="' + (col || '#1c1830') + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + t + '</text>'; }
    if (o.rText) s += '<line x1="' + cxc.toFixed(1) + '" y1="' + (y0 + H + R).toFixed(1) + '" x2="' + (cxc + R).toFixed(1) + '" y2="' + (y0 + H + R).toFixed(1) + '" stroke="' + AC + '" stroke-width="2"/>' + lab(cxc + R + 6, y0 + H + R + 5, o.rText, 'start');
    s += lab(x0 + L + 8, y0 + H / 2 + 5, o.hText || 'h', 'start');
    s += lab(x0 + L * 0.7, y0 + H / 2 + 5, o.lText || 'u = 2 · π · r', 'middle', HL);
    return s + '</svg>';
  }

  var gen = {
    netz: function (lvl) {
      var r = lvl <= 1 ? M.rnd(2, 8) : M.rnd(15, 60) / 10, h = M.rnd(5, 20), L = r1(2 * PI * r);
      return { skill: 'Netz des Zylinders', level: lvl, q: 'Ein Zylinder hat den Radius r = ' + u(r) + ' und die Höhe h = ' + u(h) + '. Im Netz ist der Mantel ein Rechteck. Wie lang und wie breit ist dieses Rechteck? Runde auf eine Nachkommastelle.' + netPic(r, h, { rText: 'r = ' + u(r), hText: 'h = ' + u(h), lText: 'Länge = ?' }),
        inputs: [{ kind: 'num', answer: L, tol: 0.05, label: 'Länge ≈', unit: 'cm' }, { kind: 'num', answer: h, tol: 0.05, label: 'Breite =', unit: 'cm' }],
        hints: ['Der Mantel wird um die Kreise gewickelt. Seine Länge muss genau einmal um den Kreis reichen.', 'Die Länge ist also der Kreisumfang: u = 2 · π · ' + f(r) + ' cm. Die Breite ist die Höhe des Zylinders.', '2 · π · ' + f(r) + ' = ' + ex(2 * PI * r) + ' …'],
        solution: 'Länge = Umfang der Grundfläche: u = 2 · π · ' + u(r) + ' ≈ ' + f1(L) + ' cm. Breite = Höhe h = ' + u(h) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, r1(2 * r), 0.06)) return 'Das ist der Durchmesser. Der Mantel muss einmal ganz um den Kreis herum reichen: Länge = Umfang.'; if (near(x, r1(PI * r * r), 0.1)) return 'Das ist die Kreisfläche. Die Länge des Rechtecks ist der Kreisumfang 2 · π · r.'; if (near(x, r1(PI * r), 0.06)) return 'Der Umfang ist 2 · π · r. Du hast die 2 vergessen.'; return null; },
        verify: chk(L, 2 * PI_A * r, 0.05) };
    },
    mantel: function (lvl) {
      var r = lvl <= 1 ? M.rnd(2, 10) : M.pick([M.rnd(3, 15), M.rnd(15, 75) / 10]), h = M.rnd(4, 25), Mm = r1(2 * PI * r * h);
      return { skill: 'Mantelfläche', q: 'Berechne die Mantelfläche des Zylinders. Runde auf eine Nachkommastelle.' + cylPic(r, h, { rText: 'r = ' + u(r), hText: 'h = ' + u(h) }),
        inputs: [{ kind: 'num', answer: Mm, tol: 0.05, label: 'M ≈', unit: 'cm²' }],
        hints: ['Der Mantel ist abgewickelt ein Rechteck: Länge = Umfang 2 · π · r, Breite = h.', 'u = 2 · π · ' + f(r) + ' ≈ ' + ex(2 * PI * r) + ' cm.', 'M = u · h = 2 · π · ' + f(r) + ' · ' + h + ' ≈ ' + ex(2 * PI * r * h) + ' cm².'],
        solution: 'M = 2 · π · r · h = 2 · π · ' + u(r) + ' · ' + u(h) + ' ≈ ' + f1(Mm) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * r * h), 0.1)) return 'Die Länge des Rechtecks ist der ganze Umfang 2 · π · r. Du hast die 2 vergessen.';
          if (near(x, r1(PI * r * r * h), 0.2)) return 'Das ist das Volumen. Für den Mantel rechnest du Umfang mal Höhe.';
          if (near(x, r1(4 * PI * r * h), 0.2)) return 'Du hast mit dem Durchmesser statt dem Radius gerechnet: M = 2 · π · r · h = π · d · h.'; return null; },
        verify: chk(Mm, man(r, h), 0.05) };
    },
    oberflaeche: function (lvl) {
      var useD = lvl >= 2 && Math.random() < 0.5, r = useD ? M.rnd(2, 12) : M.rnd(2, 12), h = M.rnd(3, 25), G = PI * r * r, Mm = 2 * PI * r * h, O = r1(2 * G + Mm);
      return { skill: 'Oberfläche des Zylinders', q: 'Berechne die Oberfläche des Zylinders' + (useD ? ' mit dem Durchmesser d = ' + u(2 * r) : '') + '. Runde auf eine Nachkommastelle.' + cylPic(r, h, useD ? { dText: 'd = ' + u(2 * r), hText: 'h = ' + u(h) } : { rText: 'r = ' + u(r), hText: 'h = ' + u(h) }),
        inputs: [{ kind: 'num', answer: O, tol: 0.05, label: 'O ≈', unit: 'cm²' }],
        hints: [(useD ? 'Halbiere zuerst: r = ' + 2 * r + ' : 2 = ' + r + ' cm. ' : '') + 'Die Oberfläche besteht aus zwei Kreisen (Grund- und Deckfläche) und dem Mantel: O = 2 · π · r² + 2 · π · r · h.', 'Zwei Kreise: 2 · π · ' + r + '² ≈ ' + ex(2 * G) + ' cm². Mantel: 2 · π · ' + r + ' · ' + h + ' ≈ ' + ex(Mm) + ' cm².', 'Addiere beide Teile und runde erst am Ende.'],
        solution: (useD ? 'r = ' + r + ' cm. ' : '') + 'O = 2 · π · r² + 2 · π · r · h = 2 · π · ' + r * r + ' cm² + 2 · π · ' + r + ' · ' + h + ' cm² ≈ ' + ex(2 * G) + ' cm² + ' + ex(Mm) + ' cm² ≈ ' + f1(O) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(G + Mm), 0.1)) return 'Ein Zylinder hat zwei Kreisflächen: unten und oben. Nimm π · r² doppelt.';
          if (near(x, r1(Mm), 0.1)) return 'Das ist nur der Mantel. Addiere noch die beiden Kreise.';
          if (near(x, r1(8 * G + 4 * PI * r * h), 0.3) || near(x, r1(8 * G + Mm), 0.3)) return 'Achtung: In die Formel gehört der Radius, nicht der Durchmesser.';
          if (near(x, r1(PI * r * r * h), 0.2)) return 'Das ist das Volumen. Die Oberfläche ist die Summe aller Flächen.'; return null; },
        verify: chk(O, 2 * intA(r) + man(r, h), 0.05) };
    },
    volumen: function (lvl) {
      var r = lvl <= 1 ? M.rnd(2, 10) : M.pick([M.rnd(3, 15), M.rnd(15, 75) / 10]), h = M.rnd(3, 25), V = r1(PI * r * r * h);
      return { skill: 'Volumen des Zylinders', q: 'Berechne das Volumen des Zylinders. Runde auf eine Nachkommastelle.' + cylPic(r, h, { rText: 'r = ' + u(r), hText: 'h = ' + u(h) }),
        inputs: [{ kind: 'num', answer: V, tol: 0.05, label: 'V ≈', unit: 'cm³' }],
        hints: ['Wie beim Prisma gilt V = G · h. Die Grundfläche ist ein Kreis: G = π · r².', 'G = π · ' + f(r) + '² ≈ ' + ex(PI * r * r) + ' cm².', 'V = G · h = π · ' + f(r) + '² · ' + h + ' ≈ ' + ex(PI * r * r * h) + ' cm³.'],
        solution: 'V = π · r² · h = π · (' + u(r) + ')² · ' + u(h) + ' = π · ' + f(r * r) + ' cm² · ' + h + ' cm ≈ ' + f1(V) + ' cm³',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(2 * PI * r * h), 0.1)) return 'Das ist die Mantelfläche. Für das Volumen rechnest du Grundfläche mal Höhe: π · r² · h.';
          if (near(x, r1(4 * PI * r * r * h), 0.5)) return 'Du hast den Durchmesser statt des Radius quadriert. Das Ergebnis ist viermal zu groß.';
          if (near(x, r1(PI * r * h), 0.1)) return 'Der Radius muss quadriert werden: π · r · r · h.'; return null; },
        verify: chk(V, vol(r, h), 0.05) };
    },
    volumenD: function (lvl) {
      var c = M.pick([['Eine Konservendose', [7, 8, 10], [10, 11, 12]], ['Ein Messbecher', [8, 10, 12], [12, 15, 16]], ['Eine Thermoskanne (innen)', [7, 8], [24, 26, 28]], ['Ein Kochtopf', [16, 20, 24], [10, 12, 14]]]);
      var d = M.pick(c[1]), h = M.pick(c[2]), r = d / 2, V = r1(PI * r * r * h), Lit = r2(PI * r * r * h / 1000);
      return { skill: 'Volumen in Litern', q: c[0] + ' ist innen ' + h + ' cm hoch und hat einen Durchmesser von ' + d + ' cm. Wie viel passt hinein? Gib das Volumen in cm³ (eine Nachkommastelle) und in Litern (zwei Nachkommastellen) an.' + cylPic(r, h, { dText: 'd = ' + u(d), hText: 'h = ' + u(h) }),
        inputs: [{ kind: 'num', answer: V, tol: 0.05, label: 'V ≈', unit: 'cm³' }, { kind: 'num', answer: Lit, tol: 0.005, label: 'V ≈', unit: 'l' }],
        hints: ['Halbiere den Durchmesser: r = ' + d + ' : 2 = ' + f(r) + ' cm.', 'V = π · ' + f(r) + '² · ' + h + ' ≈ ' + ex(PI * r * r * h) + ' cm³.', '1 l = 1 dm³ = 1 000 cm³. Teile also durch 1 000.'],
        solution: 'r = ' + f(r) + ' cm. V = π · (' + f(r) + ' cm)² · ' + h + ' cm ≈ ' + f1(V) + ' cm³ ≈ ' + f(Lit, 2) + ' l',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (near(x, r1(PI * d * d * h), 1)) return 'Du hast den Durchmesser eingesetzt. Halbiere ihn zuerst: r = ' + f(r) + ' cm.'; if (near(y, r1(PI * r * r * h / 100), 0.06) || near(y, r1(PI * r * r * h / 10), 0.6)) return 'Bei den Litern: 1 l = 1 000 cm³. Teile durch 1 000.'; return null; },
        verify: function () { var w = vol(r, h); return (Math.abs(w - V) <= 0.05 + 1e-7 && Math.abs(w / 1000 - Lit) <= 0.005 + 1e-9) || 'Volumen falsch'; } };
    },
    hoehe: function (lvl) {
      var ml = M.pick([250, 330, 500, 750, 1000, 1500]), r = M.pick([3, 3.5, 4, 4.5, 5]), useD = lvl >= 3, h = r1(ml / (PI * r * r)), mlT = f(ml / 1000) + ' l';
      return { skill: 'Höhe aus dem Volumen', q: 'Ein zylinderförmiges Gefäß soll ' + mlT + ' fassen. Es hat innen einen ' + (useD ? 'Durchmesser von ' + u(2 * r) : 'Radius von ' + u(r)) + '. Wie hoch muss es innen mindestens sein? Runde auf eine Nachkommastelle.' + cylPic(r, h, useD ? { dText: 'd = ' + u(2 * r), hText: 'h = ?' } : { rText: 'r = ' + u(r), hText: 'h = ?' }),
        inputs: [{ kind: 'num', answer: h, tol: 0.05, label: 'h ≈', unit: 'cm' }],
        hints: ['Rechne zuerst um: ' + mlT + ' = ' + f(ml) + ' cm³ (1 l = 1 000 cm³).' + (useD ? ' Und r = ' + 2 * r + ' : 2 = ' + f(r) + ' cm.' : ''), 'Grundfläche: G = π · ' + f(r) + '² ≈ ' + ex(PI * r * r) + ' cm².', 'V = G · h, also h = V : G = ' + f(ml) + ' : ' + ex(PI * r * r) + '.'],
        solution: mlT + ' = ' + f(ml) + ' cm³. G = π · (' + u(r) + ')² ≈ ' + ex(PI * r * r) + ' cm². h = V : G = ' + f(ml) + ' cm³ : (π · ' + f(r * r) + ' cm²) ≈ ' + f1(h) + ' cm. Probe: π · ' + f(r) + '² · ' + f1(h) + ' ≈ ' + f(Math.round(PI * r * r * h)) + ' cm³.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(ml / 1000 / (PI * r * r)), 0.05) || x < 0.5) return 'Rechne die Liter zuerst in cm³ um: 1 l = 1 000 cm³.';
          if (near(x, r1(ml / (PI * 4 * r * r)), 0.06)) return 'In G = π · r² gehört der Radius, nicht der Durchmesser.';
          if (near(x, r1(ml / (2 * PI * r)), 0.1)) return 'Teile durch die Grundfläche π · r², nicht durch den Umfang.'; return null; },
        verify: function () { return Math.abs(vol(r, h) - ml) <= intA(r) * 0.05 + 1e-6 || 'Rückrechnung passt nicht'; } };
    },
    regentonne: function () {
      var d = M.pick([50, 60, 70, 80]), H = M.pick([80, 90, 100, 120]), r = d / 2, G = PI * r * r, Lt = Math.round(G * H / 1000), W = M.pick([50, 80, 100, 120, 150]);
      while (W * 1000 / G > H - 5) W -= 10;
      var hw = r1(W * 1000 / G);
      return { skill: 'Sachaufgabe Regentonne', q: 'Eine zylinderförmige Regentonne ist innen ' + H + ' cm hoch und hat einen Durchmesser von ' + d + ' cm.<br>a) Wie viele Liter fasst sie? Runde auf ganze Liter.<br>b) Nach einem Regenschauer sind ' + W + ' l Wasser in der Tonne. Wie hoch steht das Wasser? Runde auf eine Nachkommastelle.' + cylPic(r, H, { dText: 'd = ' + u(d), hText: 'h = ' + u(H), water: hw, label: 'Regentonne mit Wasser' }),
        inputs: [{ kind: 'num', answer: Lt, tol: 0.5, label: 'a) V ≈', unit: 'l' }, { kind: 'num', answer: hw, tol: 0.05, label: 'b) Wasserhöhe ≈', unit: 'cm' }],
        hints: ['r = ' + d + ' : 2 = ' + r + ' cm. Grundfläche G = π · ' + r + '² ≈ ' + ex(G) + ' cm².', 'a) V = G · ' + H + ' cm ≈ ' + ex(G * H) + ' cm³. Teile durch 1 000 für Liter.', 'b) ' + W + ' l = ' + f(W * 1000) + ' cm³. Wasserhöhe = Volumen : Grundfläche.'],
        solution: 'G = π · (' + r + ' cm)² ≈ ' + ex(G) + ' cm². a) V = G · ' + H + ' cm ≈ ' + f(Math.round(G * H)) + ' cm³ ≈ ' + Lt + ' l. b) ' + W + ' l = ' + f(W * 1000) + ' cm³. Höhe = ' + f(W * 1000) + ' cm³ : ' + ex(G) + ' cm² ≈ ' + f1(hw) + ' cm.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (near(x, Math.round(PI * d * d * H / 1000), 1)) return 'Bei a) hast du den Durchmesser eingesetzt. Nimm den Radius ' + r + ' cm.'; if (near(x, Math.round(G * H), 2)) return 'Das Ergebnis von a) ist in cm³. Rechne in Liter um: 1 000 cm³ = 1 l.'; return null; },
        verify: function () { return (Math.abs(vol(r, H) / 1000 - Lt) <= 0.5 && Math.abs(W * 1000 / intA(r) - hw) <= 0.05 + 1e-6) || 'Regentonne falsch'; } };
    },
    etikett: function () {
      var d = M.pick([6, 6.6, 7, 7.4, 8, 10]), h = M.pick([8, 9, 10, 11, 12]), k = M.pick([1, 1.5, 2]), L = r1(PI * d + k), A = r1((PI * d + k) * h);
      return { skill: 'Sachaufgabe Etikett', q: 'Eine Konservendose hat einen Durchmesser von ' + u(d) + '. Das Papieretikett ist ' + h + ' cm hoch und reicht einmal ganz herum. Zum Kleben überlappt es zusätzlich um ' + u(k) + '.<br>a) Wie lang ist das Etikett?<br>b) Wie viel cm² Papier braucht man für ein Etikett? Runde jeweils auf eine Nachkommastelle.' + cylPic(d / 2, h, { dText: 'd = ' + u(d), hText: h + ' cm', fill: OR, label: 'Dose mit Etikett' }),
        inputs: [{ kind: 'num', answer: L, tol: 0.05, label: 'a) Länge ≈', unit: 'cm' }, { kind: 'num', answer: A, tol: 0.05, label: 'b) Fläche ≈', unit: 'cm²' }],
        hints: ['Das Etikett ist abgewickelt ein Rechteck. Seine Länge ist der Umfang plus Klebefalz.', 'Umfang: π · ' + f(d) + ' ≈ ' + ex(PI * d) + ' cm. Plus ' + f(k) + ' cm.', 'Fläche = Länge · ' + h + ' cm. Rechne mit dem ungerundeten Wert.'],
        solution: 'a) Länge = π · ' + u(d) + ' + ' + u(k) + ' ≈ ' + ex(PI * d) + ' cm + ' + f(k) + ' cm ≈ ' + f1(L) + ' cm. b) A = (π · ' + f(d) + ' + ' + f(k) + ') cm · ' + h + ' cm ≈ ' + f1(A) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, r1(PI * d), 0.06)) return 'Vergiss den Klebefalz von ' + u(k) + ' nicht.'; if (near(x, r1(2 * PI * d + k), 0.1)) return 'Mit dem Durchmesser gilt u = π · d (ohne 2).'; return null; },
        verify: function () { return (Math.abs(PI_A * d + k - L) <= 0.05 + 1e-7 && Math.abs((PI_A * d + k) * h - A) <= 0.05 + 1e-7) || 'Etikett falsch'; } };
    },
    rohr: function () {
      var da = M.pick([20, 30, 40, 50]), s = M.pick([2, 3, 4, 5]), l = M.pick([100, 150, 200]), ra = da / 2, ri = ra - s, Vc = PI * (ra * ra - ri * ri) * l, Vd = r1(Vc / 1000), m = Math.round(Vc / 1000 * 2.4);
      return { skill: 'Hohlzylinder (Rohr)', level: 3, q: 'Ein Betonrohr ist ' + u(l) + ' lang. Es hat einen Außendurchmesser von ' + u(da) + ' und eine Wandstärke von ' + u(s) + '.<br>a) Wie viel dm³ Beton stecken im Rohr? Runde auf eine Nachkommastelle.<br>b) 1 dm³ Beton wiegt 2,4 kg. Wie schwer ist das Rohr? Runde auf ganze kg.' + cylPic(ra, l, { hollow: ri / ra, rText: 'r<tspan dy="3" font-size="10">a</tspan>', riText: 'r<tspan dy="3" font-size="10">i</tspan>', hText: u(l), label: 'Rohr als Hohlzylinder', maxH: 150 }),
        inputs: [{ kind: 'num', answer: Vd, tol: 0.05, label: 'a) V ≈', unit: 'dm³' }, { kind: 'num', answer: m, tol: 0.5, label: 'b) Masse ≈', unit: 'kg' }],
        hints: ['Das Rohr ist ein großer Zylinder ohne den inneren Hohlraum. Grundfläche ist ein Kreisring.', 'r<sub>a</sub> = ' + da + ' : 2 = ' + ra + ' cm, r<sub>i</sub> = ' + ra + ' − ' + s + ' = ' + ri + ' cm. G = π · (' + ra + '² − ' + ri + '²) ≈ ' + ex(PI * (ra * ra - ri * ri)) + ' cm².', 'V = G · ' + l + ' cm ≈ ' + ex(Vc) + ' cm³ = ' + ex(Vc / 1000) + ' dm³. Masse = V in dm³ · 2,4 kg.'],
        solution: 'r<sub>a</sub> = ' + ra + ' cm, r<sub>i</sub> = ' + ri + ' cm. G = π · (' + ra * ra + ' − ' + ri * ri + ') cm² ≈ ' + ex(PI * (ra * ra - ri * ri)) + ' cm². a) V = G · ' + l + ' cm ≈ ' + f(Math.round(Vc)) + ' cm³ ≈ ' + f1(Vd) + ' dm³. b) m ≈ ' + ex(Vc / 1000) + ' · 2,4 kg ≈ ' + m + ' kg.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * ra * ra * l / 1000), 0.1)) return 'Das ist der volle Zylinder. Ziehe den Hohlraum ab: G = π · (r<sub>a</sub>² − r<sub>i</sub>²).';
          if (near(x, r1(PI * (ra * ra - (ra - 2 * s) * (ra - 2 * s)) * l / 1000), 0.1)) return 'Die Wandstärke zählt nur einmal vom Radius ab: r<sub>i</sub> = r<sub>a</sub> − ' + s + ' cm.';
          if (near(x, r1(PI * s * s * l / 1000), 0.1)) return 'Ein Kreisring ist nicht π · s². Rechne π · (r<sub>a</sub>² − r<sub>i</sub>²).';
          if (near(x, r1(Vc), 1)) return 'Das ist in cm³. Rechne in dm³ um: 1 000 cm³ = 1 dm³.'; return null; },
        verify: function () { var w = (vol(ra, l) - vol(ri, l)) / 1000; return (Math.abs(w - Vd) <= 0.05 + 1e-6 && Math.abs(w * 2.4 - m) <= 0.5 + 1e-6) || 'Rohr falsch'; } };
    },
    blatt: function () {
      var p = M.pick([[21, 29.7, 'ein DIN-A4-Blatt'], [20, 30, 'ein Blatt Tonpapier'], [16, 24, 'eine Postkarte'], [15, 25, 'ein Stück Pappe']]), a = p[0], b = p[1];
      var V1 = r1(b * b * a / (4 * PI)), V2 = r1(a * a * b / (4 * PI));
      var opts = ['Rolle A (kurz und dick) hat mehr Volumen.', 'Rolle B (hoch und schlank) hat mehr Volumen.', 'Beide Rollen haben gleich viel Volumen, weil das Blatt gleich groß ist.'];
      return { skill: 'Zylinder aus einem Blatt (Transfer)', level: 3, q: 'Lea rollt ' + p[2] + ' (' + f(a) + ' cm × ' + f(b) + ' cm) zu einer Röhre ohne Boden und Deckel. Die Ränder stoßen genau aneinander.<br>Rolle A: Die lange Seite (' + f(b) + ' cm) wird zum Umfang, die Höhe ist ' + f(a) + ' cm.<br>Rolle B: Die kurze Seite (' + f(a) + ' cm) wird zum Umfang, die Höhe ist ' + f(b) + ' cm.<br>a) Berechne beide Volumen (mit Boden gedacht). Runde auf eine Nachkommastelle.<br>b) Was fällt dir auf?',
        inputs: [{ kind: 'num', answer: V1, tol: 0.05, label: 'a) Rolle A: V ≈', unit: 'cm³' }, { kind: 'num', answer: V2, tol: 0.05, label: 'a) Rolle B: V ≈', unit: 'cm³' }, { kind: 'mc', label: 'b) Vergleich', options: opts, answer: 0 }],
        hints: ['Aus dem Umfang erhältst du den Radius: r = u : (2 · π).', 'Rolle A: r = ' + f(b) + ' : (2π) ≈ ' + ex(b / (2 * PI)) + ' cm, h = ' + f(a) + ' cm. Rolle B: r = ' + f(a) + ' : (2π) ≈ ' + ex(a / (2 * PI)) + ' cm, h = ' + f(b) + ' cm.', 'V = π · r² · h. Rechne mit den ungerundeten Radien weiter.'],
        solution: 'Rolle A: r = ' + f(b) + ' cm : (2π) ≈ ' + ex(b / (2 * PI)) + ' cm, V = π · r² · ' + f(a) + ' cm ≈ ' + f1(V1) + ' cm³. Rolle B: r = ' + f(a) + ' cm : (2π) ≈ ' + ex(a / (2 * PI)) + ' cm, V = π · r² · ' + f(b) + ' cm ≈ ' + f1(V2) + ' cm³. b) Der Mantel ist bei beiden gleich groß, aber Rolle A hat mehr Volumen. Der Radius geht quadratisch ein, die Höhe nur einfach. Deshalb lohnt sich ein größerer Umfang mehr als eine größere Höhe.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (near(x, V2, 0.1) && near(y, V1, 0.1)) return 'Du hast die beiden Rollen vertauscht. Bei Rolle A ist die lange Seite der Umfang.'; if (near(x, r1(PI * b * b * a), 5)) return 'Die Blattseite ist der Umfang, nicht der Radius. Berechne r = u : (2 · π).'; return null; },
        verify: function () { var rA = b / (2 * PI_A), rB = a / (2 * PI_A); return (Math.abs(vol(rA, a) - V1) <= 0.05 + 1e-6 && Math.abs(vol(rB, b) - V2) <= 0.05 + 1e-6 && V1 > V2) || 'Blatt falsch'; } };
    }
  };

  return {
    id: '027', title: 'Zylinder: Oberfläche und Volumen', bereich: 'Kreis und Zylinder', minutes: '45 bis 60',
    vorkenntnisse: 'Kreisumfang und Kreisfläche (Module 024 und 025), Prismen: V = G · h, Volumeneinheiten und Liter',
    lead: 'Wie viel Blech braucht eine Dose, wie viele Liter fasst eine Regentonne? Du berechnest Mantel, Oberfläche und Volumen von Zylindern und löst Sachaufgaben aus dem Alltag.',
    einstieg: { html: '<p>Familie Albers stellt eine Regentonne an die Garage. Die Tonne ist innen 90 cm hoch und hat einen Durchmesser von 60 cm. Im Baumarkt steht: „Fassungsvermögen 250 Liter“.</p><p class="note">Stimmt das? Und wie viel Kunststoff steckt in der Tonne, wenn sie einen Boden, aber keinen Deckel hat?</p><p>Eine Regentonne, eine Konservendose und ein Rohr haben dieselbe Form: Sie sind <b>Zylinder</b>. In diesem Modul lernst du, wie du ihre Oberfläche und ihr Volumen berechnest.</p>' },
    ziele: ['Ich beschreibe das Netz eines Zylinders: ein Rechteck und zwei Kreise.', 'Ich berechne die Mantelfläche M = 2 · π · r · h.', 'Ich berechne die Oberfläche O = 2 · π · r² + 2 · π · r · h.', 'Ich berechne das Volumen V = π · r² · h und rechne in Liter um.', 'Ich löse Umkehraufgaben und Sachaufgaben, auch mit Hohlzylindern.'],
    fachwoerter: [['Zylinder', 'Körper mit zwei gleich großen, parallelen Kreisen als Grund- und Deckfläche und einer gewölbten Mantelfläche.'], ['Mantelfläche M', 'Die gewölbte Seitenfläche. Abgewickelt ist sie ein Rechteck.'], ['Oberfläche O', 'Summe aller Flächen: zwei Kreise und der Mantel.'], ['Hohlzylinder', 'Ein Zylinder mit einem zylinderförmigen Loch, zum Beispiel ein Rohr.']],
    diagnose: [
      { q: 'Ein Prisma hat die Grundfläche 12 cm² und die Höhe 5 cm. Wie groß ist sein Volumen?', options: ['17 cm³', '60 cm³', '120 cm³', 'Weiß ich noch nicht'], answer: 1, why: 'V = G · h = 12 cm² · 5 cm = 60 cm³.', review: 'Volumen von Prismen (Klasse 8)' },
      { q: 'Ein Kreis hat den Radius 4 cm. Wie groß ist seine Fläche ungefähr?', options: ['25,1 cm²', '50,3 cm²', '12,6 cm²', 'Weiß ich noch nicht'], answer: 1, why: 'A = π · 4² cm² = π · 16 cm² ≈ 50,3 cm².', review: 'Kreisfläche (Modul 025)' },
      { q: 'Ein Kreis hat den Radius 4 cm. Wie lang ist sein Umfang ungefähr?', options: ['25,1 cm', '50,3 cm', '12,6 cm', 'Weiß ich noch nicht'], answer: 0, why: 'u = 2 · π · 4 cm ≈ 25,1 cm.', review: 'Kreisumfang (Modul 024)' },
      { q: 'Wie viele Liter sind 3 500 cm³?', options: ['35 l', '0,35 l', '3,5 l', 'Weiß ich noch nicht'], answer: 2, why: '1 000 cm³ = 1 dm³ = 1 l, also 3 500 cm³ = 3,5 l.', review: 'Volumeneinheiten und Liter' }],
    erklaerung:
      '<h3>1. Das Netz des Zylinders</h3><p>Schneidest du eine Konservendose auf, erhältst du zwei Kreise (Boden und Deckel) und ein Rechteck (den Mantel). Das Rechteck wurde einmal um den Kreis gewickelt. Seine Länge ist deshalb der <b>Kreisumfang u = 2 · π · r</b>, seine Breite ist die <b>Höhe h</b>.</p>' +
      '<div class="grid2">' + cylPic(3, 6, { rText: 'r', hText: 'h', max: 220 }) + netPic(3, 6, { rText: 'r', hText: 'h', max: 300 }) + '</div>' +
      '<div class="merk"><b>Merke:</b> Für einen Zylinder mit Radius r und Höhe h gilt<br><span class="big-math">M = 2 · π · r · h</span><br><span class="big-math">O = 2 · π · r² + 2 · π · r · h</span><br><span class="big-math">V = π · r² · h</span></div>' +
      '<h3>2. Volumen wie beim Prisma</h3><p>Wie beim Prisma ist das Volumen <b>Grundfläche mal Höhe</b>. Die Grundfläche ist ein Kreis mit G = π · r². Also V = G · h = π · r² · h.</p>' +
      '<p>Beispiel: r = 3 cm, h = 10 cm. V = π · 9 cm² · 10 cm ≈ 282,7 cm³ ≈ 0,28 l (1 l = 1 dm³ = 1 000 cm³).</p>' +
      '<h3>3. Umkehraufgaben</h3><p>Kennst du V und r, dann gilt <b>h = V : (π · r²)</b>. Achte darauf, Liter vorher in cm³ umzurechnen.</p>' +
      '<h3>4. Hohlzylinder</h3><p>Bei einem Rohr ist die Grundfläche ein Kreisring: V = π · (r<sub>a</sub>² − r<sub>i</sub>²) · h.</p>' +
      '<p class="note"><b>Typische Fehler:</b> Bei der Oberfläche einen Kreis vergessen (es sind zwei). Den Durchmesser statt des Radius einsetzen. Beim Umrechnen in Liter durch 100 statt durch 1 000 teilen. <b>Überschlag</b> mit π ≈ 3: Bei r = 3 cm und h = 10 cm ist V ≈ 3 · 9 · 10 = 270 cm³.</p>',
    entdecken: {
      html: '<p>Verändere Radius und Höhe. Links siehst du den Zylinder, rechts sein Netz.</p><div class="ctl"><label>Radius r = <b id="v_r"></b> <input type="range" id="r_r" min="1" max="6" step="0.5" value="3"></label><label>Höhe h = <b id="v_h"></b> <input type="range" id="r_h" min="1" max="12" step="1" value="5"></label></div>' +
        '<div class="grid2"><div id="e_c"></div><div id="e_n"></div></div><div id="e_t"></div><p class="note">Was passiert mit dem Volumen, wenn du die Höhe verdoppelst? Und wenn du den Radius verdoppelst?</p>',
      init: function (root, done) {
        var n = 0, R = root.querySelector('#r_r'), Hh = root.querySelector('#r_h');
        function draw() {
          var r = +R.value, h = +Hh.value, G = PI * r * r, Mm = 2 * PI * r * h;
          root.querySelector('#v_r').textContent = f(r) + ' cm'; root.querySelector('#v_h').textContent = h + ' cm';
          root.querySelector('#e_c').innerHTML = cylPic(r, h, { rText: 'r', hText: 'h', maxW: 28 * r, maxH: 14 * h, max: 280 }).replace(/viewBox="0 0 [0-9.]+ [0-9.]+"/, 'viewBox="0 0 280 270"');
          root.querySelector('#e_n').innerHTML = netPic(r, h, { rText: 'r', hText: 'h', max: 300 });
          root.querySelector('#e_t').innerHTML = '<p>Mantel (Rechteck): ' + f(r2(2 * PI * r)) + ' cm · ' + h + ' cm ≈ ' + f(r2(Mm)) + ' cm². Zwei Kreise: 2 · π · ' + f(r) + '² ≈ ' + f(r2(2 * G)) + ' cm².</p><p class="big-math">O ≈ ' + f(r2(2 * G + Mm)) + ' cm² &nbsp; V = π · ' + f(r) + '² · ' + h + ' ≈ ' + f(r2(G * h)) + ' cm³ ≈ ' + f(Math.round(G * h) / 1000, 3) + ' l</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Gut beobachtet: Doppelte Höhe ergibt doppeltes Volumen. Doppelter Radius ergibt sogar das Vierfache, denn der Radius steht im Quadrat.'); }
        R.addEventListener('input', hit); Hh.addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Die Regentonne', q: 'Die Regentonne der Familie Albers ist innen 90 cm hoch und hat einen Durchmesser von 60 cm. Stimmt die Angabe „250 Liter“? Wie viel Kunststoff braucht man für Boden und Mantel (ohne Deckel)?' + cylPic(30, 90, { dText: 'd = 60 cm', hText: 'h = 90 cm', max: 220 }),
      steps: ['Radius bestimmen: r = 60 cm : 2 = 30 cm.', 'Volumen: V = π · (30 cm)² · 90 cm = π · 81 000 cm³ ≈ 254 469 cm³ ≈ 254 l. Die Angabe „250 Liter“ stimmt also ungefähr.', 'Boden: π · (30 cm)² ≈ 2 827 cm². Mantel: 2 · π · 30 cm · 90 cm ≈ 16 965 cm².', 'Kunststoff: 2 827 cm² + 16 965 cm² ≈ 19 792 cm² ≈ 1,98 m² (ohne Deckel nur ein Kreis).', 'Kontrolle mit Überschlag (π ≈ 3): V ≈ 3 · 900 · 90 = 243 000 cm³ ≈ 243 l. Das passt.'] },
    tasks: { gen: gen, plan: { G: ['netz:1', 'mantel:1', 'volumen:1', 'volumenD:1'], S: ['netz:1', 'mantel:2', 'oberflaeche:2', 'volumen:2', 'regentonne:2'], E: ['oberflaeche:2', 'volumenD:2', 'hoehe:3', 'etikett:2', 'rohr:3', 'regentonne:2'] },
      extra: 'blatt', test: ['mantel:2', 'oberflaeche:2', 'volumen:2', 'volumenD:2', 'hoehe:2', 'regentonne:2'] },
    lerncheck: ['Ich kann das Netz eines Zylinders beschreiben und zeichnen.', 'Ich berechne Mantel und Oberfläche eines Zylinders.', 'Ich berechne das Volumen und rechne in Liter um.', 'Ich löse Umkehr- und Sachaufgaben mit Zylindern.']
  };
})();
