const CACHE_NAME = "석식체크-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/signup.html",
  "/qr.html",
  "/hub.html",
  "/manifest.json",
  "https://cdn.tailwindcss.com",
  "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js",
  "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css",
  "/icons/favicon-16x16.png",
  "/icons/favicon-32x32.png",
  "/icons/android-chrome-192x192.png",
  "/icons/android-chrome-512x512.png",
  "/icons/apple-touch-icon.png",
  "/icons/favicon.ico",
];

// 서비스 워커 설치 및 캐시 설정
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// 네트워크 요청 가로채기
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 캐시에서 찾으면 반환
      if (response) {
        return response;
      }

      // 캐시에 없으면 네트워크 요청
      return fetch(event.request).then((response) => {
        // 유효한 응답이 아니면 그냥 반환
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // 응답을 복제하여 캐시에 저장
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 이전 캐시 정리
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
