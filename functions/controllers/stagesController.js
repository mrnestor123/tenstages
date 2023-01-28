import { db } from '../app.js';
import { getUser } from './usersController.js';

export const getStages = async () => {
    try{
        let stages = [];
        let query = await db.collection('stages').get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                let stage = doc.data();
                await populateStage(stage);
                stages.push(stage);
            }
        }

        stages.sort((a,b)=> a.stagenumber - b.stagenumber);
        return stages;

    } catch(err) {
        throw new Error(err);
    }
};

// Lo queremos por stageId o por stageNumber ????
export const getStage = async (stageNumber, expand) => {
    
    console.log('HOLA HOLA')
    
    try {
        var stage; 
        var query = await db.collection('stages')
            .where('stagenumber', '==', stageNumber < 10 ? stageNumber : 1)
            .get();

        if(query.docs.length){
            stage = query.docs[0].data();
            if(expand) {
                await populateStage(stage)
                return stage;
            }
        }

        return stage;
    }
    catch(err) {
        throw new Error(err);
    }
};

const populateStage = async (stage) => {
    try {
        var query = await db.collection('content')
            .where('stagenumber', '==', stage.stagenumber)
            .get();
    
        stage.meditations = [];
        stage.games = [];
        stage.videos = [];
        stage.lessons = [];
        
        for (var doc of query.docs) {
            //HAGO DOS VECES EL IF SE PODRÍA HACER METODO ADDMEDITATION, ADDLESSON, ADDGAME !!!
            var content = doc.data();
            // TODO ESTO PODRÍA SER LO MISMO !!!
            if (content['position'] != null || content['type'] == 'meditation-game') {
                await expandContent(content);
                switch (content['type']) {
                    case 'meditation-practice': stage.meditations.push(content); break;
                    case 'meditation-game': stage.games.push(content); break;
                    case 'video': stage.videos.push(content); break;
                    default: stage.lessons.push(content);
                }
            }
        }
    } catch(err) {
        throw new Error(err);
    }
};

const expandContent = async (content) => {
    // HACE FALTA SABER QUIEN LO HA CREADO EN CADA MOMENTO ??????
    // CACHEAR ESTAS LLAMADAS !!!
    try {
        if (content['createdBy'] != null) {
            let user = await getUser(content['createdBy']);
            content['createdBy'] = {};
            content['createdBy'].nombre = user.nombre;
            content['createdBy'].image = user.image;
            content['createdBy'].coduser = user.coduser;
        }
    } catch(err) {
        throw new Error(err);
    }
};


