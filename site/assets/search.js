/* Volltext-Seitensuche fuer bruns-homepage. Eigenstaendig, laedt den Index bei erster Nutzung. */
(function(){
  if (window.__ebsearch) return; window.__ebsearch = true;

  var INDEX = null, loading = false, loadErr = false;
  var HISTORY_SEARCH = [
    ['003 · Glaubensfrage und Machtkampf','https://003glaubensfrage-machtkampf.pages.dev/','Reformation Machtkampf Religion Politik'],
    ['004 · Luther und die neue Kirche','https://004neue-kirche.pages.dev/','Reformation Luther Kirche'],
    ['005 · Ursachen des Bauernkriegs','https://005bauernkrieg-ursachen.pages.dev/','Bauernkrieg Ursachen Reformation Bauern'],
    ['006 · Gewalt gegen Ungerechtigkeit?','https://006gewalt-ungerechtigkeit.pages.dev/','Bauernkrieg Gewalt Ungerechtigkeit Urteil'],
    ['007 · Der Dreißigjährige Krieg','https://007dreissigjaehriger-krieg.pages.dev/','Dreißigjähriger Krieg Ursachen Verlauf'],
    ['008 · Alltag im Krieg','https://008alltag-krieg.pages.dev/','Dreißigjähriger Krieg Alltag Menschen'],
    ['009 · Hunger und Krankheiten im Krieg','https://009hunger-krankheit.pages.dev/','Krieg Hunger Krankheit Bevölkerung'],
    ['010 · Der Westfälische Frieden','https://010westfaelischer-frieden.pages.dev/','Westfälischer Frieden Dreißigjähriger Krieg'],
    ['011 · Lerncheck Reformation und Krieg','https://011lerncheck-reformation-krieg.pages.dev/','Lerncheck Reformation Bauernkrieg Dreißigjähriger Krieg'],
    ['012 · Absolutismus verstehen','https://012absolutismus.pages.dev/','Absolutismus Herrschaft Macht'],
    ['013 · Ludwig XIV. und seine Macht','https://013ludwig-xiv.pages.dev/','Ludwig XIV Absolutismus König Macht'],
    ['014 · Alltag in der Ständegesellschaft','https://014staendegesellschaft-alltag.pages.dev/','Ständegesellschaft Adel Bürger Bauern Alltag'],
    ['015 · Versailles als Ort der Macht','https://versailles-macht.pages.dev/','Versailles Schloss Macht Absolutismus'],
    ['016 · Denker der Aufklärung','https://016aufklaerung.pages.dev/','Aufklärung Vernunft Toleranz Naturrechte Kant'],
    ['017 · Gewaltenteilung','https://017gewaltenteilung.pages.dev/','Gewaltenteilung Macht Kontrolle Aufklärung'],
    ['018 · Lerncheck Absolutismus und Aufklärung','https://018lerncheck-absolutismus-aufklaerung.pages.dev/','Lerncheck Absolutismus Aufklärung'],
    ['019 · Frankreich vor dem Staatsbankrott','https://019frankreich-pleite.pages.dev/','Frankreich pleite Staatsbankrott Revolution 1789'],
    ['020 · Die drei Stände','https://020drei-staende-gerecht.pages.dev/','Stände Ständegesellschaft Gerechtigkeit Revolution'],
    ['021 · Der Sturm auf die Bastille','https://021bastille.pages.dev/','Bastille Sturm Revolution Symbol'],
    ['022 · Menschenrechte 1789','https://022menschenrechte-1789.pages.dev/','Menschenrechte Erklärung 1789 Freiheit Gleichheit'],
    ['023 · Freiheit und Terror','https://023terror.pages.dev/','Terror Revolution Freiheit Gewalt'],
    ['024 · Die Hinrichtung des Königs','https://024hinrichtung-koenig.pages.dev/','Hinrichtung König Ludwig XVI Revolution'],
    ['025 · Napoleon und die Revolution','https://025napoleon.pages.dev/','Napoleon Revolution Diktatur Rechte'],
    ['026 · Das Erbe der Revolution','https://026erbe-revolution.pages.dev/','Erbe Folgen Revolution Menschenrechte'],
    ['027 · Lerncheck Französische Revolution','https://027lerncheck-revolution.pages.dev/','Lerncheck Französische Revolution Ursachen Folgen']
  ].map(function (m) { return {t:m[0],u:m[1],a:'Geschichte · Jahrgang 7',k:m[2],b:'Interaktives SOL-Geschichtsmodul mit drei Lernwegen, Quellenarbeit, Lerncheck und historischer Urteilsbildung.',x:true}; });

  var CSS = '\
  .ebsearch-open{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-left:auto;min-height:40px;padding:0 14px;border:1px solid rgba(24,48,44,.18);border-radius:999px;background:rgba(255,255,255,.55);color:#18302c;font:inherit;font-weight:650;cursor:pointer;transition:background .16s,border-color .16s,transform .16s;}\
  .ebsearch-open:hover{background:#18302c;color:#fff;border-color:#18302c;transform:translateY(-1px);}\
  .ebsearch-open svg{width:16px;height:16px;}\
  .ebsearch-open .ebsearch-lbl{font-size:.92rem;}\
  @media(max-width:640px){.ebsearch-open .ebsearch-lbl{display:none;} .ebsearch-open{padding:0 11px;}}\
  .ebsearch-modal{position:fixed;inset:0;z-index:1000;display:none;align-items:flex-start;justify-content:center;padding:12vh 18px 18px;background:rgba(16,28,24,.42);backdrop-filter:blur(6px);}\
  .ebsearch-modal.open{display:flex;}\
  .ebsearch-panel{width:min(660px,100%);background:#fffdf8;border:1px solid rgba(24,48,44,.15);border-radius:20px;box-shadow:0 30px 80px rgba(16,28,24,.32);overflow:hidden;display:flex;flex-direction:column;max-height:80vh;}\
  .ebsearch-bar{display:flex;align-items:center;gap:10px;padding:14px 16px;border-bottom:1px solid rgba(24,48,44,.12);}\
  .ebsearch-bar svg{width:20px;height:20px;color:#697771;flex:none;}\
  .ebsearch-bar input{flex:1;border:0;background:transparent;font:inherit;font-size:1.1rem;color:#18302c;outline:none;}\
  .ebsearch-close{border:0;background:transparent;font-size:1.2rem;line-height:1;color:#697771;cursor:pointer;padding:6px;border-radius:8px;}\
  .ebsearch-close:hover{background:rgba(24,48,44,.08);color:#18302c;}\
  .ebsearch-results{list-style:none;margin:0;padding:6px;overflow:auto;}\
  .ebsearch-results li{margin:0;}\
  .ebsearch-results a{display:block;padding:11px 12px;border-radius:12px;text-decoration:none;color:#18302c;}\
  .ebsearch-results a:hover,.ebsearch-results a.sel{background:#eef2ec;}\
  .ebsearch-row{display:flex;align-items:center;gap:12px;}\
  .ebsearch-ttl{font-weight:700;}\
  .ebsearch-chip{margin-left:auto;flex:none;font-size:.72rem;font-weight:800;color:#405d28;background:#e7ecd9;border-radius:999px;padding:3px 10px;white-space:nowrap;}\
  .ebsearch-ext{flex:none;color:#697771;font-size:.9rem;}\
  .ebsearch-snip{display:block;font-size:.85rem;color:#5c665f;margin-top:3px;line-height:1.4;}\
  .ebsearch-snip mark{background:#f4e6d2;color:#7a4a12;padding:0 1px;border-radius:3px;}\
  .ebsearch-hint{padding:10px 16px 14px;font-size:.82rem;color:#8a938d;border-top:1px solid rgba(24,48,44,.08);}\
  .ebsearch-empty{padding:22px 16px;color:#697771;text-align:center;}';

  var ICON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-3.2-3.2"></path></svg>';

  var style=document.createElement('style'); style.textContent=CSS; document.head.appendChild(style);

  var nav=document.querySelector('.site-header .nav')||document.querySelector('header .nav')||document.querySelector('.nav');
  var openBtn=document.createElement('button');
  openBtn.type='button'; openBtn.className='ebsearch-open'; openBtn.setAttribute('aria-label','Suche oeffnen');
  openBtn.innerHTML=ICON+'<span class="ebsearch-lbl">Suche</span>';
  if(nav){ nav.appendChild(openBtn); }

  var modal=document.createElement('div');
  modal.className='ebsearch-modal'; modal.setAttribute('role','dialog'); modal.setAttribute('aria-modal','true'); modal.setAttribute('aria-label','Suche');
  modal.innerHTML='<div class="ebsearch-panel"><div class="ebsearch-bar">'+ICON+'<input type="search" autocomplete="off" placeholder="Volltextsuche ueber die ganze Seite ..." aria-label="Suchbegriff"><button class="ebsearch-close" aria-label="Schliessen">&times;</button></div><ul class="ebsearch-results"></ul><div class="ebsearch-hint">Durchsucht alle Seiten, Bereiche und Lernmodule. Pfeiltasten waehlen, Enter oeffnet, Esc schliesst.</div></div>';
  document.body.appendChild(modal);

  var input=modal.querySelector('input');
  var list=modal.querySelector('.ebsearch-results');
  var closeBtn=modal.querySelector('.ebsearch-close');
  var sel=-1, current=[];

  function norm(s){ return (s||'').toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss'); }
  function esc(s){ return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function score(item, tokens){
    var t=norm(item.t), k=norm(item.k), a=norm(item.a), b=norm(item.b||''), s=0, allHit=true;
    for(var i=0;i<tokens.length;i++){ var tok=tokens[i]; if(!tok) continue;
      var hit=false;
      if(t.indexOf(tok)>-1){ s+=6; hit=true; }
      if(a.indexOf(tok)>-1){ s+=3; hit=true; }
      if(k.indexOf(tok)>-1){ s+=2; hit=true; }
      if(b.indexOf(tok)>-1){ s+=2; hit=true; var n=b.split(tok).length-1; if(n>1) s+=Math.min(n-1,3)*0.5; }
      if(!hit) allHit=false;
    }
    if(allHit && tokens.length>1) s+=2;
    return s;
  }

  function snippet(item, tokens){
    var body=item.b||''; if(!body) return '';
    var low=body.toLowerCase(); var pos=-1;
    for(var i=0;i<tokens.length;i++){ var uml=tokens[i].replace(/ae/g,'ä').replace(/oe/g,'ö').replace(/ue/g,'ü'); var p=low.indexOf(uml); if(p<0) p=low.indexOf(tokens[i]); if(p>-1){ pos=p; break; } }
    if(pos<0) return esc(body.slice(0,150))+(body.length>150?' …':'');
    var start=Math.max(0,pos-60), end=Math.min(body.length,pos+90);
    var pre=(start>0?'… ':''), post=(end<body.length?' …':'');
    var seg=esc(body.slice(start,end));
    tokens.forEach(function(tok){
      if(!tok) return;
      try{ var re=new RegExp('('+tok.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'); seg=seg.replace(re,'<mark>$1</mark>'); }catch(e){}
      var uml=tok.replace(/ae/g,'ä').replace(/oe/g,'ö').replace(/ue/g,'ü');
      if(uml!==tok){ try{ var re2=new RegExp('('+uml.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'); seg=seg.replace(re2,'<mark>$1</mark>'); }catch(e){} }
    });
    return pre+seg+post;
  }

  function render(q){
    var tokens=norm(q).split(/\s+/).filter(Boolean);
    if(loading){ list.innerHTML='<li class="ebsearch-empty">Suche wird vorbereitet …</li>'; return; }
    if(loadErr){ list.innerHTML='<li class="ebsearch-empty">Der Suchindex konnte nicht geladen werden.</li>'; return; }
    if(!tokens.length){ current=[]; list.innerHTML='<li class="ebsearch-empty">Gib einen Begriff ein. Zum Beispiel: Prozent, Pythagoras, Schach, Holz, Labyrinth.</li>'; sel=-1; return; }
    var scored=INDEX.map(function(it){return {it:it,s:score(it,tokens)};}).filter(function(r){return r.s>0;});
    scored.sort(function(a,b){return b.s-a.s;});
    current=scored.slice(0,12).map(function(r){return r.it;});
    if(!current.length){ list.innerHTML='<li class="ebsearch-empty">Keine Treffer. Versuche einen anderen Begriff.</li>'; sel=-1; return; }
    list.innerHTML=current.map(function(it){
      var ext=it.x?' <span class="ebsearch-ext" title="oeffnet in neuem Tab">&#8599;</span>':'';
      var tgt=it.x?' target="_blank" rel="noopener"':'';
      var snip=snippet(it,tokens); if(!snip) snip=esc(it.k||'');
      return '<li><a href="'+it.u+'"'+tgt+'><span class="ebsearch-row"><span class="ebsearch-ttl">'+esc(it.t)+'</span>'+ext+'<span class="ebsearch-chip">'+esc(it.a.split(' ')[0])+'</span></span><span class="ebsearch-snip">'+snip+'</span></a></li>';
    }).join('');
    sel=0; mark();
  }
  function mark(){ var as=list.querySelectorAll('a'); for(var i=0;i<as.length;i++) as[i].classList.toggle('sel', i===sel); if(as[sel]) as[sel].scrollIntoView({block:'nearest'}); }

  function ensureIndex(){
    if(INDEX||loading) return;
    loading=true; render('');
    fetch('/assets/search-index.json?v=20260728-6').then(function(r){ return r.json(); }).then(function(data){
      INDEX=data.concat(HISTORY_SEARCH); loading=false; render(input.value);
    }).catch(function(){ loading=false; loadErr=true; render(input.value); });
  }

  function open(){ modal.classList.add('open'); document.documentElement.style.overflow='hidden'; input.value=''; sel=-1; ensureIndex(); render(''); setTimeout(function(){input.focus();},30); }
  function close(){ modal.classList.remove('open'); document.documentElement.style.overflow=''; if(openBtn) openBtn.focus(); }

  openBtn.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  modal.addEventListener('click', function(e){ if(e.target===modal) close(); });
  input.addEventListener('input', function(){ render(input.value); });
  input.addEventListener('keydown', function(e){
    if(e.key==='ArrowDown'){ e.preventDefault(); if(current.length){ sel=(sel+1)%current.length; mark(); } }
    else if(e.key==='ArrowUp'){ e.preventDefault(); if(current.length){ sel=(sel-1+current.length)%current.length; mark(); } }
    else if(e.key==='Enter'){ var a=list.querySelectorAll('a')[sel]; if(a){ if(a.target==='_blank'){ window.open(a.href,'_blank','noopener'); } else { window.location.href=a.href; } } }
    else if(e.key==='Escape'){ close(); }
  });
  document.addEventListener('keydown', function(e){
    if((e.key==='/' || (e.key.toLowerCase()==='k' && (e.metaKey||e.ctrlKey))) && !modal.classList.contains('open')){
      var tag=(document.activeElement&&document.activeElement.tagName)||''; if(tag==='INPUT'||tag==='TEXTAREA') return;
      e.preventDefault(); open();
    }
  });
})();
