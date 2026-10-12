/* Modul 007 · Sachaufgaben mit Gleichungen */
var MODULE = (function () {
  var T = M.tpretty, poly = M.poly;
  function show(s) { return '<span class="big-math">' + s + '</span>'; }
  function sd(A, B) { return T(poly([[A, 'x'], [B, '']])); }
  function num(n) { return T(String(n)); }
  function eur(x) { return M.fmtNum(x) + ' €'; }
  function lin(A, B) { var s = ''; if (A) s += (A === 1 ? '' : A === -1 ? '-' : A) + 'x'; if (B) s += (B > 0 && A ? '+' : '') + B; return s || '0'; }
  function termIn(label, ans, ph) { return { kind: 'term', label: label, answer: ans, placeholder: ph || 'z. B. 3x + 7' }; }
  /* Lösungszeilen für A x + B = C x + D */
  function solve(A, B, C, D) {
    var L = [], a = A - C, r = D - B;
    if (C) L.push(sd(a, B) + ' = ' + num(D) + ' &nbsp; <small>| ' + (C > 0 ? '− ' : '+ ') + (Math.abs(C) === 1 ? '' : Math.abs(C)) + 'x</small>');
    if (B) L.push(sd(a, 0) + ' = ' + num(r) + ' &nbsp; <small>| ' + (B > 0 ? '− ' + B : '+ ' + -B) + '</small>');
    if (a !== 1) L.push('x = ' + num(r / a) + ' &nbsp; <small>| : ' + (a < 0 ? '(' + num(a) + ')' : a) + '</small>');
    return L.join('<br>');
  }
  /* Rechteck-Skizze */
  function rectSketch(top, side) {
    return '<svg class="viz" viewBox="0 0 300 150" role="img" aria-label="Rechteck" style="max-width:320px"><rect x="60" y="20" width="200" height="100" fill="#efeafb" stroke="#3d2a73" stroke-width="2.5"/>' +
      '<text x="160" y="140" font-size="14" font-weight="700" text-anchor="middle" fill="#3d2a73">' + top + '</text><text x="52" y="75" font-size="14" font-weight="700" text-anchor="end" fill="#3d2a73">' + side + '</text>' +
      '<text x="296" y="146" font-size="10" text-anchor="end" fill="#5a5670">Skizze nicht maßstabsgetreu</text></svg>';
  }
  function triSketch(base, leg) {
    return '<svg class="viz" viewBox="0 0 300 170" role="img" aria-label="Gleichschenkliges Dreieck" style="max-width:320px"><polygon points="70,140 230,140 150,20" fill="#efeafb" stroke="#3d2a73" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<text x="150" y="160" font-size="14" font-weight="700" text-anchor="middle" fill="#3d2a73">' + base + '</text><text x="98" y="78" font-size="14" font-weight="700" text-anchor="end" fill="#3d2a73">' + leg + '</text><text x="202" y="78" font-size="14" font-weight="700" fill="#3d2a73">' + leg + '</text>' +
      '<text x="296" y="166" font-size="10" text-anchor="end" fill="#5a5670">Skizze nicht maßstabsgetreu</text></svg>';
  }

  var gen = {
    welche: function () {
      var a = M.rnd(2, 6), b = M.rnd(2, 9), x = M.rnd(2, 12), t = M.pick([1, 2]), c, text, right, wrong;
      if (a === b) b = b + 1;
      if (t === 1) { c = a * x + b; text = 'Multipliziere eine Zahl mit ' + a + ' und addiere dann ' + b + '. Du erhältst ' + c + '.'; right = a + 'x + ' + b + ' = ' + c; wrong = [a + '(x + ' + b + ') = ' + c, b + 'x + ' + a + ' = ' + c, 'x + ' + a + ' · ' + b + ' = ' + c]; }
      else { c = a * (x + b); text = 'Addiere zu einer Zahl ' + b + ' und multipliziere die Summe mit ' + a + '. Du erhältst ' + c + '.'; right = a + '(x + ' + b + ') = ' + c; wrong = [a + 'x + ' + b + ' = ' + c, b + '(x + ' + a + ') = ' + c, 'x + ' + b + ' · ' + a + ' = ' + c]; }
      var opts = M.shuffle([right].concat(wrong));
      return { skill: 'Gleichung zum Text finden', level: 1, q: '<b>Zahlenrätsel:</b> ' + text + '<br>Welche Gleichung passt? Die gesuchte Zahl heißt x.', inputs: [{ kind: 'mc', label: 'Passende Gleichung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Übersetze Schritt für Schritt. Was passiert <b>zuerst</b> mit der Zahl x?', t === 1 ? 'Zuerst wird x mit ' + a + ' multipliziert: ' + a + 'x. Danach wird ' + b + ' addiert.' : 'Zuerst wird ' + b + ' addiert: x + ' + b + '. Die <b>Summe</b> wird dann mit ' + a + ' multipliziert. Dafür brauchst du eine Klammer.', 'Kontrolle: Die gesuchte Zahl ist ' + x + '. Setze sie in die Gleichungen ein. Nur bei einer kommt ' + c + ' heraus.'],
        solution: 'Richtig ist ' + right + '. Probe mit x = ' + x + ': ' + (t === 1 ? a + ' · ' + x + ' + ' + b : a + ' · (' + x + ' + ' + b + ')') + ' = ' + c + '.',
        verify: function () { return (t === 1 ? a * x + b : a * (x + b)) === c ? true : 'Probe'; } };
    },
    zahl: function (lvl) {
      if (lvl < 2) {
        var a = M.rnd(2, 7), b = M.rnd(3, 15), x = M.rnd(2, 15), sub = Math.random() < 0.5, c = sub ? a * x - b : a * x + b;
        var word = ['', '', 'Das Doppelte', 'Das Dreifache', 'Das Vierfache', 'Das Fünffache', 'Das Sechsfache', 'Das Siebenfache'][a];
        return { skill: 'Zahlenrätsel lösen', level: lvl, q: '<b>Zahlenrätsel:</b> ' + word + ' einer Zahl, ' + (sub ? 'vermindert um ' : 'vermehrt um ') + b + ', ergibt ' + c + '.<br>a) Schreibe die linke Seite der Gleichung als Term mit x.<br>b) Wie heißt die Zahl?',
          inputs: [termIn('a) Term', lin(a, sub ? -b : b)), { kind: 'num', answer: x, label: 'b) Die Zahl ist' }],
          hints: [word + ' einer Zahl ist ' + a + 'x. „' + (sub ? 'Vermindert' : 'Vermehrt') + ' um ' + b + '“ heißt ' + (sub ? '− ' : '+ ') + b + '.', 'Die Gleichung lautet ' + sd(a, sub ? -b : b) + ' = ' + c + '.', 'Löse: ' + (sub ? '+ ' : '− ') + b + ' auf beiden Seiten, dann : ' + a + '. Antwortsatz: „Die Zahl heißt …“'],
          solution: sd(a, sub ? -b : b) + ' = ' + c + '<br>' + solve(a, sub ? -b : b, 0, c) + '<br>Antwort: Die Zahl heißt ' + x + '. Probe: ' + a + ' · ' + x + (sub ? ' − ' : ' + ') + b + ' = ' + c + '.',
          verify: function () { return (sub ? a * x - b : a * x + b) === c ? true : 'Probe'; },
          mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && Math.abs(y - (sub ? (c - b) / a : (c + b) / a)) < 1e-9) return 'Prüfe die Umformung: Um ' + (sub ? '− ' : '+ ') + b + ' wegzubekommen, rechnest du auf beiden Seiten ' + (sub ? '+ ' : '− ') + b + '.'; return null; } };
      }
      var p, q, r, u, xx;
      do { p = M.rnd(2, 4); r = M.rnd(p + 1, 7); q = M.rnd(1, 15); xx = M.rnd(2, 12); u = r * xx - p * xx - q; } while (u <= 0 || u > 30);
      /* p·x + q = r·x − u */
      return { skill: 'Zahlenrätsel mit x auf beiden Seiten', level: lvl, q: '<b>Zahlenrätsel:</b> Wenn du eine Zahl mit ' + p + ' multiplizierst und ' + q + ' addierst, erhältst du dasselbe, wie wenn du die Zahl mit ' + r + ' multiplizierst und ' + u + ' subtrahierst.<br>a) Term für den ersten Teil („mit ' + p + ' multiplizieren und ' + q + ' addieren“)<br>b) Term für den zweiten Teil<br>c) Wie heißt die Zahl?',
        inputs: [termIn('a) erster Term', lin(p, q)), termIn('b) zweiter Term', lin(r, -u)), { kind: 'num', answer: xx, label: 'c) Die Zahl ist' }],
        hints: ['Erster Teil: ' + sd(p, q) + '. Zweiter Teil: ' + sd(r, -u) + '.', '„Dasselbe“ heißt: Beide Terme sind gleich. ' + sd(p, q) + ' = ' + sd(r, -u) + '.', 'Bringe die x-Glieder auf die Seite mit dem größeren x-Glied: − ' + p + 'x. Antwortsatz nicht vergessen.'],
        solution: sd(p, q) + ' = ' + sd(r, -u) + '<br>' + q + ' = ' + sd(r - p, -u) + ' &nbsp; <small>| − ' + p + 'x</small><br>' + (q + u) + ' = ' + sd(r - p, 0) + ' &nbsp; <small>| + ' + u + '</small><br>' + (r - p === 1 ? '' : 'x = ' + xx + ' &nbsp; <small>| : ' + (r - p) + '</small><br>') + 'Antwort: Die Zahl heißt ' + xx + '. Probe: ' + p + ' · ' + xx + ' + ' + q + ' = ' + (p * xx + q) + ' und ' + r + ' · ' + xx + ' − ' + u + ' = ' + (r * xx - u) + '.',
        verify: function () { return p * xx + q === r * xx - u ? true : 'Probe'; } };
    },
    folge: function (lvl) {
      var even = lvl >= 3, x = even ? 2 * M.rnd(3, 40) : M.rnd(5, 60), d = even ? 2 : 1, S = 3 * x + 3 * d;
      return { skill: 'Aufeinanderfolgende Zahlen', level: lvl, q: 'Die Summe von drei aufeinanderfolgenden ' + (even ? '<b>geraden</b> ' : '') + 'Zahlen ist ' + S + '.<br>a) Die kleinste Zahl heißt x. Schreibe die Summe der drei Zahlen als Term.<br>b) Wie heißt die kleinste Zahl?',
        inputs: [termIn('a) Summe', '3x+' + 3 * d), { kind: 'num', answer: x, label: 'b) kleinste Zahl' }],
        hints: ['Die drei Zahlen heißen x, x + ' + d + ' und x + ' + 2 * d + '.', 'Summe: x + (x + ' + d + ') + (x + ' + 2 * d + ') = 3x + ' + 3 * d + '. Gleichung: 3x + ' + 3 * d + ' = ' + S + '.', 'Löse und nenne alle drei Zahlen im Antwortsatz.'],
        solution: 'x + (x + ' + d + ') + (x + ' + 2 * d + ') = ' + S + '<br>3x + ' + 3 * d + ' = ' + S + '<br>' + solve(3, 3 * d, 0, S) + '<br>Antwort: Die Zahlen heißen ' + x + ', ' + (x + d) + ' und ' + (x + 2 * d) + '. Probe: ' + x + ' + ' + (x + d) + ' + ' + (x + 2 * d) + ' = ' + S + '.',
        verify: function () { return x + (x + d) + (x + 2 * d) === S ? true : 'Probe'; },
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && y === S / 3) return 'Das ist die mittlere Zahl. Gefragt ist die kleinste.'; return null; } };
    },
    umfang: function (lvl) {
      var kind = lvl >= 2 ? M.pick(['rechteck', 'dreieck', 'mal']) : 'rechteck', x, d, U, q, inp, sol, sketch, other, ver, otherLabel;
      if (kind === 'rechteck') {
        x = M.rnd(3, 20); d = M.rnd(2, 9); U = 2 * (x + x + d);
        sketch = rectSketch('Länge: x + ' + d, 'x');
        q = 'Ein Rechteck ist ' + d + ' cm länger als breit. Sein Umfang beträgt ' + U + ' cm.';
        inp = termIn('a) Umfang als Term', '4x+' + 2 * d, 'z. B. 2(x + x + 3)'); other = x + d; otherLabel = 'c) Länge';
        sol = '2 · (x + x + ' + d + ') = ' + U + '<br>4x + ' + 2 * d + ' = ' + U + '<br>' + solve(4, 2 * d, 0, U) + '<br>Antwort: Das Rechteck ist ' + x + ' cm breit und ' + (x + d) + ' cm lang. Probe: 2 · (' + x + ' + ' + (x + d) + ') = ' + U + ' cm.';
        ver = function () { return 2 * (x + x + d) === U; };
      } else if (kind === 'mal') {
        x = M.rnd(2, 15); d = M.rnd(2, 4); U = 2 * (x + d * x);
        sketch = rectSketch('Länge: ' + d + 'x', 'x');
        q = 'Ein Rechteck ist ' + d + '-mal so lang wie breit. Sein Umfang beträgt ' + U + ' cm.';
        inp = termIn('a) Umfang als Term', (2 + 2 * d) + 'x', 'z. B. 2(x + 3x)'); other = d * x; otherLabel = 'c) Länge';
        sol = '2 · (x + ' + d + 'x) = ' + U + '<br>' + (2 + 2 * d) + 'x = ' + U + '<br>x = ' + x + ' &nbsp; <small>| : ' + (2 + 2 * d) + '</small><br>Antwort: Das Rechteck ist ' + x + ' cm breit und ' + d * x + ' cm lang. Probe: 2 · (' + x + ' + ' + d * x + ') = ' + U + ' cm.';
        ver = function () { return 2 * (x + d * x) === U; };
      } else {
        x = M.rnd(3, 20); d = M.rnd(1, 8); U = x + 2 * (x + d);
        sketch = triSketch('Basis: x', 'x + ' + d);
        q = 'In einem gleichschenkligen Dreieck ist jeder Schenkel ' + d + ' cm länger als die Basis. Der Umfang beträgt ' + U + ' cm.';
        inp = termIn('a) Umfang als Term', '3x+' + 2 * d, 'z. B. x + 2(x + 3)'); other = x + d; otherLabel = 'c) Schenkel';
        sol = 'x + 2 · (x + ' + d + ') = ' + U + '<br>3x + ' + 2 * d + ' = ' + U + '<br>' + solve(3, 2 * d, 0, U) + '<br>Antwort: Die Basis ist ' + x + ' cm lang, jeder Schenkel ' + (x + d) + ' cm. Probe: ' + x + ' + ' + (x + d) + ' + ' + (x + d) + ' = ' + U + ' cm.';
        ver = function () { return x + 2 * (x + d) === U; };
      }
      return { skill: 'Gleichungen bei Umfängen', level: lvl, q: q + sketch + 'a) Die ' + (kind === 'dreieck' ? 'Basis' : 'Breite') + ' heißt x. Schreibe den Umfang als Term mit x.<br>b) Wie lang ist die ' + (kind === 'dreieck' ? 'Basis' : 'Breite') + '?<br>' + otherLabel + '?',
        inputs: [inp, { kind: 'num', answer: x, label: 'b) ' + (kind === 'dreieck' ? 'Basis' : 'Breite'), unit: 'cm' }, { kind: 'num', answer: other, label: otherLabel, unit: 'cm' }],
        hints: [kind === 'dreieck' ? 'Der Umfang ist die Summe aller drei Seiten: Basis + Schenkel + Schenkel.' : 'Der Umfang eines Rechtecks ist 2 · (Länge + Breite).', 'Umfang als Term: ' + T(inp.answer.replace('+', ' + ')) + '. Setze ihn gleich ' + U + '.', 'Löse die Gleichung. Berechne danach die zweite Seite und schreibe einen Antwortsatz mit beiden Längen.'],
        solution: sol,
        verify: function () { return ver() ? true : 'Probe'; },
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && kind === 'rechteck' && y === (U - d) / 2) return 'Ein Rechteck hat zwei Längen und zwei Breiten. Der Umfang ist 2 · (x + x + ' + d + ').'; return null; } };
    },
    kosten: function (lvl) {
      var ctx = M.pick([
        { g: [20, 25, 30, 40], r: [15, 18, 20, 25], t: function (g, r) { return 'Ein Fitnessstudio verlangt ' + eur(g) + ' Anmeldegebühr und ' + eur(r) + ' pro Monat.'; }, who: 'Lea hat insgesamt', unit: 'Monate', ask: 'Wie viele Monate war Lea Mitglied?', ans: 'Monate' },
        { g: [30, 35, 40, 45], r: [38, 42, 45, 50], t: function (g, r) { return 'Ein Elektriker berechnet ' + eur(g) + ' für die Anfahrt und ' + eur(r) + ' pro Arbeitsstunde.'; }, who: 'Die Rechnung beträgt', unit: 'Stunden', ask: 'Wie viele Stunden hat er gearbeitet?', ans: 'Stunden' },
        { g: [4, 5, 6], r: [8, 9, 11, 12], t: function (g, r) { return 'In einer Kletterhalle kostet das Ausleihen der Schuhe einmalig ' + eur(g) + '. Jeder Besuch kostet ' + eur(r) + '.'; }, who: 'Tim hat insgesamt', unit: 'Besuche', ask: 'Wie oft war Tim klettern?', ans: 'Besuche' }]);
      var g = M.pick(ctx.g), r = M.pick(ctx.r), x = M.rnd(3, 12), S = g + r * x;
      return { skill: 'Kosten mit Grundgebühr', level: lvl, q: ctx.t(g, r) + ' ' + ctx.who + ' ' + eur(S) + (ctx.who.indexOf('Rechnung') >= 0 ? '.' : ' bezahlt.') + '<br>a) x ist die Anzahl der ' + ctx.unit + '. Schreibe die Gesamtkosten als Term.<br>b) ' + ctx.ask,
        inputs: [termIn('a) Kosten in €', lin(r, g), 'z. B. 15x + 20'), { kind: 'num', answer: x, label: 'b) Anzahl ' + ctx.ans }],
        hints: ['Die Grundgebühr ' + eur(g) + ' fällt nur einmal an. Der Betrag ' + eur(r) + ' kommt für jede Einheit dazu: ' + r + 'x.', 'Kosten: ' + sd(r, g) + '. Gleichung: ' + sd(r, g) + ' = ' + S + '.', 'Ziehe ' + g + ' ab und teile durch ' + r + '. Antwortsatz nicht vergessen.'],
        solution: sd(r, g) + ' = ' + S + '<br>' + solve(r, g, 0, S) + '<br>Antwort: ' + x + ' ' + ctx.ans + '. Probe: ' + g + ' € + ' + x + ' · ' + r + ' € = ' + eur(S) + '.',
        verify: function () { return g + r * x === S ? true : 'Probe'; },
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && Math.abs(y - S / r) < 1e-9) return 'Die Grundgebühr ' + eur(g) + ' wird nur einmal bezahlt. Ziehe sie zuerst ab.'; if (M.termValid(v[0]) && M.termEq(v[0], lin(g, r))) return 'Bei a) ist der Betrag pro Einheit (' + eur(r) + ') der Faktor vor x. Die Grundgebühr kommt einmal dazu.'; return null; } };
    },
    alter: function () {
      var m, k, n, x, tries = 0;
      do { m = M.rnd(3, 5); k = m - M.rnd(1, 2); n = M.rnd(2, 15); x = n * (k - 1) / (m - k); tries++; } while (tries < 500 && (k < 2 || x !== Math.round(x) || x < 4 || x > 14 || m * x > 52 || m * x < 24));
      var names = M.pick([['Frau Kaya', 'ihre Tochter Elif', 'Frau Kaya', 'sie'], ['Herr Brandt', 'sein Sohn Jan', 'Herrn Brandt', 'er'], ['Tante Rosa', 'ihr Neffe Paul', 'Tante Rosa', 'sie']]);
      var right = m + 'x + ' + n + ' = ' + k + '(x + ' + n + ')', wrong = [m + 'x + ' + n + ' = ' + k + 'x + ' + n, m + '(x + ' + n + ') = ' + k + 'x', m + 'x = ' + k + '(x + ' + n + ')'];
      var opts = M.shuffle([right].concat(wrong));
      var who = names[1].split(' ').pop();
      return { skill: 'Altersrätsel', level: 3, q: names[0] + ' ist heute ' + m + '-mal so alt wie ' + names[1] + '. In ' + n + ' Jahren ist ' + names[3] + ' nur noch ' + k + '-mal so alt wie ' + who + '.<br>a) ' + who + ' ist heute x Jahre alt. Welche Gleichung passt?<br>b) Wie alt ist ' + who + ' heute?<br>c) Wie alt ist ' + names[0] + ' heute?',
        inputs: [{ kind: 'mc', label: 'a) Gleichung', options: opts, answer: opts.indexOf(right) }, { kind: 'num', answer: x, label: 'b) ' + who, unit: 'Jahre' }, { kind: 'num', answer: m * x, label: 'c) ' + names[0], unit: 'Jahre' }],
        hints: ['Lege eine Tabelle an: heute ' + who + ' x, ' + names[0] + ' ' + m + 'x. In ' + n + ' Jahren: x + ' + n + ' und ' + m + 'x + ' + n + '.', 'In ' + n + ' Jahren gilt: Alter von ' + names[2] + ' = ' + k + ' · Alter von ' + who + '. Also ' + right + '.', 'Löse: ' + m + 'x + ' + n + ' = ' + k + 'x + ' + k * n + '. Antwortsatz mit beiden Altersangaben.'],
        solution: '<table class="tab"><tr><th></th><th>heute</th><th>in ' + n + ' Jahren</th></tr><tr><th>' + who + '</th><td>x</td><td>x + ' + n + '</td></tr><tr><th>' + names[0] + '</th><td>' + m + 'x</td><td>' + m + 'x + ' + n + '</td></tr></table>' + right + '<br>' + sd(m, n) + ' = ' + sd(k, k * n) + '<br>' + solve(m, n, k, k * n) + '<br>Antwort: ' + who + ' ist heute ' + x + ' Jahre alt, ' + names[0] + ' ' + m * x + ' Jahre. Probe: In ' + n + ' Jahren sind sie ' + (x + n) + ' und ' + (m * x + n) + ' Jahre alt, und ' + k + ' · ' + (x + n) + ' = ' + k * (x + n) + '.',
        verify: function () { return m * x + n === k * (x + n) && x > 0 ? true : 'Probe'; } };
    },
    aufteilen: function (lvl) {
      var f = M.rnd(2, 3), d = M.rnd(3, 15), x = M.rnd(5, 40), S = x + f * x + x + d;
      var nm = M.pick([['Ali', 'Ben', 'Cem'], ['Lara', 'Mona', 'Nele'], ['Finn', 'Gül', 'Hanna']]);
      var what = M.pick([['Geld für den Flohmarktstand', '€'], ['Punkte beim Quiz', 'Punkte']]);
      return { skill: 'Aufteilen mit Gleichungen', level: lvl, q: nm[0] + ', ' + nm[1] + ' und ' + nm[2] + ' haben zusammen ' + S + ' ' + what[1] + ' ' + (what[1] === '€' ? 'für ihren Flohmarktstand eingenommen' : 'beim Quiz gesammelt') + '. ' + nm[1] + ' hat ' + (f === 2 ? 'doppelt' : 'dreimal') + ' so viel wie ' + nm[0] + '. ' + nm[2] + ' hat ' + d + ' ' + what[1] + ' mehr als ' + nm[0] + '.<br>a) ' + nm[0] + ' hat x ' + what[1] + '. Schreibe die Summe aller drei Beträge als Term.<br>b) Wie viel hat ' + nm[0] + '?<br>c) Wie viel hat ' + nm[2] + '?',
        inputs: [termIn('a) Summe', lin(f + 2, d), 'z. B. x + 2x + (x + 5)'), { kind: 'num', answer: x, label: 'b) ' + nm[0], unit: what[1] === '€' ? '€' : undefined }, { kind: 'num', answer: x + d, label: 'c) ' + nm[2], unit: what[1] === '€' ? '€' : undefined }],
        hints: [nm[0] + ': x. ' + nm[1] + ': ' + f + 'x. ' + nm[2] + ': x + ' + d + '.', 'Summe: x + ' + f + 'x + x + ' + d + ' = ' + sd(f + 2, d) + '. Gleichung: ' + sd(f + 2, d) + ' = ' + S + '.', 'Löse die Gleichung. Rechne dann den Betrag von ' + nm[2] + ' aus und schreibe einen Antwortsatz.'],
        solution: 'x + ' + f + 'x + (x + ' + d + ') = ' + S + '<br>' + sd(f + 2, d) + ' = ' + S + '<br>' + solve(f + 2, d, 0, S) + '<br>Antwort: ' + nm[0] + ' hat ' + x + ' ' + what[1] + ', ' + nm[1] + ' hat ' + f * x + ' ' + what[1] + ', ' + nm[2] + ' hat ' + (x + d) + ' ' + what[1] + '. Probe: ' + x + ' + ' + f * x + ' + ' + (x + d) + ' = ' + S + '.',
        verify: function () { return x + f * x + x + d === S ? true : 'Probe'; },
        mistakes: function (v) { var y = M.parseNum(v[1]); if (y !== null && Math.abs(y - S / 3) < 1e-9) return 'Die drei bekommen nicht gleich viel. Stelle zuerst eine Gleichung auf: x + ' + f + 'x + (x + ' + d + ') = ' + S + '.'; return null; } };
    },
    tarif: function () {
      var g, a, b, x; do { g = M.pick([12, 15, 18, 20, 24, 30, 36]); a = M.rnd(2, 6); b = a + M.rnd(1, 6); x = g / (b - a); } while (x !== Math.round(x) || x < 3 || x > 15);
      var right = g + ' + ' + a + 'x = ' + b + 'x', wrong = [g + 'x + ' + a + ' = ' + b + 'x', g + ' + ' + b + 'x = ' + a + 'x', '(' + g + ' + ' + a + ')x = ' + b + 'x'];
      var opts = M.shuffle([right].concat(wrong));
      return { skill: 'Angebote vergleichen', level: 3, q: 'Ein Fahrradverleih hat zwei Angebote. <b>Angebot A:</b> ' + g + ' € Grundgebühr und ' + a + ' € pro Stunde. <b>Angebot B:</b> keine Grundgebühr, ' + b + ' € pro Stunde.<br>a) Bei x Stunden kosten beide gleich viel. Welche Gleichung passt?<br>b) Nach wie vielen Stunden kosten beide gleich viel?',
        inputs: [{ kind: 'mc', label: 'a) Gleichung', options: opts, answer: opts.indexOf(right) }, { kind: 'num', answer: x, label: 'b) Stunden' }],
        hints: ['Kosten A: ' + g + ' + ' + a + 'x. Kosten B: ' + b + 'x.', '„Gleich viel“ heißt: ' + right + '.', 'Ziehe ' + a + 'x ab: ' + g + ' = ' + (b - a === 1 ? 'x' : (b - a) + 'x') + '.' + (b - a === 1 ? '' : ' Teile durch ' + (b - a) + '.') + ' Antwortsatz: „Nach … Stunden …“'],
        solution: right + '<br>' + g + ' = ' + sd(b - a, 0) + ' &nbsp; <small>| − ' + a + 'x</small><br>' + (b - a === 1 ? '' : 'x = ' + x + ' &nbsp; <small>| : ' + (b - a) + '</small><br>') + 'Antwort: Nach ' + x + ' Stunden kosten beide Angebote gleich viel, nämlich ' + b * x + ' €. Wer länger fährt, nimmt besser Angebot A.',
        verify: function () { return g + a * x === b * x ? true : 'Probe'; } };
    },
    sparen: function () {
      var a, b, s, t, A, B;
      do { a = M.pick([20, 30, 40, 50, 60]); s = M.rnd(3, 9); b = M.pick([100, 120, 140, 150, 160, 180]); t = M.rnd(2, 6); } while ((b - a) % (s + t) !== 0 || (b - a) / (s + t) < 3 || (b - a) / (s + t) > 15);
      var w = (b - a) / (s + t), amount = a + s * w;
      return { skill: 'Zwei Entwicklungen vergleichen', level: 3, q: 'Mia hat ' + a + ' € gespart und legt jede Woche ' + s + ' € dazu. Tom hat ' + b + ' € gespart, gibt aber jede Woche ' + t + ' € für Snacks aus.<br>a) Nach wie vielen Wochen haben beide gleich viel Geld?<br>b) Wie viel Geld hat dann jeder?',
        inputs: [{ kind: 'num', answer: w, label: 'a) Wochen' }, { kind: 'num', answer: amount, label: 'b) Betrag', unit: '€' }],
        hints: ['Mia nach x Wochen: ' + a + ' + ' + s + 'x. Tom nach x Wochen: ' + b + ' − ' + t + 'x.', 'Gleich viel: ' + a + ' + ' + s + 'x = ' + b + ' − ' + t + 'x. Addiere ' + t + 'x auf beiden Seiten.', (s + t) + 'x = ' + (b - a) + '. Teile, setze dann x in einen der Terme ein. Antwortsatz!'],
        solution: a + ' + ' + s + 'x = ' + b + ' − ' + t + 'x<br>' + a + ' + ' + (s + t) + 'x = ' + b + ' &nbsp; <small>| + ' + t + 'x</small><br>' + (s + t) + 'x = ' + (b - a) + ' &nbsp; <small>| − ' + a + '</small><br>x = ' + w + ' &nbsp; <small>| : ' + (s + t) + '</small><br>Antwort: Nach ' + w + ' Wochen haben beide ' + amount + ' € (Mia: ' + a + ' + ' + s + ' · ' + w + ' = ' + amount + ', Tom: ' + b + ' − ' + t + ' · ' + w + ' = ' + (b - t * w) + ').',
        verify: function () { return a + s * w === b - t * w ? true : 'Probe'; } };
    }
  };

  return {
    id: '007', title: 'Sachaufgaben mit Gleichungen', bereich: 'Terme und Gleichungen', minutes: '45 bis 60',
    vorkenntnisse: 'Gleichungen mit Klammern lösen (Modul 006), Terme aufstellen',
    lead: 'Wie viele Monate war Lea im Fitnessstudio? Wie alt ist Elif? Du lernst, aus einem Text eine Gleichung zu machen und die Antwort sicher zu finden.',
    einstieg: { html: '<p>Die Klasse 8c plant eine Fahrt. Der Bus kostet <b>120 €</b> Grundpreis und zusätzlich <b>9 €</b> pro Person. Die Klassenkasse hat genau <b>345 €</b>.</p><p class="note">Wie viele Personen können mitfahren?</p><p>Solche Fragen kannst du mit einer Gleichung lösen: 120 + 9x = 345. In diesem Modul übst du den ganzen Weg: Text lesen, Variable festlegen, Gleichung aufstellen, lösen, prüfen und einen Antwortsatz schreiben.</p>' },
    ziele: ['Ich lege fest, wofür die Variable x steht.', 'Ich übersetze Texte in Terme und Gleichungen.', 'Ich löse die Gleichung und mache die Probe am Text.', 'Ich schreibe einen vollständigen Antwortsatz.', 'Ich löse Zahlenrätsel, Alters-, Umfangs- und Kostenaufgaben.'],
    fachwoerter: [['Variable', 'Ein Buchstabe, meist x, für die gesuchte Zahl. Lege immer fest, wofür x steht.'], ['Gleichung aufstellen', 'Den Text in eine Gleichung übersetzen: Was ist gleich groß?'], ['Grundgebühr', 'Ein fester Betrag, der nur einmal bezahlt wird, egal wie viel man nutzt.'], ['Antwortsatz', 'Ein ganzer Satz, der die Frage aus dem Text beantwortet, mit Einheit.']],
    diagnose: [
      { q: 'Wie schreibt man „das Dreifache einer Zahl x, vermehrt um 5“?', options: ['3x + 5', '3(x + 5)', 'x + 3 + 5', 'Weiß ich noch nicht'], answer: 0, why: 'Zuerst das Dreifache: 3x. Dann + 5.', review: 'Terme aufstellen (Klasse 7)' },
      { q: 'Löse: 4(x − 2) = 2x + 6', options: ['x = 7', 'x = 4', 'x = 1', 'Weiß ich noch nicht'], answer: 0, why: '4x − 8 = 2x + 6 ⇒ 2x = 14 ⇒ x = 7.', review: 'Gleichungen mit Klammern (Modul 006)' },
      { q: 'Wie berechnet man den Umfang eines Rechtecks mit Länge a und Breite b?', options: ['2 · (a + b)', 'a · b', 'a + b', 'Weiß ich noch nicht'], answer: 0, why: 'Zwei Längen und zwei Breiten: 2a + 2b = 2(a + b).', review: 'Umfang von Rechtecken' },
      { q: 'Jan ist heute x Jahre alt. Wie alt ist er in 5 Jahren?', options: ['x + 5', '5x', 'x − 5', 'Weiß ich noch nicht'], answer: 0, why: 'In 5 Jahren kommen 5 Jahre dazu: x + 5.', review: 'Terme mit Variablen deuten' }],
    erklaerung:
      '<h3>1. Der Weg vom Text zur Antwort</h3><div class="merk"><b>Merke: Fünf Schritte</b><ol><li><b>Variable festlegen:</b> Was ist gesucht? „x = Anzahl der Personen“.</li><li><b>Terme aufstellen:</b> Schreibe alle Größen aus dem Text mit x.</li><li><b>Gleichung aufstellen:</b> Was ist gleich groß?</li><li><b>Lösen</b> mit Äquivalenzumformungen.</li><li><b>Probe am Text</b> und <b>Antwortsatz</b>.</li></ol></div>' +
      '<h3>2. Das Beispiel vom Anfang</h3><p>x = Anzahl der Personen. Kosten: 120 + 9x. Das Geld reicht genau: 120 + 9x = 345.</p><p>9x = 225 &nbsp; <small>| − 120</small><br>x = 25 &nbsp; <small>| : 9</small></p><p><b>Probe:</b> 120 € + 25 · 9 € = 120 € + 225 € = 345 €. <b>Antwort:</b> Es können 25 Personen mitfahren.</p>' +
      '<h3>3. Typische Textbausteine</h3><table class="tab"><tr><th>Text</th><th>Term</th></tr><tr><td>das Doppelte von x</td><td>2x</td></tr><tr><td>um 4 größer als x</td><td>x + 4</td></tr><tr><td>um 3 vermindert</td><td>− 3</td></tr><tr><td>die Summe aus x und 5, mal 2</td><td>2(x + 5)</td></tr><tr><td>in 6 Jahren (Alter)</td><td>x + 6</td></tr><tr><td>drei aufeinanderfolgende Zahlen</td><td>x, x + 1, x + 2</td></tr></table>' +
      '<h3>4. Tipp: Tabelle oder Skizze</h3><p>Bei Altersaufgaben hilft eine Tabelle mit „heute“ und „später“. Bei Figuren hilft eine Skizze, in die du x einträgst.</p>' + rectSketch('Länge: x + 4', 'x') +
      '<p>Ist ein Rechteck 4 cm länger als breit und hat 40 cm Umfang, dann gilt: 2 · (x + x + 4) = 40, also 4x + 8 = 40 und x = 8. Es ist 8 cm breit und 12 cm lang.</p>' +
      '<p class="note"><b>Wichtig:</b> Prüfe die Lösung immer am <b>Text</b>, nicht nur an deiner Gleichung. Denn auch die Gleichung kann falsch aufgestellt sein.</p>',
    entdecken: {
      html: '<p>Ein Busunternehmen verlangt einen Grundpreis und einen Preis pro Person. Stelle die Werte ein. Die Gleichung und ihre Lösung passen sich an.</p><div class="ctl"><label>Grundpreis = <b id="v_g"></b> <input type="range" id="r_g" min="60" max="200" step="20" value="120"></label><label>pro Person = <b id="v_p"></b> <input type="range" id="r_p" min="5" max="15" step="1" value="9"></label><label>Klassenkasse = <b id="v_k"></b> <input type="range" id="r_k" min="210" max="495" step="15" value="345"></label></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var g = +root.querySelector('#r_g').value, p = +root.querySelector('#r_p').value, k = +root.querySelector('#r_k').value;
          root.querySelector('#v_g').textContent = g + ' €'; root.querySelector('#v_p').textContent = p + ' €'; root.querySelector('#v_k').textContent = k + ' €';
          var x = (k - g) / p, full = Math.floor(x + 1e-9);
          /* Balken: Grundpreis + Personen bis 30 */
          var W = 320, maxv = Math.max(k, g + p * (full + 1)), u = W / maxv, s = '<svg class="viz" viewBox="0 0 340 110" role="img" aria-label="Kostenbalken" style="max-width:520px">';
          s += '<rect x="10" y="14" width="' + g * u + '" height="30" fill="#5b3fa0"/><text x="' + (10 + g * u / 2) + '" y="34" font-size="12" fill="#fff" text-anchor="middle" font-weight="700">' + (g * u >= 72 ? 'Grundpreis' : 'G') + '</text>';
          for (var i = 0; i < full; i++) s += '<rect x="' + (10 + (g + i * p) * u) + '" y="14" width="' + p * u + '" height="30" fill="' + (i % 2 ? '#f6d9a8' : '#fbe7c6') + '" stroke="#d97706" stroke-width="0.6"/>';
          s += '<rect x="10" y="56" width="' + k * u + '" height="22" fill="#efeafb" stroke="#3d2a73" stroke-width="2"/><text x="14" y="72" font-size="12" font-weight="700" fill="#3d2a73">Klassenkasse ' + k + ' €</text>';
          s += '<text x="10" y="100" font-size="11" fill="#5a5670">Jedes helle Kästchen ist eine Person: ' + Math.max(full, 0) + ' Personen.</text></svg>';
          root.querySelector('#e_g').innerHTML = s;
          var exact = Math.abs(x - Math.round(x)) < 1e-9;
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">' + g + ' + ' + p + 'x = ' + k + '</p><p>' + p + 'x = ' + (k - g) + ' &nbsp; <small>| − ' + g + '</small><br>x ' + (Math.abs(x - Math.round(x)) < 1e-9 ? '= ' : '≈ ') + M.fmtNum(Math.round(x * 100) / 100) + ' &nbsp; <small>| : ' + p + '</small></p>' +
            '<p class="note">' + (x < 0 ? 'Die Kasse reicht nicht einmal für den Grundpreis.' : exact ? 'Das Geld reicht <b>genau</b> für ' + x + ' Personen.' : 'Die Lösung ist keine ganze Zahl. Im Antwortsatz musst du abrunden: Es können <b>' + full + ' Personen</b> mitfahren. Es bleiben ' + (k - g - full * p) + ' € übrig.') + '</p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: Die Gleichung beschreibt die Situation. Ob die Lösung sinnvoll ist, entscheidest du am Text, zum Beispiel durch Abrunden bei Personen.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Altersrätsel', q: 'Ein Vater ist heute 4-mal so alt wie seine Tochter. In 6 Jahren ist er nur noch 3-mal so alt wie sie. Wie alt sind beide heute?',
      steps: ['Variable festlegen: x = Alter der Tochter heute. Dann ist der Vater heute 4x Jahre alt.', 'In 6 Jahren: Tochter x + 6, Vater 4x + 6. Gleichung: 4x + 6 = 3(x + 6).', 'Lösen: 4x + 6 = 3x + 18 &nbsp; <small>| − 3x</small> ⇒ x + 6 = 18 &nbsp; <small>| − 6</small> ⇒ x = 12.', 'Probe am Text: Heute 12 und 48 Jahre. In 6 Jahren 18 und 54 Jahre, und 3 · 18 = 54. Stimmt.', 'Antwortsatz: Die Tochter ist heute 12 Jahre alt, der Vater 48 Jahre.'] },
    tasks: { gen: gen, plan: { G: ['welche:1', 'zahl:1', 'kosten:2', 'umfang:1'], S: ['welche:1', 'zahl:1', 'kosten:2', 'umfang:2', 'folge:2'], E: ['zahl:2', 'umfang:2', 'folge:3', 'alter:3', 'aufteilen:2', 'tarif:3'] },
      extra: 'sparen', test: ['welche:1', 'zahl:1', 'kosten:2', 'umfang:2', 'folge:2', 'aufteilen:2'] },
    lerncheck: ['Ich lege fest, wofür x steht.', 'Ich stelle zu einem Text eine passende Gleichung auf.', 'Ich löse die Gleichung und mache die Probe am Text.', 'Ich schreibe einen Antwortsatz mit Einheit.']
  };
})();
