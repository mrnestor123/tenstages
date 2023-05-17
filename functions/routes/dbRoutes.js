import express from 'express'
import {getDB} from '../controllers/dbController.js'
import { isVerified } from '../app.js';

const router = express.Router({ mergeParams: true });


router.get('/', async (req, res) => {
    try {
        console.log('GETTING DATABASE');
        let db = await getDB();

        return res.status(200).json(db);
    }catch(err){
        return res.status(400).json({ message: err });
    }
});

// EN  DATABASE  AÑADIMOS  LOS CURSOS  ???
// LLAMARLO CONTENT-MANAGER ??
// CREAR LECCIÓN CREAR  MEDITACIÓN,  CREAR  CONTENIDO !!!


export default router;

// RUTAS GENÉRICAS DE LA APP

//  AÑADIR LAS RUTAS

