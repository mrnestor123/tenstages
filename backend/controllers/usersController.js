import { getStage } from './stagesController.js';
import { db, FieldValue, storage } from '../app.js';
import admin from 'firebase-admin';
import { create_UUID } from '../util.js';

let mailbox = {};
let suscriptions = {};

/**
 * Get all users
 * @param {String} role - Role of the user {teacher, student}
 * @returns {Array} - Array of users
 */
export const getUsers = async (role) => {
    try {
        let users = [];

        if (role) {
            users = await findUsersByRole(role);
            return users;
        }

        var usersQuery = await db.collection('users').get();

        if (usersQuery.docs.length) {
            for (var doc of usersQuery.docs) {
                users.push(doc.data());
            }
        }

        return users;
    } catch (err) {
        throw new Error(err);
    }
};


export const setUserName  = async (userId, username) => {

    try {

        let query = await db.collection('users').where('nombre', '==', username).get();
        
        if(!query.docs || !query.docs.length){

            let query2 = await db.collection('users').where('userName', '==', username).get();
            
            
            if(!query2.docs || !query2.docs.length){
                let userquery = await db.collection('users').where('coduser','==', userId).get();

                if(userquery.docs.length){
                    // ESTAMOS CAMBIANDO el modelo !!! HAY QUE IR POCO A POCO
                    await db.collection('users').doc(userquery.docs[0].id).update({
                        'userName':username
                    });

                    return true;

                    //return user;
                }
            }
        }else{
            throw Error('Username already exists')
        }

    } catch (err) {
        throw new Error(err)
    }   
}



export const getAuthUsers = async () => {
    const auth = admin.auth();
    try {
        let users = await auth.listUsers();
        return users;
    } catch (err) {
        throw new Error(err);
    }
};



/**
 * Get user by id
 * @param {String} userId - User id
 * @param {Boolean} expand - Expand user data (adds created content and courses to teachers, and meditations for all users)
 * @param {Boolean} connect - Connect user data (adds stage, joined courses, read lessons, done content, notifications and the same as expand)
 * @returns {object} - User object
 */
export const getUser = async (userId, expand, connect) => {
    try {
        let user;
        let query = await db
            .collection('users')
            .where('coduser', '==', userId)
            .get();
            
        if (query.docs.length) {
            user = query.docs[0].data();    

            let userDataID;

            if (expand || connect) {
                let userDataquery = await db.collection('userData').where('coduser','==', userId).get();

                if(userDataquery.docs.length){
                    userDataID = userDataquery.docs[0].id;
                }
                
                if (user.role === 'teacher') {
                    user.addedcontent = await getUserCreatedContent(userId);
                    user.addedsections = await getUserCreatedSections(userId);
                    // DE MOMENTO LOS CURSOS NO LOS AÑADIMOS !!
                    // user.addedcourses = await getUserPaths(userId);
                    // esto es  un  poco lioso. NO  DEBE DE HACER FALTA SACAR LOS STUDENTS !!!
                    //  user.students = await getUsersinArray(user.students);
                }

                // Cuando  hacemos  expand, no deberían de hacer falta las meditations !!
                // EN CASO DE  QUE NO SE HAYA HECHO EL TRASPASO BIEN !!
                // COMPROBAMOS LAS MEDITACIONES !!
                user.meditations = await getMeditations(userDataID, user.coduser);


                // SI EL USUARIO ES DEL MODELO VIEJO REVISAMOS LAS MEDITACIONES y  las añadimos !!
                // await normalizeUser(user, userDataID);

            }

            if (connect) {
                user.stage = await getStage(user.stagenumber || user.stageNumber);

                /*
                user.joinedcourses = user.joinedcourses && user.joinedcourses.length
                    ? await expandJoinedCourses(user.joinedcourses)
                    : [];*/
            

                user.doneContent = await getUserDoneContent(userDataID, userId);

                if(userDataID){
                    user.readlessons = await getUserReadLessons(userDataID, userId); // esto ya no hará falta !!
                    
                    user.notifications = await getUserNotifications(userDataID, userId);
                }
            }

            /// Para  que funcionen app antiguas
            if (user.following || user.followsyou) {
                user.following = [];
                user.followsyou = [];
            }

            return user;
        }else{
            throw Error('User not found');
        }
    } catch (err) {
        throw new Error(err);
    }
};


