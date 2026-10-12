/**
 * SOL Mathematik 7 bis 10 · Auswertung für edmundbruns.com
 * Dr. Edmund Bruns · Version 1.0 · Oktober 2026
 *
 * Einrichtung (einmalig):
 *  1. Neue Google-Tabelle anlegen, zum Beispiel „SOL Mathe 8 bis 10 · Auswertung“.
 *  2. Erweiterungen > Apps Script. Diesen Code komplett einfügen und speichern.
 *  3. Oben die Funktion „einrichten“ auswählen und auf „Ausführen“ klicken. Berechtigungen bestätigen.
 *  4. Bereitstellen > Neue Bereitstellung > Typ „Web-App“.
 *     Ausführen als: Ich · Zugriff: Jeder. Auf „Bereitstellen“ klicken.
 *  5. Die Web-App-URL (endet auf /exec) an Claude bzw. in die Module eintragen.
 */

var CONFIG = {
  SYSTEM: 'SOL Mathematik 7 bis 10',
  JAHRGAENGE: ['7', '8', '9', '10'],
  // Leer lassen = Mail geht an das Google-Konto, dem dieses Skript gehört.
  MAIL_AN: '',
  MAIL_PRO_ABGABE: true,
  AMPEL_GRUEN: 80,   // ab diesem Test-Prozentwert grün
  AMPEL_GELB: 50     // ab diesem Wert gelb, darunter rot
};

var BLATT = { ABGABEN: 'Abgaben', UEBERSICHT: 'Übersicht', PROBLEME: 'Problemaufgaben', PROTOKOLL: 'Protokoll' };
var SPALTEN = ['Eingang', 'Jahrgang', 'Klasse', 'Lerncode', 'E-Mail', 'Modul', 'Modultitel', 'Lernweg', 'Bearbeitet %',
  'Test Punkte', 'Test max', 'Test %', 'Übungen gelöst', 'Übungen gesamt', 'Beim 1. Versuch', 'Tipps', 'Lösungswege',
  'Weiterdenken', 'Diagnose', 'Lerncheck', 'Zeit (Min.)', 'Testdurchläufe', 'Test-Details', 'Abgabe-ID', 'Version'];
var FARBE = { gruen: '#c8ecd2', gelb: '#fdeeb5', rot: '#f6c6c6', kopf: '#3d2a73' };

