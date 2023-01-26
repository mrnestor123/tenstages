
// MODELO DE CLASE USUARIO Y TEACHER




class User {

    // HAY UNA  BARBARIDAD DE ATRIBUTOS !! // REVISAR EN EL FUTURO !!
    constructor(json){
        // create json method to create a json from the user
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



// CREAR MODELO USUARIO  !!!! 
// CREAR MODELO CONTENT  !!!!
// CREAR MODELO 
// CREAMOS MODELO ACTION
class UserAction{
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


export {User, UserAction}