#!/usr/bin/env python3
"""Erzeugt die Kursdaten für das Ludgerus-Schachdiplom 5 aus den engine-geprüften Lichess-Aufgaben."""
import json, re, sys, chess
sys.path.insert(0, '/tmp/d5')
from modtexts import TEXTS

picked = json.load(open('/tmp/d5/picked.json'))
mods = json.load(open('/tmp/d5/mods.json'))

DE = {'K': 'K', 'Q': 'D', 'R': 'T', 'B': 'L', 'N': 'S'}
def de(s): return re.sub(r'=([QRBN])', lambda m: '=' + DE[m.group(1)], re.sub(r'^[KQRBN]', lambda m: DE[m.group(0)], s))
NAME = {chess.PAWN: 'Bauer', chess.KNIGHT: 'Springer', chess.BISHOP: 'Läufer', chess.ROOK: 'Turm', chess.QUEEN: 'Dame', chess.KING: 'König'}
DAT = {chess.PAWN: 'einem Bauern', chess.KNIGHT: 'dem Springer', chess.BISHOP: 'einem Läufer', chess.ROOK: 'einem Turm', chess.QUEEN: 'der Dame', chess.KING: 'dem König'}
ART = {chess.PAWN: 'den Bauern', chess.KNIGHT: 'den Springer', chess.BISHOP: 'den Läufer', chess.ROOK: 'den Turm', chess.QUEEN: 'die Dame'}
NOM = {chess.PAWN: 'Der Bauer', chess.KNIGHT: 'Der Springer', chess.BISHOP: 'Der Läufer', chess.ROOK: 'Der Turm', chess.QUEEN: 'Die Dame', chess.KING: 'Der König'}

MOTIFS = {
 'Brückenbau': 'Der Turm stellt sich zwischen König und gegnerische Schachgebote.',
 'Aktive Verteidigung': 'Der Verteidiger hält die Stellung mit aktiven Figuren statt passiv zu warten.',
 'Aktiver Turm': 'Der Turm greift von einer offenen Reihe oder Linie Ziele an.',
 'Turm hinter dem Freibauern': 'Der Turm unterstützt den Freibauern von hinten.',
 'Damenschachs': 'Die Dame gewinnt mit Schachgeboten Zeit oder Material.',
 'Springergabel': 'Der Springer greift zwei Ziele gleichzeitig an.',
 'Leichtfigur besser als die andere': 'Eine Leichtfigur nutzt ihre Stärken gegen die andere aus.',
 'Zugzwang': 'Die Gegenseite muss ziehen und verschlechtert dadurch ihre Stellung.',
 'Zwischenzug': 'Ein eingeschobener Zug vor dem erwarteten Zurückschlagen.',
 'Ablenkung': 'Eine verteidigende Figur wird von ihrer Aufgabe weggezogen.',
 'Hinlenkung': 'Eine gegnerische Figur wird auf ein ungünstiges Feld gelockt.',
 'Räumung': 'Eine eigene Figur macht ein Feld oder eine Linie mit Tempo frei.',
 'Abzugsangriff': 'Eine Figur zieht weg und gibt einer anderen den Angriff frei.',
 'Ersticktes Matt': 'Ein Springer setzt einen König matt, den eigene Figuren einsperren.',
 'Opfer': 'Material wird gegeben, um den König anzugreifen.',
 'Ruhiger Zug': 'Ein Zug ohne Schach und ohne Schlagen, der trotzdem entscheidet.',
 'Unterverwandlung': 'Ein Bauer wandelt in eine andere Figur als die Dame um.',
 'Damenopfer': 'Die Dame wird geopfert, damit danach Matt oder großer Gewinn folgt.',
 'Gabel': 'Eine Figur greift zwei Ziele gleichzeitig an.',
 'Fesselung': 'Eine Figur darf nicht ziehen, weil dahinter eine wertvollere steht.',
 'Spieß': 'Eine wertvolle Figur muss ausweichen, und die Figur dahinter fällt.',
 'Grundreihenmatt': 'Der König wird auf der Grundreihe von den eigenen Bauern eingesperrt.',
 'Doppelschach': 'Zwei Figuren geben gleichzeitig Schach.',
 'Schlag des Verteidigers': 'Die Figur, die etwas schützt, wird geschlagen.',
 'Ungedeckte Figur': 'Eine Figur steht ohne Schutz und kann gewonnen werden.',
 'Freibauer': 'Ein Bauer ohne gegnerische Bauern vor sich läuft zur Umwandlung.',
}
LICHESS_MOTIF = [('smotheredMate','Ersticktes Matt'),('doubleCheck','Doppelschach'),('backRankMate','Grundreihenmatt'),('underPromotion','Unterverwandlung'),
 ('intermezzo','Zwischenzug'),('discoveredAttack','Abzugsangriff'),('deflection','Ablenkung'),('attraction','Hinlenkung'),('clearance','Räumung'),
 ('skewer','Spieß'),('fork','Gabel'),('pin','Fesselung'),('capturingDefender','Schlag des Verteidigers'),('sacrifice','Opfer'),('quietMove','Ruhiger Zug'),
 ('hangingPiece','Ungedeckte Figur'),('advancedPawn','Freibauer')]
