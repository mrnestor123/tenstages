
// METER AQUÍ TODO LO DEL MANAGEMENT DE LA APP.
// EDITAR PROFESOR, EDITAR CONTENIDO, VER CONTENIDO
import { Button, Card, CardBody, CardFooter, CardHeader, CardMedia, Column, Flex, Form, Grid, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Padding, Row, Section, Select, TextEditor, TextField, showAlert } from '../components/components.js'
import { FileExplorer, ImageSelector, showFileExplorer } from '../components/management-components.js'
import { ContentCard, EditableField, FileView, ImagePicker } from '../components/tenstages-components.js'
import { FormLabel } from '../components/texts.js'
import { create_UUID, dia, hora } from '../components/util.js'
import { addContent, addMilestone, deleteContent, getAllContent, getContentbycod, getMilestones, getTeachersContent, updateContent, updateMilestone } from '../server/contentController.js'
import { getRequests, postRequest, updateRequest } from '../server/server.js'
import { getUser, getUserActions, User } from '../server/usersController.js'
import { Content, stagenumbers, types} from '../server/contentController.js'



function EditCreateContent() {
    let content = {}
    let editar = false;
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let uploading = false;

    let showing = 0;
    let basic_info = 0;
    let texts = 1;
    let file = 2;
    let article_texts = 3;
    let savedTexts = 4;

    //para cuando creamos un componente
    let json = {
        'cod': '',
        'title': '',
        'description': '',
        'image': '',
        'duration': 1,
        //'stagenumber': 1,
        'path':'',
        'type': 'meditation-practice'
    }

    let isNew = false;

    function File(){
        return {
            view:(vnode)=>{
                // ARREGLAR ESTO !!!
                content.content =  null

                return [
                    m(FormLabel, "Add a file to this content"),
                    m("button.uk-button.uk-button-default", { 
                        onclick: () => { showFileExplorer({'type':  content.type == 'video' ?  'video' : 'audio', data:content, name:'file'}); 
                    }}, content.file ? "CHANGE FILE": "ADD FILE"),


                    content.file
                    ?  m("div",
                            m(FileView,{file:content.file,key:uploading ? 0 : 1,style: "width:50vw;height:200px;"})
                        ) 
                    : null,
                    
                    m("div",{style:"height:20px"}),

                ]
            }
        }
    }

    // SE HA PERDIDO LA FUNCIONALIDAD PARA LOS JUEGOS
    // añadir !!!
    function GameContent() {
        return {
            view:(vnode) => {
                return [ 
                m(Column, {width: '1-2'},
                    m("video", {src: content.video, 'controls': true})
                ),
                m(Column, {width: '1-1'}, 
                    m("ul.uk-list.uk-list-divider",
                    content.questions.map((question,index) => {
                        if(!question.key){
                            question.key = create_UUID()
                        }
                        
                        return [
                            m("li",
                                m("strong","Question"),
                                m("br"),
                                !editar ?  m("label", question.question) : m(TextField, {data:question, name:'question'}),
                                m("br"),

                                m("strong","Answers"),                               
                                m(Grid, {rowgap:'small'},
                                question.options ? 
                                    question.options.map((option,index) => {
                                        return [ 
                                            !editar ? 
                                            m(Column , {width:'1-4'},
                                                m("label",{style: index == question.answer ? 'color:green;font-weight:bold': ''},   option ? option : ' to do')
                                            ) 
                                            : 
                                            [
                                                m(Column, {width:'1-2'},
                                                    m(TextField, {data: question.options, name: index}),
                                                ),
                                                m(Column,{width:'1-4'},
                                                    question.image  
                                                    ?  m("img",{src:question.image, style:"width:50%;height:auto"})
                                                    :m(ImagePicker,{
                                                        data:question,
                                                        name:'image',
                                                        id:'question-images'
                                                    }),
                                                    
                                                    m(Button,
                                                        {
                                                            target: '#question-images',
                                                        }, 
                                                        !question.image ? "Add image" : 'Change image'),
                                                ),
                                                m(Column, {width:'1-4'}, 
                                                question.answer != index ?
                                                    m(Button, {
                                                    onclick:(e) => {
                                                        question.answer = index
                                                    }
                                                }, "Select") : null
                                                )
                                            ]
                                        ]
                                    }) : null
                                ),

                                editar ? [
                                    
                                    m("div.uk-width-1-3@m", 
                                        {   
                                            style:"cursor:pointer;color:red", 
                                            onclick:(e) => {content.questions.splice(index,1)}
                                        }, 
                                    "Dlt question"),
                                        
                                    m("div.uk-width-1-3@m", 
                                    {   
                                        style:"cursor:pointer;color:blue", 
                                        onclick:(e) => {question.options.push('Answer')}
                                    }, 
                                    "Add answer"),

                                    m("div.uk-width-1-3@m", 
                                    {   
                                        style:"cursor:pointer;color:red", 
                                        onclick:(e) => {
                                            console.log('deLeting answers')
                                            question.options.pop()
                                        }
                                    }, 
                                    "Delete last answer")
                                ] : null, 
                            ),                     
                        ]
                    }),

                    editar ? 
                    m("a.uk-width-1-1@m",
                            {
                                'uk-icon': 'icon:plus',
                                style:"margin-bottom:10px;",
                                onclick: (e) => {
                                    if(!content.questions){
                                        content.questions = []
                                    }
                                    content.questions.push({'question':'','answer':0, 'options': []})
                                }
                            },
                            "Add question"
                        ) : null
                    ) 
                )
                ]
            }
        }
    }

    function ImageSelector(){
        return{
            view:(vnode)=>{
                let {data,name, onselect, height} = vnode.attrs

                return [
                    m("div",{
                        style:`
                            position:relative; 
                            width:100%;
                            max-width:100%;
                            max-height:100%;
                            height:${height ? height : '300px'};
                            background-repeat:no-repeat;
                            background-image:url(${data && name && data[name] ? data[name] : './assets/buddha-sharing.webp'});
                            background-size:${data && name && data[name] ? 'contain':'cover'};
                            background-position:center;
                            border-radius:10px;
                            cursor:pointer;`,
                        
                        onclick:(e)=>{
                            showFileExplorer({'type': 'image', data:data, name: name})
                        }},
                        m("div",{
                            style:"position:absolute;inset:0px;border-radius:10px;background:rgba(0,0,0,0.5);opacity:0.7;display:flex;justify-content:center;align-items:center;",
                        },m("p",{style:"color:white;text-align:center;"},
                            "Press to change the image of the content"
                        ))
                    ),
                ]
            }
        }
    }

    function BasicInfo(){


        let categories = [
            'meditation',
            'mind',
            'philosophy',
            'science'
        ]

        return {
            view:(vnode)=>{
                return m(Grid,
                    m(Column,{width:'2-5'},m(Padding,m(ImageSelector,{data:content, name:'image'}))),

                    m(Column,{width:'3-5'},
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

                                m(Column,{width:'1-3'},
                                    m(FormLabel,"Position in path"),
                                    m(TextField, { type: "number", data: content, name: "position" }),
                                    content.position != undefined ?
                                    m(Button,{type:'danger', onclick:(e)=>{
                                        delete content.position
                                        deleteContentPosition(content)
                                    }}, "DELETE") : null
                                ),
                            
                                m(Column, { width: '1-3' }, 
                                    m(FormLabel, "Stage"),
                                    m(Select,{ data: content, name: "stagenumber" },
                                        stagenumbers
                                    )
                                ),


                                
                                content.type.match('lesson') ?
                                m(Column, { width: '1-3'}, 
                                    m(FormLabel, "AppCategory"),

                                    m(Select,{ data: content, name: "category" },
                                        categories
                                    )
                                )
                                : null, 


                                //  AÑADIR SECCIÓN AL CONTENIDO !!
                                content.type.match('meditation-practice|recording|video') ?
                                m(Column, { width: '1-4' },
                                    m(FormLabel, "Duration (MINUTES)"),
                                    m(TextField,
                                        {
                                            data: content, name: "duration", type: "number"
                                        }
                                    )
                                ) : null,
                                
                                
                                
                                content.stagenumber == 'none' ?  
                                m(Column, { width: '1-4' },
                                    m(FormLabel, "Position"),
                                    m(TextField,{data:content,name:'position',type:'number'})
                                ):null
                                
                                )
                            ), 
                                            
                        m("div",{style:"height:20px"}),
                    )
                )
            }
        }
    }

    function Texts(){
        
        let page = 0
    
        let pages = 1;

        function Slide() {

            let showingBasicInfo = true;
            
            return {
                view: (vnode) => {
                    let { data, item, name, index } = vnode.attrs
    
                    return m(Card, { size: "small" },
                        m(CardMedia,
                            data[name].image ? 
                            m("a.ui.red.label",{onclick:(e)=>data[name].image = ''},"Delete  image"):null,
                            
                            m(ImageSelector, {height:'200px',  data:data[name], name:'image', id:`#slide-images${name}`}),
                        ),
                        m(CardBody, { style: "padding:0px" },
                            m("ul.uk-tab",
                                m("li",{class: showingBasicInfo ? 'uk-active':'', onclick:(e) => showingBasicInfo =true},m("a","Text")),
                                m("li",{class: !showingBasicInfo ? 'uk-active':'', onclick:(e) => showingBasicInfo = false}, m("a","Help text"))
                            ),
                            data[name] && data[name].text ?
                            m("p", data[name].text.length) : null,


                            showingBasicInfo ? [
                                data[name] && data[name].image ? [
                                    m(FormLabel, "Color (hexadecimal, is for the image)"),
                                    m(TextField,{data:data[name], name:'imagecolor'})
                                ]:null,
                                m(TextEditor, { data: data[name], name: "text", type: "textarea", rows: 6})   
                            ]:
                            m(TextEditor, {data:data[name], name:'help',rows:6}),
                            
                        ),
                        m(CardFooter,
                            m(Button,{
                                onclick:(e)=> {
                                    data.splice(name, 1)
                                    pages = Math.ceil(content.text.length / 3) || 1
                                    page=0
                                    console.log('p',pages,page)
                                }, size:'small'
                            },  m(Icon,{color:'red', icon:'delete'})),

                            

                            m(Button, {
                                style:"margin-left:5px",
                                width:'1-3',
                                size:'small',
                                onclick: (e) => {
                                    if (name > 0) {
                                        let aux = data[name - 1]
                                        data[name - 1] = data[name]
                                        data[name] = aux
                                    }
                                }
                            }, m(Icon,{icon:'chevron_left'})),

                            m(Button, {
                                size:'small',
                                width:'1-3',
                                onclick: (e) => {
                                    if (name < data.length - 1) {
                                        let aux = data[name + 1]
                                        data[name + 1] = data[name]
                                        data[name] = aux
                                    }
                                }
                            }, m(Icon,{icon:'chevron_right'})),


                            m(Button,{
                                onclick:(e)=> {
                                    content.text.splice(index, 0, { 'text': 'Edit this text', 'image': "" });
                                }, size:'small'
                            },  "Add slide left"),

                            m(Button,{
                                onclick:(e)=> {
                                    content.text.splice(index+1, 0, { 'text': 'Edit this text', 'image': "" });
                                   
                                }, size:'small'
                            },  "add slide right"),
                        )
                    )
                }
            }
        }
        let texts = []

        return {
            oninit:(vnode)=>{
                // PARA UNIFICAR EL MODELO !!!
                if(content.content && !content.text){

                    if(!content.text){
                        content.text = []
                    }

                    Object.keys(content.content).map((key)=>{
                        content.text.push(content.content[key])
                    })
                }

                if(content.text && content.text.length){
                    pages = Math.ceil(content.text.length / 4)
                }
            },
            view:(vnode)=>{
                if(showing ==  savedTexts){
                    texts = content.copiedText[0]

                }else{
                    texts = content.text
                }

                console.log('content',  texts)

                return [
                    m(Grid, [
                        m(Row,
                        m("div",{style:"display:flex;flex-direction:row; align-items:center; width:100%;"},
                            m(Button,{
                                style:"width:150px;margin-right:10px;",
                                type:'default',
                                onclick:(e)=>{
                                    if(!content.text){
                                        content.text = []
                                    }
                                    
                                    texts.push({ 'text': 'Edit this text', 'image': "" })         
                                
                                    pages = Math.ceil(texts.length / 3)
                                }
                            }, "Add slide"),   
                            m(FormLabel, {style:"margin-top:15px"},
                                content.type == 'lesson' ?
                                "Add slides to the lesson":
                                `Add Text before the ${content.type == 'recording' ? 'recording': content.type =='meditation-practice' ? 'meditation':'video'}. 
                                You can also add images inside the text`
                            ),
                        )),
                            
                        texts ? [
                            // CAMBIAR ESTO POR NAVIGATION
                            pages > 1  ? m(Row, m("ul",{class:"uk-dotnav"},
                            Array.from(Array(pages).keys()).map((k,i)=>{
                                return m("li", {
                                        class: i == page ? 'uk-active':'',
                                        onclick:(e)=>{
                                            page = i 
                                        }
                                    },
                                    m("a",{})
                                )})
                            )):m(Row),

                            texts.slice(page*4, (page*4)+4).map((key,i) => {
                                return m(Column, { width: '1-4' },
                                    m(Slide, { data: texts, name: i+(page*4), index: i + (page*4)})
                                )
                            })
                        ] : null  
                ])
                ]
            }
        }
    }

    function ArticleTexts(){
        return {
            view:(vnode)=>{
                return [
                    m(FormLabel, "Body"),
                    m(TextEditor,{
                        data:content,
                        name:'body',
                        rows: 20
                    })
                ]
            }
        }
    }

    return {
        oninit: (vnode) => {
            if(vnode.attrs.cod){
                getContentbycod(vnode.attrs.cod).then((res) => {
                    content = res;
                    console.log('content',content)
                    m.redraw()
                })
            }else{
                isNew = true
                content = json
            }

            if(vnode.attrs.week){
                json.week = vnode.attrs.week
            }

            if(vnode.attrs.section){
                json.section = vnode.attrs.section
            }
            // ESTO YA NO HACE FALTA !!
            //getUsers().then((res) => {
              //  teachers = res.filter((User)=> User.role == 'teacher');
            //})
        },
        view: (vnode) => {
            return content.cod || isNew ? [
                m(Section, {style:"margin-bottom:20px;"},
                    m(Grid,
                        m(Column,{width:'1-6'},
                            m("ul.uk-tab-left",{'uk-tab':true, style:"min-height:50vh;"},
                                // link that goes to basic info and changes the showing parameter
                                m("li", { class:showing == basic_info ? 'uk-active' : '',  onclick:(e)=> {showing = basic_info}},m("a", "Basic info")),

                                // link that goes to content and changes the showing parameter
                                content.type =='article' ? 
                                m("li", {
                                        class:showing == article_texts ? 'uk-active' : '', 
                                        onclick:(e)=> {showing = article_texts}
                                    },m("a", "Write article")
                                )
                                : [
                                
                                    m("li", {class:showing == texts ? 'uk-active' : '', onclick:(e)=> {showing = texts}},m("a", "Write text")),


                                    m("li", {class:showing == savedTexts ? 'uk-active' : '', onclick:(e)=> {showing = savedTexts}},m("a", "Saved text")),


                                    
                                    content.type == 'lesson' ? null  :
                                    m("li", {class:showing == file ? 'uk-active' : '', onclick:(e)=> {showing = file}},m("a", "Add File")),
                                ]
                            )
                        ),
                        m(Column,{width:'5-6'},
                            showing == basic_info ?
                            m(BasicInfo): 
                            showing == texts ? 
                            m(Texts):
                            showing == savedTexts ?
                            m(Texts) :
                            showing == article_texts ?
                            m(ArticleTexts):
                            m(File)
                        ),
                        m("div",{style:"height:200px"}),
                    ),
                ),

                m(Section,{style:"position:fixed;bottom:0px;left:0px;right:0px;padding:2em;display:flex;justify-content:end; align-items:end;", type:'secondary'},
                    m(Button,{
                        type:'secondary',
                        style:"min-width:200px",
                        onclick:(e)=>{
                            if(isNew){
                                m.route.set('/content')
                            }else{
                                window.location.reload()
                            }
                        }
                    }, "Cancel"),
                    !isNew ?
                    m(Button,{
                        type:'danger',
                        style:"min-width:200px;margin-left:1em;",
                        onclick:(e)=>{
                            if(confirm('Are you sure you want to delete this content?')){
                                deleteContent(content)
                            }
                        }
                    }, "Delete") : null,
                
                    !isNew &&  content.type == 'lesson' ?
                    m(Button, {
                        style:"margin-right:20px;color:white;background-color:gray;margin-left:20px;min-width:200px;",
                    
                        type:"primary",
                        onclick: (e) => {
                            if(!content.copiedText){
                                content.copiedText ={}
                            }


                            content.copiedText[Object.keys(content.copiedText).length] = content.text

                            updateContent(content); 
                        }
                    }, "Save a copy"):null,

                    m(Button, {
                        style:"margin-right:20px;color:white;background-color:#1e87f0;margin-left:20px;min-width:200px;",
                    
                        type:"primary",
                        onclick: (e) => {

                            if(!content.title){
                                showAlert({title:'Title is required'})
                                return
                            }

                            if(!content.description){
                                showAlert({title:'Description is required'})
                                return
                            }

                            if(isNew){
                                content.cod = create_UUID();
                            
                                
                                if(json.stagenumber == 'none'){
                                    json.stagenumber = 'none'
                                }else{
                                    json.stagenumber = Number(json.stagenumber)
                                }



                                json.createdBy = User.coduser
                                
                                addContent(json);
                                //document.getElementById('closemodalmed').click();
                                
                                //m.route.set(`/editcontent/${json.cod}`)


                                isNew = false;

                                json = {
                                    'cod': '',
                                    'title': '',
                                    'description': '',
                                    'image': '',
                                    'duration': 1,
                                    'stagenumber': 1,
                                    'type': 'meditation-practice'
                                }

                            }else{

                                updateContent(content); 
                            }
                        }
                    },
                    isNew ? "Create" : 'Save'),
                
                )
            ]  : null

            /*
            return content.title ?
                m(Padding,   
                m("article.uk-article",
                    m("h1.uk-article-title",
                        !editar ? content.title : m(TextField, { type: "input", data: content, name: "title" }),
                        !editar ? 
                        m("button.uk-button", {
                            style:"background-color:green; color:white",
                            'uk-icon': 'icon:file-edit', 
                            onclick: () => editar = !editar },
                            "Edit"
                        ) : [
                        User.role == 'admin' ?
                        m("button.uk-button",
                            {
                                style:"color:white;background-color:red;margin-top:15px;margin-right:20px;",  
                                onclick:(e)=>{
                                    if(confirm('You are going to delete. Are you sure?')){
                                        deleteContent(content)
                                        m.route.set('/management')
                                    }
                                }
                            },
                            "Delete"
                        ) : null,
                        m("button.uk-button.uk-button-secondary",
                            {
                                style: "margin-top:15px",
                                onclick: (e) => { 
                                    updateContent(content); editar = false; 
                                }
                        },"SAVE"),
                        m("button.uk-button.uk-button-default", {
                            style: "margin-top:15px",
                            onclick: (e) => { editar = false; location.reload() }
                        }, "CANCEL")
                        ]
                    ),
                    m("p.uk-article-meta", "Id:" + content.cod),
                    m(Grid,
                        {
                            size: "medium",
                            center: true
                        },
                        m(Column, { width: '1-4' },
                        !editar ? m(".uk-text-lead", content.description) : 
                        [
                            m(".uk-text-bold", "Description"),
                            m(TextField, { type: "input", data: content, name: "description", width: '1-2' })
                        ],
                        ),
                        content.path ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Path'),
                            m(".uk-text-bold", content.path.title)
                        ) :
                        [
                            m(Column, { width: '1-4' },
                                m(".uk-text-bold", 'Stage'),
                                m(Select, { 
                                    data: content, 
                                    name: 'stagenumber', 
                                    onchange: (e) => content.stagenumber = Number(e.target.value)
                                }, stages)
                            ),

                            m(Column, { width: '1-4' },
                                m(".uk-text-bold", '¿Is new Content?'),
                                m("div",{style:"height:20px"}),
                                m(TextField, { 
                                    type:'checkbox',
                                    data: content, 
                                    name: 'isNew'
                                }, stages)
                            )
                        ],

                        content.type != 'meditation-game' ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Type'),
                            m(Select, { data: content, name: 'type' }, types),
                            content.type == 'meditation-practice'  || content.type == 'recording' || content.type =='video' ? [ 
                                m(".uk-text-bold","Duration (minutes)"),
                                m(TextField,{type:'input',data:content,name:'duration'}),
                            ]: null,
                        ) : null,

                        content.type == 'meditation-practice' || content.type =='video' ? 
                        m(Column, { width: '1-4' },
                            m(".uk-text-bold", 'Created by'),
                            !editar ? m(".uk-text-bold",content.createdBy || 'no one'):
                            m(Select, { data: content, name: 'createdBy' }, 
                            teachers.map((teacher)=>{ return{'label':teacher.nombre,'value':teacher.coduser}})
                            ),
                        ):null,

                        
                        content.type != 'meditation-game' ? 
                        m(Row,
                            editar ? [
                                m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById(`meditation-file-chooser`).click(); }}, 
                                uploading ?  m("div",{"uk-spinner":''}) :
                                content.file ? "CHANGE FILE": "ADD FILE"),
                                m(FileUploader, {
                                    data: {},
                                    path:content.path ? content.path.title : 'dynamicfiles',
                                    onupload:() => uploading = true,
                                    Dstage: content.stagenumber,
                                    name: "file",
                                    id: `meditation-file-chooser`,
                                    onsuccess: (src) => { 
                                        uploading = false;
                                        content.file = src;
                                        m.redraw(); 
                                    }
                                }),
                            ]: null,

                            content.file ?  m("div",m(FileView,{file:content.file,key:uploading ? 0 : 1,style: "width:50%;height:200px;"})) : null
                            
                        ): null,


                        m(Column, { width: "1-4" },
                            m(Card,
                                m(CardMedia,
                                    m("div",
                                        {
                                            'uk-toggle': `target:#text-images-slider`,
                                            style: "cursor:pointer"
                                        },
                                        content.image ? m("img", { src: content.image }) :
                                            m("div", { style: "min-height:200px;display:flex;justify-content:center" }, "Click to add an image")
                                    ),
                                    m(ImagePicker, { data: content, name: "image", id: `text-images-slider` })
                                ),
                                m(CardBody,
                                    m(".uk-text-bold", content.title.toUpperCase())
                                )
                            )
                        ),
                                    
                                                
                    )
                )
                 ) :
                null*/
        }
    }
}

