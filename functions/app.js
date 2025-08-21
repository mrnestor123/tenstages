import admin from 'firebase-admin';


admin.initializeApp({
  credential: admin.credential.cert('./secrets/firebase-key.json'),
  databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
  storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

export const db = admin.firestore();
export const storage = admin.storage();
export const FieldValue = admin.firestore.FieldValue;
export const auth = admin.auth()


// SI EL USUARIO  ESTÁ VERIFICADO  !!!
export const isVerified = async (req, res, next) => {
  const appCheckToken = req.header('X-Firebase-Token');

  if (!appCheckToken) {
    return next()
    //return res.status(401).json({ message: 'Unauthorized' });
  }

  //console.log('next next hehe')
  try {
    await auth.verifyIdToken(appCheckToken)
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