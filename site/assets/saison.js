/* „Gerade passend“ auf der Startseite.
   Die Auswahl je Monat steht in materials.js (SAISON). Hier wird nur angezeigt. */
document.addEventListener('DOMContentLoaded', function () {
  var box = document.querySelector('[data-saison]');
  if (!box || typeof SAISON === 'undefined' || typeof MATERIALS === 'undefined') return;
  var monat = new Date().getMonth() + 1;
  var s = SAISON.find(function (x) { return x.monate.indexOf(monat) !== -1; });
  if (!s) { box.closest('section').hidden = true; return; }
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var titel = box.querySelector('[data-saison-titel]');
  var text = box.querySelector('[data-saison-text]');
  if (titel) titel.textContent = s.titel;
  if (text) text.textContent = s.text;
  var liste = s.m.map(function (t) { return MATERIALS.find(function (m) { return m.t === t; }); }).filter(Boolean);
  box.querySelector('[data-saison-karten]').innerHTML = liste.map(function (m) {
    var extern = /^https?:\/\//.test(m.u);
    return '<article class="curated-card">' +
      (m.img ? '<img loading="lazy" src="' + esc(m.img) + '" alt="" width="480" height="300">' : '') +
      '<span class="badge">' + esc(m.topic) + (m.year ? ' · Klasse ' + esc(m.year) : '') + '</span>' +
      '<h2>' + esc(m.t) + '</h2><p>' + esc(m.d) + '</p>' +
      '<a href="' + esc(m.u) + '"' + (extern ? ' target="_blank" rel="noopener noreferrer"' : '') + '>Öffnen →</a></article>';
  }).join('');
});
