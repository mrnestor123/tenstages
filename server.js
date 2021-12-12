import { api_get } from "./util.js";

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

const API = `http://localhost:8802`

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
        let storageRef = storage.ref();
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

async function updateContent(content) {
    let cod = content.cod
    console.log(cod)
    let dblesson = await db.collection('content').where('cod', '==', cod).get()
    let docID = dblesson.docs[0].id

    db.collection('content').doc(docID).update(content).then(function () {
        console.log("Document successfully updated!");
    }).catch(function (error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    return true;
}

//esto podría ser una barra de carga?
async function uploadFile(file, stage) {
    var store = storage.ref('stage ' + stage + '/' + file.name);

    //upload file
    var upload = await store.put(file);
    let url = await upload.ref.getDownloadURL();


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
                return error.message
                // ...
            });
    } else {
        return auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            return user;
            console.log(user)
        })
        .catch((error) => {
            return error.message
        });
    }
}


///DEVUELVE EL USUARIO DE LA APP
async function getUser(cod){

  let user = api_get(`${API}/connect/${cod}`)

  return user;
}



async function updateStage(stage) {
    console.log(stage)
    let dbstage = await db.collection('stages').where('stagenumber', '==', stage.stagenumber).get()
    let docID = dbstage.docs[0].id

    db.collection('stages').doc(docID).update(stage).then(function () {
        console.log("Document successfully updated!");
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

async function getImages(stage) {
    var ref = storage.ref('stage ' + stage);

    var images = []
    let query = await ref.listAll()


    for (let image of query.items) {
        images.push(await displayImage(image));
    }

    return images

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

    console.log(content)

    return content;
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
        console.log("Document successfully updated!");
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


async function addVersion(version){
    var query = await db.collection('versions').add(version);
    return true
}


export { getLessons, addLesson, addContent, addVersion, postRequest, getRequests,updateRequest, getUsers,updateUser, getLesson, getContentbycod, updateContent, getUser, uploadFile, getImages, getStage, updateStage, deleteImage,deleteContent, getContent, getStages, addStage, login, deleteUser }