/* ---------------- Web-App ---------------- */
function doGet() {
  return antwort({ ok: true, system: CONFIG.SYSTEM, status: 'bereit' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = lesen(e);
    pruefen(d);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = blatt(ss, BLATT.ABGABEN, SPALTEN);
    if (schonDa(sh, d.abgabe_id)) return antwort({ ok: true, status: 'gespeichert', duplicate: true, abgabe_id: d.abgabe_id });
    var jetzt = new Date();
    sh.appendRow(zeile(d, jetzt));
    var mail = 'aus';
    try { uebersicht(ss); probleme(ss); } catch (err) { protokoll(ss, 'Auswertung', err.message); }
    if (CONFIG.MAIL_PRO_ABGABE) { mail = mailSenden(d, jetzt, ss); }
    return antwort({ ok: true, status: 'gespeichert', abgabe_id: d.abgabe_id, mail: mail });
  } catch (err) {
    try { protokoll(SpreadsheetApp.getActiveSpreadsheet(), 'Abgabe abgelehnt', err.message); } catch (x) { }
    return antwort({ ok: false, status: 'Fehler', error: err.message });
  } finally {
    try { lock.releaseLock(); } catch (x) { }
  }
}

function antwort(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/* ---------------- Prüfen ---------------- */
function lesen(e) {
  if (!e || !e.postData || !e.postData.contents) throw new Error('Keine Daten empfangen.');
  if (e.postData.contents.length > 60000) throw new Error('Die Abgabe ist zu groß.');
  try { return JSON.parse(e.postData.contents); } catch (x) { throw new Error('Die Daten sind nicht lesbar.'); }
}

function klasseNorm(k, jg) {
  var m = String(k || '').toLowerCase().replace(/[^a-z0-9]/g, '').match(new RegExp('^(?:klasse)?' + jg + '([a-z]?)$'));
  return m ? jg + m[1] : '';
}

function pruefen(d) {
  if (d.fach !== 'Mathematik') throw new Error('Dieses Skript nimmt nur Mathematik an.');
  d.jahrgang = String(d.jahrgang || '');
  if (CONFIG.JAHRGAENGE.indexOf(d.jahrgang) < 0) throw new Error('Ungültiger Jahrgang.');
  d.lerncode = String(d.lerncode || '').toUpperCase().trim();
  if (!/^[A-ZÄÖÜ]{2}$/.test(d.lerncode)) throw new Error('Der Lerncode muss aus zwei Buchstaben bestehen.');
  var k = klasseNorm(d.klasse, d.jahrgang);
  if (!k) throw new Error('Die Klasse passt nicht zum Jahrgang ' + d.jahrgang + '.');
  d.klasse = k;
  d.email = String(d.email || '').trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email) || d.email.length > 120) throw new Error('Die E-Mail-Adresse ist ungültig.');
  if (!/^\d{3}$/.test(String(d.modul_id || ''))) throw new Error('Ungültige Modulnummer.');
  if (!d.abgabe_id || String(d.abgabe_id).length > 80) throw new Error('Abgabe-ID fehlt.');
  ['bearbeitungsstand', 'test_punkte', 'test_max', 'test_prozent', 'uebungen_geloest', 'uebungen_gesamt', 'tipps_genutzt'].forEach(function (f) {
    var v = Number(d[f] || 0); if (!isFinite(v) || v < 0 || v > 1000) throw new Error('Ungültiger Wert: ' + f);
    d[f] = v;
  });
  if (d.test_punkte > d.test_max) throw new Error('Testpunkte sind unplausibel.');
  d.modul_titel = String(d.modul_titel || '').slice(0, 120);
  return d;
}

/* ---------------- Speichern ---------------- */
function blatt(ss, name, kopf) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    if (kopf) {
      sh.getRange(1, 1, 1, kopf.length).setValues([kopf]).setFontWeight('bold').setFontColor('#ffffff').setBackground(FARBE.kopf);
      sh.setFrozenRows(1);
    }
  }
  return sh;
}

function schonDa(sh, id) {
  if (sh.getLastRow() < 2) return false;
  var col = SPALTEN.indexOf('Abgabe-ID') + 1;
  return !!sh.getRange(2, col, sh.getLastRow() - 1, 1).createTextFinder(String(id)).matchEntireCell(true).findNext();
}

function zeile(d, jetzt) {
  var lc = (d.lerncheck || []).map(function (x) { return x.einschaetzung || '–'; }).join(' / ');
  var det = (d.test_details || []).map(function (x) { return (x.richtig ? '✓ ' : '✗ ') + x.skill; }).join('; ');
  return [jetzt, d.jahrgang, d.klasse, d.lerncode, d.email, d.modul_id, d.modul_titel, d.lernweg || '', d.bearbeitungsstand,
    d.test_punkte, d.test_max, d.test_prozent, d.uebungen_geloest, d.uebungen_gesamt, Number(d.uebungen_erster_versuch || 0),
    d.tipps_genutzt, Number(d.loesungswege_genutzt || 0), d.weiterdenken_geloest ? 'ja' : 'nein',
    (d.diagnose_punkte || 0) + '/' + (d.diagnose_max || 0), lc, Number(d.bearbeitungszeit_min || 0), Number(d.test_durchlaeufe || 0),
    det, String(d.abgabe_id), String(d.dateiversion || '')];
}

