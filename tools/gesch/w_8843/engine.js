const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const T=CFG.tasks, TK={}; T.forEach(t=>{TK[t.id]=t;if(t.score===undefined)t.score=true;});
const S={lernweg:"standard",done:{},punkte:{},t:{},sent:false};
function st(id){return S.t[id]||(S.t[id]={});}

/* ---------- Hilfsfunktionen ---------- */
function fb(id,msg,art){const e=$(id);if(!e)return;e.textContent=msg;e.className="fb show "+(art||"hint");}
function fbClear(id){const e=$(id);if(e){e.className="fb";e.textContent="";}}
function norm(t){return String(t||"").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ß/g,"ss").toLowerCase().trim();}
function hat(t,liste){return liste.some(w=>t.includes(norm(w)));}
function saetze(t){return t.split(/[.!?]+/).filter(s=>s.trim().length>8).length;}
function woerter(t){return t.split(/\s+/).filter(Boolean).length;}
const VERKN=["weil","denn","deshalb","deswegen","dadurch","damit","sodass","so dass","darum","daher","also","dazu","trotzdem","aber","obwohl","wodurch"];
function mische(n){let a;do{a=[...Array(n).keys()].sort(()=>Math.random()-.5);}while(a.every((v,i)=>v===i));return a;}

/* ---------- Fortschritt und Abzeichen ---------- */
const PFLICHT=T.filter(t=>t.score&&t.lw!=="weiter").map(t=>t.id);
const SCHRITTE=["start","diagnose",...PFLICHT,"lerncheck","a2"];
function fortschritt(){
 const n=SCHRITTE.filter(k=>S.done[k]).length, pct=Math.round(n/SCHRITTE.length*100);
 $("#pfill").style.width=pct+"%"; $("#pbar").setAttribute("aria-valuenow",pct);
 $("#ptext").textContent=n+" von "+SCHRITTE.length+" Schritten";
 CFG.badges.forEach((liste,k)=>{const e=$("#abz"+(k+1));if(e)e.classList.toggle("on",liste.every(id=>id==="a2"?(S.punkte.a2||0)>=1:!!S.done[id]));});
}
function fertig(k,p){S.done[k]=true;if(p!==undefined)S.punkte[k]=p;fortschritt();speichern();}
function geloest(t,p,msg){S.done[t.id]=true;S.punkte[t.id]=p;st(t.id).msg=msg;fb("#fb-"+t.id,msg+abzText(t.id),"ok");fortschritt();speichern();}
function abzText(id){
 let s="";CFG.badges.forEach((liste,k)=>{if(liste[liste.length-1]===id&&liste.every(x=>!!S.done[x]))s=" Abzeichen „"+CFG.badgeMsg[k]+"“ freigeschaltet.";});
 return s;
}
function offen(t){delete S.done[t.id];delete S.punkte[t.id];delete st(t.id).msg;fortschritt();speichern();}

