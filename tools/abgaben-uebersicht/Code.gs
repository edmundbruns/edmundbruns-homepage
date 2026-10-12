/**
 * SOL-Abgaben · Übersicht (nur für Edmund)
 * Holt die Abgaben aus den Auswertungs-Tabellen von Mathe und Geschichte,
 * vereinheitlicht sie im Blatt „Daten“ und baut daraus die Übersichten.
 * Menü: SOL-Übersicht > Jetzt aktualisieren. Automatisch: stündlich.
 */
var QUELLEN = [
  { name: 'Mathe 8–10', fach: 'Mathe', id: '1yQoYG0HJwjVB_4jeUwYKrbrCBd0dmupAaGAuOI0929Q', blatt: 'Abgaben' },
  { name: 'Mathe 7', fach: 'Mathe', jg: 7, id: '1YW6UWJHmn4xXn9fETRhlPofkpIQTxcobjcoORqrDyY0', blatt: 'Rohdaten (alle Module)' },
  { name: 'Mathe 6', fach: 'Mathe', jg: 6, id: '1uuUh6qeC3D8fuuoTFU7Hi6f-i3sHn5K8pmjkIEbwP3E', blatt: 'Abgaben' },
  { name: 'Mathe 5', fach: 'Mathe', jg: 5, id: '1yMW6SipwEft_ByKB7g9f7nlpIr8kaK7_KeP8_VCt6Vk', muster: /^Modul_(\d+)$/ },
  { name: 'Geschichte', fach: 'Geschichte', id: '1UUJnpab8-9dU6NUD-mX1cC8Ig9wZnCpFdVtvcFK_kcs', blatt: 'Abgaben' }
];
var KOPF = ['Fach', 'Jahrgang', 'Klasse', 'Modul', 'Modultitel', 'Name/Lerncode', 'E-Mail', 'Quelle', 'Abgabe-ID', 'Bearbeitet %', 'Test %', 'Eingang', 'Testdaten?'];
var TEST = /test|claude|codex|example\.com|funktionstest|l(o|ö)eschen/i;
var FARBE = '#1f4e5a';

function onOpen() {
  SpreadsheetApp.getUi().createMenu('SOL-Übersicht')
    .addItem('Jetzt aktualisieren', 'aktualisieren')
    .addItem('Einrichten (Blätter und stündliche Aktualisierung)', 'einrichten')
    .addToUi();
}

