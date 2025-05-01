import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { saveToken } from './firebase-messaging.js';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Request permission and get token
Notification.requestPermission().then((permission) => {
  if (permission === 'granted') {
    getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY })
      .then((currentToken) => {
        if (currentToken) {
          saveToken(currentToken);
        }
      })
      .catch((err) => console.error('Error getting token', err));
  }
});

// Handle foreground messages
onMessage(messaging, (payload) => {
  // Custom event for App to listen
  window.dispatchEvent(new CustomEvent('firebase-message', { detail: payload }));
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js');
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