/*
* El login hace register también, si el usuario no existe
*/
export const loginUser = async (userId) => {
    try {

        let query = await db.collection('users').where('coduser', '==', userId).get();

        if (!query.docs || !query.docs.length) {
            let user = {
                coduser: userId,
                stageNumber: 1,
                // AHORA LA PROGRESIÓN VA POR ETAPAS!!
                // UN USUARIO VE LAS 3 PRIMERAS ETAPAS !!
                // esto es mejorable?
                userProgression: {
                    lessonPosition: [0,0,0],
                    meditPosition:[0,0,0],
                    gamePosition:0,
                    stageShown: 1,
                },
                role: "meditator"
            }

            await db.collection('users').add(user).then((e)=> console.log('E',e))
            
            let stage = await getStage(1)
            user.stage = stage
            return user;
        } else {
            return query.docs[0].data();
        }
    } catch (err) {
        throw new Error(err);
    }
}


// REGISTRAMOS EL USUARIO SI NO EXISTE
export const registerUser = async (userId)=> {
    try {

        let query = await db.collection('users').where('coduser', '==', userId).get();

        if (!query.docs || !query.docs.length) {
            let user = {
                coduser: userId,
                stageNumber: 1,
                // AHORA LA PROGRESIÓN VA POR ETAPAS!!
                // UN USUARIO VE LAS 3 PRIMERAS ETAPAS !!
                userProgression: {
                    lessonPosition: [0,0,0],
                    meditPosition:[0,0,0],
                    gamePosition:0,
                    stageShown: 1,
                },
                role: "meditator"
            }

            await db.collection('users').add(user).then((e)=> console.log('E',e)).catch(err => console.log('ERROR CREATING USER', err));
            
            let stage = await getStage(1)
            user.stage = stage


            return user;
        }else{
            return query.docs[0].data();
        }
    } catch (err) {
        throw new Error(err);
    }
}


// queremos esto? AUN NO
export const deleteUser = async (userId) => {
    try {
        // find the user in the database and delete it

        let query = await db.collection('users').where('coduser', '==', userId).get();

        if (query.docs.length) {
            await db.collection('users').doc(query.docs[0].id).delete();
            
            let query2 = await db
            .collection('userData')
            .where('coduser', '==', userId)
            .get();

            if (query2.docs.length) {
                await db.collection('userData').doc(query2.docs[0].id).delete();
            }

            return true;
        }

        throw Error('User not found');
        

    } catch (err) {
        throw new Error(err);
    }
};


export const updateUser = async (userId, data) => {
    try {
        let query = await db
            .collection('users')
            .where('coduser', '==', userId)
            .get();


        
        if (query.docs.length) {
            await db.collection('users').doc(query.docs[0].id).set(data, { merge: true });
        }

        return data;
    } catch (err) {
        throw new Error(err);
    }
};



export const getActions = async (userId) => {
    try {
        // SE PODRÍA HACER DIFERENTE !!
        let actionsToday = [];
        let actionsThisWeek = [];
        let nonFilteredActions = [];

        let actionquery = await db
            .collection('actions')
            .where('coduser','==',userId)
            .get();
        
        /*
        let actionquery = await db
            .collection('userData')
            .doc(userDataID)
            .collection('actions')
            .get();
        */

        if(actionquery.docs){
            
            actionquery.docs.map((doc) => {
                let action = doc.data();
                // ESTO ESTÁ MAL, NO DEBERÍA DE SER ASÍ
                //action.userimage = user.image
                nonFilteredActions.push(action);
            });

            // ESTO SE PODRÍA AHORRAR CON UNA QUERY MEJOR !!!!!!!!!!!!!
            var curr = new Date(); // get current date
            var first = curr.getDate() - (!curr.getDay() ? 6 : curr.getDay() - 1); // First day is the day of the month - the day of the week
            var last = first + 6; // last day is the first day + 6

            var monday = new Date(
                new Date(curr.setDate(first)).setHours(0, 0, 0)
            );

            var sunday = new Date(curr.setDate(last));
            var today = new Date();

            // esto se ahorraria si filtrasemos en la llamada a la base de datos
            actionsToday = nonFilteredActions.filter(
                (action) =>
                    today.getDate() == new Date(action.time).getDate() &&
                    today.getMonth() == new Date(action.time).getMonth()
            );

            actionsThisWeek = nonFilteredActions.filter((action) => {
                let date = new Date(action.time);
                return ( date > monday && date < sunday && new Date(action.time).getDate() != today.getDate() );
            });

            mailbox[userId] = {
                today: actionsToday || [],
                thisweek: actionsThisWeek || [],
            };

            return mailbox[userId];
        }
    } catch (err) {
        console.log('err', err);
        throw new Error(err);
    }
};


