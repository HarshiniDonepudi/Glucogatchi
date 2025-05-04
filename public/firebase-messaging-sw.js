importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAbZmslqTpeLwPOBltWRuKqwnaO55aF9ag",
  authDomain: "glucogotchi-45193.firebaseapp.com",
  projectId: "glucogotchi-45193",
  storageBucket: "glucogotchi-45193.firebasestorage.app",
  messagingSenderId: "547682574067",
  appId: "1:547682574067:web:4d1f1a3b37f8a1a8e36186",
  measurementId: "G-SBMHRFZYR9"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification || {};
  self.registration.showNotification(title, {
    body,
    icon: '/icons/icon-192.png'
  });
});
