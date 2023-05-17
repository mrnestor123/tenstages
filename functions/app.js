import admin from 'firebase-admin';
//import uploadBytes from 'firebase-storage';
//import serviceKey from './secrets/firebase-key.json' assert  {type: 'json'}

admin.initializeApp({
  credential: admin.credential.cert('./secrets/firebase-key.json'),
  databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
  storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

export const db = admin.firestore();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;


// SI EL USUARIO  ESTÁ VERIFICADO  !!!
export const isVerified = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-AppCheck');

  if (!appCheckToken) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  //console.log('next next hehe')
  try {
    // ESTO SE HACE EN TODOS ??
    // COMPROBAR QUE ESTO FUNCIONA BIEN !!!!!!!!
    // await admin.appCheck().verifyToken(appCheckToken);
    // If verifyToken() succeeds, continue with the next middleware
    // function in the stack.
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}