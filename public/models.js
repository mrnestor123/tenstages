
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








export {types,stagenumbers, UserAction, CourseEntity}