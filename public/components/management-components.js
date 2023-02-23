

import { stagenumbers, user } from '../models.js';
import { getFiles, uploadFile } from '../server.js';
import { Header3 } from '../texts.js';
import { isVideo } from '../util.js';
import { Button, Column, Grid, Label, Row, Select } from './components.js';

// COMPONENTES PARA LA PÁGINA DE MANAGEMENT


/*

    types:  'image', 'video', 'audio', 'file'
    si no  se especifica se pueden añadir todos los tipos

*/
function showFileExplorer(options={}){
    var elem = document.createElement("div")

    elem.style = 'position:fixed;inset:0px;z-index:100000'
    elem.id = Math.random()*10000 + ''

    document.body.appendChild(elem);

    // AÑADIR TRANSICIONES SIN SEMANTIC !!!
    m.mount(elem, {
        view:()=> m(FileExplorer,{
            options
        })
    })
}

let cachedBuckets = {}
let cachedImages = {}

// se utiliza en conjunto con button, pasarle un data y name y un id.
function FileExplorer() {
    
    let files = {}

    let loadingimages = true;
    let filter = {
        'bucket': 'stage 1'
    }

    let buckets = [
        {value:'my_files', label:'My Files'},
        {value: 'common_files', label:'dynamicfiles'},
    ]

    let filetypes = [
        {value: 'all', label: 'All types'},
        {value: 'image', label: 'Images'},
        {value: 'video', label: 'Videos'},
        {value: 'audio', label: 'Audios'},
        {value: 'file', label: 'Files'}
    ]


    let page = 0;

    let loadedImages= false;


    // ES  UN INPUT HIDDEN QUE  CUANDO  SE  APRETA
    function FileUploader() {
        return {
            view: (vnode) => {
                let { data, name, id , stage,path } = vnode.attrs
                return [
                    
                ]
            }
        }
    }

    
    /*
    function queryFiles(bucket){
        if (cachedImages[bucket] ) {
            files = cachedImages[bucket]
            loadingimages= false
            m.redraw()
        }else{
            getFiles(bucket).then((res) => { 
                loadingimages = false;
                files = res; 
                cachedBuckets[bucket] = res

                /*
                files.slice(0,8).map((item)=>{
                    cachedImages[bucket]  
                })
                m.redraw(); 
            })
        }
    }*/

    return {
        oninit: (vnode) => {
            
            stagenumbers.map((item)=>{
                buckets.push({value: item, label:'Stage ' + item + ' files'})
           })

           getFiles().then((res)=>{
                files = res

                loadedImages = true
                // EL CODUSER
                if(!files[user.codUser]){
                    files[user.codUser || localStorage.getItem('meditationcod')] = []
                }

                m.redraw()

           })
        },
        view: (vnode) => {
            let selectedFiles = files[filter.bucket] || []
            let pages = Math.ceil(selectedFiles.length / 12)


            return [
                
                m("div",{style:" padding:1em; border-radius:15px;"},
                m(Grid,{center:true , rowgap:'small',columngap:'small'},
                    [   
                        m(Column,{
                            width:'1-5'
                        },
                            m(Header3, "Select bucket"),
                            m(Select,{
                                onchange:(e)=>{
                                    page = 0
                                },
                                data:filter,
                                name:'bucket'
                            }, Object.keys(files)),
                            
                            m(Header3, "File Type"),

                            m("ul",{class:"uk-tab-left", 'uk-tab': ''},
                                filetypes.map((item)=>{
                                    return m("li",{
                                        class: item.name == filter.type ? 'uk-active' : '',
                                        onclick:()=>{
                                            filter.type = item.name
                                            //queryImages(selectedstage.num, filter.bucket == 'common_files')
                                        }
                                    },m("a",item.value))
                                })
                            ),  
                                
                            m(Button,{
                                type:'secondary',
                                onclick:()=>{
                                    document.getElementById('file-upload').click()
                                }
                            }, "Upload file"),

                            m("input", {
                                type: "file", 
                                id: 'file-upload', 
                                accept: "*",
                                onchange: (e) => {
                                    let file = e.target.files[0]
                                    if(file){
                                        // SIEMPRE LO AÑADIMOS AL BUCKET DEL USUARIO !!
                                        uploadFile(user.codUser, file).then((url) => {
                                            // LA AÑADIMOS LA PRIMERA
                                            files.unshift(url)
                                            m.redraw()
                                        })
                                    }
                                },
                                style: "display:none"
                            })
                        
                        
                        ),
                        m(Column,{width:'4-5'},
                            loadedImages ?
                            m(Grid,{center:true,  verticalalign:true},
                                pages > 0 ? 
                                m(Row,
                                    m("ul.uk-pagination",{style:"align-items:center;font-size:1.2em"},
                                    // left arrow  pagination

                                    m("li",{
                                        onclick:()=>{
                                            if(page > 0){
                                                page -= 12
                                                m.redraw()
                                            }
                                        },
                                        // disabled opacity 
                                        style: page == 0 ? 'opacity:0.5' : ''
                                    },m("a",m("span",{'uk-pagination-previous': ''}))),
                                    

                                    Array.from(Array(pages).keys()).map((item,index)=>{
                                        return m("li",{
                                            class: index * 12 == page ? 'uk-active' : '',
                                            onclick:()=>{
                                                page = index * 12
                                                m.redraw()
                                            }
                                        },m("a",index + 1))
                                    }),

                                    // right arrow pagination
                                    m("li",{
                                        onclick:()=>{
                                            if(page < pages * 12){
                                                page += 12
                                                m.redraw()
                                            }
                                        },
                                        // disabled opacity
                                        style: page == pages * 12 ? 'opacity:0.5' : ''
                                    },m("a",m("span",{'uk-pagination-next': ''}))
                                    ),

                                )):  null,

                                selectedFiles.slice(page, page+12).map((src)=>{
                                    return m(Column,{width:'1-4'},
                                    src.match('jpeg|jpg|gif|png|PNG|JPG') ?
                                    m("div",{
                                        style:`background-image:url("${src}");position:relative; 
                                            background-size:cover; background-position:center; width:100%; 
                                            height:150px; border-radius:10px; margin:1em; cursor:pointer;
                                        `,
                                        onclick:()=>{
                                            window.open(src, '_blank')
                                        }
                                    }, 
                                        m(Label, {
                                            style:"position:absolute; right:10px; top:10px",
                                            onclick:(e)=>{
                                                if(confirm("Are you sure?")){
                                                    /*
                                                    TODO:  DELETE
                                                    deleteFile(image).then((res)=>{
                                                        files[filter.bucket] = files[filter.bucket].filter((item)=>{
                                                            return item != image
                                                        })
                                                        m.redraw()
                                                    })*/
                                                }
                                            },
                                            class:'uk-label-danger'},  
                                        "Delete")
                                    ):
                                    isVideo(src)  ?
                                    m("video",{
                                        src:src,controls:true
                                    }) :
                                    m("audio",{
                                        controls:true,
                                        id:'audio',
                                    },m("source",{src:src}))
                                    )
                                })
                            ):null
                        ),

                        m(Row,
                            //m(Divider)
                        ),

                        /*
                        m(Column, { width: '1-2' },
                            m(Button, {
                                type:'primary',
                                onclick: (e) => {
                                    if(vnode.attrs.onchange){
                                        vnode.attrs.onchange(files[selectedindex])
                                    }else{
                                        data[name] = files[selectedindex]
                                    }
                                    console.log(data[name])
                                    m.redraw()
                                },
                                class: "uk-modal-close"
                            }, "Select"),
                            m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById(`file-chooser-${rndnmb}`).click() } }, "Upload File"),
                            m(FileUploader, {
                                data: imagetoadd,
                                stage: selectedstage["num"],
                                name: "src",
                                id: `file-chooser-${rndnmb}`,
                                onsuccess: (src) => { files.push(src) }
                            }),
                        ),

                        m(Column, { width: '1-2' },
                            m("label", "Select stage"),
                            m(Select, {
                                data: selectedstage,
                                name: "num",
                                onchange: (e) => {
                                    files = [];
                                    loadingimages =true;
                                    queryImages(selectedstage.num)
                                }
                            }, stages)
                        ),

                        m(Column, { width: '1-1' },
                            files.length > 0 ?
                                m(Grid,
                                    files.map((src, index) => {
                                        return m(Column, { width: '1-3',
                                            onclick: (e) => selectedindex = index, 
                                            style: selectedindex == index ? 'border: 2px solid lightblue' : '' 
                                        } ,
                                            src.match('jpeg|jpg|gif|png|PNG|JPG') ?
                                            m("img", { src: src}) :
                                            m(FileView,{file:src, style:"width:90%"})
                                        )
                                    })
                                ) : loadingimages ? m(".ui.active.centered.inline.loader",{style:"margin-top:30px;"}):
                                null
                        )*/
                    ]
                )  )          
            ]
        }
    }
}


// MUESTRA VIDEO O AUDIO !!! 
function FileView() {

    let filename;

    function isAudio(path){
        return path.toLowerCase().matc('.m4a|.mp3')
    }

    function isVideo(path){
        return path.toLowerCase().match('.mp4|.mov')
    }

    return {
        view:(vnode)=>{
            let file = vnode.attrs.file
            let splittedfile = file.split('/')
            filename = splittedfile[splittedfile.length -1].split('?')[0]

            return [
                m("p",decodeURI(filename.replace('%2F','/')).replace('%2C',' ')),
                isVideo(file) ? m("video",{
                    src:file,controls:true
                }) :
                m("audio",{
                    controls:true,
                    id:'audio',
                    style:vnode.attrs.style,
                    oncreate:(vnode)=>{
                        console.log(document.getElementById('audio'))
                        console.log(vnode)}
                },m("source",{src:file}))
            ]
        }
    }
}

// EXPORT

export { FileExplorer, showFileExplorer };
