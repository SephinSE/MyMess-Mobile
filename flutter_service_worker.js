'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "d2b41d209fe352bdd42680187bcf8ff4",
"assets/AssetManifest.bin.json": "f383d72d18070fcd38de8ef3933a0900",
"assets/AssetManifest.json": "c6838672a82ab85d7182482fbf3e05d0",
"assets/assets/authBG.png": "c9e73e957e2046cdfc245ccb967715e7",
"assets/assets/GenerateBill.png": "5533a7b96baf26764cfdd91d42a7300a",
"assets/assets/icon.png": "6577fa930123207452553ac0510c0457",
"assets/assets/logo.png": "173035b56b6d5735a677cbcb29af129d",
"assets/assets/logoRed.png": "a27e9448eddf0722d2f5a8920765c3cb",
"assets/assets/mainLogo.png": "1c51b894684f5f5083acee5a800f548b",
"assets/assets/MessCut.png": "4b626a25b06540dcb55a46e7ff2e880e",
"assets/assets/MessCutList.png": "2cfa97fe65bccf97e4ff6aed5aeedd3e",
"assets/assets/MessLeave.png": "c5a4235a01ac59cbc905ef58fc2e349f",
"assets/assets/PayBill.png": "b6d8f8ecaf5b54862460939a6894ca45",
"assets/assets/Profile.png": "a307284af1254c3c5f24595e3be946a7",
"assets/assets/QRCode.png": "0bfeab08d6c967acc5a854d2bb6730b3",
"assets/assets/UsersList.png": "faad7a719b458d331d22dd7e3d5f040e",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "b32eec0c09be01acfa1f9c082200f4a5",
"assets/NOTICES": "552f729f12fe5ee3931205d374451170",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "e986ebe42ef785b27164c36a9abc7818",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"canvaskit/canvaskit.js": "738255d00768497e86aa4ca510cce1e1",
"canvaskit/canvaskit.js.symbols": "74a84c23f5ada42fe063514c587968c6",
"canvaskit/canvaskit.wasm": "9251bb81ae8464c4df3b072f84aa969b",
"canvaskit/chromium/canvaskit.js": "901bb9e28fac643b7da75ecfd3339f3f",
"canvaskit/chromium/canvaskit.js.symbols": "ee7e331f7f5bbf5ec937737542112372",
"canvaskit/chromium/canvaskit.wasm": "399e2344480862e2dfa26f12fa5891d7",
"canvaskit/skwasm.js": "5d4f9263ec93efeb022bb14a3881d240",
"canvaskit/skwasm.js.symbols": "c3c05bd50bdf59da8626bbe446ce65a3",
"canvaskit/skwasm.wasm": "4051bfc27ba29bf420d17aa0c3a98bce",
"canvaskit/skwasm.worker.js": "bfb704a6c714a75da9ef320991e88b03",
"favicon.png": "d74bca97e99d2faf0a2cc68489a466ee",
"flutter.js": "383e55f7f3cce5be08fcf1f3881f585c",
"flutter_bootstrap.js": "0dd1ca8f19e16cf85dcac8a3e8d89cd0",
"icons/Icon-192.png": "20962a3c51d163ec9b1a909bb6193813",
"icons/Icon-512.png": "455eda6bbc1921de326904d5cbbbc13b",
"icons/Icon-maskable-192.png": "20962a3c51d163ec9b1a909bb6193813",
"icons/Icon-maskable-512.png": "455eda6bbc1921de326904d5cbbbc13b",
"index.html": "0b540976fa27f99e9f808a8f655d80b6",
"/": "0b540976fa27f99e9f808a8f655d80b6",
"main.dart.js": "9fbba14af9696ddad2bbae7bd1b64f31",
"manifest.json": "d43f19ed07d632375520b3365a78d873",
"splash/img/dark-1x.png": "ea08211098b97c70f7bba5eaade8d7b9",
"splash/img/dark-2x.png": "d0c0a9bd51c8b569e3d1ff87663beb33",
"splash/img/dark-3x.png": "201f349d29c5765449ad79b3f2d66c9a",
"splash/img/dark-4x.png": "6df0846414d692732387b5c8e6bfa6ff",
"splash/img/light-1x.png": "ea08211098b97c70f7bba5eaade8d7b9",
"splash/img/light-2x.png": "d0c0a9bd51c8b569e3d1ff87663beb33",
"splash/img/light-3x.png": "201f349d29c5765449ad79b3f2d66c9a",
"splash/img/light-4x.png": "6df0846414d692732387b5c8e6bfa6ff",
"version.json": "477f35063763c03d824c5b516fed75f2"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}