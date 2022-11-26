const { request } = require('express');
const { db, FieldValue, storage, getStage, getUser, getReadLessons,  populateStage, getMeditations,  isTeacher, getUsersinArray, getContent, expandContent, getUserPaths} = require('./helpers.js')

// live
var friends = {}
var suscriptions={}
// el mailbox te devolverá las acciones de hoy y las acciones de la última semana!!
var mailbox={}

// Devuelve las acciones del usuario
async function updatefeed(req,res,next) {
    console.log('QUE PASA AMIGO  !!!!')
    const userid = req.params.userId
    console.log('getting actions',req.params)

    if(mailbox[userid]){
        // !!! lo borro despues
        return res.status(200).json(mailbox[userid]);	
    }else{
        let actionstoday = []
        let actionsthisweek = []
        let nonfilteredactions = []
        let actionsquery = [];

        let useractions = await db.collection('actions').where('coduser','==', userid).get();
            
        if(useractions.docs){
            actionsquery = actionsquery.concat(useractions.docs)
        }

        let user = await getUser(userid, true)
            
        actionsquery.map((doc) => {
            let action = doc.data()
            // MEJORABLE
            //action.user = followedUsers[action.coduser] ? followedUsers[action.coduser] : user
            action.userimage = user.image
            nonfilteredactions.push(action)
        })

        // ESTO SE PODRÍA AHORRAR CON UNA QUERY MEJOR !!!!!!!!!!!!!
        var curr = new Date(); // get current date
        var first = curr.getDate() - (!curr.getDay() ? 6 : curr.getDay() - 1) ; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6
        
        var monday = new Date(new Date(curr.setDate(first)).setHours(0,0,0));
        var sunday = new Date(curr.setDate(last));
        var today = new Date()

        // esto se ahorraria si filtrasemos en la llamada a la base de datos
        actionstoday = nonfilteredactions.filter((action) => 
            today.getDate() == new Date(action.time).getDate() && today.getMonth() == new Date(action.time).getMonth()
        )        

        actionsthisweek = nonfilteredactions.filter((action) => {
            let date = new Date(action.time)
            return date > monday && date < sunday && new Date(action.time).getDate() != today.getDate()
        })

        mailbox[userid] = {'today': actionstoday || [], 'thisweek': actionsthisweek || []}

        return res.status(200).json(mailbox[userid]);	
    }
}

// El usuario se conecta a la  app.
// Le devolvemos su user y añadimos las acciones al mailbox
async function connect(req,res,next) {
    try{

        const userId = req.params.userId

        //hay que enviarle los friends en vez de hacer la llamada !!
        var user = await getUser(userId);

        if(user){
            let followsyou = user.followsyou
            let following = user.following

            let followedUsers = {}

            //meter los usuarios aqui
            // SACAMOS LAS ACTIONS !!
            // HACE FALTA SACAR LOS USUARIOS AQUI ?????
            if(following && following.length){
                user.following = await getUsersinArray(following)

                user.following.map((user)=> {
                    followedUsers[user.coduser] = user
                })
            }  

            // si el usuario es profesor, sacamos los archivos que haya añadido
            if(isTeacher(user)){
                // los materiales q ue ha subido ??
                let docs = await storage.bucket(`gs://the-mind-illuminated-32dee.appspot.com`).getFiles({prefix:`userdocs/${user.coduser}`})
                if(docs.length){
                    let printed = false;
                    user.files = []
                    for(var file of docs[0]){
                        let url = await file.getSignedUrl({action: 'read',expires:'03-09-2491'})
                        if(url[0] && !url[0].match('jpg|png')){
                            user.files.push(url[0])
                        }
                    }
                }

                user.addedcontent = await getContent(user.coduser)

                user.addedcourses = await getUserPaths(user.coduser)
            }

            
            
            // SACAMOS LOS CURSOS DEL USUARIO
            if(user.joinedcourses  && user.joinedcourses.length){
                let joinedcourses =  []

                for(var cod of user.joinedcourses){
                    let course = await db.collection('paths').where('cod','==',cod).get();
                    if(course.docs && course.docs.length > 0){
                        joinedcourses.push(course.docs[0].data())
                    }
                }

                user.joinedcourses = joinedcourses
            }
            
            user.readlessons = await getReadLessons(user.coduser);


            let doneContent = await db.collection('doneContent').where('doneBy','==',userId).get();

            if(doneContent.docs){
                user.doneContent = []

                for(var doc of doneContent.docs){
                    user.doneContent.push(doc.data());
                }
            }

            let notifications = await db.collection('notifications').where('coduser','==',userId).get()
            
            if(notifications.docs){
                user.notifications = []
                for(var doc of notifications.docs){
                    let notification = doc.data()
                    /*    
                    para hacer en el futuro
                    console.log('got notification',notification.coduser);
                        
                    if(!followedUsers[notification.coduser]){
                        followedUsers[notification.coduser] = await getUser(notification.coduser)
                    }

                    notification.userimage = followedUsers[notification.coduser].image
                   */
                    user.notifications.push(notification)
                }
            }
            
            if(followsyou && followsyou.length){
                user.followsyou = await getUsersinArray(followsyou)
                friends[userId] = followsyou
                friends[userId].forEach(friend=>{
                    if (!suscriptions[friend]) suscriptions[friend]=[]
                    suscriptions[friend].push(userId)
                })
            }

            return res.status(200).json(user);	
        }

    }catch(e){ console.log('ERROR',e)}
    
    console.log('QUE PASA AQUI ????')

    return res.status(400).json({'error':'User does not exist'})
    // voy a notificar a los que me tienen como amigo
}

