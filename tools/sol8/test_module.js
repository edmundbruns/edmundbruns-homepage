/* Prüft ein Modul: node test_module.js modules/001.js [N] */
const fs = require('fs'), vm = require('vm');
const M = require('./mathlib.js');
const file = process.argv[2], N = +(process.argv[3] || 400);
const ctx = { M, console, Math, String, Number, Array, Object, JSON };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(file, 'utf8') + '\nthis.MODULE = MODULE;', ctx);
const MOD = ctx.MODULE;
let errors = [], count = 0;
function err(k, msg, t) { if (errors.length < 40) errors.push(k + ': ' + msg + (t ? '\n   q=' + String(t.q).slice(0, 160) : '')); }
function strip(h) { return String(h).replace(/<[^>]+>/g, ' '); }
function correctString(inp) {
  if (inp.kind === 'frac') return M.fstr(inp.answer);
  if (inp.kind === 'num') return String(inp.answer).replace('.', ',');
  if (inp.kind === 'term') return inp.answer;
  if (inp.kind === 'mc') return String(inp.answer);
  if (inp.kind === 'text') return [].concat(inp.answer)[0];
}
function wrongString(inp) {
  if (inp.kind === 'frac') return M.fstr(M.fadd(inp.answer, M.F(1, 7)));
  if (inp.kind === 'num') return String(inp.answer + 1 + (inp.tol || 0) * 3).replace('.', ',');
  if (inp.kind === 'term') return '(' + inp.answer + ')+1';
  if (inp.kind === 'mc') return String((inp.answer + 1) % inp.options.length);
  if (inp.kind === 'text') return 'falsch';
}
const keys = Object.keys(MOD.tasks.gen);
const used = new Set([].concat(MOD.tasks.plan.G, MOD.tasks.plan.S, MOD.tasks.plan.E, MOD.tasks.test, [MOD.tasks.extra]).map(k => k.split(':')[0]));
used.forEach(k => { if (!MOD.tasks.gen[k]) err(k, 'Generator fehlt'); });
keys.forEach(k => { if (!used.has(k)) console.log('Hinweis: Generator ungenutzt:', k); });
for (const k of keys) for (const lvl of [1, 2, 3]) for (let i = 0; i < N; i++) {
  let t; try { t = MOD.tasks.gen[k](lvl); } catch (e) { err(k, 'Ausnahme ' + e.message); break; }
  count++;
  const all = [t.q, t.solution].concat(t.hints || []).join(' ');
  if (/undefined|NaN|Infinity|\[object/.test(all)) { err(k, 'undefined/NaN im Text', t); continue; }
  if (!t.inputs || !t.inputs.length) { err(k, 'keine Eingaben', t); continue; }
  if (!t.hints || t.hints.length < 2) err(k, 'zu wenig Tipps', t);
  if (!t.solution) err(k, 'kein Lösungsweg', t);
  t.inputs.forEach((inp, j) => {
    if (inp.kind === 'mc') {
      const o = inp.options.map(strip); if (new Set(o).size !== o.length) { err(k, 'doppelte Optionen: ' + o.join(' | '), t); return; }
      if (!(inp.answer >= 0 && inp.answer < o.length)) err(k, 'MC-Antwort ungültig', t);
    }
    if (inp.kind === 'frac' && inp.reduce && !M.isReduced(M.F(inp.answer.n, inp.answer.d))) err(k, 'Lösung nicht gekürzt', t);
    if (inp.kind === 'num' && !isFinite(inp.answer)) err(k, 'Lösung keine Zahl', t);
    const okr = M.check(inp, correctString(inp));
    if (!okr.ok) err(k, 'richtige Antwort abgelehnt (' + correctString(inp) + ') ' + JSON.stringify(okr), t);
    const bad = M.check(inp, wrongString(inp));
    if (bad.ok) err(k, 'falsche Antwort angenommen (' + wrongString(inp) + ')', t);
  });
  if (t.src) { const ti = t.inputs.find(i => i.kind === 'term'); if (ti && !M.termEq(t.src, ti.answer)) err(k, 'Lösung passt nicht zur Aufgabe: ' + t.src + ' ≠ ' + ti.answer, t); }
  if (t.verify) { const v = t.verify(); if (v !== true) err(k, 'Eigenprüfung: ' + v, t); }
}
MOD.diagnose.forEach((d, i) => { if (!(d.answer >= 0 && d.answer < d.options.length)) err('diagnose', 'Antwort ungültig ' + i); });
['id', 'title', 'bereich', 'lead', 'einstieg', 'ziele', 'erklaerung', 'entdecken', 'beispiel', 'lerncheck'].forEach(f => { if (!MOD[f]) err('modul', 'Feld fehlt: ' + f); });
console.log(MOD.id + ' ' + MOD.title + ': ' + count + ' Aufgaben erzeugt, ' + errors.length + ' Fehler');
errors.forEach(e => console.log(' - ' + e));
process.exitCode = errors.length ? 1 : 0;
