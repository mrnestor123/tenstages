import admin from 'firebase-admin';
//import serviceKey from './secrets/firebase-key.json' assert  {type: 'json'}


let firebaseProd = {}

let firebaseEnv = {}

if (process.env.NODE_ENV === 'production'){

    // initialize dev app
  } else {
    // initialize prod app
  }




admin.initializeApp({
    credential: admin.credential.cert('./secrets/firebase-key.json'),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

export const db = admin.firestore();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;