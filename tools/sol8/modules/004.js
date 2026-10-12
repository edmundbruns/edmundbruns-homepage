/* Modul 004 · Summen multiplizieren */
var MODULE = (function () {
  var T = M.tpretty, poly = M.poly;
  function show(s) { return '<span class="big-math">' + s + '</span>'; }
  /* parsebarer Term A x^2 + B x + C */
  function q2(A, B, C, v) {
    v = v || 'x'; var parts = [];
    if (A) parts.push((A === 1 ? '' : A === -1 ? '-' : A) + v + '^2');
    if (B) parts.push((B === 1 ? '' : B === -1 ? '-' : B) + v);
    if (C) parts.push(String(C));
    return (parts.join('+') || '0').replace(/\+-/g, '-');
  }
  function q2p(A, B, C) { return T(poly([[A, 'x²'], [B, 'x'], [C, '']])); }
  /* Klammer (p x + a) schön und parsebar */
  function br(p, a, v) { v = v || 'x'; return '(' + (p === 1 ? '' : p === -1 ? '−' : p) + v + ' ' + (a < 0 ? '− ' + Math.abs(a) : '+ ' + a) + ')'; }
  function brs(p, a, v) { v = v || 'x'; return '(' + p + '*' + v + '+(' + a + '))'; }
  function sg(c) { return c < 0 ? '(' + T(String(c)) + ')' : String(c); }
  function cx(c, v) { v = v || 'x'; return c === 1 ? v : c === -1 ? '−' + v : T(String(c)) + v; }
  function termIn(label) { return { kind: 'term', form: 'expanded', label: label || 'Term ohne Klammern', placeholder: 'z. B. x^2 + 5x + 6' }; }
  /* vier Produkte als Text */
  function four(p, a, q, b) {
    return [T(String(p)) === '1' ? 'x · x' : cx(p) + ' · ' + cx(q), cx(p) + ' · ' + sg(b), sg(a) + ' · ' + cx(q), sg(a) + ' · ' + sg(b)];
  }
  function stepsHtml(p, a, q, b) {
    var A = p * q, B1 = p * b, B2 = a * q, C = a * b;
    var raw = T(poly([[A, 'x²'], [B1, 'x'], [B2, 'x'], [C, '']]));
    return br(p, a) + br(q, b) + ' = ' + raw + ' = <b>' + q2p(A, B1 + B2, C) + '</b>';
  }
  function mist(p, a, q, b) {
    var A = p * q, B = p * b + a * q, C = a * b;
    return function (v) {
      var s = v[0]; if (!M.termValid(s)) return null;
      if (M.termEq(s, q2(A, 0, C))) return 'Es fehlen die gemischten Glieder. Jedes Glied der ersten Klammer wird mit <b>jedem</b> Glied der zweiten Klammer multipliziert. Das sind <b>4 Produkte</b>.';
      if (C && M.termEq(s, q2(A, B, -C))) return 'Prüfe das Vorzeichen der Zahl am Ende: ' + sg(a) + ' · ' + sg(b) + ' = ' + T(String(C)) + '.';
      if (B && M.termEq(s, q2(A, -B, C))) return 'Prüfe die Vorzeichen bei den x-Gliedern: ' + cx(p) + ' · ' + sg(b) + ' und ' + sg(a) + ' · ' + cx(q) + '.';
      if (p * b !== B && M.termEq(s, q2(A, p * b, C))) return 'Ein gemischtes Glied fehlt: ' + sg(a) + ' · ' + cx(q) + ' = ' + cx(a * q) + '.';
      if (a * q !== B && M.termEq(s, q2(A, a * q, C))) return 'Ein gemischtes Glied fehlt: ' + cx(p) + ' · ' + sg(b) + ' = ' + cx(p * b) + '.';
      if (M.termEq(s, q2(0, p + q, a + b))) return 'Du hast addiert statt multipliziert. Bei zwei Klammern direkt nebeneinander wird <b>multipliziert</b>.';
      return null;
    };
  }
  /* Skizze eines Rechtecks mit vier Teilflächen (nicht maßstabsgetreu) */
  function sketch(top, left, areas) {
    var x0 = 60, y0 = 34, w1 = 150, w2 = 90, h1 = 110, h2 = 60, cols = ['#cfc2ee', '#f6d9a8', '#fbe7c6', '#efeafb'];
    var R = [[x0, y0, w1, h1], [x0 + w1, y0, w2, h1], [x0, y0 + h1, w1, h2], [x0 + w1, y0 + h1, w2, h2]];
    var s = '<svg class="viz" viewBox="0 0 340 240" role="img" aria-label="Rechteck mit vier Teilflächen" style="max-width:420px">';
    R.forEach(function (r, i) {
      s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="' + cols[i] + '" stroke="#3d2a73" stroke-width="2"/>';
      s += '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 + 5) + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + (areas[i].indexOf('?') >= 0 ? '#b91c1c' : '#1c1830') + '">' + areas[i] + '</text>';
    });
    s += '<text x="' + (x0 + w1 / 2) + '" y="24" font-size="14" font-weight="700" text-anchor="middle" fill="#3d2a73">' + top[0] + '</text><text x="' + (x0 + w1 + w2 / 2) + '" y="24" font-size="14" font-weight="700" text-anchor="middle" fill="#b45309">' + top[1] + '</text>';
    s += '<text x="' + (x0 - 8) + '" y="' + (y0 + h1 / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#3d2a73">' + left[0] + '</text><text x="' + (x0 - 8) + '" y="' + (y0 + h1 + h2 / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#b45309">' + left[1] + '</text>';
    s += '<text x="336" y="236" font-size="10" text-anchor="end" fill="#5a5670">Skizze nicht maßstabsgetreu</text>';
    return s + '</svg>';
  }

  function flSketch(a, b) {
    var x0 = 40, y0 = 30, S = 150, ua = 18, W = S + a * ua, H = S - b * ua;
    var g = '<svg class="viz" viewBox="0 0 340 220" role="img" aria-label="Quadrat und neues Rechteck" style="max-width:400px">' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + W + '" height="' + H + '" fill="#efeafb" stroke="#3d2a73" stroke-width="2.5"/>' +
      '<rect x="' + x0 + '" y="' + y0 + '" width="' + S + '" height="' + S + '" fill="none" stroke="#d97706" stroke-width="2" stroke-dasharray="6 4"/>' +
      '<text x="' + (x0 + S / 2) + '" y="' + (y0 - 8) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#3d2a73">x</text>' +
      '<text x="' + (x0 + S + a * ua / 2) + '" y="' + (y0 - 8) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#b45309">+' + a + '</text>' +
      '<text x="' + (x0 - 6) + '" y="' + (y0 + H / 2 + 4) + '" font-size="13" font-weight="700" text-anchor="end" fill="#3d2a73">x − ' + b + '</text>' +
      '<text x="' + (x0 + S + 6) + '" y="' + (y0 + S - 4) + '" font-size="11" fill="#b45309">altes Quadrat</text>' +
      '<text x="' + (x0 + S / 2) + '" y="' + (y0 + H / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="middle">neues Beet</text>' +
      '<text x="336" y="216" font-size="10" text-anchor="end" fill="#5a5670">Skizze nicht maßstabsgetreu</text></svg>';
    return g;
  }

  var gen = {
    rechteck: function () {
      var a = M.rnd(1, 7), b = M.rnd(1, 6); if (a === b) b = a === 6 ? 5 : a + 1;
      var inp = termIn('Flächeninhalt als Term ohne Klammern');
      inp.answer = q2(1, a + b, a * b);
      return { src: '(x+' + a + ')*(x+' + b + ')', skill: 'Rechteckmodell', level: 1,
        q: 'Ein Rechteck hat die Seitenlängen x + ' + a + ' und x + ' + b + '. Drei Teilflächen sind schon eingetragen.' + sketch(['x', String(a)], ['x', String(b)], ['x²', a + 'x', b + 'x', '?']) + 'a) Wie groß ist die Teilfläche „?“<br>b) Gib den ganzen Flächeninhalt ohne Klammern an. Fasse zusammen.',
        inputs: [{ kind: 'num', answer: a * b, label: 'a) Teilfläche ?' }, inp],
        hints: ['Die Teilfläche „?“ ist ' + a + ' breit und ' + b + ' hoch.', 'Addiere alle vier Teilflächen: x² + ' + a + 'x + ' + b + 'x + ' + a * b + '.', 'Fasse die x-Glieder zusammen: ' + a + 'x + ' + b + 'x = ' + (a + b) + 'x.'],
        solution: 'a) ' + a + ' · ' + b + ' = ' + a * b + '. b) (x + ' + a + ')(x + ' + b + ') = x² + ' + a + 'x + ' + b + 'x + ' + a * b + ' = <b>' + q2p(1, a + b, a * b) + '</b>',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && x === a + b) return 'Die Teilfläche ist ein Rechteck. Ihr Flächeninhalt ist Breite <b>mal</b> Höhe.'; return mist(1, a, 1, b)([v[1]]); } };
    },
    erkennen: function () {
      var a = M.rnd(2, 7), b = M.rnd(2, 7); if (a === b) b++;
      var right = q2p(1, a + b, a * b), cand = [q2p(1, 0, a * b), q2p(1, a * b, a + b), q2p(1, a + b, a + b), q2p(0, 2, a + b), q2p(1, a, a * b)];
      var seen = {}; seen[right] = 1; var wrong = cand.filter(function (x) { if (seen[x]) return false; seen[x] = 1; return true; }).slice(0, 3);
      var opts = M.shuffle([right].concat(wrong));
      return { skill: 'Gleichwertigen Term erkennen', level: 1, q: 'Welcher Term ist gleichwertig zu ' + show('(x + ' + a + ')(x + ' + b + ')') + '?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: opts.indexOf(right) }],
        hints: ['Es entstehen vier Produkte: x · x, x · ' + b + ', ' + a + ' · x und ' + a + ' · ' + b + '.', 'Die beiden mittleren Produkte werden zusammengefasst: ' + b + 'x + ' + a + 'x = ' + (a + b) + 'x.', 'Kontrolle mit x = 1: (1 + ' + a + ') · (1 + ' + b + ') = ' + (1 + a) * (1 + b) + '. Welcher Term ergibt für x = 1 auch ' + (1 + a) * (1 + b) + '?'],
        solution: '(x + ' + a + ')(x + ' + b + ') = x² + ' + b + 'x + ' + a + 'x + ' + a * b + ' = ' + right + '.',
        verify: function () { return M.termEq('(x+' + a + ')*(x+' + b + ')', q2(1, a + b, a * b)) ? true : 'falsch'; } };
    },
    pos: function (lvl) {
      var a = M.rnd(1, lvl >= 2 ? 9 : 6), b = M.rnd(1, lvl >= 2 ? 9 : 6); if (a === b) b = b === 1 ? 2 : b - 1;
      var inp = termIn(); inp.answer = q2(1, a + b, a * b);
      var f = four(1, a, 1, b);
      return { src: brs(1, a) + '*' + brs(1, b), skill: 'Zwei Summen multiplizieren', level: lvl, q: 'Multipliziere aus und fasse zusammen. ' + show(br(1, a) + br(1, b)), inputs: [inp],
        hints: ['Multipliziere jedes Glied der ersten Klammer mit jedem Glied der zweiten Klammer. Das sind 4 Produkte.', 'Die Produkte sind: x · x = x², x · ' + b + ' = ' + cx(b) + ', ' + a + ' · x = ' + cx(a) + ' und ' + a + ' · ' + b + ' = ' + a * b + '.', 'Fasse ' + cx(b) + ' + ' + cx(a) + ' zusammen.'],
        solution: stepsHtml(1, a, 1, b), mistakes: mist(1, a, 1, b) };
    },
    vorz: function (lvl) {
      var a, b; do { a = M.nz(-9, 9); b = M.nz(-9, 9); } while (a === -b || (a > 0 && b > 0));
      var inp = termIn(); inp.answer = q2(1, a + b, a * b);
      return { src: brs(1, a) + '*' + brs(1, b), skill: 'Ausmultiplizieren mit Vorzeichen', level: lvl, q: 'Multipliziere aus und fasse zusammen. ' + show(br(1, a) + br(1, b)), inputs: [inp],
        hints: ['Rechne mit den Vorzeichen: Die Zahlen in den Klammern sind ' + T(String(a)) + ' und ' + T(String(b)) + '.', 'Die vier Produkte: x², ' + cx(b) + ', ' + cx(a) + ' und ' + sg(a) + ' · ' + sg(b) + ' = ' + T(String(a * b)) + '.', 'Fasse zusammen: ' + cx(b) + ' ' + (a < 0 ? '− ' + cx(-a) : '+ ' + cx(a)) + ' = ' + cx(a + b) + '.'],
        solution: stepsHtml(1, a, 1, b), mistakes: mist(1, a, 1, b) };
    },
    koeff: function (lvl) {
      var p, q, a, b; do { p = M.rnd(1, 4); q = M.rnd(1, lvl >= 3 ? 5 : 3); a = M.nz(-7, 7); b = M.nz(-7, 7); } while ((p === 1 && q === 1) || p * b + a * q === 0 || (lvl < 3 && a < 0 && b < 0));
      var inp = termIn(); inp.answer = q2(p * q, p * b + a * q, a * b);
      return { src: brs(p, a) + '*' + brs(q, b), skill: 'Summen mit Koeffizienten multiplizieren', level: lvl, q: 'Multipliziere aus und fasse zusammen. ' + show(br(p, a) + br(q, b)), inputs: [inp],
        hints: ['Vier Produkte: ' + four(p, a, q, b).join(', ') + '.', cx(p) + ' · ' + cx(q) + ' = ' + T(poly([[p * q, 'x²']])) + '. Die Zahlen vor x werden multipliziert, x · x = x².', 'Gemischte Glieder: ' + cx(p * b) + ' und ' + cx(a * q) + '. Zusammen: ' + cx(p * b + a * q) + '. Die Zahl am Ende: ' + T(String(a * b)) + '.'],
        solution: stepsHtml(p, a, q, b), mistakes: mist(p, a, q, b) };
    },
    zweivar: function (lvl) {
      var p = M.rnd(1, 4), qv = M.nz(-6, 6), r = M.nz(-6, 6), s = M.rnd(1, 3);
      /* (p·a + qv)(s·b + r) */
      var c1 = p * s, c2 = p * r, c3 = qv * s, c4 = qv * r;
      var ans = (c1 === 1 ? '' : c1) + 'a*b+' + c2 + 'a+' + c3 + 'b+' + c4;
      ans = ans.replace(/\+-/g, '-');
      var pretty = T(poly([[c1, 'ab'], [c2, 'a'], [c3, 'b'], [c4, '']]));
      var inp = termIn('Term ohne Klammern'); inp.answer = ans; inp.placeholder = 'z. B. 2ab + 6a + b + 3';
      return { src: brs(p, qv, 'a') + '*' + brs(s, r, 'b'), skill: 'Summen mit zwei Variablen', level: lvl, q: 'Multipliziere aus. ' + show(br(p, qv, 'a') + br(s, r, 'b')) + '<br><small>Hier gibt es keine gleichartigen Glieder. Schreibe a · b als ab.</small>', inputs: [inp],
        hints: ['Vier Produkte: ' + cx(p, 'a') + ' · ' + cx(s, 'b') + ', ' + cx(p, 'a') + ' · ' + sg(r) + ', ' + sg(qv) + ' · ' + cx(s, 'b') + ' und ' + sg(qv) + ' · ' + sg(r) + '.', cx(p, 'a') + ' · ' + cx(s, 'b') + ' = ' + cx(c1, 'ab') + ' und ' + cx(p, 'a') + ' · ' + sg(r) + ' = ' + cx(c2, 'a') + '.', sg(qv) + ' · ' + cx(s, 'b') + ' = ' + cx(c3, 'b') + ' und ' + sg(qv) + ' · ' + sg(r) + ' = ' + T(String(c4)) + '.'],
        solution: br(p, qv, 'a') + br(s, r, 'b') + ' = <b>' + pretty + '</b>',
        mistakes: function (v) { if (M.termValid(v[0]) && M.termEq(v[0], (c1 === 1 ? '' : c1) + 'a*b+(' + c4 + ')')) return 'Es fehlen die gemischten Glieder. Multipliziere jedes Glied mit jedem: 4 Produkte.'; return null; } };
    },
    zusammen: function (lvl) {
      var a, b, c, d, kind = lvl >= 3 ? M.pick(['diff', 'diff', 'quad']) : 'quad', A, B, C, src, shown;
      do {
        a = M.nz(-6, 7); b = M.nz(-6, 7);
        if (kind === 'quad') { c = M.nz(-6, 6); A = 0; B = a + b - c; C = a * b; src = brs(1, a) + '*' + brs(1, b) + '-x*' + brs(1, c); shown = br(1, a) + br(1, b) + ' − x' + br(1, c); }
        else { c = M.nz(-6, 6); d = M.nz(-6, 6); A = 0; B = a + b - c - d; C = a * b - c * d; src = brs(1, a) + '*' + brs(1, b) + '-' + brs(1, c) + '*' + brs(1, d); shown = br(1, a) + br(1, b) + ' − ' + br(1, c) + br(1, d); }
      } while (B === 0 || C === 0 || Math.abs(B) > 12);
      var inp = { kind: 'term', form: 'simplified', maxTerms: 2, label: 'Vereinfachter Term', placeholder: 'z. B. 3x − 4', answer: q2(0, B, C) };
      var first = q2p(1, a + b, a * b), second = kind === 'quad' ? q2p(1, c, 0) : q2p(1, c + d, c * d);
      return { src: src, skill: 'Ausmultiplizieren und zusammenfassen', level: lvl, q: 'Vereinfache so weit wie möglich. ' + show(T(shown)), inputs: [inp],
        hints: ['Multipliziere zuerst jedes Produkt einzeln aus.', T(br(1, a) + br(1, b)) + ' = ' + first + ' und ' + (kind === 'quad' ? 'x' + br(1, c) : br(1, c) + br(1, d)) + ' = ' + second + '.', 'Vor dem zweiten Teil steht ein Minus. Setze ihn in Klammern: (' + first + ') − (' + second + '). Alle Vorzeichen im zweiten Teil drehen sich um.'],
        solution: T(shown) + ' = ' + first + ' − (' + second + ') = <b>' + q2p(0, B, C) + '</b>. Das x² fällt weg.',
        mistakes: function (v) {
          if (!M.termValid(v[0])) return null;
          var sB = kind === 'quad' ? a + b + c : a + b + c + d, sC = kind === 'quad' ? a * b : a * b + c * d;
          if (M.termEq(v[0], q2(0, sB, sC)) || M.termEq(v[0], q2(2, sB, sC))) return 'Achte auf das Minus vor dem zweiten Produkt. Es gilt für den ganzen ausmultiplizierten Term, also drehen sich alle Vorzeichen um.';
          return null;
        } };
    },
    luecke: function (lvl) {
      var a, b; do { a = lvl >= 3 ? M.nz(-8, 8) : M.rnd(1, 8); b = M.nz(-8, 8); } while (a + b === 0 || a === b);
      return { skill: 'Lücken in Produkten', level: 3, q: 'Welche Zahl gehört in die Lücke? ' + show('(x + □) · ' + br(1, b) + ' = ' + q2p(1, a + b, a * b)) + (lvl >= 3 ? '<br><small>Die Zahl kann auch negativ sein.</small>' : ''),
        inputs: [{ kind: 'num', answer: a, label: '□ =' }],
        hints: ['Schau auf die Zahl ohne x: □ · ' + sg(b) + ' muss ' + T(String(a * b)) + ' ergeben.', 'Rechne rückwärts: □ = ' + T(String(a * b)) + ' : ' + sg(b) + '.', 'Kontrolle beim x-Glied: ' + sg(b) + ' + □ muss ' + T(String(a + b)) + ' ergeben.'],
        solution: '□ = ' + T(String(a * b)) + ' : ' + sg(b) + ' = ' + T(String(a)) + '. Kontrolle: ' + T(br(1, a) + br(1, b)) + ' = ' + q2p(1, a + b, a * b) + '.',
        verify: function () { return M.termEq(brs(1, a) + '*' + brs(1, b), q2(1, a + b, a * b)) ? true : 'Lücke falsch'; },
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && x === -a) return 'Prüfe das Vorzeichen: ' + sg(-a) + ' · ' + sg(b) + ' ergibt ' + T(String(-a * b)) + ', nicht ' + T(String(a * b)) + '.'; if (x !== null && x === a + b) return 'Das ist die Zahl vor dem x. Gesucht ist die Zahl in der Klammer. Nutze die Zahl ohne x.'; return null; } };
    },
    flaeche: function () {
      var pr = M.pick([[3, 2], [4, 2], [6, 3], [4, 3], [6, 4], [6, 2], [5, 4]]), a = pr[0], b = pr[1], X = a * b / (a - b);
      var inp = termIn('a) neuer Flächeninhalt (ohne Klammern)'); inp.answer = q2(1, a - b, -a * b); inp.placeholder = 'z. B. x^2 + x − 6';
      return { src: '(x+' + a + ')*(x-' + b + ')', skill: 'Flächen mit Termen vergleichen', level: 3,
        q: 'Ein quadratisches Beet hat die Seitenlänge x Meter. Es wird umgebaut: Eine Seite wird um ' + a + ' m <b>länger</b>, die andere um ' + b + ' m <b>kürzer</b>.' + flSketch(a, b) + 'a) Gib den neuen Flächeninhalt als Term ohne Klammern an.<br>b) Bei welcher Seitenlänge x ist das neue Beet genauso groß wie das alte?',
        inputs: [inp, { kind: 'num', answer: X, label: 'b) x =', unit: 'm' }],
        hints: ['Das neue Beet ist ein Rechteck mit den Seiten x + ' + a + ' und x − ' + b + '.', '(x + ' + a + ')(x − ' + b + ') = x² − ' + b + 'x + ' + a + 'x − ' + a * b + ' = ' + q2p(1, a - b, -a * b) + '.', 'Gleich groß heißt: ' + q2p(1, a - b, -a * b) + ' = x². Ziehe x² ab: ' + q2p(0, a - b, -a * b) + ' = 0.'],
        solution: 'a) (x + ' + a + ')(x − ' + b + ') = <b>' + q2p(1, a - b, -a * b) + '</b>. b) ' + q2p(1, a - b, -a * b) + ' = x² ⇒ ' + q2p(0, a - b, -a * b) + ' = 0 ⇒ ' + (a - b === 1 ? '' : q2p(0, a - b, 0) + ' = ' + a * b + ' ⇒ ') + 'x = ' + X + '. Probe: (' + X + ' + ' + a + ') · (' + X + ' − ' + b + ') = ' + (X + a) + ' · ' + (X - b) + ' = ' + (X + a) * (X - b) + ' = ' + X + '².',
        verify: function () { return (X + a) * (X - b) === X * X && X > b ? true : 'Probe falsch'; } };
    }
  };

  return {
    id: '004', title: 'Summen multiplizieren', bereich: 'Terme und Gleichungen', minutes: '45 bis 60',
    vorkenntnisse: 'Klammerterme ausmultiplizieren, Terme zusammenfassen',
    lead: 'Was passiert, wenn man zwei Klammern miteinander multipliziert? Mit einem Rechteck aus vier Teilen siehst du sofort, wie es geht.',
    einstieg: { html: '<p>Der Schulhof bekommt eine quadratische Sandfläche mit der Seitenlänge <b>x</b> Meter. Dann wird geplant, sie zu vergrößern: <b>3 m</b> breiter und <b>2 m</b> länger.</p><p class="note">Wie groß ist die neue Fläche? Lea schreibt (x + 3)(x + 2). Ben meint: „Das ist x² + 6.“ Hat Ben recht?</p><p>In diesem Modul zerlegst du das neue Rechteck in vier Teile. So findest du heraus, wie man zwei Summen richtig multipliziert und welchen Fehler Ben gemacht hat.</p>' },
    ziele: ['Ich kann das Produkt zweier Summen am Rechteck mit vier Teilflächen erklären.', 'Ich multipliziere jedes Glied der ersten Klammer mit jedem Glied der zweiten.', 'Ich beachte dabei die Vorzeichenregeln.', 'Ich fasse das Ergebnis zusammen.', 'Ich nutze Produkte von Summen bei Flächen und Lückentermen.'],
    fachwoerter: [['Summe', 'Ein Term, dessen Teile mit + oder − verbunden sind, zum Beispiel x + 3.'], ['Glied', 'Ein Teil einer Summe, zum Beispiel x oder 3 in x + 3.'], ['Ausmultiplizieren', 'Ein Produkt mit Klammern in eine Summe ohne Klammern umwandeln.'], ['Gleichartige Glieder', 'Glieder mit derselben Variablen und demselben Exponenten, zum Beispiel 3x und 5x.']],
    diagnose: [
      { q: 'Was ergibt 3(x + 4) ohne Klammer?', options: ['3x + 12', '3x + 4', '3x + 7', 'Weiß ich noch nicht'], answer: 0, why: 'Die 3 wird mit jedem Summanden multipliziert: 3x + 12.', review: 'Distributivgesetz (Modul 003)' },
      { q: 'Was ergibt 2x · 3x?', options: ['6x²', '5x', '6x', 'Weiß ich noch nicht'], answer: 0, why: 'Zahlen multiplizieren: 2 · 3 = 6, und x · x = x².', review: 'Produkte mit Variablen' },
      { q: 'Was ergibt (−4) · 5?', options: ['−20', '20', '1', 'Weiß ich noch nicht'], answer: 0, why: 'Minus mal Plus ergibt Minus: −20.', review: 'Vorzeichenregeln' },
      { q: 'Fasse zusammen: 5x − 2x + 3', options: ['3x + 3', '6x', '7x + 3', 'Weiß ich noch nicht'], answer: 0, why: '5x − 2x = 3x. Die 3 bleibt stehen.', review: 'Gleichartige Glieder zusammenfassen' }],
    erklaerung:
      '<h3>1. Das Rechteck mit vier Teilflächen</h3><p>Das neue Rechteck vom Schulhof hat die Seiten <b>x + 3</b> und <b>x + 2</b>. Teile es in vier Rechtecke:</p>' + sketch(['x', '3'], ['x', '2'], ['x · x = x²', '3x', '2x', '3 · 2 = 6']) +
      '<p class="big-math">(x + 3)(x + 2) = x² + 3x + 2x + 6 = x² + 5x + 6</p><p>Ben hat die beiden Teilflächen 3x und 2x vergessen. Seine Lösung x² + 6 ist zu klein.</p>' +
      '<div class="merk"><b>Merke:</b> Zwei Summen werden multipliziert, indem man <b>jedes Glied</b> der ersten Klammer mit <b>jedem Glied</b> der zweiten Klammer multipliziert. Danach fasst man zusammen.<br><span class="big-math">(a + b)(c + d) = ac + ad + bc + bd</span></div>' +
      '<h3>2. Mit Vorzeichen</h3><p>Rechne die Vorzeichen bei jedem der vier Produkte mit.</p><p class="big-math">(x − 4)(x + 3) = x² + 3x − 4x − 12 = x² − x − 12</p><p>Die Produkte sind: x · x = x², x · 3 = 3x, (−4) · x = −4x und (−4) · 3 = −12.</p>' +
      '<h3>3. Mit Zahlen vor dem x</h3><p class="big-math">(2x + 1)(3x − 5) = 6x² − 10x + 3x − 5 = 6x² − 7x − 5</p>' +
      '<p class="note"><b>Kontrolle:</b> Setze eine Zahl ein, zum Beispiel x = 1. Links: (1 − 4)(1 + 3) = −12. Rechts: 1 − 1 − 12 = −12. Gleich, also wahrscheinlich richtig.</p>' +
      '<p class="note"><b>Eingabe-Tipp:</b> Für x² schreibst du x^2. Beispiel: x^2 − x − 12.</p>',
    entdecken: {
      html: '<p>Verändere x, a und b. Das Rechteck hat die Seiten x + a und x + b. Es ist maßstabsgetreu gezeichnet.</p><div class="ctl"><label>x = <b id="v_x"></b> <input type="range" id="r_x" min="2" max="9" step="1" value="4"></label><label>a = <b id="v_a"></b> <input type="range" id="r_a" min="1" max="6" step="1" value="2"></label><label>b = <b id="v_b"></b> <input type="range" id="r_b" min="1" max="6" step="1" value="3"></label></div><svg id="e_svg" class="viz" viewBox="0 0 360 260" role="img" aria-label="Rechteck mit vier Teilflächen"></svg><div id="e_txt"></div>',
      init: function (root, done) {
        var n = 0, cols = ['#cfc2ee', '#f6d9a8', '#fbe7c6', '#efeafb'];
        function draw() {
          var x = +root.querySelector('#r_x').value, a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value;
          root.querySelector('#v_x').textContent = x; root.querySelector('#v_a').textContent = a; root.querySelector('#v_b').textContent = b;
          var u = Math.min(300 / (x + a), 210 / (x + b)), X0 = 44, Y0 = 32, W1 = x * u, W2 = a * u, H1 = x * u, H2 = b * u;
          var R = [[X0, Y0, W1, H1, 'x²', x * x], [X0 + W1, Y0, W2, H1, 'a·x', a * x], [X0, Y0 + H1, W1, H2, 'b·x', b * x], [X0 + W1, Y0 + H1, W2, H2, 'a·b', a * b]];
          var s = '';
          R.forEach(function (r, i) {
            s += '<rect x="' + r[0] + '" y="' + r[1] + '" width="' + r[2] + '" height="' + r[3] + '" fill="' + cols[i] + '" stroke="#3d2a73" stroke-width="2"/>';
            if (r[2] >= 34 && r[3] >= 30) s += '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 - 2) + '" font-size="13" font-weight="700" text-anchor="middle">' + r[4] + '</text><text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 + 14) + '" font-size="13" text-anchor="middle">' + r[5] + '</text>';
            else if (r[2] >= 18 && r[3] >= 16) s += '<text x="' + (r[0] + r[2] / 2) + '" y="' + (r[1] + r[3] / 2 + 5) + '" font-size="12" text-anchor="middle">' + r[5] + '</text>';
          });
          s += '<text x="' + (X0 + W1 / 2) + '" y="22" font-size="14" font-weight="700" text-anchor="middle" fill="#3d2a73">x = ' + x + '</text><text x="' + (X0 + W1 + W2 / 2) + '" y="22" font-size="14" font-weight="700" text-anchor="middle" fill="#b45309">' + a + '</text>';
          s += '<text x="' + (X0 - 6) + '" y="' + (Y0 + H1 / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#3d2a73">x</text><text x="' + (X0 - 6) + '" y="' + (Y0 + H1 + H2 / 2 + 5) + '" font-size="14" font-weight="700" text-anchor="end" fill="#b45309">' + b + '</text>';
          root.querySelector('#e_svg').innerHTML = s;
          root.querySelector('#e_txt').innerHTML = '<p class="big-math">(' + x + ' + ' + a + ') · (' + x + ' + ' + b + ') = ' + (x + a) + ' · ' + (x + b) + ' = ' + (x + a) * (x + b) + '</p><p class="big-math">' + x * x + ' + ' + a * x + ' + ' + b * x + ' + ' + a * b + ' = ' + (x * x + a * x + b * x + a * b) + '</p><p class="note">Allgemein: (x + ' + a + ')(x + ' + b + ') = x² + ' + a + 'x + ' + b + 'x + ' + a * b + ' = <b>' + q2p(1, a + b, a * b) + '</b>. Die beiden mittleren Teilflächen darfst du nie vergessen.</p>';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Genau: Das große Rechteck besteht immer aus vier Teilflächen. Deshalb entstehen beim Multiplizieren zweier Summen vier Produkte.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Ausmultiplizieren mit Vorzeichen', q: 'Multipliziere aus und fasse zusammen: ' + show('(2x − 3)(x + 5)'),
      steps: ['Vier Produkte bilden: 2x · x, 2x · 5, (−3) · x und (−3) · 5.', 'Ausrechnen: 2x · x = 2x², 2x · 5 = 10x, (−3) · x = −3x, (−3) · 5 = −15.', 'Aufschreiben: 2x² + 10x − 3x − 15.', 'Zusammenfassen: 10x − 3x = 7x. Ergebnis: <b>2x² + 7x − 15</b>.', 'Kontrolle mit x = 1: (2 − 3)(1 + 5) = −6 und 2 + 7 − 15 = −6. Passt!'] },
    tasks: { gen: gen, plan: { G: ['erkennen:1', 'rechteck:1', 'pos:1', 'vorz:2'], S: ['rechteck:1', 'pos:2', 'vorz:2', 'koeff:2', 'zusammen:2'], E: ['vorz:2', 'koeff:3', 'zweivar:2', 'zusammen:3', 'luecke:3', 'pos:2'] },
      extra: 'flaeche', test: ['rechteck:1', 'pos:2', 'vorz:2', 'koeff:2', 'zusammen:2', 'luecke:2'] },
    lerncheck: ['Ich kann das Produkt zweier Summen an einem Rechteck erklären.', 'Ich multipliziere jedes Glied mit jedem Glied.', 'Ich beachte die Vorzeichen und fasse zusammen.', 'Ich vergesse die gemischten Glieder nicht.']
  };
})();
