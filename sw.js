/* 앱 껍데기(아이콘·화면)만 저장. 근무 데이터는 항상 새로 불러옴 · 파일 하나가 실패해도 설치는 끝나게 (안 그러면 알림 켜기가 멈춤) */
var C='rl-shell-v28', FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png','favicon.png','logo-full.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(C).then(function(c){return Promise.all(FILES.map(function(f){return c.add(f).catch(function(){});}));}));self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==C;}).map(function(x){return caches.delete(x);}));}));self.clients.claim();});
self.addEventListener('fetch',function(e){
  var u=new URL(e.request.url);if(u.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(C).then(function(c){c.put(e.request,cp);});return r;}).catch(function(){return caches.match(e.request,{ignoreSearch:true}).then(function(r){return r||caches.match('./');});}));
});

/* 🔔 휴대폰 알림 받기 (파이어베이스가 보낸 data: title · body · view) */
self.addEventListener('push',function(e){var d={};try{var j=e.data.json();d=j.data||j.notification||j;}catch(x){try{d={body:e.data.text()};}catch(y){}}
  e.waitUntil(self.registration.showNotification(d.title||'레스큐라이프',{body:d.body||'',icon:'icon-192.png',badge:'favicon.png',tag:d.tag||'rl',renotify:true,silent:false,vibrate:[300,120,300,120,300],data:{view:d.view||''}}));});
self.addEventListener('notificationclick',function(e){e.notification.close();var v=(e.notification.data&&e.notification.data.view)||'',u=new URL('./'+(v?'#'+v:''),self.registration.scope).href;
  e.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(function(cs){for(var i=0;i<cs.length;i++){var c=cs[i];if(c.url.indexOf(self.registration.scope)===0&&'focus' in c){if(v)c.postMessage({rl:'nav',v:v});return c.focus();}}return clients.openWindow(u);}));});
