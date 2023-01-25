import functions from 'firebase-functions';
import express from 'express';
import cors from 'cors';

const app = express();

//de momento esto no se para que
app.use(cors());
app.options('/', cors()) // enable pre-flight request for DELETE request

app.use(express.urlencoded({extended: true})); 
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

const port = process.env.PORT || 8002;

export default functions.https.onRequest(app);
