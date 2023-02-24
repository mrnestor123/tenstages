
import { stagenumbers, types, user } from '../models.js';
import { addContent, addPath, getFiles, updatePath } from '../server.js';
import { FormLabel, Header2, SubHeader } from '../util/texts.js';
import { create_UUID, dia, FileUploader, hora } from '../util/util.js';
import { Button, Card, CardBody, CardHeader, CardMedia, Column, Form, Grid, Modal, Padding, Row, Select, TextEditor, TextField } from './components.js';

//explicar como se utiliza para el futuro

// COMPONENTES  COMUNES PARA TODA LA WEB

// se utiliza en conjunto con button, pasarle un data y name y un id.
function ImagePicker() {
    var imagetoadd = {};
    let selectedindex;
    let selectedstage = {}
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'dynamicfiles']
    let images = []
    let rndnmb = 0

    let loadingimages = true;
    let showingModal = false;

    function queryImages(stage, noStage){
        if (cachedImages[stage] ) {
            images = cachedImages[stage]
            loadingimages= false
            m.redraw()
        }else{
            getFiles(stage, noStage).then((res) => { 
                loadingimages = false;
                images = res; 
                cachedImages[stage] = res
                m.redraw(); 
            })
        }
    }

    return {
        oninit: (vnode) => {
            let stagenumber = vnode.attrs.stagenumber || 1
            selectedstage.num = stagenumber
            rndnmb = Math.floor(Math.random() * 100)
        },
        view: (vnode) => {
            let {data,name}  = vnode.attrs
            //podemos añadirle un loading

            return [
                m("div",
                    {
                        'uk-toggle': `target:#${vnode.attrs.id}`,
                        style: "cursor:pointer",
                        onclick:(e)=>{
                           queryImages(selectedstage.num)
                        }
                    },
                    data[name] ?
                        m("img", { src: data[name] }) :
                        m("div", { style: "min-height:200px;display:flex;justify-content:center" }, "Click to add an image")
                ),
                m("div",
                    {
                        'uk-modal': 'stack: true',
                        class: 'uk-modal-container',
                        id: vnode.attrs.id
                    },
                    m(".uk-modal-dialog.uk-margin-auto-vertical",
                        m("button.uk-modal-close-default", { 'uk-close': '' }),
                        m(".uk-modal-body",{style:"min-height:500px;max-height:900px;overflow:auto;"},
                            m(Grid,{center:true , rowgap:'small',columngap:'small'},
                                [
                                    m(Column, { width: '1-2' },
                                        m(Button, {
                                            type:'primary',
                                            onclick: (e) => {
                                                if(vnode.attrs.onchange){
                                                    vnode.attrs.onchange(images[selectedindex])
                                                }else{
                                                    data[name] = images[selectedindex]
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
                                            onsuccess: (src) => { images.push(src) }
                                        }),
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label", "Select stage"),
                                        m(Select, {
                                            data: selectedstage,
                                            name: "num",
                                            onchange: (e) => {
                                                images = [];
                                                loadingimages =true;
                                                queryImages(selectedstage.num)
                                            }
                                        }, stages)
                                    ),

                                    m(Column, { width: '1-1' },
                                        images.length > 0 ?
                                            m(Grid,
                                                images.map((src, index) => {
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
                                    )
                                ]
                            )
                        )
                    )
                )
            ]
        }
    }
}

function LessonSlides(){
    let data,name

    function goBackForward(index, back){
        let auxarray = data[name].map((el)=> el)
        let position = index + (back ? -1 : 1)
        auxarray[position] = data[name][index] 
        auxarray[index] = data[name][position]
        data[name] = auxarray
        m.redraw()
    }


    return{
        oninit:(vnode)=>{
            data= vnode.attrs.data
            name= vnode.attrs.name
        },
        view:(vnode)=>{
            return data[name].map((item, i) => {
                return m(Column, { width: "1-4" },
                    m(LessonSlide, { data: data[name], index: i, item: item}),
                    i != 0 ? 
                    m(Button,
                     {
                         onclick:(e)=>{
                            goBackForward(i,true)
                         }
                     },
                     "Move left"
                    ) : null,
                    m(Button,
                        {
                            onclick:(e)=>{
                               goBackForward(i)
                            }
                        },
                        "Move right"
                    ),
                )
            }) 
        }
    }
}

function LessonSlide() {
    return {
        view: (vnode) => {
            let { data, item, index } = vnode.attrs
            return m(Card,
                { size: "small" },
                m(CardMedia,
                    data[index].image ? 
                    m("a.ui.red.label",{ onclick: (e) => data[index].image = '' }, "Delete image") : null,
                    m("img", {
                        src: item.image || "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg",
                        'uk-toggle': `target:#text-images${index}`,
                        style: "cursor:pointer; width:100%"
                    }),
                    
                    m(ImagePicker, { data: data[index], name: "image", id: `text-images${index}` })
                ),
                m(CardBody,
                    { style: "padding:0px" },
                    m(TextEditor, { data: data[index], name: "text", type: "textarea", rows: "10", style: "margin:0px;font-size:0.9em;padding:5px" }),
                    m("strong","Help text"),
                    m(TextEditor, {data:data[index], name:'help'}),
                    m("div", { style: "position:absolute;right:5;top:5" },
                        m("a", { 'uk-icon': 'icon:trash', style: "color:red", onclick: (e) => data.splice(index, 1) })
                    ),
                ),
                m(Button,{style:"color:red",onclick:(e)=> data.splice(index, 1)}, "DELETE")
            )
        }
    }
}

function MeditationSlide() {
    function SwitchType() {
        let types = {
            'image': () => m(Image),
            'text': () => m(Text, { type: "text" }),
            'title': () => m(Text, { type: "title" }),
            'html': ()=> m(TextEditor,{data:object, name:'html'})
        }
        let editing = true
        let object = {}

        function Text() {
            return {
                view: (vnode) => {
                    return editing ? m(TextField, { data: object, name: vnode.attrs.type, type: "textarea", rows: vnode.attrs.type == 'text' ? "6" : '3' }) : null
                }
            }
        }

        function Image() {
            let id = Math.floor(Math.random() * 100)
            return {
                view: () => {
                    return editing ? [
                        m("img", {
                            src: object.image || "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg",
                            'uk-toggle': `target:#medit-image${id}`,
                            style: "cursor:pointer"
                        }),
                        m(ImagePicker, { data: object, name: "image", id: `medit-image${id}` })
                    ]
                        :
                        null
                }
            }
        }

        return {
            view: (vnode) => {
                object = vnode.attrs.data[vnode.attrs.name]
                return m(Card,
                    m(CardBody, { style: "padding:0px" },
                        Object.keys(object).map((key) => {
                            return types[key] ? types[key]() : ''
                        })
                    )
                )
            }
        }

    }

    
    return {
        oninit:(vnode)=>{
            let {data,name} =  vnode.attrs


        },
        view: (vnode) => {
            let { data, name } = vnode.attrs
            return [
                //ESTO SE PODRÍA MEJORAR !!
                m(Select, { data: data, name: name },
                    [
                        { 'label': 'text', value: { 'text': data[name]['text'] || '', 'type': "text" } },
                        { 'label': 'title_text', value: { 'title': data[name]['title'] || '', 'text': data[name]['text'] || '', 'type': "title_text" } },
                        { 'label': 'title_image', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'type': "title_image" } },
                        { 'label': 'image', value: { 'image': data[name]['image'] || '', 'type': "image" } },
                        { 'label': 'image_text', value: { 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type': "image_text" } },
                        { 'label': 'title_image_text', value: { 'title': data[name]['title'] || '', 'image': data[name]['image'] || '', 'text': data[name]['text'] || '', 'type': "title_image_text" } },
                        { 'label': 'video', value: { 'video': '', 'type': "video" } },
                        { 'label': 'video_text', value: { 'video': '', 'text': data[name]['text'] || '', 'type': "video_text" } },
                        { 'label': 'html', value: { 'html':  data[name]['html'] || ''}},
                        { 'label': 'image_html', value: {'image':'','html': data[name]['html'] || ''}}
                    ]
                ),
                data[name] ? m(SwitchType, { data: data, name: name, editing: true }) : null,
                m(Button,{style:"color:red", onclick:(e)=> { delete data[name]}}, "Delete"),
                m(Button,{onclick:(e)=>{}},"RIGHT"),
                m(Button,{onclick:(e)=>{}},"LEFT")
            ]
        }
    }
}

function FollowAlongSlide(){

    return { 
        view:(vnode) => {
            let slide = vnode.attrs.slide
            let edit = vnode.attrs.edit

            return [ 
                m("strong", "Time "),
                !edit ? [m("br"),m("uk-label", slide.time)] : m(TextField, {data: slide, name:'time', type: 'time'}),
                m("br"),
                m("strong","Text "),
                !edit ? [m("br"),m("uk-label", slide.text)] : m(TextField, {data: slide, name:'text', type:'textarea', rows:5 }) 
            ]
        }
    }

}

function ContentCard(){
    let toAdd = {}


    let content = {}

    let id = Math.floor(Math.random() * 100)

    // CUANDO CLICAMOS A EDITAR SE NOS ABRE UN MODAL CON EL EDITOR

    /*
    function EditButton(){
        return{
            view:(vnode)=>{
                return [
                    m(Button,
                        {
                            'target': `#${id}`,
                            type: 'secondary'
                        },
                        'Edit' 
                    ),  
                   
                    
                ]
            }
        }
    }*/

    return {
        view:(vnode)=>{
            content = vnode.attrs.content

            return  [

                m(".uk-card.uk-card-default",{style: content.position == undefined  ? " opacity:0.5":''},
                
                    m(".uk-card-body",
                        m(Grid,{center:true, verticalalign:true, columngap:'small'},
                            m(Column,{width:'3-4'},
                                m("h4.uk-card-title", content.title),
                                m("p", content.description)
                            ),
                            m(Column,{width:'1-4'},
                                content.image  ?
                                m("img", { src: content.image || "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg", style: "width:100%" }) :null
                            )
                        )
                    ),
                    m(".uk-card-footer",
                        m("a.uk-button.uk-button-text",{
                            onclick:()=>{
                                m.route.set(`/edit_create?cod=${content.cod}`)
                            }
                        },"Edit"),
                        
                    )
                )
            ]
        }
    }
}

function UserCard(){
    return {
        view:(vnode)=>{
            let {user} = vnode.attrs
            return m(".uk-card.uk-card-default",
                user.image ?
                m("uk-card-media-top",
                    m("img", { src: user.image })
                ) : null,
                m(".uk-card-body",
                    m("h4.uk-card-title", user.nombre)
                ),
                m(".uk-card-footer",
                    m("a.uk-button.uk-button-text",{ 
                        onclick: (e) =>  alert('There is no functionality for sending messages yet')
                    },"Send Message")
                )
            )
        }
    }
}

// MUESTRA VIDEO O AUDIO !!! REALMENTE NO HACE FALTA !!
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

// Crear o editar contenido !!
function ContentEdit(){
    let content = {}

    return{
        view:(vnode)=>{
            let { id, isNew} = vnode.attrs

            content = vnode.attrs.content

            return m(Modal,
                {
                    class:'uk-modal-full',
                    id: id,
                    style:"background-color:white;display:block;",
                    center:true,
                },
                
                m("button.uk-modal-close-full.uk-close-large", { 'uk-close': '', 'id': 'closemodalmed', style:"position:fixed;top:15px;right:15px;"}),
                
                m(Grid,{center:true,verticalalign:true, style:"width:100%;"},
                    m(Column,{width:'1-3'},
                        m(Padding,
                            m("img",{style:"width:100%; border-radius:10px", src: './assets/buddha-sharing.webp'})
                        )
                    ),

                    m(Column,{width:'2-3'},
                        m(Header2, "Create Content"),
                        m(SubHeader, "Add content inside the app. It can be a meditation practice, a lesson, a video, an article or a recording."),
                        m(Form,
                            m(Grid,
                                m(Row,
                                    m(FormLabel, "Title"),
                                    m(TextField, { type: "input", data: content, name: "title" })
                                ),
                                m(Row,
                                    m(FormLabel, "Description"),
                                    m(TextField, { type: "input", data: content, name: "description" })
                                ),

                                m(Column,{width:'1-3'},
                                    m(FormLabel,"Type"),
                                    m(Select,{data:content,name:'type'},types)
                                ),
                                
                                m(Column, { width: '1-3' }, 
                                    m(FormLabel, "Stage"),
                                    m(Select,
                                        { data: content, name: "stagenumber" },
                                        stagenumbers
                                    )
                                ),

                                content.type.match('meditation-practice|recording|video') ?
                                m(Column, { width: '1-4' },
                                    m(FormLabel, "Duration (MINUTES)"),
                                    m(TextField,
                                        {
                                            data: content, name: "duration", type: "number"
                                        }
                                    )
                                ) : null,
                                )
                            ), 
                                            
                        m("div",{style:"height:20px"}),
                        m(Button, {
                            style:"margin-right:20px",
                        
                            type:"primary",
                            onclick: (e) => {

                                if(!content.title){
                                    errorAlert({'title':'Title is required'})
                                    return
                                }

                                if(!content.description){
                                    errorAlert('Description is required')
                                    return
                                }

                                if(isNew){
                                    content.cod = create_UUID();
                                  
                                    
                                    if(json.stagenumber == 'none'){
                                        json.stagenumber = 'none'
                                    }else{
                                        json.stagenumber = Number(json.stagenumber)
                                    }



                                    json.createdBy = user.codUser
                                    
                                    addContent(json);
                                    document.getElementById('closemodalmed').click();
                                    
                                    m.route.set(`/editcontent/${json.cod}`)

                                    json = {
                                        'cod': '',
                                        'title': '',
                                        'description': '',
                                        'image': '',
                                        'duration': 1,
                                        'stagenumber': 1,
                                        'type': 'meditation-practice',
                                        'content': {}
                                    }
                                }
                            }
                        },
                        "Create"),

                        m(Button,{
                            type:'secondary',
                            onclick:(e)=>{
                                document.getElementById('closemodalmed').click();
                            }
                        }, "Cancel")
                    ),
                    
                ),
            )


        }
    }
}

// SE PODRÍA QUITAR ESTA FUNCIÓN
function AddContent(){
    let json = {
        'cod': '',
        'title': '',
        'description': '',
        'image': '',
        'duration': 1,
        'stagenumber': 1,
        'path':'',
        'type': 'meditation-practice',
        'content': {}
    }

    let step = 1
    let showModal = false;

    return {
        view: (vnode) => {
            
            return [
                    
                /*
                m(ContentEdit,{
                    content:json,
                    isNew: true,
                    id: "modal-content",
                })*/
            ]
        }
    }
}

// ESTO TIENE QUE  SER ADDCOURSE !!!!!!
function AddPath() {
    //  UN  PATH PUEDE TENER UNA IMAGEN ??
    let json = {
        'cod': '',
        'title': '',
        'description': '',
        'image': '',
    }

    let step = 1

    return {
        view: (vnode) => {
            let {coduser}  = vnode.attrs

            return [
                m(Button,
                    {
                        type: vnode.attrs.type,
                        'target': '#modal-path',
                    },
                    "Course"),
                m(Modal,
                    {
                        id: "modal-path",
                        center: true
                    },
                    m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'close-modal-path' }),
                    m(".uk-modal-header", m(".uk-modal-title", "Add Course")),
                    m(".uk-modal-body",
                        m("p", { style: "text-align:center" }, "Input basic information"),
                        m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                            m(Row,
                                m("label.uk-form-label", "Title"),
                                m(TextField, { type: "input", data: json, name: "title" })
                            ),
                            m(Row,
                                m("label.uk-form-label", "Description"),
                                m(TextField, { type: "textarea",rows:'3 ', data: json, name: "description" })
                            ),
                            m(Column, { width: '1-4' },
                                m("label.uk-form-label", "Image"),
                                json.image ? m("img", { src: json.image }) : null,
                                m(Button,
                                    {
                                        target: '#modal-path',
                                        type: "secondary"
                                    }, !json.image ? "Upload image" : 'Change image'),
                                m(ImagePicker, { id: "modal-path", data: json, name: "image" })
                            )
                        )
                    ),
                    m(".uk-modal-footer.uk-text-right",
                        m("button.uk-button.uk-button-primary",
                            {
                                onclick: (e) => {
                                    json.cod = create_UUID();
                                    
                                    if(coduser){
                                        json.createdBy = coduser
                                    }

                                    addPath(json);
                                    document.getElementById('close-modal-path').click();
                                    json = {
                                        'cod': '',
                                        'title': '',
                                        'description': '',
                                        'image': ''
                                    }
                                }
                            },
                            "Create" )
                    )
                )
            ]
        }
    }
}

//  UN  PATH PUEDE TENER UNA IMAGEN ??
function AddCourse() {
    let json = {
        'cod': '',
        'title': '',
        'description': '',
        'image': '',
        'startDate':'',
        'endDate':'',
        'price':''
    }

    let step = 1

    return {
        view: (vnode) => {
            let {coduser}  = vnode.attrs

            return [
                m(Button,
                    {
                        'target': '#modal-course',
                    },
                    "Course"),
                m(Modal,
                    {
                        id: "modal-course",
                        center: true
                    },
                    m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'close-modal-course' }),
                    m(".uk-modal-header", m(".uk-modal-title", "Add Course")),
                    m(".uk-modal-body",
                        m("p", { style: "text-align:center" }, "Input basic information"),
                        m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                            m(Row,
                                m("label.uk-form-label", "Title"),
                                m(TextField, { type: "input", data: json, name: "title" })
                            ),
                            m(Row,
                                m("label.uk-form-label", "Short description"),
                                m(TextEditor,{ data: json, name: "description" })
                            ),
                            m(Row,
                                m("label.uk-form-label", "Long description"),
                                m(TextEditor,{ data: json, name: "longdescription" })
                            ),
                            m(Column, { width: '1-4' },
                                m("label.uk-form-label", "Image"),
                                json.image ? m("img", { src: json.image }) : null,
                                m(Button,
                                    {
                                        target: '#modal-path',
                                        type: "secondary"
                                    }, !json.image ? "Upload image" : 'Change image'),
                                m(ImagePicker, { id: "modal-path", data: json, name: "image" })
                            ),
                            m(Column, { width: '1-4' },
                                m("label.uk-form-label", "Start Date"),
                                m(TextField,{type:'date',data:json,name:'startDate'})
                            ),
                            m(Column, { width: '1-4' },
                                m("label.uk-form-label", "End Date"),
                                m(TextField,{type:'date',data:json,name:'endDate'})
                            ),

                            m(Column, { width: '1-4' },
                                m("label.uk-form-label", "Price (€) "),
                                m(TextField,{data:json,name:'price', type:'number'})
                            ),
                        )
                    ),
                    m(".uk-modal-footer.uk-text-right",
                        m("button.uk-button.uk-button-primary",
                            {
                                onclick: (e) => {
                                    json.cod = create_UUID();
                                    
                                    if(coduser){
                                        json.createdBy = coduser
                                    }

                                    addPath(json);
                                    document.getElementById('close-modal-course').click();
                                    json = {
                                        'cod': '',
                                        'title': '',
                                        'description': '',
                                        'image': ''
                                    }
                                }
                            },
                            "Create" )
                    )
                )
            ]
        }
    }
}