function errorPageComponent() {

    return {
        view: () => {
            return m("h1", "Error")
        }
    }
}

// ESTO no necesita el USER
function ProfileView(){
    let User = {}
    let loaded = false
    
    let issues = []
    let suggestions = []
    let selectedrequest = {}
    let userfromselreq = {}

    let adding = ''

    let showing = 'data';

    let actions = new Array

    function UserData(){

        function DataCard(){
            return {
                view:(vnode) => {
                    let {header,number,sentence,icon} = vnode.attrs
                    
                    return m(Card,
                        m(CardBody, 
                            m(Grid,
                                m(Row,
                                    m("span",{
                                        style: `font-family: system-ui;
                                        font-size: 19px;
                                        font-style: normal;
                                        font-weight: 700;
                                        line-height: 35px;
                                        letter-spacing: 0em;
                                        text-align: left;
                                        `}, header.toUpperCase()),
                                ),
                                m(Column, {width:'2-3'},
                                    icon ?
                                    m("i",
                                        {
                                            style:"font-size:40px",
                                            class: 'material-icons'
                                        },
                                        icon
                                    ) :
                                    m("span",{
                                        style:"color:grey"
                                    }, sentence)
                                ),
                                m(Column,{width:'1-3'},
                                    m("div",{
                                        style:`
                                        font-family: system-ui;
                                        font-size: 50px;
                                        font-style: normal;
                                        font-weight: 700;
                                        line-height: 52px;
                                        letter-spacing: 0em;
                                        text-align: right;
                                    `}, number)   
                                )
                            )
                        )
                    )
                }
            }
        }

        return {
            view:(vnode) => {
               return [ 
                   m(Column, {width:'1-2'},
                        m(DataCard,{header:'stage', icon:'hiking', number: User.stage.stagenumber})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Meditations completed', icon: "self_improvement",number: User.stats.total.meditaciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Lessons read', icon: "book",number: User.stats.total.lecciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Time meditated', icon: "timer",number: Math.floor(User.stats.total.tiempo / 60) + 'h'})
                    )
            ]
           }
        }


    }

    //Lista de sugestiones y de issues
    function ListOfRequests(){

        return {
            view:(vnode) => {
                let {elements,issue} = vnode.attrs

                return elements.map((request)  => {
                        if(!request.votes){
                            request.votes = {}
                        }
                        return m(Column, {width:'1-1'},
                            m(Card,
                                {
                                    hover: true,
                                    style:"cursor:pointer",
                                    onclick:(e) => {
                                        selectedrequest = request
                                    }
                                },
                                m(CardBody,  
                                    m(Grid,
                                        m(Column, {
                                            width:'3-4'
                                        },
                                            m("span",{style:"font-size:1.1em;font-weight:bold;"},request.title)
                                        ),
                                        m(Column,{
                                            width:'1-4'
                                        },  
                                            m("span",
                                                m("span",{class:"material-icons"},"person"),
                                                m("span", request.username)
                                            ),
                                        )
                                    ),
                                    m("div", 
                                        {
                                            style:"position:absolute;top:0px;right:0px;padding:3.5px"
                                        },
                                        m("span",
                                                m("a",{
                                                    class:"material-icons",
                                                    style:`color:red;${request.votes[User.coduser] == -1 ? 'opacity:1;': 'opacity:0.5;'}`, 
                                                    onclick:(e) => {
                                                        if(!request.votes[User.coduser] && request.points){
                                                            request.votes[User.coduser] = -1
                                                            request.points--;
                                                        }
                                                        //si has votado positivamente
                                                        else if(request.votes[User.coduser] == 1 && request.points){
                                                            request.points--;
                                                            if(request.points){
                                                                request.points--;
                                                                request.votes[User.coduser] = -1
                                                            }else {
                                                                delete request.votes[User.coduser]
                                                            }
                                                        }
                                                        // si has votado negativamente se te quita
                                                        else if(request.votes[User.coduser] == -1){
                                                            request.points++;
                                                            delete request.votes[User.coduser]
                                                        }
                                                
                                                        updateRequest(request)
                                                    }
                                                },"arrow_downward"),
                                        ),
                                        m("span",
                                            m("a",{
                                                class:"material-icons",
                                                style:`color:green;${request.votes[User.coduser] == 1 ? 'opacity:1;': 'opacity:0.5;'}`, 

                                                onclick:(e) => {
                                                    if(!request.votes[User.coduser]){
                                                        if(!request.points){request.points = 0}
                                                        request.votes[User.coduser] = 1
                                                        request.points++;
                                                    }else if(request.votes[User.coduser] == 1){
                                                        request.points --;
                                                        delete request.votes[User.coduser]
                                                    }else if(request.votes[User.coduser] == -1){
                                                       request.points += 2
                                                       request.votes[User.coduser] = 1
                                                    }

                                                    updateRequest(request)

                                                } 
                                            },"arrow_upward"),
                                        ),

                                        m("span", {style:"font-size:1.1em"},
                                            request.points || 0
                                        )
                                    )

                                )   
                            )
                        )
                    })
            }
        }
    }

    function ModalRequest(){
        let data = {}
        return {
            view:(vnode) => {
                return m(Modal,
                    {
                        center: true,
                        id: 'modal-request'
                    },
                    m(ModalHeader,
                        "Add " +  adding
                    ),
                    m(ModalBody,
                        m(Form,
                            m(FormLabel,
                                "Title"
                            ),
                            m(TextField, { data: data, name: "title", type: "input" }),
                            
                            m(FormLabel,
                                "Description"
                            ),
                            m(TextField, { data: data, name: "description", type: "textarea", rows:'4'}),
                        )
                    ),
                    m(ModalFooter,
                        m(Button, { 
                            style: "float:right", 
                            onclick:(e) => {
                                if(confirm('You are going to post a request to the server. Are you sure?')){
                                    data.type = adding
                                    data.cod = create_UUID()
                                    data.state = 'open'
                                    data.coduser = User.coduser
                                    data.username = User.nombre
                                    data.points = 0
                                    postRequest(data)
                                }
                            }
                         }, "Send")
                    )
                )
            }
        }


    }

    function ViewRequest(){
        let startedcomment = false;
        let data = {}

        return {
            view:(vnode)=> {
                return m(Section,
                    {
                        type:'muted',
                        style:"position:relative"
                    },
                    m(Padding,
                        m("h3", 
                            selectedrequest.title,
                            m("span",{style:"font-size:0.9em;color:lightgrey"},  '  by  ' + selectedrequest.username)
                        ),
                        m(Grid,
                            m(Column,{width:'1-1'},
                                m("div", selectedrequest.description)
                                )
                            ),
                             
                            m(Column,{width:'1-1'},
                                m(TextField, {
                                    data:data,
                                    type:"textarea",
                                    rows:'4',
                                    placeholder:'Tell us what you think',  
                                    style:"margin-top:20px",                                  
                                    name:'comment',
                                })
                            ),

                            m(Column, {width:'1-3'},
                                m(Button, 
                                    {
                                        style:"background-color:blue;margin-top:5px;color:white;",
                                        onclick:(e)=> {
                                            if(data.comment){
                                                if(!selectedrequest.comments){
                                                    selectedrequest.comments = []
                                                }
                                                selectedrequest.comments.push({
                                                    'comment':data.comment,
                                                    'username':User.nombre,
                                                    'date':new Date(),
                                                    'coduser':User.coduser
                                                })
                                                data.comment = ''
                                                updateRequest(selectedrequest)
                                            }
                                        }
                                    },
                                    "Comentar"
                                )
                            ),
                            
                            selectedrequest.comments && selectedrequest.comments.map((comment)=> {
                                return m(Column,{width:'1-1'},
                                    m(Card,{style:"margin-top:10px"},
                                        m(CardBody, 
                                            comment.comment, 
                                            m("span",{style:"color:grey;font-size:1.1em"}, 'by ' + comment.username),
                                            
                                            m("span",{style:"position:absolute;top:5px;right:5px"}, )
                                        )    
                                    )
                                )
                            })
                        ),
                        m(".material-icons",
                        {
                            style:"position:absolute;top:10px;right:10px;font-size:25px;cursor:pointer", 
                            onclick:(e) => selectedrequest = {}
                        }, "close")
                )
            }
        }
    }

    function Meditations(){
        let showing


        return {
            view:(vnode)=>{
                return m(".ui.list",
                    User.meditations.sort((a,b)=> new Date(a.day)- new Date(b.day)).map((med,i)=>{
                        console.log(new  Date(med.day))
                        return m(".item",   
                            m(".content",
                                m(".description", dia(med.day) + ' ' + hora(med.day) + '  duration: ' +  med.duration)
                            )
                        )
                    }),

                    m("h2.ui.header","Actions"),
                    actions.sort((a,b)=> new Date(a.time) - new Date(b.time)).map((action)=>{
                        let a = new UserAction(action);
                        return m(".item",
                            m(".content",
                                m(".header",a.message),
                                m(".description", dia(a.time) + '  ' + hora(a.time))
                            )
                        )
                    })
                )
            }
        }
    }

    return {
        oninit:(vnode) => {
            // SOLO S I NO SE HA CARGADO EL USER !!!
            // ESTO NO HACE FALTA
            getUser(vnode.attrs.cod).then((usr) => {
                User = usr
                console.log(User, 'User')
                loaded = true
                m.redraw()
            })

            getRequests().then((res) => {
                issues = res.filter((item)  => item.type =='issue')
                suggestions = res.filter((item) => item.type =='suggestion')
            })

            getUserActions(vnode.attrs.cod).then((res)=>{
                console.log(res)
                actions = res;
                /*
                res.map((action)=>{
                    actions.push(new UserAction(action))
                })*/
            })


        },
        view:(vnode) => {
            return  m(Padding,
            loaded ? m(Grid, {
                size:'large',   
                },
                m(Column, {width:'1-3'},
                    m("img", {src:User.image, style:"width:100%;height:auto"}),
                    m(Button,
                        {
                        type:"secondary", 
                        style:"width:100%;margin:10px auto", 
                        target: '#modal-request', 
                        onclick:(e) => adding = 'issue'
                        },
                        "ADD ISSUE"
                    ),
                    m(Button,
                        {
                        type:"secondary", 
                        style:"width:100%;margin:10px auto", 
                        target: '#modal-request', 
                        onclick:(e) => adding = 'suggestion'
                        },
                        "ADD SUGGESTION"
                    ),
                    m(ModalRequest),
                    m(Button, {type:"danger",style:"width:100%;margin:10px auto", onclick:(e)=>{localStorage.removeItem('meditationcod');User ={};m.route.set('/');}}, "LOG OUT")
                ),

                selectedrequest.cod ? 
                m(Column,{width:'2-3'},
                    m(ViewRequest)
                )
                :
                m(Column,{width: '2-3'},
                    m(Grid,
                        m(Row,
                            m(".ui.secondary.pointing.menu",
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing = 'data'
                                        },
                                        class: showing == 'data' ? 'active': '',
                                    },
                                    "User Data"
                                ),
                                m("a.item",
                                {
                                    onclick:(e)=> {
                                        showing = 'meditations'
                                    },
                                    class: showing == 'meditations' ? 'active': '',
                                },
                                "Meditations and actions"
                                ),
                                /*
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing ='issues'
                                        },
                                        class: showing == 'issues' ? 'active':'',
                                    },
                                    "Issues"
                                ),
                                m("a.item",
                                    {
                                        onclick:(e)=> {
                                            showing ='suggestions'
                                        },
                                        class: showing == 'suggestions' ? 'active':'',
                                    },
                                    "Suggestions"
                                )*/
                            ),    
                        ),
                        showing == 'data' ? 
                        m(UserData) :
                        showing == 'meditations' ? 
                        m(Meditations):
                        showing == 'issues' ?
                        m(ListOfRequests, {issue: true, elements: issues})
                        : 
                        m(ListOfRequests, {issue: false, elements: suggestions})

                    )
                )
            ): null
            ) 
        }
    }
}

