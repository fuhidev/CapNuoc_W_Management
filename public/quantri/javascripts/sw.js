// Copyright 2016 Google Inc.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
//      http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var dataCacheName = 'home-pasc-v1';
var cacheName = 'home-pasc-1';
var filesToCache = [
  '/',
  '/tra-cuu-su-co',
  '/huong-dan-su-dung',
  '/javascripts/lib/jquery.sticky.js',
  '/javascripts/lib/wow.min.js',
  '/javascripts/lib/owl.carousel.min.js',
  '/javascripts/lib/jquery.simplyscroll.min.js',
  '/javascripts/config.js',
  '/javascripts/welcome.js'
];

self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});