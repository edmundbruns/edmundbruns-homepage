/** Ludgerus-Schachdiplom 5. Eine feste Abgabe je Lerncode, Stufe und Themenblock. © Dr. Edmund Bruns */
const SPREADSHEET_ID = /*__SPREADSHEET__*/;
const NOTIFICATION_EMAIL = /*__EMAIL__*/;
const CONTENT_VERSION = /*__CONTENT_VERSION__*/;
const SERVER_RELEASE = /*__RELEASE__*/;
const COURSE = /*__COURSE__*/;
const LEVEL_NAMES = {aufbau:'Aufbau',fortgeschritten:'Fortgeschritten',meister:'Meister'};
const SELF = ['Kann ich sicher','Kann ich teilweise','Muss ich noch üben'];
const BLOCKS = (()=>{const names=[];COURSE.forEach(m=>{if(!names.includes(m.group))names.push(m.group);});return names.map((name,i)=>({id:'b'+(i+1),name,modules:COURSE.filter(m=>m.group===name)}));})();
const BLOCK_HEADERS = ['Eingang','Lerncode','Kurzname','Klasse','Lernenden-E-Mail','Stufe','Block-ID','Themenblock','Module','Mailstatus','Mailzeit','Inhaltsversion','Meldeschlüssel','Erstmeldung','Zugversuche','Denkhilfen','Aufgaben mit Hilfe','Lösungen angesehen','Bewertung','Rückmeldung der Lehrkraft'];
const MODULE_HEADERS = ['Eingang','Lerncode','Kurzname','Klasse','Stufe','Themenblock','Modul-ID','Modul','Erklärung','Frage','Auswahlfrage Versuche','Lerncheck','Anwendung ohne Hilfe','Übungen ohne Hilfe','Zugversuche','Denkhilfen','Fehlzüge','Lösung angesehen','Musterlösung geöffnet','Inhaltsversion','Meldeschlüssel','Bewertung','Rückmeldung der Lehrkraft'];

