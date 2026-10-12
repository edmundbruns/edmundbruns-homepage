import sys
from PIL import Image
f=sys.argv[1]; h=int(sys.argv[2]) if len(sys.argv)>2 else 1600
im=Image.open(f); W,H=im.size
n=0
for y in range(0,H,h):
    im.crop((0,y,W,min(H,y+h))).save(f.replace('.png',f'_c{n}.png')); n+=1
print(W,H,n)
