import { db } from '../app.js';
import { getStages } from './stagesController.js';
import { getUser } from './usersController.js';

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

            console.time('VERSIOONS')
            db.versions = await getVersions();
            console.timeEnd('VERSIONS')

            console.time('stages')
            db.stages = await getStages();
            console.timeEnd('stages')

            console.time('settings')
            db.settings = await getSettings();
            console.timeEnd('settings')

            console.time('sections')
            db.sections = await getSections();
            console.timeEnd('sections')


            // PODRÍAMOS SACAR MENOS COSAS ??
            resolve(db);

            
            /*// asi se hacen llamadas asíncronas
            promises.push();

            promises.push();

            promises.push();

            promises.push();

            // las tecnicas deberían de estar dentro de la stage
            //promises.push(getTechniques());


            Promise.all((promises)).then((values) => {
                
                console.log('DATA'.db)

                
                //db.courses = values[1];
                //db.techniques = values[5];

                
            })*/
            
        } catch (err) {
            console.log('ERR',err)
            reject(err);
        }
    });
}


async function getSections(){
    return new Promise(async (resolve, reject) => {
        try {
            let query = await db.collection('sections').get();
            let sections = [];

            if(query && query.docs && query.docs.length){
                let promises = []
                
                for(let doc of query.docs){
                    let section = doc.data();

                    if(section.content){
                        promises.push(db.collection('content').where('cod','in',section.content).get());
                    }

                    if (section['createdBy'] != null) {
                        let user = await getUser(section['createdBy']);
                        section['createdBy'] = {};
                        section['createdBy'].nombre = user.nombre;
                        section['createdBy'].image = user.image;
                        section['createdBy'].coduser = user.coduser;
                    }

                    sections.push(section);
                }


                Promise.all(promises).then((queries) => {
                    let i = 0
                    for(let query of queries){
                        let section = sections[i++];
                        section.content = [];
                        for(let doc of query.docs){
                            section.content.push(doc.data());
                        }
                    }

                    resolve(sections)
                })

        }

        }catch(err){
            reject(err);
        }

    })
}


async function getSettings(){
    let query = await db.collection('settings').get();

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