export const addAction = async (action, userId) => {
    try {


        // LE METEMOS LA IMÁGEN DEL USUARIO. PORQUE  NO VIENE YA DESDE ANTES ????????
        let user = await getUser(userId);
        action.coduser = userId;

        // damos por hecho
        if (user) {
            if (user.image) {
                action.userimage = user.image;
            }
            
            action.username = user.username ? user.username : user.nombre;
        }

        if (mailbox[userId]) {
            mailbox[userId]['today'].push(action);
        }

        if (suscriptions[userId]) {
            // creo una suscripción para ellos
            suscriptions[userId].forEach((friend) => {
                mailbox[friend]['today'].push(action);
            });
        }


        await db.collection('actions').add(action);

        

    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};


// updatephoto
export const updatePhoto = async (photo, userId) => {
    try {
        let query = await db
            .collection('users')
            .where('coduser', '==', userId)
            .get();

        // cambiar esto a userData
        if (query.docs.length) {
            await db
                .collection('users')
                .doc(query.docs[0].id)
                .update({ image: photo });
        }

        let requests = await db
            .collection('requests')
            .where('coduser', '==', userId)
            .get();

        if (requests.docs.length) {
            for (var doc of requests.docs) {
                await db
                    .collection('requests')
                    .doc(doc.id)
                    .update({ userimage: photo });
            }
        }

        // COMO ARREGLAMOS ESTO ???
        // HAY QUE GUARDAR  LOS COMENTARIOS DE CADA USUARIO  DENTRO DE USERDATA !!

        let comments = await db
            .collection('comments')
            .where('coduser', '==', userId)
            .get();

        if (comments.docs && comments.docs.length) {
            for (var doc of comments.docs) {
                await db
                    .collection('comments')
                    .doc(doc.id)
                    .update({ userimage: photo });
            }
        }

        let chats = await db
            .collection('chats')
            .where(`shortusers.${userId}`, '==', true)
            .get();

        if (chats.docs.length) {
            for (var chat of chats.docs) {
                await db
                    .collection('chats')
                    .doc(chat.id)
                    .update({ [`shortusers.${userId}.userimage`]: photo });
            }
        }

        let actions = await db
            .collection('actions')
            .where('coduser', '==', userId)
            .get();

        if (actions.docs.length) {
            for (var action of actions.docs) {
                await db
                    .collection('actions')
                    .doc(action.id)
                    .update({ userimage: photo });
            }
        }

        return photo;
    } catch (err) {
        throw new Error(err);
    }
};


export const sendQuestion = async (question) => {
    try {
        await db.collection('questions').add(question);
    } catch (err) {
        throw new Error(err);
    }
};

// EL PATH SE LO PODRÍAMOS PASAR, PARA EL FUTURO !!
export const uploadFile = async (image, fileName) => {
    try {
        
        const file = storage.bucket(`userdocs`).file(fileName);

        console.log('uploading image')

        await file.save(image, { contentType: 'image/jpeg' });


        console.log('saved image')

        return file.publicUrl();

    } catch (err){
        console.log('ERRR',err)
        throw new Error(err)
    }
}


// GUARDA EL TIEMPO Y EL CONTENIDO  !!
// save into userData, if it exists update done time
export const doneContent = async (userId, content) =>{
    try {
        
        // Este es el bueno !!
        let finalQuery = await db.collection('doneContent')
            .where('cod','==', content.cod)
            .where('doneBy', '==', content.doneBy)
            .get();

        if(finalQuery.docs.length){
            
            let auxContent = finalQuery.docs[0].data()
            
            if(auxContent.timesFinished > content.timesFinished){
                content.timesFinished = auxContent.timesFinished
            }

            await db.collection('doneContent').doc(finalQuery.docs[0].id).update({
                done: content.done,
                date: content.date,
                doneDates: [...auxContent.doneDates || [] , auxContent.date], // guardamos las fechas en las que lo ha hecho !!
                timesFinished: content.timesFinished
            })
        } else {
            let docId  = await getUserDataId(userId);
            let query = await db.collection('userData').doc(docId).collection('doneContent').get();

            // VAMOS A quitar userData y vamos a guardarlo siempre dentro de doneContent, de momento se mantiene para compatibilidad con lo antiguo 
            if(query.docs.length){

                let query2 = await db.collection('userData').doc(docId).collection('doneContent').where('cod','==',content.cod).get();

                if(query2.docs.length){
                    let c = query2.docs[0].data()
                    if(c != null && c.timesFinished > content.timesFinished){
                        content.timesFinished = c.times
                    }
                }
            }

            await db.collection('doneContent').add(content);
        }
    }   catch (err) {
        throw new Error(err);
    }
}


export const finishMeditation =  async (userId, data) => {

    try {
        console.log('finishedmeditation', data)
        // queremos saber las meditaciones que se hacen actualmente, para poder hacer un seguimiento de la app
        await db.collection('meditations').add(data);
        
        
        //let userDataId  = await getUserDataId(userId);

        // ADD  TO MEDITATION collection
        //let query = await db.collection('userData').doc(userDataId).collection('meditations').add(data);


        return;
    } catch (err) {
        throw new Error(err);
    }
}


export const addMeditationReport = async (userId, data) => {
    try { 
        // ADD  TO MEDITATION collection
        let query = await db
            .collection('meditations')
            .where('cod','==', data.cod)
            .get()

        if(query && query.docs){
            // falta comprobar si no ha fallado esto !!
            return await db
                .collection('meditations')
                .doc(query.docs[0].id)
                .update({report: data.report});
        } else {

            let userDataId  = await getUserDataId(userId);

            return await db
                .collection('userData')
                .doc(userDataId).collection('meditations')
                .doc(query.docs[0].id).update({report: data.report});

        }


    } catch (err)  {
        throw new Error(err);
    }
}

/*
export const finishLesson = async (userId, data) => {

    try {
        let lessonquery = await db.collection('doneContent')

        let userDataId  = await getUserDataId(userId);

        
        // ADD  TO MEDITATION collection
        let query = await db.collection('userData').doc(userDataId).collection('readLessons').get();

        if(query.docs){
            let lessons = await db.collection('userData').doc(userDataId).collection('readLessons').doc(query.docs[0].id).get();

            let lessonsArray = lessons.data().readLessons;

            // si no está en el array la añadimos
            if(!lessonsArray.includes(data)){
                await db.collection('userData').doc(userDataId).collection('readLessons').doc(query.docs[0].id).update({
                    readLessons: FieldValue.arrayUnion(data)
                });
            }
        }else{
            await db.collection('userData').doc(userDataId).collection('readLessons').add({
                'coduser': userId,
                'readLessons':  [data]
            });
        }

        return;
    } catch (err) {
        throw new Error(err);
    }
}*/


export const getUserDataId = async (userId) => {

    let query = await db
        .collection('userData')
        .where('coduser', '==', userId)
        .get();

    if (query.docs.length) {
        return query.docs[0].id;
    } else  { 
        // create collection
        let userCod = {
            coduser: userId,
        }

        let doc = await db.collection('userData').add(userCod);

        return doc.id;
    }
}


const findUsersByRole = async (role) => {
    try {
        let users = [];
        let query = await db
            .collection('users')
            .where('role', '==', role)
            .get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                users.push(doc.data());
            }
        }

        return users;
    } catch (err) {
        throw new Error(err);
    }
};

