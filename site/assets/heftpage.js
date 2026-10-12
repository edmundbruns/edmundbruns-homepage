(function(){
  var G=window.HeftGen; if(!G) return;
  var $=function(id){return document.getElementById(id);};
  function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');}

  function ws(theme,diff){
    var d=G.DIFF[diff], words=G.shuffle(G.THEMES[theme].slice()).slice(0,d.wn);
    var o=G.wordSearch(d.ws,words,d.diag,d.rev), N=d.ws;
    var hit={}; o.placed.forEach(function(p){p.cells.forEach(function(c){hit[c[0]+'-'+c[1]]=1;});});
    function tbl(showHit){var s='<table class="ws">';for(var r=0;r<N;r++){s+='<tr>';for(var c=0;c<N;c++){var cl=(showHit&&hit[r+'-'+c])?' class="hit"':'';s+='<td'+cl+'>'+o.grid[r][c]+'</td>';}s+='</tr>';}return s+'</table>';}
    var wl='<div class="wswords">'+words.map(function(w){return '<span>'+esc(w)+'</span>';}).join('')+'</div>';
    var task='Finde die '+words.length+' Wörter. Sie stehen waagerecht, senkrecht'+(d.diag?' oder schräg':'')+(d.rev?' und teils rückwärts':'')+'.';
    return {
      puz:'<div class="sheet"><h2>Suchsel · '+esc(theme)+'</h2><p class="task">'+task+'</p>'+tbl(false)+wl+'</div>',
      sol:'<div class="sheet sol"><h2>Lösung · Suchsel</h2>'+tbl(true)+wl+'</div>'
    };
  }
  function zm(diff){
    var d=G.DIFF[diff], lv=G.numberWall(d.zm,d.zmax);
    function build(showAll){var s='<div class="zm">';for(var i=lv.length-1;i>=0;i--){s+='<div class="zmrow">';for(var j=0;j<lv[i].length;j++){var given=(i===0);var show=given||showAll;s+='<div class="brick '+(given?'given':(show?'':'blank'))+'">'+(show?lv[i][j]:'?')+'</div>';}s+='</div>';}return s+'</div>';}
    return {
      puz:'<div class="sheet"><h2>Zahlenmauer</h2><p class="task">In jedem Stein steht die Summe der beiden Steine darunter. Trage die fehlenden Zahlen ein.</p>'+build(false)+'</div>',
      sol:'<div class="sheet sol"><h2>Lösung · Zahlenmauer</h2>'+build(true)+'</div>'
    };
  }
  function su(diff){
    var d=G.DIFF[diff], o=G.sudoku(d.sud);
    function tbl(sol){var s='<table class="sud">';for(var r=0;r<4;r++){s+='<tr>';for(var c=0;c<4;c++){var v=sol?o.solution[r][c]:o.puzzle[r][c];if(v){s+='<td class="gv">'+v+'</td>';}else{s+='<td class="bl">.</td>';}}s+='</tr>';}return s+'</table>';}
    return {
      puz:'<div class="sheet"><h2>Mini-Sudoku</h2><p class="task">Fülle das Gitter mit 1 bis 4. In jeder Zeile, jeder Spalte und jedem 2×2-Feld darf jede Zahl nur einmal stehen.</p>'+tbl(false)+'</div>',
      sol:'<div class="sheet sol"><h2>Lösung · Mini-Sudoku</h2>'+tbl(true)+'</div>'
    };
  }
  function mz(diff){
    var d=G.DIFF[diff], m=G.maze(d.mz[0],d.mz[1]);
    return {
      puz:'<div class="sheet"><h2>Labyrinth</h2><p class="task">Finde den Weg von <span class="mztag s">Start</span> (oben links) zum <span class="mztag z">Ziel</span> (unten rechts).</p><div class="mzwrap"><span class="mztag s">Start&nbsp;&#9654;</span>'+G.mazeSVG(m,false)+'<span class="mztag z">&#9654;&nbsp;Ziel</span></div></div>',
      sol:'<div class="sheet sol"><h2>Lösung · Labyrinth</h2>'+G.mazeSVG(m,true)+'</div>'
    };
  }

  function build(){
    var theme=$('ctheme').value, diff=$('cdiff').value, title=$('ctitle').value||'Rätselheft';
    var parts=[];
    if($('c_ws').checked)parts.push(ws(theme,diff));
    if($('c_zm').checked)parts.push(zm(diff));
    if($('c_su').checked)parts.push(su(diff));
    if($('c_mz').checked)parts.push(mz(diff));
    var today=new Date().toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'});
    var cover='<div class="sheet heft-cover"><div class="eyebrow" style="color:var(--gold);font-weight:800;letter-spacing:.14em;text-transform:uppercase">Knobelspaß</div><h2>'+esc(title)+'</h2><p class="task">Name: ____________________________</p><p class="task" style="color:var(--muted)">'+parts.length+' Rätsel · '+today+' · Dr. Edmund Bruns</p></div>';
    var puz=parts.map(function(p){return p.puz;}).join('');
    var sols=parts.length?('<div class="sheet sol"><div class="solhead">Lösungen</div></div>'+parts.map(function(p){return p.sol;}).join('')):'';
    $('heft').innerHTML=cover+puz+sols;
  }

  $('gen').addEventListener('click', build);
  $('print').addEventListener('click', function(){ window.print(); });
  var showing=false;
  $('soltoggle').addEventListener('click', function(){ showing=!showing; document.body.classList.toggle('showsol',showing); this.textContent=showing?'Lösungen verstecken':'Lösungen zeigen'; });
  build();
})();
