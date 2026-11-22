/* Wisla offline shell — keep this file next to index.html */
var C='wisla-shell-v1';
self.addEventListener('install',function(e){
self.skipWaiting();
e.waitUntil(caches.open(C).then(function(c){return Promise.all(['./','./index.html'].map(function(u){return c.add(u).catch(function(){})}))}))});
self.addEventListener('activate',function(e){
e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==C}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){
var r=e.request;if(r.method!=='GET')return;
var u=new URL(r.url),font=/(^|\.)(googleapis|gstatic)\.com$/.test(u.hostname);
if(u.origin!==self.location.origin&&!font)return;
e.respondWith(fetch(r).then(function(res){
if(res&&(res.ok||res.type==='opaque')){var cp=res.clone();caches.open(C).then(function(c){c.put(r,cp)})}
return res}).catch(function(){
return caches.match(r,{ignoreSearch:true}).then(function(m){
if(m)return m;
if(r.mode==='navigate')return caches.match('./index.html').then(function(x){return x||caches.match('./')});
return Response.error()})}))});
