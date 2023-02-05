

class StageEntity {


    constructor(json){

        this.newpathposition = json.newpathposition
        this.type = json.type
        this.title = json.title
        this.image = json.image
        this.stagenumber = json.stagenumber
        this.position = json.position
        this.cod = json.cod
        this.text = json.text
        this.description = json.description


    }


}



export {StageEntity}