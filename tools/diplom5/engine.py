import json,chess,chess.engine,sys
SF='/tmp/sf/stockfish/stockfish-ubuntu-x86-64-avx2'
short=json.load(open('/tmp/d5/shortlist.json'));mods=json.load(open('/tmp/d5/mods.json'))
eng=chess.engine.SimpleEngine.popen_uci(SF);eng.configure({'Threads':8,'Hash':512})
D=chess.engine.Limit(depth=11)
def val(s,turn): return s.pov(turn).score(mate_score=100000)
def analyse_pos(b,sol_uci):
    side=b.turn;n=b.legal_moves.count()
    info=eng.analyse(b,D,multipv=n)
    res={}
    for i in info:
        mv=i['pv'][0];v=val(i['score'],side);rep=i['pv'][1].uci() if len(i['pv'])>1 else None
        res[mv.uci()]=(v,rep,i['score'].pov(side))
    sol=chess.Move.from_uci(sol_uci)
    if sol_uci not in res:
        i=eng.analyse(b,D,root_moves=[sol]);res[sol_uci]=(val(i['score'],side),None,i['score'].pov(side))
    best=max(v for v,_,_ in res.values());sv=res[sol_uci][0]
    okv= sv>=best-60 or (sv>=90000 and best>=90000) or (sv>=600 and best>=600 and sv>=best-200)
    a=[];r={}
    for u,(v,rep,sc) in res.items():
        if u==sol_uci: continue
        bb=b.copy();bb.push_uci(u)
        if bb.is_checkmate(): continue
        if v>=sv-50 or (sv>=90000 and v>=90000) or (sv>=600 and v>=600 and v>=sv-150) or (abs(sv)<=60 and abs(v)<=60 and sv<300):
            a.append(u);continue
        if bb.is_stalemate(): code='p'
        elif sc.is_mate() and sc.mate()<0: code='m'
        elif v<=-300: code='d'
        elif v<-80: code='l'
        elif v<200: code='e'
        else: code='w'
        r[u]=[rep or '',code]
    return okv,sv,a,r
picked={};usedids=set();report=[]
for m in mods:
    for band,need in [('example',1),('aufbau',3),('fortgeschritten',3),('meister',3)]:
        got=[]
        for c in short[f"{m['id']}|{band}"]:
            pid,rating,pop,plays,fen,moves,th,url=c
            if pid in usedids: continue
            mv=moves.split();b=chess.Board(fen);b.push_uci(mv[0]);start=b.fen();sol=mv[1:]
            ok=True;check={};evals=[]
            for i,u in enumerate(sol):
                if i%2==0:
                    okv,sv,a,r=analyse_pos(b,u)
                    if not okv: ok=False;break
                    check[str(i)]={'a':a,'r':r};evals.append(sv)
                b.push_uci(u)
            if not ok: continue
            got.append(dict(puzzleId=pid,rating=rating,popularity=pop,plays=plays,originalFen=fen,fen=start,opponentMove=mv[0],solution=sol,lichessThemes=th.split(),gameUrl=url,check=check,evals=evals))
            usedids.add(pid)
            if len(got)>=need: break
        picked[f"{m['id']}|{band}"]=got
        report.append(f"{m['id']} {band}: {len(got)}/{need} {[g['puzzleId']+':'+str(g['rating']) for g in got]}")
        print(report[-1],flush=True)
eng.quit()
json.dump(picked,open('/tmp/d5/picked.json','w'))
