self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('json-store').then(function(cache) {
     return cache.addAll([
       '/json/',
       '/json/index.html',
       '/json/bootstrap.min.css',
       '/json/bootstrap.min.js',
       '/json/filereader.js',
       '/json/FileSaver.min.js',
       '/json/icon.png',
       '/json/jquery.min.js',
       '/json/popper.min.js',
       '/json/dist/jsoneditor.min.css',
       '/json/dist/jsoneditor.min.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});
