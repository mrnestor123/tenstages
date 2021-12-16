import { getLessons, getLesson, addContent,addVersion, getImages, getStage, updateStage, getUsers, getContent, getStages, addStage, getContentbycod, updateContent, login, deleteUser, getUser, postRequest, getRequests, updateRequest, deleteContent, updateUser } from './server.js'
import { FileUploader, create_UUID } from './util.js'
import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, CardHeader, Container, ModalHeader, Form, FormLabel, ModalFooter, TextEditor } from './components.js'
import { LessonSlide,LessonSlides, MeditationSlide, ImagePicker, FollowAlongSlide } from './tenstage-components.js'

let primarycolor = '#E0D5B6'

function Layout() {
    let route = 'home'
    let loggeduserin = {};

    function LoginModal() {
        let data = {};
        let user;
        let errormessage = undefined;
        
        async function log({type, email, password}){
            var result = await login({type:type,email: email,password: password})

            console.log(result)
            
            if(result.uid){
                localStorage.setItem('meditationcod', result.uid)
                loggeduserin = await getUser(result.uid)
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
                            m(TextField, { data: data, name: "username", type: "input" }),
                            //),
                            m(FormLabel,
                                "Password"
                            ),
                            m(TextField, { data: data, name: "username", type: "input" }),
                            
                            errormessage ? m("div",{style:"font-size:1.1em;color:red"}, errormessage) : null,

                            )
                    ),
                    m(ModalFooter,
                        m("uk-text-left",
                        //CAMBIAR
                            m(".uk-icon-button", { 'uk-icon': 'facebook', onclick: (e) => log({type:'facebook'}) }),
                            m(".uk-icon-button", { 'uk-icon': 'google', onclick: (e) => log({type:'google'}) })
                        ),
                        m(Button, { style: "float:right", onclick:(e) => log({type:'mail'})}, "Login")
                    )
                )
            }
        }
    }

    return {
        view: (vnode) => {
            return [
                m("nav.uk-navbar-container", { 'uk-navbar': '' },
                    m("nav", { 'uk-navbar': '', style: "width:100%" },
                        m(".uk-navbar-left",
                            m("a.uk-navbar-item.uk-logo", m("img", { src: './assets/logo-tenstages.png', style: "max-height:100px" })),
                            m("ul.uk-navbar-nav",
                                m("li",
                                    {
                                        class: route == 'home' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'home'; m.route.set('/') }
                                    },
                                    m("a", "Home ")
                                ),
                                m("li.uk-active",
                                    {
                                        class: route == 'management' ? 'uk-active' : '',
                                        onclick: (e) => { route = 'management'; m.route.set('/management') }
                                    },
                                    m("a", "Content")
                                )
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
                    return m("main", m(Container, m(child, vnode.attrs)))
                }),

                m("footer", { style: "width:100%;background-color:black;min-height:100px;" }, "Footer")

            ]
        }
    }
}

