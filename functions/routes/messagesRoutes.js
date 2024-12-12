import express from 'express';
import { getChat, getUserChats, sendMessage } from '../controllers/messagesController.js';
import { isVerified } from '../app.js';

const router = express.Router();

// Get user messages
// HAY QUE QUITAR EL NEW EN  EL FUTURO !!!!
router.get('/:userId/new', isVerified, async (req, res) => {
    try {
        const userId = req.params.userId;
        let messages = await getUserChats(userId);
        //console.log('chats',messages)
        
        res.status(200).json(messages);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get chat

router.get('/:sender/:receiver/new', isVerified, async (req, res) => {
    try {
        const sender = req.params.sender;
        const receiver = req.params.receiver;

        let chat  = await getChat(sender, receiver);
               
        res.status(200).json(chat);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }

});

router.post('/sendmessage', isVerified, async (req, res) => {
    try {
        const message = req.body;
        
        sendMessage(message);

        return res.status(200).json({message: "Message sent"});
        
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});
// Delete chat

// Send message
//router.post('/:userId', async (req, res) => {});

export default router;