/* ---------- Lernweg ---------- */
function setLernweg(w){
 S.lernweg=w;
 document.body.classList.remove("lw-sicher","lw-standard","lw-weiter");
 document.body.classList.add("lw-"+w);
 $$("[data-lwbtn]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.lwbtn===w)));
 $("#lwInfo").textContent={
  sicher:"Sicher werden: Du bekommst zusätzliche Hilfen und Satzanfänge. Einige Zusatzaufgaben werden ausgeblendet.",
  standard:"Standard: ausgewogene Mischung aus Erklärung und eigener Arbeit.",
  weiter:"Weiterdenken: "+CFG.lwWeiter}[w];
 speichern();
}
$$("[data-lwbtn]").forEach(b=>b.addEventListener("click",()=>setLernweg(b.dataset.lwbtn)));

/* ---------- Start und Pflichtfelder ---------- */
function klasseOk(v){
 const t=norm(v).replace(/[^a-z0-9]/g,"");
 if(!t)return{ok:false,msg:"Bitte trage deine Klasse ein, zum Beispiel 5a."};
 const m=t.match(/(?:^|[^0-9])5([a-z]?)$/);
 if(!m)return{ok:false,msg:"Diese Klasse gehört nicht zu Jahrgang 5. Schreibe zum Beispiel 5a, Klasse 5b oder nur 5."};
 return{ok:true,wert:"5"+(m[1]||"")};
}
function pflichtOk(zeigen){
 const n=$("#name").value.trim(), e=$("#email"), k=klasseOk($("#klasse").value);
 if(!n){if(zeigen)fb("#startFb","Bitte trage deinen Namen oder deinen Lerncode ein.","bad");return false;}
 if(!k.ok){if(zeigen)fb("#startFb",k.msg,"bad");return false;}
 if(!e.value.trim()){if(zeigen)fb("#startFb","Bitte trage deine E-Mail-Adresse ein, zum Beispiel name@schule.de.","bad");return false;}
 if(!e.checkValidity()){if(zeigen)fb("#startFb","Die E-Mail-Adresse sieht nicht vollständig aus. Sie braucht ein @ und einen Punkt, zum Beispiel name@schule.de.","bad");return false;}
 return true;
}
$("#startBtn").addEventListener("click",()=>{
 if(!pflichtOk(true))return;
 fertig("start");
 fb("#startFb","Alles bereit. Chronos wartet schon. Es geht weiter mit der Mission.","ok");
 location.hash="mission";
});

/* ---------- Startdiagnose ---------- */
$("#dCheck").addEventListener("click",()=>{
 const g=n=>(document.querySelector('input[name="'+n+'"]:checked')||{}).value;
 if(CFG.diag.some((r,i)=>!g("d"+(i+1)))){fb("#dFb","Bitte beantworte zuerst alle drei Fragen. Raten ist ausdrücklich erlaubt.","hint");return;}
 const r=CFG.diag.filter((x,i)=>g("d"+(i+1))===x).length;
 let m=r===3?"Drei von drei. Deine Vermutungen passen schon gut. Der Lernweg Weiterdenken könnte für dich spannend sein.":
  r===2?"Zwei von drei. Eine gute Grundlage. Im Modul findest du heraus, was bei der dritten Frage stimmt.":
  "Du hast "+r+" von drei getroffen. Das ist völlig in Ordnung, genau dafür ist das Modul da. Der Lernweg Sicher werden gibt dir mehr Hilfen.";
 CFG.diag.forEach((x,i)=>{if(g("d"+(i+1))!==x&&CFG.diagMsg[i])m+=" "+CFG.diagMsg[i];});
 fb("#dFb",m,r>=2?"ok":"hint");
 fertig("diagnose");
});

/* ---------- Auswahlaufgaben ---------- */
function wert(n){return(document.querySelector('input[name="'+n+'"]:checked')||{}).value;}
function pruefeSingle(t){
 const v=wert(t.id);
 if(!v){fb("#fb-"+t.id,"Bitte wähle zuerst eine Antwort aus.","hint");return;}
 if(v===t.right)geloest(t,1,t.ok);
 else{st(t.id).fehl=(st(t.id).fehl||0)+1;fb("#fb-"+t.id,(t.fb&&t.fb[v])||t.hint,"hint");speichern();}
}
function pruefeMulti(t){
 const sel=$$('input[name="'+t.id+'"]:checked').map(i=>i.value);
 if(!sel.length){fb("#fb-"+t.id,"Bitte wähle zuerst mindestens eine Antwort aus.","hint");return;}
 const fehlt=t.right.filter(x=>!sel.includes(x)), zuviel=sel.filter(x=>!t.right.includes(x));
 if(!fehlt.length&&!zuviel.length){geloest(t,1,t.ok);return;}
 let m="";
 zuviel.forEach(z=>{if(t.wrongfb&&t.wrongfb[z])m+=t.wrongfb[z]+" ";});
 if(fehlt.length)m+="Es "+(fehlt.length===1?"fehlt noch eine zutreffende Antwort. ":"fehlen noch "+fehlt.length+" zutreffende Antworten. ");
 st(t.id).fehl=(st(t.id).fehl||0)+1;
 fb("#fb-"+t.id,(m+(t.hint||"")).trim(),"hint");speichern();
}

/* ---------- Zuordnung mit Ziehen oder Antippen ---------- */
let gew=null;
function karteHtml(t,k){return '<button type="button" class="piece" draggable="true" data-task="'+t.id+'" data-k="'+k+'" aria-pressed="false">'+t.cards[k][0]+'</button>';}
function zeichneZuord(t){
 const pl=st(t.id).placed||(st(t.id).placed={});
 const offenK=t.cards.map((c,k)=>k).filter(k=>pl[k]===undefined);
 $("#pc-"+t.id).innerHTML=offenK.map(k=>karteHtml(t,k)).join("")||'<span class="hint">Alle Karten sind zugeordnet. Du kannst eine Karte antippen und neu ablegen.</span>';
 $$('.zone[data-task="'+t.id+'"] .drop').forEach(d=>d.innerHTML="");
 t.cards.forEach((c,k)=>{const z=pl[k];if(z!==undefined){const d=document.querySelector('.zone[data-task="'+t.id+'"][data-zone="'+z+'"] .drop');if(d)d.insertAdjacentHTML("beforeend",karteHtml(t,k));}});
 $$('.piece[data-task="'+t.id+'"]').forEach(p=>{
  p.addEventListener("click",e=>{
   e.stopPropagation();
   const k=+p.dataset.k;
   if(gew&&gew.t===t.id&&gew.k===k){gew=null;p.setAttribute("aria-pressed","false");return;}
   if(gew&&gew.t===t.id&&pl[k]!==undefined){ablegen(t,pl[k]);return;}
   $$(".piece").forEach(x=>x.setAttribute("aria-pressed","false"));
   gew={t:t.id,k:k};p.setAttribute("aria-pressed","true");
   fb("#fb-"+t.id,"Karte ausgewählt. Tippe jetzt auf das Feld, in das sie gehört. Mit der Tastatur: Feld anspringen und Eingabetaste drücken.","hint");
  });
  p.addEventListener("dragstart",e=>{gew={t:t.id,k:+p.dataset.k};e.dataTransfer.setData("text/plain",t.id+"|"+p.dataset.k);});
 });
}
function ablegen(t,zone){
 if(!gew||gew.t!==t.id){fb("#fb-"+t.id,"Wähle zuerst eine Karte aus, dann das Feld.","hint");return;}
 st(t.id).placed[gew.k]=zone;gew=null;
 if(S.done[t.id])offen(t);
 zeichneZuord(t);fbClear("#fb-"+t.id);speichern();
}
function bindeZonen(){
 $$(".zone").forEach(z=>{
  const t=TK[z.dataset.task];
  z.addEventListener("click",()=>ablegen(t,z.dataset.zone));
  z.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();ablegen(t,z.dataset.zone);}});
  z.addEventListener("dragover",e=>{e.preventDefault();z.classList.add("over");});
  z.addEventListener("dragleave",()=>z.classList.remove("over"));
  z.addEventListener("drop",e=>{e.preventDefault();z.classList.remove("over");
   const d=(e.dataTransfer.getData("text/plain")||"").split("|");
   if(d[0]===t.id){gew={t:t.id,k:+d[1]};ablegen(t,z.dataset.zone);}});
 });
}
function pruefeZuord(t){
 const pl=st(t.id).placed||{};
 const offenN=t.cards.filter((c,k)=>pl[k]===undefined).length;
 if(offenN){fb("#fb-"+t.id,"Es "+(offenN===1?"ist noch eine Karte":"sind noch "+offenN+" Karten")+" übrig. Ordne zuerst alle zu.","hint");return;}
 let r=0;
 t.cards.forEach((c,k)=>{const el=document.querySelector('.piece[data-task="'+t.id+'"][data-k="'+k+'"]');const ok=pl[k]===c[1];if(ok)r++;if(el)el.classList.add(ok?"ok":"no");});
 if(r===t.cards.length)geloest(t,1,t.ok);
 else{st(t.id).fehl=(st(t.id).fehl||0)+1;fb("#fb-"+t.id,r+" von "+t.cards.length+" stimmen bereits. Die grün umrandeten Karten sitzen richtig. "+t.hint,"hint");speichern();}
}