const getUserCreatedContent = async (userId) => {
    try {
        let content = [];
        let query = await db
            .collection('content')
            .where('createdBy', '==', userId)
            .get();

        if (query.docs) {
            for (var doc of query.docs) {
                if (doc.data().position != null && doc.data().path == null) {
                    content.push(doc.data());
                }
            }
        }

       

        if (content.length) {
            content.sort((a, b) => a.position - b.position);
        }

        return content;
    } catch (err) {
        throw new Error(err);
    }
};

const getUserCreatedSections = async (userId) => {
    
    try {
        let sections = [];
        let query = await db
            .collection('sections')
            .where('createdBy', '==', userId)
            .get();

        if (query.docs) {
            for (var doc of query.docs) {
                let section = doc.data();

                // EXPAND CONTENT
                let contentquery =  await db.collection('content').where('cod','in',section.content).get();
                
                if(contentquery.docs){
                    section.content = [];
                    for(let doc of contentquery.docs){
                        section.content.push(doc.data());
                    }

                    

                }

                sections.push(section);
            }
        }

        return sections;
    } catch (err) {
        throw new Error(err);
    }
};


const getUserPaths = async (userId) => {
    try {
        let paths = [];
        let query = await db
            .collection('paths')
            .where('createdBy', '==', userId)
            .get();

        if (query.docs &&  query.docs.length) {
            for (var doc of query.docs) {
                paths.push(doc.data());
            }
        }

        return paths;
    } catch (err) {
        throw new Error(err);
    }
};

