

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