/* ---------- Reihenfolge und Gewichtung ---------- */
function zeichneOrder(t){
 const o=st(t.id).ord;
 $("#or-"+t.id).innerHTML=o.map((i,pos)=>
  '<div class="orow"><span class="nr">'+(pos+1)+'.</span><span>'+t.items[i]+'</span>'+
  '<button type="button" data-mv="'+pos+'" data-dir="-1" aria-label="Nach oben: '+t.items[i].replace(/"/g,"")+'">&#8593;</button>'+
  '<button type="button" data-mv="'+pos+'" data-dir="1" aria-label="Nach unten: '+t.items[i].replace(/"/g,"")+'">&#8595;</button></div>').join("");
 $$("#or-"+t.id+" button").forEach(b=>b.addEventListener("click",()=>{
  const p=+b.dataset.mv,d=+b.dataset.dir,n=p+d;
  if(n<0||n>=o.length)return;
  const x=o[p];o[p]=o[n];o[n]=x;
  if(S.done[t.id]&&t.type==="order")offen(t);
  zeichneOrder(t);speichern();
  const nb=$$("#or-"+t.id+" button")[n*2+(d<0?0:1)];if(nb)nb.focus();}));
}
function pruefeOrder(t){
 const o=st(t.id).ord;
 if(o.every((v,i)=>v===i))geloest(t,1,t.ok);
 else{st(t.id).fehl=(st(t.id).fehl||0)+1;fb("#fb-"+t.id,o.filter((v,i)=>v===i).length+" von "+o.length+" stehen schon an der richtigen Stelle. "+t.hint,"hint");speichern();}
}
function pruefeRank(t){
 const roh=$("#rk-"+t.id).value, x=norm(roh);
 if(x.length<35||woerter(x)<7){fb("#fb-"+t.id,t.short,"hint");return;}
 if(!hat(x,VERKN)){fb("#fb-"+t.id,"Deine Reihenfolge steht. Begründe sie noch mit „weil“ oder „denn“: Warum wiegt dein erster Grund am schwersten?","hint");return;}
 const o=st(t.id).ord;
 st(t.id).text=o.map((i,p)=>(p+1)+". "+t.items[i]).join(" | ");
 geloest(t,1,t.ok);
}

/* ---------- Bildarbeit mit Hotspots ---------- */
function hotAufgabe(t){
 const s=st(t.id);s.idx=s.idx||0;s.found=s.found||[];
 $$('[data-task="'+t.id+'"].hot').forEach(g=>g.classList.toggle("found",s.found.includes(g.getAttribute("data-hot"))));
 if(s.idx>=t.seq.length){$("#ht-"+t.id).textContent=t.fertig;$("#ha-"+t.id).innerHTML="";return;}
 const z=t.seq[s.idx];
 $("#ht-"+t.id).textContent="Suchauftrag "+(s.idx+1)+" von "+t.seq.length+": "+z[1];
 $("#ha-"+t.id).innerHTML=t.all.map(x=>'<button type="button" class="chip" data-hw="'+x[0]+'">'+x[1]+'</button>').join("");
 $$("#ha-"+t.id+" .chip").forEach(b=>b.addEventListener("click",()=>hotWahl(t,b.dataset.hw)));
}
function hotWahl(t,id){
 const s=st(t.id),z=t.seq[s.idx||0];if(!z)return;
 if(id===z[0]){
  s.idx++;s.found.push(id);
  if(s.idx>=t.seq.length){geloest(t,1,z[2]+" "+t.ok);}
  else{fb("#fb-"+t.id,z[2],"ok");speichern();}
  hotAufgabe(t);
 }else{
  const g=t.all.find(x=>x[0]===id);
  fb("#fb-"+t.id,"Das ist „"+(g?g[1]:"etwas anderes")+"“. "+(t.wrong&&t.wrong[id]?t.wrong[id]+" ":"")+"Lies den Suchauftrag noch einmal genau.","hint");
 }
}
function bindeHot(){
 $$(".hot[data-task]").forEach(g=>{
  const t=TK[g.getAttribute("data-task")];
  g.addEventListener("click",()=>hotWahl(t,g.getAttribute("data-hot")));
  g.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();hotWahl(t,g.getAttribute("data-hot"));}});
 });
}

