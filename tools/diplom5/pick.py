import json,chess
pool=json.load(open('/tmp/d5/pool.json'));mods=json.load(open('/tmp/d5/mods.json'))
P=chess.PAWN
def bonus(mid,c):
    pid,r,pop,plays,fen,moves,th,url=c
    b=chess.Board(fen);mv=moves.split();b.push_uci(mv[0]);me=b.turn;s=0
    if len(mv)==6: s+=3
    if mid=='k01':
        ps=list(b.pieces(P,me))
        if len(ps)==1 and not b.pieces(P,not me): s+=3
        if ps and max((chess.square_rank(x)+1 if me else 8-chess.square_rank(x)) for x in ps)==7: s+=2
    if mid=='k02' and 'equality' in th: s+=2
    if mid=='k15' and chess.Move.from_uci(mv[1]).to_square in (chess.H7,chess.H2) and b.piece_type_at(chess.parse_square(mv[1][:2]))==chess.BISHOP: s+=4
    return s
TARGET={'example':1300,'aufbau':1480,'fortgeschritten':1800,'meister':2150}
out={}
for m in mods:
    for band in TARGET:
        c=pool.get(f"{m['id']}|{band}",[])
        c=[x for x in c if x[2]>=88]
        c.sort(key=lambda x:(-bonus(m['id'],x),-min(x[3],20000)*x[2]/100,abs(x[1]-TARGET[band])))
        seen=set();lst=[]
        for x in c:
            g=x[7].split('#')[0].split('/')[3][:8] if x[7] else x[0]
            if g in seen: continue
            seen.add(g);lst.append(x)
            if len(lst)>=12: break
        out[f"{m['id']}|{band}"]=lst
json.dump(out,open('/tmp/d5/shortlist.json','w'))
for k,v in out.items():
    if len(v)<4: print('KNAPP',k,len(v))
print('ok',len(out))
