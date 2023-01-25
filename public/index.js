import { getLessons, getLesson, addContent,addVersion, getImages, getStage, updateStage, getUsers, getContent, getStages, addStage, getContentbycod, updateContent, login, deleteUser, getUser, postRequest, getRequests, updateRequest, deleteContent, updateUser, getVersions, getAllContent, getSumups, addSumUp, getPaths, addPath, updatePath, getUserMessages, getStats, getUserActions, getTechniques, addTechnique } from './server.js'
import { FileUploader, create_UUID, dia, hora } from './util.js'
import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, CardHeader, Container, ModalHeader, Form, FormLabel, ModalFooter, TextEditor, Icon } from './components.js'
import { LessonSlide,LessonSlides, MeditationSlide, ImagePicker, FollowAlongSlide, ContentCard, UserCard, FileView, AddContent, AddPath, Path, AddCourse, EditableField } from './tenstage-components.js'
import { isAdmin, isGame, isLesson, isMeditation, isVideo } from './helpers.js'
import { DefaultText, Header } from './texts.js'
import { CourseEntity, types, UserAction } from './models.js'
import { EditCourse } from './tenstages-management.js'


let primarycolor = '#E0D5B6'

//  CREAR UNA CLASE USER !!!
// IMPORTANTE !!
// ESTO DEBERÍA ESTAR EN UN CONTROLADOR !!!!!!
let user = {};

function Layout() {
    let route = 'home'
    // DE MOMENTO PASAMOS EL USUARIO ASI !!!

    function LoginModal() {
        let data = {};
        let errormessage = undefined;
        
        async function log({type, email, password}){
            console.log(type,email,password)
            var result = await login({type:type, email: email, password: password})

            console.log(result, result.user)
            
            if(result.user || result.uid){
                
                let uid = result.uid || result.user.uid

                localStorage.setItem('meditationcod', uid)
             //   user  = await getUser(result.uid)
                location.reload()
            }else{
                errormessage = result;
            }
        }

        return {
            view: (vnode) => {
                return m(Modal,
                    {
                        center: true,
                        id: 'login-modal'
                    },
                    m(ModalHeader,
                        "Login"
                    ),
                    m(ModalBody,
                        m(Form,
                            m(FormLabel,
                                "Username"
                            ),
                            //m(".uk-inline",
                            //  m("span.uk-form-icon",{'uk-icon':'icon:user'}),
                            m(TextField, { data: data, name: "email", type: "input" }),
                            //),
                            m(FormLabel,
                                "Password"
                            ),
                            m(TextField, { data: data, name: "password", type: "password" }),
                            
                            errormessage ? m("div",{style:"font-size:1.1em;color:red"}, errormessage) : null,
                        )
                    ),
                    m(ModalFooter,
                        m("uk-text-left",
                            //CAMBIAR
                            //m("button", { 'uk-icon': 'facebook', onclick: (e) => log({type:'facebook'}) }),
                            m(Button, { onclick: (e) => log({type:'google'}), style:"background-color:red;color:white;font-weight:bold"}, "Login with google" )
                        ),
                        m(Button, { style: "float:right", onclick:(e) => log({type:'mail', email:data.email,password:data.password})}, "Login with MAIL")
                    )
                )
            }
        }
    }

    return {
        oninit:(vnode)=>{
            route = m.route.get().substring(1)

            if(localStorage.getItem('meditationcod')){
                //  REFACTORIZAR Y CREAR CLASE USER
                getUser(localStorage.getItem('meditationcod')).then((usr)=>{
                    if(usr){
                        console.log('got user',usr)
                        user = usr
                        m.redraw()
                    }
                })
            }
        },
        view: (vnode) => {
            return [
                m("nav.uk-navbar-container", { 'uk-navbar': '' },
                    m("nav", { 'uk-navbar': '', style: "width:100%" },
                        m(".uk-navbar-left",
                            m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages.png', style: "max-height:100px;width:auto" })),
                            m("ul.uk-navbar-nav",
                                m("li",
                                    {
                                        class: route == 'home' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'home'; m.route.set('/') }
                                    },
                                    m("a", "Home ")
                                ),
                                user.role == 'teacher' || user.role =='admin' ?
                                m("li",
                                    {
                                        class: route == 'management' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'management'; m.route.set('/management') }
                                    },
                                    m("a", "Content")
                                ) : null,

                                user.role == 'teacher' || user.role =='admin' ?
                                m("li",
                                    {
                                        class: route == 'teacher-management' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'teacher-management'; m.route.set('/teacher-management')}
                                    },
                                    m("a", "Teachers Management")
                                ) : null
                            )
                        ),
                        m(".uk-navbar-right",
                            m(".uk-navbar-item",
                                localStorage.getItem('meditationcod') ?
                                m("a.material-icons",
                                    {
                                        onclick:(e) => {
                                            m.route.set(`/profile/${localStorage.getItem('meditationcod')}`)
                                        }
                                    },
                                    'person'
                                )
                                :
                                m(Button,
                                    {
                                        type: "secondary",
                                        target: '#login-modal'
                                    },
                                    "LOGIN"
                                ),
                                m(LoginModal)
                            )
                        )
                    )
                ),

                vnode.children.map((child) => {
                    return m("main", m(Container,{size:'medium'},  [
                        m(child, vnode.attrs)
                    ] ))
                }),

                //m("footer", { style: "width:100%;background-color:black;min-height:100px;" }, "Footer")

            ]
        }
    }
}

