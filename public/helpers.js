
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


export {isGame,isLesson,isMeditation}