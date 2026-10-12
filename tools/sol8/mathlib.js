/* SOL Mathe 8 · Rechenhilfen (Brüche, Terme, Zufall). Läuft im Browser und in Node. */
var M = (function () {
  'use strict';
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function lcm(a, b) { return Math.abs(a * b) / gcd(a, b); }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function shuffle(arr) { var a = arr.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function nz(a, b) { var v; do { v = rnd(a, b); } while (v === 0); return v; }

  /* Bruch {n,d} immer mit d>0 */
  function F(n, d) { if (d === undefined) d = 1; if (d === 0) throw new Error('Nenner 0'); if (d < 0) { n = -n; d = -d; } return { n: n, d: d }; }
  function red(f) { var g = gcd(f.n, f.d); return F(f.n / g, f.d / g); }
  function fmul(a, b) { return red(F(a.n * b.n, a.d * b.d)); }
  function fdiv(a, b) { return red(F(a.n * b.d, a.d * b.n)); }
  function fadd(a, b) { return red(F(a.n * b.d + b.n * a.d, a.d * b.d)); }
  function feq(a, b) { return a.n * b.d === b.n * a.d; }
  function isReduced(f) { return gcd(f.n, f.d) === 1; }
  function fstr(f) { f = red(f); return f.d === 1 ? String(f.n) : f.n + '/' + f.d; }
  function fhtml(f, keep) {
    if (!keep) f = red(f);
    if (f.d === 1) return '<span class="num">' + fmtNum(f.n) + '</span>';
    var s = f.n < 0 ? '−' : '';
    return s + '<span class="frac"><span>' + Math.abs(f.n) + '</span><span>' + f.d + '</span></span>';
  }
  function fmtNum(x, dec) {
    if (dec === undefined) { var r = Math.round(x * 1e6) / 1e6; dec = (String(r).split('.')[1] || '').length; }
    var s = Math.abs(x).toFixed(dec).replace('.', ',');
    var parts = s.split(','); parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x < 0 ? '−' : '') + parts.join(',');
  }

  function clean(s) {
    return String(s == null ? '' : s).trim()
      .replace(/[−–—]/g, '-').replace(/[·×⋅]/g, '*').replace(/:/g, '/').replace(/÷/g, '/')
      .replace(/\s+/g, ' ');
  }
  /* Zahl aus Eingabe: "1,5" "1.5" "-3" "1 000" ; null wenn keine Zahl */
  function parseNum(s) {
    s = clean(s).replace(/\s(?=\d{3}\b)/g, '').replace(/(mm²|cm²|dm²|m²|cm³|dm³|m³|mm|cm|dm|km|m|€|%|°|grad)$/i, '').trim();
    if (!/^[+-]?(\d+([.,]\d+)?|[.,]\d+)$/.test(s)) return null;
    return parseFloat(s.replace(',', '.'));
  }
  /* Bruch aus Eingabe: "3/4", "-3/4", "1 1/2", "0,75", "2" ; null wenn ungültig */
  function parseFrac(s) {
    s = clean(s);
    var m;
    if ((m = s.match(/^([+-])?\s*(\d+)\s+(\d+)\s*\/\s*(\d+)$/))) { var d = +m[4]; if (!d) return null; var f = F(+m[2] * d + +m[3], d); if (m[1] === '-') f.n = -f.n; f.mixed = true; return f; }
    if ((m = s.match(/^([+-])?\s*\(?\s*(\d+)\s*\/\s*(\d+)\s*\)?$/))) { if (!+m[3]) return null; var g = F(+m[2], +m[3]); if (m[1] === '-') g.n = -g.n; return g; }
    var x = parseNum(s); if (x === null) return null;
    var den = 1; while (Math.abs(x * den - Math.round(x * den)) > 1e-9 && den < 1e6) den *= 10;
    var r = red(F(Math.round(x * den), den)); r.decimal = true; return r;
  }

  /* ---------- Terme: Parser und Auswertung ---------- */
  function tokenize(s) {
    s = clean(s).toLowerCase().replace(/²/g, '^2').replace(/³/g, '^3').replace(/,/g, '.');
    var out = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === ' ') { i++; continue; }
      if (/[0-9.]/.test(c)) { var j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; var num = s.slice(i, j); if (!/^\d*\.?\d+$|^\d+\.$/.test(num)) throw new Error('Zahl'); out.push({ t: 'n', v: parseFloat(num) }); i = j; continue; }
      if (/[a-z]/.test(c)) { out.push({ t: 'v', v: c }); i++; continue; }
      if ('+-*/^()'.indexOf(c) >= 0) { out.push({ t: c }); i++; continue; }
      throw new Error('Zeichen ' + c);
    }
    /* implizite Multiplikation: 3x, 2(, )(, x(, )x, xy */
    var res = [];
    for (var k = 0; k < out.length; k++) {
      var a = out[k - 1], b = out[k];
      if (a && (a.t === 'n' || a.t === 'v' || a.t === ')') && (b.t === 'n' || b.t === 'v' || b.t === '(') && !(a.t === 'n' && b.t === 'n')) res.push({ t: '*' });
      res.push(b);
    }
    return res;
  }
  function parseTerm(s) {
    var tk = tokenize(s), p = 0;
    if (!tk.length) throw new Error('leer');
    function peek() { return tk[p]; }
    function eat(t) { if (!tk[p] || tk[p].t !== t) throw new Error('erwartet ' + t); p++; }
    function expr() { var n = term(); while (peek() && (peek().t === '+' || peek().t === '-')) { var op = tk[p++].t; n = { op: op, a: n, b: term() }; } return n; }
    function term() { var n = unary(); while (peek() && (peek().t === '*' || peek().t === '/')) { var op = tk[p++].t; n = { op: op, a: n, b: unary() }; } return n; }
    function unary() { if (peek() && (peek().t === '-' || peek().t === '+')) { var op = tk[p++].t; var u = unary(); return op === '-' ? { op: 'neg', a: u } : u; } return power(); }
    function power() { var b = atom(); if (peek() && peek().t === '^') { p++; var e = unary(); return { op: '^', a: b, b: e }; } return b; }
    function atom() {
      var t = peek(); if (!t) throw new Error('Ende');
      if (t.t === 'n') { p++; return { num: t.v }; }
      if (t.t === 'v') { p++; return { v: t.v }; }
      if (t.t === '(') { p++; var e = expr(); eat(')'); return e; }
      throw new Error('unerwartet');
    }
    var tree = expr(); if (p !== tk.length) throw new Error('Rest');
    return tree;
  }
  function evalTree(n, env) {
    if (n.num !== undefined) return n.num;
    if (n.v !== undefined) { if (!(n.v in env)) throw new Error('Variable ' + n.v); return env[n.v]; }
    var a = evalTree(n.a, env);
    if (n.op === 'neg') return -a;
    var b = evalTree(n.b, env);
    switch (n.op) { case '+': return a + b; case '-': return a - b; case '*': return a * b; case '/': return a / b; case '^': return Math.pow(a, b); }
    throw new Error('op');
  }
  function varsOf(n, set) { set = set || {}; if (!n) return set; if (n.v) set[n.v] = 1; varsOf(n.a, set); varsOf(n.b, set); return set; }
  /* gleichwertige Terme? prüft an mehreren Stellen */
  function termEq(s1, s2) {
    var t1, t2; try { t1 = parseTerm(s1); t2 = parseTerm(s2); } catch (e) { return false; }
    var vs = Object.keys(Object.assign(varsOf(t1), varsOf(t2)));
    var pts = [-2.5, -1.3, 0.7, 1.9, 3.1, 4.6];
    for (var i = 0; i < pts.length; i++) {
      var env = {}; vs.forEach(function (v, k) { env[v] = pts[(i + k * 2) % pts.length] + k * 0.37; });
      var a = evalTree(t1, env), b = evalTree(t2, env);
      if (!isFinite(a) || !isFinite(b) || Math.abs(a - b) > 1e-7 * Math.max(1, Math.abs(a))) return false;
    }
    return true;
  }
  function termValid(s) { try { parseTerm(s); return true; } catch (e) { return false; } }
  /* Term schön darstellen: 3x^2 -> 3x², * -> · */
  function tpretty(s) { return String(s).replace(/\^2/g, '²').replace(/\^3/g, '³').replace(/\*/g, '·').replace(/-/g, '−'); }
  /* lineares Glied a·x mit Vorzeichen für Ausgabe */
  function mono(c, v, first) {
    if (c === 0) return first ? '0' : '';
    var sign = c < 0 ? (first ? '−' : ' − ') : (first ? '' : ' + ');
    var a = Math.abs(c), core = v ? ((a === 1 ? '' : a) + v) : String(a);
    return sign + core;
  }
  function poly(coeffs) { /* [[c,'x²'],[c,'x'],[c,'']] */
    var s = '', first = true;
    coeffs.forEach(function (p) { if (p[0] === 0) return; s += mono(p[0], p[1], first); first = false; });
    return s || '0';
  }

  function check(inp, raw) {
    raw = String(raw == null ? '' : raw).trim();
    if (inp.kind === 'mc') return raw === '' ? { ok: false, empty: true } : { ok: +raw === inp.answer };
    if (!raw) return { ok: false, empty: true };
    if (inp.kind === 'num') { var x = parseNum(raw); if (x === null) return { ok: false, msg: 'Gib eine Zahl ein, zum Beispiel 12 oder 3,5.' }; return { ok: Math.abs(x - inp.answer) <= (inp.tol != null ? inp.tol : 1e-9) }; }
    if (inp.kind === 'frac') {
      var f = parseFrac(raw); if (!f) return { ok: false, msg: 'Schreibe den Bruch so: 3/4. Ein gemischter Bruch geht so: 1 1/2.' };
      var ans = F(inp.answer.n, inp.answer.d);
      if (!feq(f, ans)) return { ok: false };
      if (inp.reduce && !f.decimal && !f.mixed && !isReduced(f)) return { ok: false, almost: true, msg: 'Richtig gerechnet. Kürze das Ergebnis noch vollständig.' };
      return { ok: true };
    }
    if (inp.kind === 'term') {
      if (!termValid(raw)) return { ok: false, msg: 'Der Term ist nicht lesbar. Beispiel: 3x + 12 oder 4(x − 2). Für „hoch 2“ schreibst du x^2.' };
      if (!termEq(raw, inp.answer)) return { ok: false };
      if (inp.form === 'expanded' && /\(/.test(raw)) return { ok: false, almost: true, msg: 'Der Term ist gleichwertig, aber noch nicht ausmultipliziert. Löse die Klammer auf.' };
      if (inp.form === 'factored') { var tr = parseTerm(raw); while (tr.op === 'neg') tr = tr.a; if (!/\(/.test(raw) || (tr.op !== '*' && tr.op !== '^')) return { ok: false, almost: true, msg: 'Gleichwertig, aber noch nicht als Produkt geschrieben. Schreibe den Term als Produkt mit Klammer.' }; }
      if (inp.form === 'factored' && !/\(/.test(raw)) return { ok: false, almost: true, msg: 'Gleichwertig, aber noch nicht ausgeklammert. Schreibe den Term als Produkt mit Klammer.' };
      if (inp.factor) {
        var z = clean(raw).toLowerCase().replace(/\s+/g, '').replace(/\*/g, ''), fct = String(inp.factor).toLowerCase().replace(/\s+/g, '');
        if (!(z.indexOf(fct + '(') === 0 || (z.slice(-fct.length - 1) === ')' + fct && z.charAt(0) === '('))) return { ok: false, almost: true, msg: 'Gleichwertig, aber du kannst noch mehr ausklammern. Klammere den größten gemeinsamen Faktor aus.' };
      }
      if (inp.form === 'simplified' && inp.maxTerms && (clean(raw).replace(/^[-+]/, '').split(/[+-]/).length > inp.maxTerms)) return { ok: false, almost: true, msg: 'Gleichwertig, aber du kannst noch weiter zusammenfassen.' };
      return { ok: true };
    }
    if (inp.kind === 'text') { var opts = [].concat(inp.answer).map(function (a) { return String(a).toLowerCase(); }); return { ok: opts.indexOf(raw.toLowerCase()) >= 0 }; }
    return { ok: false };
  }
  return { check: check, gcd: gcd, lcm: lcm, rnd: rnd, nz: nz, pick: pick, shuffle: shuffle, F: F, red: red, fmul: fmul, fdiv: fdiv, fadd: fadd, feq: feq,
    isReduced: isReduced, fstr: fstr, fhtml: fhtml, fmtNum: fmtNum, clean: clean, parseNum: parseNum, parseFrac: parseFrac,
    parseTerm: parseTerm, evalTree: evalTree, termEq: termEq, termValid: termValid, tpretty: tpretty, mono: mono, poly: poly };
})();
if (typeof module !== 'undefined') module.exports = M;