function ContentManagement() {
    // lista con la forma 'id': lesson. TEndrá que ser CONTENT !!!
    let filter = { 'stagenumber': 1, 'type': 'techniques' }
    let stages = []
    let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

    let content = [];
    let filteredcontent = [];

    let meditations = []
    let lessons = []

    // PARA CREAR RECORDINGS Y MEDITACIONES DINÁMICAMENTE
    let paths = []
    let games = []
    let versions =[]
    let users = []
    let videos = []
    let techniques = []

    //para subir imágenes a la lección
    let index = 0;
    let json = {};

    let sumups = []

    function filtercontent(stage = 1){
        lessons = content.filter((item) => isLesson(item) && item.stagenumber == stage && (isAdmin(user) ||  item.position != null || item.createdBy == localStorage.getItem('meditationcod')))
        meditations = content.filter((item)=> isMeditation(item) && item.stagenumber == stage && (isAdmin(user) || item.position != null || item.createdBy == localStorage.getItem('meditationcod')))
        games = content.filter((item)=> isGame(item) && item.stagenumber == stage)
        videos = content.filter((item)=> isVideo(item) && item.stagenumber == stage && ( isAdmin(user) || item.position != null || item.createdBy == user.coduser))
        filteredcontent = lessons
    }

    return {
        oninit: (vnode) => {

            getAllContent().then((res)=>{
                function compare(a,b){
                    if(a.position != undefined && b.position == null){
                        return -1
                    }else if(b.position != undefined && a.position == null){
                        return 1   
                    }else{
                        return 0;
                    }
                }
        
                content = res.sort((a,b) => compare(a,b));
                filtercontent(1)
            })

            getSumups().then((res)=>{
                if(res){
                    sumups = res;
                }
            })

            getStages().then((res) => {
                stages = res;
                stages.sort((a, b) => a.stagenumber - b.stagenumber)
            });

            getTechniques().then((res)=>{
                techniques = res
            })

            getUsers().then((res) => {
                users = res;
            })

            getVersions().then((res)=>{
                versions = res;
            })

            getPaths().then((res)=>{
                paths = res;
            })
        },
        view: (vnode) => {
            return m(Padding,
                m(Grid,
                    {
                        size: "small",
                    },
                    m(Column, { width: '1-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Stage"),
                        m(Select,
                            {
                                data: filter,
                                name: "stagenumber",
                                onchange: (e) => {
                                    filtercontent(e.target.value == 'none' ? e.target.value : Number(e.target.value))
                                }
                            },
                            stagenumbers
                        )
                    ),
                    m(Column, { width: '1-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Showing"),
                        m(Select,
                            {
                                data: filter,
                                name: "type",
                                onchange: (e) => {
                                    if(filter.type == 'meditations'){
                                        filteredcontent = meditations
                                    }else if(filter.type == 'lessons'){
                                        filteredcontent = lessons
                                    }else if(filter.type == 'techniques'){
                                        filteredcontent = techniques
                                    }else if(filter.type == 'games'){
                                        filteredcontent = games
                                    }else if(filter.type == 'paths'){
                                        filteredcontent = paths
                                    }else if(filter.type == 'videos'){
                                        filteredcontent = videos
                                    }
                                }
                            },
                            user.role == 'admin' ? 
                            ['lessons', 'techniques', 'stage', 'meditations','paths','videos', 'games', 'users', 'versions'] :
                            ['lessons','techniques', 'stage','meditations','paths','videos']
                        )
                    ),
                    m(Column, { width: '3-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Add to the app"),
                        m(AddContent),
                        m(AddPath),
                        m(AddStage),
                        user.role == 'admin' ? [
                            m(AddGame),
                            m(AddVersion)
                        ]: null
                    ),


                    filter.type == 'stage' ?
                        m(StageView) :
                    filter.type == 'users' ?
                        m(UsersView):
                    filter.type == 'versions' ? 
                        m(VersionsView)
                        : 
                    filter.type == 'paths' ? 
                        m(PathsView)
                    : 
                    filter.type ==  'techniques' ?
                        m(TechniquesView):
                        [
                        filter.type !='games' ?
                        m(ViewEditSumup) : null,
                        m(ContentView, { content: filteredcontent })
                    ]
                )
            )
        }
    }


    function TechniquesView(){

        let editingindex = null;
        
        function AddTechnique(){
            let data = {}

            return {
                view:(vnode)=>{
                    return m(Modal,{id:'add-technique'},
                        
                        m(ModalHeader, "Add Technique"),
                        m(ModalBody,
                            m(Form,
                                m(Grid,
                                    m(Column,{width:'1-2'},
                                        m(FormLabel,  "Title"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'title'
                                        })
                                    ),
                                    m(Column, {width:'1-2'},
                                        m(FormLabel, "Description"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'description'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "Why do we  do it?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'why'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "What to do if distracted?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'distraction'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "When to move on?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'moveon'
                                        })
                                    ),
                                    m(Column,{width:'1-2'},
                                        m(FormLabel, "When do we return to it?"),
                                        m(TextEditor,{
                                            data:data,
                                            name:'moveon'
                                        })
                                    ),
                                    
                                )
                            )
                        ),
                        m(ModalFooter,
                            m(Button,{
                                type:'primary',
                                onclick:()=>{
                                    techniques.push(data)
                                    addTechnique(data)
                                }}
                            ,'Save')
                        )
                    )
                }
            }
        }
        
        return {
            view:(vnode)=>{
                return [
                    m(Column,{width:'1-1'},
                        
                        m("h3", "Techniques"),
                    
                        m("div", {style:"margin-bottom:20px;"}),
                    
                        m(Button,{
                            target:'#add-technique',
                            type:'secondary'
                        }, 'Add New Technique',),
                        
                        m(AddTechnique),
                    ), 
                    m(Column,{width:'1-2'},
                        techniques.map((technique,index)=>{
                            return m(Card, 
                                m(CardMedia,
                                    m("div",
                                        {
                                            'uk-toggle': `target:#text-images-slider`,
                                            style: "cursor:pointer"
                                        },
                                        technique.image ?
                                            m("img", { src: technique.image }) :
                                            m("div", { style: "min-height:200px;display:flex;justify-content:center" }, "Click to add an image")
                                    ),
                                    m(ImagePicker, { data: technique, name: "image", id: `text-images-slider` })
                                ),
                                m(CardHeader,  
                                    m("h3",technique.title),
                                    m("p", m.trust(technique.description))
                                ),

                                m(CardBody,
                                    m(Grid,
                                        m(Column,{width:'1-2'},
                                            m("h4", "Why do we do it?"),
                                            m(EditableField,{
                                                data:technique,
                                                name:'why',
                                                type:'html',
                                                isEditing: editingindex == index,
                                                }, m("p",m.trust(technique.why))
                                            )
                                        ),

                                        m(Column,{width:'1-2'},
                                            m("h4", "What to do if distracted?"),
                                            m(EditableField,{
                                                data:technique,
                                                name:'distraction',
                                                type:'html',
                                                isEditing: editingindex == index,
                                            }, m("p",m.trust(technique.distraction))),
                                        ),

                                        m(Column,{width:'1-2'},
                                            m("h4", "When to move on?"),

                                            m(EditableField,{
                                                data:technique,
                                                name:'moveon',
                                                type:'html',
                                                isEditing: editingindex == index,
                                            }, m("p",m.trust(technique.moveon))),
                                        ),

                                        m(Column,{width:'1-2'},
                                            m("h4", "When do we return to it?"),

                                            m(EditableField,{
                                                data:technique,
                                                name:'return',
                                                type:'html',
                                                isEditing: editingindex == index,
                                            }, m("p",m.trust(technique.return))),
                                        ),                                        
                                    )
                                    
                                ),
                                m(CardFooter,
                                editingindex != index ?[
                                    m("a.uk-button.uk-button-text",
                                    { 
                                        onclick: (e) => {
                                            editingindex = index
                                        }
                                    },
                                    "Edit")    

                                ] :  [

                                    // SAVE BUTTON
                                    m(Button,{
                                        onclick:(e)=>{
                                            editingindex = null
                                            updateTechnique(technique)
                                        }
                                    }, "Save")

                                ]
                                )
                            )
                        })
                    )
                ]
            }
        }
    }
    /*
    function AddLesson() {
        let step = 1;
        let text = []
        let slider = '';

        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'stagenumber': 1,
            'text': text,
            'type': 'lesson'
        }

        return {
            view: (vnode) => {
                return [
                    m("button.uk-button.uk-button-primary",
                        {
                            'uk-toggle': 'target:#modal-lesson',
                            type: "button",
                            onclick: (e) => { step = 1 }
                        },
                        "Lesson"),
                    m("div",
                        {
                            'uk-modal': '',
                            id: "modal-lesson"
                        },
                        m(".uk-modal-dialog.uk-margin-auto-vertical",
                            m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodal' }),
                            m(".uk-modal-header", m(".uk-modal-title", "Add lesson")),
                            m(".uk-modal-body",
                                    m("p", { style: "text-align:center" }, "Input basic lesson information"),
                                    m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                        m(Row,
                                            m("label.uk-form-label", "Title"),
                                            m(TextField, { type: "input", data: json, name: "title" })
                                        ),
                                        m(Row,
                                            m("label.uk-form-label", "Description"),
                                            m(TextField, { type: "input", data: json, name: "description" })

                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Image"),
                                            json.image ? m("img", { src: json.image }) : null,
                                            m(Button,
                                                {
                                                    target: '#modal-images2',
                                                    type: "secondary"
                                                }, !json.image ? "Upload image" : 'Change image'),
                                            m(ImagePicker, { id: "modal-images2", data: json, name: "image" })
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Stagenumber"),
                                            m(Select,
                                                { data: json, name: "stagenumber" },
                                                stagenumbers
                                            )
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("label.uk-form-label", "Type"),
                                           
                                        )
                                    )
                                    /*
                                    [
                                        m("p", { style: "text-align:center" }, "Write the lesson content"),
                                        m(Grid,
                                            text.length > 0 ?
                                                text.map((item, i) => {
                                                    return m(Column, { width: '1-3' },
                                                        m(LessonSlide, { data: text, index: i, item: item })
                                                    )
                                                }) : null,
                                            m(Column,
                                                {
                                                    width: '1-3',
                                                    style: "cursor:pointer",
                                                    'uk-icon': 'icon:plus',
                                                    onclick: (e) => {
                                                        text.push({ 'text': "Edit this text", 'image': '' });
                                                        m.redraw()
                                                        console.log(text);
                                                    }
                                                }
                                            )
                                        )
                                    ]
                            ),
                            m(".uk-modal-footer.uk-text-right",
                              //  step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                                m("button.uk-button.uk-button-primary",
                                    {
                                        onclick: async (e) => {
                                          
                                            console.log(json)
                                            json.cod = create_UUID();
                                            json.stagenumber = Number(json.stagenumber)
                                            addContent(json);
                                            document.getElementById('closemodal').click();
                                            m.route.set(`/editcontent/${json.cod}`)

                                            json = { 'type': 'lesson' }
                                            text = []
                                            
                                        }
                                    },
                                    "Create" )
                            )
                        )
                    )
                ]
            }
        }

    }*/

    // PASAR ADD content a otra pantalla
    function AddContent() {
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
                return [
                    m(Button,
                        {
                            'target': '#modal-meditation',
                        },
                        "Content"),
                    m(Modal,
                        {
                            id: "modal-meditation",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalmed' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Content")),
                        m(".uk-modal-body",
                            m("p", { style: "text-align:center" }, "Input basic meditation information"),
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
                                                target: '#modal-meditationimages2',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "modal-meditationimages2", data: json, name: "image" })
                                    ),

                                    m(Column,{ width: '3-4' },
                                        m("label.uk-form-label", "Is it part of a path"),
                                        m(Select,{data: json, name: 'path'},[''].concat(paths.map((path)=>{
                                            return {'label':path.title,'value':path.cod}
                                        }))),
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
                                        m(Column, { width: '1-4' },
                                            m("label.uk-form-label", "Duration"),
                                            m(TextField,
                                                {
                                                    data: json, name: "duration", type: "number"
                                                }
                                            )
                                        )
                                    ] : null
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

    function AddGame() {
        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'stagenumber': 1,
            'type': 'meditation-game',
            'video': '',
            'questions': []
        }

        let step = 1

        return {
            view: (vnode) => {
                return [
                    m(Button,
                        {
                            'target': '#modal-game',
                        },
                        "Game"),
                    m(Modal,
                        {
                            id: "modal-game",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalgame' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Game")),
                        m(".uk-modal-body",
                            step == 1 ? [
                                m("p", { style: "text-align:center" }, "Input game basic content"),
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
                                                target: '#modal-images3',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "modal-images3", data: json, name: "image" })
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Stagenumber"),
                                        m(Select,
                                            { data: json, name: "stagenumber" },
                                            stagenumbers
                                        )
                                    ),
                                    m(Column, { width: '1-4' },
                                        m("label.uk-form-label", "Video"),
                                        json.video ? m("video", { src: json.video, 'controls':true }) : null,
                                        m(Button,
                                            {
                                                target: '#modal-video',
                                                type: "secondary"
                                            }, !json.video ? "Upload video" : 'Change video'),
                                        m(ImagePicker, { id: "modal-video", data: json, name: "video" })
                                    ),
                                )
                            ] :
                                [
                                    m("p", "Input game questions"),
                                    m(Grid,
                                        json.questions.map((question, index) => {
                                          return [  
                                              m(Column,{width:'1-2'},
                                                m("label","Question"),
                                                m(TextField,{type:'input', data:question, name: 'question'})
                                            ),
                                            m(Column,{width:'1-2'},
                                                m("label","Answer"),
                                                m(TextField,{type:'input', data:question, name: 'answer'})
                                            )
                                          ]
                                        }),


                                        m(Column,
                                            {
                                                width: '1-3',
                                                style: "cursor:pointer",
                                                onclick: (e) => {
                                                    json.questions.push({ 'question': '', 'answer': '' });
                                                }
                                            },
                                            m("i",
                                            {
                                                style:"font-size:40px",
                                                class: 'material-icons'
                                            },
                                            "add"
                                            ) 
                                        )
                                    )
                                ]
                        ),
                        m(".uk-modal-footer.uk-text-right",
                            step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                        if (step == 1) { step++; index = 1; }
                                        else {
                                            json.cod = create_UUID();
                                            addContent(json);
                                            document.getElementById('closemodalgame').click();
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
                                            step = 1
                                        }
                                    }
                                },
                                step > 1 ? "Create" : "Next")
                        )
                    )
                ]
            }
        }
    }

    function AddStage() {
        let json = {
            'description': '',
            'goals': '',
            'image': '',
            'mastery': '',
            'obstacles': '',
            'skills': '',
            'stagenumber': 0,
            'path': {}
        }

        return {
            view: () => {
                return [
                    m(Button,
                        {
                            'target': '#modal-stage',
                        },
                        "Stage"),
                    m(Modal,
                        {
                            id: "modal-stage",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'modal-stage' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Stage")),
                        m(".uk-modal-body",
                            [
                                m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                                    m(Row,
                                        m("label.uk-form-label", "Description"),
                                        m(TextField, { type: "input", data: json, name: "description" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Goals"),
                                        m(TextField, { type: "input", data: json, name: "goals" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Skills"),
                                        m(TextField, { type: "input", data: json, name: "skills" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Mastery"),
                                        m(TextField, { type: "input", data: json, name: "mastery" })
                                    ),
                                    m(Row,
                                        m("label.uk-form-label", "Obstacles"),
                                        m(TextField, { type: "input", data: json, name: "obstacles" })
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label.uk-form-label", "Image"),
                                        json.image ? m("img", { src: json.image }) : null,
                                        m(Button,
                                            {
                                                target: '#image-stage',
                                                type: "secondary"
                                            }, !json.image ? "Upload image" : 'Change image'),
                                        m(ImagePicker, { id: "image-stage", data: json, name: "image" })
                                    ),
                                    m(Column, { width: '1-2' },
                                        m("label.uk-form-label", "Stagenumber"),
                                        //será un select
                                        m("select.uk-select",
                                            { onchange: (e) => json.stagenumber = Number(e.target.value) },
                                            stagenumbers.map((stage) => {
                                                return m("option", stage)
                                            })
                                        )
                                    ),

                                )
                            ],
                        ),
                        m(".uk-modal-footer.uk-text-right",
                            m("button.uk-button.uk-button-primary",
                                {
                                    onclick: (e) => {
                                        addStage(json);
                                        document.getElementById('modal-stage').click();
                                        json = {}
                                    }

                                },
                                "Create")
                        )
                    )
                ]
            }
        }

    }

    function AddVersion(){
        let json = {
            'versionNumber':'',
            'description':'', 
            'content':[]
        }

        return {
            view:(vnode)=>{
                return [
                    m(Button,
                    {
                        'target': '#modal-version',
                    },
                    "Version"),
                m(Modal,
                    {
                        id: "modal-version",
                        center: true
                    },
                    m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodal' }),
                    m(ModalHeader, m(".uk-modal-title","Add Version")),
                    m(ModalBody,
                        m("form.uk-form-stacked.uk-grid-small", { 'uk-grid': '' },
                            m(Row,
                                m(FormLabel, "VersionNumber"),
                                m(TextField,{type:'input',data:json,name:'versionNumber'})    
                            ),
                            m(Row,
                                m(FormLabel, "Description"),
                                m(TextField,{type:'input',data:json,name:'description'})    
                            ),
                            m(Row,
                                m(FormLabel, "Content"),
                                json.content.map((content)=>
                                    m(TextField,{type:'input',data:content,name:'text'})
                                ),
                                m(Button,{onclick:(e)=> json.content.push({})},  
                              
                                
                                "Add Content")
                            ),
                        )
                    ),
                   
                    m(".uk-modal-footer.uk-text-right",
                        m("button.uk-button.uk-button-primary",
                            {
                                onclick: (e) => {
                                    addVersion(json);
                                    document.getElementById('closemodal').click();
                                    json = {'content':[]}
                                }
                            },
                            "Create")
                    )
                )    
                ]          
            }
        }
    }

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
                return [
                    m(Button,
                        {
                            'target': '#modal-path',
                        },
                        "Path"),
                    m(Modal,
                        {
                            id: "modal-path",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'close-modal-path' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Path")),
                        m(".uk-modal-body",
                            m("p", { style: "text-align:center" }, "Input game basic content"),
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

    //para ver meditaciones y lecciones
    function ContentView() {
        return {
            view: (vnode) => {
                return vnode.attrs.content.map((content) => {
                    return m("div.uk-width-1-4@m",
                        m(".uk-card.uk-card-default",
                            {style: content.position == undefined  ?" opacity:0.5":''},
                            content.image ?
                                m("uk-card-media-top",
                                    m("img", { src: content.image })
                                ) : null,
                            m(".uk-card-body",
                                m("h4.uk-card-title", content.title),
                                m("p", content.description)
                            ),
                            m(".uk-card-footer",
                                m("a.uk-button.uk-button-text",
                                    { onclick: (e) =>  m.route.set('/editcontent/' + (content.cod || content.codlesson))},
                                    "Edit")
                            )
                        )
                    )
                })
            }
        }

    }

    // ESTO TENDRÍA QUE ESTAR
    function StageView() {
        let stage = { 'objectives': {}, 'meditations': {} };
        let toadd = {}

        let position = { 'selected': 0 }
        let path_filter = 'lessons'
        //let filteredcontent = []

        let new_path = 1;
        let old_path = 0;
        let showing = old_path

        let edit = false;


        function StageHeader() {
            return {
                view: (vnode) => {
                    console.log(stage.longimage)
                    return m(Card,
                        m(CardHeader,
                            ' Stage ' + filter.stagenumber,
                            m(Button,
                                {
                                    width:'1-5',
                                    onclick: (e) => edit = !edit
                                },
                                "EDIT"
                            ),
                            m(Button, { width: '1-4', style: "margin-left:5px", type: "primary", onclick: (e) => updateStage(stage) }, "Save"),
                        ),
                        m(CardBody,
                            m(Grid,
                                m(Column, { width: '1-3' },
                                    m("strong", "Basic information"),
                                    !edit ?
                                        [
                                            m("p", "Description : ", stage.description),
                                            m("p", "Goals: " + stage.goals),
                                            m("p", "Obstacles: " + stage.obstacles,),
                                            m("p", "Skills: " + stage.skills),
                                            m("p", "Mastery: " + stage.mastery)
                                        ] :
                                        [
                                            m("p", "Description :", m(TextField, { data: stage, name: "description", type: "input" })),
                                            m("p", "Goals :", m(TextField, { data: stage, name: "goals", type: "input" })),
                                            m("p", "Obstacles :", m(TextField, { data: stage, name: "obstacles", type: "input" })),
                                            m("p", "Skills :", m(TextField, { data: stage, name: "skills", type: "input" })),
                                            m("p", "Mastery :", m(TextField, { data: stage, name: "mastery", type: "input" })),
                                            
                                        ],
                                    m("strong", "Long description"),
                                    m(TextEditor,{data:stage,name:'longdescription'}),
                                ),
                                m(Column, { width: '1-3' },
                                    m(Grid,
                                        m(Row, m("strong", "Objectives")),
                                        m(Column, { width: '1-2' },
                                            m("p", "Streak"),
                                            m(TextField, { data: stage['objectives'], name: "streak", type: "number" }),
                                        ),
                                        m(Column, { width: '1-2' },
                                            m("p", "Total time"),
                                            m(TextField, { data: stage['objectives'], name: "totaltime", type: "number" }),
                                        ),
                                        m("p", "Meditations"),
                                        m(Column, { width: '1-3' },
                                            m("span", "Time"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "time", type: "number", placeholder: "time" })
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("span", "Number of meditations"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "count", type: "number", placeholder: "count" })
                                        ),
                                        
                                        m(Column, { width: '1-2' },
                                            m("span", "Number of retreats"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "retreatnumber", type: "number", placeholder: "Retreat number" })
                                        ),

                                        m(Column, { width: '1-2' },
                                            m("span", "Duration"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "retreatduration", type: "number", placeholder: "Retreat duration" })
                                        ),


                                            
                                        m("strong", "Image description"),
                                        m(TextEditor,{data:stage,name:'shorttext'}),
                                    )
                                ),
                                m(Column,{width:'1-3'},
                                    m("strong", "Images"),
                                    m(Button,
                                    {
                                        target: '#stage-long-image',
                                        type: "secondary"
                                    }, !stage.longimage ? "Upload long image" : 'Change image'),
                                    m("div","Long image"),
                                    m("div", stage.longimage? m("img",{src:stage.longimage}) : m("span")),
                                    m(ImagePicker, { id: "stage-long-image", data: stage, name: "longimage" }),
                                    m(Button,
                                        {
                                            target: '#stage-short-image',
                                            type: "secondary"
                                        }, !stage.shortimage ? "Upload short image" : 'Change image'),
                                    m("div","Short image"),
                                    m("div", stage.shortimage ? m("img",{src:stage.shortimage}) : m("span")),
                                    m(ImagePicker, { id: "stage-short-image", data: stage, name: "shortimage"  })
                                )
                            )
                        )
                    )
                }
            }
        }

        function ContentAdd() {
            return {
                view: (vnode) => {
                    return m(Column, { width: '1-2' },
                        m("h3", path_filter.toUpperCase()),
                        m(Grid, { size: "small" },
                           filteredcontent.filter((c)=>c.position ==null).map((cont) => {
                                    return m(Column, { width: '1-3' },
                                        m(ContentCard,{content:cont})
                                    )
                                }
                            )
                        )
                    )

                }
            }
        }

        function Path() {
            return {
                view: (vnode) => {
                    return m(Column, { width: '1-2' },
                        m("h1", "The path"),
                        filteredcontent.filter((elem) => elem.position != null).sort((a, b) => a.position - b.position).map((cont) => {
                                return m(Grid,
                                    m(Column, { width: '1-3' },
                                        m(Card,
                                            m(CardBody,
                                                m("label", cont.title),
                                                m("strong",cont.position),
                                            ),
                                            m(CardFooter,
                                                m(Button, {
                                                    type:'secondary',
                                                    onclick:(e)=>{
                                                        m.route.set('/editcontent/' + cont.cod)
                                                    }
                                                },"View"),
                                                m(Button, {
                                                    type: "danger",
                                                    style: "margin-top:3px",
                                                    onclick: (e) => { 
                                                        cont.position = null; 
                                                        let contentwithmoreposition = filteredcontent.filter((c) => c.position > cont.position);
                                                        contentwithmoreposition.map((c)=> {
                                                            c.position-=1;
                                                            updateContent(c);
                                                        })

                                                        console.log(cont)

                                                        updateContent(cont); 
                                                    }
                                                }, "Remove")
                                            )
                                        )
                                    )
                                )
                        })
                    )
                }
            }
        }

        function ContentCard(){
            let  toAdd = {}

            return {
                view:(vnode)=>{
                    let {content} = vnode.attrs

                    return m(Card,
                        m(CardHeader,
                            m(".uk-card-title", content.title)
                        ),
                        m(CardFooter,
                            m(Button, {
                                style: "margin-top:5px",
                                target: '#addtoPath',
                                onclick: (e) => { toadd = content },
                                type: "default"
                            }, content.position && showing == new_path || content.newpathposition ? 'Edit': "Add"),
                            m(Modal,
                                {
                                    id: 'addtoPath',
                                    center: true
                                },
                                m(ModalBody,
                                    m("label", "Add in position"),
                                    m(Select, {
                                        data: position,
                                        name: "selected",
                                    }, Array.from(new Array(Object.keys(content).length + 1).keys())),
                                    m(Button, {
                                        style: "margin-top:10px",
                                        class: "uk-modal-close",
                                        type: "primary",
                                        onclick: (e) => {

                                            if(showing == new_path){
                                                toadd.newpathposition = Number(position.selected)
                                                updateContent(toadd)
                                            }else{
                                                toadd.position = Number(position.selected);
                                                /*
                                                let ctwithlessposition = filteredcontent.filter((c)=> c.position >= toadd.position)
                                                if(ctwithlessposition.length > 0){
                                                    ctwithlessposition.map((c)=>{
                                                        c.posti
                                                    })
                                                }*/
                                                updateContent(toadd)
                                                position.selected = 0
                                            }
                                        }
                                    }, "Add")
                                )
                            )
                        )
                    )
                }
            }
        }

        function NewPath(){
            let groupedContent = {}

            return {
                oninit:(vnode)=>{
                    content.filter((c)=> c.newpathposition != null).map((c)=>{
                        if(!groupedContent[c.newpathposition]){groupedContent[c.newpathposition] = []}

                        groupedContent[c.newpathposition].push(c)
                    })
                },
                view:(vnode)=>{

                    

                    console.log(filteredcontent)
                    return [
                        //m("h1.uk-text-bold",{style:"width:100%"},"New path"),
                        m(Column,{width:'1-2'},
                            m("h2.uk-text-bold","Content"),
                            m(Grid,content.filter((a)=>a.stagenumber == stage.stagenumber && a.type !='meditation-game' && !a.newpathposition).sort((a,b)=> (a.title|| '').localeCompare(b.title||'')).map((c)=>{
                                return m(Column,{width:'1-3'},
                                    m(ContentCard,{content:c})
                                )
                            }))
                        ),

                        m(Column,{width:'1-2'},
                            m("h2.uk-text-bold","New Path"),
                            m(Grid,Object.keys(groupedContent).map((key)=>{
                                return groupedContent[key].map((c)=> {
                                    return m(Column,{width:'1-3'},m(ContentCard,{content:c}))
                                })
                            }))
                        )
                    ]
                }
            }
        }

        return {
            view: (vnode) => {
                stage = stages[(Number(filter.stagenumber) - 1)]
                //esto podría quitarlo
                if (!stage.objectives) { stage.objectives = { 'meditation': {}, }; console.log(stage) }
                if (!stage.meditations) { stage.meditations = {}; console.log(stage) }

                return [
                    m(Row,
                        m(StageHeader)
                    ),
                    //m(Row,
                    //m(".uk-button-group",
                        //m(Button,{type:'secondary',onclick:(e)=>showing = new_path},"New path"),

                      //  m(Button,{type:'secondary', onclick:(e)=> showing = old_path}, "Old path")                   
                    //)),



                    showing == old_path ? [
                    m(Row,
                        m('.uk-button-group',
                            m(Button, { 
                                style: path_filter == 'lessons' ?  'background-color:lightgrey;color:black;' : '',

                                type: "secondary", 
                                onclick: (e) => {path_filter='lessons'; filteredcontent = lessons; } 
                            }, "Lessons"),
                            m(Button, { 
                                style: path_filter == 'meditations' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='meditations'; filteredcontent = meditations; } 
                            }, "Meditations"),
                            m(Button, {
                                style: path_filter == 'games' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='games'; filteredcontent = games; } 
                            }, "Games"),

                            m(Button, {
                                style: path_filter == 'videos' ?  'background-color:lightgrey;color:black;' : '',
                                type: "secondary", 
                                onclick: (e) => {path_filter='videos'; filteredcontent = videos; } 
                            }, "Videos"),
                        )
                    ),
                    m(ContentAdd),
                    m(Path)  
                
                    ]: m(NewPath)
                ]
            }
        }

    }

    function UsersView() {
        let data = ['cod','Username','Stage', "Rol", '']

        return {
            view:(vnode) => {
                return m("table", {
                    class: 'uk-table uk-table-striped uk-table-middle'
                },
                    m("thead",
                        m("tr",
                            data.map((str) => m("th", str))
                        )
                    ),
                    m("tbody",
                        users.map((user) => {
                            console.log(user)
                            return m("tr", 
                                m("td",user.coduser),
                                m("td", user.nombre || 'Anónimo'),
                                m("td", user.stagenumber),
                                m("td", user.role),
                                m("td", 
                                    m(Button, {
                                        onclick:(e)=> {
                                            if(user.role == 'admin'){
                                                user.role = 'meditator'
                                            }else{
                                                user.role ='admin'
                                            }
                                            // AQUI SOLO SE UPDATEA EL ROL !!!
                                            updateUser(user)
                                        }
                                    }, user.role == 'admin' ? 'Quitar admin': "Hacer admin"),
                                    m(Button, {
                                        onclick:(e)=> {
                                            if(user.role == 'teacher'){
                                                user.role = 'meditator'
                                            }else {
                                                user.role ='teacher'
                                            }
                                            updateUser(user)
                                        }
                                    }, user.role == 'teacher' ? 'Quitar profesor': "Hacer profesor"),

                                    m(Button, {
                                        onclick:(e) => {
                                            if(confirm('Estás seguro que quieres eliminar?')){
                                                console.log(user)
                                                deleteUser(user.cod ? user.cod : user.coduser)
                                            }
                                        }
                                    }, "Eliminar")
                                )
                            )
                        })
                    )
                )
            }
        }
    }

    function VersionsView(){

        let showing = {}


        function SendMail(){

            let data = {}

            // RECEIVERS SE ELEGIRÁ DE UNA LISTA


            return {
                view:(vnode)=>{
                    return m(Section,
                        m(Padding,
                            m("h3","Send Update mail"),
                            m(Form,
                                m(Grid,
                                m(Row,
                                    m(FormLabel, "Subject"),
                                    m(TextField,{placeholder:"Subject", data:data,name:'subject', onchange:(e)=>{showing.subject = e.target.value}}),
                                ),
                                m(Row,
                                    m(FormLabel, "Receivers"),
                                    m(TextField,{placeholder:"Receivers", data:data,name:'receivers', onchange:(e)=>{showing.receivers = e.target.value}}),
                                ),


                                m(Button,{
                                    type:"primary",
                                    onclick:(e)=>{
                                        sendMail()
                                    }
                                }, "Send")
                                
                                )
                        )
                    ))
                }
            }
        }

        return {
            view:(vnode)=>{
                return m(Row,m(Grid,
                    m(Column,{width:'1-2'},
                       m(SendMail)
                    ),
                    m(Column,{width:'1-2'},
                        m(Section,
                            m("h3","Versions"),
                            m("dl",{class:"uk-description-list"},versions.sort((a,b)=>b.versionNumber < a.versionNumber).map((version)=>{
                                console.log(version)
                                return [
                                    m("dt", version.description + ' version number:' + version.versionNumber),
                                    m("dd",
                                        m("ul",
                                            version.content.map((content)=>{
                                                return m("li",content.text)
                                            })
                                        )
                                    )
                                ]
                            }))
                        )
                    )
                    )
                )
            }
        }
    }

    function ViewEditSumup(){
        let sumup = {}

        let modelo = {
            'stagenumber':1,
            type: '',
            children:[ ]
        }

        function Menu(){
            let editingIndex = -1;

            return {
                view:(vnode)=>{
                    let {items,submenu} = vnode.attrs
                    if(items && items.length){
                        return m(submenu ? ".menu": ".ui.large.vertical.menu",
                            items.map((item,index)=>{
                                let isEditing = editingIndex == index

                                return m(".item",
                                    isEditing ? [
                                        m("i.circular.check.link.icon",{onclick:(e)=> editingIndex = -1}),
                                        m(TextField,{
                                            data:item,
                                            name:'text',
                                            type:'textarea'
                                        })
                                    ]: [
                                    
                                    m("i.circular.trash.red.icon",{
                                        onclick:(e)=>{
                                        if(!item.children || confirm('All the childrens will be deleted. Are you sure?')){
                                            items.splice(index,1)
                                        }
                                        }
                                    }),
                                    m("i.circular.edit.green.link.icon",{style:"z-index:100", onclick:(e)=> editingIndex = index}),
                                    
                                    
                                    m("i.circular.plus.blue.link.icon",{
                                        onclick:(e)=> {
                                            if(!item.children){item.children= []} 
                                            item.children.push({'text':'edit this text'})
                                        }
                                    }),

                                    m("span",{style:"word-wrap: break-word"},item.text),
                                
                                    item.children ? m(Menu,{items:item.children, submenu:true}): null,
                                ])
                            })
                        )
                    }
                }
            }
        }

        return {
            view:(vnode)=>{
                let type =filter.type == 'lessons' ? 'lesson': 'meditation'
                sumup = sumups.length ? sumups.filter((sumup)=> sumup.stagenumber == filter.stagenumber && sumup.type == type)[0] || {} : modelo

                sumup.type = type 

                return [
                    m(Column, {width:'1-1'},
                        m("div",{class:"uk-text-bold"}, "Short sum up"),
                        m(Button,{
                            onclick:(e)=>{
                                sumup.children.push({'text':'press on edit to change this text'})
                            }
                        },"Add new item"
                        
                        ),
                        m(Button,{
                            onclick:(e)=>{
                                addSumUp(sumup)
                            }
                        },"Save sum up"),

                        sumup.children && sumup.children.length ? m(Menu,{items:sumup.children}) : null  
                    ),              
                ]
            }
        }
    }

    function PathsView(){
        return {
            view:(vnode)=>{
                return m(Row, m(Grid, 
                    paths.map((path, i)=>{
                        return m(Path,{path:path})
                    })
                )
                )
            }
        }
    }
}

function EditContent() {
    let content = {}
    let editar = false;
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let uploading = false;

    let teachers = []

    function MeditationContent() {
        let aux ;

        return {
            oninit:(vnode)=>{
                //HACER ESTO PARA LAS LESSONNS !!!!
                let aux = 0;
                if(content.content) {
                    let contentlast=0

                    Object.keys(content.content).map((key,index)=>{
                        let aux = Number(key)
                        console.log(aux,contentlast)
                        if (key != 0 && aux - 1 != contentlast){
                            content.content[Number(contentlast)+1] = content.content[key]
                            delete content.content[key]
                        }

                        contentlast = Number(key)
                    })
                }

                if(content.followalong){
                    let followalonglast = 0

                    Object.keys(content.followalong).map((key)=>{
                        let aux = Number(key)
                        if (key != 0 && aux - 1 != followalonglast){
                            content.followalong[Number(followalonglast)+1] = content.followalong[key]
                            delete content.followalong[key]
                        }
                        followalonglast = Number(key)
                    })
                }
            },
            view:(vnode) => {
                return  [
                    content.content ? [
                        m(Column, {width:'1-1'}, 
                            m("strong", "Before meditation")
                        ),    
                    
                        Object.keys(content.content).map((key) => {
                            return m(Column, { width: '1-4' },
                                m(MeditationSlide, { data: content['content'], name: key, })
                            )
                        })
                    ]: null,

                    editar ? 
                    m("a.uk-width-1-4@m",
                        {
                            'uk-icon': 'icon:plus',
                            onclick: (e) => {      
                                if(!content.content) {
                                    content.content = {}
                                }                      
                                content.content[Object.keys(content.content).length] = { 'text': 'Edit this text', 'type': 'text' }
                            }
                        },
                        "Add before text",
                        m("span", {class:"material-icons"},"add_box")
                    ) : null,



                    // a lo mejor arriba es mejor !!!!!! !!!!! CONTENT.FILE ES COMÚN !!!!!!
                    content.followalong ? [
                        m(Column, {width:'1-1'}, m("strong","During meditation")),
                        
                      //  content.file ? m(Column,{width:'1-3'}, m(FileView,{file:content.file})): null,
                        content.followalong ?
                        Object.keys(content.followalong).map((key) => {
                            return m(Column, { width: '1-4' },
                                m(MeditationSlide, { data:content['followalong'],name:key})
                            )
                        }) : null
                    ] : null,
                    editar ? 
                        m("a.uk-width-1-4@m",
                            {
                                onclick: (e) => { 
                                    if(!content.followalong){
                                        content.followalong = {}
                                    }                            
                                    content.followalong[Object.keys(content.followalong).length] = { 'text': 'Edit this text', 'type':'text'}
                                }
                            },
                            "Add followalong text",
                            m("span", {class:"material-icons"},"add_box")

                        ) : null,

                   
                    
                ]
            }
        }
    }

    function LessonContent() {
        return {
            view:(vnode)=>{
                return [
                    /*m(Column,{
                        width:'1-4'
                    },
                        m("strong", "Help text"),
                        m(TextEditor, { 
                            data: content, 
                            name: "help", 
                            type: "textarea", 
                            rows: "3", 
                        }),
                    ),*/

                    // TENDRIA QUE  SER LESSONSLIDES
                    content.text ? m(LessonSlides,{data:content, name:'text'})
                    : 
                        null,
                        editar ? 
                        m(Button,
                            {   
                                onclick: (e) => {
                                    if(!content.text){
                                        content.text = []
                                    }

                                    content.text.push({ 'text': "Edit this text", 'image': "" })    
                                }
                            },"ADD SLIDE"
                        ) : null
                ]    
            }
        }
    }

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

    return {
        oninit: (vnode) => {
            getContentbycod(vnode.attrs.cod).then((res) => {
                content = res;
                console.log(content)
                m.redraw()
            })

            getUsers().then((res) => {
                teachers = res.filter((user)=> user.role == 'teacher');
            })
        },
        view: (vnode) => {
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
                        user.role == 'admin' ?
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
                                    
                        content.type == 'recording' ?
                        null:
                        content.type == 'meditation-practice' ? 
                        m(MeditationContent) :
                        content.type =='meditation-game' ? 
                        m(GameContent) :
                        m(LessonContent),                        
                    )
                )
                 ) :
                null
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

//PAGINA WEB. PASARLO A OTRO SITIO
function MainScreen() {
    let content = [];
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let selectedstage = 1;

    function Content() {
        return {
            view: (vnode) => {
                return m(Grid,
                    {
                        match: true
                    },
                    content.filter((cont) => (cont.type == vnode.attrs.type[0] || cont.type == vnode.attrs.type[1]) && cont.position != null).sort((a, b) => a.position - b.position).map((content) => {
                        return m(Column,
                            { width: '1-5' },
                            m(Card,
                                {
                                    hover: true,
                                    style: "cursor:pointer;",
                                    onclick: (e) => { m.route.set('/contentview/' + content.cod) }
                                },
                                content.image ?
                                    m(CardMedia, m("img", { src: content.image }))
                                    : null,
                                m(CardBody, m("h3", content.title)
                                ))
                        )
                    })
                )
            }
        }
    }

    return {
        oninit: (vnode) => {
            /*getContent(1).then((res) => {
                content = res;
                m.redraw();
            })*/
        },
        view: (vnode) => {
            return m(Grid,
                {
                    center: true
                },

                m(Padding,{size:'large'},
                    m("img",{src:'./assets/website-under-construction.jpeg',style:"width:100%;height:auto;margin-top:100px"})
                )

                
                /*
                m(Padding,
                    m(Row, m("div", { style: "font-family:Gotham Rounded; font-size:2em;text-align:center;" }, "Are you ready for enlightenment?")),
                    m(Row, { style: "text-align:center" }, m(Button, { type: "primary", style: `margin-top:15px;background-color:${primarycolor};text-align:center;` }, "Join"))
                ),
                m(Column, { width: '3-3' },
                    m(Section,
                        { type: "muted" },
                        m('div', { style: "padding-left:15px;" },
                            m("h3", "Follow the guidelines")
                        )
                    )
                ),
                m(Row, m("div", { style: "font-family:Gotham Rounded;font-size:2em;text-align:center" }, "Different content for each stage ")),
                stages.map((stage) => {
                    return m(Button, {
                        style: `margin-right:5px;${selectedstage == stage ? 'color:white;background-color:' + primarycolor : ''}`,
                        onclick: (e) => {
                            selectedstage = stage;
                            getContent(stage).then((res) => {
                                content = res;
                                m.redraw();
                                console.log(content)
                            })
                        }
                    }, stage)
                }),

                m(Row,
                    m("div", { style: "font-family:Gotham Rounded;font-size:2em;" }, "Lessons"),
                    m(Content, { type: ['lesson', 'meditation'] })
                ),

                m(Row,
                    m("div", { style: "font-family:Gotham Rounded;font-size:2em;" }, "Meditations"),
                    m(Content, { type: ['meditation-practice', 'game'] })
                ),

                m(Row,
                    m(Button,{
                        onclick:(e) => {
                            console.log('click')
                            fetch(`https://localhost:8802/action/1234`, 
                                {
                                    headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Access-Control-Allow-Origin': 'http://localhost'
                                    },
                                    method: "POST",
                                    body: JSON.stringify({a: 1, b: 2}
                                )
                            }).then((res)=> res.json())
                            .then((res) => console.log('response',res)) 
                        }
                    }, "server")
                    
                )



                    */

            )
        }
    }
}

function ContentView() {
    let content = {}
    return {
        oninit: (vnode) => {
            getContentbycod(vnode.attrs.cod).then((res) => {
                content = res;
                console.log(content)
                m.redraw()
            })
        },
        view: (vnode) => {
            return m(Grid,
                m(Column,
                    {
                        width: '1-2'
                    },
                    m("div", { style: "font-family:Gotham Rounded; font-size:2em" }, content.title),
                ),
                m(Column,
                    {
                        width: '1-2'
                    },
                    m("img", { style: "width:100%;height:auto", src: content.image })
                )
            )
        }
    }
}

function ProfileView(){
    let user = {}
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
                        m(DataCard,{header:'stage', icon:'hiking', number: user.stage.stagenumber})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Meditations completed', icon: "self_improvement",number: user.stats.total.meditaciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Lessons read', icon: "book",number: user.stats.total.lecciones})
                    ),
                    m(Column,{width:'1-2'},
                        m(DataCard,{header:'Time meditated', icon: "timer",number: Math.floor(user.stats.total.tiempo / 60) + 'h'})
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
                                                    style:`color:red;${request.votes[user.coduser] == -1 ? 'opacity:1;': 'opacity:0.5;'}`, 
                                                    onclick:(e) => {
                                                        if(!request.votes[user.coduser] && request.points){
                                                            request.votes[user.coduser] = -1
                                                            request.points--;
                                                        }
                                                        //si has votado positivamente
                                                        else if(request.votes[user.coduser] == 1 && request.points){
                                                            request.points--;
                                                            if(request.points){
                                                                request.points--;
                                                                request.votes[user.coduser] = -1
                                                            }else {
                                                                delete request.votes[user.coduser]
                                                            }
                                                        }
                                                        // si has votado negativamente se te quita
                                                        else if(request.votes[user.coduser] == -1){
                                                            request.points++;
                                                            delete request.votes[user.coduser]
                                                        }
                                                
                                                        updateRequest(request)
                                                    }
                                                },"arrow_downward"),
                                        ),
                                        m("span",
                                            m("a",{
                                                class:"material-icons",
                                                style:`color:green;${request.votes[user.coduser] == 1 ? 'opacity:1;': 'opacity:0.5;'}`, 

                                                onclick:(e) => {
                                                    if(!request.votes[user.coduser]){
                                                        if(!request.points){request.points = 0}
                                                        request.votes[user.coduser] = 1
                                                        request.points++;
                                                    }else if(request.votes[user.coduser] == 1){
                                                        request.points --;
                                                        delete request.votes[user.coduser]
                                                    }else if(request.votes[user.coduser] == -1){
                                                       request.points += 2
                                                       request.votes[user.coduser] = 1
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
                                    data.coduser = user.coduser
                                    data.username = user.nombre
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
                                                    'username':user.nombre,
                                                    'date':new Date(),
                                                    'coduser':user.coduser
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
                    user.meditations.sort((a,b)=> new Date(a.day)- new Date(b.day)).map((med,i)=>{
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
            getUser(vnode.attrs.cod).then((usr) => {
                user = usr
                console.log(user)
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
                    m("img", {src:user.image, style:"width:100%;height:auto"}),
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
                    m(Button, {type:"danger",style:"width:100%;margin:10px auto", onclick:(e)=>{localStorage.removeItem('meditationcod');user ={};m.route.set('/');}}, "LOG OUT")
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

function TeacherManagement(){
    let content = []

    let itemcount = 0;
    let loaded = false;

    let usr= {}

    let state = {
        profile:0,
        students:1,
        content:2,
        messages:3,
        courses:4,
    }

    let icons = {
        profile:m("i.user.icon"),
        students: m("i.group.icon"),
        content:m("i.book.icon"),
        courses: m("i.leanpub.icon"),
        messages:m("i.envelope.icon")
    }

    let texts = {
        0:'Here you can edit your personal information',
        1:'See who is enrolled to your courses and send messages to them',
        2:'Check statistics from your added content and edit or create it',
        3: 'Send and view the messages sent to yourself',
        4: 'Create, view and check your courses.'
    }

    let showing = state.profile

    let chats = []
    let stats = {}
    let loadedMessages = false;

    function Chat(){
        return {
            view:(vnode)=>{

            }
        }
    }

    function MyProfile(){
        let isEditing = false


        function EditableField(){


            return {
                view:(vnode)=>{
                    let {data,name,type} = vnode.attrs

                    return [
                        isEditing ? m(TextField,{data:data,name:name,type:type}): data[name]
                    ]
                }
            }
        }

        return {
            view:(vnode)=>{
                return [
                       m(Grid,{center:true, verticalalign:true},
                            m(Column,{width:'1-5'},
                                m("label",{style:"font-weight:bold"},"User image"),
                                m("img",{src:user.image,style:"width:100%;height:auto"}),
                            ),
                            m(Column,{width:'4-5'}, 
                                m(".ui.form",
                                    m(".inline.field",
                                        m("label",{style:"margin-right:10px"}, "Name "),
                                        m(EditableField,{data:user,name:'nombre'})
                                    ),
                                    m(".field",
                                        m("label", "Description "),
                                        m(EditableField,{data:user,name:'description',type:"textarea"})
                                    ),
                                    m(".three.fields",

                                        m(".field",
                                            m("label", "Location" , m(Icon,{icon:'location_on'})),

                                            m(EditableField,{data:user,name:'location'})
                                        ),

                                        m(".field",
                                            m("label", "Website" , m(Icon,{icon:'language'})),
                                            m(EditableField,{data:user,name:'website'})
                                        ),
                                        m(".field",
                                            m("label", "Teaching hours" , m(Icon,{icon:'calendar_month'})),
                                            m(EditableField,{data:user,name:'teachinghours'})
                                        ),
                                    )
                                )
                                /*
                                m(Grid,
                                    m(Column,{width:'1-5'},m(Icon,{icon:'location_on'}), user.location),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'language'}),m("a",{href:user.website,target:'_blank'},user.website)),
                                    m(Column,{width:'1-5'},m(Icon,{icon:'calendar_month'}),user.teachinghours),
                                )] : 
                                m(Grid,
                                    m(Column,{width:'1-3'}, m(TextField,{data:user,name:'nombre'})),
                                   
                                    m(Row,m(TextField,{data:user,name:'description'})),
                                    m(Column,{width:'1-5'},m(Icon,{icon:'location_on'}), ),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'language'}), m(TextField,{data:user,name:'website'})),
                                    m(Column,{width:'2-5'},m(Icon,{icon:'calendar_month'}),m(TextField,{data:user,name:'teachinghours'})),
                                )*/
                            )

                    ),
                    
                    m("div",{style:"height:20px;"}),
                    m(Button,{type:"secondary",onclick:(e)=> isEditing = !isEditing}, !isEditing ? "Edit data" : 'Cancel'),

                    isEditing ? 
                    m(Button,{
                        type:"primary",
                        style:"margin-left:30px;", 
                        onclick:(e)=> {
                            isEditing = false; 
                            updateUser({'coduser':user.coduser,'nombre':user.nombre,
                                'description':user.description,'location':user.location,
                                'website':user.website,'teachinghours':user.teachinghours
                            }) 
                        }
                    },"Save data"):null
                ]
            }
        }
    }

    function MyCourses(){
        
        function Course(){
            let isEditing = false;
            let  c;


            function EditableField(){
                
                return {
                    view:(vnode)=>{
                        let {data,name,type} = vnode.attrs
    
                        return [
                            isEditing ? m(TextField,{data:data,name:name,type:type}): m.trust(data[name])
                        ]
                    }
                }
    
            }

            return {
                oninit:(vnode)=>{


                },
                view:(vnode)=>{
                    let c = new CourseEntity(vnode.attrs.course)

                    return  m(".uk-card.uk-card-default.uk-card-body",
                        m(".uk-card-title", m(EditableField,{data:c,name:'title'})),
                        
                        m(".ui.form",
                        
                        ),
                        
                        m(Grid,
                            m(Row, m(EditableField,{data:c,name:'description',type:"textarea"})),
                            m(Column,{width:'1-2'},
                                m(Button,{type:'primary', onclick:(e)=> m.route.set(`/editcourse/${c.cod}`)}, "Edit course")
                            )
                            /*m(".ui.form",
                                m(".ui.two.fields",
                                    c.getFields().map((field)=>{
                                         return m(".field", m(EditableField,{data:c,name:field.name,type:"textarea"})  )
                                    })
                                )
                            )*/
                        )
                    )
                }
            }
        }
        
        
        return {
            view:(vnode)=>{
                return [
                    user.addedcourses ? 
                    m(Grid, user.addedcourses.map((course)=>{
                        return m(Column,{width:'1-2'}, m(Course,{course:course}))}
                    )) 
                    :  m("p", "You have not added any course. You can add one pressing at the button below"),

                    m("div",{style:"height:20px"}),

                    m("p", "Press the button below to add a course into the application"),
                    m(AddCourse,{coduser:user.coduser})
                ]
            }
        }
    }

    // FALTARÍA SACAR EL CHAT Y ENVIAR MENSAJES EN EL CHAT
    function MyMessages(){
        return {
            view:(vnode)=>{
                console.log('chats',chats)
                
                return m(Section,{type:'default'},
                m("h3", "My messages"),

                
                !loadedMessages ? m(".ui.active.inline.loader") :
                    chats.length ?
                    m(".ui.list",
                        chats.map((chat)=>{
                            console.log('CHAT',chat.users[user.coduser])
                             return Object.keys(chat.users).map((cod)=>{
                                if(cod != user.coduser){
                                    let user = chat.users[cod]
                                    return m(".item",
                                        m("img.ui.avatar.image",{src:user.userimage}),
                                        m(".content",
                                            m(".header", user.nombre),
                                            m(".description", )
                                        ),
                                        m(".extra",
                                            m(".ui.label",(chat.users[user.coduser].unreadmessages ? chat.users[user.coduser].unreadmessages.length : '0') + ' unread messages')
                                        )
                                    )
                                }
                             })
                        })                   
                    ):m(DefaultText, "No messages at the moment")

                    /*
                    m(Grid,Object.keys(requests).map((key)=>{
                        if(requests[key].user && requests[key].messages && requests[key].messages.length){
                        return m(Column,{width:'1-4'},m(Card,
                            m(CardHeader,requests[key].user.nombre),
                            m(CardBody,requests[key].messages[0].text)
                        ))
                        }
                    }))*/
                )
            }
        }
    }

    function MyContent(){
        return{
            view:(vnode)=>{
                return [
                    m(Section,{type:"default"},
                        m("h3","Content stats"),
                        Object.keys(stats).length > 0 ?
                        m("dl",Object.keys(stats).map((title)=>{
                            return [
                                m("dt",title),
                                m("dd", "Reproduced for " + stats[title].timeDone  + " minutes by " + (stats[title].people) +' people ')
                            ]
                        })): m("p"," At the moment no content has been reproduced")
                    ),

                    m(Section,{style:"width:100%;padding-left:10px;padding-right:10px"},
                        m("div",{style:"display:flex;flex-direction:row;justify-content:space-between"},
                            m("h3","Added content"),
                            m("ul",{class:"uk-pagination"},
                                m("li",m("a",{onclick:(e)=> itemcount > 0 ? itemcount -=4 : null},m("span",{'uk-pagination-previous':true,'ratio':1.5}))),
                                m("li",{style:"font-size:1.2em;align-items: center;display: flex;"}, itemcount+1 + '-' + (itemcount+4) + ` (${content.length} total)`),
                                m("li",m("a",{onclick:(e)=> content[itemcount+4] != null ? itemcount+=4 : null,}, m("span",{'uk-pagination-next':true,'ratio':1.5}), ))
                            )
                        ),
                        m(Grid,{match:true},
                            content.sort((a,b)=>{
                                if(a.position == null  &&  b.position == null){
                                    return 0
                                }else if(a.position == null){
                                    return 1
                                }else  if(b.position == null){
                                    return -1
                                }else{
                                    return a.position - b.position
                                }
                            }).slice(itemcount,itemcount+4).map((content)=>{
                                return m(Column,{width:'1-4'},
                                    m(ContentCard,{content:content})
                                )
                            })
                        ),

                        m(".uk-text-bold", "Add more content"),
                        m(AddContent,{coduser:user.coduser,isTeacher:true, courses:user.addedcourses || []}),
                    )
                ]
            }
        }
    }

    function MyStudents(){
        return {
            view:(vnode)=>{
                return [
                    user && user.students && user.students.length  ?
                    m(".ui.selection.list",user.students.map((std)=>{
                        return m(".item",

                            m("img.ui.avatar.image",{src:std.image}),
                            m(".content",
                                m(".header", std.nombre)
                            )
                        )
                    })): m(DefaultText,"You have no students at the moment")
                
                ]
            }
        }
    }

    return {
        oninit:(vnode)=>{
            //  HAGO DOS VECES EL CONNECT !!!
            // Se PODRÍA SACAR SOLO EL CONTENT DEL USUARIO !!!
            getAllContent().then((res)=>{
                content = res.filter((r)=> r.createdBy && (r.createdBy == user.coduser || r.createdBy == vnode.attrs.coduser))

                // un poco rudimentario :(
                content.map((c)=>{
                    getStats(c).then((res)=>{
                        if(res.people || res.timeDone){
                            stats[c.title] = res;
                            console.log(res)
                            m.redraw();
                        }
                    })
                });

                m.redraw()
            })

            // utilizar siempre vnode.attrs !!!
            getUserMessages(vnode.attrs.coduser ? vnode.attrs.coduser : user.coduser ? user.coduser : localStorage.getItem('meditationcod')).then((messages)=>{
                chats = messages 
                loadedMessages = true
                m.redraw()
            })
        },
        view:(vnode)=>{
            return m(".ui.segment",{style:"margin-top:20px;padding:0px;min-height:80vh"}, 
                m(Grid,{columngap:'collapse',center:true,style:"height:100%;",verticalalign:true},
                    m(Column,{width:'1-5'},
                        m(".ui.vertical.sidebar.menu.left.overlay.visible",{style:"position:relative;height:100%;"},
                            user.image ? [
                                m("div",{style:"height:20px"}),
                                m("img.ui.big.circular.image",{style:"object-fit:cover;max-width:50%;margin:0 auto;height:80px;width:80px;border-radius:50%;",src:user.image}),
                                m("h3.ui.centered.header", user.nombre)
                            ]
                            : 
                            m("div",{style:"height:100px"}),

                            // HACER UN ARRAY
                            Object.keys(state).map((key)=>{
                                return m("a.item",
                                    {
                                        class:  showing == state[key] ? 'active':'',
                                
                                        onclick:(e)=>{ showing = state[key]}
                                    },
                                    icons[key],
                                    'My '+ key
                                )
                            }),
                        )
                    ),

                    m(Column,{width:'4-5'},
                        m(Padding,
                            
                           

                            !user || !user.coduser ? m("div",m(".ui.active.centered.inline.loader",{style:"margin-top:50px"})) : [
                                
                                m(".ui.top.attached.segment",
                                    m("h3", 'My  ' + Object.keys(state)[showing]),
                                    m("h3.ui.grey.small.header", texts[showing]),
                                ),
                                m(".ui.bottom.attached.segment",
                                    showing == state.profile ? m(MyProfile):
                                    showing == state.courses ? m(MyCourses):
                                    showing == state.students ? m(MyStudents) :
                                    showing == state.messages ? m(MyMessages) :
                                    showing == state.content ? m(MyContent) : null
                                )
                            ]
                        )
                    ),
                    /*
                    m(Column,{width:'1-5'},
                    m(Row,
                        
                    ),

                    m(Row,
                       
                    ),

                    m(Column,{width:'1-2'},
                        m(".uk-text-bold", "Showing"),
                        m(".uk-button-group",{style:"width:100%"},
                            m(Button,{type:showing == state.messages ? 'primary':'',key:showing,  onclick:(e)=> showing = state.messages}, "Messages"),
                            m(Button,{type:showing == state.students ? 'primary':'',key:showing,  onclick:(e)=> showing = state.students}, "Students"),
                            m(Button,{type:showing == state.content ? 'primary':'',key:showing, onclick:(e)=> showing = state.content}, "Content"),
                            m(Button,{type:showing == state.courses ? 'primary':'',key:showing, onclick:(e)=> showing = state.courses}, "Courses")
                        )
                    ),

                    m(Column,{width:'1-2'},
                        m(".uk-text-bold", "Create"),
                        
                    ),
                    
                    m(Row,
                        showing == state.students ?
                        :
                        showing == state.content ? [
                            
                        )]: 
                        showing == state.courses ? 
                        m(Section,
                            m("h3","My Courses"),
                            m("p", "You have created " + user.addedcourses.length +  ' course' + (user.addedcourses.length > 1 ?'s':'')),
                            m(Grid,
                                user.addedcourses.map((course)=>{
                                   
                                })
                            )    
                        ):
                        
                    )
                    
                    ),
                    */
                )
            )
        }
    }
}

function getCurrentUser(){
    return user;
}

export {getCurrentUser}


m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, MainScreen)
        },
    },

    '/management': {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentManagement)
        }
    },

    "/editcontent/:cod": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditContent)
        },
    },

    '/contentview/:cod': {
        render: (vnode) => {
            return m(Layout, vnode.attrs, ContentView)
        }
    },

    '/profile/:cod' :{
        render: (vnode) => {
            return m(Layout, vnode.attrs, ProfileView)
        }
    },

    '/teacher-management':{
        render: (vnode) => {
            return m(Layout, vnode.attrs, TeacherManagement)
        }
    },

    '/editcourse/:cod':{
        render:(vnode)=>{
            return m(Layout, vnode.attrs, EditCourse)
        }
    }
})
