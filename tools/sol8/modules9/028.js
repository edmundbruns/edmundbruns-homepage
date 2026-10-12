/* Modul 028 (Klasse 9) · Daten und Grafiken in Medien beurteilen */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  function n(x) { return M.fmtNum(Math.round(x * 1e6) / 1e6); }
  function r1(x) { return Math.round(x * 10) / 10; }
  function f1(x) { return Math.round(x * 10) / 10; }
  var COLS = ['#1d4ed8', '#0f766e', '#d97706', '#64748b'];
  function mcOpts(right, wrong) { var all = M.shuffle([right].concat(wrong)); return { options: all, answer: all.indexOf(right) }; }

  /* ---------- Zeichnungen ---------- */
  /* Säulendiagramm; ymin > 0 bedeutet abgeschnittene Hochachse */
  function bars(vals, names, ymin, ymax, step, unit, o) {
    o = o || {}; var x0 = 62, x1 = 330, yb = 196, yt = 24;
    function Y(v) { return f1(yb - (v - ymin) / (ymax - ymin) * (yb - yt)); }
    var g = '<svg class="viz" viewBox="0 0 350 ' + (o.title ? 250 : 232) + '" role="img" aria-label="Säulendiagramm" style="max-width:' + (o.maxw || 380) + 'px">';
    var lstep = (ymax - ymin) / step > 8 ? 2 * step : step;
    for (var v = ymin; v <= ymax + 1e-9; v += step) g += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="#dbe4f5"/>' + (Math.round((v - ymin) / lstep * 1e6) % 1e6 === 0 ? '<text x="' + (x0 - 6) + '" y="' + (Y(v) + 4) + '" font-size="12" text-anchor="end" fill="#475569">' + n(v) + (unit ? ' ' + unit : '') + '</text>' : '');
    g += '<line x1="' + x0 + '" y1="' + yt + '" x2="' + x0 + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + yb + '" x2="' + x1 + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.5"/>';
    if (ymin > 0 && o.zigzag) g += '<path d="M' + (x0 - 7) + ' ' + (yb - 10) + ' l14 -5 m-14 11 l14 -5" stroke="#d97706" stroke-width="2"/>';
    var bw = Math.min(70, (x1 - x0) / vals.length * 0.6), gap = (x1 - x0 - vals.length * bw) / (vals.length + 1);
    vals.forEach(function (val, i) {
      var bx = x0 + gap + i * (bw + gap);
      g += '<rect x="' + f1(bx) + '" y="' + Y(val) + '" width="' + f1(bw) + '" height="' + f1(yb - Y(val)) + '" fill="' + COLS[i % 4] + '"/><text x="' + f1(bx + bw / 2) + '" y="' + (Y(val) - 6) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830">' + n(val) + (unit ? ' ' + unit : '') + '</text><text x="' + f1(bx + bw / 2) + '" y="' + (yb + 18) + '" font-size="13" text-anchor="middle" fill="#1c1830">' + names[i] + '</text>';
    });
    if (o.title) g += '<text x="190" y="242" font-size="12" text-anchor="middle" fill="#475569">' + o.title + '</text>';
    return g + '</svg>';
  }
  /* zwei Münzen als Piktogramm: Durchmesser im Verhältnis k */
  function coins(v1, v2, k, lab1, lab2, unit) {
    var r = 30, R = r * k, W = 40 + 2 * r + 40 + 2 * R + 20, H = 2 * R + 60, cy = 20 + R;
    function coin(cx, rr, val, lab) { return '<circle cx="' + f1(cx) + '" cy="' + f1(cy + R - rr) + '" r="' + f1(rr) + '" fill="#fde68a" stroke="#b45309" stroke-width="3"/><text x="' + f1(cx) + '" y="' + f1(cy + R - rr + rr * 0.3) + '" font-size="' + f1(rr * 0.8) + '" font-weight="700" text-anchor="middle" fill="#92400e">' + unit + '</text><text x="' + f1(cx) + '" y="' + f1(cy + R + 22) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830">' + lab + ': ' + n(val) + ' ' + unit + '</text>'; }
    return '<svg class="viz" viewBox="0 0 ' + f1(W) + ' ' + f1(H) + '" role="img" aria-label="Piktogramm mit zwei Münzen" style="max-width:' + Math.round(Math.min(420, W * 1.1)) + 'px">' + coin(40 + r, r, v1, lab1) + coin(40 + 2 * r + 40 + R, R, v2, lab2) + '</svg>';
  }
  /* 3D-Kreisdiagramm: items [{name, v}] in Reihenfolge, Startwinkel so, dass item 0 vorne liegt */
  function pie3d(items, showNums) {
    var cx = 170, cy = 100, rx = 140, ry = 58, dep = 26, tot = 0; items.forEach(function (it) { tot += it.v; });
    var a0 = 90 - items[0].v / tot * 180, g = '<svg class="viz" viewBox="0 0 340 210" role="img" aria-label="3D-Kreisdiagramm" style="max-width:420px">', side = '', topS = '', labs = '';
    function P(deg, dy) { var t = deg * Math.PI / 180; return f1(cx + rx * Math.cos(t)) + ' ' + f1(cy + ry * Math.sin(t) + (dy || 0)); }
    var DARK = ['#1e3a8a', '#115e59', '#92400e', '#334155'];
    items.forEach(function (it, i) {
      var s = a0, e = a0 + it.v / tot * 360; a0 = e;
      /* Seitenwand nur im vorderen Bereich (0° bis 180°, auch +360) */
      [[0, 180], [360, 540]].forEach(function (w) { var a = Math.max(s, w[0]), b = Math.min(e, w[1]); if (b > a) { var pts = []; for (var d = a; d <= b + 1e-9; d += Math.max(1, (b - a) / 30)) pts.push(P(d)); var back = []; for (var d2 = b; d2 >= a - 1e-9; d2 -= Math.max(1, (b - a) / 30)) back.push(P(d2, dep)); side += '<path d="M' + pts.join(' L') + ' L' + back.join(' L') + ' Z" fill="' + DARK[i % 4] + '" stroke="#fff" stroke-width="1"/>'; } });
      var arc = []; for (var d = s; d <= e + 1e-9; d += Math.max(1, (e - s) / 40)) arc.push(P(d));
      topS += '<path d="M' + cx + ' ' + cy + ' L' + arc.join(' L') + ' Z" fill="' + COLS[i % 4] + '" stroke="#fff" stroke-width="1.5"/>';
      var m = (s + e) / 2, t = m * Math.PI / 180;
      labs += '<text x="' + f1(cx + rx * 0.6 * Math.cos(t)) + '" y="' + f1(cy + ry * 0.6 * Math.sin(t) + 5) + '" font-size="14" font-weight="700" text-anchor="middle" fill="#fff">' + it.name + (showNums ? ' ' + it.v + ' %' : '') + '</text>';
    });
    return g + side + topS + labs + '</svg>';
  }
  function pie2d(items) {
    var cx = 110, cy = 110, R = 95, a0 = -items[0].v / 100 * 180 + 90, g = '<svg class="viz" viewBox="0 0 220 220" role="img" aria-label="Kreisdiagramm von oben" style="max-width:240px">', labs = '';
    items.forEach(function (it, i) {
      var s = a0, e = a0 + it.v * 3.6; a0 = e;
      var p0 = [cx + R * Math.cos(s * Math.PI / 180), cy + R * Math.sin(s * Math.PI / 180)], p1 = [cx + R * Math.cos(e * Math.PI / 180), cy + R * Math.sin(e * Math.PI / 180)];
      g += '<path d="M' + cx + ' ' + cy + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + R + ' ' + R + ' 0 ' + (e - s > 180 ? 1 : 0) + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z" fill="' + COLS[i % 4] + '" stroke="#fff" stroke-width="2"/>';
      var m = (s + e) / 2 * Math.PI / 180; labs += '<text x="' + f1(cx + R * 0.6 * Math.cos(m)) + '" y="' + f1(cy + R * 0.6 * Math.sin(m) + 5) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#fff">' + it.name + ' ' + it.v + ' %</text>';
    });
    return g + labs + '</svg>';
  }
  /* Streudiagramm */
  function scatter(pts, xl, yl) {
    var x0 = 50, x1 = 330, y0 = 200, y1 = 20, g = '<svg class="viz" viewBox="0 0 350 240" role="img" aria-label="Streudiagramm" style="max-width:380px">';
    g += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" stroke="#1c1830" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + y1 + '" stroke="#1c1830" stroke-width="1.5"/>';
    pts.forEach(function (p) { g += '<circle cx="' + f1(x0 + p[0] * (x1 - x0)) + '" cy="' + f1(y0 - p[1] * (y0 - y1)) + '" r="5" fill="#1d4ed8" fill-opacity="0.8"/>'; });
    g += '<text x="' + ((x0 + x1) / 2) + '" y="226" font-size="13" text-anchor="middle" font-weight="700">' + xl + ' →</text><text x="20" y="' + ((y0 + y1) / 2) + '" font-size="13" text-anchor="middle" font-weight="700" transform="rotate(-90 20 ' + ((y0 + y1) / 2) + ')">' + yl + ' →</text>';
    return g + '</svg>';
  }
  function cloud() { var p = []; for (var i = 0; i < 14; i++) { var x = 0.05 + 0.9 * i / 13; p.push([x, Math.max(0.03, Math.min(0.97, 0.1 + 0.8 * x + (Math.random() - 0.5) * 0.25))]); } return p; }

  /* Daten mit abgeschnittener Achse */
  var CUT = [['Mitglieder im Sportverein', ['2023', '2024'], ''], ['Besucher im Freibad (in Tausend)', ['Juni', 'Juli'], ''], ['Preis für ein Schulheft', ['2024', '2025'], 'ct'], ['Zustimmung zur Mensa', ['Klasse 9a', 'Klasse 9b'], '%'], ['Verkaufte Fahrräder', ['Händler A', 'Händler B'], '']];
  function cutData() {
    var c = M.pick(CUT), A = M.rnd(40, 90), d = M.rnd(2, 7) * (Math.random() < 0.8 ? 1 : -1), B = A + d, lo = Math.min(A, B), hi = Math.max(A, B);
    var ymin = Math.floor((lo - M.rnd(2, 4)) / 5) * 5; if (lo - ymin < 2) ymin -= 5; var ymax = Math.ceil((hi + 2) / 5) * 5;
    return { c: c, A: A, B: B, ymin: ymin, ymax: ymax, vis: (B - ymin) / (A - ymin), pct: r1((B - A) / A * 100) };
  }

  var STICH = [
    ['Eine Zeitschrift für Gamer fragt ihre Leserinnen und Leser online, wie viele Stunden sie pro Woche spielen. Schlagzeile: „Jugendliche zocken im Schnitt 20 Stunden pro Woche!“', 'Befragt wurden nur Leser einer Gaming-Zeitschrift. Sie spielen vermutlich mehr als andere Jugendliche.'],
    ['Tim will wissen, wie sportlich die Menschen in seiner Stadt sind. Er befragt 60 Personen vor einem Fitnessstudio. 85 % sagen, sie treiben mehrmals pro Woche Sport.', 'Vor einem Fitnessstudio trifft man vor allem sportliche Menschen. Die Stichprobe ist einseitig.'],
    ['Die Schülervertretung fragt mittags in der Mensa: „Schmeckt dir das Mensaessen?“ 90 % antworten mit Ja.', 'Befragt wurden nur Personen, die in der Mensa essen. Wem es nicht schmeckt, isst wahrscheinlich woanders.'],
    ['Ein Radiosender ruft auf: „Rufen Sie an und sagen Sie uns Ihre Meinung zum neuen Tempolimit!“ 70 % der Anrufer sind dagegen.', 'Es rufen vor allem Menschen an, die eine starke Meinung haben. Die Teilnahme war freiwillig, das verzerrt das Ergebnis.'],
    ['Lea möchte wissen, welche Musik an ihrer Schule am beliebtesten ist. Sie fragt ihre fünf besten Freundinnen. Vier davon mögen K-Pop.', 'Fünf Freundinnen sind zu wenige und nicht zufällig ausgewählt. Sie haben oft einen ähnlichen Geschmack.'],
    ['Ein Hersteller von Energydrinks befragt Besucher eines Skate-Contests, den er selbst sponsert: „92 % finden unseren Drink super!“', 'Befragt wurden Fans einer Veranstaltung, die der Hersteller selbst bezahlt. Sie sind nicht typisch für alle Menschen.']];
  var STICH_W = ['Die Umfrage ist aussagekräftig, weil die Ergebnisse in Prozent angegeben sind.', 'Das Ergebnis ist falsch, weil man immer alle Menschen befragen muss.', 'Die Umfrage ist in Ordnung, denn jeder durfte frei antworten.', 'Das Ergebnis stimmt sicher, weil die Zahl so deutlich ist.'];
  var KORR = [
    ['In einem Sommer steigen an manchen Tagen sowohl der Eisverkauf als auch die Zahl der Sonnenbrände.', 'Eisverkauf', 'Sonnenbrände', 'Sonnenschein und Hitze', 'Eis essen verursacht Sonnenbrand.'],
    ['Je mehr Feuerwehrleute an einem Brand im Einsatz sind, desto größer ist meist der Schaden.', 'Feuerwehrleute', 'Schaden in €', 'die Größe des Brandes', 'Die Feuerwehrleute verursachen den Schaden.'],
    ['Grundschulkinder mit größeren Füßen können im Durchschnitt besser lesen.', 'Schuhgröße', 'Lesefähigkeit', 'das Alter der Kinder', 'Große Füße machen schlauer.'],
    ['In Gegenden mit mehr Störchen werden auch mehr Kinder geboren.', 'Anzahl Störche', 'Geburten', 'die Größe und ländliche Lage der Gegend', 'Störche bringen die Babys.'],
    ['An Tagen mit mehr verkauften Regenschirmen gibt es mehr Verkehrsunfälle.', 'Regenschirme', 'Unfälle', 'Regenwetter', 'Regenschirme lenken Autofahrer ab und verursachen Unfälle.']];

  var gen = {
    achse: function () {
      var D = cutData(), o = mcOpts('Die Hochachse beginnt nicht bei 0. Dadurch wirkt der Unterschied viel größer, als er ist.', ['Das Diagramm ist korrekt. Die rechte Säule ist etwa ' + n(Math.round(Math.max(D.vis, 1 / D.vis))) + '-mal so groß wie die linke.', 'Die Säulen müssten verschiedene Farben haben, sonst ist es irreführend.', 'Die Werte über den Säulen sind falsch.']);
      return { skill: 'Abgeschnittene Achse erkennen', level: 1, q: 'In einer Zeitung erscheint dieses Diagramm zum Thema „' + D.c[0] + '“.' + bars([D.A, D.B], D.c[1], D.ymin, D.ymax, 5, D.c[2]) + 'Was ist an dem Diagramm irreführend?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Schau dir die Hochachse genau an. Bei welcher Zahl beginnt sie?', 'Die Achse beginnt bei ' + n(D.ymin) + '. Die Säulen zeigen also nur den Teil über ' + n(D.ymin) + '.', 'Vergleiche die Zahlen: ' + n(D.A) + ' und ' + n(D.B) + ' liegen nah beieinander, die Säulen sehen aber sehr verschieden aus.'],
        solution: 'Die Hochachse beginnt bei ' + n(D.ymin) + ' statt bei 0. Die Säulen wirken deshalb sehr verschieden, obwohl ' + n(D.A) + ' und ' + n(D.B) + ' nur um ' + n(Math.abs(D.B - D.A)) + ' auseinanderliegen. Richtig gezeichnet:' + bars([D.A, D.B], D.c[1], 0, D.ymax, D.ymax > 50 ? 10 : 5, D.c[2]),
        verify: function () { return D.ymin > 0 && D.ymin < Math.min(D.A, D.B) || 'Achse falsch'; } };
    },
    veraenderung: function (lvl) {
      var D = cutData(), up = D.B > D.A;
      var inputs = [{ kind: 'num', answer: D.pct, tol: 0.05, label: 'tatsächliche Veränderung', unit: '%', placeholder: 'auf 1 Stelle, Abnahme negativ' }];
      if (lvl === 3) inputs.push({ kind: 'num', answer: r1(D.vis), tol: 0.05, label: 'Die rechte Säule ist im Bild …-mal so hoch', placeholder: 'auf 1 Stelle' });
      return { skill: 'Tatsächliche Veränderung in Prozent', q: 'Das Diagramm zeigt „' + D.c[0] + '“.' + bars([D.A, D.B], D.c[1], D.ymin, D.ymax, 5, D.c[2]) + 'Um wie viel Prozent hat sich der Wert von ' + D.c[1][0] + ' zu ' + D.c[1][1] + ' <b>tatsächlich</b> verändert? Runde auf eine Stelle nach dem Komma. Gib eine Abnahme mit Minus an.' + (lvl === 3 ? '<br>Wie viel Mal so hoch ist die rechte Säule im Bild (gemessen ab der unteren Achse bei ' + n(D.ymin) + ')?' : ''),
        inputs: inputs,
        hints: ['Lies die Werte ab: ' + n(D.A) + ' und ' + n(D.B) + '. Die Säulenhöhen im Bild zählen nicht.', 'Veränderung = ' + n(D.B) + ' − ' + n(D.A) + ' = ' + n(D.B - D.A) + '. Teile durch den Grundwert ' + n(D.A) + '.', n(D.B - D.A) + ' : ' + n(D.A) + ' ≈ ' + n(Math.round((D.B - D.A) / D.A * 10000) / 10000) + ', also etwa ' + n(D.pct) + ' %.' + (lvl === 3 ? ' Im Bild: (' + n(D.B) + ' − ' + n(D.ymin) + ') : (' + n(D.A) + ' − ' + n(D.ymin) + ').' : '')],
        solution: 'Veränderung: ' + n(D.B) + ' − ' + n(D.A) + ' = ' + n(D.B - D.A) + '. Prozentsatz: ' + n(D.B - D.A) + ' : ' + n(D.A) + ' · 100 % ≈ <b>' + n(D.pct) + ' %</b>.' + (lvl === 3 ? '<br>Im Bild sind die Säulen ' + n(D.A - D.ymin) + ' und ' + n(D.B - D.ymin) + ' Einheiten hoch: ' + n(D.B - D.ymin) + ' : ' + n(D.A - D.ymin) + ' ≈ <b>' + n(r1(D.vis)) + '</b>. Das Bild übertreibt also stark.' : ' Das ist viel weniger, als das Bild vermuten lässt.'),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === null) return null; if (Math.abs(a - (D.B - D.A)) < 0.05) return 'Das ist der Unterschied in ' + (D.c[2] || 'Einheiten') + ', nicht in Prozent. Teile noch durch den Grundwert ' + n(D.A) + '.'; if (Math.abs(a - r1((D.B - D.A) / D.B * 100)) < 0.05) return 'Der Grundwert ist der alte Wert ' + n(D.A) + ', nicht ' + n(D.B) + '.'; if (Math.abs(a + D.pct) < 0.05) return 'Achte auf das Vorzeichen: Bei einer Abnahme ist die Veränderung negativ.'; if (Math.abs(a - r1((D.vis - 1) * 100)) < 0.5) return 'Das ist die Veränderung im Bild. Rechne mit den echten Werten ' + n(D.A) + ' und ' + n(D.B) + '.'; return null; },
        verify: function () { return Math.abs(D.A * (1 + D.pct / 100) - D.B) < D.A * 0.0006 || 'Prozent falsch'; } };
    },
    piktogramm: function (lvl) {
      var k = M.pick([2, 2, 3, 1.5]), v1 = M.pick([10, 20, 40, 50]), v2 = v1 * k, s = M.pick([['Taschengeld 2015', 'Taschengeld 2025'], ['Spenden 2023', 'Spenden 2025'], ['Gewinn Firma A', 'Gewinn Firma B']]);
      var o = mcOpts('Der Wert ist nur ' + n(k) + '-mal so groß, die Münze wirkt aber ' + n(k * k) + '-mal so groß.', ['Die Darstellung ist korrekt, weil der Durchmesser stimmt.', 'Der Wert ist ' + n(k * k) + '-mal so groß, weil die Fläche ' + n(k * k) + '-mal so groß ist.', 'Die große Münze müsste ' + n(k * k) + '-mal so breit sein.']);
      return { skill: 'Verzerrte Piktogramme', q: 'Ein Magazin vergleicht zwei Werte mit Münzen. Die rechte Münze ist ' + n(k) + '-mal so breit und ' + n(k) + '-mal so hoch wie die linke.' + coins(v1, v2, k, s[0].split(' ').slice(-1)[0], s[1].split(' ').slice(-1)[0], '€') + '<small>Links: ' + s[0] + ', rechts: ' + s[1] + '.</small><br>a) Wie viel Mal so groß ist die <b>Fläche</b> der rechten Münze?<br>b) Welche Aussage stimmt?',
        inputs: [{ kind: 'num', answer: k * k, tol: 0.01, label: 'a) Die Fläche ist …-mal so groß' }, { kind: 'mc', label: 'b) Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Wird eine Figur in Breite <b>und</b> Höhe mit ' + n(k) + ' vergrößert, wächst die Fläche mit ' + n(k) + ' · ' + n(k) + '.', 'Fläche: ' + n(k) + ' · ' + n(k) + ' = ' + n(k * k) + '. Unser Auge vergleicht Flächen.', 'Der Wert ist aber nur von ' + n(v1) + ' € auf ' + n(v2) + ' € gestiegen, also ' + n(k) + '-mal so groß.'],
        solution: 'a) Fläche: ' + n(k) + ' · ' + n(k) + ' = <b>' + n(k * k) + '</b>. b) Der Wert ist nur ' + n(k) + '-mal so groß (' + n(v1) + ' € → ' + n(v2) + ' €). Das Bild übertreibt, weil die Münze in beiden Richtungen vergrößert wurde. Ehrlich wäre eine Münze mit ' + n(k) + '-facher Fläche oder ein Säulendiagramm.',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && Math.abs(a - k) < 0.01) return 'Das ist das Verhältnis der Breiten. Bei der Fläche wird Breite mal Höhe gerechnet.'; if (a !== null && Math.abs(a - 2 * k) < 0.01) return 'Nicht verdoppeln: Die Fläche wächst mit ' + n(k) + ' · ' + n(k) + '.'; return null; },
        verify: function () { return Math.abs(Math.pow(30 * k, 2) * Math.PI / (Math.pow(30, 2) * Math.PI) - k * k) < 1e-9 && v2 / v1 === k || 'Faktor falsch'; } };
    },
    torte3d: function () {
      var p = M.pick([15, 20, 30]), q = (100 - 2 * p) / 2, r = q;
      var items = [{ name: 'A', v: p }, { name: 'C', v: q }, { name: 'B', v: p }, { name: 'D', v: r }];
      var o = mcOpts('A und B sind gleich groß. A liegt vorne, durch die Schrägansicht und die sichtbare Seitenwand wirkt A größer.', ['A ist größer als B, das sieht man deutlich.', 'B ist größer als A, weil B weiter hinten liegt.', 'Bei 3D-Diagrammen kann man die Anteile genauer ablesen als bei flachen Diagrammen.']);
      return { skill: '3D-Kreisdiagramme beurteilen', level: 1, q: 'Eine Werbung zeigt die Umfrage „Welche Marke kaufst du?“ als 3D-Kreisdiagramm. Die Anteile von A und B betragen jeweils <b>' + p + ' %</b>.' + pie3d(items, false) + 'Welche Aussage ist richtig?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Lies die Angaben im Text: A und B haben jeweils ' + p + ' %.', 'Der vordere Teil eines schräg gezeigten Kreises wird größer dargestellt und bekommt zusätzlich eine Seitenwand.', 'Für einen fairen Vergleich zeichnet man Kreisdiagramme flach von oben.'],
        solution: 'A und B haben beide ' + p + ' %. In der 3D-Ansicht liegt A vorne. Vorne wirkt alles größer und die Seitenwand vergrößert die sichtbare Fläche zusätzlich. 3D-Kreisdiagramme verzerren deshalb die Anteile. Flach sieht es so aus: A und B sind gleich groß.' + pie2d(items),
        verify: function () { return items.reduce(function (s, it) { return s + it.v; }, 0) === 100 && r > 0 || 'Summe ≠ 100'; } };
    },
    stichprobe: function () {
      var s = M.pick(STICH), o = mcOpts(s[1], M.shuffle(STICH_W).slice(0, 3));
      return { skill: 'Nicht repräsentative Stichproben', level: 1, q: s[0] + '<br><b>Warum ist das Ergebnis nicht aussagekräftig für alle?</b>',
        inputs: [{ kind: 'mc', label: 'Wähle die beste Begründung', options: o.options, answer: o.answer }],
        hints: ['Überlege: <b>Wer</b> wurde befragt? Ist diese Gruppe typisch für alle?', 'Eine gute Stichprobe ist groß genug und zufällig ausgewählt. Sie spiegelt die Gesamtheit wider.', 'Prozentzahlen allein machen eine Umfrage nicht richtig. Entscheidend ist, wer befragt wurde.'],
        solution: s[1] + ' Man nennt die Stichprobe <b>nicht repräsentativ</b>. Besser wäre es, zufällig ausgewählte Personen aus der ganzen Gruppe zu befragen.',
        verify: function () { return STICH_W.indexOf(s[1]) < 0 || 'Doppelt'; } };
    },
    korrelation: function () {
      var s = M.pick(KORR), o = mcOpts('Beide Größen hängen von einer dritten Größe ab: ' + s[3] + '. Eine Ursache folgt daraus nicht.', [s[4], 'Es gibt keinen Zusammenhang, das Diagramm muss falsch sein.', 'Wenn zwei Größen gemeinsam steigen, ist immer die eine die Ursache der anderen.']);
      return { skill: 'Korrelation ist nicht Ursache', level: 1, q: s[0] + scatter(cloud(), s[1], s[2]) + 'Wie lässt sich der Zusammenhang am besten erklären?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Im Diagramm steigen beide Größen gemeinsam. Das nennt man einen <b>Zusammenhang</b> (Korrelation).', 'Frage dich: Kann die eine Größe die andere wirklich bewirken? Oder gibt es etwas, das beide beeinflusst?', 'Denke an ' + s[3] + '.'],
        solution: 'Beide Größen steigen gemeinsam, weil sie von <b>' + s[3] + '</b> abhängen. Die Aussage „' + s[4] + '“ ist ein Fehlschluss. Merke: Ein Zusammenhang (Korrelation) beweist keine Ursache (Kausalität).',
        verify: function () { return o.options.length === 4 || 'Optionen'; } };
    },
    relabs: function (lvl) {
      var EA = M.pick([80, 100, 120, 150, 200]) * 1000, EB = M.pick([20, 25, 40, 50]) * 1000, rA, rB, UA, UB;
      do { rA = M.pick([1.5, 2, 2.5, 3, 3.5, 4]); rB = M.pick([2, 3, 4, 5, 6, 7.5]); UA = rA * EA / 1000; UB = rB * EB / 1000; } while (rA >= rB || UA <= UB || UA % 1 || UB % 1);
      var o = mcOpts('In Stadt B ist das Risiko pro Einwohner höher.', ['In Stadt A ist das Risiko pro Einwohner höher.', 'Das Risiko ist in beiden Städten gleich.']);
      return { skill: 'Relative und absolute Zahlen', q: 'Eine Zeitung titelt: „<b>Stadt A ist die gefährlichste Stadt für Radfahrer!</b>“ Im letzten Jahr gab es in Stadt A (' + n(EA) + ' Einwohner) ' + n(UA) + ' Fahrradunfälle, in Stadt B (' + n(EB) + ' Einwohner) ' + n(UB) + '.<br>a) Berechne für beide Städte die Unfälle pro 1 000 Einwohner.<br>b) Was ist richtig?',
        inputs: [{ kind: 'num', answer: rA, tol: 0.01, label: 'a) Stadt A: Unfälle pro 1 000 Einwohner' }, { kind: 'num', answer: rB, tol: 0.01, label: 'a) Stadt B: Unfälle pro 1 000 Einwohner' }, { kind: 'mc', label: 'b) Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Absolute Zahlen allein sagen wenig, wenn die Städte verschieden groß sind. Rechne um auf 1 000 Einwohner.', 'Stadt A hat ' + n(EA / 1000) + '-mal 1 000 Einwohner. Also ' + n(UA) + ' : ' + n(EA / 1000) + '.', 'Stadt B: ' + n(UB) + ' : ' + n(EB / 1000) + '. Vergleiche dann die beiden Werte.'],
        solution: 'A: ' + n(UA) + ' : ' + n(EA / 1000) + ' = <b>' + n(rA) + '</b> Unfälle pro 1 000 Einwohner. B: ' + n(UB) + ' : ' + n(EB / 1000) + ' = <b>' + n(rB) + '</b>. ' + (rB > rA ? 'In Stadt B ist das Risiko pro Einwohner <b>höher</b>, obwohl dort absolut weniger Unfälle passieren. Die Schlagzeile ist irreführend.' : 'In Stadt A ist das Risiko auch pro Einwohner höher.'),
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a !== null && Math.abs(a - UA / EA * 100) < 0.01) return 'Das ist der Anteil in Prozent (pro 100). Gefragt ist pro 1 000 Einwohner.'; return null; },
        verify: function () { var ok = Math.abs(UA / EA * 1000 - rA) < 1e-9 && Math.abs(UB / EB * 1000 - rB) < 1e-9; if (!ok) return 'Rate falsch'; var ans = rB > rA ? 'In Stadt B ist das Risiko pro Einwohner höher.' : 'In Stadt A ist das Risiko pro Einwohner höher.'; return o.options[o.answer] === ans || 'MC falsch'; } };
    },
    prozentpunkte: function (lvl) {
      var a, b; do { a = M.rnd(4, 40); b = a + M.nz(-8, 10); } while (b <= 0 || Math.abs(b - a) < 2);
      var pp = b - a, pc = r1((b - a) / a * 100), ctx = M.pick([['Eine Partei', 'Wahlergebnis', 'steigt von'], ['Der Anteil der Radfahrer am Schulweg', 'Anteil', 'ändert sich von'], ['Der Marktanteil einer Handymarke', 'Marktanteil', 'ändert sich von']]);
      return { skill: 'Prozentpunkte und Prozent', q: ctx[0] + ' ' + (b > a && ctx[2] === 'steigt von' ? 'kommt nach ' + a + ' % jetzt auf ' + b + ' %.' : ctx[2] + ' ' + a + ' % auf ' + b + ' %.') + '<br>a) Um wie viele <b>Prozentpunkte</b> hat sich der Wert verändert?<br>b) Um wie viel <b>Prozent</b> hat er sich verändert? Runde auf eine Stelle. Gib Abnahmen mit Minus an.',
        inputs: [{ kind: 'num', answer: pp, label: 'a) Veränderung', unit: 'Prozentpunkte' }, { kind: 'num', answer: pc, tol: 0.05, label: 'b) Veränderung', unit: '%' }],
        hints: ['Prozentpunkte: einfach die Differenz der beiden Prozentzahlen: ' + b + ' − ' + a + '.', 'Prozent: Die Differenz ' + n(pp) + ' wird auf den alten Wert ' + a + ' bezogen: ' + n(pp) + ' : ' + a + '.', n(pp) + ' : ' + a + ' ≈ ' + n(Math.round(pp / a * 10000) / 10000) + ', also etwa ' + n(pc) + ' %.'],
        solution: 'a) ' + b + ' % − ' + a + ' % = <b>' + n(pp) + ' Prozentpunkte</b>. b) ' + n(pp) + ' : ' + a + ' · 100 % ≈ <b>' + n(pc) + ' %</b>. Beide Angaben sind richtig, sie wirken aber sehr verschieden. Achte in Nachrichten darauf, welche gemeint ist.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x !== null && y !== null && Math.abs(x - pc) < 0.06 && Math.abs(y - pp) < 0.01 && pp !== pc) return 'Du hast Prozentpunkte und Prozent vertauscht. Prozentpunkte sind die einfache Differenz.'; if (y !== null && Math.abs(y - r1(pp / b * 100)) < 0.05) return 'Grundwert ist der alte Wert ' + a + ' %, nicht der neue.'; return null; },
        verify: function () { return Math.abs(a * (1 + pc / 100) - b) < a * 0.0006 || 'falsch'; } };
    },
    risiko: function () {
      var a = M.pick([4, 5, 8, 10, 20]), f = M.pick([0.5, 0.25, 0.75, 0.4, 0.2]), b = a * f, red = Math.round((1 - f) * 100), abs = (a - b) / 10;
      if (b % 1) return gen.risiko();
      var o = mcOpts('Ohne Medikament erkranken ' + a + ' von 1 000, mit Medikament ' + n(b) + ' von 1 000. Das sind ' + n(a - b) + ' Erkrankungen weniger pro 1 000 Personen.', ['Durch das Medikament erkranken ' + red + ' % weniger Menschen insgesamt, also ' + red + ' von 100 Personen.', 'Mit dem Medikament wird praktisch niemand mehr krank.', 'Das Risiko sinkt von ' + red + ' % auf 0 %.']);
      return { skill: 'Relatives und absolutes Risiko', level: 3, q: 'Werbung: „<b>Unser Medikament senkt das Erkrankungsrisiko um ' + red + ' %!</b>“ In einer Studie erkrankten ohne Medikament ' + a + ' von 1 000 Personen, mit Medikament ' + n(b) + ' von 1 000.<br>a) Um wie viel Prozent sinkt das Risiko relativ?<br>b) Um wie viele Prozentpunkte sinkt es (absolut)?<br>c) Welche Beschreibung ist ehrlich?',
        inputs: [{ kind: 'num', answer: red, tol: 0.05, label: 'a) relative Senkung', unit: '%' }, { kind: 'num', answer: abs, tol: 0.005, label: 'b) absolute Senkung', unit: 'Prozentpunkte' }, { kind: 'mc', label: 'c) Wähle aus', options: o.options, answer: o.answer }],
        hints: ['Relativ: Um wie viel ist ' + n(b) + ' kleiner als ' + a + '? Bezogen auf ' + a + ': (' + a + ' − ' + n(b) + ') : ' + a + '.', 'Absolut: Das Risiko ist ' + a + ' von 1 000 = ' + n(a / 10) + ' % bzw. ' + n(b) + ' von 1 000 = ' + n(b / 10) + ' %.', 'Die Differenz ' + n(a / 10) + ' % − ' + n(b / 10) + ' % ergibt die Prozentpunkte. Eine große relative Zahl kann eine kleine absolute Wirkung haben.'],
        solution: 'a) (' + a + ' − ' + n(b) + ') : ' + a + ' = ' + n((a - b) / a) + ' = <b>' + red + ' %</b>. b) ' + n(a / 10) + ' % − ' + n(b / 10) + ' % = <b>' + n(abs) + ' Prozentpunkte</b>. c) Ehrlich ist: ' + o.options[o.answer] + ' Die ' + red + ' % klingen viel, betreffen aber nur sehr wenige Menschen.',
        mistakes: function (v) { var x = M.parseNum(v[1]); if (x !== null && Math.abs(x - (a - b)) < 0.005) return 'Das sind Personen pro 1 000. In Prozent (pro 100) musst du noch durch 10 teilen.'; return null; },
        verify: function () { return Math.abs((a - b) / a * 100 - red) < 1e-9 && Math.abs(a / 1000 * 100 - b / 1000 * 100 - abs) < 1e-9 || 'Risiko falsch'; } };
    }
  };

  var DEMO = [['Mitglieder im Sportverein', ['2024', '2025'], 48, 52], ['Preis Schulheft (ct)', ['2024', '2025'], 90, 95], ['Besucher Freibad (Tsd.)', ['Juni', 'Juli'], 64, 60]];
  return {
    id: '028', title: 'Daten und Grafiken in Medien beurteilen', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Säulen- und Kreisdiagramme, Prozentrechnung, Umfragen auswerten',
    lead: 'Diagramme in Zeitungen und Werbung sollen überzeugen. Du lernst, typische Tricks zu durchschauen und selbst nachzurechnen.',
    einstieg: { html: '<p>In einem Werbeprospekt steht: „<b>Unsere Mitgliederzahl explodiert!</b>“ Dazu dieses Diagramm:</p>' + bars([48, 52], ['2024', '2025'], 46, 53, 1, '') + '<p class="note">Die Säule für 2025 ist fast dreimal so hoch. Ist der Verein wirklich so stark gewachsen? Rechne nach: Von 48 auf 52 Mitglieder sind es nur etwa 8 % mehr.</p><p>Grafiken können täuschen, auch wenn alle Zahlen stimmen. In diesem Modul lernst du die häufigsten Tricks kennen: abgeschnittene Achsen, verzerrte Bilder, 3D-Effekte, einseitige Umfragen, Prozent und Prozentpunkte sowie Zusammenhänge, die keine Ursache sind.</p>' },
    ziele: ['Ich erkenne abgeschnittene Achsen und berechne die tatsächliche Veränderung in Prozent.', 'Ich erkläre, warum vergrößerte Bilder und 3D-Diagramme täuschen.', 'Ich beurteile, ob eine Stichprobe repräsentativ ist.', 'Ich unterscheide absolute und relative Angaben sowie Prozent und Prozentpunkte.', 'Ich weiß, dass ein Zusammenhang (Korrelation) noch keine Ursache beweist.'],
    fachwoerter: [['Abgeschnittene Achse', 'Die Hochachse beginnt nicht bei 0. Unterschiede wirken dadurch größer.'], ['Repräsentative Stichprobe', 'Eine Auswahl, die die ganze Gruppe gut widerspiegelt: groß genug und zufällig gewählt.'], ['Prozentpunkte', 'Differenz zweier Prozentsätze: von 10 % auf 15 % sind es 5 Prozentpunkte, aber 50 % mehr.'], ['Relativ und absolut', 'Absolut: tatsächliche Anzahl. Relativ: bezogen auf eine Grundgröße, zum Beispiel pro 1 000 Einwohner.'], ['Korrelation', 'Zwei Größen verändern sich gemeinsam. Das beweist nicht, dass die eine die andere verursacht.']],
    diagnose: [
      { q: 'Ein Preis steigt von 40 € auf 50 €. Um wie viel Prozent ist er gestiegen?', options: ['25 %', '10 %', '20 %', 'Weiß ich noch nicht'], answer: 0, why: '10 € : 40 € = 0,25 = 25 %. Der Grundwert ist der alte Preis.', review: 'Prozentuale Veränderung (Klasse 7)' },
      { q: 'In einer Klasse mit 25 Kindern fahren 10 mit dem Rad. Wie groß ist der Anteil?', options: ['40 %', '10 %', '25 %', 'Weiß ich noch nicht'], answer: 0, why: '10 : 25 = 0,4 = 40 %.', review: 'Anteile in Prozent' },
      { q: 'Ein Quadrat wird doppelt so breit und doppelt so hoch. Wie verändert sich die Fläche?', options: ['Sie wird 4-mal so groß.', 'Sie wird doppelt so groß.', 'Sie bleibt gleich.', 'Weiß ich noch nicht'], answer: 0, why: '2 · 2 = 4. Die Fläche wächst mit dem Quadrat des Faktors.', review: 'Flächeninhalt beim Vergrößern' },
      { q: 'Was zeigt ein Säulendiagramm am besten?', options: ['Den Vergleich von Werten durch die Höhe der Säulen', 'Den Verlauf einer Funktion', 'Die Lage von Punkten im Raum', 'Weiß ich noch nicht'], answer: 0, why: 'Die Säulenhöhe steht für den Wert. Deshalb muss die Achse normalerweise bei 0 beginnen.', review: 'Diagramme lesen' }],
    erklaerung:
      '<h3>1. Abgeschnittene Achsen</h3><p>Beginnt die Hochachse nicht bei 0, sehen kleine Unterschiede riesig aus. Rechne immer mit den <b>Werten</b>, nicht mit den Säulenhöhen.</p>' +
      '<div style="display:flex;flex-wrap:wrap;gap:10px"><div style="flex:1 1 240px;max-width:330px">' + bars([48, 52], ['2024', '2025'], 46, 53, 1, '', { title: 'Achse beginnt bei 46', maxw: 330 }) + '</div><div style="flex:1 1 240px;max-width:330px">' + bars([48, 52], ['2024', '2025'], 0, 60, 10, '', { title: 'Achse beginnt bei 0', maxw: 330 }) + '</div></div>' +
      '<div class="merk"><b>Merke:</b> Tatsächliche Veränderung in Prozent = <span class="frac"><span>neuer Wert − alter Wert</span><span>alter Wert</span></span> · 100 %. Hier: (52 − 48) : 48 · 100 % ≈ 8,3 %.</div>' +
      '<h3>2. Bilder und 3D-Effekte</h3><p>Wird ein Bild (zum Beispiel eine Münze) doppelt so breit <b>und</b> doppelt so hoch gezeichnet, ist seine Fläche 4-mal so groß. Unser Auge vergleicht Flächen, der Wert hat sich aber nur verdoppelt.</p>' + coins(20, 40, 2, '2015', '2025', '€') +
      '<p>Bei 3D-Kreisdiagrammen wirken vordere Stücke größer als hintere, obwohl sie gleich groß sind.</p>' +
      '<h3>3. Wer wurde gefragt?</h3><p>Eine Umfrage ist nur aussagekräftig, wenn die Stichprobe <b>repräsentativ</b> ist: genügend Personen, <b>zufällig</b> ausgewählt aus der ganzen Gruppe. Wer nur Fans, Freunde oder freiwillige Anrufer befragt, bekommt ein verzerrtes Bild.</p>' +
      '<h3>4. Absolut, relativ, Prozentpunkte</h3><ul><li>„120 Unfälle in Stadt A, 60 in Stadt B“ sagt wenig, wenn A viel mehr Einwohner hat. Vergleiche <b>pro 1 000 Einwohner</b>.</li><li>Von 10 % auf 15 % sind es <b>5 Prozentpunkte</b>, aber eine Steigerung um <b>50 %</b>.</li><li>„Risiko halbiert“ kann heißen: von 2 auf 1 von 1 000 Personen. Absolut sind das nur 0,1 Prozentpunkte.</li></ul>' +
      '<h3>5. Zusammenhang ist nicht Ursache</h3><div class="merk"><b>Merke:</b> Wenn zwei Größen gemeinsam steigen, muss die eine nicht die Ursache der anderen sein. Oft steckt eine <b>dritte Größe</b> dahinter. Eisverkauf und Sonnenbrände steigen beide wegen des Sonnenscheins.</div>',
    entdecken: {
      html: '<p>Wähle einen Datensatz und verschiebe den Beginn der Hochachse. Beobachte, wie sich der Eindruck verändert. Die Werte bleiben gleich!</p><div class="ctl"><label>Daten <select id="e_d">' + DEMO.map(function (d, i) { return '<option value="' + i + '">' + d[0] + '</option>'; }).join('') + '</select></label><label>Achse beginnt bei <b id="v_a"></b> <input type="range" id="r_a" min="0" max="40" step="10" value="0"></label></div><div id="e_g"></div><div id="e_t"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var d = DEMO[+root.querySelector('#e_d').value], A = d[2], B = d[3], a = Math.min(+root.querySelector('#r_a').value, Math.min(A, B) - 4);
          var top = Math.ceil((Math.max(A, B) + 4) / 5) * 5, step = (top - a) > 30 ? 10 : (top - a) > 12 ? 5 : 1;
          a = Math.floor(a / step) * step;
          root.querySelector('#v_a').textContent = n(a);
          root.querySelector('#e_g').innerHTML = bars([A, B], d[1], a, top, step, '');
          var vis = (B - a) / (A - a);
          root.querySelector('#e_t').innerHTML = '<p>Im Bild ist die rechte Säule <b>' + n(Math.round(vis * 100) / 100) + '-mal</b> so hoch wie die linke. Tatsächlich ändert sich der Wert um <b>' + n(r1((B - A) / A * 100)) + ' %</b>.</p>';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Je höher die Achse beginnt, desto stärker übertreibt das Bild den Unterschied. Die tatsächliche Veränderung in Prozent bleibt immer gleich.'); }
        root.querySelector('#e_d').addEventListener('change', hit); root.querySelector('#r_a').addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Eine Schlagzeile prüfen', q: 'Schlagzeile: „Unfälle mit E-Scootern verdreifacht!“ Im Vorjahr gab es in der Stadt 4 Unfälle, in diesem Jahr 12. Die Zahl der E-Scooter stieg von 200 auf 900. Ist die Schlagzeile fair?',
      steps: ['Absolut stimmt es: von 4 auf 12 Unfälle, das ist das Dreifache (+200 %).', 'Aber es gibt viel mehr E-Scooter. Rechne relativ: Unfälle pro 100 E-Scooter.', 'Vorjahr: 4 : 200 · 100 = 2 Unfälle pro 100 E-Scooter. Dieses Jahr: 12 : 900 · 100 ≈ 1,3 Unfälle pro 100 E-Scooter.', 'Pro E-Scooter ist das Risiko also sogar <b>gesunken</b>.', 'Ergebnis: Die Schlagzeile nutzt nur absolute Zahlen und erzeugt einen falschen Eindruck. Fair wäre: „Mehr Unfälle, weil es viel mehr E-Scooter gibt. Pro Fahrzeug sinkt das Risiko.“'] },
    tasks: { gen: gen,
      plan: { G: ['achse:1', 'torte3d:1', 'stichprobe:1', 'korrelation:1'], S: ['achse:1', 'veraenderung:2', 'piktogramm:2', 'prozentpunkte:2', 'stichprobe:2'], E: ['veraenderung:3', 'piktogramm:2', 'relabs:2', 'prozentpunkte:2', 'korrelation:2', 'torte3d:2'] },
      extra: 'risiko', test: ['achse:1', 'veraenderung:2', 'piktogramm:2', 'stichprobe:1', 'prozentpunkte:2', 'korrelation:1'] },
    lerncheck: ['Ich erkenne irreführende Diagramme und erkläre den Trick.', 'Ich berechne die tatsächliche Veränderung in Prozent.', 'Ich beurteile, ob eine Umfrage repräsentativ ist.', 'Ich unterscheide Prozent und Prozentpunkte sowie Korrelation und Ursache.']
  };
})();
