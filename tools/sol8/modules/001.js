/* Modul 001 · Brüche multiplizieren */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml;
  function proper(maxD, minD) { var d = M.rnd(minD || 2, maxD), n; do { n = M.rnd(1, d - 1); } while (M.gcd(n, d) !== 1); return F(n, d); }
  function frac(n, d) { return fh(F(n, d), true); }
  function ansInput(f, label) { return { kind: 'frac', answer: M.red(f), reduce: true, label: label || 'Ergebnis (vollständig gekürzt)', placeholder: 'z. B. 3/8' }; }
  function solMul(a, b) {
    var raw = F(a.n * b.n, a.d * b.d), r = M.red(raw);
    return frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + ' = ' + '<span class="frac"><span>' + a.n + ' · ' + b.n + '</span><span>' + a.d + ' · ' + b.d + '</span></span> = ' + frac(raw.n, raw.d) + (raw.n !== r.n ? ' = ' + fh(r) : '');
  }
  function mulMistakes(a, b) {
    return function (v) {
      var f = M.parseFrac(v[0]); if (!f) return null;
      if (M.feq(f, F(a.n + b.n, a.d + b.d))) return 'Du hast Zähler und Nenner addiert. Beim Multiplizieren rechnest du <b>Zähler mal Zähler</b> und <b>Nenner mal Nenner</b>.';
      if (M.feq(f, M.fadd(a, b))) return 'Du hast die Brüche addiert. Hier wird aber multipliziert.';
      if (M.feq(f, F(a.n * b.d, a.d * b.n)) || M.feq(f, F(a.n * b.n, a.d))) return 'Achte darauf, welche Zahlen du multiplizierst: Zähler mal Zähler, Nenner mal Nenner.';
      return null;
    };
  }
  var gen = {
    basic: function () {
      var a = proper(7), b = proper(9);
      return { skill: 'Zähler mal Zähler', q: 'Berechne. <span class="big-math">' + frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + '</span>', inputs: [ansInput(M.fmul(a, b))],
        hints: ['Multipliziere die beiden Zähler miteinander und die beiden Nenner miteinander.', 'Neuer Zähler: ' + a.n + ' · ' + b.n + ' = ' + a.n * b.n + '. Neuer Nenner: ' + a.d + ' · ' + b.d + ' = ' + a.d * b.d + '.', 'Prüfe, ob du den Bruch noch kürzen kannst. Suche den größten gemeinsamen Teiler.'],
        solution: solMul(a, b), mistakes: mulMistakes(a, b) };
    },
    kreuz: function () {
      /* so gebaut, dass über Kreuz gekürzt werden kann: a/b · c/d mit gcd(a,d)>1 und gcd(c,b)>1 */
      var p = M.pick([2, 3, 4, 5]), q = M.pick([2, 3, 5, 7]), x = M.rnd(1, 4), y = M.rnd(1, 5), u = M.rnd(2, 5), w = M.rnd(2, 6);
      var a = F(x * p, u * q), b = F(y * q, w * p);
      if (a.n >= a.d || b.n >= b.d || M.gcd(a.n, a.d) !== 1 || M.gcd(b.n, b.d) !== 1) return gen.kreuz();
      var r = M.fmul(a, b);
      return { skill: 'Vor dem Ausrechnen kürzen', q: 'Berechne und kürze möglichst <b>vor</b> dem Ausrechnen. <span class="big-math">' + frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + '</span>', inputs: [ansInput(r)],
        hints: ['Schreibe alles auf einen Bruchstrich: ' + '<span class="frac"><span>' + a.n + ' · ' + b.n + '</span><span>' + a.d + ' · ' + b.d + '</span></span>. Jetzt darfst du jede Zahl oben mit jeder Zahl unten kürzen.', 'Kürze ' + a.n + ' und ' + b.d + ' durch ' + M.gcd(a.n, b.d) + '. Kürze ' + b.n + ' und ' + a.d + ' durch ' + M.gcd(b.n, a.d) + '.', 'Multipliziere danach die gekürzten Zahlen.'],
        solution: solMul(a, b) + '. Schneller: über Kreuz kürzen, dann bleiben kleine Zahlen.', mistakes: mulMistakes(a, b) };
    },
    nat: function () {
      var a = proper(9, 3), n = M.rnd(2, 9); while (n % a.d === 0) n = M.rnd(2, 9);
      var left = Math.random() < 0.5, r = M.fmul(F(n, 1), a);
      var expr = left ? n + ' · ' + frac(a.n, a.d) : frac(a.n, a.d) + ' · ' + n;
      return { skill: 'Bruch mal natürliche Zahl', q: 'Berechne. <span class="big-math">' + expr + '</span><br><small>Ein Ergebnis größer als 1 darfst du als unechten Bruch (7/4) oder gemischt (1 3/4) schreiben.</small>', inputs: [ansInput(r, 'Ergebnis')],
        hints: ['Schreibe die natürliche Zahl als Bruch: ' + n + ' = ' + frac(n, 1) + '.', 'Rechne ' + n + ' · ' + a.n + ' im Zähler. Der Nenner ' + a.d + ' bleibt.', 'Kürze, wenn möglich. ' + fh(F(n * a.n, a.d), true) + ' = ' + fh(r) + '.'],
        solution: expr + ' = ' + frac(n * a.n, a.d) + (M.gcd(n * a.n, a.d) > 1 ? ' = ' + fh(r) : '') + (r.n > r.d && r.d > 1 ? ' = ' + Math.floor(r.n / r.d) + ' ' + fh(F(r.n % r.d, r.d)) : '') };
    },
    gemischt: function () {
      var g = M.rnd(1, 3), f = proper(5), a = F(g * f.d + f.n, f.d), b = proper(7, 2);
      var r = M.fmul(a, b), shown = g + ' ' + frac(f.n, f.d);
      return { skill: 'Gemischte Zahlen', level: 3, q: 'Berechne. <span class="big-math">' + g + frac(f.n, f.d) + ' · ' + frac(b.n, b.d) + '</span>', inputs: [ansInput(r, 'Ergebnis (gekürzt, auch gemischt möglich)')],
        hints: ['Wandle die gemischte Zahl zuerst in einen unechten Bruch um.', g + frac(f.n, f.d) + ' = ' + '<span class="frac"><span>' + g + ' · ' + f.d + ' + ' + f.n + '</span><span>' + f.d + '</span></span> = ' + frac(a.n, a.d) + '.', 'Rechne jetzt ' + frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + ' und kürze.'],
        solution: shown.replace(' ', '') + ' = ' + frac(a.n, a.d) + ', also ' + solMul(a, b),
        mistakes: function (v) { var x = M.parseFrac(v[0]); if (x && M.feq(x, M.fadd(F(g, 1), M.fmul(f, b)))) return 'Du hast nur den Bruchteil multipliziert. Die ganze Zahl muss auch mit malgenommen werden. Wandle zuerst in einen unechten Bruch um.'; return null; } };
    },
    anteil: function () {
      var ctx = M.pick([
        ['der Klasse 8b fahren mit dem Bus zur Schule.', 'Von den Busfahrern haben', 'eine Monatskarte.', 'Welcher Anteil der ganzen Klasse hat eine Monatskarte?'],
        ['des Schulgartens sind Beete.', 'Auf', 'der Beete wachsen Kartoffeln.', 'Welcher Anteil des ganzen Gartens ist Kartoffelbeet?'],
        ['der Schülerinnen und Schüler spielen ein Instrument.', 'Davon spielen', 'Gitarre.', 'Welcher Anteil aller Schülerinnen und Schüler spielt Gitarre?'],
        ['einer Pizza sind noch übrig.', 'Jonas isst', 'davon.', 'Welchen Anteil der ganzen Pizza isst Jonas?']]);
      var a = proper(6), b = proper(5), r = M.fmul(a, b);
      return { skill: 'Anteil vom Anteil', q: frac(a.n, a.d) + ' ' + ctx[0] + ' ' + ctx[1] + ' ' + frac(b.n, b.d) + ' ' + ctx[2] + ' <b>' + ctx[3] + '</b>', inputs: [ansInput(r, 'Anteil (gekürzt)')],
        hints: ['„' + frac(b.n, b.d) + ' von ' + frac(a.n, a.d) + '“ bedeutet: ' + frac(b.n, b.d) + ' · ' + frac(a.n, a.d) + '.', 'Rechne Zähler mal Zähler und Nenner mal Nenner.', 'Das Ergebnis muss kleiner sein als beide Anteile. Kürze am Ende.'],
        solution: frac(b.n, b.d) + ' von ' + frac(a.n, a.d) + ': ' + solMul(b, a), mistakes: mulMistakes(a, b) };
    },
    groesse: function () {
      var q = M.pick([[F(3, 4), 'kg Mehl', 'kg'], [F(2, 3), 'Liter Saft', 'Liter'], [F(5, 6), 'Stunden', 'Stunden'], [F(3, 5), 'km Weg', 'km']]);
      var a = proper(5), r = M.fmul(a, q[0]);
      return { skill: 'Anteile von Größen', q: 'Wie viel sind ' + frac(a.n, a.d) + ' von ' + fh(q[0], true) + ' ' + q[1] + '? Gib das Ergebnis als Bruch an.', inputs: [{ kind: 'frac', answer: r, reduce: true, label: 'Ergebnis', unit: q[2], placeholder: 'z. B. 1/2' }],
        hints: ['„von“ heißt mal: ' + frac(a.n, a.d) + ' · ' + fh(q[0], true) + '.', 'Multipliziere Zähler mit Zähler und Nenner mit Nenner.', 'Kürze das Ergebnis vollständig.'],
        solution: solMul(a, q[0]) + ' ' + q[2] };
    },
    luecke: function () {
      var a = proper(7), d = M.rnd(2, 9), c; do { c = M.rnd(1, d - 1); } while (M.gcd(c, d) !== 1);
      var raw = F(a.n * c, a.d * d);
      return { skill: 'Lücken füllen', level: 3, q: 'Welche Zahl gehört in die Lücke? <span class="big-math">' + frac(a.n, a.d) + ' · <span class="frac"><span>□</span><span>' + d + '</span></span> = ' + frac(raw.n, raw.d) + '</span>', inputs: [{ kind: 'num', answer: c, label: 'Zahl für □' }],
        hints: ['Im Zähler gilt: ' + a.n + ' · □ = ' + raw.n + '.', 'Rechne rückwärts: ' + raw.n + ' : ' + a.n + '.', 'Kontrolle: Die Nenner passen, denn ' + a.d + ' · ' + d + ' = ' + raw.d + '.'],
        solution: a.n + ' · □ = ' + raw.n + ', also □ = ' + raw.n + ' : ' + a.n + ' = ' + c + '.' };
    },
    regel: function () {
      var a = proper(5), b = proper(7), r = M.fmul(a, b);
      var right = F(a.n * b.n, a.d * b.d), seen = {}, wrong = [];
      seen[right.n + '/' + right.d] = 1;
      [[a.n + b.n, a.d + b.d], [a.n * b.n, a.d], [a.n * b.d, a.d * b.n], [a.n * b.n, a.d + b.d], [a.n + b.n, a.d * b.d], [a.n * b.n, b.d]].forEach(function (c) {
        if (wrong.length >= 3 || !c[1]) return; var key = c[0] + '/' + c[1];
        if (seen[key] || M.feq(F(c[0], c[1]), right)) return; seen[key] = 1; wrong.push(c);
      });
      var lhs = frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + ' = ';
      var opts = M.shuffle([[lhs + frac(right.n, right.d), true]].concat(wrong.map(function (c) { return [lhs + frac(c[0], c[1]), false]; })));
      return { skill: 'Regel erkennen', level: 1, q: 'Welche Rechnung ist richtig?', inputs: [{ kind: 'mc', options: opts.map(function (o) { return o[0]; }), answer: opts.findIndex(function (o) { return o[1]; }), label: 'Wähle die richtige Rechnung' }],
        hints: ['Beim Multiplizieren gilt: Zähler mal Zähler, Nenner mal Nenner.', 'Addiert wird hier gar nichts.', 'Das Ergebnis muss kleiner als ' + frac(a.n, a.d) + ' sein.'],
        solution: 'Richtig ist ' + frac(a.n, a.d) + ' · ' + frac(b.n, b.d) + ' = ' + frac(a.n * b.n, a.d * b.d) + (M.gcd(a.n * b.n, a.d * b.d) > 1 ? ' = ' + fh(r) : '') + '.' };
    },
    rest: function () {
      var p = M.rnd(2, 5), q = M.rnd(2, 5), first = F(1, p), rest1 = F(p - 1, p), tom = M.fmul(F(1, q), rest1), rest2 = M.fmul(rest1, F(q - 1, q));
      var dish = M.pick(['eine Tafel Schokolade', 'eine Tüte Gummibärchen', 'eine Flasche Apfelsaft']);
      return { skill: 'Mehrschrittige Anteile', level: 3, q: 'Lisa nimmt sich ' + frac(1, p) + ' von ' + dish + '. Danach nimmt Tom ' + frac(1, q) + ' vom <b>Rest</b>. Welcher Anteil des Ganzen bleibt übrig?', inputs: [ansInput(rest2, 'Anteil, der übrig bleibt')],
        hints: ['Nach Lisa bleibt 1 − ' + frac(1, p) + ' = ' + frac(p - 1, p) + ' übrig.', 'Tom nimmt ' + frac(1, q) + ' von ' + frac(p - 1, p) + '. Es bleiben also ' + frac(q - 1, q) + ' von ' + frac(p - 1, p) + '.', 'Rechne ' + frac(q - 1, q) + ' · ' + frac(p - 1, p) + '.'],
        solution: 'Rest nach Lisa: ' + frac(p - 1, p) + '. Tom nimmt ' + frac(1, q) + ' · ' + frac(p - 1, p) + ' = ' + fh(tom) + '. Übrig: ' + solMul(F(q - 1, q), rest1) + '.' };
    }
  };

  return {
    id: '001', title: 'Brüche multiplizieren', bereich: 'Zahlen und Operationen', minutes: '45 bis 60',
    vorkenntnisse: 'Brüche kürzen und erweitern',
    lead: 'Wie viel ist die Hälfte von drei Vierteln? Du lernst, Brüche zu multiplizieren, und verstehst, warum die Regel stimmt.',
    einstieg: { html: '<p>Familie Yilmaz hat einen großen Garten. <b>' + frac(3, 4) + '</b> des Gartens sind Rasen. Auf <b>' + frac(1, 2) + '</b> der Rasenfläche soll eine Blumenwiese entstehen.</p><p class="note">Welcher Anteil des <b>ganzen</b> Gartens wird Blumenwiese? Schätze zuerst: mehr oder weniger als die Hälfte?</p><p>In diesem Modul findest du heraus, wie man so einen „Anteil von einem Anteil“ berechnet. Am Ende kannst du die Frage sicher beantworten.</p>' },
    ziele: ['Ich kann „Anteil von einem Anteil“ als Multiplikation deuten.', 'Ich multipliziere zwei Brüche: Zähler mal Zähler, Nenner mal Nenner.', 'Ich kürze geschickt, am besten schon vor dem Ausrechnen.', 'Ich multipliziere Brüche mit natürlichen Zahlen und gemischten Zahlen.', 'Ich löse Sachaufgaben mit Anteilen.'],
    fachwoerter: [['Zähler und Nenner', 'Zahl über dem Bruchstrich und Zahl unter dem Bruchstrich.'], ['Kürzen', 'Zähler und Nenner durch dieselbe Zahl teilen. Der Wert bleibt gleich.'], ['Gemischte Zahl', 'Eine ganze Zahl und ein Bruch, zum Beispiel 1 ' + '<span class="frac"><span>1</span><span>2</span></span>.'], ['„von“', 'Bei Anteilen bedeutet „von“: mal.']],
    vorkenntnisse_check: true,
    diagnose: [
      { q: 'Welcher Bruch hat denselben Wert wie ' + frac(6, 8) + '?', options: [frac(3, 4), frac(2, 3), frac(6, 4), 'Weiß ich noch nicht'], answer: 0, why: frac(6, 8) + ' gekürzt mit 2 ergibt ' + frac(3, 4) + '.', review: 'Brüche kürzen (Klasse 6)' },
      { q: 'Was ergibt 3 · ' + frac(2, 7) + '?', options: [frac(6, 21), frac(6, 7), frac(5, 7), 'Weiß ich noch nicht'], answer: 1, why: '3 · ' + frac(2, 7) + ' = ' + frac(2, 7) + ' + ' + frac(2, 7) + ' + ' + frac(2, 7) + ' = ' + frac(6, 7) + '.', review: 'Bruch mal natürliche Zahl als wiederholte Addition' },
      { q: 'Wie viel sind ' + frac(1, 4) + ' von 20 €?', options: ['5 €', '4 €', '80 €', 'Weiß ich noch nicht'], answer: 0, why: '20 € : 4 = 5 €.', review: 'Anteile von Größen berechnen' },
      { q: 'Welche Zahl ist größer?', options: [frac(3, 5), frac(2, 3), 'Beide sind gleich groß', 'Weiß ich noch nicht'], answer: 1, why: 'Mit dem Nenner 15: ' + frac(3, 5) + ' = ' + frac(9, 15) + ' und ' + frac(2, 3) + ' = ' + frac(10, 15) + '.', review: 'Brüche vergleichen mit gemeinsamem Nenner' }],
    erklaerung:
      '<h3>1. „Anteil von einem Anteil“</h3><p>Die Hälfte von drei Vierteln schreibt man als <b>' + frac(1, 2) + ' · ' + frac(3, 4) + '</b>. Das Wort „von“ bedeutet hier <b>mal</b>.</p>' +
      '<p>Stell dir ein Rechteck vor. Teile es in 4 Streifen und markiere 3 davon (' + frac(3, 4) + '). Teile es dann quer in 2 Teile und markiere davon 1 Teil. Doppelt markiert sind <b>3</b> von <b>8</b> Kästchen.</p>' +
      '<div class="merk"><b>Merke:</b> Zwei Brüche werden multipliziert, indem man <b>Zähler mal Zähler</b> und <b>Nenner mal Nenner</b> rechnet.<br><span class="big-math">' + frac(1, 2) + ' · ' + frac(3, 4) + ' = <span class="frac"><span>1 · 3</span><span>2 · 4</span></span> = ' + frac(3, 8) + '</span></div>' +
      '<h3>2. Geschickt kürzen</h3><p>Bevor du ausrechnest, schreibst du alles auf einen Bruchstrich. Dann darfst du <b>jede Zahl oben mit jeder Zahl unten</b> kürzen, auch über Kreuz.</p><p class="big-math">' + frac(4, 9) + ' · ' + frac(3, 8) + ' = <span class="frac"><span>4 · 3</span><span>9 · 8</span></span> = <span class="frac"><span>1 · 1</span><span>3 · 2</span></span> = ' + frac(1, 6) + '</span><p>Hier wurde 4 mit 8 durch 4 gekürzt und 3 mit 9 durch 3. So bleiben die Zahlen klein.</p>' +
      '<h3>3. Natürliche Zahlen und gemischte Zahlen</h3><ul><li>Eine natürliche Zahl schreibst du als Bruch mit Nenner 1: ' + '5 · ' + frac(2, 3) + ' = ' + frac(5, 1) + ' · ' + frac(2, 3) + ' = ' + frac(10, 3) + ' = 3' + frac(1, 3) + '.</li><li>Gemischte Zahlen wandelst du <b>zuerst</b> in unechte Brüche um: 1' + frac(1, 2) + ' = ' + frac(3, 2) + '.</li></ul>' +
      '<p class="note"><b>Kontrolle:</b> Multiplizierst du mit einem Bruch kleiner als 1, wird das Ergebnis <b>kleiner</b>. ' + frac(1, 2) + ' von etwas ist immer weniger als das Ganze.</p>',
    entdecken: {
      html: '<p>Wähle zwei Brüche. Das Rechteck zeigt den Anteil vom Anteil.</p><div class="ctl"><label>Erster Bruch <select id="e_a"></select></label><label>von <select id="e_b"></select></label></div><svg id="e_svg" class="viz" viewBox="0 0 360 240" role="img" aria-label="Rechteckmodell"></svg><p class="big-math" id="e_txt"></p><p class="note" id="e_q">Beobachte: Wie hängen die Anzahl der doppelt markierten Kästchen und die Zähler zusammen? Und die Gesamtzahl der Kästchen und die Nenner?</p>',
      init: function (root, done) {
        var opts = []; [2, 3, 4, 5, 6].forEach(function (d) { for (var n = 1; n < d; n++) if (M.gcd(n, d) === 1) opts.push(n + '/' + d); });
        var A = root.querySelector('#e_a'), B = root.querySelector('#e_b');
        opts.forEach(function (o) { A.add(new Option(o, o)); B.add(new Option(o, o)); }); A.value = '1/2'; B.value = '3/4';
        var changes = 0;
        function draw() {
          var a = A.value.split('/').map(Number), b = B.value.split('/').map(Number), W = 340, H = 220, x0 = 10, y0 = 10, cw = W / b[1], ch = H / a[1], s = '';
          for (var i = 0; i < a[1]; i++) for (var j = 0; j < b[1]; j++) {
            var inB = j < b[0], inA = i < a[0], fill = inA && inB ? '#5b3fa0' : inB ? '#cfc2ee' : inA ? '#f6d9a8' : '#fff';
            s += '<rect x="' + (x0 + j * cw) + '" y="' + (y0 + i * ch) + '" width="' + cw + '" height="' + ch + '" fill="' + fill + '" stroke="#3d2a73" stroke-width="1.5"/>';
          }
          root.querySelector('#e_svg').innerHTML = s;
          var r = M.fmul(M.F(a[0], a[1]), M.F(b[0], b[1]));
          root.querySelector('#e_txt').innerHTML = frac(a[0], a[1]) + ' von ' + frac(b[0], b[1]) + ' = ' + '<span class="frac"><span>' + a[0] + ' · ' + b[0] + '</span><span>' + a[1] + ' · ' + b[1] + '</span></span> = ' + frac(a[0] * b[0], a[1] * b[1]) + (M.gcd(a[0] * b[0], a[1] * b[1]) > 1 ? ' = ' + fh(r) : '') + ' <small>(dunkel: ' + a[0] * b[0] + ' von ' + a[1] * b[1] + ' Kästchen)</small>';
        }
        function ch() { draw(); changes++; if (changes >= 2) done('Gut beobachtet: Die dunklen Kästchen sind Zähler mal Zähler, alle Kästchen sind Nenner mal Nenner.'); }
        A.addEventListener('change', ch); B.addEventListener('change', ch); draw();
      }
    },
    beispiel: { title: 'Rezept verkleinern', q: 'Für ein Rezept braucht man ' + frac(3, 4) + ' Liter Milch. Du bereitest nur ' + frac(2, 3) + ' des Rezepts zu. Wie viel Milch brauchst du?',
      steps: ['Ansatz: ' + frac(2, 3) + ' von ' + frac(3, 4) + ' Liter, also ' + frac(2, 3) + ' · ' + frac(3, 4) + '.', 'Auf einen Bruchstrich schreiben: <span class="frac"><span>2 · 3</span><span>3 · 4</span></span>.', 'Kürzen: 3 oben und 3 unten durch 3, 2 oben und 4 unten durch 2. Es bleibt <span class="frac"><span>1 · 1</span><span>1 · 2</span></span> = ' + frac(1, 2) + '.', 'Antwort: Du brauchst ' + frac(1, 2) + ' Liter Milch. Kontrolle: Das ist weniger als ' + frac(3, 4) + ' Liter, passt also.'] },
    tasks: { gen: gen, plan: { G: ['regel:1', 'basic:1', 'nat:1', 'anteil:2'], S: ['basic:1', 'kreuz:2', 'nat:2', 'anteil:2', 'gemischt:3'], E: ['kreuz:2', 'nat:2', 'gemischt:3', 'anteil:2', 'groesse:2', 'luecke:3'] },
      extra: 'rest', test: ['basic:1', 'kreuz:2', 'nat:2', 'gemischt:3', 'anteil:2', 'luecke:3'] },
    lerncheck: ['Ich kann erklären, warum „von“ bei Anteilen „mal“ bedeutet.', 'Ich multipliziere zwei Brüche sicher.', 'Ich kürze vor dem Ausrechnen.', 'Ich löse Sachaufgaben mit Anteilen.']
  };
})();
