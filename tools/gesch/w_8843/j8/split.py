import sys, os
from PIL import Image
D='/tmp/claude-0/-home-claude/69a08ffa-3513-56f3-855c-86cc8c62b736/scratchpad/shots/'
for name in sys.argv[1:]:
    os.makedirs(D+'parts', exist_ok=True)
    for f in os.listdir(D+'parts'):
        if f.startswith(name): os.remove(D+'parts/'+f)
    im=Image.open(D+name+'.png'); w,h=im.size
    step=1600 if w<500 else 1400
    for i in range(0,h,step):
        im.crop((0,i,w,min(h,i+step))).save(f'{D}parts/{name}_{i//step:02d}.png')
    print(name, w, h, (h+step-1)//step)