function disconnect(req,res,next){
    const userid = req.params.userId
    delete friends[userid]
}

//el usuario hace una acción
function action(req,res,next) {
    const userId= req.params.userId
    const action = req.body;      

    // LE METEMOS LA IMÁGEN DEL USUARIO ????
    let user = db.collection('users').where('coduser','==', userId).get()
    
    if(user.docs && user.docs.length){
        action.user = user.docs[0].data()
    }

    if(mailbox[userId]){
        mailbox[userId]['today'].push(action);
    }

    if(suscriptions[userId]){
        // creo una suscripción para ellos
        suscriptions[userId].forEach(friend=>{
            mailbox[friend]['today'].push(action)
        })
    }

    db.collection('actions').add(action)

    //podría devolver ok si se ha subido y fallo si ha habido un fallo //TODO

    //return res.status(200).json({'message':'ok', 'req':req.body, 'params':req.params});	

    //añadir la accion a la base de datos !
}

function addFriend(req,res,next){
    const userid = req.params.userId
    const friendId = req.params.friendId

    if(friends[userid]){
        friends[userid].push(friendId)
    }else {
        friends[userid] = [userid]
    }
}

function removeFriend(req,res,next){
    const userid = req.params.userId
    const friendId = req.params.friendId

    if(friends[userid]){
        friends[userid].splice(friends[userid].findIndex((id) => id == friendId))
    }
}   

async function getAllStages(req,res,next){
    let stagesquery = await db.collection('stages').get()
    let stages = []

    for(var doc of stagesquery.docs){
        let stage = doc.data()
        await populateStage(stage)
        stages.push(stage)
    }

    stages.sort((a,b)=> a.stagenumber - b.stagenumber)

    return res.status(200).json(stages);	
}

async function getStageCall(req,res,next){
   let stage = await getStage(Number(req.params.stagenumber))
    
   if(stage){
        return res.status(200).json(stage);
    }else{
        return res.status(400).json({'error':'Stage does not exist'})
    }
}

async function getUsers(req,res,next){
     //AÑADIR .where('role','!=','teachers')
     let users = await db.collection('users').get();
     let userId = req.params.userId
     let userslist = []
    
     //el usuario que saca la información
     let loggeduser = await getUser(userId,true);

     if(users.docs.length > 0){        
        for(let doc of users.docs){
            let user = doc.data()
            if(loggeduser.following && loggeduser.following.includes(user.coduser)){
                user.followed = true;
            }
            userslist.push(user);
        }

        return res.status(200).json(userslist)
    }else{
        return res.status(400).json({'error':'No se ha podido sacar los usuarios'})
    }
}

async function user(req,res,next){
    let userId = req.params.userId
    let user = await getUser(userId,true)

    if(user){
        return res.status(200).json(user);
    }else{
        return res.status(400).json({'error':'couldnt get the user'});
    }
}

async function getTeachers(req,res,next){
    let query = await db.collection('users').where('role','==','teacher').get();
    let teachers = []
    
    if(query.docs.length){
        for(var doc of query.docs){
            teachers.push(doc.data())
        }
    }

    return res.status(200).json(teachers)
}

