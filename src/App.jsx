import React, { useState, useEffect } from 'react';
import { onMessageListener } from './firebase-messaging';
import './App.css';

export default function App() {
  const [reading, setReading] = useState({ glucose: '--', timestamp: '--' });
  const [threshold, setThreshold] = useState(150);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    onMessageListener((payload) => {
      const { body } = payload.notification;
      setAlert(body);
    });
  }, []);

  const handleThresholdChange = () => {
    const newTh = prompt('Enter new glucose threshold', threshold);
    if (newTh) setThreshold(Number(newTh));
  };

  return (
    <div className="dashboard">
      <h1>Gizmo Caregiver</h1>
      <p>Last Glucose: {reading.glucose} mg/dL</p>
      <p>Timestamp: {reading.timestamp}</p>
      <button onClick={handleThresholdChange}>Update Threshold</button>
      {alert && (
        <div className="toast">
          <p>{alert}</p>
          <button onClick={() => setAlert(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
}
