/* Schach-Pets: Figur mit wechselnden Sprüchen in der Sprechblase.
   Einbau: <div class="sp-pet" data-pet="bauer" data-thema="einsteiger"></div>
   data-pet:   koenig | dame | laeufer | turm | bauer | zufall
   data-thema: Spruchsammlung (Standard: wie data-pet)
   Eigene Sprüche: data-sprueche="Spruch 1|Spruch 2|..."
   © Dr. Edmund Bruns, CC BY-NC 4.0 */
(function () {
  'use strict';

  var FIGUREN = {
    koenig:  'Der König',
    dame:    'Die Dame',
    laeufer: 'Der Läufer',
    turm:    'Der Turm',
    bauer:   'Der Bauer'
  };

  var SPRUECHE = {
    einsteiger: [
      'Ich bin die kleinste Figur. Aber wer bis zur letzten Reihe durchhält, wird sogar Dame!',
      'Beim ersten Zug darf ich zwei Felder nach vorn. Danach immer nur eins.',
      'Ich ziehe geradeaus, schlage aber schräg. Klingt komisch, ist aber so.',
      'Rückwärts gehe ich nie. Deshalb überlege ich jeden Zug gut.',
      'Tipp: Fang mit Schritt 1 an. Erst das Video, dann üben.',
      'Wenn du die Regeln kannst, wartet das Schachdiplom auf dich.'
    ],
    fortgeschrittene: [
      'Ich bin die stärkste Figur. Trotzdem gewinnt nicht die Kraft, sondern der Plan.',
      'Taktik-Tipp: Prüfe vor jedem Zug Schachgebote, Schlagzüge und Drohungen.',
      'Nicht zu früh mit mir losstürmen! Erst die Figuren entwickeln, dann angreifen.',
      'Im Endspiel wird der König mutig. Hol ihn in die Mitte.',
      'Eine Gabel greift zwei Figuren gleichzeitig an. Gemein, aber erlaubt.',
      'Frag dich nach jedem Zug des Gegners: Was will er eigentlich?'
    ],
    schachlehrende: [
      'Willkommen im Lehrerzimmer der Schachfiguren. Hier liegt Material für Unterricht und AG.',
      'Stundenentwürfe, Jahresplanung, Elternbrief: frei nutzbar unter CC BY-NC 4.0.',
      'Kurze Erklärphasen, viel Spielpraxis. So bleibt eine Schach-AG lebendig.',
      'Das Schach-Lehrbrett funktioniert am Whiteboard und am Beamer.',
      'Ich ziehe immer diagonal und bleibe auf meiner Feldfarbe. Verlässlich wie ein guter Plan.'
    ],
    schachweltmeister: [
      'Hier treffen sich die Könige des Schachs: alle Weltmeister und Weltmeisterinnen.',
      'Wilhelm Steinitz wurde 1886 der erste offizielle Weltmeister.',
      'Vera Menchik wurde 1927 die erste Weltmeisterin.',
      'Auch Weltmeister haben einmal mit ihrem allerersten Zug angefangen.',
      'Ich ziehe nur ein Feld pro Zug. Aber ohne mich ist das Spiel vorbei.'
    ],
    schachgeschichte: [
      'Ich bin uralt! Die Wurzeln des Schachs liegen vermutlich in Indien, vor rund 1500 Jahren.',
      'Früher war die Dame eine schwache Figur. Erst Ende des 15. Jahrhunderts wurde sie zur stärksten.',
      'Beim Rochieren ziehen König und Turm gemeinsam. Jede Seite darf das nur einmal pro Partie.',
      'Stein für Stein durch die Geschichte: Schau dir die Videoreihe an.',
      'Schach kam über Persien und die arabische Welt nach Europa.'
    ],
    verschiedenes: [
      'Hier ist alles ein bisschen anders. Lust auf ein Escape Game?',
      'Rätsel lösen trainiert den Kopf. Genau wie Schach.',
      'Schon die Schachlieder gehört? Mitsingen ist erlaubt.',
      'Schach und Mathe sind gute Freunde. Probier den Mathe-Ausflug aus.',
      'Ein Schachkrimi? Ich verrate nichts. Selber lesen!'
    ]
  };
  // Figurname als Thema: passende Standardsammlung
  SPRUECHE.bauer = SPRUECHE.einsteiger;
  SPRUECHE.dame = SPRUECHE.fortgeschrittene;
  SPRUECHE.laeufer = SPRUECHE.schachlehrende;
  SPRUECHE.koenig = SPRUECHE.schachweltmeister;
  SPRUECHE.turm = SPRUECHE.schachgeschichte;

  var INTERVALL = 9000;
  var script = document.currentScript;
  var base = script ? script.src : location.href;
  var ruhig = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function zufall(n) { return Math.floor(Math.random() * n); }

  function baue(el) {
    var keys = Object.keys(FIGUREN);
    var pet = el.getAttribute('data-pet') || 'bauer';
    if (pet === 'zufall' || !FIGUREN[pet]) pet = keys[zufall(keys.length)];
    var thema = el.getAttribute('data-thema') || pet;
    var eigene = el.getAttribute('data-sprueche');
    var liste = eigene ? eigene.split('|') : (SPRUECHE[thema] || SPRUECHE[pet]);
    if (!liste || !liste.length) return;

    var name = FIGUREN[pet];
    var idx = zufall(liste.length);

    el.innerHTML =
      '<div class="sp-bubble">' +
        '<span class="sp-name">' + name + ' sagt:</span>' +
        '<p class="sp-text" aria-live="off"></p>' +
        (liste.length > 1 ? '<button class="sp-next" type="button">Noch ein Tipp <span aria-hidden="true">›</span></button>' : '') +
      '</div>' +
      '<button class="sp-figure" type="button" aria-label="' + name + ': nächsten Spruch zeigen">' +
        '<img src="' + new URL('img/schach-pets/' + pet + '.webp', base).href + '" alt="" width="280" height="360" decoding="async">' +
      '</button>';

    var text = el.querySelector('.sp-text');
    var fig = el.querySelector('.sp-figure');
    var next = el.querySelector('.sp-next');
    var timer = null, pause = false;

    function zeige(i, vonHand) {
      idx = (i + liste.length) % liste.length;
      if (vonHand) text.setAttribute('aria-live', 'polite');
      if (ruhig) { text.textContent = liste[idx]; return; }
      text.classList.add('sp-fade');
      setTimeout(function () {
        text.textContent = liste[idx];
        text.classList.remove('sp-fade');
      }, 220);
      fig.classList.remove('sp-hop'); void fig.offsetWidth; fig.classList.add('sp-hop');
    }
    function weiter(vonHand) { zeige(idx + 1, vonHand); }

    text.textContent = liste[idx];
    fig.addEventListener('click', function () { weiter(true); neustart(); });
    if (next) next.addEventListener('click', function () { weiter(true); neustart(); });

    // Automatischer Wechsel nur, wenn sichtbar, nicht bei Hover/Fokus, nicht bei reduzierter Bewegung
    function neustart() {
      clearInterval(timer);
      if (ruhig || liste.length < 2) return;
      timer = setInterval(function () { if (!pause && !document.hidden) weiter(false); }, INTERVALL);
    }
    el.addEventListener('mouseenter', function () { pause = true; });
    el.addEventListener('mouseleave', function () { pause = false; });
    el.addEventListener('focusin', function () { pause = true; });
    el.addEventListener('focusout', function () { pause = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { pause = !e[0].isIntersecting; }).observe(el);
    }
    neustart();
  }

  function start() {
    var els = document.querySelectorAll('.sp-pet');
    for (var i = 0; i < els.length; i++) baue(els[i]);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