function ContentView(){
    let content = []
    let filter = {
        'stage':1,
        'type':'all',
        'addedToPath': false
    }

    function filterContent(c){
        
        return (!filter.addedToPath || c.position != null && c.section == null) && (c.type == filter.type || filter.type == 'all') && c.stagenumber == filter.stage
    }

    return {
        oninit:(vnode) => {
            console.log('USER', User.isAdmin())
            if(User.isAdmin()){    
                getAllContent().then((res)=>{
                    console.log('RES',res)
                    content = res.filter((c)=> c.stagenumber != null || c.createdBy != null)
                    .sort((a,b)=> a.position - b.position)
                })
            }else{
                getTeachersContent(User.coduser).then((res)=>{
                    res.sort((a,b)=>!a.position ? 1 : !b.position ? -1 : a.position -b.position)
                        .map((c)=>content.push(new Content(c)))

                    m.redraw()
                    console.log(content)
                })
            }
        },
        view:(vnode)=>{
            return [
                m(FilterContent),
                m("div",{style:"height:20px"}),
                content.length ? [
                    m("div",{style:"height:20px"}),
                    m(Section,
                        m(Grid,{match:true,columngap: 'small'},
                            content
                            .filter((c)=> filterContent(c))
                            .sort((a,b)=> a.position-b.position)
                            .map((item)=>{
                                return m(Column,{width:'1-4'},
                                    m(ContentCard,{
                                        content:item
                                    })
                                )
                            })
                        )
                    )
                ] : null,

                /*
                User.isAdmin() || true ? [
                    m("h2", "Categories"),


                    m(Section,
                        m(AddCategory),
                        m(Button,
                            {
                                'target': '#modal-category',
                                type: 'primary',
                                style:"min-width:200px;margin-left:1em;margin-bottom:1em;"
                            },
                            'Add AppCategory' 
                        ), 
                        m(Grid,{match:true, columngap: 'small'},
                            
                            
                            categories.map((category)=>{
                                return m(Column,{width:'1-3'},
                                    m(Card,{type:'secondary'},
                                        category.image ? 
                                        m(".uk-card-media-top",
                                            m("img",{src:category.image, style:"width:100%"}),
                                        ) : null,


                                        m(CardBody, 
                                            m("h4.uk-card-title", category.title),
                                            m("p", category.description)
                                        ),
                                    )
                                )
                            })
                        )
                    )
                ] : null*/


            ]
        }
    }


    function FilterContent(){
        return {
            view:(vnode)=>{
                return m(Section, {style:"padding:0px"},
                    m(Padding,
                        m("h3", "Filter content"),
                        m(Flex,{direction:'row', vAlign:'bottom'},
                            m(Flex,{direction:'column'},
                                m(FormLabel, 'Stage'),
                                m(Select,{
                                    data:filter,
                                    name:'stage',
                                }, stagenumbers),
                            ),
                            
                            m("div",{style:"width:20px"}),

                            m(Flex,{direction:'column'},
                                m(FormLabel,'Type of content'),
                                m(Select,{
                                    data:filter,
                                    name:'type'
                                }, types),
                            ),

                            m(Flex,{direction:'column'},
                                m(FormLabel,'Added to path'),
                                m(TextField,{
                                    data:filter,
                                    type:'checkbox',
                                    name:'addedToPath'
                                },"Added to path"),
                            ),

                            m("div",{style:"width:20px"}),

                            m(Button,
                                {
                                    onclick:(e)=>{
                                        m.route.set(`/edit_create`)
                                    },
                                    'target': '#modal-content',
                                    type: 'primary',
                                    style:"min-width:200px"
                                },
                                'Add Content' 
                            ),  
                            m("div",{style:"height:10px"}),
                        )
                    )
                )
            }
        }

    }


    
}

