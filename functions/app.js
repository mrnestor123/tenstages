import admin from 'firebase-admin';
import serviceKey from './secrets/firebase-key.json' assert  {type: 'json'}

admin.initializeApp({
    credential: admin.credential.cert(serviceKey),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

export const db = admin.firestore();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;