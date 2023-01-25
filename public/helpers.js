
//funciones de ayuda

function isGame(content){
    return content.type == 'meditation-game'
}

function isLesson(content){
    return content.type == 'meditation' || content.type == 'lesson' || content.type == 'mind'
}

function isMeditation(content){
    return content.type == 'meditation-practice'
}

function isVideo(content){
    return content.type == 'video'
}

function isAdmin(user){
    return user && user.role  == 'admin'
}

export {isGame,isLesson,isMeditation, isVideo, isAdmin}