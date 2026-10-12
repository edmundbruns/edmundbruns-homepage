/* Modul 008 · Zehnerpotenzen (Klasse 9) */
var MODULE = (function () {
  var C1 = '#1e3a8a', CF = '#e8eefc', CA = '#d97706', CH = '#1d4ed8';
  function ex(n) { return n < 0 ? '−' + (-n) : String(n); }
  function p10(n) { return '10<sup>' + ex(n) + '</sup>'; }
  /* Zahl als Ziffernfolge d (erste Ziffer ≠ 0) und Exponent n: Wert = d[0],d[1..] · 10^n */
  function man(d) { return parseFloat(d.charAt(0) + '.' + (d.slice(1) || '0')); }
  function val(d, n) { return parseFloat(d.charAt(0) + '.' + (d.slice(1) || '0') + 'e' + n); }
  function manH(d) { return d.length > 1 ? d.charAt(0) + ',' + d.slice(1) : d; }
  function sciH(d, n) { return manH(d) + ' · ' + p10(n); }
  function gdec(s) { return s.length > 4 ? s.replace(/(\d{3})(?=\d)/g, '$1\u202f') : s; }
  function pn(s) { return M.parseNum(String(s).replace(/\s/g, '')); }
  function group(s) { return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : s; }
  function toDec(d, n) {
    var p = 1 + n;
    if (p <= 0) return '0,' + gdec(new Array(-p + 1).join('0') + d);
    if (p >= d.length) return group(d + new Array(p - d.length + 1).join('0'));
    return group(d.slice(0, p)) + ',' + gdec(d.slice(p));
  }
  function digits(k) { var s = String(M.rnd(1, 9)); for (var i = 1; i < k; i++) s += (i === k - 1 ? M.rnd(1, 9) : M.rnd(0, 9)); return s; }
  function norm(x) { /* Zahl -> {d, n} */ var e = Math.floor(Math.log10(x) + 1e-12), m = Math.round(x / Math.pow(10, e) * 1e9) / 1e9; if (m >= 10) { m /= 10; e++; } var s = String(m).replace('.', ''); return { d: s.replace(/0+$/, '') || '1', n: e }; }
  function sciInputs(d, n, pre) { return [{ kind: 'num', label: (pre || '') + 'Vorfaktor a =', answer: man(d), placeholder: 'z. B. 4,5' }, { kind: 'num', label: 'Exponent n =', answer: n, placeholder: 'z. B. 7 oder −3' }]; }
  function decIn(v, label, unit) { var o = { kind: 'num', label: label || 'Dezimalzahl', answer: v, tol: Math.abs(v) * 1e-9 }; if (unit) o.unit = unit; return o; }
  function sciMistakes(d, n, small) {
    return function (v) {
      var a = M.parseNum(v[0]), k = M.parseNum(v[1]); if (a === null || k === null) return null;
      if (a >= 10 || a < 1) { if (Math.abs(a * Math.pow(10, k) - val(d, n)) < Math.abs(val(d, n)) * 1e-9) return 'Der Wert stimmt, aber a muss zwischen 1 und 10 liegen (1 ≤ a &lt; 10). Verschiebe das Komma so, dass genau eine Ziffer ungleich 0 davor steht.'; return 'Der Vorfaktor a muss zwischen 1 und 10 liegen, zum Beispiel 4,5 und nicht 45.'; }
      if (Math.abs(a - man(d)) < 1e-9 && k === -n && n !== 0) return small ? 'Bei Zahlen kleiner als 1 ist der Exponent <b>negativ</b>.' : 'Bei großen Zahlen ist der Exponent positiv.';
      if (Math.abs(a - man(d)) < 1e-9 && Math.abs(k - n) === 1) return 'Der Vorfaktor stimmt. Zähle noch einmal genau, um wie viele Stellen das Komma wandert.';
      return null;
    };
  }
  function countHint(d, n) {
    return n >= 0 ? 'Das Komma steht hinter der letzten Ziffer und wandert ' + n + ' Stellen nach links, bis nur noch eine Ziffer davor steht.' : 'Das Komma wandert ' + (-n) + ' Stellen nach rechts, bis die erste Ziffer ungleich 0 (die ' + d.charAt(0) + ') vor dem Komma steht.';
  }

  var gen = {
    inSci: function (lvl) {
      var d = digits(lvl <= 1 ? M.rnd(1, 2) : lvl === 2 ? M.rnd(2, 3) : M.rnd(3, 4)), n = lvl <= 1 ? M.rnd(3, 8) : lvl === 2 ? M.rnd(4, 10) : M.rnd(8, 14);
      if (n < d.length - 1) n = d.length - 1;
      var dec = toDec(d, n);
      return { skill: 'Große Zahlen in Zehnerpotenz-Schreibweise', level: lvl, q: 'Schreibe in wissenschaftlicher Schreibweise a · ' + p10('n') + ' mit 1 ≤ a &lt; 10.<span class="big-math">' + dec + ' = □ · 10<sup>□</sup></span>',
        inputs: sciInputs(d, n),
        hints: ['Setze das Komma so, dass genau eine Ziffer ungleich 0 davor steht: a = ' + manH(d) + '.', countHint(d, n), 'Jede Stelle nach links bedeutet einen Faktor 10 mehr. Also n = ' + n + '.'],
        solution: dec + ' = <b>' + sciH(d, n) + '</b>. Das Komma ist ' + n + ' Stellen nach links gewandert, also wird mit ' + p10(n) + ' = ' + toDec('1', n) + ' multipliziert.',
        mistakes: sciMistakes(d, n, false),
        verify: function () { return pn(dec) === val(d, n) && man(d) >= 1 && man(d) < 10 ? true : 'Umwandlung'; } };
    },
    klein: function (lvl) {
      var d = digits(lvl <= 1 ? M.rnd(1, 2) : M.rnd(2, 3)), n = -M.rnd(lvl <= 1 ? 2 : 3, lvl >= 3 ? 9 : 6);
      var dec = toDec(d, n);
      return { skill: 'Kleine Zahlen in Zehnerpotenz-Schreibweise', level: lvl, q: 'Schreibe in wissenschaftlicher Schreibweise a · ' + p10('n') + ' mit 1 ≤ a &lt; 10.<span class="big-math">' + dec + ' = □ · 10<sup>□</sup></span>',
        inputs: sciInputs(d, n),
        hints: ['Die Zahl ist kleiner als 1. Dann ist der Exponent negativ.', countHint(d, n), 'a = ' + manH(d) + ' und n = ' + ex(n) + '.'],
        solution: dec + ' = <b>' + sciH(d, n) + '</b>. Das Komma ist ' + (-n) + ' Stellen nach rechts gewandert. ' + p10(n) + ' = ' + toDec('1', n) + '.',
        mistakes: sciMistakes(d, n, true),
        verify: function () { return Math.abs(pn(dec) - val(d, n)) <= Math.abs(val(d, n)) * 1e-12 ? true : 'Umwandlung'; } };
    },
    ausSci: function (lvl) {
      var d = digits(lvl <= 1 ? M.rnd(1, 2) : M.rnd(2, 3)), n = lvl <= 1 ? M.rnd(2, 7) : lvl === 2 ? M.pick([M.rnd(3, 9), -M.rnd(2, 5)]) : M.pick([M.rnd(6, 9), -M.rnd(3, 6)]);
      var v = val(d, n), dec = toDec(d, n);
      return { skill: 'Zehnerpotenz-Schreibweise in Dezimalzahl', level: lvl, q: 'Schreibe als Dezimalzahl (ohne Zehnerpotenz). <span class="big-math">' + sciH(d, n) + ' = ?</span>',
        inputs: [decIn(v, 'Dezimalzahl')],
        hints: [n > 0 ? 'Ein positiver Exponent macht die Zahl größer: Das Komma wandert nach rechts.' : 'Ein negativer Exponent macht die Zahl kleiner als 1: Das Komma wandert nach links.', 'Verschiebe das Komma von ' + manH(d) + ' um ' + Math.abs(n) + ' Stellen nach ' + (n > 0 ? 'rechts' : 'links') + '. Fülle fehlende Stellen mit Nullen auf.', 'Kontrolle: Die Zahl beginnt mit den Ziffern ' + d + (n > 0 ? ' und hat vor dem Komma ' + (n + 1) + ' Stellen.' : ' und hinter dem Komma stehen zuerst ' + (-n - 1) + ' Nullen.')],
        solution: sciH(d, n) + ' = <b>' + dec + '</b>. Das Komma wandert ' + Math.abs(n) + ' Stellen nach ' + (n > 0 ? 'rechts' : 'links') + '.',
        mistakes: function (x) { var y = M.parseNum(x[0]); if (y === null) return null; if (Math.abs(y - v * 10) < Math.abs(v) * 1e-6 || Math.abs(y - v / 10) < Math.abs(v) * 1e-6) return 'Fast: Du hast dich um eine Stelle verzählt. Das Komma wandert genau ' + Math.abs(n) + ' Stellen.'; if (n < 0 && y > 1) return 'Bei einem negativen Exponenten ist die Zahl kleiner als 1.'; return null; },
        verify: function () { return Math.abs(pn(dec) - v) <= Math.abs(v) * 1e-12 && Math.abs(man(d) * Math.pow(10, n) - v) <= Math.abs(v) * 1e-9 ? true : 'Dezimal'; } };
    },
    mal10: function (lvl) {
      var d = digits(M.rnd(2, 3)), e0 = M.rnd(-3, 1), k = M.rnd(2, lvl >= 3 ? 6 : 4), div = lvl >= 2 && Math.random() < 0.5, x = toDec(d, e0), r = div ? e0 - k : e0 + k;
      if (r < -6 || r > 9) return gen.mal10(lvl);
      var v = val(d, r), res = toDec(d, r);
      return { skill: 'Mit Zehnerpotenzen multiplizieren und dividieren', level: lvl, q: 'Berechne ohne Taschenrechner. <span class="big-math">' + x + (div ? ' : ' : ' · ') + p10(k) + ' = ?</span>',
        inputs: [decIn(v, 'Ergebnis')],
        hints: [p10(k) + ' = ' + toDec('1', k) + '. ' + (div ? 'Durch ' + toDec('1', k) + ' teilen' : 'Mit ' + toDec('1', k) + ' multiplizieren') + ' heißt: Das Komma wandert ' + k + ' Stellen nach ' + (div ? 'links' : 'rechts') + '.', 'Starte bei ' + x + ' und verschiebe das Komma Stelle für Stelle. Fülle mit Nullen auf.', 'Das Ergebnis ist ' + (div ? 'kleiner' : 'größer') + ' als ' + x + '.'],
        solution: x + (div ? ' : ' : ' · ') + p10(k) + ' = <b>' + res + '</b> (Komma ' + k + ' Stellen nach ' + (div ? 'links' : 'rechts') + ').',
        mistakes: function (z) { var y = M.parseNum(z[0]); if (y === null) return null; var w = val(d, div ? e0 + k : e0 - k); if (Math.abs(y - w) < Math.abs(w) * 1e-6) return 'Du hast das Komma in die falsche Richtung verschoben. ' + (div ? 'Beim Dividieren wird die Zahl kleiner.' : 'Beim Multiplizieren wird die Zahl größer.'); return null; },
        verify: function () { var a = pn(x), b = pn(res), f = Math.pow(10, k); return Math.abs((div ? a / f : a * f) - b) <= Math.abs(b) * 1e-9 ? true : 'Komma'; } };
    },
    vergleich: function (lvl) {
      var big = Math.random() < 0.5, items = [], seen = {};
      var base = lvl <= 1 ? M.rnd(3, 8) : M.rnd(-7, 9);
      while (items.length < 4) {
        var d = digits(M.rnd(1, 2)), n = base + M.rnd(-1, 1);
        if (items.length === 0) { d = String(M.rnd(1, 3)); n = base + 1; } /* kleiner Vorfaktor, großer Exponent */
        if (items.length === 1) { d = '9' + M.rnd(1, 8); n = base; } /* großer Vorfaktor, kleiner Exponent */
        var key = sciH(d, n); if (seen[key]) continue; seen[key] = 1; items.push({ d: d, n: n, v: val(d, n) });
      }
      var vals = items.map(function (o) { return o.v; }), target = big ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
      if (vals.filter(function (v) { return v === target; }).length !== 1) return gen.vergleich(lvl);
      items = M.shuffle(items); var ans = items.findIndex(function (o) { return o.v === target; }), w = items[ans];
      return { skill: 'Zehnerpotenzen vergleichen', level: lvl, q: 'Welche Zahl ist am <b>' + (big ? 'größten' : 'kleinsten') + '</b>?',
        inputs: [{ kind: 'mc', label: 'Wähle aus', options: items.map(function (o) { return sciH(o.d, o.n); }), answer: ans }],
        hints: ['Vergleiche zuerst die Exponenten. Der Exponent sagt, wie viele Stellen die Zahl hat.', 'Ein um 1 größerer Exponent bedeutet: zehnmal so groß. Das gleicht kein Vorfaktor unter 10 aus.', 'Nur bei gleichem Exponenten entscheidet der Vorfaktor.'],
        solution: 'Am ' + (big ? 'größten' : 'kleinsten') + ' ist <b>' + sciH(w.d, w.n) + '</b> = ' + (w.n >= -6 && w.n <= 12 ? toDec(w.d, w.n) : '') + '. ' + (big ? 'Sie hat den größten Exponenten' : 'Sie hat den kleinsten Exponenten') + (items.filter(function (o) { return o.n === w.n; }).length > 1 ? ' und bei gleichem Exponenten den ' + (big ? 'größeren' : 'kleineren') + ' Vorfaktor.' : '.'),
        mistakes: function (v) { var c = items[+v[0]]; if (c && c.n !== w.n && (big ? man(c.d) > man(w.d) : man(c.d) < man(w.d))) return 'Achtung: Du hast nur auf den Vorfaktor geschaut. Wichtiger ist der Exponent.'; return null; },
        verify: function () { var s = items.slice().sort(function (a, b) { return (a.n - b.n) || (man(a.d) - man(b.d)); }); return (big ? s[3] : s[0]) === w ? true : 'Vergleich'; } };
    },
    ordnen: function (lvl) {
      var objs = [], seen = {};
      var pool = M.pick([
        [['Ameise', '4', -3], ['Sandkorn', '5', -4], ['Bakterium', '2', -6], ['Haar (Dicke)', '7', -5]],
        [['Mount Everest', '8848', 3], ['Erddurchmesser', '1274', 7], ['Fußballfeld', '105', 2], ['Mond (Durchmesser)', '3474', 6]],
        [['Berlin', '37', 6], ['Deutschland', '84', 7], ['Welt', '8', 9], ['Hannover', '535', 5]]]);
      var unit = pool[0][0] === 'Berlin' ? 'Einwohner' : 'm';
      pool = M.shuffle(pool).slice(0, 3);
      pool.forEach(function (p, i) { objs.push({ name: p[0], d: p[1], n: p[2], v: val(p[1], p[2]), sh: i === 1 && p[2] >= -6 && p[2] <= 9 ? toDec(p[1], p[2]) : sciH(p[1], p[2]) }); });
      var sorted = objs.slice().sort(function (a, b) { return a.v - b.v; });
      function line(arr) { return arr.map(function (o) { return o.name; }).join(' &lt; '); }
      var perms = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(function (p) { return p.map(function (i) { return sorted[i]; }); });
      var right = perms[0], wrong = M.shuffle(perms.slice(1)).slice(0, 3);
      var byMan = objs.slice().sort(function (a, b) { return man(a.d) - man(b.d); });
      if (line(byMan) !== line(right) && wrong.map(line).indexOf(line(byMan)) < 0) wrong[0] = byMan;
      var opts = M.shuffle([right].concat(wrong)), ans = opts.indexOf(right);
      return { skill: 'Zehnerpotenzen ordnen', level: lvl, q: 'Ordne der Größe nach, beginne mit dem <b>kleinsten</b> Wert.<ul>' + objs.map(function (o) { return '<li>' + o.name + ': ' + o.sh + ' ' + unit + '</li>'; }).join('') + '</ul>',
        inputs: [{ kind: 'mc', label: 'Richtige Reihenfolge', options: opts.map(line), answer: ans }],
        hints: ['Schreibe alle Werte in derselben Form, am besten als a · ' + p10('n') + '.', objs.map(function (o) { return o.name + ': ' + sciH(o.d, o.n); }).join('; ') + '.', 'Ordne zuerst nach dem Exponenten. Je kleiner der Exponent, desto kleiner die Zahl.'],
        solution: 'In Zehnerpotenz-Schreibweise: ' + sorted.map(function (o) { return o.name + ' ' + sciH(o.d, o.n); }).join(', ') + '. Also <b>' + line(right) + '</b>.',
        mistakes: function (v) { var c = opts[+v[0]]; if (c && c === byMan && c !== right) return 'Du hast nur die Vorfaktoren verglichen. Entscheidend ist zuerst der Exponent.'; return null; },
        verify: function () { for (var i = 1; i < 3; i++) if (!(right[i - 1].v < right[i].v)) return 'Reihenfolge'; return opts.map(line).filter(function (s) { return s === line(right); }).length === 1 ? true : 'doppelt'; } };
    },
    mult: function (lvl) {
      var A = M.pick(['15', '2', '25', '3', '4', '12', '5', '6', '8']), B = M.pick(['2', '3', '4', '5', '6', '15', '25']), m = M.rnd(-6, 9), n = M.rnd(-6, 9);
      if (m + n > 15 || m + n < -12) return gen.mult(lvl);
      var p = norm(man(A) * man(B)), k = p.n + m + n, div = lvl >= 3 && Math.random() < 0.6;
      var q, ans, sol, hints;
      if (!div) {
        q = '(' + sciH(A, m) + ') · (' + sciH(B, n) + ')'; ans = { d: p.d, n: k };
        sol = 'Vorfaktoren: ' + manH(A) + ' · ' + manH(B) + ' = ' + M.fmtNum(man(A) * man(B)) + '. Zehnerpotenzen: ' + p10(m) + ' · ' + p10(n) + ' = ' + p10(m + n) + ' (Exponenten addieren).<br>' + M.fmtNum(man(A) * man(B)) + ' · ' + p10(m + n) + (p.n ? ' = ' + manH(p.d) + ' · 10 · ' + p10(m + n) : '') + ' = <b>' + sciH(ans.d, ans.n) + '</b>';
        hints = ['Multipliziere die Vorfaktoren und die Zehnerpotenzen getrennt.', manH(A) + ' · ' + manH(B) + ' = ' + M.fmtNum(man(A) * man(B)) + ' und ' + p10(m) + ' · ' + p10(n) + ' = 10<sup>' + ex(m) + ' + ' + (n < 0 ? '(' + ex(n) + ')' : n) + '</sup>.', p.n ? 'Der Vorfaktor ' + M.fmtNum(man(A) * man(B)) + ' ist größer als 10. Schreibe ihn als ' + manH(p.d) + ' · 10 und erhöhe den Exponenten um 1.' : 'Der Vorfaktor liegt schon zwischen 1 und 10.'];
      } else {
        var P = { d: p.d, n: k };
        q = '(' + sciH(P.d, P.n) + ') : (' + sciH(B, n) + ')'; ans = { d: A, n: m };
        var qq = man(P.d) / man(B), qn = P.n - n;
        sol = 'Vorfaktoren: ' + manH(P.d) + ' : ' + manH(B) + ' = ' + M.fmtNum(qq) + '. Zehnerpotenzen: ' + p10(P.n) + ' : ' + p10(n) + ' = ' + p10(qn) + ' (Exponenten subtrahieren).<br>' + M.fmtNum(qq) + ' · ' + p10(qn) + ' = <b>' + sciH(A, m) + '</b>';
        hints = ['Dividiere die Vorfaktoren und die Zehnerpotenzen getrennt.', manH(P.d) + ' : ' + manH(B) + ' = ' + M.fmtNum(qq) + ' und ' + p10(P.n) + ' : ' + p10(n) + ' = 10<sup>' + ex(P.n) + ' − ' + (n < 0 ? '(' + ex(n) + ')' : n) + '</sup> = ' + p10(qn) + '.', qq < 1 ? 'Der Vorfaktor ' + M.fmtNum(qq) + ' ist kleiner als 1. Schreibe ihn als ' + manH(A) + ' · ' + p10(-1) + ' und verringere den Exponenten um 1.' : 'Der Vorfaktor liegt schon zwischen 1 und 10.'];
      }
      return { skill: div ? 'Zehnerpotenzen dividieren' : 'Zehnerpotenzen multiplizieren', level: lvl, q: 'Berechne und gib das Ergebnis in wissenschaftlicher Schreibweise an (1 ≤ a &lt; 10). <span class="big-math">' + q + '</span>',
        inputs: sciInputs(ans.d, ans.n), hints: hints, solution: sol,
        mistakes: function (v) { var a = M.parseNum(v[0]), e = M.parseNum(v[1]); if (a === null || e === null) return null; if (!div && e === m * n && m * n !== m + n) return 'Die Exponenten werden beim Multiplizieren <b>addiert</b>, nicht multipliziert.'; if (a >= 10) return 'Der Vorfaktor muss kleiner als 10 sein. Schreibe z. B. 12 = 1,2 · 10 und erhöhe den Exponenten um 1.'; return sciMistakes(ans.d, ans.n, false)(v); },
        verify: function () { var lhs = div ? val(p.d, k) / val(B, n) : val(A, m) * val(B, n); return Math.abs(lhs - val(ans.d, ans.n)) <= Math.abs(lhs) * 1e-9 && man(ans.d) >= 1 && man(ans.d) < 10 ? true : 'Produkt'; } };
    },
    sach: function (lvl) {
      var t = M.rnd(0, 3);
      if (t === 0) {
        var o = M.pick([['der Sonne', '15', 8, 500], ['einer Raumsonde am Mars', '228', 8, 760], ['einer Raumsonde am Jupiter', '78', 8, 2600], ['einer Raumsonde am Saturn', '144', 9, 4800]]);
        return { skill: 'Sachaufgabe: Entfernungen im Weltall', level: lvl, q: 'Licht und Funksignale legen in einer Sekunde etwa <b>' + sciH('3', 5) + ' km</b> zurück. Die Entfernung von der Erde zu ' + o[0] + ' beträgt etwa <b>' + sciH(o[1], o[2]) + ' km</b>.<br>Wie viele Sekunden braucht ein Signal für diese Strecke?',
          inputs: [{ kind: 'num', label: 'Zeit', answer: o[3], unit: 's' }],
          hints: ['Zeit = Strecke : Geschwindigkeit.', 'Rechne (' + sciH(o[1], o[2]) + ') : (' + sciH('3', 5) + '). Teile die Vorfaktoren und subtrahiere die Exponenten.', manH(o[1]) + ' : 3 = ' + M.fmtNum(man(o[1]) / 3) + ' und ' + p10(o[2]) + ' : ' + p10(5) + ' = ' + p10(o[2] - 5) + '.'],
          solution: 't = (' + sciH(o[1], o[2]) + ' km) : (' + sciH('3', 5) + ' km/s) = ' + M.fmtNum(man(o[1]) / 3) + ' · ' + p10(o[2] - 5) + ' s = <b>' + o[3] + ' s</b>' + ' (das sind etwa ' + M.fmtNum(Math.round(o[3] / 6) / 10) + ' Minuten).',
          mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && Math.abs(x - val(o[1], o[2]) * 3e5) < 1) return 'Du hast multipliziert. Zeit = Strecke <b>geteilt durch</b> Geschwindigkeit.'; return null; },
          verify: function () { return Math.abs(val(o[1], o[2]) / 3e5 - o[3]) < 1e-6 ? true : 'Licht'; } };
      }
      if (t === 1) {
        var a = M.pick(['1', '2', '25', '4', '5']), cnt = Math.round(1e-2 / val(a, -6));
        return { skill: 'Sachaufgabe: Bakterien', level: lvl, q: 'Ein Bakterium ist etwa <b>' + sciH(a, -6) + ' m</b> lang. Wie viele dieser Bakterien passen hintereinander auf eine Strecke von <b>1 cm</b>?',
          inputs: [{ kind: 'num', label: 'Anzahl', answer: cnt }],
          hints: ['Rechne zuerst 1 cm in Meter um: 1 cm = 0,01 m = ' + p10(-2) + ' m.', 'Anzahl = ' + p10(-2) + ' m : (' + sciH(a, -6) + ' m).', '1 : ' + manH(a) + ' = ' + M.fmtNum(1 / man(a)) + ' und ' + p10(-2) + ' : ' + p10(-6) + ' = ' + p10(4) + '.'],
          solution: p10(-2) + ' m : (' + sciH(a, -6) + ' m) = ' + M.fmtNum(1 / man(a)) + ' · ' + p10(4) + ' = <b>' + toDec(String(cnt).replace(/0+$/, ''), String(cnt).length - 1) + '</b>. So viele Bakterien passen auf 1 cm.',
          mistakes: function (v) { var x = M.parseNum(v[0]); if (x !== null && (Math.abs(x - cnt * 100) < 1e-6 || Math.abs(x - cnt / 100) < 1e-6)) return 'Prüfe die Umrechnung: 1 cm = 0,01 m, nicht 1 m.'; return null; },
          verify: function () { return Math.abs(cnt * val(a, -6) - 0.01) < 1e-12 ? true : 'Bakterien'; } };
      }
      if (t === 2) {
        var g = M.pick([['Deutschland', '84', 7, '125', 2], ['Niedersachsen', '8', 6, '125', 2], ['Hamburg', '19', 6, '12', 2], ['Österreich', '9', 6, '13', 2]]);
        var tot = norm(val(g[1], g[2]) * val(g[3], g[4]));
        return { skill: 'Sachaufgabe: Bevölkerung und Verbrauch', level: lvl, q: 'In ' + g[0] + ' leben etwa <b>' + sciH(g[1], g[2]) + '</b> Menschen. Jeder Mensch verbraucht im Haushalt etwa <b>' + sciH(g[3], g[4]) + ' Liter</b> Wasser pro Tag.<br>Wie viele Liter Wasser sind das zusammen an einem Tag? Gib das Ergebnis in wissenschaftlicher Schreibweise an.',
          inputs: sciInputs(tot.d, tot.n),
          hints: ['Rechne Einwohner mal Verbrauch pro Person.', 'Vorfaktoren: ' + manH(g[1]) + ' · ' + manH(g[3]) + ' = ' + M.fmtNum(man(g[1]) * man(g[3])) + '. Exponenten: ' + g[2] + ' + ' + g[4] + ' = ' + (g[2] + g[4]) + '.', 'Achte darauf, dass der Vorfaktor zwischen 1 und 10 liegt.'],
          solution: '(' + sciH(g[1], g[2]) + ') · (' + sciH(g[3], g[4]) + ' l) = ' + M.fmtNum(man(g[1]) * man(g[3])) + ' · ' + p10(g[2] + g[4]) + ' l = <b>' + sciH(tot.d, tot.n) + ' Liter</b>.',
          mistakes: sciMistakes(tot.d, tot.n, false),
          verify: function () { return Math.abs(val(tot.d, tot.n) - parseFloat(g[1].charAt(0) + '.' + (g[1].slice(1) || '0')) * Math.pow(10, g[2]) * man(g[3]) * Math.pow(10, g[4])) < 1 ? true : 'Wasser'; } };
      }
      var L = M.pick([4, 5, 6]), r = norm(5e6 * L * 1e6);
      return { skill: 'Sachaufgabe: Blutkörperchen', level: lvl, q: 'In 1 mm³ Blut schwimmen etwa <b>' + sciH('5', 6) + '</b> rote Blutkörperchen. Ein Mensch hat etwa <b>' + L + ' Liter</b> Blut. Dabei gilt: 1 Liter = ' + sciH('1', 6) + ' mm³.<br>Wie viele rote Blutkörperchen hat dieser Mensch ungefähr? Gib das Ergebnis in wissenschaftlicher Schreibweise an.',
        inputs: sciInputs(r.d, r.n),
        hints: ['Rechne zuerst die Blutmenge in mm³ um: ' + L + ' l = ' + sciH(String(L), 6) + ' mm³.', 'Anzahl = (' + sciH('5', 6) + ') · (' + sciH(String(L), 6) + ').', '5 · ' + L + ' = ' + 5 * L + ' und ' + p10(6) + ' · ' + p10(6) + ' = ' + p10(12) + '. Schreibe ' + 5 * L + ' als ' + manH(r.d) + ' · 10.'],
        solution: L + ' l = ' + sciH(String(L), 6) + ' mm³. (' + sciH('5', 6) + ') · (' + sciH(String(L), 6) + ') = ' + 5 * L + ' · ' + p10(12) + ' = <b>' + sciH(r.d, r.n) + '</b> rote Blutkörperchen.',
        mistakes: sciMistakes(r.d, r.n, false),
        verify: function () { return Math.abs(val(r.d, r.n) - 5 * L * 1e12) < 1 ? true : 'Blut'; } };
    },
    lichtjahr: function () {
      var st = M.pick([['Proxima Centauri', 4.2], ['Sirius', 8.6], ['Altair', 16.7]]), ly = 3e5 * 3.15e7, dist = ly * st[1], nd = norm(dist), a2 = Math.round(man(nd.d) * 100) / 100;
      return { skill: 'Lichtjahr (Transfer)', level: 3, q: 'Astronomen messen Entfernungen in <b>Lichtjahren</b>. Ein Lichtjahr ist die Strecke, die Licht in einem Jahr zurücklegt. Licht schafft ' + sciH('3', 5) + ' km pro Sekunde, ein Jahr hat etwa ' + sciH('315', 7) + ' Sekunden.<br>a) Wie viele km sind ein Lichtjahr?<br>b) Der Stern ' + st[0] + ' ist ' + M.fmtNum(st[1]) + ' Lichtjahre entfernt. Wie viele km sind das? Runde den Vorfaktor auf zwei Nachkommastellen.',
        inputs: [{ kind: 'num', label: 'a) Vorfaktor a =', answer: 9.45 }, { kind: 'num', label: 'a) Exponent n =', answer: 12 }, { kind: 'num', label: 'b) Vorfaktor a =', answer: a2, tol: 0.005 }, { kind: 'num', label: 'b) Exponent n =', answer: nd.n }],
        hints: ['Strecke = Geschwindigkeit · Zeit: (' + sciH('3', 5) + ') · (' + sciH('315', 7) + ').', '3 · 3,15 = 9,45 und ' + p10(5) + ' · ' + p10(7) + ' = ' + p10(12) + '. Ein Lichtjahr sind also etwa ' + sciH('945', 12) + ' km.', 'Für b) rechnest du ' + M.fmtNum(st[1]) + ' · 9,45 · ' + p10(12) + ' = ' + M.fmtNum(Math.round(st[1] * 9.45 * 1000) / 1000) + ' · ' + p10(12) + '. Schreibe den Vorfaktor zwischen 1 und 10.'],
        solution: 'a) (' + sciH('3', 5) + ' km/s) · (' + sciH('315', 7) + ' s) = <b>' + sciH('945', 12) + ' km</b>.<br>b) ' + M.fmtNum(st[1]) + ' · ' + sciH('945', 12) + ' km = ' + M.fmtNum(Math.round(st[1] * 9.45 * 1000) / 1000) + ' · ' + p10(12) + ' km ≈ <b>' + M.fmtNum(a2, 2) + ' · ' + p10(nd.n) + ' km</b>.',
        mistakes: function (v) { var e = M.parseNum(v[1]); if (e !== null && e === 5 * 7) return 'Die Exponenten werden beim Multiplizieren addiert: 5 + 7.'; var b = M.parseNum(v[2]); if (b !== null && b >= 10) return 'In b) muss der Vorfaktor zwischen 1 und 10 liegen.'; return null; },
        verify: function () { return Math.abs(ly - 9.45e12) < 1 && Math.abs(a2 * Math.pow(10, nd.n) - dist) <= 0.0051 * Math.pow(10, nd.n) ? true : 'Lichtjahr'; } };
    }
  };

  /* Entdecken: Größenordnungen */
  var OBJ = [['Virus', -7], ['Sandkorn', -4], ['Mensch', 0], ['Brocken (Berg)', 3], ['Erde (Ø)', 7], ['Erde bis Sonne', 11]];
  function ruler(lg) {
    var x0 = 20, x1 = 320, lo = -9, hi = 12; function X(e) { return x0 + (e - lo) / (hi - lo) * (x1 - x0); }
    var g = '<svg class="viz" viewBox="0 0 340 130" role="img" aria-label="Zahlenstrahl der Größenordnungen" style="max-width:520px"><line x1="' + x0 + '" y1="65" x2="' + x1 + '" y2="65" stroke="' + C1 + '" stroke-width="2"/>';
    for (var e = lo; e <= hi; e++) g += '<line x1="' + X(e) + '" y1="' + (e % 3 === 0 ? 58 : 61) + '" x2="' + X(e) + '" y2="' + (e % 3 === 0 ? 72 : 69) + '" stroke="' + C1 + '"/>' + (e % 3 === 0 ? '<text x="' + X(e) + '" y="84" font-size="9" text-anchor="middle">10' + '</text><text x="' + (X(e) + 5) + '" y="78" font-size="7">' + ex(e) + '</text>' : '');
    OBJ.forEach(function (o, i) { var up = i % 2 === 0; g += '<line x1="' + X(o[1]) + '" y1="65" x2="' + X(o[1]) + '" y2="' + (up ? 36 : 96) + '" stroke="#94a3b8" stroke-dasharray="2 2"/><text x="' + X(o[1]) + '" y="' + (up ? 30 : 108) + '" font-size="10" text-anchor="middle" fill="' + C1 + '">' + o[0] + '</text>'; });
    g += '<path d="M' + X(lg) + ' 52 l-6 -10 h12 z" fill="' + CA + '"/><circle cx="' + X(lg) + '" cy="65" r="5" fill="' + CA + '" stroke="#fff" stroke-width="1.5"/>';
    g += '<text x="330" y="126" font-size="9" text-anchor="end" fill="#5a5670">Längen in m · jeder Strich: Faktor 10</text></svg>';
    return g;
  }

  return {
    id: '008', title: 'Zehnerpotenzen', bereich: 'Zahlen und Größen', minutes: '45 bis 60',
    vorkenntnisse: 'Dezimalzahlen, Multiplizieren und Dividieren mit 10, 100, 1000, Potenzen',
    lead: 'Die Sonne ist 150 000 000 km entfernt, ein Bakterium nur 0,000002 m lang. Mit Zehnerpotenzen schreibst du riesige und winzige Zahlen kurz und übersichtlich.',
    einstieg: { html: '<p>Die Erde ist etwa <b>150 000 000 km</b> von der Sonne entfernt. Ein rotes Blutkörperchen ist dagegen nur etwa <b>0,000 007 5 m</b> breit.</p><p class="note">Bei so vielen Nullen verzählt man sich schnell. Wie kann man solche Zahlen kurz und sicher aufschreiben und vergleichen?</p><p>Fachleute schreiben stattdessen <b>1,5 · 10<sup>8</sup> km</b> und <b>7,5 · 10<sup>−6</sup> m</b>. In diesem Modul lernst du diese <b>wissenschaftliche Schreibweise</b> und rechnest damit im Weltall, im Körper und mit der Bevölkerung.</p>' },
    ziele: ['Ich weiß, was 10<sup>n</sup> und 10<sup>−n</sup> bedeuten.', 'Ich schreibe große und kleine Zahlen in der Form a · 10<sup>n</sup> mit 1 ≤ a &lt; 10.', 'Ich wandle Zahlen in Zehnerpotenz-Schreibweise in Dezimalzahlen um.', 'Ich vergleiche und ordne Zahlen in Zehnerpotenz-Schreibweise.', 'Ich multipliziere und dividiere mit Zehnerpotenzen, auch in Sachaufgaben.'],
    fachwoerter: [['Zehnerpotenz', '10<sup>n</sup>: die 10 wird n-mal mit sich selbst multipliziert. 10<sup>3</sup> = 1000.'], ['Exponent', 'Die hochgestellte Zahl. Sie zeigt, um wie viele Stellen das Komma wandert.'], ['Negativer Exponent', '10<sup>−n</sup> = 1 : 10<sup>n</sup>, zum Beispiel 10<sup>−3</sup> = 0,001.'], ['Wissenschaftliche Schreibweise', 'Eine Zahl als a · 10<sup>n</sup> mit 1 ≤ a &lt; 10, zum Beispiel 4,5 · 10<sup>7</sup>.']],
    diagnose: [
      { q: 'Was ergibt 10³?', options: ['1000', '30', '100', 'Weiß ich noch nicht'], answer: 0, why: '10³ = 10 · 10 · 10 = 1000.', review: 'Potenzen (Klasse 7/8)' },
      { q: 'Was ergibt 3,7 · 100?', options: ['370', '37', '3,700', 'Weiß ich noch nicht'], answer: 0, why: 'Mal 100: Das Komma wandert 2 Stellen nach rechts.', review: 'Mit Stufenzahlen multiplizieren' },
      { q: 'Was ergibt 4500 : 1000?', options: ['4,5', '45', '0,45', 'Weiß ich noch nicht'], answer: 0, why: 'Durch 1000: Das Komma wandert 3 Stellen nach links.', review: 'Durch Stufenzahlen dividieren' },
      { q: 'Welche Zahl ist größer?', options: ['0,4', '0,05', 'Beide sind gleich groß', 'Weiß ich noch nicht'], answer: 0, why: '0,4 = 0,40 und 0,40 > 0,05.', review: 'Dezimalzahlen vergleichen' }],
    erklaerung:
      '<h3>1. Zehnerpotenzen</h3><table class="tab" style="font-size:0.88em"><tr><th>Potenz</th><th>Wert</th><th>Potenz</th><th>Wert</th></tr>' + [[-1, '0,1', 1, '10'], [-2, '0,01', 2, '100'], [-3, '0,001', 3, '1000'], [-6, '0,000 001', 6, '1 000 000']].map(function (r) { return '<tr><td>' + p10(r[0]) + '</td><td>' + r[1] + '</td><td>' + p10(r[2]) + '</td><td>' + r[3] + '</td></tr>'; }).join('') + '</table>' +
      '<p>Der Exponent zählt die Stellen: Bei ' + p10(6) + ' stehen 6 Nullen hinter der 1. Bei ' + p10(-3) + ' steht die 1 an der 3. Stelle nach dem Komma. Es gilt ' + p10(0) + ' = 1 und ' + p10(-3) + ' = 1 : ' + p10(3) + '.</p>' +
      '<h3>2. Wissenschaftliche Schreibweise</h3><div class="merk"><b>Merke:</b> Jede positive Zahl lässt sich schreiben als <b>a · ' + p10('n') + '</b> mit <b>1 ≤ a &lt; 10</b>.<br>Große Zahl (≥ 10): Das Komma wandert nach <b>links</b>, n ist <b>positiv</b>. 45 000 000 = 4,5 · ' + p10(7) + '<br>Kleine Zahl (&lt; 1): Das Komma wandert nach <b>rechts</b>, n ist <b>negativ</b>. 0,000 36 = 3,6 · ' + p10(-4) + '</div>' +
      '<p>Rückwärts verschiebst du das Komma von a um n Stellen: ' + sciH('27', 5) + ' = 270 000 und ' + sciH('8', -3) + ' = 0,008.</p>' +
      '<h3>3. Vergleichen und ordnen</h3><p>Vergleiche zuerst die <b>Exponenten</b>. ' + sciH('2', 8) + ' ist größer als ' + sciH('95', 7) + ', denn 200 000 000 &gt; 95 000 000. Nur bei gleichem Exponenten entscheidet der Vorfaktor.</p>' +
      '<h3>4. Rechnen</h3><p>Multipliziere die Vorfaktoren und die Zehnerpotenzen getrennt. Bei Zehnerpotenzen werden die Exponenten <b>addiert</b> (beim Dividieren subtrahiert):</p><p class="big-math">(3 · ' + p10(5) + ') · (4 · ' + p10(3) + ') = 12 · ' + p10(8) + ' = 1,2 · ' + p10(9) + '</p><p>Zum Schluss den Vorfaktor wieder zwischen 1 und 10 bringen: 12 = 1,2 · 10, also steigt der Exponent um 1.</p>' +
      '<p class="note"><b>Taschenrechner:</b> Die Taste heißt meist <b>×10<sup>x</sup></b> oder <b>EE</b>/<b>EXP</b>. 4,5 · ' + p10(7) + ' tippst du als 4,5 ×10<sup>x</sup> 7. Die Anzeige 4.5E7 bedeutet ebenfalls 4,5 · ' + p10(7) + '.</p>',
    entdecken: {
      html: '<p>Wähle einen Vorfaktor und einen Exponenten. Die Zahl wird als Dezimalzahl und auf dem Zahlenstrahl der Größenordnungen gezeigt.</p><div class="ctl"><label>Vorfaktor a <select id="e_a"><option value="1">1</option><option value="2.5">2,5</option><option value="4">4</option><option value="7.5">7,5</option></select></label><label>Exponent n = <b id="v_n"></b> <input type="range" id="r_n" min="-9" max="12" step="1" value="-6"></label></div><p class="big-math" id="e_t"></p><div id="e_g"></div><p id="e_c"></p>',
      init: function (root, done) {
        var n = 0, S = root.querySelector('#e_a'), R = root.querySelector('#r_n');
        function draw() {
          var a = S.value, k = +R.value, d = a.replace('.', ''), lg = Math.log10(parseFloat(a)) + k;
          root.querySelector('#v_n').textContent = ex(k);
          root.querySelector('#e_t').innerHTML = sciH(d, k) + ' m = ' + toDec(d, k) + ' m';
          root.querySelector('#e_g').innerHTML = ruler(lg);
          var near = OBJ.reduce(function (b, o) { return Math.abs(o[1] - lg) < Math.abs(b[1] - lg) ? o : b; });
          root.querySelector('#e_c').innerHTML = 'Das Komma wandert ' + Math.abs(k) + ' Stellen nach ' + (k >= 0 ? 'rechts' : 'links') + '. Größenordnung ungefähr wie: <b>' + near[0] + '</b>. Erhöhst du n um 1, wird die Zahl <b>zehnmal so groß</b>.';
        }
        function ch() { draw(); n++; if (n >= 3) done('Gut beobachtet: Jeder Schritt beim Exponenten verändert die Zahl um den Faktor 10. Der Vorfaktor verändert sie nur innerhalb einer Zehnerstufe.'); }
        S.addEventListener('change', ch); R.addEventListener('input', ch); draw();
      }
    },
    beispiel: { title: 'Wie lange braucht das Sonnenlicht?', q: 'Die Sonne ist etwa 1,5 · 10<sup>8</sup> km von der Erde entfernt. Licht legt in einer Sekunde etwa 3 · 10<sup>5</sup> km zurück. Wie lange ist das Licht unterwegs?',
      steps: ['Ansatz: Zeit = Strecke : Geschwindigkeit = (1,5 · 10<sup>8</sup> km) : (3 · 10<sup>5</sup> km/s).', 'Vorfaktoren dividieren: 1,5 : 3 = 0,5.', 'Zehnerpotenzen dividieren: 10<sup>8</sup> : 10<sup>5</sup> = 10<sup>8 − 5</sup> = 10<sup>3</sup>.', 'Ergebnis: 0,5 · 10<sup>3</sup> s = 500 s. In wissenschaftlicher Schreibweise: 5 · 10<sup>2</sup> s.', 'Antwort: Das Licht braucht etwa 500 Sekunden, das sind gut 8 Minuten. Kontrolle: 500 s · 300 000 km/s = 150 000 000 km ✓.'] },
    tasks: { gen: gen,
      plan: { G: ['inSci:1', 'ausSci:1', 'mal10:1', 'vergleich:1'], S: ['inSci:2', 'klein:2', 'ausSci:2', 'vergleich:2', 'mult:2'], E: ['klein:2', 'ausSci:3', 'ordnen:2', 'mult:3', 'sach:2', 'inSci:3'] },
      extra: 'lichtjahr', test: ['inSci:2', 'klein:2', 'ausSci:2', 'vergleich:2', 'mult:2', 'sach:2'] },
    lerncheck: ['Ich schreibe große und kleine Zahlen als a · 10<sup>n</sup>.', 'Ich wandle Zehnerpotenz-Schreibweise in Dezimalzahlen um.', 'Ich vergleiche und ordne Zahlen in Zehnerpotenz-Schreibweise.', 'Ich rechne mit Zehnerpotenzen in Sachaufgaben.']
  };
})();