// componente de path y curso  !!
function Path(){
    let isEditing  = false;

    let path;

    function Content(){
        return {
            view:(vnode)=>{
                let {content} = vnode.attrs

                return m(".uk-card.uk-card-primary.uk-card-body.uk-light",{style:"width:100%;aspect-ratio:1/1;"},
                    m(".uk-card-title",content.title),
                    m(Button,{
                        type:'secondary',
                        onclick:(e)=>{
                            //content.pathExpanded = path
                            m.route.set(`/editcontent/${content.cod}`)
                        }
                    },"Edit"),

                    isEditing ? [
                        m("div",{style:"height:10px"}),
                        m(".uk-text-bold","Position in path"),
                        m(TextField,{data:content,name:'position',label:'position in path',type:'number'}),
                        m("div",{style:"height:10px"}),
                        m(".uk-text-bold","Duration"),
                        m(TextField,{data:content,name:'duration',type:'number'})
                    ]: null,
                )   
            }
        }
    }

    return{ 
        view:(vnode)=>{
            path = vnode.attrs.path

            if(path.content.length){
                path.content.sort((a,b)=> a.position - b.position)
            }

            return m(Row, m(".uk-card.uk-card-default.uk-card-body",
                m(".uk-card-title",isEditing ? m(TextField,{data:path,name:'title'}): path.title),
                m(Grid,
                    m(Row,isEditing ? m(TextField,{data:path,name:'description'}): path.description),
                    m(Row,isEditing ? m(TextField,{data:path,name:'isNew',type:'checkbox'}): 'is New ' + path.isNew  || 'false'   ),
                    m(Row,
                        m(Button,{
                            type:'secondary',
                            onclick:(e)=>{
                                if(isEditing){
                                    updatePath(path)
                                }
                                isEditing = !isEditing
                            }}, 
                            isEditing ? "Save":"Edit course"
                        )
                    ),
                    m(Row,
                        m(Grid,
                            path.content.map((content)=>{
                                return m(Column,{width:'1-5'},
                                    m(Content,{content:content})
                                )
                            })
                        )
                    ),
                )
            ))
        }
    }
}

