/* Modul 005 · Binomische Formeln */
var MODULE = (function () {
  var T = M.tpretty, poly = M.poly;
  function show(s) { return '<span class="big-math">' + s + '</span>'; }
  function q2(A, B, C, v) {
    v = v || 'x'; var parts = [];
    if (A) parts.push((A === 1 ? '' : A === -1 ? '-' : A) + v + '^2');
    if (B) parts.push((B === 1 ? '' : B === -1 ? '-' : B) + v);
    if (C) parts.push(String(C));
    return (parts.join('+') || '0').replace(/\+-/g, '-');
  }
  function q2p(A, B, C) { return T(poly([[A, 'x²'], [B, 'x'], [C, '']])); }
  function px(p) { return p === 1 ? 'x' : p + 'x'; }
  function br(p, a) { return '(' + px(p) + ' ' + (a < 0 ? '− ' + Math.abs(a) : '+ ' + a) + ')'; }
  function brs(p, a) { return '(' + p + '*x+(' + a + '))'; }
  function sqx(p) { return p === 1 ? 'x²' : '(' + p + 'x)² = ' + p * p + 'x²'; }
  function termIn(label) { return { kind: 'term', form: 'expanded', label: label || 'Term ohne Klammern', placeholder: 'z. B. x^2 + 6x + 9' }; }
  /* typische Fehler beim Quadrieren von (p x + a) */
  function sqMist(p, a) {
    var A = p * p, B = 2 * p * a, C = a * a;
    return function (v) {
      var s = v[0]; if (!M.termValid(s)) return null;
      if (M.termEq(s, q2(A, 0, C))) return '<b>Achtung, typischer Fehler:</b> ' + T(br(p, a)) + '² ist nicht ' + q2p(A, 0, C) + '. Es fehlt das gemischte Glied 2 · ' + px(p) + ' · ' + (a < 0 ? '(' + T(String(a)) + ')' : a) + ' = ' + T(poly([[B, 'x']])) + '. Denk an die vier Teilflächen im Quadrat.';
      if (M.termEq(s, q2(A, 0, -C)) && a < 0) return 'Das ist die dritte binomische Formel. Hier wird aber (' + px(p) + ' − ' + (-a) + ') mit sich selbst multipliziert: zweite binomische Formel.';
      if (M.termEq(s, q2(A, B / 2, C))) return 'Das gemischte Glied kommt <b>zweimal</b> vor: 2 · ' + px(p) + ' · ' + Math.abs(a) + '.';
      if (M.termEq(s, q2(A, B, -C))) return 'Die Zahl am Ende ist ein Quadrat: ' + (a < 0 ? '(' + T(String(a)) + ')' : a) + '² = ' + C + '. Ein Quadrat ist nie negativ.';
      if (M.termEq(s, q2(A, -B, C))) return 'Prüfe das Vorzeichen des mittleren Glieds: Bei ' + (a < 0 ? '(a − b)² steht −2ab.' : '(a + b)² steht +2ab.');
      if (p !== 1 && M.termEq(s, q2(p, B, C))) return 'Auch die Zahl vor dem x wird quadriert: (' + p + 'x)² = ' + p * p + 'x².';
      return null;
    };
  }
  /* Quadrat (a+b)² mit vier Teilflächen */
  function square(a, b, opts) {
    opts = opts || {};
    var S = 220, u = S / (a + b), x0 = 40, y0 = 30, A = a * u, B = b * u, cols = ['#cfc2ee', '#f6d9a8', '#f6d9a8', '#efeafb'];
    var R = [[x0, y0, A, A, opts.la || 'a²'], [x0 + A, y0, B, A, opts.lab || 'a·b'], [x0, y0 + A, A, B, opts.lab || 'a·b'], [x0 + A, y0 + A, B, B, opts.lb || 'b²']];
    var s = '<svg class="viz" viewBox="0 0 300 270" role="img" aria-label="Quadrat mit vier Teilflächen" style="max-width:340px">';
    R.forEach(function (r, i) {
      var miss = opts.err && (i === 1 || i === 2);
      s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="' + (miss ? '#fff' : cols[i]) + '" stroke="' + (miss ? '#b91c1c' : '#3d2a73') + '" stroke-width="2"' + (miss ? ' stroke-dasharray="6 4"' : '') + '/>';
      var txt = miss ? 'fehlt!' : r[4];
      if (r[2] >= 30 && r[3] >= 20) s += '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 + 5) + '" font-size="' + (r[2] >= 50 ? 14 : 11) + '" font-weight="700" text-anchor="middle" fill="' + (miss ? '#b91c1c' : '#1c1830') + '">' + txt + '</text>';
    });
    s += '<text x="' + (x0 + A / 2) + '" y="22" font-size="14" font-weight="700" text-anchor="middle" fill="#3d2a73">' + (opts.ta || 'a') + '</text><text x="' + (x0 + A + B / 2) + '" y="22" font-size="14" font-weight="700" text-anchor="middle" fill="#b45309">' + (opts.tb || 'b') + '</text>';
    s += '<text x="' + (x0 - 6) + '" y="' + (y0 + A / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#3d2a73">' + (opts.ta || 'a') + '</text><text x="' + (x0 - 6) + '" y="' + (y0 + A + B / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#b45309">' + (opts.tb || 'b') + '</text>';
    if (opts.note) s += '<text x="296" y="266" font-size="10" text-anchor="end" fill="#5a5670">' + opts.note + '</text>';
    return s + '</svg>';
  }

  var gen = {
    erkennen: function () {
      var a = M.rnd(2, 9), minus = Math.random() < 0.4, s = minus ? -1 : 1;
      var right = q2p(1, 2 * a * s, a * a), cand = [q2p(1, 0, a * a), q2p(1, a * s, a * a), q2p(1, 0, -a * a), q2p(1, -2 * a * s, a * a), q2p(1, 2 * a * s, 2 * a)];
      var seen = {}; seen[right] = 1; var wrong = cand.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; }).slice(0, 3);
      var opts = M.shuffle([right].concat(wrong));
      return { skill: 'Binomische Formel erkennen', level: 1, q: 'Welcher Term ist gleichwertig zu ' + show(T(br(1, a * s)) + '²') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(right) }],
        hints: [(minus ? 'Zweite' : 'Erste') + ' binomische Formel: ' + (minus ? '(a − b)² = a² − 2ab + b²' : '(a + b)² = a² + 2ab + b²') + '.', 'Hier ist a = x und b = ' + a + '. Das gemischte Glied ist 2 · x · ' + a + ' = ' + 2 * a + 'x.', 'Kontrolle mit x = 1: ' + T('(1 ' + (minus ? '− ' : '+ ') + a + ')²') + ' = ' + (1 + s * a) * (1 + s * a) + '.'],
        solution: T(br(1, a * s)) + '² = x² ' + (minus ? '−' : '+') + ' 2 · x · ' + a + ' + ' + a + '² = ' + right + '.',
        verify: function () { return M.termEq(brs(1, a * s) + '^2', q2(1, 2 * a * s, a * a)) ? true : 'falsch'; } };
    },
    fehler: function () {
      var a = M.rnd(2, 9), x = M.rnd(1, 5), name = M.pick(['Tom', 'Lena', 'Emre', 'Mia']);
      return { skill: 'Typischen Fehler (a + b)² prüfen', level: 1, q: name + ' behauptet: <span class="big-math">(x + ' + a + ')² = x² + ' + a * a + '</span><br>Prüfe das mit der Zahl x = ' + x + '.<br>a) Berechne (' + x + ' + ' + a + ')².<br>b) Berechne ' + x + '² + ' + a * a + '.',
        inputs: [{ kind: 'num', answer: (x + a) * (x + a), label: 'a) (' + x + ' + ' + a + ')² =' }, { kind: 'num', answer: x * x + a * a, label: 'b) ' + x + '² + ' + a * a + ' =' }],
        hints: ['Rechne bei a) zuerst die Klammer aus: ' + x + ' + ' + a + ' = ' + (x + a) + '. Quadriere dann.', 'Bei b): ' + x + '² = ' + x * x + '. Addiere ' + a * a + '.', 'Vergleiche beide Ergebnisse. Der Unterschied ist genau 2 · ' + x + ' · ' + a + ' = ' + 2 * x * a + '.'],
        solution: 'a) ' + (x + a) + '² = ' + (x + a) * (x + a) + '. b) ' + x * x + ' + ' + a * a + ' = ' + (x * x + a * a) + '. Die Ergebnisse sind verschieden, also hat ' + name + ' nicht recht. Richtig ist (x + ' + a + ')² = x² + ' + 2 * a + 'x + ' + a * a + '. Es fehlt das gemischte Glied: 2 · ' + x + ' · ' + a + ' = ' + 2 * x * a + '.',
        verify: function () { return (x + a) * (x + a) - (x * x + a * a) === 2 * x * a ? true : 'Differenz'; },
        mistakes: function (v) { var p = M.parseNum(v[0]); if (p !== null && p === x * x + a * a) return 'Bei a) musst du zuerst die Klammer ausrechnen und dann quadrieren: ' + (x + a) + '².'; return null; } };
    },
    erste: function (lvl) {
      var a = M.rnd(1, lvl >= 2 ? 12 : 9);
      var inp = termIn(); inp.answer = q2(1, 2 * a, a * a);
      return { src: brs(1, a) + '^2', skill: '1. binomische Formel', level: lvl, q: 'Multipliziere mit der 1. binomischen Formel aus. ' + show(T(br(1, a)) + '²'), inputs: [inp],
        hints: ['(a + b)² = a² + 2ab + b². Hier ist a = x und b = ' + a + '.', 'a² = x², 2ab = 2 · x · ' + a + ' = ' + 2 * a + 'x, b² = ' + a + '² = ' + a * a + '.', 'Setze zusammen: x² + ' + 2 * a + 'x + ' + a * a + '.'],
        solution: T(br(1, a)) + '² = x² + 2 · x · ' + a + ' + ' + a + '² = <b>' + q2p(1, 2 * a, a * a) + '</b>', mistakes: sqMist(1, a) };
    },
    zweite: function (lvl) {
      var a = M.rnd(1, lvl >= 2 ? 12 : 9);
      var inp = termIn(); inp.answer = q2(1, -2 * a, a * a);
      return { src: brs(1, -a) + '^2', skill: '2. binomische Formel', level: lvl, q: 'Multipliziere mit der 2. binomischen Formel aus. ' + show(T(br(1, -a)) + '²'), inputs: [inp],
        hints: ['(a − b)² = a² − 2ab + b². Hier ist a = x und b = ' + a + '.', 'a² = x², 2ab = 2 · x · ' + a + ' = ' + 2 * a + 'x, b² = ' + a * a + '.', 'Nur das mittlere Glied bekommt ein Minus. Das Quadrat ' + a + '² = ' + a * a + ' ist positiv.'],
        solution: T(br(1, -a)) + '² = x² − 2 · x · ' + a + ' + ' + a + '² = <b>' + q2p(1, -2 * a, a * a) + '</b>', mistakes: sqMist(1, -a) };
    },
    dritte: function (lvl) {
      var p = lvl >= 3 ? M.rnd(1, 4) : 1, a = M.rnd(1, lvl >= 2 ? 12 : 9), first = Math.random() < 0.5;
      var inp = termIn(); inp.answer = q2(p * p, 0, -a * a);
      var shown = first ? T(br(p, a) + br(p, -a)) : T(br(p, -a) + br(p, a));
      return { src: brs(p, a) + '*' + brs(p, -a), skill: '3. binomische Formel', level: lvl, q: 'Multipliziere mit der 3. binomischen Formel aus. ' + show(shown), inputs: [inp],
        hints: ['(a + b)(a − b) = a² − b². Hier ist a = ' + px(p) + ' und b = ' + a + '.', 'a² = ' + sqx(p) + ' und b² = ' + a * a + '.', 'Die gemischten Glieder heben sich weg: +' + p * a + 'x − ' + p * a + 'x = 0. Es bleibt ' + q2p(p * p, 0, -a * a) + '.'],
        solution: shown + ' = ' + T(poly([[p * p, 'x²'], [-p * a, 'x'], [p * a, 'x'], [-a * a, '']])) + ' = <b>' + q2p(p * p, 0, -a * a) + '</b>',
        mistakes: function (v) { if (!M.termValid(v[0])) return null; if (M.termEq(v[0], q2(p * p, 0, a * a))) return 'Das Vorzeichen stimmt nicht: (a + b)(a − b) = a² <b>−</b> b².'; if (M.termEq(v[0], q2(p * p, 2 * p * a, -a * a)) || M.termEq(v[0], q2(p * p, -2 * p * a, -a * a))) return 'Bei der 3. binomischen Formel heben sich die gemischten Glieder auf. Es gibt kein x-Glied.'; if (p > 1 && M.termEq(v[0], q2(p, 0, -a * a))) return 'Auch die Zahl vor dem x wird quadriert: (' + p + 'x)² = ' + p * p + 'x².'; return null; } };
    },
    koeff: function (lvl) {
      var p, a; do { p = M.rnd(2, lvl >= 3 ? 6 : 4); a = M.nz(-7, 7); } while (M.gcd(p, a) !== 1);
      var inp = termIn(); inp.answer = q2(p * p, 2 * p * a, a * a);
      var nr = a > 0 ? 1 : 2;
      return { src: brs(p, a) + '^2', skill: 'Binomische Formel mit Koeffizient', level: lvl, q: 'Multipliziere aus. ' + show(T(br(p, a)) + '²'), inputs: [inp],
        hints: ['Das ist die ' + nr + '. binomische Formel mit a = ' + p + 'x und b = ' + Math.abs(a) + '.', 'a² = (' + p + 'x)² = ' + p * p + 'x². Auch die ' + p + ' wird quadriert.', '2ab = 2 · ' + p + 'x · ' + Math.abs(a) + ' = ' + 2 * p * Math.abs(a) + 'x und b² = ' + a * a + '.'],
        solution: T(br(p, a)) + '² = (' + p + 'x)² ' + (a > 0 ? '+' : '−') + ' 2 · ' + p + 'x · ' + Math.abs(a) + ' + ' + Math.abs(a) + '² = <b>' + q2p(p * p, 2 * p * a, a * a) + '</b>', mistakes: sqMist(p, a) };
    },
    faktor: function (lvl) {
      var p, a, kind = M.pick(['1', '2', '3']);
      do { p = lvl >= 3 ? M.rnd(1, 4) : 1; a = M.rnd(1, 10); } while (M.gcd(p, a) !== 1);
      var A = p * p, B = kind === '1' ? 2 * p * a : kind === '2' ? -2 * p * a : 0, C = kind === '3' ? -a * a : a * a;
      var ans = kind === '1' ? '(' + p + 'x+' + a + ')^2' : kind === '2' ? '(' + p + 'x-' + a + ')^2' : '(' + p + 'x+' + a + ')*(' + p + 'x-' + a + ')';
      ans = ans.replace(/\(1x/g, '(x');
      var prettyAns = kind === '1' ? T(br(p, a)) + '²' : kind === '2' ? T(br(p, -a)) + '²' : T(br(p, a) + br(p, -a));
      return { src: q2(A, B, C), skill: 'Faktorisieren mit binomischen Formeln', level: lvl, q: 'Schreibe als Produkt. Nutze eine binomische Formel. ' + show(q2p(A, B, C)),
        inputs: [{ kind: 'term', form: 'factored', label: 'Produkt', placeholder: kind === '3' ? 'z. B. (x + 4)(x − 4)' : 'z. B. (x + 4)^2', answer: ans }],
        hints: [kind === '3' ? 'Es gibt kein x-Glied und ein Minus zwischen zwei Quadraten. Das passt zur 3. Formel: a² − b² = (a + b)(a − b).' : 'Drei Glieder, außen zwei Quadrate: Das passt zur ' + kind + '. Formel: ' + (kind === '1' ? 'a² + 2ab + b² = (a + b)²' : 'a² − 2ab + b² = (a − b)²') + '.', 'Suche a und b: ' + (p === 1 ? 'x² ist das Quadrat von x, also a = x' : A + 'x² = (' + px(p) + ')², also a = ' + px(p)) + '. ' + a * a + ' = ' + a + '², also b = ' + a + '.', kind === '3' ? 'Schreibe (' + px(p) + ' + ' + a + ')(' + px(p) + ' − ' + a + ').' : 'Kontrolle des mittleren Glieds: 2 · ' + px(p) + ' · ' + a + ' = ' + 2 * p * a + 'x. Passt.'],
        solution: q2p(A, B, C) + ' = <b>' + prettyAns + '</b>. Kontrolle durch Ausmultiplizieren ergibt wieder den Ausgangsterm.',
        mistakes: function (v) { if (!M.termValid(v[0])) return null; if (kind !== '3' && M.termEq(v[0], (kind === '1' ? '(' + p + 'x-' + a + ')^2' : '(' + p + 'x+' + a + ')^2'))) return 'Fast. Schau auf das Vorzeichen des mittleren Glieds: ' + (kind === '1' ? 'Plus, also (a + b)².' : 'Minus, also (a − b)².'); return null; } };
    },
    kopf: function (lvl) {
      var kind = M.pick(['plus', 'minus', 'dritte']), base = M.pick([20, 30, 40, 50, 60, 70, 80, 90]), d = M.rnd(1, lvl >= 3 ? 3 : 2), n1, n2, res, q, sol, hint;
      if (kind === 'plus') { n1 = base + d; res = n1 * n1; q = n1 + '²'; hint = n1 + '² = (' + base + ' + ' + d + ')²'; sol = '(' + base + ' + ' + d + ')² = ' + base + '² + 2 · ' + base + ' · ' + d + ' + ' + d + '² = ' + M.fmtNum(base * base) + ' + ' + 2 * base * d + ' + ' + d * d + ' = ' + M.fmtNum(res); }
      else if (kind === 'minus') { n1 = base - d; res = n1 * n1; q = n1 + '²'; hint = n1 + '² = (' + base + ' − ' + d + ')²'; sol = '(' + base + ' − ' + d + ')² = ' + base + '² − 2 · ' + base + ' · ' + d + ' + ' + d + '² = ' + M.fmtNum(base * base) + ' − ' + 2 * base * d + ' + ' + d * d + ' = ' + M.fmtNum(res); }
      else { n1 = base - d; n2 = base + d; res = n1 * n2; q = n1 + ' · ' + n2; hint = n1 + ' · ' + n2 + ' = (' + base + ' − ' + d + ')(' + base + ' + ' + d + ')'; sol = '(' + base + ' − ' + d + ')(' + base + ' + ' + d + ') = ' + base + '² − ' + d + '² = ' + M.fmtNum(base * base) + ' − ' + d * d + ' = ' + M.fmtNum(res); }
      return { skill: 'Kopfrechnen mit binomischen Formeln', level: lvl, q: 'Rechne geschickt im Kopf mit einer binomischen Formel. <span class="big-math">' + q + '</span>', inputs: [{ kind: 'num', answer: res, label: q + ' =' }],
        hints: ['Zerlege in eine glatte Zehnerzahl und eine kleine Zahl: ' + hint + '.', kind === 'dritte' ? 'Das ist die 3. Formel: (a − b)(a + b) = a² − b².' : 'Nutze die ' + (kind === 'plus' ? '1.' : '2.') + ' Formel: ' + (kind === 'plus' ? '(a + b)² = a² + 2ab + b².' : '(a − b)² = a² − 2ab + b².'), 'Rechne: ' + base + '² = ' + M.fmtNum(base * base) + (kind === 'dritte' ? ' und ' + d + '² = ' + d * d + '.' : ', 2 · ' + base + ' · ' + d + ' = ' + 2 * base * d + ' und ' + d + '² = ' + d * d + '.')],
        solution: sol + '.',
        verify: function () { return res === (kind === 'dritte' ? (base - d) * (base + d) : n1 * n1) ? true : 'Kopfrechnung'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && kind === 'plus' && x === base * base + d * d) return 'Typischer Fehler: Das gemischte Glied 2 · ' + base + ' · ' + d + ' = ' + 2 * base * d + ' fehlt.'; if (x !== null && kind === 'minus' && (x === base * base - d * d || x === base * base + d * d)) return 'Das gemischte Glied fehlt: Ziehe 2 · ' + base + ' · ' + d + ' = ' + 2 * base * d + ' ab und addiere ' + d * d + '.'; return null; } };
    },
    luecke: function (lvl) {
      var p = M.rnd(2, 6), a = M.rnd(1, 9);
      return { skill: 'Lücken in binomischen Formeln', level: 3, q: 'Ergänze die Lücken so, dass die Gleichung stimmt. ' + show('(□ + ' + a + ')² = ' + p * p + 'x² + △x + ' + a * a),
        inputs: [{ kind: 'term', answer: p + 'x', label: '□ =', placeholder: 'z. B. 3x' }, { kind: 'num', answer: 2 * p * a, label: '△ =' }],
        hints: ['□ zum Quadrat muss ' + p * p + 'x² ergeben.', '□ = ' + p + 'x, denn (' + p + 'x)² = ' + p * p + 'x².', '△x ist das gemischte Glied: 2 · ' + p + 'x · ' + a + '.'],
        solution: '□ = ' + p + 'x und △ = 2 · ' + p + ' · ' + a + ' = ' + 2 * p * a + '. Also (' + p + 'x + ' + a + ')² = ' + q2p(p * p, 2 * p * a, a * a) + '.',
        verify: function () { return M.termEq('(' + p + 'x+' + a + ')^2', q2(p * p, 2 * p * a, a * a)) ? true : 'falsch'; },
        mistakes: function (v) { var x = M.parseNum(v[1]); if (x !== null && x === p * a) return 'Das gemischte Glied ist <b>2</b> · a · b. Du hast die 2 vergessen.'; if (M.termValid(v[0]) && M.termEq(v[0], p * p + 'x')) return '□ wird quadriert. Gesucht ist also die Zahl, deren Quadrat ' + p * p + ' ist.'; return null; } };
    },
    vereinf: function () {
      var a, b, kind = M.pick(['qq', 'q3']), B, C, src, shown, first, second;
      do {
        a = M.rnd(1, 8); b = M.rnd(1, 8);
        if (kind === 'qq') { B = 2 * a + 2 * b; C = a * a - b * b; src = '(x+' + a + ')^2-(x-' + b + ')^2'; shown = '(x + ' + a + ')² − (x − ' + b + ')²'; first = q2p(1, 2 * a, a * a); second = q2p(1, -2 * b, b * b); }
        else { B = 2 * a; C = a * a + b * b; src = '(x+' + a + ')^2-(x+' + b + ')*(x-' + b + ')'; shown = '(x + ' + a + ')² − (x + ' + b + ')(x − ' + b + ')'; first = q2p(1, 2 * a, a * a); second = q2p(1, 0, -b * b); }
      } while (B === 0);
      var inp = { kind: 'term', form: 'simplified', maxTerms: 2, label: 'Vereinfachter Term', placeholder: 'z. B. 10x + 16', answer: q2(0, B, C) };
      return { src: src, skill: 'Terme mit binomischen Formeln vereinfachen', level: 3, q: 'Vereinfache so weit wie möglich. ' + show(shown), inputs: [inp],
        hints: ['Wende auf jeden Teil eine binomische Formel an.', 'Erster Teil: ' + first + '. Zweiter Teil: ' + second + '.', 'Setze den zweiten Teil in Klammern, weil davor ein Minus steht: (' + first + ') − (' + second + '). Alle Vorzeichen im zweiten Teil drehen sich um.'],
        solution: shown + ' = ' + first + ' − (' + second + ') = <b>' + q2p(0, B, C) + '</b>',
        mistakes: function (v) { if (!M.termValid(v[0])) return null; if (kind === 'qq' && M.termEq(v[0], q2(0, 2 * a - 2 * b, a * a + b * b))) return 'Achte auf das Minus vor der zweiten Klammer. Es dreht <b>alle</b> Vorzeichen um, auch beim mittleren Glied.'; if (M.termEq(v[0], q2(0, B, a * a - (kind === 'qq' ? -b * b : b * b)))) return 'Prüfe das Vorzeichen der Zahl am Ende. Das Minus vor der Klammer dreht sie um.'; return null; } };
    },
    wachstum: function () {
      var a = M.rnd(1, 5), x = M.rnd(4, 15), N = 2 * a * x + a * a;
      var inp = { kind: 'term', form: 'simplified', maxTerms: 2, label: 'a) Zuwachs als Term', placeholder: 'z. B. 6x + 9', answer: q2(0, 2 * a, a * a) };
      return { src: '(x+' + a + ')^2-x^2', skill: 'Flächenzuwachs beim Quadrat', level: 3,
        q: 'Ein Quadrat hat die Seitenlänge x cm. Jede Seite wird um ' + a + ' cm verlängert. Es entsteht ein größeres Quadrat.' + square(3, 1.2, { ta: 'x', tb: String(a), la: 'x²', lab: a + 'x', lb: a + '²', note: 'Skizze nicht maßstabsgetreu' }) + 'a) Um wie viel cm² wächst der Flächeninhalt? Gib einen Term an.<br>b) Der Flächeninhalt wächst um genau ' + N + ' cm². Wie lang war die Seite des alten Quadrats?',
        inputs: [inp, { kind: 'num', answer: x, label: 'b) x =', unit: 'cm' }],
        hints: ['Neuer Flächeninhalt: (x + ' + a + ')². Alter Flächeninhalt: x². Zuwachs: (x + ' + a + ')² − x².', '(x + ' + a + ')² − x² = x² + ' + 2 * a + 'x + ' + a * a + ' − x² = ' + q2p(0, 2 * a, a * a) + '. Im Bild sind das die beiden Streifen und das kleine Quadrat.', 'Löse ' + q2p(0, 2 * a, a * a) + ' = ' + N + ': Ziehe ' + a * a + ' ab und teile durch ' + 2 * a + '.'],
        solution: 'a) (x + ' + a + ')² − x² = <b>' + q2p(0, 2 * a, a * a) + '</b>. b) ' + q2p(0, 2 * a, a * a) + ' = ' + N + ' ⇒ ' + (2 * a === 1 ? 'x' : 2 * a + 'x') + ' = ' + (N - a * a) + ' ⇒ x = ' + x + ' cm. Probe: ' + (x + a) + '² − ' + x + '² = ' + (x + a) * (x + a) + ' − ' + x * x + ' = ' + N + '.',
        verify: function () { return (x + a) * (x + a) - x * x === N ? true : 'Probe'; } };
    }
  };

  return {
    id: '005', title: 'Binomische Formeln', bereich: 'Terme und Gleichungen', minutes: '45 bis 60',
    vorkenntnisse: 'Summen multiplizieren (Modul 004), Quadratzahlen',
    lead: 'Ist (a + b)² dasselbe wie a² + b²? Du lernst drei Formeln, mit denen du schneller rechnest, und einen typischen Fehler, den du nie mehr machst.',
    einstieg: { html: '<p>Jonas soll im Kopf <b>31²</b> ausrechnen. Er denkt: „31 = 30 + 1. Also ist 31² = 30² + 1² = 900 + 1 = 901.“</p><p class="note">Stimmt das? Rechne 31 · 31 schriftlich nach. Was hat Jonas vergessen?</p><p>Das Quadrat einer Summe kommt in der Mathematik sehr oft vor. In diesem Modul lernst du die drei <b>binomischen Formeln</b>. Mit ihnen multiplizierst du schnell aus, rechnest geschickt im Kopf und schreibst Summen wieder als Produkt.</p>' },
    ziele: ['Ich kenne die drei binomischen Formeln und kann die erste am Quadrat erklären.', 'Ich multipliziere Terme mit den binomischen Formeln aus.', 'Ich vermeide den Fehler (a + b)² = a² + b².', 'Ich erkenne binomische Formeln rückwärts und schreibe Summen als Produkt.', 'Ich nutze die Formeln zum Kopfrechnen.'],
    fachwoerter: [['Binom', 'Eine Summe oder Differenz aus zwei Gliedern, zum Beispiel x + 3 oder 2x − 5.'], ['Gemischtes Glied', 'Das Glied 2ab in a² + 2ab + b². Es entsteht aus den beiden Rechtecken a · b.'], ['Faktorisieren', 'Eine Summe als Produkt schreiben, zum Beispiel x² − 9 = (x + 3)(x − 3).'], ['Quadrat eines Terms', 'Der Term mal sich selbst: (2x)² = 2x · 2x = 4x².']],
    diagnose: [
      { q: 'Was ergibt (−4)²?', options: ['16', '−16', '−8', 'Weiß ich noch nicht'], answer: 0, why: '(−4) · (−4) = 16. Minus mal Minus ergibt Plus.', review: 'Quadrieren negativer Zahlen' },
      { q: 'Was ergibt (3x)²?', options: ['9x²', '3x²', '6x', 'Weiß ich noch nicht'], answer: 0, why: '(3x)² = 3x · 3x = 9x².', review: 'Produkte mit Variablen' },
      { q: 'Was ergibt (x + 2)(x + 3)?', options: ['x² + 5x + 6', 'x² + 6', 'x² + 6x + 5', 'Weiß ich noch nicht'], answer: 0, why: 'Jedes Glied mit jedem: x² + 3x + 2x + 6 = x² + 5x + 6.', review: 'Summen multiplizieren (Modul 004)' },
      { q: 'Welche Zahl ist eine Quadratzahl?', options: ['49', '27', '50', 'Weiß ich noch nicht'], answer: 0, why: '49 = 7 · 7.', review: 'Quadratzahlen bis 400' }],
    erklaerung:
      '<h3>1. Das Quadrat einer Summe</h3><p>Ein Quadrat hat die Seitenlänge a + b. Es besteht aus <b>vier</b> Teilflächen: einem Quadrat a², einem Quadrat b² und <b>zwei</b> Rechtecken a · b.</p>' + square(3, 2) +
      '<p class="big-math">(a + b)² = a² + ab + ab + b² = a² + 2ab + b²</p>' +
      '<div class="merk"><b>Merke: Die drei binomischen Formeln</b><br><span class="big-math">1. (a + b)² = a² + 2ab + b²</span><br><span class="big-math">2. (a − b)² = a² − 2ab + b²</span><br><span class="big-math">3. (a + b)(a − b) = a² − b²</span></div>' +
      '<h3>2. Der häufigste Fehler</h3><p>(a + b)² ist <b>nicht</b> a² + b². Prüfe mit Zahlen: (3 + 4)² = 7² = 49, aber 3² + 4² = 9 + 16 = 25. Es fehlt das gemischte Glied 2 · 3 · 4 = 24. Genau das ist Jonas im Einstieg passiert: 31² = (30 + 1)² = 900 + 60 + 1 = 961.</p>' +
      '<h3>3. Beispiele</h3><ul><li>(x + 5)² = x² + 2 · x · 5 + 5² = x² + 10x + 25</li><li>(2x − 3)² = (2x)² − 2 · 2x · 3 + 3² = 4x² − 12x + 9</li><li>(x + 7)(x − 7) = x² − 49. Die gemischten Glieder +7x und −7x heben sich auf.</li></ul>' +
      '<h3>4. Rückwärts: Faktorisieren</h3><p>Siehst du zwei Quadrate und ein passendes gemischtes Glied, kannst du die Summe als Produkt schreiben:</p><p class="big-math">x² + 8x + 16 = (x + 4)²</p><p class="big-math">x² − 25 = (x + 5)(x − 5)</p><p>Prüfe immer das gemischte Glied: 2 · x · 4 = 8x. Passt.</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Für x² schreibst du x^2, für (x + 4)² schreibst du (x + 4)^2.</p>',
    entdecken: {
      html: '<p>Verändere a und b. Das Quadrat mit der Seite a + b ist maßstabsgetreu gezeichnet. Mit dem Knopf siehst du, was beim typischen Fehler fehlt.</p><div class="ctl"><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="1" max="7" step="1" value="3"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="6" step="1" value="2"></label><button type="button" class="btn ghost" id="e_err">Fehler zeigen: nur a² + b²</button></div><div id="e_g"></div><div id="e_txt"></div>',
      init: function (root, done) {
        var n = 0, err = false, btn = root.querySelector('#e_err');
        function draw() {
          var a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value;
          root.querySelector('#v_a').textContent = a; root.querySelector('#v_b').textContent = b;
          root.querySelector('#e_g').innerHTML = square(a, b, { err: err, la: 'a² = ' + a * a, lab: 'a·b = ' + a * b, lb: 'b² = ' + b * b, ta: 'a = ' + a, tb: 'b = ' + b });
          btn.textContent = err ? 'Ganzes Quadrat zeigen' : 'Fehler zeigen: nur a² + b²';
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">(' + a + ' + ' + b + ')² = ' + (a + b) + '² = ' + (a + b) * (a + b) + '</p><p class="big-math">' + a * a + ' + 2 · ' + a * b + ' + ' + b * b + ' = ' + (a * a + 2 * a * b + b * b) + '</p>' +
            (err ? '<p class="fb bad">Nur a² + b² = ' + a * a + ' + ' + b * b + ' = ' + (a * a + b * b) + '. Es fehlen die beiden Rechtecke: 2ab = ' + 2 * a * b + '.</p>' : '<p class="note">Die zwei gleichen Rechtecke a · b ergeben das gemischte Glied 2ab.</p>');
        }
        function step() { n++; if (n >= 3) done('Richtig erkannt: Das Quadrat (a + b)² besteht aus a², b² und zwei Rechtecken a · b. Ohne das gemischte Glied 2ab ist die Rechnung falsch.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); step(); }); });
        btn.addEventListener('click', function () { err = !err; draw(); step(); });
        draw();
      }
    },
    beispiel: { title: 'Faktorisieren', q: 'Schreibe ' + show('9x² − 30x + 25') + ' als Produkt.',
      steps: ['Drei Glieder, außen zwei Quadrate, in der Mitte ein Minus: Das könnte die 2. binomische Formel a² − 2ab + b² sein.', 'Quadrate finden: 9x² = (3x)², also a = 3x. 25 = 5², also b = 5.', 'Gemischtes Glied prüfen: 2 · a · b = 2 · 3x · 5 = 30x. Passt genau.', 'Ergebnis: 9x² − 30x + 25 = <b>(3x − 5)²</b>.', 'Kontrolle mit x = 1: 9 − 30 + 25 = 4 und (3 − 5)² = (−2)² = 4. Passt!'] },
    tasks: { gen: gen, plan: { G: ['erkennen:1', 'fehler:1', 'erste:1', 'zweite:1'], S: ['fehler:1', 'erste:2', 'zweite:2', 'dritte:2', 'faktor:2'], E: ['koeff:2', 'dritte:3', 'faktor:3', 'kopf:2', 'luecke:3', 'vereinf:3'] },
      extra: 'wachstum', test: ['erste:2', 'zweite:2', 'dritte:2', 'koeff:2', 'faktor:2', 'kopf:2'] },
    lerncheck: ['Ich kann die drei binomischen Formeln aufschreiben.', 'Ich kann am Quadrat erklären, woher 2ab kommt.', 'Ich multipliziere mit den Formeln aus und faktorisiere rückwärts.', 'Ich rechne Aufgaben wie 49 · 51 geschickt im Kopf.']
  };
})();
