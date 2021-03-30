import { getLessons, getLesson, addLesson, addMeditation, getImages, getStage, updateStage, deleteImage, getContent, getStages, addStage, getContentbycod, updateContent, loginWithFacebook, loginWithGoogle } from './server.js'
import { FileUploader, create_UUID } from './util.js'
import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, CardHeader, Container, ModalHeader, Form, FormLabel, ModalFooter } from './components.js'
import { LessonSlide, MeditationSlide, ImagePicker } from './tenstage-components.js'


let primarycolor = '#E0D5B6'


function Layout() {
    let route = 'home'

    function LoginModal() {
        let data = {};

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
                            m(TextField, { data: data, name: "username", type: "input" })
                        )
                    ),
                    m(ModalFooter,
                        m("uk-text-left",
                            m(".uk-icon-button", { 'uk-icon': 'facebook', onclick: (e) => loginWithFacebook() }),
                            m(".uk-icon-button", { 'uk-icon': 'google', onclick: (e) => loginWithGoogle() })
                        ),
                        m(Button, { style: "float:right" }, "Login")
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
                    return m(Container, { size: "medium", style: "flex:2"}, m(child, vnode.attrs))
                }),

                m("footer",{style:"width:100%;background-color:black;min-height:100px;"},"Footer")

            ]
        }
    }
}