DISTRACT = ['Fesselung', 'Grundreihenmatt', 'Spieß', 'Gabel', 'Zugzwang', 'Zwischenzug', 'Ablenkung', 'Hinlenkung', 'Ruhiger Zug', 'Unterverwandlung', 'Doppelschach', 'Opfer']

TITLE_OVERRIDE = {'k01': 'Turm und Bauer gegen Turm (Lucena)', 'k02': 'Turmendspiele verteidigen (Philidor)'}
PRACTICE_EXAMPLES = {
 'k01': dict(fen='6K1/4k1P1/8/8/8/7r/8/5R2 w - - 0 1', solution=['f1e1','e7d7','e1e4','d7d6','g8f7','h3f3','f7g6'],
   url='https://lichess.org/study/pqUSUw8Y/tAcIEIbG', goal='Du spielst Weiß. Lucena-Stellung: Bring deinen König aus dem Umwandlungsfeld heraus.',
   steps=['Weiß spielt Te1+: Der Turm gibt Schach und schneidet den schwarzen König von der e-Linie ab. Er kann nicht mehr zum Bauern.',
          'Schwarz spielt Kd7: Der König weicht aus.',
          'Weiß spielt Te4: Das ist der Brückenbau. Der Turm stellt sich auf die vierte Reihe. Später kann er sich auf g4 zwischen König und Schachs stellen.',
          'Schwarz spielt Kd6: Schwarz wartet.',
          'Weiß spielt Kf7: Der König verlässt endlich das Feld vor dem Bauern.',
          'Schwarz spielt Tf3+: Schwarz gibt Schach von der Seite.',
          'Weiß spielt Kg6: Der König geht weiter. Kommt das nächste Schach auf der g-Linie, blockt der Turm auf g4. Der Bauer wandelt um.'],
   fazit='Das Ziel ist erreicht: Weiß gewinnt. Merke dir die Reihenfolge: abschneiden, Brücke bauen, König heraus.'),
 'k02': dict(fen='1r2k3/R7/8/4PK2/8/8/8/8 b - - 0 1', solution=['b8b6','e5e6','b6b1','f5f6','b1f1','f6e5','f1e1'],
   url='https://lichess.org/study/pqUSUw8Y/CvqYotss', goal='Du spielst Schwarz. Philidor-Stellung: Halte das Remis gegen Turm und Bauer.',
   steps=['Schwarz spielt Tb6: Der Turm geht auf die sechste Reihe. So kommt der weiße König nicht nach vorn.',
          'Weiß spielt e6: Der Bauer rückt vor. Jetzt hat der weiße König kein Versteck mehr vor dem Bauern.',
          'Schwarz spielt Tb1: Sofort geht der Turm nach hinten. Ab jetzt gibt er Schach von hinten.',
          'Weiß spielt Kf6: Weiß droht Matt auf der achten Reihe.',
          'Schwarz spielt Tf1+: Schach von hinten. Der König findet keinen Schutz.',
          'Weiß spielt Ke5: Der König weicht aus.',
          'Schwarz spielt Te1+: Das nächste Schach. So geht es immer weiter, die Stellung ist remis.'],
   fazit='Das Ziel ist erreicht: Die Stellung ist remis. Merke dir: Turm auf die sechste Reihe, und wenn der Bauer vorrückt, Schachs von hinten.'),
}
def motif_for(mid, th):
    m = TEXTS[mid]['motif']
    if m: return m
    for t, name in LICHESS_MOTIF:
        if t in th: return name
    return 'Opfer'

