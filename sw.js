const CACHE_NAME = 'face-attendance-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './face-api.js',
  './models/tiny_face_detector_model-weights_manifest.json',
  './models/tiny_face_detector_model.txt',
  './models/face_landmark_68_model-weights_manifest.json',
  './models/face_landmark_68_model.txt',
  './models/face_recognition_model-weights_manifest.json',
  './models/face_recognition_model.txt'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});