function ContentManagement() {
    // lista con la forma 'id': lesson. TEndrá que ser CONTENT !!!
    let lessons = [];
    let filter = { 'stagenumber': 1, 'type': 'lessons' }
    let stages = []
    let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 'none']

    let content = [];
    let filteredcontent = [];

    let users = []

    //para subir imágenes a la lección
    let index = 0;
    let json = {};

    //modal for adding lessons
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
                                step == 1 ?
                                    [
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
                                                m(Select,
                                                    { data: json, name: "type" },
                                                    ["lesson", "meditation"]
                                                )
                                            )
                                        )
                                    ]
                                    :
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
                                step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1; index = 0 } }, "Back") : null,
                                m("button.uk-button.uk-button-primary",
                                    {
                                        onclick: (e) => {
                                            if (step == 1) { step++; index = 1; }
                                            else {
                                                console.log(json)
                                                json.cod = create_UUID();
                                                json.stagenumber = Number(json.stagenumber)
                                                addContent(json);
                                                document.getElementById('closemodal').click();
                                                json = { 'type': 'lesson' }
                                                text = []
                                            }
                                        }
                                    },
                                    step > 1 ? "Create" : "Next")
                            )
                        )
                    )
                ]
            }
        }

    }

    function AddMeditation() {
        let json = {
            'cod': '',
            'title': '',
            'description': '',
            'image': '',
            'duration': 1,
            'stagenumber': 1,
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
                        "Meditation"),
                    m(Modal,
                        {
                            id: "modal-meditation",
                            center: true
                        },
                        m("button.uk-modal-close-default", { 'uk-close': '', 'id': 'closemodalmed' }),
                        m(".uk-modal-header", m(".uk-modal-title", "Add Meditation")),
                        m(".uk-modal-body",
                            step == 1 ? [
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
                                        m("label.uk-form-label", "Duration"),
                                        m(TextField,
                                            {
                                                data: json, name: "duration", type: "number"
                                            }
                                        ),

                                    )
                                )
                            ] :
                                [
                                    m("p", "Input the lesson content"),
                                    m(Grid,
                                        Object.values(json.content).length > 0 ?
                                            Object.keys(json.content).map((key, i) => {
                                                return m(Column, { width: '1-3' },
                                                    m(MeditationSlide, { data: json['content'], name: key, })
                                                )
                                            }) : null,
                                        m(Column,
                                            {
                                                width: '1-3',
                                                style: "cursor:pointer",
                                                'uk-icon': 'icon:plus',
                                                onclick: (e) => {
                                                    json.content[Object.keys(json.content).length] = { 'text': '' }
                                                    console.log(json['content'])
                                                    m.redraw()
                                                }
                                            }
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
                                            if(json.stagenumber == 'none'){
                                                json.stagenumber = 'none'
                                            }else{
                                                json.stagenumber = Number(json.stagenumber)
                                            }
                                            addContent(json);
                                            document.getElementById('closemodalmed').click();
                                            console.log('added meditation !')
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
                                m(Button,{onclick:(e)=> json.content.push({})}, "Add Content")
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

    //para ver meditaciones y lecciones
    function ContentView() {
        return {
            view: (vnode) => {
                return vnode.attrs.content.sort((a,b)=> b.position - a.position).map((content) => {
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
                                    { onclick: (e) => filter.type == 'meditations' ? m.route.set('/editmeditation/' + content.cod) : m.route.set('/editlesson/' + (content.cod || content.codlesson)) },
                                    "Edit")
                            )
                        )
                    )
                })
            }
        }

    }

    function PathView() {
        let stage = { 'objectives': {}, 'meditations': {} };
        let toadd = {}

        let position = { 'selected': 0 }
        let path_filter = 'Lessons'
        let filteredcontent = []

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
                                            m("span", "Count"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "time", type: "number", placeholder: "time" })
                                        ),
                                        m(Column, { width: '1-3' },
                                            m("span", "Minutes"),
                                            m(TextField, { data: stage['objectives']['meditation'], name: "count", type: "number", placeholder: "count" })
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
                        m("h3", path_filter),
                        m(Grid, { size: "small" },
                           filteredcontent.filter((c)=>c.position ==null).map((cont) => {
                                    return m(Column, { width: '1-3' },
                                        m(Card,
                                            m(CardHeader,
                                                m(".uk-card-title", cont.title),
                                            ),
                                            m(CardFooter,
                                                m(Button, {
                                                    style: "margin-top:5px",
                                                    target: '#addtoPath',
                                                    onclick: (e) => { toadd = cont },
                                                    type: "default"
                                                }, "Add"),
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
                                                                toadd.position = Number(position.selected);
                                                                let ctwithlessposition = filteredcontent.filter((c)=> c.position >= toadd.position)
                                                                if(ctwithlessposition.length > 0){
                                                                    ctwithlessposition.map((c)=>{
                                                                        c.posti
                                                                    })
                                                                }
                                                                updateContent(toadd)
                                                                position.selected = 0
                                                            }
                                                        }, "Add")
                                                    )
                                                )
                                            )
                                        )
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
                                                        m.route.set('/editlesson/' + cont.cod)
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

        return {
            view: (vnode) => {
                stage = stages[(Number(filter.stagenumber) - 1)]
                //esto podría quitarlo
                if (!stage.objectives) { stage.objectives = { 'meditation': {}, }; console.log(stage) }
                if (!stage.meditations) { stage.meditations = {}; console.log(stage) }

                filteredcontent =content.filter( cont=>  (
                    path_filter == 'Lessons' && cont.type != 'meditation-practice' && cont.type != 'meditation-game' 
                    || path_filter == 'Meditations' && cont.type == 'meditation-practice' 
                    || path_filter =='Games' && cont.type =='meditation-game'
                    )
                )

                return [
                    m(Row,
                        m(StageHeader)
                    ),
                    m(Row,
                        m('.uk-button-group',
                            m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Lessons'; } }, "Lessons"),
                            m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Meditations'; } }, "Meditations"),
                            m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Games'; } }, "Games"),
                        )),
                    m(ContentAdd),
                    m(Path)
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

    return {
        oninit: (vnode) => {
            getContent(filter.stagenumber).then((res) => {
                content = res;
                filteredcontent = content.filter((item) => item.type == 'lesson' || item.type == 'meditation')
            })

            getStages().then((res) => {
                stages = res;
                stages.sort((a, b) => a.stagenumber - b.stagenumber)
            });

            getUsers().then((res) => {
                users = res;
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
                                    if(e.target.value == 'none' ){
                                        getContent(e.target.value).then((res) => {
                                            content = res;
                                            filter.type == 'meditations' ?
                                            filteredcontent = content.filter((item) => item.type == 'meditation-practice') :
                                            filter.type == 'lessons' ?
                                            filteredcontent = content.filter((item) => item.type == 'lesson' || item.type == 'meditation') :
                                            filteredcontent = content.filter((item) => item.type == 'meditation-game') 
                                        });
                                        console.log('getting no content')
                                    }else{
                                        getContent(Number(e.target.value)).then((res) => {
                                            content = res;
                                            filter.type == 'meditations' ?
                                            filteredcontent = content.filter((item) => item.type == 'meditation-practice') :
                                            filter.type == 'lessons' ?
                                            filteredcontent = content.filter((item) => item.type == 'lesson' || item.type == 'meditation') :
                                            filter.type == 'games' ?
                                            filteredcontent = content.filter((item) => item.type == 'meditation-game') :
                                            console.log('EERROR',filter.type, filteredcontent)
                                            m.redraw();
                                        })
                                    }
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
                                    filter.type == 'meditations' ?
                                        filteredcontent = content.filter((item) => item.type == 'meditation-practice') :
                                        filter.type == 'lessons' ?
                                            filteredcontent = content.filter((item) => item.type == 'lesson' || item.type == 'meditation') :
                                            filter.type == 'games' ?
                                                filteredcontent = content.filter((item) => item.type == 'meditation-game') :
                                                null

                                
                                                console.log(filter.type, filteredcontent)
                                }
                            },
                            ['lessons', 'stage', 'meditations', 'games', 'users']
                        )
                    ),
                    m(Column, { width: '3-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Add Content"),
                        m(AddLesson),
                        m(AddMeditation),
                        m(AddStage),
                        m(AddGame),
                        m(AddVersion)
                    ),
                    filter.type == 'stage' ?
                        m(PathView) :
                    filter.type == 'users' ?
                        m(UsersView):
                        m(ContentView, { content: filteredcontent })

                )
            )
        }
    }
}