/** Einmal ausführen: legt alle Blätter, Formeln und die stündliche Aktualisierung an. */
function einrichten() {
  var ss = SpreadsheetApp.getActive();
  // Formeln werden mit Komma-Trennern geschrieben: dafür kurz auf en_US, am Ende zurück auf de_DE.
  ss.setSpreadsheetLocale('en_US');
  ss.setSpreadsheetTimeZone('Europe/Berlin');
  SpreadsheetApp.flush();
  ['Übersicht', 'Matrix Mathe', 'Matrix Geschichte', 'Lernende', 'Nicht fertig', 'Problemstellen', 'Daten', 'Hinweise'].forEach(function (n, i) {
    var sh = ss.getSheetByName(n) || ss.insertSheet(n);
    ss.setActiveSheet(sh); ss.moveActiveSheet(i + 1);
  });
  ss.getSheets().forEach(function (sh) { if (/^(Tabellenblatt|Sheet)\d+$/.test(sh.getName())) ss.deleteSheet(sh); });
  baueDaten_(ss); baueUebersicht_(ss); baueMatrix_(ss, 'Mathe'); baueMatrix_(ss, 'Geschichte');
  baueLernende_(ss); baueNichtFertig_(ss); baueHinweise_(ss);
  SpreadsheetApp.flush();
  ss.setSpreadsheetLocale('de_DE');
  SpreadsheetApp.flush();
  ScriptApp.getProjectTriggers().forEach(function (t) { if (t.getHandlerFunction() === 'aktualisieren') ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('aktualisieren').timeBased().everyHours(1).create();
  aktualisieren();
  ss.setActiveSheet(ss.getSheetByName('Übersicht'));
}

/* ---------- Daten holen ---------- */
function aktualisieren() {
  var ss = SpreadsheetApp.getActive(), zeilen = [], fehler = [], prob = [], bereiche = {};
  QUELLEN.forEach(function (q) {
    try {
      var src = SpreadsheetApp.openById(q.id);
      var blaetter = q.muster ? src.getSheets().filter(function (s) { return q.muster.test(s.getName()); }) : [src.getSheetByName(q.blatt)];
      blaetter.forEach(function (sh) {
        if (!sh || sh.getLastRow() < 2) return;
        var rng = sh.getDataRange(), v = rng.getValues(), d = rng.getDisplayValues(), k = v[0].map(String);
        var modulAusName = q.muster ? Number(q.muster.exec(sh.getName())[1]) : null;
        var c = spalten_(k);
        for (var r = 1; r < v.length; r++) {
          var z = v[r], zd = d[r];
          if (z.every(function (x) { return x === '' || x === null; })) continue;
          var klasse = c.klasse >= 0 ? String(zd[c.klasse]).trim() : '';
          var jg = c.jg >= 0 && zd[c.jg] ? Number(zd[c.jg]) : (Number((/(10|[5-9])/.exec(klasse) || [])[1]) || q.jg || '');
          var modul = c.modul >= 0 ? zahl_(zd[c.modul]) : modulAusName;
          var name = c.name >= 0 ? String(zd[c.name]).trim() : '';
          var mail = c.mail >= 0 ? String(zd[c.mail]).trim() : '';
          var test = c.testp >= 0 ? zahl_(zd[c.testp]) : (c.punkte >= 0 && c.max >= 0 && zahl_(zd[c.max]) ? Math.round(zahl_(zd[c.punkte]) / zahl_(zd[c.max]) * 100) : '');
          var bearb = c.bearb >= 0 ? zahl_(zd[c.bearb]) : '';
          var istTest = TEST.test(name + '|' + mail + '|' + klasse) || /^xx$/i.test(name);
          zeilen.push([q.fach, jg, klasse, modul === null ? '' : modul, c.titel >= 0 ? String(zd[c.titel]) : '', name, mail, q.name,
            c.id >= 0 ? String(zd[c.id]) : '', bearb, test, datum_(c.zeit >= 0 ? z[c.zeit] : ''), istTest]);
          if (q.fach === 'Geschichte' && !istTest && c.fehlend >= 0 && zd[c.fehlend]) {
            String(zd[c.fehlend]).split(/,\s*/).forEach(function (b) { b = b.trim(); if (b) bereiche[b] = (bereiche[b] || 0) + 1; });
          }
        }
      });
      if (q.name === 'Mathe 8–10') {
        var p = src.getSheetByName('Problemaufgaben');
        if (p && p.getLastRow() > 1) prob = p.getRange(2, 1, p.getLastRow() - 1, 8).getValues().filter(function (x) { return Number(x[5]) >= 3; });
      }
    } catch (e) { fehler.push(q.name + ': ' + e.message); }
  });
  var sh = ss.getSheetByName('Daten');
  sh.getRange(2, 1, Math.max(sh.getMaxRows() - 1, 1), KOPF.length).clearContent();
  if (zeilen.length) {
    if (sh.getMaxRows() < zeilen.length + 1) sh.insertRowsAfter(sh.getMaxRows(), zeilen.length + 1 - sh.getMaxRows());
    sh.getRange(2, 1, zeilen.length, KOPF.length).setValues(zeilen);
    sh.getRange(2, 12, zeilen.length, 1).setNumberFormat('dd.mm.yyyy hh:mm');
  }
  schreibeProblemstellen_(ss, prob, bereiche);
  var u = ss.getSheetByName('Übersicht');
  u.getRange('E4').setValue('Zuletzt aktualisiert: ' + Utilities.formatDate(new Date(), 'Europe/Berlin', 'dd.MM.yyyy HH:mm') + (fehler.length ? '  ·  Hinweis: ' + fehler.join('; ') : ''));
}

function spalten_(k) {
  function f(re, nicht) { for (var i = 0; i < k.length; i++) if (re.test(k[i]) && !(nicht && nicht.test(k[i]))) return i; return -1; }
  return {
    zeit: f(/^(eingang|serverzeit|zeitpunkt_eingang|zeitstempel|timestamp|datum|zeit)$/i),
    jg: f(/^jahrgang$/i), klasse: f(/^klasse$/i),
    name: f(/^(name|lerncode|name_oder_lerncode|name oder lerncode)$/i),
    mail: f(/mail/i), modul: f(/^(modul|modul_id|modulnummer|modul-nr\.?)$/i), titel: f(/titel/i),
    bearb: f(/bearbeit|vollstaendigkeit|vollständigkeit/i), testp: f(/^(test %|test_prozent|testprozent|prozent)$/i),
    punkte: f(/^(testpunkte|test punkte|punkte|test_punkte)$/i), max: f(/^(testmaximum|test max|max|test_max)$/i),
    id: f(/abgabe.?id|submission/i), fehlend: f(/fehlende bereiche/i)
  };
}
function zahl_(x) { if (x === '' || x === null || x === undefined) return ''; var n = Number(String(x).replace('%', '').replace(',', '.').trim()); return isNaN(n) ? '' : n; }
function datum_(x) {
  if (x instanceof Date) return x;
  var s = String(x || ''), m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\D+(\d{1,2}):(\d{2}))?/.exec(s);
  if (m) return new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0));
  var d = new Date(s); return isNaN(d) ? '' : d;
}

