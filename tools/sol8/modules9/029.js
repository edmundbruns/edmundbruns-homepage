/* Modul 029 (Klasse 9) · Zählen mit dem Baumdiagramm */
var MODULE = (function () {
  function n(x) { return M.fmtNum(x); }
  function f1(x) { return Math.round(x * 10) / 10; }
  /* ---------- Zähl-Baumdiagramm ----------
     kids(path) liefert die Beschriftungen der Äste nach dem bisherigen Pfad; depth = Anzahl Stufen
     o: res(path) Text am Pfadende, hl(path) markiert Pfad, heads [Stufennamen], label */
  function ctree(kids, depth, o) {
    o = o || {};
    var leaves = []; (function walk(p) { if (p.length === depth) { leaves.push(p); return; } kids(p).forEach(function (k) { walk(p.concat([k])); }); })([]);
    var L = leaves.length, LH = L > 18 ? 17 : L > 10 ? 24 : 26, fs = L > 18 ? 10 : 12, top = o.heads ? 26 : 10;
    var maxLab = 1; leaves.forEach(function (p) { p.forEach(function (k) { maxLab = Math.max(maxLab, String(k).length); }); });
    var bh = Math.min(fs * 1.7, LH - 4), nw = Math.round(maxLab * fs * 0.62 + 12), cw = Math.max(64, nw + 30), X0 = 10;
    var resW = o.res ? Math.max.apply(null, leaves.map(function (p) { return String(o.res(p)).length; })) * fs * 0.6 + 16 : 6;
    var W = Math.round(X0 + depth * cw + nw / 2 + resW + 6), H = Math.round(top + L * LH + 8);
    function X(l) { return X0 + l * cw; }
    var edges = '', nodes = '', idx = 0;
    function place(p) {
      if (p.length === depth) { var y = top + idx * LH + LH / 2; idx++; return y; }
      var ys = kids(p).map(function (k) { var c = p.concat([k]), yc = place(c), on = o.hl && leaves.some(function (q) { return q.slice(0, c.length).join('|') === c.join('|') && o.hl(q); });
        child.push([c, yc, on]); return yc; });
      return (ys[0] + ys[ys.length - 1]) / 2;
    }
    var child = [], y0 = place([]);
    var ymap = {}; ymap[''] = y0; child.forEach(function (c) { ymap[c[0].join('|')] = c[1]; });
    child.forEach(function (c) {
      var p = c[0], l = p.length, py = ymap[p.slice(0, -1).join('|')], px = l === 1 ? X0 : X(l - 1) + nw / 2, x = X(l) - nw / 2;
      edges += '<line x1="' + f1(px) + '" y1="' + f1(py) + '" x2="' + f1(x) + '" y2="' + f1(c[1]) + '" stroke="' + (c[2] ? '#d97706' : '#1e3a8a') + '" stroke-width="' + (c[2] ? 3 : 1.5) + '"/>';
      nodes += '<rect x="' + f1(X(l) - nw / 2) + '" y="' + f1(c[1] - bh / 2) + '" width="' + nw + '" height="' + f1(bh) + '" rx="5" fill="' + (c[2] ? '#fde68a' : '#e8eefc') + '" stroke="#1e3a8a" stroke-width="1.2"/><text x="' + X(l) + '" y="' + f1(c[1] + fs * 0.38) + '" font-size="' + fs + '" font-weight="700" text-anchor="middle" fill="#1c1830">' + p[l - 1] + '</text>';
      if (l === depth && o.res) nodes += '<text x="' + f1(X(l) + nw / 2 + 8) + '" y="' + f1(c[1] + fs * 0.38) + '" font-size="' + fs + '" fill="' + (c[2] ? '#b45309' : '#475569') + '" font-weight="' + (c[2] ? 700 : 400) + '">' + o.res(p) + '</text>';
    });
    var heads = '';
    if (o.heads) o.heads.forEach(function (h, i) { heads += '<text x="' + X(i + 1) + '" y="14" font-size="11" font-weight="700" text-anchor="middle" fill="#1e3a8a">' + h + '</text>'; });
    return '<div style="overflow-x:auto"><svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Baumdiagramm') + '" style="max-width:' + Math.round(W * 1.15) + 'px;min-width:' + Math.min(W, 300) + 'px">' + heads + '<circle cx="' + X0 + '" cy="' + f1(y0) + '" r="4" fill="#1e3a8a"/>' + edges + nodes + '</svg></div>';
  }
  function same(list) { return function () { return list; }; }
  function stages(lists) { return function (p) { return lists[p.length]; }; }
  /* Brute Force: alle Folgen der Länge len aus k Zeichen aufzählen, Bedingung ok(folge) */
  function enumerate(k, len, ok) { var c = 0; (function go(p) { if (p.length === len) { if (!ok || ok(p)) c++; return; } for (var i = 0; i < k; i++) go(p.concat([i])); })([]); return c; }
  /* ohne Wiederholung: nur Folgen mit lauter verschiedenen Zeichen (beim Aufzählen beschnitten) */
  function perms(k, len, ok) { var c = 0; (function go(p) { if (p.length === len) { if (!ok || ok(p)) c++; return; } for (var i = 0; i < k; i++) if (p.indexOf(i) < 0) go(p.concat([i])); })([]); return c; }
  function distinct(p) { return new Set(p).size === p.length; }
  function fact(m) { return m <= 1 ? 1 : m * fact(m - 1); }
  function factTxt(m) { var a = []; for (var i = m; i >= 1; i--) a.push(i); return a.join(' · '); }
  function down(k, len) { var a = []; for (var i = 0; i < len; i++) a.push(k - i); return a; }
  function prod(a) { return a.reduce(function (s, x) { return s * x; }, 1); }
  function list(a) { return a.length === 1 ? a[0] : a.slice(0, -1).join(', ') + ' und ' + a[a.length - 1]; }

  var SHIRTS = ['rot', 'blau', 'weiß', 'grün', 'gelb'], HOSEN = ['Jeans', 'Shorts', 'Jogger', 'Chino'], SCHUHE = ['Sneaker', 'Sandalen', 'Stiefel'];
  var VOR = ['Suppe', 'Salat', 'Bruschetta', 'Nachos'], HAUPT = ['Pizza', 'Pasta', 'Burger', 'Curry', 'Fisch'], NACH = ['Eis', 'Obst', 'Pudding', 'Kuchen'];
  var CODES = [['Ein Fahrradschloss hat', 'Ringe mit den Ziffern 0 bis 9.', 10, 'Zahlenkombinationen'], ['Ein Code besteht aus', 'Zeichen. Jedes Zeichen ist einer der Buchstaben A, B, C, D oder E.', 5, 'Codes'], ['Eine Handy-PIN hat', 'Ziffern von 0 bis 9.', 10, 'PINs'], ['Ein Farbcode für ein Spiel besteht aus', 'Steckern. Jeder Stecker kann rot, gelb, grün oder blau sein.', 4, 'Farbcodes']];

  var gen = {
    outfit: function (lvl) {
      var a = M.rnd(2, lvl === 1 ? 3 : 4), b = M.rnd(2, 3), c = lvl >= 2 ? M.rnd(2, 3) : 0, sh = SHIRTS.slice(0, a), ho = HOSEN.slice(0, b), sc = SCHUHE.slice(0, c);
      var lists = c ? [sh, ho, sc] : [sh, ho], tot = prod(lists.map(function (l) { return l.length; }));
      return { skill: 'Zählprinzip: Outfits', level: lvl, q: 'Jonas hat ' + a + ' T-Shirts (' + list(sh) + ') und ' + b + ' Hosen (' + list(ho) + ')' + (c ? ' sowie ' + c + ' Paar Schuhe (' + list(sc) + ')' : '') + '. Wie viele verschiedene Outfits aus ' + (c ? 'T-Shirt, Hose und Schuhen' : 'T-Shirt und Hose') + ' kann er zusammenstellen?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl der Outfits' }],
        hints: ['Zeichne ein Baumdiagramm: In der 1. Stufe wählst du das T-Shirt (' + a + ' Äste).', 'An jedes T-Shirt kommen ' + b + ' Äste für die Hosen' + (c ? ' und an jede Hose ' + c + ' Äste für die Schuhe' : '') + '.', 'Zählprinzip: Multipliziere die Anzahlen der Möglichkeiten: ' + lists.map(function (l) { return l.length; }).join(' · ') + '.'],
        solution: 'Nach dem Zählprinzip: ' + lists.map(function (l) { return l.length; }).join(' · ') + ' = <b>' + tot + '</b> Outfits.' + (tot <= 24 ? ctree(stages(lists), lists.length, { heads: c ? ['T-Shirt', 'Hose', 'Schuhe'] : ['T-Shirt', 'Hose'], label: 'Baumdiagramm der Outfits' }) : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === a + b + c) return 'Du hast addiert. Zu <b>jedem</b> T-Shirt passt jede Hose. Deshalb wird multipliziert.'; return null; },
        verify: function () { return enumerate(a, 1) * enumerate(b, 1) * (c ? enumerate(c, 1) : 1) === tot && (function () { var cnt = 0; sh.forEach(function () { ho.forEach(function () { if (c) sc.forEach(function () { cnt++; }); else cnt++; }); }); return cnt; })() === tot || 'Zählung falsch'; } };
    },
    menue: function (lvl) {
      var a = M.rnd(2, 4), b = M.rnd(2, 5), c = M.rnd(2, 4), opt = lvl === 3, tot = (opt ? a + 1 : a) * b * c;
      return { skill: 'Zählprinzip: Menüs', q: 'Die Mensa bietet ' + a + ' Vorspeisen (' + list(VOR.slice(0, a)) + '), ' + b + ' Hauptgerichte und ' + c + ' Nachspeisen an. Ein Menü besteht aus ' + (opt ? 'einem Hauptgericht und einer Nachspeise. Eine Vorspeise kann man dazunehmen, man kann sie aber auch <b>weglassen</b>.' : 'je einer Vorspeise, einem Hauptgericht und einer Nachspeise.') + ' Wie viele verschiedene Menüs gibt es?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl der Menüs' }],
        hints: ['Stelle dir einen Baum mit drei Stufen vor: Vorspeise, Hauptgericht, Nachspeise.', opt ? 'Bei der Vorspeise gibt es ' + a + ' Möglichkeiten und zusätzlich „keine Vorspeise“, also ' + (a + 1) + ' Äste.' : 'Stufe 1 hat ' + a + ' Äste, Stufe 2 ' + b + ' Äste, Stufe 3 ' + c + ' Äste.', 'Multipliziere: ' + (opt ? a + 1 : a) + ' · ' + b + ' · ' + c + '.'],
        solution: (opt ? 'Vorspeise: ' + a + ' + 1 (keine) = ' + (a + 1) + ' Möglichkeiten. ' : '') + 'Zählprinzip: ' + (opt ? a + 1 : a) + ' · ' + b + ' · ' + c + ' = <b>' + tot + '</b> Menüs.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === a + b + c) return 'Nicht addieren: Jede Vorspeise kann mit jedem Hauptgericht und jeder Nachspeise kombiniert werden.'; if (opt && x === a * b * c) return 'Du hast die Möglichkeit „keine Vorspeise“ vergessen. Sie ist ein zusätzlicher Ast.'; return null; },
        verify: function () { return enumerate(opt ? a + 1 : a, 1) * enumerate(b, 1) * enumerate(c, 1) === tot || 'falsch'; } };
    },
    code: function (lvl) {
      var C = M.pick(CODES), len = lvl === 1 ? M.rnd(2, 3) : M.rnd(3, 4), k = C[2], tot = Math.pow(k, len);
      if (k === 10 && lvl === 1) len = 3;
      tot = Math.pow(k, len);
      return { skill: 'Codes mit Wiederholung', q: C[0] + ' <b>' + len + '</b> ' + C[1] + ' Zeichen dürfen sich wiederholen. Wie viele verschiedene ' + C[3] + ' gibt es?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl' }],
        hints: ['Für jede Stelle gibt es ' + k + ' Möglichkeiten, egal was an den anderen Stellen steht.', 'Baumdiagramm: Jede Stufe hat ' + k + ' Äste. Es gibt ' + len + ' Stufen.', 'Rechne ' + down(k, len).map(function () { return k; }).join(' · ') + ' = ' + k + '<sup>' + len + '</sup>.'],
        solution: 'Jede der ' + len + ' Stellen hat ' + k + ' Möglichkeiten: ' + down(k, len).map(function () { return k; }).join(' · ') + ' = ' + k + '<sup>' + len + '</sup> = <b>' + n(tot) + '</b> ' + C[3] + '.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === k * len) return 'Nicht ' + k + ' · ' + len + ': Für <b>jede</b> Stelle gibt es ' + k + ' Möglichkeiten, also ' + k + ' hoch ' + len + '.'; if (x === prod(down(k, len))) return 'Hier dürfen sich Zeichen wiederholen. Jede Stelle hat wieder ' + k + ' Möglichkeiten.'; return null; },
        verify: function () { return enumerate(k, len) === tot || 'Aufzählung ≠'; } };
    },
    ohneWdh: function (lvl) {
      var C = M.pick(CODES.slice(0, 3)), k = C[2] === 10 ? M.pick([10, 6, 8]) : 5, len = lvl === 3 ? M.rnd(3, 4) : 3, f = down(k, len), tot = prod(f);
      var what = C[2] === 10 && k !== 10 ? 'Ein Code besteht aus ' + len + ' Ziffern von 1 bis ' + k + '.' : C[0] + ' ' + len + ' ' + C[1];
      return { skill: 'Codes ohne Wiederholung', q: what + ' Diesmal müssen <b>alle Zeichen verschieden</b> sein. Wie viele Möglichkeiten gibt es?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl' }],
        hints: ['Für die 1. Stelle gibt es ' + k + ' Möglichkeiten.', 'Ein Zeichen ist schon verbraucht. Für die 2. Stelle bleiben ' + (k - 1) + ', für die 3. Stelle ' + (k - 2) + (len > 3 ? ', für die 4. Stelle ' + (k - 3) : '') + '.', 'Multipliziere: ' + f.join(' · ') + '.'],
        solution: 'Ohne Wiederholung wird jede Stufe um einen Ast kleiner: ' + f.join(' · ') + ' = <b>' + n(tot) + '</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === Math.pow(k, len)) return 'Das wäre mit Wiederholung. Hier darf jedes Zeichen nur einmal vorkommen, also wird jede Stufe um 1 kleiner.'; return null; },
        verify: function () { return perms(k, len) === tot || 'Aufzählung ≠'; } };
    },
    reihenfolge: function (lvl) {
      var m = lvl === 1 ? M.rnd(3, 4) : lvl === 2 ? M.rnd(4, 5) : M.rnd(5, 7), ctx = M.pick([['Freundinnen und Freunde wollen sich in einer Reihe für ein Foto aufstellen.', 'Reihenfolgen'], ['Schülerinnen und Schüler halten nacheinander ein Referat.', 'Reihenfolgen'], ['Personen setzen sich auf ' + m + ' Stühle in einer Reihe.', 'Sitzordnungen'], ['Bücher sollen nebeneinander ins Regal gestellt werden.', 'Anordnungen']]);
      var tot = fact(m);
      return { skill: 'Reihenfolgen (Fakultät)', q: '<b>' + m + '</b> ' + ctx[0] + ' Wie viele verschiedene ' + ctx[1] + ' gibt es?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl der ' + ctx[1] }],
        hints: ['Für den 1. Platz gibt es ' + m + ' Möglichkeiten, für den 2. Platz nur noch ' + (m - 1) + '.', 'So geht es weiter, bis für den letzten Platz nur noch 1 Möglichkeit bleibt.', 'Rechne ' + factTxt(m) + '. Man schreibt kurz ' + m + '! (gelesen: ' + m + ' Fakultät).'],
        solution: m + '! = ' + factTxt(m) + ' = <b>' + n(tot) + '</b> ' + ctx[1] + '.' + (m === 3 ? ctree(function (p) { return ['A', 'B', 'C'].filter(function (x) { return p.indexOf(x) < 0; }); }, 3, { res: function (p) { return p.join(''); }, heads: ['1. Platz', '2. Platz', '3. Platz'] }) : ''),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === m * m) return 'Nicht ' + m + ' · ' + m + ': Jede Person kann nur einmal einen Platz bekommen.'; if (x === Math.pow(m, m)) return 'Ohne Wiederholung: Für jeden weiteren Platz gibt es eine Möglichkeit weniger.'; if (x === m * (m + 1) / 2) return 'Nicht addieren, sondern multiplizieren: ' + factTxt(m) + '.'; return null; },
        verify: function () { return perms(m, m) === tot || 'Permutationen ≠'; } };
    },
    podest: function (lvl) {
      var m = M.rnd(5, lvl === 3 ? 12 : 9), tot = m * (m - 1) * (m - 2);
      return { skill: 'Platzierungen auf dem Podest', q: 'Bei einem Wettlauf starten <b>' + m + '</b> Läuferinnen. Wie viele Möglichkeiten gibt es für die Plätze 1, 2 und 3 auf dem Siegerpodest?',
        inputs: [{ kind: 'num', answer: tot, label: 'Anzahl der Möglichkeiten' }],
        hints: ['Für Platz 1 kommen alle ' + m + ' infrage.', 'Für Platz 2 bleiben ' + (m - 1) + ', für Platz 3 noch ' + (m - 2) + '.', 'Multipliziere: ' + m + ' · ' + (m - 1) + ' · ' + (m - 2) + '.'],
        solution: m + ' · ' + (m - 1) + ' · ' + (m - 2) + ' = <b>' + n(tot) + '</b> Möglichkeiten. Die übrigen Plätze spielen keine Rolle.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === fact(m)) return 'Gefragt sind nur die ersten drei Plätze, nicht die ganze Reihenfolge.'; if (x === m * m * m) return 'Eine Läuferin kann nicht zwei Plätze belegen. Die Anzahl wird von Platz zu Platz kleiner.'; if (x === 3 * m) return 'Multipliziere die Möglichkeiten der drei Plätze miteinander.'; return null; },
        verify: function () { return perms(m, 3) === tot || 'falsch'; } };
    },
    baum_lesen: function () {
      var s1 = M.pick([['Vanille', 'Schoko', 'Erdbeere'], ['Vanille', 'Schoko'], ['Mango', 'Zitrone', 'Kirsch']]), s2 = ['Becher', 'Waffel'], s3 = ['Sahne', 'ohne'];
      var three = s1.length === 2 || Math.random() < 0.5, lists = three ? [s1, s2, s3] : [s1, s2], tot = prod(lists.map(function (l) { return l.length; }));
      var ask = three ? M.pick([['mit Sahne', function (p) { return p[2] === 'Sahne'; }], ['in der Waffel', function (p) { return p[1] === 'Waffel'; }], ['mit ' + s1[0], function (p) { return p[0] === s1[0]; }]]) : M.pick([['in der Waffel', function (p) { return p[1] === 'Waffel'; }], ['mit ' + s1[1], function (p) { return p[0] === s1[1]; }]]);
      var cnt = 0; (function walk(p) { if (p.length === lists.length) { if (ask[1](p)) cnt++; return; } lists[p.length].forEach(function (x) { walk(p.concat([x])); }); })([]);
      return { skill: 'Baumdiagramm lesen', level: 1, q: 'Im Eiscafé kannst du eine Kugel Eis bestellen. Das Baumdiagramm zeigt alle Möglichkeiten.' + ctree(stages(lists), lists.length, { heads: three ? ['Sorte', 'Gefäß', 'Sahne'] : ['Sorte', 'Gefäß'], label: 'Baumdiagramm Eisbestellung' }) + 'a) Wie viele Möglichkeiten gibt es insgesamt?<br>b) Wie viele davon sind <b>' + ask[0] + '</b>?',
        inputs: [{ kind: 'num', answer: tot, label: 'a) insgesamt' }, { kind: 'num', answer: cnt, label: 'b) ' + ask[0] }],
        hints: ['Jeder Pfad vom Startpunkt bis ganz rechts ist eine Möglichkeit. Zähle die Enden rechts.', 'Oder rechne: ' + lists.map(function (l) { return l.length; }).join(' · ') + '.', 'Für b) zähle nur die Pfade, die durch „' + ask[0].replace(/^(mit|in der) /, '') + '“ gehen.'],
        solution: 'a) ' + lists.map(function (l) { return l.length; }).join(' · ') + ' = <b>' + tot + '</b> Pfade. b) Davon gehen <b>' + cnt + '</b> Pfade durch „' + ask[0].replace(/^(mit|in der) /, '') + '“.' + ctree(stages(lists), lists.length, { heads: three ? ['Sorte', 'Gefäß', 'Sahne'] : ['Sorte', 'Gefäß'], hl: ask[1] }),
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === lists.reduce(function (s, l) { return s + l.length; }, 0)) return 'Du hast die Äste einer Stufe addiert. Zähle die Pfade bis ganz nach rechts.'; return null; },
        verify: function () { var leaves = 0; (function w(p) { if (p.length === lists.length) { leaves++; return; } lists[p.length].forEach(function (x) { w(p.concat([x])); }); })([]); return leaves === tot && cnt === tot / (ask[0] === 'mit Sahne' || ask[0] === 'in der Waffel' ? 2 : s1.length) || 'Zählung falsch'; } };
    },
    wuerfel: function (lvl) {
      var s = M.rnd(3, 11), cnt = enumerate(6, 2, function (p) { return p[0] + p[1] + 2 === s; }), kind = M.rnd(0, 1);
      if (kind === 1) { var c = M.rnd(2, 4), tot2 = 2 * 6 * c; return { skill: 'Zählprinzip bei Zufallsgeräten', q: 'Du wirfst eine Münze (Kopf oder Zahl), einen Würfel (1 bis 6) und drehst ein Glücksrad mit ' + c + ' gleich großen Feldern. Wie viele verschiedene Ergebnisse gibt es?', inputs: [{ kind: 'num', answer: tot2, label: 'Anzahl der Ergebnisse' }],
        hints: ['Jedes Gerät ist eine Stufe im Baumdiagramm.', 'Münze: 2, Würfel: 6, Glücksrad: ' + c + ' Möglichkeiten.', 'Multipliziere: 2 · 6 · ' + c + '.'], solution: '2 · 6 · ' + c + ' = <b>' + tot2 + '</b> Ergebnisse.', mistakes: function (v) { return M.parseNum(v[0]) === 8 + c ? 'Nicht addieren: Jedes Ergebnis der Münze kann mit jedem Würfelergebnis und jedem Feld kombiniert werden.' : null; },
        verify: function () { return enumerate(2, 1) * enumerate(6, 1) * enumerate(c, 1) === tot2 || 'falsch'; } }; }
      var pairs = []; for (var a = 1; a <= 6; a++) for (var b = 1; b <= 6; b++) if (a + b === s) pairs.push('(' + a + '|' + b + ')');
      return { skill: 'Ergebnisse beim Doppelwurf zählen', q: 'Du wirfst einen roten und einen blauen Würfel.<br>a) Wie viele verschiedene Ergebnisse (rot | blau) gibt es?<br>b) Bei wie vielen Ergebnissen ist die Augensumme <b>' + s + '</b>?',
        inputs: [{ kind: 'num', answer: 36, label: 'a) Ergebnisse' }, { kind: 'num', answer: cnt, label: 'b) Augensumme ' + s }],
        hints: ['Für den roten Würfel gibt es 6 Möglichkeiten, für den blauen ebenfalls 6.', 'a) 6 · 6. b) Schreibe alle Paare (rot | blau) mit Summe ' + s + ' auf. Beginne mit rot = 1.', 'Achte darauf: (1|2) und (2|1) sind verschiedene Ergebnisse.'],
        solution: 'a) 6 · 6 = <b>36</b>. b) Summe ' + s + ': ' + pairs.join(', ') + ', also <b>' + cnt + '</b> Ergebnisse.',
        mistakes: function (v) { var x = M.parseNum(v[0]), y = M.parseNum(v[1]); if (x === 12) return 'Nicht addieren: Zu jeder Augenzahl des roten Würfels gibt es 6 Möglichkeiten für den blauen.'; if (x === 36 && y === Math.ceil(cnt / 2)) return 'Die Würfel sind verschieden. (1|2) und (2|1) zählen als zwei Ergebnisse.'; return null; },
        verify: function () { return pairs.length === cnt && enumerate(6, 2) === 36 || 'falsch'; } };
    },
    bedingung: function () {
      var v = M.rnd(0, 3), tot, txt, steps, ok, k, len;
      if (v === 0) { k = 10; len = 3; ok = function (p) { return p[0] !== 0; }; tot = 900; txt = 'Wie viele dreistellige Zahlen gibt es? (Eine Zahl beginnt nicht mit 0.)'; steps = '1. Stelle: 9 Möglichkeiten (1 bis 9), 2. und 3. Stelle je 10: 9 · 10 · 10 = 900.'; }
      else if (v === 1) { k = 5; len = 3; ok = function (p) { return (p[2] + 1) % 2 === 0; }; tot = 5 * 5 * 2; txt = 'Aus den Ziffern 1, 2, 3, 4 und 5 werden dreistellige Zahlen gebildet. Ziffern dürfen mehrfach vorkommen. Wie viele dieser Zahlen sind <b>gerade</b>?'; steps = 'Die letzte Ziffer muss 2 oder 4 sein: 2 Möglichkeiten. Die ersten beiden Stellen je 5: 5 · 5 · 2 = 50.'; }
      else if (v === 2) { k = 5; len = 3; ok = function (p) { return distinct(p) && (p[2] + 1) % 2 === 1; }; tot = 3 * 4 * 3; txt = 'Aus den Ziffern 1, 2, 3, 4 und 5 werden dreistellige Zahlen mit <b>lauter verschiedenen</b> Ziffern gebildet. Wie viele davon sind <b>ungerade</b>?'; steps = 'Beginne mit der letzten Stelle: 1, 3 oder 5, also 3 Möglichkeiten. Für die erste Stelle bleiben 4, für die mittlere 3: 3 · 4 · 3 = 36.'; }
      else { k = 10; len = 4; ok = function (p) { return p[0] === p[3]; }; tot = 1000; txt = 'Eine vierstellige PIN (Ziffern 0 bis 9) soll mit derselben Ziffer enden, mit der sie beginnt. Wie viele solcher PINs gibt es?'; steps = '1. Stelle: 10, 2. Stelle: 10, 3. Stelle: 10, 4. Stelle: nur 1 Möglichkeit (wie die 1.): 10 · 10 · 10 · 1 = 1 000.'; }
      return { skill: 'Zählen mit Bedingungen', level: 3, q: txt, inputs: [{ kind: 'num', answer: tot, label: 'Anzahl' }],
        hints: ['Überlege für jede Stelle einzeln, wie viele Möglichkeiten es gibt.', 'Beginne mit der Stelle, für die es eine Einschränkung gibt.', 'Multipliziere die Anzahlen aller Stellen.'],
        solution: steps.replace(/= (\d[\d ]*)\.$/, '= <b>$1</b>.'),
        mistakes: function (vv) { var x = M.parseNum(vv[0]); if (x === Math.pow(k, len)) return 'Das sind alle Möglichkeiten ohne die Bedingung. Prüfe, welche Stelle eingeschränkt ist.'; return null; },
        verify: function () { return enumerate(k, len, ok) === tot || 'Aufzählung ≠ ' + enumerate(k, len, ok); } };
    },
    handschlag: function () {
      var m = M.rnd(5, 16), kind = M.rnd(0, 1), tot = m * (m - 1) / 2;
      var q = kind === 0 ? 'Bei einer Feier begrüßen sich <b>' + m + '</b> Personen. Jede Person gibt jeder anderen genau einmal die Hand. Wie viele Handschläge gibt es?' : 'In einem Tischtennis-Turnier mit <b>' + m + '</b> Spielerinnen spielt jede genau einmal gegen jede andere. Wie viele Spiele finden statt?';
      return { skill: 'Paare zählen (Transfer)', level: 3, q: q, inputs: [{ kind: 'num', answer: tot, label: 'Anzahl' }],
        hints: ['Jede der ' + m + ' Personen trifft auf ' + (m - 1) + ' andere. Das ergibt ' + m + ' · ' + (m - 1) + ' = ' + m * (m - 1) + '.', 'Dabei hast du jedes Paar doppelt gezählt: A mit B und B mit A ist dasselbe.', 'Teile deshalb durch 2: ' + m * (m - 1) + ' : 2.'],
        solution: m + ' · ' + (m - 1) + ' = ' + m * (m - 1) + ' geordnete Paare. Jedes Paar ist doppelt gezählt, also ' + m * (m - 1) + ' : 2 = <b>' + tot + '</b>.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === m * (m - 1)) return 'Jedes Paar ist doppelt gezählt: A mit B ist dasselbe wie B mit A. Teile durch 2.'; if (x === m * m) return 'Niemand gibt sich selbst die Hand, und jedes Paar zählt nur einmal.'; return null; },
        verify: function () { return enumerate(m, 2, function (p) { return p[0] < p[1]; }) === tot || 'falsch'; } };
    }
  };

  var DEMO_S = ['rot', 'blau', 'weiß', 'grün'], DEMO_H = ['Jeans', 'Shorts', 'Jogger', 'Chino'];
  return {
    id: '029', title: 'Zählen mit dem Baumdiagramm', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Baumdiagramme (Klasse 8), Multiplizieren, Potenzen',
    lead: 'Wie viele Outfits, Menüs oder PINs gibt es? Mit dem Baumdiagramm und dem Zählprinzip zählst du auch riesige Anzahlen, ohne alles aufzuschreiben.',
    einstieg: { html: '<p>Lina packt für eine Klassenfahrt. Sie nimmt 3 T-Shirts (rot, blau, weiß) und 2 Hosen (Jeans, Shorts) mit. Jeden Tag will sie ein anderes Outfit tragen.</p>' + ctree(stages([['rot', 'blau', 'weiß'], ['Jeans', 'Shorts']]), 2, { heads: ['T-Shirt', 'Hose'], res: function (p) { return p.join(' + '); } }) + '<p class="note">Reichen die Outfits für 5 Tage? Und wie viele Outfits wären es mit 4 T-Shirts, 3 Hosen und 2 Paar Schuhen?</p><p>Das Baumdiagramm zeigt: Zu jedem der 3 T-Shirts gibt es 2 Hosen, also 3 · 2 = 6 Outfits. Mit Schuhen werden es schnell sehr viele. Dann zeichnet man nicht mehr jeden Ast, sondern rechnet mit dem <b>Zählprinzip</b>.</p>' },
    ziele: ['Ich stelle alle Möglichkeiten mit einem Baumdiagramm dar und zähle die Pfade.', 'Ich nutze das Zählprinzip: Die Anzahlen der einzelnen Stufen werden multipliziert.', 'Ich zähle Codes und PINs mit Wiederholung.', 'Ich zähle Anordnungen ohne Wiederholung, auch mit der Fakultät, zum Beispiel 4! = 24.', 'Ich löse Zählaufgaben mit Bedingungen.'],
    fachwoerter: [['Zählprinzip (Produktregel)', 'Gibt es n<sub>1</sub> Möglichkeiten für die 1. Stufe, n<sub>2</sub> für die 2. usw., dann gibt es insgesamt n<sub>1</sub> · n<sub>2</sub> · … Möglichkeiten.'], ['Pfad', 'Ein Weg im Baumdiagramm vom Startpunkt bis zum Ende. Jeder Pfad ist eine Möglichkeit.'], ['Mit Wiederholung', 'Ein Zeichen darf mehrfach vorkommen, zum Beispiel bei einer PIN 1 1 3 7.'], ['Fakultät', 'n! = n · (n − 1) · … · 2 · 1. Anzahl der Reihenfolgen von n Dingen. Beispiel: 4! = 24.']],
    diagnose: [
      { q: 'Berechne 4 · 3 · 2.', options: ['24', '9', '12', 'Weiß ich noch nicht'], answer: 0, why: '4 · 3 = 12 und 12 · 2 = 24.', review: 'Kopfrechnen: Produkte' },
      { q: 'Was bedeutet 10³?', options: ['10 · 10 · 10 = 1 000', '10 · 3 = 30', '10 + 10 + 10 = 30', 'Weiß ich noch nicht'], answer: 0, why: 'Die Hochzahl gibt an, wie oft die 10 mit sich selbst multipliziert wird.', review: 'Potenzen' },
      { q: 'Eine Münze wird zweimal geworfen. Welche Ergebnisse sind möglich?', options: ['KK, KZ, ZK, ZZ', 'KK, KZ, ZZ', 'K und Z', 'Weiß ich noch nicht'], answer: 0, why: 'KZ und ZK sind verschiedene Ergebnisse, weil die Reihenfolge zählt.', review: 'Baumdiagramme (Klasse 8)' },
      { q: 'In einem Baumdiagramm gehen vom Start 3 Äste aus. An jedem Ende gehen wieder 2 Äste ab. Wie viele Enden hat der Baum?', options: ['6', '5', '8', 'Weiß ich noch nicht'], answer: 0, why: 'An jedem der 3 Äste hängen 2 Äste: 3 · 2 = 6.', review: 'Baumdiagramme lesen' }],
    erklaerung:
      '<h3>1. Das Baumdiagramm</h3><p>Ein Vorgang mit mehreren Schritten lässt sich als Baum zeichnen. Jede <b>Stufe</b> ist ein Schritt, jeder <b>Pfad</b> vom Start bis zum Ende ist eine Möglichkeit.</p>' +
      '<h3>2. Das Zählprinzip</h3><div class="merk"><b>Merke (Zählprinzip):</b> Hat die 1. Stufe n<sub>1</sub> Möglichkeiten, die 2. Stufe n<sub>2</sub> Möglichkeiten usw., dann gibt es insgesamt <span class="big-math">n<sub>1</sub> · n<sub>2</sub> · n<sub>3</sub> · …</span> Möglichkeiten.</div><p>Beispiel: 4 T-Shirts, 3 Hosen, 2 Paar Schuhe: 4 · 3 · 2 = <b>24</b> Outfits.</p>' +
      '<h3>3. Mit Wiederholung</h3><p>Bei einem Fahrradschloss mit 3 Ringen (Ziffern 0 bis 9) hat jeder Ring 10 Möglichkeiten: 10 · 10 · 10 = 10³ = <b>1 000</b> Kombinationen. Eine vierstellige PIN hat 10<sup>4</sup> = 10 000 Möglichkeiten.</p>' +
      '<h3>4. Ohne Wiederholung und Fakultät</h3><p>Sollen 3 Personen A, B, C in einer Reihe stehen, gibt es für Platz 1 drei, für Platz 2 noch zwei und für Platz 3 nur noch eine Möglichkeit: 3 · 2 · 1 = 6.</p>' + ctree(function (p) { return ['A', 'B', 'C'].filter(function (x) { return p.indexOf(x) < 0; }); }, 3, { heads: ['1. Platz', '2. Platz', '3. Platz'], res: function (p) { return p.join(''); }, label: 'Alle Reihenfolgen von A, B, C' }) +
      '<div class="merk"><b>Merke:</b> n Dinge kann man auf <b>n! = n · (n − 1) · … · 2 · 1</b> Arten anordnen (gelesen: n Fakultät). 4! = 4 · 3 · 2 · 1 = 24, 5! = 120.<br>Werden nur die ersten Plätze vergeben, zum Beispiel Platz 1 bis 3 bei 8 Läufern: 8 · 7 · 6 = 336.</div>' +
      '<p class="note"><b>Typischer Fehler:</b> Addieren statt multiplizieren. 4 T-Shirts und 3 Hosen ergeben nicht 7, sondern 12 Outfits, denn zu <b>jedem</b> T-Shirt passt jede Hose.</p>',
    entdecken: {
      html: '<p>Stelle ein, wie viele T-Shirts und Hosen du hast und ob Schuhe dazukommen. Das Baumdiagramm wächst mit.</p><div class="ctl"><label>T-Shirts: <b id="v_s"></b> <input type="range" id="r_s" min="1" max="4" step="1" value="1"></label><label>Hosen: <b id="v_h"></b> <input type="range" id="r_h" min="1" max="4" step="1" value="1"></label><label>Schuhe <select id="e_c"><option value="0">keine Wahl</option><option value="2">2 Paar</option><option value="3">3 Paar</option></select></label></div><p class="big-math" id="e_t"></p><div id="e_tree"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var a = +root.querySelector('#r_s').value, b = +root.querySelector('#r_h').value, c = +root.querySelector('#e_c').value;
          root.querySelector('#v_s').textContent = a; root.querySelector('#v_h').textContent = b;
          var lists = [DEMO_S.slice(0, a), DEMO_H.slice(0, b)]; if (c) lists.push(SCHUHE.slice(0, c));
          var tot = prod(lists.map(function (l) { return l.length; }));
          root.querySelector('#e_t').innerHTML = lists.map(function (l) { return l.length; }).join(' · ') + ' = ' + tot + ' Outfits';
          root.querySelector('#e_tree').innerHTML = tot <= 32 ? ctree(stages(lists), lists.length, { heads: c ? ['T-Shirt', 'Hose', 'Schuhe'] : ['T-Shirt', 'Hose'] }) : '<p class="note">Der Baum hätte ' + tot + ' Pfade. Das ist zu groß zum Zeichnen. Mit dem Zählprinzip geht es trotzdem schnell.</p>';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Jede neue Stufe vervielfacht die Anzahl der Pfade. Die Gesamtzahl ist das Produkt der Anzahlen jeder Stufe.'); }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', hit); });
        root.querySelector('#e_c').addEventListener('change', hit);
        draw();
      }
    },
    beispiel: { title: 'Siegerpodest', q: 'Beim Sportfest laufen 6 Kinder um die Wette. Wie viele Möglichkeiten gibt es für die Plätze 1, 2 und 3? Und wie viele Reihenfolgen gibt es für alle 6 Kinder?',
      steps: ['Platz 1: Jedes der 6 Kinder kann gewinnen, also 6 Möglichkeiten.', 'Platz 2: Ein Kind steht schon auf Platz 1. Es bleiben 5 Möglichkeiten. Platz 3: noch 4.', 'Zählprinzip: 6 · 5 · 4 = <b>120</b> Möglichkeiten für das Podest.', 'Für alle 6 Plätze geht es weiter bis 1: 6! = 6 · 5 · 4 · 3 · 2 · 1 = <b>720</b> Reihenfolgen.', 'Kontrolle: Zu jedem der 120 Podeste gibt es 3! = 6 Reihenfolgen für die restlichen Kinder: 120 · 6 = 720. ✓'] },
    tasks: { gen: gen,
      plan: { G: ['outfit:1', 'baum_lesen:1', 'reihenfolge:1', 'code:1'], S: ['outfit:2', 'menue:2', 'code:2', 'reihenfolge:2', 'ohneWdh:2'], E: ['menue:3', 'ohneWdh:3', 'podest:2', 'bedingung:3', 'wuerfel:2', 'reihenfolge:3'] },
      extra: 'handschlag', test: ['outfit:2', 'baum_lesen:1', 'code:2', 'reihenfolge:2', 'ohneWdh:2', 'podest:2'] },
    lerncheck: ['Ich zeichne Baumdiagramme und zähle die Pfade.', 'Ich nutze das Zählprinzip und multipliziere die Anzahlen der Stufen.', 'Ich unterscheide Zählen mit und ohne Wiederholung.', 'Ich berechne Reihenfolgen mit der Fakultät.']
  };
})();
