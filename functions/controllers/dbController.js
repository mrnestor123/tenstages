import { db } from '../app.js';
import { getStages } from './stagesController.js';

//AQUÍ SACAMOS LOS CURSOS  O LAS  VERSIONES  DE LA APP !!! EL CONTENIDO DE LA APP NUEVO ? ?
export const getVersions = async () => {
    try {
        var versions = [];
        var versionsQuery = await db.collection('versions').get();

        if (versionsQuery.docs.length) {
            for (var doc of versionsQuery.docs) {
                versions.push(doc.data());
            }
        }
        
        return versions;
    } catch (err) {
        throw new Error(err);
    }
};

export const getCourses = async () => {
    try {
        var courses = [];
        // TODO: CAMBIAR EL NOMBRE DE LA COLECCIÓN A 'courses'
        var coursesQuery = await db.collection('paths').get();

        if (coursesQuery.docs.length) {
            for (var doc of coursesQuery.docs) {
                let course = doc.data();

                // TODO: AÑADIR EL CONTENIDO DENTRO DE EL DOCUMENTO DE CADA CURSO
                course.content = [];
                let content = await db
                    .collection('content')
                    .where('path', '==', course.cod)
                    .get();

                if (content.docs) {
                    for (let doc of content.docs) {
                        course.content.push(doc.data());
                    }

                    course.content.sort((a, b) => a.position - b.position);
                }
                courses.push(course);
            }
        }

        return courses;
    } catch (err) {
        throw new Error(err);
    }
};


// DEVUELVE LOS DATOS DE LA BASE DE DATOS
// LOS RECORDINGS, las stages y los usuarios !!
export const getDB = async () =>{

    // SACAMOS LOS DATOS

    return new Promise(async (resolve, reject) => {
        try {
            let db = {};
            let promises = [];

            // asi se hacen concurrentemente
            promises.push(getVersions());

            promises.push(getCourses());

            promises.push(getStages());

            promises.push(getSettings());

            promises.push(getSections());
            

            promises.push()

            Promise.all((promises)).then((values) => {
                db.versions = values[0];
                db.courses = values[1];
                db.stages = values[2];
                db.settings = values[3];
                db.sections = values[4];

                resolve(db);
            })
            
        } catch (err) {
            reject(err);
        }
    });
}


async function getSections(){
    let query = await db.collection('sections').get();
    let sections = [];

    if(query  && query.docs && query.docs.length){
        for(let doc of query.docs){
            sections.push(doc.data());
        }
    }

    return sections;
}





async function getSettings(){
    let query = await db.collection('settings').doc('settings').get();

    if(query  && query.docs && query.docs.length){
        return query.docs[0].data();
    }else{
        return {};
    }
}
