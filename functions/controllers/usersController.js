import { getStage } from './stagesController.js';
import { db } from '../app.js';


let mailbox = {}
let suscriptions = {}
// Get all users 
// This router can have query params ?role=teacher or ?role=student or ...
// Se le podría pasar un rol,  o  sacar los usuarios de  cierto curso  o sacar  los estudiantes de un profesor!
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

    } catch(err) {
        throw new Error(err);
    }
};


// 3 tipos de get user connect, expandUser, normal
export const getUser = async (userId, expand, connect) => {
    try {
        let user;
        let query = await db.collection('users')
            .where('coduser', '==', userId)
            .get();

        if (query.docs.length) {
            user = query.docs[0].data();
            if (expand || connect) {
                if (user.role === "teacher") {
                    user.addedcontent = await getUserCreatedContent(userId);
                    user.addedcourses = await getUserPaths(userId);
                    // esto es  un  poco lioso. NO  DEBE DE HACER FALTA SACARLOS !!!!
                    user.students = await getUsersinArray(user.students);
                }
                user.meditations = await getMeditations(userId);
            }
            if (connect) {
                user.stage = await getStage(user.stagenumber);
                user.joinedcourses = user.joinedcourses && user.joinedcourses.length
                    ? await expandJoinedCourses(user.joinedcourses)
                    : [];
                user.readlessons = await getUserReadLessons(userId);
                user.doneContent = await getUserDoneContent(userId);
                user.notifications = await getUserNotifications(userId);
            }

            /// Para  que funcionen app  antiguas
            if( user.following || user.followsyou){
                user.following = []
                user.followsyou = []
            }
        }
        
        return user;

    } catch(err) {
        throw new Error(err);
    }
};

// queremos esto? AUN NO
export const deleteUser = async () => {
    try {
        // delete user
        // cuando se borra un usuario deberán borrarse todos los datos asociados a él
    } catch(err) {
        throw new Error(err);
    }
};

// queremos esto? SI AUN FALTA HACERLO 17/12/22
export const updateUser = async (userId, data) => {
    try {
        let query = await db.collection('users')
            .where('coduser', '==', userId)
            .get();

        if (query.docs.length) {
            await db.collection('users')
                .doc(query.docs[0].id)
                .update(data);
        }

        return data;
    
    } catch(err) {
        throw new Error(err);
    }
};


export const getActions = async (userId)=>{
    try{
        // SE PODRÍA HACER DIFERENTE !!
        let actionstoday = []
        let actionsthisweek = []
        let nonfilteredactions = []
        let query = await db.collection('actions').where('coduser','==', userId).get();

        if(query.docs){      
            query.docs.map((doc) => {
                let action = doc.data()
                // ESTO ESTÁ MAL, NO DEBERÍA DE SER ASÍ
                //action.userimage = user.image
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

            mailbox[userId] = {'today': actionstoday || [], 'thisweek': actionsthisweek || []}

            return mailbox[userId];	
        }
    } catch(err) {
        console.log('err',err)
        throw new Error(err);
    }
}

export const addAction = async (action, userId)=>{
    try {    
        // LE METEMOS LA IMÁGEN DEL USUARIO ????
        let user = await getUser(userId)
        
        action.coduser = userId
        // damos por hecho 
        if(user){
            if(user.image){
                action.userimage = user.image
            }

            action.username = user.username ?  user.username : user.nombre
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

        console.log('adding action',action)

        db.collection('actions').add(action)
    }catch(err){
        console.log(err)
        throw new Error(err);
    }
}

// updatephoto
export const updatePhoto = async (photo, userId) => {
    try {
        let query = await db.collection('users')
            .where('coduser', '==', userId)
            .get();

        // cambiar esto a userData
        if (query.docs.length) {
            await db.collection('users').doc(query.docs[0].id).update({image: photo});
        }

        let requests = await db.collection('requests').where('coduser','==',userId).get()
        
        if(requests.docs.length){
            for(var doc of requests.docs){
                await db.collection('requests').doc(doc.id).update({userimage:photo})                
            }
        }

        // COMO ARREGLAMOS ESTO ??? 
        // HAY QUE GUARDAR  LOS COMENTARIOS DE CADA USUARIO  DENTRO DE USERDATA !!
        
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

        let actions = await db.collection('actions').where('coduser','==',userId).get()

        if(actions.docs.length){
            for(var action of actions.docs){
                await db.collection('actions').doc(action.id).update({userimage:photo})
            }
        }

        return photo;
    } catch(err) {
        throw new Error(err);
    }
}


const findUsersByRole = async (role) => {
    try {
        let users = [];
        let query = await db.collection('users')
            .where('role', '==', role)
            .get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                users.push(doc.data());
            }
        }

        return users;

    } catch(err) {
        throw new Error(err);
    }
};

const getUserCreatedContent = async (userId) => {
    try {
        let content = [];
        let query = await db.collection('content')
            .where('createdBy', '==', userId)
            .get();

        if (query.docs) {
            for (var doc of query.docs) {
                if(doc.data().position != null && doc.data().path == null){
                    content.push(doc.data());
                }
            }
        }
        if (content.length) { content.sort((a,b)=> a.position -b.position) }

        return content;

    } catch(err) {
        throw new Error(err);
    }
};

const getUserPaths = async (userId) => {
    try{
        let paths = [];
        let query = await db.collection('paths').where('createdBy', '==', userId).get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                paths.push(doc.data());
            }
        }

        return paths;
        
    } catch(err) {
        throw new Error(err);
    };

    
};

