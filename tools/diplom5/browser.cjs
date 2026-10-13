const {chromium}=require('/tmp/w/jsd/node_modules/playwright');
const fs=require('fs'),assert=require('assert/strict');
const data=JSON.parse(fs.readFileSync('/tmp/d5/content5.json','utf8'));
(async()=>{
 const browser=await chromium.launch({args:['--no-sandbox']});
 const ctx=await browser.newContext({viewport:{width:1366,height:900}});
 const page=await ctx.newPage();const errors=[],posts=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
 await ctx.route('https://script.google.com/**',async r=>{
   if(r.request().method()==='GET')return r.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({ok:true,contentVersion:'diplom5-v1-2026-10-13',immutableSubmissions:true})});
   const p=JSON.parse(r.request().postData());posts.push(p);
   const n=data.filter(m=>m.group===[...new Set(data.map(x=>x.group))][Number(p.block.slice(1))-1]).length;
   return r.fulfill({contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify({ok:true,submissionVersion:'block-v1',level:p.level,block:p.block,moduleCount:n,emailStatus:'E-Mail gesendet',contentVersion:p.contentVersion,submissionMatches:true,receivedAt:new Date().toISOString()})});
 });
 await page.goto('file:///tmp/d5/site/index.html');
 // Test-URL setzen (die echte kommt nach dem Bereitstellen)
 await page.evaluate(()=>{CONFIG.googleSheetsWebAppUrl='https://script.google.com/macros/s/TEST123/exec';});
 await page.fill('#learner','Testkind');await page.fill('#code','D5-TEST');await page.fill('#learnerEmail','t@example.invalid');
 const click=sq=>page.click(`#chessboard [data-square="${sq}"]`);
 async function play(uci){await click(uci.slice(0,2));await click(uci.slice(2,4));if(uci[4])await page.click(`[data-promotion="${uci[4]}"]`);}
 let wrongChecked=0,altChecked=0;
 for(const lev of ['aufbau','fortgeschritten','meister']){
  await page.click(`[data-level="${lev}"]`);
  for(const m of data){
   await page.click(`[data-module="${m.id}"]`);
   await page.evaluate(()=>goTo('lernen'));
   for(let i=0;i<m.example.solution.length;i++)await page.click('#solutionNext');
   assert.equal(await page.isVisible('#merksatz'),true,m.id+' merksatz');
   await page.click('#toPractice');
   const ex=m.exercises[lev];
   for(const [k,p] of ex.practice.entries()){
     await page.evaluate(i=>goTo('ueben',i),k);
     for(let i=0;i<p.solution.length;i+=2)await play(p.solution[i]);
     assert.equal(await page.evaluate(()=>solved(exercise())),true,m.id+lev+'practice'+k);
   }
   await page.evaluate(()=>goTo('anwenden'));
   const p=ex.main;
   // Fehlzug-Rückmeldung prüfen (erster Zug)
   const wr=Object.entries(p.check['0']?.r||{}).find(([u,v])=>v[0]);
   if(wr){await play(wr[0]);const fb=await page.textContent('#boardFeedback');assert.ok(fb.includes('nicht die beste Lösung'),m.id+fb);wrongChecked++;}
   for(let i=0;i<p.solution.length;i+=2)await play(p.solution[i]);
   assert.equal(await page.evaluate(()=>solved(exercise())),true,m.id+lev+'main');
   await page.check(`input[name="choice"][value="${p.choice.correct}"]`);await page.click('#checkChoice');
   await page.fill('#answer-0','Mein erster Zug zielt auf ein konkretes Feld, die Gegenseite antwortet erzwungen.');
   assert.equal(await page.isVisible('#modelAnswers'),true,m.id+' musterloesung');
   await page.evaluate(()=>goTo('check'));
   await page.click('[data-self="0"]');
   assert.equal(await page.evaluate(id=>completed(modules.find(x=>x.id===id)),m.id),true,m.id+lev+' completed');
   const blockDone=await page.evaluate(()=>blockComplete(blockOf(currentModule())));
   if(blockDone){await page.click('#sendBlock');await page.waitForFunction(()=>!sending);}
  }
  assert.equal(await page.evaluate(()=>levelComplete()),true,lev);
  assert.equal(await page.isVisible('#certificateBtn'),true);
 }
 // Alternativzug irgendwo testen
 for(const m of data){const p=m.exercises.aufbau.main;const a=(p.check['0']||{}).a||[];if(a.length){
   await page.click('[data-level="aufbau"]');await page.click(`[data-module="${m.id}"]`);await page.evaluate(()=>goTo('anwenden'));await page.click('#boardReset');
   await play(a[0]);const fb=await page.textContent('#boardFeedback');assert.ok(fb.includes('Auch')||fb.includes('Richtig')||fb.includes('geschafft')||fb.includes('gelöst'),fb);altChecked++;break;}}
 assert.equal(posts.length,12);
 for(const p of posts){assert.equal(p.course,'Ludgerus-Schachdiplom 5');assert.ok(p.modules.every(x=>x.completed&&x.main.solved));}
 await page.setViewportSize({width:390,height:844});await page.click('[data-module="k01"]');
 const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth);
 await page.screenshot({path:'/tmp/d5/test/mobile.png',fullPage:false});
 await page.setViewportSize({width:1366,height:900});await page.evaluate(()=>{selected='k05';goTo('lernen');});await page.screenshot({path:'/tmp/d5/test/desktop.png'});
 console.log(JSON.stringify({levels:3,modules:19,blockSubmissions:posts.length,wrongMoveFeedbackChecked:wrongChecked,altMoveChecked:altChecked,mobileOverflow:overflow,errors},null,1));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
