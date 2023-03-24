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

            // las tecnicas deberían de estar dentro de la stage
            promises.push(getTechniques());

            promises.push()

            Promise.all((promises)).then((values) => {
                db.versions = values[0];
                db.courses = values[1];
                db.stages = values[2];
                db.settings = values[3];
                db.sections = values[4];
                db.techniques = values[5];

                resolve(db);
            })
            
        } catch (err) {
            reject(err);
        }
    });
}


async function getSections(){
    return new Promise(async (resolve, reject) => {
        let query = await db.collection('sections').get();
        let sections = [];

        if(query  && query.docs && query.docs.length){
            
            let promises =  []
            for(let doc of query.docs){
                let section = doc.data();
                if(section.content){
                    promises.push(db.collection('content').where('cod','in',section.content).get());
                }
                sections.push(section);
            }


            Promise.all(promises).then((queries) => {
                let i = 0
                for(let query of queries){
                    let section = sections[i++];
                    section.content = [];
                    for(let doc of query.docs){
                        let content = doc.data();
                        console.log('content',content)
                        section.content.push(doc.data());
                    }
                    i++;
                }

                console.log('sections',sections)

                resolve(sections)
            })

        }

    })
}


async function getSettings(){
    let query = await db.collection('settings').doc('settings').get();

    if(query  && query.docs && query.docs.length){
        return query.docs[0].data();
    } else {
        return {};
    }
}


async function getTechniques(){
    let query = await db.collection('techniques').get()

    let techniques = [];

    if(query  && query.docs && query.docs.length){
        for(let doc of query.docs){
            techniques.push(doc.data());
        }
    }

    return techniques;
}
