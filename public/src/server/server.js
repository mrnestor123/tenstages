import { api_get } from "../components/util.js";


export { 
    sendMail,
    getVersions,
    getStats,
    addVersion, 
    postRequest, 
    getRequests,
    updateRequest, 
    uploadFile, 
    getFiles,
    deleteImage,
    getStages,
    getSettings,
    updateSettings,
    API,
    db,
    auth
}


// hay que quitar esto y pasar todas las llamadas al servidor de api!!
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

const API = `https://us-central1-the-mind-illuminated-32dee.cloudfunctions.net/default`
//const API = `http://localhost:5001/the-mind-illuminated-32dee/us-central1/default`
//const API = 'http://127.0.0.1:5001/the-mind-illuminated-32dee/us-central1/default'

var db = firebase.firestore()
var storage = firebase.storage();
var auth = firebase.auth();


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
async function getFiles(coduser) {
    let query =  await db.collection('files').get()

    // images serán. bucket y array de urls 
    let files = {}

    for(let file of query.docs){
        let bucket = file.data().bucket
        let urls = file.data().files || file.data().images
        if(bucket.match(`stage|${coduser}`)){
            files[bucket] = urls
        }
    }

    return files;
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

function sendMail(mail,type){

    let url = `${API}/mail?type=${type}`

    return api_get(url,'POST', mail)
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


