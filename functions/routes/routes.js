
var {getRequests,getRequest,updateRequest, comment} = require('../requests.js')
var {getUserMessages, getChat, sendMessage, getUserMessagesNew, getChatNew, sendMessageNew} = require('../chats.js')
var logic = require('../logic.js')
var  app =  require('../index.js')


/**
 * [-] ==> Ya no existe
 * [F] ==> Falta por implementar
 * [T] ==> Implementado pero falta por testeat
 * [+] ==> Implementado y testeado
 */
// No funcionando
[-] app.get('/live/:userId', logic.updatefeed)

[T] app.get('/stage/:stagenumber',logic.getStageCall) // ?? Esto es un getStage? LA PUTA MADRE
[T] app.get("/stages", logic.getAllStages); // Curso propio de tenstages

// NO FUNCIONANDO
[-] app.get("/addfriend/:userId/:friendId",logic.addFriend); // users?
// NO funcionando
[-] app.get("/removefriend/:userId/:friendId",logic.removeFriend); // users?

[T] app.get("/requests", getRequests);  //que es esto? -- DONE
[T] app.get("/request/:codrequest", getRequest); //que es esto? -- DONE
[T] app.get("/updaterequest/:cod", updateRequest); //que es esto? -- DONE --
[F] app.post("/comment", comment); // por qué está en requests? -- DONE --

[-] app.get('/user/:userId', logic.user); // LA PUTA MADRE QUE ME PARIO -- DONE
[+] app.get('/users/:userId', logic.getUsers); // por qué tiene :userId? --- DONE ---
[+] app.get("/users/:userId?expand=true", logic.expandUser); // en users? Posiblemente en getUser() <--- sí  -- DONE --
[+] app.get("/connect/:userId",logic.connect); // en users? Que hace esto? -- DONE --
// QUITAR 
[-] app.get("/disconnect", logic.disconnect); // en users? -- QUITAR --
[+] app.get('/users?role=teacher', logic.getTeachers); // en users? /users?role=teacher -- PENDING OF TEST -- 
[F] app.post('/updatephoto/:userId', logic.updatePhoto); // en users? Tiene sentido para no descargar la foto cada vez --DONE--

[F] app.get('/paths', logic.getPaths); // Paths son cursos de usuarios
[F] app.get('/course/:cod', logic.getCourse); // Course son cursos de usuarios
[F] app.get("/expandcourse/:cod", logic.expandCourse);
[F] app.get('/newcontent', logic.getNewContent);

[-] app.get("/messages/:userId", getUserMessages); // version vieja de getUserMessagesNew -- DONE --
[F] app.get("/messages/:userId/new", getUserMessagesNew); //-- DONE
[F] app.get("/messages/:sender/:receiver/new", getChatNew); // -- DONE --
[F] app.post('/sendmessage/new',sendMessageNew); // -- DONE --


[F] app.post("/action/:userId", logic.action); // Acciones que ha realizado el usuario -- DONE --  

// NO FUNCIONANDO
[-] app.post("/follow/:followedId", logic.follow);