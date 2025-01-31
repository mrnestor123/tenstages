import { api_get } from "../components/util.js"
import { API, db } from "./server.js"



export {
    types, stagenumbers,  contentIcons, contentTypes,
    Content, Lesson, Meditation, StageEntity, 


    addSection,
    addContent,
    addMilestone,
    getContent,
    getContentbycod,
    getTeachersContent,
    getAllContent,
    getMilestones,
    getSections,
    deleteContent,
    updateContent,
    updateStage,
    updateMilestone,
    updateSection
}

// AÑADIR MODELO DE CONTENT AQUI ??
let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]

let contentIcons = []

let contentTypes = {}


//PASAR A CLASE MEDITACIÓN
// ESTO LO GUARDAMOS EN EL CONTENTCONTROLLER!!! 
const types = [
    {label:'Meditation practice',value:'meditation-practice'},
    {label:'Recording',value:'recording'},
    {label:'Video',value:'video'},
    {label:'Lesson Slides',value:'lesson'},
]



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


// utilizamos Entity o no??
/*
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
*/
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



/*
*
* llamadas add
*/

async function addSection(section){

    let query = await db.collection('sections').add(section).then(function () {
        alert("Added section");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });

    return true
}

async function addContent(content) {
    
    let query = await db.collection('content').add(content).then(function () {
        alert("Added section");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });
    
    return true
}

async function addMilestone(m){
    let query = await db.collection('milestones').add(m).then(function () {
        alert("Added section");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });
    
    return true
    

}



/** 
 * llamadas GET
 * */ 


async function getContentbycod(cod) {
    var query = await db.collection('content').where('cod', '==', cod).get();
    let content = {};
    content = query.docs[0].data();

    if(content.path){
        var query = await db.collection('paths').where('cod','==',content.path).get()
        content.path = query.docs[0].data();
    }

    return content;
}


async function getAllContent(){
    var query = await db.collection('content').get();
    let content = [];
    //para sacar la imagen
    for (let doc of query.docs) {
        content.push(doc.data());
    };

    return content;
}

// returns all the content
// estas dos funciones tendrán que ser las mismas.
async function getContent(stagenumber) {
    var query = await db.collection('content').where('stagenumber', '==', stagenumber).get();
    let content = [];
    //para sacar la imagen
    for (let doc of query.docs) {
        content.push(doc.data());
    };

    return content;
}

async function getTeachersContent(coduser){
    let query = await db.collection('content').where('createdBy','==', coduser).get()

    if(query.docs){
        let content = []
        for(var doc of query.docs){
            content.push(doc.data())
        }
        console.log('GOT TEACHERS CONTENT',content)

        return content;
    }
}

async function deleteContent(content){
    let query = await db.collection('content').where('cod', '==', content.cod).get()
    let docID = query.docs[0].id

    db.collection("content").doc(docID).delete().then(function () {
       alert("Document successfully deleted!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error deleting document: ", error);
    });
}

async function getSections(){
    let sections = []
    let url = `${API}/database`

    let res  = await api_get(url)

    if(res.sections){
        sections = res.sections
    }

    return sections;
}


async function getMilestones(){
    let query = await db.collection('milestones').get()

    if(query.docs){
        let milestones = []
        for(var doc of query.docs){
            milestones.push(doc.data())
        }

        return milestones;
    }
    
    /*
    let milestones = []
    let url = `${API}/database/milestones`
    let res  = await api_get(url)
    
    console.log('RES', res)

    if(res && res.length){
        milestones = res
    }


    return milestones;
    */
}




/*
*
*   llamadas de update
*/ 
async function updateContent(content,hideMessage) {
    let cod = content.cod
    let dblesson = await db.collection('content').where('cod', '==', cod).get()
    let docID = dblesson.docs[0].id
        // PORQUE ESTO ???

    let c = JSON.parse(JSON.stringify(content))
    if(typeof c.path != 'string' &&  c.path != undefined){
        c.path = c.path.cod 
    }

    console.log('updating',docID,c)

    if(c.stagenumber !=  null) c.stagenumber = Number(c.stagenumber)

    if(c.position == null){ 
        
    }

    db.collection('content').doc(docID).update(c,).then(function () {
        if(!hideMessage) alert("Document successfully updated!");
    }).catch(function (error) {
        console.log('QUE PASA',error)
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });


    return true;
}

async function deleteContentPosition(content){

    console.log('DELETING CONTENT POSITION', content)

    let query = await db.collection('content').where('cod', '==', content.cod).get()
    let docID = query.docs[0].id

    db.collection('content').doc(docID).update({position: firebase.firestore.FieldValue.delete()}).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });
}

async function updateSection(section){

    let s  = JSON.parse(JSON.stringify(section))

    if(section.content){
        s.content  = section.content.map((c)=> typeof c == 'string' ? c : c.cod)
    }

    if(section.createdBy && typeof section.createdBy != 'string'){
        s.createdBy = section.createdBy.cod
    }

    // find section then update it
    let query = await db.collection('sections').where('cod','==',s.cod).get()

    if(query.docs && query.docs.length){
        let docID = query.docs[0].id

        db.collection('sections').doc(docID).update(s).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }
}

async function updateStage(s){
    // find section then update it
    let query = await db.collection('stages').where('stagenumber','==', s.stagenumber).get()

    if(query.docs && query.docs.length){
        let docID = query.docs[0].id

        db.collection('stages').doc(docID).update(s).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }
}

async function updateMilestone(milestone) {
    let query = await db.collection('milestones').where('name', '==', milestone.name).get()
    let docID = query.docs[0].id

    db.collection('milestones').doc(docID).update(milestone).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });


    return true;
}


async function getSettings(){

    let query = await db.collection('settings').get()

    if(query.docs){
        let settings = query.docs[0].data()
        
        console.log('settings', settings)

        return settings;
    }

}

