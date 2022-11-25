import express from 'express';
import { getUser, createUser, updateUser, deleteUser } from '../controller/users';

const router = express.Router();



router.get("/connect/:userId",logic.connect);
router.get('/user/:userId',logic.user)
app.get('/live/:userId', logic.updatefeed)
app.get('/users/:userId',logic.getUsers);

app.get("/addfriend/:userId/:friendId",logic.addFriend);
app.get("/removefriend/:userId/:friendId",logic.removeFriend);
app.get("/disconnect",logic.disconnect);
app.get("/expanduser/:userId", logic.expandUser);
app.post("/follow/:followedId", logic.follow);

app.post("/action/:userId", logic.action);


// --------- PP ----------------------------
router.get('/users/connect/:userId',logic.connect);
router.get('/users/:userId',logic.user)
router.get('/users/live/:userId', logic.updatefeed)
router.get('/users/:userId',logic.getUsers);

router.get("/users/expanduser/:userId", logic.expandUser);

// router.get('/', getUser);
// router.post('/', createUser);
// router.patch('/:id', updateUser);
// router.delete('/:id', deleteUser);

// cool

export default router;