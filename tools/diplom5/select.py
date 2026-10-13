import csv,json,chess,sys,random
from collections import defaultdict
used=set()
for m in json.load(open('/tmp/w/d4course.json')):
    used.add(m['example']['puzzleId'])
    for e in m['exercises'].values():
        for p in [e['main'],*e['practice']]: used.add(p['puzzleId'])
for m in json.load(open('/tmp/w/v36/content.json')):
    for e in m['exercises'].values(): used.add(e['puzzleId'])
P,N,B,R,Q,K=chess.PAWN,chess.KNIGHT,chess.BISHOP,chess.ROOK,chess.QUEEN,chess.KING
def cnt(b,c,t): return len(b.pieces(t,c))
def mat(b,c): return {t:cnt(b,c,t) for t in (P,N,B,R,Q)}
def only(b,c,**k):
    m=mat(b,c);want={P:k.get('p'),N:k.get('n',0),B:k.get('bi',0),R:k.get('r',0),Q:k.get('q',0)}
    for t,v in want.items():
        if v is None: continue
        if isinstance(v,tuple):
            if not(v[0]<=m[t]<=v[1]): return False
        elif m[t]!=v: return False
    return True
def relrank(sq,c): r=chess.square_rank(sq); return r+1 if c==chess.WHITE else 8-r
def passed(b,sq,c):
    f=chess.square_file(sq);r=chess.square_rank(sq)
    for ff in (f-1,f,f+1):
        if 0<=ff<8:
            for s in b.pieces(P,not c):
                if chess.square_file(s)==ff and ((c and chess.square_rank(s)>r) or (not c and chess.square_rank(s)<r)): return False
    return True
win={'crushing','advantage','mate','mateIn1','mateIn2','mateIn3'}
FIRST=[None]
def qsac(b,me):
    mv=FIRST[0]
    if mv is None or b.piece_type_at(mv.from_square)!=Q: return False
    bb=b.copy();bb.push(mv)
    return bb.is_attacked_by(not me,mv.to_square) and not bb.is_check() or (bb.is_attacked_by(not me,mv.to_square) and len(bb.attackers(not me,mv.to_square))>0 and b.piece_type_at(mv.to_square) in (None,P,N,B))
def M(id,title,group,pred): return dict(id=id,title=title,group=group,pred=pred)
def rookbehind(b,me,th):
    for s in b.pieces(P,me):
        if passed(b,s,me) and relrank(s,me)>=5:
            for rr in b.pieces(R,me):
                if chess.square_file(rr)==chess.square_file(s) and ((me and chess.square_rank(rr)<chess.square_rank(s)) or (not me and chess.square_rank(rr)>chess.square_rank(s))): return True
    return False
