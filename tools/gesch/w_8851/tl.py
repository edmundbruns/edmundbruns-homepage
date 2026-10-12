from common import esc
def timeline_svg(items, label, wrap=24):
    rows=[]
    for j,t in items:
        words=t.split(' '); lines=['']
        for w in words:
            if len(lines[-1])+len(w)>wrap: lines.append(w)
            else: lines[-1]=(lines[-1]+' '+w).strip()
        rows.append((j,lines))
    y=30; parts=[]
    for j,lines in rows:
        hgt=max(1,len(lines))*23
        cy=y+hgt/2
        parts.append(f'<circle cx="78" cy="{cy:.0f}" r="10" fill="#fff" stroke="#aa6d18" stroke-width="3"/>')
        parts.append(f'<text x="60" y="{cy+6:.0f}" text-anchor="end" font-size="19" font-weight="800" fill="#8a4317">{esc(str(j))}</text>')
        for k,ln in enumerate(lines):
            parts.append(f'<text x="100" y="{y+17+k*23:.0f}" font-size="19" fill="#2a1c12">{esc(ln)}</text>')
        y+=hgt+22
    h=y+8
    return (f'<svg class="pic" viewBox="0 0 380 {h}" role="img" aria-label="{esc(label)}" style="max-width:520px;margin:auto">'
            f'<rect width="380" height="{h}" fill="#fbfaf6"/><line x1="78" y1="16" x2="78" y2="{h-12}" stroke="#8a4317" stroke-width="4"/>'
            + ''.join(parts) + '</svg>')
