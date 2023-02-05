import { getUser } from "../server.js"



class UserEntity {

    // hay  atributos solo únicos a un profesor !!
    constructor(json){
        console.log('json',json)
        if(json){// create json method to create a json from the user
            this.coduser = json.coduser;
            this.nombre = json.nombre;
            this.user = json.user;
            this.position = json.position;
            this.image = json.image;
            this.stagenumber = json.stagenumber;
            this.stage = json.stage;
            this.offline = json.offline;
            this.role = json.role;
            this.meditposition = json.meditposition;
            this.userStats = json.userStats;
            this.followed = json.followed;
            this.answeredquestions = json.answeredquestions;
            this.gameposition = json.gameposition;
            this.settings = json.settings;
            this.version = json.version;
            this.stagelessonsnumber = json.stagelessonsnumber;
            this.unreadmessages = json.unreadmessages;
            this.meditationTime = json.meditationTime;
            this.lastmeditduration = json.lastmeditduration;
            this.website = json.website;
            this.teachinghours = json.teachinghours;
            this.location = json.location;
            this.description = json.description;
            this.seenIntroCarousel = json.seenIntroCarousel;
            this.reminderTime = json.reminderTime;
            this.stageupdated = json.stageupdated;
            this.percentage = json.percentage;
            this.progress = json.progress;
            this.timemeditated = json.timemeditated;
            
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
}



// un user vacío para que sepa que es un objeto
var user = new UserEntity();

// HABRÁ QUE PASAR ESTO A COOKIES DE FIREBASE
function isLoggedIn(){
    if(localStorage.getItem('meditationcod')){
        getUser(localStorage.getItem('meditationcod')).then((usr)=>{
            if(usr){
                user = new UserEntity(usr)
                console.log('pageUser',pageUser)

                m.redraw()
            }
        })
    }
}

function loginUser(cod){

    localStorage.setItem('meditationcod', uid)

    getUser(cod).then((usr)={
        if(usr){
            user = new UserEntity(usr)
            m.redraw()
        }
    })
}




export {isLoggedIn,  loginUser,  user}