function daten(ss) {
  var sh = ss.getSheetByName(BLATT.ABGABEN);
  if (!sh || sh.getLastRow() < 2) return [];
  var v = sh.getRange(2, 1, sh.getLastRow() - 1, SPALTEN.length).getValues();
  var ix = {}; SPALTEN.forEach(function (s, i) { ix[s] = i; });
  return v.map(function (r) { var o = {}; SPALTEN.forEach(function (s) { o[s] = r[ix[s]]; }); return o; });
}

/* ---------------- Auswertung ---------------- */
function ampel(p) { return p === '' || p === null ? null : (p >= CONFIG.AMPEL_GRUEN ? FARBE.gruen : p >= CONFIG.AMPEL_GELB ? FARBE.gelb : FARBE.rot); }

function uebersicht(ss) {
  var rows = daten(ss);
  var sh = blatt(ss, BLATT.UEBERSICHT);
  sh.clear();
  if (!rows.length) { sh.getRange(1, 1).setValue('Noch keine Abgaben.'); return; }
  var module = {}, personen = {};
  rows.forEach(function (r) {
    var mk = r['Jahrgang'] + '-' + String(r['Modul']).padStart(3, '0');
    module[mk] = r['Modultitel'];
    var pk = r['Jahrgang'] + '|' + r['Klasse'] + '|' + r['E-Mail'];
    var p = personen[pk] || (personen[pk] = { jg: r['Jahrgang'], kl: r['Klasse'], code: r['Lerncode'], mail: r['E-Mail'], best: {}, last: r['Eingang'] });
    var t = Number(r['Test %']) || 0;
    if (!(mk in p.best) || t > p.best[mk]) p.best[mk] = t;
    if (r['Eingang'] > p.last) p.last = r['Eingang'];
    p.code = r['Lerncode'];
  });
  var mk = Object.keys(module).sort(function (a, b) { var x = a.split('-'), y = b.split('-'); return (x[0] - y[0]) || (x[1] < y[1] ? -1 : x[1] > y[1] ? 1 : 0); });
  var kopf = ['Jahrgang', 'Klasse', 'Lerncode', 'E-Mail', 'Module', 'Ø Test %', 'Letzte Abgabe'].concat(mk.map(function (m) { return 'M' + m.split('-')[1]; }));
  var list = Object.keys(personen).map(function (k) { return personen[k]; }).sort(function (a, b) {
    return (a.jg - b.jg) || (a.kl < b.kl ? -1 : a.kl > b.kl ? 1 : 0) || (a.code < b.code ? -1 : a.code > b.code ? 1 : 0);
  });
  var werte = [], farben = [];
  list.forEach(function (p) {
    var vals = mk.map(function (m) { return m in p.best ? p.best[m] : ''; });
    var done = vals.filter(function (v) { return v !== ''; });
    var avg = done.length ? Math.round(done.reduce(function (s, v) { return s + v; }, 0) / done.length) : '';
    werte.push([p.jg, p.kl, p.code, p.mail, done.length, avg, p.last].concat(vals));
    farben.push([null, null, null, null, null, ampel(avg), null].concat(vals.map(ampel)));
  });
  sh.getRange(1, 1, 1, kopf.length).setValues([kopf]).setFontWeight('bold').setFontColor('#ffffff').setBackground(FARBE.kopf);
  sh.getRange(2, 1, werte.length, kopf.length).setValues(werte).setBackgrounds(farben);
  sh.getRange(2, 7, werte.length, 1).setNumberFormat('dd.MM.yyyy HH:mm');
  var hinweis = ['Modulnamen:'].concat(mk.map(function (m) { return 'M' + m.split('-')[1] + ' (Jg. ' + m.split('-')[0] + ') = ' + module[m]; }));
  sh.getRange(werte.length + 3, 1, hinweis.length, 1).setValues(hinweis.map(function (x) { return [x]; }));
  sh.getRange(werte.length + 3, 1).setFontWeight('bold');
  sh.setFrozenRows(1); sh.setFrozenColumns(3);
}

