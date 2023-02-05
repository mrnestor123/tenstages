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


export {Content,Meditation, Lesson}