/* ---------- Lückentext und Perspektiven (Auswahllisten) ---------- */
function pruefeSel(t){
 let r=0,leer=0;
 t.right.forEach((x,k)=>{const e=$("#sel-"+t.id+"-"+k);e.classList.remove("ok","no");if(!e.value){leer++;return;}const ok=e.value===x;if(ok)r++;e.classList.add(ok?"ok":"no");});
 if(leer){fb("#fb-"+t.id,"Es "+(leer===1?"ist noch eine Auswahl":"sind noch "+leer+" Auswahlfelder")+" leer. Fülle zuerst alle aus.","hint");return;}
 if(r===t.right.length)geloest(t,1,t.ok);
 else{st(t.id).fehl=(st(t.id).fehl||0)+1;fb("#fb-"+t.id,r+" von "+t.right.length+" stimmen bereits. Grün umrandet heißt richtig. "+t.hint,"hint");speichern();}
}

/* ---------- Offene Antworten ---------- */
function pruefeText(t){
 const roh=$("#tx-"+t.id).value,x=norm(roh);
 if(x.length<40||woerter(x)<8){st(t.id).lab="zu knapp";fb("#fb-"+t.id,t.short,"hint");speichern();return;}
 const fehlt=t.need.filter(g=>!hat(x,g.kw));
 const verkn=hat(x,VERKN);
 if(!fehlt.length&&verkn){st(t.id).lab="plausibel";if(t.score)geloest(t,1,t.ok);else{fb("#fb-"+t.id,t.ok,"ok");}speichern();return;}
 st(t.id).lab=fehlt.length<t.need.length?"teilweise plausibel":"noch nicht ausreichend";
 let m=fehlt.length<t.need.length?"Ein Teil sitzt schon. ":"Deine Antwort trifft den Kern noch nicht. ";
 fehlt.forEach(g=>m+=g.miss+" ");
 if(!verkn)m+="Verbinde deine Gedanken mit „weil“, „deshalb“ oder „dadurch“.";
 fb("#fb-"+t.id,m.trim(),"hint");speichern();
}