function probleme(ss) {
  var rows = daten(ss), agg = {};
  rows.forEach(function (r) {
    String(r['Test-Details'] || '').split('; ').forEach(function (x) {
      if (!x) return;
      var ok = x.charAt(0) === '✓', skill = x.slice(2);
      var k = [r['Jahrgang'], r['Klasse'], String(r['Modul']).padStart(3, '0'), r['Modultitel'], skill].join('|');
      var a = agg[k] || (agg[k] = { n: 0, f: 0 }); a.n++; if (!ok) a.f++;
    });
  });
  var sh = blatt(ss, BLATT.PROBLEME); sh.clear();
  var kopf = ['Jahrgang', 'Klasse', 'Modul', 'Modultitel', 'Aufgabentyp', 'Bearbeitet', 'Falsch', 'Falsch %'];
  var werte = Object.keys(agg).map(function (k) { var p = k.split('|'), a = agg[k]; return p.concat([a.n, a.f, Math.round(a.f / a.n * 100)]); })
    .sort(function (a, b) { return b[7] - a[7] || b[5] - a[5]; });
  sh.getRange(1, 1, 1, kopf.length).setValues([kopf]).setFontWeight('bold').setFontColor('#ffffff').setBackground(FARBE.kopf);
  if (!werte.length) return;
  sh.getRange(2, 1, werte.length, kopf.length).setValues(werte);
  sh.getRange(2, 8, werte.length, 1).setBackgrounds(werte.map(function (w) { return [w[7] >= 50 ? FARBE.rot : w[7] >= 25 ? FARBE.gelb : FARBE.gruen]; }));
  sh.setFrozenRows(1);
}

/* ---------------- Mail ---------------- */
function empfaenger() { return CONFIG.MAIL_AN || Session.getEffectiveUser().getEmail(); }

function mailSenden(d, jetzt, ss) {
  try {
    if (MailApp.getRemainingDailyQuota() < 1) { protokoll(ss, 'Mail', 'Tageskontingent erschöpft'); return 'kontingent'; }
    var falsch = (d.test_details || []).filter(function (x) { return !x.richtig; }).map(function (x) { return x.skill; });
    var betreff = 'SOL Mathe ' + d.jahrgang + ' · Modul ' + d.modul_id + ' · ' + d.klasse + ' · ' + d.lerncode + ' · Test ' + d.test_prozent + ' %';
    var farbe = d.test_prozent >= CONFIG.AMPEL_GRUEN ? '#166534' : d.test_prozent >= CONFIG.AMPEL_GELB ? '#8a4b06' : '#991b1b';
    var zeilen = [
      ['Lerncode', esc(d.lerncode)], ['Klasse', esc(d.klasse)], ['IServ', esc(d.email)], ['Modul', esc(d.modul_id + ' · ' + d.modul_titel)],
      ['Lernweg', esc(d.lernweg || '')], ['Bearbeitet', d.bearbeitungsstand + ' %'],
      ['Abschlusstest', '<b style="color:' + farbe + '">' + d.test_punkte + ' von ' + d.test_max + ' (' + d.test_prozent + ' %)</b>'],
      ['Übungen', d.uebungen_geloest + ' von ' + d.uebungen_gesamt + ' gelöst, ' + Number(d.uebungen_erster_versuch || 0) + ' beim ersten Versuch'],
      ['Hilfen', d.tipps_genutzt + ' Tipps, ' + Number(d.loesungswege_genutzt || 0) + ' Lösungswege'],
      ['Weiterdenken', d.weiterdenken_geloest ? 'gelöst' : 'nicht gelöst'],
      ['Startdiagnose', (d.diagnose_punkte || 0) + ' von ' + (d.diagnose_max || 0)],
      ['Zeit', 'ca. ' + Number(d.bearbeitungszeit_min || 0) + ' Minuten'],
      ['Fehler im Test', falsch.length ? esc(falsch.join(', ')) : 'keine']];
    var lc = (d.lerncheck || []).map(function (x) { return '<li>' + esc(x.aussage) + ': <b>' + esc(x.einschaetzung || '–') + '</b></li>'; }).join('');
    var html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1c1830">' +
      '<h2 style="color:#3d2a73;margin:0 0 8px">Neue Abgabe: Modul ' + esc(d.modul_id) + '</h2>' +
      '<table cellpadding="6" style="border-collapse:collapse">' + zeilen.map(function (z) { return '<tr><td style="border-bottom:1px solid #ddd;color:#5a5670">' + z[0] + '</td><td style="border-bottom:1px solid #ddd">' + z[1] + '</td></tr>'; }).join('') + '</table>' +
      (lc ? '<h3 style="margin:16px 0 4px">Selbsteinschätzung</h3><ul>' + lc + '</ul>' : '') +
      '<p><a href="' + ss.getUrl() + '">Zur Auswertungstabelle</a></p>' +
      '<p style="color:#888;font-size:12px">Eingang ' + Utilities.formatDate(jetzt, 'Europe/Berlin', 'dd.MM.yyyy HH:mm') + ' · Abgabe-ID ' + esc(d.abgabe_id) + '</p></div>';
    var text = betreff + '\n\n' + zeilen.map(function (z) { return z[0] + ': ' + String(z[1]).replace(/<[^>]+>/g, ''); }).join('\n') + '\n\nAuswertung: ' + ss.getUrl();
    MailApp.sendEmail({ to: empfaenger(), subject: betreff, body: text, htmlBody: html, name: 'SOL Mathematik' });
    return 'gesendet';
  } catch (err) {
    protokoll(ss, 'Mail', err.message);
    return 'fehler';
  }
}

