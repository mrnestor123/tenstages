import express from 'express';
import { getRequests, getRequest, updateRequest, newComment, updateComment, deleteComment} from '../controllers/requestsController.js';

const router = express.Router();

// Get all requests
router.get("/", (req, res) => {
    try {
        const requests = getRequests();
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
router.post("/:requestId/comments", (req, res) => {
    try {
        const request = newComment(req.params.requestId, req.body);
        res.status(200).json(request);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

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
});