MODS=[
 M('k01','Lucena-Stellung: Brückenbau','Turmendspiele',lambda b,me,th:'rookEndgame' in th and only(b,me,r=1,p=(1,2)) and only(b,not me,r=1,p=(0,1)) and any(relrank(s,me)>=6 and passed(b,s,me) for s in b.pieces(P,me)) and bool(th&win) and chess.square_distance(b.king(me),max(b.pieces(P,me),key=lambda s:relrank(s,me)))<=1),
 M('k02','Philidor und Turmverteidigung','Turmendspiele',lambda b,me,th:'rookEndgame' in th and ('equality' in th or 'defensiveMove' in th) and only(b,me,r=1,p=(0,4)) and only(b,not me,r=1,p=(1,5)) and mat(b,me)[P]<mat(b,not me)[P]),
 M('k03','Der aktive Turm','Turmendspiele',lambda b,me,th:'rookEndgame' in th and only(b,me,r=1,p=(1,5)) and only(b,not me,r=1,p=(1,5)) and bool(th&win) and 'promotion' not in th and any(relrank(s,me)==7 for s in b.pieces(R,me))),
 M('k04','Turm hinter dem Freibauern','Turmendspiele',lambda b,me,th:'rookEndgame' in th and only(b,me,r=1,p=(1,5)) and only(b,not me,r=1,p=(0,5)) and bool(th&win) and rookbehind(b,me,th)),
 M('k05','Dame gegen Bauer und Damenendspiele','Weitere Endspiele',lambda b,me,th:('queenEndgame' in th) and only(b,me,q=1,p=(0,4)) and only(b,not me,q=(0,1),p=(0,4)) and bool(th&win)),
 M('k06','Springerendspiele','Weitere Endspiele',lambda b,me,th:'knightEndgame' in th and only(b,me,n=1,p=(0,6)) and only(b,not me,n=1,p=(0,6)) and bool(th&win)),
 M('k07','Läufer gegen Springer','Weitere Endspiele',lambda b,me,th:'endgame' in th and bool(th&win) and ((only(b,me,bi=1,p=(0,6)) and only(b,not me,n=1,p=(0,6))) or (only(b,me,n=1,p=(0,6)) and only(b,not me,bi=1,p=(0,6))))),
 M('k08','Opposition und Zugzwang','Weitere Endspiele',lambda b,me,th:'pawnEndgame' in th and ('zugzwang' in th or 'quietMove' in th) and bool(th&win) and 'promotion' not in th),
 M('k09','Zwischenzug','Taktik',lambda b,me,th:'intermezzo' in th and bool(th&win)),
 M('k10','Ablenkung und Überlastung','Taktik',lambda b,me,th:'deflection' in th and 'attraction' not in th and bool(th&win)),
 M('k11','Hinlenkung','Taktik',lambda b,me,th:'attraction' in th and bool(th&win)),
 M('k12','Räumung und Verstellung','Taktik',lambda b,me,th:('clearance' in th or 'interference' in th) and bool(th&win)),
 M('k13','Abzug und Doppelschach','Taktik',lambda b,me,th:('doubleCheck' in th or 'discoveredAttack' in th) and bool(th&win)),
 M('k14','Ersticktes Matt','Taktik',lambda b,me,th:'smotheredMate' in th),
 M('k15','Opferangriff auf den König','Taktik',lambda b,me,th:'kingsideAttack' in th and 'sacrifice' in th and bool(th&win)),
 M('k16','Der leise Zug: Studienideen','Studien und Partiepraxis',lambda b,me,th:'quietMove' in th and 'endgame' in th and bool(th&win) and 'pawnEndgame' not in th),
 M('k17','Unterverwandlung','Studien und Partiepraxis',lambda b,me,th:'underPromotion' in th),
 M('k18','Schmunzelschach: Überraschende Damenopfer','Studien und Partiepraxis',lambda b,me,th:qsac(b,me) and bool(th&win)),
 M('k19','Partiepraxis: Meisterpartien','Studien und Partiepraxis',lambda b,me,th:('masterVsMaster' in th) and 'middlegame' in th and bool(th&win)),
]
BANDS={'example':(1050,1500),'aufbau':(1300,1650),'fortgeschritten':(1650,1950),'meister':(1950,2450)}
pool=defaultdict(list)
rd=csv.DictReader(open('/tmp/d5/db/cand.csv'))
for row in rd:
    if row['PuzzleId'] in used: continue
    th=set(row['Themes'].split())
    b=chess.Board(row['FEN']);mv=row['Moves'].split()
    try: b.push_uci(mv[0])
    except: continue
    me=b.turn;r=int(row['Rating']);L=len(mv)
    FIRST[0]=chess.Move.from_uci(mv[1])
    for m in MODS:
        if L!=6 and m['id'] not in ('k01','k02','k14','k17'): continue
        try: ok=m['pred'](b,me,th)
        except Exception: ok=False
        if ok:
            for band,(lo,hi) in BANDS.items():
                if lo<=r<=hi: pool[(m['id'],band)].append((row['PuzzleId'],r,int(row['Popularity']),int(row['NbPlays']),row['FEN'],row['Moves'],row['Themes'],row['GameUrl']))
for m in MODS:
    print(m['id'],m['title'][:30].ljust(30),{bd:len(pool[(m['id'],bd)]) for bd in BANDS})
json.dump({f'{k[0]}|{k[1]}':v for k,v in pool.items()},open('/tmp/d5/pool.json','w'))
json.dump([{k:v for k,v in m.items() if k!='pred'} for m in MODS],open('/tmp/d5/mods.json','w'),ensure_ascii=False)