/* ---------- Aufgaben verbinden ---------- */
$$("[data-check]").forEach(b=>b.addEventListener("click",()=>{
 const t=TK[b.dataset.check];
 ({single:pruefeSingle,multi:pruefeMulti,zuord:pruefeZuord,order:pruefeOrder,rank:pruefeRank,gap:pruefeSel,match:pruefeSel,text:pruefeText})[t.type](t);
}));
$$("[data-reset]").forEach(b=>b.addEventListener("click",()=>{
 const t=TK[b.dataset.reset];
 if(t.type==="multi")$$('input[name="'+t.id+'"]').forEach(i=>i.checked=false);
 if(t.type==="zuord"){st(t.id).placed={};gew=null;}
 if(t.type==="order"){st(t.id).ord=mische(t.items.length);}
 if(t.type==="hot"){st(t.id).idx=0;st(t.id).found=[];}
 offen(t);fbClear("#fb-"+t.id);zeichne(t);speichern();
}));
$$("select[id^='sel-']").forEach(e=>e.addEventListener("change",()=>{e.classList.remove("ok","no");const t=TK[e.id.split("-")[1]];if(t&&S.done[t.id])offen(t);}));
$$(".task input[type=radio],.task input[type=checkbox]").forEach(e=>e.addEventListener("change",()=>{const t=TK[e.name];if(t&&S.done[t.id]){offen(t);fbClear("#fb-"+t.id);}}));
function zeichne(t){
 if(t.type==="zuord")zeichneZuord(t);
 if(t.type==="order"||t.type==="rank"){if(!st(t.id).ord||st(t.id).ord.length!==t.items.length)st(t.id).ord=t.type==="rank"?[...Array(t.items.length).keys()]:mische(t.items.length);zeichneOrder(t);}
 if(t.type==="hot")hotAufgabe(t);
}

/* ---------- Abschlussmission ---------- */
function a1Wert(){return wert("a1");}
function a1Richtig(v){return CFG.a1right==="any"?!!v:CFG.a1right.includes(v);}
$$('input[name="a1"]').forEach(e=>e.addEventListener("change",()=>{
 const v=a1Wert();S.punkte.a1=a1Richtig(v)?1:0;
 fb("#a1Fb",CFG.a1fb[v]||"",a1Richtig(v)?"ok":"hint");speichern();
}));
function a2Bewerten(){
 const C=CFG.a2, roh=$("#a2").value, t=norm(roh);
 if(t.length<50)return{p:0,lab:"zu knapp",msg:C.kurz};
 if(woerter(t)<12)return{p:0,lab:"zu knapp",msg:"Das sind noch sehr wenige Wörter. "+C.kurz};
 const fehlt=C.gruppen.filter(g=>!hat(t,g.kw));
 const verkn=hat(t,VERKN), genug=saetze(roh)>=2;
 if(!fehlt.length&&verkn&&genug)return{p:1,lab:"vollständig",msg:C.gut};
 let m="Du bist auf dem richtigen Weg. ";
 fehlt.forEach(g=>m+=g.miss+" ");
 if(!verkn)m+="Verbinde deine Aussagen mit „weil“, „dadurch“ oder „deshalb“. ";
 if(!genug)m+="Schreibe mindestens zwei vollständige Sätze. ";
 return{p:.5,lab:"teilweise",msg:m.trim()};
}
$("#a2Check").addEventListener("click",()=>{
 const r=a2Bewerten();
 S.punkte.a2=r.p;S.a2lab=r.lab;
 fb("#a2Fb",r.msg+(r.p>=1?abzText("a2"):""),r.p>=1?"ok":"hint");
 if(r.p>0)fertig("a2",r.p);else{delete S.done.a2;fortschritt();speichern();}
});

/* ---------- Lerncheck ---------- */
function lerncheckWerte(){return[1,2,3].map(i=>(document.querySelector('input[name="lc'+i+'"]:checked')||{}).value||"");}
$("#selfcheck").addEventListener("change",()=>{
 if(lerncheckWerte().every(Boolean))fertig("lerncheck",1);else{delete S.done.lerncheck;delete S.punkte.lerncheck;fortschritt();}
 speichern();
});

