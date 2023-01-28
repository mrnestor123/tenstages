const express = require('express');
const app = express();



// RUTAS GENÉRICAS DE LA APP

//  AÑADIR LAS RUTAS


app.get("/stages", logic.getAllStages);
app.get('/teachers',logic.getTeachers);
app.get('/paths',logic.getPaths);
