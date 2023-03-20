import { user } from "../models/models.js";
import { api_get, omit } from "../util/util.js";

var firebaseConfig = {
    apiKey: "AIzaSyDWEW668iJRj-TIpRueiK2J3fhh-7aKd0M",
    authDomain: "the-mind-illuminated-32dee.firebaseapp.com",
    databaseURL: "https://the-mind-illuminated-32dee.firebaseio.com",
    projectId: "the-mind-illuminated-32dee",
    storageBucket: "the-mind-illuminated-32dee.appspot.com",
    messagingSenderId: "120106070238",
    appId: "1:120106070238:web:e075adfe489adf3a8c524f",
    measurementId: "G-JWRBVYPHRD"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();


const API =`https://us-central1-the-mind-illuminated-32dee.cloudfunctions.net/app`
// const API = `http://localhost:5001/the-mind-illuminated-32dee/us-central1/app`
//const API = 'http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default'

var db = firebase.firestore()
var storage = firebase.storage();
var auth = firebase.auth();

// Saca las lecciones de la stage seleccionada 
//Hay que cachear ERRORES  EN TODAS LAS FUNCIONES :/ !!!
// PROBAR DE QUITAR FUNCIONES
async function getLessons(stagenumber) {
    var query = await db.collection('content').where('stagenumber', '==', stagenumber).where('type', '==', 'lesson').get();
    var lessons = []

    for (let doc of query.docs) {
        let lesson = doc.data();
        lessons.push(lesson)
    }

    return lessons;
}

async function getLesson(codlesson) {
    var query = await db.collection('content').where('codlesson', '==', codlesson).get();
    console.log(query.docs.length)

    if (query.docs.length == 0) {
        console.log('entramos')
        console.log(codlesson)
        query = await db.collection('content').where('cod', '==', codlesson).get();
    }


    let lesson;
    //para sacar la imagen
    for (let doc of query.docs) {
        lesson = doc.data();
        var storageRef = storage.ref();

        //Se está pasando a array
        if (typeof lesson.text == 'object') {
            for (let key of Object.keys(lesson.text)) {
                if (lesson.text[key].image && lesson.text[key].image.length < 20) {
                    var pathReference = await storageRef.child('stage 1/' + lesson.text[key].image).getDownloadURL();
                    if (pathReference) {
                        lesson.text[key].image = pathReference
                    }
                }
            }
        } else if (lesson.text) {
            lesson.text.map((entry) => {
                lesson.text.push(entry);
            });
        }
    };
    console.log(lesson)
    return lesson;
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

async function updatePath(path){
    let query = await db.collection('paths').where('cod', '==', path.cod).get()
    let docID = query.docs[0].id
    path.content.map((c)=>{
        console.log(c)
        updateContent(c,true);
    })


    db.collection('paths').doc(docID).update(omit('content',path)).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        console.log('QUE PASA')
        // The document probably doesn't exist.
        alert("Error updating document: ", error);
    });


    return true;


}

//esto podría ser una barra de carga?
async function uploadFile(bucket,file, folder) {
    var store;

    store = storage.ref(`${folder}/${file.name}`)
    
    
    //upload file
    //PASAR ESTO A OTRO SITIO ???
    var upload = await store.put(file);
    let url = await upload.ref.getDownloadURL();

    console.log('got url', url)

    let query = await db.collection('files').where('bucket','==', bucket).get()

    if(query && query.docs.length == 0){
        await db.collection('files').add({bucket:bucket,files:[url]})
    }else{
        let docID = query.docs[0].id

        await db.collection('files').doc(docID).update({
            files: firebase.firestore.FieldValue.arrayUnion(url)
        })
    }

    return url;

    /*
    para saber el progreso
    return upload.on(
        "state_changed",
        function progress(snapshot) {
            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //document.getElementById("progress").value = percentage;
        },

        function error() {
            alert("error uploading file");
        },

       function complete(snapshot) {
            upload.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
                return downloadURL;
              });
            //document.getElementById( "uploading").innerHTML += `${files[i].name} upoaded <br />`;
        }
    );*/




}

// NO DEBERÍA DE PODERSE REGISTRARSE DESDE AQUÍ
async function register(email, password) {
    auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
        });
}

