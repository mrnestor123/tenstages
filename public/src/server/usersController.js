import { api_get } from "../components/util.js";
import { API, db , auth} from "./server.js";


export {
    
    UserEntity, UserAction,

    isLoggedIn,
    getUser,
    getUsers,
    getTeachers,
    getUserActions,
    deleteUser,
    login,
    loginUser,
    updateUser,
    user
}

/*
*
* MODELOS
*
*/
class UserEntity {

    // hay atributos solo únicos a un profesor !!
    constructor(json){
        if(json){   // create json method to create a json from the user
            this.coduser = json.coduser;
            this.nombre = json.nombre;
            this.user = json.user;
            this.position = json.position;
            this.image = json.image;
            this.stageNumber = json.stagenumber;
            this.stage = json.stage;
            this.offline = json.offline;
            this.role = json.role;
            this.meditPosition = json.meditposition;
            this.userStats = json.userStats;
            this.followed = json.followed;
            this.answeredQuestions = json.answeredquestions;
            this.gamePosition = json.gameposition;
            this.settings = json.settings;
            this.version = json.version;
            this.stageLessonsNumber = json.stagelessonsnumber;
            this.unreadMessages = json.unreadmessages;
            this.meditationTime = json.meditationTime;
            this.lastMeditDuration = json.lastmeditduration;
            this.website = json.website;
            this.teachingHours = json.teachinghours;
            this.location = json.location;
            this.description = json.description;
            this.seenIntroCarousel = json.seenIntroCarousel;
            this.reminderTime = json.reminderTime;
            this.stageUpdated = json.stageupdated;
            this.percentage = json.percentage;
            this.progress = json.progress;
            this.timeMeditated = json.timemeditated;
            
            // Listas
            this.students = json.students;
            this.addedcontent = json.addedcontent;
            this.addedcourses = json.addedcourses;
            this.unreadmessages = json.unreadmessages;
            this.messages = json.messages;
            this.joinedcourses = json.joinedcourses;
            this.passedObjectives = json.passedObjectives;
            this.todayactions = json.todayactions;
            this.thisweekactions = json.thisweekactions;
            this.lastactions = json.lastactions;
            this.following = json.following;
            this.followers = json.followers;
            this.notifications = json.notifications;
            this.presets = json.presets;
            this.files = json.files;
            this.contentDone = json.contentDone;
            this.retreats = json.retreats;
        }
    }

    isAdmin = function(){
        return this.role === 'admin'
    }
}

class UserAction {
    constructor(json){
        var types = {
            "meditation": (action) => 'meditated for ' + action[0] + ' min',
            "guided_meditation": (action) => "took " + action[0] + ' for ' + action[1] + ' min',
            "updatestage": (action) => "climbed up one stage to " + action,
            "recording": (action) => "listened to " + action[0],
            'game': (action) => 'played ',
            'lesson': (action) => 'read ' + action
        };

        this.message = types[json.type](json.action);  
        this.time = json.time;
    }
}


// un user vacío para que sepa que es un objeto
var user = new UserEntity();


/*
*
* FUNCIONES DEL SERVIDOR
*
*/
function loginUser(cod){

    localStorage.setItem('meditationcod', uid)

    getUser(cod).then((usr)={
        if(usr){
            user = new UserEntity(usr)
            m.redraw()
        }
    })
}

// HABRÁ QUE PASAR ESTO A COOKIES DE FIREBASE
function isLoggedIn(){
    let userData = localStorage.getItem('meditationcod')
    ? JSON.parse(localStorage.getItem('meditationcod')) 
    : null


    if(userData && userData.coduser ){
        user.role = userData.role || 'teacher'
        user.coduser = userData.coduser
    }

    /*
    if(!userData){
        localStorage.setItem('meditationcod','"J6mQEsPSr2ctveUZTYx4jmA6rDH3"')
        userData  = 'gfZM9BlAfKdVvzTmTPW1RJcs'
    }*/
    
    return new Promise((resolve, reject)=>{
        
            // ESTO ES MEJORABLE!!!
        if(userData){
            let cod

            if(typeof userData == 'object'){
                cod = userData.coduser
            }else{
                cod = userData
            }


            console.log('cod',cod)


            getUser(cod).then((usr)=>{
                if(usr){
                    user = new UserEntity(usr)
                    resolve()
                    m.redraw()
                }
            })
            // hacer reject??
        }else resolve()
    })
    /*
    */

    
}


// DEVUELVE EL USUARIO DE FIREBASE
// esto se podría hacer en el server??
async function login({ type, email, password }) {
    if (type == 'google' || type == 'facebook') {
        var provider;

        if (type == 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else {
            provider = new firebase.auth.FacebookAuthProvider();
        }

        auth.useDeviceLanguage();

        return firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                return result.user
                // ...
            }).catch((error) => {
                console.log("Error when logging with external app", error.message)
                return error.message
                // ...
            });
    } else {
        return auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            return user;
        })
        .catch((error) => {
            console.log("Error when logging with email", error.message)
            return error.message
        });
    }
}


async function deleteUser(cod) {
    let user = await db.collection('users').where('coduser', '==', cod).get();
    console.log(user)
    await db.collection("users").doc(user.docs[0].id).delete()


    let usermeditations = await db.collection('meditations').where('coduser', '==', cod).get();

    for (var meditation of usermeditations.docs) {
        await db.collection("meditations").doc(meditation.id).delete()
    }

    let useractions = await db.collection('actions').where('coduser', '==', cod).get();

    for (var action of useractions.docs) {
        await db.collection("actions").doc(action.id).delete()
    }

    let users = await db.collection('users').where('following', 'array-contains', cod).get();

    for (let doc of users.docs) {
        doc.update({ following: firebase.firestore.FieldValue.arrayRemove(cod) });
    }
}


async function updateUser(user){
    let query = await db.collection('users').where('coduser', '==', user.coduser).get()
    let docID = query.docs[0].id

    db.collection('users').doc(docID).update(user).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

async function getUsers() {
    var query = await db.collection('users').get()
    let users = []

    for (let doc of query.docs) {
        users.push(doc.data())
    }

    return users;
}

async function getUser(cod){
    //OJOOO
    let user = await api_get(`${API}/connect/${cod}`)
    

  return user;
}


async function getUserActions(coduser){
    
    let query = await db.collection('actions').where('coduser','==',coduser).get()
    let actions = []

    for (let doc of query.docs) {
        actions.push(doc.data())
    }

    return actions;
} 

async function getTeachers(){

    var query = await db.collection('users').where('role','==','teacher').get();

    let teachers = []

    for (let doc of query.docs) {
        teachers.push(doc.data());
    }

    return teachers;
}

