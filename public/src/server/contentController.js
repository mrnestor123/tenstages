import { api_get } from "../components/util.js"
import { API, db } from "./server.js"

// AÑADIR MODELO DE CONTENT AQUI ??

// Todo el tema de sacar los libros y las semanas
// esto se debería de sacar del server !!!
async function getWeeks(){

    let query = await db.collection('weeks').get()
    let weeks = []

    if(query && query.docs.length){
        let allContent = []

        // get all content 

        let content = await db.collection('content').get()

        content.docs.forEach((item)=>{
            allContent.push(item.data())
        })


        query.docs.forEach(async (item)=>{
            let week = item.data();
            week.content = allContent.filter((c)=> c.week == week.cod);
            weeks.push(week)
        })
    }

    return weeks;
}


// Crear un método común add en el que le pasamos las colecciones
async function addWeek(week){

    let query = await db.collection('weeks').add(week).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });
   
}


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

    db.collection("meditations").doc(docID).delete().then(function () {
        console.log("Document successfully deleted!");
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

    db.collection('content').doc(docID).update(c).then(function () {
        if(!hideMessage) alert("Document successfully updated!");
    }).catch(function (error) {
        console.log('QUE PASA',error)
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });


    return true;
}

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




export {
    addWeek,
    addSection,
    addContent,
    deleteContent,
    getContent,
    getContentbycod,
    getTeachersContent,
    getAllContent,
    getSections,
    getWeeks,
    updateContent,
    updateStage,
    updateSection
}