import { db, FieldValue } from '../app.js';
import { getUser } from './usersController.js';

export const getRequests = async () => {
    try {
        let requests = [];
        let query = await db.collection('requests').get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                let request = doc.data();

                if (request.cod) {
                    if (!request.userimage && !request.username) {
                        let user = await getUser(request.coduser);
                        if (user && user.image && user.nombre) {
                            request.userimage = user.image;
                            request.username = user.nombre;
                        }
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

export const getRequest = async (codrequest) => {
    try {
        let request = {};
        let query = await db
            .collection('requests')
            .where('cod', '==', codrequest)
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

export const updateRequest = async (request) => {
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
export const newComment = async (comment) => {
    try {
        let query = await db
            .collection('requests')
            .where('cod', '==', comment.codrequest)
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
        } else {
            throw new Error({ message: 'Request not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
};

export const updateComments = async (codrequest, comments) => {};

export const deleteComment = async (codrequest, codcomment) => {};

const getComments = async (codrequest) => {};
