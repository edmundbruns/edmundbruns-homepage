/* Modul 008 · Zinsrechnung: Jahreszinsen */
var MODULE = (function () {
  function r2(x) { return Math.round(x * 100) / 100; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function eur(x) { return (isInt(x) ? M.fmtNum(Math.round(x)) : M.fmtNum(x, 2)) + ' €'; }
  function pct(p) { return M.fmtNum(p) + ' %'; }
  function near(v, x) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < 0.006; }
  function money(ans, label) { return { kind: 'num', answer: r2(ans), tol: 0.005, unit: '€', label: label }; }
  var K1 = [200, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000];
  var K2 = K1.concat([750, 1250, 1800, 2400, 3600, 4500, 6400, 7500, 8000, 12000]);
  var P1 = [1, 2, 3, 4, 5], P2 = [0.5, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 0.75, 1.25];
  var P3 = [1.25, 1.75, 2.25, 2.75, 3.25, 0.8, 1.2, 1.8];
  /* Kapital und Zinssatz mit Zinsen auf den Cent genau */
  function pickKP(level) {
    for (var t = 0; t < 200; t++) {
      var K = M.pick(level === 1 ? K1 : K2), p = M.pick(level === 1 ? P1 : level === 2 ? P2 : P2.concat(P3));
      if (isInt(K * p)) return { K: K, p: p, Z: r2(K * p / 100) };
    }
    return { K: 2000, p: 3, Z: 60 };
  }
  function zf(K, p) { return 'Z = <span class="frac"><span>' + M.fmtNum(K) + ' · ' + M.fmtNum(p) + '</span><span>100</span></span>'; }
  function dreisatzTab(K, p, Z, hide) {
    function cell(v, i) { return hide && hide.indexOf(i) >= 0 ? '<td>?</td>' : '<td>' + v + '</td>'; }
    return '<table class="tab"><tr><th>Prozent</th><th>Betrag</th></tr><tr><td>100 %</td>' + cell(eur(K), 0) + '</tr><tr><td>1 %</td>' + cell(eur(K / 100), 1) + '</tr><tr><td>' + pct(p) + '</td>' + cell(eur(Z), 2) + '</tr></table>';
  }
  var NAMES = ['Mia', 'Jonas', 'Elif', 'Paul', 'Lea', 'Noah', 'Amira', 'Finn', 'Sofia', 'Ben'];

  var gen = {
    begriffe: function () {
      var v = pickKP(1), n = M.pick(NAMES), ask = M.rnd(0, 2);
      var right = [eur(v.K), pct(v.p), eur(v.Z)][ask];
      var opts = M.shuffle([eur(v.K), pct(v.p), eur(v.Z), eur(v.K + v.Z)]);
      var what = ['das Kapital K', 'den Zinssatz p %', 'die Jahreszinsen Z'][ask];
      return { skill: 'Begriffe K, p %, Z zuordnen', level: 1,
        q: n + ' legt ' + eur(v.K) + ' für ein Jahr auf ein Sparkonto. Die Bank zahlt ' + pct(v.p) + ' Zinsen pro Jahr. Nach einem Jahr bekommt ' + n + ' ' + eur(v.Z) + ' gutgeschrieben. Dann sind ' + eur(v.K + v.Z) + ' auf dem Konto.<br><b>Welche Angabe beschreibt ' + what + '?</b>',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(right) }],
        hints: ['Das Kapital ist das Geld, das am Anfang angelegt wird. Der Zinssatz ist eine Prozentangabe. Die Zinsen sind der Betrag, den die Bank dazugibt.', 'Der Betrag ' + eur(v.K + v.Z) + ' ist das Guthaben nach einem Jahr: Kapital plus Zinsen.', 'Gesucht ist ' + what + '.'],
        solution: 'Kapital K = ' + eur(v.K) + ', Zinssatz p % = ' + pct(v.p) + ', Jahreszinsen Z = ' + eur(v.Z) + '. ' + eur(v.K + v.Z) + ' ist das Guthaben nach einem Jahr (K + Z). Gesucht war ' + what + ': <b>' + right + '</b>.' };
    },
    dreisatz: function (lvl) {
      var v = pickKP(lvl >= 2 ? 2 : 1);
      return { skill: 'Zinsen mit dem Dreisatz', level: 1,
        q: 'Ein Kapital von ' + eur(v.K) + ' wird ein Jahr lang zu ' + pct(v.p) + ' verzinst. Ergänze die Dreisatz-Tabelle.' + dreisatzTab(v.K, v.p, v.Z, [1, 2]),
        inputs: [money(v.K / 100, '1 % ≙'), money(v.Z, pct(v.p) + ' ≙ Z =')],
        hints: ['Das Kapital ist der Grundwert. Es entspricht 100 %.', 'Für 1 % teilst du durch 100: ' + M.fmtNum(v.K) + ' € : 100 = ' + eur(v.K / 100) + '.', 'Für ' + pct(v.p) + ' multiplizierst du mit ' + M.fmtNum(v.p) + ': ' + eur(v.K / 100) + ' · ' + M.fmtNum(v.p) + '.'],
        solution: '100 % ≙ ' + eur(v.K) + ' | : 100 → 1 % ≙ ' + eur(v.K / 100) + ' | · ' + M.fmtNum(v.p) + ' → ' + pct(v.p) + ' ≙ <b>' + eur(v.Z) + '</b>.',
        mistakes: function (x) { if (near(x[0], v.K / 10)) return 'Für 1 % teilst du durch 100, nicht durch 10.'; if (near(x[1], v.K * v.p)) return 'Achte auf den ersten Schritt: Erst durch 100 teilen, dann mit ' + M.fmtNum(v.p) + ' malnehmen.'; return null; },
        verify: function () { return Math.abs(v.Z - r2(v.K / 100 * v.p)) < 1e-9 || 'Dreisatz passt nicht'; } };
    },
    zinsen: function (lvl) {
      var v = pickKP(lvl), n = M.pick(NAMES);
      var ctx = M.pick(['legt ' + eur(v.K) + ' für ein Jahr auf ein Sparkonto mit einem Zinssatz von ' + pct(v.p) + '.', 'hat ' + eur(v.K) + ' auf einem Tagesgeldkonto. Die Bank zahlt ' + pct(v.p) + ' Zinsen pro Jahr.', 'bekommt für ' + eur(v.K) + ' auf dem Festgeldkonto ' + pct(v.p) + ' Zinsen im Jahr.']);
      return { skill: 'Jahreszinsen berechnen',
        q: n + ' ' + ctx + ' <b>Wie viele Zinsen bekommt ' + n + ' nach einem Jahr?</b>',
        inputs: [money(v.Z, 'Z =')],
        hints: ['Nutze die Zinsformel Z = <span class="frac"><span>K · p</span><span>100</span></span> oder den Dreisatz.', 'Hier ist K = ' + eur(v.K) + ' und p = ' + M.fmtNum(v.p) + '. 1 % von ' + eur(v.K) + ' sind ' + eur(v.K / 100) + '.', 'Rechne ' + eur(v.K / 100) + ' · ' + M.fmtNum(v.p) + '.'],
        solution: zf(v.K, v.p) + ' = ' + M.fmtNum(r2(v.K * v.p)) + ' : 100 = <b>' + eur(v.Z) + '</b>.' + (v.p !== 1 ? ' Mit dem Dreisatz: 1 % ≙ ' + eur(v.K / 100) + ', also ' + pct(v.p) + ' ≙ ' + eur(v.Z) + '.' : ''),
        mistakes: function (x) {
          if (near(x[0], v.K * v.p)) return 'Du hast K · p gerechnet, aber nicht durch 100 geteilt. p % bedeutet p Hundertstel.';
          if (near(x[0], v.K + v.Z)) return 'Das ist das Guthaben nach einem Jahr. Gefragt sind nur die Zinsen.';
          if (near(x[0], v.K / v.p)) return 'Du hast durch p geteilt. Rechne K · p : 100.';
          return null; },
        verify: function () { return Math.abs(v.Z / v.K * 100 - v.p) < 1e-9 || 'Rückrechnung p falsch'; } };
    },
    guthaben: function (lvl) {
      var v = pickKP(lvl), n = M.pick(NAMES), G = r2(v.K + v.Z);
      var q = n + ' zahlt ' + eur(v.K) + ' auf ein Sparkonto ein. Der Zinssatz beträgt ' + pct(v.p) + ' pro Jahr. Die Zinsen werden am Jahresende gutgeschrieben.';
      var inputs = lvl === 1 ? [money(v.Z, 'Zinsen Z ='), money(G, 'Guthaben nach 1 Jahr')] : [money(G, 'Guthaben nach 1 Jahr')];
      return { skill: 'Guthaben nach einem Jahr',
        q: q + (lvl === 1 ? ' <b>Berechne die Zinsen und das Guthaben nach einem Jahr.</b>' : ' <b>Wie viel Geld ist nach einem Jahr auf dem Konto?</b>'),
        inputs: inputs,
        hints: ['Das Guthaben nach einem Jahr ist Kapital plus Zinsen: K + Z.', 'Zinsen: Z = ' + M.fmtNum(v.K) + ' · ' + M.fmtNum(v.p) + ' : 100 = ' + eur(v.Z) + '.', 'Guthaben: ' + eur(v.K) + ' + ' + eur(v.Z) + '. Schneller geht es mit dem Faktor ' + M.fmtNum(1 + v.p / 100) + ', denn ' + pct(100 + v.p) + ' von K.'],
        solution: 'Z = ' + M.fmtNum(v.K) + ' € · ' + M.fmtNum(v.p) + ' : 100 = ' + eur(v.Z) + '. Guthaben: ' + eur(v.K) + ' + ' + eur(v.Z) + ' = <b>' + eur(G) + '</b>. Kontrolle: ' + M.fmtNum(v.K) + ' € · ' + M.fmtNum(1 + v.p / 100) + ' = ' + eur(G) + '.',
        mistakes: function (x) { var last = x[x.length - 1]; if (near(last, v.Z)) return 'Das sind nur die Zinsen. Zum Guthaben gehört auch das Kapital: K + Z.'; if (near(last, v.K * v.p / 10 + v.K)) return 'Prüfe die Zinsen: 1 % ist K : 100, nicht K : 10.'; return null; },
        verify: function () { return Math.abs(G - r2(v.K * (100 + v.p) / 100)) < 1e-9 || 'Faktor-Rechnung passt nicht'; } };
    },
    zinssatz: function (lvl) {
      var v = pickKP(lvl), n = M.pick(NAMES);
      return { skill: 'Zinssatz berechnen',
        q: n + ' hatte ein Jahr lang ' + eur(v.K) + ' auf dem Sparkonto und hat dafür ' + eur(v.Z) + ' Zinsen bekommen. <b>Wie hoch war der Zinssatz?</b>',
        inputs: [{ kind: 'num', answer: v.p, unit: '%', label: 'p =' }],
        hints: ['Gesucht ist der Prozentsatz. Frage: Wie viel Prozent von ' + eur(v.K) + ' sind ' + eur(v.Z) + '?', 'Stelle die Formel um: p = <span class="frac"><span>Z · 100</span><span>K</span></span>.', 'p = ' + M.fmtNum(v.Z) + ' · 100 : ' + M.fmtNum(v.K) + ' = ' + M.fmtNum(r2(v.Z * 100)) + ' : ' + M.fmtNum(v.K) + '.'],
        solution: 'p = <span class="frac"><span>' + M.fmtNum(v.Z) + ' · 100</span><span>' + M.fmtNum(v.K) + '</span></span> = ' + M.fmtNum(v.p) + '. Der Zinssatz beträgt <b>' + pct(v.p) + '</b>. Kontrolle: ' + pct(v.p) + ' von ' + eur(v.K) + ' sind ' + eur(v.Z) + '.',
        mistakes: function (x) { if (near(x[0], v.Z / v.K) || near(x[0], v.p / 100)) return 'Du hast den Anteil Z : K als Dezimalzahl berechnet. Multipliziere noch mit 100, dann hast du Prozent.'; if (near(x[0], v.K / v.Z)) return 'Du hast K durch Z geteilt. Es ist umgekehrt: Z · 100 : K.'; return null; },
        verify: function () { return Math.abs(v.K * v.p / 100 - v.Z) < 1e-9 || 'Probe falsch'; } };
    },
    kapital: function (lvl) {
      var v = pickKP(lvl), n = M.pick(NAMES);
      return { skill: 'Kapital berechnen',
        q: n + ' möchte nach einem Jahr genau ' + eur(v.Z) + ' Zinsen bekommen. Die Bank bietet ' + pct(v.p) + ' Zinsen pro Jahr. <b>Wie viel Geld muss ' + n + ' anlegen?</b>',
        inputs: [money(v.K, 'K =')],
        hints: ['Die Zinsen ' + eur(v.Z) + ' entsprechen ' + pct(v.p) + ' des Kapitals. Das Kapital sind 100 %.', 'Dreisatz: ' + pct(v.p) + ' ≙ ' + eur(v.Z) + ', also 1 % ≙ ' + eur(v.Z) + ' : ' + M.fmtNum(v.p) + ' = ' + eur(v.K / 100) + '.', 'Für 100 % multiplizierst du mit 100. Oder mit der Formel: K = Z · 100 : p.'],
        solution: 'K = <span class="frac"><span>' + M.fmtNum(v.Z) + ' · 100</span><span>' + M.fmtNum(v.p) + '</span></span> = <b>' + eur(v.K) + '</b>. Kontrolle: ' + pct(v.p) + ' von ' + eur(v.K) + ' sind ' + eur(v.Z) + '.',
        mistakes: function (x) { if (near(x[0], v.Z * v.p / 100)) return 'Du hast ' + pct(v.p) + ' von ' + eur(v.Z) + ' berechnet. Die Zinsen sind aber selbst schon ' + pct(v.p) + '. Gesucht ist der Grundwert (100 %).'; if (near(x[0], v.Z * v.p)) return 'Teile durch p und multipliziere mit 100: K = Z · 100 : p.'; return null; },
        verify: function () { return Math.abs(r2(v.K * v.p / 100) - v.Z) < 1e-9 || 'Probe falsch'; } };
    },
    kredit: function (lvl) {
      var K, p; do { K = M.pick([1500, 2000, 3000, 4000, 5000, 6000, 8000, 10000, 12000]); p = M.pick(lvl === 1 ? [5, 6, 7, 8, 9] : [4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8.5, 9.5]); } while (!isInt(K * p));
      var Z = r2(K * p / 100), what = M.pick(['ein gebrauchtes Auto', 'eine neue Küche', 'eine Waschmaschine und einen Kühlschrank', 'neue Möbel']);
      return { skill: 'Kreditzinsen',
        q: 'Familie Berger leiht sich für ' + what + ' ' + eur(K) + ' von der Bank. Der Kreditzins beträgt ' + pct(p) + ' pro Jahr. Nach einem Jahr zahlt die Familie den Kredit mit allen Zinsen auf einmal zurück.<br><b>Wie viele Zinsen muss sie bezahlen? Wie viel zahlt sie insgesamt zurück?</b>',
        inputs: [money(Z, 'Zinsen'), money(K + Z, 'Rückzahlung')],
        hints: ['Beim Kredit bekommst du keine Zinsen, sondern du bezahlst sie an die Bank. Gerechnet wird genauso: Z = K · p : 100.', 'Z = ' + M.fmtNum(K) + ' · ' + M.fmtNum(p) + ' : 100 = ' + eur(Z) + '.', 'Zurückgezahlt werden der geliehene Betrag und die Zinsen: ' + eur(K) + ' + ' + eur(Z) + '.'],
        solution: 'Zinsen: ' + zf(K, p) + ' = ' + eur(Z) + '. Rückzahlung: ' + eur(K) + ' + ' + eur(Z) + ' = <b>' + eur(K + Z) + '</b>.',
        mistakes: function (x) { if (near(x[1], K - Z)) return 'Beim Kredit werden die Zinsen nicht abgezogen. Die Familie zahlt mehr zurück, als sie geliehen hat.'; if (near(x[0], K * p)) return 'Teile K · p noch durch 100.'; return null; },
        verify: function () { return Math.abs(Z / K * 100 - p) < 1e-9 || 'Probe falsch'; } };
    },
    vergleich: function () {
      for (var t = 0; t < 300; t++) {
        var K = M.pick([1000, 1500, 2000, 2500, 3000, 4000, 5000]), pa = M.pick([2, 2.5, 3, 3.5, 4]), pb = M.pick([1, 1.5, 2, 2.5]), bonus = M.pick([10, 15, 20, 25, 30, 40]);
        if (pb >= pa) continue;
        var za = r2(K * pa / 100), zb = r2(K * pb / 100 + bonus), diff = r2(Math.abs(za - zb));
        if (diff < 2) continue;
        var best = za > zb ? 0 : 1;
        return { skill: 'Angebote vergleichen', level: 2,
          q: 'Lukas möchte ' + eur(K) + ' für ein Jahr anlegen. <b>Bank A</b> zahlt ' + pct(pa) + ' Zinsen. <b>Bank B</b> zahlt nur ' + pct(pb) + ' Zinsen, gibt aber am Jahresende zusätzlich einen Bonus von ' + eur(bonus) + '.<br>Welches Angebot bringt mehr? Wie groß ist der Unterschied?',
          inputs: [{ kind: 'mc', label: 'Mehr bringt …', options: ['Bank A', 'Bank B', 'Beide bringen gleich viel.'], answer: best }, money(diff, 'Unterschied')],
          hints: ['Berechne für beide Banken, wie viel Geld Lukas nach einem Jahr dazubekommt.', 'Bank A: ' + M.fmtNum(K) + ' · ' + M.fmtNum(pa) + ' : 100 = ' + eur(za) + '. Bank B: ' + M.fmtNum(K) + ' · ' + M.fmtNum(pb) + ' : 100 + ' + eur(bonus) + '.', 'Bank B bringt ' + eur(zb) + '. Ziehe den kleineren vom größeren Betrag ab.'],
          solution: 'Bank A: ' + eur(za) + '. Bank B: ' + eur(r2(K * pb / 100)) + ' + ' + eur(bonus) + ' = ' + eur(zb) + '. <b>' + ['Bank A', 'Bank B'][best] + '</b> bringt ' + eur(diff) + ' mehr.',
          verify: function () { return (best === 0) === (K * (pa - pb) / 100 > bonus) || 'Vergleich falsch'; } };
      }
      return gen.zinsen(2);
    },
    rueckwaerts: function () {
      var v = pickKP(3), n = M.pick(NAMES), G = r2(v.K + v.Z);
      return { skill: 'Anfangskapital aus dem Endbetrag', level: 3,
        q: 'Nach einem Jahr sind auf ' + n + 's Sparkonto ' + eur(G) + '. Darin sind die Zinsen schon enthalten. Der Zinssatz betrug ' + pct(v.p) + '.<br><b>Wie viel Geld hat ' + n + ' am Anfang eingezahlt? Wie viele Zinsen gab es?</b>',
        inputs: [money(v.K, 'Kapital K ='), money(v.Z, 'Zinsen Z =')],
        hints: ['Vorsicht: Die Zinsen wurden vom Anfangskapital berechnet, nicht vom Endbetrag. Das Kapital sind 100 %.', 'Das Guthaben ' + eur(G) + ' entspricht 100 % + ' + pct(v.p) + ' = ' + pct(100 + v.p) + ' des Kapitals.', 'Dreisatz: ' + pct(100 + v.p) + ' ≙ ' + eur(G) + '. Teile durch ' + M.fmtNum(100 + v.p) + ' und multipliziere mit 100.'],
        solution: pct(100 + v.p) + ' ≙ ' + eur(G) + ' → 1 % ≙ ' + eur(G) + ' : ' + M.fmtNum(100 + v.p) + ' = ' + eur(v.K / 100) + ' → 100 % ≙ <b>' + eur(v.K) + '</b>. Zinsen: ' + eur(G) + ' − ' + eur(v.K) + ' = <b>' + eur(v.Z) + '</b>. Kontrolle: ' + pct(v.p) + ' von ' + eur(v.K) + ' = ' + eur(v.Z) + '.',
        mistakes: function (x) { if (near(x[0], G - G * v.p / 100)) return 'Du hast ' + pct(v.p) + ' vom Endbetrag abgezogen. Die Zinsen wurden aber vom Anfangskapital berechnet. Der Endbetrag entspricht ' + pct(100 + v.p) + '.'; return null; },
        verify: function () { return Math.abs(r2(v.K * (1 + v.p / 100)) - G) < 1e-9 || 'Probe falsch'; } };
    }
  };

  return {
    id: '008', title: 'Zinsrechnung: Jahreszinsen', bereich: 'Prozent und Zinsen', minutes: '45 bis 60',
    vorkenntnisse: 'Prozentrechnung: Grundwert, Prozentwert, Prozentsatz, Dreisatz',
    lead: 'Warum wächst Geld auf dem Sparkonto, und warum kostet ein Kredit extra? Du lernst, Zinsen für ein Jahr zu berechnen.',
    einstieg: { html: '<p>Emma hat in den Sommerferien gejobbt und zum Geburtstag Geld bekommen. Jetzt hat sie <b>1 200 €</b>. Ihre Bank bietet ihr an: „Lege das Geld für ein Jahr bei uns an. Du bekommst <b>2,5 % Zinsen</b>.“</p><p class="note">Wie viel Geld bekommt Emma nach einem Jahr dazu? Und wie viel hat sie dann insgesamt?</p><p>Die Bank arbeitet mit Emmas Geld und bezahlt sie dafür. Diese Bezahlung heißt <b>Zinsen</b>. Umgekehrt gilt: Wer sich Geld leiht, muss Zinsen bezahlen. Zinsrechnung ist Prozentrechnung mit neuen Namen.</p>' },
    ziele: ['Ich kenne die Begriffe Kapital K, Zinssatz p % und Jahreszinsen Z.', 'Ich berechne Jahreszinsen mit dem Dreisatz und mit der Formel Z = K · p : 100.', 'Ich berechne das Guthaben nach einem Jahr.', 'Ich berechne den Zinssatz oder das Kapital, wenn die anderen Größen bekannt sind.', 'Ich vergleiche Sparangebote und berechne Kreditzinsen.'],
    fachwoerter: [['Kapital K', 'Der Geldbetrag, der angelegt oder geliehen wird. Er entspricht 100 % (Grundwert).'], ['Zinssatz p %', 'Gibt an, wie viel Prozent des Kapitals es pro Jahr als Zinsen gibt (Prozentsatz).'], ['Jahreszinsen Z', 'Der Betrag in €, den es nach einem Jahr gibt oder den man bezahlen muss (Prozentwert).'], ['Guthaben', 'Das Geld auf dem Konto. Nach einem Jahr: Kapital plus Zinsen.'], ['Kredit', 'Geliehenes Geld. Dafür bezahlt man Zinsen an die Bank.']],
    diagnose: [
      { q: 'Wie viel sind 10 % von 250 €?', options: ['25 €', '2,50 €', '10 €', 'Weiß ich noch nicht'], answer: 0, why: '10 % ist ein Zehntel: 250 € : 10 = 25 €.', review: 'Prozentwert berechnen (Klasse 7)' },
      { q: 'Wie schreibt man 3 % als Dezimalzahl?', options: ['0,03', '0,3', '3,0', 'Weiß ich noch nicht'], answer: 0, why: '3 % = 3 Hundertstel = 0,03.', review: 'Prozent, Bruch und Dezimalzahl umwandeln' },
      { q: '20 % eines Betrags sind 40 €. Wie groß ist der ganze Betrag (100 %)?', options: ['200 €', '80 €', '8 €', 'Weiß ich noch nicht'], answer: 0, why: '20 % ≙ 40 €, also 10 % ≙ 20 € und 100 % ≙ 200 €.', review: 'Grundwert mit dem Dreisatz berechnen' },
      { q: 'Wie viel Prozent sind 15 € von 60 €?', options: ['25 %', '15 %', '4 %', 'Weiß ich noch nicht'], answer: 0, why: '15 : 60 = 0,25 = 25 %.', review: 'Prozentsatz berechnen' }],
    erklaerung:
      '<h3>1. Zinsrechnung ist Prozentrechnung</h3><p>In der Zinsrechnung haben die bekannten Größen der Prozentrechnung neue Namen:</p>' +
      '<table class="tab"><tr><th>Prozentrechnung</th><th>Zinsrechnung</th></tr><tr><td>Grundwert G</td><td>Kapital K</td></tr><tr><td>Prozentsatz p %</td><td>Zinssatz p %</td></tr><tr><td>Prozentwert W</td><td>Jahreszinsen Z</td></tr></table>' +
      '<p>Ein Zinssatz gilt immer <b>für ein Jahr</b> (man sagt auch „pro anno“, kurz p. a.).</p>' +
      '<h3>2. Jahreszinsen mit dem Dreisatz</h3><p>Emma legt 1 200 € zu 2,5 % an:</p>' + dreisatzTab(1200, 2.5, 30) +
      '<p>Rechenweg: 100 % ≙ 1 200 €. Durch 100 teilen: 1 % ≙ 12 €. Mal 2,5: 2,5 % ≙ 30 €.</p>' +
      '<h3>3. Die Zinsformel</h3><div class="merk"><b>Merke:</b> Jahreszinsen: <span class="big-math">Z = <span class="frac"><span>K · p</span><span>100</span></span></span><br>Umgestellt: <b>p = <span class="frac"><span>Z · 100</span><span>K</span></span></b> und <b>K = <span class="frac"><span>Z · 100</span><span>p</span></span></b><br>Guthaben nach einem Jahr: <b>K + Z</b></div>' +
      '<p>Für Emma: Z = 1 200 · 2,5 : 100 = 30 €. Nach einem Jahr hat sie 1 200 € + 30 € = <b>1 230 €</b>.</p>' +
      '<h3>4. Sparen und Kredit</h3><ul><li><b>Sparen:</b> Du gibst der Bank Geld. Die Bank zahlt dir Zinsen. Dein Guthaben wächst.</li><li><b>Kredit:</b> Die Bank leiht dir Geld. Du zahlst der Bank Zinsen. Du zahlst mehr zurück, als du bekommen hast. Kreditzinsen sind meist deutlich höher als Sparzinsen.</li></ul>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Geldbeträge schreibst du mit Komma, zum Beispiel 37,50. Das €-Zeichen steht schon da.</p>',
    entdecken: {
      html: '<p>Verändere das Kapital K und den Zinssatz p. Der lange Streifen ist das Kapital (100 %). Das orange Stück sind die Zinsen. Im Hunderterfeld ist jedes Kästchen 1 % des Kapitals.</p>' +
        '<div class="ctl"><label>K = <b id="v_k"></b> <input type="range" id="r_k" min="500" max="10000" step="500" value="2000"></label><label>p = <b id="v_p"></b> <input type="range" id="r_p" min="0.5" max="8" step="0.5" value="2"></label></div>' +
        '<svg id="e_svg" class="viz" viewBox="0 0 360 260" role="img" aria-label="Prozentstreifen und Hunderterfeld zu Kapital und Zinsen" style="max-width:460px"></svg><div id="e_txt"></div>' +
        '<ul><li>Was passiert mit den Zinsen, wenn du das Kapital verdoppelst?</li><li>Was passiert, wenn du den Zinssatz verdoppelst?</li></ul>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var K = +root.querySelector('#r_k').value, p = +root.querySelector('#r_p').value, Z = r2(K * p / 100);
          root.querySelector('#v_k').textContent = eur(K); root.querySelector('#v_p').textContent = pct(p);
          var s = '', x0 = 14, W = 300, y0 = 30, bh = 34, zw = W * p / 100;
          s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 - 9) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#3d2a73">Kapital K = ' + eur(K) + ' (100 %)</text>';
          s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + bh + '" fill="#efeafb" stroke="#3d2a73" stroke-width="2"/>';
          for (var i = 1; i < 10; i++) s += '<line x1="' + (x0 + i * W / 10) + '" y1="' + y0 + '" x2="' + (x0 + i * W / 10) + '" y2="' + (y0 + bh) + '" stroke="#c9bfe6"/>';
          s += '<rect x="' + (x0 + W) + '" y="' + y0 + '" width="' + zw + '" height="' + bh + '" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>';
          s += '<text x="' + (x0 + W + zw / 2) + '" y="' + (y0 - 5) + '" text-anchor="middle" font-size="13" font-weight="700" fill="#b45309">Z</text>';
          s += '<text x="' + x0 + '" y="' + (y0 + bh + 16) + '" font-size="11" fill="#5a5670">0 %</text><text x="' + (x0 + W) + '" y="' + (y0 + bh + 16) + '" text-anchor="middle" font-size="11" fill="#5a5670">100 %</text>';
          /* Hunderterfeld */
          var gx = 14, gy = 112, c = 13;
          s += '<text x="' + gx + '" y="' + (gy - 8) + '" font-size="12" font-weight="700" fill="#3d2a73">Hunderterfeld: 100 Kästchen = K</text>';
          for (var r = 0; r < 10; r++) for (var k = 0; k < 10; k++) {
            var idx = r * 10 + k, fill = idx + 1 <= p ? '#d97706' : '#fff';
            s += '<rect x="' + (gx + k * c) + '" y="' + (gy + r * c) + '" width="' + c + '" height="' + c + '" fill="' + fill + '" stroke="#3d2a73" stroke-width="0.8"/>';
            if (idx < p && idx + 1 > p) s += '<rect x="' + (gx + k * c) + '" y="' + (gy + r * c) + '" width="' + (c * (p - idx)) + '" height="' + c + '" fill="#d97706"/>';
          }
          var tx = gx + 10 * c + 16;
          s += '<text x="' + tx + '" y="' + (gy + 14) + '" font-size="13" fill="#1c1830">1 Kästchen = 1 %</text>' +
            '<text x="' + tx + '" y="' + (gy + 34) + '" font-size="13" fill="#1c1830">1 % = ' + eur(K / 100) + '</text>' +
            '<text x="' + tx + '" y="' + (gy + 62) + '" font-size="13" font-weight="700" fill="#b45309">' + pct(p) + ' = ' + eur(Z) + '</text>' +
            '<text x="' + tx + '" y="' + (gy + 90) + '" font-size="13" fill="#1c1830">Nach 1 Jahr:</text>' +
            '<text x="' + tx + '" y="' + (gy + 108) + '" font-size="13" font-weight="700" fill="#3d2a73">' + eur(K + Z) + '</text>';
          root.querySelector('#e_svg').innerHTML = s;
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">Z = ' + M.fmtNum(K) + ' € · ' + M.fmtNum(p) + ' : 100 = ' + eur(Z) + '</p><p>Guthaben nach einem Jahr: ' + eur(K) + ' + ' + eur(Z) + ' = <b>' + eur(K + Z) + '</b></p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Gut beobachtet: Doppeltes Kapital bringt doppelte Zinsen, doppelter Zinssatz auch. Die Zinsen sind proportional zu K und zu p.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Zinsen und Guthaben', q: 'Herr Kaya legt 2 400 € für ein Jahr zu einem Zinssatz von 1,5 % an. Wie viele Zinsen bekommt er, und wie hoch ist sein Guthaben nach einem Jahr?',
      steps: ['Größen zuordnen: K = 2 400 €, p % = 1,5 %, gesucht ist Z.', 'Dreisatz: 100 % ≙ 2 400 €, also 1 % ≙ 24 €.', '1,5 % ≙ 24 € · 1,5 = 36 €. Mit der Formel: Z = 2 400 · 1,5 : 100 = 36 €.', 'Guthaben nach einem Jahr: 2 400 € + 36 € = <b>2 436 €</b>.', 'Kontrolle: 36 € sind etwas mehr als 1 % von 2 400 € (24 €) und weniger als 2 % (48 €). Das passt.'] },
    tasks: { gen: gen, plan: { G: ['begriffe:1', 'dreisatz:1', 'zinsen:1', 'guthaben:1'], S: ['dreisatz:1', 'zinsen:2', 'guthaben:2', 'zinssatz:2', 'kapital:2'], E: ['zinsen:2', 'zinssatz:2', 'kapital:3', 'kredit:2', 'vergleich:2', 'guthaben:3'] },
      extra: 'rueckwaerts', test: ['begriffe:1', 'zinsen:2', 'guthaben:2', 'zinssatz:2', 'kapital:2', 'kredit:2'] },
    lerncheck: ['Ich kann die Begriffe Kapital, Zinssatz und Zinsen erklären.', 'Ich berechne Jahreszinsen mit Dreisatz oder Formel.', 'Ich berechne Zinssatz und Kapital.', 'Ich vergleiche Sparangebote und berechne Kreditzinsen.']
  };
})();
