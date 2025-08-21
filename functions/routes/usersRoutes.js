import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, getActions, addAction, updatePhoto,setUserName,getAuthUsers, registerUser, finishMeditation, doneContent, addMeditationReport, sendQuestion, uploadFile, loginUser } from '../controllers/usersController.js';
import { isVerified } from '../app.js';


const router = express.Router({ mergeParams: true });



// SE PODRÍA HACER LAS RUTAS MÁS CORTAS PARA VERLO DESDE  AQUI
// Get all users
router.get('/', isVerified, async (req, res) => {
    try {
        const role = req.query.role || null;
        const users = await getUsers(role);

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.get('/auth',isVerified,  async (req, res) => {
    try {
        const users = await getAuthUsers();
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// EN LA VERSIÓN ANTIGUA UTILIZAMOS EL ID DEL USUARIO PARA SACAR TODOS LOS USUARIOS :(
// CAMBIAR EN  NUEVA VENTANA
router.get('/:userId', isVerified, async (req, res) => {
    try {
        const role = req.query.role || null;
        const users = await getUsers(role);
       
        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});




// Get user by coduser
// This router can have query params ?connect=true or ?expand=true
router.get('/user/:userId', isVerified, async (req, res) => {
    try {
        const expand = !!req.query.expand;
        const connect = !!req.query.connect;
        
        const user = await getUser(req.params.userId, expand, connect);

        

        
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});



router.get('/actions/:userId', isVerified, async (req, res) => {
    try {
        let actions = await getActions(req.params.userId);
        res.status(200).json(actions);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.put('/setusername/:userId', isVerified, async (req, res) => {
    try {
        //console.log('setting username',req.body)
        await setUserName(req.params.userId, req.body);
        res.status(200).json(true);
    } catch (err) {
        console.log('error',err)
        res.status(404).json({ message: err.message });
    }
});


router.post('/action/:userId', isVerified, async (req, res) => {
    try {
        await addAction(JSON.parse(req.body), req.params.userId);
        res.status(200).json({ message: 'Action added' });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// PARA SABER QUIEN ESTÁ MEDITANDO AHORA ??
// TODO:!!
router.post('/meditate/start/:userId', isVerified, async (req,res) =>{
    try {
        // MÉTODO PARA saber quien está meditando ahora !!

    } catch(err) {

    }
})

router.post('/meditate/finish/:userId',isVerified, async (req,res)=>{
    try {
        await finishMeditation(req.params.userId, JSON.parse(req.body));
        res.status(200).json({ message: 'Meditation finished' });
    } catch(err) {
        res.status(404).json({ message: err.message });
    }
})


router.put('/meditate/report/:userId',isVerified,  async (req, res) => {
    try {
        const user = await addMeditationReport(req.params.userId, JSON.parse(req.body));
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

/*
router.post('/finishlesson/:userId', async (req,res)=>{
    try{
        await finishLesson(req.params.userId, req.body);
        res.status(200).json({ message: 'Lesson finished' });
    }catch(err){
        res.status(404).json({ message: err.message });
    }
})*/

/*
* cuando acabas una meditación y te  la dejas a medias o cuando terminas de leer una lección
*/
router.post('/donecontent/:userId', isVerified,  async (req,res)=>{
    try{
        await doneContent(req.params.userId, JSON.parse(req.body));
        res.status(200).json({ message: 'Time saved' });
    }catch(err){
        res.status(404).json({ message: err.message });
    }
})


router.post('/updatephoto/:userId', isVerified, async (req, res) => {
    try {
        // MÉTODO PARA  UPDATEAR LA FOTO  
        await updatePhoto(req.body, req.params.userId);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post('/question', isVerified, async (req, res) => {
    try {
        await sendQuestion(req.body);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


router.post('/upload/:filename',  async (req, res) => {
    try {
        
        let url  = await uploadFile(req.body, req.params.filename);
        res.status(200).json(url);
    
    }  catch (err){
        console.log('ERROR UPLOADING FILE', err)
        res.status(404).json({ message: 'Error uploading file'})
    }
})




// Update user by coduser
router.patch('/:userId', isVerified , async (req, res) => {
    try {
        const user = await updateUser(req.params.userId, JSON.parse(req.body));
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Delete user by coduser
router.delete('/:userId', isVerified, async (req, res) => {
    try {
        console.log('DELETING USER')
        const user = await deleteUser(req.params.userId);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


/*
* LOGIN CON REGISTER HAY QUE REVISARLO BIEN!!
*/
router.post('/login/:userId',  async (req, res) => {
    try {
        await registerUser(req.params.userId);
        
        //hacemos dos veces  la misma query !!
        let user  = await getUser(req.params.userId, true, true);
        
        res.status(200).json(user);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post('/register', isVerified, async (req, res) => {
    try {
        const userId = req.body.id
        
        const user = await registerUser(userId);
    
        res.status(200).json(user);
    }catch (err){
        console.log('ERRor registering',err.message);
        res.status(404).json({ message: err.message });
    }
});


export default router;