/* ---------- Speichern ---------- */
function sammle(){
 const d={inputs:{},radios:{},checks:[],state:S};
 $$("input[id],textarea[id],select[id]").forEach(e=>{if(e.type!=="radio"&&e.type!=="checkbox")d.inputs[e.id]=e.value;});
 $$("input[type=radio]:checked").forEach(e=>d.radios[e.name]=e.value);
 $$("input[type=checkbox]:checked").forEach(e=>d.checks.push(e.name+"|"+e.value));
 return d;
}
function speichern(){try{localStorage.setItem(CFG.key,JSON.stringify(sammle()));}catch(e){}}
function laden(){
 let d;try{d=JSON.parse(localStorage.getItem(CFG.key)||"null");}catch(e){d=null;}
 if(!d)return false;
 Object.entries(d.inputs||{}).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.value=v;});
 Object.entries(d.radios||{}).forEach(([n,v])=>{$$('input[type=radio][name="'+n+'"]').forEach(e=>{if(e.value===v)e.checked=true;});});
 (d.checks||[]).forEach(s=>{const i=s.indexOf("|");if(i<0)return;const n=s.slice(0,i),v=s.slice(i+1);
  $$('input[type=checkbox][name="'+n+'"]').forEach(e=>{if(e.value===v)e.checked=true;});});
 const s=d.state||{};
 S.lernweg=s.lernweg||"standard";S.done=s.done||{};S.punkte=s.punkte||{};S.t=s.t||{};S.sent=!!s.sent;S.a2lab=s.a2lab;
 return true;
}
$("#clearBtn").addEventListener("click",()=>{
 if(!confirm("Möchtest du wirklich alle auf diesem Gerät gespeicherten Eingaben dieses Moduls löschen? Das lässt sich nicht rückgängig machen."))return;
 try{localStorage.removeItem(CFG.key);}catch(e){}
 location.reload();
});
let t0;document.addEventListener("input",()=>{clearTimeout(t0);t0=setTimeout(speichern,350);});
document.addEventListener("change",()=>{clearTimeout(t0);t0=setTimeout(speichern,200);});

