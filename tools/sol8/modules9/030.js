/* Modul 030 (Klasse 9) · Mehrstufige Zufallsexperimente */
var MODULE = (function () {
  var F = M.F, fh = M.fhtml, fmt = M.fmtNum;
  function f1(x) { return Math.round(x * 10) / 10; }
  function frac(n, d) { return fh(F(n, d), true); }
  var COL = { r: ['rot', '#dc2626', '#fff'], b: ['blau', '#1d4ed8', '#fff'], g: ['grün', '#16a34a', '#fff'], y: ['gelb', '#facc15', '#1c1830'] };
  var NAME = { K: 'Kopf', Z: 'Zahl', '6': 'Sechs', k: 'keine Sechs', T: 'Treffer', V: 'vorbei', G: 'Gewinn', N: 'Niete', r: 'rot', b: 'blau', g: 'grün', y: 'gelb' };

  /* ---------- Experimente aus gleich wahrscheinlichen Einheiten ---------- */
  function units(spec) { var u = []; Object.keys(spec).forEach(function (k) { for (var i = 0; i < spec[k]; i++) u.push(k); }); return u; }
  function keysOf(u) { var k = []; u.forEach(function (x) { if (k.indexOf(x) < 0) k.push(x); }); return k; }
  function cnt(u, k) { return u.filter(function (x) { return x === k; }).length; }
  function exp(u, n, ohne) { return { u: u, n: n, ohne: !!ohne }; }
  function rest(E, path) { var u = E.u.slice(); if (E.ohne) path.forEach(function (k) { u.splice(u.indexOf(k), 1); }); return u; }
  function kidsOf(E) { return function (path) { var u = rest(E, path); return keysOf(E.u).filter(function (k) { return cnt(u, k) > 0; }).map(function (k) { return { k: k, p: F(cnt(u, k), u.length) }; }); }; }
  /* alle Pfade mit ungekürzten Faktoren */
  function paths(E) {
    var out = [], kids = kidsOf(E);
    (function walk(p, fs) { if (p.length === E.n) { out.push({ k: p, f: fs }); return; } kids(p).forEach(function (c) { walk(p.concat([c.k]), fs.concat([c.p])); }); })([], []);
    out.forEach(function (x) { x.p = x.f.reduce(function (a, b) { return M.fmul(a, b); }, F(1)); });
    return out;
  }
  function prob(E, pred) { return paths(E).filter(function (x) { return pred(x.k); }).reduce(function (s, x) { return M.fadd(s, x.p); }, F(0)); }
  /* unabhängige Kontrolle: alle Einheiten-Tupel abzählen */
  function brute(E, pred) {
    var fav = 0, tot = 0, m = E.u.length;
    (function go(idx) { if (idx.length === E.n) { tot++; if (pred(idx.map(function (i) { return E.u[i]; }))) fav++; return; } for (var i = 0; i < m; i++) { if (E.ohne && idx.indexOf(i) >= 0) continue; go(idx.concat([i])); } })([]);
    return M.red(F(fav, tot));
  }
  function pstr(k) { return k.map(function (x) { return x === 'y' ? 'ge' : x; }).join(''); }
  function prodTxt(x) { var raw = x.f.reduce(function (a, b) { return F(a.n * b.n, a.d * b.d); }, F(1)); return x.f.map(function (f) { return fh(f, true); }).join(' · ') + ' = ' + fh(raw, true) + (M.gcd(raw.n, raw.d) > 1 ? ' = ' + fh(x.p) : ''); }
  function sumTxt(P, pred, res) {
    var f = P.filter(function (x) { return pred(x.k); });
    return f.map(function (x) { return 'P(' + pstr(x.k) + ') = ' + prodTxt(x); }).join('<br>') + (f.length > 1 ? '<br>Summenregel: ' + f.map(function (x) { return fh(x.p); }).join(' + ') + ' = <b>' + fh(res) + '</b>' : '');
  }
  function fracIn(f, label) { return { kind: 'frac', answer: M.red(f), reduce: true, label: label || 'P (vollständig gekürzt)', placeholder: 'z. B. 3/8' }; }
  function pct(f) { return Math.round(f.n / f.d * 1000) / 10; }

  /* ---------- Zeichnungen ---------- */
  function plab(x, y, p) {
    if (p == null) return '';
    if (typeof p === 'string' || p.d === 1) { var s = typeof p === 'string' ? p : String(p.n), w = s.length * 7.5 + 8; return '<rect x="' + f1(x - w / 2) + '" y="' + f1(y - 10) + '" width="' + f1(w) + '" height="20" rx="4" fill="#fff"/><text x="' + f1(x) + '" y="' + f1(y + 4) + '" font-size="12" font-weight="700" text-anchor="middle">' + s + '</text>'; }
    var wf = Math.max(String(p.n).length, String(p.d).length) * 7.5 + 8;
    return '<rect x="' + f1(x - wf / 2) + '" y="' + f1(y - 14) + '" width="' + f1(wf) + '" height="28" rx="4" fill="#fff"/><text x="' + f1(x) + '" y="' + f1(y - 3) + '" font-size="12" font-weight="700" text-anchor="middle">' + p.n + '</text><line x1="' + f1(x - wf / 2 + 3) + '" y1="' + f1(y) + '" x2="' + f1(x + wf / 2 - 3) + '" y2="' + f1(y) + '" stroke="#1c1830" stroke-width="1.2"/><text x="' + f1(x) + '" y="' + f1(y + 12) + '" font-size="12" font-weight="700" text-anchor="middle">' + p.d + '</text>';
  }
  function node(x, y, k) { var c = COL[k], d = k === 'y' ? 'ge' : k; return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="12" fill="' + (c ? c[1] : '#e8eefc') + '" stroke="#1e3a8a" stroke-width="1.5"/><text x="' + f1(x) + '" y="' + f1(y + 4.5) + '" font-size="' + (d.length > 1 ? 11 : 13) + '" font-weight="700" text-anchor="middle" fill="' + (c ? c[2] : '#1c1830') + '">' + d + '</text>'; }
  /* Wahrscheinlichkeitsbaum: kids(path) → [{k, p}]; o: hl(path), pp (Pfadwahrscheinlichkeit zeigen: true oder Funktion), res */
  function ptree(kids, depth, o) {
    o = o || {};
    var leaves = []; (function w(p) { if (p.length === depth) { leaves.push(p); return; } kids(p).forEach(function (c) { w(p.concat([c.k])); }); })([]);
    var L = leaves.length, LH = L > 12 ? 30 : depth >= 3 ? 44 : 40, top = 6, cw = depth >= 3 ? 96 : 120, X0 = 12;
    function X(l) { return X0 + l * cw; }
    var W = X(depth) + 16 + (o.res ? 46 : 0) + (o.pp ? 60 : 0), H = top + L * LH + 6, idx = 0, edges = '', labs = '', nodes = '', ymap = {};
    function place(p) {
      if (p.length === depth) { var y = top + idx * LH + LH / 2; idx++; ymap[p.join('|')] = y; return y; }
      var ys = kids(p).map(function (c) { return place(p.concat([c.k])); });
      var y0 = (ys[0] + ys[ys.length - 1]) / 2; ymap[p.join('|')] = y0; return y0;
    }
    place([]);
    function hlOn(p) { return o.hl && leaves.some(function (q) { return q.slice(0, p.length).join('|') === p.join('|') && o.hl(q); }); }
    (function draw(p) {
      if (p.length === depth) return;
      kids(p).forEach(function (c) {
        var q = p.concat([c.k]), xa = X(p.length) + (p.length ? 12 : 0), ya = ymap[p.join('|')], xb = X(q.length) - 12, yb = ymap[q.join('|')], on = hlOn(q), t = q.length === depth && L > 4 ? 0.7 : 0.55;
        edges += '<line x1="' + f1(xa) + '" y1="' + f1(ya) + '" x2="' + f1(xb) + '" y2="' + f1(yb) + '" stroke="' + (on ? '#d97706' : '#1e3a8a') + '" stroke-width="' + (on ? 4 : 1.8) + '"/>';
        if (!o.noP) labs += plab(xa + t * (xb - xa), ya + t * (yb - ya), c.p);
        nodes += node(X(q.length), yb, c.k);
        if (q.length === depth) {
          var xr = X(depth) + 18;
          if (o.res) { nodes += '<text x="' + f1(xr) + '" y="' + f1(yb + 4.5) + '" font-size="12" font-weight="' + (on ? 700 : 400) + '" fill="' + (on ? '#b45309' : '#1c1830') + '">' + pstr(q) + '</text>'; xr += 46; }
          if (o.pp) { var v = typeof o.pp === 'function' ? o.pp(q) : null; if (v != null) labs += plab(xr + 22, yb, v); }
        }
        draw(q);
      });
    })([]);
    return '<div style="overflow-x:auto"><svg class="viz" viewBox="0 0 ' + Math.round(W) + ' ' + Math.round(H) + '" role="img" aria-label="' + (o.label || 'Baumdiagramm') + '" style="max-width:' + Math.round(W * 1.15) + 'px;min-width:' + Math.min(Math.round(W), 320) + 'px"><circle cx="' + X0 + '" cy="' + f1(ymap['']) + '" r="4" fill="#1e3a8a"/>' + edges + nodes + labs + '</svg></div>';
  }
  function urn(spec) {
    var u = units(spec), m = u.length, per = Math.min(m, 6), rows = Math.ceil(m / per), W = 40 + per * 30, H = 30 + rows * 30;
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Urne mit Kugeln" style="max-width:' + Math.round(W * 1.15) + 'px"><path d="M8 6 L8 ' + (H - 10) + ' Q8 ' + (H - 4) + ' 16 ' + (H - 4) + ' L' + (W - 16) + ' ' + (H - 4) + ' Q' + (W - 8) + ' ' + (H - 4) + ' ' + (W - 8) + ' ' + (H - 10) + ' L' + (W - 8) + ' 6" fill="#e8eefc" stroke="#1e3a8a" stroke-width="2"/>';
    u.forEach(function (k, i) { var x = 35 + (i % per) * 30, y = H - 22 - Math.floor(i / per) * 30; g += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="' + COL[k][1] + '" stroke="#1c1830" stroke-width="1"/>'; });
    return g + '</svg>';
  }
  function urnTxt(spec) { var ks = Object.keys(spec), parts = ks.map(function (k) { return spec[k] + ' ' + COL[k][0] + 'e (' + k + ')'; }); return 'In einer Urne liegen ' + units(spec).length + ' Kugeln: ' + parts.slice(0, -1).join(', ') + ' und ' + parts[parts.length - 1] + '.'; }
  function wheel(parts) { /* parts [[key, Anteil als Bruch]] */
    var cx = 100, cy = 104, R = 82, a0 = -90, g = '<svg class="viz" viewBox="0 0 200 196" role="img" aria-label="Glücksrad" style="max-width:210px">', labs = '';
    parts.forEach(function (s) {
      var ang = s[1].n / s[1].d * 360, a1 = a0 + ang, p0 = [cx + R * Math.cos(a0 * Math.PI / 180), cy + R * Math.sin(a0 * Math.PI / 180)], p1 = [cx + R * Math.cos(a1 * Math.PI / 180), cy + R * Math.sin(a1 * Math.PI / 180)];
      g += '<path d="M' + cx + ' ' + cy + ' L' + f1(p0[0]) + ' ' + f1(p0[1]) + ' A' + R + ' ' + R + ' 0 ' + (ang > 180 ? 1 : 0) + ' 1 ' + f1(p1[0]) + ' ' + f1(p1[1]) + ' Z" fill="' + COL[s[0]][1] + '" stroke="#fff" stroke-width="2"/>';
      var m = (a0 + a1) / 2 * Math.PI / 180; labs += '<text x="' + f1(cx + R * 0.58 * Math.cos(m)) + '" y="' + f1(cy + R * 0.58 * Math.sin(m) + 5) + '" font-size="13" font-weight="700" text-anchor="middle" fill="' + COL[s[0]][2] + '">' + ang + '°</text>';
      a0 = a1;
    });
    return g + '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#1e3a8a" stroke-width="2"/>' + labs + '<path d="M' + (cx - 8) + ' 6 L' + (cx + 8) + ' 6 L' + cx + ' 26 Z" fill="#1c1830"/></svg>';
  }
  function exactly(key, c) { return function (k) { return k.filter(function (x) { return x === key; }).length === c; }; }
  function C3(k) { return [1, 3, 3, 1][k]; }

  var gen = {
    muenze: function (lvl) {
      var E = exp(['K', 'Z'], 3), ev = lvl === 1 ? M.pick([['dreimal Kopf', function (k) { return k.join('') === 'KKK'; }], ['dreimal Zahl', function (k) { return k.join('') === 'ZZZ'; }], ['erst Kopf, dann zweimal Zahl', function (k) { return k.join('') === 'KZZ'; }]]) : M.pick([['genau zweimal Kopf', exactly('K', 2)], ['genau einmal Zahl', exactly('Z', 1)], ['mindestens einmal Zahl', function (k) { return k.indexOf('Z') >= 0; }], ['dreimal dasselbe', function (k) { return k[0] === k[1] && k[1] === k[2]; }]]);
      var P = paths(E), res = prob(E, ev[1]), fav = P.filter(function (x) { return ev[1](x.k); });
      return { skill: 'Dreistufig: Münzwurf', q: 'Eine Münze wird dreimal geworfen (K = Kopf, Z = Zahl). Bestimme die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>.' + ptree(kidsOf(E), 3, { res: true, label: 'Baumdiagramm dreifacher Münzwurf' }),
        inputs: [fracIn(res)],
        hints: ['Der Baum hat 2 · 2 · 2 = 8 Pfade. Jeder Pfad hat die Wahrscheinlichkeit ' + frac(1, 2) + ' · ' + frac(1, 2) + ' · ' + frac(1, 2) + ' = ' + frac(1, 8) + '.', 'Suche die Pfade, die zu „' + ev[0] + '“ passen: ' + fav.map(function (x) { return pstr(x.k); }).join(', ') + '.', fav.length > 1 ? 'Summenregel: Addiere ' + fav.length + ' · ' + frac(1, 8) + '.' : 'Es passt nur ein Pfad.'],
        solution: sumTxt(P, ev[1], res) + ptree(kidsOf(E), 3, { res: true, hl: ev[1], pp: function (q) { return ev[1](q) ? F(1, 8) : null; } }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && fav.length > 1 && M.feq(f, F(1, 8))) return 'Das ist nur ein Pfad. Zu „' + ev[0] + '“ gehören ' + fav.length + ' Pfade.'; if (f && M.feq(f, F(fav.length, 6))) return 'Es gibt nicht 6, sondern 8 gleich wahrscheinliche Ergebnisse (2 · 2 · 2).'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) || 'Abzählen ≠'; } };
    },
    pfad: function (lvl) {
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 3 }, { r: 4, b: 2 }, { r: 3, b: 3 }, { r: 2, b: 4 }]), ohne = lvl >= 2, E = exp(units(spec), 3, ohne), P = paths(E), x = M.pick(P), key = x.k.join('');
      return { skill: 'Pfadregel (Produktregel)', q: urnTxt(spec) + ' Es werden nacheinander drei Kugeln ' + (ohne ? '<b>ohne Zurücklegen</b>' : '<b>mit Zurücklegen</b>') + ' gezogen.' + urn(spec) + 'Berechne die Wahrscheinlichkeit für den markierten Pfad <b>' + pstr(x.k) + '</b>.' + ptree(kidsOf(E), 3, { res: true, hl: function (q) { return q.join('') === key; } }),
        inputs: [fracIn(x.p, 'P(' + pstr(x.k) + ') (gekürzt)')],
        hints: ['Pfadregel: Multipliziere die Wahrscheinlichkeiten entlang des markierten Pfades.', 'Die drei Äste haben ' + x.f.map(function (f) { return fh(f, true); }).join(', ') + '.', 'Rechne ' + x.f.map(function (f) { return fh(f, true); }).join(' · ') + ' und kürze.'],
        solution: 'P(' + pstr(x.k) + ') = ' + prodTxt(x) + '.',
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, x.f.reduce(function (a, b) { return M.fadd(a, b); }, F(0)))) return 'Entlang eines Pfades wird <b>multipliziert</b>, nicht addiert.'; return null; },
        verify: function () { return M.feq(brute(E, function (k) { return k.join('') === key; }), x.p) || 'Abzählen ≠'; } };
    },
    urne_mit: function (lvl) {
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 3 }, { r: 1, b: 3 }, { r: 2, b: 2 }, { r: 3, b: 1 }, { r: 1, b: 4 }]), E = exp(units(spec), 3, false), P = paths(E);
      var ev = lvl === 1 ? ['dreimal rot', function (k) { return k.join('') === 'rrr'; }] : M.pick([['genau einmal rot', exactly('r', 1)], ['genau zweimal blau', exactly('b', 2)], ['dreimal dieselbe Farbe', function (k) { return k[0] === k[1] && k[1] === k[2]; }]]);
      var res = prob(E, ev[1]), fav = P.filter(function (x) { return ev[1](x.k); });
      return { skill: 'Dreimal ziehen mit Zurücklegen', q: urnTxt(spec) + ' Du ziehst dreimal eine Kugel und legst sie jedes Mal <b>zurück</b>.' + urn(spec) + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>?',
        inputs: [fracIn(res)],
        hints: ['Mit Zurücklegen bleiben die Wahrscheinlichkeiten in jeder Stufe gleich: P(r) = ' + frac(spec.r, spec.r + spec.b) + ', P(b) = ' + frac(spec.b, spec.r + spec.b) + '.', 'Passende Pfade: ' + fav.map(function (x) { return pstr(x.k); }).join(', ') + '. Berechne jeden mit der Pfadregel.', fav.length > 1 ? 'Alle ' + fav.length + ' Pfade haben gleich viele r und b, also dieselbe Wahrscheinlichkeit ' + fh(fav[0].p) + '. Addiere sie.' : 'Multipliziere ' + fav[0].f.map(function (f) { return fh(f, true); }).join(' · ') + '.'],
        solution: sumTxt(P, ev[1], res) + ptree(kidsOf(E), 3, { res: true, hl: ev[1] }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && fav.length > 1 && M.feq(f, fav[0].p)) return 'Das ist nur ein Pfad. Es passen ' + fav.length + ' Pfade, addiere sie.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) || 'Abzählen ≠'; } };
    },
    urne_ohne: function (lvl) {
      var spec = M.pick([{ r: 3, b: 2 }, { r: 2, b: 3 }, { r: 3, b: 3 }, { r: 4, b: 2 }, { r: 2, b: 4 }, { r: 4, b: 3 }, { r: 3, b: 4 }]), E = exp(units(spec), 3, true), P = paths(E);
      var ev = lvl <= 2 ? M.pick([['dreimal rot', function (k) { return k.join('') === 'rrr'; }], ['dreimal blau', function (k) { return k.join('') === 'bbb'; }], ['erst rot, dann zweimal blau', function (k) { return k.join('') === 'rbb'; }]]) : M.pick([['genau zwei rote Kugeln', exactly('r', 2)], ['alle drei Kugeln haben dieselbe Farbe', function (k) { return k[0] === k[1] && k[1] === k[2]; }], ['genau eine blaue Kugel', exactly('b', 1)]]);
      var res = prob(E, ev[1]), fav = P.filter(function (x) { return ev[1](x.k); });
      if (!fav.length) return gen.urne_ohne(lvl);
      var withR = M.red(fav.reduce(function (s, x) { return M.fadd(s, x.k.reduce(function (a, k) { return M.fmul(a, F(spec[k], spec.r + spec.b)); }, F(1))); }, F(0)));
      return { skill: 'Dreimal ziehen ohne Zurücklegen', q: urnTxt(spec) + ' Du ziehst nacheinander drei Kugeln <b>ohne Zurücklegen</b>.' + urn(spec) + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>?',
        inputs: [fracIn(res)],
        hints: ['Ohne Zurücklegen: Nach jedem Zug liegt eine Kugel weniger in der Urne. Die Nenner werden ' + (spec.r + spec.b) + ', ' + (spec.r + spec.b - 1) + ', ' + (spec.r + spec.b - 2) + '.', 'Passende Pfade: ' + fav.map(function (x) { return pstr(x.k); }).join(', ') + '. Zum Beispiel P(' + pstr(fav[0].k) + ') = ' + fav[0].f.map(function (f) { return fh(f, true); }).join(' · ') + '.', fav.length > 1 ? 'Berechne alle passenden Pfade und addiere.' : 'Multipliziere und kürze.'],
        solution: sumTxt(P, ev[1], res) + ptree(kidsOf(E), 3, { res: true, hl: ev[1] }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, withR) && !M.feq(withR, res)) return 'Das wäre richtig <b>mit</b> Zurücklegen. Hier fehlt nach jedem Zug eine Kugel, Zähler und Nenner ändern sich.'; if (f && fav.length > 1 && fav.some(function (x) { return M.feq(f, x.p); })) return 'Das ist nur ein Pfad. Addiere alle passenden Pfade.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) || 'Abzählen ≠'; } };
    },
    rad: function (lvl) {
      var p = M.pick([F(1, 4), F(1, 3), F(1, 2), F(3, 4), F(2, 3), F(1, 6), F(5, 6)]), q = F(p.d - p.n, p.d), u = []; for (var i = 0; i < p.d; i++) u.push(i < p.n ? 'r' : 'b');
      var E = exp(u, 3, false), P = paths(E), ev = M.pick(lvl === 1 ? [['dreimal rot', function (k) { return k.join('') === 'rrr'; }], ['dreimal blau', function (k) { return k.join('') === 'bbb'; }]] : [['genau einmal rot', exactly('r', 1)], ['genau zweimal rot', exactly('r', 2)], ['mindestens zweimal rot', function (k) { return exactly('r', 2)(k) || exactly('r', 3)(k); }]]);
      var res = prob(E, ev[1]), fav = P.filter(function (x) { return ev[1](x.k); });
      return { skill: 'Glücksrad dreimal drehen', q: 'Das Glücksrad wird dreimal gedreht.' + wheel([['r', p], ['b', q]]) + 'Wie groß ist die Wahrscheinlichkeit für <b>„' + ev[0] + '“</b>?',
        inputs: [fracIn(res)],
        hints: ['Bestimme zuerst die Wahrscheinlichkeiten: P(rot) = ' + (p.n * 360 / p.d) + '° : 360° = ' + fh(p) + ', P(blau) = ' + fh(q) + '.', 'Passende Pfade: ' + fav.map(function (x) { return pstr(x.k); }).join(', ') + '.', 'Berechne jeden Pfad mit der Pfadregel und addiere die Ergebnisse.'],
        solution: 'P(r) = ' + fh(p) + ', P(b) = ' + fh(q) + '.<br>' + sumTxt(P, ev[1], res) + ptree(kidsOf(E), 3, { res: true, hl: ev[1] }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && fav.length > 1 && M.feq(f, fav[0].p)) return 'Das ist nur ein Pfad. „' + ev[0] + '“ hat ' + fav.length + ' Pfade.'; return null; },
        verify: function () { return M.feq(brute(E, ev[1]), res) || 'Abzählen ≠'; } };
    },
    mindestens: function (lvl) {
      var v = lvl === 3 ? M.rnd(0, 2) : M.rnd(0, 1), E, ev, none, n, txt, base;
      if (v === 0) { n = 3; E = exp(['6', 'k', 'k', 'k', 'k', 'k'], 3); ev = function (k) { return k.indexOf('6') >= 0; }; base = F(5, 6); txt = 'Du wirfst dreimal einen Würfel. Wie groß ist die Wahrscheinlichkeit, <b>mindestens eine Sechs</b> zu werfen?'; }
      else if (v === 1) { n = lvl === 3 ? 4 : 3; E = exp(['K', 'Z'], n); ev = function (k) { return k.indexOf('K') >= 0; }; base = F(1, 2); txt = 'Eine Münze wird ' + (n === 3 ? 'dreimal' : 'viermal') + ' geworfen. Wie groß ist die Wahrscheinlichkeit für <b>mindestens einmal Kopf</b>?'; }
      else { var g = M.pick([F(1, 4), F(1, 5), F(1, 3)]), u = []; for (var i = 0; i < g.d; i++) u.push(i < g.n ? 'G' : 'N'); n = 3; E = exp(u, 3); ev = function (k) { return k.indexOf('G') >= 0; }; base = F(g.d - g.n, g.d); txt = 'Bei einem Losstand gewinnt jedes Los mit der Wahrscheinlichkeit ' + fh(g) + '. Ben kauft nacheinander drei Lose (es gibt sehr viele Lose). Wie groß ist die Wahrscheinlichkeit, dass er <b>mindestens einmal gewinnt</b>?'; }
      none = F(Math.pow(base.n, n), Math.pow(base.d, n)); var res = M.fadd(F(1), F(-none.n, none.d));
      var pw = []; for (var j = 0; j < n; j++) pw.push(fh(base));
      return { skill: 'Gegenereignis „mindestens einmal“', q: txt, inputs: [fracIn(res)],
        hints: ['„Mindestens einmal“ umfasst viele Pfade. Das Gegenereignis „keinmal“ ist nur <b>ein</b> Pfad.', 'P(keinmal) = ' + pw.join(' · ') + ' = ' + fh(none) + '.', 'P(mindestens einmal) = 1 − P(keinmal).'],
        solution: 'Gegenereignis „keinmal“: ' + pw.join(' · ') + ' = ' + fh(none) + '.<br>P(mindestens einmal) = 1 − ' + fh(none) + ' = <b>' + fh(res) + '</b> ≈ ' + fmt(pct(res)) + ' %.',
        mistakes: function (vv) { var f = M.parseFrac(vv[0]); if (!f) return null; if (M.feq(f, none)) return 'Das ist P(keinmal). Ziehe sie noch von 1 ab.'; var single = M.fadd(F(1), F(-base.n, base.d)); if (M.feq(f, M.fmul(F(n), single))) return 'Du hast ' + n + ' · ' + fh(single) + ' gerechnet. Dabei werden Pfade mit mehreren Treffern mehrfach gezählt. Nutze das Gegenereignis.'; return null; },
        verify: function () { return M.feq(brute(E, ev), res) || 'Abzählen ≠'; } };
    },
    prozent: function (lvl) {
      var t = M.pick([60, 70, 80, 90]), p = t / 100, q = 1 - p, kind = lvl === 1 ? 0 : M.pick([0, 1, 2, 3]);
      var vals = [p * p * p, q * q * q, 1 - q * q * q, 3 * p * p * q], ans = Math.round(vals[kind] * 1000) / 10, what = ['alle drei', 'keinen', 'mindestens einen', 'genau zwei'][kind];
      var u = []; for (var i = 0; i < 10; i++) u.push(i < t / 10 ? 'T' : 'V'); var E = exp(u, 3), pred = [function (k) { return k.join('') === 'TTT'; }, function (k) { return k.join('') === 'VVV'; }, function (k) { return k.indexOf('T') >= 0; }, exactly('T', 2)][kind];
      var P = fmt(p), Q = fmt(Math.round(q * 10) / 10);
      var steps = [P + ' · ' + P + ' · ' + P + ' = ' + fmt(vals[0]), Q + ' · ' + Q + ' · ' + Q + ' = ' + fmt(Math.round(vals[1] * 1000) / 1000), '1 − ' + Q + ' · ' + Q + ' · ' + Q + ' = 1 − ' + fmt(Math.round(q * q * q * 1000) / 1000) + ' = ' + fmt(Math.round(vals[2] * 1000) / 1000), 'TTV, TVT, VTT: 3 · ' + P + ' · ' + P + ' · ' + Q + ' = 3 · ' + fmt(Math.round(p * p * q * 1000) / 1000) + ' = ' + fmt(Math.round(vals[3] * 1000) / 1000)][kind];
      return { skill: 'Dreistufig mit Prozenten', q: 'Mila trifft beim Elfmeter mit einer Wahrscheinlichkeit von <b>' + t + ' %</b>. Sie schießt dreimal, die Schüsse sind unabhängig voneinander. Wie groß ist die Wahrscheinlichkeit, dass sie <b>' + what + '</b> Elfmeter ' + (kind === 1 ? 'trifft' : 'verwandelt') + '? Gib das Ergebnis in Prozent an.',
        inputs: [{ kind: 'num', answer: ans, tol: 0.05, label: 'P', unit: '%' }],
        hints: ['Rechne mit Dezimalzahlen: Treffer ' + P + ', vorbei ' + Q + '.', kind === 2 ? 'Nutze das Gegenereignis „keinen Treffer“: ' + Q + ' · ' + Q + ' · ' + Q + '.' : kind === 3 ? 'Drei Pfade passen: TTV, TVT und VTT. Alle haben dieselbe Wahrscheinlichkeit.' : 'Es passt nur ein Pfad. Multipliziere die drei Wahrscheinlichkeiten.', 'Wandle am Ende in Prozent um: mal 100.'],
        solution: steps + ' = <b>' + fmt(ans) + ' %</b>.',
        mistakes: function (v) { var a = M.parseNum(v[0]); if (a === null) return null; if (kind === 0 && Math.abs(a - 3 * t) < 0.05) return 'Nicht addieren: Entlang des Pfades wird multipliziert.'; if (kind === 2 && Math.abs(a - Math.round(vals[1] * 1000) / 10) < 0.05) return 'Das ist P(keinen Treffer). Ziehe es von 100 % ab.'; if (kind === 3 && Math.abs(a - Math.round(p * p * q * 1000) / 10) < 0.05) return 'Das ist nur ein Pfad. „Genau zwei“ gibt es auf drei Wegen.'; return null; },
        verify: function () { var b = brute(E, pred); return Math.abs(b.n / b.d * 100 - ans) < 1e-9 || 'Abzählen ≠'; } };
    },
    genau: function (lvl) {
      var c = M.pick([[F(1, 6), '6', 'k', 'eine Sechs', 'Sechsen', 'Würfel', 'wirfst dreimal einen Würfel'], [F(1, 4), 'G', 'N', 'einen Gewinn', 'Gewinne', 'Rubbellos', 'kaufst drei Rubbellose, die jeweils mit der Wahrscheinlichkeit ' + fh(F(1, 4)) + ' gewinnen'], [F(1, 3), 'T', 'V', 'einen Treffer', 'Treffer', 'Korbwurf', 'wirfst dreimal auf den Korb und triffst jeweils mit der Wahrscheinlichkeit ' + fh(F(1, 3))]]);
      var p = c[0], u = []; for (var i = 0; i < p.d; i++) u.push(i < p.n ? c[1] : c[2]);
      var E = exp(u, 3), k = lvl === 3 ? M.pick([1, 2]) : 1, P = paths(E), pred = exactly(c[1], k), res = prob(E, pred), fav = P.filter(function (x) { return pred(x.k); });
      var one = fav[0].p;
      return { skill: 'Genau k Treffer (Summenregel)', q: 'Du ' + c[6] + '. Wie groß ist die Wahrscheinlichkeit für <b>genau ' + (k === 1 ? c[3] : 'zwei ' + c[4]) + '</b>?' + (c[1] === '6' ? ' <small>(6 = Sechs, k = keine Sechs)</small>' : ''),
        inputs: [fracIn(res)],
        hints: ['Zeichne den Baum mit zwei Ästen pro Stufe: ' + c[1] + ' mit ' + fh(p) + ' und ' + c[2] + ' mit ' + fh(F(p.d - p.n, p.d)) + '.', 'Passende Pfade: ' + fav.map(function (x) { return pstr(x.k); }).join(', ') + '. Jeder hat die Wahrscheinlichkeit ' + fh(one) + '.', 'Summenregel: ' + fav.length + ' · ' + fh(one) + '.'],
        solution: sumTxt(P, pred, res) + ptree(kidsOf(E), 3, { res: true, hl: pred }),
        mistakes: function (v) { var f = M.parseFrac(v[0]); if (f && M.feq(f, one)) return 'Das ist nur ein Pfad. Der Treffer kann beim 1., 2. oder 3. Versuch kommen: ' + fav.length + ' Pfade.'; if (f && M.feq(f, M.fmul(F(k), p))) return 'Vergiss die Wahrscheinlichkeiten der Fehlversuche nicht. Rechne entlang der ganzen Pfade.'; return null; },
        verify: function () { return M.feq(brute(E, pred), res) && M.feq(res, M.fmul(F(C3(k)), F(Math.pow(p.n, k) * Math.pow(p.d - p.n, 3 - k), Math.pow(p.d, 3)))) || 'Abzählen ≠'; } };
    },
    wieoft: function () {
      for (var t = 0; t < 100; t++) {
        var c = M.pick([[F(1, 6), 'eine Sechs zu würfeln', 'Würfe'], [F(1, 4), 'zu gewinnen', 'Drehungen'], [F(1, 5), 'zu gewinnen', 'Lose'], [F(1, 10), 'zu gewinnen', 'Lose'], [F(1, 3), 'zu treffen', 'Würfe']]), X = M.pick([50, 75, 90]), q = 1 - c[0].n / c[0].d, nn = 1;
        while (1 - Math.pow(q, nn) <= X / 100) nn++;
        if (Math.abs(1 - Math.pow(q, nn) - X / 100) < 0.002 || Math.abs(1 - Math.pow(q, nn - 1) - X / 100) < 0.002) continue;
        var Pn = Math.round((1 - Math.pow(q, nn)) * 1000) / 10, Pm = Math.round((1 - Math.pow(q, nn - 1)) * 1000) / 10;
        return { skill: 'Wie oft muss man es versuchen? (Transfer)', level: 3, q: 'Die Wahrscheinlichkeit, bei einem Versuch ' + c[1] + ', beträgt ' + fh(c[0]) + '. Wie viele ' + c[2] + ' braucht man <b>mindestens</b>, damit die Wahrscheinlichkeit, <b>mindestens einmal</b> ' + c[1] + ', größer als <b>' + X + ' %</b> ist?',
          inputs: [{ kind: 'num', answer: nn, label: 'mindestens', unit: c[2] }],
          hints: ['P(mindestens einmal bei n Versuchen) = 1 − P(keinmal) = 1 − (' + fh(F(c[0].d - c[0].n, c[0].d)) + ')<sup>n</sup>.', 'Probiere mit dem Taschenrechner verschiedene n aus, zum Beispiel n = ' + Math.max(1, nn - 2) + ', ' + (nn - 1) + ', ' + nn + '.', 'Gesucht ist das kleinste n, bei dem 1 − (' + fh(F(c[0].d - c[0].n, c[0].d)) + ')<sup>n</sup> größer als ' + fmt(X / 100) + ' ist.'],
          solution: 'P(mindestens einmal) = 1 − (' + fh(F(c[0].d - c[0].n, c[0].d)) + ')<sup>n</sup>.<br>' + (nn > 1 ? 'n = ' + (nn - 1) + ': ≈ ' + fmt(Pm) + ' % (zu wenig)<br>' : '') + 'n = ' + nn + ': ≈ ' + fmt(Pn) + ' % &gt; ' + X + ' %.<br>Man braucht mindestens <b>' + nn + ' ' + c[2] + '</b>.',
          mistakes: function (v) { var a = M.parseNum(v[0]); if (a === nn - 1) return 'Prüfe nach: Bei ' + (nn - 1) + ' ' + c[2] + ' sind es erst etwa ' + fmt(Pm) + ' %.'; if (a !== null && Math.abs(a - Math.ceil(X / 100 * c[0].d / c[0].n)) < 1e-9 && a !== nn) return 'Die Wahrscheinlichkeiten darf man nicht einfach addieren. Rechne mit dem Gegenereignis 1 − (' + fh(F(c[0].d - c[0].n, c[0].d)) + ')<sup>n</sup>.'; return null; },
          verify: function () { var none = F(1, 1); for (var k = 0; k < nn; k++) none = M.fmul(none, F(c[0].d - c[0].n, c[0].d)); var prev = M.fdiv(none, F(c[0].d - c[0].n, c[0].d)); return (1 - none.n / none.d > X / 100 && 1 - prev.n / prev.d <= X / 100) || 'n falsch'; } };
      }
      return gen.mindestens(3);
    }
  };

  var COIN = exp(['K', 'Z'], 3), URN = exp(units({ r: 3, b: 2 }), 3, true);
  return {
    id: '030', title: 'Mehrstufige Zufallsexperimente', bereich: 'Daten und Zufall', minutes: '45 bis 60',
    vorkenntnisse: 'Baumdiagramme, Pfad- und Summenregel bei zwei Stufen (Klasse 8), Brüche multiplizieren und addieren',
    lead: 'Dreimal würfeln, dreimal ziehen, dreimal drehen: Mit Pfadregel, Summenregel und dem Gegenereignis berechnest du auch bei mehreren Stufen sicher Wahrscheinlichkeiten.',
    einstieg: { html: '<p>Beim Spieleabend schlägt Ole vor: „Wir werfen eine Münze dreimal. Kommt <b>mindestens einmal Kopf</b>, gewinne ich, sonst gewinnst du.“ Ist das fair?</p>' + ptree(kidsOf(COIN), 3, { res: true, label: 'Dreifacher Münzwurf' }) + '<p class="note">Zähle die Pfade: Bei wie vielen der 8 Pfade kommt kein einziges Mal Kopf vor?</p><p>Nur der Pfad ZZZ. Ole gewinnt also bei 7 von 8 gleich wahrscheinlichen Pfaden, das Spiel ist sehr unfair. In diesem Modul berechnest du solche Wahrscheinlichkeiten bei drei und mehr Stufen, mit und ohne Zurücklegen.</p>' },
    ziele: ['Ich zeichne Baumdiagramme mit drei Stufen und beschrifte die Äste.', 'Ich berechne Pfadwahrscheinlichkeiten mit der Pfadregel (Produktregel).', 'Ich fasse mehrere Pfade mit der Summenregel zusammen.', 'Ich unterscheide Ziehen mit und ohne Zurücklegen.', 'Ich nutze das Gegenereignis bei „mindestens einmal“.'],
    fachwoerter: [['Mehrstufiges Zufallsexperiment', 'Mehrere Zufallsversuche nacheinander, zum Beispiel dreimal würfeln. Jeder Versuch ist eine Stufe im Baum.'], ['Pfadregel (Produktregel)', 'Die Wahrscheinlichkeit eines Pfades ist das Produkt der Wahrscheinlichkeiten entlang des Pfades.'], ['Summenregel', 'Gehören mehrere Pfade zu einem Ereignis, addiert man ihre Wahrscheinlichkeiten.'], ['Gegenereignis', 'Alle Ergebnisse, die nicht zum Ereignis gehören. P(Gegenereignis) = 1 − P(Ereignis).']],
    diagnose: [
      { q: 'Berechne ' + frac(1, 2) + ' · ' + frac(2, 3) + ' · ' + frac(3, 4) + '.', options: [frac(1, 4), frac(6, 9), frac(1, 2), 'Weiß ich noch nicht'], answer: 0, why: frac(1 * 2 * 3, 2 * 3 * 4) + ' = ' + frac(6, 24) + ' = ' + frac(1, 4) + '.', review: 'Brüche multiplizieren' },
      { q: 'Berechne ' + frac(1, 8) + ' + ' + frac(3, 8) + '.', options: [frac(1, 2), frac(4, 16), frac(3, 64), 'Weiß ich noch nicht'], answer: 0, why: frac(4, 8) + ' = ' + frac(1, 2) + '.', review: 'Brüche addieren' },
      { q: 'Eine Urne enthält 3 rote und 2 blaue Kugeln. Du ziehst eine rote Kugel und legst sie nicht zurück. Wie groß ist jetzt P(rot)?', options: [frac(2, 4), frac(3, 5), frac(2, 5), 'Weiß ich noch nicht'], answer: 0, why: 'Es sind noch 2 rote von 4 Kugeln übrig: ' + frac(2, 4) + '.', review: 'Ziehen ohne Zurücklegen (Klasse 8)' },
      { q: 'Die Wahrscheinlichkeit für Regen ist 0,3. Wie groß ist die Wahrscheinlichkeit für keinen Regen?', options: ['0,7', '0,3', '1,3', 'Weiß ich noch nicht'], answer: 0, why: '1 − 0,3 = 0,7 (Gegenereignis).', review: 'Gegenereignis' }],
    erklaerung:
      '<h3>1. Bäume mit drei Stufen</h3><p>Bei drei Versuchen nacheinander bekommt der Baum drei Stufen. An jede Verzweigung schreibst du die Wahrscheinlichkeiten. An jedem Verzweigungspunkt ist ihre Summe 1.</p>' +
      '<div class="merk"><b>Merke (Pfadregel):</b> Die Wahrscheinlichkeit eines Pfades ist das <b>Produkt</b> aller Wahrscheinlichkeiten entlang des Pfades.<br><b>Merke (Summenregel):</b> Gehören mehrere Pfade zu einem Ereignis, <b>addierst</b> du ihre Wahrscheinlichkeiten.</div>' +
      '<p><b>Beispiel:</b> Münze dreimal. P(genau zweimal Kopf): Die Pfade KKZ, KZK und ZKK haben je ' + frac(1, 2) + ' · ' + frac(1, 2) + ' · ' + frac(1, 2) + ' = ' + frac(1, 8) + '. Zusammen ' + frac(3, 8) + '.</p>' +
      '<h3>2. Ohne Zurücklegen</h3><p>Urne mit 3 roten und 2 blauen Kugeln, drei Kugeln ohne Zurücklegen. Nach jedem Zug ändern sich Zähler und Nenner.</p>' + ptree(kidsOf(URN), 3, { res: true, hl: function (q) { return q.join('') === 'rrb'; }, label: 'Urne ohne Zurücklegen' }) +
      '<p>P(rrb) = ' + frac(3, 5) + ' · ' + frac(2, 4) + ' · ' + frac(2, 3) + ' = ' + frac(12, 60) + ' = ' + frac(1, 5) + '. Drei rote Kugeln: P(rrr) = ' + frac(3, 5) + ' · ' + frac(2, 4) + ' · ' + frac(1, 3) + ' = ' + frac(6, 60) + ' = ' + frac(1, 10) + '. Bei rrb ist nach zwei roten nur noch 1 rote, aber 2 blaue Kugeln da.</p>' +
      '<h3>3. „Mindestens einmal“: das Gegenereignis</h3><div class="merk"><b>Merke:</b> P(mindestens einmal) = 1 − P(keinmal).<br>Beispiel dreimal würfeln: P(mindestens eine Sechs) = 1 − ' + frac(5, 6) + ' · ' + frac(5, 6) + ' · ' + frac(5, 6) + ' = 1 − ' + frac(125, 216) + ' = ' + frac(91, 216) + ' ≈ 42,1 %.</div>' +
      '<p class="note"><b>Typischer Fehler:</b> ' + frac(1, 6) + ' + ' + frac(1, 6) + ' + ' + frac(1, 6) + ' = ' + frac(1, 2) + ' ist falsch. Dabei werden Pfade mit mehreren Sechsen mehrfach gezählt. Gib Ergebnisse als vollständig gekürzten Bruch an, zum Beispiel 3/8.</p>',
    entdecken: {
      html: '<p>Stelle die Urne ein und wähle, ob die Kugeln zurückgelegt werden. Es wird dreimal gezogen. Der Baum rechnet mit.</p><div class="ctl"><label>Ziehen <select id="e_m"><option value="mit">mit Zurücklegen</option><option value="ohne">ohne Zurücklegen</option></select></label><label>rote Kugeln: <b id="v_r"></b> <input type="range" id="r_r" min="1" max="6" step="1" value="2" style="width:140px"></label><label>blaue Kugeln: <b id="v_b"></b> <input type="range" id="r_b" min="1" max="6" step="1" value="2" style="width:140px"></label></div><div id="e_u"></div><div id="e_t"></div><div id="e_res"></div>',
      init: function (root, done) {
        var cnt = 0;
        function draw() {
          var r = +root.querySelector('#r_r').value, b = +root.querySelector('#r_b').value, ohne = root.querySelector('#e_m').value === 'ohne', spec = { r: r, b: b }, E = exp(units(spec), 3, ohne);
          root.querySelector('#v_r').textContent = r; root.querySelector('#v_b').textContent = b;
          root.querySelector('#e_u').innerHTML = urn(spec);
          var P = paths(E);
          root.querySelector('#e_t').innerHTML = ptree(kidsOf(E), 3, { res: true, pp: function (q) { return M.red(P.filter(function (x) { return x.k.join('') === q.join(''); })[0].p); } });
          var rrr = prob(E, function (k) { return k.join('') === 'rrr'; }), mind = M.fadd(F(1), F(-prob(E, function (k) { return k.indexOf('r') < 0; }).n, prob(E, function (k) { return k.indexOf('r') < 0; }).d));
          root.querySelector('#e_res').innerHTML = '<p>P(rrr) = ' + fh(rrr) + ' ≈ ' + fmt(pct(rrr)) + ' %<br>P(mindestens eine rote) = ' + fh(mind) + ' ≈ ' + fmt(pct(mind)) + ' %</p><p class="note">Kontrolle: Alle Pfadwahrscheinlichkeiten zusammen ergeben ' + fh(P.reduce(function (s, x) { return M.fadd(s, x.p); }, F(0))) + '.</p>';
        }
        function hit() { draw(); cnt++; if (cnt >= 3) done('Gut beobachtet: Ohne Zurücklegen ändern sich die Wahrscheinlichkeiten von Stufe zu Stufe, manche Äste fallen sogar weg. Die Summe aller Pfade ist immer 1.'); }
        root.querySelector('#e_m').addEventListener('change', hit); root.querySelectorAll('input[type=range]').forEach(function (x) { x.addEventListener('input', hit); });
        draw();
      }
    },
    beispiel: { title: 'Dreimal würfeln', q: 'Du wirfst dreimal einen Würfel. Wie groß ist die Wahrscheinlichkeit für <b>genau eine Sechs</b>? Und für <b>mindestens eine Sechs</b>?',
      steps: ['Baum mit zwei Ästen pro Stufe: 6 mit ' + frac(1, 6) + ', keine 6 (k) mit ' + frac(5, 6) + '.', 'Genau eine Sechs: Pfade 6kk, k6k und kk6. Jeder hat ' + frac(1, 6) + ' · ' + frac(5, 6) + ' · ' + frac(5, 6) + ' = ' + frac(25, 216) + '.', 'Summenregel: 3 · ' + frac(25, 216) + ' = ' + frac(75, 216) + ' = <b>' + frac(25, 72) + '</b> ≈ 34,7 %.', 'Mindestens eine Sechs über das Gegenereignis: 1 − ' + frac(5, 6) + ' · ' + frac(5, 6) + ' · ' + frac(5, 6) + ' = 1 − ' + frac(125, 216) + ' = <b>' + frac(91, 216) + '</b> ≈ 42,1 %.', 'Kontrolle: Genau eine Sechs ist ein Teil von „mindestens eine“. 34,7 % &lt; 42,1 % passt. Der Rest (7,4 %) sind die Pfade mit zwei oder drei Sechsen.'] },
    tasks: { gen: gen,
      plan: { G: ['muenze:1', 'pfad:1', 'urne_mit:1', 'prozent:1'], S: ['muenze:2', 'pfad:2', 'urne_ohne:2', 'genau:2', 'mindestens:2'], E: ['urne_mit:2', 'urne_ohne:3', 'rad:2', 'genau:3', 'mindestens:3', 'prozent:2'] },
      extra: 'wieoft', test: ['muenze:2', 'pfad:2', 'urne_mit:2', 'urne_ohne:2', 'mindestens:2', 'prozent:2'] },
    lerncheck: ['Ich zeichne und beschrifte Baumdiagramme mit drei Stufen.', 'Ich berechne Wahrscheinlichkeiten mit Pfad- und Summenregel.', 'Ich rechne beim Ziehen ohne Zurücklegen richtig.', 'Ich nutze das Gegenereignis bei „mindestens einmal“.']
  };
})();
