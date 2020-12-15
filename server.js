

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


// Saca las lecciones de la stage seleccionada 
//Hay que cachear ERRORES  EN TODAS LAS FUNCIONES :/ !!!
async function getLessons(stagenumber) {
    var query = await db.collection('lessons').where('stagenumber', '==', stagenumber).get();
    var lessons = []
    console.log(query.docs)


    for (let doc of query.docs) {
        let lesson = doc.data();
        let storageRef = storage.ref();
        if (lesson.slider && lesson.slider.length < 20) {
            let pathReference = await storageRef.child(`stage ${stagenumber}/${lesson.slider}`).getDownloadURL();
            if (pathReference) {
                lesson.slider = pathReference
            }
        }
        lessons.push(lesson)
    }

    console.log(lessons)
    return lessons;
}


async function getLesson(codlesson) {
    var query = await db.collection('lessons').where('codlesson', '==', codlesson).get();
    let lesson;
    //para sacar la imagen
    for (let doc of query.docs) {
        console.log(doc.data())
        lesson = doc.data();
        var storageRef = storage.ref();
        if (lesson.slider && lesson.slider.length < 20) {
            var pathReference = await storageRef.child('stage 1/' + lesson.slider).getDownloadURL();
            if (pathReference) {
                lesson.slider = pathReference
            }
        }

        console.log(typeof lesson.text)
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
        } else {
            lesson.text.map((entry) => {

            });
        }
    };
    console.log(lesson)
    return lesson;
}


async function updateLesson(lesson) {
    let dblesson = await db.collection('lessons').where('codlesson', '==', lesson.codlesson).get()
    let docID = dblesson.docs[0].id

    console.log(lesson)

    db.collection('lessons').doc(docID).update(lesson).then(function () {
        console.log("Document successfully updated!");
    })
        .catch(function (error) {
            // The document probably doesn't exist.
            console.error("Error updating document: ", error);
        });

    return true;
}


//esto podría ser una barra de carga?
async function uploadFile(file, stage) {
    var store = storage.ref(file.name);

    //upload file
    var upload = await store.put(file);
    let url = await upload.ref.getDownloadURL();

    console.log(url)

    return url;

    /*return upload.on(
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


//reutilizar la función esta
async function displayImage(imageRef) {
    return await imageRef.getDownloadURL();
}

//saca todas las imágenes de la base de datos 
async function getImages() {

    var ref = storage.ref();
    var aux= await ref.listAll();
    var serverimages = []
    serverimages = serverimages.concat(aux.items)

    var images = []
    var stages = [1,2,3,4,5,6,7,8,9,10]


    for(let stage of stages){
        ref = storage.ref('stage '+ stage);
        aux = await ref.listAll()
        serverimages = serverimages.concat(aux.items)
    }
     
    for(let image of serverimages){
        images.push(await displayImage(image));
    }

    return images
}


function getMeditations() {


}


function addLesson() {


}

function addMeditation() {

}


export { getLessons, getMeditations, addLesson, addMeditation, getLesson, updateLesson, uploadFile, getImages}