/* ---------- Blätter ---------- */
function kopf_(sh, zeile, spalten) {
  sh.getRange(zeile, 1, 1, spalten.length).setValues([spalten]).setFontWeight('bold').setFontColor('#ffffff').setBackground(FARBE);
}
function titel_(sh, t, hinweis) {
  sh.getRange('A1').setValue(t).setFontSize(15).setFontWeight('bold').setFontColor(FARBE);
  if (hinweis) sh.getRange('A2').setValue(hinweis).setFontColor('#666666').setFontStyle('italic');
}
function skala_(sh, a1) {
  var r = sh.getRange(a1), rules = sh.getConditionalFormatRules();
  rules.push(SpreadsheetApp.newConditionalFormatRule().setGradientMinpointWithValue('#f4b6b6', SpreadsheetApp.InterpolationType.NUMBER, '0')
    .setGradientMidpointWithValue('#fce8a6', SpreadsheetApp.InterpolationType.NUMBER, '60')
    .setGradientMaxpointWithValue('#b7e1c1', SpreadsheetApp.InterpolationType.NUMBER, '100').setRanges([r]).build());
  sh.setConditionalFormatRules(rules);
}
var BED = '"&IF(\'Übersicht\'!$B$4="Ja"," and M = false","")&"';
function f_(s) { return s; }

function baueDaten_(ss) {
  var sh = ss.getSheetByName('Daten'); sh.clear();
  kopf_(sh, 1, KOPF); sh.setFrozenRows(1);
  sh.setColumnWidths(1, KOPF.length, 110); sh.setColumnWidth(5, 260); sh.setColumnWidth(7, 220);
}

function baueUebersicht_(ss) {
  var sh = ss.getSheetByName('Übersicht'); sh.clear(); sh.setConditionalFormatRules([]);
  titel_(sh, 'SOL-Abgaben · Übersicht', 'Nur für Dr. Edmund Bruns. Enthält Namen und E-Mail-Adressen von Lernenden: nicht freigeben. Aktualisiert sich stündlich, sofort über das Menü „SOL-Übersicht“.');
  sh.getRange('A4').setValue('Testdaten ausblenden').setFontWeight('bold');
  sh.getRange('B4').setValue('Ja').setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(['Ja', 'Nein'], true).build()).setBackground('#fff4d6');
  sh.getRange('E4').setFontColor('#666666');
  sh.getRange('A6').setValue('Kennzahlen').setFontWeight('bold').setFontSize(12).setFontColor(FARBE);
  var echt = 'Daten!M2:M,IF($B$4="Ja",FALSE,"<>x")';
  var k = [
    ['Abgaben gesamt', '=COUNTIFS(Daten!A2:A,"<>",' + echt + ')'],
    ['davon Mathematik', '=COUNTIFS(Daten!A2:A,"Mathe",' + echt + ')'],
    ['davon Geschichte', '=COUNTIFS(Daten!A2:A,"Geschichte",' + echt + ')'],
    ['Abgaben in den letzten 7 Tagen', '=COUNTIFS(Daten!L2:L,">="&(NOW()-7),' + echt + ')'],
    ['Verschiedene Lernende', '=IFERROR(COUNTUNIQUE(FILTER(Daten!C2:C&"|"&Daten!F2:F,Daten!A2:A<>"",IF($B$4="Ja",Daten!M2:M=FALSE,Daten!A2:A<>""))),0)'],
    ['Aktive Klassen', '=IFERROR(COUNTUNIQUE(FILTER(Daten!A2:A&" "&Daten!C2:C,Daten!A2:A<>"",IF($B$4="Ja",Daten!M2:M=FALSE,Daten!A2:A<>""))),0)'],
    ['Ø Testergebnis (%)', '=IFERROR(ROUND(AVERAGEIFS(Daten!K2:K,Daten!A2:A,"<>",Daten!K2:K,"<>",' + echt + ')),"–")'],
    ['Letzte Abgabe', '=IFERROR(MAX(FILTER(Daten!L2:L,Daten!A2:A<>"",IF($B$4="Ja",Daten!M2:M=FALSE,Daten!A2:A<>""))),"–")']
  ];
  k.forEach(function (x, i) { sh.getRange(7 + i, 1).setValue(x[0]); sh.getRange(7 + i, 2).setFormula(x[1]).setFontWeight('bold'); });
  sh.getRange('B14').setNumberFormat('dd.mm.yyyy hh:mm');
  sh.getRange('A16').setValue('Stand je Klasse').setFontWeight('bold').setFontSize(12).setFontColor(FARBE);
  sh.getRange('A17').setValue('Rot: Ø Test unter etwa 50 %, Grün: sicher. Gute Grundlage für Gespräche mit Klassen- und Fachlehrkräften.').setFontColor('#666666').setFontStyle('italic');
  sh.getRange('A18').setFormula('=IFERROR(QUERY(Daten!A2:M,"select A, B, C, count(D), avg(K), avg(J), max(L) where A <> \'\'' + BED + ' group by A, B, C order by A, B, C label A \'Fach\', B \'Jg.\', C \'Klasse\', count(D) \'Abgaben\', avg(K) \'Ø Test %\', avg(J) \'Ø bearbeitet %\', max(L) \'Letzte Abgabe\' format avg(K) \'0\', avg(J) \'0\', max(L) \'dd.mm.yyyy\'",0),"Noch keine Abgaben")');
  skala_(sh, 'E19:E300');
  sh.getRange('I16').setValue('Wo hakt es? Schwächste Module zuerst').setFontWeight('bold').setFontSize(12).setFontColor(FARBE);
  sh.getRange('I17').setValue('Ø Test je Modul. Bei wenigen Abgaben noch wenig aussagekräftig.').setFontColor('#666666').setFontStyle('italic');
  sh.getRange('I18').setFormula('=IFERROR(QUERY(Daten!A2:M,"select A, B, D, E, count(D), avg(K), avg(J) where A <> \'\' and K is not null' + BED + ' group by A, B, D, E order by avg(K) asc label A \'Fach\', B \'Jg.\', D \'Modul\', E \'Titel\', count(D) \'Abgaben\', avg(K) \'Ø Test %\', avg(J) \'Ø bearbeitet %\' format avg(K) \'0\', avg(J) \'0\'",0),"Noch keine Abgaben")');
  skala_(sh, 'N19:N400');
  [30, 8, 10, 9, 10, 13, 14, 3, 11, 5, 7, 38, 9, 10, 13].forEach(function (w, i) { sh.setColumnWidth(i + 1, w * 7 + 10); });
  sh.setFrozenRows(4);
}

