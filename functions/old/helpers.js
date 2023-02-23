const { query } = require('express');
var admin = require('firebase-admin');
var servicekey = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(servicekey),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

//METER EL AUTHENTICATION Y EL STORAGE
const db = admin.firestore();
const storage = admin.storage();

// necesitamos uno normal y uno expandido
async function getStage(stagenumber) {
    var stagequery = await db.collection('stages').where('stagenumber', '==',stagenumber <  10 ? stagenumber: 1).get();
    var stage = stagequery.docs[0].data();

    if(stage) {
        await populateStage(stage)
        return stage;
    } else {
        return null;
    }
};

async function getMeditations(userId){
    let meditations = [];
    var meditationsquery = await db.collection('meditations').where('coduser', '==', userId).get();

    if (meditationsquery.docs.length > 0) {
        for (var doc of meditationsquery.docs) {
             meditations.push(doc.data());
        }
    }

    //se podría hacer un sort por tiempo
    return meditations;
};

// SACAR LOS SEGUIDORES Y LOS QUE TE SIGUEN AQUÍ ?????
async function getUser(userId, quick ){
    let query = await db.collection('users').where('coduser','==',userId).get();
    let user;

    if(query.docs.length){
        user = query.docs[0].data()

        if(quick != true){
            // NO SACAMOS LOS CONTENIDOS ???
            if(isTeacher(user)){
                user.students = await getUsersinArray(user.students);
            }
            // stagenumber = 1
            // stages {}
            user.stage = await getStage(user.stagenumber);
            user.meditations = await getMeditations(userId);
        }
    }

    return user;
};

async function getUsersinArray(cods){
    let docs = []
    let users = []

    if(cods && cods.length){
        for(var i = 0; i < cods.length; i+=10){
            let query = await db.collection('users').where('coduser', 'in', cods.splice(i, i+10)).get()
            docs = docs.concat(query.docs)
        }

        for(var doc of docs){
            users.push(doc.data())
        }
    }


    return users 
};

async function populateStage(stage){
    var lessonsquery = await db.collection('content').where('stagenumber', '==', stage.stagenumber).get();

    stage.meditations = []
    stage.games = []
    stage.videos = []
    stage.lessons = []
    
    for(var doc of lessonsquery.docs){
        //HAGO DOS VECES EL IF SE PODRÍA HACER METODO ADDMEDITATION, ADDLESSON, ADDGAME !!!
        var content = doc.data()
        // TODO ESTO PODRÍA SER LO MISMO !!!
        if (content['position'] != null || content['type'] == 'meditation-game' ) {
            await expandContent(content)
            content['type'] == 'meditation-practice' ? stage.meditations.push(content) :
            content['type'] == 'meditation-game' ? stage.games.push(content) : 
            content['type'] == 'video' ? stage.videos.push(content) :
            stage.lessons.push(content);
        }
    }
};

// Esto habría que meterlo en el post de creacion de contenido
// Con "Esto" ne refueri a user.nombre, user.image, user.coduser
async function expandContent(content){
    // HACE FALTA SABER QUIEN LO HA CREADO EN CADA MOMENTO ??????
    // CACHEAR ESTAS LLAMADAS !!! 
    if(content['createdBy'] != null){
        let user = await getUser(content['createdBy'],true)
        content['createdBy'] = {}
        content['createdBy'].nombre = user.nombre
        content['createdBy'].image = user.image
        content['createdBy'].coduser = user.coduser
    }
};

async function getMessages(coduser, quick){
    let messages = []

    let res = await db.collection('messages').where('receiver','==', coduser).get()

    if(res && res.docs){
        for(var msg of res.docs){
            let message = msg.data()
            if(!message.deleted){
                if(message.type == 'classrequest' && !quick){
                    message.user = await getUser(message.sender,true)
                }
                messages.push(message)
            }
        }
    }

    return messages;
};

function isTeacher(user){
    return user.role && user.role =='teacher'
};

async function getReadLessons(coduser){
    let content = []
    let res = await db.collection('readlessons').where('coduser','==', coduser).get()

    if(res && res.docs){
        for(var c of res.docs){
            content.push(c.data())
           
        }
    }
    
    return content;
};

async function getContent(coduser){
    let content = []
    let res = await db.collection('content').where('createdBy','==', coduser).get()

    if(res && res.docs){
        for(var doc of res.docs){
            if(doc.data().position != null && doc.data().path == null){
                content.push(doc.data())
            }
        }
    }
    if(content.length){ content.sort((a,b)=> a.position -b.position)}

    
    return content;
};

//FUNCIONES REUTILIZABLES
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
};

async function getUserPaths(coduser){
    let query = await db.collection('paths').get() 
    let paths = []

    for (let doc of query.docs) {
        let path = doc.data()
        if((coduser && path.createdBy == coduser) || (!path.createdBy && !coduser)){
            path.content = []
            
            let content = await db.collection('content').where('path', '==', path.cod).get()

            if(content.docs){
                for(let doc of content.docs){
                    path.content.push(doc.data())
                }
                
                path.content.sort((a,b)=> a.position - b.position)
                
            }


            paths.push(path)
        }
    }

    return paths;

};

module.exports = {
    db,
    FieldValue,
    getContent,
    getUserPaths,
    storage,
    expandContent,
    create_UUID,
    getStage,
    getReadLessons,
    getMessages,
    getUser,
    getMeditations,
    getUsersinArray,
    populateStage, 
    isTeacher
};
