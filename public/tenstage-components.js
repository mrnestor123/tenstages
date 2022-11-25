
import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge,TextEditor, Modal, ModalBody, CardFooter, CardHeader } from './components.js'
import { stagenumbers, types } from './models.js';
import { getImages, deleteImage, addPath, addContent, updatePath } from './server.js'
import { FileUploader, create_UUID, isAudio } from './util.js'

//explicar como se utiliza para el futuro

// se utiliza en conjunto con button, pasarle un data y name y un id.
function ImagePicker() {
    var imagetoadd = {};
    let selectedindex;
    let selectedstage = {}
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'dynamicfiles']
    let images = []
    let rndnmb = 0

    let loadingimages = true;

    return {
        oninit: (vnode) => {
            let stagenumber = vnode.attrs.stagenumber || 1
            selectedstage.num = stagenumber
            rndnmb = Math.floor(Math.random() * 100)
        },
        view: (vnode) => {
            //podemos añadirle un loading
            return [
                m("div",
                    {
                        'uk-modal': 'stack: true',
                        class: 'uk-modal-container',
                        id: vnode.attrs.id,
                        oncreate:(vnode)=>{
                            getImages(selectedstage.num).then((res) => { 
                                images = res;
                                loadingimages = false;
                                m.redraw() 
                            });
                        }
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
                                                vnode.attrs.data[vnode.attrs.name] = images[selectedindex]
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
                                                getImages(selectedstage["num"],  selectedstage['num']=='dynamicfiles').then((res) => { 
                                                    loadingimages = false;
                                                    images = res; 
                                                    m.redraw(); 
                                                })
                                            }
                                        }, stages)
                                    ),

                                    m(Column, { width: '1-1' },
                                        images.length > 0 ?
                                            m(Grid,
                                                images.map((src, index) => {
                                                    return m(Column, { width: '1-3',onclick: (e) => selectedindex = index, style: selectedindex == index ? 'border: 2px solid lightblue' : '' } ,
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
                    m("a.ui.red.label",{onclick:(e)=>data[index].image = ''},"Delete  image"):null,

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
    let  toAdd = {}

    return {
        view:(vnode)=>{
            let {content} = vnode.attrs

           
            return  m(".uk-card.uk-card-default",{style: content.position == undefined  ?" opacity:0.5":''},
                content.image ?
                m("uk-card-media-top",
                    m("img", { src: content.image })
                ) : null,
                m(".uk-card-body",
                    m("h4.uk-card-title", content.title),
                    m("p", content.description)
                ),
                m(".uk-card-footer",
                    m("a.uk-button.uk-button-text",{ onclick: (e) =>  m.route.set('/editcontent/' + (content.cod || content.codlesson))},"Edit")
                )
            )
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


    return {
        view: (vnode) => {
            let {isTeacher,courses = [], coduser} = vnode.attrs

            return [
                m(Button,
                    {
                        'target': '#modal-content',
                    },
                    "Content"),
                m(Modal,
                    {
                        id: "modal-content",
                        center: true
                    },
                    m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalmed' }),
                    m(".uk-modal-header", m(".uk-modal-title", "Add Content")),
                    m(".uk-modal-body",
                        m("p", { style: "text-align:center" }, "Input basic information"),
                        m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                m(Row,
                                    m("label.uk-form-label", "Title"),
                                    m(TextField, { type: "input", data: json, name: "title" })
                                ),
                                m(Row,
                                    m("label.uk-form-label", "Description"),
                                    m(TextField, { type: "input", data: json, name: "description" })
                                ),
                                m(Column, { width: '1-4' },
                                    m("label.uk-form-label", "Image"),
                                    json.image ? m("img", { src: json.image }) : null,
                                    m(Button,
                                        {
                                            target: '#modal-meditationcontent',
                                            type: "secondary"
                                        }, !json.image ? "Upload image" : 'Change image'),
                                    m(ImagePicker, { id: "modal-meditationcontent", data: json, name: "image" })
                                ),

                                m(Column,{ width: '3-4' },
                                    isTeacher ? [
                                        m("label.uk-form-label", "Is it part of a course?"),
                                        m(Select,{data: json, name: 'path'},[''].concat(courses.map((path)=>{
                                            return {'label':path.title,'value':path.cod}
                                        })))
                                    ] : [
                                    m("label.uk-form-label", "Is it part of a path?"),
                                    m(Select,{data: json, name: 'path'},[''].concat(courses.map((path)=>{
                                        return {'label':path.title,'value':path.cod}
                                    }))),
                                    ]
                                ),

                                m(Column,{width:'1-4'},
                                    m("label.uk-form-label","Type"),
                                    m(Select,{data:json,name:'type'},types)
                                ),

                                
                                
                                !json.path 
                                ? [
                                    m(Column, { width: '1-4' }, 
                                        m("label.uk-form-label", "Stagenumber"),
                                        m(Select,
                                            { data: json, name: "stagenumber" },
                                            stagenumbers
                                        )
                                    ),
                                    
                                ] : null,

                                json.type.match('meditation-practice|recording|video') ?
                                m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Duration"),
                                        m(TextField,
                                            {
                                                data: json, name: "duration", type: "number"
                                            }
                                        )
                                ) : null,
                            ) 
                    ),
                    m(".uk-modal-footer.uk-text-right",
                       // step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                        m("button.uk-button.uk-button-primary",
                            {
                                onclick: (e) => {
                                  
                                    json.cod = create_UUID();

                                    if(json.path){
                                        delete json.stagenumber
                                    }else {
                                        if(json.stagenumber == 'none'){
                                            json.stagenumber = 'none'
                                        }else{
                                            json.stagenumber = Number(json.stagenumber)
                                        }
                                    }

                                    if(coduser){
                                        json.createdBy = coduser
                                    }

                                    addContent(json);
                                    document.getElementById('closemodalmed').click();
                                    console.log('added meditation !')
                                    
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
                            },
                             "Create")
                    )
                )
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

export { MeditationSlide, LessonSlide, ImagePicker, FollowAlongSlide, LessonSlides,  ContentCard , UserCard, FileView, AddContent, AddPath, Path,  AddCourse}


