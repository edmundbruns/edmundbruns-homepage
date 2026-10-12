/* Modul 026 (Klasse 9) · Kreisring und Kreisausschnitt */
var MODULE = (function () {
  var f = M.fmtNum, PI = Math.PI;
  var LN = '#1e3a8a', FL = '#e8eefc', AC = '#d97706', HL = '#1d4ed8', C2 = '#0f766e', OR = '#fbe3c2';
  function r1(x) { return Math.round(x * 10) / 10; }
  function r2(x) { return Math.round(x * 100) / 100; }
  function f1(x) { return f(x, 1); }
  function ex(x) { return f(Math.round(x * 1000) / 1000); }
  function near(x, y, t) { return x !== null && Math.abs(x - y) <= (t || 0.06); }
  /* Unabhängige Kontrolle: π nach Archimedes und Flächen/Längen über feine Vielecke (Gaußsche Trapezformel) */
  var PI_A = (function () { var s = 1, n = 6; for (var k = 0; k < 14; k++) { s = s / Math.sqrt(2 + Math.sqrt(4 - s * s)); n *= 2; } return n * s / 2; })();
  function arcPts(r, a0, a1, N) { var P = []; for (var i = 0; i <= N; i++) { var t = (a0 + (a1 - a0) * i / N) * PI_A / 180; P.push([r * Math.cos(t), r * Math.sin(t)]); } return P; }
  function gauss(P) { var s = 0; for (var i = 0; i < P.length; i++) { var a = P[i], b = P[(i + 1) % P.length]; s += (a[0] - b[0]) * (a[1] + b[1]); } return Math.abs(s) / 2; }
  function plen(P) { var s = 0; for (var i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }
  /* Fläche eines Ringausschnitts (ri = 0: Kreisausschnitt) über Vielecke mit N und 2N Ecken, Richardson-Extrapolation */
  function polyA0(ra, ri, al, N) { var o = arcPts(ra, 0, al, N), i = ri > 0 ? arcPts(ri, al, 0, N) : [[0, 0]]; return gauss(o.concat(i)); }
  function polyA(ra, ri, al) { return (4 * polyA0(ra, ri, al, 2400) - polyA0(ra, ri, al, 1200)) / 3; }
  function polyB(r, al) { return (4 * plen(arcPts(r, 0, al, 2400)) - plen(arcPts(r, 0, al, 1200))) / 3; }
  function chk(ans, val, tol) { return function () { return Math.abs(ans - val) <= tol + 1e-7 || 'Nachrechnung: ' + val + ' statt ' + ans; }; }
  function u(x, e) { return f(x) + ' ' + (e || 'cm'); }

  /* Kreisausschnitt bzw. Ringausschnitt, maßstabsgetreu (Winkel), Radius in Pixeln fest */
  function sectorPic(al, o) {
    o = o || {}; var R = o.R || 90, Ri = o.ri ? R * o.ri : 0, cx = 130, cy = 120, W = 260, H = 240;
    function P(rr, a) { a = a * PI / 180; return [(cx + rr * Math.cos(a)).toFixed(1), (cy - rr * Math.sin(a)).toFixed(1)]; }
    var big = al > 180 ? 1 : 0, s = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (o.label || 'Kreisausschnitt') + '" style="max-width:' + (o.max || 280) + 'px">';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="#9aa6c4" stroke-width="1.2" stroke-dasharray="5 4"/>';
    if (Ri) s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + Ri + '" fill="none" stroke="#9aa6c4" stroke-width="1.2" stroke-dasharray="5 4"/>';
    var a0 = P(R, 0), a1 = P(R, al), d;
    if (al >= 360) d = 'M' + (cx + R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 1 0 ' + (cx + R) + ' ' + cy + ' Z' + (Ri ? ' M' + (cx + Ri) + ' ' + cy + ' A' + Ri + ' ' + Ri + ' 0 1 1 ' + (cx - Ri) + ' ' + cy + ' A' + Ri + ' ' + Ri + ' 0 1 1 ' + (cx + Ri) + ' ' + cy + ' Z' : '');
    else if (Ri) { var i0 = P(Ri, 0), i1 = P(Ri, al); d = 'M' + i0.join(' ') + ' L' + a0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + big + ' 0 ' + a1.join(' ') + ' L' + i1.join(' ') + ' A' + Ri + ' ' + Ri + ' 0 ' + big + ' 1 ' + i0.join(' ') + ' Z'; }
    else d = 'M' + cx + ' ' + cy + ' L' + a0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + big + ' 0 ' + a1.join(' ') + ' Z';
    s += '<path d="' + d + '" fill="' + (o.fill || FL) + '" fill-rule="evenodd" stroke="' + LN + '" stroke-width="2.5" stroke-linejoin="round"/>';
    if (o.arc) { s += '<path d="M' + a0.join(' ') + ' A' + R + ' ' + R + ' 0 ' + big + ' 0 ' + a1.join(' ') + '" fill="none" stroke="' + AC + '" stroke-width="4"/>'; }
    if (al < 360) {
      var ra = Math.min(26, R * 0.3), q0 = P(ra, 0), q1 = P(ra, al);
      s += '<path d="M' + q0.join(' ') + ' A' + ra + ' ' + ra + ' 0 ' + big + ' 0 ' + q1.join(' ') + '" fill="none" stroke="' + AC + '" stroke-width="1.8"/>';
      if (o.alpha) { var am = P(ra + 16, al / 2); s += '<text x="' + am[0] + '" y="' + (+am[1] + 5) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + o.alpha + '</text>'; }
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="2.5" fill="' + LN + '"/>';
    if (o.rText) { s += '<text x="' + (cx + R * 0.6) + '" y="' + (cy + 18) + '" font-size="13" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + o.rText + '</text>'; }
    if (o.riText && Ri) { var pr = P(Ri, al >= 360 ? 140 : al / 2); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + pr[0] + '" y2="' + pr[1] + '" stroke="' + C2 + '" stroke-width="2"/>'; var pt = P(Ri * 0.55, (al >= 360 ? 140 : al / 2) + 18); s += '<text x="' + pt[0] + '" y="' + pt[1] + '" font-size="15" font-weight="700" text-anchor="middle" fill="' + C2 + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + o.riText + '</text>'; }
    if (o.raText && al >= 360) { s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R) + '" y2="' + cy + '" stroke="' + AC + '" stroke-width="2"/><text x="' + (cx + (R + Ri) / 2) + '" y="' + (cy - 8) + '" font-size="15" font-weight="700" text-anchor="middle" fill="#1c1830" stroke="#fff" stroke-width="3" paint-order="stroke">' + o.raText + '</text>'; }
    if (o.bText) { var pb = P(R + 16, al / 2), anc = Math.cos(al / 2 * PI / 180) > 0.3 ? 'start' : Math.cos(al / 2 * PI / 180) < -0.3 ? 'end' : 'middle'; s += '<text x="' + pb[0] + '" y="' + (+pb[1] + 5) + '" font-size="13" font-weight="700" text-anchor="' + anc + '" fill="' + AC + '" stroke="#fff" stroke-width="3" paint-order="stroke">' + o.bText + '</text>'; }
    return s + '</svg>';
  }
  /* Laufbahn: Rechteck mit zwei Halbkreisen, Bahn der Breite w außen herum (maßstabsgetreu) */
  function trackPic(l, r, w) {
    var sc = 300 / (l + 2 * (r + w)), L = l * sc, Ri = r * sc, Ro = (r + w) * sc, x0 = 20 + Ro, x1 = x0 + L, cy = 20 + Ro, H = 2 * Ro + 64;
    function st(R) { return 'M' + x0 + ' ' + (cy - R) + ' L' + x1 + ' ' + (cy - R) + ' A' + R + ' ' + R + ' 0 0 1 ' + x1 + ' ' + (cy + R) + ' L' + x0 + ' ' + (cy + R) + ' A' + R + ' ' + R + ' 0 0 1 ' + x0 + ' ' + (cy - R) + ' Z'; }
    var s = '<svg class="viz" viewBox="0 0 ' + Math.round(x1 + Ro + 20) + ' ' + Math.round(H) + '" role="img" aria-label="Sportplatz mit Laufbahn" style="max-width:420px">';
    s += '<path d="' + st(Ro) + ' ' + st(Ri) + '" fill="' + OR + '" fill-rule="evenodd" stroke="' + LN + '" stroke-width="2"/><path d="' + st(Ri) + '" fill="#dff3ea" stroke="' + LN + '" stroke-width="2"/>';
    s += '<line x1="' + x0 + '" y1="' + (cy - Ri) + '" x2="' + x0 + '" y2="' + (cy + Ri) + '" stroke="' + C2 + '" stroke-width="1" stroke-dasharray="4 3"/><line x1="' + x1 + '" y1="' + (cy - Ri) + '" x2="' + x1 + '" y2="' + (cy + Ri) + '" stroke="' + C2 + '" stroke-width="1" stroke-dasharray="4 3"/>';
    s += '<line x1="' + x1 + '" y1="' + cy + '" x2="' + (x1 + Ri) + '" y2="' + cy + '" stroke="' + C2 + '" stroke-width="2"/><text x="' + (x1 + Ri / 2) + '" y="' + (cy - 6) + '" font-size="12" font-weight="700" text-anchor="middle" fill="' + C2 + '">' + u(r, 'm') + '</text>';
    s += '<text x="' + ((x0 + x1) / 2) + '" y="' + (cy + 5) + '" font-size="12" font-weight="700" text-anchor="middle">' + u(l, 'm') + '</text><line x1="' + x0 + '" y1="' + (cy + 12) + '" x2="' + x1 + '" y2="' + (cy + 12) + '" stroke="#1c1830" stroke-width="1"/>';
    s += '<text x="' + ((x0 + x1) / 2) + '" y="' + (cy + Ro + 18) + '" font-size="12" font-weight="700" text-anchor="middle" fill="' + AC + '">Bahnbreite ' + u(w, 'm') + '</text>';
    return s + '</svg>';
  }
  /* Zusammengesetzte Figuren, maßstabsgetreu */
  function figPic(type, a, b) {
    var s, sc;
    if (type === 'halb') { /* Rechteck a × b, Halbkreis auf der rechten Seite b */
      sc = Math.min(190 / (a + b / 2), 150 / b); var A = a * sc, B = b * sc, x0 = 62, y0 = 15, R = B / 2;
      s = '<svg class="viz" viewBox="0 0 ' + Math.round(x0 + A + R + 20) + ' ' + Math.round(y0 + B + 34) + '" role="img" aria-label="Rechteck mit Halbkreis" style="max-width:320px"><path d="M' + x0 + ' ' + y0 + ' L' + (x0 + A) + ' ' + y0 + ' A' + R + ' ' + R + ' 0 0 1 ' + (x0 + A) + ' ' + (y0 + B) + ' L' + x0 + ' ' + (y0 + B) + ' Z" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
      s += '<line x1="' + (x0 + A) + '" y1="' + y0 + '" x2="' + (x0 + A) + '" y2="' + (y0 + B) + '" stroke="' + LN + '" stroke-width="1" stroke-dasharray="4 3"/>';
      s += '<text x="' + (x0 + A / 2) + '" y="' + (y0 + B + 22) + '" font-size="13" font-weight="700" text-anchor="middle">' + u(a) + '</text><text x="' + (x0 - 6) + '" y="' + (y0 + B / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="end">' + u(b) + '</text>';
      return s + '</svg>';
    }
    if (type === 'viertel') { /* Quadrat a, Viertelkreis mit Radius a um die linke untere Ecke ausgeschnitten */
      sc = 160 / a; var Q = a * sc, x = 62, y = 15;
      s = '<svg class="viz" viewBox="0 0 ' + Math.round(x + Q + 20) + ' ' + Math.round(y + Q + 34) + '" role="img" aria-label="Quadrat ohne Viertelkreis" style="max-width:260px"><rect x="' + x + '" y="' + y + '" width="' + Q + '" height="' + Q + '" fill="' + FL + '" stroke="' + LN + '" stroke-width="1.5"/>';
      s += '<path d="M' + (x + Q) + ' ' + y + ' L' + (x + Q) + ' ' + (y + Q) + ' A' + Q + ' ' + Q + ' 0 0 0 ' + x + ' ' + y + ' Z" fill="' + OR + '" stroke="' + LN + '" stroke-width="2.5"/>';
      s += '<text x="' + (x + Q / 2) + '" y="' + (y + Q + 22) + '" font-size="13" font-weight="700" text-anchor="middle">' + u(a) + '</text><text x="' + (x - 6) + '" y="' + (y + Q / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="end">' + u(a) + '</text>';
      return s + '</svg>';
    }
    /* Stadionform: Rechteck a × b mit Halbkreisen links und rechts */
    sc = Math.min(260 / (a + b), 140 / b); var A2 = a * sc, B2 = b * sc, R2 = B2 / 2, x2 = 30 + R2, y2 = 15;
    s = '<svg class="viz" viewBox="0 0 ' + Math.round(x2 + A2 + R2 + 30) + ' ' + Math.round(y2 + B2 + 34) + '" role="img" aria-label="Rechteck mit zwei Halbkreisen" style="max-width:360px"><path d="M' + x2 + ' ' + y2 + ' L' + (x2 + A2) + ' ' + y2 + ' A' + R2 + ' ' + R2 + ' 0 0 1 ' + (x2 + A2) + ' ' + (y2 + B2) + ' L' + x2 + ' ' + (y2 + B2) + ' A' + R2 + ' ' + R2 + ' 0 0 1 ' + x2 + ' ' + y2 + ' Z" fill="' + FL + '" stroke="' + LN + '" stroke-width="2.5"/>';
    s += '<line x1="' + x2 + '" y1="' + y2 + '" x2="' + x2 + '" y2="' + (y2 + B2) + '" stroke="' + LN + '" stroke-width="1" stroke-dasharray="4 3"/><line x1="' + (x2 + A2) + '" y1="' + y2 + '" x2="' + (x2 + A2) + '" y2="' + (y2 + B2) + '" stroke="' + LN + '" stroke-width="1" stroke-dasharray="4 3"/>';
    s += '<text x="' + (x2 + A2 / 2) + '" y="' + (y2 + B2 + 22) + '" font-size="13" font-weight="700" text-anchor="middle">' + u(a) + '</text><text x="' + (x2 + A2 / 2) + '" y="' + (y2 + B2 / 2 + 5) + '" font-size="13" font-weight="700" text-anchor="middle">' + u(b) + '</text><line x1="' + (x2 + A2 / 2 + 22) + '" y1="' + y2 + '" x2="' + (x2 + A2 / 2 + 22) + '" y2="' + (y2 + B2) + '" stroke="#1c1830" stroke-width="1"/>';
    return s + '</svg>';
  }
  var ANG = [30, 40, 45, 60, 72, 90, 120, 135, 144, 150, 210, 225, 240, 270, 300];
  function fracTxt(al) { var g = M.gcd(al, 360); return '<span class="frac"><span>' + al + '°</span><span>360°</span></span>' + (g > 1 ? ' = ' + M.fhtml(M.F(al / g, 360 / g)) : ''); }

  var gen = {
    ring: function (lvl) {
      var ri = lvl <= 1 ? M.rnd(2, 8) : M.rnd(3, 15), ra = ri + (lvl <= 1 ? M.rnd(2, 6) : M.rnd(1, 10)), A = r1(PI * (ra * ra - ri * ri));
      return { skill: 'Fläche des Kreisrings', q: 'Berechne die Fläche des Kreisrings mit dem äußeren Radius r<sub>a</sub> = ' + u(ra) + ' und dem inneren Radius r<sub>i</sub> = ' + u(ri) + '. Runde auf eine Nachkommastelle.' + sectorPic(360, { ri: ri / ra, raText: 'r<tspan dy="3" font-size="10">a</tspan>', riText: 'r<tspan dy="3" font-size="10">i</tspan>', label: 'Kreisring', max: 240 }),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: 'cm²' }],
        hints: ['Ringfläche = großer Kreis minus kleiner Kreis: A = π · r<sub>a</sub>² − π · r<sub>i</sub>² = π · (r<sub>a</sub>² − r<sub>i</sub>²).', 'r<sub>a</sub>² − r<sub>i</sub>² = ' + ra * ra + ' − ' + ri * ri + ' = ' + (ra * ra - ri * ri) + '.', 'A = π · ' + (ra * ra - ri * ri) + ' ≈ ' + ex(PI * (ra * ra - ri * ri)) + ' cm².'],
        solution: 'A = π · (' + ra + '² − ' + ri + '²) cm² = π · (' + ra * ra + ' − ' + ri * ri + ') cm² = π · ' + (ra * ra - ri * ri) + ' cm² ≈ ' + f1(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * (ra - ri) * (ra - ri)), 0.1)) return 'Du hast (r<sub>a</sub> − r<sub>i</sub>)² gerechnet. Das ist nicht dasselbe wie r<sub>a</sub>² − r<sub>i</sub>². Quadriere jeden Radius einzeln.';
          if (near(x, r1(PI * ra * ra), 0.1)) return 'Das ist der ganze große Kreis. Ziehe das Loch (den inneren Kreis) noch ab.';
          if (near(x, r1(2 * PI * (ra - ri)), 0.1) || near(x, r1(2 * PI * (ra + ri)), 0.1)) return 'Das ist eine Länge, keine Fläche. Rechne mit A = π · (r<sub>a</sub>² − r<sub>i</sub>²).'; return null; },
        verify: chk(A, polyA(ra, ri, 360), 0.05) };
    },
    ringD: function () {
      var c = M.pick([['Eine Unterlegscheibe', 'mm', [16, 20, 24, 30], [8, 10, 12]], ['Eine CD', 'mm', [120], [15]], ['Ein Rettungsring', 'cm', [60, 70, 80], [36, 40, 44]], ['Ein Gartenteich mit Kiesweg', 'm', [8, 10, 12], [5, 6, 7]]]);
      var Da = M.pick(c[2]), Di = M.pick(c[3]), e = c[1], A = r1(PI * (Da * Da - Di * Di) / 4), ra = Da / 2, ri = Di / 2;
      var what = c[0] === 'Ein Gartenteich mit Kiesweg' ? 'Ein runder Gartenteich hat einen Durchmesser von ' + u(Di, e) + '. Um ihn herum liegt ein ringförmiger Kiesweg. Der Außendurchmesser des Weges ist ' + u(Da, e) + '. Wie groß ist die Fläche des Weges?' : c[0] + ' hat einen Außendurchmesser von ' + u(Da, e) + ' und einen Innendurchmesser von ' + u(Di, e) + '. Wie groß ist die ringförmige Fläche?';
      return { skill: 'Kreisring mit Durchmessern', q: what + ' Runde auf eine Nachkommastelle.',
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: e + '²' }],
        hints: ['Halbiere zuerst beide Durchmesser: r<sub>a</sub> = ' + u(ra, e) + ', r<sub>i</sub> = ' + u(ri, e) + '.', 'A = π · (r<sub>a</sub>² − r<sub>i</sub>²) = π · (' + f(ra * ra) + ' − ' + f(ri * ri) + ').', 'π · ' + f(ra * ra - ri * ri) + ' ≈ ' + ex(PI * (ra * ra - ri * ri)) + '.'],
        solution: 'r<sub>a</sub> = ' + u(ra, e) + ', r<sub>i</sub> = ' + u(ri, e) + '. A = π · (' + f(ra) + '² − ' + f(ri) + '²) = π · ' + f(ra * ra - ri * ri) + ' ' + e + '² ≈ ' + f1(A) + ' ' + e + '²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * (Da * Da - Di * Di)), 0.2)) return 'Du hast die Durchmesser eingesetzt. In die Formel gehören die Radien. Dein Ergebnis ist viermal zu groß.';
          if (near(x, r1(PI * (ra - ri) * (ra - ri)), 0.1)) return 'Quadriere jeden Radius einzeln: r<sub>a</sub>² − r<sub>i</sub>², nicht (r<sub>a</sub> − r<sub>i</sub>)².'; return null; },
        verify: chk(A, polyA(ra, ri, 360), 0.05) };
    },
    sektorA: function (lvl) {
      var al = lvl <= 1 ? M.pick([90, 180, 120, 60, 45]) : M.pick(ANG), r = lvl <= 1 ? M.rnd(3, 12) : M.pick([M.rnd(4, 20), M.rnd(25, 95) / 10]), A = r1(al / 360 * PI * r * r);
      return { skill: 'Fläche des Kreisausschnitts', q: 'Berechne die Fläche des Kreisausschnitts mit r = ' + u(r) + ' und α = ' + al + '°. Runde auf eine Nachkommastelle.' + sectorPic(al, { rText: 'r = ' + u(r), alpha: al + '°' }),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: 'cm²' }],
        hints: ['Der Ausschnitt ist der Anteil ' + fracTxt(al) + ' des ganzen Kreises.', 'Ganzer Kreis: π · ' + f(r) + '² ≈ ' + ex(PI * r * r) + ' cm².', 'A = ' + al + ' : 360 · π · ' + f(r) + '² ≈ ' + ex(al / 360 * PI * r * r) + ' cm².'],
        solution: 'A = ' + fracTxt(al) + ' · π · r² = ' + al + ' : 360 · π · (' + u(r) + ')² ≈ ' + f1(A) + ' cm²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(PI * r * r), 0.1)) return 'Das ist der ganze Kreis. Nimm davon nur den Anteil α : 360°.';
          if (near(x, r1(al / 360 * 2 * PI * r), 0.06)) return 'Das ist die Bogenlänge. Für die Fläche brauchst du π · r², nicht 2 · π · r.';
          if (near(x, r1(al / 180 * PI * r * r), 0.1)) return 'Der volle Kreis hat 360°, nicht 180°. Teile α durch 360°.'; return null; },
        verify: chk(A, polyA(r, 0, al), 0.05) };
    },
    bogen: function (lvl) {
      var al = lvl <= 1 ? M.pick([90, 180, 120, 60]) : M.pick(ANG), r = lvl <= 1 ? M.rnd(3, 12) : M.pick([M.rnd(4, 20), M.rnd(25, 95) / 10]), b = r1(al / 360 * 2 * PI * r);
      return { skill: 'Bogenlänge', q: 'Berechne die Länge des Kreisbogens b (orange) für r = ' + u(r) + ' und α = ' + al + '°. Runde auf eine Nachkommastelle.' + sectorPic(al, { rText: 'r = ' + u(r), alpha: al + '°', arc: true, bText: 'b' }),
        inputs: [{ kind: 'num', answer: b, tol: 0.05, label: 'b ≈', unit: 'cm' }],
        hints: ['Der Bogen ist der Anteil ' + fracTxt(al) + ' des ganzen Umfangs.', 'Ganzer Umfang: 2 · π · ' + f(r) + ' ≈ ' + ex(2 * PI * r) + ' cm.', 'b = ' + al + ' : 360 · 2 · π · ' + f(r) + ' ≈ ' + ex(al / 360 * 2 * PI * r) + ' cm.'],
        solution: 'b = ' + fracTxt(al) + ' · 2 · π · r = ' + al + ' : 360 · 2 · π · ' + u(r) + ' ≈ ' + f1(b) + ' cm',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(al / 360 * PI * r * r), 0.1)) return 'Das ist die Fläche des Ausschnitts. Für den Bogen nimmst du den Umfang 2 · π · r.';
          if (near(x, r1(al / 360 * PI * r), 0.06)) return 'Der ganze Umfang ist 2 · π · r. Du hast die 2 vergessen.';
          if (near(x, r1(2 * PI * r), 0.06)) return 'Das ist der ganze Umfang. Nimm nur den Anteil α : 360°.'; return null; },
        verify: chk(b, polyB(r, al), 0.05) };
    },
    sprenger: function () {
      var r = M.pick([4, 5, 6, 7, 8, 10]), al = M.pick([90, 120, 135, 150, 180, 210, 240, 270]), A = r1(al / 360 * PI * r * r);
      return { skill: 'Sachaufgabe Rasensprenger', q: 'Ein Rasensprenger dreht sich hin und her und überstreicht dabei einen Winkel von ' + al + '°. Das Wasser reicht ' + r + ' m weit. Wie groß ist die Fläche, die bewässert wird? Runde auf eine Nachkommastelle.' + sectorPic(al, { rText: r + ' m', alpha: al + '°', fill: '#dff3ea', label: 'Bewässerte Fläche' }),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: 'm²' }],
        hints: ['Die bewässerte Fläche ist ein Kreisausschnitt mit r = ' + r + ' m und α = ' + al + '°.', 'Anteil: ' + fracTxt(al) + '. Ganzer Kreis: π · ' + r + '² = π · ' + r * r + ' m².', 'A = ' + al + ' : 360 · π · ' + r * r + ' ≈ ' + ex(al / 360 * PI * r * r) + ' m².'],
        solution: 'A = ' + fracTxt(al) + ' · π · (' + r + ' m)² = ' + al + ' : 360 · π · ' + r * r + ' m² ≈ ' + f1(A) + ' m²',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, r1(PI * r * r), 0.1)) return 'Der Sprenger dreht sich nicht ganz herum. Nimm nur den Anteil ' + al + '° : 360°.'; if (near(x, r1(al / 360 * PI * r * r / 4), 0.1)) return 'Die Reichweite ' + r + ' m ist der Radius, nicht der Durchmesser.'; return null; },
        verify: chk(A, polyA(r, 0, al), 0.05) };
    },
    torte: function () {
      var d = M.pick([24, 26, 28, 30]), n = M.pick([8, 10, 12, 16]), r = d / 2, A = r1(PI * r * r / n), b = r1(PI * d / n), al = 360 / n;
      return { skill: 'Tortenstück', q: 'Eine runde Torte mit ' + d + ' cm Durchmesser wird in ' + n + ' gleich große Stücke geschnitten.<br>a) Wie groß ist der Mittelpunktswinkel α eines Stücks?<br>b) Wie groß ist die Fläche eines Stücks (von oben gesehen)?<br>c) Wie lang ist der Rand (Bogen) eines Stücks? Runde b) und c) auf eine Nachkommastelle.' + sectorPic(al, { rText: 'r', alpha: 'α', arc: true, fill: OR, label: 'Tortenstück', max: 240 }),
        inputs: [{ kind: 'num', answer: al, tol: 0.05, label: 'a) α =', unit: '°' }, { kind: 'num', answer: A, tol: 0.05, label: 'b) A ≈', unit: 'cm²' }, { kind: 'num', answer: b, tol: 0.05, label: 'c) b ≈', unit: 'cm' }],
        hints: ['α = 360° : ' + n + '. Der Radius ist ' + d + ' cm : 2 = ' + r + ' cm.', 'Ein Stück ist der ' + n + '. Teil der ganzen Torte: A = π · ' + r + '² : ' + n + '.', 'Der Rand ist der ' + n + '. Teil des Umfangs: b = π · ' + d + ' : ' + n + '.'],
        solution: 'a) α = 360° : ' + n + ' = ' + f(al) + '°. b) A = π · (' + r + ' cm)² : ' + n + ' ≈ ' + ex(PI * r * r) + ' cm² : ' + n + ' ≈ ' + f1(A) + ' cm². c) b = π · ' + d + ' cm : ' + n + ' ≈ ' + f1(b) + ' cm.',
        mistakes: function (v) { var y = M.parseNum(v[1]); if (near(y, r1(PI * d * d / n), 0.2)) return 'Bei b) hast du den Durchmesser in π · r² eingesetzt. Nimm den Radius ' + r + ' cm.'; return null; },
        verify: function () { return (Math.abs(polyA(r, 0, al) - A) <= 0.05 + 1e-7 && Math.abs(polyB(r, al) - b) <= 0.05 + 1e-7) || 'Torte falsch'; } };
    },
    uhr: function () {
      var L = M.pick([8, 10, 12, 15, 20]), t = M.pick([10, 15, 20, 25, 40, 45, 50]), al = 6 * t, b = r1(al / 360 * 2 * PI * L), A = r1(al / 360 * PI * L * L);
      return { skill: 'Sachaufgabe Uhrzeiger', q: 'Der Minutenzeiger einer Wanduhr ist ' + L + ' cm lang. Betrachte ' + t + ' Minuten.<br>a) Um welchen Winkel dreht sich der Zeiger?<br>b) Welchen Weg legt die Zeigerspitze zurück?<br>c) Welche Fläche überstreicht der Zeiger? Runde b) und c) auf eine Nachkommastelle.',
        inputs: [{ kind: 'num', answer: al, label: 'a) α =', unit: '°' }, { kind: 'num', answer: b, tol: 0.05, label: 'b) Weg ≈', unit: 'cm' }, { kind: 'num', answer: A, tol: 0.05, label: 'c) Fläche ≈', unit: 'cm²' }],
        hints: ['In 60 Minuten dreht sich der Zeiger einmal ganz herum (360°). In 1 Minute also um 6°.', 'α = ' + t + ' · 6° = ' + al + '°. Die Spitze bewegt sich auf einem Kreisbogen mit r = ' + L + ' cm.', 'b = ' + al + ' : 360 · 2 · π · ' + L + ' und A = ' + al + ' : 360 · π · ' + L + '².'],
        solution: 'a) α = ' + t + ' · 6° = ' + al + '°. b) b = ' + fracTxt(al) + ' · 2 · π · ' + L + ' cm ≈ ' + f1(b) + ' cm. c) A = ' + fracTxt(al) + ' · π · (' + L + ' cm)² ≈ ' + f1(A) + ' cm².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === t) return 'Die Minutenzahl ist nicht der Winkel. Eine ganze Stunde sind 360°, eine Minute also 6°.'; var y = M.parseNum(v[1]); if (near(y, r1(al / 360 * PI * L), 0.06)) return 'Bei b): Der ganze Umfang ist 2 · π · r.'; return null; },
        verify: function () { return (Math.abs(polyB(L, al) - b) <= 0.05 + 1e-7 && Math.abs(polyA(L, 0, al) - A) <= 0.05 + 1e-7) || 'Uhr falsch'; } };
    },
    figur: function (lvl) {
      var type = lvl <= 1 ? 'halb' : M.pick(lvl >= 3 ? ['viertel', 'stadion', 'halb'] : ['halb', 'stadion', 'viertel']), a, b, A, sol, hints, mis;
      if (type === 'halb') {
        a = M.rnd(5, 14); b = 2 * M.rnd(2, 6); A = r1(a * b + PI * (b / 2) * (b / 2) / 2);
        hints = ['Zerlege die Figur in ein Rechteck und einen Halbkreis.', 'Rechteck: ' + a + ' · ' + b + ' = ' + a * b + ' cm². Der Halbkreis hat den Durchmesser ' + b + ' cm, also r = ' + b / 2 + ' cm.', 'Halbkreis: π · ' + b / 2 + '² : 2 ≈ ' + ex(PI * b * b / 8) + ' cm². Addiere.'];
        sol = 'Rechteck: ' + a + ' cm · ' + b + ' cm = ' + a * b + ' cm². Halbkreis: π · (' + b / 2 + ' cm)² : 2 ≈ ' + ex(PI * b * b / 8) + ' cm². Zusammen ≈ ' + f1(A) + ' cm².';
        mis = function (x) { if (near(x, r1(a * b + PI * b * b / 4), 0.1)) return 'Oben ist nur ein <b>Halbkreis</b>. Teile π · r² durch 2.'; if (near(x, r1(a * b + PI * b * b / 2), 0.1)) return 'Der Radius des Halbkreises ist ' + b / 2 + ' cm, nicht ' + b + ' cm.'; return null; };
      } else if (type === 'viertel') {
        a = M.rnd(4, 15); b = a; A = r1(a * a - PI * a * a / 4);
        hints = ['Die orange Fläche ist das Quadrat ohne den Viertelkreis.', 'Quadrat: ' + a + ' · ' + a + ' = ' + a * a + ' cm². Der Viertelkreis hat den Radius ' + a + ' cm.', 'Viertelkreis: π · ' + a + '² : 4 ≈ ' + ex(PI * a * a / 4) + ' cm². Ziehe ab.'];
        sol = 'Quadrat: ' + a * a + ' cm². Viertelkreis: π · (' + a + ' cm)² : 4 ≈ ' + ex(PI * a * a / 4) + ' cm². Orange Fläche: ' + a * a + ' cm² − ' + ex(PI * a * a / 4) + ' cm² ≈ ' + f1(A) + ' cm².';
        mis = function (x) { if (near(x, r1(PI * a * a / 4), 0.1)) return 'Das ist der Viertelkreis (blau). Gesucht ist die orange Fläche: Quadrat minus Viertelkreis.'; if (near(x, r1(a * a - PI * a * a / 16), 0.1)) return 'Der Radius des Viertelkreises ist die ganze Seitenlänge ' + a + ' cm.'; return null; };
      } else {
        a = M.rnd(6, 16); b = 2 * M.rnd(2, 5); A = r1(a * b + PI * (b / 2) * (b / 2));
        hints = ['Die beiden Halbkreise ergeben zusammen einen ganzen Kreis.', 'Rechteck: ' + a + ' · ' + b + ' = ' + a * b + ' cm². Kreis mit r = ' + b / 2 + ' cm.', 'Kreis: π · ' + b / 2 + '² ≈ ' + ex(PI * b * b / 4) + ' cm². Addiere.'];
        sol = 'Rechteck: ' + a + ' cm · ' + b + ' cm = ' + a * b + ' cm². Zwei Halbkreise = ein Kreis: π · (' + b / 2 + ' cm)² ≈ ' + ex(PI * b * b / 4) + ' cm². Zusammen ≈ ' + f1(A) + ' cm².';
        mis = function (x) { if (near(x, r1(a * b + PI * b * b / 8), 0.1)) return 'Es sind <b>zwei</b> Halbkreise, zusammen also ein ganzer Kreis.'; if (near(x, r1(a * b + PI * b * b), 0.2)) return 'Der Radius ist die halbe Breite: r = ' + b / 2 + ' cm.'; return null; };
      }
      var qtxt = type === 'viertel' ? 'Aus einem Quadrat wird ein Viertelkreis ausgeschnitten. Berechne die orange Fläche.' : type === 'halb' ? 'Die Figur besteht aus einem Rechteck und einem Halbkreis. Berechne ihren Flächeninhalt.' : 'Die Figur besteht aus einem Rechteck und zwei Halbkreisen. Berechne ihren Flächeninhalt.';
      return { skill: 'Zusammengesetzte Figuren', level: lvl, q: qtxt + ' Runde auf eine Nachkommastelle.' + figPic(type, a, b),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'A ≈', unit: 'cm²' }], hints: hints, solution: sol,
        mistakes: function (v) { var x = M.parseNum(v[0]); return x === null ? null : mis(x); },
        verify: function () { var v = type === 'halb' ? a * b + polyA(b / 2, 0, 180) : type === 'viertel' ? a * a - polyA(a, 0, 90) : a * b + polyA(b / 2, 0, 360); return Math.abs(v - A) <= 0.05 + 1e-7 || 'Figur: ' + v; } };
    },
    laufbahn: function () {
      var l = M.pick([80, 84, 90, 100]), r = M.pick([30, 32, 35, 36]), w = M.pick([4, 5, 6, 8]), Rr = r1(2 * l * w), Ri = PI * ((r + w) * (r + w) - r * r), A = r1(2 * l * w + Ri);
      return { skill: 'Sachaufgabe Laufbahn', level: 3, q: 'Ein Sportplatz besteht aus einem Rechteck mit zwei Halbkreisen. Die Geraden sind ' + l + ' m lang, die Halbkreise haben innen den Radius ' + r + ' m. Rundherum liegt eine ' + w + ' m breite Laufbahn (orange). Sie bekommt einen neuen Belag. Wie viel m² sind das? Runde auf eine Nachkommastelle.' + trackPic(l, r, w),
        inputs: [{ kind: 'num', answer: A, tol: 0.05, label: 'Belag ≈', unit: 'm²' }],
        hints: ['Zerlege die Laufbahn: zwei gerade Rechtecke und zwei halbe Kreisringe. Die beiden halben Ringe ergeben zusammen einen ganzen Kreisring.', 'Rechtecke: 2 · ' + l + ' m · ' + w + ' m = ' + 2 * l * w + ' m². Kreisring: r<sub>i</sub> = ' + r + ' m, r<sub>a</sub> = ' + (r + w) + ' m.', 'Kreisring: π · (' + (r + w) + '² − ' + r + '²) = π · ' + ((r + w) * (r + w) - r * r) + ' ≈ ' + ex(Ri) + ' m².'],
        solution: 'Rechtecke: 2 · ' + l + ' m · ' + w + ' m = ' + f(Rr) + ' m². Kreisring: π · (' + (r + w) + '² − ' + r + '²) m² = π · ' + ((r + w) * (r + w) - r * r) + ' m² ≈ ' + ex(Ri) + ' m². Zusammen ≈ ' + f1(A) + ' m².',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null;
          if (near(x, r1(Ri), 0.1)) return 'Das sind nur die Kurven. Die beiden geraden Stücke fehlen noch.';
          if (near(x, r1(2 * l * w), 0.1)) return 'Das sind nur die Geraden. Die Kurven bilden zusammen einen Kreisring.';
          if (near(x, r1(2 * l * w + PI * w * w), 0.1)) return 'Ein Kreisring ist nicht π · w². Rechne π · (r<sub>a</sub>² − r<sub>i</sub>²) mit r<sub>a</sub> = ' + (r + w) + ' m.';
          if (near(x, r1(l * w + Ri), 0.1)) return 'Es gibt zwei gerade Stücke, oben und unten.'; return null; },
        verify: chk(A, 2 * l * w + polyA(r + w, r, 360), 0.05) };
    },
    winkel: function () {
      var r = M.rnd(4, 15), al = 5 * M.rnd(4, 60), byB = Math.random() < 0.5, b = r2(al / 360 * 2 * PI * r), A = r2(al / 360 * PI * r * r);
      return { skill: 'Mittelpunktswinkel berechnen', level: 3, q: 'Ein Kreisausschnitt hat den Radius ' + u(r) + ' und ' + (byB ? 'die Bogenlänge b = ' + u(b) : 'den Flächeninhalt A = ' + f(A) + ' cm²') + '. Wie groß ist der Mittelpunktswinkel α? Runde auf ganze Grad.',
        inputs: [{ kind: 'num', answer: al, tol: 0.5, label: 'α ≈', unit: '°' }],
        hints: byB ? ['Der ganze Umfang ist 2 · π · ' + r + ' ≈ ' + ex(2 * PI * r) + ' cm.', 'Welcher Anteil des Umfangs ist der Bogen? ' + f(b) + ' : ' + ex(2 * PI * r) + ' ≈ ' + ex(b / (2 * PI * r)) + '.', 'α = Anteil · 360°.'] : ['Die ganze Kreisfläche ist π · ' + r + '² ≈ ' + ex(PI * r * r) + ' cm².', 'Anteil: ' + f(A) + ' : ' + ex(PI * r * r) + ' ≈ ' + ex(A / (PI * r * r)) + '.', 'α = Anteil · 360°.'],
        solution: byB ? 'α = b : (2 · π · r) · 360° = ' + f(b) + ' : (2 · π · ' + r + ') · 360° ≈ ' + al + '°.' : 'α = A : (π · r²) · 360° = ' + f(A) + ' : (π · ' + r * r + ') · 360° ≈ ' + al + '°.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (byB && near(x, 2 * al, 1)) return 'Der ganze Umfang ist 2 · π · r, nicht π · r.'; if (near(x, al / 2, 1)) return 'Vergleiche mit dem vollen Kreis (360°), nicht mit dem Halbkreis.'; return null; },
        verify: function () { var v = byB ? b / polyB(r, 360) * 360 : A / polyA(r, 0, 360) * 360; return Math.abs(v - al) < 0.5 || 'Winkel: ' + v; } };
    },
    wischer: function () {
      var L = M.pick([45, 50, 55, 60]), w = M.pick([30, 35, 40]), al = M.pick([90, 100, 110, 120, 135]), ri = L - w, A = Math.round(al / 360 * PI * (L * L - ri * ri)), b = r1(al / 360 * 2 * PI * L);
      return { skill: 'Scheibenwischer (Transfer)', level: 3, q: 'Ein Scheibenwischer-Arm ist ' + L + ' cm lang. Am äußeren Ende sitzt ein ' + w + ' cm langes Wischblatt. Der Arm dreht sich um ' + al + '°.<br>a) Wie groß ist die Fläche, die das Wischblatt sauber wischt (orange)? Runde auf ganze cm².<br>b) Wie lang ist der Weg der äußeren Spitze? Runde auf eine Nachkommastelle.' + sectorPic(al, { ri: ri / L, fill: OR, alpha: al + '°', rText: L + ' cm', label: 'gewischte Fläche als Ausschnitt eines Kreisrings' }),
        inputs: [{ kind: 'num', answer: A, tol: 0.5, label: 'a) A ≈', unit: 'cm²' }, { kind: 'num', answer: b, tol: 0.05, label: 'b) Weg ≈', unit: 'cm' }],
        hints: ['Die Fläche ist ein Ausschnitt aus einem Kreisring: außen r<sub>a</sub> = ' + L + ' cm, innen r<sub>i</sub> = ' + L + ' − ' + w + ' = ' + ri + ' cm.', 'Ganzer Ring: π · (' + L + '² − ' + ri + '²) = π · ' + (L * L - ri * ri) + ' ≈ ' + ex(PI * (L * L - ri * ri)) + ' cm². Davon der Anteil ' + al + ' : 360.', 'Weg der Spitze: Bogen mit r = ' + L + ' cm: ' + al + ' : 360 · 2 · π · ' + L + '.'],
        solution: 'a) r<sub>i</sub> = ' + L + ' cm − ' + w + ' cm = ' + ri + ' cm. A = ' + fracTxt(al) + ' · π · (' + L + '² − ' + ri + '²) cm² = ' + al + ' : 360 · π · ' + (L * L - ri * ri) + ' cm² ≈ ' + A + ' cm². b) b = ' + al + ' : 360 · 2 · π · ' + L + ' cm ≈ ' + f1(b) + ' cm.',
        mistakes: function (v) { var x = M.parseNum(v[0]); if (x === null) return null; if (near(x, Math.round(al / 360 * PI * L * L), 1)) return 'Der Arm wischt nur dort, wo das Wischblatt ist. Ziehe den inneren Ausschnitt mit r = ' + ri + ' cm ab.'; if (near(x, Math.round(al / 360 * PI * w * w), 1)) return 'Das wäre ein Ausschnitt mit Radius ' + w + ' cm um den Drehpunkt. Das Blatt sitzt aber außen am Arm. Rechne mit einem Kreisring.'; return null; },
        verify: function () { return (Math.abs(polyA(L, ri, al) - A) <= 0.5 + 1e-7 && Math.abs(polyB(L, al) - b) <= 0.05 + 1e-7) || 'Wischer falsch'; } };
    }
  };

  return {
    id: '026', title: 'Kreisring und Kreisausschnitt', bereich: 'Kreis und Zylinder', minutes: '45 bis 60',
    vorkenntnisse: 'Kreisumfang und Kreisfläche (Module 024 und 025), Brüche als Anteile',
    lead: 'Wie viel Rasen erreicht ein Rasensprenger, wie groß ist ein Tortenstück? Du berechnest Kreisringe, Kreisausschnitte und Bogenlängen und setzt Figuren aus Kreisteilen zusammen.',
    einstieg: { html: '<p>Herr Janssen stellt einen Rasensprenger in die Ecke seines Gartens. Der Sprenger dreht sich hin und her und spritzt dabei <b>120°</b> weit. Das Wasser fliegt 6 m weit.</p><p class="note">Welcher Teil eines ganzen Kreises wird bewässert? Wie viele Quadratmeter sind das?</p><p>Solche „Tortenstücke“ eines Kreises heißen <b>Kreisausschnitte</b>. Ringe wie bei einer CD oder einer Laufbahn heißen <b>Kreisringe</b>. In diesem Modul lernst du, ihre Flächen und Randlängen zu berechnen.</p>' },
    ziele: ['Ich berechne die Fläche eines Kreisrings mit A = π · (r<sub>a</sub>² − r<sub>i</sub>²).', 'Ich berechne die Fläche eines Kreisausschnitts mit dem Anteil α : 360°.', 'Ich berechne die Bogenlänge eines Kreisausschnitts.', 'Ich berechne Flächen von Figuren, die aus Rechtecken und Kreisteilen bestehen.', 'Ich löse Sachaufgaben, zum Beispiel mit Rasensprengern, Uhren und Laufbahnen.'],
    fachwoerter: [['Kreisring', 'Fläche zwischen zwei Kreisen mit demselben Mittelpunkt. r<sub>a</sub> ist der äußere, r<sub>i</sub> der innere Radius.'], ['Kreisausschnitt (Sektor)', 'Ein „Tortenstück“ zwischen zwei Radien.'], ['Mittelpunktswinkel α', 'Der Winkel, den die beiden Radien des Ausschnitts am Mittelpunkt bilden.'], ['Kreisbogen b', 'Das Stück der Kreislinie, das zum Ausschnitt gehört.']],
    diagnose: [
      { q: 'Welcher Anteil des Vollwinkels (360°) sind 90°?', options: [M.fhtml(M.F(1, 4)), M.fhtml(M.F(1, 3)), M.fhtml(M.F(1, 2)), 'Weiß ich noch nicht'], answer: 0, why: '90° : 360° = 1/4.', review: 'Winkel und Anteile' },
      { q: 'Ein Kreis hat den Radius 3 cm. Wie groß ist seine Fläche ungefähr?', options: ['18,8 cm²', '28,3 cm²', '9,4 cm²', 'Weiß ich noch nicht'], answer: 1, why: 'A = π · 3² cm² = π · 9 cm² ≈ 28,3 cm².', review: 'Kreisfläche (Modul 025)' },
      { q: 'Ein Kreis hat den Durchmesser 10 cm. Wie lang ist sein Umfang ungefähr?', options: ['31,4 cm', '78,5 cm', '62,8 cm', 'Weiß ich noch nicht'], answer: 0, why: 'u = π · 10 cm ≈ 31,4 cm.', review: 'Kreisumfang (Modul 024)' },
      { q: 'Was ergibt 7² − 4²?', options: ['9', '33', '3', 'Weiß ich noch nicht'], answer: 1, why: '49 − 16 = 33. Achtung: (7 − 4)² = 9 ist etwas anderes.', review: 'Quadratzahlen und Rechenreihenfolge' }],
    erklaerung:
      '<h3>1. Kreisring</h3><p>Ein Kreisring entsteht, wenn man aus einem großen Kreis einen kleineren Kreis mit demselben Mittelpunkt herausschneidet. Die Ringfläche ist deshalb <b>großer Kreis minus kleiner Kreis</b>.</p>' +
      sectorPic(360, { ri: 0.55, raText: 'r<tspan dy="3" font-size="10">a</tspan>', riText: 'r<tspan dy="3" font-size="10">i</tspan>', label: 'Kreisring', max: 220 }) +
      '<div class="merk"><b>Merke:</b> Kreisring<br><span class="big-math">A = π · r<sub>a</sub>² − π · r<sub>i</sub>² = π · (r<sub>a</sub>² − r<sub>i</sub>²)</span><br>Quadriere jeden Radius einzeln. (r<sub>a</sub> − r<sub>i</sub>)² ist falsch.</div>' +
      '<h3>2. Kreisausschnitt und Kreisbogen</h3><p>Ein Kreisausschnitt mit dem Mittelpunktswinkel α ist der Anteil <b>α : 360°</b> des ganzen Kreises. Ein Ausschnitt mit 90° ist also ein Viertelkreis, mit 120° ein Drittel. Dieser Anteil gilt für die Fläche und für den Bogen.</p>' +
      sectorPic(120, { rText: 'r', alpha: 'α', arc: true, bText: 'b', max: 240 }) +
      '<div class="merk"><b>Merke:</b> Kreisausschnitt mit Winkel α<br><span class="big-math">A = <span class="frac"><span>α</span><span>360°</span></span> · π · r²</span> &nbsp; und &nbsp; <span class="big-math">b = <span class="frac"><span>α</span><span>360°</span></span> · 2 · π · r</span></div>' +
      '<p>Beispiel: r = 6 m, α = 120°. Anteil 120 : 360 = 1/3. A = 1/3 · π · 36 m² ≈ 37,7 m². b = 1/3 · 2 · π · 6 m ≈ 12,6 m.</p>' +
      '<h3>3. Zusammengesetzte Figuren</h3><p>Zerlege die Figur in Rechtecke, Halbkreise und Viertelkreise. Addiere oder subtrahiere die Teilflächen. Zwei gleiche Halbkreise ergeben zusammen einen ganzen Kreis.</p>' +
      '<p class="note"><b>Überschlag:</b> Rechne mit π ≈ 3 im Kopf nach. Bei r = 6 m und α = 120° ist A ≈ 1/3 · 3 · 36 = 36 m². Das passt zu 37,7 m².</p>',
    entdecken: {
      html: '<p>Verändere den Winkel α, den äußeren Radius und den inneren Radius. Bei r<sub>i</sub> = 0 entsteht ein Kreisausschnitt, bei α = 360° ein Kreisring.</p><div class="ctl"><label>α = <b id="v_a"></b> <input type="range" id="r_a" min="15" max="360" step="15" value="90"></label><label>r<sub>a</sub> = <b id="v_r"></b> <input type="range" id="r_r" min="2" max="6" step="0.5" value="4"></label><label>r<sub>i</sub> = <b id="v_i"></b> <input type="range" id="r_i" min="0" max="5" step="0.5" value="0"></label></div>' +
        '<div id="e_g"></div><div id="e_t"></div><p class="note">Stelle α = 180° ein. Welcher Anteil des Kreises ist das? Was passiert mit Fläche und Bogen, wenn du α verdoppelst?</p>',
      init: function (root, done) {
        var n = 0, Ra = root.querySelector('#r_a'), Rr = root.querySelector('#r_r'), Ri = root.querySelector('#r_i');
        function draw() {
          var al = +Ra.value, r = +Rr.value, ri = Math.min(+Ri.value, r - 0.5), g = M.gcd(al, 360);
          root.querySelector('#v_a').textContent = al + '°'; root.querySelector('#v_r').textContent = f(r) + ' cm'; root.querySelector('#v_i').textContent = f(ri) + ' cm' + (+Ri.value > ri ? ' (innen muss kleiner sein als außen)' : '');
          root.querySelector('#e_g').innerHTML = sectorPic(al, { R: 15 * r, ri: ri / r, alpha: al < 360 ? al + '°' : '', arc: ri === 0 && al < 360, fill: ri > 0 ? OR : FL, label: 'Kreisausschnitt' });
          var A = al / 360 * PI * (r * r - ri * ri), b = al / 360 * 2 * PI * r;
          root.querySelector('#e_t').innerHTML = '<p>Anteil: ' + al + '° : 360° = ' + M.fhtml(M.F(al / g, 360 / g)) + ' = ' + f(Math.round(al / 360 * 1000) / 10) + ' %</p><p class="big-math">A = ' + M.fhtml(M.F(al / g, 360 / g)) + ' · π · (' + f(r) + '² − ' + f(ri) + '²) ≈ ' + f(r2(A)) + ' cm²</p><p class="big-math">äußerer Bogen b = ' + M.fhtml(M.F(al / g, 360 / g)) + ' · 2 · π · ' + f(r) + ' ≈ ' + f(r2(b)) + ' cm</p>';
        }
        function hit() { draw(); n++; if (n >= 3) done('Richtig erkannt: Fläche und Bogen wachsen im selben Verhältnis wie der Winkel. Doppelter Winkel bedeutet doppelte Fläche und doppelter Bogen. Der Anteil ist immer α : 360°.'); }
        Ra.addEventListener('input', hit); Rr.addEventListener('input', hit); Ri.addEventListener('input', hit);
        draw();
      }
    },
    beispiel: { title: 'Der Rasensprenger', q: 'Der Rasensprenger von Herrn Janssen überstreicht 120° und spritzt 6 m weit. Wie groß ist die bewässerte Fläche? Wie lang ist der äußere Rand der nassen Fläche?' + sectorPic(120, { rText: '6 m', alpha: '120°', arc: true, bText: 'b', fill: '#dff3ea', max: 240 }),
      steps: ['Figur erkennen: Die bewässerte Fläche ist ein Kreisausschnitt mit r = 6 m und α = 120°.', 'Anteil bestimmen: 120° : 360° = 1/3.', 'Fläche: A = 1/3 · π · (6 m)² = 1/3 · π · 36 m² = 12 · π m² ≈ 37,7 m².', 'Rand: b = 1/3 · 2 · π · 6 m = 4 · π m ≈ 12,6 m.', 'Kontrolle mit Überschlag (π ≈ 3): A ≈ 12 · 3 = 36 m² und b ≈ 4 · 3 = 12 m. Das passt.'] },
    tasks: { gen: gen, plan: { G: ['ring:1', 'sektorA:1', 'bogen:1', 'figur:1'], S: ['ring:1', 'sektorA:2', 'bogen:2', 'sprenger:2', 'figur:2'], E: ['ringD:2', 'sektorA:2', 'torte:2', 'uhr:2', 'laufbahn:3', 'winkel:3'] },
      extra: 'wischer', test: ['ring:2', 'ringD:2', 'sektorA:2', 'bogen:2', 'sprenger:2', 'figur:2'] },
    lerncheck: ['Ich berechne die Fläche eines Kreisrings.', 'Ich berechne Fläche und Bogenlänge eines Kreisausschnitts.', 'Ich zerlege Figuren in Rechtecke und Kreisteile und berechne ihre Fläche.', 'Ich löse Sachaufgaben mit Kreisausschnitten und Kreisringen.']
  };
})();
