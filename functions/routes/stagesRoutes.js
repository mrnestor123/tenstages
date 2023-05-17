import express from 'express';
import { getStages, getStage} from '../controllers/stagesController.js';
import { isVerified } from '../app.js';

const router = express.Router();

// Get all stages
router.get('/', isVerified, async (req, res) => {
    try {
        const stages = await getStages();
        res.status(200).json(stages);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get stage by stageId
// ¿Lo queremos por stageId o por stageNumber?
router.get('/:stageNumber', isVerified, async (req, res) => {
    try {
        const expand = !!req.query.expand;
        const stage = await getStage(req.params.stageNumber, expand);
        res.status(200).json(stage);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});


export default router;
