/* Modul 016 · Winkelsumme im Dreieck und Viereck */
var MODULE = (function () {
  var D2R = Math.PI / 180;
  function deg(x) { return M.fmtNum(x) + '°'; }
  /* Polygon maßstabsgetreu aus Eckpunkten zeichnen, mit Winkelbeschriftungen */
  function drawPoly(P, labels, names, opts) {
    opts = opts || {}; var W = 340, H = 230, pad = 30;
    var xs = P.map(function (p) { return p[0]; }), ys = P.map(function (p) { return p[1]; });
    var minx = Math.min.apply(null, xs), maxx = Math.max.apply(null, xs), miny = Math.min.apply(null, ys), maxy = Math.max.apply(null, ys);
    var s = Math.min((W - 2 * pad) / (maxx - minx || 1), (H - 2 * pad) / (maxy - miny || 1));
    var Q = P.map(function (p) { return [pad + (p[0] - minx) * s + ((W - 2 * pad) - (maxx - minx) * s) / 2, H - pad - (p[1] - miny) * s - ((H - 2 * pad) - (maxy - miny) * s) / 2]; });
    var g = '<svg class="viz" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + (opts.label || 'Figur mit Winkeln') + '" style="max-width:400px"><polygon points="' + Q.map(function (q) { return q.join(','); }).join(' ') + '" fill="#efeafb" stroke="#3d2a73" stroke-width="2.5" stroke-linejoin="round"/>';
    var placed = [];
    var n = Q.length, cx = Q.reduce(function (a, q) { return a + q[0]; }, 0) / n, cy = Q.reduce(function (a, q) { return a + q[1]; }, 0) / n;
    Q.forEach(function (q, i) {
      var pv = Q[(i - 1 + n) % n], nx = Q[(i + 1) % n];
      var a1 = Math.atan2(pv[1] - q[1], pv[0] - q[0]), a2 = Math.atan2(nx[1] - q[1], nx[0] - q[0]);
      var bis = Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2)), r = 22;
      var sweep = ((a2 - a1 + 2 * Math.PI) % (2 * Math.PI)) > Math.PI ? 0 : 1;
      g += '<path d="M' + (q[0] + r * Math.cos(a1)) + ' ' + (q[1] + r * Math.sin(a1)) + ' A' + r + ' ' + r + ' 0 0 ' + sweep + ' ' + (q[0] + r * Math.cos(a2)) + ' ' + (q[1] + r * Math.sin(a2)) + '" fill="none" stroke="#d97706" stroke-width="2"/>';
      var half = Math.acos(Math.max(-1, Math.min(1, Math.cos(a1) * Math.cos(a2) + Math.sin(a1) * Math.sin(a2)))) / 2, dist = Math.max(46, Math.min(78, 30 / Math.max(Math.sin(half), 0.2) + 8));
      var tx = q[0] + dist * Math.cos(bis), ty = q[1] + dist * Math.sin(bis);
      for (var it = 0; it < 2 && placed.some(function (p) { return Math.abs(p[0] - tx) < 62 && Math.abs(p[1] - ty) < 18; }); it++) { tx += 12 * Math.cos(bis); ty += 12 * Math.sin(bis); }
      placed.push([tx, ty]);
      if (labels[i]) g += '<text x="' + tx + '" y="' + (ty + 5) + '" font-size="14" font-weight="700" text-anchor="middle" fill="' + (labels[i].indexOf('?') >= 0 ? '#b91c1c' : '#1c1830') + '">' + labels[i] + '</text>';
      var ox = q[0] - cx, oy = q[1] - cy, ol = Math.hypot(ox, oy) || 1;
      if (names) g += '<text x="' + (q[0] + 14 * ox / ol) + '" y="' + (q[1] + 14 * oy / ol + 5) + '" font-size="13" text-anchor="middle" fill="#5a5670">' + names[i] + '</text>';
    });
    if (opts.note) g += '<text x="' + (W - 6) + '" y="' + (H - 6) + '" font-size="10" text-anchor="end" fill="#5a5670">' + opts.note + '</text>';
    return g + '</svg>';
  }
  function triangle(al, be) { var ga = 180 - al - be, c = 10, b = c * Math.sin(be * D2R) / Math.sin(ga * D2R); return [[0, 0], [c, 0], [b * Math.cos(al * D2R), b * Math.sin(al * D2R)]]; }
  function quad(an) { /* an = [α, β, γ, δ] Innenwinkel an A, B, C, D (gegen den Uhrzeigersinn) */
    for (var t = 0; t < 600; t++) {
      var a = 8 + Math.random() * 4, b = 6 + Math.random() * 4;
      var dir = [0, 180 - an[1], 360 - an[1] - an[2], 540 - an[1] - an[2] - an[3]].map(function (d) { return d * D2R; });
      var u = dir.map(function (d) { return [Math.cos(d), Math.sin(d)]; });
      var rx = -(a * u[0][0] + b * u[1][0]), ry = -(a * u[0][1] + b * u[1][1]);
      var det = u[2][0] * u[3][1] - u[3][0] * u[2][1]; if (Math.abs(det) < 1e-6) continue;
      var c = (rx * u[3][1] - u[3][0] * ry) / det, d = (u[2][0] * ry - rx * u[2][1]) / det;
      if (c > 5.5 && d > 5.5 && c < 15 && d < 15) { var A = [0, 0], B = [a, 0], C = [B[0] + b * u[1][0], B[1] + b * u[1][1]], Dd = [C[0] + c * u[2][0], C[1] + c * u[2][1]];
        var px = [A, B, C, Dd], wx = Math.max.apply(null, px.map(function (p) { return p[0]; })) - Math.min.apply(null, px.map(function (p) { return p[0]; })), hy = Math.max.apply(null, px.map(function (p) { return p[1]; })) - Math.min.apply(null, px.map(function (p) { return p[1]; }));
        if (wx / hy < 1.15 || wx / hy > 2.4) continue;
        return px; }
    }
    return null;
  }
  function kite(al, ga) { var h = 4, p = h / Math.tan(al * D2R / 2), L = p + h / Math.tan(ga * D2R / 2); return [[0, 0], [p, -h], [L, 0], [p, h]]; }
  function triAngles(minA) { var al, be, ga; do { al = M.rnd(minA || 25, 110); be = M.rnd(25, 110); ga = 180 - al - be; } while (ga < 20); return [al, be, ga]; }
  var gen = {
    dreieck: function () {
      var w = triAngles(), miss = M.rnd(0, 2), names = ['α', 'β', 'γ'];
      var lab = w.map(function (x, i) { return i === miss ? names[i] + ' = ?' : names[i] + ' = ' + x + '°'; });
      var given = w.filter(function (x, i) { return i !== miss; });
      return { skill: 'Winkelsumme im Dreieck', level: 1, q: 'Berechne den fehlenden Winkel ' + names[miss] + '.' + drawPoly(triangle(w[0], w[1]), lab, ['A', 'B', 'C']), inputs: [{ kind: 'num', answer: w[miss], label: names[miss] + ' =', unit: '°' }],
        hints: ['Im Dreieck sind alle drei Innenwinkel zusammen 180° groß.', 'Addiere die beiden bekannten Winkel: ' + given[0] + '° + ' + given[1] + '° = ' + (given[0] + given[1]) + '°.', 'Ziehe das Ergebnis von 180° ab.'],
        solution: names[miss] + ' = 180° − ' + given[0] + '° − ' + given[1] + '° = ' + w[miss] + '°' };
    },
    rechtwinklig: function () {
      var a = M.rnd(15, 75);
      return { skill: 'Rechtwinkliges Dreieck', level: 1, q: 'Das Dreieck ist rechtwinklig mit γ = 90°. Es ist α = ' + a + '°. Wie groß ist β?' + drawPoly(triangle(a, 90 - a), ['α = ' + a + '°', 'β = ?', 'γ = 90°'], ['A', 'B', 'C']), inputs: [{ kind: 'num', answer: 90 - a, label: 'β =', unit: '°' }],
        hints: ['Die Winkelsumme ist 180°. Der rechte Winkel hat schon 90°.', 'Für α und β bleiben zusammen 90° übrig.', 'β = 90° − ' + a + '°.'],
        solution: 'β = 180° − 90° − ' + a + '° = ' + (90 - a) + '°' };
    },
    gleichschenklig: function () {
      var spitze = Math.random() < 0.5, top = 2 * M.rnd(10, 60), base = (180 - top) / 2;
      if (spitze) return { skill: 'Gleichschenkliges Dreieck', q: 'Das Dreieck ist gleichschenklig. Der Winkel an der Spitze ist γ = ' + top + '°. Wie groß ist jeder der beiden Basiswinkel?' + drawPoly(triangle(base, base), ['α = ?', 'β = ?', 'γ = ' + top + '°'], ['A', 'B', 'C']), inputs: [{ kind: 'num', answer: base, label: 'α = β =', unit: '°' }],
        hints: ['Im gleichschenkligen Dreieck sind die beiden Basiswinkel gleich groß.', 'Für beide Basiswinkel zusammen bleiben 180° − ' + top + '° = ' + (180 - top) + '°.', 'Teile durch 2.'],
        solution: 'α = β = (180° − ' + top + '°) : 2 = ' + base + '°' };
      return { skill: 'Gleichschenkliges Dreieck', q: 'Das Dreieck ist gleichschenklig. Jeder Basiswinkel ist ' + base + '° groß. Wie groß ist der Winkel γ an der Spitze?' + drawPoly(triangle(base, base), ['α = ' + base + '°', 'β = ' + base + '°', 'γ = ?'], ['A', 'B', 'C']), inputs: [{ kind: 'num', answer: top, label: 'γ =', unit: '°' }],
        hints: ['Beide Basiswinkel sind gleich groß: zusammen ' + 2 * base + '°.', 'Die Winkelsumme im Dreieck ist 180°.', 'γ = 180° − ' + 2 * base + '°.'],
        solution: 'γ = 180° − 2 · ' + base + '° = ' + top + '°' };
    },
    viereck: function () {
      var an, P;
      for (var t = 0; t < 50 && !P; t++) { var a = M.rnd(55, 130), b = M.rnd(55, 130), c = M.rnd(55, 130), d = 360 - a - b - c; if (d < 50 || d > 150) continue; an = [a, b, c, d]; P = quad(an); }
      if (!P) { an = [90, 80, 100, 90]; P = quad(an); }
      var miss = M.rnd(0, 3), names = ['α', 'β', 'γ', 'δ'];
      var given = an.filter(function (x, i) { return i !== miss; });
      return { skill: 'Winkelsumme im Viereck', q: 'Berechne den fehlenden Winkel ' + names[miss] + ' im Viereck.' + drawPoly(P, an.map(function (x, i) { return i === miss ? names[i] + ' = ?' : names[i] + ' = ' + x + '°'; }), ['A', 'B', 'C', 'D']), inputs: [{ kind: 'num', answer: an[miss], label: names[miss] + ' =', unit: '°' }],
        hints: ['Ein Viereck lässt sich mit einer Diagonalen in zwei Dreiecke zerlegen. Die Winkelsumme ist deshalb 2 · 180° = 360°.', 'Addiere die drei bekannten Winkel: ' + given.join('° + ') + '° = ' + (given[0] + given[1] + given[2]) + '°.', 'Ziehe die Summe von 360° ab.'],
        solution: names[miss] + ' = 360° − ' + given.join('° − ') + '° = ' + an[miss] + '°' };
    },
    aussen: function () {
      var w = triAngles();
      return { skill: 'Außenwinkel', level: 3, q: 'Im Dreieck ist α = ' + w[0] + '° und β = ' + w[1] + '°. Wie groß ist der <b>Außenwinkel</b> bei C? (Er ergänzt γ zu 180°.)', inputs: [{ kind: 'num', answer: 180 - w[2], label: 'Außenwinkel =', unit: '°' }],
        hints: ['Berechne zuerst γ = 180° − ' + w[0] + '° − ' + w[1] + '°.', 'γ = ' + w[2] + '°. Der Außenwinkel bildet mit γ zusammen einen gestreckten Winkel (180°).', 'Außenwinkel = 180° − ' + w[2] + '°. Fällt dir etwas auf, wenn du α + β rechnest?'],
        solution: 'γ = ' + w[2] + '°, Außenwinkel = 180° − ' + w[2] + '° = ' + (180 - w[2]) + '°. Das ist genau α + β = ' + (w[0] + w[1]) + '°.' };
    },
    moeglich: function () {
      var ok = triAngles(), bad = [];
      while (bad.length < 3) { var a = M.rnd(20, 110), b = M.rnd(20, 100), c = M.rnd(20, 100); if (a + b + c !== 180 && !bad.some(function (x) { return x[0] === a && x[1] === b; })) bad.push([a, b, c]); }
      var opts = M.shuffle([ok].concat(bad));
      return { skill: 'Winkel im Dreieck prüfen', level: 1, q: 'Welche drei Winkel können zu <b>einem</b> Dreieck gehören?', inputs: [{ kind: 'mc', label: 'Wähle aus', options: opts.map(function (w) { return w[0] + '°, ' + w[1] + '° und ' + w[2] + '°'; }), answer: opts.indexOf(ok) }],
        hints: ['Addiere jeweils die drei Winkel.', 'Nur bei einem Dreieck ergibt die Summe genau 180°.', 'Prüfe alle vier Möglichkeiten nacheinander.'],
        solution: ok[0] + '° + ' + ok[1] + '° + ' + ok[2] + '° = 180°.' };
    },
    art: function () {
      var t = M.pick(['spitz', 'recht', 'stumpf']), w;
      if (t === 'recht') { var a = M.rnd(20, 70); w = M.shuffle([90, a, 90 - a]); }
      else if (t === 'stumpf') { var s = M.rnd(95, 140), r = 180 - s, x = M.rnd(10, r - 10); w = M.shuffle([s, x, r - x]); }
      else { do { w = triAngles(30); } while (Math.max.apply(null, w) >= 90); }
      var opts = ['spitzwinklig', 'rechtwinklig', 'stumpfwinklig'];
      return { skill: 'Dreiecksarten nach Winkeln', level: 2, q: 'Ein Dreieck hat die Winkel ' + w.join('°, ') + '°. Wie nennt man dieses Dreieck?', inputs: [{ kind: 'mc', label: 'Dreiecksart', options: opts, answer: ['spitz', 'recht', 'stumpf'].indexOf(t) }],
        hints: ['Entscheidend ist der größte Winkel.', 'Ist er kleiner als 90°, gleich 90° oder größer als 90°?', 'kleiner als 90°: spitzwinklig, genau 90°: rechtwinklig, größer als 90°: stumpfwinklig.'],
        solution: 'Der größte Winkel ist ' + Math.max.apply(null, w) + '°. Das Dreieck ist ' + opts[['spitz', 'recht', 'stumpf'].indexOf(t)] + '.' };
    },
    gleichung: function () {
      var k; do { k = [M.rnd(1, 4), M.rnd(1, 4), M.rnd(1, 5)]; } while (180 % (k[0] + k[1] + k[2]) !== 0 || k[0] === k[1] && k[1] === k[2]);
      var x = 180 / (k[0] + k[1] + k[2]);
      var f = function (c) { return c === 1 ? 'x' : c + 'x'; };
      return { skill: 'Winkel mit Gleichung', level: 3, q: 'In einem Dreieck ist α = ' + f(k[0]) + ', β = ' + f(k[1]) + ' und γ = ' + f(k[2]) + '. Wie groß ist x? Wie groß ist der größte Winkel?', inputs: [{ kind: 'num', label: 'x =', unit: '°', answer: x }, { kind: 'num', label: 'größter Winkel =', unit: '°', answer: x * Math.max(k[0], k[1], k[2]) }],
        hints: ['Stelle eine Gleichung auf: ' + f(k[0]) + ' + ' + f(k[1]) + ' + ' + f(k[2]) + ' = 180°.', 'Fasse zusammen: ' + (k[0] + k[1] + k[2]) + 'x = 180°.', 'x = 180° : ' + (k[0] + k[1] + k[2]) + '. Rechne dann den größten Winkel aus.'],
        solution: (k[0] + k[1] + k[2]) + 'x = 180° ⇒ x = ' + x + '°. Größter Winkel: ' + Math.max(k[0], k[1], k[2]) + ' · ' + x + '° = ' + x * Math.max(k[0], k[1], k[2]) + '°.' };
    },
    drachen: function () {
      var a, b, rest; do { a = M.rnd(50, 110); b = M.rnd(40, 120); rest = 360 - a - b; } while (rest % 2 || rest / 2 < 60 || rest / 2 > 135);
      var x = rest / 2, P = kite(a, b);
      return { skill: 'Winkel im Drachenviereck', level: 3, q: 'In einem Drachenviereck sind die Winkel β und δ gleich groß. Es ist α = ' + a + '° und γ = ' + b + '°. Wie groß ist β?' + (P ? drawPoly(P, ['α = ' + a + '°', 'β = ?', 'γ = ' + b + '°', 'δ = β'], ['A', 'B', 'C', 'D']) : ''), inputs: [{ kind: 'num', answer: x, label: 'β =', unit: '°' }],
        hints: ['Die Winkelsumme im Viereck ist 360°.', 'Für β und δ zusammen bleiben 360° − ' + a + '° − ' + b + '° = ' + rest + '°.', 'β und δ sind gleich groß. Teile durch 2.'],
        solution: 'β = (360° − ' + a + '° − ' + b + '°) : 2 = ' + x + '°' };
    }
  };

  return {
    id: '016', title: 'Winkelsumme im Dreieck und Viereck', bereich: 'Raum und Form', minutes: '45 bis 60',
    vorkenntnisse: 'Winkel messen, Nebenwinkel, Dreiecke benennen',
    lead: 'Warum ergeben die drei Winkel eines Dreiecks immer 180°? Du begründest den Winkelsummensatz und berechnest fehlende Winkel.',
    einstieg: { html: '<p>Schneide ein beliebiges Dreieck aus Papier aus. Markiere die drei Ecken mit Farbe. Reiße dann die drei Ecken ab und lege sie mit den Spitzen aneinander.</p><p class="note">Was passiert? Probiere es mit einem zweiten, ganz anders geformten Dreieck. Passiert dasselbe?</p><p>Die drei Ecken bilden zusammen immer eine gerade Linie, also einen <b>gestreckten Winkel von 180°</b>. In diesem Modul erfährst du, warum das so ist, und wie du damit fehlende Winkel berechnest.</p>' },
    ziele: ['Ich kenne den Winkelsummensatz für Dreiecke und kann ihn begründen.', 'Ich berechne fehlende Winkel in Dreiecken, auch in rechtwinkligen und gleichschenkligen.', 'Ich weiß, warum die Winkelsumme im Viereck 360° beträgt.', 'Ich bestimme Dreiecksarten nach ihren Winkeln.', 'Ich löse Winkelaufgaben mit einer Gleichung.'],
    fachwoerter: [['Innenwinkel', 'Die Winkel innerhalb einer Figur an ihren Ecken. Im Dreieck heißen sie meist α, β und γ.'], ['Gestreckter Winkel', 'Ein Winkel von genau 180°. Seine Schenkel bilden eine Gerade.'], ['Wechselwinkel', 'Winkel an zwei parallelen Geraden, die sich „über Kreuz“ gegenüberliegen. Sie sind gleich groß.'], ['Basiswinkel', 'Die beiden gleich großen Winkel an der Grundseite eines gleichschenkligen Dreiecks.']],
    diagnose: [
      { q: 'Zwei Nebenwinkel ergeben zusammen …', options: ['180°', '90°', '360°', 'Weiß ich noch nicht'], answer: 0, why: 'Nebenwinkel bilden zusammen einen gestreckten Winkel: 180°.', review: 'Nebenwinkel und Scheitelwinkel (Klasse 7)' },
      { q: 'Wie heißt ein Winkel, der größer als 90° und kleiner als 180° ist?', options: ['stumpfer Winkel', 'spitzer Winkel', 'rechter Winkel', 'Weiß ich noch nicht'], answer: 0, why: 'Zwischen 90° und 180° ist ein Winkel stumpf.', review: 'Winkelarten' },
      { q: 'Ein Vollwinkel ist …', options: ['360°', '180°', '270°', 'Weiß ich noch nicht'], answer: 0, why: 'Eine volle Drehung hat 360°.', review: 'Winkel und Drehungen' },
      { q: 'Wie viele gleich lange Seiten hat ein gleichschenkliges Dreieck mindestens?', options: ['2', '3', '1', 'Weiß ich noch nicht'], answer: 0, why: 'Die beiden Schenkel sind gleich lang.', review: 'Dreiecksarten nach Seiten' }],
    erklaerung:
      '<h3>1. Der Winkelsummensatz</h3><div class="merk"><b>Merke:</b> In jedem Dreieck sind die drei Innenwinkel zusammen <b>180°</b> groß.<br><span class="big-math">α + β + γ = 180°</span></div>' +
      '<h3>2. Warum ist das so?</h3><p>Zeichne durch die Spitze C eine Parallele zur Seite AB. An dieser Parallele findest du α und β wieder, denn es sind <b>Wechselwinkel</b>. Zusammen mit γ liegen α, β und γ nebeneinander auf der Geraden. Sie bilden einen gestreckten Winkel, also 180°.</p>' +
      '<svg class="viz" viewBox="0 0 340 190" role="img" aria-label="Begründung mit Parallele" style="max-width:400px"><line x1="10" y1="40" x2="330" y2="40" stroke="#5b3fa0" stroke-width="2" stroke-dasharray="6 4"/><polygon points="40,170 300,170 190,40" fill="#efeafb" stroke="#3d2a73" stroke-width="2.5"/>' +
      '<text x="70" y="162" font-size="14" font-weight="700">α</text><text x="262" y="162" font-size="14" font-weight="700">β</text><text x="186" y="66" font-size="14" font-weight="700">γ</text><text x="146" y="58" font-size="14" font-weight="700" fill="#b45309">α</text><text x="222" y="58" font-size="14" font-weight="700" fill="#b45309">β</text>' +
      '<text x="36" y="186" font-size="12" fill="#5a5670">A</text><text x="298" y="186" font-size="12" fill="#5a5670">B</text><text x="186" y="32" font-size="12" fill="#5a5670">C</text><text x="330" y="32" font-size="11" text-anchor="end" fill="#5b3fa0">Parallele zu AB</text></svg>' +
      '<h3>3. Winkelsumme im Viereck</h3><p>Eine Diagonale zerlegt jedes Viereck in <b>zwei Dreiecke</b>. Deshalb gilt: <span class="big-math">α + β + γ + δ = 2 · 180° = 360°</span></p>' +
      '<h3>4. Besondere Dreiecke</h3><ul><li><b>Rechtwinklig:</b> Ein Winkel ist 90°. Die beiden anderen ergeben zusammen 90°.</li><li><b>Gleichschenklig:</b> Die beiden Basiswinkel sind gleich groß.</li><li><b>Gleichseitig:</b> Alle drei Winkel sind 60°.</li></ul>' +
      '<p class="note">Nach dem größten Winkel heißt ein Dreieck <b>spitzwinklig</b> (alle unter 90°), <b>rechtwinklig</b> (genau 90°) oder <b>stumpfwinklig</b> (einer über 90°).</p>',
    entdecken: {
      html: '<p>Verändere die Winkel α und β. Das Dreieck passt sich an. Beobachte γ und die Summe.</p><div class="ctl"><label>α = <b id="v_a"></b> <input type="range" id="r_a" min="15" max="140" step="5" value="60"></label><label>β = <b id="v_b"></b> <input type="range" id="r_b" min="15" max="140" step="5" value="50"></label></div><div id="e_g"></div><p class="big-math" id="e_s"></p><p class="note">Kannst du ein Dreieck mit zwei stumpfen Winkeln erzeugen? Warum nicht?</p>',
      init: function (root, done) {
        var n = 0;
        function draw() {
          var a = +root.querySelector('#r_a').value, b = +root.querySelector('#r_b').value;
          root.querySelector('#v_a').textContent = a + '°'; root.querySelector('#v_b').textContent = b + '°';
          if (a + b >= 175) { root.querySelector('#e_g').innerHTML = '<p class="fb bad">α + β = ' + (a + b) + '°. Für γ bleibt nichts übrig. So ein Dreieck gibt es nicht!</p>'; root.querySelector('#e_s').textContent = ''; return; }
          var g = 180 - a - b;
          root.querySelector('#e_g').innerHTML = drawPoly(triangle(a, b), ['α = ' + a + '°', 'β = ' + b + '°', 'γ = ' + g + '°'], ['A', 'B', 'C']);
          root.querySelector('#e_s').textContent = a + '° + ' + b + '° + ' + g + '° = ' + (a + b + g) + '°';
        }
        root.querySelectorAll('input[type=range]').forEach(function (r) { r.addEventListener('input', function () { draw(); n++; if (n >= 3) done('Richtig beobachtet: Egal wie du das Dreieck veränderst, die Summe bleibt immer 180°.'); }); });
        draw();
      }
    },
    beispiel: { title: 'Winkel im gleichschenkligen Dreieck', q: 'In einem gleichschenkligen Dreieck ist der Winkel an der Spitze 40° groß. Wie groß sind die Basiswinkel?',
      steps: ['Winkelsumme: alle drei Winkel zusammen sind 180°.', 'Für die beiden Basiswinkel bleibt: 180° − 40° = 140°.', 'Die Basiswinkel sind gleich groß: 140° : 2 = 70°.', 'Antwort: Beide Basiswinkel sind 70° groß. Kontrolle: 70° + 70° + 40° = 180°.' + drawPoly(triangle(70, 70), ['70°', '70°', '40°'], ['A', 'B', 'C'])] },
    tasks: { gen: gen, plan: { G: ['moeglich:1', 'dreieck:1', 'rechtwinklig:1', 'viereck:2'], S: ['dreieck:1', 'rechtwinklig:1', 'gleichschenklig:2', 'viereck:2', 'art:2'], E: ['gleichschenklig:2', 'viereck:2', 'art:2', 'aussen:3', 'gleichung:3', 'dreieck:1'] },
      extra: 'drachen', test: ['dreieck:1', 'rechtwinklig:1', 'gleichschenklig:2', 'viereck:2', 'art:2', 'gleichung:3'] },
    lerncheck: ['Ich kann begründen, warum die Winkelsumme im Dreieck 180° ist.', 'Ich berechne fehlende Winkel im Dreieck.', 'Ich berechne fehlende Winkel im Viereck.', 'Ich erkenne Dreiecksarten an ihren Winkeln.']
  };
})();