function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

function protokoll(ss, art, text) {
  var sh = blatt(ss, BLATT.PROTOKOLL, ['Zeit', 'Art', 'Meldung']);
  sh.appendRow([new Date(), art, String(text).slice(0, 500)]);
}

/* ---------------- Menü und Einrichtung ---------------- */
function onOpen() {
  SpreadsheetApp.getUi().createMenu('SOL Mathe')
    .addItem('Auswertung aktualisieren', 'auswertungAktualisieren')
    .addItem('Testmail an mich senden', 'testmail')
    .addSeparator().addItem('Einrichten', 'einrichten').addToUi();
}

function einrichten() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  blatt(ss, BLATT.ABGABEN, SPALTEN);
  blatt(ss, BLATT.UEBERSICHT); blatt(ss, BLATT.PROBLEME);
  blatt(ss, BLATT.PROTOKOLL, ['Zeit', 'Art', 'Meldung']);
  var leer = ss.getSheetByName('Tabellenblatt1') || ss.getSheetByName('Sheet1');
  if (leer && ss.getSheets().length > 1 && leer.getLastRow() === 0) ss.deleteSheet(leer);
  uebersicht(ss); probleme(ss);
  return 'Eingerichtet. Mails gehen an: ' + empfaenger();
}

function auswertungAktualisieren() { var ss = SpreadsheetApp.getActiveSpreadsheet(); uebersicht(ss); probleme(ss); }

function testmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return mailSenden({ jahrgang: '8', modul_id: '000', modul_titel: 'Testmail', klasse: '8a', lerncode: 'XY', email: 'test@example.com', lernweg: 'Standard',
    bearbeitungsstand: 100, test_punkte: 5, test_max: 6, test_prozent: 83, uebungen_geloest: 5, uebungen_gesamt: 5, tipps_genutzt: 1,
    test_details: [{ skill: 'Beispiel-Aufgabentyp', richtig: false }], lerncheck: [{ aussage: 'Beispielaussage', einschaetzung: 'Meistens' }], abgabe_id: 'test' }, new Date(), ss);
}