const getMeditations = async (docId, userId) => {
    try {
        let meditations = [];
        
        let query2 = await db 
            .collection('meditations')
            .where('coduser', '==', userId)
            .get();

        if (query2.docs && query2.docs.length) {
            for (var doc of query2.docs) {
                meditations.push(doc.data());
            }
        }
        

        // HACEMOS DOS LLAMADAS DE MOMENTO
        if(docId){
            let query = await db
                .collection('userData')
                .doc(docId)
                .collection('meditations')
                .get();

            if (query.docs && query.docs.length) {
                for (var doc of query.docs) {
                    let medit = doc.data();
                    if(!meditations.find(m => m.cod === medit.cod)){
                        meditations.push(medit);
                    }
                }
            }
        }


        return meditations;
    } catch (err) {
        throw new Error(err);
    }
};

const expandJoinedCourses = async (joinedCourses) => {
    try {
        let courses = [];
        for (var course of joinedCourses) {
            let query = await db
                .collection('paths')
                .where('cod', '==', course)
                .get();
            if (query.docs.length) {
                courses.push(query.docs[0].data());
            }
        }

        return courses;
    } catch (err) {
        throw new Error(err);
    }
};

        // creo que esto ya no hace falta !!
const getUserReadLessons = async (docId) => {
    try {

        let lessons = [];
        let query = await db
            .collection('userData')
            .doc(docId)
            .collection('readLessons')

        // READLESSONS ES UN ARRAY
        // debería ser cada uno un documento ??
        if (query.docs && query.docs.length) {
            for (var doc of query.docs) {
                let data = doc.data()
                if(data.lessons){
                    lessons = data.lessons
                }
            }
        }

        return lessons;
    } catch (err) {
        throw new Error(err);
    }
};

const getUserDoneContent = async (docId, coduser) => {
    try {
        let doneContent = [];
        
        


        // LO PASAMOS TODO A UNA SOLA BASE DE DATOS 
        let query2 = await db
            .collection('doneContent')
            .where('doneBy','==', coduser)
            .get();

        if (query2.docs && query2.docs.length) {
            for (var doc of query2.docs) {
                let data = doc.data()

                doneContent.push(data)
                
            }
        }

        // modelo antiguo 
        if(docId){
            let query = await db
                .collection('userData')
                .doc(docId)
                .collection('doneContent')
                .get();

            if (query.docs && query.docs.length) {
                for (var doc of query.docs) {
                    let data = doc.data();
                    
                    let index = doneContent.findIndex((d)=> d.cod == data.cod) 
                    if(index != -1)doneContent[index] = data
                    
                    else doneContent.push(data);
                }
            }   
        }

        
        return doneContent;
    } catch (err) {
        console.log('err',err)
        throw new Error(err);
    }
};

