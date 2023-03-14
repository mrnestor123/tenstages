

import { stagenumbers, user } from '../models/models.js';
import { getFiles, uploadFile } from '../api/server.js';
import { Header2, Header3, SubHeader } from '../util/texts.js';
import { isAudio, isFile, isImage, isVideo } from '../util/util.js';
import { Button, Column, Container, Grid, Label, Row, Section, Select } from './components.js';

// COMPONENTES PARA LA PÁGINA DE MANAGEMENT


/*

    types:  'image', 'video', 'audio', 'file'
    si no  se especifica se pueden añadir todos los tipos

*/
function showFileExplorer(options={}){
    var elem = document.createElement("div")

    elem.style = 'position:fixed;inset:0px;z-index:100000; background:rgba(0,0,0,0.5)'
    elem.id = Math.random()*10000 + ''

    document.body.appendChild(elem);

    options.close = () => elem.remove()

    // AÑADIR TRANSICIONES SIN SEMANTIC !!!
    m.mount(elem, {
        view:()=> m("div",{
            // centered absolute container
            style: "position:fixed; width:80vw; top:50%; left:50%; transform: translate(-50%, -50%); background-color:white; border-radius:10px;  padding:1em",
        },
            m(FileExplorer,{
                options
            }),
            // grey border and close button
            m("div",{
                style:"position:absolute; top:0; right:0; padding:1em; cursor:pointer; color:grey; font-size:1.5em; border-radius:10px 0 0 0",
                onclick: (e)=> {
                    elem.remove()
                    options.then ? options.then() :null
                }
            },'x')
        )
    })
}

let cachedBuckets = {}
let cachedImages = {}


