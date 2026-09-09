const CACHE_PREFIX='amyra-';
const CACHE=`${CACHE_PREFIX}v16-safety-shortcut`;
const ASSETS=['./','./index.html','./offline.html','./safety.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./icon-maskable-512.png'];
const SENSITIVE=/([?&](token|access_token|refresh_token|password|passwd|session|code|credential|credentials|api[_-]?key|secret)=)|\/(api|auth|login|logout|session|account|profile)(\/|$)/i;
const variesPrivate=r=>{const vary=(r.headers.get('vary')||'').toLowerCase();return vary.split(',').some(v=>{const key=v.trim();return key==='*'||key==='cookie'||key==='authorization'});};
const canCacheResponse=r=>r&&r.ok&&r.status!==206&&r.type==='basic'&&!r.redirected&&!/private|no-store/i.test(r.headers.get('cache-control')||'')&&!r.headers.has('set-cookie')&&!r.headers.has('content-range')&&!variesPrivate(r);
const assetUrl=asset=>new URL(asset,self.location.href).href;
const isShellAsset=url=>ASSETS.some(asset=>assetUrl(asset)===url.href);
const withTimeout=(promise,ms)=>Promise.race([Promise.resolve(promise),new Promise((_,reject)=>setTimeout(()=>reject(new Error('network-timeout')),ms))]);
const updateShell=async response=>{
  if(!canCacheResponse(response))return;
  try{
    const cache=await caches.open(CACHE);
    await cache.put('./index.html',response.clone());
    await cache.put('./',response.clone());
  }catch(_){}
};

self.addEventListener('install',event=>event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  for(const asset of ASSETS){
    try{
      const response=await withTimeout(fetch(asset,{credentials:'omit',cache:'no-store',redirect:'error'}),5000);
      if(canCacheResponse(response))await cache.put(asset,response.clone());
    }catch(_){}
  }
  await self.skipWaiting();
})()));

self.addEventListener('activate',event=>event.waitUntil((async()=>{
  for(const key of await caches.keys())if(key.startsWith(CACHE_PREFIX)&&key!==CACHE)await caches.delete(key);
  if(self.registration.navigationPreload)try{await self.registration.navigationPreload.enable()}catch(_){}
  await self.clients.claim();
})()));

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.headers.has('authorization')||req.headers.has('cookie')||req.headers.has('range')||req.headers.has('if-range')||SENSITIVE.test(url.href))return;

  if(req.mode==='navigate'){
    event.respondWith((async()=>{
      const cachedTarget=await caches.match(req);
      const cached=(await caches.match('./index.html'))||(await caches.match('./'));
      try{
        const preloaded=await withTimeout(event.preloadResponse,2500);
        if(preloaded&&preloaded.ok){if(url.pathname.endsWith('/safety.html')){const cache=await caches.open(CACHE);event.waitUntil(cache.put(req,preloaded.clone()));}else{event.waitUntil(updateShell(preloaded));}return preloaded;}
        const fresh=await withTimeout(fetch(req,{cache:'no-store',redirect:'error'}),4000);
        if(fresh&&fresh.ok){if(url.pathname.endsWith('/safety.html')){const cache=await caches.open(CACHE);event.waitUntil(cache.put(req,fresh.clone()));}else{event.waitUntil(updateShell(fresh));}}
        return fresh;
      }catch(_){
        if(url.pathname.endsWith('/safety.html'))return cachedTarget||(await caches.match('./safety.html'))||cached||(await caches.match('./offline.html'));
        return cached||(await caches.match('./offline.html'))||new Response('AMYRA está offline. Respire devagar e tente novamente quando a conexão voltar.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
      }
    })());
    return;
  }

  if(!isShellAsset(url))return;
  event.respondWith((async()=>{
    const cached=await caches.match(req);
    const refresh=withTimeout(fetch(req,{credentials:'omit',cache:'no-store',redirect:'error'}),5000).then(async response=>{
      if(canCacheResponse(response)){
        const cache=await caches.open(CACHE);
        await cache.put(req,response.clone());
      }
      return response;
    }).catch(()=>null);
    if(cached){event.waitUntil(refresh);return cached;}
    return (await refresh)||Response.error();
  })());
});