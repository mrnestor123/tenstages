import express from 'express';
import { getUsers, getUser, createUser, updateUser, deleteUser } from '../controllers/usersController';

const router = express.Router();

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

// Get user by coduser
// This router can have query params ?connect=true or ?expand=true
router.get('/:userId', async (req, res) => {
    try {
        
        const expand = !!req.query.expand;
        const connect = !!req.query.connect;

        // https://localhost:5001/users/id?quick=true&extraData=true;

        const user = await getUser(req.params.userId, expand, connect);
        res.status(200).json(user);
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
