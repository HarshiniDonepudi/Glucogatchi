import { getFirestore, doc, setDoc, deleteDoc, collection, query, where, getDocs, connectFirestoreEmulator } from 'firebase/firestore';
import { getMessaging, onMessage } from 'firebase/messaging';

export async function saveToken(token) {
  try {
    const db = getFirestore();
    if (import.meta.env.DEV) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    const tokenRef = doc(collection(db, 'caregivers', 'gizmo-child-123', 'tokens'));
    await setDoc(tokenRef, { token, createdAt: new Date() });
  } catch (e) {
    console.error('Error saving token', e);
  }
}

export async function removeToken(token) {
  try {
    const db = getFirestore();
    if (import.meta.env.DEV) {
      connectFirestoreEmulator(db, 'localhost', 8080);
    }
    const tokensRef = collection(db, 'caregivers', 'gizmo-child-123', 'tokens');
    const q = query(tokensRef, where('token', '==', token));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((tokenDoc) => {
      deleteDoc(tokenDoc.ref);
    });
  } catch (e) {
    console.error('Error removing token', e);
  }
}

export function onMessageListener(callback) {
  const messaging = getMessaging();
  onMessage(messaging, callback);
}