def side(c): return 'Weiß' if c == chess.WHITE else 'Schwarz'

def note(b, mv, motif=None):
    pt = b.piece_type_at(mv.from_square); san = b.san(mv); cap = b.piece_type_at(mv.to_square)
    if b.is_en_passant(mv): cap = chess.PAWN
    to = chess.square_name(mv.to_square)
    if b.is_castling(mv):
        t = f'{side(b.turn)} spielt {de(san)}: Der König rochiert.'
    else:
        t = f'{side(b.turn)} spielt {de(san)}: {NOM[pt]} zieht nach {to}'
        if cap: t += f' und schlägt {ART[cap]}'
        t += '.'
        if mv.promotion:
            t += f' Der Bauer wird zu{"r" if mv.promotion==chess.QUEEN else "m"} {NAME[mv.promotion]}.'
    bb = b.copy(); bb.push(mv)
    if bb.is_checkmate(): t += ' Schachmatt!'
    elif bb.is_check(): t += ' Schach.'
    if motif: t += f' Motiv: {motif}. {MOTIFS.get(motif, "")}'
    return t.strip()

def goal_text(th, own, learner):
    if any(x.startswith('mate') for x in th): g = 'Setze matt.'
    elif 'equality' in th: g = 'Halte die Stellung. Finde den Weg, der nicht verliert.'
    elif 'advantage' in th: g = 'Erspiele dir einen Vorteil.'
    else: g = 'Erspiele dir einen entscheidenden Vorteil.'
    return f'Du spielst {side(learner)}. {g} Die Lösung hat {own} eigene Züge.'

def fazit(th):
    if any(x.startswith('mate') for x in th): return 'Das Ziel ist erreicht: Die Gegenseite ist schachmatt.'
    if 'equality' in th: return 'Das Ziel ist erreicht: Die Stellung ist gehalten.'
    return 'Das Ziel ist erreicht: Die Stellung ist jetzt klar gewonnen.'