function EditableField(){
    return {
        view:(vnode)=>{
            let {data,name,type, isEditing} = vnode.attrs
            // AÑADIR SUPPORT PARA HTML
            return [
                isEditing ? 
                
                type == 'html' ?
                m(TextEditor,{data:data,name:name}):
                m(TextField,{data:data,name:name,type:type}): 
                vnode.children
            ]
        }
    }
}

function ChatComponent(){
    let data = {}
    let sendMessage;
    let user;
    
    // es probable que haya que pasar el username
    function send(){
        if(data.message){
            let msg  = {
                'text':data.message, 
                cod:'', 
                sender:user.coduser,
                username:user.nombre,
                date: new Date()
            }
        
            sendMessage(msg)

            data.message = ''
        }
    }
    
    return {
        view:(vnode)=>{
            let { messages, title} = vnode.attrs

            user  = vnode.attrs.user
            sendMessage = vnode.attrs.sendMessage

            return m(".uk-card.uk-card-default",
                m(CardHeader, m(".uk-card-title", title ? title :"Chat")),
                m(CardBody,{style:"background:lightgrey;padding:0em 1em;"},
                m(".uk-overflow-auto",{style:"height:400px"},
                    m(Grid,{rowgap:'collapse'},
                        messages.map((message)=>{
                            return m(Row,
                                m(".uk-card.uk-card-default.uk-card-body",{style:"padding:1em;margin:1em;"},
                                    m(".uk-card-title",{style:"font-size:1.1em"}, message.username),
                                    m(".uk-text-meta",dia(message.date) + ' ' + hora(message.date)),
                                    m("p",message.text)
                                )
                            )
                        })
                    )
                )),
                m(".uk-card-footer",
                    m(Grid,{columngap:'collapse'},
                        m(Column,{width:'3-4'},
                            m(TextField,{
                                onkeyup:(e)=>{
                                    if(e.keyCode == '13'){
                                        send()
                                    }
                                },
                                name:'message',label:'Message',data:data,name:'message'
                            })
                        ),
                        m(Column,{width:'1-4'},
                            m(Button,{
                                type:'secondary',
                                onclick:(e)=> send()
                            },'Send')
                        )
                    )
                )
            )
        }
    }
}


