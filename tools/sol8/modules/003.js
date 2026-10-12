/* Modul 003 · Klammerterme: ausmultiplizieren und ausklammern */
var MODULE = (function () {
  var T = M.tpretty, poly = M.poly, mono = M.mono;
  function show(s) { return '<span class="big-math">' + T(s) + '</span>'; }
  /* Term-Strings für die Prüfung (ohne Sonderzeichen) */
  function lin(a, b, v) { v = v || 'x'; var s = ''; if (a) s += (a === 1 ? '' : a === -1 ? '-' : a) + v; if (b) s += (b > 0 && a ? '+' : '') + b; return s || '0'; }
  function sgn(c) { return c < 0 ? '− ' + Math.abs(c) : '+ ' + c; }
  function inner(b, c, v) { v = v || 'x'; return (b === 1 ? '' : b) + v + ' ' + sgn(c); }
  function termIn(label) { return { kind: 'term', label: label || 'Term ohne Klammern', placeholder: 'z. B. 3x + 12' }; }
  var gen = {
    aus1: function () {
      var a = M.rnd(2, 9), c = M.rnd(1, 9);
      var inp = termIn(); inp.answer = lin(a, a * c); inp.form = 'expanded';
      return { src: a + '(x+' + c + ')', skill: 'Ausmultiplizieren', level: 1, q: 'Multipliziere aus. ' + show(a + '(x + ' + c + ')'), inputs: [inp],
        hints: ['Multipliziere jeden Summanden in der Klammer mit ' + a + '.', a + ' · x = ' + a + 'x und ' + a + ' · ' + c + ' = ' + a * c + '.', 'Schreibe beides mit Pluszeichen zusammen.'],
        solution: T(a + '(x + ' + c + ') = ' + a + ' · x + ' + a + ' · ' + c + ' = ' + poly([[a, 'x'], [a * c, '']])),
        mistakes: function (v) { if (M.termEq(v[0], lin(a, c))) return 'Du hast nur das x mit ' + a + ' multipliziert. Auch die ' + c + ' in der Klammer muss mit ' + a + ' malgenommen werden.'; if (M.termEq(v[0], lin(0, a + c)) || M.termEq(v[0], lin(a, a + c))) return 'Achte darauf: ' + a + ' wird mit jedem Summanden <b>multipliziert</b>, nicht addiert.'; return null; } };
    },
    aus2: function () {
      var a = M.nz(-6, 7), b = M.rnd(2, 5), c = M.nz(-9, 9); if (a === 1) a = 3;
      var inp = termIn(); inp.answer = lin(a * b, a * c); inp.form = 'expanded';
      var A = a < 0 ? '(' + a + ')' : a;
      return { src: a + '*(' + b + 'x+(' + c + '))', skill: 'Ausmultiplizieren mit Vorzeichen', q: 'Multipliziere aus. ' + show(a + '(' + inner(b, c) + ')'), inputs: [inp],
        hints: ['Rechne ' + A + ' · ' + b + 'x und ' + A + ' · (' + c + ').', 'Vorzeichenregel: Minus mal Minus ergibt Plus, Minus mal Plus ergibt Minus.', A + ' · ' + b + 'x = ' + T(mono(a * b, 'x', true)) + ' und ' + A + ' · (' + c + ') = ' + (a * c) + '.'],
        solution: T(a + '(' + inner(b, c) + ') = ' + poly([[a * b, 'x'], [a * c, '']])),
        mistakes: function (v) { if (M.termEq(v[0], lin(a * b, -a * c))) return 'Prüfe das Vorzeichen der Zahl: ' + A + ' · (' + c + ') = ' + a * c + '.'; if (M.termEq(v[0], lin(a * b, c))) return 'Auch die Zahl ' + c + ' muss mit ' + A + ' multipliziert werden.'; return null; } };
    },
    minus: function () {
      var c = M.nz(-9, 9), b = M.rnd(1, 4), useA = Math.random() < 0.5, a = useA ? -M.rnd(2, 5) : -1;
      var inp = termIn(); inp.answer = lin(a * b, a * c); inp.form = 'expanded';
      var shown = (a === -1 ? '−(' : a + '(') + inner(b, c) + ')';
      return { src: a + '*(' + b + 'x+(' + c + '))', skill: 'Minus vor der Klammer', q: 'Löse die Klammer auf. ' + show(shown), inputs: [inp],
        hints: [a === -1 ? 'Ein Minus vor der Klammer bedeutet: mal (−1).' : 'Multipliziere jeden Summanden mit ' + a + '.', 'Beim Auflösen drehen sich alle Vorzeichen in der Klammer um.', 'Aus ' + T(inner(b, c)) + ' wird ' + T(poly([[a * b, 'x'], [a * c, '']])) + '.'],
        solution: T(shown + ' = ' + poly([[a * b, 'x'], [a * c, '']])),
        mistakes: function (v) { if (M.termEq(v[0], lin(a * b, -a * c)) || M.termEq(v[0], lin(-a * b, a * c))) return 'Fast. Bei einem Minus vor der Klammer ändern sich <b>alle</b> Vorzeichen in der Klammer.'; return null; } };
    },
    ausx: function () {
      var a = M.rnd(1, 4), b = M.rnd(1, 5), c = M.nz(-8, 8);
      var inp = termIn('Term ohne Klammern (x² schreibst du x^2)'); inp.answer = (a * b === 1 ? '' : a * b) + 'x^2' + (a * c > 0 ? '+' : '') + (a * c) + 'x'; inp.form = 'expanded';
      var f = (a === 1 ? '' : a) + 'x';
      return { src: a + 'x*(' + b + 'x+(' + c + '))', skill: 'Ausmultiplizieren mit Variable', level: 3, q: 'Multipliziere aus. ' + show(f + '(' + inner(b, c) + ')'), inputs: [inp],
        hints: ['Multipliziere ' + f + ' mit ' + b + 'x und mit ' + c + '.', 'x · x = x². Also ist ' + f + ' · ' + b + 'x = ' + T(mono(a * b, 'x²', true)) + '.', f + ' · (' + c + ') = ' + T(mono(a * c, 'x', true)) + '.'],
        solution: T(f + '(' + inner(b, c) + ') = ' + poly([[a * b, 'x²'], [a * c, 'x']])) };
    },
    ein1: function () {
      var k = M.rnd(2, 9), m, n; do { m = M.rnd(1, 6); n = M.rnd(1, 9); } while (M.gcd(m, n) !== 1 || (m === 1 && n === 1));
      var inp = { kind: 'term', label: 'Ausgeklammerter Term', placeholder: 'z. B. 3(2x + 5)', answer: k + '(' + lin(m, n) + ')', form: 'factored', factor: String(k) };
      return { src: k * m + 'x+' + k * n, skill: 'Ausklammern', level: 1, q: 'Klammere den größten gemeinsamen Faktor aus. ' + show(poly([[k * m, 'x'], [k * n, '']])), inputs: [inp],
        hints: ['Suche den größten gemeinsamen Teiler von ' + k * m + ' und ' + k * n + '.', 'Der größte gemeinsame Teiler ist ' + k + '. Er kommt vor die Klammer.', 'Teile beide Summanden durch ' + k + ': ' + T(poly([[k * m, 'x']])) + ' : ' + k + ' = ' + T(poly([[m, 'x']])) + ' und ' + k * n + ' : ' + k + ' = ' + n + '.'],
        solution: T(poly([[k * m, 'x'], [k * n, '']]) + ' = ' + k + ' · ' + poly([[m, 'x']]) + ' + ' + k + ' · ' + n + ' = ' + k + '(' + poly([[m, 'x'], [n, '']]) + ')') };
    },
    ein2: function () {
      var k = M.rnd(2, 5), m, n; do { m = M.rnd(1, 5); n = M.nz(-7, 7); } while (M.gcd(m, Math.abs(n)) !== 1);
      var f = k + 'x';
      var inp = { kind: 'term', label: 'Ausgeklammerter Term', placeholder: 'z. B. 2x(3x + 4)', answer: f + '(' + lin(m, n) + ')', form: 'factored', factor: f };
      return { src: k * m + 'x^2+(' + k * n + ')*x', skill: 'Ausklammern mit Variable', level: 3, q: 'Klammere so viel wie möglich aus. ' + show(poly([[k * m, 'x²'], [k * n, 'x']])), inputs: [inp],
        hints: ['Beide Summanden enthalten den Faktor x. Klammere auch die Zahl aus.', 'Der größte gemeinsame Faktor ist ' + f + '.', 'Teile jeden Summanden durch ' + f + '.'],
        solution: T(poly([[k * m, 'x²'], [k * n, 'x']]) + ' = ' + f + '(' + poly([[m, 'x'], [n, '']]) + ')') };
    },
    vereinf: function () {
      var a = M.rnd(2, 6), c = M.nz(-6, 6), d = M.rnd(1, 5), e = M.nz(-6, 6), sub = Math.random() < 0.4;
      var D = sub ? -d : d;
      var X = a + D, K = a * c + D * e;
      var inp = { kind: 'term', label: 'Vereinfachter Term', placeholder: 'z. B. 5x + 4', answer: lin(X, K), form: 'simplified', maxTerms: 2 };
      var shown = a + '(x ' + sgn(c) + ') ' + (sub ? '− ' : '+ ') + (d === 1 ? '' : d) + '(x ' + sgn(e) + ')';
      if (X === 0) return gen.vereinf();
      return { src: a + '*(x+(' + c + '))+(' + D + ')*(x+(' + e + '))', skill: 'Klammern auflösen und zusammenfassen', q: 'Löse die Klammern auf und fasse zusammen. ' + show(shown), inputs: [inp],
        hints: ['Löse zuerst jede Klammer einzeln auf.', T(a + '(x ' + sgn(c) + ') = ' + poly([[a, 'x'], [a * c, '']])) + ' und der zweite Teil ergibt ' + T(poly([[D, 'x'], [D * e, '']])) + '.', 'Fasse jetzt die x-Glieder und die Zahlen zusammen.'],
        solution: T(poly([[a, 'x'], [a * c, ''], [D, 'x'], [D * e, '']]) + ' = ' + poly([[X, 'x'], [K, '']])) };
    },
    luecke: function () {
      var a = M.rnd(2, 6), b = M.rnd(2, 5), c = M.rnd(1, 9);
      return { skill: 'Lücken in Klammertermen', level: 3, q: 'Was gehört in die Lücke? ' + show(a + '(□ + ' + c + ') = ' + poly([[a * b, 'x'], [a * c, '']])), inputs: [{ kind: 'term', answer: b + 'x', label: 'Term für □', placeholder: 'z. B. 2x' }],
        hints: [a + ' · □ muss ' + T(mono(a * b, 'x', true)) + ' ergeben.', 'Rechne rückwärts: ' + T(mono(a * b, 'x', true)) + ' : ' + a + '.', 'Kontrolle: ' + a + ' · ' + c + ' = ' + a * c + ' passt.'],
        solution: '□ = ' + b + 'x, denn ' + a + ' · ' + b + 'x = ' + a * b + 'x.' };
    },
    mcfehler: function () {
      var a = M.rnd(2, 9), c = M.rnd(2, 9);
      var right = poly([[a, 'x'], [a * c, '']]);
      var cand = [poly([[a, 'x'], [c, '']]), poly([[a + c, 'x']]), poly([[a, 'x'], [a + c, '']]), poly([[1, 'x'], [a * c, '']])];
      var seen = {}; seen[right] = 1; var wrong = cand.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; }).slice(0, 3);
      var opts = M.shuffle([right].concat(wrong));
      return { skill: 'Distributivgesetz erkennen', level: 1, q: 'Welcher Term ist gleichwertig zu ' + show(a + '(x + ' + c + ')') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(T), answer: opts.indexOf(right) }],
        hints: ['Jeder Summand in der Klammer wird mit ' + a + ' multipliziert.', 'Setze zur Kontrolle x = 1 ein: ' + a + ' · (1 + ' + c + ') = ' + a * (1 + c) + '.', 'Nur ein Term ergibt für x = 1 ebenfalls ' + a * (1 + c) + '.'],
        solution: T(a + '(x + ' + c + ') = ' + right) };
    },
    trick: function () {
      var add = M.rnd(2, 9), mul = M.rnd(2, 6);
      return { src: '(x+' + add + ')*' + mul + '-' + add * mul, skill: 'Zahlentrick mit Termen', level: 3, q: '<b>Zahlentrick:</b> Denke dir eine Zahl x. Addiere ' + add + '. Multipliziere das Ergebnis mit ' + mul + '. Ziehe dann ' + add * mul + ' ab.<br>Welcher Term beschreibt das Ergebnis? Vereinfache so weit wie möglich. Durch welche Zahl musst du das Ergebnis teilen, um die gedachte Zahl zurückzubekommen?',
        inputs: [{ kind: 'term', label: 'Vereinfachter Term', answer: mul + 'x', form: 'simplified', maxTerms: 1, placeholder: 'z. B. 4x' }, { kind: 'num', label: 'Teilen durch', answer: mul }],
        hints: ['Schreibe den Term Schritt für Schritt: ' + T('(x + ' + add + ') · ' + mul + ' − ' + add * mul) + '.', 'Multipliziere aus: ' + T(mul + 'x + ' + add * mul + ' − ' + add * mul) + '.', 'Die Zahlen heben sich auf. Übrig bleibt ' + mul + 'x.'],
        solution: T('(x + ' + add + ') · ' + mul + ' − ' + add * mul + ' = ' + mul + 'x + ' + add * mul + ' − ' + add * mul + ' = ' + mul + 'x') + '. Teilst du durch ' + mul + ', erhältst du x.' };
    }
  };

  return {
    id: '003', title: 'Klammerterme: ausmultiplizieren und ausklammern', bereich: 'Terme und Gleichungen', minutes: '45 bis 60',
    vorkenntnisse: 'Terme zusammenfassen, rechnen mit negativen Zahlen',
    lead: 'Wie rechnet man mit Klammern, in denen Variablen stehen? Du lernst das Distributivgesetz kennen und nutzt es in beide Richtungen.',
    einstieg: { html: '<p>Der Schulgarten soll ein neues Beet bekommen. Es ist <b>4 m</b> breit. Wie lang es wird, steht noch nicht fest: Es soll um <b>3 m</b> länger werden als ein vorhandenes Beet der Länge <b>x</b>.</p><p class="note">Zwei Schüler schreiben den Flächeninhalt verschieden auf: Lea schreibt <b>4 · (x + 3)</b>, Ben schreibt <b>4x + 12</b>. Wer hat recht?</p><p>In diesem Modul findest du heraus, warum beide Terme dasselbe bedeuten und wie du zwischen ihnen hin und her wechselst.</p>' },
    ziele: ['Ich kann das Distributivgesetz am Rechteck erklären.', 'Ich multipliziere Klammerterme aus, auch mit negativen Zahlen.', 'Ich löse Klammern mit einem Minus davor richtig auf.', 'Ich klammere den größten gemeinsamen Faktor aus.', 'Ich vereinfache Terme mit mehreren Klammern.'],
    fachwoerter: [['Distributivgesetz', 'a · (b + c) = a · b + a · c. Der Faktor vor der Klammer wird mit jedem Summanden multipliziert.'], ['Ausmultiplizieren', 'Ein Produkt mit Klammer in eine Summe ohne Klammer verwandeln.'], ['Ausklammern', 'Einen gemeinsamen Faktor vor die Klammer schreiben. Das ist die Umkehrung des Ausmultiplizierens.'], ['Gleichwertige Terme', 'Terme, die für jede eingesetzte Zahl denselben Wert haben.']],
    diagnose: [
      { q: 'Was ergibt 3x + 5x?', options: ['8x', '15x', '8x²', 'Weiß ich noch nicht'], answer: 0, why: 'Gleichartige Glieder werden addiert: 3x + 5x = 8x.', review: 'Gleichartige Terme zusammenfassen (Klasse 7)' },
      { q: 'Welchen Wert hat 2x + 3 für x = 4?', options: ['11', '24', '9', 'Weiß ich noch nicht'], answer: 0, why: '2 · 4 + 3 = 8 + 3 = 11.', review: 'Werte von Termen berechnen' },
      { q: 'Was ergibt (−3) · (−4)?', options: ['12', '−12', '−7', 'Weiß ich noch nicht'], answer: 0, why: 'Minus mal Minus ergibt Plus: 12.', review: 'Vorzeichenregeln bei der Multiplikation' },
      { q: 'Was ist der größte gemeinsame Teiler von 12 und 18?', options: ['6', '3', '36', 'Weiß ich noch nicht'], answer: 0, why: '12 = 6 · 2 und 18 = 6 · 3. Größer geht es nicht.', review: 'Teiler und größter gemeinsamer Teiler (Klasse 6)' }],
    erklaerung:
      '<h3>1. Das Distributivgesetz am Rechteck</h3><p>Ein Rechteck ist 4 breit und x + 3 lang. Du kannst den Flächeninhalt auf zwei Arten berechnen:</p><ul><li>als Ganzes: <b>4 · (x + 3)</b></li><li>in zwei Teilen: <b>4 · x + 4 · 3 = 4x + 12</b></li></ul>' +
      '<div class="merk"><b>Merke (Distributivgesetz):</b> Der Faktor vor der Klammer wird mit <b>jedem</b> Summanden in der Klammer multipliziert.<br><span class="big-math">a · (b + c) = a · b + a · c</span></div>' +
      '<h3>2. Ausmultiplizieren mit Vorzeichen</h3><p class="big-math">−3 · (2x − 5) = −6x + 15</p><p>Rechne Glied für Glied: (−3) · 2x = −6x und (−3) · (−5) = +15. Steht nur ein Minus vor der Klammer, multiplizierst du mit (−1). Dann drehen sich <b>alle</b> Vorzeichen um: −(x − 4) = −x + 4.</p>' +
      '<h3>3. Ausklammern</h3><p>Ausklammern ist der umgekehrte Weg. Du suchst den <b>größten gemeinsamen Faktor</b> und schreibst ihn vor die Klammer.</p><p class="big-math">12x + 18 = 6 · 2x + 6 · 3 = 6(2x + 3)</p><p>Kontrolle: Multiplizierst du wieder aus, musst du den Ausgangsterm erhalten.</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Schreibe 3x + 12 oder 3(x + 4). Ein Malzeichen ist nicht nötig. Für x² schreibst du x^2.</p>',
    entdecken: {
      html: '<p>Verändere die Breite a, die Länge x und die Zugabe c. Das Rechteck zeigt beide Rechenwege.</p><div class="ctl"><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="1" max="6" step="1" value="4"></label><label>x = <b id="v_x"></b> <input type="range" id="r_x" min="1" max="8" step="1" value="5"></label><label>c = <b id="v_c"></b> <input type="range" id="r_c" min="1" max="5" step="1" value="3"></label></div><svg id="e_svg" class="viz" viewBox="0 0 400 230" role="img" aria-label="Rechteckmodell zum Distributivgesetz"></svg><div id="e_txt"></div>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var a = +root.querySelector('#r_a').value, x = +root.querySelector('#r_x').value, c = +root.querySelector('#r_c').value;
          ['a', 'x', 'c'].forEach(function (k) { root.querySelector('#v_' + k).textContent = { a: a, x: x, c: c }[k]; });
          var u = Math.min(360 / (x + c), 170 / a), W1 = x * u, W2 = c * u, H = a * u, X0 = 20, Y0 = 30;
          var s = '<rect x="' + X0 + '" y="' + Y0 + '" width="' + W1 + '" height="' + H + '" fill="#cfc2ee" stroke="#3d2a73" stroke-width="2"/>' +
            '<rect x="' + (X0 + W1) + '" y="' + Y0 + '" width="' + W2 + '" height="' + H + '" fill="#f6d9a8" stroke="#3d2a73" stroke-width="2"/>' +
            '<text x="' + (X0 + W1 / 2) + '" y="22" text-anchor="middle" font-size="14" font-weight="700">x = ' + x + '</text><text x="' + (X0 + W1 + W2 / 2) + '" y="22" text-anchor="middle" font-size="14" font-weight="700">c = ' + c + '</text>' +
            '<text x="12" y="' + (Y0 + H / 2) + '" text-anchor="end" font-size="14" font-weight="700" transform="rotate(-90 12 ' + (Y0 + H / 2) + ')">a = ' + a + '</text>' +
            '<text x="' + (X0 + W1 / 2) + '" y="' + (Y0 + H / 2 + 5) + '" text-anchor="middle" font-size="15">a · x = ' + a * x + '</text><text x="' + (X0 + W1 + W2 / 2) + '" y="' + (Y0 + H / 2 + 5) + '" text-anchor="middle" font-size="13">a · c = ' + a * c + '</text>';
          root.querySelector('#e_svg').innerHTML = s;
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">' + a + ' · (' + x + ' + ' + c + ') = ' + a * (x + c) + '</p><p class="big-math">' + a + ' · ' + x + ' + ' + a + ' · ' + c + ' = ' + a * x + ' + ' + a * c + ' = ' + (a * x + a * c) + '</p><p class="note">Beide Rechnungen ergeben immer dasselbe. Darum gilt allgemein: ' + a + '(x + ' + c + ') = ' + a + 'x + ' + a * c + '.</p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Genau: Egal welche Zahlen du wählst, beide Wege führen zum selben Flächeninhalt. Das ist das Distributivgesetz.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Ausmultiplizieren und zusammenfassen', q: 'Vereinfache den Term ' + show('3(2x − 4) − (x − 5)') + '.',
      steps: ['Erste Klammer ausmultiplizieren: 3 · 2x = 6x und 3 · (−4) = −12. Also ' + T('3(2x − 4) = 6x − 12') + '.', 'Minus vor der zweiten Klammer: alle Vorzeichen drehen sich um. ' + T('−(x − 5) = −x + 5') + '.', 'Zusammensetzen: ' + T('6x − 12 − x + 5') + '.', 'x-Glieder und Zahlen zusammenfassen: ' + T('6x − x = 5x') + ' und ' + T('−12 + 5 = −7') + '. Ergebnis: <b>' + T('5x − 7') + '</b>.', 'Kontrolle mit x = 1: ' + T('3(2 − 4) − (1 − 5) = −6 + 4 = −2') + ' und ' + T('5 · 1 − 7 = −2') + '. Passt!'] },
    tasks: { gen: gen, plan: { G: ['mcfehler:1', 'aus1:1', 'aus2:2', 'ein1:1'], S: ['aus1:1', 'aus2:2', 'minus:2', 'ein1:1', 'vereinf:2'], E: ['aus2:2', 'minus:2', 'ausx:3', 'ein2:3', 'vereinf:2', 'luecke:3'] },
      extra: 'trick', test: ['aus1:1', 'aus2:2', 'minus:2', 'ein1:1', 'ein2:3', 'vereinf:2'] },
    lerncheck: ['Ich kann das Distributivgesetz an einem Rechteck erklären.', 'Ich multipliziere Klammern aus, auch mit Minuszeichen.', 'Ich klammere den größten gemeinsamen Faktor aus.', 'Ich vereinfache Terme mit mehreren Klammern.']
  };
})();
