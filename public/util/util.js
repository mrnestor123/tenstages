import { uploadFile } from '../api/server.js'


//FUNCIONES REUTILIZABLES
function create_UUID() {
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
            let { data, name, id , stage,path } = vnode.attrs
            return [
                m("input", {
                type: "file", 
                id: id, 
                accept: "*",
                onchange: (e) => {
                    let file = e.target.files[0]
                    if(file){
                        if(vnode.attrs.onupload){ vnode.attrs.onupload()}
                        uploadFile(path,stage).then((url) => {
                            data[name] = url
                            vnode.attrs.onsuccess ? vnode.attrs.onsuccess(url) : null
                            m.redraw()
                        })
                    }
                },
                style: "display:none"
                })
            ]
        }
    }
}


function api_get(url, method = 'GET', data = {}, options) {
    // poner el token para app nativa
    // const token = localStorage.getItem('token')
    const headers = options && options.headers ? options.headers : {}
    // if (token) headers['Authorization'] = token

    let config = { // para poderlo ampliar
        method: method,
        url: url,
        //      url: url.replace(/\/\//g, '/'), !!! hay que reemplazar solo la parte del path
        withCredentials: false,
        credentials: 'include',
        body: data,
        headers: headers,
        timeout: 15000, // ¿habría que poderlo configurar?. Hace falta para Creta tv con mala conexión. 15 segundos
        extract: extract,
        background: options && options.background ? options.background : false
    }

    // Hay que cambiarl en mithriljs la cadena content0-type1 por content-type. Error de mithril
    if (options && options.contentType) config.headers['content-type'] = options.contentType
    return m
        .request(
            config
        )
        .then((res) => {
            //console.log(res)
            return res
        })
}

var extract = function(xhr) {
    //console.log("XHR:",xhr)
    //    var e =  xhr.status == 400 ? JSON.stringify(xhr.responseText) : xhr.responseText
    return xhr.status === 500 || xhr.responseText === ''
        ? {
            status: xhr.status,
            httpStatus: xhr.status,
            err: xhr.statusText
        }
        : xhr.status === 200 || xhr.status === 201
        ? JSON.parse(xhr.responseText)
        : Object.assign({httpStatus: xhr.status},JSON.parse(xhr.responseText))
}


function omit(key, obj) {
    const { [key]: omitted, ...rest } = obj;
    return rest;
}


const hora = (f) => new Date(f).toLocaleTimeString({ hour: '2-digit', minute: '2-digit',})
const dia = (f) => new Date(f).toLocaleDateString()


function isAudio(path) {
    return path.toLowerCase().match('.mp3|.wav|.ogg|.m4a|.aac|.wma|.flac|.alac')
}

function isVideo(path) {

    return path.toLowerCase().match('.mp4|.mov|.avi|.mkv|.webm')
}

function isImage(path){
    return path.toLowerCase().match('.jpg|.jpeg|.png|.gif|.svg')
}

// for pdf  docs, excels and other files    
function isFile(path){
    return path.toLowerCase().match('.pdf|.doc|.docx|.xls|.xlsx|.ppt|.pptx')
}


export { FileUploader, create_UUID, api_get,omit, hora, dia, isAudio, isVideo, isImage,  isFile}