/* Modul 002 · Brüche dividieren */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  function proper(maxD, minD) { var d = M.rnd(minD || 2, maxD), n; do { n = M.rnd(1, d - 1); } while (M.gcd(n, d) !== 1); return F(n, d); }
  function frac(n, d) { return fh(F(n, d), true); }
  function fr(f) { return frac(f.n, f.d); }
  /* gemischte Schreibweise (nur positive Brüche) */
  function mix(f) {
    f = M.red(f); if (f.d === 1) return M.fmtNum(f.n);
    if (f.n < f.d) return fh(f);
    var g = Math.floor(f.n / f.d); return '<span style="white-space:nowrap">' + g + fh(F(f.n - g * f.d, f.d)) + '</span>';
  }
  function mixTxt(f) { f = M.red(f); if (f.d === 1) return String(f.n); if (f.n < f.d) return f.n + '/' + f.d; var g = Math.floor(f.n / f.d); return g + ' ' + (f.n - g * f.d) + '/' + f.d; }
  function kw(f) { return F(f.d, f.n); }
  function ansInput(f, label, unit) { var o = { kind: 'frac', answer: M.red(f), reduce: true, label: label || 'Ergebnis (vollständig gekürzt)', placeholder: 'z. B. 5/6 oder 1 1/2' }; if (unit) o.unit = unit; return o; }
  /* a : b = a · Kehrwert(b) = ... vollständig */
  function solDiv(a, b) {
    var raw = F(a.n * b.d, a.d * b.n), r = M.red(raw);
    return fr(a) + ' : ' + fr(b) + ' = ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = <span class="frac"><span>' + a.n + ' · ' + b.d + '</span><span>' + a.d + ' · ' + b.n + '</span></span> = ' + frac(raw.n, raw.d) +
      (raw.n !== r.n ? ' = ' + fh(r) : '') + (r.d > 1 && r.n > r.d ? ' = ' + mix(r) : '');
  }
  function divMistakes(a, b) {
    return function (v) {
      var f = M.parseFrac(v[0]); if (!f) return null;
      if (M.feq(f, M.fmul(a, b))) return 'Du hast multipliziert, ohne den Kehrwert zu bilden. Beim Dividieren drehst du den <b>zweiten</b> Bruch um und multiplizierst dann.';
      if (M.feq(f, M.fdiv(b, a))) return 'Du hast den falschen Bruch umgedreht. Nur der <b>zweite</b> Bruch (der Divisor) wird zum Kehrwert. Der erste bleibt, wie er ist.';
      if (M.feq(f, M.fmul(kw(a), kw(b)))) return 'Du hast beide Brüche umgedreht. Nur der zweite Bruch wird zum Kehrwert.';
      return null;
    };
  }
  /* Streifenmodell: Wie oft passt b in a? */
  function strip(a, b, opts) {
    opts = opts || {};
    var av = a.n / a.d, bv = b.n / b.d, units = Math.max(1, Math.ceil(av - 1e-9)), u = 300 / units, x0 = 20, s = '';
    s += '<svg class="viz" viewBox="0 0 340 150" role="img" aria-label="' + (opts.label || 'Streifenmodell') + '" style="max-width:460px">';
    for (var i = 0; i < units; i++) {
      s += '<rect x="' + (x0 + i * u) + '" y="6" width="' + u + '" height="22" fill="#fff" stroke="#b9b2cc" stroke-width="1.5"/>';
      for (var t = 1; t < b.d; t++) s += '<line x1="' + (x0 + i * u + t * u / b.d) + '" y1="24" x2="' + (x0 + i * u + t * u / b.d) + '" y2="28" stroke="#b9b2cc"/>';
      s += '<text x="' + (x0 + i * u + u / 2) + '" y="20" font-size="11" text-anchor="middle" fill="#5a5670">1 Ganzes</text>';
    }
    s += '<text x="' + x0 + '" y="48" font-size="13" font-weight="700" fill="#3d2a73">' + (opts.aLabel || mixTxt(a)) + '</text>';
    s += '<rect x="' + x0 + '" y="54" width="' + av * u + '" height="26" fill="#efeafb" stroke="#3d2a73" stroke-width="2"/>';
    var n = Math.floor(av / bv + 1e-9), rest = av / bv - n, bw = bv * u;
    s += '<text x="' + x0 + '" y="100" font-size="13" font-weight="700" fill="#5b3fa0">' + (opts.bLabel || ('Stücke zu ' + mixTxt(b))) + '</text>';
    for (var k = 0; k < n; k++) {
      s += '<rect x="' + (x0 + k * bw) + '" y="106" width="' + bw + '" height="26" fill="' + (k % 2 ? '#8b74c9' : '#5b3fa0') + '" stroke="#fff" stroke-width="1.5"/>';
      if (bw >= 14 && !opts.noNums) s += '<text x="' + (x0 + k * bw + bw / 2) + '" y="124" font-size="' + (bw >= 22 ? 13 : 10) + '" text-anchor="middle" fill="#fff" font-weight="700">' + (k + 1) + '</text>';
    }
    if (rest > 1e-9) {
      s += '<rect x="' + (x0 + n * bw) + '" y="106" width="' + bw + '" height="26" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="5 3"/>' +
        '<rect x="' + (x0 + n * bw) + '" y="106" width="' + rest * bw + '" height="26" fill="#f6d9a8" stroke="#d97706" stroke-width="1.5"/>';
    }
    return s + '</svg>';
  }
  /* Bild für Bruch : natürliche Zahl, z. B. 3/4 : 2 */
  function shareSvg(a, n) {
    var W = 300, H = 120, x0 = 20, y0 = 10, cw = W / a.d, ch = H / n, s = '<svg class="viz" viewBox="0 0 340 178" role="img" aria-label="Aufteilen eines Anteils" style="max-width:420px">';
    for (var j = 0; j < a.d; j++) for (var i = 0; i < n; i++) {
      var col = j < a.n ? (i === 0 ? '#5b3fa0' : '#cfc2ee') : '#fff';
      s += '<rect x="' + (x0 + j * cw) + '" y="' + (y0 + i * ch) + '" width="' + cw + '" height="' + ch + '" fill="' + col + '" stroke="#3d2a73" stroke-width="1.5"/>';
    }
    s += '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="none" stroke="#3d2a73" stroke-width="2.5"/>';
    s += '<text x="' + (x0 + W / 2) + '" y="' + (y0 + H + 22) + '" font-size="13" text-anchor="middle" fill="#3d2a73">gefärbt: ' + a.n + '/' + a.d + ' der Pizza</text><text x="' + (x0 + W / 2) + '" y="' + (y0 + H + 42) + '" font-size="13" text-anchor="middle" fill="#5b3fa0" font-weight="700">dunkel: Anteil eines Kindes = ' + a.n + '/' + (a.d * n) + '</text>';
    return s + '</svg>';
  }
  var BS = [F(1, 8), F(1, 4), F(1, 5), F(1, 10), F(3, 8), F(2, 5), F(3, 4), F(1, 6), F(1, 3), F(2, 3), F(3, 10)];

  var gen = {
    nat: function (lvl) {
      var a, n;
      do {
        n = M.rnd(2, lvl >= 2 ? 7 : 5);
        if (Math.random() < 0.5) { var d = M.rnd(3, 9), m = M.rnd(1, Math.floor((d - 1) / n)); a = F(n * m, d); }
        else a = proper(lvl >= 2 ? 9 : 6);
      } while (a.n === 0 || a.n >= a.d || M.gcd(a.n, a.d) !== 1);
      var r = M.fdiv(a, F(n, 1));
      return { skill: 'Bruch durch natürliche Zahl', level: lvl, q: 'Berechne. <span class="big-math">' + fr(a) + ' : ' + n + '</span>', inputs: [ansInput(r)],
        hints: ['Stell dir vor: ' + fr(a) + ' werden gerecht auf ' + n + ' Personen verteilt. Jede bekommt ' + frac(1, n) + ' davon.', 'Durch ' + n + ' teilen heißt: mal ' + frac(1, n) + '. Also ' + fr(a) + ' · ' + frac(1, n) + '.', a.n % n === 0 ? 'Hier geht es sogar direkt: Zähler ' + a.n + ' : ' + n + ' = ' + a.n / n + ', der Nenner ' + a.d + ' bleibt.' : 'Der Zähler bleibt ' + a.n + ', der Nenner wird ' + a.d + ' · ' + n + ' = ' + a.d * n + '. Kürze, wenn möglich.'],
        solution: fr(a) + ' : ' + n + ' = ' + fr(a) + ' · ' + frac(1, n) + ' = <span class="frac"><span>' + a.n + '</span><span>' + a.d + ' · ' + n + '</span></span> = ' + frac(a.n, a.d * n) + (M.gcd(a.n, a.d * n) > 1 ? ' = ' + fh(r) : '') + '. Das Ergebnis ist kleiner als ' + fr(a) + ', denn du verteilst.',
        verify: function () { return M.feq(M.fmul(r, F(n, 1)), a) ? true : 'Probe ' + n + ' · Ergebnis ≠ a'; },
        mistakes: function (v) {
          var f = M.parseFrac(v[0]); if (!f) return null;
          if (M.feq(f, F(a.n * n, a.d))) return 'Du hast mit ' + n + ' multipliziert. Beim Teilen wird der Anteil aber <b>kleiner</b>. Multipliziere den <b>Nenner</b> mit ' + n + '.';
          if (M.feq(f, F(n * a.d, a.n))) return 'Du hast den falschen Bruch umgedreht. ' + n + ' = ' + frac(n, 1) + ', der Kehrwert davon ist ' + frac(1, n) + '.';
          return null;
        } };
    },
    kehrwert: function (lvl) {
      var a, b;
      do { a = proper(lvl >= 2 ? 9 : 6); b = proper(lvl >= 2 ? 9 : 6); } while (M.feq(a, b));
      var r = M.fdiv(a, b);
      return { skill: 'Bruch durch Bruch (Kehrwert)', level: lvl, q: 'Berechne. <span class="big-math">' + fr(a) + ' : ' + fr(b) + '</span><br><small>Ein Ergebnis größer als 1 darfst du als unechten Bruch (7/4) oder gemischt (1 3/4) schreiben.</small>', inputs: [ansInput(r)],
        hints: ['Teilen durch einen Bruch heißt: mit seinem <b>Kehrwert</b> multiplizieren. Der Kehrwert von ' + fr(b) + ' ist ' + frac(b.d, b.n) + '.', 'Rechne ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = <span class="frac"><span>' + a.n + ' · ' + b.d + '</span><span>' + a.d + ' · ' + b.n + '</span></span>.', 'Zähler: ' + a.n * b.d + ', Nenner: ' + a.d * b.n + '. Kürze vollständig' + (M.gcd(a.n * b.d, a.d * b.n) > 1 ? ' (durch ' + M.gcd(a.n * b.d, a.d * b.n) + ').' : '. Hier geht nichts mehr zu kürzen.')],
        solution: solDiv(a, b), mistakes: divMistakes(a, b),
        verify: function () { return M.feq(M.fmul(r, b), a) ? true : 'Probe Ergebnis · b ≠ a'; } };
    },
    gemischt: function (lvl) {
      var g, f, a, b, r, useMixed = lvl >= 3 && Math.random() < 0.4, tries = 0;
      do {
        g = M.rnd(1, 3); f = proper(5); a = F(g * f.d + f.n, f.d);
        if (useMixed) { var h = proper(4); b = F(h.d + h.n, h.d); } else b = proper(8, 3);
        r = M.fdiv(a, b); tries++;
      } while (tries < 60 && (r.d > 8 || r.n > 40));
      var bShow = useMixed ? mix(b) : fr(b);
      return { skill: 'Gemischte Zahlen dividieren', level: 3, q: 'Berechne. <span class="big-math">' + g + fr(f) + ' : ' + bShow + '</span>', inputs: [ansInput(r, 'Ergebnis (gekürzt, auch gemischt möglich)')],
        hints: ['Wandle die gemischte' + (useMixed ? 'n Zahlen' : ' Zahl') + ' zuerst in ' + (useMixed ? 'unechte Brüche' : 'einen unechten Bruch') + ' um.', g + fr(f) + ' = <span class="frac"><span>' + g + ' · ' + f.d + ' + ' + f.n + '</span><span>' + f.d + '</span></span> = ' + fr(a) + (useMixed ? ' und ' + bShow + ' = ' + fr(b) : '') + '.', 'Rechne jetzt ' + fr(a) + ' · ' + frac(b.d, b.n) + ' und kürze.'],
        solution: g + fr(f) + ' = ' + fr(a) + (useMixed ? ', ' + bShow + ' = ' + fr(b) : '') + '. ' + solDiv(a, b),
        verify: function () { return M.feq(M.fmul(r, b), a) ? true : 'Probe'; },
        mistakes: function (v) {
          var x = M.parseFrac(v[0]); if (!x) return null;
          if (M.feq(x, M.fadd(F(g, 1), M.fdiv(f, b)))) return 'Du hast nur den Bruchteil geteilt. Die ganze Zahl gehört dazu. Wandle zuerst in einen unechten Bruch um.';
          return divMistakes(a, b)(v);
        } };
    },
    passt: function (lvl) {
      var b = lvl >= 2 ? M.pick(BS) : M.pick([F(1, 2), F(1, 3), F(1, 4), F(1, 6), F(1, 8)]), t, a;
      do { t = M.rnd(2, lvl >= 2 ? 10 : 8); a = M.fmul(F(t, 1), b); } while (a.n / a.d > (lvl >= 2 ? 4 : 2.5) || (lvl < 2 && a.d === 1 && a.n === 1));
      var pic = lvl < 2, L = M.lcm(a.d, b.d), aL = a.n * L / a.d, bL = b.n * L / b.d;
      return { skill: 'Wie oft passt … hinein?', level: lvl, q: 'Wie oft passt ' + mix(b) + ' in ' + mix(a) + '?' + (pic ? ' Das Bild hilft dir.' + strip(a, b, { noNums: true }) : ''), inputs: [{ kind: 'num', answer: t, label: 'Anzahl' }],
        hints: ['Die Frage „Wie oft passt ' + mix(b) + ' in ' + mix(a) + '?“ ist die Division ' + mix(a) + ' : ' + mix(b) + '.', 'Schreibe beides mit demselben Nenner ' + L + ': ' + mix(a) + ' = ' + frac(aL, L) + ' und ' + mix(b) + ' = ' + frac(bL, L) + '. Wie oft passen ' + bL + ' Teile in ' + aL + ' Teile?', 'Oder mit dem Kehrwert: ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = ' + frac(a.n * b.d, a.d * b.n) + '. Kürze das Ergebnis.'],
        solution: mix(a) + ' : ' + mix(b) + ' = ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = ' + frac(a.n * b.d, a.d * b.n) + ' = ' + t + '. ' + mix(b) + ' passt ' + t + '-mal hinein.' + strip(a, b),
        verify: function () { return M.feq(M.fmul(F(t, 1), b), a) && M.feq(M.fdiv(a, b), F(t, 1)) ? true : 'Anzahl falsch'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - 1 / t) < 1e-6) return 'Du hast andersherum geteilt. Gefragt ist: Wie viele Stücke ' + mix(b) + ' ergeben ' + mix(a) + '? Das Ergebnis ist eine Anzahl größer als 1.'; return null; } };
    },
    saft: function (lvl) {
      var b, t, a;
      do { b = M.pick(BS); t = M.rnd(3, 12); a = M.fmul(F(t, 1), b); } while (a.n / a.d > 4.5 || a.d > 10 || a.n / a.d <= 1);
      var ctx = M.pick([
        ['Für die Klassenfeier gibt es ' + mix(a) + ' l Apfelsaft. In jedes Glas passen ' + mix(b) + ' l. Wie viele Gläser kannst du füllen?', 'Gläser', 'l'],
        ['Lina hat ' + mix(a) + ' m Geschenkband. Für jedes Päckchen braucht sie ' + mix(b) + ' m. Für wie viele Päckchen reicht das Band?', 'Päckchen', 'm'],
        ['In einem Sack sind ' + mix(a) + ' kg Vogelfutter. Es wird in Tüten zu je ' + mix(b) + ' kg abgefüllt. Wie viele Tüten werden voll?', 'Tüten', 'kg'],
        ['Die Projektzeit dauert ' + mix(a) + ' Stunden. Jede Gruppe stellt ' + mix(b) + ' Stunden lang ihr Ergebnis vor. Wie viele Gruppen können vorstellen?', 'Gruppen', 'h']]);
      return { skill: 'Sachaufgabe: Wie oft passt …?', level: lvl, q: ctx[0], inputs: [{ kind: 'num', answer: t, label: 'Anzahl ' + ctx[1] }],
        hints: ['Gefragt ist, wie oft ' + mix(b) + ' ' + ctx[2] + ' in ' + mix(a) + ' ' + ctx[2] + ' passen. Das ist eine Division.', 'Rechne ' + fr(a) + ' : ' + fr(b) + ' = ' + fr(a) + ' · ' + frac(b.d, b.n) + '.', 'Kontrolle: ' + t + ' · ' + fr(b) + ' muss wieder ' + mix(a) + ' ergeben. Antwortsatz nicht vergessen.'],
        solution: solDiv(a, b) + '. Antwort: Es reicht für ' + t + ' ' + ctx[1] + '. Probe: ' + t + ' · ' + fr(b) + ' = ' + frac(t * b.n, b.d) + ' = ' + mix(a) + ' ' + ctx[2] + '.',
        verify: function () { return M.feq(M.fmul(F(t, 1), b), a) ? true : 'Probe'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - (a.n / a.d) * (b.n / b.d)) < 1e-6) return 'Du hast multipliziert. Gesucht ist, wie oft ' + mix(b) + ' hineinpasst. Teile also durch ' + mix(b) + '.'; return null; } };
    },
    teilen: function (lvl) {
      var a, n;
      do { a = proper(9, 3); n = M.rnd(2, 6); } while (a.n / a.d < 0.3);
      var r = M.fdiv(a, F(n, 1));
      var ctx = M.pick([
        ['Von einer Pizza ist noch ' + fr(a) + ' übrig. ' + n + ' Kinder teilen sich den Rest gerecht. Welchen Anteil der <b>ganzen</b> Pizza bekommt jedes Kind?', ''],
        ['Ein ' + fr(a) + ' km langer Wanderweg wird in ' + n + ' gleich lange Abschnitte eingeteilt. Wie lang ist ein Abschnitt?', 'km'],
        [fr(a) + ' l Saft werden gleichmäßig auf ' + n + ' Gläser verteilt. Wie viel Liter sind in jedem Glas?', 'l'],
        ['Ein ' + fr(a) + ' m langes Brett wird in ' + n + ' gleich lange Stücke gesägt. Wie lang ist ein Stück?', 'm']]);
      return { skill: 'Sachaufgabe: Aufteilen', level: lvl, q: ctx[0], inputs: [ansInput(r, 'Ergebnis (gekürzt)', ctx[1] || undefined)],
        hints: ['Hier wird gerecht verteilt. Rechne ' + fr(a) + ' : ' + n + '.', 'Teilen durch ' + n + ' heißt: mal ' + frac(1, n) + '. Der Nenner wird also mit ' + n + ' multipliziert.', fr(a) + ' : ' + n + ' = ' + frac(a.n, a.d * n) + '. Kürze, wenn möglich, und schreibe einen Antwortsatz.'],
        solution: fr(a) + ' : ' + n + ' = ' + frac(a.n, a.d * n) + (M.gcd(a.n, a.d * n) > 1 ? ' = ' + fh(r) : '') + (ctx[1] ? ' ' + ctx[1] : '') + '. Probe: ' + n + ' · ' + fh(r) + ' = ' + fr(a) + '.',
        verify: function () { return M.feq(M.fmul(r, F(n, 1)), a) ? true : 'Probe'; },
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, F(a.n * n, a.d))) return 'Du hast multipliziert. Jedes Teil ist <b>kleiner</b> als ' + fr(a) + '.'; return null; } };
    },
    regel: function () {
      var a, b; do { a = proper(7); b = proper(7); } while (M.feq(a, b) || M.feq(a, kw(b)));
      var lhs = fr(a) + ' : ' + fr(b) + ' = ';
      var opts = M.shuffle([[lhs + fr(a) + ' · ' + frac(b.d, b.n), true], [lhs + frac(a.d, a.n) + ' · ' + fr(b), false], [lhs + fr(a) + ' · ' + fr(b), false], [lhs + frac(a.d, a.n) + ' · ' + frac(b.d, b.n), false]]);
      return { skill: 'Kehrwert-Regel erkennen', level: 1, q: 'Welche Umformung ist richtig?', inputs: [{ kind: 'mc', options: opts.map(function (o) { return o[0]; }), answer: opts.findIndex(function (o) { return o[1]; }), label: 'Wähle die richtige Umformung' }],
        hints: ['Beim Teilen durch einen Bruch wird mit dem Kehrwert multipliziert.', 'Der Kehrwert entsteht, wenn man Zähler und Nenner vertauscht.', 'Nur der <b>zweite</b> Bruch ' + fr(b) + ' wird umgedreht. Der erste bleibt stehen.'],
        solution: 'Richtig ist ' + fr(a) + ' : ' + fr(b) + ' = ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = ' + mix(M.fdiv(a, b)) + '.' };
    },
    vergleich: function () {
      var x = Math.random() < 0.5 ? F(M.rnd(2, 12), 1) : proper(9, 3), kind = M.pick(['k', 'k', 'g', 'g', 'e']), b;
      if (kind === 'k') b = proper(9, 2);
      else if (kind === 'g') { var d = M.rnd(2, 5), n; do { n = M.rnd(d + 1, 2 * d + 1); } while (M.gcd(n, d) !== 1); b = F(n, d); }
      else { var e = M.rnd(3, 7); b = F(e, e); }
      var xs = M.fstr(x).replace('/', '/');
      var opts = ['größer als ' + mix(x), 'kleiner als ' + mix(x), 'genau gleich ' + mix(x)], ans = kind === 'k' ? 0 : kind === 'g' ? 1 : 2;
      var bShow = frac(b.n, b.d);
      return { skill: 'Ergebnis abschätzen', level: 2, q: 'Rechne <b>nicht</b> aus. Ist das Ergebnis von <span class="big-math">' + mix(x) + ' : ' + bShow + '</span> größer oder kleiner als ' + mix(x) + '?', inputs: [{ kind: 'mc', options: opts, answer: ans, label: 'Das Ergebnis ist …' }],
        hints: ['Vergleiche den Divisor ' + bShow + ' mit 1.', 'Teilst du durch eine Zahl kleiner als 1, passt sie öfter als einmal hinein. Das Ergebnis wird größer.', 'Teilst du durch eine Zahl größer als 1, wird das Ergebnis kleiner. Teilst du durch 1, bleibt es gleich.'],
        solution: bShow + (kind === 'k' ? ' ist kleiner als 1. Das Ergebnis ist also größer als ' : kind === 'g' ? ' ist größer als 1. Das Ergebnis ist also kleiner als ' : ' ist genau 1. Das Ergebnis ist also gleich ') + mix(x) + '. Genau: ' + mix(x) + ' : ' + bShow + ' = ' + mix(M.fdiv(x, b)) + '.',
        verify: function () { var r = M.fdiv(x, b), c = r.n * x.d - x.n * r.d; return (ans === 0 && c > 0) || (ans === 1 && c < 0) || (ans === 2 && c === 0) ? true : 'Vergleich falsch ' + xs; } };
    },
    luecke: function () {
      var a, c; do { a = proper(8); c = proper(8); } while (M.feq(a, c));
      var r = M.fdiv(a, c);
      return { skill: 'Lücke: Divisor gesucht', level: 3, q: 'Welcher Bruch gehört in die Lücke? <span class="big-math">' + fr(a) + ' : □ = ' + mix(r) + '</span>', inputs: [{ kind: 'frac', answer: c, reduce: false, label: '□ =', placeholder: 'z. B. 2/3' }],
        hints: ['Denke an die Probe beim Teilen: Ergebnis mal □ ergibt wieder ' + fr(a) + '.', 'Also gilt □ = ' + fr(a) + ' : ' + mix(r) + '.', 'Rechne ' + fr(a) + ' · ' + frac(r.d, r.n) + ' und kürze.'],
        solution: '□ = ' + fr(a) + ' : ' + fh(r) + ' = ' + fr(a) + ' · ' + frac(r.d, r.n) + ' = ' + fr(c) + '. Probe: ' + solDiv(a, c) + '.',
        verify: function () { return M.feq(M.fdiv(a, c), r) ? true : 'Probe'; },
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, M.fmul(a, r))) return 'Du hast ' + fr(a) + ' mit dem Ergebnis multipliziert. Gesucht ist die Zahl, durch die geteilt wird: □ = ' + fr(a) + ' : ' + mix(r) + '.'; return null; } };
    },
    rest: function () {
      var g, p, q, k, T;
      do { q = M.pick([2, 3, 4, 5]); p = M.rnd(1, q - 1); g = M.rnd(1, 3); k = M.pick([4, 5, 6, 8, 10]); T = F(g * q + p, q); } while (M.gcd(p, q) !== 1 || (T.n * k) % T.d === 0);
      var glass = F(1, k), full = Math.floor(T.n * k / T.d), rest = M.red(F(T.n * k - full * T.d, T.d * k)), quot = M.fmul(T, F(k, 1));
      var share = M.red(F(T.n * k - full * T.d, T.d));
      return { skill: 'Division mit Rest deuten', level: 3, q: 'In einer Kanne sind ' + mix(T) + ' l Eistee. Du füllst Becher, in die genau ' + fr(glass) + ' l passen.<br>a) Wie viele Becher werden <b>ganz</b> voll?<br>b) Wie viel Liter bleiben in der Kanne übrig?',
        inputs: [{ kind: 'num', answer: full, label: 'a) volle Becher' }, { kind: 'frac', answer: rest, reduce: true, label: 'b) Rest (gekürzt)', unit: 'l', placeholder: 'z. B. 1/12' }],
        hints: ['Rechne ' + mix(T) + ' : ' + fr(glass) + ' = ' + fr(T) + ' · ' + k + '.', 'Du erhältst ' + fh(quot, true) + ' = ' + mix(quot) + '. Also werden ' + full + ' Becher voll. Ein Teil eines Bechers bleibt übrig.', 'Für den Rest rechnest du ' + mix(T) + ' − ' + full + ' · ' + fr(glass) + ' = ' + mix(T) + ' − ' + mix(F(full, k)) + '. Oder: ' + fh(share) + ' von einem Becher, also ' + fh(share) + ' · ' + fr(glass) + '.'],
        solution: fr(T) + ' : ' + fr(glass) + ' = ' + fr(T) + ' · ' + k + ' = ' + frac(T.n * k, T.d) + ' = ' + mix(quot) + '. Es werden <b>' + full + '</b> Becher voll. Rest: ' + fr(T) + ' − ' + frac(full, k) + ' = ' + frac(T.n * k, T.d * k) + ' − ' + frac(full * T.d, T.d * k) + ' = ' + frac(T.n * k - full * T.d, T.d * k) + (M.gcd(T.n * k - full * T.d, T.d * k) > 1 ? ' = ' + fh(rest) : '') + ' l. Das ist ' + fh(share) + ' von einem Becher.',
        verify: function () { var back = M.fadd(M.fmul(F(full, 1), glass), rest); return M.feq(back, T) && rest.n * glass.d < glass.n * rest.d ? true : 'Rest falsch'; } };
    }
  };

  var ex34 = F(3, 4), ex18 = F(1, 8);
  return {
    id: '002', title: 'Brüche dividieren', bereich: 'Zahlen und Operationen', minutes: '45 bis 60',
    vorkenntnisse: 'Brüche multiplizieren und kürzen',
    lead: 'Wie viele Achtel-Liter-Gläser kannst du mit einem Dreiviertelliter Saft füllen? Du lernst, durch Brüche zu teilen, und verstehst, warum der Kehrwert dabei hilft.',
    einstieg: { html: '<p>Für das Sportfest stehen noch <b>' + fr(ex34) + ' Liter</b> Apfelschorle bereit. Die Probierbecher fassen jeweils <b>' + fr(ex18) + ' Liter</b>.</p><p class="note">Wie viele Becher kannst du füllen? Und wie schreibt man diese Frage als Rechnung?</p><p>Die Frage „Wie oft passt ' + fr(ex18) + ' in ' + fr(ex34) + '?“ ist eine <b>Division</b>. In diesem Modul lernst du, wie man durch Brüche teilt. Am Ende kannst du die Frage nicht nur mit einem Bild, sondern auch mit einer kurzen Rechnung beantworten.</p>' },
    ziele: ['Ich kann einen Bruch durch eine natürliche Zahl teilen und das am Bild erklären.', 'Ich deute eine Division als „Wie oft passt … hinein?“.', 'Ich teile durch einen Bruch, indem ich mit dem Kehrwert multipliziere.', 'Ich dividiere auch gemischte Zahlen.', 'Ich erkenne typische Fehler und löse Sachaufgaben zum Teilen.'],
    fachwoerter: [['Kehrwert', 'Zähler und Nenner werden vertauscht. Der Kehrwert von ' + frac(3, 5) + ' ist ' + frac(5, 3) + '.'], ['Dividend und Divisor', 'Bei a : b ist a der Dividend (wird geteilt) und b der Divisor (teilt).'], ['Gemischte Zahl', 'Eine ganze Zahl und ein Bruch, zum Beispiel 2' + frac(1, 4) + ' = ' + frac(9, 4) + '.'], ['Probe', 'Ergebnis mal Divisor muss wieder den Dividenden ergeben.']],
    diagnose: [
      { q: 'Was ergibt ' + frac(2, 3) + ' · ' + frac(3, 5) + '?', options: [frac(2, 5), frac(5, 8), frac(9, 10), 'Weiß ich noch nicht'], answer: 0, why: 'Zähler mal Zähler, Nenner mal Nenner: ' + frac(6, 15) + ' = ' + frac(2, 5) + '.', review: 'Brüche multiplizieren (Modul 001)' },
      { q: 'Welcher unechte Bruch ist gleich 2' + frac(1, 3) + '?', options: [frac(7, 3), frac(5, 3), frac(6, 3), 'Weiß ich noch nicht'], answer: 0, why: '2 Ganze sind ' + frac(6, 3) + ', dazu ' + frac(1, 3) + ': zusammen ' + frac(7, 3) + '.', review: 'Gemischte Zahlen umwandeln (Klasse 6)' },
      { q: 'Wie viele Viertel ergeben zusammen 3 Ganze?', options: ['12', '7', '4', 'Weiß ich noch nicht'], answer: 0, why: 'Ein Ganzes hat 4 Viertel, also 3 · 4 = 12 Viertel.', review: 'Brüche als Anteile vom Ganzen' },
      { q: 'Welcher Bruch ist vollständig gekürzt gleich ' + frac(12, 18) + '?', options: [frac(2, 3), frac(4, 6), frac(3, 2), 'Weiß ich noch nicht'], answer: 0, why: 'Der größte gemeinsame Teiler von 12 und 18 ist 6: ' + frac(12, 18) + ' = ' + frac(2, 3) + '.', review: 'Brüche kürzen (Klasse 6)' }],
    erklaerung:
      '<h3>1. Einen Bruch durch eine natürliche Zahl teilen</h3><p>' + frac(3, 4) + ' einer Blechpizza sollen gerecht auf <b>2</b> Kinder verteilt werden. Teile jedes Viertel in 2 Hälften. Jedes Kind bekommt 3 Achtel.</p>' + shareSvg(F(3, 4), 2) +
      '<p class="big-math">' + frac(3, 4) + ' : 2 = ' + frac(3, 4) + ' · ' + frac(1, 2) + ' = <span class="frac"><span>3</span><span>4 · 2</span></span> = ' + frac(3, 8) + '</p><p>Durch 2 teilen ist dasselbe wie die Hälfte nehmen, also <b>mal ' + frac(1, 2) + '</b>. Der Nenner wird mit 2 multipliziert.</p>' +
      '<h3>2. „Wie oft passt … hinein?“</h3><p>Die Frage vom Anfang lautet: Wie oft passt ' + frac(1, 8) + ' in ' + frac(3, 4) + '? Im Streifen siehst du: <b>6-mal</b>.</p>' + strip(ex34, ex18, { aLabel: '3/4 Liter', bLabel: 'Becher zu 1/8 Liter' }) +
      '<p>Ein Ganzes enthält 8 Achtel. Also passt ' + frac(1, 8) + ' in ' + frac(3, 4) + ' genau ' + frac(3, 4) + ' · 8 = 6-mal. Teilen durch ' + frac(1, 8) + ' ist dasselbe wie <b>mal 8</b>.</p>' +
      '<div class="merk"><b>Merke:</b> Man dividiert durch einen Bruch, indem man mit seinem <b>Kehrwert</b> multipliziert. Nur der <b>zweite</b> Bruch wird umgedreht.<br><span class="big-math">' + frac(3, 4) + ' : ' + frac(2, 5) + ' = ' + frac(3, 4) + ' · ' + frac(5, 2) + ' = ' + frac(15, 8) + ' = ' + mix(F(15, 8)) + '</span></div>' +
      '<h3>3. Gemischte Zahlen</h3><p>Gemischte Zahlen wandelst du <b>zuerst</b> in unechte Brüche um: 2' + frac(1, 4) + ' : ' + frac(3, 8) + ' = ' + frac(9, 4) + ' · ' + frac(8, 3) + ' = <span class="frac"><span>9 · 8</span><span>4 · 3</span></span> = 6.</p>' +
      '<h3>4. Typische Fehler</h3><ul><li><b>Falscher Bruch umgedreht:</b> ' + frac(3, 4) + ' : ' + frac(2, 5) + ' ≠ ' + frac(4, 3) + ' · ' + frac(2, 5) + '. Nur der Divisor wird zum Kehrwert.</li><li><b>Kehrwert vergessen:</b> ' + frac(3, 4) + ' : ' + frac(2, 5) + ' ≠ ' + frac(3, 4) + ' · ' + frac(2, 5) + '.</li><li><b>Zähler durch Zähler, Nenner durch Nenner</b> geht nur, wenn die Divisionen aufgehen: ' + frac(8, 9) + ' : ' + frac(2, 3) + ' = <span class="frac"><span>8 : 2</span><span>9 : 3</span></span> = ' + frac(4, 3) + '. Bei ' + frac(3, 4) + ' : ' + frac(2, 5) + ' klappt das nicht. Der Kehrwert funktioniert immer.</li></ul>' +
      '<p class="note"><b>Kontrolle:</b> Teilst du durch eine Zahl <b>kleiner als 1</b>, wird das Ergebnis <b>größer</b>. Denn ein kleines Stück passt oft hinein.</p>',
    entdecken: {
      html: '<p>Wähle eine Menge und eine Stückgröße. Der Streifen zeigt, wie oft das Stück hineinpasst.</p><div class="ctl"><label>Menge <select id="e_a"></select></label><label>Stückgröße <select id="e_b"></select></label></div><div id="e_svg"></div><p class="big-math" id="e_txt"></p><p class="note" id="e_q">Beobachte: Wann ist das Ergebnis größer als die Menge? Wie hängt die Rechnung mit dem Kehrwert der Stückgröße zusammen?</p>',
      init: function (root, done) {
        var A = root.querySelector('#e_a'), B = root.querySelector('#e_b');
        ['1/2', '3/4', '1', '3/2', '2', '5/2'].forEach(function (o) { A.add(new Option(o.replace('3/2', '1 1/2').replace('5/2', '2 1/2'), o)); });
        ['1/2', '1/3', '1/4', '1/6', '1/8', '2/3', '3/4', '3/8'].forEach(function (o) { B.add(new Option(o, o)); });
        A.value = '3/4'; B.value = '1/8';
        var changes = 0;
        function parse(s) { var p = s.split('/').map(Number); return F(p[0], p[1] || 1); }
        function draw() {
          var a = parse(A.value), b = parse(B.value), r = M.fdiv(a, b);
          root.querySelector('#e_svg').innerHTML = strip(a, b);
          var whole = r.d === 1;
          root.querySelector('#e_txt').innerHTML = mix(a) + ' : ' + fr(b) + ' = ' + fr(a) + ' · ' + frac(b.d, b.n) + ' = ' + mix(r) + '<br><small>' + fr(b) + ' passt ' + (whole ? r.n + '-mal' : mix(r) + '-mal, also ' + Math.floor(r.n / r.d) + '-mal ganz und ein Stück davon') + ' hinein.</small>';
        }
        function ch() { draw(); changes++; if (changes >= 2) done('Gut beobachtet: Teilen durch einen Bruch heißt fragen, wie oft er hineinpasst. Das ist dasselbe wie mit dem Kehrwert malnehmen.'); }
        A.addEventListener('change', ch); B.addEventListener('change', ch); draw();
      }
    },
    beispiel: { title: 'Geschenkband zuschneiden', q: 'Ole hat 2' + frac(1, 4) + ' m Geschenkband. Für jedes Geschenk braucht er ' + frac(3, 8) + ' m. Für wie viele Geschenke reicht das Band?',
      steps: ['Ansatz: Wie oft passt ' + frac(3, 8) + ' m in 2' + frac(1, 4) + ' m? Also 2' + frac(1, 4) + ' : ' + frac(3, 8) + '.', 'Gemischte Zahl umwandeln: 2' + frac(1, 4) + ' = ' + frac(9, 4) + '.', 'Mit dem Kehrwert multiplizieren: ' + frac(9, 4) + ' · ' + frac(8, 3) + ' = <span class="frac"><span>9 · 8</span><span>4 · 3</span></span>.', 'Kürzen: 9 und 3 durch 3, 8 und 4 durch 4. Es bleibt <span class="frac"><span>3 · 2</span><span>1 · 1</span></span> = 6.', 'Antwort: Das Band reicht für 6 Geschenke. Probe: 6 · ' + frac(3, 8) + ' = ' + frac(18, 8) + ' = ' + mix(F(9, 4)) + ' m. Stimmt!'] },
    tasks: { gen: gen, plan: { G: ['regel:1', 'nat:1', 'passt:1', 'kehrwert:1'], S: ['nat:1', 'passt:2', 'kehrwert:2', 'gemischt:3', 'saft:2'], E: ['kehrwert:2', 'gemischt:3', 'saft:2', 'teilen:2', 'vergleich:2', 'luecke:3'] },
      extra: 'rest', test: ['nat:1', 'passt:2', 'kehrwert:2', 'gemischt:3', 'saft:2', 'luecke:3'] },
    lerncheck: ['Ich kann einen Bruch durch eine natürliche Zahl teilen.', 'Ich kann erklären, warum man mit dem Kehrwert multipliziert.', 'Ich dividiere Brüche und gemischte Zahlen sicher.', 'Ich löse Sachaufgaben der Art „Wie oft passt … hinein?“.']
  };
})();
