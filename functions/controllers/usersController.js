import { getStage } from './stagesController.js';
import { db } from '../app.js';

// Get all users 
// This router can have query params ?role=teacher or ?role=student or ...
export const getUsers = async (role) => {
    try {
        let users = [];

        if (role) {
            users = await findUsersByRole(role);
            return users;
        }

        var usersQuery = await db.collection('users').get();

        if (usersQuery.docs.length) {
            for (var doc of usersQuery.docs) {
                users.push(doc.data());
            }
        }

        return users;

    } catch(err) {
        throw new Error(err);
    }
};

// 3 tipos de get user connect, expandUser, normal
export const getUser = async (userId, expand, connect) => {
    try {
        let user;
        let query = await db.collection('users')
            .where('coduser', '==', userId)
            .get();

        if (query.docs.length) {
            user = query.docs[0].data();
            if (expand || connect) {
                if (user.role === "teacher") {
                    user.addedcontent = await getUserCreatedContent(userId);
                    user.addedcourses = await getUserPaths(userId);
                }
                user.meditations = await getMeditations(userId);
            }
            if (connect) {
                user.stage = await getStage(user.stagenumber);
                user.joinedcourses = user.joinedcourses && user.joinedcourses.length
                    ? await expandJoinedCourses(user.joinedcourses)
                    : [];
                user.readlessons = await getUserReadLessons(userId);
                user.doneContent = await getUserDoneContent(userId);
                user.notifications = await getUserNotifications(userId);
            }
        }
        return user;

    } catch(err) {
        throw new Error(err);
    }
};

// queremos esto? AUN NO
export const deleteUser = async () => {
    try {
        // delete user
        // cuando se borra un usuario deberán borrarse todos los datos asociados a él
    } catch(err) {
        throw new Error(err);
    }
};

// queremos esto? SI AUN FALTA HACERLO 17/12/22
export const updateUser = async (userId, data) => {
    try {
        let query = await db.collection('users')
            .where('coduser', '==', userId)
            .get();

        if (query.docs.length) {
            await db.collection('users')
                .doc(query.docs[0].id)
                .update(data);
        }

        return data;
    
    } catch(err) {
        throw new Error(err);
    }
};


const findUsersByRole = async (role) => {
    try {
        let users = [];
        let query = await db.collection('users')
            .where('role', '==', role)
            .get();

        if (query.docs.length) {
            for (var doc of query.docs) {
                users.push(doc.data());
            }
        }

        return users;

    } catch(err) {
        throw new Error(err);
    }
};

const getUserCreatedContent = async (userId) => {
    try {
        let content = [];
        let query = await db.collection('content')
            .where('createdBy', '==', userId)
            .get();

        if (query.docs) {
            for (var doc of query.docs) {
                if(doc.data().position != null && doc.data().path == null){
                    content.push(doc.data());
                }
            }
        }
        if (content.length) { content.sort((a,b)=> a.position -b.position) }

        return content;

    } catch(err) {
        throw new Error(err);
    }
};

const getUserPaths = async (userId) => {
    try{
        let paths = [];
        let query = await db.collection('paths').where('createdBy', '==', userId).get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                paths.push(doc.data());
            }
        }

        return paths;
        
    } catch(err) {
        throw new Error(err);
    };

    
};

const getMeditations = async (userId) => {
    try{
        let meditations = [];
        let query = await db.collection('meditations').where('coduser', '==', userId).get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                meditations.push(doc.data());
            }
        }

        return meditations;
        
    } catch(err) {
        throw new Error(err);
    };
};

const expandJoinedCourses = async (joinedCourses) => {
    try{
        let courses = [];
        for(var course of joinedCourses){
            let query = await db.collection('paths').where('cod', '==', course).get();
            if(query.docs.length){
                courses.push(query.docs[0].data());
            }
        }

        return courses;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserReadLessons = async (userId) => {
    try{
        let lessons = [];
        let query = await db.collection('lessons')
            .where('coduser', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                lessons.push(doc.data());
            }
        }

        return lessons;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserDoneContent = async (userId) => {
    try{
        let doneContent = [];
        let query = await db.collection('doneContent')
            .where('doneBy', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                doneContent.push(doc.data());
            }
        }
        return doneContent;
        
    } catch(err) {
        throw new Error(err);
    };
};

const getUserNotifications = async (userId) => {
    try{
        let notifications = [];
        let query = await db.collection('notifications')
            .where('coduser', '==', userId)
            .get();
        
        if(query.docs.length){
            for(var doc of query.docs){
                notifications.push(doc.data());
            }
        }
        return notifications;
        
    } catch(err) {
        throw new Error(err);
    };
};


// TEST GET USERS
//getUsers().then(users => console.log(users.slice(0, 5))); //SUCCESS
//getUsers('teacher').then(users => console.log(users)); //SUCCESS

// TEST GET USER
getUser('ASI9f9j4qjgsYSoGp81aAO5iLf33', false, true).then(user => console.log(user));
