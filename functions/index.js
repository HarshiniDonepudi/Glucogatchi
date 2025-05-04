const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

admin.initializeApp();
const db = admin.firestore();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Validate API Key
const API_KEY = functions.config().gizmo.apikey;

app.post('/sendAlert', async (req, res) => {
  const { childId, eventType, glucose, timestamp, apiKey } = req.body;
  if (apiKey !== API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }
  if (!childId || !eventType || glucose == null || !timestamp) {
    return res.status(400).json({ error: 'Missing fields' });
  }
  try {
    const tokensSnap = await db.collection('caregivers').doc(childId).collection('tokens').get();
    const tokens = tokensSnap.docs.map(doc => doc.data().token);
    if (!tokens.length) return res.status(404).json({ error: 'No tokens found' });

    // In emulator mode, skip actual FCM send
    const isEmulator = !!process.env.FIRESTORE_EMULATOR_HOST;
    if (isEmulator) {
      console.log('DEV EMULATOR MODE: Skipping FCM send to tokens:', tokens);
      return res.json({ success: true, tokens, emulator: true });
    }

    const message = {
      notification: {
        title: 'Gizmo Alert',
        body: `Glucose is ${glucose} mg/dL`,
      },
      data: {
        glucose: glucose.toString(),
        timestamp,
      },
    };
    const response = await admin.messaging().sendMulticast({ ...message, tokens });
    return res.json({ success: true, response });
  } catch (error) {
    console.error('Error sending alert', error);
    return res.status(500).json({ error: error.message });
  }
});

exports.api = functions.https.onRequest(app);