async function expandUser(req,res,next){
    let userId = req.params.userId;
    let query = await db.collection('users').where('coduser','==',userId).get();
    let user;

    if(query.docs.length){
        user = query.docs[0].data()
        //DE MOMENTO NO SACO FOLLOWERS ????
        // MIRAR SI ES TEACHER Y SACAR FOLLOWERS SI NO LO ES !!!
        if(!isTeacher(user)){
            user.following = await getUsersinArray(user.following)
            user.followsyou = await getUsersinArray(user.followsyou)
        }else{
            console.log('getting content from ', user.coduser)
            user.students = await getUsersinArray(user.students)
            user.addedcontent = await getContent(user.coduser)
            console.log('addedcontent',user.addedcontent)
        }

        //SACAR ESTO SOLO PARA OTROS USUARIOS !!!!
        user.meditations = await getMeditations(userId);

        return res.status(200).json(user);

    }
    
    return res.status(400).json({'error':'couldnt get the request'});
}

async function follow(req,res,next){
    
    const followingcod= req.params.followedId
    const data = req.body;      

    let followedUserdocs = await db.collection('users').where('coduser','==', followingcod).get()    
    let userdocs = await db.collection('users').where('coduser','==',data.coduser).get()


    if(followedUserdocs.docs && userdocs.docs){
        const followedRef = await db.collection('users').doc(followedUserdocs.docs[0].id);
        const userRef = await db.collection('users').doc(userdocs.docs[0].id);

        if(data.follows){   
            await followedRef.update({followsyou: FieldValue.arrayUnion(data.coduser)});
            await userRef.update({following: FieldValue.arrayUnion(followingcod)});
        }else{
            await followedRef.update({followsyou: FieldValue.arrayRemove(data.coduser)});
            await userRef.update({following: FieldValue.arrayRemove(followingcod)});
        }
    }
    
    return res.status(200);
}

async function updatePhoto(req,res,next){
    try {
        let photo = req.body.photo;
        let userId = req.params.userId;

        let userdocs = await db.collection('users').where('coduser','==',userId).get()

        if(userdocs.docs.length){
            await db.collection('users').doc(userdocs.docs[0].id).update({image:photo})
        }

        let requests = await db.collection('requests').where('coduser','==',userId).get()

        if(requests.docs.length){
            for(var doc of requests.docs){
                await db.collection('requests').doc(doc.id).update({userimage:photo})                
            }
        }

        let comments = await db.collection('comments').where('coduser','==',userId).get()

        if(comments.docs && comments.docs.length){
            for(var doc of comments.docs){
                await db.collection('comments').doc(doc.id).update({userimage:photo})
            }
        }

        
        let chats = await db.collection('chats').where(`shortusers.${userId}`,'==',true).get()

        if(chats.docs.length){
            for(var chat of chats.docs){
                await db.collection('chats').doc(chat.id).update({[`shortusers.${userId}.userimage`]:photo})
            }
        }
    }catch(e){
        console.log(e)
    }

}

async function getPaths(req,res,next){
    let paths = await getUserPaths();
   

    return res.status(200).json(paths);
}

async function getNewContent(req,res,next){
    let query = await db.collection('content').where('isNew','==',true).get();
    let newContent = []

    for(let doc of query.docs){
        let content = doc.data()
        await expandContent(content)
        newContent.push(content)
    }


    if(newContent.length){
        newContent.sort((a,b)=>{
            let stagedifference = a.stagenumber - b.stagenumber
            if(stagedifference == 0){
                return a.position -b.position
            }else{
                return stagedifference
            }
        })
    }

    return res.status(200).json(newContent)

}   

async function expandCourse(req,res,next){
    let query = await db.collection('content').where('path', '==', req.cod).get()
    let content = []

    if(query.docs){
        for(let doc of query.docs){
            content.push(doc.data())
        }

        content.sort((a,b)=> a.position - b.position)
    }

    // también se podrían sacar los usuarios !!!

    return res.status(200).json(content)

}

// sacamos el curso y lo expandimos !!!!!!
async function getCourse(req,res,next){}

module.exports = {  
    getAllStages,
    removeFriend,
    addFriend,
    action,
    disconnect,
    updatefeed,
    connect,
    getStageCall,
    getUsers,
    getCourse,
    expandCourse,
    getNewContent,
    user,
    getTeachers,
    expandUser,
    follow,
    updatePhoto,
    getPaths
}
