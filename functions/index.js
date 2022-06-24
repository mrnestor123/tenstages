const functions = require("firebase-functions");

//PASAR ESTO A UNA VARIABLE DE ENTORNO
const express = require("express");

// hay que renombrar esto
var logic = require('./logic.js')
var {getRequests,getRequest,updateRequest, comment} = require('./requests.js')
var {getUserMessages, getChat, sendMessage, getUserMessagesNew, getChatNew, sendMessageNew} = require('./chats.js')

 
var cors = require('cors')
//const http2 = require("spdy");
//const { strictEqual } = require("assert");
const app = express();


//de momento esto no se para que
app.use(cors());
app.options('/', cors()) // enable pre-flight request for DELETE request

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.get("/connect/:userId",logic.connect);
app.get('/user/:userId',logic.user)
app.get('/live/:userId', logic.updatefeed)
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
app.get("/messages/:userId", getUserMessages);
app.get("/messages/:userId/new", getUserMessagesNew);
app.get("/messages/:sender/:receiver", getChat);
app.get("/messages/:sender/:receiver/new", getChatNew);
app.post('/sendmessage',sendMessage);
app.post('/sendmessage/new',sendMessageNew);
app.post('/updatephoto/:userId',logic.updatePhoto);

app.post("/action/:userId", logic.action);
app.post("/comment", comment);
app.post("/follow/:followedId", logic.follow);



const port = process.env.PORT || 8002;

exports.app = functions.https.onRequest(app);


