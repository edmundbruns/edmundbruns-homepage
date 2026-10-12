/* Modul 011 · Steigung und y-Achsenabschnitt */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml, T = M.tpretty;
  var SLOPES = [F(1), F(2), F(3), F(-1), F(-2), F(-3), F(1, 2), F(-1, 2), F(1, 3), F(-1, 3), F(2, 3), F(-2, 3), F(3, 2), F(-3, 2)];
  var EASY = [F(1), F(2), F(3), F(-1), F(-2), F(-3)];
  function mval(m) { return m.n / m.d; }
  /* Gleichung als Term-String und schön */
  function eqStr(m, b) { var ms = m.d === 1 ? String(m.n) : '(' + m.n + '/' + m.d + ')'; return ms + '*x+(' + b + ')'; }
  function mHtml(m) { if (m.d === 1) return m.n === 1 ? '' : m.n === -1 ? '−' : M.fmtNum(m.n); return fh(m); }
  function eqHtml(m, b) { return 'y = ' + mHtml(m) + 'x' + (b ? (b > 0 ? ' + ' + b : ' − ' + Math.abs(b)) : ''); }
  /* Koordinatensystem mit Gerade(n) */
  function graph(lines, opts) {
    opts = opts || {}; var R = opts.r || 6, S = 300, u = S / (2 * R + 1), c = S / 2;
    function X(x) { return c + x * u; } function Y(y) { return c - y * u; }
    var g = '<svg class="viz" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="' + (opts.label || 'Koordinatensystem mit Gerade') + '" style="max-width:340px">';
    for (var i = -R; i <= R; i++) { g += '<line x1="' + X(i) + '" y1="' + Y(-R - .5) + '" x2="' + X(i) + '" y2="' + Y(R + .5) + '" stroke="#e3dcf2"/><line x1="' + X(-R - .5) + '" y1="' + Y(i) + '" x2="' + X(R + .5) + '" y2="' + Y(i) + '" stroke="#e3dcf2"/>'; }
    g += '<line x1="' + X(-R - .5) + '" y1="' + Y(0) + '" x2="' + X(R + .5) + '" y2="' + Y(0) + '" stroke="#1c1830" stroke-width="1.6"/><line x1="' + X(0) + '" y1="' + Y(-R - .5) + '" x2="' + X(0) + '" y2="' + Y(R + .5) + '" stroke="#1c1830" stroke-width="1.6"/>';
    for (var k = -R; k <= R; k++) if (k && k % 2 === 0) { g += '<text x="' + X(k) + '" y="' + (Y(0) + 14) + '" font-size="10" text-anchor="middle">' + k + '</text><text x="' + (X(0) - 5) + '" y="' + (Y(k) + 4) + '" font-size="10" text-anchor="end">' + k + '</text>'; }
    g += '<text x="' + (X(R + .5) - 4) + '" y="' + (Y(0) - 6) + '" font-size="12" font-weight="700" text-anchor="end">x</text><text x="' + (X(0) + 6) + '" y="' + (Y(R + .5) + 12) + '" font-size="12" font-weight="700">y</text>';
    lines.forEach(function (L, idx) {
      var m = mval(L.m), b = L.b, x1 = -R - .5, x2 = R + .5;
      var y1 = m * x1 + b, y2 = m * x2 + b;
      if (Math.abs(m) > 1e-9) { var lo = -R - .5, hi = R + .5; var xa = (lo - b) / m, xb = (hi - b) / m; x1 = Math.max(x1, Math.min(xa, xb)); x2 = Math.min(x2, Math.max(xa, xb)); y1 = m * x1 + b; y2 = m * x2 + b; }
      var col = L.color || ['#5b3fa0', '#d97706', '#0f766e'][idx % 3];
      g += '<line x1="' + X(x1) + '" y1="' + Y(y1) + '" x2="' + X(x2) + '" y2="' + Y(y2) + '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>';
      if (L.label) g += '<text x="' + (X(x2) - 6) + '" y="' + (Y(y2) + (m > 0 ? 16 : -6)) + '" font-size="13" font-weight="700" fill="' + col + '" text-anchor="end">' + L.label + '</text>';
      if (L.tri) { /* Steigungsdreieck ab Punkt (x0|y0) mit Δx = Nenner */
        var x0 = L.tri[0], y0 = m * x0 + b, dx = L.m.d, dy = L.m.n;
        g += '<path d="M' + X(x0) + ' ' + Y(y0) + ' H' + X(x0 + dx) + ' V' + Y(y0 + dy) + '" fill="none" stroke="#d97706" stroke-width="2.5" stroke-dasharray="5 3"/>' +
          '<text x="' + X(x0 + dx / 2) + '" y="' + (Y(y0) + (dy > 0 ? 15 : -6)) + '" font-size="12" font-weight="700" fill="#b45309" text-anchor="middle">' + dx + '</text>' +
          '<text x="' + (X(x0 + dx) + 5) + '" y="' + Y(y0 + dy / 2) + '" font-size="12" font-weight="700" fill="#b45309">' + (dy > 0 ? '+' : '') + dy + '</text>';
      }
      (L.pts || []).forEach(function (p) { g += '<circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="4.5" fill="' + col + '" stroke="#fff" stroke-width="1.5"/>'; });
    });
    return g + '</svg>';
  }
  /* zwei gut sichtbare Gitterpunkte auf der Geraden */
  function gridPts(m, b, R) {
    R = R || 6; var out = [];
    for (var x = -R; x <= R; x++) { var y = m.n * x / m.d + b; if (x % m.d === 0 && Math.abs(y) <= R - 0.5) out.push([x, y]); }
    return out;
  }
  function pickLine(slopes) {
    for (var t = 0; t < 50; t++) { var m = M.pick(slopes), b = M.rnd(-4, 4), p = gridPts(m, b); if (p.length >= 3) return { m: m, b: b, pts: p }; }
    return { m: F(1), b: 0, pts: gridPts(F(1), 0) };
  }
  function fracIn(ans, label) { return { kind: 'frac', answer: ans, reduce: false, label: label, placeholder: 'z. B. 2 oder −1/2' }; }
  var gen = {
    b_ablesen: function () {
      var L = pickLine(EASY);
      return { skill: 'y-Achsenabschnitt ablesen', level: 1, q: 'Lies den y-Achsenabschnitt b ab.' + graph([{ m: L.m, b: L.b }]), inputs: [{ kind: 'num', answer: L.b, label: 'b =' }],
        hints: ['Der y-Achsenabschnitt ist die Stelle, an der die Gerade die y-Achse schneidet.', 'Suche den Schnittpunkt mit der senkrechten Achse. Dort ist x = 0.', 'Lies die y-Koordinate dieses Punktes ab.'],
        solution: 'Die Gerade schneidet die y-Achse im Punkt (0 | ' + L.b + '). Also ist b = ' + L.b + '.' };
    },
    m_ablesen: function (lvl) {
      var L = pickLine(lvl >= 2 ? SLOPES : EASY), p = L.pts[0];
      return { skill: 'Steigung mit Steigungsdreieck', q: 'Bestimme die Steigung m der Geraden. Die markierten Punkte helfen dir.' + graph([{ m: L.m, b: L.b, pts: L.pts.slice(0, 3) }]), inputs: [fracIn(L.m, 'm =')],
        hints: ['Zeichne ein Steigungsdreieck zwischen zwei markierten Punkten: erst nach rechts, dann nach oben oder unten.', 'Gehe von (' + p[0] + ' | ' + M.fmtNum(p[1]) + ') um ' + L.m.d + ' nach rechts. Wie viele Kästchen musst du dann nach oben (+) oder unten (−)?', 'm = (Schritte nach oben oder unten) : (Schritte nach rechts) = ' + L.m.n + ' : ' + L.m.d + '.'],
        solution: 'Von (' + p[0] + ' | ' + M.fmtNum(p[1]) + ') geht es ' + L.m.d + ' nach rechts und ' + Math.abs(L.m.n) + (L.m.n > 0 ? ' nach oben' : ' nach unten') + '. Also m = ' + fh(L.m) + '.' + graph([{ m: L.m, b: L.b, tri: [p[0]] }]),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, F(-L.m.n, L.m.d))) return 'Achte auf das Vorzeichen: Steigt die Gerade von links nach rechts, ist m positiv. Fällt sie, ist m negativ.'; if (f && L.m.n !== 0 && M.feq(f, F(L.m.d, L.m.n))) return 'Du hast rechts und hoch vertauscht. m = Höhe : Breite (erst hoch, dann geteilt durch rechts).'; return null; } };
    },
    gleichung: function (lvl) {
      var L = pickLine(lvl >= 2 ? SLOPES : EASY);
      return { src: eqStr(L.m, L.b), skill: 'Funktionsgleichung aus Graph', q: 'Gib die Funktionsgleichung der Geraden an.' + graph([{ m: L.m, b: L.b, pts: L.pts.slice(0, 2) }]), inputs: [{ kind: 'term', label: 'y =', answer: eqStr(L.m, L.b), placeholder: 'z. B. 2x − 1 oder 1/2x + 3' }],
        hints: ['Lies zuerst b ab: Wo schneidet die Gerade die y-Achse?', 'Bestimme dann m mit einem Steigungsdreieck.', 'Setze in y = mx + b ein. Hier ist b = ' + L.b + '.'],
        solution: 'b = ' + L.b + ', m = ' + fh(L.m) + '. Also ' + eqHtml(L.m, L.b) + '.' };
    },
    tabelle: function () {
      var m = M.pick(EASY.concat([F(4), F(-4)])), b = M.rnd(-6, 6), x0 = M.rnd(-2, 1), xs = [x0, x0 + 1, x0 + 2, x0 + 3];
      var tab = '<table class="tab"><tr><th>x</th>' + xs.map(function (x) { return '<td>' + M.fmtNum(x) + '</td>'; }).join('') + '</tr><tr><th>y</th>' + xs.map(function (x) { return '<td>' + M.fmtNum(m.n * x + b) + '</td>'; }).join('') + '</tr></table>';
      return { skill: 'Steigung aus Wertetabelle', q: 'Die Tabelle gehört zu einer linearen Funktion. Bestimme m und b.' + tab, inputs: [fracIn(m, 'm ='), { kind: 'num', answer: b, label: 'b =' }],
        hints: ['Wenn x um 1 größer wird, ändert sich y immer um denselben Wert. Das ist m.', 'Hier: ' + M.fmtNum(m.n * xs[1] + b) + ' − (' + M.fmtNum(m.n * xs[0] + b) + ') = ' + m.n + '.', 'b ist der y-Wert bei x = 0. Rechne gegebenenfalls von einem Tabellenwert aus zurück.'],
        solution: 'm = ' + m.n + ', denn y ändert sich bei jedem Schritt um ' + m.n + '. Bei x = 0 ist y = ' + b + ', also b = ' + b + '. Funktion: ' + eqHtml(m, b) + '.' };
    },
    punkte: function () {
      var x1 = M.rnd(-5, 2), x2 = x1 + M.rnd(1, 5), y1 = M.rnd(-5, 5), y2 = M.rnd(-5, 5); if (y1 === y2) y2 = y1 + M.pick([-3, 2, 4]);
      var m = M.red(F(y2 - y1, x2 - x1));
      return { skill: 'Steigung aus zwei Punkten', level: 3, q: 'Eine Gerade geht durch die Punkte P(' + x1 + ' | ' + y1 + ') und Q(' + x2 + ' | ' + y2 + '). Berechne ihre Steigung.', inputs: [fracIn(m, 'm =')],
        hints: ['m = (Unterschied der y-Werte) : (Unterschied der x-Werte).', 'y-Unterschied: ' + y2 + ' − (' + y1 + ') = ' + (y2 - y1) + '. x-Unterschied: ' + x2 + ' − (' + x1 + ') = ' + (x2 - x1) + '.', 'm = ' + (y2 - y1) + ' : ' + (x2 - x1) + '. Kürze, wenn möglich.'],
        solution: 'm = <span class="frac"><span>' + y2 + ' − (' + y1 + ')</span><span>' + x2 + ' − (' + x1 + ')</span></span> = ' + fh(F(y2 - y1, x2 - x1), true) + (M.gcd(y2 - y1, x2 - x1) > 1 ? ' = ' + fh(m) : '') + '.' };
    },
    vergleich: function () {
      var ms = M.shuffle([F(3), F(1, 2), F(-2), F(1), F(-1, 3), F(2)]).slice(0, 4), q = M.pick(['steigt am stärksten', 'fällt', 'fällt am stärksten', 'steigt am schwächsten']);
      var bs = ms.map(function () { return M.rnd(-3, 3); });
      var idx;
      var vals = ms.map(mval);
      if (q === 'steigt am stärksten') idx = vals.indexOf(Math.max.apply(null, vals));
      else if (q === 'fällt am stärksten') idx = vals.indexOf(Math.min.apply(null, vals));
      else if (q === 'fällt') { var neg = vals.filter(function (v) { return v < 0; }); if (neg.length !== 1) return gen.vergleich(); idx = vals.indexOf(neg[0]); }
      else { var pos = vals.filter(function (v) { return v > 0; }); idx = vals.indexOf(Math.min.apply(null, pos)); }
      if (q === 'fällt am stärksten' && vals[idx] >= 0) return gen.vergleich();
      return { skill: 'Steigungen vergleichen', level: 1, q: 'Welche Gerade ' + q + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: ms.map(function (m, i) { return eqHtml(m, bs[i]); }), answer: idx }],
        hints: ['Entscheidend ist nur m, die Zahl vor dem x. b verschiebt die Gerade nur nach oben oder unten.', 'm > 0: die Gerade steigt. m < 0: die Gerade fällt.', 'Je größer der Betrag von m, desto steiler ist die Gerade.'],
        solution: 'Richtig ist ' + eqHtml(ms[idx], bs[idx]) + ', denn m = ' + fh(ms[idx]) + '.' };
    },
    punktprobe: function () {
      var m = M.pick(EASY), b = M.rnd(-5, 5), x = M.rnd(-4, 5), y = m.n * x + b, yes = Math.random() < 0.5, yy = yes ? y : y + M.pick([-2, -1, 1, 2]);
      return { skill: 'Punktprobe', level: 2, q: 'Liegt der Punkt P(' + x + ' | ' + yy + ') auf der Geraden ' + eqHtml(m, b) + '?', inputs: [{ kind: 'mc', label: 'Antwort', options: ['Ja, P liegt auf der Geraden.', 'Nein, P liegt nicht auf der Geraden.'], answer: yes ? 0 : 1 }],
        hints: ['Setze x = ' + x + ' in die Gleichung ein.', 'y = ' + (m.n === 1 ? '' : m.n === -1 ? '−' : m.n + ' · ') + '(' + x + ')' + (b ? (b > 0 ? ' + ' + b : ' − ' + Math.abs(b)) : '') + ' = ' + y + '.', 'Vergleiche mit der y-Koordinate von P.'],
        solution: 'Für x = ' + x + ' ergibt sich y = ' + y + '. ' + (yes ? 'Das stimmt mit P überein.' : 'P hat aber y = ' + yy + '. P liegt nicht auf der Geraden.') };
    },
    sach: function () {
      var base = M.pick([3, 3.5, 4, 4.5]), per = M.pick([1.5, 2, 2.2, 2.5]), km = M.rnd(4, 15);
      var cost = Math.round((base + per * km) * 100) / 100;
      return { src: per + '*x+' + base, skill: 'Lineare Funktion im Sachzusammenhang', q: 'Ein Taxi kostet ' + M.fmtNum(base, 2) + ' € Grundgebühr und ' + M.fmtNum(per, 2) + ' € pro Kilometer.<br>a) Gib die Funktionsgleichung an (x = Kilometer, y = Preis in €).<br>b) Was kostet eine Fahrt über ' + km + ' km?',
        inputs: [{ kind: 'term', label: 'a) y =', answer: per + 'x+' + base, placeholder: 'z. B. 2x + 3' }, { kind: 'num', label: 'b) Preis', unit: '€', answer: cost, tol: 0.005 }],
        hints: ['Die Grundgebühr bezahlst du immer, auch bei 0 km. Sie ist b.', 'Der Preis pro Kilometer ist die Steigung m.', 'Setze für b) x = ' + km + ' ein: ' + M.fmtNum(per) + ' · ' + km + ' + ' + M.fmtNum(base) + '.'],
        solution: 'a) y = ' + M.fmtNum(per) + 'x + ' + M.fmtNum(base) + '. b) y = ' + M.fmtNum(per) + ' · ' + km + ' + ' + M.fmtNum(base) + ' = ' + M.fmtNum(cost, 2) + ' €.' };
    },
    tarif: function () {
      var perB = M.pick([0.2, 0.25, 0.3]), perA = M.pick([0.05, 0.1]), base = M.pick([4, 5, 6, 7.5]);
      var x = base / (perB - perA); if (Math.abs(x - Math.round(x)) > 1e-9) return gen.tarif(); x = Math.round(x);
      return { skill: 'Tarife vergleichen', level: 3, q: 'Handytarif A kostet ' + M.fmtNum(base, 2) + ' € im Monat und ' + M.fmtNum(perA, 2) + ' € pro Minute. Tarif B hat keine Grundgebühr und kostet ' + M.fmtNum(perB, 2) + ' € pro Minute.<br>Bei wie vielen Minuten im Monat kosten beide Tarife genau gleich viel? Ab dann ist Tarif A günstiger.',
        inputs: [{ kind: 'num', label: 'Minuten', answer: x }],
        hints: ['Stelle beide Gleichungen auf: A: y = ' + M.fmtNum(perA) + 'x + ' + M.fmtNum(base) + ', B: y = ' + M.fmtNum(perB) + 'x.', 'Gleich teuer heißt: ' + M.fmtNum(perB) + 'x = ' + M.fmtNum(perA) + 'x + ' + M.fmtNum(base) + '.', 'Ziehe ' + M.fmtNum(perA) + 'x ab: ' + M.fmtNum(Math.round((perB - perA) * 100) / 100) + 'x = ' + M.fmtNum(base) + '. Teile dann.'],
        solution: M.fmtNum(perB) + 'x = ' + M.fmtNum(perA) + 'x + ' + M.fmtNum(base) + ' ⇒ ' + M.fmtNum(Math.round((perB - perA) * 100) / 100) + 'x = ' + M.fmtNum(base) + ' ⇒ x = ' + x + '. Bei ' + x + ' Minuten kosten beide gleich viel, darüber ist A günstiger.' };
    }
  };

  return {
    id: '011', title: 'Steigung und y-Achsenabschnitt', bereich: 'Funktionaler Zusammenhang', minutes: '45 bis 60',
    vorkenntnisse: 'Koordinatensystem, proportionale Zuordnungen',
    lead: 'Warum ist eine Gerade steiler als eine andere? Du lernst, was m und b in y = mx + b bedeuten, und liest sie am Graphen ab.',
    einstieg: { html: '<p>Mila und Paul sparen für ein Fahrrad. Mila hat schon <b>20 €</b> und legt jede Woche <b>5 €</b> dazu. Paul fängt bei <b>0 €</b> an, spart aber <b>8 €</b> pro Woche.</p><p class="note">Zeichnet man den Sparstand über die Wochen, entstehen zwei Geraden. Welche ist steiler? Wo beginnen sie auf der y-Achse?</p><p>Genau diese zwei Eigenschaften einer Geraden lernst du jetzt kennen: die <b>Steigung m</b> und den <b>y-Achsenabschnitt b</b>.</p>' },
    ziele: ['Ich weiß, was m und b in der Gleichung y = mx + b bedeuten.', 'Ich lese den y-Achsenabschnitt am Graphen ab.', 'Ich bestimme die Steigung mit einem Steigungsdreieck, auch bei Brüchen.', 'Ich stelle die Funktionsgleichung aus Graph, Tabelle oder zwei Punkten auf.', 'Ich nutze lineare Funktionen im Alltag, zum Beispiel bei Tarifen.'],
    fachwoerter: [['Lineare Funktion', 'Eine Funktion mit der Gleichung y = mx + b. Ihr Graph ist eine Gerade.'], ['Steigung m', 'Gibt an, um wie viel y steigt (oder fällt), wenn x um 1 größer wird.'], ['y-Achsenabschnitt b', 'Die Stelle, an der die Gerade die y-Achse schneidet: der Punkt (0 | b).'], ['Steigungsdreieck', 'Ein rechtwinkliges Dreieck an der Geraden: so weit nach rechts, so weit nach oben oder unten.']],
    diagnose: [
      { q: 'Welche Koordinaten hat der Punkt, der 3 nach rechts und 2 nach unten vom Ursprung liegt?', options: ['(3 | −2)', '(−2 | 3)', '(3 | 2)', 'Weiß ich noch nicht'], answer: 0, why: 'Zuerst die x-Koordinate (rechts), dann die y-Koordinate (unten = negativ).', review: 'Punkte im Koordinatensystem (Klasse 7)' },
      { q: 'Eine Zuordnung ist proportional. 2 kg kosten 6 €. Was kosten 5 kg?', options: ['15 €', '9 €', '30 €', 'Weiß ich noch nicht'], answer: 0, why: '1 kg kostet 3 €, also kosten 5 kg 15 €.', review: 'Proportionale Zuordnungen und Dreisatz' },
      { q: 'Welchen Wert hat y = 2x − 1 für x = 3?', options: ['5', '7', '4', 'Weiß ich noch nicht'], answer: 0, why: '2 · 3 − 1 = 5.', review: 'Werte von Termen berechnen' },
      { q: 'Welche Aussage passt zu einer proportionalen Zuordnung?', options: ['Ihr Graph ist eine Gerade durch den Ursprung.', 'Ihr Graph ist eine Kurve.', 'Ihr Graph beginnt immer bei y = 1.', 'Weiß ich noch nicht'], answer: 0, why: 'Proportionale Zuordnungen haben eine Ursprungsgerade.', review: 'Graphen proportionaler Zuordnungen' }],
    erklaerung:
      '<h3>1. Die Gleichung y = mx + b</h3><p>Jede Gerade, die nicht senkrecht ist, lässt sich mit einer Gleichung <b>y = mx + b</b> beschreiben. Zwei Zahlen bestimmen die Gerade vollständig:</p>' +
      '<div class="merk"><b>Merke:</b><br><b>b</b> ist der <b>y-Achsenabschnitt</b>: Die Gerade schneidet die y-Achse im Punkt (0 | b).<br><b>m</b> ist die <b>Steigung</b>: Gehst du 1 nach rechts, geht die Gerade m nach oben (m &gt; 0) oder nach unten (m &lt; 0).</div>' +
      '<p>Bei Mila aus dem Einstieg ist <b>y = 5x + 20</b>: Startwert 20 €, jede Woche 5 € mehr. Bei Paul ist <b>y = 8x</b>, also b = 0. Pauls Gerade ist steiler, weil 8 &gt; 5.</p>' +
      '<h3>2. Steigung mit dem Steigungsdreieck</h3><p>Wähle zwei gut ablesbare Punkte auf der Geraden. Gehe vom linken Punkt waagerecht nach rechts und dann senkrecht bis zur Geraden.</p><p class="big-math">m = <span class="frac"><span>Schritte nach oben (+) oder unten (−)</span><span>Schritte nach rechts</span></span></p>' + graph([{ m: F(2, 3), b: -1, tri: [0], pts: [[0, -1], [3, 1]] }], { label: 'Beispiel Steigungsdreieck' }) +
      '<p>Im Bild: 3 nach rechts, 2 nach oben. Also m = ' + fh(F(2, 3)) + '. Die Gerade schneidet die y-Achse bei −1, also y = ' + fh(F(2, 3)) + 'x − 1.</p>' +
      '<h3>3. Steigung aus zwei Punkten berechnen</h3><p>Für P(x₁ | y₁) und Q(x₂ | y₂) gilt: <span class="big-math">m = <span class="frac"><span>y₂ − y₁</span><span>x₂ − x₁</span></span></span></p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Brüche schreibst du als 2/3, eine Gleichung als 2/3x − 1 oder 0,5x + 2.</p>',
    entdecken: {
      html: '<p>Verändere m und b. Beobachte, was mit der Geraden passiert.</p><div class="ctl"><label>m = <b id="v_m"></b> <input type="range" id="r_m" min="-3" max="3" step="0.5" value="1"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="-4" max="4" step="1" value="1"></label></div><div id="e_g"></div><p class="big-math" id="e_eq"></p><ul><li>Was passiert, wenn m negativ wird?</li><li>Was passiert bei m = 0?</li><li>Was verändert b, was bleibt gleich?</li></ul>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var mv = +root.querySelector('#r_m').value, b = +root.querySelector('#r_b').value, m = mv % 1 ? F(mv * 2, 2) : F(mv);
          m = M.red(m);
          root.querySelector('#v_m').textContent = M.fmtNum(mv); root.querySelector('#v_b').textContent = b;
          root.querySelector('#e_g').innerHTML = graph([{ m: m, b: b, tri: mv !== 0 ? [Math.abs(mv) > 2 ? -1 : 0] : null, pts: [[0, b]] }]);
          root.querySelector('#e_eq').innerHTML = (m.n === 0 ? 'y = ' + b : eqHtml(m, b)) + (mv === 0 ? ' &nbsp;<small>(waagerechte Gerade)</small>' : mv > 0 ? ' &nbsp;<small>(steigt)</small>' : ' &nbsp;<small>(fällt)</small>');
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: m bestimmt, wie steil die Gerade ist und ob sie steigt oder fällt. b verschiebt sie nur nach oben oder unten.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Gleichung aus zwei Punkten', q: 'Eine Gerade geht durch A(1 | 1) und B(3 | 5). Bestimme ihre Gleichung.',
      steps: ['Steigung berechnen: m = <span class="frac"><span>5 − 1</span><span>3 − 1</span></span> = ' + fh(F(4, 2), true) + ' = 2.', 'Einen Punkt einsetzen, um b zu finden: y = 2x + b mit A(1 | 1): 1 = 2 · 1 + b.', '1 = 2 + b ⇒ b = −1.', 'Gleichung: <b>y = 2x − 1</b>.', 'Kontrolle mit B: 2 · 3 − 1 = 5. Stimmt!' + graph([{ m: F(2), b: -1, pts: [[1, 1], [3, 5]] }])] },
    tasks: { gen: gen, plan: { G: ['vergleich:1', 'b_ablesen:1', 'm_ablesen:1', 'gleichung:1'], S: ['b_ablesen:1', 'm_ablesen:2', 'gleichung:2', 'tabelle:2', 'sach:2'], E: ['m_ablesen:2', 'gleichung:2', 'tabelle:2', 'punkte:3', 'punktprobe:2', 'sach:2'] },
      extra: 'tarif', test: ['b_ablesen:1', 'm_ablesen:2', 'gleichung:2', 'tabelle:2', 'punkte:3', 'sach:2'] },
    lerncheck: ['Ich kann erklären, was m und b bedeuten.', 'Ich bestimme die Steigung mit einem Steigungsdreieck.', 'Ich stelle die Gleichung einer Geraden auf.', 'Ich nutze lineare Funktionen bei Sachaufgaben.']
  };
})();
