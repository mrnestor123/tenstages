import { getLessons, getLesson, addLesson, addMeditation, getImages, getStage, updateStage, deleteImage, getContent, getStages, addStage, getContentbycod, updateContent } from './server.js'
import { FileUploader, create_UUID } from './util.js'
import { TextField, Grid, Row, Column, Card, CardMedia, CardBody, Button, Select, Section, Padding, CardBadge, Modal, ModalBody, CardFooter, CardHeader } from './components.js'
import { LessonSlide, MeditationSlide, ImagePicker } from './tenstage-components.js'


function Layout() {
    return {
        view: (vnode) => {
            return [
                m("nav.uk-navbar-container", { 'uk-navbar': '' },
                    m(".uk.navbar-left",
                        m("ul.uk-navbar-nav",
                            m("li", m("a", "Home screen")),
                            m("li.uk-active",
                                { onclick: (e) => m.route.set('/') },
                                m("a", "Content"))
                        )
                    ),
                    m(".uk.navbar-right")
                ),
                vnode.children.map((child) => {
                    return m(".uk-container.uk-container-medium", m(child, vnode.attrs))
                }),
            ]
        }
    }
}

function ContentManagement() {
    // lista con la forma 'id': lesson. TEndrá que ser CONTENT !!!
    let lessons = [];
    let filter = { 'stagenumber': 1 }
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
                        "Add lesson"),
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


        function SwitchType() {
            let types = {
                'image': () => m(Image),
                'text': () => m(Text, { type: "text" }),
                'title': () => m(Text, { type: "title" })
            }
            let editing = true
            let object = {}

            function Text() {
                return {
                    view: (vnode) => {
                        return editing ? m(TextField, { data: object, name: vnode.attrs.type, type: "textarea", rows: "3" }) : null
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
                            m(ImagePicker, { data: object, stagenumber: json.stagenumber, name: "image", id: `medit-image${id}` })
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
                                console.log(key)
                                return types[key]()
                            })
                        )
                    )
                }
            }

        }

        return {
            view: (vnode) => {
                return [
                    m(Button,
                        {
                            'target': '#modal-meditation',
                        },
                        "Add Meditation"),
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
                        "Add Stage"),
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
                            m(Button, { width: '1-2', type: "primary", onclick: (e) => updateStage(stage) }, "Save"),
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
                                    m("strong", "Objectives"),
                                    m("p", "Streak"),
                                    m(TextField, { data: stage['objectives'], name: "streak", type: "number" }),
                                    m("p", "Total time"),
                                    m(TextField, { data: stage['objectives'], name: "totaltime", type: "number" }),
                                    m("p", "Meditations"),
                                    m(TextField, { data: stage['objectives']['meditation'], name: "time", type: "number", placeholder: "time" }),
                                    m(TextField, { data: stage['objectives']['meditation'], name: "count", type: "number", placeholder: "count" })
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
                                                        }, Array.from(new Array(Object.keys(stage.path).length + 1).keys())),
                                                        m(Button, {
                                                            style: "margin-top:10px",
                                                            class: "uk-modal-close",
                                                            type: "primary",
                                                            onclick: (e) => {
                                                                if (path_filter == 'Lessons') {
                                                                    toadd.position = position.selected;
                                                                    stage.path[position.selected] ? stage.path[position.selected].push(toadd) : stage.path[position.selected] = [toadd]
                                                                } else {
                                                                    toadd.position = position.selected;
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
                            return m(Grid,
                                m(Column, { width: '1-3' },
                                    m(Card,
                                        m(CardBody,
                                            m("label", cont.title),
                                            m(Button, {
                                                type: "danger",
                                                style: "margin-top:3px",
                                                onclick: (e) => { cont.position = null; updateContent(cont);}
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
                    m(Column, { width: '1-1' },
                        m(StageHeader)
                    ),
                    m('.uk-button-group',
                        m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Lessons'; } }, "Lessons"),
                        m(Button, { type: "secondary", onclick: (e) => { path_filter = 'Meditations'; } }, "Meditations")
                    ),
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
                        match: true
                    },
                    m(Row,
                        m(Grid,
                            m(Column, { width: '1-3' },
                                m(Grid,
                                    m(Column, { width: '1-2' },
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
                                    m(Column, { width: '1-2' },
                                        m(".uk-text-bold", { style: "margin-bottom:0px;" }, "Showing"),
                                        m(Select,
                                            {
                                                data: filter,
                                                name: "type"
                                            },
                                            ['lessons', 'stage', 'meditations']
                                        )
                                    )
                                )
                            ),
                            m(Column, { width: '2-3' },
                                m(AddLesson),
                                m(AddMeditation),
                                m(AddStage)
                            ),
                        )
                    ),

                    m(Grid,
                        filter.type == 'stage' ?
                            m(PathView) :
                            m(ContentView)
                    )
                )
            )
        }
    }
}

function EditLesson() {
    let lesson;
    let editar = false;

    return {
        oninit: (vnode) => {
            getLesson(vnode.attrs.codlesson).then((res) => {
                lesson = res;
                console.log(lesson)
                m.redraw()
            })
        },
        view: (vnode) => {
            return lesson != null ?
                m("article.uk-article",
                    m("h1.uk-article-title",
                        !editar ? lesson.title : m(TextField, { type: "input", data: lesson, name: "title" }),
                        !editar ? m("a", { 'uk-icon': 'icon:file-edit', onclick: () => editar = !editar }) : null
                    ),
                    m("p.uk-article-meta", "Id:" + lesson.codlesson),
                    m("p.uk-text-lead", !editar ? lesson.description : m(TextField, { type: "input", data: lesson, name: "description" })),
                    m(Grid,
                        {
                            size: "medium",
                            match: true,
                            center: true
                        },
                        lesson.slider ?
                            m(Column, { width: "1-4" },
                                m(Card,
                                    m(CardMedia,
                                        m("img", { src: lesson.slider })
                                    ),
                                    m(CardBody,
                                        m(".uk-text-bold", lesson.title.toUpperCase())
                                    )
                                )

                            ) : null,

                        lesson.text ? lesson.text.map((item, i) => {
                            return m(Column, { width: "1-4" },
                                m(LessonSlide, { data: lesson.text, index: i, item: item })
                            )
                        }) : null,
                        editar ? m("a.uk-width-1-4@m",
                            {
                                'uk-icon': 'icon:plus',
                                onclick: (e) => {
                                    if (!lesson.text) {
                                        lesson.text = []
                                    }
                                    lesson.text.push({ 'text': "Edit this text", 'image': "" })
                                }
                            }
                        ) : null,

                        editar ? m(".uk-width-1-1",
                            m(".uk-width-1-4",
                                m("button.uk-button.uk-button-secondary",
                                    {
                                        onclick: (e) => { updateContent(lesson); editar = false; }
                                    },
                                    "SAVE")
                            ),
                            m(".uk-width-1-4",
                                m("button.uk-button.uk-button-default", { onclick: (e) => { editar = false; location.reload() } }, "CANCEL")
                            )
                        ) : null
                    )
                ) :
                null
        },
    }

}

function EditMeditation() {
    let meditation = {};
    let editar = false;

    return {
        oninit: (vnode) => {
            getContentbycod(vnode.attrs.codmed).then((res) => {
                meditation = res;
                console.log(meditation)
                m.redraw()
            })
        },
        view: (vnode) => {
            return meditation.title ?
                m("article.uk-article",
                    m("h1.uk-article-title",
                        !editar ? meditation.title : m(TextField, { type: "input", data: meditation, name: "title" }),
                        !editar ? m("a", { 'uk-icon': 'icon:file-edit', onclick: () => editar = !editar }) : null
                    ),
                    m("p.uk-article-meta", "Id:" + meditation.cod),
                    m("p.uk-text-lead", !editar ? meditation.description : m(TextField, { type: "input", data: meditation, name: "description" })),
                    m(Grid,
                        {
                            size: "medium",
                            center: true
                        },

                        Object.values(meditation.content).length > 0 ?
                            Object.keys(meditation.content).map((key) => {
                                console.log(meditation['content'][key])
                                return m(Column, { width: '1-3' },
                                    m(MeditationSlide, { data: meditation['content'], name: key, })
                                )
                            }) : null,


                        editar ? m("a.uk-width-1-4@m",
                            {
                                'uk-icon': 'icon:plus',
                                onclick: (e) => {
                                    if (!meditation.text) {
                                        lesson.text = []
                                    }
                                    lesson.text.push({ 'text': "Edit this text", 'image': "" })
                                }
                            }
                        ) : null,

                        editar ? m(".uk-width-1-1",
                            m(".uk-width-1-4",
                                m("button.uk-button.uk-button-secondary",
                                    {
                                        onclick: (e) => { updateContent(meditation); editar = false; }
                                    },
                                    "SAVE")
                            ),
                            m(".uk-width-1-4",
                                m("button.uk-button.uk-button-default", { onclick: (e) => { editar = false; location.reload() } }, "CANCEL")
                            )
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

m.route(document.body, "/", {
    "/": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, ContentManagement)
        },
    },

    "/editlesson/:codlesson": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditLesson)
        },
    },

    "/editmeditation/:codmed": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditMeditation)
        },
    }
})
