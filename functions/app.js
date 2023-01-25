import admin from 'firebase-admin';
import servicekey from './firebase-key.json' assert  {type: 'json'}

admin.initializeApp({
    credential: admin.credential.cert(servicekey),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

export const db = admin.firestore();
export const storage = admin.storage();