const getMeditations = async (userId) => {
    try{
        let meditations = [];
        let query = await db.collection('meditations').where('coduser', '==', userId).get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                meditations.push(doc.data());
            }
        }

        return meditations;
        
    } catch(err) {
        throw new Error(err);
    };
};

const expandJoinedCourses = async (joinedCourses) => {
    try{
        let courses = [];
        for(var course of joinedCourses){
            let query = await db.collection('paths').where('cod', '==', course).get();
            if(query.docs.length){
                courses.push(query.docs[0].data());
            }
        }

        return courses;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserReadLessons = async (userId) => {
    try{
        let lessons = [];
        let query = await db.collection('lessons')
            .where('coduser', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                lessons.push(doc.data());
            }
        }

        return lessons;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserDoneContent = async (userId) => {
    try{
        let doneContent = [];
        let query = await db.collection('doneContent')
            .where('doneBy', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                doneContent.push(doc.data());
            }
        }
        return doneContent;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserNotifications = async (userId) => {
    try{
        let notifications = [];
        let query = await db.collection('notifications')
            .where('coduser', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                notifications.push(doc.data());
            }
        }
        return notifications;
        
    } catch(err) {
        throw new Error(err);
    };
};

// enviamos  un array de  códigos de usuario
const getUsersinArray = async (cods) => {
    try {
        let docs = []
        let users = []

        if(cods && cods.length){
            for(var i = 0; i < cods.length; i+=10){
                let query = await db.collection('users').where('coduser', 'in', cods.slice(i, i+10)).get()
                docs = docs.concat(query.docs)
            }

            for(var doc of docs){
                users.push(doc.data())
            }
        }
        return users 
    } catch(err) {
        throw new Error(err);
    }
}

const getUserData =  async (userId) => {
    try {
        let query = await db.collection('userData').where({'coduser':userId}).get();

        if(query.docs){
            // HAY QUE AÑADIRLAS A UN ARRAY
            let notifications =  await db.collection('userData').doc(query.docs[0].id).collection('notifications').get();
            let meditations =  await db.collection('userData').doc(query.docs[0].id).collection('meditations').get();
            let readLessons =  await db.collection('userData').doc(query.docs[0].id).collection('readlessons').get();
            let doneContent =  await db.collection('userData').doc(query.docs[0].id).collection('doneContent').get();
            let joinedCourses =  await db.collection('userData').doc(query.docs[0].id).collection('joinedCourses').get();

            let userData = {}

            return  userData;
        }

        return user.data();
    } catch(err) {
        throw new Error(err);
    }
}

// TEST GET USERS
//getUsers().then(users => console.log(users.slice(0, 5))); //SUCCESS
//getUsers('teacher').then(users => console.log(users)); //SUCCESS

// TEST GET USER
//getUser('ASI9f9j4qjgsYSoGp81aAO5iLf33', false, true).then(user => console.log(user));