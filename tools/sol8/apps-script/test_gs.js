/* Simulation von Google Apps Script für Code.gs */
const fs = require('fs'), vm = require('vm'), assert = require('assert');
function makeSS() {
  const sheets = [];
  function Sheet(name) {
    let data = [], bg = {};
    const sh = {
      name, getName: () => name,
      getLastRow: () => { let n = data.length; while (n && data[n - 1].every(v => v === '' || v == null)) n--; return n; },
      appendRow: r => { data[sh.getLastRow()] = r.slice(); },
      clear: () => { data = []; bg = {}; return sh; },
      setFrozenRows() { }, setFrozenColumns() { },
      getRange(r, c, nr = 1, nc = 1) {
        const rg = {
          setValues(v) { assert.strictEqual(v.length, nr, 'Zeilenzahl ' + name); v.forEach((row, i) => { assert.strictEqual(row.length, nc, 'Spaltenzahl ' + name + ' Zeile ' + i); data[r - 1 + i] = data[r - 1 + i] || []; row.forEach((x, j) => data[r - 1 + i][c - 1 + j] = x); }); return rg; },
          setValue(x) { data[r - 1] = data[r - 1] || []; data[r - 1][c - 1] = x; return rg; },
          getValues() { const out = []; for (let i = 0; i < nr; i++) { const row = []; for (let j = 0; j < nc; j++) row.push(((data[r - 1 + i] || [])[c - 1 + j]) ?? ''); out.push(row); } return out; },
          setBackgrounds(b) { assert.strictEqual(b.length, nr); b.forEach((row, i) => row.forEach((x, j) => bg[(r + i) + ':' + (c + j)] = x)); return rg; },
          setBackground(x) { return rg; }, setFontWeight() { return rg; }, setFontColor() { return rg; }, setNumberFormat() { return rg; },
          createTextFinder(t) { return { matchEntireCell() { return { findNext() { return rg.getValues().some(row => row.some(x => String(x) === t)) ? {} : null; } }; } }; }
        };
        return rg;
      },
      _data: () => data, _bg: () => bg
    };
    return sh;
  }
  return {
    getSheetByName: n => sheets.find(s => s.name === n) || null,
    insertSheet: n => { const s = Sheet(n); sheets.push(s); return s; },
    getSheets: () => sheets, deleteSheet: s => sheets.splice(sheets.indexOf(s), 1), getUrl: () => 'https://docs.google.com/spreadsheets/d/TEST'
  };
}
const ss = makeSS(); ss.insertSheet('Tabellenblatt1');
const mails = []; let quota = 100;
const ctx = {
  SpreadsheetApp: { getActiveSpreadsheet: () => ss, getUi: () => ({ createMenu: () => ({ addItem() { return this; }, addSeparator() { return this; }, addToUi() { } }) }) },
  LockService: { getScriptLock: () => ({ waitLock() { }, releaseLock() { } }) },
  ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ setMimeType() { return { content: s }; } }) },
  MailApp: { getRemainingDailyQuota: () => quota, sendEmail: m => mails.push(m) },
  Session: { getEffectiveUser: () => ({ getEmail: () => 'lehrkraft@example.com' }) },
  Utilities: { formatDate: d => d.toISOString() }, console, JSON, Date, Math, String, Number, RegExp, Object, isFinite
};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(__dirname + '/Code.gs', 'utf8'), ctx);
const post = o => JSON.parse(ctx.doPost({ postData: { contents: typeof o === 'string' ? o : JSON.stringify(o) } }).content);
let id = 0;
function payload(over) {
  return Object.assign({ schema_version: '2.0', fach: 'Mathematik', jahrgang: '8', modul_id: '001', modul_titel: 'Brüche multiplizieren', dateiversion: '1.0.0',
    lerncode: 'MS', klasse: '8b', email: 'mia.schulte@ludgerusschule.de', lernweg: 'Standard · G/E', bearbeitungsstand: 100, pflichtschritte: [],
    diagnose_punkte: 3, diagnose_max: 4, uebungen_geloest: 5, uebungen_gesamt: 5, uebungen_erster_versuch: 3, tipps_genutzt: 2, loesungswege_genutzt: 0,
    weiterdenken_geloest: true, test_punkte: 5, test_max: 6, test_prozent: 83, test_durchlaeufe: 1,
    test_details: [{ aufgabe: 1, skill: 'Zähler mal Zähler', richtig: true }, { aufgabe: 2, skill: 'Gemischte Zahlen', richtig: false }],
    lerncheck: [{ aussage: 'Ich multipliziere sicher.', einschaetzung: 'Meistens' }], bearbeitungszeit_min: 41, abgabe_id: 'id-' + (++id), zeitstempel_client: new Date().toISOString() }, over || {});
}
let pass = 0; function ok(c, m) { assert.ok(c, m); pass++; console.log('✓ ' + m); }

