import express from 'express'
import { getDB , getMilestones} from '../controllers/contentController.js'


const router = express.Router({ mergeParams: true });


router.get('/', async (req, res) => {
    try {
        console.log('PARAMETERS', req.query)
        let db = await getDB(req.query?.new);
        return res.status(200).json(db);
    } catch(err) {
        return res.status(400).json({ message: err });
    }
});

router.get('/milestones', async (req, res) => {
    try {
        let milestones = await getMilestones();
      //  console.log('m',milestones)
        
        return res.status(200).json(milestones);
    } catch(err) {
        return res.status(400).json({ message: err });
    }
});

// EN  DATABASE  AÑADIMOS  LOS CURSOS  ???
// LLAMARLO CONTENT-MANAGER ??
// CREAR LECCIÓN CREAR  MEDITACIÓN,  CREAR  CONTENIDO !!!

export default router;

// RUTAS GENÉRICAS DE LA APP

//  AÑADIR LAS RUTAS

