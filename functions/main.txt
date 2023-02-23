
/*
suscription / polling



Friends
=======
f =[
    ernest=>[marc,carla]
]

Users
=====
userid
ernest,marc,carla, ....

Subscriptions
=============
s=[
    ernest=>[marc,carla], // !!! cuando ernest haga algo, comunicarlo a marc y carla
    hector=>[juanjo],
    pablo=>[solange]
]

1. Cuando un usuario se conecta se crea su lista de suscripciones, que se crea a partir de su lista de amigos

Mailboxes
=========

Donde se guardan los mensajes que se recogen con /live

suscripciones y mailboxes son mapas que utilizan como índice el userid

Connections
==========

1. Cuando alguien se conecta, vamos a actualizar la lista de suscripciones
2. Si está, se actualiza la lista de live de 

live['carla']. poner a la cabeza del array <= {user:'ernest','action':'conection',date:date}
live['marc']. poner a la cabeza del array <= {user:'ernest','action':'conection',date:date}

Actions
=======
Igual, cuando alguien hace algo revisamos la lista de suscriptores y les actualizamos la tabla live



/subscribe (suscribeme a todo lo que hagan mis amigos)
GET /live // dame todas las novedades
POST /message // enviar un mensaje a todos los que están suscritos a mis

Cuando me desconecto se elimideviceidnan las suscripciones para mejorar el rendimiento


*/
/*
//PASAR ESTO A UNA VARIABLE DE ENTORNO
const express = require("express");
// hay que renombrar esto
var logic = require('./logic.js')
var {getRequests,getRequest,updateRequest} = require('./requests.js')

 
var cors = require('cors')
const http = require('http')
var https = require("https");
//const http2 = require("spdy");
const fs = require('fs'); // para guardar páginas generadas

//const { strictEqual } = require("assert");
const app = express();


//de momento esto no se para que
app.use(cors());
app.options('/', cors()) // enable pre-flight request for DELETE request

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

//app.get("/messages/:userId",updatefeed);
app.get("/connect/:userId",logic.connect);
app.get('/user/:userId',logic.user)
app.get('/live/:userId', logic.updatefeed )
app.get("/request/:codrequest",getRequest);
app.get('/stage/:stagenumber',logic.getStageCall)
app.get("/stages", logic.getAllStages);
app.get("/addfriend/:userId/:friendId",logic.addFriend);
app.get("/removefriend/:userId/:friendId",logic.removeFriend);
app.get("/disconnect",logic.disconnect);
app.get("/requests", getRequests);
app.get("/updaterequest/:cod", updateRequest);
app.get('/users/:userId',logic.getUsers);
app.get('/teachers',logic.getTeachers);
app.get("/expanduser/:userId", logic.expandUser);
app.post('/sendmessage',logic.sendMessage);
app.post("/action/:userId", logic.action);
app.post("/follow/:followedId", logic.follow);





const port = process.env.PORT || 8002;

if (!process.argv[2]) {
    var hskey = fs.readFileSync("/home/apps/ssl/star.digitalvalue.es.key");
    var hscert = fs.readFileSync("/home/apps/ssl/star.digitalvalue.es.crt");

    var options = {
    key: hskey,
    cert: hscert
    };

    https.createServer(options, app)
    .listen(port, error => {
        if (error) {
            console.error(error);
            return process.exit(1);
        }
        console.log("Server listening on port " + port);
    });
}
else
{
    http.createServer(app).listen(port, error => {
        if (error) {
            console.error(error);
            return process.exit(1);
        }
        console.log("Server listening on port " + port);
    });    
}*/


/*
http2.createServer({
    key: fs.readFileSync("./server.pem"),
    cert: fs.readFileSync("./server-cert.pem")
  }, app).listen(port, error => {
    if (error) {
        console.error(error);
        return process.exit(1);
    }
    console.log("Server listening on port " + port);
});
*/
// Servidor para resolver los dominios
// Cambiar a 80 en el servidor de producción
// En el puerto 80 se atienden dominios propios

