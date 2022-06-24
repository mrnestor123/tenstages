const { query } = require('express');
var admin = require('firebase-admin');
var FieldValue = admin.firestore.FieldValue;
var servicekey = require('./firebase-key.json');

admin.initializeApp({
    credential: admin.credential.cert(servicekey),
    databaseURL: 'https://the-mind-illuminated-32dee.firebaseio.com',
    storageBucket: 'the-mind-illuminated-32dee.appspot.com'
});

//METER EL AUTHENTICATION Y EL STORAGE
const db = admin.firestore()
const storage = admin.storage()




async function getStage(stagenumber) {
    var stagequery = await db.collection('stages').where('stagenumber', '==', stagenumber).get();
    var stage = stagequery.docs[0].data()

    if(stage ) {
        await populateStage(stage)
        return stage;
    }else{
        return null;
    }
}

async function getMeditations(userId){
    let meditations = []
    var meditationsquery = await db.collection('meditations').where('coduser', '==', userId).get();

    if (meditationsquery.docs.length > 0) {
        for (var doc of meditationsquery.docs) {
             meditations.push(doc.data());
        }
    }

    //se podría hacer un sort por tiempo
    return meditations;
}

// SACAR LOS SEGUIDORES Y LOS QUE TE SIGUEN AQUÍ ?????
async function getUser(userId,quick){
    let query = await db.collection('users').where('coduser','==',userId).get();
    let user;

    if(query.docs.length){
        user = query.docs[0].data()
        if(quick != true){
            if(isTeacher(user)){
                user.students = await getUsersinArray(user.students)
            }

            user.stage = await getStage(user.stagenumber);
            user.meditations = await getMeditations(userId);
        }
    }

    return user;
}


async function getUsersinArray(cods){
    let docs = []
    let users = []

    if(cods && cods.length){
        for(var i = 0; i < cods.length; i+=10){
            let query = await db.collection('users').where('coduser','in', cods.splice(i,i+10)).get()
            docs = docs.concat(query.docs)
        }

        for(var doc of docs){
            users.push(doc.data())
        }
    }


    return users 
}



async function populateStage(stage) {
    var lessonsquery = await db.collection('content').where('stagenumber', '==', stage.stagenumber).get();

    stage.meditations = []
    stage.games = []
    stage.lessons = []
    
    for(var c of lessonsquery.docs){
        //HAGO DOS VECES EL IF SE PODRÍA HACER METODO ADDMEDITATION, ADDLESSON, ADDGAME !!!
        var content = c.data()
        // TODO ESTO PODRÍA SER LO MISMO !!!
        if (content['position'] != null || content['type'] == 'meditation-game' ) {

            if(content['createdBy'] != null){
                content['createdBy'] = await getUser(content['createdBy'],true)
            }
            content['type'] == 'meditation-practice' ? stage.meditations.push(content) :
            content['type'] == 'meditation-game' ? stage.games.push(content) : 
            stage.lessons.push(content);
        }
    }
}

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
}


function isTeacher(user){
    return user.role && user.role =='teacher'
}


async function getReadLessons(coduser){
    let content = []
    let res = await db.collection('readlessons').where('coduser','==', coduser).get()

    if(res && res.docs){
        for(var c of res.docs){
            content.push(c.data())
           
        }
    }
    
    return content;
}

async function getContent(coduser){
    let content = []
    let res = await db.collection('content').where('createdBy','==', coduser).get()


    if(res && res.docs){
        for(var c of res.docs){
            content.push(c.data())
        }
    }

    console.log('getting content',content)
    
    return content;
}


//FUNCIONES REUTILIZABLES
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}





module.exports ={db,FieldValue,getContent, storage,create_UUID, getStage,getReadLessons,getMessages, getUser, getMeditations, getUsersinArray, populateStage, isTeacher}