function baueMatrix_(ss, fach) {
  var sh = ss.getSheetByName('Matrix ' + fach); sh.clear(); sh.setConditionalFormatRules([]);
  titel_(sh, fach + ': Ø Testergebnis (%) je Klasse und Modul', 'Zeilen: Klassen. Spalten: Modulnummern. Leer: noch keine Abgabe. Ohne Namen, daher gut für Konferenzen geeignet.');
  sh.getRange('A4').setFormula('=IFERROR(QUERY(Daten!A2:M,"select C, avg(K) where A = \'' + fach + '\' and K is not null' + BED + ' group by C pivot D format avg(K) \'0\'",0),"Noch keine Abgaben")');
  skala_(sh, 'B5:AZ300'); sh.setColumnWidth(1, 90);
}

function baueLernende_(ss) {
  var sh = ss.getSheetByName('Lernende'); sh.clear(); sh.setConditionalFormatRules([]);
  titel_(sh, 'Lernende: wer hat was abgegeben?', 'Eine Zeile je Lernende/r, Fach und Klasse.');
  sh.getRange('A4').setFormula('=IFERROR(QUERY(Daten!A2:M,"select C, A, F, G, count(D), avg(K), avg(J), max(L) where A <> \'\'' + BED + ' group by C, A, F, G order by C, A, F label C \'Klasse\', A \'Fach\', F \'Name/Lerncode\', G \'E-Mail\', count(D) \'Abgaben\', avg(K) \'Ø Test %\', avg(J) \'Ø bearbeitet %\', max(L) \'Letzte Abgabe\' format avg(K) \'0\', avg(J) \'0\', max(L) \'dd.mm.yyyy\'",0),"Noch keine Abgaben")');
  skala_(sh, 'F5:F3000');
  [10, 12, 26, 34, 9, 10, 13, 14].forEach(function (w, i) { sh.setColumnWidth(i + 1, w * 7 + 10); });
}

