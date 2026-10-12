/* UX-Layer: Dunkelmodus, einfache Ansicht, PWA-Registrierung. Eigenstaendig. */
(function(){
  if (window.__ebux) return; window.__ebux = true;
  var doc = document.documentElement;
  var LS = { get:function(k){ try{return localStorage.getItem(k);}catch(e){return null;} }, set:function(k,v){ try{localStorage.setItem(k,v);}catch(e){} } };

  var CSS = '\
  .ebux{display:inline-flex;gap:6px;margin-left:8px;}\
  .ebux-btn{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border:1px solid rgba(24,48,44,.18);border-radius:999px;background:rgba(255,255,255,.55);color:#18302c;font:inherit;font-weight:750;cursor:pointer;transition:background .16s,border-color .16s,transform .16s;}\
  .ebux-btn:hover{background:#18302c;color:#fff;border-color:#18302c;transform:translateY(-1px);}\
  .ebux-btn svg{width:18px;height:18px;}\
  html[data-theme="dark"] .ebux-btn{background:rgba(255,255,255,.06);border-color:rgba(220,235,228,.2);color:#e7efe9;}\
  html[data-theme="dark"] .ebux-btn:hover{background:#e7efe9;color:#0f1c1a;}\
  .ebux-btn[aria-pressed="true"]{background:#18302c;color:#fff;border-color:#18302c;}';
  var st=document.createElement('style'); st.textContent=CSS; document.head.appendChild(st);

  var SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4"/></svg>';
  var MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  var nav = document.querySelector('.site-header .nav') || document.querySelector('header .nav') || document.querySelector('.nav');
  if(!nav) return;
  var wrap=document.createElement('div'); wrap.className='ebux';

  var themeBtn=document.createElement('button');
  themeBtn.type='button'; themeBtn.className='ebux-btn';
  function paintTheme(){ var dark=doc.dataset.theme==='dark'; themeBtn.innerHTML=dark?SUN:MOON; themeBtn.setAttribute('aria-label', dark?'Zum hellen Modus wechseln':'Zum dunklen Modus wechseln'); themeBtn.title=themeBtn.getAttribute('aria-label'); }
  themeBtn.addEventListener('click', function(){ var dark=doc.dataset.theme!=='dark'; if(dark){doc.dataset.theme='dark';LS.set('eb-theme','dark');}else{delete doc.dataset.theme;LS.set('eb-theme','light');} paintTheme(); });
  paintTheme();

  var readBtn=document.createElement('button');
  readBtn.type='button'; readBtn.className='ebux-btn'; readBtn.innerHTML='Aa'; readBtn.style.fontFamily='Georgia,serif';
  function paintRead(){ var on=doc.dataset.reading==='easy'; readBtn.setAttribute('aria-pressed', on?'true':'false'); readBtn.setAttribute('aria-label', on?'Einfache Ansicht ausschalten':'Einfache Ansicht: größere Schrift'); readBtn.title=readBtn.getAttribute('aria-label'); }
  readBtn.addEventListener('click', function(){ var on=doc.dataset.reading!=='easy'; if(on){doc.dataset.reading='easy';LS.set('eb-reading','easy');}else{delete doc.dataset.reading;LS.set('eb-reading','off');} paintRead(); });
  paintRead();

  wrap.appendChild(themeBtn); wrap.appendChild(readBtn); nav.appendChild(wrap);

  if('serviceWorker' in navigator){ window.addEventListener('load', function(){ navigator.serviceWorker.register('/sw.js').catch(function(){}); }); }
})();

/* Externe Links barrierefrei kennzeichnen. Eigenstaendig, laeuft nach dem Laden. */
(function(){
  function run(){
    if (window.__ebext) return; window.__ebext = true;
    var host = location.host;
    var links = document.querySelectorAll('a[href]');
    for (var i=0;i<links.length;i++){
      var a = links[i];
      var href = a.getAttribute('href') || '';
      if (!/^https?:\/\//i.test(href)) continue;
      if (!a.hostname || a.hostname === host) continue;   // nur echte externe Ziele
      if (a.dataset.extDone) continue; a.dataset.extDone = '1';
      if (!/\bnoopener\b/.test(a.rel)) a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener';
      var neu = a.target === '_blank';
      var sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = neu ? ' (öffnet ein externes Angebot in einem neuen Tab)' : ' (externer Link)';
      a.appendChild(sr);
      var skip = /\b(btn|card|chip|brand|tile|module-card|logo)\b/.test(a.className) || a.querySelector('img,svg');
      if (!skip) a.classList.add('ext-ind');
      if (neu && !a.title) a.title = 'Öffnet ein externes Angebot in einem neuen Tab';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
