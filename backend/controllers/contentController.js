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
export const getDB = async (isNew) => {
    // SACAMOS LOS DATOS
    return new Promise(async (resolve, reject) => {
        try {
            let database = {};

            database.versions = await getVersions();

            
            // sacamos todo el contenido de la app 
            let query = await db.collection('content').get();
            let content = [];

            if(query && query.docs && query.docs.length){
                for(let doc of query.docs){
                    content.push(doc.data());
                }
            }

           
            database.games = content.filter((item)=> item.type == 'meditation-game');

            
            console.time('stages')
            database.stages = await getStages(content, isNew);
            console.timeEnd('stages')


            console.time('sections')
            database.sections = await getSections(content);
            console.timeEnd('sections')
            
            /*
            console.time('milestones')
            database.milestones = await getMilestones(content);
            console.timeEnd('milestones')
            */
            
            console.time('settings')
            database.settings = await getSettings();
            console.timeEnd('settings')

            database.teachers = await getTeachers();

            // PODRÍAMOS SACAR MENOS COSAS ??
            resolve(database);
        } catch (err) {
           // console.log('ERR',err)
            
            reject(err);
        }
    });
}


async function getSections(content){
    return new Promise(async (resolve, reject) => {
        try {
            let query = await db.collection('sections').get();
            let sections = [];

            if(query && query.docs && query.docs.length){
                let promises = []
                
                for(let doc of query.docs){
                    let section = doc.data();

                    if(!section.disabled){
                        if(section.content && content == null){
                            promises.push(db.collection('content').where('cod','in',section.content).get());
                        } else {
                            section.content = content.filter((item)=> section.content.includes(item.cod));
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
                }

                if(content == null){
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
                } else resolve(sections)
            }

        }catch(err){
            reject(err);
        }

    })
}

async function getSettings(){
    let query = await db.collection('settings').get();
    
    if(query && query.docs && query.docs.length){
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

async function getTeachers () {

    let query = await db.collection('users').where('role','==','teacher').get();

    let teachers = [];

    if(query && query.docs && query.docs.length){
        for(let doc of query.docs){
            teachers.push(doc.data());
        }
    }

    return teachers;
}

export async function getMilestones(){

    let query = await db.collection('milestones').get();
    let milestones = [];

    if(query && query.docs && query.docs.length){
        for(let doc of query.docs){
            milestones.push(doc.data());
        }
    }

    

    return milestones;
}




async function getNewLessons() {
    let query = await db.collection('content').get();


    let lessons = [];

    if(query && query.docs && query.docs.length){

        for(let doc of query.docs){
            let lesson = doc.data();

            if(lesson['category'] != null){
                lessons.push(lesson);
            }
        }
    }

    return lessons;
}



async function getWeeks(content){ 

    let query = await db.collection('weeks').get();

    let weeks = [];

    if(query && query.docs && query.docs.length){

        for(let doc of query.docs){
            let week = doc.data();
            week.content = content.filter((item)=> item.week == week.cod);
            weeks.push(week);
        }
    }

    return weeks;


}