def build_puzzle(p, mid, with_apply, idx_seed):
    b = chess.Board(p['fen']); learner = b.turn
    ob = chess.Board(p['originalFen']); opp_san = ob.san(chess.Move.from_uci(p['opponentMove']))
    th = p['lichessThemes']; motif = motif_for(mid, th)
    notes = []; sans = []
    for i, u in enumerate(p['solution']):
        mv = chess.Move.from_uci(u); sans.append(b.san(mv))
        notes.append(note(b, mv, motif if i == 0 else None)); b.push(mv)
    b0 = chess.Board(p['fen']); m0 = chess.Move.from_uci(p['solution'][0]); pt = b0.piece_type_at(m0.from_square)
    own = (len(p['solution']) + 1) // 2
    hints = [f'Der erste Zug gelingt mit {DAT[pt]}. Stichwort: {motif}. Prüfe zuerst, was die Gegenseite droht und welche Schachgebote und Schlagzüge du hast.',
             f'Achte auf das Feld {chess.square_name(m0.to_square)}. Was passiert, wenn eine deiner Figuren dorthin zieht, und wie antwortet die Gegenseite?']
    out = dict(puzzleId=p['puzzleId'], fen=p['fen'], originalFen=p['originalFen'], opponentMove=p['opponentMove'], opponentMoveSan=opp_san,
               solution=p['solution'], solutionSan=sans, source='lichess', sourceUrl='https://lichess.org/training/' + p['puzzleId'],
               gameUrl=p['gameUrl'], rating=p['rating'], lichessThemes=th, popularity=p['popularity'], plays=p['plays'], pattTraps=False,
               notes=notes, goal=goal_text(th, own, learner), hints=hints, check=p['check'])
    if with_apply:
        q = TEXTS[mid]['question']
        present = {name for t, name in LICHESS_MOTIF if t in th} | {motif}
        ds = [d for d in DISTRACT if d not in present and not (('opfer' in motif.lower()) and ('opfer' in d.lower()))]
        k = idx_seed % len(ds); opts = [ds[k], ds[(k + 5) % len(ds)]]
        correct = idx_seed % 3; opts.insert(correct, motif)
        out.update(question=q,
                   choice=dict(prompt='Welches Motiv steckt in deiner Lösung?', options=opts, correct=correct, explain=f'{motif}: {MOTIFS.get(motif, "")}'),
                   answer=f'Referenzfolge: {" · ".join(de(s) for s in sans)}. Eine gute Antwort nennt den ersten Zug {de(sans[0])} und die wichtigste Antwort {de(sans[1]) if len(sans) > 1 else "der Gegenseite"} und erklärt das Motiv {motif}: {MOTIFS.get(motif, "")}')
    return out

data = []
seed = 0
for m in mods:
    mid = m['id']; T = TEXTS[mid]
    if mid in PRACTICE_EXAMPLES:
        P_ = PRACTICE_EXAMPLES[mid]; bb = chess.Board(P_['fen']); sans = []
        for u in P_['solution']: mv = chess.Move.from_uci(u); sans.append(bb.san(mv)); bb.push(mv)
        example = dict(puzzleId='practice-' + mid, fen=P_['fen'], opponentMove=None, opponentMoveSan='', solution=P_['solution'], solutionSan=sans,
                       sourceUrl=P_['url'], rating=None, goal=P_['goal'], steps=P_['steps'], fazit=P_['fazit'])
    ex = picked[f'{mid}|example'][0]
    exb = build_puzzle(ex, mid, False, 0)
    if mid not in PRACTICE_EXAMPLES: example = dict(puzzleId=exb['puzzleId'], fen=exb['fen'], opponentMove=exb['opponentMove'], opponentMoveSan=exb['opponentMoveSan'],
                   solution=exb['solution'], solutionSan=exb['solutionSan'], sourceUrl=exb['sourceUrl'], rating=exb['rating'],
                   goal=exb['goal'], steps=exb['notes'], fazit=fazit(ex['lichessThemes']))
    exercises = {}
    for lev in ('aufbau', 'fortgeschritten', 'meister'):
        ps = picked[f'{mid}|{lev}']
        assert len(ps) == 3, (mid, lev, len(ps))
        ps = sorted(ps, key=lambda x: x['rating'])
        seed += 1
        exercises[lev] = dict(main=build_puzzle(ps[-1], mid, True, seed), practice=[build_puzzle(x, mid, False, 0) for x in ps[:2]])
    data.append(dict(id=mid, title=TITLE_OVERRIDE.get(mid, m['title']), group=m['group'], concept=T['concept'], themes=[m['group']],
                     planPrompt='Vergleiche mindestens zwei legale Anfangszüge. Prüfe nach jedem Zug die stärkste gegnerische Antwort.',
                     merksatz=T['merksatz'], question=T['question'], exercises=exercises, example=example))
ids = [x for m in data for x in [m['example']['puzzleId']] + [p['puzzleId'] for e in m['exercises'].values() for p in [e['main'], *e['practice']]]]
assert len(ids) == len(set(ids)) == 190, (len(ids), len(set(ids)))
json.dump(data, open('/tmp/d5/content5.json', 'w'), ensure_ascii=False, indent=1)
print('Module', len(data), 'Aufgaben', len(ids))
