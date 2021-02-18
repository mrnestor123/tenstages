import { uploadFile } from './server.js'


//FUNCIONES REUTILIZABLES
function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}


/*
  Componente reutilizable para subir imágenes
*/
function FileUploader() {
    return {
        view: (vnode) => {
            //data[name] es donde guardamos la url de la imagen
            let { data, name, id , stage } = vnode.attrs
            return m("input", {
                type: "file", 
                id: id, 
                accept: "image/*",
                onchange: (e) => {
                    let file = e.target.files[0]
                    uploadFile(file,stage).then((url) => {
                        data[name] = url
                        vnode.attrs.onsuccess ? vnode.attrs.onsuccess(url) : null
                        m.redraw()
                    })
                },
                style: "display:none"
            })
        }
    }
}





export { FileUploader, create_UUID}