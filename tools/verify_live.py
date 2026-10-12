import os, hashlib, requests, concurrent.futures as cf, re
B='https://www.edmundbruns.com'; root='upload'
home=requests.get(B+'/').content; HH=hashlib.md5(home).hexdigest()
files=[os.path.relpath(os.path.join(d,f),root) for d,_,fs in os.walk(root) for f in fs]
def chk(rel):
    url=B+'/'+rel
    if rel.endswith('index.html'): url=B+'/'+rel[:-10]
    elif rel.endswith('.html'): url=B+'/'+rel[:-5]
    try:
        r=requests.get(url,timeout=60)
    except Exception as e: return (rel,'ERR')
    if r.status_code!=200: return (rel,r.status_code)
    loc=open(os.path.join(root,rel),'rb').read()
    if rel.endswith('.html'):
        if rel!='index.html' and hashlib.md5(r.content).hexdigest()==HH: return (rel,'FALLBACK')
        t=re.search(rb'<title>(.*?)</title>',loc); 
        if t and t.group(1) not in r.content: return (rel,'TITLE?')
        return None
    if hashlib.md5(r.content).hexdigest()!=hashlib.md5(loc).hexdigest(): return (rel,'DIFF %d/%d'%(len(r.content),len(loc)))
    return None
with cf.ThreadPoolExecutor(16) as ex: res=[x for x in ex.map(chk,files) if x]
print('geprüft',len(files),'Abweichungen',len(res))
for x in res[:40]: print(x)