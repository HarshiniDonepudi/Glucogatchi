import React, { useState, useEffect } from 'react';
import { onMessageListener, saveToken } from './firebase-messaging';
import { getMessaging, getToken } from 'firebase/messaging';
import './App.css';

export default function App() {
  const [reading, setReading] = useState({ glucose: '--', timestamp: '--' });
  const [threshold, setThreshold] = useState(() => {
    const stored = localStorage.getItem('threshold');
    return stored ? Number(stored) : 150;
  });
  const [alert, setAlert] = useState(null);
  const [perm, setPerm] = useState(Notification.permission || 'default');

  useEffect(() => {
    onMessageListener((payload) => {
      const { notification: { body }, data } = payload;
      setReading({ glucose: data.glucose, timestamp: data.timestamp });
      setAlert(body);
    });
    // Listen for simulated alerts
    const handleFake = (e) => {
      const { notification: { body }, data } = e.detail;
      setReading({ glucose: data.glucose, timestamp: data.timestamp });
      setAlert(body);
    };
    window.addEventListener('firebase-message', handleFake);
    return () => {
      window.removeEventListener('firebase-message', handleFake);
    };
  }, []);

  const handleThresholdChange = () => {
    const newTh = prompt('Enter new glucose threshold', threshold);
    if (newTh) {
      const val = Number(newTh);
      setThreshold(val);
      localStorage.setItem('threshold', String(val));
    }
  };

  const requestNotificationPermission = async () => {
    const permission = await Notification.requestPermission();
    setPerm(permission);
    if (permission === 'granted') {
      const messaging = getMessaging();
      try {
        const currentToken = await getToken(messaging, { vapidKey: import.meta.env.VITE_VAPID_KEY });
        if (currentToken) {
          await saveToken(currentToken);
        }
      } catch (err) {
        console.error('Error getting token', err);
      }
    }
  };

  return (
    <div className="dashboard">
      {perm === 'default' && (
        <button onClick={requestNotificationPermission}>Enable Notifications</button>
      )}
      <h1>Gizmo Caregiver</h1>
      <p>Last Glucose: {reading.glucose} mg/dL</p>
      <p>Timestamp: {reading.timestamp}</p>
      <button onClick={handleThresholdChange}>Update Threshold</button>
      <button onClick={() => window.dispatchEvent(
        new CustomEvent('firebase-message', {
          detail: {
            notification: { body: `Glucose is ${threshold} mg/dL` },
            data: { glucose: threshold.toString(), timestamp: new Date().toISOString() }
          }
        })
      )}>
        Simulate Alert
      </button>
      {alert && (
        <div className="toast">
          <p>{alert}</p>
          <button onClick={() => setAlert(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
