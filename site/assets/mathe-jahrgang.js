(function(){
  const n=Number(document.body.dataset.schoolYear||document.body.dataset.year);
  const y=MATHE_JAHRGAENGE[n];
  const root=document.querySelector('#modules');
  if(!y||!root)return;
  document.title=`SOL Mathematik · Klasse ${n} | Dr. Edmund Bruns`;
  const yearEl=document.querySelector('#year'); if(yearEl) yearEl.textContent=n;
  const sumEl=document.querySelector('#summary'); if(sumEl) sumEl.textContent=y.summary;
  const cntEl=document.querySelector('#count'); if(cntEl) cntEl.textContent=y.modules.length;
  const links=y.links||{};
  for(const [name,start,end] of y.groups){
    const h=document.createElement('h2'); h.className='block-title'; h.textContent=name; root.append(h);
    const grid=document.createElement('div'); grid.className='cards auto';
    for(let i=start;i<=end;i++){
      const num=String(i).padStart(3,'0');
      const url=links[i];
      const a=document.createElement('article');
      if(url){
        a.className='card accent-top module-card';
        a.innerHTML=`<div class="module-number">MODUL ${num}</div><div class="tags"><span class="tag">verfügbar</span></div><h3>${y.modules[i-1]}</h3><p>Interaktives SOL-Modul mit Erklärung, drei Lernwegen, Übungen, Lerncheck und Rückmeldung.</p><div class="links"><a class="btn" href="${url}">Modul öffnen</a></div>`;
      }else{
        a.className='card accent-top module-card future';
        a.innerHTML=`<div class="module-number">MODUL ${num}</div><div class="tags"><span class="tag plain">in Vorbereitung</span></div><h3>${y.modules[i-1]}</h3><p>Das interaktive SOL-Modul wird in dieser Reihenfolge ergänzt. Es erhält Erklärungen, drei Lernwege, Übungen, Lerncheck und Rückmeldung.</p><div class="links"><span class="btn disabled">Folgt</span></div>`;
      }
      grid.append(a);
    }
    root.append(grid);
  }
})();
