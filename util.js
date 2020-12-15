import { uploadFile } from './server.js'



function getImage(lesson) {



}

/*
    para inputs y text-areas.
    Se puede añadir más
*/
function TextField() {
    let types = {
        "textarea": { class: "uk-textarea" },
        "input": { class: "uk-input", type: "text" }

    }

    return {
        view: (vnode) => {
            let { data, name, type, oninput, style, rows } = vnode.attrs
            return type == "input" ?
                m("input", { class: types[type].class, style: style || '', value: data[name], oninput: (e) => { data[name] = e.target.value; if (oninput) oninput(e) } }) :
                m("textarea", { class: types[type].class, style: style || '', rows: rows || "2", value: data[name], oninput: (e) => { data[name] = e.target.value; if (oninput) oninput(e) } })
        }
    }
}


function Button() {
    let clase = '';
    return {
        oninit: (vnode) => {
            clase = 'button.uk-button ' + (vnode.attrs.type ? 'uk-button-' + vnode.attrs.type + ' ' : '')
                + (vnode.attrs.size ? 'uk-button-' + vnode.attrs.size + ' ' : '')
                + (vnode.attrs.width ? 'uk-width-' + vnode.attrs.width + ' ' : '')
        },
        view: (vnode) => {
            return m(clase, {
                    style: vnode.attrs.style || undefined,
                    onclick: vnode.attrs.onclick || undefined,
                    'uk-toggle': vnode.attrs.target ? `target: ${vnode.attrs.target}` : undefined
                }, vnode.children)
        }
    }
}

function SlideView() {
    return {
        view: (vnode) => {
            let { text } = vnode.attrs
            return m(".uk-grid-small",
                { 'uk-grid': '' },
                text.length > 0 ?
                    text.map((item, index) => {
                        return m("div.uk-width-1-3@m",
                            m(".uk-card.uk-card-default",
                                m(".uk-card-media-top",
                                    m("img", { src: item.image })
                                ),
                                m(".uk-card-body", { style: "position:relative" },
                                   
                                )
                            )
                        )
                    }) : null,
                m("a.uk-width-1-3@m",
                    {
                        'uk-icon': 'icon:plus',
                        onclick: (e) => {
                            text.push({ 'text': "Edit this text", 'image': "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg" })
                        }
                    }
                )
            )
        }

    }
}


//habrá que pasarle los atributos del grid, de momento no se utiliza, no está bien
function Grid() {
    return {

        view: (vnode) => {
            return m("div", { 'uk-grid': '' }, vnode.children)
        }

    }

}

//se le podrá pasar algun atributo a row y column
function Row() {
    return {
        view: (vnode) => {
            return m(".uk-width-1-1", vnode.attrs, vnode.children)

        }
    }
}


function Column() {
    return {
        view: (vnode) => {
            //no queremos que salga en los atributos. !!mejorable
            let width = vnode.attrs.width;
            delete vnode.attrs.width;
            return m(`.uk-width-${width}`, vnode.attrs, vnode.children)

        }
    }
}


function Card(){

    return {
        view: (vnode) =>{
            let {type,size} = vnode.attrs
            return m('.uk-card ' + (type ? 'uk-card-' + type + ' ' : 'uk-card-default ')
            + (size ? 'uk-card-' + size + ' ' : ''), vnode.children)
            
        }
    }
}

function CardBody(){
    return {
        view: (vnode) => {
            return m(".uk-card-body",vnode.attrs,vnode.children)
        }
    }

}

function CardMedia(){

    return {
        view: (vnode)=>{
            return m(`.uk-card-media-${vnode.attrs.position || 'top'}`,vnode.attrs,vnode.children)
        }
    }
}

function CardHeader(){

    return {
        view: (vnode)=> {
            return m(`uk-card-header`,vnode.attrs,vnode.children)        
        }
    }
}





/*
  Componente reutilizable para subir imágenes
*/
function FileUploader() {

    return {
        view: (vnode) => {
            //data[name] es donde guardamos la url de la imagen
            let { data, name, id } = vnode.attrs
            return m("input", {
                type: "file", id: id, accept: "image/*",
                onchange: (e) => {
                    let file = e.target.files[0]
                    console.log(file);
                    uploadFile(file).then((url) => {
                        console.log('image uploaded to ' + url)
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





export { TextField, SlideView, FileUploader, Row, Column, Grid , Card, CardBody, CardHeader, CardMedia, Button}