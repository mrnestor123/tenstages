import { db } from '../app.js';
import { create_UUID } from '../helpers';

export const getRequests = async () => {
    try {
        let requests = [];
        let query = await db.collection('requests').get();

        if(query.docs.length){
            for(var doc of query.docs){
                let request = doc.data();
                let user = await getUser(request.coduser, true)
                request.userimage = user.image;
                request.username = user.nombre;
                requests.push(request)
            }
        }

        return requests;

    } catch(err) {
        throw new Error(err);
    }
};

export const getRequest = async (codrequest) => {

};

export const updateRequest = async (request) => {

};

// comments está dentro de requests como otra colección. 
// Además tenemos que meter el codigo del comment en shortComments
// para saber cuantos comments hay sin necesidad de cargarlos completamentes.
// esto se usará 
export const newComment = async (comment) => {};

export const updateComments = async (codrequest, comments) => {};

export const deleteComment = async (codrequest, codcomment) => {};

const getComments = async (codrequest) => {};

