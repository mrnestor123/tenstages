import { db } from '../app.js';

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