const getUserNotifications = async (docId) => {
    try {
        let notifications = [];
        let query = await db
            .collection('userData')
            .doc(docId)
            .collection('notifications')
            .get();

        if (query.docs && query.docs.length) {
            for (var doc of query.docs) {
                notifications.push(doc.data());
            }
        }

        return notifications;
    } catch (err) {
        throw new Error(err);
    }
};

// enviamos  un array de  códigos de usuario
const getUsersinArray = async (cods) => {
    try {
        let docs = [];
        let users = [];

        if (cods && cods.length) {
            for (var i = 0; i < cods.length; i += 10) {
                let query = await db
                    .collection('users')
                    .where('coduser', 'in', cods.slice(i, i + 10))
                    .get();
                docs = docs.concat(query.docs);
            }

            for (var doc of docs) {
                users.push(doc.data());
            }
        }
        return users;
    } catch (err) {
        throw new Error(err);
    }
};



// para pasar de usuarios antiguos a nuevos
async function normalizeUser(user){


    let userId = user.coduser

    console.log('NORMALIZING USER', userId)

    if(user.following) {
        let meditations = []
        
        
        let meditquery = await db.collection('meditations').where('coduser','==', userId).get();
        if(meditquery.docs.length){
            for(let medit of meditquery.docs){
                meditations.push(medit.data());
            }
        }


        if(meditations.length > 0){
            if(!user.meditations){
                user.meditations = []
            }
            user.meditations = user.meditations.concat(meditations)
        }
    }


    let userDataquery = await db.collection('userData').where('coduser','==', userId).get();

    if(userDataquery.docs.length){
        let userDataId = userDataquery.docs[0].id;
        /// PPASAR  ESTO  A UNA COLECCIÓN APARTE,DE MOMENTO SOLO PASO ACCIONES
        // let doneContent = await getUserDoneContent(userDataId);
        // let readLessons = await getUserReadLessons(userDataId);
        //let notifications = await getUserNotifications(userDataId);
        let actions = await db.collection('userData').doc(userDataId).collection('actions').get();

        let doneContent = await getUserDoneContent(userDataId);


        if(doneContent && doneContent.length){
            let printed = false;
            let recentContent = [];

            for(let content of doneContent){

                if(content.date){

                    // check if content done is within  3 months  from now
                    let now = new Date();
                    let contentDate = new Date(content.date);
                    let diff = now - contentDate;
                    let diffDays = diff / (1000 * 60 * 60 * 24);


                    if(diffDays < 90){
                        recentContent.push(content)
                    }
                }
            }

            
            if(recentContent.length){
                recentContent.sort((a,b)=>{
                    new Date(b.date) - new Date(a.date)
                })

                let justAdded = false;
                
                for(let content of recentContent){
                    
                    // CHECK IF NOT EXISTS !!
                    if(content.cod){
                        let exists = await db
                            .collection('doneContent')
                            .where('cod','==',content.cod)
                            .get()
                    
                        if(exists.docs.length){
                            continue;
                        }

                    } else content.cod = create_UUID() 



                     
                    await db.collection('doneContent').add(content);
            


                    /*if(action.time && new Date(action.time).getFullYear() == 2024){

                        if(!justAdded){
                            console.log('adding action', action)
                            justAdded = true    
                        // await db.collection('actions').add(action);
                        } 
                    }*/
                }
            }

        }

        if(actions.docs && actions.docs.length){

            let justAdded = false;
            
            for(let doc of actions.docs){
                // CHECK IF NOT EXISTS !!
                let action = doc.data();


                if(action.cod){
                    let exists = await db.collection('actions').where('cod','==',action.cod).get()
                    if(exists.docs.length){
                       continue;
                    }
                } else action.cod = create_UUID() 


                if(action.time && new Date(action.time).getFullYear() == 2024){

                    if(!justAdded){
                        console.log('adding action', action)
                        justAdded = true    
                        await db.collection('actions').add(action);
                    } 
                }
            }
        }
    }
}





// TEST GET USERS
//getUsers().then(users => console.log(users.slice(0, 5))); //SUCCESS
//getUsers('teacher').then(users => console.log(users)); //SUCCESS

// TEST GET USER
//getUser('ASI9f9j4qjgsYSoGp81aAO5iLf33', false, true).then(user => console.log(user));