function EditContent() {
    let content = {}
    let editar = false;
    let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    let types = [];


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
                    m(Column, {width:'1-1'}, 
                        m("strong", "Before meditation")
                    ),    
                    //CONTENT NO ES UN BUEN NOMBRE!!! :(
                    content.content ? 
                        Object.keys(content.content).map((key) => {
                            return m(Column, { width: '1-4' },
                                m(MeditationSlide, { data: content['content'], name: key, })
                            )
                        })
                        : 
                        null,
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
                    content.followalong ? [
                        m(Column, {width:'1-1'}, m("strong","During meditation")),
                        Object.keys(content.followalong).map((key) => {
                            return m(Column, { width: '1-4' },
                                m(MeditationSlide, { data:content['followalong'],name:key})
                            )
                        })
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
                console.log('game content')
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
                content.type == 'meditation-practice' ?
                    types = ['meditation-practice'] : 
                    content.type != 'meditation-game' ? 
                    types = ['lesson', 'meditation'] : types = ['game']
                console.log(content)
                m.redraw()
            })
        },
        view: (vnode) => {
            return content.title ?
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
                            ),
                            m("button.uk-button.uk-button-secondary",
                                {
                                    style: "margin-top:15px",
                                    onclick: (e) => { updateContent(content); editar = false; }
                                },
                                "SAVE"),
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

                        m(Column, { width: '1-3' },
                            !editar ? m(".uk-text-lead", content.description) : [
                                m(".uk-text-bold", "Description"),
                                m(TextField, { type: "input", data: content, name: "description", width: '1-2' })],
                        ),
                        m(Column, { width: '1-3' },
                            m(".uk-text-bold", 'Stage'),
                            m(Select, { data: content, name: 'stagenumber', onchange: (e) => content.stagenumber = Number(lesson.stagenumber) }, stages)
                        ),

                        m(Column, { width: '1-3' },
                            m(".uk-text-bold", 'Type'),
                            m(Select, { data: content, name: 'type' }, types),
                            content.type == 'meditation-practice' ? [ 
                                m(".uk-text-bold"," Minimum duration"),
                                m(TextField,{type:'input',data:content,name:'duration'})
                            ]: null,
                        ),

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
                        
                        content.type == 'meditation-practice' ? 
                        m(MeditationContent) :
                        content.type =='meditation-game' ? 
                        m(GameContent) :
                        m(LessonContent),                        
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
            getContent(1).then((res) => {
                content = res;
                m.redraw();
                console.log(content)
            })
        },
        view: (vnode) => {
            return m(Grid,
                {
                    center: true
                },
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
                {

                },

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

    return {
        oninit:(vnode) => {
            getUser(vnode.attrs.cod).then((usr) => {
                user = usr
                console.log(user)
                loaded = true
                m.redraw()
            })

            getRequests().then((res) => {
                console.log(res)
                issues = res.filter((item)  => item.type =='issue')
                suggestions = res.filter((item) => item.type =='suggestion')
            })
        },
        view:(vnode) => {
            return  m(Padding,
            loaded ?  m(Grid, {
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
                    m(Button, {type:"danger",style:"width:100%;margin:10px auto"}, "LOG OUT")
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
                                )
                            ),    
                        ),
                        showing == 'data' ? 
                        m(UserData) :
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

    "/editlesson/:cod": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditContent)
        },
    },

    "/editmeditation/:cod": {
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
    }

})
