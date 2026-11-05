// Fox Towers Defense service worker: network first (4 s), then cache
var CACHE='dt-v20';
self.addEventListener('install',function(e){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));}).then(function(){return self.clients.claim();}));});
self.addEventListener('fetch',function(e){
  var r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(new Promise(function(res){
    var done=false,t=setTimeout(function(){caches.match(r).then(function(c){if(c&&!done){done=true;res(c);}});},4000);
    fetch(r).then(function(n){clearTimeout(t);var cp=n.clone();caches.open(CACHE).then(function(c){c.put(r,cp);});if(!done){done=true;res(n);}}).catch(function(){clearTimeout(t);caches.match(r).then(function(c){if(!done){done=true;res(c||new Response('Offline',{status:503}));}});});
  }));
});
