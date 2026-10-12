// Gemeinsame Interaktionen für alle Bereiche
document.querySelectorAll('.menu-button').forEach(btn => {
  btn.addEventListener('click', () => {
    const nav = btn.closest('.nav');
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});

const header = document.getElementById('siteHeader');
if (header) {
  addEventListener('scroll', () => {
    header.classList.toggle('scrolled', scrollY > 12);
  }, { passive: true });
}

document.querySelectorAll('[data-year]:not(body)').forEach(el => {
  el.textContent = new Date().getFullYear();
});

// Zentrale Einstiege auf allen Unterseiten
document.querySelectorAll('.site-header .nav').forEach(nav => {
  if (nav.querySelector('.global-sections')) return;
  const links = document.createElement('div');
  links.className = 'global-sections';
  links.setAttribute('aria-label', 'Zentrale Bereiche');
  const items = [
    ['/materialfinder/', 'Materialfinder']
  ];
  items.forEach(([href, label]) => {
    const a = document.createElement('a');
    a.href = href;
    a.textContent = label;
    if (location.pathname === href) a.setAttribute('aria-current', 'page');
    links.appendChild(a);
  });
  const home = nav.querySelector('.nav-home');
  if (home) home.insertAdjacentElement('afterend', links);
  else nav.appendChild(links);
});


// Fehlt eine lokale Bilddatei, automatisch die Original-Quelle laden
document.querySelectorAll('img[data-fallback]').forEach(img => {
  img.addEventListener('error', function () {
    if (img.dataset.fbDone) return;
    img.dataset.fbDone = "1";
    img.src = img.getAttribute('data-fallback');
  }, { once: true });
});
