import sys
from playwright.sync_api import sync_playwright
from PIL import Image
nr=sys.argv[1]; vw=int(sys.argv[2]) if len(sys.argv)>2 else 390
with sync_playwright() as p:
    b=p.chromium.launch(); pg=b.new_page(viewport={'width':vw,'height':900})
    pg.goto(f'http://localhost:8842/geschichte/klasse-8/{nr}/')
    n=pg.locator('.svgwrap').count(); ims=[]
    for i in range(n):
        f=f'shots/svg{nr}_{i}.png'; pg.locator('.svgwrap').nth(i).screenshot(path=f); ims.append(Image.open(f))
    b.close()
W=max(i.width for i in ims); H=sum(i.height for i in ims)
m=Image.new('RGB',(W,H),'white'); y=0
for i in ims: m.paste(i,(0,y)); y+=i.height
m.save(f'shots/svg{nr}.png'); print(n)
