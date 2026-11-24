/* Zentral gepflegtes Material des Monats. Nur diesen Block austauschen. */
window.EB_FEATURED = {
  label: 'Material des Monats · Oktober 2026',
  title: 'Der Klassenrat von Klasse 1 bis 10',
  description: 'Praxisheft für Niedersachsen: Ablauf, Rollen, klare Grenzen bei schwierigen Themen, Kopiervorlagen und Material für die Grundschule.',
  updated: 'Stand: 4. Oktober 2026',
  url: '/schulsozialarbeit/klassenrat/',
  linkText: 'Zum Praxisheft →'
};

/* Zwei weitere kuratierte Startseiten-Empfehlungen. */
window.EB_CURATED = [
  {
    label: 'Empfohlener Einstieg',
    title: 'Schulsozialarbeit verstehen',
    description: 'Grundlagen, professionelle Rolle und systematische Lernwege für Studium und Praxis.',
    url: '/schulsozialarbeit/#sol',
    linkText: 'SOL-Lernreihe öffnen →'
  },
  {
    label: 'Direkt einsetzbar',
    title: 'Ludgerus-Schachdiplom',
    description: 'Digitaler Lernweg in drei Stufen: Bronze, Silber, Gold. Am Ende steht ein Abschlusstest.',
    url: 'https://ludgerus-schachdiplom.netlify.app/',
    linkText: 'Diplom starten →'
  },
  {
    label: 'Neues Buch · Oktober 2026',
    title: 'Gut dokumentieren in der Schulsozialarbeit',
    description: 'Zwölf Grundsätze, sechs erfundene Fälle und konkrete Anforderungen an Dokumentationssoftware.',
    url: '/publikationen/#schulsozialarbeit',
    linkText: 'Buch ansehen →'
  }
];

document.addEventListener('DOMContentLoaded', function () {
  var f = window.EB_FEATURED;
  var card = document.querySelector('[data-featured-card]');
  if (!f || !card) return;
  var label = card.querySelector('[data-featured-label]');
  var title = card.querySelector('[data-featured-title]');
  var description = card.querySelector('[data-featured-description]');
  var updated = card.querySelector('[data-featured-updated]');
  var link = card.querySelector('[data-featured-link]');
  if (label) label.textContent = f.label;
  if (title) title.textContent = f.title;
  if (description) description.textContent = f.description;
  if (updated) updated.textContent = f.updated || '';
  if (link) { link.href = f.url; link.textContent = f.linkText; }

  var curated = window.EB_CURATED || [];
  document.querySelectorAll('[data-curated-card]').forEach(function (item, index) {
    var entry = curated[index];
    if (!entry) return;
    var itemLabel = item.querySelector('[data-curated-label]');
    var itemTitle = item.querySelector('[data-curated-title]');
    var itemDescription = item.querySelector('[data-curated-description]');
    var itemLink = item.querySelector('[data-curated-link]');
    if (itemLabel) itemLabel.textContent = entry.label;
    if (itemTitle) itemTitle.textContent = entry.title;
    if (itemDescription) itemDescription.textContent = entry.description;
    if (itemLink) {
      itemLink.href = entry.url;
      itemLink.textContent = entry.linkText;
      if (/^https?:\/\//.test(entry.url)) {
        itemLink.target = '_blank';
        itemLink.rel = 'noopener noreferrer';
      } else {
        itemLink.removeAttribute('target');
        itemLink.removeAttribute('rel');
      }
    }
  });
});
