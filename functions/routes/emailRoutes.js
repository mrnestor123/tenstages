import express from 'express';
import { sendEmail } from '../controllers/emailController.js';

const router = express.Router({ mergeParams: true });

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        sendEmail(data);
        res.status(200).json({ message: "Email sent" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
})

export default router;