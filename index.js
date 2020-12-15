import { getLessons, getLesson, updateLesson, getMeditations, addLesson, addMeditation, getImages } from './server.js'

import { TextField, SlideView, FileUploader, Grid, Row, Column, Card, CardMedia, CardBody, Button } from './util.js'

import { v1} from 'uuid';


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
    // lista con la forma 'id': lesson
    let lessons = [];

    //modal for adding lessons
    function AddLesson() {

        let text = []
        let json = {
            'codlesson': '',
            'title': '',
            'description': '',
            'image': '',
            'text': text
        };

        let step = 1;
        let stages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

        let slidenumber = 1;

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
                            m("button.uk-modal-close-default", { 'uk-close': '' }),
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
                                            m(Column, { width: '1-2' },
                                                m("label.uk-form-label", "Slider"),
                                                !json["slider"] ? m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById('file-picker').click() } }, "Choose Image")
                                                    : m("img", { src: json["slider"] })
                                                ,
                                                m(FileUploader, { data: json, name: "slider", id: 'file-picker' })
                                            ),
                                            m(Column, { width: '1-2' },
                                                m("label.uk-form-label", "Stagenumber"),
                                                //será un select
                                                m("select.uk-select",
                                                    { onchange: (e) => json.stagenumber = e.target.value },
                                                    stages.map((stage) => {
                                                        return m("option", stage)
                                                    })
                                                )
                                            ),
                                            m(Row,
                                                m("label.uk-form-label", "Preceding lesson"),
                                                m("select.uk-select",
                                                    { onchange: (e) => json.precedinglesson = e.target.value },
                                                    m("option", "none"),
                                                    lessons.map((lesson) => {
                                                        return m("option", { value: lesson.codlesson }, lesson.title)
                                                    })
                                                )
                                            )
                                        )
                                    ]
                                    :
                                    [
                                        m("p", { style: "text-align:center" }, "Write the lesson content"),

                                        m(Grid,
                                            text.length > 0 ?
                                                text.map((item, index) => {
                                                    return m(Column, { width: '1-3' },
                                                        m(Card,
                                                            { size: "small" },
                                                            m(CardMedia,
                                                                m("img", { src: item.image, onclick: (e) => document.getElementById('text-slider-'+ index).click() }),
                                                                m(FileUploader, {data: text[index], name: "image", id: "text-slider-" + index  })
                                                            ),
                                                            m(CardBody,
                                                                m(TextField, { data: text[index], name: "text", type: "textarea", rows: "6" }),
                                                                m("div", { style: "position:absolute;right:5;top:5" },
                                                                    m("a", { 'uk-icon': 'icon:trash', style: "color:red", onclick: (e) => text.splice(index, 1) })
                                                                )
                                                            )
                                                        )
                                                    )
                                                }) : null,
                                            m(Column,
                                                {
                                                    width: '1-3',
                                                    style: "cursor:pointer",
                                                    'uk-icon': 'icon:plus',
                                                    onclick: (e) => {
                                                        text.push({ 'text': "Edit this text", 'image': "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg" });
                                                        m.redraw()
                                                        console.log(text);
                                                    }
                                                }
                                            )
                                        )
                                    ]
                            ),
                            m(".uk-modal-footer.uk-text-right",
                                step > 1 ? m("button.uk-button.uk-button-default", { onclick: (e) => { step = 1 } }, "Back") : null,
                                m("button.uk-button.uk-button-primary",
                                    {
                                        onclick: (e) => {
                                            if (step == 1) { step++ }
                                            else {
                                                json.codlesson = v1();
                                                console.log(json);
                                                addLesson(json)
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

    function AddImage() {
        let images = [];
        let imagetoadd = {};
        let selectedindex ;

        return {
            oninit: (vnode) => {
                getImages().then((res) => { images = res; m.redraw() });
            },
            view: (vnode) => {
                //podemos añadirle un loading
                return [
                    m(Button,
                        {
                            target: '#modal-images',
                            type: "secondary"
                        }, "Upload images"),
                    m("div",
                        {
                            'uk-modal': '',
                            class: 'uk-modal-container',
                            id: "modal-images"
                        },
                        m(".uk-modal-dialog.uk-margin-auto-vertical",
                            m("button.uk-modal-close-default", { 'uk-close': '' }),
                            m(".uk-modal-body",
                                m(Grid, [
                                    m(Column, { width: '1-1' },
                                        m("button.uk-button.uk-button-default", { onclick: () => { document.getElementById('file-chooser').click() } }, "Choose Image"),
                                        m(FileUploader, { data: imagetoadd, name: "src", id: 'file-chooser', onsuccess:(src) => {images.push(src)} }),
                                        m(Button,{onclick: (e) => console.log('deleting ' + images[selectedindex]) }, "Delete")
                                    ),
                                    m(Column, {width: '1-1'},
                                        images.length > 0 ?
                                            m(Grid,
                                                images.map((src, index) => {
                                                    return m(Column, { width: '1-3' },
                                                        m("img", { src: src, onclick: (e) => selectedindex = index, style: selectedindex == index ? 'border: 1px solid lightblue' : ''})
                                                    )
                                                })
                                            ) : null
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

   
    function AddMeditation() {
        return {
            view: (vnode)=> {
                return m(Button, "Add meditation")
            }
        }

    }


    return {
        oninit: (vnode) => {
            getLessons(1).then((res) => {
                lessons = res;
                console.log(lessons)
                m.redraw();
            });
        },
        view: (vnode) => {
            return m("div.uk-grid-match.",
                {
                    'uk-grid': '',
                    class: 'uk-grid-medium uk-grid-column-medium uk-grid-row-small uk-flex-center'
                },

                m(Row,
                    m(Column, { width: '1-4' },
                        m(AddLesson),
                    ),
                    m(Column, { width: '1-4' },
                        m(AddImage)
                    ),
                    m(Column, { width: '1-4' },
                        m(AddMeditation)
                    )
                ),

                lessons.length > 0 ?
                    lessons.map((lesson) => {
                        return m("div.uk-width-1-4@m",
                            m(".uk-card.uk-card-default",
                                lesson.slider ? m("uk-card-media-top",
                                    m("img", { src: lesson.slider })
                                ) : null,
                                m(".uk-card-body",
                                    m("h4.uk-card-title", lesson.title),
                                    m("p", lesson.description)
                                ),
                                m(".uk-card-footer",
                                    m("a.uk-button.uk-button-text",
                                        { onclick: (e) => m.route.set('/edit/' + lesson.codlesson) }
                                        , "Edit")
                                )
                            )
                        )
                    }) :
                    null
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
                    m(".uk-grid-small",
                        {
                            'uk-grid': '',
                            class: 'uk-grid-medium uk-child-width-1-4@s uk-grid-column-medium uk-grid-row-small uk-flex-center'
                        },
                        Object.keys(lesson.text).map((key) => {
                            return m("div",
                                m(".uk-card.uk-card-default",
                                    m(".uk-card-media-top",
                                        m("img", { src: lesson.text[key].image })
                                    ),
                                    m("uk-card-body",
                                        !editar ?
                                            m("p", lesson.text[key].text) :
                                            m(TextField, { type: "textarea", rows: "6", data: lesson.text[key], name: "text" })
                                    )
                                )
                            )
                        }),
                        editar ? m("a.uk-width-1-4@m",
                            {
                                'uk-icon': 'icon:plus',
                                onclick: (e) => {
                                    if (typeof lesson.text == 'object') {
                                        lesson.text[Object.keys(lesson.text).length + 1] = { 'text': "Edit this text and image", 'image': "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg" }
                                    } else {
                                        lesson.text.push({ 'text': "Edit this text", 'image': "https://cdn.maikoapp.com/3d4b/4qgko/p200.jpg" })
                                    }
                                }
                            }
                        ) : null,

                        editar ? m(".uk-width-1-1",
                            m(".uk-width-1-4",
                                m("button.uk-button.uk-button-secondary",
                                    {
                                        onclick: (e) => { updateLesson(lesson); editar = false; }
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

    "/edit/:codlesson": {
        render: function (vnode) {
            return m(Layout, vnode.attrs, EditLesson)
        },
    }
})
