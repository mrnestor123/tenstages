//import { getUser } from "../src/api/usersController.js"

// IR CREANDO CLASES DE LOS MODELOS !!
let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

//PASAR A CLASE MEDITACIÓN
// ESTO LO GUARDAMOS EN EL CONTENTCONTROLLER!!! 
const types = [
    {label:'Meditation practice',value:'meditation-practice'},
    {label:'Recording',value:'recording'},
    {label:'Video',value:'video'},
    {label:'Lesson Slides',value:'lesson'},
]


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

export {types, stagenumbers, UserAction, CourseEntity,  StageEntity }