function errorAlert(options={}){
    var elem = document.createElement("div")

    elem.style = 'position:fixed;inset:0px;z-index:100000'
    elem.id = Math.random()*10000 + ''

    document.body.appendChild(elem);

    
    // AÑADIR TRANSICIONES SIN SEMANTIC !!!
    m.mount(elem, {
        view:()=> m(AlertDialog,{
            title:options.title || 'Error', message:options.message, close:(e)=> {
            elem.remove()
            options.then ? options.then() :null
        }})
    })
}


function AlertDialog(){
    return {
        view:(vnode)=>{
            let {title,message, close} = vnode.attrs

            return m("uk-modal.uk-open",{style:"position:fixed;inset:0px;z-index:100000;background-color:rgba(0,0,0,0.5);"},
                m(".uk-modal-dialog.uk-margin-auto-vertical",
                    m("div",{style:"border-radius:10px;min-width: 250px;font-size:1.1em; padding:1em;background-color:white; color:black;"},
                        /*m("div",{style:"text-align:left"},
                            m(Icon,{icon:'error', color:'red',size:'large'}),
                        ),*/
                        m(Header2, title),
                        message ? m(SubHeader,{style: normaltext}, message) : null,
                        m(Button,{
                            type:'primary',
                            onclick: close
                        }, "OK"
                    )
                )
            ))
        }
    }
}

