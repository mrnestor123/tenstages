import express from 'express';
import { getRequests, getRequest, updateRequest, newComment} from '../controllers/requestsController.js';

const router = express.Router({ mergeParams: true });

// Get all requests
router.get("/", async (req, res) => {
    try {
        const requests = await getRequests();
        console.log('got  requests', requests)
        res.status(200).json(requests);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get request by requestId
router.get("/:requestId", (req, res) => {
    try {
        const request = getRequest(req.params.requestId);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Update request by requestId
router.patch("/:requestId", (req, res) => {
    try {
        const request = updateRequest(req.params.requestId, req.body);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Create comment
// en el comentario va la request id, no creo que sea lo mejor
router.post("/comment", (req, res) => {
    try {
        const request = newComment(req.body);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

/*
// Update comment
router.patch("/:requestId/comments/:commentId", (req, res) => {
    try {
        const request = updateComment(req.params.requestId, req.body);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Delete comment
router.delete("/:requestId/comments/:commentId", (req, res) => {
    try {
        const request = deleteComment(req.params.requestId, req.body);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});*/


export default router;