/* Modul 025 (Klasse 9) · Kreisfläche */
var MODULE = (function () {
  var f = M.fmtNum, PI = Math.PI;
  var LN = '#1e3a8a', FL = '#e8eefc', AC = '#d97706', HL = '#1d4ed8', C2 = '#0f766e', OR = '#fbe3c2';
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function f1(x) { return f(x, 1); }
  function f2(x) { return f(x, 2); }
  function near(x, y, t) { return x !== null && Math.abs(x - y) <= (t || 0.06); }
  function ex(x) { return f(Math.round(x * 1000) / 1000); }
  /* Kreisfläche unabhängig von π: numerische Integration (Mittelpunktsregel) über den Viertelkreis */
  function intA(r) { var N = 20000, h = r / N, s = 0; for (var i = 0; i < N; i++) { var x = (i + 0.5) * h; s += Math.sqrt(r * r - x * x); } return 4 * s * h; }
  function chk(ans, val, tol) { return function () { return Math.abs(ans - val) <= tol + 1e-7 * Math.abs(val) + 1e-6 || 'Nachrechnung: ' + val + ' statt ' + ans; }; }

  function circPic(type, text) {
    var cx = 110, cy = 100, R = 72, s = '<svg class="viz" viewBox="0 0 220 200" role="img" aria-label="Kreis" style="max-width:240px">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
    s += '<line x1="' + (type === 'r' ? cx : cx - R) + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" stroke="' + AC + '" stroke-width="2.5"/>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="3" fill="' + LN + '"/><text x="' + (cx - 4) + '" y="' + (cy + 18) + '" font-size="13" fill="' + LN + '" text-anchor="end">M</text>';
    s += '<text x="' + (type === 'r' ? cx + R / 2 - 4 : cx) + '" y="' + (cy - 9) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + text + '</text>';
    return s + '</svg>';
  }
  /* Halbkreis oder Viertelkreis mit Radius */
  function partPic(part, text) {
    var R = 110, s;
    if (part === 2) {
      s = '<svg class="viz" viewBox="0 0 260 150" role="img" aria-label="Halbkreis" style="max-width:280px"><path d="M20 130 A' + R + ' ' + R + ' 0 0 1 240 130 Z" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
      s += '<line x1="130" y1="130" x2="240" y2="130" stroke="' + AC + '" stroke-width="2.5"/><circle cx="130" cy="130" r="3" fill="' + LN + '"/><text x="185" y="122" font-size="13" font-weight="700" text-anchor="middle">' + text + '</text>';
    } else {
      s = '<svg class="viz" viewBox="0 0 160 150" role="img" aria-label="Viertelkreis" style="max-width:180px"><path d="M20 135 L20 25 A' + R + ' ' + R + ' 0 0 1 130 135 Z" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
      s += '<line x1="20" y1="135" x2="130" y2="135" stroke="' + AC + '" stroke-width="2.5"/><path d="M20 123 L32 123 L32 135" fill="none" stroke="' + AC + '" stroke-width="1.5"/><text x="75" y="128" font-size="13" font-weight="700" text-anchor="middle">' + text + '</text>';
    }
    return s + '</svg>';
  }
  /* Quadrat mit Kreisen (n × n) */
  function stanzPic(n, text) {
    var S = 150, x0 = 30, y0 = 10, c = S / n, s = '<svg class="viz" viewBox="0 0 200 190" role="img" aria-label="Quadrat mit Kreisen" style="max-width:220px"><rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + S + '" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.5"/>';
    for (var i = 0; i < n; i++) for (var j = 0; j < n; j++) s += '<circle cx="' + (x0 + (i + 0.5) * c) + '" cy="' + (y0 + (j + 0.5) * c) + '" r="' + c / 2 + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="1.5"/>';
    s += '<text x="' + (x0 + S / 2) + '" y="' + (y0 + S + 20) + '" font-size="13" font-weight="700" text-anchor="middle">' + text + '</text>';
    return s + '</svg>';
  }
  function pizzaPic(d1, d2) {
    var a = d1 * 1.2, b = d2 * 1.2, W = Math.round(2 * a + 2 * b + 50), H = Math.round(2 * b + 40);
    var s = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Zwei Pizzen" style="max-width:' + Math.round(W * 1.15) + 'px">';
    function pz(cx, r, t) { return '<circle cx="' + cx + '" cy="' + (8 + b) + '" r="' + r + '" fill="' + OR + '" stroke="' + AC + '" stroke-width="3"/><circle cx="' + cx + '" cy="' + (8 + b) + '" r="' + (r - 6) + '" fill="#fde9cc"/><line x1="' + (cx - r) + '" y1="' + (8 + b) + '" x2="' + (cx + r) + '" y2="' + (8 + b) + '" stroke="' + LN + '" stroke-width="1.5" stroke-dasharray="4 3"/><text x="' + cx + '" y="' + (2 * b + 32) + '" font-size="13" font-weight="700" text-anchor="middle">' + t + '</text>'; }
    return s + pz(15 + a, a, 'd = ' + d1 + ' cm') + pz(35 + 2 * a + b, b, 'd = ' + d2 + ' cm') + '</svg>';
  }
  function areaMistakes(r, ans, given) {
    return function (v) {
      var x = M.parseNum(v[0]); if (x === null) return null;
      if (given === 'd' && near(x, r1(PI * 4 * r * r), 0.2)) return 'Achtung: Du hast den <b>Durchmesser</b> in die Formel eingesetzt. In A = π · r² gehört der Radius. Halbiere zuerst: r = ' + f(2 * r) + ' : 2 = ' + f(r) + '. Dein Ergebnis ist deshalb viermal zu groß.';
      if (near(x, r1(2 * PI * r), 0.06)) return 'Das ist der Umfang (u = 2 · π · r). Für die Fläche rechnest du A = π · r².';
      if (near(x, r1(PI * r * 2), 0.06) || near(x, r1(PI * PI * r * r), 0.2)) return 'Achte auf die Reihenfolge: Nur der Radius wird quadriert, also π · r · r.';
      if (near(x, r1(PI * r), 0.06)) return 'Du hast den Radius nicht quadriert. A = π · r² = π · r · r.';
      if (near(x, r1(3.14 * r * r), 0.051) || near(x, r1(3.14 * r * r), 0.2)) return 'Fast. Du hast wohl mit 3,14 gerechnet. Nutze die π-Taste.';
      return null;
    };
  }

  var gen = {
    ueberschlag: function () {
      var r, vals; do { r = M.rnd(3, 12); vals = [Math.round(PI * r * r), Math.round(2 * PI * r), Math.round(PI * 4 * r * r), Math.round(PI * r)]; } while (new Set(vals).size < 4);
      var opts = M.shuffle(vals.map(function (v, i) { return [v, i === 0]; }));
      return { skill: 'Kreisfläche überschlagen', level: 1, q: 'Ein Kreis hat den Radius ' + r + ' cm. Welcher Flächeninhalt passt? Entscheide mit einem Überschlag.', inputs: [{ kind: 'mc', label: 'Flächeninhalt', options: opts.map(function (o) { return 'etwa ' + o[0] + ' cm²'; }), answer: opts.findIndex(function (o) { return o[1]; }) }],
        hints: ['Die Kreisfläche ist gut dreimal so groß wie das Quadrat aus dem Radius: A = π · r² ≈ 3 · r².', 'r² = ' + r + ' · ' + r + ' = ' + r * r + ' cm². Mal 3 ergibt ' + 3 * r * r + ' cm².', 'Suche den Wert, der etwas größer als ' + 3 * r * r + ' cm² ist.'],
        solution: 'A = π · r² = π · ' + r + '² cm² = π · ' + r * r + ' cm² ≈ ' + Math.round(PI * r * r) + ' cm². Überschlag: 3 · ' + r * r + ' = ' + 3 * r * r + ', etwas mehr.',
        verify: chk(Math.round(PI * r * r), Math.round(intA(r)), 0) };
    },
    flaecheR: function (lvl) {
      var r = lvl <= 1 ? M.rnd(2, 12) : lvl === 2 ? M.pick([M.rnd(5, 30), M.rnd(15, 95) / 10]) : M.rnd(12, 60) / 10, e = lvl >= 3 ? 'm' : 'cm', A = r1(PI * r * r);
      return { skill: 'Kreisfläche aus dem Radius', q: 'Berechne den Flächeninhalt des Kreises mit r = ' + f(r) + ' ' + e + '. Runde auf eine Nachkommastelle.' + circPic('r', 'r = ' + f(r) + ' ' + e),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: e + '²' }],
        hints: ['Formel: A = π · r². Zuerst wird r quadriert, dann mit π multipliziert.', 'r² = ' + f(r) + ' · ' + f(r) + ' = ' + f(r2(r * r)) + ' ' + e + '².', 'A = π · ' + f(r2(r * r)) + ' = ' + ex(PI * r * r) + ' … Runde auf eine Nachkommastelle.'],
        solution: 'A = π · r² = π · (' + f(r) + ' ' + e + ')² = π · ' + f(r2(r * r)) + ' ' + e + '² ≈ ' + f1(A) + ' ' + e + '²',
        mistakes: areaMistakes(r, A, 'r'), verify: chk(A, intA(r), 0.05) };
    },
    flaecheD: function (lvl) {
      var o = M.pick([['Ein runder Tisch', 'cm', 2 * M.rnd(30, 60)], ['Ein runder Spiegel', 'cm', 2 * M.rnd(15, 40)], ['Eine runde Tischdecke', 'cm', 10 * M.rnd(10, 18)], ['Ein kreisrunder Teppich', 'm', M.rnd(12, 30) / 10], ['Ein kreisrundes Planschbecken', 'm', M.rnd(15, 36) / 10]]);
      if (lvl <= 1 && o[1] === 'm') o = ['Ein runder Bierdeckel', 'cm', M.pick([10, 12])];
      var d = o[2], e = o[1], r = d / 2, A = r1(PI * r * r);
      return { skill: 'Kreisfläche aus dem Durchmesser', q: o[0] + ' hat einen <b>Durchmesser</b> von ' + f(d) + ' ' + e + '. Wie groß ist die Fläche? Runde auf eine Nachkommastelle.' + circPic('d', 'd = ' + f(d) + ' ' + e),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: e + '²' }],
        hints: ['Vorsicht, gegeben ist der Durchmesser. In die Formel A = π · r² gehört der Radius.', 'r = d : 2 = ' + f(d) + ' : 2 = ' + f(r) + ' ' + e + '.', 'A = π · ' + f(r) + '² = π · ' + f(r * r) + ' = ' + ex(PI * r * r) + ' …'],
        solution: 'r = ' + f(d) + ' ' + e + ' : 2 = ' + f(r) + ' ' + e + '. A = π · r² = π · (' + f(r) + ' ' + e + ')² = π · ' + f(r * r) + ' ' + e + '² ≈ ' + f1(A) + ' ' + e + '²',
        mistakes: areaMistakes(r, A, 'd'), verify: chk(A, intA(d / 2), 0.05) };
    },
    radiusAusA: function (lvl) {
      var A = lvl <= 1 ? M.pick([50, 100, 200, 314, 500]) : M.rnd(20, 900), r = r1(Math.sqrt(A / PI)), d = r1(2 * Math.sqrt(A / PI));
      return { skill: 'Radius aus der Fläche', q: 'Ein Kreis hat den Flächeninhalt ' + A + ' cm². Wie groß sind Radius und Durchmesser? Runde jeweils auf eine Nachkommastelle.',
        inputs: [{ kind: 'num', answer: r, tol: 0.05, label: 'r ≈', unit: 'cm' }, { kind: 'num', answer: d, tol: 0.11, label: 'd ≈', unit: 'cm' }],
        hints: ['Stelle A = π · r² nach r um: Teile zuerst durch π, dann ziehe die Wurzel.', 'r² = ' + A + ' : π = ' + ex(A / PI) + ' cm².', 'r = √' + ex(A / PI) + ' ≈ ' + ex(Math.sqrt(A / PI)) + ' cm. Der Durchmesser ist doppelt so lang.'],
        solution: 'r² = A : π = ' + A + ' : π ≈ ' + f2(r2(A / PI)) + ' cm². r = √(' + A + ' : π) ≈ ' + f1(r) + ' cm. d = 2 · √(' + A + ' : π) ≈ ' + f1(d) + ' cm. Probe: π · ' + f1(r) + '² ≈ ' + f1(r1(PI * r * r)) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(A / PI), 0.1)) return 'Du hast A : π gerechnet. Das ist erst r². Ziehe noch die Wurzel.';
          if (near(x, r1(Math.sqrt(A) / PI), 0.06)) return 'Erst durch π teilen, dann die Wurzel ziehen: r = √(A : π).';
          if (near(x, r1(A / (2 * PI)), 0.1)) return 'Das wäre der Radius bei einem Umfang von ' + A + ' cm. Für die Fläche gilt r = √(A : π).'; return null; },
        verify: function () { return (Math.abs(intA(r) - A) <= intA(r + 0.05) - intA(r) + 1e-6 && Math.abs(d - 2 * r) <= 0.1 + 1e-9) || 'Rückrechnung passt nicht'; } };
    },
    teil: function (lvl) {
      var part = M.pick([2, 4]), r = lvl <= 1 ? M.rnd(2, 12) : M.pick([M.rnd(4, 25), M.rnd(25, 95) / 10]), A = r1(PI * r * r / part), nm = part === 2 ? 'Halbkreis' : 'Viertelkreis';
      return { skill: 'Halbkreis und Viertelkreis', q: 'Berechne den Flächeninhalt des ' + nm + 'es mit dem Radius ' + f(r) + ' cm. Runde auf eine Nachkommastelle.' + partPic(part, 'r = ' + f(r) + ' cm'),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: 'cm²' }],
        hints: ['Ein ' + nm + ' ist ' + (part === 2 ? 'die Hälfte' : 'ein Viertel') + ' eines ganzen Kreises.', 'Ganzer Kreis: π · ' + f(r) + '² ≈ ' + ex(PI * r * r) + ' cm².', 'Teile durch ' + part + '.'],
        solution: 'A = π · r² : ' + part + ' = π · ' + f(r2(r * r)) + ' cm² : ' + part + ' ≈ ' + f1(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * r * r), 0.06)) return 'Das ist die Fläche des ganzen Kreises. Teile noch durch ' + part + '.';
          if (near(x, r1(PI * r * r / (part === 2 ? 4 : 2)), 0.06)) return 'Prüfe, durch welche Zahl du teilst. Ein ' + nm + ' ist ' + (part === 2 ? 'die Hälfte' : 'ein Viertel') + ' des Kreises.';
          if (near(x, r1(PI * r * r * 4 / part), 0.2)) return 'Der Radius ist ' + f(r) + ' cm. Du hast mit dem doppelten Wert gerechnet.'; return null; },
        verify: chk(A, intA(r) / part, 0.05) };
    },
    pizza: function () {
      var d1, d2, p1, p2, q1, q2;
      for (var k = 0; k < 300; k++) {
        d1 = M.pick([24, 26, 28, 30]); d2 = M.pick([32, 34, 36, 40]); p1 = M.pick([5.5, 6, 6.5, 7, 7.5, 8]); p2 = M.pick([9, 9.5, 10, 11, 12, 13, 14]);
        q1 = p1 / (PI * d1 * d1 / 4) * 100; q2 = p2 / (PI * d2 * d2 / 4) * 100;
        if (Math.abs(q1 - q2) / Math.min(q1, q2) > 0.08) break;
      }
      var A1 = Math.round(PI * d1 * d1 / 4), A2 = Math.round(PI * d2 * d2 / 4), cheap = q1 < q2 ? 0 : 1;
      return { skill: 'Pizzavergleich', q: 'Die Pizzeria bietet zwei runde Pizzen an: Eine Pizza mit ' + d1 + ' cm Durchmesser kostet ' + f2(p1) + ' €, eine mit ' + d2 + ' cm Durchmesser kostet ' + f2(p2) + ' €.<br>a) Berechne beide Flächen. Runde auf ganze cm².<br>b) Bei welcher Pizza bekommst du mehr Pizza für dein Geld?' + pizzaPic(d1, d2),
        inputs: [{ kind: 'num', answer: A1, tol: 0.5, label: 'a) kleine Pizza A ≈', unit: 'cm²' }, { kind: 'num', answer: A2, tol: 0.5, label: 'a) große Pizza A ≈', unit: 'cm²' }, { kind: 'mc', label: 'b) Günstiger pro cm² ist …', options: ['die Pizza mit ' + d1 + ' cm', 'die Pizza mit ' + d2 + ' cm'], answer: cheap }],
        hints: ['Halbiere die Durchmesser: r = ' + d1 / 2 + ' cm und r = ' + d2 / 2 + ' cm. Dann A = π · r².', 'A ≈ ' + A1 + ' cm² und A ≈ ' + A2 + ' cm². Vergleiche jetzt den Preis pro Fläche.', 'Preis für 100 cm²: ' + f2(p1) + ' € : ' + A1 + ' · 100 und ' + f2(p2) + ' € : ' + A2 + ' · 100. Kleiner ist günstiger.'],
        solution: 'a) Klein: π · ' + d1 / 2 + '² ≈ ' + A1 + ' cm². Groß: π · ' + d2 / 2 + '² ≈ ' + A2 + ' cm². b) Preis für 100 cm²: klein ' + f2(r2(q1)) + ' €, groß ' + f2(r2(q2)) + ' €. Günstiger ist die Pizza mit ' + (cheap ? d2 : d1) + ' cm.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (near(x, Math.round(PI * d1 * d1), 1) || near(y, Math.round(PI * d2 * d2), 1)) return 'Du hast den Durchmesser in A = π · r² eingesetzt. Halbiere ihn zuerst. Sonst wird die Fläche viermal zu groß.'; return null; },
        verify: function () { var B1 = intA(d1 / 2), B2 = intA(d2 / 2); return (Math.abs(B1 - A1) <= 0.5 && Math.abs(B2 - A2) <= 0.5 && ((p1 / B1 < p2 / B2) === (cheap === 0))) || 'Pizza falsch'; } };
    },
    faktor: function () {
      var k = M.pick([2, 3, 4, 5, 10]), r = M.rnd(2, 9);
      return { skill: 'Radius vervielfachen', q: 'Der Radius eines Kreises wird ' + (k === 2 ? 'verdoppelt' : k === 3 ? 'verdreifacht' : 'mit ' + k + ' multipliziert') + '. Mit welcher Zahl vervielfacht sich der Flächeninhalt? Teste zum Beispiel mit r = ' + r + ' cm.',
        inputs: [{ kind: 'num', answer: k * k, label: 'Die Fläche wird … -mal so groß' }],
        hints: ['Berechne A für r = ' + r + ' cm und für r = ' + k * r + ' cm.', 'π · ' + r + '² = π · ' + r * r + ' und π · ' + k * r + '² = π · ' + k * k * r * r + '.', 'Teile: ' + k * k * r * r + ' : ' + r * r + '.'],
        solution: 'Neue Fläche = π · (' + k + ' · r)² = π · ' + k * k + ' · r² = ' + k * k + ' · A. Die Fläche wird ' + k * k + '-mal so groß, weil der Radius im Quadrat vorkommt.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === k) return 'Das gilt für den Umfang. Bei der Fläche wird r quadriert, also auch der Faktor ' + k + '.'; if (x === 2 * k) return 'Nicht verdoppeln, sondern quadrieren: ' + k + ' · ' + k + '.'; return null; },
        verify: function () { return Math.abs(intA(k * r) / intA(r) - k * k) < 1e-6 || 'Faktor falsch'; } };
    },
    ausU: function () {
      var u = M.rnd(20, 160), r = u / (2 * PI), A = Math.round(PI * r * r);
      return { skill: 'Fläche aus dem Umfang', level: 3, q: 'Ein kreisrundes Beet hat einen Umfang von ' + u + ' dm. Wie groß ist seine Fläche? Rechne mit dem ungerundeten Radius weiter und runde am Ende auf ganze dm².',
        inputs: [{ kind: 'num', answer: A, tol: 0.5, label: 'A ≈', unit: 'dm²' }],
        hints: ['Berechne zuerst den Radius aus dem Umfang: r = u : (2 · π).', 'r = ' + u + ' : (2 · π) ≈ ' + ex(r) + ' dm. Lass den Wert im Taschenrechner stehen.', 'A = π · r² = π · ' + ex(r) + '² ≈ ' + ex(PI * r * r) + ' dm².'],
        solution: 'r = ' + u + ' dm : (2 · π) ≈ ' + ex(r) + ' dm. A = π · r² ≈ ' + A + ' dm². Kurzweg: A = u² : (4 · π) = ' + u * u + ' : (4 · π) ≈ ' + A + ' dm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, Math.round(PI * (u / PI) * (u / PI)), 1)) return 'u = π · d liefert den Durchmesser. Für die Fläche brauchst du den Radius: r = u : (2 · π).'; if (near(x, Math.round(u / (2 * PI)), 0.5)) return 'Das ist erst der Radius. Berechne jetzt noch A = π · r².'; return null; },
        verify: chk(A, intA(u / (2 * PI_A())), 0.5) };
    },
    verschnitt: function (lvl) {
      var a = M.pick([10, 12, 16, 20, 24, 30, 40]), K = PI * a * a / 4, rest = r1(a * a - K);
      return { skill: 'Verschnitt Quadrat und Kreis', level: 3, q: 'Aus einer quadratischen Holzplatte mit der Seitenlänge ' + a + ' cm wird eine möglichst große runde Scheibe ausgesägt. Wie viel cm² Holz bleiben übrig (orange)? Runde auf eine Nachkommastelle.' + stanzPic(1, 'a = ' + a + ' cm'),
        inputs: [{ kind: 'num', answer: rest, tol: 0.05, label: 'Rest ≈', unit: 'cm²' }],
        hints: ['Der Kreis berührt alle vier Seiten. Sein Durchmesser ist ' + a + ' cm, der Radius ' + a / 2 + ' cm.', 'Quadrat: ' + a + ' · ' + a + ' = ' + a * a + ' cm². Kreis: π · ' + a / 2 + '² ≈ ' + ex(K) + ' cm².', 'Rest = Quadrat − Kreis.'],
        solution: 'Quadrat: ' + a * a + ' cm². Kreis: π · (' + a / 2 + ' cm)² ≈ ' + f2(r2(K)) + ' cm². Rest: ' + a * a + ' cm² − ' + f2(r2(K)) + ' cm² ≈ ' + f1(rest) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, r1(a * a - PI * a * a), 1) || x < 0) return 'Der Radius ist die Hälfte der Seitenlänge: r = ' + a / 2 + ' cm.'; if (near(x, r1(K), 0.1)) return 'Das ist die Fläche der Scheibe. Gesucht ist der Rest: Quadrat minus Kreis.'; return null; },
        verify: chk(rest, a * a - intA(a / 2), 0.05) };
    },
    stanzen: function () {
      var n = M.pick([2, 3, 4, 5]), a = n * M.pick([4, 5, 6, 8, 10]), c = a / n, K = n * n * PI * c * c / 4, p = r1((a * a - K) / (a * a) * 100);
      var opts = ['Der Anteil bleibt gleich, egal wie viele Kreise es sind.', 'Bei mehr Kreisen wird der Anteil kleiner.', 'Bei mehr Kreisen wird der Anteil größer.'];
      return { skill: 'Abfall beim Ausstanzen (Transfer)', level: 3, q: 'Aus einem quadratischen Blech mit ' + a + ' cm Seitenlänge werden ' + n * n + ' gleich große Kreise ausgestanzt (' + n + ' Reihen mit je ' + n + ' Kreisen, die sich berühren).<br>a) Wie viel Prozent des Blechs sind Abfall? Runde auf eine Nachkommastelle.<br>b) Was passiert mit dem Abfall-Anteil, wenn man mehr und kleinere Kreise in dieser Anordnung ausstanzt?' + stanzPic(n, a + ' cm'),
        inputs: [{ kind: 'num', answer: p, tol: 0.05, label: 'a) Abfall ≈', unit: '%' }, { kind: 'mc', label: 'b) Abfall-Anteil', options: opts, answer: 0 }],
        hints: ['Jeder Kreis hat den Durchmesser ' + a + ' : ' + n + ' = ' + f(c) + ' cm.', 'Alle Kreise: ' + n * n + ' · π · ' + f(c / 2) + '² ≈ ' + ex(K) + ' cm². Blech: ' + a * a + ' cm².', 'Abfall = ' + a * a + ' − ' + ex(K) + '. Teile durch ' + a * a + ' und multipliziere mit 100 %.'],
        solution: 'a) Kreise: ' + n * n + ' · π · (' + f(c / 2) + ' cm)² ≈ ' + f2(r2(K)) + ' cm². Abfall: ' + a * a + ' cm² − ' + f2(r2(K)) + ' cm² ≈ ' + f2(r2(a * a - K)) + ' cm². Anteil: ' + f2(r2(a * a - K)) + ' : ' + a * a + ' ≈ ' + f1(p) + ' %. b) Jeder Kreis füllt sein kleines Quadrat zum Anteil π : 4 ≈ 78,5 %. Das gilt für jede Größe. Der Abfall bleibt immer etwa 21,5 %.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, r1(100 - p), 0.1)) return 'Das ist der Anteil der Kreise. Gesucht ist der Abfall: 100 % minus diesen Anteil.'; return null; },
        verify: function () { var c2 = a / n, Kn = n * n * intA(c2 / 2); return Math.abs((a * a - Kn) / (a * a) * 100 - p) <= 0.05 + 1e-6 || 'Abfall falsch'; } };
    }
  };
  function PI_A() { var s = 1, n = 6; for (var k = 0; k < 14; k++) { s = s / Math.sqrt(2 + Math.sqrt(4 - s * s)); n *= 2; } return n * s / 2; }

  /* Entdecken: Kreis in Sektoren zerlegen und umlegen */
  function sectorSvg(n, r, tight) {
    var sc = 11, th = 2 * PI / n, R = r * sc, cx = 12 + R, cy = 72, s = '';
    var X0 = cx + R + 26, base = cy + R * Math.cos(th / 2) / 2 + R / 2;
    /* Kreis mit Sektoren: obere Hälfte orange, untere blau */
    for (var i = 0; i < n; i++) {
      var a1 = i * th, a2 = (i + 1) * th, col = i < n / 2 ? OR : FL;
      s += '<path d="M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(a1)).toFixed(1) + ' ' + (cy - R * Math.sin(a1)).toFixed(1) + ' A' + R + ' ' + R + ' 0 0 0 ' + (cx + R * Math.cos(a2)).toFixed(1) + ' ' + (cy - R * Math.sin(a2)).toFixed(1) + ' Z" fill="' + col + '" stroke="' + LN + '" stroke-width="1.2"/>';
    }
    /* umgelegt: n/2 Sektoren Spitze oben (blau), n/2 Spitze unten (orange) */
    var sl = R * th, top = cy - R / 2, bot = top + R * Math.cos(th / 2), h2 = th / 2;
    function sect(ax, ay, down) {
      var sg = down ? -1 : 1, p1 = [ax - R * Math.sin(h2), ay + sg * R * Math.cos(h2)], p2 = [ax + R * Math.sin(h2), ay + sg * R * Math.cos(h2)];
      return '<path d="M' + ax.toFixed(1) + ' ' + ay.toFixed(1) + ' L' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 0 ' + (down ? 1 : 0) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1) + ' Z" fill="' + (down ? OR : FL) + '" stroke="' + LN + '" stroke-width="1.2"/>';
    }
    var chordW = 2 * R * Math.sin(h2);
    for (var j = 0; j < n / 2; j++) {
      s += sect(X0 + chordW / 2 + j * chordW, top, false);
      s += sect(X0 + chordW + j * chordW, bot + R * (1 - Math.cos(h2)), true);
    }
    var W = n / 2 * chordW + chordW / 2, yb = top + R + 14;
    s += '<line x1="' + X0 + '" y1="' + yb + '" x2="' + (X0 + W).toFixed(1) + '" y2="' + yb + '" stroke="' + AC + '" stroke-width="1.5"/><text x="' + (X0 + W / 2).toFixed(1) + '" y="' + (yb + 16) + '" font-size="12" font-weight="700" text-anchor="middle" fill="' + AC + '">≈ π · r (halber Umfang)</text>';
    s += '<line x1="' + (X0 - 8) + '" y1="' + top + '" x2="' + (X0 - 8) + '" y2="' + (top + R) + '" stroke="' + C2 + '" stroke-width="1.5"/><text x="' + (X0 - 12) + '" y="' + (top + R / 2 + 4) + '" font-size="12" font-weight="700" text-anchor="end" fill="' + C2 + '">r</text>';
    var Wt = tight ? X0 + W + 12 : Math.max(X0 + W + 12, 410), Ht = 150;
    return '<svg class="viz" viewBox="0 0 ' + Math.round(Wt) + ' ' + Math.round(Ht) + '" role="img" aria-label="Kreis in Sektoren zerlegt und zu einem Rechteck umgelegt" style="max-width:600px">' + s + '</svg>';
  }

  return {
    id: '025', title: 'Kreisfläche', bereich: 'Kreis und Zylinder', minutes: '45 bis 60',
    vorkenntnisse: 'Kreisumfang und π (Modul 024), Flächeninhalt von Rechteck und Dreieck, Quadratzahlen und Wurzeln',
    lead: 'Wie viel Pizza bekommst du für dein Geld? Du leitest die Formel für die Kreisfläche her und vergleichst damit runde Flächen im Alltag.',
    einstieg: { html: '<p>Freitagabend, Pizza-Zeit. Die kleine Pizza hat 26 cm Durchmesser und kostet 6,50 €. Die große hat 36 cm Durchmesser und kostet 11 €.</p><p class="note">Die große Pizza ist nur 10 cm breiter, kostet aber fast doppelt so viel. Ist sie ihr Geld wert? Schätze zuerst.</p><p>Um das zu entscheiden, brauchst du die <b>Fläche</b> der Pizzen. In diesem Modul findest du heraus, wie man die Fläche eines Kreises berechnet, und warum dabei wieder die Zahl π auftaucht.</p>' },
    ziele: ['Ich kann erklären, warum für die Kreisfläche A = π · r² gilt.', 'Ich berechne die Kreisfläche aus dem Radius und aus dem Durchmesser.', 'Ich berechne den Radius aus der Kreisfläche.', 'Ich berechne Flächen von Halbkreisen und Viertelkreisen.', 'Ich vergleiche runde Flächen in Sachaufgaben, zum Beispiel Pizzen.'],
    fachwoerter: [['Kreisfläche A', 'Der Flächeninhalt innerhalb der Kreislinie.'], ['Kreissektor', 'Ein „Tortenstück“ des Kreises zwischen zwei Radien.'], ['Halbkreis, Viertelkreis', 'Die Hälfte beziehungsweise ein Viertel eines Kreises.'], ['Quadratwurzel √', 'Die Zahl, die mit sich selbst multipliziert die gegebene Zahl ergibt: √49 = 7.']],
    diagnose: [
      { q: 'Wie groß ist ein Quadrat mit 6 cm Seitenlänge?', options: ['24 cm²', '36 cm²', '12 cm²', 'Weiß ich noch nicht'], answer: 1, why: '6 cm · 6 cm = 36 cm².', review: 'Flächeninhalt von Quadrat und Rechteck' },
      { q: 'Welche Zahl ist √64?', options: ['32', '8', '16', 'Weiß ich noch nicht'], answer: 1, why: '8 · 8 = 64, also √64 = 8.', review: 'Quadratzahlen und Quadratwurzeln' },
      { q: 'Ein Kreis hat den Radius 5 cm. Wie groß ist sein Umfang ungefähr?', options: ['15,7 cm', '78,5 cm', '31,4 cm', 'Weiß ich noch nicht'], answer: 2, why: 'u = 2 · π · 5 cm ≈ 31,4 cm.', review: 'Kreisumfang und die Zahl π (Modul 024)' },
      { q: 'Was ist 4,5²?', options: ['9', '20,25', '16,5', 'Weiß ich noch nicht'], answer: 1, why: '4,5 · 4,5 = 20,25.', review: 'Quadrieren von Dezimalzahlen' }],
    erklaerung:
      '<h3>1. Kreis zerlegen</h3><p>Zerlege einen Kreis wie eine Torte in viele gleich große Stücke (Sektoren). Lege die Stücke abwechselnd mit der Spitze nach oben und nach unten nebeneinander. Es entsteht fast ein <b>Rechteck</b>.</p>' + sectorSvg(16, 5, true) +
      '<ul><li>Die Höhe des Rechtecks ist der <b>Radius r</b>.</li><li>Die Länge ist der <b>halbe Umfang</b>: u : 2 = 2 · π · r : 2 = <b>π · r</b>.</li><li>Je mehr Stücke, desto genauer wird das Rechteck.</li></ul>' +
      '<p>Fläche des Rechtecks: Länge mal Breite = π · r · r = π · r².</p>' +
      '<div class="merk"><b>Merke:</b> Für die Fläche eines Kreises mit Radius r gilt<br><span class="big-math">A = π · r²</span><br>Zuerst r quadrieren, dann mit π multiplizieren.</div>' +
      '<h3>2. Achtung, Durchmesser!</h3><p>Ist der <b>Durchmesser</b> gegeben, halbierst du ihn zuerst. Beispiel: d = 10 cm, also r = 5 cm und A = π · 25 cm² ≈ 78,5 cm².</p><p class="note"><b>Typischer Fehler:</b> Wer d = 10 cm einsetzt, erhält π · 100 cm² ≈ 314,2 cm². Das ist <b>viermal</b> zu viel, denn (2 · r)² = 4 · r².</p>' +
      '<h3>3. Halbkreis und Viertelkreis</h3><p>Halbkreis: A = π · r² : 2. Viertelkreis: A = π · r² : 4.</p>' +
      '<h3>4. Rückwärts: Radius aus der Fläche</h3><p>Aus A = π · r² folgt r² = A : π und damit <b>r = √(A : π)</b>. Beispiel: A = 50 cm², r² = 50 : π ≈ 15,92, r ≈ 3,99 cm, also r ≈ 4,0 cm.</p>' +
      '<p class="note"><b>Überschlag:</b> Mit π ≈ 3 ist die Kreisfläche gut dreimal so groß wie r². Bei r = 4 cm sind das etwas mehr als 48 cm².</p>',
    entdecken: {
      html: '<p>Zerlege den Kreis in Sektoren und lege sie um. Verändere die Anzahl der Stücke und den Radius.</p><div class="ctl"><label>Anzahl Sektoren = <b id="v_n"></b> <input type="range" id="r_n" min="4" max="32" step="4" value="8"></label><label>Radius r = <b id="v_r"></b> <input type="range" id="r_r" min="2" max="5" step="0.5" value="3"></label></div>' +
        '<div id="e_g"></div><div id="e_t"></div><p class="note">Was passiert mit der umgelegten Figur, wenn du sehr viele Sektoren nimmst? Wie lang und wie hoch ist das „Rechteck“ dann?</p>',
      init: function (root, done) {
        var n = 0, N = root.querySelector('#r_n'), R = root.querySelector('#r_r');
        function draw() {
          var k = +N.value, r = +R.value, tri = k / 2 * r * r * Math.sin(2 * PI / k);
          root.querySelector('#v_n').textContent = k; root.querySelector('#v_r').textContent = f(r) + ' cm';
          root.querySelector('#e_g').innerHTML = sectorSvg(k, r);
          root.querySelector('#e_t').innerHTML = '<p>Länge ≈ π · r = π · ' + f(r) + ' ≈ ' + f2(r2(PI * r)) + ' cm, Höhe ≈ r = ' + f(r) + ' cm.</p><p class="big-math">A ≈ π · r · r = π · ' + f(r) + '² ≈ ' + f2(r2(PI * r * r)) + ' cm²</p>' +
            '<p class="note">Ersetzt man jedes Stück durch ein Dreieck, erhält man zusammen ' + f2(r2(tri)) + ' cm². Das sind ' + f1(r1(tri / (PI * r * r) * 100)) + ' % der Kreisfläche.</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Gut beobachtet: Je mehr Sektoren, desto mehr gleicht die Figur einem Rechteck mit der Länge π · r und der Höhe r. Darum gilt A = π · r · r = π · r².'); }
        N.addEventListener('input', hit); R.addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Pizza-Vergleich', q: 'Kleine Pizza: d = 26 cm für 6,50 €. Große Pizza: d = 36 cm für 11 €. Welche ist günstiger pro cm²?',
      steps: ['Radien bestimmen: r = 26 cm : 2 = 13 cm und r = 36 cm : 2 = 18 cm. Nicht den Durchmesser einsetzen!', 'Flächen: π · 13² = π · 169 ≈ 531 cm² und π · 18² = π · 324 ≈ 1 018 cm².', 'Preis für 100 cm²: 6,50 € : 531 · 100 ≈ 1,22 € und 11 € : 1 018 · 100 ≈ 1,08 €.', 'Die große Pizza hat fast die doppelte Fläche (1 018 : 531 ≈ 1,9), kostet aber weniger als das Doppelte.', 'Antwort: Die große Pizza ist pro cm² günstiger. Kontrolle mit Überschlag: 3 · 169 ≈ 507 und 3 · 324 ≈ 972, das passt zu den Flächen.'] },
    tasks: { gen: gen, plan: { G: ['ueberschlag:1', 'flaecheR:1', 'flaecheD:1', 'teil:1'], S: ['flaecheR:1', 'flaecheD:2', 'radiusAusA:2', 'teil:2', 'pizza:2'], E: ['flaecheD:2', 'radiusAusA:2', 'teil:2', 'faktor:2', 'ausU:3', 'verschnitt:3'] },
      extra: 'stanzen', test: ['flaecheR:1', 'flaecheD:2', 'radiusAusA:2', 'teil:2', 'pizza:2', 'faktor:2'] },
    lerncheck: ['Ich kann erklären, wie man die Formel A = π · r² durch Zerlegen findet.', 'Ich berechne Kreisflächen und setze dabei immer den Radius ein.', 'Ich berechne den Radius aus der Fläche.', 'Ich löse Sachaufgaben mit Kreisflächen, Halbkreisen und Viertelkreisen.']
  };
})();