/* ---------- Ergebnis ---------- */
function eins(b){return b?1:0;}
const PUNKTE=[...PFLICHT,"a1","a2","lerncheck"];
const MAXP=PUNKTE.length;
function punkteGesamt(){return PUNKTE.reduce((s,k)=>s+(S.punkte[k]||0),0);}
function payload(){
 const k=klasseOk($("#klasse").value);
 const pkt=punkteGesamt(), pct=Math.round(pkt/MAXP*100);
 const luecken=[];
 T.filter(t=>PFLICHT.includes(t.id)).forEach(t=>{if(!((S.punkte[t.id]||0)>=1))luecken.push(t.name);});
 if(!((S.punkte.a1||0)>=1))luecken.push("Abschlussentscheidung");
 if(!((S.punkte.a2||0)>=1))luecken.push("Begründung");
 const ergebnisse={},pflicht={},freitexte={leitfrage:$("#a2").value.trim(),nachricht_an_chronos:$("#a2").value.trim()},bew={begruendung:S.a2lab||"nicht bearbeitet"};
 T.forEach(t=>{
  if(t.score&&(t.lw!=="weiter"||S.lernweg==="weiter"))ergebnisse[t.key]=S.punkte[t.id]||0;
  if(PFLICHT.includes(t.id))pflicht[t.key]={correct:(S.punkte[t.id]||0)>=1};
  if(t.type==="text"){freitexte[t.key]=$("#tx-"+t.id).value.trim();bew[t.key]=st(t.id).lab||"nicht bearbeitet";}
  if(t.type==="rank"){freitexte[t.key]=st(t.id).text||"";freitexte[t.key+"_begruendung"]=$("#rk-"+t.id).value.trim();}
 });
 ergebnisse.entscheidung=S.punkte.a1||0;ergebnisse.begruendung=S.punkte.a2||0;ergebnisse.lerncheck=S.punkte.lerncheck||0;
 pflicht.entscheidung={correct:(S.punkte.a1||0)>=1};pflicht.begruendung={correct:(S.punkte.a2||0)>=1};
 Object.assign(freitexte,{verstanden:$("#rCan").value.trim(),schwierig:$("#rHard").value.trim(),offene_frage:$("#rOpen").value.trim()});
 const komp={};
 ["fachwissen","zeit_raum","quellenarbeit","ursachen_folgen","perspektivitaet"].forEach(kk=>{
  const ts=T.filter(t=>t.komp===kk&&PFLICHT.includes(t.id));
  komp[kk]=eins(ts.length>0&&ts.every(t=>(S.punkte[t.id]||0)>=1));
 });
 komp.historisches_urteil=eins((S.punkte.a1||0)>=1&&(S.punkte.a2||0)>=1);
 const a1v=a1Wert();
 return{schema:"1.0",fach:"Geschichte",jahrgang:CFG.jahrgang,modul_id:CFG.modul,modul_titel:CFG.titel,
  themenbereich:CFG.bereich,dateiversion:CFG.version,
  zeitstempel:new Date().toISOString(),
  name:$("#name").value.trim(),klasse:k.ok?k.wert:$("#klasse").value.trim(),email:$("#email").value.trim(),
  lernweg:S.lernweg,fortschritt:SCHRITTE.filter(x=>S.done[x]).length+" von "+SCHRITTE.length,
  ergebnisse:ergebnisse,
  freitexte:freitexte,
  bewertung_freitexte:bew,
  entscheidung_gewaehlt:a1v?($('input[name="a1"][value="'+a1v+'"]').parentNode.textContent.trim()):"",
  lerncheck:lerncheckWerte(),
  punkte:pkt,max_punkte:MAXP,prozent:pct,
  auffaelligkeiten:luecken,
  bearbeitungsstand:Math.round(SCHRITTE.filter(x=>S.done[x]).length/SCHRITTE.length*100),
  pflichtaufgaben:pflicht,
  kompetenzen:komp,
  abschlusstest_punkte:pkt,
  abschlusstest_max:MAXP,
  selbsteinschaetzung:lerncheckWerte().filter(v=>v==="Sicher").length,
  fehlende_bereiche:luecken,
  hosting_modus:/(pages\.dev|netlify\.app|edmundbruns\.com)$/.test(location.hostname)?"live":"lokal",
  schema_version:"1.0",
  modul_nummer:CFG.modul,
  abgabe_id:(window.crypto&&crypto.randomUUID)?crypto.randomUUID():Date.now()+"-"+Math.random().toString(16).slice(2)};
}
window.payload=payload;
function zusammenfassung(p){
 return "SOL Geschichte "+CFG.jahrgang+", Modul "+p.modul_id+": "+p.modul_titel
 +"\nName: "+(p.name||"-")+"\nKlasse: "+(p.klasse||"-")+"\nLernweg: "+p.lernweg
 +"\nFortschritt: "+p.fortschritt+"\nPunkte: "+p.punkte+" von "+p.max_punkte+" ("+p.prozent+" Prozent)"
 +"\nNoch zu sichern: "+(p.auffaelligkeiten.join(", ")||"nichts")
 +"\nLerncheck: "+(p.lerncheck.filter(Boolean).join(" | ")||"nicht vollständig")
 +"\nEntscheidung: "+(p.entscheidung_gewaehlt||"-")
 +"\nBegründung: "+p.bewertung_freitexte.begruendung;
}
function ergebnisBauen(){
 if(!pflichtOk(true)){location.hash="start";return null;}
 const a1=a1Wert();
 if(!a1){fb("#sendFb","Bitte triff zuerst in der Abschlussmission deine Entscheidung.","bad");location.hash="abschluss";return null;}
 S.punkte.a1=a1Richtig(a1)?1:0;
 if(!lerncheckWerte().every(Boolean)){fb("#sendFb","Bitte fülle zuerst alle drei Aussagen im Lerncheck aus.","bad");location.hash="lerncheck";return null;}
 const p=payload();
 $("#resultPanel").classList.add("show");
 $("#ring").style.setProperty("--p",p.prozent+"%");
 $("#ringTxt").textContent=p.punkte+" / "+p.max_punkte;
 const l=$("#lamp");l.className="lamp "+(p.prozent>=80?"g":p.prozent>=50?"y":"r");
 $("#lampTxt").textContent=p.prozent>=80?"Sicher unterwegs":p.prozent>=50?"Gute Grundlage, einzelne Stellen prüfen":"Wiederholung sinnvoll";
 $("#empfehlung").textContent=p.prozent>=80?CFG.next
  :(p.auffaelligkeiten.length?"Sieh dir noch einmal an: "+p.auffaelligkeiten.join(", ")+". Danach: "+CFG.next:"Wiederhole die Abschnitte, die dir schwerfielen. Danach: "+CFG.next);
 const zeilen=T.filter(t=>t.score&&(t.lw!=="weiter"||S.lernweg==="weiter")).map(t=>[t.name,S.punkte[t.id]||0]);
 zeilen.push(["Abschlussentscheidung",S.punkte.a1||0],["Begründung",S.punkte.a2||0],["Lerncheck",S.punkte.lerncheck||0]);
 $("#analyse").innerHTML=zeilen.map(([n,v])=>"<li><strong>"+n+":</strong> "+(v>=1?"vollständig":v>0?"teilweise":"noch offen")+" ("+v+" P.)</li>").join("");
 $("#summary").textContent=zusammenfassung(p);
 fortschritt();speichern();location.hash="ergebnis";
 return p;
}
$("#buildBtn").addEventListener("click",()=>{letzterPayload=null;ergebnisBauen();});
$("#copyBtn").addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText($("#summary").textContent);fb("#sendFb","Die Zusammenfassung wurde kopiert.","ok");}
 catch(e){fb("#sendFb","Kopieren war nicht möglich. Markiere den Text bitte von Hand.","hint");}
});
let letzterPayload=null;
async function senden(){
 const p=letzterPayload||ergebnisBauen();
 if(!p)return; letzterPayload=p;
 const live=/(pages\.dev|netlify\.app|edmundbruns\.com)$/.test(location.hostname);
 if(!live){fb("#sendFb","Vorschau-Modus: Hier wird nichts gesendet. Auf der veröffentlichten Seite geht dein Ergebnis an die Lehrkraft. Dein Stand bleibt auf diesem Gerät gespeichert.","hint");return;}
 const b=$("#sendBtn");b.disabled=true;
 fb("#sendFb","Übertragung läuft ...","hint");
 try{
  const r=await ebSend(CFG.endpoint,p);
  if(!r.ok){speichern();$("#retryBtn").hidden=false;fb("#sendFb","Nicht gespeichert: "+r.msg+" Deine Arbeit bleibt auf diesem Gerät. Prüfe deine Angaben und tippe dann auf „Erneut senden“.","bad");return;}
  S.sent=true;speichern();
  $("#retryBtn").hidden=true;
  fb("#sendFb","Gespeichert ✓ Dein Ergebnis ist bei deiner Lehrkraft angekommen. Falls die E-Mail-Rückmeldung freigegeben ist, erhältst du sie an deine Adresse.","ok");
 }catch(e){
  $("#retryBtn").hidden=false;
  fb("#sendFb","Die Übertragung hat nicht geklappt, vermutlich wegen der Internetverbindung. Deine Arbeit ist nicht verloren, sie ist auf diesem Gerät gespeichert. Du kannst es mit „Erneut senden“ noch einmal versuchen oder die Zusammenfassung kopieren und der Lehrkraft schicken.","bad");
 }finally{b.disabled=false;}
}
$("#sendBtn").addEventListener("click",senden);
$("#retryBtn").addEventListener("click",senden);

