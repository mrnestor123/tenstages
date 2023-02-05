import { getUser } from "../server.js"



class UserEntity {

    // hay  atributos solo únicos a un profesor !!
    constructor(json){
        console.log('json',json)
        if(json){
        this.coduser = json.coduser
        this.nombre = json.nombre
        this.position = json.position
        this.image = json.image
        this.stageNumber = json.stagenumber
        this.stage = json.stage
        this.offline = json.offline
        this.role = json.role
        this.meditPosition = json.meditposition
        this.userStats = json.userStats
        this.followed = json.followed
        this.answeredQuestions = json.answeredquestions
        this.gamePosition = json.gameposition
        this.settings = json.settings
        this.version = json.version
        this.stageLessonsNumber = json.stagelessonsnumber
        this.unreadMessages = json.unreadmessages
        this.meditationTime = json.meditationTime
        this.lastmeditDuration = json.lastmeditduration
        this.website = json.website
        this.teachingHours = json.teachinghours
        this.location = json.location
        this.description = json.description
        this.seenIntroCarousel = json.seenIntroCarousel
        this.reminderTime = json.reminderTime
        
            
        // listas
        this.meditations = json.meditation || []
        this.notifications = json.notifications || []
        this.presets = json.presets || []
        this.students = json.students || []
        this.doneContent = json.doneContent || []
    
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

