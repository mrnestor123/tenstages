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

var db = firebase.firestore()
var storage = firebase.storage();
var auth = firebase.auth();

// Saca las lecciones de la stage seleccionada 
//Hay que cachear ERRORES  EN TODAS LAS FUNCIONES :/ !!!
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

async function login(email, password) {
    auth.signInWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in
            // ...
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        });
}


async function loginWithFacebook() {
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
            console.log(result)
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;

            // The signed-in user info.
            var user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            var accessToken = credential.accessToken;

            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;

            // ...
        });
}

async function loginWithGoogle() {

    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().useDeviceLanguage();

    firebase.auth()
        .signInWithPopup(provider)
        .then((result) => {
            /** @type {firebase.auth.OAuthCredential} */
            var credential = result.credential;
            console.log('signed in')
            // This gives you a Google Access Token. You can use it to access the Google API.
            var token = credential.accessToken;
            // The signed-in user info.
            var user = result.user;
            // ...
        }).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // The email of the user's account used.
            var email = error.email;
            // The firebase.auth.AuthCredential type that was used.
            var credential = error.credential;
            // ...
        });



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




export { getLessons, addLesson, addContent, getLesson, getContentbycod, updateContent, uploadFile, getImages, getStage, updateStage, deleteImage, getContent, getStages, addStage, loginWithFacebook, loginWithGoogle }