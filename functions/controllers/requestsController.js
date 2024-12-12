import { db, FieldValue } from '../app.js';
import { getUser, getUserDataId } from './usersController.js';

export const getRequests = async (userId) => {
    try {
        console.log('getting requests')
        let requests = [];
        let query = await db.collection('requests').get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                let request = doc.data();

                if (request.cod) {
                    if (!request.userimage && !request.username && (request.state != 'closed' || request.coduser == userId)){
                        /*
                        let user = await getUser(request.coduser);

                        if (user && user.image && user.nombre) {
                            request.userimage = user.image;
                            request.username = user.nombre;
                        }*/
                    }

                    requests.push(request);
                }
            }
        }

        return requests;
    } catch (err) {
        throw new Error(err);
    }
};

export const getRequest = async (requestId) => {
    try {
        let request = {};
        let query = await db
            .collection('requests')
            .where('cod', '==', requestId)
            .get();

        if (query.docs && query.docs.length) {
            request = query.docs[0].data();
            let comments = await db
                .collection('requests')
                .doc(query.docs[0].id)
                .collection('comments')
                .get();

            if (comments.docs && comments.docs.length) {
                request.comments = [];

                for (var doc of comments.docs) {
                    let comment = doc.data();
                    if (!comment.cod) {
                        comment.cod = create_UUID();
                    }
                    request.comments.push(comment);
                }
            }
        }


        

        return request;
    } catch (err) {
        throw new Error(err);
    }
};

export const addRequest = async (request) => {
    try {
        // HACE FALTA COMPROBAR  QUE  EXISTE ??  :()
        let query = await db
            .collection('requests')
            .where('cod', '==', request.cod)
            .get();

        if (query.docs && query.docs.length) {
            throw new Error({ message: 'Request already exists' });
        } else {
            await db.collection('requests').add(request);

            console.log('request added')
        }
    } catch (err) {
        throw new Error(err);
    }
};

export const updateRequest = async ( request) => {
    try {
        let query = await db
            .collection('requests')
            .where('cod', '==', request.cod)
            .get();

        if (query.docs && query.docs.length) {
            let doc = query.docs[0];
            await db.collection('requests').doc(doc.id).update(request);
        } else {
            throw new Error({ message: 'Request not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
};

// comments está dentro de requests como otra colección.
// Además tenemos que meter el codigo del comment en shortComments
// para saber cuantos comments hay sin necesidad de cargarlos completamentes.
// esto se usará
export const newComment = async (requestId, comment) => {
    try {
        let query = await db
            .collection('requests')
            .where('cod', '==', requestId)
            .get();

        if (query.docs && query.docs.length) {

            let doc = query.docs[0];

            await db
                .collection('requests')
                .doc(doc.id)
                .collection('comments')
                .add(comment);
            await db
                .collection('requests')
                .doc(doc.id)
                .update({ shortComments: FieldValue.arrayUnion(comment.cod) });

            /// se  añade a la colección de comentarios  tambien. REVISAR DE HACERLO MEJOR!!
            await db.collection("comments").add(comment);
        } else {
            throw new Error({ message: 'Request not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
};

export const updateComments = async (requestId, comments) => {};

export const deleteComment = async (requestId, codcomment) => {};

export const addNotification = async (notification) => {

    try {

        let userDataID =  await getUserDataId(notification.coduser);

        if (userDataID) {

            await db.collection('userData')
                .doc(userDataID)
                .collection('notifications')
                .add(notification);
            
        } else {
            throw new Error({ message: 'Request not found' });
        }
    } catch (err) {
        throw new Error(err);
    }

}

export const updateNotification = async (notificationID, notification) =>{

    try {
        let userDataID =  await getUserDataId(notification.coduser);

        if (userDataID) {

            let notificationDoc = await db
                .collection('userData')
                .doc(userDataID)
                .collection('notifications')
                .where('cod','==',notificationID)
                .get()

            if (notificationDoc.docs && notificationDoc.docs.length) {
                await db
                    .collection('userData')
                    .doc(userDataID)
                    .collection('notifications')
                    .doc(notificationDoc.docs[0].id)
                    .update(notification);
            }
        } else {
            throw new Error({ message: 'Request not found' });
        }

    }catch(err){
        throw new Error(err);
    }
}

export const getFeed = async () =>{ 

    try {
        let feed = [];

        let query = await db.collection('requests').get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                let request = doc.data();

                if (request.cod && request.type == 'feed' || request.type == 'teacher') {
                    feed.push(request);
                }
            }
        }

        console.log('GETTING FEED')

        return feed;

    } catch (err) {

        console.log('ERROR', err)
        
        throw new Error(err)
    }

}

const getComments = async (codrequest) => {};
