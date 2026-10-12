/* Modul 009 · Vorsilben und Größen (Klasse 9) */
var MODULE = (function () {
  var C1 = '#1e3a8a', CF = '#e8eefc', CA = '#d97706', CH = '#1d4ed8';
  var PRE = { G: ['Giga', 9], M: ['Mega', 6], k: ['Kilo', 3], '': ['', 0], m: ['Milli', -3], 'µ': ['Mikro', -6], n: ['Nano', -9] };
  function ex(n) { return n < 0 ? '−' + (-n) : String(n); }
  function p10(n) { return '10<sup>' + ex(n) + '</sup>'; }
  function man(d) { return parseFloat(d.charAt(0) + '.' + (d.slice(1) || '0')); }
  function val(d, n) { return parseFloat(d.charAt(0) + '.' + (d.slice(1) || '0') + 'e' + n); }
  function manH(d) { return d.length > 1 ? d.charAt(0) + ',' + d.slice(1) : d; }
  function sciH(d, n) { return manH(d) + ' · ' + p10(n); }
  function group(s) { return s.length > 4 ? s.replace(/\B(?=(\d{3})+(?!\d))/g, '\u202f') : s; }
  function gdec(s) { return s.length > 4 ? s.replace(/(\d{3})(?=\d)/g, '$1\u202f') : s; }
  function toDec(d, n) {
    var p = 1 + n;
    if (p <= 0) return '0,' + gdec(new Array(-p + 1).join('0') + d);
    if (p >= d.length) return group(d + new Array(p - d.length + 1).join('0'));
    return group(d.slice(0, p)) + ',' + gdec(d.slice(p));
  }
  function pn(s) { return M.parseNum(String(s).replace(/\s/g, '')); }
  function digits(k) { var s = String(M.rnd(1, 9)); for (var i = 1; i < k; i++) s += (i === k - 1 ? M.rnd(1, 9) : M.rnd(0, 9)); return s; }
  function norm(x) { var e = Math.floor(Math.log10(x) + 1e-12), m = Math.round(x / Math.pow(10, e) * 1e9) / 1e9; if (m >= 10) { m /= 10; e++; } return { d: String(m).replace('.', '').replace(/0+$/, '') || '1', n: e }; }
  function uH(p, b) { return p + b; }
  function numIn(label, v, unit, tol) { var o = { kind: 'num', label: label, answer: v, tol: tol != null ? tol : Math.abs(v) * 1e-9 }; if (unit) o.unit = unit; return o; }
  /* Größenarten mit erlaubten Vorsilben */
  var KIND = {
    m: { name: 'Länge', pre: ['k', '', 'm', 'µ', 'n'] },
    g: { name: 'Masse', pre: ['k', '', 'm', 'µ'] },
    W: { name: 'Leistung', pre: ['G', 'M', 'k', ''] },
    B: { name: 'Datenmenge', pre: ['G', 'M', 'k', ''] },
    s: { name: 'Zeit', pre: ['', 'm', 'µ', 'n'] }
  };

  var gen = {
    praefix: function (lvl) {
      var keys = lvl <= 1 ? ['k', 'M', 'm'] : ['G', 'M', 'k', 'm', 'µ', 'n'], k = M.pick(keys), t = M.rnd(0, 1), e = PRE[k][1];
      var all = ['G', 'M', 'k', 'm', 'µ', 'n'], others = M.shuffle(all.filter(function (x) { return x !== k; })).slice(0, 3);
      var q, opts, ans;
      if (t === 0) {
        q = 'Welche Zehnerpotenz bedeutet die Vorsilbe <b>' + PRE[k][0] + '</b> (Zeichen ' + k + ')?';
        opts = M.shuffle([k].concat(others)); ans = opts.indexOf(k); opts = opts.map(function (x) { return p10(PRE[x][1]) + ' = ' + toDec('1', PRE[x][1]); });
      } else {
        q = 'Welche Vorsilbe steht für den Faktor <b>' + p10(e) + '</b> = ' + toDec('1', e) + '?';
        opts = M.shuffle([k].concat(others)); ans = opts.indexOf(k); opts = opts.map(function (x) { return PRE[x][0] + ' (' + x + ')'; });
      }
      return { skill: 'Vorsilben und Zehnerpotenzen', level: lvl, q: q, inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ans }],
        hints: ['Kilo, Mega, Giga machen größer: jeweils 1000-mal mehr. Milli, Mikro, Nano machen kleiner: jeweils 1000-mal weniger.', 'Kilo = ' + p10(3) + ', Mega = ' + p10(6) + ', Giga = ' + p10(9) + '. Milli = ' + p10(-3) + ', Mikro = ' + p10(-6) + ', Nano = ' + p10(-9) + '.', 'Eselsbrücke: 1 km = 1000 m (Kilo), 1 mm = 0,001 m (Milli).'],
        solution: PRE[k][0] + ' (' + k + ') bedeutet <b>' + p10(e) + '</b> = ' + toDec('1', e) + '.',
        verify: function () { return Math.abs(Math.pow(10, e) - val('1', e)) <= val('1', e) * 1e-9 ? true : 'Vorsilbe'; } };
    },
    umrechnen: function (lvl) {
      var b = M.pick(Object.keys(KIND)), P = KIND[b].pre, i, j, tries = 0;
      do { i = M.rnd(0, P.length - 1); j = M.rnd(0, P.length - 1); tries++; } while ((i === j || Math.abs(i - j) > (lvl <= 1 ? 1 : 2)) && tries < 100);
      if (i === j) return gen.umrechnen(lvl);
      var from = P[i], to = P[j], diff = PRE[from][1] - PRE[to][1];
      var d = digits(lvl <= 1 ? M.rnd(1, 2) : M.rnd(2, 3)), e;
      if (diff > 0) e = M.rnd(0, lvl >= 3 ? 1 : 2) - (lvl >= 3 ? 1 : 0); else e = M.rnd(d.length - 1, lvl <= 1 ? 4 : 5);
      if (lvl <= 1 && diff < 0) e = Math.max(e, 3);
      var r = e + diff; if (r < -5 || r > 11) return gen.umrechnen(lvl);
      var v = val(d, r), shown = toDec(d, e), ans = toDec(d, r), f = Math.abs(diff);
      var info = b === 'B' ? '<br><small>Hinweis: Wir rechnen mit den Vorsilben aus dem Zehnersystem: 1 GB = 1000 MB, 1 MB = 1000 kB.</small>' : '';
      return { skill: 'Einheiten mit Vorsilben umrechnen', level: lvl, q: 'Rechne um. <span class="big-math">' + shown + ' ' + uH(from, b) + ' = ? ' + uH(to, b) + '</span>' + info,
        inputs: [numIn('Ergebnis', v, uH(to, b))],
        hints: ['1 ' + uH(diff > 0 ? from : to, b) + ' = ' + toDec('1', f) + ' ' + uH(diff > 0 ? to : from, b) + '.', diff > 0 ? 'Du gehst zu einer <b>kleineren</b> Einheit. Dann brauchst du <b>mehr</b> davon: mal ' + toDec('1', f) + '.' : 'Du gehst zu einer <b>größeren</b> Einheit. Dann brauchst du <b>weniger</b> davon: geteilt durch ' + toDec('1', f) + '.', 'Das Komma wandert ' + f + ' Stellen nach ' + (diff > 0 ? 'rechts' : 'links') + '.'],
        solution: '1 ' + uH(diff > 0 ? from : to, b) + ' = ' + toDec('1', f) + ' ' + uH(diff > 0 ? to : from, b) + '. Also ' + shown + ' ' + uH(from, b) + (diff > 0 ? ' · ' : ' : ') + toDec('1', f) + ' = <b>' + ans + ' ' + uH(to, b) + '</b>.',
        mistakes: function (x) { var y = pn(x[0]); if (y === null) return null; var w = val(d, e - diff); if (Math.abs(y - w) <= w * 1e-6) return 'Du hast in die falsche Richtung gerechnet. ' + (diff > 0 ? 'Kleinere Einheit, also größere Maßzahl.' : 'Größere Einheit, also kleinere Maßzahl.'); var c = (diff > 0 ? 1 : -1) * (f === 3 ? 1 : 3); if (Math.abs(y - val(d, e + diff - c)) <= Math.abs(v) * 1e-3 && f !== 3) return 'Zwischen ' + uH(from, b) + ' und ' + uH(to, b) + ' liegen zwei Vorsilben-Stufen. Das ist der Faktor ' + toDec('1', f) + '.'; if (Math.abs(y - val(d, e + (diff > 0 ? 1 : -1))) <= Math.abs(v) * 1e-6 || Math.abs(y - val(d, e + (diff > 0 ? 2 : -2))) <= Math.abs(v) * 1e-6) return 'Bei diesen Vorsilben ist jede Stufe der Faktor 1000, nicht 10 oder 100.'; return null; },
        verify: function () { var a = pn(shown) * Math.pow(10, PRE[from][1]), c = pn(ans) * Math.pow(10, PRE[to][1]); return Math.abs(a - c) <= Math.abs(a) * 1e-9 ? true : 'Umrechnung'; } };
    },
    inSI: function (lvl) {
      var b = M.pick(['m', 'g', 'W', 'B', 's']), P = KIND[b].pre.filter(function (x) { return x !== ''; }), p = M.pick(P);
      if (lvl <= 1 && (p === 'n' || p === 'G')) p = M.pick(['k', 'm']);
      var d = digits(M.rnd(1, 2)), e = M.rnd(0, 1); /* Maßzahl d·10^e, also 1 bis 99 */
      var r = { d: d, n: e + PRE[p][1] }, shown = toDec(d, e);
      return { skill: 'Größen als Zehnerpotenz der Grundeinheit', level: lvl, q: 'Gib in der Grundeinheit <b>' + b + '</b> in wissenschaftlicher Schreibweise an (1 ≤ a &lt; 10). <span class="big-math">' + shown + ' ' + p + b + ' = □ · 10<sup>□</sup> ' + b + '</span>',
        inputs: [{ kind: 'num', label: 'Vorfaktor a =', answer: man(r.d) }, { kind: 'num', label: 'Exponent n =', answer: r.n, placeholder: 'z. B. −6' }],
        hints: ['Ersetze die Vorsilbe durch ihre Zehnerpotenz: ' + PRE[p][0] + ' (' + p + ') = ' + p10(PRE[p][1]) + '.', shown + ' ' + p + b + ' = ' + shown + ' · ' + p10(PRE[p][1]) + ' ' + b + '.', e ? 'Schreibe noch ' + shown + ' = ' + manH(d) + ' · 10 und addiere die Exponenten: ' + ex(PRE[p][1]) + ' + 1 = ' + ex(r.n) + '.' : 'Der Vorfaktor ' + shown + ' liegt schon zwischen 1 und 10.'],
        solution: shown + ' ' + p + b + ' = ' + shown + ' · ' + p10(PRE[p][1]) + ' ' + b + (e ? ' = ' + manH(d) + ' · 10 · ' + p10(PRE[p][1]) + ' ' + b : '') + ' = <b>' + sciH(r.d, r.n) + ' ' + b + '</b>',
        mistakes: function (x) { var a = pn(x[0]), k = pn(x[1]); if (a === null || k === null) return null; if (Math.abs(a - man(d)) < 1e-9 && k === -r.n) return 'Achte auf das Vorzeichen: ' + (PRE[p][1] < 0 ? PRE[p][0] + ' macht kleiner, der Exponent ist negativ.' : PRE[p][0] + ' macht größer, der Exponent ist positiv.'); if (a >= 10) return 'Der Vorfaktor muss kleiner als 10 sein.'; return null; },
        verify: function () { return Math.abs(pn(shown) * Math.pow(10, PRE[p][1]) - val(r.d, r.n)) <= val(r.d, r.n) * 1e-9 ? true : 'SI'; } };
    },
    groesse: function (lvl) {
      var L = [
        ['Speicherplatz eines Smartphones', '128 GB', ['128 kB', '128 MB', '128 B']],
        ['Dateigröße eines Handyfotos', '4 MB', ['4 GB', '4 kB', '4 B']],
        ['Dicke eines menschlichen Haares', '70 µm', ['70 mm', '70 nm', '70 km']],
        ['Wirkstoff in einer Schmerztablette', '400 mg', ['400 g', '400 µg', '400 kg']],
        ['Leistung eines Föhns', '2 kW', ['2 MW', '2 GW', '2 mW']],
        ['Leistung eines großen Kraftwerks', '1,4 GW', ['1,4 kW', '1,4 W', '1,4 mW']],
        ['Größe eines Virus', '100 nm', ['100 mm', '100 µm', '100 m']],
        ['Länge eines Marathonlaufs', '42 km', ['42 mm', '42 Mm', '42 m']],
        ['Leistung eines Windrads', '4 MW', ['4 kW', '4 GW', '4 W']],
        ['Masse eines Schulbuchs', '1 kg', ['1 mg', '1 µg', '1 Mg']]];
      var it = M.pick(lvl <= 1 ? L.filter(function (x, i) { return [0, 1, 3, 4, 7, 9].indexOf(i) >= 0; }) : L);
      var opts = M.shuffle([it[1]].concat(it[2])), ans = opts.indexOf(it[1]);
      return { skill: 'Größen sinnvoll einschätzen', level: lvl, q: 'Welche Angabe passt am besten? <b>' + it[0] + '</b>', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts, answer: ans }],
        hints: ['Stell dir die Größe in einer bekannten Einheit vor (m, g, W oder Byte).', 'Jede Vorsilbe-Stufe ist der Faktor 1000. Ein falsches Zeichen macht den Wert 1000-mal (oder millionenfach) zu groß oder zu klein.', 'Rechne die Möglichkeiten in die Grundeinheit um und vergleiche mit deinem Alltagswissen.'],
        solution: 'Passend ist <b>' + it[1] + '</b>.',
        verify: function () { return opts.length === 4 && opts[ans] === it[1] ? true : 'MC'; } };
    },
    vergleich: function (lvl) {
      var b = M.pick(['m', 'g', 'B']), P = KIND[b].pre, big = Math.random() < 0.5;
      var base = { m: -4, g: -2, B: 7 }[b] + M.rnd(-1, 1), items = [], used = {};
      while (items.length < 4) {
        var d = digits(2), n = base + M.rnd(0, 1), v = val(d, n);
        var cands = P.filter(function (p) { var m = n - PRE[p][1]; return m >= -4 && m <= 5; }); if (!cands.length) continue;
        var p = M.pick(cands), key = d + ':' + n; if (used[key]) continue; used[key] = 1;
        items.push({ v: v, h: toDec(d, n - PRE[p][1]) + ' ' + p + b });
      }
      var vals = items.map(function (o) { return o.v; }), tv = big ? Math.max.apply(null, vals) : Math.min.apply(null, vals);
      if (vals.filter(function (x) { return Math.abs(x - tv) < tv * 1e-9; }).length !== 1) return gen.vergleich(lvl);
      var hs = items.map(function (o) { return o.h; }); if (new Set(hs.map(function (s) { return s.replace(/\s/g, ''); })).size !== 4) return gen.vergleich(lvl);
      var ans = vals.indexOf(tv), unitB = { m: 'mm', g: 'g', B: 'MB' }[b], f = { m: 1e-3, g: 1, B: 1e6 }[b];
      function inB(o) { return M.fmtNum(Math.round(o.v / f * 1e6) / 1e6) + ' ' + unitB; }
      return { skill: 'Größen mit Vorsilben vergleichen', level: lvl, q: 'Welche Angabe ist am <b>' + (big ? 'größten' : 'kleinsten') + '</b>?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: hs, answer: ans }],
        hints: ['Rechne alle Angaben in dieselbe Einheit um, zum Beispiel in ' + unitB + '.', 'Achte auf die Vorsilben: ' + hs.map(function (h) { return h.replace(/^.* /, ''); }).filter(function (x, i, a) { return a.indexOf(x) === i; }).join(', ') + '.', 'In ' + unitB + ': ' + items.map(inB).join('; ') + '.'],
        solution: 'In ' + unitB + ': ' + items.map(function (o) { return o.h + ' = ' + inB(o); }).join(', ') + '. Am ' + (big ? 'größten' : 'kleinsten') + ' ist <b>' + hs[ans] + '</b>.',
        verify: function () { var s = items.slice().sort(function (a, c) { return a.v - c.v; }); return (big ? s[3] : s[0]).h === hs[ans] ? true : 'Vergleich'; } };
    },
    speicher: function (lvl) {
      var C = M.pick([16, 32, 64, 128]);
      if (lvl >= 3) {
        var f = M.pick([1.5, 2.5, 3.5, 4.5]), u = M.rnd(3, 12), free = C - u, n = Math.floor(free / f + 1e-9);
        if (Math.abs(free / f - Math.round(free / f)) < 1e-9) return gen.speicher(lvl);
        return { skill: 'Speicherplatz berechnen', level: lvl, q: 'Ein Tablet hat <b>' + C + ' GB</b> Speicher. Davon sind schon <b>' + u + ' GB</b> belegt. Wie viele Filme mit je <b>' + M.fmtNum(f) + ' GB</b> kann Mia noch herunterladen?', inputs: [numIn('Anzahl Filme', n, '', 0)],
          hints: ['Freier Speicher: ' + C + ' GB − ' + u + ' GB = ' + free + ' GB.', free + ' : ' + M.fmtNum(f) + ' = ' + M.fmtNum(Math.round(free / f * 100) / 100) + '.', 'Es passen nur ganze Filme drauf. Runde deshalb ab, auch wenn die Nachkommastelle groß ist.'],
          solution: 'Frei: ' + C + ' GB − ' + u + ' GB = ' + free + ' GB. ' + free + ' GB : ' + M.fmtNum(f) + ' GB ≈ ' + M.fmtNum(Math.round(free / f * 100) / 100) + '. Es passen <b>' + n + ' Filme</b> darauf (abrunden, ein halber Film nützt nichts).',
          mistakes: function (x) { var y = pn(x[0]); if (y === n + 1) return 'Aufgerundet? Der letzte Film passt nicht mehr ganz auf den Speicher. Hier musst du abrunden.'; if (y === Math.floor(C / f)) return 'Denk an den schon belegten Speicher: Es sind nur ' + free + ' GB frei.'; return null; },
          verify: function () { return n * f <= free + 1e-9 && (n + 1) * f > free ? true : 'Filme'; } };
      }
      var o = M.pick([['Fotos', 'ein Foto', [2, 2.5, 4, 5, 8], 'eine Speicherkarte'], ['Songs', 'ein Song', [4, 5, 8], 'eine Speicherkarte'], ['Hörbuch-Kapitel', 'ein Kapitel', [20, 25, 40, 50], 'einen USB-Stick']]);
      var p = M.pick(o[2]), cnt = C * 1000 / p;
      return { skill: 'Speicherplatz berechnen', level: lvl, q: 'Auf ' + o[3] + ' passen <b>' + C + ' GB</b>. ' + o[1].charAt(0).toUpperCase() + o[1].slice(1) + ' braucht <b>' + M.fmtNum(p) + ' MB</b>. Wie viele ' + o[0] + ' passen darauf?<br><small>Rechne mit 1 GB = 1000 MB.</small>', inputs: [numIn('Anzahl', cnt, '', 0)],
        hints: ['Rechne zuerst beide Angaben in dieselbe Einheit um.', C + ' GB = ' + C * 1000 + ' MB.', 'Teile: ' + group(String(C * 1000)) + ' MB : ' + M.fmtNum(p) + ' MB.'],
        solution: C + ' GB = ' + group(String(C * 1000)) + ' MB. ' + group(String(C * 1000)) + ' : ' + M.fmtNum(p) + ' = <b>' + group(String(cnt)) + '</b> ' + o[0] + '.',
        mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - C / p) < 1e-6) return 'Du hast GB und MB nicht umgerechnet. 1 GB = 1000 MB.'; if (y !== null && Math.abs(y - C * 1024 / p) < 1e-6) return 'Hier rechnen wir mit 1 GB = 1000 MB (Zehnersystem), nicht mit 1024.'; return null; },
        verify: function () { return Math.abs(cnt * p * 1e6 - C * 1e9) < 1e-3 && cnt === Math.round(cnt) ? true : 'Speicher'; } };
    },
    leistung: function (lvl) {
      if (lvl <= 1) {
        var P = M.pick([4, 6, 8, 10, 12]), w = M.pick([400, 500]), n = P * 1000 / w;
        if (n !== Math.round(n)) return gen.leistung(lvl);
        return { skill: 'Leistung mit Vorsilben', level: lvl, q: 'Eine Solaranlage auf einem Hausdach soll <b>' + P + ' kW</b> Leistung haben. Ein Solarmodul liefert höchstens <b>' + w + ' W</b>. Wie viele Module braucht man?', inputs: [numIn('Anzahl Module', n, '', 0)],
          hints: ['1 kW = 1000 W.', P + ' kW = ' + group(String(P * 1000)) + ' W.', group(String(P * 1000)) + ' W : ' + w + ' W.'],
          solution: P + ' kW = ' + group(String(P * 1000)) + ' W. ' + group(String(P * 1000)) + ' : ' + w + ' = <b>' + n + ' Module</b>.',
          mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - P / w) < 1e-6) return 'Rechne zuerst kW in W um.'; return null; },
          verify: function () { return n * w === P * 1000 ? true : 'Solar'; } };
      }
      var G = M.pick([1, 1.2, 1.4, 1.6]), m = M.pick([2, 2.5, 4, 5]), k = G * 1000 / m;
      if (Math.abs(k - Math.round(k)) > 1e-9) return gen.leistung(lvl); k = Math.round(k);
      return { skill: 'Leistung mit Vorsilben', level: lvl, q: 'Ein großes Kraftwerk hat eine Leistung von <b>' + M.fmtNum(G) + ' GW</b>. Ein modernes Windrad leistet bei gutem Wind <b>' + M.fmtNum(m) + ' MW</b>. Wie viele solche Windräder bräuchte man, um die gleiche Leistung zu erreichen?', inputs: [numIn('Anzahl Windräder', k, '', 0)],
        hints: ['1 GW = 1000 MW.', M.fmtNum(G) + ' GW = ' + group(String(G * 1000)) + ' MW.', group(String(G * 1000)) + ' MW : ' + M.fmtNum(m) + ' MW.'],
        solution: M.fmtNum(G) + ' GW = ' + group(String(Math.round(G * 1000))) + ' MW. ' + group(String(Math.round(G * 1000))) + ' : ' + M.fmtNum(m) + ' = <b>' + k + ' Windräder</b>. (In Wirklichkeit braucht man mehr, weil der Wind nicht immer weht.)',
        mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - G / m) < 1e-6) return 'Rechne zuerst GW in MW um: 1 GW = 1000 MW.'; if (y !== null && Math.abs(y - k * 1000) < 1e-6) return 'Zwischen GW und MW liegt der Faktor 1000, nicht 1 000 000.'; return null; },
        verify: function () { return Math.abs(k * m * 1e6 - G * 1e9) < 1e-3 ? true : 'Wind'; } };
    },
    sach: function (lvl) {
      var t = M.rnd(0, 2);
      if (t === 0) {
        var mg = M.pick([200, 250, 400, 500]), n = M.pick([10, 20, 30, 50]), g = mg * n / 1000;
        return { skill: 'Sachaufgabe: Milligramm', level: lvl, q: 'Eine Tablette enthält <b>' + mg + ' mg</b> Wirkstoff. In einer Packung sind <b>' + n + ' Tabletten</b>. Wie viel Gramm Wirkstoff sind in der ganzen Packung?', inputs: [numIn('Wirkstoff', g, 'g')],
          hints: ['Rechne zuerst die gesamte Menge in mg: ' + mg + ' mg · ' + n + '.', mg + ' · ' + n + ' = ' + group(String(mg * n)) + ' mg.', '1 g = 1000 mg. Teile durch 1000.'],
          solution: mg + ' mg · ' + n + ' = ' + group(String(mg * n)) + ' mg = <b>' + M.fmtNum(g) + ' g</b>.',
          mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - mg * n) < 1e-6) return 'Das ist die Menge in mg. Gefragt ist Gramm: durch 1000 teilen.'; return null; },
          verify: function () { return Math.abs(g * 1e3 - mg * n) < 1e-9 ? true : 'mg'; } };
      }
      if (t === 1) {
        var ug = M.pick([10, 20, 25, 50]), days = M.pick([30, 100, 365]), tot = ug * days;
        return { skill: 'Sachaufgabe: Mikrogramm', level: lvl, q: 'Für Vitamin D wird eine Menge von <b>' + ug + ' µg</b> pro Tag empfohlen. Wie viel Milligramm sind das in <b>' + days + ' Tagen</b>?', inputs: [numIn('Menge', tot / 1000, 'mg')],
          hints: ['Gesamtmenge in µg: ' + ug + ' µg · ' + days + '.', ug + ' · ' + days + ' = ' + group(String(tot)) + ' µg.', '1 mg = 1000 µg. Teile durch 1000.'],
          solution: ug + ' µg · ' + days + ' = ' + group(String(tot)) + ' µg = <b>' + M.fmtNum(tot / 1000) + ' mg</b>.',
          mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - tot / 1e6) < 1e-9) return 'Von µg zu mg ist es nur eine Stufe, also Faktor 1000.'; if (y !== null && Math.abs(y - tot) < 1e-6) return 'Das ist die Menge in µg. Teile noch durch 1000.'; return null; },
          verify: function () { return Math.abs(tot / 1000 * 1e-3 - ug * 1e-6 * days) < 1e-12 ? true : 'µg'; } };
      }
      var sp = M.pick([0.3, 0.4, 0.5]), dd = M.pick([10, 30, 60]), um = Math.round(sp * dd * 1000);
      return { skill: 'Sachaufgabe: Mikrometer', level: lvl, q: 'Kopfhaare wachsen etwa <b>' + M.fmtNum(sp) + ' mm</b> pro Tag. Wie viele Mikrometer (µm) wächst ein Haar in <b>' + dd + ' Tagen</b>?', inputs: [numIn('Wachstum', um, 'µm')],
        hints: ['Rechne zuerst in mm: ' + M.fmtNum(sp) + ' mm · ' + dd + '.', M.fmtNum(sp) + ' · ' + dd + ' = ' + M.fmtNum(sp * dd) + ' mm.', '1 mm = 1000 µm. Multipliziere mit 1000.'],
        solution: M.fmtNum(sp) + ' mm · ' + dd + ' = ' + M.fmtNum(sp * dd) + ' mm = <b>' + group(String(um)) + ' µm</b>.',
        mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - sp * dd) < 1e-6) return 'Das ist das Ergebnis in mm. Rechne noch in µm um: mal 1000.'; return null; },
        verify: function () { return Math.abs(um * 1e-6 - sp * 1e-3 * dd) < 1e-12 ? true : 'Haar'; } };
    },
    download: function () {
      var f = M.pick([2, 5, 8, 12, 25, 50]), s = M.pick([50, 100, 250]), sec = f * 1000 * 8 / s;
      if (sec !== Math.round(sec)) return gen.download();
      var min = Math.round(sec / 60 * 10) / 10;
      return { skill: 'Download-Zeit (Bit und Byte)', level: 3, q: 'Ein Spiel ist <b>' + f + ' GB</b> groß. Der Internetanschluss schafft <b>' + s + ' Mbit/s</b> (Megabit pro Sekunde). Beachte: 1 Byte = 8 Bit.<br>a) Wie viele Sekunden dauert der Download mindestens?<br>b) Wie viele Minuten sind das? Runde auf eine Nachkommastelle.',
        inputs: [numIn('a) Zeit', sec, 's', 0), numIn('b) Zeit', min, 'min', 0.05)],
        hints: ['Rechne die Dateigröße in Megabit um: ' + f + ' GB = ' + group(String(f * 1000)) + ' MB, und 1 MB = 8 Mbit.', f + ' GB = ' + group(String(f * 1000)) + ' MB = ' + group(String(f * 8000)) + ' Mbit.', 'Zeit = ' + group(String(f * 8000)) + ' Mbit : ' + s + ' Mbit/s. Für b) teilst du durch 60.'],
        solution: f + ' GB = ' + group(String(f * 1000)) + ' MB = ' + group(String(f * 8000)) + ' Mbit.<br>a) ' + group(String(f * 8000)) + ' Mbit : ' + s + ' Mbit/s = <b>' + group(String(sec)) + ' s</b>.<br>b) ' + group(String(sec)) + ' s : 60 ≈ <b>' + M.fmtNum(min) + ' min</b>.',
        mistakes: function (x) { var y = pn(x[0]); if (y !== null && Math.abs(y - sec / 8) < 1e-6) return 'Du hast Byte und Bit verwechselt. Die Leitung misst in <b>Bit</b>, die Datei in <b>Byte</b>: mal 8.'; if (y !== null && Math.abs(y - f * 8 / s) < 1e-6) return 'Rechne GB zuerst in MB um: 1 GB = 1000 MB.'; return null; },
        verify: function () { return Math.abs(sec * s * 1e6 - f * 1e9 * 8) < 1 && Math.abs(min - sec / 60) <= 0.05 ? true : 'Download'; } };
    }
  };

  var ORDER = ['n', 'µ', 'm', '', 'k', 'M', 'G'];
  function stairs(idx, b) {
    var g = '<svg class="viz" viewBox="0 0 340 170" role="img" aria-label="Treppe der Vorsilben" style="max-width:480px">';
    ORDER.forEach(function (p, i) {
      var x = 10 + i * 46, y = 118 - i * 15, on = i === idx;
      g += '<rect x="' + x + '' + '" y="' + y + '" width="44" height="' + (150 - y) + '" fill="' + (on ? CA : CF) + '" stroke="' + C1 + '" stroke-width="1.5"/>';
      g += '<text x="' + (x + 22) + '" y="' + (y + 16) + '" font-size="13" font-weight="700" text-anchor="middle" fill="' + (on ? '#fff' : C1) + '">' + p + b + '</text>';
      g += '<text x="' + (x + 22) + '" y="' + (y - 5) + '" font-size="9" text-anchor="middle" fill="#1c1830">10<tspan dy="-4" font-size="7">' + ex(PRE[p][1]) + '</tspan></text>';
    });
    g += '<text x="10" y="166" font-size="10" fill="#5a5670">Jede Stufe nach oben: Faktor 1000</text></svg>';
    return g;
  }

  return {
    id: '009', title: 'Vorsilben und Größen', bereich: 'Zahlen und Größen', minutes: '45 bis 60',
    vorkenntnisse: 'Zehnerpotenzen, Einheiten umrechnen (m, g, km, kg)',
    lead: 'Gigabyte, Megawatt, Mikrometer: Vorsilben stecken überall. Du lernst, was sie bedeuten, und rechnest sicher zwischen ihnen um.',
    einstieg: { html: '<p>Lukas will ein neues Handy. Im Prospekt steht: <b>128 GB</b> Speicher, Kamera mit <b>50 Megapixeln</b>, Ladegerät mit <b>25 W</b>, Prozessor-Strukturen von nur <b>4 nm</b>.</p><p class="note">Was bedeuten G, Mega und n? Wie viele Fotos mit je 4 MB passen auf 128 GB?</p><p>Die Vorsilben <b>Giga, Mega, Kilo, Milli, Mikro und Nano</b> sind Abkürzungen für Zehnerpotenzen. Mit ihnen schreibt man große und kleine Größen kurz auf. In diesem Modul lernst du, wie man mit ihnen rechnet.</p>' },
    ziele: ['Ich kenne die Vorsilben Giga, Mega, Kilo, Milli, Mikro und Nano mit ihren Zehnerpotenzen.', 'Ich rechne Größen mit Vorsilben in andere Einheiten um.', 'Ich schreibe Größen als Zehnerpotenz der Grundeinheit.', 'Ich vergleiche Größen mit verschiedenen Vorsilben.', 'Ich löse Sachaufgaben zu Datenmengen, Leistung, Masse und Länge.'],
    fachwoerter: [['Vorsilbe (Präfix)', 'Ein Wortteil vor der Einheit, der eine Zehnerpotenz bedeutet. Kilo heißt 1000.'], ['Grundeinheit', 'Die Einheit ohne Vorsilbe, zum Beispiel Meter (m), Gramm (g), Watt (W), Byte (B).'], ['Byte und Bit', 'Datenmengen misst man in Byte (B). 1 Byte = 8 Bit. Internetgeschwindigkeit wird in Bit pro Sekunde angegeben.'], ['Watt (W)', 'Einheit der Leistung. Ein Föhn hat etwa 2 kW, ein Kraftwerk über 1 GW.']],
    diagnose: [
      { q: 'Wie viele Meter sind 1 km?', options: ['1000 m', '100 m', '10 000 m', 'Weiß ich noch nicht'], answer: 0, why: 'Kilo bedeutet 1000: 1 km = 1000 m.', review: 'Längeneinheiten umrechnen' },
      { q: 'Wie viel sind 2,5 kg in Gramm?', options: ['2500 g', '250 g', '25 g', 'Weiß ich noch nicht'], answer: 0, why: '2,5 · 1000 = 2500.', review: 'Masseeinheiten umrechnen' },
      { q: 'Welche Zahl ist ' + p10(6) + '?', options: ['1 000 000', '60', '100 000', 'Weiß ich noch nicht'], answer: 0, why: 'Eine 1 mit 6 Nullen.', review: 'Zehnerpotenzen' },
      { q: 'Was ergibt 4700 : 1000?', options: ['4,7', '47', '0,47', 'Weiß ich noch nicht'], answer: 0, why: 'Durch 1000: Komma 3 Stellen nach links.', review: 'Durch Stufenzahlen dividieren' }],
    erklaerung:
      '<h3>1. Vorsilben sind Zehnerpotenzen</h3><table class="tab"><tr><th>Vorsilbe</th><th>Faktor</th><th>Beispiel</th></tr>' +
      [['G', '1 GB = 1000 MB'], ['M', '1 MW = 1000 kW'], ['k', '1 km = 1000 m'], ['m', '1 mg = 0,001 g'], ['µ', '1 mm = 1000 µm'], ['n', '1 µs = 1000 ns']].map(function (r) { return '<tr><td>' + PRE[r[0]][0] + ' (' + r[0] + ')</td><td>' + p10(PRE[r[0]][1]) + '</td><td style="white-space:nowrap">' + r[1] + '</td></tr>'; }).join('') + '</table>' +
      '<div class="merk"><b>Merke:</b> Von einer Vorsilbe zur nächsten ist es immer der <b>Faktor 1000</b>: Nano → Mikro → Milli → (Grundeinheit) → Kilo → Mega → Giga.<br>Zur <b>kleineren</b> Einheit: Maßzahl wird größer (mal 1000). Zur <b>größeren</b> Einheit: Maßzahl wird kleiner (durch 1000).</div>' +
      '<p>Beispiele: 3,5 GB = 3500 MB. 4700 µm = 4,7 mm. 0,8 MW = 800 kW.</p>' +
      '<h3>2. Größen als Zehnerpotenz</h3><p>Ersetze die Vorsilbe durch ihre Zehnerpotenz: 7 µm = 7 · ' + p10(-6) + ' m. 25 GW = 25 · ' + p10(9) + ' W = 2,5 · ' + p10(10) + ' W.</p>' +
      '<h3>3. Datenmengen</h3><p>Speicher wird in Byte (B) angegeben. Im Zehnersystem gilt 1 kB = 1000 B, 1 MB = 1000 kB, 1 GB = 1000 MB. Damit rechnen wir in diesem Modul.</p>' +
      '<p class="note"><b>Hinweis:</b> Manche Computer rechnen intern mit 1024 statt 1000 (dann heißt es eigentlich KiB, MiB, GiB). Deshalb zeigt dein Rechner bei einem 128-GB-Stick oft nur etwa 119 „GB“ an. Und Achtung: Internetgeschwindigkeiten stehen in <b>Bit</b> pro Sekunde. 1 Byte = 8 Bit.</p>' +
      '<h3>4. Sachaufgaben</h3><p>Rechne vor dem Teilen oder Vergleichen alle Größen in <b>dieselbe Einheit</b> um. Beispiel: Wie viele Fotos mit 4 MB passen auf 128 GB? 128 GB = 128 000 MB, und 128 000 : 4 = 32 000 Fotos.</p>',
    entdecken: {
      html: '<p>Wähle eine Größe und schiebe die Vorsilbe auf der Treppe nach oben. Der Wert 2,5 wird in alle Nachbareinheiten umgerechnet.</p><div class="ctl"><label>Größe <select id="e_b"><option value="m">Länge (m)</option><option value="g">Masse (g)</option><option value="B">Daten (B)</option><option value="W">Leistung (W)</option></select></label><label>Vorsilbe <b id="v_p"></b> <input type="range" id="r_p" min="0" max="6" step="1" value="1"></label></div><div id="e_g"></div><p class="big-math" id="e_t"></p><p id="e_c"></p>',
      init: function (root, done) {
        var n = 0, S = root.querySelector('#e_b'), R = root.querySelector('#r_p');
        function draw() {
          var b = S.value, i = +R.value, p = ORDER[i], e = PRE[p][1];
          root.querySelector('#v_p').textContent = p ? PRE[p][0] + ' (' + p + ')' : 'keine';
          root.querySelector('#e_g').innerHTML = stairs(i, b);
          var parts = [];
          if (i > 0) parts.push(toDec('25', 3) + ' ' + ORDER[i - 1] + b);
          if (i < 6) parts.push(toDec('25', -3) + ' ' + ORDER[i + 1] + b);
          root.querySelector('#e_t').innerHTML = '2,5 ' + p + b + ' = ' + parts.join(' = ');
          root.querySelector('#e_c').innerHTML = 'In der Grundeinheit: 2,5 ' + p + b + ' = 2,5 · ' + p10(e) + ' ' + b + (e >= -9 && e <= 9 ? ' = ' + toDec('25', e) + ' ' + b : '') + '.';
        }
        function ch() { draw(); n++; if (n >= 3) done('Gut beobachtet: Eine Stufe nach unten heißt mal 1000, eine Stufe nach oben durch 1000. Die Vorsilben funktionieren bei allen Größen gleich.'); }
        S.addEventListener('change', ch); R.addEventListener('input', ch); draw();
      }
    },
    beispiel: { title: 'Fotos auf der Speicherkarte', q: 'Lukas’ Handy hat noch 3,2 GB frei. Ein Foto braucht etwa 4 MB, ein Video von einer Minute 120 MB. Er will 2 Minuten filmen. Wie viele Fotos passen danach noch auf das Handy?',
      steps: ['Einheiten angleichen: 3,2 GB = 3,2 · 1000 MB = 3200 MB.', 'Video: 2 · 120 MB = 240 MB.', 'Rest: 3200 MB − 240 MB = 2960 MB.', 'Fotos: 2960 MB : 4 MB = 740.', 'Antwort: Es passen noch 740 Fotos darauf. Kontrolle: 740 · 4 MB + 240 MB = 3200 MB = 3,2 GB ✓.'] },
    tasks: { gen: gen,
      plan: { G: ['praefix:1', 'umrechnen:1', 'groesse:1', 'speicher:1'], S: ['praefix:2', 'umrechnen:2', 'inSI:2', 'speicher:2', 'vergleich:2'], E: ['umrechnen:3', 'inSI:2', 'vergleich:2', 'leistung:2', 'speicher:3', 'sach:2'] },
      extra: 'download', test: ['praefix:2', 'umrechnen:2', 'inSI:2', 'vergleich:2', 'speicher:2', 'leistung:2'] },
    lerncheck: ['Ich kenne die Vorsilben von Nano bis Giga.', 'Ich rechne Größen mit Vorsilben sicher um.', 'Ich vergleiche Größen mit verschiedenen Vorsilben.', 'Ich löse Sachaufgaben mit Datenmengen und Leistung.']
  };
})();
