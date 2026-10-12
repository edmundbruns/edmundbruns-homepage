/* Modul 024 (Klasse 9) · Kreisumfang und die Zahl π */
var MODULE = (function () {
  var f = M.fmtNum, PI = Math.PI;
  var LN = '#1e3a8a', FL = '#e8eefc', AC = '#d97706', HL = '#1d4ed8', C2 = '#0f766e';
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function near(x, y, t) { return x !== null && Math.abs(x - y) <= (t || 0.06); }
  /* π unabhängig von Math.PI: Archimedes, Umfang regelmäßiger Vielecke (6, 12, 24, … Ecken) im Einheitskreis */
  var PI_A = (function () { var s = 1, n = 6; for (var k = 0; k < 14; k++) { s = s / Math.sqrt(2 + Math.sqrt(4 - s * s)); n *= 2; } return n * s / 2; })();
  function chk(ans, val, tol, txt) { return function () { return Math.abs(ans - val) <= tol + 1e-9 || (txt || 'Nachrechnung') + ': ' + val + ' statt ' + ans; }; }
  function cm(x, e) { return f(x) + ' ' + (e || 'cm'); }
  function f1(x) { return f(x, 1); }
  function cm1(x, e) { return f1(x) + ' ' + (e || 'cm'); }

  /* Kreis mit Radius oder Durchmesser beschriften */
  function circPic(type, text, o) {
    o = o || {}; var cx = 110, cy = 100, R = 72, s = '<svg class="viz" viewBox="0 0 220 200" role="img" aria-label="Kreis mit ' + (type === 'r' ? 'Radius' : 'Durchmesser') + '" style="max-width:240px">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
    if (type === 'r') s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" stroke="' + AC + '" stroke-width="2.5"/>';
    else s += '<line x1="' + (cx - R) + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" stroke="' + AC + '" stroke-width="2.5"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + LN + '"/><text x="' + (cx - 4) + '" y="' + (cy + 18) + '" font-size="13" fill="' + LN + '" text-anchor="end">M</text>';
    s += '<text x="' + (type === 'r' ? cx + R / 2 - 4 : cx) + '" y="' + (cy - 9) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + text + '</text>';
    if (o.u) s += '<text x="' + cx + '" y="' + (cy - R - 8) + '" font-size="13" font-weight="700" text-anchor="middle" fill="' + HL + '">' + o.u + '</text>';
    return s + '</svg>';
  }
  /* Strecken im Kreis: Radius, Durchmesser, Sehne */
  function partsPic(lab) {
    var cx = 130, cy = 115, R = 88;
    function P(a) { a = a * PI / 180; return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; }
    var d1 = P(165), d2 = P(345), rr = P(65), c1 = P(222), c2 = P(300);
    function ln(a, b, col) { return '<line x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>'; }
    function tx(p, t) { return '<text x="' + p[0].toFixed(1) + '" y="' + p[1].toFixed(1) + '" font-size="16" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + t + '</text>'; }
    var s = '<svg class="viz" viewBox="0 0 260 230" role="img" aria-label="Kreis mit drei Strecken" style="max-width:280px"><circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
    var one = lab.s.length === 1; s += ln(d1, d2, one ? AC : HL) + ln([cx, cy], rr, AC) + ln(c1, c2, one ? AC : C2);
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3.5" fill="' + LN + '"/><text x="' + (cx + 4) + '" y="' + (cy + 20) + '" font-size="13" fill="' + LN + '">M</text>';
    var dl = [d1[0] + (d2[0] - d1[0]) * 0.27, d1[1] + (d2[1] - d1[1]) * 0.27 - 10];
    var rl = [cx + (rr[0] - cx) * 0.55 + 12, cy + (rr[1] - cy) * 0.55];
    var cl = [(c1[0] + c2[0]) / 2, (c1[1] + c2[1]) / 2 - 9];
    s += tx(dl, lab.d) + tx(rl, lab.r) + tx(cl, lab.s);
    return s + '</svg>';
  }
  /* Fenster: Rechteck mit Halbkreis oben, maßstabsgetreu */
  function windowPic(b, h) {
    var sc = Math.min(150 / b, 170 / (h + b / 2)), W = b * sc, Hh = h * sc, R = W / 2, x0 = 60, y0 = 20 + R;
    var s = '<svg class="viz" viewBox="0 0 270 ' + Math.round(y0 + Hh + 40) + '" role="img" aria-label="Fenster mit Halbkreis" style="max-width:280px">';
    s += '<path d="M' + x0 + ' ' + (y0 + Hh) + ' L' + x0 + ' ' + y0 + ' A' + R + ' ' + R + ' 0 0 1 ' + (x0 + W) + ' ' + y0 + ' L' + (x0 + W) + ' ' + (y0 + Hh) + ' Z" fill="' + FL + '" stroke="' + LN + '" stroke-width="3"/>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + W) + '" y2="' + y0 + '" stroke="' + LN + '" stroke-width="1" stroke-dasharray="4 4"/>';
    s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + Hh + 22) + '" font-size="13" font-weight="700" text-anchor="middle">' + cm(b) + '</text>';
    s += '<text x="' + (x0 - 8) + '" y="' + (y0 + Hh / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="end">' + cm(h) + '</text>';
    return s + '</svg>';
  }
  var OBJ = [['eine Konservendose', 7, 10], ['ein Teller', 20, 27], ['eine Untertasse', 13, 16], ['ein Fahrradreifen', 60, 70], ['ein Blumentopf', 11, 18], ['eine Uhr an der Wand', 25, 35]];

  var gen = {
    begriffe: function () {
      var L = M.shuffle(['a', 'b', 'c']), lab = { d: L[0], r: L[1], s: L[2] }, t = M.pick(['r', 'd', 's']);
      var qs = { r: 'Welche Strecke ist ein <b>Radius</b>?', d: 'Welche Strecke ist ein <b>Durchmesser</b>?', s: 'Welche Strecke ist eine <b>Sehne</b>, aber kein Durchmesser?' };
      var opts = ['Strecke a', 'Strecke b', 'Strecke c'];
      return { skill: 'Radius, Durchmesser, Sehne', level: 1, q: qs[t] + partsPic(lab), inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ['a', 'b', 'c'].indexOf(lab[t]) }],
        hints: ['Ein Radius geht vom Mittelpunkt M bis zur Kreislinie. Ein Durchmesser geht von Kreislinie zu Kreislinie <b>durch</b> M.', 'Eine Sehne verbindet zwei Punkte der Kreislinie. Der Durchmesser ist die längste Sehne.', 'Prüfe: Welche Strecke beginnt in M? Welche geht durch M? Welche berührt M gar nicht?'],
        solution: 'Strecke ' + lab.r + ' ist ein Radius (von M zur Kreislinie), Strecke ' + lab.d + ' ist ein Durchmesser (durch M) und Strecke ' + lab.s + ' ist eine Sehne, die nicht durch M geht. Gesucht war also Strecke ' + lab[t] + '.',
        verify: function () { return new Set([lab.d, lab.r, lab.s]).size === 3 || 'Beschriftung doppelt'; } };
    },
    ueberschlag: function () {
      var o = M.pick(OBJ), d = M.rnd(o[1], o[2]), u = Math.round(PI * d);
      var opts = M.shuffle([[u, true], [2 * d, false], [Math.round(PI * d / 2), false], [Math.round(2 * PI * d), false]]);
      return { skill: 'Umfang überschlagen', level: 1, q: o[0].charAt(0).toUpperCase() + o[0].slice(1) + ' hat einen Durchmesser von ' + cm(d) + '. Welcher Umfang passt? Entscheide mit einem Überschlag.', inputs: [{ kind: 'mc', label: 'Umfang', options: opts.map(function (x) { return 'etwa ' + x[0] + ' cm'; }), answer: opts.findIndex(function (x) { return x[1]; }) }],
        hints: ['Der Umfang ist gut dreimal so lang wie der Durchmesser (π ≈ 3,14).', 'Überschlag: 3 · ' + d + ' cm = ' + 3 * d + ' cm. Der Umfang ist etwas mehr.', 'Suche den Wert, der etwas größer als ' + 3 * d + ' cm ist.'],
        solution: 'u = π · d ≈ 3,14 · ' + d + ' cm ≈ ' + u + ' cm. Überschlag: 3 · ' + d + ' cm = ' + 3 * d + ' cm, also etwas mehr.',
        verify: chk(u, Math.round(PI_A * d), 0) };
    },
    piQuot: function () {
      var o = M.pick(OBJ), d = r1(M.rnd(o[1] * 10, o[2] * 10) / 10), u = r1(PI * d + (M.rnd(-2, 2)) / 10), q = r2(u / d);
      return { skill: 'π als Quotient u : d', level: 1, q: 'Leon misst ' + o[0] + '. Der Umfang ist ' + cm(u) + ', der Durchmesser ' + cm(d) + '. Berechne den Quotienten u : d. Runde auf zwei Nachkommastellen.',
        inputs: [{ kind: 'num', answer: q, tol: 0.005, label: 'u : d ≈' }],
        hints: ['Teile den Umfang durch den Durchmesser: ' + f(u) + ' : ' + f(d) + '.', 'Mit dem Taschenrechner: ' + f(u) + ' : ' + f(d) + ' = ' + f(Math.round(u / d * 10000) / 10000) + ' …', 'Runde auf zwei Nachkommastellen. Das Ergebnis liegt in der Nähe von 3,14.'],
        solution: 'u : d = ' + f(u) + ' cm : ' + f(d) + ' cm ≈ ' + f(q) + '. Das ist fast genau π ≈ 3,14. Kleine Abweichungen kommen vom Messen.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (near(x, r2(d / u), 0.006)) return 'Du hast d : u gerechnet. Gesucht ist u : d, also Umfang geteilt durch Durchmesser.'; return null; },
        verify: function () { return Math.abs(q - PI_A) < 0.1 || 'Quotient zu weit von π entfernt'; } };
    },
    umfangD: function (lvl) {
      var d = lvl <= 1 ? M.rnd(4, 30) : lvl === 2 ? M.pick([M.rnd(10, 120), M.rnd(20, 150) / 10]) : M.rnd(15, 95) / 10, e = lvl >= 3 ? 'm' : 'cm', u = r1(PI * d);
      return { skill: 'Umfang aus dem Durchmesser', q: 'Ein Kreis hat den Durchmesser d = ' + cm(d, e) + '. Berechne den Umfang. Runde auf eine Nachkommastelle.' + circPic('d', 'd = ' + cm(d, e)),
        inputs: [{ kind: 'num', answer: u, tol: 0.05, label: 'u ≈', unit: e }],
        hints: ['Formel: u = π · d. Nutze die π-Taste des Taschenrechners.', 'u = π · ' + f(d) + ' ' + e + '. Überschlag: 3 · ' + f(d) + ' = ' + f(r1(3 * d)) + ', das Ergebnis ist etwas größer.', 'π · ' + f(d) + ' = ' + f(Math.round(PI * d * 1000) / 1000) + ' … Runde jetzt auf eine Nachkommastelle.'],
        solution: 'u = π · d = π · ' + cm(d, e) + ' ≈ ' + cm1(u, e),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(2 * PI * d))) return 'Du hast mit 2 · π · d gerechnet. Die 2 gehört nur in die Formel mit dem Radius: u = 2 · π · r. Mit dem Durchmesser gilt u = π · d.';
          if (near(x, r1(PI * d / 2))) return 'Du hast den Durchmesser halbiert. Mit d rechnest du direkt u = π · d.';
          if (near(x, r1(3.14 * d), 0.051)) return 'Fast. Du hast wohl mit 3,14 gerechnet. Nutze die π-Taste, dann wird das Ergebnis genauer.';
          if (near(x, r1(PI * d * d / 4), 0.1) || near(x, r1(PI * d * d), 0.1)) return 'Das ist eine Flächenformel. Für den Umfang rechnest du u = π · d.'; return null; },
        verify: chk(u, PI_A * d, 0.05) };
    },
    umfangR: function (lvl) {
      var r = lvl <= 1 ? M.rnd(2, 15) : lvl === 2 ? M.pick([M.rnd(5, 60), M.rnd(15, 95) / 10]) : M.rnd(12, 80) / 10, e = lvl >= 3 ? 'm' : 'cm', u = r1(2 * PI * r);
      return { skill: 'Umfang aus dem Radius', q: 'Ein Kreis hat den Radius r = ' + cm(r, e) + '. Berechne den Umfang. Runde auf eine Nachkommastelle.' + circPic('r', 'r = ' + cm(r, e)),
        inputs: [{ kind: 'num', answer: u, tol: 0.05, label: 'u ≈', unit: e }],
        hints: ['Mit dem Radius gilt u = 2 · π · r. Oder: Rechne zuerst d = 2 · r aus.', 'd = 2 · ' + f(r) + ' ' + e + ' = ' + cm(2 * r, e) + '. Dann u = π · ' + f(2 * r) + '.', '2 · π · ' + f(r) + ' = ' + f(Math.round(2 * PI * r * 1000) / 1000) + ' … Runde auf eine Nachkommastelle.'],
        solution: 'u = 2 · π · r = 2 · π · ' + cm(r, e) + ' = π · ' + cm(2 * r, e) + ' ≈ ' + cm1(u, e),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * r))) return 'Du hast π · r gerechnet. Der Durchmesser ist doppelt so lang wie der Radius: u = 2 · π · r.';
          if (near(x, r1(PI * r * r), 0.1)) return 'π · r² ist die Fläche des Kreises. Für den Umfang gilt u = 2 · π · r.';
          if (near(x, r1(2 * 3.14 * r), 0.051)) return 'Fast. Du hast wohl mit 3,14 gerechnet. Nutze die π-Taste, dann wird das Ergebnis genauer.'; return null; },
        verify: chk(u, 2 * PI_A * r, 0.05) };
    },
    durchmesser: function (lvl) {
      var u = lvl <= 1 ? M.rnd(15, 80) : M.rnd(20, 250), d = r1(u / PI), r = r1(u / (2 * PI));
      return { skill: 'Durchmesser und Radius aus dem Umfang', q: 'Ein Kreis hat den Umfang u = ' + cm(u) + '. Wie groß sind Durchmesser und Radius? Runde jeweils auf eine Nachkommastelle.',
        inputs: [{ kind: 'num', answer: d, tol: 0.05, label: 'd ≈', unit: 'cm' }, { kind: 'num', answer: r, tol: 0.051, label: 'r ≈', unit: 'cm' }],
        hints: ['Stelle u = π · d nach d um: d = u : π.', 'd = ' + f(u) + ' : π = ' + f(Math.round(u / PI * 1000) / 1000) + ' … cm.', 'Der Radius ist der halbe Durchmesser: r = d : 2.'],
        solution: 'd = u : π = ' + f(u) + ' cm : π ≈ ' + cm1(d) + '. r = u : (2 · π) ≈ ' + cm1(r) + '. Probe: π · ' + f1(d) + ' ≈ ' + f1(r1(PI * d)) + ' ≈ ' + f(u) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]);
          if (near(x, r1(u * PI), 0.2)) return 'Du hast mit π multipliziert. Um vom Umfang zum Durchmesser zu kommen, rechnest du umgekehrt: d = u : π.';
          if (near(x, d) && near(y, d)) return 'Der Durchmesser stimmt. Der Radius ist aber nur halb so lang.';
          if (near(x, d) && near(y, r1(2 * d), 0.1)) return 'Der Durchmesser stimmt. Der Radius ist die <b>Hälfte</b> davon, nicht das Doppelte.';
          if (near(x, r1(u / 3.14), 0.051)) return 'Du hast wohl mit 3,14 gerechnet. Nutze die π-Taste.'; return null; },
        verify: function () { return (Math.abs(PI_A * d - u) <= PI_A * 0.05 + 1e-9 && Math.abs(2 * PI_A * r - u) <= 2 * PI_A * 0.05 + 1e-9) || 'Rückrechnung passt nicht'; } };
    },
    rad: function (lvl) {
      var d = M.pick([50, 56, 60, 66, 71]), n = lvl <= 1 ? M.pick([10, 20, 50]) : M.pick([100, 200, 250, 400, 500]), uu = PI * d, s = Math.round(n * uu / 100);
      return { skill: 'Strecke aus Radumdrehungen', q: 'Ein Fahrradrad hat einen Durchmesser von ' + d + ' cm. Wie weit fährt das Fahrrad bei ' + n + ' Umdrehungen des Rades? Gib das Ergebnis in Metern an und runde auf ganze Meter. Runde erst am Ende.',
        inputs: [{ kind: 'num', answer: s, tol: 0.5, label: 'Strecke ≈', unit: 'm' }],
        hints: ['Bei einer Umdrehung rollt das Rad genau seinen Umfang ab: u = π · d.', 'u = π · ' + d + ' cm ≈ ' + f(r1(uu)) + ' cm. Bei ' + n + ' Umdrehungen: ' + n + ' · u.', n + ' · π · ' + d + ' cm ≈ ' + f(Math.round(n * uu)) + ' cm. Teile durch 100, um Meter zu erhalten.'],
        solution: 'u = π · ' + d + ' cm ≈ ' + f(r1(uu)) + ' cm. Strecke = ' + n + ' · π · ' + d + ' cm ≈ ' + f(Math.round(n * uu)) + ' cm ≈ ' + s + ' m.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, Math.round(n * uu), 1)) return 'Das Ergebnis ist in Zentimetern. Rechne in Meter um: 100 cm = 1 m.';
          if (near(x, Math.round(n * d / 100), 0.5)) return 'Bei einer Umdrehung rollt das Rad nicht den Durchmesser, sondern den <b>Umfang</b> ab.';
          if (near(x, Math.round(2 * n * uu / 100), 0.5)) return 'Du hast mit 2 · π · d gerechnet. Mit dem Durchmesser gilt u = π · d.'; return null; },
        verify: chk(s, n * PI_A * d / 100, 0.5) };
    },
    umdrehungen: function (lvl) {
      var d, s, N, sm;
      for (var k = 0; k < 200; k++) { d = M.pick([50, 56, 60, 66, 71]); sm = M.pick(lvl >= 3 ? [1000, 2000, 5000, 1500] : [100, 200, 500, 1000]); N = sm * 100 / (PI * d); var fr = N - Math.floor(N); if (fr > 0.1 && fr < 0.4) break; }
      var ans = Math.round(N), sTxt = sm >= 1000 ? f(sm / 1000) + ' km' : sm + ' m';
      return { skill: 'Anzahl der Umdrehungen', level: 3, q: 'Ein Rad hat einen Durchmesser von ' + d + ' cm. Wie viele Umdrehungen macht es auf einer Strecke von ' + sTxt + '? Runde auf ganze Umdrehungen.',
        inputs: [{ kind: 'num', answer: ans, label: 'Umdrehungen ≈' }],
        hints: ['Eine Umdrehung entspricht dem Umfang: u = π · ' + d + ' cm ≈ ' + f(r1(PI * d)) + ' cm.', 'Rechne die Strecke in cm um: ' + sTxt + ' = ' + f(sm * 100) + ' cm.', 'Anzahl = Strecke : Umfang = ' + f(sm * 100) + ' : (π · ' + d + ').'],
        solution: 'u = π · ' + d + ' cm ≈ ' + f(r1(PI * d)) + ' cm. ' + sTxt + ' = ' + f(sm * 100) + ' cm. Anzahl = ' + f(sm * 100) + ' cm : (π · ' + d + ' cm) ≈ ' + f(Math.round(N * 100) / 100) + ', also etwa ' + ans + ' Umdrehungen.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, Math.round(sm / (PI * d)), 0.5) || near(x, Math.round(sm * 1000 / (PI * d)), 0.5)) return 'Achte auf die Einheiten. Rechne Strecke und Umfang in dieselbe Einheit um (zum Beispiel cm).';
          if (near(x, Math.round(sm * 100 / d), 0.5)) return 'Das Rad rollt pro Umdrehung den Umfang ab, nicht den Durchmesser. Teile durch π · d.'; return null; },
        verify: function () { return Math.round(sm * 100 / (PI_A * d)) === ans || 'Umdrehungen falsch'; } };
    },
    baum: function () {
      var u, d;
      for (var k = 0; k < 200; k++) { u = M.rnd(12, 48) / 10; d = 100 * u / PI; var fr = d - Math.floor(d); if (fr < 0.4 || fr > 0.6) break; }
      var ans = Math.round(d), tree = M.pick(['einer alten Eiche', 'einer Buche im Park', 'einer Linde auf dem Dorfplatz', 'eines Mammutbaums im Botanischen Garten']);
      return { skill: 'Durchmesser im Sachkontext', q: 'Die Klasse 9b misst mit einem Maßband den Umfang ' + tree + '. Er beträgt ' + f(u) + ' m. Wie dick ist der Stamm ungefähr (Durchmesser)? Gib das Ergebnis in cm an und runde auf ganze Zentimeter.',
        inputs: [{ kind: 'num', answer: ans, tol: 0.5, label: 'd ≈', unit: 'cm' }],
        hints: ['Wir nehmen an, der Stamm ist kreisrund. Dann gilt d = u : π.', 'Rechne zuerst in cm um: ' + f(u) + ' m = ' + f(u * 100) + ' cm.', 'd = ' + f(u * 100) + ' cm : π ≈ ' + f(r1(d)) + ' cm.'],
        solution: f(u) + ' m = ' + f(u * 100) + ' cm. d = u : π = ' + f(u * 100) + ' cm : π ≈ ' + ans + ' cm. Überschlag: ' + f(u * 100) + ' : 3 ≈ ' + Math.round(u * 100 / 3) + ', etwas weniger passt.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, Math.round(u / PI * 100) / 100, 0.01) || near(x, r1(u / PI), 0.05)) return 'Gefragt ist das Ergebnis in Zentimetern. 1 m = 100 cm.';
          if (near(x, Math.round(d / 2), 0.5)) return 'Das ist der Radius. Gefragt ist der Durchmesser d = u : π.';
          if (near(x, Math.round(u * 100 * PI), 1)) return 'Du hast mit π multipliziert. Vom Umfang zum Durchmesser rechnest du d = u : π.'; return null; },
        verify: chk(ans, 100 * u / PI_A, 0.5) };
    },
    fenster: function () {
      var b = M.pick([60, 70, 80, 90, 100, 120]), h = M.pick([80, 90, 100, 110, 120, 140]), bog = PI * b / 2, U = r1(b + 2 * h + bog);
      return { skill: 'Umfang mit Halbkreis', level: 3, q: 'Ein Fenster besteht aus einem Rechteck mit einem Halbkreis obendrauf. Für den äußeren Rand soll eine Dichtung eingeklebt werden. Wie lang muss die Dichtung sein? Runde auf eine Nachkommastelle.' + windowPic(b, h),
        inputs: [{ kind: 'num', answer: U, tol: 0.05, label: 'Länge ≈', unit: 'cm' }],
        hints: ['Der Rand besteht aus der unteren Seite, den beiden senkrechten Seiten und dem Halbkreisbogen. Die gestrichelte Linie gehört nicht dazu.', 'Der Halbkreis hat den Durchmesser ' + b + ' cm. Bogen = π · ' + b + ' : 2 ≈ ' + f(r1(bog)) + ' cm.', 'Länge = ' + b + ' + 2 · ' + h + ' + π · ' + b + ' : 2.'],
        solution: 'Gerade Teile: ' + b + ' cm + 2 · ' + h + ' cm = ' + (b + 2 * h) + ' cm. Halbkreisbogen: π · ' + b + ' cm : 2 ≈ ' + f1(r1(bog)) + ' cm. Zusammen: ' + (b + 2 * h) + ' cm + π · ' + b + ' cm : 2 ≈ ' + cm1(U) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(b + 2 * h + PI * b), 0.1)) return 'Oben ist nur ein <b>Halbkreis</b>. Nimm den halben Kreisumfang: π · d : 2.';
          if (near(x, r1(2 * b + 2 * h + bog), 0.1)) return 'Die gestrichelte Linie oben gehört nicht zum Rand. Zähle die Breite nur einmal.';
          if (near(x, r1(b + 2 * h + PI * b / 4), 0.1)) return 'Der Durchmesser des Halbkreises ist die ganze Breite ' + b + ' cm. Der Bogen ist π · ' + b + ' : 2.'; return null; },
        verify: chk(U, b + 2 * h + PI_A * b / 2, 0.05) };
    },
    seil: function () {
      var L = M.pick([1, 2, 3, 5, 10]), dh = r1(100 * L / (2 * PI));
      var opts = ['Nein. Bei einem Fußball wäre der Abstand genauso groß.', 'Ja. Bei der Erde ist der Abstand viel kleiner als beim Fußball.', 'Ja. Bei der Erde ist der Abstand viel größer als beim Fußball.'];
      return { skill: 'Seil um die Erde (Transfer)', level: 3, q: 'Ein Seil liegt straff um den Äquator der Erde (Umfang etwa 40 000 km). Nun wird das Seil um <b>' + L + ' m</b> verlängert und rundherum gleichmäßig angehoben, sodass es wieder ein Kreis ist.<br>a) Wie hoch über dem Boden schwebt das Seil? Gib das Ergebnis in cm an und runde auf eine Nachkommastelle.<br>b) Hängt dieser Abstand davon ab, wie groß die Kugel ist?',
        inputs: [{ kind: 'num', answer: dh, tol: 0.05, label: 'a) Abstand ≈', unit: 'cm' }, { kind: 'mc', label: 'b) Hängt der Abstand von der Größe der Kugel ab?', options: opts, answer: 0 }],
        hints: ['Neuer Umfang: u + ' + L + ' m. Neuer Radius: r + Abstand. Es gilt u = 2 · π · r.', '2 · π · (r + x) = 2 · π · r + ' + L + ' m. Ziehe auf beiden Seiten 2 · π · r ab.', '2 · π · x = ' + L + ' m, also x = ' + L + ' m : (2 · π). Rechne in cm um.'],
        solution: 'a) 2π(r + x) = 2πr + ' + L + ' m ⇒ 2πx = ' + L + ' m ⇒ x = ' + L + ' m : (2π) ≈ ' + f(Math.round(L / (2 * PI) * 10000) / 10000) + ' m ≈ ' + f1(dh) + ' cm. b) Der Radius r fällt in der Rechnung weg. Deshalb ist der Abstand bei jeder Kugel gleich, beim Fußball genauso wie bei der Erde.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(100 * L / PI), 0.1)) return 'Du hast durch π geteilt. Der Umfang ändert sich um 2 · π · x, also teilst du durch 2 · π.';
          if (near(x, Math.round(L / (2 * PI) * 100) / 100, 0.01)) return 'Das Ergebnis ist in Metern. Rechne in cm um.'; return null; },
        verify: function () { var R = 6371000, x = (2 * PI_A * R + L) / (2 * PI_A) - R; return Math.abs(x * 100 - dh) <= 0.05 + 1e-6 || 'Seil: ' + x; } };
    }
  };

  /* Entdecken: Kreis abrollen */
  function rollSvg(r, deg) {
    var sc = 10, gy = 108, x0 = 14, th = deg * PI / 180, cx = x0 + (r + r * th) * sc, cy = gy - r * sc, R = r * sc;
    var s = '<svg class="viz" viewBox="0 0 360 140" role="img" aria-label="Kreis rollt auf einer Geraden ab" style="max-width:560px">';
    s += '<line x1="4" y1="' + gy + '" x2="356" y2="' + gy + '" stroke="#8a94ad" stroke-width="2"/>';
    /* volle Umfangslänge als Ziel markieren */
    var xs = x0 + r * sc, xe = xs + 2 * PI * R;
    s += '<line x1="' + xs + '" y1="' + (gy + 12) + '" x2="' + xe.toFixed(1) + '" y2="' + (gy + 12) + '" stroke="' + C2 + '" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="' + xe.toFixed(1) + '" y1="' + (gy + 6) + '" x2="' + xe.toFixed(1) + '" y2="' + (gy + 18) + '" stroke="' + C2 + '" stroke-width="1.5"/>';
    s += '<text x="' + ((xs + xe) / 2).toFixed(1) + '" y="' + (gy + 28) + '" font-size="11" text-anchor="middle" fill="' + C2 + '">eine ganze Umdrehung</text>';
    if (th > 0) s += '<line x1="' + xs + '" y1="' + gy + '" x2="' + (xs + R * th).toFixed(1) + '" y2="' + gy + '" stroke="' + AC + '" stroke-width="5" stroke-linecap="round"/>';
    /* Bahn des Punktes (Zykloide) */
    var path = ''; for (var k = 0; k <= 60; k++) { var t = th * k / 60; path += (k ? ' L' : 'M') + (xs + R * (t - Math.sin(t))).toFixed(1) + ' ' + (gy - R * (1 - Math.cos(t))).toFixed(1); }
    if (th > 0) s += '<path d="' + path + '" fill="none" stroke="' + HL + '" stroke-width="1.2" stroke-dasharray="3 3"/>';
    s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + R + '" fill="' + FL + '" fill-opacity="0.85" stroke="' + LN + '" stroke-width="2.5"/>';
    var arcEnd = [cx - R * Math.sin(th), cy + R * Math.cos(th)];
    if (th > 0 && th < 2 * PI - 1e-6) s += '<path d="M' + cx.toFixed(1) + ' ' + (cy + R).toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + (th > PI ? 1 : 0) + ' 0 ' + arcEnd[0].toFixed(1) + ' ' + arcEnd[1].toFixed(1) + '" fill="none" stroke="' + AC + '" stroke-width="5"/>';
    else if (th > 0) s += '<circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="' + R + '" fill="none" stroke="' + AC + '" stroke-width="5"/>';
    s += '<line x1="' + cx.toFixed(1) + '" y1="' + cy.toFixed(1) + '" x2="' + arcEnd[0].toFixed(1) + '" y2="' + arcEnd[1].toFixed(1) + '" stroke="' + LN + '" stroke-width="1.5"/>';
    s += '<circle cx="' + arcEnd[0].toFixed(1) + '" cy="' + arcEnd[1].toFixed(1) + '" r="4.5" fill="' + AC + '" stroke="#fff" stroke-width="1.5"/><circle cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="2.5" fill="' + LN + '"/>';
    return s + '</svg>';
  }

  var EX_TAB = '<table class="tab"><tr><th>Gegenstand</th><th>Umfang u</th><th>Durchmesser d</th><th>u : d</th></tr>' +
    '<tr><td>Dose</td><td>23,9 cm</td><td>7,6 cm</td><td>3,14…</td></tr><tr><td>Teller</td><td>81,6 cm</td><td>26 cm</td><td>3,14…</td></tr><tr><td>Fahrradrad</td><td>207,3 cm</td><td>66 cm</td><td>3,14…</td></tr></table>';

  return {
    id: '024', title: 'Kreisumfang und die Zahl π', bereich: 'Kreis und Zylinder', minutes: '45 bis 60',
    vorkenntnisse: 'Kreise zeichnen, Umfang von Vielecken, Runden, Gleichungen umstellen',
    lead: 'Warum ist der Umfang jedes Kreises gut dreimal so lang wie sein Durchmesser? Du entdeckst die Kreiszahl π und berechnest damit Umfänge, Durchmesser und Radumdrehungen.',
    einstieg: { html: '<p>Mira hat einen neuen Fahrradcomputer. Beim Einrichten fragt er nach dem <b>Radumfang</b> in Zentimetern. Ein Maßband hat Mira nicht, aber ein Lineal. Damit kann sie den <b>Durchmesser</b> des Rades messen: 66 cm.</p><p class="note">Wie kommt Mira vom Durchmesser zum Umfang? Ist der Umfang doppelt so lang, dreimal so lang oder noch länger?</p><p>Probiere es aus: Lege einen Faden um eine Dose und miss ihn. Miss dann den Durchmesser der Dose. In diesem Modul findest du heraus, dass zwischen Umfang und Durchmesser <b>immer</b> derselbe Faktor steckt: die Kreiszahl π.</p>' },
    ziele: ['Ich benenne Mittelpunkt, Radius, Durchmesser und Sehne eines Kreises.', 'Ich erkläre, dass u : d bei jedem Kreis dieselbe Zahl π ≈ 3,14 ergibt.', 'Ich berechne den Umfang mit u = π · d oder u = 2 · π · r.', 'Ich berechne Durchmesser und Radius aus dem Umfang.', 'Ich löse Sachaufgaben mit Radumdrehungen und Strecken.'],
    fachwoerter: [['Radius r', 'Strecke vom Mittelpunkt M bis zur Kreislinie.'], ['Durchmesser d', 'Strecke durch M von Kreislinie zu Kreislinie. Es gilt d = 2 · r.'], ['Sehne', 'Strecke, die zwei Punkte der Kreislinie verbindet. Der Durchmesser ist die längste Sehne.'], ['Umfang u', 'Länge der Kreislinie.'], ['Kreiszahl π', 'Das Verhältnis u : d. Sie ist bei jedem Kreis gleich: π = 3,14159… (gelesen „pi“).']],
    diagnose: [
      { q: 'Ein Rechteck ist 7 cm lang und 3 cm breit. Wie groß ist sein Umfang?', options: ['21 cm', '20 cm', '10 cm', 'Weiß ich noch nicht'], answer: 1, why: 'u = 2 · 7 cm + 2 · 3 cm = 20 cm. Der Umfang ist die Länge des Randes.', review: 'Umfang von Rechteck und Vielecken' },
      { q: 'Runde 12,463 auf eine Nachkommastelle.', options: ['12,4', '12,5', '12,46', 'Weiß ich noch nicht'], answer: 1, why: 'Die zweite Nachkommastelle ist 6, also wird aufgerundet: 12,5.', review: 'Dezimalzahlen runden' },
      { q: 'Löse die Gleichung 3 · x = 27,9.', options: ['x = 9,3', 'x = 24,9', 'x = 83,7', 'Weiß ich noch nicht'], answer: 0, why: 'Beide Seiten durch 3 teilen: x = 27,9 : 3 = 9,3.', review: 'Einfache Gleichungen durch Umkehroperation lösen' },
      { q: 'Wie viele Zentimeter sind 2,35 m?', options: ['23,5 cm', '2 350 cm', '235 cm', 'Weiß ich noch nicht'], answer: 2, why: '1 m = 100 cm, also 2,35 m = 235 cm.', review: 'Längeneinheiten umrechnen' }],
    erklaerung:
      '<h3>1. Begriffe am Kreis</h3><p>Alle Punkte der Kreislinie haben denselben Abstand vom <b>Mittelpunkt M</b>. Dieser Abstand ist der <b>Radius r</b>. Der <b>Durchmesser d</b> geht durch M und ist doppelt so lang: d = 2 · r. Eine <b>Sehne</b> verbindet zwei Punkte der Kreislinie.</p>' +
      partsPic({ d: 'd', r: 'r', s: 'Sehne' }) +
      '<h3>2. Die Kreiszahl π</h3><p>Miss bei verschiedenen runden Gegenständen den Umfang und den Durchmesser und teile u durch d:</p>' + EX_TAB +
      '<p>Der Quotient ist immer gleich, egal wie groß der Kreis ist. Diese Zahl heißt <b>π</b> (gelesen „pi“). Sie hat unendlich viele Nachkommastellen, die sich nie wiederholen: π = 3,14159265… Der Taschenrechner hat dafür eine eigene Taste.</p>' +
      '<div class="merk"><b>Merke:</b> Für jeden Kreis gilt<br><span class="big-math">u = π · d = 2 · π · r</span><br>Umgekehrt: d = u : π und r = u : (2 · π).</div>' +
      '<h3>3. So rechnest du</h3><p>Beispiel: r = 4 cm. Dann ist u = 2 · π · 4 cm = π · 8 cm ≈ 25,1 cm (auf eine Nachkommastelle gerundet). Rechne mit der π-Taste und runde erst am Ende.</p>' +
      '<p class="note"><b>Überschlag:</b> Mit π ≈ 3 ist der Umfang etwa dreimal so lang wie der Durchmesser, genauer etwas mehr. Bei d = 8 cm sind das gut 24 cm. So erkennst du schnell, ob ein Ergebnis stimmen kann.</p>' +
      '<h3>4. Radumdrehungen</h3><p>Bei einer Umdrehung rollt ein Rad genau seinen Umfang auf dem Boden ab. Bei n Umdrehungen ist die Strecke n · u. Umgekehrt ist die Anzahl der Umdrehungen Strecke : u.</p>',
    entdecken: {
      html: '<p>Rolle den Kreis auf der Geraden ab. Der orange Punkt berührt am Anfang den Boden. Die orange Strecke ist die abgerollte Länge.</p><div class="ctl"><label>Radius r = <b id="v_r"></b> <input type="range" id="r_r" min="1" max="4" step="0.5" value="2"></label><label>Drehung = <b id="v_w"></b> <input type="range" id="r_w" min="0" max="360" step="30" value="90"></label><button class="btn ghost" id="b_full" type="button">Eine ganze Umdrehung</button></div>' +
        '<div id="e_g"></div><div id="e_t"></div><p class="note">Drehe den Kreis einmal ganz herum. Vergleiche die abgerollte Strecke mit dem Durchmesser. Ändere dann den Radius. Was bleibt gleich?</p>',
      init: function (root, done) {
        var n = 0, R = root.querySelector('#r_r'), W = root.querySelector('#r_w');
        function draw() {
          var r = +R.value, w = +W.value, d = 2 * r, s = PI * d * w / 360;
          root.querySelector('#v_r').textContent = f(r) + ' cm'; root.querySelector('#v_w').textContent = w + '°';
          root.querySelector('#e_g').innerHTML = rollSvg(r, w);
          root.querySelector('#e_t').innerHTML = '<p>Durchmesser d = ' + f(d) + ' cm. Abgerollte Strecke: <b>' + f(r2(s)) + ' cm</b> (' + w + '° von 360°).</p>' +
            '<p class="big-math">Ganze Umdrehung: u = ' + f(r2(PI * d)) + ' cm, &nbsp; u : d = ' + f(r2(PI * d)) + ' : ' + f(d) + ' ≈ 3,14</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Stark beobachtet: Bei einer ganzen Umdrehung rollt der Kreis seinen Umfang ab. Der Umfang ist immer etwa 3,14-mal so lang wie der Durchmesser, egal wie groß der Kreis ist. Das ist die Zahl π.'); }
        R.addEventListener('input', hit); W.addEventListener('input', hit);
        root.querySelector('#b_full').addEventListener('click', function () { W.value = 360; hit(); });
        draw();
      }
    },
    beispiel: { title: 'Der Fahrradcomputer', q: 'Miras Fahrradrad hat einen Durchmesser von 66 cm. a) Welchen Radumfang muss sie eingeben (auf ganze Zentimeter gerundet)? b) Wie weit fährt sie bei 500 Umdrehungen?',
      steps: ['Formel wählen: Der Durchmesser ist gegeben, also u = π · d.', 'a) u = π · 66 cm = 207,345… cm ≈ 207 cm. Diesen Wert gibt Mira ein.', 'b) Bei jeder Umdrehung rollt das Rad einen Umfang ab: Strecke = 500 · π · 66 cm ≈ 103 673 cm.', 'Umrechnen: 103 673 cm ≈ 1 036,7 m, also gut 1 km.', 'Kontrolle mit Überschlag: 3 · 66 cm ≈ 200 cm = 2 m pro Umdrehung, 500 · 2 m = 1 000 m. Das passt.'] },
    tasks: { gen: gen, plan: { G: ['begriffe:1', 'ueberschlag:1', 'umfangD:1', 'umfangR:1'], S: ['piQuot:1', 'umfangD:1', 'umfangR:2', 'durchmesser:2', 'rad:2'], E: ['umfangR:2', 'durchmesser:2', 'rad:2', 'baum:2', 'umdrehungen:3', 'fenster:3'] },
      extra: 'seil', test: ['begriffe:1', 'umfangD:1', 'umfangR:2', 'durchmesser:2', 'rad:2', 'baum:2'] },
    lerncheck: ['Ich unterscheide Radius, Durchmesser und Sehne.', 'Ich kann erklären, was die Zahl π bedeutet.', 'Ich berechne den Umfang aus Radius oder Durchmesser und umgekehrt.', 'Ich löse Sachaufgaben mit Radumdrehungen.']
  };
})();