function ContentManagement() {
    // lista con la forma 'id': lesson. TEndrá que ser CONTENT !!!
    let lessons = [];
    let filter = { 'stagenumber': 1, 'type': 'lessons' }
    let stages = []
    let stagenumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    let content = [];

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
                                                addLesson(json);
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
                                            addLesson(json);
                                            document.getElementById('closemodalmed').click();
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
    //para ver meditaciones y lecciones
    function ContentView() {
        return {
            view: () => {
                return content.length > 0 ?
                    content.map((content) => {
                        if (filter.type == 'meditations' && content.type == 'meditation-practice' || (content.type == "lesson" || content.type == "meditation") && filter.type != 'meditations') {
                            return m("div.uk-width-1-4@m",
                                m(".uk-card.uk-card-default",
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
                        }
                    }) :
                    null

            }
        }

    }

    function PathView() {
        let stage = { 'objectives': {}, 'meditations': {} };
        let toadd = {}

        let position = { 'selected': 0 }
        let path_filter = 'Lessons'

        let edit = false;

        function StageHeader() {
            return {
                view: (vnode) => {
                    return m(Card,
                        m(CardHeader,
                            ' Stage ' + filter.stagenumber,
                            m("a",
                                {
                                    'uk-icon': 'icon:file-edit',
                                    onclick: (e) => edit = !edit
                                }
                            ),
                            m(Button, { width: '1-4', style: "margin-left:5px", type: "primary", onclick: (e) => updateStage(stage) }, "Save"),
                        ),
                        m(CardBody,
                            m(Grid,
                                m(Column, { width: '1-2' },
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
                                        ]
                                ),
                                m(Column, { width: '1-2' },
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
                                    )
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
                            content.filter((elem) => elem.position == null).map((cont) => {
                                if (path_filter == 'Lessons' && cont.type != 'meditation-practice' || path_filter != 'Lessons' && cont.type == 'meditation-practice') {
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
                                                                if (path_filter == 'Lessons') {
                                                                    toadd.position = Number(position.selected);
                                                                    //stage.path[position.selected] ? stage.path[position.selected].push(toadd) : stage.path[position.selected] = [toadd]
                                                                } else {
                                                                    toadd.position = Number(position.selected);
                                                                    stage.meditations[position.selected] ? stage.meditations[position.selected].push(toadd) : stage.meditations[position.selected] = [toadd]
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
                            })
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
                        content.filter((elem) => elem.position != null).sort((a, b) => a.position - b.position).map((cont) => {
                            if (path_filter == 'Meditations' && cont.type == 'meditation-practice' || path_filter == 'Lessons' && cont.type != 'meditation-practice')
                                return m(Grid,
                                    m(Column, { width: '1-3' },
                                        m(Card,
                                            m(CardBody,
                                                m("label", cont.title),
                                                m(Button, {
                                                    type: "danger",
                                                    style: "margin-top:3px",
                                                    onclick: (e) => { cont.position = null; updateContent(cont); }
                                                }, "Remove")
                                            ),
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

                return [
                    m(Row,
                        m(StageHeader)
                    ),
                    m(Row,
                        m('.uk-button-group',
                            m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Lessons'; } }, "Lessons"),
                            m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Meditations'; } }, "Meditations")
                        )),
                    m(ContentAdd),
                    m(Path)
                ]
            }
        }

    }

    return {
        oninit: (vnode) => {
            getContent(filter.stagenumber).then((res) => {
                content = res;
            })

            getStages().then((res) => {
                stages = res;
                stages.sort((a, b) => a.stagenumber - b.stagenumber)
            });
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
                                    getContent(Number(e.target.value)).then((res) => {
                                        content = res;
                                        m.redraw();
                                    })
                                }
                            },
                            stages.map((stage) => stage.stagenumber)
                        )
                    ),
                    m(Column, { width: '1-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Showing"),
                        m(Select,
                            {
                                data: filter,
                                name: "type"
                            },
                            ['lessons', 'stage', 'meditations']
                        )
                    ),
                    m(Column, { width: '3-5' },
                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Add Content"),
                        m(AddLesson),
                        m(AddMeditation),
                        m(AddStage)
                    ),
                    filter.type == 'stage' ?
                        m(PathView) :
                        m(ContentView)

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


    return {
        oninit: (vnode) => {
            getContentbycod(vnode.attrs.cod).then((res) => {
                content = res;
                content.type == 'meditation-practice' ?
                    types = ['meditation-practice', 'game'] :
                    types = ['lesson', 'meditation']
                console.log(content)
                m.redraw()
            })
        },
        view: (vnode) => {
            return content.title ?
                m("article.uk-article",
                    m("h1.uk-article-title",
                        !editar ? content.title : m(TextField, { type: "input", data: content, name: "title" }),
                        !editar ? m("a", { 'uk-icon': 'icon:file-edit', onclick: () => editar = !editar }) : [
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
                            m(Select, { data: content, name: 'type' }, types)
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

                        content.text ? content.text.map((item, i) => {
                            return m(Column, { width: "1-4" },
                                m(LessonSlide, { data: content.text, index: i, item: item })
                            )
                        }) : Object.keys(content.content).map((key) => {
                            return m(Column, { width: '1-4' },
                                m(MeditationSlide, { data: content['content'], name: key, })
                            )
                        }),

                        editar ? m("a.uk-width-1-4@m",
                            {
                                'uk-icon': 'icon:plus',
                                onclick: (e) => {
                                    content.type == 'meditation-practice' || content.type == 'game' ?
                                        content.content[Object.keys(content.content).length] = { 'text': 'Edit this text', 'type': 'text' }
                                        : [
                                            content.text = [],
                                            content.text.push({ 'text': "Edit this text", 'image': "" })
                                        ]
                                }
                            }
                        ) : null
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
                    content.filter((cont) => (cont.type == vnode.attrs.type[0] || cont.type == vnode.attrs.type[1]) && cont.position != null).sort((a,b)=> a.position - b.position).map((content) => {
                        return m(Column,
                            { width: '1-5' },
                            m(Card,
                                {
                                    hover:true,
                                    style:"cursor:pointer;",
                                    onclick:(e)=> {m.route.set('/contentview/' + content.cod)}
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

                



            )
        }
    }
}

function ContentView() {
    let content = {}
    return {
        oninit:(vnode) => {
            getContentbycod(vnode.attrs.cod).then((res) => {
                content = res;
                console.log(content)
                m.redraw()
            })
        },
        view:(vnode) => {
            return m(Grid, 
                {

                },
              
                m(Column,
                    {
                        width:'1-2'
                    },
                    m("div",{style:"font-family:Gotham Rounded; font-size:2em"},content.title),
                ),
                m(Column ,
                    {
                        width:'1-2'
                    },
                    m("img",{style:"width:100%;height:auto",src:content.image})
                )
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

    '/contentview/:cod':{
        render:(vnode) => {
            return m(Layout, vnode.attrs, ContentView)
        }
    }

})