function FileExplorerPage(){
    return {
        view:(vnode)=>{
            return [
                m("div",{style:"height:20px"}),

                m(Section,{style:"padding:0px;overflow-y:auto"},
                    m(Padding, m(FileExplorer))
                )
            ]
        }
    }
}

function Milestones(){

    let milestones = []

    function AddMileStone(){

        let json = {}

        /*
        Milestone(
            title: 'Continuous attention to the breath',
            name:'continuousattention',
            description: 'The first milestone is to be able to sustain attention on the breath for a continuous period of time. This is the first step towards developing a stable attention.',
            passedPercentage: 0,
            objectives: [
              Objective(
                title: 'Establish a practice',
                description: 'Complete 21 consecutive meditations.',
                toComplete: 21,
                type: 'streak'
              ),
        
              Objective(
                title: 'Long meditations',
                description: 'Complete 4 meditations of 30 minutes or more.',
                toComplete: 4,
                metricValue: 30,
                type:'timeMetric',
                name:'longmeditations'
              ),
        
              Objective(
                type:'reportMetric',
                name:'mindwandering',
                reportType: 'percentage',
                title:'Overcome mind-wandering',
                metricValue: 70,
                description: 'Complete ten sessions with 70% of focused attention.',
                hint: 'What percentage were you focused on what you intended to?',
                metricName:'Focused attention',
                toComplete: 10
              ),
        
              Objective(
                type:'reportMetric',
                reportType: 'units',
                name:'forgetting',
                title:'Overcome forgetting',
                metricName:'Aha moments',
                hint:'How much times did you come back to the intended focus?',
                description: 'Complete ten sessions without forgetting our focus of attention more than 10 times.',
                metricValue: 10,
                toComplete: 10
              ),
            ],
            firstStage: 1,
            lastStage: 3,
            position: 1
          ),*/

        return {
            view:(vnode)=>{
                return [
                    // A MODAL WITH A BUTTON THAT OPENS IT, OPENS A FORM FOR CREATING A MILESTONE WITH TITLE,NAME, DESCRIPTION, IMAGE, AND A BUTTON TO ADD IT
                    m(Modal,{
                        id:'modal-milestone',
                    },
                        m(ModalHeader,"Add Milestone"),
                        m(ModalBody,
                            m(Form,
                                m(FormLabel,"Title"),
                                m(TextField,{data:json,name:'title',type:'input'}),
                                m(FormLabel,"Name"),
                                m(TextField,{data:json,name:'name',type:'input'}),
                                m(FormLabel,"Person"),
                                m(TextField,{data:json, name:'person',type:'input'}),
                                
                                
                                m(FormLabel,"Description"),
                                m(TextField,{data:json,name:'description',type:'textarea'}),
                                m(FormLabel,"Image"),
                                
                                json.image ? m("img",{src:json.image}): null,
                                m(Button,{onclick:(e)=> showFileExplorer({data:json,name:'image'})},"Select image"),
                                
                                m(FormLabel,"Position"),
                                m(TextField,{data:json,name:'position',type:'number'}),
                                m(FormLabel, "Starting stage"),
                                m(Select,{data:json,name:'startingStage'},stagenumbers),
                                m(FormLabel, "Ending stage"),
                                m(Select,{data:json,name:'endingStage'},stagenumbers),
                            ),
                        ),

                        m(ModalFooter,
                            m(Button,{
                                type:'primary',
                                onclick:(e)=> addMilestone(json)
                            }, "Add")
                        )

                    ),

                    m(Button,
                        {
                            'target': '#modal-milestone',
                            type: 'primary',
                            style:"min-width:200px"
                        },
                        'Add Milestone' 
                    ),


                ]
            }
        }
    }

    function MilestoneView(){

        let editing = false;

        let objectiveTypes = [
            'streak','timeMetric',
            'reportMetric','longmeditations'
        ]

        return {
            view: (vnode) => {
                let { milestone } = vnode.attrs
                /*
                *   
                *objectives: [
      Objective(
        title: 'Establish a practice',
        description: 'Complete 21 consecutive meditations.',
        toComplete: 21,
        type: 'streak'
      ),

      Objective(
        title: 'Long meditations',
        description: 'Complete 4 meditations of 30 minutes or more.',
        toComplete: 4,
        metricValue: 30,
        type:'timeMetric',
        name:'longmeditations'
      ),

      Objective(
        type:'reportMetric',
        name:'mindwandering',
        reportType: 'percentage',
        title:'Overcome mind-wandering',
        metricValue: 70,
        description: 'Complete ten sessions with 70% of focused attention.',
        hint: 'What percentage were you focused on what you intended to?',
        metricName:'Focused attention',
        toComplete: 10
      ),

      Objective(
        type:'reportMetric',
        reportType: 'units',
        name:'forgetting',
        title:'Overcome forgetting',
        metricName:'Aha moments',
        hint:'How much times did you come back to the intended focus?',
        description: 'Complete ten sessions without forgetting our focus of attention more than 10 times.',
        metricValue: 10,
        toComplete: 10
      ),
    ],
                *
                */
                return [
                    m(Card,
                        m(CardHeader,
                            m(CardMedia,m(ImageSelector, {
                                height:'200px',  
                                data:milestone, 
                                name:'image'
                            }))
                        ),
                        m(CardBody,
                            m(Grid,
                                m(Column,{width:'1-1'},
                                    m(EditableField,{data:milestone, name:'title', isEditing:editing}, m("h3",milestone.title)),

                                    m(EditableField,{data:milestone, name:'description', isEditing:editing}, 
                                        m("p", milestone.description),
                                    ),
                                    m(EditableField,{data:milestone,  name:'position', isEditing:editing}, 
                                        m("p", "Position: " + milestone.position),
                                    ),

                                    m(EditableField,{data:milestone,  name:'objective', isEditing:editing}, 
                                        m("p", "Continuous attention to the breath"),
                                    ),

                                    m(EditableField,{data:milestone, name:'person', isEditing:editing}),

                                    m(EditableField,{data:milestone,  name:'startingStage', isEditing:editing},
                                        m("span", "Starting stage: " + milestone.startingStage)
                                    ),

                                    m(EditableField,{data:milestone, name:'endingStage', isEditing:editing},
                                        m("span", "Ending stage: " + milestone.endingStage)
                                    ),

                                    
                                    milestone.objectives ?  [
                                        // A FORM FOR THIS OBJECT
                                        /**Objective(
                                            type:'reportMetric',
                                            name:'mindwandering',
                                            reportType: 'percentage',
                                            title:'Overcome mind-wandering',
                                            metricValue: 70,
                                            description: 'Complete ten sessions with 70% of focused attention.',
                                            hint: 'What percentage were you focused on what you intended to?',
                                            metricName:'Focused attention',
                                            toComplete: 10
                                        ), */
                                        milestone.objectives.map((objective,i)=>{
                                            return [
                                                m(".ui.label", i),
                                                m(EditableField,{data:objective, name:'title', isEditing:editing}),
                                                m(EditableField,{data:objective, name:'description', isEditing:editing}),
                                                m(EditableField,{data:objective, name:'type', isEditing:editing}),
                                                m(EditableField,{data:objective, name:'name', isEditing:editing}),
                                                m(EditableField,{data:objective, name:'hint', isEditing:editing}),
                                                m(EditableField,{data:objective, name:'toComplete', isEditing:editing}),

                                                objective.type.match('Metric')? [
                                                    m(EditableField,{data:objective, name:'metricValue', isEditing:editing}),
                                                ]:null,

                                                objective.type == 'reportMetric' ? [
                                                    m(EditableField,{data:objective, name:'reportType', isEditing:editing}),
                                                ] : null,
                                            ]
                                        })
                                    ]: null,

                                    m(Button,{
                                        style:"width:100%",
                                        type:"secondary",
                                
                                        onclick:(e)=>{
                                            if(!milestone.objectives){
                                                milestone.objectives = []
                                            }

                                            milestone.objectives.push({
                                                'title':'streak',
                                                'type':'metric'
                                            })
                                        }
                                    }, "Add objective"),

                                    m(Button,{
                                        onclick:(e)=>{

                                            if(!milestone.objectives) milestone.objectives = []
                                            milestone.objectives.push({

                                            })
                                        }
                                    })
                                )
                            ),
                        ),
                        m(CardFooter, 
                            m(Button,{
                                type:'secondary',
                                onclick:(e)=> {
                                    if(editing) updateMilestone(milestone)
                                    editing = !editing
                                }
                            }, editing ? 'Save' : 'Edit'),    
                        )
                        
                    )
                ]
            }
        }
    }

    return {
        oninit:(vnode) => {
            getMilestones().then((res)=> milestones= res)
        },
        view:(vnode)=>{
            return [
                m(AddMileStone),

                m(Section,
                    m(Grid,{match:true, columngap: 'small'},
                        milestones.map((milestone)=>{
                            return m(Column,{width:'1-3'},
                                m(MilestoneView,{milestone:milestone})
                            )
                        })
                    )
                )
            ]
        }
    }
}


export { ContentView, EditCreateContent, FileExplorerPage, Milestones, ProfileView }

