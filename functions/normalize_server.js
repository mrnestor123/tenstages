
// FUNCTION TO NORMALIZE THE  WHOLE SERVER  TO USERDATA
import { db } from './app.js';
import { getUser } from './controllers/usersController.js';


export async function normalize_server() {
    
    let query =  await db.collection('users').get();


    for (let doc of query.docs) {

        // TENDREMOS QUE BORRAR LAS QUE TIENEN ELLOS
        let user  = await getUser(doc.data().coduser, true, true);
        let userData = await db.collection('userData').where('coduser','==', user.coduser).get();
            
        // HABRÁ QUE TENER EN CUENTA EN EL CASO DE QUE HAGAN ALGO ESTA SEMANA !!
        if(!userData.docs.length){
            // añadimos el usuario a la colección de usuarios
            let userRef = await db.collection('userData').add({'coduser':user.coduser})
            console.log('user added', userRef.id)
            for(var meditation of  user.meditations){
                db.collection('userData').doc(userRef.id).collection('meditations').add(meditation)
            }   

            for(var notification of user.notifications){
                db.collection('userData').doc(userRef.id).collection('notifications').add(notification)
            }

            for(var lesson of user.readlessons){
                db.collection('userData').doc(userRef.id).collection('readlessons').add(lesson)
            }

            for(var content of user.doneContent){
                db.collection('userData').doc(userRef.id).collection('doneContent').add(content)
            }   

            let actionsquery  = await db.collection('actions').where('coduser','==', user.coduser).get();

            if(actionsquery.docs.length){
                for(var action of actionsquery.docs){
                    db.collection('userData').doc(userRef.id).collection('actions').add(action.data())    
                }
            }            
        }

    }

}
