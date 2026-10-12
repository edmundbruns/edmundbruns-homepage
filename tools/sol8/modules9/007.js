/* Modul 007 · Quadratwurzeln und reelle Zahlen (Klasse 9) */
var MODULE = (function () {
  var C1 = '#1e3a8a', CF = '#e8eefc', CA = '#d97706', CH = '#1d4ed8';
  function fm(v, d) { return M.fmtNum(Math.round(v * 1e6) / 1e6, d); }
  function sq(x) { return '<span style="white-space:nowrap">√<span style="border-top:1.5px solid currentColor;padding:0 2px">' + x + '</span></span>'; }
  function isSq(n) { var r = Math.round(Math.sqrt(n)); return r * r === n; }
  function nonSq(a, b) { var n; do { n = M.rnd(a, b); } while (isSq(n)); return n; }
  function r2(v) { return Math.round(v * 100) / 100; }
  /* unabhängige Wurzel per Intervallschachtelung (Halbierung) */
  function bisect(a) { var lo = 0, hi = Math.max(1, a); for (var i = 0; i < 60; i++) { var m = (lo + hi) / 2; if (m * m > a) hi = m; else lo = m; } return lo; }
  function numIn(label, ans, unit, tol) { var o = { kind: 'num', label: label, answer: ans }; if (unit) o.unit = unit; if (tol) o.tol = tol; return o; }
  function squareSvg(lab, side) {
    return '<svg class="viz" viewBox="0 0 260 190" role="img" aria-label="Quadrat" style="max-width:260px"><rect x="70" y="20" width="140" height="140" fill="' + CF + '" stroke="' + C1 + '" stroke-width="2.5"/>' +
      '<text x="140" y="95" font-size="15" font-weight="700" text-anchor="middle" fill="' + C1 + '">' + lab + '</text><text x="62" y="95" font-size="15" font-weight="700" text-anchor="end" fill="' + CH + '">' + side + '</text><text x="140" y="180" font-size="15" font-weight="700" text-anchor="middle" fill="' + CH + '">' + side + '</text></svg>';
  }
  var IRR = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 17, 18, 20, 24, 30, 50];

  var gen = {
    quadrat: function (lvl) {
      var n, shown, ans;
      if (lvl <= 1) { do { n = M.rnd(11, 19); } while (n % 10 === 0); shown = n; ans = n * n; }
      else if (lvl === 2) { do { n = M.rnd(13, 25); } while (n % 10 === 0); shown = n; ans = n * n; }
      else { var k = M.rnd(2, 19); while (k % 10 === 0) k = M.rnd(2, 19); n = k / 10; shown = fm(n); ans = r2(k * k / 100); }
      return { skill: 'Quadratzahlen', level: lvl, q: 'Berechne das Quadrat. <span class="big-math">' + (typeof shown === 'number' ? shown : '(' + shown + ')') + '² = ?</span>', inputs: [numIn('Ergebnis', ans)],
        hints: ['Quadrieren heißt: Die Zahl wird mit sich selbst multipliziert.', 'Rechne ' + fm(n) + ' · ' + fm(n) + '.', lvl >= 3 ? 'Rechne zuerst ' + Math.round(n * 10) + ' · ' + Math.round(n * 10) + ' = ' + Math.round(n * 10) * Math.round(n * 10) + '. Das Ergebnis hat dann zwei Nachkommastellen.' : 'Zerlege geschickt: ' + n + ' · ' + n + ' = ' + n + ' · ' + (n - n % 10) + ' + ' + n + ' · ' + (n % 10) + '.'],
        solution: fm(n) + '² = ' + fm(n) + ' · ' + fm(n) + ' = <b>' + fm(ans) + '</b>',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - 2 * n) < 1e-9) return 'Du hast mit 2 multipliziert. Quadrieren heißt: die Zahl <b>mit sich selbst</b> multiplizieren.'; if (lvl >= 3 && x !== null && Math.abs(x - ans * 10) < 1e-9) return 'Achte auf das Komma: Zehntel mal Zehntel ergibt Hundertstel, also zwei Nachkommastellen.'; return null; },
        verify: function () { return Math.abs(Math.sqrt(ans) - n) < 1e-9 ? true : 'Quadrat'; } };
    },
    wurzel: function (lvl) {
      var n, a, aS, k = 0;
      if (lvl <= 1) { n = M.rnd(4, 15); a = n * n; aS = String(a); }
      else if (lvl === 2) { n = M.rnd(11, 25); a = n * n; aS = String(a); }
      else { k = M.pick([2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 15]), dec = M.pick([10, 100]); n = k / dec; a = Math.round(k * k) / (dec * dec); aS = fm(a); }
      return { skill: 'Wurzel ziehen', level: lvl, q: 'Berechne ohne Taschenrechner. <span class="big-math">' + sq(aS) + ' = ?</span>', inputs: [numIn('Ergebnis', n)],
        hints: ['Suche die Zahl, die mit sich selbst multipliziert ' + aS + ' ergibt.', lvl >= 3 ? 'Denke ohne Komma: Welche Zahl mal sich selbst ergibt ' + k * k + '? Achte danach auf die Stellen nach dem Komma.' : 'Probiere: ' + (Math.floor(n / 5) * 5 || 1) + '² = ' + Math.pow(Math.floor(n / 5) * 5 || 1, 2) + '. Ist das zu klein oder zu groß?', 'Kontrolle durch Quadrieren: ' + fm(n) + '² = ' + aS + '.'],
        solution: sq(aS) + ' = <b>' + fm(n) + '</b>, denn ' + fm(n) + '² = ' + fm(n) + ' · ' + fm(n) + ' = ' + aS + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - a / 2) < 1e-9) return 'Die Wurzel ist nicht die Hälfte. Gesucht ist die Zahl, die <b>mit sich selbst multipliziert</b> ' + aS + ' ergibt.'; if (lvl >= 3 && (Math.abs(x - n * 10) < 1e-9 || Math.abs(x - n / 10) < 1e-9)) return 'Die Ziffern stimmen, aber das Komma nicht. Prüfe durch Quadrieren.'; if (Math.abs(x + n) < 1e-9) return 'Die Quadratwurzel ist nie negativ. Gemeint ist die positive Zahl.'; return null; },
        verify: function () { return Math.abs(bisect(a) - n) < 1e-9 ? true : 'Wurzel'; } };
    },
    zwischen: function (lvl) {
      var a = lvl <= 1 ? nonSq(5, 99) : lvl === 2 ? nonSq(101, 400) : nonSq(401, 700), lo = Math.floor(Math.sqrt(a)), hi = lo + 1;
      return { skill: 'Wurzeln einschachteln', level: lvl, q: 'Zwischen welchen zwei aufeinanderfolgenden ganzen Zahlen liegt ' + sq(a) + '? Rechne ohne Taschenrechner.<br><span class="big-math">□ &lt; ' + sq(a) + ' &lt; □</span>',
        inputs: [numIn('kleinere Zahl', lo), numIn('größere Zahl', hi)],
        hints: ['Suche die Quadratzahlen direkt unter und direkt über ' + a + '.', 'Die Quadratzahl unter ' + a + ' ist ' + lo * lo + ', die darüber ist ' + hi * hi + '.', lo * lo + ' < ' + a + ' < ' + hi * hi + '. Ziehe aus allen drei Zahlen die Wurzel.'],
        solution: lo * lo + ' &lt; ' + a + ' &lt; ' + hi * hi + ', also ' + sq(lo * lo) + ' &lt; ' + sq(a) + ' &lt; ' + sq(hi * hi) + ' und damit <b>' + lo + ' &lt; ' + sq(a) + ' &lt; ' + hi + '</b>. (Taschenrechner: ' + sq(a) + ' ≈ ' + fm(r2(Math.sqrt(a)), 2) + ')',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x === lo * lo || y === hi * hi) return 'Du hast die Quadratzahlen angegeben. Gesucht sind ihre Wurzeln, also ' + sq(lo * lo) + ' und ' + sq(hi * hi) + '.'; return null; },
        verify: function () { var w = bisect(a); return lo < w && w < hi ? true : 'Intervall'; } };
    },
    einschachteln: function (lvl) {
      var a = nonSq(lvl >= 3 ? 30 : 2, lvl >= 3 ? 150 : 60), w = Math.sqrt(a), lo = Math.floor(w * 10) / 10, hi = Math.round((lo + 0.1) * 10) / 10, g = Math.floor(w);
      return { skill: 'Intervallschachtelung (Zehntel)', level: lvl, q: 'Schachtele ' + sq(a) + ' auf <b>Zehntel</b> genau ein. Nutze den Taschenrechner nur zum Quadrieren.<br><span class="big-math">□ &lt; ' + sq(a) + ' &lt; □</span><br><small>Beide Zahlen haben eine Stelle nach dem Komma und unterscheiden sich um 0,1.</small>',
        inputs: [numIn('untere Grenze', lo), numIn('obere Grenze', hi)],
        hints: ['Zuerst ganze Zahlen: ' + g + '² = ' + g * g + ' und ' + (g + 1) + '² = ' + (g + 1) * (g + 1) + '. Also liegt ' + sq(a) + ' zwischen ' + g + ' und ' + (g + 1) + '.', 'Quadriere jetzt ' + fm(g + 0.1) + ', ' + fm(g + 0.2) + ', ' + fm(g + 0.3) + ' … bis das Quadrat größer als ' + a + ' ist.', fm(lo) + '² = ' + fm(lo * lo) + ' und ' + fm(hi) + '² = ' + fm(hi * hi) + '.'],
        solution: g + ' &lt; ' + sq(a) + ' &lt; ' + (g + 1) + ' (ganze Zahlen). Zehntel: ' + fm(lo) + '² = ' + fm(lo * lo) + ' &lt; ' + a + ' und ' + fm(hi) + '² = ' + fm(hi * hi) + ' &gt; ' + a + '. Also <b>' + fm(lo) + ' &lt; ' + sq(a) + ' &lt; ' + fm(hi) + '</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x !== null && y !== null && Math.abs(y - x - 0.1) > 1e-9) return 'Die beiden Grenzen sollen sich genau um 0,1 unterscheiden.'; if (x !== null && x * x > a) return 'Prüfe die untere Grenze: ' + fm(x) + '² = ' + fm(x * x) + ' ist schon größer als ' + a + '.'; return null; },
        verify: function () { return lo * lo < a && hi * hi > a && Math.abs(hi - lo - 0.1) < 1e-9 ? true : 'Zehntel'; } };
    },
    tr: function (lvl) {
      var a = lvl <= 1 ? nonSq(2, 50) : lvl === 2 ? nonSq(51, 500) : M.pick([nonSq(501, 2000), M.rnd(2, 99) / 10]);
      if (!(a > 0) || isSq(Math.round(a * 100))) return gen.tr(lvl);
      var w = Math.sqrt(a), ans = r2(w), lo = Math.floor(w);
      return { skill: 'Wurzel mit dem Taschenrechner', level: lvl, q: 'Berechne mit dem Taschenrechner und runde auf zwei Nachkommastellen. <span class="big-math">' + sq(fm(a)) + ' ≈ ?</span>', inputs: [numIn('Ergebnis (gerundet)', ans, '', 0.005)],
        hints: ['Taste √ und dann ' + fm(a) + ' eingeben (bei manchen Rechnern umgekehrt).', 'Überschlag: ' + lo + '² = ' + lo * lo + ' und ' + (lo + 1) + '² = ' + (lo + 1) * (lo + 1) + '. Das Ergebnis liegt also zwischen ' + lo + ' und ' + (lo + 1) + '.', 'Der Taschenrechner zeigt ' + fm(Math.floor(w * 10000) / 10000) + '… Schaue auf die dritte Nachkommastelle, um zu runden.'],
        solution: sq(fm(a)) + ' = ' + fm(Math.floor(w * 10000) / 10000) + '… ≈ <b>' + fm(ans, 2) + '</b>. Kontrolle: ' + fm(ans, 2) + '² = ' + fm(Math.round(ans * ans * 1e4) / 1e4) + ' ≈ ' + fm(a) + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - a * a) < 0.01 || Math.abs(x - a / 2) < 0.01) return 'Du hast quadriert oder halbiert. Benutze die Wurzeltaste √.'; if (Math.abs(x - Math.floor(w * 100) / 100) < 1e-9) return 'Fast: Du hast abgeschnitten statt gerundet. Ist die dritte Nachkommastelle 5 oder größer, rundest du auf.'; return null; },
        verify: function () { return Math.abs(bisect(a) - ans) <= 0.005 + 1e-12 && lo < w && w < lo + 1 ? true : 'Rundung'; } };
    },
    betrag: function (lvl) {
      var t = lvl <= 1 ? M.pick([0, 1]) : lvl === 2 ? M.pick([0, 1, 2]) : M.pick([1, 2, 3]), a, q, ans, sol, wrongNeg = false;
      if (t === 0) { a = M.pick(IRR); q = '(' + sq(a) + ')²'; ans = a; sol = 'Quadrieren hebt das Wurzelziehen auf: (' + sq(a) + ')² = ' + sq(a) + ' · ' + sq(a) + ' = <b>' + a + '</b>.'; }
      else if (t === 1) { a = M.rnd(2, 40); q = sq(a + '²'); ans = a; sol = sq(a + '²') + ' = ' + sq(a * a) + ' = <b>' + a + '</b>. Für a ≥ 0 gilt ' + sq('a²') + ' = a.'; }
      else if (t === 2) { a = M.rnd(3, 30); var b = M.pick(IRR); q = sq(a + '²') + ' + (' + sq(b) + ')²'; ans = a + b; sol = sq(a + '²') + ' = ' + a + ' und (' + sq(b) + ')² = ' + b + '. Zusammen: ' + a + ' + ' + b + ' = <b>' + (a + b) + '</b>.'; }
      else { a = M.rnd(2, 20); q = sq('(−' + a + ')²'); ans = a; wrongNeg = true; sol = 'Zuerst quadrieren: (−' + a + ')² = ' + a * a + '. Dann ' + sq(a * a) + ' = <b>' + a + '</b>. Eine Quadratwurzel ist nie negativ.'; }
      return { skill: 'Wurzel und Quadrat heben sich auf', level: lvl, q: 'Berechne ohne Taschenrechner. <span class="big-math">' + q + ' = ?</span>', inputs: [numIn('Ergebnis', ans)],
        hints: ['Wurzelziehen und Quadrieren sind Umkehroperationen. Sie heben sich (für Zahlen ≥ 0) gegenseitig auf.', t === 3 ? 'Rechne zuerst unter der Wurzel: (−' + a + ')² = ' + a * a + '.' : t === 0 ? sq(a) + ' · ' + sq(a) + ' = ' + sq(a + ' · ' + a) + ' = ' + sq(a * a) + '.' : 'Rechne unter der Wurzel: ' + a + '² = ' + a * a + '.', 'Das Ergebnis einer Quadratwurzel ist immer größer oder gleich 0.'],
        solution: sol,
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (wrongNeg && Math.abs(x + a) < 1e-9) return 'Unter der Wurzel steht (−' + a + ')² = ' + a * a + ', also eine positive Zahl. Die Wurzel daraus ist positiv.'; if (t === 1 && Math.abs(x - a * a) < 1e-9) return 'Du hast nur quadriert. Ziehe danach noch die Wurzel.'; return null; },
        verify: function () { var v = t === 0 ? Math.pow(Math.sqrt(a), 2) : t === 1 ? Math.sqrt(a * a) : t === 2 ? Math.sqrt(a * a) + Math.pow(Math.sqrt(ans - a), 2) : Math.sqrt(Math.pow(-a, 2)); return Math.abs(v - ans) < 1e-9 ? true : 'Umkehr'; } };
    },
    irrational: function (lvl) {
      var findIrr = Math.random() < 0.6 || lvl <= 1;
      function per(d) { return '0,<span style="text-decoration:overline">' + d + '</span>'; }
      var irr = [sq(M.pick(IRR)), sq(M.pick([2, 3, 5, 7])), 'π', sq(nonSq(21, 99))];
      var rat = [sq(M.pick([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144])), fm(M.rnd(11, 99) / 100), M.fhtml(M.pick([M.F(3, 8), M.F(2, 7), M.F(5, 6), M.F(7, 4)])), per(M.rnd(1, 8)), '−' + M.rnd(2, 15), sq('0,' + M.pick(['04', '09', '16', '25', '36', '49', '64', '81']))];
      var right, others;
      if (findIrr) { right = M.pick(irr.slice(0, 3)); others = M.shuffle(rat).slice(0, 3); }
      else { right = M.pick(rat); var ir = M.shuffle(irr); others = []; ir.forEach(function (x) { if (others.length < 3 && others.indexOf(x) < 0) others.push(x); }); if (others.length < 3) return gen.irrational(lvl); }
      var strip = function (h) { return String(h).replace(/<[^>]+>/g, ''); }, seen = {}; seen[strip(right)] = 1;
      for (var i = 0; i < others.length; i++) { if (seen[strip(others[i])]) return gen.irrational(lvl); seen[strip(others[i])] = 1; }
      var opts = M.shuffle([right].concat(others)), ans = opts.indexOf(right);
      return { skill: findIrr ? 'Irrationale Zahl erkennen' : 'Rationale Zahl erkennen', level: lvl, q: 'Welche dieser Zahlen ist <b>' + (findIrr ? 'irrational' : 'rational') + '</b>?' + (findIrr ? '' : ' Die anderen drei sind irrational.'),
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ans }],
        hints: ['Rationale Zahlen kann man als Bruch schreiben. Ihre Dezimaldarstellung bricht ab oder ist periodisch.', 'Die Wurzel aus einer Quadratzahl ist rational, zum Beispiel ' + sq(49) + ' = 7 oder ' + sq('0,25') + ' = 0,5. Die Wurzel aus einer natürlichen Zahl, die keine Quadratzahl ist, ist irrational.', 'Auch π ist irrational. Ein Strich über Ziffern bedeutet: periodisch, also rational.'],
        solution: 'Richtig ist <b>' + right + '</b>. ' + (findIrr ? 'Diese Zahl hat unendlich viele Nachkommastellen ohne Periode.' : 'Diese Zahl lässt sich als Bruch schreiben.') + ' Rational sind: ganze Zahlen, Brüche, abbrechende und periodische Dezimalzahlen sowie Wurzeln aus Quadratzahlen.',
        mistakes: function (v) { var c = opts[+v[0]]; if (c && /√/.test(c) && findIrr) return 'Nicht jede Wurzel ist irrational. Die Wurzel aus einer Quadratzahl ist eine rationale Zahl.'; if (c && /overline/.test(c)) return 'Eine periodische Dezimalzahl ist rational. Man kann sie als Bruch schreiben, zum Beispiel 0,3 periodisch = 1/3.'; return null; },
        verify: function () { var irrS = irr.map(strip), ok = opts.filter(function (o) { return irrS.indexOf(strip(o)) >= 0; }).length; return ok === (findIrr ? 1 : 3) ? true : 'Anzahl irrational'; } };
    },
    regel: function (lvl) {
      var t = lvl <= 1 ? 0 : M.pick([0, 1]), r, a, b, q, ans, sol;
      if (t === 0) {
        var pairs = []; for (r = 2; r <= (lvl >= 3 ? 20 : 12); r++) for (a = 2; a < r * r; a++) if ((r * r) % a === 0 && !isSq(a) && !isSq(r * r / a) && a <= r * r / a) pairs.push([a, r * r / a, r]);
        var p = M.pick(pairs); a = p[0]; b = p[1]; r = p[2]; if (Math.random() < 0.5) { var tt = a; a = b; b = tt; }
        q = sq(a) + ' · ' + sq(b); ans = r; sol = sq(a) + ' · ' + sq(b) + ' = ' + sq(a + ' · ' + b) + ' = ' + sq(a * b) + ' = <b>' + r + '</b>';
      } else {
        b = M.pick([2, 3, 5, 6, 7, 10]); r = M.rnd(2, lvl >= 3 ? 12 : 9); a = r * r * b;
        q = sq(a) + ' : ' + sq(b); ans = r; sol = sq(a) + ' : ' + sq(b) + ' = ' + sq(a + ' : ' + b) + ' = ' + sq(r * r) + ' = <b>' + r + '</b>';
      }
      return { skill: 'Rechenregeln für Wurzeln', level: lvl, q: 'Berechne ohne Taschenrechner. Fasse dazu unter einer Wurzel zusammen. <span class="big-math">' + q + ' = ?</span>', inputs: [numIn('Ergebnis', ans)],
        hints: ['Es gilt ' + sq('a') + ' · ' + sq('b') + ' = ' + sq('a · b') + ' und ' + sq('a') + ' : ' + sq('b') + ' = ' + sq('a : b') + ' (für a, b ≥ 0, b ≠ 0 beim Teilen).', t === 0 ? 'Schreibe ' + sq(a + ' · ' + b) + ' = ' + sq(a * b) + '.' : 'Schreibe ' + sq(a + ' : ' + b) + ' = ' + sq(a / b) + '.', 'Unter der Wurzel steht jetzt die Quadratzahl ' + r * r + '.'],
        solution: sol,
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - r * r) < 1e-9) return 'Du hast ' + r * r + ' richtig berechnet. Ziehe jetzt noch die Wurzel daraus.'; return null; },
        verify: function () { var v = t === 0 ? Math.sqrt(a) * Math.sqrt(b) : Math.sqrt(a) / Math.sqrt(b); return Math.abs(v - ans) < 1e-9 && !isSq(a) && !isSq(b) ? true : 'Regel'; } };
    },
    flaeche: function (lvl) {
      var ctx = M.pick([['Ein quadratisches Gemüsebeet', 'm²', 'm', 'einen Zaun', 'der Zaun'], ['Eine quadratische Terrasse', 'm²', 'm', 'eine Randleiste', 'die Randleiste'], ['Ein quadratisches Fenster', 'dm²', 'dm', 'eine Dichtung', 'die Dichtung'], ['Eine quadratische Weide', 'm²', 'm', 'einen Elektrozaun', 'der Elektrozaun']]);
      var A, s, inputs, sol, hints;
      if (lvl <= 1) { s = M.rnd(4, 25); A = s * s; inputs = [numIn('Seitenlänge a', s, ctx[2])]; }
      else { A = ctx[1] === 'dm²' ? nonSq(20, 150) : nonSq(lvl >= 3 ? 150 : 20, lvl >= 3 ? 900 : 200); s = r2(Math.sqrt(A)); inputs = [numIn('Seitenlänge a (auf 2 Stellen gerundet)', s, ctx[2], 0.005)]; }
      var U = r2(4 * Math.sqrt(A));
      if (lvl >= 3) inputs.push(numIn('Länge für ' + ctx[3] + ' (Umfang)', U, ctx[2], 0.03));
      var q = ctx[0] + ' hat einen Flächeninhalt von <b>' + fm(A) + ' ' + ctx[1] + '</b>. Wie lang ist eine Seite?' + (lvl >= 3 ? ' Rundherum soll ' + ctx[3] + ' angebracht werden. Wie lang muss ' + ctx[4] + ' sein?' : '') + squareSvg('A = ' + fm(A) + ' ' + ctx[1], 'a');
      return { skill: 'Seitenlänge aus der Fläche', level: lvl, q: q, inputs: inputs,
        hints: ['Für ein Quadrat gilt A = a · a = a². Die Seitenlänge ist also a = ' + sq('A') + '.', 'Rechne a = ' + sq(fm(A)) + (lvl <= 1 ? '. Welche Zahl mal sich selbst ergibt ' + A + '?' : ' mit dem Taschenrechner und runde auf zwei Nachkommastellen.'), lvl >= 3 ? 'Umfang u = 4 · a. Rechne am besten mit dem ungerundeten Wert weiter.' : 'Kontrolle: a · a muss etwa ' + fm(A) + ' ergeben.'],
        solution: 'a = ' + sq(fm(A) + ' ' + ctx[1]) + (lvl <= 1 ? ' = <b>' + s + ' ' + ctx[2] + '</b>, denn ' + s + ' · ' + s + ' = ' + A + '.' : ' ≈ <b>' + fm(s, 2) + ' ' + ctx[2] + '</b>.') + (lvl >= 3 ? '<br>Umfang: u = 4 · a ≈ 4 · ' + fm(Math.floor(Math.sqrt(A) * 1e4) / 1e4) + ' ' + ctx[2] + ' ≈ <b>' + fm(U, 2) + ' ' + ctx[2] + '</b>.' : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (Math.abs(x - A / 4) < 0.01) return 'Du hast durch 4 geteilt. Das wäre richtig, wenn der <b>Umfang</b> gegeben wäre. Bei der Fläche ziehst du die Wurzel.'; if (Math.abs(x - A / 2) < 0.01) return 'Die Seitenlänge ist nicht die Hälfte der Fläche. Gesucht ist a mit a · a = ' + fm(A) + '.'; return null; },
        verify: function () { return Math.abs(bisect(A) - s) <= 0.005 + 1e-12 && Math.abs(4 * bisect(A) - U) <= 0.005 + 1e-12 ? true : 'Seite'; } };
    },
    verdoppeln: function () {
      var s = M.rnd(2, 9), k = M.pick([2, 3, 5]), kw = ['', '', 'doppelte', 'dreifache', '', 'fünffache'][k], A = s * s, A2 = k * A, s2 = r2(Math.sqrt(A2)), f = r2(Math.sqrt(k));
      return { skill: 'Fläche vervielfachen', level: 3, q: 'Ein quadratischer Sandkasten hat die Seitenlänge <b>' + s + ' m</b>. Ein neuer quadratischer Sandkasten soll die <b>' + ['', '', 'doppelte', 'dreifache', '', 'fünffache'][k] + ' Fläche</b> haben.<br>a) Wie lang ist eine Seite des neuen Sandkastens?<br>b) Mit welchem Faktor wurde die Seitenlänge multipliziert? (Seite neu : Seite alt)<br><small>Runde auf zwei Nachkommastellen. Lena meint: „' + kw.charAt(0).toUpperCase() + kw.slice(1) + ' Fläche, also ' + kw + ' Seitenlänge.“ Stimmt das?</small>',
        inputs: [numIn('a) neue Seitenlänge', s2, 'm', 0.005), numIn('b) Faktor', f, '', 0.005)],
        hints: ['Alte Fläche: ' + s + ' m · ' + s + ' m = ' + A + ' m². Neue Fläche: ' + k + ' · ' + A + ' m² = ' + A2 + ' m².', 'Neue Seitenlänge: ' + sq(A2) + ' m.', 'Faktor: ' + sq(A2) + ' : ' + s + ' = ' + sq(A2 + ' : ' + A) + ' = ' + sq(k) + '.'],
        solution: 'Neue Fläche: ' + k + ' · ' + A + ' m² = ' + A2 + ' m². Neue Seite: ' + sq(A2) + ' m ≈ <b>' + fm(s2, 2) + ' m</b>.<br>Faktor: ' + sq(k * s * s) + ' : ' + s + ' = ' + sq(k) + ' ≈ <b>' + fm(f, 2) + '</b>. Die Seite wird also nur mit ' + sq(k) + ' multipliziert, nicht mit ' + k + '. Lena irrt sich: Bei ' + k + '-facher Seitenlänge wäre die Fläche ' + k * k + '-mal so groß.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - k * s) < 1e-9) return 'Das ist Lenas Fehler: Mit ' + k + '-facher Seitenlänge wird die Fläche ' + k * k + '-mal so groß. Berechne die neue Fläche und ziehe die Wurzel.'; return null; },
        verify: function () { return Math.abs(bisect(A2) - s2) <= 0.005 && Math.abs(bisect(k) - f) <= 0.005 && Math.abs(bisect(A2) / s - bisect(k)) < 1e-9 ? true : 'Faktor'; } };
    }
  };

  return {
    id: '007', title: 'Quadratwurzeln und reelle Zahlen', bereich: 'Zahlen und Größen', minutes: '45 bis 60',
    vorkenntnisse: 'Quadrieren, Flächeninhalt von Quadraten, Brüche und Dezimalzahlen',
    lead: 'Ein Quadrat hat 2 m² Fläche. Wie lang ist seine Seite? Du lernst das Wurzelziehen kennen und entdeckst Zahlen, die sich nie als Bruch schreiben lassen.',
    einstieg: { html: '<p>Die Klasse 9b legt im Schulgarten ein <b>quadratisches Kräuterbeet</b> an. Es soll genau <b>36 m²</b> groß sein. Wie lang muss jede Seite werden? Das ist leicht: 6 m, denn 6 · 6 = 36.</p><p class="note">Und wenn das Beet nur <b>2 m²</b> groß sein soll? Welche Zahl ergibt mit sich selbst multipliziert genau 2? Probiere: 1,4 · 1,4 = 1,96 und 1,5 · 1,5 = 2,25 …</p><p>In diesem Modul lernst du das <b>Wurzelziehen</b> als Umkehrung des Quadrierens kennen. Dabei stößt du auf ganz neue Zahlen: die <b>irrationalen Zahlen</b>.</p>' },
    ziele: ['Ich kenne die Quadratzahlen bis 25² und ziehe daraus die Wurzel.', 'Ich schachtele Wurzeln zwischen zwei ganzen Zahlen und auf Zehntel genau ein.', 'Ich berechne Wurzeln mit dem Taschenrechner und runde sinnvoll.', 'Ich unterscheide rationale und irrationale Zahlen.', 'Ich nutze Rechenregeln für Wurzeln und berechne Seitenlängen von Quadraten.'],
    fachwoerter: [['Quadratwurzel', sq('a') + ' ist die nicht negative Zahl, die mit sich selbst multipliziert a ergibt. Beispiel: ' + sq(25) + ' = 5.'], ['Radikand', 'Die Zahl unter dem Wurzelzeichen. Sie darf nicht negativ sein.'], ['Intervallschachtelung', 'Eine Zahl wird immer enger zwischen zwei Grenzen eingeschlossen.'], ['Irrationale Zahl', 'Eine Zahl, die man nicht als Bruch schreiben kann. Ihre Nachkommastellen enden nie und wiederholen sich nicht, zum Beispiel ' + sq(2) + ' oder π.'], ['Reelle Zahlen', 'Alle rationalen und irrationalen Zahlen zusammen.']],
    diagnose: [
      { q: 'Was ergibt 7²?', options: ['49', '14', '72', 'Weiß ich noch nicht'], answer: 0, why: '7² = 7 · 7 = 49.', review: 'Potenzen und Quadratzahlen' },
      { q: 'Ein Quadrat hat die Seitenlänge 6 cm. Wie groß ist sein Flächeninhalt?', options: ['36 cm²', '24 cm²', '12 cm²', 'Weiß ich noch nicht'], answer: 0, why: 'A = a · a = 6 cm · 6 cm = 36 cm².', review: 'Flächeninhalt von Quadraten (Klasse 5/6)' },
      { q: 'Was ergibt 0,3 · 0,3?', options: ['0,09', '0,9', '0,6', 'Weiß ich noch nicht'], answer: 0, why: '3 · 3 = 9, und Zehntel mal Zehntel ergibt Hundertstel: 0,09.', review: 'Dezimalzahlen multiplizieren' },
      { q: 'Welcher Bruch hat den Wert 0,25?', options: [M.fhtml(M.F(1, 4)), M.fhtml(M.F(2, 5)), M.fhtml(M.F(1, 25)), 'Weiß ich noch nicht'], answer: 0, why: '1 : 4 = 0,25.', review: 'Brüche und Dezimalzahlen umwandeln' }],
    erklaerung:
      '<h3>1. Wurzelziehen ist die Umkehrung des Quadrierens</h3><p>Ein Quadrat mit der Seitenlänge 5 cm hat die Fläche 5² = 25 cm². Umgekehrt: Kennst du die Fläche 25 cm², findest du die Seite mit der <b>Quadratwurzel</b>: ' + sq(25) + ' = 5.</p>' +
      '<div class="merk"><b>Merke:</b> Die Quadratwurzel ' + sq('a') + ' (für a ≥ 0) ist die <b>nicht negative</b> Zahl, die mit sich selbst multipliziert a ergibt.<br>' + sq('a') + ' · ' + sq('a') + ' = a &nbsp; und &nbsp; ' + sq('a²') + ' = a &nbsp; (für a ≥ 0)</div>' +
      '<p>Aus negativen Zahlen kann man keine Quadratwurzel ziehen, denn jede Zahl mal sich selbst ist positiv oder 0.</p>' +
      '<h3>2. Quadratzahlen kennen</h3><table class="tab"><tr><th>n</th><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td></tr><tr><th>n²</th><td>121</td><td>144</td><td>169</td><td>196</td><td>225</td><td>256</td><td>289</td></tr><tr><th>n</th><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr><tr><th>n²</th><td>324</td><td>361</td><td>400</td><td>441</td><td>484</td><td>529</td><td>576</td></tr></table><p>Und 25² = 625. Bei Dezimalzahlen hilft dir: 0,7² = 0,49, also ' + sq('0,49') + ' = 0,7.</p>' +
      '<h3>3. Einschachteln</h3><p>' + sq(30) + ' ist keine ganze Zahl. Aber 25 &lt; 30 &lt; 36, also gilt <b>5 &lt; ' + sq(30) + ' &lt; 6</b>. Genauer geht es mit Zehnteln: 5,4² = 29,16 und 5,5² = 30,25. Also 5,4 &lt; ' + sq(30) + ' &lt; 5,5. So kann man immer weiter machen. Das nennt man <b>Intervallschachtelung</b>. Der Taschenrechner zeigt ' + sq(30) + ' ≈ 5,48.</p>' +
      '<h3>4. Rationale und irrationale Zahlen</h3><p>Bei ' + sq(2) + ' = 1,41421356… hören die Nachkommastellen nie auf und es gibt keine Periode. Solche Zahlen kann man nicht als Bruch schreiben. Sie heißen <b>irrational</b>.</p>' +
      '<div class="merk"><b>Merke:</b> <b>Rational</b> sind alle Zahlen, die man als Bruch schreiben kann: ganze Zahlen, Brüche, abbrechende und periodische Dezimalzahlen. <b>Irrational</b> sind zum Beispiel ' + sq(2) + ', ' + sq(3) + ', ' + sq(10) + ' und π. Rationale und irrationale Zahlen bilden zusammen die <b>reellen Zahlen</b>.</div>' +
      '<p>Die Wurzel aus einer natürlichen Zahl ist entweder ganzzahlig (bei Quadratzahlen) oder irrational.</p>' +
      '<h3>5. Rechenregeln</h3><p class="big-math">' + sq('a') + ' · ' + sq('b') + ' = ' + sq('a · b') + ' &nbsp; &nbsp; ' + sq('a') + ' : ' + sq('b') + ' = ' + sq('a : b') + '</p><p>Beispiel: ' + sq(2) + ' · ' + sq(8) + ' = ' + sq(16) + ' = 4.</p>' +
      '<p class="note"><b>Achtung:</b> Für Summen gilt das nicht! ' + sq('9 + 16') + ' = ' + sq(25) + ' = 5, aber ' + sq(9) + ' + ' + sq(16) + ' = 3 + 4 = 7.</p>',
    entdecken: {
      html: '<p>Stelle den Flächeninhalt eines Quadrats ein. Beobachte die Seitenlänge und die Intervallschachtelung.</p><div class="ctl"><label>Fläche A = <b id="v_a"></b> cm² <input type="range" id="r_a" min="1" max="50" step="1" value="2"></label></div><div id="e_g"></div><div id="e_t"></div>',
      init: function (root, done) {
        var n = 0, R = root.querySelector('#r_a');
        function draw() {
          var A = +R.value, s = Math.sqrt(A), px = s * 26, g = Math.floor(s), t = Math.floor(s * 10) / 10, h = Math.floor(s * 100) / 100;
          root.querySelector('#v_a').textContent = A;
          var svg = '<svg class="viz" viewBox="0 0 330 220" role="img" aria-label="Quadrat mit der eingestellten Fläche" style="max-width:320px">';
          for (var i = 0; i <= 7; i++) svg += '<line x1="' + (20 + i * 26) + '" y1="200" x2="' + (20 + i * 26) + '' + '" y2="' + (200 - 7 * 26) + '" stroke="#dde6f7"/><line x1="20" y1="' + (200 - i * 26) + '" x2="' + (20 + 7 * 26) + '" y2="' + (200 - i * 26) + '" stroke="#dde6f7"/>';
          svg += '<rect x="20" y="' + (200 - px) + '" width="' + px + '" height="' + px + '" fill="' + CF + '" stroke="' + C1 + '" stroke-width="2.5"/>';
          svg += '<text x="' + (20 + px / 2) + '" y="215" font-size="12" font-weight="700" text-anchor="middle" fill="' + CH + '">a ≈ ' + M.fmtNum(Math.round(s * 100) / 100) + ' cm</text>';
          svg += '<text x="214" y="40" font-size="11" fill="#1c1830">1 Kästchen = 1 cm</text><text x="214" y="60" font-size="13" font-weight="700" fill="' + C1 + '">A = ' + A + ' cm²</text>';
          svg += '</svg>';
          root.querySelector('#e_g').innerHTML = svg;
          var exact = isSq(A);
          root.querySelector('#e_t').innerHTML = '<p class="big-math">a = ' + sq(A) + (exact ? ' = ' + Math.round(s) : ' ≈ ' + M.fmtNum(Math.round(s * 10000) / 10000) + '…') + '</p>' +
            (exact ? '<p><b>' + A + ' ist eine Quadratzahl.</b> Die Wurzel ist eine ganze Zahl, also rational.</p>' :
              '<ul><li><b>Einer:</b> ' + g + ' &lt; ' + sq(A) + ' &lt; ' + (g + 1) + ', denn ' + g * g + ' &lt; ' + A + ' &lt; ' + (g + 1) * (g + 1) + '</li>' +
              '<li><b>Zehntel:</b> ' + M.fmtNum(t) + ' &lt; ' + sq(A) + ' &lt; ' + M.fmtNum(Math.round((t + 0.1) * 10) / 10) + ', denn ' + M.fmtNum(Math.round(t * t * 100) / 100) + ' &lt; ' + A + ' &lt; ' + M.fmtNum(Math.round((t + 0.1) * (t + 0.1) * 100) / 100) + '</li>' +
              '<li><b>Hundertstel:</b> ' + M.fmtNum(h) + ' &lt; ' + sq(A) + ' &lt; ' + M.fmtNum(Math.round((h + 0.01) * 100) / 100) + ', denn ' + M.fmtNum(Math.round(h * h * 1e4) / 1e4) + ' &lt; ' + A + ' &lt; ' + M.fmtNum(Math.round((h + 0.01) * (h + 0.01) * 1e4) / 1e4) + '</li></ul><p>' + A + ' ist keine Quadratzahl. ' + sq(A) + ' ist irrational: Die Schachtelung geht unendlich weiter.</p>');
        }
        R.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: Nur bei Quadratzahlen wie 1, 4, 9, 16, 25 oder 36 ist die Seitenlänge eine ganze Zahl. Sonst ist sie irrational und man kann sie nur immer genauer einschachteln.'); });
        draw();
      }
    },
    beispiel: { title: 'Ein quadratischer Bauplatz', q: 'Ein quadratischer Bauplatz hat einen Flächeninhalt von 500 m². Wie lang ist eine Seite? Schätze zuerst und rechne dann mit dem Taschenrechner.',
      steps: ['Ansatz: A = a², also a = ' + sq('500') + ' m.', 'Einschachteln: 22² = 484 und 23² = 529. Da 484 &lt; 500 &lt; 529, liegt a zwischen 22 m und 23 m.', 'Taschenrechner: ' + sq(500) + ' = 22,3606… ≈ 22,36.', 'Antwort: Eine Seite ist etwa 22,36 m lang.', 'Kontrolle: 22,36² = 499,97 ≈ 500. Das passt zur Schätzung zwischen 22 und 23.'] },
    tasks: { gen: gen,
      plan: { G: ['quadrat:1', 'wurzel:1', 'zwischen:1', 'flaeche:1'], S: ['wurzel:2', 'zwischen:2', 'tr:2', 'irrational:2', 'regel:2'], E: ['wurzel:3', 'einschachteln:2', 'betrag:3', 'irrational:2', 'regel:3', 'flaeche:3'] },
      extra: 'verdoppeln', test: ['quadrat:2', 'wurzel:2', 'zwischen:2', 'tr:2', 'irrational:2', 'betrag:2'] },
    lerncheck: ['Ich ziehe Wurzeln aus Quadratzahlen ohne Taschenrechner.', 'Ich schachtele Wurzeln zwischen zwei Zahlen ein.', 'Ich unterscheide rationale und irrationale Zahlen.', 'Ich berechne die Seitenlänge eines Quadrats aus seiner Fläche.']
  };
})();
