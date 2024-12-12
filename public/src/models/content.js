

// Habrá que crear la clase de meditación, de lección y tal tal tal
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

    // islesson, is meditation, is recording, is video or is game
    isLesson(){
        return this.type.match('lesson|brain|meditation')
    }

    isMeditation(){
        return this.type.match('meditation-practice')
    }


    isRecording(){
        return this.type.match('recording')
    }

    isVideo(){
        return this.type.match('video')
    }

    isGame(){
        return this.type.match('game')
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


const contentTypes  = {
    Lesson: 'lesson',
    Meditation: 'meditation-practice',
    Game: 'game',
    Recording: 'recording',
    Video: 'video'
}


const contentIcons  = {
    'lesson': 'book',
    'meditation-practice': 'self_improvement',
    'game': 'sports_esports',
    'recording': 'record_voice_over',
    'video': 'videocam'
}


export {Content, Meditation, Lesson,  contentTypes, contentIcons}
