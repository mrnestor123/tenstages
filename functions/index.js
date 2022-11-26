const functions = require("firebase-functions");

//PASAR ESTO A UNA VARIABLE DE ENTORNO
const express = require("express");

// hay que renombrar esto
var cors = require('cors');
const app = express();

//de momento esto no se para que
app.use(cors());
app.options('/', cors()) // enable pre-flight request for DELETE request

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

const port = process.env.PORT || 8002;

exports.app = functions.https.onRequest(app);