// DEVUELVE EL USUARIO DE FIREBASE
// esto se podría hacer en el server??
async function login({ type, email, password }) {
    if (type == 'google' || type == 'facebook') {
        var provider;

        if (type == 'google') {
            provider = new firebase.auth.GoogleAuthProvider();
        } else {
            provider = new firebase.auth.FacebookAuthProvider();
        }

        auth.useDeviceLanguage();

        return firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                /** @type {firebase.auth.OAuthCredential} */
                return result.user
                // ...
            }).catch((error) => {
                console.log("Error when logging with external app", error.message)
                return error.message
                // ...
            });
    } else {
        return auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            return user;
        })
        .catch((error) => {
            console.log("Error when logging with email", error.message)
            return error.message
        });
    }
}

///DEVUELVE EL USUARIO DE LA APP
async function getUser(cod){
    //OJOOO
  let user = await api_get(`${API}/connect/${cod}`)


  return user;
}

async function updateStage(stage) {
    console.log(stage)
    let dbstage = await db.collection('stages').where('stagenumber', '==', stage.stagenumber).get()
    let docID = dbstage.docs[0].id

    db.collection('stages').doc(docID).update(stage).then(function () {
        console.log("Document successfully updated!");
        alert('Content saved correctly')
    })

}

async function deleteImage(url, stage) {
    let name = url.substr(url.indexOf('%2F') + 3, (url.indexOf('?')) - (url.indexOf('%2F') + 3));
    name = name.replace('%20', ' ');
    console.log(name)
    let storagePath = storage.ref();
    storagePath.child(`stage ${stage}/${name}`).delete();
}

//reutilizar la función esta
async function displayImage(imageRef) {
    return await imageRef.getDownloadURL();
}

//saca todas las imágenes de la base de datos 
async function getAllImages() {
    var ref = storage.ref();
    var aux = await ref.listAll();
    var serverimages = []
    serverimages = serverimages.concat(aux.items)

    var images = []
    var stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]


    for (let stage of stages) {
        ref = storage.ref('stage ' + stage);
        aux = await ref.listAll()
        serverimages = serverimages.concat(aux.items)
    }

    for (let image of serverimages) {
        images.push(await displayImage(image));
    }

    return images
}

let cachedimages = {}

// LAS SACA TODAS
async function getFiles() {
    let query =  await db.collection('files').get()

    // images serán. bucket y array de urls 
    let files = {}

    for(let file of query.docs){
        let bucket = file.data().bucket
        let urls = file.data().files || file.data().images
        if(bucket.match(`stage|${localStorage.getItem('meditationcod')}`)){
            files[bucket] = urls
        }
    }

    return files;
}

async function populateImages(){
    let bucket = 'stage 10'
    var ref = storage.ref(bucket);
    var  images = []

    let query = await ref.listAll()

    for(let image of query.items){
        images.push(await displayImage(image));
    }

    // find a  document with bucketname == stage 1 and add the images to it
    let stage = await db.collection('files').where('bucket','==',bucket).get()
    let docID;

    console.log('adding to files', images)

    if(stage.docs && stage.docs.length){
        docID = stage.docs[0].id
    }else{
        docID = await db.collection('files').add({bucket:bucket}).id
    }
    
    db.collection('files').doc(docID).update({images:images})

}

async function addLesson(lesson) {
    lesson.stagenumber = Number(lesson.stagenumber)
    var query = await db.collection('content').add(lesson);
    console.log('lesson added')
    return true
}

async function addStage(stage) {
    var query = await db.collection('stages').add(stage);
    console.log('stage added')
    return true
}


async function addContent(content) {
    var query = await db.collection('content').add(content);
    return true
}

async function addPath(content) {
    var query = await db.collection('paths').add(content);
    return true
}

