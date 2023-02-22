import { getUser } from "./server.js"

//PASAR A CLASE MEDITACIÓN
const types = [
    {label:'Meditation practice',value:'meditation-practice'},
    {label:'Recording',value:'recording'},
    {label:'Video',value:'video'},
    {label:'Text',value:'lesson'},
]

let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

// CREAR MODELO USUARIO  !!!! 
// CREAR MODELO CONTENT  !!!!
// CREAR MODELO 
// CREAMOS MODELO ACTION
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

// HAYQUE CREAR CLASE USER
class CourseEntity {

    constructor(json){
        this.cod =  json.cod
        this.title = json.title
        this.startDate = json.startDate ? new  Date(json.startDate):''
        this.endDate  = json.endDate ? new  Date(json.endDate):''
        this.image = json.image 
        this.description = json.description
        this.price = json.price

        // ESTO SERÍA PARA LLAMAR A LA GENTE
        this.events = json.events || []
        this.content = json.content || []
        

    };


    // DEVUELVE UN ARRAY DE LABEL Y NAME
    getFields(){



        return [
            this.startDate,
            this.endDate,
            this.price
        ]
    }
}

class UserEntity {

    // hay  atributos solo únicos a un profesor !!
    constructor(json){
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
function isLoggedIn() {
    if(localStorage.getItem('meditationcod')){
        getUser(localStorage.getItem('meditationcod')).then((usr)=>{
            if(usr){
                user = new UserEntity(usr)
                console.log('soy el user', user)
                //console.log('pageUser', pageUser)

                m.redraw()
            }
        })
    }
}

function loginUser(cod) {

    localStorage.setItem('meditationcod', uid)

    getUser(cod).then((usr)={
        if(usr){
            user = new UserEntity(usr)
            m.redraw()
        }
    })
}

class Content {
    constructor(json){        
        this.cod = json.cod;
        this.title = json.title;
        this.description = json.description;
        this.image = json.image;
        this.type = json.type;
        this.file = json.file;
        this.doneBy = json.doneBy;
        this.stagenumber = json.stagenumber;
        this.position = json.position;
        this.blocked = json.blocked;
        this.isNew = json.isNew;
        this.createdBy = json.createdBy;
        this.done = json.done;
        this.total = json.total;
    }
}

class Lesson extends Content {
    constructor(json){
        super(json)
        this.text =  json.text
    }
}

class Meditation {
  constructor(json){
    this.coduser = json.coduser;
    this.notes = json.notes;
    this.duration = json.duration;
    this.day = json.day;
    this.content = json.content;
    this.followalong = json.followalong;
    this.meditationSettings = json.meditationSettings;
  }
}

export {types, stagenumbers, UserAction, CourseEntity, isLoggedIn, loginUser, user, Content, Meditation, Lesson}