function LoginInput() {
    let types = {
        "textarea": { class: "uk-textarea" },
        "input": { class: "uk-input", type: "text" },
        "password": { class: "uk-input", type: "password" },
        "number": { class: "uk-input", type: "number" },
        'time': { class: 'uk-input', type:'time'},
        'checkbox': { class: 'uk-checkbox', type:'checkbox'},
        'date': {class:'uk-input',type:'date'}
    }
    console.log("entro")
    return {
        view: (vnode) => {
            let { data, label, id, name, type = 'input', oninput } = vnode.attrs
            return m(".input-container", [
                m("input",
                    {
                        class: type ? types[type].class + " text-input" : types['input'].class + " text-input",
                        id: id || undefined,
                        type: type ? types[type].type : 'text',
                        value: data[name],
                        width: vnode.attrs.width || undefined,
                        autocomplete: "off",
                        oninput: (e) => {
                            e.target.value != "" ? 
                                e.target.nextElementSibling.classList.add("filled") :
                                e.target.nextElementSibling.classList.remove("filled")
                            data[name] = e.target.value;
                            if (oninput) oninput(e)
                        },
                    }
                ),
                label && id ? m("label", { class:"login-label", for: id }, label) : null
            ])
        }
    }
}

export {
    MeditationSlide,
    LessonSlide,
    EditableField,
    ContentEdit,
    ImagePicker,
    ChatComponent,
    FollowAlongSlide,
    LessonSlides,
    ContentCard,
    UserCard,
    FileView,
    AddContent,
    AddPath,
    Path,
    AddCourse,
    LoginInput
};