/* ---------- Lesehilfen ---------- */
$("#easyBtn").addEventListener("click",()=>{
 document.body.classList.toggle("easy");
 $("#easyBtn").setAttribute("aria-pressed",String(document.body.classList.contains("easy")));
});
$("#speakBtn").addEventListener("click",()=>{
 if(!("speechSynthesis" in window)){alert("Vorlesen wird von diesem Browser nicht unterstützt.");return;}
 speechSynthesis.cancel();
 const txt=$$("main section").map(s=>s.innerText).join(". ");
 const u=new SpeechSynthesisUtterance(txt);u.lang="de-DE";u.rate=.95;speechSynthesis.speak(u);
});
$("#stopBtn").addEventListener("click",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});
window.addEventListener("beforeunload",()=>{if("speechSynthesis" in window)speechSynthesis.cancel();});

/* ---------- Start ---------- */
const wieder=laden();
setLernweg(S.lernweg||"standard");
bindeZonen();bindeHot();
T.forEach(t=>{zeichne(t);if(S.done[t.id]&&st(t.id).msg)fb("#fb-"+t.id,"Bereits gelöst. "+st(t.id).msg,"ok");});
{const v=a1Wert();if(v)fb("#a1Fb",CFG.a1fb[v]||"",a1Richtig(v)?"ok":"hint");}
fortschritt();
if(wieder&&SCHRITTE.some(k=>S.done[k])){
 fb("#startFb","Willkommen zurück. Dein gespeicherter Stand wurde geladen. Du kannst dort weitermachen, wo du aufgehört hast.","ok");
}
