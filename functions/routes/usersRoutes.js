import express from 'express';
import { getUsers, getUser, updateUser, deleteUser, getActions, addAction, updatePhoto } from '../controllers/usersController.js';


const router = express.Router({ mergeParams: true });

// Get all users
router.get('/', async (req, res) => {
    try {
        const role = req.query.role || null;
        const users = await getUsers(role);

        res.status(200).json(users);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


// EN LA VERSIÓN ANTIGUA UTILIZAMOS EL ID DEL USUARIO PARA SACAR TODOS LOS USUARIOS :(
    // CAMBIAR EN  NUEVA VENTANA
router.get('/:userId', async (req, res) => {
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
/*
router.get('/:userId', async (req, res) => {
    try {
        const expand = !!req.query.expand;
        const connect = !!req.query.connect;
        const user = await getUser(req.params.userId, expand, connect);
        
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});
*/
router.get('/actions/:userId', async (req, res) => {
    try {
        let actions = getActions(req.params.userId);
        res.status(200).json(actions);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post('/newaction/:userId', async (req, res) => {
    try {
        await addAction(req.body, req.params.userId);
        res.status(200).json({ message: 'Action added' });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

router.post('/updatephoto/:userId', async (req, res) => {
    try {
        // MÉTODO PARA  UPDATEAR LA FOTO  
        await updatePhoto(req.body, req.params.userId);

    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


// Update user by coduser
router.patch('/:userId', async (req, res) => {
    try {
        const user = await updateUser(req.params.userId, req.body);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Delete user by coduser
router.delete('/:userId', async (req, res) => {
    try {
        const user = await deleteUser(req.params.userId);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


export default router;
