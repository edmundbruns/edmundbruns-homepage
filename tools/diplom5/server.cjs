const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const data=JSON.parse(fs.readFileSync('/tmp/d5/content5.json','utf8'));const code=fs.readFileSync('/tmp/d5/site/google-apps-script.gs','utf8');
class Range{constructor(s,r,c,nr=1,nc=1){Object.assign(this,{s,r,c,nr,nc});}getValues(){return Array.from({length:this.nr},(_,i)=>Array.from({length:this.nc},(_,j)=>this.s.cells[this.r+i-1]?.[this.c+j-1]??''));}
 setValues(v){for(let i=0;i<this.nr;i++){this.s.cells[this.r+i-1]??=[];for(let j=0;j<this.nc;j++)this.s.cells[this.r+i-1][this.c+j-1]=v[i][j];}return this;}setNumberFormat(){return this;}setWrap(){return this;}setFontWeight(){return this;}}
class Sheet{constructor(n){this.n=n;this.cells=[];}getName(){return this.n;}getRange(...a){return new Range(this,...a);}getLastRow(){return this.cells.length;}getMaxRows(){return 1000;}getMaxColumns(){return 30;}insertRowsAfter(){}insertColumnsAfter(){}setFrozenRows(){}}
function server(){const sheets=new Map(),mail=[];const ss={getSheetByName:n=>sheets.get(n),insertSheet:n=>{const s=new Sheet(n);sheets.set(n,s);return s;},getSheets:()=>[...sheets.values()],deleteSheet(){},setSpreadsheetTimeZone(){},getUrl:()=>'https://example.invalid'};
 const ctx=vm.createContext({SpreadsheetApp:{openById:()=>ss,flush(){}},LockService:{getScriptLock:()=>({waitLock(){},hasLock:()=>true,releaseLock(){}})},MailApp:{getRemainingDailyQuota:()=>100,sendEmail:m=>mail.push(m)},ContentService:{MimeType:{JSON:1},createTextOutput:t=>({t,setMimeType(){return this;}})},console});
 vm.runInContext(code,ctx);return {ctx,sheets,mail,post:p=>JSON.parse(ctx.doPost({postData:{contents:JSON.stringify(p)}}).t)};}
const groups=[...new Set(data.map(m=>m.group))];
function payload(lev,bi,code='S-1',name='Kind'){const mods=data.filter(m=>m.group===groups[bi]);const rep=p=>({puzzleId:p.puzzleId,solved:true,playedUci:p.solution,attempts:2,wrong:1,hints:0,solutionViewed:false,solvedWithHelp:false});
 return {action:'blockCompletion',submissionVersion:'block-v1',contentVersion:'diplom5-v1-2026-10-13',level:lev,block:'b'+(bi+1),learner:{name,klasse:'9a',code,email:'k@example.invalid'},
  modules:mods.map(m=>({moduleId:m.id,completed:true,exampleSeen:true,answer:'Antwort '+m.id,choice:{picked:0,tries:1},selfcheck:1,main:rep(m.exercises[lev].main),practice:m.exercises[lev].practice.map(rep)}))};}
const s=server();
assert.equal(JSON.parse(s.ctx.doGet().t).blockCount,4);assert.equal(JSON.parse(s.ctx.doGet().t).moduleCount,19);
s.ctx.setup();
for(const lev of ['aufbau','fortgeschritten','meister'])for(let b=0;b<4;b++){const r=s.post(payload(lev,b));assert.equal(r.ok,true,r.message);assert.equal(r.emailStatus,'E-Mail gesendet');}
assert.equal(s.mail.length,12);assert.equal(s.sheets.get('Modulmeldungen').getLastRow(),1+19*3);assert.equal(s.sheets.get('Blockabgaben').getLastRow(),13);
const again=s.post(payload('aufbau',0));assert.equal(again.emailStatus,'bereits gemeldet');assert.equal(again.submissionMatches,true);assert.equal(s.mail.length,12);
const ch=payload('aufbau',0);ch.modules[0].answer='geändert';const r2=s.post(ch);assert.equal(r2.submissionMatches,false);assert.equal(s.sheets.get('Modulmeldungen').getLastRow(),58);
assert.equal(s.post(payload('aufbau',0,'S-1','Anderes Kind')).ok,false);
const bad=[p=>p.modules.pop(),p=>p.modules[0].main.playedUci=['a2a3'],p=>p.modules[0].answer=' ',p=>p.block='b9',p=>p.contentVersion='x',p=>p.modules[0].selfcheck=5];
for(const f of bad){const t=server(),p=payload('meister',2);f(p);assert.equal(t.post(p).ok,false);}
console.log('Servertest bestanden: 12 Blockabgaben, Wiederholung ohne neue Mail, Änderung erkannt, fremder Name abgewiesen, 6 ungültige Abgaben abgewiesen');
console.log('Mail-Betreff:',s.mail[0].subject);