/*
*
*    TODO: QUE SE MUESTRE CARGANDO CUANDO SE SUBA UNA
*
*
*/
// se utiliza en conjunto con button, pasarle un data y name y un id.
function FileExplorer() {
    let files = {}
    let loadingimages = true;

    let filter = {
        'bucket': 'stage 1',
        'type': 'all'
    }

    let buckets = [
        {value:'my_files', label:'My Files'},
        {value: 'common_files', label:'dynamicfiles'},
    ]

    let filetypes = [
        {name: 'all', label: 'All types'},
        {name: 'image', label: 'Images', filter: isImage},
        {name: 'video', label: 'Videos', filter: isVideo},
        {name: 'audio', label: 'Audios', filter: isAudio},
        {name: 'file', label: 'Files', filter: isFile}
    ]


    let page = 0;

    // para cuando pasamos un tipo desde fuera
    let isFiltered = false;

    let loadedImages= false;
    let uploading = false;
    
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


    function getFileName(src){
        // A PARTIR DE LA URL SACAMOS EL FILENAME

        let url = decodeURIComponent(src.split('?')[0]).split('/')

        return decodeURIComponent(url[url.length - 1])
    }

    return {
        oninit: (vnode) => {
            
            stagenumbers.map((item)=>{
                buckets.push({value: item, label:'Stage ' + item + ' files'})
            })

            if(vnode.attrs.options && vnode.attrs.options.type){
                filter.type = vnode.attrs.options.type
                filter.selectedType = filetypes.find((item)=> item.name == filter.type).filter
                isFiltered = true
            }

           getFiles().then((res)=>{
                files = res
                console.log('files',files)
                loadedImages = true
                // EL CODUSER
                if(!files[localStorage.getItem('meditationcod')]){
                    files[localStorage.getItem('meditationcod')] = []
                }

                filter.bucket = localStorage.getItem('meditationcod')


                m.redraw()

           })
        },
        view: (vnode) => {
            let selectedFiles = files[filter.bucket] || []
            let filteredFiles = selectedFiles.filter((item)=>{
                if(filter.selectedType){
                    return filter.selectedType(item)
                }else{
                    return true
                }
            })

            let pages = Math.ceil(filteredFiles.length / 12)
            var collator = new Intl.Collator([], {numeric: true});
            let options = vnode.attrs.options || {}


            return [
                
                m("div",{style:" padding:1em; border-radius:15px;"},
                m(Grid,{ rowgap:'small',columngap:'small'},
                    [   

                        options && options.data && options.name ? 
                        m(Column,{width:'1-1'},
                            m("p", "Press the file to select it")
                        ):null,

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
                            }, Object.keys(files).sort((a, b) => collator.compare(a, b))),
                            
                            m(Header3, "File Type"),

                            m("ul",{class:"uk-tab-left", 'uk-tab': ''},
                                filetypes.map((item)=>{
                                    return m("li",{
                                        class: item.name == filter.type ? 'uk-active' : '',
                                        onclick:()=>{
                                            console.log('isFiltered', isFiltered)
                                            if(!isFiltered){
                                                filter.type = item.name
                                                filter.selectedType = item.filter ||  null
                                                page = 0
                                            }
                                            //queryImages(selectedstage.num, filter.bucket == 'common_files')
                                        }
                                    }, m("a",{disabled: isFiltered },item.label))
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
                                        if(!files[user.codUser]){
                                            files[user.codUser] = []
                                        }
                                        
                                        // SIEMPRE LO AÑADIMOS AL BUCKET DEL USUARIO !!
                                        uploadFile(user.codUser, file, 'teacherFiles').then((url) => {
                                            // LA AÑADIMOS LA PRIMERA
                                            //files.unshift(url)
                                            files[user.codUser].push(url)
                                            m.redraw()
                                        })
                                    }
                                },
                                style: "display:none"
                            })
                        ),
                        m(Column,{width:'4-5'},
                            loadedImages ?
                            m(Grid,{ verticalalign:true},
                                pages > 0 ? 
                                m(Row,
                                    m("ul.uk-pagination",{style:"align-items:center;font-size:1.2em"},
                                        // left arrow  pagination

                                        m("li",{
                                            onclick:()=>{
                                                if(page > 0){
                                                    page -= 1
                                                    m.redraw()
                                                }
                                            },
                                            // disabled opacity 
                                            style: page == 0 ? 'opacity:0.5' : ''
                                        },m("a",m("span",{'uk-pagination-previous': ''}))),
                                        

                                        Array.from(Array(pages).keys()).map((item,index)=>{
                                            return m("li",{
                                                class: index == page ? 'uk-active' : '',
                                                onclick:()=>{
                                                    // DEBERÍA  SER MAS UNO Y LUEGO MOSTRAMOS DOCE!!
                                                    page = index
                                                }
                                            },m("a",index + 1))
                                        }),

                                        // right arrow pagination
                                        m("li",{
                                            onclick:()=>{
                                                if(page < pages-1){
                                                    page++
                                                }
                                            },
                                            // disabled opacity
                                            style: page == pages -1 ? 'opacity:0.5' : ''
                                        },m("a",m("span",{'uk-pagination-next': ''}))
                                        )
                                    )
                                ):  null,

                                filteredFiles.slice(page*12,(page*12)+12).map((src)=>{
                                    return m(Column,{width:'1-4', style:"text-align:center"},
                                    src.match('jpeg|jpg|gif|png|PNG|JPG') ?
                                    m("div",{
                                        style:`background-image:url("${src}");position:relative; 
                                            background-size:cover; background-position:center; width:100%; 
                                            height:150px; border-radius:10px; margin:1em; cursor:pointer;
                                        `,
                                        onclick:()=>{
                                            if(options.data && options.name){
                                                options.data[options.name] = src
                                                options.close()
                                            }else{
                                                window.open(src, '_blank')
                                            }
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
                                    [
                                        m("audio",{
                                            style:'width:90%',
                                            controls:true,
                                            id:'audio',
                                        },m("source",{src:src})),
                                        
                                        m("strong",  {style:"text-align:center;margin-top:5px"}, getFileName(src))
                                    ])
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



function InfoText(){
    return{
        view:(vnode)=>{
            let {video, title,subtitle} = vnode.attrs

            return m(Section,{style:"padding:0px", type:'muted'},
                m(Container,{size:'large'},
                    m("div",{style:"padding:30px 0px;"},
                        title ? m(Header2, title) : null,
                        m(SubHeader,  subtitle),
                        video ? 
                        m(Button, {type:'secondary'}, "EXPLANATORY VIDEO") :  null
                    )
                )
            )
        }
    }
}

// EXPORT

export { FileExplorer, showFileExplorer , InfoText};
