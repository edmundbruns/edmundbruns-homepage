/* Rätselheft-Generator: erzeugt Suchsel, Zahlenmauer, Mini-Sudoku und Labyrinth. */
(function(){
  var R=function(a,b){return Math.floor(Math.random()*(b-a+1))+a;};
  function shuffle(a){for(var i=a.length-1;i>0;i--){var j=R(0,i);var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  var ABC="ABCDEFGHIKLMNOPRSTUVWZ";

  var THEMES={
    Tiere:["HUND","KATZE","MAUS","PFERD","HASE","FISCH","VOGEL","IGEL","KUH","ENTE","ESEL","REH"],
    Schule:["TAFEL","KREIDE","HEFT","STIFT","BUCH","PAUSE","LEHRER","NOTE","MAPPE","LINEAL"],
    Natur:["BAUM","BLUME","WIESE","FLUSS","BERG","WOLKE","SONNE","REGEN","BLATT","STEIN"]
  };
  var DIFF={
    leicht:{ws:9,wn:7,diag:false,rev:false,zm:4,zmax:6,sud:5,mz:[11,7]},
    mittel:{ws:11,wn:9,diag:true,rev:false,zm:4,zmax:8,sud:7,mz:[13,9]},
    schwer:{ws:13,wn:10,diag:true,rev:true,zm:5,zmax:9,sud:9,mz:[15,11]}
  };

  // ---- Suchsel ----
  function wordSearch(N,words,diag,rev){
    var grid=[];for(var i=0;i<N;i++){grid.push(new Array(N).fill(null));}
    var dirs=[[1,0],[0,1]]; if(diag){dirs.push([1,1]);dirs.push([1,-1]);}
    var placed=[];
    function fits(w,r,c,dr,dc){for(var i=0;i<w.length;i++){var rr=r+dr*i,cc=c+dc*i;if(rr<0||rr>=N||cc<0||cc>=N)return false;var g=grid[rr][cc];if(g!==null&&g!==w[i])return false;}return true;}
    words.slice().sort(function(a,b){return b.length-a.length;}).forEach(function(w0){
      var w = (rev&&R(0,1))? w0.split('').reverse().join(''):w0;
      for(var t=0;t<400;t++){var d=dirs[R(0,dirs.length-1)];var r=R(0,N-1),c=R(0,N-1);
        if(fits(w,r,c,d[0],d[1])){var cells=[];for(var i=0;i<w.length;i++){var rr=r+d[0]*i,cc=c+d[1]*i;grid[rr][cc]=w[i];cells.push([rr,cc]);}placed.push({word:w0,cells:cells});break;}}
    });
    for(var r=0;r<N;r++)for(var c=0;c<N;c++)if(grid[r][c]===null)grid[r][c]=ABC[R(0,ABC.length-1)];
    return {grid:grid,placed:placed,words:words};
  }

  // ---- Zahlenmauer ----
  function numberWall(base,maxv){
    var b=[];for(var i=0;i<base;i++)b.push(R(1,maxv));
    var lv=[b];while(lv[lv.length-1].length>1){var p=lv[lv.length-1],n=[];for(var i=0;i<p.length-1;i++)n.push(p[i]+p[i+1]);lv.push(n);}
    return lv;
  }

  // ---- Mini-Sudoku 4x4 ----
  function sudoku(removals){
    var base=[[1,2,3,4],[3,4,1,2],[2,1,4,3],[4,3,2,1]];
    // permutieren fuer Abwechslung
    var perm=shuffle([1,2,3,4]);var sol=base.map(function(row){return row.map(function(v){return perm[v-1];});});
    // Zeilen/Spalten innerhalb der Baender tauschen
    function swapRows(a,b){var t=sol[a];sol[a]=sol[b];sol[b]=t;}
    if(R(0,1))swapRows(0,1); if(R(0,1))swapRows(2,3);
    var cells=[];for(var r=0;r<4;r++)for(var c=0;c<4;c++)cells.push([r,c]);
    shuffle(cells);var hide={};for(var i=0;i<removals;i++){hide[cells[i][0]+'-'+cells[i][1]]=1;}
    var puz=sol.map(function(row,r){return row.map(function(v,c){return hide[r+'-'+c]?0:v;});});
    return {puzzle:puz,solution:sol};
  }

  // ---- Labyrinth ----
  function maze(cols,rows){
    var vis=[];for(var i=0;i<rows;i++)vis.push(new Array(cols).fill(false));
    var edges={};function key(a,b){return a[0]+','+a[1]+'|'+b[0]+','+b[1];}
    function open(a,b){edges[key(a,b)]=1;edges[key(b,a)]=1;}
    var st=[[0,0]];vis[0][0]=true;
    while(st.length){var cur=st[st.length-1],r=cur[0],c=cur[1];var opts=[];
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var rr=r+d[0],cc=c+d[1];if(rr>=0&&rr<rows&&cc>=0&&cc<cols&&!vis[rr][cc])opts.push([rr,cc]);});
      if(opts.length){var nx=opts[R(0,opts.length-1)];vis[nx[0]][nx[1]]=true;open(cur,nx);st.push(nx);}else st.pop();}
    return {edges:edges,cols:cols,rows:rows,isOpen:function(a,b){return edges[key(a,b)]===1;}};
  }
  function solveMaze(m){
    var start=[0,0],goal=[m.rows-1,m.cols-1],q=[start],prev={},seen={};seen['0,0']=1;
    while(q.length){var cur=q.shift();if(cur[0]===goal[0]&&cur[1]===goal[1])break;
      [[1,0],[-1,0],[0,1],[0,-1]].forEach(function(d){var rr=cur[0]+d[0],cc=cur[1]+d[1],k=rr+','+cc;
        if(rr>=0&&rr<m.rows&&cc>=0&&cc<m.cols&&m.isOpen(cur,[rr,cc])&&!seen[k]){seen[k]=1;prev[k]=cur;q.push([rr,cc]);}});}
    var path=[],n=goal;while(n){path.push(n);n=prev[n[0]+','+n[1]];}return path.reverse();
  }
  function mazeSVG(m,solution){
    var cell=26,pad=6,W=m.cols*cell+pad*2,H=m.rows*cell+pad*2,s='<svg viewBox="0 0 '+W+' '+H+'" class="mz-svg" xmlns="http://www.w3.org/2000/svg">';
    s+='<rect x="0" y="0" width="'+W+'" height="'+H+'" fill="#fff"/>';
    function L(x1,y1,x2,y2){s+='<line x1="'+(x1+pad)+'" y1="'+(y1+pad)+'" x2="'+(x2+pad)+'" y2="'+(y2+pad)+'" stroke="#14292c" stroke-width="2" stroke-linecap="round"/>';}
    for(var r=0;r<m.rows;r++)for(var c=0;c<m.cols;c++){var x=c*cell,y=r*cell;
      if(r===0&&!(c===0))L(x,y,x+cell,y);
      if(c===0)L(x,y,x,y+cell);
      if(c===m.cols-1)L(x+cell,y,x+cell,y+cell); else if(!m.isOpen([r,c],[r,c+1]))L(x+cell,y,x+cell,y+cell);
      if(r===m.rows-1){ if(!(c===m.cols-1))L(x,y+cell,x+cell,y+cell); } else if(!m.isOpen([r,c],[r+1,c]))L(x,y+cell,x+cell,y+cell);
    }
    if(solution){var p=solveMaze(m),pts=p.map(function(cc){return ((cc[1]*cell+cell/2)+pad)+','+((cc[0]*cell+cell/2)+pad);});
      s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="#a55a12" stroke-width="'+(cell*0.3)+'" stroke-linejoin="round" stroke-linecap="round"/>';}
    s+='</svg>';return s;
  }

  window.HeftGen={R:R,shuffle:shuffle,THEMES:THEMES,DIFF:DIFF,wordSearch:wordSearch,numberWall:numberWall,sudoku:sudoku,maze:maze,solveMaze:solveMaze,mazeSVG:mazeSVG};
})();
