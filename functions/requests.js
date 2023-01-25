
//AGRUPAR TODO EL CÓDIGO DE LAS REQUESTS !!

const { getUser, db, storage, create_UUID } = require("./helpers");


async function getRequest(req,res,next){
    let request
    let query = await db.collection('requests').where('cod','==', req.params.codrequest).get();

    let toupdate = false;

    if(query.docs.length){
        request = query.docs[0].data()

        // QUITAR EN EL FUTURO !!!!!!!
        if(request.userimage == undefined || request.username == undefined){
            console.log('getting user !!')
            let user = await getUser(request.coduser,true)
            request.userimage = user.image;
            request.username = user.nombre;
            toupdate = true;
        }


        let commentsfirst = await db.collection('comments').where('codrequest','==', req.params.codrequest).get();

        // EN EL FUTURO SOLO ESTARÁ ESTO !!
        // SE UTILIZAN  SOLO LOS COMENTARIOS DE LA BASE DE DATOS COMMENTS
        if(commentsfirst.docs && commentsfirst.docs.length){
            request.comments = []

            for(var doc of commentsfirst.docs){
                let comment = doc.data();
                request.comments.push(comment)
            }
        }else {
            let comments = await db.collection('requests').doc(query.docs[0].id).collection('comments').get();
            let commentstoChange = []
            
            if(comments.docs && comments.docs.length){
                request.comments = []

                for(var doc of comments.docs){
                    let comment = doc.data();
                    if(!comment.cod){
                        comment.cod = create_UUID()
                    }
                    request.comments.push(comment)
                    commentstoChange.push(comment);
                }
                
            }else if(request.comments && request.comments.length){
                let users  = {}

                for(var comment of request.comments){
                    let user;

                    if(comment.username){
                        if(!comment.cod){
                            comment.cod = create_UUID()
                        }
                        commentstoChange.push(comment);
                    }

                    //PORQUE USERIMAGE SIGUE SIENDO NULA !!!
                    // HAY VECES QUE EL USUARIO TINE UNA USERIMAGE NULA !!!!
                    if(!comment.userimage){
                        if(!users[comment.coduser]){
                            user = await getUser(comment.coduser,true)
                            users[comment.coduser] = user
                        }else {
                            user = users[comment.coduser]
                        }
                        
                        if(user){ 
                            //A LO MEJOR HAY QUE SACAR MÁS INFORMACION
                            comment.userimage = user.image;
                            comment.username = user.nombre;
                            toupdate = true;
                        }
                    }   
                }

                
                
            //  if(toupdate){
                //    await db.collection('requests').doc(query.docs[0].id).update(request);
            // }
            }

            if(commentstoChange.length){
                for(var comment of commentstoChange){
                    comment.codrequest = req.params.codrequest
                    await db.collection('comments').add(comment)
                }

                let shortComments = commentstoChange.map((c)=> c.cod)

                
                db.collection('requests').doc(query.docs[0].id).update({'shortComments': shortComments})

            }
        }
        
    }

    if(request){
        return res.status(200).json(request);
    }else{
        return res.status(400).json({'error':'couldnt get the request'});
    }
}


async function updateRequest(req,res,next){
    let query = await db.collection('requests').where('cod', '==', request.cod).get()
    let docID = query.docs[0].id

    db.collection('requests').doc(docID).update(request).then(function () {
        console.log("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}


async function normalizeRequest(id, request){
    await db.collection('requests').doc(id).update(request);
}

// SACAMOS TODAS LAS REQUEST !!!!!
// hay  que filtrar si queremos las de stagenumber o no !!!
async function getRequests(req,res,next){
    var query = await db.collection('requests').get();
    var requests = []

    let toupdate = false;
    
    for (let doc of query.docs) {
        //HABRA QUE HACER ESTO MÁS EFICIENTE 
        let request = doc.data();
        if(request.cod && !request.stagenumber){
            //habra alguna manera más optima de sacar esto ??
            if(!request.username){
                let user = await getUser(request.coduser,true)
                if(user && user.coduser){
                    request.userimage = user.image || '';
                    request.username = user.nombre;
                    normalizeRequest(doc.id,request);
                }
            }

            requests.push(request)           
        }
    }

    console.log('requests',requests.length)

    return res.status(200).json(requests);	
}


async function comment(req,res,next){
    let comment = req.body.comment

    // UTILIZAMOS ESTO O LO OTRO ???
    await db.collection('comments').add(comment)
}


module.exports = {getRequest,getRequests,updateRequest,comment }