import os,json,re
files=[]
for d,_,fs in os.walk('.'):
    if d.startswith('./.git') or d.startswith('./download'): continue
    for f in fs:
        p=os.path.join(d,f)[2:]
        if p in ('sw.js','build_sw.py') or p.startswith('.'): continue
        files.append(p)
files.sort()
v=1
if os.path.exists('sw.js'):
    m=re.search(r"mathacademy-v(\d+)",open('sw.js').read()); v=int(m.group(1))+1 if m else 1
open('sw.js','w').write("var CACHE = 'mathacademy-v%d';\nvar ASSETS = %s;\nself.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return Promise.all(ASSETS.map(function (a) { return c.add(a).catch(function () {}); })); }).then(function () { return self.skipWaiting(); })); });\nself.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.map(function (k) { if (k !== CACHE) return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });\nself.addEventListener('fetch', function (e) { if (e.request.method !== 'GET') return; e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) { return r || fetch(e.request); })); });\n"%(v,json.dumps(['./']+files)))
print('v',v,len(files))