async function getStage(stagenumber) {
    var stage = '';
    var query = await db.collection('stages').where('stagenumber', '==', Number(stagenumber)).get();


    for (let doc of query.docs) {
        stage = doc.data();
    }

    return stage
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


//returns all the content
async function getContent(stagenumber) {
    var query = await db.collection('content').where('stagenumber', '==', stagenumber).get();
    let content = [];
    //para sacar la imagen
    for (let doc of query.docs) {
        content.push(doc.data());
    };

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

async function getStats(content){
    var query = await db.collection('doneContent').where('cod','==',content.cod).get();

    let stats = {timeDone:0, people:0}
    
    //para sacar la imagen
    for (let doc of query.docs) {
        let c = doc.data();
        
        if(c.done){
            stats.timeDone += c.done
        }

        stats.people += 1 
    };

    return stats;

}


async function getStages() {
    var query = await db.collection('stages').get();
    let stages = [];
    //para sacar la imagen
    for (let doc of query.docs) {
        stages.push(doc.data());
    };

    return stages;
}

async function getUsers() {
    var query = await db.collection('users').get()
    let users = []

    for (let doc of query.docs) {
        users.push(doc.data())
    }

    return users;

}


async function deleteUser(cod) {
    let user = await db.collection('users').where('coduser', '==', cod).get();
    console.log(user)
    await db.collection("users").doc(user.docs[0].id).delete()


    let usermeditations = await db.collection('meditations').where('coduser', '==', cod).get();

    for (var meditation of usermeditations.docs) {
        await db.collection("meditations").doc(meditation.id).delete()
    }

    let useractions = await db.collection('actions').where('coduser', '==', cod).get();

    for (var action of useractions.docs) {
        await db.collection("actions").doc(action.id).delete()
    }

    let users = await db.collection('users').where('following', 'array-contains', cod).get();

    for (let doc of users.docs) {
        doc.update({ following: firebase.firestore.FieldValue.arrayRemove(cod) });
    }
}


async function postRequest(request){
    await db.collection('requests').add(request);
}

async function getRequests(){
    // TODO: Sacar las requests que no estén cerradas 
    var query = await db.collection('requests').get();
    var requests = []

    for (let doc of query.docs) {
        let request = doc.data();
        requests.push(request)
    }

    return requests;
}

async function updateRequest(request){
    console.log(request)
    let query = await db.collection('requests').where('cod', '==', request.cod).get()
    let docID = query.docs[0].id

    db.collection('requests').doc(docID).update(request).then(function () {
        console.log("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
}

async function updateUser(user){
    let query = await db.collection('users').where('coduser', '==', user.coduser).get()
    let docID = query.docs[0].id

    db.collection('users').doc(docID).update(user).then(function () {
        alert("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });
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

async function getVersions(){
    let query = await db.collection('versions').get();

    let versions = []

    for (let doc of query.docs) {
        versions.push(doc.data())
    }

    return versions;
}


async function addVersion(version){
    var query = await db.collection('versions').add(version);
    return true
}


async function addSumUp(sumup){
    var query = await db.collection('sumups').where('sumup','==',sumup.stagenumber).get();

    if(query.docs && query.docs.length){
        await db.collection('sumups').update(sumup);
    }else {
        await db.collection('sumups').add(sumup);
    }
}


async function getSumups(){
    let query = await db.collection('sumups').get();

    let sumups = []

    for (let doc of query.docs) {
        sumups.push(doc.data())
    }

    return sumups;

}


async function getPaths(){

    let paths = await api_get(`${API}/paths`)

    return paths;

}

async function getUserMessages(coduser){
    try{
        let messages = await api_get(`${API}/messages/${coduser}/new`)
        return messages;
    }catch(e){
        return {};
    }
}

async function getCourses(coduser){
    let courses = await db('collection')


}

async function getUserActions(coduser){
    
    let query = await db.collection('actions').where('coduser','==',coduser).get()
    let actions = []

    for (let doc of query.docs) {
        actions.push(doc.data())
    }

    return actions;

}   


async function getChat(sender,receiver){
    
    let chat = await api_get(`${API}/${sender}/${receiver}/new`)

    console.log(chat)

    return chat;
}


// DE MOMENTO SACAMOS EL CURSO AQUÍ Y LO AÑADIREMOS AL SERVER !!
async function getCourse(cod){
    let query = await db.collection('paths').where('cod','==',cod).get()

    let course = {}
    if(query.docs){

        course = query.docs[0].data()

        let announcementquery = await db.collection('paths').doc(query.docs[0].id).collection('announcements').get()

        if(announcementquery.docs){
            course.announcements = []
            for(var doc  of announcementquery.docs){
                course.announcements.push(doc.data())
            }
        }

        // CADA COURSE DEBERÍA TENER SU CONTENIDO DENTRO ????
        let contentquery = await db.collection('content').where('path','==',cod).get()
        if(contentquery.docs){
            course.content = []
            for(var doc  of contentquery.docs){
                course.content = doc.data()
            }
        }

        // TODO: SACAR ESTUDIANTES
        course.students = []

        return course;
    }
}


// HABRÁ QUE CAMBIAR  EL CURSO DE PATHS
async function addAnnouncement(cod,announcement){
    console.log('adding announcement',cod,announcement)
    
    let query = await db.collection('paths').where('cod','==',cod).get()
    if(query.docs){
        let docID = query.docs[0].id

        db.collection('paths').doc(docID).collection('announcements').add(announcement).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }
}


async function updateCourse(course){
    console.log('updating course',course)

    let query = await db.collection('paths').where('cod','==',course.cod).get()

    if(query.docs){
        let docID = query.docs[0].id

        db.collection('paths').doc(docID).update(course).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }

}

function sendMail(mail,type){

    let url = `${API}/mail?type=${type}`

    return api_get(url,'POST', mail)
}


async  function getTechniques(){
    let query = await db.collection('techniques').get();

    let techniques = []

    if(query.docs){
        for (let doc of query.docs) {
            techniques.push(doc.data())
        }
    }
    return techniques;
}

async function  addTechnique(technique){

    let query = await db.collection('techniques').add(technique);

    return true

}



async function updateTechnique(technique){

    let query = await db.collection('techniques').where('cod','==',technique.cod).get()

    if(query.docs){
        let docID = query.docs[0].id

        db.collection('techniques').doc(docID).update(technique).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }

}


async function deleteTechnique(technique){
    let query = await db.collection('techniques').where('cod','==',technique.cod).get()

    if(query.docs){
        let docID = query.docs[0].id
        
        db.collection('techniques').doc(docID).delete().then(function () {
            alert("Document successfully deleted!");
        }).catch(function (error) {
            alert("Error deleting document: ", error);
        })

    }
}
//  TODO: HACER MÉTODO SAVECOURSE


async function getTeachersContent(coduser){
    let query = await db.collection('content').where('createdBy','==', coduser).get()

    if(query.docs){
        let content = []
        for(var doc of query.docs){
            content.push(doc.data())
        }

        return content;
    }
}

async function getSettings(){
    let  query = await  db.collection('settings').get()
    let settings = {}

    if(query.docs && query.docs.length){
        settings = query.docs[0].data()
    }

    return settings;
}

async function updateSettings(settings){


    // update current settings
    let query = await db.collection('settings').get()

    if(query.docs && query.docs.length){
        // update first doc in query  
        let docID = query.docs[0].id

        db.collection('settings').doc(docID).update(settings).then(function () {
            alert("Document successfully updated!");
        })
    }
}


async function getSections(){
    let query = await db.collection('sections').get()
    
    let sections = []

    if(query.docs && query.docs.length){
        for(var doc of query.docs){
            sections.push(doc.data())
        }
    }

    return sections;
}


async function addSection(section){


    let query = await db.collection('sections').add(section)

    alert('Added section !!')

    return true

}


async function updateSection(section){


    // find section then update it
    let query = await db.collection('sections').where('cod','==',section.cod).get()
    


    if(query.docs && query.docs.length){
        let docID = query.docs[0].id

        console.log('DOC',docID, 'SECTION',section)

        db.collection('sections').doc(docID).update(section).then(function () {
            alert("Document successfully updated!");
        }).catch(function (error) {
            // The document probably doesn't exist.
            alert("Error updating document: ", error);
        });
    }

}

export { 
    getLessons, 
    getSections,
    getUserActions,
    deleteTechnique,
    getTeachersContent, 
    addAnnouncement,
    addTechnique,
    updateSection,
    updateTechnique, 
    sendMail,
    updateCourse, 
    getTechniques, 
    getVersions, 
    getCourse,
    updatePath,
    getSumups,
    getUserMessages,
    getPaths, 
    addSumUp,
    getStats, 
    addPath, 
    addLesson,
    getAllContent, 
    addContent, 
    addVersion, 
    postRequest, 
    getRequests,
    updateRequest, 
    getUsers,
    updateUser, 
    getLesson, 
    getContentbycod, 
    updateContent, 
    getUser, 
    uploadFile, 
    getFiles,
    getStage, 
    updateStage, 
    deleteImage,
    deleteContent, 
    getContent, 
    getStages, 
    addStage, 
    login, 
    deleteUser,
    getSettings,
    updateSettings,
    addSection
}