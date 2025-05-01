importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: self.importScripts.meta.env.VITE_API_KEY,
  authDomain: "glucogotchi-45193.firebaseapp.com",
  projectId: "glucogotchi-45193",
  storageBucket: "glucogotchi-45193.firebasestorage.app",
  messagingSenderId: "547682574067",
  appId: "1:547682574067:web:4d1f1a3b37f8a1a8e36186",
  measurementId: "G-SBMHRFZYR9"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

const CACHE_NAME = 'gizmo-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request))
  );
});

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, { body });
});
