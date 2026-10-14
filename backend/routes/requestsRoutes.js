import express from 'express';
import { getRequests, getRequest, updateRequest, newComment, addNotification, updateNotification,  addRequest, getFeed} from '../controllers/requestsController.js';
import { isVerified } from '../app.js';

const router = express.Router({ mergeParams: true });

// Get all requests
router.get("/", isVerified, async (req, res) => {
    try {
        const requests = await getRequests();
        return res.status(200).json(requests);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});


// Get all requests
router.get("/user/:userId", isVerified, async (req, res) => {
    try {
        const requests = await getRequests(req.params.userId);
        return res.status(200).json(requests);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

router.get('/feed', isVerified, async (req, res) => {
    try {
        const feed = await getFeed()
        return res.status(200).json(feed);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Get request by requestId
router.get("/:requestId", isVerified,  async (req, res) => {
    try {
        const request = await getRequest(req.params.requestId);
        return res.status(200).json(request);
    } catch (err) {
        console.log('err',err)
        return res.status(404).json({ message: err.message });
    }
});





// ADDREQUEST
router.post("/new", isVerified, async (req, res) => {
    try {
        const request = await addRequest(JSON.parse(req.body));
        return res.status(200).json(request);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});

// Update request by requestId
router.patch("/:requestId", isVerified, async (req, res) => {
    try {
        const request =  await updateRequest(JSON.parse(req.body));
        return res.status(200).json(request);
    } catch (err) {
        console.log('err',err)
        return res.status(404).json({ message: err.message });
    }
});

// Create comment
router.post("/:requestId/comment", isVerified, async (req, res) => {
    try {
        const request = await newComment(req.params.requestId, JSON.parse(req.body));
        return res.status(200).json(request);
    } catch (err) {
        return res.status(404).json({ message: err.message });
    }
});


router.post('/notification', isVerified, async (req, res) => {
  try {
    const request = await addNotification(JSON.parse(req.body));
    return res.status(200).json(request);
  } catch (err) {
    return res.status(404).json({ message: err.message });
  } 
})


router.patch('/notification/:notificationId', isVerified, async (req, res) => {

    try {
        const request =  await updateNotification(req.params.notificationId, req.body);
        return res.status(200).json(request);
    }catch (err) {
        return res.status(404).json({ message: err.message });
    }
})

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