function baueNichtFertig_(ss) {
  var sh = ss.getSheetByName('Nicht fertig'); sh.clear();
  titel_(sh, 'Abgegeben, aber nicht fertig bearbeitet (unter 100 %)', 'Für kurze Nachfragen: Wer hat abgebrochen und wo?');
  sh.getRange('A4').setFormula('=IFERROR(QUERY(Daten!A2:M,"select L, A, C, F, D, E, J, K where A <> \'\' and J < 100' + BED + ' order by L desc label L \'Eingang\', A \'Fach\', C \'Klasse\', F \'Name/Lerncode\', D \'Modul\', E \'Titel\', J \'Bearbeitet %\', K \'Test %\' format L \'dd.mm.yyyy hh:mm\'",0),"Keine")');
  [17, 12, 9, 24, 7, 40, 12, 9].forEach(function (w, i) { sh.setColumnWidth(i + 1, w * 7 + 10); });
}

function schreibeProblemstellen_(ss, prob, bereiche) {
  var sh = ss.getSheetByName('Problemstellen'); sh.clear(); sh.setConditionalFormatRules([]);
  titel_(sh, 'Problemstellen', 'Links: Mathe 8–10, Aufgabentypen im Abschlusstest mit den meisten Fehlern (ab 3 Bearbeitungen). Rechts: Geschichte, Bereiche, die in Abgaben am häufigsten noch fehlen.');
  kopf_(sh, 4, ['Jg.', 'Klasse', 'Modul', 'Titel', 'Aufgabentyp', 'Bearbeitet', 'Falsch', 'Falsch %']);
  prob.sort(function (a, b) { return Number(b[7]) - Number(a[7]); });
  if (prob.length) sh.getRange(5, 1, prob.length, 8).setValues(prob); else sh.getRange('A5').setValue('Noch zu wenige Daten.');
  var b = Object.keys(bereiche).map(function (x) { return [x, bereiche[x]]; }).sort(function (x, y) { return y[1] - x[1]; });
  sh.getRange(4, 10, 1, 2).setValues([['Geschichte: fehlender Bereich', 'Wie oft']]).setFontWeight('bold').setFontColor('#ffffff').setBackground(FARBE);
  if (b.length) sh.getRange(5, 10, b.length, 2).setValues(b); else sh.getRange('J5').setValue('Noch keine echten Abgaben.');
  [5, 8, 7, 30, 36, 10, 8, 9, 3, 40, 9].forEach(function (w, i) { sh.setColumnWidth(i + 1, w * 7 + 10); });
}

function baueHinweise_(ss) {
  var sh = ss.getSheetByName('Hinweise'); sh.clear();
  var t = [['So funktioniert diese Übersicht'], [''],
    ['• Die Tabelle holt die Abgaben automatisch aus deinen Auswertungs-Tabellen (stündlich, sofort über das Menü „SOL-Übersicht > Jetzt aktualisieren“).'],
    ['• Quellen: Mathe 5, 6, 7, Mathe 8–10 und Geschichte (alle Jahrgänge). An den Quelltabellen wird nichts verändert.'],
    ['• „Testdaten ausblenden“ auf der Übersicht blendet Abgaben aus, deren Name, E-Mail oder Klasse „Test“, „Claude“, „Codex“, „example.com“ enthält oder deren Lerncode XX ist.'],
    ['• „Ø Test %“ ist das Ergebnis im Abschlusstest. In Geschichte: Testpunkte geteilt durch Testmaximum.'],
    ['• Das Blatt „Daten“ wird bei jeder Aktualisierung neu geschrieben. Bitte dort nichts eintragen.'], [''],
    ['Datenschutz'],
    ['• Diese Tabelle enthält personenbezogene Daten (Namen, Lerncodes, E-Mail-Adressen). Nur für dich, bitte nicht freigeben.'],
    ['• Für Konferenzen und Gespräche im Kollegium eignen sich „Matrix Mathe“, „Matrix Geschichte“ und „Wo hakt es?“: Dort stehen Klassen und Module, keine Namen.'],
    ['• Alte Abgaben löschst du in den Quelltabellen. Bei der nächsten Aktualisierung verschwinden sie auch hier.'], [''],
    ['Quelltabellen']];
  sh.getRange(1, 1, t.length, 1).setValues(t);
  sh.getRange('A1').setFontSize(15).setFontWeight('bold').setFontColor(FARBE);
  sh.getRange('A9').setFontWeight('bold').setFontColor(FARBE); sh.getRange('A14').setFontWeight('bold').setFontColor(FARBE);
  QUELLEN.forEach(function (q, i) {
    sh.getRange(15 + i, 1).setFormula('=HYPERLINK("https://docs.google.com/spreadsheets/d/' + q.id + '","' + q.name + ' öffnen")');
  });
  sh.setColumnWidth(1, 900);
}
