/* Modul 027 · Relative Häufigkeit und Kreisdiagramme */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml, fmt = M.fmtNum;
  var COLS = ['#5b3fa0', '#d97706', '#0f766e', '#c4b5fd', '#be185d'];
  var LIGHT = [false, false, false, true, false];
  function r3(x) { return Math.round(x * 1000) / 1000; }
  function f1(x) { return Math.round(x * 10) / 10; }
  function pc(x) { return fmt(r3(x)) + ' %'; }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function frac(n, d) { return fh(F(n, d), true); }
  /* Punkt auf dem Kreis: 0° oben, im Uhrzeigersinn */
  function pt(cx, cy, r, deg) { var a = (deg - 90) * Math.PI / 180; return [f1(cx + r * Math.cos(a)), f1(cy + r * Math.sin(a))]; }

  /* Kreisdiagramm, maßstabsgetreu: items = [{name, v, lab}] */
  function pie(items, opts) {
    opts = opts || {};
    var cx = 135, cy = 117, R = 98, tot = sum(items.map(function (it) { return it.v; })), a0 = 0, labs = '';
    var g = '<svg class="viz" viewBox="0 0 410 234" role="img" aria-label="' + (opts.label || 'Kreisdiagramm') + '" style="max-width:450px">';
    items.forEach(function (it, i) {
      if (!(it.v > 0)) return;
      var ang = it.v / tot * 360, a1 = a0 + ang, col = COLS[i % COLS.length];
      if (ang > 359.99) g += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="' + col + '" stroke="#fff" stroke-width="2"/>';
      else { var p0 = pt(cx, cy, R, a0), p1 = pt(cx, cy, R, a1); g += '<path d="M' + cx + ' ' + cy + ' L' + p0[0] + ' ' + p0[1] + ' A' + R + ' ' + R + ' 0 ' + (ang > 180 ? 1 : 0) + ' 1 ' + p1[0] + ' ' + p1[1] + ' Z" fill="' + col + '" stroke="#fff" stroke-width="2"/>'; }
      if (it.lab) {
        var mid = a0 + ang / 2;
        if (ang >= 34) { var q = pt(cx, cy, R * 0.63, mid); labs += '<text x="' + q[0] + '" y="' + (q[1] + 5) + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + (LIGHT[i % 5] ? '#1c1830' : '#fff') + '">' + it.lab + '</text>'; }
        else { var q2 = pt(cx, cy, R + 7, mid); labs += '<text x="' + q2[0] + '" y="' + (q2[1] + 5) + '" font-size="13" font-weight="700" text-anchor="' + (q2[0] >= cx ? 'start' : 'end') + '" fill="#1c1830">' + it.lab + '</text>'; }
      }
      a0 = a1;
    });
    g += labs;
    var ly = Math.max(24, cy - (items.length - 1) * 14);
    items.forEach(function (it, i) { var y = ly + i * 28; g += '<rect x="282" y="' + (y - 12) + '" width="16" height="16" rx="3" fill="' + COLS[i % 5] + '"/><text x="304" y="' + (y + 1) + '" font-size="15" fill="#1c1830">' + it.name + '</text>'; });
    return g + '</svg>';
  }
  /* Streifendiagramm, Länge proportional: items = [{name, v, lab}] */
  function stripe(items, opts) {
    opts = opts || {};
    var x0 = 20, Wd = 370, y = 14, h = 44, tot = sum(items.map(function (it) { return it.v; })), x = x0;
    var rows = Math.ceil(items.length / 2), H = y + h + (opts.ticks ? 30 : 12) + rows * 24 + 6;
    var g = '<svg class="viz" viewBox="0 0 410 ' + H + '" role="img" aria-label="' + (opts.label || 'Streifendiagramm') + '" style="max-width:450px">';
    items.forEach(function (it, i) {
      var w = it.v / tot * Wd;
      g += '<rect x="' + f1(x) + '" y="' + y + '" width="' + f1(w) + '" height="' + h + '" fill="' + COLS[i % 5] + '" stroke="#fff" stroke-width="2"/>';
      if (it.lab && w >= 40) g += '<text x="' + f1(x + w / 2) + '" y="' + (y + h / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="middle" fill="' + (LIGHT[i % 5] ? '#1c1830' : '#fff') + '">' + it.lab + '</text>';
      x += w;
    });
    g += '<rect x="' + x0 + '" y="' + y + '" width="' + Wd + '" height="' + h + '" fill="none" stroke="#3d2a73" stroke-width="1.5"/>';
    if (opts.ticks) for (var k = 0; k <= 20; k++) {
      var tx = f1(x0 + k * Wd / 20), len = k % 2 ? 4 : 8;
      g += '<line x1="' + tx + '" y1="' + (y + h) + '" x2="' + tx + '" y2="' + (y + h + len) + '" stroke="#3d2a73" stroke-width="1.2"/>';
      if (k % 4 === 0) g += '<text x="' + tx + '" y="' + (y + h + 21) + '" font-size="11" text-anchor="middle" fill="#5a5670">' + (k * 5) + ' %</text>';
    }
    var ly = y + h + (opts.ticks ? 30 : 12) + 14;
    items.forEach(function (it, i) { var lx = 20 + (i % 2) * 200, yy = ly + Math.floor(i / 2) * 24; g += '<rect x="' + lx + '" y="' + (yy - 12) + '" width="16" height="16" rx="3" fill="' + COLS[i % 5] + '"/><text x="' + (lx + 22) + '" y="' + (yy + 1) + '" font-size="14" fill="#1c1830">' + it.name + '</text>'; });
    return g + '</svg>';
  }
  /* Säulendiagramm mit abgeschnittener Hochachse (irreführend) */
  function barsCut(vals, names, ymin, ymax, step) {
    var x0 = 60, x1 = 330, yb = 196, yt = 24;
    function Y(v) { return f1(yb - (v - ymin) / (ymax - ymin) * (yb - yt)); }
    var g = '<svg class="viz" viewBox="0 0 360 236" role="img" aria-label="Säulendiagramm" style="max-width:380px">';
    var lstep = (ymax - ymin) / step > 8 ? 2 * step : step;
    for (var v = ymin; v <= ymax + 1e-9; v += step) g += '<line x1="' + x0 + '" y1="' + Y(v) + '" x2="' + x1 + '" y2="' + Y(v) + '" stroke="#e3dcf2"/>' + ((v - ymin) % lstep === 0 ? '<text x="' + (x0 - 6) + '" y="' + (Y(v) + 4) + '" font-size="12" text-anchor="end" fill="#5a5670">' + v + ' %</text>' : '');
    g += '<line x1="' + x0 + '" y1="' + yt + '" x2="' + x0 + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.5"/><line x1="' + x0 + '" y1="' + yb + '" x2="' + x1 + '" y2="' + yb + '" stroke="#1c1830" stroke-width="1.5"/>';
    var bw = 70, gap = (x1 - x0 - vals.length * bw) / (vals.length + 1);
    vals.forEach(function (val, i) {
      var bx = x0 + gap + i * (bw + gap);
      g += '<rect x="' + f1(bx) + '" y="' + Y(val) + '" width="' + bw + '" height="' + f1(yb - Y(val)) + '" fill="' + COLS[i] + '"/><text x="' + f1(bx + bw / 2) + '" y="' + (Y(val) - 6) + '" font-size="13" font-weight="700" text-anchor="middle">' + fmt(val) + ' %</text><text x="' + f1(bx + bw / 2) + '" y="' + (yb + 18) + '" font-size="13" text-anchor="middle">' + names[i] + '</text>';
    });
    return g + '</svg>';
  }

  var CTX = [
    { t: 'Schulweg', q: 'Wie kommst du meistens zur Schule?', cats: ['Bus', 'Fahrrad', 'zu Fuß', 'Auto'] },
    { t: 'Pausensnack', q: 'Was isst du am liebsten in der Pause?', cats: ['Brot', 'Obst', 'Müsliriegel', 'Joghurt'] },
    { t: 'Lieblingssport', q: 'Welche Sportart magst du am liebsten?', cats: ['Fußball', 'Handball', 'Schwimmen', 'Turnen'] },
    { t: 'AG-Wahl', q: 'Welche AG möchtest du wählen?', cats: ['Theater', 'Robotik', 'Chor', 'Kunst'] },
    { t: 'Mensa-Essen', q: 'Welches Mensa-Essen ist dein Favorit?', cats: ['Nudeln', 'Pizza', 'Salat', 'Suppe'] },
    { t: 'Freizeit', q: 'Was machst du am liebsten in der Freizeit?', cats: ['Sport', 'Musik', 'Lesen', 'Gaming'] }];
  function who(T) { return M.pick(T <= 30 ? ['in der Klasse 8a', 'in der Klasse 8c', 'in deiner Klasse'] : T <= 72 ? ['in den 8. Klassen', 'in der Mittagspause', 'in der Ganztags-AG-Zeit'] : ['im Jahrgang 8', 'an der ganzen Schule', 'beim Schulfest']); }
  /* k Anzahlen mit Summe T, jede ein Vielfaches von step, jede mindestens etwa minShare von T, alle verschieden */
  function split(T, k, step, minShare) {
    var m = Math.max(step, Math.ceil(T * (minShare || 0.07) / step) * step);
    for (var t = 0; t < 2000; t++) {
      var c = [], hi = Math.floor(T / step / (k - 1) * 1.3);
      for (var i = 0; i < k - 1; i++) c.push(step * M.rnd(m / step, Math.max(m / step, hi)));
      var last = T - sum(c);
      if (last < m || last > T * 0.6) continue;
      c.push(last);
      if (new Set(c).size !== c.length) continue;
      return M.shuffle(c);
    }
    return null;
  }
  function survey(T, step, minShare) {
    var ctx = M.pick(CTX), c = split(T, 4, step || 1, minShare);
    return { ctx: ctx, c: c, T: T, who: who(T) };
  }
  function table(names, vals, head) {
    return '<div style="overflow-x:auto"><table class="tab"><tr><th>' + head[0] + '</th><th>' + head[1] + '</th></tr>' + names.map(function (n, i) { return '<tr><td>' + n + '</td><td>' + vals[i] + '</td></tr>'; }).join('') + '</table></div>';
  }
  function intro(s) { return 'Bei einer Umfrage ' + s.who + ' wurden ' + s.T + ' Schülerinnen und Schüler gefragt: „' + s.ctx.q + '“'; }

  var gen = {
    relH: function (lvl) {
      var T = M.pick(lvl === 1 ? [20, 25, 50] : [20, 25, 40, 50]), s = survey(T, 1), i = M.rnd(0, 3), n = s.c[i], cat = s.ctx.cats[i];
      var rf = M.red(F(n, T)), dec = r3(n / T), p = r3(n * 100 / T);
      var inputs = [{ kind: 'frac', answer: rf, reduce: true, label: 'als Bruch (gekürzt)', placeholder: 'z. B. 3/10' }];
      if (lvl >= 2) inputs.push({ kind: 'num', answer: dec, label: 'als Dezimalzahl', placeholder: 'z. B. 0,3' });
      inputs.push({ kind: 'num', answer: p, label: 'in Prozent', unit: '%' });
      return { skill: 'Relative Häufigkeit bestimmen', q: intro(s) + table(s.ctx.cats, s.c, ['Antwort', 'Anzahl']) + 'Gib die <b>relative Häufigkeit</b> der Antwort „' + cat + '“ an.', inputs: inputs,
        hints: ['Relative Häufigkeit = absolute Häufigkeit : Gesamtzahl. Wie viele haben „' + cat + '“ gesagt, wie viele wurden insgesamt befragt?', 'Bruch: ' + frac(n, T) + '. Kürze ihn' + (M.gcd(n, T) > 1 ? ' mit ' + M.gcd(n, T) : '') + '.', 'Für die Dezimalzahl rechnest du ' + n + ' : ' + T + ' = ' + fmt(dec) + '. Für Prozent multiplizierst du mit 100.'],
        solution: 'Relative Häufigkeit: ' + frac(n, T) + (M.gcd(n, T) > 1 ? ' = ' + fh(rf) : '') + ' = ' + n + ' : ' + T + ' = ' + fmt(dec) + ' = ' + pc(p) + '.',
        mistakes: function (v) {
          var f = M.parseFrac(v[0]);
          if (f && M.feq(f, F(n, T - n))) return 'Du hast „' + cat + '“ mit den <b>übrigen</b> Antworten verglichen. Teile durch die <b>Gesamtzahl</b> ' + T + '.';
          var last = M.parseNum(v[v.length - 1]);
          if (last === n && n !== p) return 'Bei Prozent hast du die absolute Häufigkeit ' + n + ' eingetragen. Rechne ' + frac(n, T) + ' in Prozent um.';
          return null;
        },
        verify: function () { return sum(s.c) === T && Math.abs(dec * 100 - p) < 1e-9 && Math.abs(rf.n / rf.d - dec) < 1e-9 ? true : 'Umrechnung passt nicht'; } };
    },
    absH: function (lvl) {
      var T, p, k = 0;
      do { T = M.pick([60, 80, 120, 140, 150, 160, 180, 200, 240, 250, 300]); p = lvl === 1 ? M.pick([10, 20, 25, 50]) : 5 * M.rnd(1, 15); k++; } while ((T * p) % 100 !== 0 && k < 200);
      if ((T * p) % 100) { T = 200; p = 35; }
      var ctx = M.pick(CTX), cat = M.pick(ctx.cats), x = T * p / 100, asDec = lvl >= 2 && Math.random() < 0.5;
      var shown = asDec ? 'die relative Häufigkeit ' + fmt(p / 100) : 'der Anteil ' + p + ' %';
      return { skill: 'Absolute Häufigkeit berechnen', q: 'Im Jahrgang 8 wurden ' + T + ' Schülerinnen und Schüler gefragt: „' + ctx.q + '“ Für die Antwort „' + cat + '“ beträgt ' + shown + '. Wie viele Befragte haben „' + cat + '“ geantwortet?', inputs: [{ kind: 'num', answer: x, label: 'Anzahl' }],
        hints: ['Absolute Häufigkeit = relative Häufigkeit · Gesamtzahl.', asDec ? 'Rechne ' + fmt(p / 100) + ' · ' + T + '.' : p + ' % = ' + fmt(p / 100) + '. Rechne ' + fmt(p / 100) + ' · ' + T + '.', 'Oder mit dem Dreisatz: 1 % sind ' + fmt(T / 100) + ' Personen, also ' + p + ' % sind ' + p + ' · ' + fmt(T / 100) + '.'],
        solution: fmt(p / 100) + ' · ' + T + ' = ' + x + '. Also haben ' + x + ' Befragte „' + cat + '“ geantwortet.',
        verify: function () { return Math.abs(x / T * 100 - p) < 1e-9 && x === Math.round(x) ? true : 'nicht ganzzahlig'; } };
    },
    winkel: function (lvl) {
      var T = M.pick([20, 30, 36, 40, 60, 72, 90, 120, 180]), s = survey(T, 1, 0.08), idx = M.shuffle([0, 1, 2, 3]).slice(0, lvl === 1 ? 1 : lvl === 2 ? 2 : 3);
      var ang = s.c.map(function (n) { return n * 360 / T; });
      return { skill: 'Winkel im Kreisdiagramm berechnen', q: intro(s) + table(s.ctx.cats, s.c, ['Antwort', 'Anzahl']) + 'Die Ergebnisse sollen in einem Kreisdiagramm dargestellt werden. Berechne den Mittelpunktswinkel für ' + idx.map(function (i) { return '„' + s.ctx.cats[i] + '“'; }).join(idx.length === 2 ? ' und ' : ', ') + '.',
        inputs: idx.map(function (i) { return { kind: 'num', answer: ang[i], label: s.ctx.cats[i], unit: '°' }; }),
        hints: ['Der ganze Kreis hat 360°. Er steht für alle ' + T + ' Befragten.', 'Eine Person entspricht 360° : ' + T + ' = ' + fmt(360 / T) + '°.', 'Winkel = Anzahl · ' + fmt(360 / T) + '°. Für „' + s.ctx.cats[idx[0]] + '“: ' + s.c[idx[0]] + ' · ' + fmt(360 / T) + '°.'],
        solution: idx.map(function (i) { return s.ctx.cats[i] + ': ' + frac(s.c[i], T) + ' · 360° = ' + ang[i] + '°'; }).join('<br>') + pie(s.ctx.cats.map(function (c, i) { return { name: c, v: s.c[i], lab: ang[i] + '°' }; })),
        mistakes: function (v) {
          for (var k = 0; k < idx.length; k++) { var x = M.parseNum(v[k]), i = idx[k]; if (x === null || Math.abs(x - ang[i]) < 1e-9) continue;
            if (Math.abs(x - r3(s.c[i] * 100 / T)) < 0.06) return 'Bei „' + s.ctx.cats[i] + '“ hast du den Prozentsatz eingetragen. Der Winkel ist der Anteil von <b>360°</b>, nicht von 100.';
            if (x === s.c[i]) return 'Bei „' + s.ctx.cats[i] + '“ steht die Anzahl. Multipliziere den Anteil ' + frac(s.c[i], T) + ' mit 360°.'; }
          return null;
        },
        verify: function () { return Math.abs(sum(ang) - 360) < 1e-9 && ang.every(function (a) { return a === Math.round(a); }) ? true : 'Winkelsumme ≠ 360'; } };
    },
    ablesen: function (lvl) {
      var T = lvl === 1 ? M.pick([20, 40, 50, 200]) : lvl === 2 ? M.pick([20, 30, 36, 40, 60, 72, 90, 120, 180]) : M.pick([20, 40]);
      var s = survey(T, T === 50 ? 1 : T === 200 ? 5 : 1, 0.08), i = M.rnd(0, 3), n = s.c[i], cat = s.ctx.cats[i];
      var ang = s.c.map(function (x) { return x * 360 / T; }), pr = s.c.map(function (x) { return r3(x * 100 / T); });
      var labs = s.c.map(function (x, k) { return lvl === 1 ? pc(pr[k]) : ang[k] + '°'; });
      var inputs = lvl === 3 ? [{ kind: 'num', answer: pr[i], label: 'Anteil in Prozent', unit: '%' }, { kind: 'num', answer: n, label: 'Anzahl' }] : [{ kind: 'num', answer: n, label: 'Anzahl' }];
      return { skill: 'Kreisdiagramm ablesen', q: 'Das Kreisdiagramm zeigt das Ergebnis einer Umfrage mit ' + T + ' Befragten: „' + s.ctx.q + '“' + pie(s.ctx.cats.map(function (c, k) { return { name: c, v: s.c[k], lab: labs[k] }; })) + (lvl === 3 ? 'Wie viel Prozent und wie viele Befragte' : 'Wie viele Befragte') + ' haben „' + cat + '“ gewählt?', inputs: inputs,
        hints: lvl === 1 ? ['Der ganze Kreis steht für alle ' + T + ' Befragten, also 100 %.', 'Lies den Prozentsatz für „' + cat + '“ ab: ' + pc(pr[i]) + '.', 'Rechne ' + fmt(pr[i] / 100) + ' · ' + T + '.'] :
          ['Der ganze Kreis hat 360° und steht für alle ' + T + ' Befragten.', 'Der Anteil von „' + cat + '“ ist ' + frac(ang[i], 360) + ' = ' + fh(F(ang[i], 360)) + '.', 'Anzahl = ' + fh(F(ang[i], 360)) + ' · ' + T + (lvl === 3 ? '. Für Prozent: ' + fh(F(ang[i], 360)) + ' · 100 %.' : '.')],
        solution: (lvl === 1 ? pc(pr[i]) + ' von ' + T + ': ' + fmt(pr[i] / 100) + ' · ' + T + ' = ' + n + '.' : 'Anteil: ' + frac(ang[i], 360) + ' = ' + fh(F(ang[i], 360)) + (lvl === 3 ? ' = ' + pc(pr[i]) : '') + '. Anzahl: ' + fh(F(ang[i], 360)) + ' · ' + T + ' = ' + n + '.'),
        mistakes: function (v) { var x = M.parseNum(v[v.length - 1]); if (lvl > 1 && x === ang[i] && x !== n) return 'Das ist der Winkel, nicht die Anzahl. Rechne ' + ang[i] + '° : 360° · ' + T + '.'; if (lvl === 1 && Math.abs(x - pr[i]) < 1e-9 && x !== n) return 'Das ist der Prozentsatz. Gesucht ist die Anzahl der Personen: ' + pc(pr[i]) + ' von ' + T + '.'; return null; },
        verify: function () { return Math.abs(n * 360 - ang[i] * T) < 1e-6 && Math.abs(pr[i] * T / 100 - n) < 0.01 && sum(s.c) === T ? true : 'Ablesen passt nicht'; } };
    },
    winkelProzent: function (lvl) {
      if (lvl === 1 || (lvl === 2 && Math.random() < 0.4)) {
        var p = 5 * M.rnd(1, 14), a = r3(p * 3.6);
        return { skill: 'Prozent in Winkel umrechnen', q: 'Ein Kreisausschnitt steht für <b>' + p + ' %</b> aller Befragten. Wie groß ist sein Mittelpunktswinkel?', inputs: [{ kind: 'num', answer: a, label: 'Winkel', unit: '°' }],
          hints: ['100 % entsprechen dem ganzen Kreis, also 360°.', '1 % entspricht 360° : 100 = 3,6°.', 'Rechne ' + p + ' · 3,6°.'],
          solution: p + ' % von 360° = ' + fmt(p / 100) + ' · 360° = ' + fmt(a) + '°.',
          mistakes: function (v) { var x = M.parseNum(v[0]); if (x === p) return 'Prozent und Grad sind nicht dasselbe. 100 % sind 360°, also ist 1 % gleich 3,6°.'; return null; },
          verify: function () { return Math.abs(a / 360 * 100 - p) < 1e-9 ? true : 'falsch'; } };
      }
      var ang = lvl === 3 ? M.pick([45, 135, 225, 30, 150, 60, 120, 240, 270, 315, 20, 40]) : 18 * M.rnd(1, 14), f = M.red(F(ang, 360)), pp = r3(ang / 3.6);
      var inputs = (lvl === 3 ? [{ kind: 'frac', answer: f, reduce: true, label: 'Anteil als Bruch (gekürzt)' }] : []).concat([{ kind: 'num', answer: pp, label: 'Anteil in Prozent', unit: '%', tol: lvl === 3 ? 0.05 : 1e-9 }]);
      return { skill: 'Winkel in Prozent umrechnen', q: 'Ein Kreisausschnitt hat einen Mittelpunktswinkel von <b>' + ang + '°</b>. Welchen Anteil am Ganzen stellt er dar?' + (lvl === 3 && Math.abs(pp * 10 - Math.round(pp * 10)) > 1e-9 ? ' Runde den Prozentsatz auf eine Nachkommastelle.' : ''), inputs: inputs,
        hints: ['Der ganze Kreis (360°) ist das Ganze, also 100 %.', 'Anteil = ' + frac(ang, 360) + (M.gcd(ang, 360) > 1 ? ' = ' + fh(f) : '') + '.', 'In Prozent: ' + ang + ' : 3,6 = ' + fmt(f1(pp)) + ' %' + (Math.abs(pp - f1(pp)) > 1e-9 ? ' (gerundet)' : '') + '.'],
        solution: frac(ang, 360) + (M.gcd(ang, 360) > 1 ? ' = ' + fh(f) : '') + (Math.abs(pp - f1(pp)) > 1e-9 ? ' ≈ ' : ' = ') + fmt(f1(pp)) + ' %.',
        mistakes: function (v) { var x = M.parseNum(v[v.length - 1]); if (x === ang) return 'Grad und Prozent sind nicht dasselbe. Teile den Winkel durch 360° und rechne dann in Prozent um.'; return null; },
        verify: function () { return Math.abs(f.n / f.d * 360 - ang) < 1e-9 ? true : 'falsch'; } };
    },
    streifen: function (lvl) {
      var ctx = M.pick(CTX), pr = split(100, 4, 5, 0.1);
      if (lvl === 1) {
        var i = M.rnd(0, 3);
        return { skill: 'Streifendiagramm ablesen', q: 'Das Streifendiagramm zeigt die Antworten auf die Frage „' + ctx.q + '“' + stripe(ctx.cats.map(function (c, k) { return { name: c, v: pr[k] }; }), { ticks: true }) + 'Wie viel Prozent haben „' + ctx.cats[i] + '“ gewählt?', inputs: [{ kind: 'num', answer: pr[i], label: ctx.cats[i], unit: '%' }],
          hints: ['Der ganze Streifen steht für 100 %. Die kleinen Striche unten markieren Schritte von 5 %.', 'Lies ab, wo der Abschnitt „' + ctx.cats[i] + '“ beginnt und wo er endet.', 'Prozentsatz = Ende − Anfang. Der Abschnitt beginnt bei ' + sum(pr.slice(0, i)) + ' %.'],
          solution: 'Der Abschnitt „' + ctx.cats[i] + '“ reicht von ' + sum(pr.slice(0, i)) + ' % bis ' + sum(pr.slice(0, i + 1)) + ' %. Das sind ' + pr[i] + ' %.',
          verify: function () { return sum(pr) === 100 ? true : 'Summe ≠ 100'; } };
      }
      var L = M.pick([10, 12, 20]), j = M.rnd(0, 3), len = r3(L * pr[j] / 100);
      return { skill: 'Streifendiagramm zeichnen', q: 'Bei einer Umfrage „' + ctx.q + '“ kam heraus:' + table(ctx.cats, pr.map(function (x) { return x + ' %'; }), ['Antwort', 'Anteil']) + 'Du zeichnest ein Streifendiagramm, das insgesamt <b>' + L + ' cm</b> lang ist. Wie lang wird der Abschnitt für „' + ctx.cats[j] + '“?' + stripe(ctx.cats.map(function (c, k) { return { name: c, v: pr[k], lab: k === j ? '?' : pr[k] + ' %' }; })),
        inputs: [{ kind: 'num', answer: len, label: 'Länge', unit: 'cm', tol: 0.005 }],
        hints: ['Der ganze Streifen (' + L + ' cm) steht für 100 %.', '1 % entspricht ' + L + ' cm : 100 = ' + fmt(L / 100) + ' cm.', 'Rechne ' + pr[j] + ' · ' + fmt(L / 100) + ' cm.'],
        solution: pr[j] + ' % von ' + L + ' cm = ' + fmt(pr[j] / 100) + ' · ' + L + ' cm = ' + fmt(len) + ' cm.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === pr[j]) return 'Das ist der Prozentsatz. Gesucht ist die Länge in cm: ' + pr[j] + ' % von ' + L + ' cm.'; return null; },
        verify: function () { return Math.abs(len / L * 100 - pr[j]) < 1e-9 && sum(pr) === 100 ? true : 'Länge falsch'; } };
    },
    vergleich: function (lvl) {
      var A, B, a, b, trap = Math.random() < 0.65, t = 0;
      do {
        A = M.pick([20, 25]); B = A === 20 ? 25 : 20; if (Math.random() < 0.5) { var tmp = A; A = B; B = tmp; }
        a = M.rnd(5, A - 4); b = M.rnd(5, B - 4); t++;
      } while ((a * B === b * A || a === b || (trap ? (a > b) === (a * B > b * A) : (a > b) !== (a * B > b * A))) && t < 500);
      var pa = a * 100 / A, pb = b * 100 / B, act = M.pick([['fahren', 'mit dem Fahrrad zur Schule'], ['sind', 'im Sportverein'], ['lesen', 'regelmäßig Bücher'], ['spielen', 'ein Instrument'], ['essen', 'mittags in der Mensa']]);
      var ans = pa > pb ? 0 : 1, absBig = a > b ? 0 : 1;
      return { skill: 'Absolute und relative Häufigkeit vergleichen', q: 'In der Klasse 8a mit ' + A + ' Schülerinnen und Schülern ' + act[0] + ' <b>' + a + '</b> ' + act[1] + '. In der 8b mit ' + B + ' Schülerinnen und Schülern sind es <b>' + b + '</b>.<br>Berechne die Anteile in Prozent. In welcher Klasse ist der <b>Anteil</b> größer?',
        inputs: [{ kind: 'num', answer: pa, label: 'Anteil 8a', unit: '%' }, { kind: 'num', answer: pb, label: 'Anteil 8b', unit: '%' }, { kind: 'mc', label: 'Der Anteil ist größer in …', options: ['der Klasse 8a', 'der Klasse 8b', 'beiden Klassen gleich'], answer: ans }],
        hints: ['Anteile kannst du nur vergleichen, wenn du durch die jeweilige Klassengröße teilst.', '8a: ' + frac(a, A) + ', 8b: ' + frac(b, B) + '.', 'In Prozent: 8a: ' + a + ' : ' + A + ' · 100, 8b: ' + b + ' : ' + B + ' · 100.'],
        solution: '8a: ' + frac(a, A) + ' = ' + pc(pa) + ', 8b: ' + frac(b, B) + ' = ' + pc(pb) + '. Der Anteil ist in der ' + (ans ? '8b' : '8a') + ' größer' + (absBig !== ans ? ', obwohl es dort weniger Personen sind. Die Klassen sind unterschiedlich groß.' : '.'),
        mistakes: function (v) { if (+v[2] === absBig && absBig !== ans) return 'Du hast die Anzahlen verglichen. Die Klassen sind aber unterschiedlich groß. Vergleiche die <b>relativen</b> Häufigkeiten.'; return null; },
        verify: function () { return ((a / A > b / B) ? 0 : 1) === ans && pa !== pb ? true : 'Vergleich falsch'; } };
    },
    fehlend: function (lvl) {
      var ctx = M.pick(CTX), pr = split(100, 4, 5, 0.1), j = M.rnd(0, 3), ang = pr[j] * 3.6;
      return { skill: 'Fehlenden Anteil ergänzen', q: 'Bei einer Umfrage „' + ctx.q + '“ fehlt in der Tabelle ein Wert.' + table(ctx.cats, pr.map(function (x, k) { return k === j ? '?' : x + ' %'; }), ['Antwort', 'Anteil']) + 'Wie viel Prozent haben „' + ctx.cats[j] + '“ gewählt? Wie groß wird der Winkel im Kreisdiagramm?',
        inputs: [{ kind: 'num', answer: pr[j], label: 'Anteil', unit: '%' }, { kind: 'num', answer: r3(ang), label: 'Winkel', unit: '°' }],
        hints: ['Alle Anteile zusammen ergeben 100 %.', '100 % − ' + pr.filter(function (x, k) { return k !== j; }).join(' % − ') + ' % = ' + pr[j] + ' %.', 'Winkel = ' + pr[j] + ' · 3,6°.'],
        solution: 'Anteil: 100 % − ' + pr.filter(function (x, k) { return k !== j; }).join(' % − ') + ' % = ' + pr[j] + ' %. Winkel: ' + fmt(pr[j] / 100) + ' · 360° = ' + fmt(r3(ang)) + '°.',
        mistakes: function (v) { var x = M.parseNum(v[1]); if (x === pr[j]) return 'Beim Winkel steht noch der Prozentsatz. 1 % entspricht 3,6°.'; return null; },
        verify: function () { return sum(pr) === 100 && Math.abs(ang - pr[j] / 100 * 360) < 1e-9 ? true : 'falsch'; } };
    },
    irrefuehrend: function () {
      var v = M.rnd(0, 2), opts, right, q;
      if (v === 0) {
        var p = M.rnd(51, 55), o = 100 - p, ymin = o - 2, ratio = Math.round((p - ymin) / (o - ymin));
        var names = M.pick([['Lena', 'Max'], ['Aylin', 'Jonas'], ['Mia', 'Ben']]);
        q = 'Bei der Wahl zur Schülersprecherin bzw. zum Schülersprecher erhält ' + names[0] + ' ' + p + ' % und ' + names[1] + ' ' + o + ' % der Stimmen. Die Schülerzeitung zeigt dieses Diagramm:' + barsCut([p, o], names, ymin, p + 1, 1) + 'Welche Aussage über das Diagramm stimmt?';
        right = 'Die Hochachse beginnt erst bei ' + ymin + ' %. Dadurch sieht der Unterschied viel größer aus, als er ist.';
        opts = [right, names[0] + ' hat etwa ' + ratio + '-mal so viele Stimmen wie ' + names[1] + ', das sieht man an den Säulen.', 'Das Diagramm ist in Ordnung, weil die Prozentzahlen über den Säulen stimmen.', 'Das Diagramm zeigt, dass fast alle für ' + names[0] + ' gestimmt haben.'];
      } else if (v === 1) {
        var ap = M.shuffle([['Messenger', 5 * M.rnd(15, 18)], ['Video-App', 5 * M.rnd(10, 13)], ['Spiele-App', 5 * M.rnd(6, 9)]]);
        var tot = ap[0][1] + ap[1][1] + ap[2][1];
        q = 'In einer Umfrage durfte man <b>mehrere</b> Antworten ankreuzen: „Welche Apps nutzt du täglich?“ Ergebnis:' + table(ap.map(function (x) { return x[0]; }), ap.map(function (x) { return x[1] + ' %'; }), ['App', 'Anteil']) + 'Tim möchte das Ergebnis als Kreisdiagramm darstellen. Was meinst du?';
        right = 'Das geht nicht gut: Die Anteile ergeben zusammen ' + tot + ' %, also mehr als 100 %. Ein Kreisdiagramm zeigt aber die Teile eines Ganzen.';
        opts = [right, 'Das geht gut, weil alle Werte in Prozent angegeben sind.', 'Tim muss nur jeden Prozentsatz mit 3,6° multiplizieren, dann passt es.', 'Das geht nur, wenn er die Werte vorher der Größe nach ordnet.'];
      } else {
        var sm = M.pick([[4, 3], [5, 4], [8, 6], [8, 7]]), pp = sm[1] * 100 / sm[0];
        q = 'Ole fragt in der Pause ' + sm[0] + ' Freunde aus seiner Fußballmannschaft, ob sie mehr Sportunterricht wollen. ' + sm[1] + ' sagen ja. Er schreibt in die Schülerzeitung: „' + fmt(pp) + ' % aller Schülerinnen und Schüler unserer Schule wollen mehr Sport!“ Wie beurteilst du die Aussage?';
        right = 'Die Aussage ist nicht haltbar: Er hat nur ' + sm[0] + ' Personen befragt, und alle spielen Fußball. Das ist nicht typisch für die ganze Schule.';
        opts = [right, 'Die Aussage stimmt, denn ' + sm[1] + ' von ' + sm[0] + ' sind wirklich ' + fmt(pp) + ' %.', 'Die Aussage stimmt nur, wenn er die Zahl in Grad umrechnet.', 'Die Aussage wäre richtig, wenn er die absolute Häufigkeit ' + sm[1] + ' angibt.'];
      }
      var sh = M.shuffle(opts);
      return { skill: 'Darstellungen beurteilen', level: 3, q: q, inputs: [{ kind: 'mc', label: 'Wähle die zutreffende Aussage', options: sh, answer: sh.indexOf(right) }],
        hints: [v === 0 ? 'Schau dir die Hochachse genau an. Wo beginnt sie?' : v === 1 ? 'Addiere alle Prozentsätze.' : 'Wie viele Personen wurden befragt? Und wer wurde befragt?', v === 0 ? 'Vergleiche die Prozentzahlen selbst. Ist der Unterschied wirklich so groß?' : v === 1 ? 'Ein Kreis kann nur einmal 100 % (360°) verteilen.' : 'Für eine Aussage über alle braucht man viele und verschiedene Befragte.', 'Lies alle Antworten genau und prüfe sie einzeln.'],
        solution: right };
    },
    rueckwaerts: function () {
      var T = M.pick([24, 30, 36, 40, 45, 60, 72]), ctx = { q: 'Wohin soll unsere Klassenfahrt gehen?', cats: ['Berlin', 'Hamburg', 'Harz', 'Nordsee'] }, c = split(T, 4, 1, 0.1);
      var ang = c.map(function (x) { return x * 360 / T; });
      if (!ang.every(function (a) { return a === Math.round(a); })) return gen.rueckwaerts();
      var i = M.rnd(0, 3), j = (i + M.rnd(1, 3)) % 4;
      return { skill: 'Gesamtzahl aus dem Kreisdiagramm', level: 3, q: 'Alle Schülerinnen und Schüler des Jahrgangs wurden gefragt: „' + ctx.q + '“ Das Kreisdiagramm zeigt das Ergebnis.' + pie(ctx.cats.map(function (x, k) { return { name: x, v: c[k], lab: ang[k] + '°' }; })) + 'Für das Ziel <b>' + ctx.cats[i] + '</b> haben ' + c[i] + ' gestimmt.<br>a) Wie viele wurden insgesamt befragt?<br>b) Wie viele haben für das Ziel ' + ctx.cats[j] + ' gestimmt?',
        inputs: [{ kind: 'num', answer: T, label: 'a) insgesamt' }, { kind: 'num', answer: c[j], label: 'b) ' + ctx.cats[j] }],
        hints: [c[i] + ' Personen entsprechen ' + ang[i] + '°. Wie viel Grad entspricht eine Person?', 'Eine Person: ' + ang[i] + '° : ' + c[i] + ' = ' + fmt(ang[i] / c[i]) + '°. Der ganze Kreis hat 360°.', 'Insgesamt: 360° : ' + fmt(ang[i] / c[i]) + '° = ' + T + '. Für ' + ctx.cats[j] + ': ' + ang[j] + '° : ' + fmt(ang[i] / c[i]) + '°.'],
        solution: 'Eine Person entspricht ' + ang[i] + '° : ' + c[i] + ' = ' + fmt(ang[i] / c[i]) + '°. a) 360° : ' + fmt(ang[i] / c[i]) + '° = ' + T + ' Befragte. b) ' + ang[j] + '° : ' + fmt(ang[i] / c[i]) + '° = ' + c[j] + ' Personen.',
        verify: function () { return sum(c) === T && c[j] * 360 === ang[j] * T && c[i] * 360 === ang[i] * T ? true : 'Rückrechnung falsch'; } };
    }
  };

  var EX = [['Bus', 14], ['Fahrrad', 12], ['zu Fuß', 10], ['Auto', 4]];
  return {
    id: '027', title: 'Relative Häufigkeit und Kreisdiagramme', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Brüche kürzen, Prozente berechnen, Winkel bis 360°',
    lead: 'In der 8b fahren mehr Kinder Rad als in der 8a. Ist die 8b deshalb „fahrradverrückter“? Du lernst, Umfragen fair zu vergleichen und als Kreisdiagramm darzustellen.',
    einstieg: { html: '<p>Die Schülervertretung will wissen, wie die Klassen zur Schule kommen. In der <b>8a</b> fahren <b>12</b> Kinder mit dem Fahrrad, in der <b>8b</b> sind es <b>14</b>. Die 8b freut sich schon: „Wir sind die Fahrradklasse!“</p><p class="note">Ist das gerecht? Die 8a hat 24 Schülerinnen und Schüler, die 8b hat 28. Was fällt dir auf, wenn du die Anteile vergleichst?</p><p>In beiden Klassen fährt genau <b>die Hälfte</b> mit dem Rad. Die Anzahl allein sagt also wenig. In diesem Modul lernst du, mit <b>relativen Häufigkeiten</b> zu vergleichen und Ergebnisse in <b>Kreis- und Streifendiagrammen</b> darzustellen.</p>' },
    ziele: ['Ich unterscheide absolute und relative Häufigkeit.', 'Ich gebe relative Häufigkeiten als Bruch, Dezimalzahl und in Prozent an.', 'Ich berechne die Winkel für ein Kreisdiagramm und zeichne Streifendiagramme.', 'Ich lese Werte aus Kreis- und Streifendiagrammen ab.', 'Ich beurteile Darstellungen und erkenne irreführende Diagramme.'],
    fachwoerter: [['Absolute Häufigkeit', 'Wie oft eine Antwort vorkommt, also die Anzahl. Beispiel: 12 Kinder.'], ['Relative Häufigkeit', 'Der Anteil an allen: absolute Häufigkeit geteilt durch die Gesamtzahl. Beispiel: 12 von 24 = ' + frac(1, 2) + ' = 50 %.'], ['Kreisdiagramm', 'Ein Kreis wird in Ausschnitte geteilt. Jeder Ausschnitt zeigt einen Anteil am Ganzen.'], ['Mittelpunktswinkel', 'Der Winkel eines Kreisausschnitts am Mittelpunkt. Der ganze Kreis hat 360°.'], ['Streifendiagramm', 'Ein Streifen wird in Abschnitte geteilt. Die Länge jedes Abschnitts zeigt den Anteil.']],
    diagnose: [
      { q: 'Wie viel Prozent sind ' + frac(3, 4) + '?', options: ['75 %', '34 %', '0,75 %', 'Weiß ich noch nicht'], answer: 0, why: frac(3, 4) + ' = 0,75 = 75 %.', review: 'Brüche, Dezimalzahlen und Prozent umwandeln (Klasse 6/7)' },
      { q: 'Wie viel sind 20 % von 50 Personen?', options: ['10 Personen', '20 Personen', '2,5 Personen', 'Weiß ich noch nicht'], answer: 0, why: '0,2 · 50 = 10.', review: 'Prozentwert berechnen (Klasse 7)' },
      { q: 'Wie groß ist der Winkel eines ganzen Kreises (Vollwinkel)?', options: ['360°', '180°', '100°', 'Weiß ich noch nicht'], answer: 0, why: 'Eine volle Drehung hat 360°.', review: 'Winkel und Winkelarten' },
      { q: 'Kürze den Bruch ' + frac(12, 30) + ' vollständig.', options: [frac(2, 5), frac(4, 10), frac(6, 15), 'Weiß ich noch nicht'], answer: 0, why: '12 und 30 haben den größten gemeinsamen Teiler 6: ' + frac(12, 30) + ' = ' + frac(2, 5) + '.', review: 'Brüche kürzen (Klasse 6)' }],
    erklaerung:
      '<h3>1. Absolute und relative Häufigkeit</h3><p>Bei einer Umfrage zählst du, wie oft jede Antwort vorkommt. Diese Anzahl heißt <b>absolute Häufigkeit</b>. Willst du verschieden große Gruppen vergleichen, brauchst du den <b>Anteil</b> an allen Befragten.</p>' +
      '<div class="merk"><b>Merke:</b> <span class="big-math">relative Häufigkeit = <span class="frac"><span>absolute Häufigkeit</span><span>Gesamtzahl</span></span></span><br>Du kannst sie als Bruch, als Dezimalzahl oder in Prozent angeben. Alle relativen Häufigkeiten zusammen ergeben 1, also 100 %.</div>' +
      '<p>Beispiel: 40 Kinder wurden nach ihrem Schulweg gefragt. 14 fahren Bus. Die relative Häufigkeit ist ' + frac(14, 40) + ' = 0,35 = 35 %.</p><div style="overflow-x:auto"><table class="tab"><tr><th>Antwort</th><th>Anzahl</th><th>Anteil</th><th>Winkel</th></tr>' + EX.map(function (e) { return '<tr><td>' + e[0] + '</td><td>' + e[1] + '</td><td style="white-space:nowrap">' + frac(e[1], 40) + ' = ' + fmt(e[1] * 2.5) + ' %</td><td>' + e[1] * 9 + '°</td></tr>'; }).join('') + '<tr><th>Summe</th><th>40</th><th>100 %</th><th>360°</th></tr></table></div>' +
      '<h3>2. Das Kreisdiagramm</h3><p>Der ganze Kreis (360°) steht für alle Befragten. Jede Antwort bekommt einen Ausschnitt, der genau so groß ist wie ihr Anteil.</p>' +
      '<div class="merk"><b>Merke:</b> <span class="big-math">Winkel = relative Häufigkeit · 360°</span><br>1 % entspricht 3,6°. Zur Kontrolle: Alle Winkel zusammen ergeben 360°.</div>' +
      '<p>Bus: ' + frac(14, 40) + ' · 360° = 126°. So rechnest du für jede Antwort. Dann zeichnest du die Winkel mit dem Geodreieck nacheinander ab.</p>' + pie(EX.map(function (e) { return { name: e[0], v: e[1], lab: e[1] * 9 + '°' }; }), { label: 'Kreisdiagramm Schulweg' }) +
      '<h3>3. Das Streifendiagramm</h3><p>Ein Streifen fester Länge steht für 100 %. Ist er 10 cm lang, entspricht 1 % genau 1 mm. Die Abschnitte sind so lang wie die Anteile.</p>' + stripe(EX.map(function (e) { return { name: e[0], v: e[1], lab: fmt(e[1] * 2.5) + ' %' }; }), { ticks: true }) +
      '<h3>4. Darstellungen beurteilen</h3><ul><li>Vergleiche verschieden große Gruppen immer über die <b>relative</b> Häufigkeit.</li><li>Achte bei Säulendiagrammen darauf, wo die Hochachse beginnt. Beginnt sie nicht bei 0, wirken Unterschiede größer.</li><li>Ein Kreisdiagramm passt nur, wenn die Anteile zusammen 100 % ergeben (keine Mehrfachnennungen).</li><li>Wenige oder einseitig ausgewählte Befragte erlauben keine Aussage über alle.</li></ul>',
    entdecken: {
      html: '<p>Stelle eine eigene Umfrage ein. Verändere die Anzahlen. Das Kreisdiagramm und das Streifendiagramm passen sich sofort an.</p><div class="ctl"><label>Umfrage <select id="e_ctx"></select></label></div><div class="ctl" id="e_ctl"></div><div id="e_pie"></div><div id="e_str"></div><style>#e_tab table{font-size:.92em}#e_tab td,#e_tab th{padding:4px 6px}</style><div id="e_tab"></div><p class="note">Was passiert mit den Winkeln der anderen Antworten, wenn du nur eine Anzahl vergrößerst? Stelle eine Anzahl auf 0. Wie sieht das Diagramm dann aus?</p>',
      init: function (root, done) {
        var sel = root.querySelector('#e_ctx'), box = root.querySelector('#e_ctl'), n = 0, start = [6, 5, 4, 3];
        CTX.forEach(function (c, i) { sel.add(new Option(c.t, i)); });
        box.innerHTML = start.map(function (v, i) { return '<label><span id="e_n' + i + '"></span>: <b id="e_v' + i + '"></b> <input type="range" id="e_r' + i + '" min="0" max="20" step="1" value="' + v + '" style="width:150px"></label>'; }).join('');
        function draw() {
          var ctx = CTX[+sel.value], c = start.map(function (v, i) { return +root.querySelector('#e_r' + i).value; }), T = sum(c);
          c.forEach(function (v, i) { root.querySelector('#e_n' + i).textContent = ctx.cats[i]; root.querySelector('#e_v' + i).textContent = v; });
          if (!T) { root.querySelector('#e_pie').innerHTML = '<p class="fb bad">Niemand wurde befragt. Stelle mindestens eine Anzahl größer als 0 ein.</p>'; root.querySelector('#e_str').innerHTML = ''; root.querySelector('#e_tab').innerHTML = ''; return; }
          var items = ctx.cats.map(function (x, i) { return { name: x, v: c[i], lab: c[i] ? fmt(f1(c[i] / T * 360)) + '°' : '' }; });
          root.querySelector('#e_pie').innerHTML = pie(items);
          root.querySelector('#e_str').innerHTML = stripe(ctx.cats.map(function (x, i) { return { name: x, v: c[i], lab: c[i] ? fmt(f1(c[i] / T * 100)) + ' %' : '' }; }), { ticks: true });
          root.querySelector('#e_tab').innerHTML = '<div style="overflow-x:auto"><table class="tab"><tr><th>Antwort</th><th>Anzahl</th><th>Anteil</th><th>in %</th><th>Winkel</th></tr>' + ctx.cats.map(function (x, i) { return '<tr><td>' + x + '</td><td>' + c[i] + '</td><td>' + frac(c[i], T) + '</td><td>' + fmt(f1(c[i] / T * 100)) + ' %</td><td>' + fmt(f1(c[i] / T * 360)) + '°</td></tr>'; }).join('') + '<tr><th>Summe</th><th>' + T + '</th><th>1</th><th>100 %</th><th>360°</th></tr></table></div><p class="note">Werte gerundet auf eine Nachkommastelle.</p>';
        }
        function ch() { draw(); n++; if (n >= 3) done('Gut beobachtet: Wird eine Anzahl größer, wächst ihr Ausschnitt. Die anderen Ausschnitte werden kleiner, obwohl ihre Anzahl gleich bleibt, denn die Gesamtzahl ist gewachsen. Zusammen sind es immer 360° und 100 %.'); }
        sel.addEventListener('change', ch); box.querySelectorAll('input').forEach(function (r) { r.addEventListener('input', ch); });
        draw();
      }
    },
    beispiel: { title: 'Kreisdiagramm zur Pausenumfrage', q: 'In der 8c wurden 25 Schülerinnen und Schüler gefragt, was sie am liebsten in der Pause essen: Brot 10, Obst 6, Müsliriegel 5, Joghurt 4. Stelle das Ergebnis in einem Kreisdiagramm dar.',
      steps: ['Gesamtzahl bestimmen: 10 + 6 + 5 + 4 = 25.', 'Relative Häufigkeiten: Brot ' + frac(10, 25) + ' = 40 %, Obst ' + frac(6, 25) + ' = 24 %, Müsliriegel ' + frac(5, 25) + ' = 20 %, Joghurt ' + frac(4, 25) + ' = 16 %.', 'Winkel = Anteil · 360°: Brot 0,4 · 360° = 144°, Obst 0,24 · 360° = 86,4°, Müsliriegel 0,2 · 360° = 72°, Joghurt 0,16 · 360° = 57,6°.', 'Kontrolle: 144° + 86,4° + 72° + 57,6° = 360°. Beim Zeichnen rundest du auf ganze Grad (86°, 58°).', 'Antwort: So sieht das Kreisdiagramm aus.' + pie([{ name: 'Brot', v: 10, lab: '144°' }, { name: 'Obst', v: 6, lab: '86,4°' }, { name: 'Müsliriegel', v: 5, lab: '72°' }, { name: 'Joghurt', v: 4, lab: '57,6°' }])] },
    tasks: { gen: gen, plan: { G: ['relH:1', 'absH:1', 'winkel:1', 'ablesen:1'], S: ['relH:2', 'winkel:2', 'ablesen:2', 'streifen:2', 'vergleich:2'], E: ['relH:2', 'winkel:3', 'ablesen:3', 'fehlend:2', 'vergleich:2', 'irrefuehrend:3'] },
      extra: 'rueckwaerts', test: ['relH:2', 'winkel:2', 'ablesen:2', 'streifen:2', 'vergleich:2', 'winkelProzent:2'] },
    lerncheck: ['Ich berechne relative Häufigkeiten als Bruch, Dezimalzahl und in Prozent.', 'Ich berechne die Winkel für ein Kreisdiagramm.', 'Ich lese Werte aus Kreis- und Streifendiagrammen ab.', 'Ich erkenne, wann ein Diagramm oder eine Aussage irreführend ist.']
  };
})();
