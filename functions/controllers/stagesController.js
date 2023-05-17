import { db } from '../app.js';
import { getUser } from './usersController.js';

export const getStages = async () => {
    try {
        let stages = [];
        let query = await db.collection('stages').get();
        let allContent = await getStagesContent();

        let users = {};

        if (query.docs.length) {
            for (var doc of query.docs) {
                let stage = doc.data();
                
                stage.meditations = [];
                stage.games = [];
                stage.videos = [];
                stage.lessons = [];

                for (var content of allContent.filter((c)=>  c.stagenumber ==  stage.stagenumber)) {
                    // TODO ESTO PODRÍA SER LO MISMO !!!
                    if (content['createdBy'] != null) {
                        let user = users[content['createdBy']] ? users[content['createdBy']] : await getUser(content['createdBy']);
                        users[user.coduser] = user;
                        content['createdBy'] = {};
                        content['createdBy'].nombre = user.nombre;
                        content['createdBy'].image = user.image;
                        content['createdBy'].coduser = user.coduser;
                    }
                        
                    switch (content['type']) {
                        case 'meditation-practice':
                            stage.meditations.push(content);
                            break;
                        case 'meditation-game':
                            stage.games.push(content);
                            break;
                        case 'video':
                            stage.videos.push(content);
                            break;
                        default:
                            stage.lessons.push(content);
                            
                    }
                }

                stages.push(stage);
            }
        }

        stages.sort((a, b) => a.stagenumber - b.stagenumber);

        return stages;
    } catch (err) {
        throw new Error(err);
    }
};

export const getStage = async (stageNumber, expand) => {
    try {
        var stage;
        var query = await db
            .collection('stages')
            .where('stagenumber', '==', stageNumber < 10 ? stageNumber : 1)
            .get();

        if (query.docs.length) {
            stage = query.docs[0].data();
            if (expand) {
                await populateStage(stage);
                return stage;
            }
        }

        return stage;
    } catch (err) {
        throw new Error(err);
    }
};


const getStagesContent = async () => {
    let query = await db.collection('content').where('stagenumber','!=', null).get();

    let content = [];


    if(query.docs.length){
        for(let doc of query.docs){
            let c = doc.data()
            if(c.position  != null || c.type == 'meditation-game'){
                content.push(doc.data());
            }
        }
    }

    return content


}

const populateStage = async (stage) => {
    try {
        var query = await db
            .collection('content')
            .where('stagenumber', '==', stage.stagenumber)
            .get();

        stage.meditations = [];
        stage.games = [];
        stage.videos = [];
        stage.lessons = [];

        for (var doc of query.docs) {
            var content = doc.data();
            // TODO ESTO PODRÍA SER LO MISMO !!!
            if (
                content['position'] != null ||
                content['type'] == 'meditation-game'
            ) {
                await expandContent(content);
                switch (content['type']) {
                    case 'meditation-practice':
                        stage.meditations.push(content);
                        break;
                    case 'meditation-game':
                        stage.games.push(content);
                        break;
                    case 'video':
                        stage.videos.push(content);
                        break;
                    default:
                        stage.lessons.push(content);
                }
            }
        }
    } catch (err) {
        throw new Error(err);
    }
};

const expandContent = async (content) => {
    // CACHEAR ESTAS LLAMADAS !!!
    try {
        if (content['createdBy'] != null) {
            let user = await getUser(content['createdBy']);
            content['createdBy'] = {};
            content['createdBy'].nombre = user.nombre;
            content['createdBy'].image = user.image;
            content['createdBy'].coduser = user.coduser;
        }
    } catch (err) {
        throw new Error(err);
    }
};
