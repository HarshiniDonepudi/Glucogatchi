# Gizmo Caregiver PWA

## Tech Stack
- Frontend: React with Vite
- PWA: manifest.json, service-worker.js
- Firebase: Web SDK v9, Firestore, Cloud Messaging
- Backend: Firebase Functions (Node.js 16)

## Project Structure
```
/gizmo-caregiver
├── public/
│   ├── manifest.json
│   ├── service-worker.js
│   └── icons/
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   └── firebase-messaging.js
├── functions/
│   ├── index.js
│   └── package.json
├── .firebaserc
├── firebase.json
├── package.json
├── vite.config.js
└── README.md
```

## Setup
1. Clone the repo.
2. Install dependencies:
   ```bash
   npm install
   cd functions && npm install
   ```
3. Set Firebase project:
   ```bash
   firebase use --add
   ```
4. Set functions env:
   ```bash
   firebase functions:config:set gizmo.apikey="YOUR_API_KEY"
   firebase deploy --only functions:api
   ```
+  **Load Firestore Rules:**
+  ```bash
+  firebase deploy --only firestore:rules
+  ```

## Local Development
- Start frontend:
  ```bash
  npm run dev
  ```
- Start emulators:
  ```bash
  firebase emulators:start --only functions,firestore
  ```

## Testing Alerts Locally
Use the provided `test-sendAlert.sh` script:
```bash
chmod +x test-sendAlert.sh
./test-sendAlert.sh gizmo-child-123 YOUR_API_KEY 120
```

## PWA Assets
- Verify `public/icons/icon-192.png` and `icon-512.png` are in place.

## Production Deployment
Build & serve assets:
```bash
npm run build
firebase deploy --only hosting,functions,firestore:rules
```

## ESP32 Webhook Integration
Configure your ESP32 to POST to `https://your-domain/sendAlert` with JSON:
```json
{
  "childId": "gizmo-child-123",
  "eventType": "glucoseAlert",
  "glucose": 85,
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "apiKey": "YOUR_API_KEY"
}
```

## ESP32 Integration
When glucose crosses thresholds, send POST to:
```
https://<YOUR_DOMAIN>/sendAlert
```
Body:
```json
{
  "childId": "CHILD_ID",
  "eventType": "glucoseAlert",
  "glucose": 120,
  "timestamp": "2025-04-30T16:00:00Z",
  "apiKey": "YOUR_API_KEY"
}
