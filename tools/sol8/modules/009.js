/* Modul 009 · Zinsen für Monate und Tage */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  function r2(x) { return Math.round(x * 100) / 100; }
  function isInt(x) { return Math.abs(x - Math.round(x)) < 1e-9; }
  function eur(x) { return (isInt(x) ? M.fmtNum(Math.round(x)) : M.fmtNum(x, 2)) + ' €'; }
  function pct(p) { return M.fmtNum(p) + ' %'; }
  function near(v, x) { var y = M.parseNum(v); return y !== null && Math.abs(y - x) < 0.006; }
  function money(ans, label) { return { kind: 'num', answer: r2(ans), tol: 0.005, unit: '€', label: label }; }
  function fr(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  var MON = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  function dstr(d, m) { return d + '. ' + MON[m - 1]; }
  /* kaufmännisch: jeder Monat 30 Tage */
  function days360(d1, m1, d2, m2) { return (m2 - m1) * 30 + (d2 - d1); }
  /* echte Kalendertage (kein Schaltjahr) */
  function daysReal(d1, m1, d2, m2) { return Math.round((Date.UTC(2025, m2 - 1, d2) - Date.UTC(2025, m1 - 1, d1)) / 864e5); }
  var KS = [600, 800, 900, 1200, 1500, 1800, 2000, 2400, 3000, 3600, 4000, 4800, 5000, 6000, 7200, 8000, 9000, 10000, 12000];
  var PS = [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6];
  /* Z = K · p · t / 36000 auf den Cent genau */
  function pickKPT(ts, ks, ps) {
    for (var i = 0; i < 400; i++) { var K = M.pick(ks || KS), p = M.pick(ps || PS), t = M.pick(ts); if (isInt(K * p * t / 360)) return { K: K, p: p, t: t, Z: r2(K * p * t / 36000) }; }
    return { K: 3600, p: 2, t: 90, Z: 18 };
  }
  function pickDates(lvl) {
    for (var i = 0; i < 200; i++) {
      var m1 = M.rnd(1, 10), m2 = M.rnd(m1 + 1, 12), d1 = M.rnd(1, 28), d2 = lvl === 1 ? d1 : M.rnd(1, 28);
      var t = days360(d1, m1, d2, m2);
      if (t > 20 && t < 330 && (lvl === 1 || d1 !== d2)) return { d1: d1, m1: m1, d2: d2, m2: m2, t: t, real: daysReal(d1, m1, d2, m2) };
    }
    return { d1: 15, m1: 3, d2: 20, m2: 7, t: 125, real: daysReal(15, 3, 20, 7) };
  }
  function countSol(D) {
    var mm = D.m2 - D.m1, base = mm * 30, r = 'Vom ' + dstr(D.d1, D.m1) + ' bis zum ' + dstr(D.d1, D.m2) + ' sind es ' + mm + (mm === 1 ? ' Monat' : ' Monate') + ', also ' + mm + ' · 30 = ' + base + ' Tage.';
    if (D.d2 > D.d1) r += ' Vom ' + dstr(D.d1, D.m2) + ' bis zum ' + dstr(D.d2, D.m2) + ' kommen ' + (D.d2 - D.d1) + ' Tage dazu: ' + base + ' + ' + (D.d2 - D.d1) + ' = ' + D.t + ' Tage.';
    if (D.d2 < D.d1) r += ' Der ' + dstr(D.d2, D.m2) + ' liegt ' + (D.d1 - D.d2) + ' Tage vor dem ' + dstr(D.d1, D.m2) + ': ' + base + ' − ' + (D.d1 - D.d2) + ' = ' + D.t + ' Tage.';
    return r;
  }
  function zt(K, p, t) { return 'Z = ' + M.fmtNum(K) + ' · ' + fr(M.fmtNum(p), '100') + ' · ' + fr(t, '360'); }
  function zm(K, p, m) { return 'Z = ' + M.fmtNum(K) + ' · ' + fr(M.fmtNum(p), '100') + ' · ' + fr(m, '12'); }
  var NAMES = ['Mia', 'Jonas', 'Elif', 'Paul', 'Lea', 'Noah', 'Amira', 'Finn', 'Sofia', 'Ben'];

  var gen = {
    anteil: function (lvl) {
      if (lvl === 1 || Math.random() < 0.4) {
        var m = M.pick([1, 2, 3, 4, 6, 8, 9]), f = M.red(F(m, 12));
        return { skill: 'Zeitanteil eines Jahres', level: 1, q: 'Welcher Bruchteil eines Jahres sind <b>' + m + (m === 1 ? ' Monat' : ' Monate') + '</b>? Gib den Bruch an.',
          inputs: [{ kind: 'frac', answer: f, label: 'Anteil am Jahr', placeholder: 'z. B. 1/4' }],
          hints: ['Ein Jahr hat 12 Monate.', m + ' von 12 Monaten sind ' + fr(m, 12) + ' des Jahres.', 'Kürze den Bruch: ' + fr(m, 12) + ' = ' + fh(f) + '.'],
          solution: m + (m === 1 ? ' Monat ist ' : ' Monate sind ') + fr(m, 12) + (f.d !== 12 ? ' = ' + fh(f) : '') + ' Jahr.' };
      }
      var t = M.pick([30, 45, 60, 72, 90, 120, 135, 180, 240, 270, 300]), g = M.red(F(t, 360));
      return { skill: 'Zeitanteil eines Jahres', level: 1, q: 'Welcher Bruchteil eines Jahres sind <b>' + t + ' Zinstage</b> nach der kaufmännischen Methode? Gib den Bruch gekürzt an.',
        inputs: [{ kind: 'frac', answer: g, label: 'Anteil am Jahr', placeholder: 'z. B. 1/4' }],
        hints: ['Bei der kaufmännischen Methode hat ein Zinsjahr 360 Tage.', t + ' von 360 Tagen sind ' + fr(t, 360) + ' des Jahres.', 'Kürze den Bruch. Der größte gemeinsame Teiler von ' + t + ' und 360 ist ' + M.gcd(t, 360) + '.'],
        solution: fr(t, 360) + ' = ' + fh(g) + ' Jahr.',
        mistakes: function (v) { var x = M.parseFrac(v[0]); if (x && M.feq(x, F(t, 365))) return 'Bei der kaufmännischen Methode hat ein Jahr 360 Tage, nicht 365.'; return null; } };
    },
    monatszinsen: function (lvl) {
      var v, m;
      for (var i = 0; i < 400; i++) { var K = M.pick(KS), p = M.pick(lvl === 1 ? [1, 2, 3, 4, 6] : PS); m = M.pick(lvl === 1 ? [3, 6, 4] : [2, 3, 4, 5, 7, 8, 9, 10]); if (isInt(K * p * m / 12)) { v = { K: K, p: p, Z: r2(K * p * m / 1200) }; break; } }
      if (!v) { v = { K: 2400, p: 2, Z: 12 }; m = 3; }
      var n = M.pick(NAMES), Zj = r2(v.K * v.p / 100);
      return { skill: 'Monatszinsen',
        q: n + ' legt ' + eur(v.K) + ' zu einem Zinssatz von ' + pct(v.p) + ' pro Jahr an. Nach <b>' + m + ' Monaten</b> wird das Geld wieder abgehoben. <b>Wie viele Zinsen gibt es?</b>',
        inputs: [money(v.Z, 'Z =')],
        hints: ['Berechne zuerst die Jahreszinsen: ' + M.fmtNum(v.K) + ' · ' + M.fmtNum(v.p) + ' : 100 = ' + eur(Zj) + '.', 'Das Geld war nur ' + m + ' von 12 Monaten angelegt. Es gibt also nur ' + fr(m, 12) + ' der Jahreszinsen.', 'Rechne ' + eur(Zj) + ' : 12 · ' + m + '.'],
        solution: zm(v.K, v.p, m) + ' = ' + eur(Zj) + ' · ' + fr(m, 12) + ' = <b>' + eur(v.Z) + '</b>.',
        mistakes: function (x) { if (near(x[0], Zj)) return 'Das sind die Zinsen für ein ganzes Jahr. Das Geld war aber nur ' + m + ' Monate angelegt.'; if (near(x[0], Zj * m)) return 'Du hast mit ' + m + ' malgenommen, aber nicht durch 12 geteilt.'; return null; },
        verify: function () { return Math.abs(v.Z * 12 / m * 100 / v.K - v.p) < 1e-9 || 'Rückrechnung falsch'; } };
    },
    tage_zaehlen: function (lvl) {
      var D = pickDates(lvl);
      return { skill: 'Zinstage zählen (30/360)',
        q: 'Ein Geldbetrag wird am <b>' + dstr(D.d1, D.m1) + '</b> eingezahlt und am <b>' + dstr(D.d2, D.m2) + '</b> desselben Jahres abgehoben. Wie viele Zinstage sind das nach der kaufmännischen Methode (jeder Monat hat 30 Tage)?',
        inputs: [{ kind: 'num', answer: D.t, label: 'Zinstage', unit: 'Tage' }],
        hints: ['Zähle zuerst die ganzen Monate von ' + dstr(D.d1, D.m1) + ' bis ' + dstr(D.d1, D.m2) + '. Jeder Monat zählt 30 Tage.', 'Das sind ' + (D.m2 - D.m1) + ' Monate, also ' + (D.m2 - D.m1) * 30 + ' Tage.', D.d2 === D.d1 ? 'Der Tag im Monat ist gleich, es kommt nichts dazu.' : D.d2 > D.d1 ? 'Jetzt kommen noch die Tage vom ' + dstr(D.d1, D.m2) + ' bis zum ' + dstr(D.d2, D.m2) + ' dazu: ' + D.d2 + ' − ' + D.d1 + ' = ' + (D.d2 - D.d1) + '.' : 'Der ' + dstr(D.d2, D.m2) + ' liegt ' + (D.d1 - D.d2) + ' Tage vor dem ' + dstr(D.d1, D.m2) + '. Ziehe diese Tage ab.'],
        solution: countSol(D),
        mistakes: function (x) { var y = M.parseNum(x[0]); if (y === D.real && D.real !== D.t) return 'Du hast die echten Kalendertage gezählt. Bei der kaufmännischen Methode zählt jeder Monat genau 30 Tage.'; if (y === D.t + 1) return 'Fast. Der Einzahlungstag wird nicht mitgezählt, der Auszahlungstag schon. Rechne einfach die Differenz.'; return null; },
        verify: function () { var c = 0, d = D.d1, m = D.m1; while (!(d === D.d2 && m === D.m2)) { d++; if (d > 30) { d = 1; m++; } c++; if (c > 400) return 'Zählschleife'; } return c === D.t || 'Zählung ' + c; } };
    },
    tageszinsen: function (lvl) {
      var v = pickKPT(lvl === 1 ? [30, 60, 90, 120, 180, 270] : lvl === 2 ? [20, 36, 40, 45, 72, 75, 100, 135, 150, 200, 240] : [18, 24, 54, 63, 84, 105, 126, 144, 165, 225, 252, 315]);
      var n = M.pick(NAMES), Zj = r2(v.K * v.p / 100);
      return { skill: 'Tageszinsen',
        q: n + ' hat ' + eur(v.K) + ' für <b>' + v.t + ' Tage</b> zu ' + pct(v.p) + ' pro Jahr angelegt. <b>Wie viele Zinsen bekommt ' + n + '?</b> Rechne kaufmännisch mit 360 Tagen im Jahr.',
        inputs: [money(v.Z, 'Z =')],
        hints: ['Jahreszinsen: ' + M.fmtNum(v.K) + ' · ' + M.fmtNum(v.p) + ' : 100 = ' + eur(Zj) + '.', 'Für ' + v.t + ' Tage gibt es ' + fr(v.t, 360) + ' der Jahreszinsen.', 'Rechne ' + eur(Zj) + ' : 360 · ' + v.t + '.'],
        solution: zt(v.K, v.p, v.t) + ' = ' + eur(Zj) + ' · ' + fr(v.t, 360) + ' = <b>' + eur(v.Z) + '</b>.',
        mistakes: function (x) { if (near(x[0], Zj)) return 'Das sind die Jahreszinsen. Das Geld war aber nur ' + v.t + ' Tage angelegt.'; if (near(x[0], r2(Zj * v.t / 365))) return 'Rechne kaufmännisch: Ein Zinsjahr hat 360 Tage, nicht 365.'; if (near(x[0], Zj * v.t)) return 'Teile noch durch 360.'; return null; },
        verify: function () { return Math.abs(v.Z / (v.K * v.p / 100) * 360 - v.t) < 1e-6 || 'Rückrechnung t falsch'; } };
    },
    zeitraum: function (lvl) {
      for (var i = 0; i < 400; i++) {
        var D = pickDates(lvl >= 2 ? 2 : 1), K = M.pick(KS), p = M.pick(PS);
        if (!isInt(K * p * D.t / 360)) continue;
        var Z = r2(K * p * D.t / 36000);
        return { skill: 'Zinsen für einen Zeitraum', level: lvl,
          q: 'Herr Weber zahlt am ' + dstr(D.d1, D.m1) + ' ' + eur(K) + ' auf ein Sparkonto mit ' + pct(p) + ' Zinsen pro Jahr ein. Am ' + dstr(D.d2, D.m2) + ' hebt er alles ab.<br><b>Wie viele Zinstage sind das (kaufmännisch)? Wie viele Zinsen bekommt er?</b>',
          inputs: [{ kind: 'num', answer: D.t, label: 'Zinstage', unit: 'Tage' }, money(Z, 'Zinsen Z =')],
          hints: ['Zähle die Tage: jeder volle Monat 30 Tage, dann die restlichen Tage.', countSol(D), 'Z = ' + M.fmtNum(K) + ' · ' + M.fmtNum(p) + ' : 100 · ' + D.t + ' : 360.'],
          solution: countSol(D) + '<br>' + zt(K, p, D.t) + ' = <b>' + eur(Z) + '</b>.',
          mistakes: function (x) { var y = M.parseNum(x[0]); if (y === D.real && D.real !== D.t) return 'Bei den Tagen: Du hast Kalendertage gezählt. Kaufmännisch hat jeder Monat 30 Tage.'; return null; },
          verify: function () { return Math.abs(Z - r2(K * p / 100 * D.t / 360)) < 1e-9 || 'Z falsch'; } };
      }
      return gen.tageszinsen(2);
    },
    dispo: function (lvl) {
      var v = pickKPT([10, 12, 15, 18, 20, 24, 30, 36, 40, 45], [300, 400, 500, 600, 750, 800, 900, 1000, 1200, 1500], [9, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14]);
      var n = M.pick(NAMES), Zj = r2(v.K * v.p / 100);
      return { skill: 'Dispozinsen',
        q: n + 's Girokonto ist für <b>' + v.t + ' Tage</b> um ' + eur(v.K) + ' überzogen. Die Bank verlangt dafür <b>' + pct(v.p) + ' Dispozinsen</b> pro Jahr. <b>Wie viele Zinsen muss ' + n + ' bezahlen?</b> Rechne kaufmännisch.',
        inputs: [money(v.Z, 'Dispozinsen')],
        hints: ['Das Minus auf dem Konto ist ein kleiner Kredit. Er wird wie ein Kapital verzinst: K = ' + eur(v.K) + '.', 'Jahreszinsen wären ' + M.fmtNum(v.K) + ' · ' + M.fmtNum(v.p) + ' : 100 = ' + eur(Zj) + '.', 'Für ' + v.t + ' Tage: ' + eur(Zj) + ' · ' + v.t + ' : 360.'],
        solution: zt(v.K, v.p, v.t) + ' = <b>' + eur(v.Z) + '</b>. Dispozinsen sind sehr hoch. Ein Konto sollte nur kurz im Minus sein.',
        mistakes: function (x) { if (near(x[0], Zj)) return 'Das wären die Zinsen für ein ganzes Jahr. Das Konto war nur ' + v.t + ' Tage im Minus.'; if (near(x[0], r2(Zj * v.t / 365))) return 'Rechne kaufmännisch mit 360 Tagen.'; return null; },
        verify: function () { return Math.abs(v.Z * 36000 / (v.K * v.t) - v.p) < 1e-9 || 'p falsch'; } };
    },
    vergleich: function () {
      var want = M.rnd(0, 1);
      for (var i = 0; i < 800; i++) {
        var K = M.pick([600, 800, 1000, 1200, 1500, 2000, 2400, 3000]), m = M.pick([3, 4, 6, 8, 9]), pa = M.pick([7, 8, 9, 10, 11, 12]), pb = M.pick([3, 4, 5, 6]), fee = M.pick([5, 10, 15, 20, 25]);
        if (!isInt(K * pa * m / 12) || !isInt(K * pb * m / 12)) continue;
        var ca = r2(K * pa * m / 1200), cb = r2(K * pb * m / 1200 + fee), diff = r2(Math.abs(ca - cb));
        if (diff < 1) continue;
        var best = ca < cb ? 0 : 1;
        if (best !== want && i < 600) continue;
        return { skill: 'Kreditangebote vergleichen', level: 2,
          q: 'Selin braucht einen Kredit über ' + eur(K) + ' für <b>' + m + ' Monate</b>.<br><b>Angebot A:</b> ' + pct(pa) + ' Zinsen pro Jahr, keine Gebühr.<br><b>Angebot B:</b> ' + pct(pb) + ' Zinsen pro Jahr und eine einmalige Bearbeitungsgebühr von ' + eur(fee) + '.<br>Welches Angebot ist günstiger? Um wie viel?',
          inputs: [{ kind: 'mc', label: 'Günstiger ist …', options: ['Angebot A', 'Angebot B', 'Beide kosten gleich viel.'], answer: best }, money(diff, 'Ersparnis')],
          hints: ['Berechne für jedes Angebot die Kosten für ' + m + ' Monate.', 'A: ' + M.fmtNum(K) + ' · ' + M.fmtNum(pa) + ' : 100 · ' + m + ' : 12 = ' + eur(ca) + '.', 'B: ' + M.fmtNum(K) + ' · ' + M.fmtNum(pb) + ' : 100 · ' + m + ' : 12 + ' + eur(fee) + ' = ' + eur(cb) + '. Vergleiche.'],
          solution: 'A kostet ' + zm(K, pa, m) + ' = ' + eur(ca) + '. B kostet ' + eur(r2(K * pb * m / 1200)) + ' + ' + eur(fee) + ' = ' + eur(cb) + '. <b>Angebot ' + 'AB'[best] + '</b> ist um ' + eur(diff) + ' günstiger.',
          verify: function () { return (best === 0) === (K * (pa - pb) * m / 1200 < fee) || 'Vergleich falsch'; } };
      }
      return gen.dispo(2);
    },
    zeit_gesucht: function () {
      var v = pickKPT([30, 40, 45, 60, 72, 80, 90, 100, 120, 144, 150, 160, 180, 200, 240, 270, 300]), n = M.pick(NAMES), Zj = r2(v.K * v.p / 100);
      return { skill: 'Anlagedauer berechnen', level: 3,
        q: n + ' hat ' + eur(v.K) + ' zu ' + pct(v.p) + ' pro Jahr angelegt und dafür ' + eur(v.Z) + ' Zinsen bekommen. <b>Wie viele Tage war das Geld angelegt?</b> Rechne kaufmännisch.',
        inputs: [{ kind: 'num', answer: v.t, label: 'Dauer', unit: 'Tage' }],
        hints: ['Berechne zuerst die Jahreszinsen: ' + eur(Zj) + '. Die Zinsen für einen Tag sind ' + eur(Zj) + ' : 360.', 'Welchen Anteil der Jahreszinsen hat ' + n + ' bekommen? ' + fr(M.fmtNum(v.Z), M.fmtNum(Zj)) + ' = ' + fh(M.red(F(v.t, 360))) + '.', 'Multipliziere diesen Anteil mit 360 Tagen. Oder: t = Z · 100 · 360 : (K · p).'],
        solution: 'Jahreszinsen: ' + eur(Zj) + '. Anteil: ' + fr(M.fmtNum(v.Z), M.fmtNum(Zj)) + ' = ' + fh(M.red(F(v.t, 360))) + '. t = ' + fh(M.red(F(v.t, 360))) + ' · 360 = <b>' + v.t + ' Tage</b>. Kontrolle: ' + zt(v.K, v.p, v.t) + ' = ' + eur(v.Z) + '.',
        mistakes: function (x) { var y = M.parseNum(x[0]); if (y !== null && Math.abs(y - v.t / 30) < 0.01) return 'Das ist die Dauer in Monaten. Gefragt sind Tage: Ein Monat hat 30 Zinstage.'; return null; },
        verify: function () { return Math.abs(r2(v.K * v.p * v.t / 36000) - v.Z) < 1e-9 || 'Probe falsch'; } };
    },
    zinseszins: function () {
      var K = M.pick([1000, 2000, 2500, 3000, 4000, 5000]), p = M.pick([2, 3, 4, 5, 6]);
      var G1 = r2(K * (1 + p / 100)), G2 = r2(G1 * (1 + p / 100)), lin = r2(K + 2 * K * p / 100);
      var right = 'Im 2. Jahr gibt es auch Zinsen auf die Zinsen aus dem 1. Jahr.', opts = M.shuffle([right, 'Im 2. Jahr steigt der Zinssatz.', 'Im 2. Jahr rechnet die Bank mit 365 statt 360 Tagen.', 'Das Kapital wird im 2. Jahr von der Bank verdoppelt.']);
      return { skill: 'Grenzen der Formel: Zinseszins', level: 3,
        q: 'Tom legt ' + eur(K) + ' zu ' + pct(p) + ' pro Jahr an. Er lässt das Geld <b>zwei Jahre</b> auf dem Konto. Die Zinsen werden am Ende jedes Jahres gutgeschrieben und bleiben auf dem Konto.<br>a) Wie viel Geld hat Tom nach einem Jahr?<br>b) Wie viel Geld hat Tom nach zwei Jahren?<br>c) Mit der Formel für Monatszinsen (24 Monate) käme man auf ' + eur(lin) + '. Warum hat Tom in Wirklichkeit mehr?',
        inputs: [money(G1, 'a) nach 1 Jahr'), money(G2, 'b) nach 2 Jahren'), { kind: 'mc', label: 'c) Begründung', options: opts, answer: opts.indexOf(right) }],
        hints: ['Nach einem Jahr: ' + eur(K) + ' + ' + pct(p) + ' Zinsen = ' + eur(G1) + '.', 'Im 2. Jahr wird das neue Guthaben ' + eur(G1) + ' verzinst: ' + M.fmtNum(G1) + ' · ' + p + ' : 100 = ' + eur(r2(G1 * p / 100)) + '.', 'Vergleiche: Im 1. Jahr gab es ' + eur(r2(K * p / 100)) + ' Zinsen, im 2. Jahr ' + eur(r2(G1 * p / 100)) + '. Woher kommt der Unterschied?'],
        solution: 'a) ' + eur(K) + ' + ' + eur(r2(K * p / 100)) + ' = ' + eur(G1) + '. b) ' + eur(G1) + ' + ' + eur(r2(G1 * p / 100)) + ' = <b>' + eur(G2) + '</b>. c) Im 2. Jahr werden auch die Zinsen aus dem 1. Jahr mitverzinst. Das heißt <b>Zinseszins</b>. Die Formel Z = K · p : 100 · m : 12 gilt deshalb nur für Zeiträume bis zu einem Jahr.',
        verify: function () { return Math.abs(G2 - r2(K * Math.pow(1 + p / 100, 2))) < 0.006 && G2 > lin || 'Zinseszins falsch'; } };
    }
  };

  return {
    id: '009', title: 'Zinsen für Monate und Tage', bereich: 'Prozent und Zinsen', minutes: '45 bis 60',
    vorkenntnisse: 'Jahreszinsen berechnen (Modul 008), Brüche von Größen',
    lead: 'Was ist, wenn Geld nur ein paar Monate oder Tage auf dem Konto liegt? Du lernst, Zinsen für kürzere Zeiträume zu berechnen, und siehst, wo die Formel an ihre Grenzen kommt.',
    einstieg: { html: '<p>Jonas hat sein Konto im Oktober überzogen. Für <b>20 Tage</b> stand er mit <b>400 €</b> im Minus. Die Bank verlangt dafür <b>12 % Dispozinsen</b>.</p><p class="note">„12 Prozent von 400 € sind 48 €. So viel muss ich zahlen?“, fragt Jonas erschrocken. Hat er recht?</p><p>Nein. Die 12 % gelten für ein <b>ganzes Jahr</b>. Jonas war aber nur 20 Tage im Minus. In diesem Modul lernst du, wie man Zinsen für Monate und Tage berechnet.</p>' },
    ziele: ['Ich berechne Zinsen für einige Monate mit Z = K · p : 100 · m : 12.', 'Ich zähle Zinstage nach der kaufmännischen Methode (30 Tage pro Monat, 360 Tage pro Jahr).', 'Ich berechne Tageszinsen, zum Beispiel Dispozinsen.', 'Ich vergleiche Angebote mit unterschiedlichen Zinsen und Gebühren.', 'Ich erkläre, warum die Formel nur für Zeiträume bis zu einem Jahr gilt.'],
    fachwoerter: [['Monatszinsen', 'Zinsen für einen Teil des Jahres: Z = K · p : 100 · m : 12 (m = Anzahl der Monate).'], ['Tageszinsen', 'Zinsen für t Tage: Z = K · p : 100 · t : 360.'], ['Kaufmännische Methode', 'Rechenregel für Zinstage: Jeder Monat hat 30 Tage, das Jahr hat 360 Tage.'], ['Dispozinsen', 'Hohe Zinsen, die die Bank verlangt, wenn das Girokonto im Minus ist (Dispositionskredit).'], ['Zinseszins', 'Zinsen, die auf schon gutgeschriebene Zinsen gezahlt werden. Das passiert ab dem zweiten Jahr.']],
    diagnose: [
      { q: 'Wie viele Jahreszinsen bringen 1 500 € bei 2 %?', options: ['30 €', '300 €', '3 €', 'Weiß ich noch nicht'], answer: 0, why: '1 % von 1 500 € sind 15 €, also 2 % = 30 €.', review: 'Jahreszinsen (Modul 008)' },
      { q: 'Welcher Bruchteil eines Jahres sind 3 Monate?', options: [fr(1, 4), fr(1, 3), fr(3, 10), 'Weiß ich noch nicht'], answer: 0, why: '3 von 12 Monaten: ' + fr(3, 12) + ' = ' + fr(1, 4) + '.', review: 'Brüche kürzen, Anteile' },
      { q: 'Wie viel sind ' + fr(3, 4) + ' von 80 €?', options: ['60 €', '20 €', '75 €', 'Weiß ich noch nicht'], answer: 0, why: '80 € : 4 = 20 €, mal 3 = 60 €.', review: 'Anteile von Größen berechnen' },
      { q: 'Ein Kapital von 2 000 € bringt 50 € Jahreszinsen. Wie hoch ist der Zinssatz?', options: ['2,5 %', '25 %', '4 %', 'Weiß ich noch nicht'], answer: 0, why: 'p = 50 · 100 : 2 000 = 2,5.', review: 'Zinssatz berechnen (Modul 008)' }],
    erklaerung:
      '<h3>1. Zinsen für einige Monate</h3><p>Ein Zinssatz gilt immer für ein Jahr. Liegt Geld nur einige Monate auf dem Konto, gibt es nur den passenden Teil der Jahreszinsen. Beispiel: 2 400 € zu 3 % für 4 Monate.</p>' +
      '<p>Jahreszinsen: 2 400 · 3 : 100 = 72 €. Für 4 Monate gibt es ' + fr(4, 12) + ' davon: 72 € · ' + fr(4, 12) + ' = <b>24 €</b>.</p>' +
      '<div class="merk"><b>Merke:</b> Monatszinsen: <span class="big-math">Z = K · ' + fr('p', '100') + ' · ' + fr('m', '12') + '</span><br>Tageszinsen: <span class="big-math">Z = K · ' + fr('p', '100') + ' · ' + fr('t', '360') + '</span><br>m = Anzahl der Monate, t = Anzahl der Zinstage.</div>' +
      '<h3>2. Die kaufmännische Methode (30/360)</h3><p>Monate sind unterschiedlich lang. Damit das Rechnen einfacher wird, gilt in der deutschen kaufmännischen Zinsrechnung:</p><ul><li>Jeder Monat hat <b>30 Zinstage</b>, auch Februar und Monate mit 31 Tagen.</li><li>Ein Zinsjahr hat <b>360 Tage</b>.</li><li>Der Einzahlungstag zählt nicht mit, der Auszahlungstag zählt mit. Du rechnest also einfach die Differenz.</li></ul>' +
      '<p><b>Beispiel:</b> Vom 15. März bis zum 20. Juli. Von März bis Juli sind es 4 Monate: 4 · 30 = 120 Tage. Vom 15. bis zum 20. kommen 5 Tage dazu. Zusammen: <b>125 Zinstage</b>.</p>' +
      '<p class="note">Viele Banken zählen heute die echten Kalendertage. In diesem Modul rechnest du immer mit der kaufmännischen Methode.</p>' +
      '<h3>3. Dispozinsen</h3><p>Ist dein Girokonto im Minus, leiht dir die Bank Geld. Dafür verlangt sie <b>Dispozinsen</b>, oft mehr als 10 % pro Jahr. Jonas aus dem Einstieg zahlt für 400 € und 20 Tage bei 12 %: Z = 400 · ' + fr(12, 100) + ' · ' + fr(20, 360) + ' = 48 € · ' + fr(20, 360) + ' ≈ <b>2,67 €</b>.</p>' +
      '<h3>4. Grenzen der Formel</h3><p>Die Formeln gelten nur für Zeiträume <b>bis zu einem Jahr</b>. Bleibt das Geld länger liegen, werden die Zinsen am Jahresende gutgeschrieben und im nächsten Jahr <b>mitverzinst</b>. Dann bekommt man mehr, als die Formel angibt. Mehr dazu erfährst du im Weiterdenken.</p>',
    entdecken: {
      html: '<p>Verändere Kapital, Zinssatz und Anlagedauer. Der obere Streifen ist ein Zinsjahr mit 12 Monaten zu je 30 Tagen. Die Balken zeigen die Jahreszinsen und den Teil, den es für die gewählte Dauer gibt.</p>' +
        '<div class="ctl"><label>K = <b id="v_k"></b> <input type="range" id="r_k" min="500" max="10000" step="500" value="3000"></label><label>p = <b id="v_p"></b> <input type="range" id="r_p" min="0.5" max="12" step="0.5" value="3"></label><label>t = <b id="v_t"></b> <input type="range" id="r_t" min="10" max="360" step="10" value="90"></label></div>' +
        '<svg id="e_svg" class="viz" viewBox="0 0 360 180" role="img" aria-label="Zinsjahr mit 360 Tagen und Zinsbalken" style="max-width:480px"></svg><div id="e_txt"></div>' +
        '<ul><li>Welchen Teil der Jahreszinsen gibt es für 90 Tage? Und für 180 Tage?</li><li>Was passiert bei t = 360?</li></ul>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var K = +root.querySelector('#r_k').value, p = +root.querySelector('#r_p').value, t = +root.querySelector('#r_t').value;
          var Zj = r2(K * p / 100), Z = r2(K * p * t / 36000), f = M.red(F(t, 360));
          root.querySelector('#v_k').textContent = eur(K); root.querySelector('#v_p').textContent = pct(p); root.querySelector('#v_t').textContent = t + ' Tage';
          var x0 = 12, W = 336, mw = W / 12, s = '<text x="' + x0 + '" y="16" font-size="12" font-weight="700" fill="#3d2a73">1 Zinsjahr = 12 Monate · 30 Tage = 360 Tage</text>';
          s += '<rect x="' + x0 + '" y="24" width="' + (W * t / 360) + '" height="28" fill="#d97706" opacity="0.85"/>';
          for (var i = 0; i < 12; i++) s += '<rect x="' + (x0 + i * mw) + '" y="24" width="' + mw + '" height="28" fill="none" stroke="#3d2a73" stroke-width="1.2"/><text x="' + (x0 + i * mw + mw / 2) + '" y="66" font-size="10" text-anchor="middle" fill="#5a5670">' + MON[i].slice(0, 3) + '</text>';
          s += '<text x="' + x0 + '" y="92" font-size="12" fill="#1c1830">Jahreszinsen: ' + eur(Zj) + '</text><rect x="' + x0 + '" y="98" width="' + W + '" height="20" fill="#efeafb" stroke="#3d2a73" stroke-width="1.5"/>';
          s += '<text x="' + x0 + '" y="140" font-size="12" font-weight="700" fill="#b45309">Zinsen für ' + t + ' Tage: ' + eur(Z) + '</text><rect x="' + x0 + '" y="146" width="' + (W * t / 360) + '" height="20" fill="#d97706" stroke="#b45309" stroke-width="1.5"/>';
          root.querySelector('#e_svg').innerHTML = s;
          root.querySelector('#e_txt').innerHTML = '<p>' + t + ' Tage = ' + fr(t, 360) + (f.d !== 360 ? ' = ' + fh(f) : '') + ' Jahr' + (t % 30 === 0 ? ' = ' + t / 30 + (t === 30 ? ' Monat' : ' Monate') : '') + '</p><p class="big-math">' + zt(K, p, t) + ' = ' + eur(Z) + '</p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Genau: Für t Tage gibt es den Anteil t : 360 der Jahreszinsen. Halbe Zeit, halbe Zinsen.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Zinsen für einen Zeitraum', q: 'Frau Neumann zahlt am 10. Februar 4 800 € auf ein Sparkonto mit 2,5 % Zinsen pro Jahr ein. Am 25. Juni hebt sie das Geld wieder ab. Wie viele Zinsen bekommt sie?',
      steps: ['Zinstage zählen: Vom 10. Februar bis zum 10. Juni sind es 4 Monate, also 4 · 30 = 120 Tage.', 'Vom 10. Juni bis zum 25. Juni kommen 15 Tage dazu. Zusammen: 135 Zinstage.', 'Jahreszinsen: 4 800 · 2,5 : 100 = 120 €.', 'Tageszinsen: Z = 120 € · ' + fr(135, 360) + ' = 120 € · ' + fr(3, 8) + ' = <b>45 €</b>.', 'Kontrolle: 135 Tage sind etwas mehr als ein Drittel des Jahres. Ein Drittel von 120 € wären 40 €. 45 € passt.'] },
    tasks: { gen: gen, plan: { G: ['anteil:1', 'monatszinsen:1', 'tage_zaehlen:1', 'tageszinsen:1'], S: ['monatszinsen:2', 'tage_zaehlen:2', 'tageszinsen:2', 'dispo:2', 'vergleich:2'], E: ['monatszinsen:2', 'zeitraum:2', 'dispo:2', 'vergleich:2', 'zeit_gesucht:3', 'tageszinsen:3'] },
      extra: 'zinseszins', test: ['anteil:1', 'monatszinsen:2', 'tage_zaehlen:2', 'tageszinsen:2', 'dispo:2', 'zeit_gesucht:3'] },
    lerncheck: ['Ich berechne Zinsen für einige Monate.', 'Ich zähle Zinstage nach der kaufmännischen Methode.', 'Ich berechne Tageszinsen, zum Beispiel Dispozinsen.', 'Ich kann erklären, warum die Formel nur bis zu einem Jahr gilt.']
  };
})();
