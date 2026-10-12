(function () {
  const n = Number(document.body.dataset.schoolYear || document.body.dataset.year);
  const y = GESCHICHTE_JAHRGAENGE[n];
  const root = document.querySelector('#modules');
  const standard = '50–60 Minuten · drei Lernwege · Quellenarbeit · historisches Urteil';
  const lerncheck = '50–60 Minuten · drei Lernwege · Lerncheck · historisches Urteil';
  const external = (url, blurb = standard) => ({ url, blurb, cta: 'Modul öffnen', ext: true });
  const LIVE = {
    '6-1': external('https://001mittelalterliche-welt.pages.dev/', '50–60 Minuten · drei Lernwege · Übergang von der Antike zum Mittelalter · Quellenarbeit an Gregor von Tours'),
    '6-2': external('https://002grundherrschaft.pages.dev/', '50–60 Minuten · drei Lernwege · Schutz und Land gegen Abgaben und Dienste · Quellenarbeit am Prümer Urbar'),
    '6-3': external('https://003leben-auf-dem-land.pages.dev/', '50–60 Minuten · drei Lernwege · Dorfgemeinschaft, Allmende und Dreifelderwirtschaft · Arbeit mit Monatsbildern'),
    '6-4': { url: '/geschichte/klasse-6/004/', blurb: '45–60 Minuten · drei Lernwege · Ermittlungsauftrag · Quelle Widukind I,35 · Burg als Ort von Schutz und Herrschaft', cta: 'Modul öffnen' },

    '6-5': { url: '/geschichte/klasse-6/005/', blurb: '45–60 Minuten · drei Lernwege · Kartenarbeit · Urkunde Freiburg 1120 · Merksatz auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-6': { url: '/geschichte/klasse-6/006/', blurb: '45–60 Minuten · drei Lernwege · Klosterplan · Benediktsregel · Merkspruch ora et labora auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-7': { url: '/geschichte/klasse-6/007/', blurb: '45–60 Minuten · drei Lernwege · Karte der Begegnung · Übersetzer von Toledo · Aussage über Al-Andalus auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-8': { url: '/geschichte/klasse-6/008/', blurb: '45–60 Minuten · Lerncheck über die Module 001–007 · Landschaftskarte · Quellen- und Merksatzkritik · das finstere Mittelalter auf dem Prüfstand', cta: 'Lerncheck öffnen' },
    '6-9': { url: '/geschichte/klasse-6/009/', blurb: '45–60 Minuten · drei Lernwege · Italien-Karte · Quelle Pico Würde des Menschen 1486 · Renaissance auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-10': { url: '/geschichte/klasse-6/010/', blurb: '45–60 Minuten · drei Lernwege · Druckwerkstatt · Gutenberg-Bibel als Sachquelle · Erfinderfrage auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-11': { url: '/geschichte/klasse-6/011/', blurb: '45–60 Minuten · drei Lernwege · Ausrüstung & Karavelle · Cantino-Karte als Kartenquelle · Kolumbus-Mythos auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-12': { url: '/geschichte/klasse-6/012/', blurb: '45–60 Minuten · drei Lernwege · Kolumbianischer Austausch · Bericht des Las Casas als Textquelle · Entdeckung oder Begegnung', cta: 'Modul öffnen' },
    '6-13': { url: '/geschichte/klasse-6/013/', blurb: '45–60 Minuten · drei Lernwege · Dreieckshandel · Bericht des Equiano als Textquelle · Reichtum für alle auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-14': { url: '/geschichte/klasse-6/014/', blurb: '45–60 Minuten · drei Lernwege · Handelskompanien · Aktie der VOC als Sachquelle · Fortschritt für die Kolonien auf dem Prüfstand', cta: 'Modul öffnen' },
    '6-15': { url: '/geschichte/klasse-6/015/', blurb: '45–60 Minuten · Abschluss-Lerncheck · Zeitleiste · Quellenarten wiederholen · Merksätze kritisch prüfen', cta: 'Modul öffnen' },
    '7-1': { url: '/geschichte/klasse-7/001/', blurb: standard, cta: 'Modul öffnen' },
    '7-2': external('https://002gedanken-gehen-auf-reisen.pages.dev/', '50–60 Minuten · drei Lernwege · Verbreitung der Reformation · Quellen- und Medienarbeit'),
    '7-3': external('https://003glaubensfrage-machtkampf.pages.dev/'),
    '7-4': external('https://004neue-kirche.pages.dev/'),
    '7-5': external('https://005bauernkrieg-ursachen.pages.dev/'),
    '7-6': external('https://006gewalt-ungerechtigkeit.pages.dev/'),
    '7-7': external('https://007dreissigjaehriger-krieg.pages.dev/'),
    '7-8': external('https://008alltag-krieg.pages.dev/'),
    '7-9': external('https://009hunger-krankheit.pages.dev/'),
    '7-10': external('https://010westfaelischer-frieden.pages.dev/'),
    '7-11': external('https://011lerncheck-reformation-krieg.pages.dev/', lerncheck),
    '7-12': external('https://012absolutismus.pages.dev/'),
    '7-13': external('https://013ludwig-xiv.pages.dev/'),
    '7-14': external('https://014staendegesellschaft-alltag.pages.dev/'),
    '7-15': external('https://versailles-macht.pages.dev/'),
    '7-16': external('https://016aufklaerung.pages.dev/'),
    '7-17': external('https://017gewaltenteilung.pages.dev/'),
    '7-18': external('https://018lerncheck-absolutismus-aufklaerung.pages.dev/', lerncheck),
    '7-19': external('https://019frankreich-pleite.pages.dev/'),
    '7-20': external('https://020drei-staende-gerecht.pages.dev/'),
    '7-21': external('https://021bastille.pages.dev/'),
    '7-22': external('https://022menschenrechte-1789.pages.dev/'),
    '7-23': external('https://023terror.pages.dev/'),
    '7-24': external('https://024hinrichtung-koenig.pages.dev/'),
    '7-25': external('https://025napoleon.pages.dev/'),
    '7-26': external('https://026erbe-revolution.pages.dev/'),
    '7-27': external('https://027lerncheck-revolution.pages.dev/', lerncheck),
    '9-17': { url: 'https://edmundbruns.github.io/emslandlager/', blurb: 'Digitale Lernreise zu den Emslandlagern, regionaler Geschichte und Erinnerungskultur.', cta: 'Lernreise öffnen', ext: true }
  };

  document.title = `SOL Geschichte · Jahrgang ${n} | Dr. Edmund Bruns`;
  document.querySelector('#year').textContent = n;
  document.querySelector('#summary').textContent = y.summary;
  document.querySelector('#count').textContent = y.modules.length;

  for (const [name, start, end] of y.groups) {
    const h = document.createElement('h2');
    h.className = 'block-title';
    h.textContent = name;
    root.append(h);
    const grid = document.createElement('div');
    grid.className = 'cards auto';
    for (let i = start; i <= end; i++) {
      const info = LIVE[n + '-' + i];
      const a = document.createElement('article');
      a.className = 'card accent-top module-card' + (info ? '' : ' future');
      a.innerHTML = `<div class="module-number">MODUL ${String(i).padStart(3, '0')}</div><div class="tags"><span class="${info ? 'badge' : 'tag plain'}">${info ? 'verfügbar' : 'in Vorbereitung'}</span></div><h3>${y.modules[i - 1]}</h3><p>${info ? info.blurb : 'Das Modul wird in der vorgesehenen Reihenfolge ergänzt.'}</p><div class="links">${info ? `<a class="btn" href="${info.url}"${info.ext ? ' target="_blank" rel="noopener"' : ''}>${info.cta}</a>` : '<span class="btn disabled">Folgt</span>'}</div>`;
      grid.append(a);
    }
    root.append(grid);
  }
})();
