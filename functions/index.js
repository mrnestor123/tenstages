import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';
import users from './routes/usersRoutes.js';
import messages from './routes/messagesRoutes.js';
import requests from './routes/requestsRoutes.js';
import stages from './routes/stagesRoutes.js';
import { addAction, getActions, getUser, getUsers, updatePhoto } from './controllers/usersController.js';
import { getCourses } from './controllers/dbController.js';
import { getRequest, newComment, updateRequest } from './controllers/requestsController.js';
import { sendMessage } from './controllers/messagesController.js';
import { normalize_server } from './normalize_server.js';

//PASAR ESTO A UNA VARIABLE DE ENTORNO

const app = express();

//de momento esto no se para que
app.use(cors());
app.options('/', cors()) // enable pre-flight request for DELETE request

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.use('/users', users);
app.use('/stages', stages)
app.use('/messages', messages);
app.use('/requests',requests);


/*
*
* LLAMADAS ANTIGUAS
*/
app.get('/paths',async (req,res)=>{
    try{
        console.log('getting paths')
        let courses = await getCourses();

        return  res.status(200).json(courses);

    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})


app.post('/action/:userId', async  (req, res) => {
    try{
        await addAction(req.body,req.params.userId)
        return res.status(200).json({message: 'action added'});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})


app.get('/live/:userId',async (req, res) => {
    try{
        //console.log('getting actions')

        let actions = await getActions(req.params.userId);

        //console.log('got actions', actions)
        return res.status(200).json(actions);
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})

app.get("/connect/:userId",async (req, res) => {
    try{
        const user = await getUser(req.params.userId, false, true);
        return res.status(200).json(user);
    }catch(err){
        return res.status(404).json({ message: err.message });
    }
});

app.get("/expanduser/:userId",async (req, res) => {
    try{
        const user = await getUser(req.params.userId, true, false);
        console.log('EXPANDINGUSER',user)
        return res.status(200).json(user);
    }catch(err){
        return res.status(404).json({ message: err.message });
    }
});

app.get("/updatephoto/:userId",async (req, res) => {
    try{
        await updatePhoto(req.body, req.params.userId);
        return res.status(200).json({message: 'photo updated'});
    }catch(err){
        return res.status(404).json({ message: err.message });
    }
});

app.get('/teachers', async (req, res) => {
    try{    
        let teachers = await getUsers('teacher');
        return res.status(200).json(teachers);
        
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
});

app.get('/user/:userId', async (req, res) => {
    try{
        console.log('getting user expanded', req.params.userId)
        const user = await getUser(req.params.userId, true, false);
        return res.status(200).json(user);
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
});


app.get('/normalize', async (req, res) => {
    try{
        normalize_server()
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
});


app.get('/request/:cod', async(req,res)=>{
    try{
        let request = await getRequest(req.params.cod);
        return res.status(200).json(request);
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})

app.post('/sendmessage/new', async(req,res)=>{
    try{
        await sendMessage(req.body);
        return res.status(200).json({message: 'message sent'});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})

app.post('/comment', async(req,res)=>{
    try{
        await newComment(req.body)
        return res.status(200).json({message: 'comment sent'});
    }catch(err){
        return  res.status(400).json({ message: err.message });
    }
})

app.patch('/updaterequest/:requestId', async(req,res)=>{
    try{
        await updateRequest(req.params.requestId, req.body);
        return res.status(200).json({message: 'request updated'});
    }catch(err){
        return res.status(400).json({ message: err.message });
    }
})

//const router = express.Router({ mergeParams: true });

/*
router.use('/users', users);
router.use('/messages', messages);
router.use('/requests',requests);
router.use('/request',requestRouter);
*/
/*
    router.use('/stages',stages)
*/

// LLAMADAS ANTIGUAS
/*
*/

// HAY  QUE CREAR UN PROXY PARA LAS  LLAMADAS ANTERIORES  !!

/*
[-] app.get('/live/:userId', logic.updatefeed)

[T] app.get('/stage/:stagenumber',logic.getStageCall) // ?? Esto es un getStage? LA PUTA MADRE
[T] app.get("/stages", logic.getAllStages); // Curso propio de tenstages


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

*/



const port = process.env.PORT || 8002;

export default functions.https.onRequest(app);
