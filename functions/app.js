
import admin from 'firebase-admin';

console.log('initializing app  !!')

admin.initializeApp({
    credential: admin.credential.cert('./firebase-key.json'),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

// ESTO TENDRÍA  QUE ESTAR AL FINAL ??
export const db = admin.firestore();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;