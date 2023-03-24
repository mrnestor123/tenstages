import { getUser } from "../api/server.js"



let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

//PASAR A CLASE MEDITACIÓN
const types = [
    {label:'Meditation practice',value:'meditation-practice'},
    {label:'Recording',value:'recording'},
    {label:'Video',value:'video'},
    {label:'Lesson Slides',value:'lesson'},
    {label:'Article',value:'article'},
    {label:'List of content', value:'list'}
]

class UserEntity {

    // hay atributos solo únicos a un profesor !!
    constructor(json){
        if(json){   // create json method to create a json from the user
            this.codUser = json.coduser;
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
}

// un user vacío para que sepa que es un objeto
var user = new UserEntity();

// HABRÁ QUE PASAR ESTO A COOKIES DE FIREBASE
function isLoggedIn(){

    let cod = localStorage.getItem('meditationcod')

    if(!cod){
        localStorage.setItem('meditationcod','gfZM9BlAfKdVvzTmTPW1RJcJV423')
        cod  = 'gfZM9BlAfKdVvzTmTPW1RJcs'
    }

    return new Promise((resolve, reject)=>{
        // ESTO ES MEJORABLE!!!
        if(cod){
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

/*

    String cod,title,description,longdescription, image, createdBy;
  int price;
  bool isNew,  showStudents, allowChat;

  DateTime startDate, endDate;

  List<Content> content = new List.empty(growable: true);
  List<User> students = new List.empty(growable: true);
  List<Announcement> announcements = new List.empty(growable: true);

*/

// HAYQUE CREAR CLASE USER

// utilizamos Entity o no??
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
        
        // Puntuación 
        // this.score = json.score || 0
        // reviews 
        // published 
        // this.published = json.published || false
        // this.reviews = json.reviews || []
        
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

class StageEntity {


    constructor(json){

        this.newpathposition = json.newpathposition
        this.type = json.type
        this.title = json.title
        this.image = json.image
        this.stagenumber = json.stagenumber
        this.position = json.position
        this.cod = json.cod
        this.text = json.text
        this.description = json.description


    }
}

let primarycolor = '#E0D5B6'

export {types, stagenumbers, UserAction, CourseEntity, isLoggedIn, loginUser, user, Content, Meditation, Lesson, StageEntity }