ok(JSON.parse(ctx.doGet().content).status === 'bereit', 'doGet meldet bereit');
ok(/Mails gehen an: lehrkraft@example.com/.test(ctx.einrichten()), 'einrichten legt Blätter an und nennt Empfänger');
ok(!ss.getSheetByName('Tabellenblatt1'), 'leeres Standardblatt entfernt');
let r = post(payload()); ok(r.ok && r.status === 'gespeichert' && r.mail === 'gesendet', 'gültige Abgabe gespeichert und Mail gesendet');
const ab = ss.getSheetByName('Abgaben'); ok(ab.getLastRow() === 2, 'eine Datenzeile in Abgaben');
ok(mails[0].to === 'lehrkraft@example.com' && /Modul 001 · 8b · MS · Test 83 %/.test(mails[0].subject), 'Mail-Betreff: ' + mails[0].subject);
ok(/Gemischte Zahlen/.test(mails[0].htmlBody) && /Meistens/.test(mails[0].htmlBody), 'Mail enthält Fehler im Test und Lerncheck');
const dupId = 'id-' + id; r = post(payload({ abgabe_id: dupId })); ok(r.ok && r.duplicate === true && ab.getLastRow() === 2 && mails.length === 1, 'doppelte Abgabe erkannt, keine zweite Zeile, keine zweite Mail');
const bad = [
  [{ lerncode: 'M' }, /zwei Buchstaben/], [{ lerncode: 'M1' }, /zwei Buchstaben/], [{ klasse: '7b' }, /passt nicht zum Jahrgang 8/], [{ klasse: 'Klasse 8 b' }, null],
  [{ email: 'mia' }, /E-Mail/], [{ modul_id: 'M-1' }, /Modulnummer/], [{ jahrgang: '6' }, /Jahrgang/], [{ fach: 'Geschichte' }, /Mathematik/],
  [{ test_punkte: 9, test_max: 6 }, /unplausibel/], [{ abgabe_id: '' }, /Abgabe-ID/], [{ tipps_genutzt: -3 }, /Ungültiger Wert/]];
bad.forEach(([o, re]) => { const x = post(payload(o)); if (re) ok(!x.ok && re.test(x.error), 'abgelehnt: ' + JSON.stringify(o) + ' → ' + x.error); else ok(x.ok, 'angenommen und normalisiert: ' + JSON.stringify(o)); });
ok(!post('kein json').ok, 'kaputte Daten abgelehnt');
ok(!JSON.parse(ctx.doPost({}).content).ok, 'leere Anfrage abgelehnt');
ok(ab._data()[ab.getLastRow() - 1][2] === '8b', 'Klasse „Klasse 8 b“ als 8b gespeichert');
// mehrere Schüler und Module für Auswertung
post(payload({ lerncode: 'JK', email: 'jan.k@ludgerusschule.de', klasse: '8a', test_punkte: 2, test_prozent: 33, test_details: [{ skill: 'Gemischte Zahlen', richtig: false }, { skill: 'Zähler mal Zähler', richtig: false }] }));
post(payload({ modul_id: '003', modul_titel: 'Klammerterme', test_punkte: 6, test_prozent: 100 }));
post(payload({ test_punkte: 6, test_prozent: 100 })); // MS verbessert sich in 001
const ue = ss.getSheetByName('Übersicht')._data();
const head = ue[0]; const ms = ue.find(row => row[2] === 'MS'), jk = ue.find(row => row[2] === 'JK');
ok(head.indexOf('M001') > 0 && head.indexOf('M003') > 0, 'Übersicht hat Spalten M001 und M003');
ok(ms[head.indexOf('M001')] === 100 && ms[head.indexOf('M003')] === 100 && ms[4] === 2, 'Übersicht zeigt bestes Ergebnis je Modul (MS: 100/100, 2 Module)');
ok(jk[head.indexOf('M001')] === 33 && jk[1] === '8a', 'Übersicht: JK 33 % in 8a');
const bgs = ss.getSheetByName('Übersicht')._bg(); const jkRow = ue.indexOf(jk) + 1;
ok(bgs[jkRow + ':' + (head.indexOf('M001') + 1)] === '#f6c6c6', 'Ampel rot bei 33 %');
ok(ue.findIndex(row => row[2] === 'JK') < ue.findIndex(row => row[2] === 'MS'), 'sortiert nach Klasse (8a vor 8b)');
const pr = ss.getSheetByName('Problemaufgaben')._data();
ok(pr.length > 2 && pr[1][7] >= pr[2][7], 'Problemaufgaben absteigend nach Fehlerquote');
ok(pr.some(row => row[4] === 'Gemischte Zahlen' && row[1] === '8b'), 'Problemaufgaben je Klasse und Aufgabentyp');
quota = 0; r = post(payload()); ok(r.ok && r.mail === 'kontingent', 'leeres Mail-Kontingent: Abgabe trotzdem gespeichert');
ok(ss.getSheetByName('Protokoll').getLastRow() > 1, 'Protokoll führt abgelehnte Abgaben und Mailprobleme');
quota = 5; ok(ctx.testmail() === 'gesendet', 'Testmail-Funktion');
console.log('\nAlle ' + pass + ' Prüfungen bestanden.');