function setup() {
  const ss=SpreadsheetApp.openById(SPREADSHEET_ID);
  ensureSheet_(ss,'Blockabgaben',BLOCK_HEADERS);ensureSheet_(ss,'Modulmeldungen',MODULE_HEADERS);
  const first=ss.getSheets()[0];if(first&&first.getName()==='Tabellenblatt1'&&first.getLastRow()===0)ss.deleteSheet(first);
  ss.setSpreadsheetTimeZone('Europe/Berlin');
  return 'Ludgerus-Schachdiplom 5 vorbereitet. Empfänger: '+NOTIFICATION_EMAIL;
}
function doGet() {return json_({ok:true,service:'Ludgerus-Schachdiplom 5',submissionVersion:'block-v1',contentVersion:CONTENT_VERSION,moduleCount:COURSE.length,blockCount:BLOCKS.length,serverRelease:SERVER_RELEASE,immutableSubmissions:true});}
function doPost(e) {
  let lock;
  try {
    if(!e||!e.postData||typeof e.postData.contents!=='string'||e.postData.contents.length>262144)throw new Error('Die Abgabe fehlt oder ist zu groß.');
    const p=JSON.parse(e.postData.contents);let v=validate_(p);
    lock=LockService.getScriptLock();lock.waitLock(20000);
    const ss=SpreadsheetApp.openById(SPREADSHEET_ID),bs=ensureSheet_(ss,'Blockabgaben',BLOCK_HEADERS),ms=ensureSheet_(ss,'Modulmeldungen',MODULE_HEADERS),now=new Date();
    const key=JSON.stringify([v.code,p.level,v.block.id,CONTENT_VERSION]),rows=readRows_(bs,BLOCK_HEADERS.length),found=rows.findIndex(r=>String(r[12])===key);
    const previous=found<0?null:rows[found],rowNumber=found<0?bs.getLastRow()+1:found+2;
    if(previous&&Number(previous[8])===v.block.modules.length){
      if(String(previous[2])!==v.name)throw new Error('Dieser Lerncode gehört bereits zu einem anderen Namen. Bitte kläre den richtigen Lerncode mit der Lehrkraft.');
      const mrows=readRows_(ms,MODULE_HEADERS.length),mk=id=>JSON.stringify([v.code,p.level,id,CONTENT_VERSION]);
      const matches=v.items.every(it=>mrows.some(r=>String(r[20])===mk(it.module.id)&&String(r[8])===it.answer));
      if(String(previous[9])==='E-Mail gesendet')return receipt_(p,v,'bereits gemeldet',previous,matches);
      const levelRow=previous.slice();const status=notify_(ss,v,p,levelRow,true);
      bs.getRange(rowNumber,10,1,2).setValues([[safe_(levelRow[9]),levelRow[10]]]);SpreadsheetApp.flush();
      return receipt_(p,v,status,levelRow,matches);
    }
    const t=v.totals;
    const row=[now,v.code,v.name,v.klasse,v.email,LEVEL_NAMES[p.level],v.block.id,v.block.name,0,'E-Mail ausstehend','',CONTENT_VERSION,key,previous?previous[13]:now,t.attempts,t.hints,t.withHelp,t.solutionViewed,previous?previous[18]:'Offen',previous?previous[19]:''];
    ensureRows_(bs,rowNumber);bs.getRange(rowNumber,1,1,row.length).setValues([safeRow_(row)]);
    let next=ms.getLastRow()+1;
    for(const it of v.items){
      const mk=JSON.stringify([v.code,p.level,it.module.id,CONTENT_VERSION]);
      const r=[now,v.code,v.name,v.klasse,LEVEL_NAMES[p.level],v.block.name,it.module.id,it.module.title,it.answer,it.module.question,it.choiceTries,SELF[it.selfcheck]||'',it.mainClean?'ja':'nein',it.practiceClean+' von '+it.practiceCount,it.attempts,it.hints,it.wrong,it.solutionViewed?'ja':'nein',it.modelViewed?'ja':'nein',CONTENT_VERSION,mk,'Offen',''];
      ensureRows_(ms,next);ms.getRange(next,1,1,r.length).setValues([safeRow_(r)]);ms.getRange(next,9).setWrap(true);ms.getRange(next,1).setNumberFormat('dd.mm.yy hh:mm');next++;
    }
    row[8]=v.block.modules.length;bs.getRange(rowNumber,1,1,row.length).setValues([safeRow_(row)]);
    for(const c of [1,11,14])bs.getRange(rowNumber,c).setNumberFormat('dd.mm.yy hh:mm');SpreadsheetApp.flush();
    const status=notify_(ss,v,p,row,false);
    bs.getRange(rowNumber,10,1,2).setValues([[safe_(row[9]),row[10]]]);SpreadsheetApp.flush();
    return receipt_(p,v,status,row,true);
  }catch(err){return json_({ok:false,message:String(err.message||err)});}
  finally{if(lock&&lock.hasLock())lock.releaseLock();}
}
function receipt_(p,v,emailStatus,row,matches) {return json_({ok:true,submissionVersion:'block-v1',level:p.level,block:v.block.id,moduleCount:v.block.modules.length,emailStatus,contentVersion:CONTENT_VERSION,serverRelease:SERVER_RELEASE,immutableSubmissions:true,submissionMatches:matches,receivedAt:date_(row[13],new Date()).toISOString()});}
function notify_(ss,v,p,row,repeat) {
  try {
    if(MailApp.getRemainingDailyQuota()<1)throw new Error('Tageskontingent erreicht. Bitte später erneut senden.');
    const name=LEVEL_NAMES[p.level],subject='Schachdiplom 5: '+row[2]+' hat den Block „'+v.block.name+'“ ('+name+') abgegeben';
    const lines=v.items.map(it=>'• '+it.module.title+': Lerncheck „'+(SELF[it.selfcheck]||'–')+'“, Anwendung '+(it.mainClean?'ohne':'mit')+' Hilfe');
    const body='Neue Blockabgabe im Ludgerus-Schachdiplom 5\n\n'+row[2]+' · Klasse '+(row[3]||'nicht angegeben')+'\nLerncode: '+row[1]+'\nStufe: '+name+'\nThemenblock: '+v.block.name+'\n\n'+lines.join('\n')+'\n\nZugversuche: '+count_(row[14])+'. Denkhilfen: '+count_(row[15])+'. Aufgaben mit Hilfe: '+count_(row[16])+'. Lösungen angesehen: '+count_(row[17])+'.\n\nAuswertung: '+ss.getUrl();
    const html='<div style="font:15px/1.6 Arial,sans-serif;color:#20382e;max-width:680px"><h2>Neue Blockabgabe: '+escape_(v.block.name)+'</h2><p><strong>'+escape_(row[2])+'</strong> · Klasse '+escape_(row[3]||'nicht angegeben')+' · Stufe '+escape_(name)+'</p><ul>'+v.items.map(it=>'<li>'+escape_(it.module.title)+': '+escape_(SELF[it.selfcheck]||'–')+', Anwendung '+(it.mainClean?'ohne':'mit')+' Hilfe</li>').join('')+'</ul><p>'+count_(row[14])+' Zugversuche · '+count_(row[15])+' Denkhilfen · '+count_(row[16])+' Aufgaben mit Hilfe · '+count_(row[17])+' Lösungen angesehen</p><p>Lerncode: '+escape_(row[1])+'</p><p><a href="'+escape_(ss.getUrl())+'">Auswertung und Antworten öffnen</a></p></div>';
    MailApp.sendEmail({to:NOTIFICATION_EMAIL,subject,body,htmlBody:html,name:'Ludgerus-Schachdiplom 5'});row[9]='E-Mail gesendet';row[10]=new Date();return 'E-Mail gesendet';
  }catch(error){row[9]='E-Mail fehlgeschlagen: '+String(error.message||error);return row[9];}
}
function validate_(p) {
  if(!p||p.action!=='blockCompletion'||p.submissionVersion!=='block-v1'||p.contentVersion!==CONTENT_VERSION)throw new Error('Bitte die aktuelle Lernseite verwenden.');
  if(!Object.prototype.hasOwnProperty.call(LEVEL_NAMES,p.level))throw new Error('Lernstufe ungültig.');
  const block=BLOCKS.find(b=>b.id===p.block);if(!block)throw new Error('Themenblock ungültig.');
  const l=p.learner||{};
  if(['code','name','klasse','email'].some(k=>l[k]!==undefined&&typeof l[k]!=='string'))throw new Error('Die Angaben im Lernpass sind ungültig.');
  const code=(l.code||'').trim(),name=(l.name||'').trim(),klasse=(l.klasse||'').trim(),email=(l.email||'').trim();
  if(!code||code.length>32||!name||name.length>32||klasse.length>20)throw new Error('Bitte Kurzname und eindeutigen Lerncode angeben.');
  if(email.length>120||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Bitte eine gültige E-Mail-Adresse angeben.');
  if(!Array.isArray(p.modules)||p.modules.length!==block.modules.length)throw new Error('Alle Module des Themenblocks sind erforderlich.');
  const totals={attempts:0,hints:0,withHelp:0,solutionViewed:0};
  const items=block.modules.map(module=>{
    const item=p.modules.find(x=>x&&x.moduleId===module.id);if(!item)throw new Error('Modul „'+module.title+'“ fehlt.');
    const ex=module.exercises[p.level],answer=typeof item.answer==='string'?item.answer.trim():'';
    if(item.completed!==true||item.exampleSeen!==true)throw new Error('Modul „'+module.title+'“ ist noch nicht vollständig.');
    if(!answer||answer.length>4000)throw new Error('Die Erklärung in „'+module.title+'“ fehlt.');
    if(![0,1,2].includes(item.selfcheck))throw new Error('Der Lerncheck in „'+module.title+'“ fehlt.');
    const puzzles=[[item.main,ex.main],...ex.practice.map((pp,i)=>[(item.practice||[])[i],pp])];
    for(const [rep,ref] of puzzles){
      if(!rep||rep.puzzleId!==ref.puzzleId||rep.solved!==true||JSON.stringify(rep.playedUci)!==JSON.stringify(ref.solution))throw new Error('Eine Zugfolge in „'+module.title+'“ ist nicht gelöst.');
      totals.attempts+=count_(rep.attempts);totals.hints+=count_(rep.hints);if(rep.solvedWithHelp===true)totals.withHelp++;if(rep.solutionViewed===true)totals.solutionViewed++;
    }
    const clean=r=>r.solvedWithHelp!==true&&r.solutionViewed!==true;
    return {module,answer,selfcheck:item.selfcheck,choiceTries:count_(item.choice&&item.choice.tries),mainClean:clean(item.main),practiceClean:(item.practice||[]).filter(clean).length,practiceCount:ex.practice.length,
      attempts:puzzles.reduce((n,[r])=>n+count_(r.attempts),0),hints:puzzles.reduce((n,[r])=>n+count_(r.hints),0),wrong:puzzles.reduce((n,[r])=>n+count_(r.wrong),0),
      solutionViewed:puzzles.some(([r])=>r.solutionViewed===true),modelViewed:item.main.reflectionHelpViewed===true};
  });
  return {code,name,klasse,email,block,items,totals};
}
function readRows_(s,columns) {return s.getLastRow()>1?s.getRange(2,1,s.getLastRow()-1,columns).getValues():[];}
function ensureSheet_(ss,name,headers) {let s=ss.getSheetByName(name);if(!s)s=ss.insertSheet(name);if(s.getMaxColumns()<headers.length)s.insertColumnsAfter(s.getMaxColumns(),headers.length-s.getMaxColumns());s.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold');s.setFrozenRows(1);return s;}
function ensureRows_(s,r) {if(s.getMaxRows()<r)s.insertRowsAfter(s.getMaxRows(),Math.max(200,r-s.getMaxRows()));}
function count_(n) {n=Number(n);return Number.isFinite(n)?Math.min(100000,Math.max(0,Math.floor(n))):0;}
function date_(v,fallback) {const d=new Date(v);return Number.isFinite(d.getTime())?d:fallback;}
function safe_(x) {return typeof x==='string'&&/^[=+\-@]/.test(x)?"'"+x:x;}
function safeRow_(row) {return row.map(safe_);}
function escape_(s) {return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function json_(x) {return ContentService.createTextOutput(JSON.stringify(x)).setMimeType(ContentService.